// B13's DoD, driven in a real browser.
//
// Four of the acceptance criteria are browser facts — a grid track's measured width, a click
// reaching a delegated handler, a drawer that overlays, a poll arriving — and a fake DOM would
// only ever prove the fake: happy-dom and jsdom do no CSS grid layout, so `getBoundingClientRect()`
// there returns zeros and a "measured width" from one is a fabricated number. So this drives the
// machine's own installed Chrome over the DevTools protocol: no dependency is fetched, installed or
// vendored (D54) — the browser is a local tool like `git` or `ps`, and every URL it touches is
// 127.0.0.1.
//
//    bun belvedere/lab/b13/probe.ts
//
// It stands up its OWN glass on a probe port against a temp census and the `lab/b3/city` fixture:
// the live census is append-only telemetry and a DoD run is not allowed to write a beat into it
// (B8 F1 — this suite has armed the city's real HALT flag once already). Nothing outside the temp
// directory is written.

import { mkdtempSync, rmSync, writeFileSync, appendFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const CITY = join(HERE, 'lab/b3/city');
const PORT = 4489;
const CDP_PORT = 9333;
const DECK = `http://127.0.0.1:${PORT}/deck`;
const POLL_MS = 3000;                                          // must match `deck.client.ts`

const ROOT = mkdtempSync(join(tmpdir(), 'b13-probe-'));
const CENSUS = join(ROOT, 'census.jsonl');
const PROFILE = join(ROOT, 'chrome');

const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};
let failures = 0;

// ---------- the fixture census: our own pid, so `kill -0` says alive ----------

const beat = (sid: string, ev: string, cwd: string) =>
	JSON.stringify({ t: Date.now() / 1000, ev, sid, acct: '/Users/felix/.claude', pid: String(process.pid), cwd }) + '\n';

writeFileSync(CENSUS,
	beat('probe-1', 'PreToolUse', join(CITY, 'probe-row'))
	+ beat('probe-2', 'Stop', join(CITY, 'probe-fork')));

// ---------- processes ----------

async function until(what: string, probe: () => Promise<boolean>, ms = 30_000): Promise<void> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		if (await probe().catch(() => false)) return;
		await Bun.sleep(120);
	}
	throw new Error(`timed out waiting for ${what}`);
}

const glass = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: ROOT, GLASS_CITY: CITY },
	stdout: 'pipe', stderr: 'pipe',
});

const chrome = Bun.spawn([CHROME,
	'--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
	'--disable-background-networking', '--disable-sync', '--disable-default-apps',
	'--window-size=1600,900', `--user-data-dir=${PROFILE}`,
	`--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', DECK,
], { stdout: 'pipe', stderr: 'pipe' });

/**
 * Leave nothing behind (D55). The sleep is not decoration: Chrome is still writing its profile
 * when `kill` returns, and an `rmSync` racing it leaves the temp tree standing — measured, twice,
 * before this wait existed.
 */
async function shut(): Promise<void> {
	chrome.kill();
	glass.kill();
	await Bun.sleep(400);
	rmSync(ROOT, { recursive: true, force: true });
}

// ---------- the DevTools wire ----------

type Reply = { id: number; result?: { result?: { value?: unknown }; exceptionDetails?: unknown }; error?: { message: string } };

let socket: WebSocket;
let nextId = 1;
const waiting = new Map<number, { go: (v: unknown) => void; no: (e: Error) => void }>();

/** One expression in the page, by value. A page-side throw is raised here, never swallowed. */
function evaluate<T>(expression: string): Promise<T> {
	const id = nextId++;
	return new Promise<T>((go, no) => {
		waiting.set(id, { go: v => go(v as T), no });
		socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
	});
}

async function connect(): Promise<void> {
	await until('the glass', async () => (await fetch(DECK)).ok);
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

// ---------- page-side vocabulary ----------

const SET = (pane: string, state: string) =>
	`document.querySelector('[data-set-state="${state}"][data-pane="${pane}"]').click()`;

/**
 * The split is a 69 ms CSS transition (`--snap`), so a `getBoundingClientRect()` taken on the next
 * DevTools round trip measures the deck mid-slide — the first run of this probe read 74/12.9/12.9
 * five milliseconds into a move to 10/60/30 and called it a failure. Measure after it lands.
 */
const settle = () => Bun.sleep(200);

const GEOMETRY = `(() => {
	const w = [...document.querySelectorAll('#app > .pane, #app > .drawer[data-state="pinned"]')]
		.map(e => +e.getBoundingClientRect().width.toFixed(2));
	return {
		widths: w,
		deck: +document.getElementById('app').getBoundingClientRect().width.toFixed(2),
		columns: getComputedStyle(document.getElementById('app')).gridTemplateColumns,
		states: [...document.querySelectorAll('#app > .pane')].map(e => e.dataset.state),
		bodyScroll: document.body.scrollHeight, docScroll: document.documentElement.scrollHeight,
		viewport: window.innerHeight,
	};
})()`;

type Geometry = { widths: number[]; deck: number; columns: string; states: string[]; bodyScroll: number; docScroll: number; viewport: number };

const pct = (g: Geometry) => g.widths.map(w => `${(100 * w / g.deck).toFixed(2)}%`).join(' · ');

// ---------- the run ----------

await connect();
await until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));

console.log(`\n# B13 — the deck shell, measured in Chrome (window 1600×900)\n`);
console.log(`glass: ${DECK}   census: ${CENSUS}   city: ${CITY}\n`);

// --- 1. the resting split, and one clicked one ---

const resting = await evaluate<Geometry>(GEOMETRY);
ok('resting split — context expanded, focus minimal, action minimal (6:1:1 → 75/12.5/12.5)',
	resting.states.join(',') === 'expanded,minimal,minimal'
	&& Math.abs(resting.widths[0]! / resting.deck - 0.75) < 0.005
	&& Math.abs(resting.widths[1]! / resting.deck - 0.125) < 0.005,
	`${resting.columns}  =  ${resting.widths.join(' / ')} px of ${resting.deck}  =  ${pct(resting)}`);

await evaluate(SET('context', 'minimal'));
await evaluate(SET('focus', 'expanded'));
await evaluate(SET('action', 'typical'));
await settle();
const flipped = await evaluate<Geometry>(GEOMETRY);
ok('reapportioned — context minimal, focus expanded, action typical (1:6:3 → 10/60/30)',
	flipped.states.join(',') === 'minimal,expanded,typical'
	&& Math.abs(flipped.widths[0]! / flipped.deck - 0.1) < 0.005
	&& Math.abs(flipped.widths[1]! / flipped.deck - 0.6) < 0.005
	&& Math.abs(flipped.widths[2]! / flipped.deck - 0.3) < 0.005,
	`${flipped.columns}  =  ${flipped.widths.join(' / ')} px of ${flipped.deck}  =  ${pct(flipped)}`);

// --- 2. the body never scrolls, at any of the 27 combinations ---

const STATES = ['minimal', 'typical', 'expanded'];
let worstScroll = 0, checked = 0;
for (const c of STATES) for (const f of STATES) for (const a of STATES) {
	await evaluate(SET('context', c));
	await evaluate(SET('focus', f));
	await evaluate(SET('action', a));
	await settle();
	const g = await evaluate<Geometry>(GEOMETRY);
	worstScroll = Math.max(worstScroll, g.bodyScroll - g.viewport, g.docScroll - g.viewport);
	checked++;
}
ok('the page body never scrolls — all 27 state combinations walked',
	worstScroll <= 0, `${checked} combinations; worst (scrollHeight − viewport) = ${worstScroll}px, viewport 900px`);

// --- 3. click-to-expand, through the bundled code's own handler ---

await evaluate(SET('focus', 'minimal'));
const before = await evaluate<string>(`document.getElementById('pane-focus').dataset.state`);
await evaluate(`document.querySelector('#host-focus').click()`);
const after = await evaluate<string>(`document.getElementById('pane-focus').dataset.state`);
ok('click-to-expand — a click in the body of a minimal pane expands it',
	before === 'minimal' && after === 'typical',
	`clicked #host-focus (not a control): ${before} → ${after}, via the delegated handler in the served bundle`);

// --- 4. the drawer: over everything, then reserving a track ---

await evaluate(SET('context', 'expanded'));
await evaluate(SET('focus', 'minimal'));
await evaluate(SET('action', 'minimal'));
await evaluate(`document.getElementById('drawer-toggle').click()`);
await settle();
const open = await evaluate<{ position: string; z: string; over: boolean; scrim: boolean; tracks: number }>(`(() => {
	const d = document.getElementById('drawer'), s = getComputedStyle(d);
	const r = d.getBoundingClientRect(), c = document.getElementById('pane-context').getBoundingClientRect();
	return { position: s.position, z: s.zIndex, over: r.left < c.right && r.width > 0,
		scrim: !document.getElementById('scrim').hidden,
		tracks: getComputedStyle(document.getElementById('app')).gridTemplateColumns.split(' ').length };
})()`);
ok('drawer opens OVER everything — no track taken, the panes do not move',
	open.position === 'fixed' && open.over && open.scrim && open.tracks === 3,
	`position:${open.position} z-index:${open.z} scrim:${open.scrim} overlapping the context pane:${open.over} · grid still ${open.tracks} tracks`);

const beforePin = await evaluate<Geometry>(GEOMETRY);
await evaluate(`document.getElementById('drawer-pin').click()`);
await settle();
const pinned = await evaluate<Geometry>(GEOMETRY);
ok('drawer pins — it stops overlaying and RESERVES space; the split reapportions',
	pinned.widths.length === 4 && pinned.widths[0]! < beforePin.widths[0]!
	&& await evaluate<string>(`getComputedStyle(document.getElementById('drawer')).position`) === 'static',
	`6fr 1fr 1fr → ${pinned.columns}\n      context ${beforePin.widths[0]} → ${pinned.widths[0]} px · drawer ${pinned.widths[3]} px · ${pct(pinned)}`);
await evaluate(`document.getElementById('drawer-shut').click()`);

// --- 5. the tooltip primitive ---

// A host that declares all three parts of the primitive: the instant line, the long text, and one
// action. The Context pane's building rows are the deck's own use of it.
const TIP_HOST = `document.querySelector('#host-context .row[data-building]')`;
const tipShown = await evaluate<{ hidden: boolean; text: string; expanded: string }>(`(() => {
	${TIP_HOST}.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
	const t = document.getElementById('tip');
	return { hidden: t.hidden, text: t.textContent, expanded: t.dataset.expanded };
})()`);
ok('tooltip — instant: rendered in the same turn as the hover, with no delay to wait out',
	!tipShown.hidden && tipShown.text.length > 0,
	`same-tick read after the mouseover: hidden=${tipShown.hidden} expanded=${tipShown.expanded} · "${tipShown.text}"`);

await Bun.sleep(700);
const tipHeld = await evaluate<{ expanded: string; text: string; action: string | null }>(`(() => {
	const t = document.getElementById('tip');
	return { expanded: t.dataset.expanded, text: t.textContent, action: t.querySelector('.tip-actions a')?.getAttribute('href') ?? null };
})()`);
ok('tooltip — expandable: a held hover reveals the long text and its one action',
	tipHeld.expanded === 'yes' && tipHeld.text.length > tipShown.text.length,
	`after a 450 ms hold: expanded=${tipHeld.expanded} action=${tipHeld.action ?? 'none declared'} · "${tipHeld.text.slice(0, 90)}…"`);

const tipGone = await evaluate<boolean>(`(() => {
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	return document.getElementById('tip').hidden;
})()`);
ok('tooltip — dismissable: Escape closes it, expanded or not', tipGone, `#tip.hidden = ${tipGone}`);

// --- 6. the poll, and a census change reaching the DOM ---

const liveBefore = await evaluate<number>(`+document.getElementById('live-count').dataset.live`);
appendFileSync(CENSUS, beat('probe-3', 'UserPromptSubmit', join(CITY, 'probe-row')));
const changedAt = Date.now();
await until('the new beat to reach the DOM',
	async () => await evaluate<number>(`+document.getElementById('live-count').dataset.live`) === liveBefore + 1,
	POLL_MS * 3);
const sawIn = Date.now() - changedAt;
ok('a census change appears in the DOM within one poll interval',
	sawIn <= POLL_MS + 500,
	`live ${liveBefore} → ${liveBefore + 1} after appending one beat, seen in ${sawIn} ms (poll interval ${POLL_MS} ms)`);

const network = await evaluate<{ polls: number; requests: string[] }>(`(() => {
	const r = performance.getEntriesByType('resource').filter(e => e.name.includes('/deck/state'));
	return { polls: +document.getElementById('pulse').dataset.polls, requests: r.map(e => Math.round(e.startTime) + 'ms ' + e.transferSize + 'B') };
})()`);
ok('the client polls `/deck/state` — real requests, counted by the browser',
	network.requests.length >= 2 && network.polls >= 2,
	`${network.requests.length} requests in the resource timeline, ${network.polls} answered: ${network.requests.slice(0, 6).join(' · ')}`);

// --- 7. nothing off this origin ---

const offOrigin = await evaluate<string[]>(`performance.getEntriesByType('resource').map(e => e.name).filter(n => !n.startsWith('http://127.0.0.1:${PORT}/'))`);
ok('zero external requests — every byte the deck loaded came from this origin',
	offOrigin.length === 0, `${offOrigin.length} off-origin requests${offOrigin.length ? ': ' + offOrigin.join(', ') : ''}`);

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
await shut();
process.exit(failures === 0 ? 0 : 1);
