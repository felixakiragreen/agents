#!/usr/bin/env bun
// The one command (cornerstone §6's automation law, his word):
//
//   bun barrage/run.ts --runs 1000 [--seed-base N]
//
// Generate, run, check, file — three phases, one exit code, no attendance.
// Phase 1 is the barrage itself (campaign bar 1), phase 2 the crash-redo drill
// (bar 2), phase 3 the mutation check (bar 3). Every red lands in `reds/` with
// its seed, and a seed is a whole reproduction: `bun one.ts --seed <n>`.
//
// Exit 0 green, exit 1 with the red count. Nothing here writes outside the run
// root (gitignored telemetry) and `reds/`.

import { mkdirSync, rmSync } from "node:fs";
import { runChild, outcomeOf } from "./child.ts";
import { crashRun, familyOf, type CrashRun } from "./crash.ts";
import { checkMutant, passed, searchSeed, MUTANT_ROWS, type MutantResult } from "./mutants.ts";
import { judge, type Red } from "./oracle.ts";
import { fileRed } from "./reds.ts";
import { SCENARIOS } from "./scenarios.ts";
import { sweep } from "./sweep.ts";
import { carriesHazard, carriesHold, scenariosIn, topology } from "./topology.ts";

const DEFAULT_ROOT = new URL("../../../summon/log/v3/barrage", import.meta.url).pathname;

const argv = process.argv.slice(2);
const flag = (name: string, fallback: string): string => {
	const i = argv.indexOf(name);
	return i === -1 ? fallback : argv[i + 1] ?? fallback;
};
const has = (name: string): boolean => argv.includes(name);

const RUNS = Number(flag("--runs", "1000"));
const SEED_BASE = Number(flag("--seed-base", "1"));
const CRASHES = Number(flag("--crashes", "50"));
const WORKERS = Math.min(8, Math.max(1, Number(flag("--workers", "8"))));
const CAP_MS = Number(flag("--cap", "60000"));
const WHOLE_CAP_MS = Number(flag("--whole-cap", "3600000"));
const ROOT = flag("--root", DEFAULT_ROOT);
const KEEP = has("--keep");
const MUTANTS_ON = !has("--no-mutants");

/** Crash seeds sit above the barrage's own range so the two never share a run
 *  dir — the drill needs a clean run and a cut run of the same seed. */
const CRASH_BASE = SEED_BASE + 1_000_000;
const MUTANT_ROOT = `${ROOT}/mutants`;

// Nothing this command spawned outlives it (C10 F4). The handler is registered
// before the first child, runs on every exit path — the clean one, a throw, and
// the two signals a human sends — and reads the run logs rather than a register
// it would have to keep: see sweep.ts. It is synchronous because an exit handler
// is the one place nothing may await.
const sweepUp = (why: string): void => {
	const killed = sweep(ROOT);
	if (killed.length > 0) console.log(`swept ${killed.length} live subject${killed.length === 1 ? "" : "s"} on ${why}: ${killed.join(", ")}`);
};
process.on("exit", () => { sweepUp("exit"); });
for (const signal of ["SIGINT", "SIGTERM"] as const)
	process.on(signal, () => { sweepUp(signal); process.exit(130); });

const started = Date.now();
const elapsed = (): string => `${((Date.now() - started) / 1000).toFixed(1)}s`;
const say = (line: string): void => { console.log(line); };

if (has("--pin-mutants")) { await pinMutants(); process.exit(0); }

mkdirSync(ROOT, { recursive: true });
let reds = 0;

// ── Phase 1 — the barrage ────────────────────────────────────────────────────
say(`barrage: ${RUNS} runs from seed ${SEED_BASE}, ${WORKERS} workers, ${CAP_MS / 1000}s per run`);
const seeds = Array.from({ length: RUNS }, (_, i) => SEED_BASE + i);
const coverage = { hold: 0, hazard: 0, tight: 0, partial: 0, steps: 0, scenarios: new Map<string, number>() };
for (const seed of seeds) {
	const plan = topology(seed);
	coverage.steps += plan.size;
	if (carriesHold(plan)) coverage.hold++;
	if (carriesHazard(plan)) coverage.hazard++;
	if (plan.tight) coverage.tight++;
	if (plan.scope.length < plan.flow.steps.length) coverage.partial++;
	for (const s of scenariosIn(plan)) coverage.scenarios.set(s, (coverage.scenarios.get(s) ?? 0) + 1);
}

let done = 0;
const barrageReds: number[] = [];
await pool(seeds, WORKERS, async (seed) => {
	const runDir = `${ROOT}/runs/${seed}`;
	rmSync(runDir, { recursive: true, force: true });
	const ran = await runChild(seed, runDir, CAP_MS);
	const verdict = judge(runDir, outcomeOf(runDir));
	const found: Red[] = [...verdict.reds];
	if (ran.capped) found.push({ invariant: 5, name: "loud pauses", step: "", detail: `the run passed its ${CAP_MS}ms wall cap and was killed` });
	if (ran.exit !== 0 && !ran.capped) found.push({ invariant: 8, name: "truth on disk", step: "", detail: `the driver exited ${ran.exit}: ${ran.stderr.trim().slice(0, 300)}` });

	if (found.length > 0) { barrageReds.push(seed); fileRed(seed, found, "run", runDir); }
	else if (!KEEP) rmSync(runDir, { recursive: true, force: true });

	done++;
	if (done % 100 === 0 || done === RUNS) say(`  ${done}/${RUNS} runs · ${barrageReds.length} red · ${elapsed()}`);
	if (Date.now() - started > WHOLE_CAP_MS) throw new Error(`the barrage passed its whole-run cap of ${WHOLE_CAP_MS}ms`);
});
reds += barrageReds.length;

// A weight-0 row is never drawn, so its absence from the coverage map is the
// table telling the truth, not the generator missing a shape.
const drawn = SCENARIOS.filter((s) => s.weight > 0);
const missing = drawn.filter((s) => !coverage.scenarios.has(s.name)).map((s) => s.name);
say("");
say(`coverage over ${RUNS} flows: ${coverage.steps} steps (mean ${(coverage.steps / RUNS).toFixed(1)})`);
say(`  gate or card   ${pct(coverage.hold)}   (quota ≥20%)`);
say(`  hazard subject ${pct(coverage.hazard)}   (quota ≥30%)`);
say(`  tight budget   ${pct(coverage.tight)}   ·  blessed in halves ${pct(coverage.partial)}`);
say(`  scenarios      ${coverage.scenarios.size}/${drawn.length}${missing.length === 0 ? "" : ` — MISSING ${missing.join(", ")}`}`);
say(`barrage: ${RUNS - barrageReds.length}/${RUNS} green${barrageReds.length === 0 ? "" : ` · red seeds ${barrageReds.join(", ")}`}`);

// ── Phase 2 — the crash-redo drill ───────────────────────────────────────────
say("");
say(`crash drill: ${CRASHES} seeded cuts, each converging on its own uncrashed run`);
const crashes: CrashRun[] = [];
await pool(Array.from({ length: CRASHES }, (_, i) => CRASH_BASE + i), WORKERS, async (seed) => {
	const result = await crashRun(seed, `${ROOT}/crash`, CAP_MS);
	crashes.push(result);
	if (result.reds.length > 0) fileRed(seed, result.reds, "crash", `${ROOT}/crash/${seed}`);
	else if (!KEEP) rmSync(`${ROOT}/crash/${seed}`, { recursive: true, force: true });
	if (crashes.length % 10 === 0 || crashes.length === CRASHES) say(`  ${crashes.length}/${CRASHES} cuts · ${elapsed()}`);
});
const crashReds = crashes.filter((c) => c.reds.length > 0);
reds += crashReds.length;
const families = new Map<string, number>();
for (const c of crashes) families.set(familyOf(c.point), (families.get(familyOf(c.point)) ?? 0) + 1);
say(`  cut families: ${[...families].map(([f, n]) => `${f} ${n}`).join(" · ")}`);
say(`  sizes ${Math.min(...crashes.map((c) => c.size))}–${Math.max(...crashes.map((c) => c.size))} steps · ${crashes.filter((c) => c.cut).length}/${CRASHES} cuts fired`);
say(`crash drill: ${crashes.length - crashReds.length}/${CRASHES} converged, zero double-ignitions${crashReds.length === 0 ? "" : ` · red seeds ${crashReds.map((c) => c.seed).join(", ")}`}`);

// ── Phase 3 — the mutation check ─────────────────────────────────────────────
let mutantResults: MutantResult[] = [];
if (MUTANTS_ON) {
	say("");
	say("mutation check: nine planted law breaks, one per invariant class");
	for (const row of MUTANT_ROWS) {
		const result = await checkMutant(row, MUTANT_ROOT, CAP_MS);
		mutantResults.push(result);
		say(`  ${passed(result) ? "caught" : "MISSED"}  ${row.name.padEnd(18)} invariant ${row.invariant} ${row.law}`);
		say(`          seed ${row.seed} · oracle named ${result.classes.join(", ") || "nothing"} · control ${result.controlGreen ? "green" : `RED (${result.controlReds.map((r) => r.invariant).join(", ")})`}${result.swept.length === 0 ? "" : ` · swept ${result.swept.length}`}`);
	}
	const missed = mutantResults.filter((r) => !passed(r));
	reds += missed.length;
	say(`mutation check: ${mutantResults.length - missed.length}/9 caught`);
	if (!KEEP) rmSync(MUTANT_ROOT, { recursive: true, force: true });
}

say("");
say(`barrage ${reds === 0 ? "GREEN" : `RED — ${reds} findings`} · ${RUNS} runs · ${CRASHES} cuts · ${MUTANTS_ON ? mutantResults.filter(passed).length : 0}/9 mutants · wall ${elapsed()}`);
process.exit(reds === 0 ? 0 : 1);

// ── the plumbing ─────────────────────────────────────────────────────────────

function pct(n: number): string {
	return `${((n / RUNS) * 100).toFixed(1)}%`.padStart(6);
}

/** At most `width` runs in flight. Each owns its run dir, so parallelism costs
 *  determinism nothing — a seed's rulings never depend on what else is running. */
async function pool<T>(items: readonly T[], width: number, work: (item: T) => Promise<void>): Promise<void> {
	let next = 0;
	const worker = async (): Promise<void> => {
		for (;;) {
			const i = next++;
			if (i >= items.length) return;
			await work(items[i]!);
		}
	};
	await Promise.all(Array.from({ length: Math.min(width, items.length) }, worker));
}

async function pinMutants(): Promise<void> {
	const from = Number(flag("--from", "2000000"));
	const to = from + Number(flag("--span", "40"));
	say(`pinning mutant seeds over ${from}..${to}`);
	for (const row of MUTANT_ROWS) {
		const seed = await searchSeed(row, from, to, `${ROOT}/pin`, CAP_MS);
		say(`  ${row.name.padEnd(18)} invariant ${row.invariant}  seed ${seed ?? "NONE FOUND"}   (needs ${row.needs})`);
	}
	rmSync(`${ROOT}/pin`, { recursive: true, force: true });
}
