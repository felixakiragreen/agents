# P2 — the spawn recipe

**Status:** OPEN · **Depends on:** — (batch note: fire inside a cmux pane) ·
**Staffing:** Digger · opus-high · **Parallel-safe with:** P1, P3

## Questions

1. **The socket access model — pivotal.** Founding smoke (2026-08-26, process
   outside cmux): `cmux list-workspaces` → `ERROR: Access denied - only processes
   started inside cmux can connect`. What grants access — env token, process
   parentage, config? Can an outside process (the future glass server) acquire it
   (copied env, a cmux setting), or must the server itself live in a cmux pane
   (named workaround candidate)? Record `cmux --version`; note the CLI has renamed
   verbs (`list-workspaces` → `workspace list`, legacy aliased) — the keel's verb
   list is already drifting.
2. The recipe, end to end, ×3 accounts: new workspace → send the composed cmd
   (`CLAUDE_CONFIG_DIR=<dir> cd <cwd> && claude --model <m> --effort <e>
   -n <stamp> "/color <c>"`) → send the summons text (sanitized) → set-status.
   Verify per account: session up under the right config dir, name-stamp in the
   title, summons landed as the first user turn, CMUX_* exported inside.
3. The resume variant: `claude --resume <uuid>` fired through the same recipe.
4. Multi-line integrity: does `send` deliver a multi-paragraph summons intact? The
   fire-then-paste gap this closes is 359 fires deep
   (`summon/log/invocations.jsonl`).

## Inputs — read before working

- [README](../README.md) §§2–3 and the keel §4 (the recipe, the driver fence).
- Sanitizer semantics to port (read-only, already on disk — D54 satisfied by this
  naming): `~/code/superset/packages/shared/src/agent-prompt-launch.ts`,
  `sanitizePromptForPty()` — strip CSI / terminated-OSC / control chars. Port
  minimally into `lab/p2/`; no fetching, no vendoring.
- Account grammar: `summon/accounts.tsv` + MAP §1. Colors/mantles:
  `summon/presets.tsv`. Stamp grammar: `<mantle>-<theater>-<NN>` (canon rows
  13/14).
- cmux docs: cmux.com/docs/api — dated in the keel (2026-08-26); re-verify every
  claim against the installed binary.

## Method

From inside your cmux pane (inherited access): diff `env` against a shell outside
cmux to isolate the access mechanism; attempt ONE outside connection with the
candidate token copied — that experiment settles question 1 cheaply, control built
in (outside-without-token is the founding smoke, already failed). Then the recipe
×3 accounts, one scratch workspace each, everything transcripted. Resume variant
against one spawned session's uuid. Cleanup at landing: close probe workspaces,
exit spawned sessions (README §5).

## Kill criteria

- No mechanism grants outside-process access AND server-inside-cmux also cannot
  drive the socket → STOP, escalate: the substrate ruling (D4) reopens.
- `send` mangles multi-line summons after bracketed-paste / send-key / per-line
  variants → STOP, escalate: same class.
- Any account's session comes up under the wrong config dir → STOP, escalate: silo
  breach class — never work around.

## Deliverables

Findings below — the question-1 verdict with its isolating experiment, per-account
transcripts, resume proof — plus a proven spawn function in `lab/p2/` (the Hands
organ's seed), status current, commits.

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/p2-spawn-recipe.md,
and execute the brief.
```
