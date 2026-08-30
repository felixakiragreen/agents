# C15 — the deck's v3 lane

**Status:** OPEN — cut 2026-08-30 at C14's reviewed landing · **Depends on:**
C14 (the account field's final shape is this charge's input); C17 (the camera —
every visual bar ships its evidence) · **Schedule:** ignites when C18 and C19
paste green — camera-tree contention plus C19's fixture states, not dependency
edges · **Staffing:** Builder · opus-high · **Blessed:** D22 r2/r3 (the G4
verdict — v2 superseded-in-place, the deck's v3 lane follows the seams); his
ignition is the arm (D11)

## Mission

The v2 engine retires from the live deck, whole. When this lands: `glass/flow.ts`,
`glass/engine.ts`, `glass/judge.ts`, the `flows/*.flow.json` files and their
tests are gone — zero debt, no shim (D22 r2); the Works draws **v3 runs** read
through the v3 engine's own exports (the run log is truth); the three standing
glass reds are resolved and `bun test glass/` is green again; the organs — census,
City, rail, shelf, Chat, composer, desk, grep, decoder — stand untouched beyond
what the retirement forces. The deck's v3 lane is **read-only**: drawing runs,
never driving them (the fork is pre-ruled below).

## Inputs — read before working

- [C14](c14-engine-seams.md), findings included — **the account field's final
  shape**: `ignited` carries `configDir` (absence legal forever); the console
  resolves venue log-first, sidecar-second (`v3/console/runs.ts` — `locate()`,
  `venueFrom`); display names via reverse `ACCOUNTS` lookup off
  `v3/engine/venue.ts`; the engine's `options.account` is retired (F6). The deck
  renders accounts the same way — log first, raw path where no name matches.
- [C17](c17-camera.md), findings included — the camera loop (shoot → Read →
  describe), F5 (the probe's door is `localStorage`, `Probe.remember` — no
  probe-only routes in the glass, ever), F6 (one twin, several `shoot`s — never
  one twin per assertion), F2 (the traps: the desk knob, the inbox's missing one —
  this charge closes it).
- The v3 read surface: `v3/engine/` exports (`fold`, `replay`, `verdicts`,
  `invariants`, the log reader) and `v3/console/runs.ts` (the reference reader
  for run discovery). **`v3/**` is read-only for this charge** — imports only;
  a genuinely missing export is a stop-and-escalate naming it, never a copy
  (D65's one-parser law, same shape).
- The three reds (`bun test glass/`, 670/3 at HEAD — C12 F6): the `readFlows`/
  flow-batch-1 test (dies with v2), the fork-baton test, `colors.ts`'s
  `INTENT_OF` inversion (root inbox 2026-08-29, the presets-speak-real-colours
  entry: the rig now writes real colour words; the deck's map must read them,
  not the pre-C25 slot words).
- The intake, distilled at the 2026-08-30 sweep (campaign note, README §6):
  no deck surface lands anything on an exit code — the engine's verdict is the
  only landing signal (C4's posture matrix, `permission_denials[]`); step
  legality is per **(model, posture)**, never per model (C4 F6 — haiku holds
  `acceptEdits`, not `auto`); kickoff bytes freeze inline at arm — v3's `prompt`
  field stays the law, no doc-position pointer survives an arm (flow-1's
  positional-pointer collapse); a landing reads the subject's own report, never
  a board row — the v2 sensor circle (board-by-master + merge-gated-on-landing)
  is not rebuilt.
- B10 F4's law survives the swap: the run log outranks the board, and **the
  drawing says which source spoke**.

## Spec

1. **The retirement.** Delete `glass/flow.ts`, `glass/engine.ts`,
   `glass/judge.ts`, `belvedere/flows/*.flow.json`, and every test that exists
   to exercise them. Whatever imports them re-points or dies with them —
   `readFlows`, the arm/tick endpoints, v2 run-state rendering. No compat
   layer, no dead exports kept "just in case."
2. **The Works on v3.** The Works pane draws v3 runs: discovery per the
   console's reference reader, node states from the engine's own `fold`/
   `verdicts` on the run log — asserted equal in a test (the deck never
   re-implements the log parser). Time still flows down (D14); the NOW line
   and lane layout survive as the surface — the data source swaps. Frozen
   `prompt` bytes render as the step's kickoff; account per C14's shape.
   A run mid-flight renders from the log as it stands; a log the reader
   refuses renders the failure honestly (parser-as-lint, README §1).
3. **The hands' re-point.** Endpoints and UI that served only the v2 engine
   (arm, tick, v2 run-state) die with it. The organ hands — fire/worktree/
   focus/halt, the composer, the Chat's send — stand untouched. **The deck
   does not drive v3 in this charge**: no arm button, no dispatch into the
   engine — pre-ruled at the cut, because driving semantics are G5's rework
   lay (B26/B27's re-cut against the v3 world). If a surface cannot survive
   without driving, render it honestly disabled with the reason (the
   honest-disabled law), never wire it.
4. **The three reds true.** The flow-batch-1 test dies with v2; the fork-baton
   test and the `INTENT_OF` inversion are fixed at cause (the presets entry is
   the spec for the colour words). `bun test glass/` ends 0 fail.
5. **The inbox knob (C17 F2).** `glass/paths.ts` gains an env knob for the
   sovereign-inbox write root — `DESK_DIR`'s sibling, read per call, default
   the real city (name per `paths.ts` convention, the Builder's). The camera's
   twin boot points it at a scratch drawer (C19 has landed by ignition — the
   boot edit is safe). A probe clicking "file it" can no longer write the real
   city.
6. **Camera evidence.** Every visual bar below ships a PNG the Builder's own
   probe shot and the Builder Read — one probe, several `shoot`s (C17 F6).
   C19's `--fixture` states are available for card-state shots; v3 run states
   are this charge's own fixtures (C19's out-of-scope, by design).

Implementation choices inside this spec are the Builder's; anything touching a
contract — a v3 export change, a new deck capability, an organ change —
escalates.

## Done when:

- [ ] The v2 engine is gone: `git rm` evidenced for the three glass files, the
  flows files, and their tests; `rg -l 'readFlows|glass/engine|glass/judge'
  belvedere/glass belvedere/camera` names zero live references — pasted.
- [ ] `bun test` in `glass/` — **0 fail** (counts pasted); which red died with
  v2 and which two were trued at cause, named in findings.
- [ ] A committed test asserts the Works' node states ≡ `verdicts()` (v3's own
  export) on the same run log; the Works renders a real landed v3 run (the
  rehearsal's, or a fake-engine run) — camera shot, Read, described.
- [ ] A run whose kickoff doc has since moved renders the **frozen** `prompt`
  bytes (test with a mutated doc); no doc-position resolve survives anywhere
  in `glass/` — grep pasted.
- [ ] Step legality reads (model, posture): a haiku step under `acceptEdits`
  renders legal, under `auto` renders blocked with P5's sentence — both
  states shot or asserted.
- [ ] No deck surface lands from an exit code: the landing signal in every
  glass code path is the engine's verdict — the assertion or grep that proves
  it, pasted.
- [ ] The inbox knob: a twin with the knob set has its "file it" land in
  scratch, the real city byte-identical before/after (`git status` +
  sha) — probe evidence pasted; C17 F2 recorded closed.
- [ ] `bunx tsc --noEmit` (the offline gate) exit 0 in `glass/` and in
  `camera/` if probes were added; zero new dependencies (`git diff` on every
  `package.json` empty).
- [ ] Zero real `claude` invocations — **budget 0**; fake runs and landed run
  dirs suffice. Any real spend is a ⬡-fork (D21).

## Out of scope

- Driving v3 from the deck — arm, dispatch, halt-into-engine (G5's rework lay;
  B26/B27's re-cut).
- The Chat chapter (C16): read/inject, transcript fixtures, shelf seeding.
- Any organ change beyond what the retirement forces; the shelf; the rail's
  baton semantics (B26).
- Any `v3/**` write; any `camera/**` change beyond the twin-boot inbox default
  and this charge's own new probe files.
- The batch-6 re-cuts; the respell sweep (both G5's).

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence, the
arming law, agreements; the migration campaign note),
~/code/agents/belvedere/plans/c14-engine-seams.md and
~/code/agents/belvedere/plans/c17-camera.md (findings included),
and execute the charge at ~/code/agents/belvedere/plans/c15-deck-v3-lane.md.
```
