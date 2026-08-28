// The deck's client-side hands: the primitives every pane and every tenant builds with.
//
// It exists because B15 was the first tenant to move in, and a tenant that had to reach into
// `deck.client.ts` for `el()` would not be "a module, never a rebuild" (D13's replaceable surface).
// So the shell keeps the app — layout, drawer, poll, tooltip — and the shared *hands* live here:
// element building, ages that keep ageing, the repaint gate, browser storage, the dot vocabulary,
// and the one renderer for prose the server parsed into spans.
//
// **Nothing in here fetches, decides urgency, or fires.** It builds DOM out of what it is handed.

import type { DeckSession, Prose, Span } from './deck-model';

// ---------- elements ----------

export const need = <T extends HTMLElement>(id: string): T => {
	const e = document.getElementById(id);
	if (!e) throw new Error(`deck: the shell is missing #${id}`);
	return e as T;
};

/** One element, built. `text` goes in as text — the deck never assembles HTML from strings. */
export function el(tag: string, cls = '', text = ''): HTMLElement {
	const e = document.createElement(tag);
	if (cls) e.className = cls;
	if (text) e.textContent = text;
	return e;
}

export function button(cls: string, text: string, tip = ''): HTMLButtonElement {
	const b = el('button', cls, text) as HTMLButtonElement;
	b.type = 'button';
	if (tip) b.dataset['tip'] = tip;
	return b;
}

// ---------- clocks ----------

export const ago = (seconds: number): string => {
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
export function tick(root: ParentNode): void {
	for (const e of root.querySelectorAll<HTMLElement>('[data-at]'))
		e.textContent = ago(Number(e.dataset['at']));
}

export const stamp = (seconds: number, cls = 'ago'): HTMLElement => {
	const e = el('span', cls, ago(seconds));
	e.dataset['at'] = String(seconds);
	return e;
};

// ---------- repainting: content, not clocks ----------

const painted = new Map<string, string>();

/** Rebuild a region only when what it *says* changed. Ages tick separately, always (B14 F4). */
export function paint(key: string, host: HTMLElement, signature: string, draw: (host: HTMLElement) => void): void {
	if (painted.get(key) !== signature) {
		painted.set(key, signature);
		host.textContent = '';
		draw(host);
	}
	tick(host);
}

// ---------- receipts: what a gesture or a jump said, surviving the repaint that follows ----------

/**
 * Keyed by whatever the caller calls the thing it acted on. Shared because two panes now report
 * outcomes — the drawer's queue and the Workshop's session list — and a receipt held only in the DOM
 * dies at the next repaint, which is precisely when the poll that proves the gesture worked lands.
 */
export const receipts = new Map<string, string>();

export const receipt = (key: string): string => receipts.get(key) ?? '';

/** Say it into every `[data-out-for]` bearing this key, and remember it for the next paint. */
export function say(key: string, text: string): void {
	receipts.set(key, text);
	for (const out of document.querySelectorAll<HTMLElement>(`[data-out-for="${CSS.escape(key)}"]`))
		out.textContent = text;
}

// ---------- browser storage: a per-viewer convenience, never load-bearing ----------

export function remembered<T>(key: string, parse: (raw: unknown) => T | null): T | null {
	try {
		const raw = localStorage.getItem(key);
		return raw === null ? null : parse(JSON.parse(raw));
	}
	catch { return null; }
}

export const remember = (key: string, value: unknown): void => {
	try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private window: forget it */ }
};

// ---------- the dot vocabulary (B14): the fill is liveness, the ring is "needs you" ----------

export function dot(s: DeckSession): HTMLElement {
	const d = el('span', `dot s-${s.state}${s.waiting ? ` w-${s.waiting}` : ''}`);
	d.title = `${s.stamp ?? s.sid.slice(0, 8)} · ${s.waiting ?? s.state} · ${ago(s.last)} ago`;
	return d;
}

/** Everything has a limit: a building running forty sessions gets a row, not a wall of dots. */
export const DOTS = 12;

export function dots(ss: DeckSession[]): HTMLElement {
	const box = el('span', 'dots');
	for (const s of ss.slice(0, DOTS)) box.append(dot(s));
	if (ss.length > DOTS) box.append(el('span', 'num', `+${ss.length - DOTS}`));
	return box;
}

// ---------- prose: spans in, DOM out ----------

/**
 * The one renderer for everything the corpus wrote. The server resolved the markdown and the
 * `path:line` references into spans (`html.ts` §spans) precisely so this can be a `switch` — a
 * `doc` span becomes a control that opens the viewer at its line, which is the field report's item
 * 3 arriving as a data shape rather than as a regex in the browser.
 */
export function drawSpans(host: HTMLElement, ss: Span[], open: (path: string, line: number | null) => void): void {
	for (const s of ss) {
		if (s.kind === 'text') { host.append(document.createTextNode(s.text)); continue; }
		if (s.kind === 'code') { host.append(el('code', '', s.text)); continue; }
		if (s.kind === 'strong') { host.append(el('strong', '', s.text)); continue; }
		if (s.kind === 'url') {
			const a = el('a', 'out-link', s.text) as HTMLAnchorElement;
			a.href = s.href;
			host.append(a);
			continue;
		}
		const b = button('ref', s.text, s.line === null ? s.path : `${s.path}:${s.line}`);
		b.addEventListener('click', ev => { ev.stopPropagation(); open(s.path, s.line); });
		host.append(b);
	}
}

/**
 * Encapsulation-first, rendered (design law): the name the text wrote, with `[expand]` holding the
 * whole of it. A text with no name of its own renders whole and gains no control — an `[expand]`
 * over nothing is furniture (B9 F1's rule, kept).
 */
export function drawProse(p: Prose, cls: string, open: (path: string, line: number | null) => void): HTMLElement {
	if (!p.encapsulated) {
		const whole = el('p', cls);
		drawSpans(whole, p.spans, open);
		return whole;
	}
	const box = el('div', 'encap-box');
	box.append(el('p', 'encap', p.name));
	const more = el('details', 'more');
	more.append(el('summary', '', 'expand'));
	const whole = el('p', cls);
	drawSpans(whole, p.spans, open);
	more.append(whole);
	box.append(more);
	return box;
}

/** The plain text of a span run — what a tooltip carries when the surface can only afford a name. */
export const plain = (p: Prose): string => p.spans.map(s => s.text).join('');
