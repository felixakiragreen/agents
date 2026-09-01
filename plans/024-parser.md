# 024 — the parser

**Status:** LANDED 2026-08-29 · **Depends on:** 023 · **Staffing:** Builder · opus-high

## Mission

`doctrine/` learns the standard's tokens and teaches the city's boards to molt into
them: grammar, migrate rules, lint hardening, tests. After this charge, the one
parser in the city reads the blessed tongue and writes nothing else.

## Inputs — read before working

- `canon/work/STANDARD.md` (post-023 home; §2 ids · §6 typed absence · §7 punctuation
  and namespace · §9 graveyard).
- [canon/work/DOCTRINE.md](../canon/work/DOCTRINE.md) §4/§7/§8 — post-023, the
  normative grammar this parser implements.
- `doctrine/src/` — the token block is `grammar.ts:13–26`; migrate and lint carry the
  old tokens' behavior.
- [plans/016-doctrine-linter.md](016-doctrine-linter.md) §Findings (F1 — the round-trip
  law's canonical reading) · [plans/019-doctrine-hardening.md](019-doctrine-hardening.md)
  (the live-corpus test, the guard).
- D63 (molt clause) · D71 · D18 (ids stable, never reused, nothing renumbers).

## The spec — blessed D71 ⬡✓ 2026-08-29; this map applies it

1. **grammar.ts:** mint `⬡-gate` (Depends-on and Staffing token; `Felix-gate` stays a
   historical alias — parsed forever, never emitted by migrate). `DEFERRED` joins the
   annotation genre (`PARKED` historical alias). `unstaffed` leaves the legal set —
   see 3. C‹n› id grammar: `C\d+` beside bare historical ids; ids are strings, never
   renumbered (D18). `⬡✓` beside `✓ Felix` — both parse, neither migrates (the
   historical-marks migration is DEFERRED by the standard §7). Baton instruments
   accept `ignite <charge-ids>` beside historical `fire <row-ids>`. The ledger head's
   parens accept charge ids (`(C23)`).
2. **migrate.ts** — form-only, the round-trip law per 016-F1's reading: `Felix-gate:` →
   `⬡-gate:` in both columns; `PARKED` → `DEFERRED` wherever it annotates;
   `unstaffed` → `—` where the Status cell carries DEFERRED, surfaced as a residue
   everywhere else — never guessed. Nothing else moves: no `✓ Felix` rewrite, no id
   renumbering, no prose.
3. **lint.ts:** an unstaffed charge is not permitted, ever — a Staffing cell that is
   empty, `unstaffed`, or `—` without DEFERRED in its Status is a **hard failure**
   ("charges are always staffed"). `⬡-gate` staffing renders his card per D63a's law,
   new token, same meaning.
4. **Tests:** fixtures per token, both directions; migrate round-trips green; prove
   the change bites — a new-token fixture fed to the pre-024 tool goes red in the
   predicted places (the 013-F1/14 guard pattern).
5. **Namespace note:** `C` joins canon's reserved letters (standard §7). The
   prefix-table lint arm is 026's, not this charge's.

## Done when:

- `cd doctrine && bun test` green, new fixtures included.
- `doctrine lint ~/code/agents` → 0 — the batch note's named interim red (028's
  ⬡-gate cell) clears here.
- `doctrine migrate` dry-run across the register prints the city's respell counts per
  building — no writes — pasted as evidence; the counts hand 025 its sizing.
- The round-trip law asserted: declared-changes + identical-otherwise + the byte
  assertion.

## Out of scope

Writing any building (025). The vocabulary/lexicon arm (026). Glass renderers (027).
The `✓ Felix` → `⬡✓` history migration (DEFERRED — the standard §7).

## Findings

**LANDED 2026-08-29.** The one parser in the city reads the blessed tongue and writes
nothing else. Commits: `34a9725` (the tokens, the rules, the fixtures, the suite) ·
`f912cbb` (README).

### Done when — measured

**1. `cd doctrine && bun test` green, new fixtures included.**

```
$ cd doctrine && bun test
 49 pass
 0 fail
 180 expect() calls
Ran 49 tests across 1 file. [42.00ms]
```

41 → 49 tests, 127 → 180 assertions. New fixtures, one per token, both directions:
`conforming/board-standard.md` (⬡-gate in Staffing *and* Depends-on, C‹n› ids, `OPEN —
DEFERRED`, the dissolved `—`), `conforming/ledger-standard.md` (`(C23)` in the head,
`ignite 025, 026` as two instruments), `conforming/decisions-standard.md` (`· ⬡✓ <date>`
and `proposed, pending ⬡✓`), `pre-d71/board.md` (the molt: `Felix-gate` in both columns,
a bare `Felix`, `unstaffed` + `PARKED`), `defects/unstaffed.md` (the hard failure's three
shapes plus the one absence it allows). `conforming/board.md` and `board-absences.md`
were respelled — a fixture called *conforming* must speak the standard, and the suite
asserts migrate finds nothing in any of them.

**2. `doctrine lint ~/code/agents` → 0.** The batch note's named interim red clears here,
and so did a second one nobody had named:

```
$ ./cli.ts lint ~/code/agents | tail -6
=== TOTALS
  2 buildings · 4/4 board docs yielded a board · 4 boards · 73 rows · 73 fully typed (100%)
  2/2 ledgers parsed a tail (105 entries) · 2 fireable baton(s) · 71 kickoffs in 72 work docs · 89 decisions (queue 3) · 3 inbox entries
  74 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  0 failure(s) in 0 class(es)
```

Before: `board.depends` on 028's `⬡-gate:` cell (the named one) **and** `ledger.baton` on
grand-architect-13's own close — `**ignite 024**` was a dropped baton to the pre-024 reader. The
standard's own tail was unreadable by the city's rail until this charge; the baton count
goes 1 → 2.

**3. `doctrine migrate` dry-run across the register — no writes. 025's sizing:**

```
   16  agents — 2 file(s): depends.hex-gate ×14 · status.parked-respell ×2
    2  agents/belvedere — 1 file(s): depends.hex-gate ×2
  ok  hexwright — already in the current grammar
    7  rooted/archive/arborist — 1 file(s): depends.hex-gate ×6 · staffing.hex-gate ×1
    4  rooted/archive/repot — 1 file(s): depends.hex-gate ×4
  ok  universal_robots_sdk/bob — already in the current grammar
    1  universal_robots_sdk/bob/docs/campaigns/lunchbox — 1 file(s): staffing.hex-gate ×1
    3  universal_robots_sdk/bob/docs/campaigns/pods — 1 file(s): staffing.hex-gate ×3
   17  universal_robots_sdk/bob/docs/campaigns/theseus — 1 file(s): depends.hex-gate ×10 · staffing.hex-gate ×7
   24  universal_robots_sdk/cap-mega/.claude/worktrees/cornerizer/docs — 1 file(s): depends.hex-gate ×15 · status.parked-respell ×5 · status.deferred ×3 · staffing.hex-gate ×1
    1  universal_robots_sdk/cap-mega/.claude/worktrees/motion-migration/docs — 1 file(s): staffing.hex-gate ×1
    5  universal_robots_sdk/cap-mega/.claude/worktrees/tig-avc/docs — 1 file(s): staffing.hex-gate ×5
    6  universal_robots_sdk/cap-mega/.claude/worktrees/user-manual/manny — 1 file(s): depends.hex-gate ×6
   13  universal_robots_sdk/cap-mega/docs — 2 file(s): depends.hex-gate ×12 · staffing.hex-gate ×1
    3  universal_robots_sdk/cap-mega/docs/units — 1 file(s): staffing.hex-gate ×3
    3  universal_robots_sdk/cap-mega/docs/waypoint-stepper — 1 file(s): staffing.hex-gate ×3
    9  universal_robots_sdk/cap-mega/felix/spacex-dashboard — 2 file(s): decision.inline-attribution ×7 · staffing.hex-gate ×1 · ledger.tier-slot ×1
   11  universal_robots_sdk/cap-mega/felix/spacex-dashboard-c2 — 2 file(s): decision.inline-attribution ×7 · ledger.tier-slot ×3 · staffing.hex-gate ×1
    1  universal_robots_sdk/cap-mega/simmy — 1 file(s): depends.hex-gate ×1
   53  universal_robots_sdk/cap-mega/snappy — 1 file(s): ledger.tier-slot ×44 · ledger.unrecorded-clauses ×9
   10  universal_robots_sdk/cap-mega/snappy/ch2 — 1 file(s): depends.hex-gate ×8 · staffing.hex-gate ×1 · status.parked-respell ×1
  216  whiteboardy — 7 file(s): ledger.bare-head ×108 · ledger.unrecorded-clauses ×66 · depends.hex-gate ×18 · ledger.pre-doctrine-head ×13 · ledger.tier-slot ×5 · depends.range ×4 · status.parked-respell ×1 · staffing.hex-gate ×1

=== THE CITY, BY RULE
    108  ledger.bare-head
     96  depends.hex-gate
     75  ledger.unrecorded-clauses
     53  ledger.tier-slot
     30  staffing.hex-gate
     14  decision.inline-attribution
     13  ledger.pre-doctrine-head
      9  status.parked-respell
      4  depends.range
      3  status.deferred

  405 edit(s) across 30 file(s) in 22 buildings · round-trip violations: 0
```

**The respell alone is 138 edits in 20 buildings** — `depends.hex-gate` 96 ·
`staffing.hex-gate` 30 · `status.parked-respell` 9 · `status.deferred` 3. The other 267
are D63's backlog, which 025 inherits in the same pass. Two buildings are already home.
`staffing.dissolved` fires **zero** times city-wide: no `unstaffed` cell in the city sits
on a DEFERRED charge (the token was one day old), so all three live ones are residues —
see F2.

**4. The round-trip law asserted** — declared-changes + identical-otherwise + the byte
assertion, 016-F1's canonical reading, unchanged and now carrying four more rules:
**0 violations across all 405 city edits** (line above) and `roundTrip() === []` on all
19 fixtures in the suite's sweep.

**5. The change bites — the guard (013-F1/14's pattern).** The three new-token fixtures,
assembled into one building and fed to the pre-024 tool at `HEAD~1`:

```
$ <pre-024>/doctrine/cli.ts lint <guard building>
      [2×] board.depends — …neither a row id in this building nor "Felix-gate: <text>" (D63e)
           README.md:7: 025: "⬡-gate: the sovereign's read of the diff"
           README.md:8: 026: "⬡-gate: Felix's charter drafts"
      [2×] board.staffing — staffing is not "<Mantle> · <tier>", "Felix-gate", "unstaffed" or "unrecorded"
           README.md:8: 026: "⬡-gate (his drafts, his pen)"
           README.md:9: 027: "—"
      [1×] ledger.baton — the Next clause carries no instrument… — a dropped baton (D63g/D64)
           LEDGER.md:9: ignite 025, 026.
  1 boards · 5 rows · 3 fully typed (60%) · 2 decisions (queue 2) · 0 fireable baton(s)
  5 failure(s) in 3 class(es)

$ ./cli.ts lint <the same building>          # this build
  1 boards · 5 rows · 5 fully typed (100%) · 2 decisions (queue 1) · 1 fireable baton(s)
  0 failure(s) in 0 class(es)
```

Red in exactly the five predicted places, green here. The **queue 2 → 1** is the quiet
one: the pre-024 reader cannot see `⬡✓`, so it held a blessed decision in the queue and
said nothing — a silence, not a failure, and the class the count-regression guard exists
for.

**City-wide cost, honestly:** 348 → **349** failures. Three new `board.unstaffed` (F2),
minus 028's depends cell, minus grand-architect-13's baton. Rows fully typed 470 → 467: the three
unstaffed charges stop counting as typed, because they are not.

### F1 — the respell put the blessing mark inside the *waiting* form

`⬡✓` reads as a blessing given; `proposed — pending ⬡✓` (DOCTRINE §8's own wording for a
dispatched entry) contains it verbatim. The old spelling could not collide — "pending
Felix countersign" holds no `✓ Felix` — so the naive port marks every dispatched,
unblessed decision **ratified** and drops it out of the decision queue. Found by the
control fixture on its first run. Ruled in-charge, as parsing, not policy: the proposed
mark **vetoes** the blessing mark (`src/parse.ts`, `ratified:`), and §8's `·` separator is
now required before a trailing mark, so `pending ⬡✓` can no longer be eaten off the
decider's name either. Both locked by `decisions-standard.md`. **Flagged for the
Architect:** this is a hazard of the mark's *shape*, not of this implementation — anything
else that greps for `⬡✓` (the glass, 026's lexicon arm) inherits it.

### Where the always-staffed rule actually lives

The spec files it under `lint.ts`; it landed in `parse.ts` (`parseStaffing`), because that
is where every other board failure is raised — parser-as-lint, and the rule needs the
Status cell in the same hand as the Staffing cell. `lint.ts` raises no failures at all; it
walks, reports and counts (its typed-row count now reads `dissolved` where it read
`unstaffed`). The observable contract is the spec's: `doctrine lint` hard-fails on an
unstaffed charge. Same for the plumbing it needed — a cell rule in `migrate.ts` now
receives its whole row (`CellCtx`), so Staffing can read Status.

### F2 — three unstaffed charges, left standing on purpose

`~/code/universal_robots_sdk/cap-mega/docs/waypoint-stepper/README.md` rows 18, 19 and 23
carry `unstaffed` with no DEFERRED in Status. D71 makes each a hard failure and migrate
**refuses** all three: `—` is dissolution, legal only where the shelving is on the record,
and choosing who staffs a live charge is a session's call, never a converter's. They are
025's three residues — either the rows are DEFERRED and say so, or they get staffed.

### F3 — two field names kept, deliberately

`BoardRow.felixGate` and `Decision.ratified` still carry dead words. Both are the glass's
imported contract (`belvedere/glass/{pages,workshop,rail,attention,inbox,decoder}.ts`), and
renderers are **027's**, out of scope here — a rename lands in this charge as edits to
another campaign's building. The document tokens are respelled; the field names are a
one-line molt for 027 to take with its own tests. Filed, not fixed.

### The glass is unmoved — measured, not assumed

`belvedere/` imports this library, so the shape change (`BoardRow.unstaffed` →
`dissolved`) had to be proven harmless: **650 pass / 1 fail before this charge and after**,
same corpus, the doctrine swapped under a clean tree. The one failure (`the g2 kickoff IS
the README's G2 fence`) is a README fence-index drift that predates 024 and is **already
in `belvedere/ISSUES.md`** (2026-08-28, the row-19 Builder — the flow hash covers resolved
kickoffs, so it is that building's Architect's to rule). Nothing new to file.

*A near-miss worth recording:* the same suite run inside a `git worktree` shows 13
failures at every commit, because `glass/paths.ts` resolves `cityRoot()`/`flowsDir()` to
`~/code/agents` — a worktree's belvedere tests read the **mainline's** flows. The first
read of that (13 → 1) looked exactly like "024 fixed twelve tests" and was wrong. The
control that killed it: swap only `doctrine/` under the live tree. **A claim without
evidence is a draft** — and a worktree is not a control.

---

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the charge at ~/code/agents/plans/024-parser.md —
the parser learns the standard.
```
