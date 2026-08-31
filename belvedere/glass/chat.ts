/**
 * The Chat — the voice (B16, deck keel §5). **One conversation view in the whole deck**: any
 * session, live or idle or weeks dead, hotswaps into it; the transcript reads in Focus, Felix's
 * reply drafts in Action, and **send** delivers his words as a real user turn.
 *
 * Three things live here and nothing else:
 *
 *  1. **The read** — a bounded window of a transcript file, parsed into turns. Reads are free and
 *     fence-legal (keel §5); the window pages backwards on the *byte offset* it hands back, which
 *     is the only stable identity a jsonl append log offers.
 *  2. **The send** — P6's transport law, consumed verbatim (§T): the **segmented paste**, the
 *     compose-time refusals, and the **verification read** that decides whether anything was
 *     delivered at all. Nothing here reports delivered without it.
 *  3. **The draft** — one file per target under `desk/drafts/` (D17's home, D18 class 3), so a
 *     half-written reply outlives a reload, a hotswap and a killed server.
 *
 * **The fence gains nothing** (README §2). The send is D18's write class 1 and rides the same
 * arming switch and the same audit as every hand; the draft is a file write under `desk/`, which is
 * class 3; the read is a read. Nothing in this file edits a board, a ledger or a decision.
 *
 * **C16 widened all three, and added a road.** The target set now includes a session no cmux pane
 * ever held — an engine run's step, found by `steps.ts` off the run log (D22's primary venue is
 * headless, so a Chat that could only read pane-born sessions could not read the city's own
 * engine). A reply into a step the engine is holding **paused** therefore travels the engine's own
 * `rule(resume)` rather than P6's transport: same session, headless, exactly what the console's
 * `send` does. The verification read is unchanged and still decides — B16's three failure verdicts
 * hold on both roads and neither is ever retried.
 */

import { createHash } from 'crypto';
import { closeSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, readSync, rmSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Building } from '../../doctrine';
import { load } from '../v3/engine/engine.ts';
import { isRefusal } from '../v3/engine/refusal.ts';
import { readRun } from '../v3/console/runs.ts';
import { waitingOf } from './attention';
import { identify, isLive, readCensus, type CensusRead, type Session } from './census';
import { refusals, type ChatBlock, type ChatMark, type ChatSend, type ChatStep, type ChatTarget, type ChatTurn, type ChatView, type Span } from './deck-model';
import { audit, cmux, fail, field, ignite, json, readCredential, type Outcome } from './hands';
import { spans } from './html';
import { buildingOf } from './pages';
import { cityRoot, draftsDir, projectsDir, runsRoot } from './paths';
import { city } from './register';
import { accountLabel, mantleOf, readRig, type Rig } from './rig';
// (`CensusRead` and `Building` are the two halves of `World` below.)
import { sanitizeSummons } from './sanitize';
import { stepIndex, type Located as LocatedStep } from './steps';
import { colourOf } from './summon';

/**
 * Everything has a limit (directive 3.1). The window is what one poll carries; `turns` is what the
 * browser is asked to lay out; `verifyMs` is how long a delivery may stay unproven before the card
 * says so — generous, because a message that queues behind a live turn lands in ~4 s (P6 Q2) and a
 * long in-flight turn pushes that out further.
 */
export const LIMITS = {
	window: 192 << 10, turns: 40, acts: 40, head: 90, draftBytes: 64 << 10,
	/**
	 * **The whole transcript** (B23 §2, his ruling): the scroll view shows the entire chat, so one
	 * gesture reads the file rather than a window, and the pager is gone.
	 *
	 * Everything still has a limit, and here the two limits are both printed rather than hidden:
	 * `whole` bounds the bytes one read may take off disk, and `wholeTurns` bounds what the browser
	 * is asked to lay out. A file that outran either comes back with `from > 0` and the pane says
	 * the beginning is not held — which is the honest failure, not a silent keyhole.
	 */
	whole: 16 << 20, wholeTurns: 2_000,
	appended: 4 << 20, verifyMs: 45_000, pollMs: 700, callMs: 20_000,
	/**
	 * The minimap's own two limits (C16 §6). `marks` is what a 900-px strip can distinguish, so a
	 * transcript with more turns is **evenly downsampled** and the pane prints both numbers;
	 * `indexBytes` bounds one growth scan, and a file that outran it stops indexing rather than
	 * allocating whatever it likes.
	 */
	marks: 600, indexBytes: 32 << 20,
	/**
	 * How long the engine road waits for `rule()` to answer before it stops waiting on the *ruling*
	 * and starts waiting on the *transcript*. Every refusal `rule()` has is decided before a subject
	 * is spawned, so a second is generous; a real turn takes minutes and is never what is waited on
	 * — **delivered is the transcript, never the ruling** (B16's law, kept on the second road).
	 */
	ruleMs: 1_000,
} as const;

/** Session ids and nothing else: this string becomes a filename under `desk/drafts/`. */
const SID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const bytesOf = (s: string) => Buffer.byteLength(s, 'utf8');

// ---------- finding the target ----------

/**
 * Who the Chat is pointed at, gathered from the two sources that know: the census for anything it
 * has ever heard beat, and the three transcript trees for everything older than the sensor's
 * horizon (B5 E1 — the hooks went live mid-city, so most of the corpus is *only* on disk).
 *
 * `state` is `dead` for a session the census does not track or has marked `gone`, and that word
 * decides the send's whole mechanism: a live target takes P6's segmented paste, a dead one takes a
 * resume that carries the turn (P6 Q3).
 */
export type Located = ChatTarget & { configDir: string | null };

/** One targeted look through the accounts' projects trees. A miss costs `readdir` ×3 and no more. */
function findTranscript(rig: Rig, sid: string): { path: string; configDir: string } | null {
	for (const [configDir] of rig.accounts) {
		let slugs: string[];
		try { slugs = readdirSync(projectsDir(configDir)); } catch { continue; }
		for (const slug of slugs) {
			const path = join(projectsDir(configDir), slug, `${sid}.jsonl`);
			if (existsSync(path)) return { path, configDir };
		}
	}
	return null;
}

/** cmux's word where the socket gave one, the rig's birth name otherwise, the uuid's head last. */
const nameOf = (stamp: string | null, sid: string) => stamp ?? sid.slice(0, 8);

/** What a step contributes to a target: its own venue, its transcript, and the step itself. */
const asStep = (found: LocatedStep): { step: ChatStep; transcript: string | null; configDir: string; cwd: string } => {
	const { dir: _dir, sessionId: _sid, transcript, configDir, workDir, ...step } = found;
	return { step, transcript: existsSync(transcript) ? transcript : null, configDir, cwd: workDir };
};

/**
 * Three sources now, in this order: the census, the **engine's run logs**, and the accounts'
 * transcript trees. The middle one is C16's widening and it is not merely a fallback — a session
 * the census also knows can still be a step the engine is holding, and that fact decides the road a
 * reply takes. So the index is consulted for **every** target, and only the transcript falls back.
 */
export function locate(sid: string, rig: Rig, census: CensusRead, buildings: Building[], steps: Map<string, LocatedStep> = stepIndex(buildings)): Located | null {
	const s: Session | undefined = census.sessions.find(x => x.sid === sid);
	const engine = steps.get(sid);
	const mine = engine === undefined ? null : asStep(engine);
	const found = s?.transcript || mine?.transcript ? null : findTranscript(rig, sid);
	if (!s && !found && !mine) return null;

	const transcript = s?.transcript ?? mine?.transcript ?? found?.path ?? null;
	// The census's cwd is the session's own and current; the transcript's is where it began. Prefer
	// the live one, fall back to the head window, claim nothing if neither (shelf's law, kept).
	const who = s === undefined && transcript !== null ? identify(transcript) : null;
	const cwd = s?.cwd ?? mine?.cwd ?? who?.cwd ?? null;
	const configDir = s?.account ?? mine?.configDir ?? found?.configDir ?? null;
	const stamp = s?.stamp ?? who?.stamp ?? null;
	return {
		sid,
		// The step's own address is a FIELD, never spliced into the name: the name is the word the
		// transcript's turns are labelled with, and a run path in it would relabel every turn.
		name: nameOf(stamp, sid),
		stamp,
		// A layer-0 sandbox is not an account, and `accountLabel` would print the raw path as if it
		// were one — the run's own word for it (C14's shape) outranks the label here.
		account: mine?.step.fake === true ? null : accountLabel(rig, configDir),
		building: buildingOf(cwd, buildings)?.building ?? mine?.step.building ?? null,
		cwd,
		model: s?.model ?? who?.model ?? null,
		state: s !== undefined && isLive(s) ? s.state : 'dead',
		waiting: s === undefined ? null : waitingOf(s),
		ws: s?.last.ws ?? null,
		transcript,
		step: mine?.step ?? null,
		configDir,
	};
}

// ---------- the read: a bounded window, and the offset it pages backwards on ----------

export type Window = { text: string; from: number; to: number };

/**
 * The last `bytes` of a transcript, whole lines only, and **where it started**.
 *
 * `census.ts`'s `fileWindow` answers the same question for a log whose tail is all anyone wants;
 * this one hands back its own opening offset, which is how the pane knows whether it is holding the
 * beginning of the conversation or a bounded read of the end. The newline is found in the *buffer*,
 * not in the decoded string: the corpus is full of `—` and `⚡`, and a UTF-16 index into a byte
 * offset is a bug that only shows up on the interesting lines.
 *
 * It reads backwards from EOF and nowhere else. The `endByte` this took until B23 was the pager's —
 * *"the window before the one I hold"* — and it retired with the model his ruling replaced (§2): a
 * door labelled "read up to byte N" is how a keyhole grows back.
 */
export function windowOf(path: string, bytes: number): Window | null {
	let fd: number;
	try { fd = openSync(path, 'r'); } catch { return null; }
	try {
		const end = statSync(path).size;
		const start = Math.max(0, end - bytes);
		const buf = Buffer.alloc(end - start);
		if (buf.length) readSync(fd, buf, 0, buf.length, start);
		if (start === 0) return { text: buf.toString('utf8'), from: 0, to: end };
		// A partial edge line is dropped, never guessed at.
		const nl = buf.indexOf(0x0a);
		return nl < 0
			? { text: '', from: end, to: end }
			: { text: buf.subarray(nl + 1).toString('utf8'), from: start + nl + 1, to: end };
	}
	catch { return null; }
	finally { closeSync(fd); }
}

type Rec = Record<string, unknown>;

const at = (r: Rec): number | null => {
	const t = typeof r['timestamp'] === 'string' ? Date.parse(r['timestamp']) : NaN;
	return Number.isFinite(t) ? t / 1000 : null;
};

const clip = (s: string, cap: number = LIMITS.head): string => {
	const one = (s.split('\n')[0] ?? '').trim();
	return one.length > cap ? `${one.slice(0, cap)}…` : one;
};

/**
 * A tool call, encapsulated to one line (spec §2). The ordered key list is the whole derivation —
 * every tool in the harness names what it touched in one of these, and a tool that names it
 * somewhere else falls through to its first string field rather than getting a special case.
 */
const HEAD_KEYS = ['file_path', 'command', 'pattern', 'description', 'path', 'url', 'query', 'prompt', 'skill'];

function headOf(input: unknown): string {
	if (typeof input !== 'object' || input === null) return '';
	const o = input as Rec;
	for (const k of HEAD_KEYS) {
		const v = o[k];
		if (typeof v === 'string' && v.trim() !== '') return clip(v);
	}
	const first = Object.values(o).find(v => typeof v === 'string' && v.trim() !== '');
	return typeof first === 'string' ? clip(first) : '';
}

/**
 * A fenced block, kept whole and **exempt from the decoder** (spec §2). A kickoff quoted inside a
 * transcript is bytes somebody is going to copy — hanging hover controls inside it would be the
 * glass editing what it was asked to show, which is exactly the exemption B20 §1 wrote for code
 * ticks, arriving one grammar further along.
 */
const FENCE = /^\s{0,3}```(\S*)\s*$/;

/**
 * The block markdown agents actually write (C16 §4). Deliberately four shapes and no fifth:
 * headings, lists, tables and paragraphs, on top of the fence that already had a shape of its own.
 * A blockquote, an HR or a nested list renders as the paragraph it textually is — **the words are
 * never lost**, only their decoration, and a renderer that grows a case per notation is a
 * dependency in disguise (D54's neighbour, and `html.ts`'s own standing note).
 */
const HEAD = /^\s{0,3}(#{1,6})\s+(.*)$/;
const ITEM = /^(\s*)(?:[-*+]|(\d+)[.)])\s+(.*)$/;
/** A table's second line, and the only thing that makes the first one a table. */
const RULE = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/;
const isRow = (line: string | undefined): boolean => line !== undefined && line.includes('|') && line.trim() !== '';

/** One table row's cells: the outer pipes are decoration, the inner ones are the columns. */
const cells = (line: string, baseDir: string): Span[][] =>
	line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => spans(c.trim(), baseDir));

export function blocksOf(text: string, baseDir: string): ChatBlock[] {
	const out: ChatBlock[] = [];
	const lines = text.split('\n');
	let held: string[] = [];
	/** A paragraph closes on anything that is not more of it — that is the whole block grammar. */
	const flush = () => {
		const t = held.join('\n');
		held = [];
		if (t.trim() !== '') out.push({ kind: 'prose', spans: spans(t, baseDir) });
	};

	for (let i = 0; i < lines.length;) {
		const line = lines[i]!;

		const open = FENCE.exec(line);
		if (open) {
			flush();
			const body: string[] = [];
			for (i++; i < lines.length && !FENCE.test(lines[i]!); i++) body.push(lines[i]!);
			i++;                                    // the closing fence, where the turn had one
			out.push({ kind: 'fence', lang: open[1] ?? '', text: body.join('\n') });
			continue;
		}

		const head = HEAD.exec(line);
		if (head) {
			flush();
			out.push({ kind: 'head', level: head[1]!.length, spans: spans(head[2] ?? '', baseDir) });
			i++;
			continue;
		}

		// A table is two lines or it is prose: the header alone is a sentence with pipes in it.
		if (isRow(line) && RULE.test(lines[i + 1] ?? '')) {
			flush();
			const rows: Span[][][] = [];
			for (i += 2; isRow(lines[i]); i++) rows.push(cells(lines[i]!, baseDir));
			out.push({ kind: 'table', head: cells(line, baseDir), rows });
			continue;
		}

		const item = ITEM.exec(line);
		if (item) {
			flush();
			const ordered = item[2] !== undefined;
			const raw: string[] = [];
			// A wrapped item's continuation belongs to the item, so it is joined onto it rather than
			// opening a paragraph in the middle of the list.
			for (; i < lines.length; i++) {
				const next = ITEM.exec(lines[i]!);
				if (next) {
					if ((next[2] !== undefined) !== ordered) break;
					raw.push(next[3] ?? '');
					continue;
				}
				if (lines[i]!.trim() === '' || raw.length === 0) break;
				raw[raw.length - 1] += ` ${lines[i]!.trim()}`;
			}
			out.push({ kind: 'list', ordered, items: raw.map(t => spans(t, baseDir)) });
			continue;
		}

		if (line.trim() === '') { flush(); i++; continue; }
		held.push(line);
		i++;
	}
	flush();
	return out;
}

type Item = { kind: 'text'; text: string } | { kind: 'act'; tool: string; head: string };

/** One turn, closed: text runs become prose (fences and all), activity stays one line each. */
function turn(key: number, role: 'user' | 'assistant', when: number | null, items: Item[], baseDir: string): ChatTurn {
	const blocks: ChatBlock[] = [];
	let run: string[] = [];
	let acts = 0, folded = 0;
	const flush = () => { if (run.length) { blocks.push(...blocksOf(run.join('\n'), baseDir)); run = []; } };
	for (const it of items) {
		if (it.kind === 'text') { run.push(it.text); continue; }
		flush();
		if (acts >= LIMITS.acts) { folded++; continue; }
		acts++;
		blocks.push({ kind: 'act', tool: it.tool, head: it.head });
	}
	flush();
	return { key, role, at: when, blocks, folded };
}

/**
 * A window of transcript, read as turns.
 *
 * The grouping rule is the harness's own shape: **one assistant record is one content block**, so a
 * turn is the run of assistant records between two user turns. A `user` record whose content is an
 * *array* is a tool result — the `tool_use` line above it already said what ran, and printing both
 * would be the transcript quoting itself.
 *
 * Sidechains are a subagent's own conversation and are excluded: this is one view of one session,
 * and a spawned agent's transcript is its own target to hotswap to.
 */
/**
 * What one record is, for turn-grouping — the **one** reading of that question in this file, so the
 * window and the minimap's index can never disagree about where a turn begins (C16 §6).
 *
 * A `user` record whose content is an array is a tool result: the `tool_use` line above it already
 * said what ran. A sidechain is a subagent's own conversation and is its own target to hotswap to.
 */
type Opens = 'user' | 'assistant' | null;

function opensWith(r: Rec): Opens {
	if (r['isSidechain'] === true) return null;
	const content = (r['message'] as Rec | undefined)?.['content'];
	if (r['type'] === 'user') return typeof content === 'string' && r['isMeta'] !== true ? 'user' : null;
	if (r['type'] !== 'assistant') return null;
	return Array.isArray(content) ? 'assistant' : null;
}

export function turnsOf(w: Window, baseDir: string): ChatTurn[] {
	const out: ChatTurn[] = [];
	let items: Item[] = [];
	let key = 0, when: number | null = null;
	const close = () => { if (items.length) out.push(turn(key, 'assistant', when, items, baseDir)); items = []; };

	let off = w.from;
	for (const line of w.text.split('\n')) {
		const start = off;
		off += bytesOf(line) + 1;
		if (line.trim() === '') continue;
		let r: Rec;
		try { r = JSON.parse(line) as Rec; } catch { continue; }
		const opens = opensWith(r);
		if (opens === null) continue;

		if (opens === 'user') {
			close();
			out.push(turn(start, 'user', at(r), [{ kind: 'text', text: String((r['message'] as Rec)['content']) }], baseDir));
			continue;
		}

		if (items.length === 0) { key = start; when = at(r); }
		for (const raw of (r['message'] as Rec)['content'] as unknown[]) {
			const b = raw as Rec;
			if (b['type'] === 'text' && typeof b['text'] === 'string') items.push({ kind: 'text', text: b['text'] });
			else if (b['type'] === 'thinking' && typeof b['thinking'] === 'string') items.push({ kind: 'act', tool: 'thinking', head: clip(b['thinking']) });
			else if (b['type'] === 'tool_use') items.push({ kind: 'act', tool: typeof b['name'] === 'string' ? b['name'] : 'tool', head: headOf(b['input']) });
		}
	}
	close();
	// Every turn the window held. The limit on what the browser is asked to lay out is the caller's
	// (`chatView`), because only the caller can then say — in `from` — that it bit.
	return out;
}

// ---------- the minimap's index: one mark per turn, for the WHOLE transcript (C16 §6) ----------

/**
 * The turn index of a transcript, **grown incrementally**.
 *
 * The minimap's whole point is that the loaded window is a keyhole, so its marks have to span the
 * file — and a full re-parse of a two-megabyte transcript on a three-second poll is a price nobody
 * agreed to. A transcript is append-only, so the index is too: the scan resumes at the last complete
 * line it read and the marks it already holds are never re-derived. A file that shrank was replaced,
 * and the index for it is thrown away rather than patched.
 */
type Index = { scanned: number; open: boolean; marks: ChatMark[] };

const indexes = new Map<string, Index>();
/** Everything has a limit: how many transcripts the index remembers at once. */
const INDEXED = 8;

export function indexOf(path: string): ChatMark[] {
	let size: number;
	try { size = statSync(path).size; }
	catch { return []; }

	let held = indexes.get(path);
	if (held === undefined || held.scanned > size) {
		held = { scanned: 0, open: false, marks: [] };
		if (indexes.size >= INDEXED) indexes.delete(indexes.keys().next().value!);
		indexes.set(path, held);
	}

	while (held.scanned < size) {
		const chunk = readFrom(path, held.scanned, Math.min(size - held.scanned, LIMITS.indexBytes));
		if (chunk === '') break;
		let off = held.scanned;
		const lines = chunk.split('\n');
		// The last element is either the empty string after a final newline or a partial line: either
		// way it is not scanned, and the next pass starts at it.
		const whole = lines.slice(0, -1);
		for (const line of whole) {
			const start = off;
			off += bytesOf(line) + 1;
			if (line.trim() === '') continue;
			let r: Rec;
			try { r = JSON.parse(line) as Rec; } catch { continue; }
			const opens = opensWith(r);
			if (opens === null) continue;
			if (opens === 'user') { held.marks.push({ key: start, role: 'user' }); held.open = false; continue; }
			if (!held.open) { held.marks.push({ key: start, role: 'assistant' }); held.open = true; }
		}
		if (off === held.scanned) break;              // one line longer than the chunk: stop, do not spin
		held.scanned = off;
	}
	return held.marks;
}

/**
 * The marks a strip can actually distinguish, **evenly spaced across the whole file** — so the first
 * and the last turn always have a mark and every mark still points at a real turn's key. Taking the
 * tail instead would be a minimap of the end of the file, which is the window the reader already has.
 */
export function sample(marks: readonly ChatMark[], cap: number = LIMITS.marks): ChatMark[] {
	if (marks.length <= cap) return [...marks];
	const out: ChatMark[] = [];
	for (let i = 0; i < cap; i++) out.push(marks[Math.round((i * (marks.length - 1)) / (cap - 1))]!);
	return out;
}

// ---------- the drafts: one file per target under `desk/drafts/` (D17, D18 class 3) ----------

export const draftFile = (sid: string) => join(draftsDir(), `${sid}.md`);

export const readDraft = (sid: string): string => {
	try { return readFileSync(draftFile(sid), 'utf8'); }
	catch { return ''; }                              // no file is no draft, which is the common case
};

/** An emptied draft removes its file: a `desk/` full of blank notes is a desk nobody opens. */
export function writeDraft(sid: string, text: string): Outcome<{ path: string; bytes: number }> {
	if (!SID.test(sid)) return fail(`sid must be a session id — got "${sid}"`);
	if (bytesOf(text) > LIMITS.draftBytes) return fail(`draft exceeds ${LIMITS.draftBytes} bytes`);
	const path = draftFile(sid);
	try {
		if (text === '') { rmSync(path, { force: true }); return { ok: true, result: { path, bytes: 0 } }; }
		mkdirSync(draftsDir(), { recursive: true });
		writeFileSync(path, text);
	}
	catch (e) { return fail(`cannot write ${path}: ${(e as Error).message}`); }
	return { ok: true, result: { path, bytes: bytesOf(text) } };
}

// ---------- the view ----------

const noView = (sid: string, error: string): ChatView => ({
	sid, target: null, error, turns: [], from: 0, bytes: 0, doc: cityRoot(), draft: '',
	send: { can: false, mode: null, why: error }, marks: [], turnCount: 0,
});

/**
 * How much of a transcript to read — **the tail, or the whole thing** (B23 §2).
 *
 * Two cases, not four. The pager retired with the windowed model: *"the scroll view should show the
 * entire chat & the minimap jumps to its location in the scrollview (not go back in time)"* (Felix,
 * 2026-08-30). So the poll carries the tail, because that is where news arrives, and one gesture
 * reads the file whole, because that is what his hands scroll through. `before` (the scroll-up) and
 * `around` (B21's jump) are gone: a jump into a transcript that is entirely loaded is a scroll, and
 * a window before a window is a keyhole nobody asked for.
 */
export type Where = { kind: 'tail' } | { kind: 'whole' };

export const TAIL: Where = { kind: 'tail' };
export const WHOLE: Where = { kind: 'whole' };

/**
 * Whether this deck may send, and how — decided **here**, where the census, the credential and the
 * filesystem are. The client draws no send control at all when `can` is false (D10: ambiguity never
 * arms, and neither does a target the glass cannot reach); the reason is what it draws instead.
 */
/**
 * The engine road's own gate (C16 §2). Every refusal here is a fact the run log states — the compat
 * law, the summon mark, the step's state — and the words are the console's own where the console
 * has them, so the deck and the console can never disagree about what a step will take.
 */
function sendableStep(step: ChatStep): ChatSend {
	if (step.refusal !== null) return { can: false, mode: null, why: `read-only — ${step.refusal}` };
	if (step.summoned) return { can: false, mode: null, why: `${step.run}/${step.step} is summoned — it is in a human's hands, and it comes back with the console's \`return\`, never a reply from here` };
	if (step.at !== 'paused') return { can: false, mode: null, why: `the engine holds ${step.run}/${step.step} at ${step.at} — only a paused step takes a ruling` };
	if (step.causes.includes('card')) return { can: false, mode: null, why: `${step.run}/${step.step} is a card: it is your own step and has no session to resume` };
	return { can: true, mode: 'engine', why: `through the engine's own resume into ${step.run}/${step.step} — the same session, headless, exactly what the console's \`send\` does; the run log is re-read after` };
}

export function sendable(t: Located, armed: boolean, note: string): ChatSend {
	if (!armed) return { can: false, mode: null, why: `hands disabled — ${note}` };
	if (t.transcript === null) return { can: false, mode: null, why: 'no transcript for this session — a delivery that cannot be verified is not a delivery (P6 §T)' };
	// The engine's step outranks the census's word: a step it is holding is resumed by the engine, and
	// a cmux resume alongside it would be a second writer on one session (single-writer physics).
	if (t.step !== null) return sendableStep(t.step);
	if (t.state !== 'dead')
		return t.ws
			? { can: true, mode: 'live', why: 'into the live pane, as one user turn — segmented paste, then the transcript is read back (P6 §T)' }
			: { can: false, mode: null, why: 'live, but in no cmux workspace (hooks are venue-blind) — there is no pane to deliver into' };
	if (t.account === null) return { can: false, mode: null, why: 'no account on record — nothing to resume it under' };
	if (t.cwd === null) return { can: false, mode: null, why: 'no cwd on record — nowhere to resume it' };
	if (!existsSync(t.cwd)) return { can: false, mode: null, why: `its directory is gone: ${t.cwd}` };
	return { can: true, mode: 'resume', why: 'dead — the resume carries your words as its first new turn, in its own session and its own transcript (P6 Q3)' };
}

/**
 * What a view needs to know about the world. It is a **parameter** because the deck's poll has
 * already read all three by the time it composes the Chat, and re-reading the census there would
 * double the most expensive read on the poll path for nothing (B14 F8's own accounting).
 */
export type World = { rig: Rig; census: CensusRead; buildings: Building[]; steps: Map<string, LocatedStep> };

export const readWorld = (): World => {
	const buildings = city().buildings;
	return { rig: readRig(), census: readCensus(), buildings, steps: stepIndex(buildings) };
};

/** One target, read — the poll's tail, or the whole transcript on the gesture that opens it. */
export function chatView(sid: string, where: Where, armed: boolean, note: string, world: World = readWorld()): ChatView {
	if (!SID.test(sid)) return noView(sid, `not a session id: "${sid}"`);
	const { rig, census, buildings, steps } = world;
	const t = locate(sid, rig, census, buildings, steps);
	if (!t) return noView(sid, `no session ${sid} — neither the census nor the three transcript trees know it`);

	const { configDir: _drop, ...target } = t;
	const doc = buildings.find(b => b.building === t.building)?.path ?? t.cwd ?? cityRoot();
	const bytes = t.transcript === null ? 0 : statSync(t.transcript).size;
	const whole = where.kind === 'whole';
	const w = t.transcript === null ? null : windowOf(t.transcript, whole ? LIMITS.whole : LIMITS.window);
	const all = w === null ? [] : turnsOf(w, t.cwd ?? doc);
	const turns = all.slice(-(whole ? LIMITS.wholeTurns : LIMITS.turns));
	const marks = t.transcript === null ? [] : indexOf(t.transcript);
	return {
		sid, target, error: null,
		turns,
		marks: sample(marks),
		turnCount: marks.length,
		// **Where the held conversation begins**, and the one number that says whether it is the whole
		// of it: `0` means the first turn on screen is the first turn of the file. Both limits report
		// through it — the bytes the read could take, and the turns the browser was asked for — so a
		// bounded read can never pass for the file.
		from: w === null ? 0 : turns.length < all.length ? turns[0]!.key : w.from,
		bytes,
		doc, draft: readDraft(sid),
		send: sendable(t, armed, note),
	};
}

/**
 * `GET /deck/chat?sid=` — **the whole transcript**, on the gesture that opens a target (B23 §2).
 *
 * It is a gesture route rather than the poll's job for the same reason it always was: the poll is
 * one shared timer with a shared budget (B13 F5), and a conversation is bytes Felix asked for once.
 * The poll keeps carrying the tail, so a turn arriving while he reads still arrives.
 */
export function chatQuery(q: URLSearchParams): ChatView {
	const cred = readCredential();
	return chatView(q.get('sid') ?? '', WHOLE, cred.ok, cred.ok ? 'armed' : cred.error);
}

// ---------- the send: P6's transport law, consumed verbatim ----------

export type Message = { sid: string; text: string };

/**
 * The parse boundary. Below it nothing re-checks anything — and one thing is checked here that the
 * pure `refusals()` cannot: **the message must survive sanitizing unchanged**.
 *
 * `sanitizeSummons` expands tabs and strips control bytes, and both hands already use it. Letting it
 * run silently would mean the glass rewriting Felix's bytes to make its own sha match, which is
 * precisely what P6 F3 forbids. So a message it would touch is refused by name instead, and the
 * bytes sent are always exactly the bytes he typed.
 */
export function parseMessage(raw: unknown): Outcome<Message> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	const r = raw as Record<string, unknown>;
	const sid = field(r, 'sid');
	if (!SID.test(sid)) return fail(`sid must be a session id — got "${sid}"`);
	const text = field(r, 'text');
	const bad = refusals(text);
	if (bad.length) return fail(`refused at compose — ${bad.map(b => `${b.code}: ${b.text}`).join(' · ')}`);
	if (sanitizeSummons(text) !== text)
		return fail('refused at compose — control: the message carries bytes the transport rewrites (a CR, or a control character). The deck will not silently edit what you typed.');
	return { ok: true, result: { sid, text } };
}

/**
 * What the TUI's input box currently holds, off a `read-screen` (P6 Q4-F5's precheck).
 *
 * The caret is `❯` and it is not always at the start of the line: cmux hands back the pane's whole
 * screen, borders included, so the read is *everything after the last caret*, minus the box-drawing
 * run that closes the frame. ASCII `|` is deliberately **not** stripped — a message ending in a pipe
 * is a message, and reading it as an empty box is how the transport appends to Felix's half-draft.
 */
export const boxOf = (screen: string): string => {
	const line = screen.split('\n').filter(l => l.includes('❯')).at(-1);
	if (line === undefined) return '';
	return line.slice(line.lastIndexOf('❯') + 1).replace(/[─-╿\s]+$/u, '').trim();
};

/**
 * **The segmented paste** (P6 §T), lifted verbatim. Every clause is load-bearing and each was
 * measured: `paste-buffer` rewrites LF to CR (T2) so a newline may never travel as text;
 * `set-buffer` trims its own edges (T3) so an indent may never sit at a buffer edge; `send` does
 * not trim and cannot mangle a whitespace run (T3); `alt+enter` is the only newline key the TUI
 * honours — `ctrl+j`, a real 0x0a, is silently dropped (T4).
 *
 * Enter is **not** pressed here. A delivery that died half-way leaves a partial message in the box,
 * and submitting it would be exactly the truncated-message-that-looks-delivered P6 was cut to
 * prevent — so the caller submits only after every segment landed.
 */
export async function deliver(ws: string, text: string, password: string): Promise<Outcome<number>> {
	const lines = text.split('\n');
	let calls = 0;
	const send = async (...args: string[]): Promise<Outcome<string>> => { calls++; return cmux(password, LIMITS.callMs, ...args); };
	for (const [i, line] of lines.entries()) {
		if (i > 0) {
			const nl = await send('send-key', '--workspace', ws, '--', 'alt+enter');
			if (!nl.ok) return fail(`delivery stopped at line ${i + 1} of ${lines.length}: ${nl.error}`);
		}
		if (line === '') continue;
		const lead = line.match(/^\s*/)![0];
		const rest = line.slice(lead.length);
		const trail = rest.match(/\s*$/)![0];
		const core = rest.slice(0, rest.length - trail.length);
		if (lead) {
			const l = await send('send', '--workspace', ws, '--', lead);
			if (!l.ok) return fail(`delivery stopped in line ${i + 1}'s indent: ${l.error}`);
		}
		if (core) {
			const b = await send('set-buffer', '--name', 'belvedere-chat', '--', core);
			if (!b.ok) return fail(`delivery stopped buffering line ${i + 1}: ${b.error}`);
			const p = await send('paste-buffer', '--name', 'belvedere-chat', '--workspace', ws);
			if (!p.ok) return fail(`delivery stopped pasting line ${i + 1}: ${p.error}`);
		}
		if (trail) {
			const t = await send('send', '--workspace', ws, '--', trail);
			if (!t.ok) return fail(`delivery stopped in line ${i + 1}'s trailing space: ${t.error}`);
		}
	}
	return { ok: true, result: calls };
}

/**
 * The bytes a file has grown by since `from` — which is a **known line boundary** (it was the file's
 * size before the send), so nothing is trimmed off the head.
 *
 * `windowOf` cannot answer this: it reads *backwards* and drops its own first line as a possible
 * partial, which would silently eat the very turn the verification is looking for. Measured by the
 * suite before it was ever measured by a probe.
 */
function readFrom(path: string, from: number, cap: number): string {
	let fd: number;
	try { fd = openSync(path, 'r'); } catch { return ''; }
	try {
		const size = statSync(path).size;
		if (size <= from) return '';
		const buf = Buffer.alloc(Math.min(size - from, cap));
		readSync(fd, buf, 0, buf.length, from);
		return buf.toString('utf8');
	}
	catch { return ''; }
	finally { closeSync(fd); }
}

/**
 * Every **string** user turn appended after `from`. A `user` record whose content is an array is a
 * tool result, and counting one would report a delivery that never happened — which is the single
 * failure the whole verification read exists to prevent.
 */
export function turnsAfter(path: string, from: number): string[] {
	const out: string[] = [];
	for (const line of readFrom(path, from, LIMITS.appended).split('\n')) {
		if (line.trim() === '') continue;
		let r: Rec;
		try { r = JSON.parse(line) as Rec; } catch { continue; }
		if (r['type'] !== 'user' || r['isSidechain'] === true || r['isMeta'] === true) continue;
		const content = (r['message'] as Rec | undefined)?.['content'];
		if (typeof content === 'string') out.push(content);
	}
	return out;
}

/**
 * **The verification read** (P6 §T), mandatory and not optional. Poll the transcript until it holds
 * one more string user turn than it did, then compare shas.
 *
 * Three outcomes are failures and each says which: no new turn inside the budget, **more than one**
 * new turn, and a turn whose bytes are not the bytes that were sent. None is ever retried
 * automatically — the message may have half-landed, and a second delivery over a first one is how a
 * conversation gets a sentence twice.
 */
export async function verify(path: string, from: number, sent: string, deadline: number): Promise<Outcome<string>> {
	const want = sha256(sent);
	for (;;) {
		const turns = turnsAfter(path, from);
		if (turns.length > 1)
			return fail(`unverified: ${turns.length} user turns arrived where one was sent — the message may have half-landed, and nothing here retries (P6 §T)`);
		if (turns.length === 1) {
			const got = sha256(turns[0]!);
			return got === want ? { ok: true, result: got }
				: fail(`corrupted: sent ${bytesOf(sent)} B sha ${want.slice(0, 16)}…, the transcript's turn is ${bytesOf(turns[0]!)} B sha ${got.slice(0, 16)}…`);
		}
		if (Date.now() >= deadline)
			return fail(`unverified: no new user turn in the transcript within ${Math.round(LIMITS.verifyMs / 1000)} s — nothing is reported delivered without the read (P6 §T)`);
		await sleep(LIMITS.pollMs);
	}
}

export type Sent = {
	mode: 'live' | 'resume' | 'engine';
	sha: string; bytes: number; turns: number; ms: number; workspace: string | null;
	/** The engine road only: what the run log says about the step once the words are on disk. */
	step: { run: string; id: string; at: string; why: string } | null;
};

/** One target, one send at a time. A second POST over a delivery in flight is the split it forbids. */
const sending = new Set<string>();

export async function sendMessage(req: Message, password: string): Promise<Outcome<Sent>> {
	if (sending.has(req.sid)) return fail('a send to this session is already in flight — one delivery at a time (P6 §T: a message that half-landed is never re-sent over)');
	sending.add(req.sid);
	try {
		const out = await attemptSend(req, password);
		// sha + bytes, never the text — the audit's law since B4 (`hands.ts` §audit).
		audit('message', { sid: req.sid, bytes: bytesOf(req.text), sha: sha256(req.text).slice(0, 16) }, out);
		return out;
	}
	finally { sending.delete(req.sid); }
}

async function attemptSend(req: Message, password: string): Promise<Outcome<Sent>> {
	const t0 = performance.now();
	const rig = readRig();
	const t = locate(req.sid, rig, readCensus(), city().buildings);
	if (!t) return fail(`no session ${req.sid} — neither the census nor the three transcript trees know it`);
	const can = sendable(t, true, 'armed');
	if (!can.can || t.transcript === null) return fail(can.why);

	const from = statSync(t.transcript).size;
	const deadline = Date.now() + LIMITS.verifyMs;

	if (can.mode === 'engine') return await resumeStep(t.step!, t.transcript, req.text, from, deadline, t0);

	if (can.mode === 'live') {
		// Address by UUID, always (P6 F2): a `workspace:N` ref that no longer resolves is not an error
		// to cmux — it delivers to whatever Felix is looking at. The census's `ws` is a uuid, and this
		// read is what proves it still exists *and* that the box is empty, in one round trip.
		const screen = await cmux(password, LIMITS.callMs, 'read-screen', '--workspace', t.ws!);
		if (!screen.ok) return fail(`workspace-gone: the pane this session heartbeated from does not answer — ${screen.error}`);
		const box = boxOf(screen.result);
		if (box !== '')
			return fail(`box-not-empty: the pane's input box already holds "${clip(box, 60)}". The transport appends, it never replaces, and there is no key that clears it safely (P6 Q4-F5).`);

		const put = await deliver(t.ws!, req.text, password);
		if (!put.ok) return fail(`${put.error} — Enter was NOT pressed; a partial message is sitting in the pane's box for you to clear.`);
		const enter = await cmux(password, LIMITS.callMs, 'send-key', '--workspace', t.ws!, '--', 'enter');
		if (!enter.ok) return fail(`the message is in the box and the submit failed: ${enter.error}`);

		const seen = await verify(t.transcript, from, req.text, deadline);
		return seen.ok
			? { ok: true, result: { mode: 'live', sha: seen.result, bytes: bytesOf(req.text), turns: 1, ms: Math.round(performance.now() - t0), workspace: t.ws, step: null } }
			: seen;
	}

	// The dead target: a resume that carries the turn (P6 Q3, PASS ×5) — the same hand, the same
	// audit, the same byte-exact first-turn proof, and the session keeps its id and its transcript.
	// B5 E2 is extended, not violated: Belvedere omits what it does not know, and it knows the words.
	const ignited = await ignite({
		account: t.account!, stamp: '', cwd: t.cwd!, model: '', effort: '',
		color: colourOf(rig, mantleOf(rig, t.stamp)), summons: req.text, resume: req.sid,
		// No home on a resume (B22 §placement): building-homed placement lands a *new* session in
		// the workspace Felix keeps for a building, and this is a dead session coming back on its
		// own transcript. It mints its own workspace, exactly as it did before B22.
		building: '',
	}, password);
	if (!ignited.ok) return ignited;

	const seen = await verify(t.transcript, from, req.text, deadline);
	return seen.ok
		? { ok: true, result: { mode: 'resume', sha: seen.result, bytes: bytesOf(req.text), turns: 1, ms: Math.round(performance.now() - t0), workspace: ignited.result.workspace, step: null } }
		: fail(`${seen.error} (the resume itself succeeded into ${ignited.result.workspace})`);
}

// ---------- the engine road: a reply into a step the engine is holding (C16 §2) ----------

/**
 * The console's `send`, in the glass.
 *
 * `rule(resume)` is the engine's own seam and everything it refuses it refuses **here** in its own
 * words — a step that is not paused, a session it never had, a ceiling that is spent. What this adds
 * over the console is B16's law: the ruling is not the receipt. `rule()` awaits the whole turn, and
 * a real turn runs for minutes; **delivered** means the words are in the transcript, which happens
 * in the first moments of the turn. So the ruling is raced against a short grace — long enough for
 * every refusal, which are all decided before a subject spawns — and then the verification read
 * decides, exactly as it does on P6's road. The turn goes on in the background; the run log is where
 * its outcome lands, and the poll re-reads it.
 *
 * **The deck never writes into a run dir.** `openRun()` materializes a `flow.json` from the log's own
 * bytes where none sits beside it, which is right for the console and outside this building's fence
 * (README §2's write list), so a run without one is refused by name and ruled from the console.
 */
async function resumeStep(step: ChatStep, transcript: string, text: string, from: number, deadline: number, t0: number): Promise<Outcome<Sent>> {
	const root = runsRoot();
	const handle = readRun(`${root}/${step.run}`, root);
	if (isRefusal(handle)) return fail(handle.refusal);

	const flowPath = `${handle.dir}/flow.json`;
	if (!existsSync(flowPath))
		return fail(`${handle.name} keeps no flow.json beside its log. The console writes one from the log's own bytes when it opens a run; the deck writes nothing into a run dir (README §2), so rule this step from the console.`);

	const run = load(flowPath, { runDir: handle.dir, venue: handle.venue });
	if (isRefusal(run)) return fail(run.refusal);

	const ruling = run.rule(step.step, { do: 'resume', turn: text });
	const early = await Promise.race([ruling, sleep(LIMITS.ruleMs).then(() => PENDING)]);
	if (early !== PENDING && isRefusal(early)) return fail(`the engine refused the ruling: ${early.refusal}`);
	// A turn that outlives the grace finishes on its own; its verdict is an event in the run log, and
	// the audit records that it settled at all — never swallowed (directive 3.3).
	if (early === PENDING) void ruling.then(r => audit('turn', { run: handle.name, step: step.step }, isRefusal(r) ? fail(r.refusal) : { ok: true, result: after(handle.dir, step.step) }));

	const seen = await verify(transcript, from, text, deadline);
	if (!seen.ok) return seen;
	const now = after(handle.dir, step.step);
	return { ok: true, result: {
		mode: 'engine', sha: seen.result, bytes: bytesOf(text), turns: 1,
		ms: Math.round(performance.now() - t0), workspace: null,
		step: { run: handle.name, id: step.step, at: now.at, why: now.why },
	} };
}

/** A sentinel the race can compare by identity — `null` is a value `rule()` could plausibly answer. */
const PENDING = Symbol('the turn is still in flight');

/** What the run log says about one step, re-read from disk — the only source of a step's state. */
function after(dir: string, id: string): { at: string; why: string } {
	const handle = readRun(dir, runsRoot());
	if (isRefusal(handle)) return { at: 'unreadable', why: handle.refusal };
	const at = handle.state.steps[id];
	if (at === undefined) return { at: 'unknown', why: `the log no longer names step ${id}` };
	return {
		at: at.at,
		why: at.at === 'paused' ? `${at.causes.join(', ')} — ${at.detail}`
			: at.at === 'landed' ? at.report?.cause ?? 'landed'
			: at.at === 'killed' ? at.reason
			: '',
	};
}

// ---------- the route ----------

/**
 * `POST /chat/{send,draft}`.
 *
 * **The two halves sit on opposite sides of the arming switch, deliberately** (B6 F3's law): a send
 * is a socket write and goes cold with the credential; a draft is a file write under `desk/`, and
 * cold hands must never cost Felix the ability to write something down.
 */
export async function chatRoute(req: Request, action: string): Promise<Response> {
	if (req.method !== 'POST') return json({ ok: false, error: 'the chat routes are POST-only' }, 405);
	let body: unknown;
	try { body = JSON.parse((await req.text()) || 'null'); }
	catch (e) { return json({ ok: false, error: `body is not JSON: ${(e as Error).message}` }, 400); }

	if (action === 'draft') {
		const r = (body ?? {}) as Record<string, unknown>;
		const out = writeDraft(field(r, 'sid'), field(r, 'text'));
		return json(out, out.ok ? 200 : 409);
	}
	if (action === 'send') {
		const cred = readCredential();
		if (!cred.ok) return json({ ok: false, error: `hands disabled — ${cred.error}` }, 503);
		const parsed = parseMessage(body);
		if (!parsed.ok) return json(parsed, 400);
		const out = await sendMessage(parsed.result, cred.result);
		return json(out, out.ok ? 200 : 409);
	}
	return json({ ok: false, error: `no such chat action: ${action} — send, draft` }, 404);
}
