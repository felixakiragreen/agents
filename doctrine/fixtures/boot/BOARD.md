# boot — Board

Two boards in one doc (a corpus fact), so the pack names the heading beside the file. The
known numbers: the campaign board is 5 charges · 3 live · 1 landed · 1 killed, the gates
board is 2 charges · 1 live · 1 landed · 0 killed, and the shelf under them holds 3 bullets.

## The campaign

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 001 | [the keel](plans/001-keel.md) | — | Builder · opus-high | LANDED 2026-09-01 |
| 002 | [the arm](plans/002-arm.md) | 001 | Builder · opus-high | IN FLIGHT — ignited 2026-09-02 |
| 003 | [the second arm](plans/003-second-arm.md) | 001 | Builder · opus-medium | OPEN — laid 2026-09-02 |
| 004 | [the dead end](plans/004-dead-end.md) | — | Digger · opus-low | KILLED 2026-09-02 — the probe answered it |
| 005 | [the shelved one](plans/005-shelved.md) | — | — | OPEN — DEFERRED until the arms land |

## The gates

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| G1 | [Review gate — the keel](plans/g1-keel-review.md) | 001 | Architect · fable-high | LANDED 2026-09-01 |
| G2 | [Review gate — the arms](plans/g2-arms-review.md) | 002, 003 | Architect · fable-high | BLOCKED 2026-09-02 — waiting on 002 |

**Deferred (tracked, not lost):**

- the first shelved ask — a bullet whose second line
  is a continuation and not a bullet of its own
- the second shelved ask
  - a nested bullet, which the count never sees
- the third shelved ask
