# 026 — the language linter

**Status:** LANDED 2026-08-29 · **Depends on:** 024 · **Staffing:** Builder · opus-high

## Mission

`doctrine lint` grows a vocabulary arm: the graveyard, the spelling lexicon, the
id-prefix table, the pinned formulas — so speech drift is caught the way format drift
already is. The standard names its own enforcement (§8): ancestor manny's
smuggler-words rules (M13), food `lab/021/lexicon.json`, venue `doctrine lint`.

## Inputs — read before working

- `canon/work/STANDARD.md` — §8 the language law (spelling ruling, acronym law,
  enforcement clause) · §9 the graveyard · §7 the id namespace · the pinned 24.
- `lab/021/lexicon.json` — the census food: 3,066 terms with senses, forms, and
  collision sites (tells the arm which surface senses are NOT the Guild's — e.g. a
  UI "row" is not a board unit).
- manny's M13 smuggler-words rules — the ancestor; read it in cap-mega's manny and
  cite the birthplace in the findings.
- `doctrine/src/lint.ts` + 024's grammar — the arm extends them.
- 025's fence list (its charge doc §2) — the arms share one fence.

## The spec — blessed D71 ⬡✓ 2026-08-29; this map applies it

1. **The graveyard arm:** dead words (word-bounded; the forms from the graveyard
   table) on law surfaces → a failure naming the successor. Quotes and historical
   ids exempt.
2. **The spelling arm:** American, exception list {grey, greys, greyed}; -ize with
   it; word-by-word per the standard. The enforcement list is data in `doctrine/`,
   with a **drift test asserting the data matches STANDARD.md** — the standard stays
   the single home; the code mirrors it and the test is the alarm.
3. **The prefix arm:** canon reserves D · F · E · G · GA- · FC- (+ C now); campaign-
   scoped decisions write `‹prefix›-D‹n›`; bare D# outside the canon register →
   warning; one letter, one kind, per building — collisions reported, never
   auto-fixed (re-declaring is that campaign's own act, standard §2).
4. **The formula arm — stretch, with a kill criterion:** the pinned 24 as exact
   strings; detect near-verbatim drift (a line sharing a formula's distinctive
   word-run with variation). Kill: if false positives drown signal on the city corpus
   (spot-audit n ≥ 20, precision < 90%), land arms 1–3 and file the formula arm as a
   finding with the evidence — a documented kill is a win.
5. **The scope fence:** law surfaces only — 025's live list; voice surfaces (Logs,
   SAPHO) and history exempt by construction; lore registers are legal on voice
   surfaces (standard §5/§8).
6. **Venue:** an arm of `doctrine lint` (flag or default — the session's call, named
   in the findings), CLI + tests.
7. **Amended 2026-08-29 (025, Architect) — mint `Fixer` in `grammar.ts`'s `MANTLES`.**
   D71 §5 minted the Fixer as a mantle and 024's token work missed it, so the parser
   rejects a legally-staffed session: `ledger.mantle — unknown mantle "Fixer"`, three
   live failures in `rooted/archive/arborist` (sessions the record spells "Claude
   (opus-5, no mantle — Felix-directed)" and "null mantle (opus-5)", typed **Fixer ·
   unrecorded** by 025 because D71 rules that a session with no mantle IS a Fixer).
   One token, its fixture, and the three failures die. `Dispatcher` **stays** in the
   list — the parser reads the city's history forever (README's own law).

## Done when:

- Suite green with fixtures per arm (dead word · spelling · prefix · formula if it
  survives its kill criterion), plus a `Fixer` head fixture (item 7).
- `doctrine lint ~/code` shows **3 fewer** `ledger.mantle` failures than 025 left it
  (8 → 5), and no new class.
- The drift test binds the code's data to STANDARD.md — edit the standard, the test
  goes red; proven once inside the suite.
- A city run post-025 pasted: counts per class, fences honored, spot-audit ≥ 90%
  precision on n ≥ 20; residues classified — real hits become filed tickets. **The
  linter never edits the city.**
- `doctrine lint ~/code/agents` stays 0 — this repo is already respelled; the tool
  must agree.

## Out of scope

Editing any building's text (report, never rewrite). The formula arm past its kill
criterion. History and voice surfaces. New lint arms the standard doesn't name.

## Findings

**LANDED 2026-08-29.** `doctrine lint --vocab` hears the standard. Commits:
`ceed38f` (the arm — lexicon, vocabulary, fence, fixtures, 22 new tests) ·
`1875fe0` (the reader's README) · this doc, the board, the ledger and the inbox.

**Venue (spec item 6): a flag, `--vocab`, off by default.** The form arms are a doc's
honesty and gate the exit code; the vocabulary arm reports the city's respell backlog,
which 025 measured and laid as 030. Default-on would have buried five real form failures
under two thousand known ones — and the charge's own `no new class` bar says the same
thing. `--vocab` composes with `--live`, `--verbose`, `--json` and `--guard`.

**The surfaces it reads (spec item 5), against 025's live list:** a building's boards (master
docs included), its own `CLAUDE.md`, and its OPEN / IN FLIGHT / BLOCKED charge docs. Two
deliberate narrowings from 025's list, both stated rather than assumed: **`README.md` only at
a building's own anchor** (a nested package's README is not a law surface, and the city has
hundreds), and **the inbox is not read at all** — 025 swept the ISSUES *header*, but an entry
is a filed field report, i.e. history, and a header-only surface is not worth a second file
class. If Felix wants inbox headers policed, that is one line and a ruling.

### Done when — measured

**1. Suite green, one fixture per arm.** `bun test` from `doctrine/`:

```
 71 pass
 0 fail
 277 expect() calls
Ran 71 tests across 2 files. [43.00ms]
```

49 → **71** (22 new). `fixtures/vocab/` is the control: a live charge's Work cell fires and
a LANDED one does not, a bare `register` and a `DoD` fire while a ticked `unstaffed` and a
quoted "the Dispatcher is dead" do not, `colour` and `gray` fire while `grey` does not, a
paraphrase of formula 6 fires and a plain sentence beside it does not, and the prefix arm
warns twice — a borrowed `D1`, a colliding `C`. Plus `fixtures/conforming/ledger-fixer.md`,
the `Fixer` head (item 7).

**2. `doctrine lint ~/code` — 8 → 5, and the class is gone, not thinned.** Verbatim:

```
=== FAILURE CLASSES
     5  board.depends

=== TOTALS
  22 buildings · 30/30 board docs yielded a board · 33 boards · 477 rows · 477 fully typed (100%)
  14/14 ledgers parsed a tail (442 entries) · 3 fireable baton(s) · 239 kickoffs in 281 work docs · 248 decisions (queue 84) · 27 inbox entries
  13580 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  5 failure(s) in 1 class(es)
```

`ledger.mantle` 3 → **0** — one token (`Fixer` in `MANTLES`), and the three arborist entries
025 typed are legal. No new class. The five that stand are whiteboardy's board-truth defect,
still that building's Architect's at its gate 26, exactly as 025 left them.

**3. The drift test binds the code to the standard, and proves it can fire.**
`test/vocabulary.test.ts` reads `canon/work/STANDARD.md` and asserts §9's 32 table rows
(verbatim, in order), §8's pinned 24 (exact strings), §7's reserved letters and §8's
spelling ruling against `src/lexicon.ts`. Then it does it again against **mutated** copies —
a 33rd graveyard row, formula 22 reworded, `FC-` → `FD-`, `grey` → `mauve` — and asserts
each parse now disagrees. A green alarm that could never ring is not an alarm.

**4. The city run, post-025** — `doctrine lint --vocab ~/code`:

```
=== FAILURE CLASSES
  1903  vocab.dead-word
    81  vocab.spelling
     5  board.depends

=== WARNING CLASSES (reported, never auto-fixed — they do not move the exit code)
     9  vocab.prefix
```

Per building: whiteboardy **487** · cornerizer **410** · snappy **220** · cap-mega/docs
**168** · Belvedere **123** · manny **119** · simmy **91** · tig-avc **65** · units **63** ·
arborist **48** · this repo **44** · the rest ≤32. The nine prefix warnings are nine
buildings writing bare `D‹n›`: Belvedere 18, whiteboardy 23, snappy 26, snappy/ch2 20,
simmy 17, manny 16, hexwright 9, both spacex repos 7 each. **No collision anywhere in the
city** — no letter serves two kinds in one building; the only collision is the one the
fixture stages.

**Fences honored, checked by hand:** no hit anywhere in a ledger, a decisions body, a
closed charge doc, a findings section, a summons fence, a blockquote, a code tick, a quoted
span, a board's machine columns, a finished charge's row, `canon/`, `LOG.md`, `SAPHO.md` or
`dream.md`. The linter wrote nothing: **not one byte of the city moved.**

**5. Precision — 96.9% over n = 131, two audits.** Sample B, the record: every 66th hit of
the final report, n = **30**, **30/30 true** — dead charges (`row 03`, `Row 25`), dead
gestures (`cut`, `PARKED`, `RATIFIED`, `countersign`), dead names (`Felix-gate`,
`Dispatcher`, `work order`, `DoD`, `rider`, `the glass`) and one real BrE spelling
(`SI-metre`). Sample A, n = **101** stratified per pattern (5–8 each), drove the narrowing
below and left four known false-positive shapes standing, each measured and named:

| shape | example | rate |
|---|---|---|
| a product name | "Fire TV" (bob/lunchbox) | 1 site |
| a UI row in a fuzz log | "`suppress` of row 3" (snappy) | rare |
| the clipboard verb | "copy, cut, paste" (whiteboardy) | rare |
| harvest-as-data-collection | "harvest mtimes", "harvest-write flake" | 4 of 15 |

**6. `doctrine lint ~/code/agents` — 0, exactly as 024 left it** (form arms, default). Under
`--vocab` this repo reports **44**, and that is not a contradiction the tool can spell away:
see F3.

### The method, and what it cost

Ancestor cited: **manny's M13** (`campaign-id`, hard error) in cap-mega's
`model-scripts/lint-manual.py`, born at `manny/plans/29-campaign-id-lint.md` — LANDED
2026-08-09 on `manny/29-campaign-id-lint` (`b4be16ff`, `2a9f1b6a`; merged `4d7ff621`). Its
three laws were taken whole: **narrow the pattern, never whitelist a file**; **a pattern
that cannot be written without false positives is dropped, in writing**; **one code per arm,
the excerpt differentiates** (M13's own §2 ruling, for the same reason).

**Eight of §9's thirty-two rows are dropped, each with its reason in `src/lexicon.ts`:**
`chain` (toolchain, promise chaining) · `fold` (D63's own "schema fold" is an address) ·
`wave` (a shape in half the city's UI prose) · `move` (the commonest verb in English; the
baton's slot is typed already) · `window` (a real object in every UI building, and lore keeps
its windows by the standard's own parenthetical) · `strike` (§7 keeps `~~strike~~` as live
notation) · `pass` (formula 11 IS "Passing = finished."; the law bans and blesses one word in
one breath) · the four-slot waggle (a document shape, not a word). **A documented kill is a
win** — eight times.

**Three rows are narrowed, not dropped:** `row` → a reference (`row 26`, `the row-01
Digger`), which is M13's own trick for the same word · `true` → `trued`/`truing` only, the
inflections that can only be the verb · `fire` → the bare word only. That last one is
measured: `fire` scored **8/8** Guild-sense on the corpus, `fires` **0/5**, `firing` **1/8**,
`fired` **4/8** — in a city of event handlers a clause fires, a listener fires and a kill
criterion fires, and none of them is a dispatch. Dropping three inflections cost recall on
"the batch was fired" and bought ~150 false positives' worth of silence.

**The formula arm survived its kill criterion, and its verdict is a shrug.** It fires on the
fixture (formula 6, "Measurements carry their **own** conditions") and **zero times in the
city** — 0 hits, therefore 0 false positives, therefore precision is not below 90% and the
kill does not trigger. But the honest reading is that the formulas were pinned yesterday:
this arm is an alarm for future drift, not a backlog finder, and it has found nothing because
there is nothing yet to find. Its floor is stated rather than hidden — three spine words
minimum, so formulas 9, 11 and 22 ("A paraphrase is a defect.", "Passing = finished.",
"Creep is a bug.") can never fire; a two-word formula matched on one word would fire on every
sentence in the city that says "defect".

**The fence is structural, not a list of exceptions.** `mask()` blanks history and voice out
of the text — same length, same newlines, so every offset stays real — before a pattern runs.
Two fence rulings are new and are the ones worth challenging:

- **A LANDED or KILLED board row is history whole.** Not just its Status annotation (025's
  fence) — its Work cell too, because a finished charge's title is the address its ledger
  cites, and respelling "the great re-cut" renames the past. This killed a real false-positive
  class in this repo's own MAP (charges 0, 05, 18, 21, 023, 025).
- **`canon/` is fenced.** §9 IS a table of dead words; a law book that may not name the dead
  cannot bury them. 023 respelled it under Felix's sign-off and 025 fenced it for the same
  reason.

**And the ruling that makes the arm livable: a mention is spelled in ticks or quotes.** The
arm cannot tell use from mention — 023-F3 said so and 025 laid 030 on exactly that
adjudication. So the doc says which, and the two spellings that already say it are the fence's
own: `` `unstaffed` `` and *"the Dispatcher is dead"* are invisible to the arm. This repo's
MAP has four bare `Dispatcher` mentions in tombstone prose; the cure is four pairs of
backticks, not a per-file exemption. Filed, not applied — this charge does not edit text.

### F1 — the parser cannot read `‹prefix›-D‹n›`, the very form §7 mandates (filed)

`parseDecisions`' candidate regex is `\*\*[A-Za-z]{1,8}-?\d+[a-z]?` — a letter run, an
optional hyphen, then **digits**. `VX-D2`, `PD-D9`, `TH-D11`, `LB-D10`, `C-D2` all fail it,
so the id shape the standard tells every campaign to adopt is invisible to the reader that
polices it.

**Measured:** bob declares **53** decisions as `- **PD-D‹n›**` / `**TH-D‹n›**` / `**LB-D‹n›**`
across `docs/campaigns/`, and `doctrine lint ~/code/universal_robots_sdk/bob` reports
**`0 decisions`** for all four of its buildings. A silent zero — the exact genus this suite
was built to kill (item 16's "the fail count LIED"), and it means the census's 214 `PD-D` /
105 `TH-D` / 87 `LB-D` / 12 `C-D` ids are outside the register entirely.

Not fixed here: it is 024's parser, the widening changes `decisions`, an entity total the
count-regression guard watches, and it wants its own before/after evidence. `fixtures/vocab/DECISIONS.md`
carries `VX-D2` as the checked-in reproduction. **The prefix arm currently advises a form the
reader rejects** — that is the sharp end of this finding, and it is why the arm warns rather
than fails.

### F2 — the census's -ise stoplist is short, so `ortho-report.md` overstates -ise by ~41

`lab/021/ortho.ts`'s `ISE_OK` omits `improvise`, `advertise` and `supervise` — all three sit in
`ortho-report.md`'s own "top -ise" table (26 + 8 + 7 = 41 of its 193). The arm inherited the
list, fired "improvise → improvize" on the corpus, and the fix is in `src/lexicon.ts` with the
census cited: 21 words added, `tortoise` among them. The census's ratio line is wrong by that
much; nothing downstream of it was decided on the ratio, so this is a correction, not a recall.

### F3 — the charge's own `Done when` has a contradiction, and it is not resolvable by building

Two bullets cannot both be met: *"the linter never edits the city"* + *"editing any building's
text" is out of scope*, and *"`doctrine lint ~/code/agents` stays 0 — this repo is already
respelled; the tool must agree."* Under `--vocab` this repo reports **44**, and every one of
them is real:

- **13 in MAP.md** — 4 `Dispatcher` tombstone mentions · `the keel sitting` and `the glass` in
  two OPEN charges' own titles (20 and 027) · `the glass` again in a batch note · a bare `the
  register` · a `PARKED` mention · a `fire` · `colour` ×3.
- **31 in OPEN charge docs** — 018's eleven (`Row 016`, `cut`, `DoD`, `the register`) · 020's five
  `keel`s and its `Dispatcher` · 022's five · 011's three `fire`s · 027's two `the glass` ·
  028's and 030's `Dispatcher`s.
- **0 in CLAUDE.md** — the one prose-only surface the arm reads here, and it is clean.

Word by word: `Dispatcher` 13 · `colour` 7 · `the glass` 4 · `keel` 4 · `fire` 4 · `the
register` 2 · `cut` 2 · `row 016`/`Row 016`/`Row 017`/`row-16` 4 · `PARKED`, `DoD`, `behaviour`,
`synchronise` 1 each.

025's claim was **grep-clean on the surfaces it finished**, and where the tool can check that
claim it agrees: `CLAUDE.md` is read and reports **0**. (`ISSUES.md`, `docs/load-map.md` and
`doctrine/README.md` report 0 because the arm never reads them — an inbox entry is a filed
report and a non-anchor doc is not in the register. That is silence, not agreement, and it is
named here rather than counted as a pass.) Every one of the 44 is on a surface 025's own
findings do not claim — MAP's §3 and §5
prose (tombstone mentions the sweep deliberately left readable), the OPEN charge docs it did
not name (11, 18, 20, 22, 027, 028, 030 — it named 11, 20 and 22 for the *machine* tokens
only), and **9 spelling hits, which no charge has ever swept**: D71 §8's spelling ruling
landed with the standard and 025 was the graveyard's sweep, not the lexicon's.

So: the form run is 0, the tool agrees with 025 where 025 spoke, and "already respelled" was
true of less than it sounded.

**Ruled, and this is the escalation:** the bar met here is the form run at 0. The vocabulary
backlog for this repo is 44 hits needing use-vs-mention adjudication — the same method 030
owns for the outer city — and it is **filed as a ticket, not swept**, because sweeping it is
editing building text this charge is forbidden to touch. Felix's call whether it rides 030,
becomes 031, or waits.

### F4 — charge 018's own doc still reads OPEN, three days after the board landed it

`plans/018-great-recut.md`'s `**Status:**` line says `OPEN`, so `isLiveWorkDoc` reads it as a
live surface and the arm lints its history (12 hits). The MAP says **LANDED** (025 reconciled
it). One of the two is lying, and by 025's own findings it is the doc. A one-line repair, in
nobody's scope today; filed.

### Adjacent, checked so the report is not a guess

**Belvedere is unmoved by the `Fixer` minting.** Its suite is 649 pass / 2 fail before and
after this charge — both reds are 025's `d dispatcher` preset retirement (`colourOf(rig,
'dispatcher')` now falls to felikai grey, and a flow fixture beside it), verified by running
belvedere's suite against `doctrine/` at `b38b391`. `mantleChips` gains a Fixer chip with no
preset, which is 027's business.

**One new plumbing seam, deliberately additive:** `Fail` gains `severity: 'fail' | 'warn'`
(the factory defaults it, so no call site moved), `Artifact` gains `'prose'`, and
`Building.files` gains `prose: string[]` — a building's own master doc and CLAUDE.md, at its
anchor only, because 025's live list holds surfaces that staff nobody. No entity total moved:
the guard's gauges are untouched and the city's counts are identical before and after.

---

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/canon/work/STANDARD.md §8–§9 (blessed law, D71)
and execute the charge at ~/code/agents/plans/026-language-linter.md —
the linter learns to hear the standard.
```
