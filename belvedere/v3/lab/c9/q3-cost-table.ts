#!/usr/bin/env bun
// Q3 — the cost extrapolation table, G4's exhibit.
//
//   bun q3-cost-table.ts
//
// Nothing here is typed by hand: every rung is re-read from the run logs and
// streams Q2 left in `summon/log/v3/c9`, and the fake column from Q1's under
// `c9-fake`. The extrapolation is a least-squares line through the **measured**
// rungs and it is labelled as extrapolation wherever it leaves them — the real
// ladder was sanctioned to 25 and no number above it was ever run.
//
// Two flow shapes, because they cost differently and G4 is choosing between
// them: **burst** (N independent steps, all in flight at once) and **serial**
// (N steps on one edge chain, one subject at a time).

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { readLog } from "../../engine/log.ts";
import { RUNS, RUNS_FAKE } from "./meter.ts";

type Rung = { width: number; wallS: number; costUsd: number; perTurn: number; cacheWrite: number; cacheRead: number; pass: string };

function rungsUnder(root: string, prefix: string): Rung[] {
	if (!existsSync(root)) return [];
	const out: Rung[] = [];
	for (const name of readdirSync(root).filter((n) => n.startsWith(prefix)).sort()) {
		const dir = `${root}/${name}`;
		const logPath = `${dir}/run.jsonl`;
		if (!existsSync(logPath)) continue;
		const entries = readLog(logPath);
		const at = (s: string) => Date.parse(s);
		const stamps = entries.map((e) => at(e.at));
		const ignitions = entries.filter((e) => e.kind === "ignited");
		if (ignitions.length === 0) continue;

		let cost = 0, cacheWrite = 0, cacheRead = 0;
		const streams = `${dir}/streams`;
		for (const f of existsSync(streams) ? readdirSync(streams).filter((n) => n.endsWith(".jsonl")) : []) {
			for (const line of readFileSync(`${streams}/${f}`, "utf8").split("\n")) {
				if (line === "" || !line.includes("\"result\"")) continue;
				let row: { type?: unknown; total_cost_usd?: unknown; usage?: Record<string, unknown> };
				try { row = JSON.parse(line) as typeof row; } catch { continue; }
				if (row.type !== "result") continue;
				if (typeof row.total_cost_usd === "number") cost += row.total_cost_usd;
				const u = row.usage;
				if (typeof u?.cache_creation_input_tokens === "number") cacheWrite += u.cache_creation_input_tokens;
				if (typeof u?.cache_read_input_tokens === "number") cacheRead += u.cache_read_input_tokens;
			}
		}
		const width = ignitions.length;
		// Wall from the log's own span — the blessing to the last transition.
		const wallS = (Math.max(...stamps) - Math.min(...stamps)) / 1000;
		out.push({ width, wallS, costUsd: cost, perTurn: cost / width, cacheWrite: cacheWrite / width, cacheRead: cacheRead / width, pass: name });
	}
	return out;
}

/** Least squares through (width, wall). Two points is enough for a line and the
 *  ladder gives four; the fit's job is to say what 50 and 100 would cost, and to
 *  be visibly a fit rather than a measurement. */
function fit(points: { x: number; y: number }[]): { a: number; b: number } {
	const n = points.length;
	const sx = points.reduce((s, p) => s + p.x, 0), sy = points.reduce((s, p) => s + p.y, 0);
	const sxx = points.reduce((s, p) => s + p.x * p.x, 0), sxy = points.reduce((s, p) => s + p.x * p.y, 0);
	const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
	return { a: (sy - b * sx) / n, b };
}

const real = rungsUnder(RUNS, "q2-w");
const fake = rungsUnder(RUNS_FAKE, "q1-w");

console.log(`# Q3 — the measured rungs (real, personal, sonnet·low, \`auto\`, one T-echo turn per subject)\n`);
console.log(`| run | width | wall s | cost $ | $/turn | cache write /turn | cache read /turn |`);
console.log(`|---|---|---|---|---|---|---|`);
for (const r of real)
	console.log(`| ${r.pass} | ${r.width} | ${r.wallS.toFixed(1)} | ${r.costUsd.toFixed(4)} | ${r.perTurn.toFixed(4)} | ${Math.round(r.cacheWrite)} | ${Math.round(r.cacheRead)} |`);

// The per-turn cost the substrate settles on once the prompt cache is warm —
// every rung at width ≥ 10, which is where cache read stops climbing.
const warm = real.filter((r) => r.width >= 10);
const perTurnWarm = warm.reduce((s, r) => s + r.perTurn, 0) / warm.length;
const cold = real.find((r) => r.width === 1)?.perTurn ?? NaN;

const realFit = fit(real.map((r) => ({ x: r.width, y: r.wallS })));
const fakeByWidth = new Map<number, number[]>();
for (const f of fake) fakeByWidth.set(f.width, [...(fakeByWidth.get(f.width) ?? []), f.wallS]);
const fakeFit = fit(fake.map((f) => ({ x: f.width, y: f.wallS })));

console.log(`\n$/turn: cold cache (width 1) **$${cold.toFixed(4)}** · warm (width ≥ 10, n=${warm.length}) **$${perTurnWarm.toFixed(4)}**`);
console.log(`wall model: real \`${realFit.a.toFixed(2)} + ${realFit.b.toFixed(3)}·w\` s · fake \`${fakeFit.a.toFixed(3)} + ${fakeFit.b.toFixed(5)}·w\` s`);

console.log(`\n# Q3 — the extrapolation table (G4's exhibit)\n`);
console.log(`| flow | shape | fake $ | fake wall s | real $ | real wall s | basis |`);
console.log(`|---|---|---|---|---|---|---|`);
const MEASURED_TO = 25;
for (const n of [10, 25, 50, 100]) {
	const fakeWallMeasured = fakeByWidth.get(n);
	const fakeWall = fakeWallMeasured !== undefined
		? fakeWallMeasured.reduce((s, x) => s + x, 0) / fakeWallMeasured.length
		: fakeFit.a + fakeFit.b * n;

	const burstWall = realFit.a + realFit.b * n;
	const burstCost = n * perTurnWarm;
	const basis = n <= MEASURED_TO ? "measured" : "**extrapolated — never run: the real ladder stops at 25**";
	console.log(`| ${n} steps | burst (all at once) | 0.00 | ${fakeWall.toFixed(2)} | ${burstCost.toFixed(2)} | ${burstWall.toFixed(1)} | ${basis} |`);

	// Serial: one subject at a time, so the wall is N single-subject turns and
	// only the first pays a cold cache.
	const oneWall = realFit.a + realFit.b;
	const serialCost = cold + (n - 1) * perTurnWarm;
	console.log(`| ${n} steps | serial (one at a time) | 0.00 | ${(fakeFit.a + fakeFit.b) .toFixed(2) === "NaN" ? "?" : ((fakeFit.a + fakeFit.b) * n).toFixed(2)} | ${serialCost.toFixed(2)} | ${(oneWall * n).toFixed(0)} | ${n <= MEASURED_TO ? "measured per-turn, summed" : "**extrapolated**"} |`);
}
