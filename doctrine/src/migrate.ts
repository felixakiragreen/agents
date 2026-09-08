// `doctrine migrate` — parse, then re-emit in the current grammar. FORM ONLY (D63's molt
// clause): the converter never paraphrases, so every rule below is a total, line-scoped
// string replacement that a reviewer can defend by reading the diff.
//
// What migrate deliberately REFUSES, and why:
//   · kickoff fences — "nobody edits a kickoff except the Architect re-cutting the row" (§5).
//   · ISSUES entries — the inbox drains empty by law (D53); a converter for content designed
//     to be deleted is spend without buy, and the non-conforming inboxes hold struck history
//     awaiting their Architects' sweeps, not text a tool should canonize.
//   · anything whose target is a judgment (a `CHARTERED` status, a missing decider, a session
//     title stuck in a ledger's bold run). Those stay lint failures with a human's name on them.

import { basename, join, resolve, sep } from 'path';
import { readFileSync, statSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import {
	DECISION_ID, DEFERRED, FELIX_GATE, HEX_GATE, PARKED, RETIRED, UNRECORDED, UNSTAFFED, VERDICTS,
	isId, isMantle, isTier, leadingToken, strip, topSplit, trailingParen,
} from './grammar';
import { boardIds, isBoardHeader, parseBoards, parseDecisions, parseLedger, tables } from './parse';
import { LIMITS, discover, parse as parseBuilding, type Building } from './building';
import {
	EMPTY, respellDepends, respellIdCell, respellNormal, respellTable, respellText, ticksLeftOpen,
	type Respell, type Scope,
} from './respell';

/**
 * D63's typed-absence license is about HISTORY: where a pre-doctrine source never held a
 * required field, migration writes the literal `unrecorded`. An entry written after D63
 * landed has no such excuse — its absence is a session's lint failure, never the converter's
 * token to stamp.
 */
const D63_LANDED = '2026-08-26';
const preD63 = (date: string) => date < D63_LANDED;

export type Edit = { line: number; from: string; to: string; rule: string };
export type Migration = { file: string; before: string; after: string; edits: Edit[]; respell: Respell };

/** What a line rule can see beyond its own line, and what it can return beyond a rewrite. */
export type LineCtx = {
	prev: string | null;
	ahead: (k: number) => string | null;
	respell: Respell;
	/** A code-tick span the lines above left open — the respell's mask reads it (respell.ts). */
	openTick: boolean;
	/** `.md` is a document (bare ids are addresses); anything else takes the path forms only. */
	scope: Scope;
};
type LineResult = string | { to: string; eat: number } | null;

/** What a cell rule can see beyond its own cell: the building's ids, its own row, the table. */
export type CellCtx = { ids: Set<string>; cells: string[]; respell: Respell };

/**
 * Two classes of rule, and a file is eligible for one or both. The STRUCTURAL rules read a typed
 * artifact — a board, the ledger, the decision register — and would be nonsense anywhere else.
 * The RESPELL reads every document the building keeps, because an id is an address wherever it
 * is written (D80/D81) and a link that stops resolving is the whole cost of a partial run.
 */
type Pass = 'structural' | 'respell';

/** A rule names the parsed fields it is licensed to alter — the round-trip law reads this. */
type Rule = {
	id: string;
	pass: Pass;
	changes: string[];
	/** Rewrite one ID/Depends-on/Staffing/Status cell, or return null to decline. */
	cell?: { column: 0 | 2 | 3 | 4; run: (text: string, ctx: CellCtx) => string | null };
	/** Rewrite one whole line (optionally eating following lines), or return null to decline. */
	line?: { files?: RegExp; run: (text: string, ctx: LineCtx) => LineResult };
};

// ---------- §4 the board — cell rules ----------

/** D71 — the gate token respells; `Felix` alone was always the same field, badly typed. */
const staffingHexGate: Rule = {
	id: 'staffing.hex-gate', pass: 'structural', changes: ['mantle', 'tier', 'hexGate', 'rider'],
	cell: {
		column: 3,
		run: t => {
			const { head, inner } = trailingParen(strip(t));
			if (head !== 'Felix' && head !== FELIX_GATE) return null;
			return HEX_GATE + (inner ? ` (${inner})` : '');
		},
	},
};

/** The same token in the other column — `⬡-gate: <text>` is Depends-on's second form (D63e). */
const dependsHexGate: Rule = {
	id: 'depends.hex-gate', pass: 'structural', changes: [],
	cell: { column: 2, run: t => t.includes(FELIX_GATE) ? t.trim().replace(new RegExp(FELIX_GATE, 'g'), HEX_GATE) : null },
};

/**
 * D71 — a charge is always staffed, so `unstaffed` has exactly one successor and only one place
 * to land: `—`, the dissolution a DEFERRED charge is allowed. Everywhere else the dead token
 * stays on the page as a lint residue — choosing who staffs a live charge is a session's call.
 */
const staffingDissolved: Rule = {
	id: 'staffing.dissolved', pass: 'structural', changes: ['mantle', 'tier', 'dissolved'],
	cell: {
		column: 3,
		run: (t, ctx) => strip(t) === UNSTAFFED && deferralNoted(ctx.cells[4] ?? '') ? '—' : null,
	},
};

/** The Status cell says a charge is shelved in either spelling — the respell rule may not have run. */
const deferralNoted = (status: string) => new RegExp(`\\b(?:${DEFERRED}|${PARKED})\\b`).test(status);

const staffingRiderParens: Rule = {
	id: 'staffing.rider-parens', pass: 'structural', changes: ['tier', 'rider'],
	cell: {
		column: 3,
		run: t => {
			const s = strip(t);
			const m = s.match(/^(.+?)\s+[—–]\s+(.+)$/);
			if (!m) return null;
			const segs = topSplit(m[1]!, ['·']);
			if (segs.length !== 2 || !isMantle(segs[0]!) || !isTier(segs[1]!)) return null;
			return `${segs[0]} · ${segs[1]} (${m[2]})`;
		},
	},
};

/**
 * Replace a leading ALLCAPS token and keep the rest byte-for-byte. A bold run WIDER than the
 * token keeps its opener — `**MERGED (…)** — x` becomes `**LANDED — MERGED (…)** — x`, never
 * an orphaned closer (item 4, 18f's find).
 */
function replaceLead(t: string, lead: string, to: string): string | null {
	const m = t.match(new RegExp('^(\\*\\*\\s*)?' + lead.replace(/ /g, '\\s+') + '(\\s*\\*\\*)?'));
	if (!m) return null;
	if (m[1] && !m[2]) return '**' + to + t.slice(m[0].length);   // the run continues — stay inside it
	return to + t.slice(m[0].length);
}

/** `**` comes in pairs; a rule that orphans one is a converter bug, not a doc defect (item 4). */
const balanced = (s: string) => (s.split('**').length - 1) % 2 === 0;

const statusRetired: Rule = {
	id: 'status.retired', pass: 'structural', changes: ['state', 'annotation'],
	cell: { column: 4, run: t => { const l = leadingToken(strip(t)); return RETIRED[l] ? replaceLead(t.trim(), l, RETIRED[l]!) : null; } },
};

const statusVerdict: Rule = {
	id: 'status.verdict', pass: 'structural', changes: ['state', 'annotation'],
	cell: { column: 4, run: t => { const l = leadingToken(strip(t)); return (VERDICTS as readonly string[]).includes(l) ? replaceLead(t.trim(), l, `LANDED — ${l}`) : null; } },
};

const statusPending: Rule = {
	id: 'status.pending', pass: 'structural', changes: ['state', 'annotation'],
	cell: { column: 4, run: t => leadingToken(strip(t)) === 'PENDING' ? replaceLead(t.trim(), 'PENDING', 'OPEN — PENDING') : null },
};

/** D71 — PARKED is DEFERRED's history: a whole-word respell wherever it annotates the Status. */
const statusParkedRespell: Rule = {
	id: 'status.parked-respell', pass: 'structural', changes: ['state', 'annotation'],
	cell: { column: 4, run: t => t.includes(PARKED) ? t.trim().replace(new RegExp(`\\b${PARKED}\\b`, 'g'), DEFERRED) : null },
};

/** D69/D71 — DEFERRED conforms exactly as PENDING does, so it molts exactly as PENDING does. */
const statusDeferred: Rule = {
	id: 'status.deferred', pass: 'structural', changes: ['state', 'annotation'],
	cell: { column: 4, run: t => leadingToken(strip(t)) === DEFERRED ? replaceLead(t.trim(), DEFERRED, `OPEN — ${DEFERRED}`) : null },
};

/** `E1–E9` expands to ids where every one resolves in the building; else it stays a lint fail (item 7). */
const dependsRange: Rule = {
	id: 'depends.range', pass: 'structural', changes: ['dependsOn'],
	cell: {
		column: 2,
		run: (t, { ids: knownIds }) => {
			const next = t.trim().replace(/([A-Za-z]*\d+[a-z]?)\s*–\s*([A-Za-z]*\d+[a-z]?)/g, (whole, a: string, b: string) => {
				const pa = a.match(/^([A-Za-z]*)(\d+)$/), pb = b.match(/^([A-Za-z]*)(\d+)$/);
				if (!pa || !pb || pa[1] !== pb[1] || +pa[2]! >= +pb[2]!) return whole;
				const ids: string[] = [];
				for (let n = +pa[2]!; n <= +pb[2]!; n++) ids.push(`${pa[1]}${String(n).padStart(pa[2]!.length, '0')}`);
				return ids.every(id => knownIds.has(id)) ? ids.join(' · ') : whole;
			});
			return next === t.trim() ? null : next;
		},
	},
};

// ---------- §7 the ledger — line rules ----------

/**
 * A head parenthetical splits into: an optional tier (hoisted to its D63f slot), an optional
 * row id (`row 001` / `gate 06` / a leading `SH3 — …`), and a remainder that belongs to the
 * body, never the bold (item 5's law, shared by every ledger head rule).
 */
function splitParen(inner: string): { tier: string | null; row: string | null; rest: string } {
	const parts = topSplit(inner, [',']);
	const tier = parts.find(isTier) ?? null;
	let row: string | null = null;
	const rest: string[] = [];
	for (const p of parts) {
		if (p === tier) continue;
		const named = p.match(/^(?:row|gate)\s+(\S+)$/i);
		if (named && !row) { row = named[1]!; continue; }
		if (!row && isId(p)) { row = p; continue; }
		const led = p.match(/^([A-Za-z]*\d+[a-z]?)\s+[—–]\s+(.+)$/);
		if (led && !row && isId(led[1]!)) { row = led[1]!; rest.push(led[2]!); continue; }
		rest.push(p);
	}
	return { tier, row, rest: rest.join(', ') };
}

/** D63f — hoist a tier out of the overloaded parenthetical into the head's own slot. */
const ledgerTierSlot: Rule = {
	id: 'ledger.tier-slot', pass: 'structural', changes: ['tier', 'row', 'body', 'decided', 'next'],
	line: {
		files: /^LEDGER\.md$/i,
		run: t => {
			const m = t.match(/^\*\*([^*]+?)\*\*(\s*)([—–-]\s*.*)?$/);
			if (!m) return null;
			const segs = topSplit(m[1]!, ['·']);
			const date = segs[0]!;
			if (segs.length === 3) {
				// Tier slot present; a pre-D63 paren may still smuggle prose past the row id.
				if (!preD63(date)) return null;
				const { head: tier, inner } = trailingParen(segs[2]!);
				if (!isTier(tier) || !inner) return null;
				const { row, rest } = splitParen(inner);
				if (!rest) return null;
				const tail = m[3] ?? '';
				return `**${date} · ${segs[1]} · ${tier}${row ? ` (${row})` : ''}** — ${rest}${tail ? ` ${tail.replace(/^[—–-]\s*/, '')}` : ''}`;
			}
			if (segs.length !== 2) return null;
			const { head: mantle, inner } = trailingParen(segs[1]!);
			if (!isMantle(mantle)) return null;
			if (!inner) {
				// No parenthetical at all: a pre-D63 head gets the typed absence; a live head is lint.
				return preD63(date) ? `**${date} · ${mantle} · ${UNRECORDED}**${m[2]}${m[3] ?? ''}` : null;
			}
			const { tier, row, rest } = splitParen(inner);
			if (!tier && !preD63(date)) return null;              // no tier to hoist, no license to stamp
			if (rest && !preD63(date)) return null;               // moving live prose is a session's call
			const tail = m[3] ?? '';
			const body = rest ? ` — ${rest}${tail ? ` ${tail}` : ''}` : `${m[2]}${tail}`;
			return `**${date} · ${mantle} · ${tier ?? UNRECORDED}${row ? ` (${row})` : ''}**${body}`;
		},
	},
};

/**
 * A pre-doctrine `## ` heading becomes a §7 entry: the separator, the bold head, the body
 * untouched. The tier hides in the mantle's parenthetical (`Builder (opus-medium)`) and is
 * hoisted to its own slot; a head with no tier anywhere writes `unrecorded`, never a head
 * with no tier slot (item 3, 18c's converter bug).
 */
const ledgerHeading: Rule = {
	id: 'ledger.pre-doctrine-head', pass: 'structural', changes: ['date', 'mantle', 'tier', 'row', 'body', 'decided', 'next'],
	line: {
		files: /^LEDGER\.md$/i,
		run: t => {
			const m = t.match(/^##\s+(\d{4}-\d{2}-\d{2})\s*·\s*(.+)$/);
			if (!m) return null;
			const segs = topSplit(m[2]!, ['·']);
			if (segs.length < 2) return null;
			const { head: mantle, inner } = trailingParen(segs[0]!);
			if (inner && !isTier(inner)) return null;   // an unknown parenthetical is judgment, not a guess
			const title = segs.slice(1).join(' · ');
			const tm = title.match(/^(\S+)\s+[—–]\s+(.+)$/);
			const row = tm && isId(tm[1]!) ? tm[1]! : null;
			return `---\n\n**${m[1]} · ${mantle} · ${inner ?? UNRECORDED}${row ? ` (${row})` : ''}** — ${row ? tm![2] : title}`;
		},
	},
};

/**
 * The second pre-doctrine dialect (item 5, whiteboardy ×96): a BARE head —
 * `<date> · <mantle> · <tier> (<paren>)[ — <tail>]` — with `Changed:`-labelled body lines.
 * Bold the head, hoist the row id, `—` replaces the `Changed:` label, the parenthetical's
 * non-row-id remainder goes to the body untouched. A head whose parenthetical wraps onto the
 * next line (three live cases) is read whole and re-emitted on one.
 */
const ledgerBareHead: Rule = {
	id: 'ledger.bare-head', pass: 'structural', changes: ['date', 'mantle', 'tier', 'row', 'body', 'decided', 'next'],
	line: {
		files: /^LEDGER\.md$/i,
		run: (t, ctx) => {
			const m = t.match(/^(\d{4}-\d{2}-\d{2})\s*·\s*(.+)$/);
			if (!m) return null;
			let rest = m[2]!, eat = 0;
			// a wrapped head: the '(' opens here and closes on the next line
			const open = (s: string) => (s.match(/\(/g)?.length ?? 0) - (s.match(/\)/g)?.length ?? 0);
			if (open(rest) > 0 && ctx.ahead(1) !== null && open(ctx.ahead(1)!) < 0) { rest += ' ' + ctx.ahead(1)!.trim(); eat = 1; }
			const segs = topSplit(rest, ['·']);
			if (segs.length < 2 || !isMantle(segs[0]!)) return null;
			const last = segs.slice(1).join(' · ');
			const lm = last.match(/^([\w.-]+)\s*(.*)$/s);
			if (!lm || !isTier(lm[1]!)) return null;
			const pm = lm[2]!.match(/^\((.*)\)\s*(?:[—–-]\s*(.*))?$/s) ?? (lm[2]!.match(/^[—–-]\s*(.*)$/s) ? [null, null, lm[2]!.replace(/^[—–-]\s*/, '')] : lm[2]!.trim() === '' ? [null, null, null] : null);
			if (!pm) return null;
			const { row, rest: remainder } = pm[1] != null ? splitParen(pm[1] as string) : { row: null, rest: '' };
			const tail = (pm[2] as string | null) ?? '';

			// `—` replaces the `Changed:` label on the line after the head (item 5's third move).
			let changed = '';
			const after = ctx.ahead(eat + 1);
			if (after !== null && /^Changed:\s*/.test(after)) { changed = after.replace(/^Changed:\s*/, ''); eat += 1; }

			const pieces = [remainder, tail, changed].filter(Boolean).join(' — ');
			const head = `**${m[1]} · ${segs[0]} · ${lm[1]}${row ? ` (${row})` : ''}**`;
			// A head mid-block regains its separator; one already after `---` keeps it.
			const sep = ctx.prev !== null && ctx.prev.trim() !== '---' ? '---\n\n' : '';
			return { to: `${sep}${head}${pieces ? ` — ${pieces}` : ' —'}`, eat };
		},
	},
};

/**
 * The house clause dialect (025-F2 — whiteboardy 61, snappy 3): the scope rides BEFORE the
 * colon, `Decided (<scope>): x`. §7 puts `:` on the field name and nowhere else, so the repair
 * is a colon relocation — total, mechanical, byte-preserving: the scope survives verbatim as
 * the clause's own first words. Line-start only; a clause buried mid-prose is 025-F2's other
 * shape and no rule here claims it.
 */
const clauseScopedColon: Rule = {
	id: 'ledger.clause-scope', pass: 'structural', changes: ['decided', 'next', 'body'],
	line: {
		files: /^LEDGER\.md$/i,
		run: t => {
			const m = t.match(/^(Decided|Next)\s+(\([^)]*\)):\s*(.*)$/);
			return m ? `${m[1]}: ${m[2]}${m[3] ? ` ${m[3]}` : ''}` : null;
		},
	},
};

/**
 * The same clause head wearing the joiner instead of the colon — `Next — <text>` (whiteboardy
 * ×3). §7: `—` joins a thing to its qualifier, `:` introduces a field's value; a clause head is
 * a field name. Both field names, because it is one move — leaving `Decided —` alive would keep
 * the identical defect on the page under a different word.
 */
const clauseDashHead: Rule = {
	id: 'ledger.clause-dash', pass: 'structural', changes: ['decided', 'next', 'body'],
	line: {
		files: /^LEDGER\.md$/i,
		run: t => {
			const m = t.match(/^(Decided|Next)\s+[—–]\s*(.*)$/);
			return m ? `${m[1]}: ${m[2]}` : null;
		},
	},
};

// ---------- §8 decisions — line rule ----------

const decisionHead: Rule = {
	id: 'decision.pre-doctrine-head', pass: 'structural', changes: ['id', 'date', 'decider', 'title', 'body', 'blessed', 'pending'],
	line: {
		run: t => {
			const m = t.match(new RegExp(String.raw`^(\s*[-*]\s*)\*\*(${DECISION_ID})\s*·\s*(\d{4}-\d{2}-\d{2})\s*·\s*(.+?)\*\*(.*)$`));
			return m ? `${m[1]}**${m[2]}** (${m[3]}): **${m[4]}**${m[5]}` : null;
		},
	},
};

/**
 * The second decision variant (item 6, spacex ×7): the bold wraps id + attribution with no
 * separate title — `- **D1 (2026-08-13, Felix):** <body>`. The title slot gets the typed
 * absence, NEVER an authored title: choosing where a title ends is editorial (18h's refusal).
 */
const decisionInlineAttribution: Rule = {
	id: 'decision.inline-attribution', pass: 'structural', changes: ['title', 'body', 'date', 'decider', 'blessed', 'pending'],
	line: {
		run: t => {
			const m = t.match(new RegExp(String.raw`^(\s*[-*]\s*)\*\*(${DECISION_ID})\s+\((\d{4}-\d{2}-\d{2}),\s*([^)]*)\):\*\*\s*(.*)$`));
			return m ? `${m[1]}**${m[2]}** (${m[3]}, ${m[4]}): **${UNRECORDED}.** ${m[5]}` : null;
		},
	},
};

/** The clause pass is engine-driven, not line-driven — registered so the round-trip law reads its license. */
const ledgerUnrecordedClauses: Rule = { id: 'ledger.unrecorded-clauses', pass: 'structural', changes: ['decided', 'next', 'body'] };

// ---------- §7 the id namespace — the respell (D80/D81) ----------
//
// The three rules below share one table, derived from the building's own board. `changes` is
// EMPTY on purpose: the respell buys no license to differ, it proves itself — the round-trip law
// gives it the stricter contract of asserting every field equals the table applied to the old
// field. A rule that is a total substitution can be checked by substituting.

export const ID_RESPELL = 'id.respell';

/** The board's own ID cell: the address itself, rewritten from the table's key. */
const respellIdColumn: Rule = {
	id: `${ID_RESPELL}.id-cell`, pass: 'respell', changes: [],
	cell: { column: 0, run: (t, ctx) => respellIdCell(strip(t), ctx.respell) },
};

/** Depends-on holds ids, gates and crossings and no prose — the one cell where a bare number
 *  needs no noun in front of it to be an address (DOCTRINE §4). */
const respellDependsColumn: Rule = {
	id: `${ID_RESPELL}.depends`, pass: 'respell', changes: [],
	cell: { column: 2, run: (t, ctx) => { const next = respellDepends(t.trim(), ctx.respell); return next === t.trim() ? null : next; } },
};

/** Every other surface: tokens, paths, typed slots — wherever they are written. */
const respellLine: Rule = {
	id: ID_RESPELL, pass: 'respell', changes: [],
	line: { run: (t, ctx) => { const next = respellText(t, ctx.respell, ctx.openTick, ctx.scope); return next === t ? null : next; } },
};

// Order is load-bearing in one place: the PARKED respell runs before the leading-annotation
// rule, so `| PARKED — x |` reaches `OPEN — DEFERRED — x` in one pass.
export const RULES: Rule[] = [
	staffingHexGate, dependsHexGate, staffingDissolved, staffingRiderParens,
	statusRetired, statusVerdict, statusPending, statusParkedRespell, statusDeferred, dependsRange,
	ledgerTierSlot, ledgerHeading, ledgerBareHead, clauseScopedColon, clauseDashHead,
	decisionHead, decisionInlineAttribution,
	ledgerUnrecordedClauses,
	respellIdColumn, respellDependsColumn, respellLine,
];

// ---------- the engine ----------

/** The unescaped `|` boundaries of a GFM row — cell k is spans[k]. */
function cellSpans(line: string): { start: number; end: number }[] {
	const spans: { start: number; end: number }[] = [];
	let open = -1;
	for (let i = 0; i < line.length; i++) {
		if (line[i] !== '|' || line[i - 1] === '\\') continue;
		if (open >= 0) spans.push({ start: open + 1, end: i });
		open = i;
	}
	return spans;
}

/** The 1-based line numbers of every canonical board row in the document. */
function boardRowLines(md: string): Set<number> {
	const out = new Set<number>();
	for (const t of tables(md)) if (isBoardHeader(t.header)) for (const r of t.rows) out.add(r.line);
	return out;
}

/**
 * `passes` defaults to the structural rules alone: the respell's table is derived from a BOARD,
 * so it is a building-scoped act and a lone file has no building to derive it from. Hand it a
 * table and it runs; `migrate()` below hands one to every document the building keeps.
 */
export type MigrateOpts = { ids?: Set<string>; respell?: Respell; passes?: Pass[] };

/**
 * A `.md` is a document — unless it sits in a lab dir the table does not name: `lab/s4/` is
 * this building's (a key), `lab/012/` too (a padded number), but `lab/reset-home/` and
 * `lab/cornerizer-inside/` are another campaign's record squatting in this tree, and their
 * `s0`/`S4` are URScript step labels and cornerizer's own ids (measured 2026-09-08). Those
 * take the path forms only, like code.
 */
function scopeOf(file: string, t: Respell): Scope {
	if (!file.endsWith('.md')) return 'path';
	const m = file.match(/(?:^|\/)lab\/([^/]+)\//);
	if (!m) return 'document';
	const dir = m[1]!;
	return /^\d{3}$/.test(dir) || t.ids.has(dir.toUpperCase()) ? 'document' : 'path';
}

export function migrateText(file: string, md: string, opts: MigrateOpts = {}): Migration {
	const name = basename(file);
	const lines = md.split('\n');
	const rowLines = boardRowLines(md);
	const ids = opts.ids ?? boardIds(md);
	const respell = opts.respell ?? EMPTY;
	const active = new Set<Pass>(opts.passes ?? (opts.respell ? ['structural', 'respell'] : ['structural']));
	const edits: Edit[] = [];

	let inFence = false, openTick = false, lastNonEmpty: string | null = null;
	for (let i = 0; i < lines.length; i++) {
		const original = lines[i]!;
		const marker = /^\s*```/.test(original);
		if (marker) { inFence = !inFence; openTick = false; }   // a fence resets the inline-tick mask
		// A fenced line is a QUOTE to the structural rules — a quoted head is not an entry — and a
		// DOCUMENT to the respell: a kickoff naming a renamed charge doc is a dead address (D80).
		const quoted = marker || inFence;
		let text = original;
		let consumed = 1;
		const fired: string[] = [];

		if (!quoted && rowLines.has(i + 1)) {
			for (const rule of RULES) {
				if (!rule.cell || !active.has(rule.pass)) continue;
				const spans = cellSpans(text);
				const span = spans[rule.cell.column];
				if (!span) continue;
				const cell = text.slice(span.start, span.end);
				// The row is re-read per rule: a cell rule may need a neighbour (Staffing reads Status),
				// and an earlier rule in this same pass may already have rewritten it.
				const next = rule.cell.run(cell, { ids, respell, cells: spans.map(s => text.slice(s.start, s.end)) });
				if (next === null || next === cell.trim()) continue;
				if (balanced(cell) && !balanced(next)) throw new Error(`${rule.id} orphaned a ** in ${JSON.stringify(next)} — a converter bug, not a doc defect (item 4)`);
				text = text.slice(0, span.start) + ` ${next} ` + text.slice(span.end);
				fired.push(rule.id);
			}
		}
		const ctx: LineCtx = { prev: lastNonEmpty, ahead: k => lines[i + k] ?? null, respell, openTick, scope: scopeOf(file, respell) };
		if (!marker) openTick = ticksLeftOpen(original, openTick);
		for (const rule of RULES) {
			if (!rule.line || !active.has(rule.pass)) continue;
			if (quoted && rule.pass === 'structural') continue;
			if (rule.line.files && !rule.line.files.test(name)) continue;
			const r = rule.line.run(text, ctx);
			if (r === null) continue;
			const next = typeof r === 'string' ? r : r.to;
			if (typeof r === 'object') consumed += r.eat;
			if (next === text && consumed === 1) continue;
			text = next;
			fired.push(rule.id);
		}

		if (fired.length) {
			edits.push({ line: i + 1, from: lines.slice(i, i + consumed).join('\n'), to: text, rule: fired.join('+') });
			i += consumed - 1;
		}
		if (marker) lastNonEmpty = original;
		else if (!inFence && original.trim()) lastNonEmpty = original;
	}

	if (active.has('structural') && /^LEDGER\.md$/i.test(name)) edits.push(...clauseEdits(lines, edits));
	edits.sort((a, b) => a.line - b.line);

	// one apply pass: every line is either inside exactly one edit's from-range or copied verbatim
	const byLine = new Map(edits.map(e => [e.line, e]));
	const out: string[] = [];
	for (let i = 0; i < lines.length; ) {
		const e = byLine.get(i + 1);
		if (e) { out.push(e.to); i += e.from.split('\n').length; }
		else { out.push(lines[i]!); i++; }
	}
	return { file, before: md, after: out.join('\n'), edits, respell };
}

/**
 * What each source line BECAME under the line and cell rules — an edit's whole emission sits on
 * its first line, the rest of its from-range empties. This is the re-parse between rule classes
 * (031 item 1): the structure rules run, the document is re-read, and the clause pass reads what
 * the document now says instead of what it said before the run. Reading the stale bytes is how
 * `ledger.unrecorded-clauses` came to fill 61 whiteboardy entries that already carried a clause
 * — in the dialect a field rule had just repaired — while the round-trip law printed `ok`
 * (025-F1: `decided`/`next` are fields the rule declares it may change, so the law licensed it).
 */
function becameLines(lines: string[], edits: Edit[]): string[] {
	const out = lines.slice();
	for (const e of edits) {
		out[e.line - 1] = e.to;
		for (let k = 1; k < e.from.split('\n').length; k++) out[e.line - 1 + k] = '';
	}
	return out;
}

/**
 * D63 as amended: a pre-doctrine entry whose source never held a Decided:/Next: clause gets
 * the literal `unrecorded` — a typed absence, never a reconstruction. Only entries carrying
 * the pre-doctrine dialect's own `Changed:`/`Blocked:` label qualify, and only pre-D63
 * dates: a live entry's missing clause is a session's lint failure, not the converter's stamp.
 *
 * Two documents are read on purpose: an entry's LICENSE is a fact about the source (the old
 * dialect's own shape, its date), its clause PRESENCE a fact about the migrated text.
 */
/**
 * Does this entry, as migrated, record the field at all? Two signals, and the second is the
 * load-bearing one: the conforming clause rides anywhere in the flattened body (`… Decided: x.`),
 * and a line that OPENS with the field name IS that field's clause whatever punctuation follows
 * it — `Decided/measured:` and a scope parenthetical wrapping past its own line are both live in
 * the corpus and neither is a rule here. Where the tool cannot repair the spelling it must
 * refuse to fill: a refusal is a lint failure with a human's name on it, a fill is a lie.
 */
const records = (field: 'Decided' | 'Next', migrated: string[]) =>
	migrated.some(l => new RegExp(`${field}:`).test(l) || new RegExp(`^${field}\\b`).test(l));

function clauseEdits(lines: string[], edits: Edit[]): Edit[] {
	const HEAD = /^(##\s+|\*\*)?(\d{4}-\d{2}-\d{2})\s*·/;
	const extra: Edit[] = [];
	const spans: { dialect: boolean; date: string; start: number; end: number }[] = [];
	let cur: { dialect: boolean; date: string; start: number } | null = null, fence = false;
	for (let i = 0; i < lines.length; i++) {
		const l = lines[i]!;
		if (/^\s*```/.test(l)) fence = !fence;
		if (fence) continue;
		const h = l.match(HEAD);
		if (h || /^---\s*$/.test(l)) {
			if (cur) spans.push({ ...cur, end: i });
			// a `## ` or bare head IS the pre-doctrine dialect, whatever its calendar date
			cur = h ? { dialect: h[1] !== '**', date: h[2]!, start: i } : null;
		}
	}
	if (cur) spans.push({ ...cur, end: lines.length });

	const covered = (n: number) => edits.find(e => n >= e.line && n < e.line + e.from.split('\n').length);
	const became = becameLines(lines, edits);
	const hosted = new Set<Edit>();
	for (const s of spans) {
		const span = lines.slice(s.start, s.end);
		// the license is the dialect shape: an old-shape head, or the labels only it wrote —
		// a conforming-era bold head qualifies by its labels alone, and only pre-D63
		if (!s.dialect && !span.some(l => /^(Changed|Blocked):/.test(l))) continue;
		if (!s.dialect && !preD63(s.date)) continue;
		const migrated = became.slice(s.start, s.end);
		const missing = [
			...(records('Decided', migrated) ? [] : ['Decided: unrecorded.']),
			...(records('Next', migrated) ? [] : ['Next: unrecorded.']),
		];
		if (!missing.length) continue;
		let last = s.end - 1;
		while (last > s.start && !lines[last]!.trim()) last--;
		const host = covered(last + 1);
		if (host) {
			// One edit hosts at most one entry's fill: a second would land at the first's tail,
			// in the wrong entry. Impossible by construction (two entries never share a head) —
			// asserted because a silent misplacement is the exact genus this pass just killed.
			if (hosted.has(host)) throw new Error(`ledger.unrecorded-clauses: two spans claim the edit at line ${host.line} — a converter bug (031 item 1)`);
			hosted.add(host);
			host.to = `${host.to}\n${missing.join(' ')}`; host.rule += '+ledger.unrecorded-clauses';
		}
		else extra.push({ line: last + 1, from: lines[last]!, to: `${lines[last]!}\n${missing.join(' ')}`, rule: 'ledger.unrecorded-clauses' });
	}
	return extra;
}

/** A file the converter may read: inside the walk's size limit, and free of NUL bytes. */
function isText(p: string): boolean {
	try { if (statSync(p).size > LIMITS.bytes) return false; } catch { return false; }
	return !readFileSync(p).includes(0);
}

/**
 * Every document the respell reads: the building's TRACKED text files — an ignored file is not
 * the building's record. Minus the nested buildings, whose ids are their own namespace (D80);
 * minus `fixtures/`, because a control set's bytes ARE the form it exists to exercise
 * (building.ts's SKIP_DIRS, DOCTRINE §6.2). `lab/` is in: its directories are named by the
 * charge that dug them, so a run that skipped it would leave `lab/008` pointing at nothing.
 */
function respellTargets(buildingPath: string): string[] {
	const root = resolve(buildingPath);
	let tracked: string[];
	try { tracked = execSync('git ls-files -z', { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 }).split('\0').filter(Boolean); }
	catch { return []; }                              // no checkout, no record — nothing to respell
	const nested = discover([root]).map(b => resolve(b.path)).filter(p => p !== root);
	return tracked
		.filter(rel => !rel.split(sep).some(s => s === 'fixtures' || s === 'node_modules'))
		.map(rel => join(root, rel))
		.filter(p => !nested.some(n => p === n || p.startsWith(n + sep)))
		.filter(isText);
}

export function migrate(buildingPath: string, given?: Respell): { building: Building; table: Respell; migrations: Migration[] } {
	const building = parseBuilding(buildingPath);
	const artifacts = new Set([
		...building.files.boards,
		...(building.files.ledger ? [building.files.ledger] : []),
		...(building.files.decisions ? [building.files.decisions] : []),
	]);
	const ids = new Set<string>();
	for (const f of building.files.boards) for (const id of boardIds(readFileSync(f, 'utf8'))) ids.add(id);
	// A hand-given table (D80 at the desk) replaces the derivation; its `dir` is still this building's.
	const table = given ? { ...given, dir: basename(resolve(buildingPath)) } : respellTable(ids, basename(resolve(buildingPath)));

	const seen = new Set<string>();
	const targets = [...artifacts, ...respellTargets(buildingPath)].filter(f => !seen.has(f) && seen.add(f));
	const migrations = targets
		.map(f => migrateText(f, readFileSync(f, 'utf8'), {
			ids, respell: table,
			passes: artifacts.has(f) ? ['structural', 'respell'] : ['respell'],
		}))
		.filter(m => m.edits.length);
	return { building, table, migrations };
}

export function write(m: Migration): void { writeFileSync(m.file, m.after, 'utf8'); }

// ---------- the round-trip law ----------
//
// `parse(migrate(x)) ≡ parse(x)` on meaning-bearing fields. Read precisely: a field the
// parser already typed must come back IDENTICAL; a field only a fired rule is licensed to
// touch may change, and a field that did not parse before may become non-null. Anything
// else is the converter paraphrasing, which D63 forbids.

const rowKey = (r: { id: string; line: number }) => r.id || `L${r.line}`;

export function roundTrip(m: Migration): string[] {
	const fired = new Set(m.edits.flatMap(e => e.rule.split('+')));
	// The respell buys no license to differ — it earns its own law: every field must be
	// INVARIANT UNDER THE TABLE, `respell(before) === respell(after)`. A substitution proves
	// itself by substituting, so `id`, `workDoc` and `body` are checked rather than waved
	// through, and a paraphrase, a drop or a wrong address still fails. It is equality under
	// the table and not equality WITH it because the rules are line-scoped and a parsed field
	// is not: a typed slot that wrapped mid-line (`row\n14`) is a supervised hit, and the law
	// must not demand of the converter what the converter can see.
	const respelled = [...fired].some(id => id === ID_RESPELL || id.startsWith(ID_RESPELL + '.'));
	const allowed = new Set([...fired].flatMap(id => RULES.find(r => r.id === id)?.changes ?? []));
	const norm = (v: unknown) => respelled ? respellNormal(JSON.stringify(v), m.respell) : JSON.stringify(v);
	const key = (id: string) => respelled ? m.respell.ids.get(id) ?? respellText(id, m.respell) : id;
	const bad: string[] = [];

	const compare = (what: string, before: Record<string, unknown>, after: Record<string, unknown> | undefined) => {
		if (!after) { bad.push(`${what}: vanished from the migrated document`); return; }
		for (const [k, v] of Object.entries(before)) {
			if (k === 'line' || k === 'block' || allowed.has(k)) continue;
			if (norm(after[k]) !== norm(v)) bad.push(`${what}.${k}: ${norm(v)} expected, ${norm(after[k])} found`);
		}
	};

	const b0 = parseBoards(m.before).boards.flatMap(x => x.rows);
	const b1 = new Map(parseBoards(m.after).boards.flatMap(x => x.rows).map(r => [rowKey(r), r]));
	for (const r of b0) compare(`row ${rowKey(r)}`, r, b1.get(key(rowKey(r))));

	// A migration can multiply parsed entries (96 bare heads entering the parse), so positional
	// alignment lies; each before-entry must EXIST after with its undeclared fields intact.
	const l0 = parseLedger(m.before).entries;
	const l1 = parseLedger(m.after).entries;
	for (const e of l0) {
		const kept = l1.some(x => x.date === e.date && Object.entries(e).every(([k, v]) =>
			k === 'line' || k === 'block' || allowed.has(k) || norm(v) === norm(x[k as keyof typeof x])));
		if (!kept) bad.push(`ledger[${e.date}]: no migrated entry preserves its undeclared fields`);
	}
	if (l1.length < l0.length) bad.push(`ledger: ${l0.length} entries parsed before, ${l1.length} after — an entry vanished`);

	const d0 = parseDecisions(m.before).decisions;
	const d1 = new Map(parseDecisions(m.after).decisions.map(d => [d.id, d]));
	for (const d of d0) compare(`${d.id}`, d, d1.get(key(d.id)));

	// The byte assertion: every line outside a recorded edit survived untouched. An edit may
	// consume several source lines (a wrapped head) and emit several (a hoisted separator).
	const edits = new Map(m.edits.map(e => [e.line, e]));
	const before = m.before.split('\n'), after = m.after.split('\n');
	let a = 0;
	for (let i = 0; i < before.length; ) {
		const e = edits.get(i + 1);
		if (e) { a += e.to.split('\n').length; i += e.from.split('\n').length; continue; }
		if (before[i] !== after[a]) { bad.push(`byte drift at line ${i + 1}: ${JSON.stringify(before[i])} → ${JSON.stringify(after[a])}`); break; }
		a++; i++;
	}
	return bad;
}

// ---------- the diff ----------

export function diff(m: Migration): string {
	const out = [`--- ${m.file}`, `+++ ${m.file} (doctrine migrate)`];
	for (const e of m.edits) {
		out.push(`@@ line ${e.line} @@  [${e.rule}]`);
		for (const l of e.from.split('\n')) out.push(`-${l}`);
		for (const l of e.to.split('\n')) out.push(`+${l}`);
	}
	return out.join('\n');
}
