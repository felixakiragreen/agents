# B3 — the baton rail

**Status:** OPEN · **Depends on:** B4 (hands endpoints) · **Staffing:** Builder ·
opus-high · **Batch 3:** second row, strictly serial, straight to master
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

- [ ] The rail lists the real city's batons — hand-verified against every ledger
      tail `doctrine/` can read (count + three spot quotes).
- [ ] A real fire from the rail lands a stamped probe session in cmux, summons as
      first user turn (transcript quoted); probe cleaned up.
- [ ] A `fire <row-id>` baton resolves to the work doc's fence — shown.
- [ ] A fork renders its options with the recommendation badged (fixture if the
      live city has none).
- [ ] Felix-cards: no fire wiring in the DOM at all — structural proof (grep the
      rendered HTML), not a disabled attribute.
- [ ] `/` p95 ≤ 500 ms warm across 20 requests, register age printed.
- [ ] Copy-summons puts the exact kickoff text on the clipboard (byte-diff).

## Out of scope

- Shelf, gauges, inbox (B5/B6); auto-firing anything; editing batons; websockets.

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b3-baton-rail.md,
and build the order.
```
