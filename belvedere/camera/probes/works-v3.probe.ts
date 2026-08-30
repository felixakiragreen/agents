// The Works, drawing a real v3 run — the deck's engine lane after the v2 retirement (C15).
//
// Run: bun camera/cli.ts run probes/works-v3.probe.ts
//
// This one deliberately reads the REAL city, because the thing under the lens is a real landed
// run: `summon/log/v3/c10/rehearsal`, three sonnet steps that ran on the `personal` account at
// C10's rehearsal. The twin is disarmed before the browser opens and the Works is read-only by
// construction — no arm, no tick, no pass — so a probe here can click every node on the page and
// still spawn nothing.
//
// What it proves, in the pixels and in words:
//   · the pane draws v3 runs at all, with the run picker, the ranks and the NOW line intact;
//   · a node's word is the engine's verdict (`landed done`), not a board state;
//   · the account rides the run (C14's shape) and the drawing says where it came from;
//   · the frozen kickoff renders as bytes on a picked node;
//   · **nothing on the pane can fire or drive** — zero fire wiring, zero arm control.

import type { Probe } from '../probe';

const RUN = 'c10/rehearsal';

export default async function (p: Probe): Promise<void> {
	// The deck's own memory is how a building and a tenant are chosen — the same keys a click
	// writes (`deck.client.ts:52–62`), never a probe-only route into the app (C17 F5).
	await p.goto('/deck');
	await p.remember('belvedere.deck.building', 'agents');
	await p.remember('belvedere.deck.focus', 'works');
	await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'expanded', action: 'typical', drawer: 'shut' });
	await p.goto('/deck');
	await p.waitFor('.graph');

	// The picker is ordered newest-first and the barrage's own runs are the newest things in the
	// tree, so the rehearsal is chosen the way Felix would choose it: by clicking its button.
	await p.click(`[data-flow="${RUN}"]`);
	await p.waitFor(`[data-flow="${RUN}"][data-on="yes"]`);

	const nodes = await p.count('.graph .node');
	const landed = await p.count('.graph .node[data-ring="landed"]');
	const fromRun = await p.count('.graph .node[data-ring-from="run"]');
	const ranks = await p.count('.graph .rank');
	const now = await p.count('.graph .nowline');
	const head = (await p.text('#host-focus .quiet.prose')).replace(/\s+/g, ' ');

	if (nodes !== 3) throw new Error(`${RUN} is three steps; the Works drew ${nodes}`);
	if (landed !== 3) throw new Error(`all three steps landed in this run; the Works ringed ${landed} landed`);
	if (fromRun !== 3) throw new Error(`every ring here is the engine's word, not the board's; ${fromRun} of 3 say so`);
	if (ranks !== 3) throw new Error(`the run is a chain of three, so three ranks run down; the Works drew ${ranks}`);
	if (now !== 1) throw new Error(`the NOW line is drawn exactly once; the Works drew ${now}`);
	if (!head.includes('personal')) throw new Error(`the run's account should read off the log (C14); the header says "${head}"`);
	if (!head.includes('the log names its config dir')) throw new Error(`the drawing must say where the venue came from: "${head}"`);

	// The pointer sits on the picker button after that click and the deck's tooltip is instant, so
	// the frame would carry a tip over the header. The NOW line is inert — it declares no `data-node`
	// and no `data-tip` — so clicking it moves the pointer somewhere that draws nothing.
	await p.click('.graph .nowline');

	console.log(`${RUN}   ${nodes} steps · ${landed} landed · ${ranks} ranks · ${now} now-line`);
	console.log(`header      ${head.slice(0, 140)}`);
	console.log(await p.shoot('works-v3-run'));

	// One node picked: Action draws its facts and the FROZEN kickoff — the bytes the run was
	// blessed on, read out of the log's own first event. No document position is resolved.
	await p.click('.graph .node[data-node="hold"]');
	await p.waitFor('#host-action pre.summons');
	const kickoff = await p.text('#host-action pre.summons');
	const label = await p.text('#host-action .label');
	if (!kickoff.includes('REHEARSAL-ALPHA')) throw new Error(`the frozen prompt is not on the card: "${kickoff.slice(0, 120)}"`);
	if (!(await p.text('#host-action')).includes('frozen at the blessing')) throw new Error(`the kickoff is not labelled frozen: "${label}"`);

	// The whole point of the read-only lane, counted rather than argued about: there is no control
	// on this pane that spawns a session or drives the engine.
	const fires = await p.count('[data-fire], [data-arm], [data-pass]');
	if (fires !== 0) throw new Error(`${fires} fire/arm/pass control(s) on the Works — the v3 lane is read-only (C15 §3)`);

	console.log(`kickoff     ${kickoff.length} B frozen · ${fires} fire/arm/pass controls on the pane`);
	console.log(await p.shoot('works-v3-kickoff'));
}
