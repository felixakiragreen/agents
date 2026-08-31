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
	refusals,
	type ChatBlock, type ChatStep, type ChatTurn, type ChatView, type DeckSnapshot, type PaneState, type QueueItem,
} from './deck-model';
import { moveIn, selection, swap, viewer, type FocusView } from './deck-view';
import { button, drawSpans, el, paint, reading, receipt, say, stamp, words } from './deck-dom';

/** Everything has a limit: what the browser lays out, and how often a keystroke reaches the disk. */
const LIMITS = { held: 400, saveMs: 600, nearTop: 120 } as const;

// ---------- what the tenant is holding ----------

let focusHost: HTMLElement | null = null;
let actionHost: HTMLElement | null = null;
let snap: DeckSnapshot | null = null;
let states: [PaneState, PaneState] = ['minimal', 'minimal'];

/**
 * Windows loaded by scrolling up, oldest first, and the byte offset the oldest of them begins at.
 * The poll always carries the **tail**; earlier windows are a gesture's answer and are held here —
 * which is why a turn's key is a byte offset (`chat.ts` §windowOf): it is the only thing that lets
 * a held window and a fresh tail be merged without ever drawing a turn twice.
 */
let earlier: ChatTurn[] = [];
let from = 0;
let loading = false;

/**
 * **The jump target** (B21): the byte offset a grep hit aimed at, and the turn the server says it
 * landed in. While it is set the view is that window and **not** the live tail — a hit in a
 * three-week-old conversation followed by today's last forty turns would draw a continuity that is
 * not there. `[↓ latest]` clears it and the poll's tail comes back.
 */
let aim: { at: number; key: number | null } | null = null;
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
	toLatest();
}

/** Back to the tail: the poll's own window, stuck to the bottom, nothing held in front of it. */
function toLatest(): void {
	earlier = [];
	from = 0;
	loading = false;
	aim = null;
	scrolled = false;
	stick = true;
	repaint();
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
	const hit = aim !== null && aim.key === t.key;
	const art = el('article', `ct ct-${t.role}${hit ? ' ct-aim' : ''}`);
	art.dataset['key'] = String(t.key);
	if (hit) art.dataset['aim'] = String(aim!.at);
	const head = el('div', 'ct-h');
	head.append(el('span', 'who', WHO(t, name)));
	if (t.at !== null) head.append(stamp(t.at));
	art.append(head);
	for (const b of t.blocks) drawBlock(art, b, doc);
	if (t.folded) art.append(el('div', 'quiet', `+${t.folded} more tool calls in this turn — the pane has the full record`));
	host.append(art);
}

/**
 * The tail the poll carries, with every earlier window already held in front of it — **or, while a
 * jump is standing, only the held windows**, because the aimed window and the live tail are two
 * places in the file and stitching them would draw a conversation that never happened.
 */
const allTurns = (v: ChatView): ChatTurn[] => {
	if (aim) return earlier.slice(-LIMITS.held);
	const seen = new Set(v.turns.map(t => t.key));
	return [...earlier.filter(t => !seen.has(t.key)), ...v.turns].slice(-LIMITS.held);
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
			? 'reading the window around your hit…'
			: 'This transcript holds no turn the deck can read — a session that never spoke, or a window of pure tool traffic.'));
		return;
	}

	const body = el('div', 'ct-body');
	const box = el('div', 'ct-turns');
	box.id = 'chat-turns';
	// A standing jump says so, and says how to leave: this window is somewhere in the file's past, and
	// the deck must not let it be mistaken for what the session is saying now.
	if (aim) {
		const line = el('div', 'ct-aim-note');
		line.append(el('span', 'label', aim.key === null ? 'jumped — the turn is outside this window' : 'jumped to your search hit'));
		const back = button('st wide', '↓ latest', 'back to the live tail of this transcript');
		back.dataset['chatLatest'] = 'yes';
		line.append(back);
		box.append(line);
	}
	if (from > 0 || v.from > 0) {
		const more = button('st wide', loading ? 'loading…' : '↑ earlier', 'scroll up, or press: the window before this one');
		more.dataset['chatEarlier'] = 'yes';
		box.append(more);
	}
	else box.append(el('p', 'quiet', 'the beginning of this transcript'));
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
 * **The minimap** (C16 §6): the whole transcript as one strip, always the pane's full height and
 * never scrolling itself. One mark per turn — Felix's and the agent's in different colours — with
 * the loaded window lit, so the strip says *where in the conversation this window is*. A click loads
 * the window around that turn through the same gesture route the Grep's jump uses (B21), so the
 * anchor the server names is what lands rather than the DOM's opinion of where it scrolled to.
 *
 * Marks are the SERVER's index of the file, not the window's turns: a minimap of the forty turns
 * already on screen would be a picture of the keyhole.
 */
function minimap(v: ChatView, drawn: ChatTurn[]): HTMLElement {
	const strip = el('div', 'ct-map');
	if (!v.marks.length) return strip;
	strip.dataset['tip'] = `${v.turnCount} turns · ${v.marks.length} marks · yours lit, the agent’s grey`;
	strip.dataset['tipMore'] = (v.marks.length < v.turnCount
		? 'The strip holds one mark per turn up to its own limit; beyond that the marks are spaced evenly across the file, so the first and last turns always have one. '
		: 'One mark per turn of the whole transcript. ')
		+ 'Bright marks are the window on screen. Click any mark to load the window around that turn.';
	const first = drawn.at(0)?.key ?? 0;
	const last = drawn.at(-1)?.key ?? 0;
	for (const m of v.marks) {
		const lit = m.key >= first && m.key <= last;
		const mark = el('button', `ct-mark ct-mark-${m.role}${lit ? ' on' : ''}${aim?.key === m.key ? ' aim' : ''}`) as HTMLButtonElement;
		mark.type = 'button';
		mark.dataset['chatMark'] = String(m.key);
		mark.setAttribute('aria-label', `${m.role === 'user' ? 'your' : 'the agent’s'} turn at byte ${m.key}`);
		strip.append(mark);
	}
	return strip;
}

// ---------- the jump: one window, around a byte offset (B21) ----------

/**
 * The window a grep hit points at. It rides `/deck/chat` — the same gesture route the scroll-up
 * uses — because a jump is a thing Felix clicked once, not something the poll should carry (B19 F4).
 */
async function loadAround(sid: string, at: number): Promise<void> {
	loading = true;
	repaint();
	try {
		const r = await fetch(`/deck/chat?sid=${encodeURIComponent(sid)}&at=${at}`,
			{ headers: { accept: 'application/json' } });
		const win = await r.json() as ChatView;
		earlier = win.turns;
		from = win.from;
		aim = { at, key: win.anchor };
		scrolled = false;
	}
	catch (e) { say(`chat:${sid}`, String(e)); aim = null; }
	finally { loading = false; repaint(); }
}

// ---------- earlier windows: a gesture, never a second timer ----------

async function loadEarlier(): Promise<void> {
	const v = view();
	if (loading || !v || !selection.session) return;
	const before = from > 0 ? from : v.from;
	if (before <= 0) return;
	loading = true;
	repaint();
	try {
		const r = await fetch(`/deck/chat?sid=${encodeURIComponent(selection.session)}&before=${before}`,
			{ headers: { accept: 'application/json' } });
		const older = await r.json() as ChatView;
		const seen = new Set(earlier.map(t => t.key));
		earlier = [...older.turns.filter(t => !seen.has(t.key)), ...earlier].slice(-LIMITS.held);
		// A window that answered nothing older than what we hold is the beginning of the file: say so
		// by keeping `from` where it is rather than looping on the same offset forever.
		from = older.from > 0 && older.from < before ? older.from : 0;
	}
	catch (e) { say(`chat:${selection.session}`, String(e)); }
	finally { loading = false; repaint(); }
}

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

	if (state === 'expanded') drawBatons(host, v.target.building);
}

// ---------- the tenant ----------

/** Stuck to the bottom unless he has scrolled away: a live turn should not yank his reading. */
let stick = true;

function draw(): void {
	if (!focusHost || !actionHost) return;
	latch();
	const [focusState, actionState] = states;
	const v = view();

	const turns = v ? allTurns(v) : [];
	// C15 F3's law: everything `draw` reads is in the signature. The minimap's marks are an
	// append-only index, so three numbers pin them — the file's turn count, how many marks came back,
	// and the newest one's key — rather than six hundred keys re-serialized on every poll.
	paint('chat:focus', focusHost, JSON.stringify([
		selection.session, selection.awaiting, focusState, loading, from, v?.error, v?.target, aim,
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
	// The jump's own scroll happens once per aim: after that the pane is his to read, and a repaint
	// three seconds later must not yank him back to the hit.
	const target = box && aim && !scrolled && aim.key !== null
		? box.querySelector<HTMLElement>(`[data-key="${CSS.escape(String(aim.key))}"]`) : null;
	if (target) { target.scrollIntoView({ block: 'center' }); scrolled = true; }
	else if (box && stick && !aim) box.scrollTop = box.scrollHeight;

	// Action is the one surface here Felix TYPES into, so it is painted by a signature that
	// deliberately excludes his own text (B14 F4): the box is rebuilt when the target, the pane state
	// or the send's own verdict changes, and never because he pressed a key or a poll landed.
	const sid = selection.session;
	paint('chat:action', actionHost, JSON.stringify([
		sid, actionState, v?.send, v?.target?.building, v?.target?.state,
		refusals(sid ? held(sid, v) : '').map(r => r.code),
		actionState === 'expanded' ? [snap?.queue.filter(i => i.building === v?.target?.building).map(i => i.key), snap?.workshop?.tail?.baton?.text.name] : null,
	]), h => drawAction(h, actionState));
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
		focus.addEventListener('scroll', e => {
			const host = e.target as HTMLElement;
			if (!host.classList.contains('ct-turns')) return;
			stick = host.scrollHeight - host.scrollTop - host.clientHeight < 40;
			if (host.scrollTop < LIMITS.nearTop) void loadEarlier();
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
			const t = e.target as Element | null;
			if (t?.closest('[data-chat-earlier]')) return void loadEarlier();
			if (t?.closest('[data-chat-latest]')) return void toLatest();
			const mark = t?.closest<HTMLElement>('[data-chat-mark]');
			// Every mark takes the same road, including one already on screen: the window around a turn
			// is the server's answer, and a client that sometimes scrolled instead would be two jumps.
			if (mark && selection.session) {
				const at = Number(mark.dataset['chatMark']);
				aim = { at, key: null };
				earlier = [];
				from = 0;
				scrolled = false;
				stick = false;
				void loadAround(selection.session, at);
			}
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
 * The Grep's session jump (B21): the same one view, opened **at the matching turn**. The offset is
 * the matching line's own byte offset, which is the coordinate a turn is keyed by — so the server
 * answers the window around it and names the turn, and this scrolls to it and marks it.
 *
 * A hit in the session already open re-aims rather than doing nothing: `retarget` short-circuits on
 * the same sid, so the aim is set here, after it, either way.
 */
export function chatAt(sid: string, at: number | null): void {
	retarget(sid);
	if (at === null) toLatest();
	else { aim = { at, key: null }; earlier = []; from = 0; scrolled = false; stick = false; void loadAround(sid, at); }
	swap.to?.('chat');
}

/** The keel's *"summoning swaps in the Chat"*: a stamp to latch onto when the census names it. */
export function chatAwait(stampName: string): void {
	retarget(null);
	selection.awaiting = stampName;
	swap.to?.('chat');
}
