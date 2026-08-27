# P1 — the census join

**Status:** **LANDED** 2026-08-26 — no kill fired; all five questions answered ·
**Depends on:** — (batch note: fire inside a cmux pane) ·
**Staffing:** Digger · opus-high · **Parallel-safe with:** P2, P3
**Re-cut 2026-08-26 (Architect):** question 5 added — canon D67 routes Felix's
visibility decree here.

## Questions

1. Which hook events fire across a session's life — SessionStart, UserPromptSubmit,
   PreToolUse, Stop, Notification, SessionEnd — and what fields ride each payload
   (session id, cwd, transcript path, …)? Captured verbatim, per event.
2. Are `CMUX_WORKSPACE_ID` / `CMUX_SURFACE_ID` visible in the hook process env when
   the session runs inside a cmux pane? This is the deterministic session↔pane join
   (keel §4) — the glass's liveness sensor hangs on it.
3. Heartbeat cost: what latency does a one-line-append hook add per event? Target
   ≈ 0 — measured, not guessed.
4. Propose the census record: one JSONL line per event — fields named, derived from
   what (1) and (2) actually provide. Home: `summon/log/census/` (README D6,
   gitignored — verified at founding).
5. Subagent visibility (canon D67): when a session dispatches via the Agent tool, a
   background Bash job, or a Workflow run, which of those lifecycles surface in the
   PARENT session's hook events — and with what identifying fields? Deliverable per
   vehicle: countable from hooks, or the blindness named precisely. The full
   no-invisible-agents law is cut canon-side from what this census proves — the
   mechanism signs the charter.

## Inputs — read before working

- [README](../README.md) §§1–3 (the bet, the fence, the organs) and the keel §5
  (the missing sensor) — do not re-derive the design.
- Hooks land **project-local**: a scratch project dir carrying its own
  `.claude/settings.json`. The per-account `~/.claude*/settings.json` deploy is a
  later **Felix-run** ritual (D14's pattern) — NOT this row's venue; touching a
  live settings file is a STOP.
- You are fired inside a cmux pane (batch note) precisely so the CMUX_* env is
  measurable from your own session's hooks; a scratch session you spawn beside
  yourself works too.

## Method

Suggested route: scratch dir whose hooks append `ts · event · payload fields ·
$CMUX_*` to a census file; drive a short session through prompt / tool-use / idle /
notification / end; capture each payload verbatim; time the append overhead (N=20).
Control (DOCTRINE §6.2): an identical session with NO hooks, same actions — prove
the census file stays silent there and speaks under hooks.

## Kill criteria

- Project-local hooks don't fire at all → STOP, escalate: the v0 deploy design
  changes shape.
- `CMUX_*` absent from hook env → NOT a kill: file the finding plus candidate
  fallbacks (pane title stamp, tty, cmux CLI census) and continue questions 1/3/4.
- Per-event overhead > 50 ms → STOP, escalate: the sensor would tax every session
  in the city.
- Subagent lifecycles invisible to every hook event → NOT a kill: the precisely
  named blindness IS the finding (D67 — it shapes the canon law and the glass's
  honest gaps).

## Deliverables

Findings below — verbatim payload excerpts per event, the control run, timings —
plus the proposed census record schema, status current, commits (`lab/p1/`).

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

**Landed 2026-08-26 (Digger · opus-high) — no kill criterion fired.** All five
questions answered. Lab: [`../lab/p1/`](../lab/p1/). Raw captures (gitignored):
`summon/log/census/p1/*.jsonl` — 87 hook invocations across 13 sessions, 10 event
types. Claude Code 2.1.247 (`claude --version`), macOS 15.7.3, personal account
(`CLAUDE_CONFIG_DIR=/Users/felix/.claude`).

**Venue.** Fired from a terminal inside a cmux pane per the batch note; scratch
projects were minted outside the repo (`…/scratchpad/p1-hooks`, `…/p1-control`) by
[`lab/p1/mkproject.sh`](../lab/p1/mkproject.sh). **No live settings file was
touched** — every hook config lived in the scratch project's own
`.claude/settings.json`. Read-only check of the live one:

```
$ jq '{permissions: .permissions, hooks: (.hooks|keys? // null)}' ~/.claude/settings.json
{ "permissions": { "defaultMode": "auto" }, "hooks": null }
```

→ the deploy target is clean: **no account-level hooks exist today**, so the
Felix-run ×3 ritual adds rather than merges. (It also explains why headless probes
auto-approved tools: the account runs auto mode.)

**Control (DOCTRINE §6.2).** Identical project, identical prompt, `settings.json`
= `{}`:

```
$ ./mkproject.sh …/p1-control control && cat …/p1-control/.claude/settings.json
{}
$ claude -p 'Do exactly these three steps … echo hello-from-tool … read data.txt … write touched.txt' --model haiku --allowedTools 'Bash,Read,Write'
1. ✓ `echo hello-from-tool`
2. ✓ Read data.txt (contains: `alpha bravo charlie`)
3. ✓ Written touched.txt with `ok`
$ ls -l …/census/p1/control.jsonl
cannot access …/control.jsonl: No such file or directory
```

Same three tool uses under hooks produced 10 census lines. **The sensor is the
hooks, not ambient behaviour.**

---

### F1 (Q1) — the event set and what rides each payload

**Ten events fire.** Every one was observed at least once; the set is exactly what
the keel assumed plus three the keel did not name (`SubagentStart`, `PreCompact`,
and a `SessionEnd` that is *not* reliable — see F5).

Field inventory, generated from the captures:

```
$ cat summon/log/census/p1/*.jsonl | jq -r 'select(.cfg_event and .payload!=null)
    | [.cfg_event, ((.payload|keys)|join(" "))] | @tsv' | sort -u
```

| Event | Fields (beyond the common five) | Count |
|---|---|---|
| `SessionStart` | `source`, `model` *(interactive only)* | 13 |
| `UserPromptSubmit` | `prompt_id`, `permission_mode`, `prompt` | 15 |
| `PreToolUse` | `prompt_id`, `permission_mode`, `tool_name`, `tool_input`, `tool_use_id`, `agent_id`†, `agent_type`† | 12 |
| `PostToolUse` | as `PreToolUse` + `tool_response`, `duration_ms` | 11 |
| `Notification` | `prompt_id`, `message`, `notification_type` | 2 |
| `Stop` | `prompt_id`, `permission_mode`, `stop_hook_active`, `last_assistant_message`, `background_tasks`, `session_crons` | 14 |
| `SubagentStart` | `prompt_id`, `agent_id`, `agent_type` | 3 |
| `SubagentStop` | as `Stop` + `agent_id`, `agent_type`, `agent_transcript_path` | 3 |
| `PreCompact` | `prompt_id`, `trigger`, `custom_instructions` | 1 |
| `SessionEnd` | `prompt_id`, `reason` | 13 |

† only when the call belongs to a subagent (F4).

**The common five, on every event without exception:** `session_id`,
`transcript_path`, `cwd`, `hook_event_name`, and (all but `SessionStart`)
`prompt_id`.

Verbatim, the two that carry the design:

```json
{ "session_id": "ad42f0cd-f1a6-41ba-997c-a0eb572e0cd1",
  "transcript_path": "/Users/felix/.claude/projects/-private-tmp-…-p1-hooks/ad42f0cd-….jsonl",
  "cwd": "/private/tmp/…/scratchpad/p1-hooks",
  "hook_event_name": "SessionStart", "source": "startup" }

{ "session_id": "c389f1b6-3c0d-4476-894b-b7260268d4a5", "transcript_path": "…",
  "cwd": "…", "prompt_id": "e51f0bf2-038a-4506-8bc8-26f037e7b1a2",
  "permission_mode": "default", "hook_event_name": "Stop",
  "stop_hook_active": false, "last_assistant_message": "pong",
  "background_tasks": [], "session_crons": [] }
```

**Observed vocabularies** (what the glass may switch on):

- `SessionStart.source` — `startup` · `resume` · `clear`
- `SessionEnd.reason` — `other` (headless `-p`) · `prompt_input_exit` (`/exit`) ·
  `clear` (`/clear`). `logout`/`exit` not observed.
- `Notification.notification_type` — `idle_prompt` · `permission_prompt`
- `PreCompact.trigger` — `manual` (`/compact`). `auto` not observed.
- `SessionStart.model` — present on interactive sessions only, absent headless and
  on resume. Clean split across 12 runs:
  `interactive/interactive2/lifecycle/perm → claude-haiku-4-5-20251001`;
  `smoke1/tools/subagent/bgbash/workflow/workflow2/notify/resume → absent`.
  **Do not depend on it** — read the model from the transcript instead.

**Notification is a 60-second nag, not the needs-input edge.** Measured:

```
2026-08-27T01:54:37Z  Stop
2026-08-27T01:55:37Z  Notification   idle_prompt   "Claude is waiting for your input"
```

Exactly 60 s. And it only exists interactively — the headless probe (`notify.jsonl`)
produced 6 events, none of them `Notification`. **For the baton rail, `Stop` is the
idle sensor; `Notification` is a staleness signal on top of it.**

The permission variant fires ~6 s after the blocked `PreToolUse` and carries **no
`tool_name`** — the glass must correlate by `prompt_id` with the last `PreToolUse`
that never got a `PostToolUse`:

```
01:57:22Z  PreToolUse    Bash  toolu_01GceABtG6hrB4pKoBrMZq3W
01:57:28Z  Notification  permission_prompt  "Claude needs your permission"
```

### F2 (Q2) — the cmux join: YES, and it is deterministic

**`CMUX_WORKSPACE_ID` and `CMUX_SURFACE_ID` are both present in the hook process
env.** Full env dump taken from inside a live hook process
([`lab/p1/envdump.sh`](../lab/p1/envdump.sh), 103 vars):

```
$ grep -E '^(CMUX_(WORKSPACE|SURFACE|PANEL|TAB)_ID|CLAUDE_(PID|CODE_SESSION_ID))' census/p1/smoke1.jsonl.hookenv
CLAUDE_CODE_SESSION_ID=ad42f0cd-f1a6-41ba-997c-a0eb572e0cd1
CLAUDE_PID=96970
CMUX_PANEL_ID=0128A15C-B454-4627-8691-5D90F38722DC
CMUX_SURFACE_ID=0128A15C-B454-4627-8691-5D90F38722DC
CMUX_TAB_ID=01B67603-C364-45B6-A54C-8BD878DF2F5B
CMUX_WORKSPACE_ID=01B67603-C364-45B6-A54C-8BD878DF2F5B
```

**The join closes on both ends in one process:** `CLAUDE_CODE_SESSION_ID` (env) is
byte-identical to `session_id` (payload), and `CMUX_SURFACE_ID` (env) names the
pane. No correlation heuristics, no pane-title stamps, no cmux CLI. The named
fallbacks are **not needed** and stay parked.

Coverage is total — all 87 captured invocations, all 10 event types:

```
$ cat census/p1/*.jsonl | jq -r 'select(.cfg_event) | [.cfg_event,
    (if (.env.CMUX_SURFACE_ID|length)>0 and (.env.CMUX_WORKSPACE_ID|length)>0
     then "join-ok" else "MISSING" end)] | @tsv' | sort | uniq -c
   2 Notification  join-ok      12 PreToolUse    join-ok    14 Stop              join-ok
  11 PostToolUse   join-ok      13 SessionEnd    join-ok     3 SubagentStart     join-ok
   1 PreCompact    join-ok      13 SessionStart  join-ok     3 SubagentStop      join-ok
                                                            15 UserPromptSubmit  join-ok
```

**Three traps the glass must respect, all measured:**

1. **`SURFACE_ID` == `PANEL_ID`, `WORKSPACE_ID` == `TAB_ID`** (byte-identical
   above). Two names each; store one.
2. **The env is inherited, so the join is pane → session one-to-**many**.** Every
   probe session in this dig was spawned *from inside* another session in the same
   pane and carried that pane's ids verbatim. A pane can therefore hold several
   session_ids at once. Key the glass by `session_id`; treat `surface` as a grouping
   attribute, never a session identity.
3. **`/clear` rotates the session_id in place** — same pane, new session:

   ```
   01:59:24Z  SessionEnd    a4a34d53…  reason=clear
   01:59:24Z  SessionStart  a3acad82…  source=clear
   ```

   Resume, by contrast, **keeps** the id (`claude -c` → `SessionStart a3acad82…
   source=resume`). Also inherited-but-stale: `CMUX_CLAUDE_PID=92798` was the
   *pane's original* claude, not the running one — use payload-derived `CLAUDE_PID`
   (96970), never `CMUX_CLAUDE_PID`.

### F3 (Q3) — heartbeat cost: 5.5 ms median, 0.7 ms over an empty hook

**First, hooks are synchronous and blocking** — so "cost" is exactly the hook
process's wall time. Proven by injecting a known delay
([`lab/p1/slow.sh`](../lab/p1/slow.sh), `sleep 0.5`) into the same 6-event session:

```
beat: 7.50s wall, 6 hook events
slow: 10.88s wall, 6 hook events
```

+3.38 s observed against 6 × 0.5 s = 3.0 s injected. The tax is real and additive.

**Measured cost** ([`lab/p1/bench.py`](../lab/p1/bench.py)), replaying the fattest
captured payload (1028-byte `SubagentStop`), N=50, cache warmed:

```
$ python3 bench.py /tmp/p1-payload.json 50
payload 1028 bytes · N=50

candidate           min   median      p95      max   (ms)
noop.sh            4.46     4.82     5.73     6.28
beat.sh            5.05     5.52     6.47     6.77
capture.sh         6.21     7.93     8.67     8.93
```

- `noop.sh` = `cat >/dev/null`: the **irreducible** cost of Claude Code spawning
  any hook at all — 4.8 ms.
- `beat.sh` = the proposed heartbeat (F6): **5.5 ms median, 6.8 ms worst of 50**.
- **Marginal cost of the census over an empty hook: 0.7 ms.** The 4.8 ms floor is
  process spawn, and no hook design escapes it.

**Kill criterion (> 50 ms) did not fire — 7× margin at p95.** Whole-session tax:
the busiest probe ran 16 events → ~88 ms across a session lasting minutes.

Caveat, stated honestly: the bench times `subprocess.run` from Python, which
carries its own spawn overhead; the absolute floor is therefore an over-estimate.
The `beat.sh` − `noop.sh` delta is the apples-to-apples number and is the one the
design decision rests on.

### F4 (Q5) — subagent visibility: all three vehicles are countable

Per the D67 deliverable — **countable from hooks, or the blindness named
precisely**. Result: two of three vehicles are fully countable, the third is
countable at launch with one precisely-named gap.

**(a) Agent tool — fully countable.** Dedicated lifecycle events, and every tool
call the subagent makes is attributed:

```
$ jq -r '[.cfg_event, (.payload.tool_name//"-"), (.payload.agent_type//"-"),
         (.payload.agent_id//"-")] | @tsv' census/p1/subagent.jsonl
SessionStart      -      -                -
UserPromptSubmit  -      -                -
PreToolUse        Agent  -                -
SubagentStart     -      general-purpose  a124dce649c5977ea
PostToolUse       Agent  -                -
PreToolUse        Bash   general-purpose  a124dce649c5977ea
PostToolUse       Bash   general-purpose  a124dce649c5977ea
Stop              -      -                -
SubagentStop      -      general-purpose  a124dce649c5977ea
UserPromptSubmit  -      -                -            ← the <task-notification>
Stop              -      -                -
SessionEnd        -      -                -
```

**The discriminator is exact:** parent-session tool calls carry no `agent_id`;
subagent tool calls always do. `SubagentStop` adds `agent_transcript_path`:
`…/<session_id>/subagents/agent-a124dce649c5977ea.jsonl` — the glass can open a
running subagent's transcript.

Completion re-enters the parent as a **`UserPromptSubmit` whose prompt is a
`<task-notification>` block** — machine-readable, verbatim:

```
<task-notification>
<task-id>bib4hlvv8</task-id>
<tool-use-id>toolu_01XHA1n7eZxxg2biZr2QjquP</tool-use-id>
<output-file>/private/tmp/…/tasks/bib4hlvv8.output</output-file>
<status>completed</status>
<summary>Background command "…" completed (exit code 0)</summary>
</task-notification>
```

**(b) Workflow — fully countable, same machinery.** Workflow agents surface as
`SubagentStart`/`SubagentStop` with `agent_type: "workflow-subagent"`, and their
nested tool calls carry `agent_id` too:

```
$ jq -r '[.cfg_event,(.payload.tool_name//"-"),(.payload.agent_type//"-"),
         (.payload.agent_id//"-"),(.payload.tool_input.command//"-")]|@tsv' census/p1/workflow2.jsonl
PreToolUse     Workflow  -                  -                  -
SubagentStart  -         workflow-subagent  ae6d6488b1b86e54d  -
PostToolUse    Workflow  -                  -                  -
PreToolUse     Bash      workflow-subagent  ae6d6488b1b86e54d  echo WF-TOOL-XYZ
Stop           -         -                  -                  -
PostToolUse    Bash      workflow-subagent  ae6d6488b1b86e54d  echo WF-TOOL-XYZ
SubagentStop   -         workflow-subagent  ae6d6488b1b86e54d  -
```

The workflow **run id** is recoverable from `agent_transcript_path`:
`…/subagents/workflows/wf_b48a1a06-913/agent-aa4acbb174a66dfdc.jsonl` — so agents
group by run without any extra sensor.

**(c) Background Bash — countable at launch; one named blindness.** The launch is
visible (`PreToolUse`/`PostToolUse` with `tool_input.run_in_background == true`),
and the job appears in the roster (below). **But there is no `BackgroundTaskStop`
event.** Completion is observable only indirectly, two ways: the re-injected
`<task-notification>` (above), or the next `Stop`'s roster going empty:

```
$ jq -c 'select(.cfg_event=="Stop") | {prompt:(.payload.prompt_id[0:8]), bg:.payload.background_tasks}' census/p1/bgbash.jsonl
{"prompt":"15c318bd","bg":[{"id":"bib4hlvv8","type":"shell","status":"running","description":"Run sleep and echo command in background","command":"sleep 4; echo bg-done-XYZ"}]}
{"prompt":"3b0a7451","bg":[]}
```

**Named blindness:** *a background shell job that completes while the session never
reaches another `Stop` is invisible to the hook stream.* In practice the
task-notification forces a turn, so the window is narrow — but it is real, and the
glass must not claim a shell job is running purely because the last roster said so.

**Bonus organ — `background_tasks[]` is a live WIP roster** carried on every `Stop`
and `SubagentStop`: `{id, type ("subagent"|"shell"), status, description,
agent_type, command}`. This is the WIP gauge the README §3 demanded, free, with no
extra sensor. It also carries `command` verbatim — the census projection drops it
(F6).

**Ordering caveat.** Hook arrival order is not causal order: in `workflow2` the
subagent's `PostToolUse` landed *after* the parent's `Stop`, and `PostToolUse
Agent` precedes the subagent's own tool calls. **Sort by the record's timestamp,
never by file position** (F6 stamps sub-millisecond `t`; verified monotonic over a
16-line real capture).

### F5 — two liveness traps (not asked; load-bearing for the glass)

**1. `SessionEnd` does not survive a hard kill.** A pane closed, a laptop lid, a
crash — the census's last line stays `Stop`, which is indistinguishable from a live
idle session. Measured with SIGKILL on a live interactive session:

```
$ …SIGKILL -> pid 24189
=== census after SIGKILL (3 lines) ===
02:04:43Z  SessionStart  startup
02:04:54Z  UserPromptSubmit
02:04:57Z  Stop            ← last line. No SessionEnd.
```

**2. The fix is already in the record.** `CLAUDE_PID` rides every heartbeat, so
liveness is one syscall:

```
$ for p in $(jq -r '.pid' census.jsonl | sort -u); do kill -0 $p 2>/dev/null \
    && echo "pid $p ALIVE" || echo "pid $p DEAD -> census last line 'Stop' was a lie"; done
pid 24189 DEAD -> census last line 'Stop' was a lie
```

**Law for the glass: the census says what a session was doing; `kill -0 pid` says
whether it still exists. Never render state without both.** This is the
glass-shatters test applied to the sensor — a stale census must degrade to
"unknown", never to "working".

### F6 (Q4) — the proposed census record

**Shape: one JSONL line per hook event, appended to
`summon/log/census/census.jsonl`** (D6's home, gitignored — verified
`.gitignore:1  summon/log/`). One file, append-only; the glass tails it and indexes
by `sid`. Sharding per session was designed and **rejected**: choosing the filename
requires reading the payload, which costs a second process for a lookup the glass
already holds in memory.

**The hook does no logic.** [`lab/p1/beat.sh`](../lab/p1/beat.sh) is one `exec` into
`jq`, which projects the payload and stamps the time in the process already being
paid for — no `date`, no second fork:

```sh
dir="${CENSUS_DIR:-$HOME/code/agents/summon/log/census}"
exec /usr/bin/jq -c --arg ws "$CMUX_WORKSPACE_ID" --arg sf "$CMUX_SURFACE_ID" \
   --arg acct "$CLAUDE_CONFIG_DIR" --arg pid "$CLAUDE_PID" '
   { t: now, ev: .hook_event_name, sid: .session_id, acct: $acct, ws: $ws, sf: $sf,
     pid: $pid, cwd: .cwd, tp: .transcript_path, pmt: .prompt_id, mode: .permission_mode,
     aid: .agent_id, at: .agent_type, tool: .tool_name,
     why: (.source // .reason // .notification_type // .trigger),
     bg: [ (.background_tasks // [])[] | { id, type, status, agent_type } ] }' >> "$dir/census.jsonl"
```

| Field | From | Why |
|---|---|---|
| `t` | jq `now` (float epoch, sub-ms) | sort key — file order is not causal (F4) |
| `ev` | `hook_event_name` | the state machine's input |
| `sid` | `session_id` | **the** session identity (F2 trap 2) |
| `acct` | `CLAUDE_CONFIG_DIR` (env) | which of the three accounts |
| `ws` / `sf` | `CMUX_WORKSPACE_ID` / `CMUX_SURFACE_ID` (env) | the pane join (F2) |
| `pid` | `CLAUDE_PID` (env) | liveness via `kill -0` (F5) |
| `cwd` | payload | which building |
| `tp` | `transcript_path` | the shelf's resume target |
| `pmt` | `prompt_id` | correlates `Notification` → blocked `PreToolUse` (F1) |
| `mode` | `permission_mode` | auto / default / plan, for the rail |
| `aid` / `at` | `agent_id` / `agent_type` | subagent attribution; null ⇒ parent (F4) |
| `tool` | `tool_name` | what it's doing right now |
| `why` | `source // reason // notification_type // trigger` | one column for every event's discriminator |
| `bg` | `background_tasks[]`, projected | the WIP gauge (F4) |

**Deliberately dropped:** `prompt` text, `tool_input`, `tool_response`,
`last_assistant_message`, and `background_tasks[].command`. Census is telemetry,
never truth (README §2) — and prompts and command lines are exactly where secrets
live. Everything dropped is recoverable from `tp` when the glass genuinely needs it.

**Proven end-to-end**, not designed on paper — beat.sh wired to all ten events, one
real session dispatching a subagent and a background job:

```
$ jq -r '[(.t|todate), .ev, (.sid[0:8]), (.aid//"-"), (.at//"-"), (.tool//"-"), (.why//"-"), (.bg|length|tostring)] | @tsv' census.jsonl
02:03:12Z  SessionStart      1985d86f  -                  -                -      startup  0
02:03:15Z  UserPromptSubmit  1985d86f  -                  -                -      -        0
02:03:17Z  PreToolUse        1985d86f  -                  -                Agent  -        0
02:03:17Z  SubagentStart     1985d86f  a11093ddd65c642f2  general-purpose  -      -        0
02:03:17Z  PostToolUse       1985d86f  -                  -                Agent  -        0
02:03:18Z  PreToolUse        1985d86f  -                  -                Bash   -        0
02:03:18Z  PostToolUse       1985d86f  -                  -                Bash   -        0
02:03:20Z  PreToolUse        1985d86f  a11093ddd65c642f2  general-purpose  Bash   -        0
02:03:20Z  PostToolUse       1985d86f  a11093ddd65c642f2  general-purpose  Bash   -        0
02:03:20Z  Stop              1985d86f  -                  -                -      -        1
02:03:20Z  UserPromptSubmit  1985d86f  -                  -                -      -        0
02:03:22Z  SubagentStop      1985d86f  a11093ddd65c642f2  general-purpose  -      -        1
02:03:24Z  Stop              1985d86f  -                  -                -      -        0
02:03:24Z  UserPromptSubmit  1985d86f  -                  -                -      -        0
02:03:26Z  Stop              1985d86f  -                  -                -      -        0
02:03:26Z  SessionEnd        1985d86f  -                  -                other    0
```

Parent `Bash` and subagent `Bash` separated cleanly by `aid`. Timestamps verified
monotonic in file order for this run (`awk` check over `.t`).

**Concurrent appends are safe at this size.** 60 hook processes racing one file:

```
$ for i in $(seq 1 60); do ./beat.sh < payload.json & done; wait
lines written: 60
lines that are valid JSON: 60
```

Records run ~400–600 bytes, under the atomic-append size where interleaving starts.
**Guard for the build row:** `bg` is the only unbounded field — a session with a
large roster could push a line past that threshold. Cap `bg` at a fixed length in
the hook, or accept a lint-on-read (parser-as-lint, README §1).

**Derived state machine for the glass** (from F1's vocabularies):

| Last event | State | Notes |
|---|---|---|
| `UserPromptSubmit`, `PreToolUse`, `PostToolUse` | **working** | `tool` names the act |
| `PreToolUse` with no matching `PostToolUse` + `Notification/permission_prompt` | **needs input** | correlate by `pmt` |
| `Stop` | **idle** | the real needs-input edge, not `Notification` |
| `Stop` + `Notification/idle_prompt` (60 s later) | **idle, stale** | |
| `SessionEnd` | **gone** | `why` says why |
| any, but `kill -0 pid` fails | **gone (unclean)** | F5 — the census cannot know this |

### What this row hands the build rows

1. The census sensor is **cheap (0.7 ms marginal), total (10 events, 100 % join),
   and honest about its gaps** (F5 hard-kill, F4 background-shell completion).
2. `settings.json` deploy is **additive** — no account-level hooks exist to merge
   with. The ×3 Felix-run ritual can be a straight write of one `hooks` block
   pointing at a canon-side `beat.sh`.
3. The glass needs **two sensors, not one**: the census stream *and* `kill -0`.
4. **No-invisible-agents (canon D67) is mechanically supportable** — Agent-tool and
   Workflow agents are fully countable with stable ids, types, and transcripts;
   background shell jobs are countable at launch with one narrow, named completion
   gap. The mechanism signs the charter.

**Escalations: none.** No unbriefed fork was hit; the `CMUX_*` fallback branch was
not needed. Parked (not chased): the cmux CLI/socket surface — P2's ground.

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/p1-census-join.md,
and execute the brief.
```
