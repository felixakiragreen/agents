// The rail's two laws, tested where they can actually be wrong.
//
//  1. **The holder decides the wiring.** The Felix-card test is structural, not cosmetic: it
//     asserts the rendered HTML carries no payload and no hands path AT ALL, and that every
//     button on the card is a `/inbox` gesture (B6) rather than a fire. A `disabled` attribute
//     would pass a weaker test and still be one devtools edit from a fire.
//  2. **The rail resolves; it never invents.** A row that names no work doc, a summons with no
//     known tier, a fork whose recommendation matches no option — each must say so and offer
//     nothing.
//
// The corpus is `lab/b3/city/` — two buildings the live city does not have, so the fork and the
// worktree-composed row are testable on shapes rather than waited for. `lab/` is not doctrine
// corpus (DOCTRINE §3, `SKIP_DIRS`), so naming it as a root here never puts it on the register.
//
// Nothing in this file depends on module-load order: it names its own corpus root and asserts
// name-stamps by prefix, never by ordinal (the ordinal is a fact about the city's real logs).

import { expect, test, describe } from 'bun:test';
import { join } from 'path';
import { discover, type Baton, type Building, type Decision, type Instrument } from '../../doctrine';
import { branchFor, cardHtml, cards, recommended, shapeOf, type Card } from './rail';
import { readRig } from './rig';
import { nextStamp } from './summon';

const FIXTURE = join(import.meta.dir, '../lab/b3/city');
const rig = readRig();
const ACCOUNTS = ['personal', 'thg-fgreen'];

const fixtureCards = () => cards(discover([FIXTURE]), rig, ACCOUNTS[0]!);
const baton = (name: string): Card & { kind: 'baton' } => {
	const hit = fixtureCards().find(c => c.kind === 'baton' && c.building.endsWith(name));
	if (!hit || hit.kind !== 'baton') throw new Error(`no baton card for ${name}`);
	return hit;
};

/** The exact inverse of `esc()` — the byte-diff below is only as good as this. */
const unesc = (s: string) =>
	s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

// ---------- D64's shape, read render-side ----------

describe('the shape splitter', () => {
	const CASES: [name: string, text: string, instruments: number, want: ReturnType<typeof shapeOf>][] = [
		['one instrument is a single whatever the prose says', 'ignite the batch in parallel', 1, 'single'],
		['no instrument is still a single — there is nothing to choose between', 'nothing owed', 0, 'single'],
		['"either … or" marks a fork', 'either measure first or fix first', 2, 'fork'],
		['"choose" marks a fork', 'choose one of the two below', 2, 'fork'],
		['"option A" marks a fork', 'option A fires the Digger, option B the Builder', 2, 'fork'],
		['"in parallel" marks a batch', 'ignite B1 and B2 in parallel', 2, 'batch'],
		['"both" marks a batch', 'ignite both charges', 2, 'batch'],
		// The corpus still writes `wave` and always will; the reader keeps it (D71's own molt law).
		['the corpus\'s own `wave` is still read as a batch', 'fire the wave', 2, 'batch'],
		['a fork beats a batch when both words appear', 'either ignite both, or wait', 2, 'fork'],
		['plurality with no marker is reported, never guessed', 'fire 3, fire 4', 2, 'plural'],
	];
	for (const [name, text, n, want] of CASES) test(name, () => expect(shapeOf(text, n)).toBe(want));
});

describe('the recommendation', () => {
	const digger: Instrument = { kind: 'summons', text: 'x', mantle: 'Digger', tier: 'fable-high' };
	const builder: Instrument = { kind: 'summons', text: 'y', mantle: 'Builder', tier: 'opus-high' };
	const both = [digger, builder];

	test('reads forward from the word, across the colon that follows it', () =>
		expect(recommended('Recommendation: the Digger, because the numbers decide.', both)).toBe(0));

	test('finds an option named later in the pair', () =>
		expect(recommended('We recommend the Builder — the patch is obvious.', both)).toBe(1));

	test('a recommendation naming no option is unreadable, not a coin-flip', () =>
		expect(recommended('Recommendation: whichever lands first.', both)).toBe(-1));

	test('a recommendation naming both options is unreadable too', () =>
		expect(recommended('Recommendation: the Digger, then the Builder.', both)).toBe(-1));

	test('no "recommend" at all is no recommendation', () =>
		expect(recommended('Option A or option B.', both)).toBe(-1));

	test('a row reference is named by its row id', () =>
		expect(recommended('Recommendation: R1.', [{ kind: 'row', row: 'R1' }, digger])).toBe(0));

	test('the word alone, with nothing after it, resolves to nothing', () =>
		expect(recommended('recommend', both)).toBe(-1));
});

// ---------- the fixture city, end to end ----------

describe('the fork baton', () => {
	test('renders both options, shaped as a fork, with one recommendation', () => {
		const c = baton('probe-fork');
		expect(c.shape).toBe('fork');
		expect(c.shots).toHaveLength(2);
		expect(c.recommendation).toBe(0);
		expect(c.shots[0]!.label).toBe('Digger · fable-high');
		expect(c.shots[1]!.label).toBe('Builder · opus-high');
	});

	test('exactly one option carries the recommended badge in the DOM', () => {
		const html = cardHtml(baton('probe-fork'), true, ACCOUNTS);
		expect(html.match(/recommended/g) ?? []).toHaveLength(1);
		// The badge sits on the Digger's shot, which is the one the prose names.
		expect(html.indexOf('recommended')).toBeLessThan(html.indexOf('Builder · opus-high'));
	});

	test('each option composes its own fire body, from its own summons line', () => {
		const c = baton('probe-fork');
		const bodies = c.shots.map(s => 'blocked' in s.fire ? null : s.fire.body);
		// Colours are felikai hexes now (B18 §3): the rig's `blue` (Digger) is an ANSI slot name and
		// Felix's table reads it as felikai **orange**; its `cyan` (Builder) as felikai **blue**.
		expect(bodies[0]).toMatchObject({ model: 'fable', effort: 'high', color: '#9e490c' });
		expect(bodies[1]).toMatchObject({ model: 'opus', effort: 'high', color: '#0362b2' });
		expect(bodies[0]!.stamp).toStartWith('digger-probe-fork-');
		expect(bodies[1]!.stamp).toStartWith('builder-probe-fork-');
	});
});

describe('the row reference', () => {
	test('`fire R1` resolves to the work doc kickoff fence, cited by file and line', () => {
		const s = baton('probe-row').shots[0]!;
		expect(s.label).toBe('charge R1 — Builder · opus-high');
		expect(s.source).toMatch(/r1-scratch\.md:\d+$/);
		expect(s.summons).toBe('You are a Builder at opus-high.\n'
			+ 'Wear ~/code/agents/canon/mantles/builder.md,\n'
			+ 'then read the R1 order and build it.');
	});

	test('a work doc naming a branch composes the worktree ahead of the fire', () => {
		const s = baton('probe-row').shots[0]!;
		expect(s.worktree).toEqual({ repo: expect.stringContaining('probe-row'), branch: 'bv/b3-smoke' });
		const html = cardHtml(baton('probe-row'), true, ACCOUNTS);
		expect(html).toContain('data-worktree=');
		expect(html).toContain('worktree bv/b3-smoke');
	});
});

describe('reading a branch out of a work doc', () => {
	const doc = (header: string, body = '## Goal\n\nSomething.\n') => `# R1 — a row\n\n${header}\n\n${body}`;

	test('a forward designation in the header is read', () =>
		expect(branchFor(doc('**Status:** OPEN · runs in a worktree, branch `bv/x`'))).toBe('bv/x'));

	test('a landing record in the header is not a designation', () =>
		expect(branchFor(doc('**Status:** LANDED — worktree merged, branch `bv/x`'))).toBeNull());

	test('a branch named without a worktree is not a designation', () =>
		expect(branchFor(doc('**Status:** OPEN — rebases onto branch `master`'))).toBeNull());

	test('a branch below the first heading is history, not a designation', () =>
		expect(branchFor(doc('**Status:** OPEN', '## Commits\n\nOn worktree branch `bv/x`.\n'))).toBeNull());
});

test('the prose drops the fences its own shots already render, and keeps everything else', () => {
	const html = cardHtml(baton('probe-fork'), true, ACCOUNTS);
	const text = html.match(/<p class="rail-text">([\s\S]*?)<\/p>/)![1]!;
	expect(text).toContain('Recommendation: the Digger');
	expect(text).not.toContain('Wear ~/code/agents/canon/mantles/digger.md');
	// The instrument itself is untouched — only the prose above it is shaped.
	expect(baton('probe-fork').shots[0]!.summons).toContain('Wear ~/code/agents/canon/mantles/digger.md');
});

test('copy-summons carries the kickoff byte-for-byte', () => {
	const s = baton('probe-row').shots[0]!;
	const html = cardHtml(baton('probe-row'), true, ACCOUNTS);
	const pre = html.match(/<pre class="summons" data-summons>([\s\S]*?)<\/pre>/)![1]!;
	// `textContent` in the browser reads exactly this, un-escaped — the clipboard's payload.
	expect(unesc(pre)).toBe(s.summons);
	expect(Buffer.byteLength(unesc(pre))).toBe(Buffer.byteLength(s.summons));
});

// ---------- the holder law, structurally ----------

const synthetic = (holder: Baton['holder'], instruments: Instrument[]): Building => ({
	building: 'scratch', path: '/tmp/scratch', board: [], decisionQueue: [], issues: [], kickoffs: [],
	files: { boards: [], ledger: '/tmp/scratch/LEDGER.md', decisions: null, issues: null, workDocs: [], prose: [] },
	fails: [],
	ledgerTail: { date: '2026-08-27', mantle: 'Architect', tier: 'fable-high', row: null,
		body: 'b', decided: 'd', next: 'n', line: 1, block: 'b' },
	baton: { holder, text: 'Felix rules the frame.', instruments }, ledgerEntries: 1, decisions: 0,
});

const FIRE_WIRING = [/data-fire/, /data-worktree/, /data-copy/, /\/hands\//, /data-account/];

/**
 * **Amended at B6, deliberately, and strictly stronger.** Until B6 this file asserted `/<button/`:
 * a Felix-card carried no button at all. B6's blessed order puts a note box — and, on a pending
 * countersign card, a Countersign button — on every card, so "no button" stopped being true while
 * the invariant it was protecting did not change: *nothing on his card may reach `/hands/fire`*.
 *
 * So the button check became a claim about what the buttons ARE. A `class="ges"` button posts one
 * D63 line to `/inbox`, which appends to a file a human then sweeps; it carries no summons, no
 * account, no payload a fire could ride. If a fire button ever appears on one of these cards it
 * fails both this and `FIRE_WIRING` — the weaker of the two possible regressions is still caught.
 */
const everyButtonIsAGesture = (html: string) =>
	[...html.matchAll(/<button[^>]*>/g)].every(m => /class="ges[ "]/.test(m[0]));

const unwired = (html: string) => {
	for (const pattern of FIRE_WIRING) expect(html).not.toMatch(pattern);
	expect(everyButtonIsAGesture(html)).toBe(true);
};

describe("a Felix-holder baton is his card", () => {
	const summons: Instrument = { kind: 'summons', text: 'You are a Digger at opus-high.', mantle: 'Digger', tier: 'opus-high' };

	test('carries no fire wiring in the DOM at all — not even a disabled one', () => {
		const [card] = cards([synthetic('felix', [summons])], rig, ACCOUNTS[0]!);
		const html = cardHtml(card!, true, ACCOUNTS);
		unwired(html);
		expect(html).toContain('data-holder="felix"');
	});

	test('a fenced summons sitting in his entry is never composed into a body', () => {
		const [card] = cards([synthetic('felix', [summons])], rig, ACCOUNTS[0]!);
		expect((card as Card & { kind: 'baton' }).shots).toHaveLength(0);
	});

	test('a dropped baton (prose holder) is unwired too, and says it is dropped', () => {
		const [card] = cards([synthetic('prose', [])], rig, ACCOUNTS[0]!);
		const html = cardHtml(card!, true, ACCOUNTS);
		unwired(html);
		expect(html).toContain('Dropped baton');
	});

	test('gate and countersign cards are structurally unwired as well', () => {
		for (const c of fixtureCards().filter(c => c.kind !== 'baton')) unwired(cardHtml(c, true, ACCOUNTS));
	});

	// B6: the one card that gains a button, and the one state that gives it one.
	const queued = (over: Partial<Decision>): Building => ({
		...synthetic('prose', []),
		decisionQueue: [{ id: 'D11', date: '2026-08-27', decider: 'Architect', title: 'a ruling', body: '',
			blessed: false, pending: true, line: 1, ...over }],
		issues: over.blessed ? [] : [{ date: '2026-08-27', who: 'Felix (via Belvedere)', text: 'countersign D11: ✓', line: 2 }],
		baton: null, ledgerTail: null,
	});
	const card = (b: Building) => cardHtml(cards([b], rig, ACCOUNTS[0]!).find(c => c.kind === 'countersign')!, true, ACCOUNTS);

	test('a pending blessing card offers the button, and nothing that ignites', () => {
		const b: Building = { ...queued({}), issues: [] };
		const html = card(b);
		expect(html).toContain('pending blessing');
		expect(html).toContain('data-gesture="{&quot;building&quot;:&quot;/tmp/scratch&quot;,&quot;kind&quot;:&quot;countersign&quot;,&quot;decision&quot;:&quot;D11&quot;}"');
		unwired(html);
	});

	test('once his entry is in the inbox the card reads it back and drops the button', () => {
		const html = card(queued({}));
		expect(html).toContain('recorded — awaiting fold');
		expect(html).not.toContain('kind&quot;:&quot;countersign');
	});

	test('a decision the parser queues but the entry already blessed headlines folded, not pending', () => {
		const html = card(queued({ blessed: true }));
		expect(html).toContain('folded — ✓ in the decision');
		expect(html).not.toContain('pending blessing');
		expect(html).not.toContain('kind&quot;:&quot;countersign');
	});

	test('the only button on a Felix-card is the note box, and it posts to the inbox', () => {
		const [card] = cards([synthetic('felix', [summons])], rig, ACCOUNTS[0]!);
		const html = cardHtml(card!, true, ACCOUNTS);
		expect([...html.matchAll(/<button/g)]).toHaveLength(1);
		expect(html).toContain('data-gesture="{&quot;building&quot;:&quot;/tmp/scratch&quot;,&quot;kind&quot;:&quot;note&quot;}"');
	});
});

// ---------- D10: ambiguity never arms ----------

/**
 * The fire subset of `FIRE_WIRING`: everything a click could ride to `/hands/fire`. A collided
 * card must carry none of it — while keeping the summons and the copy button, which are reading.
 */
const FIRE_ONLY = [/data-fire/, /data-worktree/, /data-account/, /class="go"/, /\/hands\//];

describe('a session baton whose clause names Felix', () => {
	const withText = (text: string) => {
		const b = synthetic('session', [{ kind: 'summons', text: 'You are a Digger at opus-high.', mantle: 'Digger', tier: 'opus-high' }]);
		return cards([{ ...b, baton: { ...b.baton!, text } }], rig, ACCOUNTS[0]!)[0]!;
	};

	const collided = () => withText("PENDING Felix's ruling — on a pass, fire the fence below.");

	test("keeps the parser's holder — D10 is render law, not a second parser", () =>
		expect(cardHtml(collided(), true, ACCOUNTS)).toContain('data-holder="session"'));

	test('carries no fire wiring at all, and says which two readings collided', () => {
		const html = cardHtml(collided(), true, ACCOUNTS);
		for (const pattern of FIRE_ONLY) expect(html).not.toMatch(pattern);
		expect(html).toContain('Ambiguity never arms (D10)');
	});

	test('keeps the note and the copy button — copying is reading, and the summons is byte-exact', () => {
		const card = collided() as Card & { kind: 'baton' };
		const html = cardHtml(card, true, ACCOUNTS);
		expect(html).toMatch(/<button class="alt" data-copy>copy summons<\/button>/);
		const pre = html.match(/<pre class="summons" data-summons>([\s\S]*?)<\/pre>/)![1]!;
		expect(unesc(pre)).toBe(card.shots[0]!.summons);
	});

	test('an uncollided session baton keeps its buttons and carries no collision note', () => {
		const html = cardHtml(withText('fire the fence below.'), true, ACCOUNTS);
		expect(html).toContain('data-fire');
		expect(html).toMatch(/<button class="go"/);
		expect(html).not.toContain('Ambiguity never arms');
	});
});

describe("the live city's collided clauses, verbatim", () => {
	// The two cards the DoD names, pinned by the text their own ledgers carry today — not by
	// walking their repos, which is nine seconds of city and a corpus that moves under the suite.
	// Both parse as session batons and both name him; both must render safe.
	const LIVE: [name: string, clause: string][] = [
		['hexwright', "Felix's Phase-1 acceptance ruling — PENDING on the GENESIS §6 board: `bun run studio`, "
			+ 'breed, keep, export, rule (determinism green ✓ · contact sheet ✓ · does he feel something?). '
			+ 'On a pass, fire the fence below.'],
		['simmy', 'Felix fires the summons below when the corpus lands.'],
	];

	for (const [name, clause] of LIVE)
		test(`${name}: zero fire wiring, note and copy intact`, () => {
			const b = synthetic('session', [{ kind: 'summons', text: 'You are a Digger at opus-high.', mantle: 'Digger', tier: 'opus-high' }]);
			const card = cards([{ ...b, baton: { ...b.baton!, text: clause } }], rig, ACCOUNTS[0]!)[0]! as Card & { kind: 'baton' };
			expect(card.wired).toBe(false);
			const html = cardHtml(card, true, ACCOUNTS);
			for (const pattern of FIRE_ONLY) expect(html).not.toMatch(pattern);
			expect(html).toContain('Ambiguity never arms (D10)');
			expect(html).toContain('data-copy');
		});
});

// ---------- the honest cold state ----------

describe('hands disabled', () => {
	test('the buttons exist and are disabled; the summons still reads', () => {
		const html = cardHtml(baton('probe-row'), false, ACCOUNTS);
		expect(html).toContain('data-fire');
		expect(html).toMatch(/<button class="go"[^>]*\sdisabled>/);
		expect(html).toContain('You are a Builder at opus-high.');
	});

	test('copy-summons stays live when the hands are cold — the clipboard is not a hand', () => {
		const html = cardHtml(baton('probe-row'), false, ACCOUNTS);
		expect(html).toMatch(/<button class="alt" data-copy>copy summons<\/button>/);
	});
});

// ---------- refusals ----------

describe('the rail resolves; it never invents', () => {
	test('a row reference to a row no board carries is blocked, and names the building', () => {
		const b: Building = { ...synthetic('session', [{ kind: 'row', row: 'Z9' }]), building: 'scratch' };
		const [card] = cards([b], rig, ACCOUNTS[0]!);
		const shot = (card as Card & { kind: 'baton' }).shots[0]!;
		expect(shot.fire).toEqual({ blocked: 'no charge "Z9" on any board in scratch' });
		unwired(cardHtml(card!, true, ACCOUNTS));
	});

	test('a summons with no readable tier is blocked, not guessed', () => {
		const b = synthetic('session', [{ kind: 'summons', text: 'You are a Digger at whenever.', mantle: 'Digger', tier: null }]);
		const [card] = cards([b], rig, ACCOUNTS[0]!);
		const shot = (card as Card & { kind: 'baton' }).shots[0]!;
		expect(shot.fire).toHaveProperty('blocked');
		expect((shot.fire as { blocked: string }).blocked).toContain('no known tier');
	});
});

// ---------- the name-stamp reservation ----------

describe('the name-stamp', () => {
	test('two instruments in one render never share a stamp', () => {
		const taken = new Set<string>();
		const first = nextStamp('Builder', '/tmp/probe-stamp', taken);
		const second = nextStamp('Builder', '/tmp/probe-stamp', taken);
		expect(first).not.toBe(second);
		expect(second).toBe(first!.replace(/(\d+)$/, m => String(Number(m) + 1).padStart(2, '0')));
	});

	test('an unknown mantle has no lineage, so it has no stamp', () =>
		expect(nextStamp(null, '/tmp/probe-stamp')).toBeNull());
});

// ---------- the design laws over the pre-law rail (B9) ----------

describe('the visual law sweep', () => {
	test('no dropdown anywhere on a card: the account picker is a toggled radio group', () => {
		const html = cardHtml(baton('probe-row'), true, ACCOUNTS);
		expect(html).not.toContain('<select');
		expect(html).toContain('data-account');
		// The radio IS the state, so the browser holds it and the back button walks it.
		for (const a of ACCOUNTS) expect(html).toContain(`value="${a}"`);
		expect((html.match(/type="radio"/g) ?? []).length).toBe(ACCOUNTS.length);
		expect((html.match(/ checked>/g) ?? []).length).toBe(1);
	});

	test('the radio group is named after the shot\'s own reserved stamp — two pickers never collide', () => {
		const card = baton('probe-fork');
		const html = cardHtml(card, true, ACCOUNTS);
		const names = new Set([...html.matchAll(/name="(as-[^"]+)"/g)].map(m => m[1]!));
		expect(card.shots.length).toBeGreaterThan(1);
		expect(names.size).toBe(card.shots.length);
	});

	test('a card leads with its encapsulation and keeps the whole clause one [expand] away', () => {
		const html = cardHtml(baton('probe-row'), true, ACCOUNTS);
		const full = html.match(/<p class="rail-text">([\s\S]*?)<\/p>/)![1]!;
		if (html.includes('class="encap"')) {
			const name = html.match(/<p class="encap">([\s\S]*?)<\/p>/)![1]!;
			expect(name.split(/\s+/).length).toBeLessThanOrEqual(6);
			expect(full).toContain(name);              // derived from the text, never invented
			expect(html).toContain('<summary>expand</summary>');
		} else {
			expect(full.length).toBeGreaterThan(0);    // no seam ⇒ the clause renders whole
		}
	});

	test('attention decides across ranks; recency only orders inside one', () => {
		const list = cards(discover([FIXTURE]), rig, ACCOUNTS[0]!);
		const rankOf = (c: Card) => c.kind === 'baton' ? (c.wired && c.shots.length ? 0 : c.baton.holder === 'prose' ? 3 : 2)
			: c.kind === 'countersign' ? 1 : 2;
		const ranks = list.map(rankOf);
		expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
		// Inside one rank, the newer entry is drawn first — and never across ranks.
		const dated = list.filter(c => c.kind === 'baton') as (Card & { kind: 'baton' })[];
		for (const [i, c] of dated.entries()) {
			const next = dated[i + 1];
			if (next && rankOf(c) === rankOf(next)) expect(c.entry.date >= next.entry.date).toBe(true);
		}
	});
});
