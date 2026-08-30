// The oracle — cornerstone §5's nine, as one pure module over a run log.
//
// A barrage without machine-checked invariants is theater. This is the check;
// C7 is the fuzzer that feeds it and the mutation drill that proves it can fail.
// It reads a settled log: a log still holding a step in flight is judged as the
// orphan it is (invariant 6), which is exactly what the crash drill asks.
//
// Nothing here consults the engine, the clock, or the machine — the log carries
// its own flow, so a log is judged from itself alone.

import { stepById, type Flow, type Step } from "./flow.ts";
import { readLog, type Entry } from "./log.ts";

export const NINE = [
	"exactly-once", "order", "gates hold", "scope", "loud pauses",
	"clean terminals", "replay", "truth on disk", "budget",
] as const;

export type Violation = { invariant: number; name: string; seq: number; step: string; detail: string };

export const invariants = (logPath: string): Violation[] => check(readLog(logPath));

type At = "pending" | "running" | "paused" | "landed" | "killed";

export function check(entries: readonly Entry[]): Violation[] {
	const v: Violation[] = [];
	const add = (n: number, seq: number, step: string, detail: string) =>
		v.push({ invariant: n, name: NINE[n - 1]!, seq, step, detail });

	let flow: Flow | null = null;
	let scope = new Set<string>();
	let budget = 0, turns = 0;
	let halted: number | null = null;
	const at = new Map<string, At>();
	const ignitions = new Map<string, number>();
	const ruled = new Set<string>();
	const paused = new Set<string>();
	const ended = new Set<string>();

	const known = (id: string): Step | undefined => (flow === null ? undefined : stepById(flow, id));

	/** Every gate and card the step rests on, however deep. Invariant 2 covers
	 *  the direct edges; this covers a log that landed a card the gate never freed. */
	function heldBy(id: string): string[] {
		const held: string[] = [];
		const seen = new Set<string>([id]);
		const walk = (cur: string) => {
			for (const dep of known(cur)?.depends ?? []) {
				if (seen.has(dep)) continue;
				seen.add(dep);
				const kind = known(dep)?.kind;
				if (kind === "gate" || kind === "card") held.push(dep);
				walk(dep);
			}
		};
		walk(id);
		return held;
	}

	for (const e of entries) {
		const step = "step" in e ? e.step : "";
		if (step !== "" && flow !== null && known(step) === undefined)
			add(7, e.seq, step, `the log names a step the flow does not declare`);

		switch (e.kind) {
			case "blessed":
				if (flow !== null) add(7, e.seq, "", "a second `blessed` event — only the first carries the flow");
				flow = e.flow; scope = new Set(e.scope); budget = e.budget;
				for (const s of flow.steps) at.set(s.id, "pending");
				break;

			case "re-blessed":
				if (flow === null) { add(7, e.seq, "", "`re-blessed` before any blessing"); break; }
				for (const id of e.scope)
					if (known(id) === undefined) add(4, e.seq, id, "a re-blessing names a step the flow does not declare");
				if (e.budget < turns) add(9, e.seq, "", `a re-blessing set the ceiling to ${e.budget} below the ${turns} turns already spent`);
				scope = new Set([...scope, ...e.scope]);
				budget = e.budget;
				break;

			case "ignited": {
				const s = known(step);
				ignitions.set(step, (ignitions.get(step) ?? 0) + 1);
				turns++;
				if ((ignitions.get(step) ?? 0) > 1) add(1, e.seq, step, `ignited ${ignitions.get(step)} times — a step ignites exactly once per blessing`);
				if (at.get(step) === "landed" || at.get(step) === "killed") add(1, e.seq, step, `ignited after it was already ${at.get(step)}`);
				if (!scope.has(step)) add(4, e.seq, step, "ignited outside the blessed scope");
				if (s?.kind === "card") add(3, e.seq, step, "a card ignited — a card has no subject and never ignites");
				for (const dep of s?.depends ?? [])
					if (at.get(dep) !== "landed") add(2, e.seq, step, `ignited while its edge ${dep} was ${at.get(dep) ?? "unknown"}`);
				for (const held of heldBy(step))
					if (at.get(held) !== "landed") add(3, e.seq, step, `ignited past ${held}, which was ${at.get(held) ?? "unknown"}`);
				if (turns > budget) add(9, e.seq, step, `turn ${turns} past the ceiling of ${budget}`);
				if (halted !== null) add(6, e.seq, step, "ignited after the run halted");
				if (e.sessionId === "") add(8, e.seq, step, "ignited with no session id — the run log cannot address the subject");
				at.set(step, "running");
				break;
			}

			case "resumed":
				turns++;
				if (at.get(step) !== "paused") add(7, e.seq, step, `resumed from ${at.get(step) ?? "unknown"} — only a paused step is resumed by a ruling`);
				if (!ruled.has(step)) add(3, e.seq, step, "resumed without a ruling");
				if (turns > budget) add(9, e.seq, step, `turn ${turns} past the ceiling of ${budget}`);
				at.set(step, "running");
				break;

			case "turn-ended":
				if (at.get(step) !== "running") add(7, e.seq, step, `a turn ended for a step that was ${at.get(step) ?? "unknown"}`);
				ended.add(step);
				break;

			case "landed": {
				const kind = known(step)?.kind;
				if (at.get(step) === "landed" || at.get(step) === "killed") add(7, e.seq, step, `landed while already ${at.get(step)}`);
				if (kind !== "card" && !ended.has(step)) add(8, e.seq, step, "landed without a turn ever ending — the status does not match what happened");
				if ((kind === "card" || kind === "gate") && !ruled.has(step)) add(3, e.seq, step, `a ${kind} landed unruled`);
				for (const dep of known(step)?.depends ?? [])
					if (at.get(dep) !== "landed") add(2, e.seq, step, `landed while its edge ${dep} was ${at.get(dep) ?? "unknown"}`);
				for (const held of heldBy(step))
					if (at.get(held) !== "landed") add(3, e.seq, step, `landed past ${held}, which was ${at.get(held) ?? "unknown"}`);
				at.set(step, "landed");
				break;
			}

			case "paused":
				if (e.causes.length === 0) add(5, e.seq, step, "a pause with no cause is a silent stall");
				if (e.detail.trim() === "") add(5, e.seq, step, "a pause with no detail names nothing a reader can act on");
				if (at.get(step) === "landed" || at.get(step) === "killed") add(7, e.seq, step, `paused while already ${at.get(step)}`);
				paused.add(step);
				at.set(step, "paused");
				break;

			case "ruled":
				if (at.get(step) !== "paused") add(7, e.seq, step, `ruled while ${at.get(step) ?? "unknown"} — only a paused step takes a ruling`);
				ruled.add(step);
				break;

			case "killed":
				if (at.get(step) === "landed") add(7, e.seq, step, "killed after it landed");
				at.set(step, "killed");
				break;

			case "halted":
				halted = e.seq;
				break;

			case "ceiling":
				if (e.turns < e.budget) add(9, e.seq, "", `a ceiling event at ${e.turns} turns, below the ceiling of ${e.budget}`);
				break;
		}
	}

	if (flow === null) return v;
	const last = entries.at(-1)?.seq ?? 0;

	for (const s of flow.steps) {
		const state = at.get(s.id);
		if (state === "running")
			add(6, last, s.id, "the log ends with the step still in flight — an orphan the run never accounted for");
		if (state === "paused" && !paused.has(s.id))
			add(5, last, s.id, "paused with no pause event");
		if (state === "pending" && scope.has(s.id) && halted === null &&
			s.depends.every((d) => at.get(d) === "landed"))
			add(5, last, s.id, "every edge landed and the step neither ignited nor paused — a silent stall");
	}
	if (turns > budget) add(9, last, "", `${turns} turns spent against a ceiling of ${budget}`);

	return v;
}
