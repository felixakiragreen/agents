// 050: the field's asks — nine typed asks the field filed, one law test per spec item, each
// carrying its control in the same test. Every one of them reds on the pre-050 source
// (`git archive 778c9b6 doctrine canon`, this charge's Findings) and nothing else does.

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseChargeHeader, parseDecisions, parseLedger } from '../src/parse';
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

describe('items 2 and 4 — the batch slot, the two header slots, the tender line', () => {
	const header = (name: string) => parseChargeHeader(fx('asks', join('plans', name)), { live: true });

	test('item 2 — a gate doc\'s header carries its batch, and the tender line is its own field', () => {
		const h = header('G1-batch.md').header!;
		expect(h.batch).toEqual({ shape: 'parallel', ceiling: 3, gauge: 'hold the timed arms until load < 12', account: 'a-thg-0' });
		// the members are the gate's Depends-on and no slot of their own — the edge test (§4)
		expect(h.dependsOn).toEqual(['001', '002']);
		expect(h.tender).toEqual({ kind: 'dispatch' });
		// the control: the same literal QUOTED under Findings is a discussion, not a tender — the
		// read is bounded to the Mission, where §10 puts it (stigmergon 086's own ruling table)
		expect(header('004-malformed.md').header!.tender).toEqual({ kind: 'hand', text: 'sonnet-medium · plans/TENDER.md' });
	});

	test('item 4 — `Parallel-safe with:` and `Branch: ‹name› from ‹base›` are typed slots', () => {
		const h = header('003-branch.md').header!;
		expect(h.parallelSafeWith).toEqual(['001', '002']);
		expect(h.branch).toEqual({ name: 'asks/003-slots', base: 'master' });
		expect(h.staffing).toBe('Builder · opus-high');
		// the control: a charge in no batch and no worktree carries neither, and says so as absence
		const g = header('G1-batch.md').header!;
		expect([g.parallelSafeWith, g.branch]).toEqual([[], null]);
	});

	test('a slot written wrong fails on a LIVE doc, and history is never linted', () => {
		expect(header('004-malformed.md').fails.map(f => f.code)).toEqual(['charge.branch', 'charge.batch']);
		// … and the failures are the form's alone: the rest of the header still parses
		expect(header('004-malformed.md').header!.batch).toBeNull();
		// the control: the same defect in a spent doc reports nothing — §5's slot postdates it
		expect(parseChargeHeader(fx('asks', join('plans', '005-spent.md')), { live: false }).fails).toEqual([]);
		expect(parseChargeHeader(fx('asks', join('plans', '005-spent.md'))).header!.branch).toBeNull();
	});
});

describe('items 3 and 5 — typed holds, escalation ids, and a gate\'s readiness', () => {
	const b = parse(join(FX, 'asks'));
	const rows = b.board.flatMap(x => x.rows);
	const row = (id: string) => rows.find(r => r.id === id)!;
	const ready = (id: string) => b.readiness.find(r => r.id === id)!;

	test('item 3 — a landing\'s holds are typed, each an E-id or a ⬡-text', () => {
		expect(row('006').holds).toEqual([{ kind: 'escalation', id: 'E3' }, { kind: 'felix', text: 'his pass of the panes' }]);
		// the list ends at the annotation's next em-dash, so the findings pointer is not a hold
		expect(row('006').annotation).toContain('findings in');
		// the control: a clean landing holds nothing, and a hold nobody can address is a failure
		expect(row('001').holds).toEqual([]);
		expect(b.fails.filter(f => f.code === 'board.hold').map(f => f.excerpt)).toEqual(['012: "soon"']);
	});

	test('item 3 — an escalation is an id: born `E‹n› — ‹what›`, dead `E‹n› ruled ‹date›`', () => {
		expect(b.escalations).toEqual([
			{ id: 'E4', what: null, ruled: '2026-09-14', row: '009', line: row('009').line },
			{ id: 'E3', what: 'the account\'s quota, only he can rule it', ruled: null, row: '011', line: row('011').line },
		]);
	});

	test('item 3 — a dependency carrying an unresolved hold is not ignitable; a cleared one is', () => {
		expect(ready('007')).toEqual({ id: '007', ignitable: false, waitingOn: ['006'] });
		expect(ready('010')).toEqual({ id: '010', ignitable: true, waitingOn: [] });
		// … and the hold binds a gate too: a hold pauses dependants, whatever reads them
		expect(ready('G2').ignitable).toBe(false);
	});

	test('item 5 — a review gate is ready on a KILLED edge; every other charge waits on LANDED', () => {
		expect(ready('G1')).toEqual({ id: 'G1', ignitable: true, waitingOn: [] });
		// the control: the same killed dependency under a charge that is no gate still waits
		expect(ready('008')).toEqual({ id: '008', ignitable: false, waitingOn: ['002'] });
		// … and a landed one lets an ordinary charge through
		expect(ready('003')).toEqual({ id: '003', ignitable: true, waitingOn: [] });
		// nothing already ignited or finished is ignitable — the word is about firing it now
		expect([ready('001').ignitable, ready('011').ignitable]).toEqual([false, false]);
	});
});

describe('item 7 — the ledger cap counts the entry\'s prose (§7)', () => {
	const r = parseLedger(fx('asks', 'LEDGER.md'));

	test('a fenced instrument and the baton paragraph are uncounted; the prose is the cap', () => {
		// the first entry is 162 words as written and under the cap as PROSE — the fenced summons
		// is the baton's instrument (D63g) and the baton paragraph is §11's, not the writer's bloat
		expect(r.entries[0]!.block.trim().split(/\s+/).length).toBeGreaterThan(150);
		expect(r.fails.filter(f => f.line === r.entries[0]!.line)).toEqual([]);
	});

	test('the control: prose alone over the cap still warns, and the warning is still a warning', () => {
		const over = parseLedger(fx('asks', 'LEDGER.md').split('---')[2]!);
		expect(over.fails.map(f => [f.code, f.severity])).toEqual([['ledger.entry-cap', 'warn']]);
		expect(over.fails[0]!.excerpt).toStartWith('(186 words)');
	});
});
