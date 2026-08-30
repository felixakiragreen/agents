#!/usr/bin/env bun
// The console — five verbs over the engine's own exports, and nothing else.
//
// This is campaign bar 6's instrument and it is deliberately the thinnest thing
// that can be it: the library is the product, and every verb here is a call into
// `engine/` with its answer printed. Nothing in this file senses, judges or
// decides — `rule()`'s refusals are the console's refusals, `sense.ts`'s causes
// are the console's causes, and the run log is the only thing it reads for
// truth. It is not the deck: no glass, no HTTP, no Chat.
//
//   list                                every v3 run, step by step
//   read   <run> <step> [--follow]      one turn's stream, rendered
//   send   <run> <step> <text|land|kill> a ruling into a paused step
//   summon <run> <step> [--tmux]        the session, in a real terminal
//   return <run> <step> <text>          back under the engine, headless
//
// A ruling never ignites anything on its own: `send` and `return` move the step
// they name and stop there. `--run` drives the flow on from that step, which
// spends subject turns on everything the ruling unblocked — so it is a word the
// caller types and never a default.
//
// Plain argv in, exit code out: 0 did it, 2 refused. There are no prompts and no
// TTY is required, except that `summon --tmux` wants tmux on PATH.

import { existsSync, readFileSync, statSync } from "node:fs";
import type { Entry } from "../engine/log.ts";
import { isRefusal, refuse, type Refusal } from "../engine/refusal.ts";
import type { RunState, StepState } from "../engine/replay.ts";
import { streamPath } from "../engine/spawn.ts";
import type { Posture } from "../engine/flow.ts";
import { renderStream, renderRow } from "./render.ts";
import { alive, locate, openRun, runs, TELEMETRY, type RunHandle } from "./runs.ts";
import { lines, markReturned, markSummoned, openPane, paneName, paneReady, summonCommand, summoned, SOCKET } from "./summon.ts";

const HELP = `console — five verbs over the v3 engine (campaign bar 6)

  bun console/cli.ts list                          [--root <dir>]
  bun console/cli.ts read   <run> <step>           [--turn <n>] [--follow]
  bun console/cli.ts send   <run> <step> <text|land|kill> [--note <why>] [--run]
  bun console/cli.ts summon <run> <step>           [--tmux]
  bun console/cli.ts return <run> <step> <text>    [--run]

<run> is a run dir, or its path under the telemetry root (default
${TELEMETRY}).
\`land\` and \`kill\` are reserved words in send's third argument; any other text
is an answer, and answering a paused step spends a subject turn.
\`--run\` drives the flow on after the ruling, spending a turn on every step the
ruling unblocked. Without it a ruling moves its own step and stops.

A step's posture is its flow's, never the console's. Read one plainly: **\`auto\`
is not a restrictive posture headless** — a step at \`auto\` was granted
filesystem-wide writes, arbitrary shell and network egress, and the permission
pause cannot be induced at it (C8 F4). Nothing here dresses it as cautious.`;

function die(message: string): never {
	console.error(`console: ${message}`);
	process.exit(2);
}

const argv = process.argv.slice(2);
const flag = (name: string): string | null => {
	const i = argv.indexOf(name);
	return i === -1 ? null : argv[i + 1] ?? null;
};
const has = (name: string): boolean => argv.includes(name);
/** Positionals: everything that is not a flag and not a flag's value. */
const positional = ((): string[] => {
	const valued = new Set(["--root", "--turn", "--note"]);
	const words: string[] = [];
	for (let i = 0; i < argv.length; i++) {
		const word = argv[i]!;
		if (word.startsWith("--")) { if (valued.has(word)) i++; continue; }
		words.push(word);
	}
	return words;
})();

const ROOT = flag("--root") ?? TELEMETRY;
const [verb, runName, stepId, third] = positional;

if (verb === undefined || has("--help") || verb === "help") { console.log(HELP); process.exit(0); }

// ── list ─────────────────────────────────────────────────────────────────────

/**
 * Every step of every run under the root: what it is, whether its subject is
 * still breathing, which account and session it belongs to, and — when it is
 * paused — the causes and the detail, which is the whole reason a board row
 * exists (C6 F1: a pause names every cause it sensed, not one).
 */
function list(): void {
	const all = runs(ROOT);
	if (all.length === 0) { console.log(`no runs under ${ROOT}`); return; }

	const rows: string[][] = [];
	const details: Map<number, string> = new Map();
	for (const handle of all) {
		const facts = ignitions(handle.entries);
		const open = summoned(handle.dir);
		for (const [id, at] of Object.entries(handle.state.steps)) {
			const fact = facts.get(id);
			const mark = open.has(id) ? " summoned" : "";
			rows.push([
				`${handle.name}/${id}`,
				describe(at) + mark,
				liveness(at),
				fact === undefined ? "-" : `${fact.model}·${fact.posture}`,
				handle.account ?? "-",
				fact?.sessionId ?? sessionOf(at) ?? "-",
			]);
			const detail = at.at === "paused" ? at.detail : at.at === "killed" ? at.reason : "";
			if (detail !== "") details.set(rows.length - 1, detail);
		}
	}

	const width = [0, 1, 2, 3, 4].map((c) => Math.max(...rows.map((r) => r[c]!.length)));
	rows.forEach((row, i) => {
		console.log(row.map((cell, c) => (c === 5 ? cell : cell.padEnd(width[c]!))).join("  "));
		const detail = details.get(i);
		if (detail !== undefined) console.log(`    ${detail}`);
	});
	console.log(`\n${rows.length} steps in ${all.length} runs under ${ROOT}`);
}

const describe = (at: StepState): string =>
	at.at === "paused" ? `paused ‹${at.causes.join(", ")}›`
	: at.at === "landed" ? `landed ${at.report?.state ?? "by ruling"}`
	: at.at;

/** live / dead is a question about a running step and only a running step: a
 *  pid the log named, and whether the kernel still knows it. */
const liveness = (at: StepState): string =>
	at.at !== "running" ? "-" : alive(at.pid) ? `live ${at.pid}` : `DEAD ${at.pid}`;

const sessionOf = (at: StepState): string | null =>
	at.at === "running" || at.at === "ended" || at.at === "paused" ? at.sessionId : null;

type Ignition = { model: string; effort: string; posture: Posture; sessionId: string };

/**
 * What the step was fired as. Only `ignited` carries the model, effort and
 * posture, so the last one wins — a resume runs on whatever the ignition
 * declared. The session id comes from here rather than from the step's state
 * because a landed step's state has forgotten it, and the log has not: the run
 * log locates every session this run ever made (C8 F8).
 */
function ignitions(entries: readonly Entry[]): Map<string, Ignition> {
	const facts = new Map<string, Ignition>();
	for (const e of entries)
		if (e.kind === "ignited") facts.set(e.step, { model: e.model, effort: e.effort, posture: e.posture, sessionId: e.sessionId });
	return facts;
}

// ── read ─────────────────────────────────────────────────────────────────────

async function read(): Promise<void> {
	const found = step();
	if (isRefusal(found)) die(found.refusal);
	const { handle, at } = found;

	const spent = handle.state.spent[stepId!] ?? 0;
	const turnFlag = flag("--turn");
	const turn = turnFlag === null ? spent - 1 : Number(turnFlag);
	if (!Number.isInteger(turn) || turn < 0)
		die(`step ${stepId} has fired ${spent} turns — there is no turn ${turnFlag ?? turn} to read`);

	const path = streamPath(handle.dir, stepId!, turn);
	if (!existsSync(path)) die(`no stream file for turn ${turn} of ${stepId} at ${path}`);
	const fact = ignitions(handle.entries).get(stepId!);

	console.log(`${handle.name}/${stepId}  turn ${turn} of ${spent}  ${describe(at)}`);
	console.log(`  stream   ${path}`);
	if (!has("--follow")) { console.log(renderStream(readFileSync(path, "utf8"), fact?.posture ?? "auto")); return; }
	await follow(path);
}

/**
 * Tail a live stream file. It ends when the turn does — a `result` row is the
 * turn's outcome by parse rule 1 — and a turn that never writes one is a turn
 * whose subject died, which the engine will pause. Bounded either way: nothing
 * in this tree waits forever (directives §3.1).
 */
async function follow(path: string): Promise<void> {
	const deadline = Date.now() + FOLLOW_MS;
	let read = 0;
	let rest = "";
	while (Date.now() < deadline) {
		const size = statSync(path).size;
		if (size > read) {
			const chunk = readFileSync(path, "utf8").slice(read);
			read = size;
			const lines = (rest + chunk).split("\n");
			rest = lines.pop() ?? "";
			for (const line of lines) {
				if (line === "") continue;
				const rendered = renderRow(line);
				if (rendered !== null) console.log(rendered);
				if (isResult(line)) return;
			}
		}
		await Bun.sleep(FOLLOW_POLL_MS);
	}
	console.log(`  …still open after ${FOLLOW_MS / 1000}s — the turn has not written its result`);
}

const FOLLOW_MS = 300_000;
const FOLLOW_POLL_MS = 200;

const isResult = (line: string): boolean => {
	try { return (JSON.parse(line) as { type?: unknown }).type === "result"; } catch { return false; }
};

// ── send ─────────────────────────────────────────────────────────────────────

/**
 * A ruling into a paused step. The refusal on a step that is not paused is the
 * engine's own (`rule()`), unchanged and unexplained-away: ambiguity never
 * authorizes (D10).
 */
async function send(): Promise<void> {
	const found = step();
	if (isRefusal(found)) die(found.refusal);
	const { handle, at } = found;
	if (third === undefined) die(`send wants a third argument: an answer, or the word land, or the word kill`);

	if (summoned(handle.dir).has(stepId!))
		die(`step ${stepId} is summoned — it is in a human's hands, and it comes back with \`return\`, not \`send\``);

	const run = openRun(handle);
	if (isRefusal(run)) die(run.refusal);
	const note = flag("--note") ?? "ruled from the console";

	const ruled = third === "land" ? await run.rule(stepId!, { do: "land", note })
		: third === "kill" ? await run.rule(stepId!, { do: "kill", note })
		: await run.rule(stepId!, { do: "resume", turn: third });
	if (isRefusal(ruled)) die(ruled.refusal);

	await settled(handle, run, `${describe(at)}  ->`);
}

/** What the ruling did, and — only when asked — what the flow did next. */
async function settled(handle: RunHandle, run: { state(): RunState; run(): Promise<RunState> }, was: string): Promise<void> {
	const now = has("--run") ? await run.run() : run.state();
	const after = now.steps[stepId!];
	console.log(`${handle.name}/${stepId}  ${was}  ${after === undefined ? "?" : describe(after)}`);
	if (after?.at === "paused") console.log(`    ${after.detail}`);
	if (after?.at === "landed" && after.report?.answer !== undefined) console.log(`    answer: ${after.report.answer}`);
	if (has("--run"))
		for (const [id, other] of Object.entries(now.steps))
			if (id !== stepId) console.log(`  ${id.padEnd(16)} ${describe(other)}`);
	console.log(`turns ${now.turns}/${now.budget}${now.ceiling ? " (ceiling)" : ""}`);
}

// ── summon ───────────────────────────────────────────────────────────────────

/**
 * The session in a real terminal (D20's fallback). Printing the command is the
 * whole verb; `--tmux` is a convenience that runs the very same argv on a
 * private socket, so what Felix reads and what the console does cannot drift.
 */
async function summon(): Promise<void> {
	const found = step();
	if (isRefusal(found)) die(found.refusal);
	const { handle, at } = found;

	const sessionId = sessionOf(at);
	if (sessionId === null) die(`step ${stepId} has no session to summon — it is ${at.at}`);
	const fact = ignitions(handle.entries).get(stepId!);
	if (fact === undefined) die(`step ${stepId} was never ignited — there is nothing on disk to resume`);

	const summons = { step: stepId!, sessionId, model: fact.model, effort: fact.effort, venue: handle.venue };
	console.log(`${handle.name}/${stepId}  ${describe(at)}  session ${sessionId}`);
	console.log(`\n${summonCommand(summons)}\n`);
	console.log(`  The pane needs a cwd this account has accepted: the workspace-trust`);
	console.log(`  dialog is the TUI's and only \`-p\` skips it (C4 F8). All three accounts`);
	console.log(`  trust ~/code/agents, and trust is inherited by descendants (C8 F2).`);

	let pane: string | null = null;
	if (has("--tmux")) {
		pane = paneName(handle.name, stepId!);
		const failed = await openPane(pane, summons);
		if (failed.trim() !== "") die(`tmux refused the pane: ${failed.trim()}`);
		const { shot, dialog } = await paneReady(pane, PANE_SECONDS);
		console.log(`\n  pane ${pane} on socket ${SOCKET} · trust dialog ${dialog}`);
		for (const line of lines(shot).slice(-PANE_TAIL)) console.log(`  | ${line}`);
		console.log(`  tmux -L ${SOCKET} attach -t ${pane}`);
	}

	markSummoned(handle.dir, { step: stepId!, sessionId, at: new Date().toISOString(), pane });
	console.log(`\n  marked summoned — \`return ${handle.name} ${stepId} <text>\` brings it back headless`);
}

const PANE_SECONDS = 60;
/** Enough of the pane to see whether the history came back, and no more. */
const PANE_TAIL = 8;

// ── return ───────────────────────────────────────────────────────────────────

/**
 * Back under the engine. The same `rule(resume)` `send` makes, with the summon
 * mark as its precondition and its closing act — which is the whole difference
 * between the two verbs and why both exist: `send` rules a step the engine is
 * still holding, `return` takes one back from a human.
 *
 * The hand turns typed into the pane are absorbed by the cursor, which is a
 * recorded row count and does not care who wrote what before it (C11, field-
 * proven at C8 F7 across a 17-row pane turn).
 */
async function back(): Promise<void> {
	const found = step();
	if (isRefusal(found)) die(found.refusal);
	const { handle, at } = found;
	if (third === undefined) die(`return wants the turn to resume with: the words the engine sends headless`);

	const mark = summoned(handle.dir).get(stepId!);
	if (mark === undefined) die(`step ${stepId} is not summoned — a step the engine still holds is ruled with \`send\``);

	const run = openRun(handle);
	if (isRefusal(run)) die(run.refusal);
	const ruled = await run.rule(stepId!, { do: "resume", turn: third });
	if (isRefusal(ruled)) die(ruled.refusal);
	markReturned(handle.dir, stepId!);
	await settled(handle, run, `summoned ${mark.at}  ->`);
}

// ── the address every verb but `list` takes ──────────────────────────────────

function step(): { handle: RunHandle; state: RunState; at: StepState } | Refusal {
	if (runName === undefined || stepId === undefined) return refuse(`${verb} wants <run> <step>\n\n${HELP}`);
	const handle = locate(runName, ROOT);
	if (isRefusal(handle)) return handle;
	const at = handle.state.steps[stepId];
	if (at === undefined)
		return refuse(`run ${handle.name} has no step ${JSON.stringify(stepId)} — it has ${Object.keys(handle.state.steps).join(", ")}`);
	return { handle, state: handle.state, at };
}

// The dispatch sits last on purpose: every verb reaches for a helper below it,
// and a `const` arrow read before its own line is a TDZ error at run time that
// no type gate sees.
switch (verb) {
	case "list": list(); break;
	case "read": await read(); break;
	case "send": await send(); break;
	case "summon": await summon(); break;
	case "return": await back(); break;
	default: die(`unknown verb ${JSON.stringify(verb)} — one of list read send summon return\n\n${HELP}`);
}
