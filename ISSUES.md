# Issues — the incident inbox (D49)

Field reports and canon-fold candidates land here — Felix's hand, or a session's at
his word. The Grand Architect sweeps at every summons: each entry is ruled fold or
no-fold, then deleted — the D-entry records a fold, the sweep's ledger line records a
rejection, and git keeps the bytes (entries are committed before they are drained).
A swept inbox is empty.

---

From Felix:

I like ISSUES, I'd like to consisder possibly extending it to be something all projects have by default. Primary purpose is for the Sovereign to add things while working on different projects or with null mantles. (I told a Rooted null mantle to add their problem to ISSUES for the Architect to review later; we frequently add things to simmy/ISSUES when we're using simmy, but not working on it.) Something to consider.

---

From Felix:

Additionally, I'm thinking of renaming GENESIS. Doesn't feel like the best name if it's the Master Plan or Master Doc.README would be more appropriate, although, I think I'd keep the README more for the purpose of: "How to start using & very high level of where everything is (like a thumbnail)". The GENESIS/MASTER_PLAN serves a different purpose. I don't like MASTER_PLAN though because it's two words. Blueprint is okay. Map is better. Ooh, I kind of like Map, leading contender right now.

---

From the cornerizer Architect, at Felix's word (2026-08-16):

**A running batch can be amended — an Architect should reach for that before cutting a
new batch.** Cornerizer batch 8 was mid-flight (one Builder row) when a freshly-cut spike
row had no real dependency on it; the Architect had sequenced it as "batch 9, after
batch 8" purely because both would have written the shared campaign tree. Felix asked
"can't we just pass a line to the current Dispatcher?" — and yes: give the new row its
own worktree, raise the ceiling, commit the amendment to the batch note, hand the
Dispatcher one message. The convention (pure-analytic rows ride the shared tree) had
been masquerading as a dependency. Candidates for canon: (1) the Dispatcher mantle
states that its batch is amendable mid-flight by the Architect — a new row arrives as a
message, same contract as the original summons; (2) the Architect mantle's batch-cutting
step asks "is a Dispatcher already running whose batch this row can join?" before
cutting a sequenced batch — we could have done this earlier and didn't think of it.
One wrinkle from the same incident: agent-to-agent relay of the amendment failed —
ListAgents showed no Dispatcher (likely another account silo; sessions never cross
accounts), so the relay went through Felix's hand. An amendment protocol should name
that fallback: the Architect drafts the message verbatim; whoever can see the Dispatcher
delivers it.

---

From Felix:

I want JS/TS projects to default to using bun & bun test, not npm & vitest. I've had to specify this twice now. It doesn't *feel* like Canon or a Decision thing. Besides, there will probably be a new JS runtime tomorrow, so it needs to be regularly update-able. But, it's overkill to put in the global CLAUDE.md. I'm unsure.

---

From Felix:

Invocations need to be able to customize and/or auto-derive session names. For example:
- grand-architect-08, next is grand-architect-09
- architect-whiteboardy-02, next is architect-whiteboardy-03

---

From Felix:

Architects are still making memories, is this a problem? I thought memories were limited to the account, and I switch accounts freely: 

<quote>

Bash(git add docs/cornerizer.md && git commit -m "cornerizer: batch 8 review - C14+C15 merged, E-C15 rulings, KEEP SHIPPED ratified, baton to C6 iron" && git log --oneline -4)
[feature/cornerizer c75e4e32] cornerizer: batch 8 review - C14+C15 merged, E-C15 rulings, KEEP SHIPPED ratified, baton to C6 iron
 1 file changed, 118 insertions(+), 6 deletions(-)
c75e4e32 cornerizer: batch 8 review - C14+C15 merged, E-C15 rulings, KEEP SHIPPED ratified, baton to C6 iron
7f447cf3 cornerizer: merge C15 - free-leg fidelity spike, verdict KEEP SHIPPED
f70fdfab cornerizer: merge C14 - measured-torch constants + D15, shipping restore_radius 12.5 / blendRotation 15
83ac03cb cornerizer: batch 8 resolved - C14 and C15 both landed, board trued, baton to Architect review

⏺ Write(/Users/felix/.claude-thg-doorbell/projects/-Users-felix-code-universal-robots-sdk-cap-mega/memory/project_cornerizer.md)
Wrote 31 lines to /Users/felix/.claude-thg-doorbell/projects/-Users-felix-code-universal-robots-sdk-cap-mega/memory/project_cornerizer.md
---
name: project-cornerizer
description: "Cornerizer campaign (inside/outside corners) — SSoT docs/cornerizer.md, branch feature/cornerizer; state as of the b
atch-8 review 2026-08-16"
metadata:
  node_type: memory
  type: project
  originSessionId: 06778e3b-ff9e-446b-a77e-b754f94a4549
  modified: 2026-08-16T20:07:30.751Z
---

Corner-shaping campaign for weld corners; SSoT `docs/cornerizer.md` (board §8, log §21),
worktree `.claude/worktrees/cornerizer` on branch `feature/cornerizer` — `dev` untouched
until the clo
attitude — recover the lean via `c15.recover_beta_deg` first. See [[project-snappy-campaign]]
for the perf-tier law the campaign runs under.

⏺ Bash(grep -n "Snappy campaign" /Users/felix/.claude-thg-doorbell/projects/-Users-felix-code-universal-robots-sdk-cap-mega/memory/MEMORY.md | head -1)
40:- [Snappy campaign](project_snappy_campaign.md) — perf + tree-ops campaign, **CLOSED 08-07** (28 rows LANDED in 4 days, D1-D25; row 28's review = close boundary); SSoT snappy/README.md, results snappy/IMPACT.md (6-25× gestures, 43s paste → 3s, boot 13.3 → 7.4s, 31/31 goldens byte-identical — the welding never moved); reconciler per docs/derived-state.md; perf tier = permanent law (D21, CLAUDE.md §11.1); **row 13 (modbus bench) survives chartered, bench-gated**; open by design: B7/B8/B9 + B1/B4/B5 helm frames (Felix's), "No Controller" PENDING-bench (suspect = our own attemptRebuild → reset_world_model); durable venue laws in the memory file (§6.9(f)/(g), state law, quiescence); snappy/LOG.md = Architect's Log (D40)

⏺ Update(/Users/felix/.claude-thg-doorbell/projects/-Users-felix-code-universal-robots-sdk-cap-mega/memory/MEMORY.md)
Added 1 line
- [SpaceX dashboard](project_spacex_dashboard.md) — BATTLE-PROVEN in first real SpaceX meeting 07-31 (seamless, double fist bumps
 — interaction model is proven, not provisional); felix/spacex-dashboard/ (server.py :37788, index.html, state.json = LIVE MEETIN
G DATA, README.md = SSoT contract); keyboard-first (v2 deleted all hover buttons/fades on request), kill old PID before relaunch
after file moves
- [Manny campaign](project_manny.md) — user-manual campaign; keel laid 08-06 (GA fable-max, `809d6ac2`): manny/keel.md + initial.
md + 4 research probes; calibrations ratified (home manny/, manual+quickstart, md→Typst ONE-WAY, hardware ch. in); manual = compi
ler+corpus, no skill tiers, popup-string-identical troubleshooting headings; NEXT = founding Architect summons (verbatim in keel
tail + memory file)
- [Parameters node](project_parameters_node.md) — contract BLESSED 08-08 (docs/node-global-parameters.md = SSoT, branch feature/n
ode-param); ladder A (GLOBAL above SHARED), rows = target-atom MANUAL subkeys on own model, zero caches; row A LANDED 08-08 (audi
t 117/117); board trued to canon D42-D45: Dispatcher-run serial chain B→G1→C→D→G2→F1 (summons planted §10.1, kickoffs §10.3, ruli
ngs 1-14 in §11); next = Felix fires the Dispatcher summons
- [Cornerizer campaign](project_cornerizer.md) — inside/outside corner shaping, SSoT docs/cornerizer.md on feature/cornerizer; ba
tch-8 review 08-16: C14+C15 merged, shipping restore_radius 12.5 / blendRotation 15, free-leg KEEP SHIPPED (no C16); only gate le
ft = C6 iron + Corner.type wording grant; harness-case literal-pin trap + direction-not-value safety pins in the memory file
- [Snappy campaign](project_snappy_campaign.md) — perf + tree-ops campaign, **CLOSED 08-07** (28 rows LANDED in 4 days, D1-D25; r
ow 28's review = close boundary); SSoT snappy/README.md, results snappy/IMPACT.md (6-25× gestures, 43s paste → 3s, boot 13.3 → 7.
4s, 31/31 goldens byte-identical — the welding never moved); reconciler per docs/derived-state.md; perf tier = permanent law (D21
, CLAUDE.md §11.1); **row 13 (modbus bench) survives chartered, bench-gated**; open by design: B7/B8/B9 + B1/B4/B5 helm frames (F
elix's), "No Controller" PENDING-bench (suspect = our own attemptRebuild → reset_world_model); durable venue laws in the memory f
ile (§6.9(f)/(g), state law, quiescence); snappy/LOG.md = Architect's Log (D40)
- [Waypoint-stepper campaign](project_waypoint_stepper.md) — Process-toolbar situ tracker + split Play/Hold; SSoT docs/waypoint-s
tepper/README.md; batch 3 (X2→07→08 serial) cut 08-11: Play performs the move (D13), layout D14, deadman probe-vs-host trap
- [TIG AVC campaign](project_tig_avc.md) — founded 08-11: docs/tig-avc.md = SSoT (contract+board, rulings 1-4 incl. five-option t
axonomy blessing that settles helm E10-2), branch feature/tig-avc; gate 00 LANDED 08-11 (toml reconcile, Felix's ruling via agent
 hands `12f5a613`); dispatch cut for Dispatcher·sonnet-medium (batch note 2 + rider §8.7, summons planted in doc); next = Felix f
ires the Dispatcher summons

⏺ Bash(git status --short | wc -l && git log --oneline -1)
0
c75e4e32 cornerizer: batch 8 review - C14+C15 merged, E-C15 rulings, KEEP SHIPPED ratified, baton to C6 iron

</quote>

---

From Felix:

Linking. Is there a way to make all markdown documentation contain links to the various places they reference? So many times I'm reading and it says: GENESIS §7.6, S5 (plans/s5-smb-backup.md), etc. Then I have to manually go find it, and it takes like a minute sometimes. I know there is linking like: `[S5](plans/s5-smb-backup.md#S5)`, is that what we should do? Or should I just find a VSCode extension that does it automatically for me? But when I do this: [Decisions D19](DECISIONS.md#D19) it works great.

---

From Felix:

I've seen agents encounter this error over a dozen times:
Error: `prompt` is required when `stop` is not true.

They always figure it out, but isn't there a better way to avoid this?
---

From the cornerizer Architect, at Felix's word (2026-08-19):

**An Architect issued two confidently wrong geometry verdicts in one sitting, and the
system — not the agent — failed to deliver the information that would have prevented
both.** The incident: a bench collision report (L1, an Inside corner turning upward)
arrived mid-session in the interactive Architect session. The Architect diagnosed at
chat speed — first "angle mismatch, 127° metal declared 90°", then "the corner via is
taught 26 mm short" — and issued bench guidance on each. Both were wrong readings of
the campaign's own design: the via is a GUIDELINE (LINE 1 = prev→via extended; the
apex is always COMPUTED, never taught — `docs/cornerizer.md` §1, sitting ~1,300 lines
above the board section the session had worked from all day). Felix corrected the
Architect twice from his own knowledge. Cost: two retractions, one board row cut on a
phantom and re-cut, and interim bench guidance that had to be walked back.

Why more kickoff reading would NOT have fixed it, and what might:

1. **Kickoffs scope reading to the staffed job; sessions drift jobs.** The summons
   said "read §8, review the batch" — correct for the review it staffed. The session
   then absorbed merges, grants, a UI fix, and a live forensic. Nothing in the system
   re-triggers reading when the QUESTION CLASS changes mid-session. Candidate canon
   (mantle-level): *a verdict about geometry, emission, or user-visible behavior
   cites the contract section it stands on — no citation, no verdict.* This fires
   exactly when needed and costs nothing when not; front-loading whole-doc reads
   taxes every session for a failure that only bites on drift (and a §1 read three
   days of context ago may not surface at the moment of confident wrongness anyway).
2. **A campaign board is self-sufficient for board work, and that is a trap.** An
   Architect can run many sessions entirely on §8 + briefs + log, build true mastery
   of the CAMPAIGN's state, and never internalize the CONTRACT (§1–§5). The doc's own
   structure invites it: every summons points at the operational sections. Candidate
   canon: campaign docs carry a one-screen **load-bearing invariants block** — the
   5–10 facts that make chat-speed answers wrong ("the via is a guideline, never the
   corner"; "all clearance numbers assume horizontal seams") — and the summons
   grammar gains a line naming it, so every session inherits it as PUSH, not pull.
   This is Felix's stigmergic principle stated as mechanism: it can never be the
   agent's job to go looking when in doubt — doubt doesn't announce itself; the
   environment must deliver.
3. **The interactive Architect session has no Digger discipline, and it is exactly
   where incidents land first.** Dispatched rows get briefs, fences, kill criteria;
   the session Felix talks to gets a human waiting at a bench and zero guardrails.
   Candidate canon (mantle-level): *a bench/field incident is a Digger-shaped
   question — first move is the governing contract + findings; the first analysis is
   a hypothesis until the lab reproduces it; what leaves the session before that is
   labeled hypothesis, never guidance.*
4. **What went RIGHT, for calibration:** the same session had spent the whole day
   merging, verifying, and cutting briefs correctly off §8-scoped reading — the
   scoping was right for the staffed work. And once corrected, the contract read
   took ~2 minutes and settled everything. The gap is a trigger problem, not a
   diligence or capability problem.

Cornerizer has adopted the local form of 1+3 (its §8 "verdict law" + a rider line,
2026-08-19). This entry asks whether they fold into the Architect mantle and the
campaign-doc/summons templates Guild-wide.
