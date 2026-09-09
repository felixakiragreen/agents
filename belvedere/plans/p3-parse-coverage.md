# P3 — parse coverage

**Status:** LANDED 2026-08-26 · **Depends on:** — · **Staffing:** Digger · opus-high · **Parallel-safe with:** P1, P2

## Questions

1. Can lean parsers extract, from every live doctrine repo's ACTUAL files: board tables, the ledger tail entry, fenced kickoffs/batons, the decision queue (`pending Felix countersign`), ISSUES entries? Deliverable shape: a coverage table, repo × artifact → parsed | failed (why, with the verbatim excerpt).
2. Where prose fights the parser: the fold-candidate list — for each failure class, the minimal FORMAT amendment that would dissolve it (the rework mandate, [README §1](../README.md)); never a parser special case.
3. The glass's data shape: propose the parsed-output JSON per artifact — the build rows consume this.

## Inputs — read before working

- [README](../README.md) §1 (parser-as-lint, the rework mandate); [DOCTRINE](../../canon/work/DOCTRINE.md) §§2, 4, 5, 7, 8 — the formats are the spec.
- Known corpus, pre-listed — extend by discovery (under `~/code/`, `~/code/universal_robots_sdk/`, and `~/.claude*/projects/` slugs; list everything scanned): `~/code/agents` (+ `belvedere/`), `~/code/hexwright`, `~/code/universal_robots_sdk/cap-mega/simmy` + sibling cap-mega boards (snappy, manny, cornerizer, node-param, units), `~/code/universal_robots_sdk/cap-mega/felix/spacex-dashboard-c2`, `~/code/universal_robots_sdk/bob`, `~/code/rooted` (arborist archive), `~/code/my_checklist`.
- Stack: bun (canon D59). Parsers in `lab/p3/` are disposable probes; the glass's real parsers are a build row cut ON these findings.

## Method

One parser per artifact class, doctrine-format-strict; run over the corpus; every failure recorded with file§ and the verbatim offending excerpt; classify each: (a) the doc violates doctrine — candidate ISSUES entry for THAT repo, listed in findings only (you file nothing outside this repo); (b) the doctrine format is parser-hostile — fold candidate, question 2; (c) variance the doctrine permits — the glass must handle it. Control (DOCTRINE §6.2): a synthetic conforming fixture per artifact — a parser failing its own fixture indicts the parser, not the corpus.

## Kill criteria

- More than half the live boards need per-repo special-casing → STOP: the finding IS the escalation — the format question goes to Felix and the Grand Architect before any glass build row is cut.

## Deliverables

Findings below — coverage table, failure excerpts, fold-candidate list, proposed JSON shapes — plus `lab/p3/` parsers, status current, commits.

## Findings

**Verdict: YES — lean parsers cover the corpus. The kill criterion did not fire.** One doctrine-strict parser set, **zero per-repo special cases**, reads 25 of 27 board docs, 365 of 365 board rows, and 8 of 8 ledgers. Where it fails, it fails on *cell content*, in **fourteen general classes** — never on a repo's idiosyncrasy. The format, not the parser, is what needs the work.

Probes: [`lab/p3/`](../lab/p3/) (`bun run.ts`, `--fails`, `--json <repo>`); commit `6c76dfe`.

### 0. The control (DOCTRINE §6.2)

One synthetic conforming fixture per artifact class, written from the doctrine text alone ([`lab/p3/fixtures/`](../lab/p3/fixtures/)). All five pass — the corpus failures below are the corpus's, not the parser's.

```
$ bun run.ts
=== CONTROL (DOCTRINE §6.2 — a parser failing its own fixture indicts the parser)
  board:    1 board, 5 rows, 0 fail  PASS
  ledger:   2 entries, tail=2026-08-26, next="fire 03.", 0 fail  PASS
  decision: 3/3, queue=D3, 0 fail  PASS
  kickoff:  1 kickoff (Digger · opus-high), 0 fail  PASS
  issues:   2 entries, shape="--- separated prose blocks", 0 fail  PASS
```

**The control earned its keep twice.** The first run reported 449 failures; 110 of them were the parser's own naivety, and two would have been filed as corpus defects:

- **comma-splitting inside parentheses** — `Pi reachable ✓ (confirmed 2026-08-21, 7ms)` was read as two dependencies, the second being `7ms)`. Fixed with a depth-aware `topSplit`.
- **`(...)` matched non-greedily in a decision attribution** — `- **D16** (2026-08-03, Architect (02) · ✓ Felix):` stopped at the inner `)`. That single bug accounted for **32 of the canon repo's 35 reported decision failures**; the honest number is 62/62 parsed, 3 fail.

Every number below is post-fix.

### 1. The corpus — everything scanned

Discovery, not the pre-list:

```
$ find ~/code -maxdepth 5 -type f \( -name LEDGER.md -o -name DECISIONS.md \
    -o -name ISSUES.md -o -name MAP.md -o -name BULLETIN.md \) -print
$ grep -rl --include='*.md' -E '^\|\s*(ID|Row|Cell|Spike)\b.*\|.*(Staffing|Status)\s*\|' ~/code
$ ls ~/.claude*/projects            # slugs, to find repos the first two missed
```

**Carrying doctrine artifacts (17 buildings):** `agents` · `agents/belvedere` · `hexwright` · **`whiteboardy`** · `rooted/repot` · `rooted/archive/arborist` · `bob` (+ campaigns lunchbox, pods, theseus) · `cap-mega/simmy` · `cap-mega/snappy` · `cap-mega/snappy/ch2` · `cap-mega/docs/units` · `cap-mega/docs/waypoint-stepper` · `cap-mega/docs/{advanced-naming-system,node-global-parameters}` · `cap-mega/felix/spacex-dashboard{,-c2}` · worktree-only boards `manny`, `cornerizer`, `tig-avc`, `schema-migration`.

**Off the pre-list, found by discovery:** `whiteboardy` — the second-largest doctrine corpus in the city (26-row board, 6 sub-boards, 103 ledger entries, 72 work docs, 23 decisions). The brief's corpus line omitted it. Also: `manny` and `cornerizer` exist **only inside `cap-mega/.claude/worktrees/`** — they are not on any mainline tree, so a glass that walks repos will not see them until their branches merge.

**Scanned, no doctrine artifacts:** `my_checklist`, `golos`, `thg-doc`, `thg-speakeasy`, `placeholder`, `cap-mig`, `cap-plasma`, `cap-tig`, `cap-laser`, `cap-demo-cart`, `cap-coord-pos`, `cap-oxy-fuel`, `cap-positioner`, `felix`, `KillTeam-BattleData`. `~/.claude*/projects/` slugs across all four config dirs added no further repos beyond those listed.

**Excluded, deliberately:** the ~40 stale board copies under `cap-mega/.claude/worktrees/*/` — branch checkouts of the same docs. One representative each was taken for the four boards that exist nowhere else.

### 2. Coverage — repo × artifact

`bun run.ts`, verbatim (abridged to one line per cell):

| repo | artifact | file | result |
|---|---|---|---|
| agents | board | `MAP.md` | 16 rows · **14/16 fully typed** · 5 field fail |
| agents | ledger | `LEDGER.md` | **41/42 entries** · tail 2026-08-26 · baton=felix · 2 fail |
| agents | decisions | `DECISIONS.md` | **62/62 parsed** · queue 2 · 3 fail |
| agents | issues | `ISSUES.md` | 3 blocks · `--- prose blocks` · 1 fail |
| agents | kickoff | `plans/` | 11/19 docs carry a summons fence · 8 fail |
| agents/belvedere | board | `README.md` | 4 rows · **4/4 fully typed** · 0 fail |
| agents/belvedere | ledger | `LEDGER.md` | **1/1** · tail 2026-08-26 · baton=felix · 0 fail |
| agents/belvedere | decisions | `README.md` | **6/6** · queue 0 · 0 fail |
| agents/belvedere | issues | `ISSUES.md` | drained (header only) · 0 fail |
| agents/belvedere | kickoff | `plans/` | **4/4 docs** · 4 kickoffs · 0 fail |
| hexwright | board | `GENESIS.md` | 4 rows · **4/4 fully typed** · 0 fail |
| hexwright | ledger | `LEDGER.md` | **0 entries** — pre-doctrine format (§3a) |
| hexwright | decisions | `DECISIONS.md` | **0/9** — pre-doctrine format (§3a) |
| whiteboardy | board | `GENESIS.md` | 26 rows · **26/26 fully typed** · 6 field fail |
| whiteboardy | board | `docs/m1-editor.md` | 10 rows · **10/10** · 1 fail |
| whiteboardy | board | `docs/m2-sync.md` | 5 rows · **5/5** · 1 fail |
| whiteboardy | board | `docs/m3-shells.md` | 3 rows · **3/3** · 1 fail (§3k pipe) |
| whiteboardy | board | `docs/touch-native.md` | 7 rows · **7/7** · 1 fail |
| whiteboardy | board | `docs/v1-cutover.md` | 5 rows · **2/5 fully typed** · 7 fail |
| whiteboardy | board | `docs/v1-expansion.md` | 6 rows · **6/6** · 1 fail |
| whiteboardy | ledger | `LEDGER.md` | **4/103** — house format (§3a) |
| whiteboardy | decisions | `DECISIONS.md` | **23/23** · queue 4 · 0 fail |
| whiteboardy | kickoff | `plans/` | **66/72 docs** · 67 kickoffs · 0 fail |
| rooted/repot | board | `README.md` | 4 rows · **4/4** · 0 fail |
| rooted/archive/arborist | board | `README.md` | 20 rows · **19/20** · 4 fail |
| rooted/archive/arborist | issues | `ISSUES.md` | drained (header only) · 0 fail |
| bob | board | `campaigns/lunchbox/README.md` | 10 rows · **9/10** · 2 fail |
| bob | board | `campaigns/pods/README.md` | 15 rows · **12/15** · 5 fail |
| bob | board | `campaigns/theseus/README.md` | 29 rows · **12/29 fully typed** · 29 fail |
| bob | issues | `ISSUES.md` | drained (header only) · 0 fail |
| cap-mega/simmy | board | `README.md` | 35 rows · **23/35** · 14 fail |
| cap-mega/simmy | ledger | `LEDGER.md` | **5/29** · tail 2026-08-04 · **baton=session** · 28 fail |
| cap-mega/simmy | decisions | `README.md` | **17/17** · queue 10 · 10 fail |
| cap-mega/simmy | issues | `ISSUES.md` | 15 blocks · `## numbered headings` · 15 fail |
| cap-mega/simmy | kickoff | `spikes/` | 6/31 docs carry a fence · 0 fail |
| cap-mega/snappy | board | `README.md` | 29 rows · **28/29** · 2 fail |
| cap-mega/snappy | ledger | `LEDGER.md` | **22/23** · tail 2026-08-20 · baton=felix · 11 fail |
| cap-mega/snappy | decisions | `README.md` | **25/26** · queue 16 · 1 fail |
| cap-mega/snappy | issues | `ISSUES.md` | 1 block · `## numbered headings` · 1 fail |
| cap-mega/snappy | kickoff | `plans/` | **28/31 docs** · 29 kickoffs · 0 fail |
| cap-mega/snappy/ch2 | board | `README.md` | 11 rows · **9/11** · 3 fail |
| cap-mega/snappy/ch2 | kickoff | `plans/` | **0/11 docs carry a fence** · 0 fail |
| cap-mega/docs/units | board | `README.md` | 15 rows · **12/15** · 3 fail |
| cap-mega/docs/units | kickoff | `plans/` | 6/8 docs · 10 kickoffs · 0 fail |
| cap-mega/docs/waypoint-stepper | board | `README.md` | 29 rows · **19/29** · 13 fail |
| cap-mega/docs/advanced-naming-system | board | — | 3 boards · 27 rows · **15/27** · 23 fail |
| cap-mega/docs/node-global-parameters | board | — | 9 rows · **8/9** · 1 fail |
| cap-mega/docs/documentation-findings | board | — | **not a board** (findings tables; my corpus mislabeled it) |
| manny (wt) | board | `manny/README.md` | 30 rows · **29/30** · 1 fail |
| cornerizer (wt) | board | `docs/cornerizer.md` | **0 boards** — renamed columns (§3m) |
| tig-avc (wt) | board | `docs/tig-avc.md` | 13 rows · **8/13** · 9 fail |
| schema-migration (wt) | board | `docs/schema-migration.md` | 3 rows · **1/3** · 3 fail |
| spacex-dashboard-c2 | ledger | `LEDGER.md` | **3/3** · tail 2026-08-13 · **baton=NONE** · 5 fail |
| spacex-dashboard | ledger | `LEDGER.md` | **5/5** · tail 2026-08-14 · **baton=NONE** · 8 fail |

```
TOTAL field failures: 339 across 57 cells
BOARD TOTALS: 25/27 docs yielded a canonical board · 365 rows found · 288 rows fully
typed (79%) · per-repo special cases in this parser: 0
```

**Kill criterion — did not fire.** It reads: *more than half the live boards need per-repo special-casing → STOP.* The count of per-repo special cases is **zero**. Every board that carries the canonical header is found by one signature; every row in every found board is extracted. The 21% of rows that are not fully typed fail on **shared, named classes** (§3), each fixable by one format amendment that helps every repo at once. Two docs yield no board — `cornerizer.md` renamed its columns (§3m) and `documentation-findings.md` is not a board at all.

**The number that should worry the build rows is a different one: 1 of 8 ledger tails carries a fireable baton.** Today the rail would render one Dispatch button (simmy), five Felix cards, and two blanks. See §3f–§3h.

### 3. Failure classes, verbatim

`bun run.ts --fails`, histogrammed:

```
  13 depends-on segment is not a row id or named gate
  12 staffing not "<Mantle> · <tier>"
  10 status does not open with a lifecycle state
   5 no "Decided:" clause
   4 unknown tier
   4 entry not "- **D<n>** (<date>, <decider>): **<title>.** <body>"
   3 entry head not "**<date> · <mantle> (<row>)** — …"
   2 unknown mantle · 2 no canonical board · 2 no "Next:" clause
   2 issues entry has no author · 2 date not ISO · 1 unescaped pipe · 1 bad summons line
```

**a. Two repos predate the doctrine wholesale** — *class (a), needs migration, not a parser branch.* `hexwright/LEDGER.md` uses `## <date> · <role> · <title>` headings with no `---` and no bold head; `hexwright/DECISIONS.md` uses `- **D1 · 2026-08-01 · Stack: TypeScript (strict).**` — `·`-separated, not `(<date>, <decider>): **<title>.**`. `whiteboardy/LEDGER.md` runs its own house format, verbatim:

```
2026-08-15 · Digger · fable-high (dispatched, row 01)
Changed: `lab/01/` built — generator + 8 probes against loro-crdt 1.14.1 …
```

No bold, three `·` segments (date · mantle · tier), body opens `Changed:` not `—`. 99/103 entries fail. **All three are one-commit migrations** — the shape is regular inside each repo. The glass renders only the tail, so migrating the tail is enough to light the rail; the history can stay as it is.

**b. Gate rows have no legal Staffing value** — *class (b), the largest fold candidate.* D44 makes gates rows; §4's Staffing law demands "mantle · tier, both verbatim". A Felix-gate has neither, so the field improvises, **at least five ways**:

```
theseus  | G-o1-prod    | … | **Felix-gate**
units    | FG1          | … | Felix
tig-avc  | M0           | … | Felix (named gate)
arborist | ARB-02       | … | Felix (Xcode UI)
agents   | 0            | … | Grand Architect · fable        ← and Felix's blessing in Depends-on
```

16+ staffing cells across 9 boards. This is precisely the field the baton rail needs to be *typed*: README §3 requires "a Felix-holder baton renders as his card, never auto-fired." Today that decision can only be made by regexing prose in a staffing cell — one missed spelling and the glass fires a session at Felix's gate.

**c. The lifecycle has no terminal state for gate rows and merge rows** — *class (b).* §4 names five states. The field writes, verbatim:

```
pods      | G-refs   | **PASSED** (2026-08-21) — `PipelineOrders.xlsx` + bonus …
theseus   | o1       | **MERGED** `fb0de3a` (2026-08-20); E1 ruled TH-D11 …
simmy     | S7       | design **BLESSED** 08-03 (Felix) → [docs/design.md](…)
snappy    | 13       | CHARTERED (2026-08-05) — PENDING-bench …
ch2       | 04       | **RULED in part (2026-08-17, D34)** — apportionment delivered …
w'boardy  | FG1      | **PART-LANDED 2026-08-12** — shape/eyeball/perf legs done …
lunchbox  | F1       | DONE (thg-pi-06, trixie)
```

`DONE` is a retired synonym (§4) — one doc violation. The other six are states the doctrine never named: gates resolve `PASSED`, merge rows resolve `MERGED`, design rows resolve `BLESSED`. 10 cells across 8 boards.

**d. `PENDING` is written as a leading state though §4 rules it an annotation** — *class (a), high-frequency enough to indict the wording.* Verbatim: `PENDING (venue — helm frame "simmy: template maturation dead on every cell"; …)` and `CHARTERED (2026-08-05) — PENDING-bench, scheduled when the bench is free`.

**e. Staffing carries riders it has no slot for** — *class (b).* Verbatim:

```
agents   | 15  | Architect · fable-max (founding)
theseus  | o3  | Digger · opus-high — NOT ∥ theseus t12c (both edit web/src/style/; o3 first)
m2-sync  | C3  | Builder · opus-medium · Felix+Cob-attended
simmy    | B1  | Builder · opus-high (worktree)
simmy    | S7  | design Digger · fable-high / build Builder · opus-medium (fast)
pods     | a1  | Architect · fable-max — Felix in the room
```

§4 says the concurrency plan rides the batch note and the Dispatcher's summons. In the field it *also* rides this cell, because that is where a dispatcher's eye lands. The rider then eats the tier token, so the row loses its staffing entirely.

**f. Depends-on mixes row ids with prose preconditions** — *class (b).* 13 fails. Verbatim:

```
whiteboardy 05 | Pi 5 (Felix stands up — PENDING until reachable)
arborist ARB-16| Auto-Lock → Never
m3-shells T6   | Felix's phone cabled+unlocked
whiteboardy 17 | kickoff in the batch-7 note
agents 02      | keel · soft interlock with 01
agents 14      | serial with 11 (shared files — 11 deferred, so dispatchable)
m2-sync C3     | Felix+Cob window | D21 for shells only
```

§4 says "row ids … plus any named gate". A hardware precondition is neither, so the glass cannot compute a dependency graph — the one thing this column exists for.

**g. The ledger head's parenthetical is overloaded** — *class (b); Belvedere's own ledger does it.* §7 specifies `(<row id, when the session ran one>)`. Verbatim:

```
belvedere  **2026-08-26 · Architect (founding, fable-max)** — Founded on the keel…
agents     **2026-08-24 · Builder (opus-high, dispatched) · row 14 — the theater cycle.**
snappy     **2026-08-17 · Builder (row 07, sonnet-high)** — Drafted …
spacex-c2  **2026-08-13 · Architect (chapter-2 design, fable-max)** — consumed …
```

`--json agents/belvedere` returns `"row": "founding, fable-max"` — the tier landing in the row-id field, in the newest doc in the city. The agents entry additionally puts the session **title** inside the bold run, so its `—` pre-empts the head/body split and the entry does not parse at all.

**h. `Decided:` and `Next:` go missing** — *class (a), but 5 + 2 hits and both are load-bearing for the glass.* Missing `Decided:` (the decision queue's input):

```
whiteboardy **2026-08-17 · Builder · sonnet-high (E11 — M1 polish, dispatched)** — **LANDED, DoD 4/5** Changed: …
simmy       **2026-08-03 · Architect (fable-max)** — Reviewed batch 4; both landings verify …
snappy      **2026-08-14 · Digger ch2-01 (opus-high)** — **Dobby first light. LANDED**, all five arms …
```

Missing `Next:` (the baton itself) — both spacex ledgers. And a date the format has no room for: `"2026-08-24/25"` (a session that crossed midnight).

**i. Only 1 of 8 ledger tails carries a fenced summons.** simmy's does; the rail would render it as a Dispatch button. Every other tail's `Next:` is prose — belvedere's own reads `Felix fires batch 1 — P3 anywhere; P1 + P2 from terminals inside cmux panes; …`, which is a correct Felix card, but `agents`, `whiteboardy` and `snappy` are prose that *names a next session without giving its summons*. §11's session contract says the baton is handed with the summons verbatim; the ledger format has no slot that makes that machine-readable.

**j. Decision titles are written as sentences, not labels** — *class (b), 13 hits.* §8 specifies `**<title>.**`. Verbatim:

```
simmy D1  - **D1** (2026-08-02, Architect): First target = **Mac dev loop** (parallel instances …
agents D2 - **D2** (2026-08-02, Felix): The role system is named **Mantles**. `canon/mantles/` …
```

The bold lands on the load-bearing phrase inside a sentence, not on a title. The glass wants a card headline; today it must take the first sentence and hope. One attribution carries no decider at all: `- **D5** (2026-08-02)`.

**k. Unescaped `|` inside a board cell** — *class (a); the row is already truncated in every GFM renderer, not just here.* One hit, `whiteboardy/docs/m3-shells.md:670`, row SH4: the Status cell contains `` `POST /report|/log` ``, so the row splits into six cells and everything after `/report` renders as a stray seventh column. Verbatim from the run:

```
[1×] row splits into 6 cells (unescaped | inside a cell — the row is already
     truncated in any GFM renderer)
  L665: SH4: …`POST /report|/log` in Debug, which un-bricks `?check=1` …
```

Parser-as-lint's first real catch. No format amendment needed — a lint rule.

**l. ISSUES has no entry format at all** — *class (b), the widest gap.* DOCTRINE §3's ISSUES law and `canon/work/templates/issues.md` specify the *lifecycle* (who files, who sweeps, drained-empty) and say **nothing** about entry shape. Four live shapes:

```
agents      ---separated prose blocks, opening "From Felix, via the row-13 Architect (2026-08-22):"
simmy       ## 1. ~~`bob /meg build -simmy -vnc` — template maturation dies … (2026-08-06)~~
snappy      ## ~~1. The tier cannot tell a slow venue from a slow tree … (2026-08-10)~~ STRUCK — ch2 row 02
bob         Format: `- YYYY-MM-DD · who · what happened + where` (+ evidence lines if cheap)
            under `## Open` / `## Harvested` headings
```

**bob's inbox is the only one that states its own format** — and it is the only shape that yields date + author + text without guessing. Three of six inboxes are currently drained (belvedere, arborist, bob's Open) so they parse trivially.

**m. Non-canonical staffing tables** — *class (a), 1 hit.* `docs/cornerizer.md` runs `| Row | What | Staffing | Deps | Status |` — a board by D45, with columns renamed and reordered. The parser flags it separately (`+1 non-canonical staffing table`) rather than trying to guess; that flag is the right lint.

**n. Pre-D45 summons lines** — *class (a), self-healing, 8 hits, all in `agents/plans/`.*

```
plans/01-composition-model.md: You are an Architect wearing the mantle at fable-max. Read GENESIS.md, then
plans/04-sync.md:              You are a Digger. Read GENESIS.md, then plans/04-sync.md, and run Stage A only.
```

D45's single-glance test (`You are a <Mantle> at <tier>.`) was minted after these were written; the canon repo's own early briefs predate it.

**Permitted variance the glass must simply handle — class (c):** bold-wrapped status (`**LANDED**`) · markdown-linked IDs (`| [01](plans/01-perf-rig.md) |`) · struck rows (`~~Builder · opus-medium~~ Felix, by hand`) · **more than one board per doc** (`m2-sync.md` has 2, `advanced-naming-system.md` has 3) · **more than one kickoff per work doc** (`plans/04-sync.md` carries a Stage A and a Stage B summons) · a decisions section living inside the master doc rather than `DECISIONS.md` (simmy, snappy, belvedere).

**One coverage gap that is nobody's defect:** `0/11` snappy-ch2 work docs and `6/31` simmy spikes carry a fenced summons. The rail can only offer a Dispatch button for a row whose work doc ends in a fence — those campaigns predate the kickoff law.

### 4. Fold candidates — the minimal format amendments

Question 2. Each dissolves a class above for **every** repo at once; none is a parser special case. Ordered by what the v0 glass cannot do without.

**FC-1 — Reserve `Felix-gate` as a legal Staffing value.** §4's Staffing law becomes: *mantle · tier verbatim, **or** the literal token `Felix-gate`.* Dissolves §3b. One token; makes README §3's "never auto-fires" a **field test** instead of a regex over prose. This is the amendment the baton rail is blocked on.

**FC-2 — Rule that gate and merge rows resolve into the existing five states.** §4 gains: *a gate row lands as `LANDED — PASSED …`; a merge row as `LANDED — MERGED <sha>`; a design row as `LANDED — BLESSED …`.* The lifecycle stays five words and the annotation already carries the rest. Dissolves §3c without growing the vocabulary. (Preferred over adding PASSED/MERGED as states — five words is the asset.)

**FC-3 — State the PENDING rule positively.** §4 gains: *`PENDING` never occupies the leading token — write `OPEN — PENDING <precondition>`.* Dissolves §3d.

**FC-4 — Legalise a staffing rider.** `<Mantle> · <tier> (<rider>)`, the parenthetical parsed as a rider and ignored by dispatch. Dissolves §3e and stops riders eating the tier. Costs one sentence in §4 and blesses what six boards already do.

**FC-5 — Fence the Depends-on column to two forms.** *A row id, or `Felix-gate: <text>`.* Physical preconditions become gate rows — D44 already says a gate is a row, so this is enforcement of an existing law, not a new one. Dissolves §3f and is what makes a real dependency graph (and therefore a correct "dispatchable now" ring) possible.

**FC-6 — Give the ledger head a tier slot and empty the parenthetical.** `**<date> · <mantle> · <tier> (<row>)** — <body>`; nothing but those four things inside the bold run. Dissolves §3g and the head-parse failures in §3a. The glass wants the tier for the shelf and the usage strip; today it is buried in prose.

**FC-7 — Make `Next:` carry the summons when the next step is a session.** §7 gains: *when the baton passes to a session, the summons is fenced in the entry.* Dissolves §3i — this is the single amendment that turns the baton rail from a wall of Felix cards into a wall of buttons. §11 already says the baton is handed with the summons verbatim; §7's format just never made a place for it.

**FC-8 — Adopt bob's ISSUES entry line as canon.** `- <YYYY-MM-DD> · <who> · <what>`, one bullet per entry, `---`-separated blocks when an entry needs evidence. The field already invented it and wrote it down; `canon/work/templates/issues.md` should carry it in the header. Dissolves §3l.

**FC-9 — Say out loud that a decision title is a label, not a sentence.** §8 gains one line: *`**<title>.**` is a headline — the bold delimits the whole title and nothing else.* Dissolves §3j.

**Not fold candidates — repo work, listed for their Architects (I file nothing outside this repo):**

- `hexwright/LEDGER.md`, `hexwright/DECISIONS.md`, `whiteboardy/LEDGER.md` — migrate to doctrine format. Tail-only migration suffices for the glass (§3a).
- `whiteboardy/docs/m3-shells.md:670` — escape the `|` in `` `POST /report|/log` ``; the row is truncated in the rendered doc today (§3k).
- `cap-mega/docs/cornerizer.md` — rename the board columns to the canonical five (§3m).
- `lunchbox/README.md` row F1 — `DONE` is a retired synonym (§4); → `LANDED`.
- `agents/plans/{01,04}` — pre-D45 summons lines (§3n); cosmetic, self-healing.

### 5. The glass's data shape

Question 3. Not invented — this is what `bun run.ts --json <repo>` emits today, so the build rows can consume it before any amendment lands. Nullable fields are exactly the ones the fold candidates would make non-null.

```ts
type Building = {
   building: string;                    // repo slug, the City View's key
   board:   { heading: string; rows: BoardRow[] }[];   // §3c: n boards per doc
   ledgerTail: LedgerEntry | null;
   baton:      Baton | null;
   decisionQueue: Decision[];
   issues:     Issue[];
   kickoffs:  (Kickoff & { doc: string })[];
};

type BoardRow = {
   id: string;
   work: string;                        // link text, de-linked
   workDoc: string | null;              // the href — the building page's row link
   dependsOn: string[];                 // row ids; prose today (FC-5)
   gates: string[];                     // segments naming a gate/countersign
   mantle: string | null;               // null ⇒ not dispatchable (a Felix-gate today; FC-1)
   tier: string | null;                 // null ⇒ rider ate it (FC-4)
   state: 'OPEN'|'IN FLIGHT'|'LANDED'|'KILLED'|'BLOCKED'|null;   // the window's ring
   annotation: string;                  // everything after the state token
};

type LedgerEntry = { date: string; mantle: string; row: string|null;
                     body: string; decided: string|null; next: string|null; line: number };

type Baton = { holder: 'session'|'felix'|'prose'; text: string; summons: string|null };
// holder==='session' && summons !== null  ⇒  the ONLY case the rail may render as a
// Dispatch button. 'felix' ⇒ his card. 'prose' ⇒ a card the rail cannot fire (FC-7).

type Decision = { id: string; date: string; decider: string; title: string;
                  body: string; ratified: boolean; pending: boolean; line: number };
// queue = pending || (!ratified && decider is not Felix) — a decision Felix made
// needs no countersign, and treating it as queued inflated the canon queue 14 → 2.

type Kickoff = { mantle: string; tier: string|null; text: string; line: number };
// text is the fence verbatim — the Hands ship exactly this string (README §3).

type Issue = { date: string|null; who: string|null; text: string; line: number };
```

Real output, `bun run.ts --json agents/belvedere` (abridged):

```json
{ "building": "agents/belvedere",
  "board": [ { "heading": "6. The board", "rows": [
    { "id": "P1", "work": "Census join — hook events, payloads, CMUX_* env, heartbeat cost",
      "workDoc": "plans/p1-census-join.md", "dependsOn": [], "gates": [],
      "mantle": "Digger", "tier": "opus-high", "state": "OPEN", "annotation": "" } ] } ],
  "ledgerTail": { "date": "2026-08-26", "mantle": "Architect",
                  "row": "founding, fable-max",  ← FC-6: the tier in the row slot
                  "decided": "D1–D6, all ✓ Felix …", "next": "Felix fires batch 1 — …" },
  "baton": { "holder": "felix", "text": "Felix fires batch 1 — P3 anywhere; …",
             "summons": null },
  "decisionQueue": [], "issues": [] }
```

**Three notes the build rows should carry:**

1. **Every nullable field above is a render decision, not an error.** A row with `mantle: null` is a Felix-gate until FC-1 lands: render the card, hide the button. Parser-as-lint means the *null* files to ISSUES, and the glass still draws.
2. **`baton.summons` is the fire gate.** One field, one rule: no summons ⇒ no button. That satisfies README §3 today, at 1/8 coverage, and improves automatically as FC-7 propagates.
3. **The parser must find `n` boards per doc and `n` kickoffs per work doc.** Both exist in the corpus now (§3c variance); a "the board" singleton assumption breaks `m2-sync.md` and `plans/04-sync.md` on day one.

### 6. Escalation — the format questions for Felix and the Grand Architect

The kill criterion did not fire, so nothing is blocked. But FC-1 through FC-9 are **canon amendments to `canon/work/DOCTRINE.md`**, which this building may not write (D2's repo fence). They go to the canon inbox as the rework mandate directs (README §1). **FC-1 and FC-7 gate the baton rail** — the v0 spine's home page — and should be ruled before that build row is cut. FC-2 through FC-6, FC-8, FC-9 improve fidelity but do not block: the shapes in §5 already carry their un-amended forms.

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/p3-parse-coverage.md,
and execute the brief.
```
