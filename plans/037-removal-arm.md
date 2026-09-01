# 037 — the removal arm

**Status:** LANDED 2026-08-31 — laid 2026-08-31 (G2) · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Parallel-safe with:** 036 (disjoint files: `lab/008/` vs `doctrine/`)

## Mission

029's one surviving deliverable lands on master's harness. 013-F1's guard proves
`lab/008/run` follows a `presets.tsv` row **addition**; it does not prove it follows a
**removal** — which is exactly why 025's dispatcher retirement took the harness 1 → 15
red and nothing caught it. 029 built the arm on `bv/029-summon-harness`; that branch was
rejected at [G2](g2-029-merge.md) (1-red and superseded in every conflicting hunk), and
this arm is the only thing on it master does not already have, better.

The work is **already written and already proven green** — see the graft below. This
charge exists because G2's fence forbids new harness arms, not because the question is
open.

## Inputs — read before working (do not re-derive)

- [plans/g2-029-merge.md](g2-029-merge.md) F4 — the verification that produced the graft
  below, including the one adaptation master requires.
- [plans/029-summon-harness.md](029-summon-harness.md) — the charge the arm was built
  for; spec item 4 is this arm. **Read master's copy for the mission; the branch copy is
  the evidenced one but its repair is superseded.** Do not merge the branch.
- `lab/008/run` — the addition arm it pairs with, ending at
  `check '...which is the scratch preset appearing in both'`.

## Spec

Graft the block below into `lab/008/run` immediately after the addition arm's last line
(`check '...which is the scratch preset appearing in both' '● [w]arden' …`) and before
the `presets_read $RIG/presets.tsv $RIG/accounts.tsv` line that restores the rig's data.

Verbatim — this is the 029 arm with the one adaptation master requires (`$(( $(items_expected) - 1 ))`,
because the selected mantle's furniture brightens since `6724213`, so its bracket is not `fg=8`):

```zsh
# ...and the arm the addition arm did not cover: a preset REMOVED. 025 retired `d
# dispatcher` from the data file and this harness went 1 → 15 failures (029), because the
# guard above only ever proved growth. A middle row is deleted, so order must follow too.
presets_read $RIG/presets.tsv $RIG/accounts.tsv
typeset -i ITEMS_FULL=$(items_expected)
F1R=$LAB/out/f1-removal-sandbox
mkdir -p $F1R/log
cp $RIG/summon.zsh $RIG/accounts.tsv $F1R/
grep -v $'^b\tbuilder\t' $RIG/presets.tsv > $F1R/presets.tsv
presets_read $F1R/presets.tsv $F1R/accounts.tsv
( cd $THEATER/atelier && zsh -f $LAB/render.zsh $F1R 200 a fable high 1 2 ) > $LAB/out/f1-removal-panel.txt
plain f1-removal-panel.txt
line 'a preset deleted from the data file leaves the row the harness derived from it' 1 \
	"$(mantle_row a)" $LAB/out/f1-removal-panel-plain.txt
count 'and the bracket count follows it down — one per item, derived (bar the selected mantle)' \
	$(( $(items_expected) - 1 )) 'fg=8 ⟨[⟩' $LAB/out/f1-removal-panel.txt
count '...which is the deleted preset gone from the row' 0 '● [b]uilder' \
	$LAB/out/f1-removal-panel-plain.txt
if (( $(items_expected) == ITEMS_FULL - 1 )); then
	print -r -- "  PASS  the derived count fell by exactly one with the row ($ITEMS_FULL → $(items_expected))"
else
	print -r -- "  FAIL  a deleted row left the derived count at $(items_expected), expected $(( ITEMS_FULL - 1 ))"
	(( fails++ ))
fi
```

**If it does not read 215 green, stop and say so — do not tune the arm to fit.** The
graft was verified at `67d73be`; a different number means master moved under it, and
what moved is the finding.

## Done when:

- [x] `./lab/008/run` → **215 PASS · 0 failure(s)**, pasted (master's 211 + this arm's 4 —
      see F2; the total the spec named is exact, its decomposition was off by one).

```
$ ./lab/008/run 2>&1 | tee run.txt | tail -1
0 failure(s)
$ grep -c '^  PASS' run.txt
215
```

- [x] The four PASS lines of the arm itself pasted.

```
--- 013-F1: the harness follows presets.tsv, it does not remember it ---
  PASS  a preset added to the data file lands in the row the harness derived from it (1)
  PASS  and the bracket count follows the data too — one per item, derived (bar the selected mantle) (24)
  PASS  ...which is the scratch preset appearing in both
  PASS  a preset deleted from the data file leaves the row the harness derived from it (1)
  PASS  and the bracket count follows it down — one per item, derived (bar the selected mantle) (22)
  PASS  ...which is the deleted preset gone from the row (0)
  PASS  the derived count fell by exactly one with the row (24 → 23)
```

- [x] `bv/029-summon-harness` deleted at `f160ec10b2d42cfa86a1c7d2e5a9a6d1dadd0e19` — F3.
- [x] BOARD.md: 037 row reconciled; the 029 row's "removal arm → 037" clause struck with
      a dated note.

## Out of scope

- Any other 029 branch content — it is superseded (G2 F3). Do not merge the branch.
- 029's F4 (the typed-literals arm) — still a finding for the next charge that opens
  `lab/008`.
- `presets.tsv` changes, new summon behavior, the v1.1-parity block master retired.
  Creep is a bug.

## Findings

**F1 — the graft landed verbatim and reproduced G2's number exactly.** Inserted into
`lab/008/run` immediately after the addition arm's last line, before the rig restore, with
no edit to the block the spec named — including the one adaptation
(`$(( $(items_expected) - 1 ))`). Commit `6b795b5`. The run at master `b232f05`:

```
$ ./lab/008/run 2>&1 | tee run.txt | tail -1
0 failure(s)
$ grep -c '^  PASS' run.txt
215
```

The arm's own four lines are byte-identical to the ones G2 F4 pasted from its throwaway
worktree — same counts (1 · 22 · 0 · 24 → 23), so nothing moved under the graft between
`67d73be` and here.

**F2 — the spec's total was right; its decomposition was off by one, in both docs.**
`215 PASS` is exact. But "master's 210 + this arm's 5" (this charge's `Done when:`, from
G2 F4's "Master 210 + 5") is wrong on both halves. Master's control, measured before the
graft:

```
$ git log --oneline -1
b9b2d76 E1 ruled: 029 closes, G2 rejected, 037 ignited; 036 verified at the desk
$ ./lab/008/run 2>&1 | grep -c '^  PASS'
211
```

211, not 210 — and `6724213`'s own commit message says `211 green`, so master has read 211
since 2026-08-24. The arm contributes **4** PASS lines, not 5 (`line` · `count` · `count`
· the `ITEMS_FULL` comparison; `plain` asserts nothing). 211 + 4 = 215. Both errors are
in prose only, and they cancel — the number the spec made load-bearing held, so this is a
note for the reader, not a stop. **No harness arm was tuned.**

**F3 — `bv/029-summon-harness` deleted at `f160ec10b2d42cfa86a1c7d2e5a9a6d1dadd0e19`.**
Its last unlanded value, the removal arm, is now on master at `6b795b5`. The sha is
recorded here and on the 029 board row; the branch existed nowhere else (`git worktree
list` showed one worktree, master's).

**F4 — 029's typed-literals arm is still unbuilt and still unclaimed.** Untouched here
per Out of scope; it remains a finding for the next charge that opens `lab/008`.

**F5 — the agents building's lint went `ok` → 1 failure mid-session, and not by this
charge.** The ignition's standing condition named exactly one lint failure city-wide
(`ledger.next`, belvedere, fenced) with the agents building reading `ok`. At the close it
reads two:

```
$ bun doctrine/cli.ts lint .
FAIL  agents  —  3 board(s) · 48/48 rows typed · ledger 2026-08-31 · baton felix ×1 · 47 kickoff(s) · queue 0
      [1×] ledger.row — the parenthetical holds more than a row id (D63f)
           ~/code/agents/LEDGER.md:2402: "grand-architect-19, continued"
```

It arrived with Felix's own commit, landed on master while this charge was in flight —
not with the graft, which touches `lab/008/run` alone:

```
$ git log -S'grand-architect-19, continued' --oneline -- LEDGER.md
b232f05 C22 blessed: three forks ruled (no-prompt bare, colorless launch, venue detect) — gate paid, ignitable
```

The header reads `**2026-08-31 · Grand Architect · fable-max (grand-architect-19, continued)**`; D63f
wants the parenthetical to hold a row id and nothing else. Filed to `ISSUES.md`, not
fixed — it is Felix's entry and beyond this fence. The board rows this charge wrote parse
clean (48/48 typed); both failures are ledger-side.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 + ~/code/agents/BOARD.md
and execute the charge at ~/code/agents/plans/037-removal-arm.md.
```
