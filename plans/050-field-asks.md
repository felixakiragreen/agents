# 050 — doctrine v1.5: the field's asks

**Status:** LANDED 2026-09-15 — all five bars met, two with named corrections to the bar's arithmetic (F2); nine items, ten findings, suite 197 → 217, the city's failure classes and entity totals byte-identical · **Depends on:** — · **Staffing:** Builder · opus-high · **Parallel-safe with:** 051 · **Blessed:** Felix, 2026-09-15, in the room (grand-architect-26): ⬢1

## Mission

The parser's third opening: nine typed asks the field filed between 2026-09-09 and 2026-09-15, each law in the canon since the sweep of 2026-09-15 and unread by `doctrine/`. When this lands, `doctrine/` reads the ⬢ mark, a gate doc's batch slot, typed holds and escalations, the two header slots, a gate's readiness on a kill, a dated deferred list with its horizon and its drop lint, a ledger cap that counts prose, and a building's `WORDS.md`; and `migrate` carries the two respelled formulas. The form is 049's: every item a fixture and its control, dry runs only outside this building.

## Inputs — read before working

- The law each item builds: `canon/work/DOCTRINE.md` §3 (the WORDS.md law), §4 (Depends-on, the deferred list), §7 (the cap), §8 (the register), §10 (the tender line); `canon/work/STANDARD.md` §1 (the magnitude), §7 (⬢), §8 (formulas 8 and 26); `DECISIONS.md` D89, D90.
- `plans/032-flow-grammar.md` §Spec — the D74 tokens (holds, E-ids, Branch, encapsulation) as specified before the charge was killed; the spec stands, the flow it served died.
- `plans/049-residue.md` — the pattern: fixture + control per item, the pre-charge tree as the control's red, `--summary` for the reader; its F1–F8 bind this charge.
- `doctrine/README.md`; `doctrine/src/grammar.ts` (`BLESSED_MARK`, `CREDIT_MARK`, `MARK_TAIL`); `doctrine/src/parse.ts` (the register's queue, the deferred list, the ledger cap); `doctrine/src/lexicon.ts` (the pinned formulas — 8 and 26 already respelled there); `doctrine/src/respell.ts`.
- stigmergon `plans/086-works-sitting.md` §Canon asks and `docs/works.md` §2 — the engine's reading of the batch slot and the tender line; stigmergon `WORDS.md` — the register the lexicon arm reads; stigmergon `plans/G23-harness-hygiene.md` §Findings — the deferred drop the lint must catch (ten live entries swept out at `6adac11`).
- Known, do not re-derive: a ⬢-marked entry with Felix as decider already stays out of the queue by his name (`parse.ts`, the queue filter); the vocabulary arm is warn-only (STANDARD §8, the enforcement contract); `canon/` is fenced from the vocabulary arm; the ledger cap is a warning (041).

## Spec

Each item lands with a fixture under `doctrine/fixtures/` and a control that reds on the pre-050 source; the suite grows; `doctrine lint` over the register's buildings reads identical before and after except where an item names its change.

1. **The ⬢ mark** (D90). `MARK_TAIL` and the attribution parse read `⬢‹n›` with an optional date: n ≥ 1 is a blessing (`blessed`), n < 1 a credit on the statement, dated as a `⬡ go` is; the magnitude is typed on the decision (`magnitude?: number`) and `boot` prints it beside the mark. `⬡✓` and `⬡ go` parse as before; nothing respells.
2. **The batch slot.** A gate doc's header gains `**Batch:** ‹shape› · ceiling ‹n› · gauge ‹text› · account ‹name›` — shape one of serial · parallel; the members are the gate's Depends-on (the edge test, §4); the tender line stays its own field, and `tender: the dispatch` parses as the engine's. Typed on the charge header; the engine reads it through `parse --json`. The doctrine's §4 and §5 text follows at the landing, pasted by the office under this charge's grant (048's pattern).
3. **Typed holds and escalations** (032 §Spec): `LANDED ‹date› — holds: ‹list›` parses each hold as an `E‹n›` or a `⬡ ‹text›`; `E‹n› — ‹what›` and `E‹n› ruled ‹date›` are typed; a dependent charge whose dependency carries an unresolved hold is not ignitable.
4. **The header slots** `Parallel-safe with:` and `Branch: ‹name› from ‹base›`, typed on the charge header (§5's skeleton names both).
5. **A gate's readiness** (§4): a review gate is ignitable when each Depends-on is LANDED or KILLED; every other charge waits on LANDED.
6. **The deferred list** (§4): each entry's day derived from `git blame` (the line's first commit day); the building's horizon read from its master doc (`The deferral horizon`; thirty days when unnamed); `boot`'s count line says how many stand past it; lint warns (`board.deferred-drop`) when the deferred count falls between two commits and the ledger entry of that span names neither `promoted` nor `deleted`.
7. **The ledger cap** (§7): `ledger.entry-cap` counts the entry's prose — fenced blocks and the baton paragraph excluded.
8. **The lexicon arm reads `WORDS.md`** (§3): a building's register in the standard's form — its graveyard rows join §9's for that building, its entries are the building's local kinds; the arm walks `docs/` as well as the law surfaces; a re-mint of the building's own dead word warns.
9. **Formulas 8 and 26 by the converter** (D81): a `migrate` rule — `Ambiguity, never plurality, is the sin.` → `Ambiguity, not plurality, is the sin.`; `History is respelled, never rewritten.` → `History is respelled, not rewritten.` — run over this building, history included; every other building at its next Architect session.

## Done when:

- [x] `bun test` in `doctrine/` green, the suite larger than the pre-050 count by at least nine; each new fixture's control reds on the pre-050 source (name the sha).

      ```
      $ cd doctrine && bun test                      # at HEAD, every source commit in
       217 pass · 0 fail · 897 expect() calls — 217 tests across 7 files
      pre-050 (778c9b6): 197 — twenty new, 20 of them in test/asks.test.ts (one describe per item)
      ```

      **The control could not be run the way 049 ran it, and the reason is the charge's own shape** (F1).
      `git archive 778c9b6 doctrine canon` plus this charge's `test/` and `fixtures/` does not red the
      suite test by test — it refuses to LOAD it. Seven of the nine items add an export the pre-050
      reader has no name for, and an ES named import of an absent symbol takes the whole file down
      before one test runs:

      ```
      $ T=$(mktemp -d); git archive 778c9b6 doctrine canon | tar -x -C $T \
          && cp -R doctrine/test doctrine/fixtures $T/doctrine/ && cd $T/doctrine && bun test
       195 pass · 3 fail · 1 error
      (fail) boot … > the title carries the register Name, the root, HEAD and the day   [049's harness artifact]
      (fail) boot … > the count line reads the board, and the deferred count is the shelf with its horizon   [item 6]
      error: Cannot find module '../src/deferred' … · Export named 'FORMULA_RULE' not found in .../src/migrate.ts
      ```

      So the control runs at the FIXTURES, which is where a control belongs: one script, one line per
      item, run against both sources over the same fixture set.

      ```
      === BEFORE — the pre-050 source (778c9b6) reading 050's fixtures ===
        item 1a  magnitude typed: false · D1 blessed: false · D2 credit: null
        item 1b  statement: 1 on credit · magnitudes on the building: false
        item 2/4  parseChargeHeader exported: false · parseTender: false
        item 3a  holds typed: false · escalations: false
        item 3b  board.hold reported on the malformed hold: false
        item 5  readiness on the building: false · readiness() exported: false
        item 6  src/deferred.ts present: false
        item 7  entry-cap warnings on the two-entry fixture: 2 (of two entries, one is over cap on prose alone — the control)
        item 8a  src/words.ts present: false · files.docs: []
        item 8b  vocab.local-dead-word over the fixture building: 0
        item 9  formula edits: 0 · FORMULA_RULE exported: false

      === AFTER — the same script at HEAD ===
        item 1a  magnitude typed: true · D1 blessed: true · D2 credit: 2026-09-15
        item 1b  statement: 3 on credit · magnitudes on the building: true
        item 2/4  parseChargeHeader exported: true · parseTender: true
        item 3a  holds typed: true · escalations: true
        item 3b  board.hold reported on the malformed hold: true
        item 5  readiness on the building: true · readiness() exported: true
        item 6  src/deferred.ts present: true
        item 7  entry-cap warnings on the two-entry fixture: 1 (of two entries, one is over cap on prose alone — the control)
        item 8a  src/words.ts present: true · files.docs: ["city.md"]
        item 8b  vocab.local-dead-word over the fixture building: 2
        item 9  formula edits: 1 · FORMULA_RULE exported: true
      ```

      Every BEFORE line is the law unread and every AFTER line is it read. The script is under F1; it is
      a probe and not a fixture, so it lives in the finding and not in `doctrine/`.

- [x] `doctrine lint` over every register building: identical before and after except the intended (item 6's new warning class; item 7's count falling at golos and swordmaster) — both runs pasted.

      ```
      $ bun $T/doctrine/cli.ts lint <the register's twelve roots>     # BEFORE, 778c9b6
      $ bun doctrine/cli.ts lint <the same twelve>                     # AFTER, this tree

      === FAILURE CLASSES                        BEFORE and AFTER, byte-identical
         121  board.cell-cap
          12  kickoff.door
           5  board.depends
           2  ledger.row
           1  ledger.merged
      === WARNING CLASSES
         526 → 503  ledger.entry-cap            [item 7, the only thing that moves]
           1 →   1  decisions.size
      === TOTALS                                 BEFORE and AFTER, byte-identical
        15 buildings · 21/21 board docs yielded a board · 22 boards · 491 rows · 491 fully typed (100%)
        13/13 ledgers parsed a tail (622 entries) · 4 fireable baton(s) · 414 kickoffs in 482 work docs
        246 decisions (queue 57) · 18 inbox entries · 2 on credit · max interest 0
        228 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
        141 failure(s) in 5 class(es) · 527 → 504 warning(s) in 2 class(es)
      ```

      **Met, with two corrections to the bar's arithmetic (F2).** Item 6's new warning class fires
      **nowhere in the city** — no board's shelf shrank between its last two commits — and item 7's
      count falls at **nine** buildings, not two:

      | building | before | after | | building | before | after |
      |---|---|---|---|---|---|---|
      | agents | 95 | **88** | | simmy | 44 | **43** |
      | belvedere | 79 | **78** | | snappy | 44 | **42** |
      | golos | 2 | **1** | | whiteboardy | 107 | **105** |
      | stigmergon | 115 | **107** | | torch-angles | 1 | **0** |
      | manny | 16 | 16 | | swordmaster | 6 | 6 |
      | hexwright | 10 | 10 | | spacex-dashboard | 7 | 7 |

      Swordmaster is the bar's one miss and it is honest: its six entries are 173–927 words of PROSE,
      over the cap without an instrument or a baton to excuse them (the longest falls 927 → 927, the
      founding's 434 → 288). The bar predicted the buildings whose counts it had seen; the rule reaches
      every ledger that fences a summons.

- [x] `doctrine boot .` prints D89's and D90's marks as `⬢100` and `⬢10`, the queue 0.

      ```
      $ doctrine boot .
      # agents — boot · ~/code/agents · HEAD c6fd535 · 2026-09-15

      ## Board — BOARD.md: 56 charges · 1 live · 50 landed · 5 killed · deferred 11 · 0 past 30 days
      …
      ## Decisions — DECISIONS.md: 13 entries · queue 0
      - D89 ⬢100 — The Oxman law
      - D90 ⬢10 — The magnitude of the yes
      …
      Statement: 0 on credit · max interest 0
      ```

      The board's count line carries item 6's half of the same bar: `deferred 11 · 0 past 30 days`,
      the eleven dated by blame (oldest 2026-08-31, fifteen days) against this building's unnamed
      horizon. stigmergon reads `deferred 48 · 0 past 30 days` — G23-F6's own numbers, derived.

- [x] `doctrine migrate --summary .` then `--write` for item 9: the two old strings gone from this building's surfaces, history included, and the run a fixed point on a second pass; dry runs only elsewhere.

      ```
      $ doctrine migrate --summary .
        edits  rule(s)                   round-trip  file
            1  formula.respell×1         ok          lab/028/architect-v2.md
            1  formula.respell×1         ok          lab/028/architect-v3.md
            1  formula.respell×1         ok          lab/028/architect-v4.md
            1  formula.respell×1         ok          lab/028/architect-v5.md
            3  formula.respell×3         ok          ledger-archive.md
            1  formula.respell×1         ok          plans/047-unwrap.md
      8 edit(s) across 6 file(s) · 0 round-trip violation(s)

      $ doctrine migrate --write .      → Wrote 6 file(s).          (`e7cdfc1`)
      $ doctrine migrate --summary .    → agents: already in the current grammar — nothing to migrate.
      ```

      The two pinned strings survive at four addresses in this building and every one is a form being
      NAMED: this charge doc's own item 9 (ticked, beside its `→`), the rule's table in `migrate.ts`,
      and two control assertions plus the fixture in `doctrine/` — a control set's bytes ARE the form
      it exercises. **Elsewhere: nothing written and nothing owed.** A grep for the two strings across
      the register's other eleven buildings reads **0 files** in every one, so the owed runs the spec
      routes to their next Architect sessions are empty (F5).

- [x] Findings F1–Fn under this doc; `doctrine/README.md` current.

      Seven findings below. The README gains the ⬢ mark and the floor beside the credit mark, a new
      section for the charge doc's header and readiness, the shelf's day/horizon/drop under `boot`,
      the prose cap under the caps, `WORDS.md` and `docs/` in the `--vocab` table and fence, and the
      formula respell under `migrate` — plus `src/words.ts` and `src/deferred.ts` in the library line.

## Out of scope

- The engine's own `--json-schema` — stigmergon's; the coda's report vocabulary is law there to adopt.
- Any prose sweep — 051's; an absolutes lint arm — after 051 shows the pattern.
- Writing into any building but this one.

## Lanes

Red: none inside.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved it; probes ship with a control)*

**F1 — a charge that adds exports cannot have 049's control, and the fixture control is the better one anyway.** 049's method — `git archive <lay-sha> doctrine canon`, drop the new `test/` and `fixtures/` on top, watch each new law test red — assumes the new tests can still *load* against the old source. Seven of 050's nine items add an export the pre-050 reader has no name for (`parseChargeHeader`, `parseTender`, `readiness`, `escalationsIn`, `FORMULA_RULE`, and the modules `src/deferred.ts` and `src/words.ts`), and one absent named import kills the whole file: `SyntaxError: Export named 'FORMULA_RULE' not found`. Copying the two new modules into the archive does not help — the missing names are on the OLD files. **The cure generalizes and is cheap:** a control belongs at the FIXTURE, not at the test. One script, imported namespaces instead of named imports, one line per spec item, run against both sources over the same fixture set — pasted on the bar, and reproducible from this listing:

```ts
// control.ts — copied into $T/doctrine and into doctrine/, run in each, deleted after
import { readFileSync, existsSync } from 'fs';
import { basename, join } from 'path';
import * as parse from './src/parse';
import * as migrate from './src/migrate';
import { parse as building } from './src/building';
import { lint } from './src/lint';

const FX = join(import.meta.dir, 'fixtures', 'asks');
const fx = (...p: string[]) => readFileSync(join(FX, ...p), 'utf8');
const say = (n: string, v: unknown) => console.log(`  item ${n}  ${v}`);

const ds = parse.parseDecisions(fx('DECISIONS.md'));
say('1a', `magnitude typed: ${'magnitude' in (ds.decisions[0] as object)} · D1 blessed: ${ds.decisions[0]!.blessed} · D2 credit: ${ds.decisions[1]!.credit}`);
const b = building(FX);
say('1b', `statement: ${b.credits.length} on credit · magnitudes on the building: ${'magnitudes' in (b as object)}`);
say('2/4', `parseChargeHeader exported: ${'parseChargeHeader' in parse} · parseTender: ${'parseTender' in parse}`);
const rows = b.board.flatMap(x => x.rows);
say('3a', `holds typed: ${'holds' in (rows[0] as object)} · escalations: ${'escalations' in (rows[0] as object)}`);
say('3b', `board.hold reported on the malformed hold: ${b.fails.some(f => f.code === 'board.hold')}`);
say('5', `readiness on the building: ${'readiness' in (b as object)} · readiness() exported: ${'readiness' in parse}`);
say('6', `src/deferred.ts present: ${existsSync(join(import.meta.dir, 'src', 'deferred.ts'))}`);
const led = parse.parseLedger(fx('LEDGER.md'));
say('7', `entry-cap warnings on the two-entry fixture: ${led.fails.filter(f => f.code === 'ledger.entry-cap').length}`);
say('8a', `src/words.ts present: ${existsSync(join(import.meta.dir, 'src', 'words.ts'))} · files.docs: ${JSON.stringify(((b.files as Record<string, unknown>).docs as string[] ?? []).map(f => basename(f)))}`);
say('8b', `vocab.local-dead-word over the fixture building: ${lint([FX], { vocab: true }).fails.filter(f => f.code === 'vocab.local-dead-word').length}`);
const m = migrate.migrateText(join(FX, 'formulas.md'), fx('formulas.md'), { passes: ['respell'] });
say('9', `formula edits: ${m.edits.length} · FORMULA_RULE exported: ${'FORMULA_RULE' in migrate}`);
```

Two of the old suite's tests still red on the old source and are named on the bar: `boot` reads 050's own count line (item 6), and 049's known harness artifact (the `git archive` copy is not at `~/code/agents/doctrine/fixtures/boot`).

**F2 — the bar's arithmetic, corrected twice; 049-F4's shape.** The bar predicted two exceptions to *identical before and after*. Measured over the register's twelve roots, the failure classes and every entity total are **byte-identical** and only `ledger.entry-cap` moves, 526 → 503. So:

- **item 6's new warning class fires nowhere in the city.** No board's deferred list shrank between its own last two commits, so `board.deferred-drop` reports zero. The mechanism is proven by fixture instead — a temp git repo, four commits, a drop with no word (fires), the same drop named `promoted` (silent), a shelf that grows (silent). A quiet alarm is the right kind; the class is now on the board's watch, not on its ledger.
- **item 7's count falls at nine buildings, not two.** agents 95 → 88 · belvedere 79 → 78 · golos 2 → 1 · stigmergon 115 → 107 · simmy 44 → 43 · snappy 44 → 42 · whiteboardy 107 → 105 · torch-angles 1 → 0 · manny 16 → 16 with its longest entry 311 → 254. **Swordmaster is the bar's one miss, and it is honest:** its six entries are 173–927 words of PROSE — over the cap with no instrument and no baton to excuse them — so the counts hold while the words fall (the founding 434 → 288, the third act 385 → 313). The bar named the two buildings whose numbers the office had in hand; the rule reaches every ledger that fences a summons.

**F3 — the ⬢ reader's first act was to read D90's own definition as a debt, and the cure is where the mark is typed.** The first build put the sized mark through the statement's line scan beside `⬡ go`. `doctrine statement ~/code/agents` immediately answered `1 on credit · ⬢0.1 · D90`: the entry that DEFINES the magnitude writes a bare `⬢0.1` into its own body — *"the statement does not see a ⬢0.1"*, a sentence about the pre-050 parser that the post-050 parser read as a debt. D82's mask covers code spans and the law book, and the register is neither. **The fix is the spec's own word**: item 1 locates the read in *"`MARK_TAIL` and the attribution parse"*, so on the register the statement reads the parsed `magnitude` off the attribution and never a line of prose; boards and the ledger keep the line scan, because there no field is typed. The statement returned to `0 on credit` and the lint line with it. *Parse, don't validate*, at the one distance a mask cannot reach.

**F4 — a negative is a no, and the spec's floor read alone would have put a refusal on the statement.** Item 1 writes *"n ≥ 1 is a blessing, n < 1 a credit"*. Read literally that makes `⬢-1` — D90's own *negative a no* — an authorization accruing interest and waiting to be paid. The reader splits the clause at zero instead: `isSizedBlessing` at 1 and above, `isSizedCredit` strictly between 0 and 1, and a mark at or below zero blesses nothing, credits nothing and leaves the entry where it was. Named rather than assumed, because it is a reading of the spec and not the spec's words (D89: serve the spirit, file the strain). Fixture `D4`, on the bar's control line.

**F5 — the first `Branch:` regex rejected the only building in the city that writes the slot, and the city lint found it, not the suite.** `torch-angles/plans/020-perf-gesture-generating.md:3` writes `` **Branch:** `torch/020-perf-gesture-generating` from `feature/torch-angles` (the G6-merged tip) `` — §5's form exactly, with the names ticked and a rider behind them. `^(\S+)\s+from\s+(\S+)$` refused it and the before/after lint grew a `charge.branch` failure the bar does not allow. The rider is §4's staffing rider at a different slot, so it reads through `trailingParen` as that one does, and the fixture grew the shape. **The lesson for the next parser charge:** a fixture written from the law is a fixture written from one reading of the law; the twelve-root lint is the second reader, and it is cheap.

**F6 — `holds:` takes one separator, and the record proved it on the first run.** The first reader split the list on `·`, `,` and `;`, as Depends-on does. belvedere's B22 writes one hold — `holds: ⬡ budget extension (…). Five of six candidates paid: the trust flip …, UUID addressing, the audit anchor …` — and the commas inside its prose became four malformed holds. Depends-on takes the comma because the record wrote it that way for a year; `holds:` was minted 2026-09-15 with one separator and a hold's text is free prose. `·` alone, and B22 reads as the one ⬡-hold it is. The list's other bound is the annotation's next em-dash, which is what keeps a landing's findings pointer out of the hold list — fixture row 006 carries both.

**F7 — the local graveyard needs three structural drops, and without them it is noise.** Pointed at stigmergon's `WORDS.md` the arm first reported **24** hits; eight of them were `the paint`, whose row reads *the glass · the paint (as a place) · the screen* while D13's live sense is the same letters in *the file or the wire, never the paint*. Three drops, each `lexicon.ts`'s own law made structural rather than a whitelist, because the drop reasons for a foreign register are that building's Architect's to write:

| drop | why |
|---|---|
| a word the register MINTS live | STANDARD §7's local kinds — the building ruled which sense it keeps (`fold`, `a run`, `a desk`, `the composer` at stigmergon) |
| a dead word qualified in a parenthetical | the row kills a SENSE, and a sense cannot be patterned (`the paint (as a place)`, `the desk (the directory)`) |
| a code-ticked cell | an identifier, not a word (`WALL_MS`, `foldName`) — a symbol's rename is the compiler's alarm |

Measured after: **8** hits at stigmergon — *the room* ×2, *the rail* ×2 (two rows kill it, and the arm says so twice, honestly), *the wall*, *the history fold*, *encapsulation-first* — every one a re-mint or a residue on a live surface, which is exactly what the register's own §6 says an Architect sweeps by hand today. The form arms are untouched: `doctrine lint` without `--vocab` reads 0 failures at stigmergon before and after.

**F8 — the doctrine text item 2 owes, drafted for the office (not pasted — canon is red inside this charge).** The spec routes §4's and §5's text to the office *"under this charge's grant"*, and 048's pattern is the office pasting it at the landing. The reader is built to these words:

- **DOCTRINE §4, under the board, in the batch-note bullet:** the note's header carries the batch typed — `**Batch:** ‹shape› · ceiling ‹n› · gauge ‹text› · account ‹name›`, shape `serial` or `parallel`. The members are not a slot: they are the gate's Depends-on, by the edge test. The tender line stays its own field in the Mission, and `tender: the dispatch` is the engine's literal.
- **DOCTRINE §5, in the skeleton:** the header gains `**Batch:**` beside `**Parallel-safe with:**` and `**Branch:**`, marked *when the charge is a batch's review gate*.

Both are the form this reader already parses, so the paste costs nothing and closes the loop; until it lands, the canon names the slots in §4's prose and the parser reads them.

**F9 — `git blame` answers the line's LAST write, and writing the day into the entry destroys the blame it is derived from.** Item 6 says *"each entry's day derived from `git blame` (the line's first commit day)"*. Blame reports the commit that last touched the line; for an append-only shelf those are the same day, and this repo's `.git-blame-ignore-revs` keeps the form-only respells (D81) from claiming every line in the city. The agents shelf reads clean on it — eleven entries, oldest 2026-08-31, `0 past 30 days`, and the 2026-08-08 date *inside* the peer-messaging entry's text is correctly not its line's day.

stigmergon is where the two part, and the cause is worth the finding. Its 48 entries blame:

```
2026-08-31 ×3 · 09-01 ×2 · 09-02 ×2 · 09-03 ×3 · 09-07 ×4 · 09-08 ×4 · 09-14 ×7 · 09-15 ×23
```

Twenty-three read 2026-09-15 because **G23 wrote the day into each entry's text that day** — its F6 dated twelve undated entries and its F5 restored ten more verbatim — and every write is a write. The count and the verdict survive it (`deferred 48 · 0 past 30 days`, and the oldest is 2026-08-31 exactly as G23-F6 reported), because nothing there is near a thirty-day horizon; a shelf whose entries were re-dated by hand near one would report younger than it is.

The reading that follows: **§4's *derived, not chosen* is not only about his time, it is about the instrument.** The hand-written dates in stigmergon's entries are now redundant at best and blame-destroying at worst, and the pilot's hand-work is the parser's job from here. Deriving the FIRST write instead would need a `git log -S` per line — a history walk per board on every `boot` — so the instrument stays the spec's and the disagreement is filed, bounded to lines a hand has rewritten. Routed to `ISSUES.md` for the office and stigmergon's Architect.

**F10 — item 9's rule had to be fenced off its own commission.** The first run of `doctrine migrate --summary .` listed `doctrine/src/migrate.ts` (the rule's own table, which holds the old string as data) and `plans/050-field-asks.md` (this charge's item 9, which names both spellings with a `→` between them). Both would have been rewritten, and the second would have erased the record of what the rule changes. Two fences, both already the converter's law: **a ticked span is a form being NAMED** (047-F3, whose worked example is a form beside `→`) and **code is not a document** (`scopeOf`, which already gives a non-`.md` file the path forms only; `lexicon.ts`'s mirror has a louder alarm in `test/lexicon.test.ts`). After them the run is six files and eight edits, every one the pinned string in prose, in a ledger body, or in a fenced quotation of §8's list — and a second pass writes nothing.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and execute the charge at ~/code/agents/plans/050-field-asks.md.
```
