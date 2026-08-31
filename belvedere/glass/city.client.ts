// **The City — Context's one tenant, and Felix's own arrangement of it** (keel §3; B24).
//
// Moved out of `deck.client.ts` at B24, where it had grown from a list of neighborhoods into the
// one pane he edits. The shell keeps the layout, the drawer and the poll; this file keeps what the
// City *is* — which buildings, in whose order, wearing whose names — and it is a tenant of the
// shell in everything but the `FocusView` register: one mount, one draw, one signature, one set of
// listeners hung on the host the shell owns.
//
// **Nothing here can ignite** (D10, and the shell's own law). The one wire this file reaches is
// `POST /desk/arrangement` — a JSON file under `desk/`, in front of the credential gate exactly
// like the inbox and the drafts (B6 F3), because cold hands must never cost him the ability to
// arrange his own City.
//
// **Truth stays underneath** (the charge's Goal, verbatim): the census still decides what exists
// and what is live, the server still ranks by attention, and an arrangement can reorder, rename,
// recolor and nest without changing one badge or hiding one building. What he has not arranged
// lands in the unfiled tail, in the open, where he can file it.

import { SWATCHES } from './colors';
import {
	arrange, bindBuilding, derived, dropNode, editSpace, mintGroup, moveNode,
	type Drawn, type Space, type SpaceColor,
} from './spaces';
import type { Attention, DeckSession, DeckSnapshot, PaneState, QueueItem } from './deck-model';
import { ATTENTION } from './deck-model';
import { ago, chatButton, dot, dots, el, named, receipt, remember, remembered, say, stamp, tipSession } from './deck-dom';
import { selection } from './deck-view';

// ---------- what the City is holding ----------

export type CityCtx = {
	snapshot: () => DeckSnapshot | null;
	state: () => PaneState;
	/** The shell's own redraw — an arrangement gesture repaints now rather than at the next poll. */
	redraw: () => void;
};

let ctx: CityCtx | null = null;

const ARRANGE_KEY = 'belvedere.city.arranging';
const SHUT_KEY = 'belvedere.city.shut';

/** Editing is a mode, not a mood: at rest the City is a view, and no drag can move anything. */
let arranging = false;
/** The space whose name, color and type strip is open. One at a time — the pane is 12–60% wide. */
let editing: string | null = null;
/** Collapsed groups. A per-viewer convenience, so it rides `localStorage` and never his file. */
let shut = new Set<string>();
/** What a POST last said, held across the repaint the poll brings (`deck-dom.ts` §receipts). */
const OUT = 'city:arrangement';
/**
 * What he is halfway through typing, by space id and field. **A poll may never cost a keystroke**
 * (B23's repaint law): the pane redraws every time a beat lands, and a box rebuilt from the stored
 * name would take back the half-written one. Held here, dropped when the edit commits.
 */
const typing = new Map<string, string>();

export function mountCity(c: CityCtx): void {
	ctx = c;
	arranging = remembered(ARRANGE_KEY, v => (typeof v === 'boolean' ? v : null)) ?? false;
	shut = new Set(remembered(SHUT_KEY, v => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : null)) ?? []);
}

/** His arrangement, or the register's own neighborhoods where he has not made one (`spaces.derived`). */
const spacesOf = (snap: DeckSnapshot): Space[] =>
	snap.arrangement.his ? snap.arrangement.spaces : derived(snap.register.buildings);

export const citySignature = (): string => {
	const snap = ctx?.snapshot() ?? null;
	return snap === null ? 'cold' : JSON.stringify([
		ctx!.state(), selection.building, arranging, editing, [...shut].sort(), [...typing],
		snap.arrangement, snap.register.buildings, snap.auditor.visible,
		snap.register.refreshing, snap.register.error,
		snap.census.present, snap.census.beats, snap.census.malformed, snap.census.since,
		snap.census.sessions, snap.identity.error, snap.identity.workspaces,
	]);
};

// ---------- the pieces (ported from `deck.client.ts` unchanged) ----------

const BADGE_WORD: Readonly<Record<Attention, string>> = {
	waiting: 'blocked on you', baton: 'baton', gate: '⬡-gate', countersign: 'blessing', escalation: 'escalation',
};

function badges(counts: Record<Attention, number>): HTMLElement {
	const box = el('span', 'badges');
	for (const k of ATTENTION) {
		if (!counts[k]) continue;
		const pip = el('span', `badge b-${k}`, String(counts[k]));
		pip.title = `${counts[k]} × ${BADGE_WORD[k]}`;
		box.append(pip);
	}
	return box;
}

/** Everything has a limit: a building with thirty open gates gets a tooltip, not a transcript. */
const TIP_ITEMS = 4;

/**
 * Expanded: the sessions themselves, one line each — the name cmux gives it, the birth name where
 * they differ, state, age. The tooltip carries the depth and the rename/recolor controls (B18).
 */
function sessionLines(ss: DeckSession[], stale: boolean): HTMLElement {
	const box = el('ul', 'lines');
	for (const s of ss) {
		const line = el('li', 'line');
		tipSession(line, s);
		line.append(dot(s), named(s, stale), el('span', 'st-word', s.waiting ?? s.state), stamp(s.last));
		// Hotswap entry point #1 (B16 §1): every session row on the deck reaches the one Chat, and
		// reaches it through the same shared control (`deck-dom.ts` §chatButton).
		line.append(chatButton(s.sid));
		box.append(line);
	}
	return box;
}

// ---------- his arrangement, drawn ----------

/** The subtree's badges, summed — what a collapsed group leads with (spec §6, encapsulation-first). */
function sum(n: Drawn): Record<Attention, number> {
	const out = { waiting: 0, baton: 0, gate: 0, countersign: 0, escalation: 0 };
	const add = (d: Drawn): void => {
		for (const k of ATTENTION) out[k] += d.building?.badges[k] ?? 0;
		for (const c of d.children) add(c);
	};
	add(n);
	return out;
}

const sidsOf = (n: Drawn): string[] => [...(n.building?.sids ?? []), ...n.children.flatMap(sidsOf)];

/** A grip, and the two drop kinds. Present only while arranging: no mode, no move. */
function grip(id: string): HTMLElement {
	const g = el('span', 'sp-grip', '⠿');
	g.dataset['arrGrip'] = id;
	g.dataset['tip'] = 'drag to move this into a space, or onto a row to sit before it';
	return g;
}

const toggleShut = (id: string): void => {
	if (shut.has(id)) shut.delete(id); else shut.add(id);
	remember(SHUT_KEY, [...shut]);
	ctx!.redraw();
};

/**
 * One node of his arrangement. A bound space draws its building through the binding — badges,
 * dots, sessions, all this poll's, none of them stored — and a group draws its children.
 */
function spaceNode(n: Drawn, live: Map<string, DeckSession>, stale: boolean, depth: number, queue: QueueItem[], filed = true): HTMLElement {
	const s = n.space;
	const b = n.building;
	const box = el('section', `nb sp${b ? ' sp-bound' : ''}${n.missing ? ' sp-gone' : ''}`);
	box.dataset['arrId'] = s.id;
	box.dataset['depth'] = String(depth);
	if (s.color) box.dataset['color'] = s.color;

	const head = el('div', 'nb-h sp-h');
	// A drop on a space's header puts the dragged thing INSIDE it; a drop on a bound row puts it
	// before that row (§the drag). A row in the unfiled tail is in no arrangement yet, so it is a
	// thing to drag and never a place to drop.
	if (filed) head.dataset['arrInto'] = s.id;
	const collapsed = shut.has(s.id) && n.children.length > 0;
	if (n.children.length) {
		const caret = el('button', 'sp-caret', collapsed ? '▸' : '▾') as HTMLButtonElement;
		caret.type = 'button';
		caret.dataset['arrShut'] = s.id;
		caret.dataset['tip'] = collapsed ? 'open this space' : 'collapse this space';
		head.append(caret);
	}
	if (arranging) head.append(grip(s.id));

	if (b) {
		// The building's own row, inside his space: the selection, the tooltip and the jump are the
		// City's from B14 and are untouched — this only decides *where on the page* the row is drawn.
		const row = el('span', `row sp-row${b.building === selection.building ? ' on' : ''}`);
		row.dataset['building'] = b.building;
		row.dataset['tip'] = b.building;
		const wants = queue.filter(i => i.building === b.building);
		const names = wants.slice(0, TIP_ITEMS).map(i => i.name);
		row.dataset['tipMore'] = `${b.path} · ${b.live} live · `
			+ (names.join(' · ') || 'nothing waiting on you')
			+ (wants.length > names.length ? ` · +${wants.length - names.length} more` : '');
		row.dataset['tipIn'] = b.path;
		row.dataset['tipGo'] = `/b/${b.building.split('/').map(encodeURIComponent).join('/')}`;
		const mine = b.sids.map(id => live.get(id)).filter((x): x is DeckSession => !!x);
		row.append(dots(mine), el('span', 'name', s.name));
		// His label and the register's name are two different facts, and where they differ BOTH are
		// shown: an arrangement renames the City, never the city (spec §5).
		if (s.name !== b.building) row.append(el('span', 'sp-true', b.building));
		if (s.type) row.append(el('span', 'sp-type', s.type));
		row.append(badges(b.badges));
		head.append(row);
	}
	else {
		head.append(el('span', 'nb-name', s.name));
		if (s.type) head.append(el('span', 'sp-type', s.type));
		if (n.missing) head.append(el('span', 'sp-note', `bound to ${s.binding} — not on the register`));
		// A group carries its members' liveness at rest and their badges when it is shut — the
		// encapsulation law's own answer to a collapsed group (spec §6). Both are derived, per poll.
		head.append(dots(sidsOf(n).map(id => live.get(id)).filter((x): x is DeckSession => !!x)));
		if (collapsed) head.append(badges(sum(n)));
	}
	if (arranging && filed) {
		const pick = el('button', 'sp-edit', editing === s.id ? '×' : 'edit') as HTMLButtonElement;
		pick.type = 'button';
		pick.dataset['arrEdit'] = s.id;
		head.append(pick);
	}
	box.append(head);

	if (arranging && editing === s.id) box.append(editStrip(s));

	if (collapsed) return box;

	if (b && ctx!.state() === 'expanded') {
		const mine = b.sids.map(id => live.get(id)).filter((x): x is DeckSession => !!x);
		if (mine.length) box.append(sessionLines(mine, stale));
	}
	if (n.children.length) {
		const kids = el('div', 'sp-kids');
		for (const c of n.children) kids.append(spaceNode(c, live, stale, depth + 1, queue));
		box.append(kids);
	}
	return box;
}

/** His words on one space: the name, the color, the free type label — and what to do with it. */
function editStrip(s: Space): HTMLElement {
	const strip = el('div', 'sp-strip');

	const name = el('input', 'sp-in') as HTMLInputElement;
	name.type = 'text';
	name.value = typing.get(`name:${s.id}`) ?? s.name;
	name.maxLength = 60;
	name.spellcheck = false;
	name.placeholder = 'name it';
	name.dataset['arrName'] = s.id;

	const type = el('input', 'sp-in sp-in-type') as HTMLInputElement;
	type.type = 'text';
	type.value = typing.get(`type:${s.id}`) ?? s.type ?? '';
	type.maxLength = 24;
	type.spellcheck = false;
	// His own counter-example decided this field: speakeasy is not a campaign, "more like a one-off
	// thing". So the word is his to type and Belvedere knows none of them (spec §4).
	type.placeholder = 'your word — district, campaign, office, anything';
	type.dataset['arrType'] = s.id;
	strip.append(name, type);

	const sw = el('div', 'sp-swatches');
	for (const { intent, hex } of SWATCHES) {
		const b = el('button', 'swatch-btn') as HTMLButtonElement;
		b.type = 'button';
		b.style.background = hex;
		b.title = `${intent} · ${hex}`;
		b.dataset['arrColor'] = s.id;
		b.dataset['intent'] = intent;
		if (s.color === intent) b.dataset['on'] = 'yes';
		sw.append(b);
	}
	const none = el('button', 'st', 'no color') as HTMLButtonElement;
	none.type = 'button';
	none.dataset['arrColor'] = s.id;
	none.dataset['intent'] = '';
	sw.append(none);
	strip.append(sw);

	const acts = el('div', 'sp-acts');
	const add = el('button', 'st wide', '+ space inside') as HTMLButtonElement;
	add.type = 'button';
	add.dataset['arrAdd'] = s.id;
	const drop = el('button', 'st wide', s.binding ? 'unfile' : 'dissolve') as HTMLButtonElement;
	drop.type = 'button';
	drop.dataset['arrDrop'] = s.id;
	drop.dataset['tip'] = s.binding
		? 'take this building out of your arrangement — it goes back to the unfiled tail, and nothing about it changes'
		: 'remove this group — whatever is inside rises to where the group was, never disappears';
	acts.append(add, drop);
	strip.append(acts);
	return strip;
}

// ---------- the pane ----------

const LEGEND: [string, string, string?][] = [
	['dot s-working', 'working'],
	['dot s-idle', 'idle'],
	['dot s-unknown', 'unknown — no pid to ask'],
	['dot s-needs-input w-blocked', 'blocked — a permission prompt is waiting'],
	['badge b-waiting', 'blocked on you'],
	['badge b-baton', 'a ledger tail handed the next move on'],
	['badge b-gate', '⬡-gate on a live charge'],
	['badge b-countersign', 'decision waiting on your pen'],
	['badge b-escalation', 'escalation raised, nothing says it was ruled'],
	// **The two identity layers, named apart** (spec §5). They are different files, different
	// lifetimes and different owners, and the City draws both — so it says which is which.
	['sp-key', 'your arrangement — name, color and grouping, Belvedere-side, in desk/city-arrangement.json', 'space'],
	['sp-true', 'the register\'s own name for that building, shown wherever you have relabeled it', 'path'],
	['swatch legend-swatch', 'the color cmux is wearing — cmux-side session identity, written through (B18)', ' '],
	['birth', 'the rig\'s birth name, shown where cmux calls it something else', 'born'],
	['stale', 'the identity read failed — this name is the last copy that answered', 'stale'],
];

function legend(): HTMLElement {
	const box = el('div', 'legend-deck');
	box.append(el('span', 'label', 'legend'));
	for (const [cls, text, sample] of LEGEND) {
		const key = el('span', 'lkey');
		key.append(el('span', cls, sample ?? (cls.startsWith('badge') ? 'n' : '')), el('span', '', text));
		box.append(key);
	}
	return box;
}

/** The arrange toggle, and what it turns on. No dropdowns anywhere near it (design law, §3). */
function toolbar(his: boolean): HTMLElement {
	const bar = el('div', 'sp-bar');
	const t = el('button', 'st wide', 'arrange') as HTMLButtonElement;
	t.type = 'button';
	t.dataset['arrToggle'] = 'yes';
	t.dataset['on'] = arranging ? 'yes' : 'no';
	t.dataset['tip'] = 'reorder, rename, recolor and nest the City — your way';
	t.dataset['tipMore'] = 'Drag a grip onto a space to put it inside, or onto a row to sit before it. '
		+ 'It saves to desk/city-arrangement.json, so it follows you to any browser and survives a restart. '
		+ 'Attention still outranks your order: a space is as loud as its loudest member.';
	bar.append(t);
	if (arranging) {
		const add = el('button', 'st wide', '+ space') as HTMLButtonElement;
		add.type = 'button';
		add.dataset['arrAdd'] = '';
		bar.append(add);
	}
	const out = el('span', 'out', receipt(OUT));
	out.dataset['outFor'] = OUT;
	bar.append(out);
	if (arranging && !his) bar.append(el('span', 'sp-note', 'nothing arranged yet — the first move adopts what you see'));
	return bar;
}

export function drawCity(host: HTMLElement): void {
	const snap = ctx?.snapshot() ?? null;
	if (!snap) { host.append(el('p', 'quiet', 'waiting for the first poll…')); return; }
	const c = snap.census;
	const stale = snap.identity.error !== null;
	const live = new Map(c.sessions.filter(s => s.state !== 'gone').map(s => [s.sid, s]));

	const count = el('span', 'big');
	count.id = 'live-count';
	count.dataset['live'] = String(c.live);
	count.textContent = String(c.live);
	const head = el('div', 'headline');
	head.append(count, el('span', 'label', 'live'));
	if (c.waiting) {
		const w = el('span', 'big waiting-count', String(c.waiting));
		w.dataset['waiting'] = String(c.waiting);
		w.id = 'waiting-count';
		head.append(w, el('span', 'label', 'blocked on you'));
	}
	host.append(head);

	const minimal = ctx!.state() === 'minimal';
	// **His file is never silently ignored.** A broken arrangement draws the register's own
	// neighborhoods and says exactly why, with the path, so the fix is one edit away.
	if (snap.arrangement.error) host.append(el('p', 'quiet prose sp-bad', `arrangement not used — ${snap.arrangement.error}`));

	const { tree, unfiled } = arrange(spacesOf(snap), snap.register.buildings);

	// Minimal is one word and a mark (keel §3): his top-level spaces, each carrying its own members'
	// liveness, and nothing else. A 12%-wide track cannot hold a nest and must not pretend to.
	if (minimal) {
		for (const n of tree) {
			const h = el('div', 'nb-h sp-h');
			h.append(el('span', 'nb-name', n.space.name),
				dots(sidsOf(n).map(id => live.get(id)).filter((x): x is DeckSession => !!x)));
			host.append(h);
		}
		if (unfiled.length) {
			const h = el('div', 'nb-h sp-h');
			h.append(el('span', 'nb-name', `unfiled · ${unfiled.length}`));
			host.append(h);
		}
		return;
	}

	host.append(toolbar(snap.arrangement.his));
	const list = el('div', 'sp-tree');
	list.dataset['arrInto'] = '';                   // the root: a drop out here files at the top level
	for (const n of tree) list.append(spaceNode(n, live, stale, 0, snap.queue));
	host.append(list);

	// **Nothing the census knows can be absent from the view** (spec §1). A building he has never
	// filed is drawn here, loudest first, and one drag files it.
	if (unfiled.length) {
		const tail = el('section', 'nb sp sp-unfiled');
		const th = el('div', 'nb-h sp-h');
		th.dataset['arrUnfile'] = 'yes';
		th.append(el('span', 'nb-name', `unfiled · ${unfiled.length}`));
		tail.append(th);
		for (const b of unfiled) {
			const n: Drawn = {
				space: { id: `u:${b.building}`, name: b.building, color: null, type: null, binding: b.building, children: [] },
				building: b, missing: false, loud: b.attention, children: [],
			};
			const row = spaceNode(n, live, stale, 0, snap.queue, false);
			row.dataset['arrUnbound'] = b.building;   // it has no space yet: a drag files it, never moves it
			tail.append(row);
		}
		host.append(tail);
	}

	host.append(legend());
	const a = snap.auditor;
	host.append(el('p', 'quiet prose', c.present
		? `${c.beats} beats · ${c.malformed} unreadable · horizon ${c.since === null ? 'unknown' : ago(c.since) + ' back'}`
			+ ` — every count here is a floor, not a total`
		: 'no census file: the sensor is not deployed on this machine'));
	host.append(el('p', 'quiet prose', `${c.live} tracked · `
		+ (a.visible === null ? 'no process auditor — ps did not answer' : `≈${a.visible} claude processes visible · ${Math.max(0, a.visible - c.live)} beyond the census`)
		+ ` (taken ${ago(a.at)} ago — the sensor's drift alarm, never a session)`));
	host.append(el('p', 'quiet prose', `${snap.register.buildings.length} buildings · register ${ago(snap.register.at / 1000)} old`
		+ (snap.register.refreshing ? ' (re-walking)' : '') + (snap.register.error ? ` · ${snap.register.error}` : '')));
	host.append(el('p', 'quiet prose', snap.arrangement.his
		? 'the City is in your arrangement — spaces, from desk/city-arrangement.json; attention still outranks your order, so a space is as loud as its loudest member'
		: 'the City is in the register\'s own neighborhoods, grouped by parent directory and ordered by their loudest member — arrange it and this becomes yours'));
	// cmux is truth for live identity (D16), so the deck says when it last heard from it.
	const id = snap.identity;
	host.append(el('p', `quiet prose${stale ? ' stale-note' : ''}`, stale
		? `live identity STALE — ${id.error} (last read ${ago(id.at)} ago; names below are that copy)`
		: `${id.workspaces} cmux workspaces named · identity read ${ago(id.at)} ago — cmux is truth for names and colours`));
}

// ---------- his gestures ----------

const post = async (path: string, body: unknown): Promise<{ ok: boolean; error?: string }> => {
	const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return await r.json() as { ok: boolean; error?: string };
};

/**
 * One write of the whole arrangement. The snapshot's copy is updated first so the pane repaints at
 * once and the drag lands where he let go of it; the file is the state, and the next poll reads it
 * back — so a refusal shows up as the arrangement snapping back, with the reason printed beside the
 * toggle rather than swallowed.
 */
async function keep(spaces: Space[]): Promise<void> {
	const snap = ctx!.snapshot();
	if (!snap) return;
	snap.arrangement = { spaces, his: true, error: null };
	ctx!.redraw();
	try {
		const r = await post('/desk/arrangement', { spaces });
		say(OUT, r.ok ? 'arrangement saved' : `refused: ${r.error ?? 'unknown'}`);
	}
	catch (e) { say(OUT, String(e)); }
}

/** Apply one pure edit and write it, or print the refusal. Nothing here changes on a refusal. */
function apply(out: { ok: true; result: Space[] } | { ok: false; error: string }): void {
	if (!out.ok) { say(OUT, `refused: ${out.error}`); return; }
	void keep(out.result);
}

const current = (): Space[] => {
	const snap = ctx!.snapshot();
	return snap === null ? [] : spacesOf(snap);
};

/**
 * The City's clicks. Returns true where it handled one, so the shell's own click chain — the
 * building selection, the pane's click-to-expand — is only reached by clicks this pane did not
 * claim. One handler, one place, no listener per row.
 */
export function cityClick(target: Element): boolean {
	if (!ctx) return false;

	const toggle = target.closest<HTMLElement>('[data-arr-toggle]');
	if (toggle) {
		arranging = !arranging;
		if (!arranging) editing = null;
		remember(ARRANGE_KEY, arranging);
		ctx.redraw();
		return true;
	}

	const caret = target.closest<HTMLElement>('[data-arr-shut]');
	if (caret) { toggleShut(caret.dataset['arrShut'] ?? ''); return true; }

	if (!arranging) return false;                   // no mode, no editing: the rest is arrange-only

	const pick = target.closest<HTMLElement>('[data-arr-edit]');
	if (pick) {
		const id = pick.dataset['arrEdit'] ?? '';
		editing = editing === id ? null : id;
		ctx.redraw();
		return true;
	}

	const add = target.closest<HTMLElement>('[data-arr-add]');
	if (add) {
		const into = add.dataset['arrAdd'] ?? '';
		const out = mintGroup(current(), into === '' ? null : into, 'new space');
		if (!out.ok) { say(OUT, `refused: ${out.error}`); return true; }
		editing = out.result.id;
		void keep(out.result.spaces);
		return true;
	}

	const color = target.closest<HTMLElement>('[data-arr-color]');
	if (color) {
		const intent = color.dataset['intent'] ?? '';
		apply(editSpace(current(), color.dataset['arrColor'] ?? '', { color: intent === '' ? null : intent as SpaceColor }));
		return true;
	}

	const gone = target.closest<HTMLElement>('[data-arr-drop]');
	if (gone) {
		if (editing === gone.dataset['arrDrop']) editing = null;
		apply(dropNode(current(), gone.dataset['arrDrop'] ?? ''));
		return true;
	}

	// A click on a row while arranging aims the strip at it rather than selecting the building: the
	// pane is in a different mode and a click that did two things would be the ambiguous one.
	const row = target.closest<HTMLElement>('.sp-h');
	if (row && !target.closest('input')) {
		const id = row.closest<HTMLElement>('[data-arr-id]')?.dataset['arrId'] ?? null;
		if (id !== null) { editing = editing === id ? null : id; ctx.redraw(); return true; }
	}
	return false;
}

/** The key a half-written value is held under while he types (§typing). */
const boxKey = (box: HTMLInputElement): string | null =>
	box.dataset['arrName'] !== undefined ? `name:${box.dataset['arrName']}`
	: box.dataset['arrType'] !== undefined ? `type:${box.dataset['arrType']}`
	: null;

/** A keystroke in a name or type box: held, never written — one POST per word would be absurd. */
export function cityTyped(box: EventTarget | null): boolean {
	if (!arranging || !(box instanceof HTMLInputElement)) return false;
	const key = boxKey(box);
	if (key === null) return false;
	typing.set(key, box.value);
	return true;
}

/** His word on a name or a type, committed — on Enter, or on leaving the box. */
export function cityCommit(box: EventTarget | null): boolean {
	if (!ctx || !arranging || !(box instanceof HTMLInputElement)) return false;
	const key = boxKey(box);
	if (key === null) return false;
	typing.delete(key);
	const id = key.slice(key.indexOf(':') + 1);
	apply(editSpace(current(), id, key.startsWith('name:') ? { name: box.value } : { type: box.value }));
	return true;
}

// ---------- the drag ----------
//
// Pointer events rather than HTML5 drag-and-drop, deliberately: a `dragstart` payload is a
// negotiation with the OS, it cannot be driven by a probe's mouse, and the deck already owns every
// pixel it would cross. This is three listeners on the pane, no library, and a camera probe can
// drive it exactly the way his hand does (`camera/probes/city-arrange.probe.ts`).

type Held = { id: string; building: string | null; x: number; y: number; moved: boolean };
let held: Held | null = null;

const clearOver = (): void => {
	for (const e of document.querySelectorAll<HTMLElement>('[data-arr-over]')) e.removeAttribute('data-arr-over');
};

/** Where the pointer is, as a drop: into a space, before a node, or out to the unfiled tail. */
function dropAt(x: number, y: number): HTMLElement | null {
	const at = document.elementFromPoint(x, y);
	if (!at) return null;
	return at.closest<HTMLElement>('[data-arr-into], [data-arr-unfile]');
}

export function cityDrag(pane: HTMLElement): void {
	pane.addEventListener('pointerdown', e => {
		if (!arranging) return;
		const g = (e.target as Element | null)?.closest<HTMLElement>('[data-arr-grip]');
		if (!g) return;
		const node = g.closest<HTMLElement>('[data-arr-id]');
		if (!node) return;
		held = {
			id: node.dataset['arrId'] ?? '',
			building: node.dataset['arrUnbound'] ?? null,
			x: e.clientX, y: e.clientY, moved: false,
		};
		pane.setPointerCapture(e.pointerId);
		e.preventDefault();
	});

	pane.addEventListener('pointermove', e => {
		if (!held) return;
		if (!held.moved && Math.abs(e.clientX - held.x) + Math.abs(e.clientY - held.y) < 4) return;
		held.moved = true;
		document.body.dataset['arrDragging'] = 'yes';
		clearOver();
		const over = dropAt(e.clientX, e.clientY);
		if (over && !over.closest(`[data-arr-id="${CSS.escape(held.id)}"]`)) over.dataset['arrOver'] = 'yes';
	});

	const finish = (e: PointerEvent): void => {
		const was = held;
		held = null;
		delete document.body.dataset['arrDragging'];
		clearOver();
		if (!was || !was.moved) return;
		const over = dropAt(e.clientX, e.clientY);
		if (!over) return;
		// Dropping something onto its own subtree is not a move; `moveNode` refuses it by name, and
		// the pointer never gets to say it did nothing.
		const spaces = current();

		// Out to the tail: the space is taken off the arrangement and the building goes back to
		// unfiled. Something already there needs no write at all.
		if (over.dataset['arrUnfile'] !== undefined) {
			if (was.building === null) apply(dropNode(spaces, was.id));
			return;
		}
		// A drop on a space's own header is "put it in here"; a drop on a bound row is "sit before
		// this one", because a building is a place in a list rather than a container he thinks in.
		const onBound = over.closest<HTMLElement>('.sp-bound') !== null;
		const target = over.dataset['arrInto'] ?? '';
		if (onBound) {
			const site = siteOfId(spaces, target);
			if (!site) { say(OUT, `refused: ${target} is no longer in your arrangement`); return; }
			apply(was.building === null
				? moveNode(spaces, was.id, site.parent, site.at)
				: bindBuilding(spaces, was.building, site.parent, site.at));
			return;
		}
		const into = target === '' ? null : target;
		apply(was.building === null
			? moveNode(spaces, was.id, into, Number.MAX_SAFE_INTEGER)
			: bindBuilding(spaces, was.building, into, Number.MAX_SAFE_INTEGER));
	};

	pane.addEventListener('pointerup', finish);
	pane.addEventListener('pointercancel', finish);
}

/** Where a node sits: its parent's id (null at the root) and its index. The drop's own arithmetic. */
function siteOfId(spaces: readonly Space[], id: string): { parent: string | null; at: number } | null {
	const look = (list: readonly Space[], parent: string | null): { parent: string | null; at: number } | null => {
		const at = list.findIndex(s => s.id === id);
		if (at >= 0) return { parent, at };
		for (const s of list) {
			const found = look(s.children, s.id);
			if (found) return found;
		}
		return null;
	};
	return look(spaces, null);
}
