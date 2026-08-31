// Attention's testable half: the waiting edge, the escalation mark, the queue and the City's
// ranking. Every one of these is a pure function over parsed doctrine and parsed census, so every
// one of them is tested here — what is NOT here is the drawing, which is a browser fact and rides
// `lab/b14/probe.ts` against a real headless Chrome (B13 F1's split, kept).
//
// The corpus under test is `lab/b14/city`, **copied to temp** and re-walked by doctrine's own
// `discover()`. Copied, because one of these tests answers a countersign in place and that is a
// real file append: a suite that writes into the repo's own fixtures is a suite that lies about
// what it proved the second time it runs (B8 F1's lesson, applied before it bites).

import { expect, test, describe, afterAll, beforeAll } from 'bun:test';
import { mkdtempSync, rmSync, utimesSync, statSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { discover, type Building } from '../../doctrine';
import { cityRows, escalationsIn, needsYou, rankOf, waitingOf } from './attention';
import type { Beat, Session } from './census';
import { noBadges, type DeckBuilding } from './deck-model';
import { fileGesture } from './inbox';

// ---------- the waiting edge ----------

const beat = (over: Partial<Beat> = {}): Beat => ({
	t: Date.now() / 1000, ev: 'Stop', sid: 'sid-1', acct: '/Users/felix/.claude', pid: process.pid,
	ws: 'W1', sf: 'S1', cwd: '/Users/felix/code/agents', tp: null, tool: null, why: null,
	aid: null, at: null, bg: [], ...over,
});

const session = (over: Partial<Session> = {}, last: Partial<Beat> = {}): Session => ({
	sid: last.sid ?? 'sid-1', state: 'idle', last: beat(last), beats: 1,
	account: '/Users/felix/.claude', cwd: '/Users/felix/code/agents', tool: null, stamp: 'builder-agents-01',
	model: null, transcript: null, agent: null, roster: null, ...over,
});

describe('waitingOf — one measured edge, and no second', () => {
	test('a permission prompt is blocked', () =>
		expect(waitingOf(session({ state: 'needs-input' }, { ev: 'Notification', why: 'permission_prompt' }))).toBe('blocked'));

	// C21, the gut. cmux's 60-second nag fires AFTER `Stop`, for a session that has finished its
	// turn and is asking for nothing, so reading it as a waiting edge produced a demand for input
	// that outlived its fact by hours — the 21-hour NAGGING rows in Felix's own screenshot. The
	// census has always called this beat idle; the deck now agrees.
	test('the 60 s cmux nag is not a waiting edge — the session finished and wants nothing', () =>
		expect(waitingOf(session({}, { ev: 'Notification', why: 'idle_prompt' }))).toBeNull());

	test('`Stop` is idle, not waiting — every finished turn emits one', () => {
		expect(waitingOf(session({}, { ev: 'Stop' }))).toBeNull();
		expect(waitingOf(session({ state: 'working' }, { ev: 'PreToolUse', tool: 'Bash' }))).toBeNull();
	});

	test('a notification type nobody has measured is not a guess', () =>
		expect(waitingOf(session({}, { ev: 'Notification', why: 'something_new' }))).toBeNull());

	test('a dead session waits for nothing, whatever its last beat said', () =>
		expect(waitingOf(session({ state: 'gone' }, { ev: 'Notification', why: 'permission_prompt' }))).toBeNull());
});

// ---------- the escalation mark ----------

describe('escalationsIn — the narrow reader, and the two false positives it was measured against', () => {
	const none = new Set<string>();

	test('a raise is an id and a dash; a ruling verb settles it', () => {
		expect(escalationsIn('built. E1 — the register policy needs a ruling', none).map(e => e.id)).toEqual(['E1']);
		expect(escalationsIn('built. E1 — the policy · E1 ruled 2026-08-27 — the worker is law', none)).toEqual([]);
		for (const verb of ['ruled', 'ratified', 'accepted', 'paid', 'answered', 'withdrawn'])
			expect(escalationsIn(`E2 — the thing · E2 ${verb} today`, none)).toEqual([]);
	});

	test('no dash, no raise — B8 wrote "E1 policy live" for a row IMPLEMENTING someone else\'s', () =>
		expect(escalationsIn('E1 policy live: ttl 300 s, hands bust the register', none)).toEqual([]));

	test('an id that names a row on this building\'s own board is a row reference (whiteboardy)', () => {
		const text = 'LANDED — every structural verb 1-3 ms. E4 — the click check joins E8';
		expect(escalationsIn(text, none).map(e => e.id)).toEqual(['E4']);
		expect(escalationsIn(text, new Set(['E1', 'E4', 'E8']))).toEqual([]);
	});

	test('the far end of a range is not the head of a clause (cornerizer)', () =>
		expect(escalationsIn('all 4 escalations ruled at the review (D11, E1–E4 — §6 fold, log)', none)).toEqual([]));

	test('an F-marker bounds the text and is never itself an item', () => {
		const out = escalationsIn('E1 — the census sees six where ps sees 38 · F1 a branch is not one segment', none);
		expect(out.map(e => e.id)).toEqual(['E1']);
		expect(out[0]!.text).toBe('the census sees six where ps sees 38');
	});

	test('an empty annotation asks nothing', () => expect(escalationsIn('', none)).toEqual([]));
});

// ---------- the corpus: `lab/b14/city`, copied and re-walked ----------

const ROOT = mkdtempSync(join(tmpdir(), 'b14-attention-'));
const CITY = join(ROOT, 'city');
const LOUD = join(CITY, 'nb/loud');
const QUIET = join(CITY, 'nb/quiet');
const saved = process.env.GLASS_CITY;

beforeAll(() => {
	Bun.spawnSync(['cp', '-R', join(import.meta.dir, '../lab/b14/city'), CITY]);
	// The control the sort test needs: `quiet` is the RECENTLY touched one, `loud` is a day old.
	const now = Date.now() / 1000;
	utimesSync(join(QUIET, 'README.md'), now, now);
	for (const f of ['README.md', 'DECISIONS.md', 'ISSUES.md'])
		utimesSync(join(LOUD, f), now - 86400, now - 86400);
	process.env.GLASS_CITY = CITY;
});

afterAll(() => {
	process.env.GLASS_CITY = saved;
	rmSync(ROOT, { recursive: true, force: true });
});

const walk = (): Building[] => discover([CITY]);
const at = (bs: Building[], suffix: string) => bs.find(b => b.path.endsWith(suffix))!;

describe('needsYou — one ranked list, four classes, nothing that ignites', () => {
	test('the fixture yields exactly one of each paper class, and the settled escalation is silent', () => {
		const bs = walk();
		const q = needsYou(bs, []);
		expect(q.map(i => i.kind)).toEqual(['gate', 'countersign', 'escalation']);

		const gate = q[0]!;
		expect(gate.name).toBe('L1 — the deck visual pass');
		expect(gate.where).toBe('README.md:12');
		expect(gate.jump).toContain('/b/');

		const sign = q[1]!;
		expect(sign.decision).toBe('D99');
		expect(sign.state).toBe('pending');          // no inbox entry yet — B6's first state

		// L2 raised E1 and nothing ruled it; L3 raised E1 AND ruled it, so L3 says nothing.
		const esc = q[2]!;
		expect(esc.key).toContain(':L2:E1');
		expect(esc.full).toBe('the register policy needs a ruling before anything builds over it');
		expect(q.filter(i => i.key.includes(':L3:'))).toEqual([]);
	});

	test('a waiting session outranks every paper class, and carries its session, not a summons', () => {
		const bs = walk();
		const s = session({ state: 'needs-input', cwd: QUIET },
			{ ev: 'Notification', why: 'permission_prompt', cwd: QUIET, sid: 'w-1' });
		const q = needsYou(bs, [s]);
		expect(q[0]!.kind).toBe('waiting');
		expect(q[0]!.sid).toBe('w-1');
		expect(q[0]!.name).toBe('builder-agents-01 — blocked on a permission prompt');
		expect(q.map(i => i.kind)).toEqual(['waiting', 'gate', 'countersign', 'escalation']);
	});

	test('a session in no cmux pane offers no jump rather than a broken one (hooks are venue-blind)', () => {
		const q = needsYou(walk(), [session({ state: 'needs-input', cwd: QUIET },
			{ ev: 'Notification', why: 'permission_prompt', cwd: QUIET, sf: null })]);
		expect(q[0]!.sid).toBeNull();
		expect(q[0]!.note).toContain('no cmux pane');
	});

	test('a paused engine step is the waiting class arriving from the other sensor (C16 §3)', () => {
		const step = {
			run: 'c16/paused', step: 'ask', at: 'paused', causes: ['needs-⬡ question'],
			why: 'Which release name goes in the sign-off?', account: null, venueFrom: 'log' as const,
			building: null, fake: true, refusal: null, summoned: false, logAt: 1_756_500_000,
			where: '~/…/c16/paused · ask', dir: '/tmp/c16/paused', sessionId: 'e-1',
			configDir: '/tmp/c16/paused/config', workDir: '/tmp/c16/paused/work',
			transcript: '/tmp/c16/paused/config/projects/x/e-1.jsonl',
		};
		const q = needsYou(walk(), [], [step]);
		const item = q.find(i => i.key === 'paused:c16/paused/ask')!;
		expect(item.kind).toBe('waiting');
		// No pane to jump to — headless is the engine's venue (D22) — and the Chat is the whole view.
		expect(item.sid).toBeNull();
		expect(item.chat).toBe('e-1');
		expect(item.full).toContain('Which release name');
		// Still nothing that can ignite, on this class as on every other.
		for (const forbidden of ['summons', 'stamp', 'hands/ignite'])
			expect(JSON.stringify(q)).not.toContain(forbidden);
	});

	test('a LANDED gate is history: only a live row\'s gate reaches the queue (B3\'s law)', () => {
		const bs = walk();
		const loud = at(bs, 'nb/loud');
		for (const board of loud.board) for (const r of board.rows) if (r.id === 'L1') r.state = 'LANDED';
		expect(needsYou(bs, []).filter(i => i.kind === 'gate')).toEqual([]);
	});

	test('NOTHING in the queue can ignite: no summons, no stamp, no account, no cwd', () => {
		const q = needsYou(walk(), [session({ state: 'needs-input' }, { ev: 'Notification', why: 'permission_prompt' })]);
		const wire = JSON.stringify(q);
		for (const forbidden of ['summons', 'stamp', 'account', 'model', 'effort', 'color', 'hands/ignite'])
			expect(wire).not.toContain(forbidden);
	});
});

describe('cityRows — attention outranks recency, and the badges ARE the queue', () => {
	test('a gate badge sorts above a quiet building with newer activity', () => {
		const bs = walk();
		const rows = cityRows(bs, [], needsYou(bs, []));
		expect(statSync(join(QUIET, 'README.md')).mtimeMs)
			.toBeGreaterThan(statSync(join(LOUD, 'README.md')).mtimeMs);   // the control: quiet IS newer
		expect(rows.map(r => r.building.split('/').at(-1))).toEqual(['loud', 'quiet']);
		expect(rows[0]!.attention).toBe(1);
		expect(rows[1]!.attention).toBe(4);
		expect(rows[0]!.fresh).toBeLessThan(rows[1]!.fresh);               // and it still lost
	});

	test('one neighborhood, and both buildings are under it (the v0 grouping law, ported)', () => {
		const rows = cityRows(walk(), [], []);
		expect(rows.map(r => r.group)).toEqual(['loud', 'loud'].map(() => 'nb'));
		expect(rows[0]!.label.endsWith('/nb')).toBe(true);                 // the knob proof: the temp city
	});

	test('every badge count equals the queue items that building carries — one computation', () => {
		const bs = walk();
		const items = needsYou(bs, []);
		const rows = cityRows(bs, [], items);
		for (const r of rows)
			for (const [kind, n] of Object.entries(r.badges))
				expect(n).toBe(items.filter(i => i.building === r.building && i.kind === kind).length);
		expect(at2(rows, 'loud').badges).toEqual({ ...noBadges(), gate: 1, countersign: 1, escalation: 1 });
		expect(at2(rows, 'quiet').badges).toEqual(noBadges());
	});

	test('a waiting session takes the rank above everything, and moves its building to the top', () => {
		const bs = walk();
		const s = session({ state: 'needs-input', cwd: QUIET },
			{ ev: 'Notification', why: 'permission_prompt', cwd: QUIET, sid: 'w-1' });
		const rows = cityRows(bs, [s], needsYou(bs, [s]));
		expect(rows.map(r => r.building.split('/').at(-1))).toEqual(['quiet', 'loud']);
		expect(rows[0]!.attention).toBe(-1);
		expect(rows[0]!.badges.waiting).toBe(1);
		expect(rows[0]!.sids).toEqual(['w-1']);
		expect(rankOf(at(bs, 'nb/loud'), 3, 0)).toBe(0);                   // live work is still v0's rank 0
	});
});

const at2 = (rows: DeckBuilding[], suffix: string) => rows.find(r => r.building.endsWith(suffix))!;

// ---------- the blessing, answered in place ----------
//
// The wire the drawer's button reaches, exercised end to end against a real file: the queue says
// `pending`, one gesture appends one line, and the queue re-derives itself to `recorded` off the
// bytes that landed. The live city has ZERO true pending blessings (B6 F2), which is exactly
// why this fixture exists.

test('a blessing answered in place is one append, and the item re-reads itself as recorded', () => {
	const inbox = join(LOUD, 'ISSUES.md');
	const before = readFileSync(inbox, 'utf8');

	const item = needsYou(walk(), []).find(i => i.kind === 'countersign')!;
	expect(item.state).toBe('pending');

	const filed = fileGesture({ path: item.path, gesture: { kind: 'countersign', decision: 'D99' } }, '2026-08-27');
	expect(filed.ok).toBe(true);

	const after = readFileSync(inbox, 'utf8');
	expect(after.startsWith(before)).toBe(true);                          // append-only, byte for byte
	expect(after.slice(before.length).trim()).toBe('- 2026-08-27 · Felix (via Belvedere) · bless D99: ✓');

	const again = needsYou(walk(), []).find(i => i.kind === 'countersign')!;
	expect(again.state).toBe('recorded');
	expect(again.note).toContain('next sweep');
});
