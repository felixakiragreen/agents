/**
 * Attention — what the city wants from Felix, computed once and rendered twice (D15).
 *
 * The keel's ruling is that the waiting-input blindness dies in **two** places: ambient badges on
 * the City, and a ranked needs-you queue in the drawer. Two surfaces disagreeing about what is
 * urgent would be worse than one surface saying nothing, so there is exactly one computation here
 * and the City's badges are **rolled up from the queue's own items**. A badge can therefore never
 * count something the queue does not list, and the queue can never list something the badge missed.
 *
 * B14 shipped four classes; **B26 added the fifth, the baton**, because a Felix-holder baton is the
 * needs-you class by definition (D15) and this file had no bucket for it — *"an agent finished,
 * handed a baton, and I can't see that anywhere or act on it anywhere in Belvedere"*. It is one
 * bucket in this one computation, never a second attention model beside it.
 *
 * Nothing in this file composes an ignition, mints a stamp or touches the hands: an attention item
 * is a thing to *read* and, at most, to *answer with a word* — the two wires it may carry are
 * `POST /inbox` and `POST /hands/focus` (D10). A baton item quotes its instrument's bytes, which is
 * what the Workshop already prints under a ledger tail; the composer, after his click, is the hand.
 *
 * The ranking law is v0's, ported not reinvented: `attentionOf` and `freshness` in `pages.ts` are
 * the standing sort and are imported, not copied. B14 extends it by exactly one rank (see
 * `rankOf`).
 */

import type { Building, BoardRow, LedgerEntry } from '../../doctrine';
import { readBaton, withoutFences } from './baton';
import type { Session } from './census';
import { isLive } from './census';
import { noBadges, type Attention, type BatonWire, type DeckBuilding, type QueueItem, type Waiting } from './deck-model';
import { encap, short } from './html';
import { countersignState } from './inbox';
import type { Located as LocatedStep } from './steps';
import { attentionOf, freshness, groupLabel, groupOf, homeOf } from './pages';
import { ignitedFor } from './hands';

// ---------- the waiting edge ----------

/**
 * The one reading of "this session cannot move without Felix", taken off the last beat.
 *
 * **Measured, not assumed.** P1 F1 names the only two notification types the hook ever carries —
 * `permission_prompt` and `idle_prompt` — and this reads exactly one of them. The order's input law
 * calls the first a `PermissionRequest` event; **the census is not subscribed to it** (P1 F1 maps
 * all ten hooks B1 deployed and it is not among them, so the permission signal rides `Notification`
 * ~6 s after the blocked `PreToolUse`), and this reads the event that exists. B14 F1.
 *
 * **`idle_prompt` is deliberately absent, and its absence is the whole of C21.** It is cmux's
 * 60-second *"Claude is waiting for your input"* nag, and it fires once, after `Stop`, for a
 * session that has finished its turn and is asking for nothing. Read as a waiting edge it outlived
 * the fact by hours — Felix's own screenshot carried 33-minute and 21-hour rows wearing BLOCKED ON
 * YOU — so the class it named (`nagging`) is gone: code, rank, badge, dot, note and test. A session
 * whose last word was the nag is **idle**, which is what the census has always called it
 * (`census.ts` §BY_EVENT — a `Notification` that is not a permission prompt is the idle edge), and
 * it renders idle with its age.
 *
 * `Stop` is absent for the same reason and always was: it is the idle edge, every finished turn
 * emits one, and a queue that lists every idle session is a queue Felix stops opening.
 */
export function waitingOf(s: Session): Waiting | null {
	if (!isLive(s) || s.last.ev !== 'Notification') return null;
	return s.last.why === 'permission_prompt' ? 'blocked' : null;
}

/** Short enough to BE the name (encapsulation-first): the long form is the item's `note`. */
export const WAITING_NOTE = 'blocked on a permission prompt';

// ---------- the escalation mark ----------

/**
 * An escalation raised in a board row's annotation, and whether anything says it was settled.
 *
 * **The narrowness is the honesty.** The city has no escalation *field* — an escalation is prose a
 * Builder wrote into a landing record — so this reads the one shape the corpus writes, and reads
 * it off the text the parser actually hands over. That second half is the trap: the annotation
 * arrives **stripped** (`grammar.ts`'s `strip()` removes every `**` and backtick from a status
 * cell), so `**E1 — …**` is `E1 — …` by the time this sees it and a regex written against the
 * markdown matches nothing at all. Measured, not assumed — the fixture caught it.
 *
 * So one marker regex, run once:
 *
 *  - **raise** — `E<n>` followed by a spaced dash: `E1 — the register policy needs a ruling`. The
 *    dash is what makes it a raise; `E1 policy live` (B8's real annotation, a row *implementing*
 *    somebody else's escalation) has none and is correctly not one.
 *  - **settle** — `E<n>` followed by a ruling verb: `E1 ruled 2026-08-27`, `E2 paid`, `E2
 *    ratified`. Every settled escalation in the live corpus is written exactly this way.
 *
 * An `F<n>` marker is a boundary and never an item: a Builder's findings are not escalations.
 * The raised text runs to the next marker, the next ` · `, or the cap — whichever comes first.
 *
 * Two false positives were **measured over all 458 board rows in the live city** and both are
 * fixed at the cause, generally, with no per-repo branch:
 *
 *  1. **`E<n>` is nobody's reserved namespace.** `whiteboardy/docs/m1-editor.md` staffs thirteen
 *     rows literally named `E1…E13`, so `E4 — …` in one of its annotations is a *row reference*.
 *     An id that names a row on this building's own boards is therefore never an escalation —
 *     the same test `parseDependsOn` already applies to a Depends-on segment.
 *  2. **A range's far end is not the head of a clause.** cornerizer wrote *"all 4 escalations
 *     ruled at the 2026-08-15 review (D11, E1–E4 — §6 fold, log)"*, where `E4` is the right end
 *     of `E1–E4`. An id preceded immediately by a dash is a range, not a raise.
 *
 * **The real fix is a field, not a regex** — the same ask as B3 F4/F5 and B9 F1, and it rides this
 * row's findings. Until then a miss costs one queue line and never a misfire: nothing here arms
 * anything (D10).
 */
const MARK = /(?<![—–-])\b([EF]\d{1,3})\s+(?:([—–-])\s|(ruled|ratified|accepted|paid|answered|withdrawn)\b)/g;
const TEXT_CAP = 240;

export type Escalation = { id: string; text: string };

export function escalationsIn(annotation: string, rowIds: ReadonlySet<string>): Escalation[] {
	const marks = [...annotation.matchAll(MARK)]
		.map(m => ({ at: m.index, end: m.index + m[0].length, id: m[1]!, raise: m[2] !== undefined }));
	const settled = new Set(marks.filter(m => !m.raise).map(m => m.id));

	const out: Escalation[] = [];
	for (const [n, m] of marks.entries()) {
		if (!m.raise || m.id[0] !== 'E' || settled.has(m.id) || rowIds.has(m.id)) continue;
		const next = marks[n + 1]?.at ?? annotation.length;
		const rest = annotation.slice(m.end, Math.min(next, m.end + TEXT_CAP));
		out.push({ id: m.id, text: (rest.split(' · ')[0] ?? rest).trim() });
	}
	return out;
}

// ---------- encapsulation-first, with an id in front ----------

/** Felix's law is 1–6 words; a longer head is not a name (`html.ts` §encap, same constant). */
const NAME_WORDS = 6;

/**
 * The name a row leads with. The derivation is `encap()`'s and is not re-implemented: the only
 * thing added is that these things have **ids**, and an id is a name the text really did write.
 * A text with neither a derivable head nor a short-enough body keeps its id alone and `[expand]`
 * carries the rest — honest, and never a truncation dressed as a name (B9 F1's STOP clause).
 */
function title(id: string | null, text: string): { name: string; full: string } {
	const e = encap(text);
	const head = e.encapsulated ? e.name
		: e.full.split(/\s+/).length <= NAME_WORDS ? e.full : null;
	const name = id === null ? (head ?? e.full) : head === null ? id : `${id} — ${head}`;
	return { name, full: e.full };
}

const iso = (date: string): number | null => {
	const t = Date.parse(`${date}T00:00:00`);
	return Number.isFinite(t) ? t / 1000 : null;
};

const slug = (building: string) => '/b/' + building.split('/').map(encodeURIComponent).join('/');

/** A gate is the queue's business while its row can still move; a LANDED gate is history (B3's law). */
const liveRow = (r: BoardRow) => r.state === 'OPEN' || r.state === 'IN FLIGHT' || r.state === 'BLOCKED' || r.state === null;

const base = (file: string) => file.split('/').at(-1) ?? file;

// ---------- the queue ----------

/**
 * **`baton` shares `waiting`'s rank, deliberately** (B26 §4). Both are the city waiting on Felix —
 * one because a dialog is holding a tool call, one because a session finished and handed him the
 * next move — and giving the baton its own rank would sort every handoff below a permission prompt
 * from yesterday, or every prompt below a handoff. One rank, and recency orders inside it: the two
 * classes **interleave**, which is the standing law (attention across ranks, recency within) applied
 * rather than a second ordering invented for the new class.
 */
const RANK: Readonly<Record<Attention, number>> = { waiting: 0, baton: 0, gate: 1, countersign: 2, escalation: 3 };

/**
 * What this baton can and cannot do from the drawer, in one honest line — the holder decides it,
 * and the holder is the parser's (D65). Every branch ends the same way: the composer, after his
 * click, is the only hand on this deck.
 */
function batonNote(w: BatonWire): string {
	if (w.holder === 'prose')
		return 'A dropped baton — the Next clause carries no instrument and names no Felix-action (D63g/D64), so there is nothing here to take up. What it needs is a Next clause the grammar can read; a note files that ask to this building’s inbox.';
	if (w.collides)
		return 'The parser reads an instrument here and the clause names Felix, so the two readings disagree — and an ambiguous holder never arms (D10). The bytes are yours to read, copy and carry into the composer; nothing on this deck dispatches them for you.';
	if (w.holder === 'felix')
		return 'The ledger tail hands this one to you and names no instrument, so there is nothing to open — the clause is the whole of it. Read it where it was written; a note files to this building’s inbox.';
	if (w.shape === 'fork')
		return 'A fork: the options are exclusive and choosing is yours (D64). Each carries its own bytes and the recommendation is marked where the clause named one — take one to the composer, where your click is the ignition.';
	if (w.shape === 'plural')
		return `This clause hands ${w.options.length} instruments and never says whether they run together or instead of each other — D64’s shape is not a field the grammar carries yet, so the deck offers all of them and decides nothing.`;
	return 'A session holds this baton. Compose loads its summons into the composer, where the stamp, tier, venue and trust resolve live and your click is the ignition — nothing on this path ignites on its own (D10).';
}

/**
 * One building's ledger tail, as an attention item (B26 §1).
 *
 * The text is stripped of its fences before it is named: an instrument quoted inside the Next clause
 * is printed by the item's own options, and leaving it in the prose prints every summons twice — the
 * rail's own display rule (`baton.ts` §withoutFences), not a second reading of the clause.
 *
 * **The id is the entry's own row** — the charge that just landed and handed this on (§7's ledger
 * head). Every other class in this queue leads with an id and falls back to it when the text wrote
 * no ≤6-word head; the baton was the one class with none, and without it six of the live city's
 * fifteen batons named themselves *"unchanged"* while three put a 400-character clause in a drawer
 * row. Where a tail names no row the fallback is the clause itself, which is B9 F1's honest
 * furniture rule and the fourth filing of the same ask (findings).
 */
function batonItem(b: Building, tail: LedgerEntry): QueueItem {
	const read = readBaton(b, b.baton!, tail.line);
	const wire: BatonWire = { holder: b.baton!.holder, shape: read.shape, collides: read.collides, options: read.options };
	const file = b.files.ledger ?? b.path;
	return {
		kind: 'baton', key: `baton:${b.building}`,
		building: b.building, path: b.path,
		...title(tail.row, withoutFences(b.baton!.text)),
		at: iso(tail.date),
		where: `${base(file)}:${tail.line}`,
		doc: file,
		jump: slug(b.building),
		// A baton is about a building's next move, not about a session: there is no pane to jump to
		// and no conversation to open. Both stay null rather than pointing at whatever ran last.
		sid: null, chat: null,
		decision: null, state: null,
		baton: wire,
		note: batonNote(wire),
	};
}

/**
 * One ranked list across the whole city. **Attention outranks recency**: the class decides the
 * order and the date only ever breaks a tie inside one — the rail's own sort law (B3), extended to
 * a fifth class. An item the doctrine gives no date (a board row is not a ledger entry) keeps its
 * rank and falls to the bottom of it, never to the top.
 */
export function needsYou(buildings: Building[], sessions: Session[], steps: readonly LocatedStep[] = []): QueueItem[] {
	const out: QueueItem[] = [];

	// A step the engine has paused is the `waiting` class arriving from the other sensor (C16 §3).
	// The census cannot see it — the subject's turn is over and its process is gone — but the run log
	// says the run cannot move without Felix, which is the whole of what this class means. No fifth
	// kind: a second word for one fact is two surfaces disagreeing about what is urgent.
	for (const s of steps) {
		out.push({
			kind: 'waiting', key: `paused:${s.run}/${s.step}`,
			building: s.building ?? 'off the register', path: buildings.find(b => b.building === s.building)?.path ?? '',
			...title(`${s.run}/${s.step}`, s.why === '' ? s.causes.join(', ') : s.why),
			at: s.logAt,
			where: `${s.where} · ‹${s.causes.join(', ')}›`,
			doc: buildings.find(b => b.building === s.building)?.path ?? '',
			jump: s.building ? slug(s.building) : null,
			// Headless by construction (D22): there is no pane to jump to, and the Chat is the whole view.
			sid: null,
			chat: s.sessionId,
			decision: null, state: null, baton: null,
			note: s.refusal !== null
				? `The engine is holding this step and it is read-only: ${s.refusal}`
				: 'The engine paused this step and still holds its session. Chat opens the conversation; your reply travels the engine’s own resume and the run log says what it landed (C16 §2).',
		});
	}

	for (const s of sessions) {
		if (waitingOf(s) === null) continue;
		const b = homeOf(s, buildings, ignitedFor());
		const who = s.stamp ?? s.sid.slice(0, 8);
		out.push({
			kind: 'waiting', key: `waiting:${s.sid}`,
			building: b?.building ?? 'off the register', path: b?.path ?? '',
			...title(who, WAITING_NOTE),
			at: s.last.t,
			where: `${s.cwd ? short(s.cwd) : 'no cwd on record'}${s.tool ? ` · ${s.tool}` : ''}`,
			// A session's words are nobody's document, so its code words decode against its own
			// building — which is what this item's note cites anyway (`B16`, `P1 F1`).
			doc: b?.path ?? '',
			jump: b ? slug(b.building) : null,
			sid: s.last.sf ? s.sid : null,
			chat: s.sid,
			decision: null, state: null, baton: null,
			note: 'A tool call is sitting on the approval dialog — the session is alive and spending nothing until you answer it. '
				+ (s.last.sf
					? 'Jump puts your eyes on its panel; chat opens it in the Chat, where an answer is delivered as a real user turn (B16).'
					: 'It sits in no cmux pane (hooks are venue-blind), so there is no panel to jump to.'),
		});
	}

	for (const b of buildings) {
		if (b.baton && b.ledgerTail) out.push(batonItem(b, b.ledgerTail));

		// The building's own row-id namespace: an escalation marker that names one of these is a
		// row reference (§escalationsIn, false positive 1). Whole building, not one board — a
		// landing record cites rows across the boards of its own building.
		const rowIds = new Set(b.board.flatMap(x => x.rows.map(r => r.id)));
		for (const board of b.board)
			for (const r of board.rows) {
				const where = `${base(board.file)}:${r.line}`;
				if (liveRow(r)) {
					const gates = r.hexGate ? [r.work, ...r.gates] : r.gates;
					for (const [n, text] of gates.entries())
						out.push({
							kind: 'gate', key: `gate:${b.building}:${r.id}:${n}`,
							building: b.building, path: b.path,
							...title(r.id, text),
							at: null, where, doc: board.file, jump: slug(b.building), sid: null, chat: null, decision: null, state: null, baton: null,
							note: `Charge ${r.id} is ${r.state ?? 'unparsed'} and waits on your pen. A note files to this building's inbox; the ruling is the Architect's (D3).`,
						});
				}
				for (const e of escalationsIn(r.annotation, rowIds))
					out.push({
						kind: 'escalation', key: `escalation:${b.building}:${r.id}:${e.id}`,
						building: b.building, path: b.path,
						...title(`${r.id} ${e.id}`, e.text),
						at: null, where, doc: board.file, jump: slug(b.building), sid: null, chat: null, decision: null, state: null, baton: null,
						note: 'Raised on a landing and nothing in the charge says it was ruled. Read as prose — the corpus has no escalation field (findings F2).',
					});
			}

		for (const d of b.decisionQueue.filter(d => d.pending)) {
			const state = countersignState(d, b.issues);
			out.push({
				kind: 'countersign', key: `countersign:${b.building}:${d.id}`,
				building: b.building, path: b.path,
				...title(d.id, d.title),
				at: iso(d.date), where: `${d.date} · ${d.decider}`, doc: b.files.decisions ?? b.path,
				jump: slug(b.building), sid: null, chat: null, decision: d.id, state, baton: null,
				note: state === 'pending'
					? 'One line into this building’s inbox. The deck records the blessing; the ✓ reaches the D-entry when the Architect sweeps (D3).'
					: state === 'recorded'
						? 'Your word is already in the inbox; the ✓ lands at the next sweep.'
						: 'The decision already carries its ✓ — the parser queues it anyway (B6 F2). Nothing is owed.',
			});
		}
	}

	return out.sort((a, b) =>
		RANK[a.kind] - RANK[b.kind] || (b.at ?? 0) - (a.at ?? 0) || a.key.localeCompare(b.key));
}

// ---------- the City ----------

/**
 * **The one rank B14 adds.** `attentionOf` (v0, ported) puts live work first, then his pen, then
 * what is merely in play. A session blocked on a dialog is both at once — live *and* his — and it
 * is the single thing on this glass that is costing him a running agent while he does not know,
 * which is the whole complaint the deck was commissioned over. So it takes a rank of its own above
 * all of them, and everything below is v0's law untouched.
 */
export const rankOf = (b: Building, live: number, waiting: number): number =>
	waiting > 0 ? -1 : attentionOf(b, live);

export function cityRows(buildings: Building[], sessions: Session[], items: QueueItem[]): DeckBuilding[] {
	const housed = new Map<string, Session[]>();
	for (const s of sessions) {
		const b = homeOf(s, buildings, ignitedFor());
		if (b) housed.set(b.building, [...(housed.get(b.building) ?? []), s]);
	}

	// The badges ARE the queue, bucketed: one computation, two renderings (§head).
	const badges = new Map<string, Record<Attention, number>>();
	for (const i of items) {
		const b = badges.get(i.building) ?? noBadges();
		b[i.kind]++;
		badges.set(i.building, b);
	}

	return buildings.map(b => {
		const live = housed.get(b.building) ?? [];
		const mine = badges.get(b.building) ?? noBadges();
		return {
			building: b.building, path: b.path,
			group: groupOf(b.path), label: groupLabel(groupOf(b.path)),
			live: live.length,
			badges: mine,
			attention: rankOf(b, live.length, mine.waiting),
			fresh: freshness(b, live),
			sids: live.sort((x, y) => y.last.t - x.last.t).map(s => s.sid),
		};
	}).sort((a, b) => a.attention - b.attention || b.fresh - a.fresh || a.building.localeCompare(b.building));
}
