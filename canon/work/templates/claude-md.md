# ⟨Project⟩ — ⟨what it is, one line⟩

⟨Two or three lines: the system, for whom, the bet. No history, no state — point.⟩

**Read `GENESIS.md` before any work** — master architecture and the board.⟨ `initial.md`
is the origin vision: immutable, never edit it.⟩ The tail of `LEDGER.md` says where we
are; ratified choices live in `DECISIONS.md`.

## Hard laws (project physics; Felix's global directives also apply)

1. ⟨The invariants that make this project itself — determinism, purity, gates, sacred
   resources. Only laws a session could otherwise break.⟩

## Session protocol

- Declare your mantle; summons wear `~/code/agents/canon/mantles/<mantle>.md`. This
  project runs the work doctrine: `~/code/agents/canon/work/DOCTRINE.md`.
- ⟨Standing staffing notes, if any — e.g. "design sessions run fable-max; the board
  names the rest."⟩
- End every session: state written, `LEDGER.md` appended (date · mantle · changed ·
  decided · next), commits in Felix's git style. Suggest a break at every clean
  boundary; hand the next session its summons verbatim.
- Repo: branch `master`, never main. ⟨Other conventions: worktree rules, protected
  paths, what stays out of git.⟩

⟨Keep this file ≤ ~60 lines — every byte here taxes every session, forever.⟩
