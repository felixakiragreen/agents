// C4 clean-room subject launcher.
// The measuring session runs inside a cmux pane: `claude` on PATH is a cmux shim
// and ~40 CMUX_*/CLAUDE_CODE_* vars leak into any child. v3's engine will run in
// neither. Every subject therefore spawns from an explicit environment against
// the real binary, or the numbers are cmux's, not headless's.

import { mkdirSync, writeFileSync, appendFileSync } from "node:fs";

export const CLAUDE_BIN = "/Users/felix/.local/bin/claude";

export const ACCOUNTS = {
	personal:     "/Users/felix/.claude",
	"thg-fgreen": "/Users/felix/.claude-thg-fgreen",
	"thg-doorbell": "/Users/felix/.claude-thg-doorbell",
} as const;

export type Account = keyof typeof ACCOUNTS;

export const SCRATCH =
	"/private/tmp/claude-502/-Users-felix-code-agents/6902add3-501b-475a-9304-6df5b3bc8371/scratchpad/c4";

/** The whole environment a subject sees. Nothing inherited. */
export function cleanEnv(account: Account, extra: Record<string, string> = {}) {
	return {
		HOME: "/Users/felix",
		USER: "felix",
		SHELL: "/bin/zsh",
		PATH: "/Users/felix/.local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin",
		LANG: "en_US.UTF-8",
		TMPDIR: "/private/tmp/",
		CLAUDE_CONFIG_DIR: ACCOUNTS[account],
		...extra,
	};
}

export type RunOpts = {
	account: Account;
	cwd: string;
	args: string[];
	stdin?: string;
	env?: Record<string, string>;
	timeoutMs?: number;
};

export type RunResult = {
	code: number | null;
	signal: string | null;
	stdout: string;
	stderr: string;
	ms: number;
	argv: string[];
};

export async function run(o: RunOpts): Promise<RunResult> {
	mkdirSync(o.cwd, { recursive: true });
	const argv = [CLAUDE_BIN, ...o.args];
	const t0 = Date.now();
	const proc = Bun.spawn(argv, {
		cwd: o.cwd,
		env: cleanEnv(o.account, o.env),
		stdin: o.stdin === undefined ? "ignore" : new TextEncoder().encode(o.stdin),
		stdout: "pipe",
		stderr: "pipe",
	});
	const timer = o.timeoutMs
		? setTimeout(() => proc.kill("SIGKILL"), o.timeoutMs)
		: undefined;
	const [stdout, stderr] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
	]);
	const code = await proc.exited;
	if (timer) clearTimeout(timer);
	return {
		code,
		signal: proc.signalCode ?? null,
		stdout,
		stderr,
		ms: Date.now() - t0,
		argv,
	};
}

/** Every capture carries the conditions that produced it (charge: Method). */
export type Conditions = {
	capture: string;
	account: Account;
	model: string;
	effort: string;
	posture: string;
	cwdClass: string;
	task: string;
};

export function capture(c: Conditions, r: RunResult, extra: object = {}) {
	const dir = `${import.meta.dir}/captures/${c.capture}`;
	mkdirSync(dir, { recursive: true });
	writeFileSync(`${dir}/stdout.jsonl`, r.stdout);
	writeFileSync(`${dir}/stderr.txt`, r.stderr);
	writeFileSync(
		`${dir}/conditions.json`,
		JSON.stringify(
			{ ...c, ...extra, at: new Date().toISOString(), exit: r.code,
			  signal: r.signal, ms: r.ms, argv: r.argv, bin: CLAUDE_BIN,
			  load: loadavg() },
			null, 2,
		) + "\n",
	);
	appendFileSync(`${import.meta.dir}/captures/TURNS.log`,
		`${new Date().toISOString()}\t${c.capture}\t${c.account}\t${c.model}.${c.effort}\t${c.posture}\texit=${r.code}\t${r.ms}ms\n`);
	return dir;
}

function loadavg(): string {
	try {
		return require("node:os").loadavg().map((n: number) => n.toFixed(2)).join(" ");
	} catch { return "?"; }
}

/** Parse a stream-json stdout into events, tolerating a trailing partial line. */
export function events(stdout: string): any[] {
	return stdout.split("\n").filter(Boolean).flatMap((l) => {
		try { return [JSON.parse(l)]; } catch { return []; }
	});
}
