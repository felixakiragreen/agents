// The venue: where a subject works, which account owns it, and whether that
// account can ever see it.
//
// **The trust precheck (C4 F8).** A session can be born headless in a cwd the
// account has never trusted and then be **unsummonable** — the TUI stops on the
// workspace-trust dialog, which `-p` skips and only `-p` skips. So trust is
// checked at ignite, not at summon, or D20's fallback is missing exactly when
// it is wanted. The precheck answers from the same file the TUI would consult.
//
// **The account is a path, never a name** (C4 F0): `CLAUDE_CONFIG_DIR` selects
// it and HOME is never overridden, so everything here is keyed on the config dir
// the venue already carries. `ACCOUNTS` exists to put a human's word on one of
// the three — a display convenience, never the mechanism.
//
// C8 wrote this read inside a dig's scratch and C10 became its second caller;
// this is the slot the stub reserved for it, and it is the only copy in the city
// (C10 F6, promoted at C14).

import { existsSync, readFileSync } from "node:fs";
import type { Subject } from "./flow.ts";
import type { Venue } from "./spawn.ts";

export type Trust = { trusted: true } | { trusted: false; reason: string };

/** Run before every ignition. It is handed the venue itself and the subject
 *  that is about to live in it — the config dir IS the account, so nothing here
 *  needs a name, and the subject's arm decides whether a real config dir is
 *  read at all. */
export type VenuePrecheck = (venue: Venue, subject: Subject) => Trust;

/** Felix's three accounts, by the word he calls them. The only place in the
 *  city that maps a name to a config dir; the engine never needs it. */
export const ACCOUNTS = {
	personal: "/Users/felix/.claude",
	"thg-fgreen": "/Users/felix/.claude-thg-fgreen",
	"thg-doorbell": "/Users/felix/.claude-thg-doorbell",
} as const;

export type Account = keyof typeof ACCOUNTS;

export const ALL: readonly Account[] = ["personal", "thg-fgreen", "thg-doorbell"];

/** The name of the account a config dir is, or null where none of the three is.
 *  A display answer: a path that matches nothing is still a perfectly good
 *  account, it just has no word for itself. */
export const accountOf = (configDir: string): Account | null =>
	(Object.entries(ACCOUNTS).find(([, dir]) => dir === configDir)?.[0] as Account | undefined) ?? null;

/**
 * Where the account's own `.claude.json` lives. The default account keeps it
 * beside HOME; a `CLAUDE_CONFIG_DIR` account keeps it inside the dir. Measured,
 * not assumed — both shapes exist on this machine.
 */
export function configJson(configDir: string): string {
	const inside = `${configDir}/.claude.json`;
	return existsSync(inside) ? inside : `${configDir}.json`;
}

/** Every cwd the account has accepted the trust dialog for. */
export function trustedDirs(configDir: string): string[] {
	const path = configJson(configDir);
	if (!existsSync(path)) return [];
	const raw: unknown = JSON.parse(readFileSync(path, "utf8"));
	const projects = (raw as { projects?: Record<string, { hasTrustDialogAccepted?: unknown }> }).projects;
	if (projects === undefined) return [];
	return Object.entries(projects).filter(([, p]) => p.hasTrustDialogAccepted === true).map(([dir]) => dir);
}

/** A cwd is trusted if the account accepted it, or accepted an ancestor of it —
 *  measured across the three accounts at C8 F2, not assumed. */
export function trusts(configDir: string, cwd: string): boolean {
	return trustedDirs(configDir).some((dir) => cwd === dir || cwd.startsWith(`${dir}/`));
}

/** The account's own trust record, answered for this venue **whatever the
 *  subject is**. A caller that means to read a live config dir names this one;
 *  the default below reaches for it only where it belongs. */
export const precheckReal: VenuePrecheck = (venue): Trust =>
	trusts(venue.configDir, venue.workDir)
		? { trusted: true }
		: { trusted: false, reason: `${accountOf(venue.configDir) ?? venue.configDir} has never accepted the workspace-trust dialog for ${venue.workDir} — a session born here is unsummonable (C4 F8)` };

/**
 * The default at ignite. A fake subject has no account: its config dir is a
 * sandbox the run made and owns, trusted by construction, and no live config
 * dir is read for it — ever. That is the whole of layer 0, the barrage and the
 * fake's own tests.
 */
export const precheckVenue: VenuePrecheck = (venue, subject) =>
	"fake" in subject ? { trusted: true } : precheckReal(venue, subject);

/** A run's venue: the subject's cwd, and the account dir that holds its
 *  transcript. The engine reads both and needs nothing else. */
export const venueOn = (account: Account, workDir: string): Venue =>
	({ workDir, configDir: ACCOUNTS[account] });
