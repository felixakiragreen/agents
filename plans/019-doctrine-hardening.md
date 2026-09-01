# 019 — doctrine v1.1: the wave's residue

**Status:** LANDED 2026-08-28 — all 18 items + the seam export built to DoD; one
escalation standing (bob's 3 inline ledger heads, item 10's new visibility — see
findings §E) · **Depends on:** 017 · **Staffing:** Builder · opus-high

## Mission

The 018-wave ran one parser over 22 buildings and filed **fifteen tool defects with
evidence** — the largest single harvest of parser truth the city has produced. This row
folds them into `doctrine/`: every fix lands with a fixture that reproduces the defect,
every fixture stays in the suite. The corpus work (re-running whiteboardy, snappy,
spacex) is NOT this row — that continuation wave is cut when this row lands.

## Inputs — read before working

- [Row 016's findings](016-doctrine-linter.md) — the tool's own laws (round-trip = 
  declared-changes + identical-otherwise + byte assertion; the register rule).
- [Row 018's findings](018-great-recut.md) — the wave's batch report, escalations 1–14,
  and §18c/§18f/§18g/§18h fixtures.
- [D63 (as amended 2026-08-28) + D69](../DECISIONS.md) — the typed-absence
  vocabulary and the PARKED annotation, verbatim; the tool must accept exactly
  these tokens, nothing looser.
- Drained inbox fixtures folded below (canon ISSUES entries of 2026-08-26/27/28,
  drained at grand-architect-11 — git keeps the bytes).

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
   row 016's parked note comes due). Done when: `doctrine migrate ~/code/whiteboardy`
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

### Amendment — row 017's harvest: the silence family (entered 2026-08-28, Felix's pen at the row-19 kickoff)

16. **Merged-ledger-entry detector (missing `---`).** Deleting one separator merges
    two entries and the lint gets QUIETER: 53 → 52 entries, fails 26 → 25 — the
    swallowed entry took its own tier-fail down with it (row 017 C1, probe with
    control; snappy's ~38 missing separators are this class at scale). A non-first
    line of a ledger block that matches the D63f head grammar at line start
    (`**<ISO date> · …** —`) is a failure, `ledger.merged`, never body prose. Done
    when: a fixture of two conforming entries minus their separator reports
    `ledger.merged` (pre-fix tool: reports one clean-ish entry), and a body whose
    line merely mentions a bold date does not trip it.
17. **Stale-lead rule.** A status cell may lead with a state its own annotation has
    outrun: MAP rows 13/14 lead OPEN while narrating `→ **LANDED 2026-08-22/24**`
    — the mechanical parse called row 013 dispatchable, and 2 of 3 structured-arm
    C2 reps mis-answered dispatchability off the faithfully-carried stale token
    (row 017 C2). A leading OPEN/IN FLIGHT whose annotation carries the
    this-row-landed idiom is a failure, `board.stale-lead`. The discriminator is
    the item's real work: row 011's annotation ("13 LANDED 2026-08-22, so the
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
    nothing. Per-building pre-commit adoption is NOT this row (row 012's precedent:
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
  question routed to row 020; the linter keeps failing genuine cross-building ids.
- `Baton.kind` / holder / branch / holds fields — row 017's evidence, row 020's design.
- Any `canon/` edit.

## Findings

**LANDED 2026-08-28.** All 18 items + the seam export. Suite 41 tests / 137 asserts
green in 31 ms reading nothing outside the repo; **22 of the 41 fail on the pre-fix
tool** (src at ref `0638be3`, new fixtures, a throwing shim for the not-yet-built
guard) — every code item covered: 1, 2, 3×2, 4, 5, 6, 7×2, 8×2, 9, 10, 11, 12, 13,
16, 17×1, 18×3. Items 14 (no test reads outside the repo — by construction) and 15
(the timing below) are process items.

Commits: `0638be3` (amendment entered) · vocabulary+parsers · totals/guard/perf ·
glass seam refit · fixtures+suite · candidacy discriminator · home-doc fixes ·
status.parked · clause dialect gate · b14 fixture + inbox filing.

### A. What each fix looks like in the field

- **1/2 (vocabulary):** agents' 27 `unrecorded`-class failures and bob's 1 → 0;
  `OPEN — PARKED` conforms; leading PARKED is `board.parked-leads` (cornerizer's 3
  now correctly classed). `unstaffed` counts as typed — the city reads 99% typed.
- **3 (## heads):** the 18c fixture migrates to `**2026-08-19 · Builder ·
  opus-medium (SH3)**` and lints 0; a tier-less head emits `unrecorded`, never a
  tier-less slot.
- **4 (bold-run orphan):** `**MERGED (…)** —` → `**LANDED — MERGED (…)** —`; a
  balanced-`**` assertion now THROWS on any cell rule that orphans a marker.
- **5 (bare heads):** whiteboardy's dialect — bold, tier hoisted, row id out of the
  paren, `—` replaces `Changed:`, wrapped heads read whole, absent Decided:/Next: →
  the literal `unrecorded` (license = the dialect's own shape; conforming-era bold
  heads qualify only by the `Changed:`/`Blocked:` labels and only pre-D63 dates).
- **6 (inline attributions):** `- **D1 (2026-08-13, Felix + Architect):**` →
  `- **D1** (…): **unrecorded.**` — zero titles authored, asserted.
- **7 (building-wide Depends-on):** `parseFiles` feeds every board the union of the
  building's row ids; migrate expands en-dash ranges (zero-padding preserved) only
  where every id resolves.
- **8 (columns):** renamed → refusal WITH the row count; reordered-canonical →
  parsed positionally + `board.columns` filed. The cornerizer lie (1 failure over 97)
  is structurally impossible now.
- **9 (truncation):** `board.truncated`, and it drew blood at home — belvedere's own
  board had a blank line before B23 hiding **7 rows** (B22–B27) from every parser.
- **10 (inline ledgers):** the register's fallbacks are symmetric; rooted's two
  buildings and bob's three campaigns now PARSE their inline `## Ledger` sections
  (failures visible, "ledger none" gone). City: 9/14 ledgers, 198 entries counted.
- **11 (id prefixes):** `RP-1`/`A1` parse (the 18h fixture yields 1 candidate). The
  broadened candidacy needed a discriminator the spec didn't foresee: **a candidate
  must carry the attribution shape after its id** (`**D1** (…`, `**D1 (…`, `**D1 ·`)
  or every bold cross-reference bullet in a master doc is a malformed decision —
  the corpus produced six false positives (`**T13 ∥ t12c**`, `**x11vnc**`, `**G2
  fires…**` …) before the tightening. Trade: a bullet with a bolded id and NO
  attribution anywhere now stays prose (the entity-count guard is the net for that
  silence class). City decisions: 89 → 232 parsed.
- **12 (pending marker):** the marker lives in the ATTRIBUTION (comma or dash
  spelling); a body quoting it — D21, the entry that defines `✓ Felix` — never
  counts. D21 folded; D68/D70-shaped proposed entries still queue. The city's queue
  count is honest for the first time since B3.
- **13 (kickoff candidacy):** a summons names a mantle right after the article;
  log-tradition's three letter templates (including the one that says "founding
  Grand Architect of hexwright" mid-sentence) are no longer kickoffs; `You are a
  Builder.` (tier absent) still fails.
- **15 (perf):** `discover(~/code)`, warm FS cache, Darwin 24.6.0, this machine,
  3 runs each: **8697/8827/8835 ms → 4402/3774/3989 ms (~2.2×)** via
  `readdirSync({withFileTypes})` (symlinks still stat, so a linked dir still walks);
  the byte-twin worktree skip already read nothing and kept its unique-board
  exception — **register before ≡ after, 22 buildings, byte-identical list**.
- **16 (merged entries):** fires 28× city-wide — **every one in snappy**, the
  predicted ~38-separator hole made loud (runs of glued sessions surface per head),
  zero false positives elsewhere; fenced quotes and mid-line bold dates exempt.
- **17 (stale-lead):** the discriminator is bold-opened or arrow-led
  `LANDED/KILLED <ISO date>` in an OPEN/IN FLIGHT cell; a landing attributed to a
  row id (`13 LANDED 2026-08-22`, row 011's cell) passes. **Corpus measurement: 2
  real trips (MAP rows 13/14), 0 false trips across 469 rows.** The fixed shape for
  the wave: `**LANDED <date> — cut <date>** …` — the state leads with the truth,
  history rides the annotation.
- **18 (guard):** `doctrine lint --guard <ref> <path…>` — one repo, `git archive`
  into scratch, entity totals compared, ANY decrease exits 1. `Totals` gains
  `ledgerEntries` and `decisions` so the guard covers what the amendment names.
  Limits, stated: aggregate counts (a same-tick add can mask a delete) and archive
  omits untracked files (they only raise the current side — no false trips). Live
  proof: guarding agents against `0638be3` tripped on `kickoffs: 66 → 65` — the
  row-21 census re-cut (`95aa5ac`, a concurrent session) deliberately replaced its
  summons fence; the guard flagged a real deletion and the override is running
  without the flag, exactly as designed.
- **Seam (B3's ask):** `parseFiles(entry)` exported; `glass/register.ts`'s
  `content()` is now one line over it — the hand-mirror deleted, `register.test.ts`
  still pins walk ≡ re-read (4/4 green).

### B. DoD — measured

**1. Suite:**
```
bun test → 41 pass, 0 fail, 137 expect() calls [31 ms]
pre-fix tool (ref 0638be3 + new fixtures): 19 pass, 22 fail
```

**2. `doctrine lint ~/code/agents` — verbatim:**
```
=== FAILURE CLASSES

=== TOTALS
  2 buildings · 4/4 board docs yielded a board · 4 boards · 67 rows · 67 fully typed (100%)
  2/2 ledgers parsed a tail (101 entries) · 2 fireable baton(s) · 65 kickoffs in 64 work docs · 88 decisions (queue 3) · 1 inbox entries
  76 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  0 failure(s) in 0 class(es)
```
Reaching 0 took the ruled home-doc fixes, and they recovered real state: 60 → 67
rows (the B23 truncation), 97 → 101 ledger entries (4 separators restored), 9 row
slots emptied of prose (18h shapes), 2 typed absences, MAP 13/14 trued, B27's
depends gloss to its annotation.

**3. `doctrine lint ~/code/universal_robots_sdk/bob`:**
```
=== FAILURE CLASSES
     3  ledger.head
```
**0 failures of every class the DoD was cut against** (the board.tier `unrecorded`
gap cleared). The 3 `ledger.head` are item 10's OWN new visibility: bob's three
campaign READMEs carry inline `## Ledger` sections in the bullet dialect the tool
could not see when this DoD was written. Escalated (§E) — a doc fix in a target
building, which this row's fence reserves for the continuation wave.

**4. Dry-run projections — the continuation wave's entry tickets:**
- **whiteboardy ledger:** `migrate` dry-run, 192 edits, round-trip [] — entries
  **5 → 127**, ledger fails **104 → 2**; both residuals hang off ONE defect the
  fence reserves (a `2026-08-22/23` date-RANGE head — which day is a session's
  ruling, and its unmatched head cascades one `ledger.next`). Boards: per-doc 45 →
  40 `board.depends` building-wide; of 18c's "28 cross-document failures", 5 were
  scope-only and DROPPED — the other 23 carry parenthetical glosses (`16
  (blessed)`) that D63e independently forbids: the id now RESOLVES into the graph
  while the segment correctly keeps its lint fail for the wave's hand. Unknown ids
  (X8/W1/R1/B1 — rows on no board) still fail, as they must.
- **cornerizer PARKED:** 3 `status.parked` edits respell C8/C22/C34 to
  `OPEN — PARKED …`, board 5 → 2, round-trip []; the residual pair is `staffed
  when unparked` → `unstaffed`, D63's own birthplace citation — the wave's respell.
- **spacex decisions:** both files 7 `decision.head` → **0**, decisions 0 → 7 per
  file, titles authored: **0**, round-trip [].
- **snappy (bonus ticket):** `ledger.merged` ×28 pinpoints every missing separator
  by line — the repair sanctioned at grand-architect-11 is now mechanical to verify.

**5. Perf:** §A item 15 — ~8.8 s → ~4.0 s warm (2.2×), register byte-identical.

**Guard trips (amendment DoD), verbatim** — temp repo, damage over a clean ref:
```
=== TRIP 1 — the item-9 blank line:
!! GUARD (HEAD): entity counts DECREASED — silent damage until proven deliberate:
   rows: 3 at the ref → 2 now
=== TRIP 2 — the item-16 merged entry:
!! GUARD (HEAD): entity counts DECREASED — silent damage until proven deliberate:
   ledgerEntries: 2 at the ref → 1 now
=== a pure append:
guard ok — no entity total decreased vs HEAD
```

### C. City sweep (context, not a DoD gate)

`doctrine lint ~/code`: 310 (wave close) → **346 in 16 classes** — the rise is
silence converted to failures: snappy's 28 merged entries, five inline ledgers
parsing (9/14 ledgers, 198 entries), 232 decisions where 89 parsed. agents is 0;
whiteboardy's 102 `ledger.head` fall to the wave's re-fire (projection above).

### D. Adjacent discoveries — parked, not fixed

- **belvedere flow drift (pre-existing):** `flow-batch-1`'s G2 kickoff ordinal went
  stale when `a8dd096` added the batch-6 fences above it (`glass/flow.test.ts:91`
  red at ref `0638be3` too; both flow files point `"fence": 5`, the fence is now
  ordinal 4) — B10 F2's named drift mode, live. Filed to `belvedere/ISSUES.md`;
  the flow hash covers resolved kickoffs, so it is that building's Architect's.
- **b14 fixture realigned** (this row's own seam adoption): the queue fixture wrote
  the pending marker in the BODY — item 12's exact false-positive shape; moved to
  the attribution, glass suite 650/651 (the 1 is the flow drift above).

### E. Escalations standing

1. **bob's 3 inline ledger heads** (DoD 3's letter): item 10 made them visible;
   respelling them is a target-building doc edit this row's out-of-scope reserves
   for the continuation wave. Three heads, mechanical D63f respell + tier hoist —
   one word from Felix routes it to the wave (recommended) or licenses the 3-line
   fix directly.
2. **whiteboardy's `2026-08-22/23` head** — a date-range in the date slot; which
   day is a session's ruling (form-only cannot pick). Rides the wave's re-fire.
3. **decision-candidacy trade** (§A item 11) — noted for the record: id-bolded
   bullets with no attribution anywhere are prose now; the guard's `decisions`
   total is the net if a real one ever goes silent.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/019-doctrine-hardening.md and execute the order.
```
