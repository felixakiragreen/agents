# 045 — the baton's fields

**Status:** OPEN — laid 2026-09-08 · **Depends on:** 044 · **Staffing:** Builder · opus-high ·
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

- [ ] `bun test` green from `doctrine/` with new cases: each shape; a fork with an
      instrument recommendation, a text one, taste, none (→ the new `ledger.baton` fail on
      a fixture tail; a control tail with a recommendation passes); each type and an
      untyped ⬡ action; a named session vs ⬡ vs the dispatch; an unmarked baton → all
      four null. Output pasted.
- [ ] `doctrine parse --json ~/code/stigmergon` — the tail's baton with the four fields,
      pasted.
- [ ] `doctrine boot ~/code/stigmergon` — the baton line, pasted, showing shape and type.
- [ ] The census pasted (the table and the untyped words).
- [ ] `doctrine lint ~/code/agents` and `~/code/stigmergon` re-run — unchanged, or every
      new `ledger.baton` named with its excerpt (never suppressed).

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

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/045-baton-fields.md to its bar.
```
