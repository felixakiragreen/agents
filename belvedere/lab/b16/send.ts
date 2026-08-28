// B16's live half: a real message, into a real session, from the deck's own rendered button.
//
//    bun belvedere/lab/b16/send.ts
//
// This one cannot be faked and cannot ride `bun test`. It stands up a glass against the **real**
// census and the **real** city — the send has to *locate* its target, and only the live census knows
// which cmux workspace a session is beating from — then fires one sonnet·low probe through the
// glass's own hands, types a multi-line message into the deck's real textarea, presses the real
// button, and compares shas with the transcript on disk.
//
// Four things it is careful about:
//
//  1. **`FLOWS_DIR` is an empty temp directory.** A real glass runs a real engine; pointing it at
//     the city's own flows would let a DoD run fire declared work (B11 F1, one door further along).
//  2. **The probe tier is sonnet·low**, the cheapest tier that holds `auto` permission mode (P5 F1) —
//     though this probe asks for no tool work at all.
//  3. **One spawned session at a time**, and every workspace closed at landing (D55, batch-5's
//     desktop rules). The venue is printed before and after.
//  4. **The audit is the real one.** A `message` line belongs in the city's own record — it carries
//     the sha and the byte count and never the words (`hands.ts` §audit).

import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'fs';
import { createHash } from 'crypto';
import { homedir, tmpdir } from 'os';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4497;
const CDP_PORT = 9341;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;

const VENUE = join(homedir(), 'code/agents');
const CENSUS_DIR = join(homedir(), 'code/agents/summon/log/census');
const AUDIT = join(CENSUS_DIR, 'hands.jsonl');
/**
 * A stamp unique to this run, and it is not decoration. The census keeps every session it has ever
 * heard, so a fixed name lets `find(stamp)` latch onto a *previous* run's dead probe — which is what
 * happened on this probe's second attempt: it waited 150 s for a workspace that had been closed ten
 * minutes earlier. D10's own lesson, arriving in the instrument rather than in the glass.
 */
const STAMP = `b16-live-${Date.now().toString(36).slice(-6)}`;
const TOKEN = 'pomegranate-7714';

const ROOT = mkdtempSync(join(tmpdir(), 'b16-send-'));
const PROFILE = join(ROOT, 'chrome');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');

const SUMMONS = `You are a transport probe for Belvedere's B16 row. Do no tool work at all.
Whenever you receive a message, reply with one short line: ACK followed by the LAST word of that message. Nothing else.
Say READY now.`;

/** Multi-line, with a blank line — the payload P2 T4 splits and P6's segmented paste does not. */
const MESSAGE = `B16 live send, line one.

Line three follows one blank line, and it is indented below:
    four spaces of indent, and a trailing space here.
The last word is ${TOKEN}`;

// ---------- the world ----------

async function cmux(...args: string[]): Promise<{ code: number; out: string }> {
	const p = Bun.spawn(['cmux', ...args], { env: { ...process.env, CMUX_QUIET: '1' }, stdout: 'pipe', stderr: 'pipe', timeout: 20_000 });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	return { code: await p.exited, out: (out + err).trim() };
}

type WS = { id: string; ref: string; title: string };
const workspaces = async (): Promise<WS[]> =>
	(JSON.parse((await cmux('workspace', 'list', '--json')).out) as { workspaces: WS[] }).workspaces;

async function until<T>(what: string, probe: () => Promise<T | null>, ms = 180_000): Promise<T> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		const got = await probe().catch(() => null);
		if (got !== null && got !== false) return got as T;
		await Bun.sleep(400);
	}
	throw new Error(`timed out waiting for ${what}`);
}
const yes = (b: boolean): true | null => (b ? true : null);

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}: lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t | xargs kill`);
	rmSync(ROOT, { recursive: true, force: true });
	process.exit(2);
}

const before = await workspaces();
console.log(`\n# B16 — the live send\n\nvenue before: ${before.map(w => `${w.ref} ${w.title}`).join(' · ')}\n`);

const glass = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(PORT), FLOWS_DIR: join(ROOT, 'flows'), DESK_DIR: join(ROOT, 'desk') },
	stdout: 'pipe', stderr: 'pipe',
});

const chrome = Bun.spawn([CHROME,
	'--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
	'--disable-background-networking', '--disable-sync', '--disable-default-apps',
	'--window-size=1600,900', `--user-data-dir=${PROFILE}`,
	`--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', DECK,
], { stdout: 'pipe', stderr: 'pipe' });

const opened = new Set<string>();

async function shut(): Promise<void> {
	for (const w of opened) console.log(`\n# closing ${w}: ${(await cmux('workspace', 'close', w)).out}`);
	chrome.kill();
	glass.kill();
	await Bun.sleep(400);
	rmSync(ROOT, { recursive: true, force: true });
	const after = await workspaces();
	console.log(`venue after:  ${after.map(w => `${w.ref} ${w.title}`).join(' · ')}`);
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

async function connect(): Promise<void> {
	await until('the glass', async () => yes((await fetch(DECK)).ok), 90_000);
	await until('chrome', async () => yes((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok));
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

// ---------- the transcript, read straight off disk (the sensor beside the glass's own) ----------

type Rec = { type?: string; isSidechain?: boolean; isMeta?: boolean; message?: { content?: unknown } };

const records = (path: string): Rec[] =>
	readFileSync(path, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l) as Rec; } catch { return {}; } });

const userTurns = (path: string): string[] =>
	records(path).filter(r => r.type === 'user' && !r.isSidechain && !r.isMeta && typeof r.message?.content === 'string')
		.map(r => r.message!.content as string);

const assistantText = (path: string): string =>
	records(path).filter(r => r.type === 'assistant' && Array.isArray(r.message?.content))
		.flatMap(r => (r.message!.content as { type?: string; text?: string }[]).filter(b => b.type === 'text').map(b => b.text ?? ''))
		.join('\n');

type Session = { sid: string; stamp: string | null; state: string; ws: string | null; cwd: string | null };
const sessions = async (): Promise<Session[]> =>
	((await (await fetch(`${ORIGIN}/deck/state`)).json()) as { census: { sessions: Session[] } }).census.sessions;

const post = async (path: string, body: unknown): Promise<{ status: number; body: { ok: boolean; error?: string; result?: Record<string, unknown> } }> => {
	const r = await fetch(`${ORIGIN}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return { status: r.status, body: await r.json() as { ok: boolean; error?: string } };
};

const auditLines = () => readFileSync(AUDIT, 'utf8').split('\n').filter(Boolean);

/**
 * **This campaign's own** Architect transcript, found the way the shelf finds anything: a bounded
 * head window per file, never the whole thing. `architect-belvedere-*` and `architect-agents-*` are
 * the two lineages this campaign has run under (the theater is the building, B17's own subject), and
 * the winner is the longest of them — the one whose tail window certainly does not hold the file.
 */
const CAMPAIGN = /"agentName":"(architect-(?:belvedere|agents)-\d+)"/;

function biggestArchitect(): { sid: string; stamp: string; path: string; bytes: number } {
	let best: { sid: string; stamp: string; path: string; bytes: number } | null = null;
	for (const dir of [join(homedir(), '.claude'), join(homedir(), '.claude-thg-doorbell'), join(homedir(), '.claude-thg-automation')]) {
		const root = join(dir, 'projects');
		let slugs: string[];
		try { slugs = readdirSync(root); } catch { continue; }
		for (const slug of slugs) {
			let files: string[];
			try { files = readdirSync(join(root, slug)); } catch { continue; }
			for (const f of files) {
				const m = /^([0-9a-f-]{36})\.jsonl$/.exec(f);
				if (!m) continue;
				const path = join(root, slug, f);
				const bytes = statSync(path).size;
				if (bytes < 400 << 10 || (best && bytes <= best.bytes)) continue;
				const name = CAMPAIGN.exec(readFileSync(path, 'utf8').slice(0, 32 << 10))?.[1];
				if (name) best = { sid: m[1]!, stamp: name, path, bytes };
			}
		}
	}
	if (!best) throw new Error('no Architect transcript from this campaign over 400 kB');
	return best;
}

// ---------- the run ----------

try {
	await connect();
	// Chrome navigated before the glass finished its boot walk over the real city (seconds of
	// filesystem, `register.ts`), so the tab is holding a connection-refused page. Re-navigate now
	// that the server answers, and wait for the first poll rather than for the shell's own markup.
	await evaluate(`location.replace(${JSON.stringify(DECK)})`).catch(() => { /* the navigation kills it */ });
	await Bun.sleep(1200);
	await connect();
	await until('the first poll', async () => yes(await evaluate<boolean>(`!!document.querySelector('#live-count')`)));
	const auditBefore = auditLines().length;

	// --- 0. this campaign's own Architect transcript, read in the deck ---

	const architect = biggestArchitect();
	await evaluate(`localStorage.setItem('belvedere.deck.session', ${JSON.stringify(JSON.stringify(architect.sid))});
		localStorage.setItem('belvedere.deck.focus', '"chat"'); location.replace(${JSON.stringify(DECK)})`)
		.catch(() => { /* the navigation kills it */ });
	await Bun.sleep(1200);
	await connect();
	await evaluate(`document.querySelector('[data-set-state="typical"][data-pane="focus"]').click()`);
	const arch = await until('the Architect transcript', async () => {
		const n = await evaluate<number>(`document.querySelectorAll('#host-focus .ct').length`);
		return n > 0 ? n : null;
	});
	await evaluate(`document.querySelector('[data-chat-earlier]').click()`);
	const archGrown = await until('an earlier window of it', async () => {
		const n = await evaluate<number>(`document.querySelectorAll('#host-focus .ct').length`);
		return n > arch ? n : null;
	});
	ok('a REAL Architect transcript from this campaign renders tail-windowed, and pages backwards',
		arch > 0 && archGrown > arch,
		`${architect.stamp} · ${(architect.bytes / 1024).toFixed(0)} kB · ${architect.path}\n`
		+ `      ${arch} turns in the tail window → ${archGrown} after one [↑ earlier]`);

	// --- 1. one probe session, fired through the glass's own hands ---

	const fired = await post('/hands/fire', {
		account: 'personal', stamp: STAMP, cwd: VENUE, model: 'sonnet', effort: 'low',
		color: '#0362b2', summons: SUMMONS,
	});
	if (!fired.body.ok) throw new Error(`fire refused ${fired.status}: ${fired.body.error}`);
	const workspace = String(fired.body.result!['workspace']);
	opened.add(workspace);
	console.log(`# fired ${STAMP} into ${workspace}\n`);

	const probe = await until('the probe in the census', async () => {
		const s = (await sessions()).find(x => x.stamp === STAMP && x.state !== 'gone');
		return s && s.ws ? s : null;
	});
	const transcript = await until('its transcript', async () => {
		const view = await (await fetch(`${ORIGIN}/deck/chat?sid=${probe.sid}`)).json() as { target?: { transcript: string | null } };
		return view.target?.transcript ?? null;
	});
	// **Idle, per the census** — not "it said READY". A probe answers its own standing rule rather
	// than the instruction you thought you gave it (P6 F6), and what the send actually needs is a
	// session that has finished its turn: `Stop` is the idle sensor (P1 F1).
	const idle = await until('the probe to finish its first turn', async () => {
		const s = (await sessions()).find(x => x.sid === probe.sid);
		return s?.state === 'idle' ? s : null;
	}, 150_000);
	console.log(`# ${STAMP} is ${idle.state}; it answered: ${JSON.stringify(assistantText(transcript).trim().slice(-60))}\n`);

	// --- 2. the send, from the deck's own button ---

	await evaluate(`document.querySelector('[data-set-state="expanded"][data-pane="context"]').click()`);
	await evaluate(`document.querySelector('[data-set-state="typical"][data-pane="focus"]').click()`);
	await evaluate(`document.querySelector('[data-set-state="expanded"][data-pane="action"]').click()`);
	await until('the probe row in the City', async () => yes(await evaluate<boolean>(
		`!!document.querySelector('#host-context [data-chat-sid="${probe.sid}"]')`)));
	await evaluate(`document.querySelector('#host-context [data-chat-sid="${probe.sid}"]').click()`);
	await until('the Chat pointed at it', async () => yes(await evaluate<boolean>(`!!document.querySelector('[data-chat-draft]')`)));

	const turnsBefore = userTurns(transcript).length;
	const bytesBefore = statSync(transcript).size;

	await evaluate(`(() => {
		const a = document.querySelector('[data-chat-draft]');
		a.value = ${JSON.stringify(MESSAGE)};
		a.dispatchEvent(new Event('input', { bubbles: true }));
	})()`);
	const armed = await evaluate<number>(`document.querySelectorAll('[data-chat-send]').length`);
	await evaluate(`document.querySelector('[data-chat-send]').click()`);
	const receipt = await until('the send receipt', async () => {
		const r = await evaluate<string>(`(document.querySelector('[data-out-for^="chat:"]') || {}).textContent || ''`);
		return r.startsWith('delivered') || r.includes('40') || r.includes('50') ? r : null;
	}, 120_000);

	const turnsAfter = userTurns(transcript);
	const landed = turnsAfter.at(-1) ?? '';
	ok('SEND, LIVE — one multi-line message with a blank line arrives as ONE user turn, byte-exact',
		armed === 1 && turnsAfter.length === turnsBefore + 1 && sha(landed) === sha(MESSAGE),
		`draft   ${Buffer.byteLength(MESSAGE)} B  sha ${sha(MESSAGE)}\n`
		+ `      turn    ${Buffer.byteLength(landed)} B  sha ${sha(landed)}\n`
		+ `      user turns ${turnsBefore} → ${turnsAfter.length} · the transcript grew ${statSync(transcript).size - bytesBefore} B\n`
		+ `      the deck said: ${receipt}`);

	// The live target's new turn has to reach the DOM on the POLL — so the clock starts at the record
	// the harness wrote (the transcript's own timestamp) and stops when the browser is showing it.
	const acted = await until('the probe acting on it', async () => yes(assistantText(transcript).includes(TOKEN)), 120_000);
	const onScreen = await until('the reply on the deck', async () => yes(await evaluate<boolean>(
		`document.getElementById('host-focus').textContent.includes(${JSON.stringify(TOKEN)})`)), 30_000)
		&& Date.now();
	const wrote = records(transcript).filter(r => r.type === 'assistant').map(r => Date.parse((r as { timestamp?: string }).timestamp ?? '')).filter(Number.isFinite).at(-1)!;
	ok('the probe ACTED on it, and its answer reached the deck within one poll (3 000 ms)',
		acted === true && onScreen - wrote < 3000,
		`the transcript's assistant text carries "${TOKEN}"; the last line reads `
		+ JSON.stringify(assistantText(transcript).split('\n').filter(Boolean).at(-1)) + '\n'
		+ `      written ${new Date(wrote).toISOString()} → on screen ${new Date(onScreen).toISOString()} = ${onScreen - wrote} ms of a 3 000 ms poll`);

	const box = await evaluate<string>(`document.querySelector('[data-chat-draft]').value`);
	ok('a delivered message empties the box, and the receipt outlives the repaint that proves it',
		box === '' && receipt.startsWith('delivered'),
		`box: ${JSON.stringify(box)} · receipt: ${receipt}`);

	// --- 3. the failure faces, each detectable BEFORE the send (P6 Q4) ---

	const unknown = await post('/chat/send', { sid: '00000000-0000-4000-8000-000000000000', text: 'nobody' });
	ok('face — an unknown target: refused by name, and nothing is delivered anywhere',
		unknown.status === 409 && /neither the census nor the three transcript trees/.test(unknown.body.error ?? ''),
		`${unknown.status} ${unknown.body.error}`);

	// P6 Q4-F5, induced live: the transport APPENDS, so a box that already holds something is a send
	// that would corrupt his own half-draft. Nothing is submitted — this is a precheck, not a retry.
	await cmux('set-buffer', '--name', 'b16-dirty', '--', 'HALF A DRAFT FELIX WAS TYPING');
	await cmux('paste-buffer', '--name', 'b16-dirty', '--workspace', probe.ws!);
	await Bun.sleep(600);
	const dirty = await post('/chat/send', { sid: probe.sid, text: 'this must not append to his words' });
	ok('face — the box is not empty: refused, quoting what is already in it (P6 Q4-F5)',
		dirty.status === 409 && /box-not-empty/.test(dirty.body.error ?? ''),
		`${dirty.status} ${dirty.body.error}`);

	const tabbed = await post('/chat/send', { sid: probe.sid, text: 'col1\tcol2' });
	const slashed = await post('/chat/send', { sid: probe.sid, text: '/status and then some words' });
	ok('refused at compose, before a single cmux call: a TAB and a leading slash (P6 T6/T8)',
		tabbed.status === 400 && slashed.status === 400
		&& /tab/.test(tabbed.body.error ?? '') && /command/.test(slashed.body.error ?? ''),
		`tab → ${tabbed.status} · slash → ${slashed.status} ${String(slashed.body.error).slice(0, 90)}…`);

	// --- 4. the dead send: a resume that carries the turn (P6 Q3) ---

	console.log(`\n# closing ${workspace} to kill the session\n`);
	await cmux('workspace', 'close', workspace);
	opened.delete(workspace);
	await until('the census to call it dead', async () => {
		const s = (await sessions()).find(x => x.sid === probe.sid);
		return yes(s?.state === 'gone');
	});
	const deadTurns = userTurns(transcript).length;
	const dead = await post('/chat/send', { sid: probe.sid, text: `after the resume, the last word is ${TOKEN}` });
	if (dead.body.ok) opened.add(String(dead.body.result!['workspace']));
	const resumed = userTurns(transcript);
	ok('SEND, DEAD — the resume carries the turn, byte-exact, into the SAME transcript and the same id',
		dead.body.ok && dead.body.result!['mode'] === 'resume'
		&& resumed.length === deadTurns + 1
		&& sha(resumed.at(-1)!) === sha(`after the resume, the last word is ${TOKEN}`),
		`mode ${String(dead.body.result?.['mode'])} · ${String(dead.body.result?.['bytes'])} B · sha ${String(dead.body.result?.['sha']).slice(0, 16)}…\n`
		+ `      user turns ${deadTurns} → ${resumed.length} · same file ${transcript}\n`
		+ `      the prior conversation came with it: first turn is ${JSON.stringify(resumed[0]?.slice(0, 48))}…`);

	ok('the silo held — the transcript is still under the account that fired it',
		transcript.startsWith(join(homedir(), '.claude/projects')),
		transcript);

	// --- 5. the audit: sha and bytes, never the words ---

	const lines = auditLines().slice(auditBefore).map(l => JSON.parse(l) as { action: string; args: Record<string, unknown>; ok: boolean });
	const messages = lines.filter(l => l.action === 'message');
	ok('every send is audited with its sha and its byte count, and the WORDS are nowhere in the log',
		messages.length >= 2 && messages.every(m => 'sha' in m.args && 'bytes' in m.args)
		&& !auditLines().slice(auditBefore).some(l => l.includes(TOKEN)),
		`${messages.length} message lines: ${messages.map(m => `${m.ok ? 'ok' : 'refused'} ${String(m.args['bytes'])} B ${String(m.args['sha'])}`).join(' · ')}`
		+ `\n      "${TOKEN}" appears in the audit ${auditLines().slice(auditBefore).filter(l => l.includes(TOKEN)).length} times`);

	// --- 6. the price of the poll ---

	const time = async (url: string) => {
		const ms: number[] = [];
		for (let n = 0; n < 12; n++) { const t = performance.now(); await fetch(url); ms.push(performance.now() - t); }
		return ms.sort((a, b) => a - b);
	};
	const bare = await time(`${ORIGIN}/deck/state`);
	const withChat = await time(`${ORIGIN}/deck/state?b=agents&s=${probe.sid}`);
	ok('the Chat rides the one poll and the one timer (B13 F5’s shared budget)',
		withChat[11]! < 500,
		`/deck/state p50 ${bare[6]!.toFixed(1)} ms · with ?b= and ?s= p50 ${withChat[6]!.toFixed(1)} ms p95 ${withChat[11]!.toFixed(1)} ms (N=12, live register)`);
}
catch (e) { console.error('\nPROBE THREW:', e); failures++; }
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
