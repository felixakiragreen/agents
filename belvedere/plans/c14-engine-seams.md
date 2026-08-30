# C14 — the engine seams

**Status:** OPEN — laid 2026-08-30 · **Depends on:** — · **Staffing:** Builder ·
opus-high · **Blessed:** laid on D22's own text (the seams charge leads — the G4
verdict, ruling 3); Felix's ignition is the arm (D11)

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

- [ ] `bun test` green across `v3/engine`, `v3/barrage`, `v3/fake-claude`,
  `v3/console`; all four type gates (`bunx tsc --noEmit`) exit 0 — outputs
  pasted.
- [ ] `bun barrage/run.ts --runs 1000 --crashes 50` exit 0 (1000/1000 · 50/50 ·
  9/9) on the settled tree — pasted; the standing regression (D22).
- [ ] A committed engine test replays a pre-C14 fixture log (no `configDir`)
  green: readable, verdicts unchanged, drive verbs refuse in kind — pasted.
- [ ] A console test drives a fake run with its `conditions.json` deleted:
  `send`/`return` resolve the account from the log alone — pasted.
- [ ] The answer-then-land pair exists and is committed; the send→landing arc
  test passes on the fake with zero real turns — pasted.
- [ ] A mutant-drill check (a test, or a measured drill run pasted) shows zero
  surviving subject pids after an early-ended run.
- [ ] `bun belvedere/v3/console/rehearsal.ts personal` green — and the account it
  drives with is read off the run log, not the sidecar (name how the assertion
  knows; deleting/ignoring the sidecar in the rehearsal's own run dir is the
  cheap proof). **Budget: ≤$1 / ≤10 real turns, either ceiling a ⬡-fork (D21).**
- [ ] The v3 README deferred list trued: the four promoted items read exactly
  what shipped (the lay already struck them — correct the wording only if the
  build diverged); the sixth cut family untouched.

## Out of scope

- The deck — nothing under `glass/**` changes (C15's charge; the pre-summon
  refusal lands in `console/`/`engine/`, not the deck).
- The sixth cut family (its trigger is recorded: a third recurrence promotes it).
- Any new console verb; any engine behavior change beyond the four seams.
- Moving engine code out of `v3/`; renaming anything.
- Backfilling `configDir` into old run logs.

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

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
