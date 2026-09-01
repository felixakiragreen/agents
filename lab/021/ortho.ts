// Row 021 — orthography & notation census: BrE/AmE variants, -ize/-ise ratio, dates,
// units, structural symbols. Mechanical, whole corpus, no judgment.
import { readFileSync, writeFileSync } from 'fs';

const AGENTS = '/Users/felix/code/agents';
const rows = readFileSync(`${AGENTS}/lab/021/manifest.tsv`, 'utf8').trim().split('\n')
	.map(l => { const [w, t, cls, path] = l.split('\t'); return { tier: t![0]!, cls: cls!, path: path! }; });

const PAIRS: [string, string][] = [
	['color', 'colour'], ['center', 'centre'], ['gray', 'grey'], ['behavior', 'behaviour'],
	['favor', 'favour'], ['honor', 'honour'], ['flavor', 'flavour'], ['license', 'licence'],
	['defense', 'defence'], ['offense', 'offence'], ['analyze', 'analyse'], ['catalog', 'catalogue'],
	['dialog', 'dialogue'], ['traveled', 'travelled'], ['modeling', 'modelling'], ['labeled', 'labelled'],
	['canceled', 'cancelled'], ['fulfill', 'fulfil'], ['judgment', 'judgement'], ['artifact', 'artefact'],
	['theater', 'theatre'], ['meter', 'metre'], ['liter', 'litre'], ['practice', 'practise'],
];
const ISE_OK = new Set(['rise', 'arise', 'wise', 'otherwise', 'likewise', 'clockwise', 'promise', 'premise',
	'surprise', 'exercise', 'precise', 'concise', 'paradise', 'expertise', 'franchise', 'disguise',
	'raise', 'praise', 'noise', 'poise', 'advise', 'devise', 'revise', 'comprise', 'compromise', 'anise']);

const count = (t: string, re: RegExp) => (t.match(re) ?? []).length;
const wb = (w: string) => new RegExp(`\\b${w}(s|es|d|ed|ing|ation|ations)?\\b`, 'gi');

const pair = new Map<string, [number, number]>(PAIRS.map(([a, b]) => [`${a}/${b}`, [0, 0]]));
let ize = 0, ise = 0;
const izeWords = new Map<string, number>(), iseWords = new Map<string, number>();
const dates = { iso: 0, slash: [] as string[], monthName: [] as string[] };
const units = new Map<string, number>();
const imperial: string[] = [];
const symbols = new Map<string, number>();
const SYM = ['·', '→', '←', '⇒', '✓', '✗', '×', '§', '⟨', '❮', '—', '…', '⚡', '💚'];

for (const r of rows) {
	const t = readFileSync(r.path, 'utf8');
	for (const [a, b] of PAIRS) {
		const c = pair.get(`${a}/${b}`)!;
		c[0] += count(t, wb(a)); c[1] += count(t, wb(b));
	}
	for (const m of t.matchAll(/\b([a-z]{3,})i(z|s)e(s|d|r|rs)?\b/g)) {
		const stem = `${m[1]}i${m[2]}e`;
		if (ISE_OK.has(stem)) continue;
		if (m[2] === 'z') { ize++; izeWords.set(stem, (izeWords.get(stem) ?? 0) + 1); }
		else { ise++; iseWords.set(stem, (iseWords.get(stem) ?? 0) + 1); }
	}
	dates.iso += count(t, /\b\d{4}-\d{2}-\d{2}\b/g);
	for (const m of t.matchAll(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g)) dates.slash.push(`${r.path.split('/code/')[1]}: ${m[0]}`);
	for (const m of t.matchAll(/\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)[a-z]*\.? \d{1,2}\b/g))
		dates.monthName.push(`${r.path.split('/code/')[1]}: ${m[0]}`);
	for (const m of t.matchAll(/\b\d+(?:\.\d+)? ?(ms|sec|min|px|pt|rem|KB|MB|GB|KiB|MiB|GiB|kB|tokens?|cols?)\b/g))
		units.set(m[1]!, (units.get(m[1]!) ?? 0) + 1);
	for (const m of t.matchAll(/\b\d+(?:\.\d+)? ?(inch|inches|ft|feet|lb|lbs|oz|mph)\b/gi)) imperial.push(`${r.path.split('/code/')[1]}: ${m[0]}`);
	for (const s of SYM) symbols.set(s, (symbols.get(s) ?? 0) + count(t, new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')));
	symbols.set('⬡✓', (symbols.get('⬡✓') ?? 0) + count(t, /⬡✓/g));
	symbols.set('⟨slot⟩', (symbols.get('⟨slot⟩') ?? 0) + count(t, /⟨[^⟩\n]+⟩/g));
	symbols.set('~~strike~~', (symbols.get('~~strike~~') ?? 0) + count(t, /~~[^~\n]+~~/g));
}

const top = (m: Map<string, number>, n: number) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const lines: string[] = ['# 21 — orthography & notation report', '', '## Spelling pairs (AmE / BrE, corpus-wide, inflections included)', ''];
for (const [k, [a, b]] of pair) if (a + b > 0) lines.push(`- ${k}: **${a} / ${b}**${a && b ? ' ← MIXED' : ''}`);
lines.push('', `## -ize vs -ise (stoplist applied): **${ize} / ${ise}**`, '',
	`top -ize: ${top(izeWords, 12).map(([w, c]) => `${w}(${c})`).join(', ')}`,
	`top -ise: ${top(iseWords, 12).map(([w, c]) => `${w}(${c})`).join(', ')}`, '',
	`## Dates — ISO ${dates.iso} · slash ${dates.slash.length} · month-name ${dates.monthName.length}`, '');
if (dates.slash.length) lines.push('slash dates:', ...dates.slash.slice(0, 20).map(s => `- ${s}`), '');
if (dates.monthName.length) lines.push('month-name dates (sample):', ...dates.monthName.slice(0, 20).map(s => `- ${s}`), '');
lines.push('## Units seen (count)', '', ...top(units, 30).map(([u, c]) => `- ${u}: ${c}`), '');
lines.push(`## Imperial sniff: ${imperial.length}`, ...imperial.slice(0, 20).map(s => `- ${s}`), '');
lines.push('## Structural symbols', '', ...[...symbols.entries()].map(([s, c]) => `- \`${s}\`: ${c}`));
writeFileSync(`${AGENTS}/lab/021/ortho-report.md`, lines.join('\n') + '\n');
console.log(`ortho-report.md written · pairs with hits: ${[...pair.values()].filter(([a, b]) => a + b > 0).length} · ize/ise ${ize}/${ise} · iso dates ${dates.iso}`);
