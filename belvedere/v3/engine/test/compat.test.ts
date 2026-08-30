// C14's promise to every log already on disk: **absence is legal forever.**
//
// `ignited` gained `configDir` so a run log alone names the account that holds
// its sessions (C10 F5). Nothing backfills. A log written before that field
// existed stays exactly what it was — readable, replayable, 9/9 green, and
// undrivable — and the only new thing is that a verb which needs the account
// now says so instead of resuming into a config dir that holds no such session.
import { test, expect } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { load } from "../engine.ts";
import { readLog } from "../log.ts";
import { fold, terminal, verdicts } from "../replay.ts";
import { invariants } from "../invariants.ts";
import { isRefusal } from "../refusal.ts";
import { DEMO, driveDemo, freshRun, HERE, SCRATCH } from "./harness.ts";

const PRE = `${HERE}/test/fixtures/pre-c14-run.jsonl`;
const NOW = `${HERE}/test/fixtures/demo-run.jsonl`;

test("the frozen fixture predates the field, and the current one carries it everywhere", () => {
	const before = readLog(PRE).filter((e) => e.kind === "ignited");
	const after = readLog(NOW).filter((e) => e.kind === "ignited");
	expect(before.length).toBe(9);
	expect(before.every((e) => e.kind === "ignited" && e.configDir === undefined)).toBe(true);
	expect(after.length).toBe(before.length);
	expect(after.every((e) => e.kind === "ignited" && typeof e.configDir === "string")).toBe(true);
});

test("a pre-C14 log replays green, and to the very same verdicts", () => {
	const state = fold(readLog(PRE));
	expect(invariants(PRE)).toEqual([]);
	expect(terminal(state)).toBe(true);
	expect(state.turns).toBe(9);
	// The field is not state: the same flow driven the same way folds the same,
	// whether or not its ignitions said which account they rode.
	expect(verdicts(state)).toEqual(verdicts(fold(readLog(NOW))));
});

test("a drive verb on a pre-C14 log refuses in kind — it never guesses", async () => {
	// The current log with `configDir` struck from every ignition: one variable,
	// nothing else. The committed `pre-c14-run.jsonl` is the genuine article and
	// is read above, but it also predates the `prompt` field, so `load()` refuses
	// it for a second reason and would prove two things at once.
	const runDir = `${SCRATCH}/pre-c14`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	writeFileSync(`${runDir}/run.jsonl`, readLog(NOW)
		.map((e) => JSON.stringify(e.kind === "ignited" ? { ...e, configDir: undefined } : e))
		.join("\n") + "\n");

	const run = load(DEMO, { runDir });
	if (isRefusal(run)) throw new Error(run.refusal);
	// Re-opened on the very bytes: the blessing on disk still matches the flow.
	expect(run.state().turns).toBe(9);

	const landed = await run.rule("prep", { do: "resume", turn: "carry on" });
	expect(isRefusal(landed)).toBe(true);
	if (isRefusal(landed)) expect(landed.refusal).toContain("only a paused step takes a ruling");

	const missing = await run.rule("no-such-step", { do: "land", note: "" });
	expect(isRefusal(missing)).toBe(true);
	if (isRefusal(missing)) expect(missing.refusal).toContain("no such step");
});

test("every new ignition records the config dir the account rides on", async () => {
	const run = await driveDemo(freshRun("configdir"));
	const ignitions = readLog(run.log.path).filter((e) => e.kind === "ignited");
	expect(ignitions.length).toBeGreaterThan(0);
	for (const e of ignitions)
		expect([e.kind, "configDir" in e && e.configDir]).toEqual([e.kind, run.venue.configDir]);
}, 60_000);
