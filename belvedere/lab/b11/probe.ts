// B11's paper half: **everything the arm refuses, and the one arm that is safe to press.**
//
//    bun belvedere/lab/b11/probe.ts
//
// It stands up its own glass on a probe port against a temp census, a temp flows dir and a temp
// fixture city, so nothing outside that directory is read as truth or written at all — the real
// `belvedere/flows/` is never the flows dir here, and the real census is never appended to. The one
// flow it arms **from the page, in a real browser** is a single step gated on a Felix-card, so the
// arm is proven end to end and the engine's answer is a pause rather than a spawn.
//
// The fires live next door and are deliberately separate runs:
//   `lab/b11/smoke.ts` — the three-step chain, two real sessions, one Felix-card
//   `lab/b11/lever.ts` — D10, HALT, amend + re-arm and the timeout, on one live session

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { attach, evaluate, launchChrome, openWorks, SET, settle, until } from './cdp';

const HERE = join(import.meta.dir, '../..');                   // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4491, COLD_PORT = 4492, CDP_PORT = 9335;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const POLL_MS = 3000;

const ROOT = mkdtempSync(join(tmpdir(), 'b11-probe-'));
const CENSUS = join(ROOT, 'census');
const CITY = join(ROOT, 'city');
const FLOWS = join(ROOT, 'flows');
const BUILDING = join(CITY, 'nb/engine');
const REFUSED = join(CITY, 'nb/refused');
const COLD = join(ROOT, 'cold-repo');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

// ---------- the fixture city, written rather than copied: every byte here is the test's ----------

mkdirSync(join(BUILDING, 'plans'), { recursive: true });
mkdirSync(join(REFUSED, 'plans'), { recursive: true });
mkdirSync(FLOWS, { recursive: true });
mkdirSync(join(CENSUS, 'flows'), { recursive: true });
mkdirSync(COLD, { recursive: true });
Bun.spawnSync(['git', 'init', '-q', COLD]);                    // a repo is cold on every account (B7 F1)

const board = (dir: string, name: string, rows: string) => writeFileSync(join(dir, 'README.md'),
	`# ${name} — a fixture building\n\nNothing here is real work; \`lab/\` is disposable by DOCTRINE §3.\n\n`
	+ `| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n${rows}\n`);

board(BUILDING, 'engine', '| G | [The gate](plans/g.md) — the one step this probe arms | — | Architect · fable-high | OPEN |');
board(REFUSED, 'refused', '| R | [The refused](plans/r.md) — flows nothing may arm | — | Builder · opus-high | OPEN |');
writeFileSync(join(BUILDING, 'plans/g.md'), '# G\n\nThe gate.\n');
writeFileSync(join(REFUSED, 'plans/r.md'), '# R\n\nThe refused.\n');

const flow = (name: string, body: Record<string, unknown>) =>
	writeFileSync(join(FLOWS, `${name}.flow.json`), JSON.stringify(body, null, '\t'));

const master = { kind: 'master', cwd: '~/code/agents' };

// The one flow this probe arms: a single step, gated on his card, so arming it can only ever pause.
flow('gate', {
	building: BUILDING, scope: 'nb/engine · the probe', created: '2026-08-28',
	concurrency: 1, judgeTier: 'fable-high',
	steps: [{
		id: 'g', name: 'The gate', account: 'personal', tier: 'Architect · fable-high',
		venue: master, depends: [],
		gate: { kind: 'felix', card: 'His arm is the gate. Nothing on this card fires; the pass is his.' },
		kickoff: 'You are an Architect at fable-high. This kickoff is never sent by this probe.',
	}],
});

// A model that cannot hold `auto` (P5 F1) — refused at arm, named, never substituted.
flow('haiku', {
	building: REFUSED, scope: 'nb/refused · the probe', created: '2026-08-28',
	steps: [{ id: 'h', name: 'The haiku step', account: 'personal', tier: 'Builder · haiku-low', venue: master, depends: [], kickoff: 'never' }],
});

// A venue no account has ever trusted — a fresh `git init`, which is cold on every silo (B7 F1).
flow('cold', {
	building: REFUSED, scope: 'nb/refused · the probe', created: '2026-08-28',
	steps: [{ id: 'c', name: 'The cold venue', account: 'personal', tier: 'Builder · sonnet-low', venue: { kind: 'master', cwd: COLD }, depends: [], kickoff: 'never' }],
});

// A flow that will not parse: it renders its failure and files nothing (parser-as-lint).
flow('broken', {
	building: REFUSED, scope: 'nb/refused · the probe', created: '2026-08-28',
	steps: [{ id: 'b', name: 'Broken', account: 'personal', tier: 'Builder · sonnet-low', venue: master, depends: ['ghost'], kickoff: 'never' }],
});

const env = { ...process.env, CENSUS_DIR: CENSUS, GLASS_CITY: CITY, FLOWS_DIR: FLOWS };
const runLog = (name: string) => {
	try { return readFileSync(join(CENSUS, 'flows', `${name}.run.jsonl`), 'utf8'); } catch { return ''; }
};
const auditLog = () => { try { return readFileSync(join(CENSUS, 'hands.jsonl'), 'utf8'); } catch { return ''; } };

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}: lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t | xargs kill`);
	rmSync(ROOT, { recursive: true, force: true });
	process.exit(2);
}

const glass = Bun.spawn(['bun', SERVER], { env: { ...env, GLASS_PORT: String(PORT) }, stdout: 'pipe', stderr: 'pipe' });
// The same glass with no credential: the arm must answer 503 and say why, and the plan must still read.
const cold = Bun.spawn(['bun', SERVER], {
	env: { ...env, GLASS_PORT: String(COLD_PORT), BELVEDERE_ENV: join(ROOT, 'no-such-credential') },
	stdout: 'pipe', stderr: 'pipe',
});
const chrome = launchChrome(join(ROOT, 'chrome'), CDP_PORT, DECK);

async function shut(): Promise<void> {
	chrome.kill();
	glass.kill();
	cold.kill();
	await Bun.sleep(400);
	rmSync(ROOT, { recursive: true, force: true });
}

const post = async (origin: string, path: string, body: unknown) => {
	const r = await fetch(`${origin}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return { status: r.status, body: await r.json() as { ok: boolean; error?: string; result?: Record<string, unknown> } };
};

type Snap = { works: { flows: { name: string; hash: string; armedHash: string | null }[]; fails: { code: string }[]; hands: { armed: boolean } } | null };
const state = async (origin = ORIGIN): Promise<Snap> =>
	await (await fetch(`${origin}/deck/state?b=${encodeURIComponent(BUILDING)}`)).json() as Snap;

try {
	await until('the glass', async () => (await fetch(DECK)).ok);
	await until('the cold glass', async () => (await fetch(`http://127.0.0.1:${COLD_PORT}/deck`)).ok);
	await attach(CDP_PORT, DECK);

	console.log(`\n# B11 — the arm, its refusals, and the card it stops at\n`);
	console.log(`glass: ${DECK}   city: ${CITY}   flows: ${FLOWS}   census: ${CENSUS}\n`);

	// --- 1. the arm refuses, at arm time, naming the step (P5 F5 iv) ---

	const haiku = await post(ORIGIN, '/flow/haiku/arm', {});
	ok('a haiku step cannot be armed — its model IS its permission posture, and the refusal names it',
		haiku.status === 409 && !haiku.body.ok && /step h/.test(haiku.body.error ?? '') && /haiku/.test(haiku.body.error ?? '')
		&& runLog('haiku') === '',
		`${haiku.status} ${haiku.body.error}\n      run log: ${JSON.stringify(runLog('haiku'))}`);

	const coldVenue = await post(ORIGIN, '/flow/cold/arm', {});
	ok('a venue no account has trusted refuses the arm, naming the step and the project',
		coldVenue.status === 409 && /step c/.test(coldVenue.body.error ?? '') && /never trusted/.test(coldVenue.body.error ?? '')
		&& runLog('cold') === '',
		`${coldVenue.status} ${coldVenue.body.error}\n      run log: ${JSON.stringify(runLog('cold'))}`);

	const broken = await post(ORIGIN, '/flow/broken/arm', {});
	ok('a flow that will not parse cannot be armed, and the refusal is the parser’s own sentence',
		broken.status === 409 && /unknown-dep/.test(broken.body.error ?? '') && runLog('broken') === '',
		`${broken.status} ${broken.body.error}`);

	const stale = await post(ORIGIN, '/flow/gate/arm', { hash: 'what-the-page-was-showing-earlier' });
	ok('an arm carrying a hash the file no longer has is refused — nobody arms bytes they did not read',
		stale.status === 409 && /not the plan on disk/.test(stale.body.error ?? '') && runLog('gate') === '',
		`${stale.status} ${stale.body.error}`);

	const disabled = await post(`http://127.0.0.1:${COLD_PORT}`, '/flow/gate/arm', {});
	const coldSnap = await state(`http://127.0.0.1:${COLD_PORT}`);
	ok('cold hands: the arm answers 503 with the reason, and the plan still reads',
		disabled.status === 503 && /hands disabled/.test(disabled.body.error ?? '')
		&& coldSnap.works?.hands.armed === false && (coldSnap.works?.flows.length ?? 0) === 1,
		`${disabled.status} ${disabled.body.error}\n      cold glass still renders ${coldSnap.works?.flows.length} flow, hands.armed=${coldSnap.works?.hands.armed}`);

	const notPost = await fetch(`${ORIGIN}/flow/gate/arm`);
	const noSuch = await post(ORIGIN, '/flow/gate/detonate', {});
	ok('the route is POST-only and knows exactly two verbs',
		notPost.status === 405 && noSuch.status === 404,
		`GET /flow/gate/arm → ${notPost.status} · POST /flow/gate/detonate → ${noSuch.status}`);

	// --- 2. the Works, opened: the arm card, the bill, and nothing on his card to press ---

	await until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));
	await evaluate(SET('context', 'typical'));
	await evaluate(SET('focus', 'expanded'));
	await evaluate(SET('action', 'expanded'));
	await settle();
	await openWorks('nb/engine', POLL_MS);
	await until('the flow on the wall', async () => await evaluate<boolean>(
		`document.querySelectorAll('#host-focus .node').length === 1`), POLL_MS * 3);
	await settle();

	const card = await evaluate<{ steps: number; hash: string; armed: string; bill: number; button: string; disabled: boolean }>(`(() => {
		const c = document.querySelector('#host-action .armcard');
		const kv = [...c.querySelectorAll('.facts .kv')].map(k => k.textContent);
		const b = c.querySelector('[data-arm]');
		return {
			steps: c.querySelectorAll('.armstep').length,
			hash: kv.find(t => t.startsWith('on disk')) ?? '',
			armed: kv.find(t => t.startsWith('armed')) ?? '',
			bill: c.querySelectorAll('.usage .uline').length,
			button: b ? b.textContent : '(none)',
			disabled: b ? b.disabled : true,
		};
	})()`);
	const snapBefore = await state();
	const onDisk = snapBefore.works!.flows[0]!.hash;
	ok('the arm card shows the whole of what one click authorizes: the steps, the plan’s own sha, and the bill',
		card.steps === 1 && card.hash.includes(onDisk.slice(0, 16)) && card.armed.includes('nothing yet')
		&& card.bill === 3 && !card.disabled,
		`${card.steps} step · ${card.hash} · ${card.armed} · ${card.bill} accounts billed · button "${card.button}"`);

	// The bill on this card is LIVE — B17's fetch module, not the rig's log (the re-seat's own word).
	const billSource = await evaluate<string[]>(
		`[...document.querySelectorAll('#host-action .usage .uline')].map(l => l.className)`);
	ok('and the bill is fetched live by the deck itself, each figure wearing its source',
		billSource.length === 3 && billSource.every(c => /s-(live|cache|none)/.test(c)),
		billSource.join(' · '));

	// --- 3. the arm, pressed in a real browser ---

	await evaluate(`document.querySelector('#host-action [data-arm]').click()`);
	await until('the run log to record the arm', async () => runLog('gate').includes('"ev":"armed"'), 10_000);
	const armLine = JSON.parse(runLog('gate').trim().split('\n')[0]!) as Record<string, unknown>;
	ok('one click on the rendered plan arms it, and the log records WHAT was armed',
		armLine['ev'] === 'armed' && armLine['step'] === null && armLine['hash'] === onDisk,
		`${runLog('gate').trim()}`);

	// --- 4. …and the engine stops dead at his card ---

	await until('the engine to reach the card', async () => runLog('gate').includes('"ev":"paused"'), 20_000);
	const auditAfter = auditLog();
	const paused = runLog('gate').trim().split('\n').map(l => JSON.parse(l) as Record<string, unknown>);
	ok('the engine reaches his card and pauses the lane — no fire, nothing in the hands audit',
		paused.length === 2 && paused[1]!['ev'] === 'paused' && paused[1]!['step'] === 'g'
		&& String(paused[1]!['why']).includes('Felix-card')
		&& !runLog('gate').includes('"ev":"fired"') && auditAfter === '',
		`${JSON.stringify(paused[1])}\n      hands audit: ${JSON.stringify(auditAfter)}`);

	// It pauses ONCE. The tick runs every five seconds forever; a line per tick would bury the one
	// line that matters under a thousand copies of itself.
	await Bun.sleep(12_000);
	const lines = runLog('gate').trim().split('\n').length;
	ok('and it pauses once, not once per tick — the engine’s writing is idempotent',
		lines === 2, `${lines} lines after 12 s of ticking (2 expected: armed, paused)`);

	// --- 5. his card: the pass is the only control on it, and it is not a fire ---

	await until('the card to render as awaiting his pass', async () => await evaluate<boolean>(
		`!!document.querySelector('#host-focus .node.felix-card')`), POLL_MS * 3);
	const drawn = await evaluate<{ buttons: number; links: number; fire: number; markup: number }>(`(() => {
		const n = document.querySelector('#host-focus .node.felix-card');
		const markup = n.outerHTML.length - n.textContent.length;
		return {
			buttons: n.querySelectorAll('button').length,
			links: n.querySelectorAll('a').length,
			fire: n.outerHTML.split(n.textContent).length,
			markup,
		};
	})()`);
	ok('the node on the drawing is his card and carries nothing to press (D10, B3’s structural bar)',
		drawn.buttons === 0 && drawn.links === 0,
		`${drawn.buttons} buttons · ${drawn.links} links on the drawn Felix-card`);

	await evaluate(`document.querySelector('#host-focus .node.felix-card').click()`);
	await settle();
	const pass = await evaluate<{ pass: string; flow: string; fireInMarkup: number; text: number }>(`(() => {
		const host = document.querySelector('#host-action');
		const b = host.querySelector('[data-pass]');
		// B17 F1's sound check: the question is not whether the string is RENDERED, it is whether any
		// of it is MARKUP. outerHTML minus textContent is exactly that difference.
		const markup = host.outerHTML.split(host.textContent).join('');
		return {
			pass: b ? b.dataset.pass : '(none)',
			flow: b ? b.dataset.passFlow : '(none)',
			fireInMarkup: (markup.match(/hands\\/fire/g) ?? []).length,
			text: (host.textContent.match(/hands\\/fire/g) ?? []).length,
		};
	})()`);
	ok('picking it offers exactly one control — his pass — and no fire wiring anywhere in the pane',
		pass.pass === 'g' && pass.flow === 'gate' && pass.fireInMarkup === 0,
		`data-pass="${pass.pass}" data-pass-flow="${pass.flow}" · hands/fire in markup ${pass.fireInMarkup} · in text ${pass.text}`);

	const sources = await Promise.all(['works.client.ts', 'deck.client.ts', 'deck-dom.ts', 'engine.ts', 'composer.client.ts']
		.map(async f => `${f} ${(readFileSync(join(HERE, 'glass', f), 'utf8').match(/hands\/fire/g) ?? []).length}×`));
	ok('and the SOURCE that may reach the spawning hand is still only the composer’s (B17 F1)',
		(readFileSync(join(HERE, 'glass/works.client.ts'), 'utf8').match(/hands\/fire/g) ?? []).length === 0,
		sources.join(' · '));

	// --- 6. the failure a flow file cannot hide ---

	const snap = await state();
	ok('a flow that will not parse renders its named failure beside the ones that do',
		snap.works!.fails.some(f => f.code === 'unknown-dep'),
		snap.works!.fails.map(f => f.code).join(', ') || '(none)');

	// --- 7. the cost, with the engine ticking under it ---

	const times: number[] = [];
	for (let i = 0; i < 20; i++) {
		const t0 = performance.now();
		await fetch(`${ORIGIN}/deck/state?b=${encodeURIComponent(BUILDING)}`);
		times.push(performance.now() - t0);
		await Bun.sleep(2000);
	}
	times.sort((a, b) => a - b);
	const p95 = times[Math.floor(times.length * 0.95) - 1]!;
	ok('/deck/state stays inside the 500 ms bar while the engine ticks (B3’s 20-request protocol)',
		p95 < 500,
		`n=20 min=${times[0]!.toFixed(1)} p50=${times[9]!.toFixed(1)} p95=${p95.toFixed(1)} max=${times.at(-1)!.toFixed(1)} ms`);

	console.log(`\n${failures === 0 ? 'ALL GREEN' : `${failures} FAILED`}\n`);
}
catch (e) {
	console.error('\nprobe threw:', e);
	failures++;
}
finally {
	await shut();
	process.exit(failures === 0 ? 0 : 1);
}
