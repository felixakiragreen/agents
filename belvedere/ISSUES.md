# Issues — Belvedere's incident inbox (D53 pattern)

Field reports, render failures (parser-as-lint, [README §1](README.md)), and
sovereign-inbox entries (`From Felix (via Belvedere): …`) land here — Felix's hand,
a session's at his word, or the glass's third write ([README §2](README.md)). Entry
format (D63): `- <YYYY-MM-DD> · <who> · <what>` — one bullet per entry; an entry
needing evidence becomes a `---`-separated block opening with that line. This
building's Architect sweeps at every sitting: each entry ruled — folded, cut as a
row, rejected, or escalated (canon-shaped entries go to the canon repo's inbox) —
then deleted; entries are committed before they are drained. A swept inbox is empty.

---

- 2026-08-26 · Digger (P2) · **canon-shaped — the rig's `cmd` burns turn 1 on
  `/color`.** P2 proved the summons can land as the **first user turn**, byte-exact,
  by riding argv (`claude … "$(cat <summons-file>)"`) — but only because colour left
  the prompt: cmux owns workspace colour natively (`workspace-action --action
  set-color`). The rig (`summon/presets.tsv`, `summon/summon.zsh`, 370 fires in
  `summon/log/invocations.jsonl`) still composes `"/color <c>"` as the launch prompt,
  which forces every summons to arrive by paste — and paste into a live Claude TUI
  splits at the first blank line and auto-submits paragraph 1 (P2 finding T4, the
  359-fire gap reproduced). Ask: `cmd` composes the summons; colour leaves the
  prompt. Evidence: [P2 §S3, §T4](plans/p2-spawn-recipe.md). Escalate to the canon
  inbox with P3's FC evidence — `summon/**` is canon ground, not this board's to cut.
