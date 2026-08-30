// The bill on the wall, lit from seeded numbers: one account near its cap and burning, one with
// headroom, one whose cache went stale — and the WIP roster figures that only ever read as floors.
//
// Run: bun camera/cli.ts run probes/fixture-gauges.probe.ts
//
// These are the states nobody can wait for: an account at 91% arrives when it arrives, and a
// capped background roster needs sixteen live shells. The seeder mints both at boot — timestamps
// generated so nothing is stale by the time it renders, pids the camera's own so the census's
// `kill -0` says alive for exactly the probe's life.

import type { Probe } from '../probe';

export const fixture = true;

export default async function (p: Probe): Promise<void> {
	await p.goto('/shelf');
	await p.waitFor('.gauge');

	const near = (await p.text('.uline')).replace(/\s+/g, ' ');
	const burning = await p.count('.uline .delta.burning');
	const stale = await p.count('.uline.stale');
	const lines = await p.count('.uline');
	const subagents = await p.text('.counts b.t-working');
	const shells = await p.text('.counts b.t-idle');
	const wlines = await p.count('.wline');

	if (!near.includes('91%')) throw new Error(`the near-cap account should lead the strip: "${near}"`);
	if (burning < 1) throw new Error('nothing on the strip is burning — the pacing delta never went negative');
	if (stale !== 1) throw new Error(`one seeded cache is an hour old and should grey; ${stale} did`);
	if (lines !== 3) throw new Error(`one line per account in the rig's table; the strip drew ${lines}`);
	// `16+` and `3+`, never `16` and `3`: the hook slices the roster at 16, so every figure it
	// feeds is a floor and the `+` is the whole point (B5 F2).
	if (!shells.endsWith('+')) throw new Error(`the capped roster must render "n+", it rendered "${shells}"`);
	if (!subagents.endsWith('+')) throw new Error(`the subagent floor must render "n+", it rendered "${subagents}"`);
	if (wlines < 3) throw new Error(`three accounts and two lit buildings make 5 WIP lines; the page drew ${wlines}`);

	console.log(`usage      ${near}`);
	console.log(`wip        subagents ${subagents} · background shells ${shells} · ${wlines} lines`);
	console.log(await p.shoot('fixture-gauges-usage'));
	await p.scroll('.wgrid');
	console.log(await p.shoot('fixture-gauges-wip'));
}
