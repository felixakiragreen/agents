# census — the city's liveness sensor

Ten Claude Code hook events → one JSONL line each, appended to
`$CENSUS_DIR/census.jsonl` (default `~/code/agents/summon/log/census/`, D6,
gitignored). Telemetry, never truth: prompts, tool inputs/outputs and command
lines are dropped at the hook. Schema and evidence:
[P1 F6](../plans/p1-census-join.md).

**The record** — `t ev sid acct ws sf pid cwd tp pmt mode aid at tool why bg`.
Sort by `t`, never by file order; key by `sid`, never by `sf`; and a reader must
pair the stream with `kill -0 pid` — a hard kill emits no `SessionEnd` (P1 F5).

**The ritual (Felix-run, D14 — never agent-run):**

```sh
bun belvedere/census/deploy.ts --check    # drift alarm ×3, touches nothing
bun belvedere/census/deploy.ts            # back up once, merge hooks.json, verify
```

Refuses the whole run if any account already carries hooks — nothing is
overwritten, and the city is never half-sensored. `beat.sh` is silent by design
(it must never break a session); `--check` probes it live and is the loud end.
