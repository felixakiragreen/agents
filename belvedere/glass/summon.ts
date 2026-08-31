// What an ignition needs, composed from the city's own tables — never from a second copy of them.
//
// A summons fence already carries its mantle and its tier (`You are a Builder at opus-high.`,
// D45). The tier IS the model and the effort. The rig's `presets.tsv` carries the colour a
// mantle wears, `accounts.tsv` the three silos, and `invocations.jsonl` the lineage counter
// that makes every name-stamp a unique `claude --resume <name>` handle (rig §name-stamp).
// Belvedere reads all four and mints exactly what `POST /hands/ignite` parses (B4 F1).

import { readFileSync, statSync } from 'fs';
import { basename, join } from 'path';
import { EFFORTS, MODELS } from '../../doctrine';
import { cmuxColor, FELIKAI } from './colors';
import { auditLog, INVOCATIONS } from './paths';
import type { Rig } from './rig';

/** Everything has a limit: the lineage scan reads a bounded tail, never a whole history. */
const LOG_BYTES = 1 << 20;

/** `opus-high` → the two flags cmux's claude actually takes. An unknown tier is not ignitable. */
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
 * The rig's colour for a mantle, as a value cmux accepts — one map, `colors.ts`, measured against
 * the live socket (B18 §3, B3 F1 closed at the cause). A mantle the rig gives no colour, or a
 * colour word the map does not know, wears felikai's grey rather than nothing: `attemptIgnite`
 * creates the workspace BEFORE it sets the colour, so a refused colour costs a whole ignition.
 */
export const colourOf = (rig: Rig, mantle: string | null) =>
	cmuxColor(rig.colours.get(mantleKey(mantle) ?? '') ?? '') ?? FELIKAI.grey;

/** A theater is argv (`-n <mantle>-<theater>-NN`), so it is a plain lowercase token or nothing. */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** The rig's own plain-name law for a filed theater (`summon.zsh:_summon_theaters_load`). */
const PLAIN = /^[A-Za-z0-9._-]+$/;

/**
 * The ignition directory's filed campaign, or nothing. One read of `<dir>/.summon-theaters`, first
 * non-blank line, **no parent walk** — row 14's semantics exactly. A line that is not a plain
 * name makes the rig refuse the whole file rather than compose a bad launch, so it makes
 * Belvedere fall back to the directory name for the same reason.
 */
function filedTheater(dir: string): string | null {
	let text: string;
	try { text = readFileSync(join(dir, '.summon-theaters'), 'utf8'); } catch { return null; }
	for (const line of text.split('\n')) {
		if (line === '') continue;
		return PLAIN.test(line) && !line.startsWith('-') ? line : null;
	}
	return null;
}

/**
 * Row 14's theater: the ignition directory's `.summon-theaters` first line, else the directory's own
 * name — one repo can host several campaigns, and the stamp is what carries which (rig §theater
 * cycle). Only the default is offered here; cycling is the rig panel's keystroke.
 *
 * The slug is the glass's own and it is **narrower than the rig's on purpose**: a stamp must also
 * pass `hands.ts`'s `STAMP` (`^[a-z][a-z0-9-]{0,63}$`), so `universal_robots_sdk` becomes
 * `universal-robots-sdk` here and stays `universal_robots_sdk` from the rig. Two lineages for one
 * theater — named in B7's findings, not papered over: the stamp is always on show and editable,
 * and an edit back to the rig's spelling is refused loudly by the parse boundary.
 */
export const theaterOf = (buildingPath: string) =>
	slug(filedTheater(buildingPath) ?? basename(buildingPath));

const tail = (path: string, bytes: number): string => {
	try {
		const size = statSync(path).size;
		const text = readFileSync(path, 'utf8');
		return size > bytes ? text.slice(size - bytes) : text;
	} catch { return ''; }
};

/** One JSON log's values for one key, from a bounded tail. */
const logged = (path: string, key: string): string[] =>
	[...tail(path, LOG_BYTES).matchAll(new RegExp(`"${key}":"([^"]+)"`, 'g'))].map(m => m[1]!);

/**
 * A lineage's prefix, the rig's own two shapes (`summon.zsh:_summon_name_stamp`): **the Grand
 * Architect keeps no theater** — there is one office, so the segment would be redundancy — and
 * every other mantle is `<mantle>-<theater>`. The rig's third shape (a bare launch, the theater
 * counting alone) is deliberately not offered: a mantle-less ignition would arm what Belvedere could
 * not name, and every Belvedere affordance chooses a mantle.
 */
export const stampPrefix = (mantle: string | null, theater: string): string | null => {
	const key = mantleKey(mantle);
	if (!key) return null;
	if (key === 'grand-architect') return key;
	return theater ? `${key}-${theater}` : null;
};

/**
 * The prefix for work done *at* a directory — the v0 composer's question, where the ignition directory
 * and the work are the same place. **The deck asks a different one** (B17): a theater names the
 * WORK, and belvedere work ignited at `~/code/agents` is `…-belvedere-NN`, so the deck resolves the
 * theater off the chosen building and calls `stampPrefix` directly. One prefix rule, two askers.
 */
export const lineage = (mantle: string | null, buildingPath: string): string | null =>
	stampPrefix(mantle, theaterOf(buildingPath));

/**
 * The next ordinal in a lineage. The rig counts from `invocations.jsonl`'s `name` field;
 * Belvedere's own ignitions never reach that file, so the hands' audit is read alongside it — one
 * counter over both, or two dispatchers would hand out one stamp twice.
 *
 * `known` is the third source and the reason it exists: a stamp the **live census** carries came
 * from somewhere neither log records (a hand-typed `-n`, a session ignited before the audit), and
 * a counter blind to a running session hands its name out twice.
 *
 * `taken` closes the same hole inside a single render: a wave of two Builders in one building
 * reads one disk state and would otherwise stamp both `builder-x-01`. Every stamp minted is
 * added to it, so the caller's set IS the reservation.
 */
export function nextOrdinal(
	prefix: string, taken = new Set<string>(), known: readonly string[] = [],
): number {
	let top = 0;
	for (const name of [...logged(INVOCATIONS, 'name'), ...logged(auditLog(), 'stamp'), ...known]) {
		if (!name.startsWith(prefix + '-')) continue;
		const n = Number(name.slice(prefix.length + 1));
		if (Number.isInteger(n) && n > top) top = n;
	}
	let n = top;
	do { n++; } while (taken.has(ordinal(prefix, n)));
	taken.add(ordinal(prefix, n));
	return n;
}

/** The stamp a prefix and an ordinal spell. Two digits is the rig's own width, not a cap. */
export const ordinal = (prefix: string, n: number): string => `${prefix}-${String(n).padStart(2, '0')}`;

/** The whole stamp for work done at a directory — `lineage` and `nextOrdinal`, in one call. */
export function nextStamp(
	mantle: string | null, buildingPath: string,
	taken = new Set<string>(), known: readonly string[] = [],
): string | null {
	const prefix = lineage(mantle, buildingPath);
	return prefix === null ? null : ordinal(prefix, nextOrdinal(prefix, taken, known));
}

/** Exactly the body `POST /hands/ignite` parses (B4 F1). `account` is the viewer's pick. */
export type IgniteBody = {
	account: string; stamp: string; cwd: string;
	model: string; effort: string; color: string; summons: string;
};

/** An ignition Belvedere can actually compose, or the reason it cannot — never a guessed field. */
export type Composed = { body: IgniteBody } | { blocked: string };

export function compose(rig: Rig, opts: {
	summons: string; mantle: string | null; tier: string | null; cwd: string; account: string;
	taken?: Set<string>; known?: readonly string[]; stamp?: string;
}): Composed {
	const parts = tierParts(opts.tier);
	if (!parts) return { blocked: `the summons names no known tier (got ${JSON.stringify(opts.tier)}) — model and effort are unguessable` };
	const stamp = opts.stamp ?? nextStamp(opts.mantle, opts.cwd, opts.taken, opts.known);
	if (!stamp) return { blocked: `no name-stamp: mantle ${JSON.stringify(opts.mantle)} · theater ${JSON.stringify(theaterOf(opts.cwd))}` };
	if (!opts.summons.trim()) return { blocked: 'the instrument carries no summons text' };
	return { body: {
		account: opts.account, stamp, cwd: opts.cwd,
		model: parts.model, effort: parts.effort, color: colourOf(rig, opts.mantle), summons: opts.summons,
	} };
}
