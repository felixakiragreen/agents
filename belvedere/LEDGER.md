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

---

**2026-08-26 · Architect · fable-max (G1)** — Batch 2 verified and merged
(`ab4d857`, `a22a841`; both bv/ worktrees torn down, venue law; the third
worktree is canon row 18g's — untouched, not this board's). Escalations ruled:
**D54 slip accepted** (self-caught, clean tree, zero harm — future orders name
their typecheck instrument); **E1 ruled** — "zero caches" scopes to CONTENT,
register ≤30 s warm with age printed (Builder option 1; option 2 → canon inbox:
the walk is `doctrine/`'s; option 3 rejected — the rail lives on `/`); **F2** —
off-register panel is right, the campus/cwd-ascent question filed to the canon
inbox. B2's F1 (stamp via transcript head window, never `invocations.jsonl`)
folded into B5's order. **B3–B6 orders cut and blessed**; batch 3 = B4 → B3 →
B5 → B6 strictly serial on master, Dispatcher-tended, Felix-gates batched at
close. Felix's inbox corrections recorded: the continuous-flow entry supersedes
the programmatic-dispatcher framing (canon inbox, his verbatim example); his
socket password is temporary — nothing consumes it until B4; credential home
ruled `~/.config/belvedere/env` (B4 spec). His new field report (ScheduleWakeup
`prompt` error) committed in the canon inbox for the GA sweep. Decided: G1
rulings (delegated scope). Next: Felix — the G1 wave (census deploy ×3 from this
checkout, spine look at 127.0.0.1:4400), then fire B4, B3, B5, B6 (batch 3,
Dispatcher-tended — summons fenced in [README §6](README.md)).

---

**2026-08-27 · Architect · fable-max** — G1 closed complete: Felix ran the census
deploy ×3 (the sensor is LIVE city-wide) and passed the spine; batch 3 dispatched
by his hand. His scope question ("summon agents / new campaigns / worktrees from
Belvedere?") exposed two gaps, both closed: **B7 cut** (the summon composer —
fire-anything with templates incl. the founding summons; joined the running chain
after B6 by D57 amendment, batch note committed, the Dispatcher's amendment
message drafted verbatim in the report) and **B3 amended pre-dispatch**
(worktree-composed fires — a row-doc that names a branch gets /worktree → /fire,
"worktrees without asking"). New-building guided flow parked (the founding
ritual's Felix-steps stay his). Decided: B7 cut + B3 amendment (delegated scope).
Next: Felix delivers the batch-3 amendment message to the Dispatcher window
(verbatim in the report); behind it: the chain runs B4 → B3 → B5 → B6 → B7 to
the close gates (visual pass + live-fire smoke, his), then the v0 DoD
run-through.

---

**2026-08-27 · Builder · opus-high (B4)** — **The hands landed.** Four write powers
as endpoints on the existing server (`glass/hands.ts`, +`sanitize.ts`, +
`hands.test.ts`; `paths.ts`/`census.ts`/`pages.ts`/`server.ts` touched), straight to
master: `POST /hands/{fire,worktree,focus,halt}`, credential-gated, every action
audited to `summon/log/census/hands.jsonl` **minus the summons text but plus its
sha** — a fire is provable byte-exact from the log alone. DoD measured, not
asserted: the fire's summons and the transcript's first user turn are the same
sha256, `$(echo pwned)` arrived unexpanded, the workspace was coloured over the
socket with **no `/color` turn**; resume came back on its own transcript; the
worktree was created, refused on repeat, removed; **focus jumped off the LIVE
census** (B1's sensor went live mid-row) and Felix's focus was restored every time;
HALT written then cleared; disabled mode 503s with an honest banner while read pages
stay 200. 62 tests green, venue restored, `git status` clean. Two escalations:
**E1** — the socket already admits any local process of Felix's (a wrong password is
rejected, but presenting *none* falls back to cmux's saved one), so the credential
is an **arming switch, not the lock** — Architect's wording call; **E2** — an agent
cannot provision that credential (the permission guard refused twice, correctly), so
`~/.config/belvedere/env` is a **one-command Felix-gate** and until he runs it every
hand answers 503. Also relayed: cmux injects its own hooks per session via
`--settings` and the census still fires (measured ×3 probes); B2's dropped `ws`/`sf`
restored for the jump; the order's literal launch line had a shell bug
(`CLAUDE_CONFIG_DIR=… cd …` scopes the var to `cd`) — shipped as P2's proven shape.
D54 slip self-reported: `bunx tsc` (B1's again, zero harm, no lockfile) — the real
gap is that the city has no offline type-checker. Decided: audit belongs to the
write, not the route (no caller routes around it). Next: B3 (the baton rail) —
bulletin carries the wire contract and the disabled-state requirement.

---

**2026-08-27 · Architect · fable-max (B4 E1)** — Ruled: **D9** — the credential is
an **arming switch, not the lock**, and it stays. B4's measurement (a wrong
password rejected loudly, none at all admitted via the CLI's Settings fallback)
retires D8's auth *framing* while its deployment ruling stands whole: password
mode's function is admission (P4 §A's load-bearing fact), never local
restriction — what stands between a stray agent and the desktop is the
permission guard, the fence (D3), and the audit. Ratified B4's call to keep
requiring `~/.config/belvedere/env` (it gates accidents, not adversaries) and to
keep the real password in it, not a sentinel — D8's operative text, no hidden
state, and the Ava chapter needs the value presented for real.
[README](README.md) §§2–3 amended, D8 annotated, D9 cut (✓ Felix in-session);
board B4 row trued; ruling line appended to [B4 E1](plans/b4-hands.md). P2 §A3's
"knows the password" prediction left as filed history — B4 E1 carries the
correction. Inbox swept: empty. **E2 paid in-session** — Felix armed
`~/.config/belvedere/env` by his own hand (0600 verified, secret unread) and
rotated the socket password off G1's temporary; the glass was down at check, so
the armed banner shows on its next run, and `handsState()` checks presence and
mode only — the batch-close rail fire is the end-to-end proof the file's value
matches the rotated password (mismatch → the first fire 409s `Invalid password`;
fix is re-running E2). Decided: D9 (✓ Felix in-session). Next: the batch-3 chain
runs on (B3 → B5 → B6 → B7) to the close gates — nothing on this desk.

---

**2026-08-27 · Builder · opus-high (B3)** — The baton rail LANDED. `/` is the
morning — every ledger-tail baton in the city, every named Felix-gate still live on
a board, every pending countersign, one column, buttons; the City View moved to
`/city`. 38 cards over 22 buildings: **8 of 8** batons `doctrine/` can read (the
ninth ledger closes `Next —`, an em-dash where D63 wants `Next:` — the corpus's
defect, not the rail's), 29 gates, 1 countersign. D64 renders as one/n/choice with
the fork's recommendation badged; the shape is a **thin render-side splitter** over
the baton's prose, `doctrine/` untouched (D65). Holder law is **structural**: 35 of
38 cards carry no `<button>`, no `data-fire`, no handler at all — not a `disabled`
attribute. Fire affordance per GA-10: **new session** (worktree composed first when
the work doc designates one) and **copy summons** to the clipboard, never a paste
into a live TUI. Smoke: fence → clipboard → argv → first user turn, **one sha256**
(`d6f9c69c…`, 113 B) across all four, stamped `builder-probe-row-03`, worktree
`bv/b3-smoke` composed and torn down, venue restored. Two escalations. **E1 — the
G1 E1 ruling's own implementation cost a p95 of 8.3 s**: B2's deferred walk left the
request but not Bun's single thread, so two of twenty 2 s-spaced page loads stalled
8.5 s. Moved to a worker (`glass/register.worker.ts`) — **p95 48 ms** — but a 20 s
TTL over a 9.5 s walk re-walks 50 795 directories half the time Felix is reading;
the TTL policy is the Architect's. **E2 — all three of the city's fireable batons
are Felix-gated in their own prose while `classifyBaton` calls them session
batons** (the instrument wins over the word "Felix"), so two Dispatch buttons sit
under text saying the fire is his. The rail reports it on the card and escalates the
grammar; it never overrules the parser. Findings: rig colours are **not** cmux
colours — `cyan` (Builder) and `pink` (Dispatcher) are refused outright, and the
fire hand sets colour *after* creating the workspace, so a refused colour cost a
whole fire and left an orphan (audit line, verbatim, in B3 §F1); a fire into a tree
with no trusted ancestor stalls at Claude Code's folder-trust dialog before the
summons is ever a turn (**bites B7**); reading a row's branch out of prose was
unsound (12 of 62 work docs matched, **all retrospective**, one on an OPEN row) and
is now header-only, worktree-only, never a landing record — 0/62. `bun test
belvedere/glass` is red on a **pre-existing** B4 cross-file env collision
(reproduced at `286b370`); parked to ISSUES, 105 tests green per file. D54 slip
self-reported: `bunx tsc` — B1's and B4's again, third time, no lockfile, no harm;
the city still has no offline type-checker and that is now a pattern, not a slip.
Decided: the register may be held warm but never on the serving thread; the rail
resolves and never invents — a blocked instrument shows its reason and no button.
Next: **fire B5** — the shelf and the gauges; the bulletin carries the rail's wire
notes and the two canon asks.

---

**2026-08-27 · Architect · fable-max (B3 E1/E2)** — *same session, continued.* B3
verified LANDED (18 commits `1ec54a3…ffb3d19`, tree clean, findings + three canon
asks filed, board/ledger current — including the killed run's leftover diff
reviewed and corrected rather than discarded). Ruled **E1**: the worker is law —
the walk never rides the request thread; TTL **5 min** (a 20 s TTL over a 9.5 s
walk re-walked ~half of Felix's reading time, for data that changes at building
cadence), the glass's own fires/worktrees bust the register, a manual re-walk
rides beside the printed age. Ruled **E2 — D10, ambiguity never arms**: a fire
affordance renders armed only when parse and prose agree; where B3's collision
note fires, the card loses its wiring (note + copy stay); parse untouched (D65),
the grammar stays canon's; B6's apply and B7's composer inherit. Inbox swept — 4
entries, all ruled, drained: isolation + unwind + the rulings → **B8 cut**
([plans/b8-glass-hardenings.md](plans/b8-glass-hardenings.md)), joining batch 3
by amendment and **firing first**; the trust dialog → B7's order amended (warn,
never answer); the 3-for-3 `bunx tsc` pattern → offline type gate into B8 + rider
amended + escalated to the canon inbox (city-standard question). Decided: D10
(awaiting Felix's ✓); the E1 register policy (delegated — amends this desk's own
G1 ruling). Next: Felix delivers the batch-3 amendment to the Dispatcher
(verbatim in the report); the chain runs **B8 → B5 → B6 → B7** to the close
gates.

---

**2026-08-27 · Builder · opus-high (B8)** — Glass hardenings landed; all five specs
built to their DoD, nothing escalated. **The E1 policy is live**: `TTL_MS` 300 s, the
glass's own successful fire or worktree calls `bust()`, and a **re-walk button** sits
beside the printed age in every footer (`/rewalk?to=…` → 303 back, answering only when
the new walk IS the held copy). Measured: footer reads `ttl 300s`, **p95 45 ms** over
B3's 20-request protocol (bar: 500 ms), a live `/hands/worktree` moved the register
75s → refreshing → 3s **without stalling the request that took the bust**, and three
concurrent page loads inside a 9.2 s re-walk came back in 33–85 ms. **D10 is live**:
`collides()` gates the wiring, so the two collided cards in the real city (hexwright,
simmy) render with the collision named, the summons copyable, and **zero** fire wiring
under B3's structural grep — holder still `session`, because D10 is render law, not a
second parser. **The fire unwinds**: a failure after `workspace create` closes what it
made — induced with B3 F1's own refused colour, `workspace:11` closed, `fire.unwind`
audited before the fire's own line, `cmux workspace list` unchanged, no orphan process.
**Test isolation fixed at the cause** — `paths.ts` resolves every env-derived anchor
per call (a constant now means "the environment cannot move this"), `bun test
belvedere/glass` **109 pass / 0 fail in one process**. **The type gate is offline**:
`typescript@7.0.2` + `@types/bun@1.4.0` pinned with `bun.lock` committed,
`tsconfig.json` strict and covering `../../doctrine/**`, `bunx --offline tsc --noEmit`
exit 0 — the third-party fetch was the two the order named (D54 satisfied, not slipped).
Findings F1–F5 in [B8](plans/b8-glass-hardenings.md): **F1 — the isolation bug was never
just eight red tests: the suite armed the city's real `summon/log/HALT` from
`hands.test.ts` and left it armed, wrote 16 lines into the real `hands.jsonl` (four of
them stamping `builder-belvedere-01`, which `nextStamp` has been counting as a real
fire), and printed Felix's live socket password into a failure diff.** HALT cleared this
row, venue restored as B4 left it; the audit lines parked to ISSUES — never assert on a
credential's value, and prove a temp knob by asserting the temp path was written.
**F2 — D10 takes the live rail to 0 armed cards of 38**, which is B3 E2's
measurement arriving as a consequence, not a defect; F3 the worker law binds B5's
scans; F4 the gate covers `doctrine/` and found one latent `Beat` error; F5 the walk
now dedupes 12 810 worktree copies, parked for whoever owns its cost. Decided: nothing
— every fork was pre-chewed in the order. Next: **fire B5** — the shelf and the gauges;
the bulletin carries F1's warning and F3's worker law.

---

**2026-08-27 · Architect · fable-max (flow keel + B8 sweep)** — *same session,
continued.* B8 verified LANDED (nine commits `2defc6e…195441d`, five DoD items
measured, zero escalations — the pre-chewed order held). Its F1 incident absorbed:
the frozen anchors had armed the real HALT from a unit test (B8 cleared it) and
printed the live socket password into a failure diff — rotation recommended to
Felix (cheap; D9 bounds the real risk). Inbox swept (2): the audit's 16 test
lines — **the scar stands** (no scrub; B8 F1 is the record; ordinals cosmetic per
B7's spec); the `bun test doctrine` corpus-drift → canon inbox. **Felix's design
laws recorded** (README §3, his words): encapsulation-first + [expand],
Inter/IosevkaFelix split, legends, directory grouping, recency-informs, usage
beside accounts, no dropdowns; B7 amended (dropdowns out); **B9 cut**
([plans/b9-visual-law.md](plans/b9-visual-law.md), opus-medium, last before the
close gates). **The flow chapter keeled**
([plans/flow-keel.md](plans/flow-keel.md)): the Dispatcher's between-sessions
logistics mechanizes — a flow is the batch note as data; **D11 (Felix): one
click arms the declared DAG, drawn not listed** (nodes/edges/lanes/live census
lighting; plan view = progress view); D10 + HALT bind the engine;
landing-`holds` and S5 mode are the named physics; encapsulation joins
kind/branch/holder/holds as the **row-17 evidence pile**. Timing (Felix): after
v0 closes — rows at the v0 close sitting. Decided: D11 (✓ Felix in-session);
D10 ✓ Felix same sitting. **Felix's wave paid in-session**: amendment #2
delivered, D10 countersigned, password rotated + E2 re-armed. His
countersign-button ask ruled inside existing law — **a B6 gesture** (order
amended: Countersign on pending-countersign cards → D63 inbox append, card
states pending → recorded → folded; the glass never pens the D-entry — D3
stands, no new write class). Next: the chain runs B5 → B6 → B7 → B9 to his
close gates, then the v0 close sitting cuts the flow rows — nothing on this
desk.

---

**2026-08-27 · Builder · opus-high (B5 — the shelf and the gauges)** — `/shelf` is
live: 723 transcripts across all three accounts in **46 ms**, joined on the uuid
from three sources (filename → session id and resume handle; the transcript's own
64 KB head → name-stamp and cwd; the census → live or dead), and the projects
**slug is never parsed** because `/` and `_` both flatten to `-`. Changed:
`glass/shelf.ts` and `glass/gauges.ts` new, `glass/census.ts` (`aid`/`at`/`bg`, the
identity join, the sensor horizon), `glass/hands.ts` (the resume widening),
`glass/pages.ts` (`buildingOf`), `glass/paths.ts`, `glass.css`, `server.ts`, three
test files — **166 green in one process**, `bunx --offline tsc --noEmit` exit 0,
nothing written outside `belvedere/glass/` and the census dir. DoD measured, not
asserted: **one dead session resumed from each account** (three `SessionStart`
beats, each on its own transcript under its own `CLAUDE_CONFIG_DIR`) with **no user
turn injected** — the newest turn in all three is still 10–12 h old — venue restored
to the one workspace it started with; the usage strip matches the rig's **own**
`_summon_usage_delta` on 9/9 cells at one instant (cost one real fix: the rig rounds
away from zero); the 16-cap **induced live**, 18 shells in, `{"n":16}` out, `15+` on
the page. Decided: nothing — two escalations filed instead. **E1: the census sees 6
sessions where `ps` sees 38** — B1's hooks went live mid-city, so every pre-hook
session is invisible and every WIP figure in the glass (rail and City View too) is a
floor; the panel now prints the horizon, the sensor question is the Architect's and
P1 F5 warns against a second liveness authority. **E2: `/hands/fire` widened** — on a
resume, a field the glass does not know is omitted from argv, never guessed;
backwards compatible, `summonsPath`/`sha` now nullable. Three findings bind the rest
of batch 3: **F1** `buildingOf` assumed a branch was one path segment, so the city's
own `bv/…` branches have been mis-housing every worktree session in its repo root
since B2, silently, on the rail and City View as well (fixed at the cause); **F2**
only `Stop`/`SubagentStop` carry `bg` (210 of 210), so an empty roster means
*unknown* and renders `?`, never `0`; **F3** the slug is lossy. Built to the §3
design laws natively — no dropdowns, usage beside the accounts, attention-first
sorting, `[expand]`, a legend — with Inter's vendoring left where it belongs, in B9.
Next: **fire B6** — the sovereign's inbox; the bulletin carries E2's wire change and
F2's roster law.
