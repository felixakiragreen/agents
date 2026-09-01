// `doctrine lint` — the walk, the report, and the totals the DoD is measured against.
// Parser-as-lint (Belvedere README §1): a doc that will not parse is a doc that is lying.

import { readFileSync } from 'fs';
import { basename, sep } from 'path';
import { discover, lastWalk, type Building } from './building';
import { STATES, type Fail } from './grammar';
import { boardIds, isLiveWorkDoc, isSpentWorkDoc, parseDecisions } from './parse';
import { buildingNames, crossingFails, readRegister } from './register';

export { isLiveWorkDoc, isSpentWorkDoc };
import { prefixFails, vocabularyFails } from './vocabulary';

export type Totals = {
	buildings: number; boardDocs: number; boardDocsWithBoard: number; boards: number;
	rows: number; typedRows: number; ledgers: number; ledgerEntries: number; tails: number;
	fireableBatons: number; workDocs: number; kickoffs: number; decisions: number;
	decisionQueue: number; issues: number; worktreeCopiesSkipped: number;
};

export type LintReport = { buildings: Building[]; fails: Fail[]; totals: Totals };


/**
 * `--live` restricts the report to the surfaces a session or the glass reads TODAY:
 * boards, the ledger tail, and the kickoffs of work docs that are still open.
 */
function liveFails(b: Building): Fail[] {
	const openDocs = new Set(b.files.workDocs.filter(f => isLiveWorkDoc(readFileSync(f, 'utf8'))));
	return b.fails.filter(f =>
		f.artifact === 'board'
		// the vocabulary arm only ever reads live surfaces, so `--live` has nothing left to strip
		|| f.artifact === 'prose'
		// the building register is read by every discovery — no surface is more live (D79)
		|| f.artifact === 'register'
		|| (f.artifact === 'ledger' && b.ledgerTail !== null && f.line === b.ledgerTail.line)
		|| (f.artifact === 'kickoff' && openDocs.has(f.file)));
}

// ---------- the vocabulary arm (C26) ----------
//
// The fence, in one place: which FILES are law surfaces. The regions inside them are fenced
// structurally by `mask()`. Voice is named here because a voice surface must never be read at
// all — a lore register is legal there (standard §5/§8), so a hit would be the linter's defect.

const VOICE = ['LOG.md', 'SAPHO.md', 'dream.md'];

/**
 * The law book itself. `canon/` prints the graveyard — §9 IS a table of dead words — and C23
 * respelled it under Felix's own sign-off; C25 fenced it for the same reason. A book that may
 * not name the dead cannot bury them.
 */
const isLawBook = (f: string) => f.split(sep).includes('canon');

/**
 * C25's live list: a building's own master doc and CLAUDE.md, its boards, its OPEN charge docs.
 *
 * And nothing spent. A charge doc that carries a staffing table is filed as a BOARD, so the
 * board half of this list walked straight past the live/spent rule the work-doc half obeys —
 * `plans/18-great-recut.md` landed on 2026-08-29 and was still reporting 11 dead words.
 */
function lawSurfaces(b: Building): string[] {
	const live = b.files.workDocs.filter(f => isLiveWorkDoc(readFileSync(f, 'utf8')));
	return [...new Set([...b.files.prose, ...b.files.boards, ...live])]
		.filter(f => !VOICE.includes(basename(f)) && !isLawBook(f) && !isSpentWorkDoc(readFileSync(f, 'utf8')))
		.sort();
}

function vocabFails(b: Building): Fail[] {
	const out: Fail[] = [];
	for (const f of lawSurfaces(b)) {
		for (const v of vocabularyFails(readFileSync(f, 'utf8'))) { v.file = f; out.push(v); }
	}
	// §7's namespace is a building-altitude fact, so it is reported once per building, at the
	// register — never once per id.
	if (b.files.decisions) {
		const decisions = parseDecisions(readFileSync(b.files.decisions, 'utf8')).decisions;
		const chargeIds = new Set(b.files.boards.flatMap(f => [...boardIds(readFileSync(f, 'utf8'))]));
		for (const v of prefixFails({ chargeIds, decisions })) { v.file = b.files.decisions; out.push(v); }
	}
	return out;
}

/**
 * The register arm (D79). Two readings, one file: a walked building's own `canon/BUILDINGS.md`
 * is linted where it lies — form and dead roots — while every board's qualified ids resolve
 * against the city's ONE register, wherever the walk is pointed.
 */
function registerFails(b: Building, names: Set<string>): Fail[] {
	return [...crossingFails(b, names), ...(b.files.register ? readRegister(b.files.register).fails : [])];
}

export function lint(roots: string[], opts: { live?: boolean; vocab?: boolean } = {}): LintReport {
	const names = buildingNames(readRegister().rows);
	const buildings = discover(roots)
		.map(b => ({ ...b, fails: [...b.fails, ...registerFails(b, names)] }))
		.map(b => opts.vocab ? { ...b, fails: [...b.fails, ...vocabFails(b)] } : b)
		.map(b => opts.live ? { ...b, fails: liveFails(b) } : b);
	const fails = buildings.flatMap(b => b.fails);

	const rows = buildings.flatMap(b => b.board.flatMap(x => x.rows));
	const totals: Totals = {
		buildings: buildings.length,
		boardDocs: buildings.reduce((a, b) => a + b.files.boards.length, 0),
		boardDocsWithBoard: buildings.reduce((a, b) => a + new Set(b.board.map(x => x.file)).size, 0),
		boards: buildings.reduce((a, b) => a + b.board.length, 0),
		rows: rows.length,
		typedRows: rows.filter(r => (r.hexGate || r.dissolved || (r.mantle && r.tier)) && r.state).length,
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
		const typed = rows.filter(x => (x.hexGate || x.dissolved || (x.mantle && x.tier)) && x.state).length;
		const mark = fs.some(f => f.severity === 'fail') ? 'FAIL' : fs.length ? 'warn' : ' ok ';
		out.push(`\n${mark}  ${b.building}  —  ${b.board.length} board(s) · ${typed}/${rows.length} rows typed · ` +
			`ledger ${b.ledgerTail?.date ?? 'none'} · baton ${b.baton ? `${b.baton.holder}${b.baton.instruments.length ? ` ×${b.baton.instruments.length}` : ''}` : 'none'} · ` +
			`${b.kickoffs.length} kickoff(s) · queue ${b.decisionQueue.length}`);
		const byCode = new Map<string, Fail[]>();
		for (const f of fs) byCode.set(f.code, [...(byCode.get(f.code) ?? []), f]);
		for (const [code, list] of [...byCode].sort((a, b2) => b2[1].length - a[1].length)) {
			out.push(`      [${list.length}×${list[0]!.severity === 'warn' ? ' warn' : ''}] ${code} — ${list[0]!.reason}`);
			for (const f of (opts.verbose ? list : list.slice(0, 3)))
				out.push(`           ${rel(f.file)}:${f.line}: ${f.excerpt.replace(/\n/g, '\n             ')}`);
			if (!opts.verbose && list.length > 3) out.push(`           … ${list.length - 3} more (--verbose)`);
		}
	}

	const t = r.totals;
	const tally = (list: Fail[]) => {
		const m = new Map<string, number>();
		for (const f of list) m.set(f.code, (m.get(f.code) ?? 0) + 1);
		return [...m].sort((a, b) => b[1] - a[1]);
	};
	const classes = tally(r.fails.filter(f => f.severity === 'fail'));
	const warnings = tally(r.fails.filter(f => f.severity === 'warn'));
	out.push('\n=== FAILURE CLASSES');
	for (const [code, n] of classes) out.push(`  ${String(n).padStart(4)}  ${code}`);
	if (warnings.length) {
		out.push('\n=== WARNING CLASSES (reported, never auto-fixed — they do not move the exit code)');
		for (const [code, n] of warnings) out.push(`  ${String(n).padStart(4)}  ${code}`);
	}
	out.push('\n=== TOTALS');
	out.push(`  ${t.buildings} buildings · ${t.boardDocsWithBoard}/${t.boardDocs} board docs yielded a board · ${t.boards} boards · ` +
		`${t.rows} rows · ${t.typedRows} fully typed (${t.rows ? (100 * t.typedRows / t.rows).toFixed(0) : 0}%)`);
	out.push(`  ${t.tails}/${t.ledgers} ledgers parsed a tail (${t.ledgerEntries} entries) · ${t.fireableBatons} fireable baton(s) · ` +
		`${t.kickoffs} kickoffs in ${t.workDocs} work docs · ${t.decisions} decisions (queue ${t.decisionQueue}) · ${t.issues} inbox entries`);
	out.push(`  ${t.worktreeCopiesSkipped} worktree checkout(s) skipped as branch copies · per-repo special cases: 0`);
	const failed = r.fails.filter(f => f.severity === 'fail').length;
	out.push(`  ${failed} failure(s) in ${classes.length} class(es)`
		+ (warnings.length ? ` · ${r.fails.length - failed} warning(s) in ${warnings.length} class(es)` : ''));
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
