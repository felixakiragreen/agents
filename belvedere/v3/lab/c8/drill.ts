// The layer-1 harness: the same engine, pointed at a real account.
//
// Everything here is scaffolding around two calls the engine already exposes —
// `load()` with a real venue, and `run()`. Nothing in this file senses, parses
// or judges: that is the engine's, and measuring it is the point.
//
// Every run writes its conditions beside its log (findings law 7): account ·
// model · posture · load · timestamp · cwd. A number with no conditions is not
// a measurement.

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { load, type Run } from "../../engine/engine.ts";
import { isRefusal, type Refusal } from "../../engine/refusal.ts";
import { ACCOUNTS, precheckReal, venueOn, type Account } from "./accounts.ts";
import { RUNS } from "./meter.ts";

/** Subject work dirs live in scratch and die at landing (the v3 fence). */
export const SCRATCH =
	"/private/tmp/claude-502/-Users-felix-code-agents/acc07356-4518-44b7-85e1-cd75f58d25c0/scratchpad/c8";

/** The one venue all three accounts trust, for the summon round trip alone
 *  (C4 F8): a scratch cwd is born unsummonable. */
export const WARM_VENUE = "/Users/felix/code/agents";

export type Conditions = {
	drill: string;
	account: Account;
	configDir: string;
	workDir: string;
	at: string;
	load: string;
	concurrent: number;
};

export type Drill = {
	run: Run;
	runDir: string;
	conditions: Conditions;
};

export type Spec = {
	drill: string;
	account: Account;
	flow: unknown;
	/** Defaults to a fresh scratch cwd named for the drill. */
	workDir?: string;
	/** How many subjects this drill has in flight at once, for the record. */
	concurrent?: number;
	/**
	 * Whether this flow intends its sessions to be summonable to a real terminal
	 * (D20's fallback). Only then must the venue be trusted, because the trust
	 * dialog is the TUI's and `-p` skips it — C4 F8 measured the block on the
	 * summon path, never on ignition.
	 *
	 * It matters that this is a per-flow question rather than an engine-wide
	 * policy: the v3 fence puts subject work dirs in scratch, and no account has
	 * ever trusted a scratch dir, so an unconditional precheck at ignite would
	 * refuse every fence-compliant venue there is (measured — see findings).
	 */
	summonable?: boolean;
};

/**
 * Open one layer-1 run. The run dir is telemetry (gitignored); the work dir is
 * scratch. The flow is written into the run dir so the bytes that were blessed
 * are the bytes on disk beside the log.
 */
export function open(spec: Spec): Drill | Refusal {
	const runDir = `${RUNS}/${spec.drill}`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });

	const workDir = spec.workDir ?? `${SCRATCH}/${spec.drill}`;
	mkdirSync(workDir, { recursive: true });

	const flowPath = `${runDir}/flow.json`;
	writeFileSync(flowPath, JSON.stringify(spec.flow, null, 2) + "\n");

	const conditions: Conditions = {
		drill: spec.drill,
		account: spec.account,
		configDir: ACCOUNTS[spec.account],
		workDir,
		at: new Date().toISOString(),
		load: loadavg().map((n) => n.toFixed(2)).join(" "),
		concurrent: spec.concurrent ?? 1,
	};
	writeFileSync(`${runDir}/conditions.json`, JSON.stringify(conditions, null, 2) + "\n");

	const run = load(flowPath, {
		runDir,
		venue: venueOn(spec.account, workDir),
		account: spec.account,
		precheck: spec.summonable === true ? precheckReal : undefined,
	});
	if (isRefusal(run)) return run;
	return { run, runDir, conditions };
}

/**
 * A real step at the charge's default conditions: sonnet·low under `auto`, the
 * unattended pair C4 F6 named. `extra` overrides any of it — a gate names its
 * kind, a lifecycle-only step drops to haiku·acceptEdits.
 *
 * Subject prompts never mention this repo (C4 F12, the charge's input line).
 */
export const task = (id: string, prompt: string, depends: string[] = [], extra: object = {}) => ({
	kind: "task", id, depends, prompt, subject: { real: {} },
	model: "sonnet", effort: "low", posture: "auto", timeout_ms: 180_000, ...extra,
});

/** What every real step is told about the report it must fill. The schema is
 *  declared on the wire (`--json-schema`, C4 F5); this is the sentence that
 *  tells the subject which state it is in. */
export const REPORT_RULE =
	"When you are finished, set the report state to `done`. " +
	"If you cannot proceed without an answer from a human, set it to `needs_input` " +
	"and put the question in `cause`. If you are blocked for any other reason, set it to `blocked`.";
