# C7 — the fuzzer + the barrage

**Status:** LANDED 2026-08-30 · **Depends on:** C6 · **Staffing:** Builder · opus-high · **Spec blessed:** rides the BLESSED cornerstone §8 arc (⬡✓ 2026-08-29); pre-chewed and laid by the board's Architect, 2026-08-30 · **Branch:** none — serial sole lane, straight to `master`, explicit paths

## Goal

`belvedere/v3/barrage/` — the campaign's proving instrument: a seeded topology generator, a driver that runs generated flows through the real engine against the fake claude, crash injection at the engine's own seam, the nine-invariant oracle, the mutation check, and **one command an agent runs unattended, over and over** (the automation law, cornerstone §6). Serves campaign bars 1–3. Plus **step 0**: the durable stream — C6 F2's ruled fix, built. Built to last, full directives. **Budget: 0 real `claude` turns** — layer 0 only; any real spawn is a ⬡-fork.

## Inputs — read before working

- **The ruling (C6 F2, ruled 2026-08-30):** law 1's state tuple is now **(flow file + run log + stream files + transcripts)**. Full text in [c6-engine-core.md](c6-engine-core.md) under F2. Step 0 builds it.
- **The engine:** [../engine/README.md](../engine/README.md); import `engine.ts`, `invariants.ts`, `replay.ts` — the library is the product, the CLI is a hand-hold. The crash seam is `V3_ENGINE_CRASH_AT` ([../engine/crash.ts](../engine/crash.ts)); its five cut-point families in `engine.ts`: `before-ignite:` · `after-ignite:` · `before-settle:` · `before-pause:` · `before-card:` (each suffixed `<stepId>`).
- **C6 findings that bind here:** F5 (the reading rides `turn-ended`; nothing is re-observed), F7 (transcript completeness is a declared scenario property — the table below), F8 (the eleven events; `resumed` ≠ `ignited`; budget counts ignitions **and** resumes; no `amended` — D12 deferred, the only amendment is a budget re-blessing), F9 (the classifier blocks fixture commits — see the harness note).
- **The fake:** [../fake-claude/README.md](../fake-claude/README.md) — 23 scenarios, seeded, p50 16 ms. C5 F5: same seed ⇒ same session id; the engine already passes `--session-id`, the fuzzer just varies seeds freely.
- **The law:** [../cornerstone.md](../cornerstone.md) §5 (the nine), §6 (the mutation law, the automation law, the spend law); [../README.md](../README.md) — the fence.

## The spec

### Step 0 — the durable stream (the ruled F2 fix)

`spawn.ts` writes each turn's stdout to a **stream file** under the run dir (e.g. `<runDir>/streams/<stepId>.t<n>.jsonl`) instead of a pipe; sensing reads the file (tail it — pause causes must still surface within one engine tick, invariant 5). The child owns the fd, so the stream survives the engine's death. Restart re-derivation goes **stream-file-first**: the file is complete iff it carries a `result` row (parse rule 1); only a torn stream falls to the transcript's worked/denied/dead. A still-running fired step found at restart re-arms its full `timeout_ms` — conservative and bounded. stderr's disposition is the Builder's call. Update `engine/README.md`'s law 1 in the same commit; update C6's drill assertions where semantics changed — the mid-turn cut on a step *with* a report (e.g. `schema-done`) now converges to **landed**, the state the pre-fix engine could never reach after a mid-turn death. Delete no test without naming why.

### The generator

`topology(seed, size)` → a valid flow file. Seeded PRNG, **same seed ⇒ byte-identical flow file**. Sizes drawn 2–100 steps; edges forward-only by construction (no cycles); free parallel width; step kinds mixed. Coverage quotas per 1,000 runs: every scenario in the table appears; ≥20% of flows carry a gate or card; ≥30% carry a denial/death/timeout scenario; some flows carry `budget` below their step count (exercising `ceiling` + re-blessing — the only amendment shape, F8). Rulings, scenario picks, and seeds all derive from the run seed: **a red reproduces from its seed alone, one command.**

### The scenario table (F7, ruled into shape)

A declared table in the fuzzer source, one row per scenario ×23: verdict class (worked / denied / dead / hang) and whether its `result` reaches the stream file (`die-*` never write one). After step 0 the transcript-completeness column governs only the torn-stream fallback; the barrage must still exercise that path (the `die-*` scenarios do it naturally). Extending the library with **new scenario JSON files** is in-scope when the generator needs a shape — each with its committed golden per C5's law; changes to the fake's *code* are out of scope, filed as findings.

### The driver + the scripted ruler

Law 2: the harness is the caller. The driver blesses, ticks to terminal, and rules every ‹gate›, ‹card›, and pause with seeded choices — land / kill / answer / re-ignite via `--resume`. Runs may execute in parallel, each in its own run dir, **≤8 workers** — per-seed determinism must survive parallelism. Every run wears a wall cap (default 60 s, tunable); a run over cap is itself a red. Telemetry — run dirs, logs, streams — is gitignored, never committed.

### The oracle

Per run, all nine (cornerstone §5): `invariants(log)` covers its classes; the two living outside the log module are named here — **7 replay:** `replay(log) ≡ state()` at terminal, plus the crash-redo convergence below; **8 truth on disk:** every step's terminal verdict re-derived from its stream file + transcript alone matches the log (C6 bar 8's machinery, generalized), and zero surviving subject pids at terminal (shared with 6). Any red files to `barrage/reds/<seed>.md` — seed, invariant, one-command repro — **never to root `ISSUES.md`** (the fence; F9's evidence). Reds distill upward at review; that relay is how campaign bar 1's "filed to ISSUES" is met.

### Crash injection (campaign bar 2)

≥50 barrage runs each take one seeded cut: a point drawn from the run's enumerable cut points (the five families × the flow's steps), driven through `V3_ENGINE_CRASH_AT` with the engine as a child. **The convergence oracle is the uncrashed run:** the same seed runs uncrashed, and the restarted run's terminal state must equal it exactly — determinism makes the golden free. Plus: restart exits 0, `invariants` green, zero double-ignitions, exactly one `blessed`.

### The mutation check (campaign bar 3)

A `V3_ENGINE_MUTANT` seam mirroring `crash.ts` — one line per site, inert without the env var; a patch-based scheme is refused (a dirty tree mid-run breaks the two-lane commit rule). Nine named mutants, one per invariant class, each a deliberate law break — e.g.: 1 double-ignite · 2 ignite before an edge lands · 3 ignite past an unruled gate · 4 ignite outside the blessed scope · 5 strip a pause's causes · 6 declare terminal with a step in flight · 7 act on a transition before appending it (replay diverges) · 8 log `landed` on a denied reading · 9 ignite past the ceiling. Each runs under the barrage: the oracle reds it **naming the right invariant**; the unmutated barrage stays green.

### The one command

`bun barrage/run.ts --runs 1000 [--seed-base N]` — generate, run, check, file; exit 0 green, exit 1 with the red count. Whole-barrage wall cap enforced; wall time reported.

### The harness note (F9)

The classifier may block `git add` of generated fixtures and reds. Do not grind: finish the work, list the exact blocked paths in the landing, Felix runs the adds by hand (`!`).

## Done when

1. **`bun test` green across engine + barrage, `tsc --noEmit` exit 0.** ✓

```
$ cd engine && bun test                       $ cd barrage && bun test
 49 pass                                       37 pass
 0 fail                                        0 fail
 266 expect() calls                            14797 expect() calls
Ran 49 tests across 7 files. [21.78s]         Ran 37 tests across 4 files. [19.76s]

$ ../../glass/node_modules/.bin/tsc --noEmit  # engine  -> exit 0
$ ../../glass/node_modules/.bin/tsc --noEmit  # barrage -> exit 0
$ cd fake-claude && bun test                  # untouched, still 59 pass / 0 fail
```

2. **Step 0 evidenced.** ✓ Stream files on disk at `<runDir>/streams/<stepId>.t<n>.jsonl` (stderr beside them as `.err`), the child owning the fd. `engine/README.md`'s law 1 now reads *(flow file + run log + stream files + transcripts)* — updated in the step-0 commit. The drill ([engine/test/crash.test.ts](../engine/test/crash.test.ts), **10 pass / 0 fail**) cuts at **seven** named points and adds the three assertions the ruling bought:

   - `after-ignite:prep` — a mid-turn cut on a step that **reports**: `turn-ended.sensed.source === "stream"` and the step converges to **landed**, `report.state === "done"` — the state the pre-fix engine could never reach after a mid-turn death.
   - `after-ignite:orphan` — the orphan finishes while the engine is dead and is read from its **stream file**, still pausing ‹no report› (the scenario never reports). C6's assertion that this read `transcript` is replaced, and the drill flow gained a `dead` step so the fallback keeps its own test:
   - `after-ignite:dead` — `die-137` writes no `result`, so the stream is torn and only then does the transcript answer: `source === "transcript"`, paused ‹dead›. **Only a torn stream falls to the transcript.**

   Every cut also converges on `verdicts()` of the **uncrashed** run of the same flow — the drill's own oracle, adopted from C7's.

3. **Determinism, ≥3 seeds ×2 runs each, under parallel workers.** ✓ [barrage/determinism.test.ts](../barrage/determinism.test.ts) runs seeds 4 · 12 · 33 twice each, **all six children at once**, and asserts per seed: identical `flow.json` bytes from two separate processes, identical terminal verdicts, and zero reds on both. The run *log* is deliberately not compared — parallel steps finish in whatever order they finish in, and the log records that order as fact.

4. **The scenario table: all 23 classified, measured.** ✓ [barrage/scenarios.ts](../barrage/scenarios.ts) declares verdict class, whether a `result` reaches the stream file, what `init` grants back, the timeout the row needs, its draw weight and its act count; [scenarios.test.ts](../barrage/scenarios.test.ts) **spawns every row through the engine's own `ignite()`** and checks all of it (23 row tests + 2 table-shape tests). Measured: **18 worked · 3 denied · 1 dead · 1 hang**; `result: false` on exactly `die-137` and `hang` — the two rows the torn-stream fallback exists for. `plan-noop` grants back `plan` and `permission-denial` / `posture-mismatch` grant `default`, so those three always carry ‹posture›.

5. **The barrage — campaign bar 1.** ✓ One command, exit 0.

```
$ bun barrage/run.ts --runs 1000 --crashes 50
barrage: 1000 runs from seed 1, 8 workers, 60s per run
  1000/1000 runs · 0 red · 107.7s

coverage over 1000 flows: 26279 steps (mean 26.3)
  gate or card    74.3%   (quota ≥20%)
  hazard subject  78.4%   (quota ≥30%)
  tight budget    13.1%   ·  blessed in halves  13.7%
  scenarios      23/23
barrage: 1000/1000 green
```

   Sizes 2–100, mean 26.3 — **26,279 generated steps**, every one of the nine invariants checked per run. `reds/` is empty because nothing red.

6. **Crash-redo — campaign bar 2.** ✓

```
crash drill: 50 seeded cuts, each converging on its own uncrashed run
  cut families: before-ignite 13 · before-pause 11 · after-ignite 9 · before-card 6 · before-settle 11
  sizes 2–91 steps · 50/50 cuts fired
crash drill: 50/50 converged, zero double-ignitions
```

   All **five** cut families, sizes 2–91 (≥3 sizes), **50/50 cuts actually fired** — the point is drawn from the uncrashed run's own log, so it is always reachable. Each restart: exit 0, `invariants` green, exactly one `blessed`, no step ignited twice, and terminal verdicts **equal to the uncrashed run's, exactly**.

7. **Mutation — campaign bar 3.** ✓ 9/9, each on its own class, each with the same seed green unmutated.

```
mutation check: nine planted law breaks, one per invariant class
  caught  double-ignite      invariant 1  seed 2000000 · oracle named 1, 2, 7, 9 · control green
  caught  edge-jump          invariant 2  seed 2000000 · oracle named 2       · control green
  caught  gate-lands-itself  invariant 3  seed 2000006 · oracle named 3, 8    · control green
  caught  scope-jump         invariant 4  seed 2000011 · oracle named 4       · control green
  caught  mute-pause         invariant 5  seed 2000000 · oracle named 5, 8    · control green
  caught  orphan-terminal    invariant 6  seed 2000002 · oracle named 6       · control green
  caught  act-before-append  invariant 7  seed 2000000 · oracle named 7       · control green
  caught  land-denied        invariant 8  seed 2000002 · oracle named 8       · control green
  caught  past-ceiling       invariant 9  seed 2000014 · oracle named 9       · control green
mutation check: 9/9 caught

barrage GREEN · 1000 runs · 50 cuts · 9/9 mutants · wall 147.6s
$ echo $?
0
```

   The seam is inert without the variable: the unmutated barrage above is 1000/1000 green, and every mutant's own seed is green as a control. Collateral classes are named honestly in F6.

8. **Budget 0 held — zero real `claude` invocations.** ✓ Three process-spawn sites exist in the whole of engine + barrage, and none of them is `claude`:

```
$ grep -rn "Bun.spawn" engine/*.ts engine/test/*.ts barrage/*.ts
engine/spawn.ts:98        Bun.spawn([process.execPath, FAKE_CLI, ...argvFor(i)]   -> fake-claude/cli.ts
barrage/child.ts:26       Bun.spawn([process.execPath, ONE, ...])                 -> barrage/one.ts
engine/test/crash.test.ts:36                                                      -> engine/cli.ts
```

   No reference to `~/.local/bin/claude` or any real binary anywhere in the charge's tree.

## Kill criteria

- **The engine is broken, not under-fuzzed:** if ≥5% of the first 200 barrage runs red on the same invariant class, stop the barrage — file the smallest red seed, land what stands; the fix is a new charge, never a mid-charge engine rework beyond step 0 and the seams.
- **The fake can't say it:** a topology shape needing fake-claude *code* changes (not a new scenario file) is a finding + a stop on that shape, never an in-charge fork of C5's instrument.

## Out of scope

Real subjects (C8) · 100-simultaneous scale (C9) · the console demo (C10) · auto-filing to root `ISSUES.md` (the fence) · engine features beyond step 0 and the mutant seam · D12 scope growth · retry policies. **Creep is a bug.**

## Findings

**F1 — one of the twenty-three scenarios lands without a ruling.** `schema-done` is the only row whose report says `done`; every other row pauses. So at layer 0 a generated flow advances almost entirely on **the harness's rulings**, not on its subjects — the ruling policy is load-bearing coverage, and a topology's depth is exercised because the driver lands paused steps, not because subjects finish. Measured in the table (bar 4: 18 worked / 3 denied / 1 dead / 1 hang, and only one `report.state === "done"`). Named because the balance inverts at C8: real subjects land on their own, and a C8 flow that lands nothing is a signal rather than a shape.

**F2 — a `--resume` past a scenario's last act is a subject that dies at the door, and 19 of 23 scenarios script one act.** The fake refuses the turn and writes **nothing** to the stream:

```
$ cat streams/s02.t1.err
error: scenario multi-tool scripts 1 acts; turn 1 has no script
$ wc -c streams/s02.t1.jsonl
0
```

A driver that resumes uniformly makes nearly every resumed turn a death, so the *worked* resume path goes unfuzzed. Resolved inside the fence: the table carries each row's act count (checked against the scenario file), and the driver resumes multi-act rows at 0.35 and single-act rows at 0.1 — both shapes are real, one is not worth a third of the rulings. The durable fix is **more multi-act scenarios**, and that is C5's instrument to extend, not this charge's (kill criterion 2).

**F3 — the transcript fallback is not turn-addressable. Filed, not built.** The transcript is one file per *session* with no turn index in it, so `readTranscript` answers for whichever turn last wrote to it. On a **resumed** step whose stream is torn, the engine therefore re-derives the *previous* turn's outcome: the dead resume above reads back from disk as `worked`. Found by the oracle on barrage seed 1. After step 0 the exposure is narrow — the stream file is the sensor and the transcript is only the torn-stream fallback — but it is real and it is the engine's. The oracle refuses to claim more than *"this did not land"* from a torn stream ([barrage/oracle.ts](../barrage/oracle.ts), `fromDisk`), which is all the disk can honestly support. The fix — a per-turn cursor into the transcript, of the kind the fake already re-derives at `--resume` — is an engine change beyond step 0, so it is the Architect's.

> **Ruled 2026-08-30, the C7 review: the fix is laid as [C11](c11-cursor-real-seam.md), and C8 depends on it.** The cursor is **recorded, never computed**: the `ignited`/`resumed` event gains the transcript row count observed at spawn, and re-derivation reads only past it — turn-index arithmetic breaks the moment a summoned terminal adds hand turns (D20's fallback is law). A kill drill measured through a fallback that answers for the wrong turn is a contaminated number (findings law 7), so the fix lands before a real turn is spent.

**F4 — the engine spun forever on restart, and the fuzzer found it on its first crash cycle. Fixed, in its own commit.** `adopt()` read `inFlight.set(stepId, waitThenRead())`, and **an async function body runs synchronously to its first `await`**. When the adopted pid was already gone the `while (alive(pid) …)` loop never awaited, so `waitThenRead` ran to completion — `inFlight.delete(stepId)` included — *before* `inFlight.set` executed. The map then held a resolved promise forever, `tick`'s `Promise.race([...inFlight])` returned instantly, and `run()` spun at 100 % CPU making no progress; bun's own child reaping starved and the subjects piled up as zombies:

```
tick 200   inFlight=s02,s26,s31,s32,s66,s76,s79,s88,s89  running=s26,s66,s76,s79,s88,s89
tick 1200  inFlight=s02,s26,s31,s32,s66,s76,s79,s88,s89  running=s26,s66,s76,s79,s88,s89
$ ps -eo pid,ppid,stat | awk '$2==20481 && $3 ~ /Z/' | wc -l
       5
```

**Pre-existing from C6**, not introduced by step 0: the drill's five cut points never hit it because its one adopted subject (`orphan-finish`, 1.2 s of delays) was always still alive at restart, so the loop always awaited at least once. The fix is two lines — the entry is dropped by `.finally`, which runs a microtask *after* `set` — and it rides its own commit. **This is a fix beyond step 0 and the mutant seam and I took it rather than stopping**: bars 5–7 are unreachable through a restart that never returns, and an ordering correction is not the mid-charge engine rework the kill criteria forbid. Named so the Architect can rule it in or out.

> **Ruled 2026-08-30, the C7 review: RATIFIED.** The fix wears the granted-fix shape exactly — its own commit (`c16ee29`), filed and named for ruling (the door's fix-on-the-way law) — and the review re-proved the landing on the fixed bytes at the Architect's own hand: 86 tests green, both type gates exit 0, `bun barrage/run.ts --runs 1000 --crashes 50` exit 0 — 1000/1000 · 50/50 · 9/9, wall 147.6 s. An ordering correction that made the charge's own bars reachable is not the rework kill criterion 1 forbids. The ruling is this desk's (architect charter §Owns: merging what lands). The next Builder in this seat still stops first — ratification is a review outcome, never a standing grant.

**F5 — a step id is now required to be a file name.** Step 0 makes the step id name that step's stream files on disk, so `parseFlow` refuses an id outside `^[A-Za-z0-9][A-Za-z0-9._-]*$` rather than slugging it: two ids slugging to one name would silently share a stream. A contract tightening on the flow file, taken under step 0; no existing flow is affected.

**F6 — three mutants trip a second invariant class, and one is non-deterministic.** The nine are not orthogonal — a gate is also an edge, a pause with no causes is also a status the disk contradicts — so `double-ignite` names 1 · 2 · 7 · 9, `gate-lands-itself` names 3 · 8, `mute-pause` names 5 · 8. The check requires the mutant's **own** class among the reds, which is the honest bar; demanding exactly one class would be demanding an orthogonality the law does not have. `double-ignite` is also the one mutant whose *extra* classes vary between runs — it spawns two subjects for one step and they settle in whatever order they settle — while its own class 1 is named every time.

**F7 — `Options.adoptMs` is gone; law 6's own bound governs.** The charge rules that a still-running fired step found at restart re-arms its full `timeout_ms`, and a second adoption-specific timeout would be a second answer to the same question. A subject that outlives the re-armed timeout is SIGTERMed and read as the **timeout** it is — the one case where the engine's first-hand knowledge beats the disk, and so the one place a torn stream is not laundered through the transcript.

**F8 — the cut point must be drawn family-first, or a whole family goes untested.** Drawn flat over the reachable points, `before-card` never appeared in fifty cuts: an ignition offers three points and a card offers one. The drill now draws the family, then a point inside it — `before-ignite 13 · before-pause 11 · after-ignite 9 · before-card 6 · before-settle 11`. The same trap is worth remembering wherever a drill samples "all the places it could cut": uniform over points is not uniform over kinds.

**F9 — the harness (C6 F9) blocked nothing this session.** No fixture needed re-recording — the durable stream changed no event's shape, so `test/fixtures/demo-run.jsonl` stayed valid and green — and the barrage commits no generated telemetry. `reds/` is empty because the barrage is green; the directory is created on demand by `fileRed`. C6 F9's field report still wants filing to root `ISSUES.md` (the fence forbids it from here), and C8 will still need Felix's hand for real config-dir reads.

> **Correction 2026-08-30, the C7 review:** C6 F9's field report was already filed before this charge ignited — root `ISSUES.md` carries the 2026-08-30 v3-Architect entry, committed at `2de72d4` (the C7 lay session). Nothing outstanding; the Grand Architect's sweep rules it.

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c7-fuzzer-barrage.md.
```
