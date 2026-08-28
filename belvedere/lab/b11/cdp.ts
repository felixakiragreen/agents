// B13's DevTools harness (F1), lifted whole so B11's two probes can both drive a real browser: a
// fake DOM proves the fake, and the arm is a **click**, not a curl.
//
// Zero dependencies fetched, installed or vendored — the machine's own Chrome over the DevTools
// protocol, every URL 127.0.0.1.

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

type Reply = { id: number; result?: { result?: { value?: unknown }; exceptionDetails?: unknown }; error?: { message: string } };

let socket: WebSocket;
let nextId = 1;
const waiting = new Map<number, { go: (v: unknown) => void; no: (e: Error) => void }>();

export async function until(what: string, probe: () => Promise<boolean>, ms = 30_000): Promise<void> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		if (await probe().catch(() => false)) return;
		await Bun.sleep(200);
	}
	throw new Error(`timed out after ${Math.round((Date.now() - t0) / 1000)}s waiting for ${what}`);
}

export function launchChrome(profile: string, cdpPort: number, url: string) {
	return Bun.spawn([CHROME,
		'--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
		'--disable-background-networking', '--disable-sync', '--disable-default-apps',
		'--window-size=1600,900', `--user-data-dir=${profile}`,
		`--remote-debugging-port=${cdpPort}`, '--remote-allow-origins=*', url,
	], { stdout: 'pipe', stderr: 'pipe' });
}

export function evaluate<T>(expression: string): Promise<T> {
	const id = nextId++;
	return new Promise<T>((go, no) => {
		waiting.set(id, { go: v => go(v as T), no });
		socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
	});
}

export async function attach(cdpPort: number, url: string): Promise<void> {
	await until('chrome', async () => (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok);
	const targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json() as
		{ type: string; url: string; webSocketDebuggerUrl: string }[];
	const page = targets.find(t => t.type === 'page' && t.url.startsWith(url));
	if (!page) throw new Error(`no page target at ${url}: ${JSON.stringify(targets.map(t => t.url))}`);

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
export const settle = () => Bun.sleep(300);

export const SET = (pane: string, state: string) =>
	`document.querySelector('[data-set-state="${state}"][data-pane="${pane}"]').click()`;

/** Click the building whose row ends with `name`, then bring the Works forward. */
export async function openWorks(name: string, pollMs: number): Promise<void> {
	await evaluate(`[...document.querySelectorAll('#host-context .row[data-building]')]
		.find(r => r.dataset.building.endsWith(${JSON.stringify(name)})).click()`);
	await evaluate(`document.querySelector('[data-focus-on="works"]').click()`);
	await until(`the Works to open ${name}`, async () => await evaluate<boolean>(
		`(document.querySelector('#host-focus .ws-head .big')?.textContent ?? '').endsWith(${JSON.stringify(name)})`), pollMs * 3);
	await settle();
}
