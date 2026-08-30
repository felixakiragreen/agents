// Q5 attempt 2 — attempt 1 summoned into a scratch cwd and stopped dead at the
// interactive workspace-trust dialog (`-p` skips it; a TUI resume does not).
// Here the venue is inside the already-warm repo, and the summoned TUI runs with
// `--tools ""` so it provably cannot touch the repo it is sitting in.
import { run, capture, events, cleanEnv, CLAUDE_BIN, ACCOUNTS, type Account } from "./lib.ts";
import { rmSync, mkdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";

const account = (Bun.argv[2] ?? "personal") as Account;
const SOCK = "c4";
const cwd = `${import.meta.dir}/summon-venue`;
rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd, { recursive: true });

const sid = crypto.randomUUID();
const tpath = `${ACCOUNTS[account]}/projects/${cwd.replace(/[^a-zA-Z0-9]/g, "-")}/${sid}.jsonl`;
const tmux = (...a: string[]) => Bun.spawnSync(["/opt/homebrew/bin/tmux", "-L", SOCK, ...a]);
const pane = () => tmux("capture-pane", "-p", "-t", "c4win").stdout.toString();
const userTurns = () => !existsSync(tpath) ? [] :
	readFileSync(tpath, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l))
		.filter((r) => r.type === "user" && r.message?.content)
		.map((r) => typeof r.message.content === "string" ? r.message.content
			: r.message.content.filter((c: any) => c.type === "text").map((c: any) => c.text).join(""));

const T1 = "Remember this codeword: HEADLESS-ALPHA-7. Reply with exactly: stored";
const r1 = await run({ account, cwd, timeoutMs: 120_000, args: ["--session-id", sid, "-p", T1,
	"--model", "haiku", "--effort", "low", "--tools", "", "--output-format", "stream-json", "--verbose"] });
console.log(`1. headless ignite (warm venue): exit=${r1.code} result=${JSON.stringify(events(r1.stdout).find(e=>e.type==="result")?.result)}`);
capture({ capture: `q5b-1-headless-${account}`, account, model: "haiku", effort: "low", posture: "default",
	cwdClass: "repo-warm-v3-lab", task: "T-echo" }, r1, { cwd, sid });

const envArgs = Object.entries(cleanEnv(account)).flatMap(([k, v]) => ["-e", `${k}=${v}`]);
tmux("kill-session", "-t", "c4win");
tmux("new-session", "-d", "-s", "c4win", "-x", "200", "-y", "50", "-c", cwd, ...envArgs,
	CLAUDE_BIN, "--resume", sid, "--model", "haiku", "--effort", "low", "--tools", "");
console.log("2. TUI summoned; waiting for boot...");
await Bun.sleep(20_000);
const boot = pane();
writeFileSync(`${import.meta.dir}/captures/q5b-pane-boot.txt`, boot);
const trustDialog = boot.includes("Quick safety check");
console.log(`   trust dialog = ${trustDialog}`);
console.log(`   HISTORY RENDERED: codeword in pane = ${boot.includes("HEADLESS-ALPHA-7")}, prior reply = ${/stored/i.test(boot)}`);
console.log(`   pane:\n${boot.split("\n").filter(l=>l.trim()).slice(0,10).map(l=>"     | "+l).join("\n")}`);

const T2 = "What was the codeword? Also remember TERMINAL-BRAVO-9. Answer in one line.";
const before = userTurns().length;
tmux("send-keys", "-t", "c4win", T2); await Bun.sleep(1500);
tmux("send-keys", "-t", "c4win", "Enter");
console.log("3. hand-turn sent; waiting...");
for (let i = 0; i < 60 && userTurns().length <= before; i++) await Bun.sleep(2000);
await Bun.sleep(8000);
const after = pane();
writeFileSync(`${import.meta.dir}/captures/q5b-pane-after.txt`, after);
console.log(`   HAND TURN LANDED = ${userTurns().length > before} (${before} -> ${userTurns().length})`);
console.log(`   TUI recalled the headless codeword = ${after.includes("HEADLESS-ALPHA-7")}`);

tmux("send-keys", "-t", "c4win", "C-c"); await Bun.sleep(600);
tmux("send-keys", "-t", "c4win", "C-c"); await Bun.sleep(3000);
tmux("kill-session", "-t", "c4win"); tmux("kill-server");
await Bun.sleep(2000);

const T3 = "List both codewords you have been given, comma separated, nothing else.";
const r3 = await run({ account, cwd, timeoutMs: 120_000, args: ["-p", T3, "--resume", sid,
	"--model", "haiku", "--effort", "low", "--tools", "", "--output-format", "stream-json", "--verbose"] });
const out3 = String(events(r3.stdout).find((e) => e.type === "result")?.result ?? r3.stderr);
console.log(`4. headless again: exit=${r3.code} says ${JSON.stringify(out3.slice(0,160))}`);
console.log(`   ROUND TRIP: headless-born codeword=${out3.includes("HEADLESS-ALPHA-7")}  TUI-born codeword=${out3.includes("TERMINAL-BRAVO-9")}`);
capture({ capture: `q5b-4-headless-again-${account}`, account, model: "haiku", effort: "low", posture: "default",
	cwdClass: "repo-warm-v3-lab", task: "T-echo" }, r3, { cwd, sid });

const turns = userTurns();
console.log(`\ntranscript: ${turns.length} user turns, one sid ${sid}`);
turns.forEach((t, i) => console.log(`  turn${i}: ${JSON.stringify(t.slice(0, 70))}`));
