// The generator's own laws — the ones a red's seed depends on being true.
//
// If the flow file is not a pure function of the seed, a red file is a story
// about a run nobody can visit again. Everything else here is the shape the
// charge asks the barrage to reach.

import { test, expect } from "bun:test";
import { carriesHazard, carriesHold, scenariosIn, topology, MAX_SIZE, MIN_SIZE } from "./topology.ts";
import { SCENARIOS } from "./scenarios.ts";

const SEEDS = [1, 2, 3, 17, 5_000, 999_999];

test("same seed, byte-identical flow file", () => {
	for (const seed of SEEDS) expect([seed, topology(seed).text]).toEqual([seed, topology(seed).text]);
});

test("different seeds, different flows", () => {
	const texts = new Set(SEEDS.map((s) => topology(s).text));
	expect(texts.size).toBe(SEEDS.length);
});

test("edges are forward-only by construction, so no flow can carry a cycle", () => {
	for (let seed = 1; seed <= 300; seed++) {
		const { flow } = topology(seed);
		const before = new Set<string>();
		for (const step of flow.steps) {
			for (const dep of step.depends) expect([seed, step.id, dep, before.has(dep)]).toEqual([seed, step.id, dep, true]);
			before.add(step.id);
		}
	}
});

test("sizes stay inside the charge's 2–100, and the tail reaches both ends", () => {
	const sizes = Array.from({ length: 1_000 }, (_, i) => topology(i + 1).size);
	expect(Math.min(...sizes)).toBeGreaterThanOrEqual(MIN_SIZE);
	expect(Math.max(...sizes)).toBeLessThanOrEqual(MAX_SIZE);
	expect(Math.max(...sizes)).toBe(MAX_SIZE);
	expect(sizes.filter((s) => s <= 10).length).toBeGreaterThan(100);
});

test("a tight budget is genuinely below the fired-step count", () => {
	for (let seed = 1; seed <= 1_000; seed++) {
		const plan = topology(seed);
		if (!plan.tight) continue;
		const fired = plan.flow.steps.filter((s) => s.kind !== "card").length;
		expect([seed, plan.budget < fired]).toEqual([seed, true]);
	}
});

test("the coverage quotas hold over 1,000 flows", () => {
	const plans = Array.from({ length: 1_000 }, (_, i) => topology(i + 1));
	const seen = new Set(plans.flatMap(scenariosIn));

	// Every row the generator draws must actually appear. A weight-0 row is not
	// drawn on purpose (`scenarios.ts`), and must not appear.
	expect(SCENARIOS.filter((s) => s.weight > 0).map((s) => s.name).filter((n) => !seen.has(n))).toEqual([]);
	expect(SCENARIOS.filter((s) => s.weight === 0).map((s) => s.name).filter((n) => seen.has(n))).toEqual([]);
	expect(plans.filter(carriesHold).length / plans.length).toBeGreaterThanOrEqual(0.2);
	expect(plans.filter(carriesHazard).length / plans.length).toBeGreaterThanOrEqual(0.3);
	expect(plans.filter((p) => p.tight).length).toBeGreaterThan(0);
	expect(plans.filter((p) => p.scope.length < p.flow.steps.length).length).toBeGreaterThan(0);
});

test("every generated flow parses, and `(haiku, auto)` is never generated", () => {
	for (let seed = 1; seed <= 300; seed++)
		for (const step of topology(seed).flow.steps)
			if (step.kind !== "card") expect([seed, step.id, /haiku/i.test(step.model) && step.posture === "auto"]).toEqual([seed, step.id, false]);
});
