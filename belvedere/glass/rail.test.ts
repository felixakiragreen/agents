// The rail's two laws, tested where they can actually be wrong.
//
//  1. **The holder decides the wiring.** The Felix-card test is structural, not cosmetic: it
//     asserts the rendered HTML contains no button, no payload and no hands path AT ALL. A
//     `disabled` attribute would pass a weaker test and still be one devtools edit from a fire.
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
import { discover, type Baton, type Building, type Instrument } from '../../doctrine';
import { cardHtml, cards, recommended, shapeOf, type Card } from './rail';
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
		['one instrument is a move whatever the prose says', 'fire the wave in parallel', 1, 'move'],
		['no instrument is still a move — there is nothing to choose between', 'nothing owed', 0, 'move'],
		['"either … or" marks a fork', 'either measure first or fix first', 2, 'fork'],
		['"choose" marks a fork', 'choose one of the two below', 2, 'fork'],
		['"option A" marks a fork', 'option A fires the Digger, option B the Builder', 2, 'fork'],
		['"in parallel" marks a wave', 'fire B1 and B2 in parallel', 2, 'wave'],
		['"both" marks a wave', 'fire both rows', 2, 'wave'],
		['a fork beats a wave when both words appear', 'either fire both, or wait', 2, 'fork'],
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
		expect(bodies[0]).toMatchObject({ model: 'fable', effort: 'high', color: 'Blue' });
		expect(bodies[1]).toMatchObject({ model: 'opus', effort: 'high', color: 'Aqua' });
		expect(bodies[0]!.stamp).toStartWith('digger-probe-fork-');
		expect(bodies[1]!.stamp).toStartWith('builder-probe-fork-');
	});
});

describe('the row reference', () => {
	test('`fire R1` resolves to the work doc kickoff fence, cited by file and line', () => {
		const s = baton('probe-row').shots[0]!;
		expect(s.label).toBe('row R1 — Builder · opus-high');
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
	files: { boards: [], ledger: '/tmp/scratch/LEDGER.md', decisions: null, issues: null, workDocs: [] },
	fails: [],
	ledgerTail: { date: '2026-08-27', mantle: 'Architect', tier: 'fable-high', row: null,
		body: 'b', decided: 'd', next: 'n', line: 1, block: 'b' },
	baton: { holder, text: 'Felix rules the frame.', instruments },
});

const FIRE_WIRING = [/<button/, /data-fire/, /data-worktree/, /data-copy/, /\/hands\//, /data-account/];

describe("a Felix-holder baton is his card", () => {
	const summons: Instrument = { kind: 'summons', text: 'You are a Digger at opus-high.', mantle: 'Digger', tier: 'opus-high' };

	test('carries no fire wiring in the DOM at all — not even a disabled one', () => {
		const [card] = cards([synthetic('felix', [summons])], rig, ACCOUNTS[0]!);
		const html = cardHtml(card!, true, ACCOUNTS);
		for (const pattern of FIRE_WIRING) expect(html).not.toMatch(pattern);
		expect(html).toContain('data-holder="felix"');
	});

	test('a fenced summons sitting in his entry is never composed into a body', () => {
		const [card] = cards([synthetic('felix', [summons])], rig, ACCOUNTS[0]!);
		expect((card as Card & { kind: 'baton' }).shots).toHaveLength(0);
	});

	test('a dropped baton (prose holder) is unwired too, and says it is dropped', () => {
		const [card] = cards([synthetic('prose', [])], rig, ACCOUNTS[0]!);
		const html = cardHtml(card!, true, ACCOUNTS);
		for (const pattern of FIRE_WIRING) expect(html).not.toMatch(pattern);
		expect(html).toContain('Dropped baton');
	});

	test('gate and countersign cards are structurally unwired as well', () => {
		for (const c of fixtureCards().filter(c => c.kind !== 'baton'))
			for (const pattern of FIRE_WIRING) expect(cardHtml(c, true, ACCOUNTS)).not.toMatch(pattern);
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
		expect(shot.fire).toEqual({ blocked: 'no row "Z9" on any board in scratch' });
		expect(cardHtml(card!, true, ACCOUNTS)).not.toMatch(/<button/);
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
