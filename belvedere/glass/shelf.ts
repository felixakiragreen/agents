// The shelf — every session the three accounts have ever held, and one click to stand in it.
//
// "Any session, any account, live or weeks dead" (B5's goal). The corpus is the harness's own
// store, `~/.claude*/projects/<slug>/<uuid>.jsonl`, read three ways and joined on the uuid:
//
//   the filename  → the session id, which is also the resume handle
//   the head 64 KB → the name-stamp and the cwd (census `identify()`; B2 F1's law)
//   the census     → live or dead, and which panel to jump to
//
// **The slug is never parsed.** `-Users-felix-code-universal-robots-sdk` is what both
// `universal_robots_sdk` and `universal-robots-sdk` flatten to, so inverting it would attribute
// sessions to buildings that do not exist. The cwd inside the transcript is the real thing.
//
// Two affordances, and which one a row gets is a fact, not a preference: a **dead** session
// resumes into a new cmux workspace; a **live** one is already running, so the honest action is
// to jump to its panel. Neither ever sends a first user turn — see `hands.ts` §Fire.

import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { identify, isLive, readCensus, type CensusRead, type Session } from './census';
import { usageStrip, wip, wipGauges, readUsage, usageNote } from './gauges';
import { handsState } from './hands';
import { esc, label, page, pill, sessionTone, short } from './html';
import { ago, buildingOf, censusNote, registerNote, window_ } from './pages';
import { projectsDir } from './paths';
import { register, type Entry } from './register';
import { accountLabel, mantleOf, readRig, type Rig } from './rig';
import { colourOf } from './summon';

/**
 * Everything has a limit (directive 3.1). The corpus is 725 transcripts today and grows every
 * day; `ROWS` is what one page renders, and the count it withheld is printed rather than
 * silently dropped — a shelf that quietly ends at row 200 is a shelf that lies about the city.
 */
const ROWS = 120;

/** A transcript's name IS its session id, which is also `--resume`'s argument. */
const UUID_FILE = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl$/;

export type Shelved = {
	sid: string;
	account: string;
	transcript: string;
	stamp: string | null;
	cwd: string | null;
	building: string | null;
	at: number;                  // mtime, epoch seconds — when the session last said anything
	bytes: number;
	live: Session | null;        // the census's word, where it has one
};

// ---------- the scan ----------

/** Every `<uuid>.jsonl` under one account's projects tree. A missing tree is an account with no sessions. */
function transcriptsOf(configDir: string): { sid: string; path: string }[] {
	const root = projectsDir(configDir);
	let slugs: string[];
	try { slugs = readdirSync(root); } catch { return []; }
	const out: { sid: string; path: string }[] = [];
	for (const slug of slugs) {
		let files: string[];
		try { files = readdirSync(join(root, slug)); } catch { continue; }
		for (const f of files) {
			const m = UUID_FILE.exec(f);
			if (m) out.push({ sid: m[1]!, path: join(root, slug, f) });
		}
	}
	return out;
}

/**
 * The whole shelf, read from disk. Measured at this build row: **725 transcripts, 35 MB of head
 * windows, 33–44 ms warm** (253 ms with a cold page cache) — which is why this runs on the
 * request thread and the register does not (B8 F3: the bar is the work, not the pattern).
 */
export function scan(rig: Rig, entries: Entry[], census: CensusRead): Shelved[] {
	const byId = new Map(census.sessions.map(s => [s.sid, s]));
	const out: Shelved[] = [];
	for (const [configDir, account] of rig.accounts) {
		for (const { sid, path } of transcriptsOf(configDir)) {
			let at = 0, bytes = 0;
			try { const st = statSync(path); at = st.mtimeMs / 1000; bytes = st.size; } catch { continue; }
			const who = identify(path);
			const live = byId.get(sid) ?? null;
			// The census's cwd is the session's own, live and current; the transcript's is where it
			// began. Prefer the live one, fall back to the transcript, claim nothing if neither.
			const cwd = live?.cwd ?? who.cwd;
			out.push({
				sid, account, transcript: path, stamp: live?.stamp ?? who.stamp, cwd,
				building: buildingOf(cwd, entries)?.building ?? null,
				at, bytes, live: live && isLive(live) ? live : null,
			});
		}
	}
	return out;
}

// ---------- attention first, recency within (design law, README §3) ----------

/**
 * What a row is *for*, in one word — and the sort key. Attention outranks recency across the
 * whole shelf; recency orders inside each rank. A session waiting on Felix is the top of the
 * shelf however old it is, and a three-week-dead transcript never outranks a live one.
 */
export type Rank = 'needs-input' | 'working' | 'resting' | 'dead';

export const rankOf = (s: Shelved): Rank =>
	s.live === null ? 'dead'
	: s.live.state === 'needs-input' ? 'needs-input'
	: s.live.state === 'working' ? 'working' : 'resting';

const ORDER: Record<Rank, number> = { 'needs-input': 0, working: 1, resting: 2, dead: 3 };

export const shelfOrder = (a: Shelved, b: Shelved) => ORDER[rankOf(a)] - ORDER[rankOf(b)] || b.at - a.at;

// ---------- filters ----------

/** The age buckets, in seconds. `all` is the absence of the filter, named so it can be a button. */
export const AGES: Readonly<Record<string, number>> = { '24h': 86400, '7d': 604800, '30d': 2592000, all: Infinity };

export type Filter = { account: string; building: string; age: string };

export const readFilter = (q: URLSearchParams): Filter => ({
	account: q.get('account') ?? 'all',
	building: q.get('building') ?? 'all',
	age: q.get('age') ?? '7d',
});

export function apply(shelf: Shelved[], f: Filter, nowSeconds: number): Shelved[] {
	const span = AGES[f.age] ?? Infinity;
	return shelf.filter(s =>
		(f.account === 'all' || s.account === f.account)
		&& (f.building === 'all' || (s.building ?? 'off the register') === f.building)
		// A live session is never aged out: the filter is about digging up the dead.
		&& (s.live !== null || nowSeconds - s.at <= span));
}

// ---------- render ----------

const href = (f: Filter, over: Partial<Filter>) => {
	const q = new URLSearchParams({ ...f, ...over });
	return `/shelf?${q.toString()}`;
};

/**
 * A toggled button group — the design law's replacement for a dropdown (README §3). Every option
 * is a link carrying the whole filter, so the page has no client state to lose and the browser's
 * back button walks the filter history for free.
 */
const group = (name: string, options: string[], current: string, f: Filter, key: keyof Filter) =>
	`<div class="group">${label(name)}<div class="btns">${options.map(o =>
		`<a class="btn${o === current ? ' on' : ''}" href="${esc(href(f, { [key]: o }))}">${esc(o)}</a>`).join('')}</div></div>`;

const RANK_PILL: Record<Rank, [string, Parameters<typeof pill>[1]]> = {
	'needs-input': ['waiting on you', 'red'],
	working: ['working', 'green'],
	resting: ['live · resting', 'blue'],
	dead: ['dead', 'grey'],
};

/**
 * One shelved session. **Encapsulation-first** (design law): the row leads with its name — the
 * stamp, or an honest `unstamped` — and `[expand]` opens the rest. A `<details>` element does it
 * with no script and no state: the disclosure is the browser's, so it survives everything.
 */
function row(s: Shelved, rig: Rig, armed: boolean): string {
	const rank = rankOf(s);
	const [text, tone] = RANK_PILL[rank];
	const name = s.stamp
		? `<b class="stamp">${esc(s.stamp)}</b>`
		: `<b class="stamp unstamped">unstamped</b> <code>${esc(s.sid.slice(0, 8))}</code>`;

	const where = s.building
		? `<a class="where" href="/b/${s.building.split('/').map(encodeURIComponent).join('/')}">${esc(s.building)}</a>`
		: `<span class="where bad">off the register</span>`;

	return `<article class="berth tone-${tone}" data-rank="${rank}">
		<div class="berth-h">
			${s.live ? window_(s.live, rig) : '<span class="win st-gone"></span>'}
			${name} ${pill(text, tone)} <span class="acct">${esc(s.account)}</span> ${where}
			<span class="when">${esc(ago(s.at))}</span>
		</div>
		<div class="acts">${actions(s, rig, armed)}<span class="out" data-out></span></div>
		<details class="more"><summary>expand</summary>
			<div class="kvs">
				<div class="kv">${label('session')}<code>${esc(s.sid)}</code></div>
				<div class="kv">${label('cwd')}<code>${esc(s.cwd ? short(s.cwd) : 'not recorded in the head window')}</code></div>
				<div class="kv">${label('transcript')}<code>${esc(short(s.transcript))}</code></div>
				<div class="kv">${label('size')}<span class="num">${(s.bytes / 1024).toFixed(0)} KB</span></div>
				${s.live ? `<div class="kv">${label('last')}<span>${esc(s.live.last.ev)}${s.live.tool ? ` <code>${esc(s.live.tool)}</code>` : ''}
					· ${esc(ago(s.live.last.t))} ago · ${s.live.beats} beats</span></div>` : ''}
				${s.live?.agent ? `<div class="kv">${label('inside')}<span>subagent <code>${esc(s.live.agent.id)}</code>${
					s.live.agent.type ? ` · ${esc(s.live.agent.type)}` : ''}</span></div>` : ''}
				${s.live?.roster ? `<div class="kv">${label('roster')}<span>${
					s.live.roster.tasks.map(t => `${esc(t.type)} <code>${esc(t.id.slice(0, 8))}</code> ${esc(t.status)}`).join(' · ')
					|| 'empty'}${s.live.roster.capped ? ' <b class="bad">+ more (hook cap)</b>' : ''}
					<span class="when">last seen ${esc(ago(s.live.roster.at))} ago</span></span></div>` : ''}
			</div></details></article>`;
}

/**
 * The two affordances, and the reasons there is sometimes neither. A resume needs a directory to
 * land in: a worktree that has since been removed leaves a transcript whose cwd is gone, and the
 * honest render is to say so rather than to fire into `~` and call it the same session.
 */
function actions(s: Shelved, rig: Rig, armed: boolean): string {
	const cold = armed ? '' : ' disabled';
	if (s.live) {
		if (!s.live.last.sf) return `<span class="reason">live outside a cmux pane — nothing to jump to (hooks are venue-blind)</span>`;
		return `<button class="go" data-focus="${esc(JSON.stringify({ sid: s.sid }))}"${cold}>jump to panel</button>`;
	}
	if (!s.cwd) return `<span class="reason">no cwd on record — nowhere to resume it</span>`;
	if (!existsSync(s.cwd)) return `<span class="reason">its directory is gone: <code>${esc(short(s.cwd))}</code></span>`;
	return `<button class="go" data-resume="${esc(JSON.stringify(resumeBody(s, rig)))}"${cold}>resume</button>`;
}

/**
 * The resume payload. Every field the transcript does not carry is sent **empty**, and `hands.ts`
 * drops the flag rather than guessing: no summons (no first user turn), no model or effort (the
 * tier a session ran at is nowhere in its transcript), and no `-n` for a session that never had a
 * stamp. The handle is always the **uuid**, never the stamp: resume-by-name is legal (P4 §R) but
 * it resolves through claude's own most-recent rule, and the glass will not make that choice
 * blind when the exact handle is the filename it just read.
 */
export const resumeBody = (s: Shelved, rig: Rig) => ({
	account: s.account, stamp: s.stamp ?? '', cwd: s.cwd ?? '',
	model: '', effort: '', color: colourOf(rig, mantleOf(rig, s.stamp)),
	summons: '', resume: s.sid,
});

const LEGEND = `<section class="legend">
	${label('legend')}
	<span class="key"><span class="win tone-grey st-working"></span>working — heartbeat inside the stale window</span>
	<span class="key"><span class="win tone-grey st-needs-input"></span>needs input — a permission prompt is waiting</span>
	<span class="key"><span class="win tone-grey st-idle"></span>idle — last said <code>Stop</code></span>
	<span class="key"><span class="win tone-grey st-unknown"></span>unknown — no pid to ask, or a dead sensor</span>
	<span class="key"><span class="win st-gone"></span>dead — no live process; the shelf can resume it</span>
	<span class="key">fill colour is the mantle from the name-stamp (<code>presets.tsv</code>); grey is unstamped</span>
</section>`;

/** The one script on the shelf: resume and jump, one delegated listener, no framework. */
const SCRIPT = `<script>
document.addEventListener('click', async ev => {
	const btn = ev.target.closest('button[data-resume], button[data-focus]');
	if (!btn) return;
	const out = btn.closest('.acts').querySelector('[data-out]');
	const resuming = btn.hasAttribute('data-resume');
	const hand = resuming ? 'fire' : 'focus';
	btn.disabled = true;
	out.textContent = resuming ? 'resuming…' : 'jumping…';
	try {
		const r = await fetch('/hands/' + hand, { method: 'POST', headers: { 'content-type': 'application/json' },
			body: btn.dataset.resume || btn.dataset.focus });
		const code = r.status, body = await r.json();
		out.textContent = body.ok
			? (resuming ? 'resumed in ' + body.result.workspace : 'focused ' + body.result.surface)
			: code + ' ' + body.error;
		if (!body.ok) btn.disabled = false;
	} catch (e) { out.textContent = String(e); btn.disabled = false; }
});
</script>`;

export function shelfPage(query: URLSearchParams): string {
	const t0 = performance.now();
	const now = Date.now() / 1000;
	const reg = register();
	const census = readCensus();
	const rig = readRig();
	const hands = handsState();

	const all = scan(rig, reg.entries, census);
	const f = readFilter(query);
	const shown = apply(all, f, now).sort(shelfOrder);

	const buildings = [...new Set(all.map(s => s.building ?? 'off the register'))].sort();
	const filters = `<section class="filters">
		${group('account', ['all', ...rig.accounts.values()], f.account, f, 'account')}
		${group('age', Object.keys(AGES), f.age, f, 'age')}
		${group('building', ['all', ...buildings], f.building, f, 'building')}
	</section>`;

	const counts = `<section class="strip">
		<div class="stat"><span class="label">on the shelf</span><b>${shown.length}</b></div>
		<div class="stat"><span class="label">transcripts</span><b>${all.length}</b></div>
		<div class="stat"><span class="label">live</span><b class="t-working">${all.filter(s => s.live).length}</b></div>
		<div class="stat"><span class="label">unstamped</span><b class="t-unknown">${all.filter(s => !s.stamp).length}</b></div>
		<div class="stat"><span class="label">hands</span><b class="small">${hands.armed ? pill('armed', 'green') : pill('disabled', 'orange')}</b></div>
		<div class="stat"><span class="label">census</span><b class="small">${censusNote(census)}</b></div>
	</section>`;

	const banner = hands.armed ? '' : `<section class="panel"><h2>Hands disabled</h2>
		<p class="prose note">Every resume and jump below is cold — <code>/hands/*</code> answers 503 until the credential is armed.
		The shelf itself is unaffected: it reads the three accounts either way.
		<br><span class="bad">${esc(hands.note)}</span></p></section>`;

	const withheld = shown.length > ROWS
		? `<p class="prose note bad">${shown.length - ROWS} more match this filter and are not drawn — narrow it by account, age or building.</p>` : '';

	const list = shown.length
		? `<section class="berths">${shown.slice(0, ROWS).map(s => row(s, rig, hands.armed)).join('')}</section>${withheld}`
		: `<p class="prose note">Nothing matches. The shelf holds ${all.length} transcripts in total — widen the age.</p>`;

	const usages = readUsage(rig);
	const load = wip(census, rig, s => buildingOf(s.cwd, reg.entries)?.building ?? null);

	const ms = performance.now() - t0;
	return page('Belvedere — the shelf', '<a href="/">rail</a> <span>/</span> <a href="/city">city</a> <span>/</span> <span>shelf</span>',
		banner + counts + usageStrip(usages, now) + wipGauges(load) + filters + LEGEND + list + SCRIPT,
		`${all.length} transcripts scanned in ${ms.toFixed(0)} ms · ${usageNote(usages)} · ${registerNote(reg, '/shelf')}`);
}
