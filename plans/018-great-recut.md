# 018 — v3: the great re-cut

**Status:** LANDED 2026-08-29 — reconciled at canon 025's landing, which carried the continuation whole (batch 1 closed 2026-08-26 at 7/8 LANDED, one partial, 18c BLOCKED; all four standing sanctions executed at 025 and city lint went 349 → 8) · **Depends on:** 016 · **Staffing:** Dispatcher · sonnet-medium (tended the batch below)

## Mission

Every doctrine artifact in every building, history included, speaks the D63 grammar — one grammar, every era, no parser compat branch ever. Migration is **form only**: the converter moves shape, sessions rule residues, nobody paraphrases a byte of meaning (D63's molt clause; F1's round-trip law aborts a violating write). Pre-authorized city-wide by the Sovereign (D63/D65: "We'll migrate every project, I don't care").

## Inputs — read before working (every wave session)

- [DOCTRINE](../canon/work/DOCTRINE.md) §§3, 4, 7, 8 — the target grammar, D63/D64 amended, `unrecorded` included (§8, the molt clause).
- [Row 016's findings](016-doctrine-linter.md) — the tool, the failure classes, the residue law (F2), the register rule.
- The tool: `~/code/agents/doctrine/` — `./cli.ts lint <path>` · `./cli.ts migrate <building> [--write]`. Trust its dry-run diff; a round-trip violation is a converter bug — STOP and escalate, never hand-fix around it.
- Your target buildings' own docs: master doc, ledger tail, board — read before touching (§method step 1).

## The wave — one row per venue, each row one session

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 18a | agents + belvedere — MAP depends-on cells (19), LEDGER heads (44) + row slots (18), pre-D45 summons lines (plans/01, 04), belvedere tail's row slot | — | Architect · opus-high (dispatched, scoped) | LANDED (2026-08-26) — belvedere 0 failures, agents 30/103 (linter unrecorded gap, escalated), commits 888f9e4/afb983c/39daf6a |
| 18b | hexwright — ledger 9 heads (dry-run proven), 9 decisions: deciders by evidence or `unrecorded` | — | Architect · opus-medium | LANDED (2026-08-26) — 0 lint failures, commits f7cb5e4/09db6fb in hexwright |
| 18c | whiteboardy — house-format ledger ×103, GENESIS + 6 sub-boards, the m3-shells:670 unescaped pipe | — | Architect · opus-high | BLOCKED (2026-08-26) — board half landed (166 → 149; six rows recovered from invisibility); ledger half refused on two `migrate` defects, 28 board cells on Depends-on resolution scope. Findings below; commits `3575630`/`b82b089`/`8a39750`/`3b9a299` |
| 18d | bob — lunchbox, pods, theseus: DONE→LANDED, PASSED/MERGED re-spellings, depends prose | — | Architect · opus-medium | LANDED (2026-08-26) — 53/54 typed, 1 unrecorded (linter vocab gap, escalated), commits 1bec7f0/54bdc97/553c5db/b90847e |
| 18e | cap-mega/simmy — ledger 29 entries (5 parse), ISSUES ## headings → D63h bullets, board depends | — | Architect · opus-high | LANDED (2026-08-26) — 77→1 failure (linter unrecorded gap, escalated), commits b2199f62e/dfde315b4/c5a6f4dce (cap-mega) |
| 18f | cap-mega snappy + snappy/ch2 + docs cluster (units, waypoint-stepper, advanced-naming, node-param) | — | Architect · opus-medium | LANDED partial (2026-08-26) — 4 of 5 buildings migrated (7 residual, all the escalated vocab gaps); **snappy BLOCKED** on a malformed ledger, escalated. Findings §18f |
| 18g | cap-mega worktree boards — manny, tig-avc, schema-migration, cornerizer (columns re-cut to the canonical five): each edited inside its own worktree, committed on its own branch | — | Architect · opus-medium | LANDED (2026-08-26) — 83→8 failures (vocab gaps, escalated); findings merged to master 2026-08-28; the branches and commits are in the findings table below |
| 18h | rooted (repot + arborist archive) + spacex ×2 — small sweeps; absent Decided:/Next: → `unrecorded` | — | Architect · sonnet-high | LANDED (2026-08-26) — rooted 0/0, spacex-dashboard 22→8 (tool gaps escalated), c2 deferred; commits in the findings table below |

**Batch note (cut 2026-08-26, grand-architect-10).** All eight parallel-safe: disjoint repos; 18e/f/g share cap-mega but touch disjoint files, and 18g works inside per-board worktrees (the shared checkout's branch is NEVER switched — §10). Concurrency plan: **ceiling 4 concurrent**, no gauge — doc-only work, no shared live resources beyond disk. Dispatcher-tended (D61); **the announce duty (D67) runs its first live wave here** — every fire posted: row · tier · vehicle.

## Method — the shared recipe, per building

1. **Read first:** the building's master doc + ledger tail + board. **A live batch defers that building** — migration lands at its landing boundary, never over in-flight work (v2's lesson); a deferral is reported, not silent. Check belvedere's board especially (probes P1/P2/P4 may be running).
2. `./cli.ts migrate <building>` — review the dry-run diff, then `--write`. The round-trip law is asserted per write; a violation aborts — escalate it as a converter bug (row 016's suite is where it gets fixed, not your target repo).
3. **Rule the residues** — the judgment the converter refuses:
   - **Depends-on prose** (the 232) → real row ids, `Felix-gate: <text>`, or a new gate row (D44 enforcement — each new gate row named in your report); scheduling prose moves to the batch note or the Status annotation.
   - **Absent required fields** → fill ONLY with cited evidence (the repo's own ledger, git log — citation in the commit message), else the literal `unrecorded` (D63 as amended).
   - **Renamed columns** (cornerizer) → the canonical five, cell content preserved.
   - **Unescaped `|`** → escape; leading PENDING / retired synonyms / verdict-led statuses → the D63 spellings. The row's *state* is truth — only its spelling conforms; never change what a status says happened.
4. `./cli.ts lint <building>` → **0 failures**, output kept for the report.
5. **Close in the target repo:** commit there in Felix's git style; append that repo's ledger entry (new format — the migration is a session that repo's history should see); anything judgment couldn't settle → that repo's ISSUES (canon-shaped questions → the canon inbox). Buildings without a ledger get no new one minted — anti-sprawl; the board annotation carries the date.

## Judgment fence — meaning is untouchable

No reworded prose. No re-staffing. No row added or removed except gate rows replacing prose preconditions (step 3). No status *truth* changes. No canon/, sync/, doctrine/ writes. A fork this doc doesn't pre-chew is an escalation, not a guess.

## DoD — measurable

1. `doctrine lint ~/code` totals: **0 failures** — pasted verbatim into findings; every `unrecorded` counted per building.
2. Every migrated building's own ledger carries its migration entry (or its board annotation, where no ledger exists).
3. Round-trip law held on every write (the tool asserts it); per-repo `git log` shows doc-only commits.
4. Deferred buildings (live batches) named in the batch report with the boundary they wait on.
5. Batch report + baton (D64 shapes).

## Out of scope

- Meaning edits of any kind beyond typed absences and evidence-cited fills.
- The ~12,700 skipped worktree branch copies — twins conform when their branches merge; nobody edits stale checkouts.
- Row 017's serialization question; hook/CI wiring; `doctrine/` itself (escalate converter bugs to a row-16 follow-up).

## Findings

*(append here — the Dispatcher's batch report; per-building evidence rides each row's report verbatim)*

### Dispatcher's batch report · 2026-08-26

**Table.**

| Row | Status | Outcome | Pointers |
|---|---|---|---|
| 18a | LANDED | belvedere 0 failures; agents 30/103 (all `unrecorded`-gap) | agents `888f9e4`/`afb983c`/`39daf6a` |
| 18b | LANDED | hexwright 0 failures | hexwright `f7cb5e4`/`09db6fb` |
| 18c | BLOCKED | whiteboardy board half landed (166→149); ledger half refused on 2 `migrate` defects + Depends-on document-scope bug | whiteboardy `3575630`/`b82b089`/`8a39750`/`3b9a299`; §18c below |
| 18d | LANDED | bob 53/54 typed, 1 `unrecorded` (linter vocab gap) | bob `1bec7f0`/`54bdc97`/`553c5db`/`b90847e` |
| 18e | LANDED | simmy 77→1 failure (linter vocab gap) | cap-mega `b2199f62e`/`dfde315b4`/`c5a6f4dce` |
| 18f | LANDED partial | 4/5 buildings on D63 (7 residual, vocab gaps); snappy BLOCKED on a malformed ledger (~38 missing `---`) | cap-mega `38fa39ca1`/`2a7b26453`/`49b46333a`/`477ba65f3`/`351f4df91`/`56c68c567` |
| 18g | LANDED | 4 worktree boards, 83→8 failures (vocab gaps); cornerizer's renamed columns hid 97 real defects | branch `worktree-agent-a55279e2283f84743` (agents, **unmerged**) `6d73d23`/`ecd7682`; cap-mega branches task/motion-migration `869ea98`, feature/tig-avc `d166d29`, feature/cornerizer `f19a413`/`b17bb15`, feature/user-manual `f6d4edc`/`00fed9f`/`7b179a9`/`c020b9c` |
| 18h | LANDED | rooted 0/0 (2 buildings); spacex-dashboard 22→8 (2 escalated tool gaps); spacex-dashboard-c2 deferred (merged, inert worktree) | rooted `11d00d4`; cap-mega `f6be754` |

**Escalations (14, all filed `~/code/agents/ISSUES.md` D63h bullets unless noted):**

1. `doctrine/` has no `unrecorded` token — every landed row hit this (18a first; 18b/18d/18e/18g/18h corroborate). DoD 1's "0 failures" is unreachable city-wide until ruled. **Grand Architect ruling owed.**
2. The gap has sub-shapes the single token flattens: a *partial* absence (18e — model known, effort not), a *deliberately-unstaffed* row (18f — `unstaffed` is a recorded fact, not an absence), and a `PARKED` lifecycle state (18g).
3. `migrate` writes a malformed ledger head and the round-trip law prints `ok` while it does — reproduction filed (18c).
4. `migrate` can orphan a `**` in a status cell's bold run; the round-trip law is blind to it too, `annotation` being a field the rule permits to change (18f).
5. No rule recognises an unbolded pre-doctrine ledger head — 96/104 of whiteboardy's blocks, not a per-repo special case (18c).
6. `Depends-on` resolves per-document, not per-building — 28/45 of whiteboardy's residual `board.depends` failures are this bug alone; narrows 18d's cross-building question (18c).
7. No form exists for a genuine cross-*building* dependency (18d, narrowed by #6).
8. `board.columns` undercounts by roughly two orders of magnitude when a board's columns are renamed — cornerizer alone hid 97 real defects across 37 rows (18g).
9. A blank line inside a board table silently truncates it, with the lint reading the truncated remainder as clean — three sightings this wave (18f's ch2, plus corroboration elsewhere).
10. The register has no ledger→master-doc fallback for DOCTRINE §3 subproject-format buildings (inline `## Ledger`/`## Decisions`, no `LEDGER.md`) — reads "ledger none" instead of parsing (18h, rooted).
11. `parseDecisions` hardcodes the `D` id prefix — a building using `RP-`/`A`-prefixed decision ids parses 0 candidates, silently (18h).
12. No `migrate` rule covers a decisions entry whose bold run wraps the id and attribution together with no separate title; fixing by hand is an editorial title-boundary call the fence forbids guessing at (18h, spacex-dashboard ×2 files, 14 failures standing).
13. *(filed to whiteboardy's own `ISSUES.md`, not the canon inbox — repo-local)* batch 13's four rows (R1, W1, X8, B1) exist only in prose — cut, dispatched, LANDED, ledgered — but declared on no board; GENESIS's gate 26 can't compute its own dispatchability until this is fixed.
14. The kickoff detector reads any `You are ` fence as a summons — three false positives in `plans/log-tradition.md`'s letter templates, same class as row 016's two prior fixes (18a).

**Relay log (`plans/BULLETIN.md`, committed):**
- 18a → all remaining rows: the `unrecorded` vocabulary gap (escalation #1).
- 18c → 18b/18e/18h: the malformed-ledger-head `migrate` bug (#3) — lint after `--write`, never trust a clean round-trip line alone.
- 18e → wave: corroborated #1, added the partial-absence nuance (#2).
- 18f → wave: the `**`-orphan bug (#4), the blank-line board-truncation bug (#9).
- 18h → 18g: the register/decisions parser gaps (#10, #11) — 18g's worktree boards were clear of both.

**Deferrals (DoD 4):** none owed — no row found a live in-flight batch on its target building at read time. `spacex-dashboard-c2` was left untouched under row 016's stale-checkout convention (a merged, explicitly "inert; remove at leisure" worktree, not a live batch) — 18h recommends Felix `git worktree remove` it.

**DoD 1 — `doctrine lint ~/code` totals, verbatim, post-wave:**
```
=== FAILURE CLASSES
    97  ledger.head
    68  board.depends
    56  ledger.tier
    27  ledger.row
    15  decision.head
    14  ledger.decided
     8  board.staffing
     6  ledger.mantle
     5  board.tier
     4  ledger.next
     4  board.state
     3  kickoff.summons
     1  ledger.baton
     1  ledger.date
     1  issue.entry

=== TOTALS
  22 buildings · 30/30 board docs yielded a board · 33 boards · 430 rows · 416 fully typed (97%)
  9/9 ledgers parsed a tail · 3 fireable baton(s) · 196 kickoffs in 233 work docs · decision queue 52 · 31 inbox entries
  12810 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  310 failure(s) in 15 class(es)
```
Not 0 — blocked entirely by escalations #1–#12 (tool gaps, not doc defects); the vast majority of the 310 sit in whiteboardy (149, BLOCKED, its own ledger half refused) and snappy (its ledger malformed, refused). Every `unrecorded` this wave wrote is cited in its row's own report and commit messages.

**DoD 2/3:** every landed row's target ledger carries its migration entry (or board annotation where no ledger exists — rooted); every write asserted round-trip `ok`, and 18c/18f additionally *refused* writes the tool itself would have gotten wrong — verified in each row's report.

### 18c — whiteboardy · BLOCKED 2026-08-26

**Board half landed, ledger half refused.** 166 → 149 failures. The refusal is the finding: `doctrine migrate` would have made this repo *worse*, and 96 of its 104 ledger blocks have no rule at all. Three escalations filed to `~/code/agents/ISSUES.md`, one warning to the wave's bulletin, two rulings left to whiteboardy's own Architect in a freshly minted `~/code/whiteboardy/ISSUES.md`.

```
$ doctrine lint ~/code/whiteboardy          # before                after
    97  ledger.head                            97                     97
    58  board.depends                          58                     45
     3  board.staffing                          3                      0
     3  ledger.row                              3                      3
     2  ledger.tier                             2                      2
     2  ledger.decided                          2                      2
     1  board.pipe                              1                      0
  166 failure(s) in 7 class(es)            →  149 failure(s) in 5 class(es)
  62 rows · 59 fully typed (95%)           →   68 rows · 68 fully typed (100%)
```

**What landed** (four commits, doc-only, every byte of prose preserved):

1. `3575630` — **six rows were invisible to every parser in the city.** A stray blank line inside `docs/m1-editor.md` and `docs/m3-shells.md` split each board into a second, header-less table, and `docs/m3-shells.md:670` truncated SH4 on an unescaped `|` inside a code span. E11, E12, E13, SH4, SH5, SH6 recovered — 62 parsed rows → 68. This is the row's most valuable landing and it was not on the row's work list.
2. `b82b089` — three attendance riders into the Staffing parenthetical (D63d).
3. `8a39750` — seventeen Depends-on cells to D63e's two legal forms. One uniform move: `03 (blessed 2026-08-15)` → `03 · Felix-gate: blessed 2026-08-15`, and a bare Felix-hand precondition gains the `Felix-gate: ` prefix with its wording untouched.
4. `3b9a299` — `ISSUES.md` minted (D53, first need), ledger entry appended in the D63 head grammar; it parses fully typed with a fireable baton.

**The line 18c drew, and why:** land every edit whose correct form is determined today regardless of any pending ruling; escalate every edit whose form *depends* on one. That is the whole difference between the 17 cleared and the 149 standing.

**Why `migrate --write` was refused** — a converter bug, reproduced in an isolated fixture, filed as the canon inbox's first 18c entry. `ledger.pre-doctrine-head` takes the first `·` segment whole as the mantle, so whiteboardy's 13 `## ` heads (`Builder (opus-medium)`) re-emit with the tier still inside the mantle. **The fixture goes from 0 failures to 2, and the round-trip law prints `ok` while it happens** — the assertion licenses the damage because both `mantle` and `tier` are in the rule's declared `changes`. Running it here would have turned 13 failures into 26. The remaining 96 blocks are an unbolded house dialect (`<date> · <mantle> · <tier> (<rider>)` + `Changed:`/`Decided:`/`Next:` lines) that no rule recognises; three of its heads wrap across lines, which is row 016's parked note arriving. **18c did not hand-fix around it on purpose:** whiteboardy is the corpus that proves the new rule, and hand- migrating it would spend the test case to buy a number this row cannot reach anyway.

**The 45 residual `board.depends`, bucketed** — 28 of them are one tool question:

| bucket | n | disposition |
|---|---|---|
| cross-**document** row id (`X1: "16 (blessed)"`) | 23 | canon inbox — resolution scope |
| cross-document range (`E1–E9`, `SH1–SH4`, `T1–T6`, `C1–C4`, `X1–X7`) | 5 | same, plus a range spelling |
| row id declared on **no board** (`E14`, `R1`, `W1`, `X8`, `B1`, `12F`) | 6 | whiteboardy's inbox — needs rows added, fenced |
| same-doc id + scheduling tail (two legal homes, §4) | 5 | whiteboardy's inbox |
| prose whose *kind* is the question (`D21 for shells only`) | 6 | whiteboardy's inbox |

`parseBoards` builds `knownIds` per markdown file, so whiteboardy's master board and its six D45-sanctioned sub-boards cannot reference each other at all — a master board depending on its own sub-board's rows fails, and so does every sub-board row depending on the gate that blessed it. These are **not** cross-*building* references (18d's entry): one building, one register entry, ids unique across it. D63e says "row ids"; it does not say "on this board", and the linter's message asserts a scope the doctrine text never set. The register already computes the building, so the fix looks like one line.

**A board-truth defect worth more than the lint number:** batch 13's four rows — R1, W1, X8, B1 — live only in prose in GENESIS's batch-13 note. Each was cut at gate 25, dispatched, LANDED, and wrote its own ledger entry; **no board declares any of them.** E14 and the `12F` reference are the same shape. So GENESIS's one OPEN row, gate 26, cannot compute its own dispatchability — four of its five dependencies resolve to nothing. Filed to whiteboardy's inbox for gate 26, which is its own fix.

**DoD:** 1 ✗ (149, blocked — the ledger on two converter defects, 28 board cells on resolution scope, 2 `ledger.tier` on the wave-wide `unrecorded` gap that 18a/18d already filed) · 2 ✓ (ledger entry appended, parses clean) · 3 ✓ (no `--write` ran; four doc-only commits, `git status` clean) · 4 n/a (no live batch — whiteboardy's board had one OPEN row and nothing IN FLIGHT) · 5 ✓.

**Re-run contract.** When the two `migrate` rules and the resolution-scope ruling land, re-fire 18c against whiteboardy: the ledger migrates in one clean pass and 28 board cells fall out with it. Nothing landed here needs undoing.

---

### 18h — rooted + spacex ×2 · LANDED 2026-08-26

**rooted: 0/0.** Both buildings are DOCTRINE §3 subprojects (`README.md` as master doc, no `LEDGER.md`/`DECISIONS.md`), so `migrate` had nothing to write — the board was the only lint-visible surface, and it's now clean:

```
$ doctrine lint ~/code/rooted          # before               after
    4  board.depends                     4                     0
    1  board.staffing                     1                     0
  5 failure(s) in 2 class(es)       →  0 failure(s) in 0 class(es)
  25 rows · 24/25 typed (96%)      →  25 rows · 25/25 typed (100%)
```

Residues ruled by hand (no migrate rule touches Depends-on prose): `arborist` ARB-02 Staffing `Felix (Xcode UI)` → `Felix-gate (Xcode UI)`; ARB-05 Depends-on trimmed to the real row id `ARB-08`, its scheduling gloss moved to Status; ARB-16/ARB-18's internal comma inside one `Felix-gate: <text>` clause (which the column itself splits on) reworded "," → "and", wording otherwise untouched; `repot` REP-05's `Felix-gates:` (plural, not the D63 token) → `Felix-gate:`. Ledger-style entries appended to both docs' inline `## Ledger` sections in-house-style (the tool can't verify them — see below). Commit `11d00d4` (rooted, branch `chris`).

**spacex-dashboard: 22 → 8, both residual classes escalated, not hand-fixed.** `migrate --write` handled the board (verdict-leads, retired spelling, Felix-gate token — 4 edits) and the ledger's tier-slot extraction (4 edits), round-trip clean both files. Hand-ruled after: every ledger head's row parenthetical trimmed to the bare row id (`01`/`02`/`03`) or dropped where no board row ran (2 founding/admin sessions); five "Next —" (em dash) retyped "Next:" — same word, wrong punctuation, zero content change; three entries with **no** Decided:/Next: clause at all got the literal `unrecorded` per this row's own brief; row 001's Depends-on freeze-waiver aside moved from the cell (which isn't legal prose) into Status. New migration-session ledger entry appended in full D63 grammar, itself lint-clean.

```
$ doctrine lint ~/code/.../spacex-dashboard   # before              after
     7  decision.head                            7                    7
     5  ledger.row                                5                    0
     5  ledger.next                               5                    0
     3  ledger.decided                            3                    0
     2  board.verdict-leads                       2                    0
     2  board.depends                             1→0 (1 hand-fixed)   0
     1  ledger.tier                               1                    1
     1  board.retired                             1                    0
     1  board.staffing                            1                    0
  22 failure(s) in 9 class(es)             →   8 failure(s) in 2 class(es)
```

The 8 residual: **7 `decision.head`** — no migrate rule matches a decisions entry whose bold wraps `D<n> (date, decider):` instead of closing after the id (D63i wants a separately-bolded title); fixing it means choosing where each of the 7 titles ends, which is an editorial call the judgment fence reserves, not a parse. **1 `ledger.tier`** — the founding entry's own post-landing follow-up never recorded a tier; same wave-wide gap 18a/18d already filed (doctrine has zero `unrecorded` vocabulary). Both filed to `~/code/agents/ISSUES.md`. Commit `f6be754` (spacex-dashboard, `master`).

**spacex-dashboard-c2: deferred, untouched, 20 residual failures standing.** Confirmed by `git worktree list` — a linked worktree of `spacex-dashboard`, branch `chapter-2`, and that branch's own ledger entry in the mainline already reads "merged and inert; remove at leisure." Row 016's out-of-scope carve-out ("nobody edits stale checkouts — twins conform when their branches merge") applies in spirit even though the register doesn't auto-skip it (it lives outside the `.claude/worktrees/` convention the register special-cases, so it registers as its own building rather than a skipped twin — noted, not fixed, out of this row's scope). It also carries unrelated dirty local state (6 modified screenshot PNGs) unconnected to doctrine. Recommend Felix run `git worktree remove` at his convenience; no doc edit made.

**Two new canon defects filed** (`~/code/agents/ISSUES.md`, echoed to `BULLETIN.md` for 18g): (1) the register has a decisions→master-doc fallback for subprojects but no matching fallback for an inline `## Ledger` — rooted's ~29 combined ledger entries are invisible to `doctrine lint`, not failing, just unread; (2) `parseDecisions` hardcodes the id prefix `D`, so `RP-`/`A`-prefixed decisions (rooted's 34 combined) produce zero candidates and zero failures — silently, not as a reported gap. Neither trips on this row's other targets (bare `LEDGER.md` + `D<n>` ids), so DoD 1's "0 failures" for rooted is true of what the tool can see, not of the whole doc.

**DoD:** 1 — pasted above per building; rooted 0/0, spacex-dashboard 8 (both classes escalated, evidenced), spacex-dashboard-c2 deferred (worktree, out of scope) · 2 ✓ — rooted's two inline Ledger sections and spacex-dashboard's `LEDGER.md` all carry this sweep's entry · 3 ✓ — round-trip asserted `ok` on every `migrate --write`, hand edits verified by re-lint after every file · 4 n/a — no live batch on either repo · 5 ✓.

---

Kickoffs (verbatim — the Dispatcher appends `plans/RIDER.md` to each):

```
You are an Architect at opus-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/018-great-recut.md (§inputs, §method, §fence)
and execute row 18a: ~/code/agents + ~/code/agents/belvedere.
```

```
You are an Architect at opus-medium.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/018-great-recut.md (§inputs, §method, §fence)
and execute row 18b: ~/code/hexwright.
```

```
You are an Architect at opus-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/018-great-recut.md (§inputs, §method, §fence)
and execute row 18c: ~/code/whiteboardy.
```

```
You are an Architect at opus-medium.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/018-great-recut.md (§inputs, §method, §fence)
and execute row 18d: ~/code/universal_robots_sdk/bob (campaigns lunchbox, pods, theseus).
```

```
You are an Architect at opus-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/018-great-recut.md (§inputs, §method, §fence)
and execute row 18e: ~/code/universal_robots_sdk/cap-mega/simmy.
```

```
You are an Architect at opus-medium.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/018-great-recut.md (§inputs, §method, §fence)
and execute row 18f: cap-mega snappy, snappy/ch2, and the docs cluster
(units, waypoint-stepper, advanced-naming-system, node-global-parameters).
```

```
You are an Architect at opus-medium.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/018-great-recut.md (§inputs, §method, §fence)
and execute row 18g: the cap-mega worktree boards — manny, tig-avc,
schema-migration, cornerizer — each inside its own worktree, on its own branch.
```

```
You are an Architect at sonnet-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/018-great-recut.md (§inputs, §method, §fence)
and execute row 18h: ~/code/rooted (repot + archive/arborist) and the two
spacex-dashboard ledgers under cap-mega/felix/.
```

The Dispatcher's summons:

```
You are a Dispatcher at sonnet-medium.
Wear ~/code/agents/canon/mantles/dispatcher.md,
then run the wave at ~/code/agents/plans/018-great-recut.md.
Concurrency plan: ceiling 4 concurrent rows; all eight parallel-safe (disjoint
repos; 18e/f/g disjoint files within cap-mega; 18g inside per-board worktrees);
no gauge — doc-only work. Announce every dispatch (D67).
```

### 18f — cap-mega: snappy, ch2, and the docs cluster (2026-08-26)

**LANDED partial.** Four of five buildings speak D63; **snappy is BLOCKED** on a document defect that makes the converter unrunnable there. Commits in `cap-mega` (branch `dev`): `38fa39ca1` (migrate output) · `2a7b26453` (units + waypoint-stepper residues) · `49b46333a` (ch2) · `477ba65f3` (naming + node-global, by hand) · `351f4df91` (board annotations) · `56c68c567` (snappy ISSUES).

**DoD 1 — the lint, verbatim.** Four buildings, 93 rows:

```
$ doctrine lint cap-mega/{docs/units,docs/waypoint-stepper,snappy/ch2} \
                cap-mega/docs/{advanced-naming-system,node-global-parameters}.md
=== FAILURE CLASSES
     4  board.staffing
     3  board.tier
=== TOTALS
  4 buildings · 5/5 board docs yielded a board · 7 boards · 93 rows · 86 fully typed (92%)
  0 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  7 failure(s) in 2 class(es)
```

Per building: **units 4 → 0** · **advanced-naming-system 26 → 0** · **node-global-parameters 2 → 0** · **ch2 16 → 1** · **waypoint-stepper 17 → 6**. All **7 residual failures are the typed-absence vocabulary gap** — the linter has no `unrecorded` (18a/18d's bulletin entry) and D63 has no token for a deliberately unstaffed row (18f's own, filed). `unrecorded` counts written: **4** (3 tiers on waypoint-stepper rows 12–14, 1 staffing on ch2 row 05, all cited below). No hand-patching of `doctrine/`.

**DoD 2 — migration entries.** None of the four buildings carries a `LEDGER.md`, so per §method step 5 the **board annotation carries the date**: one dated `> **D63 migration (2026-08-26, `agents` row 18f)**` note under each of the five boards, naming that board's residual lint. No ledger minted.

**DoD 3 — round-trip.** Held on all three `--write` runs (`round-trip ok` per file); a second `doctrine migrate` over each of the four buildings afterwards reports **"already in the current grammar — nothing to migrate"**, which also proves the by-hand work on the `docs` pair matches what the converter would have emitted. Every commit is doc-only.

**DoD 4 — deferrals.** None. Zero IN FLIGHT rows across all five boards; `cap-mega`'s working tree was dirty only under `simmy/` (18e's live work), never touched here.

#### Two converter/doctrine defects found — both escalated, neither hand-fixed

1. **`migrate` orphans a `**` when a status cell's bold run is wider than its leading token** (`replaceLead`, `src/migrate.ts`). `**MERGED (2026-08-11, `6dc03690`)** — DoD met …` → `LANDED — MERGED (2026-08-11, `6dc03690`)** — DoD met …`. **The round-trip law does not catch it** (`annotation` is a declared-changed field), so "round-trip ok" is no proof of a clean diff. Four rows in `advanced-naming-system.md` (N12/N13/N16/N17); the same file's eight *unbolded* `MERGED (…)` cells convert correctly. `status.retired` and `status.pending` share the helper. 18f refused those writes and hand-applied the correct spelling (`**LANDED — MERGED (…)**`) under §method step 3's residue authority. Filed to the canon inbox as a row-16 follow-up; posted to the bulletin, since every remaining wave row runs `--write`.

2. **snappy's `LEDGER.md` is missing ~38 `---` separators** — 22 entries parse where ~60 session heads exist, so runs of sessions are glued into single entries (one swallows 23,587 characters across eight sessions). `migrate` emits 16 form-correct head edits and then **aborts with 5 round-trip violations**, because the heads it rewrote sit inside *other* entries' `body`/`decided`/`next`. The tool blames itself ("This is a converter bug, not a doc defect") — **it is wrong**: the parse is correct and the document is malformed. Repairing it is form-only by §7's letter but re-frames 38 invisible entries into the parse, each then owing its own residue ruling — a row's worth of work and a structural move §method does not pre-chew, so it is **a fork, escalated, not a guess** (`snappy/ISSUES.md` + the canon inbox). snappy stays BLOCKED until it is ruled.

#### A third find, fixed: a blank line silently truncates a board

ch2's board was **three tables** — blank lines after rows 11 and 12 — so rows 12 and 13 were invisible to the parser *and* to the lint, which therefore reported them as zero defects. Removing the two blank lines (form only) exposed 5 further residues, including row 012's leading `MERGED` verdict. **A low row count is a symptom, not a clean bill**; bulletined for the other rows.

#### Residue rulings, by class

- **Depends-on prose → row ids + `Felix-gate:`** (30 segments). Every Felix ruling cited in a dependency became `Felix-gate: <text>` after checking its decider in the doc's own decisions list — ch2's D32/D34/D38/D40/D43 are all recorded `(…, Felix)`; naming's FG-rulings / FG-toml{,-2,-4,-5} / FG-venue / F7 / F9 / F11 / F12-chase / F13 / §19 rulings likewise. **No new gate rows were cut**: every prose precondition sat on an already-LANDED row, where a retroactive gate row would be fiction. Scheduling and qualifying prose moved verbatim into the Status annotation (§method step 3's sanctioned home) — e.g. units row 03's "(07 gates suite evidence only)", ch2 row 02's bands parenthetical, waypoint-stepper row 11's "(icons landed)".
- **`01–03 ✓` → `01 · 02 · 03`** (ch2 row 04). 18c parked en-dash ranges as ambiguous across sub-boards; this one is unambiguous — all three ids sit on the same board — so it was expanded rather than parked. If the Grand Architect rules ranges legal, this is a no-op.
- **Verdict-led statuses → `LANDED — <verdict>`** (13 rows): 12 in `advanced-naming-system`, 1 in ch2 (row 12's `MERGED to feature/snappy (D42)`, visible only after the table was reunited).
- **Non-lifecycle leads → the state leads** (3): waypoint-stepper FG1 `PART-LANDED` → `OPEN — **PART-LANDED …**` (its own Status names remaining bench items); row 24 `RUN` → `LANDED — **RUN …**` (the run happened; its verdict is E1's job); ch2 row 04 `RULED in part` → `OPEN — **RULED in part …**` (the budget-blessing leg is still owed). In all three the annotation is byte-preserved — only the leading state was added.
- **Absent tiers → `unrecorded`** (waypoint-stepper 12/13/14). Evidence was sought first: `docs/waypoint-stepper/LOG.md:43,57,67` records those sessions as "Architect (fable)" — a *model*, not one of D63's tier tokens — so no cited fill was available. Mantle kept, rider kept: `Architect · unrecorded (in-session; Felix released the mantle's no-code rule for this arc, 2026-08-13)`.
- **`—` staffing → `unrecorded`** (ch2 row 05, KILLED at D34 before it was ever staffed).
- **`unstaffed` left verbatim** (waypoint-stepper 18/19/23) — a recorded fact, not an absent record; see the escalation.
- **Decision titles → bold labels** (ch2 D34, D43). The doc's own words were promoted into the label slot with their bytes and case intact (`**four rulings.**`, `**three rulings, one session.**`) — nothing authored.
- **An off-board dependency** (`node-global-parameters` row B depends on `A`). Row A was dispatched, landed and audited on 2026-08-08 and removed when the board was re-cut to D42–D45 (§13). Re-adding it would be adding a row, so the dependency reads `—` and the Status annotation carries "(after row A, landed and audited off-board — §13)".

**Untouched, by law:** snappy's `README.md:653` row 13 (`CHARTERED` + `Felix (bench) + keyboard session TBD`), its `README.md:1229` D19 head, and its `ISSUES.md` `##` entries — all inside the BLOCKED building and all judgment for snappy's own Architect; noted in `snappy/ISSUES.md`. No meaning edited, no row added or removed, no re-staffing, no writes to `canon/`, `sync/` or `doctrine/`.

---

### 18g — the cap-mega worktree boards · LANDED 2026-08-26

Four boards, four worktrees, four branches, seven commits, **zero touches to the shared `cap-mega` checkout** (still on `dev`, never switched). Every edit was made inside the worktree that owns the branch the board lives on.

```
$ doctrine lint <the four 18g targets>                    # before          after
  manny        (feature/user-manual)                          71               2
  tig-avc      (feature/tig-avc)                               8               0
  schema-migr. (task/motion-migration)                         3               1
  cornerizer   (feature/cornerizer)                            1 *            5
                                                            ----            ----
                                                              83 *              8
  * the cornerizer "1" is a lie — see below. Its real pre-state was 97.

=== FAILURE CLASSES (after)          === TOTALS (after)
     3  board.state                    4 buildings · 4/4 board docs yielded a board
     2  board.staffing                 4 boards · 83 rows · 80 fully typed (96%)
     2  ledger.tier                    1/1 ledgers parsed a tail · baton felix
     1  board.depends                  8 failure(s) in 4 class(es)
```

**The row's most valuable landing was not on its work list: `board.columns` hides an entire board, and the lint line that reports it undercounts by two orders of magnitude.** cornerizer's header read `| Row | What | Staffing | Deps | Status |` — one renamed column and two swapped ones. `doctrine lint` reported **1 failure** and `0 boards · 0 rows`, which reads like a nearly-clean building. Re-cutting the header to the canonical five (and swapping the two middle columns so every cell kept its meaning) turned that 1 into **97 real failures across 37 rows that no parser in the city had ever seen** — 91 `board.depends`, 4 `board.state`, 2 `board.staffing`. A `board.columns` failure is not a small job; the number behind it is unknown until the columns are re-cut.

Hiding inside it: **a blank line between 031 and 032** (18c's whiteboardy find, 18f's ch2 find — third sighting in one wave) that would have kept 032–038 invisible the moment the columns were fixed. Any column re-cut must sweep for it in the same pass.

**Commits** (doc-only, one board per commit):

| branch | commit | what |
|---|---|---|
| `task/motion-migration` | `869ea98` | schema-migration: `Felix (named gate)` → `Felix-gate`; M2's `(staffed there)` filled `Builder · opus-high (staffed there — row V-B …)` from `docs/node-global-parameters.md`:1525 |
| `feature/tig-avc` | `d166d29` | tig-avc: 4× `Felix` → `Felix-gate`; row 07's struck `~~Builder · opus-medium~~ Felix, by hand`; row 08's struck `~~05~~`; row 06 `OPEN (PENDING …)` → `OPEN — PENDING …`; row 005's `EXECUTED` |
| `feature/cornerizer` | `f19a413` | cornerizer: the canonical five columns + the blank-line split |
| `feature/cornerizer` | `b17bb15` | cornerizer: 91 `board.depends` → 0; 028's state token |
| `feature/user-manual` | `f6d4edc` | manny: `doctrine migrate --write` (2 edits) |
| `feature/user-manual` | `00fed9f` | manny: 26 Depends-on cells |
| `feature/user-manual` | `7b179a9`, `c020b9c` | manny: 17 ledger heads + the 18g entry |

**The judgment calls, named:**

- **`EXECUTED` (tig-avc 05) → `OPEN — EXECUTED …`.** The gate reviewed everything, Felix overrode the merge, and the cell's own words end "merge waits on 06 + 11 + 12". A merge gate that has not merged is not LANDED; OPEN is the row's state and every byte of the verdict rides the annotation unchanged.
- **`WEDGED` (cornerizer C28) → `**LANDED** — **WEDGED** …`.** Determinate: the same cell ends `MERGED 2026-08-18`. Only the state token was added.
- **`PARKED` (cornerizer C8/C22/C34) → untouched, escalated.** Not determinate — §4's lifecycle is five words, `PARKED` is none of them and is not a retired synonym either, yet the Architect mantle uses the verb as doctrine. Three candidate rulings that are not equivalent; filed to the canon inbox. Same for `staffed when unparked` (C8/C34), which is a *recorded* fact, not an absent record — 18f drew the same line on snappy's `unstaffed`, independently.
- **Depends-on: `✓` and `merged` are not information.** The depended row's own Status carries whether it landed or merged, so `C17 merged ✓` → `C17` loses nothing. Prose that *was* information moved verbatim to the Status annotation as `Depends-on note: …` (14 cornerizer rows, 2 manny rows) — §4's own disposal route. Ranges were expanded to ids (`14–23` → ten ids, `16–20` → five), which is determinate on a single board.
- **Blessings became gates, with their attribution checked one by one.** `01 blessed ✓` → `01 · Felix-gate: blessed` (manny, ×5). In cornerizer every `D<n>` precondition was traced to its ruler before it was spelled: D9/D10/D18/D19/D20/D21 are Felix's (the §Felix-forks note under the board and `docs/cornerizer.md`:4406/5375) and became `Felix-gate: D<n>`; **D15 is the Architect's** (ruled at the batch-7 fold under Felix's delegated criterion), so it is not a gate — it was dropped from the Depends-on column, where its own row's Work cell already names it.
- **manny's ledger tiers: five cited, four `unrecorded`.** Cited — rows 03/04/05/06/07 from the board's own Staffing column; both Dispatcher sittings from the summonses fenced at `LEDGER.md`:136/234; founding and founding-review from `keel.md` §7 ("Founding + blueprint: `fable-max`") and the founding summons at `keel.md`:348. Not cited, so typed `unrecorded` — the M0 backfill (Grand Architect) and the D11 review. Twelve `Decided:` and one `Next:` were typed `unrecorded` rather than reconstructed from the entries' narrative prose: reconstructing what a session decided is interpretation, not citation.

**The `migrate` warning did not fire here.** The BULLETIN's `ledger.pre-doctrine-head` defect needs an unbolded pre-D63 head; manny's were already `**<date> · <mantle> …**`, so `migrate` produced exactly 2 correct edits (row 28's leading `PENDING`, row 12's tier slot) and the post-write lint confirmed it. Every other repo-side edit in this row was by hand.

**The 8 residual failures, every one already escalated:**

| n | class | what | where it waits |
|---|---|---|---|
| 3 | `board.state` | cornerizer `PARKED` ×3 | canon inbox — 18g's entry |
| 2 | `board.staffing` | cornerizer `staffed when unparked` ×2 | same entry |
| 2 | `ledger.tier` | manny's two `unrecorded` tiers | the wave-wide `unrecorded` gap (18a/18d/18e) |
| 1 | `board.depends` | schema-migration M2's `V-A` | 18c's resolution-scope entry — `V-A` is a real row id, on `docs/node-global-parameters.md`; `parseBoards` builds `knownIds` per file |

**DoD:** 1 ✗ by the letter (8, all four causes escalated and none of them this row's to rule) · 2 ✓ (manny's ledger carries its migration entry and parses fully typed with a Felix-held baton; the other three buildings have no ledger and none was minted — the board annotation carries the date) · 3 ✓ (round-trip `ok` on the one `--write`, verified by a post-write lint per the BULLETIN; all seven commits doc-only, each worktree's pre-existing dirt left untouched) · 4 n/a — **no building was deferred**: nothing was IN FLIGHT on any of the four boards (cornerizer 037 OPEN / 038 BLOCKED, tig-avc 06/10/12 OPEN, schema-migration all OPEN behind its M0 Felix-gate, manny 28 OPEN — PENDING) · 5 ✓.

**Untouched, by law:** the ~12,700 branch twins of these files; the shared `cap-mega` checkout; the pre-existing uncommitted `pom.xml` (cornerizer) and `manual.typ` (user-manual) in those worktrees. No meaning edited, no row added or removed, no re-staffing, no status truth changed, no writes to `canon/`, `sync/` or `doctrine/`.
