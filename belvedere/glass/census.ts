// The liveness sensor, read side. Two sensors, never one (P1 F5): the census says what a
// session was DOING; `kill -0 pid` says whether it still EXISTS. A state rendered from one
// of them is a lie waiting to happen — a hard kill leaves `Stop` as the last line forever.
//
// Record schema: P1 F6, written by `belvedere/census/beat.sh` (B1). This module only reads.

import { openSync, readSync, closeSync, statSync } from 'fs';
import { censusFile } from './paths';

/** Everything has a limit (directive 3.1): the tail we read, and the transcript window we scan. */
export const LIMITS = { tail: 4 << 20, transcript: 64 << 10 } as const;

/**
 * A working session heartbeats on every tool call. A gap this long with no `Stop` means the
 * sensor died, not that a tool ran for half an hour — and "working" would then be a lie.
 */
export const STALE_SECONDS = 30 * 60;

/** P1 F6's record, projected to what the spine renders. The dropped fields stay dropped. */
export type Beat = {
	t: number;              // jq `now` — epoch SECONDS, float. The sort key: file order is not causal (F4).
	ev: string;
	sid: string;
	acct: string | null;    // CLAUDE_CONFIG_DIR — which of the three accounts
	pid: number | null;     // CLAUDE_PID — the F5 liveness syscall
	ws: string | null;      // CMUX_WORKSPACE_ID — empty on every session outside a pane (hooks are venue-blind)
	sf: string | null;      // CMUX_SURFACE_ID — the panel `/hands/focus` jumps to
	cwd: string | null;
	tp: string | null;      // transcript_path — where the name-stamp lives
	tool: string | null;
	why: string | null;     // source // reason // notification_type // trigger
};

export type SessionState = 'working' | 'needs-input' | 'idle' | 'gone' | 'unknown';

export type Session = {
	sid: string;
	state: SessionState;
	last: Beat;
	beats: number;
	account: string | null; // the config dir verbatim; the label lookup is the caller's
	cwd: string | null;
	tool: string | null;
	stamp: string | null;   // the rig's name-stamp, read from the transcript
};

/** What one read of the census yielded — including what it could NOT read (parser-as-lint). */
export type CensusRead = { present: boolean; sessions: Session[]; beats: number; malformed: number };

// ---------- the state machine (pure — this is the tested core) ----------

/** P1's derived table. An event this map does not name renders unknown, never a guess. */
const BY_EVENT: Readonly<Record<string, SessionState>> = {
	SessionStart: 'idle',        // born, waiting for its first prompt
	UserPromptSubmit: 'working',
	PreToolUse: 'working',
	PostToolUse: 'working',
	SubagentStart: 'working',
	SubagentStop: 'working',
	PreCompact: 'working',
	Stop: 'idle',                // the real idle sensor — Notification is a 60 s nag (P1 F1)
	SessionEnd: 'gone',
};

/**
 * The F5 law, executable. `alive` is `kill -0 pid`: true, false, or null when no pid was
 * recorded and the question cannot be asked. Honesty over optimism at every branch.
 */
export function sessionState(last: Beat, alive: boolean | null, nowSeconds: number): SessionState {
	if (last.ev === 'SessionEnd') return 'gone';
	if (alive === false) return 'gone';       // F5: the census's last line was a lie
	if (alive === null) return 'unknown';     // cannot ask ⇒ cannot claim

	const base = last.ev === 'Notification'
		? (last.why === 'permission_prompt' ? 'needs-input' : 'idle')
		: BY_EVENT[last.ev] ?? 'unknown';

	// Only `working` decays. Idle and needs-input are quiescent by nature: a live pid that
	// last said `Stop` a week ago really is idle, and a permission prompt waits as long as
	// Felix takes. But a live pid that last said `PreToolUse` a week ago is a dead sensor.
	if (base === 'working' && nowSeconds - last.t > STALE_SECONDS) return 'unknown';
	return base;
}

/** `kill -0` — EPERM means the process exists and is not ours, which is still alive. */
export function isAlive(pid: number | null): boolean | null {
	if (pid === null) return null;
	try { process.kill(pid, 0); return true; }
	catch (e) { return (e as NodeJS.ErrnoException).code === 'EPERM'; }
}

// ---------- the read ----------

/**
 * `jq --arg` stringifies everything and yields `""` for an unset env var, so the record's
 * absent fields arrive as empty strings, never as null (B1's relay, batch-2 bulletin §1).
 * One boundary conversion, and the rest of the glass sees honest nulls.
 */
const str = (v: unknown): string | null => typeof v === 'string' && v !== '' ? v : null;

/** The parse boundary: F6's wire record in, a trusted `Beat` out, or null and a lint count. */
export function toBeat(raw: unknown): Beat | null {
	if (typeof raw !== 'object' || raw === null) return null;
	const r = raw as Record<string, unknown>;
	const t = typeof r.t === 'number' ? r.t : null;
	const sid = str(r.sid);
	const ev = str(r.ev);
	if (t === null || sid === null || ev === null) return null;   // no identity, no record
	const pid = Number(r.pid);                                    // `"89626"` — a STRING on the wire (bulletin §2)
	return {
		t, ev, sid,
		acct: str(r.acct),
		pid: Number.isInteger(pid) && pid > 0 ? pid : null,
		ws: str(r.ws), sf: str(r.sf),
		cwd: str(r.cwd), tp: str(r.tp), tool: str(r.tool), why: str(r.why),
	};
}

/** A bounded window of a file: `from: 'end'` for a log's tail, `'start'` for its head. */
function window(path: string, bytes: number, from: 'start' | 'end'): string | null {
	let fd: number;
	try { fd = openSync(path, 'r'); } catch { return null; }
	try {
		const size = statSync(path).size;
		const start = from === 'start' ? 0 : Math.max(0, size - bytes);
		const buf = Buffer.alloc(Math.min(size - start, bytes));
		readSync(fd, buf, 0, buf.length, start);
		const text = buf.toString('utf8');
		// Whole lines only: a partial edge line is dropped, never guessed at.
		if (start > 0) return text.slice(text.indexOf('\n') + 1);
		return buf.length < size ? text.slice(0, text.lastIndexOf('\n') + 1) : text;
	} finally { closeSync(fd); }
}

/**
 * The name-stamp the shelf resumes by (P4 §R) — the transcript's `agent-name` record, which
 * `claude -n <stamp>` writes within its first few lines. A session renamed after the window
 * reads as unstamped: honest, and cheaper than scanning a multi-megabyte transcript.
 */
function stampOf(transcript: string | null): string | null {
	if (!transcript) return null;
	const head = window(transcript, LIMITS.transcript, 'start');
	if (head === null) return null;
	const hits = [...head.matchAll(/"agentName":"((?:[^"\\]|\\.)*)"/g)];
	return hits.at(-1)?.[1] ?? null;
}

/** One read of the whole census: every session it has ever seen, stated as of now. */
export function readCensus(nowSeconds = Date.now() / 1000): CensusRead {
	const text = window(censusFile(), LIMITS.tail, 'end');
	if (text === null) return { present: false, sessions: [], beats: 0, malformed: 0 };

	const latest = new Map<string, Beat>();
	const counts = new Map<string, number>();
	let beats = 0, malformed = 0;
	for (const line of text.split('\n')) {
		if (!line.trim()) continue;
		let beat: Beat | null = null;
		try { beat = toBeat(JSON.parse(line)); } catch { beat = null; }
		if (!beat) { malformed++; continue; }
		beats++;
		counts.set(beat.sid, (counts.get(beat.sid) ?? 0) + 1);
		const prev = latest.get(beat.sid);
		if (!prev || beat.t >= prev.t) latest.set(beat.sid, beat);   // by timestamp, never by position (F4)
	}

	const sessions = [...latest.values()].map(last => ({
		sid: last.sid,
		state: sessionState(last, isAlive(last.pid), nowSeconds),
		last,
		beats: counts.get(last.sid) ?? 0,
		account: last.acct,
		cwd: last.cwd,
		tool: last.tool,
		stamp: stampOf(last.tp),
	})).sort((a, b) => b.last.t - a.last.t);

	return { present: true, sessions, beats, malformed };
}

export const isLive = (s: Session) => s.state !== 'gone';
