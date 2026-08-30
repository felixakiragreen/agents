# barrage — the proving instrument

The campaign's fuzzer: a seeded topology generator, a driver that runs generated
flows through the real engine against the fake claude, crash injection at the
engine's own seam, the nine-invariant oracle, and the mutation check that proves
the oracle can fail. **One command, run unattended, over and over.**

```
bun barrage/run.ts --runs 1000
```

Exit 0 green, exit 1 with the red count. Built at
[C7](../plans/c7-fuzzer-barrage.md) over [the engine](../engine/README.md) and
[the fake claude](../fake-claude/README.md); serves campaign bars 1–3.

## The bet in one sentence

Everything a run is — its topology, its scenarios, its postures, its ceiling,
its blessed scope, and every ruling the harness makes — is a pure function of
one integer, so **a red reproduces from its seed alone**:

```
bun barrage/one.ts   --seed 12345 --run /tmp/red-12345
bun barrage/judge.ts --run /tmp/red-12345
```

That is why the draws come from *named* streams ([prng.ts](prng.ts)) rather than
one sequential generator: a sequential one would make every draw depend on every
draw before it, so adding a single call anywhere would silently re-shuffle every
topology — and the seed in a red file would stop meaning what it meant.

## The three phases

| phase | bar | what it asks |
|---|---|---|
| **the barrage** | 1 | ≥1,000 seeded runs, all nine invariants machine-checked per run |
| **the crash drill** | 2 | ≥50 seeded cuts: the engine SIGKILLed mid-flow, restarted, converging exactly on its own uncrashed run |
| **the mutation check** | 3 | nine planted engine law breaks, one per invariant class, each caught on its own class — with the same seed green unmutated |

## The pieces

**[topology.ts](topology.ts)** — `topology(seed)` → a flow file, byte-identical
per seed. Sizes 2–100 (a cube of the draw: small is the common case, 100 is the
tail). Edges are **forward-only by construction**, so no generated flow can
carry a cycle. Kinds, scenarios, models, postures, the ceiling and the blessed
scope are all drawn; `(haiku, auto)` never is, because it is refused at bless
and a refused blessing would test the generator rather than the engine.

**[scenarios.ts](scenarios.ts)** — the scenario table, one row per scenario in
the library: verdict class, whether a `result` reaches the stream file, what
`init` grants back, the timeout the row needs, its draw weight, and its act
count. **A weight of 0 is a row the generator never draws** — its properties are
still measured, but a weight on it would re-shape every seed's topology and
re-pin all nine mutant seeds for nothing.
C6 F7's warning made structural — every row is **measured** by
[scenarios.test.ts](scenarios.test.ts) through the engine's own `ignite()`, not
declared and hoped for.

**[driver.ts](driver.ts)** — law 2 made executable: the harness is the caller.
It blesses, ticks to terminal, and rules every gate, card and pause with seeded
choices — land / kill / resume — widening the blessing when the ceiling bites or
the scope was only half of the flow. Every choice is a function of *(seed, step,
attempt)* and never of the order things finished in, which is what lets runs
execute eight at a time and stay per-seed deterministic.

**[one.ts](one.ts)** — one run, one child process. Every run is a child, not
just the cut ones: the crash seam makes the engine SIGKILL *itself*, and a
parent that took that signal would prove nothing.

**[oracle.ts](oracle.ts)** — the nine. Seven are pure over the run log and live
in the engine's [invariants.ts](../engine/invariants.ts). Two cannot be:
**7 replay** needs the state the engine held, and **8 truth on disk** re-reads
every turn from *the subject's own stream file* and re-derives the verdict from
scratch. The engine may know **more** than the disk (it watched the clock, so it
may add ‹timeout›); it may never know less, and it may never land what the disk
says did not land.

**[crash.ts](crash.ts)** — the convergence oracle is the uncrashed run. The same
seed run straight through gives the terminal verdicts the cut run must reproduce
exactly: no golden file, no hand-written expectation, and it gets stronger every
time the generator learns a new shape. The cut point is drawn from the
**uncrashed run's own log**, so it is always a point the run actually reaches —
a drill of fifty cuts that never fired is fifty green runs pretending to be a
proof.

**[mutants.ts](mutants.ts)** — nine planted law breaks
([mutant.ts](../engine/mutant.ts)), each on a **pinned seed**, because a mutant
only fires where the topology gives it something to corrupt. Two things must
hold per mutant: the oracle reds naming that mutant's class, and the same seed
unmutated is green. `bun run.ts --pin-mutants` re-derives the seeds when the
generator changes shape.

**[sweep.ts](sweep.ts)** — nothing this command spawned outlives it (C10 F4: 22
`hang` fakes, hours old, from mutant runs). The run log is the register — the
engine wrote every subject's pid — so a SIGKILLed child's orphans are still
findable, and a pid is SIGTERMed only after `ps` says it is still the fake. The
mutant drill sweeps after each pair of runs, and `run.ts` sweeps on every exit
path including a throw and a `^C`. **The crash drill is deliberately exempt**
between its cut and its restart: adopting a live orphan is the thing it proves.

**[reds.ts](reds.ts)** — a red files to `reds/<phase>-<seed>.md` with its
invariants, its one-command repro and the generated flow. **Never to root
`ISSUES.md`** — the fence keeps a fuzz loop's hands off the protocol files, and
reds distill upward at review; that relay is how campaign bar 1's "every red
files to ISSUES with its seed" is met.

## The flags

```
--runs 1000        the barrage's run count      --seed-base 1
--crashes 50       seeded cuts                  --workers 8      (capped at 8)
--cap 60000        per-run wall cap, ms         --whole-cap      whole-barrage cap
--no-mutants       skip phase 3                 --keep           keep green run dirs
--root <dir>       telemetry root               --pin-mutants    re-derive the seeds
```

Telemetry — run dirs, logs, streams, transcripts — lands under
`summon/log/v3/barrage/` (gitignored) and green run dirs are deleted as they
pass. Nothing here writes outside that root and `reds/`.

## What it does not do

Real subjects (C8) · 100-simultaneous scale (C9) · the console demo (C10) ·
writing to root `ISSUES.md` · changing the fake's code (a topology needing that
is a finding and a stop, never an in-charge fork of C5's instrument).

## The bars, measured

`bun test` · `../../glass/node_modules/.bin/tsc --noEmit` · `bun run.ts` —
evidence pasted in the [C7 charge](../plans/c7-fuzzer-barrage.md).
