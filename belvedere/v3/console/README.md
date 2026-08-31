# console — six verbs over the engine

Campaign bar 6's instrument: **list · read · send · summon · return**, each a
thin call into [engine/](../engine/)'s own exports, plus **tick**, the healer
[C20](../../plans/c20-tick.md) added. It is the piece Felix's hand tests at G4
and it is deliberately the thinnest thing that can be that — the library is the
product, and this is a hand-hold over it, like `engine/cli.ts`.

**It is not Belvedere.** No glass, no HTTP, no Chat, no colours. Built at
[C10](../plans/c10-console-demo.md).

```
bun console/cli.ts list                          [--root <dir>]
bun console/cli.ts read   <run> <step>           [--turn <n>] [--follow]
bun console/cli.ts send   <run> <step> <text|land|kill> [--note <why>] [--run]
bun console/cli.ts summon <run> <step>           [--tmux]
bun console/cli.ts return <run> <step> <text>    [--run]
bun console/cli.ts tick   <run>
```

Plain argv in, exit code out — 0 did it, 2 refused. No prompts, no TTY, except
that `summon --tmux` wants tmux on PATH. `<run>` is a run dir or its path under
the telemetry root (default `summon/log/v3`).

## What each verb is

| verb | what it does | what it costs |
|---|---|---|
| `list` | every step of every run under the root: state, causes, live/dead by pid, model·posture, account, session | nothing |
| `read` | one turn's stream rendered — init, prose, tools, refusals, the quota gauge, the result — with **the engine's own verdict** at the foot | nothing |
| `send` | a ruling into a paused step: `land`, `kill`, or an answer that resumes the subject | an answer is one turn; `--run` spends more |
| `summon` | the session in a real terminal (D20's fallback): prints the exact command, `--tmux` opens a pane on a private socket | nothing |
| `return` | a summoned step back under the engine, headless, on the same session | one turn; `--run` spends more |
| `tick` | the healer: a step the log says is `running` whose subject is dead, adopted from what is on disk | nothing, ever |

**A ruling never ignites anything on its own.** `send` and `return` move the
step they name and stop there; `--run` drives the flow on, spending a turn on
everything the ruling unblocked. It is a word the caller types and never a
default, because the flow behind a gate can be wide and every step in it is
money.

**`send` and `return` partition cleanly.** A summoned step is in a human's
hands: `send` refuses it and names `return`; `return` refuses a step no human
was handed and names `send`. Ambiguity never authorizes (D10).

## The tick

**A surface that drives the engine owns the turn it resumes.** Belvedere IS the
engine for the turn a Chat reply drives, and a driver killed between the
subject's `result` row and the engine's `landed` append leaves the step
`running` until something opens that run again — measured the hard way at
[C16 F2](../../plans/c16-chat-chapter.md). `tick` is that something:

```
bun console/cli.ts tick <run>
```

It is a **verb and never a supervising process** (D23). A supervisor is one more
component whose death strands the same steps one level up — the glass-shatters
test, [README §1](../../README.md) — while a verb heals from the log alone, at
any moment, from any hand. Two rules give it the idempotence that makes it safe
to run on anything:

- **it ignites nothing.** The engine's `tick()` also fires every ready step, and
  every one of those is a subject turn; a heal that spends turns is the
  supervisor wearing a verb's name. `run.heal()` is `tick()` with the fire loop
  taken away.
- **it never touches a live subject.** A pid the kernel still knows belongs to
  the engine that spawned it. So a settled run and a healthy one both move
  **zero bytes** and say which they were.

The transitions are `adopt()`'s and `resolve()`'s — the same recovery a restarted
engine performs (C6 F2's ruled fix), with no landing logic on the console's side
of the call.

**The drills are exempt, by construction.** The crash drill *needs* its orphans
alive between the cut and the restart — adopting one is the thing it proves — so
nothing in `barrage/` calls this, and a hand that runs it mid-drill still moves
nothing, because a live pid is never adopted (`barrage/sweep.ts`'s own header).
A pid the kernel has since handed to somebody else reads as live, so the tick
declines to act on that doubt rather than acting on it.

## What it reads

The run log, and nothing else — it is the truth (cornerstone §3.4). Two things
it has to work out for itself:

- **the venue, and so the account.** `CLAUDE_CONFIG_DIR` selects the account (C4
  F0) and since C14 the `ignited` event records it, so a log alone re-opens a run
  to drive it. Three sources, in this order: the **log**; then a
  `conditions.json` beside it naming `account` / `configDir` / `workDir`, which
  is how a **pre-C14** run says the same thing (C8's harness wrote it); then the
  engine's own sandbox, which is right for a layer-0 run and wrong for every
  other. A pre-C14 run on real subjects whose sidecar is gone is **readable
  forever and drivable never** — `list` and `read` work, and `send` / `summon` /
  `return` refuse in kind rather than resuming into a config dir that holds no
  such session. Nothing backfills an old log.
- **the flow file.** `load()` takes a path. When none sits beside the log, the
  console writes one from the log's own first event — the same bytes `load()`
  compares against (invariant 8).

Every session the run ever made is locatable from the log alone (C8 F8),
including a landed step's, whose replayed state has forgotten its session id and
whose `ignited` event has not.

## Two things it says plainly

**`auto` is not a restrictive posture headless.** A step at `auto` was granted
filesystem-wide writes, arbitrary shell and network egress, and the permission
pause cannot be induced at it (C8 F4). The console picks no posture — the flow
does — and `--help` says this in one line rather than letting the word look
cautious.

**`rate_limit_event` is a gauge, not an alarm.** It fires on every turn carrying
`status: "allowed"`; its presence is worth nothing, and reading it as an alarm
is the misreading C9 F1 caught inside a kill criterion. `read` renders the
utilization it carries — `unifiedWindows.five_hour` / `.seven_day`, the only
in-band quota signal the substrate gives — and prints ALARM only when the status
is not `allowed`.

## The summon

The command is `env -i` plus the clean room's eight variables and the real
binary addressed from HOME (C4 F0) — never `claude` off PATH, which is the cmux
shim. `--tmux` runs that very same argv on the private socket `v3`, detached, and
then **reads the pane back**: a summon into a cwd the account never accepted
looks exactly like one that worked until somebody looks, because the
workspace-trust dialog is the TUI's and only `-p` skips it (C4 F8). All three
accounts trust `~/code/agents` and trust is inherited by descendants (C8 F2), so
a warm venue inside the fence exists without touching a live config dir.

`summon` runs the same trust read the engine ran at ignite (`engine/venue.ts`)
**before it opens anything**: an unsummonable venue costs a refusal, not a
terminal and a human's attention (C10 F6). Reading the pane back stays, because
the two answer different questions — the file says what the account accepted, the
pane says what the TUI did about it.

The summon mark lands in `summoned.jsonl` beside the log — **the console's own
record, never the engine's**: a summon is not a transition, the run log records
what the engine did, and the engine did not do this. `replay()` and the nine
invariants never see it.

## The rehearsal

[rehearsal.ts](rehearsal.ts) is the one scripted pass, on real sessions, that
proves the five driving verbs — and the script Felix's hand re-runs at G4
(`tick` is not in it: its whole arc is a dead engine, which the console suite
reproduces at budget 0 and a real rehearsal cannot):

```
bun console/rehearsal.ts [account]      # default: personal
```

Three steps — `plan` lands, `ask` stops for a name, `hold` stops for a signer —
and every verb driven **through the console's own argv as a subprocess**, so
what it proves is the console and not a shortcut through the library. The hand
turn is typed by tmux here and by Felix at G4; it is a turn the engine never
fired and the account still paid for, so it is tallied off-log
([lab/c10/meter.ts](../lab/c10/meter.ts)). A previous pass is rotated aside, never
deleted — its streams are the only record of turns that were actually paid for.

## The bars, measured

`bun test` · `../../glass/node_modules/.bin/tsc --noEmit` · the real rehearsal —
evidence pasted in the [C10 charge](../plans/c10-console-demo.md).
