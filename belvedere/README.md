# Belvedere — the sovereign's glass

**The structure built solely to command the view.** One window over the whole city —
every repo, every account, every live session — and a finger to fire the next one.
Commission: [dream.md](dream.md) (immutable). Founding record:
[../plans/belvedere.md](../plans/belvedere.md) (the keel, 2026-08-26) — the deep
deliberation lives there; where the keel and this doc diverge, this doc is current.

Subproject of the canon repo (D2): doctrine per
[canon/work/DOCTRINE.md](../canon/work/DOCTRINE.md); this file is the master doc.

## 1. The bet

Belvedere is a pane of glass over the truth layer the Guild already runs, plus a
finger. Truth stays in repos and the harness's session store; Belvedere holds none of
it. The doctrine's own files are the schema — boards (§4 tables), ledger tails (§7
format), fenced kickoffs (§5), the decision queue, ISSUES — rendered, never copied.
**The glass-shatters test**, standing bar for Belvedere and every dependency: if the
component dies, the city must stand. **Parser-as-lint**: a board that won't render is
a board that's lying — render failures file to ISSUES; the parser never fattens to
absorb them.

**The rework mandate (Felix, founding summons):** the Guild's conventions were
terminal-first and are NOT sacred — where a doctrine format fights the glass, the fix
may be a format amendment (escalated to the Grand Architect via the canon inbox),
never a fatter parser. [P3](plans/p3-parse-coverage.md) gathers the evidence.

> **Amended 2026-08-26, same day (Felix's word, post-P3): the mandate is AI-native
> (D7).** Storage is unconstrained — markdown, JSON, anything ("I don't want to be
> tied to the past"); terminal-first conventions never cap what Belvedere can be;
> city-wide migration is pre-authorized ("We'll migrate every project, I don't
> care") and takes **priority from the Sovereign**. The channel is unchanged: the
> Standards Office cuts the standards — the directive and P3's evidence ride the
> canon inbox entry of this date.

> **Molt landed, same day (canon D63–D67, row 16):** the reference reader is canon
> [`doctrine/`](../doctrine/) — one parser in the city; the glass imports it, never
> forks it (D65). P3 §5's shapes are normative per D65; both baton-rail gates
> (FC-1/FC-7) cleared by D63. P3's `lab/p3/` parsers retire to probe history.

## 2. The fence

Read-everything, write-narrow. The write list is exhaustive (D3):

1. spawn sessions (the hands)
2. create worktrees/branches per [DOCTRINE §10](../canon/work/DOCTRINE.md)
3. append sovereign-inbox entries (ISSUES, `From Felix (via Belvedere): …`)
4. touch HALT

It never edits boards, ledgers, decisions, or canon — those are mantle work; Felix's
word travels as inbox entries the building's Architect applies with his name on the
ruling. Repo fences (D2): Belvedere rows never write `canon/**`, `sync/**`,
`docs/**`, or root protocol files. The server binds 127.0.0.1 only — real auth
arrives with the Ava chapter, before exposure. The hands arm only by Felix's
gesture — `~/.config/belvedere/env` (B4 E2) — and that credential is an **arming
switch, not the lock** (B4 E1, D9): the socket already admits any local process
of Felix's, so what stands between a stray agent and the desktop is the
permission guard and this fence, never the password. Census is telemetry:
gitignored, never truth.

## 3. The organs

1. **Census (in, passive)** — heartbeats from session hooks (P1), the rig's
   `summon/log/invocations.jsonl`, session dirs `~/.claude*/projects/` ×3, repo
   docs, usage `summon/log/usage/` ×3. Files only; home `summon/log/census/` (D6,
   gitignored). The Steward's future tick reads the same census. P1 (measured):
   ten hook events, the pane join deterministic (`CLAUDE_CODE_SESSION_ID` +
   `CMUX_SURFACE_ID` in hook env, 87/87) but one-to-many — key by `session_id`,
   surface is grouping; **`Stop` is the idle sensor** (`Notification` is a 60 s
   nag, interactive-only); heartbeat 5.5 ms median (0.7 ms over an empty hook);
   hooks are **venue-blind** — the census watches Ghostty sessions too, they just
   carry no pane fields; all three subagent vehicles countable (D67 answered —
   P1 F4). Deploy target clean: no account-level hooks exist today.
2. **Glass (render)** — one bun server (canon D59), localhost, my_checklist-simple.
   **City View**: buildings = doctrine repos (the register,
   [the-city §1](../docs/the-city.md)); windows colored by mantle, rings by status.
   P3 (2026-08-26): 17 buildings carry doctrine artifacts today, four of them
   worktree-only (`manny`, `cornerizer`, `tig-avc`, `schema-migration`) — the
   register must look inside `.claude/worktrees/`, never just repo roots.
   **Building pages**: DOCTRINE §2's cold-session questions as panels. **The baton
   rail — the home page**: every ledger-tail baton, named Felix-gate, and pending
   countersign in one column; a session-holder baton becomes a Dispatch button, a
   Felix-holder baton renders as his card, never auto-fired. Baton grammar is
   move / wave / fork (canon D64) — the rail renders one / n / choice buttons; the
   parsed `Baton` shape gains `instruments[]` + kind at the build row. **Shelf**: resume
   anything, any account. Usage strip + **WIP gauges from day one** — a one-click
   dispatcher that hides the bill is how a sovereign DoS's himself.
3. **Hands (out, narrow)** — fire (P2's recipe, proven ×3 accounts: the summons
   travels **as argv**, byte-exact first user turn), auto worktree + branch,
   focus-panel jump-in, HALT. Transport law (P2 T1–T4): text into panes rides
   `set-buffer` + `paste-buffer` (`send` rewrites literal `\n`/`\t`/`\r`); never
   paste into a live Claude TUI — it splits at the first blank line and
   auto-submits. The shelf may address sessions **by name-stamp**
   (`claude --resume "digger-agents-04"` is legal — P4 §R).

**Deployment (RULED — D8, Felix's smoke 2026-08-26):** the glass server runs
OUTSIDE cmux under `socketControlMode: password` — the socket gate is *live*
ancestry, so a pane-resident glass dies with every cmux restart and can never
reconnect; pane-resident is bootstrap/fallback only. The server presents
`CMUX_SOCKET_PASSWORD` from launch env or a gitignored local file, never git.
Sharpened by B4 E1 (D9): the password's function is **admission, not
restriction** — it lets a non-descendant glass connect at all, while the CLI
resolves an absent password from cmux Settings, so any local process of Felix's
is admitted regardless. The credential file is Belvedere's **arming switch** —
absent, every hand answers 503 — and it holds the real password, not a
sentinel, so the glass outlives any tightening of that courtesy fallback.

**Design inputs (Felix, founding session):** theme = **felikai** —
`~/code/felix/src/felikai.css` (89 lines; `hexwright/canon/felikai.css`
byte-identical; whiteboardy's copy diverged). Applied exemplars: the SpaceX
dashboard `~/code/universal_robots_sdk/cap-mega/felix/spacex-dashboard-c2` and
bob's design system `~/code/universal_robots_sdk/bob/web/src/routes/design`. Which
copy/exemplar leads is Felix's taste call at the glass build row.

**Design laws (Felix, 2026-08-27):** **encapsulation-first** — every card and row
leads with a 1–6-word name ("B8: glass hardenings", "E1: register policy"),
[expand] reveals the full text or a waggle; **Inter for running prose,
IosevkaFelix for numbers, titles, buttons, tabular data**; **colour legends** on
every coloured view; the City View **groups by parent directory**; **recency
informs sort order, never dictates it** (attention — batons, gates, escalations —
outranks it); **account usage visible wherever accounts are chosen**; **no
dropdowns** — toggled button groups. Rows from B5 on build to these natively;
[B9](plans/b9-visual-law.md) sweeps the pages that predate them.

## 4. Scope — v0 and non-goals

**v0 (D5):** census + City View + building pages + baton rail + fire/worktree +
shelf + usage strip + sovereign's inbox.

**Non-goals, named (D5):** images (Felix, keel sitting; superset's
worktree-attachments convention is the plan when called) · Ava / laptop-closed
continuity (v0.5 — tmux-over-ssh chapter; nothing local survives a shut lid) ·
embedded terminals (cmux IS the terminal) · the generative city (dessert — census
logs from day one so it lights up from real history later) · whiteboardy links
(THG-only, Felix) · the Steward (lands INTO this glass, after; unparked by Felix's
word only) · editing truth (forever-class, §2).

## 5. Working agreements

- **Venue:** this subdirectory. Probes commit straight to `master` (they touch only
  `belvedere/` and gitignored telemetry); build rows use worktrees per DOCTRINE §10
  when they need a branch.
- **Ledger-locality:** Belvedere sessions ledger in [LEDGER.md](LEDGER.md) — the
  canon LEDGER carried the founding line only; the canon board carries one row
  (15), never the campaign.
- **Substrate-as-driver (D4):** the portable unit is the rig's `cmd` string; where
  it runs (cmux / tmux / plain tab) is one adapter. Nothing outside the adapter may
  care.
- **Shared live resource:** the cmux desktop is Felix's own screen — concurrency
  plans ride every batch note; a row that quits/relaunches cmux (P4-class) runs
  exclusive, never over live work.
- **ISSUES:** [ISSUES.md](ISSUES.md) is this building's inbox (D53 pattern), swept
  by this board's Architect every sitting.
- **One parser in the city (D65):** the glass imports canon
  [`doctrine/`](../doctrine/) (`parse()` → Building); it never forks or
  re-implements it. New writing follows the D63 grammar on landing; the pre-molt
  corpus converges via canon row 18.
- Stack: bun (canon D59); tabs at width 3 (global directives).

## 6. The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| P1 | [Census join](plans/p1-census-join.md) — hook events, payloads, CMUX_* env, heartbeat cost, subagent visibility | — | Digger · opus-high | **LANDED** 2026-08-26 — no kill fired. **10 hook events** mapped, payloads verbatim; **the cmux join is deterministic** — `CMUX_SURFACE_ID`+`CLAUDE_CODE_SESSION_ID` in the hook env on **87/87** invocations, no fallback needed. Heartbeat **5.5 ms median / 6.8 ms max (N=50), 0.7 ms over an empty hook** — 7× under the kill bar; hooks proven blocking. **D67 is mechanically supportable:** Agent-tool and Workflow agents fully countable (`agent_id`/`agent_type` on every nested call, `agent_transcript_path`); background shell jobs countable at launch, **one named blindness** (no completion event). Two traps for the glass: **SIGKILL leaves no `SessionEnd`** (census must pair with `kill -0 pid`) and **`/clear` rotates the session id in place**. Record schema + `beat.sh` proven end-to-end in [P1](plans/p1-census-join.md) |
| P2 | [Spawn recipe](plans/p2-spawn-recipe.md) — socket access model; new-workspace + send ×3 accounts; resume variant | — | Digger · opus-high | **LANDED** 2026-08-26 — no kill fired. Access gate is `socketControlMode` (server setting), **not** an env token: a pane process drives the socket with **zero `CMUX_*`** — D4 stands, glass ships in a pane today; outside access is a documented `password` mode, **Felix-gated** (E1). Recipe proven ×3 accounts — summons byte-exact as the **first user turn** (sha ×3), silo intact, resume proven. `/color` leaves the prompt (cmux owns colour) — that frees argv and closes the **359-fire paste gap**. `send` corrupts literal `\n`/`\t`/`\r`; never paste into a live TUI (T4). Spawn function: [`lab/p2/spawn.ts`](lab/p2/spawn.ts) |
| P3 | [Parse coverage](plans/p3-parse-coverage.md) — board/ledger/baton/queue parsers vs every live doctrine repo | — | Digger · opus-high | **LANDED** 2026-08-26 — kill did NOT fire: one strict parser, **zero per-repo special cases**, 25/27 board docs · 365/365 rows found · 288 fully typed (79%). 14 failure classes, all general; **9 fold candidates (FC-1…FC-9) escalate to canon** — FC-1 (`Felix-gate` as a legal Staffing value) and FC-7 (fenced summons in `Next:`) **gate the baton rail**: 1 of 8 ledger tails is fireable today. Findings + JSON shapes in [P3](plans/p3-parse-coverage.md) |
| P4 | [Restore semantics](plans/p4-restore-semantics.md) — quit/relaunch over a live turn, measured | P1; P2 | Digger · opus-high | **LANDED** 2026-08-26 — kill did NOT fire: restore lost **no session**; both killed sessions returned **byte-identical** (458/736796 · 505/791537 either side). cmux persists a per-panel **resume binding, never conversational state** — `wasAgentRunning` gates it, the binding carries `CLAUDE_CONFIG_DIR`, so **the silo survives restore**. Unattended restore: **socket back 0.8 s, agents re-exec'd 3.4 s**. Loss = **the in-flight assistant turn, nothing more** — assistant messages are atomic, and a restored session **does not retry** the dropped turn (`No response requested.`). Control (§C): a cmux quit costs exactly what closing a terminal tab costs (SIGHUP; SIGKILL flushes nothing and still resumes clean) — **cmux's delta is recovery, not loss**. **§A upgrades P2's E1:** socket access is *live* ancestry (orphan with `ppid=1` → denied), so a glass in a pane **cannot survive a cmux restart** — `password` mode is load-bearing, not cosmetic. One residual measurement Felix-gated. Findings in [P4](plans/p4-restore-semantics.md) |
| B1 | [Census deploy](plans/b1-census-deploy.md) — the liveness sensor live ×3 accounts | — | Builder · opus-high | **LANDED** 2026-08-26 — merged at G1 (`ab4d857`); DoD evidence in [B1](plans/b1-census-deploy.md); D54 slip (unnamed `bunx tsc`) self-caught + accepted at G1, zero harm; live ×3 deploy **✓ Felix 2026-08-27** — the sensor is live on all three accounts |
| B2 | [Glass spine](plans/b2-glass-spine.md) — bun server: City View + building pages over `doctrine/` + census | — | Builder · opus-high | **LANDED** 2026-08-26 — merged at G1 (`a22a841`); DoD in [B2](plans/b2-glass-spine.md); E1 ruled at G1 (zero-cache scopes to CONTENT; register ≤30 s warm, age printed — implementation rides B3); F1→B5, F2→canon inbox; visual pass **✓ Felix 2026-08-27** |
| G1 | Batch-2 review — merge B1+B2; **Felix-gate: census deploy ×3 + B2 visual pass**; cut B3–B6 orders | B1, B2 | Architect · fable-high | **LANDED (Architect half)** 2026-08-26 — both branches merged, escalations ruled (D54 accepted; E1 → content-scope; F2 → honest off-register + canon question), B3–B6 orders cut and blessed. Felix half **✓ 2026-08-27**: deploy ×3 run, visual pass given — G1 complete |
| B3 | [Baton rail](plans/b3-baton-rail.md) — `/` becomes the rail; move/wave/fork buttons, Felix-cards never auto-fired | B4 | Builder · opus-high | **LANDED** 2026-08-27 — `/` is the rail (City View → `/city`), DoD evidenced in [B3](plans/b3-baton-rail.md): **8 of 8** city batons rendered (the 9th ledger writes `Next —`, not `Next:`), Felix-cards **structurally unwired** (35 of 38 cards carry zero fire wiring), a **composed worktree fire** landed byte-exact (fence = clipboard = first user turn, one sha256, probe cleaned up), fork badged, `/` **p95 48 ms**. **E1 — the G1 ruling's own implementation cost a p95 of 8.3 s**: the deferred walk still held Bun's only thread; moved to `register.worker.ts` (fixed here), but the **20 s TTL over a 9.5 s walk is the Architect's to rule**. **E2 — all three live fireable batons are Felix-gated in prose while `classifyBaton` calls them session batons**; reported on the card, escalated to canon, never overruled. F1 rig colours ≠ cmux colours (`cyan`/`pink` refused — fires died mid-way) · F2 fires into an untrusted tree stall at Claude's folder-trust dialog (**bites B7**) · F3 `bun test belvedere/glass` red on a **pre-existing** B4 collision (105 green per file) · F4/F5 canon asks: `Baton.kind`, and a **field** for a row's branch (prose reading was 0/62 sound). **E1 ruled 2026-08-27** — the worker is law (the walk never rides the request thread); TTL 5 min + hands-bust + re-walk button → [B8](plans/b8-glass-hardenings.md). **E2 ruled 2026-08-27 — D10, ambiguity never arms**: collided cards lose fire wiring, keep note + copy → B8; the grammar stays canon's (ask filed) |
| B4 | [Hands](plans/b4-hands.md) — /fire /worktree /focus /halt + hardened spawn lib; credential `~/.config/belvedere/env` | G1 (Architect half ✓) | Builder · opus-high | **LANDED** 2026-08-27 — all four hands on `master`, DoD evidenced in [B4](plans/b4-hands.md): fire byte-exact (sha ×2 identical) + resume + worktree + focus **off the live census** + HALT + disabled-mode 503s; **62 tests green**; venue restored, HALT cleared. **E1 ruled — D9** (arming switch, not lock; fence + D8 framing amended, credential kept) · **E2 paid ✓ Felix 2026-08-27** — `~/.config/belvedere/env` armed by his hand (0600 verified), socket password rotated off G1's temporary; the batch-close rail fire is the end-to-end password proof. D54 slip (`bunx tsc`, B1's again) self-reported |
| B5 | [Shelf + gauges](plans/b5-shelf-gauges.md) — resume ×3 by transcript-stamp; usage strip; WIP gauges | B4 | Builder · opus-high | **LANDED** 2026-08-27 — `/shelf` lists **723 transcripts ×3 accounts in 46 ms**, DoD evidenced in [B5](plans/b5-shelf-gauges.md): **one dead session resumed from EACH account** (three `SessionStart` beats quoted, each on its own transcript under its own `CLAUDE_CONFIG_DIR`) with **no user turn injected** — the newest turn in all three is still 10–12 h old; **307 of 723** sessions render honestly unstamped; the usage strip matches the rig's **own `_summon_usage_delta`** on **9/9 cells ×3 accounts at one instant**; the **16-cap induced live** (18 shells, hook recorded 16) renders `15+`/`1+`; **166 tests green in one process**, type gate exit 0. **E1 — the census sees 6 sessions where `ps` sees 38**: B1's hooks went live mid-city, so every pre-hook session is invisible and *every* WIP figure (rail and City View too) is a floor — the panel now prints the horizon; the sensor question is the Architect's. **E2 — `/hands/fire` widened**: on a resume, a field the glass does not know is omitted from argv, never guessed (backwards compatible; `summonsPath`/`sha` now nullable) — a resume that injected a turn would wake a dead agent with no instruction. F1 **`buildingOf` assumed a branch was one path segment** — the city's `bv/…` branches mis-housed every worktree session in its repo root, silently, on the rail and City View too (fixed at the cause) · F2 **only `Stop`/`SubagentStop` carry `bg`** (210 of 210), so an empty roster means *unknown*, and renders `?` not `0` · F3 the projects slug is lossy and is never parsed · F4 built to the §3 design laws natively; Inter's vendoring is still B9's |
| B6 | [Sovereign inbox](plans/b6-sovereign-inbox.md) — gestures → D63 ISSUES appends + the apply button | B4 | Builder · opus-high | OPEN — order blessed at G1 |
| B7 | [Summon composer](plans/b7-summon-composer.md) — fire-anything: form + templates (founding incl.) + worktree composition | B4 | Builder · opus-high | OPEN — cut 2026-08-27 (Felix's ask), joined batch 3 by amendment; amended at the ruling sitting: trust-dialog warning (B3 F2) |
| B8 | [Glass hardenings](plans/b8-glass-hardenings.md) — E1/E2 rulings live (register policy, ambiguity-never-arms), fire unwind, test isolation, offline type gate | B3 | Builder · opus-high | **LANDED** 2026-08-27 — all five built, nothing escalated; DoD evidenced in [B8](plans/b8-glass-hardenings.md). **E1 policy live**: ttl 300 s, hands bust the register, re-walk button beside the age — footer reads `ttl 300s`, **p95 45 ms** (bar 500 ms), a live worktree moved it 75s → 3s without stalling the request that took the bust. **D10 live**: hexwright + simmy render **zero** fire wiring, note + copy intact, holder untouched. **Fire unwinds** — induced refused colour, `workspace:11` closed, `fire.unwind` audited, no orphan. **`bun test belvedere/glass` 109/109 in ONE process** (B3 F3 fixed at the cause: `paths.ts` resolves env anchors per call). **Offline type gate**: `typescript@7.0.2` + `@types/bun` pinned, lockfile committed, `bunx --offline tsc --noEmit` exit 0 — covers `doctrine/` too. F1 the isolation bug was never just eight red tests — **the suite armed the city's real HALT flag and left it armed** (cleared here, venue restored), wrote 16 lines into the real audit log (four stamping `builder-belvedere-01`, which `nextStamp` counts — parked to ISSUES), and **printed Felix's live socket password into a failure diff** · **F2 the live rail now arms 0 of 38 cards** — B3 E2's measurement arriving as a consequence, unblocked only by canon's holder grammar or an unambiguous clause · F3 the worker law binds B5's scans · F4 the gate found one latent `Beat` error · F5 12 810 worktree copies deduped, parked |
| B9 | [Visual law sweep](plans/b9-visual-law.md) — §3 design laws over the pre-law pages: fonts, legends, encapsulations, city grouping, sorting, button groups | B7 | Builder · opus-medium | OPEN — cut 2026-08-27 on Felix's design laws; last row before the close gates (opus-medium: the laws are written, the taste gate is his visual pass) |

**Batch 1 (cut at founding, 2026-08-26) — Felix-tended, reasons named:** the venue
is his live desktop (first contact with a new substrate — his eyes at each landing),
and rig-fired probe sessions are exactly the agent-visibility he demanded (canon
ISSUES, 2026-08-22). Fire P3 anytime, anywhere. Fire P1 and P2 **from terminals
inside cmux panes** (open two cmux tabs, run the rig in each) — they need the pane
env and the inherited socket access: founding smoke shows the socket refuses
outside processes. P1 ∥ P2 ∥ P3 parallel-safe (disjoint files, separate
workspaces). P4 only after P1 and P2 land — it kills the venue. No Dispatcher
(interactive batch, canon v2 precedent), no bulletin; cross-row discoveries relay
at landing boundaries. Venue state at founding: cmux installed
(`/opt/homebrew/bin/cmux`, app launches); socket up but **access-gated** — P2's
first question.

**Batch note amended 2026-08-26 (post-GA):** canon row 18's re-cut wave (8 scoped
Architects, Dispatcher-tended) runs city-wide in parallel — its method defers
buildings with live work, so Belvedere sittings and the wave never collide (GA
ledger, third act). P1 re-cut with D67's census question; P2/P4 untouched —
substrate physics owe the format law nothing.

**Batch 1 CLOSED 2026-08-26 — four landings, zero kills.** The physics held:
census join deterministic, spawn recipe proven ×3, parsers normative, restore
lossless. One canon escalation filed (the rig's `/color` turn-burn, P2's find);
the deployment ruling landed as D8 (Felix's smoke, same day).

**Batch 2 (cut 2026-08-26, the fold sitting) — the spine wave, Dispatcher-tended
(D61):** B1 ∥ B2, parallel-safe by construction — disjoint dirs
(`belvedere/census/` vs `belvedere/glass/`), **worktrees mandatory** (branches
`bv/b1-census`, `bv/b2-glass`; the shared checkout's branch is never switched;
unmerged branches ride the board until G1). Neither row drives cmux and neither
touches a live settings file — no desktop contention, no concurrency ceiling.
Dispatcher creates [plans/BULLETIN.md](plans/BULLETIN.md) at first dispatch;
announce duty applies (canon D67). **G1 batches every gate (D44):** Architect
merges or rejects both branches and cuts B3–B6's orders; Felix runs the census
deploy ×3 and gives B2 its visual pass — nothing dribbles between. Dispatcher
summons, verbatim:

```
You are a Dispatcher at sonnet-medium.
Wear ~/code/agents/canon/mantles/dispatcher.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements, board, this batch
note) and run batch 2: dispatch B1 and B2 in parallel — kickoffs verbatim from
their orders plus the rider at ~/code/agents/belvedere/plans/RIDER.md, worktrees
per the batch note — tend to landing, then stop: G1 is the Architect's and
Felix's. Escalations and the batch report come back to Felix.
```


**Batch 3 (cut at G1, 2026-08-26) — the organs, strictly serial on master:**
B4 → B3 → B8 → B5 → B6 → B7 → B9 *(chain amended 2026-08-27 — B7 joined at Felix's ask; B3 amended pre-dispatch: worktree-composed fires; B8 joined at the E1/E2 ruling sitting, firing first — the rulings go live before B5 builds over them; B9 joined on Felix's design laws, sweeping the pre-law pages before his visual pass)*, one row in flight, straight to `master` (single-writer
physics, the rig rows' precedent — no worktrees), Dispatcher-tended (D61),
announce duty (D67). The E1 ruling binds every page (as ruled 2026-08-27):
content never cached; the register serves warm off the worker — the walk never
rides the request thread — TTL 5 min with its age printed, busted by the glass's
own fires/worktrees, a manual re-walk beside the age. Felix-gates, batched at the close:
visual pass (rail + city) and the live-fire smoke from the rail. His G1 half
(census deploy ×3 + spine look) runs in parallel with B4 — batch 3 reads no live
census until B5's gauges, and those degrade honestly. Dispatcher summons,
verbatim:

```
You are a Dispatcher at sonnet-medium.
Wear ~/code/agents/canon/mantles/dispatcher.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements, board, batch-3
note) and run batch 3: B4 → B3 → B5 → B6 strictly serial, one in flight,
straight to master — kickoffs verbatim from each order plus the rider at
~/code/agents/belvedere/plans/RIDER.md — tend each landing, dispatch the next on
LANDED, stop at the close: the visual pass and live-fire smoke are Felix's.
Escalations and the batch report come back to Felix.
```

**Post-probe return:** the probes' fold sitting (this Architect) cuts the build
rows — the v0 spine slices D5's scope; nothing builds on unmeasured physics. Glass
v0's evidence is the Felix-gate on canon row 17 (the storage experiment) — this
campaign's output feeds the Standards Office.

**Parked:** the sovereign's-DESK mint (a GA sitting, when inbox volume proves the
genre — keel §7) · superset's attachments convention (rides the images chapter) ·
~~rail fire-button affordance~~ (promoted to [B3](plans/b3-baton-rail.md) §4,
2026-08-26) · **the continuous-flow horizon** (Felix, 2026-08-26, corrected
wording filed to the canon inbox — the Dispatcher was a band-aid: work strings
should keep flowing between Architects, Builders, Diggers, and gates, pausing
ONLY at Felix-escalations; Belvedere's hands + rail + census are the natural
engine, the Steward the same flow unattended; v0 usage is the evidence — **keel cut 2026-08-27**: [plans/flow-keel.md](plans/flow-keel.md), D11 the arm contract, build rows at the v0 close sitting). · a guided **new-building flow** (post-v0: B7's founding template covers the fire; the ritual's Felix-steps — mkdir, the dream by his pen — stay his; the glass never writes founding docs).

## 7. Decisions

- **D1** (2026-08-26, Felix): **The name is Belvedere** — the structure built
  solely to command the view. Ruled at the mentat-02 sitting (keel header).
- **D2** (2026-08-26, Felix): **Venue: in-repo subproject** at `agents/belvedere/`,
  simmy pattern — own README board, one pointer line in the repo CLAUDE.md, one row
  on the canon board; rows never write `canon/**`, `sync/**`, `docs/**`, or root
  protocol files; extraction later is a cheap subtree split (keel §11 amendment).
- **D3** (2026-08-26, founding Architect per keel §2 · ✓ Felix same day):
  **The fence.** §2's write list is exhaustive; any new write class is an
  Architect-desk question first, never a feature. Glass-shatters and parser-as-lint
  are standing bars.
- **D4** (2026-08-26, founding Architect per keel §4 · ✓ Felix same day):
  **Substrate: cmux for v0, behind the driver fence**; tmux re-scoped to the Ava
  chapter (detach + ssh is that chapter's real requirement).
- **D5** (2026-08-26, founding Architect per keel §8; the deferrals within it ruled
  by Felix at the keel sitting · ✓ Felix same day): **v0 scope and non-goals** as §4
  states them.
- **D6** (2026-08-26, founding Architect — the keel's named call · ✓ Felix same
  day): **Census home: `summon/log/census/`** — beside `invocations.jsonl`,
  one telemetry neighborhood, already gitignored (verified at founding:
  `.gitignore:1  summon/log/`).
- **D8** (2026-08-26, Felix — smoke by his own hand): **Deployment (b) ruled: the
  glass lives OUTSIDE cmux.** Socket auth `socketControlMode: password`; the
  server presents `CMUX_SOCKET_PASSWORD` (the documented CLI fallback, P2 §A3),
  value in a gitignored local file or launch env, never committed. Pane-resident
  is fallback only — the gate is live ancestry; a pane glass dies with every cmux
  restart and can never reconnect (P4 §A). Evidence: `cmux --password '…'
  workspace list` from a non-cmux terminal listed both live workspaces,
  2026-08-26. *(Framing sharpened by D9: the password admits — it does not
  restrict.)*
- **D7** (2026-08-26, Felix): **The mandate is AI-native.** Belvedere is designed
  for what the city should be, never capped by what markdown made it — storage
  format unconstrained, terminal-first conventions carry no veto, city-wide
  migration pre-authorized at his word, priority from the Sovereign. Execution
  channel unchanged: the Standards Office (Grand Architect) cuts the standards;
  Belvedere supplies needs and evidence ([P3 §4](plans/p3-parse-coverage.md), the
  canon inbox entry of this date). Sharpens §1's rework mandate from "amend where
  formats fight" to "the design leads, the standards follow."
- **D9** (2026-08-27, Architect, on B4 E1's measurements · ✓ Felix same day):
  **The credential is an arming switch, not the lock — and it stays.**
  `socketControlMode: password` *admits* the outside glass (live ancestry no
  longer required — its load-bearing function, P4 §A); it does not *restrict*:
  the CLI's documented fallback resolves an absent password from cmux Settings,
  so any local process of Felix's drives the socket today (measured, B4 E1 — a
  wrong password fails loudly, none at all succeeds). No Belvedere text may
  present the password as what keeps agents off the desktop — the permission
  guard, the fence (D3), and the audit stand there. The glass keeps requiring
  `~/.config/belvedere/env` anyway (B4's call, ratified): an explicit Felix
  gesture is the cheapest safety a one-click dispatcher can carry — it gates
  accidents, not adversaries. The file keeps holding the real password, not an
  empty sentinel (the CLI would resolve one from Settings): D8's operative text
  says the server *presents* the credential, a content-ignored file is hidden
  state, and presenting the real value keeps the glass alive under the Ava
  chapter and any future tightening of the CLI's courtesy fallback. D8's
  deployment ruling stands whole; only its auth framing retires. Fence +
  deployment wording amended (§§2–3).
- **D10** (2026-08-27, Architect, on B3 E2's corpus evidence · ✓ Felix same day):
  **Ambiguity never arms.** A glass affordance that fires work renders armed only
  when parse and prose agree; any collision renders safe — unwired, the conflict
  named on the card, copy-summons allowed (copying is reading; the gate stays
  Felix's). Interim over batons until canon rules the holder grammar (the ask is
  filed); permanent as design law for every fire affordance — B6's apply button
  and B7's composer inherit it. Generalizes D9: the one-click path gates
  accidents, and a wired button under "pending Felix" prose is an accident
  waiting. Parse stays the parser's (D65) — this is render law, not a second
  parser.
- **D11** (2026-08-27, Felix — the flow planning sitting): **The arm contract.**
  A flow — the batch note as data: rows, gates, accounts, venues
  ([plans/flow-keel.md](plans/flow-keel.md)) — renders as its whole DAG before
  anything runs; **one click arms it, and the review of the rendered plan IS the
  authorization.** The engine fires only declared steps, pauses at Felix-cards,
  on any ambiguity (D10), and on HALT; nothing emergent ever fires. Amending a
  flow re-arms its unfired steps. Timing, same word: the flow chapter builds
  **after v0 closes** — rows cut at the v0 close sitting.

## 8. Definition of done — v0

1. One window: City View lit correctly against live state, verified against a
   hand-count of running sessions across all three accounts.
2. A building page renders board / ledger tail / decision queue / ISSUES panels
   from real repos; rendered links resolve (D58).
3. The baton rail shows every live baton; a session-holder baton fires a real
   session (worktree + branch when the row says so); a Felix-holder baton renders
   as his card and never auto-fires.
4. The shelf resumes a dead session from each of the three accounts.
5. Usage strip live ×3; WIP gauges live.
6. Sovereign's inbox: a glass gesture lands as a legal ISSUES entry; the apply
   button dispatches the scoped Architect sitting.
7. The glass-shatters drill: kill the server mid-everything — no repo harmed, every
   session lives.
