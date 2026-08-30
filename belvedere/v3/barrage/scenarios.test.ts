// The scenario table, measured (charge bar 4, C6 F7's warning made checkable).
//
// Every row is spawned through the engine's own `ignite()` and compared with
// what the table declares. A declared property nobody has run is exactly the
// assumption C6 F7 warned about — *"a fuzzer that plants crash cuts on schema
// scenarios will read every one of them as dead"* — so the table is not
// allowed to be a claim.

import { test, expect } from "bun:test";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { ignite } from "../engine/spawn.ts";
import { isRefusal } from "../engine/refusal.ts";
import type { Reading } from "../engine/sense.ts";
import { SCENARIOS, type Klass } from "./scenarios.ts";

const LIBRARY = new URL("../fake-claude/scenarios", import.meta.url).pathname;
const SCRATCH = "/private/tmp/v3-barrage-test/scenarios";

/** The stream's own account of one turn, in the table's vocabulary. */
const klassOf = (r: Reading): Klass =>
	r.timedOut ? "hang" : r.dead ? "dead" : r.denials.length > 0 ? "denied" : "worked";

async function measure(scenario: string, timeoutMs: number): Promise<Reading> {
	const runDir = `${SCRATCH}/${scenario}`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(`${runDir}/work`, { recursive: true });
	const spawned = ignite({
		step: { kind: "task", id: scenario, depends: [], model: "sonnet", effort: "low",
			posture: "acceptEdits", timeoutMs, prompt: `classify/${scenario}`,
			subject: { fake: { scenario, seed: 5 } } },
		venue: { workDir: `${runDir}/work`, configDir: `${runDir}/config` },
		sessionId: crypto.randomUUID(), resume: false, prompt: `classify/${scenario}`,
		stream: `${runDir}/streams/${scenario}.t0.jsonl`,
	});
	if (isRefusal(spawned)) throw new Error(spawned.refusal);
	return spawned.settled;
}

test("the table names every scenario in the library, and nothing else", () => {
	const library = readdirSync(LIBRARY).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
	expect(SCENARIOS.map((s) => s.name).sort()).toEqual(library);
	expect(SCENARIOS.length).toBe(23);
});

test("every row's act count is the scenario file's own", () => {
	for (const row of SCENARIOS) {
		const acts = (JSON.parse(readFileSync(`${LIBRARY}/${row.name}.json`, "utf8")) as { acts: unknown[] }).acts.length;
		expect([row.name, row.acts]).toEqual([row.name, acts]);
	}
});

for (const row of SCENARIOS) {
	test(`${row.name}: ${row.klass}, ${row.result ? "a result reaches" : "no result reaches"} the stream file`, async () => {
		const reading = await measure(row.name, row.timeoutMs);
		expect([row.name, klassOf(reading)]).toEqual([row.name, row.klass]);
		// `dead` is precisely "no `result` row at EOF" — the property that decides
		// whether a restart reads the stream file or falls to the transcript.
		expect([row.name, !reading.dead]).toEqual([row.name, row.result]);
		expect([row.name, reading.granted]).toEqual([row.name, row.grants ?? "acceptEdits"]);
		// The stream file exists on disk either way: that is what step 0 bought.
		expect(existsSync(`${SCRATCH}/${row.name}/streams/${row.name}.t0.jsonl`)).toBe(true);
	}, 20_000);
}
