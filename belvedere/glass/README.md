# glass — the spine

One bun server rendering the city from the truth layer. **Read-everything,
write-nothing**: this row wields none of the fence's four write powers (README §2).

```
bun belvedere/glass/server.ts        # → http://127.0.0.1:4400
bun test                             # from here — the liveness state machine
```

| Route | What |
|---|---|
| `/` | City View — a card per building: lit windows, board pulse, lint count |
| `/b/<building>` | board · ledger tail + baton · decision queue · ISSUES · live sessions · lint |
| `/doc?p=<path>` | the read-only viewer every rendered link resolves into (D58) |

**Three sources, all re-read per request, none cached.** Buildings: canon
[`doctrine/`](../../doctrine) `parse()`/`discover()` — the one parser in the city (D65),
imported, never forked. Liveness: `summon/log/census/census.jsonl` (D6), written by
[`../census/beat.sh`](../census). Identity: the name-stamp from the session transcript,
mantle colour from `summon/presets.tsv`, account from `summon/accounts.tsv`.

**The F5 law, and why `census.ts` is the only tested file:** the census says what a
session *was doing*; `kill -0 pid` says whether it still *exists*. A SIGKILL leaves `Stop`
as the last line forever, so a state rendered from one sensor is a lie waiting to happen.
No pid, or a stale record still claiming work — **unknown, never working**.

Env: `GLASS_CITY` (default `~/code`), `CENSUS_DIR` (B1's own knob), `GLASS_PORT` (4400).
Theme: [`felikai.css`](felikai.css), copied from `~/code/felix/src/felikai.css` — edit the
source and re-copy, never fork here.

**Known cost:** the City View re-walks `~/code` per request — **~9 s**, 50 k directories.
Building pages walk one subtree and cost 8–40 ms. See [B2's
findings](../plans/b2-glass-spine.md#findings); the ruling is the Architect's at G1.
