# guard — the dispatch guard

D47's mechanical arm: **the tier string is the dispatch.** A `PreToolUse` hook that denies
any Agent call carrying `model` or `effort`, so simmy batch 11 — every dispatch sent as
`subagent_type: "claude", model: "opus"`, the effort binding silently lost — cannot happen
again by hand.

Venue tooling, not canon law (05's rejection terms: canon states the law, venues enforce
their own physics). It rides project repos; it never touches `~/.claude*` or the sync set.

## Install

Two files into the project, then commit:

```sh
mkdir -p .claude/hooks
cp ~/code/agents/guard/dispatch-guard .claude/hooks/
```

…and paste `settings-fragment.json`'s `PreToolUse` entry into `.claude/settings.json`
(merge into the existing `hooks.PreToolUse` array if the project already has one):

```json
{
	"hooks": {
		"PreToolUse": [
			{
				"matcher": "Agent|Task",
				"hooks": [
					{
						"type": "command",
						"command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/dispatch-guard"
					}
				]
			}
		]
	}
}
```

```sh
git add .claude/hooks/dispatch-guard .claude/settings.json && git commit -m "guard: dispatch guard"
```

Agent definitions load at session start (D8) and so do settings — **only sessions started
after the commit are guarded.** Requires `python3`; nothing else.

Uninstall is the inverse: delete the two additions, commit.

## What it denies

An `Agent` (or `Task`) call whose `tool_input` carries a non-empty `model` or `effort`. The
caller gets this back as the tool result, and acts on it:

> Dispatch guard (D47): engine overrides never ride a dispatch. This call carries `model` —
> drop it and re-send with the row's staffing tier alone: `Agent(subagent_type: "<tier>")`.
> A tier from the canon grid (`canon/agents/`) binds model AND effort; an override
> reproduces neither — that is how simmy batch 11 lost every effort binding while looking
> like a clean run.

Everything else passes untouched. A malformed hook payload fails **closed** (exit 2): a
guard that cannot read its input does not wave the dispatch through.

The matcher names both `Agent` and `Task`. This build (2.1.226) fires the event as
`PreToolUse:Agent` — the hooks doc says the subagent tool is `Task` — so the guard answers
to both rather than betting on either.

## What it deliberately does not do

- **Judge the tier.** A *legal* tier that contradicts the board's staffing column passes:
  a hook reads the call, not the intent. That gap is D47's first-dispatch audit — a human
  byte-check of the first call's type field against the board — and always will be.
- **Police `subagent_type` itself.** Bare `claude`, `general-purpose`, `Explore`, `Plan`
  are not this guard's business; it blocks engine overrides, not type choice.
- **Reach inside a workflow.** Proven, not assumed: a Workflow script's
  `agent(prompt, {model, effort})` calls **never fire `PreToolUse`**. A wildcard witness
  hook in `lab/12`'s workflow arm saw the `Workflow` tool call and nothing else, while the
  script's agent demonstrably ran with both overrides bound. **This is the hole:** engine
  overrides inside a workflow script are invisible to the guard, and only the author's
  discipline keeps them out. `lab/12/run`'s fourth arm re-tests it every run — if a future
  build starts routing them, that assertion goes red.
- **Install itself.** Adoption in any given repo is its own decision. The canon repo
  (`~/code/agents`) is deliberately unguarded: dispatches are rare and Felix is in the room.

## Evidence

`lab/12/run` — four live arms (deny + recovery, bare-tier control, non-tier-type control,
the workflow surface) against real headless sessions in sandbox projects that installed
this guard exactly as above. `lab/12/run --rule-only` re-rules the last run's transcripts
without spending API calls.
