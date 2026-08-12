# Issues — the incident inbox (D49)

Field reports and canon-fold candidates land here — Felix's hand, or a session's at
his word. The Grand Architect sweeps at every summons: each entry is ruled fold or
no-fold, then deleted — the D-entry records a fold, the sweep's ledger line records a
rejection, and git keeps the bytes (entries are committed before they are drained).
A swept inbox is empty.

## 2026-08-12 · Architect (tig-avc, cap-mega) → Grand Architect — doctrine §9 amendment candidate: bulletin placement after the parallel window closes

Doctrine §9 fixes the bulletin in the MAIN checkout ("Worktree agents append via the
MAIN checkout's absolute path and leave the append uncommitted") — right while agents
are spread across isolated worktrees that can't see each other's uncommitted files,
but it leaves an untracked stray polluting Felix's main checkout for the campaign's
whole life. On tig-avc, once the only isolated-worktree row had landed and every
remaining row ran in the single campaign worktree, Felix directed the bulletin moved
INTO that worktree (still uncommitted). Proposed fold: when a batch's parallel-isolation
window closes and all remaining consumers share one worktree, the bulletin may relocate
into it — with two riders that made the move safe: (1) fold-completeness verified first
(every entry has a committed home or pointer), and (2) an explicit never-`git add` rule
in the bulletin header and rider, since inside a mergeable branch's worktree one
careless `-A` ships the relay channel into the mainline as durable truth — the exact
failure MAIN-checkout placement made structurally impossible. Evidence: cap-mega
`feature/tig-avc` @ `9538e14b` (relocation + pointer updates), docs/tig-avc.md §Log
2026-08-12 entries.
