// Q8 — concurrency smoke: 10 simultaneous subjects, one account.
// Spawn latency distribution, transcript/lock collisions, census fidelity 10/10.
import { cleanEnv, CLAUDE_BIN, SCRATCH, ACCOUNTS, events, type Account } from "./lib.ts";
import { rmSync, mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { loadavg } from "node:os";

const account = (Bun.argv[2] ?? "personal") as Account;
const N = Number(Bun.argv[3] ?? 10);

const tag = `q8-${N}x-${account}`;
const root = `${SCRATCH}/${tag}`;
rmSync(root, { recursive: true, force: true });

const loadBefore = loadavg().map((n) => n.toFixed(2)).join(" ");
const t0 = Date.now();

const jobs = Array.from({ length: N }, (_, i) => {
	const cwd = `${root}/s${String(i).padStart(2, "0")}`;
	mkdirSync(cwd, { recursive: true });
	const sid = crypto.randomUUID();
	const argv = [CLAUDE_BIN, "--session-id", sid, "-p",
		`Reply with exactly: PONG-${i}`, "--model", "haiku", "--effort", "low",
		"--permission-mode", "acceptEdits", "--output-format", "stream-json",
		"--include-hook-events", "--verbose"];
	const spawnedAt = Date.now();
	const proc = Bun.spawn(argv, { cwd, env: cleanEnv(account), stdout: "pipe", stderr: "pipe", stdin: "ignore" });
	return { i, sid, cwd, proc, spawnedAt, initAt: 0, doneAt: 0, out: "", err: "" };
});

await Promise.all(jobs.map(async (j) => {
	j.out = await new Response(j.proc.stdout).text();
	j.err = await new Response(j.proc.stderr).text();
	await j.proc.exited;
	j.doneAt = Date.now();
}));

const loadAfter = loadavg().map((n) => n.toFixed(2)).join(" ");
const wall = Date.now() - t0;

const rows = jobs.map((j) => {
	const ev = events(j.out);
	const init = ev.find((e) => e.subtype === "init");
	const res = ev.find((e) => e.type === "result");
	const tpath = `${ACCOUNTS[account]}/projects/${j.cwd.replace(/[^a-zA-Z0-9]/g, "-")}/${j.sid}.jsonl`;
	return {
		i: j.i, sid: j.sid, exit: j.proc.exitCode,
		sid_matches: init?.session_id === j.sid,
		ms: j.doneAt - j.spawnedAt,
		result: String(res?.result ?? "").trim(),
		correct: String(res?.result ?? "").includes(`PONG-${j.i}`),
		transcript: existsSync(tpath),
		transcript_rows: existsSync(tpath) ? readFileSync(tpath, "utf8").split("\n").filter(Boolean).length : 0,
		err: j.err.trim().slice(0, 120),
	};
});

const lat = rows.map((r) => r.ms).sort((a, b) => a - b);
const pct = (p: number) => lat[Math.min(lat.length - 1, Math.floor(p * lat.length))];

console.log(`N=${N} account=${account} wall=${(wall/1000).toFixed(1)}s load ${loadBefore} -> ${loadAfter}`);
console.log(`latency ms: min=${lat[0]} p50=${pct(0.5)} p90=${pct(0.9)} max=${lat[lat.length-1]}`);
console.log(`exit0=${rows.filter(r=>r.exit===0).length}/${N}  sid_honored=${rows.filter(r=>r.sid_matches).length}/${N}  correct_answer=${rows.filter(r=>r.correct).length}/${N}  transcripts=${rows.filter(r=>r.transcript).length}/${N}`);
for (const r of rows.filter((r) => r.exit !== 0 || !r.correct || !r.transcript))
	console.log(`  BAD i=${r.i} exit=${r.exit} correct=${r.correct} tr=${r.transcript} err=${r.err}`);

writeFileSync(`${import.meta.dir}/captures/${tag}.json`, JSON.stringify(
	{ tag, account, N, wall_ms: wall, loadBefore, loadAfter, at: new Date().toISOString(),
	  latency_ms: { min: lat[0], p50: pct(0.5), p90: pct(0.9), max: lat[lat.length-1] }, rows },
	null, 2) + "\n");
writeFileSync(`${import.meta.dir}/captures/${tag}.sids`, rows.map((r) => r.sid).join("\n") + "\n");
console.log(`sids -> captures/${tag}.sids`);
