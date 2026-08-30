// The transcript reader — the truth that does not die with its reader.
//
// The stream is the parent's view; when the engine that held it is gone, the
// file on disk is all there is (grammar §6, C4 F7). This module re-derives one
// turn's outcome from that file alone: what the subject did, whether anything
// was refused, and — the load-bearing one — whether the turn ever finished.
//
// **The cursor.** The transcript is one file per *session* with no turn index in
// it, so a reader that starts at byte 0 answers for whichever turn last wrote to
// it — on a resumed step, the turn BEFORE the one being asked about (C7 F3).
// Every read therefore carries a cursor: the file's row count as the engine
// found it at spawn, recorded in the `ignited`/`resumed` event, never computed
// from turn indices. Arithmetic over turns breaks the moment a summoned terminal
// adds hand turns the engine never fired (D20's fallback is law, C4 F8 measured
// the round trip); a recorded row count does not care who wrote what before it.
//
// **The completion signal.** A turn ends when the assistant stops asking for
// tools — with one exception the engine creates itself. It declares
// `--json-schema` on every step (`argvFor`), so the step report comes back as a
// `StructuredOutput` **tool call**, and its `tool_result` is the turn's last
// conversation row. A rule that reads a trailing tool result as died-mid-work
// therefore calls every turn this engine fires dead: 48/48 landed turns across
// three accounts, with C4-born captures (no schema declared) green under the
// same reader on the same day (C8 F3, K1).
//
// So a turn is complete iff its last conversation row is either an `assistant`
// row carrying no `tool_use`, or the `tool_result` **answering this turn's
// `StructuredOutput` tool call** — matched by `toolUseId`, never by position.
// Any other trailing tool call is still work in flight. Measured on C4's own
// captures: q6-SIGKILL's cut turn ends at a `user`/`tool_result` row,
// q6-PARENT's orphan and q1-write's denial both end at an `assistant` text row;
// and on C8's, where `real-c8-q1-smoke` closes on the pair.
//
// **The report is on disk.** That tool call's *input* is the step report. The
// stream is no longer the only carrier, so a turn the engine died in front of
// can be seen to have worked **and be landed** — cornerstone law 5's redundancy
// claim, stronger than C6 could prove it (C13).

import { existsSync, readFileSync } from "node:fs";
import { parseReport, type Report, type Verdict } from "./sense.ts";

/** Grammar §2: every non-alphanumeric in the cwd becomes a dash. */
export const slugFor = (cwd: string): string => cwd.replace(/[^a-zA-Z0-9]/g, "-");

export const transcriptPath = (configDir: string, cwd: string, sessionId: string): string =>
	`${configDir}/projects/${slugFor(cwd)}/${sessionId}.jsonl`;

/** What one turn on disk says happened. `dead` is the turn that never closed. */
export type TranscriptVerdict = "worked" | "denied" | "dead";

/** Everything past the cursor — the slice, never the file. */
export type TranscriptReading = {
	/** User turns in the slice. Diagnostic only: a real arm-B turn carries its
	 *  content as an array and is not counted (C11 F3), which is precisely why
	 *  nothing addresses a turn by counting. */
	turns: number;
	rows: number;
	/** Rows the reader could not parse. Whole-line appends make this 0 (C4 F7). */
	torn: number;
	complete: boolean;
	denied: boolean;
	/** The last assistant text of the last turn — prose, never the step report. */
	text: string;
	/** The step report, read out of the closing `StructuredOutput` call's input.
	 *  Null when the turn closed without one, or when the input is not a report. */
	report: Report | null;
	verdict: TranscriptVerdict;
};

const EMPTY: TranscriptReading = {
	turns: 0, rows: 0, torn: 0, complete: false, denied: false, text: "", report: null, verdict: "dead",
};

/** The tool the engine's `--json-schema` turns the step report into (C8 F3). */
const REPORT_TOOL = "StructuredOutput";

/**
 * The cursor the engine records at spawn: how many rows the file already holds.
 * Counted the same way `readTranscriptText` counts them — non-empty lines,
 * parsed or not — so the two always address the same boundary.
 */
export function transcriptRows(path: string): number {
	if (!existsSync(path)) return 0;
	let rows = 0;
	for (const line of readFileSync(path, "utf8").split("\n")) if (line !== "") rows++;
	return rows;
}

/** `cursor` rows are skipped: the turn asked about is what came after them. An
 *  empty slice is a turn that never reached disk, which is `dead`. */
export function readTranscript(path: string, cursor: number): TranscriptReading {
	if (!existsSync(path)) return { ...EMPTY };
	return readTranscriptText(readFileSync(path, "utf8"), cursor);
}

export function readTranscriptText(text: string, cursor: number): TranscriptReading {
	const reading: TranscriptReading = { ...EMPTY };
	let turn: Record<string, unknown>[] = [];
	let skipped = 0;

	for (const line of text.split("\n")) {
		if (line === "") continue;
		if (skipped < cursor) { skipped++; continue; }
		reading.rows++;
		let row: Record<string, unknown>;
		try {
			const parsed: unknown = JSON.parse(line);
			if (typeof parsed !== "object" || parsed === null) { reading.torn++; continue; }
			row = parsed as Record<string, unknown>;
		} catch { reading.torn++; continue; }

		if (row.type !== "user" && row.type !== "assistant") continue;
		// A user row whose content is a string is a turn the engine sent; one
		// whose content is an array is a tool result echoed back inside a turn.
		if (row.type === "user" && typeof content(row) === "string") { reading.turns++; turn = [row]; continue; }
		turn.push(row);
	}

	const last = turn.at(-1);
	const closingReport = last === undefined ? null : reportAnswered(turn, last);
	reading.report = closingReport === null ? null : parseReport(closingReport.input);
	reading.complete = closingReport !== null
		|| (last?.type === "assistant" && !blocks(last).some((b) => b.type === "tool_use"));
	// The stream names a denial outright; on disk it is an errored tool result,
	// and a real transcript adds `toolDenialKind` (C4's q1-write row). Neither
	// separates a refusal from a tool that simply failed — the precise signal is
	// `result.permission_denials[]`, and this path is the fallback, not the sensor.
	reading.denied = turn.some((row) =>
		(typeof row.toolDenialKind === "string" && row.toolDenialKind !== "") ||
		blocks(row).some((b) => b.type === "tool_result" && b.is_error === true));
	reading.text = [...turn].reverse().flatMap((row) =>
		row.type === "assistant" ? blocks(row).filter((b) => b.type === "text").map((b) => String(b.text ?? "")) : [],
	)[0] ?? "";

	reading.verdict = !reading.complete ? "dead" : reading.denied ? "denied" : "worked";
	return reading;
}

/**
 * The turn's `StructuredOutput` call, if `last` is the `tool_result` that
 * answers it. The linkage is the id: a turn can hold several tool calls and the
 * report's need not be the one before it, so position proves nothing.
 */
function reportAnswered(
	turn: readonly Record<string, unknown>[], last: Record<string, unknown>,
): Record<string, unknown> | null {
	if (last.type !== "user") return null;
	const answered = new Set(blocks(last).flatMap((b) =>
		b.type === "tool_result" && typeof b.tool_use_id === "string" ? [b.tool_use_id] : []));
	if (answered.size === 0) return null;
	for (const row of turn)
		for (const b of blocks(row))
			if (b.type === "tool_use" && b.name === REPORT_TOOL && typeof b.id === "string" && answered.has(b.id))
				return b;
	return null;
}

const content = (row: Record<string, unknown>): unknown =>
	(row.message as Record<string, unknown> | undefined)?.content;

function blocks(row: Record<string, unknown>): Record<string, unknown>[] {
	const c = content(row);
	return Array.isArray(c) ? (c as Record<string, unknown>[]) : [];
}

/**
 * The transcript-only verdict (law 5). Still poorer than the stream's — the
 * granted posture is `init`'s to say and is never written to disk — but no
 * longer poorer about the *outcome*: the report rides the closing
 * `StructuredOutput` call, so a turn the engine died in front of lands from
 * disk alone when the disk is explicit about all four things: the turn closed,
 * the report parses, it says `done`, and nothing in the turn was refused.
 *
 * Everywhere short of that it pauses — but it pauses in the **stream's own
 * words**: a report that parses names its state's cause exactly as `verdict()`
 * would (`sense.ts` is the authority; one vocabulary, two sources), so the same
 * turn read from disk and from the stream shows the same cause on a board row.
 * Collapsing both weaker states to ‹no report› was C13's literal reading of "as
 * today" and it made the poorer name a lie — the disk plainly carries the
 * question (C13 F3, ruled onto C10's lay). ‹no report› now means what it says:
 * the turn closed carrying no parseable report at all.
 *
 * A turn carrying a failed tool result still pauses ‹needs-⬡ permission› over
 * any report at all (C11 F2: this path cannot tell a refusal from a tool that
 * merely failed, and must not start guessing).
 */
export function verdictFromTranscript(t: TranscriptReading): Verdict {
	if (t.verdict === "dead")
		return { land: false, causes: ["dead"], detail: t.rows === 0
			? "re-derived from the transcript: nothing past the spawn cursor — the turn never reached disk"
			: `re-derived from the transcript: ${t.rows} rows past the spawn cursor, the turn never closed` };
	if (t.verdict === "denied")
		return { land: false, causes: ["needs-⬡ permission"], detail: "re-derived from the transcript: a tool result in the last turn carries is_error" };
	if (t.report === null)
		return { land: false, causes: ["no report"], detail: "re-derived from the transcript: the turn completed and closed on no step report" };
	if (t.report.state === "done") return { land: true, report: t.report };
	return {
		land: false,
		causes: [t.report.state === "needs_input" ? "needs-⬡ question" : "blocked"],
		detail: `re-derived from the transcript: ${t.report.cause}`,
	};
}
