# 043 — the citation respell

**Status:** LANDED 2026-09-02 — the hand list (42 edits, `cea0648`) then the converter
(66 edits over 9 surfaces, `9b1c3d1` + `c70ce9e`); the census reads **0** unconsumed dead
citations on the fence; `bun test doctrine` 109 → 121; lint unchanged, line for line.
Blocked 2026-09-01 and re-cut by F12 (⬡✓ 2026-09-02) — the block's record stands below. ·
**Depends on:** ⬡-gate: his word — paid 2026-09-01; the amendment — paid 2026-09-02 ·
**Staffing:** Builder · opus-high · **Blessed:** D81 ⬡✓ 2026-09-01 (the currency
law — the D-id became a dead form at D77's purge and the corpus never followed);
Felix, 2026-09-01 in-session ("History, I agree with this"); the amendment ⬡✓ 2026-09-02
("Bless", read)

## Mission

The live canon cites killed register entries 111 times across 39 distinct ids
(D4 … D75): labels that still name a rule, links that lead nowhere. Each citation
respells, by the converter, to the home that now carries the law — `(D44)` becomes
`(DOCTRINE §4, gates are charges)`. The ledger, the Log, and every closed finding keep
their ids: there a `D44` records what was decided that day, and respelling it would
change meaning, not form (D81 binds forms on live surfaces; `git log -S D44` still
resolves the record).

## Inputs — read before working

- D77 (the purge) and D81 (the currency law) in [DECISIONS.md](../DECISIONS.md);
  [034's findings](034-register-purge.md) — every law verified living in its home,
  the homes named by class; the map is partial there — derive the rest.
- The register as it stood before the purge: the Builder finds the commit before "the
  purge" (`git log --oneline -- DECISIONS.md`) and reads each killed entry's title and
  body to name its home.
- The census, 2026-09-01: `grep -ohE '\bD[0-9]{1,2}\b' canon/work/DOCTRINE.md
  canon/work/STANDARD.md canon/mantles/*.md canon/GUILD.md canon/BUILDINGS.md MAP.md`
  → 111 dead citations over 39 ids, 23 live (D77+). Re-run at build.
- `doctrine/src/migrate.ts` — 040's rule shape: the table derived and printed before a
  byte moves, applied to tracked text, the fixed-point law (040-F7, 040-F8).

## Spec (blessed with D81)

- **The table:** one row per killed id → its home, written `‹file› §‹n›, ‹the rule's
  short name›` — `DOCTRINE §4, gates are charges` · `STANDARD §3, the baton` ·
  `grand-architect.md, the two sweeps` · `the mantles README, the tier grid` ·
  `MAP §4, deployment`. An id whose law was killed outright, never distilled, respells
  to `killed at D77`, and the sentence citing it is read once by the Builder: a live
  rule leaning on a dead law is a finding for the office, never a fix. The table lands
  under Findings as the record and in `migrate.ts` as data.
- **The fence:** live canon surfaces only — `canon/**/*.md`, `MAP.md`, `BOARD.md`,
  `docs/*.md`, the templates. Never `LEDGER.md`, `LOG.md`, `log-archive.md`, the
  findings in `plans/*.md`, the live entries of `DECISIONS.md` (their "Ancestors:"
  name ids as history), or `belvedere/`.
- ~~**The form:** `(D‹n›)` reads `(‹home›)`; a `D‹n›/D‹m›` pair reads `‹home›; ‹home›`; a
  citation naming an amendment ("amended at D52") keeps the id and gains the home.
  The converter never paraphrases. The fixed-point law: run twice, diff empty, then a
  third time.~~ *Struck 2026-09-02 — circular on 58 of 152 (F1); the amendment clause
  kept dead ids on live surfaces. The form is F12's, below.*
- ~~**The linter:** the vocabulary arm gains a warning — a bare `D‹n›` on a live canon
  surface whose number is below the register's lowest live id is a dead citation; the
  floor is derived from `DECISIONS.md` itself, never kept.~~ *Struck 2026-09-02 — built as
  written it guards nothing (F8), and a floor is the wrong test once D78 kills leave gaps.
  The alarm rides the deferred list with the discovery question; this charge lands
  without it.*

### The spec, amended 2026-09-02 (F12 — ⬡✓ 2026-09-02)

**The form — four rules, table-driven, the citing file known to the converter:**

1. **Self — strip.** The home file is the citing file: the id and its joining punctuation
   go; the sentence keeps its bytes. `**Gates are charges (D44).**` → `**Gates are
   charges.**` · `(D63; D74)` → gone · `(D54, generalized 2026-08-31)` → `(generalized
   2026-08-31)` · `(D65; birthplace: …)` → `(birthplace: …)`. Same file, any section: the
   doctrine writes its own section pointers as `(§10)`, and a D-id never was one.
2. **Cross — spell the home.** Another file: `D‹n›` → the table's home, joined to a
   neighbor by ` — ` (the standard §7): `(D44)` in `architect.md` → `(DOCTRINE §4, gates
   are charges)` · `(…the message, D57)` in `builder.md` → `(…the message — DOCTRINE §10,
   a running batch is amendable)`. Where the home file is already named on the citing
   line the pointer is redundant and strips: `([STANDARD.md](STANDARD.md), D71)` →
   `([STANDARD.md](STANDARD.md))`.
3. **Foreign — qualify.** Another building's id reads `‹Name›:D‹n›` (D80, the register's
   Name): `simmy:D4` · `snappy:D9` · `belvedere:D5` · `belvedere:D10`. The citing prose
   says which building. Fourteen — F4's thirteen minus `BOARD.md`'s three, plus
   `DOCTRINE.md:531` (F12). By hand.
4. **Never touched:** `canon/mantles/dispatcher.md` (history by declaration, F7) ·
   `BOARD.md` (records, F6 — out of the fence) · an id shown as a form, in ticks or a
   template slot (F5: `DOCTRINE.md:104`, `templates/decisions.md:9`) · the live entries,
   D77 and up.

**The hand list.** Every dead id the converter's shapes do not consume is a hand edit
with two moves and no third: **(a)** delete the id and its connective so the sentence
reads — `(D69, respelled by D71)` → gone · `made law at D73` → gone · `(D43/D61's intent —
their Dispatcher wording is superseded by D71)` → gone: legislative history, the ledger's;
**(b)** where the id is a noun the sentence needs, the table's short name or the qualified
id replaces it — `D28's law` → `the parallel-affordable law` · `D10 wholesale` →
`belvedere:D10 wholesale`. A sentence that needs a third move is a finding, never a fix.
D71's row names a whole book, so its cross-citations are hand edits — `the standard`, or
the section the sentence leans on. Every hand edit is one row under Findings — file:line ·
before · after — and the hand edits ride one commit of their own, landed before the
converter runs.

**The converter.** Line-based like 040's rules; a shape split by a hard wrap is a hand
edit. The table is data in `doctrine/`, one row per killed id; the next D78 kill appends
its rows from the killed entries' `Home:` lines. The fixed-point law stands: run twice,
diff empty, then a third time. The converter never paraphrases.

## Out of scope

The ledger, the Log, findings, belvedere — history keeps its names · the buildings' own
dead citations — their Architects, at their desks, with this rule · any meaning change:
a citation whose home disagrees with the citing sentence is a finding, never a fix.

## Done when:

*The three unmet boxes below are the BLOCK's record, 2026-09-01. The bar this charge landed
against is the amended list under them (F12, ⬡✓ 2026-09-02).*

- [x] The table, 39 rows, pasted under Findings, each home verified by a quote from it.
      **Met** — the table below; 39 rows, every home quoted with its file and line, every
      quote re-read at the desk. Its id set is not the census's: see F6.
- [ ] The census re-run after the converter → only live ids and amendment citations on
      the live surfaces; the count pasted; the run's diff read whole.
      **Not met — no converter was run.** The census IS re-run and pasted (F6): 111 dead
      over 39 ids on the census's file list, 152 over 53 on the charge's fence. The form
      rule that would consume them is circular on 58 of the 152 (F1, F2) and forbidden on
      39 more (F4, F5, F7), so the run would have written nonsense into the canon.
- [ ] Round-trip: the converter run twice, the second diff empty, the third run silent;
      pasted. **Not met** — nothing to round-trip.
- [ ] `bun test` green with a fixture — a canon page citing three dead ids, one
      amendment, one live id; `doctrine lint ~/code/agents` 0 failures; `lint --vocab`
      warns on the fixture and not on agents; pasted.
      **Not met, and two thirds of it is unattainable as written:** `doctrine lint
      ~/code/agents` reads **34 failures** today and 041 landed it red on purpose — G3
      prunes it (F9); and the arm, built on the surfaces the linter actually reads, would
      guard **none** of these citations, because `canon/` is invisible to the vocabulary
      arm (F8). `bun test` is unchanged at **109 pass / 0 fail** — no code was touched.

### Done when — amended 2026-09-02 (F12 — ⬡✓ 2026-09-02)

- [x] The hand list pasted — one row per edit, file:line · before · after — landed as one
      commit before the converter runs; the fourteen foreign ids among them each read
      `‹Name›:D‹n›`.
      **Met** — F13's table, **42 rows**, one commit (`cea0648`), landed before the run
      (`9b1c3d1`). The foreign ids inside the fence are **eleven**, not fourteen: the
      office's count included `BOARD.md`'s three, which rule 4 fences out (F14). Each now
      reads `‹Name›:D‹n›` — `simmy:D4` · `snappy:D9` ×2 · `belvedere:D5` · `belvedere:D10` ·
      `belvedere:D11` ×3 · `belvedere:D12` ×3.
- [x] The converter's run: the table printed before a byte moves, the diff read whole; the
      census re-run on the fence minus the tombstone reads **0** bare dead ids outside the
      two forms shown — the command and the count pasted.
      **Met** — the CLI prints the 39-row home table before any diff, by construction (the
      table, then the diffs, then the census). **66 edits over 9 surfaces** — 65 in the first
      run (`9b1c3d1`, 114 diff lines) and one more after the mask defect F16(c) was fixed
      (`c70ce9e`) — every diff line read at the desk before its write.

      ```
      $ bun doctrine/cli.ts citations .
      census — bare D-ids still standing on the fence (34 surfaces read):
        the table's own, unconsumed — each a HAND edit: 0
        outside the table — live ids and the forms rule 4 fences: 41
           D1×1 D78×8 D79×7 D80×6 D81×5 D82×9 D83×1 D84×1 D85×3

      Dry run: 0 edit(s) across 0 file(s) — 0 files written. Re-run with --write to apply.
      ```

      **0** unconsumed. The 41 outside the table are the live entries D78–D85 (40) and
      `templates/decisions.md:9`'s `**D1**` — the register template's entry shape, rule 4's
      first form shown. The second, `DOCTRINE.md:104`'s `` `[D19](DECISIONS.md)` ``, sits in
      ticks and the mask never offers it to a rule, so the census does not count it bare.
- [x] Round-trip: the converter run twice, the second diff empty, the third run silent;
      pasted.
      **Met**:

      ```
      run 1  citations . --write   →  Wrote 9 file(s), 65 edit(s).
      run 2  citations . --write   →  Wrote 0 file(s), 0 edit(s).
      run 3  citations .           →  Dry run: 0 edit(s) across 0 file(s) — 0 files written.
      ```

      `git status --porcelain` after runs 2 and 3 listed exactly the nine files run 1 wrote
      (plus `BOARD.md` and the desk's own JSON, neither this charge's) — no byte moved twice.
      The mask fix re-opened one line, so the law was re-run on it and holds there too:

      ```
      run 1  citations . --write   →  Wrote 1 file(s), 1 edit(s).
      run 2  citations . --write   →  Wrote 0 file(s), 0 edit(s).
      run 3  citations .           →  Dry run: 0 edit(s) across 0 file(s) — 0 files written.
      ```
- [x] `bun test doctrine` green with a fixture — a canon page carrying a self citation
      bare and one leading a parenthetical, a cross citation bare and one with its home
      already on the line, a foreign id, a form shown in ticks, a live id — and its
      expected text; pasted.
      **Met** — [`doctrine/fixtures/citations/canon-page.md`](../doctrine/fixtures/citations/canon-page.md)
      and its `canon-page.expected.md`, read as `canon/work/DOCTRINE.md` so half its citations
      are self ones. It carries every shape the rules consume — self bare (D25), self leading
      a parenthetical (D63), a self pair joined by `/` (D46/D64), cross bare (D56), cross
      trailing a parenthetical (D62), cross with its home already on the line (D71) — and
      every shape they must refuse: a foreign qualified id (`belvedere:D11`, `simmy:D4`), two
      forms in ticks, a live id (D82), a possessive that blocks its own line (D28 beside a
      bare D44), a shape split by a hard wrap (D48), and a fenced block whose citation is a
      citation while the ticked token beside it is a form.
      [`doctrine/test/citations.test.ts`](../doctrine/test/citations.test.ts) — 12 tests,
      including the byte-for-byte control, the rule names in order, and the fixed-point law.

      ```
      $ bun test doctrine
       121 pass
       0 fail
       583 expect() calls
      Ran 121 tests across 3 files. [102.00ms]
      ```

      **109 → 121.** Nothing was weakened: one standing assertion — the graveyard mirror —
      went red at a hand edit and the data followed it (F17).
- [x] `doctrine lint ~/code/agents` reads what a HEAD worktree reads, line for line
      (042's reading — F9); pasted.
      **Met** — the pre-work tree materialized read-only (`git archive 5213771`, the last
      commit of grand-architect-23's sitting) and linted against the worktree: same failure
      classes, same `file:line`, same excerpts, same totals. The only differing lines are the
      Name column (`agents` vs the temp path) — the register resolves a building's Name from
      its declared Root, which a copy cannot be.

      ```
      $ bun doctrine/cli.ts lint . --guard 5213771
        33 failure(s) in 1 class(es) · 168 warning(s) in 1 class(es)
      guard ok — no entity total decreased vs 5213771
      ```

      Both sides read `33 failure(s) in 1 class(es) · 168 warning(s) in 1 class(es)` — the 33
      `board.cell-cap` 041 landed on purpose; the prune is G3's. `--vocab` is unaffected by
      construction: `canon/` and `docs/` are invisible to the vocabulary arm (F8, unchanged).

## Findings

**BLOCKED 2026-09-01 (Builder · opus-high).** The table is built and pasted; no byte was
converted and `doctrine/` is untouched. The spec's form rule — a citation reads as the
home that now carries the law — is **circular on 58 of the 152 citations inside the
charge's own fence**, because on those the home IS the citing sentence; it is forbidden
on 39 more (other buildings' ids, a tombstone, board records, forms being shown); and it
contradicts a landed ruling of this same office, which answered this exact question the
other way and executed it on 88 citations three days ago. One ruling unblocks the whole
charge — **F10**.

- **F1 — the worked example is circular on its own source.** The spec's illustration is
  `(D44)` becomes `(DOCTRINE §4, gates are charges)`. There is exactly one `(D44)` of
  that shape in the corpus, and it is
  `canon/work/DOCTRINE.md:237: **Gates are charges (D44).** A judgment step between charges — a merge review, a landing`
  — inside `## 4. The board` (its heading is line 154, §5's is line 269). The rule applied
  to its own example emits `**Gates are charges (DOCTRINE §4, gates are charges).**` The
  same shape recurs the length of the file: `- **Naming law (D25):**` at :93 sits in §3
  and D25's home is DOCTRINE §3; `- **Linking law (D58):**` at :103, `- **Venue law
  (D55):**` at :543, `- **Late relocation (D50):**` at :466 — each is the home citing
  itself. Independent confirmation: the two research hands that built the table below were
  asked to verify each home by quoting it, and for D25, D42, D44, D46, D50, D53, D54, D55
  and D58 the quote they returned **is the citing line**.

- **F2 — the shape census: only a third of the corpus fits the spec's form.** Every dead
  citation inside the fence, classified by where its law lives against where it is
  written (152 occurrences, 53 ids):

  | class | n | what it is | the spec's rule applied |
  |---|---|---|---|
  | self-citation | 58 | the home is the citing document | circular (F1) |
  | cross-citation | 55 | the home is another document | works as written |
  | foreign id | 13 | another building's register (F4) | corrupts an address |
  | tombstone | 11 | `dispatcher.md`, "preserved as history, unedited" (F7) | edits history |
  | board record | 13 | `BOARD.md` — a paid gate, a landing's reasoning (F6) | destroys the record |
  | form shown | 2 | an id displayed as a form, not cited (F5) | breaks the example |

  Self-citations by file: DOCTRINE 52 · docs/the-city.md 3 · STANDARD 1 · the mantles
  README 1 · architect.md 1. The 55 cross-citations — `architect.md` citing DOCTRINE §4,
  `docs/the-city.md` citing the charters, the templates citing DOCTRINE §3 — are the
  charge's real customers, and they are the minority.

- **F3 — this office already ruled the question, the other way, and executed it.**
  [034-F4](034-register-purge.md) (⬡ at the purge sitting): *"Law files keep their
  D-parentheticals as lineage marks: whichever sweep next touches a file **strips its dead
  numbers** (035 does MAP; the charters' ride the next charter sweep)."* 035 did exactly
  that, in commit `898ddf2` — `git show 898ddf2 -- MAP.md | grep -E '^-' | grep -coE
  '\bD([1-9]|[1-6][0-9]|7[0-6])\b'` → **88**. The strip, not a respell: MAP's opening line
  went from `— **the Guild** (D37):` to `— **the Guild**: the` (MAP.md:6 today), and
  `## 3. The roster (D71)` to `## 3. The roster`. Two canon instruments now say opposite
  things about the same 152 citations: 034-F4 says strip, 043 says respell to the home.
  Given F1, they are reconcilable — strip is what "respell to the home" **means** when the
  home is the citing sentence — but that is a spec amendment, not a Builder's licence.

- **F4 — thirteen of the citations are other buildings' ids, and three are inside the
  charge's own "111".** They are bare, unqualified, and a table keyed on the number would
  rewrite every one into this building's law:
  `canon/work/DOCTRINE.md:121` (`simmy D4`) · `:263` (`snappy §6.8/D9`) · `:360`
  (`snappy D9`) · `:514`, `:515`, `:517`, `:519` and `canon/work/STANDARD.md:28`, `:29`,
  `:336` — all six of those last are **belvedere's** D10/D11/D12, verified in
  `belvedere/README.md:415` ("**D10** … **Ambiguity never arms.**"), `:457` ("**D11** …
  **The arm contract.**"), `:465` ("**D12** … **Scope-arm.**"); plus `BOARD.md:43`, `:44`
  (`belvedere D22`) and `:52` (stigmergon's `D15`). The charge fences these out — "the
  buildings' own dead citations — their Architects" — but the census counted them in, so
  the "111 over 39 ids" includes at least ten citations of four ids this charge may not
  touch (D9, D10, D11, D12 have **no** agents-side occurrence at all).

- **F5 — two occurrences are forms being shown, and the converter's existing mask does not
  protect one of them.** `canon/work/DOCTRINE.md:104` is the linking law's own worked
  example — ``  `[plans/004-sync.md](plans/004-sync.md)`, `[D19](DECISIONS.md)` — one click beats a`` —
  and `canon/work/templates/decisions.md:9` is the register template's entry shape,
  `- **D1** (⟨date⟩, ⟨decider⟩⟨ · ⬡✓ ⟨date⟩⟩): **⟨title⟩.** ⟨body⟩`. The first is inside
  code ticks, but `respell.ts`'s `NAMED_FORM` reads a ticked span carrying `/` or `.` as an
  **address**, not a named form (040-F2's exclusion), so the tick mask hands it straight to
  the rules. Any respell rule must fence both by hand.

- **F6 — the census and the fence disagree, and both were re-run.** The charge's own
  command, re-run 2026-09-01 over its own file list, reproduces the charge exactly:
  `distinct ids: 47 · dead hits (<=D76): 111 · dead ids: 39`. The same grep over the
  charge's **fence** (`canon/**/*.md`, `MAP.md`, `BOARD.md`, `docs/*.md`, the templates):
  `dead hits (<=D76): 152 · dead ids: 53`. The 41 the census missed are
  `docs/the-city.md` 17, `BOARD.md` 16, `docs/load-map.md` 4, the templates 4 — and
  `MAP.md` contributes **zero** dead citations, because 035 already stripped it (F3).
  `docs/*.md` and the templates are genuine law-surface citations and belong in the
  charge. `BOARD.md` does not: all 13 of its non-foreign dead citations are records of
  what was decided that day — `⬡-gate: D32 ✓ 2026-08-06` (rows 006, 007), `⬡-gate: D34 ✓`,
  `⬡-gate: D36`, `⬡-gate: D41 ✓`, `venue D2 ⬡✓ via keel §11`, `the D76-blessed roster`,
  `D1–D76 killed whole`, `so D48 forbids the merge`, `D74 built`, `the D64 grammar asks` —
  the class the charge's own mission exempts ("there a `D44` records what was decided that
  day, and respelling it would change meaning, not form"). The fence names `BOARD.md`; the
  mission's rule takes it back out. Both cannot stand.

- **F7 — the fence names a tombstone.** `canon/mantles/dispatcher.md` holds 11 of the 152,
  and its own head says why they must stay: *"The body below is preserved as history,
  unedited (simmy's DISPATCHER.md precedent)"* (`canon/mantles/dispatcher.md:11-13`). The
  fence is `canon/**/*.md`; the file is history by declaration.

- **F8 — the linter arm, built as specified, would guard none of these citations.** The
  vocabulary arm reads `lawSurfaces()` — a building's prose docs, its boards, its live
  charge docs — and for `agents` that list is exactly five files:
  ```
  law surfaces the vocabulary arm reads for `agents`:
    /Users/felix/code/agents/BOARD.md
    /Users/felix/code/agents/CLAUDE.md
    /Users/felix/code/agents/MAP.md
    /Users/felix/code/agents/plans/030-master-doc-prose.md
    /Users/felix/code/agents/plans/043-citation-respell.md
    total: 5
  ```
  Not one is under `canon/`, where 111 of the 152 live. Two independent mechanisms put
  them out of reach: `grammar.ts`'s `isLawBook = (f) => f.split(sep).includes('canon')`
  fences the whole directory from every arm that reads forms as data ("A book that may not
  name a form cannot define it"), and `building.ts`'s walk classifies `DOCTRINE.md`,
  `STANDARD.md`, the charters and `docs/*.md` as no artifact at all — `PROSE_DOCS` is
  `MAP.md`/`GENESIS.md`/`README.md`/`CLAUDE.md` **at the anchor's own directory**, and
  `SKIP_DIRS` skips `templates/`. Widening either is a change to the linter's discovery,
  not "the vocabulary arm gains a warning". As written the arm would satisfy its bar —
  warn on a fixture, silent on agents — while watching an empty room. That is
  green-but-wrong, so it is named rather than built.

- **F9 — the lint bar is unattainable, and the batch made it so.** `doctrine lint
  ~/code/agents` reads `34 failure(s) in 2 class(es) · 168 warning(s)` — 33
  `board.cell-cap` and 1 `ledger.baton`; 041 landed those on purpose ("lint red on
  purpose — 33 cells, 166 entries; the prune is G3's") and G3 owns the prune. `--vocab`
  adds 38 `vocab.dead-word` failures on top (2 of them the agents building's). No landing
  of 043 can read 0. 042 met the same wall and measured "lint unchanged"; that is the
  reading this bar wants.

- **F10 — the fork, and the re-cut it needs.** One question for the office: **when a
  citation's home is the document that carries it, does the citation strip (034-F4, 035)
  or does it spell the home (043)?** Everything else follows mechanically. The re-cut this
  Builder would build, if it is blessed:
  1. **Self-citation → strip.** The home file equals the citing file: the parenthetical
     goes, the sentence keeps its bytes. This is 034-F4's ruling, 035's landed act, and the
     only non-circular reading of "respells to the home". 58 occurrences.
  2. **Cross-citation → the home.** `(D‹n›)` reads `(‹home›)`, a pair reads
     `‹home›; ‹home›` — the spec's own form, unchanged. 55 occurrences.
  3. **Amendment or event citation → keep the id, gain the home.** `(D64, amending D46)`,
     `(D69, respelled by D71)`, `made law at D73`, `since D18`, `the D49 sweep`, `D28's
     law` — the id is the subject, not a pointer, so it stays and the home rides behind
     it. This is the spec's amendment clause, widened to the possessive and narrative
     shapes the corpus actually writes; it is a subset of rules 1–2 above, not a sixth.
  4. **Never touched:** another building's id (13), `dispatcher.md`'s preserved body (11),
     `BOARD.md`'s records (13), an id shown as a form (2) — 39 occurrences, each named in
     F4, F5, F6, F7.
  Rules 1 and 2 need the home *file* per id, which the table below supplies, and the
  citing file — both mechanical, so the converter stays table-driven. Rule 3 needs the
  citation's shape, which is a regex over the sentence, not a judgment. The table is
  therefore complete for whichever way the ruling goes; only `migrate.ts` waits.

- **F11 — one law has no live home.** D67 (dispatch visibility — the announce duty)
  survives only inside the tombstone (`canon/mantles/dispatcher.md:82`), which is history
  by declaration (F7). No live document carries "announce every dispatch"; DOCTRINE §10
  inherits only the batch-report format. Per the charge's rule this is a finding for the
  office, never a fix: the duty is unhomed until the flow engine's charter lands.

- **F12 — the office's ruling on F10 (grand-architect-23, 2026-09-02; ⬡✓ 2026-09-02).** The
  fork is not a fork. A citation is a pointer to where the law lives, and 034-F4 and this
  charge answer one rule at two distances: where the home is another document the pointer
  names it — the spec's form, unchanged; where the home is the citing document there is
  nothing to point at, and the pointer strips — 034-F4's word, 035's act on MAP's 88. F3's
  reading is the ruling: strip is what "respells to the home" *means* when the home is the
  sentence. Two amendments ride it. **The amendment clause dies:** a dead id in narrative
  (`since D18`, `made law at D73`, `D28's law`) points at nothing — the ledger holds the
  event, and where the sentence needs the noun the table's short name replaces it; no dead
  id survives on a live surface (his word at D80: no stray ids). **A bare foreign id
  qualifies** (D80's form): the census cannot tell a dead id from a live foreign one
  without the table, and a bare foreign id would ring the alarm forever. Ancestry: 034-F4
  served better — the pointer survives where it points somewhere; D81 applies — the
  converter carries every shape a rule consumes, and the hand list is D81's own speech
  clause (judgment decides) with 035's hand-strip as precedent; DOCTRINE §8's purge clause
  gains one sentence (⬡✓ 2026-09-02, landed) so the next D78 kill carries its citations.
  Nothing minted. Three corrections to the record ride the ruling:
  - **D67 is homed.** F11 and the inbox entry read DOCTRINE §10 and the tombstone; the
    duty lives in [`plans/TENDER.md`](TENDER.md) — *"Announce each ignition in this
    session as one line: charge · tier · isolation"* — the instrument D83 instantiated
    2026-09-01, and the pre-purge D73 bound it to the engine's spec ("the announce duty …
    binds the engine's spec", `git show d26bf37^:DECISIONS.md`). The table's D67 row
    reads `plans/TENDER.md, announce each ignition`; the inbox entry is rejected with this
    pointer.
  - **`DOCTRINE.md:531`'s `(D5)` is Belvedere's.** The pre-purge D73 wrote "the Steward
    gate unchanged (D5 — unparked by Felix's word only)", citing Belvedere's non-goals
    (`belvedere/README.md:176`, "**Non-goals, named (D5):** … the Steward"); agents' D5
    (non-goals v1) has no live citation. A fourteenth foreign id F4 did not list — and the
    one the table would have respelled wrong, to MAP §6. The row stands as record; the
    citation qualifies by hand.
  - **The count.** The office's census on the fence minus the tombstone: **125** dead
    hits — 83 inside shapes a regex consumes whole, 42 on 41 lines outside them, the hand
    list's ceiling; three or four more shapes (an id trailing a parenthetical, an id at a
    line boundary) bring it under thirty. The Builder re-runs at build.

- **F13 — LANDED 2026-09-02 (Builder · opus-high): the hand list, 42 edits, one commit.**
  Landed as `cea0648` **before** the converter's run (`9b1c3d1`), per the amended spec. Each
  row is one of the two sanctioned moves and no third: **(a)** the id and its connective go —
  legislative history is the ledger's; **(b)** where the id is a noun the sentence needs, the
  table's short name or the qualified id replaces it. Three rows deserve their reasoning named:
  `DOCTRINE.md:583`'s `D44's batching` takes **the lay's** batching, because the clause it
  leans on is §10's `the lay maximizes the run`, not §4's `gates are charges` (F15);
  `STANDARD.md:240`'s `D51's contract` takes **the waggle contract**, the thing D51 set and
  this very entry now carries; `docs/load-map.md:58`'s `why D45 (2026-08-08) moved` keeps the
  date and takes the row's short name as its subject. Nothing else was reworded.

  | file:line (at `b19d5fa`) | before | after |
  |---|---|---|
  | `canon/mantles/README.md:10` | `## The roster (D71)` | `## The roster` |
  | `canon/mantles/README.md:21` | - **The Dispatcher is dead** (D71) — tombstone | - **The Dispatcher is dead** — tombstone |
  | `canon/mantles/README.md:79` | mantle IS a Fixer** (D71; D26's law otherwise intact) — the default | mantle IS a Fixer** — the default |
  | `canon/mantles/README.md:161` | `canon/work/STANDARD.md` (D71 ⬡✓): one concept | `canon/work/STANDARD.md` (⬡✓): one concept |
  | `canon/mantles/architect.md:23` | sub-boards included (D45). | sub-boards included (DOCTRINE §4, any table that ⏎ staffs sessions is a board). |
  | `canon/mantles/architect.md:74` | binds every ⏎ Depends-on (D73) — an edge only | binds every ⏎ Depends-on (DOCTRINE §4, the edge test) — an edge only |
  | `canon/mantles/architect.md:79` | between Felix's judgment calls (D44): every foreseeable | between Felix's judgment calls (DOCTRINE §10, the lay): every foreseeable |
  | `canon/work/DOCTRINE.md:118` | is all a Fixer provably loads (D65; ⏎ birthplace: the arborist | is all a Fixer provably loads ⏎ (birthplace: the arborist |
  | `canon/work/DOCTRINE.md:121` | keeps its docs with itself (simmy D4). | keeps its docs with itself (simmy:D4). |
  | `canon/work/DOCTRINE.md:192` | is not permitted, ever (D71, lint-hard); | is not permitted, ever (lint-hard); |
  | `canon/work/DOCTRINE.md:194` | the typed absence, never a guess (D63 as ⏎ amended). Staffing guidance | the typed absence, never a guess. ⏎ Staffing guidance |
  | `canon/work/DOCTRINE.md:222` | `OPEN — DEFERRED <reason>` (D69, respelled by D71). The deferred | `OPEN — DEFERRED <reason>`. The deferred |
  | `canon/work/DOCTRINE.md:245` | dispatch time — D28's law, applied to sequence | dispatch time — the parallel-affordable law, applied to sequence |
  | `canon/work/DOCTRINE.md:263` | at dispatch time (snappy §6.8/D9: six charges | at dispatch time (snappy:D9, §6.8: six charges |
  | `canon/work/DOCTRINE.md:273` | becomes a new charge — never a rushed draft ⏎ (this repo's D4, generalized). Every charge doc | becomes a new charge — never a rushed draft. ⏎ Every charge doc |
  | `canon/work/DOCTRINE.md:360` | every batch-1 verdict survived (snappy D9). | every batch-1 verdict survived (snappy:D9). |
  | `canon/work/DOCTRINE.md:365` | overshot a rewind by 14 commits ⏎ (D48). | overshot a rewind by 14 commits. *(the wrapped line deleted)* |
  | `canon/work/DOCTRINE.md:500` | the default is machine tending, serial batches included (D43/D61's intent — their ⏎ Dispatcher wording is superseded by D71). **The interim truth, plainly:** the ⏎ Dispatcher mantle is dead (D71) and its successor — the flow engine, charge 020's ⏎ cornerstone made law at D73 — is built | the default is machine tending, serial batches included. **The interim truth, ⏎ plainly:** the Dispatcher mantle is dead and its successor — the flow engine, charge ⏎ 020's cornerstone — is built |
  | `canon/work/DOCTRINE.md:518` | scope-arm growth are its D11 ⏎ and D12, ratified canon-side) | scope-arm growth are belvedere:D11 ⏎ and belvedere:D12, ratified canon-side) |
  | `canon/work/DOCTRINE.md:521` | The engine's law: D10 ⏎ wholesale | The engine's law: belvedere:D10 ⏎ wholesale |
  | `canon/work/DOCTRINE.md:523` | the blessing covers the scope** (D12); | the blessing covers the scope** (belvedere:D12); |
  | `canon/work/DOCTRINE.md:534` | stays gated on ⏎ Felix's word alone (D5). | stays gated on ⏎ Felix's word alone (belvedere:D5). |
  | `canon/work/DOCTRINE.md:583` | — D44's batching, given its shape) | — the lay's batching, given its shape) |
  | `canon/work/DOCTRINE.md:589` | is the sin** (D64, amending D46): an uninstrumented | is the sin**: an uninstrumented |
  | `canon/work/DOCTRINE.md:622` | `ISSUES.md` (empty, header only — ⏎ D53), and the register line | `ISSUES.md` (empty, header only), ⏎ and the register line |
  | `canon/work/DOCTRINE.md:645` | this file (D71 ⬡✓ 2026-08-29) — | this file (⬡✓ 2026-08-29) — |
  | `canon/work/STANDARD.md:28` | the dispatch to run it (D11/D73) — a | the dispatch to run it (belvedere:D11; DOCTRINE §10, the flow) — a |
  | `canon/work/STANDARD.md:29` | the blessing covers the scope (D12). · | the blessing covers the scope (belvedere:D12). · |
  | `canon/work/STANDARD.md:91` | illegal ⏎ since D18; now has a legal successor | illegal; ⏎ now has a legal successor |
  | `canon/work/STANDARD.md:113` | Also a legal baton holder (D74): | Also a legal baton holder (DOCTRINE §11, the holder is written): |
  | `canon/work/STANDARD.md:240` | anatomy (killed; D51's contract molts) | anatomy (killed; the waggle contract molts) |
  | `canon/work/STANDARD.md:336` | \| bless (D11 — the review is the authorization) \| | \| bless (belvedere:D11 — the review is the authorization) \| |
  | `canon/work/templates/issues.md:4` | Entry format (D63): | Entry format: |
  | `canon/work/templates/ledger.md:10` | carry the fences (D63)⟩. | carry the fences (DOCTRINE §7, the Next law)⟩. |
  | `docs/load-map.md:19` | so dispatch works (D8's whole reason: | so dispatch works (the tier grid's whole reason: |
  | `docs/load-map.md:32` | ISSUES (the D49 sweep), then birthplaces | ISSUES (the ISSUES.md sweep), then birthplaces |
  | `docs/load-map.md:35` | the inbox (the D53 sweep) \| | the inbox (the ISSUES.md sweep) \| |
  | `docs/load-map.md:58` | and why D45 (2026-08-08) moved the rigid | and why the single-glance test (2026-08-08) moved the rigid |
  | `docs/the-city.md:33` | the Dispatcher is dead (D71), and the flow engine | the Dispatcher is dead, and the flow engine |
  | `docs/the-city.md:39` | \| the Fixer (D26/D71) — session-sized | \| the Fixer (the mantles README, the null mantle) — session-sized |
  | `docs/the-city.md:59` | **no permit needed** (the Fixer, D26/D71). | **no permit needed** (the Fixer — the mantles README, the null mantle). |
  | `docs/the-city.md:91` | The contract (D71, remaking D51): **"waggle me X" | The contract: **"waggle me X" |

  `⏎` marks a hard wrap the edit crossed. Verbatim anchors, each asserted unique before it was
  written — 42 anchors, 0 failures — so the list is auditable against `b19d5fa` line for line.

- **F14 — the counts, reconciled; the office's "fourteen" was eleven.** The census on the
  charge's fence reproduces F6 exactly: **152** dead hits over 53 ids. Minus the tombstone (11)
  and minus `BOARD.md`'s records (16), the working fence is **125** — F12's own number. Of those
  125 the table owns **114** (the 39 rows), and the remaining 11 are ids no row names: `D1` (a
  form shown), `D9` ×2, `D10`, `D11` ×3, `D12` ×3 (other buildings'), `D19` (a form shown, in
  ticks). Of the table's 114: the hand list took **45** (42 edits, three of them carrying two or
  three citations each), leaving **69**, which the converter consumed in 66 edits — measured at
  each stage, `b19d5fa` **114** → `cea0648` **69** → HEAD **0**. The **foreign**
  occurrences inside the fence are **eleven**, not fourteen: F12 computed 13 − 3 + 1 = 14, but
  13 already included `BOARD.md`'s three. Arithmetic, not a ruling — the Done-when's word is
  corrected here rather than met falsely.

- **F15 — a row names ONE home, and five entries legislated two.** The table's spine is right
  for most citations of an id and wrong for some, because a purged entry could carry clauses
  that now live in different sections. Five cases, all caught by reading the diff and all moved
  to the hand list before the run: **D45** (§5's single-glance test vs §4's *any table that
  staffs sessions is a board* — `architect.md:23`), **D73** (§10's flow vs §4's edge test —
  `architect.md:74`), **D44** (§4's gates are charges vs §10's *the lay maximizes the run* —
  `architect.md:79`, `DOCTRINE.md:583`), **D74** (§4's typed holds vs §11's *the holder is
  written* — `STANDARD.md:113`), **D63** (§4's board grammar vs §3's ISSUES entry format and
  §7's Next law — both templates). The converter cannot read which clause a sentence leans on,
  and it must not guess: **for the office** — the next D78 kill should record one `Home:` line
  **per clause**, not per entry, and the table's row type already has room for it. Two more
  citations the spine served badly were left machine-converted rather than reworded, because
  the pointer is right and the prose is not this charge's: `canon/mantles/README.md:136` now
  reads `third-party pre-authorization (DOCTRINE §5, pre-authorization)` — the pointer repeats
  the clause's own name — and `canon/mantles/README.md:7` opens a line with
  `(the global CLAUDE.md, THE AGENTS CANON).` A prose sweep is the office's, not a
  converter's.

- **F16 — the fixture caught two converter defects; both are now refusals with tests.**
  (a) **The partial line.** `(D69, respelled by D71)` has one shape the rules consume (D69
  leads) and one they do not (D71 behind `by`), so the first pass emitted `(respelled by D71)` —
  half a respell, which reads as finished work and is not. The rule now is **all or nothing per
  line**: a line carrying any unconsumed citation is reverted whole and *every* citation on it
  is reported, including the ones a shape did consume — a consumed citation on a reverted line
  is as unconverted as its neighbour, and a census that forgets it reads zero while the id
  stands. (b) **The wrapped strip.** `DOCTRINE.md:366` was the line `   (D48).` — the sentence
  it closed opened above it — and the strip left a line holding one full stop. A strip whose
  parenthetical opens the line is now refused. Both are pinned in the fixture. A third guard
  rides them: every seam a strip can leave (`  `, `( `, ` )`, ` .`, `()`) is **compared, not
  counted** against the source line and throws on an increase — a converter bug, not a doc
  defect (migrate.ts's own law), tested by handing the rules a home that spells to nothing.
  (c) **The masked fence.** The tick mask threaded backtick parity across lines and a ```
  fence marker is three backticks, so one fence opened a tick span the width of its block:
  `DOCTRINE.md:284`'s `(· **Branch:** <name> — when the charge runs in a worktree, D74)` — a
  real self citation inside the charge-doc skeleton — was invisible to the rules **and to the
  census**, which is the worse half: the bar read `0 unconsumed` while the id stood. Found by
  counting the fence's dead ids two ways (124 by the converter's own token regex, 114 owned +
  10 unowned) and chasing the one the CLI would not name. A fence marker now resets the parity,
  exactly as `migrate.ts` does — *a fenced line is a QUOTE to a structural rule and a DOCUMENT
  to a respell* — and the fixture carries a fenced citation beside a ticked form.

- **F17 — the drift alarm fired, on cue.** `STANDARD.md:336`'s graveyard row is mirrored
  verbatim in `doctrine/src/lexicon.ts` (`GRAVEYARD`), and `vocabulary.test.ts` asserts the two
  match row for row. Qualifying the row's `D11` to `belvedere:D11` turned that test red until
  the mirror followed. This is D81's third leg working exactly as written — *edit the law and
  the mirror goes red until the data follows* — and it is the reason the suite was allowed to go
  red mid-charge and the fix was the data, never the assertion.

- **F18 — two rows never fired, and no live config was touched.** **D67**'s only occurrence
  inside the fence is in the tombstone, which rule 4 never touches; **D5**'s only occurrence was
  Belvedere's (F12's correction) and qualified by hand. Both rows stand as record for the next
  kill, not as dead weight — the table is the register's memory now that D77 deleted the
  entries. Separately: of the 34 surfaces read, **none is in the sync set**. `canon/CLAUDE.md`
  and `canon/agents/*.md` — the paths that are live ×3 — carry zero dead citations, so this
  landing reached no account's config dir. `canon/mantles/` and `canon/work/` are read by path
  (MAP §4).

### The table — 39 rows, one per dead id the live law surfaces cite

Every home re-read at the desk; the quote is the sentence that carries the law today. The
id set is the census's 39 **minus** D9, D10, D11, D12 (belvedere's and snappy's, F4) and
D19 (a form shown, F5), **plus** D8, D27, D31, D60, D62 (cited only on `docs/*.md`, which
the census's file list omitted, F6). Not listed, and why: D1 and D19 are forms shown;
D2, D32, D34, D36, D41, D76 appear only as `BOARD.md` records; D15 and D22 are other
buildings'. A row's home is where the law lives — whether the citation strips or spells
it is F10's ruling.

| id | the entry | its home today | the home, quoted |
|---|---|---|---|
| D4 | composition model — what a session can't finish becomes a charge | `DOCTRINE §5, the charge doc` | "what a session cannot finish at quality becomes a new charge — never a rushed draft" (DOCTRINE.md:273) |
| D5 | non-goals v1 | `MAP §6, non-goals` | "Plugin sync. Multi-machine (clone-and-deploy makes it nearly free later; not designed now)." (MAP.md:102) |
| D8 | the full pre-minted grid | `the mantles README, the tier grid` | "load at **session start**, so a tier minted mid-session is invisible to the session" (README.md:40) |
| D18 | board law | `DOCTRINE §4, one ignitable unit` | "**A charge is one ignitable unit of work = one charge doc = one session.**" (DOCTRINE.md:165) |
| D25 | the naming law | `DOCTRINE §3, the naming law` | "**ALLCAPS for protocol singletons; lowercase-kebab for addressable siblings.**" (DOCTRINE.md:93) |
| D26 | the null mantle | `the mantles README, the null mantle` | "**a session with no mantle IS a Fixer** … the default worker under the global CLAUDE.md, staffed by tier alone" (README.md:79) |
| D27 | the silo law | `MAP §6, the silo law` | "Syncing sessions/history/agent-memory between accounts (the silo law: memory is a per-account cache…)" (MAP.md:97) |
| D28 | the parallel-affordable law | `DOCTRINE §4, parallel-safe is not parallel-affordable` | "**Parallel-safe is not parallel-affordable:** safety is correctness…; affordability is physics" (DOCTRINE.md:256) |
| D31 | the hive and the city — canon voice | `docs/the-city.md, the framing glossary` | "Law lives in the charters, the doctrine, and the standard — where this page and a charter disagree, the charter wins" (the-city.md:8-10) |
| D33 | the dream (`initial.md` → `dream.md`) | `DOCTRINE §3, the file set` | "dream.md       Felix's dream, when one exists — IMMUTABLE: never edited, only read" (DOCTRINE.md:62) |
| D37 | the Guild | `the global CLAUDE.md, THE AGENTS CANON` | "The canon repo `~/code/agents` defines the Guild — how Felix works with Claude" (canon/CLAUDE.md:77) |
| D39 | the Architect line — reserved, unminted | `MAP §10, the horizon` | "Until then the names are **reserved and unminted**: no charter, no summons, no preset may claim them." (MAP.md:148) |
| D42 | the baton law | `DOCTRINE §11, the baton` | "end with **the baton**: open escalations and the decision queue first, then exactly one action" (DOCTRINE.md:568) |
| D43 | serial chains are the tender's | `DOCTRINE §10, every batch has a tender` | "Every batch has a tender, and the default is machine tending, serial batches included" (DOCTRINE.md:495) |
| D44 | gates are charges | `DOCTRINE §4, gates are charges` | "A judgment step between charges — a merge review, a landing verification, a blessing checkpoint — is itself a charge" (DOCTRINE.md:237) |
| D45 | the summons line is load-bearing | `DOCTRINE §5, the single-glance test` | "a kickoff's first line is the summons line — `You are a <Mantle> at <tier>.`" (DOCTRINE.md:308) |
| D46 | the baton has one holder | `DOCTRINE §11, ambiguity is the sin` | "**Ambiguity, never plurality, is the sin** … an uninstrumented option, a menu with no recommendation, two holders" (DOCTRINE.md:584) |
| D48 | the merge-gate laws | `DOCTRINE §4, gates that merge` | "A gate that merges names its instrument verbatim in its kickoff — source branch, target, PR-vs-push — and verifies THEN merges." (DOCTRINE.md:247) |
| D49 | ISSUES.md — the canon repo's inbox | `DOCTRINE §3, the ISSUES.md law` | "the project's incident inbox — field reports and distillation candidates land there mid-work" (DOCTRINE.md:137) |
| D50 | the bulletin's worktree law | `DOCTRINE §9, late relocation` | "when a batch's parallel-isolation window closes … the bulletin may relocate into that worktree" (DOCTRINE.md:466) |
| D51 | the city, the hive, and the waggle | `docs/the-city.md, the framing glossary` | "This page explains the system; it never overrides it." (the-city.md:8) |
| D53 | ISSUES.md generalizes | `DOCTRINE §3, the ISSUES.md law` | "**ISSUES.md law:** the project's incident inbox — field reports and distillation candidates land there mid-work" (DOCTRINE.md:137) |
| D54 | the pre-authorization law | `DOCTRINE §5, pre-authorization` | "fetching, vendoring, installing beyond the repo's existing dependencies … only when the charge doc names it" (DOCTRINE.md:312) |
| D55 | the venue law | `DOCTRINE §10, the venue law` | "a charge that mints a disposable live venue — a VM, a container, a machine — deletes it at landing" (DOCTRINE.md:543) |
| D56 | the verdict law | `architect.md, the verdict law` | "A verdict about the system's behavior … cites the governing contract section it stands on: no citation, no verdict." (architect.md:106) |
| D57 | the batch is amendable mid-flight | `DOCTRINE §10, a running batch is amendable` | "the Architect commits the amended batch note and hands the tender the new charges as a message carrying the same instruments as the summons" (DOCTRINE.md:491) |
| D58 | the linking law | `DOCTRINE §3, the linking law` | "durable docs link the files they reference at first mention … one click beats a minute's hunt" (DOCTRINE.md:103) |
| D60 | GENESIS becomes MAP | `DOCTRINE §3, the file set` | "MAP.md         master doc: architecture, the bet, non-goals, agreements, Done when" (DOCTRINE.md:63) |
| D61 | the tending default | `DOCTRINE §10, every batch has a tender` | "the batch returns to Felix only at escalations and named ⬡-gates, resuming on his word where it paused" (DOCTRINE.md:512) |
| D62 | the Mentat — the sixth mantle | `mentat.md` | "The Mentat thinks beside the sovereign — the cross-project thinking partner, summoned to explore, never to produce." (mentat.md:3) |
| D63 | the schema fold + the molt clause | `DOCTRINE §4, the board grammar` | "**Resolution vocabulary:** gate, merge, and design charges resolve into the five states, the verdict riding the annotation" (DOCTRINE.md:231) |
| D64 | the baton grammar | `DOCTRINE §11, the three shapes` | "The action takes one of three shapes: **single** … **batch** … **fork**" (DOCTRINE.md:575) |
| D65 | v3 — the molt (the serialization ruling) | `DOCTRINE §3, the serialization law` | "prose artifacts are schema-markdown; field artifacts are data (flows); a field a machine consumer needs enters the doctrine grammar" (DOCTRINE.md:111) |
| D67 | dispatch visibility — the announce duty | **no live home** — F11 | "- **Announce every dispatch (D67):** as each agent fires, post one line in this session" (dispatcher.md:82 — tombstone, history) |
| D69 | PARKED is an annotation | `DOCTRINE §4, the DEFERRED annotation` | "**DEFERRED** — an annotation, not a lifecycle state: a laid charge deliberately set aside" (DOCTRINE.md:219) |
| D71 | the Guild's Standard | `STANDARD.md` (the whole book) | "One concept, one word, one part of speech; where an old word died, its entry names the successor." (STANDARD.md:13) |
| D73 | the flow doctrine | `DOCTRINE §10, the flow` | "A flow is a batch as data — the declared DAG the dispatch runs" (DOCTRINE.md:513) |
| D74 | the flow fold — the grammar | `DOCTRINE §4, typed holds` | "A landing's unresolved remainders are typed: `LANDED <date> — holds: <list>` — each hold an `E‹n›` or a `⬡ <text>`" (DOCTRINE.md:198) |
| D75 | the directives' scope splits on lifetime | `the global CLAUDE.md, ## SCOPE` | "Code built to last answers to all of this; code built to die … answers to §3 and the git conventions alone." (canon/CLAUDE.md:40) |

Six entries are split across two homes and the table names the spine; the second home, for
whoever builds the converter: **D5** MAP.md:97 (the sessions/history half) · **D28**
DOCTRINE §10:488 (the scheduling half) · **D45** DOCTRINE §4:161 (the venue clause, "any
table that staffs sessions is a board") · **D48** DOCTRINE §6:361 and §10:541 (targets are
read from the repo; a shared branch is never rewound) · **D63** DOCTRINE §§3/7/8 (the entry
format, the ledger head and the Next law, the molt clause) · **D74** DOCTRINE §11:571 and
STANDARD §7:216 (the written holder, the qualified id).

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/043-citation-respell.md and build it.
```
