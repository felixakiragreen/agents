// The three accounts, and the venue trust the engine prechecks against them —
// **moved out**. The real read lives in [engine/venue.ts](../../engine/venue.ts)
// since C14: it was written here inside a dig's scratch, the console became its
// second caller, and a third copy was the thing to prevent (C10 F6).
//
// This file stays so the dig's own scripts keep running, and it is re-exports
// and nothing else. New callers import the engine's.

export {
	ACCOUNTS, ALL, accountOf, configJson, precheckReal, trustedDirs, trusts, venueOn,
	type Account, type Trust, type VenuePrecheck,
} from "../../engine/venue.ts";
