# C1 — the fence repoint

**Status:** LANDED 2026-08-29 — status trued 2026-08-30 at the migration sweep (this line read OPEN against a LANDED board row — root inbox 2026-08-29; commits `68b953b`, `ba2ed0b`) · **Depends on:** — · **Staffing:** Builder · sonnet-high

## Mission

The G2 kickoff resolves to its own bytes again. Both flow files point `"fence": 5` in `README.md`; the batch-6 note (a8dd096) added two fences above the batch-4 note, so ordinal 5 is now the batch-6 tender fence and the G2 kickoff is **ordinal 7**. `glass/flow.test.ts` pins the same stale ordinal. ISSUES entry of 2026-08-28 (the row-19 Builder), ruled by this board's Architect at the canon-C27 session: repoint the ordinal, nothing else — the flow hash covers resolved kickoffs, so this ruling is the authorization the files needed.

## The spec — Architect-verified ordinals, 2026-08-29

The README's fences today, in ordinal order: 1 batch-2 · 2 batch-3 · 3 batch-5 · 4 G3 kickoff · 5 batch-6 tender · 6 batch-4 · **7 G2 kickoff** (starts `You are an Architect at fable-high.`, ends `close batch 5.`).

1. `flows/flow-batch-1.flow.json` — the g2 step's kickoff `"fence": 5` → `7`.
2. `flows/flow-close.flow.json` — the g2 kickoff `"fence": 5` → `7`.
3. `glass/flow.test.ts` — the pinned extraction moves with it: `blocks[4]` → `blocks[6]`, the `fence` expectation `5` → `7`, the `blocks.length` floor `5` → `7`.
4. Verify both readings agree about the bytes (the test's own two-way extraction): the resolved text starts `You are an Architect at fable-high.` and ends `close batch 5.`.

**Touch nothing else in the flow files.** The `Felix-gate`/`sitting` prose on the g2 card is a closed batch's record — closed instruments stay verbatim (C25's ruling); only the pointer moves, because a pointer that resolves to the wrong bytes is a render lying, not history.

## Done when:

- `cd belvedere/glass && bun test flow` green.
- Full suite: 650 pass / 1 fail — the one remaining red is `colors.test.ts` (the dead Dispatcher's preset), named here, C2's to fix.
- Commit by explicit paths (§5 two-lane rule).

## Out of scope

Everything else. The positional-fence fragility (B10 F2) stays named-not-built.

## Findings

LANDED 2026-08-29 — Builder, sonnet-high. Verified independently before editing: a regex sweep of README.md's fenced blocks (`^```[^\n]*\n([\s\S]*?)^```` `, gm) found 7 blocks; block 7 starts `You are an Architect at fable-high.` and ends `close batch 5.` — matches the spec's ordinal exactly. Both flow files' `fence` moved 5→7; `flow.test.ts` moved with it (`blocks.length` floor 5→7, `blocks[4]`→`blocks[6]`, `fence` expectation 5→7). Nothing else in the flow files touched — diff is three one-line changes.

DoD evidence:
- `bun test flow`: 30 pass / 0 fail.
- Full suite: 650 pass / 1 fail — the 1 is `colors.test.ts`'s named preset failure (C2's, unrelated).
- Commit `68b953b`, explicit paths (three files only).

---

```
You are a Builder at sonnet-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the charge at ~/code/agents/belvedere/plans/c1-fence-repoint.md —
the G2 kickoff resolves to its own bytes again.
```
