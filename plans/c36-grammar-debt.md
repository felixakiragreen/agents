# 036 — doctrine v1.3: the grammar debt

**Status:** **LANDED** 2026-08-31 — seven items built, suite 80 → 87, one `Done when:` bullet
unmet and named (F2: a doc defect the fix exposed, in a building this charge fences) ·
**Depends on:** — · **Staffing:** Builder · opus-high ·
**Parallel-safe with:** G2 · **Blessed:** ⬡✓ 2026-08-31 in-session (grand-architect-19 sweep — the
three grammar rulings below are his, ruled at the desk).

## Mission

Seven evidenced parser/lint defects fold into `doctrine/` — the grammar debt left by
flow-1's abandonment (032's stranded holder scope) plus the sweep's accumulated
filings. When this lands, the parser reads what is written instead of inferring,
spent history stops redding live arms, and the typed nothing-owed close exists.

## Inputs — read before working (do not re-derive)

- `doctrine/` source + its suite; 031's findings
  ([plans/031-doctrine-defects.md](031-doctrine-defects.md)) for the arm patterns.
- [plans/032-flow-grammar.md](032-flow-grammar.md) (KILLED) — its Spec §the tokens
  carries the D74 holder grammar verbatim; only the holder scope moves here.
- DOCTRINE §§3/4/7/11 and STANDARD §7 **as amended 2026-08-31** — the law this
  parser must speak.
- The B26 record: `belvedere/plans/b26-baton-attention.md` F2 (the fourth filing of
  the nothing-owed ask) — read-only context; belvedere is fenced.

## Spec — seven items, each with its repro

1. **The spent mask** (⬡✓ 2026-08-31): the kickoff arm and the vocab arm exempt
   charges whose `**Status:**` opens LANDED or KILLED — history is whole, 025's
   live/spent rule is the ancestor. Repro today: `lint --vocab ~/code/agents`
   reports 11 hits in [plans/018-great-recut.md](018-great-recut.md), a LANDED doc;
   a LANDED charge's pre-door fence reds `kickoff.door` (the belvedere c1 case,
   inbox 2026-08-29).
2. **The written holder** (D74; DOCTRINE §11): the parser reads a baton's holder
   from the written form — `⬡`, `Felix`, a named session, `the dispatch` — and
   never infers. `classifyBaton` (`doctrine/src/parse.ts:433`) learns `⬡`. Repro:
   the root LEDGER's G4 baton is written `Baton — ⬡ →` and parses
   `holder: "session"` today; the lint's agents row reads `baton session ×1`.
3. **`Next: none — <why>`** (⬡✓ 2026-08-31; DOCTRINE §7): the typed nothing-owed
   close parses as its own kind; an entry carrying it owes no baton. Wild ancestor
   already in the corpus: the 2026-08-29 rig entry, "Next: none — the rig is
   current" (commit `cc1206f`).
4. **The body-text splitter**: only a line-leading `Next:` clause splits an entry;
   a mid-body mention never does. Repro: spacex-dashboard-c2 and manny ledger tails
   mis-split (belvedere's B26 filing, 2026-08-31).
5. **The `bv/*` register skip**: the building register skips a worktree checkout
   unless its branch adds a board the mainline lacks — keyed on *being a worktree*,
   never on the `worktree-agent-*` name shape. Repro (historical, latent since the
   worktree's removal): `.claude/worktrees/bv/029-summon-harness` at master's
   commit doubled every total — 2 buildings → 4, 84 rows → 168.
6. **The BOARD.md reader**: prove the walk reads a building's `BOARD.md` as a board
   doc (D78's new home) — a fixture building whose only board lives in `BOARD.md`
   parses. Likely already generic; prove it, don't assume.
7. **Fixtures per item, suite green**: every fix lands with the fixture that reds
   without it.

## Done when:

- [x] `bun test` in `doctrine/` green, new fixtures counted per item — paste the
      suite delta (80 → n).

```
$ cd doctrine && bun test
 87 pass
 0 fail
 362 expect() calls
Ran 87 tests across 2 files. [41.00ms]
```

  **80 → 87.** Seven new tests over six new fixtures — `conforming/ledger-clauses.md` (item 4,
  two tests: the fixture + the pre-doctrine bullet dialect inline), `conforming/ledger-batons.md`
  (items 2 and 3, one test each), `worktree/repo/` + its `bv/029-harness` checkout (item 5),
  `board-file/` (item 6), `vocab/plans/closed-board.md` and `kickoff/plans/killed.md` (item 1).
  **Every fixture reds without its fix**, measured by running today's suite against the src at
  this charge's ref:

```
$ git checkout 076a95d -- doctrine/src && bun test
(fail) … ledger — only a leading marker splits the body; a mention never does (036 item 4)
(fail) … ledger — the pre-doctrine bullet dialect still leads its line (036 item 4)
(fail) … baton — §11's holder is written, never inferred (036 item 2, D74)
(fail) … baton — `Next: none — <why>` owes nothing, and says so (036 item 3, §7)
(fail) … the register > a worktree checkout is skipped whatever its branch name is shaped like (036 item 5)
 59 pass · 6 fail          # the sixth is vocabulary.test.ts, which cannot load: no `isSpentWorkDoc`
```

  Items 1 (kickoff half) and 6 pass at the ref by design — the charge asked for proof, not a
  fix, and both are proven generic rather than assumed (F1).

- [ ] **UNMET, and it is a doc defect this charge exposed, not a tool failure (F2).**
      `bun doctrine/cli.ts lint ~/code/agents` → **1 failure**, in a building this charge
      fences. The `agents` building itself is 0, and the baton column reads the written hand:

```
$ bun doctrine/cli.ts lint ~/code/agents
 ok   agents  —  3 board(s) · 48/48 rows typed · ledger 2026-08-31 · baton felix ×3 · 47 kickoff(s) · queue 0
FAIL  agents/belvedere  —  1 board(s) · 53/53 rows typed · ledger 2026-08-31 · baton felix · 49 kickoff(s) · queue 0
      [1×] ledger.next — no "Next:" clause — the baton (§7)
           ~/code/agents/belvedere/LEDGER.md:3129: **2026-08-31 · Builder · opus-high (B26)** — …
 ok   agents/belvedere/v3  —  1 board(s) · 10/10 rows typed · ledger none · baton none · 9 kickoff(s) · queue 0

=== FAILURE CLASSES
     1  ledger.next
  1 failure(s) in 1 class(es)
```

  `baton session ×2` → `baton felix ×3` on the agents row: the written `⬡` is read (item 2), and
  the third instrument appeared when the tail stopped mis-splitting on its own quoted
  `Next: none — <why>` (item 4 — the charge's repro was live in the root ledger too, F3).

- [x] `bun doctrine/cli.ts lint --vocab ~/code/agents` reports 0 hits in
      `plans/018-great-recut.md` (paste before/after counts).

```
$ bun doctrine/cli.ts lint --vocab --verbose ~/code/agents | grep -c '18-great-recut'
11        # at 076a95d, this charge's ref
0         # now
```

  City-wide under this root the arm falls **47 → 36** `vocab.dead-word`; the eleven are exactly
  18-great-recut's, and no other file's count moved. One `vocab.spelling` appeared during this
  session from outside it — `plans/037-removal-arm.md:83` "behaviour", laid by the parallel G2
  session at 11:18 — filed, not fixed (F5).

- [x] `bun doctrine/cli.ts parse --json ~/code/agents` shows the G4 baton
      `"holder": "felix"` — paste the excerpt.

  The tail is **G2's**, not G4's: G2 closed on this same checkout at 11:18 while this charge was
  building. Same written form, same reading — `Baton — ⬡ → fork — rule E1, then: ignite 037 ∥
  ignite 036`:

```
$ bun doctrine/cli.ts parse --json ~/code/agents
{ "holder": "felix",
  "instruments": [ {"kind":"row","row":"037"}, {"kind":"row","row":"037"}, {"kind":"row","row":"036"} ] }
```

## Out of scope

- Any renderer or deck work — belvedere is fenced and retiring.
- The history respell (DEFERRED, Felix's word) and building-side repairs (the
  city's pre-door fences are each building's own sweep).
- New lint arms beyond the named seven. Creep is a bug.

## Findings

*(evidence-grade: every claim carries the command and output that proved it)*

**F1 — item 1's kickoff half was already law; the whole gap was the vocabulary arm's board
half.** `isLiveWorkDoc` arms the door and wear lines only on OPEN / IN FLIGHT / BLOCKED, and
`fixtures/kickoff/plans/landed.md` has pinned that since 031 — the belvedere c1 case the charge
cites was a doc whose own Status *read OPEN against a LANDED board row*, repaired at the
migration sweep 2026-08-30, and never a parser defect. The live defect was one line in
`lint.ts`: a charge that tends a wave carries a staffing table, so the register files it as a
**board**, and `lawSurfaces()` took `b.files.boards` whole while filtering `b.files.workDocs`
through the live rule. `plans/018-great-recut.md` landed on 2026-08-29 and was still reporting
eleven dead words a month later. The fix is `isSpentWorkDoc` — **not** the negation of
`isLiveWorkDoc`: a doc carrying no Status line (`MAP.md`, `CLAUDE.md`, `BOARD.md`) says nothing
either way and stays a law surface. `killed.md` joins `landed.md` so the kickoff arm's proof
covers both spent states, as the corpus does (032 is KILLED).

**F2 — the splitter exposed a real dropped baton it had been hiding, and it is the one unmet
bar.** `belvedere/LEDGER.md:3129` — B26's own entry — writes a conforming §11 baton paragraph
and **no `Next:` clause at all**. The old splitter manufactured one out of the entry's own
prose: F5's sentence, *"a ledger entry that mentions `Next:` in its own body mis-splits"*,
carries the marker inside ticks, and the parser read the rest of the sentence as the handoff.
With code masked there is nothing left to read, and §7's arm fires honestly:

```
$ bun doctrine/cli.ts lint ~/code/agents
      [1×] ledger.next — no "Next:" clause — the baton (§7)
           ~/code/agents/belvedere/LEDGER.md:3129
```

The repair is one line — a `Next:` clause naming the baton the entry already wrote, e.g.
`Next: the baton below; B24 is ignitable.` — and it is **not mine to make**: this charge's own
Out of scope reads *"building-side repairs … are each building's own sweep"*, and belvedere is
fenced and retiring. Filed here and to `ISSUES.md`; whoever runs belvedere's close-out owns it.
Nothing was mis-armed by it: the mis-split half still contained "Felix", so the holder read
`felix` either way — the *text*, its name and its instruments were read off bytes the writer
never meant, exactly as B26 F5 said.

**F3 — the charge's own repro was live in the root ledger, not only in spacex and manny.** The
grand-architect-19 entry describes D78 by quoting the token it minted — `` `Next: none — <why>` `` — so the
agents tail split on its own quotation and handed a clause beginning `none — <why>` (§7 + …`.
Two instruments were found in the wreckage; the correct clause carries three. That is why the
agents row moves `baton session ×2` → `baton felix ×3` and not merely `session` → `felix`: item
2 fixed the hand, item 4 fixed what the hand was holding. Measured across the eight ledgers of
the city (399 entries), the clause rule moves `next` on **21** entries and loses it on exactly
**one** — F2's.

**F4 — `Baton.holder` gained two members and the glass has no branch for either.** The union is
now `felix | session | dispatch | none | prose` (§11 names three written hands; `none` and
`prose` are statements about the clause). `belvedere/glass/pages.ts:347` reads
`holder === 'session' ? 'green' : holder === 'felix' ? 'purple' : 'orange'`, and orange is the
dropped-baton tone — so a `the dispatch` baton and a typed nothing-owed close both render as
**dropped** today. `glass/rail.test.ts:419`'s rank has the same two-way shape. Filed, not
chased: belvedere is fenced here and retiring. Whoever salvages the v3 engine inherits it, and
the fix is a table, not a branch.

**F5 — one spelling drift arrived from outside this charge while it ran.**
`plans/037-removal-arm.md:83` writes "behaviour"; the doc was laid by the parallel G2 session at
11:18 and is the only `vocab.spelling` hit in this repo. Filed to `ISSUES.md`, not fixed — an
ungranted side-quest is still a side-quest even when it is one letter.

**F6 — the pre-doctrine bullet dialect was leaving its own closing `**` in the parsed clause.**
`- **Next:** Felix gives the go.` parsed as `** Felix gives the go.` under the old reader and
would have kept doing so under the new one. A `**` with a space behind it is a closing
delimiter and can never open the clause's own emphasis, so it is stripped — `**C3 is
ignitable**` (a real bold opening, no space) is untouched. Sixteen hexwright and whiteboardy
entries in the wider city read their clauses honestly for the first time; none of them is under
this lint root.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 + ~/code/agents/BOARD.md
and execute the charge at ~/code/agents/plans/036-grammar-debt.md.
```
