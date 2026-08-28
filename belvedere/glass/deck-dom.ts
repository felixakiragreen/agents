// The deck's client-side hands: the primitives every pane and every tenant builds with.
//
// It exists because B15 was the first tenant to move in, and a tenant that had to reach into
// `deck.client.ts` for `el()` would not be "a module, never a rebuild" (D13's replaceable surface).
// So the shell keeps the app — layout, drawer, poll, tooltip — and the shared *hands* live here:
// element building, ages that keep ageing, the repaint gate, browser storage, the dot vocabulary,
// and the one renderer for prose the server parsed into spans.
//
// **Nothing in here fetches, decides urgency, or fires.** It builds DOM out of what it is handed.

import { detect, key as tokenKey } from './decode';
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

// ---------- identity (B18): cmux's name, the rig's birth name, and the colour cmux is wearing ----------

/** What to call a session: cmux's word first (D16), the rig's stamp where cmux has none. */
export const liveName = (s: DeckSession): string => s.live?.name ?? s.stamp ?? s.sid.slice(0, 8);

/** The birth name, shown only where it differs from the live one — otherwise it is the same word twice. */
export const birthName = (s: DeckSession): string | null =>
	s.stamp !== null && s.stamp !== s.live?.name ? s.stamp : null;

/**
 * The session's name as both panes draw it: the colour cmux is wearing, the live name, and the
 * birth name beside it when they have drifted apart. One function because the City and the Workshop
 * must never disagree about what a session is called.
 */
export function named(s: DeckSession, stale: boolean): HTMLElement {
	const box = el('span', 'named');
	if (s.live?.color) {
		const sw = el('span', 'swatch');
		sw.style.background = s.live.color;
		sw.title = `cmux colour ${s.live.color}`;
		box.append(sw);
	}
	box.append(el('span', 'who', liveName(s)));
	const birth = birthName(s);
	if (birth) box.append(el('span', 'birth', birth));
	// Stale is a property of the READ, not of the name: the last good copy stays on screen and says
	// how old it is, rather than the deck inventing a name or blanking one it had (D10's family).
	if (stale && s.live) box.append(el('span', 'stale', 'stale'));
	return box;
}

/**
 * The tooltip a session carries, and the controls the shell wires onto it (B18 §2). The datasets are
 * set here so the City and the Workshop offer the same depth and the same two hands; the wires
 * themselves live in `deck.client.ts`, which is the only file that may reach a hand.
 *
 * **A session in no cmux workspace gets no controls** — there is nothing to rename — and its tooltip
 * says so rather than showing buttons that would 409.
 */
export function tipSession(host: HTMLElement, s: DeckSession): void {
	host.dataset['tip'] = liveName(s);
	host.dataset['tipMore'] = `${birthName(s) ? `born ${birthName(s)} · ` : ''}${s.cwd ?? 'no cwd on record'}`
		+ ` · ${s.ws ? `cmux workspace ${s.live?.ref ?? s.ws}` : 'no cmux pane — hooks are venue-blind'}`
		+ ` · pid ${s.pid ?? 'unrecorded'} · last ${s.event}${s.tool ? ` ${s.tool}` : ''}`;
	if (s.ws) {
		host.dataset['tipSid'] = s.sid;
		host.dataset['tipName'] = s.live?.name ?? '';
	}
}

/** Everything has a limit: a building running forty sessions gets a row, not a wall of dots. */
export const DOTS = 12;

export function dots(ss: DeckSession[]): HTMLElement {
	const box = el('span', 'dots');
	for (const s of ss.slice(0, DOTS)) box.append(dot(s));
	if (ss.length > DOTS) box.append(el('span', 'num', `+${ss.length - DOTS}`));
	return box;
}

// ---------- the decoder: every code word carries its meaning one hover away (B20) ----------

/**
 * Where a run of text is being read from, and how deep in a chain of tooltips.
 *
 *  - `in` — the document the words were written in. It is what a reference resolves *against*
 *    (B20 §2: local first, then canon), so it travels with the text and is never inferred.
 *  - `depth` — which tooltip layer this text will live in. 0 is the page.
 *  - `seen` — the code words already open in this chain, so a cycle renders plain (§4).
 */
export type DecodeCtx = { in: string | null; depth: number; seen: readonly string[] };

/** The page's own reading of the corpus: depth 0, nothing open above it. */
export const reading = (inPath: string | null): DecodeCtx => ({ in: inPath, depth: 0, seen: [] });

/**
 * Everything has a limit (directive 3.1) — and here the limit IS the feature: three tooltips deep
 * is the cap the order set, and it is enforced where the spans are *made* rather than where they
 * are hovered. A body rendered at depth 3 carries no decoder spans at all, so there is no fourth
 * layer to refuse.
 */
export const DEPTH_CAP = 3;

/**
 * Corpus text, with its code words made hoverable. **This is the one seam** (B20 §1): every tenant
 * that draws text the corpus wrote calls this or `drawSpans`, and nothing decodes per-tenant.
 *
 * A span carries only what the resolver needs — the word, its scope word, the document it was
 * written in, and the chain above it. Resolution is the server's and happens on hover, so a page
 * with four hundred references costs four hundred `<span>`s and zero lookups.
 */
export function words(host: HTMLElement, text: string, ctx: DecodeCtx | null): void {
	if (ctx === null || ctx.depth >= DEPTH_CAP) { host.append(document.createTextNode(text)); return; }
	let at = 0;
	for (const t of detect(text)) {
		// The cycle guard: a word already open in this chain is not a control, it is a word. Leaving
		// `at` where it is means its text still arrives — in the next plain run.
		if (ctx.seen.includes(tokenKey(t))) continue;
		if (t.at > at) host.append(document.createTextNode(text.slice(at, t.at)));
		const w = el('span', 'dw', t.text);
		w.dataset['tip'] = t.text;
		w.dataset['decode'] = t.text;
		w.dataset['decodeDepth'] = String(ctx.depth);
		w.dataset['decodeSeen'] = [...ctx.seen, tokenKey(t)].join(' ');
		if (ctx.in) w.dataset['decodeIn'] = ctx.in;
		if (t.scope) w.dataset['decodeWord'] = t.scope;
		host.append(w);
		at = t.at + t.len;
	}
	if (at < text.length) host.append(document.createTextNode(text.slice(at)));
}

// ---------- prose: spans in, DOM out ----------

/**
 * The one renderer for everything the corpus wrote. The server resolved the markdown and the
 * `path:line` references into spans (`html.ts` §spans) precisely so this can be a `switch` — a
 * `doc` span becomes a control that opens the viewer at its line, which is the field report's item
 * 3 arriving as a data shape rather than as a regex in the browser.
 *
 * **Code stays literal.** A `code` span is the corpus quoting bytes — a summons, a command, a
 * field name — and B20 §1 exempts exactly that: a decoder span inside quoted bytes would be the
 * glass editing what it was asked to show. Bold is prose and decodes; a link's *text* decodes
 * against the document the link names, which is B20 §2's "the explicitly linked doc" clause.
 */
export function drawSpans(host: HTMLElement, ss: Span[], open: (path: string, line: number | null) => void, ctx: DecodeCtx | null = null): void {
	for (const s of ss) {
		if (s.kind === 'text') { words(host, s.text, ctx); continue; }
		if (s.kind === 'code') { host.append(el('code', '', s.text)); continue; }
		if (s.kind === 'strong') {
			const b = el('strong');
			words(b, s.text, ctx);
			host.append(b);
			continue;
		}
		if (s.kind === 'url') {
			const a = el('a', 'out-link', s.text) as HTMLAnchorElement;
			a.href = s.href;
			host.append(a);
			continue;
		}
		const b = button('ref', '', s.line === null ? s.path : `${s.path}:${s.line}`);
		words(b, s.text, ctx === null ? null : { ...ctx, in: s.path });
		b.addEventListener('click', ev => { ev.stopPropagation(); open(s.path, s.line); });
		host.append(b);
	}
}

/**
 * Encapsulation-first, rendered (design law): the name the text wrote, with `[expand]` holding the
 * whole of it. A text with no name of its own renders whole and gains no control — an `[expand]`
 * over nothing is furniture (B9 F1's rule, kept).
 */
export function drawProse(p: Prose, cls: string, open: (path: string, line: number | null) => void, ctx: DecodeCtx | null = null): HTMLElement {
	if (!p.encapsulated) {
		const whole = el('p', cls);
		drawSpans(whole, p.spans, open, ctx);
		return whole;
	}
	const box = el('div', 'encap-box');
	const name = el('p', 'encap');
	words(name, p.name, ctx);
	box.append(name);
	const more = el('details', 'more');
	more.append(el('summary', '', 'expand'));
	const whole = el('p', cls);
	drawSpans(whole, p.spans, open, ctx);
	more.append(whole);
	box.append(more);
	return box;
}

/** The plain text of a span run — what a tooltip carries when the surface can only afford a name. */
export const plain = (p: Prose): string => p.spans.map(s => s.text).join('');
