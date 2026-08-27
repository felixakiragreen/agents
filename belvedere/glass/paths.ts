// Every disk anchor the glass touches, in one place. Reads are the whole city; the writes
// are exactly the four the fence names (README §2) and all of them land in gitignored zones.

import { homedir } from 'os';
import { dirname, join } from 'path';

const home = homedir();

/** The city: the register is discovery over this tree (the-city §1, P3's worktree law). */
export const CITY = process.env.GLASS_CITY ?? join(home, 'code');

/** D6's census home — beside `invocations.jsonl`, gitignored. `$CENSUS_DIR` is B1's own knob. */
export const CENSUS_DIR = process.env.CENSUS_DIR ?? join(home, 'code/agents/summon/log/census');
export const CENSUS = join(CENSUS_DIR, 'census.jsonl');

/** The hands' three writes: one summons file per fire, one audit line per action, the HALT flag. */
export const SUMMONS_DIR = join(CENSUS_DIR, 'summons');
export const AUDIT = join(CENSUS_DIR, 'hands.jsonl');
export const HALT = join(dirname(CENSUS_DIR), 'HALT');

/** The credential, outside the repo and outside every backup the city keeps (B4 §2). */
export const HANDS_ENV = process.env.BELVEDERE_ENV ?? join(home, '.config/belvedere/env');

/** The rig's tables: mantle → colour, config dir → account label, and the lineage counter. */
export const PRESETS = join(home, 'code/agents/summon/presets.tsv');
export const ACCOUNTS = join(home, 'code/agents/summon/accounts.tsv');
export const INVOCATIONS = join(home, 'code/agents/summon/log/invocations.jsonl');

/** D3 — localhost only. Real auth arrives with the Ava chapter, before any other bind. */
export const HOST = '127.0.0.1';
export const PORT = Number(process.env.GLASS_PORT ?? 4400);
