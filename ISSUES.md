# Issues — the incident inbox

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format: `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.

---

- 2026-08-31 · C39 Builder · **the worktree dedup's split search can eat a branch-only
  building.** `worktreePath()` (`doctrine/src/building.ts`) finds where a branch name ends by
  taking the shallowest split whose remainder's own directory exists in the mainline — and
  `<rest>` of one segment always passes, because its dirname is `.`. So a branch-only
  `<checkout>/<newdir>/LEDGER.md` is matched against `<repo>/LEDGER.md` and skipped as a
  twin: the building vanishes from every walk. Repro (scratch, 2026-08-31): a repo with a
  root `LEDGER.md` and `.claude/worktrees/wt/sub/LEDGER.md` → `discover([…/worktrees/wt])`
  returns `[]`, `lastWalk.suppressed` 1. **Latent, not active:** manny survives only because
  cap-mega is a host and keeps no root `LEDGER.md`; agents' one checkout (`bv/`) carries no
  books. C39's manny-shaped fixture pins the shape that works, not this one. Fix sketch — the
  checkout root is knowable, never guessable: a git worktree's root carries a `.git` FILE, so
  the split is found, not searched. Beyond C39's fence (it is C36 item 5's arm); filed, not
  chased.
