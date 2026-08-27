# P4 — restore semantics

**Status:** **LANDED** 2026-08-26 — no kill fired; one residual Felix-gated · **Depends on:** P2 (the recipe); P1 + P2 LANDED — this row kills
the venue, never runs concurrent · **Staffing:** Digger · opus-high

## Questions

1. What actually happens to a live `claude` turn (mid-generation) in a cmux pane on
   quit/relaunch? Claimed (keel §4, read from docs): the process dies; layout +
   scrollback restore; sessions return via their own resume. Measure it.
2. How much is lost — the in-flight turn, the last messages? — and does
   `claude --resume <uuid>` recover cleanly in the restored pane?
3. Baseline control: the same kill in a plain terminal tab — what does ANY terminal
   death cost a session? The delta is cmux's actual contribution.

## Inputs — read before working

- P2's findings — the proven spawn recipe and the socket-access verdict; do not
  re-derive.
- [README §5](../README.md): the cmux desktop is Felix's live screen.

## Method

**STOP precondition, checked first:** `cmux workspace list` shows ONLY probe
workspaces — any non-probe workspace → abort and reschedule with Felix; nobody
quits cmux over live work. Then: spawn a probe session (P2's recipe), start a long
turn (a slow counting prompt), quit cmux (`osascript -e 'quit app "cmux"'`),
relaunch (`open -a cmux`), observe the restore, attempt the resume. Repeat once for
confidence. Control per question 3. Cleanup at landing: close probe workspaces.

## Kill criteria

- Restore loses whole sessions (not just in-flight turns) irrecoverably → STOP,
  escalate: the substrate ruling (D4) reopens for the attended case too.

## Deliverables

Findings below — timeline transcripts per run, the control, loss accounting —
plus status current, commits (`lab/p4/`).

## Findings

**Landed 2026-08-26** · Digger · opus-high · run from **outside cmux** (Ghostty) after
the venue fork below · Probe code: [`lab/p4/`](../lab/p4/). Kill criterion: **did not
fire** — restore lost no session; both killed sessions came back byte-identical.

### V — the venue fork (method amended by Felix mid-dig)

The brief's method assumes an observer that survives the quit. It cannot: at kickoff
this Digger was the **only** occupant of cmux.

```
$ cmux list-windows      → 1 window, workspaces=1
$ cmux workspace list --id-format both
* workspace:1 01B67603-C364-45B6-A54C-8BD878DF2F5B  ◐ digger-agents-04  [selected]
$ cmux identify --json   → caller.workspace_ref "workspace:1", surface_ref "surface:11"
```

The other 17 live `claude` sessions were **not** in cmux — every one is a child of
Ghostty (pid 527), so a quit could not touch them:

```
45379 <- 44186 <- 44185 <- 527 <- 1   grand-architect-10
19888 <- 19511 <- 19510 <- 527 <- 1   builder-bob-03
(cmux app was pid 19136 — no claude session descends from it except this one)
```

So the STOP precondition's "any non-probe workspace" resolved to **the dig's own
session**, and the method's implicit observer was the thing the method destroys.
Escalated rather than worked around. **Felix's ruling: he quit cmux himself and resumed
this session in Ghostty** (`claude --resume digger-agents-04`, ps-confirmed), putting the
observer outside the blast radius and staging the experiment on two real victims.
Everything below is measured from outside cmux.

### A — the socket gate is *live* ancestry (sharpens P2 §A2)

P2 concluded "process ancestry"; this pins the mechanism: access is revoked the instant
the chain to the running app breaks. Same binary, same env, seconds apart — the only
variable is whether an ancestor still runs:

```
orphan, setsid, parent still alive, env -i, no CMUX_* at all:
  pid=35799 ppid=35796  → exit=0   * workspace:1  ◑ digger-agents-04
orphan, double-forked, reparented to launchd:
  pid=36894 ppid=1      → exit=1   ERROR: Access denied - only processes started inside cmux can connect
```

**Consequence for this brief:** after a quit, *every* candidate observer is an orphan, so
no detached driver can drive the socket across the restart. That is why the dig is
instrumented from disk + `ps` rather than `read-screen`.

**Consequence for Belvedere (new, and P2 could not have seen it):** deployment (a) — the
glass server in a cmux pane — requires the glass to keep a **live** cmux ancestor for its
whole life. A glass that outlives a cmux restart **loses the socket permanently**; it
cannot reconnect, it must be relaunched *by* cmux. So (a) is not merely "cmux must be up",
it is "the glass dies and is respawned with every cmux restart". Deployment (b)
(`socketControlMode: password`, P2 E1) is the only shape where the glass survives its own
substrate restarting. This upgrades E1 from "cleaner" to **load-bearing for any glass that
must outlive a restart.**

Two unauthenticated outside entry points found, both narrow:

```
$ cmux workspace list      → Access denied          (and capabilities, restore-session: denied)
$ cmux claude-teams …      → Error: Claude Teams must be launched from a cmux-managed terminal surface.
$ cmux ~/code/agents       → OK   exit=0            ← creates a workspace, from outside
```

`cmux <path>` is a LaunchServices app-open, not a socket call — it can create a workspace
but cannot carry a command. Combined with the settings key `.newWorkspaceCommand` (live
schema, fetched at `cmux.schema.json`), that is a *config-level* route into a pane from
outside; noted, not taken (it re-postures Felix's desktop — same class as E1).

### R — what cmux persists, and what restore actually does (Q1)

Restore state is one file, rewritten at quit:
`~/Library/Application Support/cmux/session-com.cmuxterm.app.json`
(snapshot at the quit instant: [`lab/p4/snapshots/session.at-quit.json`](../lab/p4/snapshots/session.at-quit.json),
`createdAt` = 1787797457.769 = 2026-08-26T22:24:17.769, the quit).

It is a per-panel record, and the discriminator is **`wasAgentRunning`**:

| panel | `wasAgentRunning` | `agent` | `resumeBinding` | `scrollback` |
|---|---|---|---|---|
| `0128A15C` digger-agents-02 | `true` | yes | `autoResume: true` | — |
| `DC0E493A` digger-agents-03 | `true` | yes | `autoResume: true` | — |
| `7A35E253` this session's old pane | *absent* | — | — | 1037 B raw |

An agent panel persists a **resume binding, not conversational state**: `checkpointId` =
the session uuid, `approvalPolicy: auto`, and a `command` that is the full
`claude --resume <uuid> --model <m> --effort <e> -n <stamp> --permission-mode auto`, plus
`cwd` and an `environment` carrying `CLAUDE_CONFIG_DIR` and
`CMUX_PRESERVE_CLAUDE_AUTH_SELECTION_ENV{,_KEYS}`. **The account silo travels through
restore** — the config dir is part of the binding, so a restored session cannot come back
under the wrong account.

A panel with no running agent is persisted as a plain terminal with **raw scrollback**.
That is why this session's own pane carried no binding — not a dropped binding, an agent
that had already exited, which its own scrollback proves:

```
➜ CLAUDE_CONFIG_DIR=~/.claude claude --model opus --effort high -n digger-agents-04 "/color blue"
Resume this session with:
claude --resume "digger-agents-04"
agents on master [↑? ] took 16m 7s
➜
```

(Incidentally: **resume-by-name is legal** — `claude --resume "digger-agents-04"` — which is
what Felix used. The shelf (DoD 4) can address a session by stamp, not only by uuid.)

**The restore, timed** ([`lab/p4/relaunch-observe.sh`](../lab/p4/relaunch-observe.sh),
full log [`snapshots/relaunch-timeline.txt`](../lab/p4/snapshots/relaunch-timeline.txt)):

```
T0 = open -a cmux
[+  0.23s] app=46933 sock=no   d02=none  d03=none
[+  0.77s] app=46933 sock=yes  d02=none  d03=none
[+  3.43s] app=46933 sock=yes  d02=48163 d03=48164     ← both agents re-exec'd
```

re-exec'd with argv exactly equal to the persisted binding
(`--resume aa67709f-… --model opus --effort high -n digger-agents-02 --permission-mode auto`).
**Socket back in 0.8 s, agents back in 3.4 s, unattended.**

**Both sessions returned byte-identical** — no truncation, no fork, same uuid, same file:

```
pre-quit :  aa67709f lines=458 bytes=736796 | 5b9f1786 lines=505 bytes=791537
restored :  aa67709f lines=458 bytes=736796 | 5b9f1786 lines=505 bytes=791537
```

**The kill criterion ("restore loses whole sessions irrecoverably") does NOT fire.**

### L — loss accounting (Q2)

**cmux's quit is a graceful termination, not a hard kill.** Proven by flush signature —
the two real victims against the control matrix (§C):

```
cmux quit, P1 digger (aa67709f) : [… 'system', 'last-prompt', 'cost-state']
cmux quit, P2 digger (5b9f1786) : [… 'system', 'last-prompt', 'cost-state']
control SIGHUP                  : [… 'last-prompt', 'atis-latch', 'cost-state']
control SIGKILL                 : [… 'attachment']        ← nothing flushed at all
```

cmux's signature is the SIGHUP signature; it gives its agents time to write. (Both victims
were idle at `end_turn` when killed — their last content records predate the quit by 10 and
21 minutes — so what flushed is housekeeping, not rescued work.)

**What a death costs: the whole in-flight assistant message, and nothing else.** Assistant
messages are **atomic** — they reach the transcript only on completion, so there is no
partial to salvage. Measured at a true midpoint, twice:

```
$ python3 control.py hup 216585b5-… 6
[+ 2.80s] generation underway
[+ 8.89s] PRE-DEATH : bytes=21660 lines=11
[+ 8.89s] killing terminal: mode=hup
POST-DEATH: bytes=22303 lines=14
  record types: [… 'user', 'attachment' ×4, 'last-prompt', 'atis-latch', 'cost-state']
  assistant records: 0
```

The `user` prompt is durable; ~6 s of generation left **zero** assistant records. The
control's contrast case proves the atomicity rather than a write-lag: when the turn is
allowed to *finish* (45 s hold), the assistant record appears whole — 5251 chars,
`stop_reason=end_turn`, ending `300 Three hundred` — followed by a `turn_duration` system
record. Complete turns survive; the incomplete one leaves nothing.

**Resume is clean, and it does not retry the lost work.** Resuming the mid-generation
victim recovered full context:

```
$ claude --resume 216585b5-… --model haiku -p "what instruction did I give you before this message?"
Count from 1 to 300, each on its own line with a two-word comment after it.
```

but the dangling prompt was answered `No response requested.` — i.e. **a restored session
does not resume the interrupted turn; the work is silently dropped and someone must
re-ask.** For the Hands organ that is the operational fact: a fired session that dies
mid-turn comes back *idle and context-complete, one turn short*, with nothing on screen
saying so.

### C — the control: what ANY terminal death costs (Q3)

Harness [`lab/p4/control.py`](../lab/p4/control.py) — pty-forks `claude` with the prompt in
argv (turn starts on launch), confirms generation is underway, then kills the terminal the
way a terminal tab dies (`SIGHUP` to the foreground pgroup + master close), or hard
(`SIGKILL`). Model haiku, `--session-id` fixed so resume is deterministic.

| | reaped after | transcript at death | flushed on death | in-flight turn | resume |
|---|---|---|---|---|---|
| **SIGHUP** (tab closed) | 0.31 s / 0.41 s | 11 lines | +3 (`last-prompt`, `atis-latch`, `cost-state`) | **lost entirely** | clean, full context |
| **SIGKILL** (hard) | 0.11 s | 11 lines | **0** — bytes *and* mtime unchanged | **lost entirely** | clean, full context |

```
SIGHUP :  PRE-DEATH bytes=21660 lines=11  →  POST-DEATH bytes=22304 lines=14
SIGKILL:  PRE-DEATH bytes=21662 lines=11  →  POST-DEATH bytes=21662 lines=11
```

A SIGKILL'd session still resumed with full context (`Count from 1 to 300, each with a
two-word comment, no tools.`) — **a hard kill does not corrupt the transcript**, because
everything except the in-flight message was already durable.

**The delta — cmux's actual contribution (the brief's question 3):** *none, on the loss
axis.* A cmux quit costs a session exactly what closing a terminal tab costs it: the
in-flight assistant turn, nothing more. What cmux adds is on the **recovery** axis — a
plain tab death leaves the session dead until a human re-fires it by uuid or stamp, while
cmux persists a per-panel binding and brings every running agent back, correct account and
all, in **3.4 s, unattended**.

### Escalations / open

**E1 (P2) is upgraded, not merely confirmed** — see §A. Any glass expected to survive a
cmux restart needs `socketControlMode: password`; in a pane it dies with the substrate and
cannot reconnect. Still Felix-gated, still not done unilaterally.

**One residual measurement, Felix-gated.** The mid-generation case was measured against
terminal death (§C, twice) and cmux's quit was shown to be that same graceful class by
flush signature (§L) — and since cmux persists only a *resume command*, never
conversational state (§R), it has no mechanism to preserve more. The direct
"mid-generation turn inside a cmux pane, quit, relaunch" confirmation was **not** taken:
driving a probe session inside cmux from outside needs either `socketControlMode:
password` or `.newWorkspaceCommand`, both of which re-posture Felix's live desktop. Named,
not worked around.

**Housekeeping left on the desk:** the outside-access probe `cmux ~/code/agents` created a
stray workspace (a plain shell, no agent) that this Digger cannot close without the socket
— close it by hand. The two restored Digger sessions (`digger-agents-02` = P1,
`digger-agents-03` = P2, both LANDED and idle) are live in cmux and can be exited at will.
Control probes are ordinary transcripts under `~/.claude`, session ids in
[`lab/p4/snapshots/`](../lab/p4/snapshots/).

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/p4-restore-semantics.md,
and execute the brief.
```
