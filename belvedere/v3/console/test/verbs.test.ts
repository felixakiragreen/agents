// The five verbs, on fake subjects — budget 0.
//
// Every test drives the console the way a script does: argv in, stdout and an
// exit code out. What is being proven is the console's own logic — addressing,
// rendering, the summon mark, and the refusals — never the engine's, which has
// its own 64 tests. Where a refusal is the engine's (`rule()` on a step that is
// not paused), the test asserts the console hands it through unchanged rather
// than restating it: ambiguity never authorizes, and it never gets re-worded on
// the way to a human either (D10).

import { test, expect, beforeAll } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { console_, fixture, type Fixture } from "./harness.ts";
import { renderRow, renderStream } from "../render.ts";
import { paneName, summonArgv, summonCommand, summoned } from "../summon.ts";
import { locate, runs } from "../runs.ts";
import { isRefusal } from "../../engine/refusal.ts";

let f: Fixture;
beforeAll(async () => { f = await fixture("verbs"); });

// ── list ─────────────────────────────────────────────────────────────────────

test("list — every step of every run: state, causes, posture, session", async () => {
	const { code, out } = await console_(f.root, "list");
	expect(code).toBe(0);
	expect(out).toContain("console/three-moves/plan  landed done");
	expect(out).toContain("console/three-moves/ask   paused ‹no report›");
	expect(out).toContain("console/three-moves/ship  pending");
	// The cause's detail, on its own line — a pause with no cause is a silent stall.
	expect(out).toContain("the result carries no parseable step report");
	// The posture is shown plainly and never dressed up (C8 F4).
	expect(out).toContain("sonnet·auto");
	// Every session the run ever made is locatable from the log alone (C8 F8) —
	// including a landed step's, whose own state has forgotten it.
	const log = readFileSync(`${f.runDir}/run.jsonl`, "utf8");
	for (const id of ["plan", "ask"]) {
		const ignited = log.split("\n").filter((l) => l !== "").map((l) => JSON.parse(l) as { kind: string; step?: string; sessionId?: string })
			.find((e) => e.kind === "ignited" && e.step === id);
		expect(out).toContain(ignited!.sessionId!);
	}
	expect(out).toContain("3 steps in 1 runs");
});

test("list — nothing under an empty root is said, not crashed", async () => {
	const { code, out } = await console_("/private/tmp/v3-console-test/there-is-no-such-root", "list");
	expect(code).toBe(0);
	expect(out).toContain("no runs under");
});

test("list — a live step is marked live by its pid, a corpse is marked DEAD", async () => {
	// The fixture's steps are all settled, so liveness is asserted where it can be
	// asserted without a live subject: the marker is `-` for a step that is not
	// running, which is the only honest answer to "is its process alive".
	const { out } = await console_(f.root, "list");
	expect(out).not.toContain("DEAD");
	expect(out).not.toContain("live ");
});

// ── read ─────────────────────────────────────────────────────────────────────

test("read — the turn's stream, rendered, with the engine's own verdict at the foot", async () => {
	const { code, out } = await console_(f.root, "read", f.name, "plan");
	expect(code).toBe(0);
	expect(out).toContain("turn 0 of 1");
	expect(out).toContain("init     posture auto");
	expect(out).toContain("tool     Write");
	expect(out).toContain("result   success · is_error false · denials 0");
	expect(out).toContain("verdict  LANDS · report done:");
});

test("read — a paused turn renders the same causes the board row shows", async () => {
	const { code, out } = await console_(f.root, "read", f.name, "ask");
	expect(code).toBe(0);
	expect(out).toContain("verdict  PAUSES ‹no report›");
	expect(out).toContain("detail   the result carries no parseable step report");
});

test("read — refusals in kind: an unknown run, an unknown step, a turn never fired", async () => {
	const missing = await console_(f.root, "read", "console/nope", "plan");
	expect(missing.code).toBe(2);
	expect(missing.out).toContain("no run at");

	const noStep = await console_(f.root, "read", f.name, "nope");
	expect(noStep.code).toBe(2);
	expect(noStep.out).toContain(`has no step "nope"`);
	expect(noStep.out).toContain("plan, ask, ship");

	const noTurn = await console_(f.root, "read", f.name, "ship");
	expect(noTurn.code).toBe(2);
	expect(noTurn.out).toContain("there is no turn");

	const past = await console_(f.root, "read", f.name, "plan", "--turn", "9");
	expect(past.code).toBe(2);
	expect(past.out).toContain("no stream file for turn 9");
});

// ── send ─────────────────────────────────────────────────────────────────────

test("send — a ruling on a step that is not paused is refused in the engine's own words", async () => {
	const g = await fixture("send-refusal");
	const { code, out } = await console_(g.root, "send", g.name, "plan", "land");
	expect(code).toBe(2);
	expect(out).toContain("step plan is landed, and only a paused step takes a ruling");
});

test("send — land, and the flow stays put until --run says otherwise", async () => {
	const g = await fixture("send-land");
	const landed = await console_(g.root, "send", g.name, "ask", "land", "--note", "close enough");
	expect(landed.code).toBe(0);
	expect(landed.out).toContain("paused ‹no report›  ->  landed by ruling");

	// The ruling moved its own step and nothing else: `ship` is ready but unfired.
	const before = await console_(g.root, "list");
	expect(before.out).toContain("ship  pending");

});

test("send — --run drives the flow on from the ruling, and says what moved", async () => {
	const g = await fixture("send-run");
	const { code, out } = await console_(g.root, "send", g.name, "ask", "land", "--run");
	expect(code).toBe(0);
	expect(out).toContain("paused ‹no report›  ->  landed by ruling");
	expect(out).toContain("ship             landed done");
	expect(out).toContain("turns 3/6");                        // the third is ship's
	const after = await console_(g.root, "list");
	expect(after.out).toContain("ship  landed done");
});

test("send — kill carries its note into the log, and --run drives what it unblocks", async () => {
	const g = await fixture("send-kill");
	const { code, out } = await console_(g.root, "send", g.name, "ask", "kill", "--note", "the subject is confused");
	expect(code).toBe(0);
	expect(out).toContain("->  killed");
	const list = await console_(g.root, "list");
	expect(list.out).toContain("the subject is confused");
	// A killed edge never lands, so nothing downstream may ignite (invariant 2).
	expect(list.out).toContain("ship  pending");
});

test("send — an answer resumes the subject and spends a turn", async () => {
	const g = await fixture("send-answer");
	const { code, out } = await console_(g.root, "send", g.name, "ask", "the release name is BRAVO");
	expect(code).toBe(0);
	expect(out).toContain("turns 3/6");                        // 2 ignitions + 1 resume
	const turn1 = await console_(g.root, "read", g.name, "ask", "--turn", "1");
	expect(turn1.code).toBe(0);
	expect(turn1.out).toContain("turn 1 of 2");
});

test("send — a third argument is required, and there is no default ruling", async () => {
	const { code, out } = await console_(f.root, "send", f.name, "ask");
	expect(code).toBe(2);
	expect(out).toContain("send wants a third argument");
});

// ── summon ───────────────────────────────────────────────────────────────────

test("summon — the exact command, and the mark that says a human has it", async () => {
	const g = await fixture("summon");
	const { code, out } = await console_(g.root, "summon", g.name, "ask");
	expect(code).toBe(0);
	expect(out).toContain("env -i");
	expect(out).toContain("CLAUDE_CONFIG_DIR=");
	expect(out).toContain("--resume");
	expect(out).toContain("workspace-trust");
	expect(out).toContain("marked summoned");
	expect(existsSync(`${g.runDir}/summoned.jsonl`)).toBe(true);

	const open = summoned(g.runDir);
	expect(open.has("ask")).toBe(true);
	expect(open.get("ask")!.sessionId).toBeString();

	// And the board says so, so nobody rules a step a human is sitting in front of.
	const list = await console_(g.root, "list");
	expect(list.out).toContain("summoned");
});

test("summon — a step with no session refuses; the mark is never written", async () => {
	const g = await fixture("summon-refusal");
	const { code, out } = await console_(g.root, "summon", g.name, "ship");
	expect(code).toBe(2);
	expect(out).toContain("has no session to summon");
	expect(existsSync(`${g.runDir}/summoned.jsonl`)).toBe(false);
});

test("summon — the command is the clean room's, never the shim on PATH (C4 F0)", () => {
	const argv = summonArgv({
		step: "s", sessionId: "sid", model: "sonnet", effort: "low",
		venue: { workDir: "/a b/c", configDir: "/Users/felix/.claude" },
	});
	expect(argv[0]).toBe("env");
	expect(argv[1]).toBe("-i");
	expect(argv).toContain("CLAUDE_CONFIG_DIR=/Users/felix/.claude");
	expect(argv.some((w) => w.endsWith("/.local/bin/claude"))).toBe(true);
	expect(argv).not.toContain("claude");
	// HOME rides through and is never rewritten — overriding it breaks keychain OAuth.
	expect(argv.some((w) => w === `HOME=${process.env.HOME ?? ""}`)).toBe(true);
	// A venue path with a space in it pastes back exactly as it was printed.
	expect(summonCommand({
		step: "s", sessionId: "sid", model: "sonnet", effort: "low",
		venue: { workDir: "/a b/c", configDir: "/Users/felix/.claude" },
	})).toContain(`cd '/a b/c' &&`);
	expect(paneName("c10/rehearsal", "ask")).toBe("c10-rehearsal-ask");
});

// ── return ───────────────────────────────────────────────────────────────────

test("return — refuses a step no human has been handed, and send refuses one they have", async () => {
	const g = await fixture("return");
	const early = await console_(g.root, "return", g.name, "ask", "come back");
	expect(early.code).toBe(2);
	expect(early.out).toContain("is not summoned");

	expect((await console_(g.root, "summon", g.name, "ask")).code).toBe(0);

	// The partition: a summoned step is `return`'s, never `send`'s.
	const crossed = await console_(g.root, "send", g.name, "ask", "land");
	expect(crossed.code).toBe(2);
	expect(crossed.out).toContain("comes back with `return`, not `send`");

	const back = await console_(g.root, "return", g.name, "ask", "you are back under the engine");
	expect(back.code).toBe(0);
	expect(back.out).toContain("summoned ");
	expect(summoned(g.runDir).has("ask")).toBe(false);
	// The mark closed, so `send` owns the step again.
	const list = await console_(g.root, "list");
	expect(list.out).not.toContain("summoned");
});

// ── the pieces, directly ─────────────────────────────────────────────────────

test("the quota row is a gauge, not an alarm — presence means nothing (C9 F1)", () => {
	const allowed = renderRow(JSON.stringify({
		type: "rate_limit_event",
		rate_limit_info: { status: "allowed", unifiedWindows: { five_hour: { utilization: 0.09 }, seven_day: { utilization: 0.5 } } },
	}));
	expect(allowed).toBe("  quota    five-hour 9% · seven-day 50%");
	expect(allowed).not.toContain("ALARM");

	const throttled = renderRow(JSON.stringify({
		type: "rate_limit_event",
		rate_limit_info: { status: "rejected", unifiedWindows: { five_hour: { utilization: 1 }, seven_day: { utilization: 0.9 } } },
	}));
	expect(throttled).toContain("ALARM: status rejected");
});

test("a refused tool is rendered REFUSED, and a torn row is said aloud", () => {
	const denied = renderRow(JSON.stringify({
		type: "user",
		message: { content: [{ type: "tool_result", tool_use_id: "t", content: "no", is_error: true }] },
	}));
	expect(denied).toContain("REFUSED");
	expect(renderRow("{not json")).toContain("unparseable");
	// An empty stream still gets a verdict — the turn that wrote nothing is dead.
	expect(renderStream("", "auto")).toContain("verdict  PAUSES ‹dead›");
});

test("a run is addressable by its path under the root, or outright", () => {
	const byName = locate(f.name, f.root);
	const byPath = locate(f.runDir, f.root);
	expect(isRefusal(byName)).toBe(false);
	expect(isRefusal(byPath)).toBe(false);
	if (isRefusal(byName) || isRefusal(byPath)) return;
	expect(byName.dir).toBe(byPath.dir);
	expect(runs(f.root).map((r) => r.name)).toEqual([f.name]);
});
