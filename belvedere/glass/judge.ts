/**
 * The reactive gate, and the string that grows while it runs (B12, flow-keel §§5.1, 4).
 *
 * Two mechanisms, one module, because they answer the same question — **what may happen to an armed
 * plan without Felix clicking anything**:
 *
 *  1. **The gate.** A landing the engine cannot read as clean does not card the sovereign: it
 *     **fires the scoped Architect sitting into the lane** and waits. The verdict is then read back
 *     off the files — clean now, the lane runs on; still not clean, the card is his after all. The
 *     judge is a fired *sitting*: nothing here rules on work, it only routes it (§out of scope).
 *  2. **Dynamic extension.** An armed flow is immutable (B11 §1), and D12 rules **scope-arm**
 *     (Felix, 2026-08-27, "rec"): a delta that only *adds* steps inside the arm's own scope joins
 *     the running flow. Anything else — an edit, a removal, an addition reaching somewhere the arm
 *     never covered — still stops for his click.
 *
 * **Nothing here writes.** Every function is pure over `Flow` + `Run` (plus one injected trust
 * precheck, which spawns `git` and is therefore the caller's to pay); the engine appends the lines
 * and presses the hands. That is what lets the whole of B12's reasoning be a unit test.
 *
 * **The judge lives in the run log, never in the flow file** — the glass writes no truth (README
 * §2), so an inserted node is a `{ev: "extended"}` line and a derivation from it, and the flow file
 * stays the sitting's to amend.
 */

import { createHash } from 'crypto';
import { homedir } from 'os';
import type { Mantle } from '../../doctrine';
import { armedLine, stepHash, type Flow, type Run, type Step } from './flow';

/** The judge's own staffing: the mantle is fixed (the sitting is an Architect's), the tier is the flow's. */
const JUDGE_MANTLE: Mantle = 'Architect';

/**
 * **One judge per gated landing** (§3, and directive 3.1: everything has a limit). The id is
 * *derived*, not minted, which is what makes that limit structural rather than remembered: there is
 * exactly one legal judge id per step, so a second insertion is unrepresentable, and a judge's own
 * judge would be `<id>.judge.judge` — which `gatedOf` refuses below.
 */
const SUFFIX = '.judge';

export const judgeIdOf = (stepId: string): string => `${stepId}${SUFFIX}`;

/** The step a judge was inserted for — null when this is not a judge id, or is a judge's judge. */
export function gatedOf(judgeId: string): string | null {
	if (!judgeId.endsWith(SUFFIX)) return null;
	const gated = judgeId.slice(0, -SUFFIX.length);
	return gated === '' || gated.endsWith(SUFFIX) ? null : gated;
}

export const isJudge = (stepId: string): boolean => gatedOf(stepId) !== null;

// ---------- §1: the landing classifier, interim ----------

/**
 * Why a landing did not read clean. **The gate fires on a landing the engine could not accept**,
 * and the code is what says so — never a string match on the sentence, because the sentence is for
 * Felix and the code is for the machine (make wrong code look wrong).
 */
export type LandingCode =
	| 'clean'       // the board row parses LANDED with nothing unruled, or the census buried it after `Stop`
	| 'killed'      // KILLED / BLOCKED — a state the engine never advances past
	| 'escalated'   // LANDED, and an escalation on it that nothing says was ruled
	| 'no-stop'     // the session is gone and `Stop` was not its last word
	| 'in-flight'   // the board says somebody else is already on it
	| 'timeout';    // the clock ran out and the session is still there

/**
 * Which codes the reactive gate takes (§1: *"malformed row, `KILLED`, dead-no-`Stop`,
 * escalation-marked LANDED"*).
 *
 * The two it deliberately leaves alone are the two where a judge would be **wrong, not merely
 * expensive**: `in-flight` means somebody is already on that step and a second sitting would collide
 * with them, and `timeout` means the session is *still alive* — the engine kills nothing (B11 §6),
 * so firing an Architect at a row a live agent is mid-way through editing is the wrong continuation
 * D10 exists to prevent. Both keep B11's behaviour: pause, and surface.
 */
const GATED: ReadonlySet<LandingCode> = new Set<LandingCode>(['killed', 'escalated', 'no-stop']);

export const classifies = (code: LandingCode): boolean => GATED.has(code);

/**
 * **The order's own pattern list, kept and named interim — and measured.** B12 §1 asks for a
 * constant of three patterns over the status annotation; it was written at the flow-cut sitting,
 * before B11 landed. What B11 then built for exactly this question is `attention.ts`'s
 * `escalationsIn` (B14 F2's detector, 0 false positives over 458 live rows), and `verdictOf` already
 * pauses on it — the Architect's own relay says *"B12 turns that pause into a judge fire"*.
 *
 * So the classifier is B11's pause, and this constant is the **misclassification log** the order
 * asks for as G2 evidence. Measured over the live city at this landing (`judge.test.ts`):
 *
 *     390 LANDED rows · escalationsIn gates 0 · these three patterns gate 120
 *     /escalat/i alone gates 113 — including `b10` and `b11` of this very flow, whose
 *     annotations read "nothing escalated"
 *
 * A false positive here is not a cheap direction: it is a fable-high sitting fired at a row that
 * said, in words, that there was nothing to rule. **The real fix is neither regex** — it is a
 * machine-readable `holds` on the landing grammar, canon's (keel §6).
 */
export const SPEC_PATTERNS: readonly RegExp[] = [/\bE\d+\s*[—-]/, /escalat/i, /BLOCKED/];

// ---------- §2: the sitting the gate fires ----------

/** A path in the city's own idiom — the corpus writes `~/code/agents`, so a summons does too. */
const tilde = (p: string): string => {
	const home = homedir();
	return p === home ? '~' : p.startsWith(home + '/') ? '~' + p.slice(home.length) : p;
};

/**
 * **The scoped Architect sitting**, B6's apply template narrowed from *sweep this inbox* to *rule
 * what this landing raised* (§2). Everything in it is derived from the flow, the gated step and the
 * engine's own sentence — so the bytes the Works draws on the inserted node and the bytes the hand
 * fires are one function's output, compared rather than argued about (B17 F4's law).
 *
 * The first line names the mantle and the tier the step is actually staffed at (B17 F3): a card
 * showing `fable-high` beside an `opus-high` fire is a card arguing with itself.
 */
export function judgeSummons(buildingPath: string, gatedId: string, tier: string, why: string): string {
	const b = tilde(buildingPath);
	return `You are an Architect at ${tier}.
Wear ~/code/agents/canon/mantles/architect.md,
then read ${b}/README.md (or its master doc) and ${b}/ISSUES.md,
and rule what row ${gatedId.toUpperCase()} raised at its landing:

  ${why}

Rule each escalation on that row, true the row and the ledger, file anything that
is Felix's to his inbox, commit in his git style. The flow reads its verdict off
the files, not off your report.`;
}

/**
 * The inserted step, derived. It **depends on nothing**: its precondition is that the gated step is
 * stuck, which has already happened — a judge that depended on the step it was inserted to unstick
 * would wait forever. The edge from the gated step to it is drawn (`worksFlow`), because that is the
 * relation; it is not a readiness dependency, and the two are not the same thing.
 */
export function judgeStep(flow: Flow, gated: Step, buildingPath: string, why: string): Step {
	const step = {
		id: judgeIdOf(gated.id),
		name: `Judge ${gated.id.toUpperCase()}`,
		kickoff: { text: judgeSummons(buildingPath, gated.id, flow.judgeTier, why), doc: null, fence: null },
		account: gated.account,
		mantle: JUDGE_MANTLE,
		tier: flow.judgeTier,
		/**
		 * **The gated step's own checkout**, where that is a master venue — which is both what the arm
		 * already covered and what single-writer physics requires, since `plan()` reserves a checkout by
		 * its cwd and two paths inside one repo do not compare equal. A worktree-venue step's judge falls
		 * back to the building's own path: a judge trues a board and a ledger, and a worktree would put
		 * that sitting's commits on a branch nobody merges.
		 */
		venue: gated.venue.kind === 'master' ? gated.venue : { kind: 'master' as const, cwd: buildingPath },
		depends: [],
		gate: { kind: 'architect' as const },
		timeoutMinutes: gated.timeoutMinutes,
		depth: gated.depth + 1,
	};
	return { ...step, hash: stepHash(step) };
}

/**
 * Every judge this run log has minted, re-derived. The `extended` line carries the gated step and
 * the sentence the sitting was fired about, so the derivation is total: the engine and the drawing
 * reach the same bytes without either of them storing a copy of a summons.
 */
export function judgesOf(flow: Flow, run: Run, buildingPath: string): Step[] {
	const out = new Map<string, Step>();
	for (const line of run.lines) {
		if (line.ev !== 'extended' || line.step === null || out.has(line.step)) continue;
		const gatedId = gatedOf(line.step);
		const gated = gatedId === null ? undefined : flow.steps.find(s => s.id === gatedId);
		if (gated === undefined) continue;      // a judge for a step this flow no longer declares
		out.set(line.step, judgeStep(flow, gated, buildingPath, line.why ?? ''));
	}
	return [...out.values()];
}

// ---------- §4: dynamic extension ----------

/**
 * **D12, as ruled: scope-arm** (Felix, 2026-08-27, "rec" — README §7; keel §4). One module constant
 * and one branch, exactly as B11 F5 said it would be: `'step'` is B11's base behaviour, where every
 * amendment waits for his click, and it stays reachable so the other branch is testable.
 *
 * This is **city law, not a per-flow field** — a flow that could choose its own arm scope would be a
 * flow that could authorize its own growth.
 */
export const ARM_SCOPE: 'scope' | 'step' = 'scope';

/**
 * The flow's frame — everything that is not a step. It rides the arm's marks under an id no step can
 * ever have (`STEP_ID` demands a leading `[a-z0-9]`), so "did the frame move?" is answered by the
 * same one field that answers "which steps moved?" rather than by a second one nobody maintains.
 */
const FRAME = '*';

const frameHash = (flow: Flow): string =>
	createHash('sha256').update(JSON.stringify([flow.building, flow.scope, flow.concurrency, flow.judgeTier])).digest('hex').slice(0, 16);

/** What one arm authorized, step by step — written onto the `armed` line (`RunLine.steps`). */
export const stepMarks = (flow: Flow): string[] =>
	[`${FRAME}:${frameHash(flow)}`, ...flow.steps.map(s => `${s.id}:${s.hash}`)];

export type Delta = { added: Step[]; edited: string[]; removed: string[]; frameMoved: boolean };

/**
 * What moved since the arm. Null where the answer is unknown — nothing armed, or an `armed` line
 * from before `RunLine.steps` existed — and unknown is never treated as "only additions".
 */
export function deltaOf(flow: Flow, run: Run): Delta | null {
	const marks = armedLine(run)?.steps ?? null;
	if (marks === null) return null;

	const was = new Map(marks.map(m => [m.slice(0, m.lastIndexOf(':')), m.slice(m.lastIndexOf(':') + 1)]));
	const added: Step[] = [];
	const edited: string[] = [];
	for (const s of flow.steps) {
		const had = was.get(s.id);
		if (had === undefined) added.push(s);
		else if (had !== s.hash) edited.push(s.id);
	}
	const now = new Set<string>(flow.steps.map(s => s.id));
	const removed = [...was.keys()].filter(id => id !== FRAME && !now.has(id));
	return { added, edited, removed, frameMoved: was.get(FRAME) !== frameHash(flow) };
}

/** Where a step runs, as one comparable string — the arm's unit of "somewhere I already said yes to". */
const venueKey = (s: Step): string => s.venue.kind === 'master' ? `master ${s.venue.cwd}` : `worktree ${s.venue.repo}`;

export type Join =
	| { kind: 'none' }                                    // nothing to decide — B11's behaviour stands
	| { kind: 'join'; why: string; steps: string[] }      // scope-arm: the additions auto-join
	| { kind: 'pause'; why: string };                     // named refusal, in place of B11's generic one

/**
 * **The scope-arm decision** (§4). An addition joins an armed flow only where every part of it was
 * already covered by the click that armed it:
 *
 *  · the **frame** is unmoved — same building, same scope, same concurrency, same judge tier;
 *  · nothing existing was **edited or removed** (either is a change to what he read, not growth);
 *  · every added step's **venue and account** are ones the arm already covers, which is D12's
 *    "building + chapter" made checkable: growth may fill in the plan, never reach somewhere new;
 *  · every added step passes the **same arm-time checks** as the click would have applied —
 *    `warm()` carries P5 F5's model clause and trust precheck, refused by name.
 *
 * Anything else pauses **with the reason on it**, which is the whole improvement over B11's generic
 * "amended since the arm": he is told what he is being asked to look at.
 */
export function scopeJoin(flow: Flow, run: Run, warm: (s: Step) => string | null): Join {
	if (ARM_SCOPE !== 'scope') return { kind: 'none' };

	const delta = deltaOf(flow, run);
	if (delta === null) return { kind: 'pause', why: 'the arm did not record which steps it covered, so an addition cannot be told from an edit — re-arm to authorize this plan' };
	if (delta.added.length === 0) return { kind: 'none' };
	if (delta.frameMoved) return { kind: 'pause', why: 'the flow\'s own frame moved (building, scope, concurrency or judge tier) — scope-arm covers growth inside the arm, never a new scope' };
	if (delta.edited.length > 0) return { kind: 'pause', why: `${delta.edited.join(', ')} ${delta.edited.length === 1 ? 'was' : 'were'} edited since the arm — scope-arm joins additions, and an edit is a change to what was authorized` };
	if (delta.removed.length > 0) return { kind: 'pause', why: `${delta.removed.join(', ')} ${delta.removed.length === 1 ? 'was' : 'were'} removed since the arm — scope-arm joins additions only` };

	const venues = new Set(flow.steps.filter(s => !delta.added.includes(s)).map(venueKey));
	const accounts = new Set(flow.steps.filter(s => !delta.added.includes(s)).map(s => s.account));
	for (const s of delta.added) {
		if (!venues.has(venueKey(s)))
			return { kind: 'pause', why: `step ${s.id} runs at ${venueKey(s)}, which this arm never covered — an addition may fill in the plan, never reach somewhere new` };
		if (!accounts.has(s.account))
			return { kind: 'pause', why: `step ${s.id} runs on the ${s.account} account, which this arm never covered` };
		const refused = warm(s);
		if (refused !== null) return { kind: 'pause', why: `step ${s.id} cannot join: ${refused}` };
	}

	return {
		kind: 'join',
		why: `scope-arm auto-join (D12): ${delta.added.map(s => s.id).join(', ')} added inside ${flow.scope}`,
		steps: stepMarks(flow),
	};
}
