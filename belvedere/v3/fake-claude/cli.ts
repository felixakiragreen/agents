#!/usr/bin/env bun
// The stand-in binary. The engine execs `bun cli.ts <claude-argv>` and gets
// C4's captured dialect back: events on stdout, a transcript on disk, an exit
// code — all of it scripted, seeded, and free.
//
//   FAKE_CLAUDE_SCENARIO=<path>   the script (required)
//   FAKE_CLAUDE_SEED=<n>          the id stream (default 1)
//   CLAUDE_CONFIG_DIR=<dir>       the write root; a real account dir refuses
//
// It resolves no `claude`, opens no socket, and reaches no network — the whole
// program is this directory.

import { readFileSync, existsSync } from "node:fs";
import { writeSync } from "node:fs";
import { parseArgv } from "./argv.ts";
import { writeRoot } from "./guard.ts";
import { parseScenario } from "./scenario.ts";
import { isRefusal } from "./refusal.ts";
import { ids } from "./ids.ts";
import { transcript, transcriptPath, priorTurns } from "./transcript.ts";
import { runAct, type Session, type Sink, type Turn } from "./run.ts";

/** Refusals leave by this door: a named reason on stderr, and exit 2. */
const REFUSED = 2;
function die(message: string): never {
	writeSync(2, `fake-claude: ${message}\n`);
	process.exit(REFUSED);
}

const env = process.env;

const root = writeRoot(env);
if (isRefusal(root)) die(root.refusal);

const scenarioPath = env.FAKE_CLAUDE_SCENARIO;
if (scenarioPath === undefined || scenarioPath === "") die("FAKE_CLAUDE_SCENARIO is unset — the fake has no script to run");
if (!existsSync(scenarioPath)) die(`FAKE_CLAUDE_SCENARIO ${scenarioPath} does not exist`);

const seed = Number(env.FAKE_CLAUDE_SEED ?? "1");
if (!Number.isFinite(seed)) die(`FAKE_CLAUDE_SEED ${env.FAKE_CLAUDE_SEED} is not a number`);

const scenario = parseScenario(readFileSync(scenarioPath, "utf8"), scenarioPath);
if (isRefusal(scenario)) die(scenario.refusal);

const argv = parseArgv(process.argv.slice(2));
if (isRefusal(argv)) die(argv.refusal);

if (argv.jsonSchema === null && scenario.acts.some((a) => a.steps.some((s) => s.do === "report")))
	die(`scenario ${scenario.name} reports its state, which needs --json-schema (grammar §5)`);

const cwd = process.cwd();
// Act indices are >= 0, so -1 is a stream of its own: the session id can never
// collide with an event uuid.
const sessionId = argv.sessionId ?? argv.resume ?? ids(seed, -1).uuid();
const txPath = transcriptPath(root, cwd, sessionId);
const firstAct = argv.resume === null ? 0 : priorTurns(txPath);
const tx = transcript(txPath);

/** stdout is the parent's view and may die with the parent (grammar §6). */
const out: Sink = {
	emit(event) {
		try { writeSync(1, JSON.stringify(event) + "\n"); }
		catch (e) { if ((e as NodeJS.ErrnoException).code !== "EPIPE") throw e; }
	},
};

const session: Session = { argv, scenario, sessionId, cwd, seed };

const outcome = argv.inputFormat === "argv"
	? await runAct(session, firstAct, { text: argv.prompt!, queued: 0 }, out, tx)
	: await driveStdin(session, out);

if (outcome.kind === "hung") await new Promise(() => setInterval(() => {}, 1 << 30));
if (outcome.kind === "died") {
	if (outcome.signal !== null) process.kill(process.pid, outcome.signal);
	process.exit(outcome.exit ?? 1);
}
process.exit(0);

/**
 * Arm B: one process, one JSON user message per stdin line. Turn 0 takes the
 * first line alone; every act after it takes everything queued. A driver that
 * paces on `result` therefore hands over one line at a time; one that writes
 * all its turns and closes gets them merged into a single turn — bytes whole,
 * turn boundaries destroyed (grammar §3's trap, reproduced).
 */
async function driveStdin(s: Session, sink: Sink): Promise<Awaited<ReturnType<typeof runAct>>> {
	const lines = stdinLines();
	const first = await lines.next();
	if (first === null) die("--input-format stream-json got no turns on stdin");

	let act = firstAct;
	let turn: Turn = { text: first, queued: 0 };
	while (true) {
		const outcome = await runAct(s, act, turn, sink, tx);
		if (outcome.kind !== "closed") return outcome;
		const batch = await lines.drain();
		if (batch.length === 0) return { kind: "closed" };
		act++;
		turn = { text: batch.join("\n"), queued: batch.length - 1 };
	}
}

/** A line queue over stdin: `next` waits for one, `drain` takes all pending. */
function stdinLines() {
	const queue: string[] = [];
	let buf = "";
	let closed = false;
	let wake: (() => void) | null = null;
	const push = (line: string) => {
		if (!line.trim()) return;
		let msg: { message?: { content?: unknown } };
		try { msg = JSON.parse(line); } catch { die(`stdin line is not JSON: ${line.slice(0, 80)}`); }
		queue.push(textOf(msg.message?.content));
	};
	(async () => {
		for await (const chunk of Bun.stdin.stream()) {
			buf += new TextDecoder().decode(chunk);
			let i;
			while ((i = buf.indexOf("\n")) >= 0) { push(buf.slice(0, i)); buf = buf.slice(i + 1); }
			wake?.();
		}
		push(buf);
		closed = true;
		wake?.();
	})();
	const settle = async () => {
		while (queue.length === 0 && !closed) await new Promise<void>((r) => { wake = r; });
		wake = null;
	};
	return {
		async next(): Promise<string | null> { await settle(); return queue.shift() ?? null; },
		async drain(): Promise<string[]> { await settle(); return queue.splice(0); },
	};
}

function textOf(content: unknown): string {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) die("stdin message has no user content");
	return content.map((b) => (typeof b === "object" && b !== null && "text" in b ? String((b as { text: unknown }).text) : "")).join("");
}
