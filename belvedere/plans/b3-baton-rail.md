# B3 — the baton rail

**Status:** **LANDED** 2026-08-27 — every DoD item measured below · **Depends on:**
B4 (hands endpoints) · **Staffing:** Builder · opus-high · **Batch 3:** second row,
strictly serial, straight to master
**Spec blessed:** 2026-08-26, Architect (G1), on B2 + D64 + the G1 E1 ruling.

## Goal

The home page becomes the morning: every baton in the city, one column, buttons.
"My mornings should start at a rail of batons, not a wall of terminals"
([dream](../dream.md)).

## Spec

1. **`/` becomes the rail** — plus a compact city strip (per-building live dots);
   the full City View moves to `/city`. The G1 E1 ruling lands here: register
   warm ≤ 30 s with its age printed; content read per request.
2. **Rail cards**, from `doctrine/` `parse()` per building: the ledger-tail baton,
   every named Felix-gate on boards, every `pending Felix countersign` decision.
   D64 rendering: **move** = one button · **wave** = n buttons · **fork** =
   choice buttons with the recommendation badged. Holder rules: a session-holder
   baton gets Dispatch buttons wired to `POST /hands/fire`; a **Felix-holder
   baton renders as his card — structurally unwired, never auto-fired**.
3. **Instruments:** a fenced summons fires as-is; a `fire <row-id>` reference
   resolves to that work doc's kickoff fence. If `doctrine/`'s parsed `Baton`
   lacks D64 `kind`/`instruments[]`, build a THIN render-side splitter over the
   baton text `parse()` returns (display shaping, not a second parser) and file
   the canon-inbox ask naming the missing fields — do not fork `doctrine/` (D65).
4. **Fire affordance** (Felix via GA-10, unparked into this row): each button
   offers **new session** (default → hands fire) and **copy summons** (clipboard
   — for continuing in a window of his choosing). No paste into live TUIs, ever
   (P2 T4 transport law); jump-in stays a separate focus button.
5. Hands disabled (no credential) → buttons render disabled with the honest
   banner; the rail stays fully readable.

> **Amended 2026-08-27 (Architect, pre-dispatch — Felix's ask):** a Dispatch
> button for a `fire <row-id>` baton whose work doc names a worktree/branch
> composes `POST /hands/worktree` → `POST /hands/fire` with cwd = the worktree
> path — "worktrees without asking" ([dream](../dream.md)). DoD gains: one such
> composed fire shown against a scratch repo row.

## Acceptance criteria / DoD — evidence pasted here at build time

- [x] **The rail lists the real city's batons — hand-verified.** `doctrine/`'s
      `discover([~/code])` finds **22 buildings · 9 carrying `LEDGER.md` · 9 parsed
      tails · 8 batons**, and the served rail carries **exactly 8 baton cards**
      (`grep -o 'data-kind="baton"' | wc -l` → 8; by holder: 3 session, 3 felix, 2
      prose). The ninth ledger yields no baton and the exclusion is the corpus's,
      not the rail's: `cap-mega/felix/spacex-dashboard-c2`'s tail closes
      `Next — row 03's landing gate: verify, migrate…` — an em-dash where D63
      requires `Next:`, so `classifyBaton` reads `next: null`. (It is the inert
      merged worktree copy its own sibling ledger flags "remove at leisure".)

      Three spot quotes, disk → card:

      | disk | rendered card |
      |---|---|
      | `hexwright/LEDGER.md:108` → ``Next: Felix's Phase-1 acceptance ruling — PENDING on the GENESIS §6 board: `bun run studio`,`` | `holder=session · pills: baton \| move · when: 2026-08-26 · Architect (18b) · src hexwright/LEDGER.md:95 · buttons: 2` |
      | `cap-mega/snappy/LEDGER.md:1369` → `Next: Felix rules the regression frame; triplet runs on` | `holder=felix · pills: Felix's baton · rail-text: "Felix rules the regression frame; triplet runs on the first quiet VM window." · buttons: 0` |
      | `belvedere/LEDGER.md:357` → `Next: the batch-3 chain` | `holder=prose · pills: dropped baton · rail-text: "the batch-3 chain runs on (B3 → B5 → B6 → B7) to the close gates — nothing on this desk." · buttons: 0` |

- [x] **A real fire from the rail lands a stamped probe session in cmux, summons as
      first user turn.** Composed fire (worktree → fire), payloads lifted verbatim
      from the rendered button's `data-worktree` / `data-fire` attributes:

      ```
      POST /hands/worktree {"repo":"…/belvedere/lab/b3/city/probe-row","branch":"bv/b3-smoke"}
        → {"ok":true,"result":{"path":"/Users/felix/code/agents/.claude/worktrees/bv/b3-smoke","branch":"bv/b3-smoke"}}
      POST /hands/fire     {…,"stamp":"builder-probe-row-03","cwd":"<that path>","model":"opus","effort":"high","color":"Aqua"}
        → {"ok":true,"result":{"workspace":"workspace:10","summonsPath":"…/summons/builder-probe-row-03.summons.txt","sha":"d6f9c69c0efb7ed7","bytes":113}}
      ```

      Transcript
      `~/.claude/projects/-Users-felix-code-agents--claude-worktrees-bv-b3-smoke/4fa9aec1-c172-4ed2-a5ae-285125259806.jsonl`:

      ```
      --- cwd: /Users/felix/code/agents/.claude/worktrees/bv/b3-smoke
      --- first user turn, verbatim ---
      "You are a Builder at opus-high.\nWear ~/code/agents/canon/mantles/builder.md,\nthen read the R1 order and build it."
      --- sha256(first user turn):            d6f9c69c0efb7ed722717c3e0d88c07f9129ea667e2f4b5348e1688d66d185a3
      --- sha256(summons file the hand wrote): d6f9c69c0efb7ed722717c3e0d88c07f9129ea667e2f4b5348e1688d66d185a3
      --- byte-identical: true | 113 B vs 113 B
      --- name-stamp record: {"type":"agent-name","agentName":"builder-probe-row-03","sessionId":"4fa9aec1-…"}
      ```

      The census caught it too — 12 beats, venue join populated
      (`"ws":"D3488DCA-…","sf":"7D15892F-…"`). **Cleaned up:** `cmux workspace close
      workspace:10` → OK · `git worktree remove --force` → removed ·
      `git branch -D bv/b3-smoke` → `Deleted branch bv/b3-smoke (was 58cc84c)` ·
      `cmux workspace list` back to Felix's two · `git status --short` clean.

- [x] **The amendment: one composed fire against a scratch repo row.** The fire
      above IS it — `data-worktree` came off the button, `git -C <probe-row>
      rev-parse --show-toplevel` resolved the repo, and `body.cwd` was replaced by
      the worktree path exactly as the rail's script does it. Run first against a
      throwaway `git init` repo under `/private/tmp` (worktree created, fire
      accepted) — see **F2** for why that venue stalled one inch short and why the
      in-repo run is the truthful one.

- [x] **A `fire <row-id>` baton resolves to the work doc's fence.** Fixture
      `probe-row`'s tail says `Next: fire R1 — the order is blessed…`; the card
      renders `row R1 — Builder · opus-high`, `src probe-row/plans/r1-scratch.md:13`,
      and the resolved fence is the 113 B summons fired above. The live city's one
      row-reference is the honest refusal: whiteboardy's `fire 26` →
      `row 26 names no work doc — nothing to read a kickoff from`, rendered as a
      reason with **no button** (`buttons: 0`).

- [x] **A fork renders its options with the recommendation badged.** Fixture
      `probe-fork` (the live city has no fork today):

      ```
      <span class="pill tone-yellow" title="D64: move · wave · fork">fork</span>
      <div class="shot-h"><b>Digger · fable-high</b> <span class="pill tone-green">recommended</span><span class="src">probe-fork/LEDGER.md:4</span>
      <div class="shot-h"><b>Builder · opus-high</b><span class="src">probe-fork/LEDGER.md:4</span>
      ```

      Exactly one badge; the badged option is the one the prose names
      (`Recommendation: the Digger, because the numbers decide the patch's shape.`).

- [x] **Felix-cards carry no fire wiring in the DOM at all.** Structural count over
      the served HTML — per `<article>`, occurrences of
      `<button|data-fire|data-worktree|data-copy|data-account|/hands/`:

      ```
      baton  holder=session wiring=  5  hexwright
      baton  holder=session wiring=  5  universal_robots_sdk/cap-mega/simmy
      baton  holder=session wiring=  0  whiteboardy            (blocked instrument)
      baton  holder=felix   wiring=  0  …/manny · …/spacex-dashboard · …/snappy
      baton  holder=prose   wiring=  0  agents · agents/belvedere
      gate   holder=felix   wiring=  0  ×29
      counter holder=felix  wiring=  0  agents D21
      ```

      **35 of 38 cards carry zero.** Not a `disabled` attribute — no element, no
      payload, no handler. Pinned by `rail.test.ts` ("carries no fire wiring in the
      DOM at all — not even a disabled one").

- [x] **`/` p95 ≤ 500 ms warm, register age printed** — after **E1** below:
      `n=20 min=0.034s p50=0.038s p95=0.048s max=0.062s` (20 requests at 2 s
      spacing, crossing the TTL twice). Footer, verbatim:
      `content re-read in 33 ms · register 11s old · 22 buildings walked in 9804 ms,
      12810 worktree copies deduped · ttl 20s`. Idle case named honestly: after a
      quiet stretch the first request serves an older copy and says so
      (`register 82s old (refreshing)`) rather than stalling to re-walk.

- [x] **Copy-summons puts the exact kickoff text on the clipboard.** The `<pre
      data-summons>` payload the script hands `navigator.clipboard.writeText`,
      un-escaped, against the work doc's fence read straight off disk:

      ```
      $ diff <(cat b3-clipboard.txt) <(printf '%s' "$(cat b3-fence.txt)") && echo IDENTICAL
      IDENTICAL
      d6f9c69c0efb7ed722717c3e0d88c07f9129ea667e2f4b5348e1688d66d185a3  b3-clipboard.txt
      d6f9c69c0efb7ed722717c3e0d88c07f9129ea667e2f4b5348e1688d66d185a3  -
      ```

      Same sha as the fired first user turn: **fence = clipboard = argv**, one text.

**Tests:** `belvedere/glass/rail.test.ts` 39 · `register.test.ts` 4 · plus B2/B4's
`census.test.ts` 33 and `hands.test.ts` 29 — **105 tests, 105 green per file**. Run
as one command (`bun test belvedere/glass`) 8 of `hands.test.ts`'s fail on a
**pre-existing** cross-file collision that predates this row — see **F3**;
reproduced at B4's own landing commit `286b370`, untouched here.

## Out of scope

- Shelf, gauges, inbox (B5/B6); auto-firing anything; editing batons; websockets.

## Findings

### E1 — the E1 ruling as written cost a 8.3 s p95; the walk had to leave the request thread

G1 ruled the register may be held warm ≤ 30 s. B2's implementation deferred the
refresh to `setTimeout(…, 0)` — off the *request*, but still on Bun's single
JavaScript thread. Measured on the rail before any change, 20 requests at 2 s
spacing (a person reading, not a burst):

```
n=20 min=0.031s p50=0.037s p95=8.300s max=8.612s
raw: 0.034 8.300 0.031 0.033 0.038 0.034 0.121 0.040 0.036 0.032
     0.036 0.037 8.612 0.053 0.041 0.042 0.043 0.042 0.033 0.036
```

Two of twenty page loads stalled ~8.5 s — the requests that arrived *while* the
deferred `discover()` was running. A tight burst hides it completely (p95 0.034 s),
which is why it had to be measured at browsing speed. Fixed inside the fence:
`glass/register.worker.ts` runs the walk on a worker thread, `register()` swaps the
held copy on its message and records a failed refresh instead of swallowing it
(printed in the footer). Same protocol after: **p95 0.048 s, max 0.062 s**.

**Still the Architect's to rule:** a 20 s TTL over a ~9.5 s walk means that while
Felix reads the rail the machine re-walks 50 795 directories roughly half the time.
Non-blocking now, but not free. The register changes when a *building* is created —
weekly, not hourly. Three options, none taken here: raise the TTL to minutes; keep
20 s but only refresh on `/city`; or a manual "re-walk" affordance with the age
already printed. The canon-side fold (`readdirSync({withFileTypes})`, 2.5×) is
already filed on the canon inbox from B2.

### E2 — all three of the live city's fireable batons are gated on Felix, and the parser still calls them session batons

`classifyBaton` (canon `doctrine/src/parse.ts`) reads the instrument first: any
fenced summons or `fire <row>` in the Next clause makes the baton `holder: 'session'`,
and only a clause with *no* instrument at all can fall through to `'felix'`. On the
live corpus that inverts the intent of every one of them:

- hexwright: `Next: **Felix's Phase-1 acceptance ruling — PENDING** … On a pass, fire: ⟨fence⟩`
- simmy: `Next: **Felix** fires the summons below … ⟨fence⟩`
- whiteboardy: `fire 26 when the window's day-5 boundary lands` (blocked anyway — no work doc)

So the rail's holder law is satisfied — no Felix-holder baton is wired — while two
Dispatch buttons sit under text saying the fire is Felix's and conditional. The rail
does **not** overrule the parser (D65: one parser in the city; the holder is its
call). It reports the collision: a session baton whose clause contains the word
"Felix" renders `The clause names Felix. D64 reads the instrument first, so this is a
session baton — read the clause before firing.` Two of three live cards carry it.
**The real fix is a grammar question for the Standards Office** — filed to the canon
inbox with this row's evidence.

### F1 — the rig's mantle colours are not cmux colours; two of five are rejected outright

Measured against the live socket at this row:

```
$ cmux workspace-action --workspace workspace:8 --action set-color --color cyan
Error: invalid_params: Invalid color. Use a hex value (#RRGGBB) or a named color.   (exit 1)
$ …--color pink   → same error, exit 1
$ …--color Aqua   → OK action=set_color workspace=workspace:8 window=window:1 color=#0E6B8C
```

cmux's sixteen names are Red, Crimson, Orange, Amber, Olive, Green, Teal, Aqua, Blue,
Navy, Indigo, Purple, Magenta, Rose, Brown, Charcoal. The rig's `presets.tsv` spends
`cyan` on **Builder** and `pink` on **Dispatcher** — the two mantles the rail fires
most. This is not cosmetic: `attemptFire` creates the workspace *before* it sets the
colour, so a refused colour fails the whole fire **and leaves the workspace behind**.
Proven from the audit, not inferred — the first attempt at this row's smoke:

```
{"ts":"2026-08-27T12:46:13.379Z","action":"fire","args":{…,"color":"cyan",…},"ok":false,
 "result":"fired workspace:7, but set-color failed: cmux workspace-action exited 1: Error: invalid_params: Invalid color…"}
```

Fixed at the boundary (`glass/summon.ts`, `CMUX_COLOURS`): the rig's table and cmux's
table meet in one map, and a name neither knows falls back to `Charcoal` rather than
costing a fire. **Parked for B4/the Architect:** the fire hand should still unwind the
workspace it created when a later step fails — filed to `belvedere/ISSUES.md`.

### F2 — a fire into a cwd with no trusted ancestor stalls at Claude Code's folder-trust dialog

The first composed smoke fired into a `git init` scratch repo under
`/private/tmp/…/scratch-city`. Everything the rail owns worked — worktree created,
launch line byte-exact, summons in argv — and then the session sat on:

```
 Quick safety check: Is this a project you created or one you trust? …
 ❯ 1. Yes, I trust this folder
   2. No, exit
```

No transcript, no census beat, no first user turn. **Trust is inherited, not
per-directory:** `~/.claude.json` carries 13 project entries and **zero** for any
worktree, while the city runs sessions in worktrees constantly — so a worktree under
an already-trusted repo is fine (re-fired into
`~/code/agents/.claude/worktrees/bv/b3-smoke`, no prompt, transcript in 12 s), and a
brand-new tree outside any trusted root is not. This bites **B7** (fire-anything /
the founding template, which by definition targets a directory nothing has trusted)
and any future fire into a fresh clone. The glass must not answer that dialog for
Felix; the honest move is to render the risk on the button — the rail cannot know
today, so this is filed rather than guessed.

### F3 — `bun test belvedere/glass` is red on a pre-existing cross-file collision (not this row's)

`hands.test.ts` sets `CENSUS_DIR`/`BELVEDERE_ENV` and then dynamically imports the
module under test — correct in isolation, but `paths.ts` freezes `process.env` at
module load and `census.test.ts` (alphabetically first) has already pulled it in
through a static import. One process, one cached `paths.ts`, eight failures pointed
at the real census directory. Verified **pre-existing**: at B4's own landing commit
`286b370`, `bun test belvedere/glass` is `54 pass / 8 fail`, before `rail.test.ts` or
`register.test.ts` existed. Not fixed here — it is B4's file and a parked adjacent
discovery (filed to `belvedere/ISSUES.md`); B3's own two test files are deliberately
order-independent, naming their own corpus root and asserting name-stamps by prefix.
Per file today: census 33 · hands 29 · rail 39 · register 4 = **105 green**.

### F4 — `Baton` still has no `kind`; B3 §3's thin splitter is in place, and the ask is filed

`doctrine/`'s `Baton` is `{ holder, text, instruments[] }` — D64's move/wave/fork is
not a field. As §3 instructs, the shape is read render-side in `glass/rail.ts`
(`shapeOf`, ~4 lines over the baton's own prose) and the parser is not forked. Plural
instruments with neither a fork nor a wave marker render as
`n instruments — shape unstated` rather than a guess. The canon-inbox ask for
`kind: 'move' | 'wave' | 'fork'` (and for the fork's recommendation as a field, see
below) rides this row.

### F5 — reading a worktree branch out of prose is unsound; the narrow rule matches the corpus 0/62

The amendment needs a branch name, and DOCTRINE §10's worktree law is prose. The naive
read — first `` branch `x` `` anywhere in the work doc — matched **12 of the city's 62
live work docs, and every single hit was retrospective**:

```
agents 07     [LANDED]  -> feature/simmy          "(branch `feature/simmy` — the live line…"
agents 18     [OPEN]    -> worktree-agent-a55279…  a nested board row citing where findings live
belvedere B1  [LANDED]  -> bv/b1-census           "**Status:** **LANDED** … (branch `bv/b1-census`)"
theseus o2    [LANDED]  -> worktree-agent-a55bb…  "## Commits (branch `…`)"
… 8 more of the same shape
```

The OPEN one is the dangerous one: a Dispatch would have composed a worktree named
after somebody else's finished agent checkout. Narrowed (`branchFor`) to the doc's
**header block only** (above the first `##`), a line that **names a worktree**, and
**never a line recording a landing** — measured: **0 hits across all 62 live work
docs, 1 hit on the fixture** (`bv/b3-smoke`). That is the right precision for now, but
it is still a regex over prose: **the ask is a field** — a board/work-doc slot that
says "this row runs on branch X" — filed to the canon inbox with F4.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b3-baton-rail.md,
and build the order.
```
