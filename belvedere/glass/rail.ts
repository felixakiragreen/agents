// The baton rail — the home page. "My mornings should start at a rail of batons, not a wall
// of terminals" (dream). One column: every ledger-tail baton in the city, every named
// ⬡-gate still live on a board, every decision waiting on his blessing.
//
// Two laws shape every card:
//
//  1. **The holder decides the wiring.** A session-holder baton gets Dispatch buttons wired to
//     `POST /hands/ignite`. A Felix-holder baton — and every gate and countersign, which are his
//     by definition — renders as HIS CARD: no button, no payload, no handler, nothing in the
//     DOM a click could reach. Structurally unwired, not disabled (B3 DoD). **D10 sharpens it:
//     where the parser says session and the clause says Felix, the two readings collide and the
//     card renders safe too — note and copy-summons, no wiring (`collides()` below).**
//  2. **The rail resolves; it never invents.** A row reference that names no work doc, a
//     summons with no known tier, a fork whose recommendation matches no option: each says so
//     on the card and offers no button. A greyed reason beats a guessed ignition.
//
// D64's shapes, named by D71 — single / batch / fork — render as one / n / choice buttons. The
// splitter, the resolver and D10's collision test moved to `baton.ts` at B26, where the deck's
// attention model reads them too: one reading of a handoff, two surfaces drawing it.

import { dirname } from 'path';
import { type Baton, type BoardRow, type Building, type Decision, type LedgerEntry } from '../../doctrine';
import { collides, readBaton, type Resolved } from './baton';
import { isLive, readCensus, type CensusRead, type Session } from './census';
import type { BatonOption, Shape } from './deck-model';
import { handsState } from './hands';
import { encap, encapHtml, esc, inline, legend, LIVENESS_KEYS, mantleKeys, page, pill, short, stateTone, type Tone } from './html';
import { auditorCount, auditorLine } from './gauges';
import { countersignAct, countersignPill, countersignState, INBOX_SCRIPT, noteBox, type Countersigned } from './inbox';
import { buildingOf, censusNote, registerNote, window_ } from './pages';
import { city } from './register';
import { readRig, type Rig } from './rig';
import { compose, type Composed } from './summon';

// ---------- an instrument, composed into an ignitable summons ----------

export type Shot = BatonOption & {
	worktree: { repo: string; branch: string } | null;
	ignite: Composed;                            // the body, or the reason there is none
};

/**
 * One resolved option, plus the one thing the rail adds and the deck's queue never does: a composed
 * ignition body, with a name-stamp minted and reserved for this render.
 */
function shot(rig: Rig, b: Building, o: BatonOption, r: Resolved | null, account: string, taken: Set<string>): Shot {
	if (r === null) return { ...o, worktree: null, ignite: { blocked: o.blocked ?? 'the instrument resolved to nothing' } };
	return { ...o, worktree: r.worktree,
		ignite: compose(rig, { summons: r.summons, mantle: r.mantle, tier: r.tier, cwd: b.path, account, taken }) };
}

// ---------- the cards ----------

/**
 * `path` is the building's own directory: every card carries a note box (B6), and a gesture lands
 * in the building's `ISSUES.md`, which is a place on disk — never a slug the rail would have to
 * resolve back through the register.
 */
export type Card =
	| { kind: 'baton'; building: string; path: string; file: string; entry: LedgerEntry; baton: Baton; shape: Shape; shots: Shot[]; recommendation: number; wired: boolean }
	| { kind: 'gate'; building: string; path: string; row: BoardRow; gate: string; file: string }
	| { kind: 'countersign'; building: string; path: string; decision: Decision; file: string; state: Countersigned };

/** A gate is the rail's business while its row can still move. A LANDED gate is history. */
const liveRow = (r: BoardRow) => r.state === 'OPEN' || r.state === 'IN FLIGHT' || r.state === 'BLOCKED' || r.state === null;

export function cards(buildings: Building[], rig: Rig, account: string): Card[] {
	const out: Card[] = [];
	// One reservation for the whole render: no two buttons on this page carry one name-stamp.
	const taken = new Set<string>();
	for (const b of buildings) {
		if (b.baton && b.ledgerTail) {
			const read = readBaton(b, b.baton, b.ledgerTail.line);
			// Holder law: only a session-holder baton is ever wired. Felix's is his card.
			// The shots are still composed on a collided card — the summons is what the clipboard
			// carries — but D10 keeps the wiring off them.
			const shots = b.baton.holder === 'session'
				? read.options.map((o, n) => shot(rig, b, o, read.resolved[n] ?? null, account, taken))
				: [];
			out.push({ kind: 'baton', building: b.building, path: b.path, file: b.files.ledger ?? b.path, entry: b.ledgerTail,
				baton: b.baton, shape: read.shape, shots, recommendation: read.options.findIndex(o => o.recommended),
				wired: !read.collides });
		}
		for (const board of b.board)
			for (const r of board.rows) {
				if (!liveRow(r)) continue;
				if (r.hexGate) out.push({ kind: 'gate', building: b.building, path: b.path, row: r, gate: '', file: board.file });
				for (const g of r.gates) out.push({ kind: 'gate', building: b.building, path: b.path, row: r, gate: g, file: board.file });
			}
		// B6: the card's state is read off two files — the decision's ✓ and the building's own inbox.
		for (const d of b.decisionQueue.filter(d => d.pending))
			out.push({ kind: 'countersign', building: b.building, path: b.path, decision: d,
				file: b.files.decisions ?? b.path, state: countersignState(d, b.issues) });
	}
	// Ignitable first, then Felix's own work, then the rest: the morning reads top-down. A collided
	// card is not ignitable, so it sits with his — which is whose the clause says it is.
	const rank = (c: Card) => c.kind === 'baton'
		? (c.wired && c.shots.length ? 0 : c.baton.holder === 'prose' ? 3 : 2)
		: c.kind === 'countersign' ? 1 : 2;
	// **Attention first, recency within** (design law): the rank is attention and it decides across
	// groups; the date only ever orders inside one. A card the doctrine gives no date — a ⬡-gate
	// is a board charge, not an entry — keeps its rank and falls to the named order, never to the top.
	return out.sort((a, c) =>
		rank(a) - rank(c) || dateOf(c).localeCompare(dateOf(a)) || a.building.localeCompare(c.building));
}

/** ISO dates sort as strings; a card with none sorts as the empty string, which is oldest. */
const dateOf = (c: Card) => c.kind === 'baton' ? c.entry.date : c.kind === 'countersign' ? c.decision.date : '';

// ---------- render ----------

const SHAPE_TONE: Record<Shape, Tone> = { single: 'green', batch: 'cyan', fork: 'yellow', plural: 'orange' };
const HOLDER: Record<Baton['holder'], string> = { session: 'baton', felix: "Felix's baton", prose: 'dropped baton' };

/**
 * A baton's own instruments are rendered below it as cards. Leaving their fences in the prose
 * prints every summons twice — the second time mangled, since `inline()` renders single ticks
 * and a fence is three. Display shaping only: the text the buttons and the clipboard carry is
 * the parser's, untouched.
 */
const prose = (text: string) => text.replace(/```[\s\S]*?```/g, ' ').replace(/\s{2,}/g, ' ').trim();

const buildingLink = (slug: string) =>
	`<a class="where" href="/b/${slug.split('/').map(encodeURIComponent).join('/')}">${esc(slug)}</a>`;

/**
 * One instrument, with its two affordances (B3 §4): **new session** ignites through the hands,
 * **copy summons** puts the byte-exact text on the clipboard for a window of Felix's choosing.
 * Nothing is ever pasted into a live TUI (P2 T4) — the clipboard is his hand, not Belvedere's.
 *
 * `wired: false` is D10's safe render: the summons and the copy button stay, and the account
 * picker, the payload and the ignite button are not in the DOM at all. `armed: false` is the other
 * cold state and a different one — the hands' credential is absent, so the button exists and is
 * disabled (B4 E2). One says "not this card"; the other says "not Belvedere, yet".
 */
/**
 * Which account ignites this shot — **a toggled button group, never a dropdown** (design law, README
 * §3; B9's sweep took Belvedere's last `<select>` out of this file). The radio IS the state, so the
 * browser holds it and the script reads `:checked`; the composer's `input.pick + label.btn` costume
 * is reused rather than re-invented. The group's name is the shot's own name-stamp, which `taken`
 * already reserves once per render — so no two pickers on the rail can ever share a radio group.
 */
const accountPicker = (stamp: string, accounts: string[]) =>
	`<span class="btns" data-account>${accounts.map((a, n) => {
		const id = `as-${stamp}-${n}`;
		return `<input class="pick" type="radio" name="as-${esc(stamp)}" id="${esc(id)}" value="${esc(a)}"${n ? '' : ' checked'}>`
			+ `<label class="btn" for="${esc(id)}">${esc(a)}</label>`;
	}).join('')}</span>`;

function shotHtml(s: Shot, armed: boolean, accounts: string[], wired: boolean): string {
	const head = `<div class="shot-h"><b>${esc(s.label)}</b>`
		+ (s.recommended ? ' ' + pill('recommended', 'green') : '')
		+ (s.worktree ? ' ' + pill(`worktree ${s.worktree.branch}`, 'purple', `git worktree add .claude/worktrees/${s.worktree.branch}`) : '')
		+ `<span class="src">${esc(s.source)}</span></div>`;

	if ('blocked' in s.ignite)
		return `<div class="shot">${head}<p class="note bad">${esc(s.ignite.blocked)}</p></div>`;

	const summons = `<pre class="summons" data-summons>${esc(s.ignite.body.summons)}</pre>`;
	if (!wired) return `<div class="shot">${head}${summons}
		<div class="acts">
			<button class="alt" data-copy>copy summons</button>
			<span class="out" data-out>${esc(`${s.ignite.body.model}-${s.ignite.body.effort} · ${short(s.ignite.body.cwd)}`)}</span>
		</div></div>`;

	const body = JSON.stringify(s.ignite.body);
	const wt = s.worktree ? ` data-worktree="${esc(JSON.stringify(s.worktree))}"` : '';
	const disabled = armed ? '' : ' disabled';
	return `<div class="shot">${head}${summons}
		<div class="acts">
			<span class="label">as</span>
			${accountPicker(s.ignite.body.stamp, accounts)}
			<button class="go" data-ignite="${esc(body)}"${wt}${disabled}>new session</button>
			<button class="alt" data-copy>copy summons</button>
			<span class="out" data-out>${esc(`${s.ignite.body.stamp} · ${s.ignite.body.model}-${s.ignite.body.effort} · ${short(s.ignite.body.cwd)}`)}</span>
		</div></div>`;
}

function batonCard(c: Card & { kind: 'baton' }, armed: boolean, accounts: string[], foot: string): string {
	const base = dirname(c.file);
	// Tone answers "whose is this?", so a collided card wears his colour, not the ignitable green.
	const tone: Tone = c.baton.holder === 'prose' ? 'orange' : c.wired ? 'green' : 'purple';
	const shape = c.baton.instruments.length > 1 || c.baton.holder === 'session'
		? pill(c.shape === 'plural' ? `${c.baton.instruments.length} instruments — shape unstated` : c.shape,
			SHAPE_TONE[c.shape], 'D71: single · batch · fork') : '';
	const forkNote = c.shape === 'fork' && c.recommendation < 0
		? `<p class="note bad">A fork with no readable recommendation — D64 forbids a menu with no recommendation.</p>` : '';
	const dropped = c.baton.holder === 'prose'
		? `<p class="note bad">Dropped baton: the Next clause carries no instrument and names no Felix-action (D63g/D64).</p>` : '';

	// D10, on the card: the parser and the prose disagree about whose baton this is, so Belvedere
	// arms nothing and says which two readings collided. The summons is still copyable — reading
	// is never gated — and the ignition stays Felix's hand.
	const named = c.wired ? ''
		: `<p class="note bad">The clause names <strong>Felix</strong>, and D64 reads the instrument first — so the parser calls this a session baton and the prose calls it his.
			Ambiguity never arms (D10): no button on this card. Copy the summons and ignite it yourself if the clause is yours.</p>`;

	// Felix's card and the dropped baton carry no shots at all — no payload, no handler, no button.
	const shots = c.shots.length ? `<div class="shots">${c.shots.map(s => shotHtml(s, armed, accounts, c.wired)).join('')}</div>` : '';

	return `<article class="rail tone-${tone}" data-kind="baton" data-holder="${c.baton.holder}">
		<div class="rail-h">${buildingLink(c.building)} ${pill(HOLDER[c.baton.holder], tone)} ${shape}
			<span class="when">${esc(c.entry.date)} · ${esc(c.entry.mantle)}${c.entry.row ? ` (${esc(c.entry.row)})` : ''}</span></div>
		${encapHtml(prose(c.baton.text), base, 'rail-text')}${forkNote}${dropped}${named}${shots}${foot}</article>`;
}

const gateCard = (c: Card & { kind: 'gate' }, foot: string) =>
	`<article class="rail tone-purple" data-kind="gate" data-holder="felix">
		<div class="rail-h">${buildingLink(c.building)} ${pill('⬡-gate', 'purple')} ${pill(c.row.state ?? 'UNPARSED', stateTone(c.row.state))}
			<span class="when">charge ${esc(c.row.id)}</span></div>
		${encapHtml(c.gate || c.row.work, dirname(c.file), 'rail-text')}
		${c.gate ? `<p class="prose note">${esc(encap(c.row.work).name)}</p>` : ''}${foot}</article>`;

const countersignCard = (c: Card & { kind: 'countersign' }, foot: string) =>
	// The pill is the CARD'S state, not the queue's word for it: a decision the parser queues and
	// the entry itself has already ratified must not headline "pending" over a "folded" body (B6).
	`<article class="rail tone-yellow" data-kind="countersign" data-holder="felix">
		<div class="rail-h">${buildingLink(c.building)} ${countersignPill(c.state)}
			<span class="when">${esc(c.decision.id)} · ${esc(c.decision.date)} · ${esc(c.decision.decider)}</span></div>
		${encapHtml(c.decision.title, dirname(c.file), 'rail-text')}
		${countersignAct(c.path, c.decision, c.state)}${foot}</article>`;

/**
 * One card's HTML — the seam the DOM tests read, and the only place a card's kind is dispatched.
 * **Every card's foot is the note box** (B6 §1): his word about the thing he is looking at lands
 * in that building's inbox. A gesture is never an ignition, so no card gains ignite wiring here — the
 * holder law (§1) and D10 both still decide, alone, what may be dispatched.
 */
export const cardHtml = (c: Card, armed: boolean, accounts: string[]): string => {
	const foot = noteBox(c.path, `note to ${c.building}`);
	return c.kind === 'baton' ? batonCard(c, armed, accounts, foot)
		: c.kind === 'gate' ? gateCard(c, foot) : countersignCard(c, foot);
};

/** The compact city strip: one dot per live session, grouped by building, `/city` for the rest. */
function strip(buildings: Building[], census: CensusRead, rig: Rig): string {
	const live = census.sessions.filter(isLive);
	const housed = new Map<string, Session[]>();
	for (const s of live) {
		const b = buildingOf(s.cwd, buildings);
		const key = b ? b.building : 'off the register';
		housed.set(key, [...(housed.get(key) ?? []), s]);
	}
	const lit = [...housed.entries()].sort((a, b) => b[1].length - a[1].length);
	return `<section class="citystrip">
		<a class="more" href="/city">city view →</a>
		${lit.map(([name, ss]) => `<span class="bldg">${name === 'off the register'
			? `<span class="where bad">off the register</span>` : buildingLink(name)}
			<span class="windows">${ss.map(s => window_(s, rig)).join('')}</span></span>`).join('')
		|| '<span class="dark">no live sessions</span>'}</section>`;
}

/** The one script on the rail: two affordances, one delegated listener, no framework. */
const SCRIPT = `<script>
document.addEventListener('click', async ev => {
	const btn = ev.target.closest('button[data-ignite], button[data-copy]');
	if (!btn) return;
	const shot = btn.closest('.shot'), out = shot.querySelector('[data-out]');
	const text = shot.querySelector('[data-summons]').textContent;
	if (btn.hasAttribute('data-copy')) {
		try { await navigator.clipboard.writeText(text); out.textContent = 'copied ' + text.length + ' chars'; }
		catch (e) { out.textContent = 'clipboard refused: ' + e; }
		return;
	}
	const post = async (hand, body) => {
		const r = await fetch('/hands/' + hand, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
		return [r.status, await r.json()];
	};
	btn.disabled = true;
	const body = JSON.parse(btn.dataset.ignite);
	body.account = shot.querySelector('[data-account] input:checked').value;
	try {
		if (btn.dataset.worktree) {
			out.textContent = 'worktree…';
			const [code, r] = await post('worktree', JSON.parse(btn.dataset.worktree));
			if (!r.ok) { out.textContent = code + ' ' + r.error; btn.disabled = false; return; }
			body.cwd = r.result.path;
			out.textContent = 'worktree ' + r.result.path + ' · igniting…';
		} else out.textContent = 'igniting…';
		const [code, r] = await post('ignite', body);
		out.textContent = r.ok
			? 'ignited ' + r.result.workspace + ' · ' + body.stamp + ' · sha ' + r.result.sha + ' · ' + r.result.bytes + ' B'
			: code + ' ' + r.error;
		if (!r.ok) btn.disabled = false;   // the stamp is spent only on an ignition that landed
	} catch (e) { out.textContent = String(e); btn.disabled = false; }
});
</script>`;

/**
 * The rail's two colour vocabularies, said out loud (design law, README §3): the card's own left
 * edge — whose card is this, and will it ignite — and the city strip's windows, which are the City
 * View's vocabulary appearing here in miniature.
 */
const railLegend = (rig: Rig) => legend([
	`${pill('baton', 'green')} ignitable — the parser and the clause agree it is a session's`,
	`${pill("Felix's baton", 'purple')} his — a gate, a collision (D10), or a clause that names him`,
	`${pill('pending blessing', 'yellow')} a decision waiting on his pen`,
	`${pill('dropped baton', 'orange')} the Next clause carries no instrument at all`,
	...LIVENESS_KEYS,
	...mantleKeys(rig.colours),
]);

export function railPage(): string {
	const t0 = performance.now();
	const { reg, buildings } = city();
	const census = readCensus();
	const rig = readRig();
	const hands = handsState();
	const accounts = [...rig.accounts.values()];

	const list = cards(buildings, rig, accounts[0] ?? 'personal');
	const n = { baton: 0, gate: 0, countersign: 0, ignitable: 0 };
	// Ignitable counts what this page will actually ignite: a collided card's shots are not it (D10).
	for (const c of list) { n[c.kind]++; if (c.kind === 'baton' && c.wired) n.ignitable += c.shots.filter(s => !('blocked' in s.ignite)).length; }

	const banner = hands.armed ? '' : `<section class="panel"><h2>Hands disabled</h2>
		<p class="prose note">Every Dispatch button below is cold — <code>/hands/*</code> answers 503 until the credential is armed.
		The rail itself is unaffected: it reads the city either way.
		<br><span class="bad">${esc(hands.note)}</span></p></section>`;

	const counts = `<section class="strip">
		<div class="stat"><span class="label">batons</span><b>${n.baton}</b></div>
		<div class="stat"><span class="label">ignitable</span><b class="t-working">${n.ignitable}</b></div>
		<div class="stat"><span class="label">⬡-gates</span><b class="t-needs-input">${n.gate}</b></div>
		<div class="stat"><span class="label">blessings</span><b class="t-unknown">${n.countersign}</b></div>
		<div class="stat"><span class="label">buildings</span><b>${buildings.length}</b></div>
		<div class="stat"><span class="label">live sessions</span><b>${census.sessions.filter(isLive).length}</b></div>
		<div class="stat"><span class="label">hands</span><b class="small">${hands.armed ? pill('armed', 'green') : pill('disabled', 'orange')}</b></div>
		<div class="stat"><span class="label">census</span><b class="small">${censusNote(census)}</b></div>
	</section>
	<p class="prose note">${auditorLine(census.sessions.filter(isLive).length, auditorCount())} — the count is the
		sensor's drift alarm, never a session: it joins nothing and houses nothing (B5 E1's ruling).</p>`;

	const body = list.map(c => cardHtml(c, hands.armed, accounts)).join('');

	const ms = performance.now() - t0;
	return page('Belvedere — the rail', '<span>rail</span> <span>/</span> <a href="/city">city</a> <span>/</span> <a href="/shelf">shelf</a> <span>/</span> <a href="/summon">summon</a>',
		banner + counts + strip(buildings, census, rig) + railLegend(rig) + `<section class="railcol">${body}</section>` + SCRIPT + INBOX_SCRIPT,
		`content re-read in ${ms.toFixed(0)} ms · ${registerNote(reg, '/')}`);
}
