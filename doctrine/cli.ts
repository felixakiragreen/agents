#!/usr/bin/env bun
// `doctrine` — the CLI arm of the Standards Office's reader.
//
//   doctrine lint [--live] [--verbose] [--json] <path…>   walk and report; non-zero on any fail
//   doctrine parse --json <building>                      one building, P3 §5's shapes
//   doctrine migrate [--write] <building>                 re-emit in the current grammar

import { existsSync } from 'fs';
import { parse } from './src/building';
import { lint, render } from './src/lint';
import { diff, migrate, roundTrip, write } from './src/migrate';

const USAGE = `doctrine — the reference reader for the work doctrine (canon/work/DOCTRINE.md)

  doctrine lint [--live] [--verbose] [--json] <path…>
      Walk every building under <path…> and report each failure class with file:line and
      the verbatim offending excerpt. Exits 1 if anything failed.
      --live      only the surfaces read today: boards, ledger tails, open work docs' kickoffs
      --verbose   every excerpt, not the first three per class
      --json      the whole report as JSON

  doctrine parse --json <building>
      Emit one building's parsed shapes (Building, BoardRow, LedgerEntry, Baton,
      Decision, Kickoff, Issue).

  doctrine migrate [--write] <building>
      Form-only re-emission in the current grammar. Prints the diff and the round-trip
      verdict; --write is required to touch a single byte on disk.`;

const argv = process.argv.slice(2);
const flag = (f: string) => argv.includes(f);
const paths = argv.filter(a => !a.startsWith('-')).slice(1);
const cmd = argv.find(a => !a.startsWith('-')) ?? '';

function die(msg: string): never { console.error(msg); process.exit(2); }

if (!cmd || flag('--help') || flag('-h')) { console.log(USAGE); process.exit(cmd ? 0 : 2); }

if (cmd === 'lint') {
	if (!paths.length) die('doctrine lint: give me at least one path to walk.');
	for (const p of paths) if (!existsSync(p)) die(`doctrine lint: ${p} does not exist.`);
	const report = lint(paths, { live: flag('--live') });
	if (flag('--json')) console.log(JSON.stringify({ totals: report.totals, fails: report.fails }, null, 2));
	else console.log(render(report, { verbose: flag('--verbose') }));
	process.exit(report.fails.length ? 1 : 0);
}

if (cmd === 'parse') {
	if (paths.length !== 1) die('doctrine parse: exactly one building path per call.');
	console.log(JSON.stringify(parse(paths[0]!), null, 2));
	process.exit(0);
}

if (cmd === 'migrate') {
	if (paths.length !== 1) die('doctrine migrate: exactly one building path per call.');
	const { building, migrations } = migrate(paths[0]!);
	if (!migrations.length) { console.log(`${building.building}: already in the current grammar — nothing to migrate.`); process.exit(0); }

	let violations = 0;
	for (const m of migrations) {
		console.log(diff(m));
		const bad = roundTrip(m);
		violations += bad.length;
		console.log(bad.length
			? `!! round-trip FAILED (${bad.length}):\n   ${bad.join('\n   ')}`
			: `   round-trip ok — ${m.edits.length} edit(s), meaning-bearing fields unchanged\n`);
	}
	if (violations) die(`\n${violations} round-trip violation(s) — refusing to write. This is a converter bug, not a doc defect.`);

	if (!flag('--write')) {
		console.log(`\nDry run: ${migrations.reduce((a, m) => a + m.edits.length, 0)} edit(s) across ${migrations.length} file(s). Re-run with --write to apply.`);
		process.exit(0);
	}
	for (const m of migrations) write(m);
	console.log(`\nWrote ${migrations.length} file(s).`);
	process.exit(0);
}

die(`doctrine: unknown command "${cmd}".\n\n${USAGE}`);
