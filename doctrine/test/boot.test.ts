// The boot pack (044) — the render of a parse a cold session boots from.
//
// The law under test is that nothing in the pack is authored: every line that is not a
// heading, a count line, the baton line, the statement or the lint line is a byte from a file
// under the root. A paraphrase in a pack read cold is a lie the reader cannot see.

import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { bootPack } from '../src/boot';
import { parse } from '../src/building';

const FX = join(import.meta.dir, '..', 'fixtures');
const BOOT = join(FX, 'boot');
const BARE = join(FX, 'boot-bare');

const lines = (root: string) => bootPack(root).split('\n');
const has = (root: string, want: string) => lines(root).some(l => l === want);

describe('boot — the pack a cold session reads', () => {
	test('every section is rendered, in order', () => {
		const heads = lines(BOOT).filter(l => l.startsWith('## ')).map(l => l.split(':')[0]);
		expect(heads).toEqual([
			'## Board — BOARD.md · The campaign',
			'## Board — BOARD.md · The gates',
			'## Ledger — LEDGER.md',
			'## Decisions — DECISIONS.md',
			'## Inbox — ISSUES.md',
		]);
		const tail = lines(BOOT).slice(-2);
		expect(tail[0]).toBe('Statement: 0 on credit · max interest 0');
		expect(tail[1]).toBe('Lint: 0 failure(s) in 0 class(es) · 0 warning(s)');
	});

	test('the title carries the register Name, the root, HEAD and the day', () => {
		expect(lines(BOOT)[0]).toMatch(/^# boot — boot · ~\/code\/agents\/doctrine\/fixtures\/boot · HEAD (?:[0-9a-f]{7,}|no git) · \d{4}-\d{2}-\d{2}$/);
	});

	test('only live rows print — OPEN, IN FLIGHT, BLOCKED and nothing else', () => {
		const rows = lines(BOOT).filter(l => l.startsWith('| ') && !l.startsWith('| ID |'));
		expect(rows.map(r => r.split('|')[1]!.trim())).toEqual(['002', '003', '005', 'G2']);
	});

	test('each printed row is byte-identical to its source line', () => {
		const board = readFileSync(join(BOOT, 'BOARD.md'), 'utf8').split('\n');
		for (const l of lines(BOOT).filter(x => x.startsWith('| '))) expect(board).toContain(l);
	});

	test('the count line reads the board, and the deferred count is the shelf', () => {
		expect(has(BOOT, '## Board — BOARD.md · The campaign: 5 charges · 3 live · 1 landed · 1 killed · deferred 3')).toBe(true);
		expect(has(BOOT, '## Board — BOARD.md · The gates: 2 charges · 1 live · 1 landed · 0 killed · deferred 3')).toBe(true);
	});

	test('two boards in one doc name their headings; one board names the file alone', () => {
		expect(has(BARE, '## Board — BOARD.md: 2 charges · 1 live · 1 landed · 0 killed · deferred —')).toBe(true);
	});

	test('the tail is the entry verbatim, and the baton line is the parser\'s reading of it', () => {
		const tail = parse(BOOT).ledgerTail!;
		const pack = bootPack(BOOT);
		expect(pack).toContain(tail.block.replace(/^\n+|\n+$/g, ''));
		expect(has(BOOT, '## Ledger — LEDGER.md: 2 entries')).toBe(true);
		expect(has(BOOT, 'Baton — ⬡ · single · mental → ignite 003')).toBe(true);
	});

	test('the queue is the decisions waiting on his pen, id and title', () => {
		expect(has(BOOT, '## Decisions — DECISIONS.md: 3 entries · queue 2')).toBe(true);
		expect(has(BOOT, '- D2 — The arms run serial')).toBe(true);
		expect(has(BOOT, '- D3 — The gate reviews both arms')).toBe(true);
	});

	test('an inbox entry is its own first line', () => {
		expect(has(BOOT, '## Inbox — ISSUES.md: 2 entries')).toBe(true);
		expect(has(BOOT, '- 2026-09-02 · Felix · the pack printed a row the board had already killed')).toBe(true);
	});

	test('a building with no ledger, register or inbox prints the typed absences', () => {
		expect(has(BARE, '## Ledger — none')).toBe(true);
		expect(has(BARE, '## Decisions — none')).toBe(true);
		expect(has(BARE, '## Inbox — none')).toBe(true);
		expect(bootPack(BARE)).not.toContain('Baton —');
	});

	test('a root the walk finds no artifact in is refused, never rendered', () => {
		expect(() => bootPack(join(FX, 'boot', 'nothing-here'))).toThrow();
		expect(() => bootPack(join(import.meta.dir))).toThrow(/not a building/);
	});

	// The verbatim law, mechanized. The exempt lines are the pack's own six shapes; everything
	// else must be findable, byte for byte, in a file under the root — and the one line built
	// from two slices (the decision queue) is held to the law twice, once per slice.
	test('the verbatim law — nothing in the pack is authored', () => {
		for (const root of [BOOT, BARE]) {
			const corpus = readdirSync(root).filter(f => f.endsWith('.md')).map(f => readFileSync(join(root, f), 'utf8'));
			const inCorpus = (s: string) => corpus.some(md => md.includes(s));
			const queue = new Map(parse(root).decisionQueue.map(d => [`- ${d.id} — ${d.title}`, d]));

			for (const line of lines(root)) {
				if (!line.trim() || line.startsWith('#') || line.startsWith('Baton — ')
					|| line.startsWith('Statement: ') || line.startsWith('Lint: ')) continue;
				const d = queue.get(line);
				if (d) { expect(inCorpus(d.id)).toBe(true); expect(inCorpus(d.title)).toBe(true); continue; }
				expect({ root, line, verbatim: inCorpus(line) }).toEqual({ root, line, verbatim: true });
			}
		}
	});
});
