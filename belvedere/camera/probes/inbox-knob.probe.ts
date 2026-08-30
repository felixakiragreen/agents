// C17 F2, closed and proven: the sovereign's inbox now has a write root, and a probe clicking
// "file it" cannot reach the real city.
//
// Run: bun camera/cli.ts run probes/inbox-knob.probe.ts
//
// This is the probe C17 said must never be written — *"a probe that clicks 'file it' writes to the
// real city. Do not click it."* It clicks it. The twin runs against the REAL city on purpose,
// because a fixture city would prove nothing: the whole hazard was that `POST /inbox` stands in
// FRONT of the arming switch (B6 F3), so a disarmed twin still writes, and the write went wherever
// the building path said. `$INBOX_DIR` moves the write and leaves the fence alone (C15 §5).
//
// The control is the target the write was pointed AWAY from: the real `ISSUES.md` is sha'd before
// and after, from disk, by this file — B8 F1's law, that pointing a knob at temp is not proof that
// temp was used.

import { createHash } from 'crypto';
import { existsSync, readFileSync, rmSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { Probe } from '../probe';
import { SCRATCH_INBOX } from '../twin';

const BUILDING = 'agents/belvedere';
const REAL = join(homedir(), 'code', BUILDING, 'ISSUES.md');
const SCRATCH = join(SCRATCH_INBOX, BUILDING, 'ISSUES.md');
const NOTE = 'camera probe — this note proves the inbox knob and must never reach the real city.';

const sha = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');

export default async function (p: Probe): Promise<void> {
	// The scratch drawer outlives a run (it is a fixed `$TMPDIR` path, so a human can go and read
	// what a probe filed). Clearing this building's copy is what makes the assertion below about
	// THIS run's write rather than about some earlier one's.
	rmSync(join(SCRATCH_INBOX, BUILDING), { recursive: true, force: true });

	const before = sha(REAL);
	const bytesBefore = readFileSync(REAL).length;

	await p.goto(`/b/${BUILDING}`);
	await p.click('details.gesture:has(textarea[data-note]) summary');
	await p.type('details.gesture:has(textarea[data-note]) textarea[data-note]', NOTE);
	const armed = await p.shoot('inbox-knob-armed');

	await p.click('details.gesture:has(textarea[data-note]) button.ges');
	await p.waitFor('details.gesture:has(textarea[data-note]) [data-out]');
	// The receipt is written by the page's own handler once the route has answered, so waiting for
	// it IS waiting for the write. Each read is a round trip to the page, which is why this polls
	// rather than sleeps: a sleep would be a guess about a local fetch, and this is an observation.
	let receipt = '';
	for (let i = 0; i < 200 && !receipt.startsWith('filed'); i++) receipt = await p.text('details.gesture:has(textarea[data-note]) [data-out]');
	if (!receipt.startsWith('filed')) throw new Error(`the gesture did not file: "${receipt}"`);

	if (!existsSync(SCRATCH)) throw new Error(`the note did not land in the scratch drawer (${SCRATCH})`);
	const landed = readFileSync(SCRATCH, 'utf8');
	if (!landed.includes(NOTE)) throw new Error(`the scratch inbox does not carry the note:\n${landed.slice(0, 400)}`);
	if (!landed.startsWith('# Issues')) throw new Error(`the scratch inbox was not minted from the D53 header:\n${landed.slice(0, 200)}`);

	const after = sha(REAL);
	if (after !== before) throw new Error(`THE REAL CITY WAS WRITTEN — ${REAL} moved from ${before} to ${after}`);
	if (readFileSync(REAL).includes(NOTE)) throw new Error(`the probe's note is in the real inbox at ${REAL}`);

	console.log(`receipt     ${receipt.replace(/\s+/g, ' ')}`);
	console.log(`landed      ${SCRATCH} · ${landed.length} B · minted from the D53 header`);
	console.log(`real city   ${REAL}`);
	console.log(`            ${bytesBefore} B, sha256 ${before} — before AND after, byte-identical`);
	console.log(armed);
	console.log(await p.shoot('inbox-knob-filed'));
}
