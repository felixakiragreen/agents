// The statement (D82) — every `⬡ go` on a live surface, each with the count of charges landed
// on top of it. Derived, never kept: the interest is read off the board's Depends-on graph at
// every call, so nothing in the city stores a number that can go stale.
//
// The mask, in one place: a doc that QUOTES the token is naming it, not carrying it. Code spans
// are masked (`maskCode`) and the law book is fenced (`isLawBook`) — STANDARD §7 defines the
// mark by writing `⬡ go 2026-09-01`, and a definition is not a debt.

import { CREDIT_MARK, fail, isLawBook, maskCode, type Fail } from './grammar';
import type { BoardRow } from './parse';

/** Where a mark can be read: the three live surfaces D82 names. */
export type Surface = 'board' | 'decisions' | 'ledger';

export type Credit = {
	surface: Surface;
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
type Site = { surface: Surface; where: string; charge: string | null; file: string; line: number; text: string };

export type CreditSources = {
	boards: { file: string; md: string; rows: BoardRow[] }[];
	decisions: { file: string; md: string; entries: { id: string; line: number }[] } | null;
	ledgerTail: { file: string; line: number; block: string } | null;
};

/**
 * D82's live surfaces: a board's OPEN / IN FLIGHT / LANDED rows (KILLED is spent and BLOCKED is
 * not in the ruling's list), every entry of the decision register, and the ledger's tail.
 */
const LIVE_STATES: readonly (string | null)[] = ['OPEN', 'IN FLIGHT', 'LANDED'];

function sites(src: CreditSources): Site[] {
	const out: Site[] = [];

	for (const b of src.boards) {
		if (isLawBook(b.file)) continue;
		const lines = b.md.split('\n');
		for (const r of b.rows) {
			if (!LIVE_STATES.includes(r.state)) continue;
			// A board row is one line by construction — the whole row is the site, so a mark on the
			// Status annotation and a gate paid on credit in Depends-on are read by one pass.
			out.push({ surface: 'board', where: r.id, charge: r.id, file: b.file, line: r.line, text: lines[r.line - 1] ?? '' });
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
			out.push({ surface: 'decisions', where: heads[k]?.id ?? 'the register', charge: null, file: d.file, line: i + 1, text });
		});
	}

	const t = src.ledgerTail;
	if (t && !isLawBook(t.file))
		t.block.split('\n').forEach((text, i) =>
			out.push({ surface: 'ledger', where: `the tail`, charge: null, file: t.file, line: t.line + i, text }));

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

/** One building's statement, and the undated marks that authorize nothing. */
export function scanCredits(src: CreditSources): { credits: Credit[]; fails: Fail[] } {
	const credits: Credit[] = [];
	const fails: Fail[] = [];
	const interest = interests(src.boards.flatMap(b => b.rows));
	const scan = new RegExp(CREDIT_MARK, 'g');

	for (const s of sites(src)) {
		for (const m of maskCode(s.text).matchAll(scan)) {
			const excerpt = `${s.where}: ${JSON.stringify(s.text.trim().slice(0, 160))}`;
			if (!m[1]) {
				const f = fail(s.surface, 'credit.undated', 'a credit mark carries its date (D82; STANDARD §7) — write "⬡ go ‹YYYY-MM-DD›"; the parser never infers one, so this mark authorizes nothing', excerpt, s.line);
				f.file = s.file;
				fails.push(f);
				continue;
			}
			credits.push({
				surface: s.surface, where: s.where, charge: s.charge, date: m[1],
				interest: s.charge ? interest.get(s.charge) ?? 0 : 0,
				excerpt: s.text.trim().slice(0, 160), file: s.file, line: s.line,
			});
		}
	}
	return { credits, fails };
}

/** The statement's order: the deepest debt first, then the oldest, then where it lies. */
export const byInterest = (a: Credit, b: Credit) =>
	b.interest - a.interest || a.date.localeCompare(b.date) || a.file.localeCompare(b.file) || a.line - b.line;

const rel = (p: string) => p.replace(process.env.HOME + '/', '~/');

export function renderStatement(credits: Credit[], where: string): string {
	if (!credits.length) return `the statement (D82) — nothing on credit: no ⬡ go on a live surface under ${where}.`;

	const sorted = [...credits].sort(byInterest);
	const pad = Math.max(8, ...sorted.map(c => c.where.length));
	const out = ['the statement (D82) — every ⬡ go on a live surface, with the charges landed on top of it', ''];
	for (const c of sorted)
		out.push(`  ${String(c.interest).padStart(4)}  ⬡ go ${c.date}  ${c.where.padEnd(pad)}  ${c.surface.padEnd(9)}  ${rel(c.file)}:${c.line}`);
	out.push('', `  ${sorted.length} on credit · max interest ${sorted[0]!.interest}`);
	return out.join('\n');
}
