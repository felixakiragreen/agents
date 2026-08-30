# C14 — the engine seams

**Status:** **LANDED 2026-08-30** — laid the same day · **Depends on:** — ·
**Staffing:** Builder · opus-high · **Blessed:** laid on D22's own text (the seams
charge leads — the G4 verdict, ruling 3); Felix's ignition is the arm (D11)

**Landed:** all four seams, every bar evidenced below. Barrage exit 0
(1000/1000 · 50/50 · 9/9, wall 149.4 s) on the settled tree; engine 77 + barrage
41 + console 26 + fake 60 tests green; four type gates 0; the rehearsal green on
`personal` with the account read off the run log. **Budget 6 real turns /
$0.3020 of ≤10 / ≤$1.** Eight findings below — F1 (a committed fixture had gone
stale unseen), F5 (the sweep's exemption the crash drill needs) and F7 (the
fidelity default's measured blast radius) are the ones the next hand wants.

## Mission

The four v3 deferrals D22 unfroze, all inside the engine's own walls — the
migration's opening charge. When this lands: (1) the run log names the account a
run rides — `ignited` carries the config dir, so a log alone re-opens a run;
(2) the trust read lives in its reserved home, `engine/venue.ts` — one
implementation in the city, no third copy; (3) the fake speaks the
answer-then-land arc, so `send <text>`'s landing verb is guarded at budget 0
forever; (4) the mutant drill sweeps its own subjects at exit. The deck is not
touched: C15 lands on these seams.

## Inputs — read before working

- [v3/README.md](../v3/README.md) — the fence (writes: `v3/**` + gitignored
  telemetry; this charge doc and the v3 deferred list are the two named
  exceptions), the clean room (C4 F0), the two-lane commit rule. The campaign
  note: [README §6](../README.md), the migration block.
- [C10's findings](../v3/plans/c10-console-demo.md) — F2 (answer-then-land),
  F4 (the 22 orphaned fakes), F5 (the run log cannot name the account), F6 (the
  trust read's second caller measured the pane instead of copying). Do not
  re-derive any of them.
- `v3/engine/log.ts:33` — the `ignited` event shape. `v3/engine/venue.ts` — the
  stub and the slot's own comment reserving it. `v3/lab/c8/accounts.ts` — the
  real trust read (`ACCOUNTS` · `configJson` · `trustedDirs` · `trusts` ·
  `precheckReal` · `venueOn`): the code that moves. `v3/console/runs.ts` — the
  `conditions.json` sidecar read this charge demotes (`:68–:75`, `:118`).
  `v3/fake-claude/scenarios/` + `goldens/` — 23 committed scenario/golden pairs;
  `scenario.ts` defines acts. `v3/barrage/mutants.ts` + `barrage/child.ts` — the
  drill that leaks `hang` fakes on early exit.
- C13's golden discipline: when a golden moves, the diff shows only what the
  change explains — re-record, eyeball, say so in findings.
- C13 F2's fidelity bar: the fake's stream must not be poorer than its
  transcript — a new scenario writes the report's closing pair in **both**.

## Spec

1. **The account on `ignited`.** The event gains `configDir: string` — the
   `CLAUDE_CONFIG_DIR` value `spawn.ts` selects the account with (the mechanism
   itself, not a display name — self-sufficient without any map).
   Written on every new ignition, real and fake (fakes record whatever dir the
   test hands them; the sandbox guard already refuses real dirs there). **Read
   side: absence is legal forever** — a pre-C14 log stays readable and stays
   undrivable, exactly today's lost-sidecar semantics; nothing backfills. The
   console resolves `send`/`summon`/`return`'s account from the log first, the
   `conditions.json` sidecar as fallback for pre-C14 runs; display names come
   from the reverse `ACCOUNTS` lookup where one matches, the raw path otherwise.
   `replay(log) ≡ state` holds on old fixture logs (absent field) and new ones
   alike; invariants move only if the schema forces it, and the barrage stays
   green.
2. **The trust read's home.** `ACCOUNTS`, `configJson`, `trustedDirs`, `trusts`,
   `precheckReal` (and `venueOn` if it belongs with them) move from
   `lab/c8/accounts.ts` into `engine/venue.ts` — the slot its comment reserves.
   The stub `precheckVenue` retires in favor of the real read as the default at
   ignite for real subjects; a test/fake override stays injectable — the barrage
   and the fake tests read no real config dir, ever. `lab/c8/accounts.ts`
   becomes re-exports (the dig's scratch keeps working; no second copy — C10 F6's
   whole point). The console's `summon` gains the pre-summon refusal C10 F6
   wanted: an unsummonable venue (untrusted cwd, C4 F8) refuses **before** the
   pane exists, in kind, naming the reason.
3. **The answer-then-land scenario.** One scenario file
   (`scenarios/answer-then-land.json`) + committed golden: act 1 reports
   `needs_input` (the engine pauses ‹needs-⬡ question› carrying the question),
   act 2 — fired by the resumed turn `send` drives — reports `done` with a
   distinctive marker; transcript AND stream carry the closing pair (the
   fidelity bar above). Engine + console tests drive `send <text>` through
   pause → answer → landing on the fake alone.
4. **The mutant drill sweeps its subjects.** The drill records what it spawns
   and SIGTERMs survivors on every exit path, early ends included (C10 F4's
   measured class: 22 orphans, hours old). A drill run that ends early leaves
   zero live fakes.

Implementation choices inside this spec are the Builder's; anything touching the
contract — the event schema beyond one field, a new verb, a deck file —
escalates.

## Done when:

- [x] `bun test` green across `v3/engine`, `v3/barrage`, `v3/fake-claude`,
  `v3/console`; all four type gates (`bunx tsc --noEmit`) exit 0 — outputs
  pasted.

```
$ cd belvedere/v3 && for d in engine barrage console fake-claude; do bun test $d/; done
engine        77 pass  0 fail
barrage       41 pass  0 fail
console       26 pass  0 fail
fake-claude   60 pass  0 fail

$ for d in engine barrage console fake-claude; do bunx tsc --noEmit -p $d/tsconfig.json; echo $?; done
engine       tsc exit 0
barrage      tsc exit 0
console      tsc exit 0
fake-claude  tsc exit 0
```

- [x] `bun barrage/run.ts --runs 1000 --crashes 50` exit 0 (1000/1000 · 50/50 ·
  9/9) on the settled tree — pasted; the standing regression (D22).

```
$ bun barrage/run.ts --runs 1000 --crashes 50            # exit 0
coverage over 1000 flows: 26279 steps (mean 26.3)
  gate or card    74.3%   (quota ≥20%)
  hazard subject  78.4%   (quota ≥30%)
  tight budget    13.1%   ·  blessed in halves  13.7%
  scenarios      23/23
barrage: 1000/1000 green
  cut families: before-ignite 13 · before-pause 11 · after-ignite 9 · before-card 6 · before-settle 11
  sizes 2–91 steps · 50/50 cuts fired
crash drill: 50/50 converged, zero double-ignitions
mutation check: nine planted law breaks, one per invariant class
  caught  orphan-terminal    invariant 6 nothing is in flight at a terminal state
          seed 2000002 · oracle named 6 · control green · swept 1
mutation check: 9/9 caught

barrage GREEN · 1000 runs · 50 cuts · 9/9 mutants · wall 149.4s
```

  **26,279 steps is C7's own number, to the step** — the 24th scenario row is
  drawn at weight 0 and moved no topology (F3).

- [x] A committed engine test replays a pre-C14 fixture log (no `configDir`)
  green: readable, verdicts unchanged, drive verbs refuse in kind — pasted.

```
$ bun test engine/test/compat.test.ts
 4 pass   0 fail   23 expect() calls
```

  `test/fixtures/pre-c14-run.jsonl` is the genuine article, frozen: 9 ignitions,
  every one with `configDir === undefined`; `invariants()` `[]`; terminal; 9
  turns; and `verdicts(fold(pre))` deep-equals `verdicts(fold(current))`. The
  drive half strikes `configDir` from the *current* log rather than using the
  frozen one, because the frozen one predates the step `prompt` field too and
  would prove two things at once (F1) — `rule(resume)` on it refuses *"only a
  paused step takes a ruling"*, `rule` on an unknown step refuses *"no such
  step"*. A fourth test asserts every **new** ignition carries the run's own
  config dir.

- [x] A console test drives a fake run with its `conditions.json` deleted:
  `send`/`return` resolve the account from the log alone — pasted.

```
$ bun test console/test/account.test.ts
 7 pass   0 fail   40 expect() calls
```

  The fixture's venue is deliberately **not** the run dir's sandbox
  (`<root>/account`, `<root>/venue`), so a fallback is visible as a wrong answer
  rather than a lucky one. With the sidecar deleted: `locate()` reports
  `venueFrom: "log"`, `send <text>` lands the step, and the resumed turn's
  transcript exists under the config dir the **log** named and does **not**
  exist under the sandbox `venueFor()` would have chosen. `summon` prints
  `CLAUDE_CONFIG_DIR=<root>/account` and `return` brings the step back to
  `landed done`. A sixth test takes the other side: a pre-C14 log over real
  subjects with no sidecar stays readable (`list`, `read` exit 0) and all three
  driving verbs exit 2 naming *"names no config dir"*.

- [x] The answer-then-land pair exists and is committed; the send→landing arc
  test passes on the fake with zero real turns — pasted.

```
$ bun test engine/test/answer.test.ts
 3 pass   0 fail   19 expect() calls

$ bun console/cli.ts send <run> ask "The release name is ANSWER-THEN-LAND." --run   (in-test)
console/three-moves/ask  paused ‹needs-⬡ question›  ->  landed done
    answer: ANSWER-THEN-LAND-OK
  ship             landed done
turns 4/6
```

  `fake-claude/scenarios/answer-then-land.json` + `goldens/answer-then-land.jsonl`
  (14 events). Act 0 pauses ‹needs-⬡ question› with the subject's own question as
  the detail; the resume it fires lands `done` carrying `ANSWER-THEN-LAND-OK`; one
  ignition and one resume on one session. C13 F2's fidelity bar is its own test:
  the `StructuredOutput` closing pair is in **both** turns' stream files and twice
  in the transcript, and the transcript slice past the recorded cursor still
  answers `done` for the turn that was fired. The 23 goldens recorded before it
  are byte-identical (`bun goldens.ts` → *23 match, 1 differ* before gilding).

- [x] A mutant-drill check (a test, or a measured drill run pasted) shows zero
  surviving subject pids after an early-ended run.

```
$ bun test barrage/sweep.test.ts
 2 pass   0 fail   9 expect() calls

# and in the wild, the same run as the barrage bar above:
  caught  orphan-terminal    invariant 6 …  control green · swept 1
$ pgrep -fl "fake-claude/cli.ts" | wc -l
       0
```

  Test 1 is the guard with its control: a log naming both a live `hang` fake and
  this test's own pid; `liveFakes` returns exactly the fake, `sweep` kills
  exactly the fake, and the test process is still alive afterwards. Test 2 is the
  bar itself: `barrage/one.ts` on seed 62 (its first root step runs `hang`),
  SIGKILLed the moment its log shows an ignition — **orphans measured alive
  first**, then swept, then zero.

- [x] `bun belvedere/v3/console/rehearsal.ts personal` green — and the account it
  drives with is read off the run log, not the sidecar (name how the assertion
  knows; deleting/ignoring the sidecar in the rehearsal's own run dir is the
  cheap proof). **Budget: ≤$1 / ≤10 real turns, either ceiling a ⬡-fork (D21).**

```
$ bun belvedere/v3/console/rehearsal.ts personal          # exit 0
THE BAR

  invariants          9/9 green
  terminal state      true · 3/3 landed
  the account, off the log
    conditions.json names no venue   true
    ignited.configDir                /Users/felix/.claude (true)
    summon carried CLAUDE_CONFIG_DIR /Users/felix/.claude (true)
  the round trip      headless-born true · TUI-born true
  answer              "REHEARSAL-ALPHA, REHEARSAL-BRAVO"
  five verbs          list · read · send · summon · return

  turns 24/30 (4 off-log) · cost $0.9124/$3
```

  **How the assertion knows.** The rehearsal now writes a `conditions.json` that
  carries provenance and **no venue at all** — no `account`, no `configDir`, no
  `workDir` — and the bar reads it back to prove that (`names no venue true`).
  With that sidecar silent, `readConditions` returns nothing and the console's
  only remaining sources are the log and the sandbox; the summon command it
  printed carries `CLAUDE_CONFIG_DIR=/Users/felix/.claude` into `env -i`, which
  the sandbox could never have supplied. The board's account column reads
  `personal` for the new run (reverse `ACCOUNTS` lookup off the log) **and** for
  the three rotated-aside pre-C14 runs (off their sidecars) — both paths visible
  in one listing.

  **Budget: 6 real turns and $0.3020 of the ≤10 / ≤$1 ceiling** — the C10 meter
  moved 18 → 24 turns and $0.6104 → $0.9124 across this charge's single pass
  (5 logged + 1 hand turn off-log). No ⬡-fork.

- [x] The v3 README deferred list trued: the four promoted items read exactly
  what shipped (the lay already struck them — correct the wording only if the
  build diverged); the sixth cut family untouched.

  Each of the four struck items now carries **LANDED** and what shipped. Two
  divergences from the lay's words are named there and in F6/F7 below: the
  precheck takes the venue and the subject rather than an account name (so the
  engine's `account` option retired), and the new scenario also carries the
  report's closing pair on the wire. The sixth cut family is untouched.

## Out of scope

- The deck — nothing under `glass/**` changes (C15's charge; the pre-summon
  refusal lands in `console/`/`engine/`, not the deck).
- The sixth cut family (its trigger is recorded: a third recurrence promotes it).
- Any new console verb; any engine behavior change beyond the four seams.
- Moving engine code out of `v3/`; renaming anything.
- Backfilling `configDir` into old run logs.

## Findings

**F1 — the committed demo fixture had been unloadable since the `prompt` field
landed, and nothing noticed.** C14 changed the event set, so `demo-run.jsonl`
wanted re-recording; freezing the old bytes first and then trying to re-open them
is what surfaced it:

```
$ bun -e 'compare fold(readLog("pre-c14-run.jsonl")).flow with parseFlow(flows/demo.json)'
false
at 207 …"scenario":"schema-done","seed":11}},"model":"sonnet"…
        ||| …"scenario":"schema-done","seed":11}},"prompt":"demo/prep","model":"sonnet"…
$ load(DEMO, { runDir })   # run dir holding those bytes
… was blessed on a different flow — amend and re-bless, never edit under a live log
```

The fixture's blessed flow carries no `prompt`, so invariant 8 refuses to re-open
it. It went unseen because the three tests that read it (`demo.test.ts`,
`invariants.test.ts`, and the corruptions cut from it) call `fold` / `invariants`
and never `load` — the read paths were all still true, so nothing shipped wrong.
The re-record fixes the current fixture; the old bytes are kept deliberately as
`pre-c14-run.jsonl` with their own provenance line, and the drive half of
`compat.test.ts` strikes `configDir` from the *current* log instead, so it tests
one variable. **A fixture that no test ever `load()`s can go stale silently — a
committed run log is only as current as the narrowest thing that reads it.**

**F2 — a re-record moves the parallel steps' interleaving, and that is not a
defect.** The re-recorded `demo-run.jsonl` has the same 39 events, the same 9
turns, the same ten verdicts and `invariants []`, but five events swap places:

```
DIFF (10,'turn-ended','fan-a') (10,'turn-ended','deny')
DIFF (11,'landed','fan-a')     (11,'paused','deny')
DIFF (16,'ignited','gate')     (16,'turn-ended','fan-a')
DIFF (17,'turn-ended','deny')  (17,'landed','fan-a')
DIFF (18,'paused','deny')      (18,'ignited','gate')
```

`replay.ts` says it in its own header — *"parallel steps finish in whatever order
they finish in, and the log records that order as fact"* — so the fixture is one
true snapshot, not a canonical one. C13's golden discipline needs the amendment
written down: for a **run log**, the diff that must be explainable is the shape
(events, turns, verdicts, invariants), never the byte order of concurrent steps.
Recorded in `PROVENANCE.md`.

**F3 — the 24th scenario row costs the fuzzer nothing, measured rather than
argued.** A weight in `barrage/scenarios.ts` changes `rng.weighted`'s walk and
re-shapes every seed, which would re-pin all nine mutant seeds; a weight of 0
leaves the total unchanged and is never returned (the row before it settles the
draw first). Measured both ways:

```
$ sha256 over topology(seed).text for 200 barrage seeds + the 9 mutant seeds + 2 crash seeds
before  8cbe777d7073c03acde0b28ef3f1d670ea915b023e89e90769b0b49808dfc055
after   8cbe777d7073c03acde0b28ef3f1d670ea915b023e89e90769b0b49808dfc055
$ barrage coverage line:  26279 steps  (C7's own number, to the step)
```

The cost is two filters — `run.ts`'s MISSING report and `topology.test.ts`'s
coverage quota now say *drawn* rows, and the quota test gained its negative
control (a weight-0 row must **not** appear).

**F4 — the sweep fired in the wild on its first barrage run, on exactly the
mutant that strands a subject by design.** `orphan-terminal` removes the law
*nothing is in flight at a terminal state*, so its run exits with a fake still
breathing — the leak C10 F4 measured, reproduced by the drill's own instrument:

```
  caught  orphan-terminal    invariant 6 …  seed 2000002 · control green · swept 1
$ pgrep -fl "fake-claude/cli.ts" | wc -l      # after the full 1000/50/9 run
       0
```

**F5 — the leak class is wider than the mutant drill, and the crash drill must
never be swept mid-run.** Phase 1 kills a run that passes its wall cap with
`SIGKILL` (`child.ts`), which orphans that run's subjects exactly as a mutant run
does; the natural-looking fix — sweep inside `runChild` — is **wrong**, because
the crash drill's cut run is *supposed* to leave an orphan alive for the restart
to adopt, and that adoption is C6 F2's ruled fix and C8's headline. So the sweep
is placed where nothing will be restarted: after a mutant's pair of runs, and at
`run.ts`'s own exit on every path (clean, throw, `SIGINT`, `SIGTERM`) — which
covers all three phases without touching the drill that needs its orphans. The
exemption is written into `sweep.ts`'s header so the next hand does not "fix" it.

**F6 — `options.account` was a second source of truth for the account, and it
agreed with the venue only by the caller's care.** The engine took both an
`account` name and a `venue.configDir`, and nothing reconciled them; the name was
read at exactly one line (`precheck(account, venue.workDir)`) and the config dir
is what actually selects the account (C4 F0). Handing the precheck the **venue
and the subject** instead removes the name, removes the option, and buys two
things the lay did not ask for: a fake subject is trusted by its arm rather than
by a stub, so no fake test can ever read a live config dir; and the console can
pass a venue resolved from a log without inventing an account name for it — which
is the whole reason the field went onto `ignited` in the first place. Four `lab/`
call sites dropped the argument; `lab/c8/accounts.ts` is re-exports.

**F7 — the fake's stream is still poorer than its transcript for 23 of the 24
scenarios, and closing it is a barrage-wide change, not a flag flip.** The
`report` step writes the closing `StructuredOutput` pair to the transcript only;
`streamsReport` puts it on the wire as well, and `answer-then-land` is the first
scenario to say true. Making it the default is one line, and its blast radius is
measured:

```
$ 4 of 24 scenario files carry a `report` step
  answer-then-land · schema-blocked · schema-needs-input · schema-done
$ fired steps over 1000 barrage seeds: 24492 · carrying a report scenario: 9004 (36.8%)
```

So the default flip re-records three goldens **and** changes the stream shape of
better than a third of every barrage run's turns — which is a thing to do with
the barrage's numbers re-measured on purpose, not on the way past. Left as C13
F2 left it, now with a number on it.

**F8 — a pre-C14 real run is undrivable, and the console now says so instead of
resuming into the sandbox.** Before this charge a lost `conditions.json` sent
`send`/`summon`/`return` at `venueFor(runDir)` — a config dir that holds no such
session — so the verb spawned, the resume failed at the door, and the step paused
‹dead›: a wrong answer dressed as an outcome. `drivable()` makes it a refusal in
kind, and only where it must be one: a **fake** run's sandbox is the correct
config dir, so layer-0 runs are untouched. This is the read-side half of "absence
is legal forever" and it is what the charge's third bar measures.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements; the migration
campaign note) and ~/code/agents/belvedere/v3/README.md (the fence),
and execute the charge at ~/code/agents/belvedere/plans/c14-engine-seams.md.
```
