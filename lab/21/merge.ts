// Row 21 — the merge: obs/*.jsonl → lexicon.json + coverage assertion + concordance
// + candidate residue. Mechanical only — concept grouping is the Grand Architect's pass.
import { readFileSync, readdirSync, writeFileSync } from 'fs';

const LAB = '/Users/felix/code/agents/lab/21';

type Obs = { term: string; kind: string; forms?: string[]; file: string; line: number; quote: string; gloss: string; flags?: string[] };
type Cov = { coverage: string; observations: number; note?: string };

// ---------- manifest + corpus in memory ----------
const manifest = readFileSync(`${LAB}/manifest.tsv`, 'utf8').trim().split('\n').map(l => {
	const [w, t, cls, path] = l.split('\t');
	return { words: +w!, territory: t!, cls: cls!, path: path! };
});
const corpus = manifest.map(m => ({ ...m, text: readFileSync(m.path, 'utf8') }));

// ---------- load observations ----------
const obs: (Obs & { reader: string })[] = [];
const cov: (Cov & { reader: string })[] = [];
const badLines: string[] = [];
const readers = readdirSync(`${LAB}/obs`).filter(f => f.endsWith('.jsonl')).sort();
for (const f of readers) {
	const reader = f.replace('.jsonl', '');
	readFileSync(`${LAB}/obs/${f}`, 'utf8').split('\n').forEach((line, i) => {
		if (!line.trim()) return;
		try {
			const o = JSON.parse(line);
			if (o.coverage) cov.push({ ...o, reader });
			else if (o.term && o.quote != null) obs.push({ ...o, reader });
			else badLines.push(`${reader}:${i + 1} — neither obs nor coverage: ${line.slice(0, 80)}`);
		} catch { badLines.push(`${reader}:${i + 1} — invalid JSON: ${line.slice(0, 80)}`); }
	});
}

// ---------- coverage assertion ----------
const norm = (p: string) => p.replace(/\/+$/, '');
const covered = new Set(cov.map(c => norm(c.coverage)));
const assigned = new Set(manifest.map(m => norm(m.path)));
const missing = [...assigned].filter(p => !covered.has(p));
const strays = [...covered].filter(p => !assigned.has(p));

// ---------- lexicon ----------
const keyOf = (t: string) => (/^[A-Z0-9 ✓×§·—-]+$/.test(t.trim()) ? t.trim() : t.trim().toLowerCase());
type Entry = {
	term: string; kinds: string[]; forms: string[];
	senses: { gloss: string; kind: string; file: string; line: number; quote: string; reader: string; flags: string[] }[];
	flags: string[]; count: number; spread: number; byClass: Record<string, number>;
};
const lex = new Map<string, Entry>();
for (const o of obs) {
	const k = keyOf(o.term);
	const e = lex.get(k) ?? { term: k, kinds: [], forms: [], senses: [], flags: [], count: 0, spread: 0, byClass: {} };
	if (!e.kinds.includes(o.kind)) e.kinds.push(o.kind);
	for (const f of [o.term, ...(o.forms ?? [])]) { const ff = f.trim(); if (ff && !e.forms.some(x => x.toLowerCase() === ff.toLowerCase())) e.forms.push(ff); }
	e.senses.push({ gloss: o.gloss, kind: o.kind, file: o.file, line: o.line, quote: o.quote, reader: o.reader, flags: o.flags ?? [] });
	for (const fl of o.flags ?? []) if (!e.flags.includes(fl)) e.flags.push(fl);
	lex.set(k, e);
}

// ---------- concordance (word-boundary, case-insensitive, inflection-light) ----------
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const e of lex.values()) {
	const single = e.forms.filter(f => f.length > 1 && !/[·→×§—✓]/.test(f));
	if (!single.length) continue;
	const re = new RegExp(`\\b(${single.map(esc).join('|')})(s|es|d|ed|ing)?\\b`, 'gi');
	for (const c of corpus) {
		const n = (c.text.match(re) ?? []).length;
		if (!n) continue;
		e.count += n; e.spread++;
		e.byClass[c.cls] = (e.byClass[c.cls] ?? 0) + n;
	}
}

// ---------- candidate residue ----------
const cand = JSON.parse(readFileSync(`${LAB}/candidates.json`, 'utf8'));
const known = new Set([...lex.values()].flatMap(e => e.forms.map(f => f.toLowerCase())));
const residue = (pairs: [string, number][]) =>
	pairs.filter(([w]) => { const s = w.toLowerCase().trim(); return s.length > 2 && !known.has(s) && !s.split(/\s+/).every(x => known.has(x)); }).slice(0, 120);
const res = { bold: residue(cand.bold), backticks: residue(cand.backticks), allcaps: residue(cand.allcaps) };

// ---------- emit ----------
const entries = [...lex.values()].sort((a, b) => b.count - a.count);
writeFileSync(`${LAB}/lexicon.json`, JSON.stringify({ generated: new Date().toISOString().slice(0, 10), readers: readers.length, observations: obs.length, terms: entries.length, entries }, null, '\t'));
writeFileSync(`${LAB}/residue.json`, JSON.stringify(res, null, '\t'));

const flagged = (f: string) => entries.filter(e => e.flags.some(x => x.startsWith(f))).length;
console.log([
	`readers: ${readers.length} · observations: ${obs.length} · coverage lines: ${cov.length}`,
	`terms: ${entries.length} · senses: ${obs.length}`,
	`coverage: ${assigned.size - missing.length}/${assigned.size} assigned files covered · strays: ${strays.length} · bad lines: ${badLines.length}`,
	`flags — collisions: ${flagged('collision')} · minting-sites: ${flagged('minting-site')} · dialect: ${flagged('dialect')} · lore: ${flagged('lore')} · felix-coined: ${flagged('felix-coined')} · agent-coined: ${flagged('agent-coined')}`,
	`residue — bold: ${res.bold.length} · ticks: ${res.backticks.length} · caps: ${res.allcaps.length}`,
	`top 25: ${entries.slice(0, 25).map(e => `${e.term}(${e.count})`).join(' · ')}`,
].join('\n'));
if (missing.length) console.log(`\nMISSING coverage (${missing.length}):\n${missing.slice(0, 40).join('\n')}`);
if (badLines.length) console.log(`\nBAD lines:\n${badLines.slice(0, 20).join('\n')}`);
