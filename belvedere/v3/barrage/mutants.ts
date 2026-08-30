// The mutation check — campaign bar 3, and cornerstone §6's law:
//
//   *An oracle nobody has seen fail is a claim without evidence.*
//
// The engine carries nine planted law breaks ([mutant.ts](../engine/mutant.ts)),
// one per invariant class, each inert without `V3_ENGINE_MUTANT`. Here each one
// is run under the barrage on a **pinned seed**, and two things must hold: the
// oracle reds, naming that mutant's own invariant class; and the very same seed,
// unmutated, is green. The second half is what makes the first half mean
// anything — a seed that reds either way proves the oracle noisy, not sharp.
//
// The seeds are pinned rather than searched at run time because a mutant only
// fires where the topology gives it something to corrupt: `scope-jump` needs a
// flow blessed in halves, `past-ceiling` a budget below its step count,
// `land-denied` a subject that gets refused. Each row says what its seed had to
// have, and `bun run.ts --pin-mutants` re-derives the numbers if the generator
// ever changes shape.

import { rmSync } from "node:fs";
import { MUTANT, MUTANTS, type Mutant } from "../engine/mutant.ts";
import { runChild, outcomeOf } from "./child.ts";
import { judge, type Red } from "./oracle.ts";
import { sweep } from "./sweep.ts";

export type MutantRow = {
	name: Mutant;
	/** The invariant class the oracle must name when this mutant runs. */
	invariant: number;
	/** The law the planted line breaks, in the engine's own words. */
	law: string;
	/** What the pinned seed's topology had to offer for the mutant to fire. */
	needs: string;
	seed: number;
};

export const MUTANT_ROWS: readonly MutantRow[] = [
	{ name: "double-ignite", invariant: MUTANTS["double-ignite"], seed: 2000000,
		law: "a step ignites exactly once per blessing", needs: "any fired step" },
	{ name: "edge-jump", invariant: MUTANTS["edge-jump"], seed: 2000000,
		law: "nothing ignites before every edge has landed", needs: "a step with an edge" },
	{ name: "gate-lands-itself", invariant: MUTANTS["gate-lands-itself"], seed: 2000006,
		law: "a gate never lands itself — its report is the evidence a ruling is made on", needs: "a gate whose report says done" },
	{ name: "scope-jump", invariant: MUTANTS["scope-jump"], seed: 2000011,
		law: "nothing outside the blessed scope ignites", needs: "a flow blessed in halves" },
	{ name: "mute-pause", invariant: MUTANTS["mute-pause"], seed: 2000000,
		law: "a pause with no cause is a silent stall", needs: "anything that pauses" },
	{ name: "orphan-terminal", invariant: MUTANTS["orphan-terminal"], seed: 2000002,
		law: "nothing is in flight at a terminal state", needs: "parallel width, with one subject slower than another" },
	{ name: "act-before-append", invariant: MUTANTS["act-before-append"], seed: 2000000,
		law: "every transition is appended before it is acted on", needs: "a pause the harness rules" },
	{ name: "land-denied", invariant: MUTANTS["land-denied"], seed: 2000002,
		law: "a denial is needs-⬡, never a landing (parse rule 2)", needs: "a subject that gets refused" },
	{ name: "past-ceiling", invariant: MUTANTS["past-ceiling"], seed: 2000014,
		law: "the engine stops at the ceiling, never past it (D73)", needs: "a budget below the fired-step count" },
];

export type MutantResult = {
	row: MutantRow;
	/** The oracle named this mutant's invariant class on the mutated run. */
	caught: boolean;
	/** The same seed, unmutated, was green. */
	controlGreen: boolean;
	/** Subjects left breathing by the pair of runs, SIGTERMed here (C10 F4). A
	 *  mutant can strand one by design — `orphan-terminal` is the law "nothing is
	 *  in flight at a terminal state" removed — so this is routine, not a red. */
	swept: number[];
	classes: number[];
	controlReds: Red[];
};

export const passed = (r: MutantResult): boolean => r.caught && r.controlGreen;

/** Run one mutant on its pinned seed, and the same seed clean beside it. */
export async function checkMutant(row: MutantRow, root: string, capMs: number): Promise<MutantResult> {
	const mutatedDir = `${root}/${row.name}/mutated`;
	const controlDir = `${root}/${row.name}/control`;
	// A run dir holding a finished log replays as already terminal, and a mutant
	// that never got to run is not a mutant the oracle missed.
	rmSync(`${root}/${row.name}`, { recursive: true, force: true });

	await runChild(row.seed, mutatedDir, capMs, { [MUTANT]: row.name });
	await runChild(row.seed, controlDir, capMs);
	// Both runs are over and neither will be restarted, so anything of theirs
	// still breathing is an orphan. The crash drill's cut runs are the exception
	// this is deliberately not applied to — see sweep.ts.
	const swept = sweep(`${root}/${row.name}`);

	const mutated = judge(mutatedDir, outcomeOf(mutatedDir));
	const control = judge(controlDir, outcomeOf(controlDir));
	const classes = [...new Set(mutated.reds.map((r) => r.invariant))].sort((a, b) => a - b);

	return {
		row,
		caught: classes.includes(row.invariant),
		controlGreen: control.reds.length === 0,
		swept,
		classes,
		controlReds: control.reds,
	};
}

/** `--pin-mutants`: the first seed in range on which the mutant is caught and
 *  the clean control is green. Slow and deliberate — it is run by hand when the
 *  generator changes, never as part of the barrage. */
export async function searchSeed(row: MutantRow, from: number, to: number, root: string, capMs: number): Promise<number | null> {
	for (let seed = from; seed <= to; seed++) {
		const result = await checkMutant({ ...row, seed }, `${root}/search/${seed}`, capMs);
		if (passed(result)) return seed;
	}
	return null;
}
