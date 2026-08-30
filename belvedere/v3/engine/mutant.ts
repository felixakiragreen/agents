// The mutant seam — the crash seam's sibling, for the other question a proving
// instrument has to answer.
//
//   V3_ENGINE_MUTANT=<name> bun cli.ts run <flow>
//
// Cornerstone §6's mutation law: *an oracle nobody has seen fail is a claim
// without evidence.* So the engine carries nine named law breaks, one per
// invariant class, each a single guarded line at the decision site it corrupts
// and each inert without the variable. C7's barrage runs every one of them and
// requires the oracle to red on the matching class.
//
// A seam, not a patch: a patch-based scheme would leave a dirty tree mid-run,
// which breaks the two-lane commit rule. Nothing here is reachable in a run the
// environment did not deliberately mutate.

export const MUTANT = "V3_ENGINE_MUTANT";

/** One per invariant class, named for the law it breaks — never for the code. */
export const MUTANTS = {
	"double-ignite": 1,
	"edge-jump": 2,
	"gate-lands-itself": 3,
	"scope-jump": 4,
	"mute-pause": 5,
	"orphan-terminal": 6,
	"act-before-append": 7,
	"land-denied": 8,
	"past-ceiling": 9,
} as const;

export type Mutant = keyof typeof MUTANTS;

export const mutant = (name: Mutant): boolean => process.env[MUTANT] === name;
