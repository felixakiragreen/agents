// The spawn adapter — the one place that knows what a subject IS. Everything
// above it works in steps, sessions and readings; C8 adds `{real: …}` here and
// nowhere else.
//
// Two laws of the clean room ride in this file (C4 F0): the subject gets the
// eight variables of `cleanEnv` and nothing inherited, and `HOME` is never
// overridden — `CLAUDE_CONFIG_DIR` selects the account, and overriding HOME
// breaks keychain OAuth.

import type { Fired } from "./flow.ts";
import { REPORT_SCHEMA, emptyReading, senseLine, type Reading } from "./sense.ts";
import { refuse, type Refusal } from "./refusal.ts";

/** Where a subject lives: the cwd it works in, the config dir that holds its
 *  transcript. For a fake subject the config dir is a sandbox; for a real one
 *  it is the account (C8). */
export type Venue = { workDir: string; configDir: string };

export type Spawned = {
	sessionId: string;
	pid: number;
	/** Resolves when the turn is over: read to EOF, or timed out and SIGTERMed. */
	settled: Promise<Reading>;
};

export type Ignition = {
	step: Fired;
	venue: Venue;
	prompt: string;
	/** A fresh session id, or the id of the session this turn resumes. */
	sessionId: string;
	resume: boolean;
};

const FAKE_CLI = new URL("../fake-claude/cli.ts", import.meta.url).pathname;

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

export function ignite(i: Ignition): Spawned | Refusal {
	const { scenario, seed } = i.step.subject.fake;
	const proc = Bun.spawn([process.execPath, FAKE_CLI, ...argvFor(i)], {
		cwd: i.venue.workDir,
		env: {
			...cleanEnv(i.venue.configDir),
			FAKE_CLAUDE_SCENARIO: new URL(`../fake-claude/scenarios/${scenario}.json`, import.meta.url).pathname,
			FAKE_CLAUDE_SEED: String(seed),
		},
		stdout: "pipe", stderr: "pipe",
	});
	if (proc.pid === undefined) return refuse(`step ${i.step.id}: the subject did not spawn`);

	return { sessionId: i.sessionId, pid: proc.pid, settled: read(proc, i.step.timeoutMs, i.step.posture) };
}

/**
 * Read the stream to EOF, then wait for the process — parse rule 1: the last
 * `result` is the turn's outcome, and "the process exited" is never the turn
 * boundary. The timeout is the step's own (law 6): SIGTERM, then dead.
 *
 * The pump is a named function, not an IIFE: bun narrows a variable captured by
 * one to its call-site value (C5 F6).
 */
async function read(proc: Bun.Subprocess<"ignore", "pipe", "pipe">, timeoutMs: number, asked: Fired["posture"]): Promise<Reading> {
	const reading = emptyReading(asked);
	const timer = setTimeout(() => { reading.timedOut = true; proc.kill("SIGTERM"); }, timeoutMs);

	async function pump(): Promise<void> {
		let rest = "";
		for await (const chunk of proc.stdout) {
			rest += new TextDecoder().decode(chunk);
			const lines = rest.split("\n");
			rest = lines.pop() ?? "";
			for (const line of lines) senseLine(reading, line);
		}
		if (rest !== "") senseLine(reading, rest);
	}

	try { await pump(); } finally { clearTimeout(timer); }
	reading.exit = await proc.exited;
	reading.signal = proc.signalCode ?? null;
	return reading;
}
