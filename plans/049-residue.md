# 049 — doctrine v1.4 — the residue

**Status:** LANDED 2026-09-09 — all six bars met, one with a named deviation (F7); eight fixtures with controls, 197/197 green, 13/13 red on the pre-049 source · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** Felix, 2026-09-09, in the room (grand-architect-25): *"lay."*

## Mission

Eight defects the sweep of G4's inbox and the office's own dry runs left on the deferred list, each fixed at the parser or the converter and proven with a fixture and its control. **The reader's residue** — the type table learns the seven words the record writes most; three reading rules (a determiner skipped, a colon closing a shape marker, the baton found inside `Next:`); the law book fenced from board discovery; `migrate`'s ledger rules reading the pair. **Two converter bugs** the word law refused to write, on buildings nobody was working in — snappy's respell, manny's unwrap. When this lands every building in the register can run D88's adoption command, and the boot pack stops printing a law page as a board.

**Birthplaces**, all on record:
- 045-F1–F4 and G4-F4 (ruling iii): the census over 271 entries — `ignite` 25 · `summon` 3 · `tell` · `paste` · `resume` · `review` · `rulings` untyped; 8 visual passes hidden behind `your` / `the`; 2 agents entries writing `batch:` / `fork:`; 28 `Baton —` lines written inside `Next:` that the line rule never reaches (26 stigmergon's).
- 044-F5 (i): `canon/work/DOCTRINE.md` §4's example table parses as a board — five canonical columns, zero rows — so every `doctrine boot` and every lint total counts the law book as a board.
- 048-F2: `migrate`'s five ledger structural rules are keyed `files: /^LEDGER\.md$/i`, so an aged-out entry is reachable by a respell and a reflow and unreachable by a grammar repair.
- The office's dry runs, 2026-09-09, read-only: `doctrine migrate --summary ~/code/universal_robots_sdk/cap-mega/snappy` → **40 round-trip violations, refused** — `README.md` 29 (rows 22–30 *vanished from the migrated document*, and more), `LEDGER.md` 11 (*no migrated entry preserves its undeclared fields*, dates 2026-08-04 ×2 · 08-05 ×5 · 08-06 ×4). `doctrine migrate --summary ~/code/universal_robots_sdk/cap-mega/.claude/worktrees/user-manual` → **15 violations, refused** — every one *the word law: fenced block N changed*, in `docs/description-sweep/review-core-system.md` (10) and `review-sensing.md` (5).

## Inputs — read before working

- DOCTRINE §11 (the baton's grammar — shape, holder, type), §4 (*any table that staffs sessions is a board* — D45; the deferred list), §3 (the aging, 048); STANDARD §6 (**bench** — the type is read off the ⬡-action's leading noun, 045; **visual pass** is two words).
- `doctrine/src/grammar.ts` — `BATON_TYPES` (the table), `isLawBook` (a path with a `canon` segment); `doctrine/src/parse.ts` — `BATON_LINE` (~575), `SHAPE_MARK` (~606), `leadWords` / `batonTypeWord` (~615–630), `classifyBaton`, the `recommendation` reader; `doctrine/src/building.ts` — board discovery (`parseBoards`, `isBoardHeader`); `doctrine/src/migrate.ts` — the five ledger rules (`files:` at ~216 · 258 · 284 · 326 · 343), the round-trip check (~744–775: `key()`, *vanished*, *undeclared fields*); `doctrine/src/respell.ts` — the tokenizer, `namedForm`, the partial guard (047-F3); `doctrine/src/unwrap.ts` — `isFence` (33), the paragraph guard (64–67), the fence copy (76–79), the list-continuation path (~111).
- The census: `bun lab/045/census.ts` (reads the ledger pair — G4's side-quest `e3c5a5c`); 045-F1's list of the 28 lines is its last section.
- The live repros, read-only — nobody writes in these trees: snappy `README.md:660–668` (the rows that vanish; ids are links, `[22](plans/22-ghost-claims.md)`), `LEDGER.md:90` and `:116` (two of the eleven heads); manny `docs/description-sweep/review-core-system.md:36–47` (a ```` ```markdown ```` fence opened on the line after a list item, `- Proposed:`, its content list items and blank lines).
- The proven method: 046's fixture-and-control discipline — every new law test red on the pre-049 source, nothing else red there.

## Spec

1. **Seven words.** `BATON_TYPES` gains `ignite` · `summon` · `tell` · `paste` · `resume` · `review` · `rulings`, all **mental** — each a decision to spend or to read, made at a desk with nothing to look at (G4-F4's reading, confirmed on the examples). No other word: the table is the standard's mirror, extended from the record. Fixture: one baton per word types mental; the control is today's table returning untyped.
2. **The determiner skip.** `batonTypeWord` skips a leading article (`a` · `an` · `the`) or possessive (`your` · `his`) before reading the noun, so *"your visual pass"* and *"the visual pass"* type **visual**. The skip is one word, once; `leadWords`' digit rule (045-F6) still runs after it. Fixture: the two visual shapes type; *"the docket batch's review gate"* stays untyped — no false positive.
3. **The colon closes a shape marker.** `SHAPE_MARK` accepts `:` beside the dashes (`batch: ignite 038 · 039`, `fork: (a) …`). A fork so marked resolves its inline `recommendation:` as a dash-marked one does. Fixture: the two agents entries' shapes (045-F2) type `batch` and `fork`, the fork's recommendation resolves; the control: the dash forms still type.
4. **The anchor reaches a baton inside `Next:`.** `BATON_LINE` matches a `Baton` opening either at a line start or directly after `Next:` (bold tolerated, as today). The holder read on those entries then follows the **written** holder — that is D74 served, not changed: the record wrote `⬡` or `the dispatch` and the reader ignored it. Fixture: an entry writing `Next: Baton — ⬡ → single — …` reads holder, shape, type; the control: a prose mention of "the baton" mid-body, not after `Next:` and not at a line start, stays unread. **The 28 lines are tabled in the findings** — before-holder (inferred) and after-holder (written) for every one; an after-holder that is not the line's written holder is a stop (the escalation list).
5. **The law book is fenced from board discovery.** A table in a file `isLawBook` names is shown, never parsed as a board — a canon page shows forms and staffs nobody (D45's test is *staffs sessions*). Rejected at the lay: fencing zero-row tables instead — a board's emptiness is a fact about a building, not a class of document. Fixture: a canon page carrying the five-column example yields no board; `doctrine boot ~/code/agents` loses its `## Board — canon/work/DOCTRINE.md` line; the lint's `board docs` total reads 4/4 and **every other total is identical** (the fenced board had zero rows). `canon/BUILDINGS.md` is unaffected — it never was a board.
6. **The ledger rules read the pair.** The five structural ledger rules match `ledger-archive.md` as well as `LEDGER.md`; the round-trip check keys entries across the pair as `parseLedgerPair` does (048). Fixture: a pair whose archive carries a repairable head — the rule fires there, the round trip holds; the control: a `log-archive.md` beside it stays untouched (it is the Log's, not the ledger's — different physics).
7. **snappy's respell.** Diagnose before fixing, with a fixture cut from the live rows. Two hypotheses, pre-chewed, the fixture decides: (a) the partial guard (047-F3) reverts a row's line whole — a ticked form beside `→`, or a span the rules still reach — while the round-trip check keys the row by its **respelled** id, so a legally reverted row reads as *vanished*: a false positive of the guard meeting the check; (b) the respell truly drops the row. And for the eleven heads: the rule rewrites an id inside a field it does not declare in `changes` (the entry body's `changed` text), or the check keys the entry wrongly. Either way the fix is in the converter or its check — **never in snappy's documents, and the word law and the round-trip law are never relaxed.** Bar: `doctrine migrate --summary <snappy>` reads 0 violations, dry run, nothing written.
8. **manny's unwrap.** The paragraph path guards fence openers (`unwrap.ts` 64–67) and copies a fence verbatim (76–79); the list-continuation path (~111) is the suspect — a fence opened on the line after a list item (`- Proposed:` then ```` ```markdown ````) is swallowed as the item's continuation, and the fence's content is then reflowed as prose. Fixture: manny's lines 36–47 verbatim as a before/after pair — after equals before inside the fence, byte for byte, and the word law passes; the control: today's code fails the pair. Bar: `doctrine migrate --summary <manny>` reads 0 violations, dry run, nothing written.

Every failure keeps the reader's law: parser-as-lint, a verbatim excerpt, per-repo special cases zero. Every fixture ships with its control run on the pre-049 source (`git archive <lay-sha> doctrine canon` under this charge's tests), 046's method.

## Lanes

**Red: none inside** — nothing in `canon/`, no charter, no live wire, and no byte written outside `~/code/agents`: snappy and manny are read for their shapes and dry-run for the bar; their Architects adopt D80 and D88 at their own desks. **Yellow, the Builder's calls inside the spec:** the regex forms, the fixture shapes, the README's wording. **Green's bar:** `bun test` green from `doctrine/` and `doctrine lint ~/code/agents` naming only belvedere's twenty.

## Done when:

- [x] `bun test` green from `doctrine/` with one fixture and one control per spec item (eight pairs); the control run on the pre-049 source reds exactly the new law tests and nothing else — both outputs pasted.

      ```
      $ cd doctrine && bun test          # 575a220, the last source commit; re-run at HEAD bff781b: identical
       197 pass · 0 fail · 826 expect() calls — 197 tests across 6 files

      $ T=$(mktemp -d); git archive abdc3ad doctrine canon | tar -x -C $T \
          && cp -R doctrine/test doctrine/fixtures $T/doctrine/ && cd $T/doctrine && bun test
       184 pass · 13 fail
      (fail) the unwrap — one pair per construct > html-comment-fence — flows to its pair…       [item 8]
      (fail) the unwrap — one pair per construct > a document already flowed is already home…    [item 8, it walks PAIRS]
      (fail) the unwrap — the fence is structural > an HTML block runs to its blank line — or…   [item 8]
      (fail) control … > baton — the shape is the marked word, and an unmarked baton stays…      [045's, moved by item 1]
      (fail) control … > baton — a ⬡-action types what it asks of him; anything else stays…      [045's, moved by items 1+2]
      (fail) the residue … > item 1 — the seven words the record writes most all type mental…
      (fail) the residue … > item 2 — a determiner is skipped once, and only the noun behind…
      (fail) the residue … > item 3 — the colon closes a shape marker, and the fork it marks…
      (fail) the residue … > item 4 — a baton opening after `Next:` is read, and its written…
      (fail) the residue … > item 5 — a table in the law book is shown, never parsed as a board…
      (fail) the residue … > item 6 — the structural ledger rules read the pair; the Log's…
      (fail) the residue … > item 7 — a board that LINKS its id respells the id, and a fenced…
      (fail) boot … > the title carries the register Name, the root, HEAD and the day           [the harness, 046-F]
      ```

      Eleven of the thirteen are 049's own law (items 1–8, two of them 045's expectations that 049's table
      moves — F1's note). The thirteenth is the harness and not the code: a `git archive` copy is not at
      `~/code/agents/doctrine/fixtures/boot`, and the title test wants that path. Proved rather than
      asserted — the SAME copy of HEAD fails it and nothing else: `git archive HEAD doctrine canon` into a
      temp dir, `bun test` → `196 pass · 1 fail`, that one.

- [x] The census before and after (`bun lab/045/census.ts`): the untyped ⬡ tail loses the seven words' 33 and the determiner's 8; the anchor's 28 lines are read; **the table of the 28** — entry · before-holder · after-holder — pasted, every after-holder the line's written one.

      ```
                                       before (abdc3ad)      after (575a220)
      baton lines read                 87                    113        +26
      shape marked                     37                    48         +11
      ⬡ batons                         124                   135        +11
      ⬡ batons typed                   mental 9 · visual 1    mental 54 · visual 11
      shape, by kind                   single 18 · batch 16 · fork 3    batch 21 · single 20 · fork 7
      fork recommendations             text 3                text 6 · instrument 1

      untyped ⬡ tail, before: (no baton line) 59 · ignite 28 · your 6 · the 5 · summon 3 · a 2 ·
        once 2 · batch 1 · both 1 · fork 1 · is 1 · paste 1 · resume 1 · review 1 · rulings 1 · tell 1
      untyped ⬡ tail, after:  (no baton line) 53 · (no arrow) 2 · lay 2 · once 2 · polish 2 ·
        tenders 2 · both 1 · canons 1 · docket 1 · is 1 · land 1 · phase 1 · tend 1
      ```

      All seven words are gone from the tail (36 in today's corpus, not 33 — `ignite` has grown from
      25 to 28 since 045 counted). The determiner's eleven (`your` 6 · `the` 5) are gone too: eight typed
      **visual**, and the three that carry no verb reappear one word later as `docket` 1 and `polish` 2 —
      045-F3's own reading, confirmed. `a` 2, `batch` 1 and `fork` 1 left with items 2 and 3.

| # | entry | before-holder | after-holder | the written slot | shape · type | the line, from its baton |
|---|---|---|---|---|---|---|
| 1 | agents 2026-08-29 L398 | prose | felix | "⬡" | fork · mental | Next: Baton — ⬡ → fork — rule fork 4 before the arm: fold the 44 vocabulary hi |
| 2 | agents 2026-08-29 L407 | session | felix | "⬡" | batch · mental | Next: Baton — ⬡ → batch — (a) ignite 033 (kickoff in plans/033-canon-landing |
| 3 | stigmergon 2026-08-31 L88 | session | felix | "⬡" | batch · mental | Next: **Baton — ⬡ → batch —** ignite 004 (kickoff in |
| 4 | stigmergon 2026-08-31 L321 | session | felix | "⬡" | — · mental | Next: **Baton — ⬡ → ignite 003** (the city sitting, his room; |
| 5 | stigmergon 2026-08-31 L367 | session | session | — | — · — | **Baton — ⬡ → ignite |
| 6 | stigmergon 2026-08-31 L395 | session | felix | "⬡" | — · mental | Next: **Baton — ⬡ → ignite 003** (the |
| 7 | stigmergon 2026-08-31 L415 | session | felix | "⬡" | — · mental | Next: **Baton — ⬡ → ignite 010** |
| 8 | stigmergon 2026-08-31 L435 | prose | felix | "⬡" | — · — | Next: **Baton — ⬡ → the tender's |
| 9 | stigmergon 2026-08-31 L465 | prose | felix | "⬡" | — · — | Next: **Baton — ⬡ |
| 10 | stigmergon 2026-08-31 L536 | felix | felix | "⬡ Felix, three steps in order" | — · — | Next: **Baton — ⬡ Felix**, three steps in order: his |
| 11 | stigmergon 2026-09-01 L615 | felix | felix | "⬡ Felix" | — · — | **Baton — ⬡ Felix**: the break (recommended — everything the |
| 12 | stigmergon 2026-09-01 L677 | felix | felix | "⬡ Felix" | — · visual | Next: **Baton — ⬡ Felix → the |
| 13 | stigmergon 2026-09-01 L784 | felix | felix | "⬡ Felix" | single · — | Next: **Baton — ⬡ Felix → single**: land |
| 14 | stigmergon 2026-09-01 L819 | felix | felix | "⬡ Felix" | fork · — | Next: **Baton — ⬡ Felix → fork** — canon's index: |
| 15 | stigmergon 2026-09-01 L885 | felix | felix | "⬡ Felix" | fork · — | Next: **Baton — ⬡ Felix → fork** — |
| 16 | stigmergon 2026-09-02 L1198 | prose | prose | — | — · — | Baton — ‹holder› →` |
| 17 | stigmergon 2026-09-03 L1484 | session | session (tender) | "tender" | — · — | **Baton — tender → ignite 040.** The serial batch runs on: 040 → 043 → |
| 18 | stigmergon 2026-09-03 L1532 | session | session (tender) | "tender" | — · — | **Baton — tender → ignite 043.** Riding for **G8**: verify F2's route (the |
| 19 | stigmergon 2026-09-03 L1582 | prose | session (tender) | "tender" | — · — | **Baton — tender → G8.** Riding for **G8**: ratify F1's law in city.md §6 |
| 20 | stigmergon 2026-09-03 L1692 | prose | felix | "⬡" | — · mental | Next: **Baton — ⬡ → ignite the tender for batch A** — |
| 21 | stigmergon 2026-09-05 L1944 | prose | felix | "⬡" | — · mental | **Baton — ⬡ → ignite the snag batch** — a fresh session: |
| 22 | stigmergon 2026-09-07 L2511 | prose | session (063, the chat batch's fourth) | "063, the chat batch's fourth" | — · — | **Next: Baton — 063, the chat |
| 23 | stigmergon 2026-09-07 L2620 | prose | session (064, the chat batch's fifth) | "064, the chat batch's fifth" | — · — | **Next: Baton — 064, the chat batch's |
| 24 | stigmergon 2026-09-07 L2671 | prose | session (066, the chat batch's sixth) | "066, the chat batch's sixth" | — · — | *Next: Baton — 066, the chat batch's sixth —** the follow reaches the subagent |
| 25 | stigmergon 2026-09-07 L2721 | session | session (G14, the chat batch's review gate) | "G14, the chat batch's review gate" | — · — | **Next: Baton — G14, the chat batch's review gate** — `ignite G14` (Architect  |
| 26 | stigmergon 2026-09-07 L3214 | prose | felix | "⬡" | single · visual | Next: **Baton — ⬡ → single —** G17, your pass of the panes |
| 27 | stigmergon 2026-09-08 L3468 | session | dispatch | "the dispatch" | batch · — | **Baton — the dispatch → batch —** tender-09 continues on `plans/G20-tail.md`: |
| 28 | stigmergon 2026-09-08 L3505 | session | dispatch | "the dispatch" | batch · — | **Baton — the dispatch → batch —** tender-09 on `plans/G20-tail.md`: 077 and 0 |
| 29 | simmy 2026-09-08 L1148 | session | session | — | — · — | Baton — ⬡ → summon the tender: |
| 30 | simmy 2026-09-08 L1183 | session | session | — | — · — | Baton — ⬡ → ignite the tender session (`simmy/plans/TENDER.md` + |

      **Every after-holder is the line's written holder — no stop.** ⬡ → `felix` (17 lines), `the
      dispatch` → `dispatch` (2), `tender` → a named session (3), and the chat-batch dialect's own
      `066` / `G14` / `063` / `064` → a named session whose name is the slot, exactly (4). Rows 5, 16,
      29 and 30 stay unread and are right to: 16 is a code-span MENTION (item 4's control), and 5, 29
      and 30 open mid-sentence — neither at a line start nor directly after `Next:`, which is the rule
      the spec wrote. 26 of the 30 are read where 045 counted 28 on a pre-prune corpus; F1 has the census.

- [x] `doctrine boot ~/code/agents`: no `## Board — canon/work/DOCTRINE.md` line; `doctrine lint ~/code/agents`: 20 failures (belvedere's), warnings unchanged, `board docs` 5 → 4 the only total that moves — pasted, with the pre-049 totals beside them.

      ```
      $ doctrine boot ~/code/agents | grep '^## Board'
      pre-049:  ## Board — BOARD.md: 54 charges · 1 live · 48 landed · 5 killed · deferred 10
                ## Board — canon/work/DOCTRINE.md: 0 charges · 0 live · 0 landed · 0 killed · deferred —
                ## Board — plans/018-great-recut.md: 8 charges · 0 live · 8 landed · 0 killed · deferred —
      post-049: ## Board — BOARD.md: 54 charges · 1 live · 48 landed · 5 killed · deferred 10
                ## Board — plans/018-great-recut.md: 8 charges · 0 live · 8 landed · 0 killed · deferred —

      $ doctrine lint ~/code/agents | tail -6
      pre-049   3 buildings · 5/5 board docs yielded a board · 5 boards · 125 rows · 125 fully typed (100%)
      post-049  3 buildings · 4/4 board docs yielded a board · 4 boards · 125 rows · 125 fully typed (100%)
      both      2/2 ledgers parsed a tail (205 entries) · 1 fireable baton(s) · 117 kickoffs in 122 work docs · 26 decisions (queue 0) · 0 inbox entries
      both      0 on credit · max interest 0
      both      0 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
      both      20 failure(s) in 2 class(es) · 172 warning(s) in 1 class(es)
      ```

      **Met, with one correction to the spec's arithmetic** (F4): TWO totals move, not one — `board docs`
      5/5 → 4/4 and `boards` 5 → 4. They are one fact printed twice: the fenced document held exactly one
      table, and that table held zero rows, so `rows`, `typedRows` and every other total are identical.
      A `--guard` run across this change reports both decreasing, deliberately, as 046's kickoff demotion did.

- [x] `doctrine lint ~/code/stigmergon` before and after: 0 → 0 failures, the tail's baton line identical; any class that newly fires on a live building is named here and left red — an arm is never weakened from this charge (G4's ruling ii).

      ```
      pre-049 and post-049, byte-identical:
        1 buildings · 1/1 board docs yielded a board · 1 boards · 108 rows · 108 fully typed (100%)
        1/1 ledgers parsed a tail (107 entries) · 0 fireable baton(s) · 95 kickoffs in 103 work docs · 49 decisions (queue 0) · 2 inbox entries
        0 failure(s) in 0 class(es) · 103 warning(s) in 2 class(es)   [102 ledger.entry-cap · 1 decisions.size]

      $ doctrine boot ~/code/stigmergon | grep '^Baton'
      pre-049:  Baton — ⬡ · single · visual → no instrument
      post-049: Baton — ⬡ · single · visual → no instrument
      ```

      No class newly fires. The 26 lines item 4 opened are history, and `ledger.baton` reads tails alone —
      stigmergon's tail was already read, and reads the same.

- [x] `doctrine migrate --summary` at snappy and at manny: 0 round-trip violations, dry run only, nothing written in either tree (`git -C <root> status --short` pasted, unchanged); the control: `doctrine migrate --summary ~/code/agents` still reads *already in the current grammar*.

      ```
      $ doctrine migrate --summary ~/code/universal_robots_sdk/cap-mega/snappy
      2318 edit(s) across 170 file(s) · 0 round-trip violation(s)          [was: 40, refused]
      11 HAND edit(s) — a line the converter consumes only partly, reverted whole.   [047-F3's category, pre-existing]
      Dry run: 2318 edit(s) across 170 file(s) — 0 files written.
      $ git -C ~/code/universal_robots_sdk/cap-mega/snappy status --short
      (no output — clean)

      $ doctrine migrate --summary ~/code/universal_robots_sdk/cap-mega/.claude/worktrees/user-manual
      8293 edit(s) across 256 file(s) · 0 round-trip violation(s)          [was: 15, refused]
      Dry run: 8293 edit(s) across 256 file(s) — 0 files written.
      $ git -C …/worktrees/user-manual status --short
       M manny/book/typst/manual.typ
      ?? manny/ISSUES.md
      ```

      Both bars **met**: 0 violations, dry run, nothing written. manny's two dirty paths are Felix's own and
      predate this session — `manual.typ` mtime Aug 10, `ISSUES.md` Aug 31 (046-F4 routed that inbox entry
      and left it uncommitted, by that charge's own note); the two documents 049 reads, `review-core-system.md`
      and `review-sensing.md`, are untouched at mtime Aug 6.

      **The control moved, and it is the fix that moved it** (F7). `~/code/agents` reads
      `8 edit(s) across 2 file(s) · 0 round-trip violation(s)`, not *already in the current grammar* —
      because the same converter bug item 8 fixes was hiding eight legal unwrap edits in this building's own
      `plans/013-…` and `plans/014-…`. Nothing was written: adopting D88 here is not this charge's, and the
      lint and boot bars above are measured against these bytes.

- [x] `doctrine/README.md`: the type table's words and the law-book fence in its voice, ≤ 10 lines.

      Three lines added (the prose flows, so each is one): the seven words and the three reading rules under
      the standard's tokens; the law-book fence in the register's list; and one line under 048's section
      saying the CONVERTER reads the pair too, because the section's own *"The parser reads both"* was left
      making half a claim by item 6.

## Out of scope

- Writing a byte at snappy or manny — their adoptions are their Architects' (D88's protocol, D80's `--table`).
- Adding a type word the record does not show, or a fourth type; changing `BatonHolder` semantics beyond reading the written holder.
- The rest of the doctrine-residue bullet on the deferred list — the currency alarm, the qualified id in the ledger head's slot, 040's second-adoption fences, the dead-citation alarm (a discovery class, its own charge).
- Any canon text — STANDARD §6 already says the type is read off the leading noun; no word of law changes here.

## Escalation points — stop, do not guess

- Item 4 changes an after-holder to anything but the line's written holder, or a written `⬡` reads as something else: D74's semantics — the Architect's desk.
- Item 7 or 8 turns out to be a document defect and not a converter bug (a fence truly unclosed, a row truly malformed): file it to that building's inbox as a finding, name the residual count on the bar, and never zero it by weakening a law.
- A spec item cannot meet its bar as written: BLOCKED with the finding, as 047 did — the Architect's desk, never the Builder's invention.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved it; probes ship with a control)*

**F1 — the 28 are 30, and 26 of them read; the four that stay unread are right to.** The census over the same four ledgers now reports **30** `Baton —` lines the pre-049 anchor cannot reach, not 045's 28: the agents ledger was pruned since (048), so its archive is counted, and one entry became two. The table is on the bar. 26 become readable; the four that do not are 16 (a code span quoting the grammar — item 4's own control), and 5, 29 and 30, which open mid-sentence rather than at a line start or directly after `Next:` — the rule the spec wrote, applied. **No after-holder is anything but the line's written holder, and no written `⬡` reads as anything else**, so the escalation did not fire.

**F2 — the holder slot ends at ITS separator, and the record writes four.** Reading the 26 exposed a second defect the spec's item 4 could not have named: stigmergon's chat-batch dialect closes the holder with an em-dash — `**Next: Baton — 066, the chat batch's sixth —** the follow reaches the subagents (Builder · …)` — and the parser's alternation (`→ -> : (`) ran straight past it, to the `(` of the staffing rider, naming the session *"066, the chat batch's sixth — the follow reaches the subagents"*. `[—–]` joined the alternation. Measured against the whole city, and this is the control: of the **88** batons the pre-049 line rule already read, **2 moved and both improved** — `"061, the chat batch's second — the turn's re-cut and the wire"` → `"061, the chat batch's second"`, and its twin at L2440. No holder KIND changed anywhere, and no action changed.

**F3 — the arrow that opens an action is the baton's own, never the next one the prose writes.** `batonSlots` folded the baton's paragraph and took the first `→` in it. Where the holder closes on an em-dash there is no arrow at all, and the paragraph's prose supplies one: `plans/061-turn-recut.md`'s entry writes *"It writes in `rem` from the start: 13 px → `1rem`"* four lines under its baton, and the fold handed `1rem, hairlines stay 1px, …` back as the ACTION. Nothing downstream typed off it (shape and type are null there either way), which is why it was invisible; it is a lie in the reader's own output all the same. The paragraph is now read whole, the baton is found IN it, and the action is what follows the match — so a separator that is not an arrow yields no action, as §11's own note already said of `:` and `(`.

**F4 — the law book's fence moves TWO totals, not one.** The bar predicted `board docs` 5 → 4 alone. `boards` moves too, 5 → 4: they are one fact printed twice, because the fenced document held exactly one table. Every other total is byte-identical — `rows` 125, `typedRows` 125, `workDocs` 122, `kickoffs` 117, `ledgerEntries` 205, 20 failures, 172 warnings — because that table held zero rows. A `--guard` run across this change reports both decreasing, deliberately, and the override is running without the flag, as 046's kickoff demotion did. The fence is on the PATH and not on the table: `staffsSessions(<the canon page>)` still answers `true`, which is the fixture's control — a book that may not name a form cannot define one.

**F5 — snappy: TWO defects, and neither is the hypothesis the spec pre-chewed.** Item 7 offered (a) the partial guard meeting the check and (b) a row truly dropped. It is neither, and the 40 violations were two independent bugs:

- **The 29 rows.** snappy LINKS its ids — `| [01](plans/01-perf-rig.md) |` — and `respellIdCell` compared the whole cell against the table's key, so it declined every row. The line rule then respelled the LINK TARGET, and the board landed at `[01](plans/001-perf-rig.md)`: half an address, the ID column still reading `01`, while the round-trip check looked the row up under `001` and reported it *vanished*. Every row of that board, not the 22–30 the office's dry run happened to name. The cell now reads its id through `delink` and rewrites it in place, keeping the link's shape; a cell whose id the table does not name is still declined (`[G2](plans/g2-merge.md)` → null, the fixture's control).
- **The 11 entries.** `respellNormal` — the round-trip law's normal form — was handed `JSON.stringify(field)`. A `next` clause carries a whole fenced summons, the parser FLATTENS the clause's lines, and in JSON its breaks are two characters, so the ``` that opened a fence read as an inline code span, `namedForm` called it a form, and everything inside it was skipped. The converter, which sees the lines, respells inside a fence by law (D80: a kickoff naming a renamed charge doc is a dead address). One `row 11` inside a dispatcher summons was the whole of it, eleven times. Two moves: the normal form is applied to the FIELD, not to its encoding; and a run of three or more delimiters is a fence marker there, never a span — a run of two still is, so 047-F3's named-form clause is untouched.

**Neither law was relaxed to get here.** The round-trip law and the word law are unchanged; both fixes are in the converter and in the check's own normal form, which is what the spec's *"never in snappy's documents"* asks for. `2318 edit(s) across 170 file(s) · 0 round-trip violation(s)`, dry run, snappy's tree clean.

**F6 — manny: the list-continuation path is innocent; the HTML-block run is the culprit.** Item 8 named `unwrap.ts:~111` as the suspect. It holds: `boundary()` guards a fence opener, so `- Proposed:` followed by a ```` ```markdown ```` does NOT swallow it, and the first fenced block of `review-core-system.md` survives untouched — which is why the office's dry run reported blocks 2, 3, 9, 10, 12, 13, 15, 18, 19, 20 and not block 1. The real path is the one above it (`unwrap.ts:104`): an HTML block or an indented block runs *to its blank line*, and nothing else stops it. At `review-core-system.md:56` a one-line `<!-- F-17 … -->` comment is followed by `- Surfaces`, `- Current`, `- Proposed:`, the fence opener, and only then a blank line — so the run ate the opener, every fence below it re-paired opener-to-closer, and what was code was reflowed as prose. The fix is the general one: **a fence marker is the one line no run may swallow.** `8293 edit(s) across 256 file(s) · 0 round-trip violation(s)`, dry run, the two documents untouched at mtime Aug 6.

**F7 — the same bug was hiding eight legal reflows in this building, and the control's reading moved with it.** `doctrine migrate --summary ~/code/agents` read *already in the current grammar* before 049 and reads `8 edit(s) across 2 file(s) · 0 round-trip violation(s)` after. It is not a regression: `plans/013-summon-rig-name-stamp.md` and `plans/014-summon-rig-theater-cycle.md` indent their fences inside `- [x]` items, an indented continuation at `013:48` ran past the fence opener at `:54`, and lines 61–83 were being kept verbatim as *"inside a fence"* when they are prose. With the pairing right they reflow, and both laws hold. **Not written** — adopting D88 in this building is not this charge's, the two documents are LANDED work, and the lint and boot bars above are measured against these bytes. One command closes it at the Architect's desk: `doctrine migrate --write ~/code/agents`, then the blame-ignore line.

**F8 — the census's shape, before and after.** Baton lines read 87 → 113; shape marked 37 → 48; ⬡ batons 124 → 135; ⬡ batons typed 10 → 65 (`mental` 9 → 54, `visual` 1 → 11). The fork count trebles, 3 → 7, and the `instrument` kind of `recommendation` — which 045-F5 recorded as exercised by the fixture and by no entry in the city — is now exercised by **one** live entry, exactly as F5 predicted the anchor would reveal. The untyped tail is on the bar; what is left in it is honest residue: `once` (a conditional hiding its verb), `is`, and eight nouns the table does not name.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/049-residue.md to its bar.
```
