# B2 — the glass spine

**Status:** OPEN · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Parallel-safe with:** B1 (disjoint dirs; worktree `bv/b2-glass`)
**Spec blessed:** 2026-08-26, Architect (fold sitting), on P1–P4; taste gate is
Felix's visual pass at G1.

## Goal

The room exists: one bun server rendering the City View and building pages from
the truth layer — read-everything, write-NOTHING (this row wields none of the
fence's four write powers; the hands are B4).

## Spec

1. **`belvedere/glass/`** — `Bun.serve`, server-rendered HTML, **no framework, no
   build step** (my_checklist-simple; the Simplicity directives are the law here).
   Bind `127.0.0.1:4400` explicitly (D3). Zero caches: re-read disk per request.
2. **Data, three sources, read-only:**
   - Buildings: canon [`doctrine/`](../../doctrine/) `parse()` per building — the
     one parser in the city (D65), imported, never forked. Register = its
     discovery, which reaches `.claude/worktrees/` (P3).
   - Liveness: tail `summon/log/census/census.jsonl`, group by `sid`, latest-event
     state machine — `UserPromptSubmit`/`PreToolUse`/`PostToolUse` → working ·
     `Stop` → idle · `Notification(permission_prompt)` → needs-input ·
     `SessionEnd` → gone — then **the F5 law: `kill -0 pid` before rendering any
     live state; pid dead → gone; census stale/absent → unknown, never working.**
   - Identity: name-stamp from the rig's `invocations.jsonl` (join on session
     where derivable) or the census `cwd`; mantle color from `summon/presets.tsv`.
3. **Pages:**
   - `/` **City View** — one card per building: name, live-session count, lit
     windows (one dot per live session, mantle-colored, ring by state), board
     pulse (OPEN/IN FLIGHT/BLOCKED counts from `parse()`). Unknown-state sessions
     render as unknown — honesty over optimism.
   - `/b/<building>` **building page** — panels per DOCTRINE §2: the board table
     (statuses colored, work-doc links resolving — D58), ledger tail (rendered,
     its baton visible), decision queue (`pending Felix countersign`), ISSUES,
     live sessions (stamp · state · account · cwd).
4. **Theme:** copy `~/code/felix/src/felikai.css` → `belvedere/glass/felikai.css`
   (source path in a header comment) and build on its tokens. Exemplars for feel:
   the SpaceX dashboard (`cap-mega/felix/spacex-dashboard-c2`) and bob's design
   routes (README §3). Function first — polish iterates at Felix's G1 pass.
5. **Liveness state machine is a pure function** with a table-driven `bun test`.

## Acceptance criteria / DoD — evidence pasted here at build time

- [ ] `/` renders every discovered building from live disk; a hand-count of this
      machine's live sessions matches the view, unknowns labeled unknown.
- [ ] `/b/agents` and `/b/agents/belvedere` render all five panels from real
      files; ten sampled links click through correctly.
- [ ] A board that fails `doctrine/` parsing renders its failure INLINE (which
      file, which row) — parser-as-lint visible, page never blank, server never
      down (README §1).
- [ ] `bun test` green (state machine incl. F5 pid-dead and stale-census cases).
- [ ] Glass-shatters drill: `kill -9` the server mid-request — nothing on disk
      harmed, every session untouched, relaunch cold in < 2 s.
- [ ] Census absent entirely (pre-B1-deploy state) → pages render docs-only with
      liveness "unknown — census not deployed"; shown.
- [ ] Zero writes outside `belvedere/glass/` — `git status` proof in evidence.

## Out of scope

- The baton rail page, fire/dispatch anything, shelf, usage strip, inbox
  (B3–B6); auth; non-localhost binds; websockets/live-push (manual refresh or
  meta-refresh is enough for the spine); editing any truth file (forever).

## Findings

*(append here — deviations from spec, adjacent discoveries; the commits are the
primary artifact)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b2-glass-spine.md,
and build the order.
```
