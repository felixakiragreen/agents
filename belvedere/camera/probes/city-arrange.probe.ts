// **His arrangement, driven by a pointer** (B24) — the City reordered, relabeled, recolored and
// nested, with a real Chrome's mouse, and the file it wrote read back off disk.
//
// Run: bun camera/cli.ts run probes/city-arrange.probe.ts
//
// Five things, on one seeded city:
//
//  1. **The default view does not lie** (candidate 7). One section per neighborhood, ordered by
//     its loudest member — the invariant B14's rewrite dropped and this charge restored.
//  2. **A space is his to make.** `+ space`, a name he types, two buildings dragged into it.
//  3. **The file is the state.** `desk/city-arrangement.json` holds exactly what the page shows,
//     in his order, readable by a human.
//  4. **Attention outranks his order** (the standing law, README §3). The two buildings are
//     dropped quiet-first, and the loud one is still drawn first — the file keeps his order, the
//     page keeps the truth, and the deck says which is which.
//  5. **Nothing the census knows is absent.** A building minted after the arrangement exists shows
//     up in the unfiled tail, and one drag files it for good.
//
// The seeded city is the world (C19) and the twin's desk is the run's own copy, so this probe
// writes nothing outside a directory that is deleted when it ends (C19 F2, C15 F3).

import { cpSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import type { Probe } from '../probe';

export const fixture = true;

const CITY = '#host-context';
const space = (endsWith: string) => `${CITY} .sp:has(> .sp-h > .sp-row[data-building$="${endsWith}"])`;
const named = (name: string) => `${CITY} .sp:has(> .sp-h > .nb-name:text-is("${name}"))`;
const grip = (sel: string) => `${sel} > .sp-h > .sp-grip`;
const nth = (parent: string, i: number) => `${parent} > .sp-kids > .sp:nth-child(${i}) > .sp-h > .sp-row > .name`;

type Space = { id: string; name: string; color: string | null; type: string | null; binding: string | null; children: Space[] };

export default async function (p: Probe): Promise<void> {
	// One load first: `localStorage` belongs to an origin, and a page has to exist to have one (C17 F5).
	await p.goto('/deck');
	await p.remember('belvedere.deck.layout', { context: 'expanded', focus: 'minimal', action: 'minimal', drawer: 'shut' });
	await p.goto('/deck');
	await p.waitFor(`${CITY} .sp-row`);

	const desk = (JSON.parse((await p.ask('/desk/notes')).body) as { result: { dir: string } }).result.dir;
	const file = join(desk, 'city-arrangement.json');
	const arrangement = (): Space[] => (JSON.parse(readFileSync(file, 'utf8')) as { spaces: Space[] }).spaces;
	const flat = (ss: Space[]): string[] => ss.flatMap(s => [s.binding ?? `[${s.name}]`, ...flat(s.children)]);

	// ---------- 1. the default view: one section per neighborhood ----------

	const groups = await p.count(`${CITY} .sp-tree > .sp`);
	const rows = await p.count(`${CITY} .sp-row`);
	if (groups !== 3 || rows !== 3)
		throw new Error(`the seeded city is three buildings in three neighborhoods; the City drew ${groups} sections and ${rows} rows`);

	// ---------- 2. a space of his own ----------

	await p.click('[data-arr-toggle]');
	await p.waitFor('[data-arr-add=""]');
	await p.click('[data-arr-add=""]');
	await p.waitFor('[data-arr-name]');
	await p.type('[data-arr-name]', 'THG');
	// Leaving the box is what commits it — the same gesture Enter makes (`city.client.ts` §his words).
	// The headline is the inert place to put the pointer: a click there changes nothing else.
	await p.click(`${CITY} .headline`);
	await p.waitFor(named('THG'));

	// ---------- 3. two buildings in, quiet first ----------

	await p.drag(grip(space('/beta')), `${named('THG')} > .sp-h`);
	await p.waitFor(`${named('THG')} .sp-row[data-building$="/beta"]`);
	await p.drag(grip(space('/alpha')), `${named('THG')} > .sp-h`);
	await p.waitFor(`${named('THG')} .sp-row[data-building$="/alpha"]`);

	// The receipt is the write talking: an optimistic redraw looks identical until you read it.
	const said = await p.text('[data-out-for="city:arrangement"]');
	if (!said.startsWith('arrangement saved') && !said.startsWith('saved'))
		throw new Error(`the deck did not save the drag: "${said}"`);

	const his = arrangement();
	const thg = his.find(s => s.name === 'THG');
	if (!thg) throw new Error(`the file carries no space named THG:\n${JSON.stringify(his, null, 1)}`);
	if (thg.children.length !== 2) throw new Error(`THG holds ${thg.children.length} spaces on disk, not the two dragged in`);
	if (!thg.children[0]!.binding!.endsWith('/beta') || !thg.children[1]!.binding!.endsWith('/alpha'))
		throw new Error(`the file did not keep HIS order (beta dropped first): ${thg.children.map(c => c.binding).join(', ')}`);

	// ---------- 4. attention outranks his order, and the page says so ----------

	const first = await p.text(nth(named('THG'), 1));
	if (!first.endsWith('/alpha'))
		throw new Error(`alpha is the blocked-on-you building and must draw first inside his space; the first row is "${first}"`);

	// His words on one space: a color, and a label on a building that keeps its true name beside it.
	// A minted space opens its own strip, so this one is already open — `edit` would shut it.
	await p.click(`${named('THG')} [data-arr-color][data-intent="purple"]`);
	await p.waitFor(`${CITY} .sp[data-color="purple"]:has(> .sp-h > .nb-name:text-is("THG"))`);

	await p.click(`${space('/alpha')} > .sp-h > .sp-edit`);
	await p.type(`${space('/alpha')} [data-arr-name]`, 'the belvedere');
	await p.click(`${space('/alpha')} > .sp-h > .sp-edit`);
	await p.waitFor(`${space('/alpha')} > .sp-h > .sp-row > .sp-true`);
	const label = await p.text(`${space('/alpha')} > .sp-h > .sp-row > .name`);
	const trueName = await p.text(`${space('/alpha')} > .sp-h > .sp-row > .sp-true`);
	if (label !== 'the belvedere') throw new Error(`his label did not land: the row reads "${label}"`);
	if (!trueName.endsWith('/alpha'))
		throw new Error(`a relabeled building must still show the register's own name; it shows "${trueName}"`);
	const arranged = await p.shoot('city-arranged');

	// ---------- 5. a building the arrangement has never heard of ----------

	const city = dirname((JSON.parse((await p.ask('/deck/state')).body) as { register: { buildings: { path: string }[] } })
		.register.buildings[0]!.path);
	cpSync(join(city, 'beta'), join(city, 'delta'), { recursive: true });
	await p.ask('/rewalk');
	await p.goto('/deck');
	await p.waitFor(`${CITY} .sp-unfiled .sp-row[data-building$="/delta"]`);
	const tail = await p.count(`${CITY} .sp-unfiled .sp-row`);
	if (tail !== 1) throw new Error(`one building is unarranged and the tail holds ${tail}`);

	await p.drag(grip(`${CITY} .sp-unfiled .sp:has(.sp-row[data-building$="/delta"])`), `${named('THG')} > .sp-h`);
	await p.waitFor(`${named('THG')} .sp-row[data-building$="/delta"]`);
	if (await p.count(`${CITY} .sp-unfiled`) !== 0) throw new Error('the tail is still drawn after its last building was filed');
	const after = flat(arrangement());
	if (!after.some(b => b.endsWith('/delta'))) throw new Error(`filing did not persist: ${after.join(', ')}`);

	// ---------- 6. three deep, and the page still does not scroll ----------

	// The law of space (README §3): nesting may cost the pane its overflow and must never cost the
	// PAGE any. `body.deck` is a fixed two-row grid with `overflow: hidden`, and this is the
	// measurement that says so with a nest standing open inside it.
	await p.click(`${named('THG')} > .sp-h > .sp-edit`);
	await p.click(`${named('THG')} [data-arr-add]`);
	await p.waitFor('[data-arr-name]');
	await p.type('[data-arr-name]', 'inside');
	await p.click(`${CITY} .headline`);
	await p.drag(grip(`${named('THG')} .sp:has(> .sp-h > .sp-row[data-building$="/delta"])`), `${named('inside')} > .sp-h`);
	await p.waitFor(`${named('inside')} .sp-row[data-building$="/delta"]`);
	const deep = await p.count(`${CITY} .sp-tree > .sp .sp .sp .sp-row`);
	if (deep < 1) throw new Error('the three-deep nest did not draw');
	const page = await p.scrolled('body');
	if (page.top !== 0 || page.height > page.client)
		throw new Error(`the page scrolls with a nest open: top ${page.top}, content ${page.height} in ${page.client}`);
	const selects = await p.count('select');
	if (selects !== 0) throw new Error(`${selects} dropdowns on the deck — the design law says none`);

	console.log(`default     ${groups} neighborhoods, ${rows} buildings — one section per label`);
	console.log(`his file    ${file}`);
	console.log(`            ${after.join(' · ')}`);
	console.log(`the law     file order beta→alpha, drawn order alpha→beta — attention outranks his order`);
	console.log(`law of space three deep, page scroll ${page.top} px, content ${page.height} in ${page.client} · ${selects} <select> on the deck`);
	console.log(arranged);
	console.log(await p.shoot('city-arranged-filed'));
}
