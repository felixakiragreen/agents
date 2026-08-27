# B4 — the hands

**Status:** OPEN · **Depends on:** G1 (Architect half ✓ 2026-08-26) · **Staffing:**
Builder · opus-high · **Batch 3:** first row, strictly serial, straight to master
**Spec blessed:** 2026-08-26, Architect (G1), on P2/P4 + D8.

## Goal

The fence's four write powers as glass endpoints, plus the hardened spawn library.
After this row, a button can do what 370 rig fires did by hand — with the summons
riding as argv, never paste.

## Spec

1. **`belvedere/glass/hands.ts`** + routes on the existing server:
   - `POST /hands/fire` — body: kickoff text, account, cwd, name-stamp, mantle
     color. Recipe (P2 §S, hardened from [`lab/p2/spawn.ts`](../lab/p2/spawn.ts)):
     `workspace create` → compose cmd `CLAUDE_CONFIG_DIR=<dir> cd <cwd> && claude
     --model <m> --effort <e> -n <stamp> "$(cat <summons-file>)"` — **no `/color`
     in the prompt**: color via native `workspace-action --action set-color`
     (P2's find; the summons is the first user turn, byte-exact). Summons file in
     the census dir, sanitized (P2's `sanitize.ts` port).
   - `POST /hands/worktree` — repo path + branch: `git worktree add` per
     [DOCTRINE §10](../../canon/work/DOCTRINE.md); refuses if branch exists;
     returns the worktree path for the fire's cwd.
   - `POST /hands/focus` — `focus-panel` by the census `sf` of a live session.
   - `POST /hands/halt` — touches `summon/log/HALT` (gitignored zone). Dormant by
     design: consumers arrive with the Steward chapter; the endpoint exists so
     the button exists.
2. **Credential:** reads `~/.config/belvedere/env` (`CMUX_SOCKET_PASSWORD=…`,
   file mode 0600) at each hands call. Absent/unreadable → **hands disabled**,
   honest banner served, read-only glass unaffected (glass-shatters). The
   password never appears in logs, pages, or git.
3. **Audit:** every hands action appends one line to
   `summon/log/census/hands.jsonl` (ts, action, args-minus-summons-text, result).
4. Third-party: none — bun stdlib + the installed `cmux` CLI + `git`. Anything
   else is a STOP (D54).

## Acceptance criteria / DoD — evidence pasted here at build time

- [ ] End-to-end fire: a probe session lands in a new cmux workspace, stamp
      `digger-belvedere-smoke`, correct account, workspace colored natively,
      summons byte-exact as first user turn (transcript line quoted); probe
      workspace closed after (venue law).
- [ ] Resume fire: `claude --resume <uuid>` variant against a dead probe session.
- [ ] Worktree: created + removed against a scratch repo; refusal on existing
      branch shown.
- [ ] Focus: jump lands on the probe pane (screenshot or `cmux identify` of the
      focused surface).
- [ ] HALT: file appears; content = ISO timestamp + requester.
- [ ] Disabled mode: env file absent → banner, endpoints 503, read pages fine.
- [ ] Audit lines present for every action above; no summons text in them.
- [ ] `git status` proof: zero writes outside `belvedere/glass/`, the census dir,
      `~/.config/belvedere/`, and the scratch venues.

## Out of scope

- Rail UI (B3), any auto-flow/continuous dispatch (parked horizon), tmux/other
  venue adapters (Ava chapter), password rotation UX (Settings is the home).

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b4-hands.md,
and build the order.
```
