# The asks — Board

The fixture's work state: the typed holds and escalations (§4, 032 (b) and (c)), a gate's
readiness on a kill (§4, 086's ask), and the deferred list with its horizon (§4, the pilot).

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 001 | [The landed dependency](plans/001-landed.md) | — | Builder · opus-high | LANDED 2026-09-10 |
| 002 | [The killed dependency](plans/002-killed.md) | — | Digger · opus-high | KILLED 2026-09-11 — the route was wrong, documented |
| 003 | [The two header slots](plans/003-branch.md) | 001 | Builder · opus-high | OPEN — laid 2026-09-15 |
| 004 | [The slots written wrong](plans/004-malformed.md) | — | Builder · opus-high | OPEN — laid 2026-09-15 |
| 005 | [The spent charge](plans/005-spent.md) | — | Builder · opus-high | LANDED 2026-09-01 |
| 006 | [The held landing](plans/006-held.md) | — | Builder · opus-high | LANDED 2026-09-12 — holds: E3 · ⬡ his pass of the panes — findings in [006](plans/006-held.md) |
| 007 | [The charge behind a hold](plans/007-behind.md) | 006 | Builder · opus-high | OPEN — laid 2026-09-15 |
| 008 | [The charge behind a kill](plans/008-behind-kill.md) | 002 | Builder · opus-high | OPEN — laid 2026-09-15 |
| 009 | [The cleared hold](plans/009-cleared.md) | — | Builder · opus-high | LANDED 2026-09-13 — holds: E4 — E4 ruled 2026-09-14 |
| 010 | [The charge behind the cleared hold](plans/010-behind-cleared.md) | 009 | Builder · opus-high | OPEN — laid 2026-09-15 |
| 011 | [The escalation's birth](plans/011-born.md) | — | Builder · opus-high | BLOCKED 2026-09-14 — E3 — the account's quota, only he can rule it |
| 012 | [The hold nobody can address](plans/012-bad-hold.md) | — | Builder · opus-high | LANDED 2026-09-14 — holds: soon |
| G1 | [The batch note](plans/G1-batch.md) | 001 · 002 | Architect · opus-high | OPEN — laid 2026-09-15 |
| G2 | [The gate behind a hold](plans/G2-held.md) | 006 | Architect · opus-high | OPEN — laid 2026-09-15 |

**Deferred (tracked, not lost):**

- The first shelved idea — entered at the founding, nobody waiting.
- The second shelved idea — a pointer to where it would go.
- ~~The third~~ — promoted to 004 (2026-09-15).
