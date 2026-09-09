# The fixture building register — the manny shape

A host repo keeping no books of its own, and a building that lives in one of its worktree
checkouts (D79: a declared root outranks the walk's worktree skip). Walking the checkout
directly is what this book asks for; the file-level dedup drops the mainline twins the
checkout carries and keeps what only the branch has.

`books/` beside `repo/` is the other half, registered nowhere and walked by path (046): a
mainline that is ITSELF a building, whose checkout carries a copy of its root ledger plus a
branch-only building of its own. 039-F5 ate that building; the twin skip must count the
copy and keep the branch's own, and a caller who names the checkout reads the checkout's
ledger, not the mainline's.

| Name | Kind | Root |
|---|---|---|
| mainline | host | `../repo` |
| manny | building | `../repo/.claude/worktrees/user-manual` |
