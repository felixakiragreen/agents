// The five artifact parsers — DOCTRINE §4 (board), §7 (ledger), §8 (decisions),
// §3 (ISSUES), §5 (kickoffs) + §11 (the baton), as amended by D63, D64 and D71 (the standard).
// Harvested from the P3 probes (belvedere/lab/p3/parse.ts) and amended where the fold forced it.
//
// Parser-as-lint: a field the doctrine names and the doc does not carry is a Fail with the
// verbatim excerpt — never a parser branch. The shapes below are P3 §5's, normative per D65.

import {
	BATON_TYPES, BLESSED_MARK, CELL_CAP, DECISION_ID, DEFERRED, DETERMINERS, ENTRY_CAP, FELIX_GATE, GATE_ID, HEX_GATE, MANTLES, MARK_TAIL,
	PARKED, PENDING, PROPOSED_MARK, REGISTER_CAP, RETIRED, STATES, UNRECORDED, UNSTAFFED, VERDICTS,
	creditDate, delink, fail, isId, isMantle, isSizedBlessing, isSizedCredit, isState, isTier, leadingToken, linkTarget, magnitude,
	maskCode, strip, topSplit,
	trailingParen,
	type BatonType, type Fail, type State,
} from './grammar';

// ---------- §4 the board ----------

export type BoardRow = {
	id: string;
	work: string;                 // link text, de-linked
	workDoc: string | null;       // the href — the building page's row link
	dependsOn: string[];          // charge ids (D63e)
	gates: string[];              // `⬡-gate: <text>` segments (D63e)
	crossings: string[];          // `<building>:<id>` — resolved against the building register at lint (D79)
	mantle: string | null;
	tier: string | null;
	hexGate: boolean;           // D63a/D71 — the charge is Felix's (`⬡-gate`); the glass never auto-ignites it
	dissolved: boolean;           // D71 — a DEFERRED charge whose shelving dissolved its staffing (`—`)
	rider: string | null;         // D63d — annotation for eyes, ignored by dispatch
	state: State | null;
	annotation: string;           // everything after the state token
	holds: Hold[];                // §4 — the landing's named remainders (032 (b))
	escalations: Escalation[];    // §4 — born and ruled, read off this row (032 (c))
	line: number;
};

/**
 * §4's typed remainder on a landing — `LANDED ‹date› — holds: ‹list›`. A hold is an escalation's
 * id or a `⬡ ‹text›`, and it PAUSES dependent charges: absent means clean, and clearing is
 * written on the row. The standard's entry is `hold` (§2), minted with the flow grammar (D74).
 */
export type Hold = { kind: 'escalation'; id: string } | { kind: 'felix'; text: string };
/** §4 — an escalation is an id: born `E‹n› — ‹what›`, dead `E‹n› ruled ‹date›`. */
export type Escalation = { id: string; what: string | null; ruled: string | null; row: string; line: number };
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

/** A charge is DEFERRED when its Status carries the annotation; PARKED is that word's history. */
const isDeferred = (status: string) => new RegExp(`\\b(?:${DEFERRED}|${PARKED})\\b`).test(status);

/**
 * §4's Staffing law as amended (D71): `<Mantle> · <tier>` or the literal `⬡-gate`, either with a
 * `(rider)`. **Charges are always staffed** — the one absence left is a DEFERRED charge whose
 * shelving dissolved its staffing, and it writes `—`.
 */
function parseStaffing(cell: string, status: string, id: string, line: number) {
	const fails: Fail[] = [];
	const s = strip(delink(cell));
	const { head, inner } = trailingParen(s);
	const out = { mantle: null as string | null, tier: null as string | null, hexGate: false, dissolved: false, rider: inner };

	if (head === HEX_GATE || head === FELIX_GATE) { out.hexGate = true; return { ...out, fails }; }
	// D63 as amended — the whole-Staffing typed absence: `unrecorded` asserts ignorance.
	if (head === UNRECORDED) { out.mantle = UNRECORDED; out.tier = UNRECORDED; return { ...out, fails }; }

	// D71, lint-hard: an unstaffed charge is not permitted, ever. `—` is dissolution, legal only
	// where the Status says the charge is shelved; `unstaffed` left the legal set with the standard.
	if (head === '' || head === UNSTAFFED || /^[—–-]$/.test(head)) {
		if (head !== UNSTAFFED && isDeferred(status)) { out.dissolved = true; return { ...out, fails }; }
		fails.push(fail('board', 'board.unstaffed', 'charges are always staffed (D71) — staffing is empty, the dead token "unstaffed", or a dissolved "—" on a charge whose Status carries no DEFERRED', `${id}: ${JSON.stringify(cell)}`, line));
		return { ...out, fails };
	}

	const segs = topSplit(head, ['·']);
	if (segs.length !== 2) {
		fails.push(fail('board', 'board.staffing', `staffing is not "<Mantle> · <tier>", "${HEX_GATE}" or "${UNRECORDED}"`, `${id}: ${JSON.stringify(cell)}`, line));
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
 * The this-row-landed idiom (row 017 C2): a landing narrated in the annotation — bold-opened
 * or arrow-led, ISO-dated — while the state token still says the row is workable. A landing
 * ATTRIBUTED to another row ("13 LANDED 2026-08-22") is that row's history and passes.
 */
const STALE_LEAD = /(?:→\s*\*{0,2}|\*\*)\s*(?:LANDED|KILLED)\s+\d{4}-\d{2}-\d{2}/;

/** §4's lifecycle: the state leads; PENDING/DEFERRED and the verdicts ride the annotation (D63b, D63c, D71). */
function parseStatus(cell: string, id: string, line: number) {
	const fails: Fail[] = [];
	const st = strip(cell);
	const lead = leadingToken(st);
	if (isState(lead)) {
		if ((lead === 'OPEN' || lead === 'IN FLIGHT') && STALE_LEAD.test(cell))
			fails.push(fail('board', 'board.stale-lead', `the ${lead} lead is outrun by its own annotation's landing (row 017 C2) — the state leads with the truth, history rides the annotation`, `${id}: ${JSON.stringify(st.slice(0, 160))}`, line));
		// D78's retention law, lint-hard: a resolved row's cell is the state and where to read the
		// rest. The cell is measured as written — a reader reads the markdown too.
		const written = cell.trim().length;
		if ((lead === 'LANDED' || lead === 'KILLED') && written > CELL_CAP)
			fails.push(fail('board', 'board.cell-cap', `a LANDED or KILLED Status cell is capped at ${CELL_CAP} characters (D78) — compress to status + findings pointer, and let the charge doc carry the story`, `${id} (${written} chars): ${JSON.stringify(st.slice(0, 140))}…`, line));
		return { state: lead as State, annotation: st.slice(lead.length).replace(/^[\s—–-]+/, ''), fails };
	}

	const excerpt = `${id}: ${JSON.stringify(st.slice(0, 160))}`;
	if (RETIRED[lead]) fails.push(fail('board', 'board.retired', `"${lead}" is a retired synonym (§4) — use ${RETIRED[lead]}`, excerpt, line));
	else if (lead === PENDING) fails.push(fail('board', 'board.pending-leads', 'PENDING never leads (D63c) — write "OPEN — PENDING <precondition>"', excerpt, line));
	else if (lead === DEFERRED) fails.push(fail('board', 'board.deferred-leads', 'DEFERRED never leads (D71) — write "OPEN — DEFERRED <reason>"', excerpt, line));
	else if (lead === PARKED) fails.push(fail('board', 'board.parked-leads', 'PARKED never leads, and it is DEFERRED\'s history (D71) — write "OPEN — DEFERRED <reason>"', excerpt, line));
	else if ((VERDICTS as readonly string[]).includes(lead)) fails.push(fail('board', 'board.verdict-leads', `a verdict rides the annotation (D63b) — write "LANDED — ${lead} …"`, excerpt, line));
	else fails.push(fail('board', 'board.state', 'status does not open with a lifecycle state', excerpt, line));
	return { state: null, annotation: st, fails };
}

/**
 * §4's holds list, off a Status annotation. It opens at `holds:` and runs to the annotation's
 * NEXT em-dash — the same `—` that joined the list to the state, so a landing writes its
 * findings pointer behind the holds and neither eats the other.
 */
function parseHolds(annotation: string, id: string, line: number): { holds: Hold[]; fails: Fail[] } {
	const fails: Fail[] = [];
	const holds: Hold[] = [];
	const at = annotation.match(/\bholds:[ \t]*/);
	if (!at) return { holds, fails };
	const list = topSplit(annotation.slice(at.index! + at[0].length), ['—', '–'])[0] ?? '';
	// `·` alone separates holds. Depends-on takes the comma too because the record wrote it that
	// way for a year; `holds:` was minted 2026-09-15 with one separator, and a hold's text is
	// free prose full of commas — belvedere's B22 lists five paid candidates inside one ⬡-hold.
	for (const seg of topSplit(list, ['·'])) {
		const e = seg.match(/^\**(E\d+)\b/);
		if (e) { holds.push({ kind: 'escalation', id: e[1]! }); continue; }
		const f = seg.match(/^\**⬡\s*(.+)$/);
		if (f) { holds.push({ kind: 'felix', text: strip(f[1]!) }); continue; }
		fails.push(fail('board', 'board.hold', 'a hold is an escalation id or a ⬡-text (§4) — write "LANDED ‹date› — holds: E3 · ⬡ ‹what he owes›"; a hold nobody can address pauses its dependants for nothing', `${id}: ${JSON.stringify(seg.slice(0, 120))}`, line));
	}
	return { holds, fails };
}

/**
 * §4's escalation ids, off a Status annotation: `E‹n› — ‹what›` is a birth, `E‹n› ruled ‹date›`
 * a death. Both are read where the record writes them — on the row the escalation belongs to —
 * and an id that appears only inside a `holds:` list is a REFERENCE, not a birth, so it carries
 * neither text nor a ruling here.
 */
function parseEscalations(annotation: string, id: string, line: number): Escalation[] {
	const by = new Map<string, Escalation>();
	const of = (eid: string) => by.get(eid) ?? (by.set(eid, { id: eid, what: null, ruled: null, row: id, line }), by.get(eid)!);
	// The deaths are read FIRST and they leave the text: one row writes both — `holds: E4 — E4
	// ruled ‹date›` — and a birth's `— ‹what›` would otherwise swallow the ruling behind it.
	const births = annotation.replace(/\b(E\d+)\s+ruled\s+(\d{4}-\d{2}-\d{2})/g,
		(_, eid: string, date: string) => { of(eid).ruled = date; return ''; });
	for (const m of births.matchAll(/\b(E\d+)\s*[—–]\s*([^·;\n]+)/g)) {
		const what = strip(m[2]!).trim();
		if (what) of(m[1]!).what = what;
	}
	return [...by.values()];
}

/**
 * §4's Depends-on: exactly three forms (D63e, respelled by D71) — a charge id in this
 * building, the qualified `<building>:<id>`, or `⬡-gate: <text>`.
 *
 * The crossing is read for FORM here and resolved at lint (§4's own word): its building half
 * binds to a Name in the building register, which is a file on disk, and this parser is text
 * in, values out. A far id is never checked against a far board — the crossing names a door.
 */
const CROSSING = /^([A-Za-z][A-Za-z0-9-]*)\s*:\s*(\S+)$/;

function parseDependsOn(cell: string, id: string, line: number, knownIds: Set<string>) {
	const fails: Fail[] = [];
	const d = strip(delink(cell));
	const dependsOn: string[] = [], gates: string[] = [], crossings: string[] = [];
	if (/^[—–-]$/.test(d) || d === '') return { dependsOn, gates, crossings, fails };

	for (const seg of topSplit(d, ['·', ',', ';'])) {
		const gate = seg.match(/^\**(?:⬡-gate|Felix-gate)\**\s*:\s*(.+)$/);
		if (gate) { gates.push(gate[1]!.trim()); continue; }
		if (knownIds.has(seg)) { dependsOn.push(seg); continue; }
		const cross = seg.match(CROSSING);
		if (cross && isId(cross[2]!)) { crossings.push(`${cross[1]}:${cross[2]}`); continue; }
		// Non-conforming, but still recover any row id it names: a null is a render decision,
		// not an error (P3 §5) — the glass draws the graph while the lint files the defect.
		dependsOn.push(...seg.split(/[\s+,]+/).filter(x => knownIds.has(x)));
		fails.push(fail('board', 'board.depends', `depends-on segment is none of the three forms (D63e; D79): a charge id in this building, "<building>:<id>", or "${HEX_GATE}: <text>"`, `${id}: ${JSON.stringify(seg.slice(0, 160))}`, line));
	}
	return { dependsOn, gates, crossings, fails };
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

			const staff = parseStaffing(staffC, statC, id, line);
			const stat = parseStatus(statC, id, line);
			const dep = parseDependsOn(depC, id, line, knownIds);
			const held = parseHolds(stat.annotation, id, line);
			fails.push(...staff.fails, ...stat.fails, ...dep.fails, ...held.fails);

			rows.push({
				id, work: strip(delink(workC)), workDoc: linkTarget(workC),
				dependsOn: dep.dependsOn, gates: dep.gates, crossings: dep.crossings,
				mantle: staff.mantle, tier: staff.tier, hexGate: staff.hexGate, dissolved: staff.dissolved,
				rider: staff.rider, state: stat.state, annotation: stat.annotation,
				holds: held.holds, escalations: parseEscalations(stat.annotation, id, line), line,
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

/**
 * §7's two clauses — `Decided:` and `Next:` — split an entry's body, and only a marker that
 * LEADS splits it: one that opens the body, opens a line, or opens a sentence. A marker the
 * prose merely mentions is not a clause: two of the city's fifteen tails handed a `next` read
 * off bytes their writer never meant as the clause (B26 F5, spacex-dashboard-c2 and manny).
 * Code is masked before the search — an entry quoting `Next:` is quoting, not clausing — and
 * each clause runs to the NEXT marker, so a `Next:` no longer swallows the `Decided:` behind it.
 */
const CLAUSE_MARKER = /\b(Decided|Next):/g;

function clauses(body: string): { decided: string | null; next: string | null } {
	const masked = maskCode(body);
	const marks: { name: string; at: number; end: number }[] = [];
	for (const m of masked.matchAll(CLAUSE_MARKER)) {
		// bullets and emphasis are punctuation, not prose — `- **Next:**` leads its line
		const lead = masked.slice(0, m.index).replace(/[ \t*_+-]*$/, '');
		if (lead === '' || lead.endsWith('\n') || /[.!?][)\]”"']*$/.test(lead))
			marks.push({ name: m[1]!, at: m.index, end: m.index + m[0]!.length });
	}
	const clause = (name: string) => {
		const k = marks.findIndex(x => x.name === name);
		if (k < 0) return null;
		// `- **Next:** x` closes its own bold on the far side of the colon: a `**` with a space
		// behind it is that delimiter, never the opening of the clause's own emphasis.
		return body.slice(marks[k]!.end, marks[k + 1]?.at ?? body.length)
			.replace(/\s+/g, ' ').trim().replace(/^\*\*(?=\s)/, '').trim();
	};
	// §7 writes the clause as a sentence; the record keeps its text, never the full stop.
	return { decided: clause('Decided')?.replace(/[\s*_+-]+$/, '').replace(/\.$/, '') ?? null, next: clause('Next') };
}

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

export type Ledger = { entries: LedgerEntry[]; tail: LedgerEntry | null; fails: Fail[]; blocks: number };

export function parseLedger(md: string): Ledger {
	const fails: Fail[] = [];
	const bs = blocks(md);
	const entries: LedgerEntry[] = [];

	// The D63f head grammar at line start — item 16's discriminator for a swallowed entry.
	const HEAD = /^\*\*\d{4}-\d{2}-\d{2}\s*·[^\n]*?\*\*\s*[—–-]/;

	for (const b of bs) {
		if (/^#/.test(b.text.trim())) continue; // the file header block

		// A merged entry makes the lint QUIETER, not louder (row 017 C1): a non-first line that
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

		// The clauses are read off the entry's OWN lines, never the flattened run: flattening
		// erases the line starts that tell a clause from a mention (B26 F5).
		const raw = b.text.replace(/^\s+/, '');
		const rawHead = raw.match(/^\*\*([^*]+?)\*\*\s*[—–-]\s*/);
		const body = m[2]!;
		const { decided, next } = clauses(rawHead ? raw.slice(rawHead[0]!.length) : raw);
		if (!decided) fails.push(fail('ledger', 'ledger.decided', 'no "Decided:" clause (§7)', flat.slice(0, 220), b.line));
		if (!next) fails.push(fail('ledger', 'ledger.next', 'no "Next:" clause — the baton (§7)', flat.slice(0, 220), b.line));

		// D78, as a warning: the ledger's tail-read protocol bounds what anyone READS, so the cap
		// binds the writer and never the reader. The office rules whether to harden after a sweep.
		const words = b.text.trim().split(/\s+/).length;
		if (words > ENTRY_CAP)
			fails.push(fail('ledger', 'ledger.entry-cap', `a ledger entry is capped at ${ENTRY_CAP} words (D78) — the entry is date · mantle · changed · decided · next, and the story lives in the charge doc`, `(${words} words) ${flat.slice(0, 200)}`, b.line, 'warn'));

		entries.push({ date, mantle, tier, row, body, decided, next, line: b.line, block: b.text });
	}
	return { entries, tail: entries.at(-1) ?? null, fails, blocks: bs.length };
}

/**
 * One record, two files (048; DOCTRINE §3, the ledger ages). `ledger-archive.md` is the
 * ledger's ARCHIVE, never a second ledger: the pair yields one sequence, archive first, so a
 * count over it never drops when an entry ages out. The tail is `LEDGER.md`'s, as ever — the
 * archive is what nobody reads to reboot — and each half keeps its own fails, because a fail
 * is stamped with the file it was found in.
 */
export function parseLedgerPair(archiveMd: string | null, ledgerMd: string): {
	archive: Ledger | null; ledger: Ledger; entries: LedgerEntry[];
} {
	const archive = archiveMd === null ? null : parseLedger(archiveMd);
	const ledger = parseLedger(ledgerMd);
	return { archive, ledger, entries: [...archive?.entries ?? [], ...ledger.entries] };
}

// ---------- §5 kickoffs · §11 the baton ----------

export type Kickoff = { mantle: string; tier: string | null; text: string; line: number };

const SUMMONS_LINE = /^You are (?:an?|the) ([A-Za-z ]+?) at ([\w.-]+)\.$/;
/** 033's door, line two of every summons — the path varies by account, the grammar does not. */
const DOOR_LINE = /^Enter by the door — read \S*GUILD\.md,?$/;
/** Line three: the charter this session wears. Offices and mantles share the one directory. */
const WEAR_LINE = /^wear \S*canon\/mantles\/[a-z-]+\.md,?$/;
/**
 * The unmantled cheap-tier kickoff carries GUILD.md's closing stanza inline instead of a path
 * read (mantles/README.md). It names no mantle and wears no charter, so the three-line grammar
 * does not apply to it — it passes on this line, and is no more a kickoff candidate than a
 * Personal-Log letter is.
 */
const STANZA_LINE = /^You are an Agent of the Guild\b/;

/**
 * A work doc is live while its own header state is unfinished — the §5 skeleton's Status line.
 * LANDED and KILLED docs are history: nothing re-ignites them, so nothing lints their fences.
 */
export function isLiveWorkDoc(md: string): boolean {
	const head = statusHead(md);
	return head !== null && (head.startsWith('OPEN') || head.startsWith('IN FLIGHT') || head.startsWith('BLOCKED'));
}

/**
 * The other half of the same header, and NOT the negation of it: a doc is SPENT when its own
 * state says LANDED or KILLED, and merely carrying no Status line says nothing either way.
 * History is whole — 025's live/spent rule — so a spent doc is exempt from the arms that
 * respell or re-ignite it, whether the register filed it as a work doc or, because it carries
 * a staffing table, as a board (`plans/018-great-recut.md` is LANDED and reported 11 dead words).
 */
export function isSpentWorkDoc(md: string): boolean {
	const head = statusHead(md);
	return head !== null && (head.startsWith('LANDED') || head.startsWith('KILLED'));
}

/** The §5 skeleton's own Status line, de-emphasized and folded — or null where it carries none. */
function statusHead(md: string): string | null {
	const m = md.match(/^\*\*Status:\*\*\s*(.+)$/m);
	return m ? m[1]!.replace(/\*\*/g, '').trim().toUpperCase() : null;
}

/**
 * §5's marker — the template writes `**Kickoff (verbatim):**` above the fence — de-emphasized
 * and folded to its words.
 */
const isKickoffMarker = (line: string) => /^kickoff(\s*\(verbatim\))?\s*:?$/i.test(line.replace(/\*/g, '').trim());

/**
 * The fence a document MARKS as its kickoff — §5's marker, then blank lines, then the fence —
 * or null where the document marks none.
 *
 * A doc that says which fence is its kickoff has said it about every other fence too: they are
 * quotations. A Digger's Findings quote the summonses the dig fired, verbatim, and findings are
 * never edited after a charge closes (§6), so the building cannot clear a fence the arm misreads
 * — stigmergon's `plans/080-born-dig.md:244` (2026-09-08) is the live case.
 */
function markedFence(lines: string[]): number | null {
	for (let i = 0; i < lines.length; i++) {
		if (!isKickoffMarker(lines[i]!)) continue;
		let j = i + 1;
		while (j < lines.length && !lines[j]!.trim()) j++;
		if (j < lines.length && /^\s*```/.test(lines[j]!)) return j;
	}
	return null;
}

/**
 * Every fenced block whose first line opens the canon summons grammar (D45's single-glance test)
 * — narrowed to the one fence the document marks, where it marks one (§5).
 *
 * `live` arms the rest of the grammar (031 item 4): in a doc still awaiting ignition the fence
 * must open summons line · door line · wear line, because the flow engine fires it VERBATIM —
 * seven un-ignited charges in this repo carried pre-door fences and agents-flow-1's first
 * ignition ran without the door (2026-08-29). The parser counted those kickoffs and never read
 * them; counting a fence is not reading it.
 *
 * `marker: false` reads every fence whatever the text marks: a ledger entry's fenced summons is
 * an INSTRUMENT (D63g), not a document's kickoff, so §5's marker has no jurisdiction over it.
 */
export function parseKickoffs(md: string, opts: { live?: boolean; marker?: boolean } = {}): { kickoffs: Kickoff[]; fails: Fail[]; fences: number } {
	const fails: Fail[] = [];
	const lines = md.split('\n');
	const kickoffs: Kickoff[] = [];
	const marked = opts.marker === false ? null : markedFence(lines);
	let fences = 0;
	for (let i = 0; i < lines.length; i++) {
		if (!/^\s*```/.test(lines[i]!)) continue;
		const start = i;
		let j = i + 1;
		for (; j < lines.length && !/^\s*```\s*$/.test(lines[j]!); j++);
		const body = lines.slice(start + 1, j).join('\n');
		i = j;
		if (marked !== null && start !== marked) continue;       // the doc marked its kickoff; this is a quotation
		const spoken = body.split('\n').map(l => l.trim()).filter(Boolean);
		const first = spoken[0];
		if (!first || !/^You are /.test(first)) continue;        // not a summons fence
		if (STANZA_LINE.test(first)) continue;                  // the inline stanza — no mantle, no charter
		// A summons names a mantle right after the article; a fence that names none there — a
		// Personal-Log letter, a role-play template — is not a kickoff candidate (item 13).
		const named = first.match(/^You are (?:an?|the)\s+(.+)$/);
		if (!named || !MANTLES.some(x => named[1]!.toLowerCase().startsWith(x.toLowerCase()))) continue;
		fences++;
		const m = first.match(SUMMONS_LINE);
		if (!m) {
			fails.push(fail('kickoff', 'kickoff.summons', 'first line is not "You are a <Mantle> at <tier>." (D45)', first.slice(0, 200), start + 1));
			continue;
		}
		const mantle = MANTLES.find(x => x.toLowerCase() === m[1]!.toLowerCase()) ?? null;
		if (!mantle) fails.push(fail('kickoff', 'kickoff.mantle', 'unknown mantle in the summons line', first.slice(0, 200), start + 1));
		const tier = isTier(m[2]!) ? m[2]! : null;
		if (!tier) fails.push(fail('kickoff', 'kickoff.tier', 'unknown tier in the summons line', first.slice(0, 200), start + 1));
		if (opts.live && !DOOR_LINE.test(spoken[1] ?? ''))
			fails.push(fail('kickoff', 'kickoff.door', 'line two is not the door — "Enter by the door — read <path>/GUILD.md," (033; mantles/README.md)', (spoken[1] ?? '<the fence ends>').slice(0, 200), start + 2));
		else if (opts.live && !WEAR_LINE.test(spoken[2] ?? ''))
			fails.push(fail('kickoff', 'kickoff.wear', 'line three is not the wear line — "wear <path>/canon/mantles/<charter>.md," (mantles/README.md)', (spoken[2] ?? '<the fence ends>').slice(0, 200), start + 3));
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
/**
 * `felix` (§7's `⬡`) · `session` (a named one) · `the dispatch` (a batch the machinery tends) —
 * §11's three written holders, plus the two the parser states about the clause itself: `none`
 * is the typed nothing-owed close, `prose` a dropped baton.
 */
export type BatonHolder = 'felix' | 'session' | 'dispatch' | 'none' | 'prose';
/** §11's three moves, each written into the line as its own marker — never inferred (045). */
export type BatonShape = 'single' | 'batch' | 'fork';
/**
 * §11: a fork names a `recommendation:` or marks the call taste — *a menu with no
 * recommendation is a dropped baton*. The named option is an instrument the baton already
 * carries where the text says so, and otherwise the text itself: the reader points, it never
 * paraphrases.
 */
export type Recommendation =
	| { kind: 'instrument'; index: number }
	| { kind: 'text'; text: string }
	| { kind: 'taste' };
export type Baton = {
	holder: BatonHolder;
	text: string;
	instruments: Instrument[];
	shape: BatonShape | null;
	recommendation: Recommendation | null;
	type: BatonType | null;
	named: string | null;
};

/** §7's typed nothing-owed close — `Next: none — <why>`: the session owes no baton (§11). */
const NONE_CLOSE = /^none\b/i;

/**
 * §11's baton line as D74 wrote it: `Baton — <one holder> → <action>`. **The holder is
 * written and the parser reads it, never infers it** — `⬡` (`Felix` is the same hand in the
 * record's older spelling), `the dispatch`, or a named session. The separator is the arrow, the
 * colon and parenthesis the pre-D74 record used, or the em-dash the chat-batch dialect writes
 * (`Baton — 066, the chat batch's sixth — the follow reaches …`) — the holder slot ENDS at its
 * separator, and one the alternation does not name runs the slot into the action behind it.
 *
 * The baton opens a line OR opens directly after `Next:` — the record writes it inside the
 * clause as often as under it, and 28 of the city's batons were invisible to a `^` alone
 * (045-F1). Reading them is D74 SERVED, not changed: those lines wrote `⬡` or `the dispatch`
 * and the reader ignored it. A `Baton —` the prose merely mentions mid-body is still unread.
 */
const BATON_LINE = /(?:^[ \t]*|\bNext:[ \t]*)\**Baton\**\s*[—–-]\s*([^\n]*?)\**\s*(?:→|->|:|\(|[—–])/m;
/**
 * Where a baton OPENS. The separator that closes its holder slot may land a hard wrap later —
 * `**Next: Baton — 063, the chat\nbatch's fourth —**` — so the opener is found at the LINE and
 * the slots are read from the folded paragraph. Two expressions of one grammar, and the second
 * is the first without its separator.
 */
const BATON_OPEN = /(?:^[ \t]*|\bNext:[ \t]*)\**Baton\**\s*[—–-]/m;

/**
 * The baton line's two slots (045). The holder is the text before the separator; the action is
 * what THE ARROW hands it, with the entry's hard wraps folded in — the record wraps a baton over
 * four lines and the shape marker can sit on the second — and ending at the blank line, because
 * the next paragraph is the next thing the entry says. The other separators (`:` and `(`, the
 * pre-D74 record's; `—`, the chat-batch dialect's) hand back a holder and NO action: the shape
 * markers postdate them all, and inventing one would type a move its writer never marked.
 *
 * The paragraph is read whole and the baton found IN it — the arrow that opens the action is the
 * baton's OWN separator, never the next arrow the prose happens to write (`13 px → 1rem`, a live
 * entry whose baton closes on an em-dash and whose paragraph carries an arrow four words later).
 */
export function batonSlots(block: string): { holder: string; action: string | null } | null {
	const lines = block.split('\n');
	const at = lines.findIndex(l => BATON_OPEN.test(l));
	if (at < 0) return null;
	let end = at + 1;
	while (end < lines.length && lines[end]!.trim()) end++;
	const para = lines.slice(at, end).join(' ').replace(/\s+/g, ' ');
	const m = para.match(BATON_LINE);
	if (!m) return null;
	const arrow = /(?:→|->)$/.test(m[0]!);
	return { holder: strip(m[1]!), action: arrow ? strip(para.slice(m.index! + m[0]!.length)) : null };
}

function writtenHolder(block: string): BatonHolder | null {
	const who = batonSlots(block)?.holder;
	if (!who) return null;
	if (who.includes('⬡') || /^Felix\b/i.test(who)) return 'felix';
	if (/^the dispatch\b/i.test(who)) return 'dispatch';
	return 'session';
}

/**
 * §11's marker: the shape word opens the action and its closer follows — an em-dash
 * (`**… → batch —** …`) or the colon the record writes just as often (`batch: ignite 038 · 039`,
 * `fork: (a) …`). Both predate D74's grammar settling and both are unambiguous (045-F2).
 */
const SHAPE_MARK = /^(single|batch|fork)\s*[—–:]\s*/i;

const shapeOf = (action: string | null): BatonShape | null =>
	action?.match(SHAPE_MARK)?.[1]?.toLowerCase() as BatonShape ?? null;

/**
 * The action's leading `n` words, case-folded. A token carrying a digit is an id or a numbering
 * — `G6`, `(1)`, `022` — and an id is not a noun: it is skipped, never spelled down to its
 * letters, or a baton opening `G6 —` would report its type word as `g`.
 */
const leadWords = (s: string) =>
	s.split(/\s+/).filter(w => !/\d/.test(w)).map(w => w.replace(/[^A-Za-z]/g, ''))
		.filter(Boolean).map(w => w.toLowerCase());

/**
 * The word `BATON_TYPES` is read by: the action's leading noun once the shape marker is off it,
 * two words where the table names two (`visual pass`), and one determiner later where the record
 * wrote one (`your visual pass`). Exported because the census counts what the table does NOT
 * name, and it must count the parser's own word.
 */
export function batonTypeWord(action: string | null): string | null {
	if (action === null) return null;
	const words = leadWords(action.replace(SHAPE_MARK, ''));
	const rest = DETERMINERS.includes(words[0] ?? '') ? words.slice(1) : words;
	const two = rest.slice(0, 2).join(' ');
	return two in BATON_TYPES ? two : rest[0] ?? null;
}

/** The clause §11 gives a fork whose call is Felix's taste alone — an alternative to naming one. */
const TASTE_CLAUSE = /\bthe call is taste\b|\bmarked taste\b/i;

/**
 * §11's `recommendation:`, read from the entry (the record writes it under the baton as often as
 * in it) and never beyond the marker's own paragraph. It runs to the end of its sentence, so a
 * hard wrap does not cut it in half. The named option resolves to an instrument the baton carries
 * — a row id, or a fenced summons's mantle — and otherwise stays the writer's own text.
 */
function readRecommendation(block: string, instruments: Instrument[]): Recommendation | null {
	const masked = maskCode(block);
	const m = masked.match(/recommendation:/i);
	if (!m) return TASTE_CLAUSE.test(masked) ? { kind: 'taste' } : null;
	const para = block.slice(m.index! + m[0]!.length).split(/\n[ \t]*\n/)[0]!;
	const text = strip((para.match(/^[^.!?]*[.!?](?=\s|$)/)?.[0] ?? para).replace(/\s+/g, ' '))
		.replace(/[.!?]+$/, '').trim();
	if (!text) return null;
	if (/^taste$/i.test(text) || TASTE_CLAUSE.test(text)) return { kind: 'taste' };
	const named = (i: Instrument) => i.kind === 'row'
		? new RegExp(`\\b${i.row}\\b`).test(text)
		: i.mantle !== null && new RegExp(`\\b${i.mantle}\\b`, 'i').test(text);
	const index = instruments.findIndex(named);
	return index < 0 ? { kind: 'text', text } : { kind: 'instrument', index };
}

export function classifyBaton(entry: LedgerEntry | null): Baton | null {
	if (!entry?.next) return null;
	const unmarked = { shape: null, recommendation: null, type: null, named: null };
	if (NONE_CLOSE.test(entry.next.trim())) return { holder: 'none', text: entry.next, instruments: [], ...unmarked };
	const instruments: Instrument[] = [];

	// (a) the summons fenced verbatim in the entry (D63g) — every fence, marked or not: an entry
	// hands instruments, and §5's marker names a work doc's kickoff, which an entry never carries.
	for (const k of parseKickoffs(entry.block, { marker: false }).kickoffs) instruments.push({ kind: 'summons', text: k.text, mantle: k.mantle, tier: k.tier });
	// (b) the charge-reference the rail resolves to the charge doc's fence (D63g)
	// `ignite 024` is an instrument; `ignite the distillation session` is prose (`fire 16` is the
	// same instrument in history's verb — the standard §3 killed the dispatch sense, not the record).
	for (const m of entry.next.matchAll(/\b(?:ignite|fire)\s+([A-Za-z0-9-]+(?:\s*[,+]\s*[A-Za-z0-9-]+)*)/g))
		for (const id of topSplit(m[1]!, [',', '+'])) if (isId(id)) instruments.push({ kind: 'row', row: id });

	const written = writtenHolder(entry.block);
	// No baton line: the record before D74 wrote its holder into the clause's prose, so this is
	// the one place the holder is inferred — and the entries it reads are history, all of them.
	const holder: BatonHolder = written
		?? (instruments.length ? 'session' : /\bFelix\b/.test(entry.next) ? 'felix' : 'prose');

	// The four marked fields (045). Each is read where §11 writes it and is null everywhere else:
	// the shape off its marker, the recommendation off a fork alone, the type off a ⬡-action's
	// noun, the name off the holder slot the line actually carries.
	const action = batonSlots(entry.block)?.action ?? null;
	const shape = shapeOf(action);
	return {
		holder, text: entry.next, instruments, shape,
		recommendation: shape === 'fork' ? readRecommendation(entry.block, instruments) : null,
		type: holder === 'felix' ? BATON_TYPES[batonTypeWord(action) ?? ''] ?? null : null,
		named: written === 'session' ? batonSlots(entry.block)!.holder : null,
	};
}

export function batonFails(baton: Baton | null, line: number): Fail[] {
	if (!baton) return [];
	if (baton.holder === 'prose')
		return [fail('ledger', 'ledger.baton', 'the Next clause carries no instrument and names no Felix-action — a dropped baton (D63g/D64)', baton.text.slice(0, 200), line)];
	// §11, the fork's half of the same law: ambiguity is the sin, and a menu with no recommendation
	// hands the choice back unmade. `taste` marked IS an answer — the call is his by name.
	if (baton.shape === 'fork' && baton.recommendation === null)
		return [fail('ledger', 'ledger.baton', 'a fork naming no `recommendation:` and marking no taste — a menu with no recommendation is a dropped baton (§11)', baton.text.slice(0, 200), line)];
	return [];
}

// ---------- §8 decisions ----------

export type Decision = {
	id: string; date: string; decider: string; title: string; body: string;
	blessed: boolean; pending: boolean; credit: string | null;
	/** D90 — the size of his yes, where he gave one; `null` where the mark carries no number. */
	magnitude: number | null;
	line: number;
};

// A project's decision ids carry its own prefix — RP-1, A1, D63 (item 11) and §7's mandated
// `‹prefix›-D‹n›` (PD-D9, C-D2 — 031 item 3); the shape is `DECISION_ID`, the id is verbatim. A
// candidate must carry the ATTRIBUTION shape after its id — `**D1** (…`, `**D1 (…` or the
// pre-doctrine `**D1 · …` — or every bold cross-reference bullet in a master doc
// ("**T13 ∥ t12c**, concurrent…") is promoted to a malformed decision.
const CANDIDATE = new RegExp(String.raw`^\s*[-*]\s*\*\*${DECISION_ID}(\*\*\s*[*_]?\(|\s+\(|\s*·)`);
const DECISION_HEAD = new RegExp(String.raw`^\s*[-*]\s*\*\*(${DECISION_ID})\*\*\s*\(`);

export function parseDecisions(md: string): { decisions: Decision[]; queue: Decision[]; fails: Fail[]; candidates: number } {
	const fails: Fail[] = [];
	const lines = md.split('\n');
	const decisions: Decision[] = [];
	let candidates = 0;
	for (let i = 0; i < lines.length; i++) {
		if (!CANDIDATE.test(lines[i]!)) continue;
		candidates++;
		const at = i + 1;
		let text = lines[i]!.trim(), j = i + 1;
		for (; j < lines.length && lines[j]!.trim() && !CANDIDATE.test(lines[j]!) && !/^#{1,6} /.test(lines[j]!); j++) text += ' ' + lines[j]!.trim();
		i = j - 1;

		const head = text.match(DECISION_HEAD);
		if (!head) {
			fails.push(fail('decisions', 'decision.head', 'entry does not open "- **<id>** (" (§8)', text.slice(0, 240), at));
			continue;
		}
		// The attribution runs to the MATCHING ')' — "Architect (02) · ⬡✓" nests (P3 §0).
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

		// D90 — the magnitude rides the attribution beside the other marks, and it ANSWERS them: 1
		// and above is the blessing (he looked, and sized what he saw), below 1 the credit (it
		// proceeds, the review owed — 0.1 IS the go-mark's rung). Undated, the yes came with the
		// entry, so the entry's own date is the mark's: the standard dates the token only where the
		// yes came later, and a date the document already carries is read, never inferred.
		const mag = magnitude(paren);
		const owed = mag && isSizedCredit(mag.n) ? mag.date ?? (pm ? pm[1]! : null) : null;
		decisions.push({
			id: head[1]!, date: pm ? pm[1]! : '',
			decider: (pm ? pm[2]! : paren).replace(MARK_TAIL, '').trim(),
			title: tm ? tm[1]! : rest.split('.')[0]!, body: tm ? tm[2]! : rest,
			// D71 §7 — `⬡✓` is the mark; `⬡✓` is the history the record still carries. The
			// respell put the mark inside the WAITING form too ("proposed, pending ⬡✓"), where the
			// old spelling could not reach: a blessing awaited is not a blessing given, so the
			// proposed mark vetoes. Without the veto every dispatched entry falls out of the queue.
			blessed: (BLESSED_MARK.test(paren) || (mag !== null && isSizedBlessing(mag.n))) && !PROPOSED_MARK.test(paren),
			// The marker lives in the ATTRIBUTION; a body that merely quotes the phrase — D21, the
			// entry that DEFINES it — never counts (item 12).
			pending: PROPOSED_MARK.test(paren),
			// D82 — the third resolution: authorized without his eyes, dated, the review owed. It
			// is not a blessing (the checkmark is the act of checking) and it is not the queue:
			// nobody waits on it, it sits on the statement until he reads it.
			credit: creditDate(paren) ?? owed,
			magnitude: mag?.n ?? null,
			line: at,
		});
	}
	// A decision Felix made needs no countersign; the queue is what waits on his pen (P3 §5) —
	// and an entry paid on credit waits on nobody: it proceeds, and the statement carries it (D82).
	const queue = decisions.filter(d => d.pending || (!d.blessed && !d.credit && !/^Felix\b/.test(d.decider)));
	return { decisions, queue, fails, candidates };
}

/**
 * §8's purge, nudged (048). The register is the queue and the staging ground, never the archive
 * — past `REGISTER_CAP` it has become one, and entries fully distilled into their homes are due
 * the kill. A warning: a purge is a blessed act, and no lint forces his hand. Read off the
 * BYTES, so it is the file on disk and not a character count of it — and only ever over a
 * `DECISIONS.md`, because a §3 subproject's register is a section of a master doc whose size is
 * that doc's business (the caller binds it — `building.ts`).
 */
export function registerSizeFails(md: string): Fail[] {
	const bytes = Buffer.byteLength(md);
	if (bytes <= REGISTER_CAP) return [];
	return [fail('decisions', 'decisions.size',
		`a decision register past ${REGISTER_CAP >> 10} KB is due a purge (DOCTRINE §8) — an entry fully distilled into its canon home is killed whole, and git holds every byte`,
		`${(bytes / 1024).toFixed(1)} KB in ${md.split('\n').length} lines`, 1, 'warn')];
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

// ---------- §5 the charge doc's header ----------
//
// §5's skeleton writes the contract into one header run: the Status, the dependencies, the
// staffing, and — when the charge is laid into a parallel batch or runs in a worktree — the two
// slots the field asked the parser to read (032 (d), (e); stigmergon's canon asks, 2026-09-14).
// A gate doc's header carries one more: §4's batch note, typed.
//
// Nothing here duplicates the board. The board is the work STATE and this is the charge's own
// copy of its contract; where they disagree the lint's job is to say so, which it cannot do
// while only one of them parses.

/**
 * §4's batch note, as a header slot: `**Batch:** ‹shape› · ceiling ‹n› · gauge ‹text› · account
 * ‹name›`. The MEMBERS are not a slot — they are the gate's Depends-on, by the edge test (§4):
 * a batch's membership and its dependency graph are one fact, and writing it twice is how the
 * two drift apart.
 */
export type Batch = {
	shape: 'serial' | 'parallel';
	ceiling: number | null;       // the concurrency plan's ceiling — engine ignitions at once
	gauge: string | null;         // what to hold on ("hold timed arms until load < 12")
	account: string | null;       // whose quota the run spends
};
/** §10's tender line: the machinery, or the hand the note names — one of the two, never both. */
export type Tender = { kind: 'dispatch' } | { kind: 'hand'; text: string };

export type ChargeHeader = {
	status: string | null;
	dependsOn: string[];
	staffing: string | null;
	parallelSafeWith: string[];
	branch: { name: string; base: string } | null;
	batch: Batch | null;
	tender: Tender | null;
	line: number;
};

const BATCH_SHAPES = ['serial', 'parallel'] as const;

/**
 * The header's slots, read as the labelled run they are. The skeleton writes them on one line
 * joined by `·` and the batch slot's own value carries `·`, so a slot ends where the NEXT
 * `**Label:**` begins — one rule that reads both layouts and needs neither to be guessed.
 */
function headerSlots(md: string): { slots: Map<string, string>; line: number } | null {
	const lines = md.split('\n');
	const at = lines.findIndex(l => /^\**Status:\*\*/.test(l));
	if (at < 0) return null;
	let end = at;
	while (end < lines.length && lines[end]!.trim()) end++;
	const text = lines.slice(at, end).join(' ');
	const marks = [...text.matchAll(/\*\*([A-Za-z][A-Za-z -]*):\*\*/g)];
	const slots = new Map<string, string>();
	marks.forEach((m, k) => {
		const value = text.slice(m.index + m[0].length, marks[k + 1]?.index ?? text.length);
		slots.set(m[1]!.trim(), value.replace(/\s*·\s*$/, '').trim());
	});
	return { slots, line: at + 1 };
}

/**
 * §10's tender line, read where §10 puts it: the batch note's **Mission**. The record writes it
 * inside a code span (`` `tender: the dispatch` ``), so the span is NOT masked here — and that is
 * exactly why the search is bounded to the Mission: a charge doc's Findings quote the form while
 * discussing it (stigmergon 086's own ruling table), and a quotation is not a tender.
 */
export function parseTender(md: string): Tender | null {
	const lines = md.split('\n');
	const at = lines.findIndex(l => /^#{1,6}\s+Mission\b/i.test(l));
	if (at < 0) return null;
	const level = lines[at]!.match(/^#+/)![0].length;
	let end = at + 1;
	for (; end < lines.length; end++) {
		const h = lines[end]!.match(/^(#{1,6})\s/);
		if (h && h[1]!.length <= level) break;
	}
	const m = lines.slice(at + 1, end).join('\n').match(/\btender:[ \t]*([^`\n]+)/);
	if (!m) return null;
	const text = m[1]!.trim().replace(/[.,;:]+$/, '');
	return /^the dispatch$/i.test(text) ? { kind: 'dispatch' } : { kind: 'hand', text };
}

/**
 * `live` arms the FORM, exactly as the kickoff arm's flag does (031 item 4) and for the same
 * reason: §5's two slots were written into the skeleton on 2026-09-08 (`Branch: ‹name› from
 * ‹base›`, simmy G21's live case) and the record before it wrote the branch alone. A spent
 * charge doc is history and nothing re-ignites it, so nothing lints its header — the slots still
 * PARSE there, because a null is a render decision and not an error (P3 §5).
 */
export function parseChargeHeader(md: string, opts: { live?: boolean } = {}): { header: ChargeHeader | null; fails: Fail[] } {
	const fails: Fail[] = [];
	const found = headerSlots(md);
	if (!found) return { header: null, fails };
	const { slots, line } = found;
	const slot = (name: string) => { const v = slots.get(name); return v === undefined || /^[—–-]$/.test(strip(delink(v))) ? null : v; };

	const parallel = slot('Parallel-safe with');
	const branchText = slot('Branch');
	const batchText = slot('Batch');
	const dep = slot('Depends on');

	let branch: ChargeHeader['branch'] = null;
	if (branchText !== null) {
		const m = strip(delink(branchText)).match(/^(\S+)\s+from\s+(\S+)$/);
		if (m) branch = { name: m[1]!, base: m[2]! };
		else fails.push(fail('charge', 'charge.branch', '§5\'s Branch slot is "‹name› from ‹base›" — the base is the branch the worktree is cut from, and a worktree on the wrong base is a false assumption (§10)', JSON.stringify(branchText.slice(0, 160)), line));
	}

	let batch: Batch | null = null;
	if (batchText !== null) {
		const segs = topSplit(strip(delink(batchText)), ['·']);
		const shape = (segs[0] ?? '').toLowerCase();
		if (!(BATCH_SHAPES as readonly string[]).includes(shape))
			fails.push(fail('charge', 'charge.batch', `§4's batch slot opens with its shape — ${BATCH_SHAPES.join(' · ')} — then "ceiling ‹n› · gauge ‹text› · account ‹name›"`, JSON.stringify(batchText.slice(0, 160)), line));
		else {
			const find = (key: string) => segs.slice(1).find(x => x.toLowerCase().startsWith(key + ' '))?.slice(key.length + 1).trim() ?? null;
			const ceiling = find('ceiling');
			if (ceiling !== null && !/^\d+$/.test(ceiling))
				fails.push(fail('charge', 'charge.batch', 'the concurrency plan\'s ceiling is a count (§4) — "ceiling 3"', JSON.stringify(ceiling.slice(0, 80)), line));
			batch = { shape: shape as Batch['shape'], ceiling: ceiling !== null && /^\d+$/.test(ceiling) ? +ceiling : null, gauge: find('gauge'), account: find('account') };
		}
	}

	return {
		fails: opts.live ? fails : [],
		header: {
			status: slot('Status') === null ? null : strip(slot('Status')!),
			dependsOn: dep === null ? [] : topSplit(strip(delink(dep)), ['·', ',', ';']).filter(isId),
			staffing: slot('Staffing') === null ? null : strip(delink(slot('Staffing')!)),
			parallelSafeWith: parallel === null ? [] : topSplit(strip(delink(parallel)), ['·', ',', ';']).filter(isId),
			branch, batch, tender: parseTender(md), line,
		},
	};
}

// ---------- §4's readiness — what is ignitable, and what it waits on ----------

export type Readiness = {
	id: string;
	ignitable: boolean;
	/** Every dependency not yet met, verbatim: a charge id, a crossing, or a `⬡-gate: ‹text›`. */
	waitingOn: string[];
};

/**
 * §4's ignition rule, read off the building's own board (D63e — Depends-on resolves against the
 * BUILDING's row ids). Three clauses, and the third is 086's ask:
 *
 * - a charge waits for each dependency to be **LANDED**;
 * - a **review gate** waits for LANDED **or KILLED** — *a documented kill is a result the gate
 *   reads*, and every gate at stigmergon has reviewed one (086, 2026-09-09);
 * - a dependency carrying an **unresolved hold** pauses its dependants whatever its state (§4,
 *   the typed holds): a hold whose escalation the building has RULED is cleared, and a `⬡ ‹text›`
 *   hold is cleared by leaving the row, which is the whole of what "clearing is written on the
 *   row" means.
 *
 * What this reader refuses to call met: a `⬡-gate` dependency — *the batch pauses there; nobody
 * ignites past it* — and a crossing, whose far board is another building's file and not this
 * parser's to read (the crossing names a door). Both stay in `waitingOn`, where the engine draws
 * them pending. A `⬡-gate` STAFFING is never ignited at all, and neither is a row already in
 * flight or finished: `ignitable` is about a charge somebody could fire right now.
 */
export function readiness(rows: BoardRow[]): Readiness[] {
	const by = new Map(rows.map(r => [r.id, r]));
	const cleared = new Set(rows.flatMap(r => r.escalations.filter(e => e.ruled).map(e => e.id)));
	const held = (r: BoardRow) => r.holds.some(h => h.kind === 'felix' || !cleared.has(h.id));

	return rows.map(r => {
		const met = (dep: BoardRow) =>
			(dep.state === 'LANDED' || (GATE_ID.test(r.id) && dep.state === 'KILLED')) && !held(dep);
		const waitingOn = [
			...r.dependsOn.filter(id => { const d = by.get(id); return !d || !met(d); }),
			...r.crossings,
			...r.gates.map(g => `${HEX_GATE}: ${g}`),
		];
		return { id: r.id, ignitable: r.state === 'OPEN' && !r.hexGate && !waitingOn.length, waitingOn };
	});
}


/** Every escalation the building's rows declare, merged by id — born on one row, ruled on another. */
export function escalationsIn(rows: BoardRow[]): Escalation[] {
	const by = new Map<string, Escalation>();
	for (const r of rows) for (const e of r.escalations) {
		const prev = by.get(e.id);
		if (!prev) { by.set(e.id, { ...e }); continue; }
		prev.what ??= e.what;
		prev.ruled ??= e.ruled;
	}
	return [...by.values()];
}
