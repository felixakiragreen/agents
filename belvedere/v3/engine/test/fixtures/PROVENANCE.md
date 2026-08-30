# The engine's fixtures — where they came from

**`demo-run.jsonl`** — the demo flow's run log, recorded by `bun test/record.ts`
against the fake claude. Regenerate it whenever `flows/demo.json` or the event
set changes; the invariant tests cut their corrupted logs from it.

**`real-q1-write.jsonl`** — C4's `q1-write-personal` probe transcript, copied
from the personal config dir (C5 F4 / C6 bar 10: the reader must meet a real
`attachment` row before production does). The probe is C4's own output — one
`-p` turn in a scratch venue asking for `ping.txt`, refused by the posture.
Source:

```
~/.claude/projects/-private-tmp-claude-502--Users-felix-code-agents-\
6902add3-501b-475a-9304-6df5b3bc8371-scratchpad-c4-q1-write-personal/\
07dfc3bd-d082-4c6e-b908-04e3f7f640ad.jsonl
```

**`real-q2-a-resume.jsonl`** — C4's `q2-a-personal` probe transcript, 38 rows
over **four turns**: one ignition and three `--resume` turns carrying the TURN1
/ TURN2 / TURN3 markers of the four `q2-a-personal-t<n>` captures. The turn
cursor's corpus (C11 bar 2): four known turns in one session file. Source:

```
~/.claude/projects/-private-tmp-claude-502--Users-felix-code-agents-\
6902add3-501b-475a-9304-6df5b3bc8371-scratchpad-c4-q2-a-personal/\
646e0809-f7b0-4e4f-ac24-4370f6eb2018.jsonl
```

**`real-q5b-summon.jsonl`** — C4's `q5b` summon round trip, 44 rows over
**three turns**: headless, then a turn **typed by hand in a summoned pane**,
then headless again on the same session (C4 F8, D20's fallback). The capture
that makes the ruling's case: the engine fired two of these three turns, so any
arithmetic over turn indices addresses the wrong one, and only a recorded row
count addresses the right one (C11 bar 2). It also carries the row shapes no
other fixture has — `bridge-session`, `file-history-snapshot`, `cost-state`,
`mode`, `permission-mode`. Source:

```
~/.claude/projects/-Users-felix-code-agents-belvedere-v3-lab-c4-summon-venue/\
3f14e1e9-d8d0-4d65-b843-17021b4b4727.jsonl
```

**One edit, deliberate, in all three real transcripts:** the `session_context`
attachment row carries Felix's email; every occurrence is placeheld with
`redacted@example.com` — same length, so byte offsets are unmoved. The row
shape — the one thing the reader is being tested against — is untouched.
