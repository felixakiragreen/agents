// The scenario table (C6 F7, ruled into shape by the C7 charge).
//
// C6 F7's warning: *transcript completeness is a declared scenario property,
// not an assumption* — a fuzzer that plants crash cuts on schema scenarios and
// assumes they read as finished will read every one of them as dead. So the
// property is declared here, one row per scenario, and
// [scenarios.test.ts](scenarios.test.ts) **measures** every row by spawning the
// scenario through the engine's own `ignite()`. A row nobody has run is a claim
// without evidence.
//
// After C7 step 0 the completeness column governs only the torn-stream
// fallback: a turn whose `result` reached the stream file is re-derived from
// that file, and only `die-*` and `hang` — the rows with `result: false` —
// fall through to the transcript. The barrage exercises that path naturally,
// because those three rows carry weight here.

import type { Posture } from "../engine/flow.ts";

/** What one turn of this scenario is, read off its own stream. */
export type Klass = "worked" | "denied" | "dead" | "hang";

export type Row = {
	name: string;
	klass: Klass;
	/** Does a `result` row reach the stream file? False ⇒ the restart falls to
	 *  the transcript (parse rule 1, C6 F2's ruled fix). */
	result: boolean;
	/** What `system/init` reports back, when the scenario overrides it — the
	 *  posture read-back fires on a mismatch whatever the flow asked (C4 F6.2). */
	grants: Posture | "default" | "plan" | null;
	/** Long enough for the scenario to finish, except `hang`, where the timeout
	 *  IS the outcome. Measured: `orphan-finish` 1.2 s, `slow-turn` 0.8 s. */
	timeoutMs: number;
	/** How often the generator draws it. The lander is common; the two that
	 *  cost real wall time are rare; the hazards are frequent enough to meet
	 *  the charge's ≥30 % quota. */
	weight: number;
	/** Acts the scenario scripts. A `--resume` past the last act is a subject
	 *  that dies at the door, so the driver resumes multi-act scenarios far more
	 *  often than single-act ones — both shapes are real, one is not the only
	 *  one worth fuzzing (C7 F1). */
	acts: number;
};

/** True of the three rows the charge's hazard quota counts. */
export const isHazard = (r: Row): boolean => r.klass !== "worked";

export const SCENARIOS: readonly Row[] = [
	// The lander. The only row whose report says `done`, so the only row that
	// lands with no ruling at all — everything else needs the harness.
	{ name: "schema-done", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 30, acts: 1 },

	// Reports that do not land.
	{ name: "schema-needs-input", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 6, acts: 1 },
	{ name: "schema-blocked", klass: "denied", result: true, grants: null, timeoutMs: 2_000, weight: 4, acts: 1 },

	// Turns that work and report nothing — the `no report` pause.
	{ name: "echo", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 6, acts: 1 },
	{ name: "one-tool", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 5, acts: 1 },
	{ name: "multi-tool", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 4, acts: 1 },
	{ name: "subagent-double-result", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 3, acts: 1 },
	{ name: "usage-cost", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 3, acts: 1 },
	{ name: "hook-events", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 3, acts: 1 },
	{ name: "rate-limit", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 3, acts: 1 },
	{ name: "thinking-noise", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 3, acts: 1 },
	{ name: "resume-chain-4", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 4, acts: 4 },

	// Arm B's scenarios run under arm A here: the engine spawns one process per
	// turn, so act 0 is all that plays. They are still distinct streams.
	{ name: "armb-paced-4", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 2, acts: 4 },
	{ name: "armb-merge-trap", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 2, acts: 4 },
	{ name: "armb-merge-trap-queued", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 2, acts: 4 },

	// The posture rows: init reports back something other than what was asked,
	// whatever was asked, so these always pause ‹posture›.
	{ name: "plan-noop", klass: "worked", result: true, grants: "plan", timeoutMs: 2_000, weight: 3, acts: 1 },
	{ name: "permission-denial", klass: "denied", result: true, grants: "default", timeoutMs: 2_000, weight: 5, acts: 1 },
	{ name: "posture-mismatch", klass: "denied", result: true, grants: "default", timeoutMs: 2_000, weight: 5, acts: 1 },

	// The deaths. `die-137` writes no `result`, so it is the torn stream the
	// transcript fallback exists for; `die-exit-1` writes one carrying is_error.
	{ name: "die-137", klass: "dead", result: false, grants: null, timeoutMs: 2_000, weight: 5, acts: 1 },
	{ name: "die-exit-1", klass: "worked", result: true, grants: null, timeoutMs: 2_000, weight: 4, acts: 1 },

	// The clock. `hang` never closes its turn; the other two just take a while.
	{ name: "hang", klass: "hang", result: false, grants: null, timeoutMs: 500, weight: 3, acts: 1 },
	{ name: "slow-turn", klass: "worked", result: true, grants: null, timeoutMs: 4_000, weight: 2, acts: 1 },
	{ name: "orphan-finish", klass: "worked", result: true, grants: null, timeoutMs: 5_000, weight: 2, acts: 1 },
];

export const byName = (name: string): Row => {
	const row = SCENARIOS.find((s) => s.name === name);
	if (row === undefined) throw new Error(`no scenario row for ${JSON.stringify(name)} — the table and the library have drifted`);
	return row;
};
