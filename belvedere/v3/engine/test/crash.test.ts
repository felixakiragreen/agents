// Bar 4 — the crash-redo drill. The engine is killed by SIGKILL at named
// instants, restarted on the same log, and asked to converge. Nothing is
// unwound, nothing is flushed: what is on disk at the cut is the whole of what
// the restart has, which is the question glass-shatters actually asks.
//
// The engine runs as a child process here for the obvious reason — the cut is
// a real SIGKILL, and a test runner that took it would prove nothing.
//
// **The oracle is the uncrashed run** (C7): the same flow, run through without
// a cut, gives the terminal verdicts every restart must reproduce exactly.
import { test, expect } from "bun:test";
import { mkdirSync, rmSync } from "node:fs";
import { readLog } from "../log.ts";
import { fold, terminal, verdicts } from "../replay.ts";
import { invariants } from "../invariants.ts";
import { CRASH_AT } from "../crash.ts";
import { HERE, SCRATCH } from "./harness.ts";

const CLI = `${HERE}/cli.ts`;
const DRILL = `${HERE}/flows/drill.json`;

/** The cut points, each named for what the log is missing at the cut. The last
 *  two are step 0's: the stream file outlives the engine, so a turn that
 *  reported lands, and only a torn stream falls to the transcript. */
const CUTS = [
	["before the first ignition record", "before-ignite:prep"],
	["mid-turn, the subject running", "after-ignite:orphan"],
	["mid-parallel, one edge in flight", "before-ignite:fan-b"],
	["at the gate pause", "before-pause:gate"],
	["at the card pause", "before-card:card"],
	["mid-turn on a step that reports", "after-ignite:prep"],
	["mid-turn on a subject that dies", "after-ignite:dead"],
] as const;

async function engine(runDir: string, args: string[], crashAt: string | null) {
	const proc = Bun.spawn([process.execPath, CLI, "run", DRILL, ...args, "--run", runDir], {
		env: crashAt === null ? process.env : { ...process.env, [CRASH_AT]: crashAt },
		stdout: "pipe", stderr: "pipe",
	});
	const [, , exit] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
	return { exit, signal: proc.signalCode };
}

function fresh(name: string): string {
	const runDir = `${SCRATCH}/${name}`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	return runDir;
}

/** The convergence oracle: the drill run with no cut at all, read once. */
let baseline: Record<string, string> | null = null;
async function uncrashed(): Promise<Record<string, string>> {
	if (baseline !== null) return baseline;
	const runDir = fresh("crash-baseline");
	await engine(runDir, ["--bless"], null);
	baseline = verdicts(fold(readLog(`${runDir}/run.jsonl`)));
	return baseline;
}

for (const [what, point] of CUTS) {
	test(`crash ${what} — restart converges on the uncrashed run, zero double-ignitions`, async () => {
		const runDir = fresh(`crash-${point.replace(/[^a-z]/gi, "-")}`);

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
		expect([point, verdicts(fold(entries))]).toEqual([point, await uncrashed()]);
	}, 60_000);
}

test("the stream outlives its engine: a mid-turn cut on a step that reported converges to LANDED", async () => {
	const runDir = fresh("crash-report");
	const cut = await engine(runDir, ["--bless"], "after-ignite:prep");
	expect(cut.signal).toBe("SIGKILL");
	await engine(runDir, [], null);

	const entries = readLog(`${runDir}/run.jsonl`);
	const ended = entries.find((e) => e.kind === "turn-ended" && e.step === "prep");
	// The engine that held the pipe is gone; the file it opened is not.
	expect(ended?.kind === "turn-ended" && ended.sensed.source).toBe("stream");
	const state = fold(entries).steps.prep;
	expect(state?.at).toBe("landed");
	if (state?.at === "landed") expect(state.report?.state).toBe("done");
}, 60_000);

test("adopt-or-re-derive: the orphan finishes while the engine is dead, and its stream file says so", async () => {
	const runDir = fresh("crash-adopt");
	const cut = await engine(runDir, ["--bless"], "after-ignite:orphan");
	expect(cut.signal).toBe("SIGKILL");
	await engine(runDir, [], null);

	const entries = readLog(`${runDir}/run.jsonl`);
	const ended = entries.find((e) => e.kind === "turn-ended" && e.step === "orphan");
	expect(ended?.kind === "turn-ended" && ended.sensed.source).toBe("stream");
	// The subject was reparented to init and finished all its steps, writing the
	// whole turn to the file. It still cannot land: `orphan-finish` never
	// reports, and a turn with no parseable report never lands (law 3).
	const state = fold(entries).steps.orphan;
	expect(state?.at).toBe("paused");
	if (state?.at === "paused") expect(state.causes).toEqual(["no report"]);
}, 60_000);

test("only a torn stream falls to the transcript: the subject that died mid-turn", async () => {
	const runDir = fresh("crash-torn");
	const cut = await engine(runDir, ["--bless"], "after-ignite:dead");
	expect(cut.signal).toBe("SIGKILL");
	await engine(runDir, [], null);

	const entries = readLog(`${runDir}/run.jsonl`);
	const ended = entries.find((e) => e.kind === "turn-ended" && e.step === "dead");
	// No `result` row ever reached the file, so the stream is torn and the
	// transcript's poorer worked / denied / dead is all there is.
	expect(ended?.kind === "turn-ended" && ended.sensed.source).toBe("transcript");
	const state = fold(entries).steps.dead;
	expect(state?.at).toBe("paused");
	if (state?.at === "paused") expect(state.causes).toEqual(["dead"]);
}, 60_000);
