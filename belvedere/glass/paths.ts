// Every disk anchor the glass reads, in one place. The glass reads; it never writes
// (README §2 — the fence's four write powers belong to B4, not to this row).

import { homedir } from 'os';
import { join } from 'path';

const home = homedir();

/** The city: the register is discovery over this tree (the-city §1, P3's worktree law). */
export const CITY = process.env.GLASS_CITY ?? join(home, 'code');

/** D6's census home — beside `invocations.jsonl`, gitignored. `$CENSUS_DIR` is B1's own knob. */
export const CENSUS = join(process.env.CENSUS_DIR ?? join(home, 'code/agents/summon/log/census'), 'census.jsonl');

/** The rig's tables: mantle → colour, config dir → account label. */
export const PRESETS = join(home, 'code/agents/summon/presets.tsv');
export const ACCOUNTS = join(home, 'code/agents/summon/accounts.tsv');

/** D3 — localhost only. Real auth arrives with the Ava chapter, before any other bind. */
export const HOST = '127.0.0.1';
export const PORT = Number(process.env.GLASS_PORT ?? 4400);
