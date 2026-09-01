# The Building Register

The city's book — every Guild building and every host, declared. Discovery reads
this file, never the disk whole: membership is Felix's ruling; structure inside a
building is walked (the anchor law, `doctrine/src/building.ts`). Founding registers
the building (DOCTRINE §12); retirement keeps the entry while the books stand; a
root is the address of the books today — a move updates the line, git holds the
history. A declared root is entered even where a walk would skip it (a building
living in a worktree registers its worktree path).

- **Kind** — `building`: Guild land, its root walked for books · `host`: Felix's
  repo, pre-Guild or hosting tenant buildings — listed, never walked; converts by
  founding. Repos that are not Felix's are never registered.
- **Tenants and subprojects** — a building inside a host always has its own line
  (hosts are never walked); a subproject inside a walked building surfaces by the
  walk and registers only when Felix addresses it (a stamp, a qualified id).
- **The stamp cycle derives from this table** (C38): at a fire root, the summons
  cycles the row matching the cwd plus every row whose root sits under it; the
  cwd's own Name is the default. The rig machine-reads this table — format
  changes ride C38's harness. The read contract (C38 F7): the table opens at its
  `|---|` separator and ends where the pipes stop; every data row is exactly
  three cells; the Name is a plain name (`A-Z a-z 0-9 . _ -`); Kind is parsed,
  never validated.

| Name | Kind | Root |
|---|---|---|
| agents | building | `~/code/agents` |
| stigmergon | building | `~/code/stigmergon` |
| hexwright | building | `~/code/hexwright` |
| whiteboardy | building | `~/code/whiteboardy` |
| simmy | building | `~/code/universal_robots_sdk/cap-mega/simmy` |
| snappy | building | `~/code/universal_robots_sdk/cap-mega/snappy` |
| spacex-dashboard | building | `~/code/universal_robots_sdk/cap-mega/felix/spacex-dashboard` |
| manny | building | `~/code/universal_robots_sdk/cap-mega/.claude/worktrees/user-manual` |
| cap-mega | host | `~/code/universal_robots_sdk/cap-mega` |
| bob | host | `~/code/universal_robots_sdk/bob` |
