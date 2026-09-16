// 050: the field's asks — nine typed asks the field filed, one law test per spec item, each
// carrying its control in the same test. Every one of them reds on the pre-050 source
// (`git archive 778c9b6 doctrine canon`, this charge's Findings) and nothing else does.

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDecisions } from '../src/parse';
import { parse } from '../src/building';

const FX = join(import.meta.dir, '..', 'fixtures');
const fx = (kind: string, name: string) => readFileSync(join(FX, kind, name), 'utf8');

describe('item 1 — the ⬢ mark: his yes with its size (D90)', () => {
	const ds = parseDecisions(fx('asks', 'DECISIONS.md')).decisions;
	const d = (id: string) => ds.find(x => x.id === id)!;

	test('the magnitude is typed, and the floor at 1 splits the blessing from the credit', () => {
		expect(ds.map(x => x.magnitude)).toEqual([100, 0.1, 0.01, -1, null, null]);
		expect([d('D1').blessed, d('D2').blessed, d('D3').blessed]).toEqual([true, false, false]);
		// the control: the words are untouched — `⬡✓` still blesses, `⬡ go` still credits
		expect([d('D5').blessed, d('D5').credit]).toEqual([true, null]);
		expect([d('D6').blessed, d('D6').credit]).toEqual([false, '2026-09-15']);
	});

	test('a credit is dated as a `⬡ go` is — its own day, else the entry it rides', () => {
		expect(d('D2').credit).toBe('2026-09-15');          // undated: the entry's own
		expect(d('D3').credit).toBe('2026-09-15');          // dated: the mark's, not the entry's 09-10
		expect(d('D3').date).toBe('2026-09-10');
		// the control: a NEGATIVE is a no — it authorizes nothing and owes nothing
		expect([d('D4').blessed, d('D4').credit]).toEqual([false, null]);
	});

	test('the mark leaves the decider, and a sized yes is not a queue', () => {
		expect(ds.map(x => x.decider)).toEqual(['Felix', 'Architect', 'Architect', 'Architect', 'Architect', 'Architect']);
		// D4's no is the only thing still waiting on a pen — a blessing and a credit both proceed
		expect(parseDecisions(fx('asks', 'DECISIONS.md')).queue.map(x => x.id)).toEqual(['D4']);
	});

	test('the statement carries the sized credits and never a blessing (D82 · D90)', () => {
		const b = parse(join(FX, 'asks'));
		expect(b.credits.map(c => [c.where, c.mark, c.date])).toEqual([
			['D6', '⬡ go', '2026-09-15'], ['D2', '⬢0.1', '2026-09-15'], ['D3', '⬢0.01', '2026-09-15'],
		]);
		// the magnitudes boot prints, in the register's own order — the blessing included
		expect(b.magnitudes.map(x => [x.id, x.magnitude])).toEqual([['D1', 100], ['D2', 0.1], ['D3', 0.01], ['D4', -1]]);
	});
});
