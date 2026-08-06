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

- [ ] `Ctrl-G Enter` (2 keys) refires the previous configuration exactly
- [ ] Sticky state survives across real invocations; persisted on fire only — Esc and
      Ctrl-G-toggle discard panel changes
- [ ] Preset cascade + single-field override + `[n]one` bare launch all fire correct
      commands (shim evidence)
- [ ] `k` = haiku, `h` = high, everywhere; reserved-key load check updated
- [ ] Palette per spec: grey brackets/unselected, bold selected with inline ✓, colored
      labels (green/yellow/orange-208/red), preset `●` swatches — visually verified by
      Felix, not just asserted
- [ ] Panel renders clean at 60 columns (harness-checked) and at full width
- [ ] Preview footer always matches what Enter then fires
- [ ] Telemetry: refire/pick modes, invalid keys counted; `log/state` replaces
      `log/last`
- [ ] `lab/08/run` extended to cover all of the above — green, no regressions

## Out of scope — defended

- F3 (color via file-based agent definition, freeing the positional for the summons) —
  canon question, escalated on the board; touches nothing here.
- A `?` stats toggle in the panel — parked; `summon-stats` exists.
- Any change to presets/accounts data formats.

## Findings

*(filled by the executing session — F-numbered, per DOCTRINE)*

## Kickoff — verbatim

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the brief at ~/code/agents/plans/09-summon-rig-v11.md.
```
