# Belvedere — the ledger

Append-only, one entry per session, newest last, `---` between entries
([DOCTRINE §7](../canon/work/DOCTRINE.md)). Belvedere sessions ledger here, never in
the canon LEDGER (working agreement, [README §5](README.md)).

---

**2026-08-26 · Architect · fable-max (founding)** — Founded on the keel
([../plans/belvedere.md](../plans/belvedere.md)) and [dream.md](dream.md) (landed
immutable as the first commit — Felix's red pen presumed done since he fired the
summons ordered behind it; flagged in the founding report for his veto). Master doc
[README.md](README.md): the bet + rework mandate, the fence, organs, scope, working
agreements, board, DoD. [ISSUES.md](ISSUES.md) minted. Probes P1–P4 cut, briefed,
staffed (Digger · opus-high ×4); batch 1 Felix-tended, reasons in the batch note.
Founding smokes: cmux installed and launches but the socket **refuses outside
processes** (verbatim error in [P2](plans/p2-spawn-recipe.md), now its first
question); felikai copies — `felix/src` ≡ `hexwright/canon`, whiteboardy diverged;
design inputs recorded incl. bob's design system and the SpaceX dashboard (Felix,
in-session). Canon touches: CLAUDE.md pointer line, MAP §5 row 15, canon LEDGER
founding line. Decided: D1–D6, all ✓ Felix (D1–D2 via the keel sitting; D3–D6
countersigned in-session — D3's why explained at his ask, recorded in the entry's
own terms in README §2). Next: Felix fires batch 1 — P3 anywhere; P1 + P2 from
terminals inside cmux panes; P4 after both land (kickoffs verbatim in the briefs).

---

**2026-08-26 · Digger · opus-high (P3)** — Parse coverage landed; **kill criterion did
NOT fire.** Five doctrine-strict parsers ([lab/p3/](lab/p3/), `6c76dfe`) over 17
buildings: **25/27 board docs yield a canonical board, 365/365 rows extracted, 288
fully typed (79%), zero per-repo special cases.** Discovery added **whiteboardy** —
off the brief's pre-list and the city's second-largest doctrine corpus — and found
`manny` + `cornerizer` living only inside cap-mega worktrees (invisible to a
repo-walking glass). 14 failure classes, all general, every one with its verbatim
excerpt in [P3 §3](plans/p3-parse-coverage.md); the control (§0) caught two of my own
parser bugs before they were filed as corpus defects — one accounted for 32 of the
canon repo's 35 apparent decision failures. **Nine fold candidates FC-1…FC-9** (§4)
are canon amendments this building may not write (D2 fence); **FC-1** (`Felix-gate` as
a legal Staffing value — gate rows have no legal staffing today, spelled 5 ways across
9 boards) and **FC-7** (the summons fenced in `Next:`) **gate the baton rail: 1 of 8
ledger tails is fireable today.** Proposed glass JSON in §5, emitted from real parses
(`bun run.ts --json <repo>`), not invented. Repo work for other Architects listed in
§4, filed nowhere (brief's fence). Decided: nothing — FC-1…FC-9 are the Grand
Architect's, via the canon inbox. Next: batch 1 continues — P1 and P2 from terminals
inside cmux panes, P4 after both land; the fold sitting rules FC-1 and FC-7 before the
baton-rail build row is cut.

---

**2026-08-26 · Architect · fable-max** — *founding session, continued.* P3 verified LANDED
(contract met: findings evidence-grade with a control that caught its own parser
bugs, board + ledger current, commits `6c76dfe`/`9bc548a`/`36c87a9`, `lab/p3/`
present) — the kill did not fire; the glass can parse the city as it stands. Felix's
word this sitting sharpened the rework mandate into **the AI-native mandate — D7**
(✓ Felix, his own words in the entry): storage unconstrained, migration
pre-authorized, priority from the Sovereign; [README](README.md) §1 amended, §3
gains P3's register fact (four boards live worktree-only). The directive + P3's
FC-1…FC-9 + the multiple-batons question (D42/D46) filed to the canon inbox at his
word (D53) — the Standards Office rules formats; this desk never does. Decided: D7
(✓ Felix in-session). Next: Felix fires the Grand Architect (summons in the report,
verbatim); behind it, parallel-legal: P1 + P2 from cmux panes, P4 after both land,
then the fold sitting cuts build rows on measured physics plus whatever the GA
ruled.

---

**2026-08-26 · Architect · fable-max** — The molt folded into the glass: canon
D63–D67 + row 16 read from the repo, inbox swept (2 entries, both ruled, drained).
Folds: FC gates cleared (D63 — `Felix-gate` staffing token, the `Next:` law), baton
grammar move/wave/fork (D64 — the rail renders one/n/choice buttons; the `Baton`
shape gains `instruments[]` + kind at the build row), reference reader = canon
[`doctrine/`](../doctrine/) — the glass imports, never forks (D65; README §§1, 3,
5); rail fire-button affordance parked (Felix via GA-10, already legal — UX input
at the rail row). [P1](plans/p1-census-join.md) re-cut: +Q5 — count
Agent-tool/Bash/Workflow subagents from parent hooks or name the blindness
precisely (D67 routes Felix's decree here). Board trued: P2/P4 untouched
(substrate physics owe the format law nothing); canon row 18's wave runs
city-wide in parallel, defers live buildings; glass v0's evidence noted as canon
row 17's Felix-gate. Decided: nothing new — two inbox rulings (fold, park).
Next: fire P1 + P2 — a D64 wave, kickoffs in their briefs, both from terminals
inside cmux panes; P4 after both land; then the fold sitting cuts the v0 build
rows.

---

**2026-08-26 · Digger · opus-high** — [P2](plans/p2-spawn-recipe.md) LANDED, no
kill fired. **Q1 (pivotal):** the access gate is a server setting,
`socketControlMode` — **not** an env token. Isolated it four ways from inside a
pane: unset, corrupt, clean-env-with-token, clean-env-with-**no `CMUX_*` at all** —
every one admitted (`cmuxOnly` resolves the caller by process ancestry, which is
how `cmux identify` names the caller's surface). So D4 stands and the glass can
ship **in a cmux pane today, zero config, zero security delta**; outside access is
a documented `password` mode (schema enum + `--password`/`CMUX_SOCKET_PASSWORD`),
left **Felix-gated** — proving it means re-posturing his live desktop, and §5 names
that a shared resource. **Q2:** recipe proven ×3 accounts — summons byte-exact as
the **first user turn** (sha `19256ec9…` ×3), silo intact (each transcript under
its own config dir, nowhere else), `CMUX_*` exported inside with a per-surface
capability. The unlock: `/color` **leaves the prompt** — cmux owns colour over the
socket, which frees argv for the summons and closes the **359-fire paste gap**.
**Q3:** resume rides the identical path (+2 argv tokens), keeps its transcript, may
be re-stamped — the shelf is cheap. **Q4:** `send` is byte-exact for prose but
rewrites literal `\n`/`\t`/`\r`; `set-buffer`+`paste-buffer` is escape-safe; neither
may be pointed at a live TUI (T4 splits and auto-submits — a truncated summons looks
like it worked). Shipped [`lab/p2/spawn.ts`](lab/p2/spawn.ts) + `sanitize.ts` (the
superset port, plus the cmux-specific escape guard), probes and all eight probe
workspaces cleaned. Parked, not chased: spawned sessions boot into manual mode and
stall at the first tool call (S5 — a fire-button design input). Decided: nothing —
no D-entry; the two rulings this dig surfaces are Felix's (E1) and the Standards
Office's (E2, filed to ISSUES). Next: P4 once P1 lands (P2's half of its dependency
is paid); then the fold sitting cuts the v0 build rows on measured physics.

---

**2026-08-26 · Digger · opus-high** — [P1](plans/p1-census-join.md) LANDED, no kill
fired; 87 hook invocations across 13 scratch sessions, control clean. **Q2
(pivotal):** the join is **deterministic and free** — a hook process sees both
`CLAUDE_CODE_SESSION_ID` (byte-identical to the payload's `session_id`) and
`CMUX_SURFACE_ID`, on **87/87 invocations across all 10 event types**. No pane-title
stamp, no cmux CLI, no heuristic; the briefed fallbacks stay parked. Three traps
named: `SURFACE_ID`==`PANEL_ID` and `WORKSPACE_ID`==`TAB_ID` (store one); the env is
**inherited**, so pane→session is one-to-**many** — key by `session_id`, never by
surface; and `CMUX_CLAUDE_PID` goes stale (use `CLAUDE_PID`). **Q1:** ten events
fire, three the keel never named (`SubagentStart`, `PreCompact`, and a `SessionEnd`
that lies — see below); field inventory + verbatim payloads + the observed
vocabularies for `source`/`reason`/`notification_type`/`trigger`. **`Notification`
is a 60-second nag, not the needs-input edge** (measured: `Stop` 01:54:37 →
`Notification` 01:55:37) and never fires headless — **`Stop` is the rail's idle
sensor**. **Q3:** hooks proven **blocking** (6 events × `sleep 0.5` → +3.38 s wall),
so cost is process wall time: **5.5 ms median, 6.8 ms max at N=50, and only 0.7 ms
over an empty hook** — the 4.8 ms floor is spawn, which no design escapes. 7× under
the 50 ms bar. **Q5 / D67:** Agent-tool and Workflow agents are **fully countable** —
`SubagentStart`/`SubagentStop` with stable `agent_id`, `agent_type`
(`general-purpose`, `workflow-subagent`) and `agent_transcript_path` (the workflow
run id rides the path); every nested tool call carries `agent_id`, and parent calls
carry none, so the discriminator is exact. Background shell jobs are countable at
launch (`run_in_background:true`) and in the roster, with **one precisely-named
blindness: no completion event** — visible only via the re-injected
`<task-notification>` or the next `Stop`'s roster. Bonus organ: **`background_tasks[]`
on every `Stop` is a live WIP roster** — README §3's gauge, free. **Q4:** one JSONL
line per event into `summon/log/census/census.jsonl`; the hook is one `exec` into
`jq` that projects a fixed field set and drops every prompt, tool input and command
string — telemetry, never truth. Proven end-to-end, 60-way concurrent appends
intact. **Two traps the build rows must not inherit:** **SIGKILL leaves no
`SessionEnd`** (last line reads `Stop` — indistinguishable from live idle), so the
glass needs **two sensors**, the census *and* `kill -0 pid`; and **`/clear` rotates
the session id in place** (`SessionEnd reason=clear` → `SessionStart source=clear`,
same pane). Deploy is **additive** — `~/.claude/settings.json` carries no hooks
today (`permissions.defaultMode: auto`, `hooks: null`), so the Felix-run ×3 ritual
is a straight write. Shipped [`lab/p1/`](lab/p1/) — `beat.sh` (the production
candidate), `capture.sh`/`envdump.sh` (probe), `mkproject.sh`, `run.sh`,
`pty_run.py` (interactive driver — headless never emits `Notification`), `bench.py`,
`slow.sh`. No live settings file was touched. Decided: nothing — no D-entry; the
record schema is a build-row input, not canon.

**Baton — Felix (fork; his call because only he knows if the wave can pause):**
P1 and P2 both landed, so P4's dependency is paid — but P4 **kills the venue**
(README §5) and **45 `claude` processes are live** right now (`ps -Ao pid,command |
grep -c '[c]laude'` → `45`), row 18's re-cut wave among them.

- **A — fire P4 (recommended)** once the wave is at a boundary: it is the last
  unmeasured physics, and the fold sitting would otherwise cut the shelf/restore
  build rows on docs-read guesses.

  ```
  You are a Digger at opus-high.
  Wear ~/code/agents/canon/mantles/digger.md,
  then read ~/code/agents/belvedere/README.md
  and ~/code/agents/belvedere/plans/p4-restore-semantics.md,
  and execute the brief.
  ```

- **B — fire the fold sitting now** on three probes' physics, parking P4's questions
  as a named build-row risk. Cheaper today, pays for it at the shelf row.

  ```
  You are an Architect at fable-high.
  Wear ~/code/agents/canon/mantles/architect.md,
  then read ~/code/agents/belvedere/README.md and the P1/P2/P3 findings,
  and cut the v0 build rows.
  ```

Ordered behind either: the other one.

---

**2026-08-26 · Digger · opus-high (P4)** — Restore semantics landed; **kill criterion did
NOT fire** — restore lost no session, both victims returned **byte-identical**
(458/736796 · 505/791537 either side of the quit). The brief forked on contact: this
Digger was the **only** occupant of cmux (`workspace list` → one workspace, itself; the
other 17 live sessions all children of Ghostty, not cmux), so the STOP precondition's
"non-probe workspace" *was the dig's own session* and the method's observer was the thing
the method destroys — escalated, not worked around. **Felix ruled by acting**: quit cmux
himself and resumed this session in Ghostty, which put the observer outside the blast
radius and staged the experiment on two real victims (the P1 and P2 Diggers, killed
mid-desk). Measured from outside: cmux persists a **per-panel resume binding, never
conversational state** (`~/Library/Application Support/cmux/session-…json`, snapshotted at
the quit instant), gated by `wasAgentRunning` — an exited agent persists as plain
scrollback instead; the binding carries `CLAUDE_CONFIG_DIR`, so **the account silo survives
restore**. Unattended restore: **socket back 0.8 s, both agents re-exec'd 3.4 s**, argv
exactly the persisted binding. Loss is **the in-flight assistant turn and nothing else** —
assistant messages are atomic (measured twice at a true midpoint: ~6 s of generation → zero
assistant records; allowed to finish → the whole 5251-char record appears), and a restored
session **does not retry** the dropped turn, it answers `No response requested.` — it comes
back idle, context-complete, one turn short, with nothing on screen saying so. Control
(Q3): a cmux quit costs a session exactly what closing a terminal tab costs it — cmux's
flush signature *is* the SIGHUP signature, SIGKILL flushes nothing yet still resumes clean
(**a hard kill does not corrupt a transcript**) — so **cmux's delta is recovery, not
loss**. §A sharpens P2's ancestry hypothesis into a mechanism (orphan with a live parent →
admitted; same orphan at `ppid=1` → denied) and thereby **upgrades E1**: socket access is
*live* ancestry, so a glass in a pane **cannot survive a cmux restart** — `password` mode
is load-bearing for any glass expected to outlive its substrate, not cosmetic. Probe code
[lab/p4/](lab/p4/). Decided: nothing — E1 and the one residual measurement (mid-generation
*inside* a pane, which needs `socketControlMode: password` or `.newWorkspaceCommand`) are
Felix's, both named, neither taken. Next: **Baton — Felix: fire the fold
sitting.** All four probes' physics are measured; nothing in the v0 spine is left to cut on
a docs-read guess.

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/belvedere/README.md and the P1–P4 findings,
and cut the v0 build rows.
```

Ordered behind it: close the stray workspace this dig left on the desk (needs a pane —
`cmux <path>` can open one from outside but nothing outside can close it), then the two
standing Felix-gates — **E1** (`socketControlMode: password`, promoted from cosmetic to
load-bearing by §A) and P4's residual mid-generation-inside-a-pane measurement.

---

**2026-08-26 · Architect · fable-max** — Batch 1 CLOSED: P1/P2/P4 landings verified
(P3 verified earlier this sitting), zero kills across four probes. Folds into
[README](README.md) §3: the census is venue-blind (Ghostty sessions watchable —
P4 found 17/18 live sessions outside cmux today), `Stop` is the idle sensor, the
pane join is deterministic but one-to-many (key by `session_id`), heartbeat
5.5 ms; hands' transport law (`set-buffer`+`paste-buffer`, never paste into a live
TUI), summons-as-argv proven ×3, resume-by-name legal (the shelf addresses
stamps). D67 answered: all three subagent vehicles countable from hooks (P1 F4).
Inbox swept: P2's canon-shaped find (the rig's `/color` turn-burn) escalated to
the canon inbox verbatim-with-evidence, drained here. **The load-bearing new
fact (P4 §A): the socket gate is LIVE ancestry — a pane-resident glass dies with
every cmux restart and can never reconnect; deployment (b), `socketControlMode:
password`, upgraded from cleaner to required for a glass that outlives its
substrate.** Decided: nothing — the deployment ruling is Felix's (his machine's
posture; D8 when ruled). Next: Felix flips `socketControlMode` to `password` in
cmux Settings + sets a password, then the 10-second smoke from any non-cmux
terminal (`cmux --password '<pw>' workspace list`); on green, the fold sitting
cuts the v0 build batch onto deployment (b).

---

**2026-08-26 · Architect · fable-max** — The fold sitting's cut: **D8 ratified**
(deployment (b) — glass OUTSIDE cmux, `socketControlMode: password`; Felix's own
smoke from a non-cmux terminal is the evidence) and **batch 2 cut** onto it. Board
gains B1–B6 + G1: [B1](plans/b1-census-deploy.md) (census deploy — hook + ritual,
spec blessed on P1 F5/F6) ∥ [B2](plans/b2-glass-spine.md) (glass spine — City View
+ building pages over `doctrine/` + census, spec blessed on P1–P4, felikai theme,
port 4400) in worktrees `bv/b1-census`/`bv/b2-glass`; G1 batches every gate (D44):
Architect merge + B3–B6 order-cutting, Felix's census deploy ×3 + B2 visual pass.
B3–B6 (rail · hands · shelf+strip · inbox) cut OPEN, orders at G1.
[RIDER.md](plans/RIDER.md) instantiated (first dispatched batch). Felix's
programmatic-dispatcher musing filed to the canon inbox (a consideration, not a
decree) + parked here. Decided: D8 (✓ Felix, his smoke). Next: fire the
Dispatcher — summons fenced in the batch note ([README §6](README.md)); behind
it: G1, then B3–B6 in G1's cut order.
