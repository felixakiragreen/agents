// Replay — the run log alone re-derives the exact state (invariant 7). This is
// the redundancy half of the bet: a killed engine, restarted, folds its own log
// and knows everything it knew, with no scheduling replayed and no clock read.
//
// Determinism lives here, never in scheduling: parallel steps finish in whatever
// order they finish in, and the log records that order as fact.
//
// The fold is deliberately lenient — it records what the log says even when the
// log contradicts itself. Judging a log is `invariants.ts`'s job, and an oracle
// that cannot be fed a corrupt log is an oracle nobody has seen fail.

import type { Flow, Step } from "./flow.ts";
import { stepById } from "./flow.ts";
import { readLog, type Entry, type Sensed } from "./log.ts";
import { mutant } from "./mutant.ts";
import type { Cause, Report } from "./sense.ts";

export type StepState =
	| { at: "pending" }
	| { at: "running"; sessionId: string; pid: number; since: number }
	/** The turn is read and recorded; its verdict is not yet a transition. The
	 *  window a crash falls into between the two appends — and the reason the
	 *  reading rides the event: a restart resolves it without re-reading. */
	| { at: "ended"; sessionId: string | null; sensed: Sensed }
	| { at: "paused"; causes: Cause[]; detail: string; sessionId: string | null }
	| { at: "landed"; report: Report | null }
	| { at: "killed"; reason: string };

export type RunState = {
	flow: Flow | null;
	/** The blessed scope: the step ids anything may ignite within (D11, D12). */
	scope: string[];
	budget: number;
	/** Subject turns spent — ignitions and resumes both cost (D73). */
	turns: number;
	/** Turns spent per step. It names the step's stream files (`streamPath`),
	 *  so a restart addresses the stream of the turn actually in flight. */
	spent: Record<string, number>;
	ceiling: boolean;
	halted: string | null;
	steps: Record<string, StepState>;
};

export const replay = (logPath: string): RunState => fold(readLog(logPath));

export function fold(entries: readonly Entry[]): RunState {
	const state: RunState = {
		flow: null, scope: [], budget: 0, turns: 0, spent: {}, ceiling: false, halted: null, steps: {},
	};
	const set = (id: string, at: StepState) => { state.steps[id] = at; };

	for (const e of entries) {
		switch (e.kind) {
			case "blessed":
				state.flow = e.flow;
				state.scope = [...e.scope];
				state.budget = e.budget;
				for (const s of e.flow.steps) state.steps[s.id] ??= { at: "pending" };
				break;
			case "re-blessed":
				state.scope = [...new Set([...state.scope, ...e.scope])];
				state.budget = e.budget;
				state.ceiling = false;             // the whole point of a re-blessing: the ceiling moved
				break;
			case "ignited":
			case "resumed":
				state.turns++;
				state.spent[e.step] = (state.spent[e.step] ?? 0) + 1;
				set(e.step, { at: "running", sessionId: e.sessionId, pid: e.pid, since: e.seq });
				break;
			case "turn-ended":
				set(e.step, { at: "ended", sessionId: e.sessionId, sensed: e.sensed });
				break;
			case "landed":
				set(e.step, { at: "landed", report: e.report });
				break;
			case "paused":
				set(e.step, { at: "paused", causes: e.causes, detail: e.detail, sessionId: sessionOf(state, e.step) });
				break;
			case "ruled":
				break;                                     // a ruling is followed by the transition it caused
			case "killed":
				set(e.step, { at: "killed", reason: e.reason });
				break;
			case "halted":
				state.halted = e.reason;
				break;
			case "ceiling":
				state.ceiling = true;
				break;
		}
	}
	return state;
}

const sessionOf = (state: RunState, id: string): string | null => {
	const at = state.steps[id];
	if (at === undefined) return null;
	return at.at === "running" || at.at === "ended" || at.at === "paused" ? at.sessionId : null;
};

/** A step may ignite when it is in scope, still pending, and every edge landed.
 *  Two of the nine mutants live on these two lines (`mutant.ts`). */
export function ready(state: RunState, step: Step): boolean {
	if (state.halted !== null || state.ceiling) return false;
	if (!state.scope.includes(step.id) && !mutant("scope-jump")) return false;
	if (state.steps[step.id]?.at !== "pending") return false;
	return mutant("edge-jump") || step.depends.every((d) => state.steps[d]?.at === "landed");
}

export const running = (state: RunState): string[] =>
	Object.entries(state.steps).filter(([, s]) => s.at === "running").map(([id]) => id);

/** Turns read but not yet ruled into a transition — a restart's first duty. */
export const unresolved = (state: RunState): string[] =>
	Object.entries(state.steps).filter(([, s]) => s.at === "ended").map(([id]) => id);

/** Terminal: nothing is in flight and nothing more can move without a ruling. */
export function terminal(state: RunState): boolean {
	if (state.flow === null) return true;
	if (running(state).length > 0 || unresolved(state).length > 0) return false;
	if (state.halted !== null || state.ceiling) return true;
	return !state.flow.steps.some((s) => ready(state, s));
}

/**
 * The run's outcome, one line per step, with nothing in it that varies between
 * two runs of the same flow — no pids, no session ids, no sequence numbers.
 * The crash drill and the barrage both ask the same question of it: does the
 * restarted run end where the uncrashed one ended?
 */
export const verdicts = (state: RunState): Record<string, string> =>
	Object.fromEntries(Object.entries(state.steps).map(([id, at]) => [id,
		at.at === "paused" ? `paused ‹${at.causes.join(", ")}›`
		: at.at === "landed" ? `landed ${at.report?.state ?? "by ruling"}`
		: at.at === "killed" ? "killed"
		: at.at]));

export const stepOf = (state: RunState, id: string): Step | undefined =>
	state.flow === null ? undefined : stepById(state.flow, id);
