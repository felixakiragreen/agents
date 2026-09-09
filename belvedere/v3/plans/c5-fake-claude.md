# C5 — the fake claude

**Status:** LANDED 2026-08-29 · **Depends on:** C4 · **Staffing:** Builder · opus-high · **Spec blessed:** rides the BLESSED cornerstone §8 arc (⬡✓ 2026-08-29); pre-chewed and laid by the board's Architect, 2026-08-29 · **Branch:** none — serial sole lane, straight to `master`, explicit paths

## Goal

`belvedere/v3/fake-claude/` — the stand-in the engine spawns instead of real `claude`: **the binary** (speaks C4's captured dialect), **the scenario library** (scripts a subject's behavior, turn by turn), and **the stream validator** (the conformance oracle both directions: real captures validate, fake output validates). This is the campaign's standing instrument — C6 builds against it, C7 fuzzes with it, C9 scales on it — built to last, full directives.

## Inputs — read before working

- **Normative:** [../lab/c4/grammar.md](../lab/c4/grammar.md) — the event set (§1), identity + transcript path (§2), inject arms (§3), permission physics (§4), sense states (§5), kill/survive (§6), the ten parse rules (§10). The grammar is the contract; a deviation the build needs is a finding filed, never a silent divergence.
- **Fixtures:** [../lab/c4/captures/](../lab/c4/captures/) — 43 capture dirs, each `stdout.jsonl` + `conditions.json`. The validator's denominator.
- C4 findings F1 (multiple `result`s per invocation), F3 (both arms + arm B's merge trap), F5 (needs-⬡(question) via `--json-schema` only), F6 (silent success; posture asked ≠ granted), F7 (transcript append-whole-lines, orphan finishes), F12 (the fake needs no isolation — it IS isolated).
- [../cornerstone.md](../cornerstone.md) §§3–6; [../README.md](../README.md) — the fence.
- Do not re-derive anything C4 measured. Zero real `claude` invocations in this charge — **budget: 0 subject turns**.

## The spec

### The dialect — pinned

- **Entry point contract:** the engine execs `bun v3/fake-claude/cli.ts <claude-argv>`. The argv surface is real claude's, exactly the subset the engine uses: `-p <prompt>` · `--session-id <uuid>` · `--resume <sid>` · `--output-format stream-json` · `--verbose` · `--include-hook-events` · `--permission-mode <m>` · `--model <m>` · `--json-schema <schema>` · `--input-format stream-json`. **Unknown flags refuse loudly** (fail fast) — the argv stays dialect-pure.
- **Scenario selection rides env, never argv:** `FAKE_CLAUDE_SCENARIO=<path>`, `FAKE_CLAUDE_SEED=<n>`. Missing scenario = loud refusal.
- **Sandbox guard:** `CLAUDE_CONFIG_DIR` is the fake's write root (transcripts at `<CLAUDE_CONFIG_DIR>/projects/<slug>/<sid>.jsonl`, slug per grammar §2). It **refuses to run** when `CLAUDE_CONFIG_DIR` is unset or resolves to a real account dir (`~/.claude*`) — wrong code looks wrong and dies at the door. No network, ever; no real `claude` resolved, ever.
- **Emissions:** grammar §1's event set — `system/init` (session_id, model, permissionMode, cwd, tools[], apiKeySource, version), `assistant` (text/tool_use), `user` (tool_result), `system/permission_denied`, `system/thinking_tokens` noise, `system/hook_started`/`hook_response` under `--include-hook-events`, `rate_limit_event`, and `result` with every field the engine reads (subtype, is_error, num_turns, stop_reason, terminal_reason, usage, total_cost_usd, duration_ms, **permission_denials[]**, queued_turn_count). Multiple `result`s per invocation is a scenario, not an error (F1).
- **Transcript:** append-whole-lines, always — a cut at any moment leaves no torn line (F7's shape, by construction).
- **Exit codes:** 0 · scenario-scripted deaths (exit n, or self-SIGKILL for 137) · real signals honored.
- **Determinism:** virtual clock (t0 + declared deltas), uuids from the seed — same (scenario, seed, argv) → **byte-identical stream and transcript**. Real delays only where an act declares `delay_ms` (kill-window scenarios).

### The scenario language

One JSON file = one subject's script: acts indexed by turn (turn 0 = ignite, turn n = the nth resume or stdin message); each act a sequence of steps — emit text · tool_use/tool_result pair · deny (⇒ permission_denied + denials[]) · init-override (posture granted ≠ asked — F6.2) · delay_ms · report (the `--json-schema` answer: done / needs_input / blocked + cause) · die (exit n / signal) · hang · result-override (any field). Design freedom inside this shape is the Builder's; the shape itself is the spec.

### The scenario library — ≥20 from this list, add freely, subtract nothing

echo · one-tool · multi-tool · subagent double-result (F1) · permission-denial silent-success (grammar §4 `manual` row, verbatim shape) · posture-mismatch (haiku+auto→default row) · plan no-op (success, 0 denials, no work) · slow-turn (the T-long analog) · die-mid-turn 137 (no `result`, transcript whole to the cut) · die-exit-1 (`error_during_execution`) · orphan-finish (parent dies, fake completes, transcript whole) · hang (no `result`, stays alive) · needs_input via schema · done via schema · blocked via schema · resume-chain ×4 (arm A: 4 invocations, one transcript, user rows byte-exact) · arm B paced ×4 (one process, 4 results) · arm B merge trap (unpaced: fewer results than messages, `queued_turn_count > 0`) · usage/cost fields populated · hook events under `--include-hook-events` · rate_limit_event interleaved · thinking_tokens noise.

### The validator

`fake-claude/validate.ts` — parses a stream (+ optional transcript) and rules grammar conformance: known type/subtype, required fields per type, turn-boundary legality, denials/result coherence, transcript path + whole-lines. **A campaign instrument:** C6's parser tests and C7's oracle import it — the API is an interface, keep it small and stable.

## Done when

All seven met 2026-08-29. The suite asserts every claim below; the pasted numbers are the same checks run by hand so the counts are visible.

**1. `bun test` green; `bunx tsc --noEmit` green.**

```
$ cd belvedere/v3/fake-claude && bun test
bun test v1.3.10 (30e609e0)

speed.test.ts:
spawn->exit over 50: min=15 p50=16 p90=20 max=25 ms
load 9.35 9.01 7.23 -> 9.64 9.07 7.26

 58 pass
 0 fail
 295 expect() calls
Ran 58 tests across 7 files. [10.24s]

$ ../../glass/node_modules/.bin/tsc --noEmit ; echo exit=$?
exit=0
```

(The deck's repo-pinned `typescript@7.0.2` + `@types/bun`, offline, per the coda's B8 gate; `fake-claude` has no `node_modules` of its own and installs nothing — `package.json`'s `typecheck` script is that path.)

**2. Validator vs reality: 43/43.** `validate.test.ts` asserts both the denominator and the verdict.

```
$ bun -e '<validate every captures/*/stdout.jsonl>'
capture dirs with stdout.jsonl: 43  conformant: 43  red: 0
```

**3. The negative control — five corrupted captures, all red**, each named in `validate.test.ts`:

```
1 result missing a required field  -> 2 violations, rules {fields, denials}: result/success is missing permission_denials
2 unknown subtype                  -> 4 violations, rules {subtype, init-first, turns}: unknown system subtype "initialise"
3 torn final line                  -> 1 violations, rules {json}: line is not JSON
4 denial never reaching a result   -> 1 violations, rules {denials}: permission_denied toolu_015Et1tfyNvZM8YPjWSubYDr never reached a result's denials
5 a second session id              -> 1 violations, rules {session}: second session id 00000000-0000-4000-8000-000000000000
```

**4. 23 scenarios, each with a committed golden; `--gild` records them.**

```
$ bun goldens.ts
ok    armb-merge-trap
ok    armb-merge-trap-queued
ok    armb-paced-4
ok    die-137
ok    die-exit-1
ok    echo
ok    hang
ok    hook-events
ok    multi-tool
ok    one-tool
ok    orphan-finish
ok    permission-denial
ok    plan-noop
ok    posture-mismatch
ok    rate-limit
ok    resume-chain-4
ok    schema-blocked
ok    schema-done
ok    schema-needs-input
ok    slow-turn
ok    subagent-double-result
ok    thinking-noise
ok    usage-cost

23 match, 0 differ
```

Byte-identity ×3, shown on four scenarios spanning both arms and both process shapes (one process per turn, and four turns in one process):

```
scenarios: 23
echo             sha256(stream)/sha256(transcript) x3: 0a033f6b86277908/195533480ea8bdb9  0a033f6b86277908/195533480ea8bdb9  0a033f6b86277908/195533480ea8bdb9  identical=true
multi-tool       sha256(stream)/sha256(transcript) x3: 9a5a134c1618cfa9/92d5d63d16fc24e6  9a5a134c1618cfa9/92d5d63d16fc24e6  9a5a134c1618cfa9/92d5d63d16fc24e6  identical=true
resume-chain-4   sha256(stream)/sha256(transcript) x3: fa220a39d34d9089/c7fcd728fcafa1b0  fa220a39d34d9089/c7fcd728fcafa1b0  fa220a39d34d9089/c7fcd728fcafa1b0  identical=true
armb-paced-4     sha256(stream)/sha256(transcript) x3: debed39230201264/1c7d3ba354232e76  debed39230201264/1c7d3ba354232e76  debed39230201264/1c7d3ba354232e76  identical=true
```

**5. Speed: p50 16 ms over 50 spawns** — the bar is 100 ms.

```
spawn->exit over 50: min=15 p50=16 p90=20 max=25 ms
load 9.35 9.01 7.23 -> 9.64 9.07 7.26
```

Conditions: macOS 24.6.0, this machine, load ~9 (a busy interactive session and the suite itself); `bun` 1.3.10; the echo scenario, argv mode, stdout piped and drained. A 1,000-run layer-0 barrage is ~16 s of subject time.

**6. The sandbox guard, proven by spawn** (`guard.test.ts`, and by hand):

```
CLAUDE_CONFIG_DIR=/Users/felix/.claude            -> exit=2 stdout=0 bytes stderr="fake-claude: CLAUDE_CONFIG_DIR /Users/felix/.claude is a real account dir — the fake never writes into one"
CLAUDE_CONFIG_DIR=/Users/felix/.claude-thg-fgreen -> exit=2 stdout=0 bytes stderr="fake-claude: CLAUDE_CONFIG_DIR /Users/felix/.claude-thg-fgreen is a real account dir — the fake never writes into one"
CLAUDE_CONFIG_DIR=(unset)                         -> exit=2 stdout=0 bytes stderr="fake-claude: CLAUDE_CONFIG_DIR is unset — the fake has no sandbox to write into"
--- unknown flag ---
exit=2 stderr="fake-claude: unknown flag "--effort" — the fake speaks only the engine's dialect"
--- nothing written into the real accounts ---
ls: cannot access '/Users/felix/.claude/projects/-Users-felix-code-agents-belvedere-v3-fake-claude': No such file or directory
```

**7. Crash scenarios re-parsed: zero torn lines after every scripted death** (`crash.test.ts`). The orphan drill kills a real parent process mid-turn and the subject finishes anyway.

```
die-137          exit=137  results_in_stream=0  transcript rows=6 torn=0 violations=0
die-exit-1       exit=1    results_in_stream=1  transcript rows=3 torn=0 violations=0
hang             exit=null results_in_stream=0  transcript rows=2 torn=0 violations=0
orphan-finish    exit=0    results_in_stream=1  transcript rows=7 torn=0 violations=0
```

## Out of scope

The engine (C6) · the topology fuzzer and the oracle's invariant checks (C7 — scenarios here script one subject, never a flow) · census emission · any real `claude` invocation · TUI/summon modeling (viewport physics are real-only) · `--bare`/`--safe-mode` semantics (the fake needs no isolation). **Creep is a bug.**

## Findings

**F1 — `queued_turn_count` does NOT signal merged turns; grammar §10.9 is falsified by C4's own capture.** Grammar §3 and parse rule 9 say "`queued_turn_count > 0` in a result means turns were merged". The unpaced capture it rests on, `captures/q2-b-personal`, produced 2 results for 4 messages — turns merged — and **both results report `queued_turn_count: 0`**:

```
$ jq -c 'select(.type=="result")|{num_turns,queued_turn_count}' captures/q2-b-personal/stdout.jsonl
{"num_turns":1,"queued_turn_count":0}
{"num_turns":1,"queued_turn_count":0}
```

A detector written to rule 9 never fires. The only sound signal is arithmetic: **fewer results than messages sent**. This bit the charge's own scenario list ("unpaced: fewer results than messages, `queued_turn_count > 0`"), so the library ships **both** shapes rather than picking one silently: `armb-merge-trap` is the measured shape (2 results, both 0) and `armb-merge-trap-queued` is the shape rule 9 assumes (second result carries 2), so a detector written either way has something to fire on. **Grammar §3 and parse rule 9 need the Architect's amendment before C6 writes the detector.**

**F2 — `SessionStart` hook events are emitted WITHOUT `--include-hook-events`.** Grammar §1 puts the hook lifecycle behind that flag. Twelve captures ran without it; every one carries a `SessionStart` hook pair, and nothing else:

```
q3-schema-done                 flag=false  hooks=[SessionStart:startup]
q5b-1-headless-personal        flag=false  hooks=[SessionStart:startup]
q6-SIGKILL-personal-resume     flag=false  hooks=[SessionStart:resume]
```

(argv verified faithful in each — `q2-b-paced-*` looks flagless too, but its `conditions.json` records the placeholder `["paced"]`; `q2b-paced.ts` does pass the flag. Disregard those three rows; the finding stands on the nine that record real argv.) So the flag gates `UserPromptSubmit` / `PreToolUse` / `PostToolUse` / `Stop`, and **`SessionStart` leaks unconditionally**. The fake follows this charge's spec — all hook events under the flag — so a C6 parser hardened only against the fake will meet an unexpected `SessionStart` pair on every unflagged real invocation. One-line fix in `run.ts` once ruled.

**F3 — the pinned argv subset is missing `--effort`, and probably `--tools`.** The dialect this charge pins has no `--effort`; **all 43 C4 captures were spawned with `--effort low`**, and the Guild's staffing grid is model × effort, so C6's ignite almost certainly carries it. `--tools ""` was used on `q3-schema-*` and the q5 summon runs, and `--replay-user-messages` is what produces arm B's `isReplay` echo rows. The fake refuses all three loudly (by design, `argv.ts`). **Adding a flag is a contract change, so nothing was added** — the Architect's amendment, then three lines in `argv.ts`.

**F4 — the fake's transcript is grammar §2's minimum, not a replica.** It writes `user`, `assistant` and `last-prompt` rows. Real transcripts also carry `attachment` (the environment/model/skills/agents preamble — kilobytes of it), `queue-operation`, `mode` and `atis-latch`. Grammar §2 says only `user`/`assistant` carry conversation, so the minimum is right for the engine — but **C6's transcript reader must be exercised against a real capture too**, or it will meet its first `attachment` row in production.

**F5 — same seed, same session id, across scenarios.** Determinism means a fake spawned without `--session-id` at seed 1 always reports `a08ff49b-6f77-4263-8716-c43069c43a8c`, whatever the scenario. This is correct (parse rule 5: the engine chooses the id) but it is a collision waiting for a fuzzer: **C7 must pass `--session-id` or vary the seed per subject.**

**F6 — bun narrows variables captured by an IIFE.** `wake?.()` inside `void (async () => { … })()` type-checks as `never` because TS applies the call-site value to the capture. Named the function and called it; noted here because the pattern (an async pump feeding a queue the outer scope drains) will recur in C6's stream reader.

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c5-fake-claude.md.
```
