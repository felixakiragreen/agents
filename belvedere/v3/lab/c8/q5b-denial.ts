#!/usr/bin/env bun
// Q5, continued — parse rule 2 on real bytes.
//
// The first ladder (`q5-needs.ts`) failed to produce a single denial: under
// `auto` at sonnet the substrate granted an out-of-workspace Write, an arbitrary
// Bash command and a WebFetch to the public internet, and all three did the
// work. So `auto` cannot induce ‹needs-⬡ permission›, and the engine's most
// dangerous parse rule would go unmeasured on real bytes.
//
// `acceptEdits` is the pair that should refuse: it accepts edits and nothing
// else, so a Bash call under it is the denial C4 F6 says arrives as `exit 0` +
// `subtype: "success"` + a non-empty `permission_denials[]`. That silent success
// is the hazard the whole sensing design exists to catch — it has to be seen.
//
//   bun q5b-denial.ts [account]

import { isRefusal } from "../../engine/refusal.ts";
import { senseFile } from "../../engine/sense.ts";
import { streamPath } from "../../engine/spawn.ts";
import { open, task, REPORT_RULE } from "./drill.ts";
import { ALL, type Account } from "./accounts.ts";

const account = (process.argv[2] ?? "personal") as Account;
if (!ALL.includes(account)) throw new Error(`unknown account ${account}`);

const RUNGS: { rung: string; posture: string; prompt: string }[] = [
	{
		rung: "acceptEdits-bash", posture: "acceptEdits",
		prompt: "Use the Bash tool to run this exact command: `/bin/date +%Y`. Report what it printed. " + REPORT_RULE,
	},
	{
		rung: "acceptEdits-fetch", posture: "acceptEdits",
		prompt: "Use the WebFetch tool to fetch https://example.com and report its title. " + REPORT_RULE,
	},
];

for (const { rung, posture, prompt } of RUNGS) {
	const opened = open({
		drill: `q5b-${rung}-${account}`, account,
		flow: {
			id: `q5b${rung.replace(/-/g, "")}`, name: `denial probe: ${rung}`, budget: 2,
			steps: [task("t", prompt, [], { posture })],
		},
	});
	if (isRefusal(opened)) throw new Error(opened.refusal);
	if (isRefusal(opened.run.bless())) throw new Error("bless refused");
	const state = await opened.run.run();
	const at = state.steps.t;
	const r = senseFile(streamPath(opened.runDir, "t", 0), posture as "acceptEdits");

	console.log(`## ${rung} (asked ${posture}, init granted ${r.granted})`);
	console.log(`   the substrate's own success signals: is_error=${r.errored} results=${r.results} text=${JSON.stringify(r.text.slice(0, 80))}`);
	console.log(`   permission_denials[] = ${JSON.stringify(r.denials)}`);
	console.log(`   the engine's verdict:  ${at?.at}${at?.at === "paused" ? ` ‹${at.causes.join(", ")}› — ${at.detail}` : ""}`);
	console.log(`   stream ${streamPath(opened.runDir, "t", 0)}\n`);
	if (r.denials.length > 0) break;
}
