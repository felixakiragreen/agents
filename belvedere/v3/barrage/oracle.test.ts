// The oracle, and the two questions the mutation check cannot ask it.
//
// The nine mutants prove the oracle catches a broken *engine*. These prove it
// catches a broken *log* and a broken *disk* — the same corruptions planted by
// hand, so a failure here names the oracle rather than the engine.

import { test, expect } from "bun:test";
import { mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { runChild, outcomeOf } from "./child.ts";
import { judge } from "./oracle.ts";
import { cutPointsFrom } from "./crash.ts";
import { readLog } from "../engine/log.ts";

const SCRATCH = "/private/tmp/v3-barrage-test/oracle";
const SEED = 9;

async function goodRun(name: string): Promise<string> {
	const dir = `${SCRATCH}/${name}`;
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
	await runChild(SEED, dir, 60_000);
	return dir;
}

test("a clean run is 9/9 green, and its log offers cut points in every reachable family", async () => {
	const dir = await goodRun("clean");
	expect(judge(dir, outcomeOf(dir)).reds).toEqual([]);
	const families = new Set(cutPointsFrom(readLog(`${dir}/run.jsonl`)).map((p) => p.split(":")[0]));
	expect([...families].sort()).toEqual(["after-ignite", "before-card", "before-ignite", "before-pause", "before-settle"]);
}, 120_000);

test("truth on disk: a landing the stream file does not support is invariant 8", async () => {
	const dir = await goodRun("forged-landing");
	// Turn a task's pause into a landing. The log alone still reads as legal —
	// a task may land once its turn has ended — and only the subject's own
	// stream file says otherwise. A card's pause would not do: a card takes no
	// turn, so there is no stream to contradict it.
	const lines = readFileSync(`${dir}/run.jsonl`, "utf8").split("\n").filter((l) => l !== "");
	const rows = lines.map((l) => JSON.parse(l) as { kind: string; step?: string });
	const i = rows.findIndex((e, n) => e.kind === "paused" && rows.slice(0, n).some((x) => x.kind === "turn-ended" && x.step === e.step));
	expect(i).toBeGreaterThan(-1);
	const paused = JSON.parse(lines[i]!) as { seq: number; at: string; step: string };
	lines[i] = JSON.stringify({ seq: paused.seq, at: paused.at, kind: "landed", step: paused.step, report: null });
	writeFileSync(`${dir}/run.jsonl`, lines.join("\n") + "\n");

	const reds = judge(dir, null).reds;
	expect(reds.some((r) => r.invariant === 8 && r.step === paused.step)).toBe(true);
}, 120_000);

test("truth on disk: a stream file that vanishes is not quietly forgiven", async () => {
	const dir = await goodRun("lost-stream");
	const entries = readLog(`${dir}/run.jsonl`);
	const landed = entries.find((e) => e.kind === "landed" && e.report !== null);
	expect(landed?.kind).toBe("landed");
	const step = landed?.kind === "landed" ? landed.step : "";
	rmSync(`${dir}/streams/${step}.t0.jsonl`, { force: true });

	// With no stream and no report on disk, the landing has nothing behind it.
	const reds = judge(dir, null).reds;
	expect(reds.some((r) => r.invariant === 8 && r.step === step)).toBe(true);
}, 120_000);

test("the driver's own report is checked, not trusted", async () => {
	const dir = await goodRun("bad-outcome");
	const outcome = outcomeOf(dir);
	expect(outcome).not.toBeNull();
	const lying = { ...outcome!, replayEqual: false };
	expect(judge(dir, lying).reds.some((r) => r.invariant === 7)).toBe(true);
	const stalled = { ...outcome!, stop: "no-progress" as const };
	expect(judge(dir, stalled).reds.some((r) => r.invariant === 5)).toBe(true);
}, 120_000);
