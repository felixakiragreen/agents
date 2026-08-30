// The venue-trust precheck (C4 F8). A session can be born headless in a cwd the
// account has never trusted and then be **unsummonable** — the TUI stops on the
// workspace-trust dialog, which `-p` skips and only `-p` skips. So trust is
// checked at ignite, not at summon, or D20's fallback is missing exactly when
// it is wanted.
//
// Layer 0 has no accounts and no real venues: the stub says yes and says so.
// C8 implements the real read (`glass/trust.ts`'s per-account shape, P5 F5.3).
// The slot exists now so ignite's pipeline has its place.

export type Trust = { trusted: true } | { trusted: false; reason: string };

export type VenuePrecheck = (account: string, venue: string) => Trust;

export const precheckVenue: VenuePrecheck = () => ({ trusted: true });
