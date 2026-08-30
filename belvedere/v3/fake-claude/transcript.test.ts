import { test, expect } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { priorTurns, slugFor, transcript, transcriptPath } from "./transcript.ts";
import { VENUE_ROOT } from "./goldens.ts";

test("the slug is grammar §2's: every non-alphanumeric becomes a dash", () => {
	expect(slugFor("/private/tmp/claude-502/-Users-felix/scratch.d"))
		.toBe("-private-tmp-claude-502--Users-felix-scratch-d");
	expect(transcriptPath("/cfg", "/a/b", "sid")).toBe("/cfg/projects/-a-b/sid.jsonl");
});

test("the act index is the transcript's own count of turns", () => {
	const dir = `${VENUE_ROOT}/transcript-unit`;
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
	const path = `${dir}/s.jsonl`;

	expect(priorTurns(path)).toBe(0);
	const tx = transcript(path);
	tx.append({ type: "user", message: { role: "user", content: "turn 0" } });
	// A tool result is a user row too — it carries an array, not a turn.
	tx.append({ type: "user", message: { role: "user", content: [{ type: "tool_result" }] } });
	tx.append({ type: "assistant", message: { role: "assistant", content: [] } });
	expect(priorTurns(path)).toBe(1);
	tx.append({ type: "user", message: { role: "user", content: "turn 1" } });
	expect(priorTurns(path)).toBe(2);
});

test("a torn tail is skipped, never counted", () => {
	const dir = `${VENUE_ROOT}/transcript-torn`;
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
	const path = `${dir}/s.jsonl`;
	writeFileSync(path, JSON.stringify({ type: "user", message: { role: "user", content: "turn 0" } }) + '\n{"type":"user","mess');
	expect(priorTurns(path)).toBe(1);
});
