/**
 * **The audit anchor** — the suite's own proof that a full run leaves the city's live audit
 * byte-identical (B22 candidate 4).
 *
 * The measurement this file replaces could not be written: `bun test` runs every file in one
 * process but each file sets and restores `$CENSUS_DIR` itself, so no `afterAll` anywhere speaks
 * for the whole run. What can be asserted is the interlock that makes the write impossible —
 * `hands.ts` §the live-neighbourhood interlock — and that is what is measured here, both ways:
 * the live path throws, a scratch path writes.
 *
 * The two incidents behind it: B8 F1 (`hands.test.ts` armed the real HALT and left 16 lines in the
 * real `hands.jsonl`) and this row (`desk.test.ts` filed scratch-building notes through `filed()`,
 * which audits — 240 → 242 lines at G2, two more during the C19 two-lane batch).
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { audit, halt, interlock } from './hands';
import { auditLog, haltFlag, LIVE_CENSUS } from './paths';

const ROOT = mkdtempSync(join(tmpdir(), 'b22-anchor-'));
const saved = process.env.CENSUS_DIR;

beforeAll(() => { process.env.CENSUS_DIR = join(ROOT, 'census'); });
afterAll(() => {
	if (saved === undefined) delete process.env.CENSUS_DIR; else process.env.CENSUS_DIR = saved;
	rmSync(ROOT, { recursive: true, force: true });
});

describe('the audit anchor', () => {
	test('an anchored suite writes its own audit, and the live one is somewhere else entirely', () => {
		audit('b22-anchor', { probe: true }, { ok: true, result: 'scratch' });
		expect(auditLog().startsWith(ROOT)).toBe(true);
		expect(readFileSync(auditLog(), 'utf8')).toContain('b22-anchor');
		expect(auditLog().startsWith(LIVE_CENSUS)).toBe(false);
	});

	test('the interlock refuses a write aimed at the live neighbourhood, and names the knob', () => {
		expect(() => interlock(join(LIVE_CENSUS, 'hands.jsonl'))).toThrow('CENSUS_DIR');
		expect(() => interlock(join(ROOT, 'census/hands.jsonl'))).not.toThrow();
		// It is a test-run guard, not a fence: the hands write where they always did in the server.
		const was = process.env.NODE_ENV;
		process.env.NODE_ENV = 'production';
		try { expect(() => interlock(join(LIVE_CENSUS, 'hands.jsonl'))).not.toThrow(); }
		finally { process.env.NODE_ENV = was; }
	});

	test('the two measured doors are both interlocked: the audit, and the HALT flag', () => {
		const live = { census: process.env.CENSUS_DIR };
		const before = existsSync(join(LIVE_CENSUS, 'hands.jsonl')) ? statSync(join(LIVE_CENSUS, 'hands.jsonl')).size : -1;
		delete process.env.CENSUS_DIR;                                  // exactly what a forgetful suite does
		try {
			expect(auditLog()).toBe(join(LIVE_CENSUS, 'hands.jsonl'));
			expect(() => audit('would-have-landed-live', {}, { ok: true, result: '' })).toThrow('CENSUS_DIR');
			// B8 F1's own door: `~/code/agents/summon/log/HALT`, one `writeFileSync` from any suite
			// that imports `hands.ts`. `attemptHalt` turns its own interlock into a refusal value,
			// and then the audit's interlock throws — the flag is unwritten either way, which is
			// the property that matters.
			expect(() => halt({ requester: 'b22-anchor' })).toThrow('CENSUS_DIR');
			expect(existsSync(haltFlag())).toBe(false);
		} finally { process.env.CENSUS_DIR = live.census; }
		const after = existsSync(join(LIVE_CENSUS, 'hands.jsonl')) ? statSync(join(LIVE_CENSUS, 'hands.jsonl')).size : -1;
		expect(after).toBe(before);                                     // byte-identical, measured across the attempt
	});
});
