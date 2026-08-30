// Q1 — the grammar. Raw stream-json captures across the task set.
import { run, capture, SCRATCH, type Account } from "./lib.ts";
import { rmSync, mkdirSync } from "node:fs";

const [ , , taskName = "echo", account = "personal" ] = Bun.argv as string[];

const TASKS: Record<string, { prompt: string; model: string; posture: string }> = {
	echo:  { prompt: "Reply with exactly: pong", model: "haiku", posture: "auto" },
	write: { prompt: "Write a file ping.txt in the current directory containing exactly: ping", model: "haiku", posture: "auto" },
	multi: { prompt: "Write three files a.txt b.txt c.txt in the current directory, each containing its own name, then read a.txt back. One tool call per step. Ask no questions.", model: "haiku", posture: "auto" },
	sub:   { prompt: "Use exactly one subagent (the Explore agent) to count the files in the current directory, then report the number. Ask no questions.", model: "haiku", posture: "auto" },
	ask:   { prompt: "Ask me one question about which filename to use, then stop and wait for my answer. Do not use any tools.", model: "haiku", posture: "auto" },
};

const t = TASKS[taskName];
if (!t) throw new Error(`unknown task ${taskName}`);

const cwd = `${SCRATCH}/q1-${taskName}-${account}`;
rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd, { recursive: true });

const args = [
	"-p", t.prompt,
	"--model", t.model,
	"--effort", "low",
	"--permission-mode", t.posture,
	"--output-format", "stream-json",
	"--include-hook-events",
	"--verbose",
];

const r = await run({ account: account as Account, cwd, args, timeoutMs: 300_000 });
const dir = capture(
	{ capture: `q1-${taskName}-${account}`, account: account as Account,
	  model: t.model, effort: "low", posture: t.posture,
	  cwdClass: "scratch-untracked", task: `T-${taskName}` },
	r, { prompt: t.prompt, cwd },
);
console.log(`exit=${r.code} ms=${r.ms} bytes=${r.stdout.length} -> ${dir}`);
console.log(r.stderr.slice(0, 600));
