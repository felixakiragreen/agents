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

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
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
			boards: ['/tmp/gone-b3/README.md'], ledger: null, decisions: null, issues: null, workDocs: [], prose: [] } };
		expect(() => content(gone)).toThrow();
	});
});

// The held register is not exercised here on purpose: its first call walks the real `~/code`,
// nine seconds of filesystem, and a unit suite that pays that is a suite nobody runs. The TTL is
// checkable for free; warmth, the printed age and the bust are measured against the live server
// in the DoD (`plans/b8-glass-hardenings.md`), which is where a timing claim belongs anyway.
test('the TTL is the E1 ruling of 2026-08-27: 300 s, with the bust and the button for freshness', () =>
	expect(TTL_MS).toBe(300_000));

// ---------- B23 §4: the freshness the Workshop's board depends on ----------

/**
 * The reported case — *"B22–B27 in the wire payload through refreshes, never painted"* — did not
 * reproduce (see `camera/probes/board-fresh.probe.ts` and B23 §Findings). What the E1 ruling really
 * holds, and what it never holds, is pinned here so the two halves can never quietly swap:
 * **content is re-read on every call; the file LIST is the held half.**
 */
describe('a row committed under an open deck (B23 §4)', () => {
	const home = mkdtempSync(join(tmpdir(), 'b23-fresh-'));
	const board = join(home, 'README.md');
	const rowsOf = (e: Entry) => content(e).board.reduce((n, b) => n + b.rows.length, 0);
	const entry: Entry = { building: 'nb', path: home, files: {
		boards: [board], ledger: null, decisions: null, issues: null, workDocs: [], prose: [] } };

	beforeAll(() => writeFileSync(board, ['# nb', '', '## The board', '',
		'| ID | Work | Depends on | Staffing | Status |', '|---|---|---|---|---|',
		'| N1 | the row that was there | — | Builder · opus-high | OPEN — laid 2026-08-31 |', ''].join('\n')));
	afterAll(() => rmSync(home, { recursive: true, force: true }));

	test('an appended row is on the NEXT read — no wait, no re-walk, no cache to bust', () => {
		expect(rowsOf(entry)).toBe(1);
		appendFileSync(board, '| N2 | the row committed while he was reading | — | Builder · opus-high | OPEN |\n');
		expect(rowsOf(entry)).toBe(2);
		expect(content(entry).board[0]!.rows.at(-1)!.id).toBe('N2');
	});

	test('an EDITED row is re-read too — a status that moved is content, not a file list', () => {
		writeFileSync(board, readFileSync(board, 'utf8').replace('OPEN — laid 2026-08-31', 'LANDED 2026-08-31'));
		expect(content(entry).board[0]!.rows[0]!.state).toBe('LANDED');
	});

	test('what the walk DOES hold is the file list: a board file it never saw is not read', () => {
		// The other half of the ruling, and the honest one — the register prints its own age beside
		// the re-walk button, because this window is 300 s wide (`TTL_MS`) unless something busts it.
		writeFileSync(join(home, 'BOARD.md'), ['# second', '', '## The board', '',
			'| ID | Work | Depends on | Staffing | Status |', '|---|---|---|---|---|',
			'| M1 | a row in a file the walk never saw | — | Builder · opus-high | OPEN |', ''].join('\n'));
		expect(rowsOf(entry)).toBe(2);
		expect(TTL_MS).toBe(300_000);
	});
});
