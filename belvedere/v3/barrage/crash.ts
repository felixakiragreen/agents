// Crash injection — campaign bar 2, at fuzz scale.
//
// **The convergence oracle is the uncrashed run.** The engine is deterministic
// per seed and the driver's rulings are a function of the seed, so the same
// seed run straight through yields the terminal verdicts the cut run must
// reproduce exactly. No golden file, no hand-written expectation, no judgement
// call — the oracle is free, and it gets stronger every time the generator
// learns a new shape.
//
// The cut point is drawn from the **uncrashed run's own log**, which is what
// makes the drill honest: a point named for a step the run never reaches is a
// cut that never fires, and a drill of fifty cuts that never fired is fifty
// green runs pretending to be a proof.

import { rmSync } from "node:fs";
import { CRASH_AT } from "../engine/crash.ts";
import { readLog, type Entry } from "../engine/log.ts";
import { fold, verdicts } from "../engine/replay.ts";
import { runChild, outcomeOf } from "./child.ts";
import { judge, type Red } from "./oracle.ts";
import { stream } from "./prng.ts";

export type CrashRun = {
	seed: number;
	point: string;
	/** Did the cut actually fire? A run that finished normally proves nothing. */
	cut: boolean;
	converged: boolean;
	restartExit: number | null;
	doubleIgnited: string[];
	blessings: number;
	reds: Red[];
	uncrashed: Record<string, string>;
	restarted: Record<string, string>;
	size: number;
	wallMs: number;
};

/** The cut points a log proves are reachable: an ignition names three, a pause
 *  names one, and a card's pause names the fifth family. */
export function cutPointsFrom(entries: readonly Entry[]): string[] {
	const points: string[] = [];
	const carded = new Set<string>();
	const flow = fold(entries).flow;

	for (const e of entries) {
		if (e.kind === "ignited") points.push(`before-ignite:${e.step}`, `after-ignite:${e.step}`, `before-settle:${e.step}`);
		if (e.kind === "paused") {
			const kind = flow?.steps.find((s) => s.id === e.step)?.kind;
			if (kind === "card") { if (!carded.has(e.step)) { carded.add(e.step); points.push(`before-card:${e.step}`); } }
			else points.push(`before-pause:${e.step}`);
		}
	}
	return [...new Set(points)];
}

export const familyOf = (point: string): string => point.split(":")[0] ?? "";

/**
 * One seeded cut: run it clean, pick a point the clean run proves reachable,
 * kill the engine there, restart it on the same log, and demand the same end.
 */
export async function crashRun(seed: number, root: string, capMs: number): Promise<CrashRun> {
	const started = Date.now();
	const plainDir = `${root}/${seed}/plain`;
	const cutDir = `${root}/${seed}/cut`;
	// Both dirs start empty. A run dir that already holds a finished log is a
	// run the driver would replay as already terminal — a cut that never fires
	// and a drill that proves nothing.
	rmSync(`${root}/${seed}`, { recursive: true, force: true });

	await runChild(seed, plainDir, capMs);
	const plain = judge(plainDir, outcomeOf(plainDir));
	const points = cutPointsFrom(readLog(`${plainDir}/run.jsonl`));
	const size = plain.state.flow?.steps.length ?? 0;

	if (points.length === 0)
		return { seed, point: "", cut: false, converged: false, restartExit: null, doubleIgnited: [], blessings: 0,
			reds: [...plain.reds, { invariant: 7, name: "replay", step: "", detail: "the clean run offered no reachable cut point" }],
			uncrashed: plain.verdicts, restarted: {}, size, wallMs: Date.now() - started };

	// The family is drawn first, then a point inside it. Drawn flat, the five
	// families are not equally likely — an ignition offers three points and a
	// card offers one — so `before-card` would go almost unexercised across a
	// whole drill, which is the one family a fifty-cut proof cannot afford to
	// skip.
	const rng = stream(seed, "cut");
	const families = [...new Set(points.map(familyOf))].sort();
	const family = rng.pick(families);
	const point = rng.pick(points.filter((p) => familyOf(p) === family));
	const killed = await runChild(seed, cutDir, capMs, { [CRASH_AT]: point });
	const cut = killed.signal === "SIGKILL";

	const restart = await runChild(seed, cutDir, capMs);
	const entries = readLog(`${cutDir}/run.jsonl`);
	const after = judge(cutDir, outcomeOf(cutDir));

	const ignited = entries.filter((e) => e.kind === "ignited").map((e) => ("step" in e ? e.step : ""));
	const doubleIgnited = [...new Set(ignited.filter((id, i) => ignited.indexOf(id) !== i))];
	const blessings = entries.filter((e) => e.kind === "blessed").length;
	const restarted = verdicts(fold(entries));

	const reds: Red[] = [...plain.reds, ...after.reds];
	if (!cut) reds.push({ invariant: 7, name: "replay", step: "", detail: `the cut at ${point} never fired — exit ${killed.exit}, signal ${killed.signal}` });
	if (restart.exit !== 0) reds.push({ invariant: 7, name: "replay", step: "", detail: `the restart exited ${restart.exit} (${restart.stderr.trim().slice(0, 200)})` });
	if (doubleIgnited.length > 0) reds.push({ invariant: 1, name: "exactly-once", step: doubleIgnited[0]!, detail: `double-ignited after the cut at ${point}: ${doubleIgnited.join(", ")}` });
	if (blessings !== 1) reds.push({ invariant: 4, name: "scope", step: "", detail: `${blessings} \`blessed\` events after the cut at ${point} — a blessing is the caller's act, once` });

	const converged = Bun.deepEquals(plain.verdicts, restarted);
	if (!converged) reds.push({ invariant: 7, name: "replay", step: "", detail: `the restart did not converge on the uncrashed run: ${diff(plain.verdicts, restarted)}` });

	return { seed, point, cut, converged, restartExit: restart.exit, doubleIgnited, blessings, reds,
		uncrashed: plain.verdicts, restarted, size, wallMs: Date.now() - started };
}

const diff = (a: Record<string, string>, b: Record<string, string>): string =>
	[...new Set([...Object.keys(a), ...Object.keys(b)])]
		.filter((k) => a[k] !== b[k])
		.map((k) => `${k}: ${a[k] ?? "—"} ≠ ${b[k] ?? "—"}`)
		.join("; ");
