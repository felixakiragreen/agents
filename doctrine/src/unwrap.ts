// The unwrap (D88) — prose flows: one paragraph, one line, the reader's width decides where it
// breaks. This is D81's converter arm for that law, and it is FORM ONLY in the strictest sense
// the city has: no rule here writes a character, it only moves whitespace. A paragraph's
// hard-wrapped lines join with one space — which is exactly what CommonMark renders a soft line
// break as — so the rendered document is identical byte for byte.
//
// The fence is structural, and it is one idea: **a construct whose LINES ARE ITS MEANING is
// untouched.** Fenced code, front matter, tables, headings, thematic breaks, HTML blocks,
// indented blocks and reference-link definitions keep their lines. So does every line the
// Guild's own parsers find at line start — a list marker, a blockquote marker, §11's baton
// (`src/parse.ts`'s `BATON_LINE` is anchored, so a baton joined into the prose above it would
// stop being a baton; measured: `LEDGER.md:1873`, an entry whose `Next:` clause ends the line
// and whose baton opens the next).
//
// A line that OPENS a block is guarded; a line that CONTINUES a paragraph is not. That
// asymmetry is CommonMark's own — an indented code block, an HTML block of the generic kind and
// a table cannot interrupt a paragraph — and it is what keeps a wrapped sentence beginning
// `| curl)` or `< 500 ms` from being read as a table row or a tag.

import { tables } from './parse';

export const UNWRAP = 'unwrap';

/** One reflowed run of source lines. `to` is what those `count` lines become. */
type Group = { start: number; count: number; to: string[] };

type Edit = { line: number; from: string; to: string; rule: string };

/** CommonMark's hard break — two trailing spaces or a trailing backslash. It stays a break. */
const HARD = /(?: {2,}|\\)$/;

const isBlank = (l: string) => l.trim() === '';
const isFence = (l: string) => /^\s*(?:```|~~~)/.test(l);
const isHeading = (l: string) => /^ {0,3}#{1,6}(?:\s|$)/.test(l);
const isBreak = (l: string) => /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/.test(l);
const isQuote = (l: string) => /^ {0,3}>/.test(l);
const isItem = (l: string) => /^ *(?:[-*+]|\d{1,9}[.)])(?:\s|$)/.test(l);
const isRefDef = (l: string) => /^ {0,3}\[[^\]]+\]:\s/.test(l);
const isHtml = (l: string) => /^ {0,3}<[A-Za-z/!?]/.test(l);
const isIndented = (l: string) => /^(?: {4,}|\t)\S/.test(l.replace(/\t/g, '    '));
/** §11's baton — a typed line the reader finds at line start, so it is structure, not prose. */
const isBaton = (l: string) => /^ *\**Baton\**\s*[—–:-]/.test(l);

const QUOTE_MARK = /^ {0,3}> ?/;
const trimTail = (s: string) => s.replace(/[ \t]+$/, '');
/** A continuation line, as it joins: leading indentation dropped, trailing kept only as a break. */
const piece = (l: string) => { const s = l.replace(/^[ \t]+/, ''); return HARD.test(s) ? s : trimTail(s); };

/** Nesting this deep is malformed, not a document — emit it verbatim rather than recurse forever. */
const MAX_QUOTE_DEPTH = 8;

/**
 * The reflow of one container's lines. Every branch pushes exactly ONE group, so the caller can
 * name each edit by the source lines it consumed. Recursion is the blockquote's alone: strip the
 * marker, reflow the inside by the same law, put the first line's marker back.
 */
function reflow(lines: string[], depth: number): Group[] {
	const tableLines = new Set<number>();
	for (const t of tables(lines.join('\n'))) {
		tableLines.add(t.line - 1);                                   // the header row
		tableLines.add(t.line);                                       // the delimiter row
		for (const r of t.rows) tableLines.add(r.line - 1);
	}
	/** May line `i` be swallowed by the paragraph above it? Openers are guarded, continuations are not. */
	const boundary = (i: number) => {
		const l = lines[i]!;
		return isBlank(l) || isFence(l) || isHeading(l) || isBreak(l) || isQuote(l)
			|| isItem(l) || isRefDef(l) || isBaton(l) || tableLines.has(i);
	};

	const groups: Group[] = [];
	for (let i = 0; i < lines.length; ) {
		const start = i;
		const keep = (count: number) => groups.push({ start, count, to: lines.slice(start, start + count) });

		if (isFence(lines[i]!)) {                                     // a fence and its contents, verbatim
			i++;
			while (i < lines.length && !isFence(lines[i]!)) i++;
			if (i < lines.length) i++;                                 // the closing marker; an unclosed fence runs to EOF
			keep(i - start);
			continue;
		}
		if (isQuote(lines[i]!)) {
			while (i < lines.length && isQuote(lines[i]!)) i++;
			const block = lines.slice(start, i);
			if (depth >= MAX_QUOTE_DEPTH) { keep(i - start); continue; }
			const mark = block[0]!.match(QUOTE_MARK)![0];
			const inner = block.map(l => l.replace(QUOTE_MARK, ''));
			const to = reflow(inner, depth + 1).flatMap(g => g.to);
			// Unchanged inside, unchanged outside: re-prefixing an untouched quote would rewrite
			// the markers of every line that spelled one differently, for nothing.
			groups.push({
				start, count: i - start,
				to: to.length === inner.length && to.every((l, k) => l === inner[k])
					? block
					: to.map(l => isBlank(l) ? trimTail(mark) : mark + l),
			});
			continue;
		}
		if (isBlank(lines[i]!) || isHeading(lines[i]!) || isBreak(lines[i]!) || isRefDef(lines[i]!) || tableLines.has(i)) {
			i++; keep(1);
			continue;
		}
		if (!isItem(lines[i]!) && (isHtml(lines[i]!) || isIndented(lines[i]!))) {
			while (i < lines.length && !isBlank(lines[i]!)) i++;       // an HTML or indented block, to its blank line
			keep(i - start);
			continue;
		}

		// A paragraph or a list item — the joinable case. The opener keeps its own bytes (its
		// indentation is the item's), each continuation joins with one space.
		const to: string[] = [];
		let buf = lines[i]!;
		i++;
		while (i < lines.length && !boundary(i)) {
			if (HARD.test(buf)) { to.push(buf); buf = piece(lines[i]!); }
			else buf = trimTail(buf) + ' ' + piece(lines[i]!);
			i++;
		}
		to.push(buf);
		groups.push({ start, count: i - start, to });
	}
	return groups;
}

/** YAML front matter — `---` on line 1, closed by the next `---`. Untouched, and it is data. */
function frontMatter(lines: string[]): number {
	if (lines[0]?.trim() !== '---') return 0;
	for (let i = 1; i < lines.length; i++) if (lines[i]!.trim() === '---') return i + 1;
	return 0;                                                        // never closed: not front matter
}

/** The unwrap of one document: the reflowed text, and one edit per run of lines that moved. */
export function unwrapText(md: string): { after: string; edits: Edit[] } {
	const lines = md.split('\n');
	const head = frontMatter(lines);
	const body = lines.slice(head);
	const groups = reflow(body, 0);
	const out = lines.slice(0, head);
	const edits: Edit[] = [];
	for (const g of groups) {
		out.push(...g.to);
		const from = body.slice(g.start, g.start + g.count);
		if (g.to.length === from.length && g.to.every((l, k) => l === from[k])) continue;
		edits.push({ line: head + g.start + 1, from: from.join('\n'), to: g.to.join('\n'), rule: UNWRAP });
	}
	return { after: out.join('\n'), edits };
}

// ---------- the word law ----------
//
// The round-trip law reads the fields a parser typed; the word law reads the whole document, and
// it is the assertion that makes the unwrap defensible on sight: OUTSIDE FENCES, only whitespace
// moved — no word moved, was dropped, or was added. Fences are compared byte for byte, because
// there the bytes are the meaning.

/** The document split into its fenced blocks (verbatim, markers included) and everything else. */
function fenceSplit(md: string): { fences: string[]; prose: string } {
	const lines = md.split('\n');
	const fences: string[] = [], prose: string[] = [];
	for (let i = 0; i < lines.length; ) {
		if (!isFence(lines[i]!)) { prose.push(lines[i]!); i++; continue; }
		const start = i++;
		while (i < lines.length && !isFence(lines[i]!)) i++;
		if (i < lines.length) i++;
		fences.push(lines.slice(start, i).join('\n'));
	}
	return { fences, prose: prose.join('\n') };
}

/**
 * Whitespace collapsed — and a line's leading BLOCKQUOTE MARKERS with it. A `> ` is line
 * structure exactly as a continuation line's indentation is, and the rule drops both by design:
 * four wrapped `> ` lines become one quoted line carrying one marker. Stripped identically on
 * both sides, so what the law still asserts is the whole of what it claims — no word moved.
 */
const collapse = (s: string) =>
	s.split('\n').map(l => l.replace(/^(?: {0,3}> ?)+/, '')).join(' ').replace(/\s+/g, ' ').trim();

/** The word law, as a list of violations — empty is the law held. */
export function wordLaw(before: string, after: string): string[] {
	const a = fenceSplit(before), b = fenceSplit(after);
	const bad: string[] = [];
	if (a.fences.length !== b.fences.length)
		bad.push(`the word law: ${a.fences.length} fenced block(s) before, ${b.fences.length} after`);
	else for (let i = 0; i < a.fences.length; i++)
		if (a.fences[i] !== b.fences[i]) bad.push(`the word law: fenced block ${i + 1} changed — a fence is bytes, not prose`);
	if (collapse(a.prose) !== collapse(b.prose)) bad.push(`the word law: the prose differs by more than whitespace — ${firstDrift(collapse(a.prose), collapse(b.prose))}`);
	return bad;
}

/** Where two collapsed texts first part, with enough either side for a reader to see it. */
function firstDrift(a: string, b: string): string {
	let i = 0;
	while (i < a.length && i < b.length && a[i] === b[i]) i++;
	return `at char ${i}: ${JSON.stringify(a.slice(Math.max(0, i - 40), i + 40))} vs ${JSON.stringify(b.slice(Math.max(0, i - 40), i + 40))}`;
}
