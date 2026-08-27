// The baton rail — the home page. "My mornings should start at a rail of batons, not a wall
// of terminals" (dream). One column: every ledger-tail baton in the city, every named
// Felix-gate still live on a board, every decision waiting on his countersign.
//
// Two laws shape every card:
//
//  1. **The holder decides the wiring.** A session-holder baton gets Dispatch buttons wired to
//     `POST /hands/fire`. A Felix-holder baton — and every gate and countersign, which are his
//     by definition — renders as HIS CARD: no button, no payload, no handler, nothing in the
//     DOM a click could reach. Structurally unwired, not disabled (B3 DoD). **D10 sharpens it:
//     where the parser says session and the clause says Felix, the two readings collide and the
//     card renders safe too — note and copy-summons, no wiring (`collides()` below).**
//  2. **The rail resolves; it never invents.** A row reference that names no work doc, a
//     summons with no known tier, a fork whose recommendation matches no option: each says so
//     on the card and offers no button. A greyed reason beats a guessed fire.
//
// D64's move / wave / fork is rendered as one / n / choice buttons. `doctrine/`'s parsed
// `Baton` carries `instruments[]` but no `kind`, so the shape is read render-side here by a
// thin splitter over the baton's own prose (B3 §3's instruction) — and the canon-inbox ask
// for the missing field rides this row's findings. Nothing below re-implements a parse.

import { readFileSync, statSync } from 'fs';
import { dirname, resolve } from 'path';
import { parseKickoffs, type Baton, type BoardRow, type Building, type Decision, type Instrument, type LedgerEntry } from '../../doctrine';
import { isLive, readCensus, type CensusRead, type Session } from './census';
import { handsState } from './hands';
import { esc, inline, page, pill, short, stateTone, type Tone } from './html';
import { buildingOf, censusNote, registerNote, window_ } from './pages';
import { city } from './register';
import { readRig, type Rig } from './rig';
import { compose, type Composed } from './summon';

const WORK_DOC_BYTES = 2 << 20;

// ---------- D64's shape, read render-side ----------

export type Shape = 'move' | 'wave' | 'fork' | 'plural';

// A fork is the choice ITSELF; a wave is n things fired together. Both are prose today, so
// both are matched as prose — and plurality with neither marker is reported, never guessed.
const FORK = /\bfork\b|\bexclusive\b|\bchoos|\bchoice\b|\beither\b|\boption [a-z]\b/i;
const WAVE = /\bwave\b|\bparallel\b|\bboth\b|\ball (?:two|three|four|five)\b/i;

export const shapeOf = (text: string, instruments: number): Shape =>
	instruments <= 1 ? 'move' : FORK.test(text) ? 'fork' : WAVE.test(text) ? 'wave' : 'plural';

/** What names an option in prose: a row id, or the mantle and tier its summons opens with. */
const keysOf = (i: Instrument): string[] =>
	i.kind === 'row' ? [i.row] : [i.mantle, i.tier].filter((x): x is string => !!x);

/**
 * D64 requires a fork to name its recommendation. The span FROM the word "recommend" to the end
 * of its sentence is scanned for the options' own names — the recommendation is what follows the
 * word, and "Recommendation: the Digger" puts a colon between the two, so a clause-split on `:`
 * hands back the empty half. A span naming no option — or naming two — resolves to nothing, and
 * the card says the recommendation is unreadable rather than badging a coin-flip.
 */
export function recommended(text: string, instruments: Instrument[]): number {
	const from = text.search(/recommend/i);
	if (from < 0) return -1;
	const hay = text.slice(from).split(/(?<=[.!?])\s/)[0]!.slice(0, 240).toLowerCase();
	const hits = instruments.flatMap((i, n) => keysOf(i).some(k => hay.includes(k.toLowerCase())) ? [n] : []);
	return hits.length === 1 ? hits[0]! : -1;
}

// ---------- resolving an instrument to a fireable summons ----------

export type Shot = {
	label: string;
	source: string;                            // the file:line the summons was read from
	summons: string;
	worktree: { repo: string; branch: string } | null;
	recommended: boolean;
	fire: Composed;                            // the body, or the reason there is none
};

const readDoc = (p: string) =>
	statSync(p).size > WORK_DOC_BYTES ? readFileSync(p, 'utf8').slice(0, WORK_DOC_BYTES) : readFileSync(p, 'utf8');

const BRANCH_IN_DOC = /\bbranch(?:es)?\s+`([A-Za-z0-9][A-Za-z0-9._/-]{0,79})`/;

/**
 * DOCTRINE §10's worktree law is prose in a work doc; the branch it names is not — so the rail
 * reads it, narrowly. Only the header block (everything above the doc's first `##`), only a line
 * that names a worktree, and never a line recording a landing.
 *
 * The narrowness is measured, not defensive. "First `` branch `x` `` anywhere in the doc" matched
 * 12 of the city's 62 live work docs and **every single hit was retrospective** — `**Status:**
 * LANDED (branch …)`, `## Commits (branch …)`, a nested board row citing where findings live.
 * One of the twelve sat on an OPEN row, where a Dispatch would have composed a worktree named
 * after somebody else's finished agent checkout. This rule matches none of the twelve. The real
 * fix is a field, not a regex: the canon-inbox ask rides this row's findings.
 */
export function branchFor(text: string): string | null {
	for (const line of text.split(/^##\s/m)[0]!.split('\n')) {
		if (!/\bworktree\b/i.test(line) || /\bLANDED\b/.test(line)) continue;
		const m = line.match(BRANCH_IN_DOC);
		if (m) return m[1]!;
	}
	return null;
}

const findRow = (b: Building, id: string): { row: BoardRow; file: string } | null => {
	for (const board of b.board) for (const r of board.rows) if (r.id === id) return { row: r, file: board.file };
	return null;
};

/**
 * `fire <row-id>` → that work doc's kickoff fence (D63g). A work doc carrying several summons
 * fences hands over its last: §5's template puts the row's own kickoff at the foot of the doc.
 */
function resolveRow(b: Building, id: string): { summons: string; source: string; mantle: string | null; tier: string | null; worktree: { repo: string; branch: string } | null } | { blocked: string } {
	const hit = findRow(b, id);
	if (!hit) return { blocked: `no row "${id}" on any board in ${b.building}` };
	if (!hit.row.workDoc) return { blocked: `row ${id} names no work doc — nothing to read a kickoff from` };

	const doc = resolve(dirname(hit.file), hit.row.workDoc.split('#')[0]!);
	let text: string;
	try { text = readDoc(doc); }
	catch (e) { return { blocked: `row ${id}'s work doc is unreadable: ${(e as Error).message}` }; }

	const k = parseKickoffs(text).kickoffs.at(-1);
	if (!k) return { blocked: `row ${id}'s work doc carries no kickoff fence: ${short(doc)}` };

	const branch = branchFor(text);
	return {
		summons: k.text, source: `${short(doc)}:${k.line}`, mantle: k.mantle, tier: k.tier,
		worktree: branch ? { repo: b.path, branch } : null,
	};
}

function shot(rig: Rig, b: Building, i: Instrument, ledgerLine: number, account: string, isRecommended: boolean, taken: Set<string>): Shot {
	const base = { recommended: isRecommended, worktree: null as Shot['worktree'] };
	if (i.kind === 'summons') {
		const label = `${i.mantle ?? 'unknown mantle'} · ${i.tier ?? 'unknown tier'}`;
		return { ...base, label, source: `${short(b.files.ledger ?? b.path)}:${ledgerLine}`, summons: i.text,
			fire: compose(rig, { summons: i.text, mantle: i.mantle, tier: i.tier, cwd: b.path, account, taken }) };
	}
	const r = resolveRow(b, i.row);
	if ('blocked' in r) return { ...base, label: `row ${i.row}`, source: short(b.files.ledger ?? b.path), summons: '', fire: r };
	return { ...base, label: `row ${i.row} — ${r.mantle ?? 'unknown mantle'} · ${r.tier ?? 'unknown tier'}`,
		source: r.source, summons: r.summons, worktree: r.worktree,
		fire: compose(rig, { summons: r.summons, mantle: r.mantle, tier: r.tier, cwd: b.path, account, taken }) };
}

// ---------- the cards ----------

/**
 * **D10 — ambiguity never arms.** `classifyBaton` gives the instrument precedence over the word
 * "Felix", so a clause reading *"PENDING Felix's ruling — on a pass, fire: ⟨fence⟩"* parses as a
 * session baton. All three of the live city's fireable batons read exactly that way (B3 E2): the
 * parser says session, the prose says his. Until canon rules the holder grammar, a card whose two
 * readings disagree renders **safe** — the collision named, the summons copyable, no wiring at
 * all. Copying is reading; the gate stays his.
 *
 * This is render law, not a second parser (D65): the holder stays exactly what `doctrine/` said.
 */
export const collides = (b: Baton) => b.holder === 'session' && /\bFelix\b/.test(b.text);

export type Card =
	| { kind: 'baton'; building: string; file: string; entry: LedgerEntry; baton: Baton; shape: Shape; shots: Shot[]; recommendation: number; wired: boolean }
	| { kind: 'gate'; building: string; row: BoardRow; gate: string; file: string }
	| { kind: 'countersign'; building: string; decision: Decision; file: string };

/** A gate is the rail's business while its row can still move. A LANDED gate is history. */
const liveRow = (r: BoardRow) => r.state === 'OPEN' || r.state === 'IN FLIGHT' || r.state === 'BLOCKED' || r.state === null;

export function cards(buildings: Building[], rig: Rig, account: string): Card[] {
	const out: Card[] = [];
	// One reservation for the whole render: no two buttons on this page carry one name-stamp.
	const taken = new Set<string>();
	for (const b of buildings) {
		if (b.baton && b.ledgerTail) {
			const shape = shapeOf(b.baton.text, b.baton.instruments.length);
			const rec = shape === 'fork' ? recommended(b.baton.text, b.baton.instruments) : -1;
			// Holder law: only a session-holder baton is ever wired. Felix's is his card.
			const shots = b.baton.holder === 'session'
				? b.baton.instruments.map((i, n) => shot(rig, b, i, b.ledgerTail!.line, account, n === rec, taken))
				: [];
			// The shots are still composed on a collided card — the summons is what the clipboard
			// carries — but D10 keeps the wiring off them.
			out.push({ kind: 'baton', building: b.building, file: b.files.ledger ?? b.path, entry: b.ledgerTail,
				baton: b.baton, shape, shots, recommendation: rec, wired: !collides(b.baton) });
		}
		for (const board of b.board)
			for (const r of board.rows) {
				if (!liveRow(r)) continue;
				if (r.felixGate) out.push({ kind: 'gate', building: b.building, row: r, gate: '', file: board.file });
				for (const g of r.gates) out.push({ kind: 'gate', building: b.building, row: r, gate: g, file: board.file });
			}
		for (const d of b.decisionQueue.filter(d => d.pending))
			out.push({ kind: 'countersign', building: b.building, decision: d, file: b.files.decisions ?? b.path });
	}
	// Fireable first, then Felix's own work, then the rest: the morning reads top-down. A collided
	// card is not fireable, so it sits with his — which is whose the clause says it is.
	const rank = (c: Card) => c.kind === 'baton'
		? (c.wired && c.shots.length ? 0 : c.baton.holder === 'prose' ? 3 : 2)
		: c.kind === 'countersign' ? 1 : 2;
	return out.sort((a, c) => rank(a) - rank(c) || a.building.localeCompare(c.building));
}

// ---------- render ----------

const SHAPE_TONE: Record<Shape, Tone> = { move: 'green', wave: 'cyan', fork: 'yellow', plural: 'orange' };
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
 * One instrument, with its two affordances (B3 §4): **new session** fires through the hands,
 * **copy summons** puts the byte-exact text on the clipboard for a window of Felix's choosing.
 * Nothing is ever pasted into a live TUI (P2 T4) — the clipboard is his hand, not the glass's.
 *
 * `wired: false` is D10's safe render: the summons and the copy button stay, and the account
 * picker, the payload and the fire button are not in the DOM at all. `armed: false` is the other
 * cold state and a different one — the hands' credential is absent, so the button exists and is
 * disabled (B4 E2). One says "not this card"; the other says "not this glass, yet".
 */
function shotHtml(s: Shot, armed: boolean, accounts: string[], wired: boolean): string {
	const head = `<div class="shot-h"><b>${esc(s.label)}</b>`
		+ (s.recommended ? ' ' + pill('recommended', 'green') : '')
		+ (s.worktree ? ' ' + pill(`worktree ${s.worktree.branch}`, 'purple', `git worktree add .claude/worktrees/${s.worktree.branch}`) : '')
		+ `<span class="src">${esc(s.source)}</span></div>`;

	if ('blocked' in s.fire)
		return `<div class="shot">${head}<p class="note bad">${esc(s.fire.blocked)}</p></div>`;

	const summons = `<pre class="summons" data-summons>${esc(s.fire.body.summons)}</pre>`;
	if (!wired) return `<div class="shot">${head}${summons}
		<div class="acts">
			<button class="alt" data-copy>copy summons</button>
			<span class="out" data-out>${esc(`${s.fire.body.model}-${s.fire.body.effort} · ${short(s.fire.body.cwd)}`)}</span>
		</div></div>`;

	const body = JSON.stringify(s.fire.body);
	const wt = s.worktree ? ` data-worktree="${esc(JSON.stringify(s.worktree))}"` : '';
	const disabled = armed ? '' : ' disabled';
	return `<div class="shot">${head}${summons}
		<div class="acts">
			<span class="label">as</span>
			<select class="account" data-account>${accounts.map((a, n) => `<option${n ? '' : ' selected'}>${esc(a)}</option>`).join('')}</select>
			<button class="go" data-fire="${esc(body)}"${wt}${disabled}>new session</button>
			<button class="alt" data-copy>copy summons</button>
			<span class="out" data-out>${esc(`${s.fire.body.stamp} · ${s.fire.body.model}-${s.fire.body.effort} · ${short(s.fire.body.cwd)}`)}</span>
		</div></div>`;
}

function batonCard(c: Card & { kind: 'baton' }, armed: boolean, accounts: string[]): string {
	const base = dirname(c.file);
	// Tone answers "whose is this?", so a collided card wears his colour, not the fireable green.
	const tone: Tone = c.baton.holder === 'prose' ? 'orange' : c.wired ? 'green' : 'purple';
	const shape = c.baton.instruments.length > 1 || c.baton.holder === 'session'
		? pill(c.shape === 'plural' ? `${c.baton.instruments.length} instruments — shape unstated` : c.shape,
			SHAPE_TONE[c.shape], 'D64: move · wave · fork') : '';
	const forkNote = c.shape === 'fork' && c.recommendation < 0
		? `<p class="note bad">A fork with no readable recommendation — D64 forbids a menu with no recommendation.</p>` : '';
	const dropped = c.baton.holder === 'prose'
		? `<p class="note bad">Dropped baton: the Next clause carries no instrument and names no Felix-action (D63g/D64).</p>` : '';

	// D10, on the card: the parser and the prose disagree about whose baton this is, so the glass
	// arms nothing and says which two readings collided. The summons is still copyable — reading
	// is never gated — and the fire stays Felix's hand.
	const named = c.wired ? ''
		: `<p class="note bad">The clause names <strong>Felix</strong>, and D64 reads the instrument first — so the parser calls this a session baton and the prose calls it his.
			Ambiguity never arms (D10): no button on this card. Copy the summons and fire it yourself if the clause is yours.</p>`;

	// Felix's card and the dropped baton carry no shots at all — no payload, no handler, no button.
	const shots = c.shots.length ? `<div class="shots">${c.shots.map(s => shotHtml(s, armed, accounts, c.wired)).join('')}</div>` : '';

	return `<article class="rail tone-${tone}" data-kind="baton" data-holder="${c.baton.holder}">
		<div class="rail-h">${buildingLink(c.building)} ${pill(HOLDER[c.baton.holder], tone)} ${shape}
			<span class="when">${esc(c.entry.date)} · ${esc(c.entry.mantle)}${c.entry.row ? ` (${esc(c.entry.row)})` : ''}</span></div>
		<p class="rail-text">${inline(prose(c.baton.text), base)}</p>${forkNote}${dropped}${named}${shots}</article>`;
}

const gateCard = (c: Card & { kind: 'gate' }) =>
	`<article class="rail tone-purple" data-kind="gate" data-holder="felix">
		<div class="rail-h">${buildingLink(c.building)} ${pill('Felix-gate', 'purple')} ${pill(c.row.state ?? 'UNPARSED', stateTone(c.row.state))}
			<span class="when">row ${esc(c.row.id)}</span></div>
		<p class="rail-text">${inline(c.gate || c.row.work, dirname(c.file))}</p>
		${c.gate ? `<p class="note">${esc(c.row.work).slice(0, 220)}</p>` : ''}</article>`;

/** One card's HTML — the seam the DOM tests read, and the only place a card's kind is dispatched. */
export const cardHtml = (c: Card, armed: boolean, accounts: string[]): string =>
	c.kind === 'baton' ? batonCard(c, armed, accounts) : c.kind === 'gate' ? gateCard(c) : countersignCard(c);

const countersignCard = (c: Card & { kind: 'countersign' }) =>
	`<article class="rail tone-yellow" data-kind="countersign" data-holder="felix">
		<div class="rail-h">${buildingLink(c.building)} ${pill('pending countersign', 'yellow')}
			<span class="when">${esc(c.decision.id)} · ${esc(c.decision.date)} · ${esc(c.decision.decider)}</span></div>
		<p class="rail-text">${inline(c.decision.title, dirname(c.file))}</p></article>`;

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
	const btn = ev.target.closest('button[data-fire], button[data-copy]');
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
	const body = JSON.parse(btn.dataset.fire);
	body.account = shot.querySelector('[data-account]').value;
	try {
		if (btn.dataset.worktree) {
			out.textContent = 'worktree…';
			const [code, r] = await post('worktree', JSON.parse(btn.dataset.worktree));
			if (!r.ok) { out.textContent = code + ' ' + r.error; btn.disabled = false; return; }
			body.cwd = r.result.path;
			out.textContent = 'worktree ' + r.result.path + ' · firing…';
		} else out.textContent = 'firing…';
		const [code, r] = await post('fire', body);
		out.textContent = r.ok
			? 'fired ' + r.result.workspace + ' · ' + body.stamp + ' · sha ' + r.result.sha + ' · ' + r.result.bytes + ' B'
			: code + ' ' + r.error;
		if (!r.ok) btn.disabled = false;   // the stamp is spent only on a fire that landed
	} catch (e) { out.textContent = String(e); btn.disabled = false; }
});
</script>`;

export function railPage(): string {
	const t0 = performance.now();
	const { reg, buildings } = city();
	const census = readCensus();
	const rig = readRig();
	const hands = handsState();
	const accounts = [...rig.accounts.values()];

	const list = cards(buildings, rig, accounts[0] ?? 'personal');
	const n = { baton: 0, gate: 0, countersign: 0, fireable: 0 };
	// Fireable counts what this page will actually fire: a collided card's shots are not it (D10).
	for (const c of list) { n[c.kind]++; if (c.kind === 'baton' && c.wired) n.fireable += c.shots.filter(s => !('blocked' in s.fire)).length; }

	const banner = hands.armed ? '' : `<section class="panel"><h2>Hands disabled</h2>
		<p class="note">Every Dispatch button below is cold — <code>/hands/*</code> answers 503 until the credential is armed.
		The rail itself is unaffected: it reads the city either way.
		<br><span class="bad">${esc(hands.note)}</span></p></section>`;

	const counts = `<section class="strip">
		<div class="stat"><span class="label">batons</span><b>${n.baton}</b></div>
		<div class="stat"><span class="label">fireable</span><b class="t-working">${n.fireable}</b></div>
		<div class="stat"><span class="label">Felix-gates</span><b class="t-needs-input">${n.gate}</b></div>
		<div class="stat"><span class="label">countersigns</span><b class="t-unknown">${n.countersign}</b></div>
		<div class="stat"><span class="label">buildings</span><b>${buildings.length}</b></div>
		<div class="stat"><span class="label">live sessions</span><b>${census.sessions.filter(isLive).length}</b></div>
		<div class="stat"><span class="label">hands</span><b class="small">${hands.armed ? pill('armed', 'green') : pill('disabled', 'orange')}</b></div>
		<div class="stat"><span class="label">census</span><b class="small">${censusNote(census)}</b></div>
	</section>`;

	const body = list.map(c => cardHtml(c, hands.armed, accounts)).join('');

	const ms = performance.now() - t0;
	return page('Belvedere — the rail', '<span>rail</span> <span>/</span> <a href="/city">city</a>',
		banner + counts + strip(buildings, census, rig) + `<section class="railcol">${body}</section>` + SCRIPT,
		`content re-read in ${ms.toFixed(0)} ms · ${registerNote(reg, '/')}`);
}
