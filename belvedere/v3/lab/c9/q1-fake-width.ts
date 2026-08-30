#!/usr/bin/env bun
// Q1 + Q4 — bar 5's first half: N simultaneous fake subjects through the engine,
// repeated in **one process** so run-to-run memory growth is visible at all.
//
//   bun q1-fake-width.ts [width] [repeats] [scenario]
//
// What each repeat measures, and why it is measured that way:
//
//   wall        bless → terminal, the whole flow.
//   burst       first `ignited` to last `ignited` — how long the engine takes to
//               get the whole width in flight, which is the number that would
//               tell us the fan-out is serial in disguise.
//   turn p50/max  per step, `ignited` → `turn-ended` from the log's own stamps.
//   max in flight  the log's own [ignited, turn-ended] intervals, swept. Ties at
//               millisecond resolution resolve the *end* first, so the number is
//               a floor, never a flatter.
//   RSS         sampled every 5 ms in-process; peak and end-of-run both, so
//               "stable run to run" is a comparison of ends, not of peaks.
//   fd          `/dev/fd` is per-process on macOS, so its length is this
//               engine's own open-descriptor count — 100 stream files, 100
//               stderr files and 100 tails at once is exactly the resource wall
//               the charge asks about. The reader's own descriptor is in the
//               count; it is one, and it is not subtracted.
//   orphans     every pid the log ignited, checked dead at terminal.
//   replay      `replay(log)` deep-equal to `state()` — law 1 at width.
//   invariants  the oracle over the run log; zero, or the run is the finding.

import { readdirSync } from "node:fs";
import { invariants } from "../../engine/invariants.ts";
import { replay, verdicts, type RunState } from "../../engine/replay.ts";
import { readLog } from "../../engine/log.ts";
import { isRefusal } from "../../engine/refusal.ts";
import { open, fakeTask, holdForLoad, loadTriple } from "./drill.ts";
import { RUNS_FAKE } from "./meter.ts";

const width = Number(process.argv[2] ?? 100);
const repeats = Number(process.argv[3] ?? 3);
const scenario = process.argv[4] ?? "schema-done";

/** This process's open descriptors. macOS `/dev/fd` is per-process. */
const fdCount = (): number => readdirSync("/dev/fd").length;

const pct = (xs: number[], p: number): number =>
	xs.length === 0 ? 0 : [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor((xs.length - 1) * p))]!;

const alive = (pid: number): boolean => { try { process.kill(pid, 0); return true; } catch { return false; } };

type Row = {
	repeat: number; wallMs: number; burstMs: number; maxConcurrent: number; turnP50: number; turnMax: number;
	rssPeakMb: number; rssEndMb: number; fdPeak: number; orphans: number;
	violations: number; replayOk: boolean; landed: number; other: string[];
	loadBefore: string; loadAfter: string;
};

const rows: Row[] = [];

for (let repeat = 1; repeat <= repeats; repeat++) {
	const held = await holdForLoad();
	if (!held.quiet) console.error(`  ! starting under load ${held.load.toFixed(2)} — the number carries it`);

	const drill = `q1-w${width}-r${repeat}`;
	const opened = open({
		drill, root: RUNS_FAKE, width,
		flow: {
			id: `q1w${width}`, name: `${width} fake subjects, repeat ${repeat}`, budget: width,
			steps: Array.from({ length: width }, (_, i) => fakeTask(`s${String(i).padStart(3, "0")}`, 1000 + repeat * 1000 + i, scenario)),
		},
	});
	if (isRefusal(opened)) throw new Error(opened.refusal);
	const { run, runDir, close } = opened;
	if (isRefusal(run.bless())) throw new Error("bless refused");

	let rssPeak = 0;
	let fdPeak = 0;
	// 5 ms, and one sample taken before the run: a width whose whole flow is
	// over inside one sampling interval must still produce a number.
	const sample = () => {
		rssPeak = Math.max(rssPeak, process.memoryUsage.rss());
		fdPeak = Math.max(fdPeak, fdCount());
	};
	sample();
	const sampler = setInterval(sample, 5);

	const t0 = Date.now();
	const state: RunState = await run.run();
	const wallMs = Date.now() - t0;
	clearInterval(sampler);
	const conditions = close();

	const entries = readLog(`${runDir}/run.jsonl`);
	const stamp = (s: string) => Date.parse(s);
	const ignitedAt = new Map<string, number>();
	const turns: number[] = [];
	const pids: number[] = [];
	for (const e of entries) {
		if (e.kind === "ignited") { ignitedAt.set(e.step, stamp(e.at)); pids.push(e.pid); }
		if (e.kind === "turn-ended") {
			const t = ignitedAt.get(e.step);
			if (t !== undefined) turns.push(stamp(e.at) - t);
		}
	}
	const ignitions = [...ignitedAt.values()];
	const burstMs = ignitions.length === 0 ? 0 : Math.max(...ignitions) - Math.min(...ignitions);

	// "Simultaneous" is a claim, so it is measured rather than asserted: sweep
	// the log's own [ignited, turn-ended] intervals and take the high-water mark.
	// A width of 100 that never had more than 3 in flight would fail bar 5 while
	// looking green everywhere else.
	const edges: { t: number; d: number }[] = [];
	for (const e of entries) {
		if (e.kind === "ignited") edges.push({ t: stamp(e.at), d: +1 });
		if (e.kind === "turn-ended") edges.push({ t: stamp(e.at), d: -1 });
	}
	edges.sort((a, b) => a.t - b.t || a.d - b.d);
	let live = 0, maxConcurrent = 0;
	for (const e of edges) { live += e.d; maxConcurrent = Math.max(maxConcurrent, live); }

	const v = verdicts(state);
	const landed = Object.values(v).filter((x) => x.startsWith("landed")).length;
	const other = [...new Set(Object.values(v).filter((x) => !x.startsWith("landed")))];

	const replayed = replay(`${runDir}/run.jsonl`);
	const replayOk = JSON.stringify(replayed) === JSON.stringify(state);

	rows.push({
		repeat, wallMs, burstMs, maxConcurrent,
		turnP50: pct(turns, 0.5), turnMax: turns.length === 0 ? 0 : Math.max(...turns),
		rssPeakMb: rssPeak / 1024 / 1024, rssEndMb: process.memoryUsage.rss() / 1024 / 1024,
		fdPeak, orphans: pids.filter(alive).length,
		violations: invariants(`${runDir}/run.jsonl`).length,
		replayOk, landed, other,
		loadBefore: conditions.loadBefore, loadAfter: conditions.loadAfter ?? "?",
	});

	for (const x of invariants(`${runDir}/run.jsonl`))
		console.log(`  RED ${x.invariant} ${x.name}\t${x.step}\t${x.detail}`);
	const r = rows[rows.length - 1]!;
	console.log(`repeat ${repeat}: wall ${(r.wallMs / 1000).toFixed(1)} s · burst ${r.burstMs} ms · max in flight ${r.maxConcurrent} · turn p50 ${r.turnP50} ms / max ${r.turnMax} ms · ` +
		`rss peak ${r.rssPeakMb.toFixed(0)} MB / end ${r.rssEndMb.toFixed(0)} MB · fd peak ${r.fdPeak} · orphans ${r.orphans} · ` +
		`landed ${r.landed}/${width}${r.other.length > 0 ? ` (${r.other.join(", ")})` : ""} · replay ${r.replayOk ? "≡" : "DIFF"} · inv ${r.violations} · load ${r.loadBefore} → ${r.loadAfter}`);
}

console.log(`\n# Q1 · width ${width} · scenario ${scenario} · ${new Date().toISOString()} · load ${loadTriple()}`);
console.log(`| repeat | wall s | burst ms | max in flight | turn p50 ms | turn max ms | RSS peak MB | RSS end MB | fd peak | orphans | landed | replay | inv | load before → after |`);
console.log(`|---|---|---|---|---|---|---|---|---|---|---|---|---|---|`);
for (const r of rows)
	console.log(`| ${r.repeat} | ${(r.wallMs / 1000).toFixed(1)} | ${r.burstMs} | ${r.maxConcurrent} | ${r.turnP50} | ${r.turnMax} | ${r.rssPeakMb.toFixed(0)} | ${r.rssEndMb.toFixed(0)} | ${r.fdPeak} | ${r.orphans} | ${r.landed}/${width} | ${r.replayOk ? "≡" : "DIFF"} | ${r.violations} | ${r.loadBefore} → ${r.loadAfter} |`);

const bad = rows.filter((r) => r.violations > 0 || !r.replayOk || r.orphans > 0 || r.landed !== width);
process.exit(bad.length === 0 ? 0 : 1);
