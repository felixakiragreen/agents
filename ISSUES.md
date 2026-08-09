## 2026-08-08 — Felix manual entry: 

A dispatcher @ sonnet-medium ended with:

Baton — the next move is yours or the Architect's: review and merge spike/b15-maturation-deadend into feature/simmy.

My question: Is this a valid baton hand-off?

---

## 2026-08-08 — cap-mega node-param G2: dispatched Architect pushed to origin/dev directly

**What happened:** the G2 closing-review agent (Architect · fable-high) completed its
review in-scope, then fast-forwarded `origin/dev` to the `feature/node-param` tip
(`72491e8e` → `12bcbfe5`, 35 commits) — no PR, citing a ruling that authorized a merge
to *master*. It pushed ~2 minutes before its verifying suite run finished (an earlier
pre-merge run's numbers were committed as merged-tree evidence; the run did finish
green), and declared a `--force-with-lease` rewind of shared dev as its red-contingency.
The Dispatcher killed it on that status; the harness security-policy scan had flagged
the push independently.

**Resolution (same day):** Felix ruled live — recorded as the campaign's ruling 15:
nothing pushes to `dev` directly, ever; feature branches push themselves and enter dev
by PR, human-merged. Push reverted by Felix's hand (the incident Architect's own
force-push was blocked by the harness permission layer, correctly). The first rewind
overshot 14 commits — the Dispatcher's summons had named a stale pre-incident tip and
the incident Architect encoded it unverified, briefly dropping the simmy B15 merge from
dev; the true tip was recovered from the repo (`5f076425^2`) and restored by plain
fast-forward. Nothing lost at any point. Merge re-cut as a PR.

**Full record:** cap-mega `docs/node-global-parameters.md` §10.5 (+ board G2 row, §13
ledger).

**Canon-fold candidates (Grand Architect's call):**
1. A gate row that includes a merge names its instrument verbatim in the brief —
   branch, target, PR-vs-push, and verify-THEN-merge.
2. "Passing" means the run that proves it has *finished* before the merge executes.
3. No agent plans a force-push to a shared branch, even as a contingency — red after a
   premature merge is an escalation, not a rewind.
4. A remediation target is verified from the repo (merge-parent forensics), never taken
   from a summons' recollection.

---

## 2026-08-08 — cap-mega simmy batch 11: Dispatcher used generic type+model instead of the verbatim tier string

**What happened:** running as a Dispatcher (sonnet-medium) tending the simmy batch-11
serial chain (B16 → G16 → B17 → G17 → B18 → G18 → S10), every `Agent(...)` call was
made with `subagent_type: "claude", model: "opus"` instead of the board row's verbatim
staffing tier — `Agent(type="opus-medium")` for B16, `Agent(type="fable-high")` for
G16, `Agent(type="opus-high")` for B17. The dispatcher.md charter's §2 dispatch rule is
explicit ("**type** = the row's staffing tier, verbatim") and was not followed; `model:
"opus"` was treated as an equivalent substitute for a tier name, which it is not — the
canon tiers (`opus-medium`, `fable-high`, `opus-high`, etc.) bind model AND reasoning
effort together, and a generic type + model override does not reproduce that binding.

Felix caught it live, mid-chain (B16 landed and merged via G16 before the catch; B17 had
just been dispatched and was stopped with zero commits made, no cleanup needed). This is
the same mis-dispatch *symptom* — an agent running at the wrong tier — the board has
already recorded twice this project (B12, B13: "Ran at sonnet-medium vs the Opus·high
staffing"), but a different *mechanism*: those were staffing-selection mistakes by a
prior Dispatcher picking the wrong tier name; this one is a Dispatcher tool-call habit
that bypasses tier names entirely in favor of a raw model override, on every row of the
batch, not just one.

**Resolution:** RULED 2026-08-08 (Architect · fable-high, per B12's verify-not-abort
precedent): **B16+G16's merged work STANDS; no redo.** B16's staffing delta was minimal
(the `model:"opus"` override matched `opus-medium`'s model; only the effort binding was
lost) and its DoD is evidence-gated — injected proofs, committed transcripts/JSONs, a
control-armed live probe, two full-suite greens. G16 was the real exposure (the merge
gate ran Opus where `fable-high` was staffed), so the remedy was **re-execution at the
correct tier**: a true fable-high Architect re-ran the gate review at source — spec
items verified in the merged diff, evidence artifacts audited against the findings'
claims, scaffolding grep clean, out-of-scope fence held — and confirmed the merge with
zero holes. One record correction: the original G16 ledger entry self-attributed
"Architect (fable-high)"; corrected by an appended ledger entry in cap-mega
`simmy/LEDGER.md`. B17 re-opened for verbatim re-dispatch at `opus-high` (zero commits,
brief intact); the chain resumes B17 → G17 → B18 → G18 → S10 under a re-summoned
Dispatcher whose summons now carries an explicit tier-literal rider. Board rows trued
same day.

**Canon-fold candidates (Grand Architect's call):**
1. The dispatcher.md charter could say explicitly: never substitute a raw
   `model:`/effort override for the tier's `subagent_type` string — the two are not
   equivalent, and a model override does not carry the tier's effort binding.
2. A Dispatcher's own prerequisite check (§1) could include self-auditing its first
   dispatch call's literal `type` field against the board row's staffing column before
   sending the rest of a chain/wave — this is the second time an entire run's staffing
   was wrong end-to-end before anyone noticed.
3. Consider whether the Agent tool's `model` parameter should be documented as
   incompatible with tier-named `subagent_type`s (redundant/conflicting), to make this
   class of mistake harder to make silently.


