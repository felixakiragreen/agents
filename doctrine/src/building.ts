// Discovery: which directories are buildings, which files carry which artifact, and
// `parse(<building path>)` — the shape the glass imports (P3 §5, normative per D65).
//
// The register's law, general and per-repo-special-case-free:
//   A directory is a BUILDING (an "anchor") when it directly carries LEDGER.md,
//   DECISIONS.md, ISSUES.md, or a master doc that staffs sessions. Every other artifact
//   file belongs to its nearest ancestor anchor; a board file with no ancestor anchor
//   promotes its own directory (that is how `cap-mega/docs`' contract boards get a home).
//
// Worktrees are walked (four boards in the city live only there, P3 §1) and deduped by
// FILE: `<repo>/.claude/worktrees/<branch>/<rest>` is a branch checkout of `<repo>/<rest>`
// whenever that path exists — the ~40 stale copies vanish, the four originals stay.

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { basename, dirname, join, relative, resolve, sep } from 'path';
import { homedir } from 'os';
import {
	batonFails, boardIds, classifyBaton, isLiveWorkDoc, parseBoards, parseDecisions, parseIssues,
	escalationsIn, parseChargeHeader, parseKickoffs, parseLedgerPair, readiness, registerSizeFails,
	isBoardHeader, tables,
	type Baton, type BoardRow, type ChargeHeader, type Decision, type Escalation, type Issue, type Kickoff,
	type LedgerEntry, type Readiness,
} from './parse';
import { GATE_ID, fail, isLawBook, strip, type Fail } from './grammar';
import { scanCredits, type Credit, type CreditSources } from './credit';

/**
 * Everything has a limit (directive 3.1) — a walk that runs away is a bug, not a slow tool.
 * `ledgerTail` is the other kind: the count of entries `LEDGER.md` keeps before the rest age out
 * to `ledger-archive.md` (048, DOCTRINE §3 — one constant for the city, his to tune).
 */
export const LIMITS = { files: 40_000, bytes: 8 << 20, depth: 24, ledgerTail: 20 } as const;

// `lab/` is disposable code by DOCTRINE §3, `fixtures/` is a §6.2 control set, and
// `templates/` holds ⟨placeholders⟩, not filled artifacts: none of the three is corpus. All
// three stay lintable when named as an explicit root — the skip is on descent only.
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'target', 'vendor', 'coverage', '.venv', '__pycache__', '.next', '.cache', 'lab', 'fixtures', 'templates']);
const MASTER_DOCS = ['MAP.md', 'GENESIS.md', 'README.md'];
// 025's live list holds surfaces that staff nobody and so are no artifact: a building's master
// doc and its CLAUDE.md. They carry no board to parse, but they are law surfaces, so the
// vocabulary arm reads them — and only at a building's own anchor, never every README in a repo.
const PROSE_DOCS = [...MASTER_DOCS, 'CLAUDE.md'];
const WORKTREES = join('.claude', 'worktrees');
// The building register (D79) — an artifact of the building that keeps it, never an anchor:
// the city's register lives at `canon/BUILDINGS.md`, and canon is not a building.
const REGISTER_FILE = 'BUILDINGS.md';
/**
 * The ledger's archive (048) — bound to its `LEDGER.md`, never walked for. It is lowercase by
 * §3's naming law (an artifact read by nobody as protocol) and it anchors no building of its
 * own: the record is the pair, and a directory holding half a record is not a place to work.
 */
export const LEDGER_ARCHIVE = 'ledger-archive.md';

export type Board = { heading: string; file: string; line: number; rows: BoardRow[] };

/** Worktree checkouts the last walk skipped, so a report can say so out loud (no silent caps). */
export const lastWalk = { suppressed: 0 };

/** P3 §5's `Building`, amended for D63/D64 (staffing gate + rider, ledger tier, baton instruments). */
export type Building = {
	building: string;                 // the City View's key — path relative to ~/code
	path: string;
	board: Board[];                   // n boards per doc, n docs per building — both are corpus facts
	ledgerTail: LedgerEntry | null;
	ledgerEntries: number;            // entity count — the guard's gauge (item 18)
	baton: Baton | null;
	decisions: number;                // entity count — the guard's gauge (item 18)
	decisionQueue: Decision[];
	/** D90 — the register's entries his yes sized, in the register's own order. */
	magnitudes: Decision[];
	issues: Issue[];
	kickoffs: (Kickoff & { doc: string })[];
	/** §5's header, per work doc: the contract the charge doc carries about itself (032 (d), (e)). */
	charges: (ChargeHeader & { doc: string })[];
	escalations: Escalation[];        // §4's E-ids, merged across the building's boards (032 (c))
	readiness: Readiness[];           // §4's ignition rule, per row — what waits, and on what
	credits: Credit[];                // D82's statement, derived from this building's own graph
	files: { boards: string[]; ledger: string | null; ledgerArchive: string | null; decisions: string | null; issues: string | null; workDocs: string[]; prose: string[]; register: string | null };
	fails: Fail[];
};

const read = (p: string) => {
	const size = statSync(p).size;
	if (size > LIMITS.bytes) throw new Error(`${p}: ${size} bytes exceeds the ${LIMITS.bytes}-byte limit`);
	return readFileSync(p, 'utf8');
};

/**
 * D45 — any table that staffs sessions is a board. The word in a header CELL, not anywhere in
 * the line: prose that merely says "Staffing" is not a board, and the cheap regex alone once
 * promoted this repo's own findings doc.
 */
export const staffsSessions = (md: string) =>
	/^\s*\|.*\bStaffing\b.*\|\s*$/m.test(md)
	&& tables(md).some(t => isBoardHeader(t.header) || t.header.some(h => /^staffing$/i.test(strip(h))));

/**
 * A board is a table that staffs sessions IN A FILE THAT CAN. The law book cannot: `canon/`
 * SHOWS the board's five columns — DOCTRINE §4's example table is a header and no rows — and a
 * page that prints a form staffs nobody. Every arm that reads forms as data already fences this
 * directory (the vocabulary arm, the statement); board discovery was the one that did not, so
 * every `doctrine boot` and every lint total counted the law book as a board (044-F5).
 */
const isBoardFile = (p: string) => !isLawBook(p) && staffsSessions(read(p));

// `named` — the caller pointed at this file's own directory, so the twin skip does not touch it.
type FoundFile = { path: string; dir: string; kind: 'ledger' | 'decisions' | 'issues' | 'board' | 'workdoc' | 'prose' | 'register'; named: boolean };

/** One readdir per directory per walk — the checkout-root search asks the same directories often. */
const entryCache = new Map<string, string[]>();
function entriesOf(dir: string): string[] {
	const hit = entryCache.get(dir);
	if (hit) return hit;
	let names: string[];
	try { names = readdirSync(dir); } catch { names = []; }
	entryCache.set(dir, names);
	return names;
}

/**
 * `<repo>/.claude/worktrees/<branch…>/<rest>` — the branch checkout's coordinates, or null.
 *
 * A branch name carries as many path segments as it has slashes, so where the checkout root ends
 * is FOUND, never assumed — and it is found at the DIRECTORY, never at the file. A file-level
 * search cannot find it: a one-segment remainder's own dirname is `.`, which always exists, so
 * the search always "succeeded", and a branch-only `<checkout>/<dir>/LEDGER.md` was matched
 * against `<repo>/LEDGER.md` and skipped as its twin — the building vanished (039-F5).
 *
 * A checkout is a copy of the repo, so its root holds names the repo's root holds; a branch-name
 * prefix directory (`bv/` of `bv/029-summon-harness`) holds only the next segment, which is a
 * branch's word and not the repo's. The shallowest directory sharing a name with the mainline
 * root is the checkout — dot-entries excluded, because `.claude` is under every worktrees path
 * by construction.
 */
function worktreePath(p: string): { repo: string; rest: string } | null {
	const i = p.indexOf(sep + WORKTREES + sep);
	if (i < 0) return null;
	const repo = p.slice(0, i);
	const segs = p.slice(i + WORKTREES.length + 2).split(sep);
	const mainline = new Set(entriesOf(repo).filter(n => !n.startsWith('.')));
	let at = join(repo, WORKTREES);
	for (let k = 1; k < segs.length; k++) {
		at = join(at, segs[k - 1]!);
		if (entriesOf(at).some(n => mainline.has(n))) return { repo, rest: segs.slice(k).join(sep) };
	}
	return null;
}

/**
 * Worktrees are walked because four of the city's boards live only there (P3 §1) — and
 * skipped otherwise, because 35 full checkouts of one repo are one repo. The test is on the
 * ARTIFACT, not the file: a checkout whose mainline twin exists is that twin, unless the
 * branch put a board in a doc the mainline has none in (`docs/tig-avc.md`, exactly).
 * Size is the cheap identity gate, so an untouched checkout is never even read.
 */
function branchOnlyBoard(p: string, name: string): 'skip' | 'keep' {
	const w = worktreePath(p);
	if (!w) return 'keep';
	const twin = join(w.repo, w.rest);
	let twinSize: number;
	try { twinSize = statSync(twin).size; } catch { return 'keep'; }   // branch-only file
	if (name !== 'LEDGER.md' && name !== 'DECISIONS.md' && name !== 'ISSUES.md'
		&& twinSize !== statSync(p).size
		&& isBoardFile(p) && !isBoardFile(twin)) return 'keep';
	return 'skip';
}

/**
 * One artifact per (repo, relative path): 19 worktrees carrying `docs/cornerizer.md` are 19
 * checkouts of one board. The newest wins; the rest are counted, never silently dropped.
 */
function worktreeRepresentatives(files: FoundFile[]): FoundFile[] {
	const best = new Map<string, FoundFile>();
	const kept: FoundFile[] = [];
	for (const f of files) {
		const w = f.named ? null : worktreePath(f.path);
		if (!w) { kept.push(f); continue; }
		const key = `${w.repo}\u0000${w.rest}`;
		const prev = best.get(key);
		if (!prev) { best.set(key, f); continue; }
		lastWalk.suppressed++;
		if (statSync(f.path).mtimeMs > statSync(prev.path).mtimeMs) best.set(key, f);
	}
	return [...kept, ...best.values()];
}

/**
 * `named` is true for the directory the CALLER pointed at, and false for everything the walk
 * finds under it: the twin skip is for checkouts a walk DISCOVERS, never for a root someone
 * named. Pointed at a checkout, the reader reads that checkout's own books — or a gate running
 * in a worktree cannot lint its own ledger entry or its baton (simmy G21, 2026-09-08: `ledger
 * none · baton none · 0/0 ledgers parsed a tail` on a checkout whose board and kickoffs parsed).
 * The root's own files only: the twins deeper under it still dedupe, which is exactly what a
 * declared worktree root asks for (D79 — manny's checkout carries the mainline's books too).
 */
function walk(root: string, out: FoundFile[], seen: Set<string>, named: boolean, depth = 0): void {
	if (depth > LIMITS.depth) return;
	// withFileTypes spares one statSync per entry — 2.5× on the full-city walk (B2 §E1, item 15)
	let entries: import('fs').Dirent[];
	try { entries = readdirSync(root, { withFileTypes: true }); } catch { return; }
	const inPlans = /(?:^|\/)(plans|spikes)$/.test(root);
	for (const d of entries) {
		const name = d.name;
		const p = join(root, name);
		// a symlink still costs its stat — following one was the pre-fold behavior, kept
		const isDir = d.isDirectory() || (d.isSymbolicLink() && (() => { try { return statSync(p).isDirectory(); } catch { return false; } })());
		if (isDir) {
			if (SKIP_DIRS.has(name)) continue;
			if (name.startsWith('.') && name !== '.claude') continue;
			if (basename(root) === '.claude' && name !== 'worktrees') continue;
			walk(p, out, seen, false, depth + 1);
			continue;
		}
		if (!name.endsWith('.md') || seen.has(p)) continue;
		if (out.length >= LIMITS.files) throw new Error(`walk exceeded the ${LIMITS.files}-file limit at ${p}`);
		seen.add(p);
		if (!named && branchOnlyBoard(p, name) === 'skip') { lastWalk.suppressed++; continue; }
		const kind: FoundFile['kind'] | null =
			name === 'LEDGER.md' ? 'ledger'
			: name === 'DECISIONS.md' ? 'decisions'
			: name === 'ISSUES.md' ? 'issues'
			: name === REGISTER_FILE ? 'register'
			: isBoardFile(p) ? 'board'
			: inPlans ? 'workdoc'
			: PROSE_DOCS.includes(name) ? 'prose'
			: null;
		if (kind) out.push({ path: p, dir: root, kind, named });
	}
}

const isAnchor = (f: FoundFile) =>
	f.kind === 'ledger' || f.kind === 'decisions' || f.kind === 'issues'
	|| (f.kind === 'board' && MASTER_DOCS.includes(basename(f.path)));

function nearestAnchor(dir: string, anchors: Set<string>): string | null {
	for (let d = dir; ; d = dirname(d)) {
		if (anchors.has(d)) return d;
		if (dirname(d) === d) return null;
	}
}

/** Every building under `roots`, assembled and parsed. */
export function discover(roots: string[], extraAnchors: string[] = []): Building[] {
	const found: FoundFile[] = [];
	const seen = new Set<string>();
	lastWalk.suppressed = 0;
	entryCache.clear();
	for (const r of roots) {
		const abs = resolve(r);
		if (statSync(abs).isDirectory()) walk(abs, found, seen, true);
		else { seen.add(abs); found.push({ path: abs, dir: dirname(abs), kind: classifyFile(abs), named: true }); }
	}
	const live = worktreeRepresentatives(found);

	const anchors = new Set<string>(extraAnchors.map(a => resolve(a)));
	for (const f of live) if (isAnchor(f)) anchors.add(f.dir);
	// A board with no ancestor anchor promotes its own directory — shallowest first, so a
	// promotion can itself become the parent of a deeper orphan.
	for (const f of live.filter(x => x.kind === 'board').sort((a, b) => a.path.length - b.path.length))
		if (!nearestAnchor(f.dir, anchors)) anchors.add(f.dir);

	const byAnchor = new Map<string, FoundFile[]>([...anchors].map(a => [a, []]));
	for (const f of live) {
		const a = nearestAnchor(f.dir, anchors);
		if (a) byAnchor.get(a)!.push(f);
	}
	return [...byAnchor.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([path, fs]) => assemble(path, fs));
}

function classifyFile(p: string): FoundFile['kind'] {
	const n = basename(p);
	if (n === 'LEDGER.md') return 'ledger';
	if (n === 'DECISIONS.md') return 'decisions';
	if (n === 'ISSUES.md') return 'issues';
	if (n === REGISTER_FILE) return 'register';
	return isBoardFile(p) ? 'board' : 'workdoc';
}

const CODE = join(homedir(), 'code');
export const slug = (p: string) => p.startsWith(CODE + sep) ? relative(CODE, p) : p;

/** A master doc's own `## Ledger` (or `## 7. Ledger`) section — DOCTRINE §3 subprojects (item 10). */
function ledgerSection(md: string): { text: string; offset: number } | null {
	const lines = md.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const m = lines[i]!.match(/^(#{1,6})\s+(?:\d+\.\s+)?Ledger\s*$/i);
		if (!m) continue;
		let j = i + 1;
		for (; j < lines.length; j++) {
			const h = lines[j]!.match(/^(#{1,6})\s/);
			if (h && h[1]!.length <= m[1]!.length) break;
		}
		return { text: lines.slice(i + 1, j).join('\n'), offset: i + 1 };
	}
	return null;
}

function assemble(path: string, files: FoundFile[]): Building {
	const pick = (k: FoundFile['kind']) => files.filter(f => f.kind === k).map(f => f.path).sort();
	const boards = pick('board');
	const master = boards.find(f => MASTER_DOCS.includes(basename(f)));
	const ledger = pick('ledger')[0] ?? (master && ledgerSection(read(master)) ? master : null);
	// The archive is the LEDGER's, so it is found beside it and nowhere else: an inline ledger
	// (a §3 subproject's master-doc section) ages nothing, and a stray archive anchors nothing.
	const archive = ledger && basename(ledger) === 'LEDGER.md' ? join(dirname(ledger), LEDGER_ARCHIVE) : null;
	return parseFiles({
		building: slug(path), path,
		files: {
			boards,
			// The register's fallbacks are symmetric (item 10): a §3 subproject's decisions AND
			// ledger live inline in the master doc until they earn a file — silence was the bug.
			ledger,
			ledgerArchive: archive && existsSync(archive) ? archive : null,
			decisions: pick('decisions')[0] ?? master ?? null,
			issues: pick('issues')[0] ?? null,
			workDocs: [...pick('workdoc'), ...boards.filter(f => /(?:^|\/)(plans|spikes)\//.test(f))].sort(),
			// A building's own master doc and CLAUDE.md, and only its own: the anchor's directory,
			// never a nested package's README.
			prose: pick('prose').filter(f => dirname(f) === path),
			register: pick('register')[0] ?? null,
		},
	});
}

// ---------- §4's gates: a gate is a charge, and a charge is ignited from a kickoff ----------

type BoardSource = { file: string; md: string; rows: BoardRow[] };

/**
 * Every summons fence a document carries, whatever the document marks: this arm asks whether a
 * kickoff EXISTS and which charge it names, and a fence quoting a gate's summons into a batch
 * note is that gate's ignition, not the note's own kickoff (§5's marker is the work doc's law).
 * Form is the kickoff arm's business — the count is candidates, the texts the well-formed ones.
 */
function summonsFences(file: string | null): { count: number; texts: string[] } {
	if (!file || !existsSync(file)) return { count: 0, texts: [] };
	const r = parseKickoffs(read(file), { marker: false });
	return { count: r.fences, texts: r.kickoffs.map(k => k.text) };
}

/**
 * DOCTRINE §4 — *gates are charges*: a gate is ignited from a kickoff riding the batch note or
 * the gated charge's doc, so a staffed gate row no kickoff anywhere reaches is a charge nobody
 * can fire. stigmergon's 029 lay left G6 with neither, `doctrine lint` reported 32 kickoffs in
 * 34 work docs and 0 failures for it, and the batch paused with its tender refusing to author
 * one — a session round-trip a lint line would have saved (2026-09-02).
 *
 * Two ways to reach it: the row's own Work doc carries a fence, or a fence — in the board doc's
 * own notes, or in the doc of a charge the row Depends on — NAMES the gate, by id or by its
 * doc's path. A `⬡-gate` is never ignited (§4) and history is never re-ignited, so both are
 * exempt; so is a row whose Staffing is no mantle · tier, which fails as its own defect.
 */
function gateKickoffFails(boards: BoardSource[]): Fail[] {
	const fails: Fail[] = [];
	const docOf = new Map<string, string>();
	for (const b of boards) for (const r of b.rows) if (r.workDoc) docOf.set(r.id, join(dirname(b.file), r.workDoc));

	for (const b of boards) {
		const lines = b.md.split('\n');
		const notes = summonsFences(b.file).texts;
		for (const r of b.rows) {
			if (!GATE_ID.test(r.id) || r.hexGate || !r.mantle || !r.tier) continue;
			if (r.state === 'LANDED' || r.state === 'KILLED') continue;
			if (summonsFences(docOf.get(r.id) ?? null).count) continue;
			const namesGate = (text: string) =>
				new RegExp(`\\b${r.id}\\b`).test(text) || (r.workDoc !== null && text.includes(r.workDoc));
			const deps = r.dependsOn.flatMap(id => summonsFences(docOf.get(id) ?? null).texts);
			if ([...notes, ...deps].some(namesGate)) continue;
			const f = fail('board', 'board.gate-kickoff', 'a gate is a charge and a charge is ignited from its kickoff (DOCTRINE §4) — no fence in this row\'s Work doc, and none in the board\'s notes or a charge it Depends on names it', (lines[r.line - 1] ?? '').trim().slice(0, 300), r.line);
			f.file = b.file;
			fails.push(f);
		}
	}
	return fails;
}

/**
 * The re-read half — one building, parsed from its file list. THE seam the glass imports
 * (B3's ask): `discover()` chooses the files, this parses them, nobody hand-mirrors either.
 */
export function parseFiles(e: { building: string; path: string; files: Building['files'] }): Building {
	const fails: Fail[] = [];
	const stamp = (fs: Fail[], file: string) => { for (const f of fs) f.file = file; return fs; };

	// Depends-on resolves against the BUILDING's row ids, not the document's (D63e, item 7).
	const knownIds = new Set<string>();
	for (const f of e.files.boards) for (const id of boardIds(read(f))) knownIds.add(id);

	const board: Board[] = [];
	const sources: CreditSources = { boards: [], decisions: null, ledgerTail: null };
	for (const f of e.files.boards) {
		const md = read(f);
		const r = parseBoards(md, knownIds);
		fails.push(...stamp(r.fails, f));
		for (const b of r.boards) board.push({ heading: b.heading, file: f, line: b.line, rows: b.rows });
		sources.boards.push({ file: f, md, rows: r.boards.flatMap(b => b.rows) });
	}
	fails.push(...gateKickoffFails(sources.boards));
	const rows = board.flatMap(x => x.rows);

	let ledgerTail: LedgerEntry | null = null, ledgerEntries = 0, baton: Baton | null = null;
	if (e.files.ledger) {
		// An inline ledger is the section, at its offset — a LEDGER.md is the whole file.
		const inline = basename(e.files.ledger) === 'LEDGER.md' ? null : ledgerSection(read(e.files.ledger));
		// One record, two files (048): the count is over the pair, so an aging is no decrease;
		// the tail and the baton are the LEDGER's, because the archive is what nobody reboots from.
		const pair = parseLedgerPair(e.files.ledgerArchive ? read(e.files.ledgerArchive) : null, inline ? inline.text : read(e.files.ledger));
		const r = pair.ledger;
		if (inline) {
			for (const f of r.fails) f.line += inline.offset;
			for (const en of r.entries) en.line += inline.offset;
		}
		fails.push(...stamp(r.fails, e.files.ledger));
		if (pair.archive) fails.push(...stamp(pair.archive.fails, e.files.ledgerArchive!));
		ledgerTail = r.tail;
		ledgerEntries = pair.entries.length;
		baton = classifyBaton(r.tail);
		fails.push(...stamp(batonFails(baton, r.tail?.line ?? 0), e.files.ledger));
		if (r.tail) sources.ledgerTail = { file: e.files.ledger, line: r.tail.line, block: r.tail.block };
	}

	let decisionQueue: Decision[] = [], magnitudes: Decision[] = [], decisions = 0;
	if (e.files.decisions) {
		const md = read(e.files.decisions);
		const r = parseDecisions(md);
		fails.push(...stamp(r.fails, e.files.decisions));
		// The size nudge reads a REGISTER, and a §3 subproject's register is a section of its
		// master doc — that doc's size is the master doc's business, not §8's purge (048).
		if (basename(e.files.decisions) === 'DECISIONS.md') fails.push(...stamp(registerSizeFails(md), e.files.decisions));
		decisionQueue = r.queue;
		magnitudes = r.decisions.filter(d => d.magnitude !== null);
		decisions = r.decisions.length;
		sources.decisions = { file: e.files.decisions, md, entries: r.decisions.map(d => ({ id: d.id, date: d.date, line: d.line, magnitude: d.magnitude, credit: d.credit })) };
	}

	let issues: Issue[] = [];
	if (e.files.issues) {
		const r = parseIssues(read(e.files.issues));
		fails.push(...stamp(r.fails, e.files.issues));
		issues = r.issues;
	}

	const kickoffs: (Kickoff & { doc: string })[] = [];
	const charges: (ChargeHeader & { doc: string })[] = [];
	for (const f of e.files.workDocs) {
		const md = read(f);
		const r = parseKickoffs(md, { live: isLiveWorkDoc(md) });
		fails.push(...stamp(r.fails, f));
		for (const k of r.kickoffs) kickoffs.push({ ...k, doc: f });
		const h = parseChargeHeader(md, { live: isLiveWorkDoc(md) });
		fails.push(...stamp(h.fails, f));
		if (h.header) charges.push({ ...h.header, doc: f });
	}

	const credit = scanCredits(sources);
	fails.push(...credit.fails);

	return {
		building: e.building, path: e.path, board, ledgerTail, ledgerEntries, baton,
		decisions, decisionQueue, magnitudes, issues, kickoffs, charges,
		escalations: escalationsIn(rows), readiness: readiness(rows),
		credits: credit.credits, files: e.files, fails,
	};
}

/** The library's front door: one building, fully parsed. */
export function parse(buildingPath: string): Building {
	const abs = resolve(buildingPath);
	const all = discover([abs], [abs]);
	const self = all.find(b => b.path === abs);
	if (!self) throw new Error(`${buildingPath}: not a directory this parser can read as a building`);
	return self;
}
