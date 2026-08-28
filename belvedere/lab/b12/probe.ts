// **B12's whole DoD, live: the string judges itself and grows while it runs.**
//
//    bun belvedere/lab/b12/probe.ts
//
// One arm click, and then nothing human again. A step lands with an escalation on its row; the
// engine staffs the scoped Architect sitting instead of carding Felix; the sitting rules the row;
// the lane resumes and the step behind it fires. In the middle of that, the flow file **grows** and
// the addition joins the running plan with no second click (D12 — scope-arm). Two more flows, seeded
// so they can never fire, carry the two states that end at his card: a judge that sat and left
// something his, and a judge whose own sitting died badly.
//
// **Tier:** every spawned session is **sonnet·low** — the cheapest tier that holds `auto` permission
// mode (P5 F1, measured 6/6; Felix's relayed instruction at this row's dispatch replaces the order's
// haiku-low with it, because a haiku step stalls at its first write and the arm refuses one anyway).
//
// **Venue:** a scratch city at `~/code/b12-gate-<pid>` — a plain directory, so it is warm on the
// personal account by `~/code`'s own trust entry (B7 F1, verified in `trust.ts` before this was
// written) and, being no git repository and having none above it, a sitting told to "commit in his
// git style" cannot reach the real one. `git status` in `~/code/agents` is compared either side.
//
// Everything the glass WRITES is a temp census home — run logs, summons files, the hands audit, the
// HALT flag. What it READS is the real census, symlinked in, because the liveness half of the
// landing law has to be real (B8 F1: a DoD run does not get to write a beat into the city's own).
//
// **B11 F1 acknowledged:** two of the four flow files here are seeded with an `armed` line, which is
// a live authorization. Both are seeded so that *every* step already carries a fire, and a step
// fired once is never fired again — so neither can spawn anything, and the hands audit is asserted
// against exactly the fires this probe intends.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { homedir, tmpdir } from 'os';
import { join } from 'path';
import { attach, evaluate, launchChrome, openWorks, SET, settle, until } from '../b11/cdp';

const HERE = join(import.meta.dir, '../..');
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4496, CDP_PORT = 9338;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const POLL_MS = 3000;
const AGENTS = join(homedir(), 'code/agents');
const REAL_CENSUS = join(AGENTS, 'summon/log/census/census.jsonl');
const REAL_FLOWS = join(HERE, 'flows');

const ROOT = mkdtempSync(join(tmpdir(), 'b12-'));
const CENSUS = join(ROOT, 'census');
const FLOWS = join(ROOT, 'flows');
/** The fixture city, under `~/code` so it inherits the trust entry a fire needs (B7 F1). */
const CITY = join(homedir(), `code/b12-gate-${process.pid}`);
const BUILDING = join(CITY, 'nb/gate');
/**
 * **What the register calls this building** — and what a flow file must therefore write (B10 F5,
 * second face): doctrine slugs a building against the REAL `~/code`, so a fixture city *inside* it
 * is named relatively while one outside is named by its absolute path. A flow whose `building` is
 * the absolute path here finds no register entry, the engine's `world.rows` comes back empty, and
 * every landing is then judged by the census instead of the board — silently, with no lint.
 */
const SLUG = `b12-gate-${process.pid}/nb/gate`;
const BOARD = join(BUILDING, 'README.md');
const ISSUES = join(BUILDING, 'ISSUES.md');
const run = (name: string) => join(CENSUS, 'flows', `${name}.run.jsonl`);
const HALT = join(ROOT, 'HALT');                                // dirname(censusDir()) — `paths.ts` §haltFlag

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail.split('\n').join('\n      ')}`);
	if (!pass) failures++;
};
const sha = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);

// ---------- the fixture ----------

mkdirSync(join(BUILDING, 'plans'), { recursive: true });
mkdirSync(join(CENSUS, 'flows'), { recursive: true });
mkdirSync(FLOWS, { recursive: true });
symlinkSync(REAL_CENSUS, join(CENSUS, 'census.jsonl'));

const S1_OPEN = '| S1 | [One](plans/s1.md) — the gated step | — | Builder · sonnet-low | OPEN |';
const S1_RAISED = '| S1 | [One](plans/s1.md) — the gated step | — | Builder · sonnet-low | LANDED 2026-08-28 — E1 — the venue policy needs a ruling before S2 |';
const RAISED_ROW = (id: string, work: string) =>
	`| ${id} | [${work}](plans/${id.toLowerCase()}.md) — ${work} | — | Builder · sonnet-low | LANDED 2026-08-28 — E1 — the induced escalation nobody has ruled |`;

writeFileSync(BOARD,
	'# gate — a fixture building\n\n'
	+ 'Nothing here is real work; this whole directory is the probe\'s and is removed at teardown.\n\n'
	+ '**Truing a row here:** a landing record raises an escalation when it writes `E1 — <text>`. It is\n'
	+ 'trued by rewriting that Status cell so the escalation reads `E1 ruled 2026-08-28 — <text>`; the\n'
	+ 'rest of the row is left exactly as it is.\n\n'
	+ '| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n'
	+ `${S1_OPEN}\n`
	+ '| S2 | [Two](plans/s2.md) — the step behind the gate | S1 | Builder · sonnet-low | OPEN |\n'
	+ `${RAISED_ROW('R1', 'Residue')}\n`
	+ `${RAISED_ROW('N1', 'Norecurse')}\n`);
writeFileSync(ISSUES,
	'# gate — the inbox\n\n'
	+ '- 2026-08-28 · Felix (via Belvedere) · **E1 on row S1 is ruled**: the venue policy stands as\n'
	+ '  written and S2 runs at the same venue. Record the ruling on the row.\n\n---\n');
for (const p of ['s1', 's2', 'r1', 'n1']) writeFileSync(join(BUILDING, `plans/${p}.md`), `# ${p.toUpperCase()}\n`);

// The close flow, and the document its kickoff quotes — copied into the fixture city so §5's node
// resolves here exactly as it does in the real one (`docPath` is city-relative).
mkdirSync(join(CITY, 'agents/belvedere'), { recursive: true });
writeFileSync(join(CITY, 'agents/belvedere/README.md'), readFileSync(join(HERE, 'README.md'), 'utf8'));
writeFileSync(join(FLOWS, 'flow-close.flow.json'), readFileSync(join(REAL_FLOWS, 'flow-close.flow.json'), 'utf8'));

const S1_KICK = `You are a Builder at sonnet-low.
Do exactly one thing and nothing else: using the Edit tool on the file ${BOARD}, replace this exact line:
${S1_OPEN}
with this exact line:
${S1_RAISED}
Then stop and wait. Change nothing else anywhere, and do not commit anything.`;

const S2_KICK = `You are a Builder at sonnet-low.
Do exactly one thing and nothing else: write the file ${join(ROOT, 's2-ran.txt')} containing exactly the line: s2 ran after the judge
Then stop and wait. Change nothing else anywhere.`;

const stepOf = (id: string, name: string, kickoff: string, depends: string[] = [], timeoutMinutes = 30) => ({
	id, name, account: 'personal', tier: 'Builder · sonnet-low',
	venue: { kind: 'master', cwd: BUILDING }, depends, timeoutMinutes, kickoff,
});

const GATE_FLOW = join(FLOWS, 'gate.flow.json');
/** Armed with ONE step; `s2` is what grows into it mid-run (§4). */
const gateBody = (steps: unknown[]) => ({
	building: SLUG, scope: 'nb/gate · the reactive gate', created: '2026-08-28',
	concurrency: 1, judgeTier: 'sonnet-low', steps,
});
writeFileSync(GATE_FLOW, JSON.stringify(gateBody([stepOf('s1', 'The gated step', S1_KICK)]), null, '\t'));

/**
 * The two seeded flows, each one step whose row already raises an escalation. They carry the two
 * states that end at his card — a sitting that is **over** with the row still dirty, and one past
 * its own **limit** — and both are seeded so every step already has a fire, which is what makes them
 * unable to spawn anything (B11 F1: an `armed` line is a live authorization).
 */
for (const [name, id, timeout] of [['residue', 'r1', 30], ['norecurse', 'n1', 1]] as const)
	writeFileSync(join(FLOWS, `${name}.flow.json`), JSON.stringify({
		building: SLUG, scope: `nb/gate · the ${name} case`, created: '2026-08-28',
		concurrency: 1, judgeTier: 'sonnet-low',
		steps: [stepOf(id, `The ${name} step`, 'You are a Builder at sonnet-low. This kickoff is never sent: the step already carries a fire.', [], timeout)],
	}, null, '\t'));

const WHY = 'LANDED, and E1 is raised with nothing saying it was ruled (keel §5.1)';
/**
 * A run log written directly — the one thing in this probe that is a fixture rather than a fire.
 * Both sids name **finished** sessions the live census knows, so neither step reads as in flight and
 * neither holds the checkout the gate flow's own steps run in (`plan()` reserves a cwd across every
 * flow in a pass — single-writer physics is city-wide, B11 §3).
 */
function seed(name: string, id: string, stepSid: string, judgeSid: string | null, ageSeconds: number): void {
	const now = Date.now() / 1000;
	const lines = [
		{ ev: 'armed', hash: null, steps: null },
		{ ev: 'fired', step: id, sid: stepSid, workspace: null, stamp: null },
		{ ev: 'paused', step: id, why: WHY },
		{ ev: 'extended', step: `${id}.judge`, why: WHY },
		{ ev: 'fired', step: `${id}.judge`, sid: judgeSid, workspace: null, stamp: null },
	];
	writeFileSync(run(name), lines.map((l, i) => JSON.stringify({
		ts: now - ageSeconds + i, step: null, sid: null, workspace: null, why: null, hash: null, stamp: null, steps: null, ...l,
	})).join('\n') + '\n');
}

// ---------- reading what happened ----------

const linesOf = (name: string) => {
	let text = ''; try { text = readFileSync(run(name), 'utf8'); } catch { /* not yet */ }
	return text.trim().split('\n').filter(Boolean).map(l => JSON.parse(l) as Record<string, unknown>);
};
const at = (name: string, ev: string, step: string | null = null) =>
	linesOf(name).filter(l => l['ev'] === ev && l['step'] === step).at(-1) ?? null;
const auditLines = () => {
	let text = ''; try { text = readFileSync(join(CENSUS, 'hands.jsonl'), 'utf8'); } catch { /* not yet */ }
	return text.trim().split('\n').filter(Boolean)
		.map(l => JSON.parse(l) as { ts: string; action: string; args: Record<string, unknown>; ok: boolean; result: Record<string, unknown> });
};
const fires = () => auditLines().filter(l => l.action === 'fire');

/** The real census, read for one session's transcript path and for a dead session to seed with. */
const censusLines = () => readFileSync(REAL_CENSUS, 'utf8').split('\n');
function fieldOf(sid: string, key: string): string | null {
	for (const l of censusLines().reverse()) {
		if (!l.includes(sid)) continue;
		try {
			const b = JSON.parse(l) as Record<string, unknown>;
			if (b['sid'] === sid && typeof b[key] === 'string' && b[key] !== '') return b[key] as string;
		} catch { /* a partial line */ }
	}
	return null;
}
function firstTurn(transcript: string): string | null {
	for (const l of readFileSync(transcript, 'utf8').split('\n')) {
		if (!l.trim()) continue;
		try {
			const r = JSON.parse(l) as { type?: string; message?: { role?: string; content?: unknown } };
			if (r.type === 'user' && typeof r.message?.content === 'string') return r.message.content;
		} catch { /* a partial line */ }
	}
	return null;
}

/** Finished sessions off the live census — a seeded step that named a live one would hold a slot. */
function deadSids(n: number): string[] {
	const seen = new Map<string, string>();
	for (const l of censusLines()) {
		try {
			const b = JSON.parse(l) as Record<string, unknown>;
			if (typeof b['sid'] === 'string' && typeof b['ev'] === 'string') seen.set(b['sid'], b['ev']);
		} catch { /* partial */ }
	}
	const ended = [...seen].filter(([, ev]) => ev === 'SessionEnd').map(([sid]) => sid);
	if (ended.length < n) throw new Error(`the live census carries fewer than ${n} finished sessions`);
	return ended.slice(-n);
}

const password = (): string => {
	try {
		const text = readFileSync(join(homedir(), '.config/belvedere/env'), 'utf8');
		return text.match(/^\s*CMUX_SOCKET_PASSWORD\s*=\s*(.*?)\s*$/m)?.[1]?.replace(/^(['"])(.*)\1$/, '$2') ?? '';
	} catch { return ''; }
};
const cmux = (...args: string[]) => Bun.spawnSync(['cmux', ...args],
	{ env: { ...process.env, CMUX_QUIET: '1', CMUX_SOCKET_PASSWORD: password() } });

const gitStatus = () => new TextDecoder().decode(Bun.spawnSync(['git', '-C', AGENTS, 'status', '--porcelain']).stdout);
const STATUS_BEFORE = gitStatus();

const post = async (path: string, body: unknown) => {
	const r = await fetch(`${ORIGIN}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return { status: r.status, body: await r.json() as { ok: boolean; error?: string; result?: Record<string, unknown> } };
};

// ---------- stand it up ----------

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}`);
	rmSync(ROOT, { recursive: true, force: true });
	rmSync(CITY, { recursive: true, force: true });
	process.exit(2);
}

// `residue`'s judge is a session that really finished; `norecurse`'s names no session at all and was
// fired an hour ago against a one-minute limit, so the two cards are reached by two different roads.
const dead = deadSids(3);
seed('residue', 'r1', dead[0]!, dead[1]!, 60);
seed('norecurse', 'n1', dead[2]!, 'b12-a-session-the-census-never-saw', 3600);

const glass = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: CENSUS, GLASS_CITY: CITY, FLOWS_DIR: FLOWS },
	stdout: 'pipe', stderr: 'pipe',
});
const chrome = launchChrome(join(ROOT, 'chrome'), CDP_PORT, DECK);

const closed = new Set<string>();
function close(ws: string | null | undefined): void {
	if (!ws || closed.has(ws)) return;
	closed.add(ws);
	const r = cmux('workspace', 'close', ws);
	console.log(`      closed ${ws}: exit ${r.exitCode} ${new TextDecoder().decode(r.stdout).trim()}`);
}

async function shut(): Promise<void> {
	console.log('');
	for (const name of ['gate', 'residue', 'norecurse'])
		for (const l of linesOf(name)) if (l['ev'] === 'fired' && l['workspace']) close(String(l['workspace']));
	rmSync(HALT, { force: true });                          // never leave a flag armed (B8 F1)
	chrome.kill();
	glass.kill();
	await Bun.sleep(400);
	rmSync(ROOT, { recursive: true, force: true });
	rmSync(CITY, { recursive: true, force: true });
}

try {
	await until('the glass', async () => (await fetch(DECK)).ok);
	await attach(CDP_PORT, DECK);
	console.log(`\n# B12 — the reactive gate, and a plan that grows while it runs\n`);
	console.log(`glass: ${DECK}   city: ${CITY}   flows: ${FLOWS}   census(write): ${CENSUS}\n`);

	// --- 1. arm the gate flow, from the rendered plan ---

	await until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));
	await evaluate(SET('context', 'typical'));
	await evaluate(SET('focus', 'expanded'));
	await evaluate(SET('action', 'expanded'));
	await settle();
	await openWorks('nb/gate', POLL_MS);
	await until('the gate flow on the wall', async () => await evaluate<boolean>(
		`document.querySelector('#host-focus [data-flow="gate"][data-on="yes"]') !== null
		 || document.querySelectorAll('#host-focus .node').length === 1`), POLL_MS * 4);
	await settle();

	// **HALT first, and only as instrumentation.** The growth proof must happen before any session
	// opens in the venue, because a session that runs in a plain directory makes Claude write a
	// project entry there — and `trust.ts` reads that entry as a refusal (E1, below), so the join
	// would be refused for a venue that is demonstrably warm. Halted, nothing fires, nothing writes
	// an entry, and the auto-join is measured rather than raced. The flag is this probe's own scratch
	// one; the city's is asserted absent in the same breath (B8 F1).
	const halted = await post('/hands/halt', { requester: 'b12 probe — the growth proof must not race the first fire' });
	if (halted.status !== 200 || !existsSync(HALT) || existsSync(join(AGENTS, 'summon/log/HALT')))
		throw new Error(`the scratch HALT did not take, or the city's own flag is armed: ${JSON.stringify(halted)}`);

	const armedAt = Date.now();
	await evaluate(`document.querySelector('#host-action [data-arm]').click()`);
	await until('the arm', async () => at('gate', 'armed') !== null, 15_000);
	const arm = at('gate', 'armed')!;
	ok('armed by one click on the rendered plan — and the arm records WHAT it armed, step by step',
		Array.isArray(arm['steps']) && (arm['steps'] as string[]).some(m => m.startsWith('s1:')),
		JSON.stringify(arm));

	// --- 2. the plan grows under the arm with no second click (§4, D12) ---

	writeFileSync(GATE_FLOW, JSON.stringify(gateBody([
		stepOf('s1', 'The gated step', S1_KICK),
		stepOf('s2', 'Behind the gate', S2_KICK, ['s1']),
	]), null, '\t'));
	await until('the scope-arm auto-join', async () => linesOf('gate').filter(l => l['ev'] === 'armed').length === 2, 30_000);
	const rearm = linesOf('gate').filter(l => l['ev'] === 'armed').at(-1)!;
	ok('**an in-scope addition joins the running flow with no click** — the engine re-arms itself (D12)',
		String(rearm['why']).includes('scope-arm auto-join (D12)') && String(rearm['why']).includes('s2')
		&& (rearm['steps'] as string[]).some(m => m.startsWith('s2:'))
		&& fires().length === 0,
		`armed #1 covered ${JSON.stringify((at('gate', 'armed')!['steps'] as string[]))}\n`
		+ `armed #2 covers  ${JSON.stringify(rearm['steps'] as string[])}\n`
		+ `${JSON.stringify(rearm['why'])}\nand nothing has fired: the lane is halted, so this is growth measured, not raced`);

	// --- 3. the halt clears and the string starts ---

	rmSync(HALT, { force: true });
	await until('s1 to fire', async () => at('gate', 'fired', 's1') !== null, 60_000);
	const f1 = at('gate', 'fired', 's1')!;

	// --- 4. the landing raises an escalation, and the gate staffs the sitting ---

	await until('s1 to land its row with E1 raised', async () => at('gate', 'paused', 's1') !== null, 420_000);
	await until('the judge to fire', async () => at('gate', 'fired', 's1.judge') !== null, 60_000);
	const p1 = at('gate', 'paused', 's1')!;
	const ext = at('gate', 'extended', 's1.judge')!;
	const fj = at('gate', 'fired', 's1.judge')!;
	const gap = (fj['ts'] as number) - (p1['ts'] as number);
	ok('**the gated landing fires the judge — the sovereign is not carded, the sitting is staffed**',
		String(p1['why']).includes('E1') && ext !== null && gap >= 0 && gap < 30,
		`landing edge  ${new Date((p1['ts'] as number) * 1000).toISOString()}  ${JSON.stringify(p1['why'])}\n`
		+ `extended      ${JSON.stringify(ext['step'])} — ${JSON.stringify(ext['why'])}\n`
		+ `judge fired   ${new Date((fj['ts'] as number) * 1000).toISOString()}  ${String(fj['workspace'])}\n`
		+ `**gap ${gap.toFixed(3)} s** — zero human touches; arm → judge fired ${(((fj['ts'] as number) * 1000 - armedAt) / 1000).toFixed(1)} s`);

	const aj = fires().find(l => l.args['stamp'] === fj['stamp'])!;
	ok('what it fired is the scoped Architect sitting, at the flow’s judge tier, through the same hand',
		aj !== undefined && aj.ok && aj.args['model'] === 'sonnet' && aj.args['effort'] === 'low'
		&& String(aj.args['stamp']).startsWith('architect-') && aj.args['cwd'] === BUILDING,
		`audit: ${JSON.stringify({ ts: aj?.ts, stamp: aj?.args['stamp'], model: aj?.args['model'], effort: aj?.args['effort'], cwd: aj?.args['cwd'] })}`);

	await until('the census to name the judge’s session', async () => at('gate', 'fired', 's1.judge')!['sid'] !== null, 180_000);
	const jsid = String(at('gate', 'fired', 's1.judge')!['sid']);
	const jtp = fieldOf(jsid, 'tp');
	const jturn = jtp ? firstTurn(jtp) : null;
	const jsummons = readFileSync(String(aj.result['summonsPath']), 'utf8');
	ok('and its first user turn IS the composed sitting — byte-exact, page-side and transcript-side',
		jturn !== null && sha(jturn) === sha(jsummons) && sha(jsummons) === aj.result['sha']
		&& jsummons.startsWith('You are an Architect at sonnet-low.') && jsummons.includes('row S1'),
		`sid ${jsid}\nsummons ${String(aj.result['summonsPath'])} — sha ${sha(jsummons)}, ${jsummons.length} B\n`
		+ `transcript ${jtp} first user turn — sha ${jturn === null ? '(none)' : sha(jturn)}, ${jturn?.length ?? 0} B\n`
		+ `the hands' own receipt — sha ${String(aj.result['sha'])}`);

	close(String(f1['workspace']));                          // ≤2 concurrent city-wide (D55)

	// --- 5. the drawing: an inserted node on the lane, and the lane paused behind it ---

	await until('the drawing to catch up', async () => await evaluate<boolean>(
		`!!document.querySelector('#host-focus .node[data-node="s1.judge"]')`), POLL_MS * 5);
	const drawn = await evaluate<{ inserted: string; ring: string; nodes: string; edge: boolean; s2: string }>(`(() => {
		const j = document.querySelector('#host-focus .node[data-node="s1.judge"]');
		return {
			inserted: j.dataset.inserted,
			ring: j.dataset.ring,
			nodes: [...document.querySelectorAll('#host-focus .node')].map(x => x.dataset.node + ':' + x.dataset.ring).join(' '),
			edge: !!document.querySelector('#host-focus svg.wires path.wire[data-from="s1"][data-to="s1.judge"]'),
			s2: document.querySelector('#host-focus .node[data-node="s2"]').dataset.ring,
		};
	})()`);
	ok('the DAG draws the inserted node, wired to the step it was staffed for, and the lane is paused',
		drawn.inserted === 'yes' && drawn.edge && drawn.s2 === 'declared' && at('gate', 'fired', 's2') === null,
		`nodes: ${drawn.nodes}\ninserted=${drawn.inserted} · edge s1→s1.judge=${drawn.edge} · s2 ring=${drawn.s2}, unfired`);

	// --- 6. resume on truth: the verdict is read off the files ---

	await until('the judge to true the row', async () => at('gate', 'resumed', 's1') !== null, 600_000);
	await until('s2 to fire', async () => at('gate', 'fired', 's2') !== null, 60_000);
	const res = at('gate', 'resumed', 's1')!;
	const f2 = at('gate', 'fired', 's2')!;
	const jland = at('gate', 'landed', 's1.judge')!;
	ok('**the judge lands, the lane resumes, and the step behind the gate fires** — still zero touches',
		jland !== null && String(res['why']).includes('cleared') && (f2['ts'] as number) >= (res['ts'] as number),
		`the row now reads: ${readFileSync(BOARD, 'utf8').split('\n').find(l => l.startsWith('| S1'))}\n`
		+ `judge landed  ${new Date((jland['ts'] as number) * 1000).toISOString()}  ${JSON.stringify(jland['why'])}\n`
		+ `resumed       ${new Date((res['ts'] as number) * 1000).toISOString()}  ${JSON.stringify(res['why'])}\n`
		+ `s2 fired      ${new Date((f2['ts'] as number) * 1000).toISOString()}  ${String(f2['workspace'])}\n`
		+ `**gap ${((f2['ts'] as number) - (res['ts'] as number)).toFixed(3)} s**`);
	close(String(fj['workspace']));

	// --- 7. the residue: the judge sat, and what it left is his ---

	await until('the residue card', async () => at('residue', 'paused', 'r1.judge') !== null, POLL_MS * 10);
	const card = at('residue', 'paused', 'r1.judge')!;
	await evaluate(`document.querySelector('#host-focus [data-flow="residue"]').click()`);
	await until('the residue flow on the wall', async () => await evaluate<boolean>(
		`!!document.querySelector('#host-focus .node[data-node="r1.judge"][data-ring="paused"]')`), POLL_MS * 4);
	await settle();
	const his = await evaluate<{ buttons: number; links: number; fire: number; felix: boolean; text: string }>(`(() => {
		const n = document.querySelector('#host-focus .node[data-node="r1.judge"]');
		const markup = n.outerHTML.split(n.textContent).join('');
		return {
			buttons: n.querySelectorAll('button').length,
			links: n.querySelectorAll('a').length,
			fire: (markup.match(/hands\\/fire/g) ?? []).length,
			felix: n.classList.contains('felix-card'),
			text: (n.querySelector('.his-card')?.textContent ?? '').slice(0, 160),
		};
	})()`);
	ok('the judge sat and the row is still not clean → **his card, and nothing on it fires**',
		String(card['why']).includes("this one is Felix's") && his.felix
		&& his.buttons === 0 && his.links === 0 && his.fire === 0,
		`run: ${JSON.stringify(card['why'])}\n`
		+ `card: felix-card=${his.felix} · ${his.buttons} buttons · ${his.links} links · hands/fire ${his.fire}× in its markup\n`
		+ `on screen: ${his.text}`);

	// --- 8. no recursion ---

	await until('the no-recursion card', async () => at('norecurse', 'paused', 'n1.judge') !== null, POLL_MS * 10);
	const nore = linesOf('norecurse');
	ok('**a judge is never judged**: past its own limit it cards him, and no second judge is inserted',
		String(at('norecurse', 'paused', 'n1.judge')!['why']).includes('a judge is never judged')
		&& String(at('norecurse', 'paused', 'n1.judge')!['why']).includes('1 minute limit')
		&& nore.filter(l => l['ev'] === 'extended').length === 1
		&& !nore.some(l => String(l['step'] ?? '').includes('.judge.judge')),
		`run: ${nore.map(l => `${l['ev']}${l['step'] ? `:${l['step']}` : ''}`).join(' → ')}\n`
		+ `${JSON.stringify(at('norecurse', 'paused', 'n1.judge')!['why'])}`);

	// --- 9. an EDIT still pauses for his click ---

	const grownHash = linesOf('gate').filter(l => l['ev'] === 'armed').at(-1)!['hash'];
	writeFileSync(GATE_FLOW, JSON.stringify(gateBody([
		stepOf('s1', 'The gated step', `${S1_KICK}\nAnd one more thing nobody authorized.`),
		stepOf('s2', 'Behind the gate', S2_KICK, ['s1']),
	]), null, '\t'));
	await until('the amendment to pause the flow', async () => {
		const last = linesOf('gate').filter(l => l['step'] === null).at(-1);
		return last?.['ev'] === 'paused';
	}, POLL_MS * 8);
	const paused = linesOf('gate').filter(l => l['step'] === null).at(-1)!;
	ok('an EDIT to a step already armed still stops for his click — and the pause names the step',
		String(paused['why']).includes('s1 was edited since the arm')
		&& linesOf('gate').filter(l => l['ev'] === 'armed').at(-1)!['hash'] === grownHash,
		`${JSON.stringify(paused['why'])}\nno third arm was recorded: still ${JSON.stringify(String(grownHash).slice(0, 12))}…`);

	// --- 10. the close flow, on disk and unarmed ---

	type Snap = { works: { flows: { name: string; armedAt: number | null; nodes: { id: string; gate: string; card: string | null; kickoff: string; awaitingPass: boolean }[] }[] } | null };
	const closeSnap = await (await fetch(`${ORIGIN}/deck/state?b=${encodeURIComponent('agents/belvedere')}`)).json() as Snap;
	const closeFlow = closeSnap.works?.flows.find(f => f.name === 'flow-close') ?? null;
	const g2 = closeFlow?.nodes.find(n => n.id === 'g2') ?? null;
	const verdict = closeFlow?.nodes.find(n => n.id === 'verdict') ?? null;
	const readme = readFileSync(join(HERE, 'README.md'), 'utf8').split('\n');
	const fences: string[] = [];
	for (let open = null as number | null, i = 0; i < readme.length; i++) {
		if (!readme[i]!.startsWith('```')) continue;
		if (open === null) open = i; else { fences.push(readme.slice(open + 1, i).join('\n')); open = null; }
	}
	ok('**the close flow exists**: it parses, it renders, its G2 kickoff is the README’s own fence, and it is unarmed',
		closeFlow !== null && closeFlow.armedAt === null && closeFlow.nodes.length === 2
		&& g2 !== null && sha(g2.kickoff) === sha(fences[4]!)
		&& verdict !== null && verdict.gate === 'felix' && verdict.awaitingPass === false,
		`flow-close · ${closeFlow?.nodes.length} nodes · armedAt ${closeFlow?.armedAt}\n`
		+ `g2 kickoff sha ${g2 ? sha(g2.kickoff) : '(none)'} (${g2?.kickoff.length ?? 0} B) ≡ README fence #5 sha ${sha(fences[4]!)} (${fences[4]!.length} B)\n`
		+ `verdict: gate=${verdict?.gate} awaitingPass=${verdict?.awaitingPass} — ${String(verdict?.card).slice(0, 90)}…`);

	// --- 11. the bill: exactly the fires this probe intended, and the real repo untouched ---

	ok('three fires in the whole hands audit — the two declared steps and the one inserted sitting',
		fires().length === 3 && fires().every(l => l.ok),
		fires().map(l => `${l.ts} ${String(l.args['stamp'])} ${String(l.args['model'])}·${String(l.args['effort'])}`).join('\n'));

	ok('and `git status` in the real repo is byte-identical either side of the run',
		gitStatus() === STATUS_BEFORE,
		`before ${JSON.stringify(STATUS_BEFORE)}\nafter  ${JSON.stringify(gitStatus())}`);

	console.log(`\n${failures === 0 ? 'ALL GREEN' : `${failures} FAILED`}\n`);
	for (const name of ['gate', 'residue', 'norecurse'])
		console.log(`${name}:\n` + linesOf(name).map(l => JSON.stringify(l)).join('\n'));
}
catch (e) {
	console.error('\nprobe threw:', e);
	for (const name of ['gate', 'residue', 'norecurse'])
		console.error(`${name}:\n` + linesOf(name).map(l => JSON.stringify(l)).join('\n'));
	failures++;
}
finally {
	// B16's addendum: teardown runs BEFORE the failure is reported, or a thrown probe leaves a live
	// session open against the batch's ≤2 rule.
	await shut();
	process.exit(failures === 0 ? 0 : 1);
}
