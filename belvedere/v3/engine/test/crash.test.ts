// Bar 4 — the crash-redo drill. The engine is killed by SIGKILL at five named
// instants, restarted on the same log, and asked to converge. Nothing is
// unwound, nothing is flushed: what is on disk at the cut is the whole of what
// the restart has, which is the question glass-shatters actually asks.
//
// The engine runs as a child process here for the obvious reason — the cut is
// a real SIGKILL, and a test runner that took it would prove nothing.
import { test, expect } from "bun:test";
import { mkdirSync, rmSync } from "node:fs";
import { readLog } from "../log.ts";
import { fold, terminal } from "../replay.ts";
import { invariants } from "../invariants.ts";
import { CRASH_AT } from "../crash.ts";
import { HERE, SCRATCH } from "./harness.ts";

const CLI = `${HERE}/cli.ts`;
const DRILL = `${HERE}/flows/drill.json`;

/** The five instants, each named for what the log is missing at the cut. */
const CUTS = [
	["before the first ignition record", "before-ignite:prep"],
	["mid-turn, the subject running", "after-ignite:orphan"],
	["mid-parallel, one edge in flight", "before-ignite:fan-b"],
	["at the gate pause", "before-pause:gate"],
	["at the card pause", "before-card:card"],
] as const;

async function engine(runDir: string, args: string[], crashAt: string | null) {
	const proc = Bun.spawn([process.execPath, CLI, "run", DRILL, ...args, "--run", runDir], {
		env: crashAt === null ? process.env : { ...process.env, [CRASH_AT]: crashAt },
		stdout: "pipe", stderr: "pipe",
	});
	const [, , exit] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
	return { exit, signal: proc.signalCode };
}

for (const [what, point] of CUTS) {
	test(`crash ${what} — restart converges, zero double-ignitions`, async () => {
		const runDir = `${SCRATCH}/crash-${point.replace(/[^a-z]/gi, "-")}`;
		rmSync(runDir, { recursive: true, force: true });
		mkdirSync(runDir, { recursive: true });

		const cut = await engine(runDir, ["--bless"], point);
		expect([point, cut.signal]).toEqual([point, "SIGKILL"]);

		const restart = await engine(runDir, [], null);
		expect([point, restart.exit]).toEqual([point, 0]);

		const log = `${runDir}/run.jsonl`;
		const entries = readLog(log);
		const ignitions = entries.filter((e) => e.kind === "ignited");
		expect([point, invariants(log)]).toEqual([point, []]);
		expect([point, new Set(ignitions.map((e) => "step" in e ? e.step : "")).size]).toEqual([point, ignitions.length]);
		expect([point, entries.filter((e) => e.kind === "blessed").length]).toEqual([point, 1]);
		expect([point, terminal(fold(entries))]).toEqual([point, true]);
	}, 60_000);
}

test("adopt-or-re-derive: the orphan finishes while the engine is dead, and the transcript says so", async () => {
	const runDir = `${SCRATCH}/crash-adopt`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });

	const cut = await engine(runDir, ["--bless"], "after-ignite:orphan");
	expect(cut.signal).toBe("SIGKILL");
	await engine(runDir, [], null);

	const entries = readLog(`${runDir}/run.jsonl`);
	const ended = entries.find((e) => e.kind === "turn-ended" && e.step === "orphan");
	expect(ended?.kind === "turn-ended" && ended.sensed.source).toBe("transcript");
	// The subject was reparented to init and finished all its steps; the reader
	// sees a closed turn and no denial — and still cannot land it, because the
	// step report rides the stream the dead engine was holding.
	expect(ended?.kind === "turn-ended" && ended.sensed.source === "transcript" && ended.sensed.reading).toMatchObject({
		verdict: "worked", complete: true, denied: false, torn: 0,
	});
	const state = fold(entries).steps.orphan;
	expect(state?.at).toBe("paused");
	if (state?.at === "paused") expect(state.causes).toEqual(["no report"]);
}, 60_000);
