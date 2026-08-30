# The headless event grammar — C4's capture

What `claude -p --output-format stream-json` actually emits, what the transcript
on disk actually holds, and how the engine reads session state off both. **C5
speaks this; C6 trusts it.** Measured 2026-08-29, `claude` 2.1.251, macOS 24.6.0,
three accounts. Every claim here rides a capture in [captures/](captures/).

## 0. The clean room — read this before you re-run anything

Two contaminants sit between a naive probe and the truth, and both were live in
the session that measured this:

1. **`claude` on `PATH` may be a cmux shim.** Inside a cmux pane, `which claude`
   is `/var/folders/…/cmux-cli-shims/<uuid>/claude`, a bash wrapper that execs
   `/Applications/cmux.app/Contents/Resources/bin/cmux-claude-wrapper`. The real
   binary is `~/.local/bin/claude` → `~/.local/share/claude/versions/<v>`.
   **v3 pins the real binary.** cmux is the layer v3 retires; measuring through
   its wrapper measures cmux.
2. **~40 inherited env vars.** `CLAUDECODE=1`, `CLAUDE_CODE_ENTRYPOINT`,
   `CLAUDE_CODE_SESSION_ID`, `CLAUDE_CONFIG_DIR`, `CMUX_*`, `NODE_OPTIONS`.
   A subject spawned with an inherited environment is a subject of *this*
   session, not a clean one.

`lib.ts` is the law: `cleanEnv()` hands a subject exactly eight variables —
`HOME USER SHELL PATH LANG TMPDIR CLAUDE_CONFIG_DIR` — and nothing else.
`CLAUDE_CONFIG_DIR` selects the account; `HOME` is never overridden (keychain
OAuth breaks if it is — the t3code steal-list hypothesis, **confirmed**: auth
held on all three accounts with `HOME=/Users/felix` and a per-account config dir).

## 1. The stream — one JSON object per line

Enable with `-p --output-format stream-json --verbose`. Add
`--include-hook-events` to fold the hook lifecycle into the same stream.

| `type` | `subtype` | Carries | When |
|---|---|---|---|
| `system` | `init` | `session_id` `model` `permissionMode` `cwd` `tools[]` `agents[]` `slash_commands[]` `mcp_servers` `apiKeySource` `claude_code_version` `output_style` | **once per turn**, after the first hooks |
| `system` | `hook_started` / `hook_response` | `hook_event` `hook_name` `hook_id` `exit_code` `outcome` `stdout` `stderr` | around every hook, with `--include-hook-events` — **except `SessionStart` (`:startup`/`:resume`), which leaks unconditionally at every process start** *(C5 F2, ruled 2026-08-29: nine flagless captures carry it; a parser must expect it unflagged)* |
| `system` | `thinking_tokens` | `estimated_tokens` `estimated_tokens_delta` | many per turn; noise |
| `system` | `permission_denied` | `tool_name` `tool_use_id` `message` | **a tool call was refused** — §4 |
| `system` | `background_tasks_changed` / `task_started` / `task_progress` / `task_updated` / `task_notification` | task bookkeeping | subagent work |
| `assistant` | — | `message` (Anthropic shape: `content[]` of `thinking` / `text` / `tool_use`), `uuid` `request_id` `parent_tool_use_id` `session_id` | per assistant block |
| `user` | — | `message.content[]` of `tool_result` (`is_error`) | tool results, echoed back |
| `rate_limit_event` | — | `rate_limit_info` | occasional |
| `result` | `success` / `error_during_execution` | `result` (final text) `is_error` `num_turns` `stop_reason` `terminal_reason` `usage` `modelUsage` `total_cost_usd` `duration_ms` `duration_api_ms` `ttft_ms` **`permission_denials[]`** `queued_turn_count` `subagent_stats` | **turn boundary** |

**The turn boundary is the `result` event.** Not process exit, not `Stop`.

**A turn can emit more than one `result`.** `captures/q1-sub-personal` — one
invocation, one subagent — emitted `Stop`, then a *second* `system/init` +
`UserPromptSubmit` + `result` when the subagent's completion re-invoked the
parent. **C6 must treat `result` as a stream event, never as "the process is
done".** Read until EOF; the last `result` wins.

## 2. Identity and the resume cursor

- **The engine may choose the session id: `--session-id <uuid>`.** Honored 10/10
  under concurrency (`captures/q8-10x-personal.json`, `sid_honored=10/10`). This
  removes the ignite→parse-id→record race entirely: the id exists before the
  process does, so a subject killed before it emits `init` is still addressable.
- **Resume takes the session id alone: `--resume <sid>`.** The id is stable
  across every resume (arm A, 3 resumes, `sid_after` identical each time).
- **The steal-list cursor hypothesis (session id + last-assistant uuid) is
  confirmed as a transcript row but is *not* needed by the engine.** The
  transcript carries `{"type":"last-prompt","leafUuid":…,"sessionId":…}`, which
  is the app's branch cursor. Resume by id alone worked in 24/24 measured turns.
  **C6 persists the session id; nothing else.**
- **`last-prompt.lastPrompt` is a display field — newlines are collapsed to
  spaces.** Never audit against it. The byte-exact record is the `user` row's
  `message.content`.

**Transcript path** (the Chat's read path, §4.4 of the contract):
`<CLAUDE_CONFIG_DIR>/projects/<cwd with every non-alphanumeric → "-">/<sid>.jsonl`

Transcript row types: `user` `assistant` `attachment` `last-prompt` `mode`
`queue-operation` `atis-latch`. Only `user`/`assistant` carry conversation.

## 3. inject — both arms work, and they differ

The adversarial payload (blank lines, tabs, `"` `'` `` ` `` `$VAR` `${BRACE}`,
a leading `/not-a-slash-command`, `--not-a-flag`, `⚡ 中文 ünïcødé`) survived
**24/24 turns byte-exact by sha256** — 2 arms × 3 accounts × 4 turns.
**P6's TUI send wall does not exist headless.**

| | Arm A — turn per invocation | Arm B — one process, stream-json stdin |
|---|---|---|
| shape | `-p <text> --resume <sid>` | `-p --input-format stream-json`, one JSON user message per line |
| byte-exact | 3/3 accounts | 3/3 accounts (**when paced**) |
| latency/turn | **~5.3 s** (personal, serial: 5.7 / 4.8 / 5.4) | **~3.0 s** (personal: 3.2 / 2.8 / 2.9) |
| first turn | 8.8 s | 6.3 s |
| state between turns | **bytes on disk only** | a live process |
| crash exposure | none — nothing to lose | the process holds the turn |

**Arm B's trap: unpaced turns coalesce.** Writing all four messages and closing
stdin produced **2 `result`s for 4 messages**, and turns 1–3 were merged into a
*single* user row — bytes all present, turn boundaries destroyed
(`captures/q2-b-personal`). Paced — write turn N+1 only after `result` N —
gives 4 results, 4 user rows, `queued_turn_count: 0`
(`captures/q2-b-paced-personal`). **If C6 picks arm B it must pace on `result`;
~~`queued_turn_count > 0` in a result means turns were merged~~.**

> **Correction, 2026-08-29 (C5 F1, verified at the Architect's review):
> `queued_turn_count` does NOT signal merged turns — the unpaced merged run's own
> results both report `queued_turn_count: 0`** (`captures/q2-b-personal`, jq'd at
> review). The only sound detector is arithmetic: **fewer `result`s than messages
> sent.** The fake ships both shapes: `armb-merge-trap` (the measured shape) and
> `armb-merge-trap-queued` (this section's former assumption).

The ~2.3 s/turn arm A pays is cold process start. That is the price of
cornerstone §3.2's "between turns a session is bytes, not a process".

## 4. Permission physics — the silent-success hazard

**Headless never stalls on permission. It auto-denies and reports success.**

Postures are `--permission-mode`: `acceptEdits` `auto` `bypassPermissions`
`manual` `dontAsk` `plan`. There is **no `default` value** — omitting the flag
takes the account's `defaultMode`. `system/init.permissionMode` reports what
*actually* took effect, and it is the posture sensor headless (P5 had to read it
off `PreToolUse`).

T-write ("write ping.txt"), one tool call, scratch cwd — `captures/q4-*`:

| model | asked | init reports | file written | `permission_denials` | exit | `result.subtype` | `is_error` |
|---|---|---|---|---|---|---|---|
| sonnet | *(omitted)* | `auto` | **YES** | 0 | 0 | success | false |
| sonnet | `auto` | `auto` | **YES** | 0 | 0 | success | false |
| sonnet | `acceptEdits` | `acceptEdits` | **YES** | 0 | 0 | success | false |
| sonnet | `bypassPermissions` | `bypassPermissions` | **YES** | 0 | 0 | success | false |
| sonnet | `plan` | `plan` | no | 0 | 0 | success | false |
| sonnet | `manual` | **`default`** | no | 1 | 0 | success | false |
| sonnet | `dontAsk` | `dontAsk` | no | 2 | 0 | success | false |
| haiku | `auto` | **`default`** | no | 1 | 0 | success | false |
| haiku | `acceptEdits` | `acceptEdits` | **YES** | 0 | 0 | success | false |
| haiku | `bypassPermissions` | `bypassPermissions` | **YES** | 0 | 0 | success | false |

Three laws fall out:

1. **`exit == 0` and `subtype == "success"` and `is_error == false` do NOT mean
   the work happened.** Every row above exits 0. The truth signal is
   **`result.permission_denials[]`** (and the in-stream `system/permission_denied`,
   which names `tool_name` + `tool_use_id`). A step whose result carries a
   non-empty `permission_denials` is **needs-⬡, never LANDED.** This is
   invariant §5.5 ("loud pauses") as a parse rule: without it, headless's
   failure mode is a *silent success*, which is worse than a stall.
2. **Posture asked ≠ posture granted, silently.** `manual` → `default`;
   haiku + `auto` → `default`. **C6 must read `init.permissionMode` back and
   compare against what it asked**, and refuse the step on mismatch (P5 F4's
   "the model decides", now measured headless).
3. **P5 F5's "haiku is not a legal model for an unattended step" is too broad
   headless.** haiku cannot hold `auto`, but holds `acceptEdits` and
   `bypassPermissions` and does the work. The legal-model rule is
   **per (model, posture)**, not per model.

## 5. sense — the four states, and the one that isn't there

Hooks **do** fire in print mode, both in-stream and to the external census.
Across 15 headless subjects the census recorded **8 of the ten events**, joined
on `session_id`, venue-blind (P1's join key holds headless):

```
$ grep -Ff sids summon/log/census/census.jsonl | jq -r .ev | sort | uniq -c
  17 PreToolUse   16 UserPromptSubmit   16 Stop   15 SessionStart
  15 SessionEnd   11 PostToolUse         1 SubagentStop   1 SubagentStart
```

Absent, both structurally rather than broken: **`Notification`** (P1 measured it
as a 60-second idle nag; `-p` exits at turn end and never idles) and
**`PreCompact`** (needs a long session).

| state | signature | evidence |
|---|---|---|
| **working** | process alive, `init` seen, no `result` yet | every capture |
| **idle** | a `result` with `permission_denials == []` | `q1-echo` |
| **needs-⬡ (permission)** | a `result` with `permission_denials != []`; in-stream `system/permission_denied` names the tool | `q1-write`, `q4-manual`, `q4-dontAsk` |
| **dead** | process exit with **no `result` event** (SIGTERM → 143, SIGKILL → 137) | `q6-SIGTERM`, `q6-SIGKILL` |
| **needs-⬡ (question)** | **NONE — not sensible from the stream** | below |

**The gap C6 must close.** A session that asks a question and waits is, at the
event level, *byte-identical* to a session that finished:

```
T-echo  (idle)     {"subtype":"success","is_error":false,"stop_reason":"end_turn",
                    "terminal_reason":"completed","num_turns":1,"denials":0}
T-ask   (question) {"subtype":"success","is_error":false,"stop_reason":"end_turn",
                    "terminal_reason":"completed","num_turns":1,"denials":0}
```

Every field matches. Print mode ends the process at turn end either way. **A
question is not an observable; it must be made structural.**

**The measured fix: `--json-schema`.** It works headless and yields a named
cause, which is exactly what contract §4.3 and invariant §5.5 demand
(`captures/q3-schema-*`):

```
$ claude -p '<task with a missing input>' --json-schema \
    '{"type":"object","properties":{"state":{"enum":["done","needs_input","blocked"]},
      "cause":{"type":"string"}},"required":["state","cause"]}'
{"state":"needs_input","cause":"Cannot write config file without: (1) filename,
 (2) format …","answer":"Provide the filename, format, …"}
```

C6 declares its step-report schema; the state comes back parsed, not guessed.
(my_checklist's `QUESTIONS:` block is the same move by convention; a schema
makes it unrepresentable to omit.)

## 6. kill + survive

`captures/q6-*`. T-long (five `sleep 6 && echo STEPn` Bash calls), cut at 20 s.

| cut | exit | `result` in stream | transcript | resumable |
|---|---|---|---|---|
| SIGTERM | 143 | **none** | 25 rows, 0 unparseable, no trailing partial line | **yes** |
| SIGKILL | 137 | **none** | 22 rows, 0 unparseable, no trailing partial line | **yes** |
| parent SIGKILLed | subject orphaned to **ppid 1** | (parent's pipe died) | **41 rows, complete, STEP5 present** | **yes** |

After each cut the resumed session knew exactly where it had been — *"I'd
completed STEP1 and STEP2 out of 5"*. **No torn JSON line was ever observed**:
the transcript is append-whole-lines.

**The survive law, verbatim from the parent-death run:** the orphan was
reparented to init, **finished all five steps**, and wrote its complete
transcript, while the engine that spawned it was already dead. Cornerstone §4.9
holds — *and* the corollary the engine must internalize:

> **The stream is the parent's view and dies with the parent. The transcript on
> disk is the truth and does not.** A restarted engine re-derives state from
> `<config>/projects/<slug>/<sid>.jsonl`, never from a stream it no longer holds.

*(Instrument note: the first parent-death attempt used `sh -c "exec …"`, which
made the shell **become** claude — killing "the parent" killed the subject — and
let the shell command-substitute the backticks in the prompt. Attempt 3, with a
real parent process and no shell quoting, is the row above.)*

## 7. resume into a terminal — D20's fallback, measured

`captures/q5b-*`. headless ignite → real TUI on a pty (private tmux socket
`-L c4`; the cmux desktop untouched) → hand turn → headless again, one session id
throughout:

- **History rendered in full.** The pane showed the headless-born turn and its
  reply verbatim.
- **The hand turn landed** in the same transcript under the same sid (user turns
  3 → 4).
- **Round trip lossless.** Asked headless afterwards for both codewords:
  `"HEADLESS-ALPHA-7, TERMINAL-BRAVO-9"` — the headless-born fact and the
  TUI-born fact, in one session.

**The precondition, found the hard way (`captures/q5-summon-personal-pane-boot.txt`):
summon-to-terminal stops dead at the workspace-trust dialog in a cwd the account
has not trusted.** `--help` states it: the trust dialog is skipped under `-p`,
and only under `-p`. So a session can be *born* headless in a cold venue and
then be **unsummonable** — the pane sits on `❯ No, exit`, rendering nothing.
This is P5's trust stall reappearing on the viewport path. **C6 must precheck
venue trust at ignite** (`glass/trust.ts`, per account — P5 F5.3), not at summon,
or D20's fallback is unavailable exactly when it is wanted.

## 8. scale, and what a turn costs

10 simultaneous subjects, one account, one command
(`captures/q8-10x-personal.json`):

```
N=10 wall=4.7s  load 4.92 4.58 4.98 -> 5.25 4.65 5.01
latency ms: min=3459 p50=3778 p90=4655 max=4655
exit0=10/10  sid_honored=10/10  correct_answer=10/10  transcripts=10/10
census: 10/10 distinct sids, 4/4 expected events each — zero loss
```

Ten concurrent subjects finished in the wall time of **one** (a lone T-echo was
3.9 s). No transcript collisions, no lock contention, no census loss. Nothing
here argues against the §4.8 bar of 100 — C9 tests it.

**Cost, for G4's extrapolation (bar 5).** 51 recorded `result` events:
`$1.6859` total, **`$0.0331`/turn** average, 562 input / 14,177 output tokens —
trivial prompts at haiku·low and sonnet·low. The charge's budget prose ("the
bill is cents") is low by ~50×; the binding ceiling (≤100 subject turns) held —
this dig spent ~65. **A turn is ~3¢, not ~0.05¢.** A 1,000-run layer-0 barrage
is free (fake claude); a 25-subject layer-1 flow is ~$1–3 per run.

Why so much for so little: a subject inherits the account's **full** config —
`init` reports **90 tools, 25 agents**, plus skills, plugins and CLAUDE.md — and
re-sends it every turn.

## 9. Contamination the engine must control

A headless subject inherits the account's global `CLAUDE.md`. The personal
account's symlinks to `canon/CLAUDE.md`, so a scratch-venue subject given a
nonsense task **quoted the Guild canon back**:

> *"I'm following the directives in your CLAUDE.md — particularly this part:
> 'A session wears a mantle … by Felix's explicit summons only, never
> self-adopted.' I'm not adopting new roles mid-conversation."*
> — `captures/q2-b-personal`, a haiku·low byte-echo probe

Harmless here, **not** harmless for a fake-claude conformance suite or a fuzzed
barrage: the subject's behaviour is a function of Felix's live canon, which
changes under the engine's feet (the sync set is live ×3). C5/C6 choose
deliberately between `--bare`, `--safe-mode`, `--tools`, `--system-prompt` and
`--setting-sources` — and record which. `--tools ""` was used in §7 to make the
summoned TUI provably unable to touch the repo it sat in; it works, though the
model still *attempts* MCP tools and takes `No such tool available` errors.

## 10. The engine's parse rules — the short list

1. Read the stream to **EOF**; the **last `result`** is the turn's outcome.
2. **`permission_denials[]` non-empty ⇒ needs-⬡, not landed.** Never trust
   `exit 0` / `success` / `is_error:false` as "the work happened".
3. **No `result` at EOF ⇒ dead.** Re-derive from the transcript, then resume.
4. **Read `init.permissionMode` back** and refuse on mismatch with what was asked.
5. **Choose the session id** (`--session-id`); persist that and nothing else.
6. **The transcript on disk is the truth**; the stream is a convenience that
   dies with its reader.
7. **Declare a `--json-schema`** for the step report, or needs-⬡(question) is
   invisible.
8. **Precheck venue trust at ignite**, or the summon-to-terminal fallback is lost.
9. If arm B: **pace on `result`**, and detect merged turns by **arithmetic —
   fewer `result`s than messages sent** *(corrected 2026-08-29, C5 F1:
   ~~`queued_turn_count > 0`~~ never fires — the merged run's own results report 0)*.
