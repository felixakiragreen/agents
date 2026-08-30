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
import { readTranscript, readTranscriptText, slugFor, transcriptPath } from "../transcript.ts";
import { HERE } from "./harness.ts";

const REAL = `${HERE}/test/fixtures/real-q1-write.jsonl`;

test("grammar §2 — the transcript path is the config dir, the slugged cwd, the session id", () => {
	expect(slugFor("/private/tmp/x/y-z")).toBe("-private-tmp-x-y-z");
	expect(transcriptPath("/c", "/private/tmp/v", "0f00-sid")).toBe("/c/projects/-private-tmp-v/0f00-sid.jsonl");
});

test("a real C4 transcript parses whole: attachments, a denial, one closed turn", () => {
	const reading = readTranscript(REAL);
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

	expect(readTranscriptText(rows(user, toolUse, toolResult, said)).verdict).toBe("worked");
	expect(readTranscriptText(rows(user, toolUse, toolResult)).verdict).toBe("dead");
	expect(readTranscriptText(rows(user, toolUse)).verdict).toBe("dead");
	// The second turn is the one that is read: an earlier turn cannot close a later one.
	expect(readTranscriptText(rows(user, said, user, toolUse)).turns).toBe(2);
	expect(readTranscriptText(rows(user, said, user, toolUse)).verdict).toBe("dead");
});

test("a missing transcript is dead, not an exception", () => {
	expect(readTranscript(`${HERE}/test/fixtures/there-is-no-such-file.jsonl`))
		.toEqual({ turns: 0, rows: 0, torn: 0, complete: false, denied: false, text: "", verdict: "dead" });
});
