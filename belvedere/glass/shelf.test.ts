// The shelf's tested core: what the scan finds, what it refuses to guess, and the order the
// rows come out in. The corpus is built here as real files under a temp home — three accounts,
// worktree slugs and all — because the scan's whole job is filesystem shape.
//
// What is NOT here is a real resume: standing in a three-week-dead session across all three
// accounts is DoD evidence in `plans/b5-shelf-gauges.md`, not a unit test.

import { expect, test, describe, afterAll } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { AGES, apply, rankOf, readFilter, resumeBody, scan, shelfOrder, type Shelved } from './shelf';
import type { Beat, CensusRead, Session } from './census';
import type { Entry } from './register';
import type { Rig } from './rig';

const NOW = 1_800_000_000;
const ROOT = mkdtempSync(join(tmpdir(), 'b5-shelf-'));
afterAll(() => rmSync(ROOT, { recursive: true, force: true }));

const ACCOUNTS: [string, string][] = [
	[join(ROOT, '.claude'), 'personal'],
	[join(ROOT, '.claude-thg-fgreen'), 'thg-fgreen'],
];

const rig: Rig = { accounts: new Map(ACCOUNTS), colours: new Map([['builder', 'cyan']]), mantles: ['builder'] };

const CITY = join(ROOT, 'code');
const entries: Entry[] = [
	{ building: 'agents', path: join(CITY, 'agents'), files: {} as Entry['files'] },
	{ building: 'agents/belvedere', path: join(CITY, 'agents/belvedere'), files: {} as Entry['files'] },
];

/** One transcript on disk, in the project slug the harness would have given it. */
function transcript(configDir: string, slug: string, sid: string, lines: unknown[]): string {
	const dir = join(configDir, 'projects', slug);
	mkdirSync(dir, { recursive: true });
	const path = join(dir, `${sid}.jsonl`);
	writeFileSync(path, lines.map(l => JSON.stringify(l)).join('\n') + '\n');
	return path;
}

const uuid = (n: number) => `d285127e-0000-4000-8000-0000000000${String(n).padStart(2, '0')}`;

const STAMPED = uuid(1), UNSTAMPED = uuid(2), WORKTREE = uuid(3), FOREIGN = uuid(4);

transcript(ACCOUNTS[0]![0], '-Users-felix-code-agents', STAMPED, [
	{ type: 'agent-name', agentName: 'builder-agents-01' },
	{ type: 'user', cwd: join(CITY, 'agents'), message: { role: 'user', content: 'hi' } },
]);
transcript(ACCOUNTS[0]![0], '-Users-felix-code-agents', UNSTAMPED, [
	{ type: 'custom-title', customTitle: 'a title a human typed' },
	{ type: 'user', cwd: join(CITY, 'agents'), message: { role: 'user', content: 'hi' } },
]);
transcript(ACCOUNTS[0]![0], '-Users-felix-code-agents--claude-worktrees-bv-b3-smoke', WORKTREE, [
	{ type: 'agent-name', agentName: 'builder-agents-09' },
	{ type: 'user', cwd: join(CITY, 'agents/.claude/worktrees/bv/b3-smoke/belvedere'), message: { role: 'user', content: 'hi' } },
]);
transcript(ACCOUNTS[1]![0], '-Users-felix-elsewhere', FOREIGN, [
	{ type: 'user', cwd: '/Users/felix/elsewhere', message: { role: 'user', content: 'hi' } },
]);
// Not a transcript: the sidecar directories the harness keeps beside them, and any other file.
mkdirSync(join(ACCOUNTS[0]![0], 'projects/-Users-felix-code-agents', STAMPED), { recursive: true });
writeFileSync(join(ACCOUNTS[0]![0], 'projects/-Users-felix-code-agents', 'notes.md'), 'not a session\n');

const EMPTY: CensusRead = { present: false, sessions: [], beats: 0, malformed: 0 };

const beat = (over: Partial<Beat>): Beat => ({
	t: NOW, ev: 'PreToolUse', sid: 'x', acct: null, pid: process.pid, ws: null, sf: null,
	cwd: null, tp: null, tool: null, why: null, aid: null, at: null, bg: [], ...over,
});

const live = (sid: string, over: Partial<Session> = {}): Session => ({
	sid, state: 'working', last: beat({ sid }), beats: 3, account: ACCOUNTS[0]![0],
	cwd: join(CITY, 'agents'), tool: null, stamp: 'builder-agents-01', transcript: null,
	agent: null, tasks: [], tasksCapped: false, ...over,
});

describe('the scan', () => {
	const shelf = scan(rig, entries, EMPTY);
	const find = (sid: string) => shelf.find(s => s.sid === sid)!;

	test('finds every transcript in every account, and nothing that is not one', () => {
		expect(shelf.map(s => s.sid).sort()).toEqual([STAMPED, UNSTAMPED, WORKTREE, FOREIGN].sort());
	});

	test('the account is the rig\'s label for the config dir the transcript sits under', () => {
		expect(find(STAMPED).account).toBe('personal');
		expect(find(FOREIGN).account).toBe('thg-fgreen');
	});

	test('a stamped session carries its stamp; an unstamped one is honestly unstamped', () => {
		expect(find(STAMPED).stamp).toBe('builder-agents-01');
		expect(find(UNSTAMPED).stamp).toBe(null);
	});

	test('a worktree session attributes to its repo\'s building, not to a building of its own', () => {
		// `<repo>/.claude/worktrees/<branch>/belvedere` is `<repo>/belvedere` wearing a branch.
		expect(find(WORKTREE).building).toBe('agents/belvedere');
		expect(find(WORKTREE).cwd).toContain('.claude/worktrees/');
	});

	test('the deepest building wins — a session in `agents/belvedere` is not claimed by `agents`', () => {
		expect(find(STAMPED).building).toBe('agents');
	});

	test('a cwd in no building is off the register, never mis-housed', () => {
		expect(find(FOREIGN).building).toBe(null);
	});

	test('with no census every session is dead — the shelf still lists them all (spec §4)', () => {
		expect(shelf.every(s => s.live === null)).toBe(true);
		expect(shelf.every(s => rankOf(s) === 'dead')).toBe(true);
	});
});

describe('the census join', () => {
	test('a live session takes its state, its stamp and its cwd from the census, not the head', () => {
		const census: CensusRead = { present: true, beats: 3, malformed: 0,
			sessions: [live(UNSTAMPED, { stamp: 'renamed-after-the-window', cwd: join(CITY, 'agents/belvedere') })] };
		const s = scan(rig, entries, census).find(x => x.sid === UNSTAMPED)!;
		expect(s.stamp).toBe('renamed-after-the-window');
		expect(s.building).toBe('agents/belvedere');
		expect(rankOf(s)).toBe('working');
	});

	test('a census session the F5 law calls `gone` is shelved as dead, resumable again', () => {
		const census: CensusRead = { present: true, beats: 1, malformed: 0, sessions: [live(STAMPED, { state: 'gone' })] };
		expect(rankOf(scan(rig, entries, census).find(x => x.sid === STAMPED)!)).toBe('dead');
	});
});

describe('attention first, recency within (design law, README §3)', () => {
	const at = (sid: string, over: Partial<Shelved>): Shelved => ({
		sid, account: 'personal', transcript: '/t', stamp: null, cwd: null, building: null,
		at: NOW, bytes: 0, live: null, ...over,
	});

	test('a session waiting on Felix outranks a working one, however old it is', () => {
		const waiting = at('a', { at: NOW - 604800, live: live('a', { state: 'needs-input' }) });
		const working = at('b', { at: NOW, live: live('b') });
		expect([waiting, working].sort(shelfOrder).map(s => s.sid)).toEqual(['a', 'b']);
		expect([working, waiting].sort(shelfOrder).map(s => s.sid)).toEqual(['a', 'b']);
	});

	test('a live session outranks every dead one, and the dead sort by recency among themselves', () => {
		const rows = [at('old', { at: NOW - 9999 }), at('fresh', { at: NOW }), at('idle', { at: NOW - 99999, live: live('idle', { state: 'idle' }) })];
		expect(rows.sort(shelfOrder).map(s => s.sid)).toEqual(['idle', 'fresh', 'old']);
	});
});

describe('the filters', () => {
	const rows: Shelved[] = [
		{ sid: 'a', account: 'personal', transcript: '/t', stamp: null, cwd: null, building: 'agents', at: NOW - 3600, bytes: 0, live: null },
		{ sid: 'b', account: 'thg-fgreen', transcript: '/t', stamp: null, cwd: null, building: null, at: NOW - 30 * 86400, bytes: 0, live: null },
		{ sid: 'c', account: 'personal', transcript: '/t', stamp: null, cwd: null, building: 'agents', at: NOW - 400 * 86400, bytes: 0, live: live('c') },
	];

	test('the default is the last week, so the shelf opens on what Felix was actually doing', () => {
		expect(readFilter(new URLSearchParams())).toEqual({ account: 'all', building: 'all', age: '7d' });
		expect(apply(rows, readFilter(new URLSearchParams()), NOW).map(s => s.sid)).toEqual(['a', 'c']);
	});

	test('a live session is never aged out — the age filter digs up the dead, it does not hide the living', () => {
		expect(apply(rows, { account: 'all', building: 'all', age: '24h' }, NOW).map(s => s.sid)).toEqual(['a', 'c']);
	});

	test('account and building filter independently, and `all` is the absence of the filter', () => {
		expect(apply(rows, { account: 'thg-fgreen', building: 'all', age: 'all' }, NOW).map(s => s.sid)).toEqual(['b']);
		expect(apply(rows, { account: 'all', building: 'agents', age: 'all' }, NOW).map(s => s.sid)).toEqual(['a', 'c']);
		expect(apply(rows, { account: 'all', building: 'off the register', age: 'all' }, NOW).map(s => s.sid)).toEqual(['b']);
	});

	test('an age the URL invented is `all`, never an empty shelf', () => {
		expect(apply(rows, { account: 'all', building: 'all', age: 'yesteryear' }, NOW).length).toBe(3);
		expect(AGES.all).toBe(Infinity);
	});
});

describe('the resume payload — nothing invented', () => {
	const row = (over: Partial<Shelved> = {}): Shelved => ({
		sid: STAMPED, account: 'personal', transcript: '/t', stamp: 'builder-agents-01',
		cwd: join(CITY, 'agents'), building: 'agents', at: NOW, bytes: 0, live: null, ...over,
	});

	test('the handle is the uuid — exact, and always the filename the scan just read', () => {
		expect(resumeBody(row(), rig).resume).toBe(STAMPED);
	});

	test('no summons, no model, no effort: a resume must not wake an agent with an instruction', () => {
		expect(resumeBody(row(), rig)).toMatchObject({ summons: '', model: '', effort: '' });
	});

	test('a stamped session keeps its own name; an unstamped one is not given one', () => {
		expect(resumeBody(row(), rig).stamp).toBe('builder-agents-01');
		expect(resumeBody(row({ stamp: null }), rig).stamp).toBe('');
	});

	test('the colour is the mantle\'s, spelled the way cmux spells it (B3 F1)', () => {
		// `presets.tsv` spends `cyan` on Builder and cmux refuses `cyan` outright.
		expect(resumeBody(row(), rig).color).toBe('Aqua');
		expect(resumeBody(row({ stamp: null }), rig).color).toBe('Charcoal');
	});
});
