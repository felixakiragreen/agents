// Bar 3 — the oracle green on the demo log, and red on logs it must catch. An
// oracle nobody has seen fail is a claim without evidence (the negative control
// law), so each corruption below is cut from the real fixture, named, and
// asserted to trip the invariant it violates.
import { test, expect } from "bun:test";
import { writeFileSync } from "node:fs";
import { readLog, type Entry } from "../log.ts";
import { check, invariants } from "../invariants.ts";
import { HERE, SCRATCH } from "./harness.ts";

const FIXTURE = `${HERE}/test/fixtures/demo-run.jsonl`;
const entries = (): Entry[] => readLog(FIXTURE);

/** Seq numbers are renumbered so the only defect is the one being planted. */
function corrupt(name: string, edit: (e: Entry[]) => Entry[]): string {
	const path = `${SCRATCH}/corrupt-${name}.jsonl`;
	const rows = edit(entries()).map((e, seq) => ({ ...e, seq }));
	writeFileSync(path, rows.map((e) => JSON.stringify(e)).join("\n") + "\n");
	return path;
}

const indexOf = (rows: Entry[], kind: Entry["kind"], step: string): number =>
	rows.findIndex((e) => e.kind === kind && "step" in e && e.step === step);

test("green on the demo log — all nine", () => {
	expect(invariants(FIXTURE)).toEqual([]);
	expect(check(entries())).toEqual([]);
});

test("red: a planted double ignition — invariant 1, exactly-once", () => {
	const path = corrupt("double-ignition", (rows) => {
		const i = indexOf(rows, "ignited", "fan-a");
		return [...rows.slice(0, i + 1), rows[i]!, ...rows.slice(i + 1)];
	});
	const v = invariants(path);
	expect(v.filter((x) => x.invariant === 1)).not.toEqual([]);
	expect(v[0]!.name).toBe("exactly-once");
	expect(v[0]!.step).toBe("fan-a");
});

test("red: a planted order violation — invariant 2, order", () => {
	const path = corrupt("order", (rows) => {
		const fired = rows.splice(indexOf(rows, "ignited", "fan-a"), 1)[0]!;
		return [...rows.slice(0, indexOf(rows, "landed", "prep")), fired, ...rows.slice(indexOf(rows, "landed", "prep"))];
	});
	const v = invariants(path);
	expect(v.filter((x) => x.invariant === 2)).not.toEqual([]);
	expect(v.find((x) => x.invariant === 2)!.detail).toContain("ignited while its edge prep was");
});

test("red: a planted ignition past an unruled gate — invariant 3, gates hold", () => {
	const path = corrupt("unruled-gate", (rows) =>
		rows.filter((e) => !(("step" in e && e.step === "gate") && (e.kind === "ruled" || e.kind === "landed"))));
	const v = invariants(path);
	expect(v.filter((x) => x.invariant === 3)).not.toEqual([]);
	expect(v.find((x) => x.invariant === 3 && x.step === "finish")!.detail).toContain("past gate");
});

test("red: an ignition outside the blessed scope — invariant 4, scope", () => {
	const path = corrupt("out-of-scope", (rows) => rows.map((e) =>
		e.kind === "blessed" ? { ...e, scope: e.scope.filter((s) => s !== "finish") } : e));
	expect(invariants(path).filter((x) => x.invariant === 4)).not.toEqual([]);
});

test("red: a pause with no cause — invariant 5, loud pauses", () => {
	const path = corrupt("silent-pause", (rows) => rows.map((e) =>
		e.kind === "paused" && e.step === "crash" ? { ...e, causes: [], detail: "" } : e));
	expect(invariants(path).filter((x) => x.invariant === 5).length).toBe(2);
});

test("red: a log that ends with a step still in flight — invariant 6, clean terminals", () => {
	const path = corrupt("orphan", (rows) => rows.slice(0, indexOf(rows, "turn-ended", "prep")));
	const v = invariants(path);
	expect(v.filter((x) => x.invariant === 6)).not.toEqual([]);
	expect(v.find((x) => x.invariant === 6)!.step).toBe("prep");
});

test("red: a turn past the ceiling — invariant 9, budget", () => {
	const path = corrupt("over-budget", (rows) => rows.map((e) =>
		e.kind === "blessed" ? { ...e, budget: 3 } : e));
	expect(invariants(path).filter((x) => x.invariant === 9)).not.toEqual([]);
});
