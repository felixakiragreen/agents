# Issues — the incident inbox

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format: `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.

---
- 2026-09-05 · stigmergon's 056 Architect (fable-max) · **An MEL for the deferred
  list — a deferral names its lane and its expiry.** Routed from stigmergon's inbox
  (mentat-05's filing at the neck sitting, 2026-09-04; ref: `~/code/radiant/001-the-neck`,
  chapter 07): aviation's minimum equipment list says which known defects may fly and
  for how many days; DOCTRINE §4's deferred list has no such rule, so every deferral is
  an open-ended park — stigmergon's list holds ~30 entries, none with a date. The
  candidate: a deferred item or a `DEFERRED` annotation carries `until ‹date›` (or
  `until ‹event›`), and the retention sweep (D78) re-rules every expired one — promote,
  re-defer with a new date, or delete. The deferred list is §4's, so the rule is
  canon's; stigmergon's snag rulings (D33, `docs/snags.md` §6) already write
  `deferred — ‹why› — until ‹date›` as the discipline until this lands.
---
- 2026-09-02 · stigmergon's G6 Architect (fable-max) · **The lanes' citation (D86's
  birthplace — stigmergon 030–032, one serial batch under the tender kickoff).**
  The entry D86 owes: what the lanes caught, what they cost, what they missed. The
  figures ride stigmergon's `LEDGER.md` G6 entry; the red list is stigmergon `MAP.md` §5
  (⬡✓ 2026-09-02).

  **Caught.** Three charges, 32 commits, zero red stops — every charge doc's Lanes
  section read *"Red: none inside"* and was right. One `⬡ go` (032's row anatomy and
  Act's body) carried a whole surface from the sitting to the gate with no ⬡
  round-trip; the batch returned to Felix only at G6 — D86's promise, kept once. One
  red crossing, by accident (031-F9): a scratch script outside the repo did a bare
  `import 'doctrine'` and Bun auto-installed npm's `doctrine@3.0.0` into the Bun
  cache — MAP §5 red item 3, D54's class. **The list caught it after the act**: the
  Builder recognized the class from the red list and filed it with evidence and a
  clean-repo proof, where a session without the list would have shrugged off a
  ten-minute `TypeError`. Ruled at G6 into MAP §5 (lab code runs inside the repo;
  `bun --no-install` elsewhere — verified with a control).

  **Cost.** At the lay: the red list (six items, one blessing — the sitting's second
  act) and a ~6-line Lanes section per charge doc. Per charge: green's bar is
  `bun gates.ts` ALL GREEN ×2 at the settled tree — 266+266 s (030), 302+564 s plus one
  discarded run (031, a `bun test` beside it), 320+320 s (032) — ≈34 min of machine
  across the batch, plus G6's own ×2. The tender authored nothing and escalated
  twice (neither about the lanes). No act was demoted or promoted; the ratchet has
  n=1 batch.

  **Missed.** (1) The red list binds a session that *recognizes* the act; an
  auto-install does not look like one, so item 3's keeper is a config or a hook
  (D86's own failure-mode line — "an unlisted irreversible: a hook, the guard
  pattern"), not the list; the machine-level keeper (Bun's global `bunfig`
  `[install] auto = "disable"`, or the cache entry's removal) is Felix's and sits on
  stigmergon's pass docket. (2) The yellow lane did no work beyond one `⬡ go`: every
  other act was a commit under a named check or an as-built note inside a blessed
  scope — whether *"unclassified is yellow"* costs anything is unmeasured; the
  statement holds one credit at interest 0 and the WIP cap was never approached.
  (3) Green was ×2 gates per charge: a single-run green would have shipped the same
  bytes here; what ×2 buys is the flake measurement (030-F6, 032-F6 — two
  pre-existing flakes found because the bar demanded two clean runs). Canon-wide
  distillation (DOCTRINE §4, §5, §10; the Builder and Architect charters) is the
  office's at this citation, per D86.

---
from Felix: is it possible to tell agents not to split everything up onto new lines? Let page width & auto wrapping handle that for me automatically? It makes resizing much easier and nicer.
---
