// The control (DOCTRINE §6.2): a parser failing its own fixture indicts the parser.
// Plus the round-trip law, the declared refusals, and the corpus floor row 16's DoD names.

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import {
	batonFails, classifyBaton, parseBoards, parseDecisions, parseIssues, parseKickoffs, parseLedger,
} from '../src/parse';
import { migrateText, roundTrip } from '../src/migrate';
import { lint } from '../src/lint';
import { parse, staffsSessions } from '../src/building';

const FX = join(import.meta.dir, '..', 'fixtures');
const fx = (kind: string, name: string) => readFileSync(join(FX, kind, name), 'utf8');
const codes = (fails: { code: string }[]) => fails.map(f => f.code);

// ---------- the control: the amended grammar, one fixture per artifact class ----------

describe('control — conforming fixtures parse with zero failures', () => {
	test('board (§4 + D63 a/b/c/d/e)', () => {
		const r = parseBoards(fx('conforming', 'board.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.boards).toHaveLength(1);
		expect(r.boards[0]!.rows).toHaveLength(7);
	});

	test('board — the Felix-gate row is typed, not guessed (D63a)', () => {
		const row = parseBoards(fx('conforming', 'board.md')).boards[0]!.rows.find(r => r.id === '04')!;
		expect(row.felixGate).toBe(true);
		expect(row.mantle).toBeNull();
		expect(row.rider).toBe('smoke ×3');
		expect(row.state).toBe('LANDED');
		expect(row.annotation).toBe('BLESSED 2026-08-26');
	});

	test('board — the staffing rider never eats the tier (D63d)', () => {
		const row = parseBoards(fx('conforming', 'board.md')).boards[0]!.rows.find(r => r.id === '02')!;
		expect([row.mantle, row.tier, row.rider]).toEqual(['Builder', 'opus-medium', 'worktree']);
	});

	test('board — Depends-on takes exactly two forms (D63e)', () => {
		const rows = parseBoards(fx('conforming', 'board.md')).boards[0]!.rows;
		expect(rows.find(r => r.id === '05')!.dependsOn).toEqual(['01', '02']);
		expect(rows.find(r => r.id === '06')!.dependsOn).toEqual(['03']);
		expect(rows.find(r => r.id === '06')!.gates).toEqual(['budget blessing']);
	});

	test('ledger (§7 + D63f)', () => {
		const r = parseLedger(fx('conforming', 'ledger.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.entries).toHaveLength(3);
		expect([r.tail!.date, r.tail!.mantle, r.tail!.tier, r.tail!.row]).toEqual(['2026-08-26', 'Builder', 'opus-high', '03']);
	});

	test('baton — a fenced summons in the tail is one fireable instrument (D63g/D64)', () => {
		const tail = parseLedger(fx('conforming', 'ledger.md')).tail!;
		const b = classifyBaton(tail)!;
		expect(b.holder).toBe('session');
		expect(b.instruments).toHaveLength(1);
		expect(b.instruments[0]).toMatchObject({ kind: 'summons', mantle: 'Architect', tier: 'fable-high' });
		expect(batonFails(b, 0)).toEqual([]);
	});

	test('baton — `fire <row-ids>` is n instruments, the wave (D63g/D64)', () => {
		const entries = parseLedger(fx('conforming', 'ledger.md')).entries;
		const b = classifyBaton(entries[1]!)!;
		expect(b.holder).toBe('session');
		expect(b.instruments).toEqual([{ kind: 'row', row: '03' }, { kind: 'row', row: '04' }]);
	});

	test('decisions (§8 + D63i)', () => {
		const r = parseDecisions(fx('conforming', 'decisions.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.decisions.map(d => d.title)).toEqual(['The first choice', 'The second choice', 'The third choice']);
		// A decision Felix made needs no countersign; D3 is proposed, so only D3 queues.
		expect(r.queue.map(d => d.id)).toEqual(['D3']);
	});

	test('issues (§3 + D63h)', () => {
		const r = parseIssues(fx('conforming', 'issues.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.issues.map(i => [i.date, i.who])).toEqual([
			['2026-08-26', 'Felix'], ['2026-08-26', 'the row-01 Digger'],
		]);
	});

	test('kickoff (§5 + D45)', () => {
		const r = parseKickoffs(fx('conforming', 'kickoff.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.kickoffs).toHaveLength(1);
		expect([r.kickoffs[0]!.mantle, r.kickoffs[0]!.tier]).toEqual(['Digger', 'opus-high']);
	});
});

// ---------- migrate: what it fixes, what it refuses, and the round-trip law ----------

describe('migrate — pre-D63 fixtures', () => {
	const run = (name: string) => {
		const md = fx('pre-d63', name);
		return migrateText(join(FX, 'pre-d63', name), md);
	};

	test('board migrates to zero failures', () => {
		const m = run('board.md');
		expect(m.edits).toHaveLength(5);
		expect(codes(parseBoards(m.after).fails)).toEqual([]);
		expect(roundTrip(m)).toEqual([]);
	});

	test('ledger migrates to zero failures (D63f, the tier slot)', () => {
		const m = run('ledger.md');
		expect(m.edits).toHaveLength(3);
		expect(codes(parseLedger(m.after).fails)).toEqual([]);
		expect(parseLedger(m.after).entries.map(e => [e.tier, e.row]))
			.toEqual([['opus-high', '01'], ['fable-max', '02'], ['opus-high', '03']]);
		expect(roundTrip(m)).toEqual([]);
	});

	test('decisions migrate to form, and the converter refuses to invent a decider', () => {
		const m = run('decisions.md');
		expect(codes(parseDecisions(m.before).fails)).toEqual(['decision.head', 'decision.head']);
		// The one honest residue: hexwright's format has no decider field, so neither does this.
		expect(codes(parseDecisions(m.after).fails)).toEqual(['decision.attribution', 'decision.attribution']);
		expect(parseDecisions(m.after).decisions.map(d => d.title))
			.toEqual(['Stack: TypeScript (strict)', 'First build: the vertical slice']);
		expect(roundTrip(m)).toEqual([]);
	});

	test('migrate is idempotent — a second pass finds nothing', () => {
		for (const n of ['board.md', 'ledger.md', 'decisions.md']) {
			const once = run(n);
			expect(migrateText(once.file, once.after).edits).toEqual([]);
		}
	});

	test('migrate refuses kickoff fences and ISSUES entries, by design', () => {
		for (const n of ['kickoff.md', 'issues.md'])
			expect(migrateText(join(FX, 'conforming', n), fx('conforming', n)).edits).toEqual([]);
	});

	test('a conforming document is already home — no edits', () => {
		for (const n of ['board.md', 'ledger.md', 'decisions.md'])
			expect(migrateText(join(FX, 'conforming', n), fx('conforming', n)).edits).toEqual([]);
	});
});

// ---------- discovery: the traps the control caught ----------

describe('the register', () => {
	test('a board doc is a table with a Staffing HEADER, not prose that says the word', () => {
		expect(staffsSessions('| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n| 01 | a | — | Digger · opus-high | OPEN |')).toBe(true);
		expect(staffsSessions('| a | b |\n|---|---|\n| x | it carries no Staffing column, so it never counts |')).toBe(false);
		expect(staffsSessions('Staffing lives in the tier descriptions.')).toBe(false);
	});
});

// ---------- the corpus: row 16's DoD floor, measured against P3's baseline ----------

const CODE = join(homedir(), 'code');

describe('corpus', () => {
	test('the city clears P3\'s baseline with zero per-repo special cases', () => {
		const r = lint([CODE]);
		expect(r.totals.boardDocsWithBoard).toBeGreaterThanOrEqual(25);   // P3: 25 of 27 docs
		expect(r.totals.rows).toBeGreaterThanOrEqual(365);                // P3: 365 rows
		expect(r.totals.tails).toBeGreaterThanOrEqual(8);                 // P3: 8 of 8 ledgers
		expect(r.fails.length).toBeGreaterThan(0);                        // the format, not the parser
	}, 60_000);

	test('--live is a strict subset of the full report', () => {
		const all = lint([join(CODE, 'agents')]);
		const live = lint([join(CODE, 'agents')], { live: true });
		expect(live.fails.length).toBeLessThan(all.fails.length);
		expect(live.fails.every(f => f.artifact === 'board' || f.artifact === 'ledger' || f.artifact === 'kickoff')).toBe(true);
	}, 60_000);

	test('the round-trip law holds on real buildings, dry-run', () => {
		for (const b of ['agents', 'agents/belvedere', 'hexwright', 'whiteboardy', 'universal_robots_sdk/cap-mega/simmy']) {
			const dir = join(CODE, b);
			for (const f of [...parse(dir).files.boards, parse(dir).files.ledger].filter(Boolean) as string[])
				expect(roundTrip(migrateText(f, readFileSync(f, 'utf8')))).toEqual([]);
		}
	}, 120_000);

	test('hexwright\'s pre-doctrine ledger tail migrates form-only', () => {
		const f = join(CODE, 'hexwright', 'LEDGER.md');
		const m = migrateText(f, readFileSync(f, 'utf8'));
		expect(m.edits.length).toBeGreaterThan(0);
		expect(roundTrip(m)).toEqual([]);
		// Nothing parsed before; entries exist after — and every edit is one heading line.
		expect(parseLedger(m.before).entries).toHaveLength(0);
		expect(parseLedger(m.after).entries.length).toBe(m.edits.length);
		expect(m.edits.every(e => e.from.startsWith('## '))).toBe(true);
	});
});
