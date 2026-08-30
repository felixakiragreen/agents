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
import type { RefKind } from './decode';
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

// ---------- the decoder: a code word, resolved into its object (B20) ----------

/**
 * What a decoded object lets Felix *do* from its tooltip. **Gestures only, never fires** (B20 §3,
 * D10's discipline): a tooltip files a line into a building's inbox — B6's wire, in front of the
 * credential gate — and the composer and the Works are the only surfaces that fire.
 *
 * Both carry the bytes that will be appended, because the countersign law is that he sees the line
 * before it is written: `preview` is the whole entry, `prefix` is everything but his own words.
 */
export type DecodeGesture =
	| { kind: 'countersign'; building: string; decision: string; preview: string }
	| { kind: 'note'; building: string; prefix: string };

/**
 * One reference, resolved — or honestly not (B20 §2). **Ambiguity and absence both answer `ok:
 * false` and name what they looked at**: a tooltip that guesses is worse than a tooltip that says
 * it cannot tell.
 *
 * `doc` is where the *object* is written, and it is what nested references inside `body` resolve
 * against — so a `§7` cited by belvedere's D2 resolves against belvedere's README and not against
 * whichever document happened to mention D2.
 */
export type Decoded =
	| {
		ok: true;
		kind: RefKind;
		id: string;
		/** The reference as the corpus wrote it: `B18`, `row 17`, `§3.2`. */
		label: string;
		/** The encapsulation — the row's name, the decision's title, the section's heading. */
		headline: string;
		status: string | null;
		body: string;
		building: string;
		doc: string;
		where: DocRef;
		/** A row's own work doc (D58), where the board links one. */
		plan: DocRef | null;
		gestures: DecodeGesture[];
	}
	| { ok: false; label: string; reason: string; candidates: string[] };

// ---------- the Workshop: one building, inside (B15) ----------

export type WorkshopRow = {
	id: string;
	work: Prose;
	/** The row's own work doc (D58: boards link their work docs), resolved for the viewer. */
	workDoc: DocRef | null;
	dependsOn: string[];
	gates: string[];
	staffing: string;
	hexGate: boolean;
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

// ---------- the Works: the building's whole work, drawn on one line of time (B10, C15) ----------

/**
 * One step of one **v3 run**, on the wire (C15 §2). The v2 flow file is gone (D22 r2); what the
 * Works draws now is the engine's own run log, and every field here is either read out of that log
 * or derived by the engine's own exports over it — `fold`, `verdicts`, `postureLegal`. The deck
 * re-implements no part of the log's meaning (D65's one-parser law, same shape).
 *
 * **Nothing in this shape can fire, and nothing can drive.** The deck's v3 lane is read-only: the
 * arm, the pass and the tick died with the v2 engine, and driving semantics are G5's rework lay.
 */
export type WorksStep = {
	id: string;
	/** `task` · `gate` · `card`. A card is Felix's own step: no subject, never ignited. */
	kind: 'task' | 'gate' | 'card';
	depends: string[];
	/** Dependency depth — the rank this node is drawn on. Time flows down (D14). */
	depth: number;
	/**
	 * **The engine's own word for this step**, verbatim from `verdicts()` — the one export whose
	 * whole job is naming a run's outcome with nothing in it that varies between two runs. The
	 * drawing derives its ring from `at` below and its sentence from this; neither is invented here.
	 */
	verdict: string;
	/** The fold's own state name: `pending` · `running` · `ended` · `paused` · `landed` · `killed`. */
	at: string;
	/** `running`: the session the log named, and the pid it was born with. */
	sid: string | null;
	pid: number | null;
	/** `paused`: the causes and the detail. `landed`: the report's own cause. Else null. */
	why: string | null;
	/** A card's ask — what it is waiting on Felix for. */
	ask: string | null;
	/** The bill: what would run, at what model and effort, under which posture. Null on a card. */
	model: string | null;
	effort: string | null;
	posture: string | null;
	/** `fake:<scenario>` or `real` — `subjectName()`, so the arm is named and never guessed. */
	subject: string | null;
	/**
	 * **The frozen kickoff** — the step's own first user turn, byte-exact, as the flow carried it
	 * when the run was blessed. It is read out of the run log's own `blessed` event and nothing
	 * resolves a document position: a kickoff that pointed at a doc by fence ordinal is exactly
	 * what collapsed at flow-1, and v3's `prompt` field is the law that replaced it.
	 */
	prompt: string | null;
	timeoutMs: number | null;
	/** Turns spent on this step — an ignition and a resume both cost (D73). */
	turns: number;
	/**
	 * Why this step could not have been ignited as declared — `postureLegal()`'s own refusal, and
	 * nothing else. Legality is per **(model, posture)**, never per model (C4 F6): haiku holds
	 * `acceptEdits` and does the work; asked for `auto` it is granted `default` and writes nothing.
	 */
	blocks: string[];
};

export const RINGS = ['declared', 'fired', 'landed', 'paused', 'refused'] as const;
export type Ring = (typeof RINGS)[number];

/** The fold's six step states → the five rings, so past and future draw in one vocabulary. */
const RING_OF_AT: Readonly<Record<string, Ring>> = {
	pending: 'declared', running: 'fired', ended: 'fired',
	landed: 'landed', paused: 'paused', killed: 'refused',
};

/** Board lifecycle → the same five rings. */
const RING_OF_STATE: Readonly<Record<string, Ring>> = {
	LANDED: 'landed', 'IN FLIGHT': 'fired', BLOCKED: 'paused', KILLED: 'refused', OPEN: 'declared',
};

/**
 * A node's ring, and **where the claim comes from** (B10 F4, kept whole through the engine swap).
 *
 * The run log outranks the board because it is the finer sensor: it knows a step ignited before any
 * board says IN FLIGHT. Where the log has said nothing about a step — `pending` — and the step id
 * happens to name a row on this building's board, the **board** speaks; and `from` carries the
 * difference, because a landed ring taken off a board row is not evidence that any engine ran it.
 */
export const ringOf = (n: WorksStep, state: string | null): { ring: Ring; from: 'run' | 'board' | 'none' } =>
	n.at !== 'pending' ? { ring: RING_OF_AT[n.at] ?? 'declared', from: 'run' }
	: state !== null && RING_OF_STATE[state] ? { ring: RING_OF_STATE[state]!, from: 'board' }
	: { ring: 'declared', from: 'none' };

/** Lit: running, and the session it named is still beating (the census, the sole liveness authority). */
export const lit = (n: WorksStep, ring: Ring, live: ReadonlySet<string>): boolean =>
	ring === 'fired' && n.sid !== null && live.has(n.sid);

export type WorksEdge = { from: string; to: string };

/** One v3 run: the flow it was blessed on, folded from its own log. */
export type WorksRun = {
	/** How every verb addresses it — the run dir's path under the telemetry root. */
	name: string;
	dir: string;
	flowId: string;
	flowName: string;
	/** The subject's cwd, home-relative — a venue is a place a session runs, not a city path. */
	venue: string;
	/**
	 * The account's own word where the config dir is one of the three, the raw config dir where it
	 * is not, and **null for a layer-0 run** — a sandbox the run made and owns is not an account
	 * (C14's shape, read straight off `RunHandle`).
	 */
	account: string | null;
	/** Where the venue came from: the log (C14 and after), a `conditions.json` sidecar, or neither. */
	venueFrom: 'log' | 'conditions' | 'sandbox';
	/** The ignition ceiling and what has been spent against it (D73). */
	budget: number;
	turns: number;
	ceiling: boolean;
	/** The step ids the blessing authorized (D11, D12). */
	scope: string[];
	/** The run's own HALT, as its log records it — never the glass's flag. */
	halted: string | null;
	log: { lines: number; at: number | null; last: string | null };
	steps: WorksStep[];
	edges: WorksEdge[];
};

/** A run dir whose log the reader refuses: shown, never swallowed (parser-as-lint, README §1). */
export type WorksFail = { name: string; error: string };

/** The bill, per account: B5's strip source, rendered where the plan is (B10 §5). */
export type WorksUsage = {
	account: string;
	ageSeconds: number | null;
	cells: { bucket: string; pct: number | null; delta: number | null }[];
};

/**
 * The v3 runs that ran in one building, plus the bill. **Asked for, never broadcast** — it rides
 * the poll's `?b=` and nothing else, and the board rows it draws against are the ones already on
 * the wire (`workshop`), joined by id rather than parsed a second time.
 *
 * A run houses where its subject ran: the venue's cwd through the register, the same join the
 * census makes for a live session. `read` / `total` / `elsewhere` are how the pane stays honest
 * about a bounded read — everything has a limit (directive 3.1), and the telemetry tree grows
 * every time the barrage runs.
 */
export type Works = {
	building: string;
	runs: WorksRun[];
	fails: WorksFail[];
	read: number;
	total: number;
	elsewhere: number;
	usage: WorksUsage[];
};

// ---------- the Chat: one hotswappable conversation (B16, keel §5) ----------

/**
 * One run of a turn. A transcript is not prose — it is prose, quoted bytes, and work — so the three
 * are three shapes rather than one string the client has to re-parse.
 *
 *  - `prose` — the agent's or Felix's words, already spanned server-side, so they decode like every
 *    other rendering of corpus text (B20's seam, spec §2).
 *  - `fence` — a fenced block, kept **verbatim and exempt from the decoder**: a kickoff quoted in a
 *    transcript is bytes somebody will copy, and a glass that hung controls inside it would be
 *    editing what it was asked to show (B20 §1's law, extended from code ticks to fences).
 *  - `act` — one tool call or one thought, **encapsulated to a single line** (spec §2, dataviz
 *    first): the tool's name and the one field that says what it touched. The full record is one
 *    jump away, in the pane cmux already owns.
 */
export type ChatBlock =
	| { kind: 'prose'; spans: Span[] }
	| { kind: 'fence'; lang: string; text: string }
	| { kind: 'act'; tool: string; head: string };

/**
 * One turn. `key` is the **byte offset** of the record that opened it: stable across polls, monotone,
 * and the only identity a transcript actually offers — so the client can prepend an earlier window
 * onto a live tail without ever drawing a turn twice.
 */
export type ChatTurn = {
	key: number;
	role: 'user' | 'assistant';
	/** Epoch seconds, or null where the record carried no timestamp. */
	at: number | null;
	blocks: ChatBlock[];
	/** Activity folded away under the per-turn cap — a count, never a silent truncation. */
	folded: number;
};

/** Who the Chat is pointed at. Carried whole, because a **dead** target is in no snapshot session. */
export type ChatTarget = {
	sid: string;
	/** cmux's word where it has one, the rig's birth name otherwise, the uuid's head as a last resort. */
	name: string;
	stamp: string | null;
	account: string | null;
	building: string | null;
	cwd: string | null;
	model: string | null;
	/** The census's word, or `dead` for a session it no longer tracks (or never did). */
	state: SessionState | 'dead';
	waiting: Waiting | null;
	/** The cmux workspace **UUID** — never a `workspace:N` ref (P6 F2: a stale ref delivers to whatever Felix is looking at). */
	ws: string | null;
	transcript: string | null;
};

/**
 * Whether this deck may send at all, decided **server-side** (B17's law: the page shows what the
 * server composed). `can` false means the client draws no send control whatsoever — D10's
 * ambiguity-never-arms as structure rather than as a disabled button.
 */
export type ChatSend = {
	can: boolean;
	/** How the words would travel: into a live pane (P6 §T), or as the turn a resume carries (P6 Q3). */
	mode: 'live' | 'resume' | null;
	why: string;
};

/** The one conversation view's whole payload, under the poll's `?s=` (spec §1). */
export type ChatView = {
	sid: string;
	target: ChatTarget | null;
	/** Why there is no target. An unknown sid says so rather than rendering an empty room. */
	error: string | null;
	turns: ChatTurn[];
	/** Byte offset this window begins at — `> 0` means earlier windows exist and load on scroll-up. */
	from: number;
	bytes: number;
	/**
	 * The **key of the turn a jump landed in** (B21), or null — either because nothing was aimed at,
	 * or because the target fell outside the turns this window could carry. Null is honest: the client
	 * says the hit is out of view rather than marking the nearest turn and calling it the one.
	 */
	anchor: number | null;
	/** The document this transcript's code words decode against (B20 §2) — the building, or the cwd. */
	doc: string;
	/** His draft for THIS target, off `desk/drafts/` — it outlives a reload, a hotswap and a kill. */
	draft: string;
	send: ChatSend;
};

/**
 * A message the transport would corrupt or swallow, refused **at compose** (P6's law: refuse before
 * a single cmux call, never after). One pure function, imported by the client that draws the reason
 * as he types and by the route that will not act on a body it would mangle — one law, one copy.
 *
 *  - **tab** — the TUI swallows every 0x09 and the wire carries them all, so the model receives
 *    fewer bytes than were sent (P6 T6). Felix's own directives are tabs at width 3, so this fires
 *    on real content; expanding them is *his* choice to make, never the glass's to make silently.
 *  - **command** — a first line starting `/` executes as a slash command and creates **zero** user
 *    turns (P6 T8, measured). `!` (bash) and `#` (memory) are the same family by construction and
 *    were not separately measured — refused here anyway, because refusing more is safe and a `!`
 *    that ran as a shell command in his session is not a failure anyone wants measured live.
 *  - **bytes / lines** — everything has a limit (directive 3.1), and here the limit is a clock: the
 *    transport spends `4n−1` cmux round trips at 153 ms each (P6 F4), so a hundred lines is ~40 s
 *    of a visibly filling box.
 */
export const MESSAGE_LIMITS = { bytes: 8 << 10, lines: 100 } as const;

export type Refusal = { code: string; text: string };

export function refusals(text: string): Refusal[] {
	const out: Refusal[] = [];
	if (text.trim() === '') out.push({ code: 'empty', text: 'nothing to send' });
	if (text.includes('\t')) out.push({ code: 'tab', text: 'a literal TAB never reaches the model — the TUI swallows it (P6 T6). Expand it yourself, or the bytes he reads are not the bytes you sent.' });
	const head = text.split('\n')[0] ?? '';
	const lead = head.trimStart()[0];
	if (head.startsWith('/') || lead === '!' || lead === '#')
		out.push({ code: 'command', text: `a first line starting "${head[0]}" is read by the TUI, not by the model — a "/" creates zero user turns (P6 T8), and "!" and "#" are the same family.` });
	const bytes = new TextEncoder().encode(text).length;
	if (bytes > MESSAGE_LIMITS.bytes) out.push({ code: 'bytes', text: `${bytes} bytes exceeds the ${MESSAGE_LIMITS.bytes}-byte message limit` });
	const lines = text.split('\n').length;
	if (lines > MESSAGE_LIMITS.lines) out.push({ code: 'lines', text: `${lines} lines exceeds ${MESSAGE_LIMITS.lines} — the transport is 4n−1 cmux calls at 153 ms each (P6 F4)` });
	return out;
}

// ---------- the desk: one drawer, city-wide (B19, D17 — keel §8) ----------

/** One note as the drawer lists it. The title is the note's own first line, never a field. */
export type DeskNote = {
	slug: string;
	title: string;
	bytes: number;
	/** Epoch seconds — the file's mtime, which is the only clock a flat drawer has. */
	at: number;
	/** How many places this note has been routed to; the receipt lines themselves ride `DeskRead`. */
	routed: number;
};

/** One note, opened: his words with the receipts taken off, and the receipts beside them. */
export type DeskRead = DeskNote & { text: string; routes: string[] };

/**
 * The three routes and no fourth (spec §4). Dream-into-a-new-repo stays with the founding ritual —
 * the desk saves the dream *file*; founding a building is Felix's, and the glass never writes
 * founding docs.
 */
export const DESK_ROUTES = ['issues', 'session', 'composer'] as const;
export type DeskRouteName = (typeof DESK_ROUTES)[number];

/**
 * What one route would do, exactly — composed server-side and rendered verbatim, because the
 * countersign law says the bytes are read before they are signed off. A plan carrying a `refusal`
 * draws no button at all: what stands there is the reason (D10 as structure, B16's own shape).
 */
export type DeskPlan = {
	to: DeskRouteName;
	slug: string;
	where: string;
	text: string;
	bytes: number;
	sha: string;
	refusal: string | null;
};

// ---------- the Grep: everything the city writes, searched (B21, keel §3 as amended) ----------

/**
 * The three corpora, in the order the drawer groups them. **This list is closed** — census and audit
 * telemetry are deliberately outside it (noise, and gitignored truth-less by law, spec §1), and a
 * fourth kind would be a fourth jump.
 */
export const GREP_KINDS = ['sessions', 'docs', 'desk'] as const;
export type GrepKind = (typeof GREP_KINDS)[number];

/**
 * Where a hit goes when it is clicked. **Every hit is jumpable** (keel §3: *"fast, bounded, and every
 * hit instantly jumpable"*), and each of the three lands in a surface that already exists — the Chat
 * at the turn (B16), the Workshop's viewer at the line (B15), the desk's editor at the note (B19).
 *
 * `anchor` is the **byte offset** of the matching line, which is the same coordinate a turn is keyed
 * by (`ChatTurn.key`) — so "the turn this line belongs to" is the last turn whose key does not exceed
 * it, and no second identity has to be invented for a jsonl append log.
 */
export type GrepJump =
	| { to: 'session'; sid: string; anchor: number | null }
	| { to: 'doc'; building: string | null; path: string; line: number }
	| { to: 'note'; slug: string };

/**
 * One hit, as the drawer draws it. The line is **clipped around the match** rather than sent whole:
 * a transcript record is one JSON line and can be a megabyte, and a result row is one line of a
 * pane (the law of space).
 */
export type GrepHit = {
	kind: GrepKind;
	/** Stable across queries — the client keys its DOM by this. */
	key: string;
	/** Encapsulation-first: the session's name, the doc's label, the note's title. */
	name: string;
	/** Where it is, in the city's own coordinates — `belvedere/README.md:191`. */
	where: string;
	/** Epoch seconds — the file's mtime, the only clock a corpus of files has. */
	at: number | null;
	/** The document this line's code words decode against (B20 §2). */
	doc: string;
	/** The clipped line, with `…` where bytes were taken off either end. */
	text: string;
	/** Where the term sits inside `text`, in **characters** — what the client marks. */
	mark: { at: number; len: number } | null;
	jump: GrepJump;
};

/** One group's answer, with its own bounds reported: a capped result set SAYS it was capped. */
export type GrepGroup = {
	kind: GrepKind;
	hits: GrepHit[];
	/** More hits existed than the cap allows — never a silent truncation. */
	capped: boolean;
	/** Files searched, files the size bar skipped, and whether the corpus itself hit its own cap. */
	files: number;
	skipped: number;
	filesCapped: boolean;
	/** The search ran out of time before this group finished. The hits it has are still honest. */
	timedOut: boolean;
	error: string | null;
	ms: number;
};

/**
 * What `GET /deck/grep?q=` answers. **A gesture, never a clock** (B19 F4's rule): a query is
 * something Felix asked once, so it rides its own route and `/deck/state` is untouched.
 */
export type GrepAnswer = {
	query: string;
	/** `rg` where it is on PATH, `grep` where it is not — and the fallback names its own degradation. */
	engine: 'rg' | 'grep';
	degraded: string | null;
	/** Whether the term was matched case-insensitively (case-smart: lower asks for either). */
	insensitive: boolean;
	ms: number;
	groups: GrepGroup[];
	/** The transcript-honesty line (spec §5) — named here, not discovered by Felix. */
	note: string;
	/** Why nothing was searched at all: a term too short, a term too long. */
	refusal: string | null;
};

// ---------- the composer: Action at rest (B17, keel §3) ----------

/**
 * Every knob, as strings. **Empty always means *unset* and resolves downstream** — an unset tier
 * axis takes the mantle's preset, an unset theater is derived from the building, an unset increment
 * is minted from all three lineage sources, an unset cwd is the building's own path. There is no
 * third state to represent, so there is no third state (B7's law, carried).
 *
 * `building` and `cwd` are two knobs because they answer two questions, and the field report caught
 * exactly what happens when one answers both: a sitting about belvedere, run at `~/code/agents`,
 * stamped `architect-agents-03` where `architect-belvedere-02` was meant. **The building names the
 * work; the cwd is only the venue.**
 */
export type ComposeDraft = {
	building: string;
	cwd: string;
	account: string;
	mantle: string;
	model: string;
	effort: string;
	theater: string;
	increment: string;
	branch: string;
	summons: string;
	/**
	 * The template the summons is still speaking through, or `''` once he has typed over it.
	 *
	 * It is **sticky** because §1 wants the summons *text* live under the knobs, not just the plan:
	 * a fence names its own mantle and tier (D45), so `You are a Builder at opus-high.` has to
	 * become `…at opus-low.` when the effort chip moves, or the page is showing a summons that
	 * contradicts the fire it is about to make. The first keystroke in the box clears it — from
	 * there the words are his and nothing rewrites them.
	 */
	template: string;
};

/** Exactly the body `POST /hands/fire` parses (B4 F1) — the plan carries it, the button sends it. */
export type FireWire = {
	account: string; stamp: string; cwd: string;
	model: string; effort: string; color: string; summons: string;
};

/** Something that will fire and deserves a second look. A warning never disarms (B7's three states). */
export type ComposeWarning = { name: string; text: string };

/** What a mantle chip offers: the rig's preset tier and felikai's hue for it (B18 F1's table). */
export type MantleChip = { name: string; key: string; preset: string; color: string | null };

/**
 * The draft, resolved against disk. **The mechanism, named** (B17 §2): the resolution is
 * **round-tripped**, not bundled — `plan()` reads the register, the trust files, both lineage logs,
 * the live census and `git`, none of which exists in a browser. So the client holds knobs and the
 * server holds the logic, one copy, and what the page shows is what the server composed rather than
 * a second derivation that could drift from it.
 *
 * `fire` is the exact body the button posts, and `summons`/`sha`/`bytes` describe those very bytes:
 * page-side and transcript-side agreement is a sha comparison, not an argument.
 */
export type ComposePlan = {
	/** As resolved — a template fills knobs, so the client re-seats its controls from this. */
	draft: ComposeDraft;
	accounts: string[];
	mantles: MantleChip[];
	templates: { key: string; name: string }[];
	buildings: { building: string; path: string }[];
	building: { building: string; path: string } | null;
	cwd: string | null;
	cwdNote: string;
	theater: string;
	theaterNote: string;
	increment: number | null;
	stamp: string;
	tier: string;
	preset: string;
	color: string;
	worktree: { repo: string; branch: string; path: string } | null;
	worktreeNote: string;
	/** Read, never answered: Claude's folder-trust dialog is Felix's alone (B7 F1, `trust.ts`). */
	trust: { warm: boolean; where: string; root: string | null; refused: string | null; repo: boolean; file: string } | null;
	slots: string[];
	/** The bytes that will be delivered — sanitized exactly as the hands sanitize them. */
	summons: string;
	bytes: number;
	sha: string;
	fire: FireWire | null;
	/** Why nothing composed, or the hands' own parse refusal of what did. Either way: no button. */
	blocked: string | null;
	warnings: ComposeWarning[];
	/** The composer's own bill, live (B17 §4) — beside the account picker, always. */
	usage: UsageWire[];
	handsArmed: boolean;
	handsNote: string;
	/** How long the resolution took, so a knob that feels slow can be priced rather than guessed at. */
	ms: number;
};

// ---------- usage on the wire (B17 §4) ----------

export const USAGE_SOURCES = ['live', 'cache', 'none'] as const;
export type UsageSource = (typeof USAGE_SOURCES)[number];

export type UsageCell = { bucket: string; pct: number | null; delta: number | null };

/**
 * One account's quota as the deck draws it. `source` is on the wire because a figure whose
 * provenance is hidden is a figure nobody can price: `live` is a fetch this glass made, `cache` is
 * the rig's file — the 391-minute number, now labelled — and `none` is the honest absence of both.
 */
export type UsageWire = {
	account: string;
	source: UsageSource;
	ageSeconds: number | null;
	error: string | null;
	cells: UsageCell[];
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
	/**
	 * **What cmux calls this session's workspace right now** (D16: cmux is truth for live identity),
	 * or null where the socket cannot say — an unarmed glass, a dead socket, a session in no pane.
	 *
	 * `stamp` above stays the **birth name**: the rig wrote it at the fire and nothing renames it, so
	 * a workspace Felix renamed in cmux left every rig-derived label in the glass one revision stale.
	 * Both are carried and both are shown where they differ; **neither is derived from the other**,
	 * and a null here renders as "no live identity", never as the birth name wearing a live badge.
	 */
	live: { name: string; color: string | null; ref: string } | null;
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
	/**
	 * The document this item's words were written in — the scope its code words decode against
	 * (B20 §2). A `§5` in a gate's text means that document's §5; a `D2` means that building's D2.
	 * The building's own directory where the item comes from no single file.
	 */
	doc: string;
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
	 * The same building's **engine work** (B10, on v3 since C15) — the run logs, folded, and the
	 * bill — under the same `?b=` and the same timer. It carries no board rows of its own: the
	 * Works draws the past out of `workshop` above and the runs out of this below, which is what
	 * makes it one drawing (keel §6).
	 */
	works: Works | null;
	/**
	 * The one conversation view (B16, keel §5) — the session the deck asked for under `?s=`, or null
	 * when it asked for none. Same law as the two above: **asked for, never broadcast**, because a
	 * transcript window is bytes nobody else on the deck is reading.
	 */
	chat: ChatView | null;
	/**
	 * B5 E1's auditor delta, carried into the deck: what `ps` sees beside what the census tracks.
	 * `at` is when the count was taken, not when the snapshot was composed — it is deliberately
	 * stale (see `deck.ts`), and a number the page prints as current would be lying about which.
	 */
	auditor: { visible: number | null; at: number };
	/**
	 * The socket-read identity source (B18, D16): when it last answered, how many workspaces it
	 * named, and why it could not — `error` non-null means every `live` above is the last good copy
	 * or nothing at all, and the deck says **stale** rather than showing a name as current.
	 */
	identity: { at: number; error: string | null; workspaces: number };
};
