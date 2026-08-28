// B11's four levers, on ONE live session:
//
//   D10        — a run log the engine cannot read stops everything, and nothing fires
//   HALT       — the flag's first consumer: the next fire is refused, and the hands audit stays clean
//   amend      — the flow file moves under an armed flow: new fires pause, in flight runs on
//   re-arm     — one click covers the amendment, and the step the two levers held FIRES
//   timeout    — past its limit the step pauses; the session is untouched, pid still alive
//
//    bun belvedere/lab/b11/lever.ts
//
// One flow, one step, one spawn — because each lever's proof needs the SAME step to be provably
// fireable, and the control for "nothing fired" is the fire that happens the moment the levers are
// released. The venue is `~/code/agents` (trusted ×3, B7 F1) at **sonnet·low**, the cheapest tier
// that holds `auto` (P5 F1, amended batch-5 lane rule); the session writes one file in the probe's
// own temp directory and touches nothing else.
//
// Everything the glass WRITES goes to a temp census home — the run log, the summons file, the hands
// audit and **the HALT flag** (B8 F1: never leave the city armed). What it READS is the real census,
// symlinked in, because the liveness half of the landing law has to be real.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { join } from 'path';
import { until } from './cdp';

const HERE = join(import.meta.dir, '../..');
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4493;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const REAL_CENSUS = join(homedir(), 'code/agents/summon/log/census/census.jsonl');

const ROOT = mkdtempSync(join(tmpdir(), 'b11-lever-'));
const CENSUS = join(ROOT, 'census');
const CITY = join(ROOT, 'city');
const FLOWS = join(ROOT, 'flows');
const BUILDING = join(CITY, 'nb/lever');
const HALT = join(ROOT, 'HALT');                                // dirname(censusDir()) — `paths.ts` §haltFlag
const RUN = join(CENSUS, 'flows', 'lever.run.jsonl');
const PROOF = join(ROOT, 'lever-did-work.txt');

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

mkdirSync(join(BUILDING, 'plans'), { recursive: true });
mkdirSync(join(CENSUS, 'flows'), { recursive: true });
mkdirSync(FLOWS, { recursive: true });
symlinkSync(REAL_CENSUS, join(CENSUS, 'census.jsonl'));         // read the real beats, write nothing to them

writeFileSync(join(BUILDING, 'README.md'),
	'# lever — a fixture building\n\nNothing here is real work; `lab/` is disposable by DOCTRINE §3.\n\n'
	+ '| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n'
	+ '| Z | [Unrelated](plans/z.md) — a row this flow does not declare | — | Builder · opus-high | OPEN |\n');
writeFileSync(join(BUILDING, 'plans/z.md'), '# Z\n');

const FLOW_FILE = join(FLOWS, 'lever.flow.json');
const flowBody = (name: string) => ({
	building: BUILDING, scope: 'nb/lever · the levers', created: '2026-08-28',
	concurrency: 1, judgeTier: 'fable-high',
	steps: [{
		id: 'x', name, account: 'personal', tier: 'Builder · sonnet-low',
		venue: { kind: 'master', cwd: '~/code/agents' }, depends: [],
		timeoutMinutes: 1,
		kickoff: `You are a Builder at sonnet-low.\nWrite the file ${PROOF} containing exactly the line: lever did the work\nChange nothing else anywhere. Then stop and wait.`,
	}],
});
writeFileSync(FLOW_FILE, JSON.stringify(flowBody('The lever'), null, '\t'));

const runLog = () => { try { return readFileSync(RUN, 'utf8'); } catch { return ''; } };
const runLines = () => runLog().trim().split('\n').filter(Boolean).map(l => {
	try { return JSON.parse(l) as Record<string, unknown>; } catch { return { ev: 'UNPARSEABLE' }; }
});
const audit = () => { try { return readFileSync(join(CENSUS, 'hands.jsonl'), 'utf8'); } catch { return ''; } };
const auditActions = () => audit().trim().split('\n').filter(Boolean)
	.map(l => (JSON.parse(l) as { action: string }).action);
const has = (ev: string, why?: string) => runLines().some(l =>
	l['ev'] === ev && (why === undefined || String(l['why'] ?? '').includes(why)));

const post = async (path: string, body: unknown) => {
	const r = await fetch(`${ORIGIN}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return { status: r.status, body: await r.json() as { ok: boolean; error?: string; result?: Record<string, unknown> } };
};

type Snap = {
	works: { flows: { name: string; hash: string; armedHash: string | null; last: { ev: string; why: string | null } | null }[]; halt: { text: string } | null } | null;
	census: { sessions: { sid: string; pid: number | null; state: string; stamp: string | null }[] };
};
const state = async (): Promise<Snap> =>
	await (await fetch(`${ORIGIN}/deck/state?b=${encodeURIComponent(BUILDING)}`)).json() as Snap;

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}`);
	rmSync(ROOT, { recursive: true, force: true });
	process.exit(2);
}

const glass = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: CENSUS, GLASS_CITY: CITY, FLOWS_DIR: FLOWS },
	stdout: 'pipe', stderr: 'pipe',
});

/** The one thing this probe spawns into Felix's desktop, closed by hand at the end (D55). */
let workspace: string | null = null;
async function shut(): Promise<void> {
	if (workspace) {
		const closed = Bun.spawnSync(['cmux', 'workspace', 'close', workspace],
			{ env: { ...process.env, CMUX_QUIET: '1', CMUX_SOCKET_PASSWORD: password() } });
		console.log(`\nclosed ${workspace}: exit ${closed.exitCode} ${new TextDecoder().decode(closed.stdout).trim()}`);
	}
	glass.kill();
	await Bun.sleep(300);
	rmSync(ROOT, { recursive: true, force: true });
}

function password(): string {
	try {
		const text = readFileSync(join(homedir(), '.config/belvedere/env'), 'utf8');
		return text.match(/^\s*CMUX_SOCKET_PASSWORD\s*=\s*(.*?)\s*$/m)?.[1]?.replace(/^(['"])(.*)\1$/, '$2') ?? '';
	} catch { return ''; }
}

try {
	await until('the glass', async () => (await fetch(`${ORIGIN}/deck`)).ok);
	console.log(`\n# B11 — the four levers, on one live session\n`);
	console.log(`glass: ${ORIGIN}   flows: ${FLOWS}   census(write): ${CENSUS}   HALT: ${HALT}\n`);

	// --- D10: an unreadable run log stops everything ---
	//
	// Seeded BEFORE the arm rather than after it, deliberately: the arm kicks the tick, so a
	// corruption written after the 200 would be racing the engine it is meant to stop.
	writeFileSync(RUN, '{ this is not a run line\n');
	const armed = await post('/flow/lever/arm', {});
	await Bun.sleep(9000);                                        // two full ticks
	ok('D10 — a run log the engine cannot read pauses the flow and fires NOTHING',
		armed.status === 200 && has('paused', 'unreadable') && !has('fired') && audit() === '',
		`arm ${armed.status} · ${runLines().map(l => `${l['ev']}${l['why'] ? `(${String(l['why']).slice(0, 40)}…)` : ''}`).join(' → ')}\n`
		+ `      hands audit: ${JSON.stringify(audit())}`);

	const snapD10 = await state();
	ok('…and the page says so in the engine’s own words',
		(snapD10.works?.flows[0]?.last?.why ?? '').includes('unreadable'),
		`the Works reads: ${snapD10.works?.flows[0]?.last?.ev} — ${snapD10.works?.flows[0]?.last?.why}`);

	// --- HALT: set through the glass's own hand, at a scratch venue ---

	const halted = await post('/hands/halt', { requester: 'b11 lever probe' });
	ok('HALT is set through the glass’s own hand, and at a SCRATCH venue (B8 F1: never leave the city armed)',
		halted.status === 200 && existsSync(HALT) && !existsSync(join(homedir(), 'code/agents/summon/log/HALT')),
		`${halted.status} ${JSON.stringify(halted.body.result)}\n      the city's real flag: ${existsSync(join(homedir(), 'code/agents/summon/log/HALT')) ? 'ARMED — STOP' : 'absent ✓'}`);

	// The log is repaired — the probe owns this file, and it is telemetry, not truth.
	const hash1 = (await state()).works!.flows[0]!.hash;
	writeFileSync(RUN, JSON.stringify({ ts: Date.now() / 1000, ev: 'armed', step: null, sid: null, workspace: null, why: null, hash: hash1, stamp: null }) + '\n');
	await until('the engine to refuse under HALT', async () => has('refused', 'HALT'), 20_000);
	ok('HALT — the next fire is REFUSED: a `refused` line in run-state, and nothing in the hands audit',
		has('refused', 'HALT') && !has('fired') && auditActions().every(a => a === 'halt'),
		`${runLines().map(l => l['ev']).join(' → ')}\n      hands audit actions: ${JSON.stringify(auditActions())}`);

	const snapHalt = await state();
	ok('…and the drawing says HALT, in the flag’s own words',
		(snapHalt.works?.halt?.text ?? '').includes('b11 lever probe'),
		`the Works reads: ${snapHalt.works?.halt?.text}`);

	// --- amend: the plan moves under an armed flow ---

	writeFileSync(FLOW_FILE, JSON.stringify(flowBody('The lever amended'), null, '\t'));
	rmSync(HALT, { force: true });                                 // HALT cleared: only the amendment holds it now
	await until('the engine to notice the amendment', async () => has('paused', 'amended'), 20_000);
	const snapAmend = await state();
	ok('amend — the flow file moves under an armed flow: new fires pause, and the delta is on the page',
		has('paused', 'amended') && !has('fired')
		&& snapAmend.works!.flows[0]!.armedHash === hash1 && snapAmend.works!.flows[0]!.hash !== hash1,
		`armed ${hash1.slice(0, 12)}… · on disk ${snapAmend.works!.flows[0]!.hash.slice(0, 12)}…\n`
		+ `      ${runLines().map(l => l['ev']).join(' → ')}`);

	// --- re-arm: one click covers it, and the step three levers held finally FIRES ---

	const hash2 = snapAmend.works!.flows[0]!.hash;
	const rearm = await post('/flow/lever/arm', { hash: hash2 });
	await until('the fire', async () => has('fired'), 60_000);
	const fired = runLines().find(l => l['ev'] === 'fired')!;
	workspace = String(fired['workspace'] ?? '') || null;
	const fireAudit = audit().trim().split('\n').map(l => JSON.parse(l) as { action: string; args: Record<string, unknown>; ok: boolean; result: unknown })
		.find(l => l.action === 'fire');
	ok('re-arm — one click covers the amendment, and the step HALT and D10 held now fires for real',
		rearm.status === 200 && rearm.body.result?.['hash'] === hash2
		&& has('fired') && fireAudit !== undefined && fireAudit.ok
		&& fireAudit.args['model'] === 'sonnet' && fireAudit.args['effort'] === 'low',
		`re-arm ${rearm.status} → ${String(rearm.body.result?.['hash'] ?? '').slice(0, 12)}…\n`
		+ `      run: ${JSON.stringify(fired)}\n`
		+ `      audit: ${JSON.stringify(fireAudit)}`);

	// --- the join: a fire returns a workspace, and the census names its session ---

	await until('the census to name the session', async () => runLines().some(l => l['ev'] === 'fired' && l['sid'] !== null), 90_000);
	const joined = runLines().filter(l => l['ev'] === 'fired').at(-1)!;
	ok('the join — the stamp carries the fire until the census reads it off the transcript, then the sid does',
		joined['sid'] !== null && joined['stamp'] === fired['stamp'],
		`stamp ${String(fired['stamp'])} · workspace ${String(fired['workspace'])} · sid ${String(joined['sid'])}`);

	// --- timeout: past its limit the step pauses, and the session is untouched ---

	await until('the timeout', async () => has('paused', 'timeout'), 150_000);
	const snapTimeout = await state();
	const sid = String(joined['sid']);
	const session = snapTimeout.census.sessions.find(s => s.sid === sid);
	const alive = session?.pid !== null && session?.pid !== undefined && (() => {
		try { process.kill(session.pid!, 0); return true; } catch (e) { return (e as NodeJS.ErrnoException).code === 'EPERM'; }
	})();
	ok('timeout — past its limit the step PAUSES, and the engine kills nothing: the session is still alive',
		has('paused', 'timeout') && alive === true,
		`${runLines().map(l => `${l['ev']}${l['why'] ? `(${String(l['why']).slice(0, 30)}…)` : ''}`).join(' → ')}\n`
		+ `      session ${sid} · pid ${session?.pid} · census state "${session?.state}" · kill -0 ${alive ? 'ALIVE' : 'gone'}`);

	ok('and the step did real tool work at sonnet·low, unattended — P5’s Q2 shape, one file written',
		existsSync(PROOF) && readFileSync(PROOF, 'utf8').includes('lever did the work'),
		existsSync(PROOF) ? `${PROOF}: ${JSON.stringify(readFileSync(PROOF, 'utf8'))}` : `${PROOF} was never written`);

	console.log(`\n${failures === 0 ? 'ALL GREEN' : `${failures} FAILED`}\n`);
}
catch (e) {
	console.error('\nlever threw:', e);
	console.error('run log:\n' + runLog());
	failures++;
}
finally {
	rmSync(HALT, { force: true });
	await shut();
	process.exit(failures === 0 ? 0 : 1);
}
