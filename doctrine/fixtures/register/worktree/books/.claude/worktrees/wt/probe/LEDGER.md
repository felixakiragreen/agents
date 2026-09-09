# Ledger

---

**2026-09-08 · Digger · opus-high (P1)** — the branch-only building: `probe/` exists in
this checkout and nowhere in the mainline, so its books have no twin. 039-F5 is the hole
that ate it — the file-level split search accepted a one-segment remainder, whose dirname
is `.` and therefore always exists, and matched this file against the mainline's own root
`LEDGER.md`. Decided: nothing. Next: none — the probe is between charges.
