# census — the city's liveness sensor

Ten Claude Code hook events → one JSONL line each, appended to `$CENSUS_DIR/census.jsonl` (default `~/code/agents/summon/log/census/`, D6, gitignored). Telemetry, never truth — prompts, tool inputs and command lines are dropped at the hook. Schema and evidence: [P1 F6](../plans/p1-census-join.md).

**The record** — `t ev sid acct ws sf pid cwd tp pmt mode aid at tool why bg`. Sort by `t`, never file order; key by `sid`, never `sf`; pair with `kill -0 pid`, since a hard kill emits no `SessionEnd` (P1 F5). `bg` is capped at 16 entries — a sample, not a count.

**The ritual (Felix-run, D14 — never agent-run),** from the merged checkout, never a worktree: `bun belvedere/census/deploy.ts --check` is the read-only drift alarm ×3; without `--check` it backs up once and merges. It refuses outright if an account carries hooks it did not write. `beat.sh` is silent by design; `--check` probes it live, loudly.
