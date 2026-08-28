# C2 — the cold-start battery (fixed; identical both arms)

Answer every question, then produce the three writes. Save ONE file:
`lab/17/c2/runs/<RUN>.json` (the RUN id is given in your dispatch) with EXACTLY this
shape — answers must be your own reading of the allowed sources, no other file may be
written or modified:

```json
{
	"q1": ["<row id>", "…"],
	"q2": { "mantle": "…", "tier": "…" },
	"q3": ["<form 1>", "<form 2>"],
	"q4": { "holder": "…", "action": "…" },
	"q5": { "row18DependsOn": ["…"], "dependentsOf16": ["…"] },
	"q6": { "date": "YYYY-MM-DD", "assertions": 0 },
	"q7": ["D<n>", "…"],
	"q8": { "meaning": "…", "whoReplaces": "…" },
	"q9": { "state": "…", "reason": "…" },
	"q10": { "mantle": "…", "tier": "…", "tends": "…" },
	"w1": <see task>,
	"w2": <see task>,
	"w3": <see task>
}
```

## Read questions — the campaign board here means MAP.md §5's / board.json's first board

- **q1** — Which board rows are dispatchable right now (correct lifecycle state, every
  row-dependency LANDED, no unpaid Felix-gate)? List the row ids.
- **q2** — What mantle and tier staff row 17?
- **q3** — Per D63(e), the Depends-on column takes exactly two forms. Name both.
- **q4** — After the newest ledger entry: who holds the baton, and what is the action
  it names first?
- **q5** — Which rows does row 18 depend on (row-dependencies only)? And which rows
  name row 16 as a row-dependency?
- **q6** — On what date did row 13 land, and how many assertions were green at its DoD?
- **q7** — Which decision ids are currently awaiting Felix's countersign?
- **q8** — What does the literal token `unrecorded` mean, and what does replacing it
  require?
- **q9** — What lifecycle state is row 11 in, and why is it not dispatchable?
- **q10** — What mantle · tier staffs row 18, and what does that session tend?

## Write tasks — produce content, never edit any existing file

- **w1** — A ledger entry for this session-fact set: date `2026-08-28` · mantle
  `Digger` · tier `fable-high` · row `17` · what changed: "C2 battery run, answers
  filed" · decided: nothing · next: `fire 19`.
  Markdown arm: `w1` is one string — the complete entry block exactly as you would
  append it to LEDGER.md (without the `---` separator).
  Structured arm: `w1` is one JSON object in ledger.json's entry shape.
- **w2** — A new board row for this fact set: id `23` · work: "the tier ledger" (no
  work doc yet) · depends on row `21` · staffing `Architect · fable-high` · status:
  OPEN, annotation "cut 2026-08-28".
  Markdown arm: `w2` is one string — the complete `| … |` table row line.
  Structured arm: `w2` is one JSON object in board.json's row shape.
- **w3** — Row 22 just dispatched: its status becomes IN FLIGHT with the annotation
  "dispatched 2026-08-28". Markdown arm: `w3` is one string — row 22's complete
  updated table row line. Structured arm: `w3` is row 22's complete updated JSON row
  object.
