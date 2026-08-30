// Finding a run, and reopening it.
//
// A run dir is anything holding a `run.jsonl`. That file is the whole truth
// (cornerstone §3.4), so everything the console *shows* comes out of it and
// nothing else: steps, states, causes, session ids, pids, the flow itself.
//
// Two things the log does not carry, because the engine never needed them
// written down, and the driving verbs do:
//
//  - **the account.** `CLAUDE_CONFIG_DIR` selects it (C4 F0) and the log records
//    only the subject's cwd, so a run that means to be re-driven leaves a
//    `conditions.json` beside its log — the shape C8's harness already writes.
//    Absent, the run is a layer-0 one and its config dir is the engine's own
//    sandbox (`venueFor`), which is exactly right for a fake subject.
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
	/** Null for a layer-0 run: it has no account, it has a sandbox. */
	account: string | null;
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
	const conditions = readConditions(dir);
	return {
		name: dir.startsWith(`${root}/`) ? dir.slice(root.length + 1) : dir,
		dir,
		entries,
		state: fold(entries),
		venue: conditions.venue ?? venueFor(dir),
		account: conditions.account,
	};
}

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
	return load(flowPath, {
		runDir: handle.dir,
		venue: handle.venue,
		...(handle.account === null ? {} : { account: handle.account }),
	});
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
