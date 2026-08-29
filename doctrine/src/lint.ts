// `doctrine lint` — the walk, the report, and the totals the DoD is measured against.
// Parser-as-lint (Belvedere README §1): a doc that will not parse is a doc that is lying.

import { readFileSync } from 'fs';
import { discover, lastWalk, type Building } from './building';
import { STATES, type Fail } from './grammar';

export type Totals = {
	buildings: number; boardDocs: number; boardDocsWithBoard: number; boards: number;
	rows: number; typedRows: number; ledgers: number; ledgerEntries: number; tails: number;
	fireableBatons: number; workDocs: number; kickoffs: number; decisions: number;
	decisionQueue: number; issues: number; worktreeCopiesSkipped: number;
};

export type LintReport = { buildings: Building[]; fails: Fail[]; totals: Totals };

/** A work doc is live while its own header state is unfinished — the §5 skeleton's Status line. */
export function isLiveWorkDoc(md: string): boolean {
	const m = md.match(/^\*\*Status:\*\*\s*(.+)$/m);
	if (!m) return false;
	const head = m[1]!.replace(/\*\*/g, '').trim().toUpperCase();
	return head.startsWith('OPEN') || head.startsWith('IN FLIGHT') || head.startsWith('BLOCKED');
}

/**
 * `--live` restricts the report to the surfaces a session or the glass reads TODAY:
 * boards, the ledger tail, and the kickoffs of work docs that are still open.
 */
function liveFails(b: Building): Fail[] {
	const openDocs = new Set(b.files.workDocs.filter(f => isLiveWorkDoc(readFileSync(f, 'utf8'))));
	return b.fails.filter(f =>
		f.artifact === 'board'
		|| (f.artifact === 'ledger' && b.ledgerTail !== null && f.line === b.ledgerTail.line)
		|| (f.artifact === 'kickoff' && openDocs.has(f.file)));
}

export function lint(roots: string[], opts: { live?: boolean } = {}): LintReport {
	const buildings = discover(roots).map(b => opts.live ? { ...b, fails: liveFails(b) } : b);
	const fails = buildings.flatMap(b => b.fails);

	const rows = buildings.flatMap(b => b.board.flatMap(x => x.rows));
	const totals: Totals = {
		buildings: buildings.length,
		boardDocs: buildings.reduce((a, b) => a + b.files.boards.length, 0),
		boardDocsWithBoard: buildings.reduce((a, b) => a + new Set(b.board.map(x => x.file)).size, 0),
		boards: buildings.reduce((a, b) => a + b.board.length, 0),
		rows: rows.length,
		typedRows: rows.filter(r => (r.felixGate || r.dissolved || (r.mantle && r.tier)) && r.state).length,
		ledgers: buildings.filter(b => b.files.ledger).length,
		ledgerEntries: buildings.reduce((a, b) => a + b.ledgerEntries, 0),
		tails: buildings.filter(b => b.ledgerTail).length,
		fireableBatons: buildings.filter(b => b.baton?.instruments.length).length,
		workDocs: buildings.reduce((a, b) => a + b.files.workDocs.length, 0),
		kickoffs: buildings.reduce((a, b) => a + b.kickoffs.length, 0),
		decisions: buildings.reduce((a, b) => a + b.decisions, 0),
		decisionQueue: buildings.reduce((a, b) => a + b.decisionQueue.length, 0),
		issues: buildings.reduce((a, b) => a + b.issues.length, 0),
		worktreeCopiesSkipped: lastWalk.suppressed,
	};
	return { buildings, fails, totals };
}

// ---------- report ----------

const rel = (p: string) => p.replace(process.env.HOME + '/', '~/');

export function render(r: LintReport, opts: { verbose?: boolean } = {}): string {
	const out: string[] = [];
	for (const b of r.buildings) {
		const fs = b.fails;
		const rows = b.board.flatMap(x => x.rows);
		const typed = rows.filter(x => (x.felixGate || x.dissolved || (x.mantle && x.tier)) && x.state).length;
		out.push(`\n${fs.length ? 'FAIL' : ' ok '}  ${b.building}  —  ${b.board.length} board(s) · ${typed}/${rows.length} rows typed · ` +
			`ledger ${b.ledgerTail?.date ?? 'none'} · baton ${b.baton ? `${b.baton.holder}${b.baton.instruments.length ? ` ×${b.baton.instruments.length}` : ''}` : 'none'} · ` +
			`${b.kickoffs.length} kickoff(s) · queue ${b.decisionQueue.length}`);
		const byCode = new Map<string, Fail[]>();
		for (const f of fs) byCode.set(f.code, [...(byCode.get(f.code) ?? []), f]);
		for (const [code, list] of [...byCode].sort((a, b2) => b2[1].length - a[1].length)) {
			out.push(`      [${list.length}×] ${code} — ${list[0]!.reason}`);
			for (const f of (opts.verbose ? list : list.slice(0, 3)))
				out.push(`           ${rel(f.file)}:${f.line}: ${f.excerpt.replace(/\n/g, '\n             ')}`);
			if (!opts.verbose && list.length > 3) out.push(`           … ${list.length - 3} more (--verbose)`);
		}
	}

	const t = r.totals;
	const classes = new Map<string, number>();
	for (const f of r.fails) classes.set(f.code, (classes.get(f.code) ?? 0) + 1);
	out.push('\n=== FAILURE CLASSES');
	for (const [code, n] of [...classes].sort((a, b) => b[1] - a[1])) out.push(`  ${String(n).padStart(4)}  ${code}`);
	out.push('\n=== TOTALS');
	out.push(`  ${t.buildings} buildings · ${t.boardDocsWithBoard}/${t.boardDocs} board docs yielded a board · ${t.boards} boards · ` +
		`${t.rows} rows · ${t.typedRows} fully typed (${t.rows ? (100 * t.typedRows / t.rows).toFixed(0) : 0}%)`);
	out.push(`  ${t.tails}/${t.ledgers} ledgers parsed a tail (${t.ledgerEntries} entries) · ${t.fireableBatons} fireable baton(s) · ` +
		`${t.kickoffs} kickoffs in ${t.workDocs} work docs · ${t.decisions} decisions (queue ${t.decisionQueue}) · ${t.issues} inbox entries`);
	out.push(`  ${t.worktreeCopiesSkipped} worktree checkout(s) skipped as branch copies · per-repo special cases: 0`);
	out.push(`  ${r.fails.length} failure(s) in ${classes.size} class(es)`);
	return out.join('\n');
}

// ---------- the count-regression guard (item 18) ----------
//
// Damage can LOWER the fail count — a merged entry takes its own tier-fail down with it
// (row 17 C1) — so fail deltas are a lying health gauge; entity counts are not. The guard
// compares the entity totals a lint already prints against the same paths at a git ref and
// fails loudly on ANY decrease. A guard, not a law: an intentional deletion overrides by
// running without the flag, visibly.

const GUARDED: (keyof Totals)[] = [
	'buildings', 'boardDocs', 'boardDocsWithBoard', 'boards', 'rows',
	'ledgers', 'ledgerEntries', 'tails', 'workDocs', 'kickoffs', 'decisions', 'issues',
];

/** Every entity total that shrank, named — empty means the current tree lost nothing. */
export function guardRegressions(ref: Totals, cur: Totals): string[] {
	return GUARDED.filter(k => cur[k] < ref[k]).map(k => `${k}: ${ref[k]} at the ref → ${cur[k]} now`);
}

export const LIFECYCLE = STATES;
