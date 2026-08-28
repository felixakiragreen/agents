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

## → relay — B6 (sovereign inbox) to B7, B9 and the Architect: no escalation, three findings that bind

Evidence: [b6-sovereign-inbox.md](b6-sovereign-inbox.md) §DoD and §Findings, commits `a17de28`
… `65474c1` on `master`.

1. **F2 — `parseDecisions` marks an entry pending wherever the phrase appears, including in the
   entry that DEFINES the marker, and the live rail has been showing a false countersign since
   B3.** Canon **D21** is `(2026-08-03, Architect (02) · ✓ Felix)` — countersigned three weeks
   ago — and its body is the decision that invents the ritual: *"dispatched sessions mark
   `(proposed — pending Felix countersign)`"*. `pending` runs over the whole entry, body
   included, so D21 parses `ratified: true, pending: true`. **It is the only one:** at this row's
   capture the live rail read `countersigns: 2` and both were D21 (one through a worktree copy),
   so **the live city has ZERO true pending countersigns** — B6's amendment could not be proven
   against real data and its three states were run on a synthetic `D99` on a throwaway branch.
   Handled render-side only (D65): `countersignState` puts **`ratified` first**, so the card
   renders `folded — ✓ in the decision`, offers no button, and names which of the two readings
   won — D10 applied to a countersign. The card's header pill became the **state** rather than
   the queue's word for it, because a card headlining "pending countersign" over a "folded" body
   is a card arguing with itself. **The fix proper is canon's**: match the marker only inside the
   attribution parens, or let `ratified` short-circuit `pending`. Ask filed, parser untouched.

2. **F3 — for B7 especially: `POST /inbox` is deliberately OUTSIDE the credential gate, and the
   rule that put it there is general.** `handsRoute` answers 503 before it parses a body; `/inbox`
   is mounted beside it in `server.ts` with no such gate, because spec §4 says notes must still
   append when the hands are cold (D9: the arming switch gates one-click *dispatch*, and cold
   hands must never cost Felix the ability to say something). **So: a write that reaches a socket
   belongs in `hands.ts` behind the switch; a write that only touches a file in the city belongs
   in `inbox.ts` in front of it.** The four wire primitives (`Outcome`, `fail`, `field`, `json`)
   are now exported from `hands.ts` and shared, so both boundaries answer in one shape.
   `inbox.test.ts` points `BELVEDERE_ENV` at a path that does not exist and asserts
   `handsState().armed === false` before filing through the route — the cold case is pinned.

3. **F4 — for anyone appending to an inbox: a bare bullet dropped onto a non-empty tail block
   reads as that block's evidence.** D63h allows a bare bullet, but an entry needing evidence
   becomes a `---`-separated block — so an inbox whose last block is `- <entry>` plus evidence
   lines swallows a new bare bullet into it, where the sweeping Architect reads it as more
   evidence for somebody else's entry. `addition()` opens a `---` when the tail block holds
   anything and appends the bullet directly when it does not (the D53 template ends with `---`,
   and a swept inbox drains to exactly that). Still ONE `appendFileSync`, still strictly
   append-only, and byte-for-byte the shape the canon inbox already has.

Also for B7, not blocking: **the sweep summons B7 §2 reuses is `sweepSummons()` in
`glass/inbox.ts`** — B6 §2's template verbatim, `<building>` the only substitution, written
`~`-relative the way the city writes paths; `sweepFire()` composes it into exactly what
`POST /hands/fire` parses (Architect · fable-high). Proven live: the rendered apply button's
first user turn was byte-identical to the template, 386 B, `sha bf1b1333…` both sides. And the
apply button is **one button per account in a toggled group, never a dropdown** (design law §3),
sharing one composed body and one name-stamp — only one of them will ever be clicked, and
minting three stamps to render three labels would spend two on nothing.

And for the Architect, not blocking: **three rail tests were narrowed deliberately and are
strictly stronger.** B3's Felix-card law asserted `/<button/` — no button at all. B6's blessed
amendment puts a Countersign button on a pending card and §1 puts a note box on every card, so
that assertion stopped being true while the invariant it protected did not change: *nothing on
his card may reach `/hands/fire`*. The check is now "no fire wiring **and** every button on this
card is a `class="ges"` `/inbox` gesture" — same regression caught, plus one more (a fire button
smuggled in without the old payload attributes). The reasoning sits at the assertion.

(Relayed from `master`, B6 LANDED 2026-08-27 — Builder)

## → relay — B7 (composer) to B9, the flow chapter and the Architect: no escalation, three findings that bind

Evidence: [b7-summon-composer.md](b7-summon-composer.md) §DoD and §Findings, commits `9e6707a`
… `9434b2f` on `master`.

1. **F1 — Claude Code's unit of trust is the PROJECT ROOT, it is per account, and a
   repository never borrows an ancestor's trust. The naive reading of B3 F2 returns a FALSE
   WARM.** B3 F2 is right that a cold tree stalls and that worktrees inherit; the rule
   underneath is narrower than "nearest trusted ancestor", and getting it wrong renders a
   stalled fire as a successful one — the exact silent success the B7 amendment exists to
   prevent. Measured four ways:
   **(a) per account** — each silo keeps its own `<config-dir>/.claude.json`. B3 F2 read
   `~/.claude.json`, which is the file a session with **no** `CLAUDE_CONFIG_DIR` uses; the rig
   always sets one, so the operative files are `~/.claude/.claude.json` (9 entries, including a
   blanket `/Users/felix/code`), `~/.claude-thg-fgreen/.claude.json` (13, one an explicit
   `false`) and `~/.claude-thg-doorbell/.claude.json` (12). **The same directory is warm on one
   account and cold on another.**
   **(b)** all **36** entries across the three accounts resolve to themselves under
   `git rev-parse --path-format=absolute --git-common-dir` → `dirname`; **not one** is a
   subdirectory of the project it names.
   **(c) the two stalls, inside one trusted `~/code`** — a fire into the plain directory
   `~/code/b7-founding-probe` reached its first user turn and beat the census **10 times**; a
   fire into `~/code/b7-scratch-repo`, a fresh `git init` in that same `~/code`, produced **no
   transcript directory and 0 census beats** with the `claude` process still alive holding the
   dialog, and a worktree cut under it did the same. One difference: `.git`.
   **(d)** cross-checked live: all **9** live sessions carrying a cwd are warm under the rule,
   and a running session is warm by construction — one "cold" would have falsified it.
   The rule, in `glass/trust.ts`: resolve the target to its project (the repo's **main**
   worktree root via `--git-common-dir` — which is *why* a linked worktree inherits — else the
   directory itself); its own entry wins; with no entry a **repository is cold** and a plain
   directory asks its ancestors. Both spellings of every root are indexed, because Claude
   records the cwd it was handed while `git` answers with symlinks resolved (`/tmp` IS
   `/private/tmp`). **This binds B9's sweep, the flow chapter's DAG, and any row that composes a
   fire into a directory the city has not run in before** — and it means **"fire at a scratch
   repo" is ordering a stall** (F2): a fresh repo is cold on every account, so the worktree DoD
   ran in `agents` on B3's precedent instead.

2. **F4 — the live census is a load-bearing third source for the name-stamp, and the rail
   still counts only two logs.** `nextStamp` gained an optional `known` list and the composer
   passes every stamp the census carries. On live data: **`architect-belvedere` appears 0 times
   in `invocations.jsonl` and 0 times in `hands.jsonl`** (`grep -c` both), yet the census
   carries `architect-belvedere-01` right now — so the two logs alone hand that name out a
   second time, and the composer mints `02`. **`railPage` and B6's apply button pass no `known`
   list** (the default is `[]`) and would still double-assign it; `railPage` already calls
   `readCensus()`, so the fix is threading one array through `cards()`. Parked as B3's ground,
   not taken here.

3. **F3 — for anyone composing a stamp: the glass's slug is narrower than row 14's theater
   law, deliberately.** A theater may be `A-Za-z0-9._-` (`summon.zsh:_summon_theaters_load`);
   `hands.ts`'s `STAMP` is `^[a-z][a-z0-9-]{0,63}$`. So `universal_robots_sdk` composes as
   `builder-universal-robots-sdk-NN` here and `builder-universal_robots_sdk-NN` from the rig —
   **two lineages for one theater**. Nothing is silent: the stamp is always on show and
   editable, and an edit back to the rig's spelling is refused **loudly** by `parseFire` (400,
   naming the rule). The fix is a contract change at B4's parse boundary — the Architect's.
   Also matched to the rig here: **the Grand Architect keeps no theater** (`grand-architect-11`
   measured live, not `grand-architect-belvedere-01`), and `theaterOf` reads
   `.summon-theaters` — first non-blank line, no parent walk, a line the rig would refuse falls
   back to the directory name.

Also for B9, not blocking: `/summon` is built to the §3 design laws natively — **zero
`<select>` elements on the page** (every choice is a radio wearing `.btn`, so the browser holds
the state and the back button walks it), usage on each account chip *and* the strip above the
group, encapsulation-first labels, a colour legend for the card's three states. It shares
`.prose`'s unvendored Inter with the shelf — still B9's named third-party.

(Relayed from `master`, B7 LANDED 2026-08-27 — Builder)

## → relay — B9 (visual law) to the Architect, Felix's close gates and the flow chapter: no escalation, three findings that bind

Evidence: [b9-visual-law.md](b9-visual-law.md) §DoD and §Findings, commits `2aa7311` …
`f16ec4a` on `master`.

1. **F1 — the encapsulation law is live, and the live corpus cannot satisfy it: 27 of the
   rail's 38 cards write no name at all.** The derivation is Felix's rule — the head before
   the first seam, **dash before colon** (his own `B8: glass hardenings` and `E1: register
   policy` are one phrase each, so taking the colon first would name every row after its id
   alone), at most six words. It names **11 of 38** cards. The 27 declines are honest rather
   than broken: most are gates whose entire text is already a name (`blessing`, `Felix's plan
   sketch`, `venue D2 ✓ Felix via keel §11`), the rest are Next clauses running eight or more
   words before their dash. **The spec's STOP clause was honoured — no per-repo special case
   was added, and none should be.** This is the row-17 evidence: **the shapes need a name
   FIELD**, one to six words, written by whoever files the entry; a parser cannot recover a
   name nobody wrote. Two general render rules did earn their place: a seam falling inside a
   `**bold**` span drops the orphaned marker, and **an `[expand]` that would reveal less than
   the card already shows is not drawn** — measured on `agents/ISSUES.md`:297, where
   `parseIssues` hands over one line of a five-line entry and the disclosure would have added
   two words. That second rule is also a lint signal worth reading: **wherever an entry
   suddenly stops encapsulating, the parser gave the page a truncated text.**

2. **F3 — the auditor delta is live on all three views and costs 36 ms of the request
   thread.** `8 tracked · ≈35 claude processes visible · 27 beyond the census`, rendered
   identically on the rail, `/city` and the shelf's WIP panel, each labelled the sensor's
   drift alarm; the count joins nothing and reaches no card (P1 F5 respected). `ps -axo
   command=` is 35–51 ms (median 36.4, N=10) and the rail's p95 went **45 ms → 111 ms**
   against a 500 ms bar — a spawn, not a walk, so B8 F3's worker law does not bite, and the
   cheap fix if it ever matters is a short TTL on the count, **named not built**. Also:
   **B5 E1's own `[c]laude` grep over-counts by five** — `/bin/zsh -c source
   /Users/felix/.claude/shell-snapshots/…` is not a session. The auditor matches `argv[0]`'s
   basename and drops the harness's `bg-pty-host`/`bg-spare` helpers, so E1's figure of 38
   reads as 35 here; the gap it reports is the same horizon, undecayed.

3. **F4 — one line of the fire path is unproven, and Felix's close-gate smoke is exactly
   it.** The rail's account picker was the glass's last `<select>` and is now a radio group,
   so the script reads `shot.querySelector('[data-account] input:checked').value`. The Chrome
   extension was not connected (`Browser extension is not connected`), so that read is pinned
   by markup — input immediately before its label, exactly one `checked`, the group named
   after the shot's own reserved name-stamp so two pickers can never collide — and by nothing
   that ran a click. **If the close-gate fire 400s naming `account`, this is the line.**

Also, not blocking, for anyone touching render helpers: **`ago()` moved to `html.ts`.**
Putting the auditor in `gauges.ts` (right — it is a gauge, and the census must not grow a
second liveness authority) while rendering it on `/city` would have made `pages` and `gauges`
import each other. ESM tolerates that until a module-scope constant runs first, and this
glass has already paid once for hidden module-load order (B8 F1). **A render helper two
pages want belongs in `html.ts`, not in whichever file wrote it first.**

(Relayed from `master`, B9 LANDED 2026-08-27 — Builder)

## → relay — B13 (the deck shell) to every row behind it in lane B (B14, B15, B18, B20, B10, B17, B11, B16, B19, B21, B12) and the Architect: no escalation, four findings that bind the whole deck chain

Evidence: [b13-deck-shell.md](b13-deck-shell.md) §DoD and §Findings, commits `cad607f` …
`9d8a1ef` on `master`.

1. **F1 — a fake DOM cannot prove a deck DoD item, and the probe that can is already
   written: [`lab/b13/probe.ts`](../lab/b13/probe.ts).** Neither happy-dom nor jsdom does CSS
   grid layout — in both, `getBoundingClientRect()` returns zeros, so a "measured width" from
   one is a fabricated number and the `min-width: 0` bug in F4 passes silently. The probe
   drives the machine's own installed Chrome over the DevTools protocol in ~60 lines of Bun
   (launch with `--remote-debugging-port`, read `/json/list`, open the page target's
   WebSocket, `Runtime.evaluate` with `returnByValue`) — **no dependency fetched, installed or
   vendored**, same posture as `ps` in `gauges.ts`, every URL 127.0.0.1. It stands up its
   **own** glass on port 4489 against a temp census and the `lab/b3/city` fixture, because
   the live census is append-only telemetry and a DoD run does not get to write a beat into
   it (B8 F1). **Point `CITY`/`CENSUS` at your fixture and add `ok(...)` lines** — every
   later row's clicks, measurements and polls belong here rather than in `bun test`.

2. **F2 — the split is a 69 ms CSS transition, so every measurement of deck geometry must
   settle first.** `.app` transitions `grid-template-columns` on felikai's `--snap`. The
   probe's first run clicked three state buttons and measured on the next DevTools round trip
   — about five milliseconds in — and read `74.14% · 12.87% · 12.87%` for a deck **moving to**
   `10/60/30`. It reported FAIL, correctly, for entirely the wrong reason. The number was
   real and reproducible and meant nothing. `settle()` in the probe is the fix; anyone
   measuring without it will publish a mid-slide.

3. **F4 — `min-width: 0` on every grid child is the deck's only geometric guarantee, and it
   is one deletion away from gone.** An `Nfr` track is really `minmax(auto, Nfr)`, so without
   that line a pane's own content minimum silently outvotes the law of space and the split
   stops being the split — with no error, no lint, and a page that still looks plausible. It
   is in `deck.css` with that note on it. Also for the density calls B14+ make: the weights
   are **minimal 1 · typical 3 · expanded 6** (this row's choice — the law fixes
   proportionality, not the constants), so at 1600 px a minimal pane is **200 px** at rest,
   **160 px** at its narrowest, an expanded pane **960 px**, a pinned drawer **436 px**.

4. **F5 — `/deck/state` is one endpoint and a shared budget: 15 000 B at 46 sessions, every
   3 s.** B15's Workshop, B17's usage ×3 and B18's socket identity all widen the same shape
   by design — one endpoint, not five. Two rules already hold and must keep holding:
   **nothing in the composition walks the city on the request thread** (`deckState()` calls
   `register()`, which returns the held copy — B8 F3 re-proven here: a `/rewalk` costing
   **9.264 s** of its own request had three polls land inside its window in **17 ms · 8 ms ·
   18 ms**), and **the diff is the whole snapshot** — identical bytes redraw nothing, so an
   idle city costs one `JSON.parse` and no DOM work. Live cost today: `/deck` p95 **2 ms**,
   `/deck/state` p95 **19 ms**.

Also, not blocking: **the client TypeScript rides the existing offline type gate with zero
config change** (F3) — `@types/bun` already carries the DOM lib, so `deck.client.ts` and its
`document`/`localStorage` typecheck under the same `tsconfig.json` and the same `bunx
--offline tsc --noEmit`; it caught `Node.append` returning `void` before a browser ever ran
the code. And **the `FocusView` seam is four members** — `mount(focusHost, actionHost)`,
`unmount`, `draw(snap, focusState, actionState)`, plus the pane states a tenant declares.
**Action follows Focus, so one tenant owns both hosts** and there is no second register for
the Action pane; a tenant renders with DOM calls rather than HTML strings, which is why the
client carries no `esc()`. B15, B10 and B16 evict the three placeholders through that
interface and nowhere else.

(Relayed from `master`, B13 LANDED 2026-08-27 — Builder)

## → relay — P5 (permission physics) to B10, B11, B16, B17, P6, every DoD smoke and the Dispatcher: no escalation, four findings that bind

Evidence: [p5-permission-physics.md](p5-permission-physics.md) §Findings, commits `787b048`,
`fb93d63` on `master`.

1. **F1 — `--model haiku` cannot enter `auto` permission mode, on any account, and the
   fallback to `default` is SILENT. S5 was never trust and never cmux.** The accounts all
   carry `"permissions":{"defaultMode":"auto"}`; cmux's per-session `--settings` blob is
   **hooks only, no `permissions` key** (read verbatim off the argv of a live stalled probe,
   pid 97551); no project settings exist in `~/code/agents`. Bisected in one venue, one
   account, one summons: **haiku·low `default`, haiku·high `default`, opus·low `auto`,
   sonnet·medium `auto`** — effort is not the driver — and the same haiku fire reads
   `default` on all three silos (`00eccd3f`, `867d3ca9`). Two sensors agree: the census's
   `mode` and the transcript's own `{"type":"permission-mode","permissionMode":…}` record.
   **An explicit `--permission-mode auto` in argv is dropped with no error** — `ps` shows
   `… --model haiku --effort low --permission-mode auto -n p5-lever-1 …` while the census
   shows `default` and the session stalls (`ab4b25be`). The flag itself works: the same
   instrument with `acceptEdits` yields `acceptEdits` (`b5479d60`). Mechanism: `auto` is an
   LLM classifier (`claude auto-mode config` prints 67 294 B of allow/soft_deny/hard_deny
   rules) that a haiku session does not get. **The live census had been saying this for a
   day** — all 14 `default` beats in 4 188 belong to glass-fired haiku sessions; every
   fable/opus fire is `auto`. **What this binds: any row whose DoD smoke fires haiku and
   expects tool work is ordering a stall.** The batch-5 lane-A probe-tier rule is amended in
   README §6 accordingly; **sonnet·low is the cheapest tier that holds `auto`** (measured, 6/6).

2. **F3 — there are TWO stalls with two different signatures, and the trusted-root one is
   the one nobody was watching for.** *Permission stall*: beats, a transcript, `mode:default`,
   a `PreToolUse` with **no** `PostToolUse`, then `Notification` with
   `why == "permission_prompt"` — reproduced N=2 in a **fully trusted** root
   (`glass/trust.ts` → `{"warm":true,…}` ×3), zero files written four and a half minutes on,
   process alive. *Trust stall* (B7 F1's, re-measured): **zero census beats, no transcript
   directory, live pid** — a fresh `git init` at `~/code/p5-cold-repo`, 120 s, cwd untouched.
   **A reader that treats "no beats" as the stall signature will call the permission stall
   healthy, and one that treats `permission_prompt` as the signature will never see a trust
   stall at all.** `acceptEdits` is a partial lever, measured not assumed: it clears `mkdir`,
   three Writes, a Read, an Edit and `ls`, then **stalls at `git add`** — seven of eleven
   steps, no commit (`f843ca0e`). **No step that commits can ride haiku.**

3. **F4 — for B5's shelf, B17, the deck's run-state and anything reading census `mode`: a
   session's first two beats report the ACCOUNT default, not the session's real mode.** A
   resume through `/hands/fire` with `model`/`effort` empty (B5 E2's law) inherits the first
   life's model — a haiku session is haiku forever — and its beats read:
   `SessionStart(resume)` → `UserPromptSubmit **auto**` → `PreToolUse **default**` →
   `Notification permission_prompt`, while the transcript's `permission-mode` records say
   `default` both lives and `.message.model` stays `claude-haiku-4-5-20251001` (`867d3ca9`).
   **Read posture off a `PreToolUse` beat, never off `SessionStart`/`UserPromptSubmit`** —
   otherwise a stalled step renders as a healthy one. The sonnet control resumed clean:
   `auto` throughout, 11 further tool calls, second real commit `0a7fbec`.

4. **F5 — the permission clause, for B10's schema and B11's fire gate, verbatim.**
   (i) **A flow step carries no permission field** — the accounts already run `auto`,
   `--permission-mode` cannot raise haiku, and everything above `auto` is barred by the
   posture floor; the knob's every legal value is redundant or forbidden.
   (ii) **A step's `model` IS its permission posture: `haiku` is not a legal model for an
   unattended step** — legal today, measured: `sonnet`, `opus`, `fable`. Refuse **at arm**,
   naming P5; never at fire, never by silently substituting a model.
   (iii) **`glass/trust.ts` is the venue precheck and is sufficient as-is** — call it per
   **(step, account)**, never once per flow (the same cwd is warm on one silo and cold on
   another); a step whose worktree does not exist yet is prechecked against the repo it will
   be cut from (a linked worktree inherits — three worktree cells landed).
   (iv) **Refusal is loud and happens at arm** — a failing step renders blocked with its
   reason and the flow cannot be armed until it is fixed (D10's family); never a silent
   mid-flow stall.
   (v) **Two runtime alarms off the census**, behind the keel §5.4 step timeout: the
   `permission_prompt` signature above, and *zero beats + no transcript + live pid* as the
   drift alarm on the precheck itself.

Also, not blocking: **Q2's positive result is 6 of 6** — three accounts × {trusted root,
worktree}, 11 tool calls each including three Writes, a Read, an Edit and a **real
`git commit`**, **zero permission prompts, zero human touches**, at sonnet·low. Unattended
flow is physics-clear; the chapter needed no re-scope. Levers named and ruled out rather
than tried: `bypassPermissions`/`dontAsk` (posture floor), and **pre-seeding trust by
writing `<config-dir>/.claude.json`** — barred by the fence, not the floor: `trust.ts`'s own
law is that the glass never answers that dialog, so it is a D3 write-class question if it is
ever wanted.

(Relayed from `master`, P5 LANDED 2026-08-27 — Digger)

## → relay — B14 (City + attention) to B15, B16, B17, B18, B20 and the Architect: no escalation, four findings that bind

Evidence: [b14-city-attention.md](b14-city-attention.md) §DoD and §Findings, commits `90e1930`
… `0253700` on `master`.

1. **F1 — `PermissionRequest` IS a real hook event, and the census is not subscribed to it. The
   order's input law was right and P1's ten-event map is also right; they are answers to
   different questions.** cmux's own per-session `--settings` blob wires nine hooks and the
   ninth is `PermissionRequest` (read verbatim off a live spawned session's argv — P5 F1's own
   evidence). What B1 deployed is ten and it is not among them:
   `jq -r '.hooks|keys|join(" ")' ~/.claude/settings.json` → `Notification PostToolUse
   PreCompact PreToolUse SessionEnd SessionStart Stop SubagentStart SubagentStop
   UserPromptSubmit`. So **the glass's only blocked-on-approval signal is an inference from
   `Notification`/`permission_prompt`, which arrives ~6 s late and only in interactive
   sessions** (P1 F1). Measured live end to end at this row: `PreToolUse Write mode:default` at
   `00:28:09Z` → `Notification permission_prompt` at `00:28:15Z`. **What this binds:** anything
   that wants an immediate, headless-safe blocked edge — B11's engine alarms, B16's send
   physics, the flow chapter's step timeouts — is building on a six-second inference until the
   census subscribes to the event that already exists. That is one hook key in `census/beat.sh`
   + `deploy.ts` and a **Felix-run ×3 ritual** (B1's ground): filed, not built, because a
   Builder writing account settings is exactly what D14's guard is for.

2. **F2 — the escalation class has no field, and a reader written against the markdown matches
   nothing. Two false positives measured over all 458 live board rows; both fixed generally.**
   (a) **A status annotation arrives `strip()`ped** — `grammar.ts` removes every `**` and
   backtick before `parseStatus` splits the cell, so the corpus's `**E1 — …**` reaches the glass
   as `E1 — …`. (b) **`E<n>` is nobody's reserved namespace**: `whiteboardy/docs/m1-editor.md`
   staffs thirteen rows named `E1…E13`, so its `E4 — …` is a *row reference* — an id that names
   a row on this building's own boards is never an escalation, the same test `parseDependsOn`
   already applies. (c) **A range's far end is not a clause head**: cornerizer wrote *"all 4
   escalations ruled … (D11, E1–E4 — §6 fold, log)"*. After both: **22 buildings · 458 rows ·
   0 unruled escalations**, so the class is real, correct and currently empty — B6 F2's shape
   exactly, and the fixture in `lab/b14/city` is what proves the wire. **The real fix is a
   field, not a regex** — third filing (B3 F4/F5 wanted `Baton.kind` and a branch field, B9 F1
   a name field). **For B20's decoder especially: what you can hover on is what the parser
   kept, and the parser does not keep bold.**

3. **F4 — B13's snapshot diff could never short-circuit, and any row adding an input to a pane
   inherits the bug.** `deck.client.ts` held `if (body === lastBody) return;` and B13 F5 read
   that as "an idle city redraws nothing". It cannot be: `deckState()` stamps
   `at: Date.now()/1000` and `register.ageSeconds` into every snapshot, so **no two responses
   are ever byte-equal** and the whole deck rebuilt every 3 s. Harmless for placeholders;
   **fatal for anything Felix types into** — B16's draft, B19's desk editor, B17's composer
   knobs. Replaced, not patched: each region carries a **content signature** (its pane state
   plus the data it draws, wall clocks excluded) and rebuilds only on change; ages are
   `<span data-at>` rewritten by a separate tick; drafts, open `<details>` and filed receipts
   are keyed by the item's stable `key` and the caret is restored. Proven in Chrome: a
   half-typed note survives a census change plus 3.6 s of polling, open, focused, intact.
   **Reuse `paint(key, host, signature, draw)` in `deck.client.ts` rather than redrawing a host
   on every poll.**

4. **F3 — for anyone who needs to MANUFACTURE a stall (B11's fire gate, the engine's alarms):
   `default` mode waves a read-only Bash call straight through.** P5 F3's "first side-effecting
   Bash call" is exact and the loose reading is wrong. This row ordered a stall with
   `echo b14-waiting-probe` and got none — `PreToolUse Bash mode:default` → `PostToolUse` →
   `Stop`, no prompt. A **`Write`** stalls: fire haiku·low with a tool call that writes. (Same
   fire also produced `Notification idle_prompt` sixty seconds after `Stop` — the second
   waiting edge, live, and the exact notification Felix said cmux was giving him.)

Also for B15, not blocking: **the City's click writes `selection` in `glass/deck-view.ts`** —
one named cell beside the `FocusView` register, because the ontology is City → Building → Agent
and a tenant that does not care about the selection should not have it threaded through
`draw()`. The Workshop reads `selection.building`; the placeholder already names it, and the
value is remembered in `localStorage` (never load-bearing). **And the queue's two wires are the
only two a tenant may reach from Context or the drawer**: `POST /inbox` (a file append, in
front of the credential gate — B6 F3) and `POST /hands/focus` (a hand, behind it). `/deck.js`
contains the string `hands/fire` **zero times**, and `lab/b14/probe.ts` greps the served bundle
to keep it that way.

Also for the Architect, not blocking: **Belvedere's own ledger tail has linted as a dropped
baton for three entries running** (B13, P5, B14) — a Dispatcher-tended chain has no legal
holder in `session | felix | prose`, and writing `fire B15` to satisfy the parser would compose
a live Dispatch button for work the batch note gives the Dispatcher. Filed to
[ISSUES](../ISSUES.md) as a fold candidate, in B3 F4/F5's neighbourhood; nothing changed.

(Relayed from `master`, B14 LANDED 2026-08-27 — Builder)
