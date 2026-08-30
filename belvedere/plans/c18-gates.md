# C18 — the gates

**Status:** **LANDED 2026-08-30** — `bun v3/gates.ts` is the proving run; all six
bars evidenced below, five findings filed, F1 relayed. Laid 2026-08-30; **ignitable 2026-08-30** (C14's landing
reviewed — the schedule hold is paid; batch 2) ·  **Depends on:** — ·
**Staffing:** Builder · opus-medium · **Blessed:** Felix's word 2026-08-30
("both!"); his ignition is the arm (D11)

## Mission

One command runs every standing gate and prints the paste-ready evidence block.
Today every v3 charge and every review runs ~8 commands by hand — four test
suites, four type gates, the 148-second barrage — and transcribes output into
`Done when:` bars; transcription is where gate-lapses hide (C2 E1 caught the
type gate red under a green suite; C12 F6 caught the suite red under a green
type gate — one in each direction). When this lands, `bun v3/gates.ts` is the
proving run, and its output block is what sessions paste.

## Inputs — read before working

- The gates as run today, verbatim in recent landings:
  [C10](c10-console-demo.md) / [C13](../v3/plans/c13-report-on-disk.md)
  `Done when:` sections — `bun test` in `v3/engine`, `v3/barrage`,
  `v3/fake-claude`, `v3/console`; `bunx tsc --noEmit` in each;
  `bun barrage/run.ts --runs 1000 --crashes 50`.
- The coda's type-check law: offline `bunx tsc --noEmit` against the repo-pinned
  toolchain — the runner invokes exactly that, never a fetched checker.
- C12 F6 and C2 E1 (the two gate-lapse incidents) — the failure modes this tool
  exists to kill; do not re-derive.

## Spec

`v3/gates.ts`, argv-driven, no dependencies beyond what the trees already pin:

1. **Default run:** the four suites, the four type gates, then the barrage
   (`--runs 1000 --crashes 50`). Each gate runs to completion even after an
   earlier red (report everything, then fail); exit 0 iff every gate passed.
2. **`--fast`:** suites + type gates, barrage skipped and *said so* in the
   block — the inner-loop mode; never sufficient for a landing.
3. **`--glass`:** adds the deck's suite + type gate (for C15-era work; off by
   default — the deck is not v3's standing regression today).
4. **The block:** one fenced markdown table printed at the end — gate · result ·
   counts (tests passed/failed; barrage runs/cuts/mutants) · wall · exit code —
   followed by a single verdict line (`ALL GREEN` / `RED: <gates>`). Byte-ready
   for pasting into a `Done when:` bar or a findings section; no color codes in
   the block.
5. Reds re-print verbatim beneath the block (the failing gate's tail), so the
   paste carries the evidence, not just the verdict.

## Done when:

- [x] `bun v3/gates.ts` on the settled tree exits 0; the full block pasted here.

  ```
  | gate | result | counts | wall | exit |
  |---|---|---|---|---|
  | engine · suite | PASS | 77 pass · 0 fail | 24.6s | 0 |
  | barrage · suite | PASS | 41 pass · 0 fail | 23.8s | 0 |
  | fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
  | console · suite | PASS | 26 pass · 0 fail | 1.5s | 0 |
  | engine · types | PASS | 0 errors | 0.1s | 0 |
  | barrage · types | PASS | 0 errors | 0.1s | 0 |
  | fake-claude · types | PASS | 0 errors | 0.1s | 0 |
  | console · types | PASS | 0 errors | 0.1s | 0 |
  | barrage | PASS | 1000 runs · 50 cuts · 9/9 mutants | 149.0s | 0 |

  ALL GREEN — 9 gates, wall 209.5s
  ```

  `EXIT=0`. The four suites are C14's own numbers to the test (77 · 41 · 60 · 26)
  and the barrage is C7's bars to the run (1000/1000 · 50/50 · 9/9).

- [x] `bun v3/gates.ts --fast` exits 0 and the block names the barrage as
  skipped — pasted.

  ```
  | gate | result | counts | wall | exit |
  |---|---|---|---|---|
  | engine · suite | PASS | 77 pass · 0 fail | 24.7s | 0 |
  | barrage · suite | PASS | 41 pass · 0 fail | 23.9s | 0 |
  | fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
  | console · suite | PASS | 26 pass · 0 fail | 1.4s | 0 |
  | engine · types | PASS | 0 errors | 0.1s | 0 |
  | barrage · types | PASS | 0 errors | 0.1s | 0 |
  | fake-claude · types | PASS | 0 errors | 0.1s | 0 |
  | console · types | PASS | 0 errors | 0.1s | 0 |
  | barrage | SKIP | --fast: not run — never sufficient for a landing | — | — |

  ALL GREEN — 8 gates, wall 60.6s (--fast: barrage skipped)
  ```

  `EXIT=0`. The skip is said twice — its own row, and the verdict line — so a
  paste that loses the table still carries the disclaimer.

- [x] **The runner is seen to fail:** one temporarily planted red per family —
  a failing test, a type error, and a barrage invocation forced red (e.g.
  `--runs 1` against a planted mutant, or the cheapest honest red) — each run
  shows nonzero exit and names the red gate in the block; plants reverted;
  before/after in findings.

  **Family 1 — a failing test** (`engine/test/c18-plant.test.ts`, `expect(1).toBe(2)`):

  ```
  | engine · suite | RED | 77 pass · 1 fail | 24.3s | 1 |
  …
  RED: engine · suite — 8 gates, wall 60.1s (--fast: barrage skipped)
  ```
  ```
  ### RED — engine · suite (exit 1), last 19 of 19 lines
  …
  error: expect(received).toBe(expected)
  Expected: 2
  Received: 1
        at <anonymous> (…/engine/test/c18-plant.test.ts:3:12)
  (fail) C18 plant — a deliberately failing test, reverted at landing [0.06ms]
   77 pass
   1 fail
  ```
  `EXIT=1`.

  **Family 2 — a type error** (`console/c18-plant.ts`,
  `export const planted: number = "not a number";`):

  ```
  | console · types | RED | 1 error | 0.1s | 1 |
  …
  RED: console · types — 8 gates, wall 60.4s (--fast: barrage skipped)
  ```
  ```
  ### RED — console · types (exit 1), last 1 of 1 lines

  c18-plant.ts(2,14): error TS2322: Type 'string' is not assignable to type 'number'.
  ```
  `EXIT=1`.

  **Family 3 — the barrage forced red.** The engine's mutation seam is a
  process-wide env variable, so exporting it reds the engine suite too (F4);
  the isolated red plants it on the barrage gate's spawn alone, on
  `double-ignite`'s own pinned seed, with the run shortened so the family costs
  4 s instead of 150 (both plants inside `gates.ts`, both reverted):

  ```
  | engine · suite | PASS | 77 pass · 0 fail | 24.7s | 0 |
  …
  | barrage | RED | 1 runs · 1 cuts · 0/9 mutants | 4.3s | 1 |

  RED: barrage — 9 gates, wall 64.8s
  ```
  ```
  ### RED — barrage (exit 1), last 17 of 17 lines
  …
  barrage: 0/1 green · red seeds 2000000
  crash drill: 0/1 converged, zero double-ignitions · red seeds 3000000
  barrage RED — 2 findings · 1 runs · 1 cuts · 0/9 mutants · wall 4.2s
  ```
  `EXIT=1`. Every other gate stayed green in the same run — the runner names
  the red family and nothing else.

  **Plants reverted, measured:** `git status --short --untracked-files=all --
  belvedere/v3` and `git diff --stat -- belvedere/v3` are both **empty**; the
  two `barrage/reds/*.md` filings the forced red produced were removed with
  their directory. The settled-tree run above was taken *after* the revert.

- [x] A later gate red does not mask an earlier one: with two plants live, the
  block reports both — pasted.

  Gate 1 (`engine · suite`) and gate 8 (`console · types`) planted together:

  ```
  | engine · suite | RED | 77 pass · 1 fail | 24.5s | 1 |
  | barrage · suite | PASS | 41 pass · 0 fail | 23.8s | 0 |
  | fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
  | console · suite | PASS | 26 pass · 0 fail | 1.4s | 0 |
  | engine · types | PASS | 0 errors | 0.1s | 0 |
  | barrage · types | PASS | 0 errors | 0.1s | 0 |
  | fake-claude · types | PASS | 0 errors | 0.1s | 0 |
  | console · types | RED | 1 error | 0.1s | 1 |
  | barrage | SKIP | --fast: not run — never sufficient for a landing | — | — |

  RED: engine · suite, console · types — 8 gates, wall 60.3s (--fast: barrage skipped)
  ```

  `EXIT=1`, **both** tails re-printed beneath the block, and the seven gates
  between the two plants ran and reported normally.

- [x] `bunx tsc --noEmit` covering `gates.ts` itself exits 0; zero new
  dependencies (`git diff` on every `package.json` is empty).

  ```
  $ cd belvedere/v3 && ../glass/node_modules/.bin/tsc --noEmit
  tsc(gates.ts) exit=0

  $ git diff --stat -- '*package.json'
  (no output)
  ```

  The invocation is the repo-pinned binary by path, not `bunx` — **`bunx tsc`
  in these trees fetches a checker off npm** (F1). `v3/tsconfig.json` is the
  new file that makes `gates.ts` checkable; it adds no dependency (same
  compiler options as the four, `typeRoots` pointing at the deck's pinned
  `@types`). It is **not** one of the runner's four standing type gates — F2.

- [x] Zero real `claude` invocations — budget 0.

  Nothing in this charge spawns a subject; the barrage spawns only
  `fake-claude`. `pgrep -fl "fake-claude|claude -p"` after the final run:
  **no matches** — zero survivors, C14's sweep doing its job.

**Also built, spec §3 — `--glass`, exercised once:** `bun v3/gates.ts --fast
--glass` adds the deck's two gates and is **honestly red at HEAD**:

```
| glass · suite | RED | 670 pass · 3 fail | 2.4s | 1 |
| glass · types | PASS | 0 errors | 0.2s | 0 |

RED: glass · suite — 10 gates, wall 63.0s (--fast: barrage skipped)
```

Those are C12 F6's three reds verbatim (`readFlows`, the fork baton, `colorOf`)
— **C15's to resolve**, untouched here per this charge's out-of-scope list. F3.

## Out of scope

- CI, watchers, parallelizing the suites (run serial; correctness of the block
  over speed — the barrage dominates the wall anyway).
- Editing any test or gate it runs; fixing any red it finds (report, stop —
  a standing red at ignition is a finding, not this charge's work).
- The deck beyond the `--glass` flag; anything under `camera/**`.

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

### F1 — `bunx tsc --noEmit` in the v3 trees FETCHES a checker off npm; it has never been the repo-pinned one, and two landed charges pasted it as evidence

The coda's law is offline and repo-pinned. `bunx` resolves a binary from the
nearest `node_modules/.bin` walking up — and **`belvedere/glass/node_modules` is
not an ancestor of `belvedere/v3/**`**, so there is nothing local to find and
`bunx` goes to the registry. Measured, first run of this charge, in a tree with
no working-copy changes:

```
$ cd belvedere/v3/engine && bunx tsc --noEmit
Resolving dependencies
Resolved, downloaded and extracted [2]
Saved lockfile
exit=0
```

Those three lines are a network install. The control is the pinned binary, in
the same directory, silent:

```
$ cd belvedere/v3/engine && ../../glass/node_modules/.bin/tsc --version
Version 7.0.2
$ cd belvedere/v3/engine && bunx tsc --version
Resolving dependencies
Resolved, downloaded and extracted [2]
Saved lockfile
Version 7.0.2
```

**The versions match today by luck, not by pin** — `bunx` fetched npm's current
`typescript`, which happens to be 7.0.2, the same version B8 pinned. Nothing
holds that true tomorrow: a `typescript@7.1` release silently re-points every
`bunx tsc` gate in the campaign to a checker no lockfile names, and a *green*
gate is the failure mode as much as a red one. Nothing was written into the
repo — the fetch lands in bunx's own temp dir, `git status
--untracked-files=all` stayed clean, no `bun.lock` appeared under `v3/**`.

**What this binds:** C14's `Done when:` pastes `bunx tsc --noEmit -p
$d/tsconfig.json` ×4 and C13's pastes `bunx --offline tsc --noEmit`; C5–C11 used
the pinned path (`../../glass/node_modules/.bin/tsc`) and were right. This
charge's Inputs section repeats the `bunx` wording, so **the coda's own sentence
and the coda's own intent disagree in these trees** — the runner obeys the
intent and invokes the pinned binary by path, which is offline by construction.
Relayed to the bulletin. The wording is the Architect's to true.

### F2 — the runner's own type gate is not one of the standing four, deliberately

`gates.ts` lives in `v3/`, which no existing `tsconfig.json` includes, so this
charge added `v3/tsconfig.json` (`include: ["gates.ts"]`, options copied from
the four). The spec's §1 enumerates the standing set as **four** suites and
**four** type gates, so the runner does not grade itself — adding a fifth row
would change the block the charge describes, and creep is a bug.

The consequence is exact and worth naming: **the one file in the campaign whose
job is to stop gate-lapses is itself guarded by no standing command.** Its gate
is `cd belvedere/v3 && ../glass/node_modules/.bin/tsc --noEmit`, run by hand
above. Two one-line fixes exist and both are the Architect's call, not a
Builder's: make it the fifth type gate, or add `../gates.ts` to
`barrage/tsconfig.json`'s `include` (which already reaches `../engine/*.ts`, so
the cross-tree precedent is there) — that second one is editing a gate the
runner runs, which this charge's out-of-scope list forbids.

### F3 — `--glass` is red at HEAD and cannot be a landing bar until C15

Measured above: `glass · suite` **670 pass / 3 fail**, `glass · types` 0 errors.
The three are C12 F6's, re-confirmed by C17 F4, and C15's charge owns them. So
the flag works and reports the truth, but **`--glass` green is unreachable
today** — a charge that writes "`bun v3/gates.ts --glass` exits 0" into a
`Done when:` before C15 lands is writing a bar it cannot meet. The default run
is unaffected: the deck is not v3's standing regression, which is exactly why
the flag is opt-in.

### F4 — the engine's mutation seam is process-wide, so "run the barrage under a mutant" reds the engine suite too

`engine/mutant.ts` reads `process.env.V3_ENGINE_MUTANT`, and `gates.ts` hands
every gate its own inherited environment. Exporting the variable for the whole
run therefore corrupts the unit tests as well:

```
$ cd belvedere/v3/engine && V3_ENGINE_MUTANT=double-ignite bun test
 56 pass
 21 fail
Ran 77 tests across 11 files. [22.98s]
```

Control: the same command without the variable is 77 pass / 0 fail. So the
cheap-looking way to force a barrage red — one `export` — produces a **two-gate**
red and proves nothing about isolation. The isolated red plants the variable on
the barrage gate's `Bun.spawn` alone. Anyone re-deriving family 3 should plant
there, and should shorten the run at the same time: on `double-ignite`'s pinned
seed (`--runs 1 --seed-base 2000000 --crashes 1 --no-mutants`) the barrage goes
red in **4.3 s** instead of 149 s, and files two `reds/*.md` that must be swept.

### F5 — the type gates are free; the barrage is 71% of the wall

Measured across every run of this charge: the four type gates cost **0.1 s
each** (typescript 7.0.2 is the native compiler), the four suites **60 s**
together, the barrage **149 s**. So the ~8-command hand ritual this tool
replaces was never expensive in the type gates — which is precisely why they
were the half that lapsed (C2 E1). `--fast` buys 149 s of the 209 s.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-medium.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements; the migration
campaign note) and ~/code/agents/belvedere/v3/README.md (the fence),
and execute the charge at ~/code/agents/belvedere/plans/c18-gates.md.
```
