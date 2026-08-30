// Bar 4: every scenario matches its committed golden, byte for byte, and
// everything the fake emits passes the same oracle the real captures do.
import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { validateStream, validateTranscript } from "./validate.ts";
import { goldenPath, loadScenario, runScenario, scenarioNames } from "./goldens.ts";
import { transcriptPath } from "./transcript.ts";

const NAMES = scenarioNames();

test("the library is at least 20 scenarios", () => {
	expect(NAMES.length).toBeGreaterThanOrEqual(20);
});

for (const name of NAMES) {
	test(`${name} — golden, exit and conformance`, async () => {
		const s = loadScenario(name);
		const run = await runScenario(s);

		expect(run.stderr).toBe("");
		expect(run.exit).toBe(s.golden.expectExit);
		expect(run.stream).toBe(readFileSync(goldenPath(name), "utf8"));

		const stream = validateStream(run.stream);
		expect(stream.violations).toEqual([]);

		expect(run.sessionId).not.toBe("");
		const tx = validateTranscript(run.transcript, {
			path: transcriptPath(run.configDir, run.cwd, run.sessionId),
			configDir: run.configDir, cwd: run.cwd, sessionId: run.sessionId,
		});
		expect(tx.violations).toEqual([]);
	}, 20_000);
}

// Bar 4's second half, shown on four scenarios covering both arms and both
// process shapes: one process per turn, and four turns in one.
for (const name of ["echo", "multi-tool", "resume-chain-4", "armb-paced-4"]) {
	test(`${name} — same scenario, same seed, byte-identical x3`, async () => {
		const s = loadScenario(name);
		const runs = [await runScenario(s), await runScenario(s), await runScenario(s)];
		expect(runs[1]!.stream).toBe(runs[0]!.stream);
		expect(runs[2]!.stream).toBe(runs[0]!.stream);
		expect(runs[1]!.transcript).toBe(runs[0]!.transcript);
		expect(runs[2]!.transcript).toBe(runs[0]!.transcript);
	}, 30_000);
}

test("a different seed is a different session", async () => {
	const s = loadScenario("echo");
	const one = await runScenario(s, 1);
	const two = await runScenario(s, 2);
	expect(two.sessionId).not.toBe(one.sessionId);
	expect(two.stream).not.toBe(one.stream);
}, 20_000);

test("the scenarios say what the grammar says", async () => {
	const denial = await runScenario(loadScenario("permission-denial"));
	const last = lastResult(denial.stream);
	// Grammar §4's three laws, in one row: exit 0, success, is_error false —
	// and the work did not happen.
	expect(denial.exit).toBe(0);
	expect(last.subtype).toBe("success");
	expect(last.is_error).toBe(false);
	expect((last.permission_denials as unknown[]).length).toBe(1);
	expect(init(denial.stream).permissionMode).toBe("default");

	const mismatch = await runScenario(loadScenario("posture-mismatch"));
	expect(init(mismatch.stream).permissionMode).toBe("default");

	const asked = await runScenario(loadScenario("plan-noop"));
	expect(init(asked.stream).permissionMode).toBe("plan");

	// F5: needs-⬡(question) is only observable because the schema made it so.
	const question = await runScenario(loadScenario("schema-needs-input"));
	expect((lastResult(question.stream).structured_output as { state: string }).state).toBe("needs_input");

	// F1: the last result wins, and there is more than one.
	const sub = await runScenario(loadScenario("subagent-double-result"));
	expect(results(sub.stream).length).toBe(2);
}, 40_000);

test("arm B merges unpaced turns — four messages, two results", async () => {
	const measured = await runScenario(loadScenario("armb-merge-trap"));
	expect(results(measured.stream).length).toBe(2);
	// The measured shape: real claude reported 0 here (captures/q2-b-personal),
	// so the only sound detector is the arithmetic, not the field.
	expect(results(measured.stream).map((r) => r.queued_turn_count)).toEqual([0, 0]);

	const assumed = await runScenario(loadScenario("armb-merge-trap-queued"));
	expect(results(assumed.stream).map((r) => r.queued_turn_count)).toEqual([0, 2]);

	const paced = await runScenario(loadScenario("armb-paced-4"));
	expect(results(paced.stream).length).toBe(4);
}, 30_000);

type Event = Record<string, unknown>;
const events = (stream: string): Event[] =>
	stream.split("\n").filter((l) => l.trim() !== "").map((l) => JSON.parse(l) as Event);
const results = (stream: string): Event[] => events(stream).filter((e) => e.type === "result");
const lastResult = (stream: string): Event => results(stream).at(-1)!;
const init = (stream: string): Event => events(stream).find((e) => e.subtype === "init")!;
