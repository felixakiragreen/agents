// The unwrap (D88, 047) — one before/after pair per construct, and the two laws asserted over
// every one of them: the WORD LAW (outside fences, only whitespace moved — no word did) and the
// ROUND-TRIP LAW (every field a parser typed comes back identical under whitespace collapse).
// Plus the fixed point (040-F7): the second run writes nothing, on every pair.

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { unwrapText, wordLaw } from '../src/unwrap';
import { roundTrip, unwrapMigration } from '../src/migrate';

const FX = join(import.meta.dir, '..', 'fixtures', 'unwrap');
const fx = (name: string) => readFileSync(join(FX, name), 'utf8');

/** One pair per construct the rule must survive — the Done-when's own list. */
const PAIRS = [
	'paragraph', 'list-continuation', 'nested-list', 'blockquote', 'hard-break',
	'fence', 'table', 'heading', 'thematic-break', 'reference-link',
	// 049-F8's live repro, cut verbatim from manny's `review-core-system.md:55-71`: an HTML
	// comment, four list lines and a ```markdown opener. Nothing here may move.
	'html-comment-fence',
];

describe('the unwrap — one pair per construct', () => {
	for (const name of PAIRS) {
		test(`${name} — flows to its pair, and only whitespace moved`, () => {
			const before = fx(`${name}.md`);
			const m = unwrapMigration(`${name}.md`, before);
			expect(m.after).toBe(fx(`${name}.flowed.md`));
			expect(wordLaw(before, m.after)).toEqual([]);
			expect(roundTrip(m)).toEqual([]);
		});
	}

	test('the fixed point (040-F7) — a second run writes nothing, on every pair', () => {
		for (const name of PAIRS) {
			const once = unwrapText(fx(`${name}.md`));
			expect({ [name]: unwrapText(once.after).edits }).toEqual({ [name]: [] });
		}
	});

	test('a document already flowed is already home — no edits', () => {
		for (const name of PAIRS) expect({ [name]: unwrapText(fx(`${name}.flowed.md`)).edits }).toEqual({ [name]: [] });
	});
});

// ---------- what the rule refuses to touch, and why ----------

const flow = (md: string) => unwrapText(md).after;

describe('the unwrap — the fence is structural', () => {
	test('front matter is data, not prose (canon/agents/*.md — 11 live files)', () => {
		const md = '---\nname: opus-high\ndescription: a tier,\n  wrapped\nmodel: opus\n---\n\nProse that\nflows.\n';
		expect(flow(md)).toBe('---\nname: opus-high\ndescription: a tier,\n  wrapped\nmodel: opus\n---\n\nProse that flows.\n');
	});

	test('an unclosed leading `---` is a thematic break, not front matter', () => {
		expect(flow('---\n\nProse that\nflows.\n')).toBe('---\n\nProse that flows.\n');
	});

	test('§11\'s baton is a typed line: it opens, it is never swallowed (LEDGER.md:1873)', () => {
		const md = 'the body of the entry. Next:\nBaton — ⬡ → verify the close: rulings F4 · F5,\nthe prune at `9186f1c`.\n';
		expect(flow(md)).toBe('the body of the entry. Next:\nBaton — ⬡ → verify the close: rulings F4 · F5, the prune at `9186f1c`.\n');
	});

	test('an HTML block opens a block and is left alone; a wrapped `<` does not', () => {
		expect(flow('<section class="panel">\n  <p>a</p>\n</section>\n')).toBe('<section class="panel">\n  <p>a</p>\n</section>\n');
		expect(flow('a sentence whose wrap lands on\n<probe.ts> and carries on.\n')).toBe('a sentence whose wrap lands on <probe.ts> and carries on.\n');
	});

	test('an indented block opens untouched; an indented CONTINUATION still joins', () => {
		expect(flow('para.\n\n      indented, and its\n      second line\n')).toBe('para.\n\n      indented, and its\n      second line\n');
		expect(flow('a sentence that wraps\n      onto a deeply indented line.\n')).toBe('a sentence that wraps onto a deeply indented line.\n');
	});

	test('a table cannot interrupt a paragraph — a wrapped `|` line is prose (c21-gut-v1.md:29)', () => {
		expect(flow("`Waiting = 'blocked'\n   | 'nagging'` — the union.\n")).toBe("`Waiting = 'blocked' | 'nagging'` — the union.\n");
	});

	test('a fence swallows every construct inside it, verbatim', () => {
		const md = '```\n| a | b |\n\n- item\n  wrapped\n```\n';
		expect(flow(md)).toBe(md);
	});

	test('an HTML block runs to its blank line — or to the fence marker, whichever comes first (049)', () => {
		// The opener a run may never swallow: eat the ``` and every fence below it re-pairs
		// opener-to-closer, so what was code is reflowed as prose (manny, 15 word-law violations).
		const md = '<!-- a note -->\n- Proposed:\n```\ncode\n\n> quoted\n```\ntail that\nwraps.\n';
		expect(flow(md)).toBe('<!-- a note -->\n- Proposed:\n```\ncode\n\n> quoted\n```\ntail that wraps.\n');
		expect(wordLaw(md, flow(md))).toEqual([]);
		// the control: with no fence in the way the run still ends at its blank line
		expect(flow('<!-- a note -->\n- Surfaces: one\n\ntail that\nwraps.\n'))
			.toBe('<!-- a note -->\n- Surfaces: one\n\ntail that wraps.\n');
	});
});

// ---------- the word law, proved by breaking it ----------

describe('the word law', () => {
	test('holds where only whitespace moved', () => {
		expect(wordLaw('a b\nc d\n', 'a b c d\n')).toEqual([]);
	});

	test('catches a word added, a word dropped, and a word moved', () => {
		expect(wordLaw('a b c\n', 'a b X c\n')).toHaveLength(1);
		expect(wordLaw('a b c\n', 'a c\n')).toHaveLength(1);
		expect(wordLaw('a b c\n', 'a c b\n')).toHaveLength(1);
	});

	test('a fence is bytes, not prose — a whitespace change inside one fails', () => {
		expect(wordLaw('p\n\n```\na\nb\n```\n', 'p\n\n```\na b\n```\n')[0]).toContain('fenced block 1 changed');
		expect(wordLaw('p\n\n```\na\n```\n', 'p\n')[0]).toContain('1 fenced block(s) before, 0 after');
	});

	test('a leading blockquote marker is line structure, and is stripped on both sides', () => {
		expect(wordLaw('> a b\n> c d\n', '> a b c d\n')).toEqual([]);
		expect(wordLaw('> a b\n> c d\n', '> a b c\n')).toHaveLength(1);
	});
});
