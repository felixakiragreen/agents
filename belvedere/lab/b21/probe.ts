// B21's browser half, driven in a real Chrome.
//
//    bun belvedere/lab/b21/probe.ts
//
// The commissioning query is the DoD's own smoke, so this probe runs against the **real corpus**:
// the three accounts' transcript trees and the real register's doctrine documents, both of which are
// reads. What it does *not* touch is anything that would be a write — the census, the audit log, the
// HALT flag, the flows and the desk all point at a temp root (B8 F1's law, and B11 F1's: a real glass
// runs a real engine, so a probe must never let it see the city's own flow files).
//
// It is cold-handed on purpose (`BELVEDERE_ENV` names nothing): a search reaches no socket, so
// nothing here can move Felix's desktop.

import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4497;
const CDP_PORT = 9341;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;

const ROOT = mkdtempSync(join(tmpdir(), 'b21-probe-'));
const CENSUS = join(ROOT, 'census');
const DESK = join(ROOT, 'desk');
const PROFILE = join(ROOT, 'chrome');
const CITY = join(homedir(), 'code');                         // the real register: a read, and the point

mkdirSync(CENSUS, { recursive: true });
mkdirSync(join(ROOT, 'flows'), { recursive: true });

/**
 * A term that exists in exactly one place in the world: the note this probe writes.
 *
 * **Minted at run time, never written as a literal.** The corpus this probe searches is the real
 * one, and the real one contains this session's own transcript — a fixed marker in this file is a
 * marker in the corpus before the probe ever runs, and the case-smart arm then measures the probe
 * instead of the note (found the hard way: `GREPCASEMARKER` answered three hits).
 */
const MARKER = `GrepCase${Math.random().toString(36).slice(2, 8)}Marker`;
const NOTE = `b21 probe note\n\nA note carrying ${MARKER} and nothing else does.\n`;

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}: lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t | xargs kill`);
	rmSync(ROOT, { recursive: true, force: true });
	process.exit(2);
}

// ---------- processes ----------

async function until<T>(what: string, probe: () => Promise<T | null>, ms = 60_000): Promise<T> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		const got = await probe().catch(() => null);
		if (got !== null && got !== false) return got as T;
		await Bun.sleep(150);
	}
	throw new Error(`timed out waiting for ${what}`);
}
const yes = (b: boolean): true | null => (b ? true : null);

const ENV = (over: Record<string, string> = {}) => ({
	...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: CENSUS, GLASS_CITY: CITY,
	FLOWS_DIR: join(ROOT, 'flows'), DESK_DIR: DESK, BELVEDERE_ENV: join(ROOT, 'no-credential-here'), ...over,
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
const settle = () => Bun.sleep(280);

/** Typed into the rendered box and submitted by the rendered key — never by calling `runGrep`. */
const SEARCH = (term: string) => `(() => {
	const box = document.getElementById('grep-q');
	box.focus();
	box.value = ${JSON.stringify(term)};
	box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
	return box.value;
})()`;

const KEY = (key: string, meta = false) => `(() => {
	document.getElementById('grep-q').blur();
	document.body.dispatchEvent(new KeyboardEvent('keydown', { key: ${JSON.stringify(key)}, metaKey: ${meta}, bubbles: true }));
	return document.activeElement.id;
})()`;

const RESULTS = `(() => {
	const hits = [...document.querySelectorAll('#host-drawer .hit-list .hit')].map(h => ({
		kind: [...h.classList].find(c => c.startsWith('hit-') && c !== 'hit-line') ?? '',
		name: (h.querySelector('.hit-h .name') || {}).textContent ?? '',
		where: (h.querySelector('.hit-h .where') || {}).textContent ?? '',
		mark: (h.querySelector('.hit-mark') || {}).textContent ?? null,
		line: (h.querySelector('.hit-line') || {}).textContent ?? '',
		decodes: h.querySelectorAll('.hit-line .dw').length,
	}));
	return {
		drawer: document.getElementById('drawer').dataset.state,
		name: document.getElementById('drawer-name').textContent,
		head: (document.querySelector('#host-drawer .label') || {}).textContent ?? '',
		groups: [...document.querySelectorAll('#host-drawer .hits')].map(s => ({
			kind: (s.querySelector('.hits-name') || {}).textContent,
			n: Number((s.querySelector('.num') || {}).textContent),
			bounds: (s.querySelector('.quiet') || {}).textContent ?? '',
		})),
		degraded: (document.querySelector('#host-drawer .degraded') || {}).textContent ?? null,
		legend: document.querySelectorAll('#host-drawer .legend-deck .lkey').length,
		strays: document.querySelectorAll('#host-drawer .hit:not(.hit-list .hit)').length,
		hits,
	};
})()`;

type Results = {
	drawer: string; name: string; head: string; degraded: string | null; legend: number; strays: number;
	groups: { kind: string; n: number; bounds: string }[];
	hits: { kind: string; name: string; where: string; mark: string | null; line: string; decodes: number }[];
};

const CHAT = `(() => {
	const aim = document.querySelector('#host-focus [data-aim]');
	const box = document.getElementById('chat-turns');
	const rect = aim ? aim.getBoundingClientRect() : null;
	const pane = box ? box.getBoundingClientRect() : null;
	return {
		tenant: (document.querySelector('[data-focus-on][data-on="yes"]') || {}).dataset?.focusOn ?? null,
		name: (document.querySelector('#host-focus .ct-head .big') || {}).textContent ?? null,
		note: (document.querySelector('.ct-aim-note .label') || {}).textContent ?? null,
		latest: document.querySelectorAll('[data-chat-latest]').length,
		key: aim ? aim.dataset.key : null,
		at: aim ? (aim.querySelector('.ago') || {}).dataset?.at ?? null : null,
		text: aim ? aim.textContent : null,
		keys: [...document.querySelectorAll('#host-focus .ct')].map(e => Number(e.dataset.key)),
		turns: document.querySelectorAll('#host-focus .ct').length,
		inView: rect && pane ? rect.top >= pane.top - 4 && rect.top <= pane.bottom : false,
	};
})()`;

type Chat = {
	tenant: string | null; name: string | null; note: string | null; latest: number;
	key: string | null; at: string | null; text: string | null; keys: number[]; turns: number; inView: boolean;
};

const VIEWER = `(() => {
	const mark = document.querySelector('#host-focus .doc-lines .dl[data-mark="yes"]');
	return {
		doc: (document.querySelector('#host-focus .doc-name') || {}).textContent ?? null,
		line: mark ? mark.dataset.line : null,
		text: mark ? (mark.querySelector('.lt') || {}).textContent : null,
		marked: document.querySelectorAll('#host-focus .dl[data-mark="yes"]').length,
	};
})()`;

const DESKVIEW = `(() => ({
	tenant: (document.querySelector('[data-focus-on][data-on="yes"]') || {}).dataset?.focusOn ?? null,
	box: (document.querySelector('[data-desk-write]') || {}).value ?? null,
}))()`;

const ms = (t: number) => `${t.toFixed(1)} ms`;
const pct = (xs: number[], p: number) => xs.slice().sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(p * xs.length))]!;

async function timed(path: string): Promise<{ ms: number; body: unknown }> {
	const t0 = performance.now();
	const r = await fetch(`${ORIGIN}${path}`, { headers: { accept: 'application/json' } });
	const body = await r.json();
	return { ms: performance.now() - t0, body };
}

// ---------- the run ----------

try {
	// The desk hit needs a desk note, and the desk is the temp one: written through the glass's own
	// route rather than by this file, so the file the search finds is the file the desk wrote.
	await until('the glass', async () => yes((await fetch(DECK)).ok));
	const saved = await (await fetch(`${ORIGIN}/desk/save`, {
		method: 'POST', headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ slug: '', text: NOTE }),
	})).json() as { ok: boolean; result?: { slug: string } };
	const noteSlug = saved.result?.slug ?? '';

	await connect();
	await until('the first poll', async () => yes(await evaluate<boolean>(`!!document.querySelector('#pane-context')`)));

	console.log(`\n# B21 — the Grep, measured in Chrome (window 1600×900)\n`);
	console.log(`glass: ${DECK}   city: ${CITY} (real, read-only)   desk: ${DESK}   census: ${CENSUS} (temp)\n`);

	await evaluate(SET('context', 'typical'));
	await evaluate(SET('focus', 'expanded'));
	await evaluate(SET('action', 'minimal'));
	await settle();

	// --- 1. the entry: one keystroke (spec §3) ---

	const bySlash = await evaluate<string>(KEY('/'));
	await evaluate(`document.getElementById('grep-q').blur()`);
	const byChord = await evaluate<string>(KEY('k', true));
	ok('the box is focusable by keystroke — / and ⌘K both, pre-chewed (spec §3)',
		bySlash === 'grep-q' && byChord === 'grep-q',
		`a bare "/" put focus on #${bySlash}; ⌘K put it on #${byChord} — and a "/" typed inside a box is still a "/" (the handler ignores it in a field)`);

	// --- 2. the commissioning query (DoD 1) ---

	await evaluate(SEARCH('bob summons'));
	const found = await until('the results', async () => {
		const r = await evaluate<Results>(RESULTS);
		return r.hits.length ? r : null;
	});
	const sessions = found.hits.filter(h => h.kind === 'hit-sessions');
	const accounts = [...new Set(sessions.map(h => h.where.split(' · ')[0]))];
	ok('the commissioning query, live: “bob summons” → session hits in more than one account, grouped',
		accounts.length >= 2 && found.groups.map(g => g.kind).join('/') === 'sessions/docs/desk'
		&& found.drawer !== 'shut' && found.name === 'results',
		`${found.head} — ${sessions.length} session hits across ${accounts.length} accounts (${accounts.join(' · ')}); `
		+ `groups ${found.groups.map(g => `${g.kind} ${g.n}`).join(' · ')}; the one drawer says "${found.name}"`);

	ok('the term is marked in every result line that carries it (DoD 5)',
		found.hits.every(h => h.mark === null || h.mark.toLowerCase() === 'bob summons')
		&& found.hits.every(h => h.mark !== null) && found.strays === 0,
		`marks: ${JSON.stringify([...new Set(found.hits.map(h => h.mark))])} on ${found.hits.length} of `
		+ `${found.hits.length} rows · ${found.strays} elements outside a result list answer a .hit selector `
		+ `(the legend's keys are their own class, so a legend sample is never a fifth result)`);

	// A hit line is corpus prose, so it decodes like corpus prose everywhere else (spec §6).
	await evaluate(SEARCH('B18'));
	const decoded = await until('a result carrying code words', async () => {
		const r = await evaluate<Results>(RESULTS);
		return r.head.includes('B18') && r.hits.length ? r : null;
	});
	ok('hit lines pass through B20’s decoder — a result mentioning B18 decodes like everything else (spec §6)',
		decoded.hits.reduce((a, h) => a + h.decodes, 0) > 0,
		`${decoded.hits.length} rows carry ${decoded.hits.reduce((a, h) => a + h.decodes, 0)} hoverable code words `
		+ `between them; the mark is drawn AROUND the same seam, so the marked term decodes too`);

	// --- 3. the session jump: the Chat, at the turn (DoD 1) ---

	await evaluate(SEARCH('bob summons'));
	await until('the commissioning results again', async () => {
		const r = await evaluate<Results>(RESULTS);
		return r.head.includes('bob summons') && r.hits.some(h => h.kind === 'hit-sessions') ? r : null;
	});

	// The anchors, read off the wire, so the DOM can be checked against the coordinate it was given
	// rather than against itself.
	const wire = (await timed('/deck/grep?q=bob%20summons')).body as
		{ groups: { hits: { name: string; where: string; jump: { to: string; sid?: string; anchor?: number } }[] }[] };
	const wireHits = wire.groups[0]!.hits;

	await evaluate(`document.querySelectorAll('#host-drawer .hit-list .hit-sessions')[0].click()`);
	const chat = await until('the Chat at the turn', async () => {
		const c = await evaluate<Chat>(CHAT);
		return c.key !== null ? c : null;
	});
	const anchor = wireHits[0]!.jump.anchor!;
	const owning = Math.max(...chat.keys.filter(k => k <= anchor));
	const next = chat.keys.filter(k => k > anchor).sort((a, b) => a - b)[0] ?? Infinity;
	const when = chat.at === null ? 'no timestamp on that turn' : new Date(Number(chat.at) * 1000).toISOString();
	ok('click a session hit → the Chat hotswaps to that session AT the turn the matching line belongs to',
		chat.tenant === 'chat' && Number(chat.key) === owning && owning <= anchor && anchor < next && chat.inView,
		`Focus is the ${chat.tenant} pane on "${chat.name}" (the hit named "${wireHits[0]!.name}", ${wireHits[0]!.where}); `
		+ `the matching line begins at byte ${anchor}; the marked turn is [data-key="${chat.key}"] and the next turn `
		+ `opens at ${next === Infinity ? 'EOF' : next} — so the anchor lies inside the marked turn and no other; `
		+ `timestamped ${when}, ${chat.turns} turns in the window, the marked one scrolled into the box`);

	// The other half of the same claim: what the reader SEES. A raw-JSONL hit can land in a record the
	// Chat encapsulates to one line (a tool call's input is clipped to its head, spec §2), so the turn
	// is right and the bytes are not on screen — spec §5's miss class, second face. Walk the hits and
	// report both counts rather than asserting the first one happens to be a spoken turn.
	let visible: { i: number; name: string; where: string; text: string } | null = null;
	let hidden = 0;
	for (const [i, h] of wireHits.slice(0, 8).entries()) {
		await evaluate(`document.querySelectorAll('#host-drawer .hit-list .hit-sessions')[${i}].click()`);
		const c = await until(`hit ${i}`, async () => {
			const got = await evaluate<Chat>(CHAT);
			return got.key !== null && got.text !== null ? got : null;
		});
		if ((c.text ?? '').toLowerCase().includes('bob summons')) {
			visible = { i, name: h.name, where: h.where, text: (c.text ?? '').replace(/\s+/g, ' ').trim().slice(0, 160) };
			break;
		}
		hidden++;
	}
	ok('and the turn it lands on SHOWS the words he searched for (the commissioning query, whole)',
		visible !== null,
		visible === null ? `eight hits walked and none rendered the term` :
		`hit #${visible.i} — "${visible.name}", ${visible.where} — opens marked and reads: ${JSON.stringify(visible.text)}`
		+ (hidden ? ` · ${hidden} earlier hit(s) landed in records the Chat encapsulates to one line (a tool call's input, spec §2) — the turn is right, the bytes are one jump-to-pane away` : ''));

	ok('and the jump says it IS a jump: this window is the file’s past, with the way back on it',
		chat.note !== null && chat.latest === 1,
		`"${chat.note}" · one [↓ latest] control — the aimed window and the live tail are two places in the `
		+ `file, and the deck will not stitch them into one conversation`);

	// --- 4. the doc jump: the viewer, at the line (DoD 2) ---

	await evaluate(`document.getElementById('drawer-toggle').click()`);
	await settle();
	const docHit = (await evaluate<Results>(RESULTS)).hits.filter(h => h.kind === 'hit-docs')[0];
	await evaluate(`document.querySelectorAll('#host-drawer .hit-list .hit-docs')[0].click()`);
	const viewer = await until('the viewer', async () => {
		const v = await evaluate<{ doc: string | null; line: string | null; text: string | null; marked: number }>(VIEWER);
		return v.line !== null ? v : null;
	});
	ok('a doc hit jumps to the line-anchored viewer — exactly one line marked, and it is the line (DoD 2)',
		viewer.marked === 1 && `${docHit?.where}`.endsWith(`:${viewer.line}`)
		&& (viewer.text ?? '').toLowerCase().includes('bob summons'),
		`${viewer.doc} · line ${viewer.line} marked, ${viewer.marked} line marked in the whole document · `
		+ `the hit said ${docHit?.where} · the line reads ${JSON.stringify((viewer.text ?? '').trim().slice(0, 90))}`);

	// --- 5. the desk jump, and case-smart on a term that exists in exactly one place (DoD 2, 5) ---

	await evaluate(`document.getElementById('drawer-toggle').click()`);
	await evaluate(SEARCH(MARKER));
	const exact = await until('the marker', async () => {
		const r = await evaluate<Results>(RESULTS);
		return r.head.includes(MARKER) ? r : null;
	});
	await evaluate(SEARCH(MARKER.toLowerCase()));
	const lower = await until('the lower-case query', async () => {
		const r = await evaluate<Results>(RESULTS);
		return r.head.includes(MARKER.toLowerCase()) ? r : null;
	});
	await evaluate(SEARCH(MARKER.toUpperCase()));
	const upper = await until('the upper-case query', async () => {
		const r = await evaluate<Results>(RESULTS);
		return r.head.includes(MARKER.toUpperCase()) ? r : null;
	});
	ok('case-smart, asserted: all-lower asks for either case, a capital means it (DoD 5)',
		lower.hits.length > 0 && upper.hits.length === 0 && exact.hits.length > 0
		&& lower.head.includes('case-insensitive') && upper.head.includes('case-sensitive'),
		`"${MARKER.toLowerCase()}" → ${lower.hits.length} hit(s), ${lower.head.split(' · ').at(-1)} · `
		+ `"${MARKER.toUpperCase()}" → ${upper.hits.length} hits, ${upper.head.split(' · ').at(-1)} · `
		+ `"${MARKER}" → ${exact.hits.length} hit(s) — one term, three cases, the rule said out loud on the page`);

	await evaluate(SEARCH(MARKER));
	await until('the desk group', async () => yes(await evaluate<boolean>(`!!document.querySelector('#host-drawer .hit-list .hit-desk')`)));
	await evaluate(`document.querySelector('#host-drawer .hit-list .hit-desk').click()`);
	const desk = await until('the note, open', async () => {
		const d = await evaluate<{ tenant: string | null; box: string | null }>(DESKVIEW);
		return d.box && d.box.includes(MARKER) ? d : null;
	});
	ok('a desk hit opens the note in the editor — the words, not a copy of them (DoD 2)',
		desk.tenant === 'desk' && desk.box === NOTE.replace(/\n+$/, '')
		&& readFileSync(join(DESK, `${noteSlug}.md`), 'utf8').includes(MARKER),
		`Focus is the ${desk.tenant} pane holding desk/${noteSlug}.md — ${Buffer.byteLength(desk.box ?? '')} B, `
		+ `byte-identical to the file the desk wrote`);

	// --- 6. the cap, induced live (DoD 3) ---

	await evaluate(`document.getElementById('drawer-toggle').click()`);
	await evaluate(SEARCH('the'));
	const capped = await until('the capped answer', async () => {
		const r = await evaluate<Results>(RESULTS);
		return r.head.startsWith('100 hits') || r.groups.some(g => g.bounds.includes('capped')) ? r : null;
	});
	ok('an over-cap query SAYS it was capped — no silent truncation (DoD 3, the B-row law)',
		capped.groups.filter(g => g.bounds.includes('capped')).length >= 2,
		capped.groups.map(g => `${g.kind}: ${g.bounds}`).join('\n      '));

	// --- 7. warm p95 over the real corpus (DoD 4) ---

	const TERMS = ['bob summons', 'the deck keel', 'segmented paste', 'felikai', 'baton rail'];
	const warm: number[] = [];
	for (let i = 0; i < 20; i++) {
		const t = await timed(`/deck/grep?q=${encodeURIComponent(TERMS[i % TERMS.length]!)}`);
		warm.push(t.ms);
		await Bun.sleep(200);                    // spaced, per B3 E1: a tight burst hides a stall
	}
	ok('warm query p95 under a second over the real corpus (DoD 4)',
		pct(warm, 0.95) < 1000,
		`N=20, 200 ms apart, five terms rotating over 736 transcripts + 308 doctrine documents + the desk: `
		+ `min ${ms(Math.min(...warm))} · p50 ${ms(pct(warm, 0.5))} · p95 ${ms(pct(warm, 0.95))} · max ${ms(Math.max(...warm))}`);

	// --- 8. the fallback, the clock, and the thread (DoD 3, 4) ---
	//
	// One arm proves three: with `rg` unreachable the search falls back to `grep`, which over 1.7 GB of
	// transcripts is ~8 s — so it also outlives the 3 s budget, and the polls fired inside its window
	// are the worker-law measurement (B8 F3: a spawn yields Bun's thread, a synchronous walk does not).

	glass.kill();
	await Bun.sleep(400);
	glass = Bun.spawn(['bun', SERVER], { env: ENV({ GREP_RG: 'rg-that-is-not-installed' }), stdout: 'pipe', stderr: 'pipe' });
	await until('the glass again', async () => yes((await fetch(DECK)).ok));

	const slow = timed('/deck/grep?q=bob%20summons');
	await Bun.sleep(250);
	const inside: number[] = [];
	for (let i = 0; i < 3; i++) { inside.push((await timed('/deck/state')).ms); await Bun.sleep(400); }
	const fell = await slow;
	const answer = fell.body as { engine: string; degraded: string | null; groups: { kind: string; timedOut: boolean; hits: unknown[]; error: string | null }[] };
	ok('with no rg on PATH the search falls back to grep, and the clock cuts it — both said out loud (DoD 3)',
		answer.engine === 'grep' && answer.degraded !== null
		&& answer.groups[0]!.timedOut && answer.groups[0]!.error === null,
		`the whole query took ${ms(fell.ms)} against a 3000 ms budget · engine "${answer.engine}" · `
		+ `sessions timedOut=${answer.groups[0]!.timedOut} with ${answer.groups[0]!.hits.length} honest hits and no error · `
		+ `docs ${answer.groups[1]!.hits.length} · desk ${answer.groups[2]!.hits.length} — the small corpora finished inside it`);
	ok('and the search never rides the request thread into a stall (DoD 4, B8 F3’s worker law)',
		Math.max(...inside) < 500,
		`three /deck/state polls fired INSIDE that ${ms(fell.ms)} search came back in `
		+ `${inside.map(x => ms(x)).join(' · ')} — the engine is a spawn, so Bun's one thread is yielded`);

	await evaluate(`location.reload()`);
	await Bun.sleep(900);
	await connect();
	await until('the deck again', async () => yes(await evaluate<boolean>(`!!document.getElementById('grep-q')`)));
	await evaluate(SEARCH('bob summons'));
	const degraded = await until('the degraded answer on the page', async () => {
		const r = await evaluate<Results>(RESULTS);
		return r.degraded ? r : null;
	}, 30_000);
	ok('the degradation is on the PAGE, not just in the payload — he is told, not left to wonder',
		(degraded.degraded ?? '').includes('ripgrep is not on this glass')
		&& degraded.groups.some(g => g.bounds.includes('clock ran out')),
		`"${(degraded.degraded ?? '').slice(0, 120)}…" · ${degraded.groups.map(g => `${g.kind}: ${g.bounds}`).join(' | ')}`);

	// --- 9. the structural checks: no fire, a legend, and the page still does not scroll ---

	const js = await (await fetch(`${ORIGIN}/deck.js`)).text();
	const src = await Bun.file(join(HERE, 'glass/grep.client.ts')).text();
	const fires = (s: string) => s.split('hands/fire').length - 1;
	ok('the Grep cannot fire a session: 0 in its source, and the bundle still carries exactly the one',
		fires(src) === 0 && fires(js) === 1,
		`grep.client.ts ${fires(src)}× · /deck.js ${fires(js)}× (composer.client.ts, the one file allowed to — B17 F1)`);

	const space = await evaluate<{ body: number; viewport: number; drawer: [number, number] }>(`(() => {
		const d = document.getElementById('host-drawer');
		return { body: document.body.scrollHeight, viewport: window.innerHeight, drawer: [d.scrollHeight, d.clientHeight] };
	})()`);
	ok('the law of space holds with a full results drawer — the page never scrolls (B13 F4 kept)',
		space.body - space.viewport === 0 && degraded.legend >= 4,
		`body ${space.body} px − viewport ${space.viewport} px = ${space.body - space.viewport} px · the drawer owns `
		+ `its own overflow (${space.drawer[0]}/${space.drawer[1]} px) · ${degraded.legend} legend keys on the coloured view`);
}
catch (e) { console.error('\nPROBE THREW:', e); failures++; }
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
