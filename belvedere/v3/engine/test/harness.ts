// Shared ground for the engine's tests: a scratch venue outside the repo, the
// demo flow's full drive, and the one comparison bar 8 asks for.
//
// The venue is a fixed path per test, rebuilt each time: a subject's cwd shows
// up in `init.cwd` and in its transcript path, so a random venue makes nothing
// reproducible.

import { mkdirSync, rmSync } from "node:fs";
import { load, type Run } from "../engine.ts";
import { isRefusal } from "../refusal.ts";
import type { Reading } from "../sense.ts";
import type { TranscriptVerdict } from "../transcript.ts";

export const HERE = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
export const SCRATCH = "/private/tmp/v3-engine-test";
export const DEMO = `${HERE}/flows/demo.json`;

export function freshRun(name: string, flowPath = DEMO): Run {
	const runDir = `${SCRATCH}/${name}`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	const run = load(flowPath, { runDir });
	if (isRefusal(run)) throw new Error(run.refusal);
	return run;
}

export function reopen(name: string, flowPath = DEMO): Run {
	const run = load(flowPath, { runDir: `${SCRATCH}/${name}` });
	if (isRefusal(run)) throw new Error(run.refusal);
	return run;
}

export const must = (v: true | { refusal: string }): void => {
	if (isRefusal(v)) throw new Error(v.refusal);
};

/**
 * The demo flow, end to end: it runs to a gate, is ruled, runs to a card, is
 * ruled, finishes — and the three steps that could not land are ruled killed,
 * so the run ends with nothing pending and nothing in flight.
 */
export async function driveDemo(run: Run): Promise<Run> {
	must(run.bless());
	await run.run();
	must(await run.rule("gate", { do: "land", note: "the fan landed and the gate reported done" }));
	await run.run();
	must(await run.rule("card", { do: "land", note: "Felix says ship" }));
	await run.run();
	must(await run.rule("orphan", { do: "kill", note: "the turn worked and reported nothing" }));
	must(await run.rule("deny", { do: "kill", note: "the write was refused" }));
	must(await run.rule("crash", { do: "kill", note: "the subject died mid-turn" }));
	return run;
}

/** Bar 8's comparison: the stream's verdict in the transcript's vocabulary. */
export const streamVerdict = (r: Reading): TranscriptVerdict =>
	r.dead ? "dead" : r.denials.length > 0 ? "denied" : "worked";
