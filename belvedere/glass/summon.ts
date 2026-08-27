// What a fire needs, composed from the city's own tables — never from a second copy of them.
//
// A summons fence already carries its mantle and its tier (`You are a Builder at opus-high.`,
// D45). The tier IS the model and the effort. The rig's `presets.tsv` carries the colour a
// mantle wears, `accounts.tsv` the three silos, and `invocations.jsonl` the lineage counter
// that makes every name-stamp a unique `claude --resume <name>` handle (rig §name-stamp).
// The glass reads all four and mints exactly what `POST /hands/fire` parses (B4 F1).

import { readFileSync, statSync } from 'fs';
import { basename } from 'path';
import { EFFORTS, MODELS } from '../../doctrine';
import { AUDIT, INVOCATIONS } from './paths';
import type { Rig } from './rig';

/** Everything has a limit: the lineage scan reads a bounded tail, never a whole history. */
const LOG_BYTES = 1 << 20;

/** `opus-high` → the two flags cmux's claude actually takes. An unknown tier is not fireable. */
export function tierParts(tier: string | null): { model: string; effort: string } | null {
	if (!tier) return null;
	const cut = tier.lastIndexOf('-');
	const model = tier.slice(0, cut), effort = tier.slice(cut + 1);
	return (MODELS as readonly string[]).includes(model) && (EFFORTS as readonly string[]).includes(effort)
		? { model, effort } : null;
}

/** `Grand Architect` → `grand-architect`, the key `presets.tsv` and every name-stamp use. */
export const mantleKey = (mantle: string | null) =>
	mantle === null ? null : mantle.toLowerCase().replace(/\s+/g, '-');

/**
 * cmux's sixteen named colours (`cmux workspace-action --help`). The rig's palette is not a
 * subset of them: measured at this build row against a live socket, `--color cyan` (the rig's
 * Builder) and `--color pink` (its Dispatcher) both answer `invalid_params: Invalid color`,
 * while `--color Aqua` returns `OK … color=#0E6B8C`. So the two tables meet HERE, at the
 * boundary — and a name neither table knows falls back to one cmux will accept, because
 * `attemptFire` creates the workspace BEFORE it sets the colour: a refused colour costs the
 * whole fire and leaves the workspace behind (hands.ts §fire).
 */
const CMUX_COLOURS: Readonly<Record<string, string>> = {
	green: 'Green', blue: 'Blue', red: 'Red', purple: 'Purple', orange: 'Orange',
	yellow: 'Amber', cyan: 'Aqua', pink: 'Rose', grey: 'Charcoal', teal: 'Teal',
};

/** The rig's colour for a mantle, spelled the way cmux spells it. */
export const colourOf = (rig: Rig, mantle: string | null) =>
	CMUX_COLOURS[rig.colours.get(mantleKey(mantle) ?? '') ?? ''] ?? 'Charcoal';

/** A theater is argv (`-n <mantle>-<theater>-NN`), so it is a plain lowercase token or nothing. */
export const theaterOf = (buildingPath: string) =>
	basename(buildingPath).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const tail = (path: string, bytes: number): string => {
	try {
		const size = statSync(path).size;
		const text = readFileSync(path, 'utf8');
		return size > bytes ? text.slice(size - bytes) : text;
	} catch { return ''; }
};

/**
 * The next ordinal in a lineage. The rig counts from `invocations.jsonl`'s `name` field; the
 * glass's own fires never reach that file, so the hands' audit is read alongside it — one
 * counter over both, or two dispatchers would hand out one stamp twice.
 */
export function nextStamp(mantle: string | null, buildingPath: string): string | null {
	const key = mantleKey(mantle), theater = theaterOf(buildingPath);
	if (!key || !theater) return null;
	const prefix = `${key}-${theater}`;

	let top = 0;
	const seen = tail(INVOCATIONS, LOG_BYTES).match(/"name":"([^"]+)"/g) ?? [];
	const fired = tail(AUDIT, LOG_BYTES).match(/"stamp":"([^"]+)"/g) ?? [];
	for (const hit of [...seen, ...fired]) {
		const m = hit.match(/:"(.+)"$/)?.[1];
		if (!m || !m.startsWith(prefix + '-')) continue;
		const n = Number(m.slice(prefix.length + 1));
		if (Number.isInteger(n) && n > top) top = n;
	}
	return `${prefix}-${String(top + 1).padStart(2, '0')}`;
}

/** Exactly the body `POST /hands/fire` parses (B4 F1). `account` is the viewer's pick. */
export type FireBody = {
	account: string; stamp: string; cwd: string;
	model: string; effort: string; color: string; summons: string;
};

/** A fire the glass can actually compose, or the reason it cannot — never a guessed field. */
export type Composed = { body: FireBody } | { blocked: string };

export function compose(rig: Rig, opts: {
	summons: string; mantle: string | null; tier: string | null; cwd: string; account: string;
}): Composed {
	const parts = tierParts(opts.tier);
	if (!parts) return { blocked: `the summons names no known tier (got ${JSON.stringify(opts.tier)}) — model and effort are unguessable` };
	const stamp = nextStamp(opts.mantle, opts.cwd);
	if (!stamp) return { blocked: `no name-stamp: mantle ${JSON.stringify(opts.mantle)} · theater ${JSON.stringify(theaterOf(opts.cwd))}` };
	if (!opts.summons.trim()) return { blocked: 'the instrument carries no summons text' };
	return { body: {
		account: opts.account, stamp, cwd: opts.cwd,
		model: parts.model, effort: parts.effort, color: colourOf(rig, opts.mantle), summons: opts.summons,
	} };
}
