/**
 * Live identity: **cmux is truth for what a session is called and what colour it wears** (D16).
 *
 * The census answers *what is alive*; it cannot answer *what Felix calls it*. Its `ws`
 * (`CMUX_WORKSPACE_ID`) is stamped at hook time and never changes, so a workspace renamed or
 * recoloured in cmux leaves every rig-derived name in the glass one revision stale — which is the
 * whole drift class the field report caught. This module reads the other side: one socket call,
 * held warm, joined on `ws`.
 *
 * Two laws hold it down:
 *
 *  1. **The rig's stamp is the birth name.** `session_id` stays the join key and the stamp stays
 *     on the card; the live name is what cmux says *now*, and where they differ both are shown.
 *  2. **Degrade honestly, never guess** (D10's family). A socket that will not answer marks
 *     identity stale with the reason; it does not fall back to the birth name and call it live.
 */

import { cmux, readCredential, type Outcome } from './hands';

/** Everything has a limit: a poll-path socket read gets seconds, not the hands' twenty. */
const READ_MS = 5_000;

/**
 * How stale the held copy may be before a caller waits for a fresh one. Below the deck's 3 s poll,
 * so a rename made in cmux is on the deck within one poll — measured at this row, and the reason
 * this is a TTL rather than a background timer: a spawn every second forever, with no deck open,
 * is a cost nobody asked for.
 */
export const IDENTITY_TTL_MS = 2_000;

/** One workspace as cmux describes it. The conversation fields it also carries are not read. */
export type LiveWorkspace = {
	id: string;
	ref: string;
	title: string;
	/** `#RRGGBB` as cmux resolved it, or null where the workspace wears no custom colour. */
	color: string | null;
	cwd: string | null;
	selected: boolean;
};

export type IdentityRead = {
	/** Epoch seconds of the read that produced this copy — the age the deck prints. */
	at: number;
	/** Why identity is unavailable, or null. A copy with an error keeps its last good workspaces. */
	error: string | null;
	workspaces: LiveWorkspace[];
};

// ---------- the parse boundary ----------

const str = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null);

/**
 * `cmux workspace list --json` in, trusted workspaces out. A workspace with no id names nothing
 * and is dropped; the rest still count (the census's own rule for a roster entry).
 *
 * `custom_title` is what Felix typed; `title` is what cmux displays, which is the same string once
 * anything has named the workspace. The displayed one wins — the deck shows what the sidebar shows.
 */
export function toWorkspaces(raw: unknown): LiveWorkspace[] {
	const list = (raw as { workspaces?: unknown } | null)?.workspaces;
	if (!Array.isArray(list)) return [];
	const out: LiveWorkspace[] = [];
	for (const item of list) {
		if (typeof item !== 'object' || item === null) continue;
		const w = item as Record<string, unknown>;
		const id = str(w['id']);
		const title = str(w['title']) ?? str(w['custom_title']);
		if (id === null || title === null) continue;
		out.push({
			id,
			ref: str(w['ref']) ?? id,
			title,
			color: str(w['custom_color']),
			cwd: str(w['current_directory']),
			selected: w['selected'] === true,
		});
	}
	return out;
}

// ---------- the held copy ----------

const COLD: IdentityRead = { at: 0, error: 'identity has not been read yet', workspaces: [] };

let held: IdentityRead = COLD;
let inflight: Promise<IdentityRead> | null = null;

/** What the glass is holding, without asking the socket. Tests and the shell's error paths use it. */
export const heldIdentity = (): IdentityRead => held;

/** Drop the held copy — a write-through hand calls this so the next read cannot show its own past. */
export const bustIdentity = (): void => { held = COLD; };

async function read(): Promise<IdentityRead> {
	const cred = readCredential();
	// The socket admits any local process of Felix's (D9) — the credential is the glass's arming
	// switch, and an unarmed glass reads no identity rather than reaching for the socket anyway.
	if (!cred.ok) return { at: Date.now() / 1000, error: `identity unavailable — ${cred.error}`, workspaces: held.workspaces };

	const out: Outcome<string> = await cmux(cred.result, READ_MS, 'workspace', 'list', '--json');
	if (!out.ok) return { at: Date.now() / 1000, error: out.error, workspaces: held.workspaces };

	let parsed: unknown;
	try { parsed = JSON.parse(out.result); }
	catch (e) { return { at: Date.now() / 1000, error: `cmux workspace list answered no JSON: ${(e as Error).message}`, workspaces: held.workspaces }; }

	return { at: Date.now() / 1000, error: null, workspaces: toWorkspaces(parsed) };
}

/**
 * The live identity, at most `IDENTITY_TTL_MS` old. One read at a time: a second caller arriving
 * during a read joins it rather than spawning a second `cmux`.
 *
 * The wait is deliberate and is the poll's own — measured at this row against the 500 ms bar. It is
 * not the walk B8 F3 forbids: a spawn yields Bun's thread, so requests arriving inside it are served.
 */
export async function identity(nowMs = Date.now()): Promise<IdentityRead> {
	if (nowMs - held.at * 1000 <= IDENTITY_TTL_MS) return held;
	if (!inflight) inflight = read().finally(() => { inflight = null; });
	held = await inflight;
	return held;
}

/** The join the deck draws with: workspace id → what cmux calls it now. */
export const byWorkspace = (r: IdentityRead): Map<string, LiveWorkspace> =>
	new Map(r.workspaces.map(w => [w.id, w]));
