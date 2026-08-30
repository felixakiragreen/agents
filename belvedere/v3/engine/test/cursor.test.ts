// C11 — the turn cursor. Bar 1 stages the defect end to end; bar 2 slices real
// bytes with it.
//
// The transcript is one file per *session* with no turn index in it, so a
// reader that starts at byte 0 answers for whichever turn last wrote to it. On
// a resumed step whose stream is torn that is the turn BEFORE the one being
// asked about (C7 F3), and the engine re-derives the wrong outcome: the dead
// resume below reads back from disk as `worked`.
//
// The fix is a cursor **recorded at spawn** — the transcript's row count as the
// engine found it — so re-derivation reads only what came after. This test is
// the defect, staged end to end: turn 0 works and closes, the resume dies at
// the fake's door writing nothing, and the engine is SIGKILLed in between so
// the restart has none of its own memory to fall back on.
import { test, expect } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { readLog } from "../log.ts";
import { readTranscript, readTranscriptText, transcriptPath, transcriptRows, verdictFromTranscript, type TranscriptVerdict } from "../transcript.ts";
import { HERE, reopen, SCRATCH } from "./harness.ts";

const DRIVER = `${HERE}/test/resume-door.ts`;
const FIXTURES = `${HERE}/test/fixtures`;

/** One step, one act. `echo` works and reports nothing, so turn 0 pauses ‹no
 *  report› with a closed transcript — a resume past it is the door death. */
const FLOW = {
	id: "cursor-door", name: "the door death on a resumed step", budget: 2,
	steps: [{
		id: "t", kind: "task", depends: [], model: "sonnet", effort: "low", posture: "auto",
		timeout_ms: 5_000, subject: { fake: { scenario: "echo", seed: 5 } },
	}],
};

test("bar 1 — a resume that dies at the door re-derives as dead, not as the turn before it", async () => {
	const name = "cursor-door";
	const runDir = `${SCRATCH}/${name}`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	const flowPath = `${SCRATCH}/${name}.json`;
	writeFileSync(flowPath, JSON.stringify(FLOW));

	// The cut: turn 0 to its pause, then a resume recorded and the engine killed.
	const child = Bun.spawn([process.execPath, DRIVER, flowPath, runDir, "t"], { stdout: "pipe", stderr: "pipe" });
	const [, err] = await Promise.all([
		new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
	]);
	expect([err, child.signalCode]).toEqual([err, "SIGKILL"]);

	// The disk at the cut: the resume's stream file is empty — the subject died
	// at the door — and the transcript still ends on turn 0, which closed.
	const entries = readLog(`${runDir}/run.jsonl`);
	const resumed = entries.find((e) => e.kind === "resumed");
	expect(resumed?.kind).toBe("resumed");
	expect(readFileSync(`${runDir}/streams/t.t1.jsonl`, "utf8")).toBe("");
	const sessionId = resumed?.kind === "resumed" ? resumed.sessionId : "";
	expect(readTranscript(transcriptPath(`${runDir}/config`, `${runDir}/work`, sessionId), 0).verdict).toBe("worked");

	// The restart answers for the turn the engine fired, and that turn is dead.
	const state = await reopen(name, flowPath).run();
	const t = state.steps.t;
	expect(t?.at).toBe("paused");
	if (t?.at === "paused") expect(t.causes).toEqual(["dead"]);
}, 60_000);

// ---------------------------------------------------------------------------
// C13 bar 3 — the regression signal C8 F3 took with it, restored.
//
// C8 proved the cursor *slices* correctly on real bytes, and no more: every
// engine turn read `dead` from row 0 anyway, so a sabotaged cursor and a true
// one agreed by accident and nothing could have caught a reader that went back
// to reading from row 0 (C8 F7's caveat). With the completion rule trued, a
// landed prior turn and a torn resumed one differ again — and the wrong answer
// is now a **landing**, which is worse than what C7 F3 first showed.

/** The same flow shape as bar 1, but the turn before the door death **reports**:
 *  the case F3 masked, because only a reporting turn's transcript looked
 *  different from a dead one's. */
const REPORT_FLOW = {
	id: "cursor-report", name: "the door death after a turn that reported", budget: 2,
	steps: [{
		id: "t", kind: "task", depends: [], model: "sonnet", effort: "low", posture: "auto",
		timeout_ms: 5_000, subject: { fake: { scenario: "schema-needs-input", seed: 5 } },
	}],
};

test("bar 3 — a sabotaged cursor answers for the reporting turn before it", async () => {
	const name = "cursor-report";
	const runDir = `${SCRATCH}/${name}`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	const flowPath = `${SCRATCH}/${name}.json`;
	writeFileSync(flowPath, JSON.stringify(REPORT_FLOW));

	const child = Bun.spawn([process.execPath, DRIVER, flowPath, runDir, "t"], { stdout: "pipe", stderr: "pipe" });
	const [, err] = await Promise.all([
		new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
	]);
	expect([err, child.signalCode]).toEqual([err, "SIGKILL"]);

	// Turn 0 closed on its report; the resume died at the door writing nothing.
	const logPath = `${runDir}/run.jsonl`;
	const atCut = readFileSync(logPath, "utf8");
	const resumed = readLog(logPath).find((e) => e.kind === "resumed");
	if (resumed?.kind !== "resumed") throw new Error("the driver never resumed the step");
	expect(readFileSync(`${runDir}/streams/t.t1.jsonl`, "utf8")).toBe("");

	// The recorded cursor answers for the turn the engine fired: it never reached
	// disk, so it is dead. This is the assertion a stale cursor breaks, whether
	// the engine stopped recording one or the log's own value was tampered with.
	const truth = await reopen(name, flowPath).run();
	expect(truth.steps.t?.at === "paused" ? truth.steps.t.causes : null).toEqual(["dead"]);
	expect(resumed.cursor).toBeGreaterThan(0);

	// The same disk, the cursor sabotaged to 0 — the read a pre-C11 engine made.
	writeFileSync(logPath, atCut.split(`"cursor":${resumed.cursor}`).join(`"cursor":0`));
	const stale = await reopen(name, flowPath).run();
	const causes = stale.steps.t?.at === "paused" ? stale.steps.t.causes : null;
	expect(causes).not.toEqual(["dead"]);
	expect(causes).toEqual(["no report"]);
	// Pre-C13 this assertion could not have been written: the prior turn's
	// `StructuredOutput` pair read as died-mid-work, so the stale cursor answered
	// ‹dead› as well and the sabotage was invisible.
}, 60_000);

// ---------------------------------------------------------------------------
// Bar 2 — the cursor on real bytes, zero spend.
//
// Two C4 sessions survive as multi-turn transcripts (provenance in
// fixtures/PROVENANCE.md). Between them they carry every row shape the fake
// never emits — `attachment`, `atis-latch`, `queue-operation`, `mode`,
// `permission-mode`, `bridge-session`, `file-history-snapshot`, `cost-state`,
// and assistant `thinking` blocks — and the reader must step over all of them
// while counting, or the cursor addresses the wrong row.
//
// Each turn is read the way the engine reads it: on the file **as it stood when
// that turn was the newest thing in it**, from the cursor its spawn recorded.

/** One turn of a real session: the rows it spans, and what it is known to be. */
type Known = { from: number; to: number; prompt: string; reply: string; verdict: TranscriptVerdict };

/** q2-a-personal: one ignition and three `--resume` turns, the C4 probe that
 *  injected TURN1/TURN2/TURN3 verbatim (the four `q2-a-personal-t<n>` captures). */
const Q2A: Known[] = [
	{ from: 2, to: 18, prompt: "You are a byte-echo probe.", reply: "I'm not going to do that.", verdict: "worked" },
	{ from: 18, to: 26, prompt: "TURN1 alpha", reply: "What are you testing here?", verdict: "worked" },
	{ from: 26, to: 33, prompt: "TURN2 alpha", reply: "Still unclear what you want.", verdict: "worked" },
	{ from: 33, to: 38, prompt: "TURN3 alpha", reply: "I can't work with this.", verdict: "worked" },
];

/** q5b summon-venue: headless, then a **hand turn typed in a summoned pane**,
 *  then headless again on the same session (C4 F8, D20's fallback). The engine
 *  fired two of these three turns. */
const Q5B: Known[] = [
	// Turn 0 reaches for two MCP tools that do not exist headless and gets
	// `is_error` tool results back. The transcript cannot tell a refusal from a
	// tool that simply failed — `permission_denials[]` is the sensor and this is
	// the fallback (transcript.ts) — so it reads ‹denied›. Real bytes confirming
	// a documented limit, filed as C11 F2.
	{ from: 2, to: 22, prompt: "Remember this codeword: HEADLESS-ALPHA-7", reply: "stored", verdict: "denied" },
	{ from: 22, to: 37, prompt: "What was the codeword? Also remember TERMINAL-BRAVO-9", reply: "HEADLESS-ALPHA-7, stored TERMINAL-BRAVO-9.", verdict: "worked" },
	{ from: 37, to: 44, prompt: "List both codewords", reply: "HEADLESS-ALPHA-7, TERMINAL-BRAVO-9", verdict: "worked" },
];

const rowsOf = (path: string): string[] => readFileSync(path, "utf8").split("\n").filter((l) => l !== "");

/** The file as it stood after `to` rows — what the engine's reader would see
 *  while the turn ending there was the last one written. */
const asAt = (path: string, to: number): string => rowsOf(path).slice(0, to).join("\n") + "\n";

/** The first user turn's own text past a cursor — the prompt half of "matches
 *  its known contents", which the reading itself does not carry. */
function promptPast(path: string, cursor: number): string {
	for (const line of rowsOf(path).slice(cursor)) {
		const row = JSON.parse(line) as { type?: string; message?: { content?: unknown } };
		if (row.type === "user" && typeof row.message?.content === "string") return row.message.content;
	}
	return "";
}

for (const [name, turns, rows] of [
	["real-q2-a-resume.jsonl", Q2A, 38],
	["real-q5b-summon.jsonl", Q5B, 44],
] as const) {
	test(`bar 2 — ${name}: every turn slices to its own known contents`, () => {
		const path = `${FIXTURES}/${name}`;
		expect(transcriptRows(path)).toBe(rows);

		for (const [i, known] of turns.entries()) {
			const slice = readTranscriptText(asAt(path, known.to), known.from);
			expect([name, i, slice.torn]).toEqual([name, i, 0]);
			expect([name, i, slice.turns]).toEqual([name, i, 1]);
			expect([name, i, slice.complete]).toEqual([name, i, true]);
			expect([name, i, slice.denied]).toEqual([name, i, known.verdict === "denied"]);
			expect([name, i, slice.verdict]).toEqual([name, i, known.verdict]);
			expect([name, i, promptPast(path, known.from).slice(0, known.prompt.length)])
				.toEqual([name, i, known.prompt]);
			expect([name, i, slice.text.slice(0, known.reply.length)]).toEqual([name, i, known.reply]);
		}

		// The door death on real bytes: a turn that wrote nothing leaves an empty
		// slice, and an empty slice is dead — never the turn before it.
		const past = readTranscript(path, rows);
		expect([name, past.rows, past.verdict]).toEqual([name, 0, "dead"]);
	});
}

test("bar 3 — on real engine bytes the sabotaged cursor lands the wrong turn", () => {
	const path = `${FIXTURES}/real-c8-q1-smoke.jsonl`;
	const rows = transcriptRows(path);
	expect(rows).toBe(14);

	// The cursor a resume would record here is the whole file. The turn fired
	// next dies at the door and writes nothing, so the slice is empty: dead, and
	// that is the truth.
	const answered = readTranscript(path, rows);
	expect([answered.rows, answered.verdict]).toEqual([0, "dead"]);
	expect(verdictFromTranscript(answered).land).toBe(false);

	// Sabotage the cursor to 0 and the reader answers for the turn before —
	// which on real engine bytes is one that **landed**, report and all.
	const stale = readTranscript(path, 0);
	expect([stale.complete, stale.denied]).toEqual([true, false]);
	expect(verdictFromTranscript(stale)).toEqual({ land: true, report: { state: "done", cause: "n/a" } });

	// C8 F7's caveat, closed: before the completion rule was trued, this same
	// row-0 read answered `dead` too, so the two agreed by accident and no real
	// transcript this engine ever wrote could show a stale cursor at all.
});

test("bar 2 — a hand turn is why the cursor is recorded and never computed", () => {
	const path = `${FIXTURES}/real-q5b-summon.jsonl`;
	const pane = Q5B[1]!;
	// The file as the engine found it when it spawned its second headless turn:
	// its own first turn, then a whole turn typed in a summoned pane. Exactly
	// where the pane stopped writing its bookkeeping rows is not knowable, so
	// every cursor past the pane's last conversation row is asserted.
	for (let cursor = pane.to - 10; cursor <= pane.to; cursor++) {
		const asSpawned = asAt(path, pane.to);
		// The turn now fired dies at the door and writes nothing. The recorded
		// cursor is the whole file, so there is nothing past it: dead.
		expect([cursor, readTranscriptText(asSpawned, cursor).verdict]).toEqual([cursor, "dead"]);
	}
	// The same question answered by counting the turns the engine sent — one, so
	// "mine is the second user row" — lands on the pane's turn and calls it a
	// working one. The pane's turns are not the engine's, and arithmetic cannot
	// tell them apart.
	const byArithmetic = readTranscriptText(asAt(path, pane.to), pane.from);
	expect(byArithmetic.verdict).toBe("worked");
	expect(byArithmetic.text).toBe(pane.reply);
});
