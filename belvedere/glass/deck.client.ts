// The deck, client side: the whole app. Bundled by `Bun.build` at server start and served as
// `/deck.js` — no framework, no CDN, nothing off this origin (keel §9, D54).
//
// What lives here is exactly what needs a browser: the layout the user is holding, the drawer, the
// tooltip primitive, the poll, and the wiring between them. The *law* of space lives in
// `deck-model.ts` so the server's resting render and this file's re-render cannot disagree; the
// tenants live behind `deck-view.ts` so B15+ move in without touching this file; and what the City
// and the queue *mean* lives in `attention.ts`, server-side, where the files are — this file draws
// what it is handed and computes no urgency of its own.
//
// **Nothing here can fire.** The wires a click may reach are `POST /inbox` (his word, one file
// append), `POST /hands/focus` (his eyes, a jump) and B18's two write-throughs, `POST /hands/rename`
// and `POST /hands/recolor` (cmux display state, D18 class 2 — a name and a colour, never a session).
// The spawning hand is unreachable from this file, and its path is not spelled here so a grep can
// say so (D10).
//
// **Amended at B17:** exactly one client file may reach that hand — `composer.client.ts`, which is
// what Action holds at rest (keel §3). So the served bundle carries the path once, and the check
// that keeps this honest moved from "the bundle contains it zero times" to "which SOURCE contains
// it" — strictly stronger, because it names the one file allowed to (B17 F1).

import {
	ATTENTION, bump, columns, PANES, RESTING, toLayout,
	type Attention, type DeckBuilding, type Decoded, type DeckSession, type DeckSnapshot,
	type Layout, type Pane, type PaneState, type QueueItem,
} from './deck-model';
import { selection, swap, tenant, tenants, viewer, type FocusView } from './deck-view';
import {
	ago, button, chatButton, DEPTH_CAP, dot, dots, el, forget, named, need, paint, reading, receipt,
	receipts, remember, remembered, say, stamp, tick, tipSession, words, type DecodeCtx,
} from './deck-dom';
import { SWATCHES } from './colors';
// The Workshop signs its lease on import (B15). It is imported for that effect and for nothing
// else: a tenant reaches the deck through `deck-view.ts` and never through this file.
import './workshop.client';
// The Works signs its lease the same way (B10) — imported for the effect, never reached into.
import './works.client';
// The Chat (B16) signs its lease on import too; `chatTo` is the one function it exposes, because
// "one chat view in the whole deck" is only true if every session row on the deck reaches it here.
import { chat, chatAt, chatTo } from './chat.client';
// The Grep (B21) is not a tenant: it is what the one drawer draws when Felix has asked it something,
// so its state and its rendering live in their own module and its three jumps are wired below.
import {
	clearGrep, drawResults, grepAnswer, grepRunning, grepSignature, jumpFrom, runGrep, wireGrep,
} from './grep.client';
// The desk (B19) signs its lease the same way, and is imported last so the tenant bar reads in the
// identity sentence's own order: dataviz, command, comms, then the place he writes.
import { deskTo } from './desk.client';

// ---------- what the deck is holding ----------

const LAYOUT_KEY = 'belvedere.deck.layout';
const FOCUS_KEY = 'belvedere.deck.focus';
const BUILDING_KEY = 'belvedere.deck.building';
const SESSION_KEY = 'belvedere.deck.session';

let layout: Layout = remembered(LAYOUT_KEY, toLayout) ?? { ...RESTING };
let snapshot: DeckSnapshot | null = null;
let standing: FocusView | null = null;

selection.building = remembered(BUILDING_KEY, v => (typeof v === 'string' ? v : null));
selection.session = remembered(SESSION_KEY, v => (typeof v === 'string' ? v : null));

// ---------- the law of space, applied ----------

const app = need('app');
const drawer = need('drawer');
const scrim = need('scrim');
const pulse = need('pulse');
const needsCount = need('needs');
const drawerName = need('drawer-name');
const drawerQueue = need('drawer-queue');
const grepInput = need<HTMLInputElement>('grep-q');

/**
 * What the one drawer is showing (keel §3: there is one drawer, and it is pinnable). Its default is
 * the ⬡-queue (D15); a search puts the results in it and `⬡-queue` puts the queue back.
 * One overlay, two contents — not a second drawer, because a second drawer is a second thing to shut.
 */
let drawerShows: 'queue' | 'grep' = 'queue';

const paneOf = (p: Pane) => need(`pane-${p}`);
const hostOf = (p: Pane | 'drawer') => need(`host-${p}`);

/**
 * The whole of the deck's geometry, in one place: one `grid-template-columns` from the model, one
 * `data-state` per pane, and the drawer's three states. Called after every change — cheap enough
 * that nothing needs to know which knob moved.
 */
function apply(): void {
	app.style.gridTemplateColumns = columns(layout);
	for (const p of PANES) {
		const pane = paneOf(p);
		pane.dataset['state'] = layout[p];
		for (const b of pane.querySelectorAll<HTMLElement>('[data-set-state]'))
			b.dataset['on'] = b.dataset['setState'] === layout[p] ? 'yes' : 'no';
	}
	drawer.dataset['state'] = layout.drawer;
	scrim.hidden = layout.drawer !== 'open';
	remember(LAYOUT_KEY, layout);
	redraw();
}

const setState = (p: Pane, s: PaneState): void => { layout[p] = s; apply(); };

// ---------- the Focus tenant (the seam, driven) ----------

/**
 * Swap the tenant standing in Focus. The old one is unmounted before the hosts are emptied — a
 * tenant that holds a timer gets its chance to clear it, which is the whole reason `unmount` is on
 * the interface.
 */
function focusOn(name: string): void {
	const next = tenant(name);
	if (!next || next === standing) return;
	if (standing) standing.unmount();
	const focus = hostOf('focus'), action = hostOf('action');
	focus.textContent = '';
	action.textContent = '';
	// Emptying a host falsifies every repaint memo about it, so the memos are retracted here rather
	// than left to be believed by the next tenant (B19: a tenant swapped away and back with nothing
	// changed found its own memo standing and drew nothing — a blank pane with no error).
	forget(focus);
	forget(action);
	standing = next;
	next.mount(focus, action);
	drawTenantBar();
	remember(FOCUS_KEY, name);
	redraw();
}

/**
 * The seam's swap cell, registered once (B10): a tenant that needs another tenant's surface — the
 * Works handing a landing record's reference to the Workshop's viewer — asks the shell here rather
 * than reaching across. One direction, one registry.
 */
swap.to = focusOn;

/** The swap control, in the Focus pane's head: one button per signed tenant, never a dropdown. */
function drawTenantBar(): void {
	const head = paneOf('focus').querySelector('.pane-head');
	if (!head) return;
	const name = head.querySelector('.pane-name');
	if (name) name.textContent = standing ? standing.title : 'focus';
	head.querySelector('.tenants')?.remove();
	const bar = el('span', 'tenants');
	for (const t of tenants()) {
		const b = el('button', 'st wide', t.name) as HTMLButtonElement;
		b.type = 'button';
		b.dataset['focusOn'] = t.name;
		b.dataset['on'] = t === standing ? 'yes' : 'no';
		b.dataset['tip'] = `focus: ${t.title}`;
		b.dataset['tipMore'] = `states this tenant declares — ${t.states.join(', ')}`;
		bar.append(b);
	}
	head.insertBefore(bar, head.querySelector('.states'));
}

// Repainting is content, not clocks: `paint()` lives in `deck-dom.ts` so every tenant shares one
// gate. A region is rebuilt only when what it *says* has changed — a drawer that rebuilds every
// three seconds eats the note Felix is halfway through typing (B14 F4).

// ---------- the City (Context's one tenant, keel §3) ----------

const BADGE_WORD: Readonly<Record<Attention, string>> = {
	waiting: 'blocked on you', gate: '⬡-gate', countersign: 'blessing', escalation: 'escalation',
};

function badges(b: DeckBuilding): HTMLElement {
	const box = el('span', 'badges');
	for (const k of ATTENTION) {
		if (!b.badges[k]) continue;
		const pip = el('span', `badge b-${k}`, String(b.badges[k]));
		pip.title = `${b.badges[k]} × ${BADGE_WORD[k]}`;
		box.append(pip);
	}
	return box;
}

/** Everything has a limit: a building with thirty open gates gets a tooltip, not a transcript. */
const TIP_ITEMS = 4;

function buildingRow(b: DeckBuilding, mine: DeckSession[], wants: QueueItem[]): HTMLElement {
	const row = el('li', 'row' + (b.building === selection.building ? ' on' : ''));
	row.dataset['building'] = b.building;
	row.dataset['tip'] = b.building;
	// **What** wants him, by name, rather than how many: the badge already carries the count, and a
	// name is the encapsulation law's own answer to "2 ⬡-gate". It is corpus prose, so the City's
	// tooltip decodes exactly like the Workshop's (B20 §5).
	const named = wants.slice(0, TIP_ITEMS).map(i => i.name);
	row.dataset['tipMore'] = `${b.path} · ${b.live} live · `
		+ (named.join(' · ') || 'nothing waiting on you')
		+ (wants.length > named.length ? ` · +${wants.length - named.length} more` : '');
	row.dataset['tipIn'] = b.path;
	row.dataset['tipGo'] = `/b/${b.building.split('/').map(encodeURIComponent).join('/')}`;
	row.append(dots(mine), el('span', 'name', b.building), badges(b));
	return row;
}

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

const LEGEND: [string, string, string?][] = [
	['dot s-working', 'working'],
	['dot s-idle', 'idle'],
	['dot s-unknown', 'unknown — no pid to ask'],
	['dot s-idle w-blocked', 'blocked — a permission prompt is waiting'],
	['dot s-idle w-nagging', 'waiting for your input — the session said so'],
	['badge b-waiting', 'blocked on you'],
	['badge b-gate', '⬡-gate on a live charge'],
	['badge b-countersign', 'decision waiting on your pen'],
	['badge b-escalation', 'escalation raised, nothing says it was ruled'],
	// B18's three: cmux owns the first two, and the third says the socket stopped answering.
	['swatch legend-swatch', 'the colour cmux is wearing — the swatch row recolours it', ' '],
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

/**
 * Context is the City and always the City (keel §3). Three states, exactly as the order writes
 * them: minimal = neighborhoods and dots, typical = + the buildings and their badges, expanded =
 * + the sessions themselves.
 *
 * **Attention outranks recency across the whole pane** — the server sorted the buildings by rank
 * and the groups inherit their loudest member's place in that list, so a building that has been
 * asking for a week still sits above the one somebody touched five minutes ago.
 */
function drawCity(host: HTMLElement): void {
	if (!snapshot) { host.append(el('p', 'quiet', 'waiting for the first poll…')); return; }
	const c = snapshot.census;
	const stale = snapshot.identity.error !== null;
	const live = c.sessions.filter(s => s.state !== 'gone');
	const bySid = new Map(live.map(s => [s.sid, s]));

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

	// Groups in the order the sorted building list produces them: a neighborhood is exactly as
	// loud as its loudest building, which is one sort rather than two that can disagree.
	const groups: { label: string; buildings: DeckBuilding[] }[] = [];
	for (const b of snapshot.register.buildings) {
		const last = groups.at(-1);
		if (last && last.label === b.label) last.buildings.push(b);
		else groups.push({ label: b.label, buildings: [b] });
	}

	for (const g of groups) {
		const box = el('section', 'nb');
		const lit = g.buildings.flatMap(b => b.sids.map(id => bySid.get(id)).filter((s): s is DeckSession => !!s));
		const h = el('div', 'nb-h');
		h.append(el('span', 'nb-name', g.label), dots(lit));
		box.append(h);

		if (layout.context !== 'minimal') {
			const list = el('ul', 'rows');
			for (const b of g.buildings) {
				const mine = b.sids.map(id => bySid.get(id)).filter((s): s is DeckSession => !!s);
				list.append(buildingRow(b, mine, snapshot.queue.filter(i => i.building === b.building)));
				if (layout.context === 'expanded' && mine.length) list.append(sessionLines(mine, stale));
			}
			box.append(list);
		}
		host.append(box);
	}

	if (layout.context === 'minimal') return;                // one word and a mark, and that is the law

	host.append(legend());
	const a = snapshot.auditor;
	host.append(el('p', 'quiet prose', c.present
		? `${c.beats} beats · ${c.malformed} unreadable · horizon ${c.since === null ? 'unknown' : ago(c.since) + ' back'}`
			+ ` — every count here is a floor, not a total`
		: 'no census file: the sensor is not deployed on this machine'));
	host.append(el('p', 'quiet prose', `${c.live} tracked · `
		+ (a.visible === null ? 'no process auditor — ps did not answer' : `≈${a.visible} claude processes visible · ${Math.max(0, a.visible - c.live)} beyond the census`)
		+ ` (taken ${ago(a.at)} ago — the sensor's drift alarm, never a session)`));
	host.append(el('p', 'quiet prose', `${snapshot.register.buildings.length} buildings · register ${ago(snapshot.register.at / 1000)} old`
		+ (snapshot.register.refreshing ? ' (re-walking)' : '') + (snapshot.register.error ? ` · ${snapshot.register.error}` : '')));
	// cmux is truth for live identity (D16), so the deck says when it last heard from it. A read that
	// failed keeps the last good copy on screen, marked `stale` on every name it gave — never blanked,
	// never refreshed by guesswork.
	const id = snapshot.identity;
	host.append(el('p', `quiet prose${stale ? ' stale-note' : ''}`, stale
		? `live identity STALE — ${id.error} (last read ${ago(id.at)} ago; names below are that copy)`
		: `${id.workspaces} cmux workspaces named · identity read ${ago(id.at)} ago — cmux is truth for names and colours`));
}

function drawContext(): void {
	const host = hostOf('context');
	const sig = snapshot === null ? 'cold' : JSON.stringify([
		layout.context, selection.building, snapshot.register.buildings, snapshot.auditor.visible,
		snapshot.register.refreshing, snapshot.register.error,
		snapshot.census.present, snapshot.census.beats, snapshot.census.malformed, snapshot.census.since,
		snapshot.census.sessions, snapshot.identity.error, snapshot.identity.workspaces,
	]);
	paint('context', host, sig, drawCity);
}

// ---------- the ⬡-queue (the drawer's tenant, D15) ----------

/**
 * What a rebuild must not destroy. The queue is the one place on the deck where Felix *types*, so
 * an unsent note, an open disclosure and the line a gesture just filed all outlive their DOM.
 * Keyed by the item's own stable key, so an item that leaves the queue drops its draft with it.
 */
const drafts = new Map<string, string>();
const opened = new Set<string>();

const QUEUE_TONE: Readonly<Record<Attention, string>> = {
	waiting: 'red', gate: 'purple', countersign: 'yellow', escalation: 'orange',
};

/** The note box: one append to that building's ISSUES, exactly B6's gesture and nothing more. */
function noteBox(i: QueueItem): HTMLElement {
	const box = el('details', 'qnote');
	box.append(el('summary', '', 'note'));
	const area = el('textarea', 'prose') as HTMLTextAreaElement;
	area.rows = 2;
	area.spellcheck = true;
	area.placeholder = 'his word, one line — it lands as written';
	area.dataset['noteFor'] = i.key;
	area.value = drafts.get(i.key) ?? '';
	const file = el('button', 'st wide', 'file it') as HTMLButtonElement;
	file.type = 'button';
	file.dataset['gesture'] = JSON.stringify({ building: i.path, kind: 'note' });
	const acts = el('div', 'qacts');
	acts.append(file);
	box.append(area, acts);
	if (opened.has(`note:${i.key}`)) (box as HTMLDetailsElement).open = true;
	box.dataset['openKey'] = `note:${i.key}`;
	return box;
}

function actions(i: QueueItem): HTMLElement {
	const acts = el('div', 'qacts');

	if (i.kind === 'countersign' && i.state === 'pending' && i.decision) {
		const b = el('button', 'st wide', `bless ${i.decision}`) as HTMLButtonElement;
		b.type = 'button';
		b.dataset['gesture'] = JSON.stringify({ building: i.path, kind: 'countersign', decision: i.decision });
		b.dataset['reload'] = 'yes';
		acts.append(b);
	}
	// The pane jump and the Chat are two questions since C16, and a paused engine step answers only
	// the second: it is headless by construction, so there is no panel to put his eyes on.
	if (i.kind === 'waiting' && i.sid) {
		const b = el('button', 'st wide', 'jump to pane') as HTMLButtonElement;
		b.type = 'button';
		b.dataset['jumpSid'] = i.sid;
		acts.append(b);
	}
	// Hotswap entry point #3: the queue's whole complaint was *"I don't see that anywhere in
	// Belvedere"* — now a blocked session, or a step the engine is holding, is read and answered
	// without leaving the deck (B16 §1, C16 §3).
	if (i.chat) acts.append(chatButton(i.chat, 'read this session and answer it here'));
	if (i.jump) {
		const a = el('a', 'st wide', 'open') as HTMLAnchorElement;
		a.href = i.jump;
		acts.append(a);
	}
	const out = el('span', 'out', receipt(i.key));
	out.dataset['outFor'] = i.key;
	acts.append(out);
	return acts;
}

function queueItem(i: QueueItem): HTMLElement {
	const li = el('li', `qi tone-${QUEUE_TONE[i.kind]}`);
	li.dataset['key'] = i.key;
	li.dataset['kind'] = i.kind;

	// The queue's words are the corpus's words, so its code words decode against the document each
	// item was written in (B20 §5: the tenants inherit the seam, they do not each own a detector).
	const ctx = reading(i.doc);

	const head = el('div', 'qi-h');
	head.append(el('span', `pill tone-${QUEUE_TONE[i.kind]}`, i.kind === 'waiting' ? 'blocked on you' : i.kind));
	const qname = el('span', 'qname');
	words(qname, i.name, ctx);
	head.append(qname);
	if (i.at !== null) head.append(stamp(i.at, 'ago when'));
	li.append(head);

	const where = el('div', 'qwhere');
	where.append(el('span', 'who', i.building), el('span', '', i.where));
	li.append(where);
	li.append(actions(i));

	// Every item's [expand] reveals something the head does not: at minimum the honest note about
	// what can and cannot be done from here. The full text is added only where the name did not
	// already carry it (B9's furniture rule — a disclosure over nothing is furniture).
	const more = el('details', 'more');
	more.append(el('summary', '', 'expand'));
	if (!i.name.endsWith(i.full)) {
		const full = el('p', 'prose');
		words(full, i.full, ctx);
		more.append(full);
	}
	const note = el('p', 'quiet prose');
	words(note, i.note, ctx);
	more.append(note);
	if (i.kind === 'gate' || i.kind === 'escalation') more.append(noteBox(i));
	if (opened.has(i.key)) (more as HTMLDetailsElement).open = true;
	more.dataset['openKey'] = i.key;
	li.append(more);
	return li;
}

function drawQueue(host: HTMLElement): void {
	if (!snapshot) { host.append(el('p', 'quiet', 'waiting for the first poll…')); return; }
	const q = snapshot.queue;
	host.append(el('p', 'label', q.length
		? `${q.length} thing${q.length === 1 ? '' : 's'} need you — attention first, recency inside it`
		: 'the ⬡-queue is empty'));
	if (!q.length) {
		host.append(el('p', 'quiet prose',
			'No blocked session, no live ⬡-gate, no pending blessing, no unruled escalation anywhere on the register. Every count on this deck is a floor (the census horizon) — the City says how far back it can see.'));
		return;
	}
	const list = el('ul', 'queue');
	for (const i of q) list.append(queueItem(i));
	host.append(list);
	host.append(el('p', 'quiet prose',
		'Nothing here ignites anything (D10): a note and a blessing are one append to that building’s inbox, a jump moves your eyes, and chat opens that session in the one Chat view — where a reply is delivered as a real user turn, verified after the fact (B16).'));
}

function drawDrawer(): void {
	const host = hostOf('drawer');
	drawerName.textContent = drawerShows === 'grep' ? 'results' : '⬡-queue';
	drawerQueue.hidden = drawerShows !== 'grep';
	if (drawerShows === 'grep') {
		paint('drawer', host, `grep ${layout.drawer} ${grepSignature()}`, h => drawResults(h, snapshot));
		needsCount.textContent = snapshot ? String(snapshot.queue.length) : '·';
		needsCount.dataset['needs'] = snapshot ? String(snapshot.queue.length) : '';
		return;
	}
	const sig = snapshot === null ? 'cold' : JSON.stringify([layout.drawer, snapshot.queue]);
	// Everything has a limit (directive 3.1): held state belongs to items that still exist, so an
	// item answered and gone takes its draft, its disclosure and its receipt with it.
	if (snapshot) {
		const alive = new Set(snapshot.queue.flatMap(i => [i.key, `note:${i.key}`]));
		for (const k of [...drafts.keys()]) if (!alive.has(k)) drafts.delete(k);
		for (const k of [...opened]) if (!alive.has(k)) opened.delete(k);
		// Receipts are shared with the Workshop now, so only the queue's OWN keys are the queue's to
		// drop: a jump reported in another pane is not this pane's to forget.
		for (const k of [...receipts.keys()]) if (QUEUE_KEY.test(k) && !alive.has(k)) receipts.delete(k);
	}
	// The focused note survives its own region's rebuild, caret and all.
	const active = document.activeElement as HTMLTextAreaElement | null;
	const held = active?.dataset?.['noteFor'] ?? null;
	const caret = held ? active!.selectionStart : 0;
	paint('drawer', host, sig, drawQueue);
	if (held) {
		const back = host.querySelector<HTMLTextAreaElement>(`[data-note-for="${CSS.escape(held)}"]`);
		if (back && back !== document.activeElement) { back.focus(); back.setSelectionRange(caret, caret); }
	}
	needsCount.textContent = snapshot ? String(snapshot.queue.length) : '·';
	needsCount.dataset['needs'] = snapshot ? String(snapshot.queue.length) : '';
}

/**
 * One redraw of everything the deck is holding — and, when the standing tenant has started wanting
 * a *different* answer from the server (a building clicked, a pane opened past minimal, a tenant
 * swapped in), one immediate poll. Without it a click would sit on last poll's data for up to three
 * seconds; with it, the next `redraw` sees the same query and asks for nothing.
 */
let lastQuery: string | null = null;

function redraw(): void {
	drawContext();
	drawDrawer();
	standing?.draw(snapshot, layout.focus, layout.action);
	const q = query();
	if (q !== lastQuery && q !== '') { lastQuery = q; void poll(); }
	else lastQuery = q;
}

// ---------- the tenants ----------
//
// All three have moved in: the Workshop (B15), the Works (B10) and the Chat (B16), each through
// `deck-view.ts` and each imported above for that effect alone. **There is no placeholder left** —
// B13's `placeholder()` and its "B16 evicts this the same way" note are gone with the last tenant
// they stood in for. The seam is exercised by the real ones now.
//
// `chat` is referenced here so the import is a value import rather than a bare side effect: the
// shell needs `chatTo` for the hotswap wire below, and one named import says so.
void chat;

// ---------- the drawer ----------

function setDrawer(next: Layout['drawer']): void { layout.drawer = next; apply(); }

need('drawer-toggle').addEventListener('click', () =>
	setDrawer(layout.drawer === 'shut' ? 'open' : 'shut'));
need('drawer-pin').addEventListener('click', () =>
	setDrawer(layout.drawer === 'pinned' ? 'open' : 'pinned'));
need('drawer-shut').addEventListener('click', () => setDrawer('shut'));
scrim.addEventListener('click', () => setDrawer('shut'));

// ---------- the Grep (B21): one box in the header, its results in the one drawer ----------

/**
 * The three jumps, registered once. Each lands in a surface that already exists — the Chat at the
 * turn, the Workshop's viewer at the line, the desk's editor at the note — so a result is never a
 * dead end and the Grep grows no viewer of its own.
 */
wireGrep({
	session: (sid, anchor) => {
		chatAt(sid, anchor);
		remember(SESSION_KEY, selection.session);
		openFocus();
	},
	doc: (building, path, line) => jumpTo(building, path, line),
	note: slug => { deskTo(slug); openFocus(); },
}, () => drawDrawer());

/** A jump into a pane closed to one word would land nowhere (the law of space: minimal is a rail). */
function openFocus(): void {
	if (layout.focus === 'minimal') { layout.focus = 'typical'; apply(); }
	else redraw();
}

function showResults(): void {
	drawerShows = 'grep';
	if (layout.drawer === 'shut') setDrawer('open');
	else drawDrawer();
}

function search(): void {
	const term = grepInput.value;
	showResults();
	void runGrep(term);
}

drawerQueue.addEventListener('click', () => { drawerShows = 'queue'; drawDrawer(); });

grepInput.addEventListener('keydown', e => {
	if (e.key === 'Enter') { e.preventDefault(); search(); return; }
	if (e.key !== 'Escape') return;
	// Escape empties the box and gives the drawer back to the queue: one key, the whole way out.
	e.preventDefault();
	grepInput.value = '';
	clearGrep();
	drawerShows = 'queue';
	grepInput.blur();
	drawDrawer();
});

/** A results drawer reopened by the toggle is still the results, so the box and the drawer agree. */
grepInput.addEventListener('focus', () => { if (grepAnswer() || grepRunning()) showResults(); });

/**
 * `/` and ⌘K both, pre-chewed (spec §3). `/` is only a shortcut where he is not already typing — a
 * slash inside the desk's editor or the Chat's draft is a slash.
 */
document.addEventListener('keydown', e => {
	// A keydown's target is not always an Element — with nothing focused it can be the document
	// itself, which has no `closest`, and a throw here would take the whole shortcut out silently.
	const from = e.target instanceof Element ? e.target : null;
	const inField = from?.closest('input, textarea, [contenteditable]') != null;
	const chord = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
	if (!chord && (e.key !== '/' || inField || e.metaKey || e.ctrlKey || e.altKey)) return;
	e.preventDefault();
	grepInput.focus();
	grepInput.select();
});

// ---------- the tooltip primitive ----------
//
// Instant on hover, because a tooltip that waits is a tooltip Felix has already moved past. Held
// or clicked, it expands into `data-tip-more` plus its actions and becomes pointer-interactive so
// those actions can be taken. Escape dismisses, always.
//
// **B20 makes it a stack.** A tooltip's own body passes through the decoder, so a hover inside one
// opens the next — three layers and no fourth, and the cap is enforced where the spans are *made*
// (`words()` draws none at depth 3), not where they are hovered: there is no fourth layer to
// refuse. Layer 0 is the shell's own `#tip`; deeper layers are minted and dropped with the chain.

const TIP_HOLD_MS = 450;
const tip = need('tip');

type Layer = { box: HTMLElement; anchor: HTMLElement; ctx: DecodeCtx };
const layers: Layer[] = [];
let hold = 0;

const boxAt = (depth: number): HTMLElement => {
	if (depth === 0) return tip;
	const box = el('div', 'tip');
	box.dataset['layer'] = String(depth);
	document.body.append(box);
	return box;
};

/** Unwind the chain to `depth` layers. Layer 0's box belongs to the shell, so it hides rather than dies. */
function popTo(depth: number): void {
	while (layers.length > depth) {
		const l = layers.pop()!;
		if (l.box === tip) { tip.hidden = true; tip.textContent = ''; tip.dataset['expanded'] = 'no'; }
		else l.box.remove();
	}
	if (depth === 0) clearTimeout(hold);
}

function placeTip(box: HTMLElement, host: HTMLElement): void {
	const r = host.getBoundingClientRect();
	const t = box.getBoundingClientRect();
	const left = Math.min(Math.max(4, r.left), Math.max(4, window.innerWidth - t.width - 4));
	const below = r.bottom + 6;
	box.style.left = `${left}px`;
	box.style.top = `${below + t.height > window.innerHeight ? Math.max(4, r.top - t.height - 6) : below}px`;
}

/**
 * What the text *inside* this tooltip decodes against: the document its anchor was written in, one
 * layer deeper, and every code word already open above it (the cycle guard, B20 §4).
 */
const ctxOf = (host: HTMLElement, depth: number): DecodeCtx => ({
	in: host.dataset['decodeIn'] ?? host.dataset['tipIn'] ?? null,
	depth: depth + 1,
	seen: (host.dataset['decodeSeen'] ?? '').split(' ').filter(s => s !== ''),
});

function showTip(host: HTMLElement, depth: number, expanded: boolean): void {
	popTo(depth);
	const box = boxAt(depth);
	const ctx = ctxOf(host, depth);
	const more = host.dataset['tipMore'] ?? '';
	box.textContent = '';
	box.append(el('div', 'tip-line', host.dataset['tip'] ?? ''));
	if (more && expanded) {
		const body = el('div', 'tip-more prose');
		words(body, more, ctx);
		box.append(body);
		const go = host.dataset['tipGo'];
		if (go) {
			const a = el('a', 'st wide', 'open') as HTMLAnchorElement;
			a.href = go;
			const acts = el('div', 'tip-actions');
			acts.append(a);
			box.append(acts);
		}
	}
	else if (more) box.append(el('div', 'tip-hint', 'hold for more'));
	if (expanded && host.dataset['tipSid']) box.append(tipControls(host.dataset['tipSid'], host.dataset['tipName'] ?? ''));
	box.dataset['expanded'] = expanded ? 'yes' : 'no';
	box.hidden = false;
	layers[depth] = { box, anchor: host, ctx };
	placeTip(box, host);
	// A code word's tooltip IS the resolved object, so the word itself is only what stands there
	// until the resolver answers — one localhost round trip, cached from then on.
	if (host.dataset['decode']) void fillDecode(host, box, ctx, expanded);
}

// ---------- the decoder's tooltip (B20 §3): encapsulation, status, jump, gestures ----------

/** Everything has a limit: the cache is a convenience, and a convenience that grows forever is a leak. */
const DECODED_CAP = 500;
const decoded = new Map<string, Decoded>();

const decodeKey = (host: HTMLElement): string => {
	const q = new URLSearchParams({ t: host.dataset['decode'] ?? '' });
	const where = host.dataset['decodeIn'];
	if (where) q.set('in', where);
	const word = host.dataset['decodeWord'];
	if (word) q.set('w', word);
	return q.toString();
};

async function askDecoder(key: string): Promise<Decoded> {
	const held = decoded.get(key);
	if (held) return held;
	const r = await fetch(`/deck/decode?${key}`, { headers: { accept: 'application/json' } });
	const d = await r.json() as Decoded;
	if (decoded.size >= DECODED_CAP) decoded.clear();
	decoded.set(key, d);
	return d;
}

async function fillDecode(host: HTMLElement, box: HTMLElement, ctx: DecodeCtx, expanded: boolean): Promise<void> {
	const key = decodeKey(host);
	let d: Decoded;
	try { d = await askDecoder(key); }
	catch (e) { d = { ok: false, label: host.dataset['decode'] ?? '', reason: String(e), candidates: [] }; }
	// The pointer may have moved on while the resolver was reading files: a tooltip that has already
	// been replaced must not be written into.
	if (!layers.some(l => l.box === box && l.anchor === host)) return;
	drawDecoded(box, d, ctx, expanded);
	placeTip(box, host);
}

function jumpTo(building: string | null, path: string, line: number | null): void {
	// The ontology is City → Building → Agent, so a jump moves the selection too: opening a row's
	// board in the viewer while the Workshop still shows another building would be two panes
	// disagreeing about where Felix is. A **null** building is a document the register houses in no
	// building (B21): the viewer opens it and the selection is left where it was, rather than cleared.
	if (building !== null) {
		selection.building = building;
		remember(BUILDING_KEY, building);
	}
	popTo(0);
	// A jump into a pane closed to one word would land nowhere: the law of space says minimal is a
	// rail, so opening a document in it means opening the pane too.
	if (layout.focus === 'minimal') layout.focus = 'typical';
	focusOn('workshop');
	viewer.open?.(path, line);
	apply();
}

function jumpButton(label: string, building: string, path: string, line: number | null): HTMLButtonElement {
	const b = button('st wide', label, path);
	b.addEventListener('click', () => jumpTo(building, path, line));
	return b;
}

/**
 * The object's live gestures — **gestures only, never fires** (B20 §3, D10). Both are B6's inbox
 * wire, and both show the bytes before the append: the countersign law is that he reads the line
 * he is signing, so the preview is the entry itself and the note's preview grows as he types.
 */
function gestureBox(d: Decoded & { ok: true }): HTMLElement {
	const box = el('div', 'tip-gestures');
	const key = `decode:${d.building}:${d.kind}:${d.id}`;
	for (const g of d.gestures) {
		if (g.kind === 'countersign') {
			const act = el('div', 'tip-gesture');
			act.append(el('p', 'quiet prose', 'one line into this building’s inbox — the deck records the blessing, it never pens the D-entry (D3):'));
			act.append(el('pre', 'preview', g.preview));
			const b = button('st wide', `bless ${g.decision}`, 'file this exact line');
			b.addEventListener('click', () => void file(key, { building: g.building, kind: 'countersign', decision: g.decision }));
			act.append(b);
			box.append(act);
		}
		else {
			const act = el('details', 'tip-gesture qnote');
			act.append(el('summary', '', 'note'));
			const area = el('textarea', 'prose') as HTMLTextAreaElement;
			area.rows = 2;
			area.spellcheck = true;
			area.placeholder = 'his word, one line — it lands as written';
			const preview = el('pre', 'preview', g.prefix);
			area.addEventListener('input', () => { preview.textContent = g.prefix + area.value; });
			const b = button('st wide', 'file it', 'append the line above');
			b.addEventListener('click', () => void file(key, { building: g.building, kind: 'note', text: area.value }));
			act.append(area, preview, b);
			box.append(act);
		}
	}
	const out = el('span', 'out', receipt(key));
	out.dataset['outFor'] = key;
	box.append(out);
	return box;
}

function drawDecoded(box: HTMLElement, d: Decoded, ctx: DecodeCtx, expanded: boolean): void {
	box.textContent = '';
	box.dataset['decoded'] = d.ok ? 'yes' : 'no';
	if (!d.ok) {
		// Unresolved says so and names what it looked at. A tooltip that guessed would be worse than
		// no tooltip at all — this is the whole of D10's family in one card.
		box.append(el('div', 'tip-line', `${d.label} — unresolved`));
		box.append(el('div', 'tip-more prose', d.reason));
		if (d.candidates.length) {
			const c = el('div', 'tip-cands');
			c.append(el('span', 'label', 'looked at'));
			for (const x of d.candidates) c.append(el('span', 'cand', x));
			box.append(c);
		}
		return;
	}
	const line = el('div', 'tip-line');
	line.append(el('span', 'dw-id', d.label), el('span', 'dw-name', d.headline));
	box.append(line);
	if (d.status) box.append(el('div', 'tip-status', `${d.status} · ${d.building}`));
	if (!expanded) { box.append(el('div', 'tip-hint', 'hold for the record, the jump and the gestures')); return; }

	const body = el('div', 'tip-more prose');
	// The object's OWN document is what its words resolve against — a `§7` cited by belvedere's D2
	// is belvedere's §7, not the §7 of whichever page happened to mention D2 (B20 §2).
	words(body, d.body, { ...ctx, in: d.doc });
	box.append(body);

	const acts = el('div', 'tip-actions');
	acts.append(jumpButton(`open ${d.where.label}:${d.where.line}`, d.building, d.where.path, d.where.line));
	if (d.plan) acts.append(jumpButton('the plan', d.building, d.plan.path, null));
	box.append(acts);
	if (d.gestures.length) box.append(gestureBox(d));
}

/**
 * The write-through controls, in the session's own expanded tooltip (B18 §2, D18 class 2): rename
 * inline, recolor from a swatch row of felikai's intents — the only values the map offers, so the
 * page cannot compose a colour cmux refuses (B3 F1 closed at the cause). Both are hands and both go
 * cold with the credential; the receipt says which, in cmux's own words.
 *
 * The controls exist only where the session has a cmux workspace to write to (`tipSession` sets the
 * dataset), so there is no button here that is guaranteed to 409.
 */
function tipControls(sid: string, current: string): HTMLElement {
	const box = el('div', 'tip-controls');

	const row = el('div', 'tip-rename');
	const input = el('input', 'tip-input') as HTMLInputElement;
	input.type = 'text';
	input.value = current;
	input.maxLength = 64;
	input.placeholder = 'name this workspace';
	input.spellcheck = false;
	const go = el('button', 'st wide', 'rename') as HTMLButtonElement;
	go.type = 'button';
	go.addEventListener('click', () => void writeThrough('rename', sid, { sid, title: input.value }));
	input.addEventListener('keydown', e => {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		void writeThrough('rename', sid, { sid, title: input.value });
	});
	row.append(input, go);

	const swatches = el('div', 'tip-swatches');
	for (const { intent, hex } of SWATCHES) {
		const b = el('button', 'swatch-btn') as HTMLButtonElement;
		b.type = 'button';
		b.style.background = hex;
		b.title = `${intent} · ${hex}`;
		b.dataset['intent'] = intent;
		b.addEventListener('click', () => void writeThrough('recolor', sid, { sid, color: hex }));
		swatches.append(b);
	}

	const out = el('span', 'out', receipt(`id:${sid}`));
	out.dataset['outFor'] = `id:${sid}`;
	box.append(row, swatches, out);
	return box;
}

/** Which layer a hovered anchor opens: the page opens layer 0, layer *n*'s own body opens *n+1*. */
const layerFor = (host: Node): number => layers.findIndex(l => l.box.contains(host)) + 1;

const inSomeBox = (n: Node | null): boolean => n !== null && layers.some(l => l.box.contains(n));

document.addEventListener('mouseover', e => {
	const target = e.target as Element | null;
	const host = target?.closest<HTMLElement>('[data-tip]') ?? null;
	if (!host) {
		if (!inSomeBox(target) && !layers.some(l => l.box.dataset['expanded'] === 'yes')) popTo(0);
		return;
	}
	const depth = layerFor(host);
	if (depth >= DEPTH_CAP) return;                    // three tooltips deep and no fourth (§4)
	if (layers[depth]?.anchor === host) return;
	clearTimeout(hold);
	showTip(host, depth, false);
	if (host.dataset['tipMore'] || host.dataset['decode'])
		hold = window.setTimeout(() => { if (layers[depth]?.anchor === host) showTip(host, depth, true); }, TIP_HOLD_MS);
});

document.addEventListener('mouseout', e => {
	const top = layers.at(-1);
	if (!top) return;
	const to = e.relatedTarget as Node | null;
	if (to && (top.anchor.contains(to) || inSomeBox(to))) return;
	if (top.box.dataset['expanded'] === 'yes') return;  // an expanded tip is dismissed, not escaped from
	popTo(0);
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') popTo(0); });

/**
 * Click a code word and its tooltip expands — the primitive's own contract ("held **or clicked**"),
 * and the only way to reach the deeper layers with a trackpad. Captured and stopped, so a click on
 * a code word inside a City row does not also select the building, and one inside a rendered
 * `path:line` reference decodes the word rather than opening the document: the word is the target
 * Felix aimed at.
 */
document.addEventListener('click', e => {
	const w = (e.target as Element | null)?.closest<HTMLElement>('[data-decode]');
	if (!w) return;
	const depth = layerFor(w);
	if (depth >= DEPTH_CAP) return;
	e.stopPropagation();
	e.preventDefault();
	clearTimeout(hold);
	showTip(w, depth, true);
}, true);

// ---------- the two wires a click may reach ----------

const post = async (path: string, body: unknown): Promise<[number, { ok: boolean; error?: string; result?: Record<string, unknown> }]> => {
	const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return [r.status, await r.json() as { ok: boolean; error?: string }];
};

const QUEUE_KEY = /^(note:)?(waiting|gate|countersign|escalation):/;

/**
 * His word, filed. One `POST /inbox` — a file append, in front of the credential gate (B6 F3), so
 * a cold-handed glass never costs him the ability to say something. The filed line is reported
 * verbatim and outlives the next repaint, because what his inbox now says is the whole point.
 */
async function file(key: string, body: Record<string, unknown>): Promise<boolean> {
	say(key, 'filing…');
	try {
		const [code, r] = await post('/inbox', body);
		if (!r.ok) { say(key, `${code} ${r.error}`); return false; }
		say(key, `filed · ${String(r.result?.['line'] ?? '')}`);
		return true;
	}
	catch (e) { say(key, String(e)); return false; }
}

/** The queue's own gesture buttons: the same one wire, with the drawer's held draft cleaned up after. */
async function gesture(btn: HTMLElement): Promise<void> {
	const item = btn.closest<HTMLElement>('.qi');
	const key = item?.dataset['key'] ?? '';
	const body = JSON.parse(btn.dataset['gesture'] ?? '{}') as Record<string, unknown>;
	const area = item?.querySelector<HTMLTextAreaElement>('[data-note-for]');
	if (body.kind === 'note') body.text = area?.value ?? '';
	if (!await file(key, body)) return;
	drafts.delete(key);
	if (area) area.value = '';
	// A countersign changes what the FILES say, and the card's three states are read off them:
	// the next poll re-derives it, so nothing here rewrites the card by hand.
	if (btn.dataset['reload']) void poll();
}

/**
 * His word on what a thing is called, written through to cmux (D16/D18 class 2). The receipt is
 * what **cmux** answered — the title it took, the hex it resolved — never the value that was asked
 * for, because the whole point of the write-through is that cmux is the truth afterwards. A refusal
 * arrives in cmux's own words and stays on the card until the next gesture.
 */
async function writeThrough(hand: 'rename' | 'recolor', sid: string, body: Record<string, unknown>): Promise<void> {
	const key = `id:${sid}`;
	say(key, `${hand.slice(0, -1)}ing…`);
	try {
		const [code, r] = await post(`/hands/${hand}`, body);
		if (!r.ok) return say(key, `${code} ${r.error}`);
		say(key, `cmux: ${String(r.result?.['title'] ?? r.result?.['color'] ?? 'ok')}`);
		void poll();          // the name on the card is the socket's, so it comes back from the socket
	}
	catch (e) { say(key, String(e)); }
}

/** His eyes, moved. `POST /hands/focus` is a hand, so it goes cold with the credential and says so. */
async function jump(btn: HTMLElement): Promise<void> {
	// The queue names its item; the Workshop's session list names the session. Either way the
	// receipt lands where the click was, which is the whole of the field report's *"JUMP TO PANEL
	// … does nothing"*: it did something, and nothing said so.
	const key = btn.closest<HTMLElement>('.qi')?.dataset['key'] ?? `jump:${btn.dataset['jumpSid']}`;
	say(key, 'jumping…');
	try {
		const [code, r] = await post('/hands/focus', { sid: btn.dataset['jumpSid'] });
		say(key, r.ok ? `focused ${String(r.result?.['surface'] ?? '')}` : `${code} ${r.error}`);
	}
	catch (e) { say(key, String(e)); }
}

// ---------- clicks ----------

app.addEventListener('click', e => {
	const target = e.target as Element | null;
	if (!target) return;

	const set = target.closest<HTMLElement>('[data-set-state]');
	if (set) {
		const p = set.dataset['pane'] as Pane | undefined;
		const s = set.dataset['setState'] as PaneState | undefined;
		if (p && s) setState(p, s);
		return;
	}

	const swap = target.closest<HTMLElement>('[data-focus-on]');
	if (swap) { focusOn(swap.dataset['focusOn'] ?? ''); return; }

	const ges = target.closest<HTMLElement>('[data-gesture]');
	if (ges) { void gesture(ges); return; }

	// A grep hit's jump sits on the ROW, never on the word (B20 F6): a click on a code word inside a
	// result is captured and stopped by the decoder, so it decodes rather than jumping — which is the
	// word Felix aimed at either way.
	const hit = target.closest<HTMLElement>('[data-grep-key]');
	if (hit) { jumpFrom(hit.dataset['grepKey'] ?? ''); return; }

	const to = target.closest<HTMLElement>('[data-jump-sid]');
	if (to) { void jump(to); return; }

	// The hotswap (B16 §1). One wire for every session row on the deck — the City's lines, the
	// Workshop's, the queue's — because there is ONE chat view and one way into it.
	const talk = target.closest<HTMLElement>('[data-chat-sid]');
	if (talk) {
		chatTo(talk.dataset['chatSid'] ?? '');
		remember(SESSION_KEY, selection.session);
		return;
	}

	// The City's click: the selection is the deck's one cross-pane fact (keel §3's ontology), so it
	// is stored, the Workshop is brought forward, and both panes redraw against it.
	const building = target.closest<HTMLElement>('[data-building]');
	if (building && layout.context !== 'minimal') {
		selection.building = building.dataset['building'] ?? null;
		remember(BUILDING_KEY, selection.building);
		focusOn('workshop');
		redraw();
		return;
	}

	// Click-to-expand (keel §3), read literally: at minimal a pane is one word and a mark, so
	// **the whole pane is the expand target** and nothing inside it can be aimed at. The click is
	// swallowed rather than passed on — acting on a control nobody could read is the bug.
	const pane = target.closest<HTMLElement>('.pane');
	const p = pane?.dataset['pane'] as Pane | undefined;
	if (p && layout[p] === 'minimal') { e.preventDefault(); setState(p, bump(layout[p])); }
});

// A disclosure and a half-typed note are the reader's state, not the snapshot's: both are held
// across a repaint so the queue can refresh under his hands without taking anything back.
app.addEventListener('toggle', e => {
	const d = e.target as HTMLDetailsElement | null;
	const key = d?.dataset?.['openKey'];
	if (!key) return;
	if (d!.open) opened.add(key); else opened.delete(key);
}, true);

app.addEventListener('input', e => {
	const area = e.target as HTMLTextAreaElement | null;
	const key = area?.dataset?.['noteFor'];
	if (key) drafts.set(key, area!.value);
});

// ---------- the poll ----------
//
// One composed read every 3 s. What the answer changes is repainted; what it does not, is not
// (`paint`) — so an idle city costs one fetch and a clock tick.

const POLL_MS = 3000;
let polls = 0;

/**
 * What the standing tenant wants the server to open, as a query. **One endpoint still** (B13 F5):
 * the deck names what it has open rather than opening a second poll beside this one, and a tenant
 * that declares no `needs` asks for nothing.
 */
const query = (): string => {
	const q = new URLSearchParams();
	const want = standing?.needs?.(layout.focus) ?? null;
	if (want !== null) q.set('b', want);
	// The sixth seam member (B16): the session the standing tenant is pointed at. A second key on the
	// same query, not a second query — the ontology has two levels with a surface, and the poll names
	// both of them or neither.
	const talking = standing?.asks?.(layout.focus) ?? null;
	if (talking !== null) q.set('s', talking);
	const s = q.toString();
	return s === '' ? '' : `?${s}`;
};

async function poll(): Promise<void> {
	try {
		const res = await fetch(`/deck/state${query()}`, { headers: { accept: 'application/json' } });
		if (!res.ok) throw new Error(`/deck/state answered ${res.status}`);
		polls++;
		pulse.dataset['polls'] = String(polls);
		pulse.dataset['fault'] = 'no';
		pulse.textContent = `${polls}`;
		snapshot = await res.json() as DeckSnapshot;
		redraw();
	}
	catch (err) {
		// Never swallowed: a deck rendering a stale snapshot without saying so is the lie the whole
		// building exists to avoid. The last good snapshot stays on screen, labeled.
		pulse.dataset['fault'] = 'yes';
		pulse.textContent = `poll failed — ${err instanceof Error ? err.message : String(err)}`;
	}
}

// ---------- go ----------

focusOn(remembered(FOCUS_KEY, v => (typeof v === 'string' ? v : null)) ?? 'workshop');
apply();
void poll();
setInterval(() => void poll(), POLL_MS);
