#!/usr/bin/env bun
// `doctrine` — the CLI arm of the Standards Office's reader.
//
//   doctrine lint [--live] [--verbose] [--json] <path…>   walk and report; non-zero on any fail
//   doctrine statement [--json] <path…>                   every ⬡ go on a live surface (D82)
//   doctrine parse --json <building>                      one building, P3 §5's shapes
//   doctrine buildings [--json]                           the building register, walked
//   doctrine migrate [--write] <building>                 re-emit in the current grammar

import { existsSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join, relative, resolve } from 'path';
import { execSync } from 'child_process';
import { discover, parse } from './src/building';
import { byInterest, renderStatement } from './src/credit';
import { guardRegressions, lint, render } from './src/lint';
import { REGISTER, walkRegister } from './src/register';
import { diff, migrate, roundTrip, write } from './src/migrate';
import { renderTable } from './src/respell';

const USAGE = `doctrine — the reference reader for the work doctrine (canon/work/DOCTRINE.md)

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

  doctrine migrate [--write] <building>
      Form-only re-emission in the current grammar, across every tracked text file the
      building keeps. Prints the id respell table (D80, derived from the building's own
      board) first, then the diff and the round-trip verdict per file; --write is required
      to touch a single byte on disk.`;

const argv = process.argv.slice(2);
const flag = (f: string) => argv.includes(f);
const guardAt = argv.indexOf('--guard');
const guardRef = guardAt >= 0 ? argv[guardAt + 1] ?? null : null;
if (guardAt >= 0 && !guardRef) { console.error('doctrine lint: --guard needs a git ref.'); process.exit(2); }
const positional = argv.filter((a, i) => !a.startsWith('-') && (guardAt < 0 || i !== guardAt + 1));
const paths = positional.slice(1);
const cmd = positional[0] ?? '';

function die(msg: string): never { console.error(msg); process.exit(2); }

if (!cmd || flag('--help') || flag('-h')) { console.log(USAGE); process.exit(cmd ? 0 : 2); }

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
	const { building, table, migrations } = migrate(paths[0]!);
	// The table is printed before a byte moves — the respell is derived from the board, and a
	// derivation nobody can read is a rule nobody can refuse (D80).
	console.log(`${building.building} — the id respell table (D80), derived from the board:\n${renderTable(table)}\n`);
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

die(`doctrine: unknown command "${cmd}".\n\n${USAGE}`);
