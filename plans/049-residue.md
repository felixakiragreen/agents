# 049 — doctrine v1.4 — the residue

**Status:** OPEN — laid 2026-09-09 · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** Felix, 2026-09-09, in the room (grand-architect-25): *"lay."*

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

- [ ] `bun test` green from `doctrine/` with one fixture and one control per spec item (eight pairs); the control run on the pre-049 source reds exactly the new law tests and nothing else — both outputs pasted.
- [ ] The census before and after (`bun lab/045/census.ts`): the untyped ⬡ tail loses the seven words' 33 and the determiner's 8; the anchor's 28 lines are read; **the table of the 28** — entry · before-holder · after-holder — pasted, every after-holder the line's written one.
- [ ] `doctrine boot ~/code/agents`: no `## Board — canon/work/DOCTRINE.md` line; `doctrine lint ~/code/agents`: 20 failures (belvedere's), warnings unchanged, `board docs` 5 → 4 the only total that moves — pasted, with the pre-049 totals beside them.
- [ ] `doctrine lint ~/code/stigmergon` before and after: 0 → 0 failures, the tail's baton line identical; any class that newly fires on a live building is named here and left red — an arm is never weakened from this charge (G4's ruling ii).
- [ ] `doctrine migrate --summary` at snappy and at manny: 0 round-trip violations, dry run only, nothing written in either tree (`git -C <root> status --short` pasted, unchanged); the control: `doctrine migrate --summary ~/code/agents` still reads *already in the current grammar*.
- [ ] `doctrine/README.md`: the type table's words and the law-book fence in its voice, ≤ 10 lines.

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

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/049-residue.md to its bar.
```
