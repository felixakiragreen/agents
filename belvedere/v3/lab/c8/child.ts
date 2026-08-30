#!/usr/bin/env bun
// The engine as a child process, aimed at a real account — so the drill can
// SIGKILL it for real. A test runner that took the cut would prove nothing
// (`engine/test/crash.test.ts`'s reason, on real subjects).
//
// The engine's own `cli.ts` cannot do this: it has no way to name an account,
// which is the whole of what layer 1 adds. Everything else here is `cli.ts`.
//
//   V3_ENGINE_CRASH_AT=<point> bun child.ts <runDir> <workDir> <account>
//                             [--bless] [--resume <step> <text>]
//
// `--resume` rules a paused step back into flight before running, so a drill can
// arm the crash seam on the RESUME rather than on the first ignition — the only
// way to cut a turn that already has a predecessor in the transcript, which is
// the whole of what the cursor is for (C11).

import { load } from "../../engine/engine.ts";
import { isRefusal } from "../../engine/refusal.ts";
import { venueOn, type Account } from "./accounts.ts";

const [runDir, workDir, account, ...rest] = process.argv.slice(2);
if (runDir === undefined || workDir === undefined || account === undefined)
	throw new Error("usage: child.ts <runDir> <workDir> <account> [--bless]");

const run = load(`${runDir}/flow.json`, {
	runDir,
	venue: venueOn(account as Account, workDir),
});
if (isRefusal(run)) { console.error(run.refusal); process.exit(2); }

if (rest.includes("--bless")) {
	const blessed = run.bless();
	if (isRefusal(blessed)) { console.error(blessed.refusal); process.exit(2); }
}

if (rest.includes("--resume")) {
	const i = rest.indexOf("--resume");
	const step = rest[i + 1], text = rest[i + 2];
	if (step === undefined || text === undefined) throw new Error("--resume wants <step> <text>");
	const ruled = await run.rule(step, { do: "resume", turn: text });
	if (isRefusal(ruled)) { console.error(ruled.refusal); process.exit(2); }
}

const state = await run.run();
for (const [id, at] of Object.entries(state.steps))
	console.log(`${id}\t${at.at}${at.at === "paused" ? `\t‹${at.causes.join(", ")}› ${at.detail}` : ""}`);
console.log(`turns ${state.turns}/${state.budget}`);
