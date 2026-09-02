// The citation respell (043) — DOCTRINE §8's purge clause, executed. A citation of a killed
// register entry names the home that now carries the law, and STRIPS where it stands in that
// home: a citation is a pointer, and where the home is the citing document there is nothing to
// point at (043-F12, ⬡✓ 2026-09-02 — the ruling that reconciled 034-F4's strip with this
// charge's respell; 035 stripped MAP's 88 by hand first).
//
// Why this is not `migrate`'s respell (D80/D81, `respell.ts`): that table is DERIVED from a
// board and runs over every tracked file the building keeps, history included. This one is
// HAND-KEPT — D77 deleted the entries, so their homes live here or nowhere — and runs only over
// the live law surfaces. The ledger, the Log and the closed findings keep their ids: there a
// `D44` records what was decided that day, and respelling it would change meaning, not form.
//
// The converter carries FORM: three shapes per class, each a total line-scoped substitution a
// reviewer can defend by reading the diff. It never paraphrases and it never guesses. Two
// duties stay a human's, and the run reports both rather than inventing them:
//   · a citation the shapes do not consume — a possessive (`D28's law`), a narrative event
//     (`made law at D73`), a shape split by a hard wrap — is a HAND edit, landed BEFORE the
//     run (043's hand list). The run lists every one it left standing.
//   · a row names ONE home, the spine. Where an entry legislated two clauses that now live in
//     two sections (D45, D63, D73, D74) the spine is a default, and a citation leaning on the
//     other section is a hand edit too. The converter cannot read which clause a sentence
//     leans on; the diff is read whole for exactly this.

import { basename, join, resolve } from 'path';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

/** One killed id: where its law lives today, and what a citation of it writes abroad. */
export type Home = {
	/** the killed id, as the corpus writes it */
	id: string;
	/** the killed entry's title — the record, so no reader digs the pre-purge commit for it */
	entry: string;
	/** the home document, building-relative; `''` where no live document carries the law */
	file: string;
	/** what a cross-citation writes in the id's place — `‹file› §‹n›, ‹the rule's short name›` */
	home: string;
};

/**
 * The 39 killed ids the live law surfaces cite (043's table, every home re-read at the desk).
 * The ids NOT here are the converter's own fence: another building's register (D9–D12, D15,
 * D22 and the two qualified by hand), a form being shown (D1, D19), a `BOARD.md` record
 * (D2, D32, D34, D36, D41, D76). The table IS the licence — no row, no edit.
 *
 * The next D78 kill appends its rows from the killed entries' homes.
 */
export const HOMES: Home[] = [
	{ id: 'D4',  entry: 'composition model — what a session cannot finish becomes a charge', file: 'canon/work/DOCTRINE.md', home: 'DOCTRINE §5, the charge doc' },
	{ id: 'D5',  entry: 'non-goals v1',                            file: 'MAP.md',                    home: 'MAP §6, non-goals' },
	{ id: 'D8',  entry: 'the full pre-minted grid',                file: 'canon/mantles/README.md',   home: 'the mantles README, the tier grid' },
	{ id: 'D18', entry: 'board law',                               file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §4, one ignitable unit' },
	{ id: 'D25', entry: 'the naming law',                          file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §3, the naming law' },
	{ id: 'D26', entry: 'the null mantle',                         file: 'canon/mantles/README.md',   home: 'the mantles README, the null mantle' },
	{ id: 'D27', entry: 'the silo law',                            file: 'MAP.md',                    home: 'MAP §6, the silo law' },
	{ id: 'D28', entry: 'the parallel-affordable law',             file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §4, parallel-safe is not parallel-affordable' },
	{ id: 'D31', entry: 'the hive and the city — canon voice',     file: 'docs/the-city.md',          home: 'the-city.md, the framing glossary' },
	{ id: 'D33', entry: 'the dream (`initial.md` → `dream.md`)',   file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §3, the file set' },
	{ id: 'D37', entry: 'the Guild',                               file: 'canon/CLAUDE.md',           home: 'the global CLAUDE.md, THE AGENTS CANON' },
	{ id: 'D39', entry: 'the Architect line — reserved, unminted', file: 'MAP.md',                    home: 'MAP §10, the horizon' },
	{ id: 'D42', entry: 'the baton law',                           file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §11, the baton' },
	{ id: 'D43', entry: "serial chains are the tender's",          file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §10, every batch has a tender' },
	{ id: 'D44', entry: 'gates are charges',                       file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §4, gates are charges' },
	{ id: 'D45', entry: 'the summons line is load-bearing',        file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §5, the single-glance test' },
	{ id: 'D46', entry: 'the baton has one holder',                file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §11, ambiguity is the sin' },
	{ id: 'D48', entry: 'the merge-gate laws',                     file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §4, gates that merge' },
	{ id: 'D49', entry: "ISSUES.md — the canon repo's inbox",      file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §3, the ISSUES.md law' },
	{ id: 'D50', entry: "the bulletin's worktree law",             file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §9, late relocation' },
	{ id: 'D51', entry: 'the city, the hive, and the waggle',      file: 'docs/the-city.md',          home: 'the-city.md, the framing glossary' },
	{ id: 'D53', entry: 'ISSUES.md generalizes',                   file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §3, the ISSUES.md law' },
	{ id: 'D54', entry: 'the pre-authorization law',               file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §5, pre-authorization' },
	{ id: 'D55', entry: 'the venue law',                           file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §10, the venue law' },
	{ id: 'D56', entry: 'the verdict law',                         file: 'canon/mantles/architect.md', home: 'architect.md, the verdict law' },
	{ id: 'D57', entry: 'the batch is amendable mid-flight',       file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §10, a running batch is amendable' },
	{ id: 'D58', entry: 'the linking law',                         file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §3, the linking law' },
	{ id: 'D60', entry: 'GENESIS becomes MAP',                     file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §3, the file set' },
	{ id: 'D61', entry: 'the tending default',                     file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §10, every batch has a tender' },
	{ id: 'D62', entry: 'the Mentat — the sixth mantle',           file: 'canon/mantles/mentat.md',   home: 'mentat.md' },
	{ id: 'D63', entry: 'the schema fold + the molt clause',       file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §4, the board grammar' },
	{ id: 'D64', entry: 'the baton grammar',                       file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §11, the three shapes' },
	{ id: 'D65', entry: 'v3 — the molt (the serialization ruling)', file: 'canon/work/DOCTRINE.md',   home: 'DOCTRINE §3, the serialization law' },
	{ id: 'D67', entry: 'dispatch visibility — the announce duty', file: 'plans/TENDER.md',           home: 'plans/TENDER.md, announce each ignition' },
	{ id: 'D69', entry: 'PARKED is an annotation',                 file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §4, the DEFERRED annotation' },
	{ id: 'D71', entry: "the Guild's Standard",                    file: 'canon/work/STANDARD.md',    home: 'STANDARD.md' },
	{ id: 'D73', entry: 'the flow doctrine',                       file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §10, the flow' },
	{ id: 'D74', entry: 'the flow fold — the grammar',             file: 'canon/work/DOCTRINE.md',    home: 'DOCTRINE §4, typed holds' },
	{ id: 'D75', entry: "the directives' scope splits on lifetime", file: 'canon/CLAUDE.md',          home: 'the global CLAUDE.md, the SCOPE clause' },
];

/**
 * The fence: the canon repo's LIVE law surfaces. `canon/**` minus the Dispatcher tombstone,
 * whose head declares its body "preserved as history, unedited"; the master doc; `docs/`.
 * Out: `LEDGER.md`, `LOG.md`, `log-archive.md`, the findings in `plans/`, the live register
 * entries — history keeps its names — and `BOARD.md`, whose D-ids are records of what was
 * decided that day (043-F6), not pointers at law.
 */
export const TOMBSTONE = 'canon/mantles/dispatcher.md';
export const onFence = (rel: string) =>
	rel !== TOMBSTONE && rel.endsWith('.md')
	&& (rel.startsWith('canon/') || rel.startsWith('docs/') || rel === 'MAP.md');

// ---------- the shapes ----------

/**
 * A citation, and nothing that merely looks like one: not glued to a word, not the tail of a
 * qualified foreign id (`belvedere:D11` — D80's form, and the reason this is a lookbehind),
 * not a markdown link's label (`[D19](DECISIONS.md)`).
 */
const TOKEN = /(?<![\w:\[-])D(\d{1,3})(?![\w-])/g;

/** The separators a citation may lead a parenthetical with, and the ones it may trail one by. */
const LEADS = [', ', '; ', ': ', ' — '];
const TRAILS = [', ', '; ', ' — ', '/'];

/** Which characters sit inside a code-tick span — a form being SHOWN is never a citation (F5). */
function tickMask(line: string, open: boolean): boolean[] {
	const flags = new Array<boolean>(line.length).fill(false);
	let inside = open;
	for (let i = 0; i < line.length; i++) {
		if (line[i] === '`') { inside = !inside; flags[i] = true; continue; }
		flags[i] = inside;
	}
	return flags;
}

/** Does this line leave a tick span open for the next one? */
const ticksLeftOpen = (line: string, open: boolean) => ((line.match(/`/g)?.length ?? 0) % 2 === 1) !== open;

export type CiteEdit = { line: number; from: string; to: string; rule: string };
/** A bare `D‹n›` still standing after the run: `owned` when the table has a row for it. */
export type Bare = { line: number; id: string; owned: boolean; text: string };
export type CiteRun = { file: string; before: string; after: string; edits: CiteEdit[]; bare: Bare[] };

/**
 * One line, right to left. Right to left because a pair falls out of the single rules that way
 * and only that way: `(D63; D74)` loses `; D74` as a trailing citation, leaving `(D63)` for the
 * whole-parenthetical rule; left to right the first rule would eat the separator the second one
 * needs. Editing rightwards never moves an earlier match's index.
 */
function respellLine(rel: string, line: string, open: boolean, byId: Map<string, Home>) {
	const flags = tickMask(line, open);
	const hits = [...line.matchAll(TOKEN)].filter(m => !flags[m.index]);
	const rules: string[] = [];
	const left: { id: string; owned: boolean }[] = [];
	const owned: { id: string; owned: boolean }[] = [];
	let out = line;

	for (const m of hits.reverse()) {
		const row = byId.get(m[0]);
		if (!row) { left.push({ id: m[0], owned: false }); continue; }
		owned.push({ id: row.id, owned: true });
		// The home is the citing file, or it is already named on this line: either way the
		// pointer points at where it stands, so it strips (F12's ruling; rule 2's redundancy).
		const strip = row.file === rel || (!!row.file && line.includes(basename(row.file)));
		const s = m.index, e = s + m[0].length;
		const before = out.slice(0, s), after = out.slice(e);
		const lead = LEADS.find(sep => after.startsWith(sep));
		const trail = TRAILS.find(sep => before.endsWith(sep));

		// A `/` joins two ids into ONE citation. Stripping a self id out of the pair is total —
		// the id vanishes — but spelling a home into the middle of it writes a pointer nobody
		// wrote, so a crossing pair goes to the hand.
		const pair = trail === '/' && !strip;

		// `(D48).` alone on a wrapped line: the sentence it ends opened on the line above, so a
		// strip would leave a line holding one full stop. A shape split by a hard wrap is a hand
		// edit (043's spec) — the converter is line-scoped and says so instead of guessing.
		if (before.endsWith('(') && after.startsWith(')') && (!strip || before.trim() !== '(')) {
			const cut = before.endsWith(' (') ? s - 2 : s - 1;
			out = strip ? out.slice(0, cut) + after.slice(1) : before + row.home + after;
			rules.push(`${row.id} whole${strip ? ' strip' : ' → home'}`);
		}
		else if (before.endsWith('(') && lead) {
			out = before + (strip ? '' : `${row.home} — `) + after.slice(lead.length);
			rules.push(`${row.id} leads${strip ? ' strip' : ' → home'}`);
		}
		else if (trail && !pair && /^\.?\)/.test(after)) {
			out = before.slice(0, before.length - trail.length) + (strip ? '' : ` — ${row.home}`) + after;
			rules.push(`${row.id} trails${strip ? ' strip' : ' → home'}`);
		}
		else left.push({ id: row.id, owned: true });    // no shape — a hand edit, never a guess
	}
	// All or nothing per line. A line the shapes consume only PARTLY is the green-but-wrong
	// genus: half a citation respelled reads as finished work and is not. The hand list lands
	// before this run, so a blocked line here means a hand edit was missed — say so, edit
	// nothing, and report the line's OTHER citations too: a consumed one on a reverted line is
	// as unconverted as its neighbour, and a census that forgets it reads zero while it stands.
	if (left.length) return { to: line, rules: [], left: [...owned, ...left.filter(b => !b.owned)] };
	if (rules.length) assertClean(line, out, rules);
	return { to: out, rules, left };
}

/**
 * A strip closes a gap; a scar means the shape was wrong about its own edges. Every seam a rule
 * can leave is checked, and a hit throws: this is a converter bug, not a doc defect (migrate.ts's
 * own law). The seams are compared, never merely counted — the corpus already writes `  ` inside
 * a table cell and `(` beside a tick.
 */
const SEAMS = [/ {2}/g, /\( /g, / \)/g, / ,/g, / ;/g, / \./g, /\(\)/g, /,,/g];

function assertClean(from: string, to: string, rules: string[]): void {
	if (!to.trim() || /^[\s.,;)]+$/.test(to)) throw new Error(`citations: ${rules.join(' + ')} emptied a line — ${JSON.stringify(from)}`);
	for (const seam of SEAMS) {
		const was = from.match(seam)?.length ?? 0, now = to.match(seam)?.length ?? 0;
		if (now > was) throw new Error(`citations: ${rules.join(' + ')} left a ${seam.source} scar — ${JSON.stringify(to)}`);
	}
}

export function respellCitations(rel: string, md: string, homes: Home[] = HOMES): CiteRun {
	const byId = new Map(homes.map(h => [h.id, h]));
	const lines = md.split('\n');
	const edits: CiteEdit[] = [], bare: Bare[] = [];
	const out: string[] = [];
	let open = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]!;
		const { to, rules, left } = respellLine(rel, line, open, byId);
		open = ticksLeftOpen(line, open);
		if (rules.length) edits.push({ line: i + 1, from: line, to, rule: rules.reverse().join(' + ') });
		for (const b of left) bare.push({ line: i + 1, id: b.id, owned: b.owned, text: to });
		out.push(to);
	}
	return { file: rel, before: md, after: out.join('\n'), edits, bare };
}

// ---------- the run ----------

/** The fenced surfaces the building tracks — an ignored file is not the building's record. */
export function citationTargets(root: string): string[] {
	const tracked = execSync('git ls-files -z', { cwd: resolve(root), encoding: 'utf8', maxBuffer: 16 << 20 })
		.split('\0').filter(Boolean);
	return tracked.filter(onFence);
}

export function respellBuilding(root: string, homes: Home[] = HOMES): CiteRun[] {
	return citationTargets(root)
		.map(rel => respellCitations(rel, readFileSync(join(resolve(root), rel), 'utf8'), homes))
		.filter(r => r.edits.length || r.bare.length);
}

export function writeRun(root: string, r: CiteRun): void {
	writeFileSync(join(resolve(root), r.file), r.after, 'utf8');
}

/** The table as a reader sees it before a byte moves — the derivation nobody can refuse. */
export function renderHomes(homes: Home[] = HOMES): string {
	const pad = Math.max(...homes.map(h => h.id.length));
	return homes.map(h => `  ${h.id.padEnd(pad)} → ${h.file ? h.home : 'no live home'}`).join('\n');
}

export function diffRun(r: CiteRun): string {
	const out = [`--- ${r.file}`, `+++ ${r.file} (doctrine citations)`];
	for (const e of r.edits) { out.push(`@@ line ${e.line} @@  [${e.rule}]`, `-${e.from}`, `+${e.to}`); }
	return out.join('\n');
}
