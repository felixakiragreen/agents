// C16's fixtures: two run trees the Chat can open, both deterministic, neither costing a turn.
//
// The Chat's second door is a run log (`glass/steps.ts`), so a fixture for it is a **run**, not a
// transcript file dropped somewhere. Two are minted here because one scenario cannot be both things
// this charge has to show:
//
//  1. `paused()` — the engine, really run, on the committed `answer-then-land` scenario at layer 0.
//     It gives a genuine ‹needs-⬡ question› pause with a genuine session, transcript and log, and
//     the reply arc lands on it. **Nothing here is hand-written**: the engine wrote every byte.
//  2. `rich()` — a **committed real capture** (`rich.jsonl`, one real subject's turn from C16's own
//     round trip) mounted as a run. The fake cannot write markdown, a table or a fence — no scenario
//     does, and adding one is a `v3/**` write this charge's fence forbids — so the rendering fixture
//     is the other thing the charge names: a real capture. The log around it is written by the
//     **engine's own writer** (`openLog`), so it is grammar the reader trusts rather than a JSON
//     blob a Builder typed.
//
// Both live under `$TMPDIR` and are pointed at with `$RUNS_DIR`. A probe sets that before the twin
// boots (the camera passes `process.env` through, `camera/twin.ts:132`); a test sets it around the
// call. Nothing here touches the real telemetry tree.

import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { load, venueFor } from "../../v3/engine/engine.ts";
import { openLog } from "../../v3/engine/log.ts";
import { isRefusal } from "../../v3/engine/refusal.ts";
import { parseFlow } from "../../v3/engine/flow.ts";
import { transcriptPath } from "../../v3/engine/transcript.ts";

export type Minted = {
	/** The telemetry root — what `$RUNS_DIR` is pointed at. */
	root: string;
	dir: string;
	/** How the run is addressed under the root, and how the deck names it. */
	name: string;
	step: string;
	sessionId: string;
	transcript: string;
	close(): void;
};

/**
 * A run root at a **canonical** path, and the `realpathSync` is load-bearing (findings F1).
 *
 * The engine names a subject's transcript `transcriptPath(configDir, venue.workDir, sid)`, while the
 * subject itself names it from `process.cwd()` — which is the resolved path. On macOS `$TMPDIR` is
 * `/var/folders/…`, a symlink to `/private/var/folders/…`, so an uncanonical venue makes those two
 * spellings differ by one slug and the transcript the log points at does not exist. Every fixture
 * here is minted under the resolved root, so a venue path means one thing.
 */
const scratch = (): string => mkdtempSync(join(realpathSync(tmpdir()), "belvedere-c16-"));

/** The session id the log's own first ignition names — the only place it is recorded. */
const ignitedIn = (dir: string): string => {
	for (const line of readFileSync(`${dir}/run.jsonl`, "utf8").split("\n")) {
		if (line === "") continue;
		const e = JSON.parse(line) as { kind: string; sessionId?: string };
		if (e.kind === "ignited" && typeof e.sessionId === "string") return e.sessionId;
	}
	throw new Error(`${dir}/run.jsonl carries no ignition`);
};

/**
 * A layer-0 run, really run to its pause. `answer-then-land` act 0 reports `needs_input` and the
 * engine pauses ‹needs-⬡ question› carrying the question; act 1 is the turn a reply fires.
 */
export async function paused(name = "c16/paused", root: string = scratch()): Promise<Minted> {
	const dir = join(root, name);
	mkdirSync(dir, { recursive: true });
	writeFileSync(`${dir}/flow.json`, JSON.stringify({
		id: "c16fixture", name: "a paused step, and the reply that lands it", budget: 3,
		steps: [{
			id: "ask", kind: "task", depends: [], prompt: "Ask for the release name.", timeout_ms: 20_000,
			subject: { fake: { scenario: "answer-then-land", seed: 3 } },
			model: "sonnet", effort: "low", posture: "acceptEdits",
		}],
	}, null, 2) + "\n");

	const run = load(`${dir}/flow.json`, { runDir: dir });
	if (isRefusal(run)) throw new Error(run.refusal);
	const blessed = run.bless();
	if (isRefusal(blessed)) throw new Error(blessed.refusal);
	await run.run();

	const sessionId = ignitedIn(dir);
	const venue = venueFor(dir);
	return {
		root, dir, name, step: "ask", sessionId,
		transcript: transcriptPath(venue.configDir, venue.workDir, sessionId),
		close: () => rmSync(root, { recursive: true, force: true }),
	};
}

export const CAPTURE = new URL("./rich.jsonl", import.meta.url).pathname;

/**
 * The committed capture, mounted as a run the Chat can open.
 *
 * The log is minted with the engine's own writer and says exactly what happened: this run was
 * blessed on a one-step flow and that step ignited on the capture's own session. The transcript is
 * the capture, copied byte for byte to the path the log names — so the Chat finds it the way it
 * finds every other engine-born session, through `transcriptPath`, with no knob invented for it.
 */
export function rich(name = "c16/rich", root: string = scratch(), capture: string = CAPTURE): Minted {
	const dir = join(root, name);
	const venue = venueFor(dir);
	mkdirSync(venue.workDir, { recursive: true });

	// The capture's own session id, off its own rows: the transcript is the fact, and a fixture that
	// named a different session would be a run log pointing at a file that is not its session's.
	const first = readFileSync(capture, "utf8").split("\n").find(l => l !== "") ?? "";
	const sessionId = (JSON.parse(first) as { sessionId?: unknown }).sessionId;
	if (typeof sessionId !== "string") throw new Error(`${capture}: the first row names no sessionId`);

	const flowPath = `${dir}/flow.json`;
	writeFileSync(flowPath, JSON.stringify({
		id: "c16capture", name: "a real capture, mounted as a run", budget: 2,
		steps: [{
			id: "render", kind: "task", depends: [], prompt: "The capture's own first turn.",
			timeout_ms: 120_000, subject: { real: {} }, model: "sonnet", effort: "low", posture: "auto",
		}],
	}, null, 2) + "\n");
	// The log's blessed flow must be what `load()` will parse out of the file beside it, or the
	// engine rightly refuses to reopen the run (invariant 8) — so it is parsed, never re-typed.
	const flow = parseFlow(readFileSync(flowPath, "utf8"), flowPath);
	if (isRefusal(flow)) throw new Error(flow.refusal);

	const transcript = transcriptPath(venue.configDir, venue.workDir, sessionId);
	mkdirSync(dirname(transcript), { recursive: true });
	copyFileSync(capture, transcript);

	const log = openLog(`${dir}/run.jsonl`);
	log.append({ kind: "blessed", flow, scope: ["render"], budget: 2 });
	log.append({
		kind: "ignited", step: "render", sessionId, pid: process.pid,
		venue: venue.workDir, configDir: venue.configDir, cursor: 0,
		model: "sonnet", effort: "low", posture: "auto", subject: "real",
	});
	log.append({ kind: "paused", step: "render", causes: ["needs-⬡ question"], detail: "Does the rendering read the way you want it to?" });

	return { root, dir, name, step: "render", sessionId, transcript, close: () => rmSync(root, { recursive: true, force: true }) };
}
