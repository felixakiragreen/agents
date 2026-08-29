# Issues — the incident inbox

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format: `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.

---

- 2026-08-29 · grand-architect-18 · doctrine lint's building register counts
  flow-minted worktrees as buildings: `.claude/worktrees/bv/c29-summon-harness` at
  the same commit as master still doubles every total (2 buildings → 4, 84 rows →
  168; any future red would double too). The charge-16 rule says a worktree
  checkout is skipped unless its branch put a board where the mainline has none —
  the implementation evidently keys on the `worktree-agent-*` shape, so `bv/*`
  branches slip it. Repro: current tree, `doctrine lint ~/code/agents`. Candidate
  home: C31 gains a fifth item, or the flow venue work — the next sweep rules it.
