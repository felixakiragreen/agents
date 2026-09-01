// Row 021 — candidate residue: mechanical term-candidate surfacing to diff against the
// readers' haul at merge. Bold-at-minting, backticks, italics, ALLCAPS, frequency residue.
import { readFileSync, writeFileSync } from 'fs';

const AGENTS = '/Users/felix/code/agents';
const paths = readFileSync(`${AGENTS}/lab/21/manifest.tsv`, 'utf8').trim().split('\n').map(l => l.split('\t')[3]!);

const STOP = new Set(('the a an and or but if then else for while of in on at to from by with without into onto over under ' +
'is are was were be been being am do does did done have has had having will would shall should can could may might must ' +
'not no nor never this that these those it its they them their there here where when what which who whom whose why how ' +
'i you he she we us our your his her my me mine yours theirs ours as so than too very just only also both each every ' +
'all any some none one two three four five six seven eight nine ten first second third new old same other another more most ' +
'less least own such between through during before after above below up down out off again further once because until ' +
'about against per via vs etc eg ie md file files line lines doc docs repo repos git commit commits branch branches ' +
'code test tests run runs running read reads reading write writes writing use uses used using work works working ' +
'session sessions time day days way ways thing things make makes made get gets got go goes going see sees seen ' +
'now still yet even ever back next last like x n na').split(/\s+/));

const bold = new Map<string, number>(), ticks = new Map<string, number>(), ital = new Map<string, number>(),
	caps = new Map<string, number>(), freq = new Map<string, number>(), spread = new Map<string, Set<string>>();
const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);

for (const p of paths) {
	const t = readFileSync(p, 'utf8');
	for (const m of t.matchAll(/\*\*([^*\n]{2,60})\*\*/g)) bump(bold, m[1]!.trim());
	for (const m of t.matchAll(/`([^`\n]{2,40})`/g)) { const s = m[1]!.trim(); if (!/[\/\\=(){}<>$|;]/.test(s)) bump(ticks, s); }
	for (const m of t.matchAll(/(?<![*\w])\*([^*\n]{2,60})\*(?![*\w])/g)) bump(ital, m[1]!.trim());
	for (const m of t.matchAll(/\b[A-Z]{2,}(?: [A-Z]{2,})*\b/g)) bump(caps, m[0]!);
	const seen = new Set<string>();
	for (const m of t.toLowerCase().matchAll(/\b[a-z][a-z-]{2,}\b/g)) {
		const w = m[0]!;
		if (STOP.has(w)) continue;
		bump(freq, w);
		if (!seen.has(w)) { seen.add(w); (spread.get(w) ?? spread.set(w, new Set()).get(w)!).add(p); }
	}
}

const top = (m: Map<string, number>, n: number, min = 2) =>
	[...m.entries()].filter(([, c]) => c >= min).sort((a, b) => b[1] - a[1]).slice(0, n);
const out = {
	bold: top(bold, 400), backticks: top(ticks, 300), italics: top(ital, 300), allcaps: top(caps, 200),
	frequency: top(freq, 500, 10).map(([w, c]) => [w, c, spread.get(w)?.size ?? 0]),
};
writeFileSync(`${AGENTS}/lab/21/candidates.json`, JSON.stringify(out, null, '\t'));
console.log(`candidates.json written · bold ${out.bold.length} · ticks ${out.backticks.length} · italics ${out.italics.length} · caps ${out.allcaps.length} · freq ${out.frequency.length}`);
