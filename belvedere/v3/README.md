# Belvedere v3 — the proving ground

The building's third campaign: substrate + engine rebuilt from first principles,
proven by an agent-runnable barrage, judged at one verdict gate. Founding record:
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
| C7 | [The fuzzer + the barrage](plans/c7-fuzzer-barrage.md) — seeded topology generator, crash injection at the engine's seam, the nine-invariant oracle, the mutation check 9/9, one agent-runnable command; **step 0: the durable stream** (C6 F2's ruled fix) | C6 | Builder · opus-high | **OPEN** — ignitable now; budget 0 real turns |
| C4 | [Headless physics](plans/c4-headless-physics.md) — the event grammar captured; the nine capabilities measured ×3 accounts; kills on the bet itself | ⬡-gate: the cornerstone blessing | Digger · opus-high | **LANDED** 2026-08-29 — K1 NO, K2 NO; 9/9 capabilities met (needs-⬡(question) needs `--json-schema`); grammar at [lab/c4/grammar.md](lab/c4/grammar.md) |
| C6 | [The engine core](plans/c6-engine-core.md) — event-sourced flow runner: run log as truth, replay, crash-redo, the nine invariants executable | C5 | Builder · opus-high | **LANDED** 2026-08-30 — [engine/](engine/) is the campaign's runner; all 10 bars evidenced in [C6](plans/c6-engine-core.md). **45 tests green, type gate exit 0**; the 10-step demo flow runs to a full terminal state (7 landed, 3 killed) and **`replay(log)` ≡ state, exactly**; the oracle is **green on the demo log and red on seven planted corruptions** (invariants 1,2,3,4,5,6,9); the **crash drill converges at five named cut points, zero double-ignitions**, adopt-or-re-derive proven on the orphan; transcript-only ≡ streamed verdict on all three named scenarios. **Zero real `claude` invocations — budget 0 held.** **F1 a pause names every cause** (the two denial scenarios are structurally identical; one cause cannot serve bars 5 and 6) · **F2 ruled 2026-08-30: the durable stream adopted** — law 1's tuple gains stream files (cornerstone §4.4/§4.9/§3.2), built as C7 step 0; ruling text in [C6](plans/c6-engine-core.md) · **F6 a gate never lands itself** — it pauses ‹gate› carrying its report · F3 the transcript's completion signal, measured on three real captures · F7 only `orphan-finish` proves the adopt path's worked branch — C7 should declare transcript completeness · F9 the harness blocks fixture commits and `~/.claude` reads; wants an ISSUES filing |
| C5 | [The fake claude](plans/c5-fake-claude.md) — the stand-in binary + scenario library + stream validator, against C4's grammar | C4 | Builder · opus-high | **LANDED** 2026-08-29 — [fake-claude/](fake-claude/) is the campaign's standing instrument; all 7 bars evidenced in [C5](plans/c5-fake-claude.md). 58 tests green, type gate exit 0; **validator 43/43 C4 captures** with **five** negative controls red; **23 scenarios**, each with a committed golden, byte-identical ×3 on four of them (both arms); **p50 16 ms** spawn→exit over 50 (bar 100); the sandbox guard refuses all three real account dirs by spawn, emitting nothing; zero torn transcript lines after every scripted death, orphan drill included. Zero real `claude` invocations — budget 0 held. **F1 grammar §10.9 is falsified by C4's own capture** — `queued_turn_count` is 0 in the merged run, so rule 9's detector never fires; both shapes ship, the amendment is the Architect's · **F2 `SessionStart` hooks leak without `--include-hook-events`** (9 captures with faithful argv) · **F3 the pinned argv subset is missing `--effort`**, which every C4 subject carried — nothing added, contract change · F4 the fake's transcript is grammar §2's minimum (no `attachment` rows) — C6's reader needs a real capture too · F5 same seed ⇒ same session id across scenarios; C7 passes `--session-id` or varies the seed |

**The arc** (cornerstone §8; laid batch by batch, never before its inputs exist):
C5 the fake claude → C6 the engine core → C7 the fuzzer + the barrage → C8
real-session physics · C9 scale · C10 the console demo → G4 the verdict (⬡-gate).

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
