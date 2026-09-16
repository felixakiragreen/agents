# 051 — the absolutes sweep

**Status:** LANDED 2026-09-15 — 192 → 2 (STANDARD §8's mention), lint identical both arms, suite 197; findings F1–F8 below · **Depends on:** — · **Staffing:** Architect · opus-high · **Parallel-safe with:** 050 · **Blessed:** Felix, 2026-09-15, in the room (grand-architect-26): ⬢2

## Mission

The live canon speaks D89's language law: *always* and *never* mark what holds in every possible reading — change, permission, prediction — and the rest of the law states its defaults with their exceptions named. At the lay the live canon carried 180 *never* and 19 *always*; the global file's thirteen and the pinned formulas 8 and 26 were respelled at the desk. This charge rules the rest one by one, on 030's form — the master-doc prose sweep: a census, the rulings F1–Fn, the survivors listed by name with their reasons.

## Inputs — read before working

- The law: the global file's head (`canon/CLAUDE.md`), D89, STANDARD §8 (*Absolutes are reserved*).
- `plans/030-master-doc-prose.md` — the sweep's form: census, rulings, named exemptions; its F1–F7 bind the next sweep.
- The surfaces: `canon/GUILD.md`, `canon/work/DOCTRINE.md`, `canon/work/STANDARD.md`, `canon/mantles/*.md` (the tombstone `dispatcher.md` is history — untouched), `canon/work/templates/*.md`, `canon/BUILDINGS.md`, `plans/TENDER.md`, `plans/CODA.md`, `MAP.md`.
- The census at the lay, over those surfaces: `grep -o -w -i -E "never|always" ‹surfaces› | sort | uniq -c` — 166 never · 13 Never · 1 NEVER · 18 always · 1 Always.
- Known, do not re-derive: history and voice are fenced — `LEDGER.md`, `ledger-archive.md`, `LOG.md`, `log-archive.md`, `SAPHO.md`, every Findings section under `plans/`, `belvedere/` — their words stay; the charters' shared summons paragraph is word-identical across five charters (the mantles README, the charter template) and respells in all five at once or in none; the global file's mirror clause already reads *still apply*.

## Method

The rules, pre-chewed:

1. A contrast — `X, never Y` — reads `X, not Y`.
2. Emphasis — *never edited*, *always apply*, *NEVER switched* — drops, or restates in the declarative present: *ids are not reused; a reuse is a defect*.
3. A default with exceptions states the default and names the exception in the same sentence.
4. A true absolute keeps its word and is listed in Findings with the reason it holds in every reading; the expected count is small — the office found none in the canon's own law at the lay, and his one candidate at the desk, tabs, died inside the sitting.
5. A pinned formula is not changed here — 8 and 26 were respelled at the desk and ride 050's converter; any other formula that reads as an absolute is filed as a candidate for the office, untouched.
6. A token's definition (`⬡-gate`, `Next: none`, the lifecycle) is form, not speech — untouched.

Commit per file, in Felix's git style; `doctrine lint .` and `doctrine lint --vocab .` captured before and after.

## Done when:

- `grep -c -w -i -E "never|always"` over the surfaces reads exactly the survivors named in Findings, each with its reason.
- `doctrine lint .` before and after pasted, identical; `--vocab` before and after pasted, every delta named.
- The charters' shared paragraph still word-identical across the five — the diff of the five paragraphs pasted, empty.
- F1–Fn under this doc: the census, the rulings by rule, the survivors, the formula candidates for the office.

## Out of scope

- History and voice surfaces (above); other buildings' master docs — they adopt at their next Architect session with the rules here.
- Any change of meaning: a sentence whose default is unclear without an exception the writer did not name is a finding for the office, not a guess.
- An absolutes lint arm — after this sweep shows the pattern.

## Lanes

Red: the canon edits — blessed by his ⬢2 on this doc at the lay (the blessing covers the scope); a change of meaning is outside it and files as a finding, not an edit.

## Findings

**LANDED 2026-09-15.** 192 → 2 over the twenty-one surfaces; the two are one line, STANDARD §8's mention of the words it reserves. Sixteen commits, one per file (`2ce6c74` the shared paragraph … `5ea1c18` the doctrine), plus the side-quest `be6fc59`. Run at fable-high — the summons' tier governs (the charter's tier guard); the doc's cell reads opus-high.

### Done when — measured

**1. The census reads the survivors.** `cat surfaces | xargs grep -o -h -w -i -E "never|always" | sort | uniq -c` → `1 always · 1 never`; `grep -c -w -i -E "never|always"` per file → `1 canon/work/STANDARD.md`, every other surface 0. The one line is F3's.

**2. Lint identical.** `doctrine lint .` before and after, `diff` empty: 20 failures in 2 classes (19 `board.cell-cap`, 1 `ledger.merged` — belvedere's, standing), 173 warnings (`ledger.entry-cap`). `doctrine lint --vocab .` before and after, `diff` empty: 68 failures in 3 classes — 48 `vocab.dead-word` (4 in `plans/050-field-asks.md`, "the register" bare; 32 belvedere; 12 belvedere/v3), the same 19 + 1. Deltas: none.

**3. The shared paragraph.** The five charters' paragraph extracted by `grep -o "worn by explicit summons only.*conventions still apply\."`, diffed pairwise against the Architect's: builder, digger, grand-architect, mentat — identical, diff empty. The paragraph: *worn by explicit summons only; the summons names your tier — a model that contradicts it is a stop-and-tell-Felix before any work, and effort you cannot see you trust. While worn, this charter overrides the global CLAUDE.md where they conflict on workflow; personality, code style, and git conventions still apply.*

**4. F1–F8 below.**

### F1 — the census at execution

Over the twenty-one surfaces at HEAD `778c9b6`: 164 *never* · 9 *Never* · 1 *NEVER* · 18 *always* = **192**. The lay's 199 is not reproducible: no surface changed between the lay commit (`94182dd`) and HEAD (`git diff --stat 94182dd HEAD -- ‹surfaces›` empty); `canon/agents/` carries 0, the tombstone `dispatcher.md` 14, the global file 2 (its own mention). Per file: DOCTRINE 69 · STANDARD 17 · architect 13 · mentat 13 · fixer 12 · mantles README 12 · grand-architect 11 · builder 6 · BUILDINGS 6 · GUILD 5 · digger 4 · MAP 3 · templates 6 (charge 1, claude-md 2, decisions 1, map 2; board, issues, ledger 0) · TENDER 15 · CODA 0.

### F2 — the rulings by rule

190 ruled, 2 survive (F3). **Rule 1**, a contrast reads *not*: 110 — counted on the word diff (`git diff --word-diff=porcelain`, pairs `-never` / `+not`). **Rule 2**, emphasis dropped or restated in the declarative present: 77 — the restatements longer than a word are F4. **Rule 3**, a default with its exception named in the sentence: 3 — the Architect's canon trigger, the wear law's *only by a new summons*, the Builder's fence (its grant sentence already stood). **Rule 4**, true absolutes kept: **0**. **Rule 5**, formulas: none of the twenty-six pinned strings carries either word after 8 and 26, and none reads as an absolute — 0 candidates. **Rule 6**, token definitions untouched: `⬡-gate`, `Next: none`, the lifecycle words; the two *Never the leading token* sentences respelled *Not the leading token* — speech about the token, not the token. Also under the knife: *, ever* dropped in the two staffing sentences (DOCTRINE §4, STANDARD §5) and *to anyone, ever* in the Fixer's record law — outside the census, inside the sentences being rewritten.

### F3 — the survivors

`canon/work/STANDARD.md:103` — *on a law surface \*always\* and \*never\* mark what holds in every possible reading*. Two occurrences, one line. Reason: a mention, not a use — the law naming the words it reserves, in italics as the global file's head spells them (§8's own use/mention rule).

### F4 — the restatements, for his eye (proposed; his ⬢ owed)

His ⬢2 blessed the scope. A contrast to *not* changes nothing; a restatement is where meaning could drift, so every one longer than a word is listed, old → new:

- **architect.md, the ruling law:** *Never pick the reading you prefer.* → *Your preference is not a citation.* — the law's own frame (no citation, no ruling).
- **architect.md, escalation:** *the Architect never patches canon* → *the Architect patches no canon on its own word* — rule 3; the exception was live at execution: this charge is an Architect editing canon under his ⬢2 on a doc the office laid.
- **fixer.md:** *## What never bends* → *## What does not bend*; *The record never lies — to anyone, ever. Evidence is never faked, a status never claims what didn't happen, a test never reports green that ran red.* → *The record is true — to anyone, at any speed. Evidence is not faked, a status claims only what happened, a test that ran red reports red.*; *Speed bends process; it never bends truth.* → *Speed bends process, not truth.* The strongest sentence in the canon: if any law after tabs is his candidate for a true absolute, it is this one. Ruled by D89's text (*no other law has qualified*) and left to him.
- **fixer.md:** *Never dispatched by anyone but Felix; never self-adopted* → *Dispatched by Felix alone; not self-adopted*.
- **mentat.md:** *proposes, never blesses; drafts, never executes* → *proposes and blesses nothing; drafts and executes nothing*; *a summons it never runs* → *a summons another window runs*; *never boot the whole city; read what the thought needs* → *read what the thought needs, not the whole city*.
- **grand-architect.md:** *never crush a working pattern by fiat* → *a working pattern is not crushed by fiat*; *his word first, always* → *his word first*.
- **mantles README:** *Never escalate tier to compensate for incomplete orders* → *A tier is not escalated to compensate for incomplete orders*; *never switches mantles without a new summons* → *switches mantles only by a new summons*.
- **DOCTRINE §4:** *Charges are always staffed — an unstaffed charge is not permitted, ever* → *Every charge is staffed — an unstaffed charge is not permitted* (STANDARD §5 and §8's quotation of it in step); *A sub-slot whose record history never held* → *A sub-slot with no record behind it*; *boards point, never duplicate* → *boards point, none duplicates*.
- **DOCTRINE §10:** *the shared checkout's branch is NEVER switched* → *the shared checkout stays on its branch* (rule 2's own example); *ambiguity never authorizes and never advances* → *authorizes nothing and advances nothing* (belvedere:D10 restated here; the sibling's entry keeps its words); *the standing set that is never swept* → *the standing set the sweep leaves*; *the tender never classifies* → *classifies nothing*.
- **DOCTRINE §11–12:** *reads the written holder, never infers it* → *and infers nothing*; *there are always some* → *a founding has some*; *membership is never inferred* → *declared, not inferred*.
- **STANDARD:** *a bench baton is never paid from the desk* → *is not payable from the desk*; *one letter never serves two kinds in one building* → *a letter serves one kind per building*; *hosts that are never walked* → *unwalked hosts*; *the law and the city never disagree on a name* → *agree on every name*.
- **GUILD:** *— always.* dropped from the filing sentence (the exception is the Fixer's untracked ground, in its charter); *The first two minutes, always.* → *The first two minutes.* (the exception is the Mentat's orientation tax); *a session you'll never meet* → *you won't meet*; the dispatched stanza *agents you will never meet* → *will not meet* — TENDER.md here in step.
- **templates:** *immutable, never edit it* → *immutable, not a session's to edit*; *never edit that file* → *leaves it unedited*.

### F5 — candidates for the office, untouched

- ***immutable*** (`templates/claude-md.md`, the dream line): D89's birthplace names the word — *the swordmaster founding bound his own hand under immutable*. Outside the census and a meaning change — the office's, with the dream law (DOCTRINE §12) beside it.
- **The parser speaks the old spellings:** `doctrine/src/parse.ts:83` *charges are always staffed (D71)*, `parse.ts:125` *PENDING never leads (D63c)*, `lint.ts:162` and `vocabulary.ts:204` *reported, never auto-fixed* — the lint prints the last in every run. Code, 050's lane.
- **Siblings:** stigmergon's `plans/TENDER.md` carries the old stanza and the instrument's fourteen; every other building's master docs — they adopt at their next Architect session with the rules here. The Dispatcher tombstone (14) is history, fenced.
- **The lint arm** the charge names as the follow-on: the pattern is `, never X` → `, not X` in 110 of 190 — mechanical, a converter's shape; the other 80 wanted a sentence and a reader. An arm that flags and does not fix is the honest scope.
- **Formula candidates:** none.

### F6 — the side-quest

This building's own `CLAUDE.md` is not in the surfaces and carried two: *unsigned canon never touches them* → *does not touch them*; *branch master, never main* → *not main*. Fixed under the Architect's standing grant, own commit `be6fc59`, filed here.

### F7 — the parallel state, noted

`canon/CLAUDE.md` sat modified and uncommitted in the shared checkout through the session (the approval scale's rungs gaining the ⬢ mark — 050's item or his hand); left alone, added by no commit here. The office's Log commit `531621a` landed mid-session. At close, 050's Builder was live in the same checkout — five `doctrine/src` files modified, uncommitted, untouched here — so the after-lint and the suite ran against whatever parser source stood at that moment; the lint diff was empty regardless. No collision on any file this charge committed.

### F8 — the machine did not move

`bun test` in `doctrine/`: 197 pass, 0 fail, 826 expect() calls. No lint pins a canon sentence — `grep` of `doctrine/src` for the respelled phrases finds only the messages in F5.

---

**Kickoff (verbatim):**

```
You are an Architect at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/canon/CLAUDE.md, and execute the charge at ~/code/agents/plans/051-absolutes-sweep.md.
```
