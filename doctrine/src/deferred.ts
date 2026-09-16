// The deferred list (DOCTRINE §4, the pilot survived at stigmergon G23) — real work set aside:
// tracked, not lost. Three readings, and the first is the whole design:
//
//   **A day nobody chooses.** An entry carries the day it entered, and that day is git's — his
//   ruling of 2026-09-08 on the MEL ask: *a date he must choose per item is a tax he will not
//   pay*. So nothing is written into the document and nothing is parsed out of it; the day is
//   blamed off the line, which means it cannot be wrong and cannot rot.
//
//   **A horizon the building names.** Thirty days by default, and the building's agreements may
//   say otherwise (§4). Read from the master doc's own paragraph, never configured.
//
//   **A drop that says nothing is the loss class.** Ten live entries were swept out of
//   stigmergon's board at a bulk edit with no ledger word and were restored from git (G23-F5).
//   The alarm is a count between two commits, and the ledger of that span is the alibi.

import { execSync } from 'child_process';
import { basename, dirname } from 'path';
import { fail, type Fail } from './grammar';

/** The shelf's own line: a board doc's deferred list opens with it, or the doc keeps none. */
export const DEFERRED_LINE = '**Deferred (tracked, not lost):**';
/** §4 — thirty days when the building's agreements name no other. */
export const DEFAULT_HORIZON = 30;

export type Deferred = { text: string; line: number; day: string | null };

/** Read-only git, from inside the file's own directory; a tree with no checkout answers null. */
function git(cwd: string, args: string): string | null {
	try { return execSync(`git ${args}`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 }); }
	catch { return null; }
}

/** The shelf's region: the deferred line, then its top-level bullets, to the next heading or EOF. */
function shelf(md: string): { at: number; end: number } | null {
	const lines = md.split('\n');
	const at = lines.findIndex(l => l.startsWith(DEFERRED_LINE));
	if (at < 0) return null;
	let end = at + 1;
	for (; end < lines.length && !/^#{1,6} /.test(lines[end]!); end++);
	return { at: at + 1, end };
}

/**
 * The shelf's entries: top-level `- ` bullets, one per entry. A continuation line is the entry's
 * own prose (the record wraps a deferred entry over ten lines), so the ENTRY is its first line —
 * which is also the line git is asked about.
 */
export function deferredEntries(md: string): Deferred[] {
	const region = shelf(md);
	if (!region) return [];
	const lines = md.split('\n');
	const out: Deferred[] = [];
	for (let i = region.at; i < region.end; i++)
		if (/^- /.test(lines[i]!)) out.push({ text: lines[i]!, line: i + 1, day: null });
	return out;
}

/** An epoch second in its author's own day — the books are dated in the day they were written. */
function isoDay(seconds: number, tz: string): string {
	const m = tz.match(/^([+-])(\d{2})(\d{2})$/);
	const offset = m ? (m[1] === '-' ? -1 : 1) * (+m[2]! * 3600 + +m[3]! * 60) : 0;
	return new Date((seconds + offset) * 1000).toISOString().slice(0, 10);
}

/**
 * Each entry's day, blamed off its own line. `git blame` answers with the commit that last wrote
 * the line, which for an append-only shelf IS the day it entered — and this repo's
 * `.git-blame-ignore-revs` keeps the form-only respells (D81) from claiming every line in the
 * city. A tree git cannot answer for leaves every day null, which is a typed absence and not a
 * zero: nothing is past a horizon it has no date to be measured against.
 */
export function datedEntries(file: string, md: string): Deferred[] {
	const entries = deferredEntries(md);
	if (!entries.length) return entries;
	const first = entries[0]!.line, last = entries.at(-1)!.line;
	const text = git(dirname(file), `blame --line-porcelain -L ${first},${last} -- ${JSON.stringify(basename(file))}`);
	if (!text) return entries;

	const days = new Map<number, string>();
	let line = 0, time = 0, tz = '+0000';
	for (const l of text.split('\n')) {
		const head = l.match(/^[0-9a-f]{7,40} \d+ (\d+)/);
		if (head) { line = +head[1]!; continue; }
		if (l.startsWith('author-time ')) time = +l.slice(12);
		else if (l.startsWith('author-tz ')) tz = l.slice(10).trim();
		else if (l.startsWith('\t') && line && time) days.set(line, isoDay(time, tz));
	}
	return entries.map(e => ({ ...e, day: days.get(e.line) ?? null }));
}

const WORD_DAYS: Readonly<Record<string, number>> = {
	seven: 7, ten: 10, fourteen: 14, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, ninety: 90,
};

/**
 * The building's horizon, read from its master doc's agreements — the paragraph that names *the
 * deferral horizon* (§4; stigmergon MAP §5 is the first). The number is read as the record writes
 * it: STANDARD §7 keeps word-numbered things words, so *thirty days* is the ordinary spelling and
 * digits are read beside it. The paragraph, not the line — a master doc's prose flows (D88), so
 * the phrase and its number rarely share a line.
 */
export function horizonOf(masterMd: string | null): number {
	if (!masterMd) return DEFAULT_HORIZON;
	const lines = masterMd.split('\n');
	const at = lines.findIndex(l => /the deferral horizon/i.test(l));
	if (at < 0) return DEFAULT_HORIZON;
	let end = at + 1;
	for (; end < lines.length && lines[end]!.trim(); end++);
	const para = lines.slice(at, end).join(' ').replace(/[*`]/g, '');
	const m = para.match(/\b(\d+|[A-Za-z]+)\s+days\b/);
	if (!m) return DEFAULT_HORIZON;
	return /^\d+$/.test(m[1]!) ? +m[1]! : WORD_DAYS[m[1]!.toLowerCase()] ?? DEFAULT_HORIZON;
}

/** How many entries stand past the horizon — the count boot prints, undated entries excluded. */
export function pastHorizon(entries: Deferred[], horizon: number, today: string): number {
	const cutoff = new Date(Date.parse(today + 'T00:00:00Z') - horizon * 86_400_000).toISOString().slice(0, 10);
	return entries.filter(e => e.day !== null && e.day < cutoff).length;
}

/**
 * §4's drop alarm. The count fell between the board doc's last two commits and the ledger of that
 * span names neither `promoted` nor `deleted` — the two words §4 gives an entry for leaving the
 * shelf. A WARNING: the cure is a ledger line or a restore from git, and neither is a lint's to
 * force.
 *
 * Two commits, and the spread is deliberate. The alarm is a drift alarm, read at the prune check
 * the retention law already schedules (D78), so it answers about the edit that just happened; a
 * drop older than the board's last commit is git's to find, as G23's ten entries were.
 */
export function deferredDropFails(file: string, md: string): Fail[] {
	const region = shelf(md);
	if (!region) return [];
	const dir = dirname(file);
	// The repo-relative path, from git itself: `--show-toplevel` answers with the REAL path, and a
	// checkout reached through a symlinked parent (every macOS temp dir, `/var` → `/private/var`)
	// would compute a relative path that leaves the repo. Untracked, git has nothing to compare.
	const path = git(dir, `ls-files --full-name -- ${JSON.stringify(basename(file))}`)?.trim().split('\n')[0];
	if (!path) return [];
	const shas = (git(dir, `log -n 2 --format=%H -- ${JSON.stringify(path)}`) ?? '').trim().split('\n').filter(Boolean);
	if (shas.length < 2) return [];
	const [cur, prev] = shas as [string, string];

	const countAt = (sha: string) => {
		const text = git(dir, `show ${sha}:${JSON.stringify(path)}`);
		return text === null ? null : deferredEntries(text).length;
	};
	const now = countAt(cur), was = countAt(prev);
	if (now === null || was === null || now >= was) return [];

	const span = git(dir, `diff ${prev} ${cur} -- "*LEDGER.md" "*ledger-archive.md"`) ?? '';
	const written = span.split('\n').filter(l => l.startsWith('+')).join(' ');
	if (/\bpromoted\b|\bdeleted\b/i.test(written)) return [];

	const f = fail('board', 'board.deferred-drop',
		'the deferred list shrank and the ledger of that span says neither "promoted" nor "deleted" (§4) — an entry leaves the shelf by promotion to a charge or by a deletion the ledger names, and a drop nobody named is the loss class (stigmergon G23-F5: ten live entries swept out at a bulk edit, restored from git)',
		`${was} → ${now} deferred between ${prev.slice(0, 7)} and ${cur.slice(0, 7)}`, region.at, 'warn');
	f.file = file;
	return [f];
}
