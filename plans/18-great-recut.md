# 18 — v3: the great re-cut

**Status:** OPEN · **Depends on:** 16 · **Staffing:** Dispatcher · sonnet-medium
(tends the wave below)

## Mission

Every doctrine artifact in every building, history included, speaks the D63 grammar —
one grammar, every era, no parser compat branch ever. Migration is **form only**: the
converter moves shape, sessions rule residues, nobody paraphrases a byte of meaning
(D63's molt clause; F1's round-trip law aborts a violating write). Pre-authorized
city-wide by the Sovereign (D63/D65: "We'll migrate every project, I don't care").

## Inputs — read before working (every wave session)

- [DOCTRINE](../canon/work/DOCTRINE.md) §§3, 4, 7, 8 — the target grammar, D63/D64
  amended, `unrecorded` included (§8, the molt clause).
- [Row 16's findings](16-doctrine-linter.md) — the tool, the failure classes, the
  residue law (F2), the register rule.
- The tool: `~/code/agents/doctrine/` — `./cli.ts lint <path>` ·
  `./cli.ts migrate <building> [--write]`. Trust its dry-run diff; a round-trip
  violation is a converter bug — STOP and escalate, never hand-fix around it.
- Your target buildings' own docs: master doc, ledger tail, board — read before
  touching (§method step 1).

## The wave — one row per venue, each row one session

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 18a | agents + belvedere — MAP depends-on cells (19), LEDGER heads (44) + row slots (18), pre-D45 summons lines (plans/01, 04), belvedere tail's row slot | — | Architect · opus-high (dispatched, scoped) | LANDED (2026-08-26) — belvedere 0 failures, agents 30/103 (linter unrecorded gap, escalated), commits 888f9e4/afb983c/39daf6a |
| 18b | hexwright — ledger 9 heads (dry-run proven), 9 decisions: deciders by evidence or `unrecorded` | — | Architect · opus-medium | LANDED (2026-08-26) — 0 lint failures, commits f7cb5e4/09db6fb in hexwright |
| 18c | whiteboardy — house-format ledger ×103, GENESIS + 6 sub-boards, the m3-shells:670 unescaped pipe | — | Architect · opus-high | BLOCKED (2026-08-26) — board half landed (166 → 149; six rows recovered from invisibility); ledger half refused on two `migrate` defects, 28 board cells on Depends-on resolution scope. Findings below; commits `3575630`/`b82b089`/`8a39750`/`3b9a299` |
| 18d | bob — lunchbox, pods, theseus: DONE→LANDED, PASSED/MERGED re-spellings, depends prose | — | Architect · opus-medium | LANDED (2026-08-26) — 53/54 typed, 1 unrecorded (linter vocab gap, escalated), commits 1bec7f0/54bdc97/553c5db/b90847e |
| 18e | cap-mega/simmy — ledger 29 entries (5 parse), ISSUES ## headings → D63h bullets, board depends | — | Architect · opus-high | LANDED (2026-08-26) — 77→1 failure (linter unrecorded gap, escalated), commits b2199f62e/dfde315b4/c5a6f4dce (cap-mega) |
| 18f | cap-mega snappy + snappy/ch2 + docs cluster (units, waypoint-stepper, advanced-naming, node-param) | — | Architect · opus-medium | LANDED partial (2026-08-26) — 4 of 5 buildings migrated (7 residual, all the escalated vocab gaps); **snappy BLOCKED** on a malformed ledger, escalated. Findings §18f |
| 18g | cap-mega worktree boards — manny, tig-avc, schema-migration, cornerizer (columns re-cut to the canonical five): each edited inside its own worktree, committed on its own branch | — | Architect · opus-medium | LANDED (2026-08-26) — 83→8 failures (unrecorded/PARKED vocab gaps, escalated); findings on branch `worktree-agent-a55279e2283f84743` (agents repo, unmerged — commits 6d73d23/ecd7682), plus cap-mega branches task/motion-migration `869ea98`, feature/tig-avc `d166d29`, feature/cornerizer `f19a413`/`b17bb15`, feature/user-manual `f6d4edc`/`00fed9f`/`7b179a9`/`c020b9c` — Architect merges at review |
| 18h | rooted (repot + arborist archive) + spacex ×2 — small sweeps; absent Decided:/Next: → `unrecorded` | — | Architect · sonnet-high | LANDED (2026-08-26) — rooted 0/0 (2 buildings); spacex-dashboard 22→8 (both escalated tool gaps); spacex-dashboard-c2 deferred (merged, inert worktree). Two new canon defects filed. Commits: rooted `11d00d4`, spacex-dashboard `f6be754` |

**Batch note (cut 2026-08-26, GA-10).** All eight parallel-safe: disjoint repos;
18e/f/g share cap-mega but touch disjoint files, and 18g works inside per-board
worktrees (the shared checkout's branch is NEVER switched — §10). Concurrency plan:
**ceiling 4 concurrent**, no gauge — doc-only work, no shared live resources beyond
disk. Dispatcher-tended (D61); **the announce duty (D67) runs its first live wave
here** — every fire posted: row · tier · vehicle.

## Method — the shared recipe, per building

1. **Read first:** the building's master doc + ledger tail + board. **A live batch
   defers that building** — migration lands at its landing boundary, never over
   in-flight work (v2's lesson); a deferral is reported, not silent. Check
   belvedere's board especially (probes P1/P2/P4 may be running).
2. `./cli.ts migrate <building>` — review the dry-run diff, then `--write`. The
   round-trip law is asserted per write; a violation aborts — escalate it as a
   converter bug (row 16's suite is where it gets fixed, not your target repo).
3. **Rule the residues** — the judgment the converter refuses:
   - **Depends-on prose** (the 232) → real row ids, `Felix-gate: <text>`, or a new
     gate row (D44 enforcement — each new gate row named in your report); scheduling
     prose moves to the batch note or the Status annotation.
   - **Absent required fields** → fill ONLY with cited evidence (the repo's own
     ledger, git log — citation in the commit message), else the literal
     `unrecorded` (D63 as amended).
   - **Renamed columns** (cornerizer) → the canonical five, cell content preserved.
   - **Unescaped `|`** → escape; leading PENDING / retired synonyms / verdict-led
     statuses → the D63 spellings. The row's *state* is truth — only its spelling
     conforms; never change what a status says happened.
4. `./cli.ts lint <building>` → **0 failures**, output kept for the report.
5. **Close in the target repo:** commit there in Felix's git style; append that
   repo's ledger entry (new format — the migration is a session that repo's history
   should see); anything judgment couldn't settle → that repo's ISSUES (canon-shaped
   questions → the canon inbox). Buildings without a ledger get no new one minted —
   anti-sprawl; the board annotation carries the date.

## Judgment fence — meaning is untouchable

No reworded prose. No re-staffing. No row added or removed except gate rows replacing
prose preconditions (step 3). No status *truth* changes. No canon/, sync/, doctrine/
writes. A fork this doc doesn't pre-chew is an escalation, not a guess.

## DoD — measurable

1. `doctrine lint ~/code` totals: **0 failures** — pasted verbatim into findings;
   every `unrecorded` counted per building.
2. Every migrated building's own ledger carries its migration entry (or its board
   annotation, where no ledger exists).
3. Round-trip law held on every write (the tool asserts it); per-repo `git log`
   shows doc-only commits.
4. Deferred buildings (live batches) named in the batch report with the boundary
   they wait on.
5. Batch report + baton (D64 shapes).

## Out of scope

- Meaning edits of any kind beyond typed absences and evidence-cited fills.
- The ~12,700 skipped worktree branch copies — twins conform when their branches
  merge; nobody edits stale checkouts.
- Row 17's serialization question; hook/CI wiring; `doctrine/` itself (escalate
  converter bugs to a row-16 follow-up).

## Findings

*(append here — the Dispatcher's batch report; per-building evidence rides each
row's report verbatim)*

### 18c — whiteboardy · BLOCKED 2026-08-26

**Board half landed, ledger half refused.** 166 → 149 failures. The refusal is the
finding: `doctrine migrate` would have made this repo *worse*, and 96 of its 104 ledger
blocks have no rule at all. Three escalations filed to `~/code/agents/ISSUES.md`, one
warning to the wave's bulletin, two rulings left to whiteboardy's own Architect in a
freshly minted `~/code/whiteboardy/ISSUES.md`.

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

1. `3575630` — **six rows were invisible to every parser in the city.** A stray blank
   line inside `docs/m1-editor.md` and `docs/m3-shells.md` split each board into a
   second, header-less table, and `docs/m3-shells.md:670` truncated SH4 on an unescaped
   `|` inside a code span. E11, E12, E13, SH4, SH5, SH6 recovered — 62 parsed rows → 68.
   This is the row's most valuable landing and it was not on the row's work list.
2. `b82b089` — three attendance riders into the Staffing parenthetical (D63d).
3. `8a39750` — seventeen Depends-on cells to D63e's two legal forms. One uniform move:
   `03 (blessed 2026-08-15)` → `03 · Felix-gate: blessed 2026-08-15`, and a bare
   Felix-hand precondition gains the `Felix-gate: ` prefix with its wording untouched.
4. `3b9a299` — `ISSUES.md` minted (D53, first need), ledger entry appended in the
   D63 head grammar; it parses fully typed with a fireable baton.

**The line 18c drew, and why:** land every edit whose correct form is determined today
regardless of any pending ruling; escalate every edit whose form *depends* on one. That
is the whole difference between the 17 cleared and the 149 standing.

**Why `migrate --write` was refused** — a converter bug, reproduced in an isolated
fixture, filed as the canon inbox's first 18c entry. `ledger.pre-doctrine-head` takes
the first `·` segment whole as the mantle, so whiteboardy's 13 `## ` heads
(`Builder (opus-medium)`) re-emit with the tier still inside the mantle. **The fixture
goes from 0 failures to 2, and the round-trip law prints `ok` while it happens** — the
assertion licenses the damage because both `mantle` and `tier` are in the rule's
declared `changes`. Running it here would have turned 13 failures into 26. The
remaining 96 blocks are an unbolded house dialect (`<date> · <mantle> · <tier>
(<rider>)` + `Changed:`/`Decided:`/`Next:` lines) that no rule recognises; three of its
heads wrap across lines, which is row 16's parked note arriving. **18c did not hand-fix
around it on purpose:** whiteboardy is the corpus that proves the new rule, and hand-
migrating it would spend the test case to buy a number this row cannot reach anyway.

**The 45 residual `board.depends`, bucketed** — 28 of them are one tool question:

| bucket | n | disposition |
|---|---|---|
| cross-**document** row id (`X1: "16 (blessed)"`) | 23 | canon inbox — resolution scope |
| cross-document range (`E1–E9`, `SH1–SH4`, `T1–T6`, `C1–C4`, `X1–X7`) | 5 | same, plus a range spelling |
| row id declared on **no board** (`E14`, `R1`, `W1`, `X8`, `B1`, `12F`) | 6 | whiteboardy's inbox — needs rows added, fenced |
| same-doc id + scheduling tail (two legal homes, §4) | 5 | whiteboardy's inbox |
| prose whose *kind* is the question (`D21 for shells only`) | 6 | whiteboardy's inbox |

`parseBoards` builds `knownIds` per markdown file, so whiteboardy's master board and its
six D45-sanctioned sub-boards cannot reference each other at all — a master board
depending on its own sub-board's rows fails, and so does every sub-board row depending
on the gate that blessed it. These are **not** cross-*building* references (18d's
entry): one building, one register entry, ids unique across it. D63e says "row ids"; it
does not say "on this board", and the linter's message asserts a scope the doctrine text
never set. The register already computes the building, so the fix looks like one line.

**A board-truth defect worth more than the lint number:** batch 13's four rows — R1, W1,
X8, B1 — live only in prose in GENESIS's batch-13 note. Each was cut at gate 25,
dispatched, LANDED, and wrote its own ledger entry; **no board declares any of them.**
E14 and the `12F` reference are the same shape. So GENESIS's one OPEN row, gate 26,
cannot compute its own dispatchability — four of its five dependencies resolve to
nothing. Filed to whiteboardy's inbox for gate 26, which is its own fix.

**DoD:** 1 ✗ (149, blocked — the ledger on two converter defects, 28 board cells on
resolution scope, 2 `ledger.tier` on the wave-wide `unrecorded` gap that 18a/18d already
filed) · 2 ✓ (ledger entry appended, parses clean) · 3 ✓ (no `--write` ran; four
doc-only commits, `git status` clean) · 4 n/a (no live batch — whiteboardy's board had
one OPEN row and nothing IN FLIGHT) · 5 ✓.

**Re-run contract.** When the two `migrate` rules and the resolution-scope ruling land,
re-fire 18c against whiteboardy: the ledger migrates in one clean pass and 28 board
cells fall out with it. Nothing landed here needs undoing.

---

### 18h — rooted + spacex ×2 · LANDED 2026-08-26

**rooted: 0/0.** Both buildings are DOCTRINE §3 subprojects (`README.md` as master doc,
no `LEDGER.md`/`DECISIONS.md`), so `migrate` had nothing to write — the board was the
only lint-visible surface, and it's now clean:

```
$ doctrine lint ~/code/rooted          # before               after
    4  board.depends                     4                     0
    1  board.staffing                     1                     0
  5 failure(s) in 2 class(es)       →  0 failure(s) in 0 class(es)
  25 rows · 24/25 typed (96%)      →  25 rows · 25/25 typed (100%)
```

Residues ruled by hand (no migrate rule touches Depends-on prose): `arborist` ARB-02
Staffing `Felix (Xcode UI)` → `Felix-gate (Xcode UI)`; ARB-05 Depends-on trimmed to the
real row id `ARB-08`, its scheduling gloss moved to Status; ARB-16/ARB-18's internal
comma inside one `Felix-gate: <text>` clause (which the column itself splits on)
reworded "," → "and", wording otherwise untouched; `repot` REP-05's `Felix-gates:`
(plural, not the D63 token) → `Felix-gate:`. Ledger-style entries appended to both
docs' inline `## Ledger` sections in-house-style (the tool can't verify them — see
below). Commit `11d00d4` (rooted, branch `chris`).

**spacex-dashboard: 22 → 8, both residual classes escalated, not hand-fixed.**
`migrate --write` handled the board (verdict-leads, retired spelling, Felix-gate token
— 4 edits) and the ledger's tier-slot extraction (4 edits), round-trip clean both
files. Hand-ruled after: every ledger head's row parenthetical trimmed to the bare row
id (`01`/`02`/`03`) or dropped where no board row ran (2 founding/admin sessions);
five "Next —" (em dash) retyped "Next:" — same word, wrong punctuation, zero content
change; three entries with **no** Decided:/Next: clause at all got the literal
`unrecorded` per this row's own brief; row 01's Depends-on freeze-waiver aside moved
from the cell (which isn't legal prose) into Status. New migration-session ledger
entry appended in full D63 grammar, itself lint-clean.

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

The 8 residual: **7 `decision.head`** — no migrate rule matches a decisions entry whose
bold wraps `D<n> (date, decider):` instead of closing after the id (D63i wants a
separately-bolded title); fixing it means choosing where each of the 7 titles ends,
which is an editorial call the judgment fence reserves, not a parse. **1 `ledger.tier`**
— the founding entry's own post-landing follow-up never recorded a tier; same
wave-wide gap 18a/18d already filed (doctrine has zero `unrecorded` vocabulary). Both
filed to `~/code/agents/ISSUES.md`. Commit `f6be754` (spacex-dashboard, `master`).

**spacex-dashboard-c2: deferred, untouched, 20 residual failures standing.** Confirmed
by `git worktree list` — a linked worktree of `spacex-dashboard`, branch `chapter-2`,
and that branch's own ledger entry in the mainline already reads "merged and inert;
remove at leisure." Row 16's out-of-scope carve-out ("nobody edits stale checkouts —
twins conform when their branches merge") applies in spirit even though the register
doesn't auto-skip it (it lives outside the `.claude/worktrees/` convention the register
special-cases, so it registers as its own building rather than a skipped twin — noted,
not fixed, out of this row's scope). It also carries unrelated dirty local state
(6 modified screenshot PNGs) unconnected to doctrine. Recommend Felix run `git worktree
remove` at his convenience; no doc edit made.

**Two new canon defects filed** (`~/code/agents/ISSUES.md`, echoed to `BULLETIN.md` for
18g): (1) the register has a decisions→master-doc fallback for subprojects but no
matching fallback for an inline `## Ledger` — rooted's ~29 combined ledger entries are
invisible to `doctrine lint`, not failing, just unread; (2) `parseDecisions` hardcodes
the id prefix `D`, so `RP-`/`A`-prefixed decisions (rooted's 34 combined) produce zero
candidates and zero failures — silently, not as a reported gap. Neither trips on this
row's other targets (bare `LEDGER.md` + `D<n>` ids), so DoD 1's "0 failures" for rooted
is true of what the tool can see, not of the whole doc.

**DoD:** 1 — pasted above per building; rooted 0/0, spacex-dashboard 8 (both classes
escalated, evidenced), spacex-dashboard-c2 deferred (worktree, out of scope) · 2 ✓ —
rooted's two inline Ledger sections and spacex-dashboard's `LEDGER.md` all carry this
sweep's entry · 3 ✓ — round-trip asserted `ok` on every `migrate --write`, hand edits
verified by re-lint after every file · 4 n/a — no live batch on either repo · 5 ✓.

---

Kickoffs (verbatim — the Dispatcher appends `plans/RIDER.md` to each):

```
You are an Architect at opus-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/18-great-recut.md (§inputs, §method, §fence)
and execute row 18a: ~/code/agents + ~/code/agents/belvedere.
```

```
You are an Architect at opus-medium.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/18-great-recut.md (§inputs, §method, §fence)
and execute row 18b: ~/code/hexwright.
```

```
You are an Architect at opus-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/18-great-recut.md (§inputs, §method, §fence)
and execute row 18c: ~/code/whiteboardy.
```

```
You are an Architect at opus-medium.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/18-great-recut.md (§inputs, §method, §fence)
and execute row 18d: ~/code/universal_robots_sdk/bob (campaigns lunchbox, pods, theseus).
```

```
You are an Architect at opus-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/18-great-recut.md (§inputs, §method, §fence)
and execute row 18e: ~/code/universal_robots_sdk/cap-mega/simmy.
```

```
You are an Architect at opus-medium.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/18-great-recut.md (§inputs, §method, §fence)
and execute row 18f: cap-mega snappy, snappy/ch2, and the docs cluster
(units, waypoint-stepper, advanced-naming-system, node-global-parameters).
```

```
You are an Architect at opus-medium.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/18-great-recut.md (§inputs, §method, §fence)
and execute row 18g: the cap-mega worktree boards — manny, tig-avc,
schema-migration, cornerizer — each inside its own worktree, on its own branch.
```

```
You are an Architect at sonnet-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/18-great-recut.md (§inputs, §method, §fence)
and execute row 18h: ~/code/rooted (repot + archive/arborist) and the two
spacex-dashboard ledgers under cap-mega/felix/.
```

The Dispatcher's summons:

```
You are a Dispatcher at sonnet-medium.
Wear ~/code/agents/canon/mantles/dispatcher.md,
then run the wave at ~/code/agents/plans/18-great-recut.md.
Concurrency plan: ceiling 4 concurrent rows; all eight parallel-safe (disjoint
repos; 18e/f/g disjoint files within cap-mega; 18g inside per-board worktrees);
no gauge — doc-only work. Announce every dispatch (D67).
```

### 18f — cap-mega: snappy, ch2, and the docs cluster (2026-08-26)

**LANDED partial.** Four of five buildings speak D63; **snappy is BLOCKED** on a document
defect that makes the converter unrunnable there. Commits in `cap-mega` (branch `dev`):
`38fa39ca1` (migrate output) · `2a7b26453` (units + waypoint-stepper residues) ·
`49b46333a` (ch2) · `477ba65f3` (naming + node-global, by hand) · `351f4df91` (board
annotations) · `56c68c567` (snappy ISSUES).

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

Per building: **units 4 → 0** · **advanced-naming-system 26 → 0** ·
**node-global-parameters 2 → 0** · **ch2 16 → 1** · **waypoint-stepper 17 → 6**.
All **7 residual failures are the typed-absence vocabulary gap** — the linter has no
`unrecorded` (18a/18d's bulletin entry) and D63 has no token for a deliberately unstaffed
row (18f's own, filed). `unrecorded` counts written: **4** (3 tiers on waypoint-stepper
rows 12–14, 1 staffing on ch2 row 05, all cited below). No hand-patching of `doctrine/`.

**DoD 2 — migration entries.** None of the four buildings carries a `LEDGER.md`, so per
§method step 5 the **board annotation carries the date**: one dated `> **D63 migration
(2026-08-26, `agents` row 18f)**` note under each of the five boards, naming that board's
residual lint. No ledger minted.

**DoD 3 — round-trip.** Held on all three `--write` runs (`round-trip ok` per file); a
second `doctrine migrate` over each of the four buildings afterwards reports **"already in
the current grammar — nothing to migrate"**, which also proves the by-hand work on the
`docs` pair matches what the converter would have emitted. Every commit is doc-only.

**DoD 4 — deferrals.** None. Zero IN FLIGHT rows across all five boards; `cap-mega`'s
working tree was dirty only under `simmy/` (18e's live work), never touched here.

#### Two converter/doctrine defects found — both escalated, neither hand-fixed

1. **`migrate` orphans a `**` when a status cell's bold run is wider than its leading
   token** (`replaceLead`, `src/migrate.ts`). `**MERGED (2026-08-11, `6dc03690`)** — DoD
   met …` → `LANDED — MERGED (2026-08-11, `6dc03690`)** — DoD met …`. **The round-trip law
   does not catch it** (`annotation` is a declared-changed field), so "round-trip ok" is no
   proof of a clean diff. Four rows in `advanced-naming-system.md` (N12/N13/N16/N17); the
   same file's eight *unbolded* `MERGED (…)` cells convert correctly. `status.retired` and
   `status.pending` share the helper. 18f refused those writes and hand-applied the correct
   spelling (`**LANDED — MERGED (…)**`) under §method step 3's residue authority. Filed to
   the canon inbox as a row-16 follow-up; posted to the bulletin, since every remaining
   wave row runs `--write`.

2. **snappy's `LEDGER.md` is missing ~38 `---` separators** — 22 entries parse where ~60
   session heads exist, so runs of sessions are glued into single entries (one swallows
   23,587 characters across eight sessions). `migrate` emits 16 form-correct head edits and
   then **aborts with 5 round-trip violations**, because the heads it rewrote sit inside
   *other* entries' `body`/`decided`/`next`. The tool blames itself ("This is a converter
   bug, not a doc defect") — **it is wrong**: the parse is correct and the document is
   malformed. Repairing it is form-only by §7's letter but re-frames 38 invisible entries
   into the parse, each then owing its own residue ruling — a row's worth of work and a
   structural move §method does not pre-chew, so it is **a fork, escalated, not a guess**
   (`snappy/ISSUES.md` + the canon inbox). snappy stays BLOCKED until it is ruled.

#### A third find, fixed: a blank line silently truncates a board

ch2's board was **three tables** — blank lines after rows 11 and 12 — so rows 12 and 13
were invisible to the parser *and* to the lint, which therefore reported them as zero
defects. Removing the two blank lines (form only) exposed 5 further residues, including
row 12's leading `MERGED` verdict. **A low row count is a symptom, not a clean bill**;
bulletined for the other rows.

#### Residue rulings, by class

- **Depends-on prose → row ids + `Felix-gate:`** (30 segments). Every Felix ruling cited
  in a dependency became `Felix-gate: <text>` after checking its decider in the doc's own
  decisions list — ch2's D32/D34/D38/D40/D43 are all recorded `(…, Felix)`; naming's
  FG-rulings / FG-toml{,-2,-4,-5} / FG-venue / F7 / F9 / F11 / F12-chase / F13 / §19
  rulings likewise. **No new gate rows were cut**: every prose precondition sat on an
  already-LANDED row, where a retroactive gate row would be fiction. Scheduling and
  qualifying prose moved verbatim into the Status annotation (§method step 3's sanctioned
  home) — e.g. units row 03's "(07 gates suite evidence only)", ch2 row 02's bands
  parenthetical, waypoint-stepper row 11's "(icons landed)".
- **`01–03 ✓` → `01 · 02 · 03`** (ch2 row 04). 18c parked en-dash ranges as ambiguous
  across sub-boards; this one is unambiguous — all three ids sit on the same board — so it
  was expanded rather than parked. If the Grand Architect rules ranges legal, this is a
  no-op.
- **Verdict-led statuses → `LANDED — <verdict>`** (13 rows): 12 in `advanced-naming-system`,
  1 in ch2 (row 12's `MERGED to feature/snappy (D42)`, visible only after the table was
  reunited).
- **Non-lifecycle leads → the state leads** (3): waypoint-stepper FG1 `PART-LANDED` →
  `OPEN — **PART-LANDED …**` (its own Status names remaining bench items); row 24 `RUN` →
  `LANDED — **RUN …**` (the run happened; its verdict is E1's job); ch2 row 04 `RULED in
  part` → `OPEN — **RULED in part …**` (the budget-blessing leg is still owed). In all
  three the annotation is byte-preserved — only the leading state was added.
- **Absent tiers → `unrecorded`** (waypoint-stepper 12/13/14). Evidence was sought first:
  `docs/waypoint-stepper/LOG.md:43,57,67` records those sessions as "Architect (fable)" —
  a *model*, not one of D63's tier tokens — so no cited fill was available. Mantle kept,
  rider kept: `Architect · unrecorded (in-session; Felix released the mantle's no-code rule
  for this arc, 2026-08-13)`.
- **`—` staffing → `unrecorded`** (ch2 row 05, KILLED at D34 before it was ever staffed).
- **`unstaffed` left verbatim** (waypoint-stepper 18/19/23) — a recorded fact, not an
  absent record; see the escalation.
- **Decision titles → bold labels** (ch2 D34, D43). The doc's own words were promoted into
  the label slot with their bytes and case intact (`**four rulings.**`,
  `**three rulings, one session.**`) — nothing authored.
- **An off-board dependency** (`node-global-parameters` row B depends on `A`). Row A was
  dispatched, landed and audited on 2026-08-08 and removed when the board was re-cut to
  D42–D45 (§13). Re-adding it would be adding a row, so the dependency reads `—` and the
  Status annotation carries "(after row A, landed and audited off-board — §13)".

**Untouched, by law:** snappy's `README.md:653` row 13 (`CHARTERED` + `Felix (bench) +
keyboard session TBD`), its `README.md:1229` D19 head, and its `ISSUES.md` `##` entries —
all inside the BLOCKED building and all judgment for snappy's own Architect; noted in
`snappy/ISSUES.md`. No meaning edited, no row added or removed, no re-staffing, no writes
to `canon/`, `sync/` or `doctrine/`.
