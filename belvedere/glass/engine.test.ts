// The engine's tested core: `plan()`, `verdictOf()`, the arm's refusals and the run log's write side.
//
// **Everything the engine decides is a pure function of three values** — the parsed flow, the run
// log, and a `World` — so every branch of the interim landing law, every pause, HALT, the
// concurrency cap, single-writer physics and the amendment lock are asserted here rather than
// against a live desktop. What is NOT here is anything that needs a real machine: a fire that
// actually spawns, a census that actually beats, and the arm over HTTP ride `lab/b11/probe.ts` and
// `lab/b11/smoke.ts`.
//
// Every disk anchor is wired through the env knobs `paths.ts` reads **per call**, saved and restored
// (B8 §4). `BELVEDERE_ENV` is pointed at a path that does not exist so nothing in this file can
// reach Felix's socket even by accident (B18's guard, one door further along).

import { expect, test, describe, afterAll, beforeEach } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import type { BoardRow } from '../../doctrine';
import type { Beat, Session } from './census';
import { plan, verdictOf, armFlow, passGate, type World } from './engine';
import {
	appendRun, armedHash, DEFAULT_TIMEOUT_MINUTES, readFlow, readRun, type Flow, type NewRunLine, type Step,
} from './flow';
import { judgeStep, scopeJoin, stepMarks } from './judge';

const CITY = join(import.meta.dir, '../../..');            // the real `~/code`, whatever `$HOME` is
const ROOT = mkdtempSync(join(tmpdir(), 'b11-engine-'));
const FLOWS = join(ROOT, 'flows');
const CENSUS = join(ROOT, 'census');
mkdirSync(FLOWS, { recursive: true });
mkdirSync(join(CENSUS, 'flows'), { recursive: true });

const saved = {
	flows: process.env.FLOWS_DIR, city: process.env.GLASS_CITY,
	census: process.env.CENSUS_DIR, env: process.env.BELVEDERE_ENV,
};
const restore = (k: keyof typeof saved, name: string) => {
	if (saved[k] === undefined) delete process.env[name]; else process.env[name] = saved[k];
};
afterAll(() => {
	restore('flows', 'FLOWS_DIR');
	restore('city', 'GLASS_CITY');
	restore('census', 'CENSUS_DIR');
	restore('env', 'BELVEDERE_ENV');
	rmSync(ROOT, { recursive: true, force: true });
});

const scratch = (): void => {
	process.env.FLOWS_DIR = FLOWS;
	process.env.GLASS_CITY = CITY;
	process.env.CENSUS_DIR = CENSUS;
	process.env.BELVEDERE_ENV = join(ROOT, 'no-such-credential');
};

// ---------- fixtures: a flow, a run log, a world ----------

const NOW = 1_700_000_000;

/**
 * A two-lane flow written from scratch rather than mutated from the city's own: this file is about
 * the engine's reasoning, and a fixture whose shape is chosen by the test is the one that can carry
 * a worktree lane, a Felix-card and a low timeout at the same time.
 */
const FLOW = {
	building: 'nb/engine',
	scope: 'nb/engine · the engine chapter',
	created: '2026-08-28',
	concurrency: 2,
	judgeTier: 'fable-high',
	steps: [
		{ id: 'a', name: 'The root', account: 'personal', tier: 'Builder · sonnet-low', venue: { kind: 'master', cwd: '~/code/agents' }, depends: [], kickoff: 'You are a Builder at sonnet-low. Do a.' },
		{ id: 'b', name: 'Left lane', account: 'personal', tier: 'Builder · sonnet-low', venue: { kind: 'worktree', repo: '~/code/agents', branch: 'bv/e-left' }, depends: ['a'], kickoff: 'You are a Builder at sonnet-low. Do b.' },
		{ id: 'c', name: 'Right lane', account: 'personal', tier: 'Builder · sonnet-low', venue: { kind: 'worktree', repo: '~/code/agents', branch: 'bv/e-right' }, depends: ['a'], kickoff: 'You are a Builder at sonnet-low. Do c.' },
		{ id: 'd', name: 'His card', account: 'personal', tier: 'Architect · fable-high', venue: { kind: 'master', cwd: '~/code/agents' }, depends: ['b', 'c'], gate: { kind: 'felix', card: 'His arm is the gate.' }, kickoff: 'You are an Architect at fable-high. Close it.' },
	],
} as const;

let n = 0;
/** One flow file in scratch, parsed. `change` is the only thing that differs from the fixture. */
function flowOf(change: (f: Record<string, unknown>) => void = () => {}): Flow {
	scratch();
	const copy = JSON.parse(JSON.stringify(FLOW)) as Record<string, unknown>;
	change(copy);
	const name = `e${n++}`;
	writeFileSync(join(FLOWS, `${name}.flow.json`), JSON.stringify(copy, null, '\t'));
	const r = readFlow(name);
	if (!r.ok) throw new Error(`${name}: ${r.fail.code} — ${r.fail.error}`);
	return r.flow;
}

const steps = (f: Record<string, unknown>) => f['steps'] as Record<string, unknown>[];
const step = (f: Record<string, unknown>, id: string) => steps(f).find(s => s['id'] === id)!;

/** A run log on disk, so the write side is exercised by every test that needs a read (one format). */
function runOf(flow: Flow, lines: NewRunLine[], ts = NOW - 3600): ReturnType<typeof readRun> {
	rmSync(join(CENSUS, 'flows', `${flow.name}.run.jsonl`), { force: true });
	// Each line a second apart, in order — the reader sorts by ts, never by file position.
	lines.forEach((l, i) => appendRun(flow.name, [l], ts + i));
	return readRun(flow.name);
}

/** An armed flow, as `armFlow` really writes one: the hash, **and what each step was** (B12 §4). */
const armed = (flow: Flow, rest: NewRunLine[] = [], ts = NOW - 3600): ReturnType<typeof readRun> =>
	runOf(flow, [{ ev: 'armed', hash: flow.hash, steps: stepMarks(flow) }, ...rest], ts);

const beat = (over: Partial<Beat>): Beat => ({
	t: NOW - 60, ev: 'Stop', sid: 's', acct: '/Users/felix/.claude', pid: 4242,
	ws: 'W', sf: 'S', cwd: '/Users/felix/code/agents', tp: null, tool: null, why: null,
	aid: null, at: null, bg: [], ...over,
});

const session = (over: Partial<Session> & { sid: string }): Session => ({
	state: 'idle', last: beat({ sid: over.sid }), beats: 3, account: '/Users/felix/.claude',
	cwd: '/Users/felix/code/agents', tool: null, stamp: null, model: 'sonnet', transcript: null,
	agent: null, roster: null, ...over,
});

const row = (over: Partial<BoardRow> & { id: string }): BoardRow => ({
	work: 'A row', workDoc: null, dependsOn: [], gates: [], mantle: 'Builder', tier: 'sonnet-low',
	felixGate: false, rider: null, state: 'OPEN', annotation: '', line: 1, ...over,
});

function world(over: Partial<World> = {}): World {
	const sessions = over.sessions ?? new Map<string, Session>();
	const rows = over.rows ?? new Map<string, BoardRow>();
	return {
		now: NOW, halt: null, sessions,
		stamped: over.stamped ?? new Map([...sessions.values()].filter(s => s.stamp).map(s => [s.stamp!, s])),
		rows, rowIds: over.rowIds ?? new Set([...rows.values()].map(r => r.id)),
		busy: over.busy ?? new Set<string>(),
		buildingPath: '/Users/felix/code/agents/belvedere', join: { kind: 'none' },
		...over,
	};
}

const evs = (p: ReturnType<typeof plan>) => p.lines.map(l => `${l.ev}${l.step ? `:${l.step}` : ''}`);
const ids = (p: ReturnType<typeof plan>) => p.fires.map(s => s.id);
const whyOf = (p: ReturnType<typeof plan>, ev: string, id?: string) =>
	p.lines.find(l => l.ev === ev && (id === undefined || l.step === id))?.why ?? '';

// ---------- the arm is the authorization ----------

describe('an unarmed flow is inert — the arm IS the authorization (D11)', () => {
	beforeEach(scratch);

	test('nothing fires and nothing is written until something armed it', () => {
		const f = flowOf();
		const p = plan(f, runOf(f, []), world());
		expect(p.fires).toEqual([]);
		expect(p.lines).toEqual([]);
	});

	test('armed, the root fires and nothing behind it does', () => {
		const f = flowOf();
		const p = plan(f, armed(f), world());
		expect(ids(p)).toEqual(['a']);
	});
});

// ---------- §3: ready ----------

describe('ready — every dependency landed, and not one thing more', () => {
	beforeEach(scratch);

	test('the two lanes fire together once their root lands, and his card does not', () => {
		const f = flowOf();
		const p = plan(f, armed(f, [
			{ ev: 'fired', step: 'a', stamp: 'builder-e-01' },
			{ ev: 'landed', step: 'a' },
		]), world());
		expect(ids(p)).toEqual(['b', 'c']);
	});

	test('concurrency caps the engine-fired sessions — the bill, enforced', () => {
		const f = flowOf(c => { c['concurrency'] = 1; });
		const p = plan(f, armed(f, [{ ev: 'fired', step: 'a' }, { ev: 'landed', step: 'a' }]), world());
		expect(ids(p)).toEqual(['b']);
	});

	test('a live in-flight step counts against the cap', () => {
		const f = flowOf(c => { c['concurrency'] = 1; });
		const s = session({ sid: 'live', state: 'working', stamp: 'builder-e-01' });
		const p = plan(f, armed(f, [
			{ ev: 'fired', step: 'a', sid: 'live', stamp: 'builder-e-01' },
		]), world({ sessions: new Map([['live', s]]) }));
		expect(ids(p)).toEqual([]);
	});

	test('master venues are strictly serial per checkout; worktree lanes are not', () => {
		// Both lanes cut worktrees, so both may run: the fixture's own shape is the assertion.
		const parallel = flowOf();
		expect(ids(plan(parallel, armed(parallel, [{ ev: 'fired', step: 'a' }, { ev: 'landed', step: 'a' }]), world())))
			.toEqual(['b', 'c']);

		// Move one lane onto the shared checkout and the two can no longer both start.
		const shared = flowOf(c => { step(c, 'b')['venue'] = { kind: 'master', cwd: '~/code/agents' }; });
		const p = plan(shared, armed(shared, [{ ev: 'fired', step: 'a' }, { ev: 'landed', step: 'a' }]), world());
		expect(ids(p)).toEqual(['b', 'c']);   // b takes the checkout; c is a worktree and is free

		const both = flowOf(c => {
			step(c, 'b')['venue'] = { kind: 'master', cwd: '~/code/agents' };
			step(c, 'c')['venue'] = { kind: 'master', cwd: '~/code/agents' };
		});
		expect(ids(plan(both, armed(both, [{ ev: 'fired', step: 'a' }, { ev: 'landed', step: 'a' }]), world())))
			.toEqual(['b']);
	});

	test('a checkout another flow already holds in this pass is busy city-wide', () => {
		const f = flowOf();
		const busy = new Set(['/Users/felix/code/agents']);
		expect(ids(plan(f, armed(f), world({ busy })))).toEqual([]);
	});

	test('a step that has fired once is never fired again', () => {
		const f = flowOf();
		const p = plan(f, armed(f, [{ ev: 'refused', step: 'a', why: 'HALT' }, { ev: 'fired', step: 'a' }]), world());
		expect(ids(p)).toEqual([]);
	});
});

// ---------- §5: his card ----------

describe('a Felix-card pauses the lane and only his pass opens it (§5)', () => {
	beforeEach(scratch);

	const upTo = (f: Flow): NewRunLine[] => [
		{ ev: 'fired', step: 'a' }, { ev: 'landed', step: 'a' },
		{ ev: 'fired', step: 'b' }, { ev: 'landed', step: 'b' },
		{ ev: 'fired', step: 'c' }, { ev: 'landed', step: 'c' },
	];

	test('reached, it pauses — once, not once per tick', () => {
		const f = flowOf();
		const p = plan(f, armed(f, upTo(f)), world());
		expect(ids(p)).toEqual([]);
		expect(evs(p)).toEqual(['paused:d']);
		expect(whyOf(p, 'paused', 'd')).toContain('Felix-card');

		// The very next pass reads its own line and says nothing more.
		const again = plan(f, armed(f, [...upTo(f), { ev: 'paused', step: 'd', why: whyOf(p, 'paused', 'd') }]), world());
		expect(again.lines).toEqual([]);
		expect(again.fires).toEqual([]);
	});

	test('unreached, it is not carded early', () => {
		const f = flowOf();
		expect(evs(plan(f, armed(f), world()))).toEqual([]);
	});

	test('his pass — and only his pass — fires the step behind it', () => {
		const f = flowOf();
		const passed = [...upTo(f), { ev: 'paused' as const, step: 'd', why: 'a Felix-card' }, { ev: 'resumed' as const, step: 'd' }];
		expect(ids(plan(f, armed(f, passed), world()))).toEqual(['d']);
	});

	test('passGate refuses a card that is not his, a flow not armed, and a second pass', () => {
		const f = flowOf();
		runOf(f, []);
		expect(passGate(f.name, 'd').ok).toBe(false);                       // not armed
		armed(f, [{ ev: 'paused', step: 'd', why: 'a Felix-card' }]);
		expect(passGate(f.name, 'a').ok).toBe(false);                       // no card on that step
		expect(passGate(f.name, 'nope').ok).toBe(false);                    // no such step
		expect(passGate(f.name, 'd').ok).toBe(true);
		expect(readRun(f.name).lines.at(-1)!.ev).toBe('resumed');
		expect(passGate(f.name, 'd').ok).toBe(false);                       // already passed
	});
});

// ---------- §4: the interim landing law ----------

describe('landed means (interim law, keel §5.1)', () => {
	beforeEach(scratch);

	const fired: NewRunLine[] = [{ ev: 'fired', step: 'a', sid: 'x', stamp: 'builder-e-01' }];

	test('the census: Stop as the last event AND the pid gone', () => {
		const f = flowOf();
		const gone = session({ sid: 'x', state: 'gone', last: beat({ sid: 'x', ev: 'Stop' }) });
		const p = plan(f, armed(f, fired), world({ sessions: new Map([['x', gone]]) }));
		expect(evs(p)).toContain('landed:a');
		expect(whyOf(p, 'landed', 'a')).toContain('Stop');
		expect(ids(p)).toEqual(['b', 'c']);          // and the lane moves in the SAME pass
	});

	test('idle at Stop with a live pid is working-or-stalled, not landed', () => {
		const f = flowOf();
		const idle = session({ sid: 'x', state: 'idle', last: beat({ sid: 'x', ev: 'Stop' }) });
		const p = plan(f, armed(f, fired), world({ sessions: new Map([['x', idle]]) }));
		expect(p.lines).toEqual([]);
		expect(p.fires).toEqual([]);
	});

	// **Amended at B12** (three tests, same reason): B11 asserted that a gate-classified landing pauses
	// and does NOTHING else, because until B12 pausing was the whole behaviour. It is not any more —
	// the reactive gate staffs a judge for exactly these three codes. What each test protected is
	// unchanged and still checked: **the step itself pauses, and no declared step fires behind it.**
	test('a session gone WITHOUT a Stop is malformed — paused, and the gate staffs a judge', () => {
		const f = flowOf();
		const vanished = session({ sid: 'x', state: 'gone', last: beat({ sid: 'x', ev: 'PreToolUse' }) });
		const p = plan(f, armed(f, fired), world({ sessions: new Map([['x', vanished]]) }));
		expect(evs(p)).toEqual(['paused:a', 'extended:a.judge']);
		expect(whyOf(p, 'paused', 'a')).toContain('not Stop');
		expect(ids(p)).toEqual(['a.judge']);
	});

	test('the board: LANDED clean lands it, and the row outranks a still-live session', () => {
		const f = flowOf();
		const live = session({ sid: 'x', state: 'working' });
		const rows = new Map([['a', row({ id: 'A', state: 'LANDED', annotation: '2026-08-28 — done' })]]);
		const p = plan(f, armed(f, fired), world({ sessions: new Map([['x', live]]), rows }));
		expect(evs(p)).toContain('landed:a');
		expect(whyOf(p, 'landed', 'a')).toContain('board row parses LANDED clean');
	});

	test('a LANDED row raising an unruled escalation PAUSES — and B12’s judge is what fires', () => {
		const f = flowOf();
		const rows = new Map([['a', row({ id: 'A', state: 'LANDED', annotation: 'E1 — the register policy needs a ruling' })]]);
		const p = plan(f, armed(f, fired), world({ rows }));
		expect(evs(p)).toEqual(['paused:a', 'extended:a.judge']);
		expect(whyOf(p, 'paused', 'a')).toContain('E1');
		expect(ids(p)).toEqual(['a.judge']);
	});

	test('…and a ruled one does not', () => {
		const f = flowOf();
		const rows = new Map([['a', row({ id: 'A', state: 'LANDED', annotation: 'E1 — the policy · E1 ruled 2026-08-28' })]]);
		expect(evs(plan(f, armed(f, fired), world({ rows })))).toContain('landed:a');
	});

	test('KILLED and BLOCKED pause; they are never advanced past', () => {
		for (const state of ['KILLED', 'BLOCKED'] as const) {
			const f = flowOf();
			const rows = new Map([['a', row({ id: 'A', state })]]);
			const p = plan(f, armed(f, fired), world({ rows }));
			expect(evs(p)).toEqual([`paused:a`, 'extended:a.judge']);
			expect(whyOf(p, 'paused', 'a')).toContain(state);
		}
	});

	test('a step the engine never fired is landed by its board row — and the log stays silent', () => {
		// B10 F4: a ring that came off the board is not evidence the engine fired anything, so the
		// board lands the step for readiness and writes NOTHING into the run log.
		const f = flowOf();
		const rows = new Map([['a', row({ id: 'A', state: 'LANDED', annotation: 'landed by hand' })]]);
		const p = plan(f, armed(f), world({ rows }));
		expect(p.lines).toEqual([]);
		expect(ids(p)).toEqual(['b', 'c']);
	});

	test('a row the engine never fired that says IN FLIGHT holds the step — somebody is already on it', () => {
		const f = flowOf();
		const rows = new Map([['a', row({ id: 'A', state: 'IN FLIGHT' })]]);
		const p = plan(f, armed(f), world({ rows }));
		expect(p.lines).toEqual([]);
		expect(ids(p)).toEqual([]);
	});
});

describe('the timeout — everything has a limit, and the engine kills nothing (§4/§6)', () => {
	beforeEach(scratch);

	test('past its limit a fired step pauses with why: timeout, and no hand touches the session', () => {
		const f = flowOf(c => { step(c, 'a')['timeoutMinutes'] = 1; });
		const live = session({ sid: 'x', state: 'working' });
		const run = armed(f, [{ ev: 'fired', step: 'a', sid: 'x' }], NOW - 600);
		const p = plan(f, run, world({ sessions: new Map([['x', live]]) }));
		expect(evs(p)).toEqual(['paused:a']);
		expect(whyOf(p, 'paused', 'a')).toContain('timeout');
		// Nothing in the plan is an action against a session: the whole vocabulary is a line and a fire.
		expect(p.fires).toEqual([]);
	});

	test('inside its limit it is left alone', () => {
		const f = flowOf(c => { step(c, 'a')['timeoutMinutes'] = 240; });
		const live = session({ sid: 'x', state: 'working' });
		const run = armed(f, [{ ev: 'fired', step: 'a', sid: 'x' }], NOW - 600);
		expect(plan(f, run, world({ sessions: new Map([['x', live]]) })).lines).toEqual([]);
	});

	test('the default is four hours and it is on every step', () => {
		const f = flowOf();
		for (const s of f.steps) expect(s.timeoutMinutes).toBe(DEFAULT_TIMEOUT_MINUTES);
		expect(readFlow('nothing').ok).toBe(false);
	});

	test('a timeout is refused at the boundary, not clamped', () => {
		scratch();
		for (const bad of [0, -1, 99_999, 'soon']) {
			const name = `t${n++}`;
			const copy = JSON.parse(JSON.stringify(FLOW)) as Record<string, unknown>;
			step(copy, 'a')['timeoutMinutes'] = bad;
			writeFileSync(join(FLOWS, `${name}.flow.json`), JSON.stringify(copy));
			const r = readFlow(name);
			expect(r.ok).toBe(false);
			expect(r.ok || r.fail.code).toBe('field');
		}
	});
});

// ---------- the join: a fire returns a workspace, never a session id ----------

describe('the join — the stamp carries a fire until the census can name its session', () => {
	beforeEach(scratch);

	test('once the census reads the stamp, one more `fired` line carries the sid', () => {
		const f = flowOf();
		const s = session({ sid: 'real-sid', state: 'working', stamp: 'builder-e-01' });
		const p = plan(f, armed(f, [{ ev: 'fired', step: 'a', workspace: 'workspace:9', stamp: 'builder-e-01' }]),
			world({ sessions: new Map([['real-sid', s]]) }));
		expect(p.lines).toEqual([{ ev: 'fired', step: 'a', sid: 'real-sid', workspace: 'workspace:9', stamp: 'builder-e-01' }]);
	});

	test('and never a third time', () => {
		const f = flowOf();
		const s = session({ sid: 'real-sid', state: 'working', stamp: 'builder-e-01' });
		const p = plan(f, armed(f, [
			{ ev: 'fired', step: 'a', workspace: 'workspace:9', stamp: 'builder-e-01' },
			{ ev: 'fired', step: 'a', sid: 'real-sid', workspace: 'workspace:9', stamp: 'builder-e-01' },
		]), world({ sessions: new Map([['real-sid', s]]) }));
		expect(p.lines).toEqual([]);
	});

	test('a fire the census has never seen is in flight, not dead — the timeout is what ends it', () => {
		const f = flowOf(c => { c['concurrency'] = 1; });
		const p = plan(f, armed(f, [{ ev: 'fired', step: 'a', stamp: 'builder-e-01' }]), world());
		expect(p.lines).toEqual([]);
		expect(p.fires).toEqual([]);
	});

	test('landing reads the session through the stamp when the sid has not been joined yet', () => {
		const f = flowOf();
		const done = session({ sid: 'z', state: 'gone', stamp: 'builder-e-01', last: beat({ sid: 'z', ev: 'Stop' }) });
		const p = plan(f, armed(f, [{ ev: 'fired', step: 'a', stamp: 'builder-e-01' }]),
			world({ sessions: new Map([['z', done]]) }));
		expect(evs(p)).toContain('landed:a');
	});
});

// ---------- HALT: the flag's first consumer ----------

describe('HALT — nothing fires while the flag exists, and clearing it resumes (§5)', () => {
	beforeEach(scratch);

	test('the next fire is refused, by name, and the refusal is written once', () => {
		const f = flowOf();
		const halt = { at: '2026-08-28T00:00:00Z', by: 'felix', text: '2026-08-28T00:00:00Z felix' };
		const p = plan(f, armed(f), world({ halt }));
		expect(p.fires).toEqual([]);
		expect(evs(p)).toEqual(['refused:a']);
		expect(whyOf(p, 'refused', 'a')).toContain('HALT');

		const again = plan(f, armed(f, [{ ev: 'refused', step: 'a', why: whyOf(p, 'refused', 'a') }]), world({ halt }));
		expect(again.lines).toEqual([]);
	});

	test('cleared, the refused step is ready again — a refusal is not terminal', () => {
		const f = flowOf();
		const run = armed(f, [{ ev: 'refused', step: 'a', why: 'HALT — earlier' }]);
		expect(ids(plan(f, run, world()))).toEqual(['a']);
	});
});

// ---------- D10: ambiguity never arms, and never advances ----------

describe('D10 — the engine advances nothing it cannot read', () => {
	beforeEach(scratch);

	test('an unreadable run-state line stops everything: no fire, no landing, one named pause', () => {
		const f = flowOf();
		armed(f, [{ ev: 'fired', step: 'a', sid: 'x' }]);
		// A corrupted append — exactly what a half-written line or a hand-edit looks like.
		writeFileSync(join(CENSUS, 'flows', `${f.name}.run.jsonl`),
			readFileSync(join(CENSUS, 'flows', `${f.name}.run.jsonl`), 'utf8') + '{not json\n');
		const run = readRun(f.name);
		expect(run.malformed).toBe(1);

		const gone = session({ sid: 'x', state: 'gone', last: beat({ sid: 'x', ev: 'Stop' }) });
		const p = plan(f, run, world({ sessions: new Map([['x', gone]]) }));
		expect(p.fires).toEqual([]);
		expect(evs(p)).toEqual(['paused']);                      // flow-level, no step named
		expect(whyOf(p, 'paused')).toContain('unreadable');
		// The landing it would otherwise have recorded is NOT recorded: nothing advances.
		expect(evs(p)).not.toContain('landed:a');
	});

	test('the pause is written once, however long the log stays broken', () => {
		const f = flowOf();
		const p = plan(f, armed(f), world());
		expect(p.lines).toEqual([]);
		armed(f, []);
		writeFileSync(join(CENSUS, 'flows', `${f.name}.run.jsonl`),
			readFileSync(join(CENSUS, 'flows', `${f.name}.run.jsonl`), 'utf8') + 'garbage\n');
		const broken = readRun(f.name);
		const first = plan(f, broken, world());
		appendRun(f.name, first.lines);
		expect(plan(f, readRun(f.name), world()).lines).toEqual([]);
	});
});

// ---------- §1: armed flows are immutable ----------

describe('armed flows are immutable — an amendment pauses new fires and re-arm covers it', () => {
	beforeEach(scratch);

	test('a hash that has moved pauses the flow and fires nothing', () => {
		const f = flowOf();
		const run = runOf(f, [{ ev: 'armed', hash: 'a-different-plan-entirely' }]);
		const p = plan(f, run, world());
		expect(p.fires).toEqual([]);
		expect(evs(p)).toEqual(['paused']);
		expect(whyOf(p, 'paused')).toContain('amended');
	});

	test('what is already in flight runs on: a landing is still recorded while amended', () => {
		const f = flowOf();
		const gone = session({ sid: 'x', state: 'gone', last: beat({ sid: 'x', ev: 'Stop' }) });
		const run = runOf(f, [{ ev: 'armed', hash: 'stale' }, { ev: 'fired', step: 'a', sid: 'x' }]);
		const p = plan(f, run, world({ sessions: new Map([['x', gone]]) }));
		expect(evs(p)).toContain('landed:a');
		expect(p.fires).toEqual([]);
	});

	test('re-arming with the plan on disk resumes it', () => {
		const f = flowOf();
		const run = runOf(f, [
			{ ev: 'armed', hash: 'stale' },
			{ ev: 'paused', why: 'amended since the arm — re-arm to authorize the change (the flow file or a quoted kickoff moved)' },
			{ ev: 'armed', hash: f.hash },
		]);
		expect(armedHash(run)).toBe(f.hash);
		expect(ids(plan(f, run, world()))).toEqual(['a']);
	});

	test('the hash covers a QUOTED kickoff, not just the flow file (B10 F2)', () => {
		scratch();
		const doc = join(ROOT, 'quoted.md');
		writeFileSync(doc, 'text\n```\nYou are a Builder at sonnet-low. Version one.\n```\n');
		const f = flowOf(c => { step(c, 'a')['kickoff'] = { doc, fence: 1 }; });
		const first = f.hash;
		// The flow file is untouched; only the document it quotes moved.
		writeFileSync(doc, 'text\n```\nYou are a Builder at sonnet-low. Version TWO.\n```\n');
		const after = readFlow(f.name);
		expect(after.ok).toBe(true);
		expect(after.ok && after.flow.hash).not.toBe(first);
		expect(after.ok && after.flow.steps[0]!.kickoff.text).toContain('Version TWO');
	});
});

// ---------- the arm's refusals (§1, P5 F5) ----------

describe('the arm refuses loudly, at arm time, naming the step (P5 F5 iv)', () => {
	beforeEach(scratch);

	test('a haiku step cannot be armed at all — its model IS its permission posture', () => {
		const f = flowOf(c => { step(c, 'b')['tier'] = 'Builder · haiku-low'; });
		const r = armFlow(f.name);
		expect(r.ok).toBe(false);
		expect(r.ok || r.error).toContain('step b');
		expect(r.ok || r.error).toContain('haiku');
		expect(readRun(f.name).present).toBe(false);           // and nothing was armed
	});

	test('a venue no account has trusted refuses, naming the step, the account and the project', () => {
		const cold = join(ROOT, 'cold-tree');
		mkdirSync(cold, { recursive: true });
		Bun.spawnSync(['git', 'init', '-q', cold]);
		const f = flowOf(c => { step(c, 'a')['venue'] = { kind: 'master', cwd: cold }; });
		const r = armFlow(f.name);
		expect(r.ok).toBe(false);
		expect(r.ok || r.error).toContain('step a');
		expect(r.ok || r.error).toContain('never trusted');
		expect(readRun(f.name).present).toBe(false);
	});

	test('an arm carrying a hash the file no longer has is refused — nobody arms bytes they did not read', () => {
		const f = flowOf();
		const r = armFlow(f.name, 'what-the-page-was-showing');
		expect(r.ok).toBe(false);
		expect(r.ok || r.error).toContain('not the plan on disk');
		expect(armFlow(f.name, f.hash).ok).toBe(true);
	});

	test('a flow that will not parse cannot be armed, and the refusal is the parser’s own sentence', () => {
		scratch();
		writeFileSync(join(FLOWS, 'broken.flow.json'), '{ "building": "x" }');
		const r = armFlow('broken');
		expect(r.ok).toBe(false);
		expect(r.ok || r.error).toContain('field');
	});

	test('a good arm records what it armed, and only that', () => {
		const f = flowOf();
		const r = armFlow(f.name);
		expect(r.ok).toBe(true);
		const run = readRun(f.name);
		expect(run.lines.length).toBe(1);
		expect(run.lines[0]!.ev).toBe('armed');
		expect(run.lines[0]!.step).toBeNull();
		expect(run.lines[0]!.hash).toBe(f.hash);
	});
});

// ---------- idempotence: the tick runs forever ----------

describe('the tick is idempotent — a pass that changes nothing writes nothing', () => {
	beforeEach(scratch);

	test('every pause, refusal and landing is written once and re-read as itself', () => {
		const f = flowOf();
		const cases: NewRunLine[][] = [
			[{ ev: 'fired', step: 'a', sid: 'x' }],
			[{ ev: 'fired', step: 'a', sid: 'x' }, { ev: 'landed', step: 'a' }],
		];
		const gone = session({ sid: 'x', state: 'gone', last: beat({ sid: 'x', ev: 'Stop' }) });
		for (const c of cases) {
			const run = armed(f, c);
			const first = plan(f, run, world({ sessions: new Map([['x', gone]]) }));
			appendRun(f.name, first.lines);
			const second = plan(f, readRun(f.name), world({ sessions: new Map([['x', gone]]) }));
			expect(second.lines).toEqual([]);
		}
	});
});

// ---------- verdictOf, on its own ----------

describe('verdictOf — the landing law as a value', () => {
	beforeEach(scratch);

	test('nothing to say is null, not a guess', () => {
		const f = flowOf();
		const a = f.steps.find(s => s.id === 'a') as Step;
		expect(verdictOf(a, null, world())).toBeNull();
	});
});
