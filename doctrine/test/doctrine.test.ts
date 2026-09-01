// The control (DOCTRINE §6.2): a parser failing its own fixture indicts the parser.
// Plus the round-trip law, the declared refusals, and row 019's defect fixtures — every fix
// in the wave's harvest pinned to a checked-in reproduction. No test reads outside the repo
// (item 14): live-corpus checks belong to `doctrine lint`, not the suite.

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { basename, join } from 'path';
import {
	batonFails, boardIds, classifyBaton, parseBoards, parseDecisions, parseIssues, parseKickoffs, parseLedger,
} from '../src/parse';
import { migrateText, roundTrip } from '../src/migrate';
import { renderTable, respellTable } from '../src/respell';
import { isId } from '../src/grammar';
import { guardRegressions, isLiveWorkDoc, lint } from '../src/lint';
import { discover, lastWalk, parse, staffsSessions } from '../src/building';
import { crossingFails, parseRegister, walkRegister } from '../src/register';

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
		const row = parseBoards(fx('conforming', 'board.md')).boards[0]!.rows.find(r => r.id === '004')!;
		expect(row.hexGate).toBe(true);
		expect(row.mantle).toBeNull();
		expect(row.rider).toBe('smoke ×3');
		expect(row.state).toBe('LANDED');
		expect(row.annotation).toBe('BLESSED 2026-08-26');
	});

	test('board — the staffing rider never eats the tier (D63d)', () => {
		const row = parseBoards(fx('conforming', 'board.md')).boards[0]!.rows.find(r => r.id === '002')!;
		expect([row.mantle, row.tier, row.rider]).toEqual(['Builder', 'opus-medium', 'worktree']);
	});

	test('board — Depends-on takes exactly two forms (D63e)', () => {
		const rows = parseBoards(fx('conforming', 'board.md')).boards[0]!.rows;
		expect(rows.find(r => r.id === '005')!.dependsOn).toEqual(['001', '002']);
		expect(rows.find(r => r.id === '006')!.dependsOn).toEqual(['003']);
		expect(rows.find(r => r.id === '006')!.gates).toEqual(['budget blessing']);
	});

	test('board — the typed-absence vocabulary conforms (D63 as amended, D71) [items 1, 2]', () => {
		const r = parseBoards(fx('conforming', 'board-absences.md'));
		expect(codes(r.fails)).toEqual([]);
		const rows = r.boards[0]!.rows;
		expect(rows.find(x => x.id === '008')!.dissolved).toBe(true);         // `—` earned by DEFERRED
		expect(rows.find(x => x.id === '008')!.state).toBe('OPEN');           // OPEN — DEFERRED conforms
		expect(rows.find(x => x.id === '009')!.mantle).toBe('unrecorded');
		expect(rows.find(x => x.id === '010')!.tier).toBe('unrecorded');
	});

	test('board — the standard\'s tongue: ⬡-gate in both columns, C‹n› ids, DEFERRED (D71)', () => {
		const r = parseBoards(fx('conforming', 'board-standard.md'));
		expect(codes(r.fails)).toEqual([]);
		const rows = r.boards[0]!.rows;
		expect(rows.find(x => x.id === '025')!.dependsOn).toEqual(['024']);
		expect(rows.find(x => x.id === '025')!.gates).toEqual(['the sovereign\'s read of the diff']);
		// the token is Staffing's and Depends-on's alike, and it carries an annotation
		expect([rows.find(x => x.id === '026')!.hexGate, rows.find(x => x.id === '026')!.rider])
			.toEqual([true, 'his drafts, his pen']);
		expect(rows.find(x => x.id === '026')!.gates).toEqual(['Felix\'s charter drafts']);
		// the one absence left: a DEFERRED charge whose shelving dissolved its staffing
		expect([rows.find(x => x.id === '027')!.dissolved, rows.find(x => x.id === '027')!.state])
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
		expect([r.tail!.date, r.tail!.mantle, r.tail!.tier, r.tail!.row]).toEqual(['2026-08-26', 'Builder', 'opus-high', '003']);
	});

	test('ledger — unrecorded is legal in the mantle and tier slots (item 1)', () => {
		const r = parseLedger('# L\n\n---\n\n**2026-08-07 · unrecorded · unrecorded** — a bare-session forensic entry. Decided: unrecorded. Next: unrecorded.\n');
		expect(codes(r.fails)).toEqual([]);
		expect([r.tail!.mantle, r.tail!.tier]).toEqual(['unrecorded', 'unrecorded']);
	});

	test('ledger — only a leading marker splits the body; a mention never does (036 item 4)', () => {
		const r = parseLedger(fx('conforming', 'ledger-clauses.md'));
		expect(codes(r.fails)).toEqual([]);
		// 001 quotes `Next —` and `Next:` in its own prose — the clause is the one that leads a sentence
		expect(r.entries[0]!.next).toBe('nothing is ignitable here; the checkout is merged and inert.');
		expect(r.entries[0]!.decided).toBe('nothing new — the sweep executes the standard');
		// 002's clauses arrive out of §7's order: each runs to the NEXT marker, never to the end
		expect(r.entries[1]!.next).toBe('**003 is ignitable** — 002 is landed and the engine is untouched.');
		expect(r.entries[1]!.decided).toBe('nothing — findings only');
		// 003 fences a summons whose body writes both markers — code is masked before the search
		expect(r.entries[2]!.next).toBe('ignite 004 (kickoff fenced above).');
	});

	test('ledger — the pre-doctrine bullet dialect still leads its line (036 item 4)', () => {
		const r = parseLedger('# L\n\n---\n\n**2026-08-02 · Architect · unrecorded** — the kernel landed.\n\n- **Decided:** D1, D2.\n- **Next:** Felix gives the go.\n');
		expect(codes(r.fails)).toEqual([]);
		expect([r.tail!.decided, r.tail!.next]).toEqual(['D1, D2', 'Felix gives the go.']);
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
		expect(b.instruments).toEqual([{ kind: 'row', row: '003' }, { kind: 'row', row: '004' }]);
	});

	test('baton — §11\'s holder is written, never inferred (036 item 2, D74)', () => {
		const r = parseLedger(fx('conforming', 'ledger-batons.md'));
		expect(codes(r.fails)).toEqual([]);
		// the ⬡ that used to parse `session` because an instrument outranked the written hand
		expect(r.entries.map(e => classifyBaton(e)!.holder)).toEqual(['felix', 'dispatch', 'session', 'none']);
		expect(r.entries.slice(0, 3).map(e => classifyBaton(e)!.instruments)).toEqual([
			[{ kind: 'row', row: '002' }], [{ kind: 'row', row: '003' }], [{ kind: 'row', row: '004' }],
		]);
		// `Felix` is the same hand in the record's older spelling, and the colon its older separator
		const felix = (line: string) => classifyBaton({ next: 'the baton below.', block: line } as never)!.holder;
		expect([felix('Baton — Felix: bless batch 6.'), felix('Baton — ⬡ Felix → rule the hold.')]).toEqual(['felix', 'felix']);
	});

	test('baton — `Next: none — <why>` owes nothing, and says so (036 item 3, §7)', () => {
		const tail = parseLedger(fx('conforming', 'ledger-batons.md')).tail!;
		expect(tail.next).toBe('none — the rig is current.');
		const b = classifyBaton(tail)!;
		expect([b.holder, b.instruments]).toEqual(['none', []]);
		expect(batonFails(b, 0)).toEqual([]);                       // a typed close is not a dropped baton
		// and the untyped prose it replaces still is
		expect(codes(batonFails(classifyBaton({ next: 'nothing waits.', block: '' } as never), 0))).toEqual(['ledger.baton']);
	});

	test('ledger — a charge id in the head, `ignite <charge-ids>` in the baton (D71)', () => {
		const r = parseLedger(fx('conforming', 'ledger-standard.md'));
		expect(codes(r.fails)).toEqual([]);
		expect(r.entries.map(e => e.row)).toEqual(['023', '024']);
		expect(classifyBaton(r.entries[0]!)!.instruments).toEqual([{ kind: 'row', row: '024' }]);
		expect(classifyBaton(r.tail!)!.instruments).toEqual([{ kind: 'row', row: '025' }, { kind: 'row', row: '026' }]);
	});

	test('baton — `ignite` is the verb, `fire` is the history, prose is neither (§3)', () => {
		const next = (s: string) => classifyBaton({ next: s, block: '' } as never)!;
		expect(next('ignite 024').instruments).toEqual([{ kind: 'row', row: '024' }]);
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

	test('decisions — ⬡✓ is the mark, ⬡✓ is the history, both parse (D71 §7)', () => {
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

// ---------- row 019: the wave's parse-scope and silent-zero fixtures ----------

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
		// the counter-fixture: C11 narrates row 013's landing and conforms (board-absences.md lints 0)
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
			'- **D21** (2026-08-03, Architect (02) · ⬡✓): **Shapes ratified.** dispatched sessions mark "(proposed — pending Felix countersign)". More prose.',
			'- **D68** (2026-08-28, Grand Architect (11) — proposed, pending Felix countersign): **The vocabulary.** Stuff.',
		].join('\n');
		const r = parseDecisions(md);
		expect(r.decisions.find(d => d.id === 'D21')!.pending).toBe(false);         // folded
		expect(r.decisions.find(d => d.id === 'D68')!.pending).toBe(true);          // a real proposed entry
		expect(r.queue.map(d => d.id)).toEqual(['D68']);
	});

	test('every decision id the city ever wrote parses — `‹prefix›-D‹n›` is history now (D80; 031 item 3)', () => {
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

	test('a prefixed-D entry migrates by both decision rules (031 item 3)', () => {
		const head = migrateText('DECISIONS.md', '- **PD-D9 · 2026-08-13 · The pod unit** the body.\n');
		expect(head.after).toBe('- **PD-D9** (2026-08-13): **The pod unit** the body.\n');
		const inline = migrateText('DECISIONS.md', '- **TH-D11 (2026-08-13, Felix):** the body.\n');
		expect(inline.after).toBe('- **TH-D11** (2026-08-13, Felix): **unrecorded.** the body.\n');
		expect(roundTrip(head)).toEqual([]);
		expect(roundTrip(inline)).toEqual([]);
	});

	test('the kickoff arm reads the fence it counts — tonight\'s seven, both states (031 item 4)', () => {
		const r = lint([join(FX, 'kickoff')]);
		// exactly the seven pre-door fences, and the one whose door held but whose charter drifted
		expect(codes(r.fails).sort()).toEqual([...Array(7).fill('kickoff.door'), 'kickoff.wear']);
		expect(r.fails.filter(f => f.code === 'kickoff.door').every(f => f.file.endsWith('pre-door.md'))).toBe(true);
		// the repaired seven, the spent docs' pre-door fences, and the inline stanza: silent
		expect(r.fails.filter(f => /\/(?:door|landed|killed)\.md$/.test(f.file))).toEqual([]);
		// LANDED and KILLED are one rule — a spent charge's fence is history either way (036 item 1)
		expect(r.totals.kickoffs).toBe(17);
	});

	test('the arm is the live doc\'s alone; the summons line is still everyone\'s (031 item 4)', () => {
		const stale = '```\nYou are a Builder at opus-high.\nWear ~/code/agents/canon/mantles/builder.md,\nthen execute the charge.\n```';
		expect(codes(parseKickoffs(stale, { live: true }).fails)).toEqual(['kickoff.door']);
		expect(codes(parseKickoffs(stale).fails)).toEqual([]);          // LANDED / KILLED: history
		// the §5 skeleton's own Status line is what arms it
		expect([true, false, false].map((_, i) =>
			isLiveWorkDoc(['**Status:** OPEN — laid 2026-08-29', '**Status:** LANDED 2026-08-29', 'no header at all'][i]!)))
			.toEqual([true, false, false]);
		// a malformed summons line is reported once — the door is not piled on top of it
		expect(codes(parseKickoffs('```\nYou are a Builder.\nWear the mantle.\n```', { live: true }).fails))
			.toEqual(['kickoff.summons']);
		// the path travels: the grammar is checked, the account\'s home is not
		const other = '```\nYou are a Digger at fable-high.\nEnter by the door — read /Users/x/code/agents/canon/GUILD.md,\nwear /Users/x/code/agents/canon/mantles/digger.md,\nthen dig.\n```';
		expect(codes(parseKickoffs(other, { live: true }).fails)).toEqual([]);
	});

	test('the inline stanza is an ignition with no charter to wear, and passes (031 item 4)', () => {
		const stanza = '```\nYou are an Agent of the Guild — a hive building a city; files carry the truth.\nSweep the relay queue.\n```';
		const r = parseKickoffs(stanza, { live: true });
		expect([r.fails, r.kickoffs, r.fences]).toEqual([[], [], 0]);
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

	test('the clause pass reads the MIGRATED document, not the stale one (031 item 1)', () => {
		// whiteboardy-shaped: bare heads multiply the entries (0 parsed → 4) while field rules
		// repair the clauses those same heads carry. Pre-031 the clause pass read the source
		// bytes and stamped 4 false `unrecorded` fills into entries with a real clause — and
		// printed `round-trip ok` for all of them, because `decided`/`next` are declared fields.
		const m = migrateText(join(FX, 'pre-d63', 'dialect', 'LEDGER.md'), fx('pre-d63/dialect', 'LEDGER.md'));
		expect(parseLedger(m.before).entries).toHaveLength(0);
		const after = parseLedger(m.after);
		expect(codes(after.fails)).toEqual([]);
		expect(after.entries).toHaveLength(4);
		// three real clauses survive; only the entry that never recorded one is typed
		expect(after.entries.map(e => [e.row, e.decided])).toEqual([
			['E7', '(inside the fence) the clipboard verbs are NOT dispatched as verbs'],
			['E8', 'nothing new — spec §7.4 followed as written'],
			['E9', '(scope: the verb table) softBreak joins UNGROUPED beside undo/redo'],
			['E10', 'unrecorded'],
		]);
		expect(after.entries.map(e => e.next)).toEqual([
			'dispatch E8 per the batch-4 chain.',
			'dispatch E9 (soft line breaks, §7.5).',
			'(gate 10) Felix reads the diff.',
			'unrecorded.',
		]);
		// the count is the whole claim: 2 fills, both E10's — pre-031 wrote 6
		expect(m.after.match(/unrecorded/g)).toHaveLength(2);
		expect(after.entries[3]!.block).toContain('Decided: unrecorded. Next: unrecorded.');
		expect(roundTrip(m)).toEqual([]);
	});

	test('a clause spelling no rule repairs is refused, never filled (031 item 1)', () => {
		// Both live in whiteboardy and neither is a migrate rule: a third label spelling, and a
		// scope parenthetical that wraps past its own line. A fill would be a lie; the refusal
		// leaves an honest `ledger.decided` failure for a session to spell.
		const entry = (clause: string) => `# L\n\n---\n\n2026-08-16 · Builder · opus-high (E7 — w)\nChanged: the thing.\n${clause}\nNext: dispatch E8.\n`;
		for (const clause of ['Decided/measured: **the §3.4 pan is gone** — 0 px on every build.',
			'Decided (Architect scope, Felix\'s veto live — same class as the two\nalready-recorded ones): the amendment stands.']) {
			const m = migrateText('LEDGER.md', entry(clause));
			expect([clause, m.after.includes('unrecorded')]).toEqual([clause, false]);
			expect(codes(parseLedger(m.after).fails)).toEqual(['ledger.decided']);
			expect(roundTrip(m)).toEqual([]);
		}
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

	test('the house clause dialect molts: the colon relocates, the joiner becomes a colon (031 item 2)', () => {
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

	test('the dialect rules refuse everything that is not a clause head (031 item 2)', () => {
		const refuses = [
			'Decided: (inside the fence) already home.',       // idempotent — the conforming form
			'The board Decided (scope): mid-prose is 025-F2\'s other shape, not this rule\'s.',
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
		for (const n of ['board.md', 'ledger.md', 'decisions.md', 'decisions-inline.md', 'heading/LEDGER.md', 'bare/LEDGER.md', 'dialect/LEDGER.md']) {
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

	test('a worktree checkout is skipped whatever its branch name is shaped like (036 item 5)', () => {
		// `bv/029-summon-harness` puts TWO segments where one was assumed, so no file under the
		// checkout ever resolved to its twin: 2 buildings → 4, 84 rows → 168, in the real city.
		const r = lint([join(FX, 'worktree', 'repo')]);
		expect([r.totals.buildings, r.totals.rows, r.totals.ledgers]).toEqual([1, 3, 1]);
		expect(r.totals.worktreeCopiesSkipped).toBe(2);              // the README and LEDGER copies
		expect(codes(r.fails)).toEqual([]);
		// and the skip is not blanket: the branch's own BOARD.md has no mainline twin, so it stays
		expect(r.buildings[0]!.board.flatMap(b => b.rows).map(x => x.id).sort()).toEqual(['C1', 'C2', 'C3']);
	});

	test('a building\'s board reads out of BOARD.md, the master doc carrying none (036 item 6, D78)', () => {
		const b = parse(join(FX, 'board-file'));
		expect(b.files.boards.map(f => basename(f))).toEqual(['BOARD.md']);
		expect(b.board.flatMap(x => x.rows).map(r => r.id)).toEqual(['001', '002', '003']);
		expect(b.fails).toEqual([]);
		expect(b.ledgerTail!.row).toBe('001');                        // the master doc is still prose
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
				'pre-d63/dialect/LEDGER.md',
			'pre-d71/board.md', 'defects/bold-verdict.md', 'defects/truncated.md', 'defects/merged-LEDGER.md',
			'defects/parked-leads.md', 'defects/unstaffed.md']) {
			const p = join(FX, n);
			expect(roundTrip(migrateText(p, readFileSync(p, 'utf8')))).toEqual([]);
		}
	});
});

// ---------- the building register (039, D79) ----------

describe('the building register', () => {
	const REG = (kind: string) => join(FX, 'register', kind, 'canon', 'BUILDINGS.md');

	test('a clean register lints clean, and hangs off the building that keeps it', () => {
		const r = lint([join(FX, 'register', 'good')]);
		expect(codes(r.fails)).toEqual([]);
		expect(r.buildings.map(b => b.files.register)).toEqual([join(FX, 'register', 'good', 'canon', 'BUILDINGS.md'), null]);
	});

	test('every defect class fails at its own line — a dead Root names the row', () => {
		const r = lint([join(FX, 'register', 'defects')]);
		expect(r.fails.map(f => [f.code, f.line])).toEqual([
			['register.name', 8],      // duplicate Name — qualified ids demand one root per Name
			['register.kind', 10],     // "tenant" is neither building nor host
			['register.row', 11],      // Name | Kind, no Root
			['register.root', 9],      // `../ghost` is no directory on disk
		]);
		expect(r.fails[3]!.excerpt).toBe(`ghost: ${join(FX, 'register', 'defects', 'ghost')}`);
	});

	test('a file that carries no Name | Kind | Root table is not a register at all', () => {
		const r = parseRegister('# The book\n\nProse, and a table of something else.\n\n| a | b |\n|---|---|\n| 1 | 2 |\n', FX);
		expect(r.rows).toEqual([]);
		expect(codes(r.fails)).toEqual(['register.table']);
	});

	test('discovery\'s universe is the building register: buildings walked, hosts listed, a bare root warned', () => {
		const { entries, fails } = walkRegister(REG('good'));
		expect(entries.map(e => [e.name, e.kind, e.exists, e.buildings.length])).toEqual([
			['alpha', 'building', true, 1],
			['bare', 'building', true, 0],      // registered, founding not yet run
			['campus', 'host', true, 0],        // listed, never walked
		]);
		expect(fails.map(f => [f.code, f.severity])).toEqual([['register.empty', 'warn']]);
	});

	test('a declared worktree root is entered directly: the mainline twin dedupes away, the branch-only building surfaces (D79)', () => {
		const { entries, fails } = walkRegister(REG('worktree'));
		const checkout = join(FX, 'register', 'worktree', 'repo', '.claude', 'worktrees', 'user-manual');
		expect(entries.map(e => [e.name, e.buildings.map(b => b.path)])).toEqual([
			['mainline', []],                                     // the host is never walked
			['manny', [join(checkout, 'manny')]],                 // the tenant's twin is not a building here
		]);
		expect(fails).toEqual([]);

		const b = discover([checkout]);
		expect(lastWalk.suppressed).toBe(1);                     // `tenant/LEDGER.md`, the mainline's copy
		expect(b[0]!.board.flatMap(x => x.rows).map(r => r.id)).toEqual(['C1', 'C2']);
	});

	test('Depends-on\'s third form: the qualified id parses beside the local id and the gate', () => {
		const rows = parseBoards(readFileSync(join(FX, 'register', 'good', 'alpha', 'BOARD.md'), 'utf8')).boards[0]!.rows;
		expect(rows.map(r => [r.dependsOn, r.crossings, r.gates])).toEqual([
			[[], [], []],
			[[], ['stigmergon:S1'], []],
			[['C1'], ['stigmergon:S1'], ['his read of the diff']],
		]);
	});

	test('the crossing resolves against register Names — an unregistered building half is a failure', () => {
		const alpha = parse(join(FX, 'register', 'good', 'alpha'));
		expect(crossingFails(alpha, new Set(['stigmergon']))).toEqual([]);
		const fails = crossingFails(alpha, new Set(['somewhere-else']));
		expect(fails.map(f => [f.code, f.excerpt])).toEqual([
			['board.crossing', 'C2: "stigmergon:S1"'],
			['board.crossing', 'C3: "stigmergon:S1"'],
		]);
		expect(fails[0]!.file).toBe(join(FX, 'register', 'good', 'alpha', 'BOARD.md'));
	});
});

// ---------- §7's id namespace: the respell (D80, D81's first act) ----------

describe('the id respell', () => {
	const board = fx('respell', 'BOARD.md');
	const table = respellTable(boardIds(board), 'agents');
	const run = (name: string) =>
		migrateText(join(FX, 'respell', name), fx('respell', name), { respell: table, passes: ['respell'] });

	test('the table derives from the board — a charge pads, a KIND keeps its letter', () => {
		expect([...table.ids]).toEqual([['7', '007'], ['08', '008'], ['C23', '023'], ['C24', '024']]);
		expect(table.ids.has('G2')).toBe(false);                 // G is a kind (STANDARD §7)
		expect(renderTable(table).split('\n')[0]).toBe('  7   → 007');
		expect(renderTable(respellTable(['001', 'G1']))).toContain('already conforms');
	});

	test('the board respells whole: the ID cell, Depends-on, the link and the path', () => {
		const rows = parseBoards(run('BOARD.md').after).boards[0]!.rows;
		expect(rows.map(r => r.id)).toEqual(['007', '008', '023', '024', 'G2']);
		expect(rows.map(r => r.workDoc)).toEqual([
			'plans/007-first.md', 'plans/008-rig.md', 'plans/023-law-book.md',
			'plans/024-parser.md', 'plans/g2-024-merge.md',
		]);
		expect(rows[3]!.dependsOn).toEqual(['023', '008']);      // `,` is a separator the parser reads
		expect(rows[1]!.annotation).toContain('lab/008');
	});

	test('the dead compounds and the mark go with the ids (D80, D81)', () => {
		const after = run('BOARD.md').after;
		expect(after).toContain('⬡✓, ruled at grand-architect-19');
		expect(after).toContain('023-F2 cleared, distillation candidate 1 folded');
	});

	test('the ledger head, the baton and the typed prose slots respell', () => {
		const r = parseLedger(run('LEDGER.md').after);
		expect(r.entries.map(e => e.row)).toEqual(['023', '008']);
		expect(r.entries[0]!.next).toBe('ignite 024 — kickoff in [plans/024-parser.md](024-parser.md).');
		expect(r.entries[1]!.next).toBe('row 007 is closed; charge 023\'s findings are filed.');
		expect(r.entries[0]!.decided).toBe('D71 ⬡✓');
	});

	test('what the respell must NOT reach: a named form, a kind, another building', () => {
		const after = run('BOARD.md').after;
		expect(after).toContain('The historical forms `C23`, `GA-19` and\n`✓ Felix` are named here');
		expect(after).toContain('| G2 | [the merge gate](plans/g2-024-merge.md)');
		expect(after).toContain('/Users/felix/code/whiteboardy/plans/08-far.md');
	});

	test('the round-trip law, and the converter is a fixed point on its own output', () => {
		for (const name of ['BOARD.md', 'LEDGER.md']) {
			const m = run(name);
			expect(roundTrip(m)).toEqual([]);
			const again = migrateText(m.file, m.after, { respell: respellTable(boardIds(m.after), 'agents'), passes: ['respell'] });
			expect(again.edits).toEqual([]);
		}
	});

	test('the padded id and the name-stamp are ids the parser reads (§7, D80)', () => {
		for (const id of ['000', '007', '040', 'G2', 'grand-architect-21', 'mentat-02', 'C23'])
			expect(isId(id)).toBe(true);
		for (const word of ['the', 'Builder', '—']) expect(isId(word)).toBe(false);
	});

	test('a name-stamp in the ledger head\'s id slot parses (the Mentat\'s precedent)', () => {
		for (const stamp of ['grand-architect-21', 'mentat-02']) {
			const r = parseLedger(`# L\n\n---\n\n**2026-09-01 · Grand Architect · fable-max (${stamp})** — x. Decided: y. Next: z.\n`);
			expect(codes(r.fails)).toEqual([]);
			expect(r.tail!.row).toBe(stamp);
		}
	});
});
