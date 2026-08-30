#!/usr/bin/env bun
// Q7 — real flows: three topologies, run to terminal on a real account, with the
// nine invariants machine-checked per run.
//
// The three are chosen for what they exercise rather than for size: `chain`
// proves an edge is real work handed between two real sessions; `gate` proves a
// gate never lands itself and a card never ignites, both ruled by a hand this
// script is standing in for; `fan` puts two real subjects in flight at once and
// joins them.
//
// Every step does a small, checkable thing in the venue, so "landed" is not the
// engine's word for it alone — the files are on disk or they are not.
//
//   bun q7-flows.ts <chain|gate|fan> [account]

import { existsSync, readFileSync } from "node:fs";
import { invariants } from "../../engine/invariants.ts";
import { isRefusal } from "../../engine/refusal.ts";
import type { Run } from "../../engine/engine.ts";
import type { RunState } from "../../engine/replay.ts";
import { open, task, REPORT_RULE } from "./drill.ts";
import { ALL, type Account } from "./accounts.ts";

const say = (s: string) => `${s} ${REPORT_RULE}`;

const TOPOLOGIES: Record<string, { budget: number; steps: unknown[]; expect: Record<string, string> }> = {
	// 3 steps, serial: each one's work is the next one's input.
	chain: {
		budget: 6,
		steps: [
			task("a", say("Create a file named alpha.txt in your current working directory containing exactly the line ALPHA.")),
			task("b", say("Read alpha.txt in your current working directory. Create beta.txt containing its contents with the suffix -BETA appended, on one line."), ["a"]),
			task("c", say("Read beta.txt in your current working directory. Create gamma.txt containing its contents with the suffix -GAMMA appended, on one line."), ["b"]),
		],
		expect: { "alpha.txt": "ALPHA", "beta.txt": "ALPHA-BETA", "gamma.txt": "ALPHA-BETA-GAMMA" },
	},

	// 4 steps, one gate and one card: neither may move without a ruling.
	gate: {
		budget: 8,
		steps: [
			task("count", say("Create a file named findings.txt in your current working directory containing exactly the line COUNT=3.")),
			task("check", say("Read findings.txt in your current working directory and state in your report's `cause` whether it contains COUNT=3."), ["count"], { kind: "gate" }),
			{ kind: "card", id: "sign", depends: ["check"], ask: "The count was checked. Approve publishing it?" },
			task("publish", say("Create a file named published.txt in your current working directory containing exactly the line PUBLISHED."), ["sign"]),
		],
		expect: { "findings.txt": "COUNT=3", "published.txt": "PUBLISHED" },
	},

	// 4 steps, width 2: two real subjects in flight at the same instant.
	fan: {
		budget: 8,
		steps: [
			task("seed", say("Create a file named seed.txt in your current working directory containing exactly the line SEED.")),
			task("left", say("Read seed.txt in your current working directory and create left.txt containing exactly the line SEED-LEFT."), ["seed"]),
			task("right", say("Read seed.txt in your current working directory and create right.txt containing exactly the line SEED-RIGHT."), ["seed"]),
			task("join", say("Read left.txt and right.txt in your current working directory and create join.txt containing both of their lines, left first."), ["left", "right"]),
		],
		expect: { "seed.txt": "SEED", "left.txt": "SEED-LEFT", "right.txt": "SEED-RIGHT" },
	},
};

const name = process.argv[2] ?? "chain";
const account = (process.argv[3] ?? "personal") as Account;
const topology = TOPOLOGIES[name];
if (topology === undefined) throw new Error(`unknown topology ${name}`);
if (!ALL.includes(account)) throw new Error(`unknown account ${account}`);

const drill = `q7-${name}-${account}`;
const opened = open({
	drill, account, concurrent: name === "fan" ? 2 : 1,
	flow: { id: `q7${name}`, name: `${name} on ${account}`, budget: topology.budget, steps: topology.steps },
});
if (isRefusal(opened)) throw new Error(opened.refusal);
const { run, runDir, conditions } = opened;
if (isRefusal(run.bless())) throw new Error("bless refused");

/**
 * Drive to a true terminal, ruling every gate and card the way Felix's hand
 * would. A gate is ruled on the report it paused with; a card on its ask. The
 * loop stops when a pass rules nothing — a run paused on anything else has
 * genuinely stopped, and that is the measurement, not a thing to nudge past.
 */
async function drive(r: Run): Promise<RunState> {
	let state = await r.run();
	for (;;) {
		let ruled = false;
		for (const [id, at] of Object.entries(state.steps)) {
			if (at.at !== "paused") continue;
			const only = at.causes.length === 1 ? at.causes[0] : null;
			if (only !== "gate" && only !== "card") continue;
			console.log(`  ruling ${id} ‹${only}› land — ${at.detail}`);
			const done = await r.rule(id, { do: "land", note: `C8 stands in for the hand: ${only} approved` });
			if (isRefusal(done)) throw new Error(done.refusal);
			ruled = true;
		}
		state = await r.run();
		if (!ruled) return state;
	}
}

const t0 = Date.now();
const state = await drive(run);
const wall = Date.now() - t0;

console.log(`\n# ${drill} · ${conditions.at} · load ${conditions.load} · concurrent ${conditions.concurrent}`);
for (const [id, at] of Object.entries(state.steps))
	console.log(`  ${id.padEnd(8)} ${at.at}${at.at === "paused" ? ` ‹${at.causes.join(", ")}› ${at.detail}` : ""}`);
console.log(`  turns ${state.turns}/${state.budget} · wall ${(wall / 1000).toFixed(1)} s`);

console.log(`  work on disk:`);
for (const [file, want] of Object.entries(topology.expect)) {
	const path = `${conditions.workDir}/${file}`;
	const got = existsSync(path) ? readFileSync(path, "utf8").trim() : "(absent)";
	console.log(`    ${file.padEnd(14)} ${got === want ? "OK  " : "DIFF"} ${JSON.stringify(got)}`);
}

const reds = invariants(`${runDir}/run.jsonl`);
for (const x of reds) console.log(`  RED ${x.invariant} ${x.name}\t${x.step}\t${x.detail}`);
console.log(`  invariants: ${reds.length === 0 ? "9/9 green" : `${reds.length} violations`}`);
console.log(`  log ${runDir}/run.jsonl`);
process.exit(reds.length === 0 ? 0 : 1);
