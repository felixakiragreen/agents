// Q7 — enumerate sessions per account from files alone, with identity.
// Two file sources, no process scraping beyond a liveness kill(pid,0):
//   inventory  = <config>/projects/<slug>/<sid>.jsonl  (every session ever)
//   liveness   = the census jsonl (SessionStart with no SessionEnd) + pid alive
import { ACCOUNTS, type Account } from "./lib.ts";
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";

const CENSUS = "/Users/felix/code/agents/summon/log/census/census.jsonl";
const sinceMs = Number(Bun.argv[2] ?? 6 * 3600 * 1000);

type Row = { account: Account; sid: string; cwd: string; mtime: Date; rows: number; live: boolean; pid: string };

// --- liveness, from the census file ---
const open = new Map<string, { pid: string; acct: string; cwd: string }>();
if (existsSync(CENSUS)) {
	for (const line of readFileSync(CENSUS, "utf8").split("\n")) {
		if (!line) continue;
		let b: any; try { b = JSON.parse(line); } catch { continue; }
		if (b.ev === "SessionStart") open.set(b.sid, { pid: b.pid, acct: b.acct, cwd: b.cwd });
		else if (b.ev === "SessionEnd") open.delete(b.sid);
	}
}
const alive = (pid: string) => { try { process.kill(Number(pid), 0); return true; } catch { return false; } };

// --- inventory, from each account's projects dir ---
const out: Row[] = [];
for (const [account, dir] of Object.entries(ACCOUNTS) as [Account, string][]) {
	const proj = `${dir}/projects`;
	if (!existsSync(proj)) continue;
	for (const slug of readdirSync(proj)) {
		let files: string[];
		try { files = readdirSync(`${proj}/${slug}`); } catch { continue; }
		for (const f of files) {
			if (!f.endsWith(".jsonl")) continue;
			const p = `${proj}/${slug}/${f}`;
			const st = statSync(p);
			if (Date.now() - st.mtimeMs > sinceMs) continue;
			const sid = f.replace(/\.jsonl$/, "");
			const o = open.get(sid);
			out.push({ account, sid, cwd: slug, mtime: st.mtime,
				rows: readFileSync(p, "utf8").split("\n").filter(Boolean).length,
				live: !!o && alive(o.pid), pid: o?.pid ?? "-" });
		}
	}
}
out.sort((a, b) => +b.mtime - +a.mtime);

console.log(`sessions touched in the last ${(sinceMs/3600000).toFixed(1)}h, all three accounts:\n`);
console.log("LIVE acct           sid       pid     rows  mtime     cwd");
for (const r of out.slice(0, 40))
	console.log(`${r.live ? " ●  " : " ·  "} ${r.account.padEnd(14)} ${r.sid.slice(0,8)}  ${r.pid.padEnd(7)} ${String(r.rows).padStart(5)}  ${r.mtime.toTimeString().slice(0,8)}  ${r.cwd.slice(-52)}`);

const byAcct = (a: Account) => out.filter((r) => r.account === a);
console.log(`\ntotals: ${out.length} sessions · live ${out.filter(r=>r.live).length}`);
for (const a of Object.keys(ACCOUNTS) as Account[])
	console.log(`  ${a.padEnd(14)} ${String(byAcct(a).length).padStart(3)} sessions, ${byAcct(a).filter(r=>r.live).length} live`);
