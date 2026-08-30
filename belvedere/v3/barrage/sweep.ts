// The subject sweep — a drill that ends early leaves no live fakes (C10 F4:
// 22 orphans, one to five hours old, from mutant runs).
//
// **The run log is the register.** The engine records every subject's pid on
// `ignited` and `resumed`, so nothing here has to remember what it spawned — it
// reads what the run said it spawned, which is the only account that survives a
// SIGKILLed child. That matters exactly where the leak is: a run whose driver
// was killed never got to tidy up, and its own log is all that is left of it.
//
// **A pid is killed only after `ps` says it is still ours.** Pids are reused,
// and a drill that SIGTERMs a number it read off an hour-old log is a drill that
// kills somebody's editor. The command line must still name the fake's cli.
//
// This is the mutation check's, not the crash drill's: the crash drill *needs*
// its orphans alive between the cut and the restart — adopting one is the thing
// it proves (C6 F2). So the sweep runs where nothing will be restarted: after a
// mutant's pair of runs, and at the drill's own exit, however it exits.

import { existsSync, readdirSync, statSync } from "node:fs";
import { readLog } from "../engine/log.ts";

/** What a swept process must still be, for the sweep to be sure it is ours. */
const FAKE_CLI = "fake-claude/cli.ts";

/** Every subject pid every run log under `root` ever named. */
export function subjectPids(root: string): number[] {
	const pids = new Set<number>();
	for (const dir of runDirs(root))
		for (const e of readLog(`${dir}/run.jsonl`))
			if (e.kind === "ignited" || e.kind === "resumed") pids.add(e.pid);
	return [...pids];
}

/** Of those, the ones the kernel still knows AND still shows as the fake. One
 *  `ps` for the lot: this runs from an exit handler, where nothing may await. */
export function liveFakes(pids: readonly number[]): number[] {
	if (pids.length === 0) return [];
	const ps = Bun.spawnSync(["ps", "-o", "pid=,command=", "-p", pids.join(",")]);
	const live: number[] = [];
	for (const line of new TextDecoder().decode(ps.stdout).split("\n")) {
		const m = /^\s*(\d+)\s+(.*)$/.exec(line);
		if (m !== null && m[2]!.includes(FAKE_CLI)) live.push(Number(m[1]));
	}
	return live;
}

/** SIGTERM every fake still standing under `root`, and say which. */
export function sweep(root: string): number[] {
	const killed: number[] = [];
	for (const pid of liveFakes(subjectPids(root))) {
		try { process.kill(pid, "SIGTERM"); killed.push(pid); }
		catch { /* it went on its own between the ps and the signal */ }
	}
	return killed;
}

/** Every dir under `root` holding a run log. Shallow-stops at one: a run dir
 *  never contains another. */
function runDirs(root: string): string[] {
	if (!existsSync(root)) return [];
	const found: string[] = [];
	const walk = (dir: string): void => {
		if (existsSync(`${dir}/run.jsonl`)) { found.push(dir); return; }
		for (const name of readdirSync(dir)) {
			const path = `${dir}/${name}`;
			try { if (statSync(path).isDirectory()) walk(path); }
			catch { /* a run dir the drill deleted mid-walk is not ours to mourn */ }
		}
	};
	walk(root);
	return found;
}
