// The reactive gate's reasoning, on no disk at all.
//
// `judge.ts` is pure over `Flow` + `Run` by construction (B12 §the module), so every branch of the
// classifier, the judge's derivation and D12's scope-arm decision is a literal here — no env knobs,
// no fixture city, and in particular **no `city()`**: the register holds one warm copy keyed on
// nothing, so a test file that walked a city would silently decide another file's results (B15 F4).
// The corpus-wide misclassification measurement therefore rides quoted annotations rather than a
// live walk; the full figures are in `lab/b12/probe.ts` and the row's findings.
//
// What is not here is anything that fires: the gate's live behaviour is `engine.test.ts` (over
// `plan()`) and `lab/b12/probe.ts` (over a real glass and real sessions).

import { expect, test, describe } from 'bun:test';
import { escalationsIn } from './attention';
import { DEFAULT_TIMEOUT_MINUTES, stepHash, type Flow, type Run, type RunLine, type Step } from './flow';
import {
	ARM_SCOPE, classifies, deltaOf, gatedOf, isJudge, judgeIdOf, judgeStep, judgeSummons, judgesOf,
	scopeJoin, stepMarks, SPEC_PATTERNS, type LandingCode,
} from './judge';

// ---------- fixtures, as literals ----------

const stepOf = (over: Partial<Step> & { id: string }): Step => {
	const s = {
		name: 'A step', kickoff: { text: 'You are a Builder at sonnet-low. Do it.', doc: null, fence: null },
		account: 'personal', mantle: 'Builder' as const, tier: 'sonnet-low',
		venue: { kind: 'master' as const, cwd: '/Users/felix/code/agents' },
		depends: [] as string[], gate: { kind: 'none' as const },
		timeoutMinutes: DEFAULT_TIMEOUT_MINUTES, depth: 0, ...over,
	};
	return { ...s, hash: stepHash(s) };
};

const flowOf = (steps: Step[], over: Partial<Flow> = {}): Flow => ({
	name: 'f', file: '/f.flow.json', building: 'agents/belvedere',
	scope: 'agents/belvedere · the flow chapter', created: '2026-08-28',
	concurrency: 1, judgeTier: 'fable-high', hash: 'flowhash', steps, ...over,
});

const line = (over: Partial<RunLine> & { ev: RunLine['ev'] }): RunLine => ({
	ts: 1_700_000_000, step: null, sid: null, workspace: null, why: null, hash: null, stamp: null,
	steps: null, ...over,
});

const runOf = (lines: RunLine[]): Run => ({ file: '/f.run.jsonl', present: true, lines, malformed: 0 });

const BUILDING = '/Users/felix/code/agents/belvedere';

// ---------- §3: one judge per gated landing, made structural ----------

describe('the judge id is derived, so the loop limit is unrepresentable (§3)', () => {
	test('a step has exactly one legal judge, and it names the step it was inserted for', () => {
		expect(judgeIdOf('b3')).toBe('b3.judge');
		expect(gatedOf('b3.judge')).toBe('b3');
		expect(isJudge('b3.judge')).toBe(true);
		expect(isJudge('b3')).toBe(false);
	});

	test('a judge’s judge has no id — recursion is refused at the grammar, not at a counter', () => {
		expect(gatedOf('b3.judge.judge')).toBeNull();
		expect(isJudge('b3.judge.judge')).toBe(false);
		expect(gatedOf('.judge')).toBeNull();
		expect(gatedOf('b3')).toBeNull();
	});
});

// ---------- §1: the classifier, interim ----------

describe('the landing classifier takes three codes and leaves two alone (§1)', () => {
	test('the gate fires on a landing the engine could not accept', () => {
		for (const code of ['killed', 'escalated', 'no-stop'] as LandingCode[]) expect(classifies(code)).toBe(true);
	});

	test('…and never on a clean landing, on somebody else’s step, or on a session still alive', () => {
		// `in-flight` would collide with whoever is already on the row; `timeout` means the session is
		// STILL THERE, and the engine kills nothing (B11 §6) — a judge sent at a row a live agent is
		// mid-way through editing is the wrong continuation D10 exists to prevent.
		for (const code of ['clean', 'in-flight', 'timeout'] as LandingCode[]) expect(classifies(code)).toBe(false);
	});
});

describe('the misclassification log, over real annotations (§1’s G2 evidence)', () => {
	// Quoted verbatim off the live board rows they belong to, `strip()`ped exactly as `grammar.ts`
	// hands them to the glass (B14 F2). The full-corpus figures — 390 LANDED rows, `escalationsIn`
	// gates 0, these three patterns gate 120, `/escalat/i` alone gates 113 — are `lab/b12/probe.ts`'s.
	const REAL: [string, string][] = [
		['agents/belvedere B10', 'LANDED 2026-08-27 — the plan is drawn; nothing escalated, DoD evidenced in B10.'],
		['agents/belvedere B11', 'LANDED 2026-08-28 — the string runs itself; nothing escalated, DoD evidenced in B11.'],
		['agents/belvedere B6', 'LANDED 2026-08-27 — his word travels; nothing escalated, DoD evidenced in B6.'],
		['agents 18f', 'partial (2026-08-26) — 4 of 5 buildings migrated (7 residual, all the escalated vocab gaps); snappy BLOCKED on a malform'],
		['agents/belvedere G1', '(Architect half) 2026-08-26 — both branches merged, escalations ruled (D54 accepted; E1 → content-scope)'],
		['cornerizer', 'all 4 escalations ruled at the 2026-08-15 review (D11, E1–E4 — §6 fold, log)'],
	];

	test('the order’s own pattern list gates every one of them; the measured detector gates none', () => {
		const ids = new Set<string>();
		for (const [where, annotation] of REAL) {
			expect(SPEC_PATTERNS.some(p => p.test(annotation))).toBe(true);
			expect(escalationsIn(annotation, ids)).toEqual([]);
			expect(where.length).toBeGreaterThan(0);
		}
	});

	test('and the two agree on the thing the gate is actually for', () => {
		const raised = 'LANDED 2026-08-28 — E1 — the register policy needs a ruling';
		expect(escalationsIn(raised, new Set()).map(e => e.id)).toEqual(['E1']);
		expect(SPEC_PATTERNS.some(p => p.test(raised))).toBe(true);
	});
});

// ---------- §2: the sitting the gate composes ----------

describe('the judge sitting is derived, and both sides of the glass derive it the same way (§2)', () => {
	const gated = stepOf({ id: 'b3', name: 'Baton rail', depth: 2, timeoutMinutes: 90 });
	const flow = flowOf([gated]);
	const WHY = 'LANDED, and E1 is raised with nothing saying it was ruled (keel §5.1)';

	test('the fence names the mantle and the tier the step is actually staffed at (B17 F3)', () => {
		const text = judgeSummons(BUILDING, 'b3', 'fable-high', WHY);
		expect(text.startsWith('You are an Architect at fable-high.')).toBe(true);
		expect(text).toContain('~/code/agents/canon/mantles/architect.md');
		expect(text).toContain('~/code/agents/belvedere/ISSUES.md');
		expect(text).toContain('row B3');
		expect(text).toContain(WHY);
		// The compose-time refusals a fire would hit (P6, B16 F6): never a TAB, never a leading slash.
		expect(text).not.toContain('\t');
		expect(text.startsWith('/')).toBe(false);
	});

	test('the step it becomes: the flow’s judge tier, the gated step’s account and checkout, no dependencies', () => {
		const j = judgeStep(flow, gated, BUILDING, WHY);
		expect(j.id).toBe('b3.judge');
		expect(j.name).toBe('Judge B3');
		expect(j.mantle).toBe('Architect');
		expect(j.tier).toBe('fable-high');
		expect(j.account).toBe('personal');
		expect(j.gate.kind).toBe('architect');
		expect(j.venue).toEqual({ kind: 'master', cwd: '/Users/felix/code/agents' });
		// It depends on NOTHING: its precondition is that the gated step is stuck, which has already
		// happened — a judge waiting on the step it was inserted to unstick waits forever.
		expect(j.depends).toEqual([]);
		expect(j.depth).toBe(3);
		expect(j.timeoutMinutes).toBe(90);
	});

	test('a worktree-venue step’s judge sits on the building’s own checkout, never in the branch', () => {
		const w = stepOf({ id: 'b4', venue: { kind: 'worktree', repo: '/Users/felix/code/agents', branch: 'bv/x' } });
		expect(judgeStep(flowOf([w]), w, BUILDING, WHY).venue).toEqual({ kind: 'master', cwd: BUILDING });
	});

	test('`judgesOf` re-derives exactly what the engine fired, off the `extended` line alone', () => {
		const run = runOf([line({ ev: 'extended', step: 'b3.judge', why: WHY })]);
		const [j] = judgesOf(flow, run, BUILDING);
		expect(j).toEqual(judgeStep(flow, gated, BUILDING, WHY));
	});

	test('…once per judge, never for a step this flow no longer declares, never for a judge’s judge', () => {
		const run = runOf([
			line({ ev: 'extended', step: 'b3.judge', why: WHY }),
			line({ ev: 'extended', step: 'b3.judge', why: WHY }),
			line({ ev: 'extended', step: 'ghost.judge', why: WHY }),
			line({ ev: 'extended', step: 'b3.judge.judge', why: WHY }),
			line({ ev: 'extended', step: null, why: WHY }),
		]);
		expect(judgesOf(flow, run, BUILDING).map(s => s.id)).toEqual(['b3.judge']);
	});
});

// ---------- §4: what moved since the arm ----------

describe('the delta reader tells an addition from an edit (§4)', () => {
	const a = stepOf({ id: 'a' });
	const b = stepOf({ id: 'b', depends: ['a'] });
	const flow = flowOf([a, b]);
	const armedRun = (f: Flow) => runOf([line({ ev: 'armed', hash: f.hash, steps: stepMarks(f) })]);

	test('nothing moved', () => {
		expect(deltaOf(flow, armedRun(flow))).toEqual({ added: [], edited: [], removed: [], frameMoved: false });
	});

	test('an addition is added, and nothing else is disturbed', () => {
		const c = stepOf({ id: 'c', depends: ['b'] });
		const d = deltaOf(flowOf([a, b, c]), armedRun(flow))!;
		expect(d.added.map(s => s.id)).toEqual(['c']);
		expect(d.edited).toEqual([]);
		expect(d.removed).toEqual([]);
	});

	test('an edit to a step already armed is an edit — including one only to its kickoff', () => {
		const b2 = stepOf({ id: 'b', depends: ['a'], kickoff: { text: 'You are a Builder at sonnet-low. Do something ELSE.', doc: null, fence: null } });
		expect(deltaOf(flowOf([a, b2]), armedRun(flow))!.edited).toEqual(['b']);
	});

	test('a removal is a removal', () => {
		expect(deltaOf(flowOf([a]), armedRun(flow))!.removed).toEqual(['b']);
	});

	test('depth is NOT identity — adding a step behind another does not read as editing it', () => {
		const deep = stepOf({ id: 'c', depends: ['b'], depth: 2 });
		const d = deltaOf(flowOf([a, b, deep]), armedRun(flow))!;
		expect(d.edited).toEqual([]);
	});

	test('the frame rides the same field: building, scope, concurrency and judge tier', () => {
		for (const over of [{ building: 'agents' }, { scope: 'somewhere else' }, { concurrency: 4 }, { judgeTier: 'opus-high' }])
			expect(deltaOf(flowOf([a, b], over), armedRun(flow))!.frameMoved).toBe(true);
	});

	test('an arm that recorded no marks answers UNKNOWN, and unknown is never “only additions”', () => {
		expect(deltaOf(flow, runOf([line({ ev: 'armed', hash: flow.hash })]))).toBeNull();
		expect(deltaOf(flow, runOf([]))).toBeNull();
	});
});

// ---------- §4: D12, as ruled ----------

describe('scope-arm: growth inside the arm joins, everything else waits for his click (D12)', () => {
	const a = stepOf({ id: 'a' });
	const b = stepOf({ id: 'b', depends: ['a'] });
	const flow = flowOf([a, b]);
	const armedRun = runOf([line({ ev: 'armed', hash: flow.hash, steps: stepMarks(flow) })]);
	const warm = () => null;
	const cold = () => 'personal has never trusted /nowhere';

	test('the ruling is a module constant, not a per-flow field', () => {
		// A flow that could choose its own arm scope would be a flow that authorized its own growth.
		expect(ARM_SCOPE).toBe('scope');
	});

	test('an in-scope addition auto-joins, and the re-arm says why in D12’s own words', () => {
		const c = stepOf({ id: 'c', depends: ['b'] });
		const grown = flowOf([a, b, c]);
		const join = scopeJoin(grown, armedRun, warm);
		expect(join.kind).toBe('join');
		if (join.kind !== 'join') throw new Error('unreachable');
		expect(join.why).toContain('scope-arm auto-join (D12)');
		expect(join.why).toContain('c');
		expect(join.steps).toEqual(stepMarks(grown));
	});

	test('an unchanged flow decides nothing — B11’s behaviour stands where there is no delta', () => {
		expect(scopeJoin(flow, armedRun, warm).kind).toBe('none');
	});

	test('an edit still pauses, and the pause names the step rather than the file', () => {
		const b2 = stepOf({ id: 'b', depends: ['a'], tier: 'opus-high' });
		const j = scopeJoin(flowOf([a, b2, stepOf({ id: 'c' })]), armedRun, warm);
		expect(j.kind).toBe('pause');
		expect(j.kind === 'pause' && j.why).toContain('b was edited since the arm');
	});

	test('…and an edit with NO addition beside it names the step too', () => {
		// The named refusals run before the "nothing to join" exit. With the two the other way round,
		// an edit-only delta falls through to B11's generic sentence: he is told the plan moved and
		// not told where. Measured on a live glass at this row's DoD before it was fixed.
		const b2 = stepOf({ id: 'b', depends: ['a'], tier: 'opus-high' });
		const j = scopeJoin(flowOf([a, b2]), armedRun, warm);
		expect(j.kind === 'pause' && j.why).toContain('b was edited since the arm');
	});

	test('a removal pauses', () => {
		const j = scopeJoin(flowOf([a, stepOf({ id: 'c' })]), armedRun, warm);
		expect(j.kind === 'pause' && j.why).toContain('b was removed since the arm');
	});

	test('a moved frame pauses — scope-arm covers growth inside the arm, never a new scope', () => {
		const j = scopeJoin(flowOf([a, b, stepOf({ id: 'c' })], { concurrency: 9 }), armedRun, warm);
		expect(j.kind === 'pause' && j.why).toContain('frame moved');
	});

	test('an addition reaching a venue the arm never covered pauses', () => {
		const elsewhere = stepOf({ id: 'c', venue: { kind: 'master', cwd: '/Users/felix/code/hexwright' } });
		const j = scopeJoin(flowOf([a, b, elsewhere]), armedRun, warm);
		expect(j.kind === 'pause' && j.why).toContain('which this arm never covered');
	});

	test('…and so does one reaching an account the arm never covered', () => {
		const other = stepOf({ id: 'c', account: 'thg-fgreen' });
		const j = scopeJoin(flowOf([a, b, other]), armedRun, warm);
		expect(j.kind === 'pause' && j.why).toContain('thg-fgreen account');
	});

	test('an addition that would not have survived the click does not survive the join either', () => {
		// One list of what an arm checks (`refuseStep`), applied at both doors — P5 F5 (iv): loud, at
		// arm, never a silent mid-flow stall.
		const j = scopeJoin(flowOf([a, b, stepOf({ id: 'c' })]), armedRun, cold);
		expect(j.kind === 'pause' && j.why).toContain('step c cannot join: personal has never trusted');
	});

	test('an arm that recorded no marks never joins — it gets B11’s behaviour verbatim', () => {
		// Telemetry written before `RunLine.steps` existed cannot tell an addition from an edit, so the
		// answer is the base behaviour rather than a refusal of scope-arm's own: `plan()` writes the
		// generic amendment pause, which is also the sentence that tells him to re-arm.
		const legacy = runOf([line({ ev: 'armed', hash: flow.hash })]);
		expect(scopeJoin(flowOf([a, b, stepOf({ id: 'c' })]), legacy, warm).kind).toBe('none');
		expect(deltaOf(flow, legacy)).toBeNull();
	});
});
