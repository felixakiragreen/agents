# B11 — the arm and the engine

**Status:** LANDED 2026-08-28 · **Depends on:** P5; B10; B17 · **Staffing:** Builder · opus-high ·
**Blessed:** Architect, flow-cut sitting 2026-08-27 — the posture floor is
Felix's blessing item 2 (README §6 batch-4 note) and binds this row verbatim.

> **Re-seated 2026-08-27 (deck keel, BLESSED):** "the rendered page" below is
> **the Works** (B10 as re-seated) — the arm button lives in the Works'
> Action pane against a plan node, and only there; the bill's per-account
> usage comes **live** from B17's fetch module (never a stale log), hence the
> added dependency. Everything else — the tick, ready/landed law, pauses,
> HALT, timeouts, run-state — stands as written.

## Goal

D11 live: **one click on the rendered DAG arms the flow — the review of the
rendered plan IS the authorization** — and the engine runs the string: fires
declared steps through the existing hands, pauses at Felix-cards, on any
ambiguity (D10 wholesale), and on HALT; step timeouts; the DAG lights as it
runs. The Dispatcher's between-sessions logistics, mechanized
([flow-keel.md](flow-keel.md) §§1–2). No judge insertion, no plan growth —
B12's.

## Inputs — read before building

- [flow-keel.md](flow-keel.md) §§4–5 — D11, the physics. [B10's]
  (b10-flow-dag.md) landed schema, page, and run-state format — consume, don't
  re-derive.
- [P5's](p5-permission-physics.md) permission clause and trust precheck —
  applied **at arm time**: a step whose venue fails the precheck refuses the
  arm, loudly, naming the step (D10's family — never a silent mid-flow
  stall).
- `glass/hands.ts` — fire/worktree as internal functions: same audit, same
  unwind, same arming switch. **The fence gains no write class** (README §2):
  engine writes = hands calls + run-state appends in the census home (D6
  telemetry).
- P1's two-sensor law (census `Stop` + `kill -0`); P4 (restore semantics);
  B4/B8 (audit, unwind, HALT file at `summon/log/HALT`).
- `doctrine/` parse for board-row landing states (D65 — one parser).

## Spec

1. **The arm.** `POST /flow/<name>/arm` — credential-gated (the arming
   switch; an arm authorizes socket writes). Legal only from the rendered
   page (the button lives on `/flow/<name>` and nowhere else); the page at
   arm time already shows the whole DAG and the bill (B10). Arming records
   `{ev: "armed", hash}` — sha256 of the flow file — to run-state. **Armed
   flows are immutable:** on any later hash mismatch the engine pauses all
   *new* fires (in-flight sessions run on), renders the delta state, and the
   page offers **re-arm** — one click covers the amendment (D11). This is the
   step-arm base behavior; B12 adds the scope-arm auto-join per D12's
   ruling — build so that D12 is a flag B12 flips, not a rewrite.
2. **The tick.** A single engine pass inside the glass server, on an interval
   (5 s) and after every hands action: read flow file + run-state + census +
   HALT; compute each step's state; fire what is ready; append what changed.
   The tick is idempotent and single-flight (never two ticks interleaved);
   the walk/worker law binds (B8 F3 — nothing heavy on the request thread).
3. **Ready means:** every dependency landed · the step unfired · its gate is
   not an unpassed Felix-card · HALT absent (checked **immediately before
   every fire** — HALT's first consumer) · concurrency headroom
   (`flow.concurrency` caps engine-fired live sessions) · venue free —
   **master-venue steps are strictly serial per checkout** (single-writer
   physics); worktree steps may run parallel. Fires compose the worktree
   first when the venue says so (hands' existing path), then fire with the
   step's account/tier/permission clause; the run-state records
   `{ev: "fired", step, sid, workspace}`.
4. **Landed means (interim law, keel §5.1):** the fired session's census
   shows `Stop` as its last event **and** its pid fails `kill -0` OR its
   board row — when the step id is a row on this board — parses **LANDED
   clean** (state `LANDED`, via `doctrine/` parse). A session idle-at-`Stop`
   with a row not yet LANDED is *working-or-stalled*: after
   `step.timeoutMinutes` (default 240) it becomes `paused` with `why:
   "timeout"`. Anything malformed — row unparseable, session dead with no
   `Stop`, state `KILLED`/`BLOCKED` — is **paused + surfaced on the node**,
   never advanced past and never judged silently (B12 takes it from there;
   until B12, pausing is the whole behavior — pausing is cheap, wrong
   continuation is expensive).
5. **Pauses.** A reached Felix-card pauses its lane and renders his card
   (never auto-fired, never auto-passed — his click on the card's *pass*
   gesture, credential-gated, is the resume). D10: any parse ambiguity — flow
   file, run-state, a board row — pauses with the conflict named on the
   node. HALT: nothing fires while `summon/log/HALT` exists; the DAG says
   so. `paused`/`resumed`/`refused` all append to run-state with `why`.
6. **The engine kills nothing.** No hand stops a session; a timeout pauses
   the *flow's advance* and surfaces — stopping live work is Felix's or the
   session's own.
7. **Never exceed the posture.** The engine sets no permission posture beyond
   the account's own defaultMode; `bypassPermissions` never (the posture
   floor, blessed). The P5 clause is the whole vocabulary.

## Acceptance criteria — the DoD

All measured over HTTP against a live glass, evidence pasted; smoke sessions
are haiku-low in `~/code/agents` (trusted ×3 — B7 F1), ≤2 concurrent, every
workspace closed after (D55).

> **Tier amendment carried into this DoD (Felix, relayed at dispatch):** P5
> landed the load-bearing finding that **`--model haiku` cannot hold `auto`
> permission mode and fails to `default` silently**, so the two real-work steps
> below run at **sonnet·low** — the cheapest tier that holds `auto`, measured
> 6/6 (P5 Q2). Everything else in this order stands as written; the engine
> **refuses a haiku step at arm**, which is the same finding built rather than
> worked around.
>
> **Venue amendment (re-seat, applied):** there is no `/flow/<name>` page — the
> Works is a deck tenant, so every "the page" criterion reads as the Works in
> `/deck`, and the p95 bar is measured on `/deck/state?b=<building>` (B10's own
> re-seat, clause 4).
>
> Three runs, each independently re-runnable, each standing up its **own** glass
> on its own port against a temp census home, a temp flows dir and a temp fixture
> city — so the real `belvedere/flows/` is never the flows dir, nothing is ever
> appended to the real census, and **the HALT flag under test is a scratch one**
> (B8 F1). What is read live is the real census (symlinked in), because the
> liveness half of the landing law has to be real:
>
>     bun belvedere/lab/b11/probe.ts    16 checks — the arm's refusals, the arm pressed in Chrome, ALL GREEN
>     bun belvedere/lab/b11/lever.ts    10 checks — D10 · HALT · amend · re-arm · timeout, one live session, ALL GREEN
>     bun belvedere/lab/b11/smoke.ts     9 checks — the flow runs itself, two live sessions, ALL GREEN
>
> Pure reasoning is `glass/engine.test.ts` (44 tests): every branch of the
> landing law, the pauses, the concurrency cap, single-writer physics, the
> amendment lock, the join and idempotence.

- [x] **The smoke flow runs itself.** A declared 3-step flow — `s1` (Builder ·
  sonnet-low, master `~/code/agents`) → `s2` (Digger · sonnet-low, **worktree**
  venue) → `s3` (his card) — **armed by one click on the rendered plan in a real
  headless Chrome**, and then left alone. Step 1 fired through the existing hands
  (audit `fire` at `12:00:21.321Z`, `model sonnet effort low`, `workspace:86`,
  stamp `builder-smoke-02` — the same stamp in the run log), the census named its
  session, and the **first user turn IS the composed summons, byte-exact**, three
  ways:

      summons file  …/census/summons/builder-smoke-02.summons.txt   sha 7f91bd90e866f536   655 B
      transcript    ~/.claude/projects/-Users-felix-code-agents/55183f7f-….jsonl
                    first user turn                                 sha 7f91bd90e866f536   655 B
      the hands' own receipt                                        sha 7f91bd90e866f536

  Then the number this row exists to produce — **no human touch between them**:

      landing edge  2026-08-28T12:00:38.491Z   "the board row parses LANDED clean"
      fire audit    2026-08-28T12:00:39.004Z   workspace:87
      gap           0.513 s
      arm → step 2 fired, end to end: 18.1 s

  The landing was the **board's** word, made true by the session itself: the row
  it edited now reads `| S1 | … | Builder · sonnet-low | LANDED 2026-08-28 — step
  one did its work |`, and the file it wrote says `s1 did the work`. The
  Felix-card then **stopped the lane dead**: `paused, why "a Felix-card — his pass
  on the card is the resume; the engine will not open it"`, **2 fires in the whole
  hands audit** (2 expected), the drawn card carrying **0 buttons, 0 links, 0×
  `hands/fire` in its markup**, and the drawing reading `s1:landed/run
  s2:landed/run s3:paused/run` — the engine's log, not the board.
- [x] **HALT.** Set **through the glass's own hand** at a scratch venue
  (`POST /hands/halt` → `…/b11-lever-…/HALT`; the city's real
  `summon/log/HALT` asserted **absent** in the same breath). The next fire was
  refused — run-state `refused, why "HALT — 2026-08-28T11:53:41.430Z b11 lever
  probe"`, **nothing in the hands audit but the halt itself** (`["halt"]`), and
  the Works read the flag back in its own words. Cleared → the same step fired
  for real minutes later (below). The flag was removed in `finally`; the city's
  own is untouched.
- [x] **Timeout.** `timeoutMinutes: 1` against a session that had done its work
  and was sitting there: `paused, why "timeout — 1 minutes since the fire and
  nothing says it landed"`, the node surfaced, and **the session untouched** —
  `sid a2ff16c5-…, pid 43747, census state "working", kill -0 ALIVE`. The engine
  has no verb that stops a session (§6): `plan()`'s whole vocabulary is a run line
  and a fire.
- [x] **D10.** One unreadable line in the run log and **everything** stops: run
  `UNPARSEABLE → armed → paused("run-state unreadable: 1 line(s) will not parse —
  the engine advances nothing it cannot read")`, **no `fired` line, hands audit
  empty**, and the Works rendering the engine's own sentence. Not even the
  landing it would otherwise have recorded is written — asserted directly in
  `engine.test.ts` against a session the census had already buried. A flow file
  that stops parsing is the same value: armed, it pauses with the parser's
  sentence and fires nothing (`unknown-dep` refused at arm, probe §1).
- [x] **Amend + re-arm.** The flow file edited under an armed flow → `paused,
  why "amended since the arm — re-arm to authorize the change"`, no fire, and the
  delta on the page (`armed 8808fe196944… · on disk 0c9e8e190ce9…`). One re-arm
  carrying the new hash → `200`, and the step that D10, HALT and the amendment had
  each held **fired**. In flight runs on: a landing is still recorded while
  amended (pinned in `engine.test.ts`).
- [x] **Worktree venue.** `s2` declared `{kind: "worktree", repo: "~/code/agents",
  branch: "bv/b11-smoke-51201"}`. The **worktree was composed first, by the same
  hand** — audit `worktree` at `12:00:38.623Z`, before the `fire` at
  `12:00:39.004Z`, `path …/.claude/worktrees/bv/b11-smoke-51201` — the fire's own
  `cwd` argument is that path, and **the census's cwd for the session it opened is
  that path**, on its own transcript
  (`-Users-felix-code-agents--claude-worktrees-bv-b11-smoke-51201/460583f4-….jsonl`).
  Torn down in `finally`: workspace closed, `git worktree remove --force` exit 0,
  `branch bv/b11-smoke-51201: Deleted`, `worktree prune`.
- [x] **Arm refusal.** Four, each 409 and each naming the step, with **nothing
  written to the run log** in any of them:

      haiku    step h cannot be armed: haiku holds no `auto` permission mode on any account
               and fails to `default` silently (P5 F1/F5) — this step would stall at its
               first write. Refused at arm.
      trust    step c: personal has never trusted …/cold-repo (project …/cold-repo, a
               repository) — a fire there stalls on the folder-trust dialog with no
               transcript and no beat, and the glass never answers that dialog (B7 F1)
      parse    unknown-dep — …/broken.flow.json step b: depends on "ghost", which is not a step here
      stale    the plan on the page is not the plan on disk any more (armed what-the-pag…,
               disk dacdbba129d6…) — reload and read it again before arming

  Disabled hands: a second glass with no credential answers **503 `hands disabled
  — no credential at …`**, while the same page still renders the flow and reports
  `hands.armed=false`. The route is POST-only (405) and knows exactly two verbs
  (404 on a third).
- [x] **The gates.** `bun test belvedere/glass` → **530 pass / 0 fail in one
  process** (21 files, 1400 assertions); `bunx --offline tsc --noEmit` → **exit 0**.
  Cost, B3's 20-request protocol (2 s apart) **with the engine ticking under it**:
  `/deck/state?b=…` `n=20 min=1.8 p50=153.3 p95=162.6 max=200.2 ms` against the
  500 ms bar. Predecessor probes re-run whole: **B13 · B14 · B15 · B20 · B10 ALL
  GREEN, five for five** (B10's own probe amended — see F1). B17's probe fails two
  live-quota assertions **at its own landing commit** and is filed to ISSUES, not
  fixed here.

## Out of scope

- Judge auto-fire, scope-arm auto-join, plan growth (B12).
- Killing or signalling sessions; editing boards, ledgers, flows, or any
  truth file (forever-class, README §2).
- Account arbitrage (accounts are declared per step; the engine never
  chooses).
- Any richer landing grammar than §4's interim law — `holds` is canon's
  (keel §6); the interim classifier's misses become G2 evidence, not local
  patches.

## Findings

**F1 — an `armed` line in a run log is now a live authorization, and the chain's own
fixtures carry them.** B10 wrote `{ev: "armed"}` into `lab/b10/probe.ts`'s fixture run
log to exercise `armedAt`'s rendering, and at B10 that was inert: nothing consumed it.
It is not inert any more. Every probe in this chain stands up a **real glass**, and a
real glass now runs an engine, so B10's probe armed its own fixture flow — and the first
thing the engine did was pause `b2`, whose fixture session ends with `SessionEnd` and no
`Stop` (§4's malformed-landing branch, exactly right), which destroyed the ring B10's §5
measures. Nothing fired, by luck rather than design: `a1` was board-landed, `b1` was in
flight, and the only step that could have become ready sat behind a Felix-card. **The
general rule this makes: a fixture that writes `armed` is ordering a dispatch.** Fixed in
B10's probe by dropping the line with the reasoning at the line (the rings come straight
off the log either way, and `armedAt` is asserted in `glass/flow.test.ts`, over a fixture
nothing serves). B10's two `.slot` placeholders — *"dispatch — B11 arms this step"* and
*"customize — the composer moves into Action at B17"* — were amended in the same pass,
because both rows have landed and a slot still promising them is a lie; what that
assertion protected (`jump === 0`: a node not in flight offers no control reaching a
hand) is unchanged and still checked.

**F2 — a fire returns a workspace and no session id, so the engine writes `fired`
twice.** `POST /hands/fire` answers `{workspace, summonsPath, sha, bytes}`; claude mints
its own session id inside the spawned process, and nothing hands it back. The join has to
be the **name-stamp** — the engine mints one per fire, cmux titles the workspace with it,
and the census reads it off the transcript's `agent-name` record (B2 F1's window). So a
`fired` line records `{workspace, stamp, sid: null}`, and the tick that first finds the
stamp in the census appends **one more `fired` line carrying the sid** — the same event,
finer, `RING_OF` unchanged, and never a third time. Measured end to end: `stamp
builder-smoke-02 · workspace workspace:86 · sid 55183f7f-…`, **7.2 s** between the two
lines. The alternative — resolving `workspace:N → uuid` over the socket every tick — was
rejected as a spawn per tick for a fact the census already carries, and P6 F2 makes a
stale `workspace:N` the misdelivery class anyway. **What this binds: anyone reading a run
log must take the LAST `fired` line for a step, never the first** (`stateOf` already
does), and the first one is the one whose `ts` starts the timeout clock.

**F3 — the arm hashes the resolved flow, not just the flow file, and B10 F2 is why.**
The spec says *"sha256 of the flow file"*. A `{doc, fence}` kickoff is a **positional**
reference (B10 F2), so an edit to the *order document* re-points it with the flow file
untouched — and an arm that covered only the file would authorize bytes nobody re-read,
which is the precise hazard B10 named and could not close. `Flow.hash` is therefore
sha256 over the file's own bytes **and** every resolved kickoff, NUL-separated, computed
at the parse boundary. It is strictly stronger than the letter (any file edit still trips
it, whitespace included) and it is pinned by a test that moves only the quoted document.
The consequence worth naming: **a reformat of a flow file re-arms it**, which is the
right side to err on for an object whose whole job is to be immutable once armed.

**F4 — the board lands a step the engine never fired, and writes nothing when it does.**
§4 gives two landing sensors and §3 requires "the step unfired", and the two read
together decide what happens when a flow is armed over rows that are **already LANDED** —
which is the normal case for `flows/flow-batch-1.flow.json`, whose `p5` and `b10` landed
days ago. A landing test applied only to fired steps would have re-fired both. So the
board's word lands a step for **readiness** whether or not the engine fired it, and in
that case **nothing is written to the run log**: a ring sourced from the board is not
evidence the engine ever spoke (B10 F4), and writing one would make `ringOf` claim
`from: 'run'`. Same reasoning, one state further: a row the engine never fired that says
**IN FLIGHT** *holds* the step — somebody is already on it, two readings disagree about
whether it needs starting, and firing over a live session is the wrong continuation D10
exists to prevent. `KILLED`/`BLOCKED` hold it too. All three are said on the node in
Action, read off the row the drawing already joined.

**F5 — an unruled escalation on a LANDED row pauses, per the keel rather than per §4's
list.** §4 names *"row unparseable, session dead with no `Stop`, state `KILLED`/`BLOCKED`"*
as the malformed set; keel §5.1, which §4 cites by name, adds *"anything malformed **or
escalation-marked**"*. Built to the keel: a `LANDED` row raising an `E<n>` that nothing
says was ruled pauses with the id named, using `attention.ts`'s own detector (B14 F2's,
measured at 0 false positives over 458 live rows). This is exactly the state B12's
reactive gate converts into a judge fire — until then, pausing is the whole behaviour, as
§4 requires. **B3's own landing is the case in point**: it landed with two escalations
pausing the chain, and a naive engine fires over it (keel §5.1's opening sentence).

**F6 — `~/` never leaves the parse boundary any more.** A `Venue` carried `~/code/agents`
verbatim, which is how the corpus writes a path and not a path: the trust precheck, the
worktree hand and the fire's `cwd` all take one, and three call sites each expanding a
string is three chances to forget. Resolved in `flow.ts`'s `venue()` (directive 2.2), and
the rendering puts the `~` back through a new `tilde()` in `html.ts` — **home**-relative,
not city-relative, because a venue may sit outside the city and `short()` would render
`~/code/agents` as `agents`. One assertion in `flow.test.ts` moved with the reasoning at
it; the venue *phrase* the Works draws is byte-identical to what B10 landed.

**F7 — the tick is cheap when nothing is armed, and that is a design constraint, not an
accident.** A pass reads the flow files and their run logs first and **returns before
touching the census, the register, the socket or the credential** if no flow is armed —
which is the city's state today and every day nobody has clicked. Only an armed flow pays
`readCensus()` + `city()` (~40 ms, B14 F8's own figures) once per five seconds. Measured
with an armed flow ticking under the deck's own poll: `/deck/state?b=…` **p95 162.6 ms**
against the 500 ms bar, unchanged from B18 F4's identity-read cost. The engine's clock is
started by `server.ts` and **only** by `server.ts` — a module-scope `setInterval` would
drive Felix's real desktop from any test process that imported `engine.ts`, which is B8
F1's lesson one door further along, and `engine.test.ts` points `BELVEDERE_ENV` at a path
that does not exist as its own guard.

**F8 — `lab/b17/probe.ts` fails two live-quota assertions at its own landing commit, and
it is filed rather than fixed.** An account with no *session* window in flight makes the
rig's `summon-usage` print eight cells while the deck prints nine, one `null`; the two
agree (`thg-fgreen sess —` on both sides) and the probe's list-equality fails anyway.
Attributed rather than assumed: both failures reproduce byte-for-byte from a detached
worktree at `6cd3614`, which carries none of this row's code. Filed to
[ISSUES](../ISSUES.md); the fix is a per-(account, bucket) comparison, not a looser count,
and it is B17's ground.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/flow-keel.md,
and ~/code/agents/belvedere/plans/b11-flow-engine.md,
and build it to its DoD.
```
