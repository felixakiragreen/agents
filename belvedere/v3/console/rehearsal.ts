#!/usr/bin/env bun
// The rehearsal — the five verbs against a real three-step flow, one pass.
//
//   bun console/rehearsal.ts [account]
//
// This is bar 6's dress rehearsal and the script Felix's hand re-runs at G4.
// Everything it does, it does **through the console's own argv** — spawned as a
// subprocess, the way a script or a human drives it — so what this proves is the
// console and not some shortcut through the library it sits on.
//
// The flow is the smallest thing that needs all five verbs:
//
//   plan  lands headless                       → `list` has something to show
//   ask   stops and asks for a name            → `read` renders it, `send` answers it
//   hold  stops and asks who signs             → `summon` hands it to a human,
//                                                `return` brings it back headless
//
// **The venue is warm on purpose.** A session born in a cwd the account never
// accepted is unsummonable — the trust dialog is the TUI's and only `-p` skips
// it (C4 F8) — so the subjects work in a gitignored directory under a repo all
// three accounts already trust, which C8 F2 measured to inherit that trust.
//
// **The hand turn is typed by tmux here and by Felix at G4.** It is a turn the
// engine never fired and the account still paid for, so it is tallied off-log
// (`lab/c10/meter.ts`).
//
// Budget: ≤$3 and ≤30 turns, dollars leading (C8 F9). The meter runs at the end
// and exits nonzero on a ceiling — that is a ⬡-fork, not a retry (D21).

import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { load } from "../engine/engine.ts";
import { invariants } from "../engine/invariants.ts";
import { isRefusal } from "../engine/refusal.ts";
import { paneName, SOCKET } from "./summon.ts";
import { ACCOUNTS } from "../engine/venue.ts";
import { c10meter, COST_CEILING, RUNS, TURN_CEILING } from "../lab/c10/meter.ts";

const account = process.argv[2] ?? "personal";
const configDir: string | undefined = ACCOUNTS[account as keyof typeof ACCOUNTS];
if (configDir === undefined) throw new Error(`unknown account ${account} — one of ${Object.keys(ACCOUNTS).join(", ")}`);

const RUN = "rehearsal";
const runDir = `${RUNS}/${RUN}`;
const workDir = `${RUNS}/venue/${account}`;
const CLI = new URL("./cli.ts", import.meta.url).pathname;

/** What every real step is told about the report it must fill. The schema rides
 *  the wire (`--json-schema`); this is the sentence naming which state it is in. */
const REPORT_RULE =
	"When you are finished, set the report state to `done`. " +
	"If you cannot proceed without an answer from a human, set it to `needs_input` " +
	"and put the question in `cause`. If you are blocked for any other reason, set it to `blocked`.";

const NAME = "REHEARSAL-ALPHA";
const SIGNER = "REHEARSAL-BRAVO";

const step = (id: string, depends: string[], prompt: string) => ({
	kind: "task", id, depends, prompt, subject: { real: {} },
	model: "sonnet", effort: "low", posture: "auto", timeout_ms: 180_000,
});

const FLOW = {
	id: "c10rehearsal", name: "the console's five verbs, on real sessions", budget: 8,
	steps: [
		step("plan", [], `Write a file called notes.md in your working directory containing exactly one line: "Release notes pending." Then stop. ${REPORT_RULE}`),
		step("ask", ["plan"], `You are drafting a release announcement. The release NAME has not been given to you and you must not invent one. Ask for the release name and stop. ${REPORT_RULE}`),
		step("hold", ["ask"], `Remember this codeword exactly: ${NAME}. You are writing the announcement's sign-off line. The NAME OF THE PERSON who signs it has not been given to you and you must not invent one. Ask who signs it and stop. ${REPORT_RULE}`),
	],
};

// ── the console, as a script drives it ───────────────────────────────────────

let step_ = 0;
async function verb(...args: string[]): Promise<string> {
	console.log(`\n${"─".repeat(78)}\n${++step_}. $ bun console/cli.ts ${args.join(" ")}\n`);
	const p = Bun.spawn([process.execPath, CLI, ...args, "--root", RUNS], { stdout: "pipe", stderr: "pipe" });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	await p.exited;
	const text = out + err;
	console.log(text.trimEnd());
	if (p.exitCode !== 0) throw new Error(`the console exited ${p.exitCode} on: ${args.join(" ")}`);
	return text;
}

const tmux = async (...args: string[]): Promise<string> => {
	const p = Bun.spawn(["tmux", "-L", SOCKET, ...args], { stdout: "pipe", stderr: "pipe" });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	await p.exited;
	return out + err;
};

// ── the pass ─────────────────────────────────────────────────────────────────

// A previous pass is rotated aside, never deleted: its streams are the only
// record of turns this account actually paid for, and the meter reads them.
if (existsSync(runDir)) {
	let n = 1;
	while (existsSync(`${runDir}-${n}`)) n++;
	renameSync(runDir, `${runDir}-${n}`);
	console.log(`  (a previous pass was rotated aside to ${runDir}-${n} — its spend still counts)`);
}
mkdirSync(runDir, { recursive: true });
mkdirSync(workDir, { recursive: true });
writeFileSync(`${runDir}/flow.json`, JSON.stringify(FLOW, null, 2) + "\n");
// The run's own conditions — provenance only. **It deliberately names no
// venue** (no `account`, no `configDir`, no `workDir`): since C14 the run log
// carries the config dir on `ignited`, so every console verb below resolves the
// account from the log alone, and this sidecar cannot be what told it.
writeFileSync(`${runDir}/conditions.json`, JSON.stringify({
	drill: RUN,
	at: new Date().toISOString(), load: loadavg().map((n) => n.toFixed(2)).join(" "), concurrent: 1,
}, null, 2) + "\n");

console.log(`# the console rehearsal · ${account} · ${new Date().toISOString()} · load ${loadavg().map((n) => n.toFixed(2)).join(" ")}`);
console.log(`  run   ${runDir}\n  venue ${workDir}\n  flow  plan -> ask -> hold, sonnet·low under auto`);

// Turn 0 and 1, headless, by the engine: the console does not launch flows.
const run = load(`${runDir}/flow.json`, { runDir, venue: { workDir, configDir } });
if (isRefusal(run)) throw new Error(run.refusal);
const blessed = run.bless();
if (isRefusal(blessed)) throw new Error(blessed.refusal);
await run.run();

// 1 — list: the run, step by step, live or not.
await verb("list");

// 2 — read: the paused turn, rendered, with the engine's own verdict at its foot.
await verb("read", RUN, "ask");

// 3 — send: the answer, and the flow driven on to the step behind it.
await verb("send", RUN, "ask", `The release name is ${NAME}. Set your report state to done and put the release name in \`answer\`.`, "--run");

// 4 — summon: the next paused step, in a real terminal.
const summoned = await verb("summon", RUN, "hold", "--tmux");
if (summoned.includes("trust dialog true"))
	throw new Error(`the pane stopped on the workspace-trust dialog — ${account} has not accepted ${workDir}`);

// The hand turn. Felix types this at G4; tmux types it here, literally
// (`send-keys -l`), because nothing is ever pasted into a live TUI (P6's wall).
const pane = paneName(RUN, "hold");
console.log(`\n${"─".repeat(78)}\n${++step_}. THE HAND TURN — typed into pane ${pane} (Felix's, at G4)\n`);
await tmux("send-keys", "-t", pane, "-l", `The sign-off is ${SIGNER}. Acknowledge it and stop.`);
await tmux("send-keys", "-t", pane, "Enter");
for (let i = 0; i < 90; i++) {
	await Bun.sleep(1000);
	if ((await tmux("capture-pane", "-p", "-t", pane)).includes(SIGNER) && i > 8) break;
}
const shot = (await tmux("capture-pane", "-p", "-t", pane)).split("\n").filter((l) => l.trim() !== "");
for (const line of shot.slice(-10)) console.log(`  | ${line}`);
await tmux("kill-server");
// A turn the account paid for that no run log carries (lab/c10/meter.ts).
appendFileSync(`${RUNS}/off-log.jsonl`, JSON.stringify({ what: "the rehearsal's hand turn", pane, at: new Date().toISOString() }) + "\n");

// 5 — return: back under the engine, headless, on the same session. The cursor
// absorbs the pane's rows because it is a recorded row count (C11, C8 F7).
await verb("return", RUN, "hold",
	`Report now. Set state to done. In \`answer\`, give exactly two things separated by a comma: the codeword you were told at the very start, and the sign-off you were just told.`,
	"--run");

// 6 — list again: the terminal state, from the log alone.
const final = await verb("list");

// ── the bar ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(78)}\nTHE BAR\n`);
const reds = invariants(`${runDir}/run.jsonl`);
for (const x of reds) console.log(`  RED ${x.invariant} ${x.name} ${x.step} — ${x.detail}`);
console.log(`  invariants          ${reds.length === 0 ? "9/9 green" : `${reds.length} violations`}`);

const state = run.state();
const terminal = Object.values(state.steps).every((at) => at.at === "landed" || at.at === "killed");
const landed = Object.values(state.steps).filter((at) => at.at === "landed").length;
console.log(`  terminal state      ${terminal} · ${landed}/${FLOW.steps.length} landed`);
// The account, off the log and nowhere else (C14). Three things are asserted
// and each one is checkable by eye above: the sidecar holds no venue field at
// all, the log's first `ignited` names this account's config dir, and the
// summon command the console printed carried that same dir into `env -i` — the
// only place it could have come from is the log.
const sidecar = JSON.parse(readFileSync(`${runDir}/conditions.json`, "utf8")) as Record<string, unknown>;
const sidecarSilent = ["account", "configDir", "workDir"].every((k) => sidecar[k] === undefined);
const ignited = readFileSync(`${runDir}/run.jsonl`, "utf8").split("\n").filter((l) => l !== "")
	.map((l) => JSON.parse(l) as { kind: string; configDir?: string }).find((e) => e.kind === "ignited");
const summonedDir = /CLAUDE_CONFIG_DIR=(\S+)/.exec(summoned)?.[1] ?? "";
console.log(`  the account, off the log`);
console.log(`    conditions.json names no venue   ${sidecarSilent}`);
console.log(`    ignited.configDir                ${ignited?.configDir ?? "ABSENT"} (${ignited?.configDir === configDir})`);
console.log(`    summon carried CLAUDE_CONFIG_DIR ${summonedDir} (${summonedDir === configDir})`);
const offLog = sidecarSilent && ignited?.configDir === configDir && summonedDir === configDir;

const answer = state.steps.hold?.at === "landed" ? state.steps.hold.report?.answer ?? "" : "";
console.log(`  the round trip      headless-born ${answer.includes(NAME)} · TUI-born ${answer.includes(SIGNER)}`);
console.log(`  answer              ${JSON.stringify(answer)}`);
console.log(`  five verbs          ${["list", "read", "send", "summon", "return"].join(" · ")}`);
console.log(`  final board         ${final.trim().split("\n").length} lines, above`);

const m = c10meter();
console.log(`\n  turns ${m.turns}/${TURN_CEILING} (${m.offLog} off-log) · cost $${m.cost.toFixed(4)}/$${COST_CEILING}`);
if (m.turns > TURN_CEILING || m.cost > COST_CEILING) {
	console.error("  CEILING HIT — stop, file what stands, ⬡-fork to Felix (D21)");
	process.exit(1);
}
process.exit(reds.length === 0 && terminal && offLog ? 0 : 1);
