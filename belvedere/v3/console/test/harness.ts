// A run to point the console at, built out of fake subjects — budget 0.
//
// The flow is the rehearsal's own shape, so what the tests drive here and what
// Felix's hand drives at G4 are the same three moves: a step that lands, a step
// that stops and wants a human, and a step behind it that cannot start until it
// does.

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { load } from "../../engine/engine.ts";
import { isRefusal } from "../../engine/refusal.ts";
import type { Venue } from "../../engine/spawn.ts";

export const HERE = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
export const CLI = `${HERE}/cli.ts`;
export const SCRATCH = "/private/tmp/v3-console-test";

/** `resume-chain-4` for the middle step: it reports nothing, so it pauses, and
 *  it scripts four acts, so a resume from the console is a turn it can serve.
 *  It pauses ‹no report›, which is a pause and not a question — the arc where a
 *  subject asks and then lands on the answer is [ARC](#) below. */
export const FLOW = {
	id: "console", name: "the console's three moves", budget: 6,
	steps: [
		step("plan", "schema-done", []),
		step("ask", "resume-chain-4", ["plan"]),
		step("ship", "schema-done", ["ask"]),
	],
};

function step(id: string, scenario: string, depends: string[]) {
	return {
		id, kind: "task", depends, model: "sonnet", effort: "low", posture: "auto",
		timeout_ms: 10_000, subject: { fake: { scenario, seed: 7 } },
	};
}

/** The same three moves, with a middle step that **asks and then lands on the
 *  answer** (C14). This is the arc `send <text>` drives and the one the console
 *  could not exercise on a fake before the scenario existed (C10 F2). */
export const ARC = {
	id: "console", name: "ask, then land on the answer", budget: 6,
	steps: [
		step("plan", "schema-done", []),
		step("ask", "answer-then-land", ["plan"]),
		step("ship", "schema-done", ["ask"]),
	],
};

export type Fixture = { root: string; runDir: string; name: string; venue: Venue };

export type Options = {
	/** Which flow to drive. The three moves by default. */
	flow?: object;
	/**
	 * Where the subjects live. Omitted, the engine's own sandbox under the run
	 * dir — which is also what a lost venue falls back to, so a test about
	 * *resolving* the venue must name one that is visibly not the sandbox.
	 */
	venue?: Venue;
	/** Write the pre-C14 sidecar naming that venue, the way C8's harness did. */
	conditions?: boolean;
};

/** A run driven to its pause: `plan` landed, `ask` paused, `ship` pending. */
export async function fixture(name: string, options: Options = {}): Promise<Fixture> {
	const root = `${SCRATCH}/${name}`;
	const runDir = `${root}/console/three-moves`;
	rmSync(root, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	const flowPath = `${runDir}/flow.json`;
	writeFileSync(flowPath, JSON.stringify(options.flow ?? FLOW, null, 2) + "\n");

	const run = load(flowPath, { runDir, ...(options.venue === undefined ? {} : { venue: options.venue }) });
	if (isRefusal(run)) throw new Error(run.refusal);
	if (options.conditions === true)
		writeFileSync(`${runDir}/conditions.json`, JSON.stringify({
			drill: name, account: "test", configDir: run.venue.configDir, workDir: run.venue.workDir,
		}, null, 2) + "\n");
	const blessed = run.bless();
	if (isRefusal(blessed)) throw new Error(blessed.refusal);
	await run.run();
	return { root, runDir, name: "console/three-moves", venue: run.venue };
}

export type Ran = { code: number; out: string };

/** The console as a human runs it: argv in, stdout and an exit code out. */
export async function console_(root: string, ...args: string[]): Promise<Ran> {
	const p = Bun.spawn([process.execPath, CLI, ...args, "--root", root], { stdout: "pipe", stderr: "pipe" });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	await p.exited;
	return { code: p.exitCode ?? -1, out: out + err };
}
