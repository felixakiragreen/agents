# The fixture building register — the manny shape

A host repo keeping no books of its own, and a building that lives in one of its worktree
checkouts (D79: a declared root outranks the walk's worktree skip). Walking the checkout
directly is what the register asks for; the file-level dedup drops the mainline twins the
checkout carries and keeps what only the branch has.

| Name | Kind | Root |
|---|---|---|
| mainline | host | `../repo` |
| manny | building | `../repo/.claude/worktrees/user-manual` |
