// The laws the code must wear, one test each: the silent-success trap (bar 5),
// the posture law at both gates (bar 6), the budget ceiling (bar 7),
// lost-stream re-derivation (bar 8) and the timeout (bar 9). Every one of them
// exists because C4 measured the hazard, not because it seemed prudent.
import { test, expect } from "bun:test";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { load } from "../engine.ts";
import { isRefusal } from "../refusal.ts";
import { ignite } from "../spawn.ts";
import { verdict } from "../sense.ts";
import { readTranscript, transcriptPath, verdictFromTranscript } from "../transcript.ts";
import { freshRun, HERE, must, SCRATCH, streamVerdict } from "./harness.ts";

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
		{ scenario: "orphan-finish", expect: "worked", lands: false },
		{ scenario: "permission-denial", expect: "denied", lands: false },
		{ scenario: "die-137", expect: "dead", lands: false },
		// C13 — the state C6 could not reach transcript-only. The step report is
		// the input of the `StructuredOutput` call the schema turns it into, so
		// the disk alone lands the turn: throw the whole stream away and the
		// outcome is unchanged, report and all.
		{ scenario: "schema-done", expect: "worked", lands: true },
	] as const;

	for (const c of cases) {
		const runDir = `${SCRATCH}/lost-stream/${c.scenario}`;
		rmSync(runDir, { recursive: true, force: true });
		mkdirSync(`${runDir}/work`, { recursive: true });
		const venue = { workDir: `${runDir}/work`, configDir: `${runDir}/config` };
		const sessionId = crypto.randomUUID();
		const spawned = ignite({
			step: { kind: "task", id: c.scenario, depends: [], model: "sonnet", effort: "low",
				posture: "auto", timeoutMs: 20_000, prompt: `lost-stream/${c.scenario}`,
				subject: { fake: { scenario: c.scenario, seed: 3 } } },
			venue, sessionId, resume: false, prompt: `lost-stream/${c.scenario}`,
			stream: `${runDir}/streams/${c.scenario}.t0.jsonl`,
		});
		if (isRefusal(spawned)) throw new Error(spawned.refusal);

		const reading = await spawned.settled;
		const onDisk = readTranscript(transcriptPath(venue.configDir, venue.workDir, sessionId), 0);
		expect(onDisk.torn).toBe(0);
		expect([c.scenario, streamVerdict(reading)]).toEqual([c.scenario, c.expect]);
		expect([c.scenario, onDisk.verdict]).toEqual([c.scenario, c.expect]);
		// And the verdict the engine would record from each — the two sources agree
		// on the landing, and where they land they agree on the report itself.
		const streamed = verdict(reading), rederived = verdictFromTranscript(onDisk);
		expect([c.scenario, streamed.land]).toEqual([c.scenario, c.lands]);
		expect([c.scenario, rederived.land]).toEqual([c.scenario, c.lands]);
		if (streamed.land && rederived.land)
			expect([c.scenario, rederived.report]).toEqual([c.scenario, streamed.report]);
	}
}, 60_000);

// C13 bar 2 — the fake writes the real shape, checked against the real bytes.
//
// The fake is the only thing the barrage ever runs, so a rule measured on real
// transcripts is only guarded forever if the fake writes those rows too. C5 F2
// is the cautionary tale in the other direction: the fake was unfaithful in
// exactly the place a rule lived, and the barrage could not have caught C8 F3.
test("the fake closes a reporting turn on the real closing pair", async () => {
	const runDir = `${SCRATCH}/lost-stream/fake-shape`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(`${runDir}/work`, { recursive: true });
	const venue = { workDir: `${runDir}/work`, configDir: `${runDir}/config` };
	const sessionId = crypto.randomUUID();
	const spawned = ignite({
		step: { kind: "task", id: "shape", depends: [], model: "sonnet", effort: "low",
			posture: "auto", timeoutMs: 20_000, prompt: "fake-shape",
			subject: { fake: { scenario: "schema-done", seed: 3 } } },
		venue, sessionId, resume: false, prompt: "fake-shape",
		stream: `${runDir}/streams/shape.t0.jsonl`,
	});
	if (isRefusal(spawned)) throw new Error(spawned.refusal);
	await spawned.settled;

	const written = closing(readFileSync(transcriptPath(venue.configDir, venue.workDir, sessionId), "utf8"));
	const real = closing(readFileSync(`${HERE}/test/fixtures/real-c8-q1-smoke.jsonl`, "utf8"));
	expect(written.shape).toEqual(real.shape);
	expect(written.shape).toEqual(["assistant/tool_use:StructuredOutput", "user/tool_result"]);
	// Linked by id in both, and in both the id is what carries the report back.
	expect([written.linked, real.linked]).toEqual([true, true]);
	expect(written.report).toEqual({ state: "done", cause: "Wrote config.yaml with the requested port", answer: "config.yaml is in place." });
	expect(real.report).toEqual({ state: "done", cause: "n/a" });
}, 30_000);

/** The last two conversation rows of a transcript, as row types and as linkage. */
function closing(text: string): { shape: string[]; linked: boolean; report: unknown } {
	const rows = text.split("\n").filter((l) => l !== "").map((l) => JSON.parse(l) as Row);
	const conv = rows.filter((r) => r.type === "user" || r.type === "assistant").slice(-2);
	const blocks = (r: Row | undefined): Block[] => Array.isArray(r?.message?.content) ? r.message.content : [];
	const shape = conv.map((r) => `${r.type}/${blocks(r).map((b) => b.type + (b.name === undefined ? "" : `:${b.name}`)).join(",")}`);
	const call = blocks(conv[0]).find((b) => b.name === "StructuredOutput");
	const answer = blocks(conv[1]).find((b) => b.type === "tool_result");
	return { shape, linked: call !== undefined && answer !== undefined && call.id === answer.tool_use_id, report: call?.input };
}

type Block = { type?: string; name?: string; id?: string; tool_use_id?: string; input?: unknown };
type Row = { type?: string; message?: { content?: unknown } };

test("the engine refuses a log blessed on a different flow", () => {
	const a = flowFile({ id: "law-swap", budget: 2, steps: [task("t", "schema-done")] });
	const run = freshRun("law-swap", a);
	must(run.bless());
	const b = flowFile({ id: "law-swap", budget: 2, steps: [task("t", "echo")] });
	const swapped = load(b, { runDir: `${SCRATCH}/law-swap` });
	expect(isRefusal(swapped)).toBe(true);
	if (isRefusal(swapped)) expect(swapped.refusal).toContain("blessed on a different flow");
});

test("the real seam refuses in kind, and never resolves `claude` from PATH", () => {
	// The one exercise of the real arm in the tree. It cannot spawn: `HOME` is
	// blanked, and the adapter refuses a blank HOME before it opens a file or
	// touches `Bun.spawn` — the binary is addressed as ~/.local/bin/claude by
	// construction, never resolved from PATH, which is the cmux shim (C4 F0).
	const home = process.env.HOME;
	try {
		process.env.HOME = "";
		const refused = ignite({
			step: { kind: "task", id: "real", depends: [], model: "sonnet", effort: "low",
				posture: "auto", timeoutMs: 1_000, prompt: "never sent", subject: { real: {} } },
			venue: { workDir: SCRATCH, configDir: `${SCRATCH}/no-such-config` },
			sessionId: "00000000-0000-0000-0000-000000000000", resume: false,
			prompt: "never sent", stream: `${SCRATCH}/never-written.jsonl`,
		});
		expect(isRefusal(refused)).toBe(true);
		if (isRefusal(refused)) expect(refused.refusal).toContain("~/.local/bin/claude");
	} finally {
		process.env.HOME = home;
	}
	expect(existsSync(`${SCRATCH}/never-written.jsonl`)).toBe(false);
});
