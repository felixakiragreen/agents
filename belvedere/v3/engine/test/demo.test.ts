// Bar 2 — the demo flow end to end against the fake, and the claim the whole
// bet rests on: `replay(log)` is the state, exactly. Nothing here inspects the
// engine's memory; the log is asked, and the log answers.
import { test, expect } from "bun:test";
import { readLog } from "../log.ts";
import { fold, replay, terminal } from "../replay.ts";
import { invariants } from "../invariants.ts";
import { driveDemo, freshRun, HERE } from "./harness.ts";

const FIXTURE = `${HERE}/test/fixtures/demo-run.jsonl`;

test("the demo flow runs to its terminal state: 7 landed, 3 killed, nothing pending", async () => {
	const run = await driveDemo(freshRun("demo"));
	const state = run.state();

	const by = (at: string) => Object.entries(state.steps).filter(([, s]) => s.at === at).map(([id]) => id).sort();
	expect(by("landed")).toEqual(["card", "fan-a", "fan-b", "fan-c", "finish", "gate", "prep"]);
	expect(by("killed")).toEqual(["crash", "deny", "orphan"]);
	expect(by("pending")).toEqual([]);
	expect(by("running")).toEqual([]);
	expect(terminal(state)).toBe(true);
	expect(state.turns).toBe(9);
	expect(state.ceiling).toBe(false);
	expect(invariants(run.log.path)).toEqual([]);
}, 60_000);

test("replay(log) is the state, exactly", async () => {
	const run = await driveDemo(freshRun("demo-replay"));
	expect(replay(run.log.path)).toEqual(run.state());
});

test("the committed fixture replays to the same terminal state and is 9/9 green", () => {
	const state = fold(readLog(FIXTURE));
	expect(invariants(FIXTURE)).toEqual([]);
	expect(terminal(state)).toBe(true);
	expect(state.turns).toBe(9);
	expect(state.steps.gate).toEqual({ at: "landed", report: null });
	expect(state.steps.card).toEqual({ at: "landed", report: null });
	expect(state.steps.prep?.at).toBe("landed");
});

test("a gate never lands itself, and nothing downstream moves until it is ruled", async () => {
	const run = freshRun("demo-gate");
	run.bless();
	await run.run();
	const paused = run.state().steps.gate;
	expect(paused?.at).toBe("paused");
	if (paused?.at === "paused") expect(paused.causes).toContain("gate");
	expect(run.state().steps.card?.at).toBe("pending");
	expect(run.state().steps.finish?.at).toBe("pending");
}, 60_000);

test("a card never ignites: it pauses on its own ask and waits for the ruling", async () => {
	const run = freshRun("demo-card");
	run.bless();
	await run.run();
	await run.rule("gate", { do: "land", note: "ship" });
	await run.run();
	const card = run.state().steps.card;
	expect(card?.at).toBe("paused");
	if (card?.at === "paused") {
		expect(card.causes).toEqual(["card"]);
		expect(card.detail).toBe("The fan landed and the gate reported done. Ship it?");
	}
	expect(readLog(run.log.path).some((e) => e.kind === "ignited" && e.step === "card")).toBe(false);
}, 60_000);
