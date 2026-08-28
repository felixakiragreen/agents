// The colour map, pinned. The *acceptance* half is measured against a live socket
// (`lab/b18/colors.ts`, evidence in `colors.ts`'s header and in the B18 findings); what a unit test
// can hold is the half that is a ruling rather than a measurement: **Felix's felikai↔ANSI table**,
// and the rule that an unknown word never quietly becomes a colour.

import { expect, test, describe } from 'bun:test';
import { cmuxColor, FELIKAI, INTENTS, SWATCHES } from './colors';
import { readRig } from './rig';
import { colourOf } from './summon';

describe('felikai intent → a value cmux accepts', () => {
	test('every intent resolves to a hex, and the hex is felikai\'s own', () => {
		for (const i of INTENTS) expect(FELIKAI[i]).toMatch(/^#[0-9a-f]{6}$/);
		expect(FELIKAI.green).toBe('#3f9608');       // --green-600, verbatim from felikai.css
		expect(FELIKAI.grey).toBe('#3e3f38');        // --grey-650
	});

	test('Felix\'s table is the map, and it is the two entries a naive reading gets backwards', () => {
		// felikai blue/ANSI cyan · felikai orange/ANSI blue (his table, keel §7). So the rig's `cyan`
		// is felikai's blue and the rig's `blue` is felikai's orange — not the words themselves.
		expect(cmuxColor('cyan')).toBe(FELIKAI.blue);
		expect(cmuxColor('blue')).toBe(FELIKAI.orange);
		expect(cmuxColor('magenta')).toBe(FELIKAI.purple);
		for (const same of ['green', 'yellow', 'red']) expect(cmuxColor(same)).toBe(FELIKAI[same as 'green']);
	});

	test('a hex passes through — the socket takes `#RRGGBB` verbatim (measured)', () => {
		expect(cmuxColor('#A5E22C')).toBe('#A5E22C');
		expect(cmuxColor('#zzzzzz')).toBeNull();
	});

	test('a word the map does not know is null, never a colour it picked (D10\'s family)', () => {
		for (const unknown of ['aquamarine', 'Aqua', '', 'chartreuse']) expect(cmuxColor(unknown)).toBeNull();
	});

	test('the swatch row offers the intents and nothing that is not one', () => {
		expect(SWATCHES.map(s => s.intent)).toEqual([...INTENTS]);
		for (const s of SWATCHES) expect(s.hex).toBe(FELIKAI[s.intent]);
	});
});

describe('the rig\'s mantles, coloured', () => {
	const rig = readRig();

	test('every mantle the rig names gets a colour the socket accepts — B3 F1 closed at the cause', () => {
		for (const mantle of rig.mantles) {
			const c = colourOf(rig, mantle);
			expect(c).toMatch(/^#[0-9a-f]{6}$/);
		}
		// `presets.tsv` spends `cyan` on Builder and `pink` on Dispatcher; cmux refuses both words.
		expect(colourOf(rig, 'builder')).toBe(FELIKAI.blue);
		expect(colourOf(rig, 'dispatcher')).toBe(FELIKAI.pink);
		expect(colourOf(rig, 'digger')).toBe(FELIKAI.orange);
	});

	test('a mantle the rig does not name wears grey rather than costing a whole fire', () => {
		expect(colourOf(rig, 'no-such-mantle')).toBe(FELIKAI.grey);
		expect(colourOf(rig, null)).toBe(FELIKAI.grey);
	});
});
