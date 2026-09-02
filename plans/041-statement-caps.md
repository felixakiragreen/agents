# 041 — the statement and the caps

**Status:** LANDED 2026-09-01 · **Depends on:** ⬡-gate: his word — the moratorium
ruling · **Staffing:** Builder · opus-high · **Blessed:** D82 ⬡✓ 2026-09-01 (the
statement) · D78 ⬡✓ 2026-08-31 (the caps — law since blessing, unenforced since blessing)

## Mission

`doctrine` renders the statement — every `⬡ go` on a live surface with the count of
charges landed on top of it — and enforces the retention law the linter has let slide
since the day it was blessed: a LANDED or KILLED status cell is capped, and a ledger
entry is capped, by the linter, with the offenders named.

## Inputs — read before working

- D82 and D78 in [DECISIONS.md](../DECISIONS.md); DOCTRINE §3 (the retention law), §4
  (the resolution vocabulary — `LANDED — ⬡ go ‹date›`), §8 (attribution) — the rulings;
  do not re-derive.
- STANDARD §1 (bless · go) and §7 (`⬡ go`) — the token's form.
- `doctrine/src/parse.ts` (status cells, ledger entries, Depends-on), `src/building.ts`
  (the walk), `src/lint.ts` (the report), `cli.ts`; the suite — 102 green at 040.
- The drift, measured 2026-09-01 at the office's desk: agents `BOARD.md` LANDED cells
  at 843 · 802 · 773 · 674 · 659 characters (rows 037 · 040 · 038 · 029 · 036); stigmergon
  row 027 at 2,932; agents ledger entries at roughly 400 words each. The linter read
  114 rows "fully typed" and 0 failures over all of it: it checks form, not size.

## Spec (blessed with D82 · D78)

- **The token:** the parser reads `⬡ go ‹YYYY-MM-DD›` wherever it reads `⬡✓ ‹date›` —
  status annotations, register marks, gates paid on credit. A `⬡ go` with no date is
  a failure naming the line; the parser never infers a date.
- **The statement:** `doctrine statement [--json] <building…>` — every `⬡ go` on a live
  surface (a board's OPEN / IN FLIGHT / LANDED rows and their annotations, the
  register's entries, the ledger tail), each with its interest: the count of charges
  whose Depends-on chain reaches the marked charge and which have since LANDED —
  derived from the board's graph, never kept. Sorted by interest, descending; one
  line in `lint`'s totals (`n on credit · max interest m`).
- **The caps (D78, lint-hard for cells):** a LANDED or KILLED row's Status cell over
  200 characters is a failure naming the row — the fix is the law: status + findings
  pointer, the story in the charge doc. A ledger entry over 150 words is a **warning**
  naming the head — the ledger's reads are D78-exempt, its writes are not; the office
  rules whether to harden after one sweep.
- **The mask:** `canon/` is fenced as the vocabulary arm fences it — a law book names
  its forms; the standard's own `⬡ go 2026-09-01` example is a mention, not a mark.
- **Fixtures:** `doctrine/fixtures/credit/` — a board + ledger carrying `⬡ go` marks
  with a known interest; a defects fixture with an undated `⬡ go`, an over-cap cell, an
  over-cap entry.

## Out of scope

The lanes — unwritten; they run in a building first · any respell of history (D82:
marks before 2026-09-01 carry no distinction) · shrinking the over-cap cells that exist
today — that is the next Architect review's prune (D78); this charge makes the linter
say so · the rig · stigmergon's rendering of the statement (theirs, over `--json`).

## Done when:

- [x] `bun test` green with the new fixtures; the count recorded under Findings
      (102 → n). **102 → 109.**

      $ cd doctrine && bun test
      bun test v1.3.10 (30e609e0)
       109 pass
       0 fail
       437 expect() calls
      Ran 109 tests across 2 files. [66.00ms]

- [x] `doctrine statement` prints the credit fixture's known interest, and an empty
      statement on `~/code/agents` (no `⬡ go` exists there on 2026-09-01); pasted.

      $ ./doctrine/cli.ts statement doctrine/fixtures/credit
      the statement (D82) — every ⬡ go on a live surface, with the charges landed on top of it

           2  ⬡ go 2026-09-01  001       board      ~/code/agents/doctrine/fixtures/credit/BOARD.md:11
           0  ⬡ go 2026-09-01  D2        decisions  ~/code/agents/doctrine/fixtures/credit/DECISIONS.md:4
           0  ⬡ go 2026-09-02  005       board      ~/code/agents/doctrine/fixtures/credit/BOARD.md:15
           0  ⬡ go 2026-09-02  the tail  ledger     ~/code/agents/doctrine/fixtures/credit/LEDGER.md:10

        4 on credit · max interest 2

      $ ./doctrine/cli.ts statement .
      the statement (D82) — nothing on credit: no ⬡ go on a live surface under ..

- [x] `doctrine lint ~/code/agents` names the over-cap rows — the five above at least —
      and `lint ~/code/stigmergon` names row 027; pasted. Red on purpose: the law was
      unenforced, this charge makes the drift visible, and the prune follows at review.

      $ ./doctrine/cli.ts lint ~/code/agents            # agents/BOARD.md's twelve, named:
      012 (241) · 014 (212) · 015 (524) · 022 (242) · 029 (666) · 030 (488) · 032 (203)
      · 036 (647) · G2 (412) · 037 (833) · 038 (760) · 040 (786)
      === FAILURE CLASSES
          43  vocab.dead-word          (--vocab only; unchanged)
          33  board.cell-cap
      === WARNING CLASSES
         166  ledger.entry-cap
        33 failure(s) in 1 class(es) · 166 warning(s) in 1 class(es)

      $ ./doctrine/cli.ts lint ~/code/stigmergon --verbose
            [4×] board.cell-cap — a LANDED or KILLED Status cell is capped at 200 characters (D78) …
                 ~/code/stigmergon/BOARD.md:41: 025 (213 chars): "LANDED 2026-09-01 — F1–F7; 29 gates ALL GREEN ×2 …
                 ~/code/stigmergon/BOARD.md:43: 028 (245 chars): "LANDED 2026-09-01 — banner restyled to the mock …
                 ~/code/stigmergon/BOARD.md:45: G4 (1008 chars): "LANDED — PASSED 2026-09-01 — every Done when: …
                 ~/code/stigmergon/BOARD.md:46: 027 (3633 chars): "LANDED 2026-09-01 — F1–F11; every Done when: …
        4 failure(s) in 1 class(es) · 30 warning(s) in 1 class(es)

- [x] `lint --vocab` unchanged; the drift test untouched — no standard edit rides here.

      $ diff <(HEAD's cli.ts lint ~/code/agents --vocab) <(this tree's)   # classes + totals
      2a3   >     33  board.cell-cap
      3a5,7 >  === WARNING CLASSES … 166  ledger.entry-cap
      6a11  >   0 on credit · max interest 0
      8c13  <   43 failure(s) in 1 class(es)
            ---
            >   76 failure(s) in 2 class(es) · 166 warning(s) in 1 class(es)

      `vocab.dead-word 43` and every entity total are byte-identical; the only lines added
      are this charge's own. `src/lexicon.ts` and `test/vocabulary.test.ts` are untouched
      (`git diff --stat` names neither).

## Findings

**F1 — the suite: 102 → 109, seven arms.** The credit fixture's known interest, the
interest re-derived under a mutation (unland 003 and 001's interest falls 2 → 1), the three
controls that must NOT reach the statement, the law-book mask with its counter-control, the
decision register's three marks, the render's two ends, and the three defects.

**F2 — the desk measured BYTES; the cap counts CHARACTERS. Every one of its numbers
reproduces exactly.** The cell is measured as written — `cell.trim().length`, markdown
included — which reads 833 · 786 · 760 · 666 · 647 where the charge records 843 · 802 · 773 ·
674 · 659. Not drift, and not the file moving: the same cells in bytes are
`Buffer.byteLength` 843 · … , and stigmergon's 027 is 2,882 characters / **2,932 bytes** at
`f0f22ec`, the revision the desk read — the charge's number to the byte. Two multi-byte
characters per em-dash and mid-dot is the whole gap (~1.2%). **Characters is the right
measure**: the cap exists for what a reader reads, and a byte cap would tax `—`, `·` and `⬡`.
The choice moves no row across the line — swept agents' and stigmergon's boards plus
belvedere's two, zero cells sit in the 200-char / >200-byte window. (027 reads 3,633 today:
`feb68f6` and `03a63ae` grew it 24% after the measurement.) The ledger's measure is
`block.trim().split(/\s+/).length`: 87 of agents' 102 entries are over 150 words, median 259,
max 1,008 — the desk's "roughly 400 each" is the mean, not the median.

**F3 — BLOCKED is off the statement, by the spec's own list.** D82's live surfaces are "a
board's OPEN / IN FLIGHT / LANDED rows"; KILLED is spent and BLOCKED is named nowhere. Built
literally: a mark on a BLOCKED row is invisible to `doctrine statement`. BLOCKED is transient
by law (DOCTRINE §4) and a charge sitting at the Architect's desk still owes its review, so
this is a hole the ruling did not see rather than one it chose. **The Architect's call, not
mine** — one word in `LIVE_STATES` (`src/credit.ts`) closes it.

**F4 — the code-span mask is load-bearing, not decoration; the `canon/` fence alone is not
enough.** The charge fences the law book; that fences STANDARD §7's own example. It does not
fence the six ticked mentions the live corpus already carries OUTSIDE `canon/`: `BOARD.md`'s
row 041 Work cell (×1), `DECISIONS.md`'s D82 and its 2026-09-01 entry (×4), and the ledger
tail (×1) — every one of them in backticks, and five of the six carrying `‹date›` or nothing
where an ISO date would go. Without the tick mask this charge's own landing would print six
`credit.undated` failures and a six-line statement on a repo whose Done when: says the
statement is empty. `maskCode` (moved to `grammar.ts`, where the other text primitives live)
is therefore part of the mark's definition: **a quoted token is a mention, not a mark** — the
same law 040-F2 landed for the respell, and the vocabulary arm's since 023-F3.

**F5 — `⬡ go` leaves the decision queue and joins the statement.** D82: "the entry sits on
the statement until he reads it." So `Decision.credit` is a third resolution beside
`blessed` and `pending`: a credit-marked entry is NOT blessed (the checkmark is the act of
checking — STANDARD §1) and NOT queued (nobody waits on it; it proceeds). `MARK_TAIL`
(né `BLESSED_TAIL`) strips either mark off the decider, so `(2026-09-01, Architect · ⬡ go
2026-09-01)` reads its decider as `Architect`, not as the mark.

**F6 — a per-fail number cannot live in a `Fail.reason`.** `render()` prints one reason per
failure CLASS — `list[0].reason` — so "this one writes 213" was about to label all four of
stigmergon's rows, one of which writes 2,932. The size moved into the excerpt
(`027 (2932 chars): "…"`), where it is per-row and true. A pre-existing property of the
renderer, tripped by the first rule whose reason wanted a measurement.

**F7 — a non-board mark's interest is 0 by construction, not by omission.** Interest is
"charges whose Depends-on chain reaches the marked charge" (D82), and the board's grammar has
no edge from a charge to a decision or to a ledger entry — the only three Depends-on forms
are a charge id, a crossing, and a `⬡-gate` (D63e/D79). So a mark in the register or in the
tail reports interest 0 and sorts last. Deriving something else would mean keeping a number,
which D82 forbids.

**F8 — where the drift actually lives: 19 of the 33 over-cap cells are belvedere's, retired.**
agents/BOARD.md 12 · plans/018-great-recut.md 2 · belvedere 10 · belvedere/v3 9. Belvedere was
retired 2026-08-31 and its books "stand as the record" (D84) — so 58% of this landing's red is
on a building nobody prunes. The office's question at the review, not this charge's: does the
retention prune reach a retired building's books, or does a retirement notice fence them from
the linter the way `canon/` is fenced? The same question decides 79 of the 166 entry-cap
warnings.

**F9 — the statement is empty on agents today because no live surface writes the mark yet.**
Row 041's own gate reads `⬡-gate: his word — paid 2026-09-01`, not `⬡ go 2026-09-01`; D82
landed the same day and nothing respells behind it. The first real mark lands the first time a
session writes one — the tool is ready and the corpus has not spoken yet, which is exactly
what an empty statement should mean.

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/041-statement-caps.md and build it.
```
