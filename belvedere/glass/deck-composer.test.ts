// The composer's boundary and its stamp law (B17).
//
// **`composePlan` itself is not here, deliberately.** It calls `register()`, and the register holds
// ONE warm copy for the whole process keyed on nothing — so a second fixture city inside `bun test`
// silently decides another file's results (B15 F4, measured). Everything server-shaped about the
// composer is therefore proven over a real server in `lab/b17/probe.ts`, and what lives here is
// everything that can be a pure function: the draft's parse boundary, the increment's, the theater
// override, and the lineage prefix the whole wrong-stamp class turns on.

import { describe, expect, test } from 'bun:test';
import { LIMITS, readDraft, readIncrement, templateBody, withTemplate } from './deck-composer';
import { FOUNDING } from './composer';
import { nextOrdinal, ordinal, stampPrefix, theaterOf } from './summon';
import type { Rig } from './rig';

const rig = (): Rig => ({
	accounts: new Map([['/x/.claude', 'personal']]),
	colours: new Map([['builder', 'cyan'], ['architect', 'green']]),
	tiers: new Map([['builder', 'opus-high'], ['architect', 'fable-high']]),
	mantles: ['architect', 'builder'],
});

const draft = () => readDraft({});

// ---------- the parse boundary ----------

describe('the draft: every knob a string, and empty always means unset', () => {
	test('a non-object, a null and a missing field all read as the empty draft', () => {
		expect(readDraft(null)).toEqual(readDraft('nonsense'));
		expect(readDraft({}).mantle).toBe('');
		expect(readDraft({ mantle: 42, cwd: ['x'] }).mantle).toBe('');
	});

	test('every knob but the summons is trimmed; the summons keeps its shape but for line endings', () => {
		const d = readDraft({ mantle: '  Builder ', summons: 'one\r\ntwo\rthree\n' });
		expect(d.mantle).toBe('Builder');
		// An HTML textarea submits CRLF and the hands normalise to LF at their own boundary
		// (`sanitize.ts`), so normalising here keeps page bytes, wire bytes and ignited bytes one string.
		expect(d.summons).toBe('one\ntwo\nthree\n');
	});

	test('everything has a limit: an oversized summons is cut at the boundary, not at the ignition', () => {
		expect(readDraft({ summons: 'x'.repeat(LIMITS.summonsChars + 500) }).summons.length)
			.toBe(LIMITS.summonsChars);
	});
});

describe('the increment knob: an ordinal or nothing, never a guess', () => {
	test('a plain one-to-three-digit number is the ordinal', () => {
		expect(readIncrement('7')).toBe(7);
		expect(readIncrement('077')).toBe(77);
		expect(readIncrement('999')).toBe(999);
	});

	test('zero, a negative, a decimal, a word and an out-of-range number are all "unset"', () => {
		for (const bad of ['', '0', '-3', '1.5', 'next', '1000', ' 7', '7 '])
			expect(readIncrement(bad)).toBeNull();
	});
});

// ---------- the stamp law: the building names the work, the cwd is only the venue ----------

describe('the lineage prefix — B17\'s whole reason for existing', () => {
	test('a mantle and a theater spell the prefix; the Grand Architect keeps none', () => {
		expect(stampPrefix('Builder', 'belvedere')).toBe('builder-belvedere');
		expect(stampPrefix('Grand Architect', 'belvedere')).toBe('grand-architect');
		// One office, so the theater segment would be redundancy — the rig's own law, measured live
		// at B7 F3 (`grand-architect-11`, not `grand-architect-belvedere-01`).
		expect(stampPrefix('Grand Architect', '')).toBe('grand-architect');
	});

	test('no mantle and no theater are both unnameable, and answer null rather than a partial name', () => {
		expect(stampPrefix(null, 'belvedere')).toBeNull();
		expect(stampPrefix('Builder', '')).toBeNull();
	});

	/**
	 * The field report's own case: an Architect sitting **about belvedere**, run **at ~/code/agents**.
	 * v0 asked one question and used the answer for two, and stamped `architect-agents-NN`. The two
	 * theaters below are what the two directories are called — and the composer takes the first.
	 */
	test('the theater of the BUILDING and the theater of the VENUE are two different words', () => {
		expect(theaterOf('/Users/felix/code/agents/belvedere')).toBe('belvedere');
		expect(theaterOf('/Users/felix/code/agents')).toBe('agents');
		expect(stampPrefix('Architect', theaterOf('/Users/felix/code/agents/belvedere'))).toBe('architect-belvedere');
	});
});

describe('the ordinal reads all three sources, and the census is the third', () => {
	/**
	 * B7 F4, closed for the deck: `architect-belvedere` appeared **0 times** in `invocations.jsonl`
	 * and 0 times in the hands' audit while the live census was carrying `architect-belvedere-01`
	 * right then — so the two logs alone hand that name out a second time. `known` is the census.
	 */
	test('a stamp only the live census carries is still counted, and skipped', () => {
		const prefix = 'builder-b17-nothing-logs-this';
		expect(nextOrdinal(prefix)).toBe(1);
		expect(nextOrdinal(prefix, new Set(), [`${prefix}-77`])).toBe(78);
	});

	test('a name that merely starts like the prefix does not move the counter', () => {
		const prefix = 'builder-b17-nothing-logs-this';
		expect(nextOrdinal(prefix, new Set(), [`${prefix}-extra-04`, 'builder-b17-nothing-logs-this-else-09'])).toBe(1);
	});

	test('`taken` is the reservation: two mints in one render can never be one name', () => {
		const prefix = 'builder-b17-nothing-logs-this';
		const taken = new Set<string>();
		expect(ordinal(prefix, nextOrdinal(prefix, taken))).toBe(`${prefix}-01`);
		expect(ordinal(prefix, nextOrdinal(prefix, taken))).toBe(`${prefix}-02`);
	});
});

// ---------- templates ----------

describe('a template is a whole opening: it sets the mantle and the tier it speaks as', () => {
	test('the founding Architect arrives verbatim, at the tier its own fence names', () => {
		const out = withTemplate(draft(), 'founding', rig(), null);
		expect(out.summons).toBe(FOUNDING);
		expect(out.mantle).toBe('Architect');
		expect(out.model).toBe('fable');
		expect(out.effort).toBe('max');
	});

	test('a mantle template opens at whatever `presets.tsv` staffs that mantle at — not a second copy of it', () => {
		const out = withTemplate(draft(), 'builder', rig(), null);
		expect(out.mantle).toBe('Builder');
		expect(out.summons).toContain('You are a Builder at opus-high.');
	});

	test('the sweep template names the building the rest of the form already chose', () => {
		const out = withTemplate(draft(), 'sweep', rig(), '/Users/felix/code/agents/belvedere');
		expect(out.summons).toContain('belvedere');
		expect(out.mantle).toBe('Architect');
	});

	test('a clicked template becomes sticky, and that is what keeps the summons live', () => {
		expect(withTemplate(draft(), 'builder', rig(), null).template).toBe('builder');
	});

	/**
	 * §1's *"the summons text updating as knobs move"*, which is the whole reason stickiness exists:
	 * a fence names its own tier (D45), so a page showing `at opus-high` beside an `opus-low` ignition
	 * is a page arguing with itself.
	 */
	test('a sticky template re-speaks at the CURRENT tier, and follows the mantle chip rather than freezing it', () => {
		expect(templateBody('builder', 'Builder', 'opus-high', null)).toContain('You are a Builder at opus-high.');
		expect(templateBody('builder', 'Builder', 'haiku-low', null)).toContain('You are a Builder at haiku-low.');
		// The six mantle chips are ONE template parameterised by mantle, so moving the mantle knob
		// moves the words rather than leaving a Digger speaking as a Builder.
		expect(templateBody('builder', 'Digger', 'opus-high', null)).toContain('You are a Digger at opus-high.');
		expect(templateBody('builder', 'Grand Architect', 'fable-max', null)).toContain('You are the Grand Architect at fable-max.');
	});

	test('the founding fence ignores the knobs, because DOCTRINE §12 is bytes and not a formula', () => {
		expect(templateBody('founding', 'Builder', 'haiku-low', null)).toBe(FOUNDING);
	});

	test('a template nobody has heard of re-speaks nothing — his text is never replaced by a guess', () => {
		expect(templateBody('no-such-template', 'Builder', 'opus-high', null)).toBeNull();
	});

	test('no template is not a template: the draft comes back untouched', () => {
		const d = { ...draft(), mantle: 'Digger', summons: 'mine' };
		expect(withTemplate(d, '', rig(), null)).toBe(d);
		expect(withTemplate(d, 'no-such-template', rig(), null).summons).toBe('mine');
	});
});
