// The laws the code must wear, one test each: the silent-success trap (bar 5),
// the posture law at both gates (bar 6), the budget ceiling (bar 7),
// lost-stream re-derivation (bar 8) and the timeout (bar 9). Every one of them
// exists because C4 measured the hazard, not because it seemed prudent.
import { test, expect } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { load } from "../engine.ts";
import { isRefusal } from "../refusal.ts";
import { ignite } from "../spawn.ts";
import { verdict } from "../sense.ts";
import { readTranscript, transcriptPath } from "../transcript.ts";
import { freshRun, must, SCRATCH, streamVerdict } from "./harness.ts";

type Spec = { id: string; budget: number; steps: unknown[] };

function flowFile(spec: Spec): string {
	const path = `${SCRATCH}/${spec.id}.json`;
	mkdirSync(SCRATCH, { recursive: true });
	writeFileSync(path, JSON.stringify({ name: spec.id, ...spec }));
	return path;
}

const task = (id: string, scenario: string, over: Record<string, unknown> = {}) => ({
	id, kind: "task", depends: [], model: "sonnet", effort: "low", posture: "auto",
	subject: { fake: { scenario, seed: 7 } }, ...over,
});

test("bar 5 — the denial scenario pauses needs-⬡ permission and never lands", async () => {
	const flow = flowFile({ id: "law-denial", budget: 2, steps: [task("t", "permission-denial")] });
	const run = freshRun("law-denial", flow);
	must(run.bless());
	const state = await run.run();
	const t = state.steps.t;
	expect(t?.at).toBe("paused");
	if (t?.at === "paused") {
		expect(t.causes[0]).toBe("needs-⬡ permission");
		expect(t.detail).toContain("permission denied: Write");
	}
}, 30_000);

test("bar 6 — (haiku, auto) is refused at bless, loudly, before anything ignites", () => {
	const flow = flowFile({ id: "law-haiku", budget: 2, steps: [task("t", "echo", { model: "haiku" })] });
	const run = freshRun("law-haiku", flow);
	const blessed = run.bless();
	expect(isRefusal(blessed)).toBe(true);
	if (isRefusal(blessed)) expect(blessed.refusal).toContain("haiku is granted `default`");
	expect(run.log.entries()).toEqual([]);
});

test("bar 6 — the posture-mismatch scenario is refused at read-back", async () => {
	const flow = flowFile({ id: "law-posture", budget: 2,
		steps: [task("t", "posture-mismatch", { model: "haiku", posture: "acceptEdits" })] });
	const run = freshRun("law-posture", flow);
	must(run.bless());
	const t = (await run.run()).steps.t;
	expect(t?.at).toBe("paused");
	if (t?.at === "paused") {
		expect(t.causes).toContain("posture");
		expect(t.detail).toContain("asked acceptEdits, init granted default");
	}
}, 30_000);

test("bar 7 — the ceiling holds at the budget, and one re-blessing extends it", async () => {
	const flow = flowFile({ id: "law-budget", budget: 1,
		steps: [task("a", "schema-done"), task("b", "schema-done", { subject: { fake: { scenario: "schema-done", seed: 8 } } })] });
	const run = freshRun("law-budget", flow);
	must(run.bless());
	const stopped = await run.run();
	expect(stopped.turns).toBe(1);
	expect(stopped.ceiling).toBe(true);
	expect(Object.values(stopped.steps).filter((s) => s.at === "pending").length).toBe(1);

	must(run.bless({ budget: 2 }));
	const extended = await run.run();
	expect(extended.turns).toBe(2);
	expect(extended.steps.a?.at).toBe("landed");
	expect(extended.steps.b?.at).toBe("landed");
	expect(run.bless({ budget: 1 })).toEqual({ refusal: "budget 1 is below the 2 turns already spent — a ceiling never moves down" });
}, 30_000);

test("bar 9 — a hung turn is SIGTERMed at its timeout and pauses ‹timeout›", async () => {
	const flow = flowFile({ id: "law-timeout", budget: 2, steps: [task("t", "hang", { timeout_ms: 700 })] });
	const run = freshRun("law-timeout", flow);
	must(run.bless());
	const t = (await run.run()).steps.t;
	expect(t?.at).toBe("paused");
	if (t?.at === "paused") expect(t.causes).toEqual(["timeout", "dead"]);
}, 30_000);

test("law 6 — a ruling may resume the turn on the same session", async () => {
	const flow = flowFile({ id: "law-resume", budget: 3, steps: [task("t", "resume-chain-4")] });
	const run = freshRun("law-resume", flow);
	must(run.bless());
	const first = await run.run();
	expect(first.steps.t?.at).toBe("paused");                 // no report: the chain scenario only echoes
	const session = first.steps.t?.at === "paused" ? first.steps.t.sessionId : null;

	must(await run.rule("t", { do: "resume", turn: "TURN1 — carry on" }));
	const after = run.state();
	expect(after.turns).toBe(2);
	expect(after.steps.t?.at === "paused" ? after.steps.t.sessionId : null).toBe(session);
	expect(run.log.entries().filter((e) => e.kind === "ignited").length).toBe(1);
	expect(run.log.entries().filter((e) => e.kind === "resumed").length).toBe(1);
}, 30_000);

test("bar 8 — the transcript-only outcome equals the streamed outcome", async () => {
	const cases = [
		{ scenario: "orphan-finish", expect: "worked" },
		{ scenario: "permission-denial", expect: "denied" },
		{ scenario: "die-137", expect: "dead" },
	] as const;

	for (const c of cases) {
		const runDir = `${SCRATCH}/lost-stream/${c.scenario}`;
		rmSync(runDir, { recursive: true, force: true });
		mkdirSync(`${runDir}/work`, { recursive: true });
		const venue = { workDir: `${runDir}/work`, configDir: `${runDir}/config` };
		const sessionId = crypto.randomUUID();
		const spawned = ignite({
			step: { kind: "task", id: c.scenario, depends: [], model: "sonnet", effort: "low",
				posture: "auto", timeoutMs: 20_000, subject: { fake: { scenario: c.scenario, seed: 3 } } },
			venue, sessionId, resume: false, prompt: `lost-stream/${c.scenario}`,
			stream: `${runDir}/streams/${c.scenario}.t0.jsonl`,
		});
		if (isRefusal(spawned)) throw new Error(spawned.refusal);

		const reading = await spawned.settled;
		const onDisk = readTranscript(transcriptPath(venue.configDir, venue.workDir, sessionId));
		expect(onDisk.torn).toBe(0);
		expect([c.scenario, streamVerdict(reading)]).toEqual([c.scenario, c.expect]);
		expect([c.scenario, onDisk.verdict]).toEqual([c.scenario, c.expect]);
		// And the verdict the engine would record from each: never landed, either way.
		expect(verdict(reading).land).toBe(false);
	}
}, 60_000);

test("the engine refuses a log blessed on a different flow", () => {
	const a = flowFile({ id: "law-swap", budget: 2, steps: [task("t", "schema-done")] });
	const run = freshRun("law-swap", a);
	must(run.bless());
	const b = flowFile({ id: "law-swap", budget: 2, steps: [task("t", "echo")] });
	const swapped = load(b, { runDir: `${SCRATCH}/law-swap` });
	expect(isRefusal(swapped)).toBe(true);
	if (isRefusal(swapped)) expect(swapped.refusal).toContain("blessed on a different flow");
});
