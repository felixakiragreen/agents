# 07 — simmy retrofit

**Status:** OPEN · **Depends on:** — · **Staffing:** Architect · fable-high ·
**Blessed:** D32 ✓ Felix, 2026-08-06 (the keel's touch map)

## Goal

simmy's live campaign surfaces speak canon — Dispatcher law from `canon/mantles/`, an
instantiated rider, canonical staffing on the board, the pre-canon tier shadow dead on
every live cap-mega branch — so the orphaned B14 resumes onto clean docs. History
(spike briefs, bulletin, ledger, landed findings) untouched. An order run by the
project's Architect: re-staffing a live board is board-truing work.

## Inputs — read before working

- `~/code/agents/canon/work/DOCTRINE.md`, `canon/mantles/README.md` (rider template §),
  `canon/mantles/dispatcher.md`, `architect.md`.
- simmy, **in its worktree** `~/code/universal_robots_sdk/cap-mega/.claude/worktrees/simmy`
  (branch `feature/simmy` — the live line, ahead of origin): `simmy/README.md` (§6 board,
  §8 agreements), `simmy/DISPATCHER.md` (the pre-canon banner), `simmy/LEDGER.md` tail.
- Known, do not re-derive (keel recon, 2026-08-06):
  - **Batch 9 is mid-flight.** B11/B12/B13 LANDED (B12's merge gated on B14's verdict);
    **B14 IN FLIGHT and its session died on token limits** — Felix resumes it from
    another account AFTER this row lands (his keel ruling: retrofit first).
  - The 08-06 mis-dispatch (B11/B12/B13 at sonnet-medium against Opus-staffed rows) was
    ruled **canon-born** — pre-canon role docs; DISPATCHER.md's banner is the interim
    guard. This row is the fix the banner awaits.
  - Four **git-tracked** pre-canon tier files at `.claude/agents/` (fable-high,
    opus-high, opus-med, sonnet-med) exist per-branch on `feature/simmy`, `fix/perf`
    (snappy's home), `feature/user-manual` (manny's). Bodies are today byte-identical
    to canon's deployed grid where names coincide; `opus-med`/`sonnet-med` are
    D7-outlawed names. Same-name project tiers shadow the user-level canon grid.
    **Felix ruled the full sweep: delete on all three branches.**
  - B13's findings flag the builder stop-discipline as "the v2 retrofit's" — it closes
    by construction once kickoffs and the rider cite canon charters (DOCTRINE §5).

## Spec — the touch map

1. **Venue law.** All simmy doc edits + the `feature/simmy` tier deletion are commits in
   the simmy worktree; **never switch any shared checkout's branch**. The `fix/perf`
   sweep commit happens in the main checkout, the `feature/user-manual` sweep in its
   worktree (`.claude/worktrees/user-manual`) — each commit touches ONLY the four
   deletions (foreign campaigns' branches: minimal footprint).
2. **`simmy/DISPATCHER.md` → tombstone.** Replace the body: retired 2026-08-06 (v2 row
   07); Dispatcher law = `~/code/agents/canon/mantles/dispatcher.md`; rider =
   `spikes/RIDER.md`; board = `README.md §6`; original contract preserved in git
   history and cited by canon as birthplace. The banner dies with the body — its
   protections are superseded in the same commit (canonical board + rider).
3. **`spikes/RIDER.md` — instantiate** from the canon template (mantles README), three
   slots: agreements = `simmy/README.md §8`; bulletin = `simmy/spikes/BULLETIN.md`
   (worktree agents append via the MAIN checkout's absolute path, append left
   uncommitted); worktree specifics = branch-per-code-row, `feature/simmy` never
   switched. Harvest the old rider's proven wording (DISPATCHER.md §3) where it fits.
4. **`README.md` §6 — the board.** Headers `Question` → `Work`, `Session` → `Staffing`;
   every row's staffing converted to canonical `Mantle · tier` (`Opus · high (Builder,
   worktree)` → `Builder · opus-high (worktree)`; S-rows → Digger, B-rows → Builder;
   design/build splits keep their annotations). `MERGED` stays — it is the worktree-row
   annotation (LANDED + Architect merge done), not a lifecycle synonym. The role-system
   paragraph → canon pointers (mantles by path; the epigraph line becomes canon's
   current voice line verbatim); the staffing-rule paragraph → one line + pointer to
   the tier descriptions (the single home).
5. **True B14 on the board** while there: still IN FLIGHT, annotated — session lost to
   token limits 08-06; resumes post-retrofit by fresh summons (any account), staffing
   `Digger · fable-high` canonical. **No ruling on B14/B12/B13 content or merges** —
   that is the campaign Architect's, after resumption.
6. **`README.md` §8 — dedup to physics.** Remove what canon now carries (evidence-grade
   law, bulletin protocol, kill-fast — one pointer line to DOCTRINE §5–§6 + the rider
   replaces them). KEEP simmy's venue physics verbatim: one-OrbStack-machine-per-session
   + delete-on-land + the standing set; the live container is read-only; third-party
   code needs authorization BEFORE fetch/execute; lab-scratch rule; D5 (no UR binaries).
7. **Tier sweep ×3.** Per branch, pre-flight grep for the dead names (`opus-med`,
   `sonnet-med`) in live docs — snappy/manny expected clean (canon-era founding), the
   simmy board converts in this row; evidence in findings. Then delete
   `.claude/agents/{fable-high,opus-high,opus-med,sonnet-med}.md` on `feature/simmy`,
   `fix/perf`, `feature/user-manual`. `.claude/skills/helm/` untouched. After the
   sweep, same-name dispatch resolves to the user-level canon grid (bodies identical
   today — behavior change zero, drift risk dead).
8. **cap-mega `CLAUDE.md` (`feature/simmy` only).** Add the one D4 subproject pointer
   line (simmy tooling subproject → `simmy/README.md`). Branch drift between `fix/perf`
   and `feature/simmy` copies is NOT reconciled — out of scope.
9. **simmy D-entry (D16).** The retrofit ratification: canon governs roles, tiers,
   dispatch; DISPATCHER.md retired to tombstone; rider instantiated; tier files deleted
   on all three live branches (Felix's keel ruling). Felix countersigns in-session.
10. **`simmy/LEDGER.md` appended**; commits in Felix's git style, per branch as §1.

## Acceptance criteria — the DoD

- [ ] `git ls-tree <branch> .claude/agents/` empty on all three branches — output pasted.
- [ ] Per-branch grep: no live doc names `opus-med`/`sonnet-med` (history exempt —
  spike briefs, bulletin, ledger, tombstone provenance); evidence pasted.
- [ ] Board §6: canonical headers, every row `Mantle · tier`; B14 annotation present.
- [ ] `DISPATCHER.md` is a tombstone pointer; `spikes/RIDER.md` exists, three slots
  filled; the pre-canon banner gone.
- [ ] cap-mega `CLAUDE.md` (feature/simmy) carries the simmy pointer line.
- [ ] Canon untouched: `git -C ~/code/agents status` clean, pasted.
- [ ] simmy D16 cut with Felix's countersign recorded; simmy ledger appended; commit
  hashes for all three branches listed here.
- [ ] Cold-boot walk narrated in findings (no actual dispatch): a fresh Dispatcher
  summoned per canon (dispatcher.md + board + rider) would dispatch B14's resumption
  with the right tier quoted from the call.

## Out of scope

- Ruling on B14/B12/B13 content, merges, or batch-9 close — the simmy Architect's,
  post-resumption.
- Editing spike briefs, `BULLETIN.md`, ledger history, or landed findings.
- Reconciling cap-mega `CLAUDE.md` branch drift beyond the one pointer line.
- snappy/manny docs (their branches receive ONLY the tier-deletion commit).
- The bob repo (unmerged bob branches are Felix's); `.claude/skills/helm/`.
- Any edit to the agents repo — canon gaps are escalations to the Grand Architect
  (the harvest queue), never a local patch.

## Findings

*(append here — evidence-grade)*

---

**Kickoff (verbatim):**

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then, working in ~/code/universal_robots_sdk/cap-mega/.claude/worktrees/simmy,
read ~/code/agents/canon/work/DOCTRINE.md, ~/code/agents/canon/mantles/README.md,
~/code/agents/plans/07-simmy-retrofit.md, and simmy/README.md §6 + §8,
simmy/DISPATCHER.md, and the simmy/LEDGER.md tail,
and execute the retrofit to its DoD.
```
