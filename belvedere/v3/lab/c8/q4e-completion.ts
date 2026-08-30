#!/usr/bin/env bun
// The transcript completion signal, measured across every real session this dig
// has created — and against the two C4-born fixtures it was derived from.
//
// `transcript.ts` states the rule and where it came from: "a turn is complete
// iff its last conversation row is an `assistant` row carrying no `tool_use`
// block … Measured on C4's own captures: q6-SIGKILL's cut turn ends at a
// `user`/`tool_result` row, q6-PARENT's orphan and q1-write's denial both end at
// an `assistant` text row."
//
// None of those captures declared `--json-schema`. The engine declares it on
// every step (`REPORT_SCHEMA`, `argvFor`), and the report arrives as a
// `StructuredOutput` **tool call** — whose `tool_result` is then the last
// conversation row of the turn. So the rule's own signature for "work was in
// flight when the writing stopped" is exactly what a cleanly finished engine
// turn looks like.
//
// Spend: zero. Every byte here was already bought.
//
//   bun q4e-completion.ts

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { readLog } from "../../engine/log.ts";
import { readTranscript, transcriptPath, transcriptRows } from "../../engine/transcript.ts";
import { ACCOUNTS, type Account } from "./accounts.ts";
import { RUNS } from "./meter.ts";

type Session = { drill: string; account: Account; workDir: string; step: string; sid: string; landed: boolean };

function sessions(): Session[] {
	const found: Session[] = [];
	for (const drill of readdirSync(RUNS)) {
		const dir = `${RUNS}/${drill}`;
		if (!statSync(dir).isDirectory() || !existsSync(`${dir}/run.jsonl`)) continue;
		const conditions = JSON.parse(readFileSync(`${dir}/conditions.json`, "utf8")) as { account: Account; workDir: string };
		const landedSteps = new Set<string>();
		const sids = new Map<string, string>();
		for (const e of readLog(`${dir}/run.jsonl`)) {
			if (e.kind === "ignited") sids.set(e.step, e.sessionId);
			if (e.kind === "landed") landedSteps.add(e.step);
		}
		for (const [step, sid] of sids)
			found.push({ drill, account: conditions.account, workDir: conditions.workDir, step, sid, landed: landedSteps.has(step) });
	}
	return found;
}

/** The last row of the file that the reader treats as conversation. */
function lastConversationRow(path: string): string {
	let last = "(none)";
	for (const line of readFileSync(path, "utf8").split("\n")) {
		if (line === "") continue;
		let row: Record<string, unknown>;
		try { row = JSON.parse(line) as Record<string, unknown>; } catch { continue; }
		if (row.type !== "user" && row.type !== "assistant") continue;
		const content = (row.message as { content?: unknown } | undefined)?.content;
		const blocks = Array.isArray(content) ? (content as { type?: string; name?: string }[]) : [];
		last = `${String(row.type)}/${typeof content === "string" ? "text" : blocks.map((b) => `${b.type}${b.name === undefined ? "" : `:${b.name}`}`).join(",")}`;
	}
	return last;
}

const all = sessions();
const rows: { session: Session; last: string; complete: boolean; verdict: string; rows: number }[] = [];
let missing = 0;

for (const s of all) {
	const path = transcriptPath(ACCOUNTS[s.account], s.workDir, s.sid);
	if (!existsSync(path)) { missing++; continue; }
	const reading = readTranscript(path, 0);
	rows.push({ session: s, last: lastConversationRow(path), complete: reading.complete, verdict: reading.verdict, rows: transcriptRows(path) });
}

const landed = rows.filter((r) => r.session.landed);
const byLast: Record<string, number> = {};
for (const r of rows) byLast[r.last] = (byLast[r.last] ?? 0) + 1;

console.log(`# the transcript completion signal on real bytes`);
console.log(`sessions found ${all.length} · transcripts on disk ${rows.length} · missing ${missing}\n`);

console.log(`last conversation row, over every real session this dig created:`);
for (const [shape, n] of Object.entries(byLast).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${shape}`);

console.log(`\nof the ${landed.length} turns the ENGINE LANDED from the stream (they demonstrably worked):`);
const wrong = landed.filter((r) => !r.complete);
console.log(`  the transcript reader calls ${wrong.length} of them incomplete -> verdict "dead"`);
console.log(`  it calls ${landed.length - wrong.length} of them complete`);

const byAccount: Record<string, { n: number; wrong: number }> = {};
for (const r of landed) {
	const a = (byAccount[r.session.account] ??= { n: 0, wrong: 0 });
	a.n++;
	if (!r.complete) a.wrong++;
}
console.log(`  by account:`);
for (const [a, v] of Object.entries(byAccount)) console.log(`    ${a.padEnd(14)} ${v.wrong}/${v.n} landed turns read as dead`);

// The control column: the same reader, the same day, on the two C4-born
// fixtures — real bytes from turns that declared no schema.
console.log(`\n# the control — C4-born real transcripts, no --json-schema declared`);
const FIX = new URL("../../engine/test/fixtures/", import.meta.url).pathname;
for (const f of ["real-q2-a-resume.jsonl", "real-q5b-summon.jsonl"]) {
	const path = `${FIX}${f}`;
	if (!existsSync(path)) { console.log(`  ${f}: absent`); continue; }
	const reading = readTranscript(path, 0);
	console.log(`  ${f.padEnd(24)} rows=${transcriptRows(path)} last=${lastConversationRow(path)} complete=${reading.complete} verdict=${reading.verdict}`);
}

console.log(`\nsample, three landed turns and what the fallback would have said:`);
for (const r of landed.slice(0, 3))
	console.log(`  ${r.session.drill}/${r.session.step} (${r.session.account}) rows=${r.rows} last=${r.last} -> ${r.verdict}`);
