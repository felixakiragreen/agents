# G2 — c29's merge gate

**Status:** OPEN — laid 2026-08-31 · **Depends on:** — · **Staffing:** Architect · opus-high ·
**Parallel-safe with:** C36

## Mission

C29's landing comes home. The summon-harness repair is complete on
`bv/c29-summon-harness` @ `f160ec1` and was stranded when agents-flow-1 was
abandoned (belvedere D22) — G1, the gate that would have merged it, is KILLED.
Master's `lab/08` harness has stood 15-red since C25's preset retirement. Verify,
merge, reconcile.

## Inputs — read before working (do not re-derive)

- [BOARD.md](../BOARD.md) — the C29 row and this one.
- `plans/c29-summon-harness.md` — the branch's copy is the evidenced one (findings
  + Done when live on the branch; master's copy is stale-OPEN by design).
- DOCTRINE §4 (gates: verify THEN merge; Passing = finished) and §10 (no shared
  branch is ever rewound — red after a premature merge is an escalation, D48).

## Spec

1. **Control first:** run `./lab/08/run` on master — expect the 15-red (proves the
   harness can fail; a green control here is itself an escalation).
2. **Verify on the branch:** run `./lab/08/run` from a checkout of
   `bv/c29-summon-harness` — the run has FINISHED green before any merge.
3. **Merge:** `git merge --no-ff bv/c29-summon-harness`. The known collision is
   `LEDGER.md` — the branch carries c29's own entry. Resolve by keeping master's
   tail intact and appending the branch's c29 entry at the tail verbatim, with a
   dated note that the merge landed 2026-08-31. Append-only law: no history
   rewrite, no force-push, ever.
4. **Post-merge:** `./lab/08/run` on master — green, pasted. Verify c29's charge
   doc arrived reading LANDED; reconcile the BOARD.md rows — C29 →
   `LANDED — MERGED <sha>`, G2 → `LANDED — MERGED <sha>`; delete the branch.

## Done when:

- [ ] Master control run pasted (15-red before).
- [ ] Branch run pasted (green, FINISHED).
- [ ] Post-merge master run pasted (green).
- [ ] BOARD.md C29 + G2 rows reconciled; `bv/c29-summon-harness` deleted.
- [ ] Ledger appended (the gate's own entry).

## Out of scope

- `presets.tsv` changes and new harness arms — c29's F4 (the typed-literals arm)
  stays a finding for the next charge that opens `lab/08`. Creep is a bug.

## Findings

*(append here — evidence-grade)*

---

**Kickoff (verbatim):**

```
You are an Architect at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/BOARD.md
and execute the gate at ~/code/agents/plans/g2-c29-merge.md.
```
