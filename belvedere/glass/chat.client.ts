// The Chat — the voice (B16, deck keel §5). The deck's third Focus tenant, moved in through the
// `FocusView` seam and nowhere else (D13: *"panes are a replaceable surface"*).
//
// **One conversation view in the whole deck.** Any session — live, idle, weeks dead — hotswaps into
// it from a session row anywhere on the deck; the transcript reads in Focus, Felix's reply drafts in
// Action, and **the two scroll independently**, which is the whole of the note-app copy-paste era
// ending (field report). The draft lives on disk under `desk/drafts/`, so a reload, a hotswap and a
// killed server all give it back.
//
// **Nothing here ignites a session.** One wire leaves this file — `POST /chat/send`, D18's write class
// 1, a message into a session that already exists — and one file write, `POST /chat/draft`. The
// spawning hand is unreachable from this pane and its path is not spelled here, so a grep over the
// sources can say so (B17 F1's check: which SOURCE contains it, not how often the bundle does).
//
// The send button is drawn **only when the server says the target resolves and the hands are live**
// (D10: ambiguity never arms). When it does not, what stands there is the reason — never a control
// that would have to refuse.

import {
	refusals, turnAt,
	type ChatBlock, type ChatStep, type ChatTurn, type ChatView, type DeckSnapshot, type PaneState, type QueueItem,
} from './deck-model';
import { moveIn, selection, swap, viewer, type FocusView } from './deck-view';
import { button, drawSpans, el, paint, reading, receipt, say, stamp, words } from './deck-dom';

/**
 * Everything has a limit. `saveMs` is how often a keystroke reaches the disk; `bottomPx` is how
 * close to the end counts as *at the end* — the only thing left of the old `stick` machinery, and
 * now an affordance rather than a paging trigger.
 */
const LIMITS = { saveMs: 600, bottomPx: 40 } as const;

// ---------- what the tenant is holding ----------

let focusHost: HTMLElement | null = null;
let actionHost: HTMLElement | null = null;
let snap: DeckSnapshot | null = null;
let states: [PaneState, PaneState] = ['minimal', 'minimal'];

/**
 * **The whole transcript**, read once by the gesture that opened this target (B23 §2, his ruling:
 * *"the scroll view should show the entire chat"*). The poll keeps carrying the **tail**, so a turn
 * arriving while he reads still arrives — and a turn's key is a byte offset (`chat.ts` §windowOf),
 * which is what lets the two be merged without ever drawing a turn twice.
 *
 * `from` is where the held conversation begins: `0` is the beginning of the file, and anything else
 * is the pane saying which limit bit. `whoseWhole` is the target these turns belong to — one field
 * so a hotswap can never render the previous conversation under the new head.
 */
let whole: ChatTurn[] = [];
let whoseWhole: string | null = null;
let from = 0;
let loading = false;
/**
 * The target the whole read was last **asked** for, which is not the same as the one it answered
 * for: a read that failed must not be retried on the next repaint, or a broken transcript becomes a
 * tight loop between `draw` and `fetch`. One attempt per target; the failure is said, and the pane
 * keeps the poll's tail.
 */
let asked: string | null = null;

/**
 * **The jump** (B21's grep hit, and every minimap click): the key of the turn to bring into view
 * once, and whether that has happened yet. It moves the scroll view and nothing else — there is one
 * window now, so a jump is a scroll and never a different read.
 */
let aim: number | null = null;
let scrolled = false;

/**
 * His words, per target. The map is what survives a hotswap inside one page; the file behind
 * `POST /chat/draft` is what survives everything else. `dirty` is who owns the box right now: until
 * he types, the server's copy is the truth; from his first keystroke the box is his and nothing
 * rewrites it (B17 F3's answer, applied to a second surface).
 */
const drafts = new Map<string, string>();
const dirty = new Set<string>();
let saveTimer = 0;

const view = (): ChatView | null => (snap?.chat?.sid === selection.session ? snap.chat : null);

/** Redraw from what the tenant already holds — a scroll-up and a keystroke are not the poll's news. */
const repaint = (): void => draw();

// ---------- the target ----------

function retarget(sid: string | null): void {
	if (sid === selection.session) return;
	selection.session = sid;
	selection.awaiting = null;
	whole = [];
	whoseWhole = null;
	asked = null;
	from = 0;
	aim = null;
	scrolled = false;
	// Follow-the-tail is an affordance, and it resets on a swap: a new conversation opens at its end,
	// which is where the news is.
	stick = true;
	repaint();
}

/**
 * The whole transcript, in one gesture (spec §2). It rides `/deck/chat` — the gesture route, never
 * the poll — because a conversation is bytes Felix asked for once and the poll is a shared budget
 * (B13 F5). A failure leaves the poll's tail on screen and says so; it never empties the pane.
 */
async function loadWhole(sid: string): Promise<void> {
	asked = sid;
	loading = true;
	repaint();
	try {
		const r = await fetch(`/deck/chat?sid=${encodeURIComponent(sid)}`, { headers: { accept: 'application/json' } });
		const v = await r.json() as ChatView;
		// The answer belongs to the target that asked: a hotswap mid-flight discards it rather than
		// drawing one conversation under another's head.
		if (sid !== selection.session) return;
		whole = v.turns;
		whoseWhole = sid;
		from = v.from;
	}
	catch (e) { say(`chat:${sid}`, `the transcript would not read whole: ${String(e)} — the pane holds the tail`); }
	finally { loading = false; repaint(); }
}

/**
 * The composer ignited something and the keel says the Chat swaps in (§5). An ignition answers a workspace
 * and no session id (B11 F2), so what is held is the **name-stamp**, and this latches the moment the
 * census names it — honestly waiting until then rather than pointing at the wrong session.
 */
function latch(): void {
	if (!selection.awaiting || !snap) return;
	const born = snap.census.sessions.find(s => s.stamp === selection.awaiting);
	if (born) retarget(born.sid);
}

// ---------- the transcript (Focus) ----------

const WHO = (t: ChatTurn, name: string) => (t.role === 'user' ? 'you' : name);

/**
 * One block, drawn (C16 §4). The server already parsed the markdown into shapes and every run of
 * words into spans, so this is a `switch` and nothing else — the client parses no notation, which is
 * how the decoder reaches inside a table cell and a list item without a second grammar existing.
 *
 * **View only** (Felix, 2026-08-30): nothing here is editable, and the reply box beside it is a
 * plain textarea. A rendered transcript and a rendered composer are two different products.
 */
function drawBlock(host: HTMLElement, b: ChatBlock, doc: string): void {
	const open = (path: string, line: number | null) => viewer.open?.(path, line);
	const ctx = reading(doc);
	if (b.kind === 'act') {
		const line = el('div', 'ct-act');
		line.append(el('span', 'tool', b.tool));
		if (b.head) line.append(el('span', 'head', b.head));
		host.append(line);
		return;
	}
	if (b.kind === 'fence') {
		// Verbatim, and exempt from the decoder: a kickoff quoted in a transcript is bytes somebody is
		// about to copy, and hanging controls inside them would be the glass editing what it shows.
		const pre = el('pre', 'ct-fence', b.text);
		if (b.lang) pre.dataset['lang'] = b.lang;
		host.append(pre);
		return;
	}
	if (b.kind === 'head') {
		const h = el('p', `ct-md-h ct-md-h${Math.min(b.level, 3)}`);
		drawSpans(h, b.spans, open, ctx);
		host.append(h);
		return;
	}
	if (b.kind === 'list') {
		const list = el(b.ordered ? 'ol' : 'ul', 'ct-md-list');
		for (const item of b.items) {
			const li = el('li');
			drawSpans(li, item, open, ctx);
			list.append(li);
		}
		host.append(list);
		return;
	}
	if (b.kind === 'table') {
		// Tabular data is IosevkaFelix by the design law (§3), and the table owns its own overflow: a
		// wide table must scroll inside the pane, never widen it (the law of space).
		const box = el('div', 'ct-md-table');
		const table = el('table');
		const head = el('tr');
		for (const cell of b.head) { const th = el('th'); drawSpans(th, cell, open, ctx); head.append(th); }
		table.append(head);
		for (const row of b.rows) {
			const tr = el('tr');
			for (const cell of row) { const td = el('td'); drawSpans(td, cell, open, ctx); tr.append(td); }
			table.append(tr);
		}
		box.append(table);
		host.append(box);
		return;
	}
	const p = el('p', 'prose');
	drawSpans(p, b.spans, open, ctx);
	host.append(p);
}

function drawTurn(host: HTMLElement, t: ChatTurn, name: string, doc: string): void {
	const hit = aim === t.key;
	const art = el('article', `ct ct-${t.role}${hit ? ' ct-aim' : ''}`);
	art.dataset['key'] = String(t.key);
	const head = el('div', 'ct-h');
	head.append(el('span', 'who', WHO(t, name)));
	if (t.at !== null) head.append(stamp(t.at));
	art.append(head);
	for (const b of t.blocks) drawBlock(art, b, doc);
	if (t.folded) art.append(el('div', 'quiet', `+${t.folded} more tool calls in this turn — the pane has the full record`));
	host.append(art);
}

/**
 * **The entire conversation, in order** (spec §2): the whole read, plus whatever the poll's tail has
 * that it does not yet hold. A turn's key is its byte offset in an append-only file, so the merge is
 * a dedupe and a sort and cannot draw a turn twice or out of order.
 *
 * Before the whole read answers — the first second of a hotswap — this is the poll's tail alone, and
 * the pane says it is still reading.
 */
const allTurns = (v: ChatView): ChatTurn[] => {
	if (whoseWhole !== v.sid || !whole.length) return v.turns;
	// **The tail's first turn may be a FRAGMENT.** The poll reads a window that begins mid-file, so
	// where it opens inside a turn the whole read holds entire, the same records come back under a
	// later key — and a merge that deduped on keys drew that turn twice (measured on the 4.7 MB
	// fixture: 43 drawn of 42). So the seam is a cut rather than a dedupe: the tail is authoritative
	// from its first turn the whole read also knows, or from its first turn newer than everything
	// held, and anything before that is the whole read's under its real key.
	const keys = new Set(whole.map(t => t.key));
	const newest = whole.at(-1)!.key;
	const cut = v.turns.find(t => keys.has(t.key) || t.key > newest)?.key ?? Infinity;
	return [...whole.filter(t => t.key < cut), ...v.turns.filter(t => t.key >= cut)];
};

function drawTranscript(host: HTMLElement): void {
	const v = view();
	if (!selection.session) {
		host.append(el('span', 'big', 'chat'));
		host.append(el('p', 'quiet prose', 'Pick a session anywhere on the deck — the City expanded, a Workshop’s live sessions, the ⬡-queue — and it reads here. One view, any session, live or dead.'));
		return;
	}
	if (!v) { host.append(el('p', 'quiet prose', 'reading the transcript…')); return; }
	if (v.error || !v.target) { host.append(el('p', 'quiet prose', v.error ?? 'no target')); return; }

	const t = v.target;
	const head = el('div', 'ct-head');
	head.append(el('span', 'big', t.name));
	head.append(el('span', 'st-word', t.step ? t.step.at : t.waiting ?? t.state));
	if (t.model) head.append(el('span', 'tier', t.model));
	if (t.building) head.append(el('span', 'who', t.building));
	if (t.step) head.append(el('span', 'who', `${t.step.run}/${t.step.step}`));
	host.append(head);
	if (t.step) drawStep(host, t.step);

	const turns = allTurns(v);
	if (!turns.length) {
		host.append(el('p', 'quiet prose', loading
			? 'reading the transcript…'
			: 'This transcript holds no turn the deck can read — a session that never spoke, or a file of pure tool traffic.'));
		return;
	}

	const body = el('div', 'ct-body');
	const box = el('div', 'ct-turns');
	box.id = 'chat-turns';
	// **One scroll view over the whole conversation** (his ruling). The head of it says so — and
	// where a limit bit, says that instead. There is no pager and nothing to press.
	box.append(el('p', 'quiet', whoseWhole !== v.sid ? 'reading the rest of this transcript…'
		: from > 0 ? `the deck holds this conversation from byte ${from} of ${v.bytes} — the beginning is past its read limit`
		: 'the beginning of this transcript'));
	for (const turn of turns) drawTurn(box, turn, t.name, v.doc);
	body.append(box);
	body.append(minimap(v, turns));
	host.append(body);
}

/**
 * The engine's step, where the target is one (C16 §3). A paused `‹needs-⬡ question›` **is** a
 * conversation: the question the subject asked is the last thing it said, and it belongs above the
 * reply box rather than three panes away in the Works. `‹blocked›` and `‹dead›` render the same way
 * and the reply box simply is not drawn beside them (the honest-disabled law).
 */
function drawStep(host: HTMLElement, s: ChatStep): void {
	const box = el('section', `ct-step ct-step-${s.at}`);
	const line = el('div', 'kv');
	line.append(el('span', 'pill', s.at === 'paused' ? `‹${s.causes.join(', ')}›` : s.at));
	line.append(el('span', 'who', s.fake ? 'no account — a layer-0 sandbox the run made and owns' : s.account ?? s.venueFrom));
	box.append(line);
	if (s.why) box.append(el('p', 'prose', s.why));
	if (s.refusal) box.append(el('p', 'quiet prose', s.refusal));
	if (s.summoned) box.append(el('p', 'quiet prose', 'This step is summoned — a human holds it in a terminal, and it returns to the engine with the console’s `return`.'));
	host.append(box);
}

/**
 * **The minimap** (C16 §6, re-laid at B23 §2): the whole transcript as one strip, always the pane's
 * full height and never scrolling itself. One mark per turn — Felix's and the agent's in different
 * colours — with **the marks currently on screen lit**, so the strip is a position indicator over
 * one continuous scroll view.
 *
 * **Spatial, never temporal** (his ruling): a click moves the scroll view to that turn's place in
 * the conversation. It loads nothing and goes nowhere back in time, because the whole conversation
 * is already here.
 *
 * Marks are the SERVER's index of the file, so the strip spans the file even where a limit stopped
 * the read short — and the marks with no turn behind them say so on their own tooltip.
 */
function minimap(v: ChatView, drawn: ChatTurn[]): HTMLElement {
	const strip = el('div', 'ct-map');
	if (!v.marks.length) return strip;
	strip.dataset['tip'] = `${v.turnCount} turns · ${v.marks.length} marks · yours lit, the agent’s grey`;
	strip.dataset['tipMore'] = (v.marks.length < v.turnCount
		? 'The strip holds one mark per turn up to its own limit; beyond that the marks are spaced evenly across the file, so the first and last turns always have one. '
		: 'One mark per turn of the whole transcript. ')
		+ 'The lit marks are what is on screen. Click any mark to scroll there — the strip is a map of this conversation, not a way back in time.';
	const here = new Set(drawn.map(t => t.key));
	for (const m of v.marks) {
		const mark = el('button', `ct-mark ct-mark-${m.role}${aim === m.key ? ' aim' : ''}${here.has(m.key) ? '' : ' off'}`) as HTMLButtonElement;
		mark.type = 'button';
		mark.dataset['chatMark'] = String(m.key);
		mark.setAttribute('aria-label', here.has(m.key)
			? `${m.role === 'user' ? 'your' : 'the agent’s'} turn at byte ${m.key}`
			: `a turn at byte ${m.key}, before what the deck holds`);
		strip.append(mark);
	}
	return strip;
}

/**
 * Which marks are lit: the ones whose turns are **in the viewport right now**.
 *
 * It runs on every scroll, so it touches classes directly and never repaints — a scroll that
 * rebuilt the transcript would fight the scroll (which is the second half of *"scrolling to the top
 * snaps it back down"*).
 */
function lightMap(box: HTMLElement): void {
	const strip = box.parentElement?.querySelector<HTMLElement>('.ct-map');
	if (!strip) return;
	const top = box.scrollTop, bottom = top + box.clientHeight;
	const seen = new Set<string>();
	for (const art of box.querySelectorAll<HTMLElement>('.ct')) {
		const y = art.offsetTop - box.offsetTop;
		if (y + art.offsetHeight >= top && y <= bottom) seen.add(art.dataset['key'] ?? '');
	}
	for (const mark of strip.querySelectorAll<HTMLElement>('.ct-mark'))
		mark.classList.toggle('on', seen.has(mark.dataset['chatMark'] ?? ''));
}

// ---------- the jump: a scroll, because there is one window (B21, B23 §2) ----------

// Which turn a byte offset lands in is `deck-model.ts`'s `turnAt` — the Grep computes the offset
// server-side and the Chat scrolls to the turn here, and one rule serves both.

// ---------- the draft and the send (Action) ----------

const held = (sid: string, v: ChatView | null): string =>
	dirty.has(sid) ? drafts.get(sid) ?? '' : v?.draft ?? drafts.get(sid) ?? '';

function save(sid: string, text: string): void {
	drafts.set(sid, text);
	dirty.add(sid);
	clearTimeout(saveTimer);
	// Debounced, because a keystroke is not a document: the file is the backstop for a reload and a
	// killed server, not a per-character log.
	saveTimer = window.setTimeout(() => {
		void fetch('/chat/draft', {
			method: 'POST', headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ sid, text }),
		}).catch(() => { /* the box still holds it; the disk copy retries on the next keystroke */ });
	}, LIMITS.saveMs);
}

/**
 * What this target's building wants from Felix, beside the draft (spec §5). **Read-only wiring** —
 * the queue's answer controls stay B14's, and a baton on this deck is a thing to read (D10).
 */
function drawBatons(host: HTMLElement, building: string | null): void {
	if (!snap || !building) return;
	const mine: QueueItem[] = snap.queue.filter(i => i.building === building && i.kind !== 'waiting');
	const baton = snap.workshop?.building === building ? snap.workshop.tail?.baton ?? null : null;
	if (!mine.length && !baton) return;
	const box = el('section', 'ct-batons');
	box.append(el('span', 'label', 'this building wants you'));
	if (baton) {
		const line = el('div', `kv holder-${baton.holder}`);
		line.append(el('span', 'pill', baton.holder));
		const v = el('span', 'prose');
		words(v, baton.text.name, reading(building));
		line.append(v);
		box.append(line);
	}
	for (const i of mine.slice(0, 4)) {
		const line = el('div', 'kv');
		line.append(el('span', 'pill', i.kind));
		const v = el('span', 'prose');
		words(v, i.name, reading(i.doc));
		line.append(v);
		box.append(line);
	}
	box.append(el('p', 'quiet', 'read here, answered in the drawer — the queue owns those wires (B14).'));
	host.append(box);
}

async function send(sid: string, text: string): Promise<void> {
	const key = `chat:${sid}`;
	// P6 F4: the transport is 153 ms per cmux round trip and `4n−1` calls deep, so a send is
	// in-progress rather than modal — and the box keeps his words until the verification answers.
	say(key, `sending ${text.split('\n').length} line(s)…`);
	try {
		const r = await fetch('/chat/send', {
			method: 'POST', headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ sid, text }),
		});
		const body = await r.json() as { ok: boolean; error?: string; result?: Record<string, unknown> };
		if (!body.ok) return say(key, `${r.status} ${body.error}`);
		// The road is named in the receipt, because two roads reporting the same word are one road
		// nobody can audit (C16 §2). The engine's road adds what the RUN LOG says after the delivery.
		const step = body.result?.['step'] as { run?: string; id?: string; at?: string; why?: string } | null | undefined;
		say(key, `delivered · ${String(body.result?.['mode'])} · ${String(body.result?.['bytes'])} B · sha ${String(body.result?.['sha']).slice(0, 16)}… · ${String(body.result?.['ms'])} ms`
			+ (step ? ` · ${step.run}/${step.id} is ${step.at}${step.why ? ` — ${step.why}` : ''}` : ''));
		// It is his turn now, in the transcript: the box empties, and so does the file behind it.
		drafts.set(sid, '');
		dirty.delete(sid);
		void fetch('/chat/draft', {
			method: 'POST', headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ sid, text: '' }),
		}).catch(() => { /* the send landed; a stale draft file is the smaller problem */ });
		repaint();
	}
	catch (e) { say(key, String(e)); }
}

function drawAction(host: HTMLElement, state: PaneState): void {
	const v = view();
	const sid = selection.session;
	if (!sid || !v || !v.target) {
		host.append(el('span', 'big', 'draft'));
		if (state !== 'minimal') host.append(el('p', 'quiet prose', 'The Chat’s reply box opens with a target.'));
		return;
	}
	const text = held(sid, v);

	host.append(el('span', 'big', 'reply'));
	if (state === 'minimal') {
		host.append(el('p', 'quiet', text.trim() === '' ? 'no draft' : `${text.split('\n').length} line draft`));
		return;
	}

	const area = el('textarea', 'prose ct-draft') as HTMLTextAreaElement;
	area.rows = 8;
	area.spellcheck = true;
	area.placeholder = 'his words, delivered as one user turn';
	area.value = text;
	area.dataset['chatDraft'] = sid;
	host.append(area);

	// **The controls are their own region** (B23 §1). What stands beside the box — the send control
	// or the reason in its place — is a function of the WORDS, and the words are his: a signature
	// carrying them rebuilds the box he is typing in, which is the reported bug. So the box's own
	// region never reads the text, and this host is repainted by a second signature that does.
	const acts = el('div', 'ct-acts');
	acts.dataset['chatActs'] = sid;
	host.append(acts);

	if (state === 'expanded') drawBatons(host, v.target.building);
}

/** The send control or the reason in its place, and the promise the road carries (spec §2). */
function drawActs(host: HTMLElement, sid: string, v: ChatView, text: string): void {
	const acts = el('div', 'qacts');
	const bad = refusals(text);
	// D10 as structure: no resolvable target, no cold-hands, no send **control** — the reason stands
	// where the button would have been, and a grep for the wiring finds nothing.
	if (v.send.can && bad.length === 0) {
		const go = button('st wide', v.send.mode === null ? 'send' : `send · ${v.send.mode}`, v.send.why);
		go.dataset['chatSend'] = sid;
		acts.append(go);
	}
	else acts.append(el('span', 'reason', bad.length ? bad.map(b => b.text).join(' · ') : v.send.why));
	const out = el('span', 'out', receipt(`chat:${sid}`));
	out.dataset['outFor'] = `chat:${sid}`;
	acts.append(out);
	host.append(acts);

	// The road, and the promise that rides it. Where there is no road the reason already stands where
	// the button would have been, and printing it a second time is furniture, not honesty.
	if (v.send.can) host.append(el('p', 'quiet prose',
		`${v.send.why} Verified after delivery: the transcript is read back and the sha compared — nothing is reported delivered without it.`));
}

// ---------- the tenant ----------

/**
 * **Follow the tail** — an explicit affordance, and the only piece of the old paging machinery that
 * survives (spec §2). True while the scroll view is at its end, so a live turn extends the reading
 * he is already doing; false the instant he scrolls away, so nothing ever yanks him. Reset on a
 * target swap by `retarget`.
 */
let stick = true;

function draw(): void {
	if (!focusHost || !actionHost) return;
	latch();
	const [focusState, actionState] = states;
	const v = view();

	// **The whole transcript is asked for HERE**, and here only. A target arrives four ways — a
	// hotswap, a grep jump, the shell restoring `selection.session` from localStorage at boot, and
	// the composer's latch — and hanging the fetch off any one of them means the other three open a
	// keyhole (measured: a reload drew 5 turns of 42). `draw` is the one place that sees a target no
	// matter who set it, which is the same reasoning the Works' bill fetch already uses.
	if (v?.target && asked !== v.sid) void loadWhole(v.sid);

	const turns = v ? allTurns(v) : [];
	// C15 F3's law: everything `draw` reads is in the signature. The minimap's marks are an
	// append-only index, so three numbers pin them — the file's turn count, how many marks came back,
	// and the newest one's key — rather than six hundred keys re-serialized on every poll.
	//
	// `aim` is deliberately NOT in it: a jump moves the scroll view and marks one turn, and rebuilding
	// the whole transcript to move a class is how a scroll fights a repaint (B23 §2). The mark is
	// moved below, in place.
	paint('chat:focus', focusHost, JSON.stringify([
		selection.session, selection.awaiting, focusState, loading, from, whoseWhole, v?.error, v?.target,
		turns.map(t => [t.key, t.blocks.length, t.folded]),
		v?.turnCount, v?.marks.length, v?.marks.at(-1)?.key,
	]), h => {
		if (focusState === 'minimal') {
			h.append(el('span', 'big', v?.target?.name ?? 'chat'));
			if (v?.target) h.append(el('span', 'st-word', v.target.waiting ?? v.target.state));
			return;
		}
		drawTranscript(h);
	});

	const box = document.getElementById('chat-turns');
	if (box) {
		// **The aim lands once.** It is a byte offset — a minimap mark's, or a grep hit's — and the turn
		// it belongs to is resolved here rather than at the click, because the click may arrive before
		// the whole transcript has. After it lands the pane is his to read, and a poll three seconds
		// later must not yank him back. `stick` is the other half: at the end of the conversation a new
		// turn extends what he is reading, and anywhere else nothing moves at all.
		const key = aim === null || scrolled || !turns.length ? null : turnAt(turns, aim);
		const target = key === null ? null : box.querySelector<HTMLElement>(`[data-key="${CSS.escape(String(key))}"]`);
		if (target) {
			for (const was of box.querySelectorAll('.ct-aim')) was.classList.remove('ct-aim');
			target.classList.add('ct-aim');
			target.scrollIntoView({ block: 'center' });
			scrolled = true;
		}
		else if (aim !== null && !scrolled && turns.length && whoseWhole === v?.sid) {
			// A turn the deck does not hold is said, not guessed at: scrolling to the nearest one and
			// calling it the hit is the class of failure where a jump *looks* like it worked.
			say(`chat:${selection.session}`, `that turn is at byte ${aim}, before the ${from} bytes this deck holds — the read’s own limit, printed at the head of the transcript`);
			aim = null;
			scrolled = true;
		}
		else if (stick) box.scrollTop = box.scrollHeight;
		lightMap(box);
	}

	// Action is the one surface here Felix TYPES into, so the box's own signature carries **nothing
	// that his typing moves** (B23 §1): not the words, not the refusals they produce, not the send
	// verdict beside them. The target, the pane state and the batons are the whole of it — and at
	// `minimal` there is no box at all, which is the one state where the draft's own shape may
	// legally decide the region's contents.
	const sid = selection.session;
	const text = sid ? held(sid, v) : '';
	paint('chat:action', actionHost, JSON.stringify([
		sid, actionState, v?.target !== undefined && v?.target !== null,
		actionState === 'minimal' ? (text.trim() === '' ? 0 : text.split('\n').length) : null,
		actionState === 'expanded' ? [snap?.queue.filter(i => i.building === v?.target?.building).map(i => i.key), snap?.workshop?.tail?.baton?.text.name] : null,
	]), h => drawAction(h, actionState));

	// The controls beside it, repainted on what they actually draw. A rebuild here cannot cost a
	// keystroke: the box is not inside this host.
	const actsHost = actionHost.querySelector<HTMLElement>('[data-chat-acts]');
	if (actsHost && sid && v)
		paint('chat:acts', actsHost, JSON.stringify([sid, v.send, refusals(text).map(r => r.code), receipt(`chat:${sid}`)]),
			h => drawActs(h, sid, v, text));

	// The box is outside every signature, so nothing rebuilds it when the SERVER's copy of the draft
	// moves — a send emptying it, or the file changing under a hotswap. It is re-seated here instead,
	// and never while he is in it (the desk's own rule, `desk.client.ts` §draw).
	const draftBox = actionHost.querySelector<HTMLTextAreaElement>('[data-chat-draft]');
	if (draftBox && document.activeElement !== draftBox && draftBox.value !== text) draftBox.value = text;
}

export const chat: FocusView = {
	name: 'chat',
	title: 'the Chat',
	states: ['minimal', 'typical', 'expanded'],
	/** The building behind the target — what the batons beside the draft are read off (spec §5). */
	needs: focusState => (focusState === 'minimal' ? null : view()?.target?.building ?? null),
	/** The session itself: the deck's sixth seam member, and the only thing this tenant needs. */
	asks: () => selection.session,
	mount(focus, action) {
		focusHost = focus;
		actionHost = action;
		// **Nothing here loads anything.** The scroll used to page the transcript, and paging on a
		// scroll is what made the top of a conversation snap back down or stick (the punch list). It
		// now reads two facts off the pane and writes them back: whether he is at the end, and which
		// marks are on screen.
		focus.addEventListener('scroll', e => {
			const host = e.target as HTMLElement;
			if (!host.classList.contains('ct-turns')) return;
			stick = host.scrollHeight - host.scrollTop - host.clientHeight < LIMITS.bottomPx;
			lightMap(host);
		}, true);
		action.addEventListener('input', e => {
			const area = e.target as HTMLTextAreaElement | null;
			const sid = area?.dataset?.['chatDraft'];
			if (!sid) return;
			save(sid, area!.value);
			// The refusal line and the send control are a function of the text, so they move with it —
			// without rebuilding the box he is typing in (the signature above excludes the words).
			repaint();
		});
		action.addEventListener('click', e => {
			const go = (e.target as Element | null)?.closest<HTMLElement>('[data-chat-send]');
			if (!go) return;
			const sid = go.dataset['chatSend']!;
			void send(sid, held(sid, view()));
		});
		focus.addEventListener('click', e => {
			const mark = (e.target as Element | null)?.closest<HTMLElement>('[data-chat-mark]');
			if (!mark) return;
			// **The minimap is spatial** (his ruling): every mark is a place in this scroll view, and a
			// click goes there. Nothing is fetched and nothing is replaced — a mark whose turn the deck
			// does not hold says so instead of loading a window that would look like the present.
			aim = Number(mark.dataset['chatMark']);
			scrolled = false;
			stick = false;
			repaint();
		});
	},
	unmount() { focusHost = null; actionHost = null; },
	draw(s, focusState, actionState) {
		snap = s;
		states = [focusState, actionState];
		draw();
	},
};

moveIn(chat);

/**
 * The hotswap, from anywhere on the deck (spec §1). The shell's click handler calls this rather than
 * every surface knowing how to swap a tenant in — one chat view means one way in.
 */
export function chatTo(sid: string): void {
	retarget(sid);
	swap.to?.('chat');
}

/**
 * The Grep's session jump (B21): the same one view, scrolled **to the matching turn**. The offset is
 * the matching line's own byte offset, which is the coordinate a turn is keyed by, so the aim is set
 * here and `draw` resolves it into a turn the moment the whole transcript is in hand.
 *
 * A hit in the session already open re-aims rather than doing nothing: `retarget` short-circuits on
 * the same sid, so the aim is set here, after it, either way.
 */
export function chatAt(sid: string, at: number | null): void {
	retarget(sid);
	aim = at;
	scrolled = false;
	stick = at === null;
	swap.to?.('chat');
	repaint();
}

/** The keel's *"summoning swaps in the Chat"*: a stamp to latch onto when the census names it. */
export function chatAwait(stampName: string): void {
	retarget(null);
	selection.awaiting = stampName;
	swap.to?.('chat');
}
