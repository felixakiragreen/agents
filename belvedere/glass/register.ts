// The register — which directories are buildings, and which files carry which artifact.
//
// G1's E1 ruling, implemented here: **zero-cache scopes to CONTENT.** The register may be
// held warm; every board row, ledger tail, decision and issue the glass renders is re-read
// and re-parsed from disk on every single request.
//
// Why the split is not an optimisation but a law: the walk that finds the register is 4.4 s
// of bare filesystem over ~50 000 directories (B2 E1, re-measured at this build row), and
// `discover()` — which reads every `.md` to ask whether it staffs sessions — is 9–13 s. The
// content read those same files feed is **33 ms for the whole city**. Caching the slow half
// costs freshness in the one fact that changes weekly (is this directory a building?); it
// costs nothing in the facts that change hourly.
//
// One parser in the city (D65): every parse below is doctrine's own exported parser, run
// over the file list doctrine's own `discover()` chose. Nothing here re-implements a rule —
// this is `assemble()`'s re-read half, and `register.test.ts` pins it byte-equal to
// `discover()`'s output. The canon-inbox ask to give `doctrine/` this seam properly rides
// this row's findings.

import { readFileSync, statSync } from 'fs';
import {
	LIMITS, batonFails, classifyBaton, discover, lastWalk,
	parseBoards, parseDecisions, parseIssues, parseKickoffs, parseLedger,
	type Board, type Building, type Decision, type Fail, type Issue, type Kickoff, type LedgerEntry,
} from '../../doctrine';
import { CITY } from './paths';

/**
 * The staleness bar. G1's ruling caps the served register at 30 s; a refresh costs ~10 s and
 * starts only once the held copy is this old, so the copy a browsing session sees peaks at
 * TTL + walk ≈ 30 s. After an idle stretch the first request serves an older register and
 * says so — the printed age IS the ruling's honesty mechanism, and a 10 s stall on the
 * morning's first page load is the thing it exists to prevent.
 */
export const TTL_MS = 20_000;

export type Entry = { building: string; path: string; files: Building['files'] };
export type Register = { entries: Entry[]; at: number; ms: number; suppressed: number; refreshing: boolean };

let held: Register | null = null;
let refreshing = false;

function walk(): Register {
	const t0 = performance.now();
	const entries = discover([CITY]).map(b => ({ building: b.building, path: b.path, files: b.files }));
	return { entries, at: Date.now(), ms: performance.now() - t0, suppressed: lastWalk.suppressed, refreshing: false };
}

/**
 * The held register, refreshed off the request path. The refresh is deferred to a later tick
 * rather than awaited: the request that trips the TTL is served from the warm copy, and the
 * walk runs after the response is out. Bun is single-threaded, so that walk still blocks a
 * request arriving during it — a named cost on a single-user localhost glass, and the reason
 * `boot()` exists.
 */
export function register(): Register {
	if (!held) { held = walk(); return held; }
	if (!refreshing && Date.now() - held.at > TTL_MS) {
		refreshing = true;
		setTimeout(() => { try { held = walk(); } finally { refreshing = false; } }, 0);
	}
	return { ...held, refreshing };
}

/** Walk once at server start, so the first page Felix opens is already warm. */
export const boot = () => { if (!held) held = walk(); };

export const age = (r: Register) => Math.max(0, Date.now() - r.at) / 1000;

// ---------- content: re-read per request, always ----------

const read = (p: string) => {
	const size = statSync(p).size;
	if (size > LIMITS.bytes) throw new Error(`${p}: ${size} bytes exceeds the ${LIMITS.bytes}-byte limit`);
	return readFileSync(p, 'utf8');
};

/** One building, re-read and re-parsed from the register's file list. Mirrors `assemble()`. */
export function content(e: Entry): Building {
	const fails: Fail[] = [];
	const stamp = (fs: Fail[], file: string) => { for (const f of fs) f.file = file; return fs; };

	const board: Board[] = [];
	for (const f of e.files.boards) {
		const r = parseBoards(read(f));
		fails.push(...stamp(r.fails, f));
		for (const b of r.boards) board.push({ heading: b.heading, file: f, line: b.line, rows: b.rows });
	}

	let ledgerTail: LedgerEntry | null = null, baton: Building['baton'] = null;
	if (e.files.ledger) {
		const r = parseLedger(read(e.files.ledger));
		fails.push(...stamp(r.fails, e.files.ledger));
		ledgerTail = r.tail;
		baton = classifyBaton(r.tail);
		fails.push(...stamp(batonFails(baton, r.tail?.line ?? 0), e.files.ledger));
	}

	let decisionQueue: Decision[] = [];
	if (e.files.decisions) {
		const r = parseDecisions(read(e.files.decisions));
		fails.push(...stamp(r.fails, e.files.decisions));
		decisionQueue = r.queue;
	}

	let issues: Issue[] = [];
	if (e.files.issues) {
		const r = parseIssues(read(e.files.issues));
		fails.push(...stamp(r.fails, e.files.issues));
		issues = r.issues;
	}

	const kickoffs: (Kickoff & { doc: string })[] = [];
	for (const f of e.files.workDocs) {
		const r = parseKickoffs(read(f));
		fails.push(...stamp(r.fails, f));
		for (const k of r.kickoffs) kickoffs.push({ ...k, doc: f });
	}

	return { building: e.building, path: e.path, board, ledgerTail, baton, decisionQueue, issues, kickoffs, files: e.files, fails };
}

/**
 * The whole city, register-warm and content-fresh. A building whose files moved between the
 * walk and the read is reported as one lint failure, never as a dead page (glass-shatters).
 */
export function city(): { reg: Register; buildings: Building[] } {
	const reg = register();
	const buildings = reg.entries.map(e => {
		try { return content(e); }
		catch (err) {
			return {
				building: e.building, path: e.path, board: [], ledgerTail: null, baton: null,
				decisionQueue: [], issues: [], kickoffs: [], files: e.files,
				fails: [{ artifact: 'board' as const, code: 'register.stale', reason: `unreadable since the register walk: ${(err as Error).message}`, excerpt: e.path, file: e.path, line: 0 }],
			};
		}
	});
	return { reg, buildings };
}
