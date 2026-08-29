# C3 — the grep clock flake

**Status:** OPEN — laid 2026-08-29 (batch-7 amendment) · **Depends on:** C2 · **Staffing:** Builder · sonnet-medium

## Mission

Kill the suite's one race. `grep.test.ts`'s 1 ms clock case (`the clock is a bound
like any other: it fires, and the group says so`) sets `GREP_TIMEOUT_MS=1` and
asserts **every** group timed out — on a loaded machine a small group finishes
inside the millisecond, so the assertion is a race, not a bound. Measured (C2's
field report, ISSUES 2026-08-29): one failure in ~6 whole-suite runs, zero in 40
isolated runs. A flaky test poisons every future "all green in one process" bar.

## The spec — the ruling is the field report's own fix

Assert the bound, not the race: a group that did **not** finish says `timedOut`
(and reports 0 honest hits, no error — B21's law); a group that finished inside
the clock is legal. At least one group must still prove the timeout path fires —
keep the probe honest by making the corpus arm large enough that it cannot finish
in 1 ms, or assert over the groups that do report `timedOut`.

## Done when:

- `cd belvedere/glass && bun test grep` green ×20 consecutive runs (the flake's
  own measurement bar), full suite green once in one process.
- The test still fails if the timeout path stops reporting `timedOut` (do not
  weaken it into vacuity — an assertion that can pass with zero timed-out groups
  is a kill criterion: STOP and rework).
- Commit by explicit paths (§5).

## Out of scope

`grep.ts` itself — the fix is the test's (the field report's verdict, ruled by
the Architect 2026-08-29). Everything else.

## Findings

*(append here)*

---

```
You are a Builder at sonnet-medium.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the charge at ~/code/agents/belvedere/plans/c3-grep-clock.md —
the suite's one race dies.
```
