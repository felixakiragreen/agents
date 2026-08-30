// The run log — append-only jsonl, one event per transition, each carrying
// enough to replay. v2's log was telemetry; this one is the flow's state
// (cornerstone §3.4): render it for transparency, replay it for redundancy,
// audit it for truth. The engine holds nothing between turns that is not here.
//
// The first event carries the flow itself, so a log is self-contained: `replay`
// and `invariants` need the file and nothing else.

import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Flow, Posture } from "./flow.ts";
import type { Cause, Reading, Report } from "./sense.ts";
import type { TranscriptReading } from "./transcript.ts";

/** Which evidence a turn was read from. The stream carries the report and the
 *  granted posture; the transcript carries neither, and says so (grammar §6). */
export type Sensed =
	| { source: "stream"; reading: Reading }
	| { source: "transcript"; reading: TranscriptReading };

/** What a ruling does. `resume` re-ignites the turn on the same session
 *  (`--resume`, C4 F7's resumability); there is no auto-retry in v1. */
export type Ruling =
	| { do: "land"; note: string }
	| { do: "kill"; note: string }
	| { do: "resume"; turn: string };

export type Event =
	| { kind: "blessed"; flow: Flow; scope: string[]; budget: number }
	| { kind: "re-blessed"; scope: string[]; budget: number }
	| { kind: "ignited"; step: string; sessionId: string; pid: number; venue: string;
		model: string; effort: string; posture: Posture; subject: string }
	| { kind: "resumed"; step: string; sessionId: string; pid: number; turn: string }
	| { kind: "turn-ended"; step: string; sessionId: string | null; sensed: Sensed }
	| { kind: "landed"; step: string; report: Report | null }
	| { kind: "paused"; step: string; causes: Cause[]; detail: string }
	| { kind: "ruled"; step: string; ruling: Ruling }
	| { kind: "killed"; step: string; reason: string }
	| { kind: "halted"; reason: string }
	| { kind: "ceiling"; budget: number; turns: number };

export type Entry = Event & { seq: number; at: string };

export type Log = { path: string; append(event: Event): Entry; entries(): Entry[] };

export function openLog(path: string): Log {
	mkdirSync(dirname(path), { recursive: true });
	let seq = existsSync(path) ? readLog(path).length : 0;
	return {
		path,
		append(event) {
			const entry: Entry = { seq: seq++, at: new Date().toISOString(), ...event };
			appendFileSync(path, JSON.stringify(entry) + "\n");
			return entry;
		},
		entries: () => readLog(path),
	};
}

/**
 * A torn line is not an expected failure — the engine appends whole lines, one
 * `appendFileSync` at a time. If one is unreadable the disk lied, and the run
 * log is the only truth there is, so this stops rather than guesses.
 */
export function readLog(path: string): Entry[] {
	if (!existsSync(path)) return [];
	const entries: Entry[] = [];
	for (const [i, line] of readFileSync(path, "utf8").split("\n").entries()) {
		if (line === "") continue;
		try { entries.push(JSON.parse(line) as Entry); }
		catch { throw new Error(`${path}:${i + 1}: torn run-log line — the log is the truth and this one is unreadable`); }
	}
	return entries;
}
