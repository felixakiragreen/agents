# C29 — the summon harness, after the dispatcher preset

**Status:** OPEN — laid 2026-08-29 · **Depends on:** — · **Staffing:** Builder · opus-high

## Mission

`lab/08/run` goes green again on a `presets.tsv` that no longer carries a dead mantle.
C25 retired the `d dispatcher` preset — D71 killed the mantle, and a dead mantle must not
be summonable from a rig Felix uses daily. The harness did not follow: **13-F1's guard
derives the fixture, not the script.**

## The evidence — measured at C25's landing

`./lab/08/run` on the retired preset: **1 → 15 failures.** The pre-existing 1 is
`grey reaches the terminal as \e[90m (live pty)` and is unrelated (it fails on the
baseline too, in this environment). The 14 new ones fall in three classes:

1. **The drive script presses `d`.** `lab/08/drive.exp` T6/T9/T10/T11 select the
   dispatcher preset and then override its model and effort (`h`, `k`) — the chain that
   proves cascade-plus-single-field-override. With `d` unbound the whole chain drifts.
2. **Three assertions name the stamps it produced** — `dispatcher-hive-01/02/03` in
   `lab/08/run` (the sticky-state block), plus the lineage-order assertion that counts
   them.
3. **Two wrap assertions are column-sensitive to the item list** —
   `● [A]rchitect·max  ● [d]ispatcher  ● [b]uilder` at 60 columns, in both the rendered
   panel and the live-pty narrow run. Removing an item moves the wrap point, so these
   must be re-derived from a real render, not edited by eye.

## The spec

1. **Retarget the drive**, don't restore the preset. Pick a surviving preset whose
   model/effort differ from the override keys the chain exercises, so the cascade and
   single-field-override assertions still bite; say in a comment which preset was chosen
   and why it preserves the proof.
2. **Re-derive the two wrap assertions from a real render** (`render.zsh` and the live
   60-column pty), never by hand-counting columns.
3. **Assertion count may not fall.** The baseline is 200 (charge 14). If an assertion is
   genuinely retired with the preset, name it in the findings with the reason and say
   what replaces its coverage.
4. **Widen 13-F1's guard while you are in here — the finding it was built for just
   escaped it.** The guard proves the harness follows a `presets.tsv` *row addition*; it
   does not prove it follows a *removal*. Add the removal arm: delete a preset in a temp
   copy, and assert the harness's counts follow rather than its assertions breaking.
   That is the arm that would have caught this.

## Done when:

- `./lab/08/run` → the pre-existing environmental failure only (name it), zero others.
- `summon/presets.tsv` still carries no `dispatcher` row, and no assertion names one.
- Assertion count ≥ 200; any retirement named with its reason.
- The removal arm of the guard proved both ways (green here, red on a pre-C29 harness).

## Out of scope

Any change to `summon/summon.zsh` behavior. Minting a replacement preset on the freed `d`
key — that is Felix's taste (it is a key on his daily panel) and would ride charge 22 or
his word, not this repair.

## Findings

*(append here)*

---

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the charge at ~/code/agents/plans/c29-summon-harness.md —
the harness follows the presets file, additions and removals alike.
```
