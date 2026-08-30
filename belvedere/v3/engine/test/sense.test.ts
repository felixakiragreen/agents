// The parser against the whole instrument: every one of C5's 23 committed
// goldens is read by the sensor, and by C5's own conformance oracle, so the
// engine's parse rules and the fake's dialect are checked against each other
// rather than against this test's imagination.
import { test, expect } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { validateStream } from "../../fake-claude/validate.ts";
import { emptyReading, senseLine, verdict, type Reading } from "../sense.ts";
import type { Posture } from "../flow.ts";
import { HERE } from "./harness.ts";

const GOLDENS = `${HERE}/../fake-claude/goldens`;
const names = readdirSync(GOLDENS).filter((f) => f.endsWith(".jsonl")).map((f) => f.slice(0, -6)).sort();

const read = (name: string, asked: Posture = "auto"): Reading => {
	const r = emptyReading(asked);
	for (const line of readFileSync(`${GOLDENS}/${name}.jsonl`, "utf8").split("\n")) senseLine(r, line);
	return r;
};

test("the corpus is 23 goldens, and the sensor reads every one without a torn line", () => {
	expect(names.length).toBe(23);
	for (const name of names) {
		expect([name, validateStream(readFileSync(`${GOLDENS}/${name}.jsonl`, "utf8")).violations]).toEqual([name, []]);
		const r = read(name);
		expect([name, r.unparsed]).toEqual([name, 0]);
		expect([name, r.sessionId === null]).toEqual([name, false]);
	}
});

test("parse rule 1 — read to EOF, the last result wins", () => {
	// One invocation, two results: a subagent's completion re-invokes the parent
	// (C4 F1). num_turns 2 is the second result's, not the first's.
	const r = read("subagent-double-result");
	expect(r.results).toBe(2);
	expect(r.dead).toBe(false);
	expect(r.text).toBe("0 files.");
});

test("parse rule 2 — the truth signal is permission_denials[], not the subtype", () => {
	const r = read("permission-denial");
	expect(r.denials).toEqual([{ tool: "Write", toolUseId: expect.any(String) }]);
	expect(r.errored).toBe(false);                       // exit 0, success, is_error false — and nothing was written
	const v = verdict(r);
	expect(v.land).toBe(false);
	expect(v.land === false && v.causes[0]).toBe("needs-⬡ permission");
});

test("parse rule 3 — no result at EOF is dead, never a subtype", () => {
	for (const name of ["die-137", "hang"]) {
		const r = read(name);
		expect([name, r.results]).toEqual([name, 0]);
		expect([name, r.dead]).toEqual([name, true]);
	}
	// The other death: a result does arrive, and only is_error separates it.
	const err = read("die-exit-1");
	expect(err.dead).toBe(false);
	expect(err.errored).toBe(true);
});

test("parse rule 4 — init.permissionMode is read back, and it lies quietly", () => {
	expect(read("echo", "acceptEdits").granted).toBe("acceptEdits");
	expect(read("posture-mismatch", "auto").granted).toBe("default");
	expect(read("plan-noop", "auto").granted).toBe("plan");
});

test("parse rule 7 — the step report is read, never inferred", () => {
	expect(read("schema-done").report).toEqual({
		state: "done", cause: "Wrote config.yaml with the requested port", answer: "config.yaml is in place.",
	});
	expect(read("schema-needs-input").report?.state).toBe("needs_input");
	expect(read("schema-blocked").report?.state).toBe("blocked");
	// A turn that reported nothing is not a landing — the question gap (C4 F5).
	expect(read("echo").report).toBeNull();
	const v = verdict(read("echo", "acceptEdits"));
	expect(v.land === false && v.causes).toEqual(["no report"]);
});

test("parse rule 9 as amended — merged turns are arithmetic, never queued_turn_count", () => {
	const merged = readFileSync(`${GOLDENS}/armb-merge-trap.jsonl`, "utf8");
	const results = merged.split("\n").filter(Boolean).map((l) => JSON.parse(l) as Record<string, unknown>)
		.filter((e) => e.type === "result");
	expect(results.length).toBe(2);                      // four messages went in
	expect(results.map((e) => e.queued_turn_count)).toEqual([0, 0]);
});

test("noise is noise: thinking tokens, rate limits and hook events move nothing", () => {
	for (const name of ["thinking-noise", "rate-limit", "hook-events"]) {
		const r = read(name, "acceptEdits");
		expect([name, r.results]).toEqual([name, 1]);
		expect([name, r.dead]).toEqual([name, false]);
		expect([name, r.denials]).toEqual([name, []]);
	}
});
