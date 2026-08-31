// The Chat's second door and second road (C16): a session no cmux pane ever held.
//
// Everything here rides a **real run of the real engine** on a fake subject — `lab/c16/fakerun.ts`
// mints one under `$TMPDIR` and points `$RUNS_DIR` at it — so what is proven is the deck against the
// engine's own log, never against a fixture a Builder typed. Budget 0: the subject is
// `answer-then-land`, the scenario C14 added precisely so this arc could be guarded without spending
// a real turn.
//
// The real-bytes half — a real subject, a real account, a browser — is `lab/c16/roundtrip.ts`, for
// P6's own reason: a suite that drove real sessions would drive Felix's desktop (B8 F1).

import { expect, test, describe, afterAll, beforeAll } from 'bun:test';
import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { chatView, LIMITS, sendMessage, TAIL, WHOLE, type World } from './chat';
import { readCensus } from './census';
import { readRig } from './rig';
import { stepIndex } from './steps';
import { fold } from '../v3/engine/replay.ts';
import { readLog } from '../v3/engine/log.ts';
import { isRefusal } from '../v3/engine/refusal.ts';
import { transcriptPath } from '../v3/engine/transcript.ts';
import { locate as locateRun } from '../v3/console/runs.ts';
import { paused, rich, type Minted } from '../lab/c16/fakerun.ts';

/** The suite's own census home: `audit()` writes one line per send, and B8 F1 is the lesson. */
const scratch = mkdtempSync(join(tmpdir(), 'c16-suite-'));

let run: Minted;
let world: World;

beforeAll(async () => {
	process.env.CENSUS_DIR = join(scratch, 'census');
	run = await paused();
	process.env.RUNS_DIR = run.root;
	world = { rig: readRig(), census: readCensus(), buildings: [], steps: stepIndex([], run.root) };
}, 30_000);

afterAll(() => {
	delete process.env.RUNS_DIR;
	run?.close();
	rmSync(scratch, { recursive: true, force: true });
});

const view = () => chatView(run.sessionId, TAIL, true, 'armed', world);

// ---------- the read: one reader, and it is the console's ----------

describe('the Chat opens a headless engine-born session', () => {
	test('the target is the run log’s own step, and the transcript is the path the log names', () => {
		const v = view();
		expect(v.error).toBeNull();
		expect(v.target?.step).toMatchObject({ run: run.name, step: 'ask', at: 'paused' });
		expect(v.target?.step?.causes).toEqual(['needs-⬡ question']);
		expect(v.target?.step?.why).toBe('Which release name goes in the sign-off?');

		// The console's own reader, asked the same question independently: same venue, same
		// transcript path. The deck re-implements no reader (D65).
		const handle = locateRun(run.name, run.root);
		if (isRefusal(handle)) throw new Error(handle.refusal);
		expect(v.target?.transcript).toBe(transcriptPath(handle.venue.configDir, handle.venue.workDir, run.sessionId));
		expect(v.target?.transcript).toBe(run.transcript);
		// A layer-0 sandbox is not an account, and the deck says so rather than printing a path.
		expect(v.target?.step?.fake).toBe(true);
		expect(v.target?.account).toBeNull();
	});

	test('the step’s state IS the fold’s, on the same log — nothing is re-derived', () => {
		const at = fold(readLog(`${run.dir}/run.jsonl`)).steps['ask'];
		expect(at?.at).toBe('paused');
		expect(view().target?.step?.at).toBe(at?.at);
		if (at?.at === 'paused') expect(view().target?.step?.why).toBe(at.detail);
	});

	test('the turns rendered are the transcript’s own records, in order', () => {
		const rows = readFileSync(run.transcript, 'utf8').split('\n').filter(l => l !== '')
			.map(l => JSON.parse(l) as { type: string; message?: { content?: unknown } });
		const spoken = rows.filter(r =>
			(r.type === 'user' && typeof r.message?.content === 'string')
			|| (r.type === 'assistant' && Array.isArray(r.message?.content)));

		const v = view();
		// The window's turns group each run of assistant records into one turn, which is the whole of
		// the grammar — so the count is the user turns plus the assistant RUNS, and the first spoken
		// words are the same bytes on both sides.
		expect(v.turns.length).toBeGreaterThan(0);
		expect(v.turns[0]?.role).toBe('user');
		expect(v.turns.filter(t => t.role === 'user').length)
			.toBe(spoken.filter(r => r.type === 'user').length);
		const said = v.turns.find(t => t.role === 'assistant')?.blocks
			.flatMap(b => (b.kind === 'prose' ? b.spans.map(s => s.text) : []))
			.join('');
		expect(said).toContain('I need the release name');
	});

	test('the minimap indexes the WHOLE file: one mark per turn, keys that are turn keys', () => {
		const v = view();
		expect(v.marks.length).toBe(v.turnCount);
		expect(v.marks.length).toBe(v.turns.length);       // this transcript is smaller than one window
		expect(v.marks.map(m => m.key)).toEqual(v.turns.map(t => t.key));
		expect(v.marks.map(m => m.role)).toEqual(v.turns.map(t => t.role));
	});
});

// ---------- the road: which one, and why not the other ----------

describe('the road is decided by what the target is (C16 §2)', () => {
	test('a paused step takes the ENGINE road, never a cmux resume', () => {
		const v = view();
		expect(v.send).toMatchObject({ can: true, mode: 'engine' });
		expect(v.send.why).toContain(`${run.name}/ask`);
	});

	test('cold hands draw nothing and name the credential — on this road too', () => {
		const cold = chatView(run.sessionId, TAIL, false, 'no credential at /nowhere/env', world);
		expect(cold.send.can).toBe(false);
		expect(cold.send.mode).toBeNull();
		expect(cold.send.why).toContain('no credential');
	});

	test('a run that names no config dir is readable forever and drivable never (C14’s compat law)', async () => {
		const old = await paused('c16/pre-c14');
		try {
			// A pre-C14 log, made by taking the ignition's `configDir` away — which is exactly what a log
			// recorded before C14 looks like — and a real subject, because a layer-0 run needs no account.
			const path = `${old.dir}/run.jsonl`;
			const lines = readFileSync(path, 'utf8').split('\n').filter(l => l !== '').map(l => {
				const e = JSON.parse(l) as Record<string, unknown>;
				if (e['kind'] === 'ignited') delete e['configDir'];
				if (e['kind'] === 'blessed') {
					const flow = e['flow'] as { steps: { subject: unknown }[] };
					for (const s of flow.steps) s.subject = { real: {} };
				}
				return JSON.stringify(e);
			});
			writeFileSync(path, lines.join('\n') + '\n');

			const w: World = { ...world, steps: stepIndex([], old.root) };
			process.env.RUNS_DIR = old.root;
			const v = chatView(old.sessionId, TAIL, true, 'armed', w);
			expect(v.target?.step?.venueFrom).toBe('sandbox');
			expect(v.target?.step?.refusal).toContain('predates C14');
			expect(v.send.can).toBe(false);
			expect(v.send.why).toContain('read-only');
			// Readable forever: the transcript still renders.
			expect(v.turns.length).toBeGreaterThan(0);
		}
		finally { process.env.RUNS_DIR = run.root; old.close(); }
	}, 30_000);
});

// ---------- the arc: pause → reply → landed, at budget 0 ----------

describe('the reply lands the step through the engine’s own resume', () => {
	test('pause → reply → landed, and the run log is what says so', async () => {
		const arc = await paused('c16/arc');
		process.env.RUNS_DIR = arc.root;
		try {
			const w: World = { ...world, steps: stepIndex([], arc.root) };
			expect(chatView(arc.sessionId, TAIL, true, 'armed', w).send.mode).toBe('engine');

			const text = 'The release name is ANSWER-THEN-LAND. Set your report state to done.';
			const out = await sendMessage({ sid: arc.sessionId, text }, 'no cmux call is made on this road');
			if (!out.ok) throw new Error(out.error);
			expect(out.result.mode).toBe('engine');
			expect(out.result.step).toMatchObject({ run: arc.name, id: 'ask', at: 'landed' });

			// The verdict is the log's, folded by the engine — the deck asserts nothing of its own.
			const state = fold(readLog(`${arc.dir}/run.jsonl`));
			const at = state.steps['ask'];
			expect(at?.at).toBe('landed');
			if (at?.at === 'landed') expect(at.report?.answer).toBe('ANSWER-THEN-LAND-OK');
			// Two turns: the ignition that asked, and the resume the reply ignited (D73 — a resume costs).
			expect(state.turns).toBe(2);

			// And the delivered bytes are in the transcript, which is the only thing that ever means
			// "delivered" (B16's law, kept on the second road).
			expect(readFileSync(arc.transcript, 'utf8')).toContain(text);

			// A second reply into a step that is no longer paused is refused in the engine's own words.
			const again = await sendMessage({ sid: arc.sessionId, text: 'and again' }, 'x');
			expect(again.ok).toBe(false);
			if (!again.ok) expect(again.error).toContain('only a paused step takes a ruling');
		}
		finally { process.env.RUNS_DIR = run.root; arc.close(); }
	}, 60_000);
});

// ---------- the rich fixture: a committed real capture, mounted as a run ----------

describe('the rendering fixture is a committed real capture (C16 §4)', () => {
	test('the capture renders as markdown shapes, and the fence carries no spans', () => {
		const mounted = rich();
		process.env.RUNS_DIR = mounted.root;
		try {
			const w: World = { ...world, steps: stepIndex([], mounted.root) };
			const v = chatView(mounted.sessionId, TAIL, true, 'armed', w);
			expect(v.error).toBeNull();
			const kinds = v.turns.flatMap(t => t.blocks.map(b => b.kind));
			// The four shapes the bar names, all from one real subject's own turn.
			for (const kind of ['head', 'list', 'table', 'fence', 'act', 'prose'] as const) expect(kinds).toContain(kind);

			// The decoder reaches the rendered prose — a charge id and a D-id light — and stops at the
			// fence (B20 §1, re-proven on the rich path). `doc` spans are what a resolved reference is.
			const words = v.turns.flatMap(t => t.blocks.flatMap(b =>
				b.kind === 'prose' || b.kind === 'head' ? b.spans.map(s => s.text)
				: b.kind === 'list' ? b.items.flatMap(i => i.map(s => s.text))
				: b.kind === 'table' ? [...b.head, ...b.rows.flat()].flatMap(c => c.map(s => s.text))
				: [])).join(' ');
			expect(words).toContain('row 17');
			expect(words).toContain('D22');
			for (const fence of v.turns.flatMap(t => t.blocks).filter(b => b.kind === 'fence'))
				expect('spans' in fence).toBe(false);
		}
		finally { process.env.RUNS_DIR = run.root; mounted.close(); }
	});
});

// ---------- B23 §2: the scroll view shows the ENTIRE chat ----------

/**
 * The whole read is the model his ruling replaced the pager with, so what a test can hold is: the
 * gesture answers every turn, the poll still answers a bounded tail, and a read that could not hold
 * the file **says so** in `from` rather than passing a keyhole off as the conversation.
 *
 * A run whose transcript this suite writes is the only honest fixture — the assertion is about a
 * transcript LONGER than one window, and no committed capture is.
 */
describe('the whole transcript, and the two limits that say when it is not', () => {
	let tall: Minted;
	let tallWorld: World;
	/** Comfortably past `LIMITS.turns` (40) and past the 192 kB tail window. */
	const TURNS = 120;

	beforeAll(() => {
		const root = mkdtempSync(join(realpathSync(tmpdir()), 'b23-tall-'));
		const sid = 'b23a11a1-0000-4000-8000-000000000023';
		const capture = join(root, 'tall.jsonl');
		const filler = 'x'.repeat(2_000);          // 120 × 2 kB ≫ the tail window, so the two differ
		writeFileSync(capture, `${Array.from({ length: TURNS }, (_, i) => JSON.stringify({
			type: 'user', sessionId: sid, timestamp: new Date().toISOString(),
			message: { role: 'user', content: `turn ${i} ${filler}` },
		})).join('\n')}\n`);
		tall = rich('b23/tall', root, capture);
		tallWorld = { ...world, steps: stepIndex([], tall.root) };
	});
	afterAll(() => tall?.close());

	test('the gesture answers EVERY turn, and says the beginning is held', () => {
		const v = chatView(tall.sessionId, WHOLE, false, 'reading', tallWorld);
		expect(v.turns.length).toBe(TURNS);
		expect(v.turnCount).toBe(TURNS);
		expect(v.from).toBe(0);
		expect(v.turns[0]!.blocks.some(b => b.kind === 'prose' && JSON.stringify(b).includes('turn 0'))).toBe(true);
	});

	test('the poll still answers a bounded tail — one shared timer is not a place to put a file', () => {
		const v = chatView(tall.sessionId, TAIL, false, 'reading', tallWorld);
		expect(v.turns.length).toBe(LIMITS.turns);
		// And it does not pretend: the tail begins somewhere, and `from` is where.
		expect(v.from).toBeGreaterThan(0);
		// The marks still span the whole file, which is what makes the strip a map (C16 §6).
		expect(v.turnCount).toBe(TURNS);
	});

	test('a turn cap that BITES reports through `from` — a bounded read never passes for the file', () => {
		const held = LIMITS.wholeTurns;
		try {
			(LIMITS as { wholeTurns: number }).wholeTurns = 10;
			const v = chatView(tall.sessionId, WHOLE, false, 'reading', tallWorld);
			expect(v.turns.length).toBe(10);
			expect(v.from).toBe(v.turns[0]!.key);
			expect(v.from).toBeGreaterThan(0);
		}
		finally { (LIMITS as { wholeTurns: number }).wholeTurns = held; }
	});
});

// ---------- B23 §3: the leak's sharp edge, on the server side of it ----------

/**
 * **N leaked click handlers on the send control would have delivered the same words N times** — the
 * sharp edge of the tenant leak, and the one face of it a browser probe cannot reach: the send
 * control is not drawn at all on a disarmed twin (the honest-disabled law), so a probe at budget 0
 * has nothing to click. See §Findings.
 *
 * The client-side cause is dead at the seam (`deck-view.ts` §mount's signal). This is the second
 * lock, and it is the one that would hold even if a future tenant hung a wire wrong: `sendMessage`
 * admits **one delivery per target at a time**, so N simultaneous sends of the same words produce
 * one turn and N−1 refusals in P6's own words. Zero real turns — the engine road on a fake run.
 */
describe('one click or fifteen, a target takes ONE delivery at a time', () => {
	test('N simultaneous sends of the same words land exactly one turn, byte-verified', async () => {
		const arc = await paused('b23/edge');
		process.env.RUNS_DIR = arc.root;
		try {
			const w: World = { ...world, steps: stepIndex([], arc.root) };
			expect(chatView(arc.sessionId, TAIL, true, 'armed', w).send.mode).toBe('engine');

			const text = 'The release name is ANSWER-THEN-LAND. Set your report state to done.';
			const before = readFileSync(arc.transcript, 'utf8');
			// Fifteen, because fifteen is the number G2's close measured from one click.
			const all = await Promise.all(Array.from({ length: 15 }, () =>
				sendMessage({ sid: arc.sessionId, text }, 'no cmux call is made on this road')));

			const landed = all.filter(r => r.ok);
			expect(landed.length).toBe(1);
			for (const r of all) if (!r.ok) expect(r.error).toContain('one delivery at a time');

			// The transcript is what means delivered (B16's law): exactly one new user turn carrying
			// exactly those bytes — not fifteen, and not a truncated one.
			const after = readFileSync(arc.transcript, 'utf8');
			const added = after.slice(before.length).split('\n').filter(l => l !== '')
				.map(l => JSON.parse(l) as { type?: string; message?: { content?: unknown } })
				.filter(r => r.type === 'user' && typeof r.message?.content === 'string');
			expect(added.length).toBe(1);
			expect(added[0]!.message!.content).toBe(text);
		}
		finally { delete process.env.RUNS_DIR; arc.close(); }
	}, 60_000);
});
