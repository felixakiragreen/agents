// The deck's testable half: the law of space, the remembered layout, the seam's register, the
// shell, and the composition behind `/deck/state`.
//
// What is NOT here is the app itself (`deck.client.ts`), because a click, a grid track's measured
// width and a poll arriving are browser facts and a fake DOM would only prove the fake. Those ride
// `lab/b13/probe.ts`, which drives a real headless Chrome against a real server and pastes real
// `getBoundingClientRect()` numbers into the DoD. **The split is deliberate: everything that can be
// a pure function is one, and lives here.**

import { expect, test, describe, afterAll } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
	bump, columns, PANES, PANE_STATES, RESTING, shares, toLayout, weights,
	type Layout, type PaneState,
} from './deck-model';
import { moveIn, tenant, tenants, type FocusView } from './deck-view';
import { deckPage, deckState } from './deck';

const lay = (over: Partial<Layout> = {}): Layout => ({ ...RESTING, ...over });
const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

// ---------- the law of space ----------

describe('the law of space — the split IS the state', () => {
	test('at rest the City takes three quarters and the two closed panes an eighth each', () => {
		expect(columns(RESTING)).toBe('6fr 1fr 1fr');
		expect(shares(RESTING)).toEqual([0.75, 0.125, 0.125]);
	});

	test('every combination of the 27 splits the whole deck and nothing else', () => {
		for (const c of PANE_STATES) for (const f of PANE_STATES) for (const a of PANE_STATES) {
			const s = shares(lay({ context: c, focus: f, action: a }));
			expect(s.length).toBe(3);
			expect(sum(s)).toBeCloseTo(1, 12);
			expect(Math.min(...s)).toBeGreaterThan(0);       // a pane is never zero-width; minimal is a rail
		}
	});

	test('walking one pane up never shrinks it and never grows another', () => {
		const walk = PANE_STATES.map(s => shares(lay({ focus: s })));
		for (let i = 1; i < walk.length; i++) {
			expect(walk[i]![1]!).toBeGreaterThan(walk[i - 1]![1]!);
			expect(walk[i]![0]!).toBeLessThan(walk[i - 1]![0]!);
		}
	});

	test('a pinned drawer takes a track of its own; open and shut take none — they overlay', () => {
		expect(weights(lay({ drawer: 'shut' })).length).toBe(3);
		expect(weights(lay({ drawer: 'open' })).length).toBe(3);
		expect(columns(lay({ drawer: 'open' }))).toBe(columns(lay({ drawer: 'shut' })));
		const pinned = shares(lay({ drawer: 'pinned' }));
		expect(pinned.length).toBe(4);
		expect(sum(pinned)).toBeCloseTo(1, 12);
		// Reserving space means exactly this: the three panes give some up.
		for (let i = 0; i < 3; i++) expect(pinned[i]!).toBeLessThan(shares(RESTING)[i]!);
	});

	test('click-to-expand walks minimal → typical → expanded and wraps back', () => {
		expect(bump('minimal')).toBe('typical');
		expect(bump('typical')).toBe('expanded');
		expect(bump('expanded')).toBe('minimal');
	});
});

// ---------- the remembered layout ----------

describe('toLayout — localStorage is a boundary, parsed once', () => {
	test('what the deck writes, it reads back', () => {
		const held = lay({ context: 'minimal', focus: 'expanded', drawer: 'pinned' });
		expect(toLayout(JSON.parse(JSON.stringify(held)))).toEqual(held);
	});

	test('anything else is no memory at all, and the deck opens at rest', () => {
		const bad: unknown[] = [
			null, 'expanded', 42, [],
			{ context: 'expanded', focus: 'minimal', drawer: 'shut' },       // a pane missing
			{ ...RESTING, action: 'huge' },                                  // a state that is not one
			{ ...RESTING, drawer: 'ajar' },
		];
		for (const raw of bad) expect(toLayout(raw)).toBeNull();
	});
});

// ---------- the seam ----------

describe('the FocusView register — panes are a replaceable surface (D13)', () => {
	const stub = (name: string): FocusView => ({
		name, title: name, states: ['typical'],
		mount() {}, unmount() {}, draw() {},
	});

	test('a tenant signs once, is found by name, and lists in signing order', () => {
		const before = tenants().length;
		moveIn(stub('probe-a'));
		moveIn(stub('probe-b'));
		expect(tenant('probe-a')?.name).toBe('probe-a');
		expect(tenants().slice(before).map(t => t.name)).toEqual(['probe-a', 'probe-b']);
	});

	test('an unsigned name is null, never a guess', () => expect(tenant('nobody')).toBeNull());

	test('two tenants under one name throws — that is a bug, not a replacement', () => {
		moveIn(stub('probe-c'));
		expect(() => moveIn(stub('probe-c'))).toThrow(/two tenants/);
	});
});

// ---------- the shell ----------

describe('the shell — three panes, always, and nothing off this origin', () => {
	const shell = deckPage();

	test('three panes, each with a host the client owns', () => {
		for (const p of PANES) {
			expect(shell).toContain(`data-pane="${p}"`);
			expect(shell).toContain(`id="host-${p}"`);
		}
		expect(shell).toContain('id="drawer"');
		expect(shell).toContain('id="tip"');
		expect(shell).toContain('id="scrim"');
	});

	test('the resting split is already in the markup — a deck is never blank while its script loads', () => {
		expect(shell).toContain(`grid-template-columns:${columns(RESTING)}`);
		expect(shell).toContain(`data-pane="context" data-state="${RESTING.context}"`);
		expect(shell).toContain(`data-pane="focus" data-state="${RESTING.focus}"`);
	});

	test('the queue\'s total is in the bar, so it is visible at rest with the drawer shut (B14 §4)', () => {
		expect(shell).toContain('id="needs"');
		expect(shell).toContain('data-needs="0"');
		// The drawer names itself, and at rest that name is the queue's. B21 gave the element an id
		// because the one drawer now has two contents (the queue, and a search's results) and the
		// name has to move with them — so the assertion narrows to the invariant it was protecting.
		expect(shell).toContain('id="drawer-name">⬡-queue</span>');
	});

	test('the Grep\'s box is in the header, named and reachable by keystroke (B21 §3)', () => {
		expect(shell).toContain('id="grep-q"');
		expect(shell).toContain('/ or ⌘K');
		// The one drawer, two contents: the way back to the queue is in its own head, not a second drawer.
		expect(shell).toContain('id="drawer-queue"');
	});

	test('nothing in the shell can fire — no fire wiring, no summons, no stamp (D10)', () => {
		for (const forbidden of ['/hands/fire', 'data-fire', 'data-apply', 'summons'])
			expect(shell).not.toContain(forbidden);
	});

	test('every pane offers all three states as buttons, and the page has no dropdown anywhere', () => {
		for (const p of PANES) for (const s of PANE_STATES)
			expect(shell).toContain(`data-set-state="${s}" data-pane="${p}"`);
		expect(shell).not.toContain('<select');
	});

	test('zero external requests: no http(s) URL in the served shell', () => {
		expect(shell.match(/https?:\/\//g)).toBeNull();
		expect(shell).toContain('src="/deck.js"');
	});

	test('a scriptless deck says so and names the rooms that still serve (glass-shatters)', () => {
		expect(shell).toContain('<noscript>');
		expect(shell).toContain('The deck is an app');
	});
});

// ---------- the composition behind /deck/state ----------
//
// The knobs go to temp and are PROVEN to have gone there (B8 F1: pointing a knob at temp and
// merely checking the call returned `ok` is how this suite once armed the city's real HALT flag).
// `GLASS_CITY` is the fixture city rather than `~/code` for the same reason `register.test.ts`
// refuses the held register: a real walk is nine seconds, and a suite nobody runs guards nothing.

describe('deckState — one composed read, and the joins it makes', () => {
	const ROOT = mkdtempSync(join(tmpdir(), 'b13-deck-'));
	const CENSUS = join(ROOT, 'census');
	const CITY = join(ROOT, 'city');
	const LIVE = join(CITY, 'tinytown');
	mkdirSync(CENSUS, { recursive: true });
	mkdirSync(LIVE, { recursive: true });
	// One building the register can actually find: a doctrine board is a table that staffs sessions,
	// so the `Staffing` column is what makes this file an artifact rather than a workdoc.
	writeFileSync(join(LIVE, 'README.md'),
		'# tinytown\n\n## The board\n\n| ID | Work | Staffing | Status |\n|---|---|---|---|\n| B1 | a row | Builder · opus-high | OPEN |\n');

	const now = Date.now() / 1000;
	const beat = (o: Record<string, unknown>) => JSON.stringify({ t: now, acct: '/Users/felix/.claude', ...o });
	writeFileSync(join(CENSUS, 'census.jsonl'), [
		beat({ ev: 'PreToolUse', sid: 'aaa', pid: String(process.pid), cwd: LIVE, tool: 'Bash' }),
		beat({ ev: 'SessionEnd', sid: 'bbb', pid: String(process.pid), cwd: LIVE, why: 'clear' }),
		beat({ ev: 'Stop', sid: 'ccc', pid: String(process.pid), cwd: '/somewhere/off/the/register' }),
		'{not json',
	].join('\n') + '\n');

	// The env knobs are restored, but `register.ts`'s held copy is a module singleton and stays
	// warm with the fixture city for the rest of the process. That is safe only because no other
	// test file calls `register()` — deliberately, since its first real call is a nine-second walk
	// (`register.test.ts` §head). A file that starts calling it must not assume a cold register.
	// **The suite never reaches the socket.** `deckState` now awaits the live-identity read (B18),
	// which spawns `cmux` — but only if the glass is armed, and an armed test process would drive
	// Felix's real desktop from `bun test` (B8 F1's lesson, paid once already). Pointing the
	// credential at a path that does not exist is both the guard and the honest-degradation proof.
	const saved = { census: process.env.CENSUS_DIR, city: process.env.GLASS_CITY, env: process.env.BELVEDERE_ENV };
	process.env.BELVEDERE_ENV = join(ROOT, 'no-credential-here');
	afterAll(() => {
		process.env.CENSUS_DIR = saved.census;
		process.env.GLASS_CITY = saved.city;
		process.env.BELVEDERE_ENV = saved.env;
		rmSync(ROOT, { recursive: true, force: true });
	});

	test('the snapshot is composed from the anchors it was pointed at, and the joins hold', async () => {
		process.env.CENSUS_DIR = CENSUS;
		process.env.GLASS_CITY = CITY;
		const snap = await deckState();

		// The knob proof: this could only have come from the fixture.
		expect(snap.register.buildings.map(b => b.path)).toEqual([LIVE]);
		const town = snap.register.buildings[0]!.building;
		expect(snap.census.beats).toBe(3);
		expect(snap.census.malformed).toBe(1);       // parser-as-lint: the bad line is counted, not hidden
		expect(snap.census.present).toBe(true);

		// `gone` is read, never counted as work in flight.
		expect(snap.census.sessions.length).toBe(3);
		expect(snap.census.live).toBe(2);

		const byId = new Map(snap.census.sessions.map(s => [s.sid, s]));
		expect(byId.get('aaa')?.state).toBe('working');
		expect(byId.get('aaa')?.building).toBe(town);             // the buildingOf join, on the wire
		expect(byId.get('bbb')?.state).toBe('gone');
		expect(byId.get('ccc')?.building).toBeNull();             // off the register is null, never mis-housed
		expect(snap.register.ageSeconds).toBeGreaterThanOrEqual(0);
		expect(snap.at).toBeGreaterThan(0);
	});

	// B14 widens the same snapshot rather than opening a second endpoint (`deck-model.ts` §head).
	test('the snapshot carries the City and the queue, and the badges agree with the items', async () => {
		process.env.CENSUS_DIR = CENSUS;
		process.env.GLASS_CITY = CITY;
		const snap = await deckState();

		const town = snap.register.buildings[0]!;
		expect(town.group).toBe('tinytown');
		expect(town.live).toBe(1);                                // `aaa` works here; `bbb` is gone
		expect(town.sids).toEqual(['aaa']);
		expect(Object.keys(town.badges).sort()).toEqual(['countersign', 'escalation', 'gate', 'waiting']);
		expect(town.attention).toBe(0);                           // live work — v0's own rank, untouched
		for (const [kind, n] of Object.entries(town.badges))
			expect(n).toBe(snap.queue.filter(i => i.building === town.building && i.kind === kind).length);

		expect(snap.census.waiting).toBe(0);                      // nothing in this fixture is blocked
		expect(snap.auditor.at).toBeGreaterThan(0);               // `ps` answered, or honestly did not
	});

	test('a permission prompt reaches the wire as a waiting session, a badge and a queue item', async () => {
		process.env.CENSUS_DIR = CENSUS;
		process.env.GLASS_CITY = CITY;
		writeFileSync(join(CENSUS, 'census.jsonl'),
			beat({ ev: 'Notification', why: 'permission_prompt', sid: 'ddd', pid: String(process.pid), cwd: LIVE, ws: 'W1', sf: 'S1' }) + '\n');
		const snap = await deckState();

		expect(snap.census.waiting).toBe(1);
		expect(snap.census.sessions[0]!.waiting).toBe('blocked');
		expect(snap.register.buildings[0]!.badges.waiting).toBe(1);
		expect(snap.register.buildings[0]!.attention).toBe(-1);   // above every other rank there is
		expect(snap.queue[0]!.kind).toBe('waiting');
		expect(snap.queue[0]!.sid).toBe('ddd');
	});

	test('no census file is honestly absent, not an empty city', async () => {
		process.env.CENSUS_DIR = join(ROOT, 'no-such-dir');
		process.env.GLASS_CITY = CITY;
		const snap = await deckState();
		expect(snap.census.present).toBe(false);
		expect(snap.census.live).toBe(0);
		expect(snap.census.since).toBeNull();
	});
});

// A tenant's declared states must be states — the shell draws affordances from this list, so a
// typo here would render a button that sets a value the model does not know.
test('every signed tenant declares only real pane states', () => {
	for (const t of tenants()) for (const s of t.states)
		expect(PANE_STATES).toContain(s as PaneState);
});
