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
import { mkdirSync, mkdtempSync, rmSync, utimesSync, statSync, readFileSync, writeFileSync } from 'fs';
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

// ---------- the baton bucket (B26) ----------
//
// A purpose-built corpus, because the b14 city carries no ledger at all: the bucket is a reading of
// a ledger TAIL, and every branch of it — the three holders, the fork, the collision, the resolve's
// refusal — is a different clause. Five buildings, five clauses, one substitution apart from each
// other so a difference in what the queue says can only be the clause.

const BATON_ROOT = mkdtempSync(join(tmpdir(), 'b26-batons-'));

/** The smallest building the register accepts: a board with one row, and a tail that hands it on. */
function batonBuilding(name: string, next: string, opts: { workDoc?: boolean; fence?: boolean } = {}): void {
	const dir = join(BATON_ROOT, name);
	mkdirSync(join(dir, 'plans'), { recursive: true });
	writeFileSync(join(dir, 'README.md'), `# ${name}

## 6. The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| R1 | ${opts.workDoc === false ? 'The doc-less one' : `[The first](plans/r1.md)`} — one row to point at | — | Builder · opus-high | OPEN |
| R2 | [The second](plans/r2.md) — the other half of a fork | — | Digger · sonnet-high | OPEN |
`);
	writeFileSync(join(dir, 'LEDGER.md'), `# Ledger — ${name}

---

**2026-08-29 · Builder · opus-high (R0)** — the fixture's own tail. Decided: nothing. Next: ${next}
`);
	for (const [row, mantle, tier] of [['r1', 'Builder', 'opus-high'], ['r2', 'Digger', 'sonnet-high']] as const)
		writeFileSync(join(dir, 'plans', `${row}.md`), `# ${row.toUpperCase()}

**Status:** OPEN

${opts.fence === false ? 'No kickoff here.' : `\`\`\`
You are a ${mantle} at ${tier}.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/${mantle.toLowerCase()}.md,
then read this doc and build it.
\`\`\``}
`);
}

beforeAll(() => {
	batonBuilding('his', 'Felix reads the diff, and nothing else moves until he has.');
	batonBuilding('hers', 'ignite R1 — the tree is its own.');
	batonBuilding('collided', 'ignite R1 on Felix’s word, once the gate clears.');
	batonBuilding('forked', 'ignite R1 or ignite R2 — the fork is exclusive, never both. Recommendation: R1.');
	batonBuilding('dropped', 'the campaign rolls on.');
	batonBuilding('unreadable', 'ignite R1 — nothing to read it from.', { fence: false });
});
afterAll(() => rmSync(BATON_ROOT, { recursive: true, force: true }));

const batons = () => needsYou(discover([BATON_ROOT]), []).filter(i => i.kind === 'baton');
const baton = (name: string) => batons().find(i => i.building.endsWith(name))!;

describe('the baton bucket — the holder decides what the item says, and the parser decides the holder', () => {
	test('every ledger tail with a baton is one item, and no tail is two', () =>
		expect(batons().map(i => i.building.split('/').at(-1)).sort())
			.toEqual(['collided', 'dropped', 'hers', 'his', 'forked', 'unreadable'].sort()));

	test('a Felix-holder baton is his, names no instrument, and offers nothing to open', () => {
		const i = baton('his');
		expect(i.baton!.holder).toBe('felix');
		expect(i.baton!.options).toEqual([]);
		expect(i.baton!.collides).toBe(false);
		expect(i.note).toContain('names no instrument');
	});

	test('a session-holder baton resolves its charge to that doc\'s own kickoff fence, verbatim', () => {
		const i = baton('hers');
		expect(i.baton!.holder).toBe('session');
		expect(i.baton!.collides).toBe(false);
		expect(i.baton!.shape).toBe('single');
		const [o] = i.baton!.options;
		expect(o!.label).toBe('charge R1 — Builder · opus-high');
		expect(o!.blocked).toBeNull();
		// The bytes are the doc's, not a re-derivation: byte-identical to the fence on disk.
		const doc = readFileSync(join(BATON_ROOT, 'hers', 'plans', 'r1.md'), 'utf8');
		expect(doc).toContain(o!.summons);
		expect(o!.summons.startsWith('You are a Builder at opus-high.')).toBe(true);
	});

	// D10, the whole of it: the parser reads the instrument first, the clause says Felix, and the
	// deck overrules neither. All three of the live city's ignitable batons read exactly this way.
	test('a clause that names Felix over an instrument collides, and the collision is on the item', () => {
		const i = baton('collided');
		expect(i.baton!.holder).toBe('session');          // the parser's word, untouched (D65)
		expect(i.baton!.collides).toBe(true);
		expect(i.baton!.options[0]!.summons.length).toBeGreaterThan(0);   // still copyable — copying is reading
		expect(i.note).toContain('never arms');
	});

	test('a fork is a choice: both options carry bytes, and exactly one is the recommendation (D64)', () => {
		const i = baton('forked');
		expect(i.baton!.shape).toBe('fork');
		expect(i.baton!.options.map(o => o.recommended)).toEqual([true, false]);
		expect(i.baton!.options.map(o => o.label))
			.toEqual(['charge R1 — Builder · opus-high', 'charge R2 — Digger · sonnet-high']);
		expect(i.note).toContain('exclusive');
	});

	test('a dropped baton is named as one and carries nothing (D63g/D64)', () => {
		const i = baton('dropped');
		expect(i.baton!.holder).toBe('prose');
		expect(i.baton!.options).toEqual([]);
		expect(i.note).toContain('dropped baton');
	});

	// The rail's law, carried: this resolves, it never invents. A charge whose doc carries no
	// kickoff fence has no bytes to hand over, and the reason stands where the control would.
	test('an instrument that resolves to nothing says why, and offers no bytes', () => {
		const [o] = baton('unreadable').baton!.options;
		expect(o!.summons).toBe('');
		expect(o!.blocked).toContain('carries no kickoff fence');
	});

	test('the item names the row that handed it on, so a nameless clause is still one line', () => {
		expect(baton('his').name.startsWith('R0')).toBe(true);
		expect(baton('his').full).toContain('Felix reads the diff');
	});

	// The one field that had to widen, and exactly how far. A baton item quotes its instrument's
	// bytes — that is the composer's seed and the clipboard's payload — and NOTHING else about an
	// ignition may appear anywhere in the queue: no stamp, no account, no model, no cwd, no path to
	// the spawning hand. Strictly stronger than "the word `summons` never appears": it says where
	// bytes may live and forbids them everywhere else.
	test('the queue carries a baton\'s bytes and no ignition — the shape itself, key by key', () => {
		const q = needsYou(discover([BATON_ROOT]), [session({ state: 'needs-input' }, { ev: 'Notification', why: 'permission_prompt' })]);

		// The law as a key set rather than a word search: a field added later has to come through here,
		// and prose that happens to say "stamp" cannot pass or fail it. `summons` is the one addition
		// B26 made and it lives in exactly one place — a baton option, where it is a document quotation.
		for (const i of q)
			expect(Object.keys(i).sort()).toEqual([
				'at', 'baton', 'building', 'chat', 'decision', 'doc', 'full', 'jump', 'kind',
				'key', 'name', 'note', 'path', 'sid', 'state', 'where',
			].sort());
		for (const o of q.flatMap(i => i.baton?.options ?? []))
			expect(Object.keys(o).sort()).toEqual(['blocked', 'label', 'recommended', 'source', 'summons']);

		// And no path to the spawning hand anywhere in it, in any field.
		const wire = JSON.stringify(q);
		for (const forbidden of ['hands/ignite', 'data-ignite', 'data-apply'])
			expect(wire).not.toContain(forbidden);

		// The bytes are under a baton option and nowhere else.
		const stripped = JSON.stringify(q.map(i => ({ ...i, baton: null })));
		expect(stripped).not.toContain('You are a Builder');
	});
});

describe('one ordering law: a baton and a waiting session interleave', () => {
	const blocked = (secondsAgo: number) =>
		session({ sid: 'sid-b', state: 'needs-input' },
			{ sid: 'sid-b', ev: 'Notification', why: 'permission_prompt', t: Date.now() / 1000 - secondsAgo });

	/** The fixture's tails are dated 2026-08-29; a session's clock is `Date.now()`. */
	const TAIL_AT = Date.parse('2026-08-29T00:00:00') / 1000;

	test('a baton newer than a blocked session outranks it, and older sorts under it', () => {
		const older = needsYou(discover([BATON_ROOT]), [blocked(60)]);          // the session is today
		expect(older[0]!.kind).toBe('waiting');

		const stale = needsYou(discover([BATON_ROOT]), [blocked(Date.now() / 1000 - TAIL_AT + 86_400)]);
		expect(stale[0]!.kind).toBe('baton');                                   // the batons are newer now
		expect(stale.find(i => i.kind === 'waiting')).toBeDefined();
	});

	test('both classes sit above every gate, blessing and escalation — one rank, recency inside', () => {
		const q = needsYou([...discover([BATON_ROOT]), ...walk()], [blocked(60)]);
		const first = q.findIndex(i => i.kind !== 'waiting' && i.kind !== 'baton');
		expect(q.slice(0, first).every(i => i.kind === 'waiting' || i.kind === 'baton')).toBe(true);
		expect(q.slice(first).some(i => i.kind === 'waiting' || i.kind === 'baton')).toBe(false);
	});

	test('the City badge counts the baton the queue lists, and never one it does not', () => {
		const bs = discover([BATON_ROOT]);
		const q = needsYou(bs, []);
		for (const r of cityRows(bs, [], q))
			expect(r.badges.baton).toBe(q.filter(i => i.kind === 'baton' && i.building === r.building).length);
		expect(cityRows(bs, [], q).every(r => r.badges.baton === 1)).toBe(true);
	});
});
