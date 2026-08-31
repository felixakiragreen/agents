// D10 in pixels: a ⬡ card carries no button, and the card beside it carries two.
//
// Run: bun camera/cli.ts run probes/fixture-rail.probe.ts
//
// The real city produces this pair when it happens to; the fixture produces it every time.
// Alpha's ledger tail hands its baton to Felix and its board raises a ⬡-gate; beta's tail hands
// a fork to the next session. Both land on one rail, and the whole law is countable.

import type { Probe } from '../probe';

export const fixture = true;

export default async function (p: Probe): Promise<void> {
	await p.goto('/');
	await p.waitFor('article.rail');

	// The control: this is the seeded city, not Felix's. Three buildings, four live sessions.
	const strip = (await p.text('.strip')).replace(/\s+/g, ' ');
	if (!strip.includes('buildings3')) throw new Error(`this is not the fixture city — the strip reads "${strip}"`);

	const wired = await p.count('article[data-kind="baton"][data-holder="session"] button[data-ignite]');
	const his = await p.count('article[data-holder="felix"] button[data-ignite]');
	const gates = await p.count('article[data-kind="gate"]');
	const hisBatons = await p.count('article[data-kind="baton"][data-holder="felix"]');
	const shape = await p.text('article[data-kind="baton"][data-holder="session"] .rail-h');

	// **Structurally unwired, not disabled** (B3's law, D10's sharpening): nothing on any card of
	// his may reach `/hands/ignite`, and the count is the assertion — a card cannot half-carry one.
	if (his !== 0) throw new Error(`${his} ignite button(s) on Felix's cards — D10 says ambiguity never arms`);
	if (wired !== 2) throw new Error(`the fork should offer 2 Dispatch buttons, the rail drew ${wired}`);
	if (gates !== 2) throw new Error(`alpha raises 2 ⬡-gates (the staffing and the depends-on); the rail drew ${gates}`);
	if (hisBatons !== 1) throw new Error(`alpha's ⬡-held baton should be one card; the rail drew ${hisBatons}`);
	if (!shape.includes('fork')) throw new Error(`beta's baton is a fork and the card does not say so: "${shape}"`);

	console.log(`⬡ cards    ${gates} gates + ${hisBatons} baton · ${his} ignite buttons between them`);
	console.log(`dispatch   ${wired} buttons on beta's fork`);

	// Two frames, because the pair does not fit in one: the rail ranks ignitable cards above his,
	// and beta's fork alone is taller than the viewport. Same twin, same page, one scroll apart.
	console.log(await p.shoot('fixture-rail-dispatch'));
	await p.scroll('article[data-kind="baton"][data-holder="felix"]');
	console.log(await p.shoot('fixture-rail-hex'));
}
