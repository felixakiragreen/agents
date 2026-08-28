/**
 * The engine — **the Dispatcher's between-sessions logistics, mechanized** (D11, flow-keel §§1–2).
 *
 * One click in the Works arms a declared flow; from there this module runs the string. It fires
 * ready steps through the existing hands, pauses at Felix-cards, on any ambiguity (D10 wholesale)
 * and on HALT, times a step out rather than waiting forever, and writes what it did to the flow's
 * run log. Judgment stays in sessions: nothing here decides anything a mantle would.
 *
 * **The fence gains no write class** (README §2). The engine's every write is either a hand
 * (`hands.ts`, same audit, same unwind, same arming switch) or a run-state append in the D6 census
 * neighborhood — telemetry, gitignored, never truth. It edits no board, no ledger, no flow file.
 *
 * **The shape is data, not control flow.** `plan()` is pure: flow + run log + a `World` in, the
 * lines to append and the steps to fire out. Everything that can go wrong with the engine's
 * *reasoning* is therefore a unit test (`engine.test.ts`), and only the two things that need a real
 * machine — a live fire and a live census — ride the probes. `tick()` is the thin shell that reads
 * the world, calls `plan`, and does as it is told.
 *
 * **The engine kills nothing** (B11 §6). A timeout pauses the flow's *advance* and surfaces the
 * step; stopping live work is Felix's or the session's own.
 */

import { existsSync } from 'fs';
import type { BoardRow } from '../../doctrine';
import { isLive, readCensus, type Session } from './census';
import {
	appendRun, armedAt, armedHash, blocksOf, flowLast, readFlow, readFlows, readRun,
	type Flow, type NewRunLine, type Run, type RunLine, type Step,
} from './flow';
import { escalationsIn } from './attention';
import {
	classifies, gatedOf, isJudge, judgeIdOf, judgeStep, judgesOf, scopeJoin, stepMarks,
	type Join, type LandingCode,
} from './judge';
import {
	fail, fire, json, readCredential, readHalt, worktree, type Halted, type Outcome,
} from './hands';
import { haltFlag } from './paths';
import { buildingPath, city } from './register';
import { readRig, type Rig } from './rig';
import { compose, nextOrdinal, ordinal, stampPrefix, theaterOf } from './summon';
import { readTrust, trustOf, type Trust } from './trust';

/** Everything has a limit (directive 3.1): the tick's period, and how much it will do in one pass. */
export const TICK_MS = 5_000;
const LIMITS = { firesPerPass: 4 } as const;

// ---------- the world the engine reasons over ----------

/**
 * Everything `plan()` is allowed to know, gathered once per pass. Handing it in rather than reading
 * it inside is what makes the reasoning testable **and** what makes the pass consistent: two steps
 * of one flow must not be judged against two different reads of the census.
 */
export type World = {
	now: number;
	/** The flag, or null. Its first consumer (keel §5) — nothing fires while it exists. */
	halt: Halted | null;
	/** The census's live word, by session id and by the name-stamp the engine minted. */
	sessions: Map<string, Session>;
	stamped: Map<string, Session>;
	/** This building's board rows by lowercased id — a step id IS usually a row (B10 F4). */
	rows: Map<string, BoardRow>;
	/** Row ids on this building's boards: an `E<n>` that names one is a reference, not an escalation. */
	rowIds: ReadonlySet<string>;
	/** Master checkouts already held by a live engine-fired step — single-writer physics (B11 §3). */
	busy: Set<string>;
	/** Where this flow's building sits on disk — the judge sitting's venue and the docs it is sent to read. */
	buildingPath: string;
	/**
	 * D12's verdict on a flow whose file has moved since the arm (B12 §4). Decided by the caller
	 * because the in-scope test spawns `git` for the trust precheck, and `plan()` stays pure.
	 */
	join: Join;
};

/** What one pass of one flow decided: lines to append, and steps to fire through the hands. */
export type Plan = { lines: NewRunLine[]; fires: Step[] };

// ---------- reading a step's own history out of the log ----------

const linesFor = (run: Run, step: string): RunLine[] => run.lines.filter(l => l.step === step);

/** The first fire is what starts the clock; the last one is what carries the session id (§the join). */
const firstFire = (mine: RunLine[]): RunLine | null => mine.find(l => l.ev === 'fired') ?? null;
const lastFire = (mine: RunLine[]): RunLine | null => mine.filter(l => l.ev === 'fired').at(-1) ?? null;

/**
 * Append only what the log does not already say. The tick runs every five seconds forever, so an
 * engine that restated a pause each pass would bury the one line that matters under a thousand
 * copies of itself — idempotence is a property of the writing, not of the reader.
 */
const changed = (last: RunLine | null, ev: NewRunLine['ev'], why: string | null): boolean =>
	last === null || last.ev !== ev || (last.why ?? null) !== why;

const note = (lines: NewRunLine[], last: RunLine | null, line: NewRunLine): void => {
	if (changed(last, line.ev, line.why ?? null)) lines.push(line);
};

/** A session the engine fired: by its id where the census has joined it, else by the stamp it minted. */
function sessionOf(fired: RunLine | null, world: World): Session | null {
	if (fired === null) return null;
	if (fired.sid !== null) return world.sessions.get(fired.sid) ?? null;
	return fired.stamp === null ? null : world.stamped.get(fired.stamp) ?? null;
}

// ---------- §4: what "landed" means, and what it does not ----------

/**
 * The interim landing law (keel §5.1, B11 §4). Two sensors and a board, and **anything it cannot
 * read cleanly pauses** — pausing is cheap, wrong continuation is expensive.
 *
 *  · **the board** — when the step id is a row here, `LANDED` with nothing unruled on it is landed.
 *  · **the census** — `Stop` as the last event *and* the pid gone (P1's two-sensor law). A session
 *    idle at `Stop` with a live pid is *working-or-stalled*, which is a timeout question, not a
 *    landing.
 *  · a session **gone without a `Stop`** is malformed: it did not finish, it vanished.
 *  · `KILLED`/`BLOCKED`, and a `LANDED` row raising an escalation nothing says was ruled, both
 *    pause. The judge that clears the second one is B12's; until then, pausing is the whole
 *    behaviour.
 */
export type Verdict = { ev: 'landed' | 'paused'; code: LandingCode; why: string } | null;

export function verdictOf(step: Step, fired: RunLine | null, world: World): Verdict {
	const row = world.rows.get(step.id.toLowerCase()) ?? null;
	if (row !== null) {
		if (row.state === 'KILLED' || row.state === 'BLOCKED')
			return { ev: 'paused', code: 'killed', why: `the board says ${row.state} — the engine never advances past a state it did not expect` };
		// Somebody is already on it. Two readings disagree about whether this step needs starting, and
		// an engine that fires over a live session is the wrong continuation D10 exists to prevent.
		if (row.state === 'IN FLIGHT' && fired === null)
			return { ev: 'paused', code: 'in-flight', why: 'the board says IN FLIGHT and the engine never fired it — somebody is already on this step' };
		if (row.state === 'LANDED') {
			const raised = escalationsIn(row.annotation, world.rowIds);
			return raised.length === 0
				? { ev: 'landed', code: 'clean', why: 'the board row parses LANDED clean' }
				: { ev: 'paused', code: 'escalated', why: `LANDED, and ${raised.map(e => e.id).join(', ')} is raised with nothing saying it was ruled (keel §5.1)` };
		}
	}

	const session = sessionOf(fired, world);
	if (session !== null && session.state === 'gone')
		return session.last.ev === 'Stop'
			? { ev: 'landed', code: 'clean', why: 'the census: Stop was its last word and the pid is gone' }
			: { ev: 'paused', code: 'no-stop', why: `the session is gone and its last event was ${session.last.ev}, not Stop` };

	if (fired !== null && world.now - fired.ts > step.timeoutMinutes * 60)
		return { ev: 'paused', code: 'timeout', why: `timeout — ${step.timeoutMinutes} minutes since the fire and nothing says it landed` };

	return null;
}

// ---------- §3: what "ready" means ----------

/** A step is in flight while it has a fire, no landing, and a session the census has not buried. */
function inFlight(step: Step, run: Run, world: World): boolean {
	const mine = linesFor(run, step.id);
	const last = mine.at(-1) ?? null;
	if (last === null || last.ev === 'landed') return false;
	const fired = lastFire(mine);
	if (fired === null) return false;
	const session = sessionOf(fired, world);
	// A fire the census has not joined yet is in flight by default: a session that has not beaten is
	// not a session that is not there, and the timeout is what ends that patience.
	return session === null || isLive(session);
}

const cwdOf = (step: Step): string | null => step.venue.kind === 'master' ? step.venue.cwd : null;

// ---------- the pass ----------

/**
 * One flow, one pass. Everything it needs is in `run` and `world`, and everything it decides comes
 * back as data — with one deliberate exception: it **reserves** the checkouts it hands out in
 * `world.busy`, so the caller's set IS the reservation across every flow in a pass (the same trick
 * `nextOrdinal`'s `taken` plays, for the same reason: two dispatchers, one checkout).
 *
 * The order is the invariant: **land before you fire**. A step that landed this pass frees its
 * dependants, its checkout and its concurrency slot in the same pass, which is what makes the gap
 * between one step's landing edge and the next one's fire a tick rather than two.
 */
export function plan(flow: Flow, run: Run, world: World): Plan {
	const lines: NewRunLine[] = [];
	const fires: Step[] = [];
	if (armedAt(run) === null) return { lines, fires };       // unarmed is inert: the arm IS the authorization

	const last = flowLast(run);

	// D10, first and hardest: a log the engine cannot fully read is a log it may not reason from.
	// Nothing advances — not a landing, not a fire — until a human resolves it.
	if (run.malformed > 0) {
		note(lines, last, { ev: 'paused', why: `run-state unreadable: ${run.malformed} line(s) will not parse — the engine advances nothing it cannot read` });
		return { lines, fires };
	}

	/**
	 * The plan as it stands **plus every judge the gate has inserted** (B12 §2). Judges are derived
	 * from the run log rather than declared, because the glass writes no flow file — so from here on
	 * `steps` is the DAG and `flow.steps` is only what was declared.
	 */
	const steps: Step[] = [...flow.steps, ...judgesOf(flow, run, world.buildingPath)];

	// Armed flows are immutable (§1) — and D12 rules **scope-arm**, so growth inside the arm's own
	// scope joins the running flow instead of waiting for a click (B12 §4). Everything else pauses,
	// now with the reason on it rather than a generic sentence.
	const armed = armedHash(run);
	let amended = armed !== null && armed !== flow.hash;
	if (amended && world.join.kind === 'join') {
		lines.push({ ev: 'armed', hash: flow.hash, steps: world.join.steps, why: world.join.why });
		amended = false;
	}
	else if (amended)
		note(lines, last, { ev: 'paused', why: world.join.kind === 'pause' ? world.join.why : 'amended since the arm — re-arm to authorize the change (the flow file or a quoted kickoff moved)' });
	else if (last !== null && last.ev === 'paused' && (last.why ?? '').startsWith('amended'))
		note(lines, last, { ev: 'resumed', why: 'the flow matches its arm again' });

	// Landings first, so a dependant can fire in the same pass its dependency landed.
	const landed = new Set<string>();
	/** Steps the board says are not the engine's to start: KILLED, BLOCKED, or already IN FLIGHT. */
	const held = new Set<string>();
	/** Judges minted this pass — they join the DAG immediately, so the gate costs a tick and not two. */
	const inserted: Step[] = [];
	/**
	 * Steps this pass reached a verdict on that ends their run. `inFlight` reads the *log*, which does
	 * not yet carry the line this pass is about to write, so without this a step decided at 12:00:00
	 * keeps its concurrency slot and its checkout until 12:00:05 — and at `concurrency: 1` that starves
	 * the judge the same pass staffed for it. `timeout` is deliberately not in here: that session is
	 * still alive and still spending, and the engine kills nothing (B11 §6).
	 */
	const settled = new Set<string>();

	/**
	 * **The gate's second half, and the one that matters (§2): the verdict is read off the FILES,
	 * never off the judge's mouth.**
	 *
	 * A judge has no board row, so B11's landing law cannot speak for it — and the census cannot
	 * either: a session whose workspace is closed ends on `SessionEnd`, not on `Stop`, so the
	 * two-sensor law would read every finished sitting as malformed (F2). What a judge is *for* is the
	 * row, so the row is what says whether it worked:
	 *
	 *  · the gated row reads clean → the judge landed, the lane **resumes**, and it resumes the moment
	 *    the row is true rather than when the sitting happens to shut down;
	 *  · the sitting is over (`Stop` or gone — P1's idle sensor) or past its limit, and the row still
	 *    does not read clean → the card is **Felix's** after all. **A judge is never judged** (§3), so
	 *    the engine inserts no second one, and that is why this loop, and not `verdictOf`, is the only
	 *    thing in the engine that ever rules on a judge.
	 */
	for (const judge of steps) {
		const gatedId = gatedOf(judge.id);
		if (gatedId === null) continue;
		const gated = flow.steps.find(s => s.id === gatedId);
		if (gated === undefined) continue;
		const mine = linesFor(run, judge.id);
		const own = mine.at(-1) ?? null;
		if (own === null || own.ev === 'landed' || own.ev === 'paused') continue;   // not started, or already ruled
		const fired = firstFire(mine);
		if (fired === null) continue;

		const sid = lastFire(mine)!.sid;
		const again = verdictOf(gated, firstFire(linesFor(run, gatedId)), world);
		if (again !== null && again.ev === 'landed') {
			lines.push({ ev: 'landed', step: judge.id, sid, why: `${gatedId} reads clean now — the sitting did what it was staffed for` });
			lines.push({ ev: 'resumed', step: gatedId, why: `the judge sitting cleared ${gatedId} — the lane runs on` });
			settled.add(judge.id);
			continue;
		}

		const session = sessionOf(fired, world);
		const over = session !== null && (session.state === 'idle' || session.state === 'gone');
		const late = world.now - fired.ts > judge.timeoutMinutes * 60;
		if (!over && !late) continue;
		lines.push({
			ev: 'paused', step: judge.id, sid,
			why: `the judge sitting ${over ? 'is over' : `passed its ${judge.timeoutMinutes} minute limit`} and ${gatedId} still does not read clean`
				+ ` (${again?.why ?? 'the row says nothing either way'}) — a judge is never judged, so this one is Felix's`,
		});
		settled.add(judge.id);
	}

	for (const step of steps) {
		const mine = linesFor(run, step.id);
		const own = mine.at(-1) ?? null;
		if (own?.ev === 'landed') { landed.add(step.id); continue; }
		const fired = firstFire(mine);

		if (fired !== null) {
			// The join: a fire returns a workspace, never a session id. Once the census reads the stamp
			// off the transcript, one more `fired` line carries the sid — same event, finer.
			const latest = lastFire(mine)!;
			if (latest.sid === null && latest.stamp !== null) {
				const found = world.stamped.get(latest.stamp);
				if (found) lines.push({ ev: 'fired', step: step.id, sid: found.sid, workspace: latest.workspace, stamp: latest.stamp });
			}
		}
		if (isJudge(step.id)) continue;                       // the gate loop above is a judge's only judge

		const verdict = verdictOf(step, fired, world);
		if (verdict === null) continue;
		if (verdict.ev === 'landed') landed.add(step.id);

		// **A step the engine never fired is not the engine's to record.** The board's word is already
		// on the drawing and it is drawn dashed precisely because it is the board's (B10 F4); writing
		// it into the run log would claim the engine spoke when it only read. So a landed row lands the
		// step for readiness and nothing else, and a KILLED / BLOCKED / IN FLIGHT row simply holds it.
		// The gate follows the same line: the engine did not start that work, so it staffs no judge for
		// how it ended — it just stops.
		if (fired === null) { if (verdict.ev === 'paused') held.add(step.id); continue; }
		if (verdict.code !== 'timeout') settled.add(step.id);
		note(lines, own, { ev: verdict.ev, step: step.id, sid: lastFire(mine)!.sid, why: verdict.why });

		// **The gate** (§2): a landing the engine could not read as clean fires the scoped Architect
		// sitting into the lane rather than carding the sovereign. One per gated landing — the id is
		// derived, so a second insertion is unrepresentable and the `extended` line is its own guard.
		if (verdict.ev !== 'paused' || !classifies(verdict.code)) continue;
		const jid = judgeIdOf(step.id);
		if (run.lines.some(l => l.ev === 'extended' && l.step === jid)) continue;
		lines.push({ ev: 'extended', step: jid, why: verdict.why });
		inserted.push(judgeStep(flow, step, world.buildingPath, verdict.why));
	}
	steps.push(...inserted);

	// What is still running holds its slot **and its checkout**: a master-venue step in flight makes
	// that checkout busy for every flow in this pass, which is single-writer physics city-wide and
	// not a per-flow courtesy. A step that landed above frees both in the same pass.
	let live = 0;
	for (const step of steps) {
		if (landed.has(step.id) || settled.has(step.id) || !inFlight(step, run, world)) continue;
		live++;
		const held = cwdOf(step);
		if (held !== null) world.busy.add(held);
	}

	for (const step of steps) {
		const mine = linesFor(run, step.id);
		if (firstFire(mine) !== null) continue;               // fired once is fired: the engine never re-fires
		if (landed.has(step.id) || held.has(step.id)) continue;   // the board already spoke about this one
		const own = mine.at(-1) ?? null;

		// P5 F5 (ii) — a step's model IS its permission posture. The arm refuses these, so reaching one
		// here means the flow was armed before the model moved: refuse loudly rather than stall silently.
		const blocked = blocksOf(step);
		if (blocked.length > 0) { note(lines, own, { ev: 'refused', step: step.id, why: blocked.join(' ') }); continue; }

		if (!step.depends.every(d => landed.has(d))) continue;

		// His card. Never auto-fired, never auto-passed — the pass gesture is the resume (§5).
		if (step.gate.kind === 'felix' && !mine.some(l => l.ev === 'resumed')) {
			note(lines, own, { ev: 'paused', step: step.id, why: 'a Felix-card — his pass on the card is the resume; the engine will not open it' });
			continue;
		}

		// HALT, checked here and again immediately before the spawn (§3): a refusal is a state the
		// page can read, and clearing the flag makes the step ready again on the next pass.
		if (world.halt !== null) {
			note(lines, own, { ev: 'refused', step: step.id, why: `HALT — ${world.halt.text}` });
			continue;
		}
		if (amended) continue;                                 // the flow-level pause already says why
		if (live >= flow.concurrency) continue;                // the bill, enforced
		const cwd = cwdOf(step);
		if (cwd !== null && world.busy.has(cwd)) continue;     // one writer per checkout; worktrees are free

		fires.push(step);
		live++;
		if (cwd !== null) world.busy.add(cwd);
		if (fires.length >= LIMITS.firesPerPass) break;
	}

	return { lines, fires };
}

// ---------- the arm ----------

export type ArmRefusal = { code: 'unreadable' | 'blocked' | 'trust' | 'stale'; error: string };
export type Armed = { name: string; hash: string; steps: number; building: string };

const accountDir = (rig: Rig, label: string): string | null =>
	[...rig.accounts].find(([, l]) => l === label)?.[0] ?? null;

/**
 * The venue a step's trust is decided at (P5 F5 iii). A worktree the hand has not cut yet is not on
 * disk, so it is prechecked against the **repo it will be cut from** — a linked worktree inherits its
 * repo's trust, which is exactly why that substitution is sound and not a shortcut.
 */
const trustTarget = (step: Step): string =>
	step.venue.kind === 'master' ? step.venue.cwd : step.venue.repo;

/**
 * **The whole arm-time check for one step**, as one sentence or null. It is a function rather than
 * inline code in `armFlow` because D12's scope-arm applies exactly the same bar to a step that joins
 * an already-armed flow (B12 §4) — an addition that auto-joins must clear what the click would have
 * cleared, and there is only one list of what that is.
 */
function refuseStep(step: Step, rig: Rig, trusts: Map<string, Trust>): string | null {
	const blocked = blocksOf(step);
	if (blocked.length > 0) return blocked.join(' ');

	const dir = accountDir(rig, step.account);
	if (dir === null) return `no account "${step.account}" in the rig's accounts.tsv`;
	if (!trusts.has(dir)) trusts.set(dir, readTrust(dir));
	const target = trustTarget(step);
	const verdict = trustOf(target, trusts.get(dir)!);
	return verdict.warm ? null
		: `${step.account} has never trusted ${target}`
			+ ` (project ${verdict.project.path}${verdict.project.repo ? ', a repository' : ''}${verdict.refused ? `, refused at ${verdict.refused}` : ''})`
			+ ` — a fire there stalls on the folder-trust dialog with no transcript and no beat, and the glass never answers that dialog (B7 F1)`;
}

/**
 * **The arm** (D11): one click, and the review of the rendered plan IS the authorization.
 *
 * Everything that can refuse, refuses **here** — loudly, naming the step — because P5's whole lesson
 * is that the alternative is a silent mid-flow stall four minutes into a session that will never
 * write a file. Two checks, both P5 F5's:
 *
 *  · the **model** is the permission posture, so a `haiku` step cannot be armed at all;
 *  · the **venue** is prechecked per (step, account) — never once per flow, because the same
 *    directory is warm on one silo and cold on another.
 *
 * The trust check spawns `git` per step, which is why it is paid once here and never on the deck's
 * poll (B10 F7). `hash` is what the page was showing: an arm carrying a hash the file no longer has
 * is refused, so nobody ever authorizes bytes they did not read (B10 F2).
 */
export function armFlow(name: string, hash: string | null = null): Outcome<Armed> {
	const read = readFlow(name);
	if (!read.ok) return fail(`${read.fail.code} — ${read.fail.error}`);
	const flow = read.flow;

	if (hash !== null && hash !== flow.hash)
		return fail(`the plan on the page is not the plan on disk any more (armed ${hash.slice(0, 12)}…, disk ${flow.hash.slice(0, 12)}…) — reload and read it again before arming`);

	const rig = readRig();
	const trusts = new Map<string, Trust>();
	for (const step of flow.steps) {
		// The model clause is a property of the step and reads "cannot be armed"; everything else is a
		// property of the world and reads as a plain refusal. B11's own DoD quotes both, verbatim.
		const blocked = blocksOf(step);
		const refused = refuseStep(step, rig, trusts);
		if (refused !== null) return fail(`step ${step.id}${blocked.length > 0 ? ' cannot be armed:' : ':'} ${refused}`);
	}

	// **What was armed, step by step** (B12 §4): the hash says the plan moved, these say which parts,
	// and that difference is what lets growth inside the scope join without another click.
	appendRun(name, [{ ev: 'armed', hash: flow.hash, steps: stepMarks(flow) }]);
	return { ok: true, result: { name, hash: flow.hash, steps: flow.steps.length, building: flow.building } };
}

/**
 * His pass on a Felix-card — **the only thing that opens one** (§5). Credential-gated at the route
 * for the same reason the arm is: passing a card authorizes the fire behind it.
 */
export function passGate(name: string, stepId: string): Outcome<{ step: string }> {
	const read = readFlow(name);
	if (!read.ok) return fail(`${read.fail.code} — ${read.fail.error}`);
	const step = read.flow.steps.find(s => s.id === stepId);
	if (!step) return fail(`no step "${stepId}" in ${name}`);
	if (step.gate.kind !== 'felix') return fail(`step ${stepId} is not gated on Felix — there is no card to pass`);

	const run = readRun(name);
	if (armedAt(run) === null) return fail(`${name} is not armed — a card behind an unarmed flow opens nothing`);
	const mine = linesFor(run, stepId);
	if (mine.some(l => l.ev === 'resumed')) return fail(`step ${stepId} is already passed`);

	appendRun(name, [{ ev: 'resumed', step: stepId, why: 'Felix passed the card' }]);
	return { ok: true, result: { step: stepId } };
}

// ---------- the tick ----------

let ticking = false;
let timer: ReturnType<typeof setInterval> | null = null;

export type TickReport = { flows: number; lines: number; fires: number; skipped: boolean };

/** The census's every stamp — the third source a lineage counter must know about (B7 F4). */
const stampsOf = (sessions: Session[]): string[] =>
	sessions.map(s => s.stamp).filter((s): s is string => s !== null);

/**
 * A step's fire, composed and sent through the hands. Nothing new: `compose()` mints the body
 * `POST /hands/fire` parses and `fire()` is the same hand the composer presses, with the same audit,
 * the same unwind and the same arming switch.
 *
 * The stamp's theater follows the **building**, never the cwd (B17): belvedere work fired at
 * `~/code/agents` is `builder-belvedere-NN`, and a worktree venue would otherwise name the lineage
 * after a branch directory.
 */
async function fireStep(flow: Flow, step: Step, rig: Rig, known: readonly string[], password: string, buildingPath: string): Promise<NewRunLine> {
	// HALT, immediately before the spawn — its first consumer, and the last thing checked (§3).
	if (existsSync(haltFlag())) return { ev: 'refused', step: step.id, why: 'HALT — set between the plan and the spawn' };

	let cwd: string;
	if (step.venue.kind === 'master') cwd = step.venue.cwd;
	else {
		const cut = await worktree({ repo: step.venue.repo, branch: step.venue.branch });
		if (!cut.ok) return { ev: 'refused', step: step.id, why: `worktree refused — ${cut.error}` };
		cwd = cut.result.path;
	}

	const prefix = stampPrefix(step.mantle, theaterOf(buildingPath));
	const stamp = prefix === null ? null : ordinal(prefix, nextOrdinal(prefix, new Set(), known));
	const composed = compose(rig, {
		summons: step.kickoff.text, mantle: step.mantle, tier: step.tier,
		cwd, account: step.account, known, ...(stamp === null ? {} : { stamp }),
	});
	if ('blocked' in composed) return { ev: 'refused', step: step.id, why: composed.blocked };

	// A fresh fire, never a resume: the engine opens a session with its kickoff as the first user turn
	// (B5 E2's law reads the other way round here — there is nothing to leave alone).
	const fired = await fire({ ...composed.body, resume: null }, password);
	return fired.ok
		? { ev: 'fired', step: step.id, workspace: fired.result.workspace, stamp: composed.body.stamp }
		: { ev: 'refused', step: step.id, why: fired.error, stamp: composed.body.stamp };
}

/**
 * One engine pass over every declared flow. **Single-flight** — a pass that overlaps itself would
 * read the log it is halfway through writing and fire a step twice — and cheap when nothing is
 * armed: the run logs are read first, and the census, the register and the socket are never touched
 * for a city with no armed flow.
 */
export async function tick(): Promise<TickReport> {
	if (ticking) return { flows: 0, lines: 0, fires: 0, skipped: true };
	ticking = true;
	try { return await pass(); }
	finally { ticking = false; }
}

async function pass(): Promise<TickReport> {
	const rig = readRig();
	const reads = readFlows(rig);
	const armedReads: { flow: Flow; run: Run }[] = [];
	let lines = 0, fires = 0;

	for (const r of reads) {
		const name = r.ok ? r.flow.name : r.fail.name;
		const run = readRun(name);
		if (armedAt(run) === null) continue;
		// D10: an armed flow whose file stopped parsing pauses with the conflict named, and fires
		// nothing. The Works renders the parser's own sentence beside it (parser-as-lint).
		if (!r.ok) {
			const said = flowLast(run);
			const why = `${r.fail.code} — ${r.fail.error}`;
			if (changed(said, 'paused', why)) lines += appendRun(name, [{ ev: 'paused', why }]);
			continue;
		}
		armedReads.push({ flow: r.flow, run });
	}
	if (armedReads.length === 0) return { flows: 0, lines, fires: 0, skipped: false };

	const census = readCensus();
	const halt = readHalt();
	const { buildings } = city();
	const known = stampsOf(census.sessions);
	const busy = new Set<string>();
	const cred = readCredential();

	const trusts = new Map<string, Trust>();

	for (const { flow, run } of armedReads) {
		const home = buildings.find(b => b.building === flow.building) ?? null;
		const rows = new Map<string, BoardRow>();
		const rowIds = new Set<string>();
		for (const board of home?.board ?? []) for (const row of board.rows) {
			rows.set(row.id.toLowerCase(), row);
			rowIds.add(row.id);
		}
		const path = buildingPath(flow.building, buildings);

		const world: World = {
			now: Date.now() / 1000, halt,
			sessions: new Map(census.sessions.map(s => [s.sid, s])),
			stamped: new Map(census.sessions.filter(s => s.stamp !== null).map(s => [s.stamp!, s])),
			rows, rowIds, busy, buildingPath: path,
			// D12's decision is made here rather than in `plan()` because the in-scope test ends in a
			// trust precheck, and that spawns `git` (B10 F7's cost, paid on a delta and nowhere else).
			join: scopeJoin(flow, run, step => refuseStep(step, rig, trusts)),
		};

		const decided = plan(flow, run, world);
		lines += appendRun(flow.name, decided.lines);

		if (decided.fires.length === 0) continue;
		if (!cred.ok) {
			// Cold hands cannot fire, and saying so once is the honest state; it is not a refusal of
			// the step, so no `refused` line goes down — the arming switch is Felix's gesture, not the
			// flow's fault (D9). The log is re-read because this pass just wrote to it.
			const said = flowLast(decided.lines.length === 0 ? run : readRun(flow.name));
			const why = `hands disabled — ${cred.error}`;
			if (changed(said, 'paused', why)) lines += appendRun(flow.name, [{ ev: 'paused', why }]);
			continue;
		}
		for (const step of decided.fires) {
			const line = await fireStep(flow, step, rig, known, cred.result, world.buildingPath);
			lines += appendRun(flow.name, [line]);
			if (line.ev === 'fired') fires++;
		}
	}

	return { flows: armedReads.length, lines, fires, skipped: false };
}

/**
 * The clock. Started by the server and **only** by the server: a module-scope interval would drive
 * Felix's real desktop from any test process that imported this file (B8 F1's lesson, one door
 * further along).
 */
export function startEngine(): void {
	if (timer !== null) return;
	timer = setInterval(() => void tick().catch(e => console.error('engine tick:', e)), TICK_MS);
	void kick();
}

/** A tick now, off the request thread — after every hands action and after every arm (§2). */
export const kick = (): void => { void tick().catch(e => console.error('engine kick:', e)); };

// ---------- the route ----------

/**
 * `POST /flow/<name>/{arm,pass}` — **credential-gated**, like every hand: an arm authorizes socket
 * writes, and so does passing the card in front of one. A disabled glass answers 503 with the reason
 * and never parses a body it could not act on.
 */
export async function flowRoute(req: Request, path: string): Promise<Response> {
	if (req.method !== 'POST') return json({ ok: false, error: 'the flow routes are POST-only' }, 405);

	const [name = '', action = ''] = path.split('/');
	const cred = readCredential();
	if (!cred.ok) return json({ ok: false, error: `hands disabled — ${cred.error}` }, 503);

	let body: unknown;
	try { body = JSON.parse((await req.text()) || 'null'); }
	catch (e) { return json({ ok: false, error: `body is not JSON: ${(e as Error).message}` }, 400); }
	const r = (body ?? {}) as Record<string, unknown>;

	if (action === 'arm') {
		const hash = typeof r['hash'] === 'string' ? r['hash'] : null;
		const armed = armFlow(name, hash);
		if (armed.ok) kick();
		return json(armed, armed.ok ? 200 : 409);
	}
	if (action === 'pass') {
		const step = typeof r['step'] === 'string' ? r['step'] : '';
		const passed = passGate(name, step);
		if (passed.ok) kick();
		return json(passed, passed.ok ? 200 : 409);
	}
	return json({ ok: false, error: `no such flow action: ${action} — arm, pass` }, 404);
}
