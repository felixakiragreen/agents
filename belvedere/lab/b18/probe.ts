// B18's DoD, driven against the LIVE desktop — because live identity is not a thing a fixture can
// have. B13's harness (F1), B15's shape, and one real probe session fired through the glass's own
// hands (dogfood: every fire is more close-smoke evidence).
//
//    bun belvedere/lab/b18/probe.ts
//
// What it does to Felix's desktop, all of it: creates ONE cmux workspace running one haiku·low
// session that uses no tools, renames and recolours **that workspace only**, jumps to it once (which
// brings cmux forward — that is the item under test), then closes it and re-selects the workspace
// that was selected before. It reads the live census and the live register; it writes nothing but
// the hands' own audit line and one summons file, both in the gitignored census home.

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4494, CDP_PORT = 9338, COLD_PORT = 4495;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const POLL_MS = 3000;
const CENSUS_HOME = join(homedir(), 'code/agents/summon/log/census');

const ROOT = mkdtempSync(join(tmpdir(), 'b18-probe-'));
const PROFILE = join(ROOT, 'chrome');
const WRONG_ENV = join(ROOT, 'wrong-env');
writeFileSync(WRONG_ENV, 'CMUX_SOCKET_PASSWORD=not-the-password\n', { mode: 0o600 });

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

/** Wait for the first non-null answer. A boolean condition returns `true` or `null`, never `false`. */
async function until<T>(what: string, probe: () => Promise<T | null>, ms = 60_000): Promise<T> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		const got = await probe().catch(() => null);
		if (got !== null) return got;
		await Bun.sleep(120);
	}
	throw new Error(`timed out waiting for ${what}`);
}

const yes = (b: boolean): true | null => (b ? true : null);

// ---------- the socket, read and written straight (the control beside the glass's own hands) ----------

async function cmux(...args: string[]): Promise<{ code: number; out: string }> {
	const p = Bun.spawn(['cmux', ...args], { env: { ...process.env, CMUX_QUIET: '1' }, stdout: 'pipe', stderr: 'pipe', timeout: 20_000 });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	return { code: await p.exited, out: (out + err).trim() };
}

type WS = { id: string; ref: string; title: string; custom_color: string | null; selected: boolean };
const workspaces = async (): Promise<WS[]> =>
	(JSON.parse((await cmux('workspace', 'list', '--json')).out) as { workspaces: WS[] }).workspaces;

/** The frontmost application, by name — no permissions, no AppleScript (B9 F3's `ps` posture). */
async function frontmost(): Promise<string> {
	const one = async (...cmd: string[]) => {
		const p = Bun.spawn(cmd, { stdout: 'pipe', stderr: 'pipe' });
		return (await new Response(p.stdout).text()).trim();
	};
	const info = await one('lsappinfo', 'info', '-only', 'name', await one('lsappinfo', 'front'));
	return info.match(/"LSDisplayName"="([^"]*)"/)?.[1] ?? info;
}

const post = async (path: string, body: unknown, origin = ORIGIN) => {
	const r = await fetch(origin + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return { code: r.status, body: await r.json() as { ok: boolean; error?: string; result?: Record<string, unknown> } };
};

/** The last audit line for an action — the hands' own record, quoted rather than described. */
const lastAudit = (action: string): string =>
	readFileSync(join(CENSUS_HOME, 'hands.jsonl'), 'utf8').trimEnd().split('\n')
		.filter(l => l.includes(`"action":"${action}"`)).at(-1) ?? '(none)';

// ---------- the run ----------

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}`);
	process.exit(2);
}

const STAMP = `builder-b18-probe-${String(Date.now()).slice(-6)}`;
const SUMMONS = 'You are a one-line probe for Belvedere\'s B18 row. Use no tools at all. '
	+ 'Reply with exactly: b18 probe standing by.';

const glass = Bun.spawn(['bun', SERVER], { env: { ...process.env, GLASS_PORT: String(PORT) }, stdout: 'pipe', stderr: 'pipe' });
const cold = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(COLD_PORT), BELVEDERE_ENV: WRONG_ENV },
	stdout: 'pipe', stderr: 'pipe',
});

let chrome: ReturnType<typeof Bun.spawn> | null = null;
let workspaceRef: string | null = null;
const wasSelected = (await workspaces()).find(w => w.selected)?.id ?? null;

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

async function attach(url: string): Promise<void> {
	await until('chrome', async () => yes((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok));
	const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json() as
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

/** What the City draws for our probe session, read out of the live DOM. */
const lineOf = (sid: string) => `(() => {
	const li = [...document.querySelectorAll('#host-context .line')]
		.find(l => l.dataset.tipSid === '${sid}');
	if (!li) return null;
	return {
		who: li.querySelector('.who')?.textContent ?? null,
		birth: li.querySelector('.birth')?.textContent ?? null,
		stale: !!li.querySelector('.stale'),
		swatch: li.querySelector('.swatch')?.style.background ?? null,
		tip: li.dataset.tip ?? null,
		name: li.dataset.tipName ?? null,
	};
})()`;

try {
	await until('the glass', async () => yes((await fetch(DECK)).ok));
	await until('the cold glass', async () => yes((await fetch(`http://127.0.0.1:${COLD_PORT}/deck`)).ok));

	// ---------- 0. one probe session, fired through the glass's own hands ----------
	const fired = await post('/hands/fire', {
		account: 'personal', stamp: STAMP, cwd: join(homedir(), 'code/agents'),
		model: 'haiku', effort: 'low', color: '#0362b2', summons: SUMMONS,
	});
	if (!fired.body.ok) throw new Error(`the probe fire was refused: ${fired.body.error}`);
	workspaceRef = String(fired.body.result!['workspace']);
	ok('a fire composed with a felikai hex survives (B3 F1 closed at the cause)',
		fired.code === 200, `${workspaceRef} · colour #0362b2 · ${lastAudit('fire')}`);

	// The census is the join key; wait for the session to heartbeat with its venue attached.
	type Snap = { census: { sessions: { sid: string; stamp: string | null; ws: string | null; live: { name: string; color: string | null } | null }[] }; identity: { at: number; error: string | null; workspaces: number } };
	const snap = async (): Promise<Snap> => await (await fetch(`${ORIGIN}/deck/state`)).json() as Snap;
	// **The fire answers a `workspace:N` ref, and a ref is not an identity** (P6 F2). It is resolved
	// to the workspace's uuid once, here, and the census session is found by that uuid — which is
	// also the only way to be sure this is THIS run's session and not a previous probe's ghost.
	const WSID = await until('the probe workspace\'s uuid', async () =>
		(await workspaces()).find(w => w.ref === workspaceRef)?.id ?? null);
	const mine = await until('the probe to reach the census with a cmux workspace', async () =>
		(await snap()).census.sessions.find(x => x.ws === WSID) ?? null);
	const SID = mine.sid;
	ok('the census joins the probe to a cmux workspace by uuid (P6 F2: never a ref)',
		/^[0-9A-F-]{36}$/i.test(WSID) && mine.ws === WSID,
		`fire returned ${workspaceRef} · resolved to ${WSID} · the census beat carries ws=${mine.ws} for sid ${SID}`);
	ok('the socket read names it, and the birth stamp is beside it, not instead of it',
		mine.live?.name === STAMP, `live=${JSON.stringify(mine.live)} · stamp=${mine.stamp}`);

	// ---------- the browser ----------
	chrome = Bun.spawn([CHROME,
		'--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
		'--disable-background-networking', '--disable-sync', '--disable-default-apps',
		'--window-size=1600,900', `--user-data-dir=${PROFILE}`,
		`--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', DECK,
	], { stdout: 'pipe', stderr: 'pipe' });
	await attach(DECK);
	await until('the first poll', async () => yes(await evaluate<boolean>(`!!document.querySelector('#live-count')`)));
	await until('the probe on the City', async () => await evaluate<object | null>(lineOf(SID)));

	// ---------- 1. renamed in cmux → the deck says so within one poll ----------
	const CMUX_NAME = 'b18 renamed in cmux';
	// Milliseconds are a phase accident — a rename lands wherever it lands inside the 3 s cycle. What
	// "within one poll" means is that the deck needs ONE poll and not two, so the poll counter the
	// pulse already publishes is the honest measurement, and the delta is reported beside it.
	const pollsBefore = await evaluate<number>(`Number(document.getElementById('pulse').dataset.polls)`);
	const t0 = Date.now();
	const renamedThere = await cmux('workspace-action', '--workspace', WSID, '--action', 'rename', '--title', CMUX_NAME);
	const seen = await until('the deck to show the cmux-side rename', async () => {
		const l = await evaluate<{ who: string; birth: string | null }>(lineOf(SID));
		if (!l || l.who !== CMUX_NAME) return null;
		return { at: Date.now(), polls: await evaluate<number>(`Number(document.getElementById('pulse').dataset.polls)`), ...l };
	}, POLL_MS * 4);
	ok('a rename made IN cmux reaches the deck on the very next poll, birth stamp beside it',
		seen.polls - pollsBefore === 1 && seen.birth === STAMP,
		`renamed at ${new Date(t0).toISOString()} (${renamedThere.out}); on the deck after `
		+ `${seen.polls - pollsBefore} poll (${seen.at - t0} ms; the period is ${POLL_MS} ms) · `
		+ `who="${seen.who}" birth="${seen.birth}"`);

	// ---------- 1b. the Workshop draws the same name, from the same function ----------
	await evaluate(`[...document.querySelectorAll('#host-context .row[data-building]')]
		.find(r => r.dataset.building === 'agents').click()`);
	await evaluate(`document.querySelector('[data-set-state="typical"][data-pane="focus"]').click()`);
	const inShop = await until('the Workshop\'s own line for the probe', async () => await evaluate<{ who: string; birth: string | null; controls: boolean } | null>(`(() => {
		const li = [...document.querySelectorAll('#host-focus .ws-session')].find(l => l.dataset.tipSid === '${SID}');
		return li ? { who: li.querySelector('.who').textContent, birth: li.querySelector('.birth')?.textContent ?? null, controls: !!li.dataset.tipSid } : null;
	})()`), POLL_MS * 3);
	ok('the Workshop names the session the same way, and carries the same controls (one function, two panes)',
		inShop.who === CMUX_NAME && inShop.birth === STAMP && inShop.controls,
		`#host-focus .ws-session → ${JSON.stringify(inShop)}`);

	// ---------- 2. renamed from the deck → cmux reports it ----------
	const DECK_NAME = 'b18 renamed from the deck';
	// Through the page's own handlers: hover the line, hold past the tooltip's 450 ms, type, click.
	await evaluate(`document.querySelector('[data-tip-sid="${SID}"]')
		.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))`);
	await Bun.sleep(700);
	const wired = await evaluate<boolean>(`!!document.querySelector('#tip .tip-input')`);
	await evaluate(`(() => {
		const i = document.querySelector('#tip .tip-input');
		i.value = ${JSON.stringify(DECK_NAME)};
		[...document.querySelectorAll('#tip .tip-rename button')].at(-1).click();
	})()`);
	const backFromCmux = await until('cmux to carry the deck\'s rename', async () => {
		const w = (await workspaces()).find(x => x.id === WSID);
		return w && w.title === DECK_NAME ? w : null;
	}, 15_000);
	const receipt = await evaluate<string>(`document.querySelector('#tip .out')?.textContent ?? ''`);
	ok('a rename FROM the deck lands in cmux, and the receipt is cmux\'s own word',
		wired && backFromCmux.title === DECK_NAME,
		`tooltip control present=${wired} · cmux workspace list says title="${backFromCmux.title}" `
		+ `(${backFromCmux.ref}) · receipt "${receipt}" · ${lastAudit('rename')}`);

	// ---------- 3. recolor from the deck, and a colour cmux refuses ----------
	await evaluate(`document.querySelector('[data-tip-sid="${SID}"]')
		.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))`);
	await Bun.sleep(700);
	const swatches = await evaluate<number>(`document.querySelectorAll('#tip .swatch-btn').length`);
	await evaluate(`document.querySelector('#tip .swatch-btn[data-intent="green"]').click()`);
	const recoloured = await until('cmux to carry the deck\'s colour', async () => {
		const w = (await workspaces()).find(x => x.id === WSID);
		return w && w.custom_color?.toLowerCase() === '#3f9608' ? w : null;
	}, 15_000);
	ok('a swatch click recolours the workspace in cmux',
		recoloured.custom_color?.toLowerCase() === '#3f9608',
		`${swatches} swatches offered (one per felikai intent) · cmux says custom_color=${recoloured.custom_color} · ${lastAudit('recolor')}`);

	const refused = await post('/hands/recolor', { sid: SID, color: 'cyan' });
	ok('an illegal colour is refused loudly, in cmux\'s own words, and audited',
		refused.code === 409 && (refused.body.error ?? '').includes('Invalid color'),
		`${refused.code} ${refused.body.error}\n      ${lastAudit('recolor')}`);

	// ---------- 4. the map: every felikai intent survives the socket ----------
	const { SWATCHES } = await import('../../glass/colors');
	const intents: string[] = [];
	for (const { intent, hex } of SWATCHES) {
		const r = await post('/hands/recolor', { sid: SID, color: hex });
		intents.push(`${intent} ${hex} → ${r.code} ${r.body.ok ? String(r.body.result!['color']) : r.body.error}`);
	}
	ok('every felikai intent resolves to a value the socket accepts',
		intents.every(l => l.includes('→ 200')), intents.join('\n      '));

	// ---------- 5. the jump, reproduced ----------
	// The panel is the census's own `CMUX_SURFACE_ID`, read off the beat the session wrote.
	const surface = JSON.parse(readFileSync(join(CENSUS_HOME, 'census.jsonl'), 'utf8').trimEnd().split('\n')
		.filter(l => l.includes(`"sid":"${SID}"`)).at(-1)!).sf as string;
	// The reproduction needs a frontmost that is NOT cmux — the field report's situation is the deck
	// in a browser. Finder is the one app always there to stand in for it.
	await Bun.spawn(['open', '-a', 'Finder'], { stdout: 'pipe', stderr: 'pipe' }).exited;
	await Bun.sleep(900);
	const beforeApp = await frontmost();
	if (wasSelected) await cmux('workspace', 'select', wasSelected);   // the probe goes to the background

	const noWorkspace = await cmux('focus-panel', '--panel', surface);
	const withWorkspace = await cmux('focus-panel', '--panel', surface, '--workspace', WSID);
	const midApp = await frontmost();
	const jumped = await post('/hands/focus', { sid: SID });
	await Bun.sleep(600);
	const afterApp = await frontmost();
	const selectedNow = (await workspaces()).find(w => w.selected)?.id ?? null;
	// The control's frontmost is REPORTED, not asserted: macOS decides whether a background app may
	// raise itself, so `focus-panel`'s side effect on activation is environment-dependent — measured
	// `Arc → Arc` (invisible, the field report's own symptom) and `Finder → cmux` on two runs of this
	// same script. What the hand must guarantee is the line below: cmux forward, that panel selected.
	ok('the dead jump: the socket half reproduced, and the hand lands cmux forward on the probe\'s panel',
		noWorkspace.code !== 0 && withWorkspace.code === 0
		&& jumped.body.ok && afterApp === 'cmux' && selectedNow === WSID,
		`the old shape, both halves:\n      `
		+ `  --panel <uuid> alone → "${noWorkspace.out}" (this is what a session with no census ws got)\n      `
		+ `  --panel --workspace → "${withWorkspace.out}" — OK; frontmost ${beforeApp} → ${midApp} (the OS's call, not the socket's)\n      `
		+ `the hand: POST /hands/focus → ${JSON.stringify(jumped.body)}\n      `
		+ `  frontmost now ${afterApp}, selected workspace ${selectedNow} (the probe's)\n      ${lastAudit('focus')}`);

	// ---------- 6. identity degrades honestly ----------
	const coldSnap = await (await fetch(`http://127.0.0.1:${COLD_PORT}/deck/state`)).json() as Snap;
	await evaluate(`location.href = ${JSON.stringify(`http://127.0.0.1:${COLD_PORT}/deck`)}`);
	await Bun.sleep(1200);
	await until('the cold deck\'s first poll', async () => yes(await evaluate<boolean>(`!!document.querySelector('#live-count')`)));
	const staleNote = await until('the stale note', async () =>
		await evaluate<string>(`document.querySelector('#host-context .stale-note')?.textContent ?? ''`) || null);
	const staleLine = await evaluate<{ stale: boolean; who: string } | null>(lineOf(SID));
	ok('a socket that refuses the glass marks identity stale and invents nothing',
		coldSnap.identity.error !== null && staleNote.includes('STALE'),
		`/deck/state identity.error = ${JSON.stringify(coldSnap.identity.error)}\n      `
		+ `the deck says: "${staleNote}"\n      the probe's line: ${JSON.stringify(staleLine)}`);
}
catch (e) { ok('the run itself', false, String(e)); }
finally {
	// Venue restored (D55): the probe workspace closed, the selection put back where it was.
	if (workspaceRef) console.log(`\n# closing ${workspaceRef}: ${(await cmux('workspace', 'close', workspaceRef)).out}`);
	if (wasSelected) console.log(`# re-selecting ${wasSelected}: ${(await cmux('workspace', 'select', wasSelected)).out}`);
	chrome?.kill();
	glass.kill();
	cold.kill();
	await Bun.sleep(400);
	rmSync(ROOT, { recursive: true, force: true });
	console.log(failures ? `\n${failures} FAILED` : '\nall green');
	process.exit(failures ? 1 : 0);
}
