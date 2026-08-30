// The City View, shot. The simplest probe there is, and the one a new deck charge copies.
//
// Run: bun camera/cli.ts run probes/city.probe.ts

import type { Probe } from '../probe';

export default async function (p: Probe): Promise<void> {
	await p.goto('/city');
	await p.waitFor('.card');

	// The control: a probe that shoots a page it never confirmed rendered is shooting a blank.
	const strip = await p.text('.strip');
	if (!strip.includes('buildings')) throw new Error(`/city drew no buildings stat — this is not the City View:\n${strip}`);

	console.log(await p.shoot('city'));
}
