# 13 — summon rig: the name-stamp

**Status:** OPEN · **Depends on:** — *(was 11, a file-collision ordering; 11 deferred
by Felix 2026-08-08, so this row goes first and 11 rebases on it — never both in
flight)* · **Staffing:**
Builder · opus-high · **Blessed:** Architect cut 2026-08-08 on Felix's standing call
(2026-08-08, `plans/quartermaster.md` §5 — the stamp is his ask; the scheme below is
the Architect's delegated design).

## Mission

Every session the rig fires is born named. The peer-plane roster's only semantic
carrier is the session name (`plans/quartermaster.md` §1), and today names are
hand-typed or defaulted — the roster is a wall of anonymous doors. The rig knows
mantle, theater, and account at fire time; stamp them.

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

## The scheme — ruled at the cut

- The composed command gains `--name <mantle>-<theater>-<account>`:
  - **mantle** — the preset's mantle field verbatim (`architect`, `grand-architect`, …).
  - **theater** — `${PWD:t}` at fire time. No `git rev-parse` (a fork the string
    doesn't need); firing from a subdirectory stamps the subdirectory — Felix summons
    at repo roots, and if this ever lies in practice it's a one-line revisit.
  - **account** — the `accounts.tsv` label verbatim (`personal`, `thg-fgreen`,
    `thg-doorbell`).
  - Example: `architect-agents-thg-doorbell`.
- **Bare launches** (`[n]one` — no mantle) drop the mantle segment: `<theater>-<account>`.
- **Eject** (`[.]`) carries the stamp in the editable buffer like every other flag —
  Felix can change or delete it before firing; that is the point of eject.
- **Duplicates pre-ruled: no uniquifying suffix.** Two `architect-agents-thg-doorbell`
  sessions on different days collide as resume handles; the roster distinguishes them
  by id and age, and resume-by-name ambiguity is a picker inconvenience, not a rig
  defect. Revisit only if it bites (harvest).
- The naming convention returns to canon by harvest **if tools ever start parsing
  it** (quartermaster §5) — until then it is rig convention, documented in the README.

## Acceptance criteria — the DoD

Evidence: `lab/08/run` extended, green, **no regressions** — byte assertions per
09-F10(b).

- [ ] The composed command carries `--name` with the exact stamp for preset × account
      combinations, asserted byte-level
- [ ] Bare launch (`[n]one`) stamps `<theater>-<account>`; eject shows the stamp in
      the buffer
- [ ] `--name` verified against the live `claude --help` (one grep, pasted here) —
      the probe's facts re-checked, not trusted
- [ ] 60-column law holds — the longer command wraps clean wherever the panel or
      buffer shows it
- [ ] No new forks in the keystroke loop (the stamp is string composition)
- [ ] `lab/08/run` fully green, count pasted here
- [ ] README: the name-stamp section — the scheme, the eject escape hatch, the
      resume-handle bonus
- [ ] Felix's smoke: fire one summons, see the name in the terminal title and the
      roster

## Out of scope — defended

- Parsing session names anywhere (roster tooling, sweeps) — that is the parked
  peer-plane work; the convention canonizes by harvest only when a parser exists.
- Renaming live sessions, `/rename` automation, or any post-launch mechanism.
- `invocations.jsonl` schema changes — the stamp is derivable from fields already
  logged.
- Any change to `presets.tsv` / `accounts.tsv` formats.

## Findings

*(append here — deviations from spec, discoveries, parked adjacents)*

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the order at ~/code/agents/plans/13-summon-rig-name-stamp.md.
```
