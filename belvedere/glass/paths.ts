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

/** D6's census home — beside `invocations.jsonl`, gitignored. `$CENSUS_DIR` is B1's own knob. */
export const censusDir = () => process.env.CENSUS_DIR ?? join(home, 'code/agents/summon/log/census');
export const censusFile = () => join(censusDir(), 'census.jsonl');

/** The hands' three writes: one summons file per fire, one audit line per action, the HALT flag. */
export const summonsDir = () => join(censusDir(), 'summons');
export const auditLog = () => join(censusDir(), 'hands.jsonl');
export const haltFlag = () => join(dirname(censusDir()), 'HALT');

/** The credential, outside the repo and outside every backup the city keeps (B4 §2). */
export const handsEnv = () => process.env.BELVEDERE_ENV ?? join(home, '.config/belvedere/env');

/**
 * Declared flows — **committed truth**, a batch note as data (B10 §1). Relative to the canon repo
 * rather than to `$HOME` for the same reason `canonRoot()` is: a fixture city carries flows of its
 * own, and a probe must never be able to read the real ones as truth. `$FLOWS_DIR` is this row's
 * knob, `$CENSUS_DIR`'s twin.
 */
export const flowsDir = () => process.env.FLOWS_DIR ?? join(canonRoot(), 'belvedere/flows');

/**
 * A flow's run-state, in the D6 telemetry neighborhood beside the census — **gitignored, written by
 * the engine (B11), never by this row**. The board stays the only truth about work; this is the
 * engine's working memory.
 */
export const flowRun = (name: string) => join(censusDir(), 'flows', `${name}.run.jsonl`);

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

/** D3 — localhost only. Real auth arrives with the Ava chapter, before any other bind. */
export const HOST = '127.0.0.1';
export const port = () => Number(process.env.GLASS_PORT ?? 4400);
