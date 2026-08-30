# C10 — the console demo

**Status:** LANDED 2026-08-30 · **Depends on:** C13 · **Staffing:** Builder ·
opus-medium (the cornerstone's own proposal — a thin surface over a proven
library) · **Branch:** none — serial sole lane, straight to `master`, explicit
paths · *Schedule: ignites after C9 lands — step 0 edits the engine C9
measures; the batch note carries it.*

## Goal

Campaign bar 6's instrument: **the thinnest possible surface over the engine's
own exports** — list live v3 sessions, read one live, send a turn, summon it to
a terminal, return it headless. `belvedere/v3/console/`, bun, library-first;
**not the deck** — no glass code, no HTTP, no UI polish: the piece Felix's hand
tests at G4, and every verb also drivable by script (the automation law,
cornerstone §6). Plus **step 0**: the fallback's pause vocabulary — C13 F3's
deferred two lines, built. Built to last, full directives. **Budget: ≤$3 and
≤30 subject turns** (dollars lead, C8 F9) — the scripted rehearsal's spend;
either ceiling is a ⬡-fork (D21).

## Inputs — read before working

- **Step 0's ruling (C13 F3, deferred to this lay):** `verdictFromTranscript`
  names `needs_input` and `blocked` from disk instead of collapsing both to
  ‹no report› — mirror the *stream* path's cause words exactly (`sense.ts` is
  the authority; one vocabulary, two sources). After it, transcript ≡ stream
  holds for every reporting state; C13's F3 table language gains a dated
  correction note, and the C13 fixtures already on disk are the red/green
  corpus (`real-c8-q5-question.jsonl` reads ‹no report› today — it must read
  the question).
- **The verbs' machinery all exists — compose, don't rebuild:** list = C8 F8
  (the run log locates every session) + C4 F9's liveness; read = the stream
  file / transcript + cursor (C11/C13); send = the engine's `rule()` on a
  paused step (answer / land / kill / re-ignite); summon = C8 F7's method
  (tmux `-L`, trust-warm venue — all three accounts trust `~/code/agents`,
  C8 F2); return = resume by the engine, the cursor counting the pane's rows
  (proven, C8 F7).
- **C8 F4 binds the surface:** `auto` is not a restrictive posture — wherever
  the console shows or picks a posture it must not dress `auto` as cautious;
  one honest line in `--help` suffices at this altitude.
- C12 F1 / C13 F5 — the archive and the account dirs are hidden trees; any
  walk passes dot flags.
- The fence: v3/** only; the deck (`glass/`) is never touched; the harness
  note (C6 F9's `!` protocol) for config-dir reads.

## The spec

- **`v3/console/` — one entry, five verbs**, each a thin call into engine
  exports (the library is the product; the console is a hand-hold, like
  `engine/cli.ts`):
  - `list` — every v3 run under a given telemetry root: run · step · session
    id · account · state · causes; live/dead marked (pid + run log).
  - `read <run> <step>` — the turn stream rendered human-readable (event type,
    text, report, causes), `--follow` tailing the live stream file.
  - `send <run> <step> <text|land|kill>` — a ruling into a paused step: an
    answer resumes the subject with the text; land/kill rule it. Refuses in
    kind on a step that is not paused (D10 — ambiguity never authorizes).
  - `summon <run> <step>` — materializes the session in a real terminal
    (prints the exact command; `--tmux` attaches via a private socket) and
    marks the step summoned.
  - `return <run> <step>` — resumes it headless by the engine; the cursor
    absorbs the hand turns.
- **Scriptable = testable:** every verb takes plain argv and exits nonzero on
  refusal; no prompts, no TTY requirement except `summon`'s attach.
- Fake-subject tests cover every verb's logic (budget 0 there); the **real
  rehearsal** is one scripted pass — a 3-step real flow (one step pausing
  ‹needs-⬡ question›): `list` shows it, `read` renders it, `send` answers it,
  `summon`/`return` round-trips it, terminal state reached. That script is the
  G4 rehearsal Felix's hand will re-run.

## Done when

1. **Step 0 evidenced:** `real-c8-q5-question.jsonl` re-derives to
   ‹needs-⬡ question› carrying the question's own words (red under the C13
   reader, pasted; green under this one); `blocked` likewise; every
   non-reporting scenario unchanged; C13's F3 language corrected with a dated
   note. ✓

   The red, on the parent engine — the test written before the fix
   (`bun test test/transcript.test.ts` at `2f2d4f0^`):

   ```
   85 | 	if (!v.land) expect(v.causes).toEqual(["needs-⬡ question"]);
   error: expect(received).toEqual(expected)
     [ -   "needs-⬡ question",  +   "no report", ]
   (fail) bar 1's control — a real C8 turn that asked a question is complete and still does not land
   (fail) step 0 — a needs_input report on disk pauses ‹needs-⬡ question› carrying the question
   (fail) step 0 — a blocked report on disk pauses ‹blocked›, and the two sources agree
    7 pass · 3 fail
   ```

   Green under this one, and the fixture's own words carried through:

   ```
   $ bun -e '…verdictFromTranscript(readTranscript("real-c8-q5-question.jsonl", 0))…'
   {"land":false,"causes":["needs-⬡ question"],"detail":"re-derived from the
    transcript: Need: (1) filename/path, (2) format (YAML/JSON/TOML/env/etc.),
    (3) target environment …, and (4) which actual config values/keys it should contain."}
   ```

   `blocked` likewise, and the two sources asserted **equal** rather than
   merely both-wrong (`step 0 — a blocked report on disk pauses ‹blocked›, and
   the two sources agree`, which compares `verdictFromTranscript` against
   `verdict()` on the same report). The non-reporting states are asserted
   unchanged — ‹no report› for a closed turn with no report, ‹dead› for a turn
   that never closed, ‹needs-⬡ permission› over a failed tool result, and a
   `done` report still lands (`step 0 — the non-reporting states are
   untouched`). C13's F3 gained its dated correction note (`2f2d4f0`), and the
   engine README's law 5 with it.

2. **Five verbs on fake subjects** — tests green, refusals in kind pasted. ✓

   ```
   $ cd console && bun test
   19 pass · 0 fail · 91 expect() calls   [815.00ms]
   ```

   Every refusal is the engine's own where the engine has one, handed through
   unre-worded (D10) — pasted from the tests' own assertions:

   ```
   send   on a landed step   exit 2  step plan is landed, and only a paused step takes a ruling
   send   on a summoned step exit 2  step ask is summoned — it is in a human's hands, and it
                                     comes back with `return`, not `send`
   send   with no ruling     exit 2  send wants a third argument: an answer, or the word land,
                                     or the word kill
   return on an unsummoned   exit 2  step ask is not summoned — a step the engine still holds
                                     is ruled with `send`
   summon on a step with no  exit 2  step ship has no session to summon — it is pending
          session                    (and no mark is written)
   read   unknown run        exit 2  no run at "console/nope" — neither a run dir nor one under …
   read   unknown step       exit 2  run console/three-moves has no step "nope" — it has
                                     plan, ask, ship
   read   turn never fired   exit 2  step ship has fired 0 turns — there is no turn -1 to read
   read   turn past the end  exit 2  no stream file for turn 9 of plan at …/plan.t9.jsonl
   ```

3. **The real rehearsal, one script, one pass** — all five verbs against a
   real 3-step flow, output pasted; session ids filed; subjects dead at
   landing. ✓

   `bun console/rehearsal.ts personal`, exit 0, `personal`, sonnet·low under
   `auto`, 2026-08-30T18:02:52Z, load 5.96 9.09 8.69. Full transcript of the
   pass under F1; the five verbs and the bar:

   ```
   1. $ bun console/cli.ts list
      rehearsal/plan  landed done                -  sonnet·auto  personal  79b5a12e-…
      rehearsal/ask   paused ‹needs-⬡ question›  -  sonnet·auto  personal  d4686398-…
          The release name was not provided and must not be invented — need it before drafting…
      rehearsal/hold  pending                    -  -            personal  -

   2. $ bun console/cli.ts read rehearsal ask
      rehearsal/ask  turn 0 of 1  paused ‹needs-⬡ question›
        init     posture auto · model claude-sonnet-5 · session d4686398-…
        tool     StructuredOutput {"answer":"What's the release name?","state":"needs_input",…
        quota    five-hour 12% · seven-day 50%
        output   Structured output provided successfully
        result   success · is_error false · denials 0 · $0.0507
        verdict  PAUSES ‹needs-⬡ question›
        detail   The release name was not provided and must not be invented — …

   3. $ bun console/cli.ts send rehearsal ask "The release name is REHEARSAL-ALPHA. …" --run
      rehearsal/ask  paused ‹needs-⬡ question›  ->  landed done
          answer: REHEARSAL-ALPHA
        plan             landed done
        hold             paused ‹needs-⬡ question›
      turns 4/8

   4. $ bun console/cli.ts summon rehearsal hold --tmux
      cd …/venue/personal && env -i HOME=… CLAUDE_CONFIG_DIR=/Users/felix/.claude \
        /Users/felix/.local/bin/claude --resume cabe13d8-… --model sonnet --effort low
      pane rehearsal-hold on socket v3 · trust dialog false
      | ❯ Remember this codeword exactly: REHEARSAL-ALPHA. You are writing the announcement's…
      marked summoned — `return rehearsal hold <text>` brings it back headless

   5. THE HAND TURN — typed into pane rehearsal-hold (Felix's, at G4)
      | ❯ The sign-off is REHEARSAL-BRAVO. Acknowledge it and stop.
      | ⏺ Acknowledged — sign-off signer: REHEARSAL-BRAVO. Stopping here.

   6. $ bun console/cli.ts return rehearsal hold "Report now. Set state to done. …" --run
      rehearsal/hold  summoned 2026-08-30T18:03:12.663Z  ->  landed done
          answer: REHEARSAL-ALPHA, REHEARSAL-BRAVO
      turns 5/8

   7. $ bun console/cli.ts list
      rehearsal/plan  landed done  -  sonnet·auto  personal  79b5a12e-ac84-4211-a1ff-d4c8730d923f
      rehearsal/ask   landed done  -  sonnet·auto  personal  d4686398-ee08-43b1-957b-7fd2fee501d6
      rehearsal/hold  landed done  -  sonnet·auto  personal  cabe13d8-cbb1-4cc0-a5a5-a9251b84c299

   THE BAR
     invariants          9/9 green
     terminal state      true · 3/3 landed
     the round trip      headless-born true · TUI-born true
     answer              "REHEARSAL-ALPHA, REHEARSAL-BRAVO"
     five verbs          list · read · send · summon · return
     turns 12/30 (2 off-log) · cost $0.4148/$3
   ```

   **The round trip is lossless in both directions on one session** (C8 F7,
   re-proved through the console): the codeword the *engine* gave `hold` at
   ignition and the sign-off a *human* typed into the pane both come back
   through a headless resume the engine fired, and the cursor absorbed the
   pane's rows without being told they existed.

   Session ids, `personal`, 2026-08-30 (run logs under
   `summon/log/v3/c10/`, gitignored telemetry, mortal):

   ```
   rehearsal    plan 79b5a12e-ac84-4211-a1ff-d4c8730d923f
                ask  d4686398-ee08-43b1-957b-7fd2fee501d6
                hold cabe13d8-cbb1-4cc0-a5a5-a9251b84c299
   rehearsal-1  plan 46e75171-7b76-4884-842c-5e163e394fd8   (the rotated first pass, F1)
                ask  dfc89af5-d7ef-4af4-93aa-9b260c123a85
                hold 15aa1cbf-0438-417d-9e56-13423d584e3d   (ruled killed from the console)
   ```

   Hygiene: no rehearsal subject alive (`ps` matched against all six session
   ids: none), `tmux -L v3 ls` → *no server running*, the venue is a gitignored
   dir inside the repo (`summon/log/v3/c10/venue/personal`) and `git status` is
   clean of it. The cmux desktop was never touched. The one paused leftover was
   ruled from the console itself — `send rehearsal-1 hold kill --note …` →
   `paused ‹needs-⬡ question› -> killed`, exit 0.

4. **Gates:** engine + barrage + fake-claude + console `bun test` green, type
   gates exit 0, `bun barrage/run.ts --runs 1000 --crashes 50` exit 0 —
   pasted. ✓

   ```
   $ cd engine      && bun test   64 pass · 0 fail · 420 expect() calls
                    && tsc --noEmit                              exit 0
   $ cd barrage     && bun test   38 pass · 0 fail · 14801 expect() calls
                    && tsc --noEmit                              exit 0
   $ cd fake-claude && bun test   59 pass · 0 fail · 296 expect() calls
                    && tsc --noEmit                              exit 0
   $ cd console     && bun test   19 pass · 0 fail · 91 expect() calls
                    && tsc --noEmit                              exit 0

   $ bun barrage/run.ts --runs 1000 --crashes 50
   barrage: 1000/1000 green
   crash drill: 50/50 converged, zero double-ignitions
   mutation check: 9/9 caught
   barrage GREEN · 1000 runs · 50 cuts · 9/9 mutants · wall 147.7s      # exit 0
   ```

   The barrage was run **twice** on the settled tree — once right after step 0
   landed (wall 147.5 s) and once at the end (147.7 s), both exit 0. Step 0
   moves a verdict the barrage exercises, and it moves nothing the oracle
   sees: 1000/1000 and 9/9 either side of it.

5. **Budget ≤$3 / ≤30 turns held**, spend pasted. ✓

   ```
   $ bun lab/c10/meter.ts
     5  $0.1987  rehearsal
     5  $0.2161  rehearsal-1

   turns 12/30 (2 off-log) · cost $0.4148/$3 (off-log turns uncosted)
   ```

   **12 of 30 turns and $0.4148 of $3** — 10 engine turns over two rehearsal
   passes plus 2 hand turns typed into panes. No ceiling approached, no
   ⬡-fork.

## Out of scope

The deck, glass, HTTP, the Chat, the Sidebar (post-verdict, D19) · auth ·
colors/polish · new engine features beyond step 0 · retention · G4's visual
pass itself (his hand, at the gate). **Creep is a bug.**

## Findings

*Code: [../console/](../console/) — `cli.ts` (the five verbs), `runs.ts`
(finding and reopening a run), `render.ts` (the stream, for a human), `summon.ts`
(the terminal and the mark), `rehearsal.ts` (the G4 pass), `test/verbs.test.ts`.
Meter: [../lab/c10/meter.ts](../lab/c10/meter.ts). Telemetry (run logs, streams,
conditions, the off-log tally): `summon/log/v3/c10/`, gitignored. Commits:
`2f2d4f0` step 0 · `0d6d76b` the verbs · `0818028` the rehearsal + meter ·
`67c2501` the README + the rehearsal's own repair.*

**No escalation.** Step 0 landed on its own red; the five verbs are green on
fakes and proven on real bytes in one pass; every gate is exit 0; the budget
held at 12/30 turns and $0.4148/$3. Six findings, none blocking, two of which
bind on anyone building the deck's session surface (F5, F6).

### F1 — the first rehearsal pass failed, and the failure was the script's prompt, not the console

Recorded in full because a green second pass hides the more instructive first
one, and because the engine's behaviour under it is the reassuring part.

Pass 1 asked the summoned step, on its way back headless, to report *"the
release name you were given earlier, and the sign-off you were just told."* The
release name was given to the **`ask`** step — a different session. `hold` had
never heard it, and correctly refused to invent one:

```
6. $ bun console/cli.ts return rehearsal hold "…the release name you were given earlier…" --run
   rehearsal/hold  summoned 2026-08-30T18:02:06.192Z  ->  paused ‹needs-⬡ question›
       You referenced a "release name you were given earlier," but none was ever
       provided in this conversation — please supply it.
   turns 5/8
   THE BAR
     invariants          9/9 green
     terminal state      false · 2/3 landed
```

**Two things worth keeping.** First, *a flow's steps share no memory*: each is
its own session, and a prompt that assumes another step's context is a prompt
that will be answered with a question. Obvious in the cornerstone and easy to
forget the moment a flow reads like a narrative — this is a Builder writing the
flow and getting it wrong on the first try. Second, and better: **the subject
asked instead of confabulating, and the engine paused instead of landing.** The
failure mode a headless runner should fear is a step that invents a plausible
answer and reports `done`; what happened is the pause the design is for, with
the cause naming the missing input verbatim. The repair was one sentence in
`rehearsal.ts` (`hold` now carries the codeword at ignition, C8 Q6's shape) and
the pass was re-run green.

*The rotated pass is kept, not deleted* — its streams are the only record of the
five turns the account paid for, and the meter reads them (`rehearsal-1`,
$0.2161). Its one leftover paused step was ruled from the console itself.

### F2 — the fake has no answer-then-land scenario, so that arc is proven only on real bytes

The console's most consequential verb is `send <text>`: it resumes a real
subject and the step lands on the resumed turn's report. On fakes, the arc is
unreachable — `schema-needs-input` scripts **one** act, and the fake throws when
a turn asks for an act it has no script for (`run.ts`: *"scenario … scripts 1
acts; turn 1 has no script"*), which the engine reads as ‹dead›. The multi-act
scenarios (`resume-chain-4`, `armb-paced-4`) report nothing at all, so they pause
‹no report› on every act.

So `console/test/verbs.test.ts` proves the resume *happens* (`turns 3/6`, a
second stream file at `ask.t1.jsonl`) and cannot prove it *lands*. The landing
is proven twice on real bytes in the rehearsal (`send` on `ask`, `return` on
`hold`).

**The gap is one scenario file** — two acts, `report needs_input` then
`report done` — plus its golden. Out of this charge's fence (the fake is C5's,
and a new scenario wants its golden recorded and the scenario table's count
moved), named here because it is the cheapest way to make an important arc
guardable at budget 0, and because the barrage would then exercise it forever.

### F3 — a summoned pane inherits the cmux shim on PATH; the binary is absolute, so the summon is clean

The command `summon` prints — the same argv `--tmux` runs — passes `PATH`
through from the console's own environment, exactly as the engine's `cleanEnv`
does for a headless subject (C4 F0 names HOME and `CLAUDE_CONFIG_DIR`; PATH is a
passthrough). On this machine that PATH begins with the cmux shim directory:

```
'PATH=/var/folders/…/cmux-cli-shims/FF3F6572-…:/Users/felix/.bun/bin:…'
… /Users/felix/.local/bin/claude --resume cabe13d8-… --model sonnet --effort low
```

**The summon itself is unaffected** — the binary is addressed absolutely from
HOME, which is the whole of C4 F0's third law, and the pane came up on the real
binary. What rides along is that anything *inside* that session which shells out
to bare `claude` resolves the shim, not the real binary. Not a defect of the
console (it inherits the engine's own rule and departing from it would be worse),
not exercised by anything here, and recorded because a summoned pane is the one
place in this design where a human's shell habits meet a clean room.

### F4 — orphaned fake subjects accumulate on the machine, hours deep

`ps` during hygiene found **22 live `fake-claude/cli.ts` processes**, ages 1 to 5
hours, all on mutation-drill seeds (`-p t2000002/s19 … --model opus`):

```
$ ps -eo pid,etime,command | grep -c '[-]-json-schema'      22
  ages: 01:07:11 … 04:54:22   (a few minutes to five hours)
  all: bun …/fake-claude/cli.ts -p t2000002/s19 --session-id … --model opus --effort high
```

They are **fakes — zero cost, no account touched** — and none belongs to a
rehearsal session (every one of the six rehearsal ids was checked against `ps`
and none is alive). They are almost certainly `hang`-scenario subjects from
barrage mutant runs, which by construction never write a result and never exit;
the engine SIGTERMs the ones it holds, and a mutant run that ends early does
not. Left untouched — the barrage is C7's and this is beyond the fence — but
they are processes and file descriptors that accumulate across every barrage run
on this machine, and C9 F4 measured the fd budget on the assumption they do not.
Worth a sweep line in the barrage, or a `pkill -f fake-claude` in whatever runs
it.

### F5 — the run log cannot name the account, so a second file has to

`CLAUDE_CONFIG_DIR` selects the account (C4 F0) and the `ignited` event records
`venue` — **the subject's cwd, and only the cwd**. Nothing in the run log says
which of three accounts a session belongs to, so nothing that reads a log alone
can reopen the run to rule it, resume it, or find its transcript.

C8's harness worked around this by writing `conditions.json` beside the log for
its own use; the console now *depends* on that file for `send`'s resume,
`summon` and `return` (`list` and `read` need only the log and the streams). It
is a real seam: **a run whose conditions file is lost is readable forever and
drivable never**, and the log's own claim to be self-contained (`log.ts`: *"a log
is judged from itself alone"*) is true of judging and false of driving.

The honest fix is one field — `configDir` (or the account's name) on `ignited`,
beside `venue` — which is an engine change beyond step 0 and therefore the
Architect's. Named here because **the deck will hit this on its first session
row**: it, too, will want to locate a session's transcript from a run log.

### F6 — the trust read still has no home, and the console measured instead of copying it

Whether an account has accepted a cwd decides whether a summon lands in a TUI or
in a dialog (C4 F8). `engine/venue.ts` reserves the slot and ships a stub; the
only real implementation is `lab/c8/accounts.ts`, inside a dig's scratch.

The console needed the answer and refused to make a second copy of a policy that
lives in an account's own `.claude.json`. It does the honest thing instead: it
opens the pane and **reads it back**, reporting `trust dialog false` from the
capture rather than predicting it from a config file —

```
pane rehearsal-hold on socket v3 · trust dialog false
| ❯ Remember this codeword exactly: REHEARSAL-ALPHA. …
```

— which is a measurement, cannot drift from the substrate, and costs one
`capture-pane`. It also cannot warn *before* the summon, only after, which is
the trade. Recorded so the next reader knows the omission is deliberate: the
trust read wants promoting out of `lab/c8/` into `venue.ts` before a third caller
needs it, and this charge is the second.

### The gauge, in passing

`read` renders `rate_limit_event`'s `unifiedWindows.*.utilization` on every turn
that carries one — the free in-band quota signal C9 F5 named for this charge —
and prints ALARM only when `status !== "allowed"`, which is C9 F1's correction
made structural rather than remembered:

```
quota    five-hour 12% · seven-day 50%
```

So `bun console/cli.ts read <run> <step>` is now the shortest standing answer the
Guild has to *"sessions cannot see /usage"*: any turn's stream carries the
account's five-hour and seven-day utilization, and reading it costs nothing.

---

```
You are a Builder at opus-medium.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c10-console-demo.md.
```
