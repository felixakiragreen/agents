#!/usr/bin/env bun
// Q4 — kill and survive on real bytes. Three cut classes, ≥3 runs each.
//
//   A  the SUBJECT is SIGKILLed mid-turn, the engine alive. The stream is torn,
//      the engine reads ‹dead›, and a ruling resumes the same session — C4 F7's
//      resumability, driven by the engine rather than by a probe script.
//
//   B  the ENGINE is SIGKILLed mid-turn, the subject left running. The stream
//      file is the subject's, not the dead parent's (C6 F2, ruled), so the
//      orphan finishes writing a complete turn onto disk and the restart adopts
//      it from the stream. This is the case layer 0 could only simulate.
//
//   C  BOTH are killed. The stream is torn AND its reader is gone, so the
//      restart falls to the transcript — read past the cursor the log recorded
//      at spawn (C11). This is the seam C11 built, on real bytes, for the first
//      time. C11 F2 says the fallback can call a tool that merely failed a
//      denial: every C-class pause is checked against the stream's own
//      `permission_denials[]` and a false ask is recorded as its own event.
//
// Exactly-once is a spend property here: a double ignition is a double bill, so
// every run counts ignitions per step across BOTH processes' entries in the one
// log, and the nine invariants judge it.
//
//   bun q4-kill.ts <A|B|C> [account] [runs]

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { readLog, type Entry } from "../../engine/log.ts";
import { fold, verdicts } from "../../engine/replay.ts";
import { invariants } from "../../engine/invariants.ts";
import { CRASH_AT } from "../../engine/crash.ts";
import { senseFile } from "../../engine/sense.ts";
import { streamPath } from "../../engine/spawn.ts";
import { isRefusal } from "../../engine/refusal.ts";
import { load } from "../../engine/engine.ts";
import { venueOn, ALL, type Account } from "./accounts.ts";
import { SCRATCH, task, REPORT_RULE } from "./drill.ts";
import { RUNS } from "./meter.ts";

const CHILD = new URL("./child.ts", import.meta.url).pathname;

const klass = (process.argv[2] ?? "A").toUpperCase();
const account = (process.argv[3] ?? "personal") as Account;
const runs = Number(process.argv[4] ?? 3);
if (!ALL.includes(account)) throw new Error(`unknown account ${account}`);

/** A turn long enough to be cut in the middle of, and cheap: one Bash call that
 *  sleeps. Bash is granted under `auto` (measured, q5). */
const slow = (seconds: number) =>
	`Use the Bash tool to run this exact command: \`sleep ${seconds}; echo LATE\`. ` +
	`Then report what it printed. ${REPORT_RULE}`;

/** Two steps: the one that gets cut, and one after it, so the restart has to
 *  both resolve the cut turn AND carry the flow forward. */
const FLOW = {
	id: "q4cut", name: "a turn to cut, and a step that must still follow it", budget: 6,
	steps: [
		task("cut", slow(12)),
		task("after", `Create a file named after.txt in your current working directory containing exactly the line AFTER. ${REPORT_RULE}`, ["cut"]),
	],
};

type Setup = { runDir: string; workDir: string; flowPath: string };

function fresh(name: string): Setup {
	const runDir = `${RUNS}/${name}`;
	const workDir = `${SCRATCH}/${name}`;
	rmSync(runDir, { recursive: true, force: true });
	rmSync(workDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	mkdirSync(workDir, { recursive: true });
	const flowPath = `${runDir}/flow.json`;
	writeFileSync(flowPath, JSON.stringify(FLOW, null, 2) + "\n");
	writeFileSync(`${runDir}/conditions.json`, JSON.stringify({
		drill: name, account, class: klass, workDir,
		at: new Date().toISOString(), load: loadavg().map((n) => n.toFixed(2)).join(" "), concurrent: 1,
	}, null, 2) + "\n");
	return { runDir, workDir, flowPath };
}

const engine = (s: Setup, crashAt: string | null, bless: boolean) =>
	Bun.spawn([process.execPath, CHILD, s.runDir, s.workDir, account, ...(bless ? ["--bless"] : [])], {
		env: crashAt === null ? process.env : { ...process.env, [CRASH_AT]: crashAt },
		stdout: "pipe", stderr: "pipe",
	});

const settled = async (p: Bun.Subprocess) => {
	const [out, err, exit] = await Promise.all([
		new Response(p.stdout as ReadableStream).text(),
		new Response(p.stderr as ReadableStream).text(),
		p.exited,
	]);
	return { out, err, exit, signal: p.signalCode };
};

const alive = (pid: number) => { try { process.kill(pid, 0); return true; } catch { return false; } };

/** The subject pid the log recorded for a step's latest turn. */
function subjectPid(runDir: string, step: string): number | null {
	let pid: number | null = null;
	for (const e of readLog(`${runDir}/run.jsonl`))
		if ((e.kind === "ignited" || e.kind === "resumed") && e.step === step) pid = e.pid;
	return pid;
}

async function waitForPid(runDir: string, step: string, ms: number): Promise<number | null> {
	const deadline = Date.now() + ms;
	while (Date.now() < deadline) {
		const pid = subjectPid(runDir, step);
		if (pid !== null) return pid;
		await Bun.sleep(50);
	}
	return null;
}

/** Everything the log says about how the run ended, and whether it ended once. */
function judge(runDir: string) {
	const entries: Entry[] = readLog(`${runDir}/run.jsonl`);
	const ignitions: Record<string, number> = {};
	let transcriptSourced = 0;
	let cursorOfCut: number | null = null;
	for (const e of entries) {
		if (e.kind === "ignited" || e.kind === "resumed") ignitions[e.step] = (ignitions[e.step] ?? 0) + 1;
		if (e.kind === "ignited" && e.step === "cut") cursorOfCut = e.cursor;
		if (e.kind === "turn-ended" && e.sensed.source === "transcript") transcriptSourced++;
	}
	const state = fold(entries);
	return { entries, ignitions, transcriptSourced, cursorOfCut, state, verdicts: verdicts(state), reds: invariants(`${runDir}/run.jsonl`) };
}

console.log(`# q4 class ${klass} · ${account} · ${runs} runs · ${new Date().toISOString()}`);
let converged = 0;
let doubles = 0;

for (let i = 0; i < runs; i++) {
	const name = `q4-${klass}-${account}-${i}`;
	const s = fresh(name);
	let note = "";

	if (klass === "A") {
		// The engine stays alive; the subject is shot. Then a ruling resumes it.
		const run = load(s.flowPath, { runDir: s.runDir, venue: venueOn(account, s.workDir) });
		if (isRefusal(run)) throw new Error(run.refusal);
		if (isRefusal(run.bless())) throw new Error("bless refused");
		const driving = run.run();
		const pid = await waitForPid(s.runDir, "cut", 30_000);
		if (pid === null) throw new Error("the subject never recorded a pid");
		await Bun.sleep(4_000);                       // mid-turn, the sleep still running
		const wasAlive = alive(pid);
		process.kill(pid, "SIGKILL");
		await driving;

		const cutAt = run.state().steps.cut;
		note = `subject pid ${pid} alive-at-cut=${wasAlive} -> ${cutAt?.at === "paused" ? `‹${cutAt.causes.join(", ")}›` : cutAt?.at}`;
		if (cutAt?.at === "paused") {
			const ruled = await run.rule("cut", { do: "resume", turn: `The previous attempt was interrupted. ${slow(1)}` });
			if (isRefusal(ruled)) throw new Error(ruled.refusal);
			await run.run();
		}
	} else {
		// The engine is cut the instant the subject is spawned and recorded.
		const crashed = await settled(engine(s, "after-ignite:cut", true));
		const pid = subjectPid(s.runDir, "cut");
		note = `engine exit=${crashed.exit} signal=${crashed.signal} · subject pid ${pid}`;

		if (klass === "C" && pid !== null && alive(pid)) process.kill(pid, "SIGKILL");
		// B: let the orphan finish onto disk. C: it is already gone.
		if (klass === "B") { while (pid !== null && alive(pid)) await Bun.sleep(250); }

		await settled(engine(s, null, false));        // the restart
	}

	const j = judge(s.runDir);
	const landedAll = FLOW.steps.every((st) => j.state.steps[st.id]?.at === "landed");
	const doubled = Object.entries(j.ignitions).filter(([, n]) => n > 1 && klass !== "A");
	if (landedAll && j.reds.length === 0) converged++;
	if (doubled.length > 0) doubles++;

	const cutStream = senseFile(streamPath(s.runDir, "cut", 0), "auto");
	console.log(`\n  run ${i} ${name}`);
	console.log(`    ${note}`);
	console.log(`    cut turn 0 stream: results=${cutStream.results} dead=${cutStream.dead} denials=${cutStream.denials.length} cursor-at-spawn=${j.cursorOfCut}`);
	console.log(`    turn-ended from transcript: ${j.transcriptSourced}`);
	console.log(`    verdicts ${JSON.stringify(j.verdicts)}`);
	console.log(`    ignitions ${JSON.stringify(j.ignitions)} · all landed ${landedAll}`);
	for (const x of j.reds) console.log(`    RED ${x.invariant} ${x.name} ${x.step} — ${x.detail}`);
	console.log(`    invariants ${j.reds.length === 0 ? "9/9 green" : `${j.reds.length} violations`}`);

	// C11 F2 live: a transcript-sourced pause that names a permission nobody refused.
	if (j.transcriptSourced > 0) {
		const paused = j.state.steps.cut;
		const asks = paused?.at === "paused" && paused.causes.includes("needs-⬡ permission");
		console.log(`    C11 F2 check: transcript fallback asked for permission=${asks} · the stream's own denials=${cutStream.denials.length}` +
			`${asks && cutStream.denials.length === 0 ? "  *** FALSE ASK — a permission nobody refused ***" : ""}`);
	}
}

console.log(`\n  class ${klass}: ${converged}/${runs} converged to all-landed with 9/9 green · double ignitions ${doubles}`);
