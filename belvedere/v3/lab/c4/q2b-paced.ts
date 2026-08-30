// Q2 arm B, attempt 2 — paced: one turn written to stdin only after the prior
// turn's `result` arrives. Attempt 1 (unpaced) coalesced turns 1-3 into one
// user row: bytes whole, turn boundaries lost.
import { cleanEnv, CLAUDE_BIN, capture, SCRATCH, ACCOUNTS, type Account } from "./lib.ts";
import { rmSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const account = (Bun.argv[2] ?? "personal") as Account;
const sha = (s: string) => createHash("sha256").update(s, "utf8").digest("hex").slice(0, 16);
const IGNITE = "You are a byte-echo probe. For every message I send, reply with exactly the word OK and nothing else. Use no tools.";
const PAYLOAD = (n: number) => `TURN${n} alpha\n\nTURN${n} after a blank line\n\tTURN${n} tabbed\n"quoted" 'single' \`backtick\` $VAR \${BRACE}\n/not-a-slash-command\n--not-a-flag\némoji ⚡ 中文 ünïcødé\nTURN${n} LAST`;
const SENT = [IGNITE, PAYLOAD(1), PAYLOAD(2), PAYLOAD(3)];

const tag = `q2-b-paced-${account}`;
const cwd = `${SCRATCH}/${tag}`;
rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd, { recursive: true });

const proc = Bun.spawn([CLAUDE_BIN, "-p", "--input-format", "stream-json",
	"--output-format", "stream-json", "--include-hook-events", "--verbose",
	"--replay-user-messages", "--model", "haiku", "--effort", "low",
	"--permission-mode", "acceptEdits"], {
	cwd, env: cleanEnv(account), stdin: "pipe", stdout: "pipe", stderr: "pipe" });

const w = (text: string) => proc.stdin.write(
	JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "text", text }] } }) + "\n");

let out = "", sid = "", sent = 0, results = 0;
const t0 = Date.now();
const marks: string[] = [];
w(SENT[sent++]!); await proc.stdin.flush();

const reader = proc.stdout.getReader();
const dec = new TextDecoder();
let buf = "";
readLoop: while (true) {
	const { done, value } = await reader.read();
	if (done) break;
	const chunk = dec.decode(value, { stream: true });
	out += chunk; buf += chunk;
	let i;
	while ((i = buf.indexOf("\n")) >= 0) {
		const line = buf.slice(0, i); buf = buf.slice(i + 1);
		if (!line.trim()) continue;
		let e: any; try { e = JSON.parse(line); } catch { continue; }
		if (e.subtype === "init") sid = e.session_id;
		if (e.type === "result") {
			results++;
			marks.push(`  result#${results} at ${((Date.now()-t0)/1000).toFixed(1)}s queued=${e.queued_turn_count} turns=${e.num_turns} text=${JSON.stringify(String(e.result).slice(0,60))}`);
			if (sent < SENT.length) { w(SENT[sent++]!); await proc.stdin.flush(); }
			else { proc.stdin.end(); }
		}
	}
	if (results >= SENT.length) break readLoop;
}
const stderr = await new Response(proc.stderr).text();
try { proc.stdin.end(); } catch {}
const code = await proc.exited;
const ms = Date.now() - t0;

capture({ capture: tag, account, model: "haiku", effort: "low", posture: "acceptEdits",
	cwdClass: "scratch-untracked", task: "T-inject-stdin-paced" },
	{ code, signal: null, stdout: out, stderr, ms, argv: ["paced"] }, { cwd, sid });

console.log(`exit=${code} ${ms}ms sid=${sid} sent=${sent} results=${results}`);
marks.forEach((m) => console.log(m));
if (stderr.trim()) console.log("stderr: " + stderr.trim().slice(0, 300));

const tpath = `${ACCOUNTS[account]}/projects/${cwd.replace(/[^a-zA-Z0-9]/g, "-")}/${sid}.jsonl`;
if (existsSync(tpath)) {
	const rows = readFileSync(tpath, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
	const users = rows.filter((r) => r.type === "user" && r.message?.content);
	console.log(`\ntranscript rows=${rows.length} user_rows=${users.length}`);
	SENT.forEach((t, n) => {
		const want = sha(t);
		const hit = users.find((u) => {
			const c = u.message.content;
			const text = typeof c === "string" ? c : c.filter((x: any) => x.type === "text").map((x: any) => x.text).join("");
			return sha(text) === want;
		});
		console.log(`  turn${n} BYTE_EXACT=${hit ? "YES" : "NO"}`);
	});
} else console.log(`\ntranscript MISSING: ${tpath}`);
