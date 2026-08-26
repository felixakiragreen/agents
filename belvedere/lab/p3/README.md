# lab/p3 — parse-coverage probes (disposable)

Doctrine-format-strict parsers for the five glass artifacts, run over every live
doctrine repo. Findings are the deliverable ([../../plans/p3-parse-coverage.md](../../plans/p3-parse-coverage.md));
this code is the evidence that produced them.

```
bun run.ts                    # control + coverage table + board totals
bun run.ts --fails            # every failure with its verbatim excerpt
bun run.ts --json <repo>      # the proposed glass shape, emitted from a real parse
```

- `parse.ts` — the five parsers (DOCTRINE §§3, 4, 5, 7, 8)
- `corpus.ts` — every artifact discovered under `~/code` (discovery commands in the findings)
- `fixtures/` — the control (DOCTRINE §6.2): one conforming file per artifact class.
  A parser failing its own fixture indicts the parser, not the corpus.
