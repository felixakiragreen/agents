#!/usr/bin/env bun
// Records the committed demo run log (bar 2). Run it when the demo flow or the
// engine's event set changes; the fixture is the artifact the invariant and
// replay tests judge, and the corrupted logs are cut from it.
//
//   bun test/record.ts

import { copyFileSync } from "node:fs";
import { driveDemo, freshRun, HERE } from "./harness.ts";

const run = await driveDemo(freshRun("record"));
const fixture = `${HERE}/test/fixtures/demo-run.jsonl`;
copyFileSync(run.log.path, fixture);
console.log(`recorded ${run.log.entries().length} events -> ${fixture}`);
for (const [id, at] of Object.entries(run.state().steps)) console.log(`  ${id}\t${at.at}`);
