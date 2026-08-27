// The deck, client side: the whole app. Bundled by `Bun.build` at server start and served as
// `/deck.js` — no framework, no CDN, nothing off this origin (keel §9, D54).
//
// What lives here is exactly what needs a browser: the layout the user is holding, the drawer, the
// tooltip primitive, the poll, and the wiring between them. The *law* of space lives in
// `deck-model.ts` so the server's resting render and this file's re-render cannot disagree; the
// tenants live behind `deck-view.ts` so B14+ move in without touching this file.

import {
	bump, columns, PANES, RESTING, toLayout,
	type DeckSnapshot, type Layout, type Pane, type PaneState,
} from './deck-model';
import { moveIn, tenant, tenants, type FocusView } from './deck-view';

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

// ---------- what the deck is holding ----------

const LAYOUT_KEY = 'belvedere.deck.layout';
const FOCUS_KEY = 'belvedere.deck.focus';

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

// ---------- the law of space, applied ----------

const app = need('app');
const drawer = need('drawer');
const scrim = need('scrim');
const pulse = need('pulse');

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

// ---------- the panes the shell owns: Context, and the drawer ----------

/**
 * Context is the City and always the City (keel §3) — it is not a tenant, so B14 replaces this
 * function's body rather than signing a lease. What it draws today is the snapshot, honestly: the
 * live count that a census beat moves, and the register's buildings under it.
 */
function drawContext(): void {
	const host = hostOf('context');
	host.textContent = '';
	if (!snapshot) { host.append(el('p', 'quiet', 'waiting for the first poll…')); return; }

	const c = snapshot.census;
	const count = el('span', 'big');
	count.id = 'live-count';
	count.dataset['live'] = String(c.live);
	count.textContent = String(c.live);

	const head = el('div', 'headline');
	head.append(count, el('span', 'label', 'live'));
	host.append(head);

	if (layout.context === 'minimal') return;          // one word and a mark, and that is the law

	host.append(el('p', 'quiet prose', c.present
		? `${c.beats} beats · ${c.malformed} unreadable · horizon ${c.since === null ? 'unknown' : ago(c.since) + ' back'} — every count here is a floor, not a total`
		: 'no census file: the sensor is not deployed on this machine'));

	const list = el('ul', 'rows');
	for (const b of snapshot.register.buildings) {
		const live = c.sessions.filter(s => s.building === b.building && s.state !== 'gone').length;
		const row = el('li', 'row');
		row.dataset['building'] = b.building;
		row.dataset['tip'] = b.building;
		row.dataset['tipMore'] = `${b.path} · ${live} live session${live === 1 ? '' : 's'}`;
		row.dataset['tipGo'] = `/b/${encodeURIComponent(b.building)}`;
		row.append(el('span', 'dot' + (live ? ' on' : '')), el('span', 'name', b.building));
		if (live) row.append(el('span', 'num', String(live)));
		list.append(row);
	}
	host.append(list);
	host.append(el('p', 'quiet prose', 'B14 moves the City in here: neighborhoods, attention badges, the color legend.'));
}

/** The drawer's content is a slot; B14 installs the needs-you queue. Until then it says so. */
function drawDrawer(): void {
	const host = hostOf('drawer');
	host.textContent = '';
	const probe = el('p', 'quiet prose', 'The needs-you queue lands here at B14 — sessions blocked on input, live Felix-gates, pending countersigns, each answerable in place.');
	probe.id = 'drawer-probe';
	probe.dataset['tip'] = 'the needs-you queue';
	probe.dataset['tipMore'] = 'Ranked triage: attention outranks recency, always. Pin the drawer and it is the morning coffee view.';
	probe.dataset['tipGo'] = '/';
	host.append(el('p', 'label', 'empty, honestly'), probe);
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
			focus.append(el('span', 'big', title.split(' ')[0] ?? title));
			if (focusState !== 'minimal') {
				focus.append(el('p', 'quiet prose', blurb));
				focus.append(el('p', 'quiet prose', snap
					? `${snap.census.live} live · ${snap.register.buildings.length} buildings · register ${ago(snap.register.at / 1000)} old`
					: 'waiting for the first poll…'));
			}
			action.textContent = '';
			action.append(el('span', 'big', 'act'));
			if (actionState !== 'minimal') action.append(el('p', 'quiet prose', owed));
		},
	};
}

moveIn(placeholder('workshop', 'the Workshop', 'One building inside: its live sessions first, then board, ledger tail, decision queue and ISSUES.', 'At rest, Action holds the summon composer (B17).'));
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
			const actions = el('div', 'tip-actions');
			actions.append(a);
			tip.append(actions);
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

	// Click-to-expand (keel §3), read literally: at minimal a pane is one word and a mark, so
	// **the whole pane is the expand target** and nothing inside it can be aimed at. The click is
	// swallowed rather than passed on — acting on a control nobody could read is the bug.
	const pane = target.closest<HTMLElement>('.pane');
	const p = pane?.dataset['pane'] as Pane | undefined;
	if (p && layout[p] === 'minimal') { e.preventDefault(); setState(p, bump(layout[p])); }
});

// ---------- the poll ----------
//
// One composed read every 3 s, and the diff is the whole snapshot: identical bytes means nothing on
// disk moved, so nothing redraws. No websocket, no SSE — polling has not fought yet (spec §6).

const POLL_MS = 3000;
let lastBody = '';
let polls = 0;

async function poll(): Promise<void> {
	try {
		const res = await fetch('/deck/state', { headers: { accept: 'application/json' } });
		if (!res.ok) throw new Error(`/deck/state answered ${res.status}`);
		const body = await res.text();
		polls++;
		pulse.dataset['polls'] = String(polls);
		pulse.dataset['fault'] = 'no';
		pulse.textContent = `${polls}`;
		if (body === lastBody) return;
		lastBody = body;
		snapshot = JSON.parse(body) as DeckSnapshot;
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
