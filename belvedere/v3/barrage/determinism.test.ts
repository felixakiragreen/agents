// Bar 3 — determinism under parallel workers.
//
// The claim the whole instrument rests on: **a red reproduces from its seed
// alone.** That has to survive the way the barrage actually runs — eight runs
// at a time, parallel steps inside each one finishing in whatever order the
// scheduler hands them. So the same three seeds are run twice each, all six at
// once, and the terminal verdicts must match seed for seed.
//
// The run *log* is deliberately not compared: parallel steps finish in whatever
// order they finish in, and the log records that order as fact (replay.ts).
// What must be identical is where every step ended.

import { test, expect } from "bun:test";
import { rmSync } from "node:fs";
import { runChild, outcomeOf } from "./child.ts";
import { judge } from "./oracle.ts";
import { topology } from "./topology.ts";

const SCRATCH = "/private/tmp/v3-barrage-test/determinism";
const SEEDS = [4, 12, 33];

test("same seed ⇒ byte-identical flow file and identical verdicts, six runs in parallel", async () => {
	rmSync(SCRATCH, { recursive: true, force: true });

	const runs = SEEDS.flatMap((seed) => [0, 1].map((pass) => ({ seed, pass, dir: `${SCRATCH}/${seed}-${pass}` })));
	await Promise.all(runs.map(async (r) => { await runChild(r.seed, r.dir, 60_000); }));

	for (const seed of SEEDS) {
		const [a, b] = [0, 1].map((pass) => `${SCRATCH}/${seed}-${pass}`);
		const first = judge(a!, outcomeOf(a!));
		const second = judge(b!, outcomeOf(b!));

		expect([seed, first.reds]).toEqual([seed, []]);
		expect([seed, second.reds]).toEqual([seed, []]);
		expect([seed, first.verdicts]).toEqual([seed, second.verdicts]);
		expect([seed, Object.keys(first.verdicts).length]).toEqual([seed, topology(seed).size]);
		// And the flow file itself, byte for byte, from two separate processes.
		expect([seed, await Bun.file(`${a}/flow.json`).text()]).toEqual([seed, await Bun.file(`${b}/flow.json`).text()]);
	}
}, 180_000);
