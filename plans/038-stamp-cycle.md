# 038 — the stamp cycle

**Status:** **LANDED** 2026-08-31 — 228 PASS · 0 failure(s); findings F1–F9 below · **Depends on:** — · **Staffing:** Builder · opus-high · **Parallel-safe with:** 039 (different trees — `summon/` here, `doctrine/` there; both only read `canon/BUILDINGS.md`)

## Mission

Theaters die (D79, ⬡✓ 2026-08-31 — "the best part is no part"): the summon panel's campaign stamp derives from the building register instead of `.summon-theaters` files. Same mechanism, no data — `^G t` cycles, sticky per directory, lineage counters per stamp, GA untouched.

## Inputs — read before working

- [canon/BUILDINGS.md](../canon/BUILDINGS.md) — the register; this charge is its first machine reader (Name · Kind · Root). Do not re-derive the design: D79 in [DECISIONS.md](../DECISIONS.md) is the ruling.
- `summon/summon.zsh` — the panel; `summon/README.md`, the theater-cycle section — the law being replaced.
- `lab/008/` — the rig harness; baseline 215 PASS · 0 failure(s) (037's landing).

## Spec (blessed with D79)

- **The cycle:** at panel open, the stamp list = register rows whose Root (after `~`-expansion) equals the fire cwd, plus every row whose Root sits under it; the cwd's own row leads and is the default; remaining rows in file order. The stamp is the selected row's **Name** — manny stamps `manny` from its `user-manual` checkout, never the directory name.
- **Fallback:** an unregistered cwd stamps its directory name, exactly as today. `.summon-theaters` reading is removed entirely; bob's file is deleted at landing (its own repo, its own commit — named here per DOCTRINE §5; agents' is already gone).
- **Sticky law kept:** the fired stamp is remembered per fire directory (on-fire-only; an abort persists nothing); a sticky stamp no longer derivable falls back to the default. The rig may rename `log/theaters` → `log/stamps`.
- **The word dies:** "theater" leaves the rig's surfaces — panel row, footer, key help, README section; successor speech: the stamp cycle. The `t` key stays.
- **GA unchanged:** carries no stamp; the cycle changes nothing that fires.
- **Malformed register row:** the panel refuses to open, naming the row — the existing refuse-on-bad-line law, retargeted at the register.
- **Harness:** lab/008's theater arms are replaced by derivation arms — the derived cap-mega cycle (host + three tenants), Name-over-dirname at a worktree root, the unregistered fallback, the sticky fallback, the GA no-op. Arms run against a fixture register, never the live file.

## Out of scope

Register format changes (a format ask is an escalation, never an edit) · the doctrine parser (039) · stigmergon · any new stamp feature.

## Done when:

- ✓ `./lab/008/run` FINISHED green, new arms included; the count at landing recorded under Findings with the arm names.

  ```
  0 failure(s)
  ```
  228 PASS · 0 failure(s) (control at 037's landing: 215 · 0). Four consecutive clean runs; the arm names are in F8.

- ✓ `grep -ri theater summon/` — zero hits outside `log/` history.

  ```
  $ grep -rniI theater summon/ | grep -v '^summon/log/'
  $ echo "residue exit=$?"
  residue exit=1
  ```
  The unfiltered grep hits only `summon/log/archive/*.jsonl` — gitignored session transcripts, which are `log/`.

- ✓ `find ~/code -maxdepth 3 -name ".summon-theaters"` — empty; bob's deletion committed in bob.

  ```
  $ find ~/code -maxdepth 3 -name ".summon-theaters"
  $
  ```
  bob's commit: `b399bc0`. It carries the `.gitignore` rule, not the file — see F5.

- ✓ A panel open at `~/code/universal_robots_sdk/cap-mega` shows the derived cycle — a drive.exp arm or Felix's smoke, either, evidenced.

  The live rig, live register, real log, rendered at cap-mega (`lab/008/render.zsh`, the panel's own renderer, escapes stripped):

  ```
  summon
  mantle   ● [g]rand-architect  ● [a]rchitect·high  ● [A]rchitect·max  ● [b]uilder ✓  ● [D]igger  ● m[e]ntat  ● [F]ixer  [n]one
  model    [f]able  [o]pus ✓  [s]onnet  hai[k]u
  effort   [l]ow  [m]edium  [h]igh ✓  [x]high  [M]ax
  account  [0] personal  [1] thg-fgreen ✓  [2] thg-doorbell
  s[t]amp  cap-mega ✓  simmy  snappy  spacex-dashboard  manny
  usage    0  sess —         week 64%+17    fable 62%+19
           1  sess —         week 32%+30    fable 50%+12
           2  sess 32%+37    week 75%+15    fable 73%+17
           [y]ank  [.] eject  [Esc] close  [Enter] invoke
  ⏎  builder-cap-mega-01 · opus-high @ thg-fgreen · blue · keys: 2
  --- cmd
  CLAUDE_CONFIG_DIR=~/.claude-thg-fgreen claude --model opus --effort high -n builder-cap-mega-01 "/color blue"
  ```

  ...and the same panel with four `t` presses:

  ```
  CLAUDE_CONFIG_DIR=~/.claude-thg-fgreen claude --model opus --effort high -n builder-manny-01 "/color blue"
  ```

## Findings

**F1 — the cycle is host + FOUR tenants, not three.** The spec's harness bullet names "the derived cap-mega cycle (host + three tenants)"; the register puts four buildings under `~/code/universal_robots_sdk/cap-mega` — simmy, snappy, spacex-dashboard and manny (whose declared worktree root sits under it too, D79's own example). The spec's rule — "every row whose Root sits under it" — is unambiguous, so the rule was built and the parenthetical read as a miscount, not a contract. Five stamps, evidenced above and in the arms. No escalation: a gloss lost an argument with the rule it glosses.

**F2 — the stamp row paints only where there is a choice** (`$#_summon_stamps > 1`). A row you cannot cycle is furniture: the footer already carries the stamp, so the row's whole job is the choice. D79's own principle at the kill — "the best part is no part". Consequence, worth knowing before anyone reports it as a regression: at `~/code/agents`, `~/code/hexwright`, bob and manny the panel is byte-identical to today's, and only a host with tenants grows a row. If Felix wants the row always-on (it would show Name-over-dirname at manny without reading the footer), it is one character — `> 1` → `(( $#_summon_stamps ))` — plus the two `count … 0 's[t]amp'` arms.

**F3 — an unregistered cwd has no cycle, even with buildings under it.** The spec's list sentence, read alone, would make `~/code` cycle every building in the register with `agents` as the default; the fallback sentence — "an unregistered cwd stamps its directory name, exactly as today" — decides it, and "as today" means no row and an inert `t`. So membership attaches to the fire directory's own row and nothing else. Arm: `cap-mega/felix` (unregistered, holds spacex-dashboard) stamps `felix`. Written into the README so the next reader does not have to re-derive it.

**F4 — zsh hazard: `${${~root}:A}` returns a corrupted path.** Nesting the `~` flag inside a modifier leaves zsh's internal glob tokens in the result — on zsh 5.9 every `-` in the path comes back as a raw 0x9B, so *no register root ever matched* and every directory silently fell back to its own name. Measured under `set -x`, not guessed. Split into two statements, with the reason in the code. The same shape appears wherever this rig tilde-expands a data-file path; `_summon_usage_service`'s `local dir=${~1}` is safe because it does not nest.

**F5 — bob never tracked `.summon-theaters`, and neither did agents.** `git rm` in bob answered `pathspec … did not match any files`: bob's own `.gitignore:14` hid the file, exactly as this repo's `.gitignore` hid its own. So there was nothing to delete from history — the file was `rm`'d, and the dead ignore rule is what bob's commit carries (`b399bc0`; this repo's, `1acaf69`). For the record: README row 014 said "Commit it: the campaign list is repo truth", and both repos were ignoring it the whole time. The law never held; nothing depended on it.

**F6 — the register path is derived, with no test hook.** `SUMMON_REGISTER=${SUMMON_HOME:h}/canon/BUILDINGS.md`. Every lab/008 sandbox lives directly under `lab/008/out/`, so one generated fixture at `out/canon/BUILDINGS.md` serves all of them and no arm can reach the live file; the three arms that must mutate a register (the sticky-fallback pty run, the tilde run, the three bad rows) live one level deeper with their own. No env-var override reaches production code.

**F7 — the rig now depends on the register's format**, and a format change breaks the panel loudly rather than quietly: the table opens at its `|---|` separator row and ends where the pipes stop, every data row must be exactly three cells, and the Name must be a plain name. Kind is parsed and deliberately **not** validated — the cycle does not use it, and policing the vocabulary would make the panel refuse to open the day a third Kind is minted. `canon/BUILDINGS.md` already warns that format changes ride this harness (its bullet 3); a canon note spelling out these four constraints would be worth an Architect's minute, and is not mine to add.

**F8 — the arms, and the mutations that prove them.** New section `--- the stamp cycle: derived from the building register ---`: the bob cycle and its three lineages counted apart · the row's list, ✓ movement, pink label, grey brackets, grey and bold items · the whole cap-mega cycle (six renders, one per position plus the wrap) · Name-over-dirname at manny's worktree root · the lone row painting no row · the unregistered fallback · the table-shaped line below the closing prose · buildings under an unregistered directory · the GA no-op · the 60-column fit · `~`-expansion against a rewritten `$HOME`. Then `--- sticky per directory, on fire only (live) ---` (`stamp.exp`, seven gestures, five fires) and `--- a register the rig will not fire from ---` (`badrow.exp` ×3). Falsifiability was measured, not assumed — five mutations, each reverted:

| mutation | result |
|---|---|
| the `~` expansion dropped | 1 failure — the tilde arm, and only it |
| the cwd's own row no longer leads | 20+ failures across both cycles |
| the table no longer ends where the pipes do | 40+ failures — the ghost row registers `hive` under another Name, and the whole drive goes with it |
| a lone row paints a stamp row anyway | 1 failure |
| the plain-name refusal removed | the two refusal arms |

**F9 — one deferred lab/008 item died on the way past.** BOARD's deferred list names "the `run:407` dead assertion (its subject file is created at line 413, after it fires)". That was `count 'no .summon-theaters ⇒ no theater row at all' 0 … theater-nofile.txt`, passing on `count`'s silent-0 over a missing file. Its successor asserts against a file that already exists. The other two items in that bullet — the typed-literals arm (029-F4) and `count`'s silent-0 itself — are untouched and still owed; the silent-0 is precisely what let the dead assertion pass for a fortnight.

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/038-stamp-cycle.md and build it.
```
