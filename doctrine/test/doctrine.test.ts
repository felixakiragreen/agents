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
	test('board (§4 + D63 a/b/c/d/e + D71)', () => {
		const r = parseBoards(fx('conforming', 'board.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.boards).toHaveLength(1);
		expect(r.boards[0]!.rows).toHaveLength(7);
	});

	test('board — the ⬡-gate charge is typed, not guessed (D63a, respelled by D71)', () => {
		const row = parseBoards(fx('conforming', 'board.md')).boards[0]!.rows.find(r => r.id === '04')!;
		expect(row.hexGate).toBe(true);
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

	test('board — the typed-absence vocabulary conforms (D63 as amended, D71) [items 1, 2]', () => {
		const r = parseBoards(fx('conforming', 'board-absences.md'));
		expect(codes(r.fails)).toEqual([]);
		const rows = r.boards[0]!.rows;
		expect(rows.find(x => x.id === 'C8')!.dissolved).toBe(true);         // `—` earned by DEFERRED
		expect(rows.find(x => x.id === 'C8')!.state).toBe('OPEN');           // OPEN — DEFERRED conforms
		expect(rows.find(x => x.id === 'C9')!.mantle).toBe('unrecorded');
		expect(rows.find(x => x.id === 'C10')!.tier).toBe('unrecorded');
	});

	test('board — the standard\'s tongue: ⬡-gate in both columns, C‹n› ids, DEFERRED (D71)', () => {
		const r = parseBoards(fx('conforming', 'board-standard.md'));
		expect(codes(r.fails)).toEqual([]);
		const rows = r.boards[0]!.rows;
		expect(rows.find(x => x.id === 'C25')!.dependsOn).toEqual(['C24']);
		expect(rows.find(x => x.id === 'C25')!.gates).toEqual(['the sovereign\'s read of the diff']);
		// the token is Staffing's and Depends-on's alike, and it carries an annotation
		expect([rows.find(x => x.id === 'C26')!.hexGate, rows.find(x => x.id === 'C26')!.rider])
			.toEqual([true, 'his drafts, his pen']);
		expect(rows.find(x => x.id === 'C26')!.gates).toEqual(['Felix\'s charter drafts']);
		// the one absence left: a DEFERRED charge whose shelving dissolved its staffing
		expect([rows.find(x => x.id === 'C27')!.dissolved, rows.find(x => x.id === 'C27')!.state])
			.toEqual([true, 'OPEN']);
	});

	test('board — charges are always staffed: the hard failure, and the one absence it allows (D71)', () => {
		const r = parseBoards(fx('defects', 'unstaffed.md'));
		expect(codes(r.fails)).toEqual(['board.unstaffed', 'board.unstaffed', 'board.unstaffed']);
		expect(r.fails.map(f => f.excerpt.split(':')[0])).toEqual(['C1', 'C2', 'C3']);   // C4 earned its `—`
		expect(r.boards[0]!.rows.find(x => x.id === 'C4')!.dissolved).toBe(true);
		// and the converter refuses all three: staffing a live charge is a session's call
		expect(migrateText(join(FX, 'defects', 'unstaffed.md'), fx('defects', 'unstaffed.md')).edits).toEqual([]);
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

	test('ledger — a charge id in the head, `ignite <charge-ids>` in the baton (D71)', () => {
		const r = parseLedger(fx('conforming', 'ledger-standard.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.entries.map(e => e.row)).toEqual(['C23', 'C24']);
		expect(classifyBaton(r.entries[0]!)!.instruments).toEqual([{ kind: 'row', row: 'C24' }]);
		expect(classifyBaton(r.tail!)!.instruments).toEqual([{ kind: 'row', row: 'C25' }, { kind: 'row', row: 'C26' }]);
	});

	test('baton — `ignite` is the verb, `fire` is the history, prose is neither (§3)', () => {
		const next = (s: string) => classifyBaton({ next: s, block: '' } as never)!;
		expect(next('ignite C24').instruments).toEqual([{ kind: 'row', row: 'C24' }]);
		expect(next('fire 16').instruments).toEqual([{ kind: 'row', row: '16' }]);
		expect(next('Ignite the distillation session — Felix picks the venue.').holder).toBe('felix');
	});

	test('decisions (§8 + D63i)', () => {
		const r = parseDecisions(fx('conforming', 'decisions.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.decisions.map(d => d.title)).toEqual(['The first choice', 'The second choice', 'The third choice']);
		// A decision Felix made needs no countersign; D3 is proposed, so only D3 queues.
		expect(r.queue.map(d => d.id)).toEqual(['D3']);
	});

	test('decisions — ⬡✓ is the mark, ✓ Felix is the history, both parse (D71 §7)', () => {
		const r = parseDecisions(fx('conforming', 'decisions-standard.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.decisions.map(d => [d.id, d.decider, d.blessed, d.pending])).toEqual([
			['D71', 'Grand Architect', true, false],
			['D72', 'Architect — proposed, pending ⬡✓', false, true],
		]);
		expect(r.queue.map(d => d.id)).toEqual(['D72']);
		// neither mark migrates: the record's respell is DEFERRED by the standard (§7)
		expect(migrateText(join(FX, 'conforming', 'decisions-standard.md'), fx('conforming', 'decisions-standard.md')).edits).toEqual([]);
		expect(migrateText(join(FX, 'conforming', 'decisions.md'), fx('conforming', 'decisions.md')).edits).toEqual([]);
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
	test('leading PARKED is the same defect class as leading PENDING (item 2, D69/D71)', () => {
		// the dead token still parses, and still fails: an annotation never leads (D63c)
		expect(codes(parseBoards(fx('defects', 'parked-leads.md')).fails))
			.toEqual(['board.unstaffed', 'board.parked-leads']);
		// and it molts as PENDING does, into the standard's word — state leading, staffing dissolved
		const m = migrateText(join(FX, 'defects', 'parked-leads.md'), fx('defects', 'parked-leads.md'));
		expect(m.after).toContain('| — | OPEN — DEFERRED — staffed when unparked; earns a build on iron or not at all |');
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
		expect(rows.map(x => [x.id, x.mantle ?? (x.hexGate ? 'Felix-gate' : null), x.dependsOn])).toEqual([
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

	test('the id form §7 mandates parses — `‹prefix›-D‹n›` was a silent zero (C31 item 3)', () => {
		const r = parseDecisions(fx('vocab', 'DECISIONS.md'));
		expect(r.candidates).toBe(3);                                              // 2 before the widening
		expect(r.decisions.map(d => d.id)).toEqual(['D1', 'C4', 'VX-D2']);
		expect(codes(r.fails)).toEqual([]);
		// every id spelling the city writes, one line each — the four bob rejected among them
		for (const id of ['PD-D9', 'TH-D11', 'LB-D10', 'C-D2', 'VX-D2', 'RP-1', 'A17', 'D63', 'D63a'])
			expect(parseDecisions(`- **${id}** (2026-08-29, Architect): **T.** b.`).decisions.map(d => d.id)).toEqual([id]);
		// the guard the widening may not break: a bold cross-reference carries no attribution
		expect(parseDecisions('- **T13 ∥ t12c**, concurrent — both land.').candidates).toBe(0);
		expect(parseDecisions('- **PD-D9** — no attribution, so not a decision.').candidates).toBe(0);
	});

	test('a prefixed-D entry migrates by both decision rules (C31 item 3)', () => {
		const head = migrateText('DECISIONS.md', '- **PD-D9 · 2026-08-13 · The pod unit** the body.\n');
		expect(head.after).toBe('- **PD-D9** (2026-08-13): **The pod unit** the body.\n');
		const inline = migrateText('DECISIONS.md', '- **TH-D11 (2026-08-13, Felix):** the body.\n');
		expect(inline.after).toBe('- **TH-D11** (2026-08-13, Felix): **unrecorded.** the body.\n');
		expect(roundTrip(head)).toEqual([]);
		expect(roundTrip(inline)).toEqual([]);
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

	test('the house clause dialect molts: the colon relocates, the joiner becomes a colon (C31 item 2)', () => {
		const led = (body: string) => `# L\n\n---\n\n**2026-08-16 · Builder · opus-high (E7)** — the work.\n${body}\n`;
		const applied = migrateText('LEDGER.md', led('Decided (inside the fence): the verbs stay put.\nNext — dispatch E8.'));
		expect(applied.after).toContain('Decided: (inside the fence) the verbs stay put.');
		expect(applied.after).toContain('Next: dispatch E8.');
		// the scope is relocated, never dropped — the same bytes, the colon one field name to the left
		expect(applied.edits.map(e => [e.rule, e.from, e.to])).toEqual([
			['ledger.clause-scope', 'Decided (inside the fence): the verbs stay put.', 'Decided: (inside the fence) the verbs stay put.'],
			['ledger.clause-dash', 'Next — dispatch E8.', 'Next: dispatch E8.'],
		]);
		const after = parseLedger(applied.after);
		expect(codes(after.fails)).toEqual([]);
		expect([after.tail!.decided, after.tail!.next])
			.toEqual(['(inside the fence) the verbs stay put', 'dispatch E8.']);
		expect(roundTrip(applied)).toEqual([]);
	});

	test('the dialect rules refuse everything that is not a clause head (C31 item 2)', () => {
		const refuses = [
			'Decided: (inside the fence) already home.',       // idempotent — the conforming form
			'The board Decided (scope): mid-prose is C25-F2\'s other shape, not this rule\'s.',
			'Next steps (the gate): a heading, not a field name.',
			'Nexus — the joiner belongs to a word that is not a field.',
		];
		for (const line of refuses) {
			const m = migrateText('LEDGER.md', `# L\n\n---\n\n**2026-08-16 · Builder · opus-high (E7)** — w. Decided: x. Next: y.\n${line}\n`);
			expect([line, m.edits]).toEqual([line, []]);
		}
		// and the rules are the ledger's: the same line in a DECISIONS.md is untouched
		expect(migrateText('DECISIONS.md', 'Decided (scope): not a ledger.\n').edits).toEqual([]);
		// a fenced quote of the dialect is a quote, not an entry
		expect(migrateText('LEDGER.md', '# L\n\n---\n\n**2026-08-16 · Builder · opus-high (E7)** — w. Decided: x. Next: y.\n\n```\nDecided (scope): quoted.\n```\n').edits).toEqual([]);
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
		const board = migrateText(join(FX, 'pre-d71', 'board.md'), fx('pre-d71', 'board.md'));
		expect(migrateText(board.file, board.after).edits).toEqual([]);
	});

	test('migrate refuses kickoff fences and ISSUES entries, by design', () => {
		for (const n of ['kickoff.md', 'issues.md'])
			expect(migrateText(join(FX, 'conforming', n), fx('conforming', n)).edits).toEqual([]);
	});

	test('a conforming document is already home — no edits', () => {
		for (const n of ['board.md', 'board-absences.md', 'board-standard.md', 'ledger.md',
			'ledger-standard.md', 'decisions.md', 'decisions-standard.md'])
			expect(migrateText(join(FX, 'conforming', n), fx('conforming', n)).edits).toEqual([]);
	});
});

// ---------- D71: the standard's molt ----------

describe('migrate — the pre-D71 tokens', () => {
	const m = () => migrateText(join(FX, 'pre-d71', 'board.md'), fx('pre-d71', 'board.md'));

	test('the dead tokens parse before the molt — history is read, never re-spelled by the reader', () => {
		const r = parseBoards(fx('pre-d71', 'board.md'));
		const rows = r.boards[0]!.rows;
		expect(rows.find(x => x.id === '01')!.hexGate).toBe(true);          // `Felix-gate` staffs forever
		expect(rows.find(x => x.id === '03')!.gates).toEqual(['budget blessing']);
		// only the dead staffing fails: `unstaffed` left the legal set on both rows (D71)
		expect(codes(r.fails)).toEqual(['board.staffing', 'board.unstaffed', 'board.unstaffed']);
	});

	test('Felix-gate → ⬡-gate in both columns; PARKED → DEFERRED; unstaffed → `—` on the shelved charge', () => {
		const after = m().after;
		expect(after).toContain('| ⬡-gate (smoke ×3) |');
		expect(after).toContain('| 01 | ⬡-gate |');                            // the bare `Felix` was the same field
		expect(after).toContain('| 01 · ⬡-gate: budget blessing |');
		expect(after).toContain('| — | OPEN — DEFERRED staffed when unparked');
		expect(m().edits.map(e => e.rule)).toEqual([
			'staffing.hex-gate', 'staffing.hex-gate', 'depends.hex-gate',
			'staffing.dissolved+status.parked-respell',
		]);
		expect(roundTrip(m())).toEqual([]);
	});

	test('a live charge\'s missing staffing is a residue, never a guess — the hard failure stands', () => {
		expect(codes(parseBoards(m().after).fails)).toEqual(['board.unstaffed']);
		expect(m().after).toContain('| 05 | the live charge nobody staffed | 01 | unstaffed | OPEN |');
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
		for (const n of ['conforming/board.md', 'conforming/board-absences.md', 'conforming/board-standard.md',
			'conforming/ledger.md', 'conforming/ledger-standard.md', 'conforming/decisions.md',
			'conforming/decisions-standard.md', 'pre-d63/board.md', 'pre-d63/ledger.md', 'pre-d63/decisions.md',
			'pre-d63/decisions-inline.md', 'pre-d63/heading/LEDGER.md', 'pre-d63/bare/LEDGER.md',
			'pre-d71/board.md', 'defects/bold-verdict.md', 'defects/truncated.md', 'defects/merged-LEDGER.md',
			'defects/parked-leads.md', 'defects/unstaffed.md']) {
			const p = join(FX, n);
			expect(roundTrip(migrateText(p, readFileSync(p, 'utf8')))).toEqual([]);
		}
	});
});
