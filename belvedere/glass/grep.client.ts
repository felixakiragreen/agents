// The Grep, client side (B21) — the query box's state and the drawer's results.
//
// It is **not a tenant**: the drawer is the shell's one overlay (keel §3) and this is what it draws
// when Felix has asked it something, beside the needs-you queue it draws the rest of the time. So
// the jumps arrive as three functions rather than being reached for — a result lands in the Chat, in
// the Workshop's viewer or in the desk's editor, and each of those is somebody else's surface (B16
// F8's law: a tenant asks the shell, it never reaches into another tenant).
//
// **Nothing here fires.** One wire leaves this file, `GET /deck/grep`, and it is a read.

import type { DeckSnapshot, GrepAnswer, GrepGroup, GrepHit } from './deck-model';
import { el, liveName, reading, stamp, words } from './deck-dom';

/** Where a hit goes. The shell registers these once; this file never brings a pane forward itself. */
export type GrepJumps = {
	session(sid: string, anchor: number | null): void;
	doc(building: string | null, path: string, line: number): void;
	note(slug: string): void;
};

let jumps: GrepJumps | null = null;
let changed: () => void = () => { /* until the shell wires it */ };

export function wireGrep(to: GrepJumps, onChange: () => void): void {
	jumps = to;
	changed = onChange;
}

// ---------- what the query is holding ----------

let query = '';
let answer: GrepAnswer | null = null;
let running = false;
let error: string | null = null;
/** Everything has a limit, including races: only the newest query may write the answer. */
let asked = 0;

export const grepQueryText = (): string => query;
export const grepRunning = (): boolean => running;
export const grepAnswer = (): GrepAnswer | null => answer;

/** What the drawer's repaint gate compares (B14 F4). Ages tick separately, so no clock is in here. */
export const grepSignature = (): string => JSON.stringify([
	query, running, error,
	answer && [answer.query, answer.engine, answer.degraded, answer.insensitive, answer.refusal,
		answer.groups.map(g => [g.kind, g.capped, g.timedOut, g.error, g.files, g.skipped, g.filesCapped, g.ms,
			g.hits.map(h => h.key)])],
]);

export async function runGrep(term: string): Promise<void> {
	query = term;
	const mine = ++asked;
	if (term.trim() === '') { answer = null; error = null; running = false; changed(); return; }
	running = true;
	error = null;
	changed();
	try {
		const r = await fetch(`/deck/grep?q=${encodeURIComponent(term)}`, { headers: { accept: 'application/json' } });
		if (!r.ok) throw new Error(`/deck/grep answered ${r.status}`);
		const got = await r.json() as GrepAnswer;
		// A slower earlier query must never overwrite a later one's answer.
		if (mine !== asked) return;
		answer = got;
	}
	catch (e) {
		if (mine !== asked) return;
		// Never swallowed: a search box that silently answers nothing is a search box that lies.
		error = e instanceof Error ? e.message : String(e);
		answer = null;
	}
	finally {
		if (mine === asked) { running = false; changed(); }
	}
}

export function clearGrep(): void {
	query = '';
	answer = null;
	error = null;
	asked++;
	changed();
}

// ---------- the results ----------

const KIND_WORD: Readonly<Record<GrepHit['kind'], string>> = {
	sessions: 'sessions', docs: 'docs', desk: 'desk',
};

const JUMP_WORD: Readonly<Record<GrepHit['jump']['to'], string>> = {
	session: 'opens the Chat at that turn', doc: 'opens the viewer at that line', note: 'opens the note',
};

/**
 * The matching line, with the term marked and every code word in it still decoding (spec §6): a
 * result mentioning `B18` hovers like `B18` everywhere else, because the mark is drawn *around* the
 * same `words()` seam rather than instead of it (B20 §1).
 */
function line(host: HTMLElement, hit: GrepHit): void {
	const ctx = reading(hit.doc);
	if (!hit.mark) { words(host, hit.text, ctx); return; }
	const { at, len } = hit.mark;
	words(host, hit.text.slice(0, at), ctx);
	const m = el('mark', 'hit-mark');
	words(m, hit.text.slice(at, at + len), ctx);
	host.append(m);
	words(host, hit.text.slice(at + len), ctx);
}

/**
 * One hit. **The jump is on the row, never on the word** (B20 F6): a click on a code word inside a
 * result is captured and stopped by the decoder, so a jump hung off the word would be dead exactly
 * where the text is most interesting.
 */
function hitRow(hit: GrepHit, snap: DeckSnapshot | null): HTMLElement {
	const li = el('li', `hit hit-${hit.kind}`);
	li.dataset['grepKey'] = hit.key;
	li.dataset['tip'] = hit.where;
	li.dataset['tipMore'] = JUMP_WORD[hit.jump.to];
	li.dataset['tipIn'] = hit.doc;

	const head = el('div', 'hit-h');
	head.append(el('span', 'name', nameOf(hit, snap)));
	head.append(el('span', 'where', hit.where));
	if (hit.at !== null) head.append(stamp(hit.at));
	li.append(head);

	const body = el('p', 'prose hit-line');
	line(body, hit);
	li.append(body);
	return li;
}

/**
 * What to call a hit. **cmux is truth for a live session's name** (D16) and the deck's own snapshot
 * already holds cmux's word, so the live name wins here and no socket is spawned on a keystroke; the
 * birth name the server read off the transcript stands where the snapshot has never heard of it.
 */
function nameOf(hit: GrepHit, snap: DeckSnapshot | null): string {
	const j = hit.jump;
	if (j.to !== 'session' || !snap) return hit.name;
	const s = snap.census.sessions.find(x => x.sid === j.sid);
	return s ? liveName(s) : hit.name;
}

/** A group's own bounds, said out loud. A capped result set that does not say so is a lie. */
function bounds(g: GrepGroup): string {
	const said: string[] = [`${g.files} file${g.files === 1 ? '' : 's'} · ${g.ms} ms`];
	if (g.capped) said.push(`capped at ${g.hits.length} — there are more`);
	if (g.timedOut) said.push('the clock ran out before this group finished');
	if (g.filesCapped) said.push('the corpus itself was capped — the newest files were searched');
	if (g.skipped) said.push(`${g.skipped} file${g.skipped === 1 ? '' : 's'} skipped for size`);
	if (g.error) said.push(g.error);
	return said.join(' · ');
}

/**
 * The colour legend the design law asks of every coloured view — and its keys are `hit-key`, not
 * `hit`: a legend sample carrying the row's own class would answer a `.hit` selector, which is a
 * fifth result that jumps nowhere (found by this row's own probe, which counted four accounts).
 */
const LEGEND: [string, string][] = [
	['hit-key hit-sessions', 'a transcript, any account — the click opens the Chat at that turn'],
	['hit-key hit-docs', 'a doctrine document the register knows — the click opens the viewer at that line'],
	['hit-key hit-desk', 'a note on the desk — the click opens it in the editor'],
	['hit-mark', 'the term, marked where it matched'],
];

function legend(): HTMLElement {
	const box = el('div', 'legend-deck');
	box.append(el('span', 'label', 'legend'));
	for (const [cls, text] of LEGEND) {
		const key = el('span', 'lkey');
		key.append(el('span', cls, ' '), el('span', '', text));
		box.append(key);
	}
	return box;
}

export function drawResults(host: HTMLElement, snap: DeckSnapshot | null): void {
	if (error) { host.append(el('p', 'quiet prose', `the search failed — ${error}`)); return; }
	if (!answer) {
		host.append(el('p', 'label', running ? `searching for “${query}”…` : 'search the city'));
		if (!running) host.append(el('p', 'quiet prose',
			'Press / or ⌘K, type, and press Enter. Transcripts across all three accounts, every doctrine document the register knows, and the desk — grouped, bounded, and every hit one click from the place it lives.'));
		return;
	}
	if (answer.refusal) { host.append(el('p', 'quiet prose', answer.refusal)); return; }

	const total = answer.groups.reduce((a, g) => a + g.hits.length, 0);
	host.append(el('p', 'label', `${total} hit${total === 1 ? '' : 's'} for “${answer.query}” · ${answer.ms} ms · `
		+ `${answer.engine} · ${answer.insensitive ? 'case-insensitive (the term is all lower case)' : 'case-sensitive (the term carries a capital)'}`
		+ (running ? ' · searching again…' : '')));
	if (answer.degraded) host.append(el('p', 'quiet prose degraded', answer.degraded));

	for (const g of answer.groups) {
		const box = el('section', 'hits');
		const h = el('div', 'hits-h');
		h.append(el('span', 'hits-name', KIND_WORD[g.kind]), el('span', 'num', String(g.hits.length)));
		box.append(h);
		box.append(el('p', 'quiet', bounds(g)));
		if (g.hits.length) {
			const list = el('ul', 'hit-list');
			for (const hit of g.hits) list.append(hitRow(hit, snap));
			box.append(list);
		}
		host.append(box);
	}

	host.append(legend());
	host.append(el('p', 'quiet prose', answer.note));
}

/** The drawer's click, handed back the hit it landed on. Returns whether a jump was taken. */
export function jumpFrom(key: string): boolean {
	const hit = answer?.groups.flatMap(g => g.hits).find(h => h.key === key);
	if (!hit || !jumps) return false;
	if (hit.jump.to === 'session') jumps.session(hit.jump.sid, hit.jump.anchor);
	else if (hit.jump.to === 'doc') jumps.doc(hit.jump.building, hit.jump.path, hit.jump.line);
	else jumps.note(hit.jump.slug);
	return true;
}
