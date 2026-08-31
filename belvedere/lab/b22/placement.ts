// B22 §placement, driven against the live socket — three real ignitions and one fixture.
//
//    bun belvedere/lab/b22/placement.ts
//
// Felix's field report was two facts wearing one complaint: an ignition minted `workspace:115`
// instead of joining the `belvedere` workspace he keeps, and `architect-belvedere-04` showed up
// housed under `agents` because the census keys a session by cwd alone. This probe measures both.
//
// **What it costs, and what it never touches.** Three ignitions, haiku·low, into `~/code/agents`
// (warm on `personal`; a cold tree stalls at the trust dialog — B7 F1). Every workspace it uses is
// its own: the home it addresses is `b22-probe-home`, a name nothing on Felix's desktop wears, so
// no assertion here can reach a workspace of his. Everything it mints, it retires (D55) — through
// `retire()` itself, which is the third thing under test.
//
// **The housing half is a fixture, deliberately.** The join is *audit → stamp → building* against
// *census → stamp*, and a real session's beats land in the LIVE census while this probe's audit
// lands in its temp tree — so a real ignition could never be joined to itself here without writing
// into the city's own telemetry, which is exactly what B22 candidate 4 forbids. The fixture carries
// both sides at once and proves the rule end to end on the deck's real endpoints.

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { join } from 'path';

const HERE = join(import.meta.dir, '../..');                    // belvedere/
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4497;
const ORIGIN = `http://127.0.0.1:${PORT}`;

const VENUE = join(homedir(), 'code/agents');                   // warm on `personal` (B7 F1)
const ACCOUNT_DIR = join(homedir(), '.claude');
const BUILDING = 'agents/b22-probe-home';                       // its last segment IS the home name
const HOME = 'b22-probe-home';

const ROOT = mkdtempSync(join(tmpdir(), 'b22-placement-'));
const CENSUS = join(ROOT, 'census.jsonl');
const AUDIT = join(ROOT, 'hands.jsonl');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

/** Everything this probe made, by uuid — closed in `finally`, whatever happens (B11 F8). */
const mine = { workspaces: new Set<string>(), surfaces: new Set<string>() };

async function cmux(...args: string[]): Promise<{ code: number; out: string }> {
	const p = Bun.spawn(['cmux', ...args], { env: { ...process.env, CMUX_QUIET: '1' }, stdout: 'pipe', stderr: 'pipe', timeout: 20_000 });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	return { code: await p.exited, out: (out + err).trim() };
}

type WS = { id: string; ref: string; title: string };
const workspaces = async (): Promise<WS[]> =>
	(JSON.parse((await cmux('workspace', 'list', '--json')).out) as { workspaces: WS[] }).workspaces;
const named = async (name: string): Promise<WS[]> => (await workspaces()).filter(w => w.title === name);

const panes = async (workspace: string): Promise<string[]> =>
	(await cmux('list-pane-surfaces', '--workspace', workspace, '--id-format', 'both')).out
		.split('\n').map(l => l.match(/\bsurface:\d+\s+([0-9A-Fa-f-]{36})/)?.[1] ?? null)
		.filter((x): x is string => x !== null);

type Ignited = { workspace: string; minted: boolean; home: string | null; surface: string | null; sha: string | null; bytes: number };

/** One ignition through the real hand, on the real socket. The summons is one sentence and a stop. */
async function ignite(stamp: string, building: string): Promise<{ ok: boolean; error?: string; result?: Ignited }> {
	const r = await fetch(`${ORIGIN}/hands/ignite`, {
		method: 'POST', headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			account: 'personal', stamp, cwd: VENUE, model: 'haiku', effort: 'low',
			color: 'Charcoal', building,
			summons: 'You are a placement probe for B22. Do nothing at all: write no files, run no'
				+ ' commands, read nothing. Reply with exactly the word ACK and stop.',
		}),
	});
	const body = await r.json() as { ok: boolean; error?: string; result?: Ignited };
	if (body.ok && body.result) {
		if (body.result.minted) mine.workspaces.add(body.result.workspace);
		if (body.result.surface) mine.surfaces.add(body.result.surface);
	}
	return body;
}

async function shut(): Promise<void> {
	for (const sf of mine.surfaces) console.log(`# closing tab ${sf}: ${(await cmux('close-surface', '--surface', sf)).out}`);
	for (const ws of mine.workspaces) console.log(`# closing ${ws}: ${(await cmux('workspace', 'close', ws)).out}`);
	glass.kill();
	await Bun.sleep(300);
	rmSync(ROOT, { recursive: true, force: true });
}

// ---------- the fixture: two sessions at the SAME cwd, one ignited by Belvedere and one not ----------
//
// `architect-b22-04` is the field report's own shape: ignited for `agents/belvedere`, working at the
// repo root. `mentat-01` is the control — the same cwd, no ignition, and it must still house by cwd.

const FIXTURE_STAMP = 'architect-b22-04';
const CONTROL_STAMP = 'mentat-b22-01';

writeFileSync(join(ROOT, 'ignited.jsonl'),
	JSON.stringify({ type: 'agent-name', agentName: FIXTURE_STAMP, sessionId: 'b22-ignited' }) + '\n');
writeFileSync(join(ROOT, 'control.jsonl'),
	JSON.stringify({ type: 'agent-name', agentName: CONTROL_STAMP, sessionId: 'b22-control' }) + '\n');
// Both are `needs-input`: a waiting session is the one that reaches all three surfaces at once —
// the City badge, the Workshop's own badge, and the drawer's queue (D15's two homes plus the tenant).
writeFileSync(CENSUS, [
	{ t: Date.now() / 1000, ev: 'Notification', why: 'permission_prompt', sid: 'b22-ignited', acct: ACCOUNT_DIR, pid: String(process.pid), cwd: VENUE, tp: join(ROOT, 'ignited.jsonl'), ws: '', sf: '' },
	{ t: Date.now() / 1000, ev: 'Notification', why: 'permission_prompt', sid: 'b22-control', acct: ACCOUNT_DIR, pid: String(process.pid), cwd: VENUE, tp: join(ROOT, 'control.jsonl'), ws: '', sf: '' },
].map(r => JSON.stringify(r)).join('\n') + '\n');

// This process reads the audit too (`retire()` below), and `paths.ts` resolves per call — so the
// knob is set here as well as in the child, or the retirement bars read the city's live audit.
process.env.CENSUS_DIR = ROOT;

// The audit half of the join, written the way the hand writes it.
writeFileSync(AUDIT, JSON.stringify({
	ts: new Date().toISOString(), action: 'ignite',
	args: { account: 'personal', stamp: FIXTURE_STAMP, cwd: VENUE, building: 'agents/belvedere', summonsBytes: 12 },
	ok: true, result: { workspace: 'FIXTURE-WS', minted: false, home: 'belvedere', surface: 'FIXTURE-SF' },
}) + '\n');

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}. Close it: lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t | xargs kill`);
	rmSync(ROOT, { recursive: true, force: true });
	process.exit(2);
}

const glass = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: ROOT },
	stdout: 'pipe', stderr: 'pipe',
});

async function until<T>(what: string, probe: () => Promise<T | null>, ms = 60_000): Promise<T> {
	const t0 = Date.now();
	while (Date.now() - t0 < ms) {
		const got = await probe().catch(() => null);
		if (got !== null && got !== false) return got as T;
		await Bun.sleep(200);
	}
	throw new Error(`timed out waiting for ${what}`);
}

try {

await until('the glass', async () => ((await fetch(ORIGIN)).ok ? true : null), 90_000);
console.log(`\n# B22 — placement and the ignited-for join, against the live socket\n`);
console.log(`glass: ${ORIGIN}   census+audit: ${ROOT}   home under test: "${HOME}" (nothing on the desktop wears it)\n`);

const armed = await (await fetch(`${ORIGIN}/hands/halt`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })).status;
if (armed === 503) { console.error('the hands are disarmed — ~/.config/belvedere/env is absent. Nothing to measure.'); throw new Error('hands disarmed'); }

const before = await workspaces();
ok('the home under test does not exist yet — every mint below is this probe\'s own',
	(await named(HOME)).length === 0,
	`${before.length} workspaces on the desktop, ${(await named(HOME)).length} named "${HOME}"`);

// --- 1. with no home, the first ignition MINTS one named for the building ---

const first = await ignite('builder-b22probe-01', BUILDING);
const afterFirst = await named(HOME);
ok('with no matching workspace, the first ignition mints one NAMED FOR THE BUILDING — never `workspace:N`',
	first.ok && first.result?.minted === true && first.result.home === HOME
	&& afterFirst.length === 1 && afterFirst[0]!.id === first.result.workspace
	&& !/\b(?:workspace|surface):\d+\b/.test(JSON.stringify(first.result)),
	`receipt: ${JSON.stringify(first.result ?? first.error)}\n`
	+ `      cmux now carries ${afterFirst.length} workspace named "${HOME}": ${afterFirst.map(w => `${w.ref}/${w.id}`).join(', ')}\n`
	+ `      the receipt's every id is a uuid — no ref survived the breath that made it (P6 F2)`);

const homeUuid = first.result?.workspace ?? '';

// --- 2. the second ignition LANDS in the mint: same workspace, a new tab, no second mint ---

const tabsBefore = await panes(homeUuid);
const second = await ignite('builder-b22probe-02', BUILDING);
const tabsAfter = await panes(homeUuid);
ok('a second ignition lands in the workspace already there — uuid-addressed, one more tab, no second mint',
	second.ok && second.result?.minted === false && second.result.workspace === homeUuid
	&& second.result.surface !== null && tabsAfter.includes(second.result.surface!)
	&& tabsAfter.length === tabsBefore.length + 1 && (await named(HOME)).length === 1,
	`receipt: ${JSON.stringify(second.result ?? second.error)}\n`
	+ `      tabs in ${homeUuid}: ${tabsBefore.length} → ${tabsAfter.length}\n`
	+ `      workspaces named "${HOME}": still ${(await named(HOME)).length} — the name→uuid join landed it, nothing was minted`);

// --- 3. an induced collision mints fresh and audits the ambiguity; neither existing one is touched ---

const decoy = await cmux('workspace', 'create', '--name', HOME, '--cwd', '/tmp', '--focus', 'false');
const decoyUuid = (await named(HOME)).find(w => w.id !== homeUuid)?.id ?? '';
mine.workspaces.add(decoyUuid);
const decoyTabsBefore = await panes(decoyUuid);
const homeTabsBefore = await panes(homeUuid);

const third = await ignite('builder-b22probe-03', BUILDING);
const homes = await named(HOME);
const audit = readFileSync(AUDIT, 'utf8').trim().split('\n').map(l => JSON.parse(l) as { action: string; args: Record<string, unknown>; result: unknown });
const ambiguity = audit.find(l => l.action === 'ignite.ambiguous') ?? null;
ok('two workspaces wearing one name is an ambiguity: mint fresh, audit it, touch neither of his (D10\'s spirit)',
	third.ok && third.result?.minted === true && third.result.workspace !== homeUuid && third.result.workspace !== decoyUuid
	&& homes.length === 3 && ambiguity !== null
	&& (await panes(homeUuid)).length === homeTabsBefore.length
	&& (await panes(decoyUuid)).length === decoyTabsBefore.length,
	`decoy minted: ${decoy.out} → ${decoyUuid}\n`
	+ `      receipt: ${JSON.stringify(third.result ?? third.error)}\n`
	+ `      workspaces named "${HOME}": ${homes.length} — ${homes.map(w => w.id.slice(0, 8)).join(', ')}\n`
	+ `      the audit says: ${JSON.stringify(ambiguity)}\n`
	+ `      tabs untouched: ${homeUuid.slice(0, 8)} ${homeTabsBefore.length} → ${(await panes(homeUuid)).length} · ${decoyUuid.slice(0, 8)} ${decoyTabsBefore.length} → ${(await panes(decoyUuid)).length}`);

// --- 4. the housing join: ignited-for outranks cwd, and only for what Belvedere ignited ---

const state = await (await fetch(`${ORIGIN}/deck/state?b=agents/belvedere`)).json() as {
	census: { sessions: { sid: string; stamp: string | null; building: string | null; waiting: string | null }[] };
	register: { buildings: { building: string; live: number; badges: Record<string, number> }[] };
	queue: { kind: string; key: string; building: string }[];
	workshop: { building: string; badges: Record<string, number> } | null;
};
const ignitedSession = state.census.sessions.find(s => s.sid === 'b22-ignited') ?? null;
const controlSession = state.census.sessions.find(s => s.sid === 'b22-control') ?? null;

ok('a Belvedere-ignited session at the REPO ROOT houses under the building it was ignited FOR (B25 §2)',
	ignitedSession?.building === 'agents/belvedere' && controlSession?.building === 'agents',
	`both sessions sit in ${VENUE}, and the census knows nothing else about where they belong.\n`
	+ `      ignited  ${FIXTURE_STAMP} (the audit says agents/belvedere) → housed "${ignitedSession?.building}"\n`
	+ `      control  ${CONTROL_STAMP} (Belvedere never ignited it)       → housed "${controlSession?.building}"\n`
	+ `      one directory, two answers, and the difference is an audit line — not a guess`);

const row = (name: string) => state.register.buildings.find(b => b.building === name) ?? null;
const queued = (name: string) => state.queue.filter(q => q.building === name && q.kind === 'waiting');

ok('and all three surfaces read that one field: City, Workshop, and the queue',
	(row('agents/belvedere')?.live ?? 0) >= 1 && (row('agents/belvedere')?.badges['waiting'] ?? 0) >= 1
	&& queued('agents/belvedere').length >= 1 && queued('agents').length >= 1
	&& state.workshop?.building === 'agents/belvedere' && (state.workshop.badges['waiting'] ?? 0) >= 1,
	`City     : agents/belvedere live ${row('agents/belvedere')?.live} · waiting badge ${row('agents/belvedere')?.badges['waiting']}`
	+ `   |   agents live ${row('agents')?.live} · waiting badge ${row('agents')?.badges['waiting']}\n`
	+ `      Workshop : ?b=agents/belvedere → "${state.workshop?.building}" · waiting badge ${state.workshop?.badges['waiting']}\n`
	+ `      queue    : ${state.queue.length} item(s) — agents/belvedere ${queued('agents/belvedere').length}, agents ${queued('agents').length}\n`
	+ `      the ignited session is counted under belvedere on every one of them; the control under agents on every one`);

// --- 5. retirement: minted-and-empty only, ours only ---

const hands = await import('../../glass/hands.ts');
const cred = hands.readCredential();
if (!cred.ok) throw new Error(`the credential went away mid-run: ${cred.error}`);

// Felix moves a panel into the home: from here it is his, forever (B25 §3).
await cmux('new-surface', '--type', 'terminal', '--workspace', homeUuid, '--focus', 'false');
for (const sf of await panes(homeUuid)) mine.surfaces.add(sf);
const keptTry = await hands.retire(homeUuid, cred.result);
ok('a minted workspace something was added to is left standing — it has been touched, so it is his',
	!keptTry.ok && (await workspaces()).some(w => w.id === homeUuid)
	&& (keptTry.ok ? '' : keptTry.error).includes('surfaces'),
	`retire(${homeUuid.slice(0, 8)}…) → ${JSON.stringify(keptTry)}\n`
	+ `      it holds ${(await panes(homeUuid)).length} surfaces and is still on the desktop`);

// The third ignition's own workspace: minted, and holding only the session it was minted for.
const clean = third.result!.workspace;
const cleanTabs = (await panes(clean)).length;
const retired = await hands.retire(clean, cred.result);
ok('a workspace we minted and nothing was added to retires cleanly, audited (D55)',
	retired.ok && !(await workspaces()).some(w => w.id === clean),
	`it held ${cleanTabs} surface(s) — the session it was minted for, and nothing else\n`
	+ `      retire(${clean.slice(0, 8)}…) → ${JSON.stringify(retired)}\n`
	+ `      workspaces named "${HOME}" now: ${(await named(HOME)).length}`);
if (retired.ok) mine.workspaces.delete(clean);

// And the one law that makes the rest safe.
const his = before[0]!;
const refused = await hands.retire(his.id, cred.result);
ok('a workspace the audit does not record as OUR mint is never closed, whatever its state',
	!refused.ok && (await workspaces()).some(w => w.id === his.id),
	`retire(${his.id.slice(0, 8)}… "${his.title}") → ${JSON.stringify(refused)}\n`
	+ `      it is one of Felix's, and it is still standing`);

const retireLines = readFileSync(AUDIT, 'utf8').trim().split('\n')
	.map(l => JSON.parse(l) as { action: string }).filter(l => l.action === 'retire');
ok('every retirement — the two refusals and the close — is in the audit',
	retireLines.length === 3,
	`${retireLines.length} retire lines: ${retireLines.map(l => JSON.stringify(l)).join('\n      ')}`);

}
catch (e) {
	failures++;
	console.log(`FAIL  the probe itself threw\n      ${e instanceof Error ? e.message : String(e)}`);
}
finally { await shut(); }

console.log(`\n${failures === 0 ? 'ALL GREEN' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
