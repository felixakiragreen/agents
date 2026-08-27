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

- 2026-08-27 · B3 Builder · **`bun test belvedere/glass` is red; the suite has no
  env isolation between files.** `hands.test.ts` sets `CENSUS_DIR`/`BELVEDERE_ENV`
  then dynamically imports its module — correct alone, useless together:
  `paths.ts` freezes `process.env` at module load and `census.test.ts` (first
  alphabetically) already pulled it in via a static import. One process, one cached
  `paths.ts`, 8 failures pointing at the real census dir. **Pre-existing** —
  reproduced at B4's own landing commit `286b370` (`54 pass / 8 fail`) before B3's
  test files existed. Per file today: census 33 · hands 29 · rail 39 · register 4 =
  105 green. Not fixed at B3 (B4's file, adjacent to the order). The fix is
  structural: either the env-derived anchors in `paths.ts` resolve per call, or the
  suite gets a preload that points every file at a temp census. Evidence:
  [plans/b3-baton-rail.md](plans/b3-baton-rail.md) §F3.

---

- 2026-08-27 · B3 Builder · **`fire` leaves the workspace behind when a later step
  fails.** `attemptFire` creates the cmux workspace, then sets the colour; a refused
  colour returns `{ok:false}` with the workspace still open and a claude session
  already launched in it. Measured, from the hands' own audit:
  `{"action":"fire","args":{…,"color":"cyan",…},"ok":false,"result":"fired
  workspace:7, but set-color failed: … Invalid color…"}`. B3 closed the *cause* at
  the boundary (rig colour names now cross into cmux's palette,
  `glass/summon.ts`), but the *hazard* is B4's: a hand that half-succeeds should
  unwind what it created, or say plainly in the error that a workspace is live and
  name it. Evidence: [plans/b3-baton-rail.md](plans/b3-baton-rail.md) §F1.

---

- 2026-08-27 · B3 Builder · **B7 will stall on Claude Code's folder-trust dialog.**
  A fire into a directory with no *trusted ancestor* launches, prints the summons
  into argv, and then sits on `Quick safety check: Is this a project you created or
  one you trust?` — no transcript, no census beat, no first user turn. Trust is
  inherited, not per-directory (`~/.claude.json`: 13 project entries, **zero** for
  any worktree, while the city runs sessions in worktrees constantly), so worktrees
  under a trusted repo are fine and a fresh tree outside one is not. B7's whole
  point is firing at directories nothing has trusted yet. The glass must never
  answer that dialog for Felix — the question is whether the rail can *warn*.
  Evidence: [plans/b3-baton-rail.md](plans/b3-baton-rail.md) §F2.

---

- 2026-08-27 · B3 Builder · **Third D54 slip in three build rows: `bunx tsc`.** Run
  once at this row (`bunx tsc --noEmit -p belvedere`, which has no tsconfig anyway),
  same as B1 and B4. No lockfile written, nothing in the repo, zero harm — but three
  for three is not a slip, it is a missing tool. The city has no offline
  type-checker and every Builder reaches for the one that fetches. Either name a
  checked-in TypeScript in the glass's deps and a `tsconfig.json`, or rule that
  `bun test` + `bun` running the code IS the type gate and say so in the rider.
