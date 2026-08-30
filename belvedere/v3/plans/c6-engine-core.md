# C6 — the engine core

**Status:** OPEN — laid 2026-08-29 · **Depends on:** C5 · **Staffing:** Builder ·
opus-high · **Spec blessed:** rides the BLESSED cornerstone §8 arc (⬡✓
2026-08-29); pre-chewed and laid by the board's Architect, 2026-08-29 · **Branch:**
none — serial sole lane, straight to `master`, explicit paths

## Goal

`belvedere/v3/engine/` — the event-sourced flow runner over headless subjects:
load a declared flow, take a blessing, ignite steps as their edges land, sense
outcomes from streams and transcripts, pause loudly, survive its own death, and
prove all of it against the fake claude. **The run log is the truth: render =
transparency, replay = redundancy** (cornerstone §3.4). Library-first, thin CLI;
C7 imports it. Built to last, full directives.

## Inputs — read before working

- **Normative:** [../lab/c4/grammar.md](../lab/c4/grammar.md) **as amended
  2026-08-29** — rule 9 is corrected (merged turns detect by arithmetic, never
  `queued_turn_count`) and `SessionStart` hook pairs leak unflagged at every
  process start. The ten parse rules are the engine's parser spec.
- **The instrument:** [../fake-claude/README.md](../fake-claude/README.md) — the
  dialect (three inert flags added at the C5 review), the scenario library, the
  `validate.ts` API (import it in parser tests). C5 F5: the engine **always
  passes `--session-id`** (parse rule 5 — the id exists before the process).
  C5 F6: bun narrows IIFE captures — name the async pump.
- C4 findings: F5 (the step report closes the question gap), F6 (silent
  success; posture read-back), F7 (transcript is truth; orphan finishes), F8
  (venue-trust precheck at ignite — an interface here, real in C8).
- [../cornerstone.md](../cornerstone.md) §§3–5 — the bet, the contract, **the
  nine invariants**; [../README.md](../README.md) — the fence.
- Inherited law: D10 (ambiguity never authorizes), D11 (the blessing of the
  drawn plan is the authorization), D73 (budget ceiling; the edge test). **D12
  scope-growth is deferred** — v1's scope is the declared steps; growth is
  amendment + re-blessing of unignited steps. Conservative satisfies
  invariant 4.

## The spec

### The shapes

- **The flow file** — JSON, the engine's own (D7): `{id, name, budget, steps[]}`;
  a step: `{id, kind: "task"|"gate"|"card", subject, model, effort, posture,
  depends[], timeout_ms?}`. A subject is `{fake: {scenario, seed}}` now,
  `{real: {kickoff, account, venue}}` at C8 — the spawn adapter is the only code
  that cares (D4's echo). A **gate** is a step whose report rules the verdict; a
  **card** is Felix's — it has no subject and **never ignites**: it pauses until
  `rule()` supplies the answer.
- **The run log** — append-only jsonl, one event per transition (blessed,
  ignited, turn-ended, denied, paused ‹cause›, ruled, landed, killed, halted,
  ceiling, amended, re-blessed…), each carrying enough to replay. Home:
  `summon/log/v3/runs/` (gitignored telemetry); test fixtures commit
  deliberately. **`replay(log)` ≡ state, exactly** — determinism lives in
  replay, never in scheduling (parallel completion order is real and the log
  records it).
- **The step report** — pinned schema, passed as `--json-schema` on every task
  step: `{state: "done"|"needs_input"|"blocked", cause: string, answer?}`
  (C4 F5's measured shape; C5's report step speaks it). A task result with no
  parseable report ⇒ paused ‹no report›.

### The laws the code must wear

1. **The engine holds nothing.** Between turns, state is (flow file + run log +
   transcripts). Crash at any instant; restart re-derives and continues.
2. **The blessing is the caller's act.** `bless(scope)` before anything ignites
   (D11); the engine never blesses itself — the harness scripts it (C7), the
   deck renders it (post-verdict). Amendment re-covers unignited steps only.
3. **Parse rules 1–9 as amended.** Last `result` wins; `permission_denials[]`
   non-empty ⇒ paused ‹needs-⬡ permission›, never landed (F6 — the
   silent-success trap); no `result` at EOF ⇒ dead; `init.permissionMode`
   read back, mismatch ⇒ paused ‹posture›.
4. **Posture legality per (model, posture) at bless** (grammar §4's matrix):
   task steps take `auto` | `acceptEdits` | `bypassPermissions`; (haiku, auto)
   refuses at bless — loud, never a silent fallback.
5. **Lost-stream re-derivation.** A fired step whose stream is gone: watch pid;
   on exit, the transcript alone yields the outcome (worked / denied / dead) —
   F7's corollary. The fake's transcripts carry the deny shape (`is_error`
   tool_result); use them.
6. **Timeouts are per step** (`timeout_ms`, default 120 s): SIGTERM ⇒ dead ⇒
   paused ‹timeout›. **No auto-retry in v1** — a dead step pauses for a ruling
   (`rule()` may re-ignite the turn via `--resume`, F7's resumability).
7. **Budget is a ceiling** (D73): at `budget` ignitions the engine pauses;
   one re-blessing extends. Never past it.
8. **`invariants(log): Violation[]`** — the cornerstone §5 nine as one pure
   module over the run log (+ transcripts where a check needs them). C7's
   oracle imports it; it is not the fuzzer.
9. **`precheckVenue(account, venue)`** is an interface (F8): layer-0 stub says
   yes; C8 implements real trust. The slot exists NOW so ignite's pipeline has
   its place.

### The API

`load(flowPath)` · `bless(run, scope)` · `run()/tick()` · `rule(stepId,
verdict|answer)` · `halt()` · `state()` · `replay(logPath)` ·
`invariants(logPath)`. Thin CLI: `bun engine/cli.ts run <flow> [--bless]` for
hand runs; the library is the product.

## Done when

1. `bun test` green in `v3/engine/`; the repo-pinned `tsc --noEmit` green
   (the coda's path). Output pasted.
2. **The demo flow, end to end against the fake:** ≥8 steps mixing serial and
   parallel, 1 gate, 1 ⬡-card, 1 denial step, 1 dying step — runs to its
   terminal state; the run log a committed fixture; `replay(log)` ≡ final
   state, asserted.
3. **Invariants: green on the demo log; red on ≥3 corrupted logs** — a planted
   double-ignition, an order violation, an ignition past an unruled gate — each
   named in the test (the negative control law).
4. **Crash-redo at ≥5 named cut points** (before the first ignition record ·
   mid-turn with the subject running · mid-parallel · at the gate pause · at
   the card pause): restart converges, **zero double-ignitions**, asserted by
   `invariants()`. The orphan-finish scenario proves adopt-or-re-derive.
5. **Silent success caught:** the permission-denial scenario's step ends
   paused ‹needs-⬡ permission›, never landed.
6. **Posture law proven:** (haiku, auto) refused at bless; the
   posture-mismatch scenario refused at read-back.
7. **Budget:** ceiling honored, one re-blessing extends — tested.
8. **Lost-stream re-derivation:** for orphan-finish, permission-denial and
   die-137, the transcript-only outcome equals the streamed outcome — tested.
9. **Timeout:** the hang scenario ⇒ dead-by-timeout ⇒ paused ‹timeout› —
   tested.
10. **The real-transcript fixture:** the transcript reader parses one real C4
    subject transcript (C5 F4 — `attachment` rows and all), copied from the
    personal config dir into `engine/test/fixtures/` (C4's own probe output,
    nothing sensitive). Contingency if C4's transcripts are gone: ignite one
    fresh T-echo subject — **budget ≤3 real turns, else 0**.

## Out of scope

Topology generation, fuzz loops, auto-filing (C7) · real subjects beyond the
one fixture (C8) · census, deck, UI, summon (C10) · arm B (stdin mode) · D12
scope-growth auto-join · v2 flow-file compat · retry policies · importing
anything from `glass/` (independence — the trust precheck is an interface).
**Creep is a bug.**

## Findings

*(append here)*

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c6-engine-core.md.
```
