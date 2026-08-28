// B16's browser half, driven in a real Chrome.
//
//    bun belvedere/lab/b16/probe.ts
//
// What lives here is everything that is a *browser* fact — a hotswap reaching a delegated handler,
// a draft surviving a repaint and a killed server, a send control that structurally does not exist
// while the hands are cold. A fake DOM would only prove the fake (B13 F1), so this drives the
// machine's own installed Chrome over the DevTools protocol: nothing fetched, nothing vendored, and
// every URL 127.0.0.1.
//
// It runs against a **fixture** census and the `lab/b3/city` fixture, because the three hotswap
// entry points need three sessions of known shape — including one *blocked on a permission prompt*,
// which is what puts a row in the needs-you queue — and because the live census is append-only
// telemetry a DoD run does not get to write into (B8 F1).
//
// The live half — a real message into a real session, byte-exact, and the same to a dead one —
// cannot be faked and does not belong here: it is `lab/b16/send.ts`.

import { mkdtempSync, rmSync, writeFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const CITY = join(HERE, 'lab/b3/city');
const PORT = 4496;
const CDP_PORT = 9340;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;

const ROOT = mkdtempSync(join(tmpdir(), 'b16-probe-'));
const CENSUS = join(ROOT, 'census.jsonl');
const DESK = join(ROOT, 'desk');
const PROFILE = join(ROOT, 'chrome');
const NOWHERE = join(ROOT, 'no-credential-here');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

// ---------- the fixture: three sessions, three shapes, three transcripts ----------

const A = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
const B = 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb';
const C = 'cccccccc-3333-4333-8333-cccccccccccc';

const user = (text: string, ts: string) =>
	JSON.stringify({ type: 'user', isSidechain: false, timestamp: ts, message: { role: 'user', content: text } });
const says = (text: string, ts: string) =>
	JSON.stringify({ type: 'assistant', isSidechain: false, timestamp: ts, message: { model: 'claude-sonnet-4-5', content: [{ type: 'text', text }] } });
const uses = (name: string, input: Record<string, unknown>, ts: string) =>
	JSON.stringify({ type: 'assistant', isSidechain: false, timestamp: ts, message: { model: 'claude-sonnet-4-5', content: [{ type: 'tool_use', name, input }] } });
const named = (stamp: string, sid: string) => JSON.stringify({ type: 'agent-name', agentName: stamp, sessionId: sid });

const iso = (n: number) => new Date(Date.now() - n * 60_000).toISOString();

/** A transcript long enough that one window cannot hold it — the scroll-up has to have work to do. */
function transcript(sid: string, stamp: string, turns: number): string {
	const path = join(ROOT, `${sid}.jsonl`);
	const lines = [named(stamp, sid)];
	for (let n = 0; n < turns; n++) {
		lines.push(user(`turn ${n}: read canon row 17 and D2\n\n\`\`\`\nYou are a Builder at opus-high.\ncanon row 17\n\`\`\`\n`, iso(turns - n)));
		lines.push(uses('Read', { file_path: `/Users/felix/code/agents/belvedere/plans/b16-chat.md#${n}` }, iso(turns - n)));
		lines.push(says(`answer ${n} — ${'padding '.repeat(60)}`, iso(turns - n)));
	}
	writeFileSync(path, lines.join('\n') + '\n');
	return path;
}

const beat = (o: Record<string, unknown>) => JSON.stringify({
	acct: '/Users/felix/.claude', pid: String(process.pid), ws: '', sf: '', tool: '', why: '', ...o,
}) + '\n';

const TA = transcript(A, 'builder-probe-01', 400);   // ~440 kB: bigger than one window, so the scroll-up has work
const TB = transcript(B, 'digger-probe-02', 4);
const TC = transcript(C, 'architect-probe-03', 4);

writeFileSync(CENSUS,
	beat({ t: Date.now() / 1000 - 5, ev: 'PreToolUse', sid: A, cwd: join(CITY, 'probe-row'), tp: TA, sf: 'surface:1', ws: 'ws-a' })
	+ beat({ t: Date.now() / 1000 - 9, ev: 'Stop', sid: B, cwd: join(CITY, 'probe-fork'), tp: TB, sf: 'surface:2', ws: 'ws-b' })
	// The queue's own entry point exists only for a session blocked on a permission prompt (B14's
	// waiting edge), and only where the beat carried a surface — so this one carries both.
	+ beat({ t: Date.now() / 1000 - 2, ev: 'Notification', why: 'permission_prompt', sid: C, cwd: join(CITY, 'probe-row'), tp: TC, sf: 'surface:3', ws: 'ws-c' }));

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}: lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t | xargs kill`);
	rmSync(ROOT, { recursive: true, force: true });
	process.exit(2);
}

// ---------- processes ----------

async function until<T>(what: string, probe: () => Promise<T | null>, ms = 45_000): Promise<T> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		const got = await probe().catch(() => null);
		if (got !== null && got !== false) return got as T;
		await Bun.sleep(150);
	}
	throw new Error(`timed out waiting for ${what}`);
}
const yes = (b: boolean): true | null => (b ? true : null);

/**
 * `FLOWS_DIR` is an empty temp directory on purpose: this probe stands up a real glass, and a real
 * glass runs a real engine. Pointing it at the city's own flows would let a DoD run arm and fire
 * declared work — B11 F1's lesson, one door further along.
 */
const ENV = (over: Record<string, string> = {}) => ({
	...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: ROOT, GLASS_CITY: CITY,
	FLOWS_DIR: join(ROOT, 'flows'), DESK_DIR: DESK, ...over,
});

let glass = Bun.spawn(['bun', SERVER], { env: ENV(), stdout: 'pipe', stderr: 'pipe' });

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

async function connect(): Promise<void> {
	await until('the glass', async () => yes((await fetch(DECK)).ok));
	await until('chrome', async () => yes((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok));
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
const settle = () => Bun.sleep(220);

/** Which pane a hotswap control was clicked in — the entry point, named by where it lives. */
const CLICK_CHAT = (host: string, sid: string) =>
	`(() => { const b = document.querySelector('#${host} [data-chat-sid="${sid}"]'); if (!b) return 'MISSING'; b.click(); return '${host}'; })()`;

const TARGET = `(() => {
	const head = document.querySelector('#host-focus .ct-head .big');
	return { name: head ? head.textContent : null, turns: document.querySelectorAll('#host-focus .ct').length,
		user: document.querySelectorAll('#host-focus .ct-user').length,
		acts: document.querySelectorAll('#host-focus .ct-act').length,
		fences: document.querySelectorAll('#host-focus .ct-fence').length,
		decoded: document.querySelectorAll('#host-focus .ct .prose .dw').length,
		inFence: document.querySelectorAll('#host-focus .ct-fence .dw').length,
		draft: (document.querySelector('[data-chat-draft]') || {}).value ?? null,
		sendWiring: document.querySelectorAll('[data-chat-send]').length,
		reason: (document.querySelector('#host-action .reason') || {}).textContent ?? null };
})()`;

type Target = {
	name: string | null; turns: number; user: number; acts: number; fences: number;
	decoded: number; inFence: number; draft: string | null; sendWiring: number; reason: string | null;
};

const TYPE = (text: string) => `(() => {
	const a = document.querySelector('[data-chat-draft]');
	a.value = ${JSON.stringify(text)};
	a.dispatchEvent(new Event('input', { bubbles: true }));
	return a.value.length;
})()`;

// ---------- the run ----------

try {
	await connect();
	await until('the first poll', async () => yes(await evaluate<boolean>(`!!document.querySelector('#live-count')`)));

	console.log(`\n# B16 — the Chat, measured in Chrome (window 1600×900)\n`);
	console.log(`glass: ${DECK}   census: ${CENSUS}   city: ${CITY}   desk: ${DESK}\n`);

	// --- 1. three entry points, three targets, one view ---

	await evaluate(SET('context', 'expanded'));
	await evaluate(SET('focus', 'expanded'));
	await evaluate(SET('action', 'expanded'));
	await settle();

	const fromCity = await evaluate<string>(CLICK_CHAT('host-context', A));
	await until('A in the Chat', async () => yes((await evaluate<Target>(TARGET)).name === 'builder-probe-01'));
	const a1 = await evaluate<Target>(TARGET);

	// Entry point 2 is the Workshop's own session list, so the deck goes back to that tenant first.
	await evaluate(`document.querySelector('[data-focus-on="workshop"]').click()`);
	// B's own building, by name: a building's slug is resolved against the REAL `~/code` even inside
	// a fixture city (B10 F5), so the probe matches the tail rather than shipping the whole path.
	await evaluate(`document.querySelector('#host-context [data-building$="probe-fork"]').click()`);
	await until('the Workshop\'s sessions', async () => yes(await evaluate<boolean>(`!!document.querySelector('#host-focus [data-chat-sid]')`)));
	const fromWorkshop = await evaluate<string>(CLICK_CHAT('host-focus', B));
	await until('B in the Chat', async () => yes((await evaluate<Target>(TARGET)).name === 'digger-probe-02'));

	// Entry point 3 is the drawer's needs-you queue — a session blocked on a permission prompt.
	await evaluate(`document.getElementById('drawer-toggle').click()`);
	await until('the queue', async () => yes(await evaluate<boolean>(`!!document.querySelector('#host-drawer [data-chat-sid]')`)));
	const fromQueue = await evaluate<string>(CLICK_CHAT('host-drawer', C));
	await until('C in the Chat', async () => yes((await evaluate<Target>(TARGET)).name === 'architect-probe-03'));
	await evaluate(`document.getElementById('drawer-shut').click()`);

	ok('hotswap — three entry points, three targets, ONE view',
		fromCity === 'host-context' && fromWorkshop === 'host-focus' && fromQueue === 'host-drawer'
		&& await evaluate<number>(`document.querySelectorAll('#host-focus .ct-head').length`) === 1,
		`City → builder-probe-01 · Workshop → digger-probe-02 · needs-you queue → architect-probe-03`
		+ `, and exactly one .ct-head on the deck at any moment`);

	// --- 2. the transcript: tail-windowed, encapsulated activity, fences exempt ---

	await evaluate(CLICK_CHAT('host-context', A));
	await until('A back', async () => yes((await evaluate<Target>(TARGET)).name === 'builder-probe-01'));
	const tail = await evaluate<Target>(TARGET);
	const held = await evaluate<{ from: number; total: number }>(
		`fetch('/deck/chat?sid=${A}').then(r => r.json()).then(v => ({ from: v.from, total: v.bytes }))`);
	ok('transcript — tail-windowed off a 400-turn file, tool calls encapsulated to one line each',
		tail.turns > 0 && tail.turns <= 40 && tail.acts > 0 && held.from > 0,
		`${tail.turns} turns rendered (${tail.user} his) · ${tail.acts} activity lines · window opens at byte ${held.from} of ${held.total}`);

	ok('the decoder runs on transcript prose and stops at the fence (B20 §1, one grammar on)',
		tail.decoded > 0 && tail.fences > 0 && tail.inFence === 0,
		`${tail.decoded} code words hoverable in the agents' own words · ${tail.fences} fenced blocks · ${tail.inFence} decoder spans inside them`);

	const before = tail.turns;
	await evaluate(`document.querySelector('[data-chat-earlier]').click()`);
	const grown = await until('an earlier window', async () => {
		const t = await evaluate<Target>(TARGET);
		return t.turns > before ? t : null;
	});
	ok('scroll-up loads earlier windows, and no turn is ever drawn twice',
		grown.turns > before
		&& await evaluate<boolean>(`(() => { const k = [...document.querySelectorAll('#host-focus .ct')].map(e => e.dataset.key); return new Set(k).size === k.length; })()`),
		`${before} turns → ${grown.turns} after one [↑ earlier]; every data-key distinct`);

	// --- 2b. the two scroll independently, and the page still does not (keel §§2, 5) ---
	//
	// B13's own probe never measures this tenant: it boots a fresh profile, so the Workshop is what
	// stands in Focus there. The law of space is the deck's, but a tenant that put a 400-turn
	// transcript in the page's flow instead of in its own overflow would break it silently.

	const scroll = await evaluate<{ body: number; viewport: number; turns: [number, number]; draft: [number, number] }>(`(() => {
		const t = document.getElementById('chat-turns');
		const d = document.querySelector('[data-chat-draft]');
		return { body: document.body.scrollHeight, viewport: window.innerHeight,
			turns: [t.scrollHeight, t.clientHeight], draft: [d.scrollHeight, d.clientHeight] };
	})()`);
	ok('the transcript and the draft own their own overflow — the page never scrolls (B13 F4 kept)',
		scroll.body - scroll.viewport === 0 && scroll.turns[0] > scroll.turns[1],
		`body ${scroll.body} px − viewport ${scroll.viewport} px = ${scroll.body - scroll.viewport} px · `
		+ `transcript scrolls inside itself ${scroll.turns[0]} / ${scroll.turns[1]} px · draft ${scroll.draft[0]} / ${scroll.draft[1]} px`);

	// --- 3. the draft: per target, and it survives the hotswap that replaced it ---

	const DRAFT_A = 'a draft for A\n\nwith a blank line in it';
	await evaluate(TYPE(DRAFT_A));
	await Bun.sleep(900);                                  // past the save debounce
	await evaluate(CLICK_CHAT('host-context', C));
	await until('C', async () => yes((await evaluate<Target>(TARGET)).name === 'architect-probe-03'));
	const cEmpty = await evaluate<Target>(TARGET);
	await evaluate(TYPE('a different draft, for C'));
	await Bun.sleep(900);
	await evaluate(CLICK_CHAT('host-context', A));
	const backToA = await until('A again', async () => {
		const t = await evaluate<Target>(TARGET);
		return t.name === 'builder-probe-01' ? t : null;
	});
	ok('drafts are per-target: A’s survives a hotswap to C and back, C’s is its own',
		backToA.draft === DRAFT_A && cEmpty.draft === '',
		`A: ${JSON.stringify(backToA.draft)} · C was empty when first opened and holds its own text now`);

	ok('the draft is on disk under desk/drafts, one file per target (D17, D18 class 3)',
		existsSync(join(DESK, 'drafts', `${A}.md`)) && existsSync(join(DESK, 'drafts', `${C}.md`)),
		`${join(DESK, 'drafts')} — ${A}.md and ${C}.md`);

	// --- 4. kill the glass mid-draft and relaunch (B8's drill pattern) ---

	glass.kill();
	await Bun.sleep(300);
	glass = Bun.spawn(['bun', SERVER], { env: ENV(), stdout: 'pipe', stderr: 'pipe' });
	await until('the glass again', async () => yes((await fetch(DECK)).ok));
	await evaluate(`location.reload()`);
	await Bun.sleep(600);
	await connect();
	const survived = await until('the draft after a relaunch', async () => {
		const t = await evaluate<Target>(TARGET);
		return t.draft === DRAFT_A ? t : null;
	});
	ok('draft persistence — the server was killed mid-draft and the words came back',
		survived.draft === DRAFT_A,
		`reloaded against a fresh process; the box holds ${JSON.stringify(survived.draft)} (the target is remembered too)`);

	// --- 5. cold hands: no send control at all, and the route says 503 ---

	glass.kill();
	await Bun.sleep(300);
	glass = Bun.spawn(['bun', SERVER], { env: ENV({ BELVEDERE_ENV: NOWHERE }), stdout: 'pipe', stderr: 'pipe' });
	await until('the cold glass', async () => yes((await fetch(DECK)).ok));
	await evaluate(`location.reload()`);
	await Bun.sleep(600);
	await connect();
	const cold = await until('the cold render', async () => {
		const t = await evaluate<Target>(TARGET);
		return t.reason !== null ? t : null;
	});
	const posted = await evaluate<{ status: number; error: string }>(
		`fetch('/chat/send', { method: 'POST', headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ sid: '${A}', text: 'nope' }) })
		 .then(async r => ({ status: r.status, error: (await r.json()).error }))`);
	ok('hands disarmed — ZERO send wiring in the DOM, and the route answers 503 (D10 as structure)',
		cold.sendWiring === 0 && posted.status === 503 && cold.draft === DRAFT_A,
		`[data-chat-send] × ${cold.sendWiring} · POST /chat/send → ${posted.status} ${posted.error} · the draft is untouched`);

	const draftPost = await evaluate<number>(
		`fetch('/chat/draft', { method: 'POST', headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ sid: '${A}', text: 'still writable' }) }).then(r => r.status)`);
	ok('cold hands never cost him the ability to write it down (B6 F3’s law, second venue)',
		draftPost === 200,
		`POST /chat/draft → ${draftPost} with no credential — a file write under desk/ sits in FRONT of the arming switch`);

	// --- 6. the structural greps: which SOURCE may reach the spawning hand (B17 F1) ---

	const js = await (await fetch(`${ORIGIN}/deck.js`)).text();
	const src = await Bun.file(join(HERE, 'glass/chat.client.ts')).text();
	const fires = (s: string) => s.split('hands/fire').length - 1;
	ok('the Chat cannot fire a session: 0 in its source, and the bundle still carries the one',
		fires(src) === 0 && fires(js) === 1,
		`chat.client.ts ${fires(src)}× · /deck.js ${fires(js)}× (composer.client.ts, the one file allowed to — keel §3)`);

	const dom = await evaluate<{ markup: number; text: number }>(
		`(() => { const b = document.body; return { markup: (b.outerHTML.split('data-chat-send').length - 1),
			text: (b.textContent.split('data-chat-send').length - 1) }; })()`);
	ok('and the DOM check subtracts the text (B17 F1): markup, not a rendered string',
		dom.markup === 0 && dom.text === 0,
		`data-chat-send in outerHTML ${dom.markup}× · in textContent ${dom.text}×`);
}
catch (e) { console.error('\nPROBE THREW:', e); failures++; }
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
