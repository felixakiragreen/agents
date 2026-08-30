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

**One edit, deliberate:** the `session_context` attachment row carries Felix's
email; every occurrence is placeheld with `redacted@example.com`. The row shape
— the one thing the reader is being tested against — is untouched.
