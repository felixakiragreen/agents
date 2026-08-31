// Every disk anchor the glass touches, in one place. Reads are the whole city; the writes
// are exactly the four the fence names (README §2) and all of them land in gitignored zones.
//
// **An anchor the environment can move is a function; an anchor it cannot is a constant.** The
// parentheses carry that information and nothing else. Frozen env was hidden state with a real
// bug behind it: `paths.ts` resolved `$CENSUS_DIR` and `$BELVEDERE_ENV` once at module load, so
// `hands.test.ts` — which sets both, then imports — got the LIVE anchors whenever another test
// file had already pulled the module in. Eight failures in one process, and the credential gate
// read Felix's real password into the test output (B8 §4).

import { homedir } from 'os';
import { dirname, join } from 'path';

const home = homedir();

/** The city: the register is discovery over this tree (the-city §1, P3's worktree law). */
export const cityRoot = () => process.env.GLASS_CITY ?? join(home, 'code');

/**
 * The canon repo — the Guild's own building, and the fallback every reference resolves against
 * when its own building does not carry the id (B20 §2: local first, then canon). Relative to the
 * city rather than to `$HOME` so a fixture city can carry a canon of its own; in the real city it
 * is `~/code/agents`, which is what the hardcoded anchors below already assume.
 */
export const canonRoot = () => join(cityRoot(), 'agents');

/**
 * D6's census home — beside `invocations.jsonl`, gitignored. `$CENSUS_DIR` is B1's own knob, and
 * `LIVE_CENSUS` is what it defaults to: the city's real telemetry, named so the hands' interlock
 * can recognise it (`hands.ts` §the live-neighbourhood interlock).
 */
export const LIVE_CENSUS = join(home, 'code/agents/summon/log/census');
export const censusDir = () => process.env.CENSUS_DIR ?? LIVE_CENSUS;
export const censusFile = () => join(censusDir(), 'census.jsonl');

/** The hands' three writes: one summons file per ignition, one audit line per action, the HALT flag. */
export const summonsDir = () => join(censusDir(), 'summons');
export const auditLog = () => join(censusDir(), 'hands.jsonl');
export const haltFlag = () => join(dirname(censusDir()), 'HALT');

/** The credential, outside the repo and outside every backup the city keeps (B4 §2). */
export const handsEnv = () => process.env.BELVEDERE_ENV ?? join(home, '.config/belvedere/env');

/**
 * The v3 engine's telemetry tree: every campaign's run dirs under it, each holding a `run.jsonl`
 * that IS the run (cornerstone §3.4). **The deck reads it and never writes it** — the engine runs
 * out of process, and the glass's own engine retired whole at C15.
 *
 * `$RUNS_DIR` is `$CENSUS_DIR`'s twin, and it exists for the same reason: a probe must be able to
 * point the deck at a fixture run tree without being able to mistake it for the real one.
 */
export const runsRoot = () => process.env.RUNS_DIR ?? join(canonRoot(), 'summon/log/v3');

/** The D53 header a building's FIRST gesture mints its inbox from (DOCTRINE §3, adoption-on-first-need). */
export const ISSUES_TEMPLATE = join(home, 'code/agents/canon/work/templates/issues.md');

/** The rig's tables: mantle → colour, config dir → account label, and the lineage counter. */
export const PRESETS = join(home, 'code/agents/summon/presets.tsv');
export const ACCOUNTS = join(home, 'code/agents/summon/accounts.tsv');
export const INVOCATIONS = join(home, 'code/agents/summon/log/invocations.jsonl');

/** The rig's usage caches — one per account, written by `summon-usage`. Read only, never written. */
export const usageDir = () => process.env.USAGE_DIR ?? join(home, 'code/agents/summon/log/usage');

/** Where an account keeps its transcripts. The shelf's whole corpus is these three trees. */
export const projectsDir = (configDir: string) => join(configDir, 'projects');

/**
 * Where the sovereign's inbox lands — `deskDir`'s sibling, and the fence's other write that stands
 * in FRONT of the arming switch (D18 class 2; B6 F3). Default: the city itself, so a gesture
 * appends to the target building's own `ISSUES.md` and the knob costs the real deck nothing.
 *
 * **This is the knob C17 F2 named missing.** A disarmed twin is not an inert one: `POST /inbox` is
 * un-gated by design, so a probe clicking "file it" wrote into a real building's inbox. Pointed
 * elsewhere, the same gesture lands under this root at the building's own city-relative path — the
 * write moves, the fence does not (`inbox.ts` §the write fence still measures against the city).
 */
export const inboxRoot = () => process.env.INBOX_DIR ?? cityRoot();

/**
 * The desk — **one drawer, city-wide** (D17), and the glass's only file-write neighborhood outside
 * the gitignored telemetry (D18 class 3). Relative to the canon repo for the same reason
 * `canonRoot` is: a fixture city carries a desk of its own, so a probe can never write into the
 * real one.
 *
 * B16 mints `desk/drafts/` and nothing else there — the desk proper is B19's row.
 */
export const deskDir = () => process.env.DESK_DIR ?? join(canonRoot(), 'desk');
export const draftsDir = () => join(deskDir(), 'drafts');

/** D3 — localhost only. Real auth arrives with the Ava chapter, before any other bind. */
export const HOST = '127.0.0.1';
export const port = () => Number(process.env.GLASS_PORT ?? 4400);
