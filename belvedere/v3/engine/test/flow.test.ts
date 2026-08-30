// The flow file is parsed once at the boundary, and every way of being wrong is
// a refusal with a reason — never a throw, never a shrug, never a default that
// papers over the mistake.
import { test, expect } from "bun:test";
import { parseFlow } from "../flow.ts";
import { isRefusal } from "../refusal.ts";

const flow = (steps: unknown[], over: Record<string, unknown> = {}) =>
	parseFlow(JSON.stringify({ id: "f", name: "f", budget: 3, steps, ...over }), "test");

const task = (over: Record<string, unknown> = {}) => ({
	id: "t", kind: "task", depends: [], model: "sonnet", effort: "low", posture: "auto",
	subject: { fake: { scenario: "echo", seed: 1 } }, ...over,
});

const why = (v: ReturnType<typeof flow>): string => (isRefusal(v) ? v.refusal : "no refusal");

test("a well-formed flow parses into trusted shapes", () => {
	const f = flow([task(), { id: "c", kind: "card", depends: ["t"], ask: "ship?" }]);
	expect(isRefusal(f)).toBe(false);
	if (!isRefusal(f)) {
		expect(f.steps[0]).toMatchObject({ kind: "task", timeoutMs: 120_000 });
		expect(f.steps[1]).toEqual({ kind: "card", id: "c", depends: ["t"], ask: "ship?" });
	}
});

test("a card carries no subject and must say what it asks", () => {
	expect(why(flow([{ id: "c", kind: "card", depends: [] }]))).toContain("must say what it asks");
	expect(why(flow([{ id: "c", kind: "card", depends: [], ask: "?", subject: { fake: { scenario: "echo", seed: 1 } } }])))
		.toContain("never ignites");
});

test("an illegal posture is refused at the file, before any blessing", () => {
	expect(why(flow([task({ posture: "plan" })]))).toContain("posture must be one of");
	expect(why(flow([task({ posture: "manual" })]))).toContain("posture must be one of");
});

test("the depends graph must be a graph: known ids, no self-edges, no cycles", () => {
	expect(why(flow([task({ depends: ["nope"] })]))).toContain("unknown step");
	expect(why(flow([task({ depends: ["t"] })]))).toContain("depends on itself");
	expect(why(flow([task({ id: "a", depends: ["b"] }), task({ id: "b", depends: ["a"] })]))).toContain("cycle");
});

test("every flow carries its ceiling, and every step a distinct id", () => {
	expect(why(flow([task()], { budget: 0 }))).toContain("budget must be a positive integer");
	expect(why(flow([task(), task()]))).toContain("share the id");
});

test("a subject is exactly one arm, and the real arm declares nothing", () => {
	const real = flow([task({ subject: { real: {} } })]);
	expect(isRefusal(real)).toBe(false);
	if (!isRefusal(real)) expect(real.steps[0]).toMatchObject({ subject: { real: {} } });

	// The fields C8 might have been tempted to hang here: the account rides the
	// venue's config dir, the model and posture ride the step.
	expect(why(flow([task({ subject: { real: { account: "personal", venue: "/tmp" } } })])))
		.toContain("a real subject declares nothing");
	expect(why(flow([task({ subject: {} })]))).toContain("exactly one of");
	expect(why(flow([task({ subject: { fake: { scenario: "echo", seed: 1 }, real: {} } })]))).toContain("fake and real");
	expect(why(flow([task({ subject: { real: "yes" } })]))).toContain("real must be an object");
	expect(why(flow([task({ subject: { fake: { scenario: "echo" } } })]))).toContain("fake.seed must be an integer");
});
