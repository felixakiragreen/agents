# C18 — the gates

**Status:** OPEN — laid 2026-08-30 · **Depends on:** — (schedule: ignites at
C14's reviewed landing — shared `v3/**` tree, contention not dependency) ·
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

- [ ] `bun v3/gates.ts` on the settled tree exits 0; the full block pasted here.
- [ ] `bun v3/gates.ts --fast` exits 0 and the block names the barrage as
  skipped — pasted.
- [ ] **The runner is seen to fail:** one temporarily planted red per family —
  a failing test, a type error, and a barrage invocation forced red (e.g.
  `--runs 1` against a planted mutant, or the cheapest honest red) — each run
  shows nonzero exit and names the red gate in the block; plants reverted;
  before/after in findings.
- [ ] A later gate red does not mask an earlier one: with two plants live, the
  block reports both — pasted.
- [ ] `bunx tsc --noEmit` covering `gates.ts` itself exits 0; zero new
  dependencies (`git diff` on every `package.json` is empty).
- [ ] Zero real `claude` invocations — budget 0.

## Out of scope

- CI, watchers, parallelizing the suites (run serial; correctness of the block
  over speed — the barrage dominates the wall anyway).
- Editing any test or gate it runs; fixing any red it finds (report, stop —
  a standing red at ignition is a finding, not this charge's work).
- The deck beyond the `--glass` flag; anything under `camera/**`.

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

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
