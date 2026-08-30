#!/usr/bin/env bun
// One run, one child process.
//
//   bun one.ts --seed <n> --run <dir> [--cap <ms>]
//
// Every barrage run is a child, not an in-process call, and the reason is the
// crash drill: `V3_ENGINE_CRASH_AT` makes the engine SIGKILL *itself*, and a
// parent that took that signal would prove nothing. Running every run this way
// — not just the cut ones — keeps one code path instead of two, gives the
// parent a wall cap it can actually enforce, and isolates a run that wedges.
//
// It exits explicitly. A driver that lingers waiting on stragglers would turn
// invariant 6's question — *is anything still in flight at terminal?* — into
// something the harness quietly answers for the engine.

import { writeFileSync } from "node:fs";
import { isRefusal } from "../engine/refusal.ts";
import { drive, outcomePathIn } from "./driver.ts";

const argv = process.argv.slice(2);
const flag = (name: string): string | null => {
	const i = argv.indexOf(name);
	return i === -1 ? null : argv[i + 1] ?? null;
};

function die(message: string): never {
	console.error(`barrage/one: ${message}`);
	process.exit(2);
}

const seed = Number(flag("--seed"));
const runDir = flag("--run");
const capMs = Number(flag("--cap") ?? 60_000);
if (!Number.isInteger(seed)) die("--seed <integer> is required");
if (runDir === null) die("--run <dir> is required");

const outcome = await drive(seed, runDir, capMs);
if (isRefusal(outcome)) die(`seed ${seed}: ${outcome.refusal}`);

writeFileSync(outcomePathIn(runDir), JSON.stringify(outcome, null, "\t") + "\n");
process.exit(0);
