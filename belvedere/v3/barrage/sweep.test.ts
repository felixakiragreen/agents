// The sweep, measured — C10 F4's class: a drill that ends early left `hang`
// fakes alive for hours. Both halves are asserted with their controls: the
// orphan is seen alive before it is swept (or there was nothing to prove), and
// a pid the log names that is *not* the fake is seen to survive (or the sweep is
// a licence to kill any number in an old file).
import { test, expect } from "bun:test";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { readLog } from "../engine/log.ts";
import { ignite } from "../engine/spawn.ts";
import { isRefusal } from "../engine/refusal.ts";
import { liveFakes, subjectPids, sweep } from "./sweep.ts";

const SCRATCH = "/private/tmp/v3-barrage-test/sweep";
const ONE = new URL("one.ts", import.meta.url).pathname;
/** Its topology is two steps and its first root runs the `hang` scenario, so a
 *  child killed a moment after ignition has an orphan by construction. */
const HANG_SEED = 62;

test("a pid the log names is swept only if it is still the fake", async () => {
	const root = `${SCRATCH}/guard`;
	const runDir = `${root}/run`;
	rmSync(root, { recursive: true, force: true });
	mkdirSync(`${runDir}/work`, { recursive: true });

	const spawned = ignite({
		step: { kind: "task", id: "h", depends: [], model: "sonnet", effort: "low", posture: "acceptEdits",
			timeoutMs: 30_000, prompt: "sweep/hang", subject: { fake: { scenario: "hang", seed: 5 } } },
		venue: { workDir: `${runDir}/work`, configDir: `${runDir}/config` },
		sessionId: crypto.randomUUID(), resume: false, prompt: "sweep/hang",
		stream: `${runDir}/streams/h.t0.jsonl`,
	});
	if (isRefusal(spawned)) throw new Error(spawned.refusal);

	// A log naming both the fake and this very test process. Only one of them is
	// a subject; the other is the pid-reuse hazard, standing in for itself.
	const rows = [
		{ seq: 0, at: "", kind: "ignited", step: "h", sessionId: "s", pid: spawned.pid, venue: `${runDir}/work`,
			configDir: `${runDir}/config`, cursor: 0, model: "sonnet", effort: "low", posture: "acceptEdits", subject: "fake:hang" },
		{ seq: 1, at: "", kind: "resumed", step: "h", sessionId: "s", pid: process.pid, cursor: 0, turn: "not a subject" },
	];
	writeFileSync(`${runDir}/run.jsonl`, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");

	expect(subjectPids(root).sort()).toEqual([spawned.pid, process.pid].sort());
	// The control: the fake is alive, the test process is alive, and only one of
	// the two is a fake — that is the whole question the guard answers.
	expect(liveFakes([spawned.pid, process.pid])).toEqual([spawned.pid]);

	expect(sweep(root)).toEqual([spawned.pid]);
	await spawned.settled;
	expect(liveFakes([spawned.pid])).toEqual([]);
	expect(alive(process.pid)).toBe(true);
}, 60_000);

test("a drill run that ends early leaves zero live fakes", async () => {
	const runDir = `${SCRATCH}/early/${HANG_SEED}`;
	rmSync(`${SCRATCH}/early`, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });

	// A barrage child, killed the way the parent's wall cap kills one: SIGKILL,
	// no chance to tidy. Its subject is not its child's child to reap.
	const child = Bun.spawn([process.execPath, ONE, "--seed", String(HANG_SEED), "--run", runDir, "--cap", "60000"],
		{ stdout: "ignore", stderr: "ignore" });
	const log = `${runDir}/run.jsonl`;
	for (let i = 0; i < 200 && (!existsSync(log) || !readFileSync(log, "utf8").includes(`"kind":"ignited"`)); i++)
		await Bun.sleep(50);
	child.kill("SIGKILL");
	await child.exited;

	const ignited = readLog(log).filter((e) => e.kind === "ignited");
	expect(ignited.length).toBeGreaterThan(0);
	// The control: the leak is real before the sweep, or this test proves nothing.
	const orphans = liveFakes(subjectPids(`${SCRATCH}/early`));
	expect(orphans.length).toBeGreaterThan(0);

	const killed = sweep(`${SCRATCH}/early`);
	expect(killed.sort()).toEqual(orphans.sort());
	for (let i = 0; i < 100 && liveFakes(orphans).length > 0; i++) await Bun.sleep(50);
	expect(liveFakes(subjectPids(`${SCRATCH}/early`))).toEqual([]);
}, 60_000);

const alive = (pid: number): boolean => {
	try { process.kill(pid, 0); return true; } catch { return false; }
};
