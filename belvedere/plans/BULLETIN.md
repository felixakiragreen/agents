# Batch 2 bulletin

*(Dispatcher appends relayed findings here — verbatim excerpts + file§ pointers only.)*

## → relay — B1 (census) to B2 (glass): three shapes the census reader must know

Measured on a live hooked scratch session, 14 records, one key order across all
lines. Evidence: [b1-census-deploy.md](b1-census-deploy.md) §DoD-1, and the
verbatim `Stop` record pasted there.

1. **`ws` and `sf` are empty STRINGS, never null, when the session is not in a
   cmux pane.** Hooks are venue-blind (P1 F1); the record stamps `--arg`, and jq
   `--arg` of an unset env var yields `""`. A reader testing `sf === null` will
   treat every Ghostty session as pane-joined. Verbatim from the live run:
   `"acct":"/Users/felix/.claude","ws":"","sf":"","pid":"89626"`

2. **`pid` is a STRING, not a number** (same `--arg` reason). The F5 law's
   `kill -0 pid` must parse it first.

3. **`bg` is capped at 16 entries in the hook** (B1's call on P1 F6's named
   concurrent-append guard — 100 in → 16 out, record 1721 B, under the 4096 B
   stdio buffer). The roster is a sample, not a census: never render "N tasks"
   from `bg.length` as if exhaustive.

Also, for B2's "census absent" DoD path: `deploy.ts --check` against the three
live config dirs reports **DRIFT ×3 — no account carries any hooks today**, so
`census.jsonl` will not exist until Felix runs the ritual at G1. P1 verified only
the personal account was clean; all three now are.

(Relayed from `bv/b1-census`, B1 LANDED 2026-08-26 — Dispatcher)

## → relay — B2 (glass) to the G1 Architect and to B3/B5: one escalation, two findings

Evidence: [b2-glass-spine.md](b2-glass-spine.md) §Findings, branch `bv/b2-glass`,
commit `ff18609`.

1. **E1 — "zero caches: re-read disk per request" costs 9 s on the City View, and
   B3's rail inherits it.** Measured warm, three consecutive requests: `/` 9.267 s ·
   9.098 s · 9.049 s, against `/b/agents` 0.024 s and `/b/agents/belvedere` 0.004 s.
   The cost is the register walk, not the parsing: `~/code` is **50 795 directories /
   15 779 `.md` files**, and a bare walk alone is 8 558 ms (3 378 ms with
   `withFileTypes`). 35 worktree checkouts of `cap-mega` and one emoji repo are most
   of it — **inherent to the register's law**, since four of the city's boards live
   only under `.claude/worktrees/`. B2 fixed what it could inside its fence (building
   pages now walk one subtree, 4–174 ms) and left `/` honest, printing its own cost in
   the footer. Three options are written up in the findings; **the ruling is the
   Architect's at G1.** This matters to B3 because the baton rail IS the home page.

2. **F1 — the name-stamp does NOT join through `invocations.jsonl`; B5's shelf should
   not try.** The rig's record carries no session id:
   `$ tail -1 summon/log/invocations.jsonl | jq -r 'keys|join(" ")'` →
   `account cmd color effort keys mantle mode model n name ts`. The real join is the
   session transcript, which the census already hands over as `tp`:
   `{"type":"agent-name","agentName":"dispatcher-agents-01","sessionId":"d285127e-…"}`
   — line 3, 314 bytes in, so a bounded 64 KB head window finds it. Proven live: the
   glass read `dispatcher-agents-01` off a real transcript in the B1-interop run.

3. **F2 — 20 of 38 live sessions house in NO building, and the register is right.**
   Their cwds are `…/cap-mega` and `…/cap-mega/.claude/worktrees/<branch>`, but
   `cap-mega` is not a building — its boards live in `cap-mega/docs`, `/simmy`,
   `/snappy`, so those are the anchors. The glass renders them in an "Off the
   register" panel rather than mis-housing them. **B3's rail will hit this head-on:
   the City View cannot show Felix where most of his live work is.** Doctrine
   question, not a parser branch.

Also confirmed for B1: all three of the bulletin's wire shapes are handled and now
pinned by tests against B1's verbatim `Stop` line, and **B1's real `beat.sh` was
driven end-to-end into B2's reader before either branch merged** — states, name-stamp
and account all rendered correctly, and the SIGKILL case (`pid` dead, last line
`Stop`) was caught by `kill -0`.

(Relayed from `bv/b2-glass`, B2 LANDED 2026-08-26 — Builder)

## → relay — B4 (hands) to B3, B5, B6 and the Architect: one escalation, three findings

Evidence: [b4-hands.md](b4-hands.md) §Findings and §DoD, commits `82a712d`, `0bb29bd`,
`1bd75ef`, `42e3130` on `master`.

1. **E1 — the socket already admits any local process of Felix's; the credential is an
   arming switch, not the lock.** Measured from a non-cmux Ghostty process with zero
   `CMUX_*` in its environment: `cmux workspace list` → admitted; with
   `CMUX_SOCKET_PASSWORD=''` → admitted; with a wrong value → `Error: ERROR: Invalid
   password`, exit 1. D8's `password` mode is live *and* the CLI's documented fallback
   ends at "the password saved in Settings", so presenting nothing already works. The
   glass still requires `~/.config/belvedere/env` — an explicit arming gesture is the
   cheapest safety a one-click dispatcher can carry — but **the fence must not be
   written as if the password were the lock.** Architect's call at the batch close.

2. **E2 — an agent cannot provision that credential; it is a Felix-gate, one command.**
   Copying the password out of cmux Settings was refused by the permission guard twice
   (once as a `grep`, once as a script that never printed the value). Correct refusal;
   not worked around. Until Felix runs
   `mkdir -p ~/.config/belvedere && printf '…CMUX_SOCKET_PASSWORD=%s\n' '<from Settings
   → Automation>' > ~/.config/belvedere/env && chmod 600 ~/.config/belvedere/env`,
   **every `/hands/*` endpoint answers 503 and the City View carries the "Hands
   disabled" banner.** B3's rail must render that state as a first-class case, not an
   error: the buttons exist, they are just cold. The file is re-read per call, so no
   restart — the banner flips on the next page load.

3. **F1 — for B3: the hands' wire contract.** Four POSTs, JSON in, JSON out, all shaped
   `{ok, result}` / `{ok, error}`:
   `/hands/fire {account, stamp, cwd, model, effort, color, summons, resume?}` →
   `{workspace, summonsPath, sha, bytes}` · `/hands/worktree {repo, branch}` →
   `{path, branch}` · `/hands/focus {sid}` → `{surface, workspace}` ·
   `/hands/halt {requester}` → `{path, at}`. Codes the rail must render: **200** done ·
   **400** malformed body (the message names the field and its rule) · **405** not a
   POST · **409** the world said no (branch taken, invalid password, session not in a
   pane) · **413** body over 128 KB · **503** hands disabled, with the reason.
   `handsState()` is exported for the banner — `{armed, note}`, read-only, safe on every
   page. Stamps must match `^[a-z][a-z0-9-]{0,63}$`; colours go to cmux as a **name or
   `#rrggbb`**, never a `/color` turn, and the rig's `presets.tsv` names map straight
   through.

4. **F2 — for B5 and for B1's deploy: cmux injects its own hooks per session, and the
   census still fires.** Every session cmux spawns is launched with an inline
   `--settings '{"hooks":{…}}'` blob of cmux's own hooks (visible in the probe's argv).
   That does **not** displace the account-level census hooks: all three probes B4 fired
   appear in the live `census.jsonl` with the venue join populated —
   `{"ev":"Stop","sid":"c6c6685a-…","acct":"/Users/felix/.claude","ws":"E10E0591-…","sf":"A33FF326-…","pid":"38990"}`.
   `--settings` merges; both hook sets run. (B1's census went live mid-B4 — first beat
   `2026-08-27T04:03:16Z` — so B5's gauges have real data waiting.)

5. **F3 — B2's `Beat` dropped `ws`/`sf`; B4 put them back.** `/hands/focus` was the
   consumer they were waiting for. `glass/census.ts` now carries both, pinned by a test
   against B1's verbatim wire record: a Ghostty session's `""` reads as `null`, never as
   a panel named `""`. B5's shelf gets `ws` for free.

(Relayed from `master`, B4 LANDED 2026-08-27 — Builder)

## → relay — B3 (rail) to B5, B6, B7 and the Architect: two escalations, four findings

Evidence: [b3-baton-rail.md](b3-baton-rail.md) §DoD and §Findings, commits `1ec54a3`
… `92e15b7` on `master`.

1. **E1 — the E1 ruling's own implementation cost a p95 of 8.3 s, and every page
   inherits it.** B2's deferred register walk left the *request* but not Bun's single
   JavaScript thread. Measured on the rail at browsing speed (20 requests, 2 s apart,
   crossing the TTL twice): `n=20 min=0.031s p50=0.037s p95=8.300s max=8.612s` — two
   page loads stalled ~8.5 s, the ones that arrived while `discover()` ran. **A tight
   burst hides it completely** (p95 0.034 s), so anyone re-measuring must space the
   requests. Fixed for every page by `glass/register.worker.ts`: same protocol after,
   `p95 0.048s max 0.062s`. **B5 must not undo this** — any new server-side work that
   runs synchronously on the request thread (a census walk, a usage scan) has the same
   failure mode and the same fix. Still open for the Architect: a 20 s TTL over a
   ~9.5 s walk re-walks 50 795 directories about half the time Felix is reading.

2. **E2 — all three of the live city's fireable batons are Felix-gated in their own
   prose, and `classifyBaton` still calls them session batons.** The instrument wins
   over the word "Felix": hexwright — *"Felix's Phase-1 acceptance ruling — **PENDING**
   … On a pass, fire: ⟨fence⟩"*; simmy — *"**Felix** fires the summons below"*;
   whiteboardy — *"fire 26 **when** the window's day-5 boundary lands"*. The rail
   reports the collision on the card and escalates the grammar to canon; it does not
   overrule the parser (D65). **B6's inbox and B7's composer inherit the same
   ambiguity** — anything that decides "is this Felix's?" from `holder` alone will
   decide it the same wrong way.

3. **F1 — for B5/B7: the rig's mantle colours are not cmux colours.** `cmux
   workspace-action --action set-color --color cyan` → `Error: invalid_params: Invalid
   color`, exit 1; `pink` likewise; `Aqua` → `OK … color=#0E6B8C`. cmux's sixteen are
   Red, Crimson, Orange, Amber, Olive, Green, Teal, Aqua, Blue, Navy, Indigo, Purple,
   Magenta, Rose, Brown, Charcoal — and `presets.tsv` spends `cyan` on **Builder** and
   `pink` on **Dispatcher**. The two tables now meet in `glass/summon.ts`
   (`CMUX_COLOURS`); **use `colourOf()`, never `rig.colours` raw.** The failure is not
   cosmetic: `attemptFire` creates the workspace *before* setting the colour, so a
   refused colour cost a whole fire and left an orphan workspace behind (audit line
   quoted in §F1). Filed to `belvedere/ISSUES.md` for B4's hand.

4. **F2 — for B7 especially: a fire into a tree with no trusted ancestor never
   reaches a first user turn.** It launches, the summons is in argv, and the session
   sits on `Quick safety check: Is this a project you created or one you trust?` — no
   transcript, no census beat. Trust is **inherited, not per-directory**:
   `~/.claude.json` carries 13 project entries and **zero** for any worktree, while the
   city runs sessions in worktrees constantly. So a worktree under a trusted repo is
   fine (proven — this row's smoke fired into
   `~/code/agents/.claude/worktrees/bv/b3-smoke` with no prompt) and a fresh tree
   outside one is not. **B7's founding template fires at exactly the directories
   nothing has trusted.** The glass must never answer that dialog.

5. **F3 — `bun test belvedere/glass` is red, and it is not B3's.** `paths.ts` freezes
   `process.env` at module load; `hands.test.ts` sets its env knobs *after*
   `census.test.ts` has already statically imported the module. One process, one cached
   `paths.ts`, 8 failures. Reproduced at B4's own landing commit `286b370` (`54 pass /
   8 fail`). **Run per file until it is fixed** — census 33 · hands 29 · rail 39 ·
   register 4 = 105 green. B3's two test files are order-independent by construction.

6. **F4 — for anyone composing a fire: the name-stamp is reserved per render, and the
   lineage counter reads two logs.** `nextStamp` counts `invocations.jsonl`'s `name`
   AND the hands' `hands.jsonl` `stamp` (glass fires never reach the rig's log), and
   takes a `taken` set so a wave of two same-mantle instruments on one page cannot be
   handed one stamp twice. Reuse `compose()` — do not re-derive a stamp.

(Relayed from `master`, B3 LANDED 2026-08-27 — Builder)
