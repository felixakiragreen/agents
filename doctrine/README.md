# doctrine — the Standards Office's reference reader

One parser in the city. The Office owns the format, so it owns the reader: two readers of
one format WILL drift. Belvedere imports this library; nothing re-implements it.

Tooling, not canon-law — a peer of [`sync/`](../sync). The law it reads lives in
[`canon/work/DOCTRINE.md`](../canon/work/DOCTRINE.md) §§3, 4, 5, 7, 8, 11, as amended by
**D63** (the schema distillation), **D64** (the baton grammar) and **D71** — the Guild's standard,
[`canon/work/STANDARD.md`](../canon/work/STANDARD.md). The parsed shapes are P3 §5's,
normative per D65 ([belvedere/plans/p3-parse-coverage.md](../belvedere/plans/p3-parse-coverage.md)).

```
bun doctrine/cli.ts lint [--live] [--vocab] [--verbose] [--json] <path…>
bun doctrine/cli.ts parse --json <building>
bun doctrine/cli.ts migrate [--write] <building>
bun test                                   # from doctrine/ — the §6.2 control + the round-trip law
```

## The library

```ts
import { parse, lint, migrate } from './doctrine';

const b = parse('~/code/agents/belvedere');   // → Building: board[] · ledgerTail · baton
                                              //   · decisionQueue · issues · kickoffs · fails
```

`src/grammar.ts` names every mantle, tier, state, verdict and dead word **once** · `src/parse.ts` the
five artifact parsers · `src/building.ts` discovery + `parse()` · `src/lint.ts` the walk and
the report · `src/migrate.ts` the form-only converter · `src/lexicon.ts` the standard's §§7–9 as
data · `src/vocabulary.ts` the speech arm and its fence · `cli.ts` the arm.

## The standard's tokens (D71)

The reader speaks the standard and reads its history. Every dead word stays parseable
forever — the city's records are full of them — and `migrate` re-emits each as its successor;
nothing writes one again.

| Token | Dead spelling, still read |
|---|---|
| `⬡-gate` — Staffing's gate charge, Depends-on's named gate | `Felix-gate` (and a bare `Felix`) |
| `DEFERRED` — the annotation that never leads | `PARKED` |
| `ignite <charge-ids>` — the baton's instrument | `fire <row-ids>` |
| `⬡✓` — the blessing mark | `✓ Felix` (its record migration is deferred: neither mark migrates) |

**Charges are always staffed** (D71, lint-hard): an empty Staffing cell, the dead token
`unstaffed`, or a dissolved `—` on a charge whose Status carries no `DEFERRED` is a failure,
never a typed absence. `unrecorded` still answers for a record that never held.

## Parser-as-lint

A field the doctrine names and a doc does not carry is a **failure with its verbatim
excerpt**, never a parser branch. Per-repo special cases: zero, and the suite says so. A
null is a render decision, not an error — the deck still draws while the lint files the
defect.

`--live` narrows the report to what a session or the deck reads *today*: boards, the ledger
tail, and the kickoffs of work docs whose own `**Status:**` is still OPEN / IN FLIGHT /
BLOCKED.

**The kickoff arm (C31).** Counting a fence is not reading it. In a work doc whose own
`**Status:**` is still unfinished the fenced kickoff must open in the summons grammar — the
summons line (`kickoff.summons`), then C33's door line (`kickoff.door`), then the wear line
(`kickoff.wear`): DOCTRINE §5's single-glance test, mechanized, because the flow engine fires
those bytes verbatim. LANDED and KILLED docs are history and are never read. The unmantled
cheap-tier ignition carries GUILD.md's closing stanza inline instead of a path read
(`canon/mantles/README.md`) — it names no mantle and wears no charter, so it passes on its
opening line and is no more a kickoff candidate than a Personal-Log letter is.

## `--vocab` — the speech arm (C26)

Format drift is caught by the parser; `--vocab` points the same alarm at **speech**. Off by
default: the form arms are a doc's honesty and gate the exit code, while the vocabulary arm
reports the city's respell backlog. Ancestor: manny's **M13** (`campaign-id`, hard error) at
`manny/plans/29-campaign-id-lint.md` — its two laws are this arm's, *narrow the pattern, never
whitelist a file* and *one code per arm, the excerpt differentiates*.

| Arm | Law | Code |
|---|---|---|
| the graveyard | §9's table — a dead word, its successor named in the excerpt | `vocab.dead-word` |
| the spelling lexicon | §8 — American, exception list `{grey, greys, greyed}`, `-ize` with it | `vocab.spelling` |
| the pinned formulas | §8's twenty-four — most of a formula's spine, none of its wording | `vocab.formula` |
| the id namespace | §7 — a bare `D‹n›` outside the canon, a letter serving two kinds | `vocab.prefix` (**warn**) |

A **warning** is reported and never enforced — §7's own word — and never moves the exit code.

**The fence is structural, not a list of exceptions.** History and voice are masked out of the
text before a pattern runs, so a dead word inside them is not *allowed*, it is not there:
fenced code and summonses · blockquotes · inline code · `~~struck~~` text · link targets and
one-word link texts · double-quoted spans · `Findings` / `Ledger` / `Decisions` sections · a
board's Depends-on, Staffing and Status columns · **a LANDED or KILLED row whole** (a finished
charge's title is the address its ledger cites) · closed charge docs · `LOG.md`, `SAPHO.md`,
`dream.md` · `canon/` itself, which must name the dead to bury them.

**A mention is spelled in ticks or quotes.** The arm cannot tell use from mention (C23-F3), so
the doc says which: `` `unstaffed` `` and *"the Dispatcher is dead"* are already fenced, and
that is the cure for a tombstone sentence — not a per-file exemption.

**Eight of §9's thirty-two rows are dropped, in writing, each with its reason** (`src/lexicon.ts`):
`chain` · `fold` · `wave` · `move` · `window` · `strike` · `pass` · the four-slot waggle. A
pattern that cannot be written without false positives is dropped, never weakened — and `fire`
keeps only its bare form, measured at 8/8 Guild-sense against `fires` 0/5 and `firing` 1/8 in a
city where clauses, listeners and kill criteria all fire.

`src/lexicon.ts` is a **mirror** of §§7–9; `test/vocabulary.test.ts` is the alarm on the mirror.
Edit the standard and the suite goes red — and the alarm proves itself, running each binding a
second time against a mutated copy of the standard's text and asserting that it fails.

## The register — how a building is found

- A directory is a **building** when it directly carries `LEDGER.md`, `DECISIONS.md`,
  `ISSUES.md`, or a master doc (`MAP.md` / `GENESIS.md` / `README.md`) that staffs sessions.
- Every other artifact file belongs to its **nearest ancestor building**; a board with no
  ancestor promotes its own directory (that is how `cap-mega/docs`' contract boards get a home).
- `lab/`, `fixtures/` and `templates/` are not corpus (DOCTRINE §3, §6.2, and ⟨placeholders⟩);
  they stay lintable when named as an explicit root.
- **Worktrees are walked** — four of the city's boards live only under `.claude/worktrees/`.
  A checkout whose mainline twin exists at the same size IS that twin and is skipped; a
  branch that put a board in a doc the mainline has none in survives; one representative per
  `(repo, relative path)`. The count skipped is printed, never hidden.

## `doctrine migrate` — form only

Parse, then re-emit in the current grammar. Prose bodies are byte-preserved and the converter
never paraphrases (D63's molt clause). Every rule is a total, line-scoped replacement that
declares which parsed fields it may alter; a dry-run diff is the default and `--write` is
required to touch a byte.

**The round-trip law, asserted:** `parse(migrate(x)) ≡ parse(x)` — a field the parser already
typed comes back identical; only a field a fired rule declared may change; nothing outside a
recorded edit moves. A violation aborts the write: that is a converter bug, not a doc defect.

**The clause pass re-reads (C31).** The rules run in two classes: structure and field rules
first, then the document is re-read and `ledger.unrecorded-clauses` decides its typed absences
against what the document now says. Reading the pre-migration bytes is how the converter came
to stamp `Decided: unrecorded.` into 61 whiteboardy entries that carried a real clause — in the
house dialect a field rule had just repaired — while the round-trip law printed `ok` for every
one of them. **`round-trip ok` is a statement about declared fields, not about meaning.**
Where the tool cannot repair a clause's spelling it refuses to fill: a refusal is a lint
failure with a human's name on it, a fill is a lie.

Deliberate refusals, because the alternative is a converter inventing meaning:

- **kickoff fences** — nobody edits a kickoff except the Architect re-laying the charge (§5).
- **ISSUES entries** — the inbox clears empty by law (D53); the non-conforming inboxes hold
  struck history awaiting their Architects' sweeps.
- **judgment targets** — a `CHARTERED` status, a missing decider, a session title stuck in a
  ledger's bold run, and **who staffs a live charge**: `unstaffed` becomes `—` only where the
  Status already says the charge is DEFERRED. Those stay lint failures with a human's name on them.
- **the record's marks** — `✓ Felix` stays `✓ Felix`; the history respell is deferred by the
  standard (§7), so neither blessing mark migrates.
