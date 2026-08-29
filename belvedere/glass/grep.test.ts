// B21 — the Grep's pure core, and one end-to-end query over a fixture corpus.
//
// Everything server-shaped that a browser would have to prove lives in `lab/b21/probe.ts` (B15 F4's
// law: a second city fixture in `bun test` decides `deck.test.ts`'s results). What is here is what a
// suite can hold: the case-smart rule, the mark, the bounds, the byte offset the fallback computes —
// and the whole route, run against a world handed in rather than read off the live register.

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { around, turnsOf, windowOf } from './chat';
import type { CensusRead } from './census';
import {
	clipAround, docFiles, findTerm, grepQuery, insensitiveFor, LIMITS, offsetOfLine, readTerm, rgAvailable, sized,
	type GrepWorld,
} from './grep';
import type { Entry } from './register';
import type { Rig } from './rig';

// ---------- the fixture: three tiny corpora, all under one temp root ----------

const ROOT = mkdtempSync(join(tmpdir(), 'b21-'));
const ACCOUNT = join(ROOT, 'acct');
const CITY = join(ROOT, 'city');
const DESK = join(ROOT, 'desk');
const SID = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
const TRANSCRIPT = join(ACCOUNT, 'projects', '-fixture', `${SID}.jsonl`);
const BOARD = join(CITY, 'nb', 'README.md');
const HUGE = join(CITY, 'nb', 'HUGE.md');

const user = (text: string) =>
	JSON.stringify({ type: 'user', isSidechain: false, timestamp: '2026-08-28T10:00:00.000Z', message: { role: 'user', content: text } });
const says = (text: string) =>
	JSON.stringify({ type: 'assistant', isSidechain: false, timestamp: '2026-08-28T10:00:01.000Z', message: { model: 'claude-sonnet-4-5', content: [{ type: 'text', text }] } });

beforeAll(() => {
	mkdirSync(join(ACCOUNT, 'projects', '-fixture'), { recursive: true });
	mkdirSync(join(CITY, 'nb'), { recursive: true });
	mkdirSync(DESK, { recursive: true });
	writeFileSync(TRANSCRIPT, [
		JSON.stringify({ type: 'agent-name', agentName: 'builder-fixture-01', sessionId: SID }),
		user('the first thing I said'),
		says('an answer'),
		user('and then I asked about bob summons, which is the point'),
		says('another answer'),
	].join('\n') + '\n');
	writeFileSync(BOARD, '# nb\n\nrow B18 mentions bob summons on this line\n\nand nothing else does\n');
	writeFileSync(HUGE, 'bob summons\n'.repeat(2));
	writeFileSync(join(DESK, '2026-08-28-01.md'), 'a note about bob summons\n\nthe body of it\n');
	process.env['DESK_DIR'] = DESK;
});

afterAll(() => {
	delete process.env['DESK_DIR'];
	delete process.env['GREP_RG'];
	delete process.env['GREP_TIMEOUT_MS'];
	rmSync(ROOT, { recursive: true, force: true });
});

const entry = (): Entry => ({
	building: 'nb', path: join(CITY, 'nb'),
	files: { boards: [BOARD], ledger: null, decisions: null, issues: null, workDocs: [], prose: [] },
});

const world = (): GrepWorld => ({
	rig: { accounts: new Map([[ACCOUNT, 'fixture']]), colours: new Map(), tiers: new Map(), mantles: [] } as Rig,
	census: { present: false, sessions: [], beats: 0, malformed: 0, since: null } as CensusRead,
	entries: [entry()],
});

const ask = (q: string) => grepQuery(new URLSearchParams({ q }), world());

// ---------- the rules ----------

describe('case-smart, spelled out because two engines must agree on it', () => {
	test('a term in all lower case asks for either case; a capital means it', () => {
		expect(insensitiveFor('bob summons')).toBe(true);
		expect(insensitiveFor('b21')).toBe(true);
		expect(insensitiveFor('B18')).toBe(false);
		expect(insensitiveFor('Felix')).toBe(false);
	});

	test('the mark follows the same rule, and a fold that changes length marks nothing', () => {
		expect(findTerm('the B18 row', 'b18', true)).toBe(4);
		expect(findTerm('the B18 row', 'b18', false)).toBe(-1);
		// `İ` lower-cases to two code units, so a lower-cased copy cannot index the original: rather
		// than mark the wrong span, the hit renders unmarked.
		expect(findTerm('İstanbul and b18', 'b18', true)).toBe(-1);
	});
});

describe('the clip: a result row is one line of a pane, not a transcript record', () => {
	test('the window is centred on the term and says where bytes came off', () => {
		const long = 'x'.repeat(400) + 'NEEDLE' + 'y'.repeat(400);
		const c = clipAround(long, 400, 6);
		expect(c.text.length).toBeLessThanOrEqual(LIMITS.clip + 2);
		expect(c.text.startsWith('…')).toBe(true);
		expect(c.text.endsWith('…')).toBe(true);
		expect(c.text.slice(c.mark!.at, c.mark!.at + c.mark!.len)).toBe('NEEDLE');
	});

	test('a line with no match clips from the start and marks nothing', () => {
		const c = clipAround('a short line', -1, 3);
		expect(c.mark).toBeNull();
		expect(c.text).toBe('a short line');
	});

	test('tabs are flattened, so a hit line cannot widen the drawer', () => {
		expect(clipAround('a\tb', 0, 1).text).toBe('a b');
	});
});

describe('the bounds, each of them reported rather than silent', () => {
	test('a term shorter than the floor or longer than the ceiling searches nothing', () => {
		expect(readTerm('a').ok).toBe(false);
		expect(readTerm('  ').ok).toBe(false);
		expect(readTerm('x'.repeat(LIMITS.term.max + 1)).ok).toBe(false);
		expect(readTerm(' bob summons ')).toEqual({ ok: true, term: 'bob summons' });
	});

	test('the size bar skips rather than reads, and the skip is counted', () => {
		const all = sized([TRANSCRIPT, BOARD, join(ROOT, 'nothing-here')]);
		expect(all.files.length).toBe(2);
		expect(all.skipped).toBe(0);          // nothing in the fixture is over the bar
		expect(all.capped).toBe(false);
		// A missing file is not a skip: it is not in the corpus at all.
		expect(all.files.map(f => f.path).sort()).toEqual([BOARD, TRANSCRIPT].sort());
	});

	test('a refused query answers three empty groups and its reason, and runs no engine', async () => {
		const a = await grepQuery(new URLSearchParams({ q: 'x' }), world());
		expect(a.refusal).toContain('at least');
		expect(a.groups.map(g => g.hits.length)).toEqual([0, 0, 0]);
		expect(a.ms).toBe(0);
	});
});

describe('the corpus: the register\'s own file list, and who owns each file', () => {
	test('every artifact a building declares is in it, once, with its building', () => {
		const { paths, owner } = docFiles([entry()]);
		expect(paths).toEqual([BOARD]);
		expect(owner.get(BOARD)?.building).toBe('nb');
	});
});

describe('the byte offset a grep hit does not carry', () => {
	test('offsetOfLine agrees with the file, line for line', () => {
		expect(offsetOfLine(TRANSCRIPT, 1)).toBe(0);
		const raw = readFileSync(TRANSCRIPT);
		let at = 0;
		for (let line = 1; line <= 5; line++) {
			expect(offsetOfLine(TRANSCRIPT, line)).toBe(at);
			at = raw.indexOf(0x0a, at) + 1;
		}
	});

	test('a line past the end of the file answers null rather than a guess', () => {
		expect(offsetOfLine(TRANSCRIPT, 9999)).toBeNull();
	});
});

// ---------- the whole route ----------

describe('one query, three groups', () => {
	test('the commissioning shape: a session, a doc and a note, each carrying its own jump', async () => {
		const a = await ask('bob summons');
		const [sessions, docs, desk] = a.groups;
		expect(a.refusal).toBeNull();
		expect(a.insensitive).toBe(true);

		expect(sessions!.hits.length).toBe(1);
		const hit = sessions!.hits[0]!;
		expect(hit.jump).toEqual({ to: 'session', sid: SID, anchor: expect.any(Number) });
		expect(hit.name).toBe('builder-fixture-01');
		expect(hit.text.slice(hit.mark!.at, hit.mark!.at + hit.mark!.len).toLowerCase()).toBe('bob summons');

		expect(docs!.hits.length).toBe(1);
		expect(docs!.hits[0]!.jump).toEqual({ to: 'doc', building: 'nb', path: BOARD, line: 3 });

		expect(desk!.hits.length).toBe(1);
		expect(desk!.hits[0]!.jump).toEqual({ to: 'note', slug: '2026-08-28-01' });
		expect(desk!.hits[0]!.name).toBe('a note about bob summons');
	});

	test('the session hit\'s anchor IS the byte offset of the turn it belongs to', async () => {
		const a = await ask('bob summons');
		const anchor = (a.groups[0]!.hits[0]!.jump as { anchor: number }).anchor;
		const w = windowOf(TRANSCRIPT, null, 1 << 20)!;
		const turns = turnsOf(w, CITY, anchor);
		const landed = around(turnsOf(w, CITY), anchor).filter(t => t.key <= anchor).at(-1)!;
		expect(turns.some(t => t.key === landed.key)).toBe(true);
		expect(landed.role).toBe('user');
		expect(JSON.stringify(landed.blocks)).toContain('bob summons');
	});

	test('a capital in the term makes the search case-sensitive, end to end', async () => {
		expect((await ask('BOB SUMMONS')).groups.every(g => g.hits.length === 0)).toBe(true);
		expect((await ask('bob SUMMONS')).groups.every(g => g.hits.length === 0)).toBe(true);
		expect((await ask('bob summons')).groups.some(g => g.hits.length > 0)).toBe(true);
	});

	test('the per-file cap holds: one chatty file cannot fill the answer on its own', async () => {
		writeFileSync(HUGE, 'bob summons\n'.repeat(LIMITS.perFile + 5));
		const docsWithHuge: GrepWorld = { ...world(), entries: [{
			...entry(), files: { ...entry().files, boards: [BOARD, HUGE] },
		}] };
		const a = await grepQuery(new URLSearchParams({ q: 'bob summons' }), docsWithHuge);
		const fromHuge = a.groups[1]!.hits.filter(h => h.where.includes('HUGE'));
		expect(fromHuge.length).toBe(LIMITS.perFile);
	});

	test('the clock is a bound like any other: it fires, and the group says so', async () => {
		// The old version asserted every group timed out against a fixture too small to promise
		// it — on an idle machine a tiny corpus can finish inside 1 ms, so the assertion raced the
		// clock and lost about once in six whole-suite runs (measured, C2's field report). The bound
		// is the rule, not the race: a group that DID finish inside the clock is legal, one that did
		// not says so honestly (0 hits, no error) — and at least one group has to actually prove the
		// timeout path fires, or the assertion is vacuous. Here the docs corpus carries an extra file
		// with no match in it at all, sized (~17 MB, under the 20 MB file-size bar) so the engine must
		// read the whole thing before it can conclude there is nothing to report: measured at 7-19 ms
		// a run, twenty times the 1 ms clock, on the very machine that raced. It stands ALONE in its
		// group's corpus — `rg` parallelises across multiple files, so a fast tiny match sitting
		// beside it (BOARD) streams out before the slow file's own kill lands, which is a real result
		// and not the thing this probe is measuring.
		const SLOW = join(CITY, 'nb', 'SLOW.md');
		writeFileSync(SLOW, 'filler line, no match anywhere in this file\n'.repeat(400_000));
		const slow: GrepWorld = { ...world(), entries: [{
			...entry(), files: { ...entry().files, boards: [SLOW] },
		}] };

		process.env['GREP_TIMEOUT_MS'] = '1';
		const a = await grepQuery(new URLSearchParams({ q: 'bob summons' }), slow);
		delete process.env['GREP_TIMEOUT_MS'];

		for (const g of a.groups) {
			if (!g.timedOut) continue;
			expect(g.hits.length).toBe(0);
			expect(g.error).toBeNull();
		}
		expect(a.groups.some(g => g.timedOut)).toBe(true);
	});

	test('with no rg on PATH the fallback runs and NAMES its degradation (spec §2)', async () => {
		expect(rgAvailable()).toBe(true);
		process.env['GREP_RG'] = 'rg-that-is-not-installed';
		expect(rgAvailable()).toBe(false);
		const a = await ask('bob summons');
		delete process.env['GREP_RG'];
		expect(a.engine).toBe('grep');
		expect(a.degraded).toContain('grep');
		// The same hits, and the session hit still carries an anchor — computed by re-reading the
		// file, because `grep` reports a line number and the Chat anchors on a byte offset.
		expect(a.groups[0]!.hits.length).toBe(1);
		expect((a.groups[0]!.hits[0]!.jump as { anchor: number }).anchor).toBeGreaterThan(0);
		expect(a.groups[1]!.hits[0]!.jump).toEqual({ to: 'doc', building: 'nb', path: BOARD, line: 3 });
	});
});

describe('the anchored window (B16\'s reader, given a target)', () => {
	const turn = (key: number) => ({ key, role: 'user' as const, at: null, blocks: [], folded: 0 });

	test('with no target the tail survives, exactly as it always did', () => {
		const all = Array.from({ length: 100 }, (_, i) => turn(i));
		expect(around(all, null).map(t => t.key)).toEqual(all.slice(-40).map(t => t.key));
	});

	test('with a target the window is centred on it, so the hit is never sliced away', () => {
		const all = Array.from({ length: 100 }, (_, i) => turn(i * 10));
		const got = around(all, 105);          // between turn 100 and turn 110 — it belongs to 100
		expect(got.length).toBe(40);
		expect(got.some(t => t.key === 100)).toBe(true);
		expect(got[0]!.key).toBe(0);           // clamped at the head rather than running off it
	});

	test('a target before every turn takes the head, never an empty window', () => {
		const all = Array.from({ length: 100 }, (_, i) => turn(1000 + i));
		expect(around(all, 5)[0]!.key).toBe(1000);
	});
});
