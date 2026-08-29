# Issues — the incident inbox (D49)

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format (D63): `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.

---

- 2026-08-29 · Architect (C25) · **`doctrine migrate` writes false `unrecorded` clause-fills
  when a head rule changes the entry boundaries in the same pass.** Every rule fires off ONE
  parse of the pre-migration document. On whiteboardy the head rules took the ledger from 5
  parsed entries to 127 — but `ledger.unrecorded-clauses` had already been computed against
  the 5-entry parse, so it appended `Decided: unrecorded.` / `Next: unrecorded.` into **61
  entries that carry a real clause**, and the round-trip law printed `ok` throughout
  (`decided`/`next` are fields the rule declares it may change). 18f's snappy finding is the
  same genus seen from the other side. Repaired by hand here; the tool is unfixed. Two cures
  to weigh: re-parse between rule *classes* (structure rules, then field rules), or refuse to
  fill a clause in an entry whose head this same run rewrote. Ancestor: 18c's
  "lint after `--write`, never trust a clean round-trip line alone."
- 2026-08-29 · Architect (C25) · **`migrate`'s clause matcher is stricter than `parse`'s and
  neither documents the house dialects.** whiteboardy spells 61 clauses `Decided (<scope>):`
  and 3 `Next — <text>`; `parse` fails them (`ledger.decided`/`ledger.next`) and `migrate`
  has no rule for them, so the only repair is by hand. The colon-relocation
  (`Decided (<x>): y` → `Decided: (<x>) y`) is total, byte-preserving and mechanical —
  a candidate migrate rule for C26 or a doctrine follow-on.
- 2026-08-29 · Architect (C25) · **`lab/08/run` does not derive its assertions from
  `presets.tsv`** — only its counts. C25 retired the dead `d dispatcher` preset (D71) and the
  harness went 1 → 15 failures: `drive.exp` presses `d` as a drive keystroke, three
  assertions name `dispatcher-hive-0N` stamps, and two 60-column wrap assertions are
  column-sensitive to the panel's item list. 13-F1's guard covers the fixture, not the
  script. The retirement stands (a dead mantle must not be summonable from the live rig);
  the harness repair is Builder work and is laid as C29.

