// The gilder: spawns every scenario the way its `golden` block declares and
// records the stream it produced. `bun goldens.ts` checks the committed
// goldens; `bun goldens.ts --gild` rewrites them.
//
// The venue is a fixed path, not a mkdtemp: the cwd shows up in `init.cwd` and
// in the transcript path, so a random venue would make byte-identity
// impossible. It lives outside the repo and is rebuilt on every run.

import { mkdirSync, rmSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { parseScenario, type Scenario } from "./scenario.ts";
import { isRefusal } from "./refusal.ts";
import { transcriptPath } from "./transcript.ts";

export const HERE = import.meta.dir;
export const VENUE_ROOT = "/private/tmp/fake-claude-goldens";
const CLI = `${HERE}/cli.ts`;
const SIGNUM: Record<string, number> = { SIGKILL: 9, SIGTERM: 15 };
/** Long enough for a scenario to finish emitting, short enough to end a hang. */
const HANG_MS = 1500;

export const scenarioNames = (): string[] =>
	readdirSync(`${HERE}/scenarios`).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).sort();

export function loadScenario(name: string): Scenario {
	const path = `${HERE}/scenarios/${name}.json`;
	const s = parseScenario(readFileSync(path, "utf8"), path);
	if (isRefusal(s)) throw new Error(s.refusal);
	return s;
}

export const goldenPath = (name: string): string => `${HERE}/goldens/${name}.jsonl`;

export type Run = {
	stream: string;
	stderr: string;
	/** The shell's view: an exit code, or 128 + signal for a signalled death. */
	exit: number | null;
	configDir: string;
	cwd: string;
	sessionId: string;
	transcript: string;
};

/** The eight variables of C4's clean room, plus the fake's own two. */
function env(configDir: string, scenario: string, seed: number): Record<string, string> {
	return {
		HOME: "/Users/felix", USER: "felix", SHELL: "/bin/zsh",
		PATH: "/Users/felix/.local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin",
		LANG: "en_US.UTF-8", TMPDIR: "/private/tmp/",
		CLAUDE_CONFIG_DIR: configDir,
		FAKE_CLAUDE_SCENARIO: `${HERE}/scenarios/${scenario}.json`,
		FAKE_CLAUDE_SEED: String(seed),
	};
}

export async function runScenario(s: Scenario, seed = s.golden.seed): Promise<Run> {
	const root = `${VENUE_ROOT}/${s.name}`;
	const configDir = `${root}/config`, cwd = `${root}/venue`;
	rmSync(root, { recursive: true, force: true });
	mkdirSync(cwd, { recursive: true });
	const base = ["--output-format", "stream-json", "--verbose", ...s.golden.flags];
	const e = env(configDir, s.name, seed);

	const run = s.golden.mode === "argv"
		? await runArgv(s, cwd, e, base)
		: await runStdin(s, cwd, e, base);

	const sessionId = sessionIdOf(run.stream);
	const path = sessionId === "" ? "" : transcriptPath(configDir, cwd, sessionId);
	return {
		...run, configDir, cwd, sessionId,
		transcript: path !== "" && existsSync(path) ? readFileSync(path, "utf8") : "",
	};
}

/** Arm A: one process per turn, later turns addressed by --resume. */
async function runArgv(s: Scenario, cwd: string, e: Record<string, string>, base: string[]) {
	let stream = "", stderr = "", exit: number | null = 0, sid = "";
	for (const [i, turn] of s.golden.turns.entries()) {
		const args = i === 0 ? ["-p", turn, ...base] : ["-p", turn, "--resume", sid, ...base];
		const proc = Bun.spawn(["bun", CLI, ...args], { cwd, env: e, stdin: "ignore", stdout: "pipe", stderr: "pipe" });
		const kill = s.golden.expectExit === null ? setTimeout(() => proc.kill("SIGKILL"), HANG_MS) : undefined;
		const [out, err] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
		await proc.exited;
		if (kill !== undefined) clearTimeout(kill);
		stream += out; stderr += err;
		exit = s.golden.expectExit === null ? null : shellExit(proc);
		if (sid === "") sid = sessionIdOf(out);
	}
	return { stream, stderr, exit };
}

/** Arm B: one process, one JSON user message per stdin line. */
async function runStdin(s: Scenario, cwd: string, e: Record<string, string>, base: string[]) {
	const proc = Bun.spawn(["bun", CLI, "-p", "--input-format", "stream-json", ...base],
		{ cwd, env: e, stdin: "pipe", stdout: "pipe", stderr: "pipe" });
	const write = (text: string) =>
		proc.stdin.write(JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "text", text }] } }) + "\n");

	let sent = 0;
	if (s.golden.paced) { write(s.golden.turns[sent++]!); await proc.stdin.flush(); }
	else { for (const t of s.golden.turns) write(t); sent = s.golden.turns.length; await proc.stdin.flush(); proc.stdin.end(); }

	let stream = "", buf = "";
	const reader = proc.stdout.getReader(), dec = new TextDecoder();
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		const chunk = dec.decode(value, { stream: true });
		stream += chunk; buf += chunk;
		let i;
		while ((i = buf.indexOf("\n")) >= 0) {
			const line = buf.slice(0, i); buf = buf.slice(i + 1);
			if (!line.trim() || !s.golden.paced) continue;
			let ev: { type?: string }; try { ev = JSON.parse(line); } catch { continue; }
			if (ev.type !== "result") continue;
			if (sent < s.golden.turns.length) { write(s.golden.turns[sent++]!); await proc.stdin.flush(); }
			else proc.stdin.end();
		}
	}
	const stderr = await new Response(proc.stderr).text();
	await proc.exited;
	return { stream, stderr, exit: shellExit(proc) };
}

const shellExit = (p: { exitCode: number | null; signalCode: string | null }): number =>
	p.exitCode ?? 128 + (SIGNUM[p.signalCode ?? ""] ?? 0);

export function sessionIdOf(stream: string): string {
	for (const line of stream.split("\n")) {
		if (!line.trim()) continue;
		try {
			const e = JSON.parse(line) as { subtype?: string; session_id?: string };
			if (e.subtype === "init" && typeof e.session_id === "string") return e.session_id;
		} catch { /* a torn line is the caller's problem, not the finder's */ }
	}
	return "";
}

if (import.meta.main) {
	const gild = process.argv.includes("--gild");
	let same = 0, differ = 0;
	for (const name of scenarioNames()) {
		const run = await runScenario(loadScenario(name));
		const path = goldenPath(name);
		if (gild) { writeFileSync(path, run.stream); console.log(`gilded ${name} (${run.stream.split("\n").length - 1} events, exit ${run.exit})`); continue; }
		const golden = existsSync(path) ? readFileSync(path, "utf8") : null;
		if (golden === run.stream) { same++; console.log(`ok    ${name}`); }
		else { differ++; console.log(`DIFF  ${name}${golden === null ? " (no golden recorded)" : ""}`); }
	}
	if (!gild) {
		console.log(`\n${same} match, ${differ} differ`);
		process.exit(differ === 0 ? 0 : 1);
	}
}
