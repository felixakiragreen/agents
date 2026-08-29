// The desk — the place Felix writes (B19, D17, keel §8). The deck's fourth Focus tenant, moved in
// through the `FocusView` seam and nowhere else.
//
// **Focus is the drawer** — every note, newest first, one line each — and **Action is the writing
// surface**, which is where the spec puts it: minimal is one line, typical is the editor, expanded
// adds the receipts. Action follows Focus, so one tenant owns both hosts and the note open in the
// list is the note in the box.
//
// **The desk grows no transport.** Three routes leave this file and every one of them is somebody
// else's wire: `POST /desk/file` is B6's inbox append (composed and audited there), `POST
// /chat/draft` is B16's draft box, and the composer is reached through the seam's own cell. Nothing
// here spawns a session, and the spawning hand's path is not spelled anywhere in this file — which
// is the check itself (B17 F1: *which source contains it*), so this comment must not spell it either.
//
// **Every route is previewed before it fires.** A click on a route asks the server what it would
// write and renders the exact bytes; only that render carries the button. A plan with a refusal
// carries none at all — what stands there is the reason (D10 as structure, B16's shape).

import type { DeckSnapshot, DeskNote, DeskPlan, DeskRead, DeskRouteName, PaneState } from './deck-model';
import { compose, moveIn, selection, swap, type FocusView } from './deck-view';
import { button, el, paint, receipt, remember, remembered, say, stamp } from './deck-dom';

/** Everything has a limit: what the drawer lays out, and how often a keystroke reaches the disk. */
const LIMITS = { listed: 60, saveMs: 600, preview: 4 << 10 } as const;

const OPEN_KEY = 'belvedere.deck.desk';

// ---------- what the tenant is holding ----------

let focusHost: HTMLElement | null = null;
let actionHost: HTMLElement | null = null;
let snap: DeckSnapshot | null = null;
let states: [PaneState, PaneState] = ['minimal', 'minimal'];

let notes: DeskNote[] = [];
let open: DeskRead | null = null;
/** The slug of a note being written that has not been saved yet is `null` — the save mints it. */
let slug: string | null = remembered(OPEN_KEY, v => (typeof v === 'string' ? v : null));
/** The box. His from the first keystroke; nothing rewrites it while `dirty` (B17 F3's rule). */
let text = '';
let dirty = false;
let saveTimer = 0;
let plan: DeskPlan | null = null;
let asking = false;

type Regions = { head: HTMLElement; area: HTMLTextAreaElement; acts: HTMLElement; prev: HTMLElement; foot: HTMLElement };
let regions: Regions | null = null;

const post = async <T>(path: string, body: unknown): Promise<T> => {
	const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return await r.json() as T;
};
const get = async <T>(path: string): Promise<T> =>
	await (await fetch(path, { headers: { accept: 'application/json' } })).json() as T;

type Answer<T> = { ok: boolean; error?: string; result?: T };

// ---------- the drawer ----------

async function refresh(): Promise<void> {
	try {
		const r = await get<Answer<{ dir: string; notes: DeskNote[] }>>('/desk/notes');
		notes = r.ok && r.result ? r.result.notes : [];
	}
	catch (e) { say('desk', String(e)); }
	draw();
}

async function openNote(name: string): Promise<void> {
	try {
		const r = await get<Answer<DeskRead>>(`/desk/note?slug=${encodeURIComponent(name)}`);
		if (!r.ok || !r.result) return say('desk', r.error ?? 'the desk could not open that note');
		open = r.result;
		slug = r.result.slug;
		remember(OPEN_KEY, slug);
		text = r.result.text;
		dirty = false;
		plan = null;
		if (regions) regions.area.value = text;
		draw();
	}
	catch (e) { say('desk', String(e)); }
}

/** A blank page. The slug is minted by the first save, so an unsaved note costs the drawer nothing. */
function newNote(): void {
	open = null;
	slug = null;
	remember(OPEN_KEY, null);
	text = '';
	dirty = false;
	plan = null;
	if (regions) { regions.area.value = ''; regions.area.focus(); }
	draw();
}

/**
 * Autosave. Debounced, because a keystroke is not a document — the file is the backstop for a
 * reload and a killed server (B8's drill), not a per-character log.
 */
function save(): void {
	clearTimeout(saveTimer);
	saveTimer = window.setTimeout(() => void store(), LIMITS.saveMs);
}

async function store(): Promise<void> {
	try {
		const r = await post<Answer<DeskNote>>('/desk/save', { slug: slug ?? '', text });
		if (!r.ok || !r.result) return say('desk', r.error ?? 'the save was refused');
		// The mint answers a name, and it is adopted here so the next keystroke does not open a
		// second note. The box is never re-seated from an answer he is still typing into.
		if (slug === null) { slug = r.result.slug; remember(OPEN_KEY, slug); }
		dirty = false;
		if (open) open = { ...open, ...r.result };
		void refresh();
	}
	catch (e) { say('desk', String(e)); }
}

// ---------- the routes ----------

const buildingPath = (): string =>
	snap?.register.buildings.find(b => b.building === selection.building)?.path ?? '';

const ROUTE_WORD: Readonly<Record<DeskRouteName, string>> = {
	issues: '→ inbox', session: '→ session', composer: '→ composer',
};

/**
 * Ask what a route would do. **The plan is the preview and the preview is the plan** — the bytes
 * this renders are the bytes the route writes, composed once, server-side (`desk.ts` §planRoute).
 */
async function ask(to: DeskRouteName): Promise<void> {
	if (slug === null) return say('desk', 'save something first — a route needs a note on disk');
	asking = true;
	plan = null;
	draw();
	try {
		const r = await post<Answer<DeskPlan>>('/desk/preview',
			{ slug, to, building: to === 'issues' ? buildingPath() : '', sid: to === 'session' ? selection.session ?? '' : '' });
		if (!r.ok || !r.result) say('desk', r.error ?? 'the desk could not plan that route');
		else plan = r.result;
	}
	catch (e) { say('desk', String(e)); }
	finally { asking = false; draw(); }
}

/** The one irreversible route: B6's append, carrying the sha the page was showing (B11's arm law). */
async function fire(p: DeskPlan): Promise<void> {
	say('desk', 'filing…');
	try {
		const r = await post<Answer<{ path: string; line: string; bytes: number; minted: boolean; receipt: string }>>(
			'/desk/file', { slug: p.slug, to: 'issues', building: buildingPath(), sha: p.sha });
		if (!r.ok || !r.result) return say('desk', r.error ?? 'the filing was refused');
		say('desk', `filed ${r.result.bytes} B${r.result.minted ? ' · inbox minted' : ''} · ${r.result.receipt}`);
		plan = null;
		await openNote(p.slug);           // the receipt is on the note now; read it back off the file
		void refresh();
	}
	catch (e) { say('desk', String(e)); }
}

/** To the Chat's draft box — B16's wire, and then the shell brings the Chat forward. */
async function toSession(p: DeskPlan): Promise<void> {
	const sid = selection.session;
	if (!sid) return say('desk', 'no session chosen');
	say('desk', 'handing it over…');
	try {
		const r = await post<Answer<{ path: string; bytes: number }>>('/chat/draft', { sid, text: p.text });
		if (!r.ok) return say('desk', r.error ?? 'the draft was refused');
		say('desk', `in the Chat’s draft for ${sid.slice(0, 8)} · ${p.bytes} B — send it there (B16 verifies delivery)`);
		plan = null;
		swap.to?.('chat');
	}
	catch (e) { say('desk', String(e)); }
}

/** To the composer, through the seam's own cell — the desk never reaches into another surface. */
function toComposer(p: DeskPlan): void {
	if (!compose.with) return say('desk', 'the composer is not mounted — open the Workshop once and it is');
	compose.with(p.text);
	say('desk', `${p.bytes} B loaded as the summons — the composer resolves it live`);
	plan = null;
	swap.to?.('workshop');
}

// ---------- Focus: the drawer ----------

function drawList(host: HTMLElement): void {
	host.append(el('span', 'big', 'desk'));
	const acts = el('div', 'qacts');
	acts.append(button('st wide', '+ new note', 'a blank page; the first save names it after today'));
	acts.lastElementChild!.setAttribute('data-desk-new', 'yes');
	acts.append(el('span', 'quiet', `${notes.length} note${notes.length === 1 ? '' : 's'}`));
	host.append(acts);

	if (!notes.length) {
		host.append(el('p', 'quiet prose', 'Nothing here yet. Write in Action — notes, dreams, draft summons — and it lands in desk/ as plain markdown. The first line is the title.'));
		return;
	}
	const list = el('ul', 'rows');
	for (const n of notes.slice(0, LIMITS.listed)) {
		const row = el('li', `row${n.slug === slug ? ' on' : ''}`);
		row.dataset['deskOpen'] = n.slug;
		row.append(el('span', 'name', n.title));
		if (n.routed) row.append(el('span', 'num', `↗${n.routed}`));
		row.append(el('span', 'num', `${n.bytes}`));
		row.append(stamp(n.at));
		list.append(row);
	}
	host.append(list);
}

// ---------- Action: the writing surface ----------

function drawHead(host: HTMLElement): void {
	host.textContent = '';
	host.append(el('span', 'big', 'write'));
	host.append(el('span', 'pill tone-grey', slug ?? 'unsaved'));
	if (open?.routed) host.append(el('span', 'quiet', `routed ${open.routed}×`));
}

function drawActs(host: HTMLElement): void {
	host.textContent = '';
	const where: Readonly<Record<DeskRouteName, string>> = {
		issues: selection.building ? `${selection.building}/ISSUES.md` : 'pick a building in the City',
		session: selection.session ? `the Chat’s draft for ${selection.session.slice(0, 8)}` : 'pick a session anywhere on the deck',
		composer: 'the summons body, live',
	};
	for (const to of ['issues', 'session', 'composer'] as DeskRouteName[]) {
		const b = button('st wide', ROUTE_WORD[to], `${where[to]} — previewed before it ignites`);
		b.dataset['deskRoute'] = to;
		b.dataset['on'] = plan?.to === to ? 'yes' : 'no';
		host.append(b);
	}
	if (asking) host.append(el('span', 'quiet', 'planning…'));
	const out = el('span', 'out', receipt('desk'));
	out.dataset['outFor'] = 'desk';
	host.append(out);
}

function drawPreview(host: HTMLElement): void {
	host.textContent = '';
	if (!plan) return;
	const box = el('div', 'desk-plan');
	const h = el('div', 'plan-h');
	h.append(el('span', 'label', ROUTE_WORD[plan.to]));
	h.append(el('span', 'who', plan.where));
	box.append(h);

	if (plan.refusal !== null) {
		// D10 as structure: no button at all where a route cannot go. The reason is the control.
		box.append(el('p', 'reason prose', plan.refusal));
		host.append(box);
		return;
	}
	box.append(el('span', 'label', plan.to === 'issues'
		? 'the exact bytes that will be appended — verbatim, before sign-off'
		: 'the exact bytes that will be handed over'));
	const pre = el('pre', 'summons-out');
	pre.textContent = plan.text.length > LIMITS.preview ? `${plan.text.slice(0, LIMITS.preview)}\n… ${plan.bytes} B in all` : plan.text;
	box.append(pre);

	const acts = el('div', 'qacts');
	const go = button('st wide arm', plan.to === 'issues' ? 'file it' : plan.to === 'session' ? 'hand it over' : 'load it', plan.where);
	go.dataset['deskGo'] = plan.to;
	acts.append(go);
	acts.append(el('span', 'quiet', `${plan.bytes} B · sha ${plan.sha}`));
	box.append(acts);
	host.append(box);
}

function drawFoot(host: HTMLElement): void {
	host.textContent = '';
	if (states[1] !== 'expanded') return;
	if (open?.routes.length) {
		host.append(el('span', 'label', 'where this note has been'));
		for (const line of open.routes) host.append(el('p', 'quiet prose', line));
	}
	host.append(el('p', 'quiet prose',
		'Every save is a plain file under desk/ and nowhere else — no path comes from a URL. '
		+ 'Commits are never the deck’s (D18 class 3): the files sit on disk and a session, or Felix, commits them.'));
}

// ---------- the tenant ----------

function draw(): void {
	if (!focusHost || !actionHost) return;
	const [focusState, actionState] = states;

	paint('desk:focus', focusHost, JSON.stringify([
		focusState, slug, notes.map(n => [n.slug, n.title, n.bytes, n.routed]),
	]), h => {
		if (focusState === 'minimal') {
			h.append(el('span', 'big', 'desk'));
			h.append(el('span', 'st-word', `${notes.length}`));
			return;
		}
		drawList(h);
	});

	const r = regions;
	if (!r) return;
	// The box is the one surface on this deck he types into besides the composer's, so it is BUILT
	// ONCE at mount and only its neighbours are rewritten (B14 F4 taken to its conclusion): a
	// mid-sentence rebuild would eat the note, which is the whole reason the desk exists.
	drawHead(r.head);
	if (actionState === 'minimal') {
		r.acts.textContent = '';
		r.prev.textContent = '';
		r.foot.textContent = '';
		return;
	}
	drawActs(r.acts);
	drawPreview(r.prev);
	drawFoot(r.foot);
	if (!dirty && document.activeElement !== r.area && r.area.value !== text) r.area.value = text;
}

export const desk: FocusView = {
	name: 'desk',
	title: 'the desk',
	states: ['minimal', 'typical', 'expanded'],

	mount(focus, action) {
		focusHost = focus;
		actionHost = action;

		const head = el('div', 'c-head');
		const area = el('textarea', 'prose desk-in') as HTMLTextAreaElement;
		area.rows = 14;
		area.spellcheck = true;
		area.placeholder = 'a note, a dream, a draft summons — the first line is its title';
		area.value = text;
		area.dataset['deskWrite'] = 'yes';
		const acts = el('div', 'qacts');
		const prev = el('div', 'desk-prev');
		const foot = el('div', 'desk-foot');
		action.append(head, area, acts, prev, foot);
		regions = { head, area, acts, prev, foot };

		area.addEventListener('input', () => {
			text = area.value;
			dirty = true;
			// A note whose words moved is a plan nobody reviewed: the preview disarms with them (D10).
			if (plan) { plan = null; drawPreview(prev); }
			save();
		});

		action.addEventListener('click', e => {
			const go = (e.target as Element | null)?.closest<HTMLElement>('[data-desk-go]');
			if (!go || !plan) return;
			if (plan.to === 'issues') void fire(plan);
			else if (plan.to === 'session') void toSession(plan);
			else toComposer(plan);
		});
		action.addEventListener('click', e => {
			const to = (e.target as Element | null)?.closest<HTMLElement>('[data-desk-route]')?.dataset['deskRoute'];
			if (to) void ask(to as DeskRouteName);
		});
		focus.addEventListener('click', e => {
			const target = e.target as Element | null;
			if (target?.closest('[data-desk-new]')) return newNote();
			const row = target?.closest<HTMLElement>('[data-desk-open]');
			if (row) void openNote(row.dataset['deskOpen']!);
		});

		void refresh().then(() => {
			// *"New note, or continue the last"* (spec §2): the note he had open, else the newest, else
			// a blank page. Remembered per viewer and never load-bearing (`deck-dom.ts` §storage).
			//
			// **Only when it is not already open.** The module outlives the mount, so a swap away and
			// back re-runs this — and a re-read landing *after* a click would clear the plan that click
			// had just asked for: a preview that vanishes on its way to being read.
			const want = slug ?? notes[0]?.slug ?? null;
			if (want && open?.slug !== want) void openNote(want);
		});
	},

	unmount() {
		clearTimeout(saveTimer);
		// A pane swapped away mid-sentence must not lose the sentence: the debounce is cancelled above
		// and the pending write is made now, rather than waiting for a timer whose host is gone.
		if (dirty) void store();
		focusHost = null;
		actionHost = null;
		regions = null;
	},

	draw(s, focusState, actionState) {
		snap = s;
		states = [focusState, actionState];
		draw();
	},
};

moveIn(desk);

/**
 * The Grep's desk jump (B21): the note itself, open in the editor. Same shape as the Chat's
 * hotswap — the shell calls this rather than every surface knowing how to bring a tenant forward.
 *
 * The remembered slug is set **before** the swap, because `mount()` runs again on every swap-in and
 * ends by re-opening what it remembers (B19 F2): setting it first makes the mount's own restore open
 * the right note, and the explicit `openNote` below is only for the case where the desk was already
 * standing and no mount will run.
 */
export function deskTo(name: string): void {
	const standing = focusHost !== null;
	slug = name;
	remember(OPEN_KEY, name);
	swap.to?.('desk');
	if (standing && open?.slug !== name) void openNote(name);
}
