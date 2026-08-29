// The two pages of the spine — City View and the building page — plus the document viewer
// that makes D58's links resolve. Every page re-reads disk; nothing here is cached.

import { readFileSync, statSync } from 'fs';
import { homedir } from 'os';
import { dirname, resolve, sep } from 'path';
import { discover, type Building, type Board, type BoardRow, type Fail } from '../../doctrine';
import { readCensus, isLive, type CensusRead, type Session } from './census';
import { handsState } from './hands';
import { applyAct, INBOX_SCRIPT, noteBox, rowGestures } from './inbox';
import { city, TTL_MS, type Register } from './register';
import { readRig, accountLabel, mantleOf, type Rig } from './rig';
import { cityRoot } from './paths';
import { auditorCount, auditorLine } from './gauges';
import { ago, baseOf, docHref, encap, encapHtml, esc, expand, inline, label, legend, LIVENESS_KEYS, mantleKeys, page, pill, rigTone, sessionTone, short, stateTone } from './html';

const DOC_BYTES = 2 << 20;

// ---------- shared bits ----------

/**
 * The register's own footer line, one voice for every page that serves off the held copy: how old
 * it is, what it cost, the TTL it lives under, and the button that walks it again now. The age is
 * the E1 ruling's honesty mechanism — a 300 s TTL is only honest if the page says how warm it is.
 */
export const registerNote = (reg: Register, here: string) =>
	`register ${ago(reg.at / 1000)} old${reg.refreshing ? ' (refreshing)' : ''}`
	+ ` · ${reg.entries.length} buildings walked in ${reg.ms.toFixed(0)} ms, ${reg.suppressed} worktree copies deduped`
	+ ` · ttl ${TTL_MS / 1000}s <a class="rewalk" href="/rewalk?to=${encodeURIComponent(here)}">re-walk</a>`
	+ (reg.error ? ` · <span class="bad">${esc(reg.error)}</span>` : '');

const WORKTREES = `${sep}.claude${sep}worktrees${sep}`;

/**
 * A cwd, plus every reading of it as a worktree checkout: `<repo>/.claude/worktrees/<branch>/<x>`
 * is `<repo>/<x>` wearing a branch.
 *
 * **A branch is not one path segment.** The city's own branches are `bv/b3-smoke`, `bv/b1-census`,
 * `feat/whatever` at least as often as `naming` — and nothing in the path says where the branch
 * ends and the checkout's interior begins. So every split is offered and the register decides
 * which one names a building; only the register knows what a building is (D65). Measured cost:
 * one candidate per segment, over a list the walk already built.
 */
function readings(cwd: string): string[] {
	const at = cwd.indexOf(WORKTREES);
	if (at < 0) return [cwd];
	const repo = cwd.slice(0, at);
	const rest = cwd.slice(at + WORKTREES.length).split(sep);
	// `branch = rest.length` consumes the whole tail: the checkout's own root, which is the repo.
	return [cwd, ...rest.map((_, n) => [repo, ...rest.slice(n + 1)].join(sep))];
}

/**
 * A session's building is the deepest one containing its cwd, under any reading of that cwd.
 *
 * Generic over anything that carries a name and a path, so the shelf can attribute against the
 * register's own `Entry[]` — the file list, without re-reading a single board (B8 F3: content
 * the page does not render is content the page must not pay for).
 */
export function buildingOf<T extends { building: string; path: string }>(cwd: string | null, buildings: T[]): T | null {
	if (!cwd) return null;
	let best: T | null = null;
	for (const norm of readings(cwd))
		for (const b of buildings)
			if ((norm === b.path || norm.startsWith(b.path + sep)) && (!best || b.path.length > best.path.length)) best = b;
	return best;
}

/** One live session, as a dot: mantle-coloured, ringed by state. Unknown reads as unknown. */
export const window_ = (s: Session, rig: Rig) =>
	`<span class="win tone-${rigTone(rig.colours.get(mantleOf(rig, s.stamp) ?? '') ?? null)} st-${s.state}"`
	+ ` title="${esc(`${s.stamp ?? s.sid.slice(0, 8)} · ${s.state} · ${accountLabel(rig, s.account) ?? 'account unknown'} · ${ago(s.last.t)} ago`)}"></span>`;

export const censusNote = (c: CensusRead) => c.present
	? `census ${c.beats} beats${c.malformed ? ` · <span class="bad">${c.malformed} unreadable</span>` : ''}`
	: `<span class="bad">unknown — census not deployed</span>`;

// ---------- the City View's two orders: what a building is under, and what it wants (B9) ----------

/** The two groups that are not directories: a path outside the city, and a session with no cwd. */
export const OUTSIDE = 'outside the city';
const NO_CWD = 'no cwd on record';

/**
 * The group a thing belongs to: **its directory under the city root** (`~/code/<x>`), which is the
 * repo — so `agents` and `agents/belvedere` are one neighbourhood and read as one (design law,
 * README §3). A path the city root does not contain has no `~/code/<x>` to be under and says so.
 */
export const groupOf = (path: string): string => {
	const root = cityRoot();
	if (!path.startsWith(root + sep)) return OUTSIDE;
	return path.slice(root.length + 1).split(sep)[0]!;
};

/** The group's name as Felix writes it: `~/code/<x>`. */
export const groupLabel = (name: string) =>
	name === OUTSIDE || name === NO_CWD ? name : `${cityRoot().replace(homedir(), '~')}/${name}`;

/** The City View's colours, all three vocabularies: the pulse pills, the rings, the mantle hues. */
const cityLegend = (rig: Rig) => legend([
	`${pill('n in flight', 'felix')}${pill('n open', 'blue')}${pill('n blocked', 'red')}${pill('n landed', 'green')}${pill('n lint', 'orange')} board rows, by state`,
	...LIVENESS_KEYS,
	...mantleKeys(rig.colours),
]);

/**
 * **Attention first** (design law): what a building wants from Felix, in one number. Recency never
 * competes with it — it orders inside a rank and nowhere else, so a building that has been shouting
 * for a week still outranks the one somebody touched five minutes ago.
 */
export const attentionOf = (b: Building, live: number): number => {
	if (live > 0) return 0;                                              // work is happening here now
	const rows = b.board.flatMap(x => x.rows);
	if (b.baton?.holder === 'felix' || rows.some(r => r.hexGate || r.gates.length)
		|| b.decisionQueue.some(d => d.pending) || rows.some(r => r.state === 'BLOCKED')) return 1;   // his pen
	if (b.baton !== null || rows.some(r => r.state === 'IN FLIGHT')) return 2;                        // in play
	if (b.issues.length || b.fails.length) return 3;                                                  // filed, unswept
	return 4;
};

/** How recently this building said anything: its live sessions first, else the artifacts' own mtimes. */
export function freshness(b: Building, live: Session[]): number {
	let newest = Math.max(0, ...live.map(s => s.last.t));
	if (newest > 0) return newest;
	for (const f of [...b.files.boards, b.files.ledger, b.files.decisions, b.files.issues])
		if (f) try { newest = Math.max(newest, statSync(f).mtimeMs / 1000); } catch { /* gone since the walk */ }
	return newest;
}

const stateCounts = (b: Building) => {
	const n = { OPEN: 0, 'IN FLIGHT': 0, BLOCKED: 0, LANDED: 0, KILLED: 0, unparsed: 0 };
	for (const board of b.board) for (const r of board.rows) r.state ? n[r.state]++ : n.unparsed++;
	return n;
};

// ---------- /city — the City View ----------

export function cityPage(): string {
	const t0 = performance.now();
	// The E1 ruling binds every page: the register comes warm, the content is re-read here.
	const { reg, buildings } = city();
	const census = readCensus();
	const rig = readRig();

	const housed = new Map<string, Session[]>();
	const loose: Session[] = [];
	for (const s of census.sessions.filter(isLive)) {
		const b = buildingOf(s.cwd, buildings);
		if (!b) { loose.push(s); continue; }
		housed.set(b.building, [...(housed.get(b.building) ?? []), s]);
	}

	const tally = { working: 0, 'needs-input': 0, idle: 0, unknown: 0 } as Record<string, number>;
	for (const s of census.sessions.filter(isLive)) tally[s.state] = (tally[s.state] ?? 0) + 1;

	// The hands' own state, said out loud on the home page: a glass that cannot write should
	// never look like one that can (B4 §2).
	const hands = handsState();
	const banner = hands.armed ? '' : `<section class="panel"><h2>Hands disabled</h2>
		<p class="prose note">The fence's four write powers are off — fire, worktree, focus and halt all answer 503.
		Everything below is unaffected: the glass reads the city either way.
		<br><span class="bad">${esc(hands.note)}</span></p></section>`;

	const strip = `<section class="strip">
		<div class="stat"><span class="label">hands</span><b class="small">${hands.armed
			? pill('armed', 'green') : pill('disabled', 'orange')}</b></div>
		<div class="stat"><span class="label">buildings</span><b>${buildings.length}</b></div>
		<div class="stat"><span class="label">live sessions</span><b>${census.sessions.filter(isLive).length}</b></div>
		${Object.entries(tally).map(([k, v]) => `<div class="stat"><span class="label">${esc(k)}</span><b class="t-${k}">${v}</b></div>`).join('')}
		<div class="stat"><span class="label">census</span><b class="small">${censusNote(census)}</b></div>
	</section>
	<p class="prose note">${auditorLine(census.sessions.filter(isLive).length, auditorCount())} — the count is the
		sensor's drift alarm, never a session: it joins nothing and houses nothing (B5 E1's ruling).</p>`;

	const card = (b: Building) => {
		const live = housed.get(b.building) ?? [];
		const n = stateCounts(b);
		const pulse = [
			n['IN FLIGHT'] && pill(`${n['IN FLIGHT']} in flight`, 'felix'),
			n.OPEN && pill(`${n.OPEN} open`, 'blue'),
			n.BLOCKED && pill(`${n.BLOCKED} blocked`, 'red'),
			n.LANDED && pill(`${n.LANDED} landed`, 'green'),
			b.fails.length && pill(`${b.fails.length} lint`, 'orange'),
		].filter(Boolean).join('');
		return `<a class="card tone-${live.length ? 'felix' : 'grey'}" href="/b/${b.building.split('/').map(encodeURIComponent).join('/')}">
			<div class="card-h"><span class="name">${esc(b.building)}</span><span class="count">${live.length || ''}</span></div>
			<div class="windows">${live.map(s => window_(s, rig)).join('') || '<span class="dark">dark</span>'}</div>
			<div class="pulse">${pulse || label('no rows')}</div>
		</a>`;
	};

	// Grouped by `~/code/<x>`, attention across the groups and recency inside them (design law).
	const groups = new Map<string, Building[]>();
	for (const b of buildings) groups.set(groupOf(b.path), [...(groups.get(groupOf(b.path)) ?? []), b]);
	const rank = new Map(buildings.map(b => [b.building, attentionOf(b, (housed.get(b.building) ?? []).length)]));
	const fresh = new Map(buildings.map(b => [b.building, freshness(b, housed.get(b.building) ?? [])]));
	const sorted = [...groups].map(([name, bs]) => ({
		name,
		buildings: bs.sort((x, y) => rank.get(x.building)! - rank.get(y.building)!
			|| fresh.get(y.building)! - fresh.get(x.building)! || x.building.localeCompare(y.building)),
		rank: Math.min(...bs.map(b => rank.get(b.building)!)),
		lit: bs.reduce((n, b) => n + (housed.get(b.building) ?? []).length, 0),
	})).sort((a, b) => a.rank - b.rank || b.lit - a.lit || a.name.localeCompare(b.name));

	const cards = sorted.map(g => `<section class="nbhd">
		<div class="nbhd-h">${label(groupLabel(g.name))}<span class="dark">${g.buildings.length} building${
			g.buildings.length === 1 ? '' : 's'} · ${g.lit} lit</span></div>
		<div class="cards">${g.buildings.map(card).join('')}</div></section>`).join('');

	// Off-register sessions group the same way — same honesty, same neighbourhoods (spec §4).
	const byGroup = new Map<string, Session[]>();
	for (const s of loose) {
		const key = s.cwd ? groupOf(s.cwd) : NO_CWD;
		byGroup.set(key, [...(byGroup.get(key) ?? []), s]);
	}
	const off = loose.length ? `<section class="panel"><h2>Off the register</h2>
		<p class="prose note">Live sessions whose cwd sits in no building the parser found — counted here so the
		hand-count still adds up, and grouped by <code>~/code/&lt;x&gt;</code> like the buildings above.</p>
		${[...byGroup].sort((a, b) => b[1].length - a[1].length).map(([name, ss]) =>
			`<div class="nbhd-h">${label(groupLabel(name))}<span class="dark">${ss.length} session${ss.length === 1 ? '' : 's'}</span></div>
			${sessionTable(ss, rig)}`).join('')}</section>` : '';

	const ms = performance.now() - t0;
	return page('Belvedere — City View', '<a href="/">rail</a> <span>/</span> <span>city</span> <span>/</span> <a href="/shelf">shelf</a> <span>/</span> <a href="/summon">summon</a>',
		banner + strip + cityLegend(rig) + cards + off,
		`content re-read in ${ms.toFixed(0)} ms · ${registerNote(reg, '/city')} · ${esc(cityRoot())}`);
}

// ---------- /b/<building> — the building page ----------

export function buildingPage(slug: string): string | null {
	const t0 = performance.now();
	const abs = resolve(cityRoot(), slug);
	if (!abs.startsWith(cityRoot() + sep)) return null;        // no climbing out of the city

	// One subtree, not the whole city: the page needs this building and any nested ones (so a
	// session in `agents/belvedere` is not claimed by `agents`). 40 ms instead of nine seconds.
	const local = discover([abs], [abs]);
	const b = local.find(x => x.path === abs);
	if (!b) return null;

	const census = readCensus();
	const rig = readRig();
	const hands = handsState();
	const accounts = [...rig.accounts.values()];
	const mine = census.sessions.filter(isLive).filter(s => buildingOf(s.cwd, local)?.path === abs);

	const used = new Set<Fail>();
	const body = [
		boardPanel(b, used),
		ledgerPanel(b),
		queuePanel(b),
		issuesPanel(b, rig, accounts, hands.armed),
		`<section class="panel"><h2>Live sessions</h2>${mine.length ? sessionTable(mine, rig)
			: `<p class="prose note">${census.present ? 'None.' : 'unknown — census not deployed'}</p>`}</section>`,
		lintPanel(b, used),
		INBOX_SCRIPT,
	].join('');

	const ms = performance.now() - t0;
	return page(`Belvedere — ${slug}`, `<a href="/">city</a> <span>/</span> <span>${esc(slug)}</span>`, body,
		`re-read from disk in ${ms.toFixed(0)} ms · ${esc(short(b.path))} · ${censusNote(census)}`);
}

const failsAt = (b: Building, file: string, line: number) =>
	b.fails.filter(f => f.file === file && f.line === line);

function failNote(fs: Fail[], used: Set<Fail>): string {
	for (const f of fs) used.add(f);
	return fs.length ? `<div class="lint">${fs.map(f =>
		`<b>${esc(f.code)}</b> ${esc(f.reason)} <code>${esc(f.excerpt)}</code>`).join('<br>')}</div>` : '';
}

function boardRow(r: BoardRow, board: Board, b: Building, used: Set<Fail>, ids: string[]): string {
	const base = baseOf(board.file);
	// Encapsulation-first (design law): the row leads with the work's own name and the annotation's
	// own name; the whole of each is one [expand] away. A board row's annotation is where this city
	// keeps its landing records — the longest prose in the building — and a table of them is a wall.
	const w = encap(r.work);
	const work = (r.workDoc ? `<a href="${esc(docHref(r.workDoc, base))}">${esc(w.name)}</a>` : esc(w.name))
		+ (w.encapsulated ? expand(`<p class="prose">${inline(r.work, base)}</p>`) : '');
	const deps = [...r.dependsOn.map(d => `<code>${esc(d)}</code>`), ...r.gates.map(g => pill('Felix-gate', 'purple', g))].join(' ') || '—';
	const staff = r.hexGate ? pill('Felix-gate', 'purple')
		: `${r.mantle ? esc(r.mantle) : '<span class="bad">?</span>'} · ${r.tier ? `<code>${esc(r.tier)}</code>` : '<span class="bad">?</span>'}`;
	const status = pill(r.state ?? 'UNPARSED', stateTone(r.state))
		+ (r.annotation.trim() ? encapHtml(r.annotation, base, 'prose') : '');
	const note = failNote(failsAt(b, board.file, r.line), used);
	return `<tr><td class="id">${esc(r.id)}</td><td>${work}${note}</td><td>${deps}</td>`
		+ `<td>${staff}${r.rider ? ` <span class="rider">(${esc(r.rider)})</span>` : ''}</td><td>${status}</td>`
		+ `<td class="ges-cell">${rowGestures(b.path, r.id, ids)}</td></tr>`;
}

function boardPanel(b: Building, used: Set<Fail>): string {
	if (!b.board.length) return `<section class="panel"><h2>Board</h2><p class="prose note">No board in this building.</p></section>`;
	return b.board.map(board => {
		// The gestures a row offers are its siblings on ITS OWN board: "14 before 13" is a sentence
		// about one ordering, and two boards in one building are two orderings.
		const ids = board.rows.map(r => r.id);
		return `<section class="panel"><h2>Board — ${esc(board.heading || 'untitled')}</h2>
		<p class="note"><a href="${esc(docHref(board.file, '/'))}">${esc(short(board.file))}</a>:${board.line}</p>
		<table class="board"><thead><tr><th>ID</th><th>Work</th><th>Depends on</th><th>Staffing</th><th>Status</th><th>Gesture</th></tr></thead>
		<tbody>${board.rows.map(r => boardRow(r, board, b, used, ids)).join('')}</tbody></table></section>`;
	}).join('');
}

function ledgerPanel(b: Building): string {
	const e = b.ledgerTail;
	if (!e) return `<section class="panel"><h2>Ledger tail</h2><p class="prose note">No <code>LEDGER.md</code> in this building.</p></section>`;
	const base = baseOf(b.files.ledger);
	const bt = b.baton;
	const tone = bt?.holder === 'session' ? 'green' : bt?.holder === 'felix' ? 'purple' : 'orange';
	const instruments = bt?.instruments.map(i => i.kind === 'summons'
		? `<pre class="summons">${esc(i.text)}</pre>`
		: `<div class="inst">fire row <code>${esc(i.row)}</code></div>`).join('') ?? '';
	return `<section class="panel"><h2>Ledger tail</h2>
		<p class="note"><a href="${esc(docHref(b.files.ledger!, '/'))}">${esc(short(b.files.ledger!))}</a>:${e.line}</p>
		<div class="entry-h">${esc(e.date)} · ${esc(e.mantle)}${e.tier ? ` · <code>${esc(e.tier)}</code>` : ''}${e.row ? ` (${esc(e.row)})` : ''}</div>
		${encapHtml(e.body, base, 'prose')}
		<div class="kv">${label('decided')}<span>${e.decided ? inline(e.decided, base) : '<span class="bad">missing</span>'}</span></div>
		<div class="kv">${label('baton')}<span>${pill(bt ? bt.holder : 'none', tone)} ${bt ? inline(bt.text, base) : '<span class="bad">no Next clause</span>'}</span></div>
		${instruments}</section>`;
}

function queuePanel(b: Building): string {
	const base = baseOf(b.files.decisions);
	const items = b.decisionQueue.map(d => `<li><code>${esc(d.id)}</code> ${esc(d.date)} · ${esc(d.decider)}
		${d.pending ? pill('pending countersign', 'yellow') : pill('unsigned', 'orange')}
		${encapHtml(d.title, base, 'prose')}</li>`).join('');
	return `<section class="panel"><h2>Decision queue</h2>
		${b.files.decisions ? `<p class="note"><a href="${esc(docHref(b.files.decisions, '/'))}">${esc(short(b.files.decisions))}</a></p>` : ''}
		${items ? `<ul class="queue">${items}</ul>` : '<p class="prose note">Empty — nothing waits on Felix\'s pen.</p>'}</section>`;
}

/**
 * The sovereign's inbox, rendered and writable (B6). Three things live here and only one of them
 * is a hand: the entries (read), the note box (the fence's third write — no credential, §inbox),
 * and the apply button (a fire, so it goes cold with the hands).
 *
 * **Non-empty includes an inbox the parser could not read.** An entry in a shape D63 does not
 * know is exactly an entry that needs a human's sweep, so the lint filing it also arms the button.
 */
function issuesPanel(b: Building, rig: Rig, accounts: string[], armed: boolean): string {
	const unreadable = b.fails.filter(f => f.artifact === 'issues').length;
	const entries = b.issues.length + unreadable;
	const gestures = `${entries ? applyAct(rig, b.path, accounts, armed, entries) : ''}${noteBox(b.path)}`;

	if (!b.files.issues) return `<section class="panel"><h2>ISSUES</h2>
		<p class="prose note">No inbox in this building — the first gesture mints one from the D53 header (DOCTRINE §3).</p>
		${gestures}</section>`;

	const base = baseOf(b.files.issues);
	const items = b.issues.map(i => `<li><span class="when">${esc(i.date ?? '')}</span> <span class="who">${esc(i.who ?? '')}</span>
		${encapHtml(i.text, base, 'prose')}</li>`).join('');
	return `<section class="panel"><h2>ISSUES</h2>
		<p class="note"><a href="${esc(docHref(b.files.issues, '/'))}">${esc(short(b.files.issues))}</a></p>
		${items ? `<ul class="issues">${items}</ul>` : '<p class="prose note">Drained empty (D53).</p>'}
		${gestures}</section>`;
}

/**
 * Parser-as-lint, visible (README §1). Everything the parser could not type shows here with
 * its verbatim excerpt — a board that will not render is a board that is lying.
 */
function lintPanel(b: Building, used: Set<Fail>): string {
	const rest = b.fails.filter(f => !used.has(f));
	if (!rest.length) return `<section class="panel"><h2>Lint</h2><p class="prose note">${b.fails.length
		? `All ${b.fails.length} failure(s) are pinned to their board rows above.`
		: 'Clean — every field the doctrine names, this building carries.'}</p></section>`;
	const rows = rest.map(f => `<tr><td>${pill(f.artifact, 'orange')}</td><td><code>${esc(f.code)}</code></td>
		<td>${esc(f.reason)}</td><td><a href="${esc(docHref(f.file, '/'))}">${esc(short(f.file))}</a>:${f.line}</td>
		<td><code>${esc(f.excerpt)}</code></td></tr>`).join('');
	return `<section class="panel"><h2>Lint — ${rest.length}</h2>
		<table class="lint-t"><thead><tr><th>artifact</th><th>code</th><th>reason</th><th>where</th><th>verbatim</th></tr></thead>
		<tbody>${rows}</tbody></table></section>`;
}

function sessionTable(ss: Session[], rig: Rig): string {
	const rows = ss.map(s => `<tr>
		<td>${window_(s, rig)} <b>${esc(s.stamp ?? s.sid.slice(0, 8))}</b></td>
		<td>${pill(s.state, sessionTone(s.state))}</td>
		<td>${esc(accountLabel(rig, s.account) ?? '—')}</td>
		<td><code>${esc(s.cwd ? short(s.cwd) : '—')}</code></td>
		<td>${esc(s.last.ev)}${s.tool ? ` <code>${esc(s.tool)}</code>` : ''}</td>
		<td class="num">${esc(ago(s.last.t))}</td></tr>`).join('');
	return `<table class="sessions"><thead><tr><th>stamp</th><th>state</th><th>account</th><th>cwd</th><th>last event</th><th>ago</th></tr></thead>
		<tbody>${rows}</tbody></table>`;
}

// ---------- /doc — the link target, read-only ----------

export function docPage(path: string): string {
	if (!path.startsWith(cityRoot() + sep)) return page('Belvedere — refused', '<a href="/">city</a>',
		`<section class="panel"><h2>Outside the city</h2><p class="prose note">The viewer serves files under <code>${esc(cityRoot())}</code> only.</p>
		<code>${esc(path)}</code></section>`, 'read-only viewer');

	let text: string;
	try {
		const size = statSync(path).size;
		text = size > DOC_BYTES ? readFileSync(path, 'utf8').slice(0, DOC_BYTES) + '\n\n… truncated' : readFileSync(path, 'utf8');
	} catch (e) {
		return page('Belvedere — missing', '<a href="/">city</a>',
			`<section class="panel"><h2>Unresolved link</h2><p class="note">${esc(String(e))}</p></section>`, 'read-only viewer');
	}
	return page(`Belvedere — ${short(path)}`,
		`<a href="/">city</a> <span>/</span> <span>${esc(short(path))}</span>`,
		`<section class="panel"><pre class="doc">${esc(text)}</pre></section>`,
		`${esc(short(dirname(path)))} · read-only`);
}

export const notFound = (what: string) => page('Belvedere — 404', '<a href="/">city</a>',
	`<section class="panel"><h2>Not on the register</h2><p class="prose note">${esc(what)}</p></section>`, '404');

export const errorPage = (e: unknown) => page('Belvedere — error', '<a href="/">city</a>',
	`<section class="panel"><h2>The glass cracked, the city stands</h2>
	<pre class="doc">${esc(e instanceof Error ? (e.stack ?? e.message) : String(e))}</pre></section>`,
	'the server is still up — nothing on disk was touched');
