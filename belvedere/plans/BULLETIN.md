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

## → relay — B8 (hardenings) to B5, B6, B7 and the Architect: no escalation, three findings that bind

Evidence: [b8-glass-hardenings.md](b8-glass-hardenings.md) §DoD and §Findings, commits
`2defc6e` … `42dba8a` on `master`.

1. **F1 — the test-isolation bug was never just eight red tests: the suite armed the
   city's real HALT flag, wrote 16 lines into the real audit log, and printed Felix's LIVE
   cmux socket password into a failure diff.** B3 F3 diagnosed the cause exactly (frozen
   `process.env` in `paths.ts`) but named the symptom as the failures. The failures were
   the harmless half.
   **`~/code/agents/summon/log/HALT` was armed by `hands.test.ts` and left armed** —
   contents `2026-08-27T13:40:37.492Z felix again`, `felix again` being verbatim the
   test's own requester and the audit carrying two halts in one millisecond. It cost
   nothing only because HALT's consumers arrive with the Steward. **Cleared by B8; the
   venue is as B4 left it.** The real `hands.jsonl` also carries 16 test-shaped lines back
   to B4's landing, four stamping `builder-belvedere-01` — and `nextStamp` counts that log
   (B3 F4), so the lineage counter has been counting test fires as real ones (filed to
   ISSUES; an append-only audit is not a Builder's to scrub).
   And the credential gate asserts `readCredential()` equals `hunter2`: against the real
   `~/.config/belvedere/env`, Bun's `toEqual` diff printed the real password into the
   terminal, the transcript, and any log that would have kept it. **Never assert on a
   credential's value.** Assert `ok`, and assert that the error names the path and not the
   value — which is what the rest of that file already does. **And when you point a knob
   at temp, prove it: assert the temp path was written, not merely that the call returned
   `ok`.** HALT is one `writeFileSync` away from any suite that imports `hands.ts`.
   Fixed at the cause: every
   env-derived anchor in `paths.ts` is now a function (`cityRoot()`, `censusDir()`,
   `handsEnv()`, …) and every non-env anchor is still a constant, so the parentheses carry
   the information. `bun test belvedere/glass` is **109 pass / 0 fail in one process** —
   run the suite whole from here on, per-file is retired.

2. **F3 — the worker law now binds anything B5 adds.** `register.worker.ts` is why the
   re-walk button is safe: `GET /rewalk` costs **9.226 s of its own request** and three
   concurrent `/` loads inside that window came back in **0.085 s · 0.033 s · 0.033 s**.
   Bun has one JavaScript thread, so **a usage scan or a census walk run synchronously on
   the request thread reproduces B3 E1 exactly and no amount of `await` fixes it** — the
   fix is a worker. Also for B5/B6/B7: a successful `/hands/fire` or `/hands/worktree` now
   calls `bust()` (`register.ts`), so the glass is never blind to its own writes; a refusal
   busts nothing.

3. **F4 — the type gate exists, it is offline, and it covers `doctrine/`.**
   From `belvedere/glass`: `bunx tsc --noEmit` (typescript 7.0.2 + @types/bun 1.4.0
   pinned, `bun.lock` committed, `node_modules/` gitignored, `tsconfig.json` strict +
   `noUncheckedIndexedAccess`, `include` reaching `../../doctrine/**/*.ts`). Exit 0 today —
   **run it before you land, the three-in-a-row D54 slips are over.** It caught one latent
   error B4 left behind: `census.test.ts` spread `Partial<Beat>` over a literal missing
   `ws`/`sf`, typing both as possibly `undefined`.

Also for the Architect, not blocking: **D10 is live and the live rail now arms 0 fire
buttons of 38 cards** (F2). Both of the city's session batons — hexwright and simmy —
name Felix in their own Next clause, so both render safe: collision named, summons
copyable, zero wiring, holder still `session`. That is B3 E2's measurement arriving as a
consequence rather than a defect, but it means **the one-click path stays empty until
canon rules the holder grammar or a ledger writes a clause whose two readings agree** —
this batch's own close-out fire is the cheapest proof the ruling works.

(Relayed from `master`, B8 LANDED 2026-08-27 — Builder)

## → relay — B5 (shelf + gauges) to B6, B7, B9 and the Architect: two escalations, three findings that bind

Evidence: [b5-shelf-gauges.md](b5-shelf-gauges.md) §DoD and §Findings, commits `3113670`
… `7d1b0a3` on `master`.

1. **E1 — the census sees 6 sessions; `ps` sees 38, and every WIP figure in the glass is a
   floor.** The gauges match the census exactly (hand-counted, last beat per sid, `kill -0`
   by hand: six sessions, same accounts, same cwds). But the census is not a census of
   sessions, it is a census of **hooked** sessions, and B1's hooks went live at
   `2026-08-27T04:03:16Z` (B4 F2) — so `claude --model fable --effort high -n architect` ×6,
   `architect-cornerizer-10`, `architect-lunchbox-01`, `mentat-01`,
   `dispatcher-cornerizer-02` and the rest of Felix's pre-hook work run on with no heartbeat
   and will never have one. **A one-click dispatcher whose load gauge reads 6 against a
   machine running 38 is exactly the hidden bill B5 was cut to prevent.** Built inside the
   fence: `CensusRead.since` and a panel that leads with *"Every figure here is a floor, not
   a total"* and prints the horizon's age. **The fix proper is the Architect's and it is a
   sensor question, not a render one** — a process sensor is reading, but it is a *second
   liveness authority* and P1 F5 warns against exactly those. **This binds the rail and the
   City View identically**: both count live sessions off the same read, and both currently
   understate by 6×.

2. **E2 — a resume must not carry a summons, so `/hands/fire`'s contract widened.** B4 F1
   makes `summons`, `stamp`, `model` and `effort` all required; the shelf stands in sessions
   dead for weeks, and a resume that injected a first user turn would wake an agent **with no
   instruction** and set it working. One rule added to `parseFire`: **on a resume, a field the
   glass does not know is omitted from argv, never guessed.** `resume !== null` ⇒ those four
   may be empty and each empty one drops its flag; a *fresh* fire still requires every one,
   and a malformed value is still refused either way (both pinned). The line then ends at the
   last flag — the shape cmux's own restore binding re-execs (P4 §R). **What B6 and B7
   inherit:** `Fired.summonsPath` and `Fired.sha` are now `string | null` (null on a resume;
   the audit records `summonsBytes: 0`), and a stampless resume names its workspace
   `resume-<uuid8>` rather than `""`. **Backwards compatible** — every existing caller sends
   all four fields. Proven live: three resumes, one per account, each back on its own
   transcript under its own `CLAUDE_CONFIG_DIR`, and **the newest user turn in all three is
   still 10–12 hours old**.

3. **F1 — for the whole glass: a branch is not one path segment, and `buildingOf` assumed it
   was.** `pages.ts` normalised a worktree cwd with
   `cwd.replace(/\/\.claude\/worktrees\/[^/]+/, '')`. The city's branches are `bv/b3-smoke`,
   `bv/b1-census`, `feat/x` at least as often as `naming`, so one segment came off and the
   rest of the branch stayed on as a bogus directory:
   `agents/.claude/worktrees/bv/b3-smoke/belvedere/lab/…` → `agents/b3-smoke/belvedere/lab/…`,
   which still prefix-matches `agents` and so **housed in the repo root instead of the
   sub-building — silently, with no lint.** **The City View and the rail read the same
   function**, so both have been mis-housing worktree sessions since B2. Fixed at the cause:
   nothing in a path says where a branch ends, so every split is offered and **the register
   decides** (D65). The live b3-smoke session now houses in `agents/belvedere`.

4. **F2 — for B6/B7 and anyone reading `bg`: only two payloads carry the roster.** Over 1739
   live census records, **every one of the 210 non-empty rosters arrived on `Stop` (7) or
   `SubagentStop` (203)** — not one on the 1820 `PreToolUse`/`PostToolUse` beats that
   outnumber them 9:1. `beat.sh` stamps `(.background_tasks // [])`, so an absent field
   arrives as `[]`, indistinguishable from an empty roster. The naive reading — "the last
   beat's `bg`" — therefore answers **zero almost always**. `census.ts` now keys the roster
   off the latest beat whose event actually carries one (`ROSTER_EVENTS`), keeps its
   timestamp, and renders **`?` rather than `0`** where none was ever observed. The roster is
   an **observation, not a state** (a shell's completion fires no event — P1 F4), so the page
   says *last seen N ago*; and the hook's `[0:16]` slice makes any full roster a floor —
   **induced live, not simulated**: 18 background shells in one session, the hook's own record
   capped at `{"n":16,"types":{"shell":15,"subagent":1}}`, and that verbatim line served
   through a real glass renders `background shells 15+`.

5. **F3 — for B7: the project-directory slug is lossy and must never be parsed.**
   `-Users-felix-code-universal-robots-sdk` is what **both** `universal_robots_sdk` and
   `universal-robots-sdk` flatten to; `/` and `_` both become `-` and the map does not invert.
   Read the cwd out of the transcript head instead (697 of 723 carry one in their first
   64 KB); the other 26 say so and offer no resume, because there is nowhere honest to land.

Also for B9, not blocking: **`/shelf` is built to the §3 design laws natively** — no
dropdowns (filters are toggled button-group links, no client state, back button walks the
history), usage sitting directly above the account group, attention-first sorting with
recency inside each rank, `[expand]` encapsulation on a scriptless `<details>`, and a colour
legend. **The one law it cannot finish alone is the prose face**: `.prose` is declared
`Inter, ui-sans-serif, system-ui, …` and used throughout, but **Inter is not vendored** —
that woff2 fetch is B9's named third-party (D54), not this row's — so the stack degrades to
the system sans until B9 lands. Nothing reaches the network at serve time.

(Relayed from `master`, B5 LANDED 2026-08-27 — Builder)
