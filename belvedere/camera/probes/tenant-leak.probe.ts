// **One mount, one listener set** (B23 §3) — the leak at the class, and the parity face it wore.
//
// Run: bun camera/cli.ts run probes/tenant-leak.probe.ts
//
// The measurement at G2's close: one click, fifteen `armed` lines. The cause is the `FocusView`
// seam's own shape — `mount(focusHost, actionHost)` hands a tenant two elements the SHELL owns, and
// every tenant hung its click handlers straight on them while `unmount()` only nulled its own
// references. So a tenant swapped in N times ran its handler N times per click, and `wire(focus)`'s
// `picked = picked === id ? null : id` toggle made an EVEN N a visible no-op: a button that did
// nothing, with nothing in the console to say why.
//
// Two things are measured here, and neither is a proxy:
//
//  1. **The count** — one click on the Works' bill control produces exactly ONE `GET /deck/usage`,
//     read off the browser's own resource timeline. That wire is a delegated click on the Action
//     host: the leaked one, by construction.
//  2. **The parity** — the first click on a node selects it after an ODD number of mounts of this
//     tenant and after an EVEN one. That is the face Felix would have seen, and it is the half a
//     count cannot show: with N handlers the toggle ran N times, so an even N looked like a dead
//     button while an odd N looked like a working one.
//
// Nothing here reaches a hand: the twin is disarmed, and `/deck/usage` is a read.

import type { Probe } from '../probe';

/** Comfortably past the fifteen of the original measurement's neighbourhood, and odd at the end. */
const SWAPS = ['workshop', 'chat', 'desk', 'works', 'workshop', 'works'] as const;
const LAYOUT = { context: 'minimal', focus: 'expanded', action: 'expanded', drawer: 'shut' } as const;

const BILL = '[data-bill]';
const NODE = '.node[data-node]';
const ON = '.node.on';

export default async function (p: Probe): Promise<void> {
	await p.goto('/deck');
	const state = await p.ask('/deck/state');
	if (state.status !== 200) throw new Error(`/deck/state answered ${state.status}: ${state.body}`);
	const snap = JSON.parse(state.body) as { register: { buildings: { building: string }[] } };

	// A building the Works can actually draw a run for. The engine's telemetry houses runs where the
	// subject ran (C15 F5), which is `agents` for everything this city has run.
	const building = snap.register.buildings.find(b => b.building === 'agents')?.building
		?? snap.register.buildings[0]?.building;
	if (!building) throw new Error('the City is empty — nothing to open the Works on');

	await p.remember('belvedere.deck.building', building);
	await p.remember('belvedere.deck.focus', 'works');
	await p.remember('belvedere.deck.layout', LAYOUT);
	await p.goto('/deck');
	await p.waitFor(NODE);

	// ── the swaps ────────────────────────────────────────────────────────────────
	// Every one of these mounts a tenant onto the same two hosts. Before the seam carried a signal,
	// each left its listeners behind.
	for (const name of SWAPS) {
		await p.click(`[data-focus-on="${name}"]`);
		await p.wait(250);
	}
	await p.waitFor(NODE);
	const swaps = SWAPS.length;
	// **The parity that matters is how many times THIS tenant was mounted**, not how many swaps
	// happened: the leaked handlers were the Works' own, one set per mount of the Works. It is
	// mounted once at boot and once per appearance in the swap list.
	let mounts = 1 + SWAPS.filter(n => n === 'works').length;

	// ── 1. one click, one request ────────────────────────────────────────────────
	const bills = await p.count(BILL);
	if (bills === 0) throw new Error('the Works drew no bill control — nothing to click on the Action host');
	const before = await p.requests('/deck/usage');
	await p.click(BILL);
	await p.wait(1_500);
	const after = await p.requests('/deck/usage');
	const asked = after - before;
	if (asked !== 1) throw new Error(`one click on the bill made ${asked} requests for /deck/usage after ${swaps} swaps — the listeners are still stacking`);
	const shot = await p.shoot('tenant-leak-works');

	// ── 2. the parity face ───────────────────────────────────────────────────────
	// After an ODD number of mounts and after an EVEN one, the FIRST click must select. With leaked
	// handlers the toggle ran once per mount, so one of these two parities was always a dead button.
	const first = await selects(p, `${mounts} mounts (${mounts % 2 ? 'odd' : 'even'})`);
	const again = async (via: string) => {
		await p.click(`[data-focus-on="${via}"]`);
		await p.wait(250);
		await p.click('[data-focus-on="works"]');
		await p.wait(400);
		await p.waitFor(NODE);
		mounts++;
		return await selects(p, `${mounts} mounts (${mounts % 2 ? 'odd' : 'even'})`);
	};
	const second = await again('workshop');
	const third = await again('chat');

	console.log(`the swaps   ${SWAPS.join(' → ')} · ${swaps} mounts onto the same two hosts`);
	console.log(`the count   one click on the bill → ${asked} GET /deck/usage (was one per mount)`);
	console.log(`the parity  the first click selects, at both parities of the mount count: ${first} · ${second} · ${third}`);
	console.log(shot);
}

/**
 * One click on a node, and the node it selected. The toggle is left CLOSED — clicked back off — so
 * the next round starts from the same state and the parity being measured is the handler's, not the
 * probe's own bookkeeping.
 */
async function selects(p: Probe, when: string): Promise<string> {
	if (await p.count(ON) !== 0) throw new Error(`${when}: a node was already selected before the click`);
	await p.click(NODE);
	await p.wait(300);
	const on = await p.count(ON);
	if (on !== 1) throw new Error(`${when}: the first click selected ${on} nodes, not one — the toggle ran ${on === 0 ? 'an even number of times' : `${on} times`}`);
	await p.click(ON);
	await p.wait(300);
	const off = await p.count(ON);
	if (off !== 0) throw new Error(`${when}: clicking the selected node left ${off} selected — the toggle is not a toggle`);
	return `${when} ✓`;
}
