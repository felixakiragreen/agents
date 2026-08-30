# C19 — the fixture city

**Status:** OPEN — laid 2026-08-30; **ignitable 2026-08-30** (C17's landing
reviewed; batch 2) · **Depends on:** C17 · **Staffing:**
Builder · opus-high · **Blessed:** Felix's word 2026-08-30 ("both!"); his
ignition is the arm (D11)

## Mission

A seeded city the camera's twin points at, so probes render **any card state on
demand** instead of waiting for reality to produce one: a ⬡-gate card
(unwired), a session-holder Dispatch baton, a fork baton, a KILLED row, a lint
red, live-and-dead sessions, lit WIP gauges. Deck charges stop verifying
against whatever the real city happens to look like today — C15/C16's visual
bars and every batch-6 re-cut get deterministic states to shoot.

## Inputs — read before working

- [C17](c17-camera.md) and its landed `camera/` — the twin boot, the probe API;
  this charge extends both. Read its findings first.
- The knobs, already built — do not re-derive: `glass/paths.ts:17`
  `GLASS_CITY` (the city root the register walks), `:28` `CENSUS_DIR`, `:63`
  `USAGE_DIR`, `:37` `BELVEDERE_ENV` (the disarm), `:80` `GLASS_PORT`.
- The bleed-through, named (paths.ts:23): `PRESETS`, `ACCOUNTS`,
  `INVOCATIONS`, `ISSUES_TEMPLATE` are hardcoded to the real repo — read-only,
  acceptable; the fixture isolates city + census + usage only. The shelf reads
  real account dirs and is **not** seedable here (out of scope, below).
- Format law the fixtures must speak: `canon/work/DOCTRINE.md` §4 (board), §7
  (ledger + baton), templates in `canon/work/templates/`; `doctrine lint` is
  the fixture's own acceptance tool.
- Liveness physics: the census marks live sessions by pid; a committed static
  pid is dead by the time it renders. Time-sensitive organs (usage strip ages,
  census liveness) need **boot-time generation**, not static bytes.

## Spec

1. **The static tree — `camera/fixtures/city/`**, committed: two conforming
   buildings and one broken one.
   - `alpha/` — README with a board carrying one row in every state that
     renders differently (OPEN · OPEN—DEFERRED · IN FLIGHT · LANDED · KILLED ·
     a `⬡-gate`-staffed row), a LEDGER whose tail baton is **⬡-held**, an
     ISSUES with two entries, `plans/` with one fenced kickoff.
   - `beta/` — a second building whose ledger tail carries a **session-holder
     baton** and whose plans carry a **fork baton** case; a decision register
     with one pending blessing.
   - `broken/` — a malformed board (the parser-as-lint state: the building page
     must render the failure honestly, not a blank).
   - Acceptance: `doctrine lint camera/fixtures/city/alpha` (and `beta`) green;
     `broken` red **as the control** — outputs committed to findings.
2. **The seeder — `camera/fixtures/seed.ts`**: at twin boot, writes census
   JSONL and usage files into per-run temp dirs — live rows stamped with the
   camera's **own pid** (alive for exactly the probe's life) beside dead rows,
   usage windows stamped with fresh timestamps at chosen fill levels (one
   near-cap for the gauge state). Deterministic content, generated timing.
3. **The wiring:** the camera gains `--fixture` — boots the twin with
   `GLASS_CITY` at the static tree, `CENSUS_DIR`/`USAGE_DIR` at the seeded temp
   dirs (torn down with the twin), disarm as ever. Without the flag, behavior
   is exactly C17's (the real city, read-only) — proven by running C17's own
   probes unchanged.
4. **Committed probes** (each ends in a shot): `fixture-rail` (⬡ card unwired
   beside a session-holder Dispatch — D10 visible in pixels), `fixture-building`
   (alpha's board/ledger/queue/ISSUES panels), `fixture-broken` (the honest
   render failure), `fixture-gauges` (the near-cap gauge lit from seeded
   usage).

## Done when:

- [ ] `bun camera/cli.ts run probes/fixture-rail.probe.ts` exits 0; the Builder
  **Reads the PNG** and describes the ⬡ card and the Dispatch button in one
  sentence each — pasted with the image path.
- [ ] The other three fixture probes exit 0, shots written — pasted.
- [ ] `doctrine lint` green on `alpha` + `beta`, red on `broken` — all three
  outputs pasted (the control proves the linter sees the fixtures at all).
- [ ] C17's original probes still pass unchanged without `--fixture` (the real
  city path untouched) — pasted.
- [ ] Teardown: no surviving twin, temp census/usage dirs gone — evidence
  pasted; `git status` clean of shots and temps.
- [ ] `bunx tsc --noEmit` in `camera/` exit 0; `glass/` untouched (`git diff
  --stat` on `glass/` empty).
- [ ] Zero real `claude` invocations — budget 0.

## Out of scope

- Chat-transcript fixtures and shelf/account seeding — the Chat and shelf read
  real account dirs; the seeding knob is C16's own design question (its doc
  decides; this charge must not invent account-dir shims).
- v3 run-dir fixtures for the Works — C15's charge brings the states it needs.
- Any `glass/**` change; pixel goldens; probes against the live deck.

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
arming law, agreements; the migration campaign note) and
~/code/agents/belvedere/plans/c17-camera.md (findings included),
and execute the charge at ~/code/agents/belvedere/plans/c19-fixture-city.md.
```
