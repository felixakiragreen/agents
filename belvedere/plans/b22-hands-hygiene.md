# B22 — hands hygiene

**Status:** OPEN · **Depends on:** — (chain per the batch-6 note) · **Staffing:** Builder · opus-high ·
**Blessed:** pending (batch-6 blessing)

## Goal

Four small correctness debts paid at the cause — candidates 1–4 of the
batch-5 close — plus the runbook that lets Felix pay candidate 5 at G3. Small
rows, sharp edges: two of these (trust, addressing) have already produced
false refusals and misdeliveries in the wild.

## Inputs — read before building

- **Candidate 1 — the trust flip.** B12 E1: `trust.ts` reads an auto-created
  project entry as a refusal — it short-circuits only on `true` and must
  **fall through on `false`** to the later evidence. B7 F1's positive control
  `~/code/b7-founding-probe` reads `false` today and demonstrably works; it
  is the regression test. (After this lands, Felix drains the scratch-venue
  trust entries by his hand — ledger tail; keep `b7-founding-probe` until
  the regression test pins it.)
- **Candidate 2 — the UUID sweep.** P6 F2 ruled city-wide at G2: address
  by UUID wherever one exists; a ref is legal only inside the breath that
  created it. `attemptFire`'s post-create addressing still rides refs
  (B18 F7 — B18's socket targets are all uuids, `attemptFire`'s are not).
- **Candidate 3 — the b17 probe.** `lab/b17/probe.ts` compares usage
  aggregates; make it compare per (account, bucket), and put `shut()` in a
  `finally` (B11 F8 + B16's addendum, both ruled at G2).
- **Candidate 4 — the audit anchor.** One B19 test path appends
  scratch-building inbox lines to the **live** `hands.jsonl` (measured at
  G2: 240 → 242 on one suite run; B8 F1's family). Pin its `CENSUS_DIR`.
- **Candidate 5 — the runbook, not the run.** B14 F1: `PermissionRequest` is
  a real hook event the census is not subscribed to. Subscribing is a
  B1-class **Felix-run** ritual (an agent tripping the permission guard on a
  live config file is the design, D14). This row writes the exact settings
  diff + verification steps; Felix runs it at G3.

## Spec

1. `trust.ts`: short-circuit on `true` only; `false` falls through to the
   remaining evidence. Regression test pins `b7-founding-probe`'s venue as
   trusted-in-practice.
2. `attemptFire`: every cmux call after workspace/panel creation addresses by
   uuid (read back from the create, or `cmux tree`), never by ref. The
   audit records the uuid it drove.
3. `lab/b17/probe.ts`: per-(account, bucket) comparison; `shut()` in
   `finally`; the probe passes against the live rig.
4. The B19 test path runs against a pinned scratch `CENSUS_DIR`; assert in
   the suite that a full run leaves the live audit byte-identical.
5. `plans/permissionrequest-runbook.md` (or a section in this doc at
   landing): the exact hook-settings diff per account, the deploy gesture
   (Felix's, D14), and the verification (induce a permission stall, see the
   census beat arrive without the 6 s `Notification` lag B14 measured).

## Done when:

- [ ] Trust: `b7-founding-probe` composes and arms (no false refusal), the
  regression test red-before/green-after recorded; an actually-untrusted
  venue still refuses loudly at arm.
- [ ] UUID: a live fire's post-create audit lines carry uuids only; a
  constructed ambiguous-ref scenario can no longer misdeliver (P6 F2's
  class); refs appear nowhere past the breath that made them (grep-able).
- [ ] Probe: `lab/b17/probe.ts` green against the live rig ×2 consecutive
  runs, its workspace closed in `finally` even on a forced mid-run failure.
- [ ] Audit anchor: two full suite runs; `wc -c` on the live
  `census/hands.jsonl` identical before and after both.
- [ ] Runbook on file: diff + gesture + verification, written for Felix's
  hand, touching no live config itself.
- [ ] Suite green in one process, offline type gate exit 0, predecessor
  probes re-run green.

## Out of scope

- Running the PermissionRequest deploy (Felix's, at G3); draining the trust
  entries (Felix's, after this lands); any widening of the hands' write
  surface.

## Kill criteria

None — all four fixes are diagnosed and bounded. If the UUID sweep finds a
call site where no uuid can exist (a pre-create address), that site is named
in findings and kept as the documented exception, not forced.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6
and ~/code/agents/belvedere/plans/b22-hands-hygiene.md,
and build it to its `Done when:`.
```
