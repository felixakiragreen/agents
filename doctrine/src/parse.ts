// The five artifact parsers — DOCTRINE §4 (board), §7 (ledger), §8 (decisions),
// §3 (ISSUES), §5 (kickoffs) + §11 (the baton), as amended by D63 and D64.
// Harvested from the P3 probes (belvedere/lab/p3/parse.ts) and amended where the fold forced it.
//
// Parser-as-lint: a field the doctrine names and the doc does not carry is a Fail with the
// verbatim excerpt — never a parser branch. The shapes below are P3 §5's, normative per D65.

import {
	FELIX_GATE, MANTLES, PARKED, PENDING, RETIRED, STATES, UNRECORDED, UNSTAFFED, VERDICTS,
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
	unstaffed: boolean;           // D63 as amended — a recorded absence: deliberately no staffing
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
	const out = { mantle: null as string | null, tier: null as string | null, felixGate: false, unstaffed: false, rider: inner };

	if (head === FELIX_GATE) { out.felixGate = true; return { ...out, fails }; }
	// D63 as amended — whole-Staffing typed absences: `unstaffed` (knowledge), `unrecorded` (ignorance).
	if (head === UNSTAFFED) { out.unstaffed = true; return { ...out, fails }; }
	if (head === UNRECORDED) { out.mantle = UNRECORDED; out.tier = UNRECORDED; return { ...out, fails }; }

	const segs = topSplit(head, ['·']);
	if (segs.length !== 2) {
		fails.push(fail('board', 'board.staffing', `staffing is not "<Mantle> · <tier>", "${FELIX_GATE}", "${UNSTAFFED}" or "${UNRECORDED}"`, `${id}: ${JSON.stringify(cell)}`, line));
		return { ...out, fails };
	}
	const [m, t] = segs as [string, string];
	if (isMantle(m) || m === UNRECORDED) out.mantle = m;
	else fails.push(fail('board', 'board.mantle', 'unknown mantle', `${id}: ${JSON.stringify(m)}`, line));
	if (isTier(t) || t === UNRECORDED) out.tier = t;
	else fails.push(fail('board', 'board.tier', 'unknown tier', `${id}: ${JSON.stringify(t)}`, line));
	return { ...out, fails };
}

/**
 * The this-row-landed idiom (row 17 C2): a landing narrated in the annotation — bold-opened
 * or arrow-led, ISO-dated — while the state token still says the row is workable. A landing
 * ATTRIBUTED to another row ("13 LANDED 2026-08-22") is that row's history and passes.
 */
const STALE_LEAD = /(?:→\s*\*{0,2}|\*\*)\s*(?:LANDED|KILLED)\s+\d{4}-\d{2}-\d{2}/;

/** §4's lifecycle: the state leads; PENDING/PARKED and the verdicts ride the annotation (D63b, D63c, D69). */
function parseStatus(cell: string, id: string, line: number) {
	const fails: Fail[] = [];
	const st = strip(cell);
	const lead = leadingToken(st);
	if (isState(lead)) {
		if ((lead === 'OPEN' || lead === 'IN FLIGHT') && STALE_LEAD.test(cell))
			fails.push(fail('board', 'board.stale-lead', `the ${lead} lead is outrun by its own annotation's landing (row 17 C2) — the state leads with the truth, history rides the annotation`, `${id}: ${JSON.stringify(st.slice(0, 160))}`, line));
		return { state: lead as State, annotation: st.slice(lead.length).replace(/^[\s—–-]+/, ''), fails };
	}

	const excerpt = `${id}: ${JSON.stringify(st.slice(0, 160))}`;
	if (RETIRED[lead]) fails.push(fail('board', 'board.retired', `"${lead}" is a retired synonym (§4) — use ${RETIRED[lead]}`, excerpt, line));
	else if (lead === PENDING) fails.push(fail('board', 'board.pending-leads', 'PENDING never leads (D63c) — write "OPEN — PENDING <precondition>"', excerpt, line));
	else if (lead === PARKED) fails.push(fail('board', 'board.parked-leads', 'PARKED never leads (D69) — write "OPEN — PARKED <reason>"', excerpt, line));
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
		fails.push(fail('board', 'board.depends', `depends-on segment is neither a row id in this building nor "${FELIX_GATE}: <text>" (D63e)`, `${id}: ${JSON.stringify(seg.slice(0, 160))}`, line));
	}
	return { dependsOn, gates, fails };
}

/** The five canonical names present but re-ordered — parseable positionally (item 8). */
function columnOrder(header: string[]): number[] | null {
	if (header.length !== 5) return null;
	const names = header.map(h => strip(h).toLowerCase());
	const order = BOARD_COLUMNS.map(want => names.indexOf(want));
	return order.every(i => i >= 0) ? order : null;
}

/** The row ids a document's board tables declare — the union feeds building-wide Depends-on (D63e). */
export function boardIds(md: string): Set<string> {
	const ids = new Set<string>();
	for (const t of tables(md)) {
		const order = isBoardHeader(t.header) ? [0, 1, 2, 3, 4] : columnOrder(t.header);
		if (order) for (const r of t.rows) if (r.cells.length === 5) ids.add(strip(delink(r.cells[order[0]!]!)));
	}
	return ids;
}

export function parseBoards(md: string, buildingIds?: Set<string>): { boards: Board[]; fails: Fail[]; staffingTables: number } {
	const fails: Fail[] = [];
	const all = tables(md);
	const parseable = all
		.map(t => ({ t, order: isBoardHeader(t.header) ? [0, 1, 2, 3, 4] : columnOrder(t.header) }))
		.filter((x): x is { t: Table; order: number[] } => x.order !== null);
	const refused = all.filter(t => !parseable.some(p => p.t === t) && t.header.some(h => /^staffing$/i.test(strip(h))));
	const staffingTables = refused.length + parseable.filter(p => p.order.some((v, k) => v !== k)).length;

	// Depends-on resolves against the BUILDING's row ids (D63e said "row ids", never "on this
	// board"); a lone document is its own building.
	const knownIds = buildingIds ?? boardIds(md);

	// A permuted header is a defect the rows must not hide behind: 1 failure once hid 97 (18g).
	for (const { t, order } of parseable) {
		if (order.some((v, k) => v !== k))
			fails.push(fail('board', 'board.columns', `the five canonical columns are present but re-ordered — parsed positionally; re-cut to: ${BOARD_COLUMNS.join(' | ')}`, '| ' + t.header.join(' | ') + ' |', t.line));
	}
	// A refused table's rows are invisible — say how many, never report a near-clean building (18g).
	for (const t of refused)
		fails.push(fail('board', 'board.columns', `non-canonical columns refuse ${t.rows.length} row(s) unparsed — any table that staffs sessions is a board (D45): ${BOARD_COLUMNS.join(' | ')}`, '| ' + t.header.join(' | ') + ' |', t.line));

	const boards: Board[] = [];
	for (const { t, order } of parseable) {
		const rows: BoardRow[] = [];
		for (const { cells, line } of t.rows) {
			if (cells.length !== 5) {
				const bad = cells.find(c => /`[^`]*\|/.test(c)) ?? cells.slice(5).join(' | ');
				fails.push(fail('board', 'board.pipe', `row splits into ${cells.length} cells (unescaped | inside a cell — the row is already truncated in any GFM renderer)`, `${strip(delink(cells[0] ?? ''))}: …${String(bad).slice(0, 120)}`, line));
				continue;
			}
			const r = order.map(i => cells[i]!);
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
				mantle: staff.mantle, tier: staff.tier, felixGate: staff.felixGate, unstaffed: staff.unstaffed,
				rider: staff.rider, state: stat.state, annotation: stat.annotation, line,
			});
		}
		boards.push({ heading: t.heading, line: t.line, rows });
	}
	fails.push(...truncations(md, all, parseable.map(p => p.t)));
	return { boards, fails, staffingTables };
}

/**
 * A |-row after a blank line after a table is a TRUNCATED table, not a new one — the blank
 * line hid six whiteboardy rows, two ch2 rows and seven cornerizer rows from every parser in
 * the city while the lint read the remainder as clean (item 9; three sightings in one wave).
 */
function truncations(md: string, all: Table[], boards: Table[]): Fail[] {
	const fails: Fail[] = [];
	const lines = md.split('\n');
	const owned = new Set<number>();                     // 1-based lines any parsed table occupies
	for (const t of all) {
		owned.add(t.line);
		owned.add(t.line + 1);
		for (const r of t.rows) owned.add(r.line);
	}
	for (const t of boards) {
		const end = t.rows.at(-1)?.line ?? t.line + 1;   // last occupied line of this table
		let i = end;                                     // 0-based index of the line after it
		while (i < lines.length && !lines[i]!.trim()) i++;
		if (i === end || i >= lines.length) continue;    // no blank gap, or end of file
		if (!/^\s*\|/.test(lines[i]!) || owned.has(i + 1)) continue;
		let n = 0;
		for (let j = i; j < lines.length && /^\s*\|/.test(lines[j]!) && !owned.has(j + 1); j++) n++;
		fails.push(fail('board', 'board.truncated', `a blank line truncates the table at line ${t.line} — ${n} |-row(s) after it are invisible to every parser (item 9)`, lines[i]!.slice(0, 160), i + 1));
	}
	return fails;
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

	// The D63f head grammar at line start — item 16's discriminator for a swallowed entry.
	const HEAD = /^\*\*\d{4}-\d{2}-\d{2}\s*·[^\n]*?\*\*\s*[—–-]/;

	for (const b of bs) {
		if (/^#/.test(b.text.trim())) continue; // the file header block

		// A merged entry makes the lint QUIETER, not louder (row 17 C1): a non-first line that
		// opens in the head grammar is a swallowed entry missing its `---`, never body prose.
		const blines = b.text.split('\n');
		let fence = false, seenHead = false;
		for (let i = 0; i < blines.length; i++) {
			const l = blines[i]!;
			if (/^\s*```/.test(l)) { fence = !fence; continue; }
			if (fence || !l.trim()) continue;
			if (HEAD.test(l) && seenHead)
				fails.push(fail('ledger', 'ledger.merged', 'a head mid-block — two entries share one block: the `---` separator above this line is missing (item 16)', l.slice(0, 160), b.line + i));
			if (l.trim()) seenHead = true;
		}

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

		if (!isMantle(mantle) && mantle !== UNRECORDED) fails.push(fail('ledger', 'ledger.mantle', 'unknown mantle', JSON.stringify(mantle), b.line));
		let tier: string | null = null;
		if (tierSeg === null) fails.push(fail('ledger', 'ledger.tier', 'the head carries no tier slot (D63f)', flat.slice(0, 160), b.line));
		else if (isTier(tierSeg) || tierSeg === UNRECORDED) tier = tierSeg;
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
		// A summons names a mantle right after the article; a fence that names none there — a
		// Personal-Log letter, a role-play template — is not a kickoff candidate (item 13).
		const named = first.trim().match(/^You are (?:an?|the)\s+(.+)$/);
		if (!named || !MANTLES.some(x => named[1]!.toLowerCase().startsWith(x.toLowerCase()))) continue;
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
	// `fire 16` is an instrument; `fire the Grand Architect` is prose. Every row id in the city
	// carries a digit, and mistaking a word for one indicts the parser (P3 §0).
	for (const m of entry.next.matchAll(/\bfire\s+([A-Za-z0-9-]+(?:\s*[,+]\s*[A-Za-z0-9-]+)*)/g))
		for (const id of topSplit(m[1]!, [',', '+'])) if (/\d/.test(id)) instruments.push({ kind: 'row', row: id });

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
	// A project's decision ids carry its own prefix — RP-1, A1, D63 (item 11); the id is
	// verbatim. A candidate must carry the ATTRIBUTION shape after its id — `**D1** (…`,
	// `**D1 (…` or the pre-doctrine `**D1 · …` — or every bold cross-reference bullet in a
	// master doc ("**T13 ∥ t12c**, concurrent…") is promoted to a malformed decision.
	const CANDIDATE = /^\s*[-*]\s*\*\*[A-Za-z]{1,8}-?\d+[a-z]?(\*\*\s*[*_]?\(|\s+\(|\s*·)/;
	for (let i = 0; i < lines.length; i++) {
		if (!CANDIDATE.test(lines[i]!)) continue;
		candidates++;
		const at = i + 1;
		let text = lines[i]!.trim(), j = i + 1;
		for (; j < lines.length && lines[j]!.trim() && !CANDIDATE.test(lines[j]!) && !/^#{1,6} /.test(lines[j]!); j++) text += ' ' + lines[j]!.trim();
		i = j - 1;

		const head = text.match(/^\s*[-*]\s*\*\*([A-Za-z]{1,8}-?\d+[a-z]?)\*\*\s*\(/);
		if (!head) {
			fails.push(fail('decisions', 'decision.head', 'entry does not open "- **<id>** (" (§8)', text.slice(0, 240), at));
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
		if (!tm) fails.push(fail('decisions', 'decision.title', 'the title is not a bold-delimited label "**<title>.**" (D63i) — the entry opens straight into prose', `${head[1]}: ${rest.slice(0, 200)}`, at));
		const pm = paren.match(/^(\d{4}-\d{2}-\d{2}),\s*(.+)$/s);
		if (!pm) fails.push(fail('decisions', 'decision.attribution', 'attribution is not "(<ISO date>, <decider>)" (§8)', `${head[1]}: ${JSON.stringify(paren.slice(0, 160))}`, at));

		decisions.push({
			id: head[1]!, date: pm ? pm[1]! : '',
			decider: (pm ? pm[2]! : paren).replace(/\s*·?\s*✓\s*Felix\s*$/, '').trim(),
			title: tm ? tm[1]! : rest.split('.')[0]!, body: tm ? tm[2]! : rest,
			ratified: /✓\s*Felix/.test(paren),
			// The marker lives in the ATTRIBUTION; a body that merely quotes the phrase — D21, the
			// entry that DEFINES it — never counts (item 12).
			pending: /proposed[\s,]*(?:[—–-]\s*)?pending Felix countersign/i.test(paren),
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
