# 14 — summon rig: the theater cycle

**Status:** OPEN — cut 2026-08-24 (Architect) · **Depends on:** 13 LANDED; **serial
with 11** (shared files: `summon/summon.zsh`, `lab/08` — never both in flight; 11 is
deferred, so 14 is dispatchable) · **Staffing:** Builder · opus-high · **Blessed:**
Felix's ask 2026-08-22 (campaign theaters inside one repo — `architect-pods-NN` fired
from bob); both design forks ruled by him 2026-08-24: the `t` key, sticky per
directory.

## Mission

A campaign is not always a directory. Row 13 stamps theater as `${PWD:t}`, which is
right when the repo is the theater — but bob hosts three (bob, lunchbox, pods), and
firing from a campaign subdirectory is the wrong fix: Claude Code keys history,
`/resume`, and auto-memory to the launch cwd, so deep-firing fragments the project
silo even though parent CLAUDE.mds still load. Felix fires at repo roots; the rig
must let the *stamp* carry the campaign. Eject can't — hand-edits never pass
`_summon_resolve`, so the lineage counter goes blind (13's asymmetry, confirmed by
Felix: "that kills the summon index"). The cycle goes through resolve, so every
campaign session is stamped, logged, and counted.

## Inputs — read before working

- `summon/summon.zsh` — `_summon_resolve`, the name-stamp and ordinal scan (13,
  commit `0cf4f0f`), the reserved-key handling for `+`/`-`, the state file law
  (four fields persist **on fire only**).
- `lab/08/run` + `name.exp` — 13's harness arms; 13-F8 binds: only a panel's *first*
  paint can be asserted from a pty.
- `summon/README.md` §the name-stamp — extend, don't fork.
- `plans/13-summon-rig-name-stamp.md` findings F1, F7–F9.

## The scheme — ruled at the cut

- **`.summon-theaters`** in the fire directory (cwd only — no parent walk; Felix
  fires at repo roots): one theater per line, non-empty lines only, first line the
  default. Committed to each repo that wants it — the campaign list is repo truth.
  No file → `${PWD:t}` exactly as row 13 (the `root` fallback at `/` — 13-F9 —
  unchanged).
- **`t` cycles** through the file's theaters in filed order, wrapping. `t` joins the
  reserved key namespace (`+`/`-` precedent): `presets.tsv` may never claim it, and
  a row that does gets the same treatment the existing reserved keys get. The footer
  shows the re-stamped name on the next paint — Felix always sees what fires.
- **Sticky per directory:** the fired theater persists in rig state keyed by the
  fire directory, same on-fire-only law as the four fields — aborts and Esc discard
  it. Next panel open in that directory preselects it. A sticky theater no longer in
  the file falls back to the default (first line). The map grows one entry per
  directory ever fired from — bounded by real use; if it ever needs trimming, that's
  a future one-liner, noted not built.
- **Grand Architect unchanged:** GA stamps no theater (one office — 13's ruling), so
  with GA selected the cycle changes nothing visible; the footer tells the truth.
  No special case in the cycle itself.
- **Counter unchanged:** lineages key the full prefix, so `architect-pods-NN` and
  `architect-bob-NN` count independently for free; the `+`/`-` seed path works per
  theater.
- **Eject unchanged:** the index-blind one-off escape hatch, by design.
- **Inherited from 13-F1 (ruled in 2026-08-24, moved off row 11's rebase):**
  `lab/08/run` derives the mantle row and bracket counts from `presets.tsv` instead
  of hard-coding them — a data-file edit can never silently rot the harness again.

## Acceptance criteria — the DoD

Evidence: `lab/08/run` extended, green, **no regressions**, byte assertions.

- [ ] Cycle order and wrap asserted byte-level against a fixture `.summon-theaters`
      (bob → lunchbox → pods → bob); default is the first line; missing file falls
      back to `${PWD:t}` (13's arms stay green untouched)
- [ ] Sticky: fire with a cycled theater → next open in the same directory
      preselects it; a different directory is unaffected; a sticky theater removed
      from the file falls back to the default — all asserted
- [ ] On-fire-only law: an abort after cycling persists nothing
- [ ] `t` reserved: a `presets.tsv` row keyed `t` gets the existing reserved-key
      treatment, asserted
- [ ] The re-stamped name is visible in the panel footer (first-paint pty assertion
      per 13-F8)
- [ ] Lineage independence: `architect-pods` and `architect-bob` count separately
      from one fixture log
- [ ] Budget holds: the file is read once at panel open; the cycle is O(1) in the
      keystroke loop; ≤ 5 ms/keystroke numbers pasted
- [ ] 60-column law holds with the longest theater name in the fixture
- [ ] 13-F1 guard: `run` derives mantle row + bracket counts from `presets.tsv`;
      asserted by editing a scratch preset in the sandbox and watching the harness
      follow
- [ ] `lab/08/run` fully green, count pasted here
- [ ] README: the theater cycle — the file, the `t` key, stickiness, the GA
      no-op, the eject caveat
- [ ] Felix's smoke: drop `.summon-theaters` in bob, cycle to pods, fire, read
      `architect-pods-NN` in the title; reopen the panel and find pods preselected

## Out of scope — defended

- Walking parent directories for `.summon-theaters` — cwd only; fire at repo roots.
- Concurrent campaigns needing *different* theaters from the same directory in the
  same breath — the cycle is two keystrokes; eject remains the oddball hatch.
- Theater in Grand Architect stamps — ruled out at 13, stands.
- Parsing session names anywhere; `presets.tsv`/`accounts.tsv` format changes;
  `/rename` automation.
- State-map trimming — noted in the scheme, not built.

## Findings

*(append here — deviations from spec, discoveries, parked adjacents)*

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the order at ~/code/agents/plans/14-summon-rig-theater-cycle.md.
```
