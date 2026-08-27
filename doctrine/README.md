# doctrine — the Standards Office's reference reader

One parser in the city. The Office owns the format, so it owns the reader: two readers of
one format WILL drift. Belvedere imports this library; nothing re-implements it.

Tooling, not canon-law — a peer of [`sync/`](../sync). The law it reads lives in
[`canon/work/DOCTRINE.md`](../canon/work/DOCTRINE.md) §§3, 4, 5, 7, 8, 11, as amended by
**D63** (the schema fold) and **D64** (the baton grammar). The parsed shapes are P3 §5's,
normative per D65 ([belvedere/plans/p3-parse-coverage.md](../belvedere/plans/p3-parse-coverage.md)).

```
bun doctrine/cli.ts lint [--live] [--verbose] [--json] <path…>
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

`src/grammar.ts` names every mantle, tier, state and verdict **once** · `src/parse.ts` the
five artifact parsers · `src/building.ts` discovery + `parse()` · `src/lint.ts` the walk and
the report · `src/migrate.ts` the form-only converter · `cli.ts` the arm.

## Parser-as-lint

A field the doctrine names and a doc does not carry is a **failure with its verbatim
excerpt**, never a parser branch. Per-repo special cases: zero, and the suite says so. A
null is a render decision, not an error — the glass still draws while the lint files the
defect.

`--live` narrows the report to what a session or the glass reads *today*: boards, the ledger
tail, and the kickoffs of work docs whose own `**Status:**` is still OPEN / IN FLIGHT /
BLOCKED.

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

Deliberate refusals, because the alternative is a converter inventing meaning:

- **kickoff fences** — nobody edits a kickoff except the Architect re-cutting the row (§5).
- **ISSUES entries** — the inbox drains empty by law (D53); the non-conforming inboxes hold
  struck history awaiting their Architects' sweeps.
- **judgment targets** — a `CHARTERED` status, a missing decider, a session title stuck in a
  ledger's bold run. Those stay lint failures with a human's name on them.
