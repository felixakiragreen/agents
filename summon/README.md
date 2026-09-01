# summon — Ctrl-G ignition

**`Ctrl-G Enter` refires your last session in two keystrokes.** The panel opens with every
field already selected — mantle, model, effort, account — exactly like the Claude Code
model selector: change what you want, Enter fires it, and what fired is what the panel
promised. Every invocation is logged, so `presets.tsv` is only the hypothesis and
`log/invocations.jsonl` is the evidence. Every session it fires is born
named. Designed in [D34/D35/D36/D41/D79](../DECISIONS.md), built to
[plans/08](../plans/08-summon-rig.md), [plans/09](../plans/09-summon-rig-v11.md),
[plans/10](../plans/10-summon-rig-v12-usage.md),
[plans/13](../plans/13-summon-rig-name-stamp.md) and
[C38](../plans/c38-stamp-cycle.md), which superseded row 14 — the cycle's first
build, filed against per-directory list files (the board keeps its link).

## Install — one line, Felix's own repo

```zsh
source ~/code/agents/summon/summon.zsh      # → ~/.dotfiles/zsh/*.zsh
```

Nothing else: no plugin manager, no `PATH` entry. `reload` re-sources cleanly.

## The panel

Ctrl-G paints every live hotkey with the current selection ticked, and counts the keys you
have spent — the launch key included. The last line is the preview: exactly what Enter
will fire.

```
summon
mantle   ● [g]rand-architect  ● [a]rchitect·high ✓  ● [A]rchitect·max  ● [b]uilder  ● [D]igger  ● m[e]ntat  ● [F]ixer  [n]one
model    [f]able ✓  [o]pus  [s]onnet  hai[k]u
effort   [l]ow  [m]edium  [h]igh ✓  [x]high  [M]ax
account  [0] personal  [1] thg-fgreen ✓  [2] thg-doorbell
s[t]amp  cap-mega ✓  simmy  snappy  spacex-dashboard  manny
         [y]ank  [.] eject  [Esc] close  [Enter] invoke
⏎  architect-cap-mega-05 · fable-high @ thg-fgreen · green · keys: 2
```

Brackets and unselected items are grey; the selected item is bold and carries the ✓
inline. The header and the row labels run a gradient — summon blue · mantle green ·
model yellow · effort orange · account red · stamp pink · usage purple — and each
mantle's ● *and its label* wear its session colour, all through the S0 slot map (see
Data); the selected mantle's ● and brackets brighten to the foreground. The `stamp`
row appears only where the building register offers more than one building to choose
from, its cycle key riding the label itself (`s[t]amp`) since a Name may carry no t.
The panel measures `$COLUMNS` on every render and wraps at item boundaries only, never
mid-item — clean down to 60 columns, where a mantle appears with two presets on it.

**Enter, and only Enter, fires.** Every other key selects; nothing launches by
side-effect.

| Gesture | Keys | What launches |
|---|---|---|
| `^G ⏎` | 2 | **refire** — the last configuration, exactly |
| `^G <key> ⏎` | 3 | one field changed: a different model, effort, account or mantle |
| `^G <preset> <account> ⏎` | 4 | a fresh mantle on a named account |
| `^G n ⏎` | 3 | **bare** — model + effort only, no mantle, colour or prompt |
| `^G + / -` | +1 | bump the lineage ordinal the name-stamp will carry |
| `^G t` | +1 | cycle the stamp over the buildings at or under this directory |
| `^G <preset> y … ⏎` | +1 | `y` yanks the derived summons to the clipboard on the way past |
| `^G .` | 2 | **eject** — the resolved command lands in the line, editable, unlaunched |
| `^G <esc>` / `^G ^G` | 2 | close, discarding this panel's changes |

**Sticky, and only on fire.** The four fields persist in `log/state` when a launch
happens; Esc and a second Ctrl-G throw the panel's changes away. So the panel always opens
on the last thing that actually ran.

**Every key is global.** A preset key cascades mantle + model + effort; a model or effort
key afterwards overrides that one field and keeps the mantle — `^G A k ⏎` is architect on
haiku-max. `[n]one` clears the mantle: bare is a state, not a mode. haiku is **`k`**
(hai[k]u) so `h` is unambiguously **[h]igh**, and a fat-finger costs one key — press the
right one. An unrecognised key is ignored (and counted: the log never flatters).

Presets and accounts come from the data files, so the panel is always the truth. The panel
owns `f o s k` · `l m h x M` · `n` · `y` · `.` · `t` · `+` · `-` · the digits: a preset
claiming one makes the rig refuse to open, loudly, naming the key.

Enter refuses rather than guessing when the selection cannot launch — no model, no effort,
or no account. The account picks which subscription pays and which silo the work lands in,
so a guess is the one error the rig must never make; the preview footer says so before
Enter is pressed.

## The name-stamp — every session born named

The peer roster lists sessions by name and nothing else, so an unnamed session is an
anonymous door. The rig knows the mantle, the building and the whole lineage's history at
fire time, so it names the session itself: `--name <mantle>-<stamp>-<NN>`.

```
architect-agents-05     mantle · stamp · the fifth architect this building has seen
grand-architect-09      the Grand Architect carries no stamp — there is only one office
agents-03               a bare launch keeps no mantle: the stamp counts on its own
```

- **stamp** is the building register's Name for the directory you fire from, and that
  directory's own name where the register does not know it — Felix summons at building
  roots, so it reads as the project either way. The cycle below is how one root offers
  several.
- **NN** is the lineage ordinal: one more than the highest ever fired under that same
  prefix, counted from `log/invocations.jsonl` in a single pass when the panel opens (never
  per keystroke — the panel stays a builtins-only render). A lineage the log has never seen
  opens at `01`, and the count is of the highest ever fired, not the last.
- **`+` and `-` bump it**, floored at `01`, and the footer shows the full name before Enter
  is pressed. The bump is both the seed path and the correction path: the first stamped fire
  of a lineage Felix has been counting in his head opens at `01`, he bumps it to where his
  count actually stands, fires — and the log carries the lineage on from there. There are no
  synthetic seed records and no restart at `01`.
- **Only a fire counts.** Pick, refire and eject all stamp the record and advance the
  lineage; a close or a refusal launches nothing, so it stamps nothing. An eject drops the
  stamp into the editable line with everything else — change it, or delete it, before you
  press Enter; the counter never sees that edit, so the bump is the correction that counts.

**The stamp is also a resume handle.** Unlike Claude Code's own generated names, a name you
set is one `claude --resume <name>` accepts — so `architect-agents-05` is what the prompt
box, the `/resume` picker, the terminal title and the statusline all show, *and* the way
back into that session. The ordinal is what keeps it unique.

This is rig convention, not canon: it returns to canon by harvest if tools ever start
parsing session names ([quartermaster §5](../plans/quartermaster.md)).

### The stamp cycle — one root, several buildings

A building is not always a directory's name, and one root can host several: cap-mega hosts
simmy, snappy, spacex-dashboard and manny. Firing from a subdirectory is the wrong fix —
Claude Code keys history, `/resume` and auto-memory to the launch cwd, so deep-firing
fragments the project silo — and eject cannot do it either, because a hand-edited name never
reaches the lineage counter. So the *stamp* carries the building, and Felix goes on firing at
roots.

The list is derived, never filed. The rig reads
[`canon/BUILDINGS.md`](../canon/BUILDINGS.md) — the Guild's own declaration of membership,
`Name · Kind · Root` (D79) — and takes the row whose Root **is** the fire directory, then
every row whose Root sits **under** it.

```
~/code/universal_robots_sdk/cap-mega    cap-mega            its own row leads: the default
                                        simmy               ^G t
                                        snappy              ^G t t
                                        spacex-dashboard    ^G t t t
                                        manny               ...checked out as `user-manual`
```

- **The stamp is the row's Name, not the directory's.** manny stamps `manny` from a worktree
  whose directory is called `user-manual`: the register is the authority on what a building
  is called, and a rename there is a rename everywhere.
- **`t` cycles** through the list, wrapping — the cwd's own Name first, then the rest in
  register order. The panel's `s[t]amp` row shows the whole list with the ✓ on the selection,
  and the footer shows the re-stamped name on the next paint, so what fires is never a
  surprise. `t` is a reserved key, on the same terms as `+`/`-`.
- **One building is no choice**, so a root with nothing under it paints no row at all — the
  footer is already carrying the stamp. **cwd only**, no parent walk: a directory the
  register does not name stamps its own basename exactly as before, and `t` is inert there.
  Buildings *under* an unregistered directory do not register it.
- **Sticky per directory.** The fired stamp is remembered against the fire directory in
  `log/stamps`, under the same on-fire-only law as the four fields: an abort or an Esc after
  cycling persists nothing. The next panel opened there preselects it; a sticky stamp the
  register no longer derives falls back to the default.
- **The lineage follows the building, not the directory** — `architect-simmy-NN` and
  `architect-cap-mega-NN` count independently, for free, because the counter keys the whole
  prefix. The `+`/`-` seed path works per stamp.
- **The Grand Architect is unchanged:** it carries no stamp, so with GA selected the cycle
  changes nothing that fires. The footer says so.
- **Roots are `~`-relative** in the register and expand against `$HOME`. The whole file is
  read once, at panel open — the keystroke loop only indexes the list it produced.
- A row must be three cells and its Name a plain name (`A-Z a-z 0-9 . _ -`, not leading `-`):
  the stamp becomes argv as `-n <mantle>-<stamp>-NN`, so a space would split the launch in
  two. A row that is not one makes the panel refuse to open, naming it — from any directory,
  because a broken register is broken for the whole city. **No register at all is the
  fallback, not an error:** every directory then stamps its own name.

## Usage — the quota table

The account row's whole job is quota arbitrage, so the panel shows what each account has
left. `summon-usage` once creates `log/usage/` and turns the block on; without that
directory the panel is byte-identical to v1.1.

```
account  [0] personal  [1] thg-fgreen ✓  [2] thg-doorbell
usage    0  sess —         week —         fable —
         1  sess 42%+31    week 61%-13    fable 12%+55
         2  sess 78%-13    week 45%+2     fable —
```

One line per account, in `accounts.tsv` order. A cell is `<window> <used>%<pacing delta>`
over three windows — **sess** (the 5-hour session limit), **week** (the 7-day limit) and
**fable** (the 7-day Fable-scoped limit). A bucket the account doesn't have, or an account
with no cache yet, reads `—`.

**The pacing delta is the clock, rendered.** It is `elapsed% − used%`: how far ahead of
the window's own countdown your spend is. `42%+31` means 42% burned with 73% of the window
already elapsed — thirty-one points of headroom. `61%-13` means the burn is outrunning the
clock and the window will run dry early. That is the number to read; the reset time itself
is not shown because the delta already contains it.

**The figures always read at full contrast.** used% is your terminal's own foreground and
the delta is **green** (headroom) or **red** (burning fast) — always, fresh or stale. A
number you have to squint at is a number you misread.

**Staleness greys the furniture, not the figures.** If a cache is over 10 minutes old, the
account digit and the window names (`sess`, `week`, `fable`) go grey while every number
keeps its colour — so a line whose fetch has stopped landing looks visibly different
without any figure becoming hard to read. A cell with no data at all has no figure to
protect, so it greys whole. Opening the panel refetches any account whose cache has gone
cold, after the first paint, in the background; the numbers land on the next keystroke —
which means grey in normal use signals a *failing* fetch (expired token, no network),
not merely an old one.

`summon-usage` run by hand fetches all three accounts in the foreground and prints the
table plus each cache's age — the answer to "why is my table grey".

**Where the numbers come from, and the caveats** ([plans/10 — E2](../plans/10-summon-rig-v12-usage.md)):

- The source is the OAuth usage endpoint, the same payload `/usage` shows. The rig reads
  each account's token from the Keychain, whose service name it derives — never stores —
  as `Claude Code-credentials-<sha256 of the config dir's absolute path>[:8]`.
- **The rig never refreshes or rotates a token.** Claude Code owns the auth lifecycle; a
  rig-side refresh could race it and invalidate live sessions. An expired token is a
  failed fetch is a stale table, and the table says so in grey.
- The token goes from `security` into `curl`'s stdin and lives nowhere else — never in
  argv (where `ps` would leak it), never in a cache or log. A failed fetch leaves the
  previous cache untouched rather than replacing it with nothing.
- macOS may prompt the first time `security` reads an entry; "Always Allow" once per
  account settles it. If you decline, that account simply stays grey.
- Background fetches run as `summon-fetch` — a fresh zsh, detached from the terminal via
  `perl`'s `setsid` (macOS-shipped). Forking the panel's own shell for this wedged the
  machine two different ways; the forensics and the ban are
  [10-F10](../plans/10-summon-rig-v12-usage.md). `pgrep -fl summon-fetch` answers "is a
  fetch in flight"; a wedge would show there too, and never should again.
- `.claude.json`'s own `cachedUsageUtilization` is the same data, but it is refreshed on
  no clock you control — measured 77 minutes and 2.5 hours stale, and once showing 70%
  session usage against a window that had already reset when the truth was 0%. That is
  why the rig fetches rather than reads it.
- Caches are `log/usage/<config-dir-basename>.json` — dotfiles, since the config dirs are
  (`.claude-thg-fgreen.json`). Delete one and its line goes back to `—`.

## Data — edit freely, re-read every invocation

Tab-separated, `#` comments, order is menu order.

```
presets.tsv    key  mantle  model  effort  colour     a  architect  fable  high  green
accounts.tsv   key  config-dir  label                 2  ~/.claude-thg-doorbell  thg-doorbell
```

Derived, never stored: `-n` is the name-stamp; the summons is
`You are {a|an|the} {Mantle} at {model}-{effort}. Wear ~/code/agents/canon/mantles/{mantle}.md.`
— with the tier you actually selected, overrides included. A mantle carried by two presets
shows the effort in its panel label (`●[a]rchitect·high`) so the row never reads as a
duplicate.

**Colours are real; only the swatch speaks ANSI.** `presets.tsv` names the colour the
mantle actually wears — `blue`, `orange`, `yellow` — and `claude` gets that word verbatim
in `/color`. The ● swatch is the one place the word must become ANSI-16, which names no
purple or orange, so Felix's terminal theme (S0) repaints three slots — cyan wears blue,
blue wears orange, magenta wears purple — and the swatch map in `summon.zsh` renders
through those slots. A colour name the map doesn't know renders in the default foreground;
`claude` still gets it verbatim.

## The kickoff-paste ritual

One positional prompt does one job. `/color green` and a summons cannot share it — the
colour parser eats the entire first message (`Invalid color "blue you are a digger."`), so
the rig spends the positional on the colour and Felix speaks the summons himself.

- **A real work order** — paste the kickoff from the work doc as the first message. That
  is the normal path, and why the rig leaves the clipboard alone: it usually already holds
  that kickoff.
- **A generic mantle session** — press `y` before confirming; the derived summons is on
  the clipboard, so ⌘V ⏎ is the whole first message. `y` is the only clipboard write this
  rig ever makes.

## Telemetry

`log/` is gitignored — local evidence, not canon truth.

- `log/invocations.jsonl` — one line per invocation, closes included:
  `{ts, mode: refire|pick|eject|abort, n, account, mantle, model, effort, color, name, cmd,
  keys}`. `n` is the keystrokes spent, `keys` the keystrokes themselves (`^G`, `⏎`, `⎋`, and
  every fat-finger). A **bare** launch is `mantle`/`color` = `null`, not a mode of its own; a
  **refire** is a fire with all four fields unchanged — a new session, so a new ordinal.
  `name` is the stamp that fired, and the counter reads that field and only that field: an
  abort logs `null`, and so does every record written before the field existed.
- `log/state` — the four fields of the last launch, tab-separated `field<TAB>value` lines.
  Delete it and the next panel opens empty. (`log/last` is retired; a leftover file is
  inert.)
- `log/stamps` — `directory<TAB>stamp`, one line per registered directory ever fired from.
  Delete it and every such directory opens on its default.
- `summon-stats` — counts by mantle × account, the mode split, and keys spent against the
  chars-of-command baseline.

Known gaps, accepted: **eject logs the pre-edit command** — whatever Felix edits it into
lands in zsh history, not the log. **A colour-carrying `region_highlight`** is how the
palette is drawn (zle prints a raw ANSI escape as literal `^[[…m` text), so a plugin that
rewrites `region_highlight` on every keystroke could fight the panel; nothing runs during
the panel's own key loop, and the entries are dropped the moment it closes.

## Tests

`../lab/08/run` — 228 assertions, 0 failures. The gestures run in a real pty against a
sandbox copy with `claude` and `pbcopy` shims; the panel's text, wrap and palette spans are
asserted without a pty (`render.zsh`, a pure function of the selection, `$COLUMNS`, `$PWD`
and the sandbox's log); and `preview.exp` / `narrow.exp` prove one whole paint on a real
screen — the footer against the launch it promised, and the 60-column wrap.

The name-stamp is asserted on the composed command, byte for byte, against a hand-written
fixture log: the ordinal past the highest ever fired rather than the last, records predating
the `name` field skipped, stamps counted apart, the Grand Architect counted together, the
bump and its floor. `name.exp` drives the seed path live — a virgin lineage bumped to
Felix's own count, carried forward by the log, floored, and left untouched by an abort — and
the counter is proved to read the log once by taking the file away after the panel opens and
watching 500 repaints keep the ordinal.

The stamp cycle runs against a **fixture register over a fixture city**, never the live
`canon/BUILDINGS.md`: every sandbox lives under `lab/08/out/`, and the rig reads
`${SUMMON_HOME:h}/canon/BUILDINGS.md`, so one generated fixture serves them all. Asserted on
the composed command: the derived cap-mega cycle (the host's own Name leading its four
buildings, though its row is filed last, as the real register has it), Name over
directory-name at manny's worktree root, the unregistered fallback, buildings under an
unregistered directory leaving it unregistered, a lone row painting no row at all, the GA
no-op, the 60-column fit, and `~`-rooted paths expanding against a rewritten `$HOME` — that
last from a directory whose Name and basename differ, since a `~` that failed to expand
would otherwise be indistinguishable from an unregistered directory. Prose above and below
the table is proved to be prose: a table-shaped line under the closing prose names `hive`,
the directory the whole drive fires from, so a parser reading past it takes ~20 assertions
down with it. `stamp.exp` drives the stickiness live — cycle, fire, reopen preselected,
refire; a second registered root unmoved; an aborted cycle byte-compared out of `log/stamps`;
and a sticky stamp the register no longer derives falling back to the default. The register
is proved read-once by the take-the-file-away trick, and three malformed rows (a Name with a
space, a leading dash, a row that is not three cells) are proved to refuse the panel by name.
The harness **derives** the mantle row and the panel's bracket count from `presets.tsv`
and `accounts.tsv` rather than typing them (13-F1): a data-file edit can no longer rot it.

The usage arms never touch a real credential store or the network: `security` and `curl`
are shims serving fixtures, the pacing arithmetic is asserted at its edges (reset imminent,
reset already past, used ahead of the clock, both clamps, half-rounding), the hand-rolled
ISO-8601 → epoch is cross-checked against python, and a sweep proves no token byte reaches
any artefact the harness produced.
