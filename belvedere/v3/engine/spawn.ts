// The spawn adapter — the one place that knows what a subject IS. Everything
// above it works in steps, sessions and readings; the two arms differ by a
// program and an environment, and by nothing else.
//
// Two laws of the clean room ride in this file (C4 F0): the subject gets the
// eight variables of `cleanEnv` and nothing inherited, and `HOME` is never
// overridden — `CLAUDE_CONFIG_DIR` selects the account, and overriding HOME
// breaks keychain OAuth. A third rides the real arm: the binary is
// `~/.local/bin/claude` by construction, never whatever `claude` resolves to on
// PATH — that is the cmux shim, and a subject spawned through it is not in a
// clean room at all.
//
// **The stream is state** (C6 F2, ruled 2026-08-30). A turn's stdout goes to a
// file the child owns, never a pipe: the fd outlives the engine that opened it,
// so a turn that finished while the engine was dead can still be read as the
// landing it was. Sensing tails that file rather than a pipe.

import { closeSync, mkdirSync, openSync, readSync } from "node:fs";
import { dirname } from "node:path";
import { StringDecoder } from "node:string_decoder";
import type { Fired, FakeSubject } from "./flow.ts";
import { REPORT_SCHEMA, emptyReading, senseLine, type Reading } from "./sense.ts";
import { isRefusal, refuse, type Refusal } from "./refusal.ts";

/** Where a subject lives: the cwd it works in, the config dir that holds its
 *  transcript. For a fake subject the config dir is a sandbox; for a real one
 *  it is the account (C8). */
export type Venue = { workDir: string; configDir: string };

export type Spawned = {
	sessionId: string;
	pid: number;
	/** Resolves when the turn is over: the stream read to the process's end, or
	 *  timed out and SIGTERMed. */
	settled: Promise<Reading>;
};

export type Ignition = {
	step: Fired;
	venue: Venue;
	prompt: string;
	/** A fresh session id, or the id of the session this turn resumes. */
	sessionId: string;
	resume: boolean;
	/** This turn's stream file. The child owns the fd (`streamPath`). */
	stream: string;
};

const FAKE_CLI = new URL("../fake-claude/cli.ts", import.meta.url).pathname;

/** The clean room's binary, relative to HOME (C4 F0). Never resolved from PATH. */
const REAL_CLI = ".local/bin/claude";

/** How often the tail looks for new bytes. Small enough that a pause cause
 *  surfaces well within one engine tick (invariant 5). */
const TAIL_MS = 10;

/**
 * Where one turn's stdout lands: one file per step per turn, named by the turn
 * index the log already carries (`spent`). Derived, never recorded — the run
 * dir and the log together name it, so no event has to.
 */
export const streamPath = (runDir: string, stepId: string, turn: number): string =>
	`${runDir}/streams/${stepId}.t${turn}.jsonl`;

/** stderr's own file beside the stream: a refusal from the binary is a
 *  diagnostic the barrage's reds want, and a pipe nobody reads loses it. */
const stderrPath = (stream: string): string => stream.replace(/\.jsonl$/, ".err");

/** The eight variables of C4's clean room. HOME is passed through, never set. */
function cleanEnv(configDir: string): Record<string, string> {
	const env = process.env;
	return {
		HOME: env.HOME ?? "", USER: env.USER ?? "", SHELL: env.SHELL ?? "/bin/zsh",
		PATH: env.PATH ?? "/usr/bin:/bin", LANG: env.LANG ?? "en_US.UTF-8",
		TMPDIR: env.TMPDIR ?? "/tmp/", CLAUDE_CONFIG_DIR: configDir,
	};
}

/** The argv the engine speaks — grammar §10's rules 5 and 7 are flags here:
 *  the engine chooses the session id, and declares the report schema. */
export function argvFor(i: Ignition): string[] {
	return [
		"-p", i.prompt,
		i.resume ? "--resume" : "--session-id", i.sessionId,
		"--model", i.step.model,
		"--effort", i.step.effort,
		"--permission-mode", i.step.posture,
		"--json-schema", REPORT_SCHEMA,
		"--output-format", "stream-json",
		"--verbose",
	];
}

/** All the two subject arms differ by: what to exec, and what the clean room's
 *  eight variables are joined by. `argvFor` is the same either way — it has
 *  spoken the real flags since C5. */
type Program = { command: string[]; env: Record<string, string> };

const fakeProgram = (fake: FakeSubject): Program => ({
	command: [process.execPath, FAKE_CLI],
	env: {
		FAKE_CLAUDE_SCENARIO: new URL(`../fake-claude/scenarios/${fake.scenario}.json`, import.meta.url).pathname,
		FAKE_CLAUDE_SEED: String(fake.seed),
	},
});

/** The real arm: `cleanEnv` alone — no `FAKE_*` variables reach a real subject
 *  — and the binary named from HOME, which `cleanEnv` passes through and never
 *  overrides. An absent HOME is refused rather than spawned from `/`. */
function realProgram(): Program | Refusal {
	const home = process.env.HOME;
	if (home === undefined || home === "")
		return refuse(`HOME is unset, and the real binary is addressed as ~/${REAL_CLI} (C4 F0)`);
	return { command: [`${home}/${REAL_CLI}`], env: {} };
}

export function ignite(i: Ignition): Spawned | Refusal {
	const subject = i.step.subject;
	const program = "fake" in subject ? fakeProgram(subject.fake) : realProgram();
	if (isRefusal(program)) return refuse(`step ${i.step.id}: ${program.refusal}`);

	mkdirSync(dirname(i.stream), { recursive: true });
	// Opened by the parent, owned by the child: closed here the instant the
	// spawn has its own copy, so nothing the engine holds keeps the file live.
	const out = openSync(i.stream, "w");
	const err = openSync(stderrPath(i.stream), "w");
	let proc: Bun.Subprocess;
	try {
		proc = Bun.spawn([...program.command, ...argvFor(i)], {
			cwd: i.venue.workDir,
			env: { ...cleanEnv(i.venue.configDir), ...program.env },
			stdout: out, stderr: err,
		});
	} finally {
		closeSync(out);
		closeSync(err);
	}
	if (proc.pid === undefined) return refuse(`step ${i.step.id}: the subject did not spawn`);

	return { sessionId: i.sessionId, pid: proc.pid, settled: tail(proc, i.stream, i.step.timeoutMs, i.step.posture) };
}

/**
 * Tail the stream file until the process is gone, then read what is left —
 * parse rule 1: the last `result` is the turn's outcome, and "the process
 * exited" is never the turn boundary. The timeout is the step's own (law 6):
 * SIGTERM, then dead.
 *
 * Reading a file rather than a pipe changes one thing and it is the point: what
 * this function sees, a restart can see too.
 */
async function tail(proc: Bun.Subprocess, stream: string, timeoutMs: number, asked: Fired["posture"]): Promise<Reading> {
	const reading = emptyReading(asked);
	const timer = setTimeout(() => { reading.timedOut = true; proc.kill("SIGTERM"); }, timeoutMs);

	const fd = openSync(stream, "r");
	const decoder = new StringDecoder("utf8");
	const buf = Buffer.alloc(64 * 1024);
	let rest = "";

	/** Every whole line written since the last look. A partial line waits: the
	 *  writer appends whole lines, and half of one parses as nothing. */
	function drain(): void {
		for (;;) {
			const n = readSync(fd, buf, 0, buf.length, null);
			if (n === 0) break;
			rest += decoder.write(buf.subarray(0, n));
			const lines = rest.split("\n");
			rest = lines.pop() ?? "";
			for (const line of lines) senseLine(reading, line);
		}
	}

	// One timer reads the file, one await ends the turn. Racing `proc.exited`
	// against a sleep in a loop would do the same job and say it less plainly —
	// the turn is over when the process is over, and that is a thing to wait
	// for, not a thing to poll for.
	const ticker = setInterval(drain, TAIL_MS);
	try {
		reading.exit = await proc.exited;
	} finally {
		clearInterval(ticker);
		clearTimeout(timer);
	}
	drain();
	if (rest !== "") senseLine(reading, rest);
	closeSync(fd);

	reading.signal = proc.signalCode ?? null;
	return reading;
}
