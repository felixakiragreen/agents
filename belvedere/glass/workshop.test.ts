// The Workshop's testable half: the section order and collapse (a boundary the browser writes),
// the prose parser that turns the corpus into spans, and the one building `deckState` opens.
//
// What is NOT here is the pane — a click, a drag, a `scrollIntoView` and a marked line are browser
// facts, and a fake DOM would only prove the fake (B13 F1). Those ride `lab/b15/probe.ts`, which
// drives real Chrome against a real server and a real fixture city.

import { expect, test, describe } from 'bun:test';
import { join } from 'path';
import { discover } from '../../doctrine';
import type { Beat, Session } from './census';
import { SECTIONS, moved, toCollapsed, toSections, type Section } from './deck-model';
import { deckSession } from './deck';
import { prose, spans } from './html';
import { workshopOf } from './workshop';

const NO_BADGES = { waiting: 0, gate: 0, countersign: 0, escalation: 0 };

// ---------- the sections: his order, remembered ----------

describe('the section order — LIVE SESSIONS first, and his to move (field report)', () => {
	test('the default order leads with live sessions', () => {
		expect(SECTIONS[0]).toBe('sessions');
		expect([...SECTIONS]).toEqual(['sessions', 'board', 'ledger', 'decisions', 'issues']);
	});

	test('what the Workshop writes, it reads back', () => {
		const shuffled: Section[] = ['issues', 'sessions', 'ledger', 'board', 'decisions'];
		expect(toSections(JSON.parse(JSON.stringify(shuffled)))).toEqual(shuffled);
	});

	test('anything that is not a PERMUTATION is no memory at all — a subset would hide a section', () => {
		expect(toSections(['sessions'])).toBeNull();                                   // short
		expect(toSections(['sessions', 'sessions', 'board', 'ledger', 'issues'])).toBeNull();  // duplicate
		expect(toSections(['sessions', 'board', 'ledger', 'decisions', 'nope'])).toBeNull();
		expect(toSections('sessions,board')).toBeNull();
		expect(toSections(null)).toBeNull();
	});

	test('the collapsed set drops what it does not know rather than refusing the whole memory', () => {
		expect(toCollapsed(['board', 'nope', 7])).toEqual(['board']);
		expect(toCollapsed([])).toEqual([]);
		expect(toCollapsed({})).toBeNull();
	});

	test('moving is by one place and clamps at both ends — the drag and the buttons share it', () => {
		const o = [...SECTIONS];
		expect(moved(o, 'board', -1)).toEqual(['board', 'sessions', 'ledger', 'decisions', 'issues']);
		expect(moved(o, 'sessions', -1)).toBe(o);          // already first: the same array, untouched
		expect(moved(o, 'issues', 1)).toBe(o);             // already last
		expect(moved(o, 'sessions', 4)).toEqual(['board', 'ledger', 'decisions', 'issues', 'sessions']);
	});

	test('every move is still a permutation, so a reorder can never lose a section', () => {
		let o = [...SECTIONS];
		for (const d of [1, 1, -1, 3, -2, 4]) o = moved(o, o[0]!, d);
		expect([...o].sort()).toEqual([...SECTIONS].sort());
	});
});

// ---------- prose into spans: the field report's third item, at the boundary ----------

describe('spans — the corpus, parsed once server-side', () => {
	const yes = () => true;
	const no = () => false;

	test('plain prose is one text span and nothing else', () => {
		expect(spans('just words', '/base', no)).toEqual([{ kind: 'text', text: 'just words' }]);
	});

	test('a markdown link resolves for the viewer; a scheme leaves the city', () => {
		expect(spans('see [the board](README.md) now', '/base', yes)).toEqual([
			{ kind: 'text', text: 'see ' },
			{ kind: 'doc', text: 'the board', path: '/base/README.md', line: null },
			{ kind: 'text', text: ' now' },
		]);
		expect(spans('[cmux](https://example.test/x)', '/base', yes)).toEqual([
			{ kind: 'url', text: 'cmux', href: 'https://example.test/x' },
		]);
	});

	test('a bare `path:line` becomes a reference — the field report\'s own example', () => {
		// *"Links to documents (WHERE: agents/LEDGER.md:385) don't take you to that line"*.
		expect(spans('WHERE: agents/LEDGER.md:385', '/base', yes)).toEqual([
			{ kind: 'text', text: 'WHERE: ' },
			{ kind: 'doc', text: 'agents/LEDGER.md:385', path: '/base/agents/LEDGER.md', line: 385 },
		]);
	});

	test('and a reference the filesystem cannot find stays TEXT — never a link that lies (D10)', () => {
		expect(spans('WHERE: agents/LEDGER.md:385', '/base', no))
			.toEqual([{ kind: 'text', text: 'WHERE: agents/LEDGER.md:385' }]);
	});

	test('a bare path with NO line is a mention, not a link — the rule is deliberately narrow', () => {
		expect(spans('see README.md for more', '/base', yes))
			.toEqual([{ kind: 'text', text: 'see README.md for more' }]);
	});

	test('a code tick around a reference does not stop it being one, and leaves no orphan ticks', () => {
		// The doctrine writes nearly every path in ticks, so the unquoted-only reading would miss
		// most of the corpus — and letting the bare rule win the overlap would strand the backticks.
		expect(spans('at `LEDGER.md:385` exactly', '/base', yes)).toEqual([
			{ kind: 'text', text: 'at ' },
			{ kind: 'doc', text: 'LEDGER.md:385', path: '/base/LEDGER.md', line: 385 },
			{ kind: 'text', text: ' exactly' },
		]);
		expect(spans('at `bun test` exactly', '/base', yes)).toEqual([
			{ kind: 'text', text: 'at ' },
			{ kind: 'code', text: 'bun test' },
			{ kind: 'text', text: ' exactly' },
		]);
	});

	test('bold survives, and every span run rebuilds the original text', () => {
		const md = 'the **loud** part links [here](x.md) and cites `y.md:9` — done';
		const out = spans(md, '/base', yes);
		expect(out.some(s => s.kind === 'strong')).toBe(true);
		// Nothing is dropped and nothing is invented: the visible text is the markdown's own.
		expect(out.map(s => s.text).join('')).toBe('the loud part links here and cites y.md:9 — done');
	});

	test('prose carries the encapsulation-first name beside the spans (design law)', () => {
		const p = prose('B15: the Workshop — one building, inside', '/base');
		expect(p.encapsulated).toBe(true);
		expect(p.name).toBe('B15: the Workshop');
		expect(prose('a line with no seam at all', '/base').encapsulated).toBe(false);
	});
});

// ---------- one building, opened ----------

describe('workshopOf — the five sections, over a real parse', () => {
	const CITY = join(import.meta.dir, '../lab/b15/city');
	const buildings = discover([CITY], [CITY]);
	const name = buildings.find(b => b.building.endsWith('nb/workshop'))!.building;
	const w = workshopOf(buildings, name, NO_BADGES)!;

	test('a name the register does not carry answers null, never a guess', () => {
		expect(workshopOf(buildings, 'no/such/building', NO_BADGES)).toBeNull();
	});

	test('the board arrives row by row, each with its own state, staffing and place in the file', () => {
		expect(w.boards.length).toBe(1);
		expect(w.boards[0]!.rows.map(r => r.id)).toEqual(['W1', 'W2', 'W3', 'W4', 'W5']);
		expect(w.boards[0]!.rows.map(r => r.state)).toEqual(['OPEN', 'IN FLIGHT', 'LANDED', 'OPEN', null]);
		expect(w.boards[0]!.rows[0]!.staffing).toBe('Builder · opus-high');
		expect(w.boards[0]!.rows[0]!.ref.line).toBeGreaterThan(0);
		expect(w.boards[0]!.rows[0]!.workDoc!.path.endsWith('plans/w1-open.md')).toBe(true);
	});

	test('a Felix-gate is carried as the gate it is, and never as staffing', () => {
		expect(w.boards[0]!.rows[3]!.gates).toEqual(['the fixture visual pass']);
	});

	test('parser-as-lint: an untypeable status is pinned to its own row, not swallowed', () => {
		expect(w.boards[0]!.rows[4]!.state).toBeNull();
		expect(w.boards[0]!.rows[4]!.lint.join(' ')).toContain('board.state');
		expect(w.lint).toBe(0);                     // every failure is on a row; nothing is left over
	});

	test('a landing record’s `LEDGER.md:385` is a reference the viewer can open ON the line', () => {
		const ref = w.boards[0]!.rows[2]!.annotation.spans.find(s => s.kind === 'doc');
		expect(ref).toBeDefined();
		expect(ref!.kind === 'doc' && ref!.line).toBe(385);
		expect(ref!.kind === 'doc' && ref!.path.endsWith('nb/workshop/LEDGER.md')).toBe(true);
	});

	test('the ledger tail is the last entry, with its baton, its decided clause and its line', () => {
		expect(w.tail!.mantle).toBe('Architect');
		expect(w.tail!.tier).toBe('fable-high');
		expect(w.tail!.baton!.holder).toBe('felix');
		expect(w.tail!.decided!.spans.map(s => s.text).join('')).toContain('the fixture is enough');
		expect(w.tail!.ref.line).toBeGreaterThan(370);
	});

	test('the decision queue carries B6’s three-state countersign, read off the files', () => {
		expect(w.decisions.map(d => d.id)).toEqual(['D1']);
		expect(w.decisions[0]!.state).toBe('pending');
	});

	test('the inbox arrives as entries, and its own reference resolves too', () => {
		expect(w.issues.length).toBe(2);
		const ref = w.issues[0]!.text.spans.find(s => s.kind === 'doc');
		expect(ref!.kind === 'doc' && ref!.line).toBe(385);
	});

	test('every section names the file it came from, so the viewer always has somewhere to open', () => {
		expect(w.files.ledger!.label.endsWith('LEDGER.md')).toBe(true);
		expect(w.files.decisions!.label.endsWith('DECISIONS.md')).toBe(true);
		expect(w.files.issues!.label.endsWith('ISSUES.md')).toBe(true);
		expect(w.files.boards.length).toBe(1);
	});
});

// ---------- the wire: one session, flattened ----------
//
// **`deckState` itself is not called here, deliberately.** `register.ts` holds ONE warm copy for
// the whole process and it does not remember which city it walked (`deck.test.ts` §deckState says
// so in its own words), so a second test file pointing `GLASS_CITY` somewhere else would decide
// which fixture the first file sees. The `?b=` contract is proven end to end over a real server in
// `lab/b15/probe.ts` instead, which is the stronger evidence anyway.

describe('deckSession — what a tooltip needs, carried on the wire', () => {
	const beat = (over: Partial<Beat> = {}): Beat => ({
		t: 1000, ev: 'PreToolUse', sid: 's1', acct: '/Users/felix/.claude', pid: 4242,
		ws: 'W-1', sf: 'S-1', cwd: '/Users/felix/code/agents', tp: null, tool: 'Write',
		why: null, aid: null, at: null, bg: [], ...over,
	});
	const session = (over: Partial<Session> = {}): Session => ({
		sid: 's1', state: 'working', last: beat(), beats: 3, account: '/Users/felix/.claude',
		cwd: '/Users/felix/code/agents', tool: 'Write', stamp: 'builder-agents-01', model: 'sonnet',
		transcript: null, agent: null, roster: null, ...over,
	});

	test('venue, process and the last act ride along — the §4 tooltip has depth without a second read', () => {
		const d = deckSession(session(), 'agents');
		expect(d).toMatchObject({ pid: 4242, ws: 'W-1', event: 'PreToolUse', tool: 'Write', pane: true, model: 'sonnet' });
		expect(d.building).toBe('agents');
	});

	test('a session in no cmux pane has nothing to jump to, and says so rather than offering one', () => {
		expect(deckSession(session({ last: beat({ sf: null, ws: null }) }), null).pane).toBe(false);
	});

	test('a model nobody wrote down stays null — half a tier is not guessed at (findings F1)', () => {
		expect(deckSession(session({ model: null }), null).model).toBeNull();
	});

	test('the waiting edge is attention.ts\'s, not re-derived here', () => {
		expect(deckSession(session({ last: beat({ ev: 'Notification', why: 'permission_prompt' }) }), null).waiting)
			.toBe('blocked');
		expect(deckSession(session({ last: beat({ ev: 'Stop' }) }), null).waiting).toBeNull();
	});
});
