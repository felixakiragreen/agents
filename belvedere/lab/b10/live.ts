// The Works over the LIVE city — the same drawing, against the real register, the real census and
// the city's own `belvedere/flows/flow-batch-1.flow.json`.
//
//    bun belvedere/lab/b10/live.ts
//
// **It writes nothing.** Every read is a read the deck already makes; `BELVEDERE_ENV` is pointed at
// a path that does not exist, so the identity socket is never touched and no hand can arm (B18's
// own rule for a process that drives a browser). There is no run log for this flow — B11 writes the
// first one — so every ring here comes off the BOARD, which is exactly what a plan drawn before its
// engine exists should look like.

import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');
const PORT = 4491;
const CDP_PORT = 9335;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const ROOT = mkdtempSync(join(tmpdir(), 'b10-live-'));

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}`);
	process.exit(2);
}

const glass = Bun.spawn(['bun', join(HERE, 'glass/server.ts')], {
	env: { ...process.env, GLASS_PORT: String(PORT), BELVEDERE_ENV: join(ROOT, 'no-credential-here') },
	stdout: 'pipe', stderr: 'pipe',
});
const chrome = Bun.spawn([CHROME,
	'--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
	'--disable-background-networking', '--disable-sync', '--window-size=1600,900',
	`--user-data-dir=${join(ROOT, 'chrome')}`, `--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', DECK,
], { stdout: 'pipe', stderr: 'pipe' });

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

async function until(what: string, probe: () => Promise<boolean>, ms = 60_000): Promise<void> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		if (await probe().catch(() => false)) return;
		await Bun.sleep(150);
	}
	throw new Error(`timed out waiting for ${what}`);
}

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

try {
	await until('the glass (the register walk is ~9.5 s cold)', async () => (await fetch(DECK)).ok);
	await attach();
	await until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));

	await evaluate(`localStorage.setItem('belvedere.deck.building', JSON.stringify('agents/belvedere'));
		localStorage.setItem('belvedere.deck.focus', JSON.stringify('works'));
		localStorage.setItem('belvedere.deck.layout', JSON.stringify({ context: 'typical', focus: 'expanded', action: 'typical', drawer: 'shut' }));
		location.reload()`);
	await Bun.sleep(1500);
	await attach();
	await until('the live flow on the wall', async () => await evaluate<boolean>(
		`document.querySelectorAll('#host-focus .node').length === 5`), 30_000);
	await Bun.sleep(400);

	console.log(`\n# B10 — the Works over the LIVE city\n`);

	const drawn = await evaluate<{ nodes: { id: string; name: string; ring: string; from: string; tier: string }[]; ranks: string[]; paths: number; now: string; above: number; below: number; accounts: string[] }>(`(() => {
		const g = document.querySelector('#host-focus .graph');
		const kids = [...g.children].filter(k => !k.matches('svg'));
		const at = kids.findIndex(k => k.classList.contains('nowline'));
		return {
			nodes: [...g.querySelectorAll('.node')].map(n => ({
				id: n.dataset.node, name: n.querySelector('.nname').textContent,
				ring: n.dataset.ring, from: n.dataset.ringFrom, tier: n.querySelector('.ntier').textContent,
			})),
			ranks: kids.map(k => k.className + (k.dataset.rank !== undefined ? ':' + k.dataset.rank : '')),
			paths: g.querySelectorAll('svg.wires path[d]').length,
			now: g.querySelector('.nowline').textContent,
			above: kids.slice(0, at).reduce((n, k) => n + k.querySelectorAll('.node').length, 0),
			below: kids.slice(at).reduce((n, k) => n + k.querySelectorAll('.node').length, 0),
			accounts: [...document.querySelectorAll('#host-focus .bill .uline')].map(l => l.dataset.account),
		};
	})()`);
	ok('the city’s own flow is drawn over the city’s own board — past above the line, plan below',
		drawn.nodes.length === 5 && drawn.paths === 4 && drawn.above >= 1 && drawn.below >= 1 && drawn.accounts.length === 3,
		drawn.nodes.map(n => `${n.id}: "${n.name}" ${n.tier} — ${n.ring} (${n.from})`).join('\n      ')
		+ `\n      the drawing: [${drawn.ranks.join(' → ')}] · ${drawn.paths} placed edges`
		+ `\n      ${drawn.above} node(s) above the now-line, ${drawn.below} below · the line reads "${drawn.now.replace(/\s+/g, ' ')}"`
		+ `\n      the bill: ${drawn.accounts.join(', ')}`);

	const cost = await evaluate<number[]>(`(async () => {
		const out = [];
		for (let i = 0; i < 20; i++) {
			const t0 = performance.now();
			await fetch('/deck/state?b=agents/belvedere', { headers: { accept: 'application/json' } });
			out.push(+(performance.now() - t0).toFixed(1));
			await new Promise(r => setTimeout(r, 300));
		}
		return out;
	})()`);
	const sorted = [...cost].sort((a, b) => a - b);
	const p95 = sorted[Math.ceil(0.95 * sorted.length) - 1]!;
	const bytes = (await (await fetch(`${ORIGIN}/deck/state?b=agents/belvedere`)).text()).length;
	ok('the live poll carrying the Works stays inside the 500 ms bar',
		p95 < 500,
		`/deck/state?b=agents/belvedere over the whole live register, n=20 — min ${sorted[0]} · p50 ${sorted[9]} · p95 ${p95} · max ${sorted.at(-1)} (ms), ${bytes} B`);
}
catch (e) {
	failures++;
	console.log(`FAIL  the probe itself threw\n      ${e instanceof Error ? e.message : String(e)}`);
}
finally {
	chrome.kill();
	glass.kill();
	await Bun.sleep(400);
	rmSync(ROOT, { recursive: true, force: true });
}

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
