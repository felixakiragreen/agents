// Filing a red.
//
// The fence keeps a charge's hands off root protocol files (v3 README, C6 F9),
// so a red lands in `reds/<seed>.md` and is distilled upward at review — that
// relay is how campaign bar 1's "every red files to ISSUES with its seed" is
// met without a fuzz loop writing to `ISSUES.md` at three in the morning.
//
// One property matters more than the prose: **the repro is one command, and it
// needs nothing but the seed.** The topology, the scenario picks, the postures,
// the ceiling, the blessed scope and every ruling are all functions of that
// number, so the file below is enough to put the next reader exactly where the
// oracle was standing.

import { mkdirSync, writeFileSync } from "node:fs";
import type { Red } from "./oracle.ts";
import { topology } from "./topology.ts";

export const REDS = new URL("reds", import.meta.url).pathname;

export type Filing = { seed: number; path: string; reds: Red[] };

export function fileRed(seed: number, reds: Red[], where: string, runDir: string): Filing {
	const plan = topology(seed);
	const path = `${REDS}/${where}-${seed}.md`;
	mkdirSync(REDS, { recursive: true });

	const classes = [...new Set(reds.map((r) => `${r.invariant} ${r.name}`))].sort();
	const body = [
		`# barrage red — seed ${seed} (${where})`,
		"",
		`**Filed:** ${new Date().toISOString()} · **Invariants:** ${classes.join(" · ")}`,
		"",
		"## Repro",
		"",
		"```",
		`bun barrage/one.ts --seed ${seed} --run /tmp/red-${seed}`,
		`bun barrage/judge.ts --seed ${seed} --run /tmp/red-${seed}`,
		"```",
		"",
		`The flow is a function of the seed — ${plan.size} steps, budget ${plan.budget}`,
		`${plan.tight ? " (below the fired-step count: the ceiling bites)" : ""}`,
		`${plan.scope.length === plan.flow.steps.length ? "" : `, blessed over ${plan.scope.length} of ${plan.flow.steps.length} steps first`}.`,
		"",
		"## The violations",
		"",
		"| invariant | step | detail |",
		"|---|---|---|",
		...reds.map((r) => `| ${r.invariant} ${r.name} | \`${r.step || "—"}\` | ${r.detail} |`),
		"",
		"## The run",
		"",
		`Telemetry (gitignored, may be gone): \`${runDir}\``,
		"",
		"<details><summary>the generated flow</summary>",
		"",
		"```json",
		plan.text.trimEnd(),
		"```",
		"",
		"</details>",
		"",
	].join("\n");

	writeFileSync(path, body);
	return { seed, path, reds };
}
