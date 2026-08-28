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

---

**2026-08-27 · Architect · fable-max (B5 E1/E2)** — *same session, continued.* B5
verified LANDED (8 commits `3113670…ea868b7`, tree clean, 166 tests one process,
type gate 0; resume ×3 accounts with no turn injected, strip 9/9 vs the rig's own
function, 16-cap induced live). Ruled **E1**: the census stays the **sole
identity authority** (P1 F5 upheld — no second liveness authority); the 6-vs-38
gap is the sensor's horizon (hooks live 04:03Z; pre-hook sessions are beat-less
and die with the floor), and the glass renders it as the **auditor delta** — one
approximate labeled `ps` count beside the census figure, never merged into
cards: the `sync/check` pattern, the census's own standing drift alarm → B9
amended, one read across shelf/rail/City View. Ruled **E2 — ratified whole**:
"on a resume, a field the glass does not know is omitted, never guessed" is
standing hands law; the uuid-only handle and jump-not-resume both stand (D10
applied). F1 noted with respect: worktree mis-housing since B2, fixed at the
cause city-wide. **Felix's meta-ask folded into the keel — the reactive gate**:
an escalated landing fires the scoped Architect sitting into the lane (B6's
apply button is the v0 prototype); Felix carded only on further escalation.
Evidence: five build rows, seven escalations, six Architect-delegated, every
ruling hand-relayed by Felix — while B8's fully-pre-chewed order escalated zero.
Decided: E1/E2 rulings (delegated scope). Next: Felix relays the resume —
**proceed B6** — then B7 → B9 to the close gates.

---

**2026-08-27 · Builder · opus-high (B6 — the sovereign's inbox)** — his word travels
without his hands: `POST /inbox` is the fence's third write, and it is the only one
that touches a file the city commits. Four gestures — a free-text note, `defer <row>`,
`<row> before <row>`, `countersign <D-id>: ✓` — each become **ONE append** in D63
grammar (`- <YYYY-MM-DD> · Felix (via Belvedere) · <what>`, local date because
`toISOString()` would file tonight's note tomorrow). Changed: `glass/inbox.ts` and
`glass/inbox.test.ts` new (49 tests), `glass/pages.ts` (a gesture column on every board
row; the ISSUES panel gained the note box and the apply button), `glass/rail.ts` (a note
box on every card, the countersign act, the card's pill is now its state), `glass/hands.ts`
(four wire primitives exported and shared — a socket write lives behind the arming switch,
a file write in front of it), `server.ts`, `paths.ts`, `glass.css`, `glass/README.md` —
**219 green in one process**, `bunx --offline tsc --noEmit` exit 0. DoD measured over HTTP
against a live glass, with **every payload read out of the rendered HTML** rather than
hand-written: append-only proven on **ten concurrent** gestures (BEFORE `sha256 742402d4…`
byte-identical to AFTER's first 705 bytes, 12 entries, 0 lint); first-gesture adoption
minted a header that is the D53 template's own bytes (`3d811b06…` both sides); the apply
button fired the scoped Architect into cmux with a **byte-identical first user turn**
(386 B, `bf1b1333…` both sides), probe on a throwaway worktree, closed in 4.7 s, venue
restored; the countersign card walked **pending → recorded → folded**, all three read off
files, the button only on pending. `git diff` over the one repo touched: two appended
lines in `belvedere/ISSUES.md`. Decided: nothing — nothing escalated; the spec held.
Four findings: **F1** the fence's own wording for an inbox entry is pre-D63 in two places
(README §2 write #3 and the inbox's own header) while the blessed spec writes D63 — **filed
by the glass itself, as the DoD smoke**; **F2** `parseDecisions` marks an entry pending
wherever the phrase appears, *including in the entry that defines the marker*, so canon
**D21** (`✓ Felix` since 2026-08-03) has been a false countersign on the rail since B3 —
both live cards were D21, so **the city has zero true pending countersigns** and the
amendment's DoD had to run on a synthetic decision; handled render-side (folded outranks
pending — D10, ambiguity never arms), the parser ask escalates to canon; **F3** `/inbox`
sits deliberately outside the credential gate (spec §4 — cold hands must never cost him
the ability to say something); **F4** a bare bullet appended onto a non-empty tail block
reads as that block's evidence, so `addition()` opens a `---` for it. Three rail tests
narrowed deliberately and made stronger: "no button at all" became "no fire wiring **and**
every button here is an `/inbox` gesture". Next: **fire B7** — the summon composer; the
bulletin carries F2 (the countersign false positive), F3 (which side of the gate a new
write belongs on) and B6's sweep template, which B7 §2 reuses.

---

**2026-08-27 · Builder · opus-high (B7)** — the summon composer: the blank page, fired.
`/summon` composes and fires ANY session — new work, a new building, an ad-hoc sitting —
with no terminal in the loop. **Compose, then fire**: the form is inert radios in toggled
button groups (no client state, **zero `<select>` anywhere on the page**), one press
resolves target · account · mantle · tier · name-stamp · colour · worktree plan · trust
verdict, and only that render carries a fire button, wired to the exact JSON the card is
showing — armed by the hands' own `parseFire` run over the composed body, one gate rather
than a second copy of one. Eight templates (one per mantle, the founding Architect's
DOCTRINE §12 fence, B6's inbox sweep), each a whole opening: applying one sets the mantle
and the tier it speaks as. Changed: `glass/composer.ts` and `glass/trust.ts` new,
`glass/composer.test.ts` new (52 tests), `glass/summon.ts` (`.summon-theaters`, the Grand
Architect's no-theater lineage, a third stamp source), `glass/rig.ts` (`tiers`),
`server.ts`, `glass.css`, three navs, `glass/README.md` — **271 green in one process**,
`bunx --offline tsc --noEmit` exit 0, `/summon` p95 13 ms. DoD measured over HTTP against a
live glass with **every fire body read out of the rendered HTML**: four fires byte-exact
(sha256 identical page-side and transcript-side), the founding template verbatim at a
scratch dir (185 B, `845e7932…` both sides), a worktree-composed fire landing with cwd
**inside** the cut worktree, `builder-belvedere-02→03` on two consecutive fires, disabled
mode honest (503, an in-DOM disabled button, the plan still composed), `git status`
unchanged, venue restored. Decided: nothing escalated — one false assumption in the order
was found and worked around in the open (F2). Six findings, one of which binds the rest of
the campaign: **F1 — Claude Code's unit of trust is the PROJECT ROOT, it is per account,
and a repository never borrows an ancestor's trust.** Measured two ways inside one trusted
`~/code`: a plain directory ran and beat the census ten times, a fresh `git init` **stalled
with zero census beats, no transcript and the process alive on the dialog** — and so did a
worktree under it. All 36 live trust entries across the three accounts sit exactly on
project roots; all 9 live sessions are warm under the rule. The naive "nearest trusted
ancestor" reading returns a **false warm**, which is precisely the silent success the
amendment was written to prevent. **F2** the order's "scratch repo" is therefore unfireable
by construction (the worktree DoD ran in `agents`, B3's precedent). **F3** the glass's
stamp slug is narrower than row 14's theater law, so `universal_robots_sdk` forks the
lineage — refused loudly by `parseFire`, never fired as something else; a B4-boundary
contract question. **F4** the live census is a load-bearing third stamp source
(`architect-belvedere` is in neither log and in the census), and **the rail still passes no
`known` list**, so it would hand that name out twice — parked to B3's ground, one array
away. **F5** the Grand Architect's no-theater exception now matches the rig
(`grand-architect-11`, live). **F6** probe residue named, not scrubbed. Next: **fire B9** —
the visual law sweep over the pre-law pages, the last build row before the close gates; the
bulletin carries F1 (which binds anything that fires), F3 and F4.

---

**2026-08-27 · Builder · opus-medium (B9)** — the visual law sweep: every page now
obeys Felix's design laws, and the pre-law pages obey them the way B5–B7 were born to.
Changed: `glass/assets/` new (**Inter vendored**, latin 400 + 700 woff2 + the SIL OFL
notice, served off `/assets/…` with `font/woff2` and an immutable cache header),
`glass/html.ts` (`encap`/`encapHtml`/`expand`, `legend`/`LIVENESS_KEYS`/`mantleKeys`,
and `ago()` moved here to break the `pages ↔ gauges` cycle the auditor would have
opened), `glass/rail.ts` (card encapsulations, the rail legend, **the glass's last
`<select>` replaced by a radio button group**, recency inside each attention rank),
`glass/pages.ts` (**City View grouped by `~/code/<x>`**, off-register the same way,
`attentionOf`/`freshness` sorting, encapsulations through the board rows, ledger tail,
queue and ISSUES, the city legend, the auditor line), `glass/gauges.ts` (`auditorCount`
+ `auditorLine`, the WIP panel's delta), `glass/glass.css` (`@font-face` ×2, `.encap`,
the generic `.more` disclosure, `.nbhd`, `.audit`, `.rail-text` in Inter),
`glass/server.ts` (the font route, a fixed two-key list — no path ever comes from a
URL), plus `html.test.ts` and `pages.test.ts` new — **302 green in one process**,
`bunx --offline tsc --noEmit` exit 0, rail p95 111 ms at browsing speed. DoD measured
against a live glass over HTTP: the font served **byte-identical** to the vendored file
(`sha256 2301bb03…` both sides), **zero `http(s)://` anywhere in any served page or
stylesheet**, `grep -c '<select'` **0 on all seven routes**, legends on `/` and `/city`,
11 of 38 rail cards leading with a derived name and the other 27 rendering whole, five
neighbourhood groups on `/city` with rank monotone and dates falling only inside a rank,
and `8 tracked · ≈35 claude processes visible · 27 beyond the census` on all three
views. Decided: nothing escalated; the spec held, and its own STOP clause was honoured —
**the derivation was never given a special case.** Four findings: **F1 — 27 of 38 live
cards write no name at all**, so the row-17 ask is now evidenced: the shapes need a
**name field**, one to six words, written by the session that files the entry; a parser
cannot recover a name nobody wrote (two general render rules did earn their place — an
orphaned `**` is dropped from a name, and an `[expand]` that would reveal less than the
card already shows is not drawn). **F2** the `pages ↔ gauges` cycle, and the rule that
a helper two pages want lives in `html.ts`. **F3** the auditor costs **36 ms** of the
request thread (rail p95 45 → 111 ms, bar 500 ms) — a TTL is the fix if it ever matters,
named not built; and B5 E1's `[c]laude` grep over-counts by five (shell snapshots), so
the alarm matches `argv[0]` and drops the harness's own `bg-*` helpers. **F4** the
radio picker's `:checked` read is the one thing unproven without a browser (the Chrome
extension was not connected) — **the batch-close live fire from the rail is exactly that
path**. Next: **batch 3 is complete — the close gates are Felix's**: the visual pass over
rail + city, and the live-fire smoke from the rail (which doubles as F4's proof).

---

**2026-08-27 · Architect · fable-max (v0 verify + flow hand-off)** — *same
session, continued.* B6/B7/B9 verified LANDED off their plans: B6 — 219 tests,
append-only proven under ten concurrent POSTs, adoption mints the template's own
bytes, **the apply button fires a scoped Architect sitting** (first turn ≡
template); B7 — composed/founding/worktree fires byte-exact (sha per fire),
stamp ordinal proven against three sources, trust verdict on the card, disabled
mode honest; B9 — 302 tests, Inter vendored-not-fetched (cheaper than the
authorized fetch), auditor delta live on all three views (8 tracked · ≈35
visible), city grouped, zero `<select>`; one unproven path named (F4 — the radio
picker's `:checked`, proven by the close smoke). Inbox swept (1): B6's own first
live gesture caught pre-D63 wording in README §2 write #3 and the inbox header —
ruled TRUE THE DOCS, both trued, entry drained. **Felix's close words recorded**
(batch-3 note): visual pass "capable", rearranging parked as flow-chapter design
input; the live-fire smoke assigned — **firing the flow-cut Architect from
`/summon`**, one act, three proofs. Keel amended at his word ("reactive, dynamic
flow"): **dynamic extension** — the DAG grows mid-flow; the **arm-scope fork**
(step-arm vs scope-arm) named as the chapter's first Felix-fork, his lean
scope-arm, ruled at the cut sitting's blessing; S5 evidence note (starts and
beats proven, sustained unattended tool work not — probe #1). Pre-ruled: the
auditor count may take a register-pattern TTL when its p95 crosses half the
bar; until then it stands as built. Decided: the sweep ruling (docs trued).
Next: **Felix fires the flow-cut Architect from `/summon`** — kickoff verbatim
in the report; that fire IS the close smoke; the fired sitting closes batch 3
(§8 DoD) and cuts flow batch 1. This desk is clear.

*(moved to the tail 2026-08-27, flow-cut sitting: this entry was inserted
mid-file at `920a129` — after its session's own prior entry, before three
Builder entries already landed — breaking §7's newest-last; bytes preserved.)*

---

**2026-08-27 · Architect · fable-max** — *the flow-cut sitting.* **I am the
close smoke:** this session was fired from `/summon` by Felix's hand — summons
file ≡ argv ≡ transcript first user turn, sha256 `6c3f2862…`, 405 B at all
three hops (audit 20:42:21Z, `workspace:24`, account personal, fable · max,
stamp `architect-agents-03`) — one act paying the live-fire gate and proving
B9 F4's radio-`:checked` path and B4's rotated password end-to-end. B6/B7/B9
re-verified mechanically: 302 tests green in one process, `bunx --offline tsc
--noEmit` exit 0, commits present, DoD evidence in each plan. **§8's DoD RUN,
seven for seven** (close block in [README §8](README.md)): hand-count — 10
tracked ≡ 10 census-live ≡ every pid in `ps` by name (2 · 3 · 5 ×3 accounts),
≈35 ≡ `ps` 35, horizon labeled; building page + `/doc` link 200 (D58); **the
glass-shatters drill fired for real** — `kill -9` mid read-storm with a
`/hands/worktree` write in flight: 10/10 sessions lived, `git status` and
ISSUES byte-identical, the in-flight write died whole, relaunch one command
(pid 87126, ppid 1 — survives cmux restarts), hands re-armed off the untouched
env file. Strays cleared: a second rail on :4473 (Builder DoD leftover, D55
class — killed) and the ledger's newest-last break (the v0-verify entry,
inserted mid-file at `920a129`, moved to the tail byte-preserved). Inbox
swept: empty. **Batch 3 CLOSED — v0 SHIPPED.** Fresh physics: this session
runs census `mode:auto` with sustained unattended tool work — S5's stall is
conditional, not universal (keel §5.2 upgraded; P5 inherits the positive
control). **Flow batch 1 CUT (batch 4, board + note in [README §6](README.md)):**
P5 (permission physics, probe #1) → B10 (flow file + drawn DAG; interim
serialization = canon row 17 evidence) → B11 (arm + engine, D11) → B12
(reactive gate + dynamic extension) → G2 (**fired by the armed close flow —
Felix's arm IS the gate**, the engine's first real act; fallback `/summon`).
Blessing forks surfaced in the note: **D12 arm-scope (rec: scope-arm)**, the
posture floor, judge-insertions-under-either-ruling, his rearranging input.
Canon row 17's Felix-gate (v0 evidence in hand) is **paid by this close** —
the GA's board, his call. Decided: batch-3 close + the batch-4 cut (delegated
scope); D12 is Felix's at blessing. Next: **Felix — bless batch 4** (rule D12
+ the posture floor, hand over the rearranging input), then fire the
Dispatcher — summons fenced verbatim in the batch-4 note ([README §6](README.md));
behind it: canon row 17 at his word.

---

**2026-08-27 · Architect · fable-max** — *the deck design sitting (same
session, continued — opened by the kitten, ratified by Felix).* His 17-item
**field report** arrived by paste — the delivery mechanism its own kill shot
("I would rather be writing this in Belvedere") — filed verbatim to
[ISSUES](ISSUES.md), **batch 4 HELD** before anything dispatched (zero sunk
cost — the baton was still on his desk). Strategic fork ruled with him
present: **no restart — re-keel**; the organs are stone (census, hands, parse,
audit, the loved aesthetic), the pages clay, the missing organ is **the
voice**; the campaign's own files predicted both (the parked DESK's volume
gate; "v0 usage is the evidence"). He returned with the **deck vision**
(ISSUES case file #2, verbatim): three panes Context/Focus/Action with
min/typical/expanded states, City → Building → Agent, one hotswappable Chat
with independent response scroll, the DAG as the unified past+future work
view, the identity sentence — dataviz first, command second, comms third —
and the no-scroll proportional-fill law. Four forks ruled by his word
in-session: **D14** time flows down through the now-line; **D15** attention =
City badges + the drawer's needs-you queue; **D16** cmux is truth for live
identity (stamp = birth name, write-through renames); **D17** the desk — one
drawer, `~/code/agents/desk/`. **The deck keel cut**:
[plans/deck-keel.md](plans/deck-keel.md) — commission D13, the striking law
made structural (his third utterance: every law CAN be struck; the v0
no-client-state law is its first formal casualty — the deck is an app,
vanilla TS + SVG), panes a replaceable surface, Chat send gated on **P6** (the
transport probe, T4's lesson), fence gains three proposed write classes
(message-to-session · rename/recolor write-through · desk writes) minted at
blessing, rooms die (rail/city/shelf), v0 serves until the deck replaces it.
Decided: D13–D17 (✓ Felix in-session). Next: **Felix — red-pen + bless the
deck keel** ([plans/deck-keel.md](plans/deck-keel.md)): the §11 fence trio and
§9 stack ruling ride the blessing, plus two name picks (Workshop/Floor ·
Works/Line); on the bless, P5 unfreezes as cut and the re-cut sitting (this
desk) cuts deck batch 1 + re-seats B10 into the Works; behind it: D12 + the
batch blessing forks, then canon row 17 at his word.

---

**2026-08-27 · Architect · fable-max** — *the re-cut sitting (same session,
continued).* **The keel is BLESSED** — Felix's word, all four items: the fence
trio (D18 minted — message-to-session · rename/recolor write-through · desk
writes; §2's list now seven, still exhaustive), the stack (vanilla TS + SVG —
his blessing note recorded: the ⬡ hexagon prettifying pass parked until the
deck functions), the names (**the Workshop · the Works**), the §6 node
actions. "Do it all. Make it so" executed: **batch 5 cut on the blessed
keel** — lane A probes **P5 → P6** ([P6](plans/p6-message-transport.md) new:
the Chat's send physics, bracketed paste first, T4's trap measured, kill =
read+jump forever); lane B strictly serial on master **B13 → B14 → B15 →
B18 → B10 → B17 → B11 → B16 → B19 → B12** in the identity-sentence order
(dataviz → command → comms), orders cut and blessed:
[B13 shell](plans/b13-deck-shell.md) · [B14 City+attention](plans/b14-city-attention.md)
· [B15 Workshop](plans/b15-workshop.md) · [B18 identity](plans/b18-live-identity.md)
· [B17 composer+usage](plans/b17-composer-usage.md) · [B16 Chat](plans/b16-chat.md)
· [B19 desk](plans/b19-desk.md); flow rows **re-seated** by dated amendment
(B10 = the Works, D14's now-line, +B14 dep; B11 bill = B17's live usage;
B12 surfaces = the Works; G2 = the whole batch-5 gate, Felix-gates: **deck
visual pass + arm the close flow**). Batch 4 superseded in place — nothing
had dispatched. **Inbox swept: both case files folded** (the keel + the
batch-5 rows) **and drained** — the 17 field items homed: 1/2/4/5(stamp)/17
→ B17 · 3 → B15 · 5(color)/7/8/10/11 → B18+D16/D18 · 6 → B13/B15 · 9 →
canon row 17 (gate paid) · 12 → §3 law · 13 → B14/D15 · 14 → D16/D18 + the
deck whole · 15 → keel §10 (the rooms die) · 16 → B19/D17. Decided: D18
(✓ Felix at blessing); the batch-5 cut (delegated). Next: **Felix — rule D12
(rec: scope-arm, his lean) and fire the Dispatcher** — summons fenced in the
batch-5 note ([README §6](README.md)); behind it: canon row 17 at his word;
the close returns at G2 (his visual pass + the arm in the Works).

---

**2026-08-27 · Architect · fable-max** — *the ruling (same session,
continued).* **D12 RULED: scope-arm** — Felix's word ("rec"), the
recommendation his own lean since the keel. Recorded in README §7; the
batch-5 note marks the batch **fully blessed**; B12's order ships the
scope-arm branch live (step-arm under test); the flow keel §4 carries the
ruled note. Nothing now stands between the Dispatcher summons and the close
gates. Decided: D12 (✓ Felix in-session). Next: **Felix — fire the
Dispatcher** (summons fenced verbatim in the batch-5 note,
[README §6](README.md); `/summon` is the proven venue); behind it: canon
row 17 at his word; this desk returns at G2 — his visual pass and the arm
in the Works.

---

**2026-08-27 · Architect · fable-max** — *the mid-run amendment (same
session, continued; the dispatch cooking).* Felix's field note filed
verbatim (`bb44bd9`), ruled, drained: **two organs join the deck** —
**[B21 the Grep](plans/b21-grep.md)** (everything greppable: transcripts
×3, register docs, plans, desk; bounded `rg`, results grouped in the
drawer, every hit instantly jumpable — a session hit hotswaps the Chat to
the turn; the commissioning query, "bob summons", is the DoD's own smoke)
and **[B20 the decoder](plans/b20-decoder.md)** (no code word without its
meaning one hover away — row ids, D-ids, §refs resolve via the one parser,
context-scoped local-first, tooltips NEST depth-capped, the unresolvable
says so). Keel §3 amended (dated block); board + batch-5 note amended
per D57 — lane B is now **B13 → B14 → B15 → B18 → B20 → B10 → B17 → B11 →
B16 → B19 → B21 → B12**; G2's unfired kickoff re-cut to batch-5 scope.
Decided: the amendment (delegated; the commission is Felix's note).
Next: **Felix — deliver the amendment to the running Dispatcher** (the
silos hide peers; his hand is D57's standing fallback), message verbatim:

```
Batch-5 amendment (Architect, 2026-08-27, committed on master): B20 (the
decoder) and B21 (the Grep) join lane B — orders at
~/code/agents/belvedere/plans/b20-decoder.md and
~/code/agents/belvedere/plans/b21-grep.md. Lane B is now:
B13 → B14 → B15 → B18 → B20 → B10 → B17 → B11 → B16 → B19 → B21 → B12 —
kickoffs verbatim from each work doc plus the rider, same rules, same
stop: G2 fires by the armed close flow, never by dispatch. Everything
else in your summons stands.
```

Behind it: canon row 17 at his word; this desk returns at G2.

---

**2026-08-27 · Architect · fable-max** — *decoder sharpened, vocabulary
escalated (same session, continued; B13 LANDED under the Dispatcher —
320 tests, Chrome-probe DoD, the chain runs).* Felix's note filed
verbatim, ruled, drained: **B20 amended** (undispatched — no relay
needed): the detector gains the **row-keyword form** (`canon row 17`,
`bob row 3`, bare `row 14` — the canon board's ids are bare numerals, the
keyword anchors them), the corpus is **every prose surface the deck
renders, the Chat's transcripts included** ("I want to hover over YOUR
words"), and tooltips carry the object's **live gestures** from the
queue's set — a pending countersign, a note — B6's wire, previewed bytes,
**gestures only, never fires**; the DoD gains the commissioning hover and
the gesture proof. **B16 amended**: transcript prose passes the decoder,
kickoff fences exempt. **The bless/countersign ask escalated to the canon
inbox** (they are two acts today — bless approves a spec, countersign
confirms a D-entry; whether "bless" becomes the one spoken Felix-yes is
the Office's; the deck renders canon's vocabulary until ruled). Decided:
the B20/B16 amendments (delegated; the commission is his note). Next:
unchanged — **Felix delivers the lane amendment to the Dispatcher** (if
not already done; message verbatim in the previous entry); behind it: a
GA sitting is now genuinely ripe — the canon inbox holds 16 entries and
row 17's gate is paid — his word fires it.

**2026-08-27 · Builder · opus-high (B13)** — the deck shell: the app exists. `/deck`
serves three panes (Context · Focus · Action), each walking minimal → typical →
expanded under the law of space, plus the pinnable drawer, the tooltip primitive, the
`FocusView` seam and the poll that keeps it live; the v0 rooms serve on untouched
(keel §10), one nav link the wider. Changed: `glass/deck-model.ts` new (**the law of
space as arithmetic** — a pane's state IS its weight, 1 · 3 · 6, and one `columns()`
serves the server's resting render and the client's re-render so they cannot disagree;
plus `toLayout` parsing localStorage at the boundary and the `DeckSnapshot` shape both
sides share), `glass/deck-view.ts` new (the `FocusView` seam — four members,
`mount(focusHost, actionHost)` / `unmount` / `draw` / the states a tenant declares;
**Action follows Focus, so one tenant owns both hosts** and there is no second
register), `glass/deck.ts` new (`deckState()` — one composed read of census + the
register's **held** copy, never a walk on the request thread; and the shell, which
carries the resting split already in its markup), `glass/deck.client.ts` new (the whole
app: layout, drawer, tooltips, the poll, three placeholder tenants B10/B15/B16 evict),
`glass/deck.css` new, `glass/server.ts` (the bundle built by `Bun.build` at boot and
served from memory, `/deck`, `/deck.js`, `/deck/state`, `/deck.css`),
`glass/html.ts` (one line: the `deck` link in every nav), `glass/deck.test.ts` new and
`lab/b13/probe.ts` new — **320 green in one process**, `bunx --offline tsc --noEmit`
exit 0, zero new deps, `package.json`/`bun.lock` byte-unchanged since B8. DoD measured
in **real headless Chrome** at 1600×900 against a real glass: resting `1198.50 / 199.75
/ 199.75 px` (74.91 · 12.48 · 12.48 %) and flipped to 1:6:3 `159.80 / 958.80 / 479.41`
(9.99 · 59.92 · 29.96 %), **all 27 state combinations walked with `scrollHeight −
viewport` = 0 px**; click-to-expand driven **through the served bundle's own delegated
handler** (`#host-focus`, the pane body, minimal → typical); the drawer overlaying at
`position:fixed` over 3 tracks and **pinning to a fourth** (context 1198.50 → 871.08 px,
drawer 435.55); the tooltip instant in the same turn as the hover, expanding on a
450 ms hold with its action, dead on Escape; `/deck/state` **polled 4 times, counted by
the browser's own resource timeline**, and one appended fixture beat reaching the DOM in
**2097 ms** of a 3000 ms interval; **0 off-origin requests** browser-side and
`grep -c 'https\?://'` = **0 on all ten served payloads**; every v0 route still 200.
Cost: `/deck` p95 **2 ms**, `/deck/state` p95 **19 ms**, and a 9.264 s `/rewalk` had
three polls land inside its window in **17 · 8 · 18 ms** — B8 F3's worker law intact.
Decided: nothing escalated; the out-of-scope list held (no real tenant content, no
SSE, no framework, no v0 page touched beyond its nav). Six findings, four binding:
**F1 — a fake DOM cannot prove a deck DoD item.** happy-dom and jsdom do no CSS grid
layout, so `getBoundingClientRect()` returns zeros there and a "measured width" from
one is fabricated — the `min-width: 0` bug of F4 passes silently. `lab/b13/probe.ts`
drives the machine's own installed Chrome over the DevTools protocol in ~60 lines of
Bun, **zero dependencies fetched, installed or vendored** (the `ps` posture), against
its own glass on a temp census — the live census is append-only telemetry and a DoD run
does not get to write a beat into it (B8 F1). Written to be reused by every deck row
behind this one. **F2 — the split is a 69 ms transition, so every measurement of it
must settle first**: the probe's own first run read `74.14 · 12.87 · 12.87 %` five
milliseconds into a move to `10/60/30` and failed itself — a number real, reproducible
and meaningless. **F3** the client TS rides the **existing** offline type gate with no
config change (`@types/bun` carries the DOM lib); it caught `Node.append` returning
`void` before a browser ran the code. **F4 — `min-width: 0` on every grid child is the
deck's only geometric guarantee**: an `Nfr` track is `minmax(auto, Nfr)`, so without it
content silently outvotes the law, with no error and a page that still looks plausible.
**F5** the snapshot is a shared budget — 15 000 B at 46 sessions every 3 s, one endpoint
B15/B17/B18 widen rather than five — and the diff is the whole snapshot, so an idle city
redraws nothing. **F6** a failed client bundle **stops the server**, deliberately: a
shell around a bundle that is not there is this server's own definition of a lie.
Next: **B14 — the Context pane** ([plans/b14-city-attention.md](plans/b14-city-attention.md)),
the Dispatcher's to fire on lane B's serial chain.

**2026-08-27 · Digger · opus-high (P5)** — permission physics: **the model IS the
permission posture.** S5 was never trust and never cmux. `--model haiku` cannot enter
`auto` mode on any account and the fallback to `default` is **silent** — an explicit
`--permission-mode auto` in argv is dropped with no error (`ps` shows the flag on the
process; the census shows `default`); `auto` is an LLM classifier (`claude auto-mode
config` prints 67 294 B of allow/soft_deny/hard_deny rules) that a haiku session does
not get. Bisected in one venue, one account, one summons: haiku·low **default**,
haiku·high **default**, opus·low `auto`, sonnet·medium `auto` — effort is not the
driver, and the same haiku fire reads `default` on all three silos. The live census had
been saying so for a day: all 14 `default` beats in 4 188 belonged to glass-fired haiku
sessions; every fable/opus fire was `auto`. Changed: findings + the permission clause in
[plans/p5-permission-physics.md](plans/p5-permission-physics.md), `lab/p5/` (four
scripts: `fire.ts`, `lever.ts`, `resume.ts`, `work-summons.ts`), board row P5, the
batch-5 lane-A probe-tier rule. **Q2 matrix 6/6** — three accounts × {trusted root,
worktree}, **11 tool calls each including three Writes, a Read, an Edit and a real
`git commit`, zero permission prompts, zero human touches**, at sonnet·low. **Two
stalls, and they are not the same animal**: the permission stall has beats, a
transcript, `mode:default`, and a `Notification` carrying `why=permission_prompt`
(reproduced N=2 in a *fully trusted* root); the trust stall has **zero census beats, no
transcript and a live pid** (a fresh `git init`, 120 s, cwd untouched). `acceptEdits`
is a partial lever measured to die at `git add` — seven of eleven steps. `--resume`
inherits the model and the posture, and a resumed haiku printed `auto` at
`UserPromptSubmit` before stalling at `PreToolUse`: **posture is read off `PreToolUse`
beats, never off `SessionStart`/`UserPromptSubmit`.** Decided: **no kill fired** — the
engine chapter stands as cut; the brief's expectation of *one* precheck is corrected to
**two**. The clause (F5) for B10/B11: no permission field on a step; `haiku` illegal for
an unattended step and **refused at arm, loudly**; `glass/trust.ts` precheck per (step,
account), sufficient as-is; two census-side runtime alarms behind the step timeout.
Levers ruled out and named, not attempted: `bypassPermissions`/`dontAsk` (posture
floor), pre-seeding `<config-dir>/.claude.json` trust (the fence — `trust.ts`'s own law
is that the glass never answers that dialog; a D3 write-class question if ever wanted).
Venue: 20 fires / 18 sessions, ≤2 concurrent, every workspace closed — `cmux workspace
list` reads exactly what it read at the open; no cmux restart, no settings written.
Next: **P6 — message transport** ([plans/p6-message-transport.md](plans/p6-message-transport.md)),
the Dispatcher's to fire on lane A.
