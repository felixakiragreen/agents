// C26 — the vocabulary arm's control, and the drift alarm that binds it to the law.
//
// STANDARD.md is the single home for the standard; `src/lexicon.ts` is a mirror of §§7–9 and
// this file is the alarm on the mirror: edit the law, these tests go red until the data follows.
// The alarm proves itself — every binding is run a second time against a MUTATED copy of the
// standard's text and asserted to fail, so a check that could never fire cannot pass as one.

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
	CANON_PREFIXES, FORMULAS, GRAVEYARD, ISE_STOPLIST, SPELLING_EXCEPTIONS, SPELLING_PAIRS,
} from '../src/lexicon';
import { mask, vocabularyFails } from '../src/vocabulary';
import { lint } from '../src/lint';
import { parseLedger } from '../src/parse';
import { MANTLES } from '../src/grammar';

const FX = join(import.meta.dir, '..', 'fixtures');
const fx = (kind: string, name: string) => readFileSync(join(FX, kind, name), 'utf8');
const STANDARD = readFileSync(join(import.meta.dir, '..', '..', 'canon', 'work', 'STANDARD.md'), 'utf8');

/** One numbered section of the standard, heading excluded. */
function section(md: string, n: number): string {
	const lines = md.split('\n');
	const start = lines.findIndex(l => new RegExp(`^## ${n}\\. `).test(l));
	expect(start).toBeGreaterThan(-1);
	const rest = lines.slice(start + 1);
	const end = rest.findIndex(l => /^## /.test(l));
	return rest.slice(0, end < 0 ? rest.length : end).join('\n');
}

// ---------- the readers: the standard's own text, parsed ----------

/** §9's table as [dead, successor] pairs, in the table's order. */
const graveyardRows = (md: string): [string, string][] =>
	[...section(md, 9).matchAll(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/gm)]
		.filter(m => m[1] !== 'Dead' && !/^-+$/.test(m[1]!))
		.map(m => [m[1]!, m[2]!]);

/** §8's pinned list, in its numbering. */
const pinned = (md: string): string[] =>
	[...section(md, 8).matchAll(/^ {2}(\d{1,2})\. (.+)$/gm)].map(m => m[2]!);

/** §7's `Id namespace` sentence: the letters the canon reserves. */
const reserved = (md: string): string[] => {
	const s = section(md, 7).replace(/\n/g, ' ');
	const claim = s.match(/canon reserves(.+?)Campaign-scoped/)?.[1] ?? '';
	return [...claim.matchAll(/\*\*([A-Za-z]+-?)\*\*/g)].map(m => m[1]!);
};

/** §8's spelling ruling: the dialect, and the exception list that inverts its own pair. */
const spellingRule = (md: string) => {
	const m = section(md, 8).replace(/\n/g, ' ')
		.match(/\*\*Spelling — ruled: ([A-Za-z]+), with the exception list: ([a-z]+)\*\*\s*\(([^)]+)\)/);
	expect(m).not.toBeNull();
	return { dialect: m![1]!, exceptions: [m![2]!, ...m![3]!.split(',').map(s => s.trim())] };
};

describe('the drift alarm — the lexicon is STANDARD.md, mirrored', () => {
	test('§9: every graveyard row is carried, verbatim and in order', () => {
		expect(GRAVEYARD.map(g => [g.dead, g.successor])).toEqual(graveyardRows(STANDARD));
	});

	test('§9: a row no pattern can serve says so, in writing', () => {
		for (const g of GRAVEYARD) {
			if (g.forms) expect(g.forms.flags).toContain('g');            // the arm re-uses lastIndex
			else expect(g.dropped.length).toBeGreaterThan(80);            // a reason, not a shrug
		}
		// The kill is documented, not silent: the standard's 32 rows, and how many are enforced.
		expect(GRAVEYARD).toHaveLength(32);
		expect(GRAVEYARD.filter(g => g.forms)).toHaveLength(24);
	});

	test('§8: the pinned twenty-four are exact strings', () => {
		expect(FORMULAS).toEqual(pinned(STANDARD));
		expect(FORMULAS).toHaveLength(24);
	});

	test('§7: the canon\'s reserved letters', () => {
		expect(CANON_PREFIXES).toEqual(reserved(STANDARD));
	});

	test('§8: American, and the exception list that inverts `grey`', () => {
		const rule = spellingRule(STANDARD);
		expect(rule.dialect).toBe('American');
		expect(SPELLING_EXCEPTIONS).toEqual(rule.exceptions);
		// the pair the exception inverts must actually be in the lexicon, or the rule is inert
		expect(SPELLING_PAIRS.some(([a, b]) => b === rule.exceptions[0] && a === 'gray')).toBe(true);
	});

	test('the alarm fires: a standard edited behind the lexicon\'s back goes red', () => {
		const buried = STANDARD.replace('| harvest | canonize |', '| harvest | canonize |\n| smoke | evidence |');
		expect(graveyardRows(buried)).not.toEqual(GRAVEYARD.map(g => [g.dead, g.successor]));

		const reworded = STANDARD.replace('  22. Creep is a bug.', '  22. Scope creep is a bug.');
		expect(pinned(reworded)).not.toEqual(FORMULAS);

		const relettered = STANDARD.replace('**FC-**', '**FD-**');
		expect(reserved(relettered)).not.toEqual(CANON_PREFIXES);

		const respelled = STANDARD.replace('exception list: grey**', 'exception list: mauve**');
		expect(spellingRule(respelled).exceptions).not.toEqual(SPELLING_EXCEPTIONS);

		// and each mutation is a real one — a no-op replace would make all four tests vacuous
		for (const m of [buried, reworded, relettered, respelled]) expect(m).not.toBe(STANDARD);
	});

	test('the -ise stoplist holds the words the census missed (C26-F2)', () => {
		for (const w of ['improvise', 'advertise', 'supervise', 'tortoise']) expect(ISE_STOPLIST.has(w)).toBe(true);
	});
});

// ---------- the fence ----------

describe('the fence — history and voice are not "allowed", they are not there', () => {
	const md = fx('vocab', 'README.md');
	const m = mask(md);

	test('the mask preserves every offset — same length, same line count', () => {
		expect(m).toHaveLength(md.length);
		expect(m.split('\n')).toHaveLength(md.split('\n').length);
	});

	test('a finished charge is history whole; a live one speaks the standard', () => {
		expect(m).toContain('the keel sitting');                  // C1 is OPEN — its Work cell is read
		expect(m).not.toContain('the great re-cut');              // C2 is LANDED — the row is history
		expect(m).not.toContain('then fired');                    // …annotation included
	});

	test('a live row\'s machine columns are the parser\'s, not the arm\'s', () => {
		expect(m).not.toContain('Builder · opus-high');
		expect(m).not.toContain('OPEN — DEFERRED');
	});

	test('ticks, quotes, blockquotes and fences carry no dead words', () => {
		for (const dead of ['unstaffed', 'the Dispatcher is dead', 'The old brief', 'You are a Dispatcher'])
			expect(m).not.toContain(dead);
	});

	test('a findings section is the record of a session, and is fenced whole', () => {
		expect(m).not.toContain('The rider was parked');
	});

	test('a one-word link text is an address; a titled link is prose', () => {
		const s = mask('See [flow-keel](../plans/flow-keel.md) and [the keel sitting](x.md).');
		expect(s).not.toContain('flow-keel');
		expect(s).toContain('the keel sitting');
	});
});

// ---------- the arms, on the control ----------

describe('the arms — one line that must catch, one that must not', () => {
	const report = lint([join(FX, 'vocab')], { vocab: true });
	const of = (code: string) => report.fails.filter(f => f.code === code);

	test('the arm is off unless it is asked for', () => {
		expect(lint([join(FX, 'vocab')]).fails.filter(f => f.code.startsWith('vocab.'))).toEqual([]);
	});

	test('the graveyard arm names the successor, and only fires on a live surface', () => {
		expect(of('vocab.dead-word').map(f => f.excerpt.split('"')[1])).toEqual(['keel', 'DoD', 'The register']);
		for (const f of of('vocab.dead-word')) expect(f.excerpt).toContain('→');
	});

	test('the spelling arm is American, and `grey` inverts its own pair', () => {
		expect(of('vocab.spelling').map(f => f.excerpt.slice(0, f.excerpt.indexOf('·')).trim()))
			.toEqual(['"colour" → color', '"gray" → grey']);
	});

	test('the formula arm catches a paraphrase and lets the plain sentence pass', () => {
		const f = of('vocab.formula');
		expect(f).toHaveLength(1);
		expect(f[0]!.excerpt).toContain('Measurements carry their conditions.');
		expect(f[0]!.file).toContain('open.md');            // the live charge doc; closed.md is fenced
	});

	test('the prefix arm warns twice and never fixes: a borrowed letter, and a collision', () => {
		const p = of('vocab.prefix');
		expect(p.map(f => f.severity)).toEqual(['warn', 'warn']);
		expect(p[0]!.excerpt).toContain('1 decision id(s) on the canon\'s letter: D1');
		expect(p[1]!.excerpt).toContain('C: the letter names both a charge and a decision here');
	});

	test('warnings never move the verdict', () => {
		expect(report.fails.filter(f => f.severity === 'fail').length).toBe(6);
		expect(report.fails.filter(f => f.severity === 'warn').length).toBe(2);
	});

	test('a closed charge doc is history: not one word of it fires', () => {
		expect(report.fails.some(f => f.file.endsWith('closed.md'))).toBe(false);
		expect(vocabularyFails(fx('vocab/plans', 'closed.md')).length).toBeGreaterThan(0);   // …only the fence spares it
	});
});

// ---------- item 7: the Fixer ----------

describe('the Fixer — a session with no mantle IS one (D71 §5)', () => {
	test('the mantle is in the parser\'s list, and Dispatcher stays beside it', () => {
		expect(MANTLES).toContain('Fixer');
		expect(MANTLES).toContain('Dispatcher');            // the parser reads the city's history forever
	});

	test('a Fixer head parses, tier `unrecorded`, no failure', () => {
		const r = parseLedger(fx('conforming', 'ledger-fixer.md'));
		expect(r.fails.map(f => f.code)).toEqual([]);
		expect(r.entries.map(e => [e.mantle, e.tier])).toEqual([
			['Fixer', 'unrecorded'], ['Fixer', 'unrecorded'],
		]);
	});
});
