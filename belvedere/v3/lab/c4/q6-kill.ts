// Q6 — kill + survive. SIGTERM / SIGKILL mid-turn, and parent death mid-turn.
// After each: is the transcript whole up to the cut, and is the session resumable?
import { cleanEnv, CLAUDE_BIN, capture, run, events, SCRATCH, ACCOUNTS, type Account } from "./lib.ts";
import { rmSync, mkdirSync, readFileSync, existsSync } from "node:fs";

const account = (Bun.argv[2] ?? "personal") as Account;
const mode = Bun.argv[3] ?? "SIGTERM";       // SIGTERM | SIGKILL | PARENT
const killAtMs = Number(Bun.argv[4] ?? 20_000);

const LONG = "Do this exactly, one Bash call per step, no other tools: run `sleep 6 && echo STEP1`, then `sleep 6 && echo STEP2`, then `sleep 6 && echo STEP3`, then `sleep 6 && echo STEP4`, then `sleep 6 && echo STEP5`. Report each step's output as you go.";
const base = ["-p", LONG, "--model", "haiku", "--effort", "low",
	"--permission-mode", "bypassPermissions", "--output-format", "stream-json",
	"--include-hook-events", "--verbose"];

const tag = `q6-${mode}-${account}`;
const cwd = `${SCRATCH}/${tag}`;
rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd, { recursive: true });

// A session id we choose, so the transcript is findable even if the process
// dies before emitting init.
const sid = crypto.randomUUID();
const argv = [CLAUDE_BIN, "--session-id", sid, ...base];
const projDir = `${ACCOUNTS[account]}/projects/${cwd.replace(/[^a-zA-Z0-9]/g, "-")}`;
const tpath = `${projDir}/${sid}.jsonl`;

const t0 = Date.now();
let out = "", killedAt = 0, code: number | null = null, sigOut: string | null = null;

if (mode === "PARENT") {
	// The spawning process dies mid-turn: an intermediate shell starts claude and
	// is SIGKILLed, leaving the subject orphaned.
	const sh = Bun.spawn(["/bin/sh", "-c", `exec "${argv.join('" "')}" > "${cwd}/subject.out" 2>"${cwd}/subject.err"`],
		{ cwd, env: cleanEnv(account), stdout: "pipe", stderr: "pipe" });
	await Bun.sleep(killAtMs);
	// Kill the whole spawned pipeline's leader; the claude child is orphaned by exec-less sh.
	sh.kill("SIGKILL");
	killedAt = Date.now() - t0;
	await sh.exited;
	console.log(`parent killed at ${killedAt}ms (pid ${sh.pid})`);
	await Bun.sleep(60_000);   // give the orphan time to finish its 30s of sleeps
	out = existsSync(`${cwd}/subject.out`) ? readFileSync(`${cwd}/subject.out`, "utf8") : "";
} else {
	const proc = Bun.spawn(argv, { cwd, env: cleanEnv(account), stdout: "pipe", stderr: "pipe", stdin: "ignore" });
	const collect = new Response(proc.stdout).text();
	await Bun.sleep(killAtMs);
	proc.kill(mode === "SIGKILL" ? "SIGKILL" : "SIGTERM");
	killedAt = Date.now() - t0;
	out = await collect;
	code = await proc.exited;
	sigOut = proc.signalCode ?? null;
	console.log(`killed with ${mode} at ${killedAt}ms -> exit=${code} signal=${sigOut}`);
	// Did SIGTERM leave the process alive?
	await Bun.sleep(2000);
}

const ev = events(out);
const res = ev.find((e) => e.type === "result");
console.log(`stream: ${ev.length} events, result=${res ? res.subtype : "NONE"}${res ? ` terminal_reason=${res.terminal_reason}` : ""}`);
console.log(`bash steps completed in stream: ${ev.filter((e) => e.type === "user" && JSON.stringify(e.message?.content ?? "").includes("STEP")).length}`);

// --- transcript state after the cut ---
console.log(`transcript exists=${existsSync(tpath)}`);
let rows: any[] = [];
if (existsSync(tpath)) {
	const raw = readFileSync(tpath, "utf8");
	const lines = raw.split("\n");
	const trailingPartial = lines[lines.length - 1] !== "" ;
	rows = lines.filter(Boolean).flatMap((l) => { try { return [JSON.parse(l)]; } catch { return [{ __unparseable: l.slice(0, 80) }]; } });
	const bad = rows.filter((r) => r.__unparseable);
	console.log(`  rows=${rows.length} unparseable=${bad.length} trailing_partial_line=${trailingPartial}`);
	console.log(`  steps on disk: ${rows.filter((r) => JSON.stringify(r).includes("STEP")).length}`);
	console.log(`  last row type=${rows[rows.length-1]?.type} uuid=${String(rows[rows.length-1]?.uuid).slice(0,8)}`);
}

capture({ capture: tag, account, model: "haiku", effort: "low", posture: "bypassPermissions",
	cwdClass: "scratch-untracked", task: "T-long" },
	{ code, signal: sigOut, stdout: out, stderr: "", ms: Date.now() - t0, argv },
	{ cwd, sid, mode, killedAtMs: killedAt, transcript_rows: rows.length });

// --- is it resumable after the cut? ---
const r2 = await run({ account, cwd, timeoutMs: 120_000,
	args: ["-p", "In one short sentence, what were you doing before this message?",
		"--resume", sid, "--model", "haiku", "--effort", "low",
		"--permission-mode", "bypassPermissions", "--output-format", "stream-json", "--verbose"] });
const res2 = events(r2.stdout).find((e) => e.type === "result");
console.log(`RESUME AFTER ${mode}: exit=${r2.code} ${res2 ? `ok subtype=${res2.subtype}` : "no result"}`);
console.log(`  says: ${JSON.stringify(String(res2?.result ?? r2.stderr).slice(0, 220))}`);
capture({ capture: `${tag}-resume`, account, model: "haiku", effort: "low", posture: "bypassPermissions",
	cwdClass: "scratch-untracked", task: "T-resume-after-kill" }, r2, { cwd, sid, after: mode });
