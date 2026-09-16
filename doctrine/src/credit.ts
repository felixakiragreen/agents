// The statement (D82) — every `⬡ go` on a live surface, each with the count of charges landed
// on top of it. Derived, never kept: the interest is read off the board's Depends-on graph at
// every call, so nothing in the city stores a number that can go stale.
//
// The mask, in one place: a doc that QUOTES the token is naming it, not carrying it. Code spans
// are masked (`maskCode`) and the law book is fenced (`isLawBook`) — STANDARD §7 defines the
// mark by writing `⬡ go 2026-09-01`, and a definition is not a debt.

import { CREDIT_MARK, MAGNITUDE_MARK, fail, isLawBook, isSizedCredit, maskCode, type Fail } from './grammar';
import type { BoardRow } from './parse';

/** Where a mark can be read: the three live surfaces D82 names. */
export type Surface = 'board' | 'decisions' | 'ledger';

export type Credit = {
	surface: Surface;
	/** The token as written — `⬡ go`, or D90's sized `⬢0.1`: the statement prints what it read. */
	mark: string;
	where: string;              // the mark's address: a row id, a decision id, or the tail's date
	charge: string | null;      // the board row the mark rides — the interest's subject, or null
	date: string;               // the mark's own date; never inferred (D82)
	interest: number;           // charges whose Depends-on chain reaches `charge` and have LANDED
	excerpt: string;
	file: string;
	line: number;
};

/**
 * A line the statement is allowed to read, with the address to file its marks under. The whole
 * surface question is answered here and nowhere else — the scan below reads sites, not files.
 */
type Site = {
	surface: Surface; where: string; charge: string | null; file: string; line: number; text: string;
	/** The date the surface itself carries, for the one mark whose date is optional (D90's ⬢). */
	date: string | null;
};

export type CreditSources = {
	boards: { file: string; md: string; rows: BoardRow[] }[];
	decisions: {
		file: string; md: string;
		/** `magnitude` and `credit` are the ATTRIBUTION's, parsed — never re-read off the prose. */
		entries: { id: string; date: string; line: number; magnitude: number | null; credit: string | null }[];
	} | null;
	ledgerTail: { file: string; line: number; block: string } | null;
};

/**
 * D82's live surfaces: a board's OPEN / IN FLIGHT / LANDED rows (KILLED is spent and BLOCKED is
 * not in the ruling's list), every entry of the decision register, and the ledger's tail.
 */
// BLOCKED is transient by law (DOCTRINE §4) and still owes its review — a mark on it is live (041-F3, G3 2026-09-02)
const LIVE_STATES: readonly (string | null)[] = ['OPEN', 'IN FLIGHT', 'LANDED', 'BLOCKED'];

function sites(src: CreditSources): Site[] {
	const out: Site[] = [];

	for (const b of src.boards) {
		if (isLawBook(b.file)) continue;
		const lines = b.md.split('\n');
		for (const r of b.rows) {
			if (!LIVE_STATES.includes(r.state)) continue;
			// A board row is one line by construction — the whole row is the site, so a mark on the
			// Status annotation and a gate paid on credit in Depends-on are read by one pass.
			out.push({ surface: 'board', where: r.id, charge: r.id, file: b.file, line: r.line, text: lines[r.line - 1] ?? '', date: null });
		}
	}

	const d = src.decisions;
	if (d && !isLawBook(d.file)) {
		// The register is live whole (DOCTRINE §8: the queue and the staging ground), so every line
		// is a site; a mark's address is the entry it falls inside, by the entries' own head lines.
		const heads = [...d.entries].sort((a, b) => a.line - b.line);
		let k = -1;
		d.md.split('\n').forEach((text, i) => {
			while (k + 1 < heads.length && heads[k + 1]!.line <= i + 1) k++;
			out.push({ surface: 'decisions', where: heads[k]?.id ?? 'the register', charge: null, file: d.file, line: i + 1, text, date: heads[k]?.date ?? null });
		});
	}

	const t = src.ledgerTail;
	if (t && !isLawBook(t.file))
		t.block.split('\n').forEach((text, i) =>
			out.push({ surface: 'ledger', where: `the tail`, charge: null, file: t.file, line: t.line + i, text, date: null }));

	return out;
}

/**
 * The interest, per row: charges whose Depends-on chain REACHES this row and have since LANDED.
 * The walk is over the reverse graph and bounded by its own visited set — a board that cites
 * itself in a cycle is a defect the lint files, never a hang here (directive 3.1).
 */
function interests(rows: BoardRow[]): Map<string, number> {
	const dependents = new Map<string, string[]>();
	for (const r of rows) for (const d of r.dependsOn) dependents.set(d, [...(dependents.get(d) ?? []), r.id]);
	const landed = new Set(rows.filter(r => r.state === 'LANDED').map(r => r.id));

	const out = new Map<string, number>();
	for (const r of rows) {
		const seen = new Set([r.id]);
		const queue = [r.id];
		let n = 0;
		for (let i = 0; i < queue.length; i++)
			for (const y of dependents.get(queue[i]!) ?? [])
				if (!seen.has(y)) { seen.add(y); queue.push(y); if (landed.has(y)) n++; }
		out.set(r.id, n);
	}
	return out;
}

/**
 * One building's statement, and the undated marks that authorize nothing.
 *
 * Two tokens, one debt: `⬡ go` (D82) and D90's sized yes BELOW the blessing floor — `⬢0.1` is
 * the go-mark's own rung, so it lands here and accrues interest exactly as the words do. At the
 * floor and above he looked, and a blessing owes nothing: the scan skips it.
 */
export function scanCredits(src: CreditSources): { credits: Credit[]; fails: Fail[] } {
	const credits: Credit[] = [];
	const fails: Fail[] = [];
	const interest = interests(src.boards.flatMap(b => b.rows));
	const go = new RegExp(CREDIT_MARK, 'g');
	const sized = new RegExp(MAGNITUDE_MARK, 'g');

	for (const s of sites(src)) {
		const masked = maskCode(s.text);
		const excerpt = `${s.where}: ${JSON.stringify(s.text.trim().slice(0, 160))}`;
		const owed = (mark: string, date: string | null, line: number) => {
			if (!date) {
				const f = fail(s.surface, 'credit.undated', 'a credit mark carries its date (D82; STANDARD §7) — write "⬡ go ‹YYYY-MM-DD›"; the parser never infers one, so this mark authorizes nothing', excerpt, line);
				f.file = s.file;
				fails.push(f);
				return;
			}
			credits.push({
				surface: s.surface, mark, where: s.where, charge: s.charge, date,
				interest: s.charge ? interest.get(s.charge) ?? 0 : 0,
				excerpt: s.text.trim().slice(0, 160), file: s.file, line,
			});
		};
		for (const m of masked.matchAll(go)) owed('⬡ go', m[1] ?? null, s.line);
		// The sized mark's date is optional by law and the entry it rides answers for it, so a
		// surface carrying no date of its own is where `⬢0.1` can still be undated — and there it
		// authorizes nothing, exactly as the words do. The REGISTER is read from its attributions
		// below, never from this line, so it is skipped here.
		if (s.surface !== 'decisions')
			for (const m of masked.matchAll(sized))
				if (isSizedCredit(Number(m[1]))) owed(`⬢${m[1]}`, m[2] ?? s.date, s.line);
	}

	// D90's mark is a TYPED FIELD of the attribution (§7, and `MARK_TAIL` reads it there), so the
	// register's statement reads the field and never the entry's prose. It is the one distance the
	// mask cannot reach: D90 is the entry that DEFINES the mark, and it writes a bare `⬢0.1` into
	// its own body — a definition is not a debt (D82's mask, at the register instead of the law
	// book). An entry whose attribution carries BOTH marks is already on the statement by its
	// `⬡ go`, and one debt is not two.
	const d = src.decisions;
	if (d && !isLawBook(d.file)) {
		const scanned = new Set(credits.filter(c => c.file === d.file).map(c => c.line));
		for (const e of d.entries) {
			if (e.magnitude === null || !isSizedCredit(e.magnitude) || scanned.has(e.line)) continue;
			const line = d.md.split('\n')[e.line - 1] ?? '';
			credits.push({
				surface: 'decisions', mark: `⬢${e.magnitude}`, where: e.id, charge: null,
				date: e.credit ?? e.date, interest: 0,
				excerpt: line.trim().slice(0, 160), file: d.file, line: e.line,
			});
		}
	}
	return { credits, fails };
}

/** The statement's order: the deepest debt first, then the oldest, then where it lies. */
export const byInterest = (a: Credit, b: Credit) =>
	b.interest - a.interest || a.date.localeCompare(b.date) || a.file.localeCompare(b.file) || a.line - b.line;

const rel = (p: string) => p.replace(process.env.HOME + '/', '~/');

/** The statement in one line — the whole of it is `doctrine statement`; the boot pack prints this. */
export const statementLine = (credits: Credit[]) =>
	`${credits.length} on credit · max interest ${credits.reduce((a, c) => Math.max(a, c.interest), 0)}`;

export function renderStatement(credits: Credit[], where: string): string {
	if (!credits.length) return `the statement (D82) — nothing on credit: no ⬡ go on a live surface under ${where}.`;

	const sorted = [...credits].sort(byInterest);
	const pad = Math.max(8, ...sorted.map(c => c.where.length));
	const mark = Math.max(4, ...sorted.map(c => c.mark.length));
	const out = ['the statement (D82) — every ⬡ go on a live surface, with the charges landed on top of it', ''];
	for (const c of sorted)
		out.push(`  ${String(c.interest).padStart(4)}  ${c.mark.padEnd(mark)} ${c.date}  ${c.where.padEnd(pad)}  ${c.surface.padEnd(9)}  ${rel(c.file)}:${c.line}`);
	out.push('', `  ${statementLine(sorted)}`);
	return out.join('\n');
}
