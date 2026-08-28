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
// **Nothing here can fire.** The two wires a click may reach are `POST /inbox` (his word, one file
// append) and `POST /hands/focus` (his eyes, a jump). There is no `/hands/fire` in this file, and
// B14's DoD greps the served bundle to keep it that way (D10).

import {
	ATTENTION, bump, columns, PANES, RESTING, toLayout,
	type Attention, type DeckBuilding, type DeckSession, type DeckSnapshot,
	type Layout, type Pane, type PaneState, type QueueItem,
} from './deck-model';
import { moveIn, selection, tenant, tenants, type FocusView } from './deck-view';

// ---------- small hands ----------

const need = <T extends HTMLElement>(id: string): T => {
	const e = document.getElementById(id);
	if (!e) throw new Error(`deck: the shell is missing #${id}`);
	return e as T;
};

/** One element, built. `text` goes in as text — the deck never assembles HTML from strings. */
function el(tag: string, cls = '', text = ''): HTMLElement {
	const e = document.createElement(tag);
	if (cls) e.className = cls;
	if (text) e.textContent = text;
	return e;
}

const ago = (seconds: number): string => {
	const d = Math.max(0, Date.now() / 1000 - seconds);
	if (d < 90) return `${Math.round(d)}s`;
	if (d < 5400) return `${Math.round(d / 60)}m`;
	if (d < 172800) return `${Math.round(d / 3600)}h`;
	return `${Math.round(d / 86400)}d`;
};

/**
 * An age that keeps ageing. Every "3m" on the deck is a `<span data-at>` and this rewrites them
 * all — which is why a region whose *content* has not changed is never rebuilt (see `paint`): the
 * clock moving is not news, and a rebuild in the middle of Felix typing a note is.
 */
function tick(root: ParentNode): void {
	for (const e of root.querySelectorAll<HTMLElement>('[data-at]'))
		e.textContent = ago(Number(e.dataset['at']));
}

const stamp = (seconds: number, cls = 'ago'): HTMLElement => {
	const e = el('span', cls, ago(seconds));
	e.dataset['at'] = String(seconds);
	return e;
};

// ---------- what the deck is holding ----------

const LAYOUT_KEY = 'belvedere.deck.layout';
const FOCUS_KEY = 'belvedere.deck.focus';
const BUILDING_KEY = 'belvedere.deck.building';

/**
 * localStorage is a per-viewer convenience and never load-bearing (spec §7): every read and every
 * write is wrapped, and a browser that refuses storage gets a deck at rest rather than no deck.
 */
function remembered<T>(key: string, parse: (raw: unknown) => T | null): T | null {
	try {
		const raw = localStorage.getItem(key);
		return raw === null ? null : parse(JSON.parse(raw));
	}
	catch { return null; }
}

const remember = (key: string, value: unknown): void => {
	try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private window: forget it */ }
};

let layout: Layout = remembered(LAYOUT_KEY, toLayout) ?? { ...RESTING };
let snapshot: DeckSnapshot | null = null;
let standing: FocusView | null = null;

selection.building = remembered(BUILDING_KEY, v => (typeof v === 'string' ? v : null));

// ---------- the law of space, applied ----------

const app = need('app');
const drawer = need('drawer');
const scrim = need('scrim');
const pulse = need('pulse');
const needsCount = need('needs');

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
	standing = next;
	next.mount(focus, action);
	drawTenantBar();
	remember(FOCUS_KEY, name);
	redraw();
}

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

// ---------- repainting: content, not clocks ----------
//
// A region is rebuilt only when what it *says* has changed. The clock is handled separately
// (`tick`), because a drawer that rebuilds every three seconds is a drawer that eats the note
// Felix is halfway through typing — which is precisely the copy-paste hell the deck exists to end.

const painted = new Map<string, string>();

function paint(key: string, host: HTMLElement, signature: string, draw: (host: HTMLElement) => void): void {
	if (painted.get(key) !== signature) {
		painted.set(key, signature);
		host.textContent = '';
		draw(host);
	}
	tick(host);
}

// ---------- the City (Context's one tenant, keel §3) ----------

/** The dot vocabulary: the fill is liveness, the ring is "this one cannot move without you". */
function dot(s: DeckSession): HTMLElement {
	const d = el('span', `dot s-${s.state}${s.waiting ? ` w-${s.waiting}` : ''}`);
	d.title = `${s.stamp ?? s.sid.slice(0, 8)} · ${s.waiting ?? s.state} · ${ago(s.last)} ago`;
	return d;
}

/** Everything has a limit: a building running forty sessions gets a row, not a wall of dots. */
const DOTS = 12;

function dots(ss: DeckSession[]): HTMLElement {
	const box = el('span', 'dots');
	for (const s of ss.slice(0, DOTS)) box.append(dot(s));
	if (ss.length > DOTS) box.append(el('span', 'num', `+${ss.length - DOTS}`));
	return box;
}

const BADGE_WORD: Readonly<Record<Attention, string>> = {
	waiting: 'blocked on you', gate: 'Felix-gate', countersign: 'countersign', escalation: 'escalation',
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

function buildingRow(b: DeckBuilding, mine: DeckSession[]): HTMLElement {
	const row = el('li', 'row' + (b.building === selection.building ? ' on' : ''));
	row.dataset['building'] = b.building;
	row.dataset['tip'] = b.building;
	row.dataset['tipMore'] = `${b.path} · ${b.live} live · `
		+ (ATTENTION.filter(k => b.badges[k]).map(k => `${b.badges[k]} ${BADGE_WORD[k]}`).join(', ') || 'nothing waiting on you');
	row.dataset['tipGo'] = `/b/${b.building.split('/').map(encodeURIComponent).join('/')}`;
	row.append(dots(mine), el('span', 'name', b.building), badges(b));
	return row;
}

/** Expanded: the sessions themselves, one line each — stamp, state, age. */
function sessionLines(ss: DeckSession[]): HTMLElement {
	const box = el('ul', 'lines');
	for (const s of ss) {
		const line = el('li', 'line');
		line.append(dot(s), el('span', 'who', s.stamp ?? s.sid.slice(0, 8)),
			el('span', 'st-word', s.waiting ?? s.state), stamp(s.last));
		box.append(line);
	}
	return box;
}

const LEGEND: [string, string][] = [
	['dot s-working', 'working'],
	['dot s-idle', 'idle'],
	['dot s-unknown', 'unknown — no pid to ask'],
	['dot s-idle w-blocked', 'blocked — a permission prompt is waiting'],
	['dot s-idle w-nagging', 'waiting for your input — the session said so'],
	['badge b-waiting', 'blocked on you'],
	['badge b-gate', 'Felix-gate on a live row'],
	['badge b-countersign', 'decision waiting on your pen'],
	['badge b-escalation', 'escalation raised, nothing says it was ruled'],
];

function legend(): HTMLElement {
	const box = el('div', 'legend-deck');
	box.append(el('span', 'label', 'legend'));
	for (const [cls, text] of LEGEND) {
		const key = el('span', 'lkey');
		key.append(el('span', cls, cls.startsWith('badge') ? 'n' : ''), el('span', '', text));
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
				list.append(buildingRow(b, mine));
				if (layout.context === 'expanded' && mine.length) list.append(sessionLines(mine));
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
}

function drawContext(): void {
	const host = hostOf('context');
	const sig = snapshot === null ? 'cold' : JSON.stringify([
		layout.context, selection.building, snapshot.register.buildings, snapshot.auditor.visible,
		snapshot.register.refreshing, snapshot.register.error,
		snapshot.census.present, snapshot.census.beats, snapshot.census.malformed, snapshot.census.since,
		snapshot.census.sessions,
	]);
	paint('context', host, sig, drawCity);
}

// ---------- the needs-you queue (the drawer's tenant, D15) ----------

/**
 * What a rebuild must not destroy. The queue is the one place on the deck where Felix *types*, so
 * an unsent note, an open disclosure and the line a gesture just filed all outlive their DOM.
 * Keyed by the item's own stable key, so an item that leaves the queue drops its draft with it.
 */
const drafts = new Map<string, string>();
const opened = new Set<string>();
const outs = new Map<string, string>();

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
		const b = el('button', 'st wide', `countersign ${i.decision}`) as HTMLButtonElement;
		b.type = 'button';
		b.dataset['gesture'] = JSON.stringify({ building: i.path, kind: 'countersign', decision: i.decision });
		b.dataset['reload'] = 'yes';
		acts.append(b);
	}
	if (i.kind === 'waiting' && i.sid) {
		const b = el('button', 'st wide', 'jump to pane') as HTMLButtonElement;
		b.type = 'button';
		b.dataset['jumpSid'] = i.sid;
		acts.append(b);
	}
	if (i.jump) {
		const a = el('a', 'st wide', 'open') as HTMLAnchorElement;
		a.href = i.jump;
		acts.append(a);
	}
	const out = el('span', 'out', outs.get(i.key) ?? '');
	out.dataset['outFor'] = i.key;
	acts.append(out);
	return acts;
}

function queueItem(i: QueueItem): HTMLElement {
	const li = el('li', `qi tone-${QUEUE_TONE[i.kind]}`);
	li.dataset['key'] = i.key;
	li.dataset['kind'] = i.kind;

	const head = el('div', 'qi-h');
	head.append(el('span', `pill tone-${QUEUE_TONE[i.kind]}`, i.kind === 'waiting' ? 'blocked on you' : i.kind));
	head.append(el('span', 'qname', i.name));
	if (i.at !== null) head.append(stamp(i.at, 'ago when'));
	li.append(head);

	const where = el('div', 'qwhere');
	where.append(el('span', 'who', i.building), el('span', '', i.where));
	li.append(where);
	li.append(actions(i));

	// [expand] only where it would reveal more than the head already shows (B9's furniture rule).
	if (i.full !== i.name || i.note) {
		const more = el('details', 'more');
		more.append(el('summary', '', 'expand'));
		if (i.full !== i.name) more.append(el('p', 'prose', i.full));
		more.append(el('p', 'quiet prose', i.note));
		if (i.kind === 'gate' || i.kind === 'escalation') more.append(noteBox(i));
		if (opened.has(i.key)) (more as HTMLDetailsElement).open = true;
		more.dataset['openKey'] = i.key;
		li.append(more);
	}
	return li;
}

function drawQueue(host: HTMLElement): void {
	if (!snapshot) { host.append(el('p', 'quiet', 'waiting for the first poll…')); return; }
	const q = snapshot.queue;
	host.append(el('p', 'label', q.length
		? `${q.length} thing${q.length === 1 ? '' : 's'} need you — attention first, recency inside it`
		: 'nothing needs you'));
	if (!q.length) {
		host.append(el('p', 'quiet prose',
			'No blocked session, no live Felix-gate, no pending countersign, no unruled escalation anywhere on the register. Every count on this deck is a floor (the census horizon) — the City says how far back it can see.'));
		return;
	}
	const list = el('ul', 'queue');
	for (const i of q) list.append(queueItem(i));
	host.append(list);
	host.append(el('p', 'quiet prose',
		'Nothing here fires anything (D10): a note and a countersign are one append to that building’s inbox, and a jump moves your eyes. Sending a message to a session arrives with the Chat (B16).'));
}

function drawDrawer(): void {
	const host = hostOf('drawer');
	const sig = snapshot === null ? 'cold' : JSON.stringify([layout.drawer, snapshot.queue]);
	// Everything has a limit (directive 3.1): held state belongs to items that still exist, so an
	// item answered and gone takes its draft, its disclosure and its receipt with it.
	if (snapshot) {
		const alive = new Set(snapshot.queue.flatMap(i => [i.key, `note:${i.key}`]));
		for (const m of [drafts, outs]) for (const k of [...m.keys()]) if (!alive.has(k)) m.delete(k);
		for (const k of [...opened]) if (!alive.has(k)) opened.delete(k);
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

function redraw(): void {
	drawContext();
	drawDrawer();
	standing?.draw(snapshot, layout.focus, layout.action);
}

// ---------- the placeholder tenants (B10 / B15 / B16 evict these) ----------

/** One tenant shaped like every real one, so the seam is exercised rather than merely declared. */
function placeholder(name: string, title: string, blurb: string, owed: string): FocusView {
	let focus: HTMLElement | null = null, action: HTMLElement | null = null;
	return {
		name, title, states: ['minimal', 'typical', 'expanded'],
		mount(f, a) { focus = f; action = a; },
		unmount() { focus = null; action = null; },
		draw(snap, focusState, actionState) {
			if (!focus || !action) return;
			focus.textContent = '';
			focus.append(el('span', 'big', selection.building ?? title.split(' ')[0] ?? title));
			if (focusState !== 'minimal') {
				focus.append(el('p', 'quiet prose', selection.building
					? `The City is pointing at ${selection.building}. ${blurb}`
					: blurb));
				focus.append(el('p', 'quiet prose', snap
					? `${snap.census.live} live · ${snap.register.buildings.length} buildings · ${snap.queue.length} needing you`
					: 'waiting for the first poll…'));
			}
			action.textContent = '';
			action.append(el('span', 'big', 'act'));
			if (actionState !== 'minimal') action.append(el('p', 'quiet prose', owed));
		},
	};
}

moveIn(placeholder('workshop', 'the Workshop', 'One building inside: its live sessions first, then board, ledger tail, decision queue and ISSUES — B15 moves in here and reads the selection.', 'At rest, Action holds the summon composer (B17).'));
moveIn(placeholder('works', 'the Works', 'Every Guild session drawn on one line of time: the past above, NOW where sessions blink, the plan below.', 'Against the Works, Action dispatches (B10, B11).'));
moveIn(placeholder('chat', 'the Chat', 'One hotswappable conversation: any session, live or dead, reads here.', 'Against the Chat, Action holds the draft and the notes (B16).'));

// ---------- the drawer ----------

function setDrawer(next: Layout['drawer']): void { layout.drawer = next; apply(); }

need('drawer-toggle').addEventListener('click', () =>
	setDrawer(layout.drawer === 'shut' ? 'open' : 'shut'));
need('drawer-pin').addEventListener('click', () =>
	setDrawer(layout.drawer === 'pinned' ? 'open' : 'pinned'));
need('drawer-shut').addEventListener('click', () => setDrawer('shut'));
scrim.addEventListener('click', () => setDrawer('shut'));

// ---------- the tooltip primitive ----------
//
// Instant on hover, because a tooltip that waits is a tooltip Felix has already moved past. Held
// or clicked, it expands into `data-tip-more` plus one action (`data-tip-go`) and becomes
// pointer-interactive so that action can be taken. Escape dismisses, always.

const TIP_HOLD_MS = 450;
const tip = need('tip');
let tipHost: HTMLElement | null = null;
let hold = 0;

function placeTip(host: HTMLElement): void {
	const r = host.getBoundingClientRect();
	const t = tip.getBoundingClientRect();
	const left = Math.min(Math.max(4, r.left), Math.max(4, window.innerWidth - t.width - 4));
	const below = r.bottom + 6;
	tip.style.left = `${left}px`;
	tip.style.top = `${below + t.height > window.innerHeight ? Math.max(4, r.top - t.height - 6) : below}px`;
}

function showTip(host: HTMLElement, expanded: boolean): void {
	const more = host.dataset['tipMore'] ?? '';
	tip.textContent = '';
	tip.append(el('div', 'tip-line', host.dataset['tip'] ?? ''));
	if (more && expanded) {
		tip.append(el('div', 'tip-more prose', more));
		const go = host.dataset['tipGo'];
		if (go) {
			const a = el('a', 'st wide', 'open') as HTMLAnchorElement;
			a.href = go;
			const acts = el('div', 'tip-actions');
			acts.append(a);
			tip.append(acts);
		}
	}
	else if (more) tip.append(el('div', 'tip-hint', 'hold for more'));
	tip.dataset['expanded'] = expanded ? 'yes' : 'no';
	tip.hidden = false;
	tipHost = host;
	placeTip(host);
}

function hideTip(): void {
	tip.hidden = true;
	tip.textContent = '';
	tipHost = null;
	clearTimeout(hold);
}

document.addEventListener('mouseover', e => {
	const host = (e.target as Element | null)?.closest<HTMLElement>('[data-tip]') ?? null;
	if (!host) { if (!tip.contains(e.target as Node) && tip.dataset['expanded'] !== 'yes') hideTip(); return; }
	if (host === tipHost) return;
	clearTimeout(hold);
	showTip(host, false);
	if (host.dataset['tipMore']) hold = window.setTimeout(() => { if (tipHost === host) showTip(host, true); }, TIP_HOLD_MS);
});

document.addEventListener('mouseout', e => {
	const to = e.relatedTarget as Node | null;
	if (!tipHost || (to && (tipHost.contains(to) || tip.contains(to)))) return;
	if (tip.dataset['expanded'] === 'yes') return;      // an expanded tip is dismissed, not escaped from
	hideTip();
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') hideTip(); });

// ---------- the two wires a click may reach ----------

const post = async (path: string, body: unknown): Promise<[number, { ok: boolean; error?: string; result?: Record<string, unknown> }]> => {
	const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return [r.status, await r.json() as { ok: boolean; error?: string }];
};

const say = (key: string, text: string): void => {
	outs.set(key, text);
	const out = hostOf('drawer').querySelector<HTMLElement>(`[data-out-for="${CSS.escape(key)}"]`);
	if (out) out.textContent = text;
};

/**
 * His word, filed. One `POST /inbox` — a file append, in front of the credential gate (B6 F3), so
 * a cold-handed glass never costs him the ability to say something. The filed line is reported
 * verbatim and outlives the next repaint, because what his inbox now says is the whole point.
 */
async function gesture(btn: HTMLElement): Promise<void> {
	const item = btn.closest<HTMLElement>('.qi');
	const key = item?.dataset['key'] ?? '';
	const body = JSON.parse(btn.dataset['gesture'] ?? '{}') as Record<string, unknown>;
	if (body.kind === 'note') {
		const area = item?.querySelector<HTMLTextAreaElement>('[data-note-for]');
		body.text = area?.value ?? '';
	}
	say(key, 'filing…');
	try {
		const [code, r] = await post('/inbox', body);
		if (!r.ok) return say(key, `${code} ${r.error}`);
		say(key, `filed · ${String(r.result?.['line'] ?? '')}`);
		drafts.delete(key);
		const area = item?.querySelector<HTMLTextAreaElement>('[data-note-for]');
		if (area) area.value = '';
		// A countersign changes what the FILES say, and the card's three states are read off them:
		// the next poll re-derives it, so nothing here rewrites the card by hand.
		if (btn.dataset['reload']) void poll();
	}
	catch (e) { say(key, String(e)); }
}

/** His eyes, moved. `POST /hands/focus` is a hand, so it goes cold with the credential and says so. */
async function jump(btn: HTMLElement): Promise<void> {
	const key = btn.closest<HTMLElement>('.qi')?.dataset['key'] ?? '';
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

	const to = target.closest<HTMLElement>('[data-jump-sid]');
	if (to) { void jump(to); return; }

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

async function poll(): Promise<void> {
	try {
		const res = await fetch('/deck/state', { headers: { accept: 'application/json' } });
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
