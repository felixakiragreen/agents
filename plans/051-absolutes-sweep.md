# 051 — the absolutes sweep

**Status:** OPEN — laid 2026-09-15 · **Depends on:** — · **Staffing:** Architect · opus-high · **Parallel-safe with:** 050 · **Blessed:** Felix, 2026-09-15, in the room (grand-architect-26): ⬢2

## Mission

The live canon speaks D89's language law: *always* and *never* mark what holds in every possible reading — change, permission, prediction — and the rest of the law states its defaults with their exceptions named. At the lay the live canon carried 180 *never* and 19 *always*; the global file's thirteen and the pinned formulas 8 and 26 were respelled at the desk. This charge rules the rest one by one, on 030's form — the master-doc prose sweep: a census, the rulings F1–Fn, the survivors listed by name with their reasons.

## Inputs — read before working

- The law: the global file's head (`canon/CLAUDE.md`), D89, STANDARD §8 (*Absolutes are reserved*).
- `plans/030-master-doc-prose.md` — the sweep's form: census, rulings, named exemptions; its F1–F7 bind the next sweep.
- The surfaces: `canon/GUILD.md`, `canon/work/DOCTRINE.md`, `canon/work/STANDARD.md`, `canon/mantles/*.md` (the tombstone `dispatcher.md` is history — untouched), `canon/work/templates/*.md`, `canon/BUILDINGS.md`, `plans/TENDER.md`, `plans/CODA.md`, `MAP.md`.
- The census at the lay, over those surfaces: `grep -o -w -i -E "never|always" ‹surfaces› | sort | uniq -c` — 166 never · 13 Never · 1 NEVER · 18 always · 1 Always.
- Known, do not re-derive: history and voice are fenced — `LEDGER.md`, `ledger-archive.md`, `LOG.md`, `log-archive.md`, `SAPHO.md`, every Findings section under `plans/`, `belvedere/` — their words stay; the charters' shared summons paragraph is word-identical across five charters (the mantles README, the charter template) and respells in all five at once or in none; the global file's mirror clause already reads *still apply*.

## Method

The rules, pre-chewed:

1. A contrast — `X, never Y` — reads `X, not Y`.
2. Emphasis — *never edited*, *always apply*, *NEVER switched* — drops, or restates in the declarative present: *ids are not reused; a reuse is a defect*.
3. A default with exceptions states the default and names the exception in the same sentence.
4. A true absolute keeps its word and is listed in Findings with the reason it holds in every reading; the expected count is small — the office found none in the canon's own law at the lay, and his one candidate at the desk, tabs, died inside the sitting.
5. A pinned formula is not changed here — 8 and 26 were respelled at the desk and ride 050's converter; any other formula that reads as an absolute is filed as a candidate for the office, untouched.
6. A token's definition (`⬡-gate`, `Next: none`, the lifecycle) is form, not speech — untouched.

Commit per file, in Felix's git style; `doctrine lint .` and `doctrine lint --vocab .` captured before and after.

## Done when:

- `grep -c -w -i -E "never|always"` over the surfaces reads exactly the survivors named in Findings, each with its reason.
- `doctrine lint .` before and after pasted, identical; `--vocab` before and after pasted, every delta named.
- The charters' shared paragraph still word-identical across the five — the diff of the five paragraphs pasted, empty.
- F1–Fn under this doc: the census, the rulings by rule, the survivors, the formula candidates for the office.

## Out of scope

- History and voice surfaces (above); other buildings' master docs — they adopt at their next Architect session with the rules here.
- Any change of meaning: a sentence whose default is unclear without an exception the writer did not name is a finding for the office, not a guess.
- An absolutes lint arm — after this sweep shows the pattern.

## Lanes

Red: the canon edits — blessed by his ⬢2 on this doc at the lay (the blessing covers the scope); a change of meaning is outside it and files as a finding, not an edit.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved it)*

---

**Kickoff (verbatim):**

```
You are an Architect at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/canon/CLAUDE.md, and execute the charge at ~/code/agents/plans/051-absolutes-sweep.md.
```
