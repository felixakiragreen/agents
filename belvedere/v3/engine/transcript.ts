// The transcript reader — the truth that does not die with its reader.
//
// The stream is the parent's view; when the engine that held it is gone, the
// file on disk is all there is (grammar §6, C4 F7). This module re-derives one
// turn's outcome from that file alone: what the subject did, whether anything
// was refused, and — the load-bearing one — whether the turn ever finished.
//
// **The completion signal.** A turn ends when the assistant stops asking for
// tools. So a turn is complete iff its last conversation row is an `assistant`
// row carrying no `tool_use` block; if the last row is a tool result, or an
// assistant row still holding a `tool_use`, work was in flight when the writing
// stopped. Measured on C4's own captures: q6-SIGKILL's cut turn ends at a
// `user`/`tool_result` row, q6-PARENT's orphan and q1-write's denial both end at
// an `assistant` text row.

import { existsSync, readFileSync } from "node:fs";
import type { Verdict } from "./sense.ts";

/** Grammar §2: every non-alphanumeric in the cwd becomes a dash. */
export const slugFor = (cwd: string): string => cwd.replace(/[^a-zA-Z0-9]/g, "-");

export const transcriptPath = (configDir: string, cwd: string, sessionId: string): string =>
	`${configDir}/projects/${slugFor(cwd)}/${sessionId}.jsonl`;

/** What one turn on disk says happened. `dead` is the turn that never closed. */
export type TranscriptVerdict = "worked" | "denied" | "dead";

export type TranscriptReading = {
	/** User turns in the file — the resume cursor's act index (grammar §3). */
	turns: number;
	rows: number;
	/** Rows the reader could not parse. Whole-line appends make this 0 (C4 F7). */
	torn: number;
	complete: boolean;
	denied: boolean;
	/** The last assistant text of the last turn — prose, never the step report. */
	text: string;
	verdict: TranscriptVerdict;
};

const EMPTY: TranscriptReading = {
	turns: 0, rows: 0, torn: 0, complete: false, denied: false, text: "", verdict: "dead",
};

export function readTranscript(path: string): TranscriptReading {
	if (!existsSync(path)) return { ...EMPTY };
	return readTranscriptText(readFileSync(path, "utf8"));
}

export function readTranscriptText(text: string): TranscriptReading {
	const reading: TranscriptReading = { ...EMPTY };
	let turn: Record<string, unknown>[] = [];

	for (const line of text.split("\n")) {
		if (line === "") continue;
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
	reading.complete = last?.type === "assistant" && !blocks(last).some((b) => b.type === "tool_use");
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

const content = (row: Record<string, unknown>): unknown =>
	(row.message as Record<string, unknown> | undefined)?.content;

function blocks(row: Record<string, unknown>): Record<string, unknown>[] {
	const c = content(row);
	return Array.isArray(c) ? (c as Record<string, unknown>[]) : [];
}

/**
 * The transcript-only verdict (law 5). It is deliberately poorer than the
 * stream's: the step report and the granted posture ride the stream and are
 * never written to disk — `structured_output` is a `result` field and the last
 * assistant row is prose (captures/q3-schema-done). So a turn the engine died
 * in front of can be seen to have worked, and still cannot be landed.
 */
export function verdictFromTranscript(t: TranscriptReading): Verdict {
	if (t.verdict === "dead")
		return { land: false, causes: ["dead"], detail: `re-derived from the transcript: ${t.rows} rows, the last turn never closed` };
	if (t.verdict === "denied")
		return { land: false, causes: ["needs-⬡ permission"], detail: "re-derived from the transcript: a tool result in the last turn carries is_error" };
	return {
		land: false, causes: ["no report"],
		detail: "re-derived from the transcript: the turn completed, but the step report rides the stream and the stream died with its reader",
	};
}
