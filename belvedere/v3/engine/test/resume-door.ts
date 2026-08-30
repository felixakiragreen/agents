#!/usr/bin/env bun
// The F3 red's driver, run as a child because the cut is a real SIGKILL.
//
// Turn 0 runs to its pause. The ruling then resumes past the fake's last act —
// the door death (C7 F2): the subject refuses the turn and writes nothing, to
// the stream or to the transcript. The crash seam is armed **between** the two,
// so the cut lands on the resume and not on turn 0's own ignition, and what is
// left on disk is a step the log says is running whose only evidence is a torn
// stream.
//
// The next engine must answer for THAT turn. The turn before it, still sitting
// in the same transcript file, says `worked`.
//
//   bun test/resume-door.ts <flow> <runDir> <step>

import { CRASH_AT } from "../crash.ts";
import { load } from "../engine.ts";
import { isRefusal } from "../refusal.ts";

const [flowPath, runDir, stepId] = process.argv.slice(2);
if (flowPath === undefined || runDir === undefined || stepId === undefined)
	throw new Error("usage: resume-door.ts <flowPath> <runDir> <stepId>");

const run = load(flowPath, { runDir });
if (isRefusal(run)) throw new Error(run.refusal);

const must = (v: true | { refusal: string }): void => { if (isRefusal(v)) throw new Error(v.refusal); };

must(run.bless());
await run.run();
process.env[CRASH_AT] = `after-ignite:${stepId}`;
must(await run.rule(stepId, { do: "resume", turn: "one turn more than the scenario scripts" }));
throw new Error(`the crash seam never fired — ${stepId} resumed and returned`);
