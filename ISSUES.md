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

- 2026-08-29 · Builder (C26) · **`parseDecisions` cannot read `‹prefix›-D‹n›` — the id form
  §7 mandates.** The candidate regex is `\*\*[A-Za-z]{1,8}-?\d+[a-z]?`: a letter run, an
  optional hyphen, then digits. `PD-D9`, `TH-D11`, `LB-D10`, `C-D2` and the standard's own
  `‹prefix›-D‹n›` all fail it. Measured: bob declares **53** decisions in that shape across
  `docs/campaigns/` and `doctrine lint ~/code/universal_robots_sdk/bob` reports **0
  decisions** for all four of its buildings — a silent zero, item 16's genus. The census
  counts 214 `PD-D`, 105 `TH-D`, 87 `LB-D`, 12 `C-D` ids outside the register entirely.
  C26's prefix arm therefore advises a form the reader rejects, which is why it warns rather
  than fails. Not fixed there: it is C24's parser and widening it moves `decisions`, an
  entity total the count-regression guard watches, so it wants its own before/after.
  Reproduction checked in: `doctrine/fixtures/vocab/DECISIONS.md`'s `VX-D2`.
- 2026-08-29 · Builder (C26) · **`lab/21/ortho.ts`'s -ise stoplist is short, so
  `ortho-report.md` overstates -ise by ~41 of its 193.** `ISE_OK` omits `improvise` (26 uses),
  `advertise` (8) and `supervise` (7) — all three sit in the report's own "top -ise" table.
  The linter inherited the list, fired "improvise → improvize" on the corpus, and now carries
  a corrected set in `doctrine/src/lexicon.ts` (21 words added, `tortoise` among them). The
  census's ratio line is wrong by that much; nothing was decided on the ratio, so this is a
  correction, not a recall. Distill or reject: whether a landed lab report gets a dated
  correction note when a later charge disproves one of its numbers.
- 2026-08-29 · Builder (C26) · **This repo's own vocabulary backlog: 44 hits, needing
  use-vs-mention adjudication, unswept on purpose.** `doctrine lint --vocab ~/code/agents`
  reports 44 on the `agents` building (13 in MAP.md, 31 in six OPEN charge docs, 0 in
  CLAUDE.md) and 123 more in Belvedere. Every one is real: `Dispatcher` 13 (tombstone prose
  — the cure is backticks, C23-F3's method), `colour`/`behaviour`/`synchronise` 9 (D71 §8's
  spelling ruling, which **no charge has ever swept** — C25 was the graveyard's sweep, not
  the lexicon's), `the glass` 4 and `keel` 4 in two OPEN charges' own titles (20, C27),
  `fire` 4, `the register` 2, `cut` 2, `row 16`-family 4, `PARKED` 1, `DoD` 1. C26 is
  forbidden to edit building text, so this is filed rather than swept. **Felix's call:** ride
  C30 (same method, outer city), become C31, or wait. The spelling half is the cheap half —
  it needs no adjudication at all.
- 2026-08-29 · Builder (C26) · **`plans/18-great-recut.md`'s own `**Status:**` still reads
  OPEN; the MAP says LANDED (C25 reconciled it).** So `isLiveWorkDoc` reads it as a live
  surface and every reader that fences closed docs lints its history — 11 vocabulary hits
  that are nobody's debt. One of the two records is lying and by C25's own findings it is the
  doc. A one-line repair, in nobody's scope today.
