// HTML primitives: escaping, the one-line markdown the doctrine's prose actually uses, the
// page shell, and the tone vocabulary that turns a state into a colour. No template engine —
// the spine is server-rendered strings (no framework, no build step).

import { existsSync } from 'fs';
import { homedir } from 'os';
import { isAbsolute, join, dirname } from 'path';
import type { SessionState } from './census';
import type { State } from '../../doctrine';
import type { Prose, Span } from './deck-model';
import { cityRoot } from './paths';

export const esc = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The `/doc` viewer's URL for a link target, or the target itself when it leaves the city. */
export function docHref(target: string, baseDir: string): string {
	if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return target;           // http:, mailto:, vscode:
	const [path = ''] = target.split('#');
	if (path === '') return target;                                    // a bare anchor
	return '/doc?p=' + encodeURIComponent(isAbsolute(path) ? path : join(baseDir, path));
}

/**
 * Inline markdown only — links, code ticks, bold. Block structure is the parser's job, and a
 * full markdown renderer is a dependency this row does not get to grow (D54).
 */
export function inline(md: string, baseDir: string): string {
	return esc(md)
		.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (_, text: string, href: string) =>
			`<a href="${esc(docHref(href, baseDir))}">${text}</a>`)
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

// ---------- the same inline markdown, as data (the deck builds DOM, not strings) ----------

/**
 * A **bare** `path:line` reference in running prose — the field report's own third item, verbatim:
 * *"Links to documents (WHERE: agents/LEDGER.md:385) don't take you to that line"*.
 *
 * Deliberately narrow, and the narrowness is the honesty: **only a path that carries a line number**
 * (a bare `README.md` in prose is a mention, and D58 says durable docs link their first mention
 * anyway), only a known text extension, and only when the file **is really there** — an unresolvable
 * reference stays plain text rather than becoming a link that lies (D10's family: never guess).
 */
const BARE_REF = /(^|[\s(“"'`])((?:~\/|\/)?[\w.@-]+(?:\/[\w.@-]+)*\.(?:md|ts|tsx|css|json|jsonl|sh|zsh|tsv|txt))(?::(\d+))\b/g;
/** The same rule anchored, for a code tick whose entire content is a reference (see `spans`). */
const ONLY_REF = new RegExp(`^${BARE_REF.source}$`);
const MD_LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g;
const CODE = /`([^`]+)`/g;
const STRONG = /\*\*([^*]+)\*\*/g;

/** Where a `doc` span points, resolved against the document's own directory and the city root. */
function resolveRef(target: string, baseDir: string, exists: (p: string) => boolean): string | null {
	const raw = target.startsWith('~/') ? join(homedir(), target.slice(2)) : target;
	for (const p of isAbsolute(raw) ? [raw] : [join(baseDir, raw), join(cityRoot(), raw)])
		if (exists(p)) return p;
	return null;
}

/**
 * Inline markdown, parsed into spans once, server-side. The client appends these as DOM nodes, so
 * nothing it renders was ever an HTML string — which is why the deck's client carries no `esc()`.
 *
 * Markdown links keep D58's promise unconditionally: a link the corpus wrote resolves to the
 * viewer even when the target is missing, because the viewer's honest *"unresolved"* is the
 * information. Bare `path:line` refs are the opposite — nobody declared those to be links, so they
 * become one only when the file exists.
 */
export function spans(md: string, baseDir: string, exists: (p: string) => boolean = existsSync): Span[] {
	type Hit = { at: number; len: number; span: Span };
	const hits: Hit[] = [];
	const take = (re: RegExp, make: (m: RegExpExecArray) => Hit | null) => {
		for (const m of md.matchAll(re)) { const h = make(m as RegExpExecArray); if (h) hits.push(h); }
	};

	take(MD_LINK, m => {
		const text = m[1] ?? '', target = m[2] ?? '';
		const span: Span = /^[a-z][a-z0-9+.-]*:/i.test(target)
			? { kind: 'url', text, href: target }
			: { kind: 'doc', text, path: resolveRef((target.split('#')[0] ?? ''), baseDir, () => true) ?? target, line: null };
		return { at: m.index, len: m[0].length, span };
	});
	// A code tick around a reference does not stop it being one — the doctrine writes nearly every
	// path in ticks (`README.md:191`), and a link that only works unquoted would miss most of the
	// corpus. Resolved here rather than by letting the bare rule win the overlap, because that would
	// leave the ticks behind as orphaned text.
	take(CODE, m => {
		const inner = m[1] ?? '';
		const ref = ONLY_REF.exec(` ${inner}`);
		const path = ref ? resolveRef(ref[2] ?? '', baseDir, exists) : null;
		return {
			at: m.index, len: m[0].length,
			span: path === null ? { kind: 'code', text: inner } : { kind: 'doc', text: inner, path, line: Number(ref![3]) },
		};
	});
	take(STRONG, m => ({ at: m.index, len: m[0].length, span: { kind: 'strong', text: m[1] ?? '' } }));
	take(BARE_REF, m => {
		const lead = (m[1] ?? '').length, target = m[2] ?? '';
		const path = resolveRef(target, baseDir, exists);
		return path === null ? null
			: { at: m.index + lead, len: m[0].length - lead, span: { kind: 'doc', text: `${target}:${m[3]}`, path, line: Number(m[3]) } };
	});

	// First match wins on overlap: a `path:line` inside a code tick or a link's text is already
	// carried by the span around it, and two spans over one range would print the text twice.
	hits.sort((a, b) => a.at - b.at || b.len - a.len);
	const out: Span[] = [];
	let at = 0;
	for (const h of hits) {
		if (h.at < at) continue;
		if (h.at > at) out.push({ kind: 'text', text: md.slice(at, h.at) });
		out.push(h.span);
		at = h.at + h.len;
	}
	if (at < md.length) out.push({ kind: 'text', text: md.slice(at) });
	return out;
}

/** Encapsulation-first, as data: the name the text wrote, and the whole thing as spans. */
export const prose = (text: string, baseDir: string): Prose => {
	const e = encap(text);
	return { name: e.name, encapsulated: e.encapsulated, spans: spans(e.full, baseDir) };
};

// ---------- tones: one colour vocabulary, consumed by generic rules ----------

export type Tone = 'felix' | 'green' | 'blue' | 'cyan' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple' | 'grey';

/** Board lifecycle → tone. IN FLIGHT gets `--felix`: on a board it IS the live thing. */
export const stateTone = (s: State | null): Tone =>
	s === 'IN FLIGHT' ? 'felix' : s === 'LANDED' ? 'green' : s === 'OPEN' ? 'blue'
	: s === 'BLOCKED' ? 'red' : s === 'KILLED' ? 'grey' : 'orange';   // unparsed reads as a defect

/** Session liveness → tone. Orange is "you are looking at stale data" — exactly `unknown`. */
export const sessionTone = (s: SessionState): Tone =>
	s === 'working' ? 'green' : s === 'needs-input' ? 'red' : s === 'idle' ? 'blue'
	: s === 'unknown' ? 'orange' : 'grey';

const RIG_TONES = new Set<string>(['green', 'blue', 'cyan', 'pink', 'red', 'purple', 'yellow', 'orange']);
export const rigTone = (colour: string | null): Tone =>
	colour !== null && RIG_TONES.has(colour) ? colour as Tone : 'grey';

// ---------- encapsulation-first (design law, README §3) ----------

/**
 * The seam a name ends at, in order of precedence: a **spaced dash** first, a colon only where the
 * line has no dash. Felix's own examples are `B8: glass hardenings` and `E1: register policy` — the
 * id and its name are one phrase, and the dash is what divides that phrase from the prose. Taking
 * the colon first would name every row after its id alone and tell him nothing.
 *
 * Only the FIRST LINE is searched: a name reaching across a paragraph break is a name the text
 * never wrote.
 */
const SEAMS = [/\s[—–-]\s/, /:\s/];
/** Felix's law is 1–6 words. A longer head is not a name, so the text has none. */
const NAME_WORDS = 6;

export type Encap = { name: string; full: string; encapsulated: boolean };

/**
 * The city writes `**Fork — choose one**`, so a seam can fall *inside* a bold span and hand the name
 * back an orphaned marker, which `inline()` then renders as literal asterisks. Dropping the orphan
 * is not inventing words — the marker was never one.
 */
const balance = (s: string) => (s.match(/\*\*/g) ?? []).length % 2 ? s.replace(/\*\*/, '') : s;

/**
 * The short name a card leads with, **derived, never invented**: the text before the first seam,
 * when that head is a name-length phrase. Anything else — no seam, an empty head, a head running
 * past six words — has no name to lead with and renders whole (spec §3). No per-repo special
 * cases live here and none may: the moment derivation needs one, the row STOPS and files it.
 */
export function encap(text: string): Encap {
	const full = text.trim();
	const firstLine = full.split('\n')[0]!;
	const m = SEAMS.map(s => s.exec(firstLine)).find(x => x !== null);
	const head = m ? firstLine.slice(0, m.index).trim() : '';
	// The last condition is the furniture rule: an [expand] must reveal more than the card already
	// shows, or it is a control over nothing. It earns its keep on the live city — `parseIssues`
	// hands over the entry's FIRST LINE only, so `**The continuous flow — the` would otherwise render
	// as a name plus a two-word disclosure (measured on `agents/ISSUES.md`:297).
	const ok = head !== '' && head.split(/\s+/).length <= NAME_WORDS && full.length > 2 * head.length;
	return { name: ok ? balance(head) : full, full, encapsulated: ok };
}

/** The [expand] control: a scriptless `<details>`, so the disclosure is the browser's (B5's shape). */
export const expand = (inner: string, summary = 'expand') =>
	`<details class="more"><summary>${esc(summary)}</summary>${inner}</details>`;

/**
 * Encapsulation-first, rendered: the name alone, and `[expand]` holding the whole text. A text
 * with no derivable name renders whole and gains no control — an [expand] over nothing is furniture.
 */
export function encapHtml(text: string, base: string, cls: string): string {
	const e = encap(text);
	const whole = `<p class="${cls}">${inline(e.full, base)}</p>`;
	return e.encapsulated ? `<p class="encap">${inline(e.name, base)}</p>${expand(whole)}` : whole;
}

// ---------- legends: every coloured view owes the reader one (design law) ----------

export const legend = (keys: string[]) =>
	`<section class="legend">${label('legend')}${keys.map(k => `<span class="key">${k}</span>`).join('')}</section>`;

/** The liveness rings `window_()` paints — the ring is the state, the fill is the mantle. */
export const LIVENESS_KEYS = [
	`<span class="win tone-grey st-working"></span>working — heartbeat inside the stale window`,
	`<span class="win tone-grey st-needs-input"></span>needs input — a permission prompt is waiting`,
	`<span class="win tone-grey st-idle"></span>idle — last said <code>Stop</code>`,
	`<span class="win tone-grey st-unknown"></span>unknown — no pid to ask, or a dead sensor`,
];

/** The mantle hues, read off the rig's own table — the fill of every window in the city. */
export const mantleKeys = (colours: Map<string, string>) =>
	[...colours].map(([mantle, colour]) => `<span class="win tone-${rigTone(colour)}"></span>${esc(mantle)}`)
		.concat(`<span class="win tone-grey"></span>unstamped — no mantle to colour by`);

export const pill = (text: string, tone: Tone, title = '') =>
	`<span class="pill tone-${tone}"${title ? ` title="${esc(title)}"` : ''}>${esc(text)}</span>`;

export const label = (text: string) => `<span class="label">${esc(text)}</span>`;

/**
 * How long ago, in one glance. A display primitive and nothing else — it lives here so the pages,
 * the gauges and the shelf can all say "3h" the same way without importing each other (B9 broke
 * the `pages` ↔ `gauges` cycle the auditor delta would otherwise have opened).
 */
export const ago = (seconds: number) => {
	const d = Math.max(0, Date.now() / 1000 - seconds);
	if (d < 90) return `${Math.round(d)}s`;
	if (d < 5400) return `${Math.round(d / 60)}m`;
	if (d < 172800) return `${Math.round(d / 3600)}h`;
	return `${Math.round(d / 86400)}d`;
};

// ---------- the shell ----------

export const CSS = '<link rel="stylesheet" href="/felikai.css"><link rel="stylesheet" href="/glass.css">';

/** `~/code`-relative wherever possible: the city's own coordinates, not the filesystem's. */
export const short = (p: string) => {
	const root = cityRoot();
	return p.startsWith(root + '/') ? p.slice(root.length + 1) : p;
};

export function page(title: string, crumbs: string, body: string, footer: string): string {
	return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>${CSS}
</head><body>
<div class="grid" aria-hidden="true"></div>
<header><h1><a href="/">BELVEDERE</a></h1><nav>${crumbs} <span>/</span> <a href="/deck">deck</a></nav></header>
<main>${body}</main>
<footer>${footer}</footer>
</body></html>`;
}

/** The base directory a document's relative links resolve against. */
export const baseOf = (file: string | null) => file ? dirname(file) : cityRoot();
