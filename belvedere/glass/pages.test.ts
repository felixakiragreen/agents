// The City View's two orders, tested where a wrong answer is invisible: the neighbourhood a
// building is drawn under, and what puts it at the top of one.
//
// **Attention decides across groups; recency only ever orders inside one** (design law, README §3).
// The failure this pins is the quiet one — a sort where a building somebody edited five minutes ago
// climbs over the building holding a Felix-gate, which is a rail that hides the ask.

import { expect, test, describe } from 'bun:test';
import { attentionOf, groupLabel, groupOf, OUTSIDE } from './pages';
import type { Building } from '../../doctrine';

const building = (over: Partial<Building> = {}): Building => ({
	building: 'agents', path: '/Users/felix/code/agents',
	board: [], decisionQueue: [], issues: [], kickoffs: [], fails: [],
	files: { boards: [], ledger: null, decisions: null, issues: null, workDocs: [] },
	ledgerTail: null, baton: null,
	...over,
});

const row = (over: Partial<Building['board'][number]['rows'][number]> = {}) => ({
	id: 'B1', work: 'a row', workDoc: null, dependsOn: [], gates: [], mantle: null, tier: null,
	rider: null, felixGate: false, state: 'OPEN' as const, annotation: '', line: 1, raw: '', cells: [],
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

	test("a Felix-gate, a pending countersign, a BLOCKED row and his baton all rank as his pen", () => {
		expect(attentionOf(building({ board: [board([row({ felixGate: true })])] }), 0)).toBe(1);
		expect(attentionOf(building({ board: [board([row({ gates: ['visual pass'] })])] }), 0)).toBe(1);
		expect(attentionOf(building({ board: [board([row({ state: 'BLOCKED' })])] }), 0)).toBe(1);
		expect(attentionOf(building({ baton: { holder: 'felix', text: 'his', instruments: [] } }), 0)).toBe(1);
		expect(attentionOf(building({ decisionQueue: [{ id: 'D1', date: '2026-08-27', decider: 'Architect',
			title: 't', body: 't', pending: true, ratified: false, line: 1 }] }), 0)).toBe(1);
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
