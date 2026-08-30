// Q2 / K1 — the injection kill. Two arms deliver a second user turn.
// Payload is adversarial by design: the byte classes that break TUI paste
// (P6's wall) must survive argv/stdin injection byte-exact.
import { run, capture, events, SCRATCH, ACCOUNTS, type Account } from "./lib.ts";
import { rmSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const account = (Bun.argv[2] ?? "personal") as Account;
const arm = Bun.argv[3] ?? "a";
const model = "haiku", effort = "low", posture = "acceptEdits";

const sha = (s: string) => createHash("sha256").update(s, "utf8").digest("hex").slice(0, 16);

const IGNITE = "You are a byte-echo probe. For every message I send, reply with exactly the word OK and nothing else. Use no tools.";
const PAYLOAD = (n: number) => `TURN${n} alpha\n\nTURN${n} after a blank line\n\tTURN${n} tabbed\n"quoted" 'single' \`backtick\` $VAR \${BRACE}\n/not-a-slash-command\n--not-a-flag\némoji ⚡ 中文 ünïcødé\nTURN${n} LAST`;

const tag = `q2-${arm}-${account}`;
const cwd = `${SCRATCH}/${tag}`;
rmSync(cwd, { recursive: true, force: true });
mkdirSync(cwd, { recursive: true });

const base = ["--model", model, "--effort", effort, "--permission-mode", posture,
	"--output-format", "stream-json", "--include-hook-events", "--verbose"];

let sid = "";
const turns: { n: number; sent: string; ms: number; exit: number | null }[] = [];

if (arm === "a") {
	// Arm A — turn per invocation, cold resume each time.
	const r0 = await run({ account, cwd, args: ["-p", IGNITE, ...base], timeoutMs: 180_000 });
	sid = events(r0.stdout).find((e) => e.subtype === "init")?.session_id ?? "";
	capture({ capture: `${tag}-t0`, account, model, effort, posture, cwdClass: "scratch-untracked", task: "T-ignite" }, r0, { cwd, sid });
	turns.push({ n: 0, sent: IGNITE, ms: r0.ms, exit: r0.code });
	console.log(`t0 ignite sid=${sid} exit=${r0.code} ${r0.ms}ms`);

	for (const n of [1, 2, 3]) {
		const p = PAYLOAD(n);
		const r = await run({ account, cwd, args: ["-p", p, "--resume", sid, ...base], timeoutMs: 180_000 });
		capture({ capture: `${tag}-t${n}`, account, model, effort, posture, cwdClass: "scratch-untracked", task: "T-inject" }, r, { cwd, sid, payload_sha: sha(p) });
		turns.push({ n, sent: p, ms: r.ms, exit: r.code });
		const res = events(r.stdout).find((e) => e.type === "result");
		console.log(`t${n} resume exit=${r.code} ${r.ms}ms result=${JSON.stringify(res?.result ?? null)} sid_after=${res?.session_id?.slice(0,8)}`);
	}
} else {
	// Arm B — one process, turns over stream-json stdin.
	const lines = [IGNITE, PAYLOAD(1), PAYLOAD(2), PAYLOAD(3)].map((text) =>
		JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "text", text }] } }));
	const stdin = lines.join("\n") + "\n";
	const r = await run({ account, cwd, stdin,
		args: ["-p", "--input-format", "stream-json", "--replay-user-messages", ...base],
		timeoutMs: 300_000 });
	sid = events(r.stdout).find((e) => e.subtype === "init")?.session_id ?? "";
	capture({ capture: tag, account, model, effort, posture, cwdClass: "scratch-untracked", task: "T-inject-stdin" }, r, { cwd, sid });
	const ev = events(r.stdout);
	console.log(`armB exit=${r.code} ${r.ms}ms sid=${sid} results=${ev.filter(e=>e.type==="result").length}`);
	console.log(`  results: ${JSON.stringify(ev.filter(e=>e.type==="result").map(e=>e.result))}`);
	if (r.code !== 0) console.log(`  stderr: ${r.stderr.trim().slice(0,400)}`);
	[IGNITE, PAYLOAD(1), PAYLOAD(2), PAYLOAD(3)].forEach((t, i) => turns.push({ n: i, sent: t, ms: 0, exit: r.code }));
}

// --- The verdict: is the transcript on disk byte-exact and whole? ---
const projDir = `${ACCOUNTS[account]}/projects/${cwd.replace(/[^a-zA-Z0-9]/g, "-")}`;
const tpath = `${projDir}/${sid}.jsonl`;
console.log(`\ntranscript: ${tpath} exists=${existsSync(tpath)}`);
if (existsSync(tpath)) {
	const rows = readFileSync(tpath, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
	const users = rows.filter((r) => r.type === "user" && typeof r.message?.content === "string"
		|| (r.type === "user" && Array.isArray(r.message?.content) && r.message.content.some((c: any) => c.type === "text")));
	console.log(`rows=${rows.length} user_rows=${users.length} assistant_rows=${rows.filter(r=>r.type==="assistant").length}`);
	for (const t of turns) {
		const want = sha(t.sent);
		const hit = users.find((u) => {
			const c = u.message.content;
			const text = typeof c === "string" ? c : c.filter((x: any) => x.type === "text").map((x: any) => x.text).join("");
			return sha(text) === want;
		});
		console.log(`  turn${t.n} sha=${want} BYTE_EXACT=${hit ? "YES" : "NO"}${hit ? ` uuid=${hit.uuid?.slice(0,8)} parent=${String(hit.parentUuid).slice(0,8)}` : ""}`);
	}
}
