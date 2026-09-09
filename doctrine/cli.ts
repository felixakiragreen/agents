#!/usr/bin/env bun
// `doctrine` — the CLI arm of the Standards Office's reader.
//
//   doctrine boot <root>                                  the boot pack — a cold session's orient
//   doctrine lint [--live] [--verbose] [--json] <path…>   walk and report; non-zero on any fail
//   doctrine statement [--json] <path…>                   every ⬡ go on a live surface (D82)
//   doctrine parse --json <building>                      one building, P3 §5's shapes
//   doctrine buildings [--json]                           the building register, walked
//   doctrine migrate [--write] <building>                 re-emit in the current grammar
//   doctrine citations [--write] <building>               respell citations of killed D-ids

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join, relative, resolve } from 'path';
import { citationTargets, diffRun, renderHomes, respellBuilding, writeRun } from './src/citations';
import { execSync } from 'child_process';
import { bootPack } from './src/boot';
import { discover, parse } from './src/building';
import { byInterest, renderStatement } from './src/credit';
import { guardRegressions, lint, render } from './src/lint';
import { REGISTER, walkRegister } from './src/register';
import { diff, migrate, roundTrip, write } from './src/migrate';
import { collisions, renderTable, tableFromText } from './src/respell';

const USAGE = `doctrine — the reference reader for the work doctrine (canon/work/DOCTRINE.md)

  doctrine boot <root>
      The boot pack (044; DOCTRINE §11's Start): what a cold session needs to orient — the
      board's live rows, the ledger tail, the baton, the decision queue, the inbox, the
      statement and the lint line. Derived from the building's books at every call and never
      kept, and nothing in it is authored: every line that is not a count is a byte from a
      file. Exactly one root ("." legal); the building at that root, never its sub-buildings.
      Exits 2 when the root is no building.

  doctrine lint [--live] [--vocab] [--verbose] [--json] [--guard <git-ref>] <path…>
      Walk every building under <path…> and report each failure class with file:line and
      the verbatim offending excerpt. Exits 1 if anything failed.
      --live         only the surfaces read today: boards, ledger tails, open work docs' kickoffs
      --vocab        also lint SPEECH on law surfaces (026): the standard's graveyard (§9), its
                     spelling lexicon and pinned formulas (§8), its id namespace (§7). History
                     and voice are fenced by construction. Off by default — the form arms are
                     the doc's honesty; the vocabulary arm is the city's respell backlog.
      --verbose      every excerpt, not the first three per class
      --json         the whole report as JSON
      --guard <ref>  also lint the same paths at <ref> (one git repo) and fail loudly on any
                     DECREASE in the entity totals — the silence family's mechanical net.
                     Intentional deletions override by running without the flag, visibly.

  doctrine statement [--json] <path…>
      The statement (D82): every "⬡ go ‹date›" on a live surface — a board's OPEN / IN FLIGHT /
      LANDED rows, the decision register, the ledger tail — with its interest, the count of
      charges whose Depends-on chain reaches the marked charge and which have since LANDED.
      Derived from the board's graph at every call, never kept. Sorted by interest, descending.

  doctrine parse --json <building>
      Emit one building's parsed shapes (Building, BoardRow, LedgerEntry, Baton,
      Decision, Kickoff, Issue, Credit).

  doctrine buildings [--json]
      The building register (canon/BUILDINGS.md, D79) walked: every row — Name · Kind ·
      Root — with each "building" row's roots walked for books and each "host" row
      listed only. --json emits the rows plus each building's parse: the machine surface.
      Exits 1 on a defect in the building register (a malformed row, a dead Root).

  doctrine migrate [--write] [--table <file>] <building>
      --table <file>  a hand-given id table, one "OLD → NEW" per line, where the board's own
                     derivation collides (two campaign letters sharing numbers — simmy D18)
      Form-only re-emission in the current grammar, across every tracked text file the
      building keeps. Prints the id respell table (D80, derived from the building's own
      board) first, then the diff and the round-trip verdict per file; --write is required
      to touch a single byte on disk.

  doctrine citations [--write] <building>
      The citation respell (043, DOCTRINE §8's purge clause): on the canon repo's live law
      surfaces, a citation of a killed register entry names the home that now carries the
      law, and strips where it stands in that home. Prints the hand-kept home table first,
      then the diff, then the census — every bare D-id still standing, the table's own
      separated from the rest. A citation the shapes do not consume is a HAND edit: the run
      lists it and refuses to guess. --write is required to touch a byte.`;

const argv = process.argv.slice(2);
const flag = (f: string) => argv.includes(f);
const guardAt = argv.indexOf('--guard');
const guardRef = guardAt >= 0 ? argv[guardAt + 1] ?? null : null;
if (guardAt >= 0 && !guardRef) { console.error('doctrine lint: --guard needs a git ref.'); process.exit(2); }
const tableAt = argv.indexOf('--table');
const tableFile = tableAt >= 0 ? argv[tableAt + 1] ?? null : null;
if (tableAt >= 0 && !tableFile) { console.error('doctrine migrate: --table needs a file.'); process.exit(2); }
const positional = argv.filter((a, i) => !a.startsWith('-') && (guardAt < 0 || i !== guardAt + 1) && (tableAt < 0 || i !== tableAt + 1));
const paths = positional.slice(1);
const cmd = positional[0] ?? '';

function die(msg: string): never { console.error(msg); process.exit(2); }

if (!cmd || flag('--help') || flag('-h')) { console.log(USAGE); process.exit(cmd ? 0 : 2); }

if (cmd === 'boot') {
	if (paths.length !== 1) die('doctrine boot: exactly one root per call.');
	const root = paths[0]!;
	if (!existsSync(root)) die(`doctrine boot: ${root} does not exist.`);
	try { console.log(bootPack(root)); }
	catch (e) { die(`doctrine boot: ${root} — ${(e as Error).message}`); }
	process.exit(0);
}

if (cmd === 'lint') {
	if (!paths.length) die('doctrine lint: give me at least one path to walk.');
	for (const p of paths) if (!existsSync(p)) die(`doctrine lint: ${p} does not exist.`);
	const report = lint(paths, { live: flag('--live'), vocab: flag('--vocab') });
	if (flag('--json')) console.log(JSON.stringify({ totals: report.totals, fails: report.fails }, null, 2));
	else console.log(render(report, { verbose: flag('--verbose') }));

	if (guardRef) {
		// one repo, materialized read-only via `git archive` — no index, no worktree bookkeeping
		const roots = new Set(paths.map(p =>
			execSync('git rev-parse --show-toplevel', { cwd: resolve(p), encoding: 'utf8' }).trim()));
		if (roots.size !== 1) die(`doctrine lint --guard: the paths span ${roots.size} git repos — guard one repo per run.`);
		const root = [...roots][0]!;
		const tmp = mkdtempSync(join(tmpdir(), 'doctrine-guard-'));
		try {
			execSync(`git archive ${guardRef} | tar -x -C ${JSON.stringify(tmp)}`, { cwd: root, shell: '/bin/sh' });
			const refPaths = paths.map(p => join(tmp, relative(root, resolve(p)))).filter(existsSync);
			const ref = lint(refPaths, { live: flag('--live'), vocab: flag('--vocab') });
			const lost = guardRegressions(ref.totals, report.totals);
			if (lost.length) {
				console.error(`\n!! GUARD (${guardRef}): entity counts DECREASED — silent damage until proven deliberate:`);
				for (const l of lost) console.error(`   ${l}`);
				console.error('   An intentional deletion overrides by running without --guard, visibly.');
				process.exit(1);
			}
			console.log(`\nguard ok — no entity total decreased vs ${guardRef}`);
		} finally { rmSync(tmp, { recursive: true, force: true }); }
	}
	// Warnings are reported, never enforced (§7's own word) — only failures move the exit code.
	process.exit(report.fails.some(f => f.severity === 'fail') ? 1 : 0);
}

if (cmd === 'statement') {
	if (!paths.length) die('doctrine statement: give me at least one path to walk.');
	for (const p of paths) if (!existsSync(p)) die(`doctrine statement: ${p} does not exist.`);
	const credits = discover(paths).flatMap(b => b.credits);
	if (flag('--json')) console.log(JSON.stringify([...credits].sort(byInterest), null, 2));
	else console.log(renderStatement(credits, paths.join(' ')));
	process.exit(0);
}

if (cmd === 'parse') {
	if (paths.length !== 1) die('doctrine parse: exactly one building path per call.');
	console.log(JSON.stringify(parse(paths[0]!), null, 2));
	process.exit(0);
}

if (cmd === 'buildings') {
	const { entries, fails } = walkRegister();
	if (flag('--json')) console.log(JSON.stringify({ entries, fails }, null, 2));
	else {
		const tilde = (p: string) => p.replace(process.env.HOME + '/', '~/');
		const pad = Math.max(...entries.map(e => e.name.length));
		console.log(`the building register — ${tilde(REGISTER)} (D79)\n`);
		for (const e of entries) {
			const rows = e.buildings.reduce((a, b) => a + b.board.reduce((n, x) => n + x.rows.length, 0), 0);
			console.log(`  ${e.name.padEnd(pad)}  ${e.kind.padEnd(8)}  ${tilde(e.root).padEnd(44)}  `
				+ (!e.exists ? 'MISSING on disk'
					: e.kind === 'host' ? 'listed, never walked'
					: `${e.buildings.length} building(s) · ${rows} row(s)`));
		}
		for (const f of fails) console.log(`\n  [${f.severity}] ${f.code} — ${f.reason}\n         ${tilde(f.file)}:${f.line}: ${f.excerpt}`);
	}
	process.exit(fails.some(f => f.severity === 'fail') ? 1 : 0);
}

if (cmd === 'migrate') {
	if (paths.length !== 1) die('doctrine migrate: exactly one building path per call.');
	const given = tableFile ? tableFromText(readFileSync(tableFile, 'utf8')) : undefined;
	const { building, table, migrations } = migrate(paths[0]!, given);
	// The table is printed before a byte moves — the respell is derived from the board, and a
	// derivation nobody can read is a rule nobody can refuse (D80).
	console.log(`${building.building} — the id respell table (D80), ${given ? `hand-given (${tableFile})` : 'derived from the board'}:\n${renderTable(table)}\n`);
	// Two old ids on one address: the board numbered campaigns in parallel letters and the
	// derivation cannot know the offset — the desk rules it and hands the table (simmy D18).
	const clash = collisions(table);
	if (clash.length) die(`${clash.length} id collision(s) in the derived table — ${clash.join('; ')}. A renumber is a ruling, not a derivation: pass --table <file>.`);
	if (!migrations.length) { console.log(`${building.building}: already in the current grammar — nothing to migrate.`); process.exit(0); }

	let violations = 0;
	for (const m of migrations) {
		console.log(diff(m));
		const bad = roundTrip(m);
		violations += bad.length;
		console.log(bad.length
			? `!! round-trip FAILED (${bad.length}):\n   ${bad.join('\n   ')}`
			: `   round-trip ok — ${m.edits.length} edit(s), every meaning-bearing field unchanged or exactly respelled\n`);
	}
	if (violations) die(`\n${violations} round-trip violation(s) — refusing to write. This is a converter bug, not a doc defect.`);

	if (!flag('--write')) {
		console.log(`\nDry run: ${migrations.reduce((a, m) => a + m.edits.length, 0)} edit(s) across ${migrations.length} file(s) — 0 files written. Re-run with --write to apply.`);
		process.exit(0);
	}
	for (const m of migrations) write(m);
	console.log(`\nWrote ${migrations.length} file(s).`);
	process.exit(0);
}

if (cmd === 'citations') {
	if (paths.length !== 1) die('doctrine citations: exactly one building path per call.');
	const root = resolve(paths[0]!);
	// The table is this repo's own register, so the fence is this repo's own surfaces: pointed
	// anywhere else the run would read a stranger's ids as if they were ours (D80).
	if (!existsSync(join(root, 'canon', 'work', 'DOCTRINE.md')))
		die(`doctrine citations: ${paths[0]} is not the canon repo — the home table is its register's (043).`);

	const runs = respellBuilding(root);
	console.log(`the citation homes (043's table, hand-kept — DOCTRINE §8, the purge clause):\n${renderHomes()}\n`);
	for (const r of runs.filter(x => x.edits.length)) console.log(diffRun(r) + '\n');

	const bare = runs.flatMap(r => r.bare.map(b => ({ ...b, file: r.file })));
	const owned = bare.filter(b => b.owned);
	console.log(`census — bare D-ids still standing on the fence (${citationTargets(root).length} surfaces read):`);
	console.log(`  the table's own, unconsumed — each a HAND edit: ${owned.length}`);
	for (const b of owned) console.log(`     ${b.file}:${b.line}: ${b.id} — ${b.text.trim()}`);
	const rest = new Map<string, number>();
	for (const b of bare) if (!b.owned) rest.set(b.id, (rest.get(b.id) ?? 0) + 1);
	console.log(`  outside the table — live ids and the forms rule 4 fences: ${bare.length - owned.length}`
		+ (rest.size ? `\n     ${[...rest].sort((a, b) => +a[0].slice(1) - +b[0].slice(1)).map(([id, n]) => `${id}×${n}`).join(' ')}` : ''));

	const edits = runs.reduce((a, r) => a + r.edits.length, 0);
	if (!flag('--write')) {
		console.log(`\nDry run: ${edits} edit(s) across ${runs.filter(r => r.edits.length).length} file(s) — 0 files written. Re-run with --write to apply.`);
		process.exit(owned.length ? 1 : 0);
	}
	for (const r of runs.filter(x => x.edits.length)) writeRun(root, r);
	console.log(`\nWrote ${runs.filter(r => r.edits.length).length} file(s), ${edits} edit(s).`);
	process.exit(owned.length ? 1 : 0);
}

die(`doctrine: unknown command "${cmd}".\n\n${USAGE}`);
