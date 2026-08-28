// B15's DoD, driven in a real browser — B13's harness, reused as it was written to be (F1).
//
// Everything here is a *browser* fact: a click in the City swapping what the Workshop shows, five
// sections rendering real parsed data, a collapse, a reorder that survives a reload, and the field
// report's own third item — `LEDGER.md:385` opening the viewer scrolled to line 385, marked and in
// view. Everything that is a pure function is in `glass/workshop.test.ts` instead.
//
//    bun belvedere/lab/b15/probe.ts
//
// It stands up its OWN glass on a probe port against a temp census and a **copy** of
// `lab/b15/city`, so nothing outside the temp directory is read as truth or written at all. The
// live-city half — `agents/belvedere` and a hexwright-class building, and the poll's real cost —
// is `live.ts`.

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4493;
const CDP_PORT = 9337;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const POLL_MS = 3000;                                          // must match `deck.client.ts`

const ROOT = mkdtempSync(join(tmpdir(), 'b15-probe-'));
const CENSUS = join(ROOT, 'census.jsonl');
const PROFILE = join(ROOT, 'chrome');
const CITY = join(ROOT, 'city');
const SHOP = join(CITY, 'nb/workshop');
const ANNEX = join(CITY, 'nb/annex');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

Bun.spawnSync(['cp', '-R', join(HERE, 'lab/b15/city'), CITY]);

/** Our own pid, so the census's `kill -0` says alive without inventing a process. */
const beat = (o: Record<string, unknown>) => JSON.stringify({
	t: Date.now() / 1000, acct: '/Users/felix/.claude', pid: String(process.pid), ...o,
}) + '\n';

// Two live sessions in the workshop building — one working in a pane, one blocked on a permission
// prompt so B14's waiting style has to appear in this pane too — and one in the annex.
writeFileSync(CENSUS, [
	beat({ ev: 'PreToolUse', sid: 'ws-working', cwd: SHOP, ws: 'W-shop', sf: 'S-shop', tool: 'Write' }),
	beat({ ev: 'Notification', why: 'permission_prompt', sid: 'ws-blocked', cwd: SHOP, ws: 'W-two', sf: 'S-two' }),
	beat({ ev: 'Stop', sid: 'annex-idle', cwd: ANNEX, ws: '', sf: '' }),
].join(''));

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

const settle = () => Bun.sleep(250);
const SET = (pane: string, state: string) =>
	`document.querySelector('[data-set-state="${state}"][data-pane="${pane}"]').click()`;
const ready = () => until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));

/** Click the City row whose building path ends in this name, and wait for the Workshop to show it. */
async function openBuilding(name: string): Promise<void> {
	await evaluate(`[...document.querySelectorAll('#host-context .row[data-building]')]
		.find(r => r.dataset.building.endsWith('/${name}')).click()`);
	await until(`the Workshop to open ${name}`, async () => await evaluate<boolean>(
		`(document.querySelector('#host-focus .ws-head .big')?.textContent ?? '').endsWith('/${name}')`), POLL_MS * 2);
	await settle();
}

// ---------- the run ----------

try {

	await until('the glass', async () => (await fetch(DECK)).ok);
	await attach();
	await ready();
	await evaluate(SET('context', 'expanded'));
	await evaluate(SET('focus', 'expanded'));
	await settle();

	console.log(`\n# B15 — the Workshop, measured in Chrome (window 1600×900)\n`);
	console.log(`glass: ${DECK}   census: ${CENSUS}   city: ${CITY}\n`);

	// --- 1. a City click focuses the Workshop ON that building, for two buildings ---

	const tenantBefore = await evaluate<string>(`document.querySelector('#pane-focus [data-focus-on][data-on="yes"]').dataset.focusOn`);
	await openBuilding('workshop');
	const first = await evaluate<{ tenant: string; head: string; title: string; sections: string[] }>(`(() => ({
		tenant: document.querySelector('#pane-focus [data-focus-on][data-on="yes"]').dataset.focusOn,
		head: document.querySelector('#host-focus .ws-head .big').textContent,
		title: document.querySelector('#pane-focus .pane-name').textContent,
		sections: [...document.querySelectorAll('#host-focus .sec')].map(s => s.dataset.sec),
	}))()`);
	await openBuilding('annex');
	const second = await evaluate<{ head: string; rows: string[]; issues: string }>(`(() => ({
		head: document.querySelector('#host-focus .ws-head .big').textContent,
		rows: [...document.querySelectorAll('#host-focus [data-sec="board"] .ws-row')].map(r => r.dataset.row),
		issues: document.querySelector('#host-focus [data-sec="issues"] .sec-body').textContent.trim().slice(0, 60),
	}))()`);
	ok('a City click focuses the Workshop on THAT building — two buildings, two different panes',
		first.tenant === 'workshop' && first.head.endsWith('/nb/workshop')
		&& second.head.endsWith('/nb/annex') && second.rows.join(',') === 'A1',
		`focus tenant "${tenantBefore}" → "${first.tenant}", pane head "${first.title}"\n`
		+ `      click 1 → ${first.head} · sections [${first.sections.join(', ')}]\n`
		+ `      click 2 → ${second.head} · board rows [${second.rows.join(', ')}] · issues section says "${second.issues}"`);

	await openBuilding('workshop');

	// --- 2. all five sections, real data, live sessions first ---

	type Sections = { order: string[]; sessions: { who: string; tier: string; state: string; dot: string; jump: boolean }[]; rows: { id: string; state: string; staff: string }[]; tail: string; decisions: string[]; issues: number; counts: string[] };
	const SECTIONS = `(() => ({
		order: [...document.querySelectorAll('#host-focus .sec')].map(s => s.dataset.sec),
		counts: [...document.querySelectorAll('#host-focus .sec .sec-h .num')].map(n => n.textContent),
		sessions: [...document.querySelectorAll('#host-focus [data-sec="sessions"] .ws-session')].map(li => ({
			who: li.querySelector('.who').textContent,
			tier: li.querySelector('.tier').textContent,
			state: li.querySelector('.st-word').textContent,
			dot: li.querySelector('.dot').className,
			jump: !li.querySelector('[data-jump-sid]').disabled,
		})),
		rows: [...document.querySelectorAll('#host-focus [data-sec="board"] .ws-row')].map(r => ({
			id: r.dataset.row, state: r.querySelector('.pill').textContent, staff: r.querySelector('.staff').textContent,
		})),
		tail: document.querySelector('#host-focus [data-sec="ledger"] .ws-tail-h').textContent,
		decisions: [...document.querySelectorAll('#host-focus [data-sec="decisions"] .ws-item')].map(i => i.dataset.decision + ':' + i.querySelector('.pill').textContent),
		issues: document.querySelectorAll('#host-focus [data-sec="issues"] .ws-item').length,
	}))()`;
	const s = await evaluate<Sections>(SECTIONS);
	ok('all five sections render real parsed data, LIVE SESSIONS first (his ruling)',
		s.order.join(',') === 'sessions,board,ledger,decisions,issues'
		&& s.sessions.length === 2 && s.rows.length === 5 && s.decisions.length === 1 && s.issues === 2
		&& s.rows.map(r => r.state).join(',') === 'OPEN,IN FLIGHT,LANDED,OPEN,UNPARSED',
		`order [${s.order.join(' → ')}] · counts [${s.counts.join(' | ')}]\n`
		+ `      sessions ${JSON.stringify(s.sessions)}\n`
		+ `      board ${s.rows.map(r => `${r.id}=${r.state} (${r.staff})`).join(' · ')}\n`
		+ `      ledger tail "${s.tail}" · decisions [${s.decisions.join(', ')}] · issues ${s.issues} entries`);

	// --- 3. B14's waiting style, here too ---

	const waitingHere = await evaluate<{ dots: string[]; word: string }>(`(() => ({
		dots: [...document.querySelectorAll('#host-focus [data-sec="sessions"] .dot')].map(d => d.className),
		word: document.querySelector('#host-focus [data-sec="sessions"] .dot.w-blocked').closest('.ws-session').querySelector('.st-word').textContent,
	}))()`);
	ok('a blocked session carries B14’s waiting style in this pane too — one vocabulary, everywhere',
		waitingHere.dots.filter(c => c.includes('w-blocked')).length === 1 && waitingHere.word === 'blocked',
		`dots in the session list: ${JSON.stringify(waitingHere.dots)} · its word reads "${waitingHere.word}"`);

	// --- 4. collapse, per section ---

	const collapsed = await evaluate<{ before: number; after: number; open: string; others: string[] }>(`(() => {
		const before = document.querySelectorAll('#host-focus [data-sec="board"] .ws-row').length;
		document.querySelector('#host-focus [data-sec="board"] .sec-h button').click();
		return {
			before,
			after: document.querySelectorAll('#host-focus [data-sec="board"] .ws-row').length,
			open: document.querySelector('#host-focus [data-sec="board"]').dataset.open,
			others: [...document.querySelectorAll('#host-focus .sec')].map(x => x.dataset.sec + ':' + x.dataset.open),
		};
	})()`);
	ok('collapse is per section — the board folds and nothing else moves',
		collapsed.before === 5 && collapsed.after === 0 && collapsed.open === 'no'
		&& collapsed.others.filter(x => x.endsWith(':no')).length === 1,
		`board rows in DOM ${collapsed.before} → ${collapsed.after}, data-open="${collapsed.open}"\n`
		+ `      every section: ${collapsed.others.join(' · ')}`);
	await evaluate(`document.querySelector('#host-focus [data-sec="board"] .sec-h button').click()`);

	// --- 5. a reorder, through the pane's own handler, surviving a reload ---

	const reordered = await evaluate<{ order: string[]; stored: string }>(`(() => {
		// The ▲ on ISSUES, three times: the accessible half of the same moved() the drag calls.
		for (let i = 0; i < 3; i++) document.querySelector('#host-focus [data-sec="issues"] [data-move$=":-1"]').click();
		return {
			order: [...document.querySelectorAll('#host-focus .sec')].map(x => x.dataset.sec),
			stored: localStorage.getItem('belvedere.workshop.order'),
		};
	})()`);

	// A drag, dispatched as the browser's own events over the same handler.
	const dragged = await evaluate<{ order: string[]; stored: string }>(`(() => {
		const dt = new DataTransfer();
		const from = document.querySelector('#host-focus [data-sec="sessions"] .sec-h');
		const onto = document.querySelector('#host-focus [data-sec="ledger"] .sec-h');
		from.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt }));
		onto.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }));
		onto.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
		return {
			order: [...document.querySelectorAll('#host-focus .sec')].map(x => x.dataset.sec),
			stored: localStorage.getItem('belvedere.workshop.order'),
		};
	})()`);

	await evaluate(`location.reload()`);
	await Bun.sleep(600);
	await attach();
	await ready();
	await until('the Workshop to come back up', async () => await evaluate<boolean>(
		`document.querySelectorAll('#host-focus .sec').length === 5`), POLL_MS * 2);
	const afterReload = await evaluate<{ order: string[]; stored: string }>(`({
		order: [...document.querySelectorAll('#host-focus .sec')].map(x => x.dataset.sec),
		stored: localStorage.getItem('belvedere.workshop.order'),
	})`);
	ok('a reorder is his — buttons and drag drive one law, and it survives a reload (localStorage)',
		reordered.order.join(',') === 'sessions,issues,board,ledger,decisions'
		&& dragged.order.join(',') === 'issues,board,ledger,sessions,decisions'
		&& afterReload.order.join(',') === dragged.order.join(','),
		`▲ ×3 on issues (last → second, one place per click) → [${reordered.order.join(' → ')}]  stored ${reordered.stored}\n`
		+ `      drag sessions onto ledger → [${dragged.order.join(' → ')}]  stored ${dragged.stored}\n`
		+ `      after a full page reload → [${afterReload.order.join(' → ')}]  stored ${afterReload.stored}`);

	// --- 6. absent storage renders the defaults ---

	await evaluate(`localStorage.removeItem('belvedere.workshop.order'); localStorage.removeItem('belvedere.workshop.collapsed'); location.reload()`);
	await Bun.sleep(600);
	await attach();
	await ready();
	await evaluate(SET('focus', 'expanded'));
	await until('the defaults', async () => await evaluate<boolean>(
		`document.querySelectorAll('#host-focus .sec').length === 5`), POLL_MS * 2);
	const defaults = await evaluate<{ order: string[]; stored: string | null; folded: string[] }>(`({
		order: [...document.querySelectorAll('#host-focus .sec')].map(x => x.dataset.sec),
		stored: localStorage.getItem('belvedere.workshop.order'),
		folded: [...document.querySelectorAll('#host-focus .sec')].map(x => x.dataset.open),
	})`);
	ok('absent storage renders the defaults — the memory is a convenience, never load-bearing',
		defaults.order.join(',') === 'sessions,board,ledger,decisions,issues'
		&& defaults.stored === null && defaults.folded.every(v => v === 'yes'),
		`localStorage.getItem('belvedere.workshop.order') → ${defaults.stored}\n`
		+ `      order [${defaults.order.join(' → ')}] · every section open: ${defaults.folded.join(', ')}`);

	// --- 7. THE FIELD REPORT'S ITEM 3: `LEDGER.md:385` lands ON line 385 ---

	const landed = await evaluate<{
		label: string; text: string; marked: number; markedLine: string; markedText: string;
		inView: boolean; top: number; bottom: number; paneTop: number; paneBottom: number; lines: number;
	}>(`(async () => {
		// The reference the fixture's INBOX wrote, clicked exactly as Felix would click it.
		const ref = [...document.querySelectorAll('#host-focus [data-sec="issues"] button.ref')]
			.find(b => b.textContent === 'LEDGER.md:385');
		const label = ref.textContent;
		ref.click();
		for (let i = 0; i < 60 && !document.querySelector('#host-focus .dl[data-mark="yes"]'); i++)
			await new Promise(r => setTimeout(r, 100));
		await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
		const mark = document.querySelector('#host-focus .dl[data-mark="yes"]');
		const box = mark.getBoundingClientRect();
		const pane = document.getElementById('host-focus').getBoundingClientRect();
		return {
			label,
			text: document.querySelector('#host-focus .doc-name').textContent,
			marked: document.querySelectorAll('#host-focus .dl[data-mark="yes"]').length,
			markedLine: mark.dataset.line,
			markedText: mark.querySelector('.lt').textContent,
			inView: box.top >= pane.top && box.bottom <= pane.bottom,
			top: box.top, bottom: box.bottom, paneTop: pane.top, paneBottom: pane.bottom,
			lines: document.querySelectorAll('#host-focus .dl').length,
		};
	})()`);
	ok('a `LEDGER.md:385` reference opens the viewer ON line 385 — marked, and inside the pane',
		landed.markedLine === '385' && landed.marked === 1 && landed.inView
		&& landed.markedText.includes('THIS IS LINE 385'),
		`clicked the rendered reference "${landed.label}" in the ISSUES section · viewer head reads "${landed.text}"\n`
		+ `      exactly ${landed.marked} line marked, and it is line ${landed.markedLine} of ${landed.lines}: "${landed.markedText}"\n`
		+ `      in view — line box ${landed.top.toFixed(2)}–${landed.bottom.toFixed(2)} px inside pane ${landed.paneTop.toFixed(2)}–${landed.paneBottom.toFixed(2)} px`);

	// --- 8. and a reference in a LANDING RECORD does the same, from the board ---

	await evaluate(`document.querySelector('#host-focus .doc-h button').click()`);
	await settle();
	const fromBoard = await evaluate<{ opened: boolean; line: string; where: string }>(`(async () => {
		const row = document.querySelector('#host-focus [data-sec="board"] .ws-row[data-row="W3"]');
		// W3's annotation has no name of its own (its first seam runs past six words), so it renders
		// WHOLE with no [expand] — B9's furniture rule, and the reference is right there in the prose.
		const more = row.querySelector('details.more');
		if (more) { more.open = true; await new Promise(r => setTimeout(r, 50)); }
		const ref = [...row.querySelectorAll('button.ref')].find(b => b.textContent === 'LEDGER.md:385');
		ref.click();
		for (let i = 0; i < 60 && !document.querySelector('#host-focus .dl[data-mark="yes"]'); i++)
			await new Promise(r => setTimeout(r, 100));
		const mark = document.querySelector('#host-focus .dl[data-mark="yes"]');
		return { opened: !!mark, line: mark ? mark.dataset.line : '', where: document.querySelector('#host-focus .doc-name').textContent };
	})()`);
	ok('the same reference works from a landing record’s own prose — one span kind, every section',
		fromBoard.opened && fromBoard.line === '385',
		`W3's annotation, expanded: its \`LEDGER.md:385\` opened ${fromBoard.where} at line ${fromBoard.line}`);

	// --- 9. the three states are three densities, and Action follows Focus ---

	await evaluate(`document.querySelector('#host-focus .doc-h button')?.click()`);
	await evaluate(SET('focus', 'typical'));
	await evaluate(SET('action', 'typical'));
	await Bun.sleep(400);
	const typical = await evaluate<{ sections: string[]; note: string; action: string; on: string; overflow: number }>(`({
		sections: [...document.querySelectorAll('#host-focus .sec')].map(x => x.dataset.sec),
		note: [...document.querySelectorAll('#host-focus p.quiet')].at(-1).textContent,
		action: document.getElementById('host-action').textContent,
		on: document.querySelector('#host-action .plan-card').dataset.building,
		overflow: document.documentElement.scrollHeight - window.innerHeight,
	})`);
	// **Amended at B17.** This asserted that Action held B15's own placeholder, whose text named the
	// building. The placeholder is gone exactly as it said it would be — the composer moved in — so
	// the check now reads the composer's own card. The invariant is unchanged and stated better:
	// *Action follows Focus*, and what stands there is about the building Focus is holding. The name is
	// matched by suffix because inside a fixture city a building IS its absolute path (B10 F5).
	ok('typical shows the top of HIS order and says what it is holding back; Action follows Focus',
		typical.sections.length === 3 && typical.sections.join(',') === 'sessions,board,ledger'
		&& /2 more section/.test(typical.note) && typical.on.endsWith('nb/workshop') && typical.overflow === 0,
		`typical → [${typical.sections.join(' → ')}] and the pane says "${typical.note}"\n`
		+ `      Action holds the composer, and its plan card is about ${typical.on}: "${typical.action.replace(/\s+/g, ' ').slice(0, 120)}"\n`
		+ `      scrollHeight − viewport = ${typical.overflow} px`);
	await evaluate(SET('focus', 'expanded'));
	await settle();

	// --- 10. minimal is one word and a mark; the body still never scrolls ---

	await evaluate(SET('focus', 'minimal'));
	await Bun.sleep(400);
	const minimal = await evaluate<{ name: string; dots: number; sections: number; overflow: number; width: number }>(`({
		name: document.querySelector('#host-focus .big').textContent,
		dots: document.querySelectorAll('#host-focus .dot').length,
		sections: document.querySelectorAll('#host-focus .sec').length,
		overflow: document.documentElement.scrollHeight - window.innerHeight,
		width: document.getElementById('pane-focus').getBoundingClientRect().width,
	})`);
	ok('minimal is one word and a mark, and the page body still does not scroll (the law of space)',
		minimal.sections === 0 && minimal.dots >= 2 && minimal.overflow === 0
		&& minimal.name === 'workshop',
		`focus pane ${minimal.width.toFixed(2)} px wide holds "${minimal.name}" + ${minimal.dots} dots and ${minimal.sections} sections\n`
		+ `      scrollHeight − viewport = ${minimal.overflow} px`);

	// --- 11. and at minimal the deck asks the server for nothing ---

	await Bun.sleep(POLL_MS + 400);
	const asked = await evaluate<string[]>(
		`performance.getEntriesByType('resource').filter(e => e.name.includes('/deck/state')).slice(-4).map(e => e.name.replace(location.origin, ''))`);
	ok('at minimal the poll carries no building — the detail is asked for, never broadcast',
		asked.length > 0 && asked.at(-1) === '/deck/state',
		`the last ${asked.length} polls: ${asked.join(' · ')}`);

	// --- 12. zero fire wiring, in the DOM and in the bundle ---

	await evaluate(SET('focus', 'expanded'));
	await settle();
	const wiring = await evaluate<{ attrs: number; text: number; buttons: number }>(`(() => ({
		attrs: document.querySelectorAll('[data-fire],[data-apply],[data-worktree],[data-summons]').length,
		text: (document.documentElement.outerHTML.match(/hands\\/fire/g) || []).length,
		buttons: document.querySelectorAll('#host-focus button, #host-action button').length,
	}))()`);
	const bundle = await (await fetch(`${ORIGIN}/deck.js`)).text();
	const inBundle = (bundle.match(/hands\/fire/g) || []).length;
	const inSource = (await Bun.file(join(HERE, 'glass/workshop.client.ts')).text()).match(/hands\/fire/g)?.length ?? 0;
	// **Narrowed at B17, and strictly stronger.** The Action pane now holds the composer, which is the
	// one surface on the deck that may fire (keel §3), so `/deck.js` carries that path exactly once. The
	// invariant this check protects never changed — *nothing in these panes may reach it* — so it moved
	// from "the bundle contains it zero times" to "which SOURCE contains it", which names the one file
	// allowed to instead of counting a string. Reasoning at the assertion, per B6's precedent.
	const ONLY = 'composer.client.ts';
	const sources = ['deck.client.ts', 'deck-dom.ts', 'workshop.client.ts', 'works.client.ts', ONLY]
		.map(f => [f, (readFileSync(join(HERE, 'glass', f), 'utf8').match(/hands\/fire/g) ?? []).length] as const);
	const onlyComposer = sources.every(([f, n]) => (f === ONLY ? n >= 1 : n === 0));
	ok('ZERO fire wiring in the Workshop — and the composer is the only source that fires (D10)',
		wiring.attrs === 0 && wiring.text === 0 && onlyComposer && inSource === 0,
		`DOM: 0 of [data-fire, data-apply, data-worktree, data-summons]; "hands/fire" ${wiring.text}× in the document\n`
		+ `      glass/workshop.client.ts: "hands/fire" ${inSource}× · /deck.js is ${bundle.length} B and carries it ${inBundle}×\n`		+ `      per source: ${sources.map(([f, n]) => `${f} ${n}×`).join(' · ')}\n`
		+ `      ${wiring.buttons} buttons across Focus and Action, and the only wire among them is /hands/focus`);

}
catch (e) {
	failures++;
	console.log(`FAIL  the probe itself threw\n      ${e instanceof Error ? e.message : String(e)}`);
	const seen = await evaluate<string>(`JSON.stringify({
		pulse: document.getElementById('pulse').textContent,
		fault: document.getElementById('pulse').dataset.fault,
		focusHead: document.getElementById('host-focus').textContent.slice(0, 200),
		sections: [...document.querySelectorAll('#host-focus .sec')].map(x => x.dataset.sec),
	})`).catch(err => `could not ask the page: ${String(err)}`);
	console.log(`      page says: ${seen}`);
}
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
