// The bill, tested where it can lie: the pacing arithmetic, the staleness bar, and the cap.
//
// A gauge is only worth having if its wrong answers are impossible rather than unlikely — this
// one is a dispatcher's brake, and a brake that under-reads is worse than no brake at all.

import { expect, test, describe } from 'bun:test';
import { BUCKETS, STALE_SECONDS, pacing, rosterText, toUsage, usageAge, usageStrip, wip, wipGauges, type Quota, type Usage } from './gauges';
import { BG_CAP, type Beat, type CensusRead, type Session, type Task } from './census';
import type { Rig } from './rig';

const HOUR = 3600, WEEK = 604800;
const NOW = 1_800_000_000;

const rig: Rig = {
	accounts: new Map([['/Users/felix/.claude', 'personal'], ['/Users/felix/.claude-thg-fgreen', 'thg-fgreen']]),
	colours: new Map([['builder', 'cyan']]),
	tiers: new Map([['builder', 'opus-high']]),
	mantles: ['builder'],
};

// ---------- the pacing delta ----------

describe('pacing — the clock, rendered', () => {
	const quota = (pct: number, elapsedFraction: number, secs = WEEK): Quota =>
		({ pct, resetsAt: NOW + secs * (1 - elapsedFraction), windowSecs: secs });

	test('the rig README\'s own worked example: 42% burned, 73% elapsed → +31 headroom', () => {
		expect(pacing(quota(42, 0.73), NOW)).toBe(31);
	});

	test('spend outrunning the clock is negative — the window dries up early', () => {
		expect(pacing(quota(61, 0.48), NOW)).toBe(-13);
	});

	test('dead level reads zero, whatever the window length', () => {
		expect(pacing(quota(50, 0.5, 5 * HOUR), NOW)).toBe(0);
		expect(pacing(quota(50, 0.5, WEEK), NOW)).toBe(0);
	});

	test('a window that already reset is 100% elapsed, never more — the delta stays a percentage', () => {
		// A cache fetched before the reset still names the old `resets_at`; without the clamp the
		// elapsed fraction runs past 1 and the delta invents headroom that does not exist.
		expect(pacing({ pct: 0, resetsAt: NOW - WEEK, windowSecs: WEEK }, NOW)).toBe(100);
		expect(pacing({ pct: 40, resetsAt: NOW - 10 * WEEK, windowSecs: WEEK }, NOW)).toBe(60);
	});

	test('a window that has not started is 0% elapsed, so all spend is over-pace', () => {
		expect(pacing({ pct: 10, resetsAt: NOW + 3 * WEEK, windowSecs: WEEK }, NOW)).toBe(-10);
	});

	test('halves round AWAY from zero, exactly as the rig rounds them', () => {
		// `summon.zsh:_summon_usage_delta` — `diff + (diff >= 0 ? 0.5 : -0.5)`, truncated toward
		// zero. `Math.round` would print -13 here and the rig's own panel prints -14; two tables
		// side by side must not disagree by a point.
		expect(pacing({ pct: 50, resetsAt: NOW + WEEK * 0.635, windowSecs: WEEK }, NOW)).toBe(-14);
		expect(pacing({ pct: 50, resetsAt: NOW + WEEK * 0.365, windowSecs: WEEK }, NOW)).toBe(14);
	});
});

// ---------- the parse boundary ----------

describe('the usage cache, parsed', () => {
	/** Verbatim from `summon/log/usage/.claude.json`, 2026-08-27. */
	const LIVE = {
		fetched_at: 1787839196,
		windows: {
			sess: { used_pct: 13, resets_at: 1787845800, window_secs: 18000 },
			week: { used_pct: 12, resets_at: 1788343200, window_secs: 604800 },
			fable: { used_pct: 9, resets_at: 1788343200, window_secs: 604800 },
		},
	};

	test('the rig\'s live cache arrives whole, all three buckets typed', () => {
		const u = toUsage('personal', '/tmp/x.json', LIVE);
		expect(u.fetchedAt).toBe(1787839196);
		expect(BUCKETS.map(b => u.windows[b]?.pct)).toEqual([13, 12, 9]);
	});

	test('an account missing a bucket keeps the ones it has — doorbell has no `sess`', () => {
		// Verbatim shape of `.claude-thg-doorbell.json`: two windows, not three.
		const u = toUsage('thg-doorbell', '/tmp/x.json', { fetched_at: 1787839196, windows: { week: LIVE.windows.week } });
		expect(u.windows.sess).toBeUndefined();
		expect(u.windows.week?.pct).toBe(12);
	});

	test('a half-written bucket is dropped whole, never rendered from two thirds of a record', () => {
		const u = toUsage('personal', '/tmp/x.json', { fetched_at: 1, windows: { week: { used_pct: 50, resets_at: 2 } } });
		expect(u.windows.week).toBeUndefined();
	});

	test('a zero-length window is refused — it would divide the pacing delta by nothing', () => {
		const u = toUsage('personal', '/tmp/x.json', { fetched_at: 1, windows: { week: { used_pct: 50, resets_at: 2, window_secs: 0 } } });
		expect(u.windows.week).toBeUndefined();
	});

	test('an undateable or unparseable cache is no cache at all — every bucket reads `—`', () => {
		for (const raw of [null, 'nope', {}, { windows: LIVE.windows }])
			expect(toUsage('personal', '/tmp/x.json', raw)).toMatchObject({ fetchedAt: null, windows: {} });
	});
});

describe('staleness greys the furniture, never the figures (D41\'s law, the rig\'s words)', () => {
	const usage = (agoSeconds: number): Usage => ({
		account: 'personal', file: '/tmp/x.json', fetchedAt: NOW - agoSeconds,
		windows: { week: { pct: 61, resetsAt: NOW + WEEK * 0.52, windowSecs: WEEK } },
	});

	test('a fresh cache is not stale; one past the bar is', () => {
		expect(usageStrip([usage(60)], NOW)).not.toContain('uline stale');
		expect(usageStrip([usage(STALE_SECONDS + 1)], NOW)).toContain('uline stale');
	});

	test('the figures are in the markup at full contrast either way — greying is furniture-only CSS', () => {
		for (const age of [60, STALE_SECONDS + 1]) {
			const html = usageStrip([usage(age)], NOW);
			expect(html).toContain('<b class="pct">61%</b>');
			expect(html).toContain('class="delta burning"');
		}
	});

	test('an account with no cache says so and shows no figure to squint at', () => {
		const html = usageStrip([{ account: 'thg-doorbell', file: '/tmp/none.json', fetchedAt: null, windows: {} }], NOW);
		expect(html).toContain('no cache');
		expect(html).toContain('sess —');
		expect(usageAge({ account: 'x', file: 'y', fetchedAt: null, windows: {} }, NOW)).toBe(null);
	});

	test('the strip never fetches: it names only files it read', () => {
		expect(usageStrip([usage(60)], NOW)).not.toContain('http');
	});
});

// ---------- WIP ----------

describe('WIP — a roster figure is a floor, and says so', () => {
	const task = (n: number, type = 'subagent'): Task => ({ id: `a${n}`, type, status: 'running', agentType: 'opus-high' });

	const session = (over: Partial<Session> & { sid: string }): Session => ({
		state: 'working', beats: 1, account: '/Users/felix/.claude', cwd: '/Users/felix/code/agents',
		tool: null, stamp: null, transcript: null, agent: null, roster: { tasks: [], at: NOW, capped: false },
		last: { t: NOW, ev: 'PreToolUse', sid: over.sid, acct: '/Users/felix/.claude', pid: 1, ws: null, sf: null,
			cwd: '/Users/felix/code/agents', tp: null, tool: null, why: null, aid: null, at: null, bg: [] } as Beat,
		...over,
	});

	const read = (sessions: Session[]): CensusRead => ({ present: true, sessions, beats: sessions.length, malformed: 0, since: NOW });

	test('sessions roll up per account and per building', () => {
		const w = wip(read([
			session({ sid: 'a' }),
			session({ sid: 'b', state: 'idle' }),
			session({ sid: 'c', account: '/Users/felix/.claude-thg-fgreen' }),
		]), rig, () => 'agents');
		expect(w.accounts.map(a => [a.account, a.sessions])).toEqual([['personal', 2], ['thg-fgreen', 1]]);
		expect(w.accounts[0]!.states).toMatchObject({ working: 1, idle: 1 });
		expect(w.buildings).toEqual([{ building: 'agents', sessions: 3 }]);
	});

	test('a dead session is not in flight — `gone` never reaches a gauge', () => {
		const w = wip(read([session({ sid: 'a', state: 'gone' }), session({ sid: 'b' })]), rig, () => 'agents');
		expect(w.buildings).toEqual([{ building: 'agents', sessions: 1 }]);
	});

	test('a cwd in no building is counted off the register, never dropped so the total still adds up', () => {
		const w = wip(read([session({ sid: 'a' })]), rig, () => null);
		expect(w.buildings).toEqual([{ building: 'off the register', sessions: 1 }]);
	});

	test('subagents and shells are counted apart', () => {
		const seen = { tasks: [task(1), task(2), task(3, 'shell')], at: NOW, capped: false };
		const w = wip(read([session({ sid: 'a', roster: seen })]), rig, () => 'agents');
		expect([w.subagents.n, w.shells.n]).toEqual([2, 1]);
		expect(w.subagents.capped).toBe(false);
	});

	test('a session at the hook cap makes the whole figure a floor: `16+`, never `16`', () => {
		const full = Array.from({ length: BG_CAP }, (_, n) => task(n));
		const w = wip(read([session({ sid: 'a', roster: { tasks: full, at: NOW, capped: true } })]), rig, () => 'agents');
		expect(w.subagents).toEqual({ n: BG_CAP, capped: true, unobserved: 0 });
		expect(rosterText(w.subagents)).toBe('16+');
		expect(wipGauges(w)).toContain('16+');
	});

	test('rosterText leaves an uncapped figure alone — the `+` carries information', () => {
		expect(rosterText({ n: 3, capped: false, unobserved: 0 })).toBe('3');
	});

	test('a session never observed carrying a roster reads `?`, never `0`', () => {
		// Only `Stop` and `SubagentStop` payloads carry `background_tasks` (measured, census.ts
		// §ROSTER_EVENTS), so a session still mid-turn has told the census nothing at all.
		const w = wip(read([session({ sid: 'a', roster: null })]), rig, () => 'agents');
		expect(w.subagents).toEqual({ n: 0, capped: false, unobserved: 1 });
		expect(rosterText(w.subagents)).toBe('?');
		expect(wipGauges(w)).toContain('never been observed');
	});

	test('an observed EMPTY roster really is zero — that session did tell the census', () => {
		const w = wip(read([session({ sid: 'a', roster: { tasks: [], at: NOW, capped: false } })]), rig, () => 'agents');
		expect(rosterText(w.subagents)).toBe('0');
	});

	test('no census degrades honestly: the panel says the sensor is missing, it does not draw zero', () => {
		const html = wipGauges(wip({ present: false, sessions: [], beats: 0, malformed: 0, since: null }, rig, () => null));
		expect(html).toContain('census not deployed');
		expect(html).not.toContain('by account');
	});
});
