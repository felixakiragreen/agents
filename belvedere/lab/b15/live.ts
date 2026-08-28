// B15's live half: the Workshop opened on the REAL city — `agents/belvedere` and a hexwright-class
// building — plus what the widened poll actually costs over the whole register.
//
//    bun belvedere/lab/b15/live.ts
//
// It reads the live register and the live census and **writes nothing anywhere** — no fire, no
// gesture, no beat. The fixture half (clicks, the reorder, the marked line) is `probe.ts`; this run
// exists because "renders real data for `agents/belvedere`" is a claim about the corpus, and only
// the corpus can settle it.

import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4494;
const CDP_PORT = 9338;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const ROOT = mkdtempSync(join(tmpdir(), 'b15-live-'));

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}`);
	process.exit(2);
}

async function until(what: string, probe: () => Promise<boolean>, ms = 60_000): Promise<void> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		if (await probe().catch(() => false)) return;
		await Bun.sleep(150);
	}
	throw new Error(`timed out waiting for ${what}`);
}

// The live city, the live census — and only `GLASS_PORT` moved, so this is the glass Felix runs.
const glass = Bun.spawn(['bun', SERVER], { env: { ...process.env, GLASS_PORT: String(PORT) }, stdout: 'pipe', stderr: 'pipe' });
const chrome = Bun.spawn([CHROME,
	'--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
	'--disable-background-networking', '--disable-sync', '--window-size=1600,900',
	`--user-data-dir=${join(ROOT, 'chrome')}`, `--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', DECK,
], { stdout: 'pipe', stderr: 'pipe' });

type Reply = { id: number; result?: { result?: { value?: unknown }; exceptionDetails?: unknown }; error?: { message: string } };
let socket: WebSocket;
let nextId = 1;
const waiting = new Map<number, { go: (v: unknown) => void; no: (e: Error) => void }>();
const evaluate = <T>(expression: string): Promise<T> => new Promise<T>((go, no) => {
	const id = nextId++;
	waiting.set(id, { go: v => go(v as T), no });
	socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
});

async function attach(): Promise<void> {
	await until('chrome', async () => (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok);
	const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json() as
		{ type: string; url: string; webSocketDebuggerUrl: string }[];
	const page = targets.find(t => t.type === 'page' && t.url.startsWith(DECK))!;
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

const shut = async () => { chrome.kill(); glass.kill(); await Bun.sleep(400); rmSync(ROOT, { recursive: true, force: true }); };

/** Open a building by name through the City, exactly as a click does. */
async function open(name: string): Promise<void> {
	await evaluate(`[...document.querySelectorAll('#host-context .row[data-building]')]
		.find(r => r.dataset.building === ${JSON.stringify(name)}).click()`);
	await until(`the Workshop to open ${name}`, async () => await evaluate<boolean>(
		`document.querySelector('#host-focus .ws-head .big')?.textContent === ${JSON.stringify(name)}
		 && document.querySelectorAll('#host-focus .sec').length === 5`), 15_000);
	await Bun.sleep(250);
}

type Shot = {
	head: string; order: string[]; counts: string[];
	sessions: number; rows: { id: string; state: string }[];
	tail: string; decisions: number; issues: number; refs: number;
};
const SHOT = `(() => ({
	head: document.querySelector('#host-focus .ws-head .big').textContent,
	order: [...document.querySelectorAll('#host-focus .sec')].map(s => s.dataset.sec),
	counts: [...document.querySelectorAll('#host-focus .sec .sec-h .num')].map(n => n.textContent),
	sessions: document.querySelectorAll('#host-focus [data-sec="sessions"] .ws-session').length,
	rows: [...document.querySelectorAll('#host-focus [data-sec="board"] .ws-row')].map(r => ({
		id: r.dataset.row, state: r.querySelector('.pill').textContent })),
	tail: document.querySelector('#host-focus [data-sec="ledger"] .ws-tail-h').textContent.trim(),
	decisions: document.querySelectorAll('#host-focus [data-sec="decisions"] .ws-item').length,
	issues: document.querySelectorAll('#host-focus [data-sec="issues"] .ws-item').length,
	refs: document.querySelectorAll('#host-focus button.ref').length,
}))()`;

try {
	await until('the glass (the live register walk is ~9 s)', async () => (await fetch(DECK)).ok);
	await attach();
	await until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));
	await evaluate(`document.querySelector('[data-set-state="expanded"][data-pane="context"]').click()`);
	await evaluate(`document.querySelector('[data-set-state="expanded"][data-pane="focus"]').click()`);
	await Bun.sleep(300);

	const registerSize = await evaluate<number>(`document.querySelectorAll('#host-context .row[data-building]').length`);
	console.log(`\n# B15 — the Workshop over the LIVE city (${registerSize} buildings), Chrome 1600×900\n`);

	await open('agents/belvedere');
	const bel = await evaluate<Shot>(SHOT);
	await open('hexwright');
	const hex = await evaluate<Shot>(SHOT);

	ok('all five sections render real data for agents/belvedere AND a hexwright-class building',
		bel.order.join(',') === 'sessions,board,ledger,decisions,issues'
		&& bel.rows.length >= 20 && bel.issues >= 1 && bel.tail.length > 0
		&& hex.order.join(',') === bel.order.join(',') && hex.rows.length >= 1 && hex.tail.length > 0,
		`agents/belvedere — ${bel.rows.length} board rows [${bel.rows.slice(0, 4).map(r => `${r.id}=${r.state}`).join(' ')} …], `
		+ `${bel.sessions} live, ${bel.decisions} decisions, ${bel.issues} inbox entries, ${bel.refs} resolvable references\n`
		+ `      section counts [${bel.counts.join(' | ')}] · tail "${bel.tail.slice(0, 70)}"\n`
		+ `      hexwright — ${hex.rows.length} board rows [${hex.rows.map(r => `${r.id}=${r.state}`).join(' ')}], `
		+ `${hex.sessions} live, ${hex.decisions} decisions, ${hex.issues} inbox entries, ${hex.refs} references\n`
		+ `      section counts [${hex.counts.join(' | ')}] · tail "${hex.tail.slice(0, 70)}"`);

	// The section Felix put first, over real sessions — `agents` is where the city's live work is.
	await open('agents');
	const sessions = await evaluate<{ n: number; lines: { who: string; model: string; state: string; jump: boolean }[]; tips: string[] }>(`(() => {
		const li = [...document.querySelectorAll('#host-focus [data-sec="sessions"] .ws-session')];
		return {
			n: li.length,
			lines: li.map(x => ({
				who: x.querySelector('.who').textContent, model: x.querySelector('.tier').textContent,
				state: x.querySelector('.st-word').textContent, jump: !x.querySelector('[data-jump-sid]').disabled,
			})),
			tips: li.map(x => x.dataset.tipMore),
		};
	})()`);
	ok('live sessions render first, each with the model the transcript names and a tooltip carrying cwd · venue · pid',
		sessions.n >= 1
		&& sessions.lines.some(l => ['haiku', 'sonnet', 'opus', 'fable'].includes(l.model))
		&& sessions.tips.every(t => /pid /.test(t) && /last /.test(t))
		&& sessions.lines.filter(l => l.jump).length === sessions.tips.filter(t => /cmux workspace/.test(t)).length,
		`agents — ${sessions.n} live: ${sessions.lines.map(l => `${l.who} (${l.model}, ${l.state}${l.jump ? ', jumpable' : ''})`).join(' · ')}\n`
		+ `      a tooltip verbatim: "${sessions.tips[0]}"\n`
		+ `      a session in no cmux pane has its jump disabled and its tooltip says why — ${sessions.lines.filter(l => !l.jump).length} of ${sessions.n} here`);

	// A rendered reference on the LIVE corpus, opened at its line.
	await open('hexwright');
	const live = await evaluate<{ label: string; line: string; marked: number; inView: boolean; of: number }>(`(async () => {
		// The tail's own \`path:line\` reference, not the section head's file link (which is line 1).
		const ref = [...document.querySelectorAll('#host-focus [data-sec="ledger"] button.ref')]
			.find(b => /:\\d+$/.test(b.textContent));
		const label = ref.textContent;
		ref.click();
		for (let i = 0; i < 80 && !document.querySelector('#host-focus .dl[data-mark="yes"]'); i++)
			await new Promise(r => setTimeout(r, 100));
		await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
		const mark = document.querySelector('#host-focus .dl[data-mark="yes"]');
		const box = mark.getBoundingClientRect(), pane = document.getElementById('host-focus').getBoundingClientRect();
		return { label, line: mark.dataset.line, marked: document.querySelectorAll('#host-focus .dl[data-mark="yes"]').length,
			inView: box.top >= pane.top && box.bottom <= pane.bottom, of: document.querySelectorAll('#host-focus .dl').length };
	})()`);
	ok('a reference the LIVE corpus wrote opens the real file on its real line',
		live.marked === 1 && live.inView && Number(live.line) > 1,
		`clicked the rendered reference "${live.label}" in hexwright's ledger tail → the viewer opened `
		+ `${live.of}-line file at line ${live.line}, exactly ${live.marked} line marked, inside the pane`);

	// --- what the widened poll costs ---

	const timing = async (path: string) => {
		const ms: number[] = [];
		let bytes = 0;
		for (let i = 0; i < 12; i++) {
			const t0 = performance.now();
			const r = await fetch(`${ORIGIN}${path}`);
			bytes = (await r.text()).length;
			ms.push(performance.now() - t0);
		}
		ms.sort((a, b) => a - b);
		return { p50: ms[6]!, p95: ms[Math.floor(ms.length * 0.95)] ?? ms.at(-1)!, max: ms.at(-1)!, bytes };
	};
	const bare = await timing('/deck/state');
	const open1 = await timing(`/deck/state?b=${encodeURIComponent('agents/belvedere')}`);
	ok('the widened poll is priced, and stays far under the 500 ms bar',
		open1.p95 < 500,
		`GET /deck/state        p50 ${bare.p50.toFixed(0)} ms · p95 ${bare.p95.toFixed(0)} ms · ${bare.bytes} B\n`
		+ `      GET /deck/state?b=agents/belvedere  p50 ${open1.p50.toFixed(0)} ms · p95 ${open1.p95.toFixed(0)} ms · ${open1.bytes} B `
		+ `(the city's biggest building: +${open1.bytes - bare.bytes} B and ${(open1.p50 - bare.p50).toFixed(0)} ms — the content was already parsed for the City)\n`
		+ `      N=12 each, live register of ${registerSize} buildings — and the detail rides the poll that already ran`);

	// The register is never walked on the request thread (B8 F3's law, re-proven with the wider read).
	const inside: number[] = [];
	const rewalk = fetch(`${ORIGIN}/rewalk?to=/deck`).then(r => r.text());
	await Bun.sleep(250);
	for (let i = 0; i < 3; i++) {
		const t0 = performance.now();
		await fetch(`${ORIGIN}/deck/state?b=${encodeURIComponent('agents/belvedere')}`);
		inside.push(performance.now() - t0);
		await Bun.sleep(150);
	}
	const t0 = performance.now();
	await rewalk;
	const walkMs = performance.now() - t0;
	ok('B8 F3’s worker law holds with the Workshop’s read on top — the walk never rides the request thread',
		Math.max(...inside) < 500,
		`a /rewalk costing ${(walkMs / 1000).toFixed(2)} s of its own request had three opened-Workshop polls land inside it `
		+ `in ${inside.map(n => n.toFixed(0)).join(' · ')} ms`);
}
catch (e) {
	failures++;
	console.log(`FAIL  the live probe threw\n      ${e instanceof Error ? e.message : String(e)}`);
}
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
