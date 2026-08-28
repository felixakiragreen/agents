// lab/17 — the control (brief §method 1): the twin's fidelity to arm M, asserted before
// any measurement runs. doctrine's own parsers read BOTH the live corpus and the twin's
// re-render; every typed field must match. Declared asymmetries (each cited):
//   - line numbers / verbatim blocks — position is serialization, not meaning.
//   - ledger `body` whitespace: the parser flattens newlines; both sides flatten alike.

import { readFileSync } from 'fs';
import { join } from 'path';
import { parseBoards, parseLedger, parseDecisions, parseKickoffs } from '../../doctrine/src/parse';

const DIR = import.meta.dir;
const REPO = join(DIR, '..', '..');
const rendered = (f: string) => readFileSync(join(DIR, 'rendered', f), 'utf8');
const corpus = (f: string) => readFileSync(join(REPO, f), 'utf8');

let diffs = 0;
function eq(where: string, a: unknown, b: unknown) {
	const ja = JSON.stringify(a), jb = JSON.stringify(b);
	if (ja !== jb) { diffs++; console.log(`DIFF ${where}\n  corpus: ${ja?.slice(0, 200)}\n  twin:   ${jb?.slice(0, 200)}`); }
}

// boards — corpus MAP + wave boards vs the one rendered board doc
{
	const m = parseBoards(corpus('MAP.md')).boards.filter(b => b.rows.length);
	const w = parseBoards(corpus('plans/18-great-recut.md')).boards.filter(b => b.rows.length);
	const t = parseBoards(rendered('board.md')).boards;
	const orig = [...m, ...w];
	eq('board count', orig.length, t.length);
	orig.forEach((b, i) => {
		eq(`board[${i}] heading`, b.heading, t[i]?.heading);
		eq(`board[${i}] row count`, b.rows.length, t[i]?.rows.length);
		b.rows.forEach((r, j) => {
			const { line: _, ...a } = r;
			const { line: __, ...z } = t[i]!.rows[j]!;
			eq(`board[${i}].row[${j}] (${r.id})`, a, z);
		});
	});
}

// ledger — every entry, typed fields only
{
	const a = parseLedger(corpus('LEDGER.md')).entries;
	const b = parseLedger(rendered('LEDGER.md')).entries;
	eq('ledger entry count', a.length, b.length);
	a.forEach((e, i) => {
		const { line: _, block: __, body: ___, ...x } = e;
		const { line: ____, block: _____, body: ______, ...y } = b[i] ?? {} as typeof e;
		eq(`ledger[${i}] (${e.date})`, x, y);
		eq(`ledger[${i}] body`, e.body.replace(/\s+/g, ' '), (b[i]?.body ?? '').replace(/\s+/g, ' '));
	});
}

// decisions — every entry
{
	const a = parseDecisions(corpus('DECISIONS.md')).decisions;
	const b = parseDecisions(rendered('DECISIONS.md')).decisions;
	eq('decision count', a.length, b.length);
	a.forEach((e, i) => {
		const { line: _, body: __, ...x } = e;
		const { line: ___, body: ____, ...y } = b[i] ?? {} as typeof e;
		eq(`decision[${i}] (${e.id})`, x, y);
		eq(`decision[${i}] body`, e.body.replace(/\s+/g, ' '), (b[i]?.body ?? '').replace(/\s+/g, ' '));
	});
}

// kickoffs — the baseline's 31 vs the rendered doc
{
	const base = JSON.parse(readFileSync(join(DIR, 'parse-baseline.json'), 'utf8')).kickoffs;
	const b = parseKickoffs(rendered('kickoffs.md')).kickoffs;
	eq('kickoff count', base.length, b.length);
	base.forEach((k: { mantle: string; tier: string; text: string }, i: number) => {
		eq(`kickoff[${i}]`, { mantle: k.mantle, tier: k.tier, text: k.text },
			b[i] ? { mantle: b[i].mantle, tier: b[i].tier, text: b[i].text } : null);
	});
}

if (diffs) { console.log(`\nFIDELITY: FAILED — ${diffs} diff(s)`); process.exit(1); }
console.log('FIDELITY: OK — every typed field identical, corpus vs re-rendered twin');
