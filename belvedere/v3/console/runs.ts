// Finding a run, and reopening it.
//
// A run dir is anything holding a `run.jsonl`. That file is the whole truth
// (cornerstone §3.4), so everything the console *shows* comes out of it and
// nothing else: steps, states, causes, session ids, pids, the flow itself.
//
// Two things the driving verbs need beyond the step states:
//
//  - **the venue, and so the account.** `CLAUDE_CONFIG_DIR` selects the account
//    (C4 F0) and since C14 the `ignited` event records it, so the log alone
//    re-opens a run to drive it. Three sources, in this order and no other: the
//    log; then `conditions.json` beside it, which is how a **pre-C14** run says
//    the same thing (C8's harness wrote it, C10 F5 named the gap); then the
//    engine's own sandbox (`venueFor`), which is exactly right for a layer-0
//    run and wrong for every other — a pre-C14 real run whose sidecar is gone
//    is readable forever and drivable never, and the verbs say so rather than
//    resuming into a config dir that holds no such session.
//  - **the flow file.** `load()` takes a path, and a run's flow may have been
//    written anywhere. But the log's first event carries the flow *itself*, so
//    when no `flow.json` sits beside the log this materializes one from those
//    bytes — the same bytes `load()` will compare against (invariant 8).
//
// The walk uses `readdirSync`, which returns dotted names. That is deliberate:
// the archive and the account dirs are hidden trees and a glob that forgets its
// dot flag answers "nothing found", plausibly and wrongly (C12 F1, C13 F5).

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { load, venueFor, type Run } from "../engine/engine.ts";
import { readLog, type Entry } from "../engine/log.ts";
import { fold, type RunState } from "../engine/replay.ts";
import { isRefusal, refuse, type Refusal } from "../engine/refusal.ts";
import type { Venue } from "../engine/spawn.ts";
import { accountOf } from "../engine/venue.ts";

/** The v3 telemetry tree: every campaign's runs live under it. */
export const TELEMETRY = new URL("../../../summon/log/v3", import.meta.url).pathname;

/** What one run is, before anything is driven. */
export type RunHandle = {
	/** The run dir's path under the root — how every verb addresses it. */
	name: string;
	dir: string;
	entries: Entry[];
	state: RunState;
	venue: Venue;
	/** The account's own word where the config dir is one of the three, the raw
	 *  config dir where it is not, and **null for a layer-0 run** — a sandbox the
	 *  run made and owns is not an account. */
	account: string | null;
	/** Where the venue came from. A run resolved `sandbox` was never told, so a
	 *  real subject in it cannot be driven — the verbs refuse rather than guess. */
	venueFrom: "log" | "conditions" | "sandbox";
};

/** What a run that means to be re-driven leaves beside its log. Extra fields are
 *  the writer's business — only these two are read. */
type Conditions = { account?: unknown; configDir?: unknown; workDir?: unknown };

export function findRunDirs(root: string): string[] {
	if (!existsSync(root)) return [];
	const found: string[] = [];
	const walk = (dir: string): void => {
		if (existsSync(`${dir}/run.jsonl`)) { found.push(dir); return; }
		for (const name of readdirSync(dir)) {
			const path = `${dir}/${name}`;
			if (statSync(path).isDirectory()) walk(path);
		}
	};
	walk(root);
	return found.sort();
}

export function readRun(dir: string, root: string): RunHandle | Refusal {
	const logPath = `${dir}/run.jsonl`;
	if (!existsSync(logPath)) return refuse(`${dir} holds no run.jsonl`);
	const entries = readLog(logPath);
	const fromLog = venueInLog(entries);
	const conditions = readConditions(dir);
	const venue = fromLog ?? conditions.venue ?? venueFor(dir);
	return {
		name: dir.startsWith(`${root}/`) ? dir.slice(root.length + 1) : dir,
		dir,
		entries,
		state: fold(entries),
		venue,
		account: fromLog !== null ? nameOf(fromLog, dir) : conditions.account,
		venueFrom: fromLog !== null ? "log" : conditions.venue !== null ? "conditions" : "sandbox",
	};
}

/** The venue the run log itself names (C14). The first ignition carries it, and
 *  a run has one venue for all its steps — the engine closes over exactly one.
 *  Null for a log recorded before C14: absent is legal forever. */
function venueInLog(entries: readonly Entry[]): Venue | null {
	for (const e of entries)
		if (e.kind === "ignited" && typeof e.configDir === "string")
			return { workDir: e.venue, configDir: e.configDir };
	return null;
}

/** The word for an account, or null where the config dir is the run's own
 *  sandbox — a layer-0 run has no account to name. */
const nameOf = (venue: Venue, dir: string): string | null =>
	venue.configDir === venueFor(dir).configDir ? null : accountOf(venue.configDir) ?? venue.configDir;

export const runs = (root: string): RunHandle[] =>
	findRunDirs(root).flatMap((dir) => {
		const handle = readRun(dir, root);
		return isRefusal(handle) ? [] : [handle];
	});

/** `<name>` addresses a run under the root, or is a run dir outright. */
export function locate(name: string, root: string): RunHandle | Refusal {
	for (const dir of [name, `${root}/${name}`])
		if (existsSync(`${dir}/run.jsonl`)) return readRun(dir, root);
	return refuse(`no run at ${JSON.stringify(name)} — neither a run dir nor one under ${root}`);
}

/**
 * The engine, pointed at this run: the flow it was blessed on, its own venue,
 * its own account. Every driving verb goes through here, so `rule()`'s refusals
 * are the console's refusals and nothing re-implements them.
 */
export function openRun(handle: RunHandle): Run | Refusal {
	const flowPath = flowFile(handle);
	if (isRefusal(flowPath)) return flowPath;
	return load(flowPath, { runDir: handle.dir, venue: handle.venue });
}

/**
 * Whether this run can be driven at all. A real subject needs the config dir
 * that selects its account, and a run that was never told one — a pre-C14 log
 * with no `conditions.json` beside it — would be resumed into the engine's
 * sandbox, where the session does not exist. That is a refusal, not an attempt
 * (C10 F5: readable forever, drivable never).
 */
export function drivable(handle: RunHandle): true | Refusal {
	if (handle.venueFrom !== "sandbox") return true;
	const real = handle.state.flow?.steps.some((s) => s.kind !== "card" && "real" in s.subject) === true;
	if (!real) return true;
	return refuse(`${handle.name} rides real subjects and names no config dir — its log predates C14 and its conditions.json is gone, so the account that holds these sessions is unknown and nothing here will guess it`);
}

/** The blessed flow as a file. Beside the log if someone put it there; written
 *  from the log's own first event if not. */
function flowFile(handle: RunHandle): string | Refusal {
	const path = `${handle.dir}/flow.json`;
	if (existsSync(path)) return path;
	if (handle.state.flow === null) return refuse(`${handle.name} was never blessed — there is no flow to reopen it on`);
	writeFileSync(path, JSON.stringify(handle.state.flow, null, 2) + "\n");
	return path;
}

function readConditions(dir: string): { venue: Venue | null; account: string | null } {
	const path = `${dir}/conditions.json`;
	if (!existsSync(path)) return { venue: null, account: null };
	let raw: unknown;
	try { raw = JSON.parse(readFileSync(path, "utf8")); } catch { return { venue: null, account: null }; }
	if (typeof raw !== "object" || raw === null) return { venue: null, account: null };
	const c = raw as Conditions;
	const venue = typeof c.configDir === "string" && typeof c.workDir === "string"
		? { workDir: c.workDir, configDir: c.configDir }
		: null;
	return { venue, account: typeof c.account === "string" ? c.account : null };
}

/** Whether the process the log named is still there. `kill(pid, 0)` asks the
 *  kernel and does nothing else — the same question `adopt()` asks. */
export const alive = (pid: number): boolean => {
	try { process.kill(pid, 0); return true; } catch { return false; }
};
