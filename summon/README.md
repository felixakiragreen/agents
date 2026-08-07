# summon — Ctrl-G ignition

**`Ctrl-G Enter` refires your last session in two keystrokes.** The panel opens with every
field already selected — mantle, model, effort, account — exactly like the Claude Code
model selector: change what you want, Enter fires it, and what fired is what the panel
promised. Every invocation is logged, so `presets.tsv` is only the hypothesis and
`log/invocations.jsonl` is the evidence. Designed in [D34/D35/D36/D41](../DECISIONS.md),
built to [plans/08](../plans/08-summon-rig.md), [plans/09](../plans/09-summon-rig-v11.md)
and [plans/10](../plans/10-summon-rig-v12-usage.md).

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
mantle   ● [g]rand-architect  ● [a]rchitect·high ✓  ● [A]rchitect·max  ● [d]ispatcher  ● [b]uilder  [n]one
model    [f]able ✓  [o]pus  [s]onnet  hai[k]u
effort   [l]ow  [m]edium  [h]igh ✓  [x]high  [M]ax
account  [0] personal  [1] thg-fgreen ✓  [2] thg-doorbell
         [y]ank  [.] eject  [Esc] close  [Enter] invoke
⏎  architect · fable-high @ thg-fgreen · green · keys: 2
```

Brackets and unselected items are grey; the selected item is bold and carries the ✓
inline; row labels are green · yellow · orange · red; each mantle's ● is its session
colour. The panel measures `$COLUMNS` on every render and wraps at item boundaries only,
never mid-item — clean down to 60 columns, where a mantle appears with two presets on it.

**Enter, and only Enter, fires.** Every other key selects; nothing launches by
side-effect.

| Gesture | Keys | What launches |
|---|---|---|
| `^G ⏎` | 2 | **refire** — the last configuration, exactly |
| `^G <key> ⏎` | 3 | one field changed: a different model, effort, account or mantle |
| `^G <preset> <account> ⏎` | 4 | a fresh mantle on a named account |
| `^G n ⏎` | 3 | **bare** — model + effort only, no name, colour or prompt |
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
owns `f o s k` · `l m h x M` · `n` · `y` · `.` · the digits: a preset claiming one makes
the rig refuse to open, loudly, naming the key.

Enter refuses rather than guessing when the selection cannot launch — no model, no effort,
or no account. The account picks which subscription pays and which silo the work lands in,
so a guess is the one error the rig must never make; the preview footer says so before
Enter is pressed.

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

Derived, never stored: `-n` is the mantle slug; the summons is
`You are {a|an|the} {Mantle} at {model}-{effort}. Wear ~/code/agents/canon/mantles/{mantle}.md.`
— with the tier you actually selected, overrides included. A mantle carried by two presets
shows the effort in its panel label (`●[a]rchitect·high`) so the row never reads as a
duplicate. A colour name the swatch map doesn't know renders in the default foreground;
`claude` still gets the name verbatim.

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
  `{ts, mode: refire|pick|eject|abort, n, account, mantle, model, effort, color, cmd, keys}`.
  `n` is the keystrokes spent, `keys` the keystrokes themselves (`^G`, `⏎`, `⎋`, and every
  fat-finger). A **bare** launch is `mantle`/`color` = `null`, not a mode of its own; a
  **refire** is a fire with all four fields unchanged.
- `log/state` — the four fields of the last launch, tab-separated `field<TAB>value` lines.
  Delete it and the next panel opens empty. (`log/last` is retired; a leftover file is
  inert.)
- `summon-stats` — counts by mantle × account, the mode split, and keys spent against the
  chars-of-command baseline.

Known gaps, accepted: **eject logs the pre-edit command** — whatever Felix edits it into
lands in zsh history, not the log. **A colour-carrying `region_highlight`** is how the
palette is drawn (zle prints a raw ANSI escape as literal `^[[…m` text), so a plugin that
rewrites `region_highlight` on every keystroke could fight the panel; nothing runs during
the panel's own key loop, and the entries are dropped the moment it closes.

## Tests

`../lab/08/run` — 134 assertions, 0 failures. The gestures run in a real pty against a
sandbox copy with `claude` and `pbcopy` shims; the panel's text, wrap and palette spans are
asserted without a pty (`render.zsh`, a pure function of the selection and `$COLUMNS`); and
`preview.exp` / `narrow.exp` prove one whole paint on a real screen — the footer against
the launch it promised, and the 60-column wrap.

The usage arms never touch a real credential store or the network: `security` and `curl`
are shims serving fixtures, the pacing arithmetic is asserted at its edges (reset imminent,
reset already past, used ahead of the clock, both clamps, half-rounding), the hand-rolled
ISO-8601 → epoch is cross-checked against python, and a sweep proves no token byte reaches
any artefact the harness produced.
