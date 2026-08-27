// The deck — server side: the shell it serves once, and the snapshot it answers every few seconds.
//
// The deck is an app, not a page (D13, Felix: *"this is an app"*), so this file is deliberately
// thin. It renders a skeleton with the resting split already applied — a deck with no script is
// still an honest deck saying it needs one — and then gets out of the way: every pane's content is
// the client's, and every later row (B14+) moves in through the `FocusView` seam rather than here.
//
// The v0 pages keep serving untouched (keel §10). Nothing in this file writes.

import { readCensus, isLive } from './census';
import { columns, RESTING, type DeckSession, type DeckSnapshot } from './deck-model';
import { CSS, esc } from './html';
import { buildingOf } from './pages';
import { age, register } from './register';

/**
 * One composed read: the census (what is alive) and the register's held copy (what the buildings
 * are). **Neither walks the city on this thread** — `register()` returns the warm copy and kicks
 * its worker if the TTL is up (B8 F3's law: a synchronous walk on Bun's one thread stalls every
 * request that arrives during it). The census read is a bounded tail plus one `kill -0` per
 * session, which is what every v0 page already pays per request.
 */
export function deckState(): DeckSnapshot {
	const census = readCensus();
	const reg = register();
	const buildings = reg.entries.map(e => ({ building: e.building, path: e.path }));

	const sessions: DeckSession[] = census.sessions.map(s => ({
		sid: s.sid,
		stamp: s.stamp,
		state: s.state,
		account: s.account,
		building: buildingOf(s.cwd, buildings)?.building ?? null,
		cwd: s.cwd,
		last: s.last.t,
	}));

	return {
		at: Date.now() / 1000,
		census: {
			present: census.present, beats: census.beats, malformed: census.malformed,
			since: census.since, live: census.sessions.filter(isLive).length, sessions,
		},
		register: {
			at: reg.at, ageSeconds: age(reg), refreshing: reg.refreshing, error: reg.error, buildings,
		},
	};
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
	<button id="drawer-toggle" class="st wide" type="button" data-tip="the drawer — needs-you queue (B14 moves in)">drawer</button>
</div>
<div id="app" class="app" style="grid-template-columns:${columns(RESTING)}">
${pane('context', 'city', RESTING.context)}
${pane('focus', 'focus', RESTING.focus)}
${pane('action', 'action', RESTING.action)}
<aside id="drawer" class="drawer" data-state="${RESTING.drawer}">
	<header class="pane-head"><span class="pane-name">drawer</span>
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
