# 08 — summon rig

Single-keystroke ignition for mantled sessions. Ctrl-G opens a picker; three keys reach
any mantle × account invocation; every invocation is logged so the presets evolve on
evidence, not vibes.

## Goal

Replace hand-typed `CLAUDE_CONFIG_DIR=… claude --model … --effort … -n … "/color …"`
lines (~78 keystrokes plus a summons paste) with a 3–5 keystroke gesture that sets all
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

### Interaction — the panel (D35, amended)

**Enter, and only Enter, fires.** Every other key selects; nothing launches by
side-effect.

- `bindkey '^G'` → ZLE widget. Non-empty buffer: `zle push-input` first, never clobber.
- The **full panel** renders instantly on Ctrl-G and re-renders on every press
  (`zle -M`, pure builtins — no subprocess before launch): every live hotkey, the
  current selections, and the running `keys: n` counter — **the launch key counts**
  (after `Ctrl-G f` the panel reads `fable ✓ · keys: 2`). Rendering guide:

```
summon · keys: 2
Ctrl-G   repeat last  →  architect · fable-high @ thg-fgreen
mantle   [g]rand  [a]rchitect  [A]rch-max  [d]ispatcher
model    [f]able  [o]pus  [s]onnet  [h]aiku            → fable ✓
effort   [l]ow  [m]ed  [h]igh  [x]high  [M]ax
account  [0] personal  [1] thg-fgreen  [2] thg-doorbell   (unset ⇒ last-used)
         [y]ank summons   [.] eject   [Esc] abort   [Enter] invoke
```

- Key namespaces are **staged**, so overloaded letters stay unambiguous: at the first
  choice `h` = haiku (model); after a model key `h` = high (effort). Selections are
  forward-only — a fat-finger is `Esc` + redo, two keys.
- Paths from the panel, all ending in **Enter**:
  - **Mantle:** preset key → optional `y` (yank the derived summons — the rig's only
    clipboard write) → optional account digit → Enter.
  - **Bare (D35):** model key `f/o/s/h` → effort key `l/m/h/x/M` → optional account
    digit → Enter. Command carries only `CLAUDE_CONFIG_DIR`/`--model`/`--effort` —
    no `-n`, no color, no prompt.
  - **Repeat:** Ctrl-G again *arms* the last invocation (from `log/last`), panel shows
    it fully resolved → Enter fires it.
  - `.` = eject the armed (or default) config into `BUFFER` for manual editing;
    `Esc` = abort (logged).
- **Enter with anything unset fires the defaults** — account defaults to last-used, so
  Enter straight after a preset is a legal 3-key launch.
- Reserved keys — `f/o/s/h`, `y`, `.`, digits: `presets.tsv` may never claim one;
  fail loudly at load.
- Keystroke floors: repeat 3 (`Ctrl-G Ctrl-G Enter`) · preset on last-used account 3 ·
  preset + account 4 · bare 4–5.
- Execution mechanism: on Enter, assemble the command string, log, set `BUFFER`, `zle
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

Evidence: `./lab/08/run` — the whole rig driven through a real pty (`expect`) against a
sandbox copy of `summon/`, with a `claude` shim capturing exactly what each launch would
have received and a `pbcopy` shim proving the clipboard law. **33 assertions, 0 failures**
on 2026-08-06; the run prints the verdicts quoted below.

- [x] Ctrl-G from empty and non-empty buffer opens the panel with no perceptible delay —
      `PASS non-empty buffer survives (push-input)` (a `print -r -- KEEPME` line in
      progress is restored after the launch); every-invocation work measured at
      **0.365 ms** (2 TSV reads + recall, 500 iterations, no forks, host load 3.52) — the
      panel itself is builtin string-building with no subprocess before launch
- [x] The panel shows every live hotkey and re-renders on each press with selections
      and the counter (launch key counted); nothing fires except Enter — `PASS` on the
      mantle/model/effort/account rows, `panel shows selections`, `counter counts the
      launch key (^G alone = 1)`, `counter advances per press`, and
      `PASS selection keys never launch: 6 launches, not 8` (T10 selects a preset *and*
      an account, then aborts; nothing ran)
- [x] `Ctrl-G a 2 Enter` (4 keys) launches architect · fable-high on thg-doorbell with
      correct flags, name, color — `SHIM cfg=/Users/felix/.claude-thg-doorbell
      args=--model fable --effort high -n architect /color green`, logged `"mode":"pick",
      "keys":4`
- [x] `Ctrl-G Ctrl-G Enter` (3 keys) repeats the last invocation exactly, shown
      resolved in the panel before firing — `PASS repeat is armed and shown resolved`
      (`ARMED · architect fable-high @ thg-doorbell`) and `PASS repeat cmd byte-identical
      to the pick it repeats`, logged `"mode":"repeat","keys":3`
- [x] `Ctrl-G a Enter` (3 keys) fires with the last-used account — `SHIM
      cfg=…thg-doorbell args=--model sonnet --effort medium -n dispatcher /color pink`
      after only `^G d ⏎`, logged `"mode":"pick","keys":3`
- [x] `.` ejects an editable resolved command into the buffer — ejected
      `CLAUDE_CONFIG_DIR=~/.claude-thg-doorbell claude --model fable --effort max -n
      grand-architect "/color green"` into the line, `PASS the ejected command was never
      executed (0)`; both floors exercised — `eject at 2 keys (^G . — the default source
      is log/last)` and `eject at 3 keys (^G <preset> .)`
- [x] `Ctrl-G f x 1 Enter` (5 keys) launches bare fable · xhigh on thg-fgreen — no
      name, color, or prompt; a preset claiming a reserved key fails loudly at load —
      `SHIM cfg=/Users/felix/.claude-thg-fgreen args=--model fable --effort xhigh`
      (nothing more), and a poisoned `presets.tsv` gives
      `summon: presets.tsv claims reserved key 'f' (reserved: f o s h y . 0 1 2 3 4 5 6 7
      8 9)` with the panel refusing to open, and the refused keystroke still logged
      (`"mode":"abort","keys":1`)
- [x] `y` yanks the derived summons; clipboard untouched on every other path — `PASS
      CLIP[You are an Architect at fable-max. Wear ~/code/agents/canon/mantles/architect.md.]`
      and `PASS clipboard written exactly once, on the one y press (1)` across all 13
      gestures; the yank costs a key (`pick` logged at 5)
- [x] Every path (abort included) appends a well-formed JSONL line; `log/` gitignored —
      12 lines across `pick 4 · bare 1 · repeat 1 · eject 2 · abort 4`, every line
      validated by `python3 json.loads` for the exact 10-field set and a numeric `keys`;
      bare lines carry `mantle`/`color`/`n` = `null`; `.gitignore` carries `summon/log/`
- [x] `--effort` accepted values and `-n` behavior verified, recorded in Findings — F4
      (with a control arm; `med` and `medium` both accepted, an unknown value warns and
      silently falls back) and F5
- [x] `summon-stats` prints its report from real log lines — mode split, mantle × account
      counts, `keys 37 spent vs 803 chars of command typed (21.7× leverage)`; its
      builtin-parsed arithmetic is cross-checked against `python3` in the harness (`PASS
      counts agree with python`)
- [x] README: the dotfiles source line, key map, data-file format, kickoff-paste ritual —
      `summon/README.md`, with the panel render and the two accepted v1 gaps
- [ ] **PENDING Felix** — Smoke: one real launch per account, logged (Felix-attended —
      logins are his). Needs the dotfiles source line first; `~/.claude` still awaits its
      `/login` (GENESIS §8). Nothing in the rig is account-specific, but no assertion
      here replaces three real launches.

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

### Raised by this session

1. **The colour channel is not forced (F3, verified).** A file-based agent definition
   carrying `color:` sets the session colour flag-only, so `/color` need not own the
   positional prompt — the summons could ride it instead and the ⌘V ritual would die.
   Blocked on a canon question only Felix/a Grand Architect can answer: mantles currently
   arrive by path (D12) and `canon/agents/` holds content-free tiers, so colour-carrying
   per-mantle agent definitions cut across that split (and `--agent` can pin model/effort,
   colliding with the tier grid). v1 ships D35's shape; this is a v2 row if Felix wants it.
2. **Smoke is Felix's** — three real launches, one per account, after the dotfiles source
   line lands; `~/.claude` still needs its `/login` (GENESIS §8).

## Findings

**F1 — combining a slash command and a summons in one positional prompt is dead**
(independent confirmation of Felix's D35 evidence, before the amendment landed). Probe:
`claude --model haiku --effort low -n e1probe $'/color pink\nReply with only the word
ACK.'` in a pty. The whole prompt became the slash command's argument:

```
❯ /color pink
  Reply with only the word ACK.
  ⎿  Invalid color "pink\nreply with only the word ack.". Available colors: red, blue, …
```

*Control (the probe could see the effect):* a positional prompt of `/color blue` alone
executes as a slash command — this session's own transcript records
`<command-name>/color</command-name> <command-args>blue</command-args>` at
`2026-08-06T17:57:54Z`, before its first user message.

**F2 — no CLI affordance for a second initial message.** `claude --help` (2.1.223) takes
a single positional `prompt`; `--input-format stream-json` (the only queued-input route)
is documented "only works with --print", so it cannot serve an interactive session. E1
option 2 closed.

**F3 — a flag-only colour channel EXISTS and is verified. Not adopted in v1; the call is
Felix's.** Mechanism, from the 2.1.223 bundle: `/color` resolves the effective colour as
`Cht({userOverride: l, agentDefinitionColor: u?.color})` — the session's active agent
definition supplies a colour when no user override exists. Measured end to end in a pty by
the ANSI badge that paints the session name:

| arm | badge | agent active | colour |
|---|---|---|---|
| control — no flags | `48;2;8;145;178` | — | default cyan |
| **positive control** — positional `"/color green"` | `48;2;22;163;74` | — | **green** |
| `--agents '{…"color":"green"}' --agent x` (inline JSON) | `48;2;8;145;178` | `@x` shown | default cyan |
| **`.claude/agents/x.md` with `color: green` + `--agent x`** | `48;2;22;163;74` | `@x` shown | **green** |

The positive control proves the measurement can see the effect (the two truecolor triples
differ, and green appears in exactly the bytes measured), so the inline-JSON negative is a
real negative, not a blind probe. **A file-based agent definition sets the session colour
with no first message spent** — which would free the positional prompt for the *summons*
and delete the kickoff-paste ritual for generic mantle sessions.

The price, and why a Builder must not take it: `--agent <name>` makes that definition the
session's agent, so its body becomes session instructions and it can pin model/effort.
Using it per mantle means minting colour-carrying agent definitions for mantles — but
`canon/agents/` holds **tiers** (deliberately content-free) and mantles are delivered by
path (D12). That is a canon change, Felix's sign-off, and it cuts across the tier × mantle
split. Escalated below; the rig ships the D35 command shape unchanged.

*(Correction: an earlier draft of this finding recorded the route as "rejected" on the
Builder's own authority and as needing a canon edit to test. Both were wrong — the inline
route needed no canon edit, and the decision was never mine.)*

**F4 — `--effort` accepted values, with a footgun.** `--help` lists `low, medium, high,
xhigh, max`. An unknown value does **not** fail — it warns and silently falls back to the
default effort:

```
$ claude --model haiku --effort bogus -p 'reply with the single word ok'
Warning: Unknown --effort value 'bogus' — ignoring it and using the default effort.
         Valid values: low, medium, high, xhigh, max.
ok
$ claude --model haiku --effort med -p '…'     → no warning (accepted)
$ claude --model haiku --effort medium -p '…'  → no warning
```

*Control:* the same `bogus` arm proves the warning is visible on this path, so the silence
on `med`/`medium` is a real acceptance, not a blind probe. (An earlier `--effort bogus
--version` arm was discarded: `--version` short-circuits, so it was blind by construction.)
`med` is accepted, but the rig emits the canonical long names from `_summon_efforts` —
a typo in a data file would otherwise downgrade effort silently and invisibly.

**F5 — `-n` behaviour.** `-n <name>` sets the session display name in the prompt box,
`/resume` picker, and terminal title; the probe's header rendered `e1probe`, and a named
session writes `{"type":"agent-name","agentName":…}` + `{"type":"custom-title",…}` into
its transcript. Nothing else is affected — no bearing on model, effort, or config dir.

**F6 — three spec silences, resolved and flagged.** The amended brief pre-chews Enter's
defaults for the account only; the rig therefore rules: (a) Enter with **nothing**
selected fires nothing (message + logged abort) — the 3-key repeat floor forbids reading
bare `^G ⏎` as a repeat; (b) Enter on the bare path with a model but **no effort** refuses
— no default effort is defined anywhere, and F4 shows a wrong one fails silently; (c) a
launch with no account selected **and** no last-used refuses rather than guessing — the
account picks which subscription pays and which silo the work lands in, so a guess is the
one error the rig must never make. Eject, which launches nothing, does default to the
first preset × first account.

**F7 — telemetry, two v1 gaps, accepted and documented in the README.** `n` is logged as
the `-n` value (null on the bare path, where there is no name). A repeat is attributed by
reconstruction — each preset is re-resolved and compared to `log/last` — so a repeat of a
*bare* launch logs null descriptors; its `cmd` still carries everything. Eject logs the
pre-edit command, per spec.

**F8 — adjacent, parked, not fixed:** `summon-stats` parses its own JSON with zsh
builtins; the parser is correct for what `_summon_log` writes and nothing else (documented
at the function). If the log format ever grows a field containing `","`, the reporter
needs a real parser — the harness cross-checks its arithmetic against `python3` so the
day it breaks, `lab/08/run` fails rather than misreporting.

## Kickoff — verbatim

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the brief at ~/code/agents/plans/08-summon-rig.md.
```
