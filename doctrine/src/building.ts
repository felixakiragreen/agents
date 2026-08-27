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
	batonFails, classifyBaton, parseBoards, parseDecisions, parseIssues, parseKickoffs, parseLedger,
	type Baton, type BoardRow, type Decision, type Issue, type Kickoff, type LedgerEntry,
} from './parse';
import type { Fail } from './grammar';

/** Everything has a limit (directive 3.1) — a walk that runs away is a bug, not a slow tool. */
export const LIMITS = { files: 40_000, bytes: 8 << 20, depth: 24 } as const;

// `lab/` is disposable code by DOCTRINE §3, `fixtures/` is a §6.2 control set, and
// `templates/` holds ⟨placeholders⟩, not filled artifacts: none of the three is corpus. All
// three stay lintable when named as an explicit root — the skip is on descent only.
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'target', 'vendor', 'coverage', '.venv', '__pycache__', '.next', '.cache', 'lab', 'fixtures', 'templates']);
const MASTER_DOCS = ['MAP.md', 'GENESIS.md', 'README.md'];
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
	baton: Baton | null;
	decisionQueue: Decision[];
	issues: Issue[];
	kickoffs: (Kickoff & { doc: string })[];
	files: { boards: string[]; ledger: string | null; decisions: string | null; issues: string | null; workDocs: string[] };
	fails: Fail[];
};

const read = (p: string) => {
	const size = statSync(p).size;
	if (size > LIMITS.bytes) throw new Error(`${p}: ${size} bytes exceeds the ${LIMITS.bytes}-byte limit`);
	return readFileSync(p, 'utf8');
};

/** D45 — any table that staffs sessions is a board. Cheap pre-filter before a full table parse. */
const staffsSessions = (md: string) => /^\|.*\|\s*$/m.test(md) && /^\s*\|.*\bStaffing\b.*\|\s*$/m.test(md);

type FoundFile = { path: string; dir: string; kind: 'ledger' | 'decisions' | 'issues' | 'board' | 'workdoc' };

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
	let entries: string[];
	try { entries = readdirSync(root); } catch { return; }
	const inPlans = /(?:^|\/)(plans|spikes)$/.test(root);
	for (const name of entries) {
		const p = join(root, name);
		let st;
		try { st = statSync(p); } catch { continue; }
		if (st.isDirectory()) {
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

function assemble(path: string, files: FoundFile[]): Building {
	const fails: Fail[] = [];
	const stamp = (fs: Fail[], file: string) => { for (const f of fs) f.file = file; return fs; };
	const pick = (k: FoundFile['kind']) => files.filter(f => f.kind === k).map(f => f.path).sort();

	const boardFiles = pick('board');
	const board: Board[] = [];
	for (const f of boardFiles) {
		const r = parseBoards(read(f));
		fails.push(...stamp(r.fails, f));
		for (const b of r.boards) board.push({ heading: b.heading, file: f, line: b.line, rows: b.rows });
	}

	const ledgerFile = pick('ledger')[0] ?? null;
	let ledgerTail: LedgerEntry | null = null, baton: Baton | null = null;
	if (ledgerFile) {
		const r = parseLedger(read(ledgerFile));
		fails.push(...stamp(r.fails, ledgerFile));
		ledgerTail = r.tail;
		baton = classifyBaton(r.tail);
		fails.push(...stamp(batonFails(baton, r.tail?.line ?? 0), ledgerFile));
	}

	// §3's split rule: decisions live in DECISIONS.md once they earn a file, in the master doc until then.
	const decisionsFile = pick('decisions')[0] ?? boardFiles.find(f => MASTER_DOCS.includes(basename(f))) ?? null;
	let decisionQueue: Decision[] = [];
	if (decisionsFile) {
		const r = parseDecisions(read(decisionsFile));
		fails.push(...stamp(r.fails, decisionsFile));
		decisionQueue = r.queue;
	}

	const issuesFile = pick('issues')[0] ?? null;
	let issues: Issue[] = [];
	if (issuesFile) {
		const r = parseIssues(read(issuesFile));
		fails.push(...stamp(r.fails, issuesFile));
		issues = r.issues;
	}

	const workDocs = [...pick('workdoc'), ...boardFiles.filter(f => /(?:^|\/)(plans|spikes)\//.test(f))].sort();
	const kickoffs: (Kickoff & { doc: string })[] = [];
	for (const f of workDocs) {
		const r = parseKickoffs(read(f));
		fails.push(...stamp(r.fails, f));
		for (const k of r.kickoffs) kickoffs.push({ ...k, doc: f });
	}

	return {
		building: slug(path), path, board, ledgerTail, baton, decisionQueue, issues, kickoffs,
		files: { boards: boardFiles, ledger: ledgerFile, decisions: decisionsFile, issues: issuesFile, workDocs },
		fails,
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
