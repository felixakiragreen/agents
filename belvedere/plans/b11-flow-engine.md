# B11 — the arm and the engine

**Status:** OPEN · **Depends on:** P5; B10 · **Staffing:** Builder · opus-high ·
**Blessed:** Architect, flow-cut sitting 2026-08-27 — the posture floor is
Felix's blessing item 2 (README §6 batch-4 note) and binds this row verbatim.

## Goal

D11 live: **one click on the rendered DAG arms the flow — the review of the
rendered plan IS the authorization** — and the engine runs the string: fires
declared steps through the existing hands, pauses at Felix-cards, on any
ambiguity (D10 wholesale), and on HALT; step timeouts; the DAG lights as it
runs. The Dispatcher's between-sessions logistics, mechanized
([flow-keel.md](flow-keel.md) §§1–2). No judge insertion, no plan growth —
B12's.

## Inputs — read before building

- [flow-keel.md](flow-keel.md) §§4–5 — D11, the physics. [B10's]
  (b10-flow-dag.md) landed schema, page, and run-state format — consume, don't
  re-derive.
- [P5's](p5-permission-physics.md) permission clause and trust precheck —
  applied **at arm time**: a step whose venue fails the precheck refuses the
  arm, loudly, naming the step (D10's family — never a silent mid-flow
  stall).
- `glass/hands.ts` — fire/worktree as internal functions: same audit, same
  unwind, same arming switch. **The fence gains no write class** (README §2):
  engine writes = hands calls + run-state appends in the census home (D6
  telemetry).
- P1's two-sensor law (census `Stop` + `kill -0`); P4 (restore semantics);
  B4/B8 (audit, unwind, HALT file at `summon/log/HALT`).
- `doctrine/` parse for board-row landing states (D65 — one parser).

## Spec

1. **The arm.** `POST /flow/<name>/arm` — credential-gated (the arming
   switch; an arm authorizes socket writes). Legal only from the rendered
   page (the button lives on `/flow/<name>` and nowhere else); the page at
   arm time already shows the whole DAG and the bill (B10). Arming records
   `{ev: "armed", hash}` — sha256 of the flow file — to run-state. **Armed
   flows are immutable:** on any later hash mismatch the engine pauses all
   *new* fires (in-flight sessions run on), renders the delta state, and the
   page offers **re-arm** — one click covers the amendment (D11). This is the
   step-arm base behavior; B12 adds the scope-arm auto-join per D12's
   ruling — build so that D12 is a flag B12 flips, not a rewrite.
2. **The tick.** A single engine pass inside the glass server, on an interval
   (5 s) and after every hands action: read flow file + run-state + census +
   HALT; compute each step's state; fire what is ready; append what changed.
   The tick is idempotent and single-flight (never two ticks interleaved);
   the walk/worker law binds (B8 F3 — nothing heavy on the request thread).
3. **Ready means:** every dependency landed · the step unfired · its gate is
   not an unpassed Felix-card · HALT absent (checked **immediately before
   every fire** — HALT's first consumer) · concurrency headroom
   (`flow.concurrency` caps engine-fired live sessions) · venue free —
   **master-venue steps are strictly serial per checkout** (single-writer
   physics); worktree steps may run parallel. Fires compose the worktree
   first when the venue says so (hands' existing path), then fire with the
   step's account/tier/permission clause; the run-state records
   `{ev: "fired", step, sid, workspace}`.
4. **Landed means (interim law, keel §5.1):** the fired session's census
   shows `Stop` as its last event **and** its pid fails `kill -0` OR its
   board row — when the step id is a row on this board — parses **LANDED
   clean** (state `LANDED`, via `doctrine/` parse). A session idle-at-`Stop`
   with a row not yet LANDED is *working-or-stalled*: after
   `step.timeoutMinutes` (default 240) it becomes `paused` with `why:
   "timeout"`. Anything malformed — row unparseable, session dead with no
   `Stop`, state `KILLED`/`BLOCKED` — is **paused + surfaced on the node**,
   never advanced past and never judged silently (B12 takes it from there;
   until B12, pausing is the whole behavior — pausing is cheap, wrong
   continuation is expensive).
5. **Pauses.** A reached Felix-card pauses its lane and renders his card
   (never auto-fired, never auto-passed — his click on the card's *pass*
   gesture, credential-gated, is the resume). D10: any parse ambiguity — flow
   file, run-state, a board row — pauses with the conflict named on the
   node. HALT: nothing fires while `summon/log/HALT` exists; the DAG says
   so. `paused`/`resumed`/`refused` all append to run-state with `why`.
6. **The engine kills nothing.** No hand stops a session; a timeout pauses
   the *flow's advance* and surfaces — stopping live work is Felix's or the
   session's own.
7. **Never exceed the posture.** The engine sets no permission posture beyond
   the account's own defaultMode; `bypassPermissions` never (the posture
   floor, blessed). The P5 clause is the whole vocabulary.

## Acceptance criteria — the DoD

All measured over HTTP against a live glass, evidence pasted; smoke sessions
are haiku-low in `~/code/agents` (trusted ×3 — B7 F1), ≤2 concurrent, every
workspace closed after (D55).

- [ ] **The smoke flow runs itself:** a declared 3-step flow (two haiku-low
  real sessions doing real tool work — P5's Q2 script shape — then a
  Felix-card). Arm it from the page; step 1 fires (audit line + census beat +
  first-turn sha ≡ composed summons); step 1 lands → step 2 fires with **no
  human touch — the measured gap between step 1's landing edge and step 2's
  fire audit line pasted** (the chapter's whole point, in seconds); the
  Felix-card pauses the lane (assert: card rendered, zero fire wiring, no
  step 3 exists to fire).
- [ ] **HALT:** set mid-flow → the next fire is refused (`refused` in
  run-state, nothing in the hands audit), the page says HALT; clear →
  resumes. Use a scratch HALT venue if feasible — else the real flag, set
  and cleared inside one DoD run with the before/after pasted (B8 F1's
  lesson: prove the temp path, never leave the city armed).
- [ ] **Timeout:** a step with `timeoutMinutes` set low against a sleeping
  session → `paused, why: timeout`, node surfaced, session untouched (pid
  still alive, pasted).
- [ ] **D10:** corrupt the run-state (or flow file) mid-flow → engine pauses
  with the conflict named on the page; nothing fires.
- [ ] **Amend + re-arm:** touch the flow file mid-flow → new fires pause,
  delta rendered; re-arm click resumes (hash re-recorded).
- [ ] **Worktree venue:** one smoke step with a worktree venue — worktree
  composed first, fire lands with cwd inside it (transcript pasted), torn
  down after.
- [ ] **Arm refusal:** a flow whose venue fails P5's trust precheck refuses
  the arm naming the step; disabled hands (credential absent) → arm 503s
  honest.
- [ ] `bun test belvedere/glass` green in one process; `bunx --offline tsc
  --noEmit` exit 0; `/flow/<name>` p95 < 500 ms while the engine ticks.

## Out of scope

- Judge auto-fire, scope-arm auto-join, plan growth (B12).
- Killing or signalling sessions; editing boards, ledgers, flows, or any
  truth file (forever-class, README §2).
- Account arbitrage (accounts are declared per step; the engine never
  chooses).
- Any richer landing grammar than §4's interim law — `holds` is canon's
  (keel §6); the interim classifier's misses become G2 evidence, not local
  patches.

## Findings

*(append here — deviations from spec, discoveries, parked adjacents)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/flow-keel.md,
and ~/code/agents/belvedere/plans/b11-flow-engine.md,
and build it to its DoD.
```
