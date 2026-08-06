# summon — Ctrl-G ignition

Three keys reach any mantle × account session; two repeat the last one. Every invocation
is logged, so `presets.tsv` is only the hypothesis and `log/invocations.jsonl` is the
evidence. Designed in [D34/D35](../DECISIONS.md), built to [plans/08](../plans/08-summon-rig.md).

## Install — one line, Felix's own repo

```zsh
source ~/code/agents/summon/summon.zsh      # → ~/.dotfiles/zsh/*.zsh
```

Nothing else: no plugin manager, no `PATH` entry. `reload` re-sources cleanly.

## Keys

| Gesture | Keys | What launches |
|---|---|---|
| `^G <preset> <account>` | 3 | mantled session — model, effort, `-n <mantle>`, `/color <colour>` |
| `^G <preset> y <account>` | 4 | same, and `y` yanks the summons to the clipboard first |
| `^G <model> <effort> <account>` | 4 | **bare** — model + effort only, no name, colour, or prompt |
| `^G ^G` | 2 | repeat the last invocation, verbatim |
| `^G .` | 2 | **eject** — the resolved command lands in the line, editable, unlaunched |
| `^G <esc>` | 2 | abort (any unbound key aborts) |

Bare-path keys: models `f` fable · `o` opus · `s` sonnet · `h` haiku, then efforts
`l` low · `m` medium · `h` high · `x` xhigh · `M` max. The account key fires — no ⏎
needed; ⏎ *means* "the account I used last".

The presets and the account digits come from the data files, so the menu is always the
truth. `f o s h .` are reserved by the state machine: a preset claiming one makes the rig
refuse to open, loudly, naming the key.

## Data — edit freely, re-read every invocation

Tab-separated, `#` comments, order is menu order.

```
presets.tsv    key  mantle  model  effort  colour     a  architect  fable  high  green
accounts.tsv   key  config-dir  label                 2  ~/.claude-thg-doorbell  thg-doorbell
```

Derived, never stored: `-n` is the mantle slug; the summons is
`You are {a|an|the} {Mantle} at {model}-{effort}. Wear ~/code/agents/canon/mantles/{mantle}.md.`

## The kickoff-paste ritual

One positional prompt does one job. `/color green` and a summons cannot share it — the
colour parser eats the entire first message (`Invalid color "blue you are a digger."`),
so the rig spends the positional on the colour and Felix speaks the summons himself.

- **A real work order** — paste the kickoff from the work doc as the first message. That
  is the normal path, and why the rig leaves the clipboard alone: it usually already
  holds that kickoff.
- **A generic mantle session** — press `y` at the account stage; the derived summons is
  on the clipboard, so ⌘V ⏎ is the whole first message. `y` is the only clipboard write
  this rig ever makes.

## Telemetry

`log/` is gitignored — local evidence, not canon truth.

- `log/invocations.jsonl` — one line per invocation, aborts included:
  `{ts, mode: pick|bare|repeat|eject|abort, keys, n, account, mantle, model, effort, color, cmd}`.
  `mantle`/`color`/`n` are `null` on the bare path; `keys` counts the `y` press.
- `log/last` — the last resolved command verbatim; source for both repeat and eject.
- `summon-stats` — counts by mantle × account, the mode split, and keys spent against
  the chars-of-command baseline.

Known v1 gaps, accepted: **eject logs the pre-edit command** — whatever Felix edits it
into lands in zsh history, not the log; a **repeat of a bare launch** logs `null`
descriptors (its `cmd` still carries everything, and reconstruction can only attribute
commands a preset still produces).

## Tests

`../lab/08/run` — drives the widget through every DoD path in a real pty against a
sandbox copy, then asserts on the transcript and the JSONL.
