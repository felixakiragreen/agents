// `doctrine lint --vocab` — the vocabulary arm. Format drift is caught by the parser; this is
// the same alarm pointed at SPEECH: the graveyard (§9), the spelling lexicon and the pinned
// formulas (§8), the id namespace (§7).
//
// Two laws, both inherited from manny's M13 (see `lexicon.ts`'s header for the birthplace):
//   1. Narrow the pattern, never whitelist a file.
//   2. One code per arm; the advice text — here, the excerpt — differentiates.
//
// The fence is structural, not a list of exceptions: history and voice are MASKED OUT of the
// text before a single pattern runs, so a dead word inside a quote, a summons fence, a ledger,
// a findings section or a Status annotation is not "allowed", it is not there.

import { isBoardHeader, tables } from './parse';
import { fail, leadingToken, strip, type Fail } from './grammar';
import { FORMULAS, GRAVEYARD, ISE_STOPLIST, SPELLING_EXCEPTIONS, SPELLING_PAIRS } from './lexicon';
import { EMPTY_REGISTER, type Register } from './words';

// ---------- the fence ----------

/**
 * Sections that are history wherever they appear (025's fence): a findings section is the
 * record of what a session found, and an inline ledger is a ledger.
 */
const FENCED_HEADING = /^(?:\d+\.\s*)?(?:findings?|ledger|decisions|log|escalations?|what landed)\b/i;

/** Same length, same newlines, no content — so every offset in the masked text is the real one. */
const blank = (s: string) => s.replace(/[^\n]/g, ' ');

/** Blank every match's body, keeping the string's length (and therefore every later offset). */
const blankMatches = (s: string, re: RegExp) => s.replace(re, blank);

/** The unescaped `|` offsets of a markdown table row — cell k lives between pipe k and k+1. */
function pipes(line: string): number[] {
	const out: number[] = [];
	for (let i = 0; i < line.length; i++) if (line[i] === '|' && line[i - 1] !== '\\') out.push(i);
	return out;
}

/**
 * The law surface, with history and voice removed. Fenced code (summonses, quoted docs),
 * blockquotes, findings and inline-ledger sections, struck text, inline code, link targets,
 * double-quoted spans, and a board's three machine columns all leave as whitespace.
 *
 * Exported because the fence IS the contract — a test that cannot see the mask cannot prove
 * what the arm refuses to look at.
 */
export function mask(md: string): string {
	const lines = md.split('\n');
	const kept: string[] = [];
	let inFence = false, fencedSection = 0;
	for (const line of lines) {
		if (/^\s*(?:```|~~~)/.test(line)) { inFence = !inFence; kept.push(blank(line)); continue; }
		if (inFence) { kept.push(blank(line)); continue; }
		const h = line.match(/^(#{1,6})\s+(.*)$/);
		if (h) {
			const level = h[1]!.length;
			if (fencedSection && level <= fencedSection) fencedSection = 0;
			if (!fencedSection && FENCED_HEADING.test(h[2]!.replace(/[*`]/g, '').trim())) fencedSection = level;
		}
		if (fencedSection || /^\s*>/.test(line)) { kept.push(blank(line)); continue; }
		kept.push(line);
	}

	// A board's Depends-on, Staffing and Status cells are the parser's columns and their
	// annotations are history (025's fence); the ID and Work cells stay, because Work is live
	// prose. A FINISHED charge is history whole: its title is the address the ledger cites, and
	// respelling it would rename the past — exactly what the standard defers.
	for (const t of tables(md)) {
		if (!isBoardHeader(t.header)) continue;
		for (const r of t.rows) {
			const line = kept[r.line - 1];
			if (line === undefined) continue;
			const state = leadingToken(strip(r.cells[4] ?? ''));
			if (state === 'LANDED' || state === 'KILLED') { kept[r.line - 1] = blank(line); continue; }
			const p = pipes(line);
			if (p.length < 3) continue;
			kept[r.line - 1] = line.slice(0, p[2]! + 1) + blank(line.slice(p[2]! + 1));
		}
	}

	let out = kept.join('\n');
	out = blankMatches(out, /`[^`\n]*`/g);              // inline code
	out = blankMatches(out, /~~[^~\n]*~~/g);            // §7's retired text
	// A one-word link text is an address, not prose: `[flow-keel](…)`, `[18-great-recut.md](…)`.
	// A titled link keeps its words — a board's Work cell is the arm's best surface — but its
	// target never survives either way.
	out = blankMatches(out, /\[[^\]\s]+\]\([^)\n]*\)/g);
	out = blankMatches(out, /\]\([^)\n]*\)/g);
	out = blankMatches(out, /"[^"\n]{1,200}"/g);        // quotes are exempt (spec item 1)
	out = blankMatches(out, /[“][^”\n]{1,200}[”]/g);
	return out;
}

// ---------- the arms ----------

const lineOf = (text: string, offset: number) => 1 + (text.slice(0, offset).match(/\n/g)?.length ?? 0);

/** The offending word in its line, trimmed — enough context to judge the hit without opening the file. */
function excerpt(text: string, offset: number, word: string, advice: string): string {
	const start = text.lastIndexOf('\n', offset) + 1;
	const end = text.indexOf('\n', offset);
	const line = text.slice(start, end < 0 ? text.length : end).trim();
	return `"${word}" → ${advice} · ${line.length > 140 ? line.slice(0, 137) + '…' : line}`;
}

/** §9 — a dead word on a law surface, with its successor named. */
function graveyardFails(text: string, raw: string): Fail[] {
	const out: Fail[] = [];
	for (const g of GRAVEYARD) {
		if (!g.forms) continue;
		for (const m of text.matchAll(g.forms))
			out.push(fail('prose', 'vocab.dead-word', 'a word the standard buried (§9) — the successor is named in the excerpt',
				excerpt(raw, m.index, m[0], g.successor), lineOf(text, m.index)));
	}
	return out;
}

/** §8 — American, word by word, with `grey` inverting its own pair. */
function spellingFails(text: string, raw: string): Fail[] {
	const out: Fail[] = [];
	const seen = new Set<number>();
	for (const [american, british] of SPELLING_PAIRS) {
		// The exception list does not excuse a word, it swaps the pair: `grey` is the Guild's spelling.
		const [right, wrong] = SPELLING_EXCEPTIONS.includes(british) ? [british, american] : [american, british];
		for (const m of text.matchAll(new RegExp(`\\b${wrong}(?:s|es|d|ed|ing|ation|ations)?\\b`, 'gi'))) {
			seen.add(m.index);
			out.push(fail('prose', 'vocab.spelling', 'the standard spells American, exception list {grey, greys, greyed} (§8)',
				excerpt(raw, m.index, m[0], right), lineOf(text, m.index)));
		}
	}
	for (const m of text.matchAll(/\b([a-z]{3,})(ise|isation)(s|d|r|rs|ing)?\b/g)) {
		if (ISE_STOPLIST.has(`${m[1]}ise`) || seen.has(m.index)) continue;
		out.push(fail('prose', 'vocab.spelling', 'the standard spells American, exception list {grey, greys, greyed} (§8)',
			excerpt(raw, m.index, m[0], m[0].replace(m[2]!, m[2] === 'ise' ? 'ize' : 'ization')), lineOf(text, m.index)));
	}
	return out;
}

// ---------- §8's pinned formulas ----------

/** Words too common to carry a formula's identity — a match on these alone is a coincidence. */
const THIN = new Set(['the', 'a', 'an', 'is', 'are', 'of', 'to', 'in', 'and', 'or', 'not', 'with',
	'for', 'on', 'at', 'by', 'it', 'its', 'their', 'that', 'this', 'from', 'as', 'be', 'his',
	'then', 'when', 'never', 'always', 'must', 'any', 'own', 'but', 'was', 'has']);

/** Lowercase word list, possessives folded — "the Sovereign's deck" is `the sovereign deck`. */
const words = (s: string) => s.toLowerCase().replace(/['’]s\b/g, '').match(/[a-z]+/g) ?? [];

/** A formula's identity: its substantial words, deduplicated, in order. */
const spine = (s: string) => [...new Set(words(s).filter(w => w.length >= 3 && !THIN.has(w)))];

/**
 * Formula drift: a line wearing most of a pinned formula's spine but not its wording. Three
 * matched spine words is the floor AND two thirds of the spine is the bar — below either, the
 * overlap is ordinary English, as the corpus proved ("a cold session's question" carries two of
 * formula 17's five and is not a paraphrase of anything).
 *
 * The floor has a price, stated rather than hidden: a formula with fewer than three spine words
 * (11 "Passing = finished.", 22 "Creep is a bug.", 9 "A paraphrase is a defect.") can never fire.
 * A two-word formula has no distinctive run — matching it on one word would fire on every
 * sentence in the city that says "defect".
 */
function formulaFails(text: string, raw: string): Fail[] {
	const out: Fail[] = [];
	const pinned = FORMULAS.map(f => ({ text: f, spine: spine(f), flat: words(f).join(' ') }))
		.filter(f => f.spine.length >= 3);
	let offset = 0;
	for (const line of text.split('\n')) {
		const lw = new Set(words(line));
		if (lw.size >= 3) for (const f of pinned) {
			const hit = f.spine.filter(w => lw.has(w));
			if (hit.length < 3 || hit.length < Math.ceil(2 * f.spine.length / 3)) continue;
			if (words(line).join(' ').includes(f.flat)) continue;      // the line IS the formula
			out.push(fail('prose', 'vocab.formula', 'a pinned formula, paraphrased — §8 pins one exact wording each (a paraphrase is a defect)',
				excerpt(raw, offset, hit.join(' '), f.text), lineOf(text, offset)));
		}
		offset += line.length + 1;
	}
	return out;
}

/**
 * §9 at the building's own altitude (050): a word the BUILDING buried, re-minted on its own live
 * surfaces. A **warning**, and the severity is the whole difference from the row above it — the
 * standard's graveyard is the city's law and a building's is its own ruling, which its Architect
 * may re-rule at any sitting (D89). The fence is the same fence: the mask has already taken
 * history and voice out of the text, and the register itself is no law surface, because a
 * register must name the dead to bury them.
 *
 * Birthplace: stigmergon's *rail*, killed at D23 and re-minted twice with his blessing, with
 * nothing in the city able to catch it (the words sitting, 2026-09-14).
 */
function localGraveyardFails(masked: string, raw: string, register: Register): Fail[] {
	const out: Fail[] = [];
	for (const g of register.graveyard) for (const form of g.forms)
		for (const m of masked.matchAll(new RegExp(`\\b${form}\\b`, 'gi')))
			out.push(fail('prose', 'vocab.local-dead-word', 'a word this building buried in its own register (WORDS.md; DOCTRINE §3) — the successor is named in the excerpt; reported, never enforced',
				excerpt(raw, m.index, m[0], `${g.successor} (${g.when})`), lineOf(masked, m.index), 'warn'));
	return out;
}

/** Every lexical arm, over one law surface. The caller decides whether the file is one. */
export function vocabularyFails(md: string, register: Register = EMPTY_REGISTER): Fail[] {
	const masked = mask(md);
	return [
		...graveyardFails(masked, md), ...spellingFails(masked, md), ...formulaFails(masked, md),
		...localGraveyardFails(masked, md, register),
	];
}

// ---------- §7 — the id namespace, per building ----------

const prefixOf = (id: string) => id.match(/^([A-Za-z]+-?[A-Za-z]*?)-?\d/)?.[1] ?? null;

/**
 * §7's namespace, reported at the building's altitude: one letter serving two kinds in one
 * building is the collision the standard forbids. A WARNING, never auto-fixed — retiring a
 * letter is that building's own respell (D80). The bare-`D‹n›` arm died with D80: every
 * building's register writes bare D at home and is qualified `‹building›:D‹n›` abroad.
 */
export function prefixFails(
	e: { chargeIds: Iterable<string>; decisions: readonly { id: string; line: number }[] },
): Fail[] {
	const charges = new Set([...e.chargeIds].map(prefixOf).filter((p): p is string => p !== null));
	const collisions = [...new Set(e.decisions.map(d => prefixOf(d.id)))]
		.filter((p): p is string => p !== null && charges.has(p));
	if (!collisions.length) return [];
	return [fail('prose', 'vocab.prefix', 'one letter, two kinds in one building — §7 gives each letter one kind; reported, never auto-fixed',
		`${collisions.join(' · ')}: the letter names both a charge and a decision here`, e.decisions[0]?.line ?? 1, 'warn')];
}
