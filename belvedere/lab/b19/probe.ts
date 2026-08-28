// B19's browser half, driven in a real Chrome.
//
//    bun belvedere/lab/b19/probe.ts
//
// What lives here is everything that is a *browser* fact — words typed into the rendered box
// reaching a file, surviving a killed server, and each of the three routes fired from the render
// that previewed it. A fake DOM cannot prove any of it (B13 F1), so this drives the machine's own
// installed Chrome over the DevTools protocol: nothing fetched, nothing vendored, every URL
// 127.0.0.1.
//
// It runs against a **copy** of the `lab/b3/city` fixture and a temp desk. The copy is not
// fastidiousness: the ISSUES route MINTS an inbox in the building it files into, and a DoD run does
// not get to write one into a tracked fixture — the same law that keeps a suite out of the live
// census and the real HALT flag (B8 F1). `probe-fork` carries a ledger and no `ISSUES.md`, so it is
// the scratch-adopted building the DoD asks for: on the register, and adopting its inbox here.

import { cpSync, mkdtempSync, readFileSync, rmSync, existsSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { parseIssues } from '../../../doctrine';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4498;
const CDP_PORT = 9342;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;

const ROOT = mkdtempSync(join(tmpdir(), 'b19-probe-'));
const CITY = join(ROOT, 'city');
const DESK = join(ROOT, 'desk');
const CENSUS = join(ROOT, 'census.jsonl');
const PROFILE = join(ROOT, 'chrome');
const SCRATCH = join(CITY, 'probe-fork');                     // a ledger, no inbox — it adopts one here

cpSync(join(HERE, 'lab/b3/city'), CITY, { recursive: true });

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

// ---------- the fixture: one live session, so the → session route has a target ----------

const S = 'dddddddd-4444-4444-8444-dddddddddddd';
const named = (stamp: string, sid: string) => JSON.stringify({ type: 'agent-name', agentName: stamp, sessionId: sid });
const user = (text: string, ts: string) =>
	JSON.stringify({ type: 'user', isSidechain: false, timestamp: ts, message: { role: 'user', content: text } });
const says = (text: string, ts: string) =>
	JSON.stringify({ type: 'assistant', isSidechain: false, timestamp: ts, message: { model: 'claude-sonnet-4-5', content: [{ type: 'text', text }] } });

const TP = join(ROOT, `${S}.jsonl`);
writeFileSync(TP, [named('builder-b19-probe', S), user('go', new Date().toISOString()), says('done', new Date().toISOString())].join('\n') + '\n');

writeFileSync(CENSUS, JSON.stringify({
	t: Date.now() / 1000 - 4, ev: 'Stop', sid: S, acct: '/Users/felix/.claude', pid: String(process.pid),
	cwd: SCRATCH, tp: TP, ws: 'ws-d', sf: 'surface:9', tool: '', why: '',
}) + '\n');

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

/** `FLOWS_DIR` is an empty temp directory on purpose: a real glass runs a real engine, and pointing
 *  it at the city's own flows would let a DoD run arm and fire declared work (B11 F1). */
const ENV = (over: Record<string, string> = {}) => ({
	...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: ROOT, GLASS_CITY: CITY,
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
const settle = () => Bun.sleep(260);

const TO_DESK = `document.querySelector('[data-focus-on="desk"]').click()`;

const TYPE = (t: string) => `(() => {
	const a = document.querySelector('[data-desk-write]');
	if (!a) return 'NO BOX';
	a.value = ${JSON.stringify(t)};
	a.dispatchEvent(new Event('input', { bubbles: true }));
	return a.value.length;
})()`;

const VIEW = `(() => {
	const a = document.querySelector('[data-desk-write]');
	const pre = document.querySelector('.desk-plan .summons-out');
	return {
		box: a ? a.value : null,
		notes: [...document.querySelectorAll('#host-focus [data-desk-open]')].map(e => e.dataset.deskOpen),
		titles: [...document.querySelectorAll('#host-focus [data-desk-open] .name')].map(e => e.textContent),
		slug: (document.querySelector('#host-action .c-head .pill') || {}).textContent ?? null,
		preview: pre ? pre.textContent : null,
		go: [...document.querySelectorAll('[data-desk-go]')].map(e => e.dataset.deskGo),
		where: (document.querySelector('.desk-plan .who') || {}).textContent ?? null,
		reason: (document.querySelector('.desk-plan .reason') || {}).textContent ?? null,
		out: (document.querySelector('[data-out-for="desk"]') || {}).textContent ?? null,
		routes: [...document.querySelectorAll('.desk-foot .prose')].map(e => e.textContent),
	};
})()`;

type View = {
	box: string | null; notes: string[]; titles: string[]; slug: string | null;
	preview: string | null; go: string[]; where: string | null; reason: string | null;
	out: string | null; routes: string[];
};

const NOTE = `# the copy-paste kill shot

Seventeen items, pasted from a note app, which is the thing this chapter kills.

---

A rule of his own, inside the body — it must not cut the block in half.`;

// ---------- the run ----------

try {
	await connect();
	await until('the first poll', async () => yes(await evaluate<boolean>(`!!document.querySelector('#pane-context')`)));

	console.log(`\n# B19 — the desk, measured in Chrome (window 1600×900)\n`);
	console.log(`glass: ${DECK}   desk: ${DESK}   city: ${CITY}   scratch building: ${SCRATCH}\n`);

	await evaluate(SET('context', 'expanded'));
	await evaluate(SET('focus', 'expanded'));
	await evaluate(SET('action', 'expanded'));
	await settle();

	// --- 1. one gesture from anywhere, and the blank page ---

	const tenants = await evaluate<string[]>(`[...document.querySelectorAll('[data-focus-on]')].map(e => e.dataset.focusOn)`);
	await evaluate(TO_DESK);
	await until('the desk', async () => yes(await evaluate<boolean>(`!!document.querySelector('[data-desk-write]')`)));
	ok('the desk is one gesture from anywhere — a signed tenant, in the bar beside the other three',
		tenants.includes('desk') && await evaluate<boolean>(`!!document.querySelector('[data-desk-write]')`),
		`tenant bar: ${tenants.join(' · ')} — one click swaps the writing surface into Action from any of them`);

	// --- 2. write → autosave → the file (spec §2, DoD 1a) ---

	await evaluate(`document.querySelector('[data-desk-new]').click()`);
	await settle();
	await evaluate(TYPE(NOTE));
	const slug = await until('the save to mint a slug', async () => {
		const v = await evaluate<View>(VIEW);
		return v.slug && v.slug !== 'unsaved' ? v.slug : null;
	});
	const onDisk = readFileSync(join(DESK, `${slug}.md`), 'utf8');
	const listed = await evaluate<View>(VIEW);
	ok('typed in the rendered box → autosaved → on disk under desk/, first line the title',
		onDisk === NOTE + '\n' && listed.notes.includes(slug) && listed.titles[0] === 'the copy-paste kill shot',
		`desk/${slug}.md is ${Buffer.byteLength(onDisk)} B and byte-identical to the box; the drawer lists it as `
		+ `${JSON.stringify(listed.titles[0])} — the '#' is a heading, not part of the name`);

	// --- 3. kill the glass mid-edit, relaunch, reload (B8's drill, DoD 1b) ---

	await evaluate(TYPE(`${NOTE}\n\nAn eighteenth item, typed a moment before the crash.`));
	await Bun.sleep(900);                                  // past the save debounce
	glass.kill();
	await Bun.sleep(300);
	glass = Bun.spawn(['bun', SERVER], { env: ENV(), stdout: 'pipe', stderr: 'pipe' });
	await until('the glass again', async () => yes((await fetch(DECK)).ok));
	await evaluate(`location.reload()`);
	await Bun.sleep(700);
	await connect();
	await evaluate(SET('focus', 'expanded'));
	await evaluate(SET('action', 'expanded'));
	const back = await until('the note after a relaunch', async () => {
		const v = await evaluate<View>(VIEW);
		return v.box && v.box.includes('eighteenth') ? v : null;
	});
	ok('the glass was killed mid-edit and relaunched — nothing was lost (the drill, B8)',
		back.box === `${NOTE}\n\nAn eighteenth item, typed a moment before the crash.` && back.slug === slug,
		`a fresh process, a reloaded page, and the box holds all ${Buffer.byteLength(back.box ?? '')} B — `
		+ `the same note (${back.slug}) is remembered open, off desk/${slug}.md`);

	// --- 4. → ISSUES: previewed, then filed, and the bytes are the same bytes (DoD 2) ---

	await evaluate(`document.querySelector('#host-context [data-building$="probe-fork"]').click()`);
	await settle();
	await evaluate(TO_DESK);
	await until('the desk again', async () => yes(await evaluate<boolean>(`!!document.querySelector('[data-desk-route]')`)));
	const building = await evaluate<string | null>(`(() => { const r = document.querySelector('#host-context [data-building$="probe-fork"]'); return r ? r.dataset.building : null; })()`);
	await evaluate(`document.querySelector('[data-desk-route="issues"]').click()`);
	// A plan of any kind, then assert which — a wait on the preview alone reports a refusal as a hang.
	const planned = await until('the inbox plan', async () => {
		const v = await evaluate<View>(VIEW);
		return v.preview !== null || v.reason !== null ? v : null;
	});
	if (planned.reason) console.log(`      (the inbox plan refused: ${planned.reason} · the City row is ${building ?? 'MISSING'})`);
	const inboxAt = join(SCRATCH, 'ISSUES.md');
	ok('→ inbox is PREVIEWED before it fires: the exact bytes, and the mint named (the countersign law)',
		planned.preview !== null && planned.go.includes('issues') && !existsSync(inboxAt)
		&& (planned.where ?? '').includes('adoption-on-first-need'),
		`the render shows ${Buffer.byteLength(planned.preview ?? '')} B of append and one button; ${inboxAt} does not exist yet — `
		+ `a preview is a read`);

	const previewed = planned.preview!;
	await evaluate(`document.querySelector('[data-desk-go]').click()`);
	await until('the filing', async () => yes(existsSync(inboxAt)));
	await settle();
	const inbox = readFileSync(inboxAt, 'utf8');
	const lint = parseIssues(inbox);
	const noteAfter = readFileSync(join(DESK, `${slug}.md`), 'utf8');
	// The tail is taken by CHARACTERS, not bytes: the entry line carries `·` and `—`, so a byte
	// length used as a string index cuts the comparison in the middle of a code point.
	const tail = inbox.slice(-previewed.length);
	const sha = (s: string) => new Bun.CryptoHasher('sha256').update(s).digest('hex').slice(0, 16);
	ok('the PREVIEWED bytes are the APPENDED bytes — one sha, both sides',
		tail === previewed && sha(tail) === sha(previewed),
		`sha256 ${sha(previewed)}… · ${Buffer.byteLength(previewed)} B · the tail of ${inboxAt} is the render, byte for byte`);
	ok('it lands as a legal D63h block in a scratch-ADOPTED inbox — 0 lint from the one parser',
		lint.fails.length === 0 && lint.issues.length === 1 && lint.issues[0]!.who === 'Felix (via Belvedere)'
		&& inbox.includes('  ---'),
		`parseIssues: ${lint.issues.length} entry, ${lint.fails.length} failures · `
		+ `${JSON.stringify(lint.issues[0]!.text)} · the body's own '---' is indented, so it cannot cut the block`);
	ok('and the note carries its routed-stamp: where it went, when (spec §3)',
		/\n---\nrouted \d{4}-\d{2}-\d{2} \d{2}:\d{2} → .*ISSUES\.md\n$/.test(noteAfter)
		&& !(await evaluate<View>(VIEW)).box!.includes('routed '),
		`${noteAfter.trim().split('\n').at(-1)} — in the file, in a trailer the editor takes back off`);

	// --- 5. → composer: the note becomes the summons, live (DoD 4) ---

	await evaluate(`document.querySelector('[data-desk-route="composer"]').click()`);
	await until('the composer plan', async () => yes(!!(await evaluate<View>(VIEW)).preview));
	await evaluate(`document.querySelector('[data-desk-go]').click()`);
	await until('the composer', async () => yes(await evaluate<boolean>(`!!document.querySelector('.summons-in')`)));
	// `tone: 'wait'` is the composer mid-round-trip, so the wait is on the ANSWER, not on the box:
	// "previewed live" means the plan re-resolved against the note, not that the words appeared.
	const composed = await until('the resolved summons', async () => {
		const v = await evaluate<{ box: string; tone: string | null; bytes: string | null }>(`(() => {
			const t = document.querySelector('.summons-in');
			const card = document.querySelector('.plan-card');
			const kv = [...document.querySelectorAll('.plan-card .kv')].map(e => e.textContent).find(s => /\\bB\\b/.test(s));
			return { box: t ? t.value : '', tone: card ? card.dataset.tone : null, bytes: kv ?? null };
		})()`);
		return v.box.includes('copy-paste kill shot') && v.tone !== null && v.tone !== 'wait' ? v : null;
	});
	ok('→ composer: the note body IS the composed summons, previewed live (B17’s round trip)',
		composed.box.startsWith('# the copy-paste kill shot') && !composed.box.includes('routed '),
		`the composer’s box holds ${Buffer.byteLength(composed.box)} B of the note (receipts excluded) and `
		+ `/deck/compose answered against it — card tone "${composed.tone}"${composed.bytes ? `, ${composed.bytes.trim()}` : ''} `
		+ `(a fixture with no mantle chosen has no tier, so the plan is honestly unarmed)`);

	// --- 6. → session: it lands in the Chat's draft box, and the Chat comes forward (DoD 3) ---

	await evaluate(`document.querySelector('#host-context [data-chat-sid="${S}"]').click()`);
	await settle();
	await evaluate(TO_DESK);
	await until('the desk', async () => yes(await evaluate<boolean>(`!!document.querySelector('[data-desk-route]')`)));
	const picked = await evaluate<string | null>(`(() => { const b = document.querySelector('[data-chat-sid="${S}"]'); return b ? b.dataset.chatSid : null; })()`);
	await evaluate(`document.querySelector('[data-desk-route="session"]').click()`);
	// A plan of any kind, then assert which: a wait on the preview alone times out on a refusal and
	// reports "the route is slow" for what is actually "the route said no".
	const offer = await until('the session plan', async () => {
		const v = await evaluate<View>(VIEW);
		return v.preview !== null || v.reason !== null ? v : null;
	});
	ok('→ session resolves a target from the deck’s own selection — no picker of its own (the ontology)',
		offer.reason === null && offer.go.includes('session'),
		`${offer.where} · the session row clicked in the City is ${picked ?? 'MISSING'}${offer.reason ? ` · refused: ${offer.reason}` : ''}`);
	await evaluate(`document.querySelector('[data-desk-go]').click()`);
	const draftAt = join(DESK, 'drafts', `${S}.md`);
	await until('the draft file', async () => yes(existsSync(draftAt)));
	// Waited on BOTH halves: the poll has to answer with `?s=` before the Chat can name its target,
	// and a wait on the draft alone returns one poll early — the box fills from the file, the head
	// from the view (B16 F1's two seam members arriving together, not at the same instant).
	const CHAT = `(() => ({
		draft: (document.querySelector('[data-chat-draft]') || {}).value ?? null,
		name: (document.querySelector('#host-focus .ct-head .big') || {}).textContent ?? null,
		minimal: (document.querySelector('#host-focus > .big') || {}).textContent ?? null,
		tenant: (document.querySelector('[data-focus-on][data-on="yes"]') || {}).dataset?.focusOn ?? null,
		state: document.getElementById('pane-focus').dataset.state }))()`;
	type Chat = { draft: string | null; name: string | null; minimal: string | null; tenant: string | null; state: string };
	const inChat = await until('the Chat holding it', async () => {
		const v = await evaluate<Chat>(CHAT);
		return v.draft && v.draft.includes('copy-paste kill shot') ? v : null;
	});
	ok('→ session: the note arrives in the Chat’s draft for the chosen target, and the Chat swaps in',
		readFileSync(draftAt, 'utf8').startsWith('# the copy-paste kill shot')
		&& inChat.tenant === 'chat' && (inChat.name ?? inChat.minimal) === 'builder-b19-probe',
		`desk/drafts/${S.slice(0, 8)}….md written through B16’s own wire (POST /chat/draft) and the box shows it; `
		+ `Focus is the ${inChat.tenant} pane (${inChat.state}) on ${inChat.name ?? inChat.minimal}`);

	// The same route, again, now that the box is not empty: his half-written reply is his.
	await evaluate(TO_DESK);
	await until('the desk', async () => yes(await evaluate<boolean>(`!!document.querySelector('[data-desk-route]')`)));
	await evaluate(`document.querySelector('[data-desk-route="session"]').click()`);
	const refused = await until('the refusal', async () => {
		const v = await evaluate<View>(VIEW);
		return v.reason ? v : null;
	});
	ok('and it will not overwrite a draft he is halfway through — refused, with NO button (D10 as structure)',
		refused.go.length === 0 && (refused.reason ?? '').includes('will not overwrite'),
		`${refused.reason}`);

	// --- 7. the confinement, over the wire (DoD 5) ---

	const crafted = await evaluate<{ status: number; error: string }>(
		`fetch('/desk/save', { method: 'POST', headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ slug: '../../canon/CLAUDE', text: 'pwned' }) })
		 .then(async r => ({ status: r.status, error: (await r.json()).error }))`);
	ok('a crafted save that walks out of desk/ is refused LOUDLY, and writes nothing',
		crafted.status === 409 && crafted.error.includes('lower-case letters')
		&& !existsSync(join(CITY, 'canon/CLAUDE.md')) && !existsSync(join(ROOT, 'canon')),
		`POST /desk/save ‹../../canon/CLAUDE› → ${crafted.status} ${crafted.error}`);

	// --- 8. the structural checks: no fire, and the page still does not scroll ---

	const js = await (await fetch(`${ORIGIN}/deck.js`)).text();
	const src = await Bun.file(join(HERE, 'glass/desk.client.ts')).text();
	const fires = (s: string) => s.split('hands/fire').length - 1;
	ok('the desk cannot fire a session: 0 in its source, and the bundle still carries the one',
		fires(src) === 0 && fires(js) === 1,
		`desk.client.ts ${fires(src)}× · /deck.js ${fires(js)}× (composer.client.ts, the one file allowed to — B17 F1)`);

	const dom = await evaluate<{ markup: number; text: number }>(
		`(() => { const b = document.body; return { markup: b.outerHTML.split('hands/fire').length - 1,
			text: b.textContent.split('hands/fire').length - 1 }; })()`);
	ok('and the DOM check subtracts the text (B17 F1): markup, not a rendered string',
		dom.markup - dom.text === 0,
		`hands/fire in outerHTML ${dom.markup}× · in textContent ${dom.text}× · markup ${dom.markup - dom.text}×`);

	await evaluate(TO_DESK);
	await settle();
	const space = await evaluate<{ body: number; viewport: number; box: [number, number] }>(`(() => {
		const a = document.querySelector('[data-desk-write]');
		return { body: document.body.scrollHeight, viewport: window.innerHeight, box: [a.scrollHeight, a.clientHeight] };
	})()`);
	ok('the law of space holds with the desk in Focus — the page never scrolls (B13 F4 kept)',
		space.body - space.viewport === 0,
		`body ${space.body} px − viewport ${space.viewport} px = ${space.body - space.viewport} px · `
		+ `the editor owns its own overflow (${space.box[0]}/${space.box[1]} px)`);
}
catch (e) { console.error('\nPROBE THREW:', e); failures++; }
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
