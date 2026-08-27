# glass — the spine

One bun server rendering the city from the truth layer. **Read-everything,
write-narrow**: every page route touches nothing on disk; the four `/hands/*` routes
are the fence's whole write list (README §2) and nothing else in here writes.

```
bun belvedere/glass/server.ts        # → http://127.0.0.1:4400
bun test <file>                      # per file — the suite shares one env (ISSUES, B3 §F3)
```

| Route | What |
|---|---|
| `/` | **the baton rail** — every baton, Felix-gate and pending countersign, one column, buttons |
| `/city` | City View — a card per building: lit windows, board pulse, lint count |
| `/b/<building>` | board · ledger tail + baton · decision queue · ISSUES · live sessions · lint |
| `/doc?p=<path>` | the read-only viewer every rendered link resolves into (D58) |
| `POST /hands/{fire,worktree,focus,halt}` | the four writes; 503 until `~/.config/belvedere/env` is armed |

**Three sources. Content is re-read per request, always; only the register — *which*
directories are buildings — is held warm** (G1's E1 ruling; `register.ts`, TTL 20 s,
age printed in every footer). Buildings: canon
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

**Known cost:** the register walk is **~9.5 s** over 50 795 directories, so it runs on a
worker thread ([`register.worker.ts`](register.worker.ts)) — on the request thread it
stalled 2 of every 20 page loads by 8.5 s (measured, [B3
§E1](../plans/b3-baton-rail.md#findings)). Warm, `/` is **p95 48 ms**; building pages
walk one subtree, 8–40 ms. Whether a 20 s TTL over a 9.5 s walk is the right policy is
still the Architect's ([B2 §E1](../plans/b2-glass-spine.md#findings) has the canon-side
fold: `readdirSync({withFileTypes})`, 2.5×).
