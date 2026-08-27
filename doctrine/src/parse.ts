// The five artifact parsers — DOCTRINE §4 (board), §7 (ledger), §8 (decisions),
// §3 (ISSUES), §5 (kickoffs) + §11 (the baton), as amended by D63 and D64.
// Harvested from the P3 probes (belvedere/lab/p3/parse.ts) and amended where the fold forced it.
//
// Parser-as-lint: a field the doctrine names and the doc does not carry is a Fail with the
// verbatim excerpt — never a parser branch. The shapes below are P3 §5's, normative per D65.

import {
	FELIX_GATE, MANTLES, PENDING, RETIRED, STATES, VERDICTS,
	delink, fail, isMantle, isState, isTier, leadingToken, linkTarget, strip, topSplit, trailingParen,
	type Fail, type State,
} from './grammar';

// ---------- §4 the board ----------

export type BoardRow = {
	id: string;
	work: string;                 // link text, de-linked
	workDoc: string | null;       // the href — the building page's row link
	dependsOn: string[];          // row ids (D63e)
	gates: string[];              // `Felix-gate: <text>` segments (D63e)
	mantle: string | null;
	tier: string | null;
	felixGate: boolean;           // D63a — the row is Felix's; the glass never auto-fires it
	rider: string | null;         // D63d — annotation for eyes, ignored by dispatch
	state: State | null;
	annotation: string;           // everything after the state token
	line: number;
};
export type Board = { heading: string; line: number; rows: BoardRow[] };

export type Table = { line: number; header: string[]; rows: { cells: string[]; line: number }[]; heading: string };

const BOARD_COLUMNS = ['id', 'work', 'depends on', 'staffing', 'status'];

export function tables(md: string): Table[] {
	const lines = md.split('\n');
	const out: Table[] = [];
	let heading = '';
	for (let i = 0; i < lines.length; i++) {
		if (/^#{1,6} /.test(lines[i]!)) heading = lines[i]!.replace(/^#+ /, '').trim();
		if (!/^\s*\|/.test(lines[i]!) || !/^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? '')) continue;
		const cells = (r: string) => r.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim());
		const header = cells(lines[i]!);
		const rows: { cells: string[]; line: number }[] = [];
		let j = i + 2;
		for (; j < lines.length && /^\s*\|/.test(lines[j]!); j++) rows.push({ cells: cells(lines[j]!), line: j + 1 });
		out.push({ line: i + 1, header, rows, heading });
		i = j - 1;
	}
	return out;
}

export const isBoardHeader = (h: string[]) =>
	h.length === 5 && BOARD_COLUMNS.every((want, k) => strip(h[k] ?? '').toLowerCase() === want);

/** §4's Staffing law as amended: `<Mantle> · <tier>` or the literal `Felix-gate`, either with a `(rider)`. */
function parseStaffing(cell: string, id: string, line: number) {
	const fails: Fail[] = [];
	const s = strip(delink(cell));
	const { head, inner } = trailingParen(s);
	const out = { mantle: null as string | null, tier: null as string | null, felixGate: false, rider: inner };

	if (head === FELIX_GATE) { out.felixGate = true; return { ...out, fails }; }

	const segs = topSplit(head, ['·']);
	if (segs.length !== 2) {
		fails.push(fail('board', 'board.staffing', `staffing is not "<Mantle> · <tier>" or "${FELIX_GATE}"`, `${id}: ${JSON.stringify(cell)}`, line));
		return { ...out, fails };
	}
	const [m, t] = segs as [string, string];
	if (isMantle(m)) out.mantle = m;
	else fails.push(fail('board', 'board.mantle', 'unknown mantle', `${id}: ${JSON.stringify(m)}`, line));
	if (isTier(t)) out.tier = t;
	else fails.push(fail('board', 'board.tier', 'unknown tier', `${id}: ${JSON.stringify(t)}`, line));
	return { ...out, fails };
}

/** §4's lifecycle: the state leads; PENDING and the verdicts ride the annotation (D63b, D63c). */
function parseStatus(cell: string, id: string, line: number) {
	const fails: Fail[] = [];
	const st = strip(cell);
	const lead = leadingToken(st);
	if (isState(lead)) return { state: lead as State, annotation: st.slice(lead.length).replace(/^[\s—–-]+/, ''), fails };

	const excerpt = `${id}: ${JSON.stringify(st.slice(0, 160))}`;
	if (RETIRED[lead]) fails.push(fail('board', 'board.retired', `"${lead}" is a retired synonym (§4) — use ${RETIRED[lead]}`, excerpt, line));
	else if (lead === PENDING) fails.push(fail('board', 'board.pending-leads', 'PENDING never leads (D63c) — write "OPEN — PENDING <precondition>"', excerpt, line));
	else if ((VERDICTS as readonly string[]).includes(lead)) fails.push(fail('board', 'board.verdict-leads', `a verdict rides the annotation (D63b) — write "LANDED — ${lead} …"`, excerpt, line));
	else fails.push(fail('board', 'board.state', 'status does not open with a lifecycle state', excerpt, line));
	return { state: null, annotation: st, fails };
}

/** §4's Depends-on: exactly two forms — a row id, or `Felix-gate: <text>` (D63e). */
function parseDependsOn(cell: string, id: string, line: number, knownIds: Set<string>) {
	const fails: Fail[] = [];
	const d = strip(delink(cell));
	const dependsOn: string[] = [], gates: string[] = [];
	if (/^[—–-]$/.test(d) || d === '') return { dependsOn, gates, fails };

	for (const seg of topSplit(d, ['·', ',', ';'])) {
		const gate = seg.match(/^\**Felix-gate\**\s*:\s*(.+)$/);
		if (gate) { gates.push(gate[1]!.trim()); continue; }
		if (knownIds.has(seg)) { dependsOn.push(seg); continue; }
		// Non-conforming, but still recover any row id it names: a null is a render decision,
		// not an error (P3 §5) — the glass draws the graph while the lint files the defect.
		dependsOn.push(...seg.split(/[\s+,]+/).filter(x => knownIds.has(x)));
		fails.push(fail('board', 'board.depends', `depends-on segment is neither a row id on this board nor "${FELIX_GATE}: <text>"`, `${id}: ${JSON.stringify(seg.slice(0, 160))}`, line));
	}
	return { dependsOn, gates, fails };
}

export function parseBoards(md: string): { boards: Board[]; fails: Fail[]; staffingTables: number } {
	const fails: Fail[] = [];
	const all = tables(md);
	const canonical = all.filter(t => isBoardHeader(t.header));
	const staffingTables = all.filter(t => !isBoardHeader(t.header) && t.header.some(h => /^staffing$/i.test(strip(h)))).length;

	// Pass 1: the row ids this doc declares — Depends-on is validated against them, because
	// resolving to a real row is the one thing that column exists for (§4).
	const knownIds = new Set<string>();
	for (const t of canonical) for (const r of t.rows) if (r.cells.length === 5) knownIds.add(strip(delink(r.cells[0]!)));

	const boards: Board[] = [];
	for (const t of canonical) {
		const rows: BoardRow[] = [];
		for (const { cells: r, line } of t.rows) {
			if (r.length !== 5) {
				const bad = r.find(c => /`[^`]*\|/.test(c)) ?? r.slice(5).join(' | ');
				fails.push(fail('board', 'board.pipe', `row splits into ${r.length} cells (unescaped | inside a cell — the row is already truncated in any GFM renderer)`, `${strip(delink(r[0] ?? ''))}: …${String(bad).slice(0, 120)}`, line));
				continue;
			}
			const [idC, workC, depC, staffC, statC] = r as [string, string, string, string, string];
			const id = strip(delink(idC));
			if (!id) fails.push(fail('board', 'board.id', 'empty ID cell', ('| ' + r.join(' | ') + ' |').slice(0, 300), line));

			const staff = parseStaffing(staffC, id, line);
			const stat = parseStatus(statC, id, line);
			const dep = parseDependsOn(depC, id, line, knownIds);
			fails.push(...staff.fails, ...stat.fails, ...dep.fails);

			rows.push({
				id, work: strip(delink(workC)), workDoc: linkTarget(workC),
				dependsOn: dep.dependsOn, gates: dep.gates,
				mantle: staff.mantle, tier: staff.tier, felixGate: staff.felixGate, rider: staff.rider,
				state: stat.state, annotation: stat.annotation, line,
			});
		}
		boards.push({ heading: t.heading, line: t.line, rows });
	}
	if (staffingTables) fails.push(fail('board', 'board.columns', `${staffingTables} staffing table(s) with non-canonical columns — any table that staffs sessions is a board (D45): ${BOARD_COLUMNS.join(' | ')}`, all.filter(t => !isBoardHeader(t.header)).map(t => '| ' + t.header.join(' | ') + ' |').slice(0, 3).join('\n'), 0));
	return { boards, fails, staffingTables };
}

// ---------- §7 the ledger ----------

export type LedgerEntry = {
	date: string;
	mantle: string;
	tier: string | null;          // D63f — the head's tier slot
	row: string | null;
	body: string;
	decided: string | null;
	next: string | null;
	line: number;
	block: string;                // the entry verbatim — the baton's fences live here
};

function blocks(md: string): { text: string; line: number }[] {
	const lines = md.split('\n');
	const out: { text: string; line: number }[] = [];
	let cur: string[] = [], start = 1;
	for (let i = 0; i < lines.length; i++) {
		if (/^---\s*$/.test(lines[i]!)) { if (cur.join('').trim()) out.push({ text: cur.join('\n'), line: start }); cur = []; start = i + 2; }
		else cur.push(lines[i]!);
	}
	if (cur.join('').trim()) out.push({ text: cur.join('\n'), line: start });
	return out;
}

export function parseLedger(md: string): { entries: LedgerEntry[]; tail: LedgerEntry | null; fails: Fail[]; blocks: number } {
	const fails: Fail[] = [];
	const bs = blocks(md);
	const entries: LedgerEntry[] = [];

	for (const b of bs) {
		if (/^#/.test(b.text.trim())) continue; // the file header block
		const flat = b.text.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ');
		const m = flat.match(/^\*\*([^*]+?)\*\*\s*[—–-]\s*(.*)$/);
		if (!m) {
			fails.push(fail('ledger', 'ledger.head', 'entry head is not "**<date> · <mantle> · <tier> (<row>)** — …" (D63f)', flat.slice(0, 220), b.line));
			continue;
		}
		const segs = topSplit(m[1]!, ['·']);
		if (segs.length < 2 || segs.length > 3) {
			fails.push(fail('ledger', 'ledger.head', `the bold run holds ${segs.length} · -segment(s); D63f allows date · mantle · tier and nothing else`, flat.slice(0, 220), b.line));
			continue;
		}
		const date = segs[0]!;
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fails.push(fail('ledger', 'ledger.date', 'date is not ISO YYYY-MM-DD', JSON.stringify(date), b.line));

		// The row parenthetical rides the last segment; the tier slot is the third (D63f).
		const last = trailingParen(segs[segs.length - 1]!);
		const row = last.inner;
		const mantle = segs.length === 3 ? segs[1]! : trailingParen(segs[1]!).head;
		const tierSeg = segs.length === 3 ? last.head : null;

		if (!isMantle(mantle)) fails.push(fail('ledger', 'ledger.mantle', 'unknown mantle', JSON.stringify(mantle), b.line));
		let tier: string | null = null;
		if (tierSeg === null) fails.push(fail('ledger', 'ledger.tier', 'the head carries no tier slot (D63f)', flat.slice(0, 160), b.line));
		else if (isTier(tierSeg)) tier = tierSeg;
		else fails.push(fail('ledger', 'ledger.tier', 'unknown tier', JSON.stringify(tierSeg), b.line));
		if (row !== null && /[\s,]/.test(row)) fails.push(fail('ledger', 'ledger.row', 'the parenthetical holds more than a row id (D63f)', JSON.stringify(row), b.line));

		const body = m[2]!;
		const decided = body.match(/Decided:\s*(.+?)(?:\.\s*Next:|\.$|$)/)?.[1] ?? null;
		const next = body.match(/Next:\s*(.+)$/)?.[1] ?? null;
		if (!decided) fails.push(fail('ledger', 'ledger.decided', 'no "Decided:" clause (§7)', flat.slice(0, 220), b.line));
		if (!next) fails.push(fail('ledger', 'ledger.next', 'no "Next:" clause — the baton (§7)', flat.slice(0, 220), b.line));

		entries.push({ date, mantle, tier, row, body, decided, next, line: b.line, block: b.text });
	}
	return { entries, tail: entries.at(-1) ?? null, fails, blocks: bs.length };
}

// ---------- §5 kickoffs · §11 the baton ----------

export type Kickoff = { mantle: string; tier: string | null; text: string; line: number };

const SUMMONS_LINE = /^You are (?:an?|the) ([A-Za-z ]+?) at ([\w.-]+)\.$/;

/** Every fenced block whose first line opens the canon summons grammar (D45's single-glance test). */
export function parseKickoffs(md: string): { kickoffs: Kickoff[]; fails: Fail[]; fences: number } {
	const fails: Fail[] = [];
	const lines = md.split('\n');
	const kickoffs: Kickoff[] = [];
	let fences = 0;
	for (let i = 0; i < lines.length; i++) {
		if (!/^\s*```/.test(lines[i]!)) continue;
		const start = i;
		let j = i + 1;
		for (; j < lines.length && !/^\s*```\s*$/.test(lines[j]!); j++);
		const body = lines.slice(start + 1, j).join('\n');
		i = j;
		const first = body.split('\n').find(l => l.trim());
		if (!first || !/^You are /.test(first.trim())) continue; // not a summons fence
		fences++;
		const m = first.trim().match(SUMMONS_LINE);
		if (!m) {
			fails.push(fail('kickoff', 'kickoff.summons', 'first line is not "You are a <Mantle> at <tier>." (D45)', first.trim().slice(0, 200), start + 1));
			continue;
		}
		const mantle = MANTLES.find(x => x.toLowerCase() === m[1]!.toLowerCase()) ?? null;
		if (!mantle) fails.push(fail('kickoff', 'kickoff.mantle', 'unknown mantle in the summons line', first.trim().slice(0, 200), start + 1));
		const tier = isTier(m[2]!) ? m[2]! : null;
		if (!tier) fails.push(fail('kickoff', 'kickoff.tier', 'unknown tier in the summons line', first.trim().slice(0, 200), start + 1));
		kickoffs.push({ mantle: mantle ?? m[1]!, tier, text: body, line: start + 1 });
	}
	return { kickoffs, fails, fences };
}

/**
 * D64 — the baton's move takes one instrument, the wave n, the fork n exclusive ones.
 * From a ledger tail we can honestly read the instruments, never the exclusivity: the
 * fork's mark is prose, so this reports what is fireable and lets plurality speak.
 */
export type Instrument =
	| { kind: 'summons'; text: string; mantle: string | null; tier: string | null }
	| { kind: 'row'; row: string };
export type Baton = { holder: 'session' | 'felix' | 'prose'; text: string; instruments: Instrument[] };

export function classifyBaton(entry: LedgerEntry | null): Baton | null {
	if (!entry?.next) return null;
	const instruments: Instrument[] = [];

	// (a) the summons fenced verbatim in the entry (D63g)
	for (const k of parseKickoffs(entry.block).kickoffs) instruments.push({ kind: 'summons', text: k.text, mantle: k.mantle, tier: k.tier });
	// (b) the row-reference the rail resolves to the work doc's fence (D63g)
	for (const m of entry.next.matchAll(/\bfire\s+([A-Za-z0-9]+(?:\s*[,+]\s*[A-Za-z0-9]+)*)/g))
		for (const id of topSplit(m[1]!, [',', '+'])) instruments.push({ kind: 'row', row: id });

	if (instruments.length) return { holder: 'session', text: entry.next, instruments };
	if (/\bFelix\b/.test(entry.next)) return { holder: 'felix', text: entry.next, instruments };
	return { holder: 'prose', text: entry.next, instruments };
}

export function batonFails(baton: Baton | null, line: number): Fail[] {
	if (baton?.holder !== 'prose') return [];
	return [fail('ledger', 'ledger.baton', 'the Next clause carries no instrument and names no Felix-action — a dropped baton (D63g/D64)', baton.text.slice(0, 200), line)];
}

// ---------- §8 decisions ----------

export type Decision = {
	id: string; date: string; decider: string; title: string; body: string;
	ratified: boolean; pending: boolean; line: number;
};

export function parseDecisions(md: string): { decisions: Decision[]; queue: Decision[]; fails: Fail[]; candidates: number } {
	const fails: Fail[] = [];
	const lines = md.split('\n');
	const decisions: Decision[] = [];
	let candidates = 0;
	for (let i = 0; i < lines.length; i++) {
		if (!/^\s*[-*]\s*\*\*D\d/.test(lines[i]!)) continue;
		candidates++;
		const at = i + 1;
		let text = lines[i]!.trim(), j = i + 1;
		for (; j < lines.length && lines[j]!.trim() && !/^\s*[-*]\s*\*\*D\d/.test(lines[j]!) && !/^#{1,6} /.test(lines[j]!); j++) text += ' ' + lines[j]!.trim();
		i = j - 1;

		const head = text.match(/^\s*[-*]\s*\*\*D(\d+)\*\*\s*\(/);
		if (!head) {
			fails.push(fail('decisions', 'decision.head', 'entry does not open "- **D<n>** (" (§8)', text.slice(0, 240), at));
			continue;
		}
		// The attribution runs to the MATCHING ')' — "Architect (02) · ✓ Felix" nests (P3 §0).
		let k = head[0]!.length, depth = 1;
		for (; k < text.length && depth; k++) { if (text[k] === '(') depth++; else if (text[k] === ')') depth--; }
		const paren = text.slice(head[0]!.length, k - 1);
		if (!/^\s*:/.test(text.slice(k))) {
			fails.push(fail('decisions', 'decision.colon', 'no ":" after the attribution (§8)', text.slice(0, 240), at));
			continue;
		}
		const rest = text.slice(k).replace(/^\s*:\s*/, '');
		const tm = rest.match(/^\*\*(.+?)\.?\*\*\s*(.*)$/);
		if (!tm) fails.push(fail('decisions', 'decision.title', 'the title is not a bold-delimited label "**<title>.**" (D63i) — the entry opens straight into prose', `D${head[1]}: ${rest.slice(0, 200)}`, at));
		const pm = paren.match(/^(\d{4}-\d{2}-\d{2}),\s*(.+)$/s);
		if (!pm) fails.push(fail('decisions', 'decision.attribution', 'attribution is not "(<ISO date>, <decider>)" (§8)', `D${head[1]}: ${JSON.stringify(paren.slice(0, 160))}`, at));

		decisions.push({
			id: `D${head[1]}`, date: pm ? pm[1]! : '',
			decider: (pm ? pm[2]! : paren).replace(/\s*·?\s*✓\s*Felix\s*$/, '').trim(),
			title: tm ? tm[1]! : rest.split('.')[0]!, body: tm ? tm[2]! : rest,
			ratified: /✓\s*Felix/.test(paren),
			pending: /proposed\s*[—–-]\s*pending Felix countersign/i.test(text),
			line: at,
		});
	}
	// A decision Felix made needs no countersign; the queue is what waits on his pen (P3 §5).
	const queue = decisions.filter(d => d.pending || (!d.ratified && !/^Felix\b/.test(d.decider)));
	return { decisions, queue, fails, candidates };
}

// ---------- §3 ISSUES — the inbox ----------

export type Issue = { date: string | null; who: string | null; text: string; line: number };

const ISSUE_LINE = /^\s*-\s+(\d{4}-\d{2}-\d{2})\s*·\s*([^·]+?)\s*·\s*(.+)$/;

/** D63h — `- <date> · <who> · <what>`, one bullet per entry; a `---` block when it needs evidence. */
export function parseIssues(md: string): { issues: Issue[]; fails: Fail[]; blocks: number } {
	const fails: Fail[] = [];
	const bs = blocks(md);
	const body = bs.slice(1); // block 0 is the protocol header
	const issues: Issue[] = [];

	for (const b of body) {
		const lines = b.text.split('\n');
		let seen = 0;
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]!;
			if (/^#{1,6}\s+(Open|Harvested)\b/i.test(line)) {
				fails.push(fail('issues', 'issue.sectioned', 'Open/Harvested sectioning is not canon (D63h) — the inbox drains empty', line.trim().slice(0, 120), b.line + i));
				continue;
			}
			const m = line.match(ISSUE_LINE);
			if (!m) continue;
			seen++;
			issues.push({ date: m[1]!, who: m[2]!.trim(), text: m[3]!.trim(), line: b.line + i });
		}
		if (!seen && b.text.trim()) fails.push(fail('issues', 'issue.entry', 'block does not open with "- <YYYY-MM-DD> · <who> · <what>" (D63h)', b.text.trim().slice(0, 200), b.line));
	}
	return { issues, fails, blocks: bs.length };
}
