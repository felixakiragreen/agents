/**
 * The decoder's **resolver** — a code word turned into its object (B20 §2).
 *
 * Server-side, because the corpus is here and because resolution is the one parser's job (D65):
 * rows and decisions come out of `doctrine/`, never out of a second grammar. The detector
 * (`decode.ts`) is pure and shared; this file is where a token meets the files.
 *
 * **Context-scoped, local first.** A reference resolves against the building its document sits in,
 * then against the canon repo — belvedere's decisions stop at D18, so a `D63` written in a
 * belvedere doc is canon's D63 and the resolver knows it by *looking*, never by string-matching a
 * range. A reference that resolves nowhere, or in two places at once, answers **unresolved and
 * names what it looked at** (D10's family: never guess).
 *
 * **Nothing here writes.** The gestures it offers are B6's inbox wire — one line, previewed. The
 * fire hand is unreachable from a tooltip, and the probe greps this source and the served bundle
 * for its path to keep it that way (D10) — which is why the path is not spelled out anywhere in
 * this file, comments included.
 */

import { readFileSync, statSync } from 'fs';
import { sep } from 'path';
import { parseDecisions, type Board, type BoardRow, type Building, type Decision } from '../../doctrine';
import { detect, type Token } from './decode';
import type { Decoded, DecodeGesture, DocRef } from './deck-model';
import { encap, short } from './html';
import { countersignState, entryLine } from './inbox';
import { canonRoot, cityRoot } from './paths';
import { content, register, type Entry } from './register';

/** Everything has a limit: a tooltip is a glance, and a reference is never a novel. */
const LIMITS = { label: 64, body: 320, lines: 3, doc: 2 << 20 } as const;

const ref = (file: string, line: number): DocRef => ({ path: file, label: short(file), line });

const no = (label: string, reason: string, candidates: string[] = []): Decoded =>
	({ ok: false, label, reason, candidates });

// ---------- which building is this text written in? ----------

/**
 * The building a path belongs to: the register entry whose directory is the longest prefix of it.
 * A file, a directory and a building's own root all answer the same way, which is why the City's
 * tooltips (which know only a building directory) decode exactly like the Workshop's prose.
 */
function entryFor(entries: Entry[], path: string | null): Entry | null {
	if (path === null) return null;
	let best: Entry | null = null;
	for (const e of entries)
		if ((path === e.path || path.startsWith(e.path + sep)) && (!best || e.path.length > best.path.length)) best = e;
	return best;
}

const canonEntry = (entries: Entry[]): Entry | null => entries.find(e => e.path === canonRoot()) ?? null;

/**
 * A building named by the word in front of a `row N`. `canon` is the one keyword in the grammar
 * (B20 §1) and means the canon repo; everything else is matched against the register's own names,
 * whole slug first (`agents/belvedere`) and then last segment (`hexwright`). A word that names two
 * buildings is ambiguous and says so; a word that names none is not a scope at all, so the
 * reference falls back to its document's own building.
 */
function wordEntry(entries: Entry[], word: string): { entry: Entry } | { ambiguous: string[] } | null {
	if (word === 'canon') { const c = canonEntry(entries); return c ? { entry: c } : null; }
	const whole = entries.filter(e => e.building === word);
	if (whole.length === 1) return { entry: whole[0]! };
	const tail = entries.filter(e => (e.building.split('/').at(-1) ?? '') === word);
	if (tail.length === 1) return { entry: tail[0]! };
	if (tail.length > 1) return { ambiguous: tail.map(e => e.building) };
	return null;
}

/** Local first, then canon — deduped, and with an explicit scope word replacing the local half. */
function candidates(entries: Entry[], tok: Token, inPath: string | null): { order: Entry[]; scoped: boolean } | Decoded {
	if (tok.scope) {
		const named = wordEntry(entries, tok.scope);
		if (named && 'ambiguous' in named)
			return no(tok.text, `"${tok.scope}" names ${named.ambiguous.length} buildings`, named.ambiguous);
		// A word that names no building is not a scope: `than row 14` is prose, not a reference to
		// a building called "than". The reference falls back to the document it was written in.
		if (named) return { order: [named.entry], scoped: true };
	}
	const local = entryFor(entries, inPath);
	const canon = canonEntry(entries);
	const order = [local, canon].filter((e): e is Entry => e !== null)
		.filter((e, i, all) => all.findIndex(x => x.path === e.path) === i);
	return { order, scoped: false };
}

// ---------- the four resolutions ----------

const read = (p: string): string => {
	const size = statSync(p).size;
	if (size > LIMITS.doc) throw new Error(`${p}: ${size} bytes exceeds the ${LIMITS.doc}-byte limit`);
	return readFileSync(p, 'utf8');
};

/** A short body: the head of the prose, whole sentences where it can, capped where it cannot. */
const clip = (text: string): string => {
	const t = text.trim().replace(/\s+/g, ' ');
	return t.length <= LIMITS.body ? t : `${t.slice(0, LIMITS.body).trimEnd()}…`;
};

const noteGesture = (buildingPath: string): DecodeGesture =>
	({ kind: 'note', building: buildingPath, prefix: entryLine({ kind: 'note', text: '' }) });

function rowOf(b: Building, id: string): { board: Board; row: BoardRow }[] {
	return b.board.flatMap(board => board.rows.filter(r => r.id === id).map(row => ({ board, row })));
}

function decodeRow(tok: Token, order: Entry[], scoped: boolean): Decoded {
	const looked: string[] = [];
	for (const e of order) {
		const b = content(e);
		const hits = rowOf(b, tok.id);
		looked.push(`${b.building} — ${b.board.reduce((n, x) => n + x.rows.length, 0)} rows`);
		if (hits.length > 1)
			return no(tok.text, `${b.building} carries ${hits.length} rows called ${tok.id}`,
				hits.map(h => `${short(h.board.file)}:${h.row.line}`));
		const hit = hits[0];
		if (!hit) continue;
		const { board, row } = hit;
		const name = encap(row.work);
		// The landing record where there is one, the work cell where there is not. Never the
		// annotation's *encapsulation*: a landing record's first seam is its date, so the derived name
		// of half the corpus is `2026-08-27` — a true name and a useless body (B9 F1's own limit).
		const record = row.annotation.trim();
		return {
			ok: true, kind: 'row', id: tok.id, label: tok.text,
			headline: name.encapsulated ? name.name : clip(row.work),
			status: `${row.state ?? 'unparsed'} · ${row.hexGate ? 'Felix-gate' : `${row.mantle ?? '?'} · ${row.tier ?? '?'}`}`,
			body: record === ''
				? `${clip(row.work)} — no landing record yet; depends on ${row.dependsOn.length ? row.dependsOn.join(', ') : 'nothing'}`
				: clip(record),
			building: b.building, doc: board.file,
			where: ref(board.file, row.line),
			plan: row.workDoc && !/^[a-z][a-z0-9+.-]*:/i.test(row.workDoc)
				? ref(row.workDoc.startsWith('/') ? row.workDoc : `${board.file.slice(0, board.file.lastIndexOf(sep))}/${row.workDoc.split('#')[0]}`, 1)
				: null,
			gestures: [noteGesture(b.path)],
		};
	}
	return no(tok.text, scoped
		? `no row ${tok.id} on ${order[0]?.building ?? 'that building'}'s boards`
		: `no board in scope carries a row ${tok.id}`, looked);
}

/**
 * Decisions come from a second parse of the decisions file rather than from `Building`, because
 * `Building.decisionQueue` is the *queue* — the entries still waiting on a pen — and a decoder
 * that could only resolve unratified decisions would fail on almost every id the corpus writes.
 * Same parser, whole list (D65).
 */
const decisionsOf = (e: Entry): Decision[] =>
	e.files.decisions ? parseDecisions(read(e.files.decisions)).decisions : [];

const spread = (ds: Decision[]): string => {
	const ns = ds.map(d => Number(d.id.slice(1))).filter(Number.isFinite).sort((a, b) => a - b);
	return ns.length === 0 ? 'no decisions' : `D${ns[0]}–D${ns.at(-1)}`;
};

function decodeDecision(tok: Token, order: Entry[]): Decoded {
	const looked: string[] = [];
	for (const e of order) {
		const all = decisionsOf(e);
		looked.push(`${e.building} — ${spread(all)}`);
		const d = all.find(x => x.id === tok.id);
		if (!d || !e.files.decisions) continue;
		const title = encap(d.title);
		const state = countersignState(d, content(e).issues);
		return {
			ok: true, kind: 'decision', id: tok.id, label: tok.text,
			headline: title.encapsulated ? title.name : clip(d.title),
			status: `${d.date} · ${d.decider} · ${state}`,
			body: clip(d.body.trim() === '' ? d.title : d.body),
			building: e.building, doc: e.files.decisions,
			where: ref(e.files.decisions, d.line), plan: null,
			gestures: state === 'pending'
				? [{ kind: 'countersign', building: e.path, decision: d.id, preview: entryLine({ kind: 'countersign', decision: d.id }) }, noteGesture(e.path)]
				: [noteGesture(e.path)],
		};
	}
	return no(tok.text, `no ${tok.id} in scope — the resolver read every decision in these files`, looked);
}

/**
 * A `§` resolves against the document it is written in, or — when the reference sits inside a
 * link's text, `[DOCTRINE §10](…)` — against the document that link names. Both arrive here the
 * same way: the client hands over whichever path the reference was scoped to, and this reads the
 * headings of exactly that file.
 */
const HEADING = /^(#{1,6})\s+§?\s*(\d{1,3}(?:\.\d{1,3})?)[.):]?\s+(\S.*?)\s*$/;

function decodeSection(entries: Entry[], tok: Token, inPath: string | null): Decoded {
	if (inPath === null) return no(tok.text, 'a § resolves against the document it is written in, and this text names none');
	let lines: string[];
	try {
		if (statSync(inPath).isDirectory())
			return no(tok.text, `a § needs a document; ${short(inPath)} is a directory`);
		lines = read(inPath).split('\n');
	}
	catch (e) { return no(tok.text, `${short(inPath)} is unreadable: ${(e as Error).message}`); }

	const headings: string[] = [];
	for (const [i, line] of lines.entries()) {
		const m = HEADING.exec(line);
		if (!m) continue;
		headings.push(`§${m[2]} ${m[3]}`);
		if (m[2] !== tok.id) continue;
		const body: string[] = [];
		for (const rest of lines.slice(i + 1)) {
			if (/^#{1,6}\s/.test(rest)) break;
			if (rest.trim() !== '') body.push(rest.trim());
			if (body.length >= LIMITS.lines) break;
		}
		const e = entryFor(entries, inPath);
		return {
			ok: true, kind: 'section', id: tok.id, label: tok.text,
			headline: m[3]!, status: `${short(inPath)}:${i + 1}`,
			body: clip(body.join(' ')),
			building: e?.building ?? short(inPath), doc: inPath,
			where: ref(inPath, i + 1), plan: null,
			gestures: e ? [noteGesture(e.path)] : [],
		};
	}
	return no(tok.text, `${short(inPath)} has no ${tok.text}`, headings.slice(0, 12));
}

/**
 * `FC-n` and `GA-n` are detected and deliberately **not** resolved. They are real ids the corpus
 * writes (P3's fold candidates, the Grand Architect's sittings) and the doctrine gives them no
 * field and no artifact: the parser keeps rows, ledger entries, decisions and issues, and none of
 * them is an `FC`. Inventing a grep to find them would be a new reference grammar, which is a
 * canon question and this row's out-of-scope list (B20 §out-of-scope). So the tooltip says what it
 * is and what is missing — the fifth filing of the same *field* ask (B3 F4/F5, B9 F1, B14 F2,
 * B15 F1).
 */
const decodeFold = (tok: Token): Decoded => no(tok.text,
	`${tok.kind === 'fold' ? 'a fold candidate' : 'a Grand Architect sitting'} is prose, not a parsed artifact —`
	+ ' the doctrine carries no field for it, so nothing can resolve it without guessing',
	['rows, ledger entries, decisions and issues are what the one parser keeps']);

// ---------- the front door ----------

export function decode(tok: Token, inPath: string | null, entries: Entry[] = register().entries): Decoded {
	if (tok.kind === 'fold' || tok.kind === 'ga') return decodeFold(tok);
	if (tok.kind === 'section') return decodeSection(entries, tok, inPath);
	const scope = candidates(entries, tok, inPath);
	if ('ok' in scope) return scope;
	if (scope.order.length === 0) return no(tok.text, 'nothing in scope: this text sits in no building the register carries');
	return tok.kind === 'row' ? decodeRow(tok, scope.order, scope.scoped) : decodeDecision(tok, scope.order);
}

/**
 * `GET /deck/decode?t=<reference>&in=<document>&w=<scope word>`.
 *
 * The query is **re-detected, never trusted**: the same pure function that found the word on the
 * page has to find exactly it here, or this is not a reference and the route says so. That is
 * parse-don't-validate at the wire, and it means a hand-typed `?t=rm -rf` gets a refusal rather
 * than a lookup.
 */
export function decodeQuery(params: URLSearchParams): Decoded {
	const t = params.get('t') ?? '';
	if (t === '' || t.length > LIMITS.label) return no(t.slice(0, LIMITS.label), `?t= must be 1–${LIMITS.label} characters`);

	const found = detect(t);
	const one = found.length === 1 && found[0]!.at === 0 && found[0]!.len === t.length ? found[0]! : null;
	if (!one) return no(t, `not a reference this decoder knows: "${t}"`);

	const raw = params.get('in');
	// The same city fence `/doc` and `/deck/doc` carry: a `..` in a rendered reference cannot walk
	// out of the city, and a path outside it is refused rather than silently dropped.
	if (raw !== null && !(raw === cityRoot() || raw.startsWith(cityRoot() + sep)))
		return no(t, `outside the city: ${raw}`);

	const word = params.get('w');
	return decode({ ...one, scope: one.scope ?? (word && /^[A-Za-z][A-Za-z0-9_.\/-]{0,63}$/.test(word) ? word.toLowerCase() : null) }, raw);
}
