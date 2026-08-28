// The Works — the building's whole work on one line of time (B10, keel §6). The deck's second real
// Focus tenant, moved in through the `FocusView` seam and nowhere else (D13).
//
// **Time flows down** (D14): the board's landed rows and the ledger's arc above, dimmed; a NOW line
// where the live sessions blink; the declared plan below it — the flow's DAG, drawn rank by rank
// with its dependency edges, its gates inline as Felix-cards, and the bill on every node. Plan view
// and progress view are the same drawing (D11), which is why one renderer draws both halves: a
// node's ring comes from the engine's run log where it has spoken and from the **board** where it
// has not, and the drawing says which (`ringOf`).
//
// **Nothing here fires.** The arm is B11's. Two wires leave this file and both are the shell's:
// `POST /hands/focus` (his eyes, on an in-flight node) through `data-jump-sid`, and the viewer,
// which belongs to the Workshop and is reached through the seam's own cells. What is not built yet
// says so on the node rather than half-working.

import {
	lit, ringOf,
	type DeckSession, type DeckSnapshot, type PaneState, type WorkshopRow,
	type Works, type WorksFlow, type WorksNode,
} from './deck-model';
import { moveIn, selection, swap, viewer, type FocusView } from './deck-view';
import {
	button, dots, drawProse, el, paint, plain, reading, stamp, words, type DecodeCtx,
} from './deck-dom';

// ---------- what the tenant is holding ----------

let focusHost: HTMLElement | null = null;
let actionHost: HTMLElement | null = null;
let snap: DeckSnapshot | null = null;
let states: [PaneState, PaneState] = ['minimal', 'minimal'];
/** The flow on the wall, and the node Felix has his finger on. Both transient — a view, not a place. */
let showing: string | null = null;
let picked: string | null = null;
let watching: ResizeObserver | null = null;

const repaint = (): void => draw();

/** Everything has a limit: the arc above the line is a summary, not the whole ledger. */
const PAST = 8;
const AHEAD = 12;

// ---------- the join: nodes are steps, and a step is usually a row on this building's board ----------

/**
 * The board rows the Workshop already put on the wire, by id. **The Works parses nothing of its
 * own**: the same `?b=` carries the building's board, so the past above the line and the plan below
 * it are two readings of one payload rather than two parses that can disagree.
 */
function rows(s: DeckSnapshot | null): Map<string, WorkshopRow> {
	const out = new Map<string, WorkshopRow>();
	for (const b of s?.workshop?.boards ?? []) for (const r of b.rows) out.set(r.id.toLowerCase(), r);
	return out;
}

const rowOf = (n: WorksNode, all: Map<string, WorkshopRow>): WorkshopRow | null => all.get(n.id.toLowerCase()) ?? null;

/** The document a node's words were written in: its own board row, else the building itself. */
const ctxOf = (row: WorkshopRow | null): DecodeCtx =>
	reading(row?.ref.path ?? snap?.workshop?.path ?? null);

const flowOf = (w: Works | null): WorksFlow | null =>
	w === null || w.flows.length === 0 ? null : w.flows.find(f => f.name === showing) ?? w.flows[0] ?? null;

const mine = (s: DeckSnapshot | null): DeckSession[] =>
	(s?.census.sessions ?? []).filter(x => x.building === selection.building && x.state !== 'gone');

const liveSids = (s: DeckSnapshot | null): Set<string> =>
	new Set((s?.census.sessions ?? []).filter(x => x.state !== 'gone').map(x => x.sid));

// ---------- the drawing ----------

/** The ring, as a mark: the fill is the ring, the halo is "and it is beating right now". */
function ring(n: WorksNode, state: string | null, live: Set<string>): HTMLElement {
	const { ring: r, from } = ringOf(n, state);
	const e = el('span', `nring r-${r}${lit(n, r, live) ? ' lit' : ''}`);
	e.dataset['ring'] = r;
	e.dataset['from'] = from;
	return e;
}

/**
 * One node. Encapsulation-first: the name the flow file **wrote** (the schema carries the field the
 * corpus lacks — B9 F1), with the id, the bill and the ring around it; his card, where the step is
 * gated on him, renders in its own idiom and carries **no control at all** (D10).
 */
function drawNode(host: HTMLElement, n: WorksNode, all: Map<string, WorkshopRow>, live: Set<string>, compact: boolean): void {
	const row = rowOf(n, all);
	const state = row?.state ?? null;
	const { ring: r, from } = ringOf(n, state);
	const ctx = ctxOf(row);

	const box = el('div', `node ring-${r}${n.gate === 'felix' ? ' felix-card' : ''}${picked === n.id ? ' on' : ''}`);
	box.dataset['node'] = n.id;
	box.dataset['depth'] = String(n.depth);
	box.dataset['ring'] = r;
	box.dataset['ringFrom'] = from;
	box.dataset['lit'] = lit(n, r, live) ? 'yes' : 'no';
	box.dataset['tip'] = `${n.id.toUpperCase()} · ${n.name}`;
	box.dataset['tipMore'] = `${n.mantle} · ${n.tier} · ${n.account} · ${n.venue}`
		+ ` — ${r}${from === 'board' ? ' (the board says so; the engine has not spoken)' : from === 'run' ? ` (${n.run.ev}, the engine's log)` : ' (declared, nothing has run)'}`;
	box.dataset['tipIn'] = row?.ref.path ?? snap?.workshop?.path ?? '';

	const head = el('div', 'node-h');
	if (n.color) {
		const chip = el('span', 'chip');
		chip.style.background = n.color;
		chip.title = `${n.mantle} · ${n.color}`;
		head.append(chip);
	}
	const id = el('span', 'nid');
	// A step id IS a row id on this building's board, so it decodes like any other code word (B20).
	words(id, n.id.toUpperCase(), ctx);
	head.append(id);
	const name = el('span', 'nname');
	words(name, n.name, ctx);
	head.append(name, ring(n, state, live));
	box.append(head);

	const bill = el('div', 'node-bill');
	bill.append(el('span', 'ntier', n.tier), el('span', 'nacct', n.account));
	if (!compact) bill.append(el('span', 'nvenue', n.venue));
	if (state) bill.append(el('span', 'pill', state));
	box.append(bill);

	if (n.gate === 'felix' && n.card) {
		const card = el('div', 'his-card');
		card.append(el('span', 'label', 'Felix-gate'));
		words(card, ` ${n.card}`, ctx);
		box.append(card);
	}
	if (n.gate === 'architect') box.append(el('div', 'his-gate', 'architect gate — the sitting is this step'));
	for (const b of n.blocks) {
		const blocked = el('div', 'node-blocked');
		words(blocked, b, ctx);
		box.append(blocked);
	}
	host.append(box);
}

/** A row this flow does not declare — the arc above the line, and the unplanned work below it. */
function drawMark(host: HTMLElement, r: WorkshopRow): void {
	const m = el('div', `mark st-${(r.state ?? 'unparsed').replace(' ', '-').toLowerCase()}`);
	m.dataset['mark'] = r.id;
	m.dataset['tip'] = `${r.id} · ${r.state ?? 'unparsed'} · ${r.staffing}`;
	m.dataset['tipMore'] = plain(r.annotation) || 'no landing record on this row';
	m.dataset['tipIn'] = r.ref.path;
	const id = el('span', 'nid');
	words(id, r.id, reading(r.ref.path));
	const name = el('span', 'mname');
	words(name, r.work.name, reading(r.ref.path));
	m.append(id, name, el('span', 'pill', r.state ?? 'UNPARSED'));
	host.append(m);
}

/** The NOW line: where the live sessions of this building blink (D14's own words). */
function drawNow(host: HTMLElement, ss: DeckSession[]): void {
	const now = el('div', 'nowline');
	now.dataset['now'] = 'yes';
	now.append(el('span', 'now-word', 'now'));
	now.append(dots(ss));
	now.append(el('span', 'now-count', ss.length ? `${ss.length} live here` : 'nothing alive in this building'));
	host.append(now);
}

/**
 * The DAG, rank by rank, with the now-line cut into it.
 *
 * Ranks are dependency depth and they run **downward** (the keel's amendment to the order's own
 * columns): time flows down, so a step's dependencies are above it and parallel lanes sit side by
 * side within one rank. The line goes in front of the first rank still holding unfinished work,
 * which is what makes "past above, plan below" a property of the data rather than a layout choice.
 */
function drawGraph(host: HTMLElement, flow: WorksFlow, all: Map<string, WorkshopRow>, ss: DeckSession[], compact: boolean): void {
	const live = liveSids(snap);
	const graph = el('div', 'graph');

	const done = (n: WorksNode): boolean => {
		const { ring: r } = ringOf(n, rowOf(n, all)?.state ?? null);
		return r === 'landed' || r === 'refused';
	};
	const depths = [...new Set(flow.nodes.map(n => n.depth))].sort((a, b) => a - b);
	const firstOpen = depths.find(d => flow.nodes.some(n => n.depth === d && !done(n)));

	const wires = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	wires.setAttribute('class', 'wires');
	wires.dataset['edges'] = String(flow.edges.length);
	// The paths exist from the first frame and are *placed* after layout: a browser cannot measure a
	// node it has not laid out yet, and an edge drawn from zeros is an edge that lies (B13 F2).
	for (const e of flow.edges) {
		const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		p.setAttribute('class', 'wire');
		p.dataset['from'] = e.from;
		p.dataset['to'] = e.to;
		wires.append(p);
	}
	graph.append(wires);

	let nowDrawn = false;
	for (const d of depths) {
		if (firstOpen !== undefined && d === firstOpen) { drawNow(graph, ss); nowDrawn = true; }
		const rank = el('div', 'rank');
		rank.dataset['rank'] = String(d);
		for (const n of flow.nodes.filter(x => x.depth === d)) drawNode(rank, n, all, live, compact);
		graph.append(rank);
	}
	if (!nowDrawn) drawNow(graph, ss);       // everything declared has landed: NOW is below all of it

	host.append(graph);
	place(graph);
}

/**
 * Edges, placed against the boxes the browser actually laid out. Called after every draw and on
 * every reflow the pane produces — the split is a 69 ms transition, so a single measurement taken
 * on the next frame would publish a mid-slide (B13 F2).
 */
function place(graph: HTMLElement): void {
	requestAnimationFrame(() => {
		if (!graph.isConnected) return;
		const svg = graph.querySelector<SVGSVGElement>('svg.wires');
		if (!svg) return;
		const box = graph.getBoundingClientRect();
		const w = graph.scrollWidth, h = graph.scrollHeight;
		svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
		svg.setAttribute('width', String(w));
		svg.setAttribute('height', String(h));
		const at = (id: string): DOMRect | null =>
			graph.querySelector<HTMLElement>(`.node[data-node="${CSS.escape(id)}"]`)?.getBoundingClientRect() ?? null;
		for (const p of svg.querySelectorAll<SVGPathElement>('path.wire')) {
			const a = at(p.dataset['from'] ?? ''), b = at(p.dataset['to'] ?? '');
			if (!a || !b) { p.removeAttribute('d'); continue; }
			const x1 = a.left - box.left + a.width / 2, y1 = a.bottom - box.top + graph.scrollTop;
			const x2 = b.left - box.left + b.width / 2, y2 = b.top - box.top + graph.scrollTop;
			const bend = Math.max(12, (y2 - y1) / 2);
			p.setAttribute('d', `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${x1.toFixed(1)} ${(y1 + bend).toFixed(1)} ${x2.toFixed(1)} ${(y2 - bend).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
		}
	});
}

const RING_KEYS: [string, string][] = [
	['r-declared', 'declared — nothing has run'],
	['r-fired', 'fired — the engine started it'],
	['r-fired lit', 'lit — and its session is beating now'],
	['r-landed', 'landed'],
	['r-paused', 'paused — a gate, an ambiguity, or HALT'],
	['r-refused', 'refused'],
];

function legend(flow: WorksFlow): HTMLElement {
	const box = el('div', 'legend-deck');
	box.append(el('span', 'label', 'legend'));
	for (const [cls, text] of RING_KEYS) {
		const key = el('span', 'lkey');
		key.append(el('span', `nring ${cls}`), el('span', '', text));
		box.append(key);
	}
	// The mantles this flow actually staffs, in the rig's own colours (B18 F1's table).
	for (const [mantle, color] of new Map(flow.nodes.map(n => [n.mantle, n.color]))) {
		const key = el('span', 'lkey');
		const chip = el('span', 'chip');
		if (color) chip.style.background = color;
		key.append(chip, el('span', '', mantle));
		box.append(key);
	}
	const board = el('span', 'lkey');
	board.append(el('span', 'nring r-landed from-board'), el('span', '', 'a dashed ring is the BOARD’s word, not the engine’s'));
	box.append(board);
	return box;
}

/** The bill, on the wall where the plan is: every account, its buckets, and how old the cache is. */
function drawBill(host: HTMLElement, w: Works, flow: WorksFlow | null): void {
	const bill = el('div', 'bill');
	bill.append(el('span', 'label', 'the bill'));
	for (const u of w.usage) {
		const line = el('div', `uline${u.ageSeconds === null || u.ageSeconds > 600 ? ' stale' : ''}`);
		line.dataset['account'] = u.account;
		line.append(el('span', 'acct', u.account));
		for (const c of u.cells) {
			const cell = el('span', c.pct === null ? 'cell empty' : 'cell');
			cell.append(el('span', 'bucket', c.bucket));
			// The pacing delta is `elapsed% − used%`: positive is headroom, negative means the window
			// dries up early (B5's own reading, unchanged — two tables must not disagree by a point).
			if (c.pct === null || c.delta === null) cell.append(el('span', '', '—'));
			else cell.append(el('b', 'pct', `${c.pct}%`),
				el('b', `delta ${c.delta < 0 ? 'burning' : 'headroom'}`, `${c.delta >= 0 ? '+' : ''}${c.delta}`));
			line.append(cell);
		}
		line.append(el('span', 'fetched', u.ageSeconds === null ? 'no cache' : `${Math.round(u.ageSeconds / 60)}m old`));
		bill.append(line);
	}
	if (flow) bill.append(el('p', 'quiet prose',
		`${flow.nodes.length} steps · concurrency ${flow.concurrency} · judge ${flow.judgeTier}`
		+ ` — the rig's own caches, rendered here, never fetched (B17 puts a live read behind this shape).`));
	host.append(bill);
}

function drawFail(host: HTMLElement, f: Works['fails'][number]): void {
	const box = el('div', 'flow-fail');
	box.append(el('span', 'pill tone-orange', f.code));
	box.append(el('span', 'ffile', f.file));
	box.append(el('p', 'prose', f.error));
	host.append(box);
}

function drawFocus(host: HTMLElement, state: PaneState): void {
	const w = snap?.works ?? null;
	const flow = flowOf(w);
	const ss = mine(snap);

	if (state === 'minimal') {
		host.append(el('span', 'big', flow ? flow.name.replace(/^flow-/, '') : 'works'));
		host.append(dots(ss));
		if (flow) {
			const marks = el('div', 'ring-row');
			const all = rows(snap);
			const live = liveSids(snap);
			for (const n of flow.nodes) marks.append(ring(n, rowOf(n, all)?.state ?? null, live));
			host.append(marks);
		}
		return;
	}

	if (!selection.building) {
		host.append(el('span', 'big', 'the works'));
		host.append(el('p', 'quiet prose', 'Click a building in the City and its whole work is drawn here: the past above the now-line, live sessions on it, the declared plan below.'));
		return;
	}

	const head = el('div', 'ws-head');
	head.append(el('span', 'big', selection.building));
	host.append(head);

	if (!w) { host.append(el('p', 'quiet prose', 'waiting for the first poll…')); return; }

	// More than one flow is a choice, and a choice is a button group — never a dropdown (design law).
	if (w.flows.length > 1) {
		const picker = el('div', 'flow-pick');
		for (const f of w.flows) {
			const b = button('st wide', f.name.replace(/^flow-/, ''), f.file);
			b.dataset['flow'] = f.name;
			b.dataset['on'] = flow?.name === f.name ? 'yes' : 'no';
			picker.append(b);
		}
		host.append(picker);
	}

	for (const f of w.fails) drawFail(host, f);

	if (!flow) {
		host.append(el('p', 'quiet prose', `No flow declares ${w.building}.`
			+ ' A flow is committed truth — `belvedere/flows/<name>.flow.json`, written by a sitting, never by the glass.'));
		drawNow(host, ss);
		return;
	}

	host.append(el('p', 'quiet prose', `${flow.name} · ${flow.scope} · cut ${flow.created} · ${flow.file}`
		+ (flow.armedAt === null ? ' — not armed (the arm is B11’s)' : '')
		+ (flow.run.present ? ` · run log ${flow.run.lines} lines${flow.run.malformed ? `, ${flow.run.malformed} unreadable` : ''}` : ' · no run log yet')));

	const all = rows(snap);
	const declared = new Set(flow.nodes.map(n => n.id.toLowerCase()));
	const others = [...all.values()].filter(r => !declared.has(r.id.toLowerCase()));
	const past = others.filter(r => r.state === 'LANDED' || r.state === 'KILLED');
	const ahead = others.filter(r => r.state !== 'LANDED' && r.state !== 'KILLED');

	if (state === 'expanded' && past.length) {
		const strip = el('div', 'past');
		strip.append(el('span', 'label', `${past.length} landed above this plan`));
		for (const r of past.slice(-PAST)) drawMark(strip, r);
		host.append(strip);
	}
	else if (past.length) host.append(el('p', 'quiet prose', `${past.length} landed rows above this plan — expand to read the arc.`));

	// The ledger's arc, one line: the last thing this building said about itself.
	const tail = snap?.workshop?.tail ?? null;
	if (tail) {
		const line = el('div', 'arc');
		line.dataset['tip'] = `${tail.date} · ${tail.mantle}${tail.row ? ` · ${tail.row}` : ''}`;
		line.dataset['tipMore'] = plain(tail.body);
		line.dataset['tipIn'] = tail.ref.path;
		line.append(el('span', 'label', 'ledger'), el('span', 'arc-when', tail.date));
		const what = el('span', 'arc-what');
		words(what, tail.body.name, reading(tail.ref.path));
		line.append(what);
		host.append(line);
	}

	drawGraph(host, flow, all, ss, state !== 'expanded');

	if (state === 'expanded') {
		if (ahead.length) {
			const strip = el('div', 'ahead');
			strip.append(el('span', 'label', `${ahead.length} rows this flow does not declare`));
			for (const r of ahead.slice(0, AHEAD)) drawMark(strip, r);
			host.append(strip);
		}
		host.append(legend(flow));
		drawBill(host, w, flow);
	}
}

// ---------- Action follows Focus: against the Works, Action dispatches (keel §3) ----------

/** The node actions, per state (keel §6). What exists is wired; what does not, says so. */
function drawNodeActions(host: HTMLElement, n: WorksNode, row: WorkshopRow | null, r: string, live: Set<string>): void {
	const acts = el('div', 'qacts');

	if (r === 'fired' || lit(n, 'fired', live)) {
		const session = (snap?.census.sessions ?? []).find(s => s.sid === n.run.sid) ?? null;
		const jump = button('st wide', 'jump to pane', session?.pane ? 'focus this step’s cmux panel' : 'this step names no live pane');
		jump.dataset['jumpSid'] = n.run.sid ?? '';
		jump.disabled = !session?.pane;
		acts.append(jump);
		const out = el('span', 'out');
		out.dataset['outFor'] = `jump:${n.run.sid}`;
		acts.append(out);
		acts.append(el('span', 'slot', 'hotswap to the Chat — B16'));
	}
	else if (r === 'landed') acts.append(el('span', 'slot', 'a follow-up fire — B11'));
	else acts.append(el('span', 'slot', 'dispatch — B11 arms this step'), el('span', 'slot', 'customize — the composer moves into Action at B17'));

	host.append(acts);

	if (r === 'landed' && row && row.annotation.spans.length) {
		host.append(el('span', 'label', 'the landing record'));
		host.append(drawProse(row.annotation, 'prose', open, reading(row.ref.path)));
	}
}

/** A reference clicked in the Works opens in the one viewer the deck has — the Workshop's (B20 §3). */
function open(path: string, line: number | null): void {
	swap.to?.('workshop');
	viewer.open?.(path, line);
}

function drawAction(host: HTMLElement, state: PaneState): void {
	host.append(el('span', 'big', 'act'));
	if (state === 'minimal') return;

	const w = snap?.works ?? null;
	const flow = flowOf(w);
	if (!flow) { host.append(el('p', 'quiet prose', 'Against the Works, Action dispatches. Pick a building with a declared flow.')); return; }

	const all = rows(snap);
	const node = picked === null ? null : flow.nodes.find(n => n.id === picked) ?? null;
	if (!node) {
		host.append(el('p', 'quiet prose', `${flow.name} — ${flow.nodes.length} steps, ${flow.edges.length} dependencies. Click a node to see its bill, its kickoff and what can be done with it.`));
		host.append(el('p', 'quiet prose', 'Nothing on this deck fires (D10): the arm is B11’s, and until it lands every step here is a thing to read.'));
		if (w) drawBill(host, w, flow);
		return;
	}

	const row = rowOf(node, all);
	const { ring: r, from } = ringOf(node, row?.state ?? null);
	const ctx = ctxOf(row);

	const head = el('div', 'ws-row-h');
	const id = el('span', 'rid');
	words(id, node.id.toUpperCase(), ctx);
	head.append(id, el('span', 'pill', r), el('span', 'rname', node.name));
	host.append(head);

	const facts = el('div', 'facts');
	for (const [k, v] of [
		['staffing', `${node.mantle} · ${node.tier}`],
		['account', node.account],
		['venue', node.venue],
		['gate', node.gate],
		['depends', node.depends.join(', ') || 'nothing'],
		['ring', `${r} — ${from === 'run' ? `the engine’s log (${node.run.ev})` : from === 'board' ? 'the board’s word; the engine has not spoken' : 'declared, nothing has run'}`],
	] as const) {
		const line = el('div', 'kv');
		line.append(el('span', 'label', k));
		const val = el('span', 'prose');
		words(val, v, ctx);
		line.append(val);
		facts.append(line);
	}
	if (node.run.at !== null) {
		const line = el('div', 'kv');
		line.append(el('span', 'label', 'last'), stamp(node.run.at));
		if (node.run.workspace) line.append(el('span', 'prose', node.run.workspace));
		if (node.run.why) line.append(el('span', 'prose', node.run.why));
		facts.append(line);
	}
	host.append(facts);

	for (const b of node.blocks) {
		const blocked = el('div', 'node-blocked');
		words(blocked, b, ctx);
		host.append(blocked);
	}

	if (node.gate === 'felix' && node.card) {
		const card = el('div', 'his-card');
		card.append(el('span', 'label', 'Felix-gate'));
		words(card, ` ${node.card}`, ctx);
		host.append(card);
	}

	drawNodeActions(host, node, row, r, liveSids(snap));

	// The kickoff is **bytes to read** — the first user turn this step would open with, quoted from
	// the order that blessed it. Rendered, never wired (D10): the arm is B11's and nothing here can
	// reach a hand that fires.
	host.append(el('span', 'label', node.from ? `kickoff · ${node.from}` : 'kickoff · inline'));
	host.append(el('pre', 'summons', node.kickoff));
}

// ---------- the tenant ----------

function draw(): void {
	if (!focusHost || !actionHost) return;
	const [focusState, actionState] = states;
	const w = snap?.works ?? null;
	const sig = JSON.stringify([
		selection.building, focusState, showing, picked, w,
		snap?.workshop?.boards, snap?.workshop?.tail, mine(snap),
	]);
	paint('works:focus', focusHost, sig, h => drawFocus(h, focusState));
	paint('works:action', actionHost, JSON.stringify([selection.building, actionState, picked, w]),
		h => drawAction(h, actionState));
}

/** A click picks a node or a flow; a code word inside one is the shell's (B20 F6 stops it first). */
function wire(host: HTMLElement): void {
	host.addEventListener('click', e => {
		const target = e.target as Element | null;
		const f = target?.closest<HTMLElement>('[data-flow]');
		if (f) { showing = f.dataset['flow'] ?? null; picked = null; repaint(); return; }
		const n = target?.closest<HTMLElement>('[data-node]');
		if (!n) return;
		picked = picked === n.dataset['node'] ? null : n.dataset['node'] ?? null;
		repaint();
	});
	// The pane is a 69 ms transition and the drawer takes a track: the edges follow the boxes rather
	// than being measured once and left behind (B13 F2, applied to geometry the tenant owns).
	watching = new ResizeObserver(() => {
		const graph = host.querySelector<HTMLElement>('.graph');
		if (graph) place(graph);
	});
	watching.observe(host);
}

export const works: FocusView = {
	name: 'works',
	title: 'the Works',
	states: ['minimal', 'typical', 'expanded'],
	/** The same building the Workshop asks for: one query, one timer, two readings (B13 F5). */
	needs: focusState => (focusState === 'minimal' ? null : selection.building),
	mount(focus, action) {
		focusHost = focus;
		actionHost = action;
		wire(focus);
	},
	unmount() {
		watching?.disconnect();
		watching = null;
		focusHost = null;
		actionHost = null;
	},
	draw(s, focusState, actionState) {
		snap = s;
		states = [focusState, actionState];
		draw();
	},
};

moveIn(works);
