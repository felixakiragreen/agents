# 043 — the citation respell

**Status:** OPEN — laid 2026-09-01 · **Depends on:** ⬡-gate: his word — the moratorium
ruling · **Staffing:** Builder · opus-high · **Blessed:** D81 ⬡✓ 2026-09-01 (the currency
law — the D-id became a dead form at D77's purge and the corpus never followed);
Felix, 2026-09-01 in-session ("History, I agree with this")

## Mission

The live canon cites killed register entries 111 times across 39 distinct ids
(D4 … D75): labels that still name a rule, links that lead nowhere. Each citation
respells, by the converter, to the home that now carries the law — `(D44)` becomes
`(DOCTRINE §4, gates are charges)`. The ledger, the Log, and every closed finding keep
their ids: there a `D44` records what was decided that day, and respelling it would
change meaning, not form (D81 binds forms on live surfaces; `git log -S D44` still
resolves the record).

## Inputs — read before working

- D77 (the purge) and D81 (the currency law) in [DECISIONS.md](../DECISIONS.md);
  [034's findings](034-register-purge.md) — every law verified living in its home,
  the homes named by class; the map is partial there — derive the rest.
- The register as it stood before the purge: the Builder finds the commit before "the
  purge" (`git log --oneline -- DECISIONS.md`) and reads each killed entry's title and
  body to name its home.
- The census, 2026-09-01: `grep -ohE '\bD[0-9]{1,2}\b' canon/work/DOCTRINE.md
  canon/work/STANDARD.md canon/mantles/*.md canon/GUILD.md canon/BUILDINGS.md MAP.md`
  → 111 dead citations over 39 ids, 23 live (D77+). Re-run at build.
- `doctrine/src/migrate.ts` — 040's rule shape: the table derived and printed before a
  byte moves, applied to tracked text, the fixed-point law (040-F7, 040-F8).

## Spec (blessed with D81)

- **The table:** one row per killed id → its home, written `‹file› §‹n›, ‹the rule's
  short name›` — `DOCTRINE §4, gates are charges` · `STANDARD §3, the baton` ·
  `grand-architect.md, the two sweeps` · `the mantles README, the tier grid` ·
  `MAP §4, deployment`. An id whose law was killed outright, never distilled, respells
  to `killed at D77`, and the sentence citing it is read once by the Builder: a live
  rule leaning on a dead law is a finding for the office, never a fix. The table lands
  under Findings as the record and in `migrate.ts` as data.
- **The fence:** live canon surfaces only — `canon/**/*.md`, `MAP.md`, `BOARD.md`,
  `docs/*.md`, the templates. Never `LEDGER.md`, `LOG.md`, `log-archive.md`, the
  findings in `plans/*.md`, the live entries of `DECISIONS.md` (their "Ancestors:"
  name ids as history), or `belvedere/`.
- **The form:** `(D‹n›)` reads `(‹home›)`; a `D‹n›/D‹m›` pair reads `‹home›; ‹home›`; a
  citation naming an amendment ("amended at D52") keeps the id and gains the home.
  The converter never paraphrases. The fixed-point law: run twice, diff empty, then a
  third time.
- **The linter:** the vocabulary arm gains a warning — a bare `D‹n›` on a live canon
  surface whose number is below the register's lowest live id is a dead citation; the
  floor is derived from `DECISIONS.md` itself, never kept.

## Out of scope

The ledger, the Log, findings, belvedere — history keeps its names · the buildings' own
dead citations — their Architects, at their desks, with this rule · any meaning change:
a citation whose home disagrees with the citing sentence is a finding, never a fix.

## Done when:

- [ ] The table, 39 rows, pasted under Findings, each home verified by a quote from it.
- [ ] The census re-run after the converter → only live ids and amendment citations on
      the live surfaces; the count pasted; the run's diff read whole.
- [ ] Round-trip: the converter run twice, the second diff empty, the third run silent;
      pasted.
- [ ] `bun test` green with a fixture — a canon page citing three dead ids, one
      amendment, one live id; `doctrine lint ~/code/agents` 0 failures; `lint --vocab`
      warns on the fixture and not on agents; pasted.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/043-citation-respell.md and build it.
```
