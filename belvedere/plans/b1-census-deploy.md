# B1 — the census deploy

**Status:** OPEN · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Parallel-safe with:** B2 (disjoint dirs; worktree `bv/b1-census`)
**Spec blessed:** 2026-08-26, Architect (fold sitting), on P1's findings — the
schema and hook are proven, this row hardens and packages them.

## Goal

The city's liveness sensor, ready to go live on all three accounts: the heartbeat
hook, its config, and the Felix-run deploy ritual. After G1 (Felix runs the
ritual), every session on every account appends census lines from birth to death.

## Spec

1. **`belvedere/census/beat.sh`** — harden [`lab/p1/beat.sh`](../lab/p1/beat.sh):
   the F6 record verbatim (fields: `t ev sid acct ws sf pid cwd tp pmt mode aid at
   tool why bg` — [P1 F6](p1-census-join.md) is the schema, do not redesign),
   appending to `$CENSUS_DIR` default `~/code/agents/summon/log/census/census.jsonl`
   (D6). **Never harms the session:** stderr silenced, always `exit 0` (no `exec` —
   a failing jq must not surface a nonzero), and the hook config carries a short
   timeout. Census is telemetry: the dropped-field list in F6 (prompts, tool
   inputs/outputs, command lines) stays dropped — secrets live there.
2. **Hook config** — all ten P1 events → beat.sh by absolute path, as a JSON
   fragment the deploy merges.
3. **`belvedere/census/deploy.ts`** (bun) — **Felix-run, never agent-run** (D14's
   pattern): for each config dir in `summon/accounts.tsv`, back up
   `settings.json` once, MERGE the hooks fragment in. P1 measured the personal
   account clean (`hooks: null`); the other two are unverified — **existing hooks
   of any kind → refuse loudly and stop, never overwrite** (fail fast). `--check`
   mode reports drift ×3 (the `sync/check` precedent), touches nothing.
4. **`belvedere/census/README.md`** — 15 lines max: what, the record, the ritual.

## Acceptance criteria / DoD — evidence pasted here at build time

- [ ] Scratch-venue proof: a hooked session emits F6-shaped lines for a
      prompt/tool/subagent/stop/end pass; byte-diff of one line's keys against F6.
- [ ] Control (DOCTRINE §6.2): identical scratch venue, no hooks — census silent.
- [ ] Bench: p95 ≤ 10 ms over 50 runs on the fattest captured payload
      (P1's bench harness, re-run against the hardened script).
- [ ] Harm-proof: census dir deleted mid-session → session unharmed, lines resume
      on next event (dir recreated or write skipped silently — either, but shown).
- [ ] Failure-proof: jq absent/failing → session unharmed, exit 0 shown.
- [ ] `deploy.ts --check` runs green against a SCRATCH config dir (fixture);
      refusal path shown against a fixture with pre-existing hooks.
- [ ] Live ×3 deploy: **NOT this row's to run** — Felix's, at G1. Status annotation
      PENDING until then.

## Out of scope

- Running the deploy against any live `~/.claude*` dir (Felix-run, G1).
- Any glass/rendering work (B2), any census *reader* beyond the DoD proofs.
- Non-hook sensors, retention/rotation policy (revisit when the file earns it).

## Findings

*(append here — deviations from spec, adjacent discoveries; the commits are the
primary artifact)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b1-census-deploy.md,
and build the order.
```
