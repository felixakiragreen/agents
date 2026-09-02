// The citation respell (043) — the control is one canon page carrying every shape the rules
// consume plus every shape they must refuse, and its expected text checked in beside it. A
// converter that cannot be defended by reading a diff is a converter nobody may run.

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { HOMES, TOMBSTONE, onFence, respellCitations, type Home } from '../src/citations';

const FX = join(import.meta.dir, '..', 'fixtures', 'citations');
const fx = (name: string) => readFileSync(join(FX, name), 'utf8');

/** The fixture is read AS the doctrine: that is what makes half its citations self ones. */
const AS = 'canon/work/DOCTRINE.md';
const run = (md = fx('canon-page.md')) => respellCitations(AS, md);

describe('control — the canon page converts to its expected text', () => {
	test('byte for byte', () => {
		expect(run().after).toBe(fx('canon-page.expected.md'));
	});

	test('one rule per shape, named in the edit', () => {
		expect(run().edits.map(e => e.rule)).toEqual([
			'D25 whole strip',
			'D63 leads strip',
			'D46 whole strip + D64 trails strip',
			'D56 whole → home',
			'D62 trails → home',
			'D71 whole strip',
			'D74 trails strip',
		]);
	});

	test('a fence is a document to the respell, and its marker resets the tick parity', () => {
		expect(run().after).toContain('runs in a worktree)\n`D25` stays a form');
	});

	test('the fixed-point law — the second run writes nothing', () => {
		expect(run(run().after).edits).toEqual([]);
	});
});

describe('what the rules refuse — each refusal is a hand edit, never a guess', () => {
	const bare = run().bare;

	test("a possessive is no shape, and it blocks its whole line: all or nothing", () => {
		const line = fx('canon-page.md').split('\n').findIndex(l => l.startsWith("- D28's law")) + 1;
		expect(bare.filter(b => b.line === line).map(b => b.id).sort()).toEqual(['D28', 'D44']);
		expect(run().after.split('\n')[line - 1]).toBe(fx('canon-page.md').split('\n')[line - 1]);
	});

	test('a shape split by a hard wrap stands — a strip would leave a line holding one stop', () => {
		expect(bare.filter(b => b.id === 'D48').map(b => b.owned)).toEqual([true]);
		expect(run().after).toContain('\n  (D48).');
	});

	test("another building's qualified id is not this register's address (D80)", () => {
		expect(run().after).toContain('belvedere:D11, simmy:D4');
	});

	test('a form shown in ticks is a form, not a citation (043-F5)', () => {
		expect(run().after).toContain('`[D19](DECISIONS.md)`, `D44`');
	});

	test('a live entry keeps its id — the table is the licence, and it has no row', () => {
		expect(run().after).toContain('keeps its id (D82)');
		expect(bare.filter(b => b.id === 'D82').map(b => b.owned)).toEqual([false]);
	});
});

describe('the assertion — a seam means the shape was wrong about its own edges', () => {
	test('a home that spells to nothing throws rather than emitting `()`', () => {
		const empty: Home[] = [{ id: 'D56', entry: 'the verdict law', file: 'canon/mantles/architect.md', home: '' }];
		expect(() => respellCitations(AS, 'The verdict law (D56) — a cross citation.\n', empty))
			.toThrow(/left a .* scar/);
	});
});

describe('the table and the fence', () => {
	test('39 rows, ids unique, every row able to answer both classes', () => {
		expect(HOMES).toHaveLength(39);
		expect(new Set(HOMES.map(h => h.id)).size).toBe(39);
		for (const h of HOMES) {
			expect(h.entry.length).toBeGreaterThan(0);
			expect(h.home.length).toBeGreaterThan(0);
			expect(h.file === '' || h.file.endsWith('.md')).toBe(true);
		}
	});

	test('the fence is the live law surfaces — history and the records are out', () => {
		for (const rel of ['canon/work/DOCTRINE.md', 'canon/mantles/README.md', 'MAP.md', 'docs/the-city.md',
			'canon/work/templates/ledger.md'])
			expect(onFence(rel)).toBe(true);
		for (const rel of [TOMBSTONE, 'BOARD.md', 'LEDGER.md', 'LOG.md', 'log-archive.md', 'DECISIONS.md',
			'plans/043-citation-respell.md', 'belvedere/README.md', 'doctrine/src/citations.ts'])
			expect(onFence(rel)).toBe(false);
	});
});
