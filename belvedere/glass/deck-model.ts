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

import type { State } from '../../doctrine';
import type { SessionState } from './census';
import type { Countersigned } from './inbox';

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

// ---------- the Workshop's sections: order and collapse are the viewer's, and persist ----------

/**
 * The five sections, in the order Felix ruled (field report: *"I should be able to collapse BOARD,
 * LEDGER, DECISIONS, ISSUES, etc and reorder them — LIVE SESSIONS should be first"*). This array IS
 * the default order, and it is the closed set: a remembered order that is not a permutation of it
 * is not a remembered order.
 */
export const SECTIONS = ['sessions', 'board', 'ledger', 'decisions', 'issues'] as const;
export type Section = (typeof SECTIONS)[number];

/**
 * A remembered section order, or null. Same law as `toLayout`: localStorage is a per-viewer
 * convenience and never load-bearing, so anything that is not exactly a permutation of `SECTIONS`
 * reads as no memory and the Workshop opens at its defaults. A subset would silently hide a
 * section, which is the one failure mode a reorder must never have.
 */
export function toSections(raw: unknown): Section[] | null {
	if (!Array.isArray(raw) || raw.length !== SECTIONS.length) return null;
	const seen = new Set<string>();
	for (const v of raw) {
		if (typeof v !== 'string' || !SECTIONS.includes(v as Section) || seen.has(v)) return null;
		seen.add(v);
	}
	return raw as Section[];
}

/** The collapsed set, parsed the same way — unknown names are dropped rather than refused. */
export function toCollapsed(raw: unknown): Section[] | null {
	if (!Array.isArray(raw)) return null;
	return raw.filter((v): v is Section => typeof v === 'string' && SECTIONS.includes(v as Section));
}

/** Move one section by one place, clamped. The drag handler and the ▲▼ buttons share this. */
export function moved(order: Section[], name: Section, delta: number): Section[] {
	const from = order.indexOf(name);
	const to = from + delta;
	if (from < 0 || to < 0 || to >= order.length) return order;
	const out = [...order];
	out.splice(from, 1);
	out.splice(to, 0, name);
	return out;
}

// ---------- prose, parsed once at the boundary ----------

/**
 * One run of rendered prose. The client builds DOM rather than HTML (B13's seam note), so the
 * markdown is resolved **server-side, where the filesystem is**, and arrives as spans it can append.
 *
 *  - `doc` — a reference that opens inside the deck's own viewer at `line` (D58's linking law, and
 *    the field report's *"Links to documents (WHERE: agents/LEDGER.md:385) don't take you to that
 *    line"*). `path` is absolute and inside the city.
 *  - `url` — anything with a scheme; it leaves the city and gets a plain `<a>`.
 */
export type Span =
	| { kind: 'text'; text: string }
	| { kind: 'code'; text: string }
	| { kind: 'strong'; text: string }
	| { kind: 'doc'; text: string; path: string; line: number | null }
	| { kind: 'url'; text: string; href: string };

/**
 * Encapsulation-first, on the wire: the 1–6 word name the row leads with, and the whole thing as
 * spans one [expand] away. `encapsulated` false means the text has no name it wrote itself, so the
 * client renders it whole and draws no control — B9 F1's furniture rule, unchanged.
 */
export type Prose = { name: string; encapsulated: boolean; spans: Span[] };

/** Where a thing is written, in the city's own coordinates — and the line the viewer opens at. */
export type DocRef = { path: string; label: string; line: number };

// ---------- the Workshop: one building, inside (B15) ----------

export type WorkshopRow = {
	id: string;
	work: Prose;
	/** The row's own work doc (D58: boards link their work docs), resolved for the viewer. */
	workDoc: DocRef | null;
	dependsOn: string[];
	gates: string[];
	staffing: string;
	felixGate: boolean;
	rider: string | null;
	state: State | null;
	/** The landing record. Empty-named where the row carries no annotation at all. */
	annotation: Prose;
	ref: DocRef;
	/** Parser-as-lint, pinned to the row that produced it (README §1). */
	lint: string[];
};

export type WorkshopBoard = { heading: string; ref: DocRef; rows: WorkshopRow[] };

export type WorkshopBaton = {
	holder: 'session' | 'felix' | 'prose';
	text: Prose;
	/** Rendered, never wired: an instrument on this deck is a thing to read (D10). */
	instruments: { kind: 'summons' | 'row'; text: string }[];
};

export type WorkshopTail = {
	date: string; mantle: string; tier: string | null; row: string | null;
	body: Prose;
	decided: Prose | null;
	baton: WorkshopBaton | null;
	ref: DocRef;
};

export type WorkshopDecision = {
	id: string; date: string; decider: string;
	title: Prose;
	/** B6's three states, read off files — `folded` outranks `pending` (D10, B6 F2). */
	state: Countersigned;
	ref: DocRef;
};

export type WorkshopIssue = { date: string | null; who: string | null; text: Prose; ref: DocRef };

/**
 * One building, opened. Sent **only when the deck asks for it** (`/deck/state?b=…`) and only while
 * the Workshop is standing above minimal — the whole detail of the city's biggest building is 44 kB
 * of JSON, and a poll that carries every building's board would be a poll nobody could afford
 * (B13 F5's shared budget, respected by asking rather than by broadcasting).
 */
export type WorkshopDetail = {
	building: string;
	path: string;
	label: string;
	boards: WorkshopBoard[];
	tail: WorkshopTail | null;
	decisions: WorkshopDecision[];
	issues: WorkshopIssue[];
	/** Failures the board rows did not already carry — a count, with the viewer one click away. */
	lint: number;
	files: { boards: DocRef[]; ledger: DocRef | null; decisions: DocRef | null; issues: DocRef | null };
	badges: Record<Attention, number>;
};

// ---------- the snapshot: what `GET /deck/state` answers ----------

// ---------- attention: one vocabulary, two places (D15) ----------

/**
 * The four classes, in the order they rank. **This list is closed** — B14's order forbids a fifth
 * attention source, and both the City's badges and the drawer's queue read this one array, so a
 * class cannot exist in one place and not the other.
 */
export const ATTENTION = ['waiting', 'gate', 'countersign', 'escalation'] as const;
export type Attention = (typeof ATTENTION)[number];

/**
 * Why a session cannot go on without Felix. **Two measured edges, and no third** (P1 F1):
 *
 *  - `blocked` — a `Notification` whose `notification_type` is `permission_prompt`: a tool call
 *    is sitting on the approval dialog. This is the one the order calls "blocked-on-approval".
 *  - `nagging` — a `Notification` whose type is `idle_prompt`, the 60-second *"Claude is waiting
 *    for your input"* nag. This is the notification Felix said he was getting from cmux and could
 *    not find anywhere in Belvedere (keel §4), so it is a waiting edge here, named apart from the
 *    blocked one rather than folded into it.
 *
 * A bare `Stop` is **not** waiting: `Stop` is the idle edge (P1 F1), every finished session emits
 * one, and a queue that lists them all is a queue nobody reads.
 */
export type Waiting = 'blocked' | 'nagging';

/** One live session, flattened for the wire — the deck reads it, it never re-derives liveness. */
export type DeckSession = {
	sid: string;
	stamp: string | null;
	state: SessionState;
	/** The waiting edge, or null. Derived server-side from the last beat, never from the state alone. */
	waiting: Waiting | null;
	account: string | null;
	building: string | null;
	cwd: string | null;
	/** Whether this session sits in a cmux pane at all — a Ghostty session has nothing to jump to. */
	pane: boolean;
	/** Seconds since the epoch of the last beat — `ago()`'s input, computed client-side. */
	last: number;
	/**
	 * The model the transcript's own records name (`haiku`, `sonnet`, `opus`, `fable`), or null.
	 *
	 * **This is half a tier and says so.** The census carries no model or effort field — the hook
	 * payload has neither — so this is read from the same bounded transcript head window the
	 * name-stamp already comes from (`census.ts` §identify). Effort is on no artifact this glass can
	 * reach, so the Workshop prints the model and leaves the rest blank rather than guessing a tier.
	 */
	model: string | null;
	/** The last beat's own coordinates — the tooltip's depth (§4): venue, process, what it was doing. */
	pid: number | null;
	ws: string | null;
	event: string;
	tool: string | null;
};

/** One building as the City draws it: where it sits, what is alive in it, what it wants. */
export type DeckBuilding = {
	building: string;
	path: string;
	/** The `~/code/<x>` neighborhood key, and its label as Felix writes it (v0's grouping law). */
	group: string;
	label: string;
	live: number;
	badges: Record<Attention, number>;
	/**
	 * The rank attention sorts by — **lower is louder**, and recency only ever orders *inside* one
	 * (the standing law, README §3). `-1` is the extension B14 adds: a session that cannot move
	 * without him outranks even the work that is running.
	 */
	attention: number;
	/** Epoch seconds of the newest thing this building said — the tiebreak inside a rank. */
	fresh: number;
	/** The sessions housed here, newest beat first — the expanded state's per-building lines. */
	sids: string[];
};

/**
 * One line of the needs-you queue. Every field the drawer draws is here: the item is **data**, and
 * the client turns it into a row — so what can be answered in place is decided once, server-side,
 * where the files are.
 *
 * **Nothing in this shape can fire.** There is no summons, no stamp, no account and no fire body
 * anywhere in it (D10, and B14's own DoD): the two wires a queue item may carry are `POST /inbox`
 * (his word, a file append) and `POST /hands/focus` (his eyes, a jump).
 */
export type QueueItem = {
	kind: Attention;
	/** Stable across polls — the client keys its DOM by this, so an untouched item is never rebuilt. */
	key: string;
	building: string;
	/** The building's own directory: what an inbox gesture targets (never a slug to re-resolve). */
	path: string;
	/** Encapsulation-first: the 1–6 word name where the text has one, the whole text where it does not. */
	name: string;
	full: string;
	/** Epoch seconds, or null where the doctrine gives the thing no date (a board row is not an entry). */
	at: number | null;
	/** Where it came from, in the city's own coordinates — `README.md:191`, `row B14`. */
	where: string;
	/** A reading link. Reading is never gated; this is an `<a href>` and nothing else. */
	jump: string | null;
	/** waiting only — the session `POST /hands/focus` jumps to, or null when it sits in no pane. */
	sid: string | null;
	/** countersign only — the D-id the gesture carries, and which of B6's three states it is in. */
	decision: string | null;
	state: Countersigned | null;
	/** One line saying honestly what this item can and cannot do from here. */
	note: string;
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
		/** Live sessions that cannot move without him — the ambient half of D15, counted. */
		waiting: number;
		sessions: DeckSession[];
	};
	register: {
		at: number;
		ageSeconds: number;
		refreshing: boolean;
		error: string | null;
		buildings: DeckBuilding[];
	};
	/** The needs-you queue, ranked once — the drawer's tenant and the header's count (D15). */
	queue: QueueItem[];
	/**
	 * The building the deck asked for, opened — or null when it asked for none, or asked for one the
	 * register does not carry. **Asked for, never assumed**: the selection lives in the browser, so
	 * the deck names it in the query and the server answers about that one building and no other.
	 */
	workshop: WorkshopDetail | null;
	/**
	 * B5 E1's auditor delta, carried into the deck: what `ps` sees beside what the census tracks.
	 * `at` is when the count was taken, not when the snapshot was composed — it is deliberately
	 * stale (see `deck.ts`), and a number the page prints as current would be lying about which.
	 */
	auditor: { visible: number | null; at: number };
};
