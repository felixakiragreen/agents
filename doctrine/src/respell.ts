// The id respell (D80) — the building is the namespace, the letter is the kind, the number is
// the address, and a charge is its number zero-padded to three. The table is DERIVED from the
// building's own board: nothing here is hand-kept, so a building that already conforms gets an
// empty table and a run that writes nothing.
//
// D81, the currency law: the corpus is current with the law, always — history is respelled,
// never rewritten. Every rule below is a total substitution over FORM: a token, a path, a typed
// slot. Speech is not form and no rule here can reach it — `batch 8`, `formula 25`, `§7`, `v1.2`
// stay words with numbers in them, and a bare number the machine cannot prove is a session's
// call, never a rule's (STANDARD §7, "word-numbered things stay words").

import { CANON_PREFIXES } from './lexicon';

/**
 * A board id splits into an optional building letter and the address. `WO-001` and `S3` are the
 * same shape as `C23`; `G2` is not, because `G` is a KIND (STANDARD §7) and a kind keeps its
 * letter forever.
 */
const BOARD_ID = /^([A-Za-z]{0,3})-?(\d{1,3})$/;

export type Respell = {
	/** Every board id whose spelling changes: `C23` → `023`, `01` → `001`. A kind is absent. */
	ids: Map<string, string>;
	/** A charge's number → its padded id. Prose keys on the NUMBER (`charge 018`, `lab/008`). */
	charges: Map<number, string>;
	/** The building's own directory name — what makes `plans/…` THIS building's address. */
	dir: string;
};

export const EMPTY: Respell = { ids: new Map(), charges: new Map(), dir: '' };
export const isEmpty = (t: Respell) => t.ids.size === 0;

/** The building's own board, read as the table it already is. Ids that conform contribute a
 *  charge number and no rewrite; a kind contributes neither. */
export function respellTable(boardIds: Iterable<string>, dir = ''): Respell {
	const ids = new Map<string, string>(), charges = new Map<number, string>();
	for (const id of boardIds) {
		const m = id.match(BOARD_ID);
		if (!m) continue;
		if (m[1] && CANON_PREFIXES.includes(m[1].toUpperCase())) continue;
		const next = m[2]!.padStart(3, '0');
		charges.set(+m[2]!, next);
		if (next !== id) ids.set(id, next);
	}
	return { ids, charges, dir };
}

/**
 * A HAND-GIVEN table (D80 as ruled at the desk, simmy D18 — 2026-09-08): a building that
 * numbered two campaigns in parallel letters (`S1` and `B1`) cannot be derived — the derivation
 * maps both to `001` — so its Architect writes the table and Felix rules it. One line per id,
 * `OLD → NEW` (or `OLD NEW`), `#` comments and blanks skipped; NEW is a padded charge number.
 * `charges` stays EMPTY on purpose: under an offset a bare number is ambiguous by construction,
 * so the number-keyed rules fall silent and only the lettered ids move.
 */
export function tableFromText(text: string, dir = ''): Respell {
	const ids = new Map<string, string>(), seen = new Map<string, string>();
	for (const raw of text.split('\n')) {
		const line = raw.replace(/#.*$/, '').trim();
		if (!line) continue;
		const m = line.match(/^(\S+)\s*(?:→|->|\s)\s*(\d{3})$/);
		if (!m) throw new Error(`--table: cannot read "${raw}" — one "OLD → NEW" per line, NEW a three-digit charge number`);
		const [, from, to] = m;
		if (seen.has(to!) && seen.get(to!) !== from) throw new Error(`--table: ${seen.get(to!)} and ${from} both map to ${to}`);
		seen.set(to!, from!); ids.set(from!.toUpperCase(), to!);
	}
	return { ids, charges: new Map(), dir };
}

/** Two old ids landing on one address: the derivation cannot be trusted, the desk must rule. */
export function collisions(t: Respell): string[] {
	const by = new Map<string, string[]>();
	for (const [from, to] of t.ids) by.set(to, [...(by.get(to) ?? []), from]);
	return [...by].filter(([, froms]) => froms.length > 1).map(([to, froms]) => `${froms.join(' and ')} → ${to}`);
}

/** The table as a reader sees it before a byte moves — old → new, the addresses in order. */
export function renderTable(t: Respell): string {
	if (isEmpty(t)) return '  (every id already conforms — nothing to respell)';
	const pad = Math.max(...[...t.ids.keys()].map(k => k.length));
	return [...t.ids].sort((a, b) => a[1].localeCompare(b[1]))
		.map(([from, to]) => `  ${from.padEnd(pad)} → ${to}`).join('\n');
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const lettered = (t: Respell) => [...t.ids.keys()].filter(k => /[A-Za-z]/.test(k));

/**
 * A bare address, standalone: not glued to a word, not inside a hyphenated run (`2026-08-06`),
 * not behind a section mark or a decimal point (`§11`, `v1.2`). The date guard is the reason
 * this is a lookbehind and not a word boundary — `\b08\b` matches inside `2026-08-06`.
 */
const BARE = /(?<![\w\-§.×])(\d{1,3})(?![\w-]|\.\d)/g;

/**
 * `plans/…` and `lab/…` name THIS building. A path whose parent segment is another building's
 * root — `/Users/felix/code/whiteboardy/plans/18-…`, 300 of them in the census data — is a
 * foreign address and the respell has no business in it (D80: hosts keep their forms).
 */
const ownPath = (t: Respell) =>
	`(?:(?<![\\w/~.-])|(?<=\\.{1,2}/)${t.dir ? `|(?<=(?<![\\w-])${esc(t.dir)}/)` : ''})`;

/** Every substitution the respell makes, in the order it makes them. */
/**
 * Where a rule may write. A DOCUMENT is a `.md` file: there a bare lettered id is an address.
 * Everywhere else — code, data, transcripts — `S1` and `B1` are identifiers and arm labels
 * (cornerizer's `S0 REGRESSION` section marks, a results table's `A1=365 B1=365`), and only
 * the PATH forms (`plans/b17-…`, `lab/b17`) are simmy's addresses. Measured 2026-09-08 on
 * simmy's first hand-table run: 90 `.py`, 48 `.txt` and 8 `.script` files would have moved
 * under the document rule, every one a false positive.
 */
export type Scope = 'document' | 'path';

function rules(t: Respell, scope: Scope = 'document'): [RegExp, (m: string, ...g: string[]) => string][] {
	const charge = (n: string, whole: string) => t.charges.get(+n) ?? whole;
	const mine = ownPath(t);
	const out: [RegExp, (m: string, ...g: string[]) => string][] = [
		// D81's first act — the blessing mark. The date behind it stays where it stands.
		[/✓\s*Felix/g, () => '⬡✓'],
		// A hand-kept abbreviation of the stamp the rig already mints (D80).
		[/\bGA-(\d{1,2})\b/g, (_, n) => `grand-architect-${n.padStart(2, '0')}`],
		// The acronym expanded to its concept's living word — the inbox took the job (D80).
		[/\bFC-(\d)\b/g, (_, n) => `distillation candidate ${n}`],
	];
	// Every rule below this line is keyed on a NUMBER, and a number is only an address while the
	// building still writes an old spelling on its own board. Once it has adopted, the table's
	// `ids` map is empty and they all fall silent — which is the difference between a converter
	// that can be re-run forever (D81's whole ask) and one that pads another building's `row 05`
	// on every pass. The three compounds above have no table, so the named form fences them.
	if (isEmpty(t)) return out;

	// The lettered ids, table-driven and case-folded: the slug form (`c23-law-book.md`,
	// `lab/c28`) is the same address in lower case, and only the table's own keys can match.
	const keys = lettered(t);
	const lookup = (m: string) => t.ids.get(m.toUpperCase()) ?? t.ids.get(m) ?? m;
	if (keys.length && scope === 'document') out.push([
		new RegExp(`\\b(${keys.map(esc).join('|')})\\b`, 'gi'),
		lookup,
	]);
	// The slug paths carry the address in every file type: `plans/b17-…`, `lab/b17`, `spike/b17-…`.
	if (keys.length) out.push([
		new RegExp(`${mine}(plans|lab|spike)/(${keys.map(esc).join('|')})(?=[-/]|$|[^\\w])`, 'gi'),
		(m, d, id) => `${d}/${lookup(id)}`,
	]);
	out.push(
		// The paths — charge docs lead with their id, lab dirs are named by it.
		[new RegExp(`${mine}plans/(\\d{1,3})(?=-)`, 'g'), (m, n) => `plans/${charge(n, n)}`],
		[new RegExp(`${mine}lab/(\\d{1,3})(?![\\w-]|\\.\\d)`, 'g'), (m, n) => `lab/${charge(n, n)}`],
		// A sibling charge doc, linked by bare filename from inside `plans/`.
		[/(?<=\]\()(\d{1,3})(?=-[a-z][a-z0-9-]*\.md)/g, (m, n) => charge(n, m)],
		// The charge doc's own title slot: `# 001 — …`.
		[/^(#{1,6} )(\d{1,3})(?= [—–])/gm, (_, h, n) => `${h}${charge(n, n)}`],
		// A finding travels with its charge and wears one separator (STANDARD §7): `038-F4`.
		[/(?<![\w-])(\d{1,3})[- ]F(\d{1,2})\b/g, (m, n, k) => t.charges.has(+n) ? `${t.charges.get(+n)}-F${k}` : m],
		// The typed prose slots — the noun names the kind, so the number behind it is an address.
		// `gate ‹n›` is NOT one: every occurrence in this corpus is either another building's row
		// (whiteboardy's `gate 26`) or a count (`type gate 0`). A noun that types nothing is noise.
		[/\b(charge|Charge|row|Row|ignite|Ignite|ignited|Ignited) (\d{1,3})(?![\w-]|\.\d)/g,
			(m, w, n) => t.charges.has(+n) ? `${w} ${t.charges.get(+n)}` : m],
		// The ledger head's id slot (DOCTRINE §7): `**<date> · <mantle> · <tier> (08)** — …`.
		[/^(\*\*\d{4}-\d{2}-\d{2}[^*(]*\()(\d{1,3})(\)\*\*)/gm, (m, a, n, b) => t.charges.has(+n) ? `${a}${t.charges.get(+n)}${b}` : m],
	);
	return out;
}

/** One piece of a line: a code span with its delimiters, or the plain text between two. */
type Part = { code: boolean; open: string; text: string; close: string };

/**
 * The delimiter, spelled as an escape. A lone backtick in this file's own source would open a
 * span in the mask below and swallow every comment under it — measured, not feared: the first
 * cut of `parts` wrote three of them and the converter offered to respell four doc comments.
 */
const TICK = '\x60';

/** The next run of EXACTLY `n` delimiters at or after `from` — a longer run closes nothing. */
function closingRun(s: string, from: number, n: number): number {
	for (let i = from; i < s.length; i++) {
		if (s[i] !== TICK) continue;
		let k = 1;
		while (s[i + k] === TICK) k++;
		if (k === n) return i;
		i += k - 1;
	}
	return -1;
}

/**
 * A line split into its code spans and the plain text between them. A run of n delimiters opens
 * a span and the next run of EXACTLY n closes it (CommonMark), so a double-ticked span is ONE
 * span holding a backtick and not three — 047-F3, where the parity model read the inner half of
 * one as a span of its own and respelled it. An unclosed run of two or more is literal text, as
 * CommonMark reads it; an unclosed LONE tick opens a span to the end of the line, because the
 * corpus wraps its spans — which is how ``a collision `✓ Felix` could not have`` came to be read
 * as unticked text and respelled into a sentence that no longer said anything.
 *
 * `open` says a lone tick left a span open on an earlier line. Crossing lines stays a PARITY
 * question (`ticksLeftOpen`): a run this line cannot close is a fact about the line, and the
 * count is what the corpus has been read by since 040.
 */
function parts(s: string, open: boolean): Part[] {
	const out: Part[] = [];
	let i = 0;
	if (open) {
		const end = s.indexOf(TICK);
		out.push({ code: true, open: '', text: end < 0 ? s : s.slice(0, end), close: end < 0 ? '' : TICK });
		i = end < 0 ? s.length : end + 1;
	}
	const plain = (text: string) => out.push({ code: false, open: '', text, close: '' });
	while (i < s.length) {
		const start = s.indexOf(TICK, i);
		if (start < 0) { plain(s.slice(i)); break; }
		if (start > i) plain(s.slice(i, start));
		let n = 1;
		while (s[start + n] === TICK) n++;
		const end = closingRun(s, start + n, n);
		if (end < 0 && n > 1) { plain(s.slice(start, start + n)); i = start + n; continue; }
		const delim = s.slice(start, start + n);
		out.push({ code: true, open: delim, text: s.slice(start + n, end < 0 ? s.length : end), close: end < 0 ? '' : delim });
		i = end < 0 ? s.length : end + n;
	}
	return out;
}

/**
 * A code span the converter must leave standing — a form being NAMED, not an address being used:
 * the graveyard's rows, §7's `C23` · `GA-20` · `FC-1` historical-forms list, D80's own
 * `c36-…` → `036-…` line, this converter's comments. Naming a dead form is how the law records
 * it. Three clauses, each earned:
 *
 * · a LONE TOKEN — no whitespace, and not an ADDRESS (a span carrying `/` or `.` is
 *   `plans/023-…` or `037-removal-arm.md` and rots if it does not follow). A span with
 *   whitespace is a phrase, not a form: `ignite 029` is a command. `✓ Felix` is the one dead
 *   form the standard spells with a space.
 * · a span BESIDE `→` — whatever it contains. `→` is the record's own grammar for a form change
 *   (STANDARD §7) and both sides of it quote forms as they were written, so the phrase test has
 *   no business there: `(GA-19, continued)` → `(GA-19)` records a repair, and expanding its left
 *   half writes a repair nobody made (047-F3).
 * · a span opened by MORE THAN ONE backtick — CommonMark's spelling for a span that holds a
 *   backtick, which the record reaches for only when it quotes markup as written.
 */
const namedForm = (p: Part, before: string, after: string) =>
	p.open.length > 1
	|| /→[\s(]*$/.test(before) || /^\s*→/.test(after)
	|| (!/[/.]/.test(p.text) && (!/\s/.test(p.text) || /^✓\s*Felix$/.test(p.text)));

/** Every rule applied to one piece of text, in the order they are declared. */
function substitute(part: string, t: Respell, scope: Scope): string {
	let out = part;
	for (const [rx, fn] of rules(t, scope)) out = out.replace(rx, fn as (m: string, ...a: unknown[]) => string);
	return out;
}

/** The line's pieces, each carrying what `f` would make of it and whether the converter may. */
function spans(s: string, open: boolean, f: (part: string) => string) {
	const ps = parts(s, open);
	const whole = ps.map(p => p.open + p.text + p.close);
	return ps.map((p, i) => ({
		...p,
		named: p.code && namedForm(p, whole.slice(0, i).join(''), whole.slice(i + 1).join('')),
		next: f(p.text),
	}));
}

/** The line back, with every piece the converter may write replaced. */
const render = (ps: ReturnType<typeof spans>) =>
	ps.map(p => p.open + (p.named ? p.text : p.next) + p.close).join('');

/** Does this line leave a code span open for the next one? The count, as it has always been. */
export const ticksLeftOpen = (line: string, open: boolean) =>
	((line.match(new RegExp(TICK, 'g'))?.length ?? 0) % 2 === 1) !== open;

/** The respell applied to one string. Total, order-fixed, and a fixed point on its own output. */
export const respellText = (s: string, t: Respell, open = false, scope: Scope = 'document'): string =>
	render(spans(s, open, part => substitute(part, t, scope)));

/** A line the respell consumed only PARTLY: reverted whole, and the spans that made it so. */
export type LineRespell = { to: string; hand: string[] };

/**
 * The partial guard, carried over from `citations.ts` (043): a line where the respell rewrites
 * one code span and leaves ANOTHER standing as a named form the rules can still reach is
 * reverted whole and reported — half a respell reads as finished work and is not. The live case
 * is 047-F3's ledger line, which recorded a form repair and would have had its left half
 * expanded into a name nobody wrote. A change in PLAIN text beside a named form is not the
 * genus: naming `GA-19` in a sentence that also says `charge 08` is how the law is written.
 */
export function respellLine(s: string, t: Respell, open = false, scope: Scope = 'document'): LineRespell {
	const ps = spans(s, open, part => substitute(part, t, scope));
	const reached = ps.filter(p => p.code && p.next !== p.text);
	const hand = reached.some(p => !p.named) && reached.some(p => p.named);
	return { to: hand ? s : render(ps), hand: hand ? reached.map(p => p.open + p.text + p.close) : [] };
}

/** The board's own ID cell — the table's key, exactly, and nothing else. */
export const respellIdCell = (id: string, t: Respell) => t.ids.get(id) ?? null;

/**
 * DOCTRINE §4: a Depends-on cell is a list of ids, crossings and `⬡-gate: <free text>` segments,
 * on the parser's own separators (`·` `,` `;`). A SEGMENT THAT IS A BARE NUMBER is the one place
 * the machine may respell an address with no noun in front of it. A gate's text is prose and
 * stays prose — a board that wrote a whole paragraph into one (`v0 §8 DoD 7/7`, lab/017's twin)
 * is why this reads segments instead of digits. Silent once the building has adopted.
 */
export const respellDepends = (cell: string, t: Respell) =>
	isEmpty(t) ? cell : cell.split(/([;,·])/).map(seg => {
		const m = seg.match(/^(\s*)(\d{1,3})(\s*)$/);
		return m && t.charges.has(+m[2]!) ? `${m[1]}${t.charges.get(+m[2]!)}${m[3]}` : seg;
	}).join('');

/**
 * The round-trip law's normal form: every address the respell CAN reach, spelled the new way,
 * whether or not a rule reached it in this document. Both sides of the comparison are put
 * through it, so the law asserts exactly what D63 forbids — a paraphrase, a drop, a wrong
 * address — and stays silent where the rules must: a bare number no noun types (`batch 8`) and
 * a typed slot that wrapped mid-line are supervised hits, not converter bugs.
 */
export const respellNormal = (s: string, t: Respell) =>
	render(spans(respellText(s, t), false, p => p.replace(BARE, (m, n: string) => t.charges.get(+n) ?? m)));
