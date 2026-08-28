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

---

**2026-08-27 · Builder · opus-high (B14)** — the City and the needs-you queue: **the
waiting-input blindness is dead, in both places the keel named.** Changed:
[`glass/attention.ts`](glass/attention.ts) (new — the four classes, the waiting edge, the
escalation reader, the queue and the City's ranking), `glass/deck-model.ts` (the snapshot
widened, not a second endpoint), `glass/deck.ts` (`city()` for content + a 30 s auditor
TTL + the header's count), `glass/deck.client.ts` (the City in Context, the queue in the
drawer, region repaint, the two wires), `glass/deck-view.ts` (`selection` — the City's
click, the deck's one cross-pane fact), `glass/deck.css`, `glass/attention.test.ts` (new,
20 tests), `glass/deck.test.ts`, [`lab/b14/`](lab/b14/) (a fixture city + two browser
probes), board row B14, this ledger. **One computation, two renderings** — the City's
badges are the queue's own items bucketed, so a badge can never count what the queue does
not list and the two surfaces cannot disagree about what is urgent. Ranking is v0's,
ported not reinvented (`attentionOf`/`freshness`), plus **exactly one new rank**: a
session that cannot move without him outranks even the work that is running. Decided:
**the waiting edge has two arms and no third** — `permission_prompt` (blocked) and
`idle_prompt` (the 60 s nag, which is *the* notification Felix said cmux was giving him),
both measured live; a bare `Stop` is idle, not waiting, or the queue lists every finished
session and he stops opening it. **DoD, all of it green.** The live proof: a real
haiku·low session fired **through the glass's own hands** into a scratch subdir of
`~/code/agents` stalled on a real permission prompt — `PreToolUse Write mode:default`,
no `PostToolUse`, then `Notification permission_prompt` 6.1 s later, 15.2 s after the
fire — and was **on the deck 2.8 s after the census line**: `agents/belvedere` at the top
of the City, blocked dot, waiting badge, queue item `b14-waiting-probe — blocked on a
permission prompt`, header `36`. Workspace closed, scratch removed, `git status`
byte-identical either side. Fixture proof: a gate badge sorts above a building **24 hours
newer**, and a permission beat reached City *and* queue in **2 736 ms** of a 3 000 ms
poll. **Zero fire wiring** three ways — shell, live DOM, and the served bundle
(`hands/fire` 0× in `/deck.js`). A countersign answered in place: one append,
byte-identical 570-byte prefix, and the card re-derived itself `pending → recorded` off
the bytes. **`/deck/state` p95 114 ms** over the whole live register (22 buildings, 61
sessions, 35 queue items, 51 783 B — bar 500 ms), **344 tests in one process**, type gate
exit 0, and **B13's entire DoD re-run green** against the rewritten client. Seven
findings, nothing escalated: **F1 `PermissionRequest` is a real hook event the census is
not subscribed to** — cmux's own injected `--settings` wires it, B1's ten do not, so the
glass infers from a six-second-late `Notification`; subscribing is a B1-class Felix-run
ritual, filed not built · **F2 escalations have no field**: annotations arrive stripped of
`**`, and `E<n>` collides with whiteboardy's row-id namespace and with `E1–E4` ranges —
both fixed generally, **0 unruled escalations in 458 live rows** · F3 `default` waves a
read-only Bash through, so `echo` never stalls and a `Write` does · **F4 B13's snapshot
diff could never short-circuit** (`at` moves every poll), so the deck repaints by region
signature and a half-typed note now survives · F5 the auditor took B9 F3's named-not-built
TTL · F6 `lab/` is outside the type gate · F7 an off-register waiting session is in the queue
and in no badge · **F8 the E1 ruling's content half now runs on a timer** — one poll is ~48 ms
and 31.5 ms of it is `city()`'s re-parse, ≈1.0 s of Bun's one thread per minute while a deck
is open; measured and priced, nothing built against it, because retiring the ruling is the
Architect's call. Next: **B15 — the Workshop**
([plans/b15-workshop.md](plans/b15-workshop.md)), the Dispatcher's to fire on lane B's
serial chain; it reads `selection` at the `FocusView` seam.

---

**2026-08-27 · Builder · opus-high (B15)** — **The Workshop** — one building, inside — moved
into Focus through the `FocusView` seam and nowhere else, evicting B13's first placeholder;
the deck now has a real tenant. Live sessions first and then the building's truth: board,
ledger tail, decision queue, ISSUES, every section collapsing, the order his to drag **or** to
walk with ▲▼ (one `moved()` under both) and both surviving a reload — where only a full
permutation counts as a memory, since a remembered subset would silently hide a section.
**The field report's third item is dead**: a rendered `LEDGER.md:385` opens the viewer inside
Focus scrolled to **line 385**, exactly one line marked, its box `615.38–631.88 px` inside a
pane `53.19–757.00 px` — clicked off the fixture's own ISSUES prose, again from a landing
record, and again on the **live** corpus (`hexwright/LEDGER.md:95`, line 95 of 117). A City
click focuses **that** building (two buildings, two panes); the five sections render real data
for `agents/belvedere` (29 rows, 85 resolvable references) and hexwright; six live `agents`
sessions render with the model their transcripts name and a tooltip carrying cwd · workspace ·
pid, three of them with `jump` disabled and the reason on hover. **371 tests green in one
process**, type gate exit 0, zero fire wiring in DOM, source and served bundle, and the whole
browser half in real headless Chrome ([lab/b15/probe.ts](lab/b15/probe.ts) on a fixture city,
[lab/b15/live.ts](lab/b15/live.ts) on the live register — both ALL GREEN, both writing
nothing outside temp). Seven findings, nothing escalated: **F1 a tier is `<model> · <effort>`
and only the model is on any artifact this glass can read** — read off the transcript head
window the name-stamp already costs (zero extra I/O), effort renders `—` rather than a guess;
11 of 13 live sessions carry one, and it is the fourth filing of the same *field* ask, binding
B17 and B18 · **F2 the seam gained a fifth, optional member** (`needs`): one building's detail
is 65 kB, so it is **asked for, never broadcast** — `/deck/state?b=…` is still one endpoint and
one timer, costing `+64 897 B and 0 ms` because `city()` had already parsed that content for
the City's badges, and the query disappears at minimal · **F3 a code-ticked `path:line` is
still a reference** (the corpus writes nearly every path in ticks) while a bare path with no
line, and any path the filesystem cannot find, stay text — `Span` is the shape B20's decoder
hangs off · **F4 the held register is keyed on nothing**, so a second city fixture in
`bun test` silently decides `deck.test.ts`'s results; three of its assertions went red, worked
around by testing a pure `deckSession()` and proving `?b=` over a real server instead — named,
not fixed, because the register's policy is the Architect's · F5 a receipt must outlive the
repaint that proves it, so `say()` moved to `deck-dom.ts` and the drawer prunes only its own
keys · F6 a D54 near-slip self-reported (the gate re-run from `belvedere/glass`, exit 0; zero
third-party code fetched) · **F7 the batch's two lanes are file-disjoint and NOT
commit-disjoint** — `git add -A belvedere` swept lane A's live P6 work into three B15 commits;
nothing lost, history deliberately not rewritten under a running session, filed to
[ISSUES](ISSUES.md) as a fold candidate for the concurrency plan. Decided: nothing — the
Builder ruled nothing; F1–F7 are the Architect's at G2, and the seam's fifth member is the
shape B17/B18 should copy. Next: **B18 — live identity**
([plans/b18-live-identity.md](plans/b18-live-identity.md)), the Dispatcher's to fire on lane
B's serial chain; it reads the Workshop's session lines, which is where a wrong stamp shows.

---

**2026-08-27 · Digger · opus-high (P6)** — message transport: **B16 sends, and the
mechanism is not bracketed paste.** [P6](plans/p6-message-transport.md) LANDED, no kill
fired. The brief's leading candidate was measured and REFUSED: cmux transmits
`ESC[200~ … ESC[201~` faithfully (and never adds them itself, even with DECSET 2004
announced), but the TUI puts the marker **text** in the message with every newline as CR
— `"[200~P6-A blank lines.\r\r…[201~"` — and a later run of the same arm truncated at the
first CR instead, which is nondeterministic partial delivery, the disqualifying failure
by name. What works is the **segmented paste**: newline-free segments through
`set-buffer`+`paste-buffer`, newlines as `send-key alt+enter`, edge whitespace through
`send`, one `enter` to submit. **Five payloads byte-exact**, sha256 of the sent bytes ≡
the transcript's user turn, one turn each: blank lines (`a5df8e39…`), `$(echo pwned)`
unexpanded with literal `\n \t \r` and unicode (`9a4844d2…`), 2/4/8-space indents with
trailing spaces (`6d10be98…`), a **304 B fenced code block** (`81bf85ca…`), and the
summons itself (`65490336…`). Both controls fired and seen. **Q2 mid-turn PASS, proven
from the census** rather than a wall clock — the delivery's `UserPromptSubmit` at +13.3 s
against the work turn's `Stop` at +15.7 s, the 802-line in-flight answer finished
`end_turn` untouched, the message answered next in order. **Q3 resume-with-a-turn PASS
×5** — byte-exact, prior conversation carried, silo held, session id and transcript file
**reused**. Three transport rewrites P2 could not see, all against a raw sink that
rewrites nothing ([lab/p6/sink.py](lab/p6/sink.py)): **`paste-buffer` turns every LF into
CR** (P2 T3's byte-exact verdict is an artifact of its canonical-mode sink, where ICRNL
turned it back), **`set-buffer` trims its own edge whitespace** (27 B in, 20 B out — the
one that eats every indent), and **`ctrl+j`, a real 0x0a, is silently dropped by the
TUI**. Findings: **F2 — a `workspace:N` ref that does not resolve is not an error, it
delivers to the FOCUSED workspace**, while a UUID 404s loudly; `/hands/fire` returns a
ref and `Fired` carries no UUID, so B16's send, **B18's rename/recolor write-through**
and `/hands/focus` all inherit the misdelivery class — address by UUID, always (disclosed:
proving it sent one character and one Enter into the live `dispatcher-agents-04` pane) ·
**F3 two message shapes fail silently at the model** and must be refused at compose — a
literal **TAB** never arrives (the wire carries all five, the transcript has none) and a
first line beginning with **`/`** executes as a slash command, creating **zero** user
turns · F4 the transport is 153 ms per cmux round trip and `4n−1` calls deep (289 ms for
one line, ~6.3 s for fourteen), so a hundred-line send is ~40 s and renders as in-progress,
never modal; one persistent socket connection is the speed-up, named not built · F5 a
resumed session keeps its id and transcript, so the census join and the verification read
need no re-plumbing · F6 a probe cannot be *instructed* into a long turn (sonnet
backgrounds a `sleep`; an obedient probe answers its standing rule) — the work has to be
the summons. Five failure faces tabulated, every one detectable before the send; the trust
dialog swallows keystrokes byte-identically and **Enter would answer it** (never pressed).
Decided: nothing — the transport law is §T, written to be lifted verbatim by B16 and
D18's write class 1; F2's UUID law is a `hands.ts` contract question for the Architect.
Venue restored: every probe workspace closed, the scratch cold repo removed,
`cmux workspace list` back to Felix's own two. Next: **lane A is finished** — B16 consumes
§T when lane B's serial chain reaches it; nothing in lane A remains to dispatch.

---

**2026-08-27 · Builder · opus-high (B18)** — **cmux is truth for live identity** (D16),
built and measured against the live desktop. One socket read — `cmux workspace list
--json`, held, at most 2 s old — joins on the census's own `ws` and gives every session
the name and colour cmux is wearing *now*; the rig's stamp becomes the **birth name**,
rendered beside it where they differ and never derived from it. Two write-through hands
(D18 class 2), `POST /hands/rename` and `POST /hands/recolor`, live in the session's own
expanded tooltip — rename inline, recolour from a swatch row of felikai's seven intents —
and both target by `sid`, resolved to a **uuid**, because a `workspace:N` ref that does not
resolve is delivered by cmux to the *focused* workspace (P6 F2 arrived mid-build and the
whole of this row's socket surface was already uuid-only). The DoD ran live and green:
a rename made **in** cmux reached the deck on the **very next poll** (+1 poll, 3 058 ms of
a 3 000 ms period) with the birth stamp beside it, in the City and in the Workshop from
one function; a rename **from** the deck came back off `workspace list` as
`title="b18 renamed from the deck"`, driven through the page's own handlers; a swatch
click put `custom_color=#3F9608` on the workspace, and `cyan` was refused **409** in
cmux's own words with the audit line to match. **B3 F1's refused-colour fire deaths are
closed at the cause** — and not by re-spelling: cmux accepts **any `#RRGGBB` verbatim**
(measured, `#a5e22c` → `#A5E22C`), so the map carries felikai's own hexes through **Felix's
felikai↔ANSI table**, which is what puts the Builder on felikai blue and the Digger on
felikai **orange** rather than on the words the rig writes. Seven intents, seven audited
recolours, all 200; the probe's own fire composed with one of them and survived.
**The dead jump is dead**: reproduced twice — `--panel` with no `--workspace` answers
`not_found` by ref *and* by uuid (every session whose beat carried no `ws`), and with
`--workspace` it answers `OK` while the frontmost application stays `Arc` through
`focus-panel` **and** `focus-window`. Nothing on the socket brings cmux forward; the hand
now reads `cmux tree` first (a surface the desktop lost is a refusal, never a jump into a
workspace that may not hold it), focuses panel and window, then `open -a` the bundle
`cmux identify --json` names — measured `Arc → cmux`, `Finder → cmux`, the probe's own
workspace selected. Identity degrades honestly: a glass whose password cmux refuses prints
`live identity STALE — … Invalid password` and falls back to birth names with no live
badge and no swatch. **398 tests green in one process**, type gate exit 0, `/deck/state`
**p95 234 ms** against the 500 ms bar. Findings: F1 the hex acceptance and the taste call
it exposes (three mantle colours visibly change) · F2 the jump's mechanism, and that
whether `focus-panel` raises the app at all is macOS's call, not cmux's · F3 a workspace
rename does not touch its surfaces' titles, and an agent surface's title is cmux's own
glyph-rewritten display — so the pane title is measured, not written · F4 the read costs
**~161 ms of every poll** (p50 67 → 228 ms), awaited on purpose so a cmux-side rename needs
one poll and not two; the 1 s-timer alternative is named, not built, and B17's usage will
want the headroom · F5 **the socket names a session before its own transcript does** ·
F6 the read covers one window, a named blindness · F7 B18's targets are all uuids and
`attemptFire`'s are refs — B4's contract, left to the Architect at G2 per the relay.
Decided: nothing — F1's map is one table and one strike; F3 and F7 are questions, not
changes. Venue restored: every probe workspace closed, the selection put back, no listener
left behind. Next: **B20 — the decoder** ([plans/b20-decoder.md](plans/b20-decoder.md)),
the Dispatcher's to fire.

---

**2026-08-27 · Builder · opus-high (B20)** — **The decoder: no code word without its
meaning one hover away.** Six forms detected (`B18` · `D63` · `§3.2` · `FC-1`/`GA-10` ·
the row-keyword form `canon row 17`), resolved against the one parser, rendered through
**one seam** — `words()` in `deck-dom.ts` is the only place a reference becomes a control,
so the City, the Workshop and the drawer's queue decode by construction and the Chat and
the Grep will inherit it without a line of their own. Detection and resolution are
deliberately apart: `decode.ts` is a pure detector both sides import, `decoder.ts` is where
a token meets the files, and `GET /deck/decode` **re-detects its own query rather than
trusting it** — a hand-typed `?t=rm -rf` gets a refusal, not a lookup. **The commissioning
hover works**: Felix's phrase rendered as prose, `canon row 17` → *v3 · the storage
experiment · OPEN · Digger · fable-high · agents/MAP.md:106*, and a bare `row 14` in a
canon document resolves locally because `than` names no building. **Resolution is
context-scoped and measured on the real corpus**: `D2` is belvedere's, `D63` is canon's
(belvedere really does stop at D18 — the resolver knows by *looking*, never by matching a
range), `D99` renders **unresolved and names both ranges it read**, and an explicit
`belvedere row 14` refuses instead of falling back. A `§` is always its own document's:
the same `§5` is *Working agreements* in belvedere's README and *The cycle* in its
DECISIONS. **Tooltips nest three deep and no further** — B13's one `#tip` became a stack,
and the cap sits where the spans are MADE (`words()` draws none at depth 3), so the deepest
body is plain text and there is no fourth layer to refuse; a constructed cycle
`B18 → D2 → B18` renders plain at the repeat. **Tooltips gesture, they never fire** (D10):
the footer carries the jump — which moves the selection, brings the Workshop forward and
lands the viewer on the line — and B6's inbox wire with the **exact bytes previewed**
(`- 2026-08-27 · Felix (via Belvedere) · countersign D2: ✓`, appended verbatim,
471 B → 534 B, append-only ✓, fired on a **fixture** inbox because proving a button by
countersigning the real city would be the glass editing truth to test itself). Fenced
kickoffs and code ticks stay byte-sacred: the live belvedere Workshop lights **164**
decoder spans and **0** inside them. **425 tests green in one process**, `bunx --offline
tsc --noEmit` exit 0, zero dependencies added, `/deck/state` byte-for-byte the shape B18
left it — a hover is 2–5 ms on its own route, so B18 F4's headroom is still B17's.
B13/B14/B15 probes re-run whole: **ALL GREEN**; B18's drives Felix's desktop, so its one
intersection (the rename/recolor controls inside the tooltip that became a stack) is
checked in this row's own probe instead — 1 input, 7 swatches, nothing clicked.
Findings: F1 **`FC-`/`GA-` ids have no artifact** and are detected-then-honestly-refused —
fifth filing of the *field* ask · F2 **half the corpus's landing records encapsulate to a
DATE**, so `encap()` belongs on a work cell and never on an annotation · F3 the depth cap
belongs where spans are made, and a nested body must carry the resolved object's OWN doc ·
F4 **`Building.decisionQueue` is the queue, not the decisions** · F5 the City rendered no
corpus prose at all, so its building tooltip now names *what* wants him instead of counting
it · F6 a click on a code word is captured and stopped (binds B21) · F7 the glass knows
which building is canon **by convention** (`<city>/agents`), not from the register.
Decided: nothing escalated — no contract, seam or fence moved; the gestures are B6's
existing wire. Venue: two probes, both on their own ports against temp cities; the live
half reads only and wrote nothing anywhere. Next: **B10 — the Works**
([plans/b10-flow-dag.md](plans/b10-flow-dag.md)), the Dispatcher's to fire.

---

**2026-08-27 · Builder · opus-high (B10)** — **The Works: the batch note became data, and
the building's whole work is one drawing.** A flow is
`belvedere/flows/<name>.flow.json` — committed truth, mantle work, never the glass's — and
`glass/flow.ts` is the **only** module that touches those bytes, so canon row 17's ruling
swaps the serialization in one file. `flows/flow-batch-1.flow.json` is the chapter's own
DAG and it is real: 5 steps `p5 → b10 → b11 → b12 → g2`, ranked `0,1,2,3,4`, and the `g2`
step's kickoff is **quoted, not copied** — `{doc, fence: 5}` resolves to the README's own
G2 fence, **byte-identical** (`sha256 96ef06ad3ec95630592b752bb1484d86f8484f4da5430f5f48977ad41c3bf434`,
362 B, extracted independently by `awk` and a third way in the suite). Every refusal is a
**named value, never a throw**, asserted on a mutated copy of the real file — duplicate id ·
unknown dep · cycle · unresolvable kickoff (missing doc AND ordinal past the end) · a name
over six words · unknown account/mantle/tier/judgeTier/venue · malformed · unreadable. The
drawing obeys D14: **time flows down** — dependency depth is a rank running downward, ranks
`[0 → 1 → 2]` in DOM order, the two depth-1 lanes measured **side by side** (`b1 left 410.5,
b2 left 804, both top 397.86`), **4 inline-SVG paths for 4 dependencies** each placed
against a box the browser actually laid out, and the **NOW line cut between past and plan**
at `y=364.36` with the building's live sessions blinking on it; the board's landed rows and
the ledger's arc sit above, the undeclared work below, **one renderer**. Rings come from
run-state + census: `fired` with a **beating** sid renders lit, a dead sid renders *fired,
not beating* — both measured live in Chrome — and where the engine's log has said nothing
the **board** speaks and the ring is drawn **dashed**, because a landed ring taken off a
board row is not evidence this engine ever fired it. **Nothing arms and nothing fires**: the
Felix-card carries 0 buttons, 0 links, 0 fire attributes; `hands/fire` is 0× in the DOM, in
`works.client.ts` and in `/deck.js`; a plan node's actions **name** B11 and B17 instead of
half-working, and the only wire the pane reaches is `/hands/focus` on an in-flight node. P5's
clause is a **check, not a field**: a `haiku` step is drawn blocked with P5's own sentence on
it. The bill is on the wall beside the plan — tier on every node, usage `personal ·
thg-fgreen · thg-doorbell` in the footer. **455 tests green in one process**, type gate exit
0, zero new dependencies, `<select>` 0, `/deck/state?b=` **p95 281 ms** armed over the live
register (the Works' own share **0.7 ms p50**), the tenant redrawing in **1.4 ms**;
B13/B14/B15/B20's probes re-run whole, **ALL GREEN**. Findings: **F2 a `{doc, fence}`
kickoff is POSITIONAL and this landing nearly re-pointed `b10`'s own** — out-of-range fails
loudly, in-range-but-wrong does not; the ask is a `sha` or a heading anchor, named not built,
and it **binds B11's arm** · F1 the keel's now-line transposes §5's columns into downward
ranks · F3 the first SVG puts the XML namespace into the bundle, so B9's `http(s)://` grep
must exclude it **by name** · F4 the Works parses nothing of its own and `ringOf`'s `from` is
what keeps that honest · F5 a building's name is doctrine's slug against the real `~/code` ·
F6 `g2` collapses the keel's sitting-plus-card into one step · F7 the trust precheck stays at
arm (15 `git` spawns per poll otherwise) · F8 the seam gained `swap.to`.
Decided: nothing escalated — no contract, fence or DoD moved; `/deck/state` gained one field
under the existing `?b=`, and the glass still writes nothing outside the fence's list.
Venue: `master`, two probes on their own ports against temp cities; the live half reads only,
with `BELVEDERE_ENV` pointed at a path that does not exist so no hand could arm.
Next: **B17 — the composer + live usage** ([plans/b17-composer-usage.md](plans/b17-composer-usage.md)),
the Dispatcher's to fire.

**2026-08-27 · Builder · opus-high (B17)** — **The composer moved into Action, and two of
the field report's oldest complaints died: the wrong stamp and the 391-minute number.**
Changed: `glass/usage.ts` (new — the live per-account OAuth fetch, canon row 10's own
mechanism), `glass/deck-composer.ts` (new — the resolver behind `POST /deck/compose`),
`glass/composer.client.ts` (new — Action at rest), `usage.test.ts` + `deck-composer.test.ts`
(new), `lab/b17/probe.ts` (new), plus `summon.ts` (`stampPrefix`/`nextOrdinal` extracted,
`lineage`/`nextStamp` built on them unchanged), `deck-model.ts`, `server.ts`, `works.ts`,
`workshop.client.ts`, `deck.client.ts`, `deck.css`, and four predecessor probes.
**The building names the work, the cwd is only the venue** — v0 asked one question and used
the answer for two, which is exactly how an Architect sitting about belvedere, run at
`~/code/agents`, came out `architect-agents-03`. Two knobs now: clicking `agents/belvedere`
in the City with the venue typed as `~/code/agents` previews and fires **`builder-belvedere-78`**,
and the **78** is B7 F4 induced — a fixture census carrying `builder-belvedere-77` on a
transcript **neither lineage log has ever seen** (`"builder-belvedere"` in `invocations.jsonl`:
0; in this run's audit: 0), so two logs alone would have minted `-01`. After the fire the
composer previews `-79`: the ordinal it spends is spent. **Every knob is live**, and the
summons *text* moves with them, not just the plan — measured in one document, navigation
entries stayed 1: effort rewrote the fence `You are a Builder at opus-high.` →
`…at opus-low.`, mantle moved the stamp **and** the colour `#0362b2 → #9e490c` **and** the
words (`You are a Digger at…`), account moved with its own usage chip beside it. That needed
templates to be **sticky** — a fence names its own tier (D45), so a page showing `opus-high`
beside an `opus-low` fire argues with itself — cleared by his first keystroke, after which
the words are his. **The byte chain has four links, not three**: the box on screen `108 B`,
the card's own claimed sha, the hands' receipt, and the transcript's first user turn — all
`sha256 39449981deadf642`. **Usage is live and the deck fetches it itself**: 9 of 9 cells
identical to the rig's own `summon-usage`, run in the same breath, every one `source: live`;
an unfetched account renders the rig's cache **labelled** with its age (233 minutes on the
first smoke — the complaint, now visible); and a blocked fetch, induced live by a glass whose
`USER` names nobody, keeps the figures **wearing the keychain's refusal** and never invents a
zero. The token law is the rig's, kept: `security` → memory → one header, never argv, never a
log, never a rendered page, and never asserted on in a test (B8 F1). One live fire haiku·low
from the rendered knobs, cmux answering `title "builder-belvedere-78" color #0362B2` —
coloured per B18's map, named per the building — workspace closed at landing, its audit line
deliberately in the temp tree rather than the city's. **486 tests green in one process**, type
gate exit 0, zero new dependencies, `POST /deck/compose` **p95 14 ms** and `/deck/state`
byte-for-byte the shape B18/B20 left it — the fetch is off the poll, so B10's own bill got the
live figures free and B18 F4's headroom is untouched. Findings: **F1 the deck can fire now, so
B14/B15/B20/B10's "zero `hands/fire` in the bundle" became "which SOURCE contains it"** — one
file may, and it is named · **F2 that DOM grep was always unsound: over the real city the
belvedere Workshop renders `/hands/fire` 4× as prose with 0 wiring**, so the sound check is
`outerHTML` minus `textContent` · **F3 sticky templates, and the rule behind them — a surface
may rewrite what he is looking at only until he touches it** (binds B16/B19) · F4 the
resolution is **round-tripped**, named, and `composePlan` therefore cannot ride `bun test`
(B15 F4's one-warm-register trap) · F5 `usageNow` reads, `refreshUsage` fetches — B11 consumes
both · F6 the token law kept, in the suite too · F7 there is no building knob: the City is the
picker, which is the ontology rendered rather than described.
Decided: nothing escalated — no contract, fence or DoD moved. `/hands/fire` is reachable from
exactly one client file for the first time, which is the composer's whole job (keel §3), and
D10 holds structurally: every knob move disarms the button until the next resolved plan lands.
Venue: `master`; the probe on its own port against the real city with a temp census, and its
one fire closed at landing (D55).
Next: **B11 — arm + engine** ([plans/b11-flow-engine.md](plans/b11-flow-engine.md)),
the Dispatcher's to fire.

---

**2026-08-28 · Builder · opus-high (B11)** — **The string runs itself.** D11 is live: one
click on the Works' arm card authorizes a declared flow, and a tick inside the glass does
what a Dispatcher does between sessions — fires ready steps **through the existing hands**,
and pauses at everything a mantle would have to judge. Changed:
[glass/engine.ts](glass/engine.ts) (new — `plan()` pure, `tick()` thin, `armFlow`,
`passGate`, `POST /flow/<name>/{arm,pass}`), [glass/flow.ts](glass/flow.ts) (the run log's
**write** side beside its read side, `Flow.hash`, `Step.timeoutMinutes`, venue paths
resolved at the boundary), [glass/works.ts](glass/works.ts) + [glass/deck-model.ts]
(glass/deck-model.ts) (hash, armed hash, the flow's last word, HALT, hands state, a card
awaiting his pass), [glass/works.client.ts](glass/works.client.ts) (the arm card, the live
bill, his pass), `hands.ts` (`readHalt` — the flag read where it is written), `html.ts`
(`tilde`), `server.ts` (the routes, and the engine's clock started **here and only here**),
`deck.css`, plus [glass/engine.test.ts](glass/engine.test.ts) (44) and three probes in
[lab/b11/](lab/b11/). **The chapter's number is 0.513 s**: a three-step flow — Builder ·
sonnet-low on master, Digger · sonnet-low in a **worktree**, then his card — armed by one
click in real headless Chrome and then left alone. Step 1 fired at `12:00:21.321Z`, the
first user turn **byte-exact** three ways (summons file ≡ transcript ≡ the hands' receipt,
`sha 7f91bd90e866f536`, 655 B), the session did real tool work unattended and **edited its
own board row to LANDED**; the engine read that row at `12:00:38.491Z` and step 2's fire
audit is `12:00:39.004Z` — **nothing between them but the tick** — arm to step 2 fired,
18.1 s. The worktree was cut by the same hand *before* the fire and the census's own cwd for
that session is inside it. Then the **Felix-card stopped the lane**: `paused, why "a
Felix-card — his pass on the card is the resume"`, **two fires in the entire hands audit**, 0
buttons and 0 links on the drawn card, and the drawing reading the engine's log
(`s1:landed/run s2:landed/run s3:paused/run`) rather than the board. Four levers proved on
**one** live session, because each needs the same step to be provably fireable and the
control for "nothing fired" is the fire that happens when they are released: **D10** — one
unreadable line in a run log and nothing advances, not even a landing the census had already
earned (`paused: "run-state unreadable"`, hands audit empty); **HALT** — set through the
glass's own hand at a **scratch** flag with the city's real one asserted absent in the same
breath (`refused`, audit `["halt"]`), and the Works reading the flag back in its own words;
**amend** — the flow file moved under an armed flow (`armed 8808fe19… · on disk 0c9e8e19…`,
paused, no fire); **re-arm** — one click covering it, and the step all three had held fires;
**timeout** — `paused, why "timeout"` with the session **untouched**, `pid 43747, kill -0
ALIVE`, because the engine has no verb that stops a session. Four arm refusals, each 409
naming the step and each writing **nothing** to a run log: `haiku` (P5's own sentence, the
finding built rather than worked around), a venue `personal has never trusted`, an
unparseable flow, and **a hash the page was showing that the file no longer has**. Cold
hands answer **503** while the same page still renders the plan. **530 tests green in one
process**, type gate exit 0, zero new dependencies, `/deck/state?b=` **p95 162.6 ms** with
the engine ticking under it, and B13/B14/B15/B20/B10's probes re-run whole — **ALL GREEN,
five for five**. Findings: **F1 an `armed` line in a fixture run log is a live authorization
now** — B10's own probe armed itself the moment a glass grew an engine, and the first thing
that engine did was pause a fixture session that ended without a `Stop`; fixed at the
fixture, and the rule is general · **F2 a fire returns a workspace and no session id**, so
the name-stamp is the join and `fired` is written twice (take the last; the first one's `ts`
is the timeout clock) · **F3 the arm hashes the flow file AND every resolved kickoff** —
B10 F2's positional-fence hazard closed at the wire, at the cost that a reformat re-arms ·
**F4 the board lands a step the engine never fired and writes nothing when it does** (B10
F4's dashed ring kept honest), while `IN FLIGHT`/`KILLED`/`BLOCKED` hold it — somebody is
already on it · F5 an unruled escalation on a landing pauses, per keel §5.1 rather than §4's
list — that is B12's judge, parked exactly there · F6 `~/` never leaves the parse boundary
(`tilde()` puts it back for the eye) · F7 a tick over a city with nothing armed touches
neither census nor register nor socket · **F8 `lab/b17/probe.ts` fails two live-quota
assertions at its OWN landing commit** — attributed from a detached worktree at `6cd3614`,
filed to [ISSUES](ISSUES.md), not fixed here.
Decided: nothing escalated — no contract, fence or DoD moved. The fence gains **no write
class**: every engine write is a hand call or a run-state append in the D6 telemetry
neighborhood. Felix's relayed tier amendment applied as given — the two real-work steps ran
**sonnet·low**, the cheapest tier that holds `auto` (P5), and a haiku step is refused at arm.
D12 is a flag B12 flips, not a rewrite: `plan()` takes the scope-arm auto-join as one branch.
Venue: `master`; three probes on their own ports against temp census homes, temp flows dirs
and temp fixture cities — three live sessions in total, every workspace closed, the smoke's
worktree removed and its branch deleted, no HALT left anywhere in the city.
Next: **B16 — the Chat** ([plans/b16-chat.md](plans/b16-chat.md)), the Dispatcher's to fire.

---

**2026-08-28 · Builder · opus-high (B16)** — **The voice.** The note-app copy-paste era is
over: his words leave the deck and arrive in a session as **one real user turn, byte-exact**.
Changed: `glass/chat.ts` (the read, the send, the drafts, the route), `chat.client.ts` (the
deck's third and last tenant — the transcript in Focus, the draft in Action, independently
scrolled), `chat.test.ts`, the wire shapes and the one pure `refusals()` in `deck-model.ts`,
the seam's **sixth member** `asks()` and a `selection` that now names the ontology's two
surfaced levels, three hotswap entry points (`deck.client.ts` City lines and queue,
`workshop.client.ts` sessions) through one shared control in `deck-dom.ts`, the composer's
post-fire swap, `paths.ts`'s `desk/`, `deck.css`, the routes, and both READMEs; two
instruments in `lab/b16/`. **The numbers:** typed into the rendered textarea and sent by the
rendered button, `sha 237dd6f33cc0a49b…` **identical** page-side and in the transcript read
straight off disk — 174 B with a blank line, 2/4-space indents and a trailing space, user
turns **1 → 2**, and the probe **acted on it** (`ACK pomegranate-7714`) with its answer on
the deck **384 ms** after the record was written, inside one 3 000 ms poll. Then the
workspace was closed under it, the census called it `gone`, and the **same** message shape
went in again as a **resume that carried the turn** — `sha a8a90c1d…`, **the same transcript
file and the same session id**, prior conversation intact, silo held (P6 Q3 confirmed from
the other side). **Nothing is reported delivered without the verification read**: its three
failure verdicts — no new turn, **more than one**, different bytes — are pinned in the suite
over real appended bytes, and none is ever retried, because a message may have half-landed.
Three faces induced live, each detectable **before a single cmux call**: an unknown target, a
**non-empty input box** (refused quoting `HALF A DRAFT FELIX WAS TYPING` — the transport
appends, it never replaces), and compose-time refusals for a TAB and a leading `/`. **D10 as
structure**: cold hands render **zero** `[data-chat-send]` anywhere in the DOM and answer
503, while `POST /chat/draft` still answers 200 — a file write under `desk/` sits in front of
the arming switch, because cold hands must never cost him the ability to write something
down. Three entry points (City · Workshop · needs-you queue) swap three targets into **one**
view; the draft per target survived a hotswap **and a killed server**; `architect-agents-03`
(2 265 kB) rendered tail-windowed and paged backwards on its own byte offset; the decoder
runs on transcript prose with **0** spans inside a fence. **555 tests green in one process**,
type gate exit 0, zero new dependencies, `/deck/state` **p50 58.0 ms** bare and **p50
59.2 ms · p95 115.8 ms** carrying `?b=` and `?s=` over the live register; the page still never
scrolls with an 11 107 px transcript in it (body − viewport = **0 px**), and B13/B14/B15/B20/
B10/B11's probes re-ran whole — **ALL GREEN, six for six**. Findings: **F1
`?s=` is a sixth seam member, not a second meaning for `?b=`** — a parameter that is
sometimes a slug and sometimes a uuid is the ambiguity class this building refuses ·
**F2 a bounded read that pages BACKWARDS and one that starts at a known boundary are two
functions**: `windowOf` drops its own first line, which is exactly the delivered turn, and
the suite caught it before any probe ran · **F3 a probe cannot be waited on by its words —
it answered `ACK` where `READY` was asked — and never by its name**: a fixed probe stamp
latched onto a previous run's dead session, D10's lesson arriving in the instrument ·
F4 `desk/drafts/` files are untracked and whether a draft is committed is B19's and the
Architect's, named not built · **F5 HALT does not stop a send, deliberately** — the flag
stops automation, and hitting it is usually the moment he needs to speak by hand ·
F6 the refusal list is wider than P6 measured (`!`/`#` by construction) and refuses anything
sanitizing would rewrite rather than rewriting it · F7 the box precheck is the building's
only screen-scrape, bounded and named · F8 the composer's post-fire swap travels through
`selection.awaiting`, because a fire returns no session id (B11 F2).
Decided: nothing escalated — no contract, fence or DoD moved. The send is **D18 write class
1** and lives outside `hands.ts` on B11's own precedent: credential-gated at its own door,
audited through the hands' `audit()` (sha and bytes, never the words — verified: the
message's own token appears in the audit **0** times), and reaching the world only through
the `cmux()` the hands already own. P6's transport law was consumed **verbatim**, clause for
clause, including the two rewrites P2 could not see.
Venue: `master`; two instruments on their own ports against temp desks and temp flows dirs —
**one** live session per run, its workspace closed, the resume's workspace closed, venue
before ≡ venue after (`workspace:24 belvedere · workspace:2 mentat`).
Next: **B19 — the desk** ([plans/b19-desk.md](plans/b19-desk.md)), the Dispatcher's to fire.

**2026-08-28 · Builder · opus-high (B19)** — **The desk.** D17 is built: there is now a place
in the deck where Felix writes, and the 17-item field report that commissioned this whole
chapter would have been written in it. One drawer city-wide — `~/code/agents/desk/`, flat,
frontmatter-free, **the first line is the title** — and three send routes, each previewed
before it fires.
Changed: `glass/desk.ts` (the store, the confinement, the trailer, the three plans, five
routes), `desk.client.ts` (the deck's **fourth** Focus tenant — the drawer in Focus, the
writing surface in Action), `desk.test.ts` (30 tests), `glass/inbox.ts` (B6's wire gains
D63h's **block form**: a `report` gesture, `evidence()`, `entryBytes()`, `inboxExisting()`),
`deck-model.ts` (the desk's wire shapes), `deck-view.ts` (the seam's fourth shared cell,
`compose.with`), `composer.client.ts` (registers it), `deck-dom.ts` + `deck.client.ts` (the
repaint memo now records its host; `forget()`), `deck.css`, `server.ts`, the glass README,
`desk/.gitignore`, and [`lab/b19/probe.ts`](lab/b19/probe.ts) — 14 assertions in real Chrome,
green three runs running.
**The evidence.** Typed into the rendered box → autosaved → `desk/2026-08-28-01.md` **188 B
byte-identical to the box**, titled off its own first line; then the drill — 241 B typed, the
glass killed mid-edit, a **fresh process**, a reload, and every byte came back with the same
note remembered open. **→ inbox** showed **290 B** of append while the target's `ISSUES.md`
**did not yet exist** (a preview is a read), and the filing landed byte-for-byte: **previewed
sha ≡ appended sha `c199b9c9701776dd`**, a legal D63h block in a **scratch-adopted** inbox,
**0 lint** from the one parser, the body's own `---` indented so it could not cut the block,
and the note carrying `routed 2026-08-28 09:26 → …/probe-fork/ISSUES.md`. **→ session** wrote
through **B16's own wire** and the shell swapped the Chat in on `builder-b19-probe`; fired
again over a non-empty box it **refused with no button at all**. **→ composer** had
`/deck/compose` re-resolve the whole plan against the note. **Confinement is the slug, not a
path check**: `POST /desk/save ‹../../canon/CLAUDE›` → **409 naming the rule**, nothing
written, nine spellings pinned in the suite. The live path ran once against the **real**
desk — `git status` afterwards: **`desk/` and nothing else** — and a live preview against
belvedere's own `ISSUES.md` left that file **untouched**. **585 tests green in one process**,
type gate exit 0, zero new dependencies, `/deck/state` **p50 56 ms · p95 60 ms** (the desk
rides gestures, never the clock), `/desk/notes` and `POST /desk/save` **p50 0.5 ms**, and
**all seven predecessor probes re-run whole — B13 · B14 · B15 · B20 · B10 · B11 · B16, ALL
GREEN**.
Findings: **F1 — the repaint memo outlived the host it described, and a tenant swapped away
and back drew NOTHING**: `focusOn` empties both hosts, `paint()` kept only `key → signature`,
so a return trip with unchanged content skipped the draw and left the pane blank with no
error. Measured in Chrome, not reasoned. Fixed at the cause — the memo records its host and
`forget(host)` retracts every claim about a cleared one — and it **binds B21 and B12** ·
F2 a tenant's mount-time async restore races a gesture: **`mount()` is not a fresh start**,
because the module outlives it · **F3 the evidence indent is load-bearing** — `blocks()`
splits on `^---$`, so an un-indented rule inside his prose would strand the evidence in a
block with no entry line, which is the one thing `parseIssues` lints; two spaces make it
unrepresentable, and refusing his rules would have been the glass telling him how to write ·
**F4 the desk declares NEITHER seam member** — a tenant asks the poll for what the *world*
writes, never for what Felix writes · F5 receipts are not body: the trailer is the final
`---` block only when every line in it is a receipt, and only the **irreversible** route
stamps · **F6 B16 F4 settled** — `desk/.gitignore`: notes are truth and commit, a half-typed
reply to one session does not · F7 the preview carries a sha and a moved inbox is refused by
name — **B11's arm law one door along** · F8 a header comment naming the guard defeated the
grep it described (B17 F1's check, working).
Decided: nothing escalated — no contract, fence or DoD moved. The desk is **D18 write class
3** and grows no transport of its own: the inbox append is B6's `filed()`, the message is
B16's `writeDraft()`, the composer is reached through the seam's own cell and never by
importing a tenant. `/desk/*` sits in **front** of the arming switch (B6 F3's law, third
venue) and the glass still commits nothing. One kind was added to B6's gesture grammar —
`report`, a title and its evidence — because D63h's block form is what a written thing sent
somewhere looks like, and a bare `note` cannot carry evidence.
Venue: `master`; the probe on its own port against a **copy** of the fixture city and a temp
desk, so no DoD run wrote into a tracked fixture or into his real drawer; the one live-path
note removed after its git-status evidence was taken.
Next: **B21 — the Grep** ([plans/b21-grep.md](plans/b21-grep.md)), the Dispatcher's to fire.

---

**2026-08-28 · Builder · opus-high (B21)** — **The Grep.** *"What was that session where I
was talking about 'bob summons'?"* is now one keystroke, one query and one click, and the
Chat is open at that turn.
Changed: `glass/grep.ts` (three corpora, two engines, every bound), `grep.client.ts` (the
query's state and the drawer's results — not a tenant, because the drawer is the shell's),
`grep.test.ts`, the wire shapes in `deck-model.ts`, `chat.ts`'s reader (a third `Where` case
and `ChatView.anchor`), `chat.client.ts` (the aimed window and `chatAt`), `desk.client.ts`
(`deskTo`), the shell (`deck.ts`'s header box and the drawer's second content,
`deck.client.ts`'s two keystrokes and three jumps), `deck.css`, `shelf.ts` (`transcriptsOf`
exported — B5's discovery reused, never re-derived), `server.ts` (`GET /deck/grep`), and
[`lab/b21/probe.ts`](plans/../lab/b21/probe.ts).
DoD (all evidence in [B21](plans/b21-grep.md), **16 of 16 PASS in a real Chrome against the
REAL corpus** — 736 transcripts across three accounts, 308 doctrine documents, the desk):
**the commissioning query live** — `bob summons` → *15 hits · 280 ms · rg*, **11 session
hits across all three accounts**, grouped sessions/docs/desk in the one drawer; the click
lands on the turn the matching line belongs to, **proven against the coordinate and not
against the DOM's opinion of it** (`the matching line begins at byte 450896; the marked turn
is [data-key="392696"] and the next turn opens at EOF`), timestamped, scrolled into the box,
and wearing a `[↓ latest]` because an aimed window and the live tail are two places in the
file. **A doc hit** opened `plans/b21-grep.md:9` with exactly **one line marked in the whole
document**; **a desk hit** opened the note in the editor, byte-identical to the file the
desk wrote. **Every bound induced live**: an over-cap query renders `capped at 50 — there
are more` on two groups, and one arm proved the other two at once — the glass relaunched
with `rg` unreachable falls back to `grep`, which over 1.7 GB is **8.3 s against ripgrep's
0.18 s**, so it **outlives the 3 s clock by construction**: `sessions timedOut=true with 0
honest hits and NO error`, the degradation banner on the page in the glass's own words, and
**three `/deck/state` polls fired inside that 3.2 s search came back in 85.8 · 42.2 ·
42.1 ms** — the worker law intact, because an engine is a spawn. **Warm p95 131.9 ms**
(N=20, 200 ms apart, five terms; bar 1000 ms). **Case-smart asserted** on a term minted at
run time: lower → 1 hit, upper → 0, mixed → 1, and the rule printed on the page. **606 tests
green in one process**, type gate exit 0, zero new dependencies, `grep.client.ts` carries
`hands/fire` **0×**, and the page still never scrolls with a full results drawer (**0 px**).
**All eight predecessor probes re-run whole — B13 · B14 · B15 · B20 · B10 · B11 · B16 ·
B19, ALL GREEN.**
Findings: **F1 — a probe that searches the REAL corpus finds itself.** A fixed marker
literal in the probe's own source is in the corpus before the probe runs (the transcripts of
the session writing it), so the upper-case control answered **three hits** against a note
that never held it; the marker is minted at run time now. **Binds B12 and every later probe
whose corpus is the city** — B16 F3's family, one grammar along · **F2 a legend sample
carrying the row's own class is a fifth result**: `#host-drawer .hit` answered twelve rows
where eleven existed and the account count came back as four, one of them empty. A legend of
a *clickable* vocabulary must not answer the selector the click is bound to · **F3 a
keydown's target is not always an Element** — `document` has no `closest`, so a
document-level shortcut written against `e.target.closest(...)` throws inside its own
listener and takes the shortcut out with no symptom · **F4 the turn a raw-JSONL hit belongs
to is the right turn and may not SHOW the term**: four of the first five hits landed in
records the Chat encapsulates to one line (a tool call's input, B16 §2), the fifth rendered
the phrase whole — §5's miss class, second face, named and deliberately not patched · F5 the
`grep` fallback is not *slower*, it is **over budget by construction** (40×), which is why
the banner and the per-group timeout both had to exist — and it is the cheapest genuine slow
arm in the building · **F6 `--max-columns` is ignored under `rg --json`**, so the line bound
is the reader's: streamed lines, a length bar with a resync, a cap that kills the process,
and an exit code read only when nothing else stopped it first · F7 subagent transcripts are
outside the corpus **by name** — one directory deeper, and not a session the Chat can open,
so a hit in one would jump nowhere; the blindness is real and its fix is a jump target, not
a wider glob · **F8 the anchored window is a third case, not a nullable `before`** —
`turnsOf`'s tail slice would have dropped exactly the hit's turn, silently.
Decided: nothing escalated — no contract, fence or DoD moved. **The fence gains no write
class**: a search is a read, it reaches no socket, and it sits in front of the arming switch
for the reason the inbox and the desk do (B6 F3, fourth venue). **No index** — `rg` over the
real corpus is 41–132 ms warm, and the premature-optimisation law says measure first. Two
environment knobs join `paths.ts`'s family, and both exist because the two failures that
matter cannot be induced by asking nicely: `GREP_TIMEOUT_MS` (the wall clock) and `GREP_RG`
(the engine's name).
Venue: `master`; the probe on its own port with the census, the audit log, the HALT flag,
the flows and the desk all in a temp root and the hands cold — the register and the
transcripts are read, and nothing in this row can move his desktop. `lab/b17/probe.ts` was
**not** re-run: its two failures are filed at its own landing commit (B11 F8) and it leaves
a live workspace open when it throws (B16's addendum).
Next: **B12 — the reactive gate + dynamic extension**
([plans/b12-flow-reactive.md](plans/b12-flow-reactive.md)), the Dispatcher's to fire.

---

**2026-08-28 · Builder · opus-high (B12)** — **The string judges itself, and grows while
it runs.** A step landed with an escalation on its row and the engine did not card the
sovereign: it staffed the scoped Architect sitting into the lane, half a second later, and
waited. The sitting ruled the row; the engine read the verdict off the **file**, not off its
report; the lane resumed and the step behind the gate fired. In the middle of it the flow
file grew, and the addition joined the running plan without a second click.
Changed: `glass/judge.ts` (new — the classifier, the judge's derivation, D12's delta reader
and scope-arm), `judge.test.ts` (new, 29), `engine.ts` (the gate loop, `LandingCode`,
`refuseStep` extracted, `settled`), `engine.test.ts` (+12), `flow.ts` (`Step.hash`,
`RunLine.steps`, `armedLine`), `works.ts` (judges drawn, the residue card),
`works.client.ts` + `deck.css` (the inserted node), `deck-model.ts` (`WorksNode.inserted`),
`register.ts` (`buildingPath`, one truth for two callers), `deck.ts`,
[`flows/flow-close.flow.json`](flows/flow-close.flow.json) (new, unarmed) and
[`lab/b12/probe.ts`](lab/b12/probe.ts).
DoD (all evidence in [B12](plans/b12-flow-reactive.md), **13 of 13 PASS in a real Chrome
against three live sonnet·low sessions**): **the gate's number is 0.553 s** — `paused:s1`
at `14:55:55.144Z` reading *"LANDED, and E1 is raised with nothing saying it was ruled"*,
`fired:s1.judge` at `14:55:55.697Z`, arm → judge fired **18.1 s**, zero human touches; the
sitting fired through the same hand at the flow's own judge tier in the gated step's own
checkout, its **first user turn byte-identical to the composed sitting** (`sha
f2cd39ffee1ed0e1`, 510 B, summons file ≡ hands receipt ≡ transcript). The DAG drew it
**inserted** (`data-inserted="yes"`, `path.wire s1→s1.judge`) with `s2` still `declared` and
unfired. **Resume on truth**: a real sonnet·low Architect, sent nothing but that sitting,
read the fixture's board and inbox and trued the row to `E1 ruled 2026-08-28 — …`, and
`landed:s1.judge → resumed:s1 → landed:s1 → fired:s2` came **0.513 s** later. Both roads to
his card measured live — a sitting **over** with the row still raised, and one past its own
**limit** — each rendering `felix-card` with **0 buttons, 0 links, 0× `hands/fire`**, one
`extended` line, and no `.judge.judge` anywhere. **D12 live**: `s2` appended under the arm
re-armed the flow itself (`scope-arm auto-join (D12)`, marks `s1` → `s1, s2`) and fired with
no click ever given it, while an **edit** stopped the lane naming the step.
`flows/flow-close.flow.json` parses, renders, is unarmed, and its G2 kickoff is the README's
own fence (`sha 43f72319c270a54c`, 351 B). **651 tests green in one process**, type gate
exit 0, zero new deps, `/deck/state?b=` **p95 289.9 ms** (the close flow's own share of a
poll: 0.13 ms), eleven predecessor probes re-run **ALL GREEN**.
Findings: **E1 — `trust.ts` reads an auto-created project entry as a refusal**, so a
plain-directory venue goes COLD the moment a session runs in it and the arm then refuses a
venue that demonstrably works; measured twice, live, 2.1 s after a successful start, and
B7 F1's own positive control `~/code/b7-founding-probe` reads `hasTrustDialogAccepted:
false` today. Fix named (fall through on `false` rather than short-circuit — right in every
measured cell), **not taken**: `trust.ts` is B7's law and P5 F5 (iii) blessed it. Costs
nothing in production, where every venue is a repo Felix accepted · **F2 a session that
finishes ends on `SessionEnd`, never `Stop`** — 61 of 61 gone sessions in the live census —
so B11's census landing sensor lands nothing and its malformed branch fires on every normal
close; B11 never felt it because every step in its smoke was a board row, and a judge has
none, so **a judge is landed by the row it was staffed for** and the census only says
whether the sitting is over · **F1 the order's own classifier gates 120 of 390 landed rows**
(`/escalat/i` alone 113), including `b10` and `b11` of this very flow, whose annotations
read *"nothing escalated"* — so §1's pattern list ships as the **misclassification log** it
asks for and `escalationsIn` is the classifier · **F3 a fixture city inside `~/code` is
slugged relatively and one outside absolutely** (B10 F5's second face) — a flow naming the
wrong one finds no register entry, gets an empty `world.rows`, and has every landing judged
by the census instead of the board, silently · F4 a step decided this pass kept its
concurrency slot and its checkout until the next tick, starving at `concurrency: 1` the
judge it had just staffed — `settled` fixes it, and `timeout` is deliberately outside it
because that session is alive and still spending · F5 **the arm now records what it armed**,
`<id>:<Step.hash>` per step plus a frame mark under `*`, because `Flow.hash` says the plan
moved and the delta reader needs which parts; an arm with no marks reads back null and null
never auto-joins · F6 D12's "building + chapter" is prose, so scope-arm enforces **what the
click already covered** — frame unmoved, nothing edited or removed, every addition's venue
and account already in the arm, plus `refuseStep`, the arm's own list extracted so there is
one of it · F7 a judge inherits the gated step's checkout, which is single-writer physics
rather than convenience · F8 probe residue named, not scrubbed.
Decided: **one escalation, E1, and it is the Architect's** — nothing else moved. The fence
gains no write class: a judge is a `hands.fire` and an `extended` line in the census
neighborhood, and the flow file stays the sitting's to amend (the glass writes no judge into
it). **D12 was a flag to flip, as B11 said**: `ARM_SCOPE` is one module constant and
`{kind: 'none'}` is B11's base behaviour verbatim, which is what an arm with no marks gets.
Venue: `master`; the probe stood up its own glass on its own port with the census, the
audit, the flows and **the HALT flag** in a temp root, and its fixture city at
`~/code/b12-gate-<pid>` — a plain directory with no git repository above it, so a sitting
told to commit could not reach the real tree; `git status` in `~/code/agents` is
byte-identical either side, all three workspaces closed, the scratch city removed, the
city's own HALT asserted absent.
Next: **Felix — arm `flow-close` in the Works.** His arm is G2's Felix-gate, the engine's
first real act and the deck's close smoke (README §6, batch-5 note); the fallback if the
engine cannot fire is `/summon` with G2's kickoff, and the failure becomes G2 evidence.
