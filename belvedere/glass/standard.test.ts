// **Grammar intake** (C2 §2): the deck consumes the tokens C24 taught the parser.
//
// The claim under test is not "the new tokens parse" — that is C24's, proven in `doctrine/`. It is
// that the RENDER PATH treats them as the same meaning: a `⬡-gate` charge is Felix's card exactly
// as a `Felix-gate` row was, and an `ignite` baton is the fireable card `fire` was.
//
// So the fixture is a PAIR, and the pair is one substitution apart **by construction**: the same
// bytes are written twice, the second time through `molt()`. A test that hand-wrote both documents
// would prove the two renders agree about two documents; this one proves they agree about the
// words. Everything else — dates, ids, prose, work docs, the kickoff fence — is identical, so a
// difference in the rendered HTML can only be the token.
//
// The one thing the pair cannot claim is `DEFERRED`, whose whole render IS the corpus's own word:
// it is pass-through text and the assertion is that it passes through verbatim (the one law —
// the deck's own words molt, the corpus's words render verbatim).

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { basename, join } from 'path';
import { discover, type Building } from '../../doctrine';
import { noBadges } from './deck-model';
import { cardHtml, cards, type Card } from './rail';
import { readRig } from './rig';
import { workshopOf } from './workshop';

// ---------- the pair ----------

/** The graveyard's row and the standard's successor (STANDARD §9), in substitution order. */
const MOLT: [dead: string, live: string][] = [
	['pending Felix countersign', 'pending ⬡✓'],
	['Felix-gate', '⬡-gate'],
	['fire C3', 'ignite C3'],
	['PARKED', 'DEFERRED'],
	['✓ Felix', '⬡✓'],
];

const molt = (text: string) => MOLT.reduce((s, [dead, live]) => s.split(dead).join(live), text);

const BOARD = `# the token fixture

## 6. The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| C1 | [The gate](plans/c1.md) — the sovereign's own read of the diff | — | Felix-gate | OPEN |
| C2 | [The shelved one](plans/c2.md) — set aside, nobody waiting | C1 | Digger · opus-high | OPEN — PARKED until the gate clears |
| C3 | [The ignitable one](plans/c3.md) — a kickoff at its foot | C1 | Builder · opus-high | OPEN |
`;

const LEDGER = `# the ledger

---

**2026-08-29 · Architect · fable-high (C3)** — the token fixture's tail, so the pair carries a
baton. Decided: nothing. Next: fire C3 — the tree is its own.
`;

const DECISIONS = `# decisions

- **D1** (2026-08-29, Architect · ✓ Felix): **A blessing given.** The mark sits in the attribution, which is the only place it counts.
- **D2** (2026-08-29, Architect, proposed — pending Felix countersign): **A blessing awaited.** The waiting form CONTAINS the mark and is not a blessing (C24 F1).
`;

const KICKOFF = `# C3 — the ignitable one

A fixture work doc.

\`\`\`
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read this doc and build it.
\`\`\`
`;

const ROOT = mkdtempSync(join(tmpdir(), 'c2-molt-'));
const rig = readRig();
const ACCOUNTS = ['personal'];
const NO_BADGES = noBadges();

/** `graveyard` writes the dead words, `standard` the successors. Neither name is the other's substring. */
const NAMES = ['graveyard', 'standard'] as const;

beforeAll(() => {
	for (const name of NAMES) {
		const dir = join(ROOT, name);
		const say = (text: string) => (name === 'standard' ? molt(text) : text);
		mkdirSync(join(dir, 'plans'), { recursive: true });
		writeFileSync(join(dir, 'README.md'), say(BOARD));
		writeFileSync(join(dir, 'LEDGER.md'), say(LEDGER));
		writeFileSync(join(dir, 'DECISIONS.md'), say(DECISIONS));
		writeFileSync(join(dir, 'plans/c3.md'), say(KICKOFF));
	}
});

afterAll(() => rmSync(ROOT, { recursive: true, force: true }));

/**
 * A fixture city's building name IS its absolute path (B10 F5), so the pair is addressed by the
 * directory name the fixture chose and never by the slug the walk happened to mint.
 */
const buildings = (): Record<string, Building> =>
	Object.fromEntries(discover([ROOT]).map(b => [basename(b.path), b]));

/** Cards for ONE building — a shared render would mint two different name-stamps for one shot. */
const cardsOf = (name: string) => cards([buildings()[name]!], rig, ACCOUNTS[0]!);
const cardOf = (name: string, kind: Card['kind']) => {
	const hit = cardsOf(name).find(c => c.kind === kind);
	if (!hit) throw new Error(`no ${kind} card in ${name}`);
	return cardHtml(hit, true, ACCOUNTS);
};

/**
 * The building's own name is the ONLY thing the pair may legitimately differ by — it is in the
 * slug, in every path, and in the name-stamp's theater. Blanking it leaves the tokens alone to
 * explain any remaining difference.
 */
const anon = (html: string, name: string) => html.split(name).join('‹building›');

// ---------- ⬡-gate: D63a's law, new token, same meaning ----------

describe('a ⬡-gate charge is his card', () => {
	test('it renders byte-for-byte what Felix-gate rendered', () => {
		expect(anon(cardOf('standard', 'gate'), 'standard'))
			.toBe(anon(cardOf('graveyard', 'gate'), 'graveyard'));
	});

	test('and it is his: purple, holder felix, no ignite wiring', () => {
		const html = cardOf('standard', 'gate');
		expect(html).toContain('data-kind="gate"');
		expect(html).toContain('data-holder="felix"');
		expect(html).not.toMatch(/data-ignite|\/hands\//);
	});

	test('the Workshop reads the same staffing off the same row', () => {
		const staffing = (name: string) =>
			workshopOf(discover([ROOT]), buildings()[name]!.building, NO_BADGES)!.boards[0]!.rows[0]!;
		expect(staffing('standard').hexGate).toBe(true);
		expect(staffing('standard').staffing).toBe(staffing('graveyard').staffing);
	});
});

// ---------- ignite: the dispatch verb, same instrument ----------

describe('an `ignite` baton is the fireable card `fire` was', () => {
	/**
	 * The clause itself is the one thing that MUST differ: it is the ledger's own sentence, and the
	 * deck renders the corpus verbatim. Blank the verb and everything downstream of it — the
	 * shot, the resolved kickoff, the payload, the wiring — has to agree exactly.
	 */
	const clause = (html: string, verb: string) => html.split(`${verb} C3`).join('‹instrument›');

	test('everything the instrument drives is byte-for-byte what `fire C3` drove', () => {
		expect(clause(anon(cardOf('standard', 'baton'), 'standard'), 'ignite'))
			.toBe(clause(anon(cardOf('graveyard', 'baton'), 'graveyard'), 'fire'));
	});

	test('and the clause is never translated back — the ledger keeps the verb it wrote', () => {
		expect(cardOf('standard', 'baton')).toContain('ignite C3 — the tree is its own.');
		expect(cardOf('graveyard', 'baton')).toContain('fire C3 — the tree is its own.');
	});

	test('and it is ignitable: a session baton whose C‹n› instrument resolves to its work doc', () => {
		const card = cardsOf('standard').find(c => c.kind === 'baton')! as Card & { kind: 'baton' };
		expect(card.baton.holder).toBe('session');
		expect(card.wired).toBe(true);
		expect(card.shots).toHaveLength(1);
		// The id resolution is the intake proof: `C3` is looked up on the board like any other id.
		expect(card.shots[0]!.label).toContain('C3');
		expect(card.shots[0]!.source).toContain('plans/c3.md');
		expect(card.shots[0]!.summons).toContain('You are a Builder at opus-high.');
	});
});

// ---------- the veto, render-side (C24 F1) ----------

describe('`proposed — pending ⬡✓` renders PENDING, never blessed', () => {
	test('the waiting form keeps its card and its button', () => {
		const html = cardOf('standard', 'countersign');
		expect(html).toContain('pending blessing');
		expect(html).not.toContain('folded');
		expect(html).toContain('kind&quot;:&quot;countersign');
	});

	test('the queue holds the awaited blessing and nothing else — the given one has left', () => {
		expect(buildings()['standard']!.decisionQueue.map(d => [d.id, d.blessed, d.pending]))
			.toEqual([['D2', false, true]]);
	});

	/**
	 * The hazard is the MARK'S SHAPE, not one implementation of it (C24 F1), so the deck's own
	 * guard is that it never re-reads the mark: resolution is the parser's field, and a glass-side
	 * grep for `⬡✓` would re-introduce the bug in a second place.
	 */
	test('no render path greps for the blessing mark — the parser\'s field is the only reader', async () => {
		const sources = new Bun.Glob('*.ts').scan({ cwd: import.meta.dir, absolute: true });
		const guilty: string[] = [];
		for await (const file of sources) {
			if (file.endsWith('standard.test.ts')) continue;
			if ((await Bun.file(file).text()).includes('⬡✓')) guilty.push(file);
		}
		expect(guilty).toEqual([]);
	});
});

// ---------- DEFERRED: pass-through text, verbatim ----------

describe('a DEFERRED annotation renders as the corpus wrote it', () => {
	test('the word reaches the Workshop untouched, and the state still leads', () => {
		const row = workshopOf(discover([ROOT]), buildings()['standard']!.building, NO_BADGES)!.boards[0]!.rows[1]!;
		expect(row.state).toBe('OPEN');
		expect(row.annotation.name).toBe('DEFERRED until the gate clears');
	});

	test('the deck does not translate it back — `PARKED` in the corpus stays PARKED', () => {
		const row = workshopOf(discover([ROOT]), buildings()['graveyard']!.building, NO_BADGES)!.boards[0]!.rows[1]!;
		expect(row.annotation.name).toBe('PARKED until the gate clears');
	});
});
