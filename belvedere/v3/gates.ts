#!/usr/bin/env bun
// The proving run (charge C18):
//
//   bun v3/gates.ts            the four suites, the four type gates, the barrage
//   bun v3/gates.ts --fast     suites + type gates only — never a landing
//   bun v3/gates.ts --glass    adds the deck's suite + type gate
//   bun v3/gates.ts --probes   adds the standing interaction probes (B23 §6) — a real
//                              Chrome against a disarmed twin, one gate per probe
//
// Every gate runs to completion even after an earlier red — report everything,
// then fail — and the run ends in one fenced block a session pastes verbatim
// into a `Done when:` bar. Exit 0 iff every gate that ran passed.
//
// The type gate is the deck's REPO-PINNED tsc, invoked by path: `bunx tsc` in
// these trees resolves nothing locally and fetches a checker off npm (C18 F1),
// which the coda forbids. Nothing here reaches the network.

import { readFileSync } from "fs";

const V3 = new URL(".", import.meta.url).pathname;
const GLASS = new URL("../glass/", import.meta.url).pathname;
const TSC = new URL("../glass/node_modules/.bin/tsc", import.meta.url).pathname;
const CAMERA = new URL("../camera/", import.meta.url).pathname;
const TREES = ["engine", "barrage", "fake-claude", "console"] as const;

type Kind = "suite" | "types" | "barrage" | "probe";
type Gate = { name: string; kind: Kind; cwd: string; cmd: string[] };
type Result = { gate: Gate; exit: number; wallMs: number; output: string };

// ── argv ─────────────────────────────────────────────────────────────────────

const FLAGS = ["--fast", "--glass", "--probes"];
const argv = process.argv.slice(2);
const unknown = argv.filter((a) => !FLAGS.includes(a));
if (unknown.length > 0) {
	console.error(`gates: unknown argument${unknown.length === 1 ? "" : "s"} ${unknown.join(", ")}`);
	console.error("usage: bun v3/gates.ts [--fast] [--glass] [--probes]");
	process.exit(2);
}
const fast = argv.includes("--fast");
const glass = argv.includes("--glass");
const probes = argv.includes("--probes");

/** The standing family, from the file that IS the family (`camera/probes/standing.txt`). */
function standing(): string[] {
	const list = CAMERA + "probes/standing.txt";
	let text: string;
	try { text = require("fs").readFileSync(list, "utf8") as string; }
	catch (e) {
		console.error(`gates: --probes needs ${list}\n${String(e)}`);
		process.exit(2);
	}
	return text.split("\n").map((l) => l.trim()).filter((l) => l !== "" && !l.startsWith("#"));
}

// ── the gates, in order ──────────────────────────────────────────────────────

const gates: Gate[] = [
	...TREES.map((t): Gate => ({ name: `${t} · suite`, kind: "suite", cwd: V3 + t, cmd: ["bun", "test"] })),
	...TREES.map((t): Gate => ({ name: `${t} · types`, kind: "types", cwd: V3 + t, cmd: [TSC, "--noEmit"] })),
	// the runner grades itself — v3/tsconfig.json covers gates.ts (C18 F2, ruled at the batch-2 review)
	{ name: "gates · types", kind: "types", cwd: V3, cmd: [TSC, "--noEmit"] },
];
if (glass) gates.push(
	{ name: "glass · suite", kind: "suite", cwd: GLASS, cmd: ["bun", "test"] },
	{ name: "glass · types", kind: "types", cwd: GLASS, cmd: [TSC, "--noEmit"] },
);
// One gate per probe: a probe boots its own Chrome, so a red one must name itself in the table
// rather than hiding inside a "probes" row that says 12 pass · 1 fail.
if (probes) for (const file of standing()) gates.push({
	name: `probe · ${file.replace(/\.probe\.ts$/, "")}`,
	kind: "probe",
	cwd: CAMERA,
	cmd: ["bun", "cli.ts", "run", `probes/${file}`],
});
if (!fast) gates.push({
	name: "barrage",
	kind: "barrage",
	cwd: V3,
	cmd: ["bun", "barrage/run.ts", "--runs", "1000", "--crashes", "50"],
});

// ── the run ──────────────────────────────────────────────────────────────────

const started = Date.now();
const results: Result[] = [];
for (const gate of gates) {
	process.stderr.write(`… ${gate.name}\n`);
	const result = await run(gate);
	results.push(result);
	process.stderr.write(`  ${verdictOf(result)}  ${gate.name} — ${countsOf(result)} · ${wall(result.wallMs)}\n`);
}

const reds = results.filter((r) => r.exit !== 0);
printBlock();
for (const red of reds) printTail(red);
process.exit(reds.length === 0 ? 0 : 1);

// ── running one gate ─────────────────────────────────────────────────────────

async function run(gate: Gate): Promise<Result> {
	const at = Date.now();
	try {
		const proc = Bun.spawn(gate.cmd, { cwd: gate.cwd, stdout: "pipe", stderr: "pipe" });
		const [out, err, exit] = await Promise.all([
			new Response(proc.stdout).text(),
			new Response(proc.stderr).text(),
			proc.exited,
		]);
		return { gate, exit, wallMs: Date.now() - at, output: out + err };
	} catch (e) {
		// A gate that will not even spawn is a red, not a crash of the runner.
		return { gate, exit: 127, wallMs: Date.now() - at, output: `gates: could not run ${gate.cmd.join(" ")} in ${gate.cwd}\n${String(e)}` };
	}
}

// ── the counts, per family ───────────────────────────────────────────────────

function countsOf(r: Result): string {
	if (r.gate.kind === "suite") {
		const pass = /^\s*(\d+) pass\b/m.exec(r.output)?.[1];
		const fail = /^\s*(\d+) fail\b/m.exec(r.output)?.[1];
		return pass === undefined ? "counts unparsed" : `${pass} pass · ${fail ?? "?"} fail`;
	}
	if (r.gate.kind === "types") {
		const n = r.output.match(/error TS\d+/g)?.length ?? 0;
		return `${n} error${n === 1 ? "" : "s"}`;
	}
	if (r.gate.kind === "probe") {
		// A probe asserts by throwing, so the exit code is the verdict; the shots are what it left
		// behind for an agent to Read, and the count is the only number worth carrying in the table.
		const shots = r.output.match(/^\/.*\.png$/gm)?.length ?? 0;
		return r.exit === 0 ? `${shots} shot${shots === 1 ? "" : "s"}` : "threw";
	}
	const m = /· (\d+) runs · (\d+) cuts · (\d+)\/9 mutants/.exec(r.output);
	return m === null ? "counts unparsed" : `${m[1]} runs · ${m[2]} cuts · ${m[3]}/9 mutants`;
}

function verdictOf(r: Result): string { return r.exit === 0 ? "PASS" : "RED"; }
function wall(ms: number): string { return `${(ms / 1000).toFixed(1)}s`; }

// ── the block ────────────────────────────────────────────────────────────────

function printBlock(): void {
	const rows = results.map((r) => [r.gate.name, verdictOf(r), countsOf(r), wall(r.wallMs), String(r.exit)]);
	if (fast) rows.push(["barrage", "SKIP", "--fast: not run — never sufficient for a landing", "—", "—"]);

	console.log("");
	console.log("```");
	console.log("| gate | result | counts | wall | exit |");
	console.log("|---|---|---|---|---|");
	for (const row of rows) console.log(`| ${row.join(" | ")} |`);
	console.log("");
	console.log(
		reds.length === 0
			? `ALL GREEN — ${results.length} gates, wall ${wall(Date.now() - started)}${fast ? " (--fast: barrage skipped)" : ""}`
			: `RED: ${reds.map((r) => r.gate.name).join(", ")} — ${results.length} gates, wall ${wall(Date.now() - started)}${fast ? " (--fast: barrage skipped)" : ""}`,
	);
	console.log("```");
}

/** The paste must carry the evidence, not just the verdict: a red re-prints its
 *  own tail verbatim, so the failing assertion travels with the table. */
function printTail(r: Result): void {
	const TAIL = 40;
	const lines = r.output.replace(/\s+$/, "").split("\n");
	const shown = lines.slice(-TAIL);
	console.log("");
	console.log(`### RED — ${r.gate.name} (exit ${r.exit}), last ${shown.length} of ${lines.length} lines`);
	console.log("");
	console.log("```");
	for (const line of shown) console.log(line);
	console.log("```");
}
