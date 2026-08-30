# C5 — the fake claude

**Status:** OPEN — laid 2026-08-29 · **Depends on:** C4 · **Staffing:** Builder ·
opus-high · **Spec blessed:** rides the BLESSED cornerstone §8 arc (⬡✓
2026-08-29); pre-chewed and laid by the board's Architect, 2026-08-29 · **Branch:**
none — serial sole lane, straight to `master`, explicit paths

## Goal

`belvedere/v3/fake-claude/` — the stand-in the engine spawns instead of real
`claude`: **the binary** (speaks C4's captured dialect), **the scenario library**
(scripts a subject's behavior, turn by turn), and **the stream validator** (the
conformance oracle both directions: real captures validate, fake output
validates). This is the campaign's standing instrument — C6 builds against it, C7
fuzzes with it, C9 scales on it — built to last, full directives.

## Inputs — read before working

- **Normative:** [../lab/c4/grammar.md](../lab/c4/grammar.md) — the event set
  (§1), identity + transcript path (§2), inject arms (§3), permission physics
  (§4), sense states (§5), kill/survive (§6), the ten parse rules (§10). The
  grammar is the contract; a deviation the build needs is a finding filed, never
  a silent divergence.
- **Fixtures:** [../lab/c4/captures/](../lab/c4/captures/) — 43 capture dirs,
  each `stdout.jsonl` + `conditions.json`. The validator's denominator.
- C4 findings F1 (multiple `result`s per invocation), F3 (both arms + arm B's
  merge trap), F5 (needs-⬡(question) via `--json-schema` only), F6 (silent
  success; posture asked ≠ granted), F7 (transcript append-whole-lines, orphan
  finishes), F12 (the fake needs no isolation — it IS isolated).
- [../cornerstone.md](../cornerstone.md) §§3–6; [../README.md](../README.md) —
  the fence.
- Do not re-derive anything C4 measured. Zero real `claude` invocations in this
  charge — **budget: 0 subject turns**.

## The spec

### The dialect — pinned

- **Entry point contract:** the engine execs `bun v3/fake-claude/cli.ts
  <claude-argv>`. The argv surface is real claude's, exactly the subset the
  engine uses: `-p <prompt>` · `--session-id <uuid>` · `--resume <sid>` ·
  `--output-format stream-json` · `--verbose` · `--include-hook-events` ·
  `--permission-mode <m>` · `--model <m>` · `--json-schema <schema>` ·
  `--input-format stream-json`. **Unknown flags refuse loudly** (fail fast) —
  the argv stays dialect-pure.
- **Scenario selection rides env, never argv:** `FAKE_CLAUDE_SCENARIO=<path>`,
  `FAKE_CLAUDE_SEED=<n>`. Missing scenario = loud refusal.
- **Sandbox guard:** `CLAUDE_CONFIG_DIR` is the fake's write root (transcripts at
  `<CLAUDE_CONFIG_DIR>/projects/<slug>/<sid>.jsonl`, slug per grammar §2). It
  **refuses to run** when `CLAUDE_CONFIG_DIR` is unset or resolves to a real
  account dir (`~/.claude*`) — wrong code looks wrong and dies at the door. No
  network, ever; no real `claude` resolved, ever.
- **Emissions:** grammar §1's event set — `system/init` (session_id, model,
  permissionMode, cwd, tools[], apiKeySource, version), `assistant`
  (text/tool_use), `user` (tool_result), `system/permission_denied`,
  `system/thinking_tokens` noise, `system/hook_started`/`hook_response` under
  `--include-hook-events`, `rate_limit_event`, and `result` with every field the
  engine reads (subtype, is_error, num_turns, stop_reason, terminal_reason,
  usage, total_cost_usd, duration_ms, **permission_denials[]**,
  queued_turn_count). Multiple `result`s per invocation is a scenario, not an
  error (F1).
- **Transcript:** append-whole-lines, always — a cut at any moment leaves no
  torn line (F7's shape, by construction).
- **Exit codes:** 0 · scenario-scripted deaths (exit n, or self-SIGKILL for 137)
  · real signals honored.
- **Determinism:** virtual clock (t0 + declared deltas), uuids from the seed —
  same (scenario, seed, argv) → **byte-identical stream and transcript**. Real
  delays only where an act declares `delay_ms` (kill-window scenarios).

### The scenario language

One JSON file = one subject's script: acts indexed by turn (turn 0 = ignite,
turn n = the nth resume or stdin message); each act a sequence of steps —
emit text · tool_use/tool_result pair · deny (⇒ permission_denied +
denials[]) · init-override (posture granted ≠ asked — F6.2) · delay_ms ·
report (the `--json-schema` answer: done / needs_input / blocked + cause) ·
die (exit n / signal) · hang · result-override (any field). Design freedom
inside this shape is the Builder's; the shape itself is the spec.

### The scenario library — ≥20 from this list, add freely, subtract nothing

echo · one-tool · multi-tool · subagent double-result (F1) · permission-denial
silent-success (grammar §4 `manual` row, verbatim shape) · posture-mismatch
(haiku+auto→default row) · plan no-op (success, 0 denials, no work) · slow-turn
(the T-long analog) · die-mid-turn 137 (no `result`, transcript whole to the
cut) · die-exit-1 (`error_during_execution`) · orphan-finish (parent dies, fake
completes, transcript whole) · hang (no `result`, stays alive) · needs_input
via schema · done via schema · blocked via schema · resume-chain ×4 (arm A: 4
invocations, one transcript, user rows byte-exact) · arm B paced ×4 (one
process, 4 results) · arm B merge trap (unpaced: fewer results than messages,
`queued_turn_count > 0`) · usage/cost fields populated · hook events under
`--include-hook-events` · rate_limit_event interleaved · thinking_tokens noise.

### The validator

`fake-claude/validate.ts` — parses a stream (+ optional transcript) and rules
grammar conformance: known type/subtype, required fields per type, turn-boundary
legality, denials/result coherence, transcript path + whole-lines. **A campaign
instrument:** C6's parser tests and C7's oracle import it — the API is an
interface, keep it small and stable.

## Done when

1. `bun test` green in `v3/fake-claude/`; `bunx tsc --noEmit` green (the coda's
   sanctioned check). Output pasted.
2. **Validator vs reality: 43/43 C4 capture dirs green.** Denominator: every dir
   in `../lab/c4/captures/` with a `stdout.jsonl`.
3. **The negative control (a validator nobody saw fail is theater): ≥3 corrupted
   captures red** — e.g. a stripped required field, an unknown subtype, a torn
   final line — each named in the test.
4. **≥20 scenarios** from the list, each with a committed golden stream;
   `--gild` records them; same (scenario, seed) → byte-identical ×3 runs, shown
   for at least 3 scenarios.
5. **Speed:** p50 spawn→exit for the echo scenario ≤ 100 ms over 50 spawns,
   conditions recorded (load, machine state).
6. **The sandbox guard proven:** a test spawns with `CLAUDE_CONFIG_DIR` pointed
   at a real account dir and asserts the loud refusal; same for unset.
7. Crash scenarios re-parsed: transcript has zero torn lines after every
   scripted death. Evidence pasted.

## Out of scope

The engine (C6) · the topology fuzzer and the oracle's invariant checks (C7 —
scenarios here script one subject, never a flow) · census emission · any real
`claude` invocation · TUI/summon modeling (viewport physics are real-only) ·
`--bare`/`--safe-mode` semantics (the fake needs no isolation). **Creep is a
bug.**

## Findings

*(append here)*

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c5-fake-claude.md.
```
