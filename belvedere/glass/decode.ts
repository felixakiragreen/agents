// The decoder's **detector** — every code word the corpus writes, found in one pass (B20 §1).
//
// This module is pure: no DOM, no filesystem, no Bun. Both sides import it, which is the point —
// the client finds the references it renders and the server re-reads the one it is asked about
// through the SAME function, so a word the page highlighted can never be a word the resolver
// refuses to parse (`decoder.ts` §decodeQuery re-detects rather than trusting the query).
//
// What it does NOT do: decide what a reference means. Detection is syntax, resolution is corpus,
// and the corpus lives on the server behind the one parser (D65). A token here is a claim that
// something *looks like* an id — nothing more.
//
// **New id classes are canon questions, not regexes** (B20 §out-of-scope). The forms below are the
// grammar the Standards Office blessed; another arrives through that office or not at all — the
// `C‹n›` id and the `charge` keyword arrived exactly that way (D71).

/**
 * The five namespaces the corpus writes ids in. `row` covers every charge address: the bare
 * `B18`/`C23`, and the keyword forms `canon row 17` and `charge C5`.
 */
export type RefKind = 'row' | 'decision' | 'section' | 'fold' | 'ga';

export type Token = {
	at: number;
	len: number;
	/** The text the span covers — exactly what the reader sees highlighted. */
	text: string;
	kind: RefKind;
	/** The id in its own namespace: `B18`, `C23`, `D63`, `5`, `3.2`, `17`, `FC-1`. */
	id: string;
	/**
	 * The word written immediately before a `row N` — `canon`, a building name, or something that is
	 * neither. Only the keyword form can carry one, because only it needs one: the canon board's row
	 * ids are bare numerals, so nothing but the word in front anchors them. The resolver decides
	 * whether the word names a building; the detector never guesses (D10's family).
	 */
	scope: string | null;
};

/** Everything has a limit (directive 3.1): one paragraph is not allowed to mint a thousand spans. */
export const CAP = 64;

const ROW = /\b([PBGC]\d{1,3})\b/g;                  // B18, P5, G2, C23
const DECISION = /\b(D\d{1,4})\b/g;                  // D2, D63
const SECTION = /§(\d{1,3}(?:\.\d{1,3})?)/g;         // §5, §3.2 — and the second § of `§§5–6`
const FOLD = /\b(FC|GA)-(\d{1,3})\b/g;               // FC-1, GA-10
/**
 * The keyword form. The span covers `row 17` and never the word in front of it: the detector
 * cannot know which words are buildings (it has no register), so it hands the preceding word over
 * as `scope` and lets the resolver — which does — decide. `than row 14` therefore passes `than`,
 * which names no building, and falls back to the containing document's own board.
 */
const ROW_WORD = /\brow\s+(\d{1,3})\b/gi;
/**
 * The same form in the standard's tongue (D71: row (unit) → charge). Both id spellings are written
 * — `charge 17` addresses a grandfathered numeral, `charge C5` the C‹n› id this standard mints —
 * and the resolver matches an id string either way. The keyword is written both ways and the id
 * never is (the `row`-form's own law), so the `C` is uppercase-only rather than `/i`.
 */
const CHARGE_WORD = /\b[Cc]harge\s+(C?\d{1,3})\b/g;
const LEAD = /([A-Za-z][A-Za-z0-9_.-]*)\s+$/;

/**
 * Every reference in one run of text, in reading order and never overlapping.
 *
 * First match wins on an overlap, longest first at one position — the same rule `html.ts` §spans
 * already uses, for the same reason: two spans over one range would print the text twice.
 */
export function detect(text: string): Token[] {
	const hits: Token[] = [];
	const at = (m: RegExpExecArray | RegExpMatchArray) => m.index ?? 0;

	for (const m of text.matchAll(ROW))
		hits.push({ at: at(m), len: m[0].length, text: m[0], kind: 'row', id: m[1]!, scope: null });
	for (const m of text.matchAll(DECISION))
		hits.push({ at: at(m), len: m[0].length, text: m[0], kind: 'decision', id: m[1]!, scope: null });
	for (const m of text.matchAll(SECTION))
		hits.push({ at: at(m), len: m[0].length, text: m[0], kind: 'section', id: m[1]!, scope: null });
	for (const m of text.matchAll(FOLD))
		hits.push({ at: at(m), len: m[0].length, text: m[0], kind: m[1] === 'FC' ? 'fold' : 'ga', id: `${m[1]}-${m[2]}`, scope: null });
	for (const re of [ROW_WORD, CHARGE_WORD]) for (const m of text.matchAll(re)) {
		const lead = LEAD.exec(text.slice(0, at(m)));
		hits.push({ at: at(m), len: m[0].length, text: m[0], kind: 'row', id: m[1]!, scope: lead ? lead[1]!.toLowerCase() : null });
	}

	hits.sort((a, b) => a.at - b.at || b.len - a.len);
	const out: Token[] = [];
	let end = 0;
	for (const h of hits) {
		if (h.at < end) continue;
		out.push(h);
		end = h.at + h.len;
		if (out.length >= CAP) break;
	}
	return out;
}

/**
 * A token's identity **inside one tooltip chain** — the cycle guard's key (B20 §4).
 *
 * Deliberately syntactic and deliberately blunt: within one chain of nested tooltips, the same
 * code word twice is the same object, so the repeat renders as plain text and the chain
 * terminates. A `D2` deeper in the chain that really is some *other* building's D2 loses its
 * tooltip — a conservative refusal rather than an infinite regress, and D10's family says a
 * refusal beats a guess.
 */
export const key = (t: Token): string => `${t.kind}:${t.scope ? `${t.scope}:` : ''}${t.id}`;
