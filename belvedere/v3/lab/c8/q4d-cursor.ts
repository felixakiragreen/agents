#!/usr/bin/env bun
// Q4, class D — C11's cursor on real bytes, where it can actually be wrong.
//
// Class C cut a FIRST turn: the transcript held nothing, the cursor was 0, and a
// cursor-blind reader would have got the same answer. The cursor only earns its
// keep on a turn that has a predecessor in the file — so this drill:
//
//   1. runs a step to a complete turn 0 that pauses ‹needs-⬡ question›, leaving
//      a whole finished turn in the session's transcript;
//   2. rules it back into flight in a child engine armed to SIGKILL itself the
//      instant the resume is recorded — so the log carries a cursor > 0;
//   3. SIGKILLs the subject too, so the resumed turn's stream is torn and its
//      reader is gone: the restart has nothing but the transcript;
//   4. restarts, and asks the same file two ways — past the recorded cursor
//      (the engine's way) and from row 0 (the pre-C11 way).
//
// The two answers disagreeing on real bytes is the whole finding. C7 F3 is the
// defect; C11 is the fix; this is the first time either has been shown on bytes
// a real subject wrote.
//
//   bun q4d-cursor.ts [account] [runs]

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { readLog } from "../../engine/log.ts";
import { fold } from "../../engine/replay.ts";
import { invariants } from "../../engine/invariants.ts";
import { CRASH_AT } from "../../engine/crash.ts";
import { senseFile } from "../../engine/sense.ts";
import { streamPath } from "../../engine/spawn.ts";
import { readTranscript, transcriptPath, transcriptRows } from "../../engine/transcript.ts";
import { venueOn, ALL, type Account } from "./accounts.ts";
import { SCRATCH, task, REPORT_RULE } from "./drill.ts";
import { RUNS } from "./meter.ts";
import { ACCOUNTS } from "./accounts.ts";

const CHILD = new URL("./child.ts", import.meta.url).pathname;
const account = (process.argv[2] ?? "personal") as Account;
const runs = Number(process.argv[3] ?? 3);
if (!ALL.includes(account)) throw new Error(`unknown account ${account}`);

const ASK =
	"Write the deployment configuration file. Do not guess and do not create a placeholder: " +
	"the filename, the format and the target environment have not been given to you, and only " +
	`a human can supply them. ${REPORT_RULE}`;

const RESUME =
	"Use the Bash tool to run this exact command: `sleep 12; echo LATE`. " +
	`Then report what it printed. ${REPORT_RULE}`;

const FLOW = { id: "q4dcursor", name: "a turn with a predecessor in the transcript", budget: 4, steps: [task("cut", ASK)] };

const settled = async (p: Bun.Subprocess) => {
	const [out, err, exit] = await Promise.all([
		new Response(p.stdout as ReadableStream).text(),
		new Response(p.stderr as ReadableStream).text(), p.exited,
	]);
	return { out, err, exit, signal: p.signalCode };
};
const alive = (pid: number) => { try { process.kill(pid, 0); return true; } catch { return false; } };

console.log(`# q4 class D — the cursor on real bytes · ${account} · ${runs} runs · ${new Date().toISOString()}`);
let disagreed = 0, green = 0;

for (let i = 0; i < runs; i++) {
	const name = `q4-D-${account}-${i}`;
	const runDir = `${RUNS}/${name}`, workDir = `${SCRATCH}/${name}`;
	rmSync(runDir, { recursive: true, force: true });
	rmSync(workDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	mkdirSync(workDir, { recursive: true });
	writeFileSync(`${runDir}/flow.json`, JSON.stringify(FLOW, null, 2) + "\n");
	writeFileSync(`${runDir}/conditions.json`, JSON.stringify({
		drill: name, account, class: "D", workDir, at: new Date().toISOString(),
		load: loadavg().map((n) => n.toFixed(2)).join(" "), concurrent: 1,
	}, null, 2) + "\n");

	const child = (crashAt: string | null, args: string[]) =>
		Bun.spawn([process.execPath, CHILD, runDir, workDir, account, ...args], {
			env: crashAt === null ? process.env : { ...process.env, [CRASH_AT]: crashAt },
			stdout: "pipe", stderr: "pipe",
		});

	// 1. turn 0 — a whole finished turn that pauses without landing.
	await settled(child(null, ["--bless"]));
	const afterTurn0 = fold(readLog(`${runDir}/run.jsonl`)).steps.cut;
	const sid = afterTurn0?.at === "paused" ? afterTurn0.sessionId : null;
	if (sid === null) { console.log(`  run ${i}: turn 0 did not pause with a session id (${afterTurn0?.at}) — skipped`); continue; }
	const tPath = transcriptPath(ACCOUNTS[account], workDir, sid);
	const rowsBefore = transcriptRows(tPath);

	// 2+3. the resume, cut at the instant it is recorded; then the subject shot.
	const crashed = await settled(child("after-ignite:cut", ["--resume", "cut", RESUME]));
	let pid: number | null = null;
	for (const e of readLog(`${runDir}/run.jsonl`)) if (e.kind === "resumed" && e.step === "cut") pid = e.pid;
	if (pid !== null && alive(pid)) process.kill(pid, "SIGKILL");

	// 4. the restart: nothing but the transcript to answer with.
	await settled(child(null, []));

	const entries = readLog(`${runDir}/run.jsonl`);
	const resumed = entries.find((e) => e.kind === "resumed" && e.step === "cut") as { cursor: number } | undefined;
	const cursor = resumed?.cursor ?? -1;
	const sourced = entries.filter((e) => e.kind === "turn-ended" && e.sensed.source === "transcript").length;
	const state = fold(entries);
	const at = state.steps.cut;
	const reds = invariants(`${runDir}/run.jsonl`);
	const stream = senseFile(streamPath(runDir, "cut", 1), "auto");

	// The same file, two ways.
	const past = readTranscript(tPath, cursor);
	const fromZero = readTranscript(tPath, 0);

	console.log(`\n  run ${i} ${name}`);
	console.log(`    engine exit=${crashed.exit} signal=${crashed.signal} · resumed subject pid ${pid}`);
	console.log(`    transcript rows before the resume ${rowsBefore} · cursor recorded at resume ${cursor}`);
	console.log(`    resumed turn's stream (t1): results=${stream.results} dead=${stream.dead}`);
	console.log(`    turn-ended sourced from transcript: ${sourced}`);
	console.log(`    past the cursor  -> rows=${past.rows} complete=${past.complete} verdict=${past.verdict}`);
	console.log(`    from row 0       -> rows=${fromZero.rows} complete=${fromZero.complete} verdict=${fromZero.verdict}   ${JSON.stringify(fromZero.text.slice(0, 60))}`);
	console.log(`    the engine said  -> ${at?.at}${at?.at === "paused" ? ` ‹${at.causes.join(", ")}› ${at.detail}` : ""}`);
	console.log(`    invariants ${reds.length === 0 ? "9/9 green" : `${reds.length} violations`}`);
	for (const x of reds) console.log(`    RED ${x.invariant} ${x.name} ${x.step} — ${x.detail}`);

	if (past.verdict !== fromZero.verdict) { disagreed++; console.log(`    *** the cursor and row 0 DISAGREE: ${past.verdict} vs ${fromZero.verdict} — the cursor is right ***`); }
	if (reds.length === 0) green++;
}

console.log(`\n  class D: ${disagreed}/${runs} runs where the cursor and a row-0 read disagree · ${green}/${runs} invariants green`);
