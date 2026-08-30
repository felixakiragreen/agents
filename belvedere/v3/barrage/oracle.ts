// The oracle — cornerstone §5's nine, checked per run.
//
// Seven of the nine are pure functions of the run log and live in the engine's
// own [invariants.ts](../engine/invariants.ts). Two cannot be: **7 replay**
// asks whether the log re-derives the state, which needs the state; and
// **8 truth on disk** asks whether the log matches what the subjects actually
// wrote, which needs the disk. Both live here.
//
// Invariant 8 is the sharp one. For every turn the log says ended, the oracle
// re-reads that turn from its own stream file — the file the subject wrote, not
// the copy the engine saved — and re-derives the verdict from scratch. Where
// the stream is torn and the engine fell to the transcript, the oracle re-reads
// that too, past the spawn cursor the log recorded (C11): the disk names a turn
// now, so the check reaches the fallback path it used to skip. Since C13 that
// fallback can also **land** — the step report is in the transcript's closing
// `StructuredOutput` call — so the transcript answers the landing question here
// as well, and a reporting turn whose stream was cut mid-flight is expected to
// land from disk. The engine is allowed to know *more* than the disk (it
// watched the clock, so it may add ‹timeout›); it is never allowed to know
// less, and it is never allowed to land what the disk says did not land. That
// is the check a mutant that launders a denial into a landing dies on.

import { venueFor } from "../engine/engine.ts";
import { invariants, NINE } from "../engine/invariants.ts";
import { readLog, type Entry } from "../engine/log.ts";
import { fold, verdicts, type RunState } from "../engine/replay.ts";
import { senseFile, verdict, type Cause } from "../engine/sense.ts";
import { streamPath } from "../engine/spawn.ts";
import { readTranscript, transcriptPath, verdictFromTranscript } from "../engine/transcript.ts";
import { stepById, type Fired } from "../engine/flow.ts";
import type { Outcome } from "./driver.ts";

export type Red = { invariant: number; name: string; step: string; detail: string };

const red = (invariant: number, step: string, detail: string): Red =>
	({ invariant, name: NINE[invariant - 1]!, step, detail });

export type Judgement = {
	reds: Red[];
	state: RunState;
	/** The log's own account of where every step ended, run-to-run comparable. */
	verdicts: Record<string, string>;
};

/**
 * Judge one finished run. `outcome` is the driver's own report; a run whose
 * driver never finished (a crash cut, a wall cap) is judged without one.
 */
export function judge(runDir: string, outcome: Outcome | null): Judgement {
	const logPath = `${runDir}/run.jsonl`;
	const entries = readLog(logPath);
	const state = fold(entries);

	const reds: Red[] = invariants(logPath).map((v) => red(v.invariant, v.step, v.detail));

	// 7 — replay. `state()` is a fold of the log today, so this is a tripwire
	// rather than a discovery: it fires the day the engine starts holding
	// something the log does not carry.
	if (outcome !== null && !outcome.replayEqual)
		reds.push(red(7, "", "replay(log) is not the state the engine held at terminal"));
	if (outcome !== null && !Bun.deepEquals(outcome.verdicts, verdicts(state)))
		reds.push(red(7, "", "the driver's terminal verdicts and the log's fold disagree"));
	if (outcome !== null && outcome.stop !== "terminal")
		reds.push(red(5, "", `the run stopped on ${outcome.stop}, not on a terminal state — a stall the harness could not move`));

	reds.push(...truthOnDisk(runDir, entries, state));
	reds.push(...cleanTerminal(entries));

	return { reds, state, verdicts: verdicts(state) };
}

/** What one spawn recorded about the turn it started: which session wrote the
 *  transcript, and how many rows of it belonged to somebody else (C11). */
type Spawn = { sessionId: string; cursor: number };

/**
 * 8 — truth on disk. Every `turn-ended` is re-derived from the subject's own
 * stream file (C6 F2's ruled fix), falling to the transcript only when that
 * stream is torn, and compared with the transition the engine logged next.
 */
function truthOnDisk(runDir: string, entries: readonly Entry[], state: RunState): Red[] {
	const reds: Red[] = [];
	const flow = state.flow;
	if (flow === null) return reds;

	const spawnsOf = new Map<string, Spawn[]>();
	for (const e of entries)
		if (e.kind === "ignited" || e.kind === "resumed")
			spawnsOf.set(e.step, [...(spawnsOf.get(e.step) ?? []), { sessionId: e.sessionId, cursor: e.cursor }]);

	const turnOf = new Map<string, number>();
	for (const [i, e] of entries.entries()) {
		if (e.kind !== "turn-ended") continue;
		const step = stepById(flow, e.step);
		if (step === undefined || step.kind === "card") continue;

		const turn = turnOf.get(e.step) ?? 0;
		turnOf.set(e.step, turn + 1);

		// The transcript is consulted only where the engine itself fell to it: a
		// turn this engine timed out is read as the timeout it is and never
		// laundered through the disk's poorer view (engine.ts's `fromDisk`).
		const spawn = e.sensed.source === "transcript" ? spawnsOf.get(e.step)?.[turn] : undefined;
		const onDisk = fromDisk(runDir, step, turn, spawn);
		const after = entries.slice(i + 1).find((x) => "step" in x && x.step === e.step && (x.kind === "landed" || x.kind === "paused"));
		if (after === undefined) {
			reds.push(red(8, e.step, `turn ${turn} ended and was never resolved into a landing or a pause`));
			continue;
		}

		const landedInLog = after.kind === "landed";
		// A gate never lands itself (C6 F6): its report is the evidence a ruling
		// is made on, so a landing verdict is logged as a pause carrying ‹gate›.
		const expectedLanding = onDisk.land && step.kind !== "gate";
		if (expectedLanding !== landedInLog) {
			reds.push(red(8, e.step, `the disk says the turn ${onDisk.land ? "landed" : "did not land"}, the log says ${after.kind}`));
			continue;
		}

		if (after.kind === "paused" && onDisk.causes !== null) {
			const missing = onDisk.causes.filter((c) => !after.causes.includes(c));
			if (missing.length > 0)
				reds.push(red(8, e.step, `the disk names ${missing.join(", ")} and the pause does not — the log knows less than the disk`));
		}
	}
	return reds;
}

/**
 * The verdict for one turn, re-derived from the files the subject wrote, in the
 * engine's own order: stream file first (C6 F2's ruled fix), then — only where
 * `spawn` says the engine fell to it — the transcript, read past that turn's own
 * spawn cursor (C11).
 *
 * `causes: null` is the one honest gap: a torn stream with no transcript to fall
 * to says nothing beyond "not landed". Everywhere else the disk names the turn,
 * landing included: since C13 the transcript carries the step report, so a
 * reporting turn whose stream died is expected to **land** here too.
 */
function fromDisk(runDir: string, step: Fired, turn: number, spawn: Spawn | undefined): { land: boolean; causes: Cause[] | null } {
	const reading = senseFile(streamPath(runDir, step.id, turn), step.posture);
	if (!reading.dead) return told(verdict(reading));
	if (spawn === undefined) return { land: false, causes: null };
	const venue = venueFor(runDir);
	return told(verdictFromTranscript(
		readTranscript(transcriptPath(venue.configDir, venue.workDir, spawn.sessionId), spawn.cursor)));
}

const told = (v: { land: true } | { land: false; causes: Cause[] }): { land: boolean; causes: Cause[] } =>
	v.land ? { land: true, causes: [] } : { land: false, causes: v.causes };

/**
 * 6 — clean terminals, the half the log cannot see: every subject the run ever
 * spawned is gone. (Shared with invariant 8's "census ≡ `ps`".) A pid can in
 * principle be reused between the run ending and this check; at layer 0 the
 * window is milliseconds and the check has never been the flaky one.
 */
function cleanTerminal(entries: readonly Entry[]): Red[] {
	const reds: Red[] = [];
	for (const e of entries) {
		if (e.kind !== "ignited" && e.kind !== "resumed") continue;
		try {
			process.kill(e.pid, 0);
			reds.push(red(6, e.step, `subject pid ${e.pid} is still alive after the run reached its terminal state`));
		} catch { /* gone, as it must be */ }
	}
	return reds;
}
