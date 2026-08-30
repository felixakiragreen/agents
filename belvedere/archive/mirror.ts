// The transcript mirror — the backstop for a mortal corpus.
//
// The real history of every session Felix has ever run lives in exactly one place: the live
// account dirs, `~/.claude*/projects/**/*.jsonl` (v3 C11 F1). Nothing in any repo pins it. A
// cleared config dir takes the history with it.
//
// This is the bleeding-stopper: an incremental, **append-only, byte-true** copy of every
// account's transcripts, on an hourly launchd interval. Three laws, and they are the whole
// design:
//
//   **Derived, never authoritative.** Truth stays in the account dirs while sessions live. The
//   mirror serves the dead and the cleared, so it never writes back and never asks to be read
//   by anything that could have read the original.
//
//   **Append-only.** A source deletion NEVER propagates. That asymmetry is not a limitation of
//   the mirror, it IS the backup — a mirror that faithfully reproduces a deletion is a mirror
//   of the disaster.
//
//   **Bytes untouched.** The file IS the session (C4 F7: transcripts append whole lines, zero
//   torn lines measured), so a restored copy must `--resume`. Nothing here parses a transcript
//   in order to write one; the index is derived beside the bytes, never inside them.
//
// Cron work, not agent work: this spawns nothing and reaches no network.

import { readdirSync, statSync, mkdirSync, copyFileSync, utimesSync, renameSync, readFileSync, writeFileSync, type Stats } from 'fs';
import { join, dirname, relative } from 'path';
import { homedir } from 'os';

// ---------- anchors ----------

const home = homedir();

/** D6's telemetry neighborhood — gitignored, beside the census. `$ARCHIVE_DIR` is this row's knob. */
export const archiveDir = () => process.env.ARCHIVE_DIR ?? join(home, 'code/agents/summon/log/archive');

/** Where the accounts are discovered. `$ARCHIVE_HOME` exists so a drill can point at a fixture. */
export const sourceHome = () => process.env.ARCHIVE_HOME ?? home;

const indexFile = () => join(archiveDir(), 'index.jsonl');

/** The head window every derived field is read from. Bounded on purpose (B5 F3's law). */
const HEAD = 64 * 1024;

/** How much of the first turn the index carries — enough to recognise a session, not to replay it. */
const SUMMONS_CHARS = 120;

// ---------- discovery ----------

export type Account = { name: string; projects: string };

/**
 * Every account, **by discovery, never a hardcoded list** — accounts scale, and a mirror that
 * learns of a new one only when a human edits a table is a mirror that silently stops covering
 * the newest history. The test is structural: a `~/.claude*` directory carrying a `projects/`
 * subdirectory is an account.
 */
export function accounts(from = sourceHome()): Account[] {
	const out: Account[] = [];
	for (const name of readdirSync(from).sort()) {
		if (!name.startsWith('.claude')) continue;
		const projects = join(from, name, 'projects');
		try { if (!statSync(projects).isDirectory()) continue; } catch { continue; }
		out.push({ name, projects });
	}
	return out;
}

/** Every `*.jsonl` under one account's tree, as paths relative to it. Session transcripts sit at
 *  `<slug>/<sid>.jsonl`; a subagent's sits one level deeper at `<slug>/<sid>/subagents/agent-*.jsonl`.
 *  Both are transcripts and both die with the config dir, so both are mirrored. Everything else
 *  under `projects/` — memory notes, tool-result dumps, images — is out of scope. */
export function transcripts(root: string): string[] {
	const out: string[] = [];
	const walk = (dir: string) => {
		let entries;
		try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
		for (const e of entries) {
			const path = join(dir, e.name);
			if (e.isDirectory()) walk(path);
			else if (e.name.endsWith('.jsonl')) out.push(relative(root, path));
		}
	};
	walk(root);
	return out.sort();
}

// ---------- the copy ----------

export type Run = {
	accounts: { name: string; found: number; copied: number; bytes: number }[];
	indexed: number;
	seconds: number;
};

const same = (a: Stats, b: Stats) => a.size === b.size && Math.trunc(a.mtimeMs) === Math.trunc(b.mtimeMs);

/**
 * One account's copy pass. A file is copied when it is absent from the archive or when
 * **mtime+size differ** — the source's mtime is stamped onto the copy so that comparison is
 * self-contained, with no sidecar state to drift.
 *
 * A live transcript being appended to mid-run is safe to re-copy: whole-line appends mean the
 * copy is a valid prefix, and the next run — the file's mtime having moved — completes it.
 */
function mirrorAccount(acc: Account, dest: string): { found: number; copied: number; bytes: number } {
	const found = transcripts(acc.projects);
	let copied = 0, bytes = 0;
	for (const rel of found) {
		const from = join(acc.projects, rel), to = join(dest, rel);
		let src: Stats;
		try { src = statSync(from); } catch { continue; }   // vanished mid-walk; the archive keeps what it had
		try { if (same(src, statSync(to))) continue; } catch { /* absent — copy */ }
		mkdirSync(dirname(to), { recursive: true });
		copyFileSync(from, to);
		utimesSync(to, src.atime, src.mtime);
		copied++; bytes += src.size;
	}
	return { found: found.length, copied, bytes };
}

// ---------- the index ----------

export type Row = {
	account: string;
	slug: string;
	sid: string;
	agent: string | null;   // the subagent file's stem, or null for a session transcript
	path: string;           // relative to the archive root — what a search result points at
	rows: number;
	bytes: number;
	first: string | null;   // the transcript's own first and last timestamps, not the file's mtime
	last: string | null;
	summons: string | null; // the first engine-sent user line, first ~120 chars
};

const decoder = new TextDecoder();

/** Complete lines only — a trailing partial (a tail caught mid-append) is never parsed. */
const lines = (buf: Uint8Array, whole: boolean) => {
	const text = decoder.decode(buf).split('\n');
	if (!whole) text.pop();
	return text.filter(l => l.length > 0);
};

const field = (line: string, key: string): string | null => {
	try {
		const v = (JSON.parse(line) as Record<string, unknown>)[key];
		return typeof v === 'string' ? v : null;
	} catch { return null; }
};

/**
 * The first user turn a session was *sent* — the summons, for an ignited session. Skips the
 * harness's own meta records (`/color` and friends arrive as `type:"system"`, and a replayed
 * turn carries `isMeta`), and reads only string content: a tool result is an array, and a
 * transcript that opens with one has no summons to show.
 */
function summonsOf(head: string[]): string | null {
	for (const line of head) {
		let rec: Record<string, unknown>;
		try { rec = JSON.parse(line) as Record<string, unknown>; } catch { continue; }
		if (rec.type !== 'user' || rec.isMeta === true) continue;
		const message = rec.message as { content?: unknown } | undefined;
		const content = message?.content;
		if (typeof content !== 'string' || content.length === 0) continue;
		return content.replace(/\s+/g, ' ').trim().slice(0, SUMMONS_CHARS);
	}
	return null;
}

/**
 * One archived transcript, read once. Rows are counted over the bytes; every other field comes
 * from a bounded window at each end, so a 39 MB transcript costs the same parse as a 4 KB one.
 */
function describe(account: string, root: string, rel: string): Row {
	const path = join(root, rel);
	const buf = new Uint8Array(readFileSync(path));
	const bytes = buf.length;

	let rows = 0;
	for (let i = 0; i < bytes; i++) if (buf[i] === 0x0a) rows++;
	if (bytes > 0 && buf[bytes - 1] !== 0x0a) rows++;

	const small = bytes <= HEAD;
	const head = lines(buf.subarray(0, Math.min(HEAD, bytes)), small);
	// The tail window opens mid-line unless it is the whole file, so its first line is dropped.
	const tail = small ? head : lines(buf.subarray(bytes - HEAD), true).slice(1);

	let first: string | null = null;
	for (const l of head) { const t = field(l, 'timestamp'); if (t) { first = t; break; } }
	let last: string | null = null;
	for (const l of [...tail].reverse()) { const t = field(l, 'timestamp'); if (t) { last = t; break; } }

	const parts = rel.split('/');
	const slug = parts[0] ?? '';
	const stem = (parts[parts.length - 1] ?? '').replace(/\.jsonl$/, '');
	const session = parts.length >= 4 && parts[2] === 'subagents' ? parts[1] ?? '' : stem;

	return {
		account, slug, sid: session, agent: session === stem ? null : stem,
		path: join(account, rel), rows, bytes, first, last: last ?? first,
		summons: summonsOf(head),
	};
}

/** Regenerated whole, every run, and written by rename — a reader never sees a half-index. */
function writeIndex(root: string, rows: Row[]) {
	const tmp = join(root, 'index.jsonl.tmp');
	writeFileSync(tmp, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
	renameSync(tmp, indexFile());
}

// ---------- the run ----------

export function run(): Run {
	const started = Date.now();
	const root = archiveDir();
	mkdirSync(root, { recursive: true });

	const summary: Run['accounts'] = [];
	for (const acc of accounts()) {
		const dest = join(root, acc.name);
		mkdirSync(dest, { recursive: true });
		summary.push({ name: acc.name, ...mirrorAccount(acc, dest) });
	}

	// The index is derived from the ARCHIVE, never from the sources: a transcript whose source
	// has been deleted is exactly the row the backup exists to carry.
	const rows: Row[] = [];
	for (const name of readdirSync(root).sort()) {
		const dest = join(root, name);
		try { if (!statSync(dest).isDirectory()) continue; } catch { continue; }
		for (const rel of transcripts(dest)) rows.push(describe(name, dest, rel));
	}
	writeIndex(root, rows);

	return { accounts: summary, indexed: rows.length, seconds: (Date.now() - started) / 1000 };
}

if (import.meta.main) {
	const r = run();
	// The launchd log is append-only and unattended, so every run stamps itself: a log whose
	// last line has no date cannot tell you whether the tick is alive.
	console.log(`--- ${new Date().toISOString()}`);
	for (const a of r.accounts) {
		console.log(`${a.name.padEnd(24)} found ${String(a.found).padStart(5)}  copied ${String(a.copied).padStart(5)}  ${(a.bytes / 1e6).toFixed(1)} MB`);
	}
	console.log(`archive ${archiveDir()}\nindexed ${r.indexed} transcripts in ${r.seconds.toFixed(1)}s`);
}
