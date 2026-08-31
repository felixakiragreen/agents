// The tick — the healer, against the window C16 F2 measured (charge C20).
//
// The window is not simulated here, it is **reproduced**: the engine is driven
// in a subprocess and cut down at its own named crash point, exactly where a
// killed Belvedere dies — the subject's `result` row is on disk, the log still
// says `running`, and the process that would have appended `landed` is gone.
// Then one `tick`, through the console's own argv, and the log says `landed
// done`. Every subject here is a fake: budget 0.
//
// This file is what `lab/c16/settle.ts` was. The hand tool proved one transition
// once, by hand, on a run that no longer exists; this proves it on every run of
// the suite — plus the two controls a hand tool never had, where the honest
// answer is to move **zero bytes**: a settled run, and a run whose subject is
// still breathing.

import { test, expect, afterAll } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { console_, fixture, FLOW, HERE, SCRATCH } from "./harness.ts";
import { alive, locate } from "../runs.ts";
import { isRefusal } from "../../engine/refusal.ts";
import { streamPath } from "../../engine/spawn.ts";
import type { RunState } from "../../engine/replay.ts";

const ENGINE = `${HERE}/../engine/cli.ts`;

/** One step, a subject that never boundaries: text, then silence, with the
 *  process alive and stdout open. It is how this suite gets a **live** pid in a
 *  log whose engine is dead — the only shape that exercises the live control. */
const HANG = {
	id: "console", name: "a subject that never boundaries", budget: 2,
	steps: [{
		id: "solo", kind: "task", depends: [], model: "sonnet", effort: "low", posture: "auto",
		timeout_ms: 60_000, subject: { fake: { scenario: "hang", seed: 7 } },
	}],
};

type Crashed = { root: string; runDir: string; name: string };

/**
 * Drive a flow in a subprocess and cut the engine down at a named point. The cut
 * is the engine's own seam (`V3_ENGINE_CRASH_AT` — SIGKILL to self: no
 * unwinding, no flush, no atexit), the same one the barrage's 50 crash runs
 * ride, so what is on disk afterwards is exactly what had been appended.
 */
async function crashed(name: string, flow: object, at: string): Promise<Crashed> {
	const root = `${SCRATCH}/${name}`;
	const runDir = `${root}/console/run`;
	rmSync(root, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	writeFileSync(`${runDir}/flow.json`, JSON.stringify(flow, null, 2) + "\n");

	const engine = Bun.spawn([process.execPath, ENGINE, "run", `${runDir}/flow.json`, "--bless", "--run", runDir], {
		env: { ...process.env, V3_ENGINE_CRASH_AT: at },
		stdout: "pipe", stderr: "pipe",
	});
	await engine.exited;
	expect(engine.signalCode).toBe("SIGKILL");
	return { root, runDir, name: "console/run" };
}

/** The console's own reader, so the test asserts on the state the verb saw. */
function stateOf(c: Crashed): RunState {
	const handle = locate(c.name, c.root);
	if (isRefusal(handle)) throw new Error(handle.refusal);
	return handle.state;
}

const runningPid = (state: RunState, id: string): number => {
	const at = state.steps[id];
	if (at?.at !== "running") throw new Error(`step ${id} is ${at?.at ?? "absent"}, not running`);
	return at.pid;
};

/** The one orphan this file makes on purpose, swept however the test ends: a
 *  `hang` subject nobody is left to time out (C10 F4 — 22 of these, hours old). */
let orphan: number | null = null;
afterAll(() => { if (orphan !== null) { try { process.kill(orphan, "SIGTERM"); } catch { /* it went on its own */ } } });

test("tick — the C16 F2 window, reproduced and healed: running -> landed done", async () => {
	const c = await crashed("tick-window", FLOW, "before-settle:plan");

	// The window, as it sits on disk: the turn's result written, the log still
	// `running`, the engine that would have appended the landing a corpse.
	const before = stateOf(c);
	const pid = runningPid(before, "plan");
	expect(alive(pid)).toBe(false);
	expect(readFileSync(streamPath(c.runDir, "plan", 0), "utf8")).toContain(`"type":"result"`);

	const board = await console_(c.root, "list");
	expect(board.out).toContain(`DEAD ${pid}`);

	const { code, out } = await console_(c.root, "tick", c.name);
	expect(code).toBe(0);
	expect(out).toContain("console/run/plan  running  ->  landed done");
	expect(out).toContain("1 step healed");

	// The log is the register of record (cornerstone §3.4), and it now says so.
	const after = stateOf(c);
	expect(after.steps["plan"]?.at).toBe("landed");
	expect((await console_(c.root, "list")).out).toContain("plan  landed done");

	// And the healer ignited nothing. That landing unblocked `ask`, which is
	// still pending on the turns the crashed run had already spent: a heal that
	// spends turns is the supervising process D23 refused.
	expect(after.steps["ask"]?.at).toBe("pending");
	expect(after.turns).toBe(before.turns);
	expect(out).toContain("turns 1/6");
});

test("tick — a settled run moves zero bytes and says so", async () => {
	const g = await fixture("tick-settled");
	const log = `${g.runDir}/run.jsonl`;
	const was = readFileSync(log, "utf8");

	const { code, out } = await console_(g.root, "tick", g.name);
	expect(code).toBe(0);
	expect(out).toContain("nothing to heal");
	expect(out).toContain("0 steps healed");
	expect(readFileSync(log, "utf8")).toBe(was);
});

test("tick — a live subject is not the tick's to adopt: zero bytes, and it names whose it is", async () => {
	const c = await crashed("tick-live", HANG, "after-ignite:solo");
	const log = `${c.runDir}/run.jsonl`;
	const pid = runningPid(stateOf(c), "solo");
	orphan = pid;
	expect(alive(pid)).toBe(true);
	const was = readFileSync(log, "utf8");

	const { code, out } = await console_(c.root, "tick", c.name);
	expect(code).toBe(0);
	expect(out).toContain(`solo pid ${pid} still live`);
	expect(out).toContain("0 steps healed");
	expect(readFileSync(log, "utf8")).toBe(was);

	// The drills are exempt by construction: the crash drill needs its orphans
	// alive between the cut and the restart, and the tick neither signals nor
	// waits on one (`barrage/sweep.ts`'s header, C6 F2).
	expect(alive(pid)).toBe(true);
});

test("tick — refusals in kind: no run named, and a run that is not there", async () => {
	const bare = await console_(SCRATCH, "tick");
	expect(bare.code).toBe(2);
	expect(bare.out).toContain("tick wants <run>");

	const missing = await console_(SCRATCH, "tick", "console/nope");
	expect(missing.code).toBe(2);
	expect(missing.out).toContain("no run at");
});
