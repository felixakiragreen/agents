/**
 * **Spaces — the arrangement layer** (B24; Felix's own model, ruled at the rework blessing:
 * *"a space can have optional: color/name/cwd/board/agents/type/order and nest inside another
 * space. Done."*).
 *
 * One recursive structure over the building register. A space carries his words — a name, a color,
 * a free `type` label — and either binds a building or holds children, and that is the whole
 * taxonomy: Belvedere invents no ranks of its own (spec §4). A campaign is a group he made; so is a
 * district; so is speakeasy, which he said is neither.
 *
 * **Truth stays underneath.** Nothing in this file knows what is alive, what is owed or what a
 * board says: it arranges `DeckBuilding` rows the server already computed and hands them back in
 * his shape. So an arrangement can reorder the City and it can never change a badge, hide a
 * building the census knows about, or invent one it does not (the Goal's own law).
 *
 * **Two things a space does NOT store** (the header's trim): a board and a session roster. Those
 * are what the register and the census already know about the bound building — derived through the
 * binding at draw time, never copied into his file, because a copy is a second truth that goes
 * stale. And **order is the array**: a stored `order` field beside an ordered array would be two
 * spellings of one fact, and they would disagree the first time one was edited without the other.
 *
 * This module is **pure and shared** — the server parses and writes the file (`arrangement.ts`),
 * the client draws and edits the tree, and both run this same code, so his file and his screen
 * cannot disagree about what his arrangement means.
 */

import type { DeckBuilding } from './deck-model';
// Type-only: `hands.ts` spawns and writes, and this module is in the client bundle. The type is
// erased at transpile, so nothing of that file travels with it (`fail`'s one-line twin is `no`).
import type { Outcome } from './hands';

const no = <T>(error: string): Outcome<T> => ({ ok: false, error });

/** Everything has a limit (directive 3.1). His city is 24 buildings; these are roomy, not tight. */
export const LIMITS = {
	nodes: 400, depth: 8, nameChars: 60, typeChars: 24, bytes: 128 << 10,
} as const;

/** felikai's own intents, the only colors a space may wear (`colors.ts` §INTENTS, the same seven). */
export const SPACE_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'grey'] as const;
export type SpaceColor = (typeof SPACE_COLORS)[number];

/**
 * One node of his arrangement. `binding` is a building's register name (`agents/belvedere`), and a
 * node may both bind and hold children — a building with campaigns nested under it is his to make.
 */
export type Space = {
	id: string;
	/**
	 * **His label, and empty where he has not given one.** A bound space with no name of his draws
	 * the register's own name for its building — so the default carries no copy of a fact the
	 * register already holds, and a rename is visibly his (the City shows both, `city.client.ts`).
	 */
	name: string;
	color: SpaceColor | null;
	/** His word for what this is — "district", "campaign", "office", or nothing. Never a rank. */
	type: string | null;
	binding: string | null;
	children: Space[];
};

/** The file, as it sits on disk and as it rides the poll. */
export type Arrangement = {
	spaces: Space[];
	/** True where the file exists; false where the City is drawing the register's own neighborhoods. */
	his: boolean;
	/** Why his file is not being used, where it could not be read — never a silent fallback. */
	error: string | null;
};

export const EMPTY: Arrangement = { spaces: [], his: false, error: null };

/** One node, drawn: his space, the building it resolves to, and the rank it sorts at. */
export type Drawn = {
	space: Space;
	/** Resolved through the binding — never stored, always this poll's row (the header's law). */
	building: DeckBuilding | null;
	/** Bound to a name the register does not carry. His space stands; the deck says so. */
	missing: boolean;
	/** Lower is louder. A space is exactly as loud as its loudest member (spec §1). */
	loud: number;
	children: Drawn[];
};

export type Arranged = {
	tree: Drawn[];
	/** Every building his arrangement does not mention, loudest first — the tail he files from. */
	unfiled: DeckBuilding[];
	bound: number;
};

/** Quieter than any real rank: an empty group sinks rather than floating to the top. */
const SILENT = Number.MAX_SAFE_INTEGER;

// ---------- reading the tree ----------

export function* walk(spaces: readonly Space[]): Generator<Space> {
	for (const s of spaces) { yield s; yield* walk(s.children); }
}

export const countNodes = (spaces: readonly Space[]): number => [...walk(spaces)].length;

export const depthOf = (spaces: readonly Space[]): number =>
	spaces.length === 0 ? 0 : 1 + Math.max(...spaces.map(s => depthOf(s.children)));

export const findSpace = (spaces: readonly Space[], id: string): Space | null => {
	for (const s of walk(spaces)) if (s.id === id) return s;
	return null;
};

/** Every building his arrangement mentions, in the order it mentions them. */
export const bindings = (spaces: readonly Space[]): string[] =>
	[...walk(spaces)].map(s => s.binding).filter((b): b is string => b !== null);

/** Is `id` inside `of`'s own subtree? The one question a move must ask before it makes a cycle. */
export const descends = (spaces: readonly Space[], id: string, of: string): boolean => {
	const parent = findSpace(spaces, of);
	return parent !== null && [...walk(parent.children)].some(s => s.id === id);
};

// ---------- the drawn order ----------

/**
 * **Attention monotone, inside his arrangement** (spec §1). At every level siblings sort by rank
 * first and by *his* order inside a rank — the standing law of this building with his arrangement
 * standing exactly where recency used to (README §3: recency informs sort order, never dictates
 * it). So a group he put last still rises when something in it is blocked on him, and two
 * buildings that want the same thing from him sit in the order he put them.
 *
 * A group's rank is its loudest member's, computed over the whole subtree — which is why a quiet
 * group holding one loud building is not a quiet group.
 */
export function arrange(spaces: readonly Space[], buildings: readonly DeckBuilding[]): Arranged {
	const byName = new Map(buildings.map(b => [b.building, b]));
	const taken = new Set<string>();

	const draw = (s: Space): Drawn => {
		const building = s.binding === null ? null : byName.get(s.binding) ?? null;
		if (building) taken.add(building.building);
		const children = s.children.map(draw).sort((a, b) => a.loud - b.loud);
		const mine = building === null ? SILENT : building.attention;
		return {
			space: s, building, missing: s.binding !== null && building === null,
			loud: Math.min(mine, ...children.map(c => c.loud), SILENT),
			children,
		};
	};

	// `sort` is stable in every engine this runs on, so his order survives inside a rank without a
	// second key — the array IS the order (§head).
	const tree = spaces.map(draw).sort((a, b) => a.loud - b.loud);
	return { tree, unfiled: buildings.filter(b => !taken.has(b.building)), bound: taken.size };
}

/**
 * The City with no arrangement of his: the register's own neighborhoods, as spaces.
 *
 * **This is candidate 7's fix** (spec §3, reproduced — see the charge's findings). B9's invariant
 * was group-first: cluster by label, then order the clusters by their loudest member. B14's rewrite
 * dropped it and grouped *consecutive* runs of an attention-sorted list instead, so one
 * neighborhood drew as two or three sections with the same heading. Clustering here restores the
 * invariant, and it restores it **through the same code path his own arrangement uses** — one
 * renderer, so the default view and his view can never drift apart.
 */
export function derived(buildings: readonly DeckBuilding[]): Space[] {
	const groups = new Map<string, Space>();
	for (const b of buildings) {
		let g = groups.get(b.label);
		if (!g) { g = { id: `g:${b.label}`, name: b.label, color: null, type: null, binding: null, children: [] }; groups.set(b.label, g); }
		g.children.push({ id: `b:${b.building}`, name: '', color: null, type: null, binding: b.building, children: [] });
	}
	return [...groups.values()];
}

// ---------- editing: pure tree surgery, his gestures ----------

const clone = (spaces: readonly Space[]): Space[] =>
	spaces.map(s => ({ ...s, children: clone(s.children) }));

/** The list a node sits in, and where. `null` parent means the root list. */
function siteOf(spaces: Space[], id: string): { list: Space[]; at: number } | null {
	const at = spaces.findIndex(s => s.id === id);
	if (at >= 0) return { list: spaces, at };
	for (const s of spaces) {
		const found = siteOf(s.children, id);
		if (found) return found;
	}
	return null;
}

const listIn = (spaces: Space[], parent: string | null): Space[] | null =>
	parent === null ? spaces : findSpace(spaces, parent)?.children ?? null;

/**
 * Move a node under `parent` at `index`. **A move can never make a cycle** and never quietly does
 * nothing: dropping a group into its own child is refused by name, because the alternative is a
 * subtree that disappears from the file.
 */
export function moveNode(spaces: readonly Space[], id: string, parent: string | null, index: number): Outcome<Space[]> {
	if (id === parent) return no(`a space cannot hold itself (${id})`);
	if (parent !== null && descends(spaces, parent, id))
		return no(`refused: ${parent} is inside ${id}, so this move would lose the subtree`);
	const next = clone(spaces);
	const site = siteOf(next, id);
	if (!site) return no(`no such space: ${id}`);
	const into = listIn(next, parent);
	if (into === null) return no(`no such space to move into: ${parent}`);
	const [node] = site.list.splice(site.at, 1);
	if (!node) return no(`no such space: ${id}`);
	// The removal may have shifted the target index left; clamping keeps a drop at the end at the end.
	const cut = into === site.list && site.at < index ? index - 1 : index;
	into.splice(Math.max(0, Math.min(cut, into.length)), 0, node);
	if (depthOf(next) > LIMITS.depth) return no(`an arrangement nests at most ${LIMITS.depth} deep`);
	return { ok: true, result: next };
}

/** File a building his arrangement does not yet mention. The name he sees first is the building's. */
export function bindBuilding(spaces: readonly Space[], building: string, parent: string | null, index: number): Outcome<Space[]> {
	if (bindings(spaces).includes(building)) return no(`${building} is already filed — move its space instead`);
	if (countNodes(spaces) >= LIMITS.nodes) return no(`an arrangement holds at most ${LIMITS.nodes} spaces`);
	const next = clone(spaces);
	const into = listIn(next, parent);
	if (into === null) return no(`no such space to file into: ${parent}`);
	into.splice(Math.max(0, Math.min(index, into.length)), 0,
		{ id: `b:${building}`, name: '', color: null, type: null, binding: building, children: [] });
	if (depthOf(next) > LIMITS.depth) return no(`an arrangement nests at most ${LIMITS.depth} deep`);
	return { ok: true, result: next };
}

/** A new group of his naming. Minted at the end of its parent — his drag is what places it. */
export function mintGroup(spaces: readonly Space[], parent: string | null, name: string, now = Date.now()): Outcome<{ spaces: Space[]; id: string }> {
	if (countNodes(spaces) >= LIMITS.nodes) return no(`an arrangement holds at most ${LIMITS.nodes} spaces`);
	const next = clone(spaces);
	const into = listIn(next, parent);
	if (into === null) return no(`no such space to add to: ${parent}`);
	// **Unique across the whole tree, not within its parent.** The first cut minted
	// `s:<ms>-<index in this list>`, and two groups made in the same millisecond in two different
	// parents — which is what a test doing it twice in a row does, and what a fast hand does — came
	// out with the same id. An id names one space (`arrangement.ts` refuses a duplicate at the door),
	// so an edit aimed at the second one landed on the first.
	const used = new Set([...walk(next)].map(s => s.id));
	let id = `s:${now.toString(36)}`;
	for (let n = 1; used.has(id); n++) id = `s:${now.toString(36)}-${n}`;
	into.push({ id, name: name.slice(0, LIMITS.nameChars) || 'new space', color: null, type: null, binding: null, children: [] });
	if (depthOf(next) > LIMITS.depth) return no(`an arrangement nests at most ${LIMITS.depth} deep`);
	return { ok: true, result: { spaces: next, id } };
}

/** His words on one space: the name, the color, the free type label. Nothing else is editable. */
export function editSpace(spaces: readonly Space[], id: string, patch: { name?: string; color?: SpaceColor | null; type?: string | null }): Outcome<Space[]> {
	const next = clone(spaces);
	const s = findSpace(next, id);
	if (!s) return no(`no such space: ${id}`);
	if (patch.name !== undefined) s.name = patch.name.replace(/\s+/g, ' ').trim().slice(0, LIMITS.nameChars);
	if (patch.color !== undefined) s.color = patch.color;
	if (patch.type !== undefined) {
		const t = (patch.type ?? '').replace(/\s+/g, ' ').trim().slice(0, LIMITS.typeChars);
		s.type = t === '' ? null : t;
	}
	if (s.name === '' && s.binding === null) return no('a group needs a name — that is the only thing it is');
	return { ok: true, result: next };
}

/**
 * Take a node out of the arrangement. **Its children rise to its parent** rather than dying with
 * it: dropping a group is a statement about the group, and taking eight buildings off the City with
 * it would be the arrangement hiding something (the Goal's own law).
 */
export function dropNode(spaces: readonly Space[], id: string): Outcome<Space[]> {
	const next = clone(spaces);
	const site = siteOf(next, id);
	if (!site) return no(`no such space: ${id}`);
	const [node] = site.list.splice(site.at, 1);
	if (node) site.list.splice(site.at, 0, ...node.children);
	return { ok: true, result: next };
}
