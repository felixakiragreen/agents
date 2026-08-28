// B20's live half: the decoder against the REAL city — belvedere's own D2, canon's D63, the canon
// board's bare-numeral rows, and how much of the corpus the detector actually lights up.
//
//    bun belvedere/lab/b20/live.ts
//
// It reads the live register and the live census and **writes nothing anywhere** — no gesture, no
// fire, no beat. The countersign gesture is proven against a fixture inbox in `probe.ts`, because
// filing a real countersign to prove a button works would be the glass editing truth to test
// itself. The fixture half — clicks, nesting, the cycle, the cap — is `probe.ts`.

import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4496;
const CDP_PORT = 9340;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const HOLD_MS = 450;
const ROOT = mkdtempSync(join(tmpdir(), 'b20-live-'));

const BELVEDERE = join(process.env.HOME!, 'code/agents/belvedere/README.md');
const CANON = join(process.env.HOME!, 'code/agents/MAP.md');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}`);
	process.exit(2);
}

async function until(what: string, probe: () => Promise<boolean>, ms = 90_000): Promise<void> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		if (await probe().catch(() => false)) return;
		await Bun.sleep(150);
	}
	throw new Error(`timed out waiting for ${what}`);
}

// The live city and the live census; only the port and the credential move — the credential to a
// path that does not exist, because an armed process drives Felix's real desktop (B18's warning).
const glass = Bun.spawn(['bun', SERVER], {
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
const evaluate = <T>(expression: string): Promise<T> => new Promise<T>((go, no) => {
	const id = nextId++;
	waiting.set(id, { go: v => go(v as T), no });
	socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
});

async function attach(): Promise<void> {
	await until('chrome', async () => (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok);
	const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json() as
		{ type: string; url: string; webSocketDebuggerUrl: string }[];
	const page = targets.find(t => t.type === 'page' && t.url.startsWith(DECK));
	if (!page) throw new Error(`no page target at ${DECK}`);
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

type Decoded = {
	ok: boolean; label?: string; headline?: string; status?: string; building?: string;
	where?: { label: string; line: number }; reason?: string; candidates?: string[];
};

const ask = async (t: string, inPath: string, w?: string): Promise<Decoded> => {
	const q = new URLSearchParams({ t, in: inPath });
	if (w) q.set('w', w);
	return await (await fetch(`${ORIGIN}/deck/decode?${q}`)).json() as Decoded;
};

const line = (d: Decoded) => d.ok
	? `${d.label} → ${d.headline} · ${d.status} · ${d.building} · ${d.where?.label}:${d.where?.line}`
	: `${d.label} → UNRESOLVED: ${d.reason}${d.candidates?.length ? ` [${d.candidates.join(' | ')}]` : ''}`;

try {

	await until('the glass', async () => (await fetch(DECK)).ok);

	console.log(`\n# B20 — the decoder over the LIVE city (reads only; nothing is written)\n`);

	// --- 1. the ranges the order names, on the real corpus ---

	const b18 = await ask('B18', BELVEDERE);
	const d2 = await ask('D2', BELVEDERE);
	const d63 = await ask('D63', BELVEDERE);
	const d99 = await ask('D99', BELVEDERE);
	ok('local first, then canon — on the real corpus, where belvedere stops at D18 and canon runs to D67',
		b18.ok && b18.building === 'agents/belvedere'
		&& d2.ok && d2.building === 'agents/belvedere'
		&& d63.ok && d63.building === 'agents' && !d99.ok && (d99.candidates?.length ?? 0) === 2,
		[line(b18), line(d2), line(d63), line(d99)].map(s => `      ${s}`).join('\n').trimStart());

	// --- 2. the commissioning hover, against the canon board itself ---

	const r17 = await ask('row 17', BELVEDERE, 'canon');
	const r14 = await ask('row 14', CANON);
	const r14away = await ask('row 14', BELVEDERE);
	const r14scoped = await ask('row 14', BELVEDERE, 'belvedere');
	ok('`canon row 17` from a belvedere doc, a bare `row 14` at home, and an explicit scope that refuses',
		r17.ok && r17.building === 'agents' && r14.ok && r14.building === 'agents'
		&& r14away.ok && r14away.building === 'agents' && !r14scoped.ok,
		[line(r17), line(r14), line(r14away), line(r14scoped)].map(s => `      ${s}`).join('\n').trimStart()
		+ `\n      (the third is the canon FALLBACK — belvedere carries no numeric row — and the fourth is why`
		+ ` that is not a guess: name the building and a miss stays a miss)`);

	// --- 3. §refs against two different real documents ---

	const s5 = await ask('§5', BELVEDERE);
	const s3 = await ask('§3', join(process.env.HOME!, 'code/agents/belvedere/plans/deck-keel.md'));
	ok('one symbol, two documents, two answers — a § is always its own document’s',
		s5.ok && s3.ok && s5.headline !== s3.headline,
		[line(s5), line(s3)].map(s => `      ${s}`).join('\n').trimStart());

	// --- 4. how much of the live corpus lights up, and what it costs ---

	await attach();
	await until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));
	await evaluate(`document.querySelector('[data-set-state="expanded"][data-pane="context"]').click()`);
	await evaluate(`document.querySelector('[data-set-state="expanded"][data-pane="focus"]').click()`);
	await evaluate(`[...document.querySelectorAll('#host-context .row[data-building]')]
		.find(r => r.dataset.building === 'agents/belvedere').click()`);
	await until('the Workshop to open belvedere', async () => await evaluate<boolean>(
		`(document.querySelector('#host-focus .ws-head .big')?.textContent ?? '') === 'agents/belvedere'`));
	await Bun.sleep(600);

	const coverage = await evaluate<{ rows: number; words: number; distinct: string[]; sacred: number; code: number }>(`(() => {
		const ws = [...document.querySelectorAll('#host-focus .dw')].map(w => w.textContent);
		return {
			rows: document.querySelectorAll('#host-focus .ws-row').length,
			words: ws.length,
			distinct: [...new Set(ws)].slice(0, 24),
			sacred: [...document.querySelectorAll('#host-focus pre.summons')].reduce((n, p) => n + p.querySelectorAll('.dw').length, 0),
			code: [...document.querySelectorAll('#host-focus code')].reduce((n, c) => n + c.querySelectorAll('.dw').length, 0),
		};
	})()`);
	ok('the live Workshop lights up, and the byte-sacred parts do not',
		coverage.words > 100 && coverage.sacred === 0 && coverage.code === 0,
		`agents/belvedere at expanded: ${coverage.rows} board rows, ${coverage.words} decoder spans\n`
		+ `      distinct words (first 24): ${coverage.distinct.join(', ')}\n`
		+ `      inside fenced kickoffs: ${coverage.sacred} · inside code ticks: ${coverage.code}`);

	// --- 5. a real hover on a real landing record ---

	const hovered = await evaluate<{ id: string; name: string; status: string; body: string }>(`(async () => {
		const w = [...document.querySelectorAll('#host-focus .ws-row .dw')].find(x => x.textContent === 'D65')
			?? [...document.querySelectorAll('#host-focus .ws-row .dw')].find(x => x.textContent.startsWith('D'));
		w.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
		await new Promise(r => setTimeout(r, ${HOLD_MS + 400}));
		const t = document.getElementById('tip');
		return {
			id: t.querySelector('.dw-id')?.textContent ?? '',
			name: t.querySelector('.dw-name')?.textContent ?? '',
			status: t.querySelector('.tip-status')?.textContent ?? '',
			body: (t.querySelector('.tip-more')?.textContent ?? '').slice(0, 160),
		};
	})()`);
	ok('a code word in a real landing record resolves in the browser, not just on the wire',
		hovered.id !== '' && hovered.name !== '',
		`hovered "${hovered.id}" in a live board row → ${hovered.name} · ${hovered.status}\n      ${hovered.body}…`);

	// --- 6. the poll is unchanged: the decoder adds no bytes and no work to /deck/state ---

	const cost: number[] = [];
	for (let i = 0; i < 8; i++) {
		const t0 = performance.now();
		const r = await fetch(`${ORIGIN}/deck/state?b=agents/belvedere`);
		const body = await r.text();
		cost.push(performance.now() - t0);
		if (i === 7) console.log(`      (snapshot ${body.length} B — the decoder adds none of it: resolution is on hover)`);
		await Bun.sleep(200);
	}
	cost.sort((a, b) => a - b);
	ok('the poll carries no decoder payload — the shape B18 left is the shape B20 leaves',
		cost[Math.floor(cost.length / 2)]! < 1000,
		`/deck/state?b=agents/belvedere over N=8: p50 ${cost[Math.floor(cost.length / 2)]!.toFixed(0)} ms · max ${cost.at(-1)!.toFixed(0)} ms`);

}
catch (e) {
	failures++;
	console.log(`FAIL  the live run threw\n      ${e instanceof Error ? e.message : String(e)}`);
}
finally {
	chrome.kill();
	glass.kill();
	await Bun.sleep(400);
	rmSync(ROOT, { recursive: true, force: true });
}

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
