// **His arrangement, on the real register** (B24's live half) — the four gestures the charge names,
// against the city as it actually stands, in a real Chrome, with a real pointer.
//
// Run: bun camera/cli.ts run probes/city-arrange-real.probe.ts
//
// Not in the standing family, and for B23 F12's reason: it reads the live register and the live
// census, two trees other processes write, and it names real buildings. `city-arrange.probe.ts` is
// this charge's hermetic half and that is the one that stands. This one is the live evidence — run
// it by hand when the arrangement layer is touched.
//
// The twin's desk is the camera's scratch drawer (`twin.ts` §SCRATCH_DESK), so the real
// `~/code/agents/desk/` is not written here: the register is real, the writing is not.

import { existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import type { Probe } from '../probe';
import { SCRATCH_DESK } from '../twin';

const CITY = '#host-context';
const space = (building: string) => `${CITY} .sp:has(> .sp-h > .sp-row[data-building="${building}"])`;
const named = (name: string) => `${CITY} .sp:has(> .sp-h > .nb-name:text-is("${name}"))`;
const grip = (sel: string) => `${sel} > .sp-h > .sp-grip`;
const label = (building: string) => `${space(building)} > .sp-h > .sp-row > .name`;

/** Two siblings in one neighborhood that want the same thing from him — where his order decides. */
const A = 'rooted/archive/blossom';
const B = 'rooted/archive/repot';
const FILE = join(SCRATCH_DESK, 'city-arrangement.json');

type Space = { id: string; name: string; color: string | null; type: string | null; binding: string | null; children: Space[] };
const flat = (ss: Space[]): string[] => ss.flatMap(s => [s.binding ?? `[${s.name}]`, ...flat(s.children)]);

export default async function (p: Probe): Promise<void> {
	// The scratch drawer outlives a run, so clearing it is what makes every assertion below about
	// THIS run's writing (`inbox-knob.probe.ts`'s own law).
	rmSync(FILE, { force: true });

	await p.goto('/deck');
	await p.remember('belvedere.deck.layout', { context: 'typical', focus: 'minimal', action: 'minimal', drawer: 'shut' });
	await p.goto('/deck');
	await p.waitFor(`${CITY} .sp-row`);

	const before = await p.count(`${CITY} .sp-tree > .sp`);
	const rows = await p.count(`${CITY} .sp-row`);
	console.log(`register    ${rows} buildings in ${before} neighborhoods — one section per label`);
	const plain = await p.shoot('city-real-before');

	await p.click('[data-arr-toggle]');
	await p.waitFor(grip(space(A)));

	// ---------- 1. reorder two buildings ----------

	const order = async (): Promise<string> => `${await p.text(label(A))} | ${await p.text(label(B))}`;
	const wasFirst = await p.text(`${named('~/code/rooted')} > .sp-kids > .sp:nth-child(1) > .sp-h > .sp-row > .name`);
	await p.drag(grip(space(B)), `${space(A)} > .sp-h`);
	// The receipt, read out loud: the page prints what the write said, and a probe that never looks
	// at it cannot tell an optimistic redraw from a saved arrangement (B24 F3 was exactly that).
	const said = await p.text('[data-out-for="city:arrangement"]');
	if (!said.startsWith('arrangement saved') && !said.startsWith('saved'))
		throw new Error(`the deck did not save the move: "${said}"`);
	const nowFirst = await p.text(`${named('~/code/rooted')} > .sp-kids > .sp:nth-child(1) > .sp-h > .sp-row > .name`);
	if (nowFirst === wasFirst) throw new Error(`the reorder changed nothing: ${wasFirst} is still first`);
	if (nowFirst !== B) throw new Error(`${B} was dropped onto ${A} and must sit before it; the first row is ${nowFirst}`);

	// ---------- 2. relabel one ----------

	await p.click(`${space('agents/belvedere')} > .sp-h > .sp-edit`);
	await p.type(`${space('agents/belvedere')} [data-arr-name]`, 'the glass');
	await p.type(`${space('agents/belvedere')} [data-arr-type]`, 'the deck itself');
	await p.click(`${CITY} .headline`);
	await p.waitFor(`${space('agents/belvedere')} > .sp-h > .sp-row > .sp-true`);

	// ---------- 3. recolor one ----------

	await p.click(`${named('~/code/agents')} > .sp-h > .sp-edit`);
	await p.click(`${named('~/code/agents')} [data-arr-color][data-intent="purple"]`);
	await p.waitFor(`${CITY} .sp[data-color="purple"]`);
	await p.click(`${named('~/code/agents')} > .sp-h > .sp-edit`);

	// ---------- 4. nest two under a new group of his naming ----------

	await p.click('[data-arr-add=""]');
	await p.waitFor('[data-arr-name]');
	await p.type('[data-arr-name]', 'THG');
	await p.click(`${CITY} .headline`);
	await p.waitFor(named('THG'));
	await p.drag(grip(space('universal_robots_sdk/bob')), `${named('THG')} > .sp-h`);
	await p.waitFor(`${named('THG')} .sp-row[data-building="universal_robots_sdk/bob"]`);
	await p.drag(grip(space('universal_robots_sdk/cap-mega/simmy')), `${named('THG')} > .sp-h`);
	await p.waitFor(`${named('THG')} .sp-row[data-building="universal_robots_sdk/cap-mega/simmy"]`);

	// ---------- all four, still there after the server's own next paint ----------

	// The client draws its own edit at once; three seconds later the poll replaces the snapshot with
	// what the server read back off disk. Everything below this line is the FILE talking.
	await p.wait(4000);
	if (await p.text(label('agents/belvedere')) !== 'the glass') throw new Error('the label did not survive the poll');
	if (await p.count(`${CITY} .sp[data-color="purple"]`) !== 1) throw new Error('the color did not survive the poll');
	if (await p.count(`${named('THG')} .sp-row`) !== 2) throw new Error('the nest did not survive the poll');
	const after = await p.text(`${named('~/code/rooted')} > .sp-kids > .sp:nth-child(1) > .sp-h > .sp-row > .name`);
	if (after !== B) throw new Error(`the reorder did not survive the poll: ${after} is first`);

	if (!existsSync(FILE)) throw new Error(`nothing was written to ${FILE}`);
	const spaces = (JSON.parse(readFileSync(FILE, 'utf8')) as { spaces: Space[] }).spaces;
	const bound = flat(spaces).filter(b => !b.startsWith('['));
	if (bound.length !== rows) throw new Error(`${rows} buildings on the register, ${bound.length} in his file — an arrangement may hide nothing`);

	console.log(`reorder     ${await order()} — ${B} dropped onto ${A}, and it sits before it`);
	console.log(`relabel     agents/belvedere reads "the glass", with its register name beside it`);
	console.log(`recolor     ~/code/agents wears purple`);
	console.log(`nest        THG holds bob and simmy`);
	console.log(`file        ${FILE} · ${readFileSync(FILE, 'utf8').length} B · ${bound.length} buildings, none lost`);
	console.log(plain);
	console.log(await p.shoot('city-real-arranged'));
}
