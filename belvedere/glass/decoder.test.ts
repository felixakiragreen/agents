// The resolver, pinned against a fixture city (B20 §2). Local first, then canon; ambiguity and
// absence both answer honestly and name what was looked at.
//
// **It never warms the register.** `register.ts` holds one copy for the whole process and does not
// remember which city it walked (B15 F4), so a suite that pointed it at a second fixture would
// silently decide `deck.test.ts`'s results. `decode()` takes its entries as an argument for exactly
// that reason; the served route is proven over a real server in `lab/b20/`.

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { discover } from '../../doctrine';
import { detect } from './decode';
import { decode, decodeQuery } from './decoder';
import type { Entry } from './register';

const ROOT = mkdtempSync(join(tmpdir(), 'b20-decoder-'));
const CANON = join(ROOT, 'agents');          // `canonRoot()` is `<city>/agents` — the canon repo
const SHOP = join(ROOT, 'shop');
const MAP = join(CANON, 'MAP.md');
const SHOP_BOARD = join(SHOP, 'README.md');
const SHOP_DECISIONS = join(SHOP, 'DECISIONS.md');

const before: Record<string, string | undefined> = {};

beforeAll(() => {
	before['GLASS_CITY'] = process.env.GLASS_CITY;
	process.env.GLASS_CITY = ROOT;
	mkdirSync(join(CANON, 'plans'), { recursive: true });
	mkdirSync(join(SHOP, 'plans'), { recursive: true });

	// The canon board: bare-numeral row ids, which is exactly why the keyword form exists.
	writeFileSync(MAP, `# the canon map

## 1. The register

The city, listed.

## 3. The boards

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 14 | [summon rig — the theater cycle](plans/14-rig.md) | 13 | Builder · opus-high | OPEN — cut on his ask |
| 17 | the storage experiment — structured source vs schema-markdown | 16 | Digger · fable-high | OPEN — decided by numbers, never decree |
`);
	writeFileSync(join(CANON, 'DECISIONS.md'), `# canon decisions

- **D1** (2026-08-01, Grand Architect (01) · ✓ Felix): **The canon repo.** One repo carries the Guild.
- **D63** (2026-08-26, Grand Architect (10) · ✓ Felix): **The schema fold.** Nine format amendments, every one blessing what the field already does.
`);
	writeFileSync(join(CANON, 'plans/14-rig.md'), '# 14 — the rig\n\nA fixture work doc.\n');

	writeFileSync(SHOP_BOARD, `# shop — the fixture building

## 2. The fence

Read-everything, write-narrow.

## 5. Working agreements

The venue is this subdirectory, and D2 is the ruling that says so.

## 6. The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| B18 | [Live identity](plans/b18.md) — cmux is truth | — | Builder · opus-high | LANDED — nothing escalated; the ruling rides D2 and canon row 17 |
| B20 | The decoder — every code word one hover away | B18 | Builder · opus-high | OPEN |
| G2 | The gate | B20 · Felix-gate: the visual pass | Felix-gate | OPEN |
`);
	writeFileSync(SHOP_DECISIONS, `# shop — decisions

- **D2** (2026-08-26, Architect (01)): **Venue.** at \`shop/\`, simmy pattern (proposed — pending Felix countersign)
- **D5** (2026-08-27, Architect (02) · ✓ Felix): **The striking law.** Every law can be struck.
`);
	writeFileSync(join(SHOP, 'ISSUES.md'), '# Issues\n\n---\n\n- 2026-08-27 · Felix · a field report\n');
	writeFileSync(join(SHOP, 'plans/b18.md'), '# b18\n\nA fixture work doc.\n');
});

afterAll(() => {
	if (before['GLASS_CITY'] === undefined) delete process.env.GLASS_CITY;
	else process.env.GLASS_CITY = before['GLASS_CITY'];
	rmSync(ROOT, { recursive: true, force: true });
});

const entries = (): Entry[] =>
	discover([ROOT]).map(b => ({ building: b.building, path: b.path, files: b.files }));

/** One reference, read the way the page writes it — through the same detector the route uses. */
function at(text: string, inPath: string | null, word: string | null = null) {
	const t = detect(text)[0];
	if (!t) throw new Error(`the detector found no reference in "${text}"`);
	return decode({ ...t, scope: t.scope ?? word }, inPath, entries());
}

describe('rows', () => {
	test('a row id resolves to its encapsulation, its status and its plan', () => {
		const d = at('B18', SHOP_BOARD);
		expect(d.ok).toBe(true);
		if (!d.ok) return;
		expect(d.headline).toBe('Live identity');
		expect(d.status).toBe('LANDED · Builder · opus-high');
		expect(d.body).toContain('nothing escalated');
		expect(d.where.path).toBe(SHOP_BOARD);
		expect(d.plan?.path).toBe(join(SHOP, 'plans/b18.md'));
	});

	test('a Felix-gate row says so in its status rather than naming a mantle it has none of', () => {
		const d = at('G2', SHOP_BOARD);
		expect(d.ok && d.status).toBe('OPEN · ⬡-gate');
	});

	test('`canon row 17` crosses to the canon board; the keyword is what anchors a bare numeral', () => {
		const d = at('row 17', SHOP_BOARD, 'canon');
		expect(d.ok).toBe(true);
		if (!d.ok) return;
		expect(d.building).toBe(entries().find(e => e.path === CANON)!.building);
		expect(d.headline).toBe('the storage experiment');
		expect(d.where.path).toBe(MAP);
	});

	test('a bare `row 14` in a canon doc resolves locally', () => {
		const d = at('row 14', MAP);
		expect(d.ok && d.headline).toBe('summon rig');
	});

	test('a word that names no building is not a scope — the reference falls back to its own doc', () => {
		// `narrower than row 14`: the detector hands over `than`, which names nothing, so the local
		// board answers. Prose is not allowed to become a scope by standing in the right place.
		const d = at('narrower than row 14', MAP);
		expect(d.ok && d.headline).toBe('summon rig');
	});

	test('an explicit scope does NOT fall back to canon — a miss there is a miss', () => {
		const d = at('row 17', SHOP_BOARD, 'shop');
		expect(d.ok).toBe(false);
		if (d.ok) return;
		expect(d.reason).toContain('no charge 17');
	});
});

describe('decisions', () => {
	test('a local D-id is the local building’s', () => {
		const d = at('D2', SHOP_BOARD);
		expect(d.ok).toBe(true);
		if (!d.ok) return;
		expect(d.headline).toBe('Venue');
		expect(d.status).toContain('pending');
		expect(d.where.path).toBe(SHOP_DECISIONS);
	});

	test('a D-id the local building does not carry falls through to canon — by looking, not by range', () => {
		const d = at('D63', SHOP_BOARD);
		expect(d.ok).toBe(true);
		if (!d.ok) return;
		expect(d.headline).toBe('The schema fold');
		expect(d.where.path).toBe(join(CANON, 'DECISIONS.md'));
	});

	test('a pending decision carries the countersign gesture, with the exact bytes previewed', () => {
		const d = at('D2', SHOP_BOARD);
		expect(d.ok).toBe(true);
		if (!d.ok) return;
		const g = d.gestures.find(x => x.kind === 'countersign');
		expect(g).toBeDefined();
		expect(g && g.kind === 'countersign' && g.preview).toMatch(/^- \d{4}-\d{2}-\d{2} · Felix \(via Belvedere\) · bless D2: ✓$/);
		expect(g && g.kind === 'countersign' && g.building).toBe(SHOP);
	});

	test('a countersigned decision offers no countersign — only the note every object carries', () => {
		const d = at('D5', SHOP_BOARD);
		expect(d.ok).toBe(true);
		if (!d.ok) return;
		expect(d.status).toContain('folded');
		expect(d.gestures.map(g => g.kind)).toEqual(['note']);
	});

	test('an out-of-range id is unresolved and names both ranges it read', () => {
		const d = at('D99', SHOP_BOARD);
		expect(d.ok).toBe(false);
		if (d.ok) return;
		expect(d.candidates.some(c => c.endsWith('D2–D5'))).toBe(true);
		expect(d.candidates.some(c => c.endsWith('D1–D63'))).toBe(true);
	});
});

describe('sections', () => {
	test('§N resolves against the document it was written in, line-anchored', () => {
		const d = at('§5', SHOP_BOARD);
		expect(d.ok).toBe(true);
		if (!d.ok) return;
		expect(d.headline).toBe('Working agreements');
		expect(d.where.path).toBe(SHOP_BOARD);
		expect(d.body).toContain('D2 is the ruling');
	});

	test('the same §N in another document is that document’s section', () => {
		const d = at('§3', MAP);
		expect(d.ok && d.headline).toBe('The boards');
	});

	test('a § with no document, and a § the document has not got, both say so', () => {
		expect(at('§5', null).ok).toBe(false);
		const missing = at('§9', SHOP_BOARD);
		expect(missing.ok).toBe(false);
		if (missing.ok) return;
		expect(missing.candidates).toContain('§5 Working agreements');
	});
});

describe('what the resolver refuses', () => {
	test('FC and GA are detected and deliberately not resolved — the corpus has no field for them', () => {
		const fc = at('FC-1', SHOP_BOARD);
		expect(fc.ok).toBe(false);
		if (fc.ok) return;
		expect(fc.reason).toContain('no field for it');
		expect(at('GA-10', SHOP_BOARD).ok).toBe(false);
	});

	test('the route re-detects the query rather than trusting it', () => {
		const junk = decodeQuery(new URLSearchParams({ t: 'rm -rf /' }));
		expect(junk.ok).toBe(false);
		if (junk.ok) return;
		expect(junk.reason).toContain('not a reference');
		expect(decodeQuery(new URLSearchParams({ t: '' })).ok).toBe(false);
	});

	test('a document outside the city is refused, not silently dropped', () => {
		const out = decodeQuery(new URLSearchParams({ t: 'D2', in: '/etc/passwd' }));
		expect(out.ok).toBe(false);
		if (out.ok) return;
		expect(out.reason).toContain('outside the city');
	});
});
