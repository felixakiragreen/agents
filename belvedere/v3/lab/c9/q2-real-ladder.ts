#!/usr/bin/env bun
// Q2 — bar 5's second half: the real scale ladder, one rung per invocation.
//
//   bun q2-real-ladder.ts <width> [account]
//
// One rung is one flow of `width` independent real steps — no edges, so the
// engine puts the whole width in flight in one tick and the number measured is
// the substrate's, not the topology's. Each subject gets a T-echo turn carrying
// **its own token**, and the token comes back in that step's own report: census
// fidelity is then a per-subject identity check rather than a count, which is
// what would catch two subjects sharing a session or a transcript.
//
// Run one rung at a time on purpose (the charge's ladder, and K2): between rungs
// the meter is read, the streams are swept for `rate_limit_event`, and the next
// rung is a decision rather than a loop.

import { existsSync, readFileSync } from "node:fs";
import { invariants } from "../../engine/invariants.ts";
import { replay, verdicts } from "../../engine/replay.ts";
import { readLog } from "../../engine/log.ts";
import { isRefusal } from "../../engine/refusal.ts";
import { transcriptPath } from "../../engine/transcript.ts";
import { ACCOUNTS, type Account } from "../c8/accounts.ts";
import { open, realTask, holdForLoad, REPORT_RULE } from "./drill.ts";
import { RUNS } from "./meter.ts";

const width = Number(process.argv[2] ?? 5);
const account = (process.argv[3] ?? "personal") as Account;
if (!Number.isInteger(width) || width < 1 || width > 25)
	throw new Error(`width must be 1..25 — 25 is the ceiling this charge was granted, and it is never raised (C4 Q8 / batch 8)`);

const token = (i: number): string => `ACK-${String(i).padStart(3, "0")}`;
const prompt = (i: number): string =>
	`Reply with nothing but the token ${token(i)}. Do no work, read no files and use no tools. ` +
	`${REPORT_RULE} Put the token ${token(i)} in \`cause\`.`;

/** A pass label keeps a repeat from overwriting the rung it is repeating —
 *  `open()` clears the run dir it is given, and the evidence lives there. */
const pass = process.argv[4] ?? "p1";
const drill = `q2-w${width}-${account}-${pass}`;
const held = await holdForLoad();
if (!held.quiet) console.error(`! starting under load ${held.load.toFixed(2)} — the number carries it`);

const opened = open({
	drill, root: RUNS, account, width,
	flow: {
		id: `q2w${width}`, name: `${width} real subjects on ${account}`, budget: width,
		steps: Array.from({ length: width }, (_, i) => realTask(`s${String(i).padStart(3, "0")}`, prompt(i))),
	},
});
if (isRefusal(opened)) throw new Error(opened.refusal);
const { run, runDir, conditions, close } = opened;
if (isRefusal(run.bless())) throw new Error("bless refused");

const t0 = Date.now();
const state = await run.run();
const wallMs = Date.now() - t0;
close();

// ---- the log's own timing ----------------------------------------------------
const entries = readLog(`${runDir}/run.jsonl`);
const at = (s: string) => Date.parse(s);
const ignitedAt = new Map<string, number>();
const sessionOf = new Map<string, string>();
const turnMs: number[] = [];
for (const e of entries) {
	if (e.kind === "ignited") { ignitedAt.set(e.step, at(e.at)); sessionOf.set(e.step, e.sessionId); }
	if (e.kind === "turn-ended") { const t = ignitedAt.get(e.step); if (t !== undefined) turnMs.push(at(e.at) - t); }
}
const ig = [...ignitedAt.values()];
const burstMs = ig.length === 0 ? 0 : Math.max(...ig) - Math.min(...ig);
const pct = (xs: number[], p: number) =>
	xs.length === 0 ? 0 : [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor((xs.length - 1) * p))]!;

// ---- the streams: cost, rate limits, first-byte latency ----------------------
/**
 * The rate-limit row, as the substrate actually emits it (measured at width 1,
 * 2026-08-30): **every turn carries one**, `status: "allowed"`, plus a
 * `unifiedWindows` utilization pair. So the count of `rate_limit_event` is not
 * an alarm — it is the turn count — and the alarm is a status that is not
 * "allowed". K2 is read that way, loudly, in the findings.
 */
type Limit = { status: string; fiveHour: number; sevenDay: number };
function limitOf(line: string): Limit | null {
	let e: { type?: unknown; rate_limit_info?: Record<string, unknown> };
	try { e = JSON.parse(line) as typeof e; } catch { return null; }
	if (e.type !== "rate_limit_event" || e.rate_limit_info === undefined) return null;
	const info = e.rate_limit_info;
	const w = info.unifiedWindows as { five_hour?: { utilization?: unknown }; seven_day?: { utilization?: unknown } } | undefined;
	return {
		status: typeof info.status === "string" ? info.status : "?",
		fiveHour: typeof w?.five_hour?.utilization === "number" ? w.five_hour.utilization : NaN,
		sevenDay: typeof w?.seven_day?.utilization === "number" ? w.seven_day.utilization : NaN,
	};
}

type Row = { step: string; cost: number; rateLimits: number; token: string | null; err: number };
const rows: Row[] = [];
const limits: Limit[] = [];
let cost = 0, rateLimits = 0, cacheWrite = 0, cacheRead = 0, outTokens = 0;
const streamDir = `${runDir}/streams`;
for (const step of [...ignitedAt.keys()].sort()) {
	const path = `${streamDir}/${step}.t0.jsonl`;
	const errPath = `${streamDir}/${step}.t0.err`;
	let stepCost = 0, stepLimits = 0;
	let tok: string | null = null;
	if (existsSync(path)) {
		for (const line of readFileSync(path, "utf8").split("\n")) {
			if (line === "") continue;
			const limit = limitOf(line);
			if (limit !== null) { limits.push(limit); if (limit.status !== "allowed") stepLimits++; }
			let row: Record<string, unknown>;
			try { row = JSON.parse(line) as Record<string, unknown>; } catch { continue; }
			if (row.type === "result" && typeof row.total_cost_usd === "number") {
				stepCost += row.total_cost_usd;
				// The cost driver at this scale, and the reason a T-echo turn is not
				// cheap: 100-odd output tokens against a ~34 k prompt-cache write.
				// Whether a width shares one cache write or pays N of them is the
				// whole shape of the extrapolation table, so it is measured.
				const u = row.usage as { cache_creation_input_tokens?: unknown; cache_read_input_tokens?: unknown; output_tokens?: unknown } | undefined;
				cacheWrite += typeof u?.cache_creation_input_tokens === "number" ? u.cache_creation_input_tokens : 0;
				cacheRead += typeof u?.cache_read_input_tokens === "number" ? u.cache_read_input_tokens : 0;
				outTokens += typeof u?.output_tokens === "number" ? u.output_tokens : 0;
			}
			const so = (row as { structured_output?: { cause?: unknown } }).structured_output;
			if (so !== undefined && typeof so.cause === "string") tok = so.cause;
		}
	}
	const errBytes = existsSync(errPath) ? readFileSync(errPath, "utf8").trim().length : 0;
	cost += stepCost; rateLimits += stepLimits;
	rows.push({ step, cost: stepCost, rateLimits: stepLimits, token: tok, err: errBytes });
}

// ---- census fidelity: one transcript per subject, each holding its own token --
const seen = new Set<string>();
let transcripts = 0, collisions = 0, tokensOk = 0;
for (const [step, sid] of sessionOf) {
	if (seen.has(sid)) collisions++;
	seen.add(sid);
	if (existsSync(transcriptPath(ACCOUNTS[account], conditions.workDir, sid))) transcripts++;
	const want = `ACK-${step.slice(1)}`;
	if (rows.find((r) => r.step === step)?.token?.includes(want) === true) tokensOk++;
}

const v = verdicts(state);
const landed = Object.values(v).filter((x) => x.startsWith("landed")).length;
const reds = invariants(`${runDir}/run.jsonl`);
const replayOk = JSON.stringify(replay(`${runDir}/run.jsonl`)) === JSON.stringify(state);

console.log(`\n# ${drill} · ${conditions.at} · load ${conditions.loadBefore} → ${conditions.loadAfter}`);
for (const [id, x] of Object.entries(v)) if (!x.startsWith("landed")) console.log(`  ${id} ${x}`);
for (const r of rows) if (r.err > 0) console.log(`  stderr ${r.step}: ${r.err} bytes — ${readFileSync(`${streamDir}/${r.step}.t0.err`, "utf8").slice(0, 300)}`);
for (const x of reds) console.log(`  RED ${x.invariant} ${x.name}\t${x.step}\t${x.detail}`);
console.log(
	`width ${width} · wall ${(wallMs / 1000).toFixed(1)} s · burst ${burstMs} ms · ` +
	`turn p50 ${(pct(turnMs, 0.5) / 1000).toFixed(1)} s p90 ${(pct(turnMs, 0.9) / 1000).toFixed(1)} s max ${(Math.max(...turnMs) / 1000).toFixed(1)} s · ` +
	`landed ${landed}/${width} · transcripts ${transcripts}/${width} · session collisions ${collisions} · tokens ${tokensOk}/${width} · ` +
	`rate_limit rows ${limits.length} / not-allowed ${rateLimits} · ` +
	`cost $${cost.toFixed(4)} ($${(cost / width).toFixed(4)}/turn) · ` +
	`cache write ${cacheWrite} read ${cacheRead} out ${outTokens} · ` +
	`replay ${replayOk ? "≡" : "DIFF"} · inv ${reds.length}`);
if (limits.length > 0) {
	const five = limits.map((l) => l.fiveHour).filter((n) => !Number.isNaN(n));
	const seven = limits.map((l) => l.sevenDay).filter((n) => !Number.isNaN(n));
	console.log(`utilization five_hour ${Math.min(...five).toFixed(2)} → ${Math.max(...five).toFixed(2)} · seven_day ${Math.min(...seven).toFixed(2)} → ${Math.max(...seven).toFixed(2)} · statuses ${[...new Set(limits.map((l) => l.status))].join(", ")}`);
}
console.log(`log ${runDir}/run.jsonl`);
console.log(`row | ${width} | ${(wallMs / 1000).toFixed(1)} | ${burstMs} | ${(pct(turnMs, 0.5) / 1000).toFixed(1)} | ${(pct(turnMs, 0.9) / 1000).toFixed(1)} | ${(Math.max(...turnMs) / 1000).toFixed(1)} | ${landed}/${width} | ${transcripts}/${width} | ${collisions} | ${tokensOk}/${width} | ${rateLimits} | ${cost.toFixed(4)} | ${(cost / width).toFixed(4)} | ${Math.round(cacheWrite / width)} | ${Math.round(cacheRead / width)} | ${reds.length} |`);

process.exit(reds.length === 0 && landed === width ? 0 : 1);
