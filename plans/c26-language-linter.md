# C26 — the language linter

**Status:** OPEN — laid 2026-08-29 · **Depends on:** C24 · **Staffing:** Builder · opus-high

## Mission

`doctrine lint` grows a vocabulary arm: the graveyard, the spelling lexicon, the
id-prefix table, the pinned formulas — so speech drift is caught the way format drift
already is. The standard names its own enforcement (§8): ancestor manny's
smuggler-words rules (M13), food `lab/21/lexicon.json`, venue `doctrine lint`.

## Inputs — read before working

- `canon/work/STANDARD.md` — §8 the language law (spelling ruling, acronym law,
  enforcement clause) · §9 the graveyard · §7 the id namespace · the pinned 24.
- `lab/21/lexicon.json` — the census food: 3,066 terms with senses, forms, and
  collision sites (tells the arm which surface senses are NOT the Guild's — e.g. a
  UI "row" is not a board unit).
- manny's M13 smuggler-words rules — the ancestor; read it in cap-mega's manny and
  cite the birthplace in the findings.
- `doctrine/src/lint.ts` + C24's grammar — the arm extends them.
- C25's fence list (its charge doc §2) — the arms share one fence.

## The spec — blessed D71 ⬡✓ 2026-08-29; this map applies it

1. **The graveyard arm:** dead words (word-bounded; the forms from the graveyard
   table) on law surfaces → a failure naming the successor. Quotes and historical
   ids exempt.
2. **The spelling arm:** American, exception list {grey, greys, greyed}; -ize with
   it; word-by-word per the standard. The enforcement list is data in `doctrine/`,
   with a **drift test asserting the data matches STANDARD.md** — the standard stays
   the single home; the code mirrors it and the test is the alarm.
3. **The prefix arm:** canon reserves D · F · E · G · GA- · FC- (+ C now); campaign-
   scoped decisions write `‹prefix›-D‹n›`; bare D# outside the canon register →
   warning; one letter, one kind, per building — collisions reported, never
   auto-fixed (re-declaring is that campaign's own act, standard §2).
4. **The formula arm — stretch, with a kill criterion:** the pinned 24 as exact
   strings; detect near-verbatim drift (a line sharing a formula's distinctive
   word-run with variation). Kill: if false positives drown signal on the city corpus
   (spot-audit n ≥ 20, precision < 90%), land arms 1–3 and file the formula arm as a
   finding with the evidence — a documented kill is a win.
5. **The scope fence:** law surfaces only — C25's live list; voice surfaces (Logs,
   SAPHO) and history exempt by construction; lore registers are legal on voice
   surfaces (standard §5/§8).
6. **Venue:** an arm of `doctrine lint` (flag or default — the session's call, named
   in the findings), CLI + tests.

## Done when:

- Suite green with fixtures per arm (dead word · spelling · prefix · formula if it
  survives its kill criterion).
- The drift test binds the code's data to STANDARD.md — edit the standard, the test
  goes red; proven once inside the suite.
- A city run post-C25 pasted: counts per class, fences honored, spot-audit ≥ 90%
  precision on n ≥ 20; residues classified — real hits become filed tickets. **The
  linter never edits the city.**
- `doctrine lint ~/code/agents` stays 0 — this repo is already respelled; the tool
  must agree.

## Out of scope

Editing any building's text (report, never rewrite). The formula arm past its kill
criterion. History and voice surfaces. New lint arms the standard doesn't name.

## Findings

*(append here)*

---

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/canon/work/STANDARD.md §8–§9 (blessed law, D71)
and execute the charge at ~/code/agents/plans/c26-language-linter.md —
the linter learns to hear the standard.
```
