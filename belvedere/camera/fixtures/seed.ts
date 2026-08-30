// The seeded world — one per-run temp directory holding everything the fixture twin reads.
//
// Two halves, and the split is the whole design:
//
//  1. **The static tree is committed** (`fixtures/city/`): three buildings whose every byte is
//     in git, lint-checked in place, and reviewable as text. Nothing about a board row, a
//     baton or a lint failure needs generating — those states are *written*.
//  2. **The timed half is generated at boot**: census beats and usage windows. A committed
//     census is a census of dead sessions the moment it is committed — the deck marks liveness
//     with `kill -0 pid` (`census.ts` §the F5 law) — and a committed usage cache is stale by
//     definition, since the strip greys anything over ten minutes old. So the pids and the
//     timestamps are minted here: **deterministic content, generated timing.**
//
// The static tree is COPIED into the run directory rather than served from the repo, for two
// reasons, both measured:
//
//  - A city root inside `~/code` is slugged relative to `~/code` (`doctrine/src/building.ts`
//    §slug), so `fixtures/city/alpha` names itself `agents/belvedere/camera/fixtures/city/alpha`
//    — and `buildingPage` resolves a slug against the CITY root, so every building link on the
//    rail 500s. Outside `~/code` the slug is the absolute path and the same link resolves. B10
//    F5 named the class; this is its second face.
//  - **A disarmed twin is not an inert one** (C17 F2): `POST /inbox` stands in front of the
//    arming switch and appends to a real building's `ISSUES.md`. Pointed at a copy, that write
//    lands inside the run directory and dies with it — so under `--fixture` every write the
//    twin can still make is contained, which is not true of the real-city twin.

import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { basename, join } from 'path';

/** The run directory and the four anchors the twin is pointed at. */
export type Fixture = {
	root: string;
	city: string;
	census: string;
	usage: string;
	desk: string;
	/** Idempotent, and it never throws: teardown is not allowed to fail a probe that passed. */
	close(): void;
};

const CITY_SOURCE = join(import.meta.dir, 'city');

/**
 * The rig's account table — the one file the fixture cannot own, because the deck reads the real
 * one (`glass/paths.ts` §ACCOUNTS, the bleed-through the charge names). The usage cache is keyed
 * on the config dir's basename, so the seeder must key it the same way or the strip reads "no
 * cache" for every account.
 */
const ACCOUNTS_TSV = join(import.meta.dir, '..', '..', '..', 'summon', 'accounts.tsv');

function accountDirs(): string[] {
	let text: string;
	try { text = readFileSync(ACCOUNTS_TSV, 'utf8'); }
	catch { return []; }                     // no table ⇒ no caches ⇒ the strip says "no cache", honestly
	return text.split('\n')
		.filter(l => l.trim() && !l.startsWith('#'))
		.map(l => (l.split('\t')[1] ?? '').trim())
		.filter(Boolean)
		.map(d => d.startsWith('~/') ? join(homedir(), d.slice(2)) : d);
}

// ---------- the census ----------

/**
 * `beat.sh` stamps every field with `jq --arg`, so **the whole record is strings** and an unset
 * env var arrives as `""`, never null (B1's relay, the batch-2 bulletin §§1–2). A seeder that
 * writes `pid: 12345` as a number is seeding a shape the real hook never emits.
 */
type Task = { id: string; type: string; status: string; agent_type: string | null };
type Extra = { tool?: string; why?: string; bg?: Task[] };

const record = (t: number, ev: string, sid: string, acct: string, pid: number, cwd: string, tp: string, extra: Extra) =>
	JSON.stringify({
		t, ev, sid,
		acct, pid: String(pid), ws: '', sf: '',
		cwd, tp,
		tool: extra.tool ?? '', why: extra.why ?? '', aid: '', at: '',
		bg: extra.bg ?? [],
	}) + '\n';

const task = (n: number, type: string): Task =>
	({ id: `${type}-${String(n).padStart(2, '0')}`, type, status: 'running', agent_type: type === 'subagent' ? 'opus-high' : null });

const tasks = (n: number, type: string): Task[] => Array.from({ length: n }, (_, i) => task(i + 1, type));

/**
 * A transcript with just enough in it for `identify()` to answer: the name-stamp, the cwd and the
 * model family, all inside the 64 kB head window it reads. It lives in the run directory, so no
 * account's own `projects/` tree is touched — seeding those is C16's design question, not this
 * charge's (the shelf and the Chat still read the real ones).
 */
function transcript(dir: string, sid: string, stamp: string, cwd: string, model: string): string {
	const file = join(dir, `${sid}.jsonl`);
	writeFileSync(file, [
		JSON.stringify({ type: 'agent-name', agentName: stamp, sessionId: sid }),
		JSON.stringify({ type: 'user', sessionId: sid, cwd, message: { role: 'user', content: 'the fixture city' } }),
		JSON.stringify({ type: 'assistant', sessionId: sid, message: { role: 'assistant', model, content: [] } }),
	].join('\n') + '\n');
	return file;
}

/** A pid that is certainly dead: one we started and waited for. The F5 law needs a real corpse. */
function deadPid(): number {
	const done = Bun.spawnSync(['true']);
	return done.pid;
}

/**
 * Six sessions: four alive on the camera's own pid — alive for exactly the probe's life and dead
 * the moment it exits — and two dead, one by `SessionEnd` and one by a pid the census still
 * believes in. That second one is the F5 law's whole point: the last line says `Stop`, and only
 * `kill -0` knows better.
 */
function censusText(city: string, transcripts: string, accounts: string[]): string {
	const now = Date.now() / 1000;
	const mine = process.pid;
	const dead = deadPid();
	const alpha = join(city, 'alpha');
	const beta = join(city, 'beta');
	// One account per session, cycling the rig's own order so every account lights a WIP row.
	const acct = (n: number) => accounts[n % accounts.length] ?? '';

	const t = (sid: string, stamp: string, cwd: string, model: string) =>
		transcript(transcripts, sid, stamp, cwd, model);

	const working = t('fixture-working', 'builder-alpha-07', alpha, 'claude-opus-4-5-20251101');
	const waiting = t('fixture-waiting', 'digger-alpha-02', alpha, 'claude-sonnet-4-5-20250929');
	const idle = t('fixture-idle', 'architect-beta-01', beta, 'claude-fable-5-20260501');
	const capped = t('fixture-capped', 'builder-beta-03', beta, 'claude-opus-4-5-20251101');
	const stopped = t('fixture-stopped', 'digger-beta-04', beta, 'claude-sonnet-4-5-20250929');
	const ended = t('fixture-ended', 'builder-alpha-06', alpha, 'claude-haiku-4-5-20251001');

	return [
		// working — a live pid mid-tool-call
		record(now - 240, 'SessionStart', 'fixture-working', acct(0), mine, alpha, working, { why: 'startup' }),
		record(now - 230, 'UserPromptSubmit', 'fixture-working', acct(0), mine, alpha, working, {}),
		record(now - 12, 'PreToolUse', 'fixture-working', acct(0), mine, alpha, working, { tool: 'Edit' }),

		// needs-input — the permission prompt, the deck's one blocked edge (B14 F1)
		record(now - 300, 'SessionStart', 'fixture-waiting', acct(1), mine, alpha, waiting, { why: 'startup' }),
		record(now - 90, 'PreToolUse', 'fixture-waiting', acct(1), mine, alpha, waiting, { tool: 'Write' }),
		record(now - 84, 'Notification', 'fixture-waiting', acct(1), mine, alpha, waiting, { why: 'permission_prompt' }),

		// idle, carrying a roster — `Stop` is the roster-bearing payload (B5 F2)
		record(now - 600, 'SessionStart', 'fixture-idle', acct(0), mine, beta, idle, { why: 'startup' }),
		record(now - 45, 'Stop', 'fixture-idle', acct(0), mine, beta, idle, { bg: tasks(3, 'subagent') }),

		// idle, roster CAPPED — the hook's 16-entry slice, so every figure it feeds renders `n+`
		record(now - 700, 'SessionStart', 'fixture-capped', acct(2), mine, beta, capped, { why: 'startup' }),
		record(now - 60, 'Stop', 'fixture-capped', acct(2), mine, beta, capped, { bg: tasks(16, 'shell') }),

		// dead, and the census does not know it: last line `Stop`, pid a corpse (census.ts §F5)
		record(now - 5400, 'SessionStart', 'fixture-stopped', acct(1), dead, beta, stopped, { why: 'startup' }),
		record(now - 5000, 'Stop', 'fixture-stopped', acct(1), dead, beta, stopped, {}),

		// dead, and the census does know it
		record(now - 7200, 'SessionStart', 'fixture-ended', acct(2), dead, alpha, ended, { why: 'startup' }),
		record(now - 6900, 'SessionEnd', 'fixture-ended', acct(2), dead, alpha, ended, { why: 'clear' }),
	].join('');
}

// ---------- usage ----------

/**
 * One cache per account, in the rig's own JSON (`gauges.ts` §toUsage). Three shapes, cycled over
 * however many accounts the table names, so the strip always shows all three at once:
 *
 *  0. **near the cap and burning** — 91% spent against 49% of the window elapsed. This is the
 *     gauge state the charge exists to make renderable on demand.
 *  1. headroom, fresh — the healthy account.
 *  2. stale — fetched an hour ago, so the furniture greys and the figures keep full contrast.
 *
 * The window offsets deliberately avoid half-integer pacing deltas: the rig rounds away from
 * zero, and a delta sitting exactly on `.5` would flip by one point between two shots.
 */
type Shape = { ageSeconds: number; sess: [number, number]; week: [number, number]; fable: [number, number] };

const SHAPES: Shape[] = [
	{ ageSeconds: 20, sess: [91, 9200], week: [64, 120000], fable: [38, 300000] },
	{ ageSeconds: 40, sess: [12, 7100], week: [20, 180000], fable: [5, 180000] },
	{ ageSeconds: 3600, sess: [47, 3500], week: [55, 60000], fable: [71, 30000] },
];

const SESSION_WINDOW = 18000;
const WEEK_WINDOW = 604800;

function writeUsage(dir: string, accounts: string[]): void {
	const now = Math.floor(Date.now() / 1000);
	const window = (pct: number, resetsIn: number, secs: number) =>
		({ used_pct: pct, resets_at: now + resetsIn, window_secs: secs });

	accounts.forEach((configDir, n) => {
		const s = SHAPES[n % SHAPES.length]!;
		writeFileSync(join(dir, `${basename(configDir)}.json`), JSON.stringify({
			fetched_at: now - s.ageSeconds,
			windows: {
				sess: window(s.sess[0], s.sess[1], SESSION_WINDOW),
				week: window(s.week[0], s.week[1], WEEK_WINDOW),
				fable: window(s.fable[0], s.fable[1], WEEK_WINDOW),
			},
		}, null, '\t') + '\n');
	});
}

// ---------- the run directory ----------

/** Seed one run's world. Everything it writes is under one directory, and `close()` removes it. */
export function seedFixture(): Fixture {
	const root = mkdtempSync(join(tmpdir(), 'belvedere-fixture-'));
	try {
		const city = join(root, 'city');
		const census = join(root, 'census');
		const usage = join(root, 'usage');
		const desk = join(root, 'desk');
		const transcripts = join(root, 'transcripts');
		cpSync(CITY_SOURCE, city, { recursive: true });
		for (const d of [census, usage, desk, transcripts]) mkdirSync(d, { recursive: true });

		const accounts = accountDirs();
		writeFileSync(join(census, 'census.jsonl'), censusText(city, transcripts, accounts));
		writeUsage(usage, accounts);

		let closed = false;
		return {
			root, city, census, usage, desk,
			close() {
				if (closed) return;
				closed = true;
				try { rmSync(root, { recursive: true, force: true }); } catch { /* the OS reaps $TMPDIR */ }
			},
		};
	}
	catch (e) {
		// A half-seeded run directory is litter with no owner: nothing else holds this path yet.
		rmSync(root, { recursive: true, force: true });
		throw e;
	}
}
