/**
 * The Workshop, server side: **one building, opened** (B15, keel §3's first real Focus tenant).
 *
 * This file does one thing — turn a parsed `Building` into the shape the Workshop draws. The parse
 * itself is canon `doctrine/`'s and is never re-implemented (D65); the ranking is `attention.ts`'s;
 * the render is the client's. What lives here is the **boundary transform**: markdown into spans,
 * files and lines into `DocRef`s, and the encapsulation-first name onto every piece of prose — done
 * once, server-side, where the filesystem is, so the client can build DOM and know nothing.
 *
 * **Nothing here writes and nothing here ignites.** The Workshop's only wire is `POST /hands/focus`
 * (his eyes, a jump); the string `hands/ignite` does not appear in this file or in what it produces.
 */

import type { Board, BoardRow, Building, Decision, Fail, Issue, LedgerEntry } from '../../doctrine';
import type {
	Attention, DocRef, Prose,
	WorkshopBoard, WorkshopBaton, WorkshopDecision, WorkshopDetail, WorkshopIssue, WorkshopRow, WorkshopTail,
} from './deck-model';
import { baseOf, prose, short } from './html';
import { countersignState } from './inbox';
import { groupLabel, groupOf } from './pages';

/** Where a thing is written: `belvedere/LEDGER.md:385`, and the line the viewer opens at. */
const ref = (file: string, line: number): DocRef => ({ path: file, label: short(file), line });

/** An empty annotation is not a name and not a paragraph: it is nothing, and renders as nothing. */
const EMPTY: Prose = { name: '', encapsulated: false, spans: [] };
const proseOf = (text: string, base: string): Prose => (text.trim() ? prose(text, base) : EMPTY);

/**
 * The row's staffing cell, back in one string. It is read as a phrase, never as fields — `Builder ·
 * opus-high` is what the board says and what the Workshop shows; the parser's `?` for a cell it
 * could not type stays a `?` here rather than being quietly filled in.
 */
const staffingOf = (r: BoardRow): string =>
	r.hexGate ? '⬡-gate' : `${r.mantle ?? '?'} · ${r.tier ?? '?'}`;

function row(r: BoardRow, board: Board, base: string, fails: Fail[]): WorkshopRow {
	return {
		id: r.id,
		work: proseOf(r.work, base),
		workDoc: r.workDoc === null || /^[a-z][a-z0-9+.-]*:/i.test(r.workDoc)
			? null
			: ref(r.workDoc.startsWith('/') ? r.workDoc : `${base}/${r.workDoc.split('#')[0]}`, 1),
		dependsOn: r.dependsOn,
		gates: r.gates,
		staffing: staffingOf(r),
		hexGate: r.hexGate,
		rider: r.rider,
		state: r.state,
		annotation: proseOf(r.annotation, base),
		ref: ref(board.file, r.line),
		lint: fails.filter(f => f.file === board.file && f.line === r.line).map(f => `${f.code} — ${f.reason}`),
	};
}

function tailOf(e: LedgerEntry, file: string, baton: Building['baton']): WorkshopTail {
	const base = baseOf(file);
	const carried: WorkshopBaton | null = baton === null ? null : {
		holder: baton.holder,
		text: proseOf(baton.text, base),
		instruments: baton.instruments.map(i => i.kind === 'summons'
			? { kind: 'summons' as const, text: i.text }
			: { kind: 'row' as const, text: i.row }),
	};
	return {
		date: e.date, mantle: e.mantle, tier: e.tier, row: e.row,
		body: proseOf(e.body, base),
		decided: e.decided === null ? null : proseOf(e.decided, base),
		baton: carried,
		ref: ref(file, e.line),
	};
}

const decisionOf = (d: Decision, file: string, issues: Issue[]): WorkshopDecision => ({
	id: d.id, date: d.date, decider: d.decider,
	title: proseOf(d.title, baseOf(file)),
	state: countersignState(d, issues),
	ref: ref(file, d.line),
});

const issueOf = (i: Issue, file: string): WorkshopIssue => ({
	date: i.date, who: i.who, text: proseOf(i.text, baseOf(file)), ref: ref(file, i.line),
});

/**
 * One building, opened — or null when the register does not carry that name.
 *
 * `badges` come in from the queue's own bucketing rather than being recomputed: one computation,
 * two renderings is D15's whole point, and a third reading of "what does this building want" would
 * be a third thing that can disagree.
 */
export function workshopOf(
	buildings: Building[], name: string, badges: Record<Attention, number>,
): WorkshopDetail | null {
	const b = buildings.find(x => x.building === name);
	if (!b) return null;

	// A failure pinned to a board row is shown on that row; the count is what is left over, so
	// nothing the parser could not read goes unreported and nothing is reported twice (v0's law).
	const at = new Set(b.board.flatMap(x => x.rows.map(r => `${x.file}:${r.line}`)));
	const boards: WorkshopBoard[] = b.board.map(board => ({
		heading: board.heading || 'untitled',
		ref: ref(board.file, board.line),
		rows: board.rows.map(r => row(r, board, baseOf(board.file), b.fails)),
	}));

	return {
		building: b.building,
		path: b.path,
		label: groupLabel(groupOf(b.path)),
		boards,
		tail: b.ledgerTail && b.files.ledger ? tailOf(b.ledgerTail, b.files.ledger, b.baton) : null,
		decisions: b.files.decisions
			? b.decisionQueue.map(d => decisionOf(d, b.files.decisions!, b.issues))
			: [],
		issues: b.files.issues ? b.issues.map(i => issueOf(i, b.files.issues!)) : [],
		lint: b.fails.filter(f => !at.has(`${f.file}:${f.line}`)).length,
		files: {
			boards: b.files.boards.map(f => ref(f, 1)),
			ledger: b.files.ledger ? ref(b.files.ledger, 1) : null,
			decisions: b.files.decisions ? ref(b.files.decisions, 1) : null,
			issues: b.files.issues ? ref(b.files.issues, 1) : null,
		},
		badges,
	};
}
