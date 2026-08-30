# engine — the event-sourced flow runner

The v3 engine: it loads a declared flow, takes a blessing, ignites steps as
their edges land, senses outcomes from the subjects' own event streams, pauses
loudly, survives its own death, and proves all of it against the fake claude
before a real token is spent.

**The run log is the truth.** Render it for transparency, replay it for
redundancy, audit it for truth (cornerstone §3.4). Between turns the engine
holds nothing: `state()` is a fold of the log, every transition is appended
before it is acted on, and a restart at any instant re-derives and continues.

Built at [C6](../plans/c6-engine-core.md) against
[C4's grammar](../lab/c4/grammar.md) as amended and
[C5's fake claude](../fake-claude/README.md). **Library-first:** C7 imports
`engine.ts` and `invariants.ts`; the CLI is a hand-hold.

## The shapes

**The flow file** ([flows/demo.json](flows/demo.json)) — `{id, name, budget,
steps[]}`. Three kinds of step, and the kinds do not share a field list:

| kind | subject | ignites | lands |
|---|---|---|---|
| `task` | yes | when every edge landed | its report says `done` |
| `gate` | yes | when every edge landed | **never by itself** — it pauses ‹gate› carrying its report, and a ruling lands or kills it |
| `card` | **none** | **never** | only by a ruling — it pauses ‹card› on its own `ask` |

A subject is `{fake: {scenario, seed}}` today and `{real: {…}}` at C8; the spawn
adapter is the only code that cares.

**The run log** — append-only jsonl at `<runDir>/run.jsonl`, one event per
transition: `blessed` `re-blessed` `ignited` `resumed` `turn-ended` `landed`
`paused` `ruled` `killed` `halted` `ceiling`. The first event carries the flow
itself, so a log is judged from itself alone. Home:
`summon/log/v3/runs/` (gitignored telemetry); test fixtures commit deliberately.

**The step report** — `{state: "done"|"needs_input"|"blocked", cause, answer?}`,
declared as `--json-schema` on every fired step. Without it a session that asked
a question is byte-identical to one that finished (grammar §5). A turn with no
parseable report never lands.

## The laws the code wears

1. **The engine holds nothing.** State is (flow file + run log + transcripts).
2. **The blessing is the caller's act** (D11). `bless()` before anything
   ignites; a re-blessing covers unignited steps and may raise the ceiling,
   never lower it below what is spent.
3. **Parse rules 1–9** ([sense.ts](sense.ts)): read to EOF and the last `result`
   wins; `permission_denials[]` non-empty ⇒ **needs-⬡, never landed**; no
   `result` at EOF ⇒ dead; `init.permissionMode` read back and compared.
4. **Posture legality per (model, posture)** at bless ([posture.ts](posture.ts)):
   `auto` | `acceptEdits` | `bypassPermissions`, and (haiku, `auto`) refuses —
   loud, never a silent fallback.
5. **Lost-stream re-derivation** ([transcript.ts](transcript.ts)): watch the
   pid; when it is gone the transcript alone yields worked / denied / dead.
6. **Timeouts are per step** (`timeout_ms`, default 120 s): SIGTERM ⇒ dead ⇒
   paused ‹timeout›. **No auto-retry** — a dead step pauses for a ruling.
7. **Budget is a ceiling** (D73). Ignitions and resumes both cost a turn.
8. **`invariants(logPath)`** ([invariants.ts](invariants.ts)) — cornerstone §5's
   nine as one pure module over a log. C7's oracle imports it.
9. **`precheckVenue(account, venue)`** ([venue.ts](venue.ts)) is an interface
   (C4 F8): the layer-0 stub says yes, C8 implements real trust.

**A pause names every cause it sensed, not one.** A subject granted the wrong
posture *and* refused a tool is two findings, and reporting one hides the other;
`causes[]` is ordered by severity and the first is what a board row shows.

## The API

```ts
load(flowPath, { runDir })   →  Run | Refusal
run.bless(scope?)            →  true | Refusal        // { steps?, budget? }
run.tick() / run.run()       →  RunState              // run() drives to terminal
run.rule(stepId, ruling)     →  true | Refusal        // land | kill | resume
run.halt(reason) / run.state()
replay(logPath)              →  RunState              // ≡ state(), exactly
invariants(logPath)          →  Violation[]
```

```
bun cli.ts run <flow.json> [--bless] [--run <dir>]
bun cli.ts check <run.jsonl>
```

Without `--bless` a fresh run does nothing: the engine never blesses itself.

## The crash seam

`V3_ENGINE_CRASH_AT=<point>` makes the engine SIGKILL itself at a named instant
— `before-ignite:<step>`, `after-ignite:<step>`, `before-card:<step>`,
`before-settle:<step>`, `before-pause:<step>`. The drill in
[test/crash.test.ts](test/crash.test.ts) cuts at five of them and asserts the
restart converges with zero double-ignitions. C7 drives the same seam.

## What it does not do

Topology generation, fuzz loops, auto-filing (C7) · real subjects beyond the one
transcript fixture (C8) · census, deck, UI, summon (C10) · arm B (stdin turns) ·
D12 scope-growth auto-join · retry policies · anything from `glass/` — the trust
precheck is an interface, not an import.

## The bars, measured

`bun test` · `../../glass/node_modules/.bin/tsc --noEmit` — evidence pasted in
the [C6 charge](../plans/c6-engine-core.md).
