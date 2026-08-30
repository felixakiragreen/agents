// C11 bar 1 — the turn cursor, seen red first.
//
// The transcript is one file per *session* with no turn index in it, so a
// reader that starts at byte 0 answers for whichever turn last wrote to it. On
// a resumed step whose stream is torn that is the turn BEFORE the one being
// asked about (C7 F3), and the engine re-derives the wrong outcome: the dead
// resume below reads back from disk as `worked`.
//
// The fix is a cursor **recorded at spawn** — the transcript's row count as the
// engine found it — so re-derivation reads only what came after. This test is
// the defect, staged end to end: turn 0 works and closes, the resume dies at
// the fake's door writing nothing, and the engine is SIGKILLed in between so
// the restart has none of its own memory to fall back on.
import { test, expect } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { readLog } from "../log.ts";
import { readTranscript, transcriptPath } from "../transcript.ts";
import { HERE, reopen, SCRATCH } from "./harness.ts";

const DRIVER = `${HERE}/test/resume-door.ts`;

/** One step, one act. `echo` works and reports nothing, so turn 0 pauses ‹no
 *  report› with a closed transcript — a resume past it is the door death. */
const FLOW = {
	id: "cursor-door", name: "the door death on a resumed step", budget: 2,
	steps: [{
		id: "t", kind: "task", depends: [], model: "sonnet", effort: "low", posture: "auto",
		timeout_ms: 5_000, subject: { fake: { scenario: "echo", seed: 5 } },
	}],
};

test("bar 1 — a resume that dies at the door re-derives as dead, not as the turn before it", async () => {
	const name = "cursor-door";
	const runDir = `${SCRATCH}/${name}`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	const flowPath = `${SCRATCH}/${name}.json`;
	writeFileSync(flowPath, JSON.stringify(FLOW));

	// The cut: turn 0 to its pause, then a resume recorded and the engine killed.
	const child = Bun.spawn([process.execPath, DRIVER, flowPath, runDir, "t"], { stdout: "pipe", stderr: "pipe" });
	const [, err] = await Promise.all([
		new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
	]);
	expect([err, child.signalCode]).toEqual([err, "SIGKILL"]);

	// The disk at the cut: the resume's stream file is empty — the subject died
	// at the door — and the transcript still ends on turn 0, which closed.
	const entries = readLog(`${runDir}/run.jsonl`);
	const resumed = entries.find((e) => e.kind === "resumed");
	expect(resumed?.kind).toBe("resumed");
	expect(readFileSync(`${runDir}/streams/t.t1.jsonl`, "utf8")).toBe("");
	const sessionId = resumed?.kind === "resumed" ? resumed.sessionId : "";
	expect(readTranscript(transcriptPath(`${runDir}/config`, `${runDir}/work`, sessionId)).verdict).toBe("worked");

	// The restart answers for the turn the engine fired, and that turn is dead.
	const state = await reopen(name, flowPath).run();
	const t = state.steps.t;
	expect(t?.at).toBe("paused");
	if (t?.at === "paused") expect(t.causes).toEqual(["dead"]);
}, 60_000);
