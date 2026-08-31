// **The baton, on Belvedere** (B26 — Felix's report, verbatim: *"an agent finished, handed a baton,
// and I can't see that anywhere or act on it anywhere in belvedere"*).
//
// Run: bun camera/cli.ts run probes/baton.probe.ts
//
// Three facts, all on one seeded page at one moment:
//
//  1. **A baton is attention.** The two seeded ledger tails raise a City badge each and stand as two
//     queue items — one computation, two renderings (D15), so a badge can never count what the queue
//     does not list.
//  2. **The holder decides what the item says, and nothing else does.** alpha's tail hands it to
//     Felix and names no instrument; beta's hands a **fork** and names its recommendation (D64).
//  3. **Nothing here ignites** (D10). Every control on a baton item is `compose` — which loads the
//     instrument's bytes into the composer, where the knobs resolve and Felix's own click is the
//     hand — or `copy`, which is reading. The drawer carries zero ignite wiring, and the fourth act
//     proves the composer really received the bytes the item showed.
//
// The seeded city is the world (`fixtures/city/`, C19): alpha and beta are written, not generated,
// so the fork and the Felix-holder clause are bytes in git rather than states this probe had to
// wait for. Nothing it reads is a tree another process writes (B23 F12's law).

import type { Probe } from '../probe';

export const fixture = true;

/** What the seeded tails say, read by the id each item leads with (`attention.ts` §batonItem). */
const HIS = 'A6';        // alpha — "the ⬡-gate on A6 — Felix reads the diff…", no instrument
const FORK = 'B1';       // beta  — "ignite B2 or ignite B3 — the fork is exclusive… Recommendation: B2."

const item = (id: string) => `#host-drawer .qi[data-kind="baton"]:has(.qname:has-text("${id}"))`;

export default async function (p: Probe): Promise<void> {
	// Pinned: the state Felix reads a baton in, with the City still beside it. (B26 F6's scrim wall is
	// gone — B24 dropped `z-index: 1` from `.app` and `probes/drawer-click.probe.ts` stands over it —
	// so this is a choice about what to photograph, no longer a workaround.)
	// One load first: `localStorage` belongs to an origin, and a page has to exist to have one (C17 F5).
	await p.goto('/deck');
	await p.remember('belvedere.deck.layout', { context: 'typical', focus: 'minimal', action: 'minimal', drawer: 'pinned' });
	await p.goto('/deck');
	await p.waitFor('#host-context .row');

	// ---------- 1. a baton is attention, ambient and ranked ----------

	// Scoped to the rows: the legend teaches the badge too, and a sample is not a building (B21 F2).
	const badges = await p.count('#host-context .row .badge.b-baton');
	if (badges !== 2)
		throw new Error(`two seeded tails hand a baton, so the City wears 2 baton badges; it wears ${badges}`);

	await p.waitFor('#host-drawer .qi');

	const items = await p.count('#host-drawer .qi[data-kind="baton"]');
	if (items !== badges)
		throw new Error(`the badges say ${badges} and the queue lists ${items} — the badges ARE the queue, bucketed (D15)`);

	// ---------- 2. the holder decides what the item says ----------

	const hisPill = await p.text(`${item(HIS)} .pill`);
	if (!hisPill.includes('Felix'))
		throw new Error(`alpha's tail hands the next move to Felix and names no instrument; the item calls it "${hisPill}"`);

	const hisOptions = await p.count(`${item(HIS)} .qopt`);
	if (hisOptions !== 0)
		throw new Error(`a Felix-holder baton names no instrument, so there is nothing to open; ${hisOptions} option(s) were drawn`);

	await p.click(`${item(FORK)} .more > summary`);
	await p.waitFor(`${item(FORK)} .qopt`);

	const shape = await p.text(`${item(FORK)} .qi-h .pill:nth-of-type(2)`);
	if (shape !== 'fork')
		throw new Error(`beta's clause says the two roads are exclusive, so D64's shape is a fork; the item says "${shape}"`);

	const options = await p.count(`${item(FORK)} .qopt`);
	const recommended = await p.count(`${item(FORK)} .qopt .pill`);
	if (options !== 2 || recommended !== 1)
		throw new Error(`a fork is a choice with exactly one recommendation (D64): ${options} option(s), ${recommended} recommended`);

	console.log(`badges     ${badges} on the City · ${items} in the ⬡-queue · one computation`);
	console.log(`his        ${hisPill} · ${hisOptions} instruments — nothing to open, and it says so`);
	console.log(`the fork   ${shape} · ${options} options · ${recommended} recommended`);
	console.log(await p.shoot('baton-queue'));

	// ---------- 3. nothing here ignites (D10) ----------

	const wired = await p.count('#host-drawer [data-ignite], #host-drawer [data-apply]');
	if (wired !== 0)
		throw new Error(`${wired} ignite wire(s) in the ⬡-queue — nothing in the drawer may reach the spawning hand (D10)`);

	const composes = await p.count('#host-drawer [data-compose-with]');
	const copies = await p.count('#host-drawer [data-copy-option]');
	if (composes !== 2 || copies !== 2)
		throw new Error(`each of the fork's two options carries compose and copy; found ${composes} and ${copies}`);

	// ---------- 4. the composer really receives the bytes the item showed ----------

	// The recommendation's own option, aimed at by the pill it wears rather than by its position:
	// D64 says the clause names the recommendation, and it is the one Felix would reach for.
	const aim = `${item(FORK)} .qopt:has(.pill)`;
	const shown = await p.text(`${aim} [data-summons]`);
	if (!shown.startsWith('You are a '))
		throw new Error(`the option's bytes are a summons fence read off the charge doc; they begin ${JSON.stringify(shown.slice(0, 40))}`);

	// Action is `minimal` at rest and a minimal pane hides the summons box, so a click that loaded the
	// bytes into a shut pane is a button that did nothing. The click opens what it filled.
	await p.click(`${aim} [data-compose-with]`);
	await p.waitFor('#host-action textarea.summons-in');
	const opened = await p.text('#pane-action .states [data-on="yes"]');
	const held = (await p.value('#host-action textarea.summons-in')).trim();

	if (held !== shown)
		throw new Error(`the composer holds different bytes than the item showed:\n  shown ${shown.length} chars ${JSON.stringify(shown.slice(0, 60))}\n  held  ${held.length} chars ${JSON.stringify(held.slice(0, 60))}`);

	// The last half of D10, and the twin is the instrument: hands cold, so even the one file that may
	// ignite draws no button. What stands where it would is the reason (the honest-disabled law).
	const button = await p.count('#host-action [data-ignite]');
	if (button !== 0)
		throw new Error(`the twin is disarmed and the composer drew ${button} ignite button(s) — a cold hand must draw a reason, never a control`);

	console.log(`d10        ${wired} ignite wires in the drawer · ${composes} compose · ${copies} copy`);
	// The law of space survives the pane that just opened (B13's 0 px bar).
	const page = await p.scrolled('body');
	if (page.top !== 0 || page.height > page.client)
		throw new Error(`the deck scrolled: top ${page.top}, content ${page.height} in a ${page.client} viewport`);

	console.log(`composer   ${held.length} chars held ≡ ${shown.length} shown · action opened to "${opened}" · ${button} ignite buttons on cold hands`);
	console.log(`space      page scroll ${page.top} px · content ${page.height} ≤ viewport ${page.client}`);
	console.log(await p.shoot('baton-composer'));
}
