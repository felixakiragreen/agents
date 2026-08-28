# 19 — doctrine v1.1: the wave's residue

**Status:** OPEN — cut 2026-08-28 (GA-11); vocabulary gate PAID same day (D63's
second amendment + D69 ✓ Felix — the blessing). **Holds behind 17's landing:** this
row rewrites the parser row 17 is mid-measurement on, and the incumbent never molts
under a live gauge (DOCTRINE §6.7) · **Depends on:** 17 · **Staffing:** Builder ·
opus-high

## Mission

The 18-wave ran one parser over 22 buildings and filed **fifteen tool defects with
evidence** — the largest single harvest of parser truth the city has produced. This row
folds them into `doctrine/`: every fix lands with a fixture that reproduces the defect,
every fixture stays in the suite. The corpus work (re-running whiteboardy, snappy,
spacex) is NOT this row — that continuation wave is cut when this row lands.

## Inputs — read before working

- [Row 16's findings](16-doctrine-linter.md) — the tool's own laws (round-trip = 
  declared-changes + identical-otherwise + byte assertion; the register rule).
- [Row 18's findings](18-great-recut.md) — the wave's batch report, escalations 1–14,
  and §18c/§18f/§18g/§18h fixtures.
- [D63 (as amended 2026-08-28) + D69](../DECISIONS.md) — the typed-absence
  vocabulary and the PARKED annotation, verbatim; the tool must accept exactly
  these tokens, nothing looser.
- Drained inbox fixtures folded below (canon ISSUES entries of 2026-08-26/27/28,
  drained at GA-11 — git keeps the bytes).

## The spec — fifteen items, each with its done-when

**Vocabulary (kills the wave's residual lint):**

1. **Typed-absence tokens (D63 as amended).** `unrecorded` legal in any required
   slot — ledger tier/mantle, board tier, staffing sub-slots, decider, decision
   title (`**unrecorded.**`), Decided:/Next:. `unstaffed` legal as a
   whole-Staffing value. (No `bare session` token — proposed and struck at
   countersign; D26's cell writes `unrecorded`.) Done when:
   `doctrine lint ~/code/agents` shows zero `unrecorded`-class failures and
   `~/code/universal_robots_sdk/bob` lints 0.
2. **`PARKED` annotation (D69).** `OPEN — PARKED <reason>` conforms exactly as
   `OPEN — PENDING <precondition>` does; leading `PARKED` is the same failure class as
   leading `PENDING`. Done when: a fixture of cornerizer C8's cell conforms in the
   `OPEN — PARKED` spelling and fails when PARKED leads.

**Migrate correctness (the round-trip law's blind spots):**

3. **`ledger.pre-doctrine-head` parenthetical-tier bug.** A `## <date> · Builder
   (opus-medium) · …` head re-emits with the tier inside the mantle and the row id as a
   second parenthetical; round-trip prints `ok` (mantle/tier are declared changes).
   Fixture (18c, verbatim — this is the whole test):

   ```
   $ printf '# Ledger\n\n---\n\n## 2026-08-19 · Builder (opus-medium) · SH3 — the bundle-push pipeline\n\nStuff. Decided: nothing. Next: fire 20.\n' > LEDGER.md
   $ doctrine lint .   → 0 failures     $ doctrine migrate . --write   $ doctrine lint .   → 2 failures
   ```

   Done when: that fixture migrates to `**2026-08-19 · Builder · opus-medium (SH3)**`
   and lints 0 after. Also cover the milder half: a head with NO parenthesised tier
   must not emit a head with no tier slot (emit `unrecorded`, per D68).
4. **`replaceLead` bold-run orphan.** `**MERGED (…)** — …` cells: the opener is
   consumed with the token, the closer dangles (`LANDED — MERGED (…)** — …`).
   `status.verdict`, `status.retired`, `status.pending` all share the helper; the
   round-trip law is blind (annotation is declared-changed). Fixture: a bold run wider
   than its leading token (18f, advanced-naming N12). Done when: emission is
   `**LANDED — MERGED (…)**` — state inside the bold run — and a balanced-`**`
   assertion runs on every emitted cell.
5. **Unbolded pre-doctrine ledger-head rule** — the second dialect, not a special
   case: `<date> · <mantle> · <tier> (<rider>)` bare head + `Changed:`/`Decided:`/
   `Next:` labelled body lines (whiteboardy ×96). Bold the head, hoist the row id,
   `—` replaces the `Changed:` label; the parenthetical's non-row-id remainder goes to
   the body untouched (D63f). Handle heads that wrap across lines (three live cases —
   row 16's parked note comes due). Done when: `doctrine migrate ~/code/whiteboardy`
   dry-run covers the 96 and the ledger's post-migrate lint (dry-run projection) is 0.
6. **`decisionHead` second variant.** `- **D1 (2026-08-13, Felix + Architect):** <body>`
   (bold wraps id + attribution, no separate title) → `- **D1** (2026-08-13, Felix +
   Architect): **unrecorded.** <body>` — the typed absence in the title slot (D63
   as amended); never author a title. Fixture: spacex-dashboard's 7 entries (both files). Done when:
   the fixture migrates clean and a real title is never synthesized.

**Parse scope + silent-zero bugs (worse than failures — they report clean):**

7. **Depends-on resolves building-wide, not per-document.** `parseBoards` builds
   `knownIds` per file; D63e never said "on this board". Resolve against the union of
   the building's board docs (the register already computes the building). Ranges
   (`E1–E9`) stay illegal as ids — migrate expands them where every id resolves.
   Done when: whiteboardy's 28 cross-document failures drop on a dry lint; a genuinely
   unknown id still fails.
8. **`board.columns` undercount.** A renamed/reordered header reports 1 failure and
   `0 rows` — cornerizer hid 97 defects across 37 rows behind that 1. Where the five
   canonical column names are present in the wrong order, parse positionally and file
   residues alongside the column defect; otherwise report the refused table's row
   count. Done when: the pre-fix cornerizer header fixture reports its row count, and
   a wrong-order fixture parses with the column defect filed.
9. **Blank-line board truncation.** A `|`-row after a blank line after a board is a
   truncated board, not a new table — three wave sightings (whiteboardy, ch2,
   cornerizer). Lint it as its own failure class. Done when: the ch2 three-table
   fixture reports the truncation instead of a clean short board.
10. **Register: inline-`## Ledger` fallback.** The decisions parser falls back to the
    master doc for DOCTRINE §3 subprojects; the ledger parser has no such fallback —
    rooted's 29 entries read "ledger none". Mirror the fallback. Done when: rooted's
    two buildings parse their inline ledgers (failures welcome; silence not).
11. **`parseDecisions` id-prefix generalization.** The literal `D` prefix is
    hardcoded (`/^\s*[-*]\s*\*\*D\d/`) — `RP-1`/`A1` parse zero candidates, zero
    failures, silently. Accept a project prefix; keep the id verbatim. Fixture (18h):

    ```
    $ bun -e "import{parseDecisions}from './doctrine/src/parse';
    console.log(parseDecisions('## Decisions\n\n- **RP-1** (Felix, 08-26): Campaign named **Repot**.\n'))"
    → { decisions: [], queue: [], fails: [], candidates: 0 }
    ```

    Done when: that fixture yields 1 candidate.
12. **Pending-countersign false positive.** The pending marker matches wherever the
    countersign phrase APPEARS — canon D21, the entry that defines `✓ Felix`, rode the
    rail as a false pending since B3 (the city had zero true pendings while the rail
    showed two). Match only the literal marker `(proposed — pending Felix
    countersign)`. Done when: D21 parses folded and a real proposed entry still
    parses pending.
13. **Kickoff-detector discriminator.** Any fence opening `You are ` is promoted to a
    summons — `plans/log-tradition.md`'s three Personal-Log letter templates lint as
    malformed kickoffs. A summons fence names a mantle from the vocabulary in its
    first line; a fence that names none is not a kickoff candidate. Done when: agents
    lints zero `kickoff.summons` and a real malformed kickoff (mantle named, tier
    absent) still fails.

**Suite + performance hygiene:**

14. **Live-corpus assertions out of the suite.** `corpus > hexwright's pre-doctrine
    ledger tail migrates form-only` asserts a fact about a live building and went red
    when the corpus converged (20/21 since 18b landed). Corpus tests pin to checked-in
    fixtures; live-corpus checks belong in `lint`. Done when: `bun test` is green with
    no test reading outside the repo.
15. **`discover()` perf folds** — 9 s over `~/code` measured (B2 §E1):
    `readdirSync({withFileTypes})` (2.5× measured) and skipping worktree checkouts
    that are byte-twins of mainline — **without losing the unique-board exception**
    (a worktree whose branch put a board where mainline has none still registers —
    18g's own branch was the live case). Done when: a timed before/after on `~/code`
    rides the findings (conditions attached, DOCTRINE §6.7) and the register's
    building list is unchanged.

**Also owed (small):** export the re-read seam — `assemble(path, files)` (or
`parseFiles(entry)`) — so `belvedere/glass/register.ts` can drop its guarded
hand-mirror of `discover()`'s body (B3's ask; the deep-equal pin in
`register.test.ts` becomes an import).

### Amendment — row 17's harvest: the silence family (entered 2026-08-28, Felix's pen at the row-19 kickoff)

16. **Merged-ledger-entry detector (missing `---`).** Deleting one separator merges
    two entries and the lint gets QUIETER: 53 → 52 entries, fails 26 → 25 — the
    swallowed entry took its own tier-fail down with it (row 17 C1, probe with
    control; snappy's ~38 missing separators are this class at scale). A non-first
    line of a ledger block that matches the D63f head grammar at line start
    (`**<ISO date> · …** —`) is a failure, `ledger.merged`, never body prose. Done
    when: a fixture of two conforming entries minus their separator reports
    `ledger.merged` (pre-fix tool: reports one clean-ish entry), and a body whose
    line merely mentions a bold date does not trip it.
17. **Stale-lead rule.** A status cell may lead with a state its own annotation has
    outrun: MAP rows 13/14 lead OPEN while narrating `→ **LANDED 2026-08-22/24**`
    — the mechanical parse called row 13 dispatchable, and 2 of 3 structured-arm
    C2 reps mis-answered dispatchability off the faithfully-carried stale token
    (row 17 C2). A leading OPEN/IN FLIGHT whose annotation carries the
    this-row-landed idiom is a failure, `board.stale-lead`. The discriminator is
    the item's real work: row 11's annotation ("13 LANDED 2026-08-22, so the
    rebase is real") mentions ANOTHER row's landing and must pass. Done when: a
    rows-13/14 fixture fails, a row-11 fixture passes, and the fixed cells' shape
    (state leads, history in annotation) is stated for the continuation wave to
    apply.
18. **The count-regression guard.** Damage can LOWER the fail count (item 16's
    evidence), so fail deltas are a lying health gauge; entity counts are not.
    `doctrine lint --guard <git-ref>` (spelling the Builder's) re-lints the same
    paths at the ref and fails loudly on any decrease in the totals it already
    prints — boards, rows, ledger entries, tails, decisions, kickoffs — catching
    the whole silence family, named and unnamed, mechanically. A guard, not a law:
    intentional deletions override by running without the flag, visibly. Done
    when: the item-9 blank-line fixture and the item-16 merged-entry fixture both
    trip the guard against their pre-damage state, and a pure append trips
    nothing. Per-building pre-commit adoption is NOT this row (row 12's precedent:
    adoption anywhere is its own row) — this row ships the instrument.

**DoD 1 extension:** items 16–18's fixtures counted with the rest; item 18
additionally pastes the two guard trips verbatim.

**Collision ruling (Felix, 2026-08-28, at entry):** item 17's rule makes MAP rows
13/14 fail `board.stale-lead`, colliding with DoD 2's 0 — ruled: **this row fixes
the home repo's cells** (state leads with the truth, history rides the annotation);
DoD 2 stays a crisp 0. The same ruling covers the home repo's post-18a drift the
DoD-2 walk surfaces (ledger.row prose parentheticals, absent Decided:/Next:) —
fixed under 18h's residue precedent, each named in findings.

## DoD — measurable

1. `cd doctrine && bun test` green; every item above has a fixture that fails on the
   pre-fix tool (state the count).
2. `doctrine lint ~/code/agents` → **0 failures**, pasted verbatim.
3. `doctrine lint ~/code/universal_robots_sdk/bob` → **0 failures**.
4. Dry-run projections pasted for the three stranded corpora (whiteboardy ledger,
   cornerizer PARKED cells, spacex decisions) — the continuation wave's entry ticket.
5. Perf number for item 15 with conditions.

## Out of scope

- Writing to any building's docs — the continuation wave applies; this row proves on
  fixtures and dry runs.
- The cross-**building** Depends-on form (`theseus:T12a` vs gate rows) — a grammar
  question routed to row 20; the linter keeps failing genuine cross-building ids.
- `Baton.kind` / holder / branch / holds fields — row 17's evidence, row 20's design.
- Any `canon/` edit.

## Findings

*(append here — evidence-grade; every fix cites its fixture)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/19-doctrine-hardening.md and execute the order.
```
