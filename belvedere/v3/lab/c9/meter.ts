#!/usr/bin/env bun
// C9's budget meter — the ⬡-fork alarm, run after every real arm.
//
// Same accounting as C8's (`ignited`/`resumed` cost a turn; dollars summed from
// every `result.total_cost_usd` in the streams), pointed at C9's own run root
// and carrying C9's own ceilings: **≤$8 and ≤120 turns, dollars leading**
// (C8 F9's ruling, the batch-8 line).
//
// Fake runs cost nothing and spend no account turns, so only the real ladder's
// runs live under this root — Q1's fake runs write to `RUNS_FAKE`, which this
// never counts.

import { meter, type Meter } from "../c8/meter.ts";

export const RUNS = new URL("../../../../summon/log/v3/c9", import.meta.url).pathname;
export const RUNS_FAKE = new URL("../../../../summon/log/v3/c9-fake", import.meta.url).pathname;

export const TURN_CEILING = 120;
export const COST_CEILING = 8;

export const c9meter = (): Meter => meter(RUNS);

if (import.meta.main) {
	const m = c9meter();
	for (const r of m.byRun) console.log(`${String(r.turns).padStart(3)}  $${r.cost.toFixed(4)}  ${r.run}`);
	console.log(`\nturns ${m.turns}/${TURN_CEILING} (${m.offLog} off-log) · cost $${m.cost.toFixed(4)}/$${COST_CEILING}`);
	if (m.turns > TURN_CEILING || m.cost > COST_CEILING) {
		console.error("CEILING HIT — stop the dig, file what stands, ⬡-fork to Felix (D21)");
		process.exit(1);
	}
}
