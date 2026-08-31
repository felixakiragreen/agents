// **An OPEN drawer's controls can be clicked** (B26 F6, fixed at B24's first act).
//
// Run: bun camera/cli.ts run probes/drawer-click.probe.ts
//
// The defect this holds down was invisible to every unit test and to every probe that pinned the
// drawer instead of opening it: `.app` carried `z-index: 1`, which is a stacking context, so the
// drawer's `z-index: 30` was scoped inside it while `#scrim` is a root-level sibling at `20`. The
// scrim painted over the whole app, drawer included, and Chrome's own hit test refused every click
// in it for ten seconds before timing out. Two probes worked around it in comments (C16's
// `chat-engine`, B26's `baton`); nothing asserted it.
//
// So this probe insists on the hazard's own precondition — **the scrim is painted** — and then
// clicks two real controls under it: a disclosure, and the `file it` gesture, which is a wire that
// reaches the server. Pinning would prove nothing, because pinning draws no scrim.
//
// The seeded city is the world (C19), so the write `file it` makes lands in the run's own copy and
// the deck's own receipt is the evidence that the click arrived (C15 F3, C19 F2).

import type { Probe } from '../probe';

export const fixture = true;

/** The first queue item that draws a note box — a gate, an escalation or a baton (`deck.client.ts`). */
const ITEM = '#host-drawer .qi:has(.qnote)';

export default async function (p: Probe): Promise<void> {
	// One load first: `localStorage` belongs to an origin, and a page has to exist to have one (C17 F5).
	await p.goto('/deck');
	await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'minimal', action: 'minimal', drawer: 'open' });
	await p.goto('/deck');

	// The precondition, asserted rather than assumed: an open drawer paints the scrim, and the scrim
	// is what used to eat the clicks below. `waitFor` waits for *visible*, so a `hidden` scrim fails
	// here — which would mean this probe was measuring a pinned drawer and proving nothing.
	await p.waitFor('#scrim');
	await p.waitFor(ITEM);
	const shut = await p.count('#host-drawer .qi .more[open]');
	if (shut !== 0) throw new Error(`the drawer opened with ${shut} disclosure(s) already open — this probe cannot tell its own click apart`);

	// 1. a disclosure, under the scrim
	await p.click(`${ITEM} .more > summary`);
	if (await p.count('#host-drawer .qi .more[open]') !== 1)
		throw new Error('clicking [expand] on an open drawer opened nothing');

	// 2. a wire, under the scrim. `file it` is B6's one append, and under `--fixture` it lands in the
	// run's own copied city — the real inbox is unreachable from here (C19 F2).
	await p.click(`${ITEM} .qnote > summary`);
	await p.type(`${ITEM} .qnote textarea`, 'B24 drawer-click probe — the scrim no longer intercepts.');
	const armed = await p.shoot('drawer-click-armed');
	await p.click(`${ITEM} .qnote button`);

	let receipt = '';
	for (let i = 0; i < 200 && !receipt.startsWith('filed'); i++) receipt = await p.text(`${ITEM} [data-out-for]`);
	if (!receipt.startsWith('filed')) throw new Error(`the gesture never filed from an open drawer: "${receipt}"`);

	console.log(`scrim       painted, and both controls under it answered`);
	console.log(`receipt     ${receipt.replace(/\s+/g, ' ')}`);
	console.log(armed);
	console.log(await p.shoot('drawer-click-filed'));
}
