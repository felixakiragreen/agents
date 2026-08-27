# Issues — Belvedere's incident inbox (D53 pattern)

Field reports, render failures (parser-as-lint, [README §1](README.md)), and
sovereign-inbox entries (`From Felix (via Belvedere): …`) land here — Felix's hand,
a session's at his word, or the glass's third write ([README §2](README.md)). Entry
format (D63): `- <YYYY-MM-DD> · <who> · <what>` — one bullet per entry; an entry
needing evidence becomes a `---`-separated block opening with that line. This
building's Architect sweeps at every sitting: each entry ruled — folded, cut as a
row, rejected, or escalated (canon-shaped entries go to the canon repo's inbox) —
then deleted; entries are committed before they are drained. A swept inbox is empty.

---

- 2026-08-27 · Builder (B8) · **`summon/log/census/hands.jsonl` carries 16 test-shaped
  audit lines**, from B4's landing to this row — the frozen-env bug (B8 F1) pointed
  `hands.test.ts` at the live anchors. Four of them stamp `builder-belvedere-01`, and
  `nextStamp` counts `hands.jsonl` (B3 F4), so the lineage counter has been counting test
  fires as real ones. Fixed at the cause; the existing lines are gitignored telemetry and
  an append-only audit is not a Builder's to scrub. Ruling wanted: scrub, annotate, or
  let the counter carry the scar. *(The same bug armed `summon/log/HALT` from a test —
  B8 cleared that, venue restored.)*

- 2026-08-27 · Builder (B8) · **`bun test doctrine` is red — 20 pass / 1 fail**, and it
  is corpus drift, not this row: `corpus > hexwright's pre-doctrine ledger tail migrates
  form-only` expects `m.edits.length > 0` and gets `0`
  (`doctrine/test/doctrine.test.ts:190`). Pre-existing at `3fe5d99`; B8 touched nothing
  under `doctrine/`. Canon-shaped — the test asserts a fact about another building's
  ledger, so it goes red whenever that ledger converges. Route to the canon inbox.
