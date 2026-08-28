/**
 * Attention — what the city wants from Felix, computed once and rendered twice (D15).
 *
 * The keel's ruling is that the waiting-input blindness dies in **two** places: ambient badges on
 * the City, and a ranked needs-you queue in the drawer. Two surfaces disagreeing about what is
 * urgent would be worse than one surface saying nothing, so there is exactly one computation here
 * and the City's badges are **rolled up from the queue's own items**. A badge can therefore never
 * count something the queue does not list, and the queue can never list something the badge missed.
 *
 * Four classes and no fifth (B14 §out-of-scope). Nothing in this file composes a summons, mints a
 * stamp or touches the hands: an attention item is a thing to *read* and, at most, to *answer with
 * a word* — the two wires it may carry are `POST /inbox` and `POST /hands/focus` (D10).
 *
 * The ranking law is v0's, ported not reinvented: `attentionOf` and `freshness` in `pages.ts` are
 * the standing sort and are imported, not copied. B14 extends it by exactly one rank (see
 * `rankOf`).
 */

import type { Building, BoardRow } from '../../doctrine';
import type { Session } from './census';
import { isLive } from './census';
import type { Attention, DeckBuilding, QueueItem, Waiting } from './deck-model';
import { encap } from './html';
import { countersignState } from './inbox';
import { attentionOf, buildingOf, freshness, groupLabel, groupOf } from './pages';

// ---------- the waiting edge ----------

/**
 * The one reading of "this session cannot move without Felix", taken off the last beat.
 *
 * **Measured, not assumed.** P1 F1 names the only two notification types the hook ever carries —
 * `permission_prompt` and `idle_prompt` — and both are live in the city's own census today. The
 * order's input law calls the first one a `PermissionRequest` event; **there is no such hook
 * event** (P1 F1 maps all ten, and the permission signal rides `Notification` ~6 s after the
 * blocked `PreToolUse`), so this reads the event that exists. Findings §F1.
 *
 * `Stop` is deliberately absent: it is the *idle* edge, every finished turn emits one, and a queue
 * that lists every idle session is a queue Felix stops opening.
 */
export function waitingOf(s: Session): Waiting | null {
	if (!isLive(s) || s.last.ev !== 'Notification') return null;
	return s.last.why === 'permission_prompt' ? 'blocked' : s.last.why === 'idle_prompt' ? 'nagging' : null;
}

export const WAITING_NOTE: Readonly<Record<Waiting, string>> = {
	blocked: 'a tool call is sitting on the permission dialog',
	nagging: 'the session says it is waiting for your input',
};

// ---------- the escalation mark ----------

/**
 * An escalation raised in a board row's annotation, and whether anything says it was settled.
 *
 * **The narrowness is the honesty.** The city has no escalation *field* — an escalation is prose a
 * Builder wrote into a landing record — so this reads the one shape the corpus actually writes:
 * a bold run opening with an id and a dash, `**E1 — …**`. Measured over every `.md` in `~/code`:
 * that shape appears in **five files**, all of them Belvedere's own, and nowhere is it a false
 * positive; the looser reading ("any `**E<n>`") already collides with B8's `**E1 policy live**`,
 * which is a row *implementing* somebody else's escalation, not raising one.
 *
 * Settlement is the same kind of prose: the id named again within the same bold run beside a
 * ruling verb. So a row whose escalation was ruled goes quiet, and one whose escalation nobody
 * answered keeps asking. **The real fix is a field, not a regex** — same ask as B3 F4/F5 and B9
 * F1, and it rides this row's findings. Until then a miss costs one queue line, never a misfire:
 * nothing here arms anything.
 */
const RAISED = /\*\*(E\d{1,3})\s*[—–-]\s([^*]{1,400})\*\*/g;
const SETTLED = /\bruled\b|\bratified\b|\baccepted\b|\bpaid\b|\banswered\b|\bwithdrawn\b/i;

export type Escalation = { id: string; text: string };

export function escalationsIn(annotation: string): Escalation[] {
	const raised = [...annotation.matchAll(RAISED)].map(m => ({ id: m[1]!, text: m[2]!.trim() }));
	if (!raised.length) return [];
	// A settlement is any OTHER bold run naming the same id beside a ruling verb.
	const settled = new Set<string>();
	for (const m of annotation.matchAll(/\*\*([^*]{1,200})\*\*/g)) {
		const run = m[1]!;
		if (!SETTLED.test(run)) continue;
		for (const id of run.matchAll(/\b(E\d{1,3})\b/g)) settled.add(id[1]!);
	}
	return raised.filter(e => !settled.has(e.id));
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
	const short = e.encapsulated ? e.name
		: e.full.split(/\s+/).length <= NAME_WORDS ? e.full : null;
	const name = id === null ? (short ?? e.full) : short === null ? id : `${id} — ${short}`;
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

const RANK: Readonly<Record<Attention, number>> = { waiting: 0, gate: 1, countersign: 2, escalation: 3 };

/**
 * One ranked list across the whole city. **Attention outranks recency**: the class decides the
 * order and the date only ever breaks a tie inside one — the rail's own sort law (B3), extended to
 * a fourth class. An item the doctrine gives no date (a board row is not a ledger entry) keeps its
 * rank and falls to the bottom of it, never to the top.
 */
export function needsYou(buildings: Building[], sessions: Session[]): QueueItem[] {
	const out: QueueItem[] = [];

	for (const s of sessions) {
		const w = waitingOf(s);
		if (!w) continue;
		const b = buildingOf(s.cwd, buildings);
		const who = s.stamp ?? s.sid.slice(0, 8);
		out.push({
			kind: 'waiting', key: `waiting:${s.sid}`,
			building: b?.building ?? 'off the register', path: b?.path ?? '',
			...title(who, WAITING_NOTE[w]),
			at: s.last.t,
			where: `${s.cwd ?? 'no cwd on record'}${s.tool ? ` · ${s.tool}` : ''}`,
			jump: b ? slug(b.building) : null,
			sid: s.last.sf ? s.sid : null,
			decision: null, state: null,
			note: s.last.sf
				? 'Jump puts your eyes on its panel. Answering from here arrives with the Chat (B16).'
				: 'Not in a cmux pane (hooks are venue-blind), so there is no panel to jump to.',
		});
	}

	for (const b of buildings) {
		for (const board of b.board)
			for (const r of board.rows) {
				const where = `${base(board.file)}:${r.line}`;
				if (liveRow(r)) {
					const gates = r.felixGate ? [r.work, ...r.gates] : r.gates;
					for (const [n, text] of gates.entries())
						out.push({
							kind: 'gate', key: `gate:${b.building}:${r.id}:${n}`,
							building: b.building, path: b.path,
							...title(r.id, text),
							at: null, where, jump: slug(b.building), sid: null, decision: null, state: null,
							note: `Row ${r.id} is ${r.state ?? 'unparsed'} and waits on your pen. A note files to this building's inbox; the ruling is the Architect's (D3).`,
						});
				}
				for (const e of escalationsIn(r.annotation))
					out.push({
						kind: 'escalation', key: `escalation:${b.building}:${r.id}:${e.id}`,
						building: b.building, path: b.path,
						...title(`${r.id} ${e.id}`, e.text),
						at: null, where, jump: slug(b.building), sid: null, decision: null, state: null,
						note: 'Raised on a landing and nothing in the row says it was ruled. Read as prose — the corpus has no escalation field (findings F2).',
					});
			}

		for (const d of b.decisionQueue.filter(d => d.pending)) {
			const state = countersignState(d, b.issues);
			out.push({
				kind: 'countersign', key: `countersign:${b.building}:${d.id}`,
				building: b.building, path: b.path,
				...title(d.id, d.title),
				at: iso(d.date), where: `${d.date} · ${d.decider}`,
				jump: slug(b.building), sid: null, decision: d.id, state,
				note: state === 'pending'
					? 'One line into this building’s inbox. The glass records the countersign; the ✓ reaches the D-entry when the Architect sweeps (D3).'
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

const noBadges = (): Record<Attention, number> => ({ waiting: 0, gate: 0, countersign: 0, escalation: 0 });

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
		const b = buildingOf(s.cwd, buildings);
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
