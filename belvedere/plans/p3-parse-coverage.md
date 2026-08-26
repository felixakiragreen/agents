# P3 — parse coverage

**Status:** OPEN · **Depends on:** — · **Staffing:** Digger · opus-high ·
**Parallel-safe with:** P1, P2

## Questions

1. Can lean parsers extract, from every live doctrine repo's ACTUAL files: board
   tables, the ledger tail entry, fenced kickoffs/batons, the decision queue
   (`pending Felix countersign`), ISSUES entries? Deliverable shape: a coverage
   table, repo × artifact → parsed | failed (why, with the verbatim excerpt).
2. Where prose fights the parser: the fold-candidate list — for each failure class,
   the minimal FORMAT amendment that would dissolve it (the rework mandate,
   [README §1](../README.md)); never a parser special case.
3. The glass's data shape: propose the parsed-output JSON per artifact — the build
   rows consume this.

## Inputs — read before working

- [README](../README.md) §1 (parser-as-lint, the rework mandate);
  [DOCTRINE](../../canon/work/DOCTRINE.md) §§2, 4, 5, 7, 8 — the formats are the
  spec.
- Known corpus, pre-listed — extend by discovery (under `~/code/`,
  `~/code/universal_robots_sdk/`, and `~/.claude*/projects/` slugs; list everything
  scanned): `~/code/agents` (+ `belvedere/`), `~/code/hexwright`,
  `~/code/universal_robots_sdk/cap-mega/simmy` + sibling cap-mega boards (snappy,
  manny, cornerizer, node-param, units),
  `~/code/universal_robots_sdk/cap-mega/felix/spacex-dashboard-c2`,
  `~/code/universal_robots_sdk/bob`, `~/code/rooted` (arborist archive),
  `~/code/my_checklist`.
- Stack: bun (canon D59). Parsers in `lab/p3/` are disposable probes; the glass's
  real parsers are a build row cut ON these findings.

## Method

One parser per artifact class, doctrine-format-strict; run over the corpus; every
failure recorded with file§ and the verbatim offending excerpt; classify each: (a)
the doc violates doctrine — candidate ISSUES entry for THAT repo, listed in
findings only (you file nothing outside this repo); (b) the doctrine format is
parser-hostile — fold candidate, question 2; (c) variance the doctrine permits —
the glass must handle it. Control (DOCTRINE §6.2): a synthetic conforming fixture
per artifact — a parser failing its own fixture indicts the parser, not the corpus.

## Kill criteria

- More than half the live boards need per-repo special-casing → STOP: the finding
  IS the escalation — the format question goes to Felix and the Grand Architect
  before any glass build row is cut.

## Deliverables

Findings below — coverage table, failure excerpts, fold-candidate list, proposed
JSON shapes — plus `lab/p3/` parsers, status current, commits.

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/p3-parse-coverage.md,
and execute the brief.
```
