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
	FELIX_GATE, RETIRED, VERDICTS, isMantle, isTier, leadingToken, strip, topSplit, trailingParen,
} from './grammar';
import { isBoardHeader, parseBoards, parseDecisions, parseLedger, tables } from './parse';
import { parse as parseBuilding, type Building } from './building';

export type Edit = { line: number; from: string; to: string; rule: string };
export type Migration = { file: string; before: string; after: string; edits: Edit[] };

/** A rule names the parsed fields it is licensed to alter — the round-trip law reads this. */
type Rule = {
	id: string;
	changes: string[];
	/** Rewrite one Status/Staffing cell, or return null to decline. */
	cell?: { column: 3 | 4; run: (text: string) => string | null };
	/** Rewrite one whole line, or return null to decline. */
	line?: { files?: RegExp; run: (text: string) => string | null };
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

/** Replace a leading ALLCAPS token, bold wrapper and all, and keep the rest byte-for-byte. */
function replaceLead(t: string, lead: string, to: string): string | null {
	const m = t.match(new RegExp('^(?:\\*\\*\\s*)?' + lead.replace(/ /g, '\\s+') + '(?:\\s*\\*\\*)?'));
	return m ? to + t.slice(m[0].length) : null;
}

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

// ---------- §7 the ledger — line rules ----------

const rowish = (s: string) => /^[A-Za-z0-9][A-Za-z0-9-]*$/.test(s) && /\d/.test(s);

/** D63f — hoist a tier out of the overloaded parenthetical into the head's own slot. */
const ledgerTierSlot: Rule = {
	id: 'ledger.tier-slot', changes: ['tier', 'row'],
	line: {
		files: /^LEDGER\.md$/i,
		run: t => {
			const m = t.match(/^\*\*([^*]+?)\*\*(\s*[—–-]\s*.*)$/);
			if (!m) return null;
			const segs = topSplit(m[1]!, ['·']);
			if (segs.length !== 2) return null;
			const { head: mantle, inner } = trailingParen(segs[1]!);
			if (!inner) return null;
			const parts = topSplit(inner, [',']);
			const tier = parts.find(isTier);
			if (!tier) return null;
			const rest = parts.filter(x => x !== tier).map(x => x.replace(/^row\s+(\S+)$/i, '$1')).join(', ');
			return `**${segs[0]} · ${mantle} · ${tier}${rest ? ` (${rest})` : ''}**${m[2]}`;
		},
	},
};

/** A pre-doctrine ledger heading becomes a §7 entry: the separator, the bold head, the body untouched. */
const ledgerHeading: Rule = {
	id: 'ledger.pre-doctrine-head', changes: ['date', 'mantle', 'tier', 'row', 'body', 'decided', 'next'],
	line: {
		files: /^LEDGER\.md$/i,
		run: t => {
			const m = t.match(/^##\s+(\d{4}-\d{2}-\d{2})\s*·\s*(.+)$/);
			if (!m) return null;
			const segs = topSplit(m[2]!, ['·']);
			if (segs.length < 2) return null;
			const mantle = segs[0]!;
			const title = segs.slice(1).join(' · ');
			const tm = title.match(/^(\S+)\s+[—–]\s+(.+)$/);
			const row = tm && rowish(tm[1]!) ? tm[1]! : null;
			return `---\n\n**${m[1]} · ${mantle}${row ? ` (${row})` : ''}** — ${row ? tm![2] : title}`;
		},
	},
};

// ---------- §8 decisions — line rule ----------

const decisionHead: Rule = {
	id: 'decision.pre-doctrine-head', changes: ['id', 'date', 'decider', 'title', 'body', 'ratified', 'pending'],
	line: {
		run: t => {
			const m = t.match(/^(\s*[-*]\s*)\*\*D(\d+)\s*·\s*(\d{4}-\d{2}-\d{2})\s*·\s*(.+?)\*\*(.*)$/);
			return m ? `${m[1]}**D${m[2]}** (${m[3]}): **${m[4]}**${m[5]}` : null;
		},
	},
};

export const RULES: Rule[] = [
	staffingFelixGate, staffingRiderParens, statusRetired, statusVerdict, statusPending,
	ledgerTierSlot, ledgerHeading, decisionHead,
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

export function migrateText(file: string, md: string): Migration {
	const name = basename(file);
	const lines = md.split('\n');
	const rowLines = boardRowLines(md);
	const edits: Edit[] = [];
	const after = [...lines];

	for (let i = 0; i < lines.length; i++) {
		const original = lines[i]!;
		let text = original;
		const fired: string[] = [];

		if (rowLines.has(i + 1)) {
			for (const rule of RULES) {
				if (!rule.cell) continue;
				const spans = cellSpans(text);
				const span = spans[rule.cell.column];
				if (!span) continue;
				const cell = text.slice(span.start, span.end);
				const next = rule.cell.run(cell);
				if (next === null || next === cell.trim()) continue;
				text = text.slice(0, span.start) + ` ${next} ` + text.slice(span.end);
				fired.push(rule.id);
			}
		}
		for (const rule of RULES) {
			if (!rule.line || (rule.line.files && !rule.line.files.test(name))) continue;
			const next = rule.line.run(text);
			if (next === null || next === text) continue;
			text = next;
			fired.push(rule.id);
		}

		if (text !== original) {
			edits.push({ line: i + 1, from: original, to: text, rule: fired.join('+') });
			after[i] = text;
		}
	}
	return { file, before: md, after: after.join('\n'), edits };
}

export function migrate(buildingPath: string): { building: Building; migrations: Migration[] } {
	const building = parseBuilding(buildingPath);
	const targets = [
		...building.files.boards,
		...(building.files.ledger ? [building.files.ledger] : []),
		...(building.files.decisions ? [building.files.decisions] : []),
	];
	const seen = new Set<string>();
	const migrations = targets.filter(f => !seen.has(f) && seen.add(f))
		.map(f => migrateText(f, readFileSync(f, 'utf8')))
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

	const l0 = parseLedger(m.before).entries;
	const l1 = parseLedger(m.after).entries;
	for (let i = 0; i < l0.length; i++) compare(`ledger[${l0[i]!.date}]`, l0[i]!, l1[l1.length - l0.length + i]);

	const d0 = parseDecisions(m.before).decisions;
	const d1 = new Map(parseDecisions(m.after).decisions.map(d => [d.id, d]));
	for (const d of d0) compare(`${d.id}`, d, d1.get(d.id));

	// The byte assertion: every line outside a recorded edit survived untouched.
	const edits = new Map(m.edits.map(e => [e.line, e]));
	const before = m.before.split('\n'), after = m.after.split('\n');
	let a = 0;
	for (let i = 0; i < before.length; i++) {
		const e = edits.get(i + 1);
		if (e) { a += e.to.split('\n').length; continue; }
		if (before[i] !== after[a]) { bad.push(`byte drift at line ${i + 1}: ${JSON.stringify(before[i])} → ${JSON.stringify(after[a])}`); break; }
		a++;
	}
	return bad;
}

// ---------- the diff ----------

export function diff(m: Migration): string {
	const out = [`--- ${m.file}`, `+++ ${m.file} (doctrine migrate)`];
	for (const e of m.edits) {
		out.push(`@@ line ${e.line} @@  [${e.rule}]`);
		out.push(`-${e.from}`);
		for (const l of e.to.split('\n')) out.push(`+${l}`);
	}
	return out.join('\n');
}
