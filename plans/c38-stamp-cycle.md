# C38 — the stamp cycle

**Status:** OPEN — laid 2026-08-31 · **Depends on:** — · **Staffing:** Builder · opus-high
· **Parallel-safe with:** C39 (different trees — `summon/` here, `doctrine/` there; both only read `canon/BUILDINGS.md`)

## Mission

Theaters die (D79, ⬡✓ 2026-08-31 — "the best part is no part"): the summon panel's
campaign stamp derives from the building register instead of `.summon-theaters`
files. Same mechanism, no data — `^G t` cycles, sticky per directory, lineage
counters per stamp, GA untouched.

## Inputs — read before working

- [canon/BUILDINGS.md](../canon/BUILDINGS.md) — the register; this charge is its
  first machine reader (Name · Kind · Root). Do not re-derive the design: D79 in
  [DECISIONS.md](../DECISIONS.md) is the ruling.
- `summon/summon.zsh` — the panel; `summon/README.md`, the theater-cycle section —
  the law being replaced.
- `lab/08/` — the rig harness; baseline 215 PASS · 0 failure(s) (C37's landing).

## Spec (blessed with D79)

- **The cycle:** at panel open, the stamp list = register rows whose Root (after
  `~`-expansion) equals the fire cwd, plus every row whose Root sits under it; the
  cwd's own row leads and is the default; remaining rows in file order. The stamp
  is the selected row's **Name** — manny stamps `manny` from its `user-manual`
  checkout, never the directory name.
- **Fallback:** an unregistered cwd stamps its directory name, exactly as today.
  `.summon-theaters` reading is removed entirely; bob's file is deleted at landing
  (its own repo, its own commit — named here per DOCTRINE §5; agents' is already
  gone).
- **Sticky law kept:** the fired stamp is remembered per fire directory
  (on-fire-only; an abort persists nothing); a sticky stamp no longer derivable
  falls back to the default. The rig may rename `log/theaters` → `log/stamps`.
- **The word dies:** "theater" leaves the rig's surfaces — panel row, footer, key
  help, README section; successor speech: the stamp cycle. The `t` key stays.
- **GA unchanged:** carries no stamp; the cycle changes nothing that fires.
- **Malformed register row:** the panel refuses to open, naming the row — the
  existing refuse-on-bad-line law, retargeted at the register.
- **Harness:** lab/08's theater arms are replaced by derivation arms — the derived
  cap-mega cycle (host + three tenants), Name-over-dirname at a worktree root, the
  unregistered fallback, the sticky fallback, the GA no-op. Arms run against a
  fixture register, never the live file.

## Out of scope

Register format changes (a format ask is an escalation, never an edit) · the
doctrine parser (C39) · stigmergon · any new stamp feature.

## Done when:

- `./lab/08/run` FINISHED green, new arms included; the count at landing recorded
  under Findings with the arm names.
- `grep -ri theater summon/` — zero hits outside `log/` history.
- `find ~/code -maxdepth 3 -name ".summon-theaters"` — empty; bob's deletion
  committed in bob.
- A panel open at `~/code/universal_robots_sdk/cap-mega` shows the derived cycle —
  a drive.exp arm or Felix's smoke, either, evidenced.

## Findings

*(append here)*

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/c38-stamp-cycle.md and build it.
```
