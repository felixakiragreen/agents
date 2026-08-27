# P5 — permission physics (S5)

**Status:** OPEN · **Depends on:** — · **Staffing:** Digger · opus-high

Probe #1 of the flow chapter ([flow-keel.md](flow-keel.md) §5.2). The engine
(B11) will fire sessions nobody is watching; whether they can *work* unattended
is this brief's question, and its kill criterion shapes the chapter.

## Questions

1. **Q1 — the mechanism.** Where does a spawned session's permission posture
   come from? P2 §S5 observed spawned sessions booting into **manual mode and
   blocking on the first tool call** despite `permissions.defaultMode: auto` on
   the account — yet the flow-cut Architect (fired from `/summon`,
   2026-08-27) ran `mode:auto` end to end. Both facts are real; isolate what
   differs. Candidates to separate: cmux's per-session `--settings` injection
   (the flow-cut session's argv shows it injecting **hooks only** — no
   `permissions` key; verify), the account's `settings.json`, the project's
   own `.claude/settings.json`, and **trust state** (B7 F1: an untrusted
   project root stalls at the folder-trust dialog *before* any mode matters —
   P2's probes ran in scratch workspaces; decide whether S5's "manual mode"
   was ever a permission mode at all, or the trust dialog wearing its
   clothes).
2. **Q2 — sustained unattended work, the matrix.** A fired session must
   perform real tool work to completion with zero human touches: ≥10 tool
   calls including Write/Edit, Bash, and a `git commit`, then land. Prove it
   per account (×3) in (a) a trusted repo root and (b) a worktree of a
   trusted repo. The flow-cut sitting is the **standing positive control**
   for {personal · trusted root · master} — census `mode:auto` on every beat,
   dozens of unattended calls (ledger 2026-08-27) — do not re-derive that
   cell; probe the others.
3. **Q3 — the stall, reproduced with a control.** Recreate P2's stall
   deliberately (a fresh directory / fresh `git init` matches B7 F1's stall
   signature: process alive, zero census beats, no transcript) and name the
   blocking mechanism precisely. Then find the **minimal lever that clears it
   without exceeding the account's own posture** — candidates: pre-seeding
   trust (how does Claude Code record a trusted root? file, per account —
   find it and test writing it), `--permission-mode` or equivalent argv,
   a project `.claude/settings.json` carried in the venue. A lever that works
   is measured (the same venue goes stall → sustained work, N=2 each way).
4. **Q4 — the resume path.** A shelf resume (`--resume`, B5's path) into tool
   work: does the resumed session carry the same posture as its first life?
   One probe: fire, let it land, resume it with an instruction that requires
   a tool call, measure.
5. **Q5 — the step clause.** Emit the engine's **permission clause**: the
   exact field(s) a flow step must carry (if any), the venue **trust
   precheck** the engine must run before firing (B7 F1's per-account
   project-root rule — the composer's `trust.ts` already computes a verdict;
   say whether it is sufficient as-is), and the refusal rule: a step whose
   venue fails the precheck **refuses at arm time, loudly** (D10's family —
   never a silent mid-flow stall). This clause is B10's schema input and
   B11's fire-gate input.

## Inputs — read before working

- [flow-keel.md](flow-keel.md) §§4–5 — the contract this probe serves.
- [p2-spawn-recipe.md](p2-spawn-recipe.md) §S5 (line ~323) — the original
  observation, verbatim.
- [b7-summon-composer.md](b7-summon-composer.md) F1 — trust is the project
  root, per account, never inherited; 36/36 live trust entries sit on roots.
  `glass/trust.ts` is the computed verdict.
- [p1-census-join.md](p1-census-join.md) — `mode` rides every census event;
  the deploy note recorded `permissions.defaultMode: auto` on `~/.claude`.
  Verify the other two accounts' defaults rather than assuming.
- The standing positive control: ledger 2026-08-27 (flow-cut sitting) — its
  census rows (`mode:auto`, sid `d28a1397…`) and audit line (20:42:21Z).
- README §§2, 5 — the fence and the venue agreements. **Fires go through the
  glass's own `/hands/fire`** (dogfood; every probe fire is audited evidence).

## Method

Suggested route, not law: (1) read the injected `--settings` of a live spawned
session from `ps` and the account settings ×3 — the mechanism map on paper
first; (2) the Q2 matrix with haiku-low probe sessions whose summons is a
self-contained work script ("write file X, run command Y, commit, exit") in a
scratch **subdirectory of `~/code/agents`** (trusted, probes-commit-to-master
law — keep probe commits to `belvedere/lab/p5/` paths only) and in a
`bv/p5-*` worktree; (3) the Q3 stall arm in a fresh dir outside any trusted
root, control arm beside it; (4) Q4 last. Every claim carries its command +
output; the stall probes ship with the positive control run the same hour.

**Venue law:** the desktop is Felix's live screen — ≤2 concurrent spawned
probe sessions, every probe workspace closed at landing (D55), no cmux
quit/relaunch (P4-class excluded), no edits to cmux settings or any account
`settings.json` — posture is *read and worked around*, never re-postured;
re-posturing an account is Felix's, escalate if it is the only lever.

## Kill criteria

- **The chapter-shaper:** if no lever ≤ the account's own posture yields
  sustained unattended tool work in a *trusted* root on all three accounts →
  STOP, document, escalate to Felix: the engine chapter re-scopes to attended
  flows. This is the keel's named kill (§5.2).
- If the stall reproduces **only** in untrusted venues → not a kill: the
  finding is the trust precheck (Q5 clause), and the chapter proceeds.
- A lever that requires exceeding the account posture (`bypassPermissions`,
  editing account settings) → that arm stops; the lever is named in findings
  as ruled out by the posture floor (batch-4 note, blessing item 2).
- One session; if Q4 would not fit at quality, land Q1–Q3+Q5 and name Q4 a
  bounded remainder — never a rushed answer.

## Deliverables

Findings below (evidence-grade, controls named); **the permission clause as
its own findings subsection** (B10/B11 consume it verbatim); `lab/p5/`
scripts; probe workspaces closed; board row + ledger trued.

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/flow-keel.md §5,
and ~/code/agents/belvedere/plans/p5-permission-physics.md,
and execute the brief.
```
