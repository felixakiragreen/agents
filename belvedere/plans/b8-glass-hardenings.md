# B8 — glass hardenings

**Status:** LANDED 2026-08-27 · **Depends on:** B3 · **Staffing:** Builder · opus-high ·
**Batch 3 (amended 2026-08-27):** fires FIRST — chain is B8 → B5 → B6 → B7, strictly
serial, straight to master
**Spec blessed:** 2026-08-27, Architect (the B3 E1/E2 ruling sitting), on B3's
findings and the inbox sweep.

## Goal

Five small, fully pre-chewed hardenings: the two B3 rulings made live, two inbox
hazards closed, the type gate made offline. Nothing here is design — every fork is
decided below.

## Spec

1. **Register policy (the E1 ruling):** TTL **300 s** (`register.ts`); a successful
   `/hands/fire` or `/hands/worktree` marks the register stale so the next request
   kicks the worker — the glass's own writes are never invisible to it; a
   **re-walk button** beside the printed age (refreshes the held copy — it commands
   the glass's own memory, not the city: no fence question). The worker law stands:
   the walk never rides the request thread.
2. **Ambiguity never arms (the E2 ruling, D10):** where the rail already detects a
   session-holder baton whose clause names Felix (B3's collision note), the card
   loses its `/hands/fire` wiring — no button, no payload — keeping the note and
   **copy-summons** (copying is reading; the gate stays his). No new heuristic:
   the existing detection gates the wiring. An uncollided session baton keeps its
   buttons.
3. **Fire unwind (inbox, B3 F1):** a failure after `workspace create` closes the
   workspace it created; the audit line records the unwind; if the close itself
   fails, the error names the live workspace. No orphans.
4. **Test isolation (inbox, B3 F3):** `bun test belvedere/glass` green in one
   process. Named fix directions: `paths.ts` resolves env-derived anchors per
   call, or a suite preload points every file at a temp census. If the fix demands
   restructuring `paths.ts`'s contract beyond that — STOP, escalate.
5. **Offline type gate (inbox ruling):** pin `typescript` + `@types/bun` as dev
   deps in `belvedere/glass/package.json` (lockfile committed), minimal
   `tsconfig.json`; `bunx tsc --noEmit` passes offline. These two deps are the
   named third-party per D54 — anything else is a STOP.

## Acceptance criteria / DoD — evidence pasted here at build time

All five measured against the live glass on 127.0.0.1:4400, 2026-08-27.

- [x] **Footer shows `ttl 300s`; p95 ≤ 500 ms warm (20 req @ 2 s).** The rail's own
      footer, verbatim:

      content re-read in 85 ms · register 14s old · 22 buildings walked in 9741 ms,
      12810 worktree copies deduped · ttl 300s <a class="rewalk" href="/rewalk?to=%2F">re-walk</a>

      B3's protocol re-run — 20 requests, 2 s apart, at browsing speed:
      `n=20 min=0.034s p50=0.041s p95=0.045s max=0.047s`. **p95 45 ms**, 11× under the
      bar and 184× under B3's pre-worker 8.300 s. Nothing crossed the TTL, which is the
      point of ruling it 300 s.

- [x] **A `/hands/worktree` success → next rail load shows the register refreshed; the
      re-walk button does the same on click.** Against a temp repo outside the city (so
      the drill adds no building):
      `POST /hands/worktree {repo, branch:"bv/b8-bust"}` → `{"ok": true, …}`; the rail
      read `register 75s old` before, `register 80s old (refreshing)` on the request
      that took the bust — **served warm, not stalled** — and `register 3s old` on the
      next load. The button: `GET /rewalk?to=%2F` → `HTTP 303 → http://127.0.0.1:4400/
      in 9.226702s`, and the page it lands on reads `register 0s old`. One click, one
      fresh page.

      The worker law holds under the button: while a re-walk was in flight, three
      concurrent `/` loads took **0.085 s · 0.033 s · 0.033 s**. The walk waits; the
      glass does not.

- [x] **The two live collided cards render zero fire wiring, note + copy intact.**
      B3's structural grep over the live rail's 38 cards
      (`data-fire`, `data-worktree`, `data-account`, `class="go"`, `/hands/`):

      COLLIDED hexwright: holder=session · fire wiring NONE · copy=True · summons=True
      COLLIDED universal_robots_sdk/cap-mega/simmy: holder=session · fire wiring NONE · copy=True · summons=True
      cards carrying a fire button: 0 of 38

      The holder is still the parser's (`data-holder="session"`) — D10 is render law,
      not a second parse. An uncollided session baton keeps everything, over the B3
      fixture city: `probe-fork: wired=true · fire wiring [data-fire data-account
      class="go"] · copy=true` and `probe-row: … [data-fire data-worktree data-account
      class="go"]`. Pinned in `rail.test.ts` — the law on synthetics, both live clauses
      verbatim, and the uncollided case. **See F2: zero armed cards is the whole live
      rail today.**

- [x] **Induced post-create failure → workspace closed, audit carries the unwind,
      `cmux workspace list` clean.** Induced with B3 F1's own failure — a colour cmux
      refuses. Response:

      {"ok": false, "error": "set-color failed: cmux workspace-action exited 1: Error:
      invalid_params: Invalid color. Use a hex value (#RRGGBB) or a named color.
      — workspace:11 closed, nothing left running"}

      `hands.jsonl`, the unwind line landing before the fire's own:
      `{"ts":"2026-08-27T13:54:07.585Z","action":"fire.unwind","args":{"workspace":"workspace:11","why":"set-color failed: …"},"ok":true,"result":"OK workspace:11"}`
      `cmux workspace list` before and after are the same single line
      (`* workspace:2  felix@Groot:~/code/agents  [selected]`), and no process survives
      the stamp (`pgrep -fl builder-belvedere-b8-unwind` → nothing). No orphan.

- [x] **`bun test belvedere/glass` — all green, one process.**
      `109 pass · 0 fail · 206 expect() calls · Ran 109 tests across 4 files. [224.00ms]`
      — B3 F3's 8 failures are gone at the cause, not per file (105 were green only when
      run one file at a time; the four new tests are D10's).

- [x] **`bunx tsc --noEmit` exits 0; `git status` clean but for the intended files.**
      `tsc exit: 0`, and offline: `bunx --offline tsc --noEmit` → exit 0.
      `git status --short` → `?? .claude/` only (pre-existing, not this row's).
      `node_modules/` is ignored by `belvedere/glass/.gitignore`; `bun.lock` committed.

## Out of scope

Shelf/gauges/inbox/composer (B5–B7) · any rail redesign · canon's `doctrine/`
(the walk's own cost rides the canon inbox) · rig ground.

## Findings

**F1 — the test-isolation bug printed Felix's live cmux socket password into the test
output.** B3 F3 diagnosed the cause exactly right (`paths.ts` froze `process.env` at
module load, so `hands.test.ts`'s knobs arrived too late whenever another file had
imported the module first) but named the symptom as eight failures. One of those eight
was the credential gate asserting `readCredential()` against `hunter2`, and the failure
diff printed **the real password from `~/.config/belvedere/env`** — the file the tests
swear they never read — into the terminal, the transcript, and any CI log that would
have run it. Bun's `toEqual` diff has no idea one side is a secret.

Two things follow, and both are general:

1. **A frozen env anchor is not a style question.** Fixed at the cause: every
   env-derived anchor in `paths.ts` is now a function (`cityRoot()`, `censusDir()`,
   `handsEnv()`, …) and every anchor that is NOT env-derived is still a constant, so
   the parentheses carry the information. 109 tests green in one process.
2. **For B5/B6/B7 and anyone testing a hand: never assert on a credential's value.**
   A test that compares a secret to an expected string publishes the secret the day it
   fails. `hands.test.ts` gets away with it now only because its anchor is guaranteed
   temp; the safer shape — assert `ok`, assert the error text names the path and not
   the value — is what the rest of that file already does.

**F2 — D10 is live, and the live rail now arms nothing: 0 fire buttons of 38 cards.**
Not a bug and not an argument with the ruling — it is B3 E2's measurement arriving as a
consequence. The city's only two session batons today (hexwright, simmy) both name
Felix in their own Next clause, so both render safe. The rail is still the morning's
column — 38 cards, every baton, gate and countersign, every summons copyable — but the
one-click path is empty until either canon rules the holder grammar (the ask is filed,
B3 F4/F5) or a ledger writes a clause whose two readings agree. **The cheapest proof
the ruling works is the first unambiguous baton the city writes**, and the batch's own
close-out fire is a candidate.

**F3 — the re-walk button costs 9.2 s of ITS OWN request and nothing else's.**
Measured: `GET /rewalk?to=/` → 303 in 9.226 s, three concurrent `/` loads inside that
window at 0.085 s · 0.033 s · 0.033 s. That is the design — the button answers only when
the held copy IS the new walk, so one click is one fresh page — and it is safe only
because the walk sits on `register.worker.ts`. **B5: the same rule binds any new
server-side scan.** A usage scan or a census walk run synchronously on the request
thread reproduces B3 E1 exactly, and no amount of `await` fixes it; Bun has one JS
thread and the fix is a worker.

**F4 — the type gate is `bunx tsc --noEmit` from `belvedere/glass`, and it now covers
`doctrine/` too.** `bun add -d typescript @types/bun` resolved **typescript 7.0.2**
(the native compiler) and **@types/bun 1.4.0**; `tsconfig.json` is `strict` +
`noUncheckedIndexedAccess`, and `include` pulls in `../../doctrine/**/*.ts`, so the
parser the glass imports is type-checked by the glass's own gate. Clean at exit 0 —
canon's `doctrine/` needed no change. One real error surfaced and was fixed:
`census.test.ts` built a `Beat` by spreading `Partial<Beat>` over a literal missing
`ws`/`sf`, which types those two as possibly `undefined`. It had been latent since B4
added the fields. **The gate is offline** (`bunx --offline tsc --noEmit` → 0) and
`node_modules/` is gitignored; `bun.lock` is committed, so the pin is reproducible.

**F5 — parked, for whoever owns the walk's cost:** the register now finds **22
buildings** (17 at P3) and reports **12 810 worktree copies deduped**, walking in
9.3–9.7 s. The dedupe number is three orders of magnitude above B2's "35 worktree
checkouts of cap-mega" and is worth a look before anyone optimises the walk — but the
walk itself is canon's `doctrine/`, out of this row's fence, and the ask already rides
the canon inbox.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b8-glass-hardenings.md,
and build the order.
```
