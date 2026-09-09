# C3 — the grep clock flake

**Status:** LANDED 2026-08-29 · **Depends on:** C2 · **Staffing:** Builder · sonnet-medium

## Mission

Kill the suite's one race. `grep.test.ts`'s 1 ms clock case (`the clock is a bound like any other: it fires, and the group says so`) sets `GREP_TIMEOUT_MS=1` and asserts **every** group timed out — on a loaded machine a small group finishes inside the millisecond, so the assertion is a race, not a bound. Measured (C2's field report, ISSUES 2026-08-29): one failure in ~6 whole-suite runs, zero in 40 isolated runs. A flaky test poisons every future "all green in one process" bar.

## The spec — the ruling is the field report's own fix

Assert the bound, not the race: a group that did **not** finish says `timedOut` (and reports 0 honest hits, no error — B21's law); a group that finished inside the clock is legal. At least one group must still prove the timeout path fires — keep the probe honest by making the corpus arm large enough that it cannot finish in 1 ms, or assert over the groups that do report `timedOut`.

## Done when:

- `cd belvedere/glass && bun test grep` green ×20 consecutive runs (the flake's own measurement bar), full suite green once in one process.
- The test still fails if the timeout path stops reporting `timedOut` (do not weaken it into vacuity — an assertion that can pass with zero timed-out groups is a kill criterion: STOP and rework).
- Commit by explicit paths (§5).

## Out of scope

`grep.ts` itself — the fix is the test's (the field report's verdict, ruled by the Architect 2026-08-29). Everything else.

## Findings

Fixed in `grep.test.ts` only (`grep.ts` untouched, per out-of-scope): the docs group's corpus now carries one file, ~17 MB of non-matching filler (under the 20 MB size bar), so a 1 ms clock cannot finish scanning it — measured 7-19 ms a run on the machine that raced, 20x the budget. The test asserts the bound (`timedOut ⟹ 0 hits, no error`) over every group, and separately that at least one group actually timed out (the vacuity guard). `bun test grep` green ×20 consecutive, full suite (`bun test`) 669 pass / 0 fail in one process, `bunx tsc --noEmit` clean.

**One finding that binds anyone else writing a timeout probe against these three corpora: `rg` parallelises across the files in one corpus, so a fast match in a small sibling file streams out and is counted even while a slow sibling file in the *same* group is still being killed by the clock.** An earlier draft of this fix put the slow filler file alongside `BOARD` (which matches) in the same group's file list — the group still reported `timedOut: true` but `hits.length === 1`, because `BOARD`'s match was flushed to the pipe (and read) well before the 1 ms timer's `proc.kill()` landed on the whole process. The fix is to give the slow arm its own corpus with no match anywhere in it, never mixed with a file that matches. Commit `7ab4f8a` on `master`.

---

```
You are a Builder at sonnet-medium.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the charge at ~/code/agents/belvedere/plans/c3-grep-clock.md —
the suite's one race dies.
```
