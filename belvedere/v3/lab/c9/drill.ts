// C9's harness — the same engine, measured at width.
//
// C8's `drill.ts` is the ancestor and the account/trust reads are imported from
// it outright (`../c8/accounts.ts`); what C9 adds is only what a *timed* charge
// needs and C8 did not:
//
//   - a run root per arm (fake runs must never land in the budget meter's root);
//   - load recorded **before and after** every arm, not just at open (findings
//     law 7 — a number whose machine was quiet at the start and thrashing at the
//     end is not a measurement);
//   - `holdForLoad()`, the batch-8 concurrency plan's gate: a timed arm waits
//     while 1-min load is above 8 rather than producing a contaminated number.
//
// Nothing here senses, parses or judges — that is the engine's, and measuring it
// is the point.

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { load as loadRun, type Run } from "../../engine/engine.ts";
import { isRefusal, type Refusal } from "../../engine/refusal.ts";
import { ACCOUNTS, precheckReal, venueOn, type Account } from "../c8/accounts.ts";

/** Subject work dirs live in scratch and die at landing (the v3 fence). */
export const SCRATCH =
	"/private/tmp/claude-502/-Users-felix-code-agents/acc07356-4518-44b7-85e1-cd75f58d25c0/scratchpad/c9";

/** The batch-8 concurrency plan's threshold: above this the desktop is not
 *  quiet enough for a timed arm. */
export const LOAD_CEILING = 8;

export const load1 = (): number => loadavg()[0] ?? 0;
export const loadTriple = (): string => loadavg().map((n) => n.toFixed(2)).join(" ");

/**
 * Hold until the desktop is quiet. The batch note's rule, made mechanical: a
 * timed arm never starts over someone else's load. Returns the load it started
 * on, or gives up loudly after `maxWaitMs` — a number produced under a load the
 * charge could not clear is filed with that load, never silently averaged in.
 */
export async function holdForLoad(maxWaitMs = 20 * 60_000): Promise<{ load: number; waitedMs: number; quiet: boolean }> {
	const t0 = Date.now();
	for (;;) {
		const l = load1();
		if (l <= LOAD_CEILING) return { load: l, waitedMs: Date.now() - t0, quiet: true };
		if (Date.now() - t0 >= maxWaitMs) return { load: l, waitedMs: Date.now() - t0, quiet: false };
		process.stderr.write(`  load ${l.toFixed(2)} > ${LOAD_CEILING} — holding (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
		await Bun.sleep(15_000);
	}
}

export type Conditions = {
	drill: string;
	account: Account | "fake";
	configDir: string;
	workDir: string;
	at: string;
	loadBefore: string;
	loadAfter: string | null;
	width: number;
};

export type Drill = {
	run: Run;
	runDir: string;
	conditions: Conditions;
	/** Stamp the closing load and write the conditions file. Every arm calls it. */
	close(): Conditions;
};

export type Spec = {
	drill: string;
	root: string;
	/** Omitted for a fake arm: the venue is then the run dir's own sandbox. */
	account?: Account;
	flow: unknown;
	width: number;
	workDir?: string;
	summonable?: boolean;
};

export function open(spec: Spec): Drill | Refusal {
	const runDir = `${spec.root}/${spec.drill}`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });

	const workDir = spec.workDir ?? `${SCRATCH}/${spec.drill}`;
	mkdirSync(workDir, { recursive: true });

	const flowPath = `${runDir}/flow.json`;
	writeFileSync(flowPath, JSON.stringify(spec.flow, null, 2) + "\n");

	const conditions: Conditions = {
		drill: spec.drill,
		account: spec.account ?? "fake",
		configDir: spec.account === undefined ? `${runDir}/config` : ACCOUNTS[spec.account],
		workDir,
		at: new Date().toISOString(),
		loadBefore: loadTriple(),
		loadAfter: null,
		width: spec.width,
	};

	const run = loadRun(flowPath, {
		runDir,
		venue: spec.account === undefined ? undefined : venueOn(spec.account, workDir),
		account: spec.account,
		precheck: spec.summonable === true ? precheckReal : undefined,
	});
	if (isRefusal(run)) return run;

	const write = () => writeFileSync(`${runDir}/conditions.json`, JSON.stringify(conditions, null, 2) + "\n");
	write();
	return {
		run, runDir, conditions,
		close() { conditions.loadAfter = loadTriple(); write(); return conditions; },
	};
}

/** A real step at C9's conditions: sonnet·low under `auto` (C8's unattended
 *  pair). Subject prompts never mention this repo (C4 F12). */
export const realTask = (id: string, prompt: string, depends: string[] = [], extra: object = {}) => ({
	kind: "task", id, depends, prompt, subject: { real: {} },
	model: "sonnet", effort: "low", posture: "auto", timeout_ms: 300_000, ...extra,
});

/** A fake step: the scenario the whole width runs, seeded per step so the id
 *  streams differ (C5 F5 — one seed across 100 steps is 100 identical session
 *  ids). */
export const fakeTask = (id: string, seed: number, scenario = "schema-done", depends: string[] = []) => ({
	kind: "task", id, depends, subject: { fake: { scenario, seed } },
	model: "sonnet", effort: "low", posture: "auto", timeout_ms: 300_000,
});

export const REPORT_RULE =
	"When you are finished, set the report state to `done`. " +
	"If you cannot proceed without an answer from a human, set it to `needs_input` " +
	"and put the question in `cause`. If you are blocked for any other reason, set it to `blocked`.";
