# 12 — the dispatch guard

**Status:** OPEN · **Depends on:** — · **Staffing:** Builder · opus-high
**Blessed:** Felix, 2026-08-08 — cut and spec direction countersigned at the D46–D49
sitting (mechanism, scope, staffing per the Grand Architect's proposal, same date).

## Mission

Make the batch-11 dispatch failure mechanically impossible: no Agent call in a Guild
project carries engine overrides — the tier grid is the only engine authority. This is
D47's mechanical arm, built as venue tooling per 05's rejection terms ("canon states
the law; venues enforce their own physics"): a deterministic, repo-committed guard,
not canon law.

## Inputs — read before working

- D47 (`DECISIONS.md`) and `canon/mantles/dispatcher.md` §2 — the law this enforces.
- `ISSUES.md`, batch-11 entry — the failure verbatim: every dispatch went out
  `subagent_type: "claude", model: "opus"`; the effort binding silently lost.
- Hooks: https://code.claude.com/docs/en/hooks.md — PreToolUse matches the `Agent`
  tool; `tool_input` arrives as JSON on stdin; deny via `permissionDecision: "deny"`
  + reason, which the calling model sees and can act on. Project scope:
  `.claude/settings.json`, committed to the repo.
- Known, do not re-derive: agent definitions load at session start (D8); the 20-tier
  grid is deployed ×3 (GENESIS §4).

## The order

Build `guard/` at the repo root (peer of `sync/` and `summon/` — tooling, not
canon-law, D34's precedent):

1. **The hook** — reads the PreToolUse JSON; DENIES any `Agent` call whose
   `tool_input` carries `model` or `effort`, with feedback naming the law: engine
   overrides never ride a dispatch — use `Agent(type=<tier>)`; the canon grid
   (`canon/agents/`) binds model AND effort. Everything else passes untouched: bare
   `subagent_type` values (tiers, `general-purpose`, `Explore`, `Plan`, …) are not
   this guard's business.
2. **The settings fragment** — the `PreToolUse` block a project pastes into its
   `.claude/settings.json` and commits.
3. **`guard/README.md`** — install (paste + commit), what it denies, what it
   deliberately does not (see fence), uninstall.
4. **The harness** — `lab/12/run`, assertions with control arms (DOCTRINE §6.2):
   - **deny arm:** a call with `model:` is denied AND the caller, given the feedback,
     retries with a bare tier type that passes — the loop proven live;
   - **pass arm (control):** `subagent_type: "opus-medium"` alone passes untouched;
   - **false-positive arm (control):** `Explore` / `general-purpose` without engine
     params pass;
   - **the Workflow question,** answered with evidence either way: do Workflow-script
     `agent(prompt, {model, effort})` calls route through PreToolUse? If yes, prove
     the deny + retry there too; if no, README names the hole.

## Definition of done

- [ ] All four harness arms green in `lab/12/run`, output pasted here.
- [ ] The deny feedback text quoted here verbatim, shown inducing a correct retry.
- [ ] The Workflow surface answered with evidence; README states the result.
- [ ] `guard/` complete: hook + fragment + README; install is paste + commit.

## Out of scope — the fence

- Adopting the guard anywhere — cap-mega adoption is its own Architect's row; this
  repo's `.claude/settings.json` stays untouched (rare dispatches, Felix in the room).
- Board-intent validation (a *legal* tier contradicting the staffing column) — a hook
  cannot read intent; that stays D47's first-dispatch audit.
- Any canon edit — gaps escalate (harvest law).
- Any sync-set change — the fragment rides project repos, never `~/.claude*`.

## Findings

*(append here)*

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the order at ~/code/agents/plans/12-dispatch-guard.md.
```
