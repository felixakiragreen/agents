# 014 — summon rig: the theater cycle

**Status:** LANDED 2026-08-24 (Builder · opus-high) — DoD green; the smoke ⬡✓ 2026-08-29
(moved from the board row at G3's prune, 2026-09-02). · **Depends on:** 013 LANDED; **serial
with 011** (shared files: `summon/summon.zsh`, `lab/008` — never both in flight; 011 is
deferred, so 014 is dispatchable) · **Staffing:** Builder · opus-high · **Blessed:**
Felix's ask 2026-08-22 (campaign theaters inside one repo — `architect-pods-NN` fired
from bob); both design forks ruled by him 2026-08-24: the `t` key, sticky per
directory.

## Mission

A campaign is not always a directory. Row 013 stamps theater as `${PWD:t}`, which is
right when the repo is the theater — but bob hosts three (bob, lunchbox, pods), and
firing from a campaign subdirectory is the wrong fix: Claude Code keys history,
`/resume`, and auto-memory to the launch cwd, so deep-firing fragments the project
silo even though parent CLAUDE.mds still load. Felix fires at repo roots; the rig
must let the *stamp* carry the campaign. Eject can't — hand-edits never pass
`_summon_resolve`, so the lineage counter goes blind (013's asymmetry, confirmed by
Felix: "that kills the summon index"). The cycle goes through resolve, so every
campaign session is stamped, logged, and counted.

## Inputs — read before working

- `summon/summon.zsh` — `_summon_resolve`, the name-stamp and ordinal scan (13,
  commit `0cf4f0f`), the reserved-key handling for `+`/`-`, the state file law
  (four fields persist **on fire only**).
- `lab/008/run` + `name.exp` — 013's harness arms; 013-F8 binds: only a panel's *first*
  paint can be asserted from a pty.
- `summon/README.md` §the name-stamp — extend, don't fork.
- `plans/013-summon-rig-name-stamp.md` findings F1, F7–F9.

## The scheme — ruled at the cut

- **`.summon-theaters`** in the fire directory (cwd only — no parent walk; Felix
  fires at repo roots): one theater per line, non-empty lines only, first line the
  default. Committed to each repo that wants it — the campaign list is repo truth.
  No file → `${PWD:t}` exactly as row 013 (the `root` fallback at `/` — 013-F9 —
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
- **Grand Architect unchanged:** GA stamps no theater (one office — 013's ruling), so
  with GA selected the cycle changes nothing visible; the footer tells the truth.
  No special case in the cycle itself.
- **Counter unchanged:** lineages key the full prefix, so `architect-pods-NN` and
  `architect-bob-NN` count independently for free; the `+`/`-` seed path works per
  theater.
- **Eject unchanged:** the index-blind one-off escape hatch, by design.
- **Inherited from 013-F1 (ruled in 2026-08-24, moved off row 011's rebase):**
  `lab/008/run` derives the mantle row and bracket counts from `presets.tsv` instead
  of hard-coding them — a data-file edit can never silently rot the harness again.

## Acceptance criteria — the DoD

Evidence: `lab/008/run` extended, green, **no regressions**, byte assertions. Built
2026-08-24 (Builder · opus-high), commits `70c96cf` (rig), `6092663` (harness),
`ecba256` (README).

- [x] Cycle order and wrap asserted byte-level against a fixture `.summon-theaters`
      (bob → lunchbox → pods → bob); default is the first line; missing file falls
      back to `${PWD:t}` (013's arms stay green untouched)
      → `lab/008/run` §*the theater cycle: the campaign the stamp carries*, whole-line
      assertions on the composed command:
      ```
      PASS  no press: the default theater is the first line of .summon-theaters (1)
      PASS  one t: the second line (1)
      PASS  two: the third (1)
      PASS  three: the cycle wraps back to the first (1)
      PASS  the theater travels with the file, not the directory name (1)
      PASS  no .summon-theaters: the theater is $PWD, and t is inert rather than an error (1)
      PASS  the Grand Architect keeps no theater, so the cycle changes nothing it fires
      PASS  ...and what the GA fires is the untheatered stamp itself
      ```
      Every one is the full line
      `CLAUDE_CONFIG_DIR=~/.claude-thg-fgreen claude --model fable --effort high -n <stamp> "/color green"`.
- [x] Sticky: fire with a cycled theater → next open in the same directory
      preselects it; a different directory is unaffected; a sticky theater removed
      from the file falls back to the default — all asserted
      → `theater.exp`, live pty, one sandbox, log and map starting empty:
      ```
      PASS  a t on the way past: the fire carries the campaign, not the directory (1)
      PASS  the next open in that directory preselects it — whole, on the first paint
      PASS  ...and the refire fires exactly that, continuing the campaign lineage (1)
      PASS  a different directory filing the same list keeps its own default (1)
      PASS  a sticky theater the list no longer carries falls back to the default (first line) (1)
      PASS  the map is one line per fire directory, keyed by the directory itself (1)
      PASS  ...and the other directory kept its own entry (1)
      PASS  nothing else is in it: two directories were fired from, two lines (2)
      ```
- [x] On-fire-only law: an abort after cycling persists nothing
      → `log/theaters` copied either side of a `^G t t Esc` and byte-compared:
      `PASS  an abort after cycling persists nothing: the map is byte-identical across it`,
      and the next fire proves it behaviourally too —
      `PASS  and the fire after that abort still carries what the last fire made sticky (1)`
      (`architect-lunchbox-03`, not the `bob` two presses would have left).
- [x] `t` reserved: a `presets.tsv` row keyed `t` gets the existing reserved-key
      treatment, asserted
      → ```
      PASS  a preset claiming the theater key gets the reserved-key treatment, not the panel
      PASS  and it never reaches the mantle row (0)
      PASS  the reserved set is the whole panel: models, efforts, n, y, ., t, digits, the ± bumps
      ```
      the last being `(reserved: f o s k l m h x M n y . t 0 1 2 3 4 5 6 7 8 9 + -)`.
- [x] The re-stamped name is visible in the panel footer (first-paint pty assertion
      per 013-F8)
      → rendered: `⏎  architect-lunchbox-01 · fable-high @ thg-fgreen · green · keys: 2`
      (the cycled panel, byte-exact); and on a real screen, the first paint of the panel
      reopened in a directory that fired a cycled theater:
      `⏎  architect-lunchbox-02 · fable-high @ thg-fgreen · green · keys: 1`.
- [x] Lineage independence: `architect-pods` and `architect-bob` count separately
      from one fixture log
      → one fixture log carrying `architect-bob-02`, `architect-bob-04`,
      `architect-pods-01` → the three cycle positions stamp `architect-bob-05`,
      `architect-lunchbox-01`, `architect-pods-02`. Live, `theater.exp` fires
      `architect-bob-01` from one directory and `architect-bob-02` from another —
      the ordinal follows the campaign, not the fire directory.
- [x] Budget holds: the file is read once at panel open; the cycle is O(1) in the
      keystroke loop; ≤ 5 ms/keystroke numbers pasted
      → `.summon-theaters` is moved away *after* the open, then 500 repaints:
      `PASS  the cycled theater outlives the file: the list is read once, at open, and never again`
      (a re-read would have fallen back to `${PWD:t}`). Cost, load avg 5.9:
      ```
      per panel open, the one read of the list:  0.054 ms
      per keystroke, a campaign list in play:    1.803 ms   (budget ≤ 5 ms)
      per t press, the cycle itself:             0.0052 ms
      per keystroke  (full panel render + resolve):   1.724 ms  (unchanged arm)
      per keystroke,  usage configured (3 caches):    2.777 ms  (unchanged arm)
      ```
- [x] 60-column law holds with the longest theater name in the fixture
      → `PASS  every panel line fits 60 columns (widest 58)` on the cycled panel
      (`lunchbox`, the longest of the three); the three pre-existing 60-column arms
      still read 57.
- [x] 013-F1 guard: `run` derives mantle row + bracket counts from `presets.tsv`;
      asserted by editing a scratch preset in the sandbox and watching the harness
      follow
      → ```
      PASS  a preset added to the data file lands in the row the harness derived from it (1)
      PASS  and the bracket count follows the data too — one per item, derived (24)
      PASS  ...which is the scratch preset appearing in both
      ```
      and the guard proved live, both ways, by appending one row to the **real**
      `summon/presets.tsv` and running both harnesses: the new one stays green with
      the counts following (24 items, 197/0 at the time of that check), the pre-14 one
      goes red in exactly the three places 013-F1 predicted —
      ```
      FAIL  mantle row, ● swatches, [n]one, ✓ inline on the selected item
      FAIL  every opening bracket grey — one per item — expected 23, got 24
      FAIL  every closing bracket too — expected 23, got 24
      ```
- [x] `lab/008/run` fully green, count pasted here
      → **200 assertions, 0 failures**, exit 0 — four consecutive runs:
      ```
      run 1: exit=0 · 200 PASS · 0 failure(s)
      run 2: exit=0 · 200 PASS · 0 failure(s)
      run 3: exit=0 · 200 PASS · 0 failure(s)
      run 4: exit=0 · 200 PASS · 0 failure(s)
      ```
      (was 170 at row 013; all 170 still green, none weakened — two were *strengthened*,
      see F3.)
- [x] README: the theater cycle — the file, the `t` key, stickiness, the GA
      no-op, the eject caveat
      → `summon/README.md` §*The theater cycle — one repo, several campaigns*, plus the
      gesture-table row, the reserved-key list, `log/theaters` in the telemetry section
      and the test count.
- [x] Felix's smoke: drop `.summon-theaters` in bob, cycle to pods, fire, read
      `architect-pods-NN` in the title; reopen the panel and find pods preselected —
      ⬡✓ 2026-08-29 (the board's record, moved here 2026-09-02)

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

**F1 — a theater is argv, so a malformed list refuses the panel rather than firing.
Spec extension, deliberate.** The scheme says "one theater per line, non-empty lines
only". But the theater lands in `-n <mantle>-<theater>-NN`, which the widget puts in
`BUFFER` for zsh to *run*: a line reading `my repo` composes
`-n architect-my repo-01` and launches with two arguments, and a line reading `-pods`
makes a bare launch's stamp `-pods-01` — an argv hazard, which is precisely 013-F9,
arriving this time from a data file rather than from `/`. So `_summon_theaters_load`
refuses a line that is not a plain name (`A-Z a-z 0-9 . _ -`, not leading `-`), loudly,
naming the line, exactly as `_summon_load` refuses a reserved key. Silently skipping was
the alternative and was rejected: a skipped line means `t` cycles past a campaign Felix
filed and believes in. Nine lines of rig, and one `if` to delete if Felix wants the
looser parse. Asserted live (`lab/008/badlist.exp`), because fail-fast code nothing
exercises is a liability:
```
PASS  a theater that is not a plain name refuses the panel, and names the line
PASS  and nothing is launched from it (0)
PASS  a leading dash too — a bare launch would have stamped a name that reads as a flag
```

**F2 — the sticky map lives in `log/theaters`, not `log/state`.** The order says "rig
state keyed by the fire directory". `log/state` is four scalar `field<TAB>value` lines
rewritten whole on each fire; the theater map is an unbounded directory→name map with a
different lifetime, and folding it in would have meant a value containing a tab and a
reader that special-cases one key. One file, one shape. Same on-fire-only law, written
beside `_summon_state_save` in the widget. **Also, only a directory that files a
`.summon-theaters` ever enters the map** — a directory with no list has no theater to
remember, and storing `${PWD:t}` for every directory ever fired from would grow the file
with noise that changes nothing. Observably identical; recorded because the order's
"one entry per directory ever fired from" reads wider than what was built.

**F3 — the harness had two assertions that only looked like assertions, and 013-F1's
guard exposed both.** Deriving the mantle row from `presets.tsv` meant the old literal
and the "one row per field at full width" check became the same string; the second was a
`check` (substring) on the *first three items only*, so a wrap at 200 columns would have
passed it. It is now a whole-line `line` assertion of the derived row — which is what its
name always claimed. The bracket counts likewise now come from the data (presets +
`[n]one` + the rig's own model/effort key namespaces + accounts + the four action keys),
so the two numbers cannot drift from the panel again.

**F4 — `local a=$1 b=${a}` does not see `a`.** `local key=$1 label=$2 cut=${${label:l}…}`
silently produced an empty `cut` for every item (and, under `set -u`, said so: *label:
parameter not set*). zsh sets a `local` statement's names one at a time but does not make
them visible to that same statement's later initialisers. The rig's own `_summon_item`
already splits the line for this reason; the harness's re-implementation now does too.
Cost: one red run. Worth recording because the failure is silent without `set -u`.

**F5 — the cycle's reach is bounded by the panel's runaway guard, harmlessly.** The
picker closes itself at 32 keystrokes, so one panel can cycle about 28 positions. A list
longer than that cannot be walked end-to-end in a single open — the next panel resumes
from wherever the last one fired, exactly like 013-F7's seed ceiling. No limit is imposed
on the file's length: truncating a campaign list would be a lie, and a list that long is
self-punishing. Parked, not fixed.

**Adjacent, untouched:** `summon-stats` still counts mantle × account and now has a
second dimension it says nothing about — theaters. A per-campaign report is the obvious
next one, and it is the same parked adjacent 13 left behind (lineages), so they should
land together or not at all.

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the order at ~/code/agents/plans/014-summon-rig-theater-cycle.md.
```
