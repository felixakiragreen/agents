#!/usr/bin/env bun
// The budget meter — this charge's ⬡-fork alarm, run after every drill.
//
// Two ceilings bind (D21): ≤200 subject turns and ≤$15. Turns are counted from
// the run logs, where `ignited` and `resumed` both cost one (C6 F8); dollars are
// summed live from every stream's last `result.total_cost_usd`, which is the
// only number that is not an estimate.
//
// Some turns never touch a run log: a hand turn typed into a summoned pane (Q6),
// and a raw control turn spawned outside the engine to measure what the engine
// refuses to spend (Q5's posture control). Those are tallied in
// `off-log.jsonl` beside the runs and added here — a turn the engine did not
// fire is still a turn the account paid for. Their cost is an estimate and is
// reported separately from the summed truth.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";

export const RUNS = new URL("../../../../summon/log/v3/c8", import.meta.url).pathname;

export const TURN_CEILING = 200;
export const COST_CEILING = 15;

export type Meter = {
	turns: number;
	offLog: number;
	cost: number;
	byRun: { run: string; turns: number; cost: number }[];
};

const walk = (dir: string): string[] =>
	!existsSync(dir) ? [] : readdirSync(dir).flatMap((name) => {
		const path = `${dir}/${name}`;
		return statSync(path).isDirectory() ? walk(path) : [path];
	});

/** Every `result` row's cost in one stream file. A turn emits more than one
 *  `result` when a subagent re-invokes the parent (C4 F1), and the account is
 *  billed for each — so this sums them rather than taking the last. */
function streamCost(path: string): number {
	let cost = 0;
	for (const line of readFileSync(path, "utf8").split("\n")) {
		if (line === "") continue;
		try {
			const e: unknown = JSON.parse(line);
			const row = e as { type?: unknown; total_cost_usd?: unknown };
			if (row.type === "result" && typeof row.total_cost_usd === "number") cost += row.total_cost_usd;
		} catch { /* a torn stream is a drill, not an accounting error */ }
	}
	return cost;
}

function logTurns(path: string): number {
	let turns = 0;
	for (const line of readFileSync(path, "utf8").split("\n")) {
		if (line === "") continue;
		const e = JSON.parse(line) as { kind?: string };
		if (e.kind === "ignited" || e.kind === "resumed") turns++;
	}
	return turns;
}

export function meter(root: string = RUNS): Meter {
	const byRun: Meter["byRun"] = [];
	for (const log of walk(root).filter((p) => p.endsWith("/run.jsonl"))) {
		const dir = log.slice(0, -"/run.jsonl".length);
		const cost = walk(`${dir}/streams`).filter((p) => p.endsWith(".jsonl")).reduce((sum, p) => sum + streamCost(p), 0);
		byRun.push({ run: dir.slice(root.length + 1), turns: logTurns(log), cost });
	}

	const offPath = `${root}/off-log.jsonl`;
	const offLog = !existsSync(offPath)
		? 0
		: readFileSync(offPath, "utf8").split("\n").filter((l) => l !== "").length;

	byRun.sort((a, b) => a.run.localeCompare(b.run));
	return {
		turns: byRun.reduce((n, r) => n + r.turns, 0) + offLog,
		offLog,
		cost: byRun.reduce((c, r) => c + r.cost, 0),
		byRun,
	};
}

if (import.meta.main) {
	const m = meter();
	for (const r of m.byRun) console.log(`${String(r.turns).padStart(3)}  $${r.cost.toFixed(4)}  ${r.run}`);
	console.log(`\nturns ${m.turns}/${TURN_CEILING} (${m.offLog} off-log) · cost $${m.cost.toFixed(4)}/$${COST_CEILING} (off-log turns uncosted)`);
	if (m.turns > TURN_CEILING || m.cost > COST_CEILING) {
		console.error("CEILING HIT — stop the dig, file what stands, ⬡-fork to Felix (D21)");
		process.exit(1);
	}
}
