# Fixture — a board carrying credit marks (D82, the statement)

The known interest: 001 is marked, and 002 · 003 have LANDED on top of it (004 depends on it
too and has not landed, so it is not interest). 005's gate was paid on credit and nothing has
landed on it. 006 is spent and 007 only quotes the token — neither is on the statement. 008
is BLOCKED — transient, still owing its review — so its mark is on the statement at interest 0.

## The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 001 | [the base](plans/001-base.md) — the charge the rest stands on | — | Builder · opus-high | LANDED — ⬡ go 2026-09-01 |
| 002 | [the middle](plans/002-middle.md) | 001 | Builder · opus-high | LANDED 2026-09-01 |
| 003 | [the top](plans/003-top.md) | 002 | Builder · opus-high | LANDED 2026-09-01 |
| 004 | [the sibling](plans/004-sibling.md) — laid on 001 and not landed | 001 | Digger · opus-high | OPEN — laid 2026-09-01 |
| 005 | [the gate paid on credit](plans/005-gate.md) | ⬡-gate: his word — ⬡ go 2026-09-02 | ⬡-gate | IN FLIGHT — ignited 2026-09-02 |
| 006 | [the spent charge](plans/006-spent.md) — marked, then killed | — | Builder · opus-low | KILLED 2026-09-01 — ⬡ go 2026-08-31 and killed anyway |
| 007 | [the mention](plans/007-mention.md) — the row that writes `⬡ go 2026-09-01` in a code span | — | Digger · opus-low | OPEN — laid 2026-09-01 |
| 008 | [the blocked charge](plans/008-blocked.md) — at the Architect's desk, its gate paid on credit | ⬡-gate: his word — ⬡ go 2026-09-02 | Builder · opus-high | BLOCKED 2026-09-02 — a fork the doc did not pre-chew |
