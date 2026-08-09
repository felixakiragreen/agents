# 12 — the dispatch guard

**Status:** LANDED 2026-08-08 · **Depends on:** — · **Staffing:** Builder · opus-high
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

- [x] All four harness arms green in `lab/12/run`, output pasted here.
- [x] The deny feedback text quoted here verbatim, shown inducing a correct retry.
- [x] The Workflow surface answered with evidence; README states the result.
- [x] `guard/` complete: hook + fragment + README; install is paste + commit.

### Evidence — `./lab/12/run`, cold run 2026-08-08 (out/ wiped, four live sessions)

```
lab/12 — four live arms against the shipped guard
  … deny
  … pass
  … types
  … workflow

lab/12 — ruling on /Users/felix/code/agents/lab/12/out

deny — an engine override is refused, and the caller recovers
  PASS  the caller dispatched, was refused, and dispatched again
  PASS  arm 1 replayed batch 11 (a `model` rode the call)
  PASS  the guard denied it
  PASS  the caller was handed the guard's reason verbatim
  PASS  …and it reached the model as the tool result

  the deny feedback, verbatim:

    Dispatch guard (D47): engine overrides never ride a dispatch. This call carries `model` — drop it and re-send with the row's staffing tier alone: Agent(subagent_type: "<tier>"). A tier from the canon grid (canon/agents/) binds model AND effort; an override reproduces neither — that is how simmy batch 11 lost every effort binding while looking like a clean run.

  PASS  the retry carried no engine parameters
  PASS  the retry carried the row's staffing tier
  PASS  the guard passed the retry
  PASS  haiku-low actually ran
  PASS  the row landed

pass (control) — a bare tier dispatch is untouched
  PASS  one guarded dispatch
  PASS  subagent_type: opus-medium
  PASS  no engine parameters on the call
  PASS  the guard passed it
  PASS  opus-medium actually ran
  PASS  the dispatch landed

types (control) — Explore and general-purpose pass untouched
  PASS  Explore was dispatched and seen by the guard
  PASS  Explore passed untouched
  PASS  general-purpose was dispatched and seen by the guard
  PASS  general-purpose passed untouched
  PASS  no engine parameters on either call
  PASS  both replies came back

workflow — does a workflow script's agent() reach the guard?
  PASS  the wildcard witness fired — PreToolUse is live here
  PASS  the workflow ran (its agent carried model AND effort)
  PASS  its agent completed — there was something to catch
  PASS  VERDICT: workflow-internal agents never reach PreToolUse — the guard cannot see them

GREEN — 0 failure(s)
```

**The retry, in the caller's own words** (deny arm, session `ec96a93a`, first cold probe —
the model was told only to dispatch row R1 as `subagent_type: "claude", model: "haiku"`;
nothing in the prompt mentioned tiers, retries, or the guard):

> Guard D47 kicked back the call — the `model: "haiku"` override isn't allowed to ride a
> dispatch. Re-sending with the row's tier alone.

…followed by `Agent(subagent_type: "haiku-low", prompt: …)` with no engine parameters,
which the guard passed and which ran. The loop closes without a human in it.

## Out of scope — the fence

- Adopting the guard anywhere — cap-mega adoption is its own Architect's row; this
  repo's `.claude/settings.json` stays untouched (rare dispatches, Felix in the room).
- Board-intent validation (a *legal* tier contradicting the staffing column) — a hook
  cannot read intent; that stays D47's first-dispatch audit.
- Any canon edit — gaps escalate (harvest law).
- Any sync-set change — the fragment rides project repos, never `~/.claude*`.

## Findings

**F1 — the tool is `Agent`; the hooks doc says `Task`.** The order's assumption held and
the documentation is wrong (or ahead/behind this build). A wildcard-matcher logging hook in
a scratch project, driven at one dispatch, recorded the payload's `tool_name`:

```
Agent {"description": "Ping test agent", "prompt": "Reply with exactly: PONG…",
       "subagent_type": "haiku-low", "model": "haiku", "run_in_background": false}
```

and the live stream names the event `PreToolUse:Agent` (build 2.1.226). The shipped matcher
is `"Agent|Task"` — both names, so the guard survives whichever way the platform settles.
No cost: the payload test is on `tool_input`, not on the tool's name.

**F2 — the Workflow hole is real, and it is the guard's one blind spot.** A workflow
script's `agent(prompt, {model, effort})` calls **never fire `PreToolUse`**. Evidence, with
its control: the witnessed sandbox carried the guard *plus* a wildcard witness hook; the
witness log after the workflow arm reads, in full:

```
{"tool_name": "Workflow"}
```

The control that makes that silence mean something: the same run's stream shows the
workflow started (`task_started`, `task_type: "local_workflow"`) and its agent returned —
`Done. Returned: {"r":"PONG"} — 1 agent, 0 errors … The { model: "haiku", effort: "low" }
override was accepted without complaint — no guard tripped.` So there was an override-laden
agent to catch, the hook was demonstrably live, and it was never offered the call. Named in
`guard/README.md`; `lab/12`'s fourth arm asserts the hole and goes red if a build ever
closes it.

**F3 — `--setting-sources project` hides the canon tier grid.** A headless session run with
project-only settings cannot resolve any tier: *"Agent type 'haiku-low' not found. Available
agents: claude, Explore, general-purpose, Plan, statusline-setup."* The 20-tier grid rides
the user config dir and needs `user` in the sources. The harness runs
`--setting-sources user,project`. Relevant to any future headless or CI dispatch venue —
strip user settings and every dispatch silently falls back to generic types, which is
batch 11's failure mode arriving by a different road.

**F4 — install is two artifacts, not one paste** (deviation from the DoD's "paste +
commit", spec unchanged). The hook must land as a file (`cp` into `.claude/hooks/`) and the
fragment must be pasted into `.claude/settings.json`. Inlining the whole guard as a JSON
command string was considered and rejected: an escaped one-line `python3 -c` is unreadable,
and an unauditable guard is worse than a two-line install. README's install section is
copy-pasteable end to end.

**F5 — `model: null` and `model: ""` pass, deliberately.** The test is a non-empty value,
not key presence: a serialiser that emits an empty field has not bound an engine, and a
guard that denies on it teaches callers that the guard is noise.

**F6 (parked, adjacent) — closing F2 would mean reading workflow script text.** The only
PreToolUse surface a workflow offers is the `Workflow` call itself, whose `tool_input.script`
is JavaScript source; catching `agent(…, {model: …})` there means pattern-matching code, with
the false positives and bypasses that implies. Not built, not in scope — the Architect's, on
whatever row takes up adoption.

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the order at ~/code/agents/plans/12-dispatch-guard.md.
```
