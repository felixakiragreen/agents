// What the run log now carries, and what the console does with it (C14).
//
// Two things were true of every run before this: the log named the subject's
// cwd and never the config dir that selects the account (C10 F5), and the fake
// could not ask a question and then land on the answer (C10 F2). So the
// console's driving verbs leaned on a `conditions.json` sidecar, and its most
// consequential verb was proven only by spending real turns. Both are measured
// here on fakes alone.

import { test, expect, beforeAll } from "bun:test";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { ARC, console_, fixture, SCRATCH, type Fixture } from "./harness.ts";
import { locate } from "../runs.ts";
import { readLog } from "../../engine/log.ts";
import { transcriptPath } from "../../engine/transcript.ts";
import { venueFor } from "../../engine/engine.ts";
import { isRefusal } from "../../engine/refusal.ts";

/** A venue that is visibly not the run dir's own sandbox: if the console falls
 *  back instead of reading the log, every assertion below moves. */
const elsewhere = (root: string) => ({ workDir: `${root}/venue`, configDir: `${root}/account` });

// ── the arc `send <text>` drives ─────────────────────────────────────────────

let arc: Fixture;
beforeAll(async () => { arc = await fixture("arc", { flow: ARC }); });

test("send — the subject's question is the pause's detail, verbatim", async () => {
	const { code, out } = await console_(arc.root, "list");
	expect(code).toBe(0);
	expect(out).toContain("paused ‹needs-⬡ question›");
	expect(out).toContain("Which release name goes in the sign-off?");
});

test("send <text> — pause, answer, landing: the whole arc on a fake", async () => {
	const g = await fixture("arc-send", { flow: ARC });
	const { code, out } = await console_(g.root, "send", g.name, "ask", "The release name is ANSWER-THEN-LAND.", "--run");
	expect(code).toBe(0);
	expect(out).toContain("paused ‹needs-⬡ question›  ->  landed done");
	// The answer the subject reported, printed by the verb that asked for it.
	expect(out).toContain("answer: ANSWER-THEN-LAND-OK");
	// And the step behind it, unblocked by a landing that was not a ruling.
	expect(out).toContain("ship             landed done");
	expect(out).toContain("turns 4/6");

	// Two turns on one session: the ignition that asked and the resume that
	// answered — the arc, not two ignitions.
	const ignited = readLog(`${g.runDir}/run.jsonl`).filter((e) => e.kind === "ignited" && e.step === "ask");
	const resumed = readLog(`${g.runDir}/run.jsonl`).filter((e) => e.kind === "resumed" && e.step === "ask");
	expect([ignited.length, resumed.length]).toEqual([1, 1]);
}, 20_000);

// ── the account, from the log alone ──────────────────────────────────────────

test("the log names the venue, and the console reads it from there", async () => {
	const root = `${SCRATCH}/from-log`;
	const g = await fixture("from-log", { venue: elsewhere(root), conditions: true });
	rmSync(`${g.runDir}/conditions.json`);

	const handle = locate(g.name, g.root);
	if (isRefusal(handle)) throw new Error(handle.refusal);
	expect(handle.venueFrom).toBe("log");
	expect(handle.venue).toEqual(elsewhere(root));
	// Not one of the three accounts, so it has no word for itself — the raw
	// config dir is the honest display, and the sandbox is not it.
	expect(handle.account).toBe(`${root}/account`);
	expect(handle.venue.configDir).not.toBe(venueFor(g.runDir).configDir);
});

test("send and return drive a run whose conditions.json is gone", async () => {
	const root = `${SCRATCH}/no-sidecar`;
	const venue = elsewhere(root);
	const g = await fixture("no-sidecar", { flow: ARC, venue, conditions: true });
	expect(existsSync(`${g.runDir}/conditions.json`)).toBe(true);
	rmSync(`${g.runDir}/conditions.json`);

	const sent = await console_(g.root, "send", g.name, "ask", "The release name is ANSWER-THEN-LAND.");
	expect(sent.code).toBe(0);
	expect(sent.out).toContain("landed done");

	// Where the resumed turn actually went. The engine writes a subject's
	// transcript under the config dir it was handed, so this file existing under
	// the venue the LOG named — and nothing existing under the sandbox the
	// fallback would have chosen — is the resolution, measured.
	const sid = readLog(`${g.runDir}/run.jsonl`).find((e) => e.kind === "ignited" && e.step === "ask")!;
	if (sid.kind !== "ignited") throw new Error("no ignition");
	expect(existsSync(transcriptPath(venue.configDir, venue.workDir, sid.sessionId))).toBe(true);
	expect(existsSync(transcriptPath(venueFor(g.runDir).configDir, venue.workDir, sid.sessionId))).toBe(false);

	// `return` takes the same road: summoned, then back under the engine, with
	// no sidecar anywhere on disk.
	const summoned = await console_(g.root, "summon", g.name, "ship");
	expect(summoned.code).toBe(2);          // `ship` landed on its own — nothing to summon
	const back = await console_(g.root, "return", g.name, "ask", "anything");
	expect(back.code).toBe(2);
	expect(back.out).toContain("is not summoned");
	expect(existsSync(`${g.runDir}/conditions.json`)).toBe(false);
}, 20_000);

test("return brings a summoned step back with the venue read off the log", async () => {
	const root = `${SCRATCH}/return-log`;
	const g = await fixture("return-log", { flow: ARC, venue: elsewhere(root), conditions: true });
	rmSync(`${g.runDir}/conditions.json`);

	const summoned = await console_(g.root, "summon", g.name, "ask");
	expect(summoned.code).toBe(0);
	// The command carries the config dir the log named — `env -i` and nothing
	// inherited, so this is the only place the account can come from.
	expect(summoned.out).toContain(`CLAUDE_CONFIG_DIR=${root}/account`);

	const back = await console_(g.root, "return", g.name, "ask", "The release name is ANSWER-THEN-LAND.");
	expect(back.code).toBe(0);
	expect(back.out).toContain("landed done");
}, 20_000);

// ── what a run that names no account may not do ──────────────────────────────

test("a pre-C14 log with no sidecar is readable, and every driving verb refuses", async () => {
	const g = await fixture("pre-c14", { flow: ARC });
	// The log as it would have been written before C14 — `configDir` struck from
	// every ignition — over a flow whose subjects are real, which is the only
	// case where the sandbox is the wrong answer rather than the right one.
	const log = readLog(`${g.runDir}/run.jsonl`).map((e) => e.kind === "ignited" ? { ...e, configDir: undefined } : e);
	const flow = (log[0] as { flow: { steps: Record<string, unknown>[] } }).flow;
	for (const s of flow.steps) s.subject = { real: {} };
	writeFileSync(`${g.runDir}/run.jsonl`, log.map((e) => JSON.stringify(e)).join("\n") + "\n");
	rmSync(`${g.runDir}/flow.json`);

	// Readable forever: the board still shows every step and every cause.
	const list = await console_(g.root, "list");
	expect(list.code).toBe(0);
	expect(list.out).toContain("paused ‹needs-⬡ question›");
	const read = await console_(g.root, "read", g.name, "plan");
	expect(read.code).toBe(0);

	// Drivable never — and it says why, rather than resuming into a sandbox that
	// holds no such session.
	for (const argv of [["send", g.name, "ask", "an answer"], ["summon", g.name, "ask"], ["return", g.name, "ask", "back"]]) {
		const refused = await console_(g.root, ...argv);
		expect([argv[0], refused.code]).toEqual([argv[0], 2]);
		expect(refused.out).toContain("names no config dir");
	}
}, 20_000);

test("summon reads trust before the pane exists, and refuses in kind (C10 F6)", async () => {
	const root = `${SCRATCH}/untrusted`;
	const g = await fixture("untrusted", { flow: ARC, venue: elsewhere(root) });
	// The account's own record, saying it has accepted somewhere else entirely.
	const account = `${root}/account`;
	writeFileSync(`${account}/.claude.json`, JSON.stringify({ projects: { "/elsewhere": { hasTrustDialogAccepted: true } } }));
	// The step's subject is what decides whether the record is read at all, so
	// the blessed flow becomes a real one — a fake's sandbox is trusted by
	// construction and never reaches the file. The console reads the flow out of
	// the log's own first event, so that is where it is edited.
	const log = readLog(`${g.runDir}/run.jsonl`);
	const flow = (log[0] as { flow: { steps: Record<string, unknown>[] } }).flow;
	for (const s of flow.steps) s.subject = { real: {} };
	writeFileSync(`${g.runDir}/run.jsonl`, log.map((e) => JSON.stringify(e)).join("\n") + "\n");
	rmSync(`${g.runDir}/flow.json`);

	const { code, out } = await console_(g.root, "summon", g.name, "ask");
	expect(code).toBe(2);
	expect(out).toContain("is unsummonable");
	expect(out).toContain("has never accepted the workspace-trust dialog");
	// Nothing was opened and nobody was told a human has it.
	expect(out).not.toContain("marked summoned");
	expect(existsSync(`${g.runDir}/summoned.jsonl`)).toBe(false);
}, 20_000);
