#!/usr/bin/env bun
// Q5 — needs-⬡ live: the three ways a real step refuses to land, each measured
// once, cheaply.
//
//   posture   (model, posture) the substrate cannot grant is refused at bless —
//             before a turn is spent. Zero turns, and the control that proves it
//             is not theoretical costs one raw haiku turn (C4 F6.2's read-back).
//   question  a step that cannot proceed without a human reports `needs_input`,
//             and the engine pauses ‹needs-⬡ question› carrying the question.
//             This is C4 F5's structural fix: without the report, a question is
//             byte-identical to a finished turn.
//   denial    a tool the posture will not grant lands in `permission_denials[]`,
//             and the step pauses ‹needs-⬡ permission› — never LANDED, which is
//             C4 F6's silent success, the most dangerous physics of headless.
//
//   bun q5-needs.ts [account]

import { spawn } from "node:child_process";
import { isRefusal } from "../../engine/refusal.ts";
import { senseFile } from "../../engine/sense.ts";
import { streamPath } from "../../engine/spawn.ts";
import { REPORT_SCHEMA, senseLine, emptyReading } from "../../engine/sense.ts";
import { open, task, REPORT_RULE } from "./drill.ts";
import { ACCOUNTS, ALL, type Account } from "./accounts.ts";

const account = (process.argv[2] ?? "personal") as Account;
if (!ALL.includes(account)) throw new Error(`unknown account ${account}`);

const line = (s: string) => console.log(s);

// ── posture: the bless-time refusal, zero turns ───────────────────────────────
{
	const opened = open({
		drill: `q5-posture-${account}`, account,
		flow: {
			id: "q5posture", name: "haiku asked for auto", budget: 2,
			steps: [task("h", "Reply OK.", [], { model: "haiku", effort: "low", posture: "auto" })],
		},
	});
	if (isRefusal(opened)) throw new Error(opened.refusal);
	const blessed = opened.run.bless();
	line(`## posture — bless refused: ${isRefusal(blessed) ? "YES" : "NO"}`);
	line(isRefusal(blessed) ? `   ${blessed.refusal}` : `   *** the gate did not fire ***`);
	line(`   turns spent: ${opened.run.state().turns}`);
}

// ── posture: the control — what the substrate actually grants haiku for `auto`.
// One raw turn against the real binary, outside the engine, because the engine
// (correctly) will not spend one. C4 F6.2 measured `default`; this re-measures it
// today, so the refusal above is protecting against a live fact, not a memory.
{
	const argv = [
		"-p", "Reply with exactly the word OK.",
		"--model", "haiku", "--effort", "low",
		"--permission-mode", "auto",
		"--json-schema", REPORT_SCHEMA,
		"--output-format", "stream-json", "--verbose",
	];
	const out = await new Promise<string>((done) => {
		const p = spawn(`${process.env.HOME}/.local/bin/claude`, argv, {
			cwd: "/tmp",
			env: {
				HOME: process.env.HOME!, USER: process.env.USER!, SHELL: "/bin/zsh",
				PATH: process.env.PATH!, LANG: "en_US.UTF-8", TMPDIR: process.env.TMPDIR ?? "/tmp/",
				CLAUDE_CONFIG_DIR: ACCOUNTS[account],
			},
		});
		let buf = "";
		p.stdout.on("data", (d: Buffer) => { buf += d.toString(); });
		p.on("close", () => { done(buf); });
	});
	const r = emptyReading("auto");
	for (const l of out.split("\n")) senseLine(r, l);
	line(`\n## posture control — the substrate's own answer, one raw haiku turn`);
	line(`   asked auto · init granted ${JSON.stringify(r.granted)} · match ${r.granted === "auto"}`);
	line(`   (C4 F6.2 measured \`default\`; a match here would falsify the bless gate)`);
}

// ── question ─────────────────────────────────────────────────────────────────
{
	const opened = open({
		drill: `q5-question-${account}`, account,
		flow: {
			id: "q5question", name: "a step that cannot proceed without a human", budget: 2,
			steps: [task("ask",
				"Write a configuration file for the deployment. Do not guess any value and do not " +
				"create a placeholder: the filename, the format and the target environment have not " +
				`been given to you, and only a human can supply them. ${REPORT_RULE}`)],
		},
	});
	if (isRefusal(opened)) throw new Error(opened.refusal);
	if (isRefusal(opened.run.bless())) throw new Error("bless refused");
	const state = await opened.run.run();
	const at = state.steps.ask;
	const r = senseFile(streamPath(opened.runDir, "ask", 0), "auto");
	line(`\n## question — ${at?.at}${at?.at === "paused" ? ` ‹${at.causes.join(", ")}›` : ""}`);
	line(`   report ${JSON.stringify(r.report)}`);
	line(`   result subtype looked like success: is_error=${r.errored} results=${r.results} denials=${r.denials.length}`);
	line(`   detail ${at?.at === "paused" ? at.detail : "—"}`);
}

// ── denial ───────────────────────────────────────────────────────────────────
// A ladder, because "which tool `auto` refuses" is a measurement, not a memory.
// Each rung costs one turn; the ladder stops at the first denial.
const RUNGS: Record<string, string> = {
	outside: "Write the exact text HELLO-C8 into the file /tmp/c8-denial-probe.txt. " +
		"That path is deliberately outside your working directory. " + REPORT_RULE,
	bash: "Use the Bash tool to run this exact command: `/usr/sbin/networksetup -listallnetworkservices`. " +
		"Report what it printed. " + REPORT_RULE,
	fetch: "Use the WebFetch tool to fetch https://example.com and report its title. " + REPORT_RULE,
};

line(`\n## denial — the ladder (stops at the first non-empty permission_denials[])`);
for (const [rung, prompt] of Object.entries(RUNGS)) {
	const opened = open({
		drill: `q5-denial-${rung}-${account}`, account,
		flow: { id: `q5denial${rung}`, name: `denial probe: ${rung}`, budget: 2, steps: [task("t", prompt)] },
	});
	if (isRefusal(opened)) throw new Error(opened.refusal);
	if (isRefusal(opened.run.bless())) throw new Error("bless refused");
	const state = await opened.run.run();
	const at = state.steps.t;
	const r = senseFile(streamPath(opened.runDir, "t", 0), "auto");
	line(`   ${rung.padEnd(8)} exit=${r.exit} is_error=${r.errored} denials=${r.denials.length} ` +
		`${JSON.stringify(r.denials.map((d) => d.tool))} -> ${at?.at}${at?.at === "paused" ? ` ‹${at.causes.join(", ")}›` : ""}`);
	if (r.denials.length > 0) { line(`   the silent success: exit ${r.exit}, is_error ${r.errored}, and the step did NOT land`); break; }
}
