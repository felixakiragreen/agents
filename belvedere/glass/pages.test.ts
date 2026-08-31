// The City View's two orders, tested where a wrong answer is invisible: the neighbourhood a
// building is drawn under, and what puts it at the top of one.
//
// **Attention decides across groups; recency only ever orders inside one** (design law, README §3).
// The failure this pins is the quiet one — a sort where a building somebody edited five minutes ago
// climbs over the building holding a Felix-gate, which is a rail that hides the ask.

import { expect, test, describe } from 'bun:test';
import { attentionOf, buildingOf, groupLabel, groupOf, homeOf, OUTSIDE, staffing } from './pages';
import type { BoardRow, Building } from '../../doctrine';

const building = (over: Partial<Building> = {}): Building => ({
	building: 'agents', path: '/Users/felix/code/agents',
	board: [], decisionQueue: [], issues: [], kickoffs: [], fails: [],
	files: { boards: [], ledger: null, decisions: null, issues: null, workDocs: [], prose: [] },
	ledgerTail: null, baton: null, ledgerEntries: 0, decisions: 0,
	...over,
});

const row = (over: Partial<Building['board'][number]['rows'][number]> = {}) => ({
	id: 'B1', work: 'a row', workDoc: null, dependsOn: [], gates: [], mantle: null, tier: null,
	rider: null, hexGate: false, dissolved: false, state: 'OPEN' as const, annotation: '', line: 1, raw: '', cells: [],
	...over,
});

const board = (rows: ReturnType<typeof row>[]): Building['board'][number] =>
	({ heading: 'The board', file: '/Users/felix/code/agents/README.md', line: 1, rows } as Building['board'][number]);

describe('groupOf — the neighbourhood', () => {
	const city = process.env.GLASS_CITY ?? '/Users/felix/code';

	test('a building and its sub-building share one `~/code/<x>`', () => {
		expect(groupOf(`${city}/agents`)).toBe('agents');
		expect(groupOf(`${city}/agents/belvedere`)).toBe('agents');
	});

	test('a worktree checkout groups with its repo, because the path still starts there', () => {
		expect(groupOf(`${city}/agents/.claude/worktrees/bv/b9-visual/belvedere`)).toBe('agents');
	});

	test('a path the city does not contain is named, never mis-housed', () => {
		expect(groupOf('/tmp/somewhere')).toBe(OUTSIDE);
		expect(groupLabel(OUTSIDE)).toBe(OUTSIDE);
	});

	test('the group reads as Felix writes it — `~/code/<x>`, not an absolute path', () => {
		expect(groupLabel('agents')).toMatch(/^~\/.*\/agents$/);
		expect(groupLabel('agents')).not.toContain('/Users/');
	});
});

describe('attentionOf — what a building wants, before how fresh it is', () => {
	test('a live session outranks everything: work is happening there now', () => {
		expect(attentionOf(building(), 3)).toBe(0);
	});

	test("a ⬡-gate, a pending blessing, a BLOCKED charge and his baton all rank as his pen", () => {
		expect(attentionOf(building({ board: [board([row({ hexGate: true })])] }), 0)).toBe(1);
		expect(attentionOf(building({ board: [board([row({ gates: ['visual pass'] })])] }), 0)).toBe(1);
		expect(attentionOf(building({ board: [board([row({ state: 'BLOCKED' })])] }), 0)).toBe(1);
		expect(attentionOf(building({ baton: { holder: 'felix', text: 'his', instruments: [] } }), 0)).toBe(1);
		expect(attentionOf(building({ decisionQueue: [{ id: 'D1', date: '2026-08-27', decider: 'Architect',
			title: 't', body: 't', pending: true, blessed: false, line: 1 }] }), 0)).toBe(1);
	});

	test('a session baton or an IN FLIGHT row is in play — below his pen, above the quiet', () => {
		expect(attentionOf(building({ baton: { holder: 'session', text: 'go', instruments: [] } }), 0)).toBe(2);
		expect(attentionOf(building({ board: [board([row({ state: 'IN FLIGHT' })])] }), 0)).toBe(2);
	});

	test('a quiet building with a landed board is last, and lint still beats silence', () => {
		expect(attentionOf(building({ board: [board([row({ state: 'LANDED' })])] }), 0)).toBe(4);
		expect(attentionOf(building({ fails: [{ artifact: 'board', code: 'X', reason: 'r', excerpt: 'e',
			file: 'f', line: 1 }] as Building['fails'] }), 0)).toBe(3);
	});
});

describe('staffing — D71\'s three cells, each in its own word (C19 F3)', () => {
	// A shelved charge writes `OPEN — DEFERRED …`, so the state leads and the shelving rides the
	// annotation; the dissolution is a field of its own (`dissolved`) and this reads that field.
	test('a dissolved staffing writes the board\'s own word, never the unreadable mark', () => {
		const cell = staffing(row({ state: 'OPEN', dissolved: true }) as BoardRow);
		expect(cell).toContain('—');
		expect(cell).not.toContain('bad');
	});

	test('`?` stays reserved for a cell nobody could read', () => {
		expect(staffing(row() as BoardRow)).toContain('<span class="bad">?</span>');
	});

	test('a ⬡-gate is neither', () => {
		expect(staffing(row({ hexGate: true }) as BoardRow)).toContain('⬡-gate');
	});
});

/**
 * §the ignited-for join (B22 candidate 6). "The building the work is FOR" and "the directory the
 * session sits IN" are two facts, and the census only ever knew the second — which is how
 * `architect-belvedere-04` came to be housed under `agents` while everything about it said
 * `agents/belvedere`.
 */
describe('homeOf — the ignited-for building outranks the cwd, and only for what Belvedere ignited', () => {
	const buildings = [
		{ building: 'agents', path: '/Users/felix/code/agents' },
		{ building: 'agents/belvedere', path: '/Users/felix/code/agents/belvedere' },
	];
	const REPO_ROOT = '/Users/felix/code/agents';

	test('a Belvedere-ignited session at the repo root houses under the building it was ignited FOR', () => {
		const homes = new Map([['architect-belvedere-04', 'agents/belvedere']]);
		const s = { cwd: REPO_ROOT, stamp: 'architect-belvedere-04' };
		expect(buildingOf(s.cwd, buildings)?.building).toBe('agents');            // what it used to say
		expect(homeOf(s, buildings, homes)?.building).toBe('agents/belvedere');   // what it says now
	});

	test('a hand-started session in the SAME cwd still houses by cwd — the control', () => {
		const homes = new Map([['architect-belvedere-04', 'agents/belvedere']]);
		expect(homeOf({ cwd: REPO_ROOT, stamp: 'mentat-01' }, buildings, homes)?.building).toBe('agents');
		expect(homeOf({ cwd: REPO_ROOT, stamp: null }, buildings, homes)?.building).toBe('agents');
		expect(homeOf({ cwd: REPO_ROOT, stamp: 'mentat-01' }, buildings, new Map())?.building).toBe('agents');
	});

	test('an ignited-for building the register does not carry falls back rather than vanishing', () => {
		// The register decides what a building is (D65). A name it does not know is not a home.
		const homes = new Map([['builder-ghost-01', 'somewhere/that-was-deleted']]);
		expect(homeOf({ cwd: REPO_ROOT, stamp: 'builder-ghost-01' }, buildings, homes)?.building).toBe('agents');
	});

	test('no cwd and no ignition is no home at all — off the register, honestly', () => {
		expect(homeOf({ cwd: null, stamp: 'mentat-01' }, buildings, new Map())).toBeNull();
	});
});
