// The three accounts, and the venue trust the engine prechecks against them.
//
// C4 F0's clean room is the engine's already (`spawn.ts`); what layer 1 adds is
// only *which* config dir the run points at. `CLAUDE_CONFIG_DIR` selects the
// account and HOME is never overridden, so an account here is one path.
//
// The trust read is C4 F8's, made real (`venue.ts` reserved the slot for this
// charge): a session born headless in a cwd the account has never trusted is
// **unsummonable** — the TUI stops on the workspace-trust dialog, which only
// `-p` skips. So the precheck answers from the same file the TUI would consult.

import { existsSync, readFileSync } from "node:fs";
import type { Trust, VenuePrecheck } from "../../engine/venue.ts";
import type { Venue } from "../../engine/spawn.ts";

export const ACCOUNTS = {
	personal: "/Users/felix/.claude",
	"thg-fgreen": "/Users/felix/.claude-thg-fgreen",
	"thg-doorbell": "/Users/felix/.claude-thg-doorbell",
} as const;

export type Account = keyof typeof ACCOUNTS;

export const ALL: readonly Account[] = ["personal", "thg-fgreen", "thg-doorbell"];

/**
 * Where the account's own `.claude.json` lives. The default account keeps it
 * beside HOME; a `CLAUDE_CONFIG_DIR` account keeps it inside the dir. Measured,
 * not assumed — both shapes exist on this machine.
 */
export function configJson(account: Account): string {
	const inside = `${ACCOUNTS[account]}/.claude.json`;
	return existsSync(inside) ? inside : `${ACCOUNTS[account]}.json`;
}

/** Every cwd the account has accepted the trust dialog for. */
export function trustedDirs(account: Account): string[] {
	const path = configJson(account);
	if (!existsSync(path)) return [];
	const raw: unknown = JSON.parse(readFileSync(path, "utf8"));
	const projects = (raw as { projects?: Record<string, { hasTrustDialogAccepted?: unknown }> }).projects;
	if (projects === undefined) return [];
	return Object.entries(projects).filter(([, p]) => p.hasTrustDialogAccepted === true).map(([dir]) => dir);
}

/** A cwd is trusted if the account accepted it, or accepted an ancestor of it —
 *  the assumption this charge measures rather than asserts (see findings). */
export function trusts(account: Account, cwd: string): boolean {
	return trustedDirs(account).some((dir) => cwd === dir || cwd.startsWith(`${dir}/`));
}

/** The engine's `VenuePrecheck`, answered from the account's own trust record. */
export const precheckReal: VenuePrecheck = (account, cwd): Trust =>
	trusts(account as Account, cwd)
		? { trusted: true }
		: { trusted: false, reason: `${account} has never accepted the workspace-trust dialog for ${cwd} — a session born here is unsummonable (C4 F8)` };

/** A run's venue: the subject's cwd, and the account dir that holds its
 *  transcript. The engine reads both and needs nothing else. */
export const venueOn = (account: Account, workDir: string): Venue =>
	({ workDir, configDir: ACCOUNTS[account] });
