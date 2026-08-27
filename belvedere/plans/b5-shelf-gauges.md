# B5 — the shelf and the gauges

**Status:** OPEN · **Depends on:** B4 (resume fires through hands) · **Staffing:**
Builder · opus-high · **Batch 3:** third row, strictly serial, straight to master
**Spec blessed:** 2026-08-26, Architect (G1), on P4 §R + B2 F1/F3 + row-10's rig
usage panel.

## Goal

Any session, any account, live or weeks dead — one click to stand in it. And the
bill on the wall: usage ×3 and WIP, because a one-click dispatcher that hides the
load is how a sovereign DoS's himself.

## Spec

1. **Shelf** (`/shelf`): enumerate `~/.claude*/projects/<slug>/*.jsonl` across all
   three accounts (dirs from `summon/accounts.tsv`). Identity per B2 F1: the
   name-stamp comes from the transcript's `agent-name` line, scanned in a bounded
   64 KB head window — **never joined out of `invocations.jsonl`** (carries no
   session id). Show: stamp/unstamped, building (by cwd), account, age, live/dead
   (census + `kill -0` where live). Filters: building, account, age. Resume =
   `POST /hands/fire` with the P4-proven resume recipe (uuid; by-stamp where the
   stamp is current).
2. **Usage strip**: render `summon/log/usage/` ×3 (row-10 fetcher's files —
   **render only, never fetch**; the rig owns fetching). Stale files → greyed
   with age shown (the D41 palette law's spirit: staleness greys furniture, never
   figures).
3. **WIP gauges**: from census — live sessions per account and per building;
   subagent counts (`aid`/`at`); background tasks from `bg` — **never rendered as
   exhaustive** (B1 caps `bg` at 16; label "16+" at the cap). Per B2 F3: extend
   `census.ts` to surface `ws sf aid at bg` (one line each; the tests name them).
4. Everything degrades honestly: census absent → shelf still lists transcripts,
   gauges say "census not deployed".

## Acceptance criteria / DoD — evidence pasted here at build time

- [ ] Shelf resumes one dead session from EACH of the three accounts (three
      transcripts quoted resuming under the right `CLAUDE_CONFIG_DIR`).
- [ ] A renamed/unstamped session renders unstamped — honest, shown.
- [ ] Usage strip figures match the rig's own panel for the same instant
      (side-by-side capture ×3 accounts).
- [ ] Gauges match a hand-count (`ps` + census) at capture time; the 16-cap
      renders as "16+".
- [ ] Worktree-slug transcripts (sessions whose cwd was a worktree) appear and
      attribute to the right building.
- [ ] Zero writes outside `belvedere/glass/` + census dir (git status proof).

## Out of scope

- The inbox (B6); fetching usage; historical charts (dessert feeds later);
  deleting or editing transcripts (never).

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b5-shelf-gauges.md,
and build the order.
```
