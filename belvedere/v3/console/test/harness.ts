// A run to point the console at, built out of fake subjects — budget 0.
//
// The flow is the rehearsal's own shape, so what the tests drive here and what
// Felix's hand drives at G4 are the same three moves: a step that lands, a step
// that stops and wants a human, and a step behind it that cannot start until it
// does.

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { load } from "../../engine/engine.ts";
import { isRefusal } from "../../engine/refusal.ts";

export const HERE = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
export const CLI = `${HERE}/cli.ts`;
export const SCRATCH = "/private/tmp/v3-console-test";

/** `resume-chain-4` for the middle step: it reports nothing, so it pauses, and
 *  it scripts four acts, so a resume from the console is a turn it can serve.
 *  The fake has no answer-then-land scenario — that arc is the real rehearsal's
 *  (findings F2). */
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

export type Fixture = { root: string; runDir: string; name: string };

/** A run driven to its pause: `plan` landed, `ask` paused, `ship` pending. */
export async function fixture(name: string): Promise<Fixture> {
	const root = `${SCRATCH}/${name}`;
	const runDir = `${root}/console/three-moves`;
	rmSync(root, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	const flowPath = `${runDir}/flow.json`;
	writeFileSync(flowPath, JSON.stringify(FLOW, null, 2) + "\n");

	const run = load(flowPath, { runDir });
	if (isRefusal(run)) throw new Error(run.refusal);
	const blessed = run.bless();
	if (isRefusal(blessed)) throw new Error(blessed.refusal);
	await run.run();
	return { root, runDir, name: "console/three-moves" };
}

export type Ran = { code: number; out: string };

/** The console as a human runs it: argv in, stdout and an exit code out. */
export async function console_(root: string, ...args: string[]): Promise<Ran> {
	const p = Bun.spawn([process.execPath, CLI, ...args, "--root", root], { stdout: "pipe", stderr: "pipe" });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	await p.exited;
	return { code: p.exitCode ?? -1, out: out + err };
}
