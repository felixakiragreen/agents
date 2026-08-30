# fake-claude — the stand-in

The binary the v3 engine spawns instead of real `claude`. It speaks C4's
captured dialect ([../lab/c4/grammar.md](../lab/c4/grammar.md)), is scripted
turn by turn, is byte-deterministic from a seed, costs nothing, and finishes in
~16 ms. Engine correctness is proven against it before a real token is spent
(D21).

Built at [C5](../plans/c5-fake-claude.md). **Standing instrument:** C6 builds
against it, C7 fuzzes with it, C9 scales on it — treat the validator's API and
the scenario language as interfaces, not internals.

## The contract

```
bun v3/fake-claude/cli.ts <claude-argv>
```

argv is real claude's, exactly the subset the engine uses — `-p <prompt>` ·
`--session-id <uuid>` · `--resume <sid>` · `--output-format stream-json` ·
`--verbose` · `--include-hook-events` · `--permission-mode <m>` ·
`--model <m>` · `--json-schema <schema>` · `--input-format stream-json` ·
accepted-and-inert (C5 F3, ruled 2026-08-29): `--effort <v>` · `--tools <list>` ·
`--replay-user-messages`.
**Anything else refuses loudly (exit 2).** `--output-format stream-json`,
`--verbose` and `-p` are required; the fake is headless-only.

The script rides the environment, never argv:

| variable | meaning |
|---|---|
| `FAKE_CLAUDE_SCENARIO` | path to the scenario JSON — **required** |
| `FAKE_CLAUDE_SEED` | the id stream (default `1`) |
| `CLAUDE_CONFIG_DIR` | the write root — **required**, and never a real account |

**The sandbox guard.** The fake refuses to run when `CLAUDE_CONFIG_DIR` is
unset, relative, or resolves to `~/.claude*` — it writes transcripts, and a
transcript in a real account dir poisons the city's own session store. The
refusal fires before any byte is written or emitted. It resolves no `claude`,
opens no socket, and reaches no network: the whole program is this directory.

**Exit codes:** `0` success · `2` refusal (argv, guard, scenario) · whatever a
`die` step scripts · a real signal when a `die` step names one.

**Determinism.** Same `(scenario, seed, argv, cwd)` → byte-identical stream and
transcript. Ids come from the seed folded with the act index; timestamps come
from a virtual clock (2026-01-01, +1 h per act), not the wall. The only real
wall time a scenario spends is a `delay` step — the window a killer cuts into.
A fake spawned without `--session-id` at the same seed gets the same session id;
the engine chooses the id (grammar §2, parse rule 5), and C7 varies the seed.

## The scenario language

One JSON file scripts one subject. `acts` are indexed by turn — 0 is the
ignite, n is the nth `--resume` or stdin message. Under `--resume` the act
index is re-derived from the transcript on disk, so arm A's four invocations
walk four acts without the engine tracking anything but the session id.

Each act is a list of steps, performed in order:

| step | emits |
|---|---|
| `init` | `system/init`. **Required first step of every act**; legal again mid-act (F1's second init). `permissionMode` / `model` override what init reports — that is how "posture asked ≠ posture granted" is scripted (F6.2). |
| `text` | one `assistant` text block; optional `thinking` adds a thinking block first |
| `tool` | `assistant` tool_use + the `user` tool_result, and `Pre`/`PostToolUse` hooks |
| `deny` | the tool_use, `system/permission_denied`, an error tool_result, and a row in the closing result's `permission_denials[]` |
| `delay` | nothing — real wall time, and the virtual clock advances with it |
| `report` | sets the `--json-schema` answer (`done` / `needs_input` / `blocked` + cause) on the next result, and writes the closing `StructuredOutput` pair into the transcript. Without `--json-schema` the fake refuses at the door. |
| `result` | an extra `result` mid-act, with any field overridden |
| `die` | stop, then `exit n` or a real signal to self |
| `hang` | stop emitting and stay alive: no result, no EOF |

The act's closing `result` is implicit — always emitted unless the act died or
hung — and `act.result` merges fields into it. `noise: { thinkingTokens,
rateLimit }` turns on `system/thinking_tokens` and `rate_limit_event`; both are
off by default, because real claude's noise drowns a golden and the two
scenarios named for it carry the coverage.

`streamsReport: true` puts the report's closing pair on **stdout** as well as in
the transcript, which is where real claude puts it — the fake wrote one carrier
of the three (C13 F2). It is opt-in because turning it on rewrites a golden, and
the 23 recorded before it are not this flag's to re-record; `answer-then-land` is
the first scenario faithful here.

`golden` declares how [`goldens.ts`](goldens.ts) spawns the scenario to record
its stream: `mode` (`argv` = one process per turn, `stdin` = arm B), `paced`,
`flags`, `turns`, `seed`, `expectExit`.

## The library

24 scenarios in [`scenarios/`](scenarios/), each with a committed golden stream
in [`goldens/`](goldens/). `bun goldens.ts` checks them; `bun goldens.ts --gild`
rewrites them. Every scenario's `note` says what it proves.

`echo` · `one-tool` · `multi-tool` · `subagent-double-result` ·
`permission-denial` · `posture-mismatch` · `plan-noop` · `slow-turn` ·
`die-137` · `die-exit-1` · `orphan-finish` · `hang` · `schema-done` ·
`schema-needs-input` · `schema-blocked` · `resume-chain-4` · `armb-paced-4` ·
`armb-merge-trap` · `armb-merge-trap-queued` · `usage-cost` · `hook-events` ·
`rate-limit` · `thinking-noise` · `answer-then-land`

## The validator

[`validate.ts`](validate.ts) is the conformance oracle, and it faces both ways:
C4's 43 real captures pass it, and so must everything the fake emits. Two
functions, two types, deliberately small:

```ts
validateStream(text: string): Conformance
validateTranscript(text: string, expect?: TranscriptExpect): Conformance
type Conformance = { ok: boolean; violations: Violation[] }
type Violation = { rule: string; line: number; detail: string }
```

Rules: `json` · `type` · `subtype` · `fields` (the required-key sets are the
**intersection** of what the 43 captures actually carry) · `session` (one id per
stream) · `init-first` · `turns` (results never outnumber inits) · `denials`
(coherent in both directions) · `tool-result` · `whole-lines` · `path`.

## What it does not model

The engine (C6), flow topology (C7 — a scenario scripts one subject, never a
flow), census emission, TUI or summon physics (real-only), and
`--bare`/`--safe-mode` (the fake needs no isolation — it IS isolated, F12).

## The bars, measured

`bun test` · `../../glass/node_modules/.bin/tsc --noEmit` — evidence pasted in
the [C5 charge](../plans/c5-fake-claude.md).
