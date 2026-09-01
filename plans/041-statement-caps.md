# 041 — the statement and the caps

**Status:** OPEN — laid 2026-09-01 · **Depends on:** ⬡-gate: his word — the moratorium
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

- [ ] `bun test` green with the new fixtures; the count recorded under Findings
      (102 → n).
- [ ] `doctrine statement` prints the credit fixture's known interest, and an empty
      statement on `~/code/agents` (no `⬡ go` exists there on 2026-09-01); pasted.
- [ ] `doctrine lint ~/code/agents` names the over-cap rows — the five above at least —
      and `lint ~/code/stigmergon` names row 027; pasted. Red on purpose: the law was
      unenforced, this charge makes the drift visible, and the prune follows at review.
- [ ] `lint --vocab` unchanged; the drift test untouched — no standard edit rides here.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/041-statement-caps.md and build it.
```
