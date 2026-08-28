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
import { isAbsolute, join } from 'path';
import {
	LIMITS, batonFails, classifyBaton, discover, lastWalk,
	parseBoards, parseDecisions, parseIssues, parseKickoffs, parseLedger,
	type Board, type Building, type Decision, type Fail, type Issue, type Kickoff, type LedgerEntry,
} from '../../doctrine';
import { cityRoot } from './paths';

/**
 * The staleness bar, as the E1 ruling of 2026-08-27 set it: **300 s**. The walk is ~9.5 s of
 * filesystem over 50 795 directories, so a 20 s TTL re-walked the city about half the time Felix
 * was reading it — burning a core to re-learn a fact that changes weekly (B3 E1). Freshness is
 * not lost, it is redirected: the two things that move the register *within* a morning are the
 * glass's own fires and worktrees, and both call `bust()`, so the glass is never blind to its own
 * writes. Anything else — a building Felix minted by hand in another window — is the re-walk
 * button's job, one click beside the printed age.
 */
export const TTL_MS = 300_000;

export type Entry = { building: string; path: string; files: Building['files'] };
export type Register = {
	entries: Entry[]; at: number; ms: number; suppressed: number;
	refreshing: boolean;
	error: string | null;      // the last refresh that failed, still serving the warm copy
};

let held: Register | null = null;
let pending: Promise<void> | null = null;
let stale = false;
let error: string | null = null;

function walk(): Register {
	const t0 = performance.now();
	const entries = discover([cityRoot()]).map(b => ({ building: b.building, path: b.path, files: b.files }));
	return { entries, at: Date.now(), ms: performance.now() - t0, suppressed: lastWalk.suppressed, refreshing: false, error: null };
}

/**
 * The refresh, on a worker thread. Deferring it to a later tick is not enough: Bun runs one
 * JavaScript thread, so a nine-second synchronous walk on it stalls every request that arrives
 * while it runs — measured, before this changed, at p95 8.300 s over twenty 2 s-spaced requests
 * (`register.worker.ts`). A failed refresh is recorded and printed, never swallowed: the glass
 * keeps serving the warm copy and says the register stopped moving.
 */
function refresh(): Promise<void> {
	if (pending) return pending;                  // one walk at a time; a second would race the first
	const t0 = performance.now();
	// The worker cannot answer before this constructor returns, so `pending` is always assigned
	// before `done` can clear it.
	pending = new Promise<void>(settle => {
		const worker = new Worker(new URL('./register.worker.ts', import.meta.url).href);
		const done = (next: Register | null, why: string | null) => {
			if (next) held = next;
			error = why;
			pending = null;
			worker.terminate();
			settle();
		};
		worker.onmessage = (ev: MessageEvent<{ entries: Entry[]; at: number; suppressed: number }>) =>
			done({ ...ev.data, ms: performance.now() - t0, refreshing: false, error: null }, null);
		worker.onerror = (ev: ErrorEvent) =>
			done(null, `register refresh failed: ${ev.message || 'worker error'}`);
	});
	return pending;
}

/**
 * The held copy, refreshed off the request path AND off the request thread. The request that
 * trips the TTL — or finds the register busted — is served warm and starts the walk. The printed
 * age is the ruling's honesty mechanism: the glass never pretends the copy is newer than it is.
 */
export function register(): Register {
	if (!held) { held = walk(); stale = false; return held; }
	if (!pending && (stale || Date.now() - held.at > TTL_MS)) { stale = false; refresh(); }
	return { ...held, refreshing: pending !== null, error };
}

/**
 * The glass's own writes are never invisible to it (B8 §1). A fire or a worktree can mint the
 * very directory the register is a list of, so both mark it stale and the next request kicks the
 * walk. Marking beats walking here: the hand answers at once, and the walk still never rides a
 * request thread. A bust raised *during* a walk survives it — that walk began before the write.
 */
export const bust = () => { stale = true; };

/**
 * The button beside the printed age. It commands the glass's own memory, not the city — no fence
 * question (B8 §1) — and it answers only when the held copy IS the new walk, so one click is one
 * fresh page. A walk already in flight is joined rather than duplicated.
 */
export async function rewalk(): Promise<void> {
	if (pending) { await pending; return; }   // a walk is already running; joining beats racing it
	stale = false;
	await refresh();
}

/** Walk once at server start, on this thread: the first page Felix opens is already warm. */
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

/**
 * Where a building sits on disk. The register is the authority — it walked and found it — and the
 * fallback is doctrine's own rule (a slug is a path relative to the city root), with one guard for
 * a fixture city, where a building's name IS its absolute path (B10 F5).
 *
 * One function because two callers need the same answer for the same building and must not disagree:
 * the engine hands it to a judge as its venue, and the Works draws that judge's kickoff from it.
 */
export const buildingPath = (building: string, buildings: readonly Building[]): string =>
	buildings.find(b => b.building === building)?.path
	?? (isAbsolute(building) ? building : join(cityRoot(), building));
