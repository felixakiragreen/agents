#!/usr/bin/env bun
// Q3 — the numbers G4's bar-5 extrapolation runs on, taken from every real turn
// this dig spent. Nothing here spawns anything: it reads the run logs and the
// stream files that are already on disk.
//
// Three latencies, deliberately separated, because they scale differently:
//
//   api    the model's own `duration_api_ms` — what more tokens cost
//   turn   the subject's own `duration_ms` — api plus its tool work
//   wall   `turn-ended.at` minus `ignited.at` in the run log — turn plus process
//          start plus the engine's own tail. The gap is the price of
//          cornerstone §3.2 (a process per turn), and C4 F3 measured it at
//          ~2.3 s against a live process.
//
//   bun q3-numbers.ts

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { readLog } from "../../engine/log.ts";
import { streamPath } from "../../engine/spawn.ts";
import { RUNS } from "./meter.ts";

type Turn = {
	drill: string; account: string; step: string; model: string; posture: string;
	wall: number; duration: number | null; api: number | null; cost: number | null;
	inTok: number | null; outTok: number | null; landed: boolean; concurrent: number;
};

/** The last `result` row of a stream — the turn's own account of itself. */
function result(path: string): Record<string, unknown> | null {
	if (!existsSync(path)) return null;
	let last: Record<string, unknown> | null = null;
	for (const line of readFileSync(path, "utf8").split("\n")) {
		if (line === "") continue;
		try {
			const e = JSON.parse(line) as Record<string, unknown>;
			if (e.type === "result") last = e;
		} catch { /* torn by a drill */ }
	}
	return last;
}

const turns: Turn[] = [];
for (const drill of readdirSync(RUNS)) {
	const dir = `${RUNS}/${drill}`;
	if (!statSync(dir).isDirectory() || !existsSync(`${dir}/run.jsonl`)) continue;
	const c = JSON.parse(readFileSync(`${dir}/conditions.json`, "utf8")) as { account: string; concurrent?: number };

	const open = new Map<string, { at: number; model: string; posture: string; turn: number }>();
	const spent: Record<string, number> = {};
	for (const e of readLog(`${dir}/run.jsonl`)) {
		if (e.kind === "ignited" || e.kind === "resumed") {
			const n = spent[e.step] ?? 0;
			spent[e.step] = n + 1;
			const prior = open.get(e.step);
			open.set(e.step, {
				at: Date.parse(e.at), turn: n,
				model: e.kind === "ignited" ? e.model : prior?.model ?? "sonnet",
				posture: e.kind === "ignited" ? e.posture : prior?.posture ?? "auto",
			});
		}
		if (e.kind === "turn-ended") {
			const o = open.get(e.step);
			if (o === undefined) continue;
			const r = result(streamPath(dir, e.step, o.turn));
			const usage = (r?.usage ?? null) as { input_tokens?: number; output_tokens?: number } | null;
			turns.push({
				drill, account: c.account, step: e.step, model: o.model, posture: o.posture,
				wall: Date.parse(e.at) - o.at,
				duration: typeof r?.duration_ms === "number" ? r.duration_ms : null,
				api: typeof r?.duration_api_ms === "number" ? r.duration_api_ms : null,
				cost: typeof r?.total_cost_usd === "number" ? r.total_cost_usd : null,
				inTok: usage?.input_tokens ?? null, outTok: usage?.output_tokens ?? null,
				landed: r !== null,
				concurrent: c.concurrent ?? 1,
			});
		}
	}
}

const nums = (xs: (number | null)[]): number[] => xs.filter((x): x is number => x !== null).sort((a, b) => a - b);
const q = (xs: number[], p: number): number => xs.length === 0 ? NaN : xs[Math.min(xs.length - 1, Math.floor(xs.length * p))]!;
const stat = (label: string, xs: number[], unit: string, dp = 0) =>
	console.log(`  ${label.padEnd(22)} n=${String(xs.length).padStart(3)}  min ${xs[0]?.toFixed(dp) ?? "–"}  p50 ${q(xs, 0.5).toFixed(dp)}  p90 ${q(xs, 0.9).toFixed(dp)}  max ${xs.at(-1)?.toFixed(dp) ?? "–"} ${unit}`);

const complete = turns.filter((t) => t.landed);
console.log(`# Q3 — the numbers · ${turns.length} turns recorded, ${complete.length} with a result row (the rest were cut by a drill)\n`);

console.log(`## latency`);
stat("api (model only)", nums(complete.map((t) => t.api)), "ms");
stat("turn (subject's own)", nums(complete.map((t) => t.duration)), "ms");
stat("wall (engine to engine)", nums(complete.map((t) => t.wall)), "ms");
const overhead = complete.filter((t) => t.duration !== null).map((t) => t.wall - t.duration!);
stat("engine + process start", overhead.sort((a, b) => a - b), "ms");

console.log(`\n## cost`);
const costs = nums(complete.map((t) => t.cost));
stat("cost/turn", costs, "USD", 4);
const total = costs.reduce((a, b) => a + b, 0);
console.log(`  ${"total".padEnd(22)} $${total.toFixed(4)} over ${costs.length} turns · mean $${(total / costs.length).toFixed(4)}/turn`);
console.log(`  ${"C4 F11's control".padEnd(22)} $0.0331/turn (51 turns, haiku+sonnet, 2026-08-29)`);

console.log(`\n## cost by account (same prompts, same model, same posture)`);
for (const a of [...new Set(complete.map((t) => t.account))].sort()) {
	const xs = nums(complete.filter((t) => t.account === a).map((t) => t.cost));
	const inTok = nums(complete.filter((t) => t.account === a).map((t) => t.inTok));
	console.log(`  ${a.padEnd(14)} n=${String(xs.length).padStart(3)} mean $${(xs.reduce((p, c) => p + c, 0) / xs.length).toFixed(4)}/turn · p50 input tokens ${q(inTok, 0.5)}`);
}

console.log(`\n## the q7 topologies only (the comparable set: sonnet·low, auto, one prompt shape)`);
const q7 = complete.filter((t) => t.drill.startsWith("q7-"));
for (const a of [...new Set(q7.map((t) => t.account))].sort()) {
	const xs = q7.filter((t) => t.account === a);
	const cs = nums(xs.map((t) => t.cost)), ws = nums(xs.map((t) => t.wall));
	console.log(`  ${a.padEnd(14)} n=${xs.length} · mean $${(cs.reduce((p, c) => p + c, 0) / cs.length).toFixed(4)}/turn · p50 wall ${q(ws, 0.5).toFixed(0)} ms`);
}

console.log(`\n## width 2 vs width 1 (the fan's parallel edges)`);
for (const w of [1, 2]) {
	const xs = nums(q7.filter((t) => t.concurrent === w).map((t) => t.wall));
	if (xs.length > 0) stat(`concurrent ${w}`, xs, "ms wall");
}

console.log(`\n## what a G4 run would cost, at this dig's measured mean`);
const mean = total / costs.length;
for (const steps of [10, 25, 50, 100])
	console.log(`  ${String(steps).padStart(3)}-step flow  $${(steps * mean).toFixed(2)}   (C4 F11's number would have said $${(steps * 0.0331).toFixed(2)})`);
