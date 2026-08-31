// **Spaces** — his arrangement, as law rather than as pixels (B24).
//
// What a unit test can hold here is exactly the part that is a ruling: the drawn order (attention
// monotone, his order inside a rank), the invariants an arrangement may never break (nothing the
// register knows is absent, no badge moves), and the refusals every edit owes. The pixels are the
// camera's (`camera/probes/city-arrange.probe.ts`).

import { expect, test, describe } from 'bun:test';
import type { Attention, DeckBuilding } from './deck-model';
import {
	arrange, bindBuilding, bindings, countNodes, depthOf, derived, descends, dropNode, editSpace,
	findSpace, mintGroup, moveNode, type Space,
} from './spaces';

const noBadges = (): Record<Attention, number> => ({ waiting: 0, baton: 0, gate: 0, countersign: 0, escalation: 0 });

const b = (building: string, attention: number, label = '~/code/x', badges: Partial<Record<Attention, number>> = {}): DeckBuilding => ({
	building, path: `/Users/felix/code/${building}`, group: label, label,
	live: 0, badges: { ...noBadges(), ...badges }, attention, fresh: 0, sids: [],
});

const group = (id: string, children: Space[] = []): Space =>
	({ id, name: id, color: null, type: null, binding: null, children });
const bound = (building: string, children: Space[] = []): Space =>
	({ id: `b:${building}`, name: '', color: null, type: null, binding: building, children });

const ok = <T>(o: { ok: true; result: T } | { ok: false; error: string }): T => {
	if (!o.ok) throw new Error(`expected ok, got: ${o.error}`);
	return o.result;
};

describe('the drawn order', () => {
	test('attention monotone: a quiet space holding the loudest building sorts by its loudest member', () => {
		// His order says "quiet first"; one building inside `quiet` is blocked on him. The space is
		// exactly as loud as its loudest member, so `quiet` rises — the standing law, README §3.
		const spaces = [group('loud', [bound('mid')]), group('quiet', [bound('urgent'), bound('dull')])];
		const { tree } = arrange(spaces, [b('mid', 3), b('urgent', -1), b('dull', 9)]);
		expect(tree.map(n => n.space.id)).toEqual(['quiet', 'loud']);
		expect(tree[0]!.loud).toBe(-1);
		// …and inside the space, the same law: the loud one first, his order untouched below it.
		expect(tree[0]!.children.map(c => c.space.id)).toEqual(['b:urgent', 'b:dull']);
	});

	test('his order decides inside a rank — two buildings that want the same thing sit where he put them', () => {
		const spaces = [group('g', [bound('zeta'), bound('alpha')])];
		const { tree } = arrange(spaces, [b('alpha', 1), b('zeta', 1)]);
		expect(tree[0]!.children.map(c => c.space.binding)).toEqual(['zeta', 'alpha']);
		// The same two, swapped in his file, swap on the page: this is the whole gesture.
		const swapped = ok(moveNode(spaces, 'b:alpha', 'g', 0));
		expect(arrange(swapped, [b('alpha', 1), b('zeta', 1)]).tree[0]!.children.map(c => c.space.binding))
			.toEqual(['alpha', 'zeta']);
	});

	test('an empty group sinks rather than floating — silence is not urgency', () => {
		const { tree } = arrange([group('empty'), group('g', [bound('one')])], [b('one', 5)]);
		expect(tree.map(n => n.space.id)).toEqual(['g', 'empty']);
	});

	test('nothing the register knows can be absent: what he never filed lands in the tail, loudest first', () => {
		const { tree, unfiled, bound: n } = arrange([group('g', [bound('filed')])], [b('filed', 1), b('new', 0), b('other', 4)]);
		expect(tree).toHaveLength(1);
		expect(n).toBe(1);
		expect(unfiled.map(u => u.building)).toEqual(['new', 'other']);
	});

	test('a binding the register no longer carries keeps his space and says so — never a silent drop', () => {
		const { tree } = arrange([group('g', [bound('gone-away')])], []);
		expect(tree[0]!.children[0]!.missing).toBe(true);
		expect(tree[0]!.children[0]!.building).toBeNull();
		expect(bindings([group('g', [bound('gone-away')])])).toEqual(['gone-away']);
	});

	test('badges are untouched by any arrangement — truth underneath (the Goal)', () => {
		const rows = [b('one', 1, '~/code/x', { waiting: 2, gate: 1 })];
		const flat = arrange(derived(rows), rows).tree[0]!.children[0]!;
		const nested = arrange([group('a', [group('b', [bound('one')])])], rows).tree[0]!.children[0]!.children[0]!;
		expect(flat.building!.badges).toEqual(nested.building!.badges);
		expect(nested.building!.badges.waiting).toBe(2);
	});
});

describe('the register\'s own neighborhoods (candidate 7\'s fix)', () => {
	// B14's rewrite grouped *consecutive* runs of an attention-sorted list, so one neighborhood drew
	// as several sections with the same heading. Clustering first restores B9's invariant — measured
	// on the live register at this charge: 24 buildings, 5 labels, **7 sections drawn**.
	test('one section per label, however the attention order interleaves them', () => {
		const rows = [b('a/one', 0, '~/code/a'), b('b/one', 1, '~/code/b'), b('a/two', 2, '~/code/a')];
		const { tree } = arrange(derived(rows), rows);
		expect(tree.map(n => n.space.name)).toEqual(['~/code/a', '~/code/b']);
		expect(tree[0]!.children.map(c => c.space.binding)).toEqual(['a/one', 'a/two']);
	});

	test('clusters still order by their loudest member, and every building is drawn exactly once', () => {
		const rows = [b('a/one', 5, '~/code/a'), b('b/one', 1, '~/code/b'), b('a/two', 0, '~/code/a')];
		const { tree, unfiled } = arrange(derived(rows), rows);
		expect(tree.map(n => n.space.name)).toEqual(['~/code/a', '~/code/b']);
		expect(unfiled).toEqual([]);
		expect([...tree.flatMap(n => n.children)].map(c => c.space.binding).sort()).toEqual(['a/one', 'a/two', 'b/one']);
	});
});

describe('his gestures', () => {
	const start = [group('district', [bound('one'), bound('two')]), group('other')];

	test('a move re-parents and re-orders, and the tree stays whole', () => {
		const next = ok(moveNode(start, 'b:one', 'other', 0));
		expect(findSpace(next, 'other')!.children.map(c => c.binding)).toEqual(['one']);
		expect(findSpace(next, 'district')!.children.map(c => c.binding)).toEqual(['two']);
		expect(countNodes(next)).toBe(countNodes(start));
	});

	test('a move into a node\'s own subtree is refused by name — a swallowed subtree is the bug', () => {
		const out = moveNode(start, 'district', 'b:one', 0);
		expect(out.ok).toBe(false);
		expect(out.ok === false && out.error).toContain('inside');
		expect(moveNode(start, 'district', 'district', 0).ok).toBe(false);
		expect(descends(start, 'b:one', 'district')).toBe(true);
		expect(descends(start, 'district', 'b:one')).toBe(false);
	});

	test('a move within one list clamps the index that its own removal shifted', () => {
		const next = ok(moveNode(start, 'b:one', 'district', 2));
		expect(findSpace(next, 'district')!.children.map(c => c.binding)).toEqual(['two', 'one']);
	});

	test('filing a building mints one bound space; filing it twice is refused', () => {
		const next = ok(bindBuilding(start, 'three', 'other', 0));
		expect(bindings(next)).toEqual(['one', 'two', 'three']);
		expect(bindBuilding(next, 'three', 'district', 0).ok).toBe(false);
	});

	test('a new group is his to name, and it nests', () => {
		const { spaces, id } = ok(mintGroup(start, 'district', 'campaign', 1));
		expect(findSpace(spaces, id)!.name).toBe('campaign');
		expect(findSpace(spaces, 'district')!.children.at(-1)!.id).toBe(id);
		expect(depthOf(spaces)).toBe(2);
	});

	test('two groups minted in the same millisecond in different parents get different ids', () => {
		// The first cut numbered within the parent list, so `district` and `other` each answered
		// `s:<ms>-0` and an edit aimed at the second landed on the first (caught by the sketch test
		// below). An id names one space, everywhere in the tree.
		const one = ok(mintGroup(start, 'district', 'a', 1000));
		const two = ok(mintGroup(one.spaces, 'other', 'b', 1000));
		expect(two.id).not.toBe(one.id);
		expect(findSpace(two.spaces, one.id)!.name).toBe('a');
		expect(findSpace(two.spaces, two.id)!.name).toBe('b');
	});

	test('dissolving a group lifts its children where the group was — nothing leaves the City', () => {
		const next = ok(dropNode(start, 'district'));
		expect(next.map(s => s.id)).toEqual(['b:one', 'b:two', 'other']);
		expect(bindings(next)).toEqual(['one', 'two']);
	});

	test('unfiling a building removes its space and nothing else — the tail catches it', () => {
		const next = ok(dropNode(start, 'b:one'));
		expect(bindings(next)).toEqual(['two']);
		expect(arrange(next, [b('one', 1), b('two', 1)]).unfiled.map(u => u.building)).toEqual(['one']);
	});

	test('his words are trimmed, capped and never emptied into nothing', () => {
		const named = ok(editSpace(start, 'other', { name: '  the   speakeasy  ', type: 'one-off thing' }));
		expect(findSpace(named, 'other')!.name).toBe('the speakeasy');
		expect(findSpace(named, 'other')!.type).toBe('one-off thing');
		expect(findSpace(ok(editSpace(named, 'other', { type: '   ' })), 'other')!.type).toBeNull();
		expect(editSpace(start, 'other', { name: '   ' }).ok).toBe(false);
		expect(editSpace(start, 'nope', { name: 'x' }).ok).toBe(false);
		// A bound space may be named nothing: that IS the default, and the register's name draws.
		expect(ok(editSpace(start, 'b:one', { name: '' })).length).toBe(2);
		expect(derived([b('one', 1)])[0]!.children[0]!.name).toBe('');
	});

	test('a color is one of felikai\'s seven, or none', () => {
		expect(findSpace(ok(editSpace(start, 'other', { color: 'purple' })), 'other')!.color).toBe('purple');
		expect(findSpace(ok(editSpace(start, 'other', { color: null })), 'other')!.color).toBeNull();
	});

	test('every edit is a new tree — his last arrangement is never mutated under him', () => {
		const before = JSON.stringify(start);
		ok(moveNode(start, 'b:one', 'other', 0));
		ok(bindBuilding(start, 'nine', null, 0));
		ok(editSpace(start, 'other', { name: 'x' }));
		ok(dropNode(start, 'district'));
		expect(JSON.stringify(start)).toBe(before);
	});
});

describe('his sketch, expressible verbatim (the charge\'s header)', () => {
	test('district → building → campaign, plus a one-off he just wants to keep around', () => {
		// Felix's own worked example, and his own counter-example: speakeasy is not a campaign, it is
		// "more like a one-off thing". One recursive structure holds both — no rank Belvedere knows.
		let spaces: Space[] = [];
		const thg = ok(mintGroup(spaces, null, 'THG'));
		spaces = ok(editSpace(thg.spaces, thg.id, { type: 'district', color: 'blue' }));
		spaces = ok(bindBuilding(spaces, 'universal_robots_sdk/bob', thg.id, 0));
		const lunchbox = ok(mintGroup(spaces, 'b:universal_robots_sdk/bob', 'lunchbox'));
		spaces = ok(editSpace(lunchbox.spaces, lunchbox.id, { type: 'campaign' }));
		spaces = ok(bindBuilding(spaces, 'universal_robots_sdk/speakeasy', thg.id, 9));

		const rows = [b('universal_robots_sdk/bob', 2), b('universal_robots_sdk/speakeasy', 1)];
		const { tree, unfiled } = arrange(spaces, rows);
		expect(unfiled).toEqual([]);
		expect(tree.map(n => n.space.name)).toEqual(['THG']);
		expect(tree[0]!.space.type).toBe('district');
		// speakeasy is quieter in his order and louder in attention, so it draws first: the law, live.
		expect(tree[0]!.children.map(c => c.space.binding))
			.toEqual(['universal_robots_sdk/speakeasy', 'universal_robots_sdk/bob']);
		expect(findSpace(spaces, lunchbox.id)!.type).toBe('campaign');
		expect(depthOf(spaces)).toBe(3);
	});
});
