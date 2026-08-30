// Q5 — summon-to-terminal (D20's fallback viewport) and the Chat's read path.
// headless ignite -> real TUI on a pty, worked by hand -> headless again.
// The TUI runs under a private tmux socket (-L c4): the cmux desktop is untouched.
import { run, capture, events, cleanEnv, CLAUDE_BIN, SCRATCH, ACCOUNTS, type Account } from "./lib.ts";
import { rmSync, mkdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";

const account = (Bun.argv[2] ?? "personal") as Account;
const SOCK = "c4";
const tag = `q5-summon-${account}`;
const cwd = `${SCRATCH}/${tag}`;
rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd, { recursive: true });

const sid = crypto.randomUUID();
const tpath = `${ACCOUNTS[account]}/projects/${cwd.replace(/[^a-zA-Z0-9]/g, "-")}/${sid}.jsonl`;
const tmux = (...a: string[]) => Bun.spawnSync(["/opt/homebrew/bin/tmux", "-L", SOCK, ...a],
	{ env: { ...process.env } as any });
const pane = () => tmux("capture-pane", "-p", "-t", "c4win").stdout.toString();
const userTurns = () => !existsSync(tpath) ? [] :
	readFileSync(tpath, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l))
		.filter((r) => r.type === "user" && r.message?.content)
		.map((r) => typeof r.message.content === "string" ? r.message.content
			: r.message.content.filter((c: any) => c.type === "text").map((c: any) => c.text).join(""));

// --- 1. headless ignite -----------------------------------------------------
const T1 = "Remember this codeword: HEADLESS-ALPHA-7. Reply with exactly: stored";
const r1 = await run({ account, cwd, timeoutMs: 120_000, args: ["--session-id", sid, "-p", T1,
	"--model", "haiku", "--effort", "low", "--permission-mode", "acceptEdits",
	"--output-format", "stream-json", "--verbose"] });
console.log(`1. headless ignite: exit=${r1.code} result=${JSON.stringify(events(r1.stdout).find(e=>e.type==="result")?.result)}`);
capture({ capture: `${tag}-1-headless`, account, model: "haiku", effort: "low", posture: "acceptEdits",
	cwdClass: "scratch-untracked", task: "T-echo" }, r1, { cwd, sid });

// --- 2. summon into a real TUI ---------------------------------------------
const env = cleanEnv(account);
const envArgs = Object.entries(env).flatMap(([k, v]) => ["-e", `${k}=${v}`]);
tmux("kill-session", "-t", "c4win");
const mk = tmux("new-session", "-d", "-s", "c4win", "-x", "200", "-y", "50", "-c", cwd,
	...envArgs, CLAUDE_BIN, "--resume", sid, "--model", "haiku", "--effort", "low");
if (mk.exitCode !== 0) { console.log("tmux new-session failed: " + mk.stderr.toString()); process.exit(1); }
console.log("2. TUI summoned on tmux socket 'c4'; waiting for boot...");
await Bun.sleep(18_000);
const boot = pane();
writeFileSync(`${import.meta.dir}/captures/${tag}-pane-boot.txt`, boot);
console.log(`   history rendered? codeword visible in pane = ${boot.includes("HEADLESS-ALPHA-7")}`);
console.log(`   prior reply visible in pane = ${boot.toLowerCase().includes("stored")}`);
console.log(`   pane head:\n${boot.split("\n").filter(l=>l.trim()).slice(0,8).map(l=>"     | "+l).join("\n")}`);

// --- 3. work it by hand -----------------------------------------------------
const T2 = "What was the codeword? Also remember TERMINAL-BRAVO-9. Answer in one line.";
const before = userTurns().length;
tmux("send-keys", "-t", "c4win", T2);
await Bun.sleep(1500);
tmux("send-keys", "-t", "c4win", "Enter");
console.log("3. hand-turn sent into the TUI; waiting for the reply...");
for (let i = 0; i < 60 && userTurns().length <= before; i++) await Bun.sleep(2000);
await Bun.sleep(8000);
const after = pane();
writeFileSync(`${import.meta.dir}/captures/${tag}-pane-after.txt`, after);
console.log(`   TUI turn landed in transcript = ${userTurns().length > before} (user turns ${before} -> ${userTurns().length})`);
console.log(`   TUI answered with the headless codeword = ${after.includes("HEADLESS-ALPHA-7")}`);

// --- 4. return it headless --------------------------------------------------
tmux("send-keys", "-t", "c4win", "C-c"); await Bun.sleep(600);
tmux("send-keys", "-t", "c4win", "C-c"); await Bun.sleep(3000);
tmux("kill-session", "-t", "c4win");
await Bun.sleep(2000);
const T3 = "List both codewords you have been given, comma separated, nothing else.";
const r3 = await run({ account, cwd, timeoutMs: 120_000, args: ["-p", T3, "--resume", sid,
	"--model", "haiku", "--effort", "low", "--permission-mode", "acceptEdits",
	"--output-format", "stream-json", "--verbose"] });
const out3 = String(events(r3.stdout).find((e) => e.type === "result")?.result ?? r3.stderr);
console.log(`4. headless again: exit=${r3.code} says ${JSON.stringify(out3.slice(0,160))}`);
console.log(`   ROUND-TRIP INTEGRITY: headless codeword=${out3.includes("HEADLESS-ALPHA-7")} tui codeword=${out3.includes("TERMINAL-BRAVO-9")}`);
capture({ capture: `${tag}-4-headless-again`, account, model: "haiku", effort: "low", posture: "acceptEdits",
	cwdClass: "scratch-untracked", task: "T-echo" }, r3, { cwd, sid });

const turns = userTurns();
console.log(`\ntranscript: ${turns.length} user turns, single sid=${sid}`);
turns.forEach((t, i) => console.log(`  turn${i}: ${JSON.stringify(t.slice(0, 70))}`));
