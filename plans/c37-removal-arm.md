# C37 — the removal arm

**Status:** OPEN — laid 2026-08-31 (G2) · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Parallel-safe with:** C36 (disjoint files: `lab/08/` vs `doctrine/`)

## Mission

C29's one surviving deliverable lands on master's harness. 13-F1's guard proves
`lab/08/run` follows a `presets.tsv` row **addition**; it does not prove it follows a
**removal** — which is exactly why C25's dispatcher retirement took the harness 1 → 15
red and nothing caught it. C29 built the arm on `bv/c29-summon-harness`; that branch was
rejected at [G2](g2-c29-merge.md) (1-red and superseded in every conflicting hunk), and
this arm is the only thing on it master does not already have, better.

The work is **already written and already proven green** — see the graft below. This
charge exists because G2's fence forbids new harness arms, not because the question is
open.

## Inputs — read before working (do not re-derive)

- [plans/g2-c29-merge.md](g2-c29-merge.md) F4 — the verification that produced the graft
  below, including the one adaptation master requires.
- [plans/c29-summon-harness.md](c29-summon-harness.md) — the charge the arm was built
  for; spec item 4 is this arm. **Read master's copy for the mission; the branch copy is
  the evidenced one but its repair is superseded.** Do not merge the branch.
- `lab/08/run` — the addition arm it pairs with, ending at
  `check '...which is the scratch preset appearing in both'`.

## Spec

Graft the block below into `lab/08/run` immediately after the addition arm's last line
(`check '...which is the scratch preset appearing in both' '● [w]arden' …`) and before
the `presets_read $RIG/presets.tsv $RIG/accounts.tsv` line that restores the rig's data.

Verbatim — this is the C29 arm with the one adaptation master requires (`$(( $(items_expected) - 1 ))`,
because the selected mantle's furniture brightens since `6724213`, so its bracket is not `fg=8`):

```zsh
# ...and the arm the addition arm did not cover: a preset REMOVED. C25 retired `d
# dispatcher` from the data file and this harness went 1 → 15 failures (C29), because the
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

- [ ] `./lab/08/run` → **215 PASS · 0 failure(s)**, pasted (master's 210 + this arm's 5).
- [ ] The four PASS lines of the arm itself pasted.
- [ ] `bv/c29-summon-harness` deleted — its last live value is now on master. Record the
      sha (`f160ec1`) in the findings before deleting; the board row keeps it too.
- [ ] BOARD.md: C37 row reconciled; the C29 row's "removal arm → C37" clause struck with
      a dated note.

## Out of scope

- Any other C29 branch content — it is superseded (G2 F3). Do not merge the branch.
- c29's F4 (the typed-literals arm) — still a finding for the next charge that opens
  `lab/08`.
- `presets.tsv` changes, new summon behavior, the v1.1-parity block master retired.
  Creep is a bug.

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 + ~/code/agents/BOARD.md
and execute the charge at ~/code/agents/plans/c37-removal-arm.md.
```
