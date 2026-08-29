# C31 — doctrine v1.2: the defects

**Status:** OPEN — laid 2026-08-29 · **Depends on:** — · **Staffing:** Builder · opus-high

## Mission

Three measured defects in `doctrine/` die, each with a fixture that proves it and a
guard that keeps it dead. Every one arrived through the inbox with a repro (swept at
GA-15 — git keeps the bytes; the evidence is restated whole below, so this doc stands
alone).

## Inputs — read before working (do not re-derive)

- [plans/c25-respell-sweep.md](c25-respell-sweep.md) §Findings F1/F2 — the stale-parse
  lie and the house dialects, measured on whiteboardy.
- [plans/c26-language-linter.md](c26-language-linter.md) §Findings F1 — the prefixed-D
  blind spot, measured on bob.
- `doctrine/README.md` · the count-regression guard (C24's) · the round-trip law as
  read at charge 16 F1 (declared-changes + identical-otherwise + byte assertion).

## Spec

1. **`migrate`'s stale-parse lie.** Every rule fires off ONE parse of the pre-migration
   document, so a head rule that changes entry boundaries poisons every later field
   rule: on whiteboardy the head rules took the ledger 5 → 127 parsed entries, and
   `ledger.unrecorded-clauses` — computed against the 5-entry parse — appended
   `Decided: unrecorded.` / `Next: unrecorded.` into **61 entries carrying a real
   clause**, while the round-trip law printed `ok` throughout (`decided`/`next` are
   declared-changeable fields). Fix, recommended: **re-parse between rule classes** —
   structure rules run, the document re-parses, field rules run on the fresh parse.
   Fallback, legal if re-parse breaks the round-trip accounting: refuse to fill a
   clause in any entry whose head this same run rewrote. Say which you built and why.
   Fixture: a whiteboardy-shaped ledger whose head rules multiply its entries; assert
   zero false fills and an honest round-trip line.
2. **House-dialect migrate rules.** whiteboardy spells 61 clauses `Decided (<scope>):
   <text>` and 3 `Next — <text>`; `parse` fails them and `migrate` has no rule, so C25
   repaired ~130 clauses by hand. Add both rules: the colon relocation
   (`Decided (<x>): y` → `Decided: (<x>) y` — total, mechanical, byte-preserving) and
   the em-dash head (`Next — <text>` → `Next: <text>`). Form-only under the molt
   clause; fixtures both directions (applies where it should, refuses where it
   shouldn't).
3. **`parseDecisions` reads `‹prefix›-D‹n›`** — the id form STANDARD §7 mandates. The
   candidate regex today (`\*\*[A-Za-z]{1,8}-?\d+[a-z]?`) rejects `PD-D9`, `TH-D11`,
   `LB-D10`, `C-D2`: bob declares **53** decisions in that shape and the reader
   reports **0** — a silent zero. Widen the reader; `decisions` is an entity total the
   count-regression guard watches, so paste before/after city totals and name the
   expected moves (bob 0 → 53 among them). Repro checked in:
   `doctrine/fixtures/vocab/DECISIONS.md`'s `VX-D2`.

## Done when:

- `cd doctrine && bun test` green, count named (≥ the current 71), the three defects
  each red-under-pre-C31 / green-here (the guard's both-ways proof, 13-F1's pattern).
- `doctrine lint ~/code/agents` → **0**.
- City dry-run counts pasted (`doctrine lint ~/code` before/after — movement explained,
  bob's four buildings reporting nonzero decisions among it).
- Belvedere unmoved: its suite green at its own head, byte-diff of its lint output
  before/after explained or empty.

## Out of scope

- New grammar tokens — C32's charge. The vocabulary arm's patterns. Editing any
  building's files: this charge fixes the tool, the city stays still.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7
and execute the charge at ~/code/agents/plans/c31-doctrine-defects.md.
Any D-entry you lay lands marked "(proposed — pending ⬡✓)"; your files and
commits are the deliverable.
```
