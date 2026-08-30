#!/usr/bin/env bun
// Q2 — the two events the topologies never reached, and C4's load-bearing
// surprise, in one turn.
//
// C4 F1: "One invocation can emit more than one `result`" — a subagent's
// completion re-invokes the parent, so a second `system/init` + `result` land in
// the same process. Parse rule 1 exists because of it: the engine reads to EOF
// and takes the LAST result, because "the process exited" is not the turn
// boundary. Nothing has ever driven that rule through the engine on real bytes.
//
// The same turn fires `SubagentStart` / `SubagentStop`, which the flat
// topologies never reach — the last two of the census's ten that are not
// structurally absent (C4 F4).
//
//   bun q2-subagent.ts [account]

import { readFileSync } from "node:fs";
import { isRefusal } from "../../engine/refusal.ts";
import { senseFile } from "../../engine/sense.ts";
import { streamPath } from "../../engine/spawn.ts";
import { open, task, REPORT_RULE } from "./drill.ts";
import { ALL, type Account } from "./accounts.ts";

const account = (process.argv[2] ?? "personal") as Account;
if (!ALL.includes(account)) throw new Error(`unknown account ${account}`);

const opened = open({
	drill: `q2-subagent-${account}`, account,
	flow: {
		id: "q2sub", name: "one subagent, two results", budget: 2,
		steps: [task("sub",
			"Use the Task tool to launch exactly one subagent. The subagent's entire job is to reply " +
			`with the single word DELTA and nothing else. Report what the subagent replied. ${REPORT_RULE}`,
			[], { timeout_ms: 240_000 })],
	},
});
if (isRefusal(opened)) throw new Error(opened.refusal);
if (isRefusal(opened.run.bless())) throw new Error("bless refused");

const state = await opened.run.run();
const at = state.steps.sub;
const stream = streamPath(opened.runDir, "sub", 0);
const r = senseFile(stream, "auto");

// Every event type in the stream, and where the `result` rows fell.
const kinds: Record<string, number> = {};
const marks: string[] = [];
for (const line of readFileSync(stream, "utf8").split("\n")) {
	if (line === "") continue;
	let e: { type?: string; subtype?: string };
	try { e = JSON.parse(line) as typeof e; } catch { continue; }
	const key = `${e.type}${e.subtype === undefined ? "" : `/${e.subtype}`}`;
	kinds[key] = (kinds[key] ?? 0) + 1;
	if (e.type === "result" || key === "system/init") marks.push(key);
}

console.log(`# q2-subagent-${account}`);
console.log(`  step ${at?.at}${at?.at === "landed" ? ` report=${JSON.stringify(at.report)}` : ""}`);
console.log(`  parse rule 1: results in this ONE process = ${r.results}`);
console.log(`  the shape of it: ${marks.join(" -> ")}`);
console.log(`  the engine took the last result: report=${JSON.stringify(r.report)} denials=${r.denials.length}`);
console.log(`  stream event types:`);
for (const [k, n] of Object.entries(kinds).sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(3)}  ${k}`);
console.log(`  stream ${stream}`);
