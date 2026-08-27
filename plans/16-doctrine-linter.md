# 16 — v3: the doctrine linter

**Status:** OPEN · **Depends on:** — · **Staffing:** Builder · opus-high

## Mission

One parser in the city. Harden Belvedere P3's probes (`belvedere/lab/p3/`) into canon
tooling at `doctrine/` (repo root, peer of `sync/` — tooling, not canon-law): a
library the glass imports, and a CLI — `doctrine lint`, `doctrine parse --json`,
`doctrine migrate`. The Standards Office owns the format, so it owns the reference
reader; two parsers of one format WILL drift.

## Inputs — read before working

- [DOCTRINE](../canon/work/DOCTRINE.md) §§3, 4, 7, 8 **as amended by D63** — the
  grammar you parse IS this text. §11 for the baton grammar (D64: move/wave/fork).
- [P3 findings](../belvedere/plans/p3-parse-coverage.md) — coverage, the fourteen
  failure classes, and §5's JSON shapes (**normative**, per D65 — amend them only
  where D63/D64 force it: Staffing `Felix-gate` token + rider; Depends-on two forms;
  ledger head tier slot; baton instruments plural with row-references).
- The probes: `belvedere/lab/p3/` — **harvest verbatim where proven** (harvest law;
  rewriting a working artifact is spending without buying). The fixtures seed the
  control set.
- Stack: bun (D59); tabs at width 3 (global directives).

## The spec (blessed: Felix, 2026-08-26, at D63–D65's countersign)

1. **Library** — `parse(<building path>)` → P3 §5's shapes (`Building`, `BoardRow`,
   `LedgerEntry`, `Baton`, `Decision`, `Kickoff`, `Issue`), amended for D63/D64.
   Multiple boards per doc and multiple kickoffs per work doc are corpus facts, not
   edge cases. Zero per-repo special cases — the P3 bar.
2. **`doctrine lint [--live] <path…>`** — walks repos (`.claude/worktrees/` included —
   four boards live only there), reports failure classes with `file:line` + the
   verbatim offending excerpt; exit non-zero on any fail; `--live` restricts to live
   surfaces (boards, ledger tails, open work docs' kickoffs).
3. **`doctrine parse --json <building>`** — emits the shapes, one building per call.
4. **`doctrine migrate <building>`** — parse → re-emit in the current grammar. **Form
   only:** prose bodies byte-preserved, never paraphrased (D63's molt clause). Dry-run
   by default (prints the diff); `--write` required to touch files. Round-trip law:
   `parse(migrate(x)) ≡ parse(x)` on meaning-bearing fields — an assertion, not a hope.
5. **Controls** (DOCTRINE §6.2): synthetic conforming fixtures per artifact class in
   the amended grammar, plus P3's originals as pre-D63 migrate inputs. A parser
   failing its own fixture indicts the parser.

## DoD — measurable, evidence pasted in at build time

1. Fixture suite green: every artifact class, amended grammar, plus pre-D63 fixtures
   migrating clean.
2. Corpus run ≥ P3's baseline (25/27 board docs, 365 rows, 8/8 ledgers, zero per-repo
   special cases); every delta vs P3's numbers explained in findings.
3. Round-trip assertion green on every fixture and on ≥ 3 real buildings (dry-run).
4. `doctrine migrate` dry-run on one pre-doctrine tail (hexwright's `LEDGER.md`)
   produces a diff findings can defend as form-only.
5. Glass import proven: a one-line bun script under `lab/16/` imports the library and
   parses `agents/belvedere` — output pasted.

## Out of scope

- **Writing to any repo outside `~/code/agents`** — dry-run diffs only; row 18 does
  the writes, per building, blessed.
- The storage experiment (row 17) and any new serialization.
- Hook/CI wiring — the CLI is the arm; wiring is each venue's own physics.
- Belvedere's rendering — the glass consumes this row; it never lives in it
  (glass-shatters: the linter dying must cost the city nothing but lint).

## Findings

*(append here)*

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/16-doctrine-linter.md
and execute the order.
```
