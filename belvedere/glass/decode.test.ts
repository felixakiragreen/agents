// The detector, pinned (B20 §1). Pure function, pure test: what counts as a code word, what does
// not, and what happens where two rules want the same characters.

import { describe, expect, test } from 'bun:test';
import { CAP, detect, key } from './decode';

const found = (text: string) => detect(text).map(t => `${t.kind}:${t.id}${t.scope ? `@${t.scope}` : ''}`);
const covered = (text: string) => detect(text).map(t => t.text);

describe('the six forms', () => {
	test('row ids, decision ids, sections, FC/GA — each in its own namespace', () => {
		expect(found('B18 and P5 and G2')).toEqual(['row:B18', 'row:P5', 'row:G2']);
		expect(found('D2 then D63')).toEqual(['decision:D2', 'decision:D63']);
		expect(found('§5 and §3.2')).toEqual(['section:5', 'section:3.2']);
		expect(found('FC-1 gates the rail; GA-10 cut it')).toEqual(['fold:FC-1', 'ga:GA-10']);
	});

	test('the row-keyword form covers `row N` and hands the word in front over as scope', () => {
		expect(found('canon row 17 is the storage experiment')).toEqual(['row:17@canon']);
		expect(covered('canon row 17 is the storage experiment')).toEqual(['row 17']);
		expect(found('bob row 3')).toEqual(['row:3@bob']);
		// The detector has no register, so it cannot know `than` names no building. It says what it
		// saw and the resolver decides — which is why `than row 14` still resolves, locally.
		expect(found('narrower than row 14')).toEqual(['row:14@than']);
		expect(found('row 14, bare')).toEqual(['row:14']);
	});

	test('case: `row` is written both ways, ids never are', () => {
		expect(found('Row 12')).toEqual(['row:12']);
		expect(found('b18 and d2 are prose, not ids')).toEqual([]);
	});
});

// ---------- the standard's own address (D71) ----------

describe('a charge is addressed in the standard as well as the graveyard', () => {
	test('the bare C‹n› id is a row id like B18 and P5', () => {
		expect(found('C23 laid the law book; C28 waits on his drafts')).toEqual(['row:C23', 'row:C28']);
		expect(covered('C23 laid the law book')).toEqual(['C23']);
	});

	test('the keyword form takes both id spellings, and covers only the reference', () => {
		expect(found('charge C5 is the one')).toEqual(['row:C5']);
		expect(found('charge 17 is the storage experiment')).toEqual(['row:17']);
		expect(covered('canon charge C5 is the one')).toEqual(['charge C5']);
	});

	test('the word in front is scope here too — the resolver decides, the detector never guesses', () => {
		expect(found('canon charge C5')).toEqual(['row:C5@canon']);
		expect(found('bob charge 3')).toEqual(['row:3@bob']);
	});

	test('`Charge` is written both ways; the id is not, so `charge c5` addresses nothing', () => {
		expect(found('Charge C5')).toEqual(['row:C5']);
		expect(found('charge c5')).toEqual([]);
	});

	test('the C is an id prefix, not a letter in a word: a lowercase branch is still prose', () => {
		expect(found('spacex-dashboard-c2 and cap-mega')).toEqual([]);
		expect(found('FC-1 is a fold candidate, never a charge')).toEqual(['fold:FC-1']);
	});
});

describe('what is NOT a reference', () => {
	test('a lowercase branch, a hex colour and a p95 are left alone', () => {
		expect(found('bv/b3-smoke landed at p95 48 ms wearing #a5e22c')).toEqual([]);
	});

	test('an id glued to other characters keeps its boundaries', () => {
		expect(found('3D2')).toEqual([]);
		expect(found('B13’s own probe')).toEqual(['row:B13']);
		expect(found('P6-A was the blank-lines arm')).toEqual(['row:P6']);
	});

	test('the second § of a range still resolves; the far end stays prose', () => {
		expect(covered('README §§5–6')).toEqual(['§5']);
	});
});

describe('overlap and limits', () => {
	test('first match wins and nothing is covered twice', () => {
		const ts = detect('D63 · B18 · §7 · row 4');
		let end = 0;
		for (const t of ts) { expect(t.at).toBeGreaterThanOrEqual(end); end = t.at + t.len; }
		expect(ts.map(t => t.text)).toEqual(['D63', 'B18', '§7', 'row 4']);
	});

	test('the covered slice is exactly the token text', () => {
		const text = 'ruled at D10, see §3.2 and canon row 18';
		for (const t of detect(text)) expect(text.slice(t.at, t.at + t.len)).toBe(t.text);
	});

	test('everything has a limit: one paragraph cannot mint a thousand spans', () => {
		expect(detect(Array.from({ length: 200 }, (_, n) => `D${n + 1}`).join(' ')).length).toBe(CAP);
	});
});

describe('the cycle key', () => {
	test('one word, one key — and the scope word is part of the identity', () => {
		expect(key(detect('D2')[0]!)).toBe('decision:D2');
		expect(key(detect('canon row 17')[0]!)).toBe('row:canon:17');
		expect(key(detect('row 17')[0]!)).toBe('row:17');
	});
});
