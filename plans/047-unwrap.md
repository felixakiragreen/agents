# 047 — the unwrap

**Status:** LANDED 2026-09-09 — the rule, the run and F3's fix; every line of the bar met and evidenced; findings F1–F8. *(was: OPEN — re-ignitable 2026-09-09 on the desk's rulings; was: BLOCKED 2026-09-08 — two rulings owed, neither a Builder's.)* · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** Felix, 2026-09-08, in the room (D88 ⬡✓): the rule, the run over agents, the global file's line already live.

## Mission

D88 is law: prose flows, one paragraph one line, the reader's width decides. The corpus follows by the converter (D81): `doctrine migrate` gains the **unwrap** rule — a paragraph's hard-wrapped lines join into one — and runs it over this building whole, history and voice included. Every later `migrate` run in any building carries the rule, so a building adopts D88 with one command at its next Architect session. This doc is written under the law it lays; the docs laid before it today are not, and this charge unwraps them.

**Birthplace:** his word in the inbox, 2026-09-08 — *"is it possible to tell agents not to split everything up onto new lines? Let page width & auto wrapping handle that for me automatically? It makes resizing much easier and nicer."* Priced at the desk: one Builder session, then one command per building. Ancestors: D81 (a form change lands with its converter rule and the corpus respelled), 040 (the id respell — run the converter twice and diff, 040-F7; a fixed point is the bar), formula 26 (history is respelled, never rewritten — a respell is not an edit).

## Inputs — read before working

- `canon/CLAUDE.md` §5 item 7 (the law, live); `DECISIONS.md` D88 (the fence: fixtures and lab excluded; hard breaks kept); DOCTRINE §1 (the corpus is current), §3 (`lab/`, `fixtures/`, `templates/` — the register law's non-corpus; templates ARE unwrapped here, they are copied), §8 (the molt clause — form migrates freely, meaning byte-preserved).
- `doctrine/src/migrate.ts` — `RULES`, the two-class run (structure and field rules, then the clause pass), `roundTrip`, `diff`, `write`; `doctrine/src/respell.ts` (the document fence — which files a rule may touch); `doctrine/cli.ts` (`migrate`'s flags); `plans/040-id-respell.md` F2 · F6 · F7 · F8 (the four rulings every respell inherits).
- The city's markdown as the census: this building's `plans/`, `canon/`, `LOG.md`, `LEDGER.md`, `belvedere/` — every construct the rule must leave alone appears somewhere here (fenced kickoffs, tables, blockquoted codas, nested lists, `---` separators, the Shelf's bullets, `~~struck~~` runs, reference links).

## Spec

**The rule.** Inside a paragraph — consecutive non-blank lines that are not inside a fence, not table rows, not headings, not `---`, not HTML — lines join with one space. A list item's continuation lines join to the item's line, their indentation dropped; a nested item starts its own line. A blockquote's continuation lines join with the inner `> ` dropped, the quote's first marker kept. A hard break — two trailing spaces, or a trailing backslash — stays a line break. Fenced code, tables, headings, thematic breaks, HTML blocks and comments, reference-link definitions and front matter are untouched byte for byte. CommonMark renders a soft line break as a space, so the render is identical: the rule is form only.

**Two invariants, asserted in the suite:** (1) the round-trip law — `parse(migrate(x)) ≡ parse(x)` for every parsed field, as every rule already obeys; (2) **the word law** — outside fences, the migrated text with all whitespace runs collapsed to one space equals the original under the same collapse: only whitespace moved, no word did. Fences are compared byte for byte. And **the fixed point** (040-F7): the second run writes nothing, on every file, proven by running twice and diffing.

**The fence.** Every tracked `.md` of the building, `belvedere/` included (a retired building's books are still this building's bytes, and the run is free); `doctrine/fixtures/**` excluded — they are the suite's contracts, and their bytes are the tests' — and `lab/**` excluded — disposable (§3). `.ts`, `.json`, `.tsv`, `.zsh` and every other kind untouched. The same fence binds every building's future run.

**`--summary`.** `migrate` gains a flag that prints, per file, the count of edits by rule and the round-trip verdict, and no diff — the pre-chewed answer to the trap the office named at the lay: an unwrap diff is the whole corpus, and a Builder that reads it spends the batch's tokens on whitespace. The dry run is still the default; `--write` is still required to touch a byte.

**Blame.** The respell commit's sha goes into `.git-blame-ignore-revs` at the repo root, and `git config --local blame.ignoreRevsFile .git-blame-ignore-revs` is set here (a repo-local config write; nothing outside the repo). The README's `migrate` section names both.

**The run.** `doctrine migrate --summary ~/code/agents` (the table read, the verdicts all `ok`), then `--write`, then the second run (nothing written), then `bun test` and `doctrine lint ~/code/agents` on the unwrapped tree. Commit the run as one commit — the respell is one act (D81).


## Done when:

- [x] `bun test` green from `doctrine/` with the unwrap fixtures: one before/after pair per construct above (paragraph · list continuation · nested list · blockquote · hard break · fence · table · heading · `---` · reference link), the word law and the round-trip law asserted over each, idempotence asserted over the whole set. Output pasted. **Met at `7b26c1c`, before the corpus run** — 149 → 172 tests, ten pairs in `doctrine/fixtures/unwrap/`, the two laws and the fixed point asserted over every one, plus the constructs the spec names but the Done-when's ten do not (front matter · HTML · indented block · §11's baton) as inline tests, plus the word law proved by breaking it three ways.

```
bun test v1.3.10 (30e609e0)

 172 pass
 0 fail
 748 expect() calls
Ran 172 tests across 5 files. [263.00ms]
```

- [x] `doctrine migrate --summary ~/code/agents` pasted before the write; the second run after the write pasted, writing nothing. **Met.** The dry table read 5792 edits across 180 files, every rule `unwrap`, every verdict `ok`, 0 round-trip violations. The second run wrote no unwrap edit — the reflow is a fixed point on the first pass — and reported one `id.respell` edit that must not be written (F3, the escalation). With F3's ruling built (`c615401`, `05b24e5`) the run is a fixed point whole: see the bar's last line.

```
agents — the id respell table (D80), derived from the board:
  (every id already conforms — nothing to respell)

  edits  rule(s)                                     round-trip  file
     20  unwrap×20                                   ok          belvedere/camera/README.md
      3  unwrap×3                                    ok          belvedere/census/README.md
     15  unwrap×15                                   ok          belvedere/dream.md
     44  unwrap×44                                   ok          belvedere/glass/README.md
      1  unwrap×1                                    ok          belvedere/ISSUES.md
    152  unwrap×152                                  ok          belvedere/LEDGER.md
     22  unwrap×22                                   ok          belvedere/plans/b1-census-deploy.md
     34  unwrap×34                                   ok          belvedere/plans/b10-flow-dag.md
     37  unwrap×37                                   ok          belvedere/plans/b11-flow-engine.md
     39  unwrap×39                                   ok          belvedere/plans/b12-flow-reactive.md
     31  unwrap×31                                   ok          belvedere/plans/b13-deck-shell.md
     41  unwrap×41                                   ok          belvedere/plans/b14-city-attention.md
     25  unwrap×25                                   ok          belvedere/plans/b15-workshop.md
     31  unwrap×31                                   ok          belvedere/plans/b16-chat.md
     35  unwrap×35                                   ok          belvedere/plans/b17-composer-usage.md
     27  unwrap×27                                   ok          belvedere/plans/b18-live-identity.md
     32  unwrap×32                                   ok          belvedere/plans/b19-desk.md
     41  unwrap×41                                   ok          belvedere/plans/b2-glass-spine.md
     32  unwrap×32                                   ok          belvedere/plans/b20-decoder.md
     26  unwrap×26                                   ok          belvedere/plans/b21-grep.md
     44  unwrap×44                                   ok          belvedere/plans/b22-hands-hygiene.md
     73  unwrap×73                                   ok          belvedere/plans/b23-repaint-law.md
     44  unwrap×44                                   ok          belvedere/plans/b24-arrangement.md
     16  unwrap×16                                   ok          belvedere/plans/b25-fire-placement.md
     62  unwrap×62                                   ok          belvedere/plans/b26-baton-attention.md
     30  unwrap×30                                   ok          belvedere/plans/b27-qol-close.md
     32  unwrap×32                                   ok          belvedere/plans/b3-baton-rail.md
     34  unwrap×34                                   ok          belvedere/plans/b4-hands.md
     24  unwrap×24                                   ok          belvedere/plans/b5-shelf-gauges.md
     25  unwrap×25                                   ok          belvedere/plans/b6-sovereign-inbox.md
     29  unwrap×29                                   ok          belvedere/plans/b7-summon-composer.md
     25  unwrap×25                                   ok          belvedere/plans/b8-glass-hardenings.md
     15  unwrap×15                                   ok          belvedere/plans/b9-visual-law.md
    270  unwrap×270                                  ok          belvedere/plans/BULLETIN.md
      9  unwrap×9                                    ok          belvedere/plans/c1-fence-repoint.md
     40  unwrap×40                                   ok          belvedere/plans/c12-transcript-mirror.md
     42  unwrap×42                                   ok          belvedere/plans/c14-engine-seams.md
     52  unwrap×52                                   ok          belvedere/plans/c15-deck-v3-lane.md
     57  unwrap×57                                   ok          belvedere/plans/c16-chat-chapter.md
     36  unwrap×36                                   ok          belvedere/plans/c17-camera.md
     38  unwrap×38                                   ok          belvedere/plans/c18-gates.md
     44  unwrap×44                                   ok          belvedere/plans/c19-fixture-city.md
     43  unwrap×43                                   ok          belvedere/plans/c2-vocabulary-molt.md
     36  unwrap×36                                   ok          belvedere/plans/c20-tick.md
     29  unwrap×29                                   ok          belvedere/plans/c21-gut-v1.md
     28  unwrap×28                                   ok          belvedere/plans/c22-respell-sweep.md
     20  unwrap×20                                   ok          belvedere/plans/c23-readme-purge.md
      7  unwrap×7                                    ok          belvedere/plans/c3-grep-clock.md
      2  unwrap×2                                    ok          belvedere/plans/CODA.md
     37  unwrap×37                                   ok          belvedere/plans/deck-keel.md
     18  unwrap×18                                   ok          belvedere/plans/flow-keel.md
     61  unwrap×61                                   ok          belvedere/plans/p1-census-join.md
     51  unwrap×51                                   ok          belvedere/plans/p2-spawn-recipe.md
     64  unwrap×64                                   ok          belvedere/plans/p3-parse-coverage.md
     34  unwrap×34                                   ok          belvedere/plans/p4-restore-semantics.md
     60  unwrap×60                                   ok          belvedere/plans/p5-permission-physics.md
     55  unwrap×55                                   ok          belvedere/plans/p6-message-transport.md
     21  unwrap×21                                   ok          belvedere/plans/permissionrequest-runbook.md
     68  unwrap×68                                   ok          belvedere/README.md
     16  unwrap×16                                   ok          belvedere/v3/barrage/README.md
     23  unwrap×23                                   ok          belvedere/v3/console/README.md
     55  unwrap×55                                   ok          belvedere/v3/cornerstone.md
     21  unwrap×21                                   ok          belvedere/v3/engine/README.md
     16  unwrap×16                                   ok          belvedere/v3/fake-claude/README.md
     49  unwrap×49                                   ok          belvedere/v3/plans/c10-console-demo.md
     42  unwrap×42                                   ok          belvedere/v3/plans/c11-cursor-real-seam.md
     36  unwrap×36                                   ok          belvedere/v3/plans/c13-report-on-disk.md
     55  unwrap×55                                   ok          belvedere/v3/plans/c4-headless-physics.md
     33  unwrap×33                                   ok          belvedere/v3/plans/c5-fake-claude.md
     51  unwrap×51                                   ok          belvedere/v3/plans/c6-engine-core.md
     46  unwrap×46                                   ok          belvedere/v3/plans/c7-fuzzer-barrage.md
     77  unwrap×77                                   ok          belvedere/v3/plans/c8-real-session-physics.md
     42  unwrap×42                                   ok          belvedere/v3/plans/c9-scale.md
     19  unwrap×19                                   ok          belvedere/v3/plans/g4-verdict.md
     34  unwrap×34                                   ok          belvedere/v3/README.md
      9  unwrap×9                                    ok          BOARD.md
      1  unwrap×1                                    ok          canon/agents/fable-high.md
      1  unwrap×1                                    ok          canon/agents/fable-max.md
      1  unwrap×1                                    ok          canon/agents/fable-xhigh.md
      1  unwrap×1                                    ok          canon/agents/opus-high.md
      1  unwrap×1                                    ok          canon/agents/opus-low.md
      1  unwrap×1                                    ok          canon/agents/opus-max.md
      1  unwrap×1                                    ok          canon/agents/opus-medium.md
      1  unwrap×1                                    ok          canon/agents/opus-xhigh.md
      1  unwrap×1                                    ok          canon/agents/sonnet-high.md
      1  unwrap×1                                    ok          canon/agents/sonnet-medium.md
      1  unwrap×1                                    ok          canon/agents/sonnet-xhigh.md
      4  unwrap×4                                    ok          canon/BUILDINGS.md
      7  unwrap×7                                    ok          canon/CLAUDE.md
     10  unwrap×10                                   ok          canon/GUILD.md
     23  unwrap×23                                   ok          canon/mantles/architect.md
     12  unwrap×12                                   ok          canon/mantles/builder.md
     15  unwrap×15                                   ok          canon/mantles/digger.md
     35  unwrap×35                                   ok          canon/mantles/dispatcher.md
     14  unwrap×14                                   ok          canon/mantles/fixer.md
     32  unwrap×32                                   ok          canon/mantles/grand-architect.md
     24  unwrap×24                                   ok          canon/mantles/mentat.md
     29  unwrap×29                                   ok          canon/mantles/README.md
     83  unwrap×83                                   ok          canon/work/DOCTRINE.md
     70  unwrap×70                                   ok          canon/work/STANDARD.md
      2  unwrap×2                                    ok          canon/work/templates/board.md
      6  unwrap×6                                    ok          canon/work/templates/charge.md
      6  unwrap×6                                    ok          canon/work/templates/claude-md.md
      1  unwrap×1                                    ok          canon/work/templates/decisions.md
      1  unwrap×1                                    ok          canon/work/templates/issues.md
      2  unwrap×2                                    ok          canon/work/templates/ledger.md
      4  unwrap×4                                    ok          canon/work/templates/map.md
      9  unwrap×9                                    ok          CLAUDE.md
     12  unwrap×12                                   ok          DECISIONS.md
      4  unwrap×4                                    ok          desk/cmux-feedback-draft.md
      8  unwrap×8                                    ok          docs/load-map.md
     15  unwrap×15                                   ok          docs/the-city.md
     42  unwrap×42                                   ok          doctrine/README.md
     13  unwrap×13                                   ok          guard/README.md
      1  unwrap×1                                    ok          ISSUES.md
    159  unwrap×159                                  ok          LEDGER.md
    138  unwrap×138                                  ok          log-archive.md
     68  unwrap×68                                   ok          LOG.md
     23  unwrap×23                                   ok          MAP.md
     18  unwrap×18                                   ok          plans/001-composition-model.md
     27  unwrap×27                                   ok          plans/002-work-doctrine.md
     20  unwrap×20                                   ok          plans/003-global-claude-md.md
     61  unwrap×61                                   ok          plans/004-sync.md
     32  unwrap×32                                   ok          plans/005-saturation-harvest.md
     31  unwrap×31                                   ok          plans/006-hexwright-retrofit.md
     36  unwrap×36                                   ok          plans/007-simmy-retrofit.md
     50  unwrap×50                                   ok          plans/008-summon-rig.md
     36  unwrap×36                                   ok          plans/009-summon-rig-v11.md
     74  unwrap×74                                   ok          plans/010-summon-rig-v12-usage.md
     39  unwrap×39                                   ok          plans/011-summon-rig-v13-live-refresh.md
     27  unwrap×27                                   ok          plans/012-dispatch-guard.md
     33  unwrap×33                                   ok          plans/013-summon-rig-name-stamp.md
     20  unwrap×20                                   ok          plans/014-summon-rig-theater-cycle.md
     36  unwrap×36                                   ok          plans/016-doctrine-linter.md
     52  unwrap×52                                   ok          plans/017-storage-experiment.md
     69  unwrap×69                                   ok          plans/018-great-recut.md
     61  unwrap×61                                   ok          plans/019-doctrine-hardening.md
     32  unwrap×32                                   ok          plans/020-continuous-flow.md
     85  unwrap×85                                   ok          plans/021-census.md
     43  unwrap×43                                   ok          plans/021-vocabulary.md
     12  unwrap×12                                   ok          plans/022-summon-argv.md
     37  unwrap×37                                   ok          plans/023-law-book.md
     29  unwrap×29                                   ok          plans/024-parser.md
     44  unwrap×44                                   ok          plans/025-respell-sweep.md
     49  unwrap×49                                   ok          plans/026-language-linter.md
     24  unwrap×24                                   ok          plans/027-glass.md
     46  unwrap×46                                   ok          plans/028-charters.md
     11  unwrap×11                                   ok          plans/029-summon-harness.md
     48  unwrap×48                                   ok          plans/030-master-doc-prose.md
     49  unwrap×49                                   ok          plans/031-doctrine-defects.md
     22  unwrap×22                                   ok          plans/032-flow-grammar.md
     20  unwrap×20                                   ok          plans/033-canon-landing.md
     14  unwrap×14                                   ok          plans/034-register-purge.md
     10  unwrap×10                                   ok          plans/035-map-purge.md
     31  unwrap×31                                   ok          plans/036-grammar-debt.md
     23  unwrap×23                                   ok          plans/037-removal-arm.md
     26  unwrap×26                                   ok          plans/038-stamp-cycle.md
     23  unwrap×23                                   ok          plans/039-register-arm.md
     49  unwrap×49                                   ok          plans/040-id-respell.md
     24  unwrap×24                                   ok          plans/041-statement-caps.md
     30  unwrap×30                                   ok          plans/042-grid-prune.md
     56  unwrap×56                                   ok          plans/043-citation-respell.md
     26  unwrap×26                                   ok          plans/044-boot-pack.md
     31  unwrap×31                                   ok          plans/045-baton-fields.md
     25  unwrap×25                                   ok          plans/046-lint-gaps.md
     40  unwrap×40                                   ok          plans/belvedere.md
     17  unwrap×17                                   ok          plans/BULLETIN.md
      2  unwrap×2                                    ok          plans/CODA.md
      6  unwrap×6                                    ok          plans/g1-flow-close.md
     26  unwrap×26                                   ok          plans/g2-029-merge.md
     24  unwrap×24                                   ok          plans/g3-tender-review.md
     12  unwrap×12                                   ok          plans/g4-parser-review.md
      7  unwrap×7                                    ok          plans/log-tradition.md
     22  unwrap×22                                   ok          plans/night-shift.md
     24  unwrap×24                                   ok          plans/quartermaster.md
      1  unwrap×1                                    ok          plans/TENDER.md
      6  unwrap×6                                    ok          sapho-archive.md
     37  unwrap×37                                   ok          SAPHO.md
      5  unwrap×5                                    ok          summon/census/README.md
     52  unwrap×52                                   ok          summon/README.md

5792 edit(s) across 180 file(s) · 0 round-trip violation(s)

Dry run: 5792 edit(s) across 180 file(s) — 0 files written. Re-run with --write to apply.
```

The second run, after the write — one `id.respell` edit, the escalation F3 raised:

```
  edits  rule(s)                                     round-trip  file
      1  id.respell×1                                ok          LEDGER.md

1 edit(s) across 1 file(s) · 0 round-trip violation(s)

Dry run: 1 edit(s) across 1 file(s) — 0 files written. Re-run with --write to apply.
```

- [x] `bun test` green and `doctrine lint ~/code/agents` unchanged (19 `board.cell-cap`, belvedere's) on the unwrapped tree — pasted. **Met, both halves, on the desk's rulings.** `bun test` reads **175/175** at `05b24e5`: the drift alarm went green when the office lifted §8's procedural note out of formula 26 (F2a, `246851b`), and this session's three respell tests took the suite 172 → 175. `doctrine lint` holds its 19 `board.cell-cap` and gains one `ledger.merged` — **a true positive in belvedere's retired ledger (F2b), ruled a finding and not a defect this charge may write**: the desk distilled exactly that into D88's adoption protocol (*"the deltas are findings, not noise"*), the repair is a missing `---` and a `---` is not whitespace (Out of scope, line 1). `ledger.entry-cap` reads 170 rather than 169 because two ledger entries were written between the two runs.

```
 175 pass
 0 fail
 755 expect() calls
Ran 175 tests across 5 files. [300.00ms]
```

```
=== FAILURE CLASSES
    19  board.cell-cap
     1  ledger.merged

=== WARNING CLASSES (reported, never auto-fixed — they do not move the exit code)
   170  ledger.entry-cap

=== TOTALS
  3 buildings · 5/5 board docs yielded a board · 5 boards · 124 rows · 124 fully typed (100%)
  2/2 ledgers parsed a tail (199 entries) · 0 fireable baton(s) · 116 kickoffs in 121 work docs · 26 decisions (queue 0) · 0 inbox entries
  0 on credit · max interest 0
  0 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  20 failure(s) in 2 class(es) · 170 warning(s) in 1 class(es)
```

- [x] `doctrine lint --vocab ~/code/agents` before and after — identical counts, pasted (the vocabulary arm reads the same words in the same places). **Met on the same ruling: 50 → 52 `vocab.dead-word`, both new hits in belvedere, both true positives the per-line mask was hiding (F2c).** Every other count is identical, and the counts have not moved again since the run — F3's fix touched no word.

```
before: 50 vocab.dead-word · 19 board.cell-cap · 169 ledger.entry-cap (warn)
after:  52 vocab.dead-word · 19 board.cell-cap · 169 ledger.entry-cap (warn) · 1 ledger.merged
after F3:  52 vocab.dead-word · 19 board.cell-cap · 170 ledger.entry-cap (warn) · 1 ledger.merged
at landing: 51 vocab.dead-word · 19 board.cell-cap · 171 ledger.entry-cap (warn) · 1 ledger.merged
            — this doc's own Status opened LANDED, so the arm masks it whole and its one hit
            (047-unwrap.md:13, "the register") left the backlog with it: spent is spent. The
            171st warning is this session's own ledger entry.

the two new hits, located:
  belvedere/README.md:36     "the register" → a named register
  belvedere/v3/README.md:14  "the glass"    → Belvedere / the deck
```

- [x] The longest line in `canon/work/DOCTRINE.md` after the run, in characters, pasted — a number the reader can feel. **3163.** And the number that says what actually moved: the file went from 681 lines to 246, mean line 73 → 201 — while the longest line was **3152 before the run**, so the monster was already there and the unwrap did not make it. Across the corpus: 34,053 lines removed, 7,457 added — **−26,596 newlines** in 180 files.

```
canon/work/DOCTRINE.md before:  lines 681 · longest 3152 · mean 73
canon/work/DOCTRINE.md after:   lines 246 · longest 3163 · mean 201
the run:                        180 files changed, 7457 insertions(+), 34053 deletions(-)
```

- [x] `.git-blame-ignore-revs` present and configured; `git blame -L 1,5 canon/work/STANDARD.md` shows pre-respell authorship — pasted. **Met.** Line 3 is the one the unwrap rewrote, and blame still names `79c57ba0` (2026-09-01), not the run.

```
$ git config --local --get blame.ignoreRevsFile
.git-blame-ignore-revs

$ git blame -L 1,5 canon/work/STANDARD.md
f6ddd8f4 plans/21-standard.md   (Felix Green 2026-08-29 00:37:10 -0400 1) # The Guild's Standard
b1518d22 plans/21-standard.md   (Felix Green 2026-08-28 23:19:51 -0400 2)
79c57ba0 canon/work/STANDARD.md (Felix Green 2026-09-01 19:46:49 -0400 3) **Status:** BLESSED ⬡✓ 2026-08-29 …
b1518d22 plans/21-standard.md   (Felix Green 2026-08-28 23:19:51 -0400 4)
b1518d22 plans/21-standard.md   (Felix Green 2026-08-28 23:19:51 -0400 5) ## Preamble
```

- [x] `doctrine migrate ~/code/stigmergon` dry run pasted as the control: the table of what the rule *would* do there (nothing written — that building adopts at its own desk). **Met.** 4077 edits across 131 files, every verdict `ok`, 0 written. Its working tree carried unrelated changes before and after (`ISSUES.md`, a `snags/` dir) — the dry run touches nothing by construction.

```
stigmergon — the id respell table (D80), derived from the board:
  (every id already conforms — nothing to respell)

  edits  rule(s)                                     round-trip  file
     50  unwrap×50                                   ok          BOARD.md
     13  unwrap×13                                   ok          CLAUDE.md
     50  unwrap×50                                   ok          DECISIONS.md
    135  unwrap×135                                  ok          docs/chat.md
     44  unwrap×44                                   ok          docs/city.md
     78  unwrap×78                                   ok          docs/docket.md
     48  unwrap×48                                   ok          docs/harness.md
     65  unwrap×65                                   ok          docs/hive.md
…  (131 rows, every verdict ok)

4077 edit(s) across 131 file(s) · 0 round-trip violation(s)

Dry run: 4077 edit(s) across 131 file(s) — 0 files written. Re-run with --write to apply.
```

- [x] **The acceptance test (F3, ruled 2026-09-09):** `doctrine migrate --summary ~/code/agents` reports 0 pending edits and 0 hand edits — the three quoted spans (`LEDGER.md`, this doc, the inbox's now-cleared entry) respell to nothing — and the building reads *already in the current grammar*; pasted. No `--write` runs again in this charge. **Met at `05b24e5`**, and no `--write` ran. A hand-only file now lands in `migrations` too, so the *nothing to migrate* line proves both halves: were one line half-consumed anywhere in the building, the run would print the hand list instead of this.

```
$ bun doctrine/cli.ts migrate --summary ~/code/agents
agents — the id respell table (D80), derived from the board:
  (every id already conforms — nothing to respell)

agents: already in the current grammar — nothing to migrate.
```


## Out of scope

- Writing anything but whitespace — a word moved, dropped or added is a rejection.
- Any other building's files; `doctrine/fixtures/**`; `lab/**`; non-markdown files.
- The global file's line — live already (D88); canon text of any kind.
- A column limit of any size — the law is no limit.

## Ruled at the desk — 2026-09-09 (grand-architect-24), the amendment

Two rulings the Builder correctly refused to make, ruled here and granted into this charge's fence; the charge re-ignites on its kickoff below and finishes its own bar.

**F2a — ruled and done by the office.** §8's procedural note was a lazy continuation of item 26 in CommonMark and a sibling in its author's eye; the unwrap sided with CommonMark and the drift alarm did its job. The office lifted the note out of the numbered list — one blank line, the note standing as the bullet's own continuation paragraph — canon text, the office's hand, form only (`246851b`). `bun test` reads 172/172; nothing here for the Builder but to re-run it.

**F3 — ruled: two changes to `respell.ts`, both inside this fence now.** (1) **The arrow rule.** A ticked span adjacent to `→` — the text before its opening tick ends in `→` (spaces and an opening parenthesis allowed between), or the text after its closing tick begins with `→` — is a form being NAMED whatever it contains: `→` is the record's own grammar for a form change (STANDARD §7), and both sides of it quote forms as they were written. `NAMED_FORM` gains the neighbours as inputs and `outsideTicks` passes them; a span opened by two backticks (CommonMark's spelling for a span that holds a backtick — the inbox entry wrote `` `(GA-19, continued)` `` that way) is one span. (2) **The partial guard**, carried over from `citations.ts`: on any line where the respell would change one ticked span and leave another standing as a named form that carries a form the table knows, the line is reverted whole and reported as a HAND edit — never written. `--summary` prints the hand list (file:line and the excerpt) under its table; a hand edit is not a pending edit and does not break the fixed point. Tests: the `(GA-19, continued)` → `(GA-19)` line respells to nothing (the rule); a fixture line with a named lone token beside a respellable phrase reverts and reports (the guard), with a control where both respell and nothing fires. The acceptance test stands as F3 wrote it and is the bar's new line above. Ancestors: D80's rule 4 (040-F2 — a ticked lone token names a form), 043's partial-consumption guard, D81 (a converter never writes a lie).

## Findings

**F1 — the unwrap landed, and it is form only in the strictest sense the city has.** `doctrine/src/unwrap.ts` is a whole-document reflow, not a line rule: the engine in `migrate.ts` is per-line and its rules read their neighbours, so a reflow living inside it would be two rules editing one line. The rule writes no character — it only moves whitespace — and two laws say so at every run, both aborting the write on violation. The **round-trip law** takes its usual shape with a new normal form: every parsed field must be invariant under whitespace collapse, so the unwrap buys no license to differ (`changes` is empty, as the respell's is). The **word law** reads what no parser typed: outside fences, the whole text collapsed to single spaces must be equal; fences are compared byte for byte. Measured on the fence before a byte moved: **182 files · 5792 edits · 0 not a fixed point · 0 word-law failures**, and a structural probe found **0 differences in headings, table rows, table count, thematic breaks and list markers** across all 182.

**F2 — the finding of this charge: three of the Guild's own readers read a hard wrap as structure, and the unwrap takes that structure away.** The spec's claim — *"CommonMark renders a soft line break as a space, so the render is identical: the rule is form only"* — is true of the render and **false of this city's own line-scoped parsers**. Every one of them has a regex with `[^\n]*` or a per-line mask, and a wrap was silently doing work in it. Three instances, all found by the bar:

- **F2a — `canon/work/STANDARD.md` §8, formula 26. THE ESCALATION: this is the red suite, and its repair is a canon-text ruling.** §8's pinned list read, before the run:

  ```
    25. The best part is no part.
    26. History is respelled, not rewritten.
    Procedural rules stay entries, not formulas ("Charges are always staffed", "The
    mantle says whether a charge digs or builds") — the list carries speech, entries
    carry law; restating law in the list is redundancy carrying no information.
  ```

  The note is at the **markers'** indent (2), not the items' content column (6), so its author meant it as a sibling of the list. CommonMark disagrees — it is a lazy continuation of item 26's paragraph and always rendered inside it — and `test/vocabulary.test.ts`'s `pinned()` extractor (`^ {2}(\d{1,2})\. (.+)$`) agreed with the author, because the line break ended the match. The unwrap joins them, item 26's string grows by 250 characters, and the drift alarm goes red. **The alarm is right and this is what it is for** ("edit the standard and the suite goes red"). The two repairs a Builder could reach are both refused here: re-syncing `FORMULAS[25]` to the whole item would give it a ~30-word spine against a `Math.ceil(2 * spine / 3)` threshold, **silently disabling formula 26's paraphrase check** — weakening a test to get to green; and teaching `pinned()` to stop at the first sentence is a guess about where a formula ends. The repair that is right — lifting the note out of the numbered list, one blank line — is **canon text, out of this charge's fence** and a red act. It waits on the Architect or on Felix, and until then `bun test` is 171/172 by design.

- **F2b — `ledger.merged`, +1, and it is a true positive.** `belvedere/LEDGER.md:344` is a ledger head with no `---` above it — a real defect in a retired building's books. `parse.ts`'s discriminator is `^\*\*\d{4}-\d{2}-\d{2}\s*·[^\n]*?\*\*\s*[—–-]`, and the head writes `.** Changed:` where the grammar wants `** — `, so it never matched. Reflowed, the entry's body brings a later `**\`grammar.md\`** —` onto the same line, `[^\n]*?` reaches it, and the head matches. An accidental true positive: **the pattern got looser, and what it caught was genuinely broken.**

- **F2c — `vocab.dead-word`, +2, both true positives.** The vocabulary arm's fence is a **per-line** mask (code spans, double-quoted spans, link texts). A quoted span that opened on one line and closed on the next masked a different region than it does now. `belvedere/README.md:36` ("the register") and `belvedere/v3/README.md:14` ("the glass") are dead words that were always there and were always outside their fences — the wrap was hiding them. The city's respell backlog got two entries longer and one degree more honest.

  **The general shape, for the office:** D88 says a wrap decodes to nothing, and for a human reader that is true. For a machine reader a wrap is a delimiter, and every line-anchored pattern in `doctrine/` inherits a looser reach the day its corpus flows. The three above are what one building's bar caught; **stigmergon's adoption should re-run its own lint and vocab before and after and diff them the same way** — the deltas are the audit, not the noise.

**F3 — the respell's named-form fence mis-fires on a ticked span carrying whitespace, and the unwrap exposed it. `doctrine migrate --write ~/code/agents` must not be run until this is ruled.** The second run reports one pending `id.respell` edit on `LEDGER.md`:

```
-  **A form repair on grand-architect-19's continuation entry** (`(GA-19, continued)` → `(GA-19)`, …)
+  **A form repair on grand-architect-19's continuation entry** (`(grand-architect-19, continued)` → `(GA-19)`, …)
```

Both ticked spans are **forms being named** — D80's rule 4, the same instinct as the graveyard's own rows. `respell.ts`'s `NAMED_FORM` fences a ticked span only when it holds no whitespace ("a span with whitespace is a phrase, not a form — `ignite 029` is a command"), so the left span falls through and the right one does not. The sentence then records a repair that expands a name, which is not what happened: **half a respell reads as finished work and is not** — `citations.ts` already guards exactly this ("a line the shapes consume only PARTLY is reverted whole and reported"), and the respell has no such guard. Before the run the two spans sat on different lines and the per-line tick mask read the left one differently, so the wrap was holding the defect shut. The round-trip law prints `ok` for it, because `body` goes through `respellNormal` on both sides — a live instance of the README's own caveat: **`round-trip ok` is a statement about declared fields, not about meaning.** Filed to `ISSUES.md`. The fix is the respell's, not the unwrap's, and it is an Architect's call: either extend `NAMED_FORM`, or give the respell `citations.ts`'s partial-consumption guard. **The acceptance test is exact:** this finding and the inbox entry quote the span verbatim, so `doctrine migrate --summary ~/code/agents` now reports **three** pending `id.respell` edits — `LEDGER.md` (the original), `plans/047-unwrap.md` and `ISSUES.md` (the two quotations). A correct fix takes that count to zero and the whole building back to `already in the current grammar — nothing to migrate`.

**F4 — a deliberate deviation from the spec: structure first, reflow second, never both on one file in one run.** The spec's fixed point is *"the second run writes nothing, on every file"*. `migrate()` now runs the structural and respell rules first and reflows only the files they left alone. The reason is measured: `ledgerBareHead` reads `ctx.ahead(eat + 1)` for a `Changed:` label, `clauseEdits`'s license test reads `^(Changed|Blocked):` at line start, and the ledger head rules eat wrapped parentheticals — a reflow in the same pass hands each of those bytes its author never wrote. **A building that has adopted takes one run and the second writes nothing** (agents: the reflow is a fixed point on pass one, proven in memory over 182 files and again by the second run reporting no `unwrap` edit). **A building mid-molt takes two**, and the second moves only whitespace — hexwright (63 structural edits) and spacex-dashboard (80) are the live cases. Named in the README.

**F5 — the word law needed one narrowing, and the first run found it.** The rule drops a blockquote's inner `> ` markers when it joins quoted lines (the spec's own wording: *"the quote's first marker kept"*), and the naive collapse read the vanished markers as vanished words: **12 files failed the word law on the first dry run**, every one of them a coda or a quoted ruling. A leading `> ` is line structure exactly as a continuation line's indentation is, so `collapse()` strips leading quote markers on **both** sides before comparing. What the law still asserts is the whole of what it claims — the test proves it by breaking it (a word added, dropped, moved; a fence changed; a quote marker deleted rather than merged).

**F6 — where the rule refuses, and the measurement that set each refusal.** A line that **opens** a block is guarded; a line that **continues** a paragraph is not — CommonMark's own asymmetry (an indented code block, a generic HTML block and a GFM table cannot interrupt a paragraph), and it is what keeps `c21-gut-v1.md:29`'s wrapped `` | 'nagging'` `` and `b14-city-attention.md:179`'s `< 500 ms` from being read as a table row and a tag. Three refusals earned their place against the census of 182 files:

- **§11's baton is a boundary.** `parse.ts`'s `BATON_LINE` is line-anchored, so a baton joined into the prose above it stops being a baton. One live case — `LEDGER.md:1873`, an entry whose `Next:` clause ends its line and whose baton opens the next. Measured after the run: **76 baton lines at line start before, 76 after.** The baton still *opens* a paragraph and absorbs its own wrapped continuation, which is what `batonSlots` already folds.
- **An opener indented four or more is untouched**, code block or deep list continuation alike — the converter cannot tell them apart without tracking list openness, and a block it cannot prove is prose stays as it is. Cost: a handful of third-level list items keep their wraps.
- **A lazy list continuation still joins, and the rejected alternative is recorded.** Refusing to join a continuation indented less than its item's content column would have fixed F2a for free — and the census says no: **203 such lines, 150 of them at `content 2, indent 0`**, pre-doctrine ledger bullets whose wraps are ordinary wraps. There is no discriminator, so the rule stays.

**F8 — F3 built, and the two clauses cost less than the two traps they set.** `c615401` and `05b24e5`: `respell.ts` stopped splitting a line on every backtick and now tokenizes it — a run of n delimiters opens a span, the next run of EXACTLY n closes it — so a double-ticked span is one span, and `namedForm` reads its neighbours. Three clauses fence a span now: a lone token (as before), a span **beside `→`** whatever it carries, and a span opened by **more than one delimiter**, which is what the record reaches for only when it quotes markup as written. The **partial guard** reverts and reports a line where one code span respells while another stands as a named form the rules can still reach; `Migration` grew a `hand: Hand[]` channel, `--summary` prints the list under its table, and a hand-only file rides in `migrations` so *nothing to migrate* means nothing pending AND nothing half-consumed. Suite 172 → 175. Two traps, both found by measurement, both worth the next reader's minute:

- **The cross-line question stopped being a count.** `ticksLeftOpen` answered it by counting delimiters mod 2; a line whose double-ticked span holds a lone tick spends five of them, so under the count every line beneath it read as *inside a span* — and this doc, whose F6 writes exactly such a line, had its own findings masked wrongly while quoting the masking rule. The tokenizer now answers: a span is left open only where a lone tick never closed. Measured across both live buildings: stigmergon's control run is unchanged at **4077 edits across 131 files**, agents is clean, the suite is green.
- **The converter's mask reads the converter's own source.** The first cut of the tokenizer wrote three lone backtick literals (`s.indexOf` on the delimiter, and a `repeat`); the odd one left a span open for the rest of the file, and the run offered to respell four doc comments below it — the exact class this charge exists to close. The delimiter is now a single `TICK` constant spelled as an escape, so no backtick stands alone in that file's source. A converter that runs over its own repo must be written so that it can.
- **A record cannot quote the tool's output without re-triggering the tool.** The hand list this session first printed named two lines of its own test source, because a test that asserts on a form must WRITE that form. The fixture was retuned onto the table's own ids (`C23` · `C24`), which fall silent in every building that has adopted, and the guard's live rendering is quoted here in the one spelling that is inert — the double-tick span the third clause fences: `` doctrine/test/doctrine.test.ts:924: id.respell — `GA-20` · `GA-21, continued` ``. That is F3's lesson stated twice: the citation of a form is a form, and this doc is inside the fence it describes.

**F7 — for the next building's desk.** Adoption is one command: `doctrine migrate --summary <building>` to read the table, then `--write`. Do it at a **clean tree**, capture `doctrine lint` and `doctrine lint --vocab` before and after, and **diff the two** — F2 says the deltas are real findings, not noise, and F3 says a pending non-`unwrap` edit in the second run is a stop, not a formality.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/047-unwrap.md to its bar.
```
