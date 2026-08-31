// Candidate 7, measured: does the City's grouping fracture? (B24 §3)
//
// `cityRows` sorts buildings by attention, then freshness, then name; `drawCity` then groups
// *consecutive* runs of the same label. So a group fractures whenever two buildings sharing a
// label are separated in that order by a building of another label. This prints the label
// sequence the live register produces and names every fracture.
//
// Run: bun lab/b24/candidate7.ts

import { cityRows, needsYou } from '../../glass/attention';
import { readCensus, isLive } from '../../glass/census';
import { city } from "../../glass/register";


const { buildings } = city();
const census = readCensus();
const live = census.sessions.filter(isLive);
const queue = needsYou(buildings, live, []);
const rows = cityRows(buildings, live, queue);

const seq = rows.map(r => r.label);
console.log(`${rows.length} buildings, in the order the City draws them:\n`);
for (const r of rows) console.log(`  ${String(r.attention).padStart(3)}  ${r.label.padEnd(14)}  ${r.building}`);

const seen = new Map<string, number>();
const fractures: string[] = [];
for (let i = 0; i < seq.length; i++) {
	const l = seq[i]!;
	const at = seen.get(l);
	if (at !== undefined && at !== i - 1) fractures.push(`  "${l}" at ${at} and again at ${i} — split by ${seq.slice(at + 1, i).join(', ')}`);
	seen.set(l, i);
}
console.log(`\ngroups drawn: ${seq.filter((l, i) => l !== seq[i - 1]).length} · distinct labels: ${new Set(seq).size}`);
console.log(fractures.length ? `FRACTURED ×${fractures.length}\n${fractures.join('\n')}` : 'no fracture');
void city;
