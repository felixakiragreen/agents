#!/usr/bin/env bun
// The hand-hold. The library is the product — C7 imports `engine.ts` — so this
// stays two verbs: run a flow, judge a log.
//
//   bun cli.ts run <flow.json> [--bless] [--run <dir>]
//   bun cli.ts check <run.jsonl>
//
// Without `--bless` a fresh run does nothing: the blessing is the caller's act
// (D11), and the engine never blesses itself.

import { load } from "./engine.ts";
import { invariants } from "./invariants.ts";
import { isRefusal } from "./refusal.ts";

const RUNS = new URL("../../../summon/log/v3/runs", import.meta.url).pathname;

function die(message: string): never {
	console.error(`engine: ${message}`);
	process.exit(2);
}

const [verb, target, ...rest] = process.argv.slice(2);
if (verb === undefined || target === undefined) die("usage: cli.ts run <flow.json> [--bless] [--run <dir>] | check <run.jsonl>");

if (verb === "check") {
	const violations = invariants(target!);
	for (const x of violations) console.log(`${x.seq}\t${x.invariant} ${x.name}\t${x.step}\t${x.detail}`);
	console.log(violations.length === 0 ? "invariants: 9/9 green" : `invariants: ${violations.length} violations`);
	process.exit(violations.length === 0 ? 0 : 1);
}

if (verb !== "run") die(`unknown verb ${JSON.stringify(verb)}`);

const flowPath = target!;
const runDir = rest.includes("--run") ? rest[rest.indexOf("--run") + 1] : null;
const run = load(flowPath, { runDir: runDir ?? `${RUNS}/${flowPath.split("/").at(-1)!.replace(/\.json$/, "")}` });
if (isRefusal(run)) die(run.refusal);

if (rest.includes("--bless")) {
	const blessed = run.bless();
	if (isRefusal(blessed)) die(blessed.refusal);
}

const state = await run.run();
for (const [id, at] of Object.entries(state.steps))
	console.log(`${id}\t${at.at}${at.at === "paused" ? `\t‹${at.causes.join(", ")}› ${at.detail}` : ""}`);
console.log(`turns ${state.turns}/${state.budget}${state.ceiling ? " (ceiling)" : ""}${state.halted === null ? "" : ` halted: ${state.halted}`}`);
console.log(`log ${run.log.path}`);
