// Usage, live (B17 §4) — the parse boundary, the keychain service derivation, and the one law that
// matters when the network says no: **a failed fetch never invents and never destroys.**
//
// What is NOT here is a real fetch. `refreshUsage` takes its fetcher as an argument for exactly this
// reason: a suite that read Felix's keychain and called Anthropic three times would be a suite that
// spends his quota to prove arithmetic, and it would prove nothing about the failure paths — which
// are the ones with a lie in them. The live read is the DoD's, measured against the rig's own
// `summon-usage` at one instant (b17's findings §DoD-3).

import { describe, expect, test, beforeEach } from 'bun:test';
import { homedir } from 'os';
import { join } from 'path';
import { forgetUsage, parseUsage, refreshUsage, serviceOf, TTL_SECONDS, usageNow, usageWire, type LiveUsage } from './usage';
import type { Rig } from './rig';

const rig = (): Rig => ({
	accounts: new Map([['/does/not/exist/alpha', 'alpha'], ['/does/not/exist/beta', 'beta']]),
	colours: new Map(), tiers: new Map(), mantles: [],
});

const live = (account: string, pct: number, at: number): LiveUsage => ({
	account, source: 'live', fetchedAt: at, error: null,
	windows: { sess: { pct, resetsAt: at + 9_000, windowSecs: 18_000 } },
});

beforeEach(() => { forgetUsage(); });

// ---------- the parse boundary ----------

describe('the endpoint\'s JSON into the rig\'s three buckets', () => {
	const body = {
		five_hour: { utilization: 37.4, resets_at: '2026-08-27T22:00:00.470292+00:00' },
		seven_day: { utilization: 19, resets_at: '2026-08-30T00:00:00+00:00' },
		limits: [
			{ kind: 'weekly', percent: 5, resets_at: '2026-08-30T00:00:00+00:00' },
			{ kind: 'weekly_scoped', scope: { display_name: 'Opus' }, percent: 60, resets_at: '2026-08-30T00:00:00+00:00' },
			{ kind: 'weekly_scoped', scope: { display_name: 'Fable' }, percent: 21.9, resets_at: '2026-08-30T00:00:00+00:00' },
		],
	};

	test('sess and week come off the flat objects; fable is only ever the Fable-scoped weekly limit', () => {
		const w = parseUsage(body);
		expect(w.sess?.pct).toBe(37);          // truncated, not rounded — the rig's `${used%%.*}`
		expect(w.week?.pct).toBe(19);
		expect(w.fable?.pct).toBe(21);
		// The window lengths are the rig's constants: the endpoint states a reset, never a span.
		expect(w.sess?.windowSecs).toBe(18_000);
		expect(w.fable?.windowSecs).toBe(604_800);
		expect(w.sess?.resetsAt).toBe(Math.round(Date.parse('2026-08-27T22:00:00.470292+00:00') / 1000));
	});

	test('a bucket the response omitted is a bucket we do not have — never a zero', () => {
		expect(parseUsage({ seven_day: body.seven_day })).toEqual({ week: parseUsage(body).week! } as never);
		expect(parseUsage({}).sess).toBeUndefined();
		expect(parseUsage(null).fable).toBeUndefined();
		expect(parseUsage('not an object')).toEqual({});
	});

	test('a null utilization, an unparseable reset and a scoped limit that is not Fable are all skipped', () => {
		expect(parseUsage({ five_hour: { utilization: null, resets_at: '2026-08-27T22:00:00+00:00' } }).sess).toBeUndefined();
		expect(parseUsage({ five_hour: { utilization: 5, resets_at: 'whenever' } }).sess).toBeUndefined();
		expect(parseUsage({ limits: [{ kind: 'weekly_scoped', scope: { display_name: 'Opus' }, percent: 9, resets_at: '2026-08-30T00:00:00+00:00' }] }).fable)
			.toBeUndefined();
	});
});

// ---------- the credential, derived and never stored ----------

describe('the keychain service is derived from accounts.tsv and nothing else', () => {
	test('it is the rig\'s own string: `Claude Code-credentials-` plus eight hex of the sha256', () => {
		const s = serviceOf(join(homedir(), '.claude'));
		expect(s).toMatch(/^Claude Code-credentials-[0-9a-f]{8}$/);
	});

	test('two config dirs are two services — one account\'s token can never answer for another', () => {
		expect(serviceOf('/Users/felix/.claude')).not.toBe(serviceOf('/Users/felix/.claude-thg-fgreen'));
	});

	test('a path that does not resolve answers itself rather than throwing', () => {
		expect(serviceOf('/no/such/config/dir')).toMatch(/^Claude Code-credentials-[0-9a-f]{8}$/);
	});
});

// ---------- the failure law: stale-with-age, never invented ----------

describe('a fetch that fails keeps the best figures it has and wears the error', () => {
	test('a live answer is held, and a second refresh inside the TTL does not ask again', async () => {
		let calls = 0;
		const fetcher = async (_dir: string, account: string) => { calls++; return live(account, 11, 1000); };
		await refreshUsage(rig(), 1000, fetcher);
		expect(calls).toBe(2);
		await refreshUsage(rig(), 1000 + TTL_SECONDS - 1, fetcher);
		expect(calls).toBe(2);                                    // still two: the TTL held
		await refreshUsage(rig(), 1000 + TTL_SECONDS + 1, fetcher);
		expect(calls).toBe(4);
	});

	test('after the TTL, a refusal leaves the figures standing and only the error changes', async () => {
		const good = async (_d: string, a: string) => live(a, 42, 1000);
		const bad = async (_d: string, a: string): Promise<LiveUsage> =>
			({ account: a, source: 'none', fetchedAt: null, windows: {}, error: 'keychain: no credential for this account' });

		await refreshUsage(rig(), 1000, good);
		const after = await refreshUsage(rig(), 2000, bad);

		const alpha = after.find(u => u.account === 'alpha')!;
		expect(alpha.windows.sess?.pct).toBe(42);                 // the number survived
		expect(alpha.fetchedAt).toBe(1000);                       // ...wearing its own age, not the clock's
		expect(alpha.source).toBe('live');
		expect(alpha.error).toBe('keychain: no credential for this account');
	});

	test('a refusal with nothing behind it renders `none` and no figures — blank is honest, zero is a lie', async () => {
		const bad = async (_d: string, a: string): Promise<LiveUsage> =>
			({ account: a, source: 'none', fetchedAt: null, windows: {}, error: 'the usage endpoint answered 401' });
		// `usageDir` at a directory with no caches, so the rig-cache fallback has nothing either.
		const saved = process.env['USAGE_DIR'];
		process.env['USAGE_DIR'] = '/no/such/usage/dir';
		try {
			const out = await refreshUsage(rig(), 1000, bad);
			for (const u of out) {
				expect(u.source).toBe('none');
				expect(u.windows).toEqual({});
				expect(u.fetchedAt).toBeNull();
				expect(u.error).toBe('the usage endpoint answered 401');
			}
		}
		finally { process.env['USAGE_DIR'] = saved; }
	});

	test('`usageNow` never touches the network — it answers what is held, or the rig\'s cache', async () => {
		const saved = process.env['USAGE_DIR'];
		process.env['USAGE_DIR'] = '/no/such/usage/dir';
		try {
			// Nothing fetched yet and no cache on disk: the honest absence, per account.
			expect(usageNow(rig()).map(u => u.source)).toEqual(['none', 'none']);
			await refreshUsage(rig(), 1000, async (_d, a) => live(a, 7, 1000));
			expect(usageNow(rig()).map(u => u.source)).toEqual(['live', 'live']);
		}
		finally { process.env['USAGE_DIR'] = saved; }
	});
});

// ---------- the wire ----------

describe('the wire carries the provenance, because a figure nobody can price is furniture', () => {
	test('each cell is used% and the pacing delta, and an absent bucket is null on both', () => {
		const now = 1000 + 9_000;                                   // exactly half a 5-hour window in
		const w = usageWire([live('alpha', 40, 1000)], now)[0]!;
		expect(w.account).toBe('alpha');
		expect(w.source).toBe('live');
		expect(w.ageSeconds).toBe(9_000);
		const sess = w.cells.find(c => c.bucket === 'sess')!;
		expect(sess.pct).toBe(40);
		expect(sess.delta).toBe(60);                                // 100% elapsed − 40% spent
		expect(w.cells.find(c => c.bucket === 'week')).toEqual({ bucket: 'week', pct: null, delta: null });
	});

	test('an unfetched account ages to null rather than to zero seconds old', () => {
		const w = usageWire([{ account: 'a', source: 'none', fetchedAt: null, windows: {}, error: 'x' }])[0]!;
		expect(w.ageSeconds).toBeNull();
		expect(w.error).toBe('x');
	});
});
