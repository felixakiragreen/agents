// Parser-as-lint, photographed: a board that will not parse renders its failures, not a blank.
//
// Run: bun camera/cli.ts run probes/fixture-broken.probe.ts
//
// `broken/` is malformed six ways at once and every failure has to reach the page — three pinned
// to the rows they belong to, three in the lint panel — while the rows the parser COULD read are
// still drawn. A building page that answered a blank here would be lying twice: once about the
// board, once about the failure.

import type { Probe } from '../probe';

export const fixture = true;

export default async function (p: Probe): Promise<void> {
	await p.goto('/city');
	await p.click('a.card[href$="/broken"]');
	await p.waitFor('table.board');

	const pinned = await p.count('table.board .lint');
	const listed = await p.count('.lint-t tbody tr');
	const rows = await p.count('table.board tbody tr');
	const board = await p.text('table.board');

	// The six `doctrine lint` classes, all of them on the page and none of them silent.
	if (pinned + listed !== 6) throw new Error(`broken lints 6 ways; the page showed ${pinned} pinned + ${listed} listed`);
	// …and the page still draws what it could read. A blank panel is the failure mode this
	// fixture exists to catch.
	if (rows !== 3) throw new Error(`the readable rows still render — expected 3, drew ${rows}`);
	if (!board.includes('UNPARSED')) throw new Error('the row whose status opens on no state should render UNPARSED');

	console.log(`broken     ${pinned} lint notes pinned to rows · ${listed} in the lint panel · ${rows} rows still drawn`);
	console.log(await p.shoot('fixture-broken-board'));
	// The three failures with no row to pin them to — a refused table, a split row and a table a
	// blank line truncated — live at the foot of the page, past one viewport.
	await p.scroll('.lint-t');
	console.log(await p.shoot('fixture-broken-lint'));
}
