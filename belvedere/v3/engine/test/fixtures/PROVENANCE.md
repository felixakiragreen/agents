# The engine's fixtures — where they came from

**`demo-run.jsonl`** — the demo flow's run log, recorded by `bun test/record.ts`
against the fake claude. Regenerate it whenever `flows/demo.json` or the event
set changes; the invariant tests cut their corrupted logs from it. Two things a
re-record moves that are not defects: every session id, pid and timestamp is
fresh, and the **interleaving of the parallel steps** is whatever that run's
subjects finished in — the log records the order as fact (`replay.ts`), it does
not fix it. What must not move is the shape: 39 events, 9 turns, the same ten
verdicts, invariants 0. Re-recorded at C14, when `ignited` gained `configDir`.

**`pre-c14-run.jsonl`** — the demo run as it stood **before** C14, byte for
byte: its `ignited` events carry no `configDir`, because the field did not exist
when it was written. It is older than that in one more way, found by C14's own
re-record: it predates the step `prompt` field too, so `load()` refuses to
re-open it (invariant 8, "blessed on a different flow"). That is why the drive
half of its test strikes `configDir` from the *current* log instead — one
variable at a time. It is the compatibility corpus for the one promise C14
makes to every log already on disk — *absence is legal forever* — so it is
**frozen**: never re-record it, and never backfill it. Its own test
(`compat.test.ts`) asserts the absence, the verdicts it shares with the current
fixture, and that a drive verb on it refuses in kind rather than guessing.

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

**`real-c8-q1-smoke.jsonl`** — a C8 subject turn the engine **landed** from the
stream, 14 rows, one turn, on the `thg-fgreen` account. The C13 corpus: it ends
`assistant text` → `assistant tool_use:StructuredOutput` → `user tool_result`,
the shape `--json-schema` gives every engine turn and the shape the pre-C13
completion rule read as died-mid-work (C8 F3, K1). Its `StructuredOutput` input
is the step report itself — `{"state":"done","cause":"n/a"}` — which is why the
fallback can land from disk at all. **Sourced from C12's archive, never from a
live config dir:**

```
summon/log/archive/.claude-thg-fgreen/-private-tmp-claude-502--Users-felix-\
code-agents-acc07356-4518-44b7-85e1-cd75f58d25c0-scratchpad-c8-q1-smoke-thg-\
fgreen/1441a473-b6bf-41d9-a40f-3c436e84dd55.jsonl
```

**`real-c8-q5-question.jsonl`** — C8's `q5-question` probe, 18 rows, one turn,
personal account. The negative control for the one above: the same closing pair,
but the report on disk says `needs_input`, so the turn is **complete and still
does not land**. Source:

```
summon/log/archive/.claude/-private-tmp-claude-502--Users-felix-code-agents-\
acc07356-4518-44b7-85e1-cd75f58d25c0-scratchpad-c8-q5-question-personal/\
9d9e2d24-a1a6-43c5-9b14-6a95327a4ca2.jsonl
```

**One edit, deliberate, in every real transcript that carries it** (four of the
five — `real-c8-q1-smoke.jsonl` has no `session_context` row): that row carries
Felix's email, and every occurrence is placeheld with `redacted@example.com` —
same length, so byte offsets are unmoved. The row shape — the one thing the
reader is being tested against — is untouched.
