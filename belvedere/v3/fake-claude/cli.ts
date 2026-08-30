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
import { runAct, type Session, type Sink } from "./run.ts";
import { driveStdin } from "./stdin.ts";

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
	? await runAct(session, firstAct, { text: argv.prompt!, queued: 0, first: true }, out, tx)
	: await driveStdin(session, firstAct, out, tx);

if (isRefusal(outcome)) die(outcome.refusal);
if (outcome.kind === "hung") await new Promise(() => setInterval(() => {}, 1 << 30));
if (outcome.kind === "died") {
	if (outcome.signal !== null) process.kill(process.pid, outcome.signal);
	process.exit(outcome.exit ?? 1);
}
process.exit(0);
