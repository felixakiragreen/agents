# B22 — hands hygiene

**Status:** OPEN (re-laid 2026-08-30 at G5 — the hands narrowed to the summon
fallback + shelf, D22 r2/r4; B25's surviving half folds in per its fate
clause; the original lay is git history) · **Depends on:** — · **Staffing:**
Builder · opus-high · **Blessed:** ✓ Felix 2026-08-30 (the rework blessing)

## Goal

Correctness debts on the surviving hands, paid at the cause. Summon-to-
terminal is the fallback viewport (D20) and the shelf resumes anything — what
ignites panes still ignites them right: no false trust refusals, no ref
misdeliveries, no test writes into the live audit, and an ignition that lands in
the workspace Felix keeps for the building (B25's fold — ruled at G5 per the
fate clause: the surviving placement scope is one candidate here, not a row).

## Inputs — read before building

- **Candidate 1 — the trust flip.** B12 E1's class: a trust read that
  short-circuits on an auto-created `false` entry refuses a venue that
  demonstrably works. The read now has ONE home in the city:
  `v3/engine/venue.ts` (C14 F6) — verify the class there (short-circuit on
  `true` only; `false` falls through to later evidence), and pin §5's
  agreement (trust from `~/.claude/.claude.json`, never the legacy file) in
  the same test. `~/code/b7-founding-probe` reads `false` today and works —
  it is the regression fixture; Felix clears the scratch trust entries by
  his hand after this lands.
- **Candidate 2 — the UUID sweep.** P6 F2 ruled city-wide at G2: address by
  UUID wherever one exists; a ref is legal only inside the breath that
  created it. `attemptIgnite`'s post-create addressing still rides refs
  (B18 F7).
- **Candidate 3 — the b17 probe.** Compare per (account, bucket); `shut()`
  in `finally` (B11 F8 + B16's addendum, ruled at G2).
- **Candidate 4 — the audit anchor.** One B19 test path appends
  scratch-building inbox lines to the LIVE `hands.jsonl` — measured at G2
  (240 → 242) and re-confirmed at C19 F6 (two lines during the two-lane
  batch). Pin its `CENSUS_DIR`.
- **Candidate 5 — the runbook, not the run.** B14 F1: `PermissionRequest` is
  a real hook event the census is not subscribed to. Subscribing is a
  Felix-run ritual (D14); this row writes the exact settings diff +
  verification; **Felix runs it at G6** (the rework close — G3 died).
- **Candidate 6 — placement (B25's fold).** The ignition knows the building; the
  census keys by cwd alone. Building-homed placement: the workspace found by
  **name** via B18's socket read, addressed by **uuid** once found, minted
  only when none exists — a minted one named for the building, never
  `workspace:N`. Ambiguity never blocks and never guesses between his
  workspaces: two matches ⇒ mint fresh + audit the ambiguity (D10's
  spirit). **The ignited-for building rides the ignition:** census join sid →
  ignited-for building outranks cwd for Belvedere-ignited sessions; hand-ignited keep
  cwd (`buildingOf` stays the fallback). Retirement: only a workspace
  Belvedere minted AND empty at landing (D55); one Felix touched is his,
  forever. The halves are severable: if the name→uuid join proves unstable
  (B18's read says it is not), placement falls back to mint and attribution
  lands regardless — escalate the join, never fuzzy-match.

## Spec

1. `engine/venue.ts`: the flip fixed with a red-before/green-after regression
   pinning `b7-founding-probe`; an actually-untrusted venue still refuses
   loudly.
2. `attemptIgnite`: every post-create cmux call addresses by uuid (read back
   from the create or `cmux tree`); the audit records the uuid it drove.
3. `lab/b17/probe.ts`: per-(account, bucket); `shut()` in `finally`; green
   against the live rig ×2.
4. The B19 path pinned to scratch `CENSUS_DIR`; the suite asserts a full run
   leaves the live audit byte-identical.
5. `plans/permissionrequest-runbook.md`: diff + gesture + verification,
   written for Felix's hand at G6, touching no live config itself.
6. Placement + attribution per candidate 6, on the summon fallback's path.

## Done when:

- [ ] Trust: `b7-founding-probe` composes and ignites (no false refusal),
  regression red-before/green-after recorded; untrusted still refuses.
- [ ] UUID: a live ignition's post-create audit lines carry uuids only; refs
  nowhere past the breath that made them (grep-able); the constructed
  ambiguous-ref scenario can no longer misdeliver.
- [ ] Probe ×2 consecutive green, workspace closed in `finally` on an
  induced mid-run failure.
- [ ] Audit anchor: two full suite runs, `wc -c` on live `hands.jsonl`
  identical before and after both.
- [ ] Runbook on file for G6.
- [ ] Placement: an ignition for `agents/belvedere` with a `belvedere`-named
  workspace lands in it (uuid-addressed, name→uuid in the audit), no mint;
  with none, first ignition mints (named for the building), second lands in the
  mint; induced collision mints fresh + audits; a Belvedere-ignited session at the
  repo root houses under its ignited-for building on City, Workshop, and
  queue, a hand-started control in the same cwd houses by cwd; retirement
  retires minted-and-empty only (induced kept-workspace verified).
- [ ] `bun v3/gates.ts --glass` ALL GREEN; predecessor probes green; every
  workspace this bar mints is closed by it (D55). Budget **≤6 real turns /
  ≤$1** — either ceiling a ⬡-fork (D21).

## Out of scope

- Running the PermissionRequest deploy (Felix's, at G6); clearing the trust
  entries (Felix's, after this lands); rehoming existing sessions
  retroactively; per-step workspace fields; any widening of the hands' write
  surface.

## Findings

*(append here — evidence-grade)*

## Kill criteria

A UUID call site where no uuid can exist (pre-create) is named and kept as
the documented exception. The placement join per candidate 6's severability
clause. Nothing else — every fix is diagnosed and bounded.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence,
agreements; the campaign notes) and
~/code/agents/belvedere/plans/c14-engine-seams.md (findings — F6 is
candidate 1's ground),
and build ~/code/agents/belvedere/plans/b22-hands-hygiene.md to its
`Done when:`.
```
