/**
 * **His arrangement, on disk** — `desk/city-arrangement.json` (B24 §2).
 *
 * The desk is the glass's one write neighborhood outside the gitignored telemetry (D17, fence class
 * 7), so the arrangement needs **no new write class**: it is a desk file, it is written by his
 * gesture, and commits are never Belvedere's. It is a file rather than `localStorage` because his
 * own words asked for durability across browsers and machines, and per-browser is what
 * `localStorage` is by construction (B15's reorder was the transitional layer this supersedes).
 *
 * **The file is the state.** A gesture writes it whole and the next poll reads it back, so killing
 * the server mid-arrangement loses exactly what was never written (B8's drill bar). It is indented
 * with tabs and one space per line-group so a human can read it, diff it, and edit it by hand.
 *
 * This module is the **parse boundary** (directive 2.2): everything below it — `spaces.ts`, the
 * client, the City — works on a tree that is already known to be a tree, with unique ids, unique
 * bindings and its limits already checked. A file that fails those checks never becomes a
 * half-trusted value: it becomes an error the City prints while it draws the register's own
 * neighborhoods instead.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fail, json, type Outcome } from './hands';
import { deskDir } from './paths';
import { LIMITS, SPACE_COLORS, countNodes, depthOf, walk, type Arrangement, type Space, type SpaceColor } from './spaces';

export const arrangementFile = () => join(deskDir(), 'city-arrangement.json');

/**
 * An id is a **token**: minted by `spaces.ts`, only ever compared to another id, never joined to a
 * path and never printed. So the rule is what a token must not be — empty, whitespace-bearing, or
 * carrying a control character — rather than a list of the characters a building name happens to
 * use today. The first cut spelled that list out and left `~` off it, and every derived id in the
 * live city is `g:~/code/<x>`: the whole arrangement was refused at the door with a 400 the page
 * printed and no test read (B24 F3).
 */
const ID = /^[^\s\x00-\x1f"\\]{1,160}$/;

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * One node, parsed. Unknown fields are dropped rather than carried: a file the deck writes back is
 * a file it fully understood, and a field nobody reads is a field that rots.
 */
function parseSpace(raw: unknown, seen: Set<string>): Outcome<Space> {
	if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return fail('a space must be a JSON object');
	const r = raw as Record<string, unknown>;

	const id = str(r['id']);
	if (!ID.test(id)) return fail(`a space id is 1–120 of [0-9a-zA-Z:._/-] — got ${JSON.stringify(r['id'])}`);
	if (seen.has(id)) return fail(`two spaces share the id ${JSON.stringify(id)} — an id names one space`);
	seen.add(id);

	const color = r['color'] === null || r['color'] === undefined ? null : str(r['color']);
	if (color !== null && !(SPACE_COLORS as readonly string[]).includes(color))
		return fail(`a space color is one of ${SPACE_COLORS.join(', ')} or null — got ${JSON.stringify(r['color'])}`);

	const binding = r['binding'] === null || r['binding'] === undefined ? null : str(r['binding']);
	if (binding !== null && binding === '') return fail(`a binding names a building or is null — got ""`);

	const name = str(r['name']).replace(/\s+/g, ' ').trim().slice(0, LIMITS.nameChars);
	if (name === '' && binding === null) return fail(`the space ${JSON.stringify(id)} has no name and no binding — it is nothing`);

	const type = r['type'] === null || r['type'] === undefined ? null : str(r['type']).replace(/\s+/g, ' ').trim().slice(0, LIMITS.typeChars);

	const kids = r['children'] === undefined ? [] : r['children'];
	if (!Array.isArray(kids)) return fail(`the space ${JSON.stringify(id)} has children that are not a list`);
	const children: Space[] = [];
	for (const k of kids) {
		const child = parseSpace(k, seen);
		if (!child.ok) return child;
		children.push(child.result);
	}

	return { ok: true, result: { id, name, color: color as SpaceColor | null, type: type === '' ? null : type, binding, children } };
}

/** The whole tree, or the reason it is not one. */
export function parseArrangement(raw: unknown): Outcome<Space[]> {
	const list = typeof raw === 'object' && raw !== null && !Array.isArray(raw)
		? (raw as Record<string, unknown>)['spaces'] : raw;
	if (!Array.isArray(list)) return fail('an arrangement is { "spaces": [ … ] }');

	const seen = new Set<string>();
	const spaces: Space[] = [];
	for (const s of list) {
		const one = parseSpace(s, seen);
		if (!one.ok) return one;
		spaces.push(one.result);
	}
	if (countNodes(spaces) > LIMITS.nodes) return fail(`an arrangement holds at most ${LIMITS.nodes} spaces`);
	if (depthOf(spaces) > LIMITS.depth) return fail(`an arrangement nests at most ${LIMITS.depth} deep`);

	// A building filed in two places would be drawn twice and answer to two orders. One home each.
	const bound = new Map<string, number>();
	for (const s of walk(spaces)) if (s.binding !== null) bound.set(s.binding, (bound.get(s.binding) ?? 0) + 1);
	const twice = [...bound.entries()].filter(([, n]) => n > 1).map(([b]) => b);
	if (twice.length) return fail(`filed in more than one space: ${twice.join(', ')} — a building has one home`);

	return { ok: true, result: spaces };
}

/**
 * What the poll carries. **No file is not an error** — it is the ordinary state of a city he has
 * not arranged yet, and the City draws the register's own neighborhoods for it (`spaces.derived`).
 * A file that will not parse *is* an error, and it is printed rather than swallowed: his file is
 * left exactly as it is, so nothing the deck does can destroy an arrangement it failed to read.
 */
export function readArrangement(): Arrangement {
	const path = arrangementFile();
	if (!existsSync(path)) return { spaces: [], his: false, error: null };
	let raw: string;
	try { raw = readFileSync(path, 'utf8'); }
	catch (e) { return { spaces: [], his: false, error: `cannot read ${path}: ${(e as Error).message}` }; }
	if (Buffer.byteLength(raw, 'utf8') > LIMITS.bytes)
		return { spaces: [], his: false, error: `${path} is over ${LIMITS.bytes} bytes — refusing to parse it` };
	let body: unknown;
	try { body = JSON.parse(raw); }
	catch (e) { return { spaces: [], his: false, error: `${path} is not JSON: ${(e as Error).message}` }; }
	const parsed = parseArrangement(body);
	return parsed.ok
		? { spaces: parsed.result, his: true, error: null }
		: { spaces: [], his: false, error: `${path}: ${parsed.error}` };
}

/** Human-readable, tab-indented, newline-terminated — a file he can open and edit by hand. */
export const arrangementBytes = (spaces: readonly Space[]): string => `${JSON.stringify({ spaces }, null, '\t')}\n`;

/**
 * One write, and it lands whole: the bytes go to a sibling temp file and are renamed over the
 * target, so a kill mid-write leaves the previous arrangement intact rather than a truncated one
 * (glass-shatters, §1's standing bar). An emptied arrangement writes `{"spaces": []}` rather than
 * removing the file — "I arranged nothing" and "I have never arranged" are different answers, and
 * the second one would silently bring the derived neighborhoods back.
 */
export function writeArrangement(spaces: readonly Space[]): Outcome<Arrangement> {
	const path = arrangementFile();
	const bytes = arrangementBytes(spaces);
	if (Buffer.byteLength(bytes, 'utf8') > LIMITS.bytes) return fail(`an arrangement is at most ${LIMITS.bytes} bytes`);
	try {
		mkdirSync(deskDir(), { recursive: true });
		const tmp = `${path}.writing`;
		writeFileSync(tmp, bytes);
		renameSync(tmp, path);
	}
	catch (e) { return fail(`cannot write ${path}: ${(e as Error).message}`); }
	return { ok: true, result: { spaces: [...spaces], his: true, error: null } };
}

/**
 * `POST /desk/arrangement` — his whole arrangement, written whole.
 *
 * **No credential gate** (B6 F3's law, fourth venue): this reaches a file in the desk and no
 * socket, so cold hands must never cost him the ability to arrange his own City. And the client
 * sends the whole tree rather than an operation, because the tree is what the file holds: one
 * parse boundary, one write, and no server-side replay of gestures that could disagree with what
 * he is looking at.
 */
export function arrangementRoute(body: unknown): Response {
	const parsed = parseArrangement(body);
	if (!parsed.ok) return json(parsed, 400);
	const out = writeArrangement(parsed.result);
	return json(out, out.ok ? 200 : 409);
}
