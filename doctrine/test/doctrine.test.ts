// The control (DOCTRINE §6.2): a parser failing its own fixture indicts the parser.
// Plus the round-trip law, the declared refusals, and row 19's defect fixtures — every fix
// in the wave's harvest pinned to a checked-in reproduction. No test reads outside the repo
// (item 14): live-corpus checks belong to `doctrine lint`, not the suite.

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
	batonFails, classifyBaton, parseBoards, parseDecisions, parseIssues, parseKickoffs, parseLedger,
} from '../src/parse';
import { migrateText, roundTrip } from '../src/migrate';
import { guardRegressions, lint } from '../src/lint';
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

	test('board — the typed-absence vocabulary conforms (D63 as amended, D69) [items 1, 2]', () => {
		const r = parseBoards(fx('conforming', 'board-absences.md'));
		expect(codes(r.fails)).toEqual([]);
		const rows = r.boards[0]!.rows;
		expect(rows.find(x => x.id === 'C8')!.unstaffed).toBe(true);
		expect(rows.find(x => x.id === 'C8')!.state).toBe('OPEN');           // OPEN — PARKED conforms
		expect(rows.find(x => x.id === 'C9')!.mantle).toBe('unrecorded');
		expect(rows.find(x => x.id === 'C10')!.tier).toBe('unrecorded');
	});

	test('ledger (§7 + D63f)', () => {
		const r = parseLedger(fx('conforming', 'ledger.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.entries).toHaveLength(3);
		expect([r.tail!.date, r.tail!.mantle, r.tail!.tier, r.tail!.row]).toEqual(['2026-08-26', 'Builder', 'opus-high', '03']);
	});

	test('ledger — unrecorded is legal in the mantle and tier slots (item 1)', () => {
		const r = parseLedger('# L\n\n---\n\n**2026-08-07 · unrecorded · unrecorded** — a bare-session forensic entry. Decided: unrecorded. Next: unrecorded.\n');
		expect(codes(r.fails)).toEqual([]);
		expect([r.tail!.mantle, r.tail!.tier]).toEqual(['unrecorded', 'unrecorded']);
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

// ---------- row 19: the wave's parse-scope and silent-zero fixtures ----------

describe('the silence family — defects that once reported clean', () => {
	test('leading PARKED is the same defect class as leading PENDING (item 2, D69)', () => {
		expect(codes(parseBoards(fx('defects', 'parked-leads.md')).fails)).toEqual(['board.parked-leads']);
		// and it molts exactly as PENDING does — C8's cell in the D69 spelling, state leading
		const m = migrateText(join(FX, 'defects', 'parked-leads.md'), fx('defects', 'parked-leads.md'));
		expect(m.after).toContain('| OPEN — PARKED — staffed when unparked; earns a build on iron or not at all |');
		expect(codes(parseBoards(m.after).fails)).toEqual([]);
		expect(roundTrip(m)).toEqual([]);
	});

	test('a stale lead fails; another row\'s landing in the annotation passes (item 17)', () => {
		expect(codes(parseBoards(fx('defects', 'stale-lead.md')).fails))
			.toEqual(['board.stale-lead', 'board.stale-lead']);
		// the counter-fixture: C11 narrates row 13's landing and conforms (board-absences.md lints 0)
		expect(codes(parseBoards(fx('conforming', 'board-absences.md')).fails)).toEqual([]);
	});

	test('renamed columns refuse their rows LOUDLY, with the count (item 8)', () => {
		const r = parseBoards(fx('defects', 'columns-renamed.md'));
		expect(r.boards).toHaveLength(0);
		expect(codes(r.fails)).toEqual(['board.columns']);
		expect(r.fails[0]!.reason).toContain('2 row(s)');
	});

	test('reordered canonical columns parse positionally, defect filed (item 8)', () => {
		const r = parseBoards(fx('defects', 'columns-reordered.md'));
		expect(codes(r.fails)).toEqual(['board.columns']);
		const rows = r.boards[0]!.rows;
		expect(rows.map(x => [x.id, x.mantle ?? (x.felixGate ? 'Felix-gate' : null), x.dependsOn])).toEqual([
			['M1', 'Builder', []], ['M2', 'Felix-gate', ['M1']],
		]);
	});

	test('a blank line is a truncated board, never a clean short one (item 9)', () => {
		const r = parseBoards(fx('defects', 'truncated.md'));
		expect(codes(r.fails)).toEqual(['board.truncated']);
		expect(r.boards[0]!.rows).toHaveLength(2);          // 10, 11 — the orphans are named, not parsed
	});

	test('a merged ledger entry is a failure, not a quieter parse (item 16)', () => {
		const r = parseLedger(fx('defects', 'merged-LEDGER.md'));
		expect(codes(r.fails)).toContain('ledger.merged');
		expect(r.fails.filter(f => f.code === 'ledger.merged')).toHaveLength(1);   // the negatives stay silent
	});

	test('depends-on resolves building-wide; a genuinely unknown id still fails (item 7)', () => {
		const master = '| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n| 01 | a | E1 | Builder · opus-high | OPEN |\n| 02 | b | GHOST | Builder · opus-high | OPEN |\n';
		const sub = '| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n| E1 | c | — | Builder · opus-high | OPEN |\n';
		const perDoc = parseBoards(master);
		expect(codes(perDoc.fails)).toEqual(['board.depends', 'board.depends']);   // the pre-fix blindness
		const union = new Set(['01', '02', 'E1']);
		const r = parseBoards(master, union);
		expect(codes(r.fails)).toEqual(['board.depends']);                          // GHOST alone
		expect(r.boards[0]!.rows[0]!.dependsOn).toEqual(['E1']);
		expect(parseBoards(sub, union).fails).toEqual([]);
	});

	test('the register reads a subproject\'s inline Ledger — failures welcome, silence not (item 10)', () => {
		const b = parse(join(FX, 'subproject'));
		expect(b.files.ledger).toContain('README.md');
		expect(b.fails.some(f => f.artifact === 'ledger')).toBe(true);              // visible, not "ledger none"
	});

	test('decision ids carry the project\'s own prefix (item 11)', () => {
		const r = parseDecisions('## Decisions\n\n- **RP-1** (Felix, 08-26): Campaign named **Repot**.\n');
		expect(r.candidates).toBe(1);                                               // the 18h fixture, verbatim
		expect(r.decisions[0]?.id).toBe('RP-1');
		const b = parse(join(FX, 'subproject'));
		expect(b.decisions).toBe(1);
	});

	test('the pending marker lives in the attribution — a body quoting it never counts (item 12)', () => {
		const md = [
			'- **D21** (2026-08-03, Architect (02) · ✓ Felix): **Shapes ratified.** dispatched sessions mark "(proposed — pending Felix countersign)". More prose.',
			'- **D68** (2026-08-28, Grand Architect (11) — proposed, pending Felix countersign): **The vocabulary.** Stuff.',
		].join('\n');
		const r = parseDecisions(md);
		expect(r.decisions.find(d => d.id === 'D21')!.pending).toBe(false);         // folded
		expect(r.decisions.find(d => d.id === 'D68')!.pending).toBe(true);          // a real proposed entry
		expect(r.queue.map(d => d.id)).toEqual(['D68']);
	});

	test('a fence naming no mantle after the article is not a kickoff candidate (item 13)', () => {
		const letters = [
			'```\nYou are the founding ⟨title as the window knew it⟩ of ⟨project⟩ — the window that\n⟨founding act⟩ on ⟨date⟩.\n```',
			'```\nYou are ⟨who this window was⟩ of ⟨project⟩ — the window that ⟨act⟩ on ⟨date⟩.\n```',
			'```\nYou are the founding Grand Architect of hexwright — the window that laid its keel,\non a date the window remembers.\n```',
		].join('\n\n');
		expect(parseKickoffs(letters).fails).toEqual([]);
		expect(parseKickoffs(letters).kickoffs).toEqual([]);
		// a real malformed kickoff — mantle named, tier absent — still fails
		const r = parseKickoffs('```\nYou are a Builder.\nWear the mantle.\n```');
		expect(codes(r.fails)).toEqual(['kickoff.summons']);
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

	test('the ## dialect hoists the parenthetical tier; no tier emits unrecorded, never a tier-less head (item 3)', () => {
		const m = migrateText(join(FX, 'pre-d63', 'heading', 'LEDGER.md'), fx('pre-d63/heading', 'LEDGER.md'));
		expect(parseLedger(m.before).entries).toHaveLength(0);      // the pre-fix silence: 0 failures, 0 entries
		expect(m.after).toContain('**2026-08-19 · Builder · opus-medium (SH3)** — the bundle-push pipeline');
		expect(m.after).toContain('**2026-08-20 · Builder · unrecorded (SH4)** — the follow-up');
		const after = parseLedger(m.after);
		expect(codes(after.fails)).toEqual([]);
		expect(after.entries).toHaveLength(2);
		expect(roundTrip(m)).toEqual([]);
	});

	test('the 18c fixture, verbatim: lint 0 → migrate → lint 0, never 2 (item 3)', () => {
		const md = '# Ledger\n\n---\n\n## 2026-08-19 · Builder (opus-medium) · SH3 — the bundle-push pipeline\n\nStuff. Decided: nothing. Next: fire 20.\n';
		expect(parseLedger(md).fails).toEqual([]);
		const m = migrateText('LEDGER.md', md);
		const after = parseLedger(m.after);
		expect(after.fails).toEqual([]);
		expect([after.tail!.mantle, after.tail!.tier, after.tail!.row]).toEqual(['Builder', 'opus-medium', 'SH3']);
	});

	test('a bold run wider than its verdict keeps the state inside it (item 4)', () => {
		const m = migrateText(join(FX, 'defects', 'bold-verdict.md'), fx('defects', 'bold-verdict.md'));
		expect(m.after).toContain('| **LANDED — MERGED (2026-08-11, `6dc03690`)** — DoD met, all green |');
		expect(m.after).toContain('| OPEN — PENDING iron access — **the annotation stays** |');
		expect(codes(parseBoards(m.after).fails)).toEqual([]);
		expect(roundTrip(m)).toEqual([]);
	});

	test('the bare-head dialect: bold, hoist, — for Changed:, wraps handled, absences typed (item 5)', () => {
		const m = migrateText(join(FX, 'pre-d63', 'bare', 'LEDGER.md'), fx('pre-d63/bare', 'LEDGER.md'));
		const after = parseLedger(m.after);
		expect(codes(after.fails)).toEqual([]);
		expect(after.entries).toHaveLength(5);
		expect(after.entries.map(e => [e.mantle, e.tier, e.row])).toEqual([
			['Architect', 'unrecorded', null],
			['Digger', 'fable-high', '01'],
			['Builder', 'opus-high', 'S3'],
			['Builder', 'opus-medium', 'X4'],
			['Digger', 'opus-low', '09'],
		]);
		// the wrapped head landed on one line, its remainder in the body untouched
		expect(m.after).toContain('**2026-08-18 · Builder · opus-medium (X4)** — appearance: themes, UI zoom, indent guides, batch 7 — themes built, zero colour literals.');
		// the S3 entry never held Decided:/Next: — the typed absence, never a reconstruction
		expect(after.entries[2]!.decided).toBe('unrecorded');
		expect(after.entries[2]!.next).toContain('unrecorded');
		expect(roundTrip(m)).toEqual([]);
	});

	test('the inline-attribution decision variant types the absent title, never authors one (item 6)', () => {
		const m = migrateText(join(FX, 'pre-d63', 'decisions-inline.md'), fx('pre-d63', 'decisions-inline.md'));
		expect(m.edits).toHaveLength(2);
		const after = parseDecisions(m.after);
		expect(codes(after.fails)).toEqual([]);
		expect(after.decisions.map(d => [d.id, d.title, d.decider])).toEqual([
			['D1', 'unrecorded', 'Felix + Architect'], ['D2', 'unrecorded', 'Architect'],
		]);
		expect(roundTrip(m)).toEqual([]);
	});

	test('a range expands only where every id resolves (item 7)', () => {
		const md = '| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n| 01 | a | — | Builder · opus-high | LANDED |\n| 02 | b | — | Builder · opus-high | LANDED |\n| 03 | c | — | Builder · opus-high | LANDED |\n| 04 | d | 01–03 | Builder · opus-high | OPEN |\n| 05 | e | E1–E9 | Builder · opus-high | OPEN |\n';
		const m = migrateText('board.md', md);
		expect(m.after).toContain('| 01 · 02 · 03 |');
		expect(m.after).toContain('| E1–E9 |');                     // unknown ids: the range stays a lint fail
		expect(roundTrip(m)).toEqual([]);
	});

	test('migrate is idempotent — a second pass finds nothing', () => {
		for (const n of ['board.md', 'ledger.md', 'decisions.md', 'decisions-inline.md', 'heading/LEDGER.md', 'bare/LEDGER.md']) {
			const once = migrateText(join(FX, 'pre-d63', n), fx('pre-d63', n));
			expect(migrateText(once.file, once.after).edits).toEqual([]);
		}
	});

	test('migrate refuses kickoff fences and ISSUES entries, by design', () => {
		for (const n of ['kickoff.md', 'issues.md'])
			expect(migrateText(join(FX, 'conforming', n), fx('conforming', n)).edits).toEqual([]);
	});

	test('a conforming document is already home — no edits', () => {
		for (const n of ['board.md', 'board-absences.md', 'ledger.md', 'decisions.md'])
			expect(migrateText(join(FX, 'conforming', n), fx('conforming', n)).edits).toEqual([]);
	});
});

// ---------- item 18: the count-regression guard ----------

describe('the guard — entity counts, not fail counts', () => {
	const totals = (dir: string) => lint([join(FX, 'guard', dir)]).totals;

	test('the item-9 blank line trips it: rows vanish', () => {
		const lost = guardRegressions(totals('pre'), totals('post-blank'));
		expect(lost.some(l => l.startsWith('rows: 3'))).toBe(true);
	});

	test('the item-16 merged entry trips it: the fail count LIED, the entry count does not', () => {
		const pre = totals('pre'), post = totals('post-merged');
		const lost = guardRegressions(pre, post);
		expect(lost).toEqual(['ledgerEntries: 2 at the ref → 1 now']);
	});

	test('a pure append trips nothing', () => {
		expect(guardRegressions(totals('pre'), totals('post-append'))).toEqual([]);
	});
});

// ---------- discovery: the traps the control caught ----------

describe('the register', () => {
	test('a board doc is a table with a Staffing HEADER, not prose that says the word', () => {
		expect(staffsSessions('| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n| 01 | a | — | Digger · opus-high | OPEN |')).toBe(true);
		expect(staffsSessions('| a | b |\n|---|---|\n| x | it carries no Staffing column, so it never counts |')).toBe(false);
		expect(staffsSessions('Staffing lives in the tier descriptions.')).toBe(false);
	});

	test('--live is a strict subset: a closed work doc\'s kickoff fail drops, the board fail stays', () => {
		const dir = join(FX, 'live');
		const all = lint([dir]);
		const live = lint([dir], { live: true });
		expect(codes(all.fails).sort()).toEqual(['board.tier', 'kickoff.summons']);
		expect(codes(live.fails)).toEqual(['board.tier']);
	});

	test('the round-trip law holds across every fixture, dry-run', () => {
		for (const n of ['conforming/board.md', 'conforming/board-absences.md', 'conforming/ledger.md',
			'conforming/decisions.md', 'pre-d63/board.md', 'pre-d63/ledger.md', 'pre-d63/decisions.md',
			'pre-d63/decisions-inline.md', 'pre-d63/heading/LEDGER.md', 'pre-d63/bare/LEDGER.md',
			'defects/bold-verdict.md', 'defects/truncated.md', 'defects/merged-LEDGER.md']) {
			const p = join(FX, n);
			expect(roundTrip(migrateText(p, readFileSync(p, 'utf8')))).toEqual([]);
		}
	});
});
