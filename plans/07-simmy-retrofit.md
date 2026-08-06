# 07 — simmy retrofit

**Status:** LANDED 2026-08-06 · **Depends on:** — · **Staffing:** Architect · fable-high ·
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

- [x] `git ls-tree <branch> .claude/agents/` empty on all three branches — output pasted (F3.1).
- [x] Per-branch grep: no live doc names `opus-med`/`sonnet-med` (history exempt —
  spike briefs, bulletin, ledger, tombstone provenance); evidence pasted (F1, F3.2).
- [x] Board §6: canonical headers, every row `Mantle · tier`; B14 annotation present (F3.3).
- [x] `DISPATCHER.md` is a tombstone pointer; `spikes/RIDER.md` exists, three slots
  filled; the pre-canon banner gone (F3.4).
- [x] cap-mega `CLAUDE.md` (feature/simmy) carries the simmy pointer line (F3.5).
- [x] Canon untouched: `git -C ~/code/agents status` clean, pasted (F3.6).
- [x] simmy D16 cut with Felix's countersign recorded; simmy ledger appended; commit
  hashes for all three branches listed here (F3.7).
- [x] Cold-boot walk narrated in findings (no actual dispatch): a fresh Dispatcher
  summoned per canon (dispatcher.md + board + rider) would dispatch B14's resumption
  with the right tier quoted from the call (F4).

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

**F1 — pre-flight grep (spec item 7): word-bound the probe or it lies.** A naive
`grep "opus-med\|sonnet-med"` false-positives on every canonical name (`opus-med` is a
substring of `opus-medium`) and flagged 10 snappy/manny files that were in fact clean.
The honest probe: `grep -rlnE "(opus|sonnet)-med\b" --include="*.md"`, per branch,
pre-retrofit:
- `fix/perf`: `simmy/DISPATCHER.md` only — snappy's own docs clean (canon-era founding,
  as the spec predicted).
- `feature/user-manual`: `simmy/DISPATCHER.md` only — manny clean.
- `feature/simmy`: `simmy/DISPATCHER.md:48` only (the old §3 dispatch rule's tier list).
  The board's cells used `Opus · med` spacing — a different string, converted this row.

**F2 — the keel's "byte-identical" claim was wrong at the byte level, right at the
level that matters.** `git show HEAD:.claude/agents/fable-high.md | diff -
~/code/agents/canon/agents/fable-high.md` → the only hunk is YAML `description:`
line-wrapping (canon wraps the scalar across lines; the project copies hold one line);
same for `opus-high`. `model:`, `effort:`, and the body are identical;
`opus-med`/`sonnet-med` have no canon counterpart (D7-outlawed names). Deletion's
behavior change is still zero — by semantic identity, not byte identity. Disclosed to
Felix at the D16 countersign. **Harvest note for the Grand Architect** (no local patch —
out of scope): canon's wrapped plain scalars fold with a stray space when YAML-parsed
(`opus-high`'s description parses as "bounded-but- gnarly") — cosmetic, grid-wide wrap
pattern, worth one sweep.

**F3 — DoD evidence.**

1. `for b in feature/simmy fix/perf feature/user-manual; do git ls-tree $b
   .claude/agents/; done` → empty output for all three (zero rows printed).
2. Post-retrofit residual grep (same word-bounded probe): `feature/simmy` →
   `simmy/README.md` only, and the hit is D16 itself naming the four files it deleted —
   deletion provenance (decisions are never rewritten). `fix/perf` and
   `feature/user-manual` → `simmy/DISPATCHER.md` only: the stale branch-drift copy of
   simmy's tree as seen from foreign branches; simmy's live line is `feature/simmy`,
   foreign branches receive only the deletion commit (spec item 1, minimal footprint),
   and drift reconciles at merge (spec item 8 / D32 non-goal). No snappy or manny doc
   names a dead tier on any branch.
3. Board §6: headers `| ID | Work | Depends on | Staffing | Status |`;
   `grep -E "\| (Opus|Fable|Sonnet) ·" README.md` → no matches (zero pre-canon staffing
   cells across all 20 rows); S-rows → Digger, B-rows → Builder, S7's design/build split
   and the worktree/venue annotations kept. B14 annotation present: "session lost to
   token limits 08-06 — resumes post-retrofit by fresh summons, any account".
4. `DISPATCHER.md` is a 14-line tombstone (canon `dispatcher.md` · `spikes/RIDER.md` ·
   board §6); the pre-canon banner died with the body, its protections superseded in the
   same commit (canonical staffing + "the tier string IS the `subagent_type`" now live
   on the board itself). `spikes/RIDER.md` exists, three slots filled: agreements =
   `README.md §8`, bulletin = `spikes/BULLETIN.md` with the main-checkout-path append
   rule and Dispatcher-commits wording harvested from the old rider, worktrees =
   branch-per-code-row + `feature/simmy` never switched.
5. cap-mega `CLAUDE.md` (feature/simmy) §1, line 68: "The simmy tooling subproject (our
   own URSim runtime + test venue) keeps its docs, board, and lifecycle with itself →
   `simmy/README.md` (simmy D4)."
6. Canon untouched: this session's only agents-repo writes are the D32 countersign mark
   in `DECISIONS.md` (swept into Felix's own commit `5b32514`), this findings append,
   the ledger entry, and the board row (`GENESIS.md`) — nothing under `canon/`.
   Pre-commit `git status --short` showed exactly `GENESIS.md`, `LEDGER.md`,
   `plans/07-simmy-retrofit.md`; clean after the landing commit.
7. simmy D16 cut in `README.md §7`, countersigned ✓ Felix in-session (2026-08-06, after
   the F2 correction was disclosed). Commits — `feature/simmy`: `22269c3e` (tier
   deletion) + `1d8a28df` (tombstone, rider, board, §8, D16, CLAUDE.md pointer, ledger);
   `fix/perf`: `3bc872b3` (deletions only); `feature/user-manual`: `82e55578`
   (deletions only). simmy `LEDGER.md` appended in `1d8a28df`.

**F4 — cold-boot walk (narrated, nothing dispatched).** Felix opens a fresh session:
"You are a Dispatcher at sonnet-medium. Wear ~/code/agents/canon/mantles/dispatcher.md,
then run the board at
~/code/universal_robots_sdk/cap-mega/.claude/worktrees/simmy/simmy/README.md §6."
The session wears the charter and clears §1 prerequisites: board trued (this row), tree
committed clean, and `fable-high` exists in the account's agents dir — the deployed
canon grid, now the ONLY definition that name resolves to, since the project shadow is
deleted. B14's row reads `**Digger · fable-high** (worktree, read-only on B12's
branch)` with the resume annotation authorizing re-dispatch of the orphaned row.
Charter §2: type = the row's staffing tier verbatim → `Agent(type=fable-high,
prompt=<b14 brief's "Kickoff prompt (verbatim)"> + <spikes/RIDER.md, verbatim>,
isolation=worktree)`, and the dispatch report quotes `fable-high` from the call. The
B11/B12/B13 miss class is structurally dead: the board cell IS the call string — no
translation step remains for a report to misstate. B13's builder stop-discipline flag
closes the same way: the kickoff + rider now cite canon charters whose forbidden lists
carry the stop law (DOCTRINE §5).

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
