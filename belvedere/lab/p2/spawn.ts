/**
 * P2 — the spawn recipe.  Seed of Belvedere's Hands organ.
 *
 * One fire = one cmux workspace + one claude session + the summons already
 * landed as the first user turn.  No fire-then-paste gap.
 *
 * The shape that survived the probes (see the brief's Findings, S-series):
 *
 *   1. write the sanitized summons to a file             (never typed)
 *   2. `workspace create --command '<one-line launch>'`  (cmux waits for the shell)
 *   3. the launch reads the file:  claude ... "$(cat <file>)"
 *   4. colour the workspace over the socket              (not a `/color` turn)
 *
 * Rejected shapes, and why — every one of these is a probe that failed:
 *   · `paste-buffer` into a live claude TUI  — splits at the first blank line
 *     and auto-submits paragraph 1 (finding S2).
 *   · a heredoc typed line-by-line into the shell — races shell startup, and
 *     the tab in the body fires completion (finding S3).
 *   · `cmux send` for the summons body — expands literal \n \t \r (finding T2).
 */

import { sanitizePromptForPty } from "./sanitize.ts";

const ACCOUNTS = {
	personal: "~/.claude",
	"thg-fgreen": "~/.claude-thg-fgreen",
	"thg-doorbell": "~/.claude-thg-doorbell",
} as const;

export type Account = keyof typeof ACCOUNTS;

export interface SpawnRequest {
	account: Account;
	/** Stamp: `<mantle>-<theater>-<NN>` (canon rows 13/14). Names the session and the workspace. */
	name: string;
	cwd: string;
	model: string;
	effort: string;
	/** cmux named colour — Red, Blue, Green, … (workspace-action set-color). */
	color: string;
	summons: string;
	/** Where the summons file is written. Caller owns the directory. */
	summonsDir: string;
	/** Resume an existing session instead of starting a new one. */
	resume?: string;
}

export type SpawnResult =
	| { ok: true; workspace: string; summonsPath: string; command: string }
	| { ok: false; error: string };

/** Single-quote for the shell, closing over embedded quotes. */
function shellQuote(value: string): string {
	return `'${value.replaceAll("'", "'\\''")}'`;
}

async function cmux(...args: string[]): Promise<{ ok: boolean; out: string }> {
	const p = Bun.spawn(["cmux", ...args], {
		env: { ...process.env, CMUX_QUIET: "1" },
		stdout: "pipe",
		stderr: "pipe",
	});
	const [out, err] = await Promise.all([
		new Response(p.stdout).text(),
		new Response(p.stderr).text(),
	]);
	const code = await p.exited;
	return { ok: code === 0, out: (out + err).trim() };
}

/** `OK workspace:3` → `workspace:3` */
function parseRef(out: string): string | null {
	return out.match(/\b((?:workspace|surface):\d+)\b/)?.[1] ?? null;
}

export function buildLaunchCommand(
	req: SpawnRequest,
	summonsPath: string,
): string {
	const configDir = ACCOUNTS[req.account];
	const flags = [
		"--model",
		req.model,
		"--effort",
		req.effort,
		"-n",
		req.name,
	];
	if (req.resume) flags.push("--resume", req.resume);
	// The summons travels by file, so the command stays one line: nothing
	// multi-line is ever typed at a shell prompt.
	return `CLAUDE_CONFIG_DIR=${configDir} claude ${flags.join(" ")} "$(cat ${shellQuote(summonsPath)})"`;
}

export async function spawn(req: SpawnRequest): Promise<SpawnResult> {
	if (!(req.account in ACCOUNTS)) {
		return { ok: false, error: `unknown account: ${req.account}` };
	}

	const summonsPath = `${req.summonsDir}/${req.name}.summons.txt`;
	await Bun.write(summonsPath, sanitizePromptForPty(req.summons));

	const command = buildLaunchCommand(req, summonsPath);

	const created = await cmux(
		"workspace",
		"create",
		"--name",
		req.name,
		"--cwd",
		req.cwd,
		"--focus",
		"false",
		"--command",
		command,
	);
	if (!created.ok) return { ok: false, error: `workspace create: ${created.out}` };

	const workspace = parseRef(created.out);
	if (!workspace) {
		return { ok: false, error: `no workspace ref in: ${created.out}` };
	}

	// Colour is a cmux property, not a `/color` turn — the socket sets it
	// directly, so the session's first user turn stays the summons.
	const colored = await cmux(
		"workspace-action",
		"--workspace",
		workspace,
		"--action",
		"set-color",
		"--color",
		req.color,
	);
	if (!colored.ok) return { ok: false, error: `set-color: ${colored.out}` };

	return { ok: true, workspace, summonsPath, command };
}

/** Read a spawned workspace's screen — the verification channel. */
export async function readScreen(
	workspace: string,
	lines = 60,
): Promise<string> {
	const r = await cmux(
		"read-screen",
		"--workspace",
		workspace,
		"--scrollback",
		"--lines",
		String(lines),
	);
	return r.out;
}
