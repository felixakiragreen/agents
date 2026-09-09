// `doctrine prune ‹root›` — the ledger's aging (048; DOCTRINE §3, the retention law).
//
// The ledger is the one file whose growth is BY DESIGN — append-only, the record of everything —
// and the one file the retention law exempts, because sessions read its tail. Its bytes are
// unbounded anyway. So it relocates and never dies: past `LIMITS.ledgerTail` entries the oldest
// move, verbatim and in order, to `ledger-archive.md` beside it — append-only, created at the
// first aging-out — and the parser reads both, so nothing is lost, no count decreases, and the
// tail is where it was. Ancestor: the Log's and SAPHO's aging (⬡ 2026-08-29) — six entries kept,
// the rest one file over, forever.
//
// Text in, text out: the plan is pure and asserts its own law; only `write` touches a byte.

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { LEDGER_ARCHIVE, LIMITS, parse } from './building';
import { parseLedgerPair, type LedgerEntry } from './parse';

/** The archive's header, written once at the first aging-out — the law and where it is written. */
const ARCHIVE_HEADER = [
	'# Ledger — the archive',
	'',
	'Entries aged out of [LEDGER.md](LEDGER.md) whole — verbatim, in order, oldest first; append-only, written by `doctrine prune` and by nothing else. One record, two files: `LEDGER.md` keeps the last entries and this file keeps the rest (DOCTRINE §3, the ledger ages). Nothing reboots from here — the tail is over there.',
];

export type Plan = {
	moved: LedgerEntry[];   // the entries that age out, oldest first — the record of what moved
	kept: number;
	bytes: number;          // what leaves LEDGER.md; the archive gains the same, plus its header
	ledger: string;         // LEDGER.md, after
	archive: string;        // ledger-archive.md, after
	created: boolean;       // the first aging-out — the archive is written for the first time
};

/**
 * The aging, computed over one pair. `null` is the FIXED POINT: a ledger at or under the count
 * moves nothing, and a second run over an already-pruned pair is that same nothing.
 *
 * The cut is made in LINES, so what moves is bytes and not a re-emission: the aged region is the
 * file's own lines from the first entry's block to the one below the last aged entry, and the
 * only byte the ledger loses beyond them is the `---` that separated them from the tail — which
 * the archive re-uses as the separator that joins them to what it already holds.
 */
export function planPrune(ledgerMd: string, archiveMd: string | null, keep: number = LIMITS.ledgerTail): Plan | null {
	const before = parseLedgerPair(archiveMd, ledgerMd);
	const entries = before.ledger.entries;
	if (entries.length <= keep) return null;

	const lines = ledgerMd.split('\n');
	const from = entries[0]!.line - 1;                     // the first entry's block, below the header's `---`
	const to = entries[entries.length - keep]!.line - 1;   // the first KEPT entry's block
	const moved = lines.slice(from, to - 1);               // ends at the blank above the cut's `---`
	const ledger = [...lines.slice(0, from), ...lines.slice(to)].join('\n');
	const archive = archiveMd === null
		? [...ARCHIVE_HEADER, '', '---', ...moved].join('\n')
		: archiveMd.replace(/\n*$/, '\n') + '\n---\n' + moved.join('\n');

	// The round-trip law, asserted at every run: the entries the pair yields do not change when
	// one of them moves house. A violation is this converter's bug, not the ledger's defect — and
	// it aborts before a byte is written, because half a relocation is a lost record.
	const after = parseLedgerPair(archive, ledger);
	const bad = roundTrip(before.entries, after.entries);
	if (bad) throw new Error(`the ledger's aging broke its round-trip law — ${bad}`);

	return {
		moved: entries.slice(0, entries.length - keep),
		kept: keep,
		bytes: Buffer.byteLength(ledgerMd) - Buffer.byteLength(ledger),
		ledger, archive, created: archiveMd === null,
	};
}

/** One sequence in, one sequence out — same entries, same order, byte-identical blocks. */
function roundTrip(before: LedgerEntry[], after: LedgerEntry[]): string | null {
	if (before.length !== after.length) return `${before.length} entries before, ${after.length} after`;
	for (let i = 0; i < before.length; i++)
		if (before[i]!.block !== after[i]!.block) return `entry ${i + 1} (${before[i]!.date}) is not the same bytes it was`;
	return null;
}

export type Prune = { ledger: string; archive: string; plan: Plan | null };

/**
 * One building's pair, planned. `null` where there is nothing to age: no ledger, or a ledger
 * that is a master doc's section — a §3 subproject's inline ledger is that doc's business, and
 * the aging is `LEDGER.md`'s (the archive is bound to the file, `building.ts`).
 */
export function planBuilding(root: string): Prune | null {
	const b = parse(root);
	if (!b.files.ledger || basename(b.files.ledger) !== 'LEDGER.md') return null;
	const archive = b.files.ledgerArchive ?? join(dirname(b.files.ledger), LEDGER_ARCHIVE);
	return {
		ledger: b.files.ledger, archive,
		plan: planPrune(readFileSync(b.files.ledger, 'utf8'), existsSync(archive) ? readFileSync(archive, 'utf8') : null),
	};
}

/**
 * The write, and the whole of it. The archive lands FIRST: a run that dies between the two
 * writes leaves the record whole twice over, which is a duplicate a reader can see and fix —
 * the other order loses entries outright.
 */
export function write(p: Prune): void {
	if (!p.plan) return;
	writeFileSync(p.archive, p.plan.archive);
	writeFileSync(p.ledger, p.plan.ledger);
}
