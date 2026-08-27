// The law of space, as arithmetic — and the snapshot shape the server and the client agree on.
//
// This module is the deck's only *pure* file: no DOM, no filesystem, no Bun. Both sides import it,
// which is the point — the split the server renders into the shell and the split the client
// re-renders after a click come from ONE function, so a resting deck and a clicked deck can never
// disagree about what the law of space says.
//
// The law (deck keel §2, Felix verbatim): *"take note of the available screen space, split it
// proportionally according to priorities given its context, then fill it with the highest level
// information, in as few words as possible."* Priority is the pane's own state, so the state IS
// the weight — one number per state, three numbers per layout, and the grid does the rest.

import type { SessionState } from './census';

// ---------- the three panes and their three states ----------

export const PANES = ['context', 'focus', 'action'] as const;
export type Pane = (typeof PANES)[number];

export const PANE_STATES = ['minimal', 'typical', 'expanded'] as const;
export type PaneState = (typeof PANE_STATES)[number];

/** Shut · open (overlays everything) · pinned (reserves its own track). Keel §3's one drawer. */
export const DRAWER_STATES = ['shut', 'open', 'pinned'] as const;
export type DrawerState = (typeof DRAWER_STATES)[number];

export type Layout = Record<Pane, PaneState> & { drawer: DrawerState };

/** Keel §3, verbatim: *"At rest: City expanded, Workshop minimal, Summon minimal."* */
export const RESTING: Layout = { context: 'expanded', focus: 'minimal', action: 'minimal', drawer: 'shut' };

/**
 * The weights. Geometric rather than linear (1 · 3 · 6) because the law wants *density*, not
 * fairness: a minimal pane must read as a rail — one word and a mark — beside an expanded one, and
 * 1:2:3 would hand a minimal pane a third of a two-pane deck. At rest (6:1:1) the City takes 75%
 * and the two closed panes take an eighth each, which is the resting deck the keel describes.
 */
const WEIGHT: Readonly<Record<PaneState, number>> = { minimal: 1, typical: 3, expanded: 6 };

/** A pinned drawer is a fourth track, sized as a typical pane — it is content, not chrome. */
const DRAWER_WEIGHT = WEIGHT.typical;

/** Click-to-expand (keel §3): one step along the cycle, wrapping so a click can also close. */
export const bump = (s: PaneState): PaneState =>
	PANE_STATES[(PANE_STATES.indexOf(s) + 1) % PANE_STATES.length]!;

/** The fr weights of every track the deck draws, in DOM order; the drawer's is present only pinned. */
export const weights = (l: Layout): number[] => {
	const panes = PANES.map(p => WEIGHT[l[p]]);
	return l.drawer === 'pinned' ? [...panes, DRAWER_WEIGHT] : panes;
};

/** `grid-template-columns`. The one string the shell and the client both set. */
export const columns = (l: Layout): string => weights(l).map(n => `${n}fr`).join(' ');

/**
 * The fraction of the deck's width each track owns — the prediction a measured
 * `getBoundingClientRect().width` has to match. It only matches because every pane carries
 * `min-width: 0`: an `Nfr` track is `minmax(auto, Nfr)`, so without that a pane's own content
 * min-size silently outvotes the law.
 */
export function shares(l: Layout): number[] {
	const w = weights(l);
	const total = w.reduce((a, b) => a + b, 0);
	return w.map(n => n / total);
}

// ---------- parsing the remembered layout (localStorage is a boundary) ----------

const isPaneState = (v: unknown): v is PaneState => PANE_STATES.includes(v as PaneState);
const isDrawerState = (v: unknown): v is DrawerState => DRAWER_STATES.includes(v as DrawerState);

/**
 * A remembered layout, or null. localStorage is a per-viewer convenience and never load-bearing
 * (spec §7), so anything the deck did not write reads as "no memory" and the deck opens at rest.
 */
export function toLayout(raw: unknown): Layout | null {
	if (typeof raw !== 'object' || raw === null) return null;
	const o = raw as Record<string, unknown>;
	if (!isDrawerState(o['drawer'])) return null;
	const out = { drawer: o['drawer'] } as Layout;
	for (const p of PANES) {
		const v = o[p];
		if (!isPaneState(v)) return null;
		out[p] = v;
	}
	return out;
}

// ---------- the snapshot: what `GET /deck/state` answers ----------

/** One live session, flattened for the wire — the deck reads it, it never re-derives liveness. */
export type DeckSession = {
	sid: string;
	stamp: string | null;
	state: SessionState;
	account: string | null;
	building: string | null;
	cwd: string | null;
	/** Seconds since the epoch of the last beat — `ago()`'s input, computed client-side. */
	last: number;
};

/**
 * One composed read of the truth layer. Deliberately thin: B13 is the shell, and every tenant row
 * after it (B14's city, B15's Workshop, B17's usage, B18's identity) widens this shape rather than
 * opening a second endpoint. `at` is the server's clock so the client never dates a beat by its own.
 */
export type DeckSnapshot = {
	at: number;
	census: {
		present: boolean;
		beats: number;
		malformed: number;
		/** The sensor's horizon (B5 E1) — every count below it is a floor, and the deck says so. */
		since: number | null;
		live: number;
		sessions: DeckSession[];
	};
	register: {
		at: number;
		ageSeconds: number;
		refreshing: boolean;
		error: string | null;
		buildings: { building: string; path: string }[];
	};
};
