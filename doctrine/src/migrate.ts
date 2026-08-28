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

import { basename } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import {
	FELIX_GATE, RETIRED, UNRECORDED, VERDICTS, isMantle, isTier, leadingToken, strip, topSplit, trailingParen,
} from './grammar';
import { boardIds, isBoardHeader, parseBoards, parseDecisions, parseLedger, tables } from './parse';
import { parse as parseBuilding, type Building } from './building';

/**
 * D63's typed-absence license is about HISTORY: where a pre-doctrine source never held a
 * required field, migration writes the literal `unrecorded`. An entry written after D63
 * landed has no such excuse — its absence is a session's lint failure, never the converter's
 * token to stamp.
 */
const D63_LANDED = '2026-08-26';
const preD63 = (date: string) => date < D63_LANDED;

export type Edit = { line: number; from: string; to: string; rule: string };
export type Migration = { file: string; before: string; after: string; edits: Edit[] };

/** What a line rule can see beyond its own line, and what it can return beyond a rewrite. */
export type LineCtx = { prev: string | null; ahead: (k: number) => string | null };
type LineResult = string | { to: string; eat: number } | null;

/** A rule names the parsed fields it is licensed to alter — the round-trip law reads this. */
type Rule = {
	id: string;
	changes: string[];
	/** Rewrite one Depends-on/Staffing/Status cell, or return null to decline. */
	cell?: { column: 2 | 3 | 4; run: (text: string, knownIds: Set<string>) => string | null };
	/** Rewrite one whole line (optionally eating following lines), or return null to decline. */
	line?: { files?: RegExp; run: (text: string, ctx: LineCtx) => LineResult };
};

// ---------- §4 the board — cell rules ----------

const staffingFelixGate: Rule = {
	id: 'staffing.felix-gate', changes: ['mantle', 'tier', 'felixGate', 'rider'],
	cell: {
		column: 3,
		run: t => {
			const { head, inner } = trailingParen(strip(t));
			if (head !== 'Felix' && head !== FELIX_GATE) return null;
			return FELIX_GATE + (inner ? ` (${inner})` : '');
		},
	},
};

const staffingRiderParens: Rule = {
	id: 'staffing.rider-parens', changes: ['tier', 'rider'],
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
	id: 'status.retired', changes: ['state', 'annotation'],
	cell: { column: 4, run: t => { const l = leadingToken(strip(t)); return RETIRED[l] ? replaceLead(t.trim(), l, RETIRED[l]!) : null; } },
};

const statusVerdict: Rule = {
	id: 'status.verdict', changes: ['state', 'annotation'],
	cell: { column: 4, run: t => { const l = leadingToken(strip(t)); return (VERDICTS as readonly string[]).includes(l) ? replaceLead(t.trim(), l, `LANDED — ${l}`) : null; } },
};

const statusPending: Rule = {
	id: 'status.pending', changes: ['state', 'annotation'],
	cell: { column: 4, run: t => leadingToken(strip(t)) === 'PENDING' ? replaceLead(t.trim(), 'PENDING', 'OPEN — PENDING') : null },
};

/** D69 — PARKED conforms exactly as PENDING does, so it molts exactly as PENDING does. */
const statusParked: Rule = {
	id: 'status.parked', changes: ['state', 'annotation'],
	cell: { column: 4, run: t => leadingToken(strip(t)) === 'PARKED' ? replaceLead(t.trim(), 'PARKED', 'OPEN — PARKED') : null },
};

/** `E1–E9` expands to ids where every one resolves in the building; else it stays a lint fail (item 7). */
const dependsRange: Rule = {
	id: 'depends.range', changes: ['dependsOn'],
	cell: {
		column: 2,
		run: (t, knownIds) => {
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

const rowish = (s: string) => /^[A-Za-z0-9][A-Za-z0-9-]*$/.test(s) && /\d/.test(s);

/**
 * A head parenthetical splits into: an optional tier (hoisted to its D63f slot), an optional
 * row id (`row 01` / `gate 06` / a leading `SH3 — …`), and a remainder that belongs to the
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
		if (!row && rowish(p)) { row = p; continue; }
		const led = p.match(/^([A-Za-z]*\d+[a-z]?)\s+[—–]\s+(.+)$/);
		if (led && !row && rowish(led[1]!)) { row = led[1]!; rest.push(led[2]!); continue; }
		rest.push(p);
	}
	return { tier, row, rest: rest.join(', ') };
}

/** D63f — hoist a tier out of the overloaded parenthetical into the head's own slot. */
const ledgerTierSlot: Rule = {
	id: 'ledger.tier-slot', changes: ['tier', 'row', 'body', 'decided', 'next'],
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
	id: 'ledger.pre-doctrine-head', changes: ['date', 'mantle', 'tier', 'row', 'body', 'decided', 'next'],
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
			const row = tm && rowish(tm[1]!) ? tm[1]! : null;
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
	id: 'ledger.bare-head', changes: ['date', 'mantle', 'tier', 'row', 'body', 'decided', 'next'],
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

// ---------- §8 decisions — line rule ----------

const decisionHead: Rule = {
	id: 'decision.pre-doctrine-head', changes: ['id', 'date', 'decider', 'title', 'body', 'ratified', 'pending'],
	line: {
		run: t => {
			const m = t.match(/^(\s*[-*]\s*)\*\*([A-Za-z]{1,8}-?\d+[a-z]?)\s*·\s*(\d{4}-\d{2}-\d{2})\s*·\s*(.+?)\*\*(.*)$/);
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
	id: 'decision.inline-attribution', changes: ['title', 'body', 'date', 'decider', 'ratified', 'pending'],
	line: {
		run: t => {
			const m = t.match(/^(\s*[-*]\s*)\*\*([A-Za-z]{1,8}-?\d+[a-z]?)\s+\((\d{4}-\d{2}-\d{2}),\s*([^)]*)\):\*\*\s*(.*)$/);
			return m ? `${m[1]}**${m[2]}** (${m[3]}, ${m[4]}): **${UNRECORDED}.** ${m[5]}` : null;
		},
	},
};

/** The clause pass is engine-driven, not line-driven — registered so the round-trip law reads its license. */
const ledgerUnrecordedClauses: Rule = { id: 'ledger.unrecorded-clauses', changes: ['decided', 'next', 'body'] };

export const RULES: Rule[] = [
	staffingFelixGate, staffingRiderParens, statusRetired, statusVerdict, statusPending, statusParked, dependsRange,
	ledgerTierSlot, ledgerHeading, ledgerBareHead, decisionHead, decisionInlineAttribution,
	ledgerUnrecordedClauses,
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

export function migrateText(file: string, md: string, knownIds?: Set<string>): Migration {
	const name = basename(file);
	const lines = md.split('\n');
	const rowLines = boardRowLines(md);
	const ids = knownIds ?? boardIds(md);
	const edits: Edit[] = [];

	let inFence = false, lastNonEmpty: string | null = null;
	for (let i = 0; i < lines.length; i++) {
		const original = lines[i]!;
		if (/^\s*```/.test(original)) { inFence = !inFence; lastNonEmpty = original; continue; }
		if (inFence) continue;                          // a quoted head is a quote, not an entry
		let text = original;
		let consumed = 1;
		const fired: string[] = [];

		if (rowLines.has(i + 1)) {
			for (const rule of RULES) {
				if (!rule.cell) continue;
				const spans = cellSpans(text);
				const span = spans[rule.cell.column];
				if (!span) continue;
				const cell = text.slice(span.start, span.end);
				const next = rule.cell.run(cell, ids);
				if (next === null || next === cell.trim()) continue;
				if (balanced(cell) && !balanced(next)) throw new Error(`${rule.id} orphaned a ** in ${JSON.stringify(next)} — a converter bug, not a doc defect (item 4)`);
				text = text.slice(0, span.start) + ` ${next} ` + text.slice(span.end);
				fired.push(rule.id);
			}
		}
		const ctx: LineCtx = { prev: lastNonEmpty, ahead: k => lines[i + k] ?? null };
		for (const rule of RULES) {
			if (!rule.line || (rule.line.files && !rule.line.files.test(name))) continue;
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
		if (original.trim()) lastNonEmpty = original;
	}

	if (/^LEDGER\.md$/i.test(name)) edits.push(...clauseEdits(lines, edits));
	edits.sort((a, b) => a.line - b.line);

	// one apply pass: every line is either inside exactly one edit's from-range or copied verbatim
	const byLine = new Map(edits.map(e => [e.line, e]));
	const out: string[] = [];
	for (let i = 0; i < lines.length; ) {
		const e = byLine.get(i + 1);
		if (e) { out.push(e.to); i += e.from.split('\n').length; }
		else { out.push(lines[i]!); i++; }
	}
	return { file, before: md, after: out.join('\n'), edits };
}

/**
 * D63 as amended: a pre-doctrine entry whose source never held a Decided:/Next: clause gets
 * the literal `unrecorded` — a typed absence, never a reconstruction. Only entries carrying
 * the pre-doctrine dialect's own `Changed:`/`Blocked:` label qualify, and only pre-D63
 * dates: a live entry's missing clause is a session's lint failure, not the converter's stamp.
 */
function clauseEdits(lines: string[], edits: Edit[]): Edit[] {
	const HEAD = /^(?:##\s+|\*\*)?(\d{4}-\d{2}-\d{2})\s*·/;
	const extra: Edit[] = [];
	const spans: { date: string; start: number; end: number }[] = [];
	let cur: { date: string; start: number } | null = null, fence = false;
	for (let i = 0; i < lines.length; i++) {
		const l = lines[i]!;
		if (/^\s*```/.test(l)) fence = !fence;
		if (fence) continue;
		const h = l.match(HEAD);
		if (h || /^---\s*$/.test(l)) {
			if (cur) spans.push({ ...cur, end: i });
			cur = h ? { date: h[1]!, start: i } : null;
		}
	}
	if (cur) spans.push({ ...cur, end: lines.length });

	const covered = (n: number) => edits.find(e => n >= e.line && n < e.line + e.from.split('\n').length);
	for (const s of spans) {
		if (!preD63(s.date)) continue;
		const span = lines.slice(s.start, s.end);
		if (!span.some(l => /^(Changed|Blocked):/.test(l))) continue;
		const flat = span.join(' ');
		const missing = [
			...(/Decided:/.test(flat) ? [] : ['Decided: unrecorded.']),
			...(/Next:/.test(flat) ? [] : ['Next: unrecorded.']),
		];
		if (!missing.length) continue;
		let last = s.end - 1;
		while (last > s.start && !lines[last]!.trim()) last--;
		const host = covered(last + 1);
		if (host) { host.to = `${host.to}\n${missing.join(' ')}`; host.rule += '+ledger.unrecorded-clauses'; }
		else extra.push({ line: last + 1, from: lines[last]!, to: `${lines[last]!}\n${missing.join(' ')}`, rule: 'ledger.unrecorded-clauses' });
	}
	return extra;
}

export function migrate(buildingPath: string): { building: Building; migrations: Migration[] } {
	const building = parseBuilding(buildingPath);
	const targets = [
		...building.files.boards,
		...(building.files.ledger ? [building.files.ledger] : []),
		...(building.files.decisions ? [building.files.decisions] : []),
	];
	const ids = new Set<string>();
	for (const f of building.files.boards) for (const id of boardIds(readFileSync(f, 'utf8'))) ids.add(id);
	const seen = new Set<string>();
	const migrations = targets.filter(f => !seen.has(f) && seen.add(f))
		.map(f => migrateText(f, readFileSync(f, 'utf8'), ids))
		.filter(m => m.edits.length);
	return { building, migrations };
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
	const allowed = new Set(m.edits.flatMap(e => e.rule.split('+')).flatMap(id => RULES.find(r => r.id === id)?.changes ?? []));
	const bad: string[] = [];

	const compare = (what: string, before: Record<string, unknown>, after: Record<string, unknown> | undefined) => {
		if (!after) { bad.push(`${what}: vanished from the migrated document`); return; }
		for (const [k, v] of Object.entries(before)) {
			if (k === 'line' || k === 'block' || allowed.has(k)) continue;
			if (JSON.stringify(v) !== JSON.stringify(after[k])) bad.push(`${what}.${k}: ${JSON.stringify(v)} → ${JSON.stringify(after[k])}`);
		}
	};

	const b0 = parseBoards(m.before).boards.flatMap(x => x.rows);
	const b1 = new Map(parseBoards(m.after).boards.flatMap(x => x.rows).map(r => [rowKey(r), r]));
	for (const r of b0) compare(`row ${rowKey(r)}`, r, b1.get(rowKey(r)));

	// A migration can multiply parsed entries (96 bare heads entering the parse), so positional
	// alignment lies; each before-entry must EXIST after with its undeclared fields intact.
	const l0 = parseLedger(m.before).entries;
	const l1 = parseLedger(m.after).entries;
	for (const e of l0) {
		const kept = l1.some(x => x.date === e.date && Object.entries(e).every(([k, v]) =>
			k === 'line' || k === 'block' || allowed.has(k) || JSON.stringify(v) === JSON.stringify(x[k as keyof typeof x])));
		if (!kept) bad.push(`ledger[${e.date}]: no migrated entry preserves its undeclared fields`);
	}
	if (l1.length < l0.length) bad.push(`ledger: ${l0.length} entries parsed before, ${l1.length} after — an entry vanished`);

	const d0 = parseDecisions(m.before).decisions;
	const d1 = new Map(parseDecisions(m.after).decisions.map(d => [d.id, d]));
	for (const d of d0) compare(`${d.id}`, d, d1.get(d.id));

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
