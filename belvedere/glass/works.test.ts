// The Works on v3, pinned where a wrong answer is invisible.
//
// Three laws, one per describe:
//
//  1. **The node states ARE `verdicts()`.** The deck does not re-derive what a run did; it reads
//     the engine's own export over the engine's own fold. This test is the assertion that keeps it
//     that way — if `works.ts` ever grows its own opinion about a step, this goes red.
//  2. **A kickoff is frozen bytes.** v3's `prompt` field carries the step's first user turn
//     verbatim, blessed into the flow and recorded in the log's first event. Nothing on this path
//     resolves a document position, so a doc that moves — or vanishes — moves nothing.
//  3. **Legality is per (model, posture)** (C4 F6), and the sentence is the engine's own.
//
// `$RUNS_DIR` is `paths.ts`'s own knob and it is read per call (B8 F1's law), so every case here
// stands up its own telemetry tree in `$TMPDIR` and the real one is never read, walked or written.

import { afterAll, beforeEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import type { Building } from '../../doctrine';
import { fold, verdicts } from '../v3/engine/replay.ts';
import { readLog, type Event } from '../v3/engine/log.ts';
import type { Flow } from '../v3/engine/flow.ts';
import { recentRuns, worksOf, worksRun } from './works';
import { readRun } from '../v3/console/runs.ts';

const ROOT = mkdtempSync(join(tmpdir(), 'c15-works-'));
const saved = process.env.RUNS_DIR;

afterAll(() => {
	rmSync(ROOT, { recursive: true, force: true });
	if (saved === undefined) delete process.env.RUNS_DIR; else process.env.RUNS_DIR = saved;
});

// ---------- a run, written by hand: the log is the whole truth, so a fixture is a log ----------

const VENUE = join(ROOT, 'city', 'alpha');
const CONFIG = '/Users/felix/.claude';

const flow = (prompt: string): Flow => ({
	id: 'c15fixture',
	name: 'a run the deck can read',
	budget: 6,
	steps: [
		{ kind: 'task', id: 'plan', depends: [], prompt, subject: { real: {} },
			model: 'sonnet', effort: 'low', posture: 'auto', timeoutMs: 180_000 },
		{ kind: 'task', id: 'wide', depends: ['plan'], prompt: 'a parallel lane', subject: { fake: { scenario: 'q1', seed: 7 } },
			model: 'haiku', effort: 'low', posture: 'auto', timeoutMs: 60_000 },
		{ kind: 'gate', id: 'judge', depends: ['plan'], prompt: 'rule it', subject: { real: {} },
			model: 'haiku', effort: 'low', posture: 'acceptEdits', timeoutMs: 60_000 },
		{ kind: 'card', id: 'his', depends: ['judge'], ask: 'the visual pass is Felix’s' },
	],
});

/** One run dir, written the way the engine writes one: whole lines, appended in order. */
function writeRun(name: string, events: Event[]): string {
	const dir = join(ROOT, name);
	mkdirSync(dir, { recursive: true });
	const lines = events.map((e, seq) => JSON.stringify({ seq, at: new Date(1_800_000_000_000 + seq * 1000).toISOString(), ...e }));
	writeFileSync(join(dir, 'run.jsonl'), lines.join('\n') + '\n');
	return dir;
}

const events = (f: Flow): Event[] => [
	{ kind: 'blessed', flow: f, scope: ['plan', 'wide', 'judge'], budget: 6 },
	{ kind: 'ignited', step: 'plan', sessionId: 'sid-plan', pid: 4242, venue: VENUE, configDir: CONFIG,
		cursor: 0, model: 'sonnet', effort: 'low', posture: 'auto', subject: 'real' },
	{ kind: 'landed', step: 'plan', report: { state: 'done', cause: 'wrote notes.md' } },
	{ kind: 'ignited', step: 'wide', sessionId: 'sid-wide', pid: 4343, venue: VENUE, configDir: CONFIG,
		cursor: 0, model: 'haiku', effort: 'low', posture: 'auto', subject: 'fake:q1' },
	{ kind: 'paused', step: 'wide', causes: ['needs-⬡ question'], detail: 'who signs the announcement?' },
	{ kind: 'ignited', step: 'judge', sessionId: 'sid-judge', pid: 4444, venue: VENUE, configDir: CONFIG,
		cursor: 0, model: 'haiku', effort: 'low', posture: 'acceptEdits', subject: 'real' },
];

const building = (over: Partial<Building>): Building => ({
	building: 'alpha', path: VENUE,
	board: [], decisionQueue: [], issues: [], kickoffs: [], fails: [],
	files: { boards: [], ledger: null, decisions: null, issues: null, workDocs: [], prose: [] },
	ledgerTail: null, baton: null, ledgerEntries: 0, decisions: 0,
	...over,
});

const KICKOFF = 'You are a Builder at opus-high.\nRead the order and build it.';

beforeEach(() => { process.env.RUNS_DIR = ROOT; });

describe('the node states ARE the engine\'s verdicts', () => {
	test('every step\'s word is `verdicts()`\'s word, on the same log', () => {
		const dir = writeRun('spoken', events(flow(KICKOFF)));
		const handle = readRun(dir, ROOT);
		if ('refusal' in handle) throw new Error(handle.refusal);
		const drawn = Object.fromEntries(worksRun(handle).steps.map(s => [s.id, s.verdict]));
		expect(drawn).toEqual(verdicts(fold(readLog(join(dir, 'run.jsonl')))));
		// And the words are real ones, not four copies of `pending` agreeing with each other.
		expect(drawn).toEqual({
			plan: 'landed done',
			wide: 'paused ‹needs-⬡ question›',
			judge: 'running',
			his: 'pending',
		});
	});

	test('the ring follows the fold, and a step the log never named falls back to the board', () => {
		const dir = writeRun('rings', events(flow(KICKOFF)));
		const handle = readRun(dir, ROOT);
		if ('refusal' in handle) throw new Error(handle.refusal);
		const by = new Map(worksRun(handle).steps.map(s => [s.id, s]));
		expect(by.get('plan')!.at).toBe('landed');
		expect(by.get('wide')!.at).toBe('paused');
		expect(by.get('judge')!.at).toBe('running');
		expect(by.get('judge')!.sid).toBe('sid-judge');
		expect(by.get('judge')!.pid).toBe(4444);
		// `his` is a card the log has said nothing about: `pending`, so the board may still speak.
		expect(by.get('his')!.at).toBe('pending');
	});

	test('the shape carries what the log carried and nothing it did not', () => {
		const dir = writeRun('shape', events(flow(KICKOFF)));
		const handle = readRun(dir, ROOT);
		if ('refusal' in handle) throw new Error(handle.refusal);
		const run = worksRun(handle);
		expect(run.account).toBe('personal');           // C14: the log names its own config dir
		expect(run.venueFrom).toBe('log');
		expect(run.budget).toBe(6);
		expect(run.turns).toBe(3);                      // three ignitions, D73's own count
		expect(run.scope).toEqual(['plan', 'wide', 'judge']);
		expect(run.edges).toEqual([{ from: 'plan', to: 'wide' }, { from: 'plan', to: 'judge' }, { from: 'judge', to: 'his' }]);
		// Time flows down: ranks are dependency depth, and the two lanes off `plan` share one.
		expect(run.steps.map(s => [s.id, s.depth])).toEqual([['plan', 0], ['wide', 1], ['judge', 1], ['his', 2]]);
		expect(run.steps.find(s => s.id === 'his')!.ask).toBe('the visual pass is Felix’s');
		expect(run.steps.find(s => s.id === 'wide')!.subject).toBe('fake:q1');
		expect(run.steps.find(s => s.id === 'wide')!.why).toBe('needs-⬡ question — who signs the announcement?');
	});
});

describe('the kickoff is frozen bytes', () => {
	test('a run renders the prompt its log carries, and a doc that moves moves nothing', () => {
		const doc = join(ROOT, 'plans', 'c15-order.md');
		mkdirSync(join(ROOT, 'plans'), { recursive: true });
		writeFileSync(doc, `# the order\n\n\`\`\`\n${KICKOFF}\n\`\`\`\n`);

		const dir = writeRun('frozen', events(flow(KICKOFF)));
		const read = (): string => {
			const h = readRun(dir, ROOT);
			if ('refusal' in h) throw new Error(h.refusal);
			return worksRun(h).steps.find(s => s.id === 'plan')!.prompt ?? '';
		};
		expect(read()).toBe(KICKOFF);

		// The doc is rewritten under it, then deleted outright. The run was blessed on bytes, not on
		// a position in a file, so both are non-events — this is flow-1's collapse, made impossible.
		writeFileSync(doc, '# the order\n\nEVERYTHING BELOW HAS MOVED.\n\n```\nfire something else entirely\n```\n');
		expect(read()).toBe(KICKOFF);
		rmSync(doc);
		expect(read()).toBe(KICKOFF);
	});
});

describe('legality is per (model, posture) — C4 F6, in the engine\'s own words', () => {
	test('haiku under acceptEdits is legal; under auto it is blocked, and the sentence is P5\'s', () => {
		const dir = writeRun('legality', events(flow(KICKOFF)));
		const handle = readRun(dir, ROOT);
		if ('refusal' in handle) throw new Error(handle.refusal);
		const by = new Map(worksRun(handle).steps.map(s => [s.id, s]));
		// Same model, two postures, two answers — which is the whole of F6: it is not a per-model rule.
		expect(by.get('judge')!.model).toBe('haiku');
		expect(by.get('judge')!.posture).toBe('acceptEdits');
		expect(by.get('judge')!.blocks).toEqual([]);
		expect(by.get('wide')!.model).toBe('haiku');
		expect(by.get('wide')!.posture).toBe('auto');
		expect(by.get('wide')!.blocks).toHaveLength(1);
		expect(by.get('wide')!.blocks[0]).toContain('haiku is granted `default` for `auto` and does no work');
		// And a legal pair carries no block at all, so an empty list means arm-able.
		expect(by.get('plan')!.blocks).toEqual([]);
	});
});

describe('discovery — bounded, and honest about the bound', () => {
	test('a run houses where its subject ran, and the rest are counted, not hidden', () => {
		writeRun('housed', events(flow(KICKOFF)));
		const w = worksOf('alpha', [building({})])!;
		expect(w.runs.map(r => r.name)).toContain('housed');
		expect(w.read).toBe(w.total);
		expect(w.total).toBeGreaterThan(0);

		// The same telemetry, read for a building none of these runs ran in.
		const other = worksOf('beta', [building({ building: 'beta', path: join(ROOT, 'city', 'beta') })])!;
		expect(other.runs).toHaveLength(0);
		expect(other.elsewhere).toBe(other.read);
	});

	test('the read is newest-first and capped — the telemetry tree grows every barrage', () => {
		for (let i = 0; i < 4; i++) writeRun(`bulk/r${i}`, events(flow(KICKOFF)));
		const { dirs, total } = recentRuns(ROOT, 2);
		expect(dirs).toHaveLength(2);
		expect(total).toBeGreaterThanOrEqual(4);
	});

	test('a run dir whose log will not read is named, never swallowed (parser-as-lint)', () => {
		const dir = join(ROOT, 'torn');
		mkdirSync(dir, { recursive: true });
		writeFileSync(join(dir, 'run.jsonl'), '{"seq":0,"at":"x","kind":"halted"}\nthis line is not json\n');
		const w = worksOf('alpha', [building({})])!;
		expect(w.fails.some(f => f.name.endsWith('torn'))).toBe(true);
		expect(w.fails.find(f => f.name.endsWith('torn'))!.error).toContain('torn run-log line');
	});
});
