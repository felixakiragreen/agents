// **The Act-stall, bounded** (B23 §5) — a hypothesis given three honest runs and then retired or
// kept on the evidence.
//
// Run: bun camera/cli.ts run probes/act-stall.probe.ts
//
// The original recipe was *"expand Action, arm, watch 10 s"* and its middle step armed the **v2
// engine**, which D22 retired: there is no `POST /flow/<name>/arm`, no `startEngine()` and no
// five-second server tick left to stall (`glass/server.ts` has no clock at all — C15). So what is
// run here is the nearest thing the v3 world has: **open the Action pane on a v3 run and watch it,
// untouched**, three times, and ask the deck's own heartbeat whether it kept beating.
//
// The instrument is `#pulse` — the poll counter the shell writes on every answer and stamps
// `data-fault` on every failure (`deck.client.ts` §poll). A stall is one of two shapes and this
// tells them apart: the counter stops (the page or the server is wedged), or the counter climbs
// while `data-fault` says `yes` (the poll is failing and the deck is saying so, which is not a
// stall — it is the honest-degradation path working).

// **Nothing here names a run.** The Works reads the newest twelve run logs out of the city's live
// telemetry root, which the engine writes, the console's `tick` writes, and — in a parallel batch —
// another lane's session writes. A probe that pins a run by name, or assumes the node it clicked is
// still the node ten seconds later, is asserting about a world that moves (B23 F12, measured on this
// gate's own first whole-family run). What a stall probe actually needs is neither: it needs the
// heartbeat, and it needs the pane to still answer a click — both true of whatever run is showing.
import type { Probe } from '../probe';

/** The original recipe's own clock. Three runs of it, as the charge bounds the attempt. */
const WATCH = 10_000;
const RUNS = 3;
/** Three seconds a poll, ten seconds of watching: three is the floor a healthy deck cannot miss. */
const FLOOR = 3;

export default async function (p: Probe): Promise<void> {
	await p.goto('/deck');
	const state = await p.ask('/deck/state');
	if (state.status !== 200) throw new Error(`/deck/state answered ${state.status}: ${state.body}`);
	const snap = JSON.parse(state.body) as { register: { buildings: { building: string }[] } };
	// The mounted run's subject ran under `$TMPDIR`, which houses nowhere in the city, so the Works
	// draws it under the building the register says owns that path — `agents`, as every run does
	// (C15 F5). The picker holds exactly one run: this one.
	const building = snap.register.buildings.find(b => b.building === 'agents')?.building
		?? snap.register.buildings[0]?.building;
	if (!building) throw new Error('the City is empty — nothing to open the Works on');

	await p.remember('belvedere.deck.building', building);
	await p.remember('belvedere.deck.focus', 'works');
	await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'typical', action: 'expanded', drawer: 'shut' });

	const lines: string[] = [];
	for (let run = 1; run <= RUNS; run++) {
		await p.goto('/deck');
		await p.waitFor('.node[data-node]');
		// Expanded Action on a picked node — the pane the recipe named, holding a real run's fact list.
		await pick(p, run, 'before the watch');

		const before = Number(await p.text('#pulse'));
		if (!Number.isFinite(before)) throw new Error(`run ${run}: the pulse reads "${await p.text('#pulse')}" before the watch — the poll had already failed`);
		await p.wait(WATCH);
		const raw = await p.text('#pulse');
		const after = Number(raw);
		if (!Number.isFinite(after)) throw new Error(`run ${run}: the poll FAILED during the watch and said so: ${raw}`);
		const beats = after - before;
		if (beats < FLOOR) throw new Error(`run ${run}: ${beats} polls in ${WATCH / 1000} s with Action expanded on a run — the deck stopped beating`);
		// Still answering a click afterwards: a deck that polls but cannot be used is still stalled.
		// A FRESH click, because ten seconds of live telemetry may have re-drawn the picker under it —
		// what is being measured is that the pane answers, not that one node survived.
		await pick(p, run, 'after the watch');
		lines.push(`run ${run}      ${beats} polls in ${WATCH / 1000} s · the pane still answers a click`);
	}

	const shot = await p.shoot('act-stall-watch');
	for (const l of lines) console.log(l);
	console.log(`the verdict ${RUNS} honest runs of the nearest v3 recipe · no stall reproduced`);
	console.log(shot);
}

/** One click on a node, and the toggle clicked closed again — the pane answered twice or it did not. */
async function pick(p: Probe, run: number, when: string): Promise<void> {
	await p.waitFor('.node[data-node]');
	if (await p.count('.node.on') !== 0) await p.click('.node.on');
	await p.click('.node[data-node]');
	await p.wait(400);
	const on = await p.count('.node.on');
	if (on !== 1) throw new Error(`run ${run}, ${when}: a click selected ${on} nodes, not one — the pane is not answering`);
	await p.click('.node.on');
	await p.wait(400);
	if (await p.count('.node.on') !== 0) throw new Error(`run ${run}, ${when}: the selected node would not unselect`);
	await p.click('.node[data-node]');
	await p.wait(400);
}
