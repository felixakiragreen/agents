# 045 — the baton's fields

**Status:** LANDED 2026-09-08 → [findings F1–F7](#findings); the four fields typed, suite 139 → 143, census over 265 entries, lint identical before/after · **Depends on:** 044 · **Staffing:** Builder · opus-high ·
**Blessed:** Felix, 2026-09-08, in the room (grand-architect-24): fork (b).

## Mission

The parser types what DOCTRINE §11 already writes into a baton and the room already
needs: **`Baton.shape`** (single · batch · fork), **`Baton.recommendation`** (a fork's
named option, or taste), **`Baton.type`** (what a ⬡-baton requires of Felix — mental ·
visual · bench), **`Baton.named`** (which session holds it). `doctrine boot`'s baton line
(044) prints them; stigmergon's docket renders them the day they land (D10, one parser —
the markers are never read render-side). No new mark enters the grammar: every field
derives from what the record writes today.

**Birthplaces** — four inbox entries, all field-born, swept 2026-09-08:
- stigmergon 029's Architect (2026-09-02), the fifth filing of Belvedere B3 F4's ask:
  *"stigmergon's docket (`docs/docket.md` §5) renders a `Baton` and needs its shape
  (`single` / `batch` / `fork` — §11's own markers) and, for a fork, the recommended
  option … Until then the docket renders the clause verbatim and badges nothing."*
- Felix at stigmergon's phase-3 pass (2026-09-02): *"By type I mean what is required of
  me"* — **mental** (a decision to make), **visual** (an interface to look at or drive),
  **bench** (physical testing; a simulator is not enough) — *"a bench baton cannot be paid
  from the desk."* The office ruled the spelling: the type derives from the ⬡-action's
  leading noun, no new token (STANDARD §6, `bench`, minted 2026-09-08).
- stigmergon 034-F2 (G7's Architect, 2026-09-02): *"every named session is `session`; the
  name lives only in the lead's text … which session holds the baton left the glass."*

## Inputs — read before working

- DOCTRINE §11 (the baton's grammar: holder written; shapes single / batch / fork; a fork
  names a `recommendation:` or marks the call taste; a ⬡-gate names what he must look at)
  and §7; STANDARD §3 (**baton**), §1 (bless · rule · kill), §6 (**visual pass**, **bench**
  — the three types).
- `doctrine/src/parse.ts` — `BATON_LINE`, `writtenHolder`, `classifyBaton`, `batonFails`,
  `Instrument`; `doctrine/src/grammar.ts` (where the word tables live);
  `doctrine/test/doctrine.test.ts` (the baton cases); `doctrine/cli.ts` and the `boot`
  render landed by 044.
- The city's ledger tails as the census ground: `~/code/agents/LEDGER.md`,
  `~/code/stigmergon/LEDGER.md`, `~/code/universal_robots_sdk/cap-mega/simmy/LEDGER.md`,
  `~/code/hexwright/LEDGER.md` — the record's actual spellings of the markers (e.g.
  stigmergon's `**Baton — ⬡ → single —** pass **G22**`, this repo's
  `Baton — ⬡ → rule formula 26 … recommendation: bless`).
- stigmergon `docs/docket.md` §5 — the consumer; read for the fields, not the pixels.

## Spec

The `Baton` type gains four fields; nothing existing changes shape:

```ts
shape: 'single' | 'batch' | 'fork' | null
recommendation: { kind: 'instrument'; index: number } | { kind: 'text'; text: string } | { kind: 'taste' } | null
type: 'mental' | 'visual' | 'bench' | null
named: string | null
```

- **shape** — the word that opens the action after the arrow, followed by an em-dash:
  `single —` · `batch —` · `fork —`, bold and whitespace tolerated
  (`**Baton — ⬡ → single —** …`). Unmarked → `null`, never inferred: an unmarked baton
  predates the markers or is malformed, and the existing `ledger.baton` arm keeps its job.
- **recommendation** — read only when `shape === 'fork'`: the text after a
  `recommendation:` marker (case-insensitive) to the end of its sentence or line. It
  resolves to `{instrument, index}` when it names an instrument the baton carries — an
  `ignite ‹id›` row's id, or a fenced summons's mantle word; otherwise `{text}` verbatim.
  `taste` after the marker, or the clause marking the call taste (`the call is taste`,
  `marked taste`) → `{taste}`. Absent → `null`. **New lint, `ledger.baton` (fail):** a
  tail whose baton is a fork with `recommendation === null` — §11: *a menu with no
  recommendation is a dropped baton.* Tails only, as today; history is never linted.
- **type** — read only when the holder is ⬡: the first word (or two) of the action after
  the shape marker, bold stripped, case-folded, looked up in `BATON_TYPES` in
  `grammar.ts` — **mental:** rule · ruling · bless · blessing · kill · choose · choice ·
  read · verify · decide; **visual:** pass · visual pass · smoke · look · watch · open ·
  drive; **bench:** bench. Anything else → `null`, and the census lists the word. The
  table is data, cited to STANDARD §1 and §6 in its comment; the office extends it from
  the census — the Builder adds no word the record does not show.
- **named** — the holder slot's text when `holder === 'session'`, bold and whitespace
  stripped (`Baton — builder-one-03 → …` → `builder-one-03`); `null` for ⬡, the dispatch,
  none, prose.
- **`doctrine parse --json`** carries the fields. **`doctrine boot`**'s baton line becomes
  `Baton — ‹holder›[ ‹named›][ · ‹shape›][ · ‹type›] → ‹instruments | none — ‹why› | dropped›`,
  each optional part printed only when non-null.
- **The census** — `lab/045/census.ts`, runnable: over every ledger entry of the four
  buildings named in Inputs (all entries, not only tails), count: entries with a baton
  line · with a shape marker, by shape · forks with a recommendation, by kind · ⬡ batons
  typed, by type · ⬡ batons untyped, with the leading word listed and counted. Pasted in
  the Findings — the untyped list is the finding the office reads.

## Done when:

- [x] `bun test` green from `doctrine/` with new cases: each shape; a fork with an
      instrument recommendation, a text one, taste, none (→ the new `ledger.baton` fail on
      a fixture tail; a control tail with a recommendation passes); each type and an
      untyped ⬡ action; a named session vs ⬡ vs the dispatch; an unmarked baton → all
      four null. Output pasted.

      Four new cases in `test/doctrine.test.ts`, one new fixture
      (`fixtures/conforming/ledger-baton-fields.md`, nine entries — every shape, every
      recommendation kind, every type, a named session, the dispatch, an unmarked baton,
      and a fork with no recommendation as the tail). At HEAD `00aa1e0`, from `doctrine/`:

      ```
      $ bun test
      bun test v1.3.10 (30e609e0)
       143 pass
       0 fail
       664 expect() calls
      Ran 143 tests across 4 files. [245.00ms]

      $ bun test -t "baton"
       12 pass
       131 filtered out
       0 fail
       52 expect() calls
      ```

- [x] `doctrine parse --json ~/code/stigmergon` — the tail's baton with the four fields,
      pasted. (`text` is the entry's whole `Next:` clause — truncated by the command, so
      the paste is the run.)

      ```
      $ bun doctrine/cli.ts parse --json ~/code/stigmergon | jq '.baton | .text |= (.[0:44] + " …")'
      {
        "holder": "felix",
        "text": "**Baton — ⬡ → single —** pass **G22**, his p …",
        "instruments": [],
        "shape": "single",
        "recommendation": null,
        "type": "visual",
        "named": null
      }
      ```

- [x] `doctrine boot ~/code/stigmergon` — the baton line, pasted, showing shape and type.

      ```
      $ bun doctrine/cli.ts boot ~/code/stigmergon | grep '^Baton'
      Baton — ⬡ · single · visual → no instrument

      $ bun doctrine/cli.ts boot ~/code/agents | grep '^Baton'      # before this entry
      Baton — the dispatch → ignite 045
      ```

      The second is the contrast the render owes: 044's tail marked no shape, so the line
      prints none. This session's own entry marks one, and the same command now reads
      `Baton — the dispatch · single → ignite 046`.

- [x] The census pasted (the table and the untyped words). `lab/045/census.ts`, run at
      HEAD `00aa1e0`:

      ```
      $ bun lab/045/census.ts
      # 045 — the baton census

      | building | entries | batons | writes "Baton —" | baton lines read | shape marked | ⬡ batons |
      |---|---:|---:|---:|---:|---:|---:|
      | agents | 114 | 114 | 33 | 31 | 6 | 59 |
      | stigmergon | 107 | 107 | 71 | 45 | 21 | 41 |
      | simmy | 33 | 33 | 0 | 0 | 0 | 12 |
      | hexwright | 11 | 11 | 0 | 0 | 0 | 4 |
      | **all four** | **265** | **265** | **104** | **76** | **27** | **116** |

      shape, by kind: batch 16 · single 9 · fork 2
      fork recommendations, by kind: text 2
      ⬡ batons typed, by type: mental 8 · visual 1
      ⬡ batons untyped, by leading word: (no baton line) 57 · ignite 25 · your 6 · the 5 ·
      summon 3 · once 2 · a 1 · batch 1 · both 1 · fork 1 · is 1 · paste 1 · resume 1 ·
      review 1 · rulings 1
      ```

- [x] `doctrine lint ~/code/agents` and `~/code/stigmergon` re-run — unchanged, or every
      new `ledger.baton` named with its excerpt (never suppressed).

      Unchanged, and measured rather than asserted: the pre-045 tree (`3284d58`) checked
      out into a scratch worktree and run against the same live docs, its report diffed
      against this tree's.

      ```
      $ git worktree add -q "$PRE" 3284d58
      $ for b in ~/code/agents ~/code/stigmergon; do
      >   diff <(bun "$PRE/doctrine/cli.ts" lint "$b" | tail -14) <(bun doctrine/cli.ts lint "$b" | tail -14) && echo IDENTICAL
      > done
      --- /Users/felix/code/agents
      IDENTICAL
      --- /Users/felix/code/stigmergon
      IDENTICAL
      ```

      Both tails stand: agents' is `the dispatch → ignite 045`, stigmergon's a `single`.
      Neither is a fork, so the new arm fires on neither — 19 `board.cell-cap`
      (belvedere's) and 1 `kickoff.summons` (stigmergon's, the filing already in its
      inbox) are the same failures the record names.

## Out of scope

- The docket's render — stigmergon's.
- Any new token or mark in the grammar; STANDARD or DOCTRINE text (the office's — `bench`
  is minted already).
- Changing `Instrument`, `BatonHolder`, or the existing `ledger.baton` semantics beyond
  the one fork rule above.
- Linting history — tails only, as the arm stands.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

**F1 — 28 baton lines in the city are invisible to the reader, and that is the census's
biggest number.** `BATON_LINE` anchors at the start of a line (`/^[ \t]*\**Baton\**…/m`),
but the record writes the baton inside the `Next:` clause as often as under it. 104 entries
write `Baton —`; the reader reads 76 of them. The 28 lose all four new fields *and* their
written holder — `classifyBaton` falls through to the pre-D74 prose inference for every one.
26 are stigmergon's, its house dialect:

```
$ bun lab/045/census.ts        # its last section lists all 28
## 28 baton lines the line rule does not reach

- agents 2026-08-29 L1721 — amended (all ⬡✓ in-session). Next: Baton — ⬡ → batch — (a) ignite 033 (kickoff in
- stigmergon 2026-08-31 L88 — MAP, D13, the specs. Next: **Baton — ⬡ → batch —** ignite 004 (kickoff in
- stigmergon 2026-09-01 L819 — D22 kept as is — his call. Next: **Baton — ⬡ Felix → fork** — canon's index:
```

Not fixed here: relaxing the anchor changes the **holder** on 28 historical entries, which
is D74's semantics and 045's out-of-scope list ("changing `BatonHolder` … beyond the one
fork rule"). It is a one-character change to the regex (`^` → `(?:^|\bNext:\s*)`, or drop
the anchor and require the arrow), and it is the cheapest way to double the marked-baton
corpus the office reads. **The office's call, and the prerequisite for F3 and F4 being
counted honestly.**

**F2 — the shape marker is written with a colon too, and the spec pinned the em-dash.**
Two entries in agents mark a shape and are read as unmarked, because the marker's closer is
`:`:

```
$ bun lab/045/census.ts        # "the untyped ⬡ actions, one example each"
- **batch** — batch: ignite 038 · 039 (kickoffs verbatim in [plans/038-stamp-cycle.md](plans/038-stamp-cyc
- **fork** — fork: (a) "lay batch 8" here — this session lays C9 + C10 on the trued board (recommendation
```

A third rides F1's list (`**Baton — ⬡ Felix → single**: land …`, stigmergon 2026-09-01
L784) and is hidden twice over. All predate D74's grammar settling, and all are unambiguous
to a human. Widening `SHAPE_MARK` to `[—–:]` is two characters and would type them; the
spec pinned the em-dash, so the Builder did not widen it. Note the fork also carries an
inline `recommendation:` that would then resolve — a fork, marked, recommended, and
currently read as none of the three.

**F3 — the type table cannot see through a determiner, and that hides 8 visual passes.**
Eleven ⬡ actions type off `your` (6) or `the` (5); **eight** of them read *"your pass"*,
*"your visual pass"* or *"the visual pass"* one word later. (The other three carry no verb
at all: `G6 — the docket batch's review gate`, and *"the polish batch runs on"* twice.)

```
$ bun lab/045/census.ts        # "the untyped ⬡ actions, one example each"
- **your** — your visual pass of phase 4, one sitting, snag mode in your hand (chat.md §14 items 1–8; the
- **the** — G6 — the docket batch's review gate is the next act (Architect · fable-high: 030–032 verifie
```

STANDARD §6 names **visual pass**; the record writes *"your visual pass"* and *"the visual
pass"*. This is a **rule** question, not a word question — skip a leading article or
possessive (`the` · `a` · `your` · `his`) before reading the noun — so it is the office's,
not a table row a Builder adds. Ruling it moves 8 actions from untyped to `visual` at a
stroke, and it is the highest-yield extension the census found that is not F1.

**F4 — `ignite` is the record's most common ⬡ action word (25) and the table does not name
it.** `Baton — ⬡ → ignite 024` is Felix firing a session: a decision to spend, made at a
desk with nothing to look at. It reads **mental** to this Builder, and the Builder added no
word the record does not show *him* ruling. The rest of the untyped tail, for the same
sitting: `summon` 3 (the same act, older spelling) · `once` 2 (a conditional opening a
batch: *"once G15 is paid, ignite …"*) · `paste` · `resume` · `review` · `rulings` ·
`both` · `a` · `is`. `review`, `rulings` and `paste` look mental; `once` is a conditional
that hides its verb; `is` is `single — 037 is IN FLIGHT`, an action that states rather than
asks.

**F5 — the `instrument` kind of `recommendation` is exercised by the fixture and by no
entry in the city.** Both forks the reader typed recommend in prose (`"none of mine — the
call rides your usage gauge"`, `"(a) first — 067/073 are already laid waiting on it"`); the
record names its options by letter, not by the id of the instrument they fire. The
resolution is right and cheap — a fork whose recommendation says `004` when `ignite 004` is
one of its instruments now points at the instrument instead of at a string — but the office
should know that today's evidence for it is the fixture, and that F1 and F2 hide **three
more forks**: the city writes five, the reader types two. The two hidden by F1 both name a
recommendation the reader never sees (`Recommendation: A.` · `Recommendation: B — the
dream's opening image …`), and the one hidden by F2 carries an inline one. A fourth line
reading `fork` is not one — *"rule D43's fork"* is a `rule` action, and types `mental`
correctly.

**F6 — an id is not a noun, and the census made that visible.** The first cut of the type
word split the action on non-letters, so `Baton — ⬡ → G6 — the docket batch's review gate`
reported its type word as `g`, six times. A token carrying a digit is an id or a numbering
(`G6`, `(1)`, `022`) and is now skipped rather than spelled down to its letters — pinned by
a test. Without the census the parser would have shipped reporting a letter as a word.

**F7 — the boot fixture's tail was re-marked to exercise the new line.**
`fixtures/boot/LEDGER.md`'s tail baton became `Baton — ⬡ → single — rule D2, then ignite
003 (…)`, so `test/boot.test.ts` asserts the whole render — `Baton — ⬡ · single · mental →
ignite 003` — rather than the holder alone. 044's verbatim law is untouched: the baton line
is one of the pack's own six authored shapes and is exempt by name.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/045-baton-fields.md to its bar.
```
