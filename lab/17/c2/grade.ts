// lab/17 — C2 grader. Mechanical: read answers are scored against ground truth computed
// from the twin (fidelity-asserted against the corpus, so it grades both arms fairly);
// writes are scored by the doctrine parser — the M arm's output directly, the S arm's
// after render.ts's serializer — first-try conformance, no leniency passes.
//
//   bun lab/17/c2/grade.ts            # grades every lab/17/c2/runs/*.json

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { parseBoards, parseLedger } from '../../../doctrine/src/parse';

const DIR = join(import.meta.dir);
const twin = (f: string) => JSON.parse(readFileSync(join(DIR, '..', 'twin', f), 'utf8'));

// ---------- ground truth, computed ----------
const board = twin('board.json')[0].rows as { id: string; state: string | null; dependsOn: string[]; gates: string[]; annotation: string }[];
const landed = new Set(board.filter(r => r.state === 'LANDED').map(r => r.id));
// Mechanical q1 gives ["13","17"]: rows 13/14's status cells still LEAD with OPEN — the
// landings live only in annotation prose (a stale-lead corpus wart, filed as a C2
// finding). Human truth — the board's own batch note: 17 is "the one fire-now row".
const q1Mechanical = board.filter(r =>
	r.state === 'OPEN' && r.dependsOn.every(d => landed.has(d)) &&
	r.gates.every(g => /paid/i.test(g))).map(r => r.id);
const TRUTH = {
	q1: ['17'],
	q5deps: board.find(r => r.id === '18')!.dependsOn,
	q5dependents: board.filter(r => r.dependsOn.includes('16')).map(r => r.id),
	q7: ['D68', 'D69', 'D70'],
};

type Any = Record<string, unknown>;
const S = (x: unknown) => JSON.stringify(x ?? '').toLowerCase();
const setEq = (a: unknown, want: string[]) =>
	Array.isArray(a) && a.length === want.length && want.every(w => a.map(String).includes(w));

// per-question checkers → 1 | 0 (+ notes)
function gradeReads(r: Any): { score: number; wrong: string[]; d21Trap: boolean } {
	const wrong: string[] = [];
	const ok = (name: string, pass: boolean) => { if (!pass) wrong.push(name); return pass ? 1 : 0; };
	let n = 0;
	n += ok('q1', setEq(r.q1, TRUTH.q1));
	if (Array.isArray(r.q1) && (r.q1.includes('13') || r.q1.includes('14'))) wrong.push('q1-STALE-LEAD');
	n += ok('q2', /digger/i.test(S((r.q2 as Any)?.mantle)) && S((r.q2 as Any)?.tier).includes('fable-high'));
	n += ok('q3', /row.?id/i.test(S(r.q3)) && /felix-gate/i.test(S(r.q3)));
	n += ok('q4', /felix/i.test(S((r.q4 as Any)?.holder)) && /d68|countersign/i.test(S((r.q4 as Any)?.action)));
	n += ok('q5', setEq((r.q5 as Any)?.row18DependsOn, TRUTH.q5deps) && setEq((r.q5 as Any)?.dependentsOf16, TRUTH.q5dependents));
	n += ok('q6', S((r.q6 as Any)?.date).includes('2026-08-22') && Number((r.q6 as Any)?.assertions) === 170);
	const q7 = Array.isArray(r.q7) ? r.q7.map(String) : [];
	const q7core = TRUTH.q7.every(d => q7.includes(d)) && !q7.includes('D21'); // D6 tolerated either way
	n += ok('q7', q7core && q7.every(d => [...TRUTH.q7, 'D6'].includes(d)));
	n += ok('q8', /absence|not recorded|unknown|never .*guess/i.test(S((r.q8 as Any)?.meaning)) && /evidence|commit|session/i.test(S((r.q8 as Any)?.whoReplaces)));
	n += ok('q9', /open/i.test(S((r.q9 as Any)?.state)) && /defer|bless|felix/i.test(S((r.q9 as Any)?.reason)));
	n += ok('q10', /dispatcher/i.test(S((r.q10 as Any)?.mantle)) && S((r.q10 as Any)?.tier).includes('sonnet-medium') && /wave|8|architect/i.test(S((r.q10 as Any)?.tends)));
	return { score: n, wrong, d21Trap: q7.includes('D21') };
}

// ---------- writes: both arms judged by the same parser ----------
const HEADER = '## board\n\n| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n';
const rowLine = (r: Any) => {
	const work = r.workDoc ? `[${r.work}](${r.workDoc})` : String(r.work ?? '');
	const deps = [...(r.dependsOn as string[] ?? []), ...((r.gates as string[]) ?? []).map(g => `Felix-gate: ${g}`)].join(' · ') || '—';
	const staff = (r.felixGate ? 'Felix-gate' : `${r.mantle} · ${r.tier}`) + (r.rider ? ` (${r.rider})` : '');
	const status = r.state ? (r.annotation ? `${r.state} — ${r.annotation}` : String(r.state)) : String(r.annotation ?? '');
	return `| ${r.id} | ${work} | ${deps} | ${staff} | ${status} |`;
};
const ledgerBlock = (e: Any) =>
	`**${e.date} · ${e.mantle} · ${e.tier}${e.row ? ` (${e.row})` : ''}** — ${e.body}`;

function gradeWrites(r: Any, arm: 'M' | 'S'): { score: number; wrong: string[] } {
	const wrong: string[] = [];
	const ok = (name: string, pass: boolean) => { if (!pass) wrong.push(name); return pass ? 1 : 0; };
	let n = 0;

	// w1 — the ledger entry
	{
		const md = arm === 'M' ? String(r.w1 ?? '') : (r.w1 && typeof r.w1 === 'object' ? ledgerBlock(r.w1 as Any) : '');
		const p = parseLedger(md);
		const e = p.entries[0];
		n += ok('w1', p.fails.length === 0 && p.entries.length === 1 &&
			e!.date === '2026-08-28' && e!.mantle === 'Digger' && e!.tier === 'fable-high' && e!.row === '17' &&
			/nothing/i.test(e!.decided ?? '') && /fire 19/.test(e!.next ?? ''));
	}
	// w2/w3 — board rows, parsed in the context of the real board (knownIds resolve)
	const base = twin('board.json')[0].rows as Any[];
	const boardMd = (rows: Any[]) => HEADER + rows.map(rowLine).join('\n') + '\n';
	const baselineFails = parseBoards(boardMd(base)).fails.length;
	{
		const line = arm === 'M' ? String(r.w2 ?? '') : (r.w2 && typeof r.w2 === 'object' ? rowLine(r.w2 as Any) : '');
		const p = parseBoards(boardMd(base) + line + '\n');
		const row = p.boards[0]?.rows.find(x => x.id === '23');
		n += ok('w2', p.fails.length === baselineFails && !!row &&
			row.work === 'the tier ledger' && setEq(row.dependsOn, ['21']) &&
			row.mantle === 'Architect' && row.tier === 'fable-high' &&
			row.state === 'OPEN' && /cut 2026-08-28/.test(row.annotation));
	}
	{
		const line = arm === 'M' ? String(r.w3 ?? '') : (r.w3 && typeof r.w3 === 'object' ? rowLine(r.w3 as Any) : '');
		const rows = base.map(x => x.id === '22' ? '__SLOT__' : x);
		const md = HEADER + rows.map(x => x === '__SLOT__' ? line : rowLine(x as Any)).join('\n') + '\n';
		const p = parseBoards(md);
		const row = p.boards[0]?.rows.find(x => x.id === '22');
		n += ok('w3', p.fails.length === baselineFails && !!row &&
			row.state === 'IN FLIGHT' && /dispatched 2026-08-28/.test(row.annotation) &&
			row.gates.length === (base.find(x => x.id === '22') as Any).gates.length);
	}
	return { score: n, wrong };
}

console.log('ground truth  q1:', TRUTH.q1, '(mechanical:', q1Mechanical, ')', ' q5deps:', TRUTH.q5deps, ' q5dependents:', TRUTH.q5dependents);
const runsDir = join(DIR, 'runs');
for (const f of readdirSync(runsDir).filter(x => x.endsWith('.json')).sort()) {
	const arm = f.startsWith('S') ? 'S' : 'M';
	let r: Any;
	try { r = JSON.parse(readFileSync(join(runsDir, f), 'utf8')); }
	catch (e) { console.log(`${f}: UNPARSEABLE — ${String(e).slice(0, 80)}`); continue; }
	const reads = gradeReads(r), writes = gradeWrites(r, arm);
	console.log(`${f} [${arm}]  reads ${reads.score}/10  writes ${writes.score}/3` +
		`${reads.d21Trap ? '  D21-TRAP' : ''}${reads.wrong.length || writes.wrong.length ? '  wrong: ' + [...reads.wrong, ...writes.wrong].join(',') : ''}`);
}
