# 13 — summon rig: the name-stamp

**Status:** LANDED 2026-08-22 (Builder · opus-high) — DoD green; smoke ✓ Felix
2026-08-22. · **Depends on:** — *(was 11, a file-collision ordering; 11 deferred
by Felix 2026-08-08, so this row goes first and 11 rebases on it — never both in
flight)* · **Staffing:**
Builder · opus-high · **Blessed:** Architect cut 2026-08-08 on Felix's standing call
(2026-08-08, `plans/quartermaster.md` §5 — the stamp is his ask; the scheme below is
the Architect's delegated design).

## Mission

Every session the rig fires is born named. The peer-plane roster's only semantic
carrier is the session name (`plans/quartermaster.md` §1). Since row 09 the rig stamps
the bare mantle (`-n architect` — `_summon_resolve`), and Felix hand-renames in-session
(`/rename grand-architect-08`), counting lineage ordinals in his head. The rig knows
mantle, theater, and the lineage's history at fire time; stamp the full name and
count for him.

## Inputs — read before working

- `summon/summon.zsh` (`_summon_compose` — the fired command is
  `CLAUDE_CONFIG_DIR=<dir> claude --model <m> --effort <e>`), `lab/08/run`.
- `plans/quartermaster.md` §5 — the routing and the ask.
- 10-F3's lesson binds: `presets.tsv` / `accounts.tsv` are harness fixtures as well as
  rig data — extend the harness in the same change.
- **Known, do not re-derive** (probed 2026-08-08, build ~2.1.x — re-verify with one
  `claude --help` grep before building, the facts rot): `claude --name <name>` (short
  `-n`) sets the session display name at launch — shown in the prompt box, `/resume`
  picker, terminal title, and the statusline `session_name` field — and unlike the
  auto-generated defaults it is a **resume handle** (`claude --resume <name>`).
  In-session rename is `/rename <name>`. No env var does this.

## The scheme — ruled at the cut, amended 2026-08-22 (Architect; Felix's numbering
## ask, ISSUES 2026-08-16 archived at 04152cf, rulings in-session 2026-08-22)

- The composed command gains `--name <mantle>-<theater>-<NN>`:
  - **mantle** — the preset's mantle field verbatim (`architect`, `grand-architect`, …).
  - **theater** — `${PWD:t}` at fire time. No `git rev-parse` (a fork the string
    doesn't need); firing from a subdirectory stamps the subdirectory — Felix summons
    at repo roots, and if this ever lies in practice it's a one-line revisit.
    **Grand Architect excepted** (Felix, 2026-08-22, overruling the Architect's
    uniform-scheme draft): there is only one office — its theater is redundancy, not
    information. `grand-architect` stamps `grand-architect-<NN>`, no theater segment;
    every other mantle carries theater.
  - ~~**account** — the `accounts.tsv` label verbatim~~ — **struck 2026-08-22
    (Felix):** accounts are quota arbitrage, not identity (MAP §5); the account never
    enters the name.
  - **NN** — the auto-derived lineage ordinal, `%02d` (three digits past 99): one
    more than the highest ordinal ever fired under the same prefix. A lineage the
    log has never seen derives `01`.
  - Example: `architect-agents-05`.
- **Ordinal mechanics:**
  - **Counter source** `log/invocations.jsonl`: **one pass at panel open** builds a
    `prefix → max ordinal` map; `_summon_resolve` does an O(1) lookup. Never a
    per-keystroke scan — the 10-F1 budget (≤ 5 ms/keystroke) binds; the open-time
    pass is outside it but stays a single pass.
  - **The record gains a `name` field** — the fired stamp, post-bump — logged like
    every other resolved field. Records that predate the field read as null and are
    skipped by the counter. *(This strikes the old out-of-scope line barring
    `invocations.jsonl` schema changes.)*
  - **`+` / `-` bump the panel's ordinal** up/down (floor `01`); the full derived
    name is visible in the panel footer before firing, always. The bump is both the
    **seed path** and the **correction path** (Felix, 2026-08-22: no synthetic seed
    records, **no restart at 01**): the first stamped fire of a hand-counted lineage,
    Felix bumps to where his count stands — `grand-architect` opens at `01`, he bumps
    to `09`, fires — and the log carries the lineage forward; the next open derives
    `10`.
  - Only **fired** invocations advance the counter (pick and eject modes); aborts
    never do. Eject-buffer hand-edits to the name are invisible to the counter — the
    bump is the correction that counts.
- **Bare launches** (`[n]one` — no mantle) drop the mantle segment: `<theater>-<NN>`,
  same counter law.
- **Eject** (`[.]`) carries the stamp in the editable buffer like every other flag —
  Felix can change or delete it before firing; that is the point of eject.
- ~~**Duplicates pre-ruled: no uniquifying suffix.**~~ — **superseded 2026-08-22**
  (Felix's numbering ask): the ordinal *is* the uniquifier; every stamp is a unique
  resume handle by construction.
- The naming convention returns to canon by harvest **if tools ever start parsing
  it** (quartermaster §5) — until then it is rig convention, documented in the README.

## Acceptance criteria — the DoD

Evidence: `lab/08/run` extended, green, **no regressions** — byte assertions per
09-F10(b). Built 2026-08-22 (Builder · opus-high), commits `0cf4f0f` (rig), `69cd986`
(harness), `0d94265` (README).

- [x] The composed command carries `--name` with the exact stamp — ordinal included —
      for preset × theater × log-history combinations, asserted byte-level against
      fixture logs (empty log → `01`; seeded log → max+1; null-name legacy records
      skipped)
      → `lab/08/run` §*the name-stamp: the lineage counter*, whole-line assertions on
      the composed command (`render.zsh` now prints `$_summon_cmd`):
      ```
      PASS  a log with no history at all: the lineage opens at 01 (1)
      PASS  the ordinal is one past the highest ever fired, not past the last one logged (1)
      PASS  a legacy record with no name field, and a null one, are both skipped (1)
      PASS  theater isolates the lineage: the same mantle elsewhere starts at 01 (1)
      PASS  the Grand Architect carries no theater — one office, so the segment says nothing
      PASS  ...so the Grand Architect counts one lineage across every theater
      ```
      The fixture log carries `…-03`, `…-07`, `…-05` in that order → the stamp is `08`,
      proving max-ever rather than last-fired.
- [x] `+`/`-` bump the ordinal (floor `01`); a fired bump lands in the record's
      `name` field and the next derivation reads it — the seed flow asserted
      end-to-end (derive `01` → bump to `09` → fire → next derives `10`)
      → `name.exp`, live pty, one sandbox, log starting empty:
      ```
      PASS  eight + seed a hand-counted lineage where Felix says his count stands (1)
      PASS  ...and the log carries it forward: the next open derives 10, with no restart at 01 (1)
      PASS  fifteen - stop dead at the floor: 01, never a zero or a negative ordinal (1)
      PASS  the counter is the highest ever fired, not the last one fired: 11 follows that 01 (1)
      PASS  and every fired stamp landed in its own record, for the next open to count
      ```
- [x] The full derived name is visible in the panel footer before firing
      → `⏎  architect-agents-09 · fable-high @ thg-fgreen · green · keys: 2` (bumped
      render, byte-exact), the floored twin beside it, and on a real screen:
      `⏎  architect-hive-09 · opus-max @ thg-fgreen · green · keys: 1` (`preview.exp`,
      whose next assertion is the launch that footer promised) plus
      `⏎  foundry-02 · fable-max @ personal · keys: 1` (`name.exp` G8). **F8** — a
      mid-gesture footer cannot be asserted from a pty at all; only a panel's first
      paint survives zle's character-level repaint.
- [x] Only fired records (pick, eject) advance the counter; aborts asserted inert
      → `PASS  an abort in between is inert — it fires nothing, so it counts for nothing: 12 (1)`,
      `PASS  every abort stamps null — nothing fired, so nothing counted`,
      `PASS  while the abort stamped null (1)`. Refire counts too — it launches a new
      session, so it takes a new ordinal (see F5).
- [x] Bare launch (`[n]one`) stamps `<theater>-<NN>`; eject shows the stamp in
      the buffer
      → `PASS  [n]one → bare launch: the theater stamp alone, no colour, no prompt (1)`
      (`… --effort high -n hive-01`), `PASS  a bare launch counts its own theater lineage,
      from 01 (1)`, and the ejects:
      `CLAUDE_CONFIG_DIR=~/.claude-thg-fgreen claude --model opus --effort max -n architect-hive-07 "/color green"`
      `CLAUDE_CONFIG_DIR=~/.claude claude --model fable --effort max -n grand-architect-01 "/color green"`
- [x] `--name` verified against the live `claude --help` (one grep, pasted here) —
      the probe's facts re-checked, not trusted
      → `claude --help | grep -iE -- '--name|--resume|--session'`, 2026-08-22:
      ```
        -n, --name <name>                     Set a display name for this session
        -r, --resume [value]                  Resume a conversation by session ID, or
        --session-id <uuid>                   Use a specific session ID for the
      ```
      The probe holds: `-n/--name` exists, is the display name, and `--resume` takes a
      value rather than only a uuid (`--session-id` is the uuid-only flag).
- [x] 60-column law holds — the longer command wraps clean wherever the panel or
      buffer shows it
      → `PASS  every panel line fits 60 columns (widest 57)` ×3 (panel, bare panel,
      usage block). The stamped footer wraps at its own ` · ` boundary:
      `⏎  architect-atelier-01 · fable-high @ thg-fgreen · green` / `   keys: 2`.
- [x] The 10-F1 budget holds: counter derivation is one pass at panel open, O(1)
      lookup in the keystroke loop — no per-keystroke log scan
      → the log file is moved away *after* the scan, then 500 repaints:
      `PASS  the ordinal outlives the log file: it was read once, at open, and never again`
      (a re-read would have fallen back to `01`). Cost:
      ```
      per keystroke, the stamp resolved with it: 1.741 ms      (budget ≤ 5 ms)
      per panel open, the one pass over the log:  0.008 ms     (8-record fixture)
      per keystroke  (full panel render + resolve):   1.689 ms (unchanged arm)
      per keystroke,  usage configured (3 caches):    2.699 ms (unchanged arm)
      ```
- [x] `lab/08/run` fully green, count pasted here
      → **170 assertions, 0 failures**, exit 0 — three consecutive runs, to catch the
      flake in F3:
      ```
      run 1: exit=0 · 170 PASS · 0 failure(s)
      run 2: exit=0 · 170 PASS · 0 failure(s)
      run 3: exit=0 · 170 PASS · 0 failure(s)
      ```
      (was 134 at row 10; 3 of those were red on arrival — F1.)
- [x] README: the name-stamp section — the scheme, the ordinal + bump keys, the
      eject escape hatch, the resume-handle bonus
      → `summon/README.md` §*The name-stamp — every session born named*, plus the
      gesture table, the reserved-key list, the telemetry schema and the test count.
- [x] **Felix's smoke**: fire one summons, bump a lineage to his hand-count, see the
      name in the terminal title and the roster → ✓ Felix 2026-08-22, "it works"

## Out of scope — defended

- Parsing session names anywhere (roster tooling, sweeps) — that is the parked
  peer-plane work; the convention canonizes by harvest only when a parser exists.
- Renaming live sessions, `/rename` automation, or any post-launch mechanism.
- ~~`invocations.jsonl` schema changes — the stamp is derivable from fields already
  logged.~~ — **struck 2026-08-22:** the ordinal needs the fired name on the record;
  the `name` field is in scope (and only it).
- Any change to `presets.tsv` / `accounts.tsv` formats. *(Held: the files are untouched.
  The harness assertions that read their **content** were repaired — F1.)*
- Reading Claude's own session metadata for the counter — the log is the rig's one
  source of truth; hand-renamed history seeds via the bump, not via harness-internal
  files.

## Findings

*(append here — deviations from spec, discoveries, parked adjacents)*

**F1 — the harness was already red, and `presets.tsv` is why.** `lab/08/run` failed 3
assertions before a byte of this order was written: the mantle-row literal and the two
bracket counts (22, now 23) predate the `D digger` preset Felix added on 2026-08-09.
10-F3 said it out loud — `presets.tsv` is a harness fixture as well as rig data — but
nothing *enforces* it, so a one-line data edit rotted the harness for a fortnight and
row 13 is the session that found out. Fixed here (the DoD wants green). **The parked
adjacent:** a data-file edit and its harness sweep are two acts joined only by memory;
the cheap guard would be for `run` to derive the mantle row and the bracket count from
`presets.tsv` rather than hard-code them — not done, out of scope.

**F2 — two drive assertions had their labels crossed.** `'h = [h]igh: the model stays
sonnet'` asserted `--model haiku`, and `'k = hai[k]u: the effort stays high'` asserted
`--model sonnet`. Both strings existed exactly once, so both passed and the harness read
as correct while documenting the opposite of what it proved. The ordinals made them
distinguishable and the swap fell out. Corrected. Living documentation only documents if
somebody reads it.

**F3 — a flaky assertion pinned a clock.** `'1 thg-fgreen        0 s  fresh'` asserts a
cache age of exactly zero seconds; on a loaded machine (load avg ~5) the fetch and the
report land in different seconds and the harness goes red for no reason. Replaced with a
`matches` helper (grep -E) and `^    1 thg-fgreen +[0-9]+ s  fresh$` — the claim was
always freshness, never zero. Three consecutive green runs stand as the evidence.

**F4 — the v1.1 byte-identity guarantee had to be narrowed, deliberately.** Row 10's
arm compares the current panel against `b426166`'s, byte for byte, to prove the usage
feature is opt-in. The name-stamp changes the footer and the command for *every*
configuration, so a whole-file `cmp` could not survive this order. The guarantee now
reads: **every panel row identical to v1.1** (footer and command excluded from the
`cmp`), with the two excluded lines asserted explicitly side by side —
`⏎  architect · fable-high @ …` (v1.1) against `⏎  architect-atelier-01 · fable-high @ …`
(now). Same protection against a usage-block leak; the deliberate change is stated
rather than deleted.

**F5 — "refire fidelity" means something new.** The old arm asserted a refire's command
is byte-identical to the pick it repeats. It cannot be any more: a refire launches a
*new session*, which needs its own handle, so exactly one field must differ — the
ordinal. The arm now asserts identity-but-for-the-ordinal, plus that the ordinal
advanced by exactly one (01 → 02). This is spec (the ordinal is the uniquifier), not
drift.

**F6 — bare launches now always carry `-n`.** The old assertion `'[n]one → bare launch:
no -n, no colour, no prompt'` is retired by the scheme (bare stamps `<theater>-<NN>`).
Colour and prompt still stay off; `-n` is now unconditional, and the `-n` gate in
`_summon_resolve` moved from "is there a mantle" to "is there a colour".

**F7 — the seed path is bounded by the runaway guard, at ~28 ordinals.** The panel
closes itself at 32 keystrokes, so `^G <preset> <account> +++… ⏎` can seed a lineage
about 28 ordinals up in one panel, no further. Felix's live counts (Grand Architect at
09) are nowhere near it, and the second panel continues from wherever the first fired,
so the ceiling is a nuisance rather than a wall. **Parked, not fixed** — if seeding ever
hurts, the fix is digit entry for the ordinal, which collides with the account digits
and is therefore a design question, not a patch.

**F8 — a mid-gesture panel cannot be asserted from a pty.** zle updates the footer
character by character, so after the first paint the transcript carries shredded
fragments (`grand-architect-[27@01 · fable-max @ no accountn account digi20] personal…`)
rather than lines. Whole-paint assertions must therefore be a panel's *first* paint —
which is why `name.exp` ends with a bare `^G … Esc` gesture whose only job is to show one
derived name whole on a real screen. This confirms the harness's founding note (row 08)
in a new place; recorded so the next builder doesn't rediscover it at cost.

**F9 — `${PWD:t}` is empty at `/`, and a bare launch there would have composed `-n -01`.**
A stamp whose first character is `-` is an argv hazard, not just an ugly name. Guarded:
the theater falls back to `root`. One expansion, no branch, and the only reachable way to
hit it is summoning from the filesystem root.

**Adjacent, untouched:** `summon-stats` still reports mantle × account and says nothing
about lineages, though the log now carries them. A `summon-stats` that counts sessions
per lineage is the obvious next report — not in this order's fence.

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the order at ~/code/agents/plans/13-summon-rig-name-stamp.md.
```
