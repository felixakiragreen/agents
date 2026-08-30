#!/usr/bin/env bun
// Q6 — the summon round trip, engine-born.
//
// The narrative is D20's fallback in its natural use, not a contrivance: a step
// fired headless cannot finish without a human, so it pauses ‹needs-⬡ question›;
// the session is summoned into a real terminal, answered by hand, and then
// resumed **by the engine**, headless, on the same session id.
//
// The hazard C11 named and this drill field-tests: the hand turn writes rows into
// the transcript that the engine never fired. A reader that addressed a turn by
// counting the engine's own turns would land on the pane's turn. The cursor is a
// recorded row count and does not care who wrote what before it.
//
// Venue: the summon needs a trusted cwd (C4 F8 — the trust dialog is the TUI's,
// and `-p` skips it), so this runs in a **gitignored subdirectory of a repo the
// account has accepted** — measured to inherit the trust, and invisible to git
// if a subject ever writes there. The pane rides a private tmux socket (`-L c8`);
// the cmux desktop is untouched.
//
//   bun q6-summon.ts [account]

import { mkdirSync } from "node:fs";
import { readLog } from "../../engine/log.ts";
import { fold } from "../../engine/replay.ts";
import { invariants } from "../../engine/invariants.ts";
import { isRefusal } from "../../engine/refusal.ts";
import { readTranscript, transcriptPath, transcriptRows } from "../../engine/transcript.ts";
import { open, task, REPORT_RULE } from "./drill.ts";
import { ACCOUNTS, ALL, type Account } from "./accounts.ts";
import { RUNS } from "./meter.ts";

const account = (process.argv[2] ?? "personal") as Account;
if (!ALL.includes(account)) throw new Error(`unknown account ${account}`);

const HEADLESS = "HEADLESS-C8-ALPHA";
const HAND = "TERMINAL-C8-BRAVO";
const SOCKET = "c8";
const VENUE = `${RUNS}/venue/${account}`;
mkdirSync(VENUE, { recursive: true });

const tmux = async (...args: string[]) => {
	const p = Bun.spawn(["tmux", "-L", SOCKET, ...args], { stdout: "pipe", stderr: "pipe" });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	await p.exited;
	return { out, err };
};
const pane = async () => (await tmux("capture-pane", "-p", "-t", "q6")).out;

// ── turn 1, headless: the step pauses because only a human can answer ─────────
const opened = open({
	drill: `q6-summon-${account}`, account, workDir: VENUE, summonable: true,
	flow: {
		id: "q6summon", name: "summon round trip", budget: 4,
		steps: [task("trip",
			`Remember this codeword exactly: ${HEADLESS}. You are preparing a release announcement, ` +
			`but the release NAME has not been given to you and you must not invent one. ` +
			`Ask for the release name. ${REPORT_RULE}`)],
	},
});
if (isRefusal(opened)) throw new Error(opened.refusal);
const { run, runDir, conditions } = opened;
if (isRefusal(run.bless())) throw new Error("bless refused");
await run.run();

const paused = run.state().steps.trip;
if (paused?.at !== "paused" || paused.sessionId === null)
	throw new Error(`turn 1 did not pause with a session id: ${paused?.at}`);
const sid = paused.sessionId;
const tPath = transcriptPath(ACCOUNTS[account], VENUE, sid);

console.log(`# q6-summon-${account} · ${conditions.at} · load ${conditions.load}`);
console.log(`1. headless ignite -> ${paused.at} ‹${paused.causes.join(", ")}›`);
console.log(`   session ${sid} · venue ${VENUE}`);
console.log(`   asked: ${paused.detail.slice(0, 100)}`);
const rowsAfterHeadless = transcriptRows(tPath);
console.log(`   transcript rows ${rowsAfterHeadless}`);

// ── the summon: a real TUI on a private socket, resuming that session ─────────
await tmux("kill-server");
await tmux("new-session", "-d", "-s", "q6", "-x", "200", "-y", "50", "-c", VENUE,
	"env", "-i", `HOME=${process.env.HOME}`, `USER=${process.env.USER}`, "SHELL=/bin/zsh",
	`PATH=${process.env.PATH}`, "LANG=en_US.UTF-8", "TMPDIR=/private/tmp/",
	`CLAUDE_CONFIG_DIR=${ACCOUNTS[account]}`,
	`${process.env.HOME}/.local/bin/claude`, "--resume", sid, "--model", "sonnet", "--effort", "low");

let rendered = false;
for (let i = 0; i < 60 && !rendered; i++) { await Bun.sleep(1000); rendered = (await pane()).includes(HEADLESS); }
const shot = await pane();
console.log(`\n2. summoned to a real TUI (tmux -L ${SOCKET})`);
console.log(`   HISTORY RENDERED: the headless codeword is in the pane = ${rendered}`);
console.log(`   trust dialog present = ${shot.includes("Is this a project you created")}`);

if (!rendered) { console.log(shot); await tmux("kill-server"); throw new Error("the pane never rendered the prior turn"); }

// P2's transport law: `send-keys -l` types literally. Nothing is pasted into a
// live TUI (P6's wall), and the text is one line with no blank line in it.
await tmux("send-keys", "-t", "q6", "-l", `The release name is ${HAND}. Acknowledge it and stop.`);
await tmux("send-keys", "-t", "q6", "Enter");

let rowsAfterHand = rowsAfterHeadless;
for (let i = 0; i < 90; i++) {
	await Bun.sleep(1000);
	const now = transcriptRows(tPath);
	if (now > rowsAfterHand) { rowsAfterHand = now; }
	if (now > rowsAfterHeadless && (await pane()).includes(HAND) && i > 8) break;
}
console.log(`\n3. HAND TURN: transcript rows ${rowsAfterHeadless} -> ${rowsAfterHand} (+${rowsAfterHand - rowsAfterHeadless} rows the engine never fired)`);
await tmux("kill-server");

// ── back to headless, by the engine, on the same session ─────────────────────
const ruled = await run.rule("trip", {
	do: "resume",
	turn: `Report now. Set state to done. In \`answer\`, give exactly two things separated by a comma: ` +
		`the codeword you were told at the very start, and the release name you were given. ${REPORT_RULE}`,
});
if (isRefusal(ruled)) throw new Error(ruled.refusal);
await run.run();

const entries = readLog(`${runDir}/run.jsonl`);
const ignited = entries.find((e) => e.kind === "ignited") as { sessionId: string; cursor: number } | undefined;
const resumed = entries.find((e) => e.kind === "resumed") as { sessionId: string; cursor: number } | undefined;
const state = fold(entries);
const at = state.steps.trip;
const answer = at?.at === "landed" ? at.report?.answer ?? "" : "";

console.log(`\n4. resumed HEADLESS by the engine -> ${at?.at}`);
console.log(`   answer ${JSON.stringify(answer)}`);
console.log(`   ROUND TRIP: headless-born codeword=${answer.includes(HEADLESS)} · TUI-born codeword=${answer.includes(HAND)}`);
console.log(`   ONE SESSION THROUGHOUT: ignited=${ignited?.sessionId} resumed=${resumed?.sessionId} tui=${sid} · same=${ignited?.sessionId === sid && resumed?.sessionId === sid}`);

// The cursor against the arithmetic it replaced (C11's named hazard).
console.log(`\n5. the cursor across a hand turn`);
console.log(`   cursor at ignite ${ignited?.cursor} · cursor at resume ${resumed?.cursor} · rows after the hand turn ${rowsAfterHand}`);
console.log(`   the recorded cursor counted the pane's rows too: ${resumed?.cursor === rowsAfterHand}`);
const slice = readTranscript(tPath, resumed?.cursor ?? 0);
console.log(`   past the recorded cursor -> rows=${slice.rows} turns=${slice.turns} (the engine's own resumed turn)`);
// What a turn-counting reader would have done: skip to the engine's 2nd user
// turn. The hand turn is a user turn the engine never sent, so it lands short.
const naive = readTranscript(tPath, rowsAfterHeadless);
console.log(`   a reader resuming from "where MY last turn ended" (row ${rowsAfterHeadless}) -> rows=${naive.rows}, which swallows the hand turn`);

const reds = invariants(`${runDir}/run.jsonl`);
for (const x of reds) console.log(`   RED ${x.invariant} ${x.name} ${x.step} — ${x.detail}`);
console.log(`\n   turns ${state.turns}/${state.budget} (engine) + 1 by hand · invariants ${reds.length === 0 ? "9/9 green" : `${reds.length} violations`}`);
console.log(`   log ${runDir}/run.jsonl`);
