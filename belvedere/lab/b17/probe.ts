// B17's DoD, driven in a real browser — and, at the end, with one real fire.
//
//    bun belvedere/lab/b17/probe.ts
//
// Three things make this probe different from B13–B15's, and each is forced by what the row claims.
//
//  1. **It runs against the REAL city.** The row's whole subject is that belvedere work fired at
//     `~/code/agents` must stamp `…-belvedere-NN`, and that sentence is about two real directories.
//     A fixture city could only prove a fixture's spelling.
//  2. **The census is a fixture that induces B7 F4's case.** It carries one session whose transcript
//     names `builder-belvedere-77` and which appears in NEITHER lineage log — so the ordinal the
//     composer mints is `78` if and only if the live census is really the third source.
//  3. **It fires, once, for real** (haiku·low, `~/code/agents`, the workspace closed at landing —
//     D55, batch-5's desktop rules). `CENSUS_DIR` is the temp root, so the probe's summons file and
//     its audit line land in the temp tree and die with it: B8 F1's lesson is that test fires in the
//     REAL audit are counted by `nextStamp` forever after, and this one is deliberately kept out.
//
// `BELVEDERE_ENV` is left alone on purpose — the fire needs Felix's armed credential, and the whole
// point of the last check is the path from a rendered knob to a live session.

import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { homedir, tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4495;
const CDP_PORT = 9339;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;

const BUILDING = 'agents/belvedere';
const VENUE = join(homedir(), 'code/agents');
const INDUCED = 'builder-belvedere-77';                        // census only; in neither lineage log
const ACCOUNT_DIR = join(homedir(), '.claude');                 // `personal`, the composer's default

const ROOT = mkdtempSync(join(tmpdir(), 'b17-probe-'));
const CENSUS = join(ROOT, 'census.jsonl');
const TRANSCRIPT = join(ROOT, 'induced.jsonl');
const PROFILE = join(ROOT, 'chrome');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

const sha16 = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);

// ---------- the fixture: one live session the two logs have never heard of ----------

writeFileSync(TRANSCRIPT, JSON.stringify({ type: 'agent-name', agentName: INDUCED, sessionId: 'b17-induced' }) + '\n');
writeFileSync(CENSUS, JSON.stringify({
	t: Date.now() / 1000, ev: 'Stop', sid: 'b17-induced', acct: ACCOUNT_DIR,
	pid: String(process.pid), cwd: VENUE, tp: TRANSCRIPT, ws: '', sf: '',
}) + '\n');

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN} — a previous probe did not shut down.\n`
		+ `Close it first: lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t | xargs kill`);
	rmSync(ROOT, { recursive: true, force: true });
	process.exit(2);
}

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

const glass = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: ROOT },
	stdout: 'pipe', stderr: 'pipe',
});

const chrome = Bun.spawn([CHROME,
	'--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
	'--disable-background-networking', '--disable-sync', '--disable-default-apps',
	'--window-size=1600,900', `--user-data-dir=${PROFILE}`,
	`--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', DECK,
], { stdout: 'pipe', stderr: 'pipe' });

let workspaceId: string | null = null;

/** Leave nothing behind (D55): the probe's workspace closed, the temp tree gone. */
async function shut(): Promise<void> {
	if (workspaceId) console.log(`\n# closing ${workspaceId}: ${(await cmux('workspace', 'close', workspaceId)).out}`);
	chrome.kill();
	glass.kill();
	await Bun.sleep(400);
	rmSync(ROOT, { recursive: true, force: true });
}

// ---------- the socket, read straight (the control beside the glass's own hands) ----------

async function cmux(...args: string[]): Promise<{ code: number; out: string }> {
	const p = Bun.spawn(['cmux', ...args], { env: { ...process.env, CMUX_QUIET: '1' }, stdout: 'pipe', stderr: 'pipe', timeout: 20_000 });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	return { code: await p.exited, out: (out + err).trim() };
}

type WS = { id: string; ref: string; title: string; custom_color: string | null };
const workspaces = async (): Promise<WS[]> =>
	(JSON.parse((await cmux('workspace', 'list', '--json')).out) as { workspaces: WS[] }).workspaces;

// ---------- the DevTools wire (B13's, unchanged) ----------

type Reply = { id: number; result?: { result?: { value?: unknown }; exceptionDetails?: unknown }; error?: { message: string } };

let socket: WebSocket;
let nextId = 1;
const pendingCalls = new Map<number, { go: (v: unknown) => void; no: (e: Error) => void }>();

function evaluate<T>(expression: string): Promise<T> {
	const id = nextId++;
	return new Promise<T>((go, no) => {
		pendingCalls.set(id, { go: v => go(v as T), no });
		socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
	});
}

async function attach(): Promise<void> {
	await until('chrome', async () => yes((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok));
	const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json() as
		{ type: string; url: string; webSocketDebuggerUrl: string }[];
	const page = targets.find(t => t.type === 'page' && t.url.startsWith(DECK));
	if (!page) throw new Error(`no page target at ${DECK}: ${JSON.stringify(targets.map(t => t.url))}`);
	socket = new WebSocket(page.webSocketDebuggerUrl);
	socket.addEventListener('message', ev => {
		const msg = JSON.parse(String(ev.data)) as Reply;
		const w = pendingCalls.get(msg.id);
		if (!w) return;
		pendingCalls.delete(msg.id);
		if (msg.error) return w.no(new Error(msg.error.message));
		if (msg.result?.exceptionDetails) return w.no(new Error(JSON.stringify(msg.result.exceptionDetails)));
		w.go(msg.result?.result?.value);
	});
	await new Promise<void>((go, no) => {
		socket.addEventListener('open', () => go());
		socket.addEventListener('error', () => no(new Error('the DevTools socket refused')));
	});
}

/** The split is a 69 ms CSS transition (B13 F2): every geometry read waits for it to land. */
const settle = () => Bun.sleep(250);
const SET = (pane: string, state: string) =>
	`document.querySelector('[data-set-state="${state}"][data-pane="${pane}"]').click()`;

// ---------- the composer, page-side ----------

/** What the plan card is stating right now, straight off the element that states it. */
type Card = {
	stamp: string; tier: string; color: string; theater: string; cwd: string;
	sha: string; bytes: string; building: string; account: string;
	tone: string; summons: string; armed: string; out: string;
};

const CARD = `(() => {
	const c = document.querySelector('#host-action .plan-card');
	const box = document.querySelector('#host-action textarea.summons-in');
	const go = document.querySelector('#host-action button.go');
	const out = document.querySelector('#host-action [data-out-for="composer"]');
	return c ? { ...c.dataset, tone: c.dataset.tone, summons: box.value,
		armed: go ? go.dataset.armed : 'none', out: out ? out.textContent : '' } : null;
})()`;

const card = () => evaluate<Card | null>(CARD);

/** Move one knob and wait for the answer that names it — never for a fixed number of milliseconds. */
async function move(knob: string, value: string, settled: (c: Card) => boolean): Promise<Card> {
	await evaluate(`document.querySelector('#host-action .group[data-knob="${knob}"] .btn[data-value="${value}"]').click()`);
	return await until(`the plan to answer for ${knob}=${value}`, async () => {
		const c = await card();
		return c && settled(c) ? c : null;
	}, 15_000);
}

async function type(knob: string, value: string, settled: (c: Card) => boolean): Promise<Card> {
	await evaluate(`(() => {
		const i = document.querySelector('#host-action .group[data-knob="${knob}"] input.path');
		i.value = ${JSON.stringify(value)};
		i.dispatchEvent(new Event('input', { bubbles: true }));
	})()`);
	return await until(`the plan to answer for ${knob}=${value}`, async () => {
		const c = await card();
		return c && settled(c) ? c : null;
	}, 15_000);
}

// ---------- the run ----------

try {

await until('the glass', async () => yes((await fetch(DECK)).ok), 90_000);
await attach();
await until('the first poll', async () => yes(await evaluate<boolean>(`!!document.querySelector('#live-count')`)));

// A marker on the page: if any of this ever costs a reload, the marker dies and every later
// "without a reload" claim is void.
await evaluate(`window.__b17 = 'alive'; window.__navs = performance.getEntriesByType('navigation').length`);

await evaluate(SET('context', 'expanded'));
await evaluate(SET('focus', 'typical'));
await settle();

console.log(`\n# B17 — the composer in Action + live usage, measured in Chrome (window 1600×900)\n`);
console.log(`glass: ${DECK}   census: ${CENSUS} (induces ${INDUCED})   city: ~/code (the real one)\n`);

// --- 1. the law of space: Action at rest is one word and a mark ---

const rest = await evaluate<{ head: string; card: number; knobs: number; text: number; bodyScroll: number; viewport: number }>(`(() => ({
	head: document.querySelector('#host-action .c-head').textContent,
	card: document.querySelector('#host-action .c-card').getBoundingClientRect().height,
	knobs: document.querySelector('#host-action .c-knobs').getBoundingClientRect().height,
	text: document.querySelector('#host-action textarea.summons-in').getBoundingClientRect().height,
	bodyScroll: document.body.scrollHeight, viewport: window.innerHeight,
}))()`);
ok('Action at minimal is the head and nothing else — the composer obeys the law of space (keel §2)',
	rest.card === 0 && rest.knobs === 0 && rest.text === 0 && rest.bodyScroll <= rest.viewport,
	`head reads "${rest.head.replace(/\s+/g, ' ').trim()}" · card ${rest.card}px · knobs ${rest.knobs}px · summons box ${rest.text}px\n`
	+ `      body scrollHeight ${rest.bodyScroll} ≤ viewport ${rest.viewport} — the page body still does not scroll`);

// --- 2. usage: live ×3, against the rig's own fetch at one instant ---
//
// The composer fetches on expand (B17 §4), so the rig is asked in the same breath: two independent
// fetchers, two independent token reads, one instant. The gap is printed because the pacing delta
// is a clock — the 5-hour window moves one point every three minutes, and a comparison that hid
// its own latency would be a comparison nobody could check.

await evaluate(`[...document.querySelectorAll('#host-context .row[data-building]')]
	.find(r => r.dataset.building === '${BUILDING}').click()`);
await evaluate(SET('action', 'expanded'));
await until('the composer\'s own usage fetch', async () => yes(await evaluate<boolean>(
	`[...document.querySelectorAll('#host-action .usage .uline')].filter(l => l.className.includes('s-live')).length === 3`)), 30_000);

const rig = Bun.spawnSync(['zsh', '-c', `source ${join(homedir(), 'code/agents/summon/summon.zsh')} 2>/dev/null; summon-usage`],
	{ stdout: 'pipe', stderr: 'pipe' });
const rigCells = [...new TextDecoder().decode(rig.stdout).matchAll(/\b(sess|week|fable)\s+(-?\d+)%([+-]\d+)/g)]
	.map(m => `${m[1]} ${m[2]}% ${m[3]}`);

const deckUsage = await (await fetch(`${ORIGIN}/deck/usage`)).json() as
	{ account: string; source: string; ageSeconds: number | null; error: string | null; cells: { bucket: string; pct: number | null; delta: number | null }[] }[];
const deckCells = deckUsage.flatMap(u => u.cells.map(c => `${c.bucket} ${c.pct}% ${c.delta! >= 0 ? '+' : ''}${c.delta}`));

ok('usage is LIVE ×3 accounts and matches the rig\'s own `_summon_usage_delta` — 9 of 9 cells',
	deckUsage.length === 3 && deckUsage.every(u => u.source === 'live')
	&& rigCells.length === 9 && deckCells.length === 9 && rigCells.join(' | ') === deckCells.join(' | '),
	`rig  (summon-usage, its own keychain read and its own fetch): ${rigCells.join(' | ')}\n`
	+ `      deck (its own, ${deckUsage.map(u => Math.round(u.ageSeconds ?? -1) + 's').join('/')} before this line): ${deckCells.join(' | ')}\n`
	+ `      sources: ${deckUsage.map(u => `${u.account} ${u.source}`).join(' · ')} — not one of these came off a cache file`);

const shown = await evaluate<{ lines: string[]; chips: string[] }>(`(() => ({
	lines: [...document.querySelectorAll('#host-action .usage .uline')].map(l => l.textContent.replace(/\\s+/g, ' ').trim()),
	chips: [...document.querySelectorAll('#host-action .group[data-knob="account"] .btn')].map(b => b.textContent.replace(/\\s+/g, ' ').trim()),
}))()`);
ok('the number is rendered where accounts are chosen, with its age and its provenance (design law §3)',
	shown.chips.length === 3 && shown.chips.every(c => /\d+% [+-]\d+/.test(c))
	&& shown.lines.length === 3 && shown.lines.every(l => /live · \d+s old/.test(l)),
	`chips: ${shown.chips.join('  |  ')}\n      block: ${shown.lines.join('\n             ')}`);

// --- 3. a blocked fetch renders stale-with-age, and never invents ---
//
// Induced live rather than mocked: a second glass whose `USER` names nobody, so `security` finds no
// credential for any account. What comes back is the rig's own cache — labelled `cache`, aged,
// wearing the keychain's refusal — and not one figure is a zero.

const blindPort = PORT + 1;
const blind = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(blindPort), CENSUS_DIR: ROOT, USER: 'b17-no-such-user' },
	stdout: 'pipe', stderr: 'pipe',
});
try {
	await until('the blinded glass', async () => yes((await fetch(`http://127.0.0.1:${blindPort}/deck`)).ok), 120_000);
	const stale = await (await fetch(`http://127.0.0.1:${blindPort}/deck/usage`)).json() as typeof deckUsage;
	ok('a blocked fetch renders stale-with-age and never invents — the figures stand, wearing the refusal',
		stale.length === 3 && stale.every(u => u.source === 'cache' && u.error !== null && u.ageSeconds !== null)
		&& stale.every(u => u.cells.some(c => c.pct !== null)),
		`${stale.map(u => `${u.account}: ${u.source} ${Math.round(u.ageSeconds!)}s old · sess ${u.cells[0]!.pct}% · "${u.error}"`).join('\n      ')}`);
}
finally { blind.kill(); }

// --- 4. the City names the work: the stamp follows the BUILDING ---

await move('template', 'builder', c => c.summons.startsWith('You are a Builder'));
const chosen = await type('cwd', '~/code/agents', c => c.cwd === VENUE && c.stamp !== '');

ok('the stamp follows the BUILDING and the cwd is only the venue — the field report\'s own case, closed',
	chosen.building === BUILDING && chosen.theater === 'belvedere'
	&& chosen.cwd === VENUE && chosen.stamp.startsWith('builder-belvedere-'),
	`building ${chosen.building} → theater "${chosen.theater}" · venue ${chosen.cwd} · stamp ${chosen.stamp}\n`
	+ `      v0 read the venue for both and would have stamped after "${VENUE.split('/').at(-1)}" — this reads two knobs and stamps after the work`);

// --- 5. the ordinal reads all three sources: a census-only name is skipped ---

const inLog = (f: string) => {
	try { return (readFileSync(join(homedir(), 'code/agents', f), 'utf8').match(/builder-belvedere/g) ?? []).length; }
	catch { return 0; }
};
ok('the increment respects all three sources — the census-only name is counted and skipped (B7 F4)',
	chosen.stamp === 'builder-belvedere-78',
	`the fixture census carries ${INDUCED} on a transcript neither lineage log has ever seen\n`
	+ `      "builder-belvedere" in the rig's invocations.jsonl: ${inLog('summon/log/invocations.jsonl')}`
	+ ` · in the real hands audit: ${inLog('summon/log/census/hands.jsonl')} · in THIS run's audit: 0 (CENSUS_DIR is ${ROOT})\n`
	+ `      minted: ${chosen.stamp} — the two logs alone would have said builder-belvedere-01`);

// --- 6. knob → preview: three knobs, no reload ---

const before = chosen;
const effort = await move('effort', 'low', c => c.tier.endsWith('-low'));
const mantle = await move('mantle', 'Digger', c => c.stamp.startsWith('digger-'));
const account = await move('account', 'thg-fgreen', c => c.account === 'thg-fgreen');
const alive = await evaluate<{ marker: string; navs: number; now: number }>(
	`({ marker: window.__b17, navs: window.__navs, now: performance.getEntriesByType('navigation').length })`);

ok('knob → preview: effort, mantle and account each move the SUMMONS TEXT and the plan, with no reload',
	effort.tier !== before.tier && effort.summons !== before.summons && effort.summons.includes('-low.')
	&& mantle.summons.startsWith('You are a Digger') && mantle.color !== before.color
	&& account.account === 'thg-fgreen' && account.account !== before.account
	&& alive.marker === 'alive' && alive.navs === alive.now,
	`effort  : tier ${before.tier} → ${effort.tier} · summons "${before.summons.split('\n')[0]}" → "${effort.summons.split('\n')[0]}"\n`
	+ `      mantle  : stamp ${effort.stamp} → ${mantle.stamp} · color ${before.color} → ${mantle.color} · summons "${mantle.summons.split('\n')[0]}"\n`
	+ `      account : ${before.account} → ${account.account} (its own usage chip beside it)\n`
	+ `      the page marker survived all three and navigation entries stayed ${alive.navs} — one document throughout`);

// --- 7. the composer is the ONLY thing on this deck that can fire ---
//
// Two checks, because the obvious one is unsound here. B14/B15/B20 grep the rendered DOM for the
// hand's path and expect zero — which held only because their fixture cities never quoted it. This
// probe runs over the REAL city, where the belvedere Workshop renders belvedere's own board, and
// belvedere's own board writes `/hands/fire` in prose. So the question is not whether the string is
// on screen; it is whether any of it is **markup**. `outerHTML` minus `textContent` is exactly that
// difference, and it is the check that was always meant (B17 F2).

const bundle = await (await fetch(`${ORIGIN}/deck.js`)).text();
const clientSources = ['deck.client.ts', 'deck-dom.ts', 'workshop.client.ts', 'works.client.ts', 'composer.client.ts'];
const perSource = clientSources.map(f =>
	[f, (readFileSync(join(HERE, 'glass', f), 'utf8').match(/hands\/fire/g) ?? []).length] as const);
const elsewhere = await evaluate<{ attrs: number; inMarkup: number; asProse: number }>(`(() => {
	const hosts = ['host-context', 'host-drawer', 'host-focus'].map(id => document.getElementById(id));
	const count = (s) => s.split('hands/fire').length - 1;
	const html = hosts.map(h => count(h.outerHTML)).reduce((a, b) => a + b, 0);
	const text = hosts.map(h => count(h.textContent)).reduce((a, b) => a + b, 0);
	return {
		attrs: document.querySelectorAll('#host-context [data-fire], #host-drawer [data-fire], #host-focus [data-fire]').length,
		inMarkup: html - text, asProse: text,
	};
})()`);
ok('one file may fire, and it is the composer — every other client source is still zero (D10, B17 F1)',
	perSource.every(([f, n]) => (f === 'composer.client.ts' ? n >= 1 : n === 0))
	&& (bundle.match(/hands\/fire/g) ?? []).length >= 1
	&& elsewhere.attrs === 0 && elsewhere.inMarkup === 0,
	`sources: ${perSource.map(([f, n]) => `${f} ${n}×`).join(' · ')}\n`
	+ `      /deck.js is ${bundle.length} B and carries it ${(bundle.match(/hands\/fire/g) ?? []).length}× — from the composer and nowhere else\n`
	+ `      City + drawer + Focus: ${elsewhere.attrs} fire attributes and ${elsewhere.inMarkup}× in MARKUP;`
	+ ` the ${elsewhere.asProse}× on screen are the corpus quoting the path in its own prose (B17 F2)`);

const noSelect = await evaluate<number>(`document.querySelectorAll('select').length`);
ok('no dropdown anywhere on the composer — every choice is a toggled button group (design law §3)',
	noSelect === 0, `<select> in the whole document: ${noSelect}`);

// --- 8. the cost: the composer is off the poll ---

const times: number[] = [];
for (let i = 0; i < 12; i++) {
	const t0 = performance.now();
	await fetch(`${ORIGIN}/deck/compose`, {
		method: 'POST', headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ building: BUILDING, cwd: VENUE, mantle: 'Builder', model: 'haiku', effort: 'low', template: 'builder' }),
	});
	times.push(performance.now() - t0);
}
times.sort((a, b) => a - b);
const stateBody = await (await fetch(`${ORIGIN}/deck/state?b=${encodeURIComponent(BUILDING)}`)).text();
ok('the round trip is a gesture\'s price, not a clock\'s — and `/deck/state` is untouched by it',
	times[Math.floor(times.length * 0.95)]! < 500 && stateBody.length > 0,
	`POST /deck/compose (N=12): p50 ${times[6]!.toFixed(0)} ms · p95 ${times[Math.floor(times.length * 0.95)]!.toFixed(0)} ms · max ${times.at(-1)!.toFixed(0)} ms\n`
	+ `      /deck/state?b= is ${stateBody.length} B and still carries the Works' bill off the held copy — no fetch on the poll`);

// --- 9. one live fire, byte-exact, coloured per the map, named per the building ---

await move('mantle', 'Builder', c => c.stamp.startsWith('builder-belvedere-'));
await move('account', 'personal', c => c.account === 'personal');
await move('model', 'haiku', c => c.tier.startsWith('haiku'));
const armed = await move('effort', 'low', c => c.tier === 'haiku-low' && c.armed === 'yes');

// The box IS the preview, and the card states the sha of what will be delivered — so the chain has
// four links, not three: what is on screen, what the card claims about it, what the hand wrote, and
// what the session read.
const previewed = await evaluate<string>(`document.querySelector('#host-action textarea.summons-in').value`);
const pageSha = sha16(previewed);
const before9 = Date.now();

await evaluate(`document.querySelector('#host-action button.go').click()`);
const receipt = await until('the fire\'s receipt', async () => {
	const c = await card();
	return c && /^fired /.test(c.out) ? c.out : null;
}, 60_000);

const ref = receipt.match(/^fired (\S+)/)?.[1] ?? '';
const named = (await workspaces()).find(w => w.ref === ref) ?? null;
workspaceId = named?.id ?? null;                                // by uuid from here on (P6 F2)

// The transcript this account wrote for that venue, newest first — the first user turn is the summons.
const projects = join(ACCOUNT_DIR, 'projects', VENUE.replace(/[/_]/g, '-'));
const transcript = await until('the session\'s transcript', async () => {
	const files = readdirSync(projects).filter(f => f.endsWith('.jsonl'))
		.map(f => join(projects, f)).filter(f => statSync(f).mtimeMs > before9);
	for (const f of files) {
		const turn = readFileSync(f, 'utf8').split('\n')
			.map(l => { try { return JSON.parse(l) as Record<string, unknown>; } catch { return null; } })
			.find(r => r?.['type'] === 'user');
		const content = (turn?.['message'] as { content?: unknown } | undefined)?.content;
		if (typeof content === 'string') return { file: f, content };
	}
	return null;
}, 90_000);

ok('one live fire, end to end: the previewed bytes ARE the fired bytes ARE the first user turn',
	sha16(transcript.content) === pageSha && receipt.includes(pageSha) && armed.sha === pageSha
	&& armed.stamp === 'builder-belvedere-78' && named?.title === 'builder-belvedere-78'
	&& (named?.custom_color ?? '').toLowerCase() === '#0362b2',
	`in the box on screen  : ${Buffer.byteLength(previewed)} B · sha256 ${pageSha}\n`
	+ `      the card's own claim  : ${armed.bytes} B · sha256 ${armed.sha}\n`
	+ `      the hands' receipt    : ${receipt}\n`
	+ `      the transcript's turn : ${Buffer.byteLength(transcript.content)} B · sha256 ${sha16(transcript.content)} · ${transcript.file}\n`
	+ `      cmux says             : ref ${ref} · uuid ${named?.id} · title "${named?.title}" · color ${named?.custom_color}\n`
	+ `      the map says Builder is felikai blue #0362b2 (B18 F1's table), and the socket took it verbatim`);

// The ordinal it just spent is gone: the next mint has to move, or two sessions share one handle.
const after = await until('the next stamp', async () => {
	const c = await card();
	return c && c.stamp !== 'builder-belvedere-78' ? c.stamp : null;
}, 20_000);
ok('the stamp it spent is spent — the next mint moves on rather than handing the name out twice',
	after === 'builder-belvedere-79',
	`fired builder-belvedere-78, and the composer now previews ${after} (the audit it just wrote is the fourth reader of the lineage)`);

}
catch (e) {
	failures++;
	console.log(`FAIL  the probe itself threw\n      ${e instanceof Error ? e.message : String(e)}`);
	const seen = await evaluate<string>(`JSON.stringify({
		pulse: document.getElementById('pulse').textContent,
		fault: document.getElementById('pulse').dataset.fault,
		action: document.getElementById('host-action').textContent.slice(0, 400),
	})`).catch(err => `could not ask the page: ${String(err)}`);
	console.log(`      page says: ${seen}`);
}
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
