/**
 * The Works, server side: **the v3 engine's runs, shaped for the drawing** (B10, keel §6; the lane
 * swapped to v3 at C15, D22 r2).
 *
 * One thing only — turn run logs into the wire shape the Works draws. Every reading of a log is the
 * engine's own: `runs()`/`readRun()` find and open one, `fold()` derives the state, `verdicts()`
 * names each step's outcome, `postureLegal()` says whether a step could ever have ignited. **This
 * module re-implements none of it** (D65's one-parser law, same shape) — a genuinely missing export
 * is an escalation, never a copy.
 *
 * **Nothing here writes, nothing here ignites, and nothing here drives.** The v2 engine lived in this
 * building and ran on a clock; the v3 engine runs out of process and this is a reader of what it
 * left behind. The arm, the pass and the tick died with the retirement — driving is G5's rework lay.
 */

import { existsSync, statSync } from 'fs';
import type { Building } from '../../doctrine';
import { fold, verdicts } from '../v3/engine/replay.ts';
import { subjectName, type Flow, type Step } from '../v3/engine/flow.ts';
import { postureLegal } from '../v3/engine/posture.ts';
import { isRefusal } from '../v3/engine/refusal.ts';
import { findRunDirs, readRun, type RunHandle } from '../v3/console/runs.ts';
import type { Works, WorksEdge, WorksFail, WorksRun, WorksStep, WorksUsage } from './deck-model';
import { BUCKETS, pacing } from './gauges';
import { short, tilde } from './html';
import { buildingOf } from './pages';
import { runsRoot } from './paths';
import { readRig, type Rig } from './rig';
import { usageNow } from './usage';

/**
 * Everything has a limit (directive 3.1). The telemetry tree grows by a run dir every time the
 * barrage runs — 65 of them the day this landed, 629 kB of folded state — and this read sits on a
 * three-second poll. So the walk is whole (it is cheap: one `statSync` per dir) and the **read** is
 * the newest few, with the page saying how many of how many it looked at. A bounded read that hides
 * its bound is a page lying about the city.
 */
const LIMITS = { read: 12 } as const;

// ---------- one run's steps ----------

/**
 * Dependency depth, over the flow's own graph: a step sits one rank below its deepest dependency.
 * The parse has already refused a cycle (`parseFlow`), so this terminates by construction — and the
 * memo is what keeps a wide diamond from re-walking its own shoulders.
 */
function depths(flow: Flow): Map<string, number> {
	const by = new Map(flow.steps.map(s => [s.id, s]));
	const memo = new Map<string, number>();
	const depth = (id: string): number => {
		const held = memo.get(id);
		if (held !== undefined) return held;
		memo.set(id, 0);                         // a self-reference the parse would have refused
		const deps = by.get(id)?.depends ?? [];
		const d = deps.length === 0 ? 0 : Math.max(...deps.map(depth)) + 1;
		memo.set(id, d);
		return d;
	};
	for (const s of flow.steps) depth(s.id);
	return memo;
}

/** A paused step's sentence: the causes it named, then the detail behind them. */
const pausedWhy = (causes: readonly string[], detail: string): string =>
	detail === '' ? causes.join(', ') : `${causes.join(', ')} — ${detail}`;

function step(s: Step, run: ReturnType<typeof fold>, verdict: string, depth: number, sid: string | null): WorksStep {
	const at = run.steps[s.id] ?? { at: 'pending' as const };
	const withSubject = s.kind === 'card' ? null : s;
	// P5 F5's clause, evaluated by the engine's own gate: legality is per (model, posture), and the
	// refusal's words are the engine's, so the deck and the arm can never disagree about a step.
	const legal = withSubject === null ? true : postureLegal(withSubject.model, withSubject.posture);
	return {
		id: s.id,
		kind: s.kind,
		depends: [...s.depends],
		depth,
		verdict,
		at: at.at,
		// **The log's word, not the fold's** (C16, findings F3). Three of the six fold states carry a
		// session and `landed` is not one of them — but the log names every session the run ever made
		// (C8 F8, and the console's `list` reads it the same way), so a landed step still knows which
		// conversation it had. Taking the state's word here left the Works unable to open the Chat on
		// the step whose reply had just landed it.
		sid,
		pid: at.at === 'running' ? at.pid : null,
		why: at.at === 'paused' ? pausedWhy(at.causes, at.detail)
			: at.at === 'landed' ? at.report?.cause ?? null
			: at.at === 'killed' ? at.reason
			: null,
		ask: s.kind === 'card' ? s.ask : null,
		model: withSubject?.model ?? null,
		effort: withSubject?.effort ?? null,
		posture: withSubject?.posture ?? null,
		subject: withSubject === null ? null : subjectName(withSubject.subject),
		prompt: withSubject?.prompt ?? null,
		timeoutMs: withSubject?.timeoutMs ?? null,
		turns: run.spent[s.id] ?? 0,
		blocks: isRefusal(legal) ? [legal.refusal] : [],
	};
}

/**
 * One run, folded. The flow comes off the log's own first event — **never off a file beside it** —
 * because the log is the truth (cornerstone §3.4) and the bytes it carries are the bytes that were
 * blessed. That is also what makes a step's `prompt` frozen: nothing here resolves a document
 * position, so a kickoff whose source doc has since moved still renders what the run was given.
 */
export function worksRun(handle: RunHandle): WorksRun {
	const state = handle.state;
	const flow = state.flow;
	const spoken = verdicts(state);
	const rank = flow === null ? new Map<string, number>() : depths(flow);
	const sessions = new Map<string, string>();
	for (const e of handle.entries)
		if (e.kind === 'ignited' || e.kind === 'resumed') sessions.set(e.step, e.sessionId);
	const steps = (flow?.steps ?? []).map(s =>
		step(s, state, spoken[s.id] ?? 'pending', rank.get(s.id) ?? 0, sessions.get(s.id) ?? null));
	const edges: WorksEdge[] = (flow?.steps ?? []).flatMap(s => s.depends.map(from => ({ from, to: s.id })));
	const last = handle.entries.at(-1) ?? null;
	return {
		name: handle.name,
		dir: short(handle.dir),
		flowId: flow?.id ?? handle.name,
		flowName: flow?.name ?? 'never blessed — the log carries no flow',
		venue: tilde(handle.venue.workDir),
		account: handle.account,
		venueFrom: handle.venueFrom,
		budget: state.budget,
		turns: state.turns,
		ceiling: state.ceiling,
		scope: [...state.scope],
		halted: state.halted,
		log: {
			lines: handle.entries.length,
			at: last === null ? null : Date.parse(last.at) / 1000,
			last: last?.kind ?? null,
		},
		steps,
		edges,
	};
}

// ---------- discovery ----------

/** A run dir and when its log last moved — the sort key, so the newest runs are the ones read. */
const touched = (dir: string): number => {
	try { return statSync(`${dir}/run.jsonl`).mtimeMs; } catch { return 0; }
};

/**
 * The newest run dirs under the telemetry root, newest first. The walk is the console's own
 * (`findRunDirs`, dotted names included — C12 F1's trap lives in it and is already handled).
 */
export const recentRuns = (root: string = runsRoot(), limit: number = LIMITS.read): { dirs: string[]; total: number } => {
	if (!existsSync(root)) return { dirs: [], total: 0 };
	const all = findRunDirs(root).sort((a, b) => touched(b) - touched(a));
	return { dirs: all.slice(0, limit), total: all.length };
};

// ---------- the bill ----------

/**
 * The bill, per account (B10 §5). **B17 put the live read behind this shape**: `usageNow` hands
 * over whatever the deck's own fetcher last got — the composer's expand is what fetches — and falls
 * back to the rig's cache for an account it has not reached, labelled as that. It never fetches
 * *here*: this runs on the three-second poll, and a token read plus an HTTPS round trip on a clock
 * is a price nobody agreed to (`usage.ts` §usageNow).
 */
export function worksUsage(rig: Rig = readRig(), nowSeconds = Date.now() / 1000): WorksUsage[] {
	return usageNow(rig).map(u => ({
		account: u.account,
		ageSeconds: u.fetchedAt === null ? null : Math.max(0, nowSeconds - u.fetchedAt),
		cells: BUCKETS.map(bucket => {
			const q = u.windows[bucket];
			return { bucket, pct: q?.pct ?? null, delta: q === undefined ? null : pacing(q, nowSeconds) };
		}),
	}));
}

// ---------- the pane's whole payload ----------

/**
 * Every v3 run that ran in one building, and every run dir the reader refused.
 *
 * **A run houses where its subject ran** — the venue's cwd through the register, which is the same
 * join the census makes for a live session (`buildingOf`, B5 F1's own fix). A run log carries no
 * building field and never will: the engine knows a cwd, and only the register knows what a
 * building is (D65).
 *
 * A refusal is carried rather than dropped: **a log that will not read is a run that is lying**
 * (README §1's parser-as-lint), so the pane shows the named refusal and files nothing. Refusals are
 * building-blind by necessity — a log nobody could open has no venue to house it by — so they ride
 * every building's Works and say which dir they came from.
 */
export function worksOf(building: string | null, buildings: readonly Building[] = []): Works | null {
	if (building === null) return null;
	const { dirs, total } = recentRuns();
	const root = runsRoot();
	const runs: WorksRun[] = [];
	const fails: WorksFail[] = [];
	let elsewhere = 0;
	for (const dir of dirs) {
		let handle;
		try { handle = readRun(dir, root); }
		catch (e) { fails.push({ name: short(dir), error: (e as Error).message }); continue; }
		if (isRefusal(handle)) { fails.push({ name: short(dir), error: handle.refusal }); continue; }
		if (buildingOf(handle.venue.workDir, [...buildings])?.building !== building) { elsewhere++; continue; }
		runs.push(worksRun(handle));
	}
	return { building, runs, fails, read: dirs.length, total, elsewhere, usage: worksUsage() };
}
