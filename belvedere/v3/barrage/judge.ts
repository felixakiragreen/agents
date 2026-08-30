#!/usr/bin/env bun
// The repro's second half — judge one run dir, print what the oracle sees.
//
//   bun judge.ts --run <dir>
//
// Every red file names this command beside `one.ts`: the two together are the
// whole reproduction, and neither needs anything but the seed.

import { judge } from "./oracle.ts";
import { outcomeOf } from "./child.ts";

const argv = process.argv.slice(2);
const i = argv.indexOf("--run");
const runDir = i === -1 ? null : argv[i + 1] ?? null;
if (runDir === null) { console.error("usage: judge.ts --run <dir>"); process.exit(2); }

const verdict = judge(runDir, outcomeOf(runDir));
for (const [id, at] of Object.entries(verdict.verdicts)) console.log(`${id}\t${at}`);
console.log("");
for (const r of verdict.reds) console.log(`${r.invariant} ${r.name}\t${r.step || "—"}\t${r.detail}`);
console.log(verdict.reds.length === 0 ? "invariants: 9/9 green" : `invariants: ${verdict.reds.length} violations`);
process.exit(verdict.reds.length === 0 ? 0 : 1);
