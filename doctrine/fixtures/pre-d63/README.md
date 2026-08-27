# pre-D63 fixtures — `doctrine migrate` inputs

The grammar as the field wrote it before the schema fold (D63). Each defect here is one
migrate rule's, so the suite can assert what the converter fixes AND what it refuses:

- `board.md` — `Felix` staffing, an em-dash rider, `DONE`/`PENDING`/`PASSED`/`BLESSED`/`MERGED`
  leading the Status cell. Migrates to zero failures.
- `ledger.md` — the overloaded parenthetical (D63f's tier slot). Migrates to zero failures.
- `decisions.md` — hexwright's pre-doctrine head. Migrates to a form-correct entry with ONE
  failure left standing: the source carries no decider, and a converter that invents one is
  paraphrasing. `decision.attribution` is the honest residue, asserted by the suite.

Not here, deliberately: pre-D63 ISSUES entries and pre-D45 summons lines. `doctrine migrate`
refuses both on principle (see `src/migrate.ts`), and the suite asserts the refusal.
