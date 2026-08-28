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

### C0 — twin construction (2026-08-28, Digger · fable-high)

**The twin cost almost nothing: one pass, zero fidelity iterations, 2 hand-correction
classes (29 instances, both automated).** `lab/17/build-twin.ts` reads the corpus
through doctrine's own primitives and emits `lab/17/twin/{board,ledger,decisions,
issues,kickoffs}.json` — 2 boards · 31 rows, 53 ledger entries, 70 decisions, 31
kickoffs, 0 issues (drained). Evidence: `bun lab/17/build-twin.ts && bun
lab/17/render.ts && bun lab/17/check-fidelity.ts` → `FIDELITY: OK — every typed field
identical, corpus vs re-rendered twin` (commit `9f6a79a`). Control proven negative-able:
planting `tier: "opus-high"` into ledger[10] turns the check red (`FIDELITY: FAILED — 1
diff(s)`), rebuild restores green.

- **Hand-corrections, both parser gaps the brief pre-named, neither a judgment call:**
  (1) `unrecorded` tier/mantle carried as the literal string where the parser nulls it
  with an "unknown tier" fail — 28 instances (27 ledger + 1 board row 0), 18-wave
  escalation #1; (2) D21's countersign became a field (`countersigned: true`) — the
  regex false-pend (`parse.ts:338` matching the marker the entry itself quotes) doesn't
  survive into the twin. D6 was left un-countersigned **on purpose**: the doc genuinely
  carries no ✓, so the twin carries the truth, not a repair.
- **Migration-cost estimate for row 18's re-scope:** ~12K session tokens and <2 min
  wall for this building's full truth layer (token counter 14.892M → 14.880M around the
  build; files authored in one sitting, first fidelity run green). The conversion is
  parser-output-shaped, so per-building cost scales with parse cleanliness, not size —
  a building the 18-wave already migrated converts mechanically; whiteboardy-class
  ledgers (96/104 blocks unparsed) would pay the wave's repair cost first, not a twin
  cost.
- **Scope note (construction choices, declared):** DOCTRINE §4's zero-row template
  board excluded (grammar skeleton, not truth); ledger entries carry `{date, mantle,
  tier, row, body}` with `decided`/`next`/`block` derived at parse — the normative
  shapes' derived fields are not double-stored; kickoffs taken from `parse --json`
  baseline verbatim (the 3 log-tradition `You are` fences were already fails, not
  kickoffs — no correction needed).

### C1 — Felix's hand (2026-08-28)

**Verdict-shaped result: the arms split by CHANGE TYPE, not by winner.** Four real
landed changes replayed both arms (`bun lab/17/c1.ts`, commit `10294db`; full table in
`lab/17/c1-metrics.md`; M = the real commits `6b87c4e`/`954ffbd`/`f3cd47c`/`daa0ca3`,
S = the same semantic change applied to the twin, before-state staged so word-diff
measures the true delta):

| replay | M (hunks · ±lines · ±chars · longest · signal) | S (same) |
|---|---|---|
| R1 row-16 landing (status flip) | 1h · ±1/1 · 1707c · **1465** · 77% | 1h · ±2/2 · 1405c · 1277 · **92%** |
| R2 D68–D70 append | 1h · +58 · 4450c · **84** · 100% | 1h · +24 · 4634c · 1862 · 100% |
| R2b D63 countersign flip (43 signal chars) | 1h · ±2/2 · 307c · 85 · **14%** | 1h · ±1/1 · 4915c · **2467** · 1% |
| R3 GA-11 ledger append | 1h · +37 · 2679c · **85** · 100% | 1h · +7 · 2803c · 2709 · 100% |

- **S wins in-place STATE edits:** R1's flip is its own crisp line (`"state": "OPEN"` →
  `"LANDED"`) and signal share rises 77→92% — in M the flip is buried inside a
  1,465-char single-line row a reviewer must word-scan.
- **M wins in-place PROSE edits, decisively:** R2b changes 43 chars; M's hand-wrapped
  lines localize it to 307 diff chars (14% signal) while S rewrites one 2,467-char JSON
  line (4,915 diff chars, 1% signal). JSON strings cannot wrap — every prose edit is a
  whole-line rewrite. This is structural, not fixable by pretty-printing.
- **Appends are a wash on signal (both 100%)** but M's longest diff line is 84–85 chars
  (hand-wrapped) vs S's 1,862–2,709 (one line per prose field) — in a default git diff
  the M append is readable top-to-bottom; the S append needs word-diff tooling or a
  renderer. S's syntax overhead on appends is real but small (+4% / +5% chars).
- **Damage surface (probes with controls, `bun` one-shot in the C1 session log; classes
  from the 18-wave, plus JSON's own):** M's two killer classes confirmed silent ON THIS
  CORPUS — a blank line before row 12 of the MAP board drops **11 rows with zero new
  fails** (23→12 rows, fails 1→1); deleting one ledger `---` merges two entries and the
  fail count goes **DOWN** (53→52 entries, fails 26→25 — damage reads as improvement).
  M's unescaped `|` is loud at lint (board.pipe), silent only until lint runs. S: a
  stray newline in a string and a trailing comma refuse loud at `JSON.parse`
  (`SyntaxError` both); S's own silent class exists — **duplicate key, last-wins,
  silently** (`{"state":"OPEN","state":"LANDED"}` → LANDED, no error), invisible to
  parse-then-validate, catchable only by a raw-text pass. Score: silent classes that
  can corrupt meaning — M: 3 confirmed in the wild (blank-line, missing `---`,
  D21-class regex false-pend); S: 1 (duplicate key, not yet sighted in the wild).

### C3 — the glass (2026-08-28)

**Of the case file's nine field asks, seven are plain fields in arm S with zero
heuristics; in arm M all seven live render-side as regexes, prose scans, or D10
pauses. The remaining two are schema-design questions either arm must send to row 20.**

| case-file ask | arm M today | arm S |
|---|---|---|
| `kind` (move/wave/fork) | prose — `classifyBaton` reads instruments, "never the exclusivity: the fork's mark is prose" (`doctrine/src/parse.ts:265`) | a field |
| fork `recommendation` | prose | a field |
| row `branch` | annotation prose, regex extraction | a field |
| baton `holder` / precondition | `/\bFelix\b/` heuristic — **inverted on this repo's own live tail**: `parse --json` says `holder: "session"` while the Next clause opens "**Felix countersigns D68–D70**" (the `fire 17` instrument wins the classifier; the GA-11 ledger already names this for row 20) | a field |
| landing `holds` | prose | a field |
| `encapsulation` (≤6-word name) | nowhere — 27 of 38 live rail cards had no extractable name (batch-5 close, brief's case file) | a field |
| escalation | `/escalat/i` classifier gates 120 of 390 landed rows, 113 on that regex alone, including rows reading "nothing escalated" (case file) | a field |
| tier as model·effort | atomic token both arms — splitting it is schema design (row 20) | same |
| `FC-`/`GA-` id registry | absent both arms — vocabulary gap (rows 20/21) | same |

- **Parser cost (SLOC, `wc -l`):** doctrine/ total 1,199 (grammar 90 · parse 377 ·
  building 258 · lint 99 · migrate 279 · cli 79 · index 17) vs the twin stack 273
  (build-twin 119 — one-time converter · render 62 · validate 92). Scope-matched —
  M's parse+grammar+lint 566 vs S's steady-state render+validate 154, **~3.7×** —
  because in S the grammar is field access; the only parsing left is JSON.parse.
  Not counted for S: doctrine's register discovery and migrate have no S equivalent
  yet; a city-wide S arm would rebuild some of `building.ts`.
- **Refusal/defect classes:** M filed **14 tool/grammar defect classes in one wave**
  (18-wave escalations, the brief's own datum). S's validator names 8 refusal classes,
  all loud, and closes the dupkey silent class with a raw-text scan
  (`bun lab/17/validate.ts` → `VALIDATE: OK`; negative control: a planted `Diggr` +
  a planted dangling `dependsOn: ["99"]` → exactly 2 failures, exit 1).
- **The standing tax, counted both ways (brief's instruction):** M absorbs ambiguity
  render-side today — the glass's D10 warning cards, the 120-of-390 classifier — and
  in exchange holds the counter-arm's win: **one strict parser held 22 buildings with
  zero per-repo special cases; every fix lands city-wide.** Arm S inherits that win
  only if the schema stays one-per-city (a per-repo twin dialect would be the same
  drift the Standards Office exists to kill).

---

**Kickoff (verbatim):**

```
You are a Digger at fable-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/MAP.md §5 (v3 note)
and ~/code/agents/plans/17-storage-experiment.md,
and execute the brief.
```
