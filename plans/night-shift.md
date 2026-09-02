# The night shift — a keel-note

**Status: deliberation — nothing here is dispatchable, nothing ratified.**

> **2026-09-01 (grand-architect-22):** of the missing seven, law 3 (the autonomy lanes)
> and law 6's Felix-cost are now agents D86 and D82 — the lanes as proposed, birthplace
> stigmergon; the go-mark as law; the tick's dispatch step has an interim instrument,
> the tender kickoff (D83). Unpaid: law 1 the standing summons, law 2 the priorities
> contract, law 4 the budget law, law 5 the safety floor, the intake and the tick. The
> bottleneck ladder's rung two — his review-minutes — is where he stands; the statement
> (agents 041) is its instrument. §7's path stands, unparked by his word only.
 Written
2026-08-24/25 by the grand-architect-09 sitting (the window that became `mentat-00`) at Felix's ask:
*what does the Guild need to build things without me?* Harness facts below are dated
(Claude Code ~2.1.2xx, Aug 2026) and WILL rot — re-verify before building on them.
Companion: [plans/quartermaster.md](quartermaster.md) (the peer plane). The Mentat was
deliberated here too and minted the same sitting — that thread lives in
[D62](../DECISIONS.md); this note keeps the rest.

## 1. The three wants — untangled

Felix's stream braided three different things; they compose but build separately:

1. **The night shift** — work initiates, executes, and lands without his keystroke:
   survey → prioritize → dispatch → review → escalate, on a clock. Round the clock —
   the name marks the marvel (waking to finished work), not the schedule.
2. **The sovereign's interface** — the whole work queue visible, drag-to-reorder,
   defer, batched questions. Not markdown.
3. **The observatory** — every live session visible, jump into any; someday the
   generative city miniature (buildings = repos, lit windows = live sessions).

## 2. The throne ruling

What Felix described is NOT the Royal Architect. D39's gate stands by his own terms
(the every-platform substrate does not exist; the Royal sees every campaign, coding and
not). The office that runs the night shift is lesser on purpose and keeps the throne
warm: **the Steward** — ruled by Felix 2026-08-25 over runner-up *Clerk of Works*
("wordy"; the real construction role — the owner's on-site representative acting
between the owner's visits — remains the city-register gloss). Initiative within a
contract, zero taste authority. The pattern completed: every level pairs a thinker
with a mover — Architect ←→ Dispatcher at project level; **Mentat ←→ Steward** at the
sovereign's level. The Quartermaster duty (machine logistics) folds into the Steward
until the routing labor hurts enough to split (the QM note's own minting principle).

## 3. What already exists (the uncanny convergence)

**City-side:** the truth layer is proven at campaign scale (whiteboardy: 26 rows, 13
batches, 9 days). Row 010's usage fetcher reads all three accounts' OAuth usage with
pacing deltas — the throttle exists. Rows 13/14 name-stamps — the roster is a map.
Row 012's `guard/` — deterministic PreToolUse denies, the unattended-safety pattern.
The doctrine has been crawling toward autonomy for weeks: D44 (maximize the run
between Felix's judgment calls), D61 (Dispatcher-tended default), D57 (amendable
batches), gates-as-rows. And **whiteboardy's dream names the seam**: "efficiently read
& updated by Claude agents" — v1 cutover in flight, C5 converts ~08-28, M4 (agents) is
its standing next rock; `agent/read.ts` already exists.

**Harness-side (dated census, verified 2026-08-24):** `/goal` (session-level
completion condition, runs unattended to DoD). Cloud Routines via `/schedule` (cron,
min 1 h, no permission prompts, **API + GitHub-event triggers**). Desktop Scheduled
Tasks (local, unattended, per-task permissions, cron to 1 min). `/loop` (in-session,
self-pacing, dies with the session). Agent view (`claude agents` — needs-input /
working / completed grouping, attach, per-account only). Remote Control (cross-machine
+ phone; `SendMessage` reaches other machines). **Wake semantics documented**: a
message to an idle interactive session wakes it and runs a turn (`crossSessionInbound`
setting: accept/hold/refuse; headless `-p` does NOT wake) — the QM note's §2 pivotal
unknown, answered on paper; the live probe with a control (DOCTRINE §6.2) is still
owed before law binds on it. Unattended permission modes: `dontAsk`
(deny-unless-allowlisted), `acceptEdits`, research-preview `auto` classifier;
`--allowedTools`. Ava.local is alive on the LAN (probed 2026-08-24, 6.5 ms).

**Adjacent rulings this deliberation:** the DeepSeek harness (`dsh` v0.1, 2026-08-13 —
everything-is-a-plugin micro-kernel, pluggable models incl. Claude) — **watch, don't
marry**: everything it offers the harness now has natively; everything we'd lose (the
guard/permission architecture) is Claude-Code-native; steal its tool-call-level
trajectory-log idea by harvest someday. Saggar (native macOS agent-terminal,
needs-you classification, one decision queue) — concepts stolen for the digest; the
app needs macOS 26 and Groot runs Sequoia.

## 4. The missing seven — five laws, two builds

1. **The standing summons** (law): Felix writes and signs the summons once (a
   D-entry); the clock fires it; every tick cites it. The summons law survives — the
   cron is his hand, time-delayed. Kill switch: a `HALT` file every tick checks first,
   plus deleting the schedule.
2. **The priorities contract** (law): his ranked queue as machine-readable truth — the
   single most load-bearing artifact. Home: whiteboardy (top-level order = priority,
   drag = reprioritize, tags = lane/theater/Felix-cost). v0 reads it; M4 makes it
   bidirectional. Boards stay execution truth in repos — one truth, one home.
3. **The autonomy lanes** (law): per-repo contract — **green** (build+merge+deploy
   alone; mechanical DoD only), **yellow** (build to PR + evidence, park at the
   Felix-gate), **red** (plan only / don't touch: canon, money, prod, taste). With the
   **trust ratchet**: N consecutive accepted landings promote a class; one morning
   rejection demotes it, incident filed. Autonomy is earned in the ledger, never
   granted in the charter.
4. **The budget law** (law): the pacing delta is the throttle — spend down to the pace
   line, never past it ("maximally used", formalized). **Fable is shared with a
   reserve, not fenced** (Felix, 2026-08-25): the Steward runs its sittings at fable
   and may invoke fable while the Fable-specific delta keeps ≥ N points banked ahead
   of the clock for Felix's own sittings (N his, ~15–20 to start). Unused reserve
   expires at the window — the throttle self-corrects. The delta is also circadian for
   free: his daytime spend shrinks it, his sleep grows it.
5. **The unattended-safety floor** (law): own macOS user on Ava; clones, never his
   checkouts; GitHub branch protection makes PR-only physical; guard v2 deny-set
   (config dirs, canon sync set, force-push, secrets, unlisted deploy verbs); D54 +
   D55 inherited whole; every session stamped `steward-*`; **no silent nights** — the
   digest carries everything.
6. **The intake pipeline** (build): notes / ISSUES / whiteboardy → proposed rows with
   briefs, or questions. Verdicts err toward PROPOSED and NEEDS-FELIX; every proposed
   row tagged with its **Felix-cost** (none / gate:merge / gate:visual / decision /
   hands).
7. **The tick** (build): hourly, mortal, on Ava. (1) HALT? lease fresh? exit; take the
   lease (heartbeat file — stigmergy, no coordination service). (2) Read usage ×3,
   queue, boards-census, wedges. (3) Dispatch review gates for landed lanes (D44,
   unchanged law). (4) Dispatch the top item within budget + lane on the account the
   delta says to burn (D61 chains, unchanged; workers may carry `/goal`). (5) Intake.
   (6) Refresh the digest. Die. **The tick never builds — it routes and cuts.**
   Tick-vs-sitting staffing: idle ticks are cheap (the doorbell isn't the butler);
   judgment escalates to a Steward sitting at fable (Felix's ruling: the Steward IS
   fable — the mind, not the clock).

## 5. The morning digest — the waggle's destiny

D51 predicted its own fold ("sovereign-facing surfaces arrive waggled by default").
The digest: landed items one line each; gated items and questions as four-line
waggles; spend vs pace per account; the wedge ledger (every unforeseen permission
prompt → a one-click ruling: sign the allowlist entry or mark the class red). KPI
written down from day one: **Felix-minutes per landed row + defect escape rate** —
never tokens spent. WIP caps hard — twelve plausible PRs is a denial-of-service on
the sovereign.

## 6. The bottleneck ladder (solve each when it hurts — Felix, 2026-08-25)

1. **His keystrokes** (now: 343 rig fires in 18 days, all his finger) → the clock.
2. **His review-minutes** → lanes, ratchet, waggle density, WIP caps. Instrumented
   from the first shadow week, solved when it hurts.
3. **His taste bandwidth** → the taste corpus: harvest rulings (every countersign
   amendment is a labeled sample; the ISSUES redundancy-over-consistency entry is the
   proof the mechanism runs), exemplar pairs for the visual domain, distill when
   yellow wants to become green. Asymptote honesty: principles ~70%, exemplars ~20%,
   the rest is irreducibly him — that remainder is the throne's job description.

## 7. The path, when Felix calls it (and only then)

Shadow week first (the Steward plans only — proposes, reports, zero execution; the
calibration evidence licenses the hands), then yellow-lane PRs, then the ratchet.
Sequence: one GA sitting ratifies the five laws → a founding Architect raises the
night-shift building (its `dream.md` is Felix's 2026-08-24 stream, verbatim, if he
drops it) → shadow week on Ava → hands. The observatory trails behind (tmux mode for
cross-account attach incl. Ava over ssh; the city miniature renders from the census
trail — dessert). **Unparked by Felix's word, nothing else.** The pain signal is
already on the record: he is currently the scheduler, the router, and the intake of
his own city.

## 8. End states (the vignettes, kept)

A dropped bug report becomes a merged, staging-deployed fix with a regression test by
breakfast. Twenty messy PODS lines become three PRs and one taste-waggle with
mockups. A quiet night runs the chores lane and trues lying boards. A limit hit at
02:10 re-routes the chain to the account with headroom. A schema migration parks at a
red-lane waggle answerable from his phone. The morning throne room: six landed, two
gated, one question, four minutes. A Playwright before/after rides every visual PR.
Every wedge becomes a signed allowlist entry or a permanent red marker. A landed
finding in one theater cuts a proposed conformance row in another. `sync/check` red
files its own ISSUES entry and asks for his hand by name. A GitHub webhook triages an
issue into the queue before the tick even fires. And the miniature city glows where
the crews are working.
