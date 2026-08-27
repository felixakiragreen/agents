// HTML primitives: escaping, the one-line markdown the doctrine's prose actually uses, the
// page shell, and the tone vocabulary that turns a state into a colour. No template engine —
// the spine is server-rendered strings (no framework, no build step).

import { isAbsolute, join, dirname } from 'path';
import type { SessionState } from './census';
import type { State } from '../../doctrine';
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

export const pill = (text: string, tone: Tone, title = '') =>
	`<span class="pill tone-${tone}"${title ? ` title="${esc(title)}"` : ''}>${esc(text)}</span>`;

export const label = (text: string) => `<span class="label">${esc(text)}</span>`;

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
<header><h1><a href="/">BELVEDERE</a></h1><nav>${crumbs}</nav></header>
<main>${body}</main>
<footer>${footer}</footer>
</body></html>`;
}

/** The base directory a document's relative links resolve against. */
export const baseOf = (file: string | null) => file ? dirname(file) : cityRoot();
