# 031 — doctrine v1.2: the defects

**Status:** LANDED 2026-08-29 — one `Done when:` bullet NOT MET, named at DoD 2 · **Depends on:** — · **Staffing:** Builder · opus-high

## Mission

Four measured defects in `doctrine/` die, each with a fixture that proves it and a
guard that keeps it dead. Three arrived through the inbox with a repro (swept at
grand-architect-15 — git keeps the bytes; the evidence is restated whole below, so this doc stands
alone); the fourth arrived from agents-flow-1's stopped first ignition, laid at the
desk the same evening (2026-08-29).

## Inputs — read before working (do not re-derive)

- [plans/025-respell-sweep.md](025-respell-sweep.md) §Findings F1/F2 — the stale-parse
  lie and the house dialects, measured on whiteboardy.
- [plans/026-language-linter.md](026-language-linter.md) §Findings F1 — the prefixed-D
  blind spot, measured on bob.
- `doctrine/README.md` · the count-regression guard (024's) · the round-trip law as
  read at charge 016-F1 (declared-changes + identical-otherwise + byte assertion).

## Spec

1. **`migrate`'s stale-parse lie.** Every rule fires off ONE parse of the pre-migration
   document, so a head rule that changes entry boundaries poisons every later field
   rule: on whiteboardy the head rules took the ledger 5 → 127 parsed entries, and
   `ledger.unrecorded-clauses` — computed against the 5-entry parse — appended
   `Decided: unrecorded.` / `Next: unrecorded.` into **61 entries carrying a real
   clause**, while the round-trip law printed `ok` throughout (`decided`/`next` are
   declared-changeable fields). Fix, recommended: **re-parse between rule classes** —
   structure rules run, the document re-parses, field rules run on the fresh parse.
   Fallback, legal if re-parse breaks the round-trip accounting: refuse to fill a
   clause in any entry whose head this same run rewrote. Say which you built and why.
   Fixture: a whiteboardy-shaped ledger whose head rules multiply its entries; assert
   zero false fills and an honest round-trip line.
2. **House-dialect migrate rules.** whiteboardy spells 61 clauses `Decided (<scope>):
   <text>` and 3 `Next — <text>`; `parse` fails them and `migrate` has no rule, so 025
   repaired ~130 clauses by hand. Add both rules: the colon relocation
   (`Decided (<x>): y` → `Decided: (<x>) y` — total, mechanical, byte-preserving) and
   the em-dash head (`Next — <text>` → `Next: <text>`). Form-only under the molt
   clause; fixtures both directions (applies where it should, refuses where it
   shouldn't).
3. **`parseDecisions` reads `‹prefix›-D‹n›`** — the id form STANDARD §7 mandates. The
   candidate regex today (`\*\*[A-Za-z]{1,8}-?\d+[a-z]?`) rejects `PD-D9`, `TH-D11`,
   `LB-D10`, `C-D2`: bob declares **53** decisions in that shape and the reader
   reports **0** — a silent zero. Widen the reader; `decisions` is an entity total the
   count-regression guard watches, so paste before/after city totals and name the
   expected moves (bob 0 → 53 among them). Repro checked in:
   `doctrine/fixtures/vocab/DECISIONS.md`'s `VX-D2`.
4. **The stale-kickoff blind spot.** The parser counts kickoffs but never reads
   them: seven un-ignited charges in this repo carried pre-door fences (laid hours
   before 033 landed the door), 032's carried a pointer into the purged register,
   and the flow engine fired them verbatim — agents-flow-1's first ignition ran
   without the door and ⬡ stopped it (2026-08-29). Add the kickoff arm: in an OPEN
   or IN FLIGHT charge doc, the fenced kickoff must open with the summons grammar —
   the summons line (`You are a|the ‹Mantle|Office› at ‹tier›.`), then the door line
   (`Enter by the door — read …GUILD.md`), then the wear line — fail on drift: the
   single-glance test (DOCTRINE §5), mechanized. LANDED and KILLED docs are history,
   exempt; an inline-stanza kickoff (unmantled cheap tier, README grammar) passes on
   the stanza's opening line instead. Fixture: tonight's seven, both states (git
   holds the pre-repair bytes at 7a1da16).

## Done when:

- `cd doctrine && bun test` green, count named (≥ the current 71), the four defects
  each red-under-pre-031 / green-here (the guard's both-ways proof, 013-F1's pattern).
- `doctrine lint ~/code/agents` → **0**.
- City dry-run counts pasted (`doctrine lint ~/code` before/after — movement explained,
  bob's four buildings reporting nonzero decisions among it).
- Belvedere unmoved: its suite green at its own head, byte-diff of its lint output
  before/after explained or empty.

## Out of scope

- New grammar tokens — 032's charge. The vocabulary arm's patterns. Editing any
  building's files: this charge fixes the tool, the city stays still.

## Findings

**LANDED 2026-08-29** — the four defects die, each with a checked-in fixture and a
red-under-pre-031 / green-here proof. Commits, one per item:
`3125783` (item 3) · `38787fe` (item 2) · `99e2b15` (item 1) · `10f4012` (item 4) ·
`README` follows. One Done-when bullet is **NOT MET** and its residue is named at DoD 2.

The control tree for every "pre-031" number below is `git archive HEAD doctrine canon`
at `acffb86` (this charge's parent), unpacked and run against the same bytes:
`bun test` → **71 pass / 0 fail**.

### Done when — measured

**1. `cd doctrine && bun test` — 71 → 80 pass, 0 fail.** Verbatim:

```
$ cd ~/code/agents/doctrine && bun test
bun test v1.3.10 (30e609e0)

 80 pass
 0 fail
 334 expect() calls
Ran 80 tests across 2 files. [45.00ms]
```

Nine tests added, every one of the four defects red under the pre-031 tree and green
here — the both-ways proof, per defect, at F1–F4.

**2. `doctrine lint ~/code/agents` → 0 — NOT MET: 3, and none of the three is this
charge's to touch.** Verbatim, at landing:

```
=== FAILURE CLASSES
     2  kickoff.door
     1  ledger.baton

=== TOTALS
  4 buildings · 8/8 board docs yielded a board · 8 boards · 168 rows · 168 fully typed (100%)
  4/4 ledgers parsed a tail (237 entries) · 1 fireable baton(s) · 164 kickoffs in 165 work docs · 38 decisions (queue 0) · 2 inbox entries
  70 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  3 failure(s) in 2 class(es)
```

- **1 `ledger.baton` — 029's live worktree, not this charge.** The same failure is
  reported by the *pre-031* tree against the same bytes (`6 failure(s) in 2 class(es)`
  city-wide, below), so it predates every line here. `bv/029-summon-harness`'s ledger
  tail at `:1886` carries a Next clause with no instrument; 029 is in flight and G1
  merges that branch.
- **2 `kickoff.door` — one real defect, counted twice.** `belvedere/plans/c1-fence-repoint.md:63`
  carries a pre-door fence, and the ISSUES entry of 2026-08-29 (the `bv/*` worktree
  double-count) is why one file reports as two. This charge's fence forbids editing any
  building's files, so it is filed, not fixed — see F5, which also names the second,
  louder half: C1's own header says OPEN while belvedere's board row says **LANDED**.

**3. City dry-run counts — `doctrine lint ~/code` before/after, same tree, tool swapped.**
The before was re-measured with the pre-031 tool at landing time (029 and 030 are live in
this city and moved 2 ledger entries and 2 inbox entries under both runs; measuring the
old tool against the old clock would have credited their writes to this charge):

```
                                   pre-031            031
  buildings                             24             24
  board docs / with a board          34/34          34/34
  boards                                37             37
  rows · fully typed             570 · 570      570 · 570
  ledgers · tails · entries      16/16 · 572    16/16 · 572
  fireable batons                        3              3
  kickoffs in work docs           330 / 372      330 / 372
  decisions (queue)               197 (81)       197 (81)
  inbox entries                         24             24
  FAILURES                    6 in 2 classes  26 in 3 classes
```

**Every guarded entity total is identical** — nothing was lost, so the count-regression
guard is silent. The whole movement is `+20 kickoff.door`: twenty live charge docs across
the city whose fences would fire without the door (snappy 9 · simmy 4 · manny worktree 3 ·
cap-mega `docs/units` 2 · belvedere 1 ×2 copies). Each belongs to its own building's
Architect; enumerated at F4.

**`decisions` did not move, and the charge's projection of `bob 0 → 53` is wrong** — a
measured correction, not a miss. Evidence and arithmetic at **F3**.

**4. Belvedere unmoved.** Its suite at its own head:

```
$ cd ~/code/agents/belvedere/glass && bun test
 673 pass
 0 fail
 1817 expect() calls
Ran 673 tests across 26 files. [2.27s]
```

Byte-diff of `doctrine lint ~/code/agents/belvedere`, pre-031 vs 031 — **not empty, and
explained**: exactly one added block, the `kickoff.door` on `plans/c1-fence-repoint.md:63`
(DoD 2 above, F5 below). Every count line is byte-identical: `1 board(s) · 39/39 rows
typed · ledger 2026-08-29 · baton felix · 38 kickoff(s) · queue 0`.

### F1 — the stale-parse lie: built as the re-parse, and it needed a second half

**Built: the recommended cure — re-parse between rule classes.** `migrateText` now runs the
cell and line rules, materializes what each source line *became* (`becameLines`), and the
clause pass reads that. Two documents are read on purpose and the split is not cosmetic: an
entry's **license** to receive a typed absence is a fact about the source (the old dialect's
own head shape, its pre-D63 date), its clause **presence** a fact about the migrated text.
Computing both on the migrated text would have silently disarmed the whole pass — every
migrated head is `**…**`, so `dialect` would read false for every entry and the `bare/LEDGER.md`
fixture's honest `unrecorded` would have vanished.

The round-trip accounting is untouched, so the fallback was never needed: clause edits stay
anchored in before-space — merged into the edit that hosts the span's last line, or minted at
a source line — and `roundTrip`'s byte assertion holds across every fixture.

**Isolated, with a control.** The defect is not the dialect blindness; the two are separable
and both are real. Running item 2's rules **without** item 1's re-read (tree at `38787fe`) on
whiteboardy's pre-025 ledger:

```
$ git show 8dc96f2:LEDGER.md > wb-LEDGER.md      # whiteboardy, pre-025 bytes, 3840 lines
### pre-031
entries parsed: 5 before -> 127 after
ledger.unrecorded-clauses fills: 66
round-trip: ok
### item-2-only (rules, no re-read)
entries parsed: 5 before -> 127 after
ledger.unrecorded-clauses fills: 66      ← the rules fired; the clause pass still read the stale bytes
### 031
entries parsed: 5 before -> 127 after
ledger.unrecorded-clauses fills: 4
round-trip: ok
```

**66 → 4, and all four survivors are honest** — verified by hand against the source spans:
three entries (`:1356`, `:1416`, `:2139`) carry `Changed:` and `Next:` and no Decided-shaped
line at all; one (`:3673`) carries `Decided:` and no Next. **62 false fills killed.** 025-F1's
count was 61 + snappy's; the extra one is the same defect in the `Next` slot.

**The second half, and why it is item 1's and not creep.** The re-read alone left **2** of the
66 alive, because two live clause spellings are repaired by no rule and the presence test only
knew `Decided:`. So the test now asks the honest question — does this entry *record* the field
in any spelling: a `Decided:` anywhere in the flattened body, **or** a line that opens with the
field name whatever punctuation follows it. Where the tool cannot repair the spelling it
**refuses to fill**, and a refusal is an `ledger.decided` failure with a human's name on it,
where a fill is a lie the round-trip law would have blessed. The two spellings, both live in
whiteboardy and both now refused (fixture: the `'a clause spelling no rule repairs'` test):

- `Decided/measured: **the §3.4 pan is gone** — …` (`LEDGER.md:2512`) — a third label spelling.
- `Decided (Architect scope, Felix's veto live — same class as the two already-` (`:2532`) — a
  scope parenthetical that closes on the **next** line, so no line-scoped rule can see the `):`.

Both are candidates for a later charge (a wrap-aware colon relocation, a `Decided/x:` rule);
neither is repaired here.

**The general lesson stands and is now in the tool's own README:** `round-trip ok` is a
statement about declared fields, not about meaning.

### F2 — the two house-dialect rules, and the one field name the spec did not name

`ledger.clause-scope` relocates the colon (`Decided (<x>): y` → `Decided: (<x>) y`) and
`ledger.clause-dash` turns the joiner into the colon (`Next — y` → `Next: y`). Both are
LEDGER.md-scoped, line-start only, total and byte-preserving — asserted as a from/to pair in
the suite, not by eye:

```
['ledger.clause-scope', 'Decided (inside the fence): the verbs stay put.', 'Decided: (inside the fence) the verbs stay put.'],
['ledger.clause-dash',  'Next — dispatch E8.',                             'Next: dispatch E8.'],
```

**Both rules take both field names, deliberately.** The spec's example named `Decided (…)`
for the colon and `Next —` for the joiner; 025-F2's own measurement names `Next (<gate>):` too.
One alternation covers all four, and refusing `Decided —` would have left the identical defect
on the page under a different word — consistency that carries no information. Named here
because it is one word wider than the spec's letter.

Refusal fixture, all four directions asserted: the already-conforming form (idempotent), a
`Decided (scope):` buried mid-prose (025-F2's *other* shape, which no rule here claims), a
`Next steps (…):` heading, a `Nexus — …` prose line; plus the file gate (the same line in a
`DECISIONS.md` is untouched) and the fence gate (a quoted dialect line inside a code fence).

**Live in the city, one instance, untouched:** `belvedere/LEDGER.md:1733` spells
`Decided (fold/cut rulings, delegated scope):`. `doctrine migrate` would now propose that
relocation; this charge runs no `--write` and the city stays still.

### F3 — item 3's premise measures wrong: `bob 0 → 53` is unreachable, and the number is 5

The defect is real and is fixed: `parseDecisions` rejected the id form §7 mandates. The id is
now named once, in `grammar.ts` as `DECISION_ID`, and read from all four places that used to
spell it (the candidate test, the head match, and both migrate decision rules) — the drift
that produced 026-F1 cannot recur without editing one constant.

Red/green on the checked-in reproduction, `fixtures/vocab/DECISIONS.md`:

```
PRE-031 candidates: 2 ids: [ "D1", "C4" ]
031     candidates: 3 ids: [ "D1", "C4", "VX-D2" ]
```

**But the projected move does not exist.** bob's 53 prefixed-D bullets were counted by shape:

```
$ cd ~/code/universal_robots_sdk/bob
$ grep -rEc "^\s*[-*]\s*\*\*(PD|TH|LB|C)-D[0-9]" docs/campaigns/*/README.md
  catalog 5 · pods 19 · lunchbox 13 · theseus 16          (= 53)
$ grep -rEoh "^\s*[-*]\s*\*\*(PD|TH|LB|C)-D[0-9]+[a-z]?\*\*.{0,14}" docs/ | sed -E 's/\*\*[A-Z-]+D[0-9]+[a-z]?\*\*/**ID**/' | sort | uniq -c
      5  - **ID** (2026-08-28,        ← the §8 attribution shape
     48  - **ID** — <text>            ← no attribution at all
```

**48 of the 53 are not rejected by the id pattern — they are rejected by the attribution
guard**, which exists on purpose: a candidate must carry `(…` or ` · ` after its id, or every
bold cross-reference bullet in a master doc is promoted to a malformed decision (item 11's
law, still asserted in the suite). Widening the reader to admit them would trade one silent
zero for a corpus of invented decisions — that is a doc defect in bob, not a parser defect.

**The remaining 5 do parse now, and still report as 0, for a third reason:** they live in
`docs/campaigns/catalog/README.md`, and catalog is **not discovered as a building** — its
board's header row reads `| row | what | deps | staffing | status |`, so the register never
reaches its `## Decisions` section. Measured directly, bypassing the register:

```
catalog PRE-031 candidates: 0
catalog 031    candidates: 5 · parsed 0 · fails decision.colon ×5
```

That is the silence converting to noise exactly as designed — five loud, addressable failures
where there were none — and it will surface the moment catalog is discovered. Filed to
`ISSUES.md`; not chased.

**Dated correction (DOCTRINE §6):** 026-F1's "bob declares 53 decisions in that shape and the
reader reports 0" is right about the ids and wrong about the recovery. Corrected 2026-08-29:
the id widening recovers **5**, all in catalog; 48 carry no attribution and are bob's to
spell; catalog's non-discovery gates all 5 today. Nothing downstream was decided on the 53.

### F4 — the kickoff arm caught 20 live pre-door fences on its first walk

The arm: in a work doc whose own `**Status:**` is unfinished, the fence must open summons line
· door line · wear line. LANDED and KILLED are exempt — the door is younger than those fences
and always will be. Codes: `kickoff.door`, `kickoff.wear`, one per fence (the wear check is
`else if` — a fence that lost the door reports one defect, not two).

The fixture is tonight's seven in both states, `git show 7a1da16` verbatim
(`fixtures/kickoff/`), plus the two exemptions. Red/green, same fixture, both trees:

```
$ (pre-031)  doctrine lint fixtures/kickoff  →  16 kickoff(s) · 0 failure(s) in 0 class(es)
$ (031)      doctrine lint fixtures/kickoff  →  16 kickoff(s) · 8 failure(s) in 2 class(es)
                                                7 kickoff.door (all in plans/pre-door.md)
                                                1 kickoff.wear (plans/wear.md)
```

The kickoff count is unchanged in both — **the arm reads fences, it does not stop counting
them**; the pre-fix state is the silent zero this suite exists to kill, not a low count.

**Live catches, city-wide, 20 — each its own building's:** snappy 9 (`plans/12`, `19`, `20`,
+6) · simmy 4 (`spikes/b16-verdict-honesty.md` ×2, `b17-jar-identity.md`, +1) · manny's
`user-manual` worktree 3 (`plans/006-linter.md`, `25-residual-walk.md`, `29-campaign-id-lint.md`) ·
cap-mega `docs/units` 2 (`plans/007-venue-maturation.md`, `08-fg2-findings.md` — both wrapped
summonses) · belvedere 1, counted twice (F5).

**Two decisions inside the fence, named:**

- **BLOCKED counts as live.** The spec named OPEN and IN FLIGHT and exempted LANDED/KILLED;
  `isLiveWorkDoc` — the repo's existing notion of live, now moved to `parse.ts` so
  `building.ts` can reach it without a cycle — also admits BLOCKED. A blocked charge ignites
  when it unblocks, so its fence is read. One concept, one word.
- **The ledger tail's baton fence is NOT armed.** `classifyBaton` reads its instrument fences
  with no `live` flag, so a Next-clause summons is counted and never door-checked — and that
  fence is fired verbatim exactly as a charge doc's is. Master's own tail carries the door
  today, so nothing is red; this is a hole, not a defect, and it is out of this charge's
  spec ("in an OPEN or IN FLIGHT **charge doc**"). Filed for the next doctrine charge.

**The inline stanza is named, not accidental.** A fence opening `You are an Agent of the
Guild` passes: it names no mantle and wears no charter, so the three-line grammar does not
apply. Before this charge it also passed — but only because "Agent of the Guild" happens not
to start with a mantle name, which is an accident, not a law. It is now a constant with a
reason and a test. It is **not counted** as a kickoff: the `Kickoff` type demands a mantle and
a tier and this ignition honestly has neither, and inventing `Fixer` for it is a judgment, not
a parse. Whether the register should count it is filed, not decided here.

### F5 — belvedere's C1 says OPEN on its own header and LANDED on the board

The arm's one live catch inside this repo, and the louder half is not the fence:

```
~/code/agents/belvedere/plans/c1-fence-repoint.md:3   **Status:** OPEN — laid 2026-08-29
~/code/agents/belvedere/README.md:243                 | C1 | … | **LANDED** 2026-08-29 — … |
~/code/agents/belvedere/plans/c1-fence-repoint.md:63  Wear ~/code/agents/canon/mantles/builder.md,
```

C1 landed (commits `68b953b` + `ba2ed0b`, its own findings pasted in the doc) and its header
was never trued, so the doc still advertises itself as ignitable — with a pre-door fence.
Belvedere's own batch-6 sweep repaired six fences plus G3 and the tender at `389d0a7`; this one
was outside that set because its doc reads closed to a human and open to the parser.

Both repairs are belvedere's Architect's — either is one line — and this charge's fence
forbids editing any building's files. Filed to `ISSUES.md`; it is the whole reason DoD 2
reads 3 and not 0.

### F6 — what a reader of the next doctrine charge inherits

Three residues, all measured above, none chased: the two unrepairable clause spellings (F1's
tail), the un-armed baton fence (F4), and bob's catalog register gap (F3). The ISSUES entry of
2026-08-29 on `bv/*` worktree double-counting is confirmed live by every number in this doc —
belvedere's one defect reports as two — and is still unruled.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7
and execute the charge at ~/code/agents/plans/031-doctrine-defects.md.
```
