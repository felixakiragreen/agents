// Row 21 — curation digest: lexicon.json → compact working views for the concept pass.
import { readFileSync, writeFileSync } from 'fs';

const LAB = '/Users/felix/code/agents/lab/21';
type Sense = { gloss: string; kind: string; file: string; line: number; quote: string; reader: string; flags: string[] };
type Entry = { term: string; kinds: string[]; forms: string[]; senses: Sense[]; flags: string[]; count: number; spread: number; byClass: Record<string, number> };
const lex: { entries: Entry[] } = JSON.parse(readFileSync(`${LAB}/lexicon.json`, 'utf8'));

const short = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1) + '…');
const uniqGlosses = (e: Entry, n: number, len = 70) => {
	const seen: string[] = [];
	for (const s of e.senses) {
		const g = s.gloss?.trim();
		if (!g) continue;
		if (seen.some(x => x.toLowerCase().slice(0, 25) === g.toLowerCase().slice(0, 25))) continue;
		seen.push(g);
		if (seen.length === n) break;
	}
	return seen.map(g => short(g, len));
};
const classes = (e: Entry) => Object.entries(e.byClass).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c.replace('dialect-', 'd:')).join(',');
const hasFlag = (e: Entry, f: string) => e.flags.some(x => x.startsWith(f));
const line = (e: Entry) =>
	`- **${e.term}** · ${e.kinds.join('/')} · ${e.count}×${e.spread}f · ${classes(e)}` +
	(e.flags.length ? ` · [${e.flags.filter(f => f !== 'sense-hunt').slice(0, 5).join(' ')}]` : '') +
	`\n  ${uniqGlosses(e, 4).map(g => `“${g}”`).join(' | ')}`;

const isCore = (e: Entry) =>
	hasFlag(e, 'collision') || hasFlag(e, 'felix-coined') || hasFlag(e, 'sense-hunt') ||
	e.senses.length >= 3 || e.count >= 100;

const core = lex.entries.filter(e => isCore(e) && !e.kinds.includes('formula') && !e.kinds.includes('notation'));
const formulas = lex.entries.filter(e => e.kinds.includes('formula'));
const notations = lex.entries.filter(e => e.kinds.includes('notation') && !e.kinds.includes('formula'));
const tail = lex.entries.filter(e => !isCore(e) && !e.kinds.includes('formula') && !e.kinds.includes('notation'));

// polysemy leaderboard: distinct gloss-count as sense proxy
const poly = [...lex.entries].map(e => ({ e, n: uniqGlosses(e, 99, 999).length })).filter(x => x.n >= 3)
	.sort((a, b) => b.n - a.n).slice(0, 60);

writeFileSync(`${LAB}/digest-core.md`, `# core terms (${core.length})\n\n` + core.sort((a, b) => b.count - a.count).map(line).join('\n') + '\n');
writeFileSync(`${LAB}/digest-collisions.md`, `# collision-flagged (${lex.entries.filter(e => hasFlag(e, 'collision')).length}) + polysemy top\n\n## flagged\n\n` +
	lex.entries.filter(e => hasFlag(e, 'collision')).sort((a, b) => b.count - a.count)
		.map(e => `- **${e.term}** [${e.flags.filter(f => f.startsWith('collision')).join(' ')}]\n  ${uniqGlosses(e, 5).map(g => `“${g}”`).join(' | ')}`).join('\n') +
	`\n\n## polysemy leaderboard (≥3 distinct glosses)\n\n` +
	poly.map(({ e, n }) => `- **${e.term}** ×${n}: ${uniqGlosses(e, 6, 50).map(g => `“${g}”`).join(' | ')}`).join('\n') + '\n');
writeFileSync(`${LAB}/digest-formulas.md`, `# formulas (${formulas.length})\n\n` +
	formulas.sort((a, b) => b.count - a.count).map(e => `- “${e.term}” · ${e.count}×${e.spread}f · ${classes(e)}${hasFlag(e, 'felix-coined') ? ' · FELIX' : ''}`).join('\n') +
	`\n\n# notations (${notations.length})\n\n` + notations.map(e => `- ${e.term} · ${uniqGlosses(e, 1, 80)}`).join('\n') + '\n');
writeFileSync(`${LAB}/digest-tail.txt`, tail.sort((a, b) => b.count - a.count).map(e => `${e.term} (${e.count}×${e.spread}, ${e.kinds.join('/')})`).join('\n') + '\n');
writeFileSync(`${LAB}/digest-felix.md`, `# felix-coined (${lex.entries.filter(e => hasFlag(e, 'felix-coined')).length})\n\n` +
	lex.entries.filter(e => hasFlag(e, 'felix-coined')).map(line).join('\n') + '\n');

console.log(`core ${core.length} · collisions ${lex.entries.filter(e => hasFlag(e, 'collision')).length} · formulas ${formulas.length} · notations ${notations.length} · tail ${tail.length} · felix ${lex.entries.filter(e => hasFlag(e, 'felix-coined')).length}`);
for (const f of ['digest-core.md', 'digest-collisions.md', 'digest-formulas.md', 'digest-tail.txt', 'digest-felix.md'])
	console.log(`${f}: ${(readFileSync(`${LAB}/${f}`, 'utf8').length / 1024).toFixed(0)}KB`);
