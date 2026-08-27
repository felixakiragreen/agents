// The composer's tested core: the four things it resolves before anything can be armed — the
// target, the tier, the name-stamp's lineage, and whether the chosen account has ever trusted the
// directory — plus the two structural laws of the page (no dropdowns; the fire button carries the
// exact body the page shows).
//
// What is NOT here is a real fire: a composed session landing byte-exact in cmux, the founding
// template at a scratch dir, a worktree-composed fire and a cold-directory stall are all DoD
// evidence in `plans/b7-summon-composer.md`, not unit tests.
//
// Every anchor this file needs is env-derived and set per test (`paths.ts` resolves per call —
// B8 §4), so nothing here reads the live census, the live audit log or the real credential.

import { expect, test, describe, beforeEach, afterAll } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { MANTLES } from '../../doctrine';
import {
	applyTemplate, FOUNDING, form, plan, planCard, readDraft, slotsIn, targetOf, TEMPLATES,
	type Draft, type Plan,
} from './composer';
import { sweepSummons } from './inbox';
import type { Entry } from './register';
import type { Rig } from './rig';
import { lineage, nextStamp, theaterOf } from './summon';
import { readTrust, trustOf } from './trust';
import type { Usage } from './gauges';

const NOW = 1_800_000_000;
const ROOT = mkdtempSync(join(tmpdir(), 'b7-composer-'));
afterAll(() => rmSync(ROOT, { recursive: true, force: true }));

const dir = (...parts: string[]) => { const p = join(ROOT, ...parts); mkdirSync(p, { recursive: true }); return p; };

const CITY = dir('code');
const AGENTS = dir('code/agents');
const BELVEDERE = dir('code/agents/belvedere');
const COLD = dir('elsewhere/nothing-trusts-this');

// The worktree plan resolves its own repo (`git rev-parse --show-toplevel`) rather than asking
// for one, so the fixture has to be a real repo for that resolution to be worth testing.
Bun.spawnSync(['git', 'init', '-q', AGENTS], { stdout: 'ignore', stderr: 'ignore' });

/** Two accounts, each with its OWN trust file — the whole point of the trust read (B7 F1). */
const PERSONAL = dir('.claude');
const WORK = dir('.claude-work');

const trustFile = (configDir: string, projects: Record<string, unknown>) =>
	writeFileSync(join(configDir, '.claude.json'), JSON.stringify({ projects }));

trustFile(PERSONAL, { [CITY]: { hasTrustDialogAccepted: true } });
trustFile(WORK, {
	[AGENTS]: { hasTrustDialogAccepted: true },
	[BELVEDERE]: { hasTrustDialogAccepted: false },   // an explicit refusal under a trusted root
	[join(CITY, 'noise')]: { hasTrustDialogAccepted: 'yes' },   // not a boolean: no opinion at all
});

const rig: Rig = {
	accounts: new Map([[PERSONAL, 'personal'], [WORK, 'work']]),
	colours: new Map([['builder', 'cyan'], ['architect', 'green'], ['grand-architect', 'green']]),
	tiers: new Map([['builder', 'opus-high'], ['architect', 'fable-high'], ['grand-architect', 'fable-max']]),
	mantles: ['grand-architect', 'architect', 'builder'],
};

const entries: Entry[] = [
	{ building: 'agents', path: AGENTS, files: {} as Entry['files'] },
	{ building: 'agents/belvedere', path: BELVEDERE, files: {} as Entry['files'] },
];

const usages: Usage[] = [
	{ account: 'personal', file: '/x', fetchedAt: NOW - 60, windows: { sess: { pct: 40, resetsAt: NOW + 3600, windowSecs: 18000 } } },
	{ account: 'work', file: '/y', fetchedAt: null, windows: {} },
];

/**
 * The census and the hands' audit both live under `CENSUS_DIR`; both stay empty and temp here.
 * The knob is put back afterwards: a file that leaves the suite pointed at its own deleted temp
 * directory is the frozen-anchor bug wearing a different hat (B8 §4).
 */
const CENSUS_WAS = process.env.CENSUS_DIR;
beforeEach(() => { process.env.CENSUS_DIR = join(ROOT, 'census'); });
afterAll(() => {
	if (CENSUS_WAS === undefined) delete process.env.CENSUS_DIR; else process.env.CENSUS_DIR = CENSUS_WAS;
});

const draft = (over: Partial<Draft> = {}): Draft => ({
	where: '', cwd: '', account: 'personal', mantle: '', model: '', effort: '',
	stamp: '', branch: '', summons: '', ...over,
});

// ---------- the draft ----------

describe('the draft', () => {
	test('a textarea submits CRLF, and the draft holds LF — one string everywhere after', () => {
		const d = readDraft(new URLSearchParams([['summons', 'one\r\ntwo\rthree\nfour']]));
		expect(d.summons).toBe('one\ntwo\nthree\nfour');
	});

	test('every other field is trimmed, and absent reads as unset', () => {
		const d = readDraft(new URLSearchParams([['mantle', '  Builder  ']]));
		expect(d.mantle).toBe('Builder');
		expect(d.where).toBe('');
		expect(d.branch).toBe('');
	});
});

// ---------- the target ----------

describe('the target', () => {
	test('the chip wins; the free path is what "elsewhere" means', () => {
		expect(targetOf(draft({ where: BELVEDERE, cwd: AGENTS }))).toEqual({ path: BELVEDERE });
		expect(targetOf(draft({ where: '', cwd: AGENTS }))).toEqual({ path: AGENTS });
	});

	test('neither is a reason, not a guess', () => {
		const t = targetOf(draft());
		expect('blocked' in t && t.blocked).toContain('pick a building');
	});

	test('a relative path and a missing directory are both refused by name', () => {
		expect('blocked' in targetOf(draft({ cwd: 'code/agents' }))).toBe(true);
		const gone = targetOf(draft({ cwd: join(ROOT, 'no-such-place') }));
		expect('blocked' in gone && gone.blocked).toContain('does not exist');
	});

	test('`~/` is the city\'s spelling and resolves to a real path', () => {
		const t = targetOf(draft({ cwd: '~/' }));
		expect('path' in t && t.path.startsWith('/')).toBe(true);
	});
});

// ---------- the templates ----------

describe('the templates', () => {
	test('one per mantle, plus the founding Architect and the inbox sweep', () => {
		expect(TEMPLATES.length).toBe(MANTLES.length + 2);
		expect(TEMPLATES.map(t => t.key)).toContain('founding');
		expect(TEMPLATES.map(t => t.key)).toContain('sweep');
	});

	test('a mantle template opens in the canon grammar, with the charter path and the right article', () => {
		const builder = applyTemplate(draft(), 'builder', rig, null);
		expect(builder.summons).toBe(
			'You are a Builder at opus-high.\n'
			+ 'Wear ~/code/agents/canon/mantles/builder.md,\n'
			+ 'then read <context> and <verb>.');
		expect(applyTemplate(draft(), 'architect', rig, null).summons.startsWith('You are an Architect at fable-high.')).toBe(true);
		expect(applyTemplate(draft(), 'grand-architect', rig, null).summons.startsWith('You are the Grand Architect at fable-max.')).toBe(true);
	});

	test('the founding template is DOCTRINE §12\'s fence, byte for byte', () => {
		expect(applyTemplate(draft(), 'founding', rig, COLD).summons).toBe(FOUNDING);
		expect(FOUNDING).toBe(`You are an Architect at fable-max.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/canon/work/DOCTRINE.md
and <dream.md | Felix's telling>, and found the project.`);
	});

	test('the sweep template IS B6\'s, not a second copy of it', () => {
		expect(applyTemplate(draft(), 'sweep', rig, BELVEDERE).summons).toBe(sweepSummons(BELVEDERE));
	});

	test('a template is a whole opening: it sets the mantle and the tier it speaks as', () => {
		const d = applyTemplate(draft({ mantle: 'Builder', model: 'haiku', effort: 'low' }), 'founding', rig, null);
		expect([d.mantle, d.model, d.effort]).toEqual(['Architect', 'fable', 'max']);
	});

	test('an unknown template key changes nothing', () => {
		const before = draft({ summons: 'mine' });
		expect(applyTemplate(before, 'nope', rig, null)).toEqual(before);
	});
});

describe('unfilled slots', () => {
	test('the canon grammar\'s own slots are found', () => {
		expect(slotsIn('then read <context> and <verb>.')).toEqual(['<context>', '<verb>']);
		expect(slotsIn(FOUNDING)).toEqual(["<dream.md | Felix's telling>"]);
	});
	test('a filled summons carries none', () => {
		expect(slotsIn('You are a Builder at opus-high.\nWear x.md, then read y and build it.')).toEqual([]);
	});
});

// ---------- the lineage ----------

describe('the name-stamp\'s lineage', () => {
	const theaters = dir('code/agents/theatered');

	test('the theater is the directory\'s own name', () => {
		expect(theaterOf(BELVEDERE)).toBe('belvedere');
	});

	test('`.summon-theaters` names the campaign, and the FIRST line is the default (row 14)', () => {
		writeFileSync(join(theaters, '.summon-theaters'), '\npods\nlunchbox\n');
		expect(theaterOf(theaters)).toBe('pods');
	});

	test('a line the rig would refuse falls back to the directory name, never to a bad launch', () => {
		writeFileSync(join(theaters, '.summon-theaters'), 'not a plain name\npods\n');
		expect(theaterOf(theaters)).toBe('theatered');
		writeFileSync(join(theaters, '.summon-theaters'), '-leading-dash\n');
		expect(theaterOf(theaters)).toBe('theatered');
		rmSync(join(theaters, '.summon-theaters'));
	});

	test('there is no parent walk: a parent\'s list is not this directory\'s campaign', () => {
		const child = dir('code/agents/theatered/inner');
		writeFileSync(join(theaters, '.summon-theaters'), 'pods\n');
		expect(theaterOf(child)).toBe('inner');
		rmSync(join(theaters, '.summon-theaters'));
	});

	test('the Grand Architect keeps no theater — there is one office (rig §name-stamp)', () => {
		expect(lineage('Grand Architect', BELVEDERE)).toBe('grand-architect');
		expect(lineage('Builder', BELVEDERE)).toBe('builder-belvedere');
	});

	test('no mantle is no lineage: the glass never arms what it cannot name', () => {
		expect(lineage(null, BELVEDERE)).toBe(null);
		expect(lineage('', BELVEDERE)).toBe(null);
	});
});

describe('the ordinal', () => {
	// `zzb7` cannot appear in the city's real `invocations.jsonl`, so these ordinals are facts
	// about this test's inputs and nothing else.
	const theater = dir('code/zzb7');

	test('a stamp the live census carries is not handed out again', () => {
		expect(nextStamp('Builder', theater)).toBe('builder-zzb7-01');
		expect(nextStamp('Builder', theater, new Set(), ['builder-zzb7-07'])).toBe('builder-zzb7-08');
	});

	test('a census stamp for another lineage moves nothing', () => {
		expect(nextStamp('Builder', theater, new Set(), ['architect-zzb7-09'])).toBe('builder-zzb7-01');
	});

	test('`taken` reserves within one render: two Builders never share a name', () => {
		const taken = new Set<string>();
		expect(nextStamp('Builder', theater, taken)).toBe('builder-zzb7-01');
		expect(nextStamp('Builder', theater, taken)).toBe('builder-zzb7-02');
	});
});

// ---------- trust ----------

describe('the folder-trust read', () => {
	test('trust is inherited: a worktree under a trusted repo is warm', () => {
		const t = readTrust(WORK);
		expect(trustOf(join(AGENTS, '.claude/worktrees/bv/x'), t)).toEqual({ warm: true, root: AGENTS });
	});

	test('the NEAREST opinion wins — a refusal under a trusted root is still a refusal', () => {
		expect(trustOf(BELVEDERE, readTrust(WORK))).toEqual({ warm: false, refused: BELVEDERE });
	});

	test('no opinion anywhere up the chain is cold, and says so without naming a refusal', () => {
		expect(trustOf(COLD, readTrust(WORK))).toEqual({ warm: false, refused: null });
	});

	test('trust is PER ACCOUNT: the same directory is warm on one silo and cold on another', () => {
		expect(trustOf(BELVEDERE, readTrust(PERSONAL))).toEqual({ warm: true, root: CITY });
		expect(trustOf(BELVEDERE, readTrust(WORK)).warm).toBe(false);
	});

	test('a non-boolean entry is no opinion, and a missing file is no opinions at all', () => {
		expect(readTrust(WORK).roots.has(join(CITY, 'noise'))).toBe(false);
		const none = readTrust(join(ROOT, 'no-such-account'));
		expect(none.roots.size).toBe(0);
		expect(trustOf(AGENTS, none)).toEqual({ warm: false, refused: null });
	});
});

// ---------- the plan ----------

describe('the plan', () => {
	test('an unset tier axis takes the mantle\'s preset from presets.tsv', () => {
		const p = plan(rig, draft({ where: BELVEDERE, mantle: 'Builder', summons: 'go' }));
		expect(p.tier).toBe('opus-high');
		expect(p.preset).toBe('opus-high');
	});

	test('an explicit axis overrides the preset, one axis at a time', () => {
		expect(plan(rig, draft({ where: BELVEDERE, mantle: 'Builder', effort: 'max', summons: 'go' })).tier).toBe('opus-max');
		expect(plan(rig, draft({ where: BELVEDERE, mantle: 'Builder', model: 'fable', summons: 'go' })).tier).toBe('fable-high');
	});

	test('an edited stamp survives a recompose while it still names the lineage', () => {
		const p = plan(rig, draft({ where: BELVEDERE, mantle: 'Builder', stamp: 'builder-belvedere-77', summons: 'go' }));
		expect(p.stamp).toBe('builder-belvedere-77');
	});

	test('a stamp that no longer names this lineage is re-minted, never fired as it stands', () => {
		const p = plan(rig, draft({ where: BELVEDERE, mantle: 'Architect', stamp: 'builder-belvedere-77', summons: 'go' }));
		expect(p.stamp.startsWith('architect-belvedere-')).toBe(true);
	});

	test('the composed body is exactly what `POST /hands/fire` parses', () => {
		const p = plan(rig, draft({ where: BELVEDERE, mantle: 'Builder', summons: 'go', account: 'work' }));
		expect('body' in p.fire && p.fire.body).toMatchObject({
			account: 'work', cwd: BELVEDERE, model: 'opus', effort: 'high', color: 'Aqua', summons: 'go',
		});
		expect(p.refusal).toBe(null);
	});

	test('no mantle blocks the fire, because a fire the glass cannot name is a fire it will not arm', () => {
		const p = plan(rig, draft({ where: BELVEDERE, summons: 'go' }));
		expect('blocked' in p.fire).toBe(true);
	});

	test('an empty summons blocks it: the fire IS the summons', () => {
		expect('blocked' in plan(rig, draft({ where: BELVEDERE, mantle: 'Builder' })).fire).toBe(true);
	});

	test('the trust verdict follows the chosen account, and the worktree path is what is asked about', () => {
		const warm = plan(rig, draft({ where: BELVEDERE, mantle: 'Builder', summons: 'go', account: 'personal' }));
		expect(warm.trust?.verdict.warm).toBe(true);
		const cold = plan(rig, draft({ where: BELVEDERE, mantle: 'Builder', summons: 'go', account: 'work' }));
		expect(cold.trust?.verdict.warm).toBe(false);
		expect(cold.trust?.where).toBe(BELVEDERE);
	});
});

// ---------- the page ----------

const composed = (over: Partial<Draft> = {}): Plan =>
	plan(rig, draft({ where: BELVEDERE, mantle: 'Builder', summons: 'go', ...over }));

describe('the rendered page', () => {
	test('no dropdowns, anywhere: every choice is a radio in a button group (design law §3)', () => {
		const html = form(composed(), rig, entries, usages, NOW) + planCard(composed(), true);
		expect(html).not.toContain('<select');
		for (const name of ['where', 'account', 'mantle', 'model', 'effort'])
			expect(html).toContain(`type="radio" class="pick" name="${name}"`);
	});

	test('the account group carries its own usage, beside the choice that spends it', () => {
		const html = form(composed(), rig, entries, usages, NOW);
		expect(html).toContain('40%');           // personal's session window
		expect(html).toContain('no cache');      // work has none, and says so rather than reading 0
	});

	test('the current selection comes back checked — the browser holds the state, not a script', () => {
		const html = form(composed({ effort: 'max' }), rig, entries, usages, NOW);
		expect(html).toMatch(/value="Builder" checked/);
		expect(html).toMatch(/name="effort" id="effort-5" value="max" checked/);
	});

	test('the fire button carries the exact body the page shows, and nothing it re-derived', () => {
		const p = composed();
		const html = planCard(p, true);
		const hit = /data-fire="([^"]*)"/.exec(html);
		const unesc = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
		expect(JSON.parse(unesc(hit![1]!))).toEqual('body' in p.fire ? p.fire.body : null);
	});

	test('cold hands leave the button in the DOM and disabled — "not this glass, yet"', () => {
		expect(planCard(composed(), false)).toMatch(/data-fire="[^"]*"\s*disabled/);
	});

	test('a blocked plan has no fire button at all — nothing a click could reach', () => {
		const html = planCard(plan(rig, draft({ mantle: 'Builder', summons: 'go' })), true);
		expect(html).not.toContain('data-fire');
		expect(html).toContain('pick a building');
	});

	test('a cold directory warns on the button and marks the fire as one that will stall', () => {
		const html = planCard(composed({ where: '', cwd: COLD, account: 'work' }), true);
		expect(html).toContain('untrusted directory');
		expect(html).toContain("wait on Claude's trust prompt");
		expect(html).toContain('data-cold="1"');
	});

	test('a warm directory names the root it inherited trust from, and carries no cold marker', () => {
		const html = planCard(composed({ account: 'personal' }), true);
		expect(html).toContain('warm — inherited from');
		expect(html).not.toContain('data-cold');
	});

	test('a worktree plan names the branch, the repo and the path before anything is cut', () => {
		const p = composed({ where: AGENTS, branch: 'bv/b7-unit' });
		const html = planCard(p, true);
		expect(html).toContain('cut first from');
		expect(html).toContain('bv/b7-unit');
		expect(html).toContain('data-worktree');
	});

	test('a branch named outside a git repo says so and fires in the target itself', () => {
		const html = planCard(composed({ where: '', cwd: COLD, account: 'personal', branch: 'x' }), true);
		expect(html).toContain('no worktree');
		expect(html).not.toContain('data-worktree');
		expect(html).toContain('data-fire');
	});

	test('an unfilled slot warns and still arms — the sovereign may mean those words', () => {
		const html = planCard(composed({ summons: 'then read <context>.' }), true);
		expect(html).toContain('unfilled slots');
		expect(html).toContain('data-fire');
	});
});
