// The bill on the wall — what the city is spending, and how much of it is in flight.
//
// Two sources, one wall, and neither of them is ever fetched here:
//
//  1. **Usage** — the rig's own caches, `summon/log/usage/<config-dir-basename>.json`, written
//     by `summon-usage` (rig README §usage). **Render only.** The rig owns the OAuth token, the
//     Keychain read and the network call; the glass owning a second fetcher would mean a second
//     token path, and D3's fence has no line for it. A cache that stops landing goes grey; the
//     glass never "helps" by refreshing it.
//  2. **WIP** — the census, rolled up. Live sessions per account and per building, plus the
//     subagents and background shells the last beat of each session was carrying.
//
// One law rules the roster figures: **`bg` is capped at 16 by the hook** (P1 F6's concurrent-
// append guard, batch-2 bulletin §3), so a full roster is a sample and renders `16+`. A gauge
// that prints `16` where the truth might be 90 is exactly the hidden bill this row exists to
// prevent.

import { readFileSync } from 'fs';
import { basename, join } from 'path';
import { BG_CAP, isLive, type CensusRead, type Session } from './census';
import { ago, esc, label, short } from './html';
import { usageDir } from './paths';
import { accountLabel, type Rig } from './rig';

/** The rig's three windows: the 5-hour session limit, the 7-day limit, the Fable-scoped 7-day. */
export const BUCKETS = ['sess', 'week', 'fable'] as const;
export type Bucket = (typeof BUCKETS)[number];

/** The rig greys a cache older than this (rig README §usage) — one staleness bar in the city. */
export const STALE_SECONDS = 600;

export type Quota = { pct: number; resetsAt: number; windowSecs: number };

/** One account's cache, or the honest absence of one. `windows` holds only the buckets it had. */
export type Usage = {
	account: string;
	file: string;
	fetchedAt: number | null;                     // null ⇒ no cache; every bucket reads `—`
	windows: Partial<Record<Bucket, Quota>>;
};

// ---------- the parse boundary ----------

const num = (v: unknown): number | null => typeof v === 'number' && Number.isFinite(v) ? v : null;

/** The cache's JSON in, a trusted `Usage` out. A bucket missing a field is a bucket we do not have. */
export function toUsage(account: string, file: string, raw: unknown): Usage {
	const empty: Usage = { account, file, fetchedAt: null, windows: {} };
	if (typeof raw !== 'object' || raw === null) return empty;
	const r = raw as Record<string, unknown>;
	const fetchedAt = num(r.fetched_at);
	if (fetchedAt === null) return empty;         // an undateable cache cannot be aged, so it is no cache

	const windows: Usage['windows'] = {};
	const w = typeof r.windows === 'object' && r.windows !== null ? r.windows as Record<string, unknown> : {};
	for (const bucket of BUCKETS) {
		const b = w[bucket];
		if (typeof b !== 'object' || b === null) continue;
		const x = b as Record<string, unknown>;
		const pct = num(x.used_pct), resetsAt = num(x.resets_at), windowSecs = num(x.window_secs);
		if (pct === null || resetsAt === null || windowSecs === null || windowSecs <= 0) continue;
		windows[bucket] = { pct, resetsAt, windowSecs };
	}
	return { account, file, fetchedAt, windows };
}

/**
 * One cache per account, keyed the way the rig keys them: the config dir's own basename, dotfile
 * and all (`~/.claude-thg-fgreen` → `.claude-thg-fgreen.json`).
 */
export function readUsage(rig: Rig): Usage[] {
	return [...rig.accounts].map(([dir, account]) => {
		const file = join(usageDir(), `${basename(dir)}.json`);
		try { return toUsage(account, file, JSON.parse(readFileSync(file, 'utf8'))); }
		catch { return { account, file, fetchedAt: null, windows: {} }; }
	});
}

/**
 * **The pacing delta is the clock, rendered** (rig README §usage): `elapsed% − used%`. Positive is
 * headroom — the window is running out faster than you are spending it. Negative means the spend
 * is outrunning the clock and the window dries up early. The reset time is not shown anywhere
 * because this number already contains it.
 */
export const pacing = (q: Quota, nowSeconds: number): number => {
	const elapsed = 100 * (1 - (q.resetsAt - nowSeconds) / q.windowSecs);
	const elapsedPct = Math.min(100, Math.max(0, elapsed));   // a reset already past, or further out than one window
	const diff = elapsedPct - q.pct;
	// The rig rounds **away from zero** (`summon.zsh:_summon_usage_delta`), so a delta reads the
	// way a human rounds it. `Math.round` rounds half toward +∞ and would print `-13` where the
	// rig's own panel prints `-14`: two tables side by side must not disagree by a point.
	return Math.trunc(diff + (diff >= 0 ? 0.5 : -0.5));
};

// ---------- the auditor: the sensor's own drift alarm (B9 amendment, on B5 E1) ----------

/**
 * One approximate count of `claude` processes on this machine, to sit beside the census figure.
 *
 * **It is a count, never sessions.** The census stays the sole identity authority (P1 F5): this
 * joins nothing, houses nothing, and never reaches a card. It is the `sync/check` pattern pointed
 * at the sensor — the gap is the pre-horizon floor today (6 tracked, ~38 visible; B5 E1), it decays
 * as those sessions die, and a gap that REOPENS after the horizon means a sensor is lying.
 *
 * The rule is `argv[0]`'s basename, minus the harness's own `bg-*` helpers. B5 E1's `[c]laude` grep
 * counted 41 here where the CLI processes were 36: the five were shell snapshots sourcing a path
 * with `.claude` in it, and one glass counting its own audit noise is a drift alarm that cries.
 */
export function auditorCount(): number | null {
	try {
		const ps = Bun.spawnSync(['ps', '-axo', 'command=']);
		if (!ps.success) return null;
		return ps.stdout.toString().split('\n').filter(line => {
			const argv = line.trim().split(/\s+/);
			return basename(argv[0] ?? '') === 'claude' && !(argv[1] ?? '').startsWith('bg-');
		}).length;
	} catch { return null; }              // no `ps` is no alarm, never a zero
}

/**
 * The delta line, one voice on all three views: what the census tracks, what the machine shows,
 * and — while the pre-hook floor lasts — that the gap is the horizon rather than a defect.
 */
export function auditorLine(tracked: number, visible: number | null): string {
	if (visible === null) return `<span class="audit">${tracked} tracked · <span class="bad">no process auditor — <code>ps</code> did not answer</span></span>`;
	const gap = visible - tracked;
	return `<span class="audit">${tracked} tracked · ≈${visible} claude processes visible`
		+ (gap > 0 ? ` · <b class="bad">${gap} beyond the census</b>` : ' · <b>no gap</b>') + `</span>`;
}

export const usageAge = (u: Usage, nowSeconds: number): number | null =>
	u.fetchedAt === null ? null : Math.max(0, nowSeconds - u.fetchedAt);

// ---------- WIP, rolled up from the census ----------

/**
 * A roster figure, and the two ways it is a floor rather than a total: `capped` when the hook's
 * slice cut a roster off (`16+`), `unobserved` for the live sessions that have never yet emitted
 * a `Stop` or `SubagentStop` and so have contributed nothing at all.
 */
export type Roster = { n: number; capped: boolean; unobserved: number };

export type AccountWip = {
	account: string;
	sessions: number;
	states: Record<string, number>;
	subagents: Roster;
	shells: Roster;
};

export type Wip = {
	present: boolean;
	accounts: AccountWip[];
	buildings: { building: string; sessions: number }[];
	subagents: Roster;
	shells: Roster;
	since: number | null;      // the sensor's horizon — everything older than this is invisible
};

const roster = (ss: Session[], type: string): Roster => ({
	n: ss.reduce((sum, s) => sum + (s.roster?.tasks.filter(t => t.type === type).length ?? 0), 0),
	// One session at the cap is enough to make the total a floor: the hook threw the rest away.
	capped: ss.some(s => s.roster?.capped),
	unobserved: ss.filter(s => s.roster === null).length,
});

/**
 * The live city, per account and per building. `buildingOf` is the caller's — the roll-up takes
 * the attribution it was given rather than re-deriving it, so the gauges and the City View can
 * never disagree about where a session lives.
 */
export function wip(census: CensusRead, rig: Rig, buildingOfSession: (s: Session) => string | null): Wip {
	const live = census.sessions.filter(isLive);

	const accounts: AccountWip[] = [...rig.accounts.values()].map(account => {
		const mine = live.filter(s => accountLabel(rig, s.account) === account);
		const states: Record<string, number> = { working: 0, 'needs-input': 0, idle: 0, unknown: 0 };
		for (const s of mine) states[s.state] = (states[s.state] ?? 0) + 1;
		return { account, sessions: mine.length, states, subagents: roster(mine, 'subagent'), shells: roster(mine, 'shell') };
	});

	const counts = new Map<string, number>();
	for (const s of live) {
		const key = buildingOfSession(s) ?? 'off the register';
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}

	return {
		present: census.present,
		accounts,
		buildings: [...counts].map(([building, sessions]) => ({ building, sessions })).sort((a, b) => b.sessions - a.sessions),
		subagents: roster(live, 'subagent'), shells: roster(live, 'shell'),
		since: census.since,
	};
}

// ---------- render ----------

/**
 * `16+` when the hook's slice cut the roster off, plain otherwise — the `+` is the whole point.
 * A figure standing on nothing but unobserved sessions is not `0`: it is `?`, because the census
 * has never been told.
 */
export const rosterText = (r: Roster) =>
	r.n === 0 && r.unobserved > 0 ? '?' : `${r.n}${r.capped ? '+' : ''}`;

const cell = (u: Usage, bucket: Bucket, nowSeconds: number): string => {
	const q = u.windows[bucket];
	// No data has no figure to protect, so it greys whole (rig README §usage).
	if (!q) return `<span class="cell empty">${esc(bucket)} —</span>`;
	const d = pacing(q, nowSeconds);
	return `<span class="cell"><span class="bucket">${esc(bucket)}</span>`
		+ `<b class="pct">${q.pct}%</b>`
		+ `<b class="delta ${d < 0 ? 'burning' : 'headroom'}">${d >= 0 ? '+' : ''}${d}</b></span>`;
};

/**
 * The quota table, one line per account, in `accounts.tsv` order — the same shape the rig prints
 * in its own panel, so the two can be read side by side without translation.
 *
 * **Staleness greys the furniture, never the figures** (D41's palette law, the rig's own words):
 * a cache over ten minutes old dims the account name and the bucket labels while every number
 * keeps full contrast. A number you have to squint at is a number you misread.
 */
export function usageStrip(usages: Usage[], nowSeconds: number): string {
	const lines = usages.map(u => {
		const age = usageAge(u, nowSeconds);
		const stale = age === null || age > STALE_SECONDS;
		const when = age === null ? 'no cache' : `${Math.round(age / 60)}m old`;
		return `<div class="uline${stale ? ' stale' : ''}">
			<span class="acct">${esc(u.account)}</span>
			${BUCKETS.map(b => cell(u, b, nowSeconds)).join('')}
			<span class="fetched">${esc(when)}</span></div>`;
	}).join('');

	return `<section class="panel gauge">
		<h2>Usage — the quota table</h2>
		<p class="prose note">Rendered from the rig's own caches; the deck never fetches. Each cell is
			<code>used% ±pacing</code> — the pacing delta is <code>elapsed% − used%</code>, so
			<b class="delta headroom">+31</b> is headroom and <b class="delta burning">-13</b> means the
			window dries up early. A cache over ${STALE_SECONDS / 60} minutes old greys its furniture; the
			figures keep full contrast either way.</p>
		${lines || `<p class="prose note bad">No accounts in the rig's <code>accounts.tsv</code>.</p>`}
	</section>`;
}

const bar = (n: number, of: number) =>
	`<span class="bar"><span style="width:${of > 0 ? Math.round((n / of) * 100) : 0}%"></span></span>`;

/**
 * WIP, per account and per building. Degrades honestly (spec §4): with no census the panel says
 * the sensor is not deployed rather than drawing a city with nothing in it.
 */
export function wipGauges(w: Wip, visible: number | null): string {
	const tracked = w.accounts.reduce((n, a) => n + a.sessions, 0);
	const audit = `<p class="prose note">${auditorLine(tracked, visible)} — the census is the only thing here
		that knows <em>which</em> sessions; the process count joins nothing and names nothing. It is the sensor's
		drift alarm: today's gap is the pre-hook horizon and decays with it, and a gap that reopens afterwards
		means a sensor is lying.</p>`;

	if (!w.present) return `<section class="panel gauge"><h2>WIP</h2>
		<p class="prose note bad">unknown — census not deployed. The shelf above still lists every transcript;
		nothing here can be counted until <code>belvedere/census/deploy.ts</code> has run.</p>${audit}</section>`;

	const most = Math.max(1, ...w.accounts.map(a => a.sessions));
	const rows = w.accounts.map(a => `<div class="wline">
		<span class="acct">${esc(a.account)}</span>
		${bar(a.sessions, most)}
		<b class="n">${a.sessions}</b>
		${Object.entries(a.states).filter(([, n]) => n > 0)
			.map(([k, n]) => `<span class="cell"><span class="bucket t-${esc(k)}">${esc(k)}</span><b class="pct">${n}</b></span>`).join('')
		|| `<span class="cell empty">no live sessions</span>`}
	</div>`).join('');

	const topBuilding = Math.max(1, ...w.buildings.map(b => b.sessions));
	const byBuilding = w.buildings.length ? w.buildings.map(b => `<div class="wline">
		<span class="acct">${esc(b.building)}</span>${bar(b.sessions, topBuilding)}<b class="n">${b.sessions}</b>
	</div>`).join('') : `<p class="prose note">No live session anywhere in the city.</p>`;

	return `<section class="panel gauge"><h2>WIP — what is in flight</h2>
		<p class="prose note"><b class="bad">Every figure here is a floor, not a total.</b> The census only
			knows sessions that have heartbeated${w.since === null ? '' : `, and its earliest beat on record is
			<b>${esc(ago(w.since))}</b> old`} — a session started before the hooks went live never beats and is
			invisible to this panel. The roster figures are bounded twice over: the heartbeat keeps at most
			${BG_CAP} background entries per record, so a full roster renders <code>${BG_CAP}+</code>, and a
			background shell's completion fires no event at all (P1 F4) — a shell counted here was
			<b>last seen</b> running, not proven running now. Worse, <b>only <code>Stop</code> and
			<code>SubagentStop</code> payloads carry the roster at all</b> (measured: 210 of 210 non-empty
			rosters, none on 1820 tool-use beats), so a session that has not stopped since it started work
			contributes nothing here and reads <code>?</code>, never <code>0</code>${
			w.subagents.unobserved ? ` — <b class="bad">${w.subagents.unobserved} of ${w.accounts.reduce((n, a) => n + a.sessions, 0)}
			live sessions have never been observed carrying one</b>` : ''}.</p>
		${audit}
		<p class="prose note">Live sessions by account and by building, off the census.</p>
		<div class="counts">
			<div class="stat"><span class="label">subagents</span><b class="t-working">${esc(rosterText(w.subagents))}</b></div>
			<div class="stat"><span class="label">background shells</span><b class="t-idle">${esc(rosterText(w.shells))}</b></div>
			<div class="stat"><span class="label">buildings lit</span><b>${w.buildings.length}</b></div>
		</div>
		<div class="wgrid"><div>${label('by account')}${rows}</div><div>${label('by building')}${byBuilding}</div></div>
	</section>`;
}

/** The one place the gauges name a file, for the footer: where the bill was read from. */
export const usageNote = (usages: Usage[]) =>
	`usage ${usages.filter(u => u.fetchedAt !== null).length}/${usages.length} cached · ${esc(short(usageDir()))}`;
