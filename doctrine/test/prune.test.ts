// The ledger's aging (048) — DOCTRINE §3's retention law, mechanized.
//
// The laws under test: what moves is BYTES (a byte compare against the checked-in pair), the
// pair parses to one unchanged sequence, the tail and the baton stay where they were, an
// already-aged pair is a fixed point, the archive anchors no building, and the guard — the
// mechanical net for silent damage — reports nothing across the move.

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { planPrune } from '../src/prune';
import { parseLedger, parseLedgerPair, registerSizeFails } from '../src/parse';
import { discover, parse } from '../src/building';
import { guardRegressions, lint } from '../src/lint';
import { REGISTER_CAP } from '../src/grammar';

const FX = join(import.meta.dir, '..', 'fixtures', 'prune');
const dir = (d: string) => join(FX, d);
const file = (d: string, n: string) => readFileSync(join(FX, d, n), 'utf8');

const BEFORE = file('before', 'LEDGER.md');
const LEDGER = file('after', 'LEDGER.md');
const ARCHIVE = file('after', 'ledger-archive.md');

describe('the aging — 25 entries prune to 20 and an archive of 5', () => {
	test('both files land byte-identical to the checked-in pair', () => {
		const p = planPrune(BEFORE, null)!;
		expect(p.moved).toHaveLength(5);
		expect(p.kept).toBe(20);
		expect(p.created).toBe(true);
		expect(p.ledger).toBe(LEDGER);
		expect(p.archive).toBe(ARCHIVE);
	});

	test('the entries move VERBATIM — every aged block is its own bytes, in order', () => {
		const p = planPrune(BEFORE, null)!;
		const was = parseLedger(BEFORE).entries.slice(0, 5);
		expect(p.moved.map(e => e.block)).toEqual(was.map(e => e.block));
		expect(p.moved.map(e => e.date)).toEqual(['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05']);
	});

	test('the pair parses to the same 25 entries, in the same order (the round-trip law)', () => {
		const before = parseLedger(BEFORE).entries;
		const after = parseLedgerPair(ARCHIVE, LEDGER).entries;
		expect(after.map(e => e.block)).toEqual(before.map(e => e.block));
		expect(after).toHaveLength(25);
	});

	test('the tail and the baton are where they were', () => {
		const was = parse(dir('before')), now = parse(dir('after'));
		expect(now.ledgerTail!.block).toBe(was.ledgerTail!.block);
		expect(now.ledgerTail!.date).toBe('2026-08-25');
		expect(now.baton).toEqual(was.baton);
		// The count is over the PAIR — that is the whole point of reading both (048).
		expect([was.ledgerEntries, now.ledgerEntries]).toEqual([25, 25]);
	});

	test('the archive is bound to its ledger, and the ledger keeps its own fails', () => {
		const b = parse(dir('after'));
		expect(b.files.ledgerArchive).toBe(join(FX, 'after', 'ledger-archive.md'));
		expect(b.fails).toEqual([]);
	});
});

describe('the fixed points — an aging writes nothing it has already written', () => {
	test('a ledger at the count moves nothing', () => {
		expect(parseLedger(LEDGER).entries).toHaveLength(20);
		expect(planPrune(LEDGER, ARCHIVE)).toBeNull();
	});

	test('a second prune of the pruned pair moves nothing', () => {
		const once = planPrune(BEFORE, null)!;
		expect(planPrune(once.ledger, once.archive)).toBeNull();
	});

	test('an existing archive is APPENDED to, never rewritten — its bytes lead the new ones', () => {
		// The same 25 aged twice over: a tail of 10 sends five more entries after the first five.
		const twice = planPrune(LEDGER, ARCHIVE, 10)!;
		expect(twice.created).toBe(false);
		expect(twice.archive.startsWith(ARCHIVE)).toBe(true);
		expect(parseLedgerPair(twice.archive, twice.ledger).entries.map(e => e.block))
			.toEqual(parseLedger(BEFORE).entries.map(e => e.block));
	});
});

describe('the archive anchors no building (048)', () => {
	test('a ledger and its archive are ONE building', () => {
		const bs = discover([dir('after')]);
		expect(bs.map(b => b.path)).toEqual([join(FX, 'after')]);
	});

	test('an archive with no LEDGER.md beside it anchors nothing', () => {
		expect(discover([dir('orphan')])).toEqual([]);
	});
});

describe('the guard — an aging is not a loss', () => {
	test('no entity total decreases across the move', () => {
		const totals = (d: string) => lint([dir(d)]).totals;
		expect(guardRegressions(totals('before'), totals('after'))).toEqual([]);
		expect(totals('after').ledgerEntries).toBe(25);
		// One ledger, not two: the archive is the ledger's archive, never a second ledger.
		expect(totals('after').ledgers).toBe(1);
	});
});

describe('decisions.size — §8\'s purge, nudged (048)', () => {
	const register = (kb: number) => 'x'.repeat(kb * 1024);

	test('a register past 30 KB warns, and names its size and its lines', () => {
		const fails = registerSizeFails(register(31));
		expect(fails.map(f => [f.code, f.severity])).toEqual([['decisions.size', 'warn']]);
		expect(fails[0]!.excerpt).toBe('31.0 KB in 1 lines');
		expect(fails[0]!.reason).toContain('DOCTRINE §8');
	});

	test('a register under it says nothing', () => {
		expect(registerSizeFails(register(29))).toEqual([]);
		expect(registerSizeFails('x'.repeat(REGISTER_CAP))).toEqual([]);
	});
});
