# 08 — summon rig

Single-keystroke ignition for mantled sessions. Ctrl-G opens a picker; three keys reach
any mantle × account invocation; every invocation is logged so the presets evolve on
evidence, not vibes.

## Goal

Replace hand-typed `CLAUDE_CONFIG_DIR=… claude --model … --effort … -n … "/color …"`
lines (~78 keystrokes plus a summons paste) with a 2–3 keystroke gesture that sets all
five properties — account, model, effort, name, color — **and delivers the mantle
summons**. Zero perceptible input delay. Full invocation telemetry.

## Inputs — read before working

- This brief. `GENESIS.md` for the campaign; `canon/work/DOCTRINE.md` for findings law.
- `canon/mantles/*.md` — summons formats live in each charter's Summons section.
- Felix's current aliases (context only, do not edit): `~/.dotfiles/zsh/aliases.zsh`.

## Spec

### Files

```
summon/
	summon.zsh        # sourced from dotfiles (one line, Felix adds it); widget + picker + logger
	presets.tsv       # key · mantle · model · effort · color   — Felix-editable data
	accounts.tsv      # key · config-dir · label                — Felix-editable data
	log/              # gitignored (add repo .gitignore entry)
		invocations.jsonl   # telemetry, one line per invocation
		last                # sidecar: last resolved command verbatim (repeat + default source)
```

### Data — seed values (D34)

`accounts.tsv`: `0 ~/.claude personal` · `1 ~/.claude-thg-fgreen thg-fgreen` ·
`2 ~/.claude-thg-doorbell thg-doorbell`.

`presets.tsv`:

```
g	grand-architect	fable	max	green
a	architect	fable	high	green
A	architect	fable	max	green
d	dispatcher	sonnet	medium	pink
```

Builder/Digger tiers vary per brief — seed as commented placeholder rows; the eject
path covers them until the log argues for real rows. Derived, never stored: session
name (`-n`) = mantle slug; summons text = `You are a/an {Mantle} at {model}-{effort}.
Wear ~/code/agents/canon/mantles/{mantle}.md.` (title-case the slug, correct article).
Data files are re-read on every invocation — no caching, no stale state.

### Interaction — the state machine

- `bindkey '^G'` → ZLE widget. Non-empty buffer: `zle push-input` first, never clobber.
- Menu renders instantly (`zle -M`, pure builtins — no subprocess before launch):
  presets from `presets.tsv`, accounts, and a live `keys: n` counter updated per press.
- **Key 2 — preset:** a preset key; or **Ctrl-G again = repeat last** (from `log/last`,
  the 2-key floor); or **`.` = eject** — resolve the default config into `BUFFER` for
  manual editing and return to ZLE (the override escape hatch); or **Esc = abort**.
- **Bare mode — no mantle (D35):** the model keys **f/o/s/h**
  (fable/opus/sonnet/haiku) are reserved at the preset stage and branch to a tier
  launch: model key → effort key (`l/m/h/x/M` = low/medium/high/xhigh/max) → account
  digit. 4 keys total: `Ctrl-G f x 1` = fable-xhigh on thg-fgreen. The command carries
  only `CLAUDE_CONFIG_DIR`, `--model`, `--effort` — no `-n`, no color, no prompt.
  `presets.tsv` may never claim a reserved key — fail loudly at load if it does.
- **Key 3 — account:** digit, or Enter = last-used account. This key fires — no
  trailing Enter. Mantle path only: `y` first = yank the derived summons to the
  clipboard (the only clipboard write the rig ever makes), then the account key.
- Execution mechanism: assemble the command string, log, set `BUFFER`, `zle
  accept-line` — claude runs as a normal foreground command and the invocation lands in
  zsh history for free. Never `exec`, never run claude inside the widget.

Command shape — mantle path: `CLAUDE_CONFIG_DIR=<dir> claude --model <model>
--effort <effort> -n <mantle> "/color <color>"`; bare path: the first three only.

### E1 — summons delivery — RESOLVED 2026-08-06 (Felix's evidence, D35)

Combining is dead: the `/color` parser eats the entire first message —
`Invalid color "blue you are a digger."`. One positional, one job. Ruling:

- Positional stays `"/color <color>"` (mantle path only).
- **Clipboard law: the rig never writes the clipboard by default** — Felix's clipboard
  usually already carries the previous agent's kickoff prompt; clobbering it is worse
  than the paste it saves. Summons-yank is **opt-in**: pressing `y` at the account
  stage pipes the derived generic summons to `pbcopy`, then continues to the account
  key. Document the kickoff-paste ritual in the README.

Still verify `--effort` accepted values (`med` vs `medium`) and `-n` behavior; record
in Findings.

### Telemetry

One JSON line per invocation — including repeats, ejects, and aborts:
`{ts, mode: pick|bare|repeat|eject|abort, keys, n, account, mantle, model, effort,
color, cmd}` — `mantle`/`color` null on the bare path; `keys` includes `y` when yanked.
Eject logs the pre-edit resolved command; the edited final lives in zsh history —
accepted v1 gap, note it in the README. `summon-stats`: a minimal reporter (~20 lines)
— invocation counts by mantle × account, mode split, total keys spent vs the naive
typed baseline. Anything fancier is a later row fed by real data.

## Acceptance criteria — the DoD

- [ ] Ctrl-G from empty and non-empty buffer opens the picker with no perceptible delay
- [ ] `Ctrl-G a 2` (3 keys) launches architect · fable-high on thg-doorbell with correct
      flags, name, color
- [ ] `Ctrl-G Ctrl-G` (2 keys) repeats the last invocation exactly
- [ ] Enter at the account stage uses the last-used account
- [ ] `.` ejects an editable resolved command into the buffer
- [ ] `Ctrl-G f x 1` (4 keys) launches bare fable · xhigh on thg-fgreen — no name,
      color, or prompt; a preset claiming a reserved key fails loudly at load
- [ ] `y` yanks the derived summons; clipboard untouched on every other path
- [ ] Every path (abort included) appends a well-formed JSONL line; `log/` gitignored
- [ ] `--effort` accepted values and `-n` behavior verified, recorded in Findings
- [ ] `summon-stats` prints its report from real log lines
- [ ] README: the dotfiles source line, key map, data-file format, kickoff-paste ritual
- [ ] Smoke: one real launch per account, logged (Felix-attended — logins are his)

## Out of scope — defended

- Typed grammar (`s 1a⏎`) — 5 keys to the picker's 3; add only if the log argues for it.
- fzf or any TUI framework — startup latency is the enemy; `read -k1` is free.
- Editing `~/.dotfiles` — Felix's repo; he adds the one source line himself.
- Log sync across accounts/machines — local telemetry, not canon truth.
- Preset auto-promotion — stats inform; Architect sessions true `presets.tsv`.
- Name/color on the bare path — the eject key covers the exceptions.
- Retiring the old `a-thg-*` aliases — Felix's call once the rig proves out.

## Escalation

- ZLE widget fundamentally misbehaves in Felix's terminal → escalate with evidence
  before shipping a degraded non-widget fallback.
- claude CLI lacks or renames a needed flag → report; never improvise canon vocabulary.

## Findings

*(filled by the executing session — F-numbered, per DOCTRINE)*

## Kickoff — verbatim

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the brief at ~/code/agents/plans/08-summon-rig.md.
```
