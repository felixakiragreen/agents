#!/usr/bin/env bun
// C10's budget meter — the ⬡-fork alarm for the console's one real rehearsal.
//
// Same accounting as C8's and C9's (`ignited`/`resumed` each cost a turn;
// dollars summed from every `result.total_cost_usd` in the streams), pointed at
// C10's own run root and carrying C10's own ceilings: **≤$3 and ≤30 turns,
// dollars leading** (C8 F9's ruling, the batch-8 line).
//
// The rehearsal's summon leg types a turn into a pane the engine never fired.
// That turn is not in any run log and the account paid for it all the same, so
// it is tallied in `off-log.jsonl` beside the runs and counted here.

import { meter, type Meter } from "../c8/meter.ts";

export const RUNS = new URL("../../../../summon/log/v3/c10", import.meta.url).pathname;

export const TURN_CEILING = 30;
export const COST_CEILING = 3;

export const c10meter = (): Meter => meter(RUNS);

if (import.meta.main) {
	const m = c10meter();
	for (const r of m.byRun) console.log(`${String(r.turns).padStart(3)}  $${r.cost.toFixed(4)}  ${r.run}`);
	console.log(`\nturns ${m.turns}/${TURN_CEILING} (${m.offLog} off-log) · cost $${m.cost.toFixed(4)}/$${COST_CEILING} (off-log turns uncosted)`);
	if (m.turns > TURN_CEILING || m.cost > COST_CEILING) {
		console.error("CEILING HIT — stop the build, file what stands, ⬡-fork to Felix (D21)");
		process.exit(1);
	}
}
