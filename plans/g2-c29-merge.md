# G2 — c29's merge gate

**Status:** LANDED 2026-08-31 — REJECTED (E1 ruled by Felix the same day: close C29,
ignite C37 — the salvage landed at `6b795b5`, 215 green; the E1 block below stands as
the record; header reconciled to the row at the GA-19 sweep) · **Depends on:** — ·
**Staffing:** Architect · opus-high ·
**Parallel-safe with:** C36

> **E1 — the gate's premise is falsified; the merge is rejected; the status ruling is
> Felix's.** The control ran green (F1) — the charge doc names that an escalation in so
> many words — because master repaired itself after C25. The branch is 1-red (F2) and
> superseded in every conflicting hunk (F3), so D48 forbids the merge and the rejection
> is ruled here (F5). What waits on him is one word: the C29 status ruling and whether
> the one salvageable piece — the removal arm, laid as [C37](c37-removal-arm.md) and
> already proven 215 green — is worth landing. `bv/c29-summon-harness` @ `f160ec1` is
> kept, not deleted: the reject stays reversible.

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

*(the bar as laid, marked against what the evidence found — see Findings)*

- [x] Master control run pasted — **green, not the 15-red the charge predicted** (F1).
      The charge doc names a green control an escalation: raised as **E1**.
- [x] Branch run pasted — **1 FAIL, not green** (F2). D48 forbids the merge.
- [ ] Post-merge master run — **not applicable: the merge is rejected** (F3, F5).
- [ ] BOARD.md rows reconciled — evidence and recommendation on both rows; the status
      ruling rides E1. `bv/c29-summon-harness` deliberately **kept** (F5).
- [x] Ledger appended (this gate's entry).

## Out of scope

- `presets.tsv` changes and new harness arms — c29's F4 (the typed-literals arm)
  stays a finding for the next charge that opens `lab/08`. Creep is a bug.

## Findings

**F1 — the control ran GREEN, not 15-red: the gate's premise is falsified.**
Master's harness is whole. The 15-red the charge was laid on was repaired on master
itself, by the three summon commits that followed C25's preset retirement:

```
$ git log --oneline --format='%h %ad %s' --date=short -- lab/08 summon/presets.tsv summon/summon.zsh | head -4
6724213 2026-08-29 summon: [t] rides the theater label, selected mantle furniture brightens — 211 green
08a97d0 2026-08-29 summon: label gradient, mantle labels wear their colour, theater row with [t]
7973440 2026-08-29 summon: colours speak real — S0 slot map on the swatch, F fixer preset — lab/08 202 green
5aae447 2026-08-29 C25: agents speaks the standard — … dispatcher preset retired
```

`7973440` restored the item count with the `F fixer` preset and re-derived the
assertions; the two after it grew the panel again. **Master control run, 2026-08-31 @
`67d73be`: 211 PASS · 0 failure(s).**  *(Corrected 2026-08-31 at C37's landing: this
finding first read 210. A piped `grep -c PASS` drops one line; the control is 211 and the
arm adds 4, not 5. The total this gate turned on — 215 — was never in doubt, and no arm
was tuned to reach it. C37 F2.)* C29's mission — "`lab/08/run` goes green again on
a `presets.tsv` that no longer carries a dead mantle" — is **met on master**:

```
$ grep -v '^#' summon/presets.tsv | grep -c dispatcher
0
$ grep -n dispatcher lab/08/run lab/08/drive.exp
(no output)
```

Precedent for a charge's bar cleared by later hands on master: C31's row (its one unmet
`Done when:` bullet, "cleared by later hands — lint reads 0 at 2026-08-31").

**F2 — the branch does not pass: 203 PASS · 1 FAIL.** Verified in a throwaway worktree
at `f160ec1`, twice, same result:

```
  FAIL  grey reaches the terminal as \e[90m (live pty)
          missing: ^[[90m
1 failure(s)
```

C29's `Done when:` accepted this as "the charge's pre-existing environmental failure"
and documented its cause (this environment's zsh emits `fg=8` as `\e[38;5;8m`). **Master
has since fixed it properly** — the assertion now names the code actually on the wire:

```
master  lab/08/run:221  raw 'grey reaches the terminal as \e[38;5;8m (live pty)' $'\e[38;5;8m' $TRANSCRIPT
branch  lab/08/run:210  raw 'grey reaches the terminal as \e[90m (live pty)'     $'\e[90m'     $TRANSCRIPT
```

DOCTRINE §4 / D48 — "**Passing = finished.** The run that proves it has FINISHED … before
the merge executes" — is unmet. **The merge is forbidden, not merely inadvisable.**

**F3 — every conflict resolves to master's side; the merge would regress master.** A
trial `git merge --no-ff --no-commit` in a detached throwaway worktree (master never
touched) conflicts in three files, 6 hunks:

```
LEDGER.md         1 hunk
lab/08/drive.exp  1 hunk
lab/08/run        4 hunks
```

Hunk by hunk, master is strictly newer and better-informed:

| Hunk | branch | master | take |
|---|---|---|---|
| swatch colours | 2 assertions (green, cyan) | 4, named by S0 slot (green/cyan/blue/yellow) | master |
| grey raw code | `\e[90m` — reds | `\e[38;5;8m` — green | master |
| T9–T11 override chain | retargeted to `e` mentat · fable-max | retargeted to `F` fixer · opus-high | master |
| v1.1 byte-parity block | repaired with a new `unwrap()` | **retired on purpose**, with its reason written in | master |

The fourth is decisive: the branch's largest single contribution is a repair to a block
master deleted deliberately — "the panel legitimately outgrew the baseline … the
transplant needed to keep the comparison honest had grown past the code under test."
Merging would resurrect it.

**F4 — one thing on the branch is real, unlanded, and salvageable: the removal arm.**
C29 spec item 4 (13-F1's guard gains its removal arm — "the arm that would have caught
this") exists nowhere on master:

```
$ grep -c 'f1-removal' lab/08/run
0
```

It auto-merges clean (outside every conflict region) and master carries all four helpers
it needs (`presets_read`, `items_expected`, `mantle_row`, `plain`). **One adaptation is
required:** master's addition arm now counts `$(( $(items_expected) - 1 ))` — the
selected mantle's furniture brightens since `6724213`, so its bracket is not `fg=8` —
and the branch's arm, written before that, counts plain `$(items_expected)`.

Grafted with that adaptation and run in the throwaway worktree:

```
  PASS  a preset deleted from the data file leaves the row the harness derived from it (1)
  PASS  and the bracket count follows it down — one per item, derived (bar the selected mantle) (22)
  PASS  ...which is the deleted preset gone from the row (0)
  PASS  the derived count fell by exactly one with the row (24 → 23)

215 PASS · 0 failure(s)
```

Master 210 + 5. The salvage is proven, not predicted — laid as [C37](c37-removal-arm.md)
with the verified graft in the doc. It is **not** taken here: this gate's Out of scope
fences new harness arms, and the fence binds over the charter's side-quest grant.

**F5 — the verdict: REJECT the merge, keep the branch, salvage the arm.**

- **Ruled here** (Architect charter, the review loop — "merge or reject worktree
  branches"; D48 / DOCTRINE §4 "Passing = finished"): **the merge is rejected.** The
  branch is 1-red and superseded in every conflicting hunk.
- **`bv/c29-summon-harness` @ `f160ec1` is NOT deleted.** The spec authorised deletion
  only after a merge; there was none. It stands until C37 lands, and the reject stays
  reversible.
- **Escalated (E1)** — the charge doc's own instruction: "a green control here is itself
  an escalation." What is Felix's is the status ruling on C29, recorded below as a
  recommendation, not taken.

**Recommendation (one word closes it):** C29 → `LANDED — the mission met on master by
later hands (7973440 · 08a97d0 · 6724213); branch REJECTED, superseded; the removal arm
→ C37`. G2 → `LANDED — REJECTED f160ec1`. The alternative, if he would rather the arm
die with the branch: kill C37 and delete the branch — the harness stands 210 green
either way, and only the removal-regression guard is lost.

---

**Kickoff (verbatim):**

```
You are an Architect at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/BOARD.md
and execute the gate at ~/code/agents/plans/g2-c29-merge.md.
```
