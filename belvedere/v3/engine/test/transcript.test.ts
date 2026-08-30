// Bar 10 — the transcript reader against a real capture, and the completion
// rule that makes lost-stream re-derivation possible at all.
//
// The fixture is C4's own q1-write probe transcript, copied out of the personal
// config dir (provenance in fixtures/PROVENANCE.md). It carries everything the
// fake's minimum does not: `attachment` rows kilobytes long, `queue-operation`,
// `atis-latch`, a `toolDenialKind` on the denied tool result. The reader meets
// those here rather than in production (C5 F4).
import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { validateTranscript } from "../../fake-claude/validate.ts";
import { readTranscript, readTranscriptText, slugFor, transcriptPath, verdictFromTranscript } from "../transcript.ts";
import { HERE } from "./harness.ts";

const REAL = `${HERE}/test/fixtures/real-q1-write.jsonl`;
const DONE = `${HERE}/test/fixtures/real-c8-q1-smoke.jsonl`;
const ASKED = `${HERE}/test/fixtures/real-c8-q5-question.jsonl`;

test("grammar §2 — the transcript path is the config dir, the slugged cwd, the session id", () => {
	expect(slugFor("/private/tmp/x/y-z")).toBe("-private-tmp-x-y-z");
	expect(transcriptPath("/c", "/private/tmp/v", "0f00-sid")).toBe("/c/projects/-private-tmp-v/0f00-sid.jsonl");
});

test("a real C4 transcript parses whole: attachments, a denial, one closed turn", () => {
	const reading = readTranscript(REAL, 0);
	expect(reading.rows).toBe(20);
	expect(reading.torn).toBe(0);
	expect(reading.turns).toBe(1);
	expect(reading.complete).toBe(true);
	expect(reading.denied).toBe(true);
	expect(reading.verdict).toBe("denied");
	expect(reading.text).toContain("ping.txt");
	// And C5's own conformance oracle agrees the file is a legal transcript.
	expect(validateTranscript(readFileSync(REAL, "utf8")).violations).toEqual([]);
});

test("the completion rule — a turn is closed only when the assistant stopped asking for tools", () => {
	const rows = (...r: object[]) => r.map((x) => JSON.stringify(x)).join("\n") + "\n";
	const user = { type: "user", message: { role: "user", content: "do it" } };
	const toolUse = { type: "assistant", message: { content: [{ type: "tool_use", id: "toolu_1", name: "Bash" }] } };
	const toolResult = { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "toolu_1", content: "ok" }] } };
	const said = { type: "assistant", message: { content: [{ type: "text", text: "done" }] } };

	expect(readTranscriptText(rows(user, toolUse, toolResult, said), 0).verdict).toBe("worked");
	expect(readTranscriptText(rows(user, toolUse, toolResult), 0).verdict).toBe("dead");
	expect(readTranscriptText(rows(user, toolUse), 0).verdict).toBe("dead");
	// The second turn is the one that is read: an earlier turn cannot close a later one.
	expect(readTranscriptText(rows(user, said, user, toolUse), 0).turns).toBe(2);
	expect(readTranscriptText(rows(user, said, user, toolUse), 0).verdict).toBe("dead");
});

// ---------------------------------------------------------------------------
// C13 — the report on disk.
//
// The engine declares `--json-schema` on every step it fires, so the step report
// arrives as a `StructuredOutput` **tool call** and its `tool_result` is the
// turn's last conversation row — the pre-C13 rule's own signature for
// died-mid-work. On real bytes that made every landed turn read `dead` (C8 F3,
// K1: 48/48 across three accounts). The rule below is the true one, and the
// report's own bytes are in that tool call's input, so the fallback can land.

test("bar 1 — a real C8 turn the engine landed reads complete, and carries its report", () => {
	const reading = readTranscript(DONE, 0);
	expect([reading.rows, reading.torn, reading.turns]).toEqual([14, 0, 1]);
	expect(reading.complete).toBe(true);
	expect(reading.denied).toBe(false);
	expect(reading.verdict).toBe("worked");
	expect(reading.report).toEqual({ state: "done", cause: "n/a" });
	// The whole point: a turn the engine died in front of lands from disk alone.
	expect(verdictFromTranscript(reading)).toEqual({ land: true, report: { state: "done", cause: "n/a" } });
	// And C5's conformance oracle agrees the file is a legal transcript.
	expect(validateTranscript(readFileSync(DONE, "utf8")).violations).toEqual([]);
});

test("bar 1's control — a real C8 turn that asked a question is complete and still does not land", () => {
	const reading = readTranscript(ASKED, 0);
	expect([reading.rows, reading.torn, reading.turns]).toEqual([18, 0, 1]);
	expect(reading.complete).toBe(true);
	expect(reading.verdict).toBe("worked");
	expect(reading.report?.state).toBe("needs_input");
	const v = verdictFromTranscript(reading);
	expect(v.land).toBe(false);
	if (!v.land) expect(v.causes).toEqual(["no report"]);
	expect(validateTranscript(readFileSync(ASKED, "utf8")).violations).toEqual([]);
});

test("the closing pair is matched by toolUseId, never by position", () => {
	const rows = (...r: object[]) => r.map((x) => JSON.stringify(x)).join("\n") + "\n";
	const user = { type: "user", message: { role: "user", content: "do it" } };
	const said = { type: "assistant", message: { content: [{ type: "text", text: "on it" }] } };
	const report = (id: string, input: object) =>
		({ type: "assistant", message: { content: [{ type: "tool_use", id, name: "StructuredOutput", input }] } });
	const answer = (id: string) =>
		({ type: "user", message: { content: [{ type: "tool_result", tool_use_id: id, content: "Structured output provided successfully" }] } });
	const done = { state: "done", cause: "shipped" };

	const closed = readTranscriptText(rows(user, said, report("toolu_r", done), answer("toolu_r")), 0);
	expect([closed.complete, closed.verdict]).toEqual([true, "worked"]);
	expect(closed.report).toEqual(done);

	// The same rows, the linkage broken: the trailing result answers somebody
	// else's tool call, so this turn's report never came back — died mid-work.
	const mismatched = readTranscriptText(rows(user, said, report("toolu_r", done), answer("toolu_other")), 0);
	expect([mismatched.complete, mismatched.verdict, mismatched.report]).toEqual([false, "dead", null]);

	// A trailing tool_result answering an ordinary tool is still died-mid-work.
	const working = { type: "assistant", message: { content: [{ type: "tool_use", id: "toolu_b", name: "Bash" }] } };
	const midTool = readTranscriptText(rows(user, working, answer("toolu_b")), 0);
	expect([midTool.complete, midTool.verdict]).toEqual([false, "dead"]);

	// Complete, but the input is not a step report: no report, and no landing.
	const garbled = readTranscriptText(rows(user, said, report("toolu_r", { state: "shipped" }), answer("toolu_r")), 0);
	expect([garbled.complete, garbled.report]).toEqual([true, null]);
	expect(verdictFromTranscript(garbled).land).toBe(false);

	// A failed tool anywhere in the turn still pauses ‹needs-⬡ permission›,
	// report or no report — the fallback never lands over a denial signal (C11 F2).
	const denied = rows(user, working,
		{ type: "user", message: { content: [{ type: "tool_result", tool_use_id: "toolu_b", content: "nope", is_error: true }] } },
		report("toolu_r", done), answer("toolu_r"));
	const over = readTranscriptText(denied, 0);
	expect([over.complete, over.verdict]).toEqual([true, "denied"]);
	expect(verdictFromTranscript(over).land).toBe(false);
});

test("a missing transcript is dead, not an exception", () => {
	expect(readTranscript(`${HERE}/test/fixtures/there-is-no-such-file.jsonl`, 0))
		.toEqual({ turns: 0, rows: 0, torn: 0, complete: false, denied: false, text: "", verdict: "dead" });
});
