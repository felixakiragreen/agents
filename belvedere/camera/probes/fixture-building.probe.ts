// One building from the inside, twice — every panel of the building page against known content.
//
// Run: bun camera/cli.ts run probes/fixture-building.probe.ts
//
// Alpha carries a board with a row in every state that renders differently, a ⬡-held ledger tail
// and a two-entry inbox; beta carries the pending blessing. Both are reached the way Felix
// reaches them — a click on the City View — because a surface a probe cannot reach by clicking
// is telling you something about the deck (C17 F5).

import type { Probe } from '../probe';

export const fixture = true;

const STATES = ['OPEN', 'DEFERRED', 'IN FLIGHT', 'LANDED', 'KILLED', 'BLOCKED', '⬡-gate'];

export default async function (p: Probe): Promise<void> {
	await p.goto('/city');
	await p.click('a.card[href$="/alpha"]');
	await p.waitFor('table.board');

	const rows = await p.count('table.board tbody tr');
	const board = await p.text('table.board');
	const missing = STATES.filter(s => !board.includes(s));
	const holder = await p.text('.kv .pill');
	const issues = await p.count('ul.issues li');
	const lint = await p.count('table.board .lint, .lint-t tbody tr');

	if (rows !== 7) throw new Error(`alpha's board is 7 rows, the page drew ${rows}`);
	if (missing.length) throw new Error(`alpha's board did not render ${missing.join(', ')}`);
	if (holder !== 'felix') throw new Error(`alpha's baton is ⬡-held; the ledger panel says "${holder}"`);
	if (issues !== 2) throw new Error(`alpha's inbox holds 2 entries, the page drew ${issues}`);
	// The control for `fixture-broken`: a conforming building draws no lint at all, so the six
	// failures that probe counts are the broken board's and not the panel's default furniture.
	if (lint !== 0) throw new Error(`alpha is lint-clean and the page drew ${lint} failure(s)`);

	console.log(`alpha      ${rows} rows · baton ${holder} · ${issues} inbox entries · ${lint} lint`);
	console.log(await p.shoot('fixture-building-alpha'));

	await p.goto('/city');
	await p.click('a.card[href$="/beta"]');
	await p.waitFor('ul.queue');

	const queue = await p.count('ul.queue li');
	const pending = await p.text('ul.queue li');
	if (queue !== 1) throw new Error(`beta's queue holds one pending blessing, the page drew ${queue}`);
	if (!pending.includes('BD3') || !pending.includes('pending blessing'))
		throw new Error(`beta's queue item is not the pending blessing: "${pending}"`);

	console.log(`beta       queue ${queue} · ${pending.replace(/\s+/g, ' ').slice(0, 80)}`);
	console.log(await p.shoot('fixture-building-beta'));
}
