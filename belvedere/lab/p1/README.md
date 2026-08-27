# lab/p1 — the census probe

Scratch rig for [P1](../../plans/p1-census-join.md). Findings live in the brief;
these are the runnable pieces that produced them. Raw captures go to
`summon/log/census/p1/` (gitignored).

**Never point these at a live `~/.claude*/settings.json`.** Hook config lives in a
scratch project minted outside the repo; the ×3 account deploy is a Felix-run ritual.

| File | What it is |
|---|---|
| `beat.sh` | **The production candidate.** One `exec` into `jq`: projects a fixed field set, stamps `now`, appends to `$CENSUS_DIR/census.jsonl`. 5.5 ms median. |
| `capture.sh` | Probe hook — wraps the *verbatim* payload plus the hook process's `CMUX_*`/`CLAUDE_*` env. Fatter than `beat.sh` on purpose. |
| `envdump.sh` | One-shot full env of a hook process (proves the join by exhaustion). |
| `mkproject.sh` | Mints a scratch project dir with (or, for the control, without) `.claude/settings.json`. |
| `settings.tmpl.json` | All ten hook events wired to `capture.sh`. |
| `run.sh` | Drives one headless scratch session; strips the parent's `CLAUDE_*` identity, keeps `CMUX_*`. |
| `pty_run.py` | Drives an **interactive** session in a pty — headless never emits `Notification`. Steps are `delay:keys` args. |
| `bench.py` | Q3 — replays a captured payload N times per candidate, reports min/median/p95/max. |
| `noop.sh` | Bench baseline: the irreducible cost of spawning any hook at all. |
| `slow.sh` | Validity check — `sleep 0.5` per event, to prove hooks block. |

```sh
./mkproject.sh /tmp/p1-hooks hooks
./run.sh smoke - 'Reply with exactly: PONG'
python3 bench.py /tmp/p1-payload.json 50
```
