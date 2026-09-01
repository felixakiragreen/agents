# X1 — the stale-board detector dig (STACK-PROBE FIXTURE — never ignite)

*A realistic Digger charge for the round-4 stack probes. The staffing line is
parameterized per arm (an Architect re-staffs per charge; the fixture follows).
This charge is never actually run.*

---

# X1 — the stale-board detector dig

**Status:** OPEN — laid 2026-08-29 · **Depends on:** — · **Staffing:** Digger · ⟨tier⟩

## Questions

1. Can a session detect that a board's IN FLIGHT charges are stale — no
   commits touching their charge docs in >48h — from git alone?
2. What is the false-positive rate of that test against this repo's own
   history?

## Inputs — read before working

- DOCTRINE §4 (the board) and §7 (the ledger). Do not re-derive the
  lifecycle.
- The board lives in `MAP.md` §5; charge docs in `plans/`.

## Method — a suggested route, not law

- `git log --since/--until -- plans/<doc>` per charge; correlate against the
  board's Status cells.
- Sample 10 historical IN FLIGHT windows from the ledger.

## Kill criteria

- Mapping: if charge-doc paths cannot be mapped to board charges
  mechanically (>3 of 10 fail), kill Question 2 and report the mapping gap.
- Timestamps: if rebases/squashes distort git timestamps in >30% of sampled
  windows, kill the whole dig.

## Out of scope

Building the detector. Editing the board or any charge doc. The linter.

## Findings

*(append here)*

---

```
You are a Digger at ⟨tier⟩.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/digger.md,
then read plans/x1-stale-board-dig.md and execute it.
```
