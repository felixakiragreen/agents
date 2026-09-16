// 050: the field's asks — nine typed asks the field filed, one law test per spec item, each
// carrying its control in the same test. Every one of them reds on the pre-050 source
// (`git archive 778c9b6 doctrine canon`, this charge's Findings) and nothing else does.

import { describe, expect, test } from 'bun:test';
import { execSync } from 'child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { basename, join } from 'path';
import { parseChargeHeader, parseDecisions, parseLedger } from '../src/parse';
import { FORMULA_RULE, RULES, migrateText, roundTrip } from '../src/migrate';
import { parse } from '../src/building';
import { DEFAULT_HORIZON, datedEntries, deferredDropFails, deferredEntries, horizonOf, pastHorizon } from '../src/deferred';
import { lint } from '../src/lint';
import { vocabularyFails } from '../src/vocabulary';
import { parseWords } from '../src/words';

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

describe('item 6 — the deferred list: its day, its horizon, and the drop nobody named', () => {
	const board = fx('asks', 'BOARD.md');

	test('the shelf is its top-level bullets, and the horizon is the building\'s own word', () => {
		expect(deferredEntries(board).map(e => e.line)).toEqual([25, 26, 27]);
		expect(horizonOf(fx('asks', 'MAP.md'))).toBe(60);         // "sixty days", as the record spells it
		// the control: a master doc that names none takes the doctrine's thirty, and so does none at all
		expect([horizonOf(fx('asks', 'DECISIONS.md')), horizonOf(null)]).toEqual([DEFAULT_HORIZON, DEFAULT_HORIZON]);
		expect(DEFAULT_HORIZON).toBe(30);
	});

	test('past the horizon is counted, never listed — the pack says how much, the board says what', () => {
		const shelf = [{ text: '', line: 1, day: '2026-07-01' }, { text: '', line: 2, day: '2026-09-14' }, { text: '', line: 3, day: null }];
		expect(pastHorizon(shelf, 30, '2026-09-15')).toBe(1);
		expect(pastHorizon(shelf, 60, '2026-09-15')).toBe(1);
		expect(pastHorizon(shelf, 120, '2026-09-15')).toBe(0);
		// the control: an undated entry is a typed absence — nothing is past a horizon it cannot be measured against
		expect(pastHorizon([{ text: '', line: 1, day: null }], 1, '2026-09-15')).toBe(0);
	});

	test('the day is git\'s, and a drop the ledger does not name warns (§4; stigmergon G23-F5)', () => {
		const root = mkdtempSync(join(tmpdir(), 'doctrine-shelf-'));
		const git = (args: string) => execSync(`git ${args}`, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
		const shelf = (...items: string[]) => `# Board\n\n**Deferred (tracked, not lost):**\n\n${items.map(x => `- ${x}\n`).join('')}`;
		const commit = (body: string, ledger: string, when: string) => {
			writeFileSync(join(root, 'BOARD.md'), body);
			writeFileSync(join(root, 'LEDGER.md'), ledger);
			git('add -A');
			git(`-c user.name=t -c user.email=t@t commit -q -m x --date ${when}`);
		};
		try {
			git('init -q');
			commit(shelf('the first', 'the second', 'the third'), '# Ledger\n', '2026-07-01T12:00:00+0000');
			const first = join(root, 'BOARD.md');
			expect(datedEntries(first, readFileSync(first, 'utf8')).map(e => e.day)).toEqual(['2026-07-01', '2026-07-01', '2026-07-01']);

			// a drop with no word for it — the loss class
			commit(shelf('the first', 'the second'), '# Ledger\n\nthe sweep ran and the board was reconciled.\n', '2026-07-02T12:00:00+0000');
			const dropped = deferredDropFails(first, readFileSync(first, 'utf8'));
			expect(dropped.map(f => [f.code, f.severity, f.excerpt]))
				.toEqual([['board.deferred-drop', 'warn', expect.stringContaining('3 → 2 deferred')]]);

			// the control: the same drop, named in the ledger of that span — nothing to report
			commit(shelf('the first'), '# Ledger\n\nthe second was promoted to 004.\n', '2026-07-03T12:00:00+0000');
			expect(deferredDropFails(first, readFileSync(first, 'utf8'))).toEqual([]);
			// … and a shelf that only grows is never the alarm's business
			commit(shelf('the first', 'the fourth'), '# Ledger\n\nnothing was said.\n', '2026-07-04T12:00:00+0000');
			expect(deferredDropFails(first, readFileSync(first, 'utf8'))).toEqual([]);
		} finally { rmSync(root, { recursive: true, force: true }); }
	});
});

describe('item 8 — the lexicon arm reads the building\'s WORDS.md, and walks docs/', () => {
	const register = parseWords(fx('asks', 'WORDS.md'));
	const city = fx('asks', join('docs', 'city.md'));
	const local = (md: string) => vocabularyFails(md, register).filter(f => f.code === 'vocab.local-dead-word');

	test('a building\'s graveyard rows join §9\'s for that building, and its entries are its own kinds', () => {
		expect(register.graveyard.map(g => g.forms)).toEqual([['the rail'], ['the glass'], ['desk files']]);
		// the control, three rows and three reasons, each structural and none a whitelist:
		//   `fold`     — the register MINTS it live, so the building's own kind outranks its own row
		//   `the paint` — a sense-kill, and a sense cannot be patterned
		//   `WALL_MS`  — a code-ticked cell is an identifier, and a rename of a symbol is the compiler's
		expect([...register.words]).toContain('fold');
		expect(local(city).map(f => f.excerpt.slice(0, 13))).toEqual(['"The rail" → ', '"The glass" →']);
		expect(local(city).every(f => f.severity === 'warn')).toBe(true);
	});

	test('the arm walks docs/ as a law surface, and the register is not one', () => {
		const b = parse(join(FX, 'asks'));
		expect(b.files.docs.map(f => basename(f))).toEqual(['city.md']);
		expect(basename(b.files.words!)).toBe('WORDS.md');
		const hits = lint([join(FX, 'asks')], { vocab: true }).fails.filter(f => f.code === 'vocab.local-dead-word');
		expect(hits.map(f => basename(f.file))).toEqual(['city.md', 'city.md']);
		// the control: a register must name the dead to bury them, so it is no law surface and the walk
		// never hands it to the arm — pointed at it by hand the arm reports its every row, which is
		// exactly why the fence is the SURFACE list and never a pattern (canon's law book, locally)
		expect(local(fx('asks', 'WORDS.md')).length).toBe(3);
	});
});

describe('item 9 — formulas 8 and 26 by the converter (D81, the currency law)', () => {
	const file = join(FX, 'asks', 'formulas.md');
	const m = migrateText(file, fx('asks', 'formulas.md'), { passes: ['respell'] });

	test('the pinned string respells wherever a document writes it, history included', () => {
		// one edit: a rule is line-scoped, and the entry writes both formulas on one line
		expect(m.edits.map(e => e.rule)).toEqual([FORMULA_RULE]);
		expect(m.after).toContain('"History is respelled, not rewritten."');
		expect(m.after).toContain('In prose beside it: Ambiguity, not plurality, is the sin.');
		expect(m.after).not.toContain('never plurality, is the sin.\n');
		// the controls, both the converter's existing law:
		//   a ticked span beside `→` is a form being NAMED — the charge doc that commissioned this
		//   rule writes both spellings on one line, and the rule may not consume its own commission
		expect(m.after).toContain('`Ambiguity, never plurality, is the sin.` → ');
		//   a wording the table does not name is a session's call: this one leads a clause
		expect(m.after).toContain('is the sin: the clause leads on');
	});

	test('the substitution proves itself by substituting — no rule buys a license to differ', () => {
		// the entry's body DID change, and the round-trip law still holds: `changes` is empty on
		// this rule, so the law is the stronger one — every field invariant under the table
		const body = (md: string) => parseLedger(md).entries[0]!.body;
		expect(body(m.before)).not.toBe(body(m.after));
		expect(RULES.find(r => r.id === FORMULA_RULE)!.changes).toEqual([]);
		expect(roundTrip(m)).toEqual([]);
		// the control: a second pass is a fixed point, and code is not a document
		expect(migrateText(file, m.after, { passes: ['respell'] }).edits).toEqual([]);
		expect(migrateText('src/x.ts', 'const s = \'Ambiguity, never plurality, is the sin.\';', { passes: ['respell'] }).edits).toEqual([]);
	});
});
