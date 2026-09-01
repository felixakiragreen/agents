# census — the city's liveness sensor

Eleven Claude Code hook events → one JSONL line each, appended to `$CENSUS_DIR/census.jsonl`
(default `~/code/agents/summon/log/census/`, D6, gitignored). Telemetry, never truth —
prompts, tool inputs and command lines are dropped at the hook. Schema and evidence:
[P1 F6](../../belvedere/plans/p1-census-join.md).

**The record** — `t ev sid acct ws sf pid cwd tp pmt mode aid at tool why bg`. Sort by
`t`, never file order; key by `sid`, never `sf`; pair with `kill -0 pid`, since a hard
kill emits no `SessionEnd` (P1 F5). `bg` is capped at 16 entries — a sample, not a count.

**The ritual (Felix-run, D14 — never agent-run),** from the merged checkout, never a
worktree: `bun summon/census/deploy.ts --check` is the read-only drift alarm ×3;
without `--check` it backs up once and merges. It refuses outright if an account carries
hooks it did not write. `beat.sh` is silent by design; `--check` probes it live, loudly.

**The home moved 2026-09-01** (stigmergon S22, D20): these four files came from
`belvedere/census/` verbatim — the sensor is Guild infrastructure and outlives any
renderer, so it lives beside its log and `accounts.tsv`. The corpse's copy is **dead on
purge**: untouched until then, and the hooks ×3 keep calling it until G5 — Felix's hand —
repoints them here. A moved home reads as `REFUSED … existing hooks → …/belvedere/census/beat.sh`,
by design (never overwrite another writer's hooks); G5's step is a one-line path retarget
per account, then `--check` goes green — see stigmergon `plans/s22-sensor-home.md` F2.

**Readers** — the log is read by stigmergon's pulse (the alive view). The wire shape is
law and does not change.
