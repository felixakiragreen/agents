# 13 — summon rig: the name-stamp

**Status:** OPEN · **Depends on:** — *(was 11, a file-collision ordering; 11 deferred
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
09-F10(b).

- [ ] The composed command carries `--name` with the exact stamp — ordinal included —
      for preset × theater × log-history combinations, asserted byte-level against
      fixture logs (empty log → `01`; seeded log → max+1; null-name legacy records
      skipped)
- [ ] `+`/`-` bump the ordinal (floor `01`); a fired bump lands in the record's
      `name` field and the next derivation reads it — the seed flow asserted
      end-to-end (derive `01` → bump to `09` → fire → next derives `10`)
- [ ] The full derived name is visible in the panel footer before firing
- [ ] Only fired records (pick, eject) advance the counter; aborts asserted inert
- [ ] Bare launch (`[n]one`) stamps `<theater>-<NN>`; eject shows the stamp in
      the buffer
- [ ] `--name` verified against the live `claude --help` (one grep, pasted here) —
      the probe's facts re-checked, not trusted
- [ ] 60-column law holds — the longer command wraps clean wherever the panel or
      buffer shows it
- [ ] The 10-F1 budget holds: counter derivation is one pass at panel open, O(1)
      lookup in the keystroke loop — no per-keystroke log scan
- [ ] `lab/08/run` fully green, count pasted here
- [ ] README: the name-stamp section — the scheme, the ordinal + bump keys, the
      eject escape hatch, the resume-handle bonus
- [ ] Felix's smoke: fire one summons, bump a lineage to his hand-count, see the
      name in the terminal title and the roster

## Out of scope — defended

- Parsing session names anywhere (roster tooling, sweeps) — that is the parked
  peer-plane work; the convention canonizes by harvest only when a parser exists.
- Renaming live sessions, `/rename` automation, or any post-launch mechanism.
- ~~`invocations.jsonl` schema changes — the stamp is derivable from fields already
  logged.~~ — **struck 2026-08-22:** the ordinal needs the fired name on the record;
  the `name` field is in scope (and only it).
- Any change to `presets.tsv` / `accounts.tsv` formats.
- Reading Claude's own session metadata for the counter — the log is the rig's one
  source of truth; hand-renamed history seeds via the bump, not via harness-internal
  files.

## Findings

*(append here — deviations from spec, discoveries, parked adjacents)*

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the order at ~/code/agents/plans/13-summon-rig-name-stamp.md.
```
