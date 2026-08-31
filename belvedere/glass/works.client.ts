// The Works — the building's whole work on one line of time (B10, keel §6). The deck's second real
// Focus tenant, moved in through the `FocusView` seam and nowhere else (D13).
//
// **Time flows down** (D14): the board's landed rows and the ledger's arc above, dimmed; a NOW line
// where the live sessions blink; the run's DAG below it, rank by rank with its dependency edges,
// its cards inline as Felix-cards, and the bill on the wall. Past and future are one drawing (D11),
// which is why one renderer draws both halves: a node's ring comes from the **run log** where the
// engine has spoken and from the **board** where it has not, and the drawing says which (`ringOf`).
//
// **The data source swapped at C15** (D22 r2). The v2 engine that lived in this building is gone;
// what is drawn now is the v3 engine's own run logs, read through its own exports. The surface
// survives whole — the line of time, the ranks, the rings, the frozen kickoff on the node.
//
// **Nothing here ignites and nothing here drives.** The arm, the pass and the tick died with the v2
// engine; driving v3 from the deck is G5's rework lay and is pre-ruled out of this lane. Two wires
// leave this file and both are the shell's: `POST /hands/focus` (his eyes, on a running step)
// through `data-jump-sid`, and the viewer, which belongs to the Workshop and is reached through the
// seam's own cells. What is not built says so on the node rather than half-working.

import {
	lit, ringOf,
	type DeckSession, type DeckSnapshot, type PaneState, type QueueItem, type UsageWire, type WorkshopRow,
	type Works, type WorksRun, type WorksStep,
} from './deck-model';
import { moveIn, queue, selection, swap, viewer, type FocusView } from './deck-view';
import {
	ago, button, chatButton, dots, drawProse, el, paint, plain, reading, receipt, say, stamp, words, type DecodeCtx,
} from './deck-dom';

// ---------- what the tenant is holding ----------

let focusHost: HTMLElement | null = null;
let actionHost: HTMLElement | null = null;
let snap: DeckSnapshot | null = null;
let states: [PaneState, PaneState] = ['minimal', 'minimal'];
/** The run on the wall, and the step Felix has his finger on. Both transient — a view, not a place. */
let showing: string | null = null;
let picked: string | null = null;
let watching: ResizeObserver | null = null;
/**
 * The bill, **live** (B17's law: fetch on a gesture, read on a render) — filled when the run card
 * comes up and at most once a minute after, and never on the deck's poll.
 */
let usage: UsageWire[] | null = null;
let usageAt = 0;
const USAGE_MS = 60_000;

const repaint = (): void => draw();

/** Everything has a limit: the arc above the line is a summary, not the whole ledger. */
const PAST = 8;
const AHEAD = 12;

// ---------- the join: a step id is sometimes a row on this building's board ----------

/**
 * The board rows the Workshop already put on the wire, by id. **The Works parses nothing of its
 * own**: the same `?b=` carries the building's board, so the past above the line and the runs below
 * it are two readings of one payload rather than two parses that can disagree.
 */
function rows(s: DeckSnapshot | null): Map<string, WorkshopRow> {
	const out = new Map<string, WorkshopRow>();
	for (const b of s?.workshop?.boards ?? []) for (const r of b.rows) out.set(r.id.toLowerCase(), r);
	return out;
}

const rowOf = (n: WorksStep, all: Map<string, WorkshopRow>): WorkshopRow | null => all.get(n.id.toLowerCase()) ?? null;

/** The document a node's words were written in: its own board row, else the building itself. */
const ctxOf = (row: WorkshopRow | null): DecodeCtx =>
	reading(row?.ref.path ?? snap?.workshop?.path ?? null);

const runOf = (w: Works | null): WorksRun | null =>
	w === null || w.runs.length === 0 ? null : w.runs.find(r => r.name === showing) ?? w.runs[0] ?? null;

const mine = (s: DeckSnapshot | null): DeckSession[] =>
	(s?.census.sessions ?? []).filter(x => x.building === selection.building && x.state !== 'gone');

const liveSids = (s: DeckSnapshot | null): Set<string> =>
	new Set((s?.census.sessions ?? []).filter(x => x.state !== 'gone').map(x => x.sid));

/** The bill of one step, as one line — the law of space: a node has room for a line, not a record. */
const billOf = (n: WorksStep): string =>
	n.kind === 'card' ? '⬡ card — no subject, never ignited'
	: `${n.model} · ${n.effort} · ${n.posture}`;

// ---------- the drawing ----------

/** The ring, as a mark: the fill is the ring, the halo is "and it is beating right now". */
function ring(n: WorksStep, state: string | null, live: Set<string>): HTMLElement {
	const { ring: r, from } = ringOf(n, state);
	const e = el('span', `nring r-${r}${lit(n, r, live) ? ' lit' : ''}`);
	e.dataset['ring'] = r;
	e.dataset['from'] = from;
	return e;
}

/**
 * One node. Encapsulation-first: the step's id leads, the engine's own verdict stands beside it,
 * and the bill sits under both. A card — Felix's own step — renders its ask in its own idiom and
 * carries **no control at all** (D10).
 */
function drawNode(host: HTMLElement, n: WorksStep, all: Map<string, WorkshopRow>, live: Set<string>, compact: boolean, handed: QueueItem | null): void {
	const row = rowOf(n, all);
	const state = row?.state ?? null;
	const { ring: r, from } = ringOf(n, state);
	const ctx = ctxOf(row);

	const box = el('div', `node ring-${r}${n.kind === 'card' ? ' felix-card' : ''}${picked === n.id ? ' on' : ''}`);
	box.dataset['node'] = n.id;
	box.dataset['kind'] = n.kind;
	box.dataset['depth'] = String(n.depth);
	box.dataset['ring'] = r;
	box.dataset['ringFrom'] = from;
	// **`data-at` is the deck's clock, not a free attribute.** `tick()` rewrites the textContent of
	// every `[data-at]` in the document every second (`deck-dom.ts` §an age that keeps ageing), so a
	// node stamping its fold state there had its whole body replaced by `ago(NaN)` — `NaNd`, on every
	// node, one second after the first paint. The step's state is `data-step-at`.
	box.dataset['stepAt'] = n.at;
	box.dataset['lit'] = lit(n, r, live) ? 'yes' : 'no';
	box.dataset['tip'] = `${n.id} · ${n.verdict}`;
	box.dataset['tipMore'] = `${billOf(n)}`
		+ ` — ${r}${from === 'board' ? ' (the board says so; the engine has not spoken)' : from === 'run' ? ` (${n.at}, the engine's log)` : ' (declared, nothing has run)'}`;
	box.dataset['tipIn'] = row?.ref.path ?? snap?.workshop?.path ?? '';

	const head = el('div', 'node-h');
	const id = el('span', 'nid');
	// A step id is sometimes a row id on this building's board, so it decodes like any code word (B20).
	words(id, n.id, ctx);
	head.append(id);
	const verdict = el('span', 'nname');
	words(verdict, n.verdict, ctx);
	head.append(verdict, ring(n, state, live));
	box.append(head);

	const bill = el('div', 'node-bill');
	bill.append(el('span', 'ntier', billOf(n)));
	if (!compact && n.subject) bill.append(el('span', 'nacct', n.subject));
	if (n.turns > 0) bill.append(el('span', 'pill', `${n.turns} turn${n.turns === 1 ? '' : 's'}`));
	if (state) bill.append(el('span', 'pill', state));
	box.append(bill);

	if (n.kind === 'card' && n.ask) {
		const card = el('div', 'his-card');
		card.append(el('span', 'label', '⬡-card'));
		words(card, ` ${n.ask}`, ctx);
		box.append(card);
	}
	if (n.kind === 'gate') box.append(el('div', 'his-gate', 'gate — this step’s report rules the verdict for what follows'));
	for (const b of n.blocks) {
		const blocked = el('div', 'node-blocked');
		words(blocked, b, ctx);
		box.append(blocked);
	}
	if (handed && r === 'landed') handedOn(box, handed);
	host.append(box);
}

/**
 * **The end of the line, and what came after it** (B26 §3).
 *
 * Felix's report was that a session finished, handed a baton, and the deck said nothing anywhere.
 * The Works is where he watches a run finish, so it is where the sentence belongs: a **landed
 * terminal** node — one nothing else depends on — in a building whose ledger tail hands a baton
 * says so, and the click lands on that baton's own queue item.
 *
 * It is deliberately not a claim about causation. The node does not say *this step wrote that
 * clause*: the run log knows nothing about a ledger and never will. It says the two facts sit
 * together — this run ended here, and this building's tail hands the next move on — which is
 * exactly what Felix was looking at when he found nothing.
 */
const terminal = (run: WorksRun, id: string) => !run.edges.some(e => e.from === id);

const batonOf = (s: DeckSnapshot | null): QueueItem | null =>
	s?.queue.find(i => i.kind === 'baton' && i.building === s.works?.building) ?? null;

function handedOn(host: HTMLElement, item: QueueItem): void {
	const b = button('handed st wide', 'this landing handed a baton',
		`${item.name} — open it in the ⬡-queue`);
	b.dataset['queueKey'] = item.key;
	host.append(b);
}

/** A row this run does not declare — the arc above the line, and the unplanned work below it. */
function drawMark(host: HTMLElement, r: WorkshopRow): void {
	const m = el('div', `mark st-${(r.state ?? 'unparsed').replace(' ', '-').toLowerCase()}`);
	m.dataset['mark'] = r.id;
	m.dataset['tip'] = `${r.id} · ${r.state ?? 'unparsed'} · ${r.staffing}`;
	m.dataset['tipMore'] = plain(r.annotation) || 'no landing record on this charge';
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
function drawGraph(host: HTMLElement, run: WorksRun, all: Map<string, WorkshopRow>, ss: DeckSession[], compact: boolean): void {
	const handed = batonOf(snap);
	const live = liveSids(snap);
	const graph = el('div', 'graph');

	const done = (n: WorksStep): boolean => {
		const { ring: r } = ringOf(n, rowOf(n, all)?.state ?? null);
		return r === 'landed' || r === 'refused';
	};
	const ranks = [...new Set(run.steps.map(n => n.depth))].sort((a, b) => a - b);
	const firstOpen = ranks.find(d => run.steps.some(n => n.depth === d && !done(n)));

	const wires = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	wires.setAttribute('class', 'wires');
	wires.dataset['edges'] = String(run.edges.length);
	// The paths exist from the first frame and are *placed* after layout: a browser cannot measure a
	// node it has not laid out yet, and an edge drawn from zeros is an edge that lies (B13 F2).
	for (const e of run.edges) {
		const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		p.setAttribute('class', 'wire');
		p.dataset['from'] = e.from;
		p.dataset['to'] = e.to;
		wires.append(p);
	}
	graph.append(wires);

	let nowDrawn = false;
	for (const d of ranks) {
		if (firstOpen !== undefined && d === firstOpen) { drawNow(graph, ss); nowDrawn = true; }
		const rank = el('div', 'rank');
		rank.dataset['rank'] = String(d);
		for (const n of run.steps.filter(x => x.depth === d))
			drawNode(rank, n, all, live, compact, terminal(run, n.id) ? handed : null);
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
	['r-declared', 'declared — the log has said nothing about this step'],
	['r-ignited', 'ignited — the engine set the step running'],
	['r-ignited lit', 'lit — and its session is beating now'],
	['r-landed', 'landed'],
	['r-paused', 'paused — a cause the engine named, a card, or HALT'],
	['r-refused', 'killed'],
];

function legend(run: WorksRun): HTMLElement {
	const box = el('div', 'legend-deck');
	box.append(el('span', 'label', 'legend'));
	for (const [cls, text] of RING_KEYS) {
		const key = el('span', 'lkey');
		key.append(el('span', `nring ${cls}`), el('span', '', text));
		box.append(key);
	}
	const board = el('span', 'lkey');
	board.append(el('span', 'nring r-landed from-board'), el('span', '', 'a dashed ring is the BOARD’s word, not the engine’s'));
	box.append(board);
	// Drawn only where there is one to explain: a legend key for a vocabulary this run does not use
	// is a legend teaching a word nobody said (and B21 F2 — a sample must not answer a node selector).
	if (run.steps.some(n => n.kind === 'card')) {
		const card = el('span', 'lkey');
		card.append(el('span', 'pill tone-ins', '⬡-card'), el('span', '', 'Felix’s own step — no subject, never ignited'));
		box.append(card);
	}
	if (run.steps.some(n => n.kind === 'gate')) {
		const gate = el('span', 'lkey');
		gate.append(el('span', 'pill', 'gate'), el('span', '', 'its report rules the verdict for what follows'));
		box.append(gate);
	}
	return box;
}

/** The bill, on the wall where the runs are: every account, its buckets, and how old the cache is. */
function drawBill(host: HTMLElement, w: Works, run: WorksRun | null): void {
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
	if (run) bill.append(el('p', 'quiet prose',
		`${run.steps.length} steps · ${run.turns} of ${run.budget} turns spent${run.ceiling ? ' — the ceiling is reached' : ''}`
		+ ` — the rig's own caches, rendered here, never fetched (B17 puts a live read behind this shape).`));
	host.append(bill);
}

function drawFail(host: HTMLElement, f: Works['fails'][number]): void {
	const box = el('div', 'flow-fail');
	box.append(el('span', 'pill tone-orange', 'unreadable'));
	box.append(el('span', 'ffile', f.name));
	box.append(el('p', 'prose', f.error));
	host.append(box);
}

/** The run's one-line provenance: where it ran, on whose account, and how the deck knows. */
const whereFrom = (run: WorksRun): string =>
	`${run.venue} · ${run.account ?? 'no account — a layer-0 sandbox the run made and owns'}`
	+ (run.venueFrom === 'log' ? ' (the log names its config dir)'
		: run.venueFrom === 'conditions' ? ' (a pre-C14 log; the account comes from conditions.json beside it)'
		: ' (this log names no config dir and has no sidecar — readable forever, drivable never)');

function drawFocus(host: HTMLElement, state: PaneState): void {
	const w = snap?.works ?? null;
	const run = runOf(w);
	const ss = mine(snap);

	if (state === 'minimal') {
		host.append(el('span', 'big', run ? run.flowId : 'works'));
		host.append(dots(ss));
		if (run) {
			const marks = el('div', 'ring-row');
			const all = rows(snap);
			const live = liveSids(snap);
			for (const n of run.steps) marks.append(ring(n, rowOf(n, all)?.state ?? null, live));
			host.append(marks);
		}
		return;
	}

	if (!selection.building) {
		host.append(el('span', 'big', 'the works'));
		host.append(el('p', 'quiet prose', 'Click a building in the City and its whole work is drawn here: the past above the now-line, live sessions on it, the engine’s runs below.'));
		return;
	}

	const head = el('div', 'ws-head');
	head.append(el('span', 'big', selection.building));
	host.append(head);

	if (!w) { host.append(el('p', 'quiet prose', 'waiting for the first poll…')); return; }

	// More than one run is a choice, and a choice is a button group — never a dropdown (design law).
	if (w.runs.length > 1) {
		const picker = el('div', 'flow-pick');
		for (const r of w.runs) {
			const b = button('st wide', r.name, `${r.flowName} — ${r.dir}`);
			b.dataset['flow'] = r.name;
			b.dataset['on'] = run?.name === r.name ? 'yes' : 'no';
			picker.append(b);
		}
		host.append(picker);
	}

	for (const f of w.fails) drawFail(host, f);

	if (!run) {
		host.append(el('p', 'quiet prose',
			`No v3 run has run in ${w.building}. A run is the engine's own telemetry — a directory holding a `
			+ '`run.jsonl`, written by the engine out of process, never by the deck.'));
		host.append(el('p', 'quiet prose', `${w.read} of ${w.total} run logs read, newest first · ${w.elsewhere} housed elsewhere in the city.`));
		drawNow(host, ss);
		return;
	}

	host.append(el('p', 'quiet prose', `${run.name} · ${run.flowName} · ${whereFrom(run)}`
		+ ` · run log ${run.log.lines} events, last ${run.log.last ?? 'none'}`
		+ (run.halted === null ? '' : ` · HALTED — ${run.halted}`)));

	const all = rows(snap);
	const declared = new Set(run.steps.map(n => n.id.toLowerCase()));
	const others = [...all.values()].filter(r => !declared.has(r.id.toLowerCase()));
	const past = others.filter(r => r.state === 'LANDED' || r.state === 'KILLED');
	const ahead = others.filter(r => r.state !== 'LANDED' && r.state !== 'KILLED');

	if (state === 'expanded' && past.length) {
		const strip = el('div', 'past');
		strip.append(el('span', 'label', `${past.length} landed above this run`));
		for (const r of past.slice(-PAST)) drawMark(strip, r);
		host.append(strip);
	}
	else if (past.length) host.append(el('p', 'quiet prose', `${past.length} landed charges above this run — expand to read the arc.`));

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

	drawGraph(host, run, all, ss, state !== 'expanded');

	if (state === 'expanded') {
		if (ahead.length) {
			const strip = el('div', 'ahead');
			strip.append(el('span', 'label', `${ahead.length} charges this run does not declare`));
			for (const r of ahead.slice(0, AHEAD)) drawMark(strip, r);
			host.append(strip);
		}
		host.append(legend(run));
		drawBill(host, w, run);
	}
}

// ---------- Action follows Focus: against the Works, Action reads the run (keel §3) ----------

/**
 * The bill, fetched — **on a gesture, never on the poll** (B17 F5). The run card coming up is that
 * gesture: a run view that hides the bill is how a sovereign DoS's himself (the founding line), and
 * a bill three hours old is a hidden bill wearing a number.
 */
async function fetchUsage(force = false): Promise<void> {
	if (!force && Date.now() - usageAt < USAGE_MS) return;
	usageAt = Date.now();
	try { usage = await (await fetch('/deck/usage', { headers: { accept: 'application/json' } })).json() as UsageWire[]; }
	catch (e) { say('bill', `usage fetch failed — ${e instanceof Error ? e.message : String(e)}`); return; }
	repaint();
}

const out = (key: string): HTMLElement => {
	const e = el('span', 'out', receipt(key));
	e.dataset['outFor'] = key;
	return e;
};

/** The bill at the run card: three windows per account, each figure wearing its source and its age. */
function drawLiveBill(host: HTMLElement): void {
	const box = el('div', 'usage');
	box.append(el('span', 'label', 'the bill — live, fetched by the deck itself'));
	for (const u of usage ?? []) {
		const line = el('div', `uline s-${u.source}`);
		line.append(el('span', 'acct', u.account));
		for (const c of u.cells) {
			const cell = el('span', c.pct === null ? 'cell empty' : 'cell');
			cell.append(el('span', 'bucket', c.bucket), el('b', 'pct', c.pct === null ? '—' : `${c.pct}%`));
			if (c.delta !== null) cell.append(el('b', `delta ${c.delta < 0 ? 'burning' : 'headroom'}`, `${c.delta >= 0 ? '+' : ''}${c.delta}`));
			line.append(cell);
		}
		line.append(el('span', 'fetched', u.ageSeconds === null ? `${u.source} · never` : `${u.source} · ${ago(Date.now() / 1000 - u.ageSeconds)} old`));
		if (u.error) line.append(el('span', 'bad', u.error));
		box.append(line);
	}
	if (usage === null) box.append(el('p', 'quiet prose', 'fetching the three accounts…'));
	const again = button('st wide', 'refresh the bill', 'fetch all three accounts again');
	again.dataset['bill'] = 'refresh';
	box.append(again, out('bill'));
	host.append(box);
}

/**
 * The run card — the whole of what the engine did, on one card: what it was blessed on, where, at
 * whose expense, and what its log has said since.
 *
 * **There is no button on it.** The honest-disabled law (C15 §3): the deck's v3 lane reads runs and
 * does not drive them, so the card says that in its own words rather than offering an arm that
 * would answer nothing.
 */
function drawRunCard(host: HTMLElement, w: Works, run: WorksRun): void {
	const card = el('div', 'armcard');

	if (run.halted !== null) {
		const h = el('div', 'node-blocked');
		h.append(el('span', 'pill tone-red', 'HALTED'));
		h.append(el('span', 'prose', `${run.halted} — the log records the engine stopping here.`));
		card.append(h);
	}

	const head = el('div', 'ws-row-h');
	head.append(el('span', 'pill', run.ceiling ? 'ceiling' : run.halted !== null ? 'halted' : 'read-only'));
	head.append(el('span', 'rname', run.name));
	if (run.log.at !== null) head.append(stamp(run.log.at));
	card.append(head);

	const facts = el('div', 'facts');
	for (const [k, v] of [
		['flow', `${run.flowId} — ${run.flowName}`],
		['venue', whereFrom(run)],
		['budget', `${run.turns} of ${run.budget} subject turns spent${run.ceiling ? ' — the ceiling is reached and only a re-blessing moves it' : ''}`],
		['scope', run.scope.length ? run.scope.join(', ') : 'nothing was ever blessed'],
		['log', `${run.dir}/run.jsonl · ${run.log.lines} events · last ${run.log.last ?? 'none'}`],
	] as const) {
		const line = el('div', 'kv');
		line.append(el('span', 'label', k), el('span', 'prose', v));
		facts.append(line);
	}
	card.append(facts);

	card.append(el('span', 'label', `${run.steps.length} steps, as the log folds them`));
	const list = el('div', 'armsteps');
	for (const n of run.steps) {
		const line = el('div', `armstep${n.blocks.length ? ' bad' : ''}`);
		line.dataset['armStep'] = n.id;
		line.append(el('span', 'nid', n.id), el('span', 'nname', n.verdict));
		line.append(el('span', 'ntier', billOf(n)));
		if (n.subject) line.append(el('span', 'nacct', n.subject));
		line.append(el('span', 'quiet', n.prompt === null ? '⬡ card' : `${n.prompt.length} B frozen`));
		if (n.kind !== 'task') line.append(el('span', 'pill', n.kind));
		for (const b of n.blocks) line.append(el('span', 'bad', b));
		list.append(line);
	}
	card.append(list);

	drawLiveBill(card);

	card.append(el('p', 'quiet prose',
		'The deck reads this run; it does not drive it. Blessing, ruling and resuming are the engine’s own verbs '
		+ '(`bun v3/console/cli.ts`), and wiring them into the deck is the rework lay’s, not this lane’s.'));
	card.append(el('p', 'quiet prose', `${w.read} of ${w.total} run logs read, newest first · ${w.elsewhere} housed elsewhere in the city.`));

	host.append(card);
}

/** The step actions, per state (keel §6). What exists is wired; what does not, says so. */
function drawNodeActions(host: HTMLElement, n: WorksStep, r: string, live: Set<string>): void {
	const acts = el('div', 'qacts');

	if (n.at === 'running' || lit(n, 'ignited', live)) {
		const session = (snap?.census.sessions ?? []).find(s => s.sid === n.sid) ?? null;
		const jump = button('st wide', 'jump to pane', session?.pane ? 'focus this step’s cmux panel' : 'this step names no live pane');
		jump.dataset['jumpSid'] = n.sid ?? '';
		jump.disabled = !session?.pane;
		acts.append(jump);
		const slot = el('span', 'out');
		slot.dataset['outFor'] = `jump:${n.sid}`;
		acts.append(slot);
	}
	else if (n.kind === 'card') acts.append(el('span', 'quiet prose',
		'This step is Felix’s. The engine paused the lane on it and only a ruling opens it — `bun v3/console/cli.ts rule`, '
		+ 'never a button here: a card that could be passed from the deck would be a card the deck could pass by accident (D10).'));
	else if (r === 'declared') acts.append(el('span', 'quiet prose',
		'Declared. The log has said nothing about this step — it is either still waiting on its dependencies or the run ended before it.'));
	else acts.append(el('span', 'quiet prose', `The engine’s last word on this step: ${n.verdict}.`));

	host.append(acts);
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
	const run = runOf(w);
	if (!run) { host.append(el('p', 'quiet prose', 'Against the Works, Action reads the run. Pick a building the engine has run in.')); return; }

	const all = rows(snap);
	const node = picked === null ? null : run.steps.find(n => n.id === picked) ?? null;
	if (!node) {
		host.append(el('p', 'quiet prose', `${run.name} — ${run.steps.length} steps, ${run.edges.length} dependencies. Click a node to see its frozen kickoff and what the engine said about it.`));
		if (w) drawRunCard(host, w, run);
		return;
	}

	const row = rowOf(node, all);
	const { ring: r, from } = ringOf(node, row?.state ?? null);
	const ctx = ctxOf(row);

	const head = el('div', 'ws-row-h');
	const id = el('span', 'rid');
	words(id, node.id, ctx);
	head.append(id, el('span', 'pill', r), el('span', 'rname', node.verdict));
	host.append(head);

	const facts = el('div', 'facts');
	for (const [k, v] of [
		['kind', node.kind],
		['subject', `${billOf(node)}${node.subject ? ` · ${node.subject}` : ''}`],
		['venue', whereFrom(run)],
		['depends', node.depends.join(', ') || 'nothing'],
		['turns', `${node.turns} spent${node.timeoutMs === null ? '' : ` · timeout ${Math.round(node.timeoutMs / 1000)}s`}`],
		['ring', `${r} — ${from === 'run' ? `the engine’s log (${node.at})` : from === 'board' ? 'the board’s word; the engine has not spoken' : 'declared, nothing has run'}`],
	] as const) {
		const line = el('div', 'kv');
		line.append(el('span', 'label', k));
		const val = el('span', 'prose');
		words(val, v, ctx);
		line.append(val);
		facts.append(line);
	}
	if (node.sid !== null) {
		const line = el('div', 'kv');
		line.append(el('span', 'label', 'session'), el('span', 'prose', `${node.sid}${node.pid === null ? '' : ` · pid ${node.pid}`}`));
		// The step's conversation, in the one Chat view (C16 §1). A step's subject is headless (D22),
		// so this is the only way to read what it actually said — and the shared control means the
		// Works reaches the Chat the way every other session row on the deck does.
		line.append(chatButton(node.sid, 'read this step’s conversation, and reply into its pause'));
		facts.append(line);
	}
	if (node.why !== null) {
		const line = el('div', 'kv');
		line.append(el('span', 'label', 'why'), el('span', 'prose', node.why));
		facts.append(line);
	}
	host.append(facts);

	const handed = batonOf(snap);
	if (handed && r === 'landed' && terminal(run, node.id)) handedOn(host, handed);

	for (const b of node.blocks) {
		const blocked = el('div', 'node-blocked');
		words(blocked, b, ctx);
		host.append(blocked);
	}

	if (node.kind === 'card' && node.ask) {
		const card = el('div', 'his-card');
		card.append(el('span', 'label', '⬡-card'));
		words(card, ` ${node.ask}`, ctx);
		host.append(card);
	}

	drawNodeActions(host, node, r, liveSids(snap));

	if (r === 'landed' && row && row.annotation.spans.length) {
		host.append(el('span', 'label', 'the landing record'));
		host.append(drawProse(row.annotation, 'prose', open, reading(row.ref.path)));
	}

	// The kickoff is **the bytes the run was blessed on** — frozen into the flow at the blessing and
	// read back out of the log's own first event. No document position is resolved anywhere on this
	// path: a kickoff that pointed at a doc by fence ordinal is what collapsed at flow-1.
	if (node.prompt !== null) {
		host.append(el('span', 'label', `kickoff · ${node.prompt.length} B, frozen at the blessing`));
		host.append(el('pre', 'summons', node.prompt));
	}
}

// ---------- the tenant ----------

function draw(): void {
	if (!focusHost || !actionHost) return;
	const [focusState, actionState] = states;
	const w = snap?.works ?? null;
	// The baton belongs in both signatures for the same reason `showing` does: a landed terminal node
	// draws the handoff, so a signature blind to it leaves the sentence off a node that now has one —
	// or standing on a node whose baton was taken up (C15 F3's repaint law, one tenant along).
	const handed = batonOf(snap)?.key ?? null;
	const sig = JSON.stringify([
		selection.building, focusState, showing, picked, w, handed,
		snap?.workshop?.boards, snap?.workshop?.tail, mine(snap),
	]);
	paint('works:focus', focusHost, sig, h => drawFocus(h, focusState));
	// `showing` belongs in BOTH signatures: Action draws the run the picker chose, so a signature
	// that forgot it left the Act pane on the previous run while Focus drew the new one.
	paint('works:action', actionHost, JSON.stringify([selection.building, actionState, showing, picked, w, usage, handed]),
		h => drawAction(h, actionState));
	// The run card is the gesture that asks for a live bill (B17 F5): a render reads, a gesture
	// fetches, and the card coming up is what makes this a gesture rather than a clock.
	if (actionState !== 'minimal' && picked === null && runOf(w) !== null) void fetchUsage();
}

/** A click picks a node or a run; a code word inside one is the shell's (B20 F6 stops it first). */
function wire(host: HTMLElement, signal: AbortSignal): void {
	host.addEventListener('click', e => {
		const target = e.target as Element | null;
		// The handoff is read before the node under it: a click on "this landing handed a baton" is a
		// click at the baton, not at the step. It goes through the shell's own cell — the drawer is not
		// this tenant's to reach into (B26 §3, `deck-view.ts` §queue).
		const b = target?.closest<HTMLElement>('[data-queue-key]');
		if (b) { queue.show?.(b.dataset['queueKey'] ?? ''); return; }
		const f = target?.closest<HTMLElement>('[data-flow]');
		if (f) { showing = f.dataset['flow'] ?? null; picked = null; repaint(); return; }
		const n = target?.closest<HTMLElement>('[data-node]');
		if (!n) return;
		picked = picked === n.dataset['node'] ? null : n.dataset['node'] ?? null;
		repaint();
	}, { signal });
	// The pane is a 69 ms transition and the drawer takes a track: the edges follow the boxes rather
	// than being measured once and left behind (B13 F2, applied to geometry the tenant owns).
	watching = new ResizeObserver(() => {
		const graph = host.querySelector<HTMLElement>('.graph');
		if (graph) place(graph);
	});
	watching.observe(host);
}

/**
 * Action's own one wire, and the whole of what this tenant can reach: a re-fetch of the bill.
 *
 * **No spawning route and no driving route appears in this file.** The engine runs out of process
 * and the deck's one client-side spawning wire stays the composer's (B17 F1's sound check: the
 * question is which SOURCE contains it, and a probe greps this file for that path — so it must not
 * be written here even in a comment).
 */
function wireAction(host: HTMLElement, signal: AbortSignal): void {
	host.addEventListener('click', e => {
		const bill = (e.target as Element | null)?.closest<HTMLElement>('[data-bill]');
		if (bill) void fetchUsage(true);
	}, { signal });
}

export const works: FocusView = {
	name: 'works',
	title: 'the Works',
	states: ['minimal', 'typical', 'expanded'],
	/** The same building the Workshop asks for: one query, one timer, two readings (B13 F5). */
	needs: focusState => (focusState === 'minimal' ? null : selection.building),
	mount(focus, action, signal) {
		focusHost = focus;
		actionHost = action;
		wire(focus, signal);
		wireAction(action, signal);
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
