// The arc `send <text>` drives, on the fake alone (C10 F2). Until C14 the
// console's most consequential verb — answer a paused subject and watch it land
// — was proven only by a real rehearsal, because no scenario could ask a
// question and then finish. `answer-then-land` can, so the arc is guarded at
// budget 0 forever.
import { test, expect } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { load } from "../engine.ts";
import { isRefusal } from "../refusal.ts";
import { senseFile } from "../sense.ts";
import { streamPath } from "../spawn.ts";
import { readTranscript, transcriptPath } from "../transcript.ts";
import { SCRATCH } from "./harness.ts";

const QUESTION = "Which release name goes in the sign-off?";
const MARKER = "ANSWER-THEN-LAND-OK";

function arc(name: string) {
	const runDir = `${SCRATCH}/${name}`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	const flowPath = `${runDir}/flow.json`;
	writeFileSync(flowPath, JSON.stringify({
		id: "arc", name: "ask, then land on the answer", budget: 3,
		steps: [{ id: "ask", kind: "task", depends: [], prompt: "arc/ask", timeout_ms: 10_000,
			subject: { fake: { scenario: "answer-then-land", seed: 3 } },
			model: "sonnet", effort: "low", posture: "acceptEdits" }],
	}));
	const run = load(flowPath, { runDir });
	if (isRefusal(run)) throw new Error(run.refusal);
	if (isRefusal(run.bless())) throw new Error("bless refused");
	return { run, runDir };
}

test("act 1 pauses ‹needs-⬡ question› carrying the question itself", async () => {
	const { run } = arc("arc-pause");
	const state = await run.run();
	const at = state.steps.ask;
	expect(at?.at).toBe("paused");
	if (at?.at === "paused") {
		expect(at.causes).toEqual(["needs-⬡ question"]);
		expect(at.detail).toBe(QUESTION);
	}
	expect(state.turns).toBe(1);
}, 20_000);

test("the answer is a turn, and the turn it fires lands", async () => {
	const { run, runDir } = arc("arc-land");
	await run.run();
	const ruled = await run.rule("ask", { do: "resume", turn: `The release name is ANSWER-THEN-LAND.` });
	expect(isRefusal(ruled)).toBe(false);

	const state = run.state();
	const at = state.steps.ask;
	expect(at?.at).toBe("landed");
	if (at?.at === "landed") {
		expect(at.report?.state).toBe("done");
		expect(at.report?.answer).toBe(MARKER);
	}
	// Two turns: the ignition that asked, and the resume that answered.
	expect(state.turns).toBe(2);
	expect(state.spent.ask).toBe(2);

	// Each turn's own stream file says what that turn was — the ask does not land
	// and the answer does, on the same session.
	expect(senseFile(streamPath(runDir, "ask", 0), "acceptEdits").report?.state).toBe("needs_input");
	expect(senseFile(streamPath(runDir, "ask", 1), "acceptEdits").report?.state).toBe("done");
}, 20_000);

test("C13 F2's fidelity bar: the stream is not poorer than the transcript", async () => {
	const { run, runDir } = arc("arc-fidelity");
	await run.run();
	await run.rule("ask", { do: "resume", turn: "The release name is ANSWER-THEN-LAND." });

	const at = run.state().steps.ask;
	const sessionId = readFileSync(`${runDir}/run.jsonl`, "utf8").split("\n")
		.filter((l) => l !== "").map((l) => JSON.parse(l) as { kind: string; sessionId?: string })
		.find((e) => e.kind === "ignited")!.sessionId!;
	expect(at?.at).toBe("landed");

	// The report's closing pair — an assistant `StructuredOutput` call and the
	// tool result that answers it — reaches BOTH carriers for both turns. Real
	// claude writes it to both; a fake that wrote only the transcript would let
	// a stream reader read the poorer thing and call it faithful.
	for (const turn of [0, 1]) {
		const stream = readFileSync(streamPath(runDir, "ask", turn), "utf8");
		expect([turn, stream.includes(`"name":"StructuredOutput"`)]).toEqual([turn, true]);
		expect([turn, stream.includes(`"tool_result"`)]).toEqual([turn, true]);
	}
	const tx = readFileSync(transcriptPath(run.venue.configDir, run.venue.workDir, sessionId), "utf8");
	expect(tx.split("StructuredOutput").length - 1).toBe(2);

	// And the transcript alone still answers for the turn that was fired: the
	// second turn's slice lands, which is what the fallback would read (C13).
	const cursor = run.log.entries().find((e) => e.kind === "resumed")!;
	if (cursor.kind === "resumed")
		expect(readTranscript(transcriptPath(run.venue.configDir, run.venue.workDir, sessionId), cursor.cursor).report?.state).toBe("done");
}, 20_000);
