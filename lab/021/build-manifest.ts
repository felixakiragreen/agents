// Row 021 — census manifest builder: walks the corpus, assigns every file a territory,
// emits manifest.tsv + territories/<id>.txt. Deterministic: re-run = same census.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const AGENTS = '/Users/felix/code/agents';
const CODE = '/Users/felix/code';
const CAP = `${CODE}/universal_robots_sdk/cap-mega`;
const BOB = `${CODE}/universal_robots_sdk/bob`;
const CHUNK_WORDS = 55_000;

const words = (p: string) => readFileSync(p, 'utf8').split(/\s+/).filter(Boolean).length;

function walk(dir: string, out: string[] = []): string[] {
	for (const e of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) {
			if (/\/(node_modules|\.git|\.claude|worktrees)$/.test(p)) continue;
			walk(p, out);
		} else if (e.name.endsWith('.md')) out.push(p);
	}
	return out;
}

// ---------- tier A: the agents repo ----------
const A_EXCLUDE = /\/(lab\/17\/rendered|doctrine\/fixtures)\/|\/belvedere\/lab\/[^/]+\/city\//;
const A_RULES: [string, RegExp, string][] = [
	['A1', /\/canon\//, 'canon-law'],
	['A3', /\/agents\/LEDGER\.md$/, 'board-record'],
	['A4', /\/agents\/(LOG|SAPHO)\.md$/, 'lore'],
	['A2', /\/agents\/(MAP|DECISIONS|ISSUES|CLAUDE)\.md$|\/agents\/(docs|desk)\//, 'board-record'],
	['A5', /\/agents\/plans\/(0[1-9]|1[0-2])-|\/agents\/plans\/(BULLETIN|RIDER|quartermaster|night-shift|log-tradition)/, 'work-doc'],
	['A6', /\/agents\/plans\/(1[3-9]|2[0-2])-|\/agents\/plans\/belvedere\.md$/, 'work-doc'],
	['A7', /\/belvedere\/(README|dream|ISSUES)\.md$|\/belvedere\/(glass|census)\/README\.md$/, 'glass-record'],
	['A8', /\/belvedere\/plans\/(p[1-6]-|deck-keel|flow-keel|RIDER)/, 'glass-work'],
	['A9', /\/belvedere\/plans\/b([1-9]|1[0-2])-/, 'glass-work'],
	['A10', /\/belvedere\/plans\/b(1[3-9]|2[0-7])-|\/belvedere\/lab\//, 'glass-work'],
	['A11', /\/belvedere\/LEDGER\.md$/, 'glass-record'],
	['A12', /\/belvedere\/plans\/BULLETIN\.md$|\/(doctrine|summon|guard)\/README\.md$|\/agents\/lab\//, 'tooling'],
];

// ---------- tier B: the city's dialects ----------
const ARTIFACT = /(^|\/)(CLAUDE|README|MAP|GENESIS|LEDGER|DECISIONS|ISSUES|RIDER|BULLETIN|DISPATCHER|dream)\.md$/;
const GUILD_SIGNS = [/^\| *ID *\|/m, /^\*\*Status:\*\*/m, /^\*\*Staffing:\*\*/m, /^#{2,3} Findings/m, /^You are (a|an|the) [A-Z]/m];
const isGuildDoc = (p: string) => ARTIFACT.test(p) || (() => { const t = readFileSync(p, 'utf8'); return GUILD_SIGNS.some(r => r.test(t)); })();

type Cluster = { name: string; files: string[]; filtered: boolean };
const rootMds = (dir: string) => readdirSync(dir).filter(f => f.endsWith('.md')).map(f => join(dir, f));
const CLUSTERS: Cluster[] = [
	{ name: 'hexwright', files: [...rootMds(`${CODE}/hexwright`), ...walk(`${CODE}/hexwright/plans`)], filtered: false },
	{ name: 'repot', files: walk(`${CODE}/rooted/archive/repot`), filtered: false },
	{ name: 'arborist', files: walk(`${CODE}/rooted/archive/arborist`), filtered: false },
	{ name: 'bob', files: [...rootMds(BOB), ...walk(`${BOB}/docs/campaigns`), ...walk(`${BOB}/docs/records`)], filtered: true },
	{ name: 'simmy', files: rootMds(`${CAP}/simmy`), filtered: false },
	{ name: 'simmy-spikes', files: walk(`${CAP}/simmy/spikes`), filtered: false },
	{ name: 'snappy', files: [...rootMds(`${CAP}/snappy`), ...walk(`${CAP}/snappy/ch2`)], filtered: false },
	{ name: 'capmega-boards', files: [...walk(`${CAP}/docs/units`), ...walk(`${CAP}/docs/waypoint-stepper`)], filtered: false },
	{ name: 'capmega-docs', files: rootMds(`${CAP}/docs`), filtered: true },
	{ name: 'spacex', files: [...walk(`${CAP}/felix/spacex-dashboard`), ...walk(`${CAP}/felix/spacex-dashboard-c2`)], filtered: false },
	{ name: 'whiteboardy', files: [...rootMds(`${CODE}/whiteboardy`), ...walk(`${CODE}/whiteboardy/plans`), ...walk(`${CODE}/whiteboardy/docs`)], filtered: true },
	{ name: 'manny', files: [...rootMds(`${CAP}/.claude/worktrees/user-manual/manny`), ...walk(`${CAP}/.claude/worktrees/user-manual/manny/plans`)], filtered: false },
];

// ---------- assign ----------
type Row = { path: string; w: number; territory: string; cls: string };
const rows: Row[] = [];
const unassigned: string[] = [];

for (const p of walk(AGENTS).sort()) {
	if (A_EXCLUDE.test(p) || /\/lab\/21\//.test(p)) continue;
	const hit = A_RULES.find(([, re]) => re.test(p));
	if (hit) rows.push({ path: p, w: words(p), territory: hit[0], cls: hit[2] });
	else unassigned.push(p);
}

let bn = 0;
for (const c of CLUSTERS) {
	const kept = c.files.filter(p => statSync(p).isFile() && (!c.filtered || isGuildDoc(p))).sort();
	let chunk: Row[] = [], acc = 0;
	const flush = () => { if (!chunk.length) return; bn++; chunk.forEach(r => (r.territory = `B${bn}`)); rows.push(...chunk); chunk = []; acc = 0; };
	for (const p of kept) {
		const w = words(p);
		if (acc + w > CHUNK_WORDS) flush();
		chunk.push({ path: p, w, territory: '?', cls: `dialect-${c.name}` });
		acc += w;
	}
	flush();
}
rows.push({ path: `${AGENTS}/lab/021/commitlog.txt`, w: words(`${AGENTS}/lab/021/commitlog.txt`), territory: 'A13', cls: 'commit-log' });

// ---------- emit ----------
writeFileSync(`${AGENTS}/lab/021/manifest.tsv`, rows.map(r => `${r.w}\t${r.territory}\t${r.cls}\t${r.path}`).join('\n') + '\n');
const byT = new Map<string, Row[]>();
rows.forEach(r => byT.set(r.territory, [...(byT.get(r.territory) ?? []), r]));
for (const [t, rs] of byT) writeFileSync(`${AGENTS}/lab/021/territories/${t}.txt`, rs.map(r => r.path).join('\n') + '\n');

const order = (t: string) => (t[0] === 'A' ? 0 : 1000) + parseInt(t.slice(1), 10);
for (const [t, rs] of [...byT.entries()].sort((a, b) => order(a[0]) - order(b[0])))
	console.log(`${t}\t${rs.reduce((s, r) => s + r.w, 0)} words\t${rs.length} files\t${rs[0]!.cls}`);
console.log(`TOTAL\t${rows.reduce((s, r) => s + r.w, 0)} words\t${rows.length} files`);
if (unassigned.length) console.log(`UNASSIGNED (tier A):\n${unassigned.join('\n')}`);
