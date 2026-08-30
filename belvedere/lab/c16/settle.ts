#!/usr/bin/env bun
// Settle a run whose engine died mid-turn.
//
//   bun lab/c16/settle.ts <run> [--root <dir>]
//
// One `tick()`, which is the engine's own recovery: a step the log says is `running` that this
// process never spawned is **adopted** — the pid is watched, then the stream file on disk is read —
// and the turn becomes the transition it always was (`engine.ts` §adopt, C6 F2's ruled fix).
//
// It exists because C16 made the deck the engine for the turn it resumes (findings F2): kill the
// deck between a subject's `result` row and the engine's `landed` append, and the log stays
// `running` until something opens the run again. The console has no tick verb — its five verbs
// rule, read and summon — so this is the smallest thing that closes that window by hand.

import { isRefusal } from "../../v3/engine/refusal.ts";
import { locate, openRun, TELEMETRY } from "../../v3/console/runs.ts";

const argv = process.argv.slice(2);
const root = argv.includes("--root") ? argv[argv.indexOf("--root") + 1]! : TELEMETRY;
const name = argv.find(a => !a.startsWith("--") && a !== root);
if (name === undefined) { console.error("settle: usage — bun lab/c16/settle.ts <run> [--root <dir>]"); process.exit(2); }

const handle = locate(name, root);
if (isRefusal(handle)) { console.error(`settle: ${handle.refusal}`); process.exit(2); }
const run = openRun(handle);
if (isRefusal(run)) { console.error(`settle: ${run.refusal}`); process.exit(2); }

const before = handle.state.steps;
const after = await run.tick();
for (const [id, at] of Object.entries(after.steps))
	console.log(`${handle.name}/${id}  ${before[id]?.at ?? "?"} -> ${at.at}${at.at === "landed" ? ` ${at.report?.state ?? "by ruling"}` : ""}`);
