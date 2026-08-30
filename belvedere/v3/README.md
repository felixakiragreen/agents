# Belvedere v3 — the proving ground

The building's third campaign: substrate + engine rebuilt from first principles,
proven by an agent-runnable barrage, judged at one verdict gate. **Campaign
complete — G4 BLESSED ⬡✓ 2026-08-30, the keystone set** ([the verdict](plans/g4-verdict.md)).
Founding record:
[cornerstone.md](cornerstone.md) (BLESSED ⬡✓ 2026-08-29); where it
and this doc diverge, this doc is current. Parent building:
[../README.md](../README.md); decisions D19–D21 in its §7 register — **this
campaign mints no letters**: C‹n›, G‹n›, D‹n› all continue the building's.

**The bet, one breath:** flow steps run headless (`claude -p` — events, never
pixels); the Chat is the primary viewport, summon-to-terminal the fallback (D20);
the run log is event-sourced truth (render = transparency, replay = redundancy);
engine correctness is fuzzed against a scripted fake claude before a real token is
spent (D21); the v2 deck serves daily, untouched, until G4.

## The fence

- **Writes:** `belvedere/v3/**` and gitignored telemetry only. Never the live deck
  (`glass/`), the v2 engine, `canon/**`, `sync/**`, `docs/**`, root protocol files
  (D2, D19). Spawning subject sessions rides the building's write class 1.
- **Venue:** digs commit straight to `master` touching only `v3/**` (building §5
  extended); builds worktree per DOCTRINE §10 when they need a branch; the
  two-lane commit rule binds — explicit paths, never `git add -A`.
- **Subjects:** a charge that spawns real sessions kills them at landing or names
  the standing set (D55's analog); resume ids filed in findings; subject work dirs
  live in scratch and die at landing. Every real-session charge carries a **budget
  line**; exceeding it is a ⬡-fork.
- **Clean room (C4 F0):** every real subject spawns from the real binary
  (`~/.local/bin/claude`) with `cleanEnv`'s eight variables — never the cmux shim,
  never inherited env; `HOME` never overridden, `CLAUDE_CONFIG_DIR` selects the
  account.
- **Contamination (C4 F12):** a real subject wears the account's live config —
  canon included, and the sync set is live ×3; a charge needing neutral subjects
  names its isolation flags and records them.
- **The v2 engine never runs v3 charges** — independence, plus its unruled
  amendment-hazard finding (ISSUES 2026-08-29).
- Ignition = kickoff + the building's coda ([../plans/CODA.md](../plans/CODA.md)).
  Stack: bun; tabs at width 3.

## The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| G4 | [The verdict](plans/g4-verdict.md) — substrate · v2's fate · migration shape · viewport; convened on bars 1–6 | C9, C10 | ⬡-gate | **LANDED — BLESSED 2026-08-30** (⬡✓ in-session; his hand ran the rehearsal first — exit 0, 9/9, 3/3, the round trip true). The four rulings, recorded in [G4](plans/g4-verdict.md): **substrate YES** (naked `-p` without the engine is not approved unattended) · **v2 superseded-in-place** (organs survive, the v2 engine retires, cmux → viewport candidate) · **migration: strangler engine-first, simplified — agents-flow-1 abandoned at his word**, the v2 engine retires immediately; the seams charge leads · **the Chat is primary**, summon the fallback. D19's deferrals unfreeze; the migration lay inherits them |
| C9 | [Scale](plans/c9-scale.md) — bar 5: 100 simultaneous fake through the engine; the real ladder 5 → 10 → 25 (the 25-burst sanctioned by this lay); the cost extrapolation table for G4 | C13 | Digger · opus-medium | **LANDED** 2026-08-30 — **bar 5 met, both halves**; all 4 questions evidenced in [C9](plans/c9-scale.md). **100 simultaneous fake green 12/12** (max in flight measured 100, not asserted — the log's own intervals), plus the fake ladder 10/25/50/100 ×3; **the real ladder 5 → 10 → 25 green twice over on `personal`** — 25/25 landed, 25/25 transcripts, **per-subject token fidelity 25/25**, zero session collisions, zero rate-limit refusals, invariants 0 and `replay ≡ state` in every run of the charge. **No substrate ceiling found below 25.** Q3's cost table is in the charge, paste-ready, extrapolation labelled where it leaves the measured rungs. **Budget 81/120 turns, $3.9689/$8**; the engine untouched (C10's step 0 lands on unmodified bytes). **F1 `rate_limit_event` fires on EVERY turn with `status: "allowed"` — routine telemetry, and K2 as written would have fired at turn 2; run under the criterion's intent (`status !== "allowed"`, never fired) and the wording wants the Architect's re-cut** · **F2 a one-shot turn costs ~2× a warm one and the whole difference is a cold prompt cache — width is *cheaper per turn* than serial** ($0.1355 at w1 → $0.0453 at w25); any estimate multiplying one per-turn figure by a step count is wrong · **F3 width is nearly free in wall: 25 subjects cost 1.5× the wall of 1** (fitted `5.73 + 0.135·w` s; ignition burst 41–55 ms at 25) · F4 the engine holds exactly **one fd per in-flight subject**, not three — the descriptor budget is not a wall this design can hit · F5 the substrate hands out a **free in-band quota gauge** (`unifiedWindows.*.utilization`) on every turn — the only answer the Guild has to "sessions cannot see /usage"; named for C10 and G4 · F6 the load gate fired twice on a desktop sitting 6–9 all afternoon; a hand-timed charge here would have published contaminated numbers. F1 and F2 **relayed to the bulletin** (`2a6af07`). Reviewed 2026-08-30 at the tender's hand: fake ×100 re-run ×3 — 100 in flight, 100/100 landed, replay ≡, inv 0, exit 0; K2's wording re-cut with a dated note (the spec error was the lay's) |
| C10 | [The console demo](plans/c10-console-demo.md) — bar 6: five verbs over the engine's exports (list · read · send · summon · return), scriptable and hand-testable; **step 0: the fallback's pause vocabulary** (C13 F3's deferred two lines) | C13 | Builder · opus-medium | **LANDED** 2026-08-30 — [console/](console/) is bar 6's instrument; all 5 bars evidenced in [C10](plans/c10-console-demo.md). **Step 0 landed on its own red** (`2f2d4f0`, tests before fix): the transcript fallback now names ‹needs-⬡ question› and ‹blocked› from the disk's own report, asserted **equal to `verdict()`'s causes on the same report**, so C6's *transcript-only ≡ streamed verdict* holds for every reporting state; C13's F3 carries a dated correction. **The real rehearsal passed in one script, one pass** — all five verbs against a 3-step real flow on `personal`, 3/3 landed, terminal, invariants 9/9, and **the summon round trip lossless in both directions on one session** (the engine-born codeword and the pane-typed sign-off both returned through a headless resume, the cursor absorbing the hand turn unasked). Console 19 + engine 64 + barrage 38 + fake 59 tests green, four type gates 0, **barrage exit 0 twice on the settled tree (1000/1000 · 50/50 · 9/9, wall 147.5 s and 147.7 s)**. **Budget 12/30 turns, $0.4148/$3.** **F1 the first pass failed on the Builder's own prompt, not the console — a flow's steps share no memory, and the subject asked rather than confabulating while the engine paused rather than landing** (the failure mode the design exists to prevent, caught in the wild) · **F2 the fake has no answer-then-land scenario, so `send <text>`'s landing arc is proven only on real bytes** — one scenario file plus a golden would make it guardable at budget 0 forever · **F5 the run log cannot name the account** (`ignited` records the cwd and nothing else), so a run whose `conditions.json` is lost is readable forever and drivable never — one field on `ignited` is the fix, and **the deck hits this on its first session row** · **F6 the trust read still lives only in `lab/c8/accounts.ts`; the console measured the pane instead of copying it** — second caller, wants promoting into `venue.ts` · F3 a summoned pane inherits the cmux shim on PATH (the binary is absolute, so the summon is clean) · F4 22 orphaned **fake** subjects, 1–5 h old, accumulate from barrage mutant runs — zero cost, but processes and fds. F2, F5 and F6 **relayed to the bulletin**. Reviewed 2026-08-30 at the tender's hand: engine 64 + barrage 38 + fake 59 + console 19 green, four type gates 0, barrage exit 0 (1000/1000 · 50/50 · 9/9); F4's orphans swept to zero at the batch close; F2/F5/F6 entered the deferred list — none blocks G4 |
| C11 | [The turn cursor + the real seam](plans/c11-cursor-real-seam.md) — C7 F3's ruled fix (the transcript fallback answers the fired turn, cursor recorded at spawn) + the `{real: …}` subject arm `spawn.ts` reserves | C7 | Builder · opus-high | **LANDED** 2026-08-30 — all 5 bars evidenced in [C11](plans/c11-cursor-real-seam.md); reviewed same day at the tender's hand: engine 54 + barrage 38 tests green, both type gates 0, **barrage exit 0 (1000/1000 · 50/50 cuts · 9/9 mutants, wall 147.8 s)**. The F3 red **seen red on the parent engine** (`cfb406a`, test before fix — the wrong turn's verdict, exactly C7 F3); the cursor recorded on `ignited`/`resumed` and validated on real bytes including the summoned hand turn (turn arithmetic and the cursor disagree there, the cursor is right); invariant 8 tightened and **seen to fail** on a planted stale cursor; `{real: {}}` parses strict and nothing in the tree fires it — **budget 0 held**. F1 `lab/c4/captures/` are *streams* — the transcript corpus is the live account dirs, mortal, nothing pins it · F2 a tool that merely failed re-derives via transcript as ‹needs-⬡ permission› — a false ask C8 must expect and measure · F3 arm-B array-content user rows break turn *counting*, not the cursor (kill criterion NO) · F4 the barrage does not reproduce this defect class (400 sabotaged cuts stayed green) — the deterministic pair guards it · F5 the classifier friction moved mid-charge (the allowlist landed during the run) |
| C13 | [The report on disk](plans/c13-report-on-disk.md) — C8 F3's ruled fix: the completion rule reads the `StructuredOutput` pair as a closed turn, the fallback gains the report and **lands from disk**; the fake made faithful; C11's cursor signal restored | C8 | Builder · opus-high | **LANDED** 2026-08-30 — **K1 trued at C8's own denominator**; all 6 bars evidenced in [C13](plans/c13-report-on-disk.md). The 50 landed turns C12's archive still holds read `dead` under the parent reader and **`worked` + a landing under this one, 50/50 ×3 accounts** — the falsified capability row is green. The K1 red **seen red on the parent engine** (`2edb3f0`, test before fix); the completion rule matches the closing pair **by `toolUseId`** (kill criterion measured: 55/55 archived C8 transcripts, 0 unmatched); **law 5 proven end to end — the engine SIGKILLed mid-turn, the subject's stream file then deleted outright, and the restart landed the step from the transcript alone**, invariants `[]`, verdicts ≡ the uncrashed baseline. The fake's closing pair validated against the committed real fixture; three `schema-*` goldens re-recorded (the shared id stream, nothing else moved). The cursor's regression signal restored and **seen red on a planted stale cursor**, with the masking itself measured. Engine 61 + barrage 38 + fake 59 tests green, all three type gates 0, **barrage exit 0 (1000/1000 · 50/50 cuts · 9/9 mutants, wall 147.6 s)**. **Budget 0 held.** **F1 the barrage reaches the transcript fallback once in ~2,300 turns and never lands from it** — the durable stream means a torn stream and a complete transcript essentially never coexist, so the class is guarded by the deterministic pair, not the barrage; closing it wants a sixth cut family that kills the *subject* (C11 F4's shape, twice now) · F2 the report has three carriers on disk — the tool call's input, an `attachment` row, and the same pair **in the stream**; the fake now writes only the first, so its stream is unfaithful where its transcript just stopped being · F3 a `needs_input` report on disk still pauses ‹no report› (the spec's literal "as today") — transcript ≡ stream now holds for `done` and the non-reporting scenarios only · F4 one archived session carries three report calls, so a position-matched reader picks the wrong one — the corpus makes "never by position" a necessity · F5 Bun's `Glob` hides the archive exactly like rg (`{dot: true}`; C12 F1's trap in a second tool). Reviewed 2026-08-30 at the tender's hand: engine 61 + barrage 38 + fake 59 green, three type gates 0, barrage exit 0 (1000/1000 · 50/50 · 9/9, wall 147.9 s); F1's frequency claim corrected on the C8 ruling with a dated note; the sixth cut family and the fallback vocabulary entered the board's deferred list |
| C8 | [Real-session physics](plans/c8-real-session-physics.md) — layer 1: the same engine on real `claude -p`, small topologies ×3 accounts; campaign bar 4 + bar 5's cost inputs | C11 | Digger · opus-high | **LANDED** 2026-08-30 — **K1 FIRED honestly, the bet stands**; reviewed same day at the tender's hand (repair barrage re-run exit 0). Stream sensing holds ×3 accounts every rule; bar 4's matrix tabled with C4 as control (9/9 capabilities, transcript-read falsified); **the headline: engine SIGKILLed mid-turn, a real orphan wrote on to a stream whose reader was a corpse, the restart adopted and landed it — 3/3, zero double-ignitions** (C6 F2's fix proven at layer 1); 9 real flows 9/9 invariants; summon round trip lossless, the cursor counted the pane's 17 rows (C11's hazard, field-proven). **Budget 63/200 turns, $3.44/$15.** **F1 two granted repairs RATIFIED at review** (`2fe9d1f` — the real arm was unaimable) · **F3 = K1: the engine's own `--json-schema` makes every landed turn read `dead` on disk (48/48 ×3 accounts, control green) — ruled into C13** · **F4 `auto` grants filesystem-wide writes, arbitrary shell, and network egress headless — the denial pause is not inducible at it; deck-facing safety fact** · F2 trust is a flow's intent, not ignition's precondition · F9 a sonnet·low turn is ~6.4¢ — **the dollar ceiling binds first; future budget lines lead with dollars** · F10 three new stream shapes; C4 F1's multi-result did not reproduce (grammar §11 amended at review) |
| C7 | [The fuzzer + the barrage](plans/c7-fuzzer-barrage.md) — seeded topology generator, crash injection at the engine's seam, the nine-invariant oracle, the mutation check 9/9, one agent-runnable command; **step 0: the durable stream** (C6 F2's ruled fix) | C6 | Builder · opus-high | **LANDED** 2026-08-30 — [barrage/](barrage/) is the campaign's proving instrument; all 8 bars evidenced in [C7](plans/c7-fuzzer-barrage.md). **`bun barrage/run.ts --runs 1000 --crashes 50` exits 0 in 148 s: 1000/1000 runs green over 26,279 generated steps, 50/50 cuts converged on their uncrashed runs across all five cut families, 9/9 mutants caught on their own invariant class with every control green.** Engine + barrage **86 tests green, both type gates exit 0**; the 23-row scenario table is measured through `ignite()`, not declared. **Step 0 landed:** law 1's tuple now carries stream files, and a mid-turn cut on a reporting step converges to **landed** — the state the pre-fix engine could never reach. **Zero real `claude` invocations — budget 0 held.** **F3 the transcript fallback is not turn-addressable** — ruled 2026-08-30: the fix is [C11](plans/c11-cursor-real-seam.md), a recorded row cursor at spawn; C8 depends on it · **F4 the engine spun forever on restart** (an async body deleted its in-flight entry before `set` installed it) — pre-existing from C6, fixed in its own commit `c16ee29`, **RATIFIED at the 2026-08-30 review**: the landing re-proved on the fixed bytes at the Architect's own hand (86 tests, both type gates 0, barrage exit 0: 1000/1000 · 50/50 · 9/9, wall 147.6 s) · F1 only `schema-done` lands without a ruling — layer-0 depth rides the harness · F2 19 of 23 scenarios script one act, so a uniform resume policy fuzzes only the death · F5 a step id must now be a file name · F6 three mutants trip a second class (the nine are not orthogonal) · F8 cut points must be drawn family-first or `before-card` goes untested |
| C4 | [Headless physics](plans/c4-headless-physics.md) — the event grammar captured; the nine capabilities measured ×3 accounts; kills on the bet itself | ⬡-gate: the cornerstone blessing | Digger · opus-high | **LANDED** 2026-08-29 — K1 NO, K2 NO; 9/9 capabilities met (needs-⬡(question) needs `--json-schema`); grammar at [lab/c4/grammar.md](lab/c4/grammar.md) |
| C6 | [The engine core](plans/c6-engine-core.md) — event-sourced flow runner: run log as truth, replay, crash-redo, the nine invariants executable | C5 | Builder · opus-high | **LANDED** 2026-08-30 — [engine/](engine/) is the campaign's runner; all 10 bars evidenced in [C6](plans/c6-engine-core.md). **45 tests green, type gate exit 0**; the 10-step demo flow runs to a full terminal state (7 landed, 3 killed) and **`replay(log)` ≡ state, exactly**; the oracle is **green on the demo log and red on seven planted corruptions** (invariants 1,2,3,4,5,6,9); the **crash drill converges at five named cut points, zero double-ignitions**, adopt-or-re-derive proven on the orphan; transcript-only ≡ streamed verdict on all three named scenarios. **Zero real `claude` invocations — budget 0 held.** **F1 a pause names every cause** (the two denial scenarios are structurally identical; one cause cannot serve bars 5 and 6) · **F2 ruled 2026-08-30: the durable stream adopted** — law 1's tuple gains stream files (cornerstone §4.4/§4.9/§3.2), built as C7 step 0; ruling text in [C6](plans/c6-engine-core.md) · **F6 a gate never lands itself** — it pauses ‹gate› carrying its report · F3 the transcript's completion signal, measured on three real captures · F7 only `orphan-finish` proves the adopt path's worked branch — C7 should declare transcript completeness · F9 the harness blocks fixture commits and `~/.claude` reads; wants an ISSUES filing |
| C5 | [The fake claude](plans/c5-fake-claude.md) — the stand-in binary + scenario library + stream validator, against C4's grammar | C4 | Builder · opus-high | **LANDED** 2026-08-29 — [fake-claude/](fake-claude/) is the campaign's standing instrument; all 7 bars evidenced in [C5](plans/c5-fake-claude.md). 58 tests green, type gate exit 0; **validator 43/43 C4 captures** with **five** negative controls red; **23 scenarios**, each with a committed golden, byte-identical ×3 on four of them (both arms); **p50 16 ms** spawn→exit over 50 (bar 100); the sandbox guard refuses all three real account dirs by spawn, emitting nothing; zero torn transcript lines after every scripted death, orphan drill included. Zero real `claude` invocations — budget 0 held. **F1 grammar §10.9 is falsified by C4's own capture** — `queued_turn_count` is 0 in the merged run, so rule 9's detector never fires; both shapes ship, the amendment is the Architect's · **F2 `SessionStart` hooks leak without `--include-hook-events`** (9 captures with faithful argv) · **F3 the pinned argv subset is missing `--effort`**, which every C4 subject carried — nothing added, contract change · F4 the fake's transcript is grammar §2's minimum (no `attachment` rows) — C6's reader needs a real capture too · F5 same seed ⇒ same session id across scenarios; C7 passes `--session-id` or varies the seed |

**Deferred — tracked, not lost:**

- **The answer-then-land fake scenario** — two acts, `report needs_input` then
  `report done`, plus its golden: the arc `send <text>` drives on a real subject
  is unreachable on fakes today, so the console's most consequential verb is
  guarded only by the real rehearsal (C10 F2 — the fake is C5's, so the scenario
  and its golden want their own lay).
- **The account on the `ignited` event** — the run log records the subject's cwd
  and never the config dir that selects the account, so nothing that reads a log
  alone can reopen the run to drive it; the console depends on a sidecar
  `conditions.json` for `send`/`summon`/`return` (C10 F5). One field, engine-side,
  and the deck hits it on its first session row.
- **The trust read's home** — the only real implementation is
  `lab/c8/accounts.ts`, inside a dig's scratch, while `engine/venue.ts` ships a
  stub with the slot reserved. Second caller now (C10 F6, which measured the pane
  rather than making a second copy); wants promoting before a third.
- **The mutant drill sweeps its own subjects** — a mutant run that ends early leaves `hang`-scenario fakes alive (C10 F4 found 22, hours old; swept at the batch-8 close); the mutation check wants a SIGTERM of its spawned pids at exit.
- **The sixth cut family** — a crash cut that kills the *subject* in the window
  between its transcript's closing pair and its `result` row, so the barrage can
  reach the transcript-fallback landing path it never touches today (C11 F4 +
  C13 F1 — the same shape twice; promoted to a charge if it recurs a third time).
- ~~**The fallback's pause vocabulary** — `verdictFromTranscript` naming
  `needs_input`/`blocked` from disk instead of ‹no report› (C13 F3, two lines;
  rides C10's lay — the console demo is where the poorer name becomes a UX
  lie).~~ *Promoted to [C10](plans/c10-console-demo.md) step 0, batch 8.*

**The arc** (cornerstone §8; laid batch by batch, never before its inputs exist):
C5 the fake claude → C6 the engine core → C7 the fuzzer + the barrage → C11 the
cursor + the real seam (minted at the C7 review, C7 F3's ruling) → C8
real-session physics → C13 the report on disk (minted at the C8 review, C8 F3's
ruling) · C9 scale · C10 the console demo → G4 the verdict (⬡-gate).

**Batch note — 2026-08-30 (batch 8):** two charges, **serial C9 → C10** —
schedule, not dependency (the edge test, D73: neither reads the other's
result; the order exists because **C10's step 0 edits the engine C9
measures** — a moving target contaminates timed numbers). Laid at his word
("lay batch 8"); tender: the review session on his dispatch word, or Felix
ignites by hand — kickoffs in [C9](plans/c9-scale.md) and
[C10](plans/c10-console-demo.md); C10 ignites when C9's landing is reviewed.
Budgets, dollars leading (C8 F9): C9 **≤$8 / ≤120 turns**, C10 **≤$3 / ≤30
turns** — either ceiling a ⬡-fork (D21). **Concurrency plan:** C9's timed
arms run alone on the desktop — 1-min load recorded before and after each,
the arm held while load > 8; **the 25-wide real burst is sanctioned for C9 Q2
only** (raising C4 Q8's ≤10 ceiling for that arm alone, never above 25); the
cmux desktop untouched; a second consecutive `rate_limit_event` stops the
ladder (C9 K2). The deferred list's fallback-vocabulary item is promoted into
C10 step 0 (struck above); the sixth cut family stays deferred. After batch
8: **G4 convenes** — the evidence pack is campaign bars 1–6, all landed.

**Batch note — 2026-08-30 (batch 7):** single charge, **C13**, ignitable now
(C8 LANDED, reviewed; budget 0 — every real byte it needs is C8's, pinned by
C12's archive). Serial, no flow, no bulletin. Tender: **the review session, his
word 2026-08-30 ("Go ahead and dispatch C13")**; kickoff in
[C13](plans/c13-report-on-disk.md). C13 precedes
C9: G4 does not convene on a falsified capability row. Behind it, un-laid: C9
scale (its budget line **leads with dollars** — C8 F9: ~6.4¢/sonnet·low turn,
the dollar ceiling binds first) · C10 the console demo (its posture picker
carries C8 F4: `auto` is not restrictive headless).

**Batch note — 2026-08-30 (batch 6):** two charges, serial — **C11 then C8**;
Felix ignites; tender: Felix (the v2 engine never runs v3 charges; C8's real
spend gates on his hand) — no flow, no bulletin. C11 is ignitable now (C7
LANDED, re-proved at this review; budget 0). **C8 ignites when C11's five
gates paste green** — they are all machine-checked (exit codes), so Felix's
read of the pasted evidence suffices; the next Architect review (C8's landing)
verifies both — the lay's schedule ruling, maximizing the run between his
judgment calls (D44). C8 carries the campaign's first real budget line:
**≤200 subject turns and ≤$15, either ceiling a ⬡-fork** (D21). Rulings at
this review: C7 **F4 RATIFIED** (fix re-proved on current bytes), **F3 → C11**
(the recorded row cursor); both texts under the findings in
[C7](plans/c7-fuzzer-barrage.md).

> **Amended 2026-08-30, Felix's word at the review session ("dispatch both"):
> tender is the reviewing Architect session** — it dispatches C11, itself
> verifies C11's five gates at landing (the review), then dispatches C8.
> Serial shape unchanged; C8's budget line and its ⬡-forks unchanged — a
> ceiling hit still stops and escalates to Felix.

**Batch note — 2026-08-30 (batch 5):** C7 LANDED; C8 is the next charge and is
**not yet laid** — the arc's next stop is real-session physics, and it is the
first charge in the campaign that spends real turns, so it wants an Architect's
pre-chew and a budget line before it is ignitable. Two C7 findings are the
Architect's to rule before or with it: **F4** (a fix taken beyond the charge's
fence — ratify or revert) and **F3** (the transcript fallback is not
turn-addressable; the fix is an engine change beyond step 0). ~~C6 F9's field
report still wants filing to root `ISSUES.md` — the v3 fence forbids it from
inside a charge.~~ *(Struck at the 2026-08-30 review: filed before C7 ignited —
root `ISSUES.md`, commit `2de72d4`.)*

**Batch note — 2026-08-30 (batch 4):** single charge, C7, ignitable now (C6
LANDED — proving run re-run green at review: 45 tests, tsc exit 0, fixtures
committed; F2 ruled and folded in as step 0; F9 filed to the root inbox). Felix
ignites; tender: Felix — serial, no flow, no bulletin. Budget: 0 real turns; any
real spawn is a ⬡-fork. The classifier may block fixture/red `git add`s (F9) —
the charge says finish, list the paths, Felix runs the adds.

**Batch note — 2026-08-29 (batch 3):** single charge, C6, ignitable now (C5
LANDED, its three amendments ruled and committed at review — grammar rule 9,
SessionStart unflagged, the F3 flags). Felix ignites; serial, no flow, no
bulletin. Budget: 0 real turns (≤3 only if the real-transcript fixture's C4
source is gone).

**Batch note — 2026-08-29 (batch 2):** single charge, C5, ignitable now (C4
LANDED); Felix ignites; serial, no flow, no bulletin. No real sessions, no live
resources — budget 0 subject turns; the fake's own tests spawn only the fake.

**Batch note — 2026-08-29 (batch 1):** single charge, C4, ignitable on the cornerstone
blessing; Felix ignites (deck `/summon` or by hand); no flow, no bulletin (serial).
Concurrency: C4's Q8 spawns ≤10 simultaneous subjects, load conditions recorded —
no other live-resource contention; the cmux desktop is untouched.

## Done when — the campaign bars

1. **The barrage:** one command, agent-run, ≥1,000 seeded layer-0 runs, all nine
   invariants (cornerstone §5) machine-checked — green, or every red filed to
   ISSUES with its seed (via `barrage/reds/` — the fence keeps root files out of
   a charge's hands; reds distill upward at review).
2. **The crash-redo drill:** the engine killed mid-flow at randomized ticks, ≥50
   runs; every restart converges, zero double-ignitions.
3. **The mutation check:** a planted engine mutant caught per invariant class,
   9/9 — the oracle has been seen to fail.
4. **The real-session matrix:** the nine substrate capabilities measured ×3
   accounts at sonnet·low, evidence tabled; the census's ten events accounted for
   headless.
5. **Scale:** 100 simultaneous fake subjects green; real-session scale measured to
   ≥25 with a cost extrapolation table for G4.
6. **The console demo, his hand:** list live v3 sessions, read one live, send a
   turn, summon it to a terminal, return it headless — his visual pass.
7. **G4 convened** on 1–6 as the evidence pack; his verdict recorded: substrate,
   v2's fate, migration shape, viewport.
