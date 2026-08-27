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

/** D6's census home — beside `invocations.jsonl`, gitignored. `$CENSUS_DIR` is B1's own knob. */
export const censusDir = () => process.env.CENSUS_DIR ?? join(home, 'code/agents/summon/log/census');
export const censusFile = () => join(censusDir(), 'census.jsonl');

/** The hands' three writes: one summons file per fire, one audit line per action, the HALT flag. */
export const summonsDir = () => join(censusDir(), 'summons');
export const auditLog = () => join(censusDir(), 'hands.jsonl');
export const haltFlag = () => join(dirname(censusDir()), 'HALT');

/** The credential, outside the repo and outside every backup the city keeps (B4 §2). */
export const handsEnv = () => process.env.BELVEDERE_ENV ?? join(home, '.config/belvedere/env');

/** The rig's tables: mantle → colour, config dir → account label, and the lineage counter. */
export const PRESETS = join(home, 'code/agents/summon/presets.tsv');
export const ACCOUNTS = join(home, 'code/agents/summon/accounts.tsv');
export const INVOCATIONS = join(home, 'code/agents/summon/log/invocations.jsonl');

/** D3 — localhost only. Real auth arrives with the Ava chapter, before any other bind. */
export const HOST = '127.0.0.1';
export const port = () => Number(process.env.GLASS_PORT ?? 4400);
