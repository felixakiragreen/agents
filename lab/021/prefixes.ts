// Row 021 — id-prefix registry + acronym inventory, extracted from the census corpus.
import { readFileSync, writeFileSync } from 'fs';

const LAB = '/Users/felix/code/agents/lab/021';
const rows = readFileSync(`${LAB}/manifest.tsv`, 'utf8').trim().split('\n')
	.map(l => { const [, , cls, path] = l.split('\t'); return { cls: cls!, path: path! }; });

// ---------- letter-prefix ids: <LETTERS><n> and <LETTERS>-<n>, incl. compounds ----------
const pref = new Map<string, { n: number; classes: Map<string, number>; sample: Set<string> }>();
// ---------- acronyms: all-caps 2-6 or mixed-case (DoD) tokens ----------
const NOT_ACRO = new Set(['OPEN', 'LANDED', 'KILLED', 'BLOCKED', 'PENDING', 'PARKED', 'PASSED', 'MERGED',
	'BLESSED', 'IN', 'FLIGHT', 'THE', 'AND', 'NOT', 'ALL', 'ONE', 'TWO', 'FOR', 'BUT', 'YES', 'NO', 'OK',
	'TODO', 'DONE', 'WIP', 'CLOSED', 'STOP', 'HOLD', 'HELD', 'READY', 'STALE', 'CURRENT', 'DEAD', 'VIABLE',
	'PROVEN', 'GO', 'PASS', 'FAIL', 'NONE', 'HALT', 'CUT', 'FILED', 'GATED', 'ARM', 'MAP', 'LOG', 'NOW',
	'NEW', 'OLD', 'RED', 'GREEN', 'HARD', 'SOFT', 'LOST', 'KEPT', 'PAID', 'OWED', 'AUTHORED', 'RULED',
	'RESOLVED', 'PINNED', 'SHARED', 'INSIDE', 'STOPPED', 'DRIVEN', 'FOREIGN', 'MEASURED', 'SUPERSEDED',
	'ENDORSED', 'UNVERIFIED', 'MISCONFIGURED', 'HISTORICAL', 'PROPOSED', 'RETAIN', 'WORKS', 'FELIX']);
const acro = new Map<string, { n: number; classes: Map<string, number> }>();
const bump = <T extends { n: number; classes: Map<string, number> }>(m: Map<string, T>, k: string, cls: string, mk: () => T) => {
	const e = m.get(k) ?? (m.set(k, mk()), m.get(k)!);
	e.n++; e.classes.set(cls, (e.classes.get(cls) ?? 0) + 1);
	return e;
};

for (const r of rows) {
	const t = readFileSync(r.path, 'utf8');
	for (const m of t.matchAll(/\b([A-Z]{1,4}(?:-[A-Z]{1,4})?)-?(\d{1,3})([a-z]|\([a-z]\))?\b/g)) {
		const letters = m[1]!;
		if (letters.length > 5 || /^\d/.test(letters)) continue;
		const e = bump(pref, letters, r.cls, () => ({ n: 0, classes: new Map(), sample: new Set<string>() }));
		if (e.sample.size < 4) e.sample.add(m[0]!);
	}
	for (const m of t.matchAll(/\b([A-Z][a-z]?[A-Z][A-Za-z]{0,4}|[A-Z]{2,6})\b/g)) {
		const w = m[0]!;
		if (NOT_ACRO.has(w) || /^\d/.test(w) || w.length < 2) continue;
		if (!/[A-Z].*[A-Z]/.test(w)) continue;
		bump(acro, w, r.cls, () => ({ n: 0, classes: new Map() }));
	}
}

const fmtClasses = (c: Map<string, number>) =>
	[...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k.replace('dialect-', 'd:')).join(',');
const lines: string[] = ['# id-prefix registry (raw extraction)', ''];
for (const [k, e] of [...pref.entries()].filter(([, e]) => e.n >= 5).sort((a, b) => b[1].n - a[1].n))
	lines.push(`- **${k}** · ${e.n} · ${fmtClasses(e.classes)} · e.g. ${[...e.sample].join(' ')}`);
lines.push('', '# acronym inventory (raw extraction, ≥8 uses)', '');
for (const [k, e] of [...acro.entries()].filter(([, e]) => e.n >= 8).sort((a, b) => b[1].n - a[1].n))
	lines.push(`- **${k}** · ${e.n} · ${fmtClasses(e.classes)}`);
writeFileSync(`${LAB}/prefix-acro-report.md`, lines.join('\n') + '\n');
console.log(`prefixes ≥5: ${[...pref.values()].filter(e => e.n >= 5).length} · acronyms ≥8: ${[...acro.values()].filter(e => e.n >= 8).length} → prefix-acro-report.md`);
