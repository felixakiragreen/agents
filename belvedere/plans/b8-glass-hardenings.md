# B8 — glass hardenings

**Status:** OPEN · **Depends on:** B3 · **Staffing:** Builder · opus-high ·
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

- [ ] Footer shows `ttl 300s`; p95 re-measured ≤ 500 ms warm (20 req @ 2 s).
- [ ] A `/hands/worktree` success → next rail load shows the register refreshed;
      the re-walk button does the same on click.
- [ ] The two live collided cards (hexwright, simmy) render **zero** fire wiring
      (B3's structural grep), note + copy intact; an uncollided session baton
      keeps its buttons; pinned in `rail.test.ts`.
- [ ] Induced post-create failure → workspace closed, audit line carries the
      unwind, `cmux workspace list` clean.
- [ ] `bun test belvedere/glass` — all green, one process.
- [ ] `bunx tsc --noEmit` exits 0 against the pinned deps; `git status` clean but
      for the intended files.

## Out of scope

Shelf/gauges/inbox/composer (B5–B7) · any rail redesign · canon's `doctrine/`
(the walk's own cost rides the canon inbox) · rig ground.

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b8-glass-hardenings.md,
and build the order.
```
