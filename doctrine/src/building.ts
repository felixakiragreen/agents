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

import { readFileSync, readdirSync, statSync } from 'fs';
import { basename, dirname, join, relative, resolve, sep } from 'path';
import { homedir } from 'os';
import {
	batonFails, boardIds, classifyBaton, isLiveWorkDoc, parseBoards, parseDecisions, parseIssues,
	parseKickoffs, parseLedger,
	isBoardHeader, tables,
	type Baton, type BoardRow, type Decision, type Issue, type Kickoff, type LedgerEntry,
} from './parse';
import { strip, type Fail } from './grammar';

/** Everything has a limit (directive 3.1) — a walk that runs away is a bug, not a slow tool. */
export const LIMITS = { files: 40_000, bytes: 8 << 20, depth: 24 } as const;

// `lab/` is disposable code by DOCTRINE §3, `fixtures/` is a §6.2 control set, and
// `templates/` holds ⟨placeholders⟩, not filled artifacts: none of the three is corpus. All
// three stay lintable when named as an explicit root — the skip is on descent only.
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'target', 'vendor', 'coverage', '.venv', '__pycache__', '.next', '.cache', 'lab', 'fixtures', 'templates']);
const MASTER_DOCS = ['MAP.md', 'GENESIS.md', 'README.md'];
// C25's live list holds surfaces that staff nobody and so are no artifact: a building's master
// doc and its CLAUDE.md. They carry no board to parse, but they are law surfaces, so the
// vocabulary arm reads them — and only at a building's own anchor, never every README in a repo.
const PROSE_DOCS = [...MASTER_DOCS, 'CLAUDE.md'];
const WORKTREES = join('.claude', 'worktrees');

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
	issues: Issue[];
	kickoffs: (Kickoff & { doc: string })[];
	files: { boards: string[]; ledger: string | null; decisions: string | null; issues: string | null; workDocs: string[]; prose: string[] };
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

type FoundFile = { path: string; dir: string; kind: 'ledger' | 'decisions' | 'issues' | 'board' | 'workdoc' | 'prose' };

/** `<repo>/.claude/worktrees/<branch>/<rest>` — the branch checkout's coordinates, or null. */
function worktreePath(p: string): { repo: string; rest: string } | null {
	const i = p.indexOf(sep + WORKTREES + sep);
	if (i < 0) return null;
	const rest = p.slice(i + WORKTREES.length + 2).split(sep).slice(1).join(sep);
	return rest === '' ? null : { repo: p.slice(0, i), rest };
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
		&& staffsSessions(read(p)) && !staffsSessions(read(twin))) return 'keep';
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
		const w = worktreePath(f.path);
		if (!w) { kept.push(f); continue; }
		const key = `${w.repo}\u0000${w.rest}`;
		const prev = best.get(key);
		if (!prev) { best.set(key, f); continue; }
		lastWalk.suppressed++;
		if (statSync(f.path).mtimeMs > statSync(prev.path).mtimeMs) best.set(key, f);
	}
	return [...kept, ...best.values()];
}

function walk(root: string, out: FoundFile[], seen: Set<string>, depth = 0): void {
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
			walk(p, out, seen, depth + 1);
			continue;
		}
		if (!name.endsWith('.md') || seen.has(p)) continue;
		if (out.length >= LIMITS.files) throw new Error(`walk exceeded the ${LIMITS.files}-file limit at ${p}`);
		seen.add(p);
		if (branchOnlyBoard(p, name) === 'skip') { lastWalk.suppressed++; continue; }
		const kind: FoundFile['kind'] | null =
			name === 'LEDGER.md' ? 'ledger'
			: name === 'DECISIONS.md' ? 'decisions'
			: name === 'ISSUES.md' ? 'issues'
			: staffsSessions(read(p)) ? 'board'
			: inPlans ? 'workdoc'
			: PROSE_DOCS.includes(name) ? 'prose'
			: null;
		if (kind) out.push({ path: p, dir: root, kind });
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
	for (const r of roots) {
		const abs = resolve(r);
		if (statSync(abs).isDirectory()) walk(abs, found, seen);
		else { seen.add(abs); found.push({ path: abs, dir: dirname(abs), kind: classifyFile(abs) }); }
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
	return staffsSessions(read(p)) ? 'board' : 'workdoc';
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
	return parseFiles({
		building: slug(path), path,
		files: {
			boards,
			// The register's fallbacks are symmetric (item 10): a §3 subproject's decisions AND
			// ledger live inline in the master doc until they earn a file — silence was the bug.
			ledger: pick('ledger')[0] ?? (master && ledgerSection(read(master)) ? master : null),
			decisions: pick('decisions')[0] ?? master ?? null,
			issues: pick('issues')[0] ?? null,
			workDocs: [...pick('workdoc'), ...boards.filter(f => /(?:^|\/)(plans|spikes)\//.test(f))].sort(),
			// A building's own master doc and CLAUDE.md, and only its own: the anchor's directory,
			// never a nested package's README.
			prose: pick('prose').filter(f => dirname(f) === path),
		},
	});
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
	for (const f of e.files.boards) {
		const r = parseBoards(read(f), knownIds);
		fails.push(...stamp(r.fails, f));
		for (const b of r.boards) board.push({ heading: b.heading, file: f, line: b.line, rows: b.rows });
	}

	let ledgerTail: LedgerEntry | null = null, ledgerEntries = 0, baton: Baton | null = null;
	if (e.files.ledger) {
		// An inline ledger is the section, at its offset — a LEDGER.md is the whole file.
		const inline = basename(e.files.ledger) === 'LEDGER.md' ? null : ledgerSection(read(e.files.ledger));
		const r = parseLedger(inline ? inline.text : read(e.files.ledger));
		if (inline) {
			for (const f of r.fails) f.line += inline.offset;
			for (const en of r.entries) en.line += inline.offset;
		}
		fails.push(...stamp(r.fails, e.files.ledger));
		ledgerTail = r.tail;
		ledgerEntries = r.entries.length;
		baton = classifyBaton(r.tail);
		fails.push(...stamp(batonFails(baton, r.tail?.line ?? 0), e.files.ledger));
	}

	let decisionQueue: Decision[] = [], decisions = 0;
	if (e.files.decisions) {
		const r = parseDecisions(read(e.files.decisions));
		fails.push(...stamp(r.fails, e.files.decisions));
		decisionQueue = r.queue;
		decisions = r.decisions.length;
	}

	let issues: Issue[] = [];
	if (e.files.issues) {
		const r = parseIssues(read(e.files.issues));
		fails.push(...stamp(r.fails, e.files.issues));
		issues = r.issues;
	}

	const kickoffs: (Kickoff & { doc: string })[] = [];
	for (const f of e.files.workDocs) {
		const md = read(f);
		const r = parseKickoffs(md, { live: isLiveWorkDoc(md) });
		fails.push(...stamp(r.fails, f));
		for (const k of r.kickoffs) kickoffs.push({ ...k, doc: f });
	}

	return {
		building: e.building, path: e.path, board, ledgerTail, ledgerEntries, baton,
		decisions, decisionQueue, issues, kickoffs, files: e.files, fails,
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
