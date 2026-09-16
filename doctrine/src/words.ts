// A building's own word register — `WORDS.md` (DOCTRINE §3, the WORDS.md law; STANDARD §7's
// local kinds). The Guild's tongue is canon's and this is what one building minted on top of it:
// its live words, and its graveyard with each successor named.
//
// Why the parser reads it (050): the register's own law said *until the arm reads a building's
// register, the Architect sweeps this list by hand* (stigmergon WORDS.md §6) — and the case that
// wrote it is *rail*, killed at stigmergon D23 and re-minted twice with his blessing, with
// nothing in the city able to catch it.
//
// The two laws this file inherits from `lexicon.ts` are the same two, and the second one bites
// hardest here because the rows are another building's prose: **narrow the pattern, never
// whitelist a file**, and **a pattern that cannot be written without false positives is dropped**.
// A row this reader cannot turn into a word is dropped in silence rather than guessed at, because
// the drop reasons for a foreign register are that building's Architect's to write, not this
// reader's to invent.

import { strip, topSplit } from './grammar';
import { isBoardHeader, tables } from './parse';

/** One row of the building's graveyard, in the standard's form: dead · successor · when. */
export type Grave = { dead: string; successor: string; when: string; forms: string[]; line: number };
export type Register = {
	/** Every word the building mints, bare — the article dropped, because `a desk` and `the desk`
	 *  are the same word wearing different determiners and the graveyard writes both. */
	words: Set<string>;
	graveyard: Grave[];
};

export const EMPTY_REGISTER: Register = { words: new Set(), graveyard: [] };

/** A word without its determiner — the one normalization, applied to both sides of every test. */
export const bare = (s: string) => s.toLowerCase().replace(/^(?:the|a|an)\s+/, '').trim();

/**
 * A dead cell's words. The register writes a row's dead side as prose — a list on `·`, each item
 * qualified behind an em-dash or in a trailing parenthetical — so the WORD is what stands in
 * front of both. A **code-ticked** cell is an identifier and not a word (`WALL_MS`, `foldName`):
 * a rename of a symbol is the compiler's alarm, never speech's.
 */
function deadForms(cell: string): string[] {
	if (cell.includes('`')) return [];
	return topSplit(cell, ['·'])
		.map(x => strip(x).split(/\s+[—–]\s+/)[0]!.trim())
		// A trailing parenthetical says the row kills a SENSE and not a word — *the paint (as a
		// place)*, *the desk (the directory)* — and the live sense is the same letters: stigmergon's
		// receipt is *the file or the wire, never the paint*, which is D13's word doing its job.
		// `lexicon.ts` drops `pass`, `fold`, `move` and `strike` for this and writes the reason;
		// this is the same drop, made structurally, because the reason is another building's to write.
		.filter(x => !/\)$/.test(x))
		.filter(x => /^[A-Za-z][A-Za-z' -]{2,}$/.test(x));
}

/** The register's live words: one bold run per bullet, itself a `·`-list where a row minted two. */
function liveWords(md: string): Set<string> {
	const out = new Set<string>();
	for (const line of md.split('\n')) {
		const m = line.match(/^\s*-\s+\*\*(.+?)\*\*\s*·/);
		if (!m) continue;
		for (const w of topSplit(m[1]!, ['·'])) if (w.trim()) out.add(bare(strip(w)));
	}
	return out;
}

/**
 * The building's register, read. The graveyard is the table whose header IS the standard's —
 * dead · successor · when — and a building that keeps its words in another shape keeps them to
 * itself: the arm reads the form the law names and refuses to guess at any other.
 *
 * A word the register mints LIVE is not dead here whatever the row beside it says — that is the
 * local kind (STANDARD §7), and it is what keeps stigmergon's `fold` (the reduce, live) out of
 * its own row for `fold` (the UI verb, dead). One word, two senses, and the building ruled which
 * one it keeps: the reader honors the ruling instead of reporting the collision forever.
 */
export function parseWords(md: string): Register {
	const words = liveWords(md);
	const graveyard: Grave[] = [];
	for (const t of tables(md)) {
		if (isBoardHeader(t.header)) continue;
		const head = t.header.map(h => strip(h).toLowerCase());
		if (head.length !== 3 || head[0] !== 'dead' || head[1] !== 'successor') continue;
		for (const r of t.rows) {
			if (r.cells.length !== 3) continue;
			const forms = [...new Set(deadForms(r.cells[0]!).filter(f => !words.has(bare(f))))];
			if (!forms.length) continue;
			graveyard.push({ dead: strip(r.cells[0]!), successor: strip(r.cells[1]!), when: strip(r.cells[2]!), forms, line: r.line });
		}
	}
	return { words, graveyard };
}
