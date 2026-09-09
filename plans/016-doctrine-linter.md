# 016 — v3: the doctrine linter

**Status:** LANDED 2026-08-26 · **Depends on:** — · **Staffing:** Builder · opus-high

## Mission

One parser in the city. Harden Belvedere P3's probes (`belvedere/lab/p3/`) into canon tooling at `doctrine/` (repo root, peer of `sync/` — tooling, not canon-law): a library the glass imports, and a CLI — `doctrine lint`, `doctrine parse --json`, `doctrine migrate`. The Standards Office owns the format, so it owns the reference reader; two parsers of one format WILL drift.

## Inputs — read before working

- [DOCTRINE](../canon/work/DOCTRINE.md) §§3, 4, 7, 8 **as amended by D63** — the grammar you parse IS this text. §11 for the baton grammar (D64: move/wave/fork).
- [P3 findings](../belvedere/plans/p3-parse-coverage.md) — coverage, the fourteen failure classes, and §5's JSON shapes (**normative**, per D65 — amend them only where D63/D64 force it: Staffing `Felix-gate` token + rider; Depends-on two forms; ledger head tier slot; baton instruments plural with row-references).
- The probes: `belvedere/lab/p3/` — **harvest verbatim where proven** (harvest law; rewriting a working artifact is spending without buying). The fixtures seed the control set.
- Stack: bun (D59); tabs at width 3 (global directives).

## The spec (blessed: Felix, 2026-08-26, at D63–D65's countersign)

1. **Library** — `parse(<building path>)` → P3 §5's shapes (`Building`, `BoardRow`, `LedgerEntry`, `Baton`, `Decision`, `Kickoff`, `Issue`), amended for D63/D64. Multiple boards per doc and multiple kickoffs per work doc are corpus facts, not edge cases. Zero per-repo special cases — the P3 bar.
2. **`doctrine lint [--live] <path…>`** — walks repos (`.claude/worktrees/` included — four boards live only there), reports failure classes with `file:line` + the verbatim offending excerpt; exit non-zero on any fail; `--live` restricts to live surfaces (boards, ledger tails, open work docs' kickoffs).
3. **`doctrine parse --json <building>`** — emits the shapes, one building per call.
4. **`doctrine migrate <building>`** — parse → re-emit in the current grammar. **Form only:** prose bodies byte-preserved, never paraphrased (D63's molt clause). Dry-run by default (prints the diff); `--write` required to touch files. Round-trip law: `parse(migrate(x)) ≡ parse(x)` on meaning-bearing fields — an assertion, not a hope.
5. **Controls** (DOCTRINE §6.2): synthetic conforming fixtures per artifact class in the amended grammar, plus P3's originals as pre-D63 migrate inputs. A parser failing its own fixture indicts the parser.

## DoD — measurable, evidence pasted in at build time

1. Fixture suite green: every artifact class, amended grammar, plus pre-D63 fixtures migrating clean.
2. Corpus run ≥ P3's baseline (25/27 board docs, 365 rows, 8/8 ledgers, zero per-repo special cases); every delta vs P3's numbers explained in findings.
3. Round-trip assertion green on every fixture and on ≥ 3 real buildings (dry-run).
4. `doctrine migrate` dry-run on one pre-doctrine tail (hexwright's `LEDGER.md`) produces a diff findings can defend as form-only.
5. Glass import proven: a one-line bun script under `lab/016/` imports the library and parses `agents/belvedere` — output pasted.

## Out of scope

- **Writing to any repo outside `~/code/agents`** — dry-run diffs only; row 018 does the writes, per building, blessed.
- The storage experiment (row 017) and any new serialization.
- Hook/CI wiring — the CLI is the arm; wiring is each venue's own physics.
- Belvedere's rendering — the glass consumes this row; it never lives in it (glass-shatters: the linter dying must cost the city nothing but lint).

## Findings

**LANDED 2026-08-26.** `doctrine/` stands: 1,199 lines of library + CLI, 196 of suite, 120 of fixtures. `bun test` 21/21 green; the corpus clears every P3 number with **zero per-repo special cases**; the round-trip law is an assertion that aborts a write, not a hope.

```
doctrine/
   index.ts           the library surface the glass imports
   cli.ts             lint · parse --json · migrate
   src/grammar.ts     every mantle, tier, state, verdict — named ONCE
   src/parse.ts       the five artifact parsers (§§3,4,5,7,8,11 as amended by D63/D64)
   src/building.ts    the register: discovery, worktree law, parse(<building>)
   src/lint.ts        the walk, the report, the totals
   src/migrate.ts     the form-only converter + the round-trip law
   fixtures/{conforming,pre-d63}/
   test/doctrine.test.ts
```

Commits: `01ed3c5` (library) · `2606966` (CLI, fixtures, suite) · `10a474c` (README, glass proof).

### DoD — measured

**1. Fixture suite green — every artifact class, amended grammar, plus pre-D63 fixtures migrating clean.**

```
$ cd doctrine && bun test
 21 pass
 0 fail
 79 expect() calls
Ran 21 tests across 1 file. [9.40s]
```

The control (DOCTRINE §6.2) is five conforming fixtures written from the amended text alone — board (incl. a `Felix-gate` row with a rider, a `Felix-gate: <text>` dependency, `LANDED — MERGED/BLESSED`, `OPEN — PENDING`), ledger (tier slot, `fire <ids>` wave, fenced summons), decisions, ISSUES (D63h bullets + an evidence block), kickoff. **All five parse with zero failures.** The pre-D63 set migrates:

```
board.md      5 edits → 0 failures   round-trip []
ledger.md     3 edits → 0 failures   round-trip []
decisions.md  2 edits → 1 declared residue per entry (decision.attribution)   round-trip []
```

**The one place "migrating clean" cannot mean zero.** hexwright's decision format (`ID · date · decision · why`) has **no decider field** — the information is not in the source, and a converter that supplies one is paraphrasing, which D63 forbids. Migrate emits `- **D1** (2026-08-01): **<title>.** <body>`, form-correct, and lint keeps `decision.attribution` standing for a human. The suite asserts that residue exactly rather than hiding it (`test/doctrine.test.ts` — "the converter refuses to invent a decider"). Migration is also proven **idempotent**: a second pass over migrated text finds nothing.

**The control earned its keep again** (P3 §0's lesson, twice more): `fire the Grand Architect` was read as an instrument on row `the` — every row id in the city carries a digit, so the baton parser now requires one; and a *findings doc* that merely wrote the word "Staffing" in prose was promoted to a board — the detector now demands the word in a header **cell**. Both are locked by tests. Neither was a corpus defect; both would have been filed as one.

**2. Corpus run ≥ P3's baseline.**

```
$ ./cli.ts lint ~/code | tail -6
=== TOTALS
  22 buildings · 28/29 board docs yielded a board · 31 boards · 376 rows · 294 fully typed (78%)
  8/9 ledgers parsed a tail · 1 fireable baton(s) · 182 kickoffs in 231 work docs · decision queue 51 · 1 inbox entries
  12734 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  718 failure(s) in 22 class(es)
```

| P3 baseline | here | delta, explained |
|---|---|---|
| 25/27 board docs yielded a board | **28/29** | discovery replaced P3's hand-listed corpus (below). The one doc that yields nothing is `cornerizer.md` — renamed columns, reported as `board.columns`, exactly the lint P3 asked for. `documentation-findings.md` is no longer mislabeled a board at all: it carries no Staffing column, so it is never a candidate. |
| 365 rows | **376** | +11: this repo's board grew rows 16–18 since P3 ran (+3), the two spacex boards were outside P3's corpus line (+8). |
| 8/8 ledgers | **8/9** | 9 ledger files found; hexwright's yields no entries pre-migration (P3 said the same, counting it as a repo, not a ledger). |
| per-repo special cases: 0 | **0** | the suite's corpus test asserts the floor: `boardDocsWithBoard ≥ 25`, `rows ≥ 365`, `tails ≥ 8`. |
| 339 field failures / 14 classes | **718 / 22 classes** | the amended grammar is **stricter on purpose**, and the classes split finer. Two amendments do the work: D63e (Depends-on resolves against real row ids — see below) and D63f (the ledger head's tier slot: 93 heads carry none). |

`--live` — boards, ledger tails, open work docs' kickoffs — narrows 718 → **340 in 15 classes**. All 8 pre-D45 summons lines fall out: every one is in a closed work doc.

**The 232-hit `board.depends` class is the honest cost of D63e, and it is the point.** P3 validated a dependency segment by *shape* (`/^[A-Za-z]{0,6}-?\d{0,3}[a-z]?$/`), so `keel` and `Felix's blessing` passed as row ids. This parser resolves each segment **against the row ids the board actually declares** — the one thing distillation candidate 5 said the column exists for. What the field writes instead, verbatim:

```
snappy 16: "09 BLESSED + 12 merged ✓"      snappy 24: "23 merged ✓"
agents 01: "keel"                          agents 02: "keel · soft interlock with 01"
belvedere P4: "P2 (recipe)"                whiteboardy 05: "Pi 5 (Felix stands up — PENDING…)"
```

The parser still **recovers** any row id such a segment names, so the graph draws while the lint files the defect (P3 §5 note 1). This is row 018's largest single work item.

**3. Round-trip assertion green on every fixture and on ≥3 real buildings (dry-run).**

Five buildings in the suite — `agents`, `agents/belvedere`, `hexwright`, `whiteboardy`, `cap-mega/simmy` — every board and ledger file, zero violations. Ad-hoc over six buildings including `bob/…/theseus`: `18 / 2 / 16 / 16 / 13 / 2` edits, **0 violations**.

**The law's precise reading, and it is an interpretation — flagged.** `parse(migrate(x)) ≡ parse(x)` cannot mean bare equality: migrate exists to change `state`, `tier`, `felixGate`. Implemented as three conjoined assertions:

1. every rule **declares** the parsed fields it may alter (`Rule.changes`);
2. for every artifact instance keyed stably (row id, ledger date, D-id), each field is **identical** unless a *fired* rule declared it — a field that did not parse before may become non-null;
3. **byte assertion:** every line outside a recorded edit survived untouched.

A violation aborts `--write` with "this is a converter bug, not a doc defect". If the Architect wants a stricter or looser reading, it is one function (`roundTrip`).

**4. `doctrine migrate` dry-run on hexwright's `LEDGER.md` — a diff defensible as form-only.**

```
$ ./cli.ts migrate ~/code/hexwright
@@ line 18 @@  [ledger.pre-doctrine-head]
-## 2026-08-01 · Builder · WO-001 — Kernel v0
+---
+
+**2026-08-01 · Builder (WO-001)** — Kernel v0
…
   round-trip ok — 9 edit(s), meaning-bearing fields unchanged
   round-trip ok — 9 edit(s), meaning-bearing fields unchanged   (DECISIONS.md)

Dry run: 18 edit(s) across 2 file(s). Re-run with --write to apply.
```

**Every one of the 9 ledger edits is a single `## ` heading line** — the suite asserts it (`m.edits.every(e => e.from.startsWith('## '))`). Not one body byte moves; the transform is the §7 separator, the bold head, and the row id lifted out of the title where the title already began with one. Before: 0 entries parse. After: 9. `git status` in hexwright: clean — dry-run is the default, and **no repo outside `~/code/agents` was written** (the fence held).

**5. Glass import proven.**

```
$ cd lab/016 && bun glass-import.ts
{ "building": "agents/belvedere",
  "board": [ { "heading": "6. The board", "rows": 4 } ],
  "rowsTyped": "4/4",
  "firstRow": { "id": "P1", "work": "Census join — hook events, payloads, CMUX_* env, heartbeat cost",
                "workDoc": "plans/p1-census-join.md", "dependsOn": [], "gates": [],
                "mantle": "Digger", "tier": "opus-high", "felixGate": false, "rider": null,
                "state": "OPEN", "annotation": "", "line": 115 },
  "ledgerTail": { "date": "2026-08-26", "mantle": "Architect", "tier": null,
                  "row": "founding session, continued" },
  "baton": { "holder": "felix", "instruments": 0 },
  "decisionQueue": 0, "issues": 1, "kickoffs": ["Digger · opus-high", …×4], "fails": 10 }
```

One line: `import { parse } from '../../doctrine'`. Note `tier: null` on belvedere's own tail — the distillation candidate 6 defect P3 named in the newest doc in the city, now a typed lint failure instead of a tier hiding in a row slot.

### The register — the discovery law (a design decision worth the record)

P3 hand-listed its corpus. A CLI cannot. The rule, general and special-case-free:

- a directory is a **building** when it directly carries `LEDGER.md`, `DECISIONS.md`, `ISSUES.md`, or a master doc that staffs sessions;
- every other artifact belongs to its **nearest ancestor building**; a board with no ancestor **promotes its own directory** — which is how `cap-mega/docs`' three contract boards get a home without anyone naming them;
- `lab/`, `fixtures/`, `templates/` are not corpus (§3's disposable code, §6.2's controls, ⟨placeholders⟩) — all three stay lintable as an explicit root;
- **the worktree law.** A checkout whose mainline twin exists **at the same size** is that twin: skipped, unread. A branch that put a board in a doc the mainline has none in **survives** — that is exactly `docs/tig-avc.md`, whose board exists only on its branch while the file exists on both. One representative per `(repo, relative path)`, newest by mtime. **12,734 checkouts skipped, printed in the totals** — a silent cap reads as "covered everything" when it didn't.

This reproduces P3's four worktree-only boards (manny, cornerizer, tig-avc, schema-migration) as the *output of a rule* rather than a hand-picked representative. Grouping differs where P3's list did: `bob`'s three campaign boards are three buildings (each has its own master doc board), and `cap-mega/docs` is a building. Same boards, same rows; different rows in the register. Full-city walk: **~9 s**.

### Escalations and parked notes

- **`--live`'s definition of an open work doc** is the doc's own `**Status:**` header opening OPEN / IN FLIGHT / BLOCKED — local and deterministic, rather than joining to a board row. Named here in case the Architect wants the join instead.
- **A ledger head that wraps across lines** is invisible to `ledger.tier-slot` (the rule is line-scoped). None exist in the corpus today; the day one does, it lints as `ledger.head` rather than migrating. Named, not built.
- **Adjacent, not fixed** (Builder law): this repo's own `MAP.md` fails D63e on 19 of 19 dependency cells, `LEDGER.md` on 44 heads and 18 row slots, and `plans/{01,04}` carry pre-D45 summons lines. Row 018's work, per building, blessed — not touched here.
- **`doctrine` is not wired to anything.** No hook, no CI, no `sync/` entry — the CLI is the arm and wiring is each venue's own physics (out of scope, held).

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/016-doctrine-linter.md
and execute the order.
```
