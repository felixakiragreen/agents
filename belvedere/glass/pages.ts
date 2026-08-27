// The two pages of the spine — City View and the building page — plus the document viewer
// that makes D58's links resolve. Every page re-reads disk; nothing here is cached.

import { readFileSync, statSync } from 'fs';
import { dirname, resolve, sep } from 'path';
import { discover, type Building, type Board, type BoardRow, type Fail } from '../../doctrine';
import { readCensus, isLive, type CensusRead, type Session } from './census';
import { handsState } from './hands';
import { city, TTL_MS, type Register } from './register';
import { readRig, accountLabel, mantleOf, type Rig } from './rig';
import { cityRoot } from './paths';
import { baseOf, docHref, esc, inline, label, page, pill, rigTone, sessionTone, short, stateTone } from './html';

const DOC_BYTES = 2 << 20;

// ---------- shared bits ----------

export const ago = (seconds: number) => {
	const d = Math.max(0, Date.now() / 1000 - seconds);
	if (d < 90) return `${Math.round(d)}s`;
	if (d < 5400) return `${Math.round(d / 60)}m`;
	if (d < 172800) return `${Math.round(d / 3600)}h`;
	return `${Math.round(d / 86400)}d`;
};

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

/**
 * A session's building is the deepest one containing its cwd. A worktree checkout counts as
 * its repo: `<repo>/.claude/worktrees/<branch>/x` is `<repo>/x` wearing a branch.
 *
 * Generic over anything that carries a name and a path, so the shelf can attribute against the
 * register's own `Entry[]` — the file list, without re-reading a single board (B8 F3: content
 * the page does not render is content the page must not pay for).
 */
export function buildingOf<T extends { building: string; path: string }>(cwd: string | null, buildings: T[]): T | null {
	if (!cwd) return null;
	const norm = cwd.replace(/\/\.claude\/worktrees\/[^/]+/, '');
	let best: T | null = null;
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
		<p class="note">The fence's four write powers are off — fire, worktree, focus and halt all answer 503.
		Everything below is unaffected: the glass reads the city either way.
		<br><span class="bad">${esc(hands.note)}</span></p></section>`;

	const strip = `<section class="strip">
		<div class="stat"><span class="label">hands</span><b class="small">${hands.armed
			? pill('armed', 'green') : pill('disabled', 'orange')}</b></div>
		<div class="stat"><span class="label">buildings</span><b>${buildings.length}</b></div>
		<div class="stat"><span class="label">live sessions</span><b>${census.sessions.filter(isLive).length}</b></div>
		${Object.entries(tally).map(([k, v]) => `<div class="stat"><span class="label">${esc(k)}</span><b class="t-${k}">${v}</b></div>`).join('')}
		<div class="stat"><span class="label">census</span><b class="small">${censusNote(census)}</b></div>
	</section>`;

	const cards = buildings.map(b => {
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
	}).join('');

	const off = loose.length ? `<section class="panel"><h2>Off the register</h2>
		<p class="note">Live sessions whose cwd sits in no building the parser found — counted here so the hand-count still adds up.</p>
		${sessionTable(loose, rig)}</section>` : '';

	const ms = performance.now() - t0;
	return page('Belvedere — City View', '<a href="/">rail</a> <span>/</span> <span>city</span> <span>/</span> <a href="/shelf">shelf</a>',
		banner + strip + `<section class="cards">${cards}</section>` + off,
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
	const mine = census.sessions.filter(isLive).filter(s => buildingOf(s.cwd, local)?.path === abs);

	const used = new Set<Fail>();
	const body = [
		boardPanel(b, used),
		ledgerPanel(b),
		queuePanel(b),
		issuesPanel(b),
		`<section class="panel"><h2>Live sessions</h2>${mine.length ? sessionTable(mine, rig)
			: `<p class="note">${census.present ? 'None.' : 'unknown — census not deployed'}</p>`}</section>`,
		lintPanel(b, used),
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

function boardRow(r: BoardRow, board: Board, b: Building, used: Set<Fail>): string {
	const base = baseOf(board.file);
	const work = r.workDoc ? `<a href="${esc(docHref(r.workDoc, base))}">${esc(r.work)}</a>` : esc(r.work);
	const deps = [...r.dependsOn.map(d => `<code>${esc(d)}</code>`), ...r.gates.map(g => pill('Felix-gate', 'purple', g))].join(' ') || '—';
	const staff = r.felixGate ? pill('Felix-gate', 'purple')
		: `${r.mantle ? esc(r.mantle) : '<span class="bad">?</span>'} · ${r.tier ? `<code>${esc(r.tier)}</code>` : '<span class="bad">?</span>'}`;
	const status = `${pill(r.state ?? 'UNPARSED', stateTone(r.state))} ${inline(r.annotation, base)}`;
	const note = failNote(failsAt(b, board.file, r.line), used);
	return `<tr><td class="id">${esc(r.id)}</td><td>${work}${note}</td><td>${deps}</td>`
		+ `<td>${staff}${r.rider ? ` <span class="rider">(${esc(r.rider)})</span>` : ''}</td><td>${status}</td></tr>`;
}

function boardPanel(b: Building, used: Set<Fail>): string {
	if (!b.board.length) return `<section class="panel"><h2>Board</h2><p class="note">No board in this building.</p></section>`;
	return b.board.map(board => `<section class="panel"><h2>Board — ${esc(board.heading || 'untitled')}</h2>
		<p class="note"><a href="${esc(docHref(board.file, '/'))}">${esc(short(board.file))}</a>:${board.line}</p>
		<table class="board"><thead><tr><th>ID</th><th>Work</th><th>Depends on</th><th>Staffing</th><th>Status</th></tr></thead>
		<tbody>${board.rows.map(r => boardRow(r, board, b, used)).join('')}</tbody></table></section>`).join('');
}

function ledgerPanel(b: Building): string {
	const e = b.ledgerTail;
	if (!e) return `<section class="panel"><h2>Ledger tail</h2><p class="note">No <code>LEDGER.md</code> in this building.</p></section>`;
	const base = baseOf(b.files.ledger);
	const bt = b.baton;
	const tone = bt?.holder === 'session' ? 'green' : bt?.holder === 'felix' ? 'purple' : 'orange';
	const instruments = bt?.instruments.map(i => i.kind === 'summons'
		? `<pre class="summons">${esc(i.text)}</pre>`
		: `<div class="inst">fire row <code>${esc(i.row)}</code></div>`).join('') ?? '';
	return `<section class="panel"><h2>Ledger tail</h2>
		<p class="note"><a href="${esc(docHref(b.files.ledger!, '/'))}">${esc(short(b.files.ledger!))}</a>:${e.line}</p>
		<div class="entry-h">${esc(e.date)} · ${esc(e.mantle)}${e.tier ? ` · <code>${esc(e.tier)}</code>` : ''}${e.row ? ` (${esc(e.row)})` : ''}</div>
		<p>${inline(e.body, base)}</p>
		<div class="kv">${label('decided')}<span>${e.decided ? inline(e.decided, base) : '<span class="bad">missing</span>'}</span></div>
		<div class="kv">${label('baton')}<span>${pill(bt ? bt.holder : 'none', tone)} ${bt ? inline(bt.text, base) : '<span class="bad">no Next clause</span>'}</span></div>
		${instruments}</section>`;
}

function queuePanel(b: Building): string {
	const base = baseOf(b.files.decisions);
	const items = b.decisionQueue.map(d => `<li><code>${esc(d.id)}</code> ${esc(d.date)} · ${esc(d.decider)}
		${d.pending ? pill('pending countersign', 'yellow') : pill('unsigned', 'orange')}
		<div>${inline(d.title, base)}</div></li>`).join('');
	return `<section class="panel"><h2>Decision queue</h2>
		${b.files.decisions ? `<p class="note"><a href="${esc(docHref(b.files.decisions, '/'))}">${esc(short(b.files.decisions))}</a></p>` : ''}
		${items ? `<ul class="queue">${items}</ul>` : '<p class="note">Empty — nothing waits on Felix\'s pen.</p>'}</section>`;
}

function issuesPanel(b: Building): string {
	if (!b.files.issues) return `<section class="panel"><h2>ISSUES</h2><p class="note">No inbox in this building.</p></section>`;
	const base = baseOf(b.files.issues);
	const items = b.issues.map(i => `<li><span class="when">${esc(i.date ?? '')}</span> <span class="who">${esc(i.who ?? '')}</span>
		<div>${inline(i.text, base)}</div></li>`).join('');
	return `<section class="panel"><h2>ISSUES</h2>
		<p class="note"><a href="${esc(docHref(b.files.issues, '/'))}">${esc(short(b.files.issues))}</a></p>
		${items ? `<ul class="issues">${items}</ul>` : '<p class="note">Drained empty (D53).</p>'}</section>`;
}

/**
 * Parser-as-lint, visible (README §1). Everything the parser could not type shows here with
 * its verbatim excerpt — a board that will not render is a board that is lying.
 */
function lintPanel(b: Building, used: Set<Fail>): string {
	const rest = b.fails.filter(f => !used.has(f));
	if (!rest.length) return `<section class="panel"><h2>Lint</h2><p class="note">${b.fails.length
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
		`<section class="panel"><h2>Outside the city</h2><p class="note">The viewer serves files under <code>${esc(cityRoot())}</code> only.</p>
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
	`<section class="panel"><h2>Not on the register</h2><p class="note">${esc(what)}</p></section>`, '404');

export const errorPage = (e: unknown) => page('Belvedere — error', '<a href="/">city</a>',
	`<section class="panel"><h2>The glass cracked, the city stands</h2>
	<pre class="doc">${esc(e instanceof Error ? (e.stack ?? e.message) : String(e))}</pre></section>`,
	'the server is still up — nothing on disk was touched');
