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
function rules(t: Respell): [RegExp, (m: string, ...g: string[]) => string][] {
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
	if (keys.length) out.push([
		new RegExp(`\\b(${keys.map(esc).join('|')})\\b`, 'gi'),
		m => t.ids.get(m.toUpperCase()) ?? t.ids.get(m) ?? m,
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

/**
 * A code-ticked LONE TOKEN is a form being NAMED, not an address being used: the graveyard's
 * rows, §7's `C23` · `GA-20` · `FC-1` historical-forms list, D80's own `c36-…` → `036-…` line,
 * this converter's comments. Naming a dead form is how the law records it, so the converter
 * leaves it standing (the same instinct as topSplit's tick mask). Three exclusions, each earned:
 * a span carrying `/` or `.` is an ADDRESS (`plans/023-…`, `037-removal-arm.md`) and rots if it
 * does not follow; a span with whitespace is a phrase, not a form (`ignite 029` is a command);
 * and `✓ Felix` is the one dead form the standard spells with a space.
 */
const NAMED_FORM = (inner: string) => !/[/.]/.test(inner) && (!/\s/.test(inner) || /^✓\s*Felix$/.test(inner));

/**
 * Apply `f` everywhere the converter may write. `open` says a tick span was left open by an
 * earlier line — the mask is per-line and the corpus wraps its spans, so the parity is threaded
 * in rather than re-guessed, which is how ``a collision `✓ Felix` could not have`` came to be
 * read as unticked text and respelled into a sentence that no longer said anything.
 */
const outsideTicks = (s: string, open: boolean, f: (part: string) => string) =>
	s.split('`').map((p, i) => (i + (open ? 1 : 0)) % 2 === 1 && NAMED_FORM(p) ? p : f(p)).join('`');

/** Does this line leave a tick span open for the next one? */
export const ticksLeftOpen = (line: string, open: boolean) =>
	((line.match(/`/g)?.length ?? 0) % 2 === 1) !== open;

/** The respell applied to one string. Total, order-fixed, and a fixed point on its own output. */
export function respellText(s: string, t: Respell, open = false): string {
	return outsideTicks(s, open, part => {
		let out = part;
		for (const [rx, fn] of rules(t)) out = out.replace(rx, fn as (m: string, ...a: unknown[]) => string);
		return out;
	});
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
	outsideTicks(respellText(s, t), false, p => p.replace(BARE, (m, n: string) => t.charges.get(+n) ?? m));
