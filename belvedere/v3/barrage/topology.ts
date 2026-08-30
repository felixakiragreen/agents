// The generator — one seed in, one flow file out, byte for byte.
//
// Edges are forward-only **by construction**: step *i* may only depend on steps
// before it, so the graph cannot contain a cycle and the engine's cycle check is
// never the thing under test here. Everything else — size, kinds, width,
// scenarios, postures, the ceiling, the blessed scope — is drawn from the seed,
// each from its own named stream (`prng.ts`), so the same seed is the same flow
// on any machine and a red reproduces from its number alone.

import { fakeScenario, parseFlow, type Flow } from "../engine/flow.ts";
import { isRefusal } from "../engine/refusal.ts";
import { SCENARIOS, isHazard, type Row } from "./scenarios.ts";
import { stream } from "./prng.ts";

/** The charge's range. Small flows are the common case and big ones the tail:
 *  a cube of the draw puts the mean near 27 steps and still reaches 100. */
export const MIN_SIZE = 2;
export const MAX_SIZE = 100;

/** Legal (model, posture) pairs only — `(haiku, auto)` is refused at bless
 *  (grammar §4), and a refused blessing would test the generator, not the
 *  engine. The refusal has its own test in the engine. */
const MODELS = ["sonnet", "opus", "haiku"] as const;
const POSTURES = ["auto", "acceptEdits", "bypassPermissions"] as const;
const EFFORTS = ["low", "medium", "high"] as const;

export type Plan = {
	seed: number;
	size: number;
	/** The flow file's bytes. Same seed ⇒ same bytes, always. */
	text: string;
	flow: Flow;
	/** What the first blessing covers. A subset for some seeds — the driver
	 *  widens it later, which is the only amendment shape there is (C6 F8). */
	scope: string[];
	budget: number;
	/** True when `budget` is below the flow's fired-step count: the run will hit
	 *  the ceiling and need a re-blessing to finish. */
	tight: boolean;
};

/** `s00`, `s01`, … — zero-padded so the id sorts, and a file name either way:
 *  a step id names that step's stream files on disk. */
const idOf = (i: number, size: number): string => `s${String(i).padStart(String(size - 1).length, "0")}`;

export function topology(seed: number): Plan {
	const shape = stream(seed, "shape");
	const size = Math.min(MAX_SIZE, MIN_SIZE + Math.floor(shape.next() ** 3 * (MAX_SIZE - MIN_SIZE + 1)));

	const steps: Record<string, unknown>[] = [];
	let fired = 0;

	for (let i = 0; i < size; i++) {
		const rng = stream(seed, `step/${i}`);
		const id = idOf(i, size);
		const depends = edges(rng, i, size);

		if (i > 0 && rng.chance(0.07)) {
			steps.push({ id, kind: "card", depends, ask: `s${i}: rule this card — generated from seed ${seed}.` });
			continue;
		}
		fired++;
		const scenario: Row = rng.weighted(SCENARIOS, (s) => s.weight);
		const model = rng.pick(MODELS);
		steps.push({
			id,
			kind: i > 0 && rng.chance(0.11) ? "gate" : "task",
			depends,
			model,
			effort: rng.pick(EFFORTS),
			posture: model === "haiku" ? rng.pick(POSTURES.slice(1)) : rng.pick(POSTURES),
			timeout_ms: scenario.timeoutMs,
			subject: { fake: { scenario: scenario.name, seed: seed * 1000 + i } },
		});
	}

	// The ceiling (D73). Most flows carry slack for the resumes a ruling may
	// spend; some carry less than they need, so the run stops at the ceiling and
	// only a re-blessing finishes it.
	const purse = stream(seed, "purse");
	// A tight ceiling has to actually bite: most flows never ignite anywhere near
	// their fired-step count, because a step whose edge was killed never becomes
	// ready. A quarter is low enough to stop a run mid-flight; 0.6 was a ceiling
	// the run simply never reached.
	const tight = purse.chance(0.15) && fired > 1;
	const budget = tight ? Math.max(1, Math.min(fired - 1, Math.ceil(fired / 4))) : fired + Math.ceil(fired / 3);

	const all = steps.map((s) => s.id as string);
	const partial = purse.chance(0.2) && size >= 4;
	const scope = partial ? all.slice(0, Math.ceil(size / 2)) : all;

	const text = JSON.stringify({
		id: `t${seed}`,
		name: `barrage seed ${seed} — ${size} steps, budget ${budget}${partial ? ", blessed in halves" : ""}`,
		budget,
		steps,
	}, null, "\t") + "\n";

	const flow = parseFlow(text, `seed ${seed}`);
	if (isRefusal(flow)) throw new Error(`seed ${seed} generated a flow the engine refuses: ${flow.refusal}`);

	return { seed, size, text, flow, scope, budget, tight };
}

/** A quarter of the steps open a new root — that is where parallel width comes
 *  from. The rest take one to three edges, drawn from anywhere behind them. */
function edges(rng: { chance(p: number): boolean; int(lo: number, hi: number): number; weighted<T>(xs: readonly T[], w: (x: T) => number): T }, i: number, size: number): string[] {
	if (i === 0 || rng.chance(0.25)) return [];
	const want = rng.weighted([1, 2, 3], (k) => [70, 22, 8][k - 1]!);
	const picked = new Set<string>();
	for (let t = 0; t < want; t++) picked.add(idOf(rng.int(0, i - 1), size));
	return [...picked];
}

/** What the barrage's coverage report counts, per flow. */
export const carriesHold = (p: Plan): boolean => p.flow.steps.some((s) => s.kind === "gate" || s.kind === "card");
export const carriesHazard = (p: Plan): boolean =>
	p.flow.steps.some((s) => s.kind !== "card" && isHazard(SCENARIOS.find((r) => r.name === fakeScenario(s.subject))!));
export const scenariosIn = (p: Plan): string[] =>
	p.flow.steps.flatMap((s) => (s.kind === "card" ? [] : [fakeScenario(s.subject) ?? "real"]));
