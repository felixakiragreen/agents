// The deck — server side: the shell it serves once, and the snapshot it answers every few seconds.
//
// The deck is an app, not a page (D13, Felix: *"this is an app"*), so this file is deliberately
// thin. It renders a skeleton with the resting split already applied — a deck with no script is
// still an honest deck saying it needs one — and then gets out of the way: every pane's content is
// the client's, and every later row (B14+) moves in through the `FocusView` seam rather than here.
//
// The v0 pages keep serving untouched (keel §10). Nothing in this file writes.

import { readFileSync, statSync } from 'fs';
import { sep } from 'path';
import { cityRows, needsYou, waitingOf } from './attention';
import { readCensus, isLive } from './census';
import { ATTENTION, columns, RESTING, type Attention, type DeckSession, type DeckSnapshot } from './deck-model';
import { auditorCount } from './gauges';
import { CSS, esc, short } from './html';
import { buildingOf } from './pages';
import { cityRoot } from './paths';
import { age, city } from './register';
import { workshopOf } from './workshop';

/** A building the City has no row for still gets a shape, never an absent field (badges are counts). */
const NO_BADGES = (): Record<Attention, number> =>
	Object.fromEntries(ATTENTION.map(k => [k, 0])) as Record<Attention, number>;

/**
 * The auditor's own staleness bar. `ps -axo command=` costs 36 ms of the request thread (B9 F3),
 * which is nothing on a page Felix loads by hand and a spawn every three seconds forever on a deck
 * that polls. B9 F3 named the fix and did not build it because nothing then polled; the deck does,
 * so it is built here. The second reason is the diff: the process count moves constantly, and a
 * snapshot that changes every poll is a City that redraws every poll.
 */
const AUDITOR_TTL_MS = 30_000;
let auditedAt = 0;
let audited: number | null = null;

function auditor(): { visible: number | null; at: number } {
	if (auditedAt === 0 || Date.now() - auditedAt > AUDITOR_TTL_MS) {
		audited = auditorCount();
		auditedAt = Date.now();
	}
	return { visible: audited, at: auditedAt / 1000 };
}

/**
 * One composed read: the census (what is alive), the register's held copy (what the buildings are)
 * and every building's content re-read from disk (what they want).
 *
 * **Nothing here walks the city on this thread** — `city()` serves off the warm register and kicks
 * its worker if the TTL is up (B8 F3's law: a synchronous walk on Bun's one thread stalls every
 * request that arrives during it). What B14 adds on top of B13's read is the content parse, which
 * is the same 30-odd milliseconds every v0 page already pays per request (`register.ts` §head) —
 * the deck now needs it, because a badge is a fact about a board and a queue item is a fact about
 * a decision, and neither is knowable from a file list.
 */
export function deckState(open: string | null = null): DeckSnapshot {
	const census = readCensus();
	const { reg, buildings } = city();
	const live = census.sessions.filter(isLive);

	const sessions: DeckSession[] = census.sessions.map(s => ({
		sid: s.sid,
		stamp: s.stamp,
		state: s.state,
		waiting: waitingOf(s),
		account: s.account,
		building: buildingOf(s.cwd, buildings)?.building ?? null,
		cwd: s.cwd,
		pane: s.last.sf !== null,
		last: s.last.t,
		model: s.model,
		pid: s.last.pid,
		ws: s.last.ws,
		event: s.last.ev,
		tool: s.tool,
	}));

	const queue = needsYou(buildings, live);
	const rows = cityRows(buildings, live, queue);

	// The Workshop's detail is **asked for, never broadcast**: the whole of the city's biggest
	// building is 44 kB of JSON, so a snapshot that carried every board would cost the poll thirty
	// times what it costs (B13 F5's shared budget). The selection lives in the browser, so the deck
	// names one building in the query and gets that one back — and a name the register does not
	// carry answers null rather than a guess.
	const workshop = open === null ? null
		: workshopOf(buildings, open, rows.find(r => r.building === open)?.badges ?? NO_BADGES());

	return {
		at: Date.now() / 1000,
		census: {
			present: census.present, beats: census.beats, malformed: census.malformed,
			since: census.since, live: live.length,
			waiting: live.filter(s => waitingOf(s) !== null).length, sessions,
		},
		register: {
			at: reg.at, ageSeconds: age(reg), refreshing: reg.refreshing, error: reg.error,
			buildings: rows,
		},
		queue,
		workshop,
		auditor: auditor(),
	};
}

// ---------- the viewer's bytes: `/deck/doc` ----------

/** Everything has a limit: the file read, and the lines the browser is asked to lay out. */
export const DOC_LIMITS = { bytes: 2 << 20, lines: 20_000 } as const;

export type DocRead =
	| { ok: true; path: string; label: string; lines: string[]; bytes: number; truncated: boolean }
	| { ok: false; error: string };

/**
 * One document, read for the viewer that lives inside Focus (spec §3). **A read, and only a read**:
 * the same city fence `/doc` has carried since B2 — nothing outside `GLASS_CITY` is served, so a
 * `..` in a rendered link cannot walk out of the city.
 *
 * Errors are values, not throws: an unresolved link is information the viewer prints, and the field
 * report's complaint was precisely that a link went nowhere silently.
 */
export function readDoc(path: string): DocRead {
	if (!path.startsWith(cityRoot() + sep)) return { ok: false, error: `outside the city: ${path}` };
	try {
		const bytes = statSync(path).size;
		const text = readFileSync(path, 'utf8');
		const all = (bytes > DOC_LIMITS.bytes ? text.slice(0, DOC_LIMITS.bytes) : text).split('\n');
		return {
			ok: true, path, label: short(path),
			lines: all.slice(0, DOC_LIMITS.lines), bytes,
			truncated: bytes > DOC_LIMITS.bytes || all.length > DOC_LIMITS.lines,
		};
	}
	catch (e) { return { ok: false, error: e instanceof Error ? e.message : String(e) }; }
}

// ---------- the shell ----------

/** The three-button state group, per pane. No dropdowns, ever (design law) — the buttons ARE the state. */
const stateGroup = (pane: string) =>
	`<span class="states" role="group" aria-label="${esc(pane)} pane size">`
	+ ['minimal', 'typical', 'expanded'].map(s =>
		`<button class="st" type="button" data-set-state="${s}" data-pane="${esc(pane)}"`
		+ ` data-tip="${esc(`${pane} · ${s}`)}" aria-label="${esc(s)}">${s[0]}</button>`).join('')
	+ '</span>';

/**
 * One pane: a head that names it in one word (encapsulation-first) and a host the client owns.
 * `data-state` is the whole of a pane's appearance — the CSS reads it, the client writes it, and
 * nothing else needs to know.
 */
const pane = (name: string, title: string, state: string) =>
	`<section class="pane" id="pane-${name}" data-pane="${name}" data-state="${esc(state)}">
	<header class="pane-head"><span class="pane-name">${esc(title)}</span>${stateGroup(name)}</header>
	<div class="pane-body" id="host-${name}"></div>
</section>`;

/**
 * The deck. The body never scrolls (keel §2) — `body.deck` is a fixed two-row grid and every pane
 * owns its own overflow — so this shell carries no header, no footer and no margin: chrome that
 * scrolls a deck is chrome that broke the law.
 */
export function deckPage(): string {
	return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Belvedere — the deck</title>${CSS}<link rel="stylesheet" href="/deck.css">
</head><body class="deck">
<div class="grid" aria-hidden="true"></div>
<div id="bar" class="bar">
	<span class="mark"><a href="/">BELVEDERE</a></span>
	<nav class="ways"><a href="/">rail</a> <a href="/city">city</a> <a href="/shelf">shelf</a> <a href="/summon">summon</a></nav>
	<span class="spacer"></span>
	<span id="pulse" class="pulse" data-tip="the poll: one composed read of census and register, every 3 s">···</span>
	<button id="drawer-toggle" class="st wide" type="button"
		data-tip="the needs-you queue" data-tip-more="Sessions blocked on you, live Felix-gates, pending countersigns, unruled escalations — ranked, and answerable in place. Pin it and it is the morning coffee view.">needs
		<b id="needs" class="needs" data-needs="0">·</b></button>
</div>
<div id="app" class="app" style="grid-template-columns:${columns(RESTING)}">
${pane('context', 'city', RESTING.context)}
${pane('focus', 'focus', RESTING.focus)}
${pane('action', 'action', RESTING.action)}
<aside id="drawer" class="drawer" data-state="${RESTING.drawer}">
	<header class="pane-head"><span class="pane-name">needs you</span>
		<span class="states"><button class="st wide" type="button" id="drawer-pin" data-tip="pin: the drawer stops overlaying and takes a track of its own">pin</button><button class="st" type="button" id="drawer-shut" data-tip="shut the drawer">×</button></span>
	</header>
	<div class="pane-body" id="host-drawer"></div>
</aside>
</div>
<div id="scrim" class="scrim" hidden></div>
<div id="tip" class="tip" hidden></div>
<noscript><p class="pane-body">The deck is an app: it needs its script. The v0 pages —
<a href="/">rail</a>, <a href="/city">city</a>, <a href="/shelf">shelf</a> — render server-side and
serve on regardless.</p></noscript>
<script type="module" src="/deck.js"></script>
</body></html>`;
}
