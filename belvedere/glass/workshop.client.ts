// The Workshop — one building, inside (B15). The deck's first real Focus tenant, moved in through
// the `FocusView` seam and nowhere else (D13: *"panes are a replaceable surface"*).
//
// What it draws, in Felix's own order (field report): **LIVE SESSIONS first**, then the building's
// truth — board, ledger tail, decision queue, ISSUES. Every section collapses, the order is his to
// drag, and both survive a reload in `localStorage` (never load-bearing: no memory renders the
// defaults). A `path:line` reference anywhere in this pane opens the viewer **at that line, marked**
// — the third item of the field report, which is the whole reason this pane has a viewer at all.
//
// **Nothing here fires.** One wire leaves this file: `POST /hands/focus`, his eyes moving to a
// panel. The fire hand is unreachable from this pane, and `lab/b15/probe.ts` greps this source and
// the served bundle for its path to keep it that way (D10) — which is why the path is not spelled
// out anywhere in this file, comments included.

import {
	SECTIONS, moved, toCollapsed, toSections,
	type DeckSession, type DeckSnapshot, type DocRef, type PaneState, type Prose, type Section,
	type WorkshopBoard, type WorkshopDetail, type WorkshopRow,
} from './deck-model';
import { moveIn, selection, viewer, type FocusView } from './deck-view';
import { button, dot, dots, drawProse, drawSpans, el, named, paint, plain, reading, receipt, remember, remembered, stamp, tipSession, words } from './deck-dom';

/** Everything has a limit: a tooltip carrying a whole landing record is a tooltip nobody can read. */
const TIP_CAP = 400;
const tipOf = (p: Prose, fallback: string): string => {
	const t = plain(p);
	return t === '' ? fallback : t.length > TIP_CAP ? `${t.slice(0, TIP_CAP)}…` : t;
};

const ORDER_KEY = 'belvedere.workshop.order';
const SHUT_KEY = 'belvedere.workshop.collapsed';

const SECTION_TITLE: Readonly<Record<Section, string>> = {
	sessions: 'live sessions', board: 'board', ledger: 'ledger tail', decisions: 'decisions', issues: 'issues',
};

// ---------- what the viewer is holding ----------

let order: Section[] = remembered(ORDER_KEY, toSections) ?? [...SECTIONS];
let shut = new Set<Section>(remembered(SHUT_KEY, toCollapsed) ?? []);
/** The document open in Focus, or null for the panels. Transient by design — a view, not a place. */
let viewing: { path: string; line: number | null; label: string; lines: string[]; error: string | null } | null = null;
let focusHost: HTMLElement | null = null;
let actionHost: HTMLElement | null = null;
let snap: DeckSnapshot | null = null;
let states: [PaneState, PaneState] = ['minimal', 'minimal'];

/**
 * Redraw this tenant from what it is already holding. The shell redraws on a poll or a layout
 * change; a fold, a drag and an opened document are the *tenant's* own changes, and it must not
 * have to wait three seconds for the deck to notice them.
 */
const repaint = (): void => draw();

const saveOrder = () => { remember(ORDER_KEY, order); repaint(); };
const saveShut = () => { remember(SHUT_KEY, [...shut]); repaint(); };

// ---------- the viewer (spec §3): a `path:line` reference lands ON the line ----------

/**
 * Open a document inside Focus, scrolled to its line with that line marked.
 *
 * The fetch is one-shot on a click, never a poll: `/deck/state` stays the deck's single recurring
 * read (B13 F5), and a document is bytes Felix asked for once. An unreadable path renders its own
 * reason — the field report's complaint was a link that went nowhere *silently*.
 */
async function openDoc(path: string, line: number | null): Promise<void> {
	viewing = { path, line, label: path, lines: [], error: null };
	repaint();
	try {
		const r = await fetch(`/deck/doc?p=${encodeURIComponent(path)}`);
		const d = await r.json() as { ok: boolean; error?: string; label?: string; lines?: string[]; truncated?: boolean };
		viewing = d.ok
			? { path, line, label: d.label ?? path, lines: d.lines ?? [], error: d.truncated ? 'truncated at the read limit' : null }
			: { path, line, label: path, lines: [], error: d.error ?? 'unreadable' };
	}
	catch (e) { viewing = { path, line, label: path, lines: [], error: String(e) }; }
	repaint();
}

const closeDoc = (): void => { viewing = null; repaint(); };

function drawViewer(host: HTMLElement): void {
	const v = viewing!;
	const head = el('div', 'doc-h');
	const back = button('st wide', '← panels', 'back to this building’s sections');
	back.addEventListener('click', closeDoc);
	head.append(back, el('span', 'doc-name', `${v.label}${v.line === null ? '' : `:${v.line}`}`));
	const out = el('a', 'st wide', 'open page') as HTMLAnchorElement;
	out.href = `/doc?p=${encodeURIComponent(v.path)}`;
	head.append(out);
	host.append(head);

	if (v.error) host.append(el('p', 'quiet prose', v.error));
	if (!v.lines.length) { host.append(el('p', 'quiet prose', v.error ? '' : 'reading…')); return; }

	const box = el('div', 'doc-lines');
	let target: HTMLElement | null = null;
	for (const [n, text] of v.lines.entries()) {
		const no = n + 1;
		const row = el('div', 'dl');
		row.dataset['line'] = String(no);
		if (no === v.line) { row.dataset['mark'] = 'yes'; target = row; }
		row.append(el('span', 'ln', String(no)), el('span', 'lt', text === '' ? ' ' : text));
		box.append(row);
	}
	host.append(box);
	// After layout, not during it: `scrollIntoView` on a node the browser has not placed yet centers
	// nothing. One frame is enough and is what the probe measures against.
	if (target) requestAnimationFrame(() => target!.scrollIntoView({ block: 'center' }));
}

// ---------- the sections ----------

function sectionHead(name: Section, count: string, ref: DocRef | null): HTMLElement {
	const h = el('div', 'sec-h');
	h.draggable = true;
	h.dataset['section'] = name;
	h.dataset['tip'] = SECTION_TITLE[name];
	h.dataset['tipMore'] = 'drag to reorder, or use ▲▼ — the order and what is collapsed are remembered in this browser';

	const fold = button('st', shut.has(name) ? '+' : '−', shut.has(name) ? 'open this section' : 'collapse this section');
	fold.addEventListener('click', ev => {
		ev.stopPropagation();
		if (shut.has(name)) shut.delete(name); else shut.add(name);
		saveShut();
	});
	h.append(fold, el('span', 'sec-name', SECTION_TITLE[name]), el('span', 'num', count));

	if (ref) {
		const link = button('ref', ref.label, `${ref.path}:${ref.line}`);
		link.addEventListener('click', ev => { ev.stopPropagation(); void openDoc(ref.path, ref.line); });
		h.append(link);
	}

	const moves = el('span', 'sec-moves');
	for (const [glyph, delta] of [['▲', -1], ['▼', 1]] as const) {
		const b = button('st', glyph, `move ${SECTION_TITLE[name]} ${delta < 0 ? 'up' : 'down'}`);
		b.dataset['move'] = `${name}:${delta}`;
		b.addEventListener('click', ev => { ev.stopPropagation(); order = moved(order, name, delta); saveOrder(); });
		moves.append(b);
	}
	h.append(moves);
	return h;
}

/** Live sessions, first by his ruling. The dot vocabulary is B14's, imported rather than restyled. */
function drawSessions(host: HTMLElement, ss: DeckSession[], stale: boolean): void {
	if (!ss.length) { host.append(el('p', 'quiet prose', 'Nothing alive in this building — every count on this deck is a floor (the census horizon).')); return; }
	const list = el('ul', 'ws-sessions');
	for (const s of ss) {
		const li = el('li', 'ws-session');
		li.dataset['sid'] = s.sid;
		// The name, the tooltip's depth and B18's rename/recolor controls are one function shared with
		// the City: two panes drawing a session must not disagree about what it is called (D16).
		tipSession(li, s);
		li.append(dot(s), named(s, stale));
		// A tier is `<model> · <effort>` and only half of it is on any artifact the glass can read:
		// the census carries no model field, and effort is on none at all (findings F1).
		li.append(el('span', 'tier', s.model ?? '—'));
		li.append(el('span', 'st-word', s.waiting ?? s.state), stamp(s.last));
		const jump = button('st', 'jump', s.pane ? 'focus this session’s cmux panel' : 'this session sits in no cmux pane');
		jump.dataset['jumpSid'] = s.sid;
		jump.disabled = !s.pane;
		// *"JUMP TO PANEL … does nothing"* (field report): it did something and nothing said so. The
		// shell's one `/hands/focus` wire reports into this span, and the receipt survives the repaint.
		const out = el('span', 'out', receipt(`jump:${s.sid}`));
		out.dataset['outFor'] = `jump:${s.sid}`;
		li.append(jump, out);
		list.append(li);
	}
	host.append(list);
}

function drawRow(host: HTMLElement, r: WorkshopRow): void {
	// Everything in this row was written in this board file, so that is what its code words resolve
	// against: belvedere's `D2` is belvedere's, canon's `D63` is canon's (B20 §2).
	const ctx = reading(r.ref.path);
	const li = el('li', `ws-row st-${r.state ? r.state.replace(' ', '-').toLowerCase() : 'unparsed'}`);
	li.dataset['row'] = r.id;
	li.dataset['tip'] = `${r.id} · ${r.state ?? 'unparsed'} · ${r.staffing}`;
	// §4: the depth on hover is the row's landing record — the longest prose the corpus writes, and
	// the densest in code words, which is why the tooltip's own body decodes (B20 §4's nesting).
	li.dataset['tipMore'] = tipOf(r.annotation, 'no status annotation on this row');
	li.dataset['tipIn'] = r.ref.path;

	const head = el('div', 'ws-row-h');
	const rid = el('span', 'rid');
	// The row's own id is a reference like any other: hovering `B18` on the board gives back its
	// encapsulation, its status and its plan — which is the order's first acceptance criterion.
	words(rid, r.id, ctx);
	head.append(rid, el('span', 'pill', r.state ?? 'UNPARSED'));
	const name = el('span', 'rname', '');
	if (r.workDoc) {
		const b = button('ref', '', `${r.workDoc.path}`);
		words(b, r.work.name, ctx);
		b.addEventListener('click', ev => { ev.stopPropagation(); void openDoc(r.workDoc!.path, null); });
		name.append(b);
	}
	else words(name, r.work.name, ctx);
	head.append(name, el('span', 'staff', r.staffing));
	li.append(head);

	if (r.gates.length) {
		const gates = el('div', 'gates');
		words(gates, r.gates.map(g => `Felix-gate: ${g}`).join(' · '), ctx);
		li.append(gates);
	}
	if (r.annotation.spans.length) li.append(drawProse(r.annotation, 'prose', openDoc, ctx));
	if (r.lint.length) li.append(el('div', 'lint', r.lint.join(' · ')));
	const where = button('ref quiet', `${r.ref.label}:${r.ref.line}`, 'open the board at this row');
	where.addEventListener('click', ev => { ev.stopPropagation(); void openDoc(r.ref.path, r.ref.line); });
	li.append(where);
	host.append(li);
}

function drawBoard(host: HTMLElement, boards: WorkshopBoard[]): void {
	if (!boards.length) { host.append(el('p', 'quiet prose', 'No board in this building.')); return; }
	for (const b of boards) {
		if (boards.length > 1) host.append(el('p', 'label', b.heading));
		const list = el('ul', 'ws-rows');
		for (const r of b.rows) drawRow(list, r);
		host.append(list);
	}
}

function drawTail(host: HTMLElement, d: WorkshopDetail): void {
	const t = d.tail;
	if (!t) { host.append(el('p', 'quiet prose', 'No LEDGER.md in this building.')); return; }
	const ctx = reading(t.ref.path);
	const head = el('div', 'ws-tail-h');
	head.append(el('span', 'who', `${t.date} · ${t.mantle}`));
	if (t.tier) head.append(el('code', '', t.tier));
	if (t.row) head.append(el('span', 'num', t.row));
	const where = button('ref quiet', `${t.ref.label}:${t.ref.line}`, 'open the ledger at this entry');
	where.addEventListener('click', ev => { ev.stopPropagation(); void openDoc(t.ref.path, t.ref.line); });
	head.append(where);
	host.append(head);
	host.append(drawProse(t.body, 'prose', openDoc, ctx));
	if (t.decided) {
		const line = el('div', 'kv');
		line.append(el('span', 'label', 'decided'));
		const v = el('span', 'prose');
		drawSpans(v, t.decided.spans, openDoc, ctx);
		line.append(v);
		host.append(line);
	}
	const baton = el('div', 'kv');
	baton.append(el('span', 'label', 'baton'));
	if (t.baton) {
		const v = el('span', `prose holder-${t.baton.holder}`);
		v.append(el('span', 'pill', t.baton.holder));
		drawSpans(v, t.baton.text.spans, openDoc, ctx);
		baton.append(v);
	}
	else baton.append(el('span', 'quiet', 'no Next clause'));
	host.append(baton);
	// Read, never wired: an instrument on this deck is text (D10). Firing lives in the composer.
	for (const i of t.baton?.instruments ?? [])
		host.append(el('pre', 'summons', i.kind === 'summons' ? i.text : `fire row ${i.text}`));
}

function drawDecisions(host: HTMLElement, d: WorkshopDetail): void {
	if (!d.decisions.length) { host.append(el('p', 'quiet prose', 'Empty — nothing waits on your pen.')); return; }
	const list = el('ul', 'ws-list');
	for (const x of d.decisions) {
		const li = el('li', 'ws-item');
		const ctx = reading(x.ref.path);
		li.dataset['decision'] = x.id;
		li.dataset['tip'] = `${x.id} · ${x.date} · ${x.decider}`;
		li.dataset['tipMore'] = tipOf(x.title, x.id);
		li.dataset['tipIn'] = x.ref.path;
		const head = el('div', 'ws-row-h');
		const did = el('span', 'rid');
		words(did, x.id, ctx);
		head.append(did, el('span', 'pill', x.state), el('span', 'who', x.decider));
		const where = button('ref quiet', `${x.ref.label}:${x.ref.line}`, 'open the decision');
		where.addEventListener('click', ev => { ev.stopPropagation(); void openDoc(x.ref.path, x.ref.line); });
		head.append(where);
		li.append(head, drawProse(x.title, 'prose', openDoc, ctx));
		list.append(li);
	}
	host.append(list);
}

function drawIssues(host: HTMLElement, d: WorkshopDetail): void {
	if (!d.files.issues) { host.append(el('p', 'quiet prose', 'No inbox in this building — the first gesture mints one (DOCTRINE §3).')); return; }
	if (!d.issues.length) { host.append(el('p', 'quiet prose', 'Drained empty (D53).')); return; }
	const list = el('ul', 'ws-list');
	for (const i of d.issues) {
		const li = el('li', 'ws-item');
		li.dataset['tip'] = `${i.date ?? ''} ${i.who ?? ''}`.trim() || 'an entry with no attribution line';
		li.dataset['tipMore'] = tipOf(i.text, 'an entry the parser read as empty');
		li.dataset['tipIn'] = i.ref.path;
		const head = el('div', 'ws-row-h');
		head.append(el('span', 'when', i.date ?? '—'), el('span', 'who', i.who ?? '—'));
		const where = button('ref quiet', `${i.ref.label}:${i.ref.line}`, 'open the inbox at this entry');
		where.addEventListener('click', ev => { ev.stopPropagation(); void openDoc(i.ref.path, i.ref.line); });
		head.append(where);
		li.append(head, drawProse(i.text, 'prose', openDoc, reading(i.ref.path)));
		list.append(li);
	}
	host.append(list);
}

const COUNTS: Readonly<Record<Section, (d: WorkshopDetail, ss: DeckSession[]) => string>> = {
	sessions: (_d, ss) => String(ss.length),
	board: d => String(d.boards.reduce((n, b) => n + b.rows.length, 0)),
	ledger: d => (d.tail ? d.tail.date : '—'),
	decisions: d => String(d.decisions.length),
	issues: d => String(d.issues.length),
};

const BODIES: Readonly<Record<Section, (host: HTMLElement, d: WorkshopDetail, ss: DeckSession[]) => void>> = {
	sessions: (h, _d, ss) => drawSessions(h, ss, snap !== null && snap.identity.error !== null),
	board: (h, d) => drawBoard(h, d.boards),
	ledger: (h, d) => drawTail(h, d),
	decisions: (h, d) => drawDecisions(h, d),
	issues: (h, d) => drawIssues(h, d),
};

const REFS: Readonly<Record<Section, (d: WorkshopDetail) => DocRef | null>> = {
	sessions: () => null,
	board: d => d.files.boards[0] ?? null,
	ledger: d => d.files.ledger,
	decisions: d => d.files.decisions,
	issues: d => d.files.issues,
};

// ---------- the tenant ----------

const mine = (s: DeckSnapshot | null, building: string | null): DeckSession[] =>
	(s?.census.sessions ?? []).filter(x => x.building === building && x.state !== 'gone');

/**
 * Minimal is one word and a mark (keel §2): the building's name, its dots, its badge counts. Nothing
 * else fits in a 12 %-wide track, and pretending otherwise is how the law of space dies.
 */
function drawMinimal(host: HTMLElement, ss: DeckSession[]): void {
	const d = snap?.workshop ?? null;
	host.append(el('span', 'big', (selection.building ?? 'workshop').split('/').at(-1) ?? 'workshop'));
	host.append(dots(ss));
	const badges = el('div', 'badges');
	for (const [k, n] of Object.entries(d?.badges ?? {})) if (n) badges.append(el('span', `badge b-${k}`, String(n)));
	host.append(badges);
}

function drawFocus(host: HTMLElement, state: PaneState): void {
	if (!selection.building) {
		host.append(el('span', 'big', 'workshop'));
		if (state !== 'minimal') host.append(el('p', 'quiet prose', 'Click a building in the City and it opens here: its live sessions first, then board, ledger tail, decisions and inbox.'));
		return;
	}
	const ss = mine(snap, selection.building);
	if (state === 'minimal') return drawMinimal(host, ss);
	if (viewing) return drawViewer(host);

	const d = snap?.workshop ?? null;
	const head = el('div', 'ws-head');
	head.append(el('span', 'big', selection.building), dots(ss));
	host.append(head);
	if (!d) {
		host.append(el('p', 'quiet prose', snap
			? `${selection.building} is not on the register — the walk found no doctrine artifact there.`
			: 'waiting for the first poll…'));
		return;
	}
	host.append(el('p', 'quiet prose', `${d.label} · ${d.path}${d.lint ? ` · ${d.lint} lint` : ''}`));

	// Typical shows the first three sections in his order; expanded shows all five. The *order* is
	// his, so "the first three" is whatever he dragged to the top — never a hard-coded subset.
	const showing = state === 'typical' ? order.slice(0, 3) : order;
	for (const name of showing) {
		const sec = el('section', 'sec');
		sec.dataset['sec'] = name;
		sec.dataset['open'] = shut.has(name) ? 'no' : 'yes';
		sec.append(sectionHead(name, COUNTS[name](d, ss), REFS[name](d)));
		if (!shut.has(name)) {
			const body = el('div', 'sec-body');
			BODIES[name](body, d, ss);
			sec.append(body);
		}
		host.append(sec);
	}
	if (state === 'typical' && order.length > showing.length)
		host.append(el('p', 'quiet prose', `${order.length - showing.length} more section(s) at expanded.`));
}

/**
 * Action follows Focus (keel §3). At rest it belongs to the **summon composer**, which is B17's —
 * so what stands here now is the building's own card and an honest note about what moves in. A
 * placeholder that says what it is beats a control that half-works.
 */
function drawAction(host: HTMLElement, state: PaneState): void {
	const d = snap?.workshop ?? null;
	host.append(el('span', 'big', 'act'));
	if (state === 'minimal') return;
	if (!d) { host.append(el('p', 'quiet prose', 'Pick a building in the City.')); return; }
	const ss = mine(snap, d.building);
	host.append(el('p', 'quiet prose', `${d.building} · ${ss.length} live · ${d.boards.reduce((n, b) => n + b.rows.length, 0)} rows · ${d.issues.length} in the inbox`));
	host.append(el('p', 'quiet prose', 'The summon composer moves in here at B17 — every knob live-updating the summons, stamped after this building. Sending a message to one of these sessions arrives with the Chat (B16).'));
}

/** Drag-to-reorder: HTML5 DnD over the same `moved()` the ▲▼ buttons call, so there is one law. */
function wireDrag(host: HTMLElement): void {
	let from: Section | null = null;
	host.addEventListener('dragstart', e => {
		const h = (e.target as Element | null)?.closest<HTMLElement>('[data-section]');
		from = (h?.dataset['section'] as Section | undefined) ?? null;
		if (from) e.dataTransfer?.setData('text/plain', from);
	});
	host.addEventListener('dragover', e => { if (from) e.preventDefault(); });
	host.addEventListener('drop', e => {
		const h = (e.target as Element | null)?.closest<HTMLElement>('[data-section]');
		const onto = h?.dataset['section'] as Section | undefined;
		if (!from || !onto || onto === from) return;
		e.preventDefault();
		order = moved(order, from, order.indexOf(onto) - order.indexOf(from));
		from = null;
		saveOrder();
	});
}

function draw(): void {
	if (!focusHost || !actionHost) return;
	const [focusState, actionState] = states;
	const ss = mine(snap, selection.building);
	paint('workshop:focus', focusHost, JSON.stringify([
		selection.building, focusState, order, [...shut],
		viewing && [viewing.path, viewing.line, viewing.lines.length, viewing.error],
		snap?.workshop, ss, snap?.identity.error,
	]), h => drawFocus(h, focusState));
	paint('workshop:action', actionHost, JSON.stringify([
		selection.building, actionState, snap?.workshop?.building, snap?.workshop?.issues.length, ss.length,
	]), h => drawAction(h, actionState));
}

export const workshop: FocusView = {
	name: 'workshop',
	title: 'the Workshop',
	states: ['minimal', 'typical', 'expanded'],
	/** The building whose detail this tenant wants on the wire — the shell puts it in the poll's query. */
	needs: focusState => (focusState === 'minimal' ? null : selection.building),
	mount(focus, action) {
		focusHost = focus;
		actionHost = action;
		wireDrag(focus);
	},
	unmount() { focusHost = null; actionHost = null; viewing = null; },
	draw(s, focusState, actionState) {
		snap = s;
		states = [focusState, actionState];
		draw();
	},
};

moveIn(workshop);

/**
 * The deck's one document opener (B20 §3's jump). Registered at import, not at mount, because a
 * decoder tooltip may ask for a document while some other tenant is standing — the shell brings
 * this one forward and then calls it, and there is still exactly one viewer in the building.
 */
viewer.open = (path, line) => { void openDoc(path, line); };
