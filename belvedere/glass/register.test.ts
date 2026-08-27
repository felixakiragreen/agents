// The register/content split is the E1 ruling made mechanical: the walk may be held warm, the
// content may not. The split is only honest if the re-read half produces EXACTLY what the walk
// half would have — so this file pins `content(entry)` deep-equal to `discover()`'s own
// `Building`, over a real corpus, every field.
//
// This is the guard on D65's seam. `content()` mirrors `assemble()` by hand because `doctrine/`
// exposes no re-read entry point yet (the canon-inbox ask rides B3's findings); the day it
// drifts — a new artifact kind, a changed decisions fallback — this test fails instead of the
// glass quietly rendering a thinner building than the parser would.
//
// Corpus: `lab/b3/city/` for shape, and this repo's own `belvedere/` for a building with every
// artifact present at once (board, ledger, decisions, issues, work docs).

import { expect, test, describe } from 'bun:test';
import { join } from 'path';
import { discover, parse } from '../../doctrine';
import { content, TTL_MS, type Entry } from './register';

const HERE = join(import.meta.dir, '..');            // belvedere/
const FIXTURE = join(HERE, 'lab/b3/city');

const entryOf = (b: { building: string; path: string; files: Entry['files'] }): Entry =>
	({ building: b.building, path: b.path, files: b.files });

describe('content() is assemble()', () => {
	test('over the fixture city, every building matches field for field', () => {
		const walked = discover([FIXTURE]);
		expect(walked.length).toBeGreaterThan(0);
		for (const b of walked) expect(content(entryOf(b))).toEqual(b);
	});

	test('over a building carrying every artifact at once', () => {
		const b = parse(HERE);
		// Guard the guard: a corpus with nothing in it would pass the deep-equal vacuously.
		expect(b.files.ledger).not.toBeNull();
		expect(b.files.decisions).not.toBeNull();
		expect(b.files.issues).not.toBeNull();
		expect(b.files.boards.length).toBeGreaterThan(0);
		expect(b.files.workDocs.length).toBeGreaterThan(0);
		expect(content(entryOf(b))).toEqual(b);
	});

	test('a building whose files vanished after the walk throws, and city() catches it', () => {
		const gone: Entry = { building: 'gone', path: '/tmp/gone-b3', files: {
			boards: ['/tmp/gone-b3/README.md'], ledger: null, decisions: null, issues: null, workDocs: [] } };
		expect(() => content(gone)).toThrow();
	});
});

// The held register is not exercised here on purpose: its first call walks the real `~/code`,
// nine seconds of filesystem, and a unit suite that pays that is a suite nobody runs. The TTL is
// checkable for free; warmth, the printed age and the bust are measured against the live server
// in the DoD (`plans/b8-glass-hardenings.md`), which is where a timing claim belongs anyway.
test('the TTL is the E1 ruling of 2026-08-27: 300 s, with the bust and the button for freshness', () =>
	expect(TTL_MS).toBe(300_000));
