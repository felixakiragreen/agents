# 22 — summon rig: the argv summons

**Status:** OPEN — laid 2026-08-28 (GA-11) from Belvedere P2's escalation ·
**Depends on:** ⬡-gate: blessing (rig charges are Felix-tended — D34/D36 precedent;
his UX calls shape the spec before any build) · **Staffing:** Builder · opus-high

## The problem — proven, not hypothesized

P2 proved a summons lands **byte-exact as the FIRST user turn** via argv
(`claude … "$(cat <summons-file>)"`) — but only with the prompt slot free.
`summon/summon.zsh` + `presets.tsv` compose `"/color <c>"` into that slot, so every
mantled ignition burns turn 1 on `/color` and the summons must arrive by paste — and
paste into a live Claude TUI **splits at the first blank line and auto-submits
paragraph 1** (P2 §T4 — the 359-ignition gap, reproduced; 370 ignitions logged at the
sweep). Evidence:
[belvedere/plans/p2-spawn-recipe.md](../belvedere/plans/p2-spawn-recipe.md)
§S3, §T4. `summon/**` is canon ground — not Belvedere's to rule (their escalation,
correctly filed).

## The shape (to be blessed, not yet law)

The summons composes into the positional prompt; color leaves the prompt and rides
venue-native mechanisms:

- **cmux venues:** cmux owns workspace color natively
  (`workspace-action --action set-color`).
- **Non-cmux venues:** color by flag if the CLI carries one, else post-launch send,
  else dropped with the drop named in the panel preview.

## Forks for Felix at blessing

1. Does bare mode (no mantle) keep its current no-prompt shape? (Presumably yes —
   nothing to compose.)
2. When no color mechanism exists at a venue, is a colorless ignition acceptable, or
   does the panel warn?
3. Does the preset TSV grow a venue column, or does the rig detect cmux at ignition
   time?

## Constraints inherited

- 13's name-stamp and 14's theater cycle stand — this charge touches composition only.
- Serial with any other rig charge by physics (shared `summon/summon.zsh` + `lab/08`);
  charge 11 remains deferred — whoever unshelves it rebases onto this if this lands
  first.
- `lab/08/run` extends; no assertion weakened (the 200-green baseline holds or the
  delta is named).

## Findings

*(append here)*

---

**Kickoff (verbatim — ignite only after Felix's blessing amends or confirms the shape
above):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then execute the charge at ~/code/agents/plans/22-summon-argv.md.
```
