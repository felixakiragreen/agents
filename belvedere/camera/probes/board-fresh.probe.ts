// **A board row committed while the Workshop is open reaches the pane within one poll** (B23 §4).
//
// Run: bun camera/cli.ts run probes/board-fresh.probe.ts
//
// The measurement this charge inherited, 2026-08-28: rows B22–B27 in the wire payload through
// refreshes and never painted — *and the hard reload also showed stale*, which no client memo should
// survive. Two paths, so both are walked here: the poll (the pane is standing, the file changes
// under it) and the reload (nothing on the client is holding anything at all).
//
// It runs against the **fixture city** because the experiment is a WRITE into a board file, and the
// only board file a probe may write is one inside the run directory the fixture copies (C19 F2 —
// under `--fixture` every write the twin can make is contained and dies with the run). The path is
// not guessed: the deck names its own board file on the wire, and that is the file appended to.

import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import type { Probe } from '../probe';

export const fixture = true;

/** One poll is 3 s; the dwell clears one with room for the render. */
const POLL = 4_000;
const ID = 'A9';
const ROW = `| ${ID} | the row committed while the Workshop was open — B23 §4 | A1 | Builder · opus-high | OPEN — appended by the probe |`;

type Wire = {
	workshop: {
		building: string;
		boards: { rows: { id: string }[] }[];
		files: { boards: { path: string }[] };
	} | null;
	register: { buildings: { building: string }[] };
};

export default async function (p: Probe): Promise<void> {
	await p.goto('/deck');
	const first = JSON.parse((await p.ask('/deck/state')).body) as Wire;
	// `alpha` is the fixture building carrying a row in every state; under `--fixture` a building is
	// named by its absolute path in the run directory (C19 F1), so it is found by suffix.
	const building = first.register.buildings.find(b => b.building.endsWith('/alpha'))?.building;
	if (!building) throw new Error(`no alpha in the fixture city — ${first.register.buildings.map(b => b.building).join(', ')}`);

	await p.remember('belvedere.deck.building', building);
	await p.remember('belvedere.deck.focus', 'workshop');
	await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'expanded', action: 'minimal', drawer: 'shut' });
	await p.remember('belvedere.workshop.collapsed', []);
	await p.remember('belvedere.workshop.order', ['board', 'sessions', 'ledger', 'decisions', 'issues']);
	await p.goto('/deck');
	await p.waitFor('.ws-row');

	const wire = JSON.parse((await p.ask(`/deck/state?b=${encodeURIComponent(building)}`)).body) as Wire;
	const board = wire.workshop?.files.boards[0]?.path;
	if (!board) throw new Error('the Workshop names no board file — nothing to commit into');
	const was = readFileSync(board, 'utf8');
	if (was.includes(`| ${ID} |`)) throw new Error(`${board} already carries a row ${ID}`);

	const drawn = await p.count('.ws-row');
	const onWire = wire.workshop!.boards.reduce((n, b) => n + b.rows.length, 0);
	if (drawn !== onWire) throw new Error(`the wire carries ${onWire} rows and the pane drew ${drawn} — stale before anything was even written`);
	if (await p.count(`[data-row="${ID}"]`) !== 0) throw new Error(`the pane already draws ${ID}`);

	try {
		// ── 1. the poll: the pane is standing, and the file changes under it ────────
		appendFileSync(board, `${ROW}\n`);
		await p.wait(POLL);
		const painted = await p.count(`[data-row="${ID}"]`);
		if (painted !== 1) throw new Error(`one poll after the commit, the pane draws ${painted} rows named ${ID} — the payload moved and the paint did not`);
		const after = JSON.parse((await p.ask(`/deck/state?b=${encodeURIComponent(building)}`)).body) as Wire;
		const nowOnWire = after.workshop!.boards.reduce((n, b) => n + b.rows.length, 0);
		if (nowOnWire !== onWire + 1) throw new Error(`the wire carries ${nowOnWire} rows, not ${onWire + 1} — the SERVER is the stale half`);
		if (await p.count('.ws-row') !== nowOnWire) throw new Error(`the wire carries ${nowOnWire} rows and the pane draws ${await p.count('.ws-row')}`);
		const shot = await p.shoot('board-fresh-poll');

		// ── 2. the reload: nothing on the client is holding anything ────────────────
		await p.goto('/deck');
		await p.waitFor('.ws-row');
		const reloaded = await p.count(`[data-row="${ID}"]`);
		if (reloaded !== 1) throw new Error(`after a full reload the pane draws ${reloaded} rows named ${ID} — the staleness is not the client's`);

		console.log(`the board   ${board}`);
		console.log(`before      ${onWire} rows on the wire · ${drawn} drawn · no ${ID} anywhere`);
		console.log(`the commit  one row appended, ${ROW.length} B`);
		console.log(`one poll    ${nowOnWire} rows on the wire · ${await p.count('.ws-row')} drawn · ${painted} × [data-row="${ID}"]`);
		console.log(`the reload  ${reloaded} × [data-row="${ID}"] with no client memory at all`);
		console.log(shot);
	}
	finally { writeFileSync(board, was); }
}
