// B20's DoD, driven in a real browser — B13's harness, reused as it was written to be (B13 F1).
//
// Everything here is a *browser* fact: a code word on the board resolving into its object on hover,
// a tooltip whose own body decodes, a chain three deep and no deeper, a constructed cycle going
// plain at the repeat, a jump landing on a line, and a countersign gesture whose previewed bytes
// are byte-identical to the line it appends. Everything that is a pure function lives in
// `glass/decode.test.ts` and `glass/decoder.test.ts` instead.
//
//    bun belvedere/lab/b20/probe.ts
//
// It stands up its OWN glass on a probe port against a temp census and a **copy** of
// `lab/b20/city`, so nothing outside the temp directory is read as truth or written at all — the
// countersign it fires lands in the copy's inbox and is diffed there. The live-corpus half (the
// commissioning hover over the real canon board) is `live.ts`.

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4495;
const CDP_PORT = 9339;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const POLL_MS = 3000;                                          // must match `deck.client.ts`
const HOLD_MS = 450;                                           // must match TIP_HOLD_MS

const ROOT = mkdtempSync(join(tmpdir(), 'b20-probe-'));
const CENSUS = join(ROOT, 'census.jsonl');
const PROFILE = join(ROOT, 'chrome');
const CITY = join(ROOT, 'city');
const SHOP = join(CITY, 'nb/shop');
const INBOX = join(SHOP, 'ISSUES.md');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

Bun.spawnSync(['cp', '-R', join(HERE, 'lab/b20/city'), CITY]);

const beat = (o: Record<string, unknown>) => JSON.stringify({
	t: Date.now() / 1000, acct: '/Users/felix/.claude', pid: String(process.pid), ...o,
}) + '\n';

writeFileSync(CENSUS, [
	beat({ ev: 'PreToolUse', sid: 'shop-working', cwd: SHOP, ws: 'W-shop', sf: 'S-shop', tool: 'Write' }),
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
	// `BELVEDERE_ENV` at a path that does not exist: an armed test process drives Felix's real
	// desktop (B18's closing note), and this probe has no business near the socket.
	env: { ...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: ROOT, GLASS_CITY: CITY, BELVEDERE_ENV: join(ROOT, 'no-credential-here') },
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

async function openBuilding(name: string): Promise<void> {
	await evaluate(`[...document.querySelectorAll('#host-context .row[data-building]')]
		.find(r => r.dataset.building.endsWith('/${name}')).click()`);
	await until(`the Workshop to open ${name}`, async () => await evaluate<boolean>(
		`(document.querySelector('#host-focus .ws-head .big')?.textContent ?? '').endsWith('/${name}')`), POLL_MS * 2);
	await settle();
}

/**
 * Hover a code word and hold — the primitive's own two gestures, dispatched as the browser's own
 * events so the shell's real listeners run. `sel` picks the anchor; `layer` is which tooltip box
 * the anchor lives in (0 = the page).
 */
const HOVER = (sel: string) => `(async () => {
	const el = ${sel};
	if (!el) throw new Error('no anchor for ${sel.replace(/'/g, "\\'")}');
	el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
	await new Promise(r => setTimeout(r, ${HOLD_MS + 250}));
	return true;
})()`;

/** Read a tooltip box: layer 0 is `#tip`, deeper layers carry `data-layer`. */
const TIP = (layer: number) => layer === 0 ? `document.getElementById('tip')` : `document.querySelector('.tip[data-layer="${layer}"]')`;

const readTip = (layer: number) => `(() => {
	const t = ${TIP(layer)};
	if (!t || t.hidden) return null;
	return {
		line: t.querySelector('.tip-line')?.textContent ?? '',
		id: t.querySelector('.dw-id')?.textContent ?? '',
		name: t.querySelector('.dw-name')?.textContent ?? '',
		status: t.querySelector('.tip-status')?.textContent ?? '',
		body: t.querySelector('.tip-more')?.textContent ?? '',
		acts: [...t.querySelectorAll('.tip-actions button')].map(b => b.textContent),
		words: [...t.querySelectorAll('.dw')].map(w => w.textContent),
		cands: [...t.querySelectorAll('.cand')].map(c => c.textContent),
		decoded: t.dataset.decoded ?? '',
		preview: t.querySelector('.preview')?.textContent ?? '',
		gestures: [...t.querySelectorAll('.tip-gesture')].length,
		fire: (t.outerHTML.match(/hands\\/fire|data-fire|data-apply/g) || []).length,
	};
})()`;

type Tip = {
	line: string; id: string; name: string; status: string; body: string; acts: string[];
	words: string[]; cands: string[]; decoded: string; preview: string; gestures: number; fire: number;
};

// ---------- the run ----------

try {

	await until('the glass', async () => (await fetch(DECK)).ok);
	await attach();
	await ready();
	await evaluate(SET('context', 'expanded'));
	await evaluate(SET('focus', 'expanded'));
	await settle();

	console.log(`\n# B20 — the decoder, measured in Chrome (window 1600×900)\n`);
	console.log(`glass: ${DECK}   census: ${CENSUS}   city: ${CITY}\n`);

	await openBuilding('shop');

	// --- 1. hover `B18` on the rendered board ---

	const B18 = `document.querySelector('#host-focus .ws-row[data-row="B18"] .rid .dw')`;
	await evaluate(HOVER(B18));
	const b18 = await evaluate<Tip>(readTip(0));
	ok('hovering `B18` on the board resolves the row: encapsulation, status head, jump to its plan',
		b18 !== null && b18.id === 'B18' && b18.name === 'Live identity'
		&& b18.status.startsWith('LANDED · Builder · opus-high')
		&& b18.acts.some(a => a === 'the plan') && b18.acts.some(a => a.startsWith('open ')),
		`tooltip line "${b18?.id} ${b18?.name}" · status "${b18?.status}"\n`
		+ `      body "${(b18?.body ?? '').slice(0, 120)}…"\n`
		+ `      actions [${(b18?.acts ?? []).join(' | ')}]`);

	// --- 2. the tooltip's own body decodes, and the chain goes three deep and no further ---

	const inTip = (layer: number, word: string) =>
		`[...${TIP(layer)}.querySelectorAll('.dw')].find(w => w.textContent === '${word}')`;

	await evaluate(HOVER(inTip(0, 'D2')));
	const l1 = await evaluate<Tip>(readTip(1));
	await evaluate(HOVER(inTip(1, '§5')));
	const l2 = await evaluate<Tip>(readTip(2));
	const l3 = await evaluate<{ boxes: number; deepest: string[] }>(`(() => ({
		boxes: 1 + document.querySelectorAll('.tip[data-layer]').length,
		deepest: [...document.querySelector('.tip[data-layer="2"]').querySelectorAll('.dw')].map(w => w.textContent),
	}))()`);
	ok('tooltips nest — depth 2 measured, and depth 3 is the cap: the deepest body draws no spans at all',
		l1 !== null && l1.id === 'D2' && l1.name === 'Venue'
		&& l2 !== null && l2.id === '§5' && l2.name === 'The cycle'   // D2's OWN doc, not B18's board
		&& l3.boxes === 3 && l3.deepest.length === 0,
		`layer 1 (from B18's record): "${l1?.id} ${l1?.name}" · ${l1?.status}\n`
		+ `      layer 2 (from D2's body): "${l2?.id} ${l2?.name}" · ${l2?.status}\n`
		+ `      ${l3.boxes} tooltip boxes open; layer 2's own body carries ${l3.deepest.length} decoder spans — the cap is where the spans are MADE, so there is no fourth layer to refuse`);

	// --- 3. the cycle: a word already open in the chain renders as plain text ---

	const cycle = await evaluate<{ layer1Words: string[]; b18InBody: boolean; plain: boolean }>(`(() => {
		const box = document.querySelector('.tip[data-layer="1"]');
		const body = box.querySelector('.tip-more');
		return {
			layer1Words: [...box.querySelectorAll('.dw')].map(w => w.textContent),
			b18InBody: body.textContent.includes('B18'),
			plain: ![...box.querySelectorAll('.dw')].some(w => w.textContent === 'B18'),
		};
	})()`);
	ok('a constructed cycle renders plain at the repeat — B18 → D2 → B18, and the third is a word',
		cycle.b18InBody && cycle.plain,
		`D2's body says "…the ruling B18 landed under…" — the text is there (${cycle.b18InBody}) and it is NOT a control\n`
		+ `      decoder spans in that tooltip: [${cycle.layer1Words.join(', ')}] — B18 is absent from the list`);

	// --- 4. context scope: local D2, canon D63, and D99 unresolved with candidates named ---

	await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
	const B20ROW = `document.querySelector('#host-focus .ws-row[data-row="B20"]')`;
	await evaluate(HOVER(`${B20ROW}.querySelector('.encap-box details') ? (${B20ROW}.querySelector('details').open = true, ${B20ROW}.querySelector('.prose .dw')) : ${B20ROW}.querySelector('.prose .dw')`));
	const local = await evaluate<Tip>(readTip(0));
	await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
	await evaluate(HOVER(`[...${B20ROW}.querySelectorAll('.dw')].find(w => w.textContent === 'D63')`));
	const canon = await evaluate<Tip>(readTip(0));
	await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
	await evaluate(HOVER(`[...document.querySelectorAll('#host-focus .ws-row[data-row="B18"] .dw')].find(w => w.textContent === 'D99')`));
	const missing = await evaluate<Tip>(readTip(0));
	ok('context-scoped: a `D2` here is this building’s, a `D63` is canon’s, a `D99` is nobody’s and says so',
		local !== null && local.id === 'D2' && local.status.includes('nb/shop')
		&& canon !== null && canon.id === 'D63' && canon.name === 'The schema fold' && canon.status.includes('/agents')
		&& missing !== null && missing.decoded === 'no' && missing.cands.length === 2,
		`D2  → ${local?.name} · ${local?.status}\n`
		+ `      D63 → ${canon?.name} · ${canon?.status}\n`
		+ `      D99 → "${missing?.line}" · ${missing?.body}\n`
		+ `      candidates named: [${(missing?.cands ?? []).join(' | ')}]`);

	// --- 5. `§5` resolves to THIS document's §5 and jumps line-anchored ---

	await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
	// The `§5` written in B20's landing record: it is in README.md, so it is README.md's §5 — while
	// the same building's DECISIONS.md has a §5 of its own with a different heading, which the
	// nesting test above resolved from the other side. One symbol, two scopes, no guessing.
	await evaluate(HOVER(`[...document.querySelectorAll('#host-focus [data-sec="board"] .dw')].find(w => w.textContent === '§5')`));
	const section = await evaluate<Tip>(readTip(0));
	const jumped = await evaluate<{ line: string; marked: number; text: string; name: string }>(`(async () => {
		document.querySelector('#tip .tip-actions button').click();
		for (let i = 0; i < 60 && !document.querySelector('#host-focus .dl[data-mark="yes"]'); i++)
			await new Promise(r => setTimeout(r, 100));
		const mark = document.querySelector('#host-focus .dl[data-mark="yes"]');
		return {
			line: mark.dataset.line,
			marked: document.querySelectorAll('#host-focus .dl[data-mark="yes"]').length,
			text: mark.querySelector('.lt').textContent,
			name: document.querySelector('#host-focus .doc-name').textContent,
		};
	})()`);
	ok('`§5` resolves to the §5 of the document it was WRITTEN in, and the jump lands on that heading line',
		section !== null && section.name === 'Working agreements' && jumped.marked === 1 && jumped.text.startsWith('## 5.'),
		`hovered the §5 written inside B20's landing record → "${section?.id} ${section?.name}" · ${section?.status}\n`
		+ `      (the same building's DECISIONS.md has a §5 too, called "The cycle" — scope decided which, not proximity)\n`
		+ `      jump opened ${jumped.name} with exactly ${jumped.marked} line marked: ${jumped.line} — "${jumped.text}"`);

	// --- 6. THE COMMISSIONING HOVER: `canon row 17` in rendered prose ---

	await evaluate(`document.querySelector('#host-focus .doc-h button').click()`);
	await settle();
	await evaluate(HOVER(`[...document.querySelectorAll('#host-focus [data-sec="issues"] .dw')].find(w => w.textContent === 'row 17')`));
	const commissioning = await evaluate<Tip>(readTip(0));
	ok('THE COMMISSIONING HOVER — "canon row 17" in prose resolves to the canon board’s row 17',
		commissioning !== null && commissioning.id === 'row 17'
		&& commissioning.name === 'the storage experiment' && commissioning.status.startsWith('OPEN · Digger · fable-high'),
		`Felix's own phrase, rendered in an inbox entry: hovering "row 17" gives\n`
		+ `      "${commissioning?.id}" → ${commissioning?.name} · ${commissioning?.status}\n`
		+ `      body "${(commissioning?.body ?? '').slice(0, 100)}…"`);

	// --- 7. a bare `row 14` in a canon document resolves locally ---

	await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
	await openBuilding('agents');
	await evaluate(HOVER(`[...document.querySelectorAll('#host-focus [data-sec="issues"] .dw')].find(w => w.textContent === 'row 14')`));
	const bare = await evaluate<Tip>(readTip(0));
	ok('a bare `row 14` in a canon document resolves locally — no keyword needed on home ground',
		bare !== null && bare.id === 'row 14' && bare.name === 'summon rig' && bare.status.startsWith('OPEN · Builder'),
		`the canon inbox says "narrower than row 14" — "than" names no building, so the local board answers:\n`
		+ `      "${bare?.id}" → ${bare?.name} · ${bare?.status} · ${bare?.body.slice(0, 80)}`);

	// --- 8. the countersign gesture: previewed bytes, then the exact line appended ---

	await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
	await openBuilding('shop');
	await evaluate(HOVER(`[...document.querySelectorAll('#host-focus [data-sec="decisions"] .rid .dw')].find(w => w.textContent === 'D2')`));
	const gesture = await evaluate<Tip>(readTip(0));
	const inboxBefore = readFileSync(INBOX, 'utf8');
	const filed = await evaluate<string>(`(async () => {
		[...document.querySelectorAll('#tip .tip-gesture button')].find(b => b.textContent.startsWith('countersign')).click();
		for (let i = 0; i < 80; i++) {
			const out = document.querySelector('#tip .out');
			if (out && out.textContent.startsWith('filed')) return out.textContent;
			await new Promise(r => setTimeout(r, 100));
		}
		return document.querySelector('#tip .out')?.textContent ?? 'no receipt';
	})()`);
	const inboxAfter = readFileSync(INBOX, 'utf8');
	const added = inboxAfter.slice(inboxBefore.length);
	ok('a pending countersign carries the gesture, previews the exact bytes, and appends exactly those',
		gesture !== null && gesture.gestures === 2 && gesture.fire === 0
		&& added.includes(gesture.preview) && inboxAfter.startsWith(inboxBefore)
		&& filed.startsWith('filed'),
		`tooltip preview:  ${JSON.stringify(gesture?.preview)}\n`
		+ `      receipt:          ${filed}\n`
		+ `      inbox diff (${inboxBefore.length} B → ${inboxAfter.length} B, append-only: ${inboxAfter.startsWith(inboxBefore)}):\n`
		+ added.split('\n').filter(l => l !== '').map(l => `      + ${l}`).join('\n')
		+ `\n      fire wiring anywhere in that tooltip: ${gesture?.fire}`);

	// --- 9. code blocks and fenced kickoffs carry zero decoder spans ---

	await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
	const sacred = await evaluate<{ summons: number; inside: number; codes: number; inCode: number; text: string; words: number }>(`(() => {
		const pres = [...document.querySelectorAll('#host-focus pre.summons')];
		const codes = [...document.querySelectorAll('#host-focus code')];
		return {
			summons: pres.length,
			inside: pres.reduce((n, p) => n + p.querySelectorAll('.dw').length, 0),
			codes: codes.length,
			inCode: codes.reduce((n, c) => n + c.querySelectorAll('.dw').length, 0),
			text: (pres[0]?.textContent ?? '').replace(/\\n/g, ' ⏎ ').slice(0, 150),
			words: document.querySelectorAll('#host-focus .dw').length,
		};
	})()`);
	ok('a fenced kickoff and every code tick stay byte-sacred — zero decoder spans inside them',
		sacred.summons >= 1 && sacred.inside === 0 && sacred.codes >= 1 && sacred.inCode === 0 && sacred.words > 10,
		`${sacred.summons} fenced kickoff(s) rendered, carrying B20/§5/D63 in their text: "${sacred.text}"\n`
		+ `      decoder spans inside them: ${sacred.inside} · inside ${sacred.codes} code ticks: ${sacred.inCode}\n`
		+ `      decoder spans elsewhere in the same pane: ${sacred.words}`);

	// --- 10. three surfaces, one seam: City, Workshop, drawer queue ---

	await evaluate(`document.getElementById('drawer-toggle').click()`);
	await settle();
	const queueWords = await evaluate<{ names: string[]; total: number }>(`(() => {
		for (const d of document.querySelectorAll('#host-drawer details.more')) d.open = true;
		return {
			names: [...document.querySelectorAll('#host-drawer .qname .dw')].map(w => w.textContent),
			total: document.querySelectorAll('#host-drawer .dw').length,
		};
	})()`);
	await evaluate(`document.getElementById('drawer-shut').click()`);
	await settle();
	await evaluate(HOVER(`document.querySelector('#host-context .row[data-building]')`));
	const cityTip = await evaluate<Tip>(readTip(0));
	const workshopWords = await evaluate<number>(`document.querySelectorAll('#host-focus .dw').length`);
	ok('three surfaces decode off ONE seam — the City’s tooltip, the Workshop’s prose, the drawer’s queue',
		queueWords.total > 0 && queueWords.names.length > 0 && cityTip !== null && cityTip.words.length > 0 && workshopWords > 10,
		`drawer queue: ${queueWords.total} decoder spans, ${queueWords.names.length} of them in item names [${queueWords.names.join(', ')}]\n`
		+ `      City tooltip: "${cityTip?.line}" → its body names what wants him, and decodes [${(cityTip?.words ?? []).join(', ')}]\n`
		+ `      Workshop pane: ${workshopWords} decoder spans`);

	// --- 11. zero fire wiring, everywhere the decoder touches ---

	await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
	const wiring = await evaluate<{ attrs: number; text: number }>(`(() => ({
		attrs: document.querySelectorAll('[data-fire],[data-apply],[data-worktree],[data-summons]').length,
		text: (document.documentElement.outerHTML.match(/hands\\/fire/g) || []).length,
	}))()`);
	const bundle = await (await fetch(`${ORIGIN}/deck.js`)).text();
	const inBundle = (bundle.match(/hands\/fire/g) || []).length;
	const inSource = ['glass/decode.ts', 'glass/decoder.ts', 'glass/deck-dom.ts'].map(f =>
		`${f}: ${(readFileSync(join(HERE, f), 'utf8').match(/hands\/fire/g) || []).length}`);
	// **Narrowed at B17, and strictly stronger.** The Action pane now holds the composer, which is the
	// one surface on the deck that may fire (keel §3), so `/deck.js` carries that path exactly once. The
	// invariant this check protects never changed — *nothing in these panes may reach it* — so it moved
	// from "the bundle contains it zero times" to "which SOURCE contains it", which names the one file
	// allowed to instead of counting a string. Reasoning at the assertion, per B6's precedent.
	const ONLY = 'composer.client.ts';
	const sources = ['deck.client.ts', 'deck-dom.ts', 'workshop.client.ts', 'works.client.ts', ONLY]
		.map(f => [f, (readFileSync(join(HERE, 'glass', f), 'utf8').match(/hands\/fire/g) ?? []).length] as const);
	const onlyComposer = sources.every(([f, n]) => (f === ONLY ? n >= 1 : n === 0));
	ok('ZERO fire wiring in the decoder — and the composer is the only source that fires (D10: tooltips gesture, they never fire)',
		wiring.attrs === 0 && wiring.text === 0 && onlyComposer,
		`DOM: 0 of [data-fire, data-apply, data-worktree, data-summons]; "hands/fire" ${wiring.text}× in the document\n`
		+ `      ${inSource.join(' · ')} · /deck.js is ${bundle.length} B and carries it ${inBundle}×\n`
		+ `      per source: ${sources.map(([f, n]) => `${f} ${n}×`).join(' · ')}`);

	// --- 12. B18's own controls survive the primitive becoming a stack ---
	//
	// The tooltip was one box and is now three; B18's rename/recolor controls live inside it, and its
	// probe cannot be re-run casually because it drives Felix's real desktop. So the regression is
	// checked here instead, where it costs nothing: the controls RENDER on a session's expanded
	// tooltip. Nothing is clicked — this glass is unarmed and every hand would answer 503.

	await evaluate(HOVER(`document.querySelector('#host-focus .ws-session')`));
	const b18controls = await evaluate<{ input: number; swatches: number; name: string; more: string }>(`(() => {
		const t = document.getElementById('tip');
		return {
			input: t.querySelectorAll('.tip-input').length,
			swatches: t.querySelectorAll('.swatch-btn').length,
			name: t.querySelector('.tip-line')?.textContent ?? '',
			more: (t.querySelector('.tip-more')?.textContent ?? '').slice(0, 90),
		};
	})()`);
	ok('B18’s rename/recolor controls survive the tooltip becoming a stack (checked here, not on his desktop)',
		b18controls.input === 1 && b18controls.swatches > 0,
		`a session's expanded tooltip still carries ${b18controls.input} rename input and ${b18controls.swatches} swatches\n`
		+ `      head "${b18controls.name}" · depth "${b18controls.more}…"`);
	await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

	// --- 13. the cost: a hover is one localhost round trip, and it is cached ---

	const cost = await evaluate<{ first: number; second: number; calls: number }>(`(async () => {
		const t0 = performance.now();
		const a = await fetch('/deck/decode?t=B18&in=' + encodeURIComponent('${SHOP}/README.md'));
		await a.json();
		const first = performance.now() - t0;
		const t1 = performance.now();
		const b = await fetch('/deck/decode?t=D63&in=' + encodeURIComponent('${SHOP}/README.md'));
		await b.json();
		return {
			first, second: performance.now() - t1,
			calls: performance.getEntriesByType('resource').filter(e => e.name.includes('/deck/decode')).length,
		};
	})()`);
	ok('resolution is lazy and cheap — nothing is resolved until it is hovered',
		cost.first < 500 && cost.second < 500,
		`a cold /deck/decode is ${cost.first.toFixed(1)} ms, the next ${cost.second.toFixed(1)} ms; `
		+ `${cost.calls} decode requests in this whole session (one per distinct word hovered, then cached client-side)`);

}
catch (e) {
	failures++;
	console.log(`FAIL  the probe itself threw\n      ${e instanceof Error ? e.message : String(e)}`);
	const seen = await evaluate<string>(`JSON.stringify({
		pulse: document.getElementById('pulse').textContent,
		fault: document.getElementById('pulse').dataset.fault,
		focusHead: document.getElementById('host-focus').textContent.slice(0, 200),
		words: [...document.querySelectorAll('#host-focus .dw')].map(w => w.textContent).slice(0, 20),
		tips: document.querySelectorAll('.tip').length,
	})`).catch(err => `could not ask the page: ${String(err)}`);
	console.log(`      page says: ${seen}`);
}
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
