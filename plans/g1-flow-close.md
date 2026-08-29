# G1 — flow-1's close gate

**Status:** OPEN — laid 2026-08-29 · **Depends on:** C29; C30; C31; C32 ·
**Staffing:** Architect · fable-high

## Mission

The gate that closes `agents-flow-1` — the Guild's first engine-run batch. Verify the
four landings against their own bars, merge the one worktree, distill what amends the
durable docs, reconcile the board, and hand Felix the verdict card with the batch's
whole truth on it.

## Spec

1. **Verify each landing against its `Done when:`** — evidence read in the charge
   docs, re-run where cheap: `cd ~/code/agents/doctrine && bun test` (C31/C32),
   `./lab/08/run` (C29), a dead-word spot-grep on one of C30's five files. Passing =
   finished — a claim without its pasted evidence is not a landing.
2. **Merge C29's worktree** — instrument verbatim: verify its harness run FINISHED
   green first, then `git -C ~/code/agents merge --no-ff bv/c29-summon-harness`.
   Red after the run is an escalation, never a rewind (D48); record the merge sha on
   the board.
3. **Distill** (DOCTRINE §6.6): findings that amend durable docs land there with
   dated notes; superseded text struck, never rewritten.
4. **Reconcile the board:** statuses, annotations, the flow-1 batch note closed with
   its outcome. Anything unresolved is written as `holds:` on its row (C32's grammar
   if landed; the E-id form in prose otherwise) — a landing that lies by omission is
   the exact disease this flow was built to cure.
5. **Ledger entry**, then the verdict card behind this gate — Felix's, never yours.

## Done when:

- Four rows verified with the evidence named per row; C29's merge sha on the board.
- `doctrine lint ~/code/agents` → 0, or every red named with its expiry.
- Board reconciled; the batch note closed; ledger appended; commits in Felix's style.

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are an Architect at fable-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/MAP.md §5 (the agents-flow-1 note)
and execute the gate at ~/code/agents/plans/g1-flow-close.md.
```
