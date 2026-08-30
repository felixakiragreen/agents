// Q4 — permission physics headless. What a permission-needing tool call DOES,
// per posture. Control: P5's interactive matrix (six of six cells did the work
// under `auto`; two stall signatures existed interactively).
import { run, capture, events, SCRATCH, type Account } from "./lib.ts";
import { rmSync, mkdirSync, existsSync } from "node:fs";

const account = (Bun.argv[2] ?? "personal") as Account;
const postures = (Bun.argv[3] ?? "default,auto,acceptEdits,plan,bypassPermissions,manual,dontAsk").split(",");
const model = Bun.argv[4] ?? "sonnet";

const PROMPT = "Write a file ping.txt in the current directory containing exactly: ping. Then stop.";

for (const posture of postures) {
	const tag = `q4-${posture}-${model}-${account}`;
	const cwd = `${SCRATCH}/${tag}`;
	rmSync(cwd, { recursive: true, force: true });
	mkdirSync(cwd, { recursive: true });

	const args = ["-p", PROMPT, "--model", model, "--effort", "low",
		"--output-format", "stream-json", "--include-hook-events", "--verbose"];
	if (posture !== "default") args.push("--permission-mode", posture);

	const r = await run({ account, cwd, args, timeoutMs: 180_000 });
	const ev = events(r.stdout);
	const init = ev.find((e) => e.subtype === "init");
	const res = ev.find((e) => e.type === "result");
	const denied = ev.filter((e) => e.subtype === "permission_denied");
	capture({ capture: tag, account, model, effort: "low", posture,
		cwdClass: "scratch-untracked", task: "T-perm" }, r, { prompt: PROMPT, cwd });

	console.log([
		posture.padEnd(19),
		("asked=" + posture).padEnd(26),
		("got=" + (init?.permissionMode ?? "?")).padEnd(22),
		("exit=" + r.code).padEnd(8),
		("res=" + (res?.subtype ?? "NONE") + "/" + (res?.is_error ?? "?")).padEnd(18),
		("denials=" + (res?.permission_denials?.length ?? "?")).padEnd(12),
		("ev_denied=" + denied.length).padEnd(13),
		"FILE=" + (existsSync(`${cwd}/ping.txt`) ? "YES" : "no"),
		(r.ms/1000).toFixed(1) + "s",
	].join(" "));
	if (r.code !== 0) console.log("   stderr: " + r.stderr.trim().slice(0, 300));
}
