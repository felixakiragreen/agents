# 09 — summon rig v1.1: sticky state, palette, responsive panel

Three findings from Felix's first live day on the rig (D36), plus the simplifications
they force. This is a modification of a landed, tested system — `summon/` with its
harness at `lab/08/run` — not a rebuild. Extend, don't rewrite.

## Inputs — read before working

- This brief, then `plans/08-summon-rig.md` (the landed contract + findings) and the
  code it landed: `summon/summon.zsh`, `lab/08/run`.
- `GENESIS.md` row 09; `canon/work/DOCTRINE.md` for findings law.

## Spec

### 1. Sticky selection state — replaces repeat

- Four fields — mantle, model, effort, account — persist across invocations in
  `log/state`; **persisted on fire only**. Esc discards panel changes; Ctrl-G pressed
  again also closes the panel (toggle) — same discard.
- The panel opens with every field pre-selected from state, exactly like the Claude
  Code model selector: **`Ctrl-G Enter` (2 keys) refires the previous configuration.**
  The double-Ctrl-G repeat and its panel row retire; `log/last` retires into
  `log/state`.
- **Preset cascades, keys override:** a preset key sets mantle + model + effort
  (+ derived name/color/summons); a model or effort key afterward overrides that one
  field, keeping the mantle. The mantle row gains **`[n]one`** — mantle cleared ⇒ bare
  launch (no `-n`, no color, no prompt). Bare is a state, not a mode.
- **Staging retired — every key is global.** Haiku remaps **`h` → `k`** (`hai[k]u`) so
  `[h]igh` is unambiguous. Reserved set: `f o s k` (model), `l m h x M` (effort), `n`,
  `y`, `.`, digits, Enter, Esc, Ctrl-G — `presets.tsv` may claim none of them, fail
  loudly at load. Fat-finger recovery is now one key: press the right one.

### 2. Palette — plain ANSI (D36, Felix's spec)

- Brackets `[` `]` and non-selected items: grey (`90`).
- Selected item: **bold** (`1`), with the **✓ inline** on the item itself —
  `[f]able ✓` — never a trailing arrow at end of row.
- Row labels: `mantle` green (`32`) · `model` yellow (`33`) · `effort` orange
  (`38;5;208` — basic ANSI has no orange) · `account` red (`31`).
- Each mantle preset carries a `●` swatch in its session color (green/pink/…).
- Trap: if `zle -M` strips or garbles escapes, escalate to an alternate render path
  (`POSTDISPLAY`, or direct writes with cursor save/restore) — never ship a stripped
  palette silently.

### 3. Responsive render

- Measure `$COLUMNS` on every render. Wrap at item boundaries only — never mid-item —
  with continuation lines indented to align under the row's first item.
- Test floor: the panel renders clean at **60 columns**.

### 4. Preview footer

One line stating exactly what Enter will fire, plus the counter:
`⏎ architect · fable-high @ thg-fgreen · green · keys: 2`. Rendering guide:

```
summon
mantle   ●[g]rand  ●[a]rchitect ✓  ●[A]rch-max  ●[d]ispatcher  [n]one
model    [f]able ✓  [o]pus  [s]onnet  hai[k]u
effort   [l]ow  [m]ed  [h]igh ✓  [x]high  [M]ax
account  [0] personal  [1] thg-fgreen ✓  [2] thg-doorbell
         [y]ank  [.] eject  [Esc] close  [Enter] invoke
⏎  architect · fable-high @ thg-fgreen · green · keys: 2
```

### 5. Telemetry

- `mode` becomes `refire|pick|eject|abort` — refire = fired with zero changes; bare is
  inferred from `mantle: null`, not a mode.
- Invalid keys: silently ignored, but counted in `n` and present in raw `keys` —
  telemetry never flatters.

## Acceptance criteria — the DoD

Evidence: `./lab/08/run` — **76 assertions, 0 failures** on 2026-08-06. The rig runs in a
sandbox copy under a real pty (`expect`) with `claude` and `pbcopy` shims capturing exactly
what each launch would have received; the panel, being a pure function of the selection and
`$COLUMNS`, is also rendered without a pty (`lab/08/render.zsh`) so its text, wrap and
palette spans are asserted byte-exactly; and two single-gesture pty runs prove one whole
paint on a real screen (`preview.exp`, `narrow.exp` at 60 columns).

- [x] `Ctrl-G Enter` (2 keys) refires the previous configuration exactly — logged
      `{"mode":"refire","n":2,…,"keys":"^G⏎"}`, and `PASS Ctrl-G a 2 ⏎ (4 keys) →
      architect · fable-high on thg-doorbell, then 3 refires of it (4)` — four
      byte-identical launches, one picked and three refired, plus `PASS refire cmd
      byte-identical to the pick it repeats`
- [x] Sticky state survives across real invocations; persisted on fire only — Esc and
      Ctrl-G-toggle discard panel changes — `PASS log/state written on fire: mantle=A
      model=opus effort=max account=1`, `PASS Esc and a second Ctrl-G both close, both
      discard (2)`, and the proof they discarded nothing they touched: `^G g ⎋` and
      `^G d ^G` sit between two refires that both still fire architect · fable-high.
      Eject does not persist either — `^G g 0 .` is followed by a refire of the
      pre-eject config
- [x] Preset cascade + single-field override + `[n]one` bare launch all fire correct
      commands (shim evidence) — `PASS cascade + single-field override: A then k →
      architect · haiku-max` (`SHIM … --model haiku --effort max -n architect /color
      green`), `PASS fresh preset on the sticky account (3 keys)`, and `PASS [n]one →
      bare launch: no -n, no colour, no prompt` (whole-line match on `SHIM
      cfg=/Users/felix/.claude-thg-doorbell args=--model haiku --effort high`, nothing
      more)
- [x] `k` = haiku, `h` = high, everywhere; reserved-key load check updated — `PASS h =
      [h]igh: the model stays sonnet` and `PASS k = hai[k]u: the effort stays high` (two
      3-key gestures whose only difference is which field moved), plus `summon:
      presets.tsv claims reserved key 'm' (reserved: f o s k l m h x M n y . 0 1 …)` with
      the panel refusing to open and the refused keystroke still logged
- [x] Palette per spec: grey brackets/unselected, bold selected with inline ✓, coloured
      labels, preset `●` swatches — asserted as spans shown over the text they cover
      (`fg=green ⟨mantle   ⟩`, `fg=208 ⟨effort   ⟩`, `fg=8 ⟨[⟩` ×21 and `fg=8 ⟨]⟩` ×21,
      `bold ⟨rchitect·high⟩`, `bold ⟨ ✓⟩`, `fg=green ⟨●⟩`, `fg=213 ⟨●⟩`) **and** on the
      wire out of a live pty — `\e[90m`, `\e[1m`, `\e[32m`, `\e[38;5;208m`,
      `\e[38;5;213m` all present, with `PASS and no escape reaches the screen as literal
      ^[[ text`. The trap fired and the alternate path was taken — see F1/F2.
      **Felix's visual pass is still owed** (the DoD asks for his eyes, not only bytes);
      the reconstructed 60-column screen is in F5
- [x] Panel renders clean at 60 columns (harness-checked) and at full width — `PASS every
      panel line fits 60 columns (widest 57)` ×2, `PASS no item is broken across lines:
      each survives whole`, and in a live 60-column pty `PASS the mantle row wraps where
      we put the break` / `PASS the continuation line is intact and aligned`
- [x] Preview footer always matches what Enter then fires — one function
      (`_summon_resolve`) builds the footer, the command, the eject and the refusal, so
      they cannot disagree; measured end to end in a live pty (`preview.exp`): the paint
      says `⏎  architect · opus-max @ thg-fgreen · green · keys: 1` and Enter then fires
      `SHIM cfg=/Users/felix/.claude-thg-fgreen args=--model opus --effort max -n
      architect /color green`. The refusals are footer-first too — `PASS cold state: the
      footer refuses instead of guessing`, `PASS no account: the footer names the one
      thing the rig will never guess`
- [x] Telemetry: refire/pick modes, invalid keys counted; `log/state` replaces `log/last`
      — 20 lines, `refire 5 · pick 7 · eject 2 · abort 6`, all well-formed JSONL with the
      full field set; `PASS an invalid key is ignored, counted in n, and kept in keys`
      (`{"mode":"refire","n":3,…,"keys":"^GZ⏎"}` — the Z changed nothing, so it is
      honestly still a refire), `PASS bare is inferred from mantle/color = null, not a
      mode`, `PASS log/last retired — log/state is the only sidecar`. Schema change in F6
- [x] `lab/08/run` extended to cover all of the above — green, no regressions — 76
      assertions, 0 failures; every v1 guarantee still asserted (Enter-only firing at
      `PASS nothing fires but Enter: 11 launches across 20 gestures`, the clipboard law at
      `PASS clipboard written exactly once, on the one y press`, push-input, eject never
      executing, `summon-stats` cross-checked against python). Input delay re-measured on
      the heavier render: **0.343 ms** per invocation and **1.476 ms** per keystroke (500
      iterations each, no forks, host load 2.01)

## Out of scope — defended

- F3 (color via file-based agent definition, freeing the positional for the summons) —
  canon question, escalated on the board; touches nothing here.
- A `?` stats toggle in the panel — parked; `summon-stats` exists.
- Any change to presets/accounts data formats.

## Findings

**F1 — the palette trap fired: `zle -M` renders an ANSI escape as literal `^[[…m` text.**
The brief's trap clause was live, not hypothetical. Probe: the v1.1 panel built with
escapes in the string, driven through the harness pty; the raw transcript carries the panel
text with two-character `^` `[` sequences where the escapes were —

```
\r\n^[[90msummon^[[0m\r\n^[[32mmantle   ^[[0m^[[32m●^[[0m…
```

— 0 occurrences of the ESC byte `\x1b[90m` in 93 KB of transcript. *Control (the
measurement can see a real escape):* the same transcript, same reader, after the palette
moved to `region_highlight` — 4225 × `\x1b[90m`, 896 × `\x1b[1m`, 209 × `\x1b[32m`, 51 ×
`\x1b[38;5;208m`. An earlier read of this probe through `cat -v` had it backwards, because
`cat -v` renders a real ESC as `^[` too; the byte-level read is the one that decides.

**Alternate path taken, per the brief: `POSTDISPLAY` + `region_highlight`** — the panel
string is plain text and the colours are zle's own highlight spans. This is the zle-native
route the brief named first, and it is strictly better than direct terminal writes: zle owns
the cursor, the wrapping and the teardown, so there is no save/restore arithmetic, no scroll
hazard, and taking the panel down is `POSTDISPLAY=''` + `region_highlight=()`. The panel
builder now emits (plain text, spans) instead of an escape-laden string; `lab/08/render.zsh`
prints every span over the text its offsets actually cover, so a wrong offset shows up as
the wrong text instead of passing quietly.

**F2 — grey is `fg=8`, not `fg=90`: in zle a bare number is a palette index, not an SGR
code.** Measured on the wire in a pty: `fg=8` → `\e[90m` (exactly D36's grey), `fg=90` →
`\e[38;5;90m` (palette index 90 — a purple). `fg=208` → `\e[38;5;208m` and `fg=green` →
`\e[32m`, so every colour D36 specified reaches the terminal as the byte sequence it named:

| D36 says | rig asks zle for | terminal receives |
|---|---|---|
| grey 90 | `fg=8` | `\e[90m` |
| bold | `bold` | `\e[1m` |
| mantle green 32 | `fg=green` | `\e[32m` |
| model yellow 33 | `fg=yellow` | `\e[33m` |
| effort orange 38;5;208 | `fg=208` | `\e[38;5;208m` |
| account red 31 | `fg=red` | `\e[31m` |
| pink swatch | `fg=213` | `\e[38;5;213m` |

**F3 — `zle -I` was tried for determinism and rejected: it leaves one stale panel on screen
per keystroke.** With `zle -I` before each `zle -R`, a single-keystroke gesture painted the
panel **twice** in the byte stream (2 × `summon`, 2 × `keys: 1`), and a screen
reconstruction showed the abandoned copy still on the display after the panel closed —
`zle -I`'s contract is "abandon this display and start a new one below". *Control:* the same
reconstruction without `zle -I` shows the panel erased line by line and a clean prompt.
Plain `zle -R` repaints in place, and it handles the hard case correctly: at 60 columns,
pressing `g` changes the mantle row's wrap **and** pushes the footer onto a continuation
line, and the reconstructed screen is exact through all of it.

**F4 — a harness bug inherited from 08: `stty columns` does not update zsh's `$COLUMNS`.**
Probe in a spawned interactive zsh: `stty columns 60 rows 60` then `print
AFTER=$COLUMNS stty=$(stty size)` → `AFTER=80 stty=60 60`. zsh caches its terminal size and
only re-reads it on SIGWINCH, which nothing delivers here. So 08's `stty columns 200` never
widened the shell — **every v1 panel assertion actually ran at 80 columns** (harmless there:
v1's rows fit in 80). `lab/08/rc.zsh` now sets both, and `SUMMON_COLUMNS=60` drives the
narrow arm, which is what made the 60-column pty test real rather than nominal.

**F5 — what 60 columns actually looks like** (reconstructed from the live pty stream, so
this is the screen, not the string):

```
summon
mantle   ●[g]rand-architect  ●[a]rchitect·high
         ●[A]rchitect·max ✓  ●[d]ispatcher  [n]one
model    [f]able  [o]pus ✓  [s]onnet  hai[k]u
effort   [l]ow  [m]edium  [h]igh  [x]high  [M]ax ✓
account  [0] personal  [1] thg-fgreen ✓  [2] thg-doorbell
         [y]ank  [.] eject  [Esc] close  [Enter] invoke
⏎  architect · opus-max @ thg-fgreen · green · keys: 1
```

**F6 — telemetry schema, per the brief's redefinition of `n` and `keys`.** §5 makes `n` the
count and `keys` the raw keystrokes; the v1 `n` (the `-n` value) is therefore retired — it
was the mantle slug verbatim, so `mantle` already carries it and a bare launch's null is
unchanged in meaning. The field set stays ten:
`{ts, mode, n, account, mantle, model, effort, color, cmd, keys}`. `keys` is written
**last** deliberately: it is the one field carrying arbitrary keystrokes, and
`summon-stats`' builtin parser finds a field by its first `"name":`, so nothing a
fat-finger types into it can shadow a real field (08's F8 hazard, now bounded rather than
just noted). `⏎`, `⎋` and `^G` are recorded as glyphs because raw control bytes are not
legal inside a JSON string.

**F7 — one 08 ruling simplified: eject no longer has its own defaults.** 08's F6(c) let
eject fall back to the first preset × first account because it launches nothing. With
sticky state that fallback is dead weight — the panel always has a configuration once
anything has fired, so eject now ejects exactly what the footer promises and refuses
exactly when the footer refuses (cold start only, asserted). One rule instead of three
branches, and the footer stays the single source of truth for every path.

**F8 — cosmetic deviations from the rendering guide, and why.** The guide's mantle labels
(`[g]rand`, `[A]rch-max`) are not derivable from the data, and preset formats are out of
scope, so labels are the mantle slug with the key bracketed where it falls
(`●[g]rand-architect`), plus `·<effort>` **only** when two presets share a mantle
(`●[a]rchitect·high` / `●[A]rchitect·max`) — without it the row reads as a duplicate bug
when it is correct. Efforts render full (`[m]edium`, not the guide's `[m]ed`): the same
one rule, no truncation table. Everything else follows the guide exactly, footer included.

**F9 — the pty cannot synchronise on panel content, and that shaped the harness.** zle
repaints incrementally, so a mid-gesture render reaches the pty as a diff — the text is
there but split across cursor moves, and no single render is guaranteed whole. A drive that
waits on panel text is therefore flaky by construction (measured: 15 of 20 gestures
synchronised, the other 5 timing out). The split: the drive sends a whole gesture in one
burst (the tty buffers it, `read -k` drains it in order) and waits only on outcomes —
launches, messages, ejected lines; the *display* is proved without a pty by `render.zsh`,
and one whole paint at a time on a real screen by `preview.exp` and `narrow.exp`.

**F10 — adjacent, parked, not fixed:** (a) the panel's colours live in `region_highlight`,
which a plugin that rewrites that array on every keystroke could fight; nothing runs during
the panel's own key loop and the entries are dropped when it closes, so this is a caveat in
the README, not a defect to chase before it bites. (b) This environment's `grep` is a
wrapper that skips files it judges binary, and zsh pattern-quoting rewrites a raw ESC into
printable `\e` — both silently turn a byte-level assertion into a false miss, so the
harness's raw-transcript checks search bytes with python instead. Worth knowing before
writing the next transcript assertion in any repo.

## Kickoff — verbatim

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the brief at ~/code/agents/plans/09-summon-rig-v11.md.
```
