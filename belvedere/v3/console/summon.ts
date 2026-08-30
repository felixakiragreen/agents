// The summon — a headless session materialized in a real terminal, and the mark
// that says one was.
//
// D20's fallback: the Chat is the primary viewport, the terminal is where a
// session goes when a human wants to sit in front of it. C8 F7 proved the round
// trip lossless on real bytes — the pane renders the headless history, the hand
// turn appends rows the engine never fired, and the recorded cursor absorbs
// them on the way back.
//
// Two facts this file is built on, both measured (C8 F2, C4 F0):
//
//  - **The command is `env -i` plus the clean room's variables and the real
//    binary addressed from HOME.** `claude` on PATH is the cmux shim, and a
//    session summoned through it is not the session the engine spawned.
//  - **The pane needs a trusted cwd.** The workspace-trust dialog is the TUI's
//    and only `-p` skips it, so a session born in an untrusted cwd is summonable
//    only into a dialog. The console does not read the trust file — it does the
//    honest thing instead and *looks at the pane it just made*, which is a
//    measurement rather than a second copy of a policy that lives in the account's
//    own `.claude.json`. All three accounts trust `~/code/agents` (C8 F2), so a
//    warm venue inside the fence exists without touching a live config dir.
//
// **The mark is the console's, never the engine's.** A summon is not a
// transition — the run log records what the engine did, and the engine did not
// do this. So it lands in `summoned.jsonl` beside the log: append-only, the same
// shape as everything else on this campaign, and invisible to `replay()` and to
// the nine invariants.

import { appendFileSync, existsSync, readFileSync } from "node:fs";
import type { Venue } from "../engine/spawn.ts";

/** The private socket the console's panes live on. Never the cmux desktop —
 *  that is Felix's own screen (the building's working agreements). */
export const SOCKET = "v3";

/** The clean room's binary, relative to HOME (C4 F0). Never resolved from PATH. */
const REAL_CLI = ".local/bin/claude";

export type Summons = {
	step: string;
	sessionId: string;
	model: string;
	effort: string;
	venue: Venue;
};

/** A null `sessionId` closes an open mark: the step came back under the engine. */
export type Mark = { step: string; sessionId: string | null; at: string; pane: string | null };

/**
 * `env -i` and the eight variables of the clean room, then the binary and the
 * resume. Returned as argv — the caller prints it or spawns it, and the two can
 * never drift apart because there is one of them.
 */
export function summonArgv(s: Summons): string[] {
	const env = process.env;
	return [
		"env", "-i",
		`HOME=${env.HOME ?? ""}`,
		`USER=${env.USER ?? ""}`,
		`SHELL=${env.SHELL ?? "/bin/zsh"}`,
		`PATH=${env.PATH ?? "/usr/bin:/bin"}`,
		`LANG=${env.LANG ?? "en_US.UTF-8"}`,
		`TMPDIR=${env.TMPDIR ?? "/tmp/"}`,
		`CLAUDE_CONFIG_DIR=${s.venue.configDir}`,
		`${env.HOME ?? ""}/${REAL_CLI}`,
		"--resume", s.sessionId,
		"--model", s.model,
		"--effort", s.effort,
	];
}

/** The line a human types. Shell-quoted, because a venue path with a space in
 *  it must paste back exactly as it was printed. */
export const summonCommand = (s: Summons): string =>
	`cd ${shellQuote(s.venue.workDir)} && ${summonArgv(s).map(shellQuote).join(" ")}`;

const shellQuote = (word: string): string =>
	/^[A-Za-z0-9_@%+=:,./-]+$/.test(word) ? word : `'${word.split("'").join(`'\\''`)}'`;

// ── the tmux pane ────────────────────────────────────────────────────────────

const tmux = async (...args: string[]): Promise<string> => {
	const p = Bun.spawn(["tmux", "-L", SOCKET, ...args], { stdout: "pipe", stderr: "pipe" });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	await p.exited;
	return p.exitCode === 0 ? out : `${out}${err}`;
};

export const paneName = (run: string, step: string): string =>
	`${run}-${step}`.replace(/[^A-Za-z0-9_-]/g, "-");

/** Start the pane detached and hand back its name. Detached on purpose: the
 *  console never takes over the caller's terminal — it prints the attach line
 *  and lets the human decide when to sit down. */
export async function openPane(name: string, s: Summons): Promise<string> {
	await tmux("kill-session", "-t", name);
	return tmux("new-session", "-d", "-s", name, "-x", "200", "-y", "50", "-c", s.venue.workDir, ...summonArgv(s));
}

export const capturePane = (name: string): Promise<string> => tmux("capture-pane", "-p", "-t", name);

/** What the pane is showing, in the two terms that decide whether the summon
 *  worked: the prior turn rendered, or the trust dialog stopped it (C8 F7). */
export async function paneReady(name: string, expect: string, seconds: number): Promise<{ rendered: boolean; dialog: boolean; shot: string }> {
	let shot = "";
	for (let i = 0; i < seconds; i++) {
		shot = await capturePane(name);
		if (shot.includes(expect)) break;
		await Bun.sleep(1000);
	}
	return { rendered: shot.includes(expect), dialog: shot.includes("Is this a project you created"), shot };
}

// ── the mark ─────────────────────────────────────────────────────────────────

const markPath = (runDir: string): string => `${runDir}/summoned.jsonl`;

export function markSummoned(runDir: string, mark: Mark): void {
	appendFileSync(markPath(runDir), JSON.stringify(mark) + "\n");
}

/** The steps standing summoned: marked, and not since returned. A `return`
 *  writes a null session id, which closes the mark the same way a landing
 *  closes a step — one file, read forward, last word wins. */
export function summoned(runDir: string): Map<string, Mark> {
	const open = new Map<string, Mark>();
	const path = markPath(runDir);
	if (!existsSync(path)) return open;
	for (const line of readFileSync(path, "utf8").split("\n")) {
		if (line === "") continue;
		let mark: Mark;
		try { mark = JSON.parse(line) as Mark; } catch { continue; }
		if (mark.sessionId === null) open.delete(mark.step);
		else open.set(mark.step, mark);
	}
	return open;
}

export function markReturned(runDir: string, step: string): void {
	appendFileSync(markPath(runDir), JSON.stringify({ step, sessionId: null, at: new Date().toISOString(), pane: null }) + "\n");
}
