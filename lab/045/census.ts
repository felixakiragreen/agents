// 045's census — what the record ACTUALLY writes into a baton, counted over every ledger entry
// of four buildings (not only their tails). The type table is data the office extends, and this
// is the ground it extends it from: the untyped list is the finding, and every word in it is a
// leading noun a real ⬡-baton opens with.
//
//   bun lab/045/census.ts
//
// One parser: every field here is read by `doctrine`'s own reader — the census counts, it never
// re-implements. History is counted, never linted (the `ledger.baton` arm reads tails alone).

import { readFileSync } from 'fs';
import { batonSlots, batonTypeWord, classifyBaton, parseLedger } from '../../doctrine/src/parse';

/** What the parser's own `BATON_LINE` requires and this does not: that the line START with it. */
const MENTIONS_BATON = /\*{0,2}Baton\*{0,2}\s*[—–-]/;

const HOME = process.env.HOME;
const LEDGERS = [
	['agents', `${HOME}/code/agents/LEDGER.md`],
	['stigmergon', `${HOME}/code/stigmergon/LEDGER.md`],
	['simmy', `${HOME}/code/universal_robots_sdk/cap-mega/simmy/LEDGER.md`],
	['hexwright', `${HOME}/code/hexwright/LEDGER.md`],
] as const;

type Tally = Map<string, number>;
const bump = (t: Tally, k: string) => t.set(k, (t.get(k) ?? 0) + 1);
const render = (t: Tally) => [...t].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
	.map(([k, n]) => `${k} ${n}`).join(' · ') || '—';

const rows: string[] = [];
const sum = (t: Tally) => [...t.values()].reduce((a, b) => a + b, 0);
const shapes: Tally = new Map(), recs: Tally = new Map(), types: Tally = new Map(), untyped: Tally = new Map();
const totals = { entries: 0, batons: 0, written: 0, lines: 0 };

for (const [name, path] of LEDGERS) {
	const md = readFileSync(path, 'utf8');
	const { entries } = parseLedger(md);
	let batons = 0, written = 0, lines = 0, felix = 0, shaped = 0;
	for (const e of entries) {
		const b = classifyBaton(e);
		if (!b) continue;
		batons++;
		if (MENTIONS_BATON.test(e.block)) written++;
		const slots = batonSlots(e.block);
		if (slots) lines++;
		if (b.shape) { shaped++; bump(shapes, b.shape); }
		if (b.shape === 'fork') bump(recs, b.recommendation?.kind ?? 'none');
		if (b.holder === 'felix') {
			felix++;
			if (b.type) bump(types, b.type);
			else bump(untyped, !slots ? '(no baton line)' : batonTypeWord(slots.action) ?? '(no arrow)');
		}
	}
	totals.entries += entries.length; totals.batons += batons; totals.written += written; totals.lines += lines;
	rows.push(`| ${name} | ${entries.length} | ${batons} | ${written} | ${lines} | ${shaped} | ${felix} |`);
}

console.log('# 045 — the baton census\n');
console.log('| building | entries | batons | writes "Baton —" | baton lines read | shape marked | ⬡ batons |');
console.log('|---|---:|---:|---:|---:|---:|---:|');
for (const r of rows) console.log(r);
console.log(`| **all four** | **${totals.entries}** | **${totals.batons}** | **${totals.written}** | **${totals.lines}** | ` +
	`**${sum(shapes)}** | **${sum(types) + sum(untyped)}** |`);
console.log(`\nshape, by kind: ${render(shapes)}`);
console.log(`fork recommendations, by kind: ${render(recs)}`);
console.log(`⬡ batons typed, by type: ${render(types)}`);
console.log(`⬡ batons untyped, by leading word: ${render(untyped)}`);
