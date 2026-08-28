# 17 — v3: the storage experiment

**Status:** OPEN — brief cut 2026-08-28 (GA-11); Felix-gate PAID 2026-08-28 (Belvedere
v0 + the deck + the flow chapter landed; batch 5 closed — 14 rows, zero kills, 651
tests green; gate called paid by Felix's own summons of this date) ·
**Depends on:** 16 · **Staffing:** Digger · fable-high

## Question

**Does structured-source truth beat schema-markdown for the three consumers — Felix's
hand, a session's cold start, and the glass?** (D65: tested, never decreed — the
verdict is numbers.) One building as lab. The standing ruling under test: *the schema
is the standard; serialization is per-consumer* — doctrine-markdown is the canonical
write surface **until this row dethrones it with numbers**, or confirms it with them.

Sub-questions, each owed a measured answer:

1. **Write + review (Felix's hand):** which arm makes a real change — a row landing,
   a D-entry + countersign, a ledger append — cheaper to write correctly and cheaper
   to review in a git diff? Which arm's hand-edit damage reaches the parser silently?
2. **Cold start (a session):** over a fixed question battery and write tasks, which
   arm yields higher correctness, fewer tokens, and more first-try-conforming writes?
3. **The glass (tools):** which arm carries the fields the city keeps needing as
   data — without heuristics? At what parser cost and with what failure modes?
4. **The line:** if the answer differs per consumer or per genre (flows vs boards vs
   ledgers), where exactly does the line fall? A hybrid verdict is a legal verdict.

## Inputs — read before working (do not re-derive)

- [D65](../DECISIONS.md) — the mandate and the three consumers; [D63](../DECISIONS.md)
  — the markdown grammar under test; [DOCTRINE §§4, 7, 8](../canon/work/DOCTRINE.md).
- The M-arm's field numbers already exist — the 18-wave
  ([plans/18-great-recut.md](18-great-recut.md) §findings): city lint 718 → 310
  post-wave; **14 tool/grammar defect classes filed in one wave**; three silent
  hand-damage classes measured in the wild (blank-line board truncation ×3 sightings,
  unescaped `|`, bold-run orphan, ~38 missing ledger separators in snappy). One strict
  parser held 22 buildings with **zero per-repo special cases** — the counter-arm is
  real and the brief instructs you to weigh it honestly.
- The S-arm's field numbers already exist — Belvedere's flow chapter ran a real batch
  as data: `belvedere/flows/*.flow.json` behind
  [belvedere/glass/flow.ts](../belvedere/glass/flow.ts) — 12 named arm-time refusals,
  sha-integrity arming, append-only event log
  ([flow-keel](../belvedere/plans/flow-keel.md),
  [b10](../belvedere/plans/b10-flow-dag.md), [b11](../belvedere/plans/b11-flow-engine.md),
  [b12](../belvedere/plans/b12-flow-reactive.md)).
- **The case file** — [flow-keel §6](../belvedere/plans/flow-keel.md): six field asks
  where prose carries load the shapes need — `kind` (move/wave/fork), the fork's
  `recommendation`, a row's `branch`, the baton's `holder`/precondition, a landing's
  `holds`, `encapsulation` (the ≤6-word name). Plus the batch-5 close's list (canon
  inbox 2026-08-28, drained at GA-11 — git keeps the bytes): 27 of 38 live rail cards
  had no extractable name; tier renders whole because model·effort is one token;
  `FC-`/`GA-` ids resolve to no artifact; escalations have no field (a regex classifier
  gates 120 of 390 landed rows, 113 on `/escalat/i` alone — including rows whose
  annotations read "nothing escalated"); `parseDecisions` false-pends D21 — the entry
  that *defines* the countersign marker. Every one of these is a datum: something
  markdown-as-truth made a tool guess at.
- P3 §5's JSON shapes are the normative parse of a conforming corpus (D65) —
  `doctrine parse --json` emits them; the S-arm twin starts there.

## The arms

- **Arm M (incumbent):** the lab building's working tree as-is — D63 schema-markdown,
  `doctrine/` as its parser.
- **Arm S (challenger):** the same truth as structured source — JSON per the normative
  shapes, extended ONLY where the case file names a missing field — with a derived
  read-only markdown render (a small script; the render is a view, never written).
  Writes happen in the JSON. The twin is built once from `parse --json` output,
  hand-corrected against the known parser gaps, and its fidelity to arm M is asserted
  before any measurement runs (a diff of re-rendered vs parsed meaning — your control).

**The lab is `~/code/agents`** — the richest corpus, and the one building all three
consumers provably touch today (Felix reads this MAP; sessions cold-start on it by
law; the glass renders it). The twin lives in `lab/17/` and never touches the working
tree. Named fallback if the corpus busts the session budget: `~/code/hexwright`
(small, 0 lint failures) — and the cost that forced the fallback is itself finding #1.

## Method — suggested route, forks named

1. **Build the twin** (arm S) from `doctrine parse --json`; assert fidelity (the
   control above). Record the construction cost — tokens, wall time, hand-corrections
   count: that number is the migration-cost estimate row 18's re-scope needs.
2. **C1 — Felix's hand.** Replay three real, already-landed changes in both arms (pick
   from this repo's history; cite the commits). Report per arm: diff line/hunk counts,
   signal-vs-syntax ratio (changed lines that carry meaning vs delimiters/structure),
   and a side-by-side exhibit for Felix's eyes at review. Damage surface: enumerate the
   wave's silent-damage classes and classify each per arm — *reaches the parser
   silently* vs *refused loud at write*. No new survey needed — the wave's findings are
   the M-arm data.
3. **C2 — cold start.** A fixed battery — ~10 read questions (dispatchability, gates,
   what did D-n decide, where does row X's baton point) + 3 write tasks (a conforming
   ledger entry, a new row, a status flip) — run by dispatched fresh sessions at
   **sonnet-high, ×3 reps per arm** (Agent tool, tier preset verbatim — D47). Same
   battery both arms; grade reads against `parse --json` ground truth mechanically;
   grade writes by lint-clean (M) / schema-valid (S) on first try. Report correctness,
   tokens, conformance. If the signal is ambiguous at n=3, ONE opus-medium
   confirmation rep per arm; never inflate n beyond that.
4. **C3 — the glass.** Score the case-file fields per arm: carryable without
   heuristics? (M: derived render-side or paused per D10; S: a field is a field.)
   Parser cost: `doctrine/` SLOC + the wave's 14 defect classes vs the twin's
   validator SLOC + its refusal classes. Count ambiguity absorbed render-side today
   (the glass's D10 warning cards, the classifier's 120-of-390) as the M-arm's
   standing tax — and count the counter-arm's win the same breath: zero per-repo
   special cases, one parser, every fix city-wide.
5. **Verdict.** Per-consumer numbers → per-consumer verdicts → the recommendation:
   retain / dethrone / **hybrid with the line drawn** (e.g. flows-as-data stands,
   boards stay markdown, ledger heads gain fields). Explicit re-scope recommendation
   for row 18's continuation, and the named inputs row 20 (the continuous-flow keel)
   takes from you. Numbers carry their conditions (DOCTRINE §6.7).

## Kill criteria

- Twin construction exceeds the session's budget on the fallback lab too → kill;
  the documented conversion cost IS the finding.
- C2 variance ≥ the between-arm difference after the confirmation rep → that consumer
  reports "inconclusive at affordable n", with the numbers; never a decree.
- Any measurement that would require editing `canon/`, `doctrine/`, or live corpus
  files → out of scope; name it and move on.

## Deliverables

Findings appended here — numbers per consumer per arm, conditions attached, verdict +
recommendation + row-18 re-scope + row-20 inputs; twin + battery + grader in
`lab/17/` (committed — the harness is the evidence); status + commits.

## Out of scope

- Migrating anything live; edits to `canon/`, `doctrine/`, or any building's docs.
- Designing new schema fields beyond measuring the case-file list — design is row
  20's and the Grand Architect's.
- The serialization of Belvedere's own runtime state (event logs, census) — already
  data; not in question.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Digger at fable-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/MAP.md §5 (v3 note)
and ~/code/agents/plans/17-storage-experiment.md,
and execute the brief.
```
