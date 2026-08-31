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
const HOME = 'belvedere';                                       // the workspace this building keeps (B22 §placement)

/**
 * `B17_INDUCE=throw` — the mid-run failure this probe's own cleanup is measured against (B22
 * candidate 3). It mints a marker workspace with **no command**, so no session is spawned and no
 * quota is spent, hands it to `shut()`'s own bookkeeping, and throws. A run in this mode must end
 * with the marker closed and the temp tree gone: the `finally` is what is under test, not the deck.
 */
const INDUCE = process.env.B17_INDUCE ?? '';

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
let surfaceId: string | null = null;

/**
 * Leave nothing behind (D55): the temp tree gone, and **exactly what this probe made** closed.
 *
 * The two are not the same gesture any more. An ignition that MINTED a workspace leaves a workspace
 * to close; one that LANDED in the workspace Felix keeps for the building leaves a tab — and closing
 * that workspace would take his other panes with it. So the surface is closed where there is one,
 * and the workspace only where the probe made it (B22 §placement, B25 §3).
 */
async function shut(): Promise<void> {
	if (surfaceId) console.log(`\n# closing tab ${surfaceId}: ${(await cmux('close-surface', '--surface', surfaceId)).out}`);
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

type WS = { id: string; ref: string; title: string; custom_color: string | null; current_directory?: string | null };
const workspaces = async (): Promise<WS[]> =>
	(JSON.parse((await cmux('workspace', 'list', '--json')).out) as { workspaces: WS[] }).workspaces;

/** One workspace's tabs, by uuid — `list-pane-surfaces --id-format both`, read the way the hand reads it. */
async function panes(workspace: string): Promise<{ uuid: string; title: string }[]> {
	const out = (await cmux('list-pane-surfaces', '--workspace', workspace, '--id-format', 'both')).out;
	return out.split('\n')
		.map(l => l.match(/\bsurface:\d+\s+([0-9A-Fa-f-]{36})\s+(.*?)(?:\s+\[selected\])?\s*$/))
		.filter((m): m is RegExpMatchArray => m !== null)
		.map(m => ({ uuid: m[1]!, title: m[2]!.trim() }));
}

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

// The induced mid-run failure (B22 candidate 3): a marker workspace with no command — no session,
// no quota — handed to the cleanup's bookkeeping, then a throw. What is under test is the `finally`.
if (INDUCE === 'throw') {
	const made = await cmux('workspace', 'create', '--name', 'b17-induced-failure', '--cwd', '/tmp', '--focus', 'false');
	const ref = made.out.match(/\bworkspace:\d+\b/)?.[0] ?? '';
	workspaceId = (await workspaces()).find(w => w.ref === ref)?.id ?? null;
	console.log(`# B17_INDUCE=throw — holding ${ref} / ${workspaceId}; throwing now`);
	throw new Error('induced mid-run failure — the workspace above must be closed by shut() in `finally`');
}
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

/**
 * **Compare per (account, bucket)** — B11 F8 + B16's addendum, ruled at G2, paid at B22.
 *
 * The comparison this replaces flattened both sides into nine ordered strings and joined them, so
 * what it actually asserted was *"the rig prints accounts and buckets in the deck's order"* — a
 * match by position, across accounts. Two ways that lies, and one of them is live today:
 *
 *  · **A null cell disappears.** The rig prints `sess —` for an account with no session window
 *    open (measured on `thg-doorbell` at this row), and a regex demanding `\d+%` skips it — eight
 *    cells against the deck's nine, so the check fails for a reason that is not disagreement.
 *  · **A reorder pairs the wrong account with the wrong number.** Nothing pins either side's
 *    ordering, and a usage figure attributed to the wrong silo is worse than no figure at all.
 *
 * So both sides are read into `account bucket → value` maps and compared key by key; a key present
 * on one side and absent on the other is a difference the report names rather than a length that
 * happens not to match.
 */
const rigOut = new TextDecoder().decode(rig.stdout);
const rigAccounts = new Map<string, string>();                      // "0" → "personal"
for (const m of rigOut.matchAll(/^\s*fetched\s+(\d+)\s+(\S+)\s*$/gm)) rigAccounts.set(m[1]!, m[2]!);

const cell = (pct: number | null, delta: number | null) =>
	`${pct === null ? '—' : `${pct}%`}${delta === null ? '' : `${delta >= 0 ? '+' : ''}${delta}`}`;

const rigCells = new Map<string, string>();
for (const line of rigOut.split('\n')) {
	const at = line.match(/^\s*(?:usage\s+)?(\d+)\s+(?:sess|week|fable)\b/);
	if (!at) continue;
	const account = rigAccounts.get(at[1]!);
	if (account === undefined) continue;
	for (const m of line.matchAll(/(sess|week|fable)\s+(—|-?\d+%)(?:\s*([+-]\d+))?/g))
		rigCells.set(`${account} ${m[1]}`, `${m[2]}${m[3] ?? ''}`);
}

const deckUsage = await (await fetch(`${ORIGIN}/deck/usage`)).json() as
	{ account: string; source: string; ageSeconds: number | null; error: string | null; cells: { bucket: string; pct: number | null; delta: number | null }[] }[];
const deckCells = new Map<string, string>();
for (const u of deckUsage) for (const c of u.cells) deckCells.set(`${u.account} ${c.bucket}`, cell(c.pct, c.delta));

const cellKeys = [...new Set([...rigCells.keys(), ...deckCells.keys()])].sort();
const disagree = cellKeys.filter(k => rigCells.get(k) !== deckCells.get(k));
const show = (m: Map<string, string>) => cellKeys.map(k => `${k} ${m.get(k) ?? 'ABSENT'}`).join(' | ');

ok('usage is LIVE ×3 accounts and matches the rig\'s own `_summon_usage_delta` — per (account, bucket), 9 of 9',
	deckUsage.length === 3 && deckUsage.every(u => u.source === 'live')
	&& cellKeys.length === 9 && disagree.length === 0,
	`keys compared (${cellKeys.length}, the union of both sides): ${cellKeys.join(', ')}\n`
	+ `      rig  (summon-usage, its own keychain read and its own fetch): ${show(rigCells)}\n`
	+ `      deck (its own, ${deckUsage.map(u => Math.round(u.ageSeconds ?? -1) + 's').join('/')} before this line): ${show(deckCells)}\n`
	+ `      disagreements: ${disagree.length === 0 ? 'none' : disagree.map(k => `${k}: rig ${rigCells.get(k) ?? 'ABSENT'} vs deck ${deckCells.get(k) ?? 'ABSENT'}`).join(' · ')}\n`
	+ `      sources: ${deckUsage.map(u => `${u.account} ${u.source}`).join(' · ')} — not one of these came off a cache file`);

const shown = await evaluate<{ lines: string[]; chips: string[] }>(`(() => ({
	lines: [...document.querySelectorAll('#host-action .usage .uline')].map(l => l.textContent.replace(/\\s+/g, ' ').trim()),
	chips: [...document.querySelectorAll('#host-action .group[data-knob="account"] .btn')].map(b => b.textContent.replace(/\\s+/g, ' ').trim()),
}))()`);
// A chip carries a figure **or an honest absence**: an account with no session window open reads
// `—`, which is what the rig itself prints (measured on `thg-doorbell` at B22). Demanding `\d+%`
// of every chip asserted that Felix always has three windows open, which is not a law of anything.
ok('the number is rendered where accounts are chosen, with its age and its provenance (design law §3)',
	shown.chips.length === 3 && shown.chips.every(c => /\d+% [+-]\d+|—/.test(c))
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
// belvedere's own board writes `/hands/ignite` in prose. So the question is not whether the string is
// on screen; it is whether any of it is **markup**. `outerHTML` minus `textContent` is exactly that
// difference, and it is the check that was always meant (B17 F2).

const bundle = await (await fetch(`${ORIGIN}/deck.js`)).text();
const clientSources = ['deck.client.ts', 'deck-dom.ts', 'workshop.client.ts', 'works.client.ts', 'composer.client.ts'];
const perSource = clientSources.map(f =>
	[f, (readFileSync(join(HERE, 'glass', f), 'utf8').match(/hands\/ignite/g) ?? []).length] as const);
const elsewhere = await evaluate<{ attrs: number; inMarkup: number; asProse: number }>(`(() => {
	const hosts = ['host-context', 'host-drawer', 'host-focus'].map(id => document.getElementById(id));
	const count = (s) => s.split('hands/ignite').length - 1;
	const html = hosts.map(h => count(h.outerHTML)).reduce((a, b) => a + b, 0);
	const text = hosts.map(h => count(h.textContent)).reduce((a, b) => a + b, 0);
	return {
		attrs: document.querySelectorAll('#host-context [data-ignite], #host-drawer [data-ignite], #host-focus [data-ignite]').length,
		inMarkup: html - text, asProse: text,
	};
})()`);
ok('one file may ignite, and it is the composer — every other client source is still zero (D10, B17 F1)',
	perSource.every(([f, n]) => (f === 'composer.client.ts' ? n >= 1 : n === 0))
	&& (bundle.match(/hands\/ignite/g) ?? []).length >= 1
	&& elsewhere.attrs === 0 && elsewhere.inMarkup === 0,
	`sources: ${perSource.map(([f, n]) => `${f} ${n}×`).join(' · ')}\n`
	+ `      /deck.js is ${bundle.length} B and carries it ${(bundle.match(/hands\/ignite/g) ?? []).length}× — from the composer and nowhere else\n`
	+ `      City + drawer + Focus: ${elsewhere.attrs} ignite attributes and ${elsewhere.inMarkup}× in MARKUP;`
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

// --- 9. one live ignition, byte-exact, landing in the workspace Felix keeps for this building ---

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

// The home as it stands BEFORE the ignition: B22's placement bar is that this ignition joins it
// rather than opening a sixteenth workspace beside it, so the count is taken first.
const allBefore = await workspaces();
const countBefore = allBefore.length;
const homesBefore = allBefore.filter(w => w.title === HOME);

await evaluate(`document.querySelector('#host-action button.go').click()`);

/**
 * **The receipt is read out of the audit, not off the card.** A successful ignition calls
 * `swap.to('chat')` in the same breath as it says its receipt (C16 §1, *"summoning swaps in the
 * Chat"*), so the composer's card is gone by the next poll — and the run this probe made at B22
 * timed out waiting for a message that had been on screen for a few frames. The audit is the hand's
 * own word for the same event, it is durable, and it is what the DoD cites anyway.
 */
const ignition = await until('the ignition\'s audit line', async () => {
	const lines = readFileSync(join(ROOT, 'hands.jsonl'), 'utf8').trim().split('\n')
		.map(l => { try { return JSON.parse(l) as { action: string; ok: boolean; args: Record<string, unknown>; result: unknown }; } catch { return null; } });
	return lines.find(l => l?.action === 'ignite' && l.ok) ?? null;
}, 90_000);
const landed = ignition.result as { workspace: string; minted: boolean; home: string | null; surface: string | null; sha: string | null; bytes: number };
const receipt = JSON.stringify(landed);

const wsUuid = landed.workspace;
const sfUuid = landed.surface;
const after9 = await workspaces();
const named = after9.find(w => w.id === wsUuid) ?? null;
// **The cleanup follows the landing.** A surface this probe added to a workspace of Felix's is
// closed; his workspace is not. Only a workspace the probe MINTED is ever closed (D55, B25 §3).
surfaceId = sfUuid;
workspaceId = sfUuid === null ? (named?.id ?? null) : null;

const tabs = await panes(wsUuid);

ok('placement: the ignition landed in the `belvedere` workspace Felix already keeps — by uuid, no mint (B22 candidate 6)',
	homesBefore.length === 1 && named !== null && named.id === homesBefore[0]!.id
	&& sfUuid !== null && after9.filter(w => w.title === HOME).length === 1
	&& tabs.some(t => t.uuid === sfUuid && t.title === armed.stamp),
	`before        : ${homesBefore.length} workspace(s) named "${HOME}" — ${homesBefore.map(w => `${w.ref}/${w.id}`).join(', ') || 'none'}\n`
	+ `      receipt       : ${receipt}\n`
	+ `      landed in     : ${named?.ref} / ${named?.id} "${named?.title}" (cwd ${named?.current_directory ?? '—'})\n`
	+ `      as tab        : ${sfUuid} named "${tabs.find(t => t.uuid === sfUuid)?.title ?? '—'}" — the workspace wears the building, the tab wears the stamp\n`
	+ `      after         : ${after9.filter(w => w.title === HOME).length} workspace(s) named "${HOME}", ${after9.length} workspaces in total (was ${countBefore})\n`
	+ `      every id above is a uuid: the receipt carries no \`workspace:N\` (P6 F2, the UUID law)`);

ok('the receipt is uuid-only — no ref past the breath that made it (B22 candidate 2)',
	!/\b(?:workspace|surface|pane):\d+\b/.test(receipt),
	`receipt: ${receipt}\n      searched for \`workspace:N\`/\`surface:N\`/\`pane:N\` and found none`);

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

ok('one live ignition, end to end: the previewed bytes ARE the ignited bytes ARE the first user turn',
	sha16(transcript.content) === pageSha && landed.sha === pageSha && armed.sha === pageSha,
	`in the box on screen  : ${Buffer.byteLength(previewed)} B · sha256 ${pageSha}\n`
	+ `      the card's own claim  : ${armed.bytes} B · sha256 ${armed.sha}\n`
	+ `      the hands' receipt    : ${receipt}\n`
	+ `      the transcript's turn : ${Buffer.byteLength(transcript.content)} B · sha256 ${sha16(transcript.content)} · ${transcript.file}\n`
	+ `      the stamp it wore     : ${armed.stamp}`);

// The audit is where the ignition's knowledge of the building survives — it is half of the housing
// join, and a line without `building` houses the session by its cwd forever (B22 §the ignited-for join).
const auditLines = readFileSync(join(ROOT, 'hands.jsonl'), 'utf8').trim().split('\n')
	.map(l => JSON.parse(l) as { action: string; ok: boolean; args: Record<string, unknown>; result: unknown });
const igResult = landed;
ok('the audit records the building it ignited FOR, and the uuids it drove (B22 candidates 2 + 6)',
	ignition.args['building'] === BUILDING && ignition.args['stamp'] === armed.stamp
	&& igResult.workspace === wsUuid && igResult.minted === false && igResult.home === HOME
	&& !JSON.stringify(auditLines).match(/\b(?:workspace|surface|pane):\d+\b/),
	`audit line    : ${JSON.stringify(ignition)}\n`
	+ `      the join it makes: stamp "${armed.stamp}" → building "${ignition.args['building']}" (the census will read that stamp off the transcript)\n`
	+ `      refs anywhere in the whole audit (${auditLines.length} lines): ${(JSON.stringify(auditLines).match(/\b(?:workspace|surface|pane):\d+\b/g) ?? ['none']).join(', ')}`);

// The ordinal it just spent is gone: the next mint has to move, or two sessions share one handle.
const spent = armed.stamp;
const nextOrdinal = String(Number(spent.slice(-2)) + 1).padStart(2, '0');
const after = await until('the next stamp', async () => {
	const c = await card();
	return c && c.stamp !== spent ? c.stamp : null;
}, 20_000);
ok('the stamp it spent is spent — the next mint moves on rather than handing the name out twice',
	after === spent.slice(0, -2) + nextOrdinal,
	`ignited ${spent}, and the composer now previews ${after} (the audit it just wrote is the fourth reader of the lineage)`);

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
