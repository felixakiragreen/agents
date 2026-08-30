// Spawning one run.
//
// The wall cap is enforced from out here, not in the driver: a run that wedges
// somewhere the driver's own loop never reaches still has to die, and be a red
// rather than a hang. `bun barrage/run.ts` finishing is the automation law's
// whole point (cornerstone §6) — an agent runs it unattended, over and over.

import { existsSync, readFileSync } from "node:fs";
import type { Outcome } from "./driver.ts";
import { outcomePathIn } from "./driver.ts";

const ONE = new URL("one.ts", import.meta.url).pathname;

export type Ran = {
	exit: number | null;
	signal: string | null;
	stderr: string;
	/** True when the parent's cap killed it — always a red. */
	capped: boolean;
};

/** How much longer than the driver's own cap the parent waits before killing. */
const GRACE_MS = 15_000;

export async function runChild(seed: number, runDir: string, capMs: number, env: Record<string, string> = {}): Promise<Ran> {
	const proc = Bun.spawn([process.execPath, ONE, "--seed", String(seed), "--run", runDir, "--cap", String(capMs)], {
		env: { ...process.env, ...env },
		stdout: "ignore", stderr: "pipe",
	});
	let capped = false;
	const timer = setTimeout(() => { capped = true; proc.kill("SIGKILL"); }, capMs + GRACE_MS);
	const [stderr, exit] = await Promise.all([new Response(proc.stderr).text(), proc.exited]);
	clearTimeout(timer);
	return { exit, signal: proc.signalCode, stderr, capped };
}

/** The driver's own report, when it lived long enough to write one. */
export function outcomeOf(runDir: string): Outcome | null {
	const path = outcomePathIn(runDir);
	if (!existsSync(path)) return null;
	return JSON.parse(readFileSync(path, "utf8")) as Outcome;
}
