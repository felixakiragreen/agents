// B14's live half: the real city, the real census, and a real session stalled on a real permission
// prompt — the end-to-end proof that the waiting-input blindness is dead.
//
//    bun belvedere/lab/b14/live.ts
//
// The fixture probe (`probe.ts`) proves the mechanism deterministically. This proves it against the
// thing Felix actually looks at: ~/code's whole register, the live `census.jsonl`, and one session
// fired **through the glass's own hands** into a scratch subdir of `~/code/agents`.
//
// Why haiku·low is the right tier here and only here: P5 measured that `--model haiku` cannot enter
// `auto` permission mode on any account and stalls at its first side-effecting Bash call, silently
// (P5 F1/F3). The batch-5 lane-A rule amends haiku·low out of probes that need tool work to
// *succeed* — this probe needs a stall, so haiku·low is the instrument, not the mistake.
//
// Desktop rules honoured: ONE spawned session, closed at landing (D55), no cmux quit/relaunch, no
// account settings touched. The scratch directory is removed and `git status` is compared either
// side.

import { existsSync, mkdirSync, rmSync, statSync, readFileSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { readCredential } from '../../glass/hands';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HERE = join(import.meta.dir, '../..');                  // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4494;
const CDP_PORT = 9338;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const POLL_MS = 3000;

const SCRATCH = join(HERE, 'lab/b14/scratch');
const CENSUS = join(process.env.HOME!, 'code/agents/summon/log/census/census.jsonl');
const STAMP = 'b14-waiting-probe';
const ACCOUNT = 'personal';
const PROFILE = mkdtempSync(join(tmpdir(), 'b14-live-'));

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

async function until<T>(what: string, probe: () => Promise<T | null>, ms: number): Promise<T> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		const got = await probe().catch(() => null);
		if (got !== null) return got;
		await Bun.sleep(500);
	}
	throw new Error(`timed out waiting for ${what} after ${ms} ms`);
}

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}`);
	process.exit(2);
}

const gitBefore = new TextDecoder().decode(Bun.spawnSync(['git', '-C', join(HERE, '..'), 'status', '--short']).stdout);
mkdirSync(SCRATCH, { recursive: true });

const glass = Bun.spawn(['bun', SERVER], { env: { ...process.env, GLASS_PORT: String(PORT) }, stdout: 'pipe', stderr: 'pipe' });
let chrome: Bun.Subprocess | null = null;
let workspace: string | null = null;

/** Close the workspace the way `hands.ts` does — the credential goes to a child env, never to a log. */
function closeWorkspace(ref: string): string {
	const cred = readCredential();
	if (!cred.ok) return `could not read the credential: ${cred.error}`;
	const p = Bun.spawnSync(['cmux', 'workspace', 'close', ref],
		{ env: { ...process.env, CMUX_QUIET: '1', CMUX_SOCKET_PASSWORD: cred.result } });
	return `${p.exitCode === 0 ? 'closed' : 'FAILED'} ${ref}: ${new TextDecoder().decode(p.stdout).trim()}`;
}

// ---------- the DevTools wire (b13/probe.ts's, unchanged) ----------

type Reply = { id: number; result?: { result?: { value?: unknown }; exceptionDetails?: unknown }; error?: { message: string } };
let socket: WebSocket;
let nextId = 1;
const pending = new Map<number, { go: (v: unknown) => void; no: (e: Error) => void }>();

function evaluate<T>(expression: string): Promise<T> {
	const id = nextId++;
	return new Promise<T>((go, no) => {
		pending.set(id, { go: v => go(v as T), no });
		socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
	});
}

async function connect(): Promise<void> {
	await until('chrome', async () => (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok || null, 30_000);
	const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json() as
		{ type: string; url: string; webSocketDebuggerUrl: string }[];
	const page = targets.find(t => t.type === 'page' && t.url.startsWith(DECK));
	if (!page) throw new Error(`no page target at ${DECK}`);
	socket = new WebSocket(page.webSocketDebuggerUrl);
	socket.addEventListener('message', ev => {
		const msg = JSON.parse(String(ev.data)) as Reply;
		const w = pending.get(msg.id);
		if (!w) return;
		pending.delete(msg.id);
		if (msg.error) return w.no(new Error(msg.error.message));
		if (msg.result?.exceptionDetails) return w.no(new Error(JSON.stringify(msg.result.exceptionDetails)));
		w.go(msg.result?.result?.value);
	});
	await new Promise<void>((go, no) => {
		socket.addEventListener('open', () => go());
		socket.addEventListener('error', () => no(new Error('the DevTools socket refused')));
	});
}

/** Every census line written after `from` bytes — the probe never re-reads the whole log. */
const since = (from: number): Record<string, unknown>[] => {
	const text = readFileSync(CENSUS, 'utf8').slice(from);
	return text.split('\n').filter(l => l.trim()).flatMap(l => {
		try { return [JSON.parse(l) as Record<string, unknown>]; } catch { return []; }
	});
};

try {
	await until('the glass to boot (it walks ~/code once)', async () => (await fetch(`${ORIGIN}/deck/state`)).ok || null, 60_000);

	console.log(`\n# B14 — the live city: /deck/state under load, and a real permission stall\n`);
	console.log(`glass: ${DECK}   census: ${CENSUS}   city: ~/code   scratch: ${SCRATCH}\n`);

	// --- 1. /deck/state's p95, B3's protocol: 20 requests, 2 s apart (a tight burst hides the stall) ---

	const ms: number[] = [];
	let bytes = 0;
	for (let i = 0; i < 20; i++) {
		const t0 = performance.now();
		const body = await (await fetch(`${ORIGIN}/deck/state`)).text();
		ms.push(performance.now() - t0);
		bytes = body.length;
		await Bun.sleep(2000);
	}
	const sorted = [...ms].sort((a, b) => a - b);
	const p = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]!;
	const shape = await (await fetch(`${ORIGIN}/deck/state`)).json() as
		{ census: { live: number; sessions: unknown[] }; register: { buildings: unknown[] }; queue: unknown[] };
	ok('`/deck/state` p95 under B3\'s protocol, with the whole live City on it',
		p(0.95) < 500,
		`n=20 spaced 2 s · min ${p(0).toFixed(0)} ms · p50 ${p(0.5).toFixed(0)} ms · p95 ${p(0.95).toFixed(0)} ms · max ${sorted.at(-1)!.toFixed(0)} ms (bar 500 ms)\n`
		+ `      snapshot ${bytes} B — ${shape.register.buildings.length} buildings · ${shape.census.sessions.length} sessions (${shape.census.live} live) · ${shape.queue.length} in the queue`);

	// --- 2. fire one haiku session into the scratch dir, through the glass's own hands ---

	const from = statSync(CENSUS).size;
	const firedAt = Date.now();
	const fire = await fetch(`${ORIGIN}/hands/fire`, {
		method: 'POST', headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			account: ACCOUNT, stamp: STAMP, cwd: SCRATCH, model: 'haiku', effort: 'low', color: 'Charcoal',
			// The command has to have a SIDE EFFECT. Measured on this probe's own first run: a haiku
			// session in `default` mode ran `echo b14-waiting-probe` straight through —
			// `PreToolUse Bash` → `PostToolUse` → `Stop`, no prompt — because `default` auto-approves
			// a read-only shell call. P5 F3's "stalls at its first side-effecting Bash call" is exact,
			// and `echo` is not one. A `Write` is.
			summons: 'Use the Write tool to create a file named probe.txt in this directory,'
				+ ' containing the single word: waiting\n\nThen stop. Do nothing else.\n',
		}),
	});
	const fired = await fire.json() as { ok: boolean; error?: string; result?: { workspace: string; sha: string; bytes: number } };
	if (!fired.ok) throw new Error(`the fire was refused: ${fire.status} ${fired.error}`);
	workspace = fired.result!.workspace;

	// --- 3. the stall, on the wire ---

	const stalled = await until('the session to stall on a permission prompt', async () => {
		const beats = since(from).filter(b => b.cwd === SCRATCH);
		const prompt = beats.find(b => b.ev === 'Notification' && b.why === 'permission_prompt');
		return prompt ? { prompt, beats } : null;
	}, 150_000);
	const stalledAt = Date.now();
	const modes = [...new Set(stalled.beats.map(b => `${b.ev}:${b.mode ?? '—'}`))];

	ok('a real haiku fire stalls on a real permission prompt, and the census sees it (P5 F1/F3, live)',
		true,
		`fired ${workspace} · sha ${fired.result!.sha} · ${fired.result!.bytes} B summons, at ${new Date(firedAt).toISOString()}\n`
		+ `      stalled at ${new Date(stalledAt).toISOString()} — ${((stalledAt - firedAt) / 1000).toFixed(1)} s after the fire\n`
		+ `      ${JSON.stringify(stalled.prompt)}\n`
		+ `      beats this session wrote: ${modes.join(' · ')}`);

	// --- 4. the deck, opened on the live city: the dot and the queue item ---

	chrome = Bun.spawn([CHROME,
		'--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
		'--disable-background-networking', '--disable-sync', '--disable-default-apps',
		'--window-size=1600,900', `--user-data-dir=${PROFILE}`,
		`--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', DECK,
	], { stdout: 'pipe', stderr: 'pipe' });

	await connect();
	await until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`) || null, 30_000);
	await evaluate(`document.querySelector('[data-set-state="expanded"][data-pane="context"]').click()`);
	await Bun.sleep(400);

	const seen = await until('the waiting session on the deck', async () => await evaluate<{
		top: string; dot: string; badge: string | null; item: string; needs: string; where: string; count: string;
	} | null>(`(() => {
		const rows = [...document.querySelectorAll('#host-context .row[data-building]')];
		const hit = rows.find(r => r.querySelector('.dot.w-blocked'));
		const q = [...document.querySelectorAll('#host-drawer .qi[data-kind="waiting"]')]
			.find(e => e.querySelector('.qname').textContent.includes('${STAMP}'));
		if (!hit || !q) return null;
		return {
			top: rows[0].dataset.building,
			dot: hit.dataset.building,
			badge: hit.querySelector('.badge.b-waiting')?.textContent ?? null,
			item: q.querySelector('.qname').textContent,
			where: q.querySelector('.qwhere').textContent,
			needs: document.getElementById('needs').dataset.needs,
			count: document.getElementById('waiting-count')?.dataset.waiting ?? '0',
		};
	})()`), POLL_MS * 6);
	const domAt = Date.now();

	ok('the live deck shows it: a waiting dot in the City, a badge on its building, an item in the queue',
		seen.dot === seen.top && seen.badge !== null && seen.item.includes(STAMP),
		`on screen at ${new Date(domAt).toISOString()} — ${((domAt - stalledAt) / 1000).toFixed(1)} s after the census line\n`
		+ `      the City's top row is "${seen.top}" and it is the one carrying the blocked dot: ${seen.dot === seen.top}\n`
		+ `      waiting badge "${seen.badge}" · headline "${seen.count} blocked on you" · header needs "${seen.needs}"\n`
		+ `      queue item "${seen.item}" — ${seen.where}`);
}
catch (e) {
	failures++;
	console.log(`FAIL  the probe itself threw\n      ${e instanceof Error ? e.message : String(e)}`);
}
finally {
	// D55: leave nothing running and nothing behind.
	const closed = workspace ? closeWorkspace(workspace) : 'no workspace was created';
	chrome?.kill();
	glass.kill();
	await Bun.sleep(400);
	rmSync(PROFILE, { recursive: true, force: true });
	if (existsSync(SCRATCH)) rmSync(SCRATCH, { recursive: true, force: true });
	const gitAfter = new TextDecoder().decode(Bun.spawnSync(['git', '-C', join(HERE, '..'), 'status', '--short']).stdout);
	ok('venue restored — the workspace closed, the scratch dir gone, `git status` unchanged',
		gitAfter === gitBefore && !existsSync(SCRATCH),
		`${closed}\n      git status --short is byte-identical either side: ${gitAfter === gitBefore}`);
}

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
