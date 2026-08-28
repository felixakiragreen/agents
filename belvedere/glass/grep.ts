/**
 * The Grep (B21) — **everything the city writes, searched**, and every hit jumpable.
 *
 * *"What was that session where I was talking about 'bob summons'?"* is one keystroke, one query and
 * one click (keel §3, as amended mid-batch-5). Three corpora and no fourth: the **sessions** (every
 * transcript under all three accounts), the **docs** (the register's own doctrine files, `plans/`
 * included — the walk already knows them), and the **desk**. Census and audit telemetry are outside
 * it deliberately: noise, and gitignored truth-less by law.
 *
 * **A read, and only a read.** Nothing in this file writes, and nothing here reaches a socket: the
 * fence gains no write class (README §2). It sits in front of the arming switch for the same reason
 * the inbox and the desk do — cold hands must never cost Felix the ability to find something.
 *
 * **Everything is bounded, and every bound is reported** (directive 3.1): a per-kind hit cap, a
 * corpus cap, a file-size bar, a per-file match cap, a line-length bar and one wall clock over the
 * whole query. A capped result set *says* it was capped — a search that quietly stops at fifty is a
 * search that lies about the city.
 *
 * **No index.** `rg` over this corpus is 0.2 s warm and the premature-optimisation law says measure
 * first; where `rg` is not on PATH the fallback is a bounded `grep`, slower and **named as such in
 * the UI** rather than pretended away.
 */

import { closeSync, openSync, readSync, statSync } from 'fs';
import { basename } from 'path';
import { identify, readCensus, type CensusRead } from './census';
import { GREP_KINDS, type GrepAnswer, type GrepGroup, type GrepHit, type GrepKind } from './deck-model';
import { listNotes, noteFile } from './desk';
import { short } from './html';
import { buildingOf } from './pages';
import { deskDir } from './paths';
import { register, type Entry } from './register';
import { readRig, type Rig } from './rig';
import { transcriptsOf } from './shelf';

/**
 * Everything has a limit, and here the limits are the whole design.
 *
 *  - `perKind` — hits rendered per group. Fifty is a drawer, five hundred is a file.
 *  - `perFile` — matches the engine may report from one file, so one chatty transcript cannot fill
 *    the answer on its own.
 *  - `files` — the corpus cap per kind; the newest survive it and the cut is reported.
 *  - `fileBytes` — a file bigger than this is skipped rather than read (the size bar, spec §2).
 *  - `lineBytes` — one jsonl record can be a megabyte; a line past this is dropped, not buffered.
 *  - `clip` — characters of a hit line the drawer draws, centred on the term.
 */
export const LIMITS = {
	perKind: 50, perFile: 3, files: 4000,
	fileBytes: 20 << 20, lineBytes: 256 << 10, clip: 200,
	term: { min: 2, max: 200 }, output: 8 << 20, timeoutMs: 3000,
} as const;

/**
 * The wall clock over one query, and the engine's own name. Both are **functions** for the reason
 * `paths.ts` gives: an anchor the environment can move is a function — and both are how a DoD run
 * induces the two failures that cannot be induced by asking nicely (a timeout, and an absent `rg`).
 */
export const timeoutMs = (): number => {
	const raw = Number(process.env['GREP_TIMEOUT_MS']);
	return Number.isFinite(raw) && raw > 0 ? raw : LIMITS.timeoutMs;
};

export const rgName = (): string => process.env['GREP_RG'] ?? 'rg';

/** Spec §5, named here so it is on the page rather than discovered the hard way. */
export const TRANSCRIPT_NOTE =
	'Sessions are searched as raw JSONL: plain words and phrases match verbatim, but a phrase whose '
	+ 'quotes or newlines are escaped in the file may not — if a phrase with punctuation finds nothing, try the words.';

/**
 * **Case-smart**, asserted rather than assumed: a term written entirely in lower case asks for
 * either case; a term carrying a capital means it. This is `rg --smart-case`'s own rule, spelled out
 * here because the `grep` fallback has no such flag and the two engines must agree.
 */
export const insensitiveFor = (term: string): boolean => term === term.toLowerCase();

// ---------- the corpus ----------

export type Candidate = { path: string; bytes: number; at: number };
export type Corpus = { files: Candidate[]; skipped: number; capped: boolean };

/**
 * One kind's files, sized and dated in one pass. The stat is not overhead: it is the size bar, the
 * corpus cap's sort key and every hit's clock, all bought once.
 */
export function sized(paths: readonly string[]): Corpus {
	const files: Candidate[] = [];
	let skipped = 0;
	for (const path of paths) {
		try {
			const st = statSync(path);
			if (!st.isFile()) continue;
			if (st.size > LIMITS.fileBytes) { skipped++; continue; }
			files.push({ path, bytes: st.size, at: st.mtimeMs / 1000 });
		}
		catch { continue; }                       // a file the filesystem refuses is not in the corpus today
	}
	files.sort((a, b) => b.at - a.at);            // the newest survive the cap, because they are what he means
	return { files: files.slice(0, LIMITS.files), skipped, capped: files.length > LIMITS.files };
}

/** Every doc file the register holds, and which building each one belongs to. */
export function docFiles(entries: readonly Entry[]): { paths: string[]; owner: Map<string, Entry> } {
	const owner = new Map<string, Entry>();
	for (const e of entries)
		for (const p of [...e.files.boards, ...e.files.workDocs, e.files.ledger, e.files.decisions, e.files.issues])
			if (p && !owner.has(p)) owner.set(p, e);
	return { paths: [...owner.keys()], owner };
}

// ---------- the engines ----------

export type Raw = { path: string; line: number; offset: number | null; text: string };

/**
 * Lines out of a stream, bounded. A single JSON record longer than `lineBytes` is **dropped and
 * resynced past**, never accumulated — a search must not be able to allocate a transcript.
 */
async function* streamLines(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let held = '';
	let skipping = false;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = decoder.decode(value, { stream: true });
			let start = 0;
			for (;;) {
				const nl = chunk.indexOf('\n', start);
				if (nl < 0) break;
				const line = held + chunk.slice(start, nl);
				held = '';
				start = nl + 1;
				// The tail of a dropped over-long line is not a line: skip exactly one and resync.
				if (skipping) { skipping = false; continue; }
				yield line;
			}
			held += chunk.slice(start);
			if (held.length > LIMITS.lineBytes) { held = ''; skipping = true; }
		}
		if (held !== '' && !skipping) yield held;
	}
	finally { reader.releaseLock(); }
}

type Run = { raw: Raw[]; capped: boolean; timedOut: boolean; error: string | null };

/**
 * One engine, run over one file list. The process is **killed the moment the cap is reached** — the
 * corpus is 1.7 GB and there is no reason to read the rest of it once the drawer is full — and killed
 * again by the clock if it outlives its budget. Both are reported; neither is an error.
 */
async function spawnSearch(argv: string[], parse: (line: string) => Raw | null, cap: number): Promise<Run> {
	const raw: Raw[] = [];
	let capped = false, timedOut = false;
	let proc: ReturnType<typeof Bun.spawn>;
	try { proc = Bun.spawn(argv, { stdout: 'pipe', stderr: 'pipe' }); }
	catch (e) { return { raw, capped, timedOut, error: `${argv[0]} could not run: ${(e as Error).message}` }; }

	const timer = setTimeout(() => { timedOut = true; proc.kill(); }, timeoutMs());
	let bytes = 0;
	try {
		for await (const line of streamLines(proc.stdout as ReadableStream<Uint8Array>)) {
			bytes += line.length;
			const hit = parse(line);
			if (hit) raw.push(hit);
			if (raw.length >= cap || bytes > LIMITS.output) { capped = true; proc.kill(); break; }
		}
	}
	catch (e) { clearTimeout(timer); return { raw, capped, timedOut, error: (e as Error).message }; }
	clearTimeout(timer);

	// An exit code only means anything when nothing else stopped the process first: 1 is "no match".
	if (capped || timedOut) return { raw, capped, timedOut, error: null };
	const code = await proc.exited;
	if (code === 0 || code === 1) return { raw, capped, timedOut, error: null };
	const why = (await new Response(proc.stderr as ReadableStream<Uint8Array>).text()).trim().split('\n')[0] ?? '';
	return { raw, capped, timedOut, error: `${basename(argv[0] ?? 'search')} exited ${code}${why ? `: ${why.slice(0, 200)}` : ''}` };
}

/** `rg --json`, the documented machine interface: it carries the byte offset the Chat anchors on. */
type RgLine = {
	type: string;
	data?: { path?: { text?: string }; line_number?: number; absolute_offset?: number; lines?: { text?: string } };
};

const parseRg = (line: string): Raw | null => {
	let r: RgLine;
	try { r = JSON.parse(line) as RgLine; } catch { return null; }
	if (r.type !== 'match') return null;
	const path = r.data?.path?.text, text = r.data?.lines?.text;
	// `lines.bytes` instead of `lines.text` means the line is not valid UTF-8. It is skipped rather
	// than guessed at: a result row that renders mojibake is worse than one fewer result.
	if (typeof path !== 'string' || typeof text !== 'string') return null;
	return {
		path, line: r.data?.line_number ?? 0,
		offset: typeof r.data?.absolute_offset === 'number' ? r.data.absolute_offset : null,
		text: text.replace(/\r?\n$/, ''),
	};
};

/** `grep -n`: `path:line:text`. No byte offset — the session jump computes one, for its hits only. */
const parseGrep = (line: string): Raw | null => {
	const a = line.indexOf(':');
	if (a < 0) return null;
	const b = line.indexOf(':', a + 1);
	if (b < 0) return null;
	const n = Number(line.slice(a + 1, b));
	if (!Number.isInteger(n) || n <= 0) return null;
	return { path: line.slice(0, a), line: n, offset: null, text: line.slice(b + 1) };
};

/**
 * Whether `rg` is reachable at all. Resolved per query rather than once at import, so a glass that
 * was started before ripgrep was installed is not wrong about it forever — and so a DoD run can point
 * `GREP_RG` at a name nothing answers to and exercise the degraded path for real.
 */
export const rgAvailable = (): boolean => Bun.which(rgName()) !== null;

export const DEGRADED =
	'ripgrep is not on this glass\'s PATH — searching with grep instead: slower over the transcripts, '
	+ 'and a session hit\'s turn anchor is computed by re-reading the file rather than read off the match.';

async function search(files: readonly Candidate[], term: string, cap: number): Promise<Run> {
	if (files.length === 0) return { raw: [], capped: false, timedOut: false, error: null };
	const paths = files.map(f => f.path);
	const smart = insensitiveFor(term);
	if (rgAvailable())
		return await spawnSearch([
			rgName(), '--json', '--fixed-strings', '--no-config',
			smart ? '--ignore-case' : '--case-sensitive',
			'--max-count', String(LIMITS.perFile), '--', term, ...paths,
		], parseRg, cap);
	return await spawnSearch([
		'grep', '-n', '-H', '-a', '-F', '-m', String(LIMITS.perFile), ...(smart ? ['-i'] : []),
		'-e', term, '--', ...paths,
	], parseGrep, cap);
}

// ---------- the byte offset a `grep` hit does not carry ----------

/**
 * The byte offset of a 1-based line, by counting newlines. Paid **only for the session hits that are
 * rendered** (fifty at most) and only on the fallback path, because the Chat anchors on a byte offset
 * and a line number is not one.
 */
export function offsetOfLine(path: string, line: number): number | null {
	if (line <= 1) return 0;
	let fd: number;
	try { fd = openSync(path, 'r'); } catch { return null; }
	try {
		const buf = Buffer.alloc(64 << 10);
		let at = 0, seen = 1;
		for (;;) {
			const n = readSync(fd, buf, 0, buf.length, at);
			if (n <= 0) return null;
			for (let i = 0; i < n; i++) {
				if (buf[i] !== 0x0a) continue;
				if (++seen === line) return at + i + 1;
			}
			at += n;
		}
	}
	catch { return null; }
	finally { closeSync(fd); }
}

// ---------- the line, clipped and marked ----------

/** Case-smart find, in characters. A fold that changes the string's length cannot index the original. */
export function findTerm(text: string, term: string, insensitive: boolean): number {
	if (!insensitive) return text.indexOf(term);
	const lower = text.toLowerCase();
	return lower.length === text.length ? lower.indexOf(term.toLowerCase()) : -1;
}

/** A window of the line centred on the term, with `…` wherever bytes came off. */
export function clipAround(text: string, at: number, len: number): { text: string; mark: { at: number; len: number } | null } {
	const flat = text.replace(/\t/g, ' ');
	if (at < 0 || len <= 0) return { text: flat.slice(0, LIMITS.clip) + (flat.length > LIMITS.clip ? '…' : ''), mark: null };
	const room = Math.max(0, LIMITS.clip - len);
	const start = Math.max(0, at - Math.floor(room / 2));
	const end = Math.min(flat.length, start + len + room);
	const head = start > 0 ? '…' : '';
	const tail = end < flat.length ? '…' : '';
	return { text: head + flat.slice(start, end) + tail, mark: { at: head.length + (at - start), len } };
}

// ---------- the answer ----------

const group = (kind: GrepKind, corpus: Corpus, run: Run, hits: GrepHit[], ms: number): GrepGroup => ({
	kind, hits,
	// The engine was stopped because the drawer was full — the one bound a reader can see the effect
	// of without being told, so it is told.
	capped: run.capped,
	files: corpus.files.length, skipped: corpus.skipped, filesCapped: corpus.capped,
	timedOut: run.timedOut, error: run.error, ms: Math.round(ms),
});

const empty = (kind: GrepKind): GrepGroup =>
	({ kind, hits: [], capped: false, files: 0, skipped: 0, filesCapped: false, timedOut: false, error: null, ms: 0 });

/** What a hit's clipped line and mark are, for every kind — one rule, applied three times. */
const shown = (raw: Raw, term: string, insensitive: boolean) =>
	clipAround(raw.text, findTerm(raw.text, term, insensitive), term.length);

export type GrepWorld = { rig: Rig; census: CensusRead; entries: Entry[] };

export const readGrepWorld = (): GrepWorld =>
	({ rig: readRig(), census: readCensus(), entries: register().entries });

/**
 * The sessions. The name is the **birth** name the transcript wrote — the census where it is tracked,
 * a bounded head window where it is not (`census.ts` §identify, the same read the shelf pays) — and
 * the deck overlays cmux's live word client-side where its snapshot knows the session (D16: cmux is
 * truth, but a socket spawn on a keystroke is not what a query is for).
 */
async function sessions(term: string, world: GrepWorld): Promise<GrepGroup> {
	const t0 = performance.now();
	const found = new Map<string, { sid: string; account: string }>();
	for (const [configDir, account] of world.rig.accounts)
		for (const { sid, path } of transcriptsOf(configDir)) found.set(path, { sid, account });

	const corpus = sized([...found.keys()]);
	const run = await search(corpus.files, term, LIMITS.perKind);
	const insensitive = insensitiveFor(term);
	const dated = new Map(corpus.files.map(f => [f.path, f.at]));
	const buildings = world.entries;
	const named = new Map<string, { name: string; doc: string }>();

	const hits: GrepHit[] = [];
	for (const raw of run.raw.slice(0, LIMITS.perKind)) {
		const who = found.get(raw.path);
		if (!who) continue;
		let label = named.get(raw.path);
		if (!label) {
			const live = world.census.sessions.find(s => s.sid === who.sid);
			const id = live ? null : identify(raw.path);
			const cwd = live?.cwd ?? id?.cwd ?? null;
			label = {
				name: live?.stamp ?? id?.stamp ?? who.sid.slice(0, 8),
				doc: buildingOf(cwd, buildings)?.path ?? cwd ?? raw.path,
			};
			named.set(raw.path, label);
		}
		const { text, mark } = shown(raw, term, insensitive);
		hits.push({
			kind: 'sessions', key: `s:${who.sid}:${raw.line}`,
			name: label.name, where: `${who.account} · ${who.sid.slice(0, 8)}:${raw.line}`,
			at: dated.get(raw.path) ?? null, doc: label.doc, text, mark,
			jump: { to: 'session', sid: who.sid, anchor: raw.offset ?? offsetOfLine(raw.path, raw.line) },
		});
	}
	return group('sessions', corpus, run, hits, performance.now() - t0);
}

/** The docs: the register's own file list, so the corpus is exactly what the walk calls doctrine. */
async function docs(term: string, world: GrepWorld): Promise<GrepGroup> {
	const t0 = performance.now();
	const { paths, owner } = docFiles(world.entries);
	const corpus = sized(paths);
	const run = await search(corpus.files, term, LIMITS.perKind);
	const insensitive = insensitiveFor(term);
	const dated = new Map(corpus.files.map(f => [f.path, f.at]));

	const hits: GrepHit[] = [];
	for (const raw of run.raw.slice(0, LIMITS.perKind)) {
		const { text, mark } = shown(raw, term, insensitive);
		const label = short(raw.path);
		hits.push({
			kind: 'docs', key: `d:${raw.path}:${raw.line}`,
			name: label, where: `${label}:${raw.line}`,
			at: dated.get(raw.path) ?? null, doc: raw.path, text, mark,
			jump: { to: 'doc', building: owner.get(raw.path)?.building ?? null, path: raw.path, line: raw.line },
		});
	}
	return group('docs', corpus, run, hits, performance.now() - t0);
}

/** The desk: his own drawer, `desk/<slug>.md` and nothing under it (`drafts/` is per-viewer scratch). */
async function desk(term: string): Promise<GrepGroup> {
	const t0 = performance.now();
	const notes = listNotes();
	const titles = new Map<string, { slug: string; title: string }>();
	for (const n of notes) {
		const at = noteFile(n.slug);
		if (at.ok) titles.set(at.result, { slug: n.slug, title: n.title });
	}
	const corpus = sized([...titles.keys()]);
	const run = await search(corpus.files, term, LIMITS.perKind);
	const insensitive = insensitiveFor(term);
	const dated = new Map(corpus.files.map(f => [f.path, f.at]));

	const hits: GrepHit[] = [];
	for (const raw of run.raw.slice(0, LIMITS.perKind)) {
		const note = titles.get(raw.path);
		if (!note) continue;
		const { text, mark } = shown(raw, term, insensitive);
		hits.push({
			kind: 'desk', key: `k:${note.slug}:${raw.line}`,
			name: note.title, where: `desk/${note.slug}.md:${raw.line}`,
			at: dated.get(raw.path) ?? null, doc: deskDir(), text, mark,
			jump: { to: 'note', slug: note.slug },
		});
	}
	return group('desk', corpus, run, hits, performance.now() - t0);
}

/** The term, at the parse boundary. Everything below it trusts the string. */
export function readTerm(raw: string | null): { ok: true; term: string } | { ok: false; error: string } {
	const term = (raw ?? '').trim();
	if (term.length < LIMITS.term.min) return { ok: false, error: `a search is at least ${LIMITS.term.min} characters` };
	if (term.length > LIMITS.term.max) return { ok: false, error: `a search is at most ${LIMITS.term.max} characters` };
	return { ok: true, term };
}

/**
 * `GET /deck/grep?q=`. The three groups run **in sequence**, not in parallel: they share one wall
 * clock and one machine, and three ripgreps racing over 1.7 GB would make the budget meaningless.
 */
export async function grepQuery(q: URLSearchParams, world: GrepWorld = readGrepWorld()): Promise<GrepAnswer> {
	const t0 = performance.now();
	const asked = readTerm(q.get('q'));
	const engine = rgAvailable() ? 'rg' as const : 'grep' as const;
	const base: Omit<GrepAnswer, 'groups' | 'ms' | 'refusal'> = {
		query: asked.ok ? asked.term : (q.get('q') ?? ''),
		engine, degraded: engine === 'grep' ? DEGRADED : null,
		insensitive: asked.ok ? insensitiveFor(asked.term) : true,
		note: TRANSCRIPT_NOTE,
	};
	if (!asked.ok)
		return { ...base, groups: GREP_KINDS.map(empty), ms: 0, refusal: asked.error };

	const groups: GrepGroup[] = [
		await sessions(asked.term, world),
		await docs(asked.term, world),
		await desk(asked.term),
	];
	return { ...base, groups, ms: Math.round(performance.now() - t0), refusal: null };
}
