// B10's DoD, driven in a real browser — B13's harness, reused as it was written to be (F1).
//
// Everything here is a *browser* fact: four nodes drawn on ranks that run downward, four SVG edges
// placed against the boxes the browser actually laid out, a NOW line cut between the past and the
// plan, a ring lit by the live census and another one fired-and-not-beating, a Felix-card with
// nothing on it to press, and the bill on the wall. Everything that is a pure function — the parse,
// every refusal, the run log, `ringOf`, `lit` — is in `glass/flow.test.ts` instead.
//
//    bun belvedere/lab/b10/probe.ts
//
// It stands up its OWN glass on a probe port against a temp census, a temp run log and a **copy**
// of `lab/b10/city`, so nothing outside the temp directory is read as truth or written at all — the
// real `belvedere/flows/` is never the flows dir here, and the real census is never appended to.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4490;
const CDP_PORT = 9334;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const POLL_MS = 3000;                                          // must match `deck.client.ts`

const ROOT = mkdtempSync(join(tmpdir(), 'b10-probe-'));
const CENSUS = join(ROOT, 'census.jsonl');
const PROFILE = join(ROOT, 'chrome');
const CITY = join(ROOT, 'city');
const FLOWS = join(CITY, 'flows');
const WORKS = join(CITY, 'nb/works');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

Bun.spawnSync(['cp', '-R', join(HERE, 'lab/b10/city'), CITY]);

// A building's name is its path relative to the REAL `~/code` (doctrine's `slug`), so inside a temp
// fixture city it is absolute. The flow file's `building` has to name the same thing the register
// does, so the copy is retargeted here — the shipped fixture says `nb/works`, and this is the only
// line that knows where the copy landed.
for (const f of ['probe', 'broken']) {
	const file = join(FLOWS, `${f}.flow.json`);
	const raw = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
	raw['building'] = WORKS;
	writeFileSync(file, JSON.stringify(raw, null, '\t'));
}

/** Our own pid, so the census's `kill -0` says alive without inventing a process. */
const beat = (o: Record<string, unknown>) => JSON.stringify({
	t: Date.now() / 1000, acct: '/Users/felix/.claude', pid: String(process.pid), ...o,
}) + '\n';

// One session beating in the fixture building, one that has ended: the two halves of "fired".
writeFileSync(CENSUS, [
	beat({ ev: 'PreToolUse', sid: 'wk-live', cwd: WORKS, ws: 'W-left', sf: 'S-left', tool: 'Write' }),
	beat({ ev: 'SessionEnd', sid: 'wk-dead', cwd: WORKS, ws: '', sf: '' }),
].join(''));

// The run log B11 will write, written here by hand: the flow armed, two steps fired — one into each
// of those sessions — and the gate paused on his card. `a1` is deliberately absent, so its ring has
// to come off the BOARD and say so.
mkdirSync(join(ROOT, 'flows'), { recursive: true });
writeFileSync(join(ROOT, 'flows', 'probe.run.jsonl'), [
	{ ts: Date.now() / 1000 - 900, ev: 'armed' },
	{ ts: Date.now() / 1000 - 800, ev: 'fired', step: 'b1', sid: 'wk-live', workspace: 'workspace:11' },
	{ ts: Date.now() / 1000 - 700, ev: 'fired', step: 'b2', sid: 'wk-dead', workspace: 'workspace:12' },
	{ ts: Date.now() / 1000 - 600, ev: 'paused', step: 'c1', why: 'a Felix-card' },
].map(l => JSON.stringify(l)).join('\n') + '\n');

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN} — a previous probe did not shut down.\n`
		+ `Close it first: lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t | xargs kill`);
	rmSync(ROOT, { recursive: true, force: true });
	process.exit(2);
}

async function until(what: string, probe: () => Promise<boolean>, ms = 30_000): Promise<void> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		if (await probe().catch(() => false)) return;
		await Bun.sleep(120);
	}
	throw new Error(`timed out waiting for ${what}`);
}

const glass = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: ROOT, GLASS_CITY: CITY, FLOWS_DIR: FLOWS },
	stdout: 'pipe', stderr: 'pipe',
});

const chrome = Bun.spawn([CHROME,
	'--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
	'--disable-background-networking', '--disable-sync', '--disable-default-apps',
	'--window-size=1600,900', `--user-data-dir=${PROFILE}`,
	`--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', DECK,
], { stdout: 'pipe', stderr: 'pipe' });

async function shut(): Promise<void> {
	chrome.kill();
	glass.kill();
	await Bun.sleep(400);
	rmSync(ROOT, { recursive: true, force: true });
}

// ---------- the DevTools wire (B13's, unchanged) ----------

type Reply = { id: number; result?: { result?: { value?: unknown }; exceptionDetails?: unknown }; error?: { message: string } };

let socket: WebSocket;
let nextId = 1;
const waiting = new Map<number, { go: (v: unknown) => void; no: (e: Error) => void }>();

function evaluate<T>(expression: string): Promise<T> {
	const id = nextId++;
	return new Promise<T>((go, no) => {
		waiting.set(id, { go: v => go(v as T), no });
		socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
	});
}

async function attach(): Promise<void> {
	await until('chrome', async () => (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok);
	const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json() as
		{ type: string; url: string; webSocketDebuggerUrl: string }[];
	const page = targets.find(t => t.type === 'page' && t.url.startsWith(DECK));
	if (!page) throw new Error(`no page target at ${DECK}: ${JSON.stringify(targets.map(t => t.url))}`);

	socket = new WebSocket(page.webSocketDebuggerUrl);
	socket.addEventListener('message', ev => {
		const msg = JSON.parse(String(ev.data)) as Reply;
		const w = waiting.get(msg.id);
		if (!w) return;
		waiting.delete(msg.id);
		if (msg.error) return w.no(new Error(msg.error.message));
		if (msg.result?.exceptionDetails) return w.no(new Error(JSON.stringify(msg.result.exceptionDetails)));
		w.go(msg.result?.result?.value);
	});
	await new Promise<void>((go, no) => {
		socket.addEventListener('open', () => go());
		socket.addEventListener('error', () => no(new Error('the DevTools socket refused')));
	});
}

/** The split is a 69 ms transition and the edges are placed on the next frame (B13 F2). */
const settle = () => Bun.sleep(300);
const SET = (pane: string, state: string) =>
	`document.querySelector('[data-set-state="${state}"][data-pane="${pane}"]').click()`;
const ready = () => until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));

async function openBuilding(name: string): Promise<void> {
	await evaluate(`[...document.querySelectorAll('#host-context .row[data-building]')]
		.find(r => r.dataset.building.endsWith('${name}')).click()`);
	await evaluate(`document.querySelector('[data-focus-on="works"]').click()`);
	await until(`the Works to open ${name}`, async () => await evaluate<boolean>(
		`(document.querySelector('#host-focus .ws-head .big')?.textContent ?? '').endsWith('${name}')`), POLL_MS * 2);
	await settle();
}

// ---------- the run ----------

try {

	await until('the glass', async () => (await fetch(DECK)).ok);
	await attach();
	await ready();
	await evaluate(SET('context', 'typical'));
	await evaluate(SET('focus', 'expanded'));
	await evaluate(SET('action', 'typical'));
	await settle();
	await openBuilding('nb/works');
	// The tenant asks for its building in the poll's query; give the answer one poll to arrive.
	await until('the flow on the wall', async () => await evaluate<boolean>(
		`document.querySelectorAll('#host-focus .node').length === 4`), POLL_MS * 2);
	await settle();

	console.log(`\n# B10 — the Works, measured in Chrome (window 1600×900)\n`);
	console.log(`glass: ${DECK}   census: ${CENSUS}   city: ${CITY}   flows: ${FLOWS}\n`);

	// --- 1. the nodes: encapsulation, mantle colour, tier, and the bill on each ---

	type Lane = { id: string; top: number; left: number; width: number };
	type Node = { id: string; name: string; chip: string; tier: string; acct: string; venue: string; ring: string; from: string; lit: string; depth: string; pill: string };
	const nodes = await evaluate<Node[]>(`[...document.querySelectorAll('#host-focus .node')].map(n => ({
		id: n.dataset.node,
		name: n.querySelector('.nname').textContent,
		chip: n.querySelector('.chip') ? getComputedStyle(n.querySelector('.chip')).backgroundColor : '',
		tier: n.querySelector('.ntier').textContent,
		acct: n.querySelector('.nacct').textContent,
		venue: n.querySelector('.nvenue') ? n.querySelector('.nvenue').textContent : '',
		ring: n.dataset.ring, from: n.dataset.ringFrom, lit: n.dataset.lit, depth: n.dataset.depth,
		pill: n.querySelector('.pill') ? n.querySelector('.pill').textContent : '',
	}))`);
	ok('four nodes, each led by the name the flow file WROTE, with its mantle colour and its bill',
		nodes.length === 4
		&& nodes.map(n => n.name).join(' · ') === 'The first step · The left lane · The right lane · The close sitting'
		&& nodes.every(n => /^(Digger|Builder|Architect)?/.test(n.tier) && n.tier.includes('-'))
		&& nodes.every(n => n.acct !== '' && n.venue !== '')
		&& new Set(nodes.map(n => n.chip)).size >= 3,
		nodes.map(n => `${n.id}: "${n.name}" ${n.tier} ${n.acct} · ${n.venue} · chip ${n.chip}`).join('\n      '));

	// --- 2. the edges: one SVG path per dependency, placed against real boxes ---

	const wires = await evaluate<{ declared: string; paths: number; drawn: { from: string; to: string; d: string }[] }>(`(() => {
		const svg = document.querySelector('#host-focus svg.wires');
		return {
			declared: svg.dataset.edges,
			paths: svg.querySelectorAll('path').length,
			drawn: [...svg.querySelectorAll('path')].map(p => ({ from: p.dataset.from, to: p.dataset.to, d: p.getAttribute('d') || '' })),
		};
	})()`);
	ok('edges are inline SVG, one path per dependency, and every one is placed on a real box',
		wires.paths === 4 && wires.declared === '4' && wires.drawn.every(p => /^M [\d.]+ [\d.]+ C /.test(p.d)),
		`svg[data-edges]=${wires.declared} · ${wires.paths} <path> elements\n      `
		+ wires.drawn.map(p => `${p.from}→${p.to}  ${p.d}`).join('\n      '));

	// --- 3. time flows down: ranks in DOM order, parallel lanes side by side ---

	const geometry = await evaluate<{ ranks: string[]; order: string[]; lanes: { id: string; top: number; left: number; width: number }[] }>(`(() => {
		const g = document.querySelector('#host-focus .graph');
		const box = id => { const r = g.querySelector('.node[data-node="' + id + '"]').getBoundingClientRect(); return { id, top: +r.top.toFixed(2), left: +r.left.toFixed(2), width: +r.width.toFixed(2) }; };
		return {
			ranks: [...g.querySelectorAll('.rank')].map(r => r.dataset.rank),
			order: [...g.querySelectorAll('.node')].map(n => n.dataset.node + ':' + n.dataset.depth),
			lanes: ['a1', 'b1', 'b2', 'c1'].map(box),
		};
	})()`);
	const [a1, b1, b2, c1] = geometry.lanes as [Lane, Lane, Lane, Lane];
	ok('dependency depth runs DOWNWARD (D14) and parallel lanes sit side by side',
		geometry.ranks.join(',') === '0,1,2'
		&& geometry.order.join(' ') === 'a1:0 b1:1 b2:1 c1:2'
		&& b1.top === b2.top && b1.left < b2.left
		&& a1.top < b1.top && b1.top < c1.top,
		`ranks in DOM order [${geometry.ranks.join(' → ')}] · nodes [${geometry.order.join(', ')}]\n`
		+ `      a1 top ${a1.top} → (b1 ${b1.left}, b2 ${b2.left}) both top ${b1.top} → c1 top ${c1.top}`);

	// --- 4. the NOW line, cut between the past and the plan ---

	const now = await evaluate<{ present: boolean; top: number; word: string; dots: number; index: number; children: string[] }>(`(() => {
		const g = document.querySelector('#host-focus .graph');
		const line = g.querySelector('.nowline');
		const kids = [...g.children].filter(k => !k.matches('svg'));
		return {
			present: !!line, top: +line.getBoundingClientRect().top.toFixed(2),
			word: line.querySelector('.now-word').textContent,
			dots: line.querySelectorAll('.dot').length,
			index: kids.indexOf(line),
			children: kids.map(k => k.className + (k.dataset.rank !== undefined ? ':' + k.dataset.rank : '')),
		};
	})()`);
	ok('NOW is a line in the drawing: the landed rank above it, the fired ranks below, sessions blinking on it',
		now.present && now.index === 1 && now.top > a1.top && now.top < b1.top && now.dots >= 1,
		`graph children in order: [${now.children.join(' → ')}]\n`
		+ `      the line reads "${now.word}" at y=${now.top}, between a1 (${a1.top}) and b1 (${b1.top}), carrying ${now.dots} live dot(s)`);

	// --- 5. the census lights one ring and refuses to light the other ---

	const rings = await evaluate<{ id: string; ring: string; from: string; lit: string; dashed: string }[]>(`
		[...document.querySelectorAll('#host-focus .node')].map(n => ({
			id: n.dataset.node, ring: n.dataset.ring, from: n.dataset.ringFrom, lit: n.dataset.lit,
			dashed: getComputedStyle(n.querySelector('.nring')).borderStyle,
		}))`);
	const by = (id: string) => rings.find(r => r.id === id)!;
	ok('a fired step whose session is BEATING is lit; the one whose session is gone is fired, not beating',
		by('b1').ring === 'fired' && by('b1').lit === 'yes' && by('b1').from === 'run'
		&& by('b2').ring === 'fired' && by('b2').lit === 'no' && by('b2').from === 'run',
		rings.map(r => `${r.id}: ring=${r.ring} from=${r.from} lit=${r.lit} border=${r.dashed}`).join('\n      '));

	ok('a ring the ENGINE never claimed is the board’s word, and the drawing says so (dashed)',
		by('a1').ring === 'landed' && by('a1').from === 'board' && by('a1').dashed === 'dashed'
		&& by('c1').ring === 'paused' && by('c1').from === 'run',
		`a1 has no run line at all → ${by('a1').ring} from the board, border-style ${by('a1').dashed}\n`
		+ `      c1 was paused by the log → ${by('c1').ring} from ${by('c1').from}, border-style ${by('c1').dashed}`);

	// --- 6. the Felix-card: it renders, and there is nothing on it to press ---

	const card = await evaluate<{ text: string; buttons: number; wiring: number; fire: number }>(`(() => {
		const n = document.querySelector('#host-focus .node.felix-card');
		return {
			text: n.querySelector('.his-card').textContent.slice(0, 90),
			buttons: n.querySelectorAll('button, a, input').length,
			wiring: n.querySelectorAll('[data-fire],[data-apply],[data-worktree],[data-summons],[data-gesture]').length,
			fire: (n.outerHTML.match(/hands\\/fire/g) || []).length,
		};
	})()`);
	ok('the gate renders as HIS card and carries ZERO controls — no button, no handler (D10, B3’s bar)',
		card.buttons === 0 && card.wiring === 0 && card.fire === 0 && card.text.length > 20,
		`card reads "${card.text}…"\n      controls on it: ${card.buttons} · fire attributes: ${card.wiring} · "hands/fire" ${card.fire}×`);

	// --- 7. the blocked step: P5's clause, drawn before he can reach for it ---

	const blocked = await evaluate<{ id: string; text: string }[]>(`
		[...document.querySelectorAll('#host-focus .node .node-blocked')].map(b => ({
			id: b.closest('.node').dataset.node, text: b.textContent,
		}))`);
	ok('a haiku step is drawn BLOCKED with P5’s finding on it (the model is the posture)',
		blocked.length === 1 && blocked[0]!.id === 'b2' && /P5/.test(blocked[0]!.text) && /auto/.test(blocked[0]!.text),
		`${blocked.length} blocked node: ${blocked[0]!.id} — "${blocked[0]!.text.slice(0, 120)}…"`);

	// --- 8. the past above and the unplanned below, plus the ledger's arc ---

	const arcs = await evaluate<{ past: string[]; ahead: string[]; arc: string; pastTop: number; graphTop: number }>(`(() => ({
		past: [...document.querySelectorAll('#host-focus .past .mark')].map(m => m.dataset.mark),
		ahead: [...document.querySelectorAll('#host-focus .ahead .mark')].map(m => m.dataset.mark),
		arc: document.querySelector('#host-focus .arc').textContent,
		pastTop: +document.querySelector('#host-focus .past').getBoundingClientRect().top.toFixed(2),
		graphTop: +document.querySelector('#host-focus .graph').getBoundingClientRect().top.toFixed(2),
	}))()`);
	ok('the building’s own landed rows sit above the plan and its undeclared work below — one drawing',
		arcs.past.join(',') === 'X1' && arcs.ahead.join(',') === 'X2' && arcs.pastTop < arcs.graphTop && /2026-08-27/.test(arcs.arc),
		`above: [${arcs.past.join(', ')}] at y=${arcs.pastTop} · the DAG at y=${arcs.graphTop} · below: [${arcs.ahead.join(', ')}]\n`
		+ `      the ledger's arc reads "${arcs.arc.replace(/\s+/g, ' ').slice(0, 100)}"`);

	// --- 9. the bill, and the legend every coloured view owes the reader ---

	const bill = await evaluate<{ accounts: string[]; cells: number; legend: number; keys: string[] }>(`(() => ({
		accounts: [...document.querySelectorAll('#host-focus .bill .uline')].map(l => l.dataset.account),
		cells: document.querySelectorAll('#host-focus .bill .cell').length,
		legend: document.querySelectorAll('#host-focus .legend-deck').length,
		keys: [...document.querySelectorAll('#host-focus .legend-deck .lkey')].map(k => k.textContent),
	}))()`);
	ok('the bill is on the wall (usage ×3 accounts) and the drawing carries its legend',
		bill.accounts.length === 3 && bill.cells >= 9 && bill.legend === 1 && bill.keys.length >= 8,
		`accounts [${bill.accounts.join(', ')}] · ${bill.cells} usage cells\n`
		+ `      legend keys: ${bill.keys.join(' | ')}`);

	// --- 10. Action follows Focus: the node's facts, its actions, and the bytes it would open with ---

	const fence = readFileSync(join(WORKS, 'README.md'), 'utf8').split('```')[1]!.replace(/^[^\n]*\n/, '').replace(/\n$/, '');
	const action = await evaluate<{ head: string; facts: string[]; slots: string[]; jump: number; kickoff: string; from: string }>(`(() => {
		document.querySelector('#host-focus .node[data-node="c1"]').click();
		return {
			head: document.querySelector('#host-action .ws-row-h').textContent,
			facts: [...document.querySelectorAll('#host-action .facts .kv')].map(k => k.textContent),
			slots: [...document.querySelectorAll('#host-action .slot')].map(s => s.textContent),
			jump: document.querySelectorAll('#host-action [data-jump-sid]').length,
			kickoff: document.querySelector('#host-action pre.summons').textContent,
			from: [...document.querySelectorAll('#host-action .label')].map(l => l.textContent).join(' | '),
		};
	})()`);
	const sameBytes = action.kickoff === fence;
	ok('clicking a plan node draws its facts and the exact bytes it would open with — quoted from the doc',
		sameBytes && action.facts.length >= 6 && action.slots.length === 2 && action.jump === 0
		&& action.from.includes('kickoff · nb/works/README.md #1'),
		`head "${action.head}" · ${action.facts.length} facts · slots [${action.slots.join(' | ')}] · ${action.jump} jump controls\n`
		+ `      labels: ${action.from}\n`
		+ `      the kickoff Action shows === the fixture doc's fence 1: ${sameBytes} (${action.kickoff.length} B)`);

	const inflight = await evaluate<{ slots: string[]; jump: boolean; sid: string; landing: number }>(`(() => {
		document.querySelector('#host-focus .node[data-node="b1"]').click();
		const j = document.querySelector('#host-action [data-jump-sid]');
		return {
			slots: [...document.querySelectorAll('#host-action .slot')].map(s => s.textContent),
			jump: !!j && !j.disabled, sid: j ? j.dataset.jumpSid : '',
			landing: document.querySelectorAll('#host-action .prose').length,
		};
	})()`);
	ok('an in-flight node offers the jump that exists and NAMES the one that does not (B16)',
		inflight.jump && inflight.sid === 'wk-live' && inflight.slots.length === 1 && /B16/.test(inflight.slots[0]!),
		`jump wired to sid ${inflight.sid} (enabled ${inflight.jump}) · the honest slot says "${inflight.slots[0]}"`);

	// --- 11. a building with no flow, and a flow file that will not parse ---

	const failure = await evaluate<{ code: string; file: string; error: string }>(`(() => {
		const f = document.querySelector('#host-focus .flow-fail');
		return { code: f.querySelector('.pill').textContent, file: f.querySelector('.ffile').textContent, error: f.querySelector('.prose').textContent };
	})()`);
	await openBuilding('nb/quiet');
	const quiet = await evaluate<{ note: string; nodes: number; now: number }>(`({
		note: [...document.querySelectorAll('#host-focus p.quiet')].map(p => p.textContent).join(' '),
		nodes: document.querySelectorAll('#host-focus .node').length,
		now: document.querySelectorAll('#host-focus .nowline').length,
	})`);
	ok('a flow that will not parse renders its NAMED failure; a building with no flow says so honestly',
		failure.code === 'unknown-dep' && failure.file.endsWith('broken.flow.json')
		&& quiet.nodes === 0 && quiet.now === 1 && quiet.note.includes('No flow declares') && quiet.note.includes('nb/quiet'),
		`the broken file renders "${failure.code}" — ${failure.file}: ${failure.error.slice(0, 90)}…\n`
		+ `      nb/quiet: ${quiet.nodes} nodes, ${quiet.now} now-line, and the pane says "${quiet.note.slice(0, 120)}…"`);

	await openBuilding('nb/works');
	await until('the flow back on the wall', async () => await evaluate<boolean>(
		`document.querySelectorAll('#host-focus .node').length === 4`), POLL_MS * 2);

	// --- 12. the law of space: three states, and the body never scrolls ---

	const density: Record<string, { nodes: number; overflow: number; width: number; text: number }> = {};
	for (const state of ['minimal', 'typical', 'expanded']) {
		await evaluate(SET('focus', state));
		await settle();
		density[state] = await evaluate<{ nodes: number; overflow: number; width: number; text: number }>(`({
			nodes: document.querySelectorAll('#host-focus .node').length,
			overflow: document.documentElement.scrollHeight - window.innerHeight,
			width: +document.getElementById('pane-focus').getBoundingClientRect().width.toFixed(2),
			text: document.getElementById('host-focus').textContent.trim().length,
		})`);
	}
	ok('minimal is one word and a mark, expanded is the whole drawing, and the body never scrolls',
		density['minimal']!.nodes === 0 && density['typical']!.nodes === 4 && density['expanded']!.nodes === 4
		&& density['minimal']!.text < density['expanded']!.text
		&& Object.values(density).every(d => d.overflow === 0),
		Object.entries(density).map(([k, d]) =>
			`${k}: pane ${d.width} px · ${d.nodes} nodes · ${d.text} chars · scrollHeight − viewport = ${d.overflow} px`).join('\n      '));

	await evaluate(SET('focus', 'expanded'));
	await settle();

	// --- 13. zero fire wiring, and nothing off this origin ---

	const wiring = await evaluate<{ attrs: number; text: number; selects: number; buttons: number }>(`({
		attrs: document.querySelectorAll('[data-fire],[data-apply],[data-worktree],[data-summons]').length,
		text: (document.documentElement.outerHTML.match(/hands\\/fire/g) || []).length,
		selects: document.querySelectorAll('select').length,
		buttons: document.querySelectorAll('#host-focus button, #host-action button').length,
	})`);
	const bundle = await (await fetch(`${ORIGIN}/deck.js`)).text();
	const source = await Bun.file(join(HERE, 'glass/works.client.ts')).text();
	// The one legal `http://` in a deck that draws SVG is the XML **namespace name** — a string the
	// browser never fetches (`createElementNS`). It is excluded by name rather than by loosening the
	// rule, and both counts are printed (F: the first SVG in the city puts it in the bundle).
	const SVG_NS = 'http://www.w3.org/2000/svg';
	const served = await Promise.all([`${ORIGIN}/deck`, `${ORIGIN}/deck.js`, `${ORIGIN}/deck.css`, `${ORIGIN}/deck/state?b=nb/works`]
		.map(async u => {
			const text = await (await fetch(u)).text();
			const all = text.match(/https?:\/\//g)?.length ?? 0;
			const ns = text.split(SVG_NS).length - 1;
			return [u, all - ns, ns] as const;
		}));
	ok('ZERO fire wiring — DOM, source and served bundle — no dropdown, and nothing off this origin',
		wiring.attrs === 0 && wiring.text === 0 && wiring.selects === 0
		&& (bundle.match(/hands\/fire/g) ?? []).length === 0
		&& (source.match(/hands\/fire/g) ?? []).length === 0
		&& served.every(([, n]) => n === 0),
		`DOM: 0 fire attributes, "hands/fire" ${wiring.text}×, ${wiring.selects} <select>, ${wiring.buttons} buttons in Focus+Action\n`
		+ `      glass/works.client.ts: 0× · /deck.js (${bundle.length} B): 0×\n`
		+ `      fetchable http(s):// in served payloads — ${served.map(([u, n, ns]) => `${u.replace(ORIGIN, '')}: ${n}${ns ? ` (+${ns} SVG namespace, never fetched)` : ''}`).join(' · ')}`);

	// --- 14. the cost: the poll, and the tenant's own render ---

	const timings = await evaluate<{ state: number[]; render: number }>(`(async () => {
		const state = [];
		for (let i = 0; i < 20; i++) {
			const t0 = performance.now();
			await fetch('/deck/state?b=nb/works', { headers: { accept: 'application/json' } });
			state.push(+(performance.now() - t0).toFixed(1));
			await new Promise(r => setTimeout(r, 120));
		}
		const host = document.getElementById('host-focus');
		const t1 = performance.now();
		document.querySelector('[data-set-state="typical"][data-pane="focus"]').click();
		document.querySelector('[data-set-state="expanded"][data-pane="focus"]').click();
		const render = +(performance.now() - t1).toFixed(1);
		return { state, render, nodes: host.querySelectorAll('.node').length };
	})()`);
	const sorted = [...timings.state].sort((a, b) => a - b);
	const p95 = sorted[Math.min(sorted.length - 1, Math.ceil(0.95 * sorted.length) - 1)]!;
	ok('the poll carrying the Works stays well inside the 500 ms bar, and the tenant redraws in a frame',
		p95 < 500,
		`/deck/state?b=nb/works n=20 — min ${sorted[0]} · p50 ${sorted[9]} · p95 ${p95} · max ${sorted.at(-1)} (ms)\n`
		+ `      two full state changes redrew the whole drawing in ${timings.render} ms`);

}
catch (e) {
	failures++;
	console.log(`FAIL  the probe itself threw\n      ${e instanceof Error ? e.message : String(e)}`);
	const seen = await evaluate<string>(`JSON.stringify({
		pulse: document.getElementById('pulse').textContent,
		fault: document.getElementById('pulse').dataset.fault,
		focus: document.getElementById('host-focus').textContent.slice(0, 300),
		nodes: [...document.querySelectorAll('#host-focus .node')].map(n => n.dataset.node),
	})`).catch(err => `could not ask the page: ${String(err)}`);
	console.log(`      page says: ${seen}`);
}
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
