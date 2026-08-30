// One building from the inside — `/b/agents`, the canon repo's own page.
//
// Run: bun camera/cli.ts run probes/building.probe.ts

import type { Probe } from '../probe';

export default async function (p: Probe): Promise<void> {
	await p.goto('/b/agents');
	await p.waitFor('table');

	// The control: `/b/<slug>` answers a 404 page for a building off the register, and a 404 page
	// also has a header. What separates them is the crumb.
	const crumbs = await p.text('header nav');
	if (!crumbs.includes('agents')) throw new Error(`/b/agents did not open the agents building — the crumb says "${crumbs}"`);

	console.log(await p.shoot('building-agents'));
}
