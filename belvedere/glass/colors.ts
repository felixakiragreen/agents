/**
 * The one colour map: **felikai intent → a value cmux accepts** (B18 §3, D16).
 *
 * B3 F1 measured the failure this closes: `--color cyan` and `--color pink` — two of the rig's own
 * five mantle colours — are refused by the socket, and `attemptFire` creates the workspace *before*
 * it sets the colour, so a refused colour cost a whole fire and left an orphan behind. B8 unwound
 * the orphan; this module removes the refusal.
 *
 * **Measured, not assumed** (`lab/b18/colors.ts`, one throwaway workspace, 29 candidates, 2026-08-27):
 * cmux accepts its sixteen names case-insensitively — Red `#C0392B` · Crimson `#922B21` · Orange
 * `#A04000` · Amber `#7D6608` · Olive `#4A5C18` · Green `#196F3D` · Teal `#006B6B` · Aqua `#0E6B8C` ·
 * Blue `#1565C0` · Navy `#1A5276` · Indigo `#283593` · Purple `#6A1B9A` · Magenta `#AD1457` · Rose
 * `#880E4F` · Brown `#7B3F00` · Charcoal `#3E4B5E` — refuses `cyan`, `pink`, `grey`, `gray`,
 * `yellow`, `white`, `black` and `#zzzzzz` with `invalid_params: Invalid color`, and **accepts any
 * `#RRGGBB` verbatim**: `#a5e22c` came back `color=#A5E22C`.
 *
 * That last line is why this table holds hexes rather than cmux's names. felikai is the city's
 * theme (README §3) and the socket takes it as written, so an intent resolves to **felikai's own
 * colour** instead of to whichever of sixteen muted names sits nearest it. The 600 level is the one
 * that lands in cmux's own luminance register (its Green is `#196F3D`, felikai's `--green-600` is
 * `#3f9608`); `--grey-650` `#3e3f38` is within a shade of Charcoal.
 */

/** felikai's own six hues, plus grey — the intents, spelled as `felikai.css` spells them. */
export const INTENTS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'grey'] as const;
export type Intent = (typeof INTENTS)[number];

/**
 * The map, and the whole of it. Values are `felikai.css`'s 600 level verbatim — `pink` is the one
 * entry with no felikai hue of its own and takes `--red-400`, the light end of the red scale
 * (see `INTENT_OF`).
 */
export const FELIKAI: Readonly<Record<Intent | 'pink', string>> = {
	red: '#a11420',      // --red-600
	orange: '#9e490c',   // --orange-600
	yellow: '#c6930b',   // --yellow-600
	green: '#3f9608',    // --green-600
	blue: '#0362b2',     // --blue-600
	purple: '#643bc0',   // --purple-600
	grey: '#3e3f38',     // --grey-650
	pink: '#ed3467',     // --red-400
};

/**
 * **Felix's felikai↔ANSI table** (his field report, folded into keel §7), inverted — because the
 * rig's `presets.tsv` writes ANSI slot names and the intent behind each is his theme's:
 *
 *   felikai green/ANSI green · yellow/yellow · red/red · purple/**magenta** · blue/**cyan** ·
 *   orange/**blue**
 *
 * So the rig's `cyan` (Builder) means felikai **blue**, and its `blue` (Digger) means felikai
 * **orange** — the two entries a naive reading gets backwards, and the reason this table exists at
 * all rather than a `CMUX_COLOURS` lookup of the same words. `pink` (Dispatcher) is the one colour
 * the rig spends that ANSI does not name and his table therefore does not cover: it keeps a value
 * of its own rather than collapsing onto `red`, which mentat already holds.
 */
const INTENT_OF: Readonly<Record<string, Intent | 'pink'>> = {
	green: 'green', yellow: 'yellow', red: 'red',
	magenta: 'purple', cyan: 'blue', blue: 'orange',
	// words the table does not reach: their own intent, or the rig's own fifth colour
	purple: 'purple', orange: 'orange', grey: 'grey', pink: 'pink',
};

/**
 * A colour word — the rig's, felikai's, or a bare `#rrggbb` — as a value the socket accepts, or
 * **null**: an unknown word is never quietly turned into a colour (D10's family). The caller
 * decides what to do with a refusal; nothing here falls back.
 */
export function cmuxColor(word: string): string | null {
	if (/^#[0-9a-fA-F]{6}$/.test(word)) return word;
	const intent = INTENT_OF[word.toLowerCase()];
	return intent === undefined ? null : FELIKAI[intent];
}

/** The swatch row the deck offers: every intent, and nothing that is not one. */
export const SWATCHES: readonly { intent: Intent; hex: string }[] =
	INTENTS.map(intent => ({ intent, hex: FELIKAI[intent] }));
