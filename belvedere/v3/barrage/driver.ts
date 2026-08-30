// The driver — law 2 made executable: **the harness is the caller.** The engine
// never blesses itself and never rules its own pauses, so something has to, a
// thousand times, unattended. This is that something.
//
// Every choice it makes is drawn from the run's seed and the step's id — never
// from the order things finished in. That is what lets runs execute in parallel
// and still be per-seed deterministic: two workers racing the same flow finish
// its parallel steps in different orders, and both make exactly the same
// rulings, because a ruling is a function of the step, not of the clock.

import { mkdirSync, writeFileSync } from "node:fs";
import { load } from "../engine/engine.ts";
import { isRefusal, type Refusal } from "../engine/refusal.ts";
import { replay, terminal, verdicts, type RunState } from "../engine/replay.ts";
import type { Ruling } from "../engine/log.ts";
import { fakeScenario, stepById } from "../engine/flow.ts";
import { stream } from "./prng.ts";
import { byName } from "./scenarios.ts";
import { topology, type Plan } from "./topology.ts";

/** Two rulings per step at most: the first may resume, the second must settle
 *  it. Without a bound a step that pauses on every turn never terminates. */
const MAX_ATTEMPTS = 2;
/** Blessings after the first: the scope widening, the ceiling raise, and one
 *  spare. Past that a run that still cannot move is stuck, and says so. */
const MAX_WIDENINGS = 3;
const MAX_PASSES = 400;

export type Stop = "terminal" | "no-progress" | "passes" | "cap";

export type Outcome = {
	seed: number;
	size: number;
	stop: Stop;
	turns: number;
	budget: number;
	passes: number;
	rulings: number;
	widenings: number;
	/** `replay(log)` ≡ `state()` at terminal — invariant 7's first half. */
	replayEqual: boolean;
	verdicts: Record<string, string>;
	wallMs: number;
};

export const flowPathIn = (runDir: string): string => `${runDir}/flow.json`;
export const outcomePathIn = (runDir: string): string => `${runDir}/outcome.json`;

/**
 * Drive one seed to a terminal state in its own run dir. Safe to call again on
 * the same run dir after the engine died: the log carries the blessing, and the
 * rulings are re-derived rather than remembered.
 */
export async function drive(seed: number, runDir: string, capMs: number): Promise<Outcome | Refusal> {
	const started = Date.now();
	const plan: Plan = topology(seed);
	mkdirSync(runDir, { recursive: true });
	writeFileSync(flowPathIn(runDir), plan.text);

	const run = load(flowPathIn(runDir), { runDir });
	if (isRefusal(run)) return run;

	if (run.state().flow === null) {
		const blessed = run.bless({ steps: plan.scope, budget: plan.budget });
		if (isRefusal(blessed)) return blessed;
	}

	const attempts = new Map<string, number>();
	let rulings = 0, widenings = 0, passes = 0;
	let stop: Stop = "terminal";

	for (;;) {
		if (passes++ >= MAX_PASSES) { stop = "passes"; break; }
		if (Date.now() - started > capMs) { stop = "cap"; break; }

		const before = run.log.entries().length;
		let now = await run.run();

		// The ceiling, and steps the first blessing never covered: both are the
		// same act — a wider blessing with a ceiling that never moves down (D73).
		if (widenings < MAX_WIDENINGS && (now.ceiling || outOfScope(now).length > 0)) {
			const wider = run.bless({ steps: plan.flow.steps.map((s) => s.id), budget: raise(now, plan) });
			if (!isRefusal(wider)) { widenings++; continue; }
		}

		let moved = false;
		for (const [id, at] of Object.entries(now.steps)) {
			if (at.at !== "paused") continue;
			const attempt = attempts.get(id) ?? 0;
			if (attempt >= MAX_ATTEMPTS) continue;
			attempts.set(id, attempt + 1);
			rulings++;
			moved = true;

			const ruled = await run.rule(id, rulingFor(seed, id, attempt, at.sessionId, now, actsOf(plan, id)));
			// A refused ruling is the engine holding a line — a resume with the
			// ceiling spent, say. Settle the step instead of arguing with it.
			if (isRefusal(ruled)) await run.rule(id, { do: "kill", note: `barrage: ${ruled.refusal}` });
			now = run.state();
		}

		if (terminal(run.state()) && !moved) break;
		if (!moved && run.log.entries().length === before) { stop = "no-progress"; break; }
	}

	const state = run.state();
	return {
		seed, size: plan.size, stop,
		turns: state.turns, budget: state.budget, passes, rulings, widenings,
		replayEqual: Bun.deepEquals(replay(run.log.path), state),
		verdicts: verdicts(state),
		wallMs: Date.now() - started,
	};
}

/** How many acts this step's subject scripts — one for most of the library. */
function actsOf(plan: Plan, stepId: string): number {
	const step = stepById(plan.flow, stepId);
	const scenario = step === undefined || step.kind === "card" ? null : fakeScenario(step.subject);
	return scenario === null ? 0 : byName(scenario).acts;
}

/** Steps the blessing never covered, still waiting with every edge landed. */
const outOfScope = (now: RunState): string[] =>
	Object.entries(now.steps)
		.filter(([id, at]) => at.at === "pending" && !now.scope.includes(id))
		.map(([id]) => id);

/** A ceiling only ever moves up (D73): enough for every fired step still to
 *  come, plus the resumes the rulings may spend. */
function raise(now: RunState, plan: Plan): number {
	const left = plan.flow.steps.filter((s) => s.kind !== "card" && now.steps[s.id]?.at === "pending").length;
	return Math.max(now.budget, now.turns + left + MAX_ATTEMPTS * 2);
}

/**
 * The ruling for one pause. Drawn from (seed, step, attempt) and nothing else —
 * not from what the pause said, and not from when it happened. A resume is only
 * ever the first attempt, and only where there is a session to resume: the
 * second attempt always settles the step, so the loop is bounded by
 * construction.
 */
export function rulingFor(seed: number, stepId: string, attempt: number, sessionId: string | null, now: RunState, acts: number): Ruling {
	const rng = stream(seed, `rule/${stepId}/${attempt}`);
	const canResume = attempt === 0 && sessionId !== null && now.turns < now.budget;
	const roll = rng.next();

	// A resume past the subject's last act is a turn that dies at the door, and
	// that is a real shape — just not the only one worth a third of the rulings.
	if (canResume && roll < (acts > 1 ? 0.35 : 0.1)) return { do: "resume", turn: `barrage ${seed}: carry on, ${stepId}.` };
	if (roll < 0.75) return { do: "land", note: `barrage ${seed}: ${stepId} ruled landed` };
	return { do: "kill", note: `barrage ${seed}: ${stepId} ruled killed` };
}
