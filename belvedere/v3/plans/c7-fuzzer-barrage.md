# C7 — the fuzzer + the barrage

**Status:** OPEN · **Depends on:** C6 · **Staffing:** Builder · opus-high ·
**Spec blessed:** rides the BLESSED cornerstone §8 arc (⬡✓ 2026-08-29);
pre-chewed and laid by the board's Architect, 2026-08-30 · **Branch:** none —
serial sole lane, straight to `master`, explicit paths

## Goal

`belvedere/v3/barrage/` — the campaign's proving instrument: a seeded topology
generator, a driver that runs generated flows through the real engine against
the fake claude, crash injection at the engine's own seam, the nine-invariant
oracle, the mutation check, and **one command an agent runs unattended, over
and over** (the automation law, cornerstone §6). Serves campaign bars 1–3.
Plus **step 0**: the durable stream — C6 F2's ruled fix, built. Built to last,
full directives. **Budget: 0 real `claude` turns** — layer 0 only; any real
spawn is a ⬡-fork.

## Inputs — read before working

- **The ruling (C6 F2, ruled 2026-08-30):** law 1's state tuple is now
  **(flow file + run log + stream files + transcripts)**. Full text in
  [c6-engine-core.md](c6-engine-core.md) under F2. Step 0 builds it.
- **The engine:** [../engine/README.md](../engine/README.md); import
  `engine.ts`, `invariants.ts`, `replay.ts` — the library is the product, the
  CLI is a hand-hold. The crash seam is `V3_ENGINE_CRASH_AT`
  ([../engine/crash.ts](../engine/crash.ts)); its five cut-point families in
  `engine.ts`: `before-ignite:` · `after-ignite:` · `before-settle:` ·
  `before-pause:` · `before-card:` (each suffixed `<stepId>`).
- **C6 findings that bind here:** F5 (the reading rides `turn-ended`; nothing
  is re-observed), F7 (transcript completeness is a declared scenario
  property — the table below), F8 (the eleven events; `resumed` ≠ `ignited`;
  budget counts ignitions **and** resumes; no `amended` — D12 deferred, the
  only amendment is a budget re-blessing), F9 (the classifier blocks fixture
  commits — see the harness note).
- **The fake:** [../fake-claude/README.md](../fake-claude/README.md) — 23
  scenarios, seeded, p50 16 ms. C5 F5: same seed ⇒ same session id; the engine
  already passes `--session-id`, the fuzzer just varies seeds freely.
- **The law:** [../cornerstone.md](../cornerstone.md) §5 (the nine), §6 (the
  mutation law, the automation law, the spend law); [../README.md](../README.md)
  — the fence.

## The spec

### Step 0 — the durable stream (the ruled F2 fix)

`spawn.ts` writes each turn's stdout to a **stream file** under the run dir
(e.g. `<runDir>/streams/<stepId>.t<n>.jsonl`) instead of a pipe; sensing reads
the file (tail it — pause causes must still surface within one engine tick,
invariant 5). The child owns the fd, so the stream survives the engine's death.
Restart re-derivation goes **stream-file-first**: the file is complete iff it
carries a `result` row (parse rule 1); only a torn stream falls to the
transcript's worked/denied/dead. A still-running fired step found at restart
re-arms its full `timeout_ms` — conservative and bounded. stderr's disposition
is the Builder's call. Update `engine/README.md`'s law 1 in the same commit;
update C6's drill assertions where semantics changed — the mid-turn cut on a
step *with* a report (e.g. `schema-done`) now converges to **landed**, the
state the pre-fix engine could never reach after a mid-turn death. Delete no
test without naming why.

### The generator

`topology(seed, size)` → a valid flow file. Seeded PRNG, **same seed ⇒
byte-identical flow file**. Sizes drawn 2–100 steps; edges forward-only by
construction (no cycles); free parallel width; step kinds mixed. Coverage
quotas per 1,000 runs: every scenario in the table appears; ≥20% of flows
carry a gate or card; ≥30% carry a denial/death/timeout scenario; some flows
carry `budget` below their step count (exercising `ceiling` + re-blessing —
the only amendment shape, F8). Rulings, scenario picks, and seeds all derive
from the run seed: **a red reproduces from its seed alone, one command.**

### The scenario table (F7, ruled into shape)

A declared table in the fuzzer source, one row per scenario ×23: verdict class
(worked / denied / dead / hang) and whether its `result` reaches the stream
file (`die-*` never write one). After step 0 the transcript-completeness
column governs only the torn-stream fallback; the barrage must still exercise
that path (the `die-*` scenarios do it naturally). Extending the library with
**new scenario JSON files** is in-scope when the generator needs a shape —
each with its committed golden per C5's law; changes to the fake's *code* are
out of scope, filed as findings.

### The driver + the scripted ruler

Law 2: the harness is the caller. The driver blesses, ticks to terminal, and
rules every ‹gate›, ‹card›, and pause with seeded choices — land / kill /
answer / re-ignite via `--resume`. Runs may execute in parallel, each in its
own run dir, **≤8 workers** — per-seed determinism must survive parallelism.
Every run wears a wall cap (default 60 s, tunable); a run over cap is itself a
red. Telemetry — run dirs, logs, streams — is gitignored, never committed.

### The oracle

Per run, all nine (cornerstone §5): `invariants(log)` covers its classes;
the two living outside the log module are named here — **7 replay:**
`replay(log) ≡ state()` at terminal, plus the crash-redo convergence below;
**8 truth on disk:** every step's terminal verdict re-derived from its stream
file + transcript alone matches the log (C6 bar 8's machinery, generalized),
and zero surviving subject pids at terminal (shared with 6). Any red files to
`barrage/reds/<seed>.md` — seed, invariant, one-command repro — **never to
root `ISSUES.md`** (the fence; F9's evidence). Reds distill upward at review;
that relay is how campaign bar 1's "filed to ISSUES" is met.

### Crash injection (campaign bar 2)

≥50 barrage runs each take one seeded cut: a point drawn from the run's
enumerable cut points (the five families × the flow's steps), driven through
`V3_ENGINE_CRASH_AT` with the engine as a child. **The convergence oracle is
the uncrashed run:** the same seed runs uncrashed, and the restarted run's
terminal state must equal it exactly — determinism makes the golden free.
Plus: restart exits 0, `invariants` green, zero double-ignitions, exactly one
`blessed`.

### The mutation check (campaign bar 3)

A `V3_ENGINE_MUTANT` seam mirroring `crash.ts` — one line per site, inert
without the env var; a patch-based scheme is refused (a dirty tree mid-run
breaks the two-lane commit rule). Nine named mutants, one per invariant class,
each a deliberate law break — e.g.: 1 double-ignite · 2 ignite before an edge
lands · 3 ignite past an unruled gate · 4 ignite outside the blessed scope ·
5 strip a pause's causes · 6 declare terminal with a step in flight · 7 act on
a transition before appending it (replay diverges) · 8 log `landed` on a
denied reading · 9 ignite past the ceiling. Each runs under the barrage: the
oracle reds it **naming the right invariant**; the unmutated barrage stays
green.

### The one command

`bun barrage/run.ts --runs 1000 [--seed-base N]` — generate, run, check, file;
exit 0 green, exit 1 with the red count. Whole-barrage wall cap enforced;
wall time reported.

### The harness note (F9)

The classifier may block `git add` of generated fixtures and reds. Do not
grind: finish the work, list the exact blocked paths in the landing, Felix
runs the adds by hand (`!`).

## Done when

1. `bun test` green across engine + barrage, `tsc --noEmit` exit 0 — pasted.
2. **Step 0 evidenced:** stream files on disk; a mid-turn cut on a
   report-carrying step converges to **landed** ≡ its uncrashed run;
   `engine/README.md` law 1 updated in the same commit.
3. **Determinism:** same seed ⇒ byte-identical flow file and identical run
   verdict, proven on ≥3 seeds ×2 runs each, under parallel workers.
4. **The scenario table:** all 23 scenarios classified, cited from the oracle.
5. **The barrage (campaign bar 1):** one command, ≥1,000 seeded runs, all nine
   invariants checked per run — green, or every red in `barrage/reds/` with
   its seed and repro; wall time reported.
6. **Crash-redo (campaign bar 2):** ≥50 seeded cuts across ≥3 topology sizes;
   every restart terminal ≡ its uncrashed run, zero double-ignitions.
7. **Mutation (campaign bar 3):** 9/9 mutants caught, each on its own
   invariant class; the seam inert without the env var; unmutated barrage
   green.
8. **Budget 0 held:** zero real `claude` invocations.

## Kill criteria

- **The engine is broken, not under-fuzzed:** if ≥5% of the first 200 barrage
  runs red on the same invariant class, stop the barrage — file the smallest
  red seed, land what stands; the fix is a new charge, never a mid-charge
  engine rework beyond step 0 and the seams.
- **The fake can't say it:** a topology shape needing fake-claude *code*
  changes (not a new scenario file) is a finding + a stop on that shape, never
  an in-charge fork of C5's instrument.

## Out of scope

Real subjects (C8) · 100-simultaneous scale (C9) · the console demo (C10) ·
auto-filing to root `ISSUES.md` (the fence) · engine features beyond step 0
and the mutant seam · D12 scope growth · retry policies. **Creep is a bug.**

## Findings

*(append here)*

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c7-fuzzer-barrage.md.
```
