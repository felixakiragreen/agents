#!/usr/bin/env bun
// Q1 — the first real turn this campaign has ever spent, and the cheapest
// question that can be asked of it: does the engine's sensing hold on real
// bytes at all?
//
// One step, one turn. What it proves or breaks: the session id the engine chose
// is the one that came back (rule 5/7), `init.permissionMode` reads back as the
// posture asked (parse rule 4), the last `result` is the turn (rule 1),
// `permission_denials[]` is the truth signal (rule 2), and the `--json-schema`
// report parses into a landing (C4 F5's structural fix).
//
//   bun q1-smoke.ts [account]

import { readFileSync } from "node:fs";
import { isRefusal } from "../../engine/refusal.ts";
import { senseFile } from "../../engine/sense.ts";
import { streamPath } from "../../engine/spawn.ts";
import { open, task, REPORT_RULE, type Spec } from "./drill.ts";
import { ALL, type Account } from "./accounts.ts";

const account = (process.argv[2] ?? "personal") as Account;
if (!ALL.includes(account)) throw new Error(`unknown account ${account}`);

const drill = `q1-smoke-${account}`;
const spec: Spec = {
	drill, account,
	flow: {
		id: "q1smoke", name: "one real turn, sensed through the engine", budget: 2,
		steps: [task("echo", `Reply with exactly the word PONG and nothing else. Do not use any tools. ${REPORT_RULE}`)],
	},
};

const opened = open(spec);
if (isRefusal(opened)) throw new Error(opened.refusal);
const { run, runDir, conditions } = opened;

const blessed = run.bless();
if (isRefusal(blessed)) throw new Error(blessed.refusal);

const t0 = Date.now();
const state = await run.run();
const wall = Date.now() - t0;

console.log(`# ${drill} · ${conditions.at} · load ${conditions.load}`);
console.log(`account ${account} · config ${conditions.configDir} · cwd ${conditions.workDir}`);
for (const [id, at] of Object.entries(state.steps))
	console.log(`step ${id}: ${at.at}${at.at === "paused" ? ` ‹${at.causes.join(", ")}› ${at.detail}` : ""}${at.at === "landed" ? ` report=${JSON.stringify(at.report)}` : ""}`);
console.log(`turns ${state.turns}/${state.budget} · wall ${wall} ms`);

// The reading, read back off the same stream file the engine sensed live — the
// parse rules named one at a time, so a contradiction names itself.
const stream = streamPath(runDir, "echo", 0);
const r = senseFile(stream, "auto");
const ignited = readFileSync(`${runDir}/run.jsonl`, "utf8").split("\n")
	.filter((l) => l !== "").map((l) => JSON.parse(l) as { kind: string; sessionId?: string })
	.find((e) => e.kind === "ignited");

console.log(`\n# the parse rules on real bytes`);
console.log(`rule 5/7 session id chosen=${ignited?.sessionId} sensed=${r.sessionId} honored=${ignited?.sessionId === r.sessionId}`);
console.log(`rule 4  posture asked=auto granted=${r.granted}`);
console.log(`rule 1  results=${r.results} dead=${r.dead} exit=${r.exit} signal=${r.signal}`);
console.log(`rule 2  denials=${JSON.stringify(r.denials)}`);
console.log(`report  ${JSON.stringify(r.report)}`);
console.log(`text    ${JSON.stringify(r.text.slice(0, 120))}`);
console.log(`unparsed lines ${r.unparsed}`);
console.log(`stream  ${stream}`);
