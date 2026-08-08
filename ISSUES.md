dispatcher @ sonnet-medium

Baton — the next move is yours or the Architect's: review and merge spike/b15-maturation-deadend into feature/simmy.

>> Is this a valid baton hand-off?

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
