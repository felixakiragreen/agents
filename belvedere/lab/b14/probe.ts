// B14's DoD, driven in a real browser — B13's harness, reused as it was written to be.
//
// What is here is everything that is a *browser* fact: the order buildings render in, a dot that
// gains a waiting ring within one poll, a countersign answered by a real click, the absence of fire
// wiring in the live DOM, a legend, and a header count readable with the drawer shut. Everything
// that is a pure function is in `glass/attention.test.ts` instead (B13 F1's split, kept).
//
//    bun belvedere/lab/b14/probe.ts
//
// It stands up its OWN glass on a probe port against a temp census and a **copy** of
// `lab/b14/city`: this run clicks a countersign, which is a real file append, and a probe that
// writes into the repo's own fixtures proves nothing the second time it runs. Nothing outside the
// temp directory is written. The live-city half of the DoD — a real fired session stalling on a
// real permission prompt, and `/deck/state`'s p95 over the whole register — is `live.ts`.

import { mkdtempSync, rmSync, writeFileSync, appendFileSync, readFileSync, utimesSync } from 'fs';
import { createHash } from 'crypto';
import { tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4492;
const CDP_PORT = 9336;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const POLL_MS = 3000;                                          // must match `deck.client.ts`

const ROOT = mkdtempSync(join(tmpdir(), 'b14-probe-'));
const CENSUS = join(ROOT, 'census.jsonl');
const PROFILE = join(ROOT, 'chrome');
const CITY = join(ROOT, 'city');
const LOUD = join(CITY, 'nb/loud');
const QUIET = join(CITY, 'nb/quiet');
const INBOX = join(LOUD, 'ISSUES.md');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

// ---------- the fixture: a copy, with the mtimes the ranking test needs ----------

Bun.spawnSync(['cp', '-R', join(HERE, 'lab/b14/city'), CITY]);
const now = Date.now() / 1000;
utimesSync(join(QUIET, 'README.md'), now, now);                          // the control: quiet is NEWER
for (const f of ['README.md', 'DECISIONS.md', 'ISSUES.md']) utimesSync(join(LOUD, f), now - 86400, now - 86400);

/** Our own pid, so the census's `kill -0` says alive without inventing a process. */
const beat = (sid: string, ev: string, cwd: string, why: string | null = null) =>
	JSON.stringify({ t: Date.now() / 1000, ev, sid, why, acct: '/Users/felix/.claude', pid: String(process.pid), cwd, ws: 'W-probe', sf: 'S-probe' }) + '\n';

// One dead session, so the census is PRESENT and nothing is live: the ranking assertion below is
// then a clean test of attention against recency, with no live work confounding either building.
writeFileSync(CENSUS, beat('an-old-one', 'SessionEnd', QUIET, 'other'));

// ---------- processes ----------
//
// A leftover glass on this port is a silent disaster, not an inconvenience: Chrome would connect to
// the previous run's server, read the previous run's fixture, and every assertion below would be
// measuring a city this run never built. Measured — the first run of this probe did exactly that.

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
	env: { ...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: ROOT, GLASS_CITY: CITY },
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

// ---------- the DevTools wire ----------

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

const SET = (pane: string, state: string) =>
	`document.querySelector('[data-set-state="${state}"][data-pane="${pane}"]').click()`;
const settle = () => Bun.sleep(200);
const sha = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);

// ---------- the run ----------
/**
 * Every check runs inside one try/finally: a run that dies halfway must still take its glass, its
 * Chrome and its temp city with it, or the NEXT run silently measures this one (see the port
 * preflight above).
 */
try {

	await connect();
	await until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));
	await evaluate(SET('context', 'expanded'));
	await settle();

	console.log(`\n# B14 — the City and the needs-you queue, measured in Chrome (window 1600×900)\n`);
	console.log(`glass: ${DECK}   census: ${CENSUS}   city: ${CITY}\n`);

	// --- 1. every register building, grouped, attention above recency ---

	type CityDom = { groups: string[]; rows: { name: string; badges: string[]; dots: string[] }[] };
	const CITY_DOM = `(() => ({
		groups: [...document.querySelectorAll('#host-context .nb-name')].map(e => e.textContent),
		rows: [...document.querySelectorAll('#host-context .row[data-building]')].map(r => ({
			name: r.dataset.building.split('/').pop(),
			badges: [...r.querySelectorAll('.badge')].map(b => b.className.replace('badge b-','') + ':' + b.textContent),
			dots: [...r.querySelectorAll('.dot')].map(d => d.className.replace('dot ','')),
		})),
	}))()`;

	const city = await evaluate<CityDom>(CITY_DOM);
	const mtimes = `quiet README ${new Date(now * 1000).toISOString()} · loud README ${new Date((now - 86400) * 1000).toISOString()}`;
	ok('the City renders every register building, grouped — and the gate badge sorts above the NEWER quiet building',
		city.groups.length === 1 && city.rows.length === 2
		&& city.rows[0]!.name === 'loud' && city.rows[1]!.name === 'quiet'
		&& city.rows[0]!.badges.join(' ') === 'gate:1 countersign:1 escalation:1'
		&& city.rows[1]!.badges.length === 0,
		`one neighborhood "${city.groups[0]}" · order [${city.rows.map(r => r.name).join(', ')}]\n`
		+ `      ${city.rows.map(r => `${r.name} badges ${JSON.stringify(r.badges)}`).join(' · ')}\n`
		+ `      recency control — ${mtimes} (quiet is 24 h newer and still lost)`);

	// --- 2. the waiting-input blindness, dying: a dot and a queue item within one poll ---

	const before = await evaluate<{ dots: number; queue: number; needs: string }>(`(() => ({
		dots: document.querySelectorAll('#host-context .row[data-building] .dot.w-blocked').length,
		queue: document.querySelectorAll('#host-drawer .qi[data-kind="waiting"]').length,
		needs: document.getElementById('needs').dataset.needs,
	}))()`);

	const line = beat('probe-blocked', 'Notification', QUIET, 'permission_prompt');
	appendFileSync(CENSUS, line);
	const changedAt = Date.now();
	await until('the waiting dot and the queue item',
		async () => await evaluate<boolean>(
			// Scoped to the building rows: the same dot vocabulary also renders in the neighborhood
			// header, in the expanded session lines, and in the legend — all of them correctly.
			`document.querySelectorAll('#host-context .row[data-building] .dot.w-blocked').length === 1
			 && document.querySelectorAll('#host-drawer .qi[data-kind="waiting"]').length === 1`),
		POLL_MS * 3);
	const sawIn = Date.now() - changedAt;

	const after = await evaluate<{ order: string[]; badge: string | null; item: string; needs: string; title: string }>(`(() => {
		const rows = [...document.querySelectorAll('#host-context .row[data-building]')];
		const q = document.querySelector('#host-drawer .qi[data-kind="waiting"]');
		return {
			order: rows.map(r => r.dataset.building.split('/').pop()),
			badge: rows[0].querySelector('.badge.b-waiting')?.textContent ?? null,
			item: q.querySelector('.qname').textContent,
			needs: document.getElementById('needs').dataset.needs,
			title: document.querySelector('#host-context .row[data-building] .dot.w-blocked').title,
		};
	})()`);

	ok('a permission prompt reaches the City AND the queue inside one poll — the blindness, dying twice',
		sawIn <= POLL_MS + 500 && after.order[0] === 'quiet' && after.badge === '1'
		&& after.needs === String(Number(before.needs) + 1),
		`census line appended at ${new Date(changedAt).toISOString()} — seen in ${sawIn} ms (poll ${POLL_MS} ms)\n`
		+ `      ${line.trim()}\n`
		+ `      dots .w-blocked ${before.dots} → 1 · waiting items ${before.queue} → 1 · header needs ${before.needs} → ${after.needs}\n`
		+ `      the City re-ranked: [loud, quiet] → [${after.order.join(', ')}] · quiet's waiting badge "${after.badge}"\n`
		+ `      dot title "${after.title}" · queue item "${after.item}"`);

	// --- 3. the queue, ranked, and every class present ---

	const kinds = await evaluate<string[]>(`[...document.querySelectorAll('#host-drawer .qi')].map(e => e.dataset.kind)`);
	ok('the queue is one ranked list across the city — waiting, gates, countersigns, escalations',
		kinds.join(',') === 'waiting,gate,countersign,escalation',
		`${kinds.length} items in DOM order: ${kinds.join(' → ')}`);

	// --- 4. a countersign, answered in place ---

	const inboxBefore = readFileSync(INBOX, 'utf8');
	await evaluate(`document.querySelector('#host-drawer .qi[data-kind="countersign"] button[data-gesture]').click()`);
	await until('the gesture to report', async () => await evaluate<boolean>(
		`/^filed/.test(document.querySelector('#host-drawer .qi[data-kind="countersign"] [data-out-for]').textContent)`), 10_000);
	const said = await evaluate<string>(`document.querySelector('#host-drawer .qi[data-kind="countersign"] [data-out-for]').textContent`);
	const inboxAfter = readFileSync(INBOX, 'utf8');

	ok('a pending countersign is answered in place — one append, byte-identical prefix',
		inboxAfter.startsWith(inboxBefore)
		&& inboxAfter.slice(inboxBefore.length).trim().startsWith('- ')
		&& inboxAfter.slice(inboxBefore.length).includes('countersign D99: ✓'),
		`BEFORE ${inboxBefore.length} B sha256 ${sha(inboxBefore)} · AFTER ${inboxAfter.length} B sha256 ${sha(inboxAfter)}\n`
		+ `      AFTER's first ${inboxBefore.length} bytes are byte-identical to BEFORE: ${inboxAfter.slice(0, inboxBefore.length) === inboxBefore}\n`
		+ `      appended: ${JSON.stringify(inboxAfter.slice(inboxBefore.length))}\n`
		+ `      the card said: "${said}"`);

	await until('the card to re-derive its state off the file', async () => await evaluate<boolean>(
		`!document.querySelector('#host-drawer .qi[data-kind="countersign"] button[data-gesture]')`), POLL_MS * 3);
	const recorded = await evaluate<string>(`document.querySelector('#host-drawer .qi[data-kind="countersign"] .more').textContent`);
	ok('and the card re-reads itself off the bytes: pending → recorded, the button gone',
		/recorded|next sweep/i.test(recorded),
		`the countersign button is no longer in the DOM; the card now reads: "${recorded.replace(/\s+/g, ' ').slice(0, 150)}…"`);

	// --- 5. zero fire wiring, structurally ---

	const domWiring = await evaluate<{ attrs: number; text: number; buttons: string[] }>(`(() => ({
		attrs: document.querySelectorAll('[data-fire],[data-apply],[data-worktree],[data-summons]').length,
		text: (document.documentElement.outerHTML.match(/hands\\/fire/g) || []).length,
		buttons: [...document.querySelectorAll('#host-context button, #host-drawer button')].map(b => b.textContent.trim()),
	}))()`);
	const bundle = await (await fetch(`${ORIGIN}/deck.js`)).text();
	const inBundle = (bundle.match(/hands\/fire/g) || []).length;
	ok('ZERO fire wiring anywhere in the City or the queue — in the DOM and in the served bundle (D10)',
		domWiring.attrs === 0 && domWiring.text === 0 && inBundle === 0,
		`DOM: 0 of [data-fire, data-apply, data-worktree, data-summons]; "hands/fire" appears ${domWiring.text}× in the whole document\n`
		+ `      /deck.js is ${bundle.length} B and contains "hands/fire" ${inBundle}× (it carries /inbox and /hands/focus, and nothing else)\n`
		+ `      every button in the two panes: ${JSON.stringify(domWiring.buttons)}`);

	// --- 6. the legend, and the count readable with the drawer shut ---

	const closed = await evaluate<{ keys: string[]; drawerDisplay: string; needsWidth: number; needs: string }>(`(() => {
		document.getElementById('drawer-shut').click();
		const n = document.getElementById('needs');
		return {
			keys: [...document.querySelectorAll('#host-context .legend-deck .lkey')].map(k => k.textContent),
			drawerDisplay: getComputedStyle(document.getElementById('drawer')).display,
			needsWidth: n.getBoundingClientRect().width,
			needs: n.dataset.needs,
		};
	})()`);
	ok('the legend carries the whole dot and badge vocabulary, and the count is readable with the drawer shut',
		closed.keys.length === 9 && closed.drawerDisplay === 'none' && closed.needsWidth > 0 && closed.needs === '4',
		`drawer display:${closed.drawerDisplay} · header count "${closed.needs}" ${closed.needsWidth.toFixed(2)} px wide\n`
		+ `      ${closed.keys.length} legend keys: ${closed.keys.join(' | ')}`);

	// --- 7. a half-typed note is not eaten by the poll ---
	//
	// Not a DoD line, but the failure it guards is exactly the one the deck was commissioned over: a
	// pane that rebuilds every three seconds takes back whatever Felix was in the middle of writing.

	await evaluate(`document.getElementById('drawer-toggle').click()`);
	await evaluate(`(() => {
		const d = document.querySelector('#host-drawer .qi[data-kind="gate"] .more');
		d.open = true; d.dispatchEvent(new Event('toggle'));
		const n = d.querySelector('.qnote'); n.open = true; n.dispatchEvent(new Event('toggle'));
		const t = n.querySelector('textarea');
		t.focus(); t.value = 'half a thought about the gate'; t.dispatchEvent(new Event('input', { bubbles: true }));
	})()`);
	// The change is deliberately one that REBUILDS the drawer: the blocked session answers its prompt
	// and gets to work, so the waiting item leaves the queue and every remaining row is redrawn.
	appendFileSync(CENSUS, beat('probe-blocked', 'PostToolUse', QUIET));
	await until('the waiting item to leave the queue', async () => await evaluate<boolean>(
		`document.querySelectorAll('#host-drawer .qi[data-kind="waiting"]').length === 0`), POLL_MS * 3);
	await Bun.sleep(300);
	const kept = await evaluate<{ value: string; focused: boolean; open: boolean }>(`(() => {
		const t = document.querySelector('#host-drawer .qi[data-kind="gate"] textarea');
		return { value: t ? t.value : '', focused: document.activeElement === t, open: !!t };
	})()`);
	ok('a half-typed note survives the polls that redraw around it',
		kept.value === 'half a thought about the gate' && kept.open && kept.focused,
		`after a census change and ${POLL_MS + 600} ms of polling: textarea still open, still focused (${kept.focused}), value "${kept.value}"`);

}
catch (e) {
	failures++;
	console.log(`FAIL  the probe itself threw\n      ${e instanceof Error ? e.message : String(e)}`);
	// A timeout is useless without the page's own account of itself: what the poll last said, and
	// what the two panes actually hold.
	const seen = await evaluate<string>(`JSON.stringify({
		pulse: document.getElementById('pulse').textContent,
		fault: document.getElementById('pulse').dataset.fault,
		polls: document.getElementById('pulse').dataset.polls,
		needs: document.getElementById('needs').dataset.needs,
		dots: [...document.querySelectorAll('#host-context .dot')].map(d => d.className),
		kinds: [...document.querySelectorAll('#host-drawer .qi')].map(e => e.dataset.kind),
	})`).catch(err => `could not ask the page: ${String(err)}`);
	console.log(`      page says: ${seen}`);
}
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);