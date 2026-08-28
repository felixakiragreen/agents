// **The chapter's whole point, measured: a flow that runs itself.**
//
//    bun belvedere/lab/b11/smoke.ts
//
// A declared three-step flow — two real sessions doing real tool work, then a Felix-card. Armed
// from the rendered page in a real browser; step 1 fires; step 1 lands; **step 2 fires with no human
// touch**, into a worktree the engine cut first; the card pauses the lane and nothing on it fires.
// The number this row exists to produce is the gap between step 1's landing edge and step 2's fire.
//
// Both sessions run at **sonnet·low** — the cheapest tier that holds `auto` permission mode (P5 F1;
// the batch-5 lane rule as amended by P5's own landing, and Felix's relayed instruction at this
// row's dispatch). A haiku step would stall at its first Write, silently, and the arm refuses one.
//
// Everything the glass WRITES is a temp census home (run log, summons, hands audit, HALT). What it
// READS is the real census, symlinked in: the liveness half of the landing law has to be real. The
// two spawned workspaces and the cut worktree are torn down in `finally`, always (D55).

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { homedir, tmpdir } from 'os';
import { join } from 'path';
import { attach, evaluate, launchChrome, openWorks, SET, settle, until } from './cdp';

const HERE = join(import.meta.dir, '../..');
const SERVER = join(HERE, 'glass/server.ts');
const PORT = 4494, CDP_PORT = 9336;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DECK = `${ORIGIN}/deck`;
const POLL_MS = 3000;
const AGENTS = join(homedir(), 'code/agents');
const REAL_CENSUS = join(AGENTS, 'summon/log/census/census.jsonl');

const ROOT = mkdtempSync(join(tmpdir(), 'b11-smoke-'));
const CENSUS = join(ROOT, 'census');
const CITY = join(ROOT, 'city');
const FLOWS = join(ROOT, 'flows');
const BUILDING = join(CITY, 'nb/smoke');
const BOARD = join(BUILDING, 'README.md');
const RUN = join(CENSUS, 'flows', 'smoke.run.jsonl');
const BRANCH = `bv/b11-smoke-${process.pid}`;
const WORKTREE = join(AGENTS, '.claude/worktrees', BRANCH);
const PROOF1 = join(ROOT, 's1-did-work.txt');
const CWD_PROOF = 'b11-smoke-cwd.txt';                          // relative on purpose: it proves the cwd

let failures = 0;
const ok = (label: string, pass: boolean, detail: string) => {
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
	if (!pass) failures++;
};

mkdirSync(join(BUILDING, 'plans'), { recursive: true });
mkdirSync(join(CENSUS, 'flows'), { recursive: true });
mkdirSync(FLOWS, { recursive: true });
symlinkSync(REAL_CENSUS, join(CENSUS, 'census.jsonl'));

// The board IS the landing sensor for these steps (§4's interim law): a step id that is a row here
// lands when that row parses LANDED clean, which is what each session is asked to make true.
const ROW1 = '| S1 | [Step one](plans/s1.md) — the first real step | — | Builder · sonnet-low | OPEN |';
const ROW2 = '| S2 | [Step two](plans/s2.md) — the worktree step | S1 | Digger · sonnet-low | OPEN |';
const DONE1 = '| S1 | [Step one](plans/s1.md) — the first real step | — | Builder · sonnet-low | LANDED 2026-08-28 — step one did its work |';
const DONE2 = '| S2 | [Step two](plans/s2.md) — the worktree step | S1 | Digger · sonnet-low | LANDED 2026-08-28 — step two did its work |';

writeFileSync(BOARD,
	'# smoke — a fixture building\n\nNothing here is real work; `lab/` is disposable by DOCTRINE §3.\n\n'
	+ '| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n'
	+ `${ROW1}\n${ROW2}\n`
	+ '| S3 | [His card](plans/s3.md) — the close sitting | S2 | Architect · fable-high | OPEN |\n');
for (const p of ['s1', 's2', 's3']) writeFileSync(join(BUILDING, `plans/${p}.md`), `# ${p.toUpperCase()}\n`);

const KICK1 = `You are a Builder at sonnet-low.
Do exactly two things and nothing else:
1. Write the file ${PROOF1} containing exactly the line: s1 did the work
2. Using the Edit tool on the file ${BOARD}, replace this exact line:
${ROW1}
with this exact line:
${DONE1}
Then stop and wait. Change nothing else anywhere.`;

const KICK2 = `You are a Digger at sonnet-low.
Do exactly two things and nothing else:
1. Write the file ${CWD_PROOF} — a RELATIVE path, so it lands in your working directory — containing exactly the line: s2 ran here
2. Using the Edit tool on the file ${BOARD}, replace this exact line:
${ROW2}
with this exact line:
${DONE2}
Then stop and wait. Change nothing else anywhere.`;

writeFileSync(join(FLOWS, 'smoke.flow.json'), JSON.stringify({
	building: BUILDING, scope: 'nb/smoke · the engine’s first string', created: '2026-08-28',
	concurrency: 1, judgeTier: 'fable-high',
	steps: [
		{ id: 's1', name: 'Step one', account: 'personal', tier: 'Builder · sonnet-low', venue: { kind: 'master', cwd: '~/code/agents' }, depends: [], timeoutMinutes: 20, kickoff: KICK1 },
		{ id: 's2', name: 'Step two', account: 'personal', tier: 'Digger · sonnet-low', venue: { kind: 'worktree', repo: '~/code/agents', branch: BRANCH }, depends: ['s1'], timeoutMinutes: 20, kickoff: KICK2 },
		{
			id: 's3', name: 'His card', account: 'personal', tier: 'Architect · fable-high',
			venue: { kind: 'master', cwd: '~/code/agents' }, depends: ['s2'], timeoutMinutes: 20,
			gate: { kind: 'felix', card: 'The close sitting is his to open. Nothing on this card fires; the pass is his.' },
			kickoff: 'You are an Architect at fable-high. This kickoff is never sent by this probe.',
		},
	],
}, null, '\t'));

// ---------- reading what happened ----------

const runLines = () => {
	let text = ''; try { text = readFileSync(RUN, 'utf8'); } catch { /* not yet */ }
	return text.trim().split('\n').filter(Boolean).map(l => JSON.parse(l) as Record<string, unknown>);
};
const line = (ev: string, step: string) => runLines().filter(l => l['ev'] === ev && l['step'] === step).at(-1) ?? null;
const auditLines = () => {
	let text = ''; try { text = readFileSync(join(CENSUS, 'hands.jsonl'), 'utf8'); } catch { /* not yet */ }
	return text.trim().split('\n').filter(Boolean)
		.map(l => JSON.parse(l) as { ts: string; action: string; args: Record<string, unknown>; ok: boolean; result: Record<string, unknown> });
};

/** The real census, read for one session's transcript path — the join the glass itself uses. */
function transcriptOf(sid: string): string | null {
	const text = readFileSync(REAL_CENSUS, 'utf8');
	for (const l of text.split('\n').reverse()) {
		if (!l.includes(sid)) continue;
		try {
			const b = JSON.parse(l) as Record<string, unknown>;
			if (b['sid'] === sid && typeof b['tp'] === 'string' && b['tp'] !== '') return b['tp'];
		} catch { /* a partial line */ }
	}
	return null;
}

/** The first USER turn in a transcript — the bytes the summons became (B7's byte chain). */
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

const sha = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);

const post = async (path: string, body: unknown) => {
	const r = await fetch(`${ORIGIN}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return { status: r.status, body: await r.json() as { ok: boolean; error?: string; result?: Record<string, unknown> } };
};

function password(): string {
	try {
		const text = readFileSync(join(homedir(), '.config/belvedere/env'), 'utf8');
		return text.match(/^\s*CMUX_SOCKET_PASSWORD\s*=\s*(.*?)\s*$/m)?.[1]?.replace(/^(['"])(.*)\1$/, '$2') ?? '';
	} catch { return ''; }
}
const cmux = (...args: string[]) => Bun.spawnSync(['cmux', ...args],
	{ env: { ...process.env, CMUX_QUIET: '1', CMUX_SOCKET_PASSWORD: password() } });

if (await fetch(ORIGIN).then(() => true).catch(() => false)) {
	console.error(`something is already serving ${ORIGIN}`);
	rmSync(ROOT, { recursive: true, force: true });
	process.exit(2);
}

const glass = Bun.spawn(['bun', SERVER], {
	env: { ...process.env, GLASS_PORT: String(PORT), CENSUS_DIR: CENSUS, GLASS_CITY: CITY, FLOWS_DIR: FLOWS },
	stdout: 'pipe', stderr: 'pipe',
});
const chrome = launchChrome(join(ROOT, 'chrome'), CDP_PORT, DECK);

async function shut(): Promise<void> {
	console.log('');
	// One workspace per fire, and a step has two `fired` lines by design (the sid-join, §the join) —
	// so the set, not the list: closing a workspace twice reports a failure that never happened.
	for (const ws of new Set(runLines().filter(l => l['ev'] === 'fired' && l['workspace']).map(l => String(l['workspace'])))) {
		const closed = cmux('workspace', 'close', ws);
		console.log(`closed ${ws}: exit ${closed.exitCode} ${new TextDecoder().decode(closed.stdout).trim()}`);
	}
	chrome.kill();
	glass.kill();
	await Bun.sleep(400);
	if (existsSync(WORKTREE)) {
		const gone = Bun.spawnSync(['git', '-C', AGENTS, 'worktree', 'remove', '--force', WORKTREE]);
		console.log(`worktree removed: exit ${gone.exitCode} ${new TextDecoder().decode(gone.stderr).trim()}`);
	}
	const branch = Bun.spawnSync(['git', '-C', AGENTS, 'branch', '-D', BRANCH]);
	console.log(`branch ${BRANCH}: exit ${branch.exitCode} ${new TextDecoder().decode(branch.stdout).trim()}${new TextDecoder().decode(branch.stderr).trim()}`);
	Bun.spawnSync(['git', '-C', AGENTS, 'worktree', 'prune']);
	rmSync(ROOT, { recursive: true, force: true });
}

try {
	await until('the glass', async () => (await fetch(DECK)).ok);
	await attach(CDP_PORT, DECK);
	console.log(`\n# B11 — the smoke flow runs itself\n`);
	console.log(`glass: ${DECK}   flows: ${FLOWS}   census(write): ${CENSUS}   worktree: ${WORKTREE}\n`);

	// --- 1. arm it from the page ---

	await until('the first poll', async () => await evaluate<boolean>(`!!document.querySelector('#live-count')`));
	await evaluate(SET('context', 'typical'));
	await evaluate(SET('focus', 'expanded'));
	await evaluate(SET('action', 'expanded'));
	await settle();
	await openWorks('nb/smoke', POLL_MS);
	await until('the flow on the wall', async () => await evaluate<boolean>(
		`document.querySelectorAll('#host-focus .node').length === 3`), POLL_MS * 4);
	await settle();

	const before = auditLines().length;
	const armedAt = Date.now();
	await evaluate(`document.querySelector('#host-action [data-arm]').click()`);
	await until('the arm to be recorded', async () => runLines().some(l => l['ev'] === 'armed'), 15_000);
	ok('armed by one click on the rendered plan — in a real browser, on the page that shows the whole DAG',
		runLines()[0]!['ev'] === 'armed' && typeof runLines()[0]!['hash'] === 'string',
		JSON.stringify(runLines()[0]));

	// --- 2. step one fires ---

	await until('step 1 to fire', async () => line('fired', 's1') !== null, 40_000);
	const f1 = line('fired', 's1')!;
	const a1 = auditLines().slice(before).find(l => l.action === 'fire')!;
	ok('step 1 fires through the existing hands — one audit line, the engine’s own stamp, sonnet·low',
		a1 !== undefined && a1.ok && a1.args['model'] === 'sonnet' && a1.args['effort'] === 'low'
		&& a1.args['stamp'] === f1['stamp'] && a1.result['workspace'] === f1['workspace'],
		`run: ${JSON.stringify(f1)}\n      audit: ${JSON.stringify({ ...a1, result: a1.result })}`);

	await until('the census to name step 1’s session', async () => line('fired', 's1')!['sid'] !== null, 120_000);
	const sid1 = String(line('fired', 's1')!['sid']);
	const tp1 = transcriptOf(sid1);
	const turn1 = tp1 ? firstTurn(tp1) : null;
	const summons1 = readFileSync(String(a1.result['summonsPath']), 'utf8');
	ok('the first user turn IS the composed summons — byte-exact, page-side and transcript-side',
		turn1 !== null && sha(turn1) === sha(summons1) && sha(summons1) === a1.result['sha'],
		`sid ${sid1}\n      summons file ${String(a1.result['summonsPath'])} — sha ${sha(summons1)}, ${summons1.length} B`
		+ `\n      transcript ${tp1} first user turn — sha ${turn1 === null ? '(none)' : sha(turn1)}, ${turn1?.length ?? 0} B`
		+ `\n      the hands' own receipt — sha ${String(a1.result['sha'])}`);

	// --- 3. it lands, and step two fires with no human touch ---

	await until('step 1 to land (the session edits its own board row)',
		async () => line('landed', 's1') !== null, 420_000);
	await until('step 2 to fire', async () => line('fired', 's2') !== null, 60_000);
	const l1 = line('landed', 's1')!;
	const f2 = line('fired', 's2')!;
	const gap = (f2['ts'] as number) - (l1['ts'] as number);
	ok('**step 1 lands → step 2 fires, with no human touch** — this number is the chapter',
		gap >= 0 && gap < 30 && line('fired', 's2') !== null,
		`landing edge  ${new Date((l1['ts'] as number) * 1000).toISOString()}  ${JSON.stringify(l1['why'])}\n`
		+ `      fire audit    ${new Date((f2['ts'] as number) * 1000).toISOString()}  ${String(f2['workspace'])}\n`
		+ `      **gap ${gap.toFixed(3)} s** — nothing between them but the tick\n`
		+ `      total, arm → step 2 fired: ${(((f2['ts'] as number) * 1000 - armedAt) / 1000).toFixed(1)} s`);

	ok('and the board is what said so — the interim landing law, read off the row the session edited',
		String(l1['why']).includes('board row parses LANDED clean') && readFileSync(BOARD, 'utf8').includes(DONE1)
		&& existsSync(PROOF1),
		`why: ${String(l1['why'])}\n      the row now reads: ${readFileSync(BOARD, 'utf8').split('\n').find(l => l.startsWith('| S1'))}`
		+ `\n      and the file it wrote: ${existsSync(PROOF1) ? JSON.stringify(readFileSync(PROOF1, 'utf8')) : '(missing)'}`);

	// --- 4. the worktree venue: composed first, and the fire lands inside it ---

	const cut = auditLines().find(l => l.action === 'worktree');
	ok('the worktree venue is composed FIRST, by the same hand, and the fire’s cwd is inside it',
		cut !== undefined && cut.ok && cut.result['path'] === WORKTREE
		&& new Date(cut.ts).getTime() <= (f2['ts'] as number) * 1000
		&& auditLines().find(l => l.action === 'fire' && l.args['stamp'] === f2['stamp'])?.args['cwd'] === WORKTREE,
		`worktree: ${JSON.stringify(cut?.result)} at ${cut?.ts}\n`
		+ `      fire cwd: ${String(auditLines().find(l => l.action === 'fire' && l.args['stamp'] === f2['stamp'])?.args['cwd'])}`);

	await until('the census to name step 2’s session', async () => line('fired', 's2')!['sid'] !== null, 120_000);
	const sid2 = String(line('fired', 's2')!['sid']);
	const tp2 = transcriptOf(sid2);
	const beatCwd = (() => {
		const text = readFileSync(REAL_CENSUS, 'utf8');
		for (const l of text.split('\n').reverse()) {
			if (!l.includes(sid2)) continue;
			try { const b = JSON.parse(l) as Record<string, unknown>; if (b['sid'] === sid2 && b['cwd']) return String(b['cwd']); }
			catch { /* partial */ }
		}
		return null;
	})();
	ok('…and the session it opened really is running there — the census’s own cwd for that sid',
		beatCwd === WORKTREE,
		`sid ${sid2} · transcript ${tp2}\n      census cwd: ${beatCwd}\n      worktree:   ${WORKTREE}`);

	// --- 5. the card: the lane stops, and there is nothing on it to press ---

	await until('step 2 to land', async () => line('landed', 's2') !== null, 420_000);
	await until('the card', async () => line('paused', 's3') !== null, 40_000);
	const p3 = line('paused', 's3')!;
	ok('the Felix-card pauses the lane — and there is no step behind it the engine may open',
		String(p3['why']).includes('Felix-card') && line('fired', 's3') === null
		&& auditLines().filter(l => l.action === 'fire').length === 2,
		`${JSON.stringify(p3)}\n      fires in the hands audit: ${auditLines().filter(l => l.action === 'fire').length} (2 expected)`);

	// The deck polls every three seconds and the run log is ahead of it by construction: wait for the
	// DRAWING to carry the landing, or the measurement is of a frame taken mid-flight (B13 F2's law,
	// applied to the poll rather than to the transition).
	await until('the drawing to catch up with the run log', async () => await evaluate<boolean>(
		`!!document.querySelector('#host-focus .node.felix-card')
		 && document.querySelectorAll('#host-focus .node[data-ring="landed"][data-ring-from="run"]').length === 2`),
		POLL_MS * 5);
	const card = await evaluate<{ buttons: number; links: number; fire: number; rings: string }>(`(() => {
		const n = document.querySelector('#host-focus .node.felix-card');
		const markup = n.outerHTML.split(n.textContent).join('');
		return {
			buttons: n.querySelectorAll('button').length,
			links: n.querySelectorAll('a').length,
			fire: (markup.match(/hands\\/fire/g) ?? []).length,
			rings: [...document.querySelectorAll('#host-focus .node')].map(x => x.dataset.node + ':' + x.dataset.ring + '/' + x.dataset.ringFrom).join(' '),
		};
	})()`);
	ok('his card renders with zero fire wiring, and the drawing reads the engine’s log rather than the board',
		card.buttons === 0 && card.links === 0 && card.fire === 0
		&& card.rings.includes('s1:landed/run') && card.rings.includes('s2:landed/run'),
		`${card.buttons} buttons · ${card.links} links · hands/fire ${card.fire}× in the card’s markup\n      rings: ${card.rings}`);

	console.log(`\n${failures === 0 ? 'ALL GREEN' : `${failures} FAILED`}\n`);
	console.log('run log:\n' + runLines().map(l => JSON.stringify(l)).join('\n'));
}
catch (e) {
	console.error('\nsmoke threw:', e);
	console.error('run log:\n' + runLines().map(l => JSON.stringify(l)).join('\n'));
	failures++;
}
finally {
	await shut();
	process.exit(failures === 0 ? 0 : 1);
}
