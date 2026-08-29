/**
 * **Usage, live** (B17 §4) — the deck fetches the quota itself instead of rendering a log.
 *
 * v0 rendered the rig's caches and said so (`gauges.ts` §1: *"the deck never fetches"*). That was
 * the right call while the glass had no reason to hold a token — and it is exactly what the field
 * report caught: a **391-minute-old** number sitting beside the account picker it is supposed to
 * inform. A stale session figure inverts the very decision the strip exists to inform, so the deck
 * fetches, on demand, with the rig's own discipline.
 *
 * **The mechanism is canon row 10's, not a second one.** Claude Code files each account's
 * credentials in the login keychain under the sha256 of its config dir's absolute path, first 8 hex
 * (`summon.zsh:_summon_usage_service`, verified there against all three accounts), and the figures
 * come from the OAuth usage endpoint — the same payload `/usage` shows. Nothing here stores a
 * secret or a mapping of its own: the service name derives from `accounts.tsv`.
 *
 * **Token law, absolute — the rig's own sentence, kept:** the access token flows `security` →
 * this module's memory → one `Authorization` header, and lives nowhere else. Never in argv (`ps`
 * leaks that), never in a cache, a log, an audit line or a rendered page. It is never printed, and
 * a failure names the *step* that failed, never the value it was holding (B8 F1 — this building has
 * already printed one credential into a test diff). The glass only ever READS the store: Claude
 * Code owns the auth lifecycle, and a glass-side refresh could race it and invalidate live sessions.
 *
 * **Everything has a limit** (directive 3.1): one attempt per account per TTL, a 5 s timeout, a
 * bounded response read, and a body that does not parse is a failure rather than a cache full of
 * nothing.
 *
 * **Failures never invent** (D10's family). A fetch that fails keeps the last good answer and says
 * how old it is; an account never fetched falls back to the rig's own cache file, labelled as that;
 * with neither, the figures are absent rather than zero. `source` is on the wire for exactly that
 * reason — a number whose provenance is not on show is a number nobody can price.
 */

import { realpathSync } from 'fs';
import { createHash } from 'crypto';
import type { UsageSource, UsageWire } from './deck-model';
import { BUCKETS, pacing, readUsage, type Bucket, type Quota } from './gauges';
import type { Rig } from './rig';

/** One attempt per account per minute — the rig's own re-fetch bar (`_summon_usage_stale=60`). */
export const TTL_SECONDS = 60;

const LIMITS = { fetchMs: 5_000, keychainMs: 5_000, bodyBytes: 1 << 20 } as const;

const URL = 'https://api.anthropic.com/api/oauth/usage';

/** The rig's window lengths, in seconds — the endpoint states a reset, never a span. */
const WINDOW: Readonly<Record<Bucket, number>> = { sess: 18_000, week: 604_800, fable: 604_800 };

/**
 * Where a figure came from (`UsageSource`, on the wire in `deck-model.ts`): `live` is this module's
 * own fetch; `cache` is the rig's file, read because our fetch has not landed; `none` is the honest
 * absence of both.
 */
export type LiveUsage = {
	account: string;
	source: UsageSource;
	/** Epoch seconds the figures were true, or null when there are none. */
	fetchedAt: number | null;
	windows: Partial<Record<Bucket, Quota>>;
	/** Why the last fetch did not land. Non-null with `source: 'live'` means these are the old figures. */
	error: string | null;
};

// ---------- the parse boundary: the endpoint's JSON into the rig's three buckets ----------

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

/** The API stamps `2026-08-07T22:00:00.470292+00:00`; `Date.parse` reads that shape exactly. */
const epoch = (v: unknown): number | null => {
	if (typeof v !== 'string') return null;
	const t = Date.parse(v);
	return Number.isFinite(t) ? Math.round(t / 1000) : null;
};

const object = (v: unknown): Record<string, unknown> | null =>
	typeof v === 'object' && v !== null ? (v as Record<string, unknown>) : null;

/**
 * The response body, parsed the way the rig parses it: `five_hour` and `seven_day` are flat scalar
 * objects; **fable is only in `limits[]`**, as the `weekly_scoped` entry whose scope names Fable.
 * A bucket the response omitted is a bucket we do not have — never a zero.
 */
export function parseUsage(raw: unknown): Partial<Record<Bucket, Quota>> {
	const out: Partial<Record<Bucket, Quota>> = {};
	const r = object(raw);
	if (!r) return out;

	for (const [bucket, key] of [['sess', 'five_hour'], ['week', 'seven_day']] as const) {
		const w = object(r[key]);
		const pct = num(w?.['utilization']);
		const resetsAt = epoch(w?.['resets_at']);
		if (pct !== null && resetsAt !== null) out[bucket] = { pct: Math.trunc(pct), resetsAt, windowSecs: WINDOW[bucket] };
	}

	const limits = Array.isArray(r['limits']) ? r['limits'] : [];
	for (const entry of limits) {
		const e = object(entry);
		if (e?.['kind'] !== 'weekly_scoped') continue;
		// The scope object carries the model's display name; the rig matches on exactly that string.
		if (!JSON.stringify(e['scope'] ?? '').includes('"Fable"')) continue;
		const pct = num(e['percent']);
		const resetsAt = epoch(e['resets_at']);
		if (pct !== null && resetsAt !== null) out.fable = { pct: Math.trunc(pct), resetsAt, windowSecs: WINDOW.fable };
		break;
	}
	return out;
}

// ---------- the credential: read, held for one call, never written down ----------

/**
 * The keychain service for one config dir — `Claude Code-credentials-<sha256(realpath)[0,8]>`.
 * Derived, so the glass stores no mapping and no secret: change `accounts.tsv` and this follows.
 */
export const serviceOf = (configDir: string): string => {
	let path = configDir;
	try { path = realpathSync(configDir); } catch { /* an account dir that is not there yet answers itself */ }
	return `Claude Code-credentials-${createHash('sha256').update(path).digest('hex').slice(0, 8)}`;
};

/**
 * The access token, straight off the keychain blob. **The only place a token is a value in this
 * process**, and it is returned rather than stored: the one caller passes it to `fetch` and drops it.
 *
 * The blob is JSON, but it is parsed by hand for one reason — `JSON.parse` on a credential puts
 * every other field of it into memory too, and a thrown parse error in Bun prints the input.
 */
async function accessToken(configDir: string): Promise<{ token: string } | { error: string }> {
	const p = Bun.spawn(['security', 'find-generic-password', '-w', '-s', serviceOf(configDir), '-a', process.env['USER'] ?? ''],
		{ stdout: 'pipe', stderr: 'pipe', timeout: LIMITS.keychainMs });
	const blob = await new Response(p.stdout).text();
	const code = await p.exited;
	// The stderr is deliberately not read into the message: `security` echoes its query, not the
	// secret, but the rule here is that nothing this function saw reaches a string a caller keeps.
	if (code !== 0) return { error: `keychain: no credential for this account (security exited ${code})` };
	const token = blob.match(/"accessToken"\s*:\s*"([^"]+)"/)?.[1];
	return token ? { token } : { error: 'keychain: the credential blob carries no accessToken' };
}

// ---------- one account, fetched ----------

async function fetchOne(configDir: string, account: string): Promise<LiveUsage> {
	const got = await accessToken(configDir);
	if ('error' in got) return { account, source: 'none', fetchedAt: null, windows: {}, error: got.error };

	let body: unknown;
	try {
		const res = await fetch(URL, {
			headers: { authorization: `Bearer ${got.token}`, 'anthropic-beta': 'oauth-2025-04-20' },
			signal: AbortSignal.timeout(LIMITS.fetchMs),
		});
		if (!res.ok) return { account, source: 'none', fetchedAt: null, windows: {}, error: `the usage endpoint answered ${res.status}` };
		const text = await res.text();
		if (text.length > LIMITS.bodyBytes) return { account, source: 'none', fetchedAt: null, windows: {}, error: 'the usage response exceeded its limit' };
		body = JSON.parse(text);
	}
	catch (e) { return { account, source: 'none', fetchedAt: null, windows: {}, error: e instanceof Error ? e.message : String(e) }; }

	const windows = parseUsage(body);
	// A body that parsed to nothing is a failed fetch, not a cache full of nothing (the rig's rule).
	if (Object.keys(windows).length === 0)
		return { account, source: 'none', fetchedAt: null, windows: {}, error: 'the usage response carried no window this deck knows' };
	return { account, source: 'live', fetchedAt: Date.now() / 1000, windows, error: null };
}

// ---------- the held copy: one per account, for as long as this glass runs ----------

const held = new Map<string, LiveUsage>();

/** The rig's own cache file for one account, or the honest absence of one. Never a zero. */
function fromCache(rig: Rig, account: string): LiveUsage {
	const u = readUsage(rig).find(x => x.account === account);
	return u && u.fetchedAt !== null
		? { account, source: 'cache', fetchedAt: u.fetchedAt, windows: u.windows, error: null }
		: { account, source: 'none', fetchedAt: null, windows: {}, error: 'no live fetch and no rig cache' };
}

/**
 * What this glass knows right now, **without touching the network**. The Works' bill and anything
 * else on the poll reads through here (B10 §5's note, paid): a fetch on a three-second timer would
 * be a token read and an HTTPS round trip every three seconds for a number that moves in minutes.
 *
 * An account this glass has not fetched falls back to the rig's own cache file, **labelled `cache`**
 * so the page can print which clock a figure is on.
 */
export function usageNow(rig: Rig): LiveUsage[] {
	const accounts = [...rig.accounts.values()];
	if (accounts.every(a => held.has(a))) return accounts.map(a => held.get(a)!);
	return accounts.map(account => held.get(account) ?? fromCache(rig, account));
}

const stale = (u: LiveUsage | undefined, nowSeconds: number): boolean =>
	u === undefined || u.fetchedAt === null || nowSeconds - u.fetchedAt > TTL_SECONDS;

/**
 * Fetch every account whose held copy is older than the TTL, in parallel — three round trips at
 * once, because they are three independent tokens and serialising them would triple the wait Felix
 * sees when the Action pane opens.
 *
 * **A failed fetch never destroys a good answer and never invents one** (D10's family). It keeps the
 * best figures it has — the last good fetch, else the rig's own cache — and hangs the new error on
 * them, so the page renders **stale-with-age** and says which clock the numbers are on. An account
 * with neither renders `none` and no figures at all: blank is honest, zero is a lie.
 *
 * `fetcher` is a test seam and only that: the real one reads a keychain and calls Anthropic.
 */
export async function refreshUsage(
	rig: Rig, nowSeconds = Date.now() / 1000, fetcher = fetchOne,
): Promise<LiveUsage[]> {
	const wanted = [...rig.accounts].filter(([, account]) => stale(held.get(account), nowSeconds));
	await Promise.all(wanted.map(async ([dir, account]) => {
		const got = await fetcher(dir, account);
		if (got.source === 'live') { held.set(account, got); return; }
		const previous = held.get(account);
		const base = previous && previous.fetchedAt !== null ? previous : fromCache(rig, account);
		held.set(account, { ...base, error: got.error });
	}));
	return usageNow(rig);
}

/** Test seam, and only that: the held copies are this process's memory, so a suite must be able to clear them. */
export const forgetUsage = (): void => { held.clear(); };

// ---------- the wire ----------

/** The three cells one account renders: `used% ±pacing`, the rig's own arithmetic (`gauges.ts`). */
export const usageWire = (us: LiveUsage[], nowSeconds = Date.now() / 1000): UsageWire[] =>
	us.map(u => ({
		account: u.account,
		source: u.source,
		ageSeconds: u.fetchedAt === null ? null : Math.max(0, nowSeconds - u.fetchedAt),
		error: u.error,
		cells: BUCKETS.map(bucket => {
			const q = u.windows[bucket];
			return { bucket, pct: q?.pct ?? null, delta: q === undefined ? null : pacing(q, nowSeconds) };
		}),
	}));
