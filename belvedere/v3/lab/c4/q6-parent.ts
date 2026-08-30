// Q6, parent-death arm. Attempt 1 used `sh -c "exec ..."` — sh *became* claude,
// so killing "the parent" killed the subject, and backticks in the prompt were
// command-substituted. Here the parent spawns claude as a real child (argv
// passed through a script file, no shell quoting) and is then SIGKILLed; the
// subject should be orphaned to init and finish on its own.
import { cleanEnv, CLAUDE_BIN, capture, run, events, SCRATCH, ACCOUNTS, type Account } from "./lib.ts";
import { rmSync, mkdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";

const account = (Bun.argv[2] ?? "personal") as Account;
const killAtMs = Number(Bun.argv[3] ?? 20_000);

const LONG = "Do this exactly, one Bash call per step, no other tools: run 'sleep 6 && echo STEP1', then 'sleep 6 && echo STEP2', then 'sleep 6 && echo STEP3', then 'sleep 6 && echo STEP4', then 'sleep 6 && echo STEP5'. Report each step's output as you go.";

const tag = `q6-PARENT-${account}`;
const cwd = `${SCRATCH}/${tag}`;
rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd, { recursive: true });

const sid = crypto.randomUUID();
const argv = [CLAUDE_BIN, "--session-id", sid, "-p", LONG, "--model", "haiku",
	"--effort", "low", "--permission-mode", "bypassPermissions",
	"--output-format", "stream-json", "--include-hook-events", "--verbose"];

// The parent: a bun process whose only job is to spawn the subject and idle.
const parentScript = `${cwd}/parent.ts`;
writeFileSync(parentScript, `
const argv = ${JSON.stringify(argv)};
const out = Bun.file(${JSON.stringify(cwd + "/subject.out")}).writer();
const p = Bun.spawn(argv, { cwd: ${JSON.stringify(cwd)}, stdout: "pipe", stderr: "ignore", stdin: "ignore" });
console.log("CHILD_PID=" + p.pid);
(async () => { for await (const c of p.stdout) { out.write(c); out.flush(); } })();
await Bun.sleep(3600_000);
`);

const parent = Bun.spawn(["/opt/homebrew/bin/bun", parentScript],
	{ cwd, env: cleanEnv(account), stdout: "pipe", stderr: "pipe", stdin: "ignore" });

// Read the child's pid off the parent's stdout.
let childPid = 0;
const rdr = parent.stdout.getReader(); const dec = new TextDecoder(); let b = "";
while (childPid === 0) {
	const { done, value } = await rdr.read(); if (done) break;
	b += dec.decode(value, { stream: true });
	const m = b.match(/CHILD_PID=(\d+)/); if (m) childPid = Number(m[1]);
}
console.log(`parent pid=${parent.pid} child pid=${childPid}`);

await Bun.sleep(killAtMs);
const aliveBefore = Bun.spawnSync(["/bin/ps", "-p", String(childPid), "-o", "ppid="]).stdout.toString().trim();
parent.kill("SIGKILL");
await parent.exited;
console.log(`parent SIGKILLed at ${killAtMs}ms; child ppid before kill = ${aliveBefore}`);

await Bun.sleep(3000);
const ppidAfter = Bun.spawnSync(["/bin/ps", "-p", String(childPid), "-o", "ppid="]).stdout.toString().trim();
console.log(`child ppid after parent death = ${ppidAfter || "(child gone)"}  -> orphaned=${ppidAfter === "1"}`);

console.log("waiting 70s for the orphan to finish its 30s of sleeps...");
await Bun.sleep(70_000);
const stillAlive = Bun.spawnSync(["/bin/ps", "-p", String(childPid), "-o", "pid="]).stdout.toString().trim();
console.log(`child alive after 70s = ${stillAlive ? "YES" : "no (exited)"}`);

const out = existsSync(`${cwd}/subject.out`) ? readFileSync(`${cwd}/subject.out`, "utf8") : "";
const ev = events(out);
const res = ev.find((e) => e.type === "result");
console.log(`stream: ${ev.length} events, result=${res ? res.subtype + "/" + res.terminal_reason : "NONE"}`);

const tpath = `${ACCOUNTS[account]}/projects/${cwd.replace(/[^a-zA-Z0-9]/g, "-")}/${sid}.jsonl`;
console.log(`transcript exists=${existsSync(tpath)}`);
let rows: any[] = [];
if (existsSync(tpath)) {
	rows = readFileSync(tpath, "utf8").split("\n").filter(Boolean).flatMap((l) => { try { return [JSON.parse(l)]; } catch { return [{ __bad: 1 }]; } });
	console.log(`  rows=${rows.length} unparseable=${rows.filter(r=>r.__bad).length} STEP5_done=${JSON.stringify(rows).includes("STEP5")}`);
}
capture({ capture: tag, account, model: "haiku", effort: "low", posture: "bypassPermissions",
	cwdClass: "scratch-untracked", task: "T-long" },
	{ code: null, signal: null, stdout: out, stderr: "", ms: 0, argv },
	{ cwd, sid, mode: "PARENT", killedAtMs: killAtMs, orphaned: ppidAfter === "1", transcript_rows: rows.length });

const r2 = await run({ account, cwd, timeoutMs: 120_000,
	args: ["-p", "In one short sentence, what were you doing before this message?", "--resume", sid,
		"--model", "haiku", "--effort", "low", "--permission-mode", "bypassPermissions",
		"--output-format", "stream-json", "--verbose"] });
const res2 = events(r2.stdout).find((e) => e.type === "result");
console.log(`RESUME AFTER PARENT DEATH: exit=${r2.code} ${res2?.subtype ?? "no result"}`);
console.log(`  says: ${JSON.stringify(String(res2?.result ?? r2.stderr).slice(0, 220))}`);
capture({ capture: `${tag}-resume`, account, model: "haiku", effort: "low", posture: "bypassPermissions",
	cwdClass: "scratch-untracked", task: "T-resume-after-kill" }, r2, { cwd, sid, after: "PARENT" });
