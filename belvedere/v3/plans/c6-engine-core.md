# C6 — the engine core

**Status:** **LANDED** 2026-08-30 · **Depends on:** C5 · **Staffing:** Builder · opus-high · **Spec blessed:** rides the BLESSED cornerstone §8 arc (⬡✓ 2026-08-29); pre-chewed and laid by the board's Architect, 2026-08-29 · **Branch:** none — serial sole lane, straight to `master`, explicit paths

## Goal

`belvedere/v3/engine/` — the event-sourced flow runner over headless subjects: load a declared flow, take a blessing, ignite steps as their edges land, sense outcomes from streams and transcripts, pause loudly, survive its own death, and prove all of it against the fake claude. **The run log is the truth: render = transparency, replay = redundancy** (cornerstone §3.4). Library-first, thin CLI; C7 imports it. Built to last, full directives.

## Inputs — read before working

- **Normative:** [../lab/c4/grammar.md](../lab/c4/grammar.md) **as amended 2026-08-29** — rule 9 is corrected (merged turns detect by arithmetic, never `queued_turn_count`) and `SessionStart` hook pairs leak unflagged at every process start. The ten parse rules are the engine's parser spec.
- **The instrument:** [../fake-claude/README.md](../fake-claude/README.md) — the dialect (three inert flags added at the C5 review), the scenario library, the `validate.ts` API (import it in parser tests). C5 F5: the engine **always passes `--session-id`** (parse rule 5 — the id exists before the process). C5 F6: bun narrows IIFE captures — name the async pump.
- C4 findings: F5 (the step report closes the question gap), F6 (silent success; posture read-back), F7 (transcript is truth; orphan finishes), F8 (venue-trust precheck at ignite — an interface here, real in C8).
- [../cornerstone.md](../cornerstone.md) §§3–5 — the bet, the contract, **the nine invariants**; [../README.md](../README.md) — the fence.
- Inherited law: D10 (ambiguity never authorizes), D11 (the blessing of the drawn plan is the authorization), D73 (budget ceiling; the edge test). **D12 scope-growth is deferred** — v1's scope is the declared steps; growth is amendment + re-blessing of unignited steps. Conservative satisfies invariant 4.

## The spec

### The shapes

- **The flow file** — JSON, the engine's own (D7): `{id, name, budget, steps[]}`; a step: `{id, kind: "task"|"gate"|"card", subject, model, effort, posture, depends[], timeout_ms?}`. A subject is `{fake: {scenario, seed}}` now, `{real: {kickoff, account, venue}}` at C8 — the spawn adapter is the only code that cares (D4's echo). A **gate** is a step whose report rules the verdict; a **card** is Felix's — it has no subject and **never ignites**: it pauses until `rule()` supplies the answer.
- **The run log** — append-only jsonl, one event per transition (blessed, ignited, turn-ended, denied, paused ‹cause›, ruled, landed, killed, halted, ceiling, amended, re-blessed…), each carrying enough to replay. Home: `summon/log/v3/runs/` (gitignored telemetry); test fixtures commit deliberately. **`replay(log)` ≡ state, exactly** — determinism lives in replay, never in scheduling (parallel completion order is real and the log records it).
- **The step report** — pinned schema, passed as `--json-schema` on every task step: `{state: "done"|"needs_input"|"blocked", cause: string, answer?}` (C4 F5's measured shape; C5's report step speaks it). A task result with no parseable report ⇒ paused ‹no report›.

### The laws the code must wear

1. **The engine holds nothing.** Between turns, state is (flow file + run log + transcripts). Crash at any instant; restart re-derives and continues.
2. **The blessing is the caller's act.** `bless(scope)` before anything ignites (D11); the engine never blesses itself — the harness scripts it (C7), the deck renders it (post-verdict). Amendment re-covers unignited steps only.
3. **Parse rules 1–9 as amended.** Last `result` wins; `permission_denials[]` non-empty ⇒ paused ‹needs-⬡ permission›, never landed (F6 — the silent-success trap); no `result` at EOF ⇒ dead; `init.permissionMode` read back, mismatch ⇒ paused ‹posture›.
4. **Posture legality per (model, posture) at bless** (grammar §4's matrix): task steps take `auto` | `acceptEdits` | `bypassPermissions`; (haiku, auto) refuses at bless — loud, never a silent fallback.
5. **Lost-stream re-derivation.** A fired step whose stream is gone: watch pid; on exit, the transcript alone yields the outcome (worked / denied / dead) — F7's corollary. The fake's transcripts carry the deny shape (`is_error` tool_result); use them.
6. **Timeouts are per step** (`timeout_ms`, default 120 s): SIGTERM ⇒ dead ⇒ paused ‹timeout›. **No auto-retry in v1** — a dead step pauses for a ruling (`rule()` may re-ignite the turn via `--resume`, F7's resumability).
7. **Budget is a ceiling** (D73): at `budget` ignitions the engine pauses; one re-blessing extends. Never past it.
8. **`invariants(log): Violation[]`** — the cornerstone §5 nine as one pure module over the run log (+ transcripts where a check needs them). C7's oracle imports it; it is not the fuzzer.
9. **`precheckVenue(account, venue)`** is an interface (F8): layer-0 stub says yes; C8 implements real trust. The slot exists NOW so ignite's pipeline has its place.

### The API

`load(flowPath)` · `bless(run, scope)` · `run()/tick()` · `rule(stepId, verdict|answer)` · `halt()` · `state()` · `replay(logPath)` · `invariants(logPath)`. Thin CLI: `bun engine/cli.ts run <flow> [--bless]` for hand runs; the library is the product.

## Done when

**LANDED 2026-08-30.** All ten bars met; evidence pasted. Zero real `claude` invocations — the budget of 0 held (C4's transcripts survive, so the bar-10 contingency never fired).

```
$ cd belvedere/v3/engine && bun test
bun test v1.3.10 (30e609e0)
 45 pass
 0 fail
 240 expect() calls
Ran 45 tests across 7 files. [15.12s]

  test/crash.test.ts       6    test/laws.test.ts        8
  test/demo.test.ts        5    test/sense.test.ts       8
  test/flow.test.ts        6    test/transcript.test.ts  4
  test/invariants.test.ts  8

$ ../../glass/node_modules/.bin/tsc --noEmit ; echo "exit=$?"
exit=0
```

1. ✓ **`bun test` green, type gate exit 0** — pasted above.

2. ✓ **The demo flow, end to end.** [flows/demo.json](../engine/flows/demo.json): **10 steps** — a serial head (`prep`), a parallel fan of five (`fan-a/b/c`, `orphan`, `deny`, `crash`), **1 gate**, **1 ⬡-card**, **1 denial step**, **1 dying step**, and a tail behind the card. The hand run:

   ```
   $ bun cli.ts run flows/demo.json --bless --run /private/tmp/…/handrun
   prep     landed
   fan-a    landed
   fan-b    landed
   fan-c    landed
   orphan   paused  ‹no report› the result carries no parseable step report
   deny     paused  ‹needs-⬡ permission, posture, no report› permission denied: Write;
                    asked auto, init granted default; the result carries no parseable step report
   crash    paused  ‹dead› no result at EOF (exit 137, signal SIGKILL)
   gate     paused  ‹gate› report: Wrote config.yaml with the requested port
   card     pending
   finish   pending
   turns 8/9
   ```

   Ruled through to its terminal state (gate → card → finish, then the three unlandable steps killed): **7 landed, 3 killed, nothing pending, nothing in flight, 9/9 turns.** The run log is the committed fixture [test/fixtures/demo-run.jsonl](../engine/test/fixtures/demo-run.jsonl) (39 events, recorded by `bun test/record.ts`), and `expect(replay(run.log.path)).toEqual(run.state())` is asserted in `test/demo.test.ts` — **`replay(log)` ≡ the final state, exactly.**

3. ✓ **Invariants green on the demo log, red on seven corrupted logs.** Each is cut from the real fixture with the seq numbers renumbered, so the planted defect is the only defect (`test/invariants.test.ts`):

   | plant | invariant caught |
   |---|---|
   | a duplicated `ignited` for `fan-a` | 1 exactly-once |
   | `fan-a`'s `ignited` moved before `prep`'s `landed` | 2 order |
   | the gate's `ruled` + `landed` deleted | **3 gates hold** — `finish` "ignited past gate, which was paused" |
   | `finish` dropped from the blessed scope | 4 scope |
   | a pause stripped of its causes and detail | 5 loud pauses |
   | the log truncated with `prep` in flight | 6 clean terminals |
   | the ceiling rewritten to 3 | 9 budget |

4. ✓ **Crash-redo at five named cut points** (`test/crash.test.ts`, against [flows/drill.json](../engine/flows/drill.json)). The engine runs as a child and takes a real `SIGKILL` — no unwinding, no flush; what is on disk at the cut is all the restart gets:

   ```
   before the first ignition record   before-ignite:prep
   mid-turn, the subject running      after-ignite:orphan
   mid-parallel, one edge in flight   before-ignite:fan-b
   at the gate pause                  before-pause:gate
   at the card pause                  before-card:card
   ```

   Each asserts: the cut process died by `SIGKILL`, the restart exits 0, `invariants(log) === []`, **the `ignited` events are one per step (zero double-ignitions)**, exactly one `blessed` event, and the restarted run reaches terminal. **The orphan-finish drill proves adopt-or-re-derive:** the subject is reparented and finishes while the engine is dead; the restart watches the pid, then reads the transcript — `sensed.source === "transcript"`, `{verdict: "worked", complete: true, denied: false, torn: 0}` — and pauses ‹no report›, the *same* terminal state the uncrashed run reaches from the stream.

5. ✓ **Silent success caught.** The `permission-denial` scenario's step ends `paused`, never landed, primary cause **‹needs-⬡ permission›**, detail `permission denied: Write` — while the subject exited 0 with `subtype: "success"` and `is_error: false` (`test/laws.test.ts`, `test/sense.test.ts` parse rule 2).

6. ✓ **Posture law proven, at both gates.** `(haiku, auto)` is refused at bless — `"(haiku, auto) is refused: haiku is granted \`default\` for \`auto\` and does no work (grammar §4)"` — and **the log is still empty**: nothing ignited. The `posture-mismatch` scenario is refused at read-back: asked `acceptEdits`, `init` granted `default`, cause ‹posture› (see **F1** — a pause names every cause it sensed).

7. ✓ **Budget.** A 2-step flow at `budget: 1` ignites one step, appends `ceiling`, and leaves the second pending; one re-blessing at `budget: 2` extends and both land at 2 turns. A re-blessing *below* what is spent is refused: `"budget 1 is below the 2 turns already spent — a ceiling never moves down"`.

8. ✓ **Lost-stream re-derivation.** For all three named scenarios the transcript-only verdict equals the streamed verdict, with zero torn rows:

   | scenario | stream | transcript |
   |---|---|---|
   | `orphan-finish` | worked | worked |
   | `permission-denial` | denied | denied |
   | `die-137` | dead | dead |

   And `verdict(reading).land === false` in every case — neither path lands a turn the engine could not fully read.

9. ✓ **Timeout.** The `hang` scenario at `timeout_ms: 700` is SIGTERMed and pauses with `causes: ["timeout", "dead"]`.

10. ✓ **The real-transcript fixture.** C4's own `q1-write-personal` probe transcript, copied from the personal config dir into [test/fixtures/real-q1-write.jsonl](../engine/test/fixtures/real-q1-write.jsonl) (provenance and the one redaction recorded in `fixtures/PROVENANCE.md`). The reader parses it whole — **20 rows, 0 torn, 1 turn, complete, denied** — across `attachment` (nine of them, environment/model/skills/agents), `atis-latch`, `queue-operation` and `last-prompt` rows, and C5's `validateTranscript` agrees the file is conformant. **Budget: 0 real turns** — C4's transcripts are all still on disk, so the ≤3-turn contingency never fired.

## Out of scope

Topology generation, fuzz loops, auto-filing (C7) · real subjects beyond the one fixture (C8) · census, deck, UI, summon (C10) · arm B (stdin mode) · D12 scope-growth auto-join · v2 flow-file compat · retry policies · importing anything from `glass/` (independence — the trust precheck is an interface). **Creep is a bug.**

## Findings

**F1 — bars 5 and 6 cannot both be met by a single-cause pause, so a pause names every cause it sensed.** `permission-denial` and `posture-mismatch` are structurally identical scenarios: both script `{"do":"init","permissionMode": "default"}` and both deny one `Write`. The engine's only free variable is what it *asks* — and under law 4 it can never ask `default`. So the posture read-back fires on **both**, and any single-cause ordering satisfies bar 5 or bar 6 and breaks the other:

```
$ jq -c '.acts[0].steps[0]' fake-claude/scenarios/permission-denial.json
{"do":"init","permissionMode":"default"}
$ jq -c '.acts[0].steps[0]' fake-claude/scenarios/posture-mismatch.json
{"do":"init","permissionMode":"default"}
```

Resolved inside the fence, and it is the better shape anyway: `paused` carries `causes: Cause[]`, ordered by severity, and both facts are recorded. A subject granted the wrong posture **and** refused a tool is two findings, and reporting one hides the other. Bar 5 gets its exact wording (primary ‹needs-⬡ permission›) and bar 6 gets ‹posture› with the read-back detail — `asked acceptEdits, init granted default`. **Invariant 5 is stricter for it:** a pause with an empty `causes[]` is a violation, tested as a negative control.

**F2 — the step report rides the stream and is never written to disk, so an engine death mid-turn always costs the landing.** The charge assumed the transcript could yield the outcome; it yields *worked / denied / dead*, not the report. Measured on C4's own capture — `structured_output` is a `result` field, and the last assistant row is prose, not the report JSON:

```
$ jq -r 'select(.type=="result")|.result' captures/q3-schema-done/stdout.jsonl
{"state":"done","cause":"Completed greeting and state report as requested",…}
$ jq -r 'select(.type=="assistant")|.message.content[]|select(.type=="text")|.text' … | tail -1
What are we building?
```

Consequence, now engine behaviour: a step whose engine died mid-turn re-derives as **paused ‹no report›** even when the transcript shows the turn worked — the conservative outcome invariant 4 wants, and the drill asserts it converges there. **The fix is one line and one law:** spawn the subject's stdout to a file instead of a pipe, and the stream survives the parent. That adds a fourth item to law 1's state tuple *(flow file + run log + transcripts)*, which is the Architect's to rule, not mine. **Filed, not built.**

> **Ruled 2026-08-30 · Architect · fable-high — adopted: the stream becomes state.** Law 1's tuple gains its fourth item: **(flow file + run log + stream files + transcripts)**. The spawn writes each turn's stdout to a stream file under the run dir; sensing reads the file; a restart re-derives a fired step stream-file-first — complete iff it carries a `result` row (parse rule 1) — and only a torn stream falls to the transcript's worked/denied/dead. Citations: cornerstone **§4.4** (read: the "live event stream, *file-addressable*" is already the substrate contract), **§4.9** (survive: a finished turn "rests on disk", a restart "re-derives all state from disk" — a landing lost to a mid-turn engine death fails both), **§3.2** ("the engine holds nothing a crash can lose" — a piped stream is exactly that). No new issue, so no D-entry (the ancestry test); presented for blessing at the boundary. **Built as [C7](c7-fuzzer-barrage.md) step 0** — one ignition, not two (D44).

**F3 — the transcript's completion signal, measured.** A turn is complete iff its last conversation row is an `assistant` row carrying no `tool_use` block: the assistant always gets the last word, so a trailing tool result means work was in flight when the writing stopped. Verified against three real C4 captures:

```
q6-SIGKILL  cut turn ends  user/tool_result   (02:30:31, before the resume rows) -> dead
q6-PARENT   orphan   ends  assistant/text                                        -> worked
q1-write    denial   ends  assistant/text  + tool_result is_error                -> denied
```

**`last-prompt` is NOT a completion marker** — the fake writes it on `die` as well as on close, and grammar §2 already calls it a display field.

**F4 — the transcript cannot separate a refusal from a tool that simply failed.** Both are a `tool_result` with `is_error: true`; a real transcript adds `toolDenialKind: "user-rejected"` (C4's q1-write row) and the fake's does not. The precise signal is `result.permission_denials[]`, and the transcript path is the documented fallback, not the sensor. Named in `transcript.ts` at the check.

**F5 — the `ended` state: the window between reading a turn and ruling it.** A crash between the `turn-ended` append and the `landed`/`paused` append left the step looking *running*, so the restart re-read it from the transcript and got a **worse** reading of a turn it had already read well. Fixed by making the reading ride the `turn-ended` event and giving `replay` an `ended` state the restart resolves from the log alone. This is the shape law 1 wants everywhere: the log carries enough that nothing is ever re-observed.

**F6 — a gate pauses; the charge's two sentences reconciled.** The spec says "a gate is a step whose report rules the verdict", while invariant 3 says "nothing downstream of an **unruled** gate ignites" and bar 4 names a cut point "at the gate pause". Both hold only if a gate never lands itself: it ignites, takes its turn, and **pauses ‹gate› carrying its report** — the evidence the ruling is made on. At layer 0 that makes a gate a task plus a mandatory ruling. `invariants` enforces it: a gate or card that lands unruled is invariant 3.

**F7 — the fake's `schema-*` transcripts never look complete, so only `orphan-finish` proves the adopt path's "worked" branch.** A `report` step emits nothing to disk, so `schema-done`'s transcript ends at a `tool_result` and re-derives as `dead`. That is why the drill's mid-turn cut sits on `orphan-finish` (which closes with a `text` step). **C7 should treat transcript completeness as a declared scenario property, not an assumption** — a fuzzer that plants crash cuts on schema scenarios will read every one of them as dead.

**F8 — three deviations from the charge's illustrative event list, each deliberate.**
- **`denied` is not an event.** Denials ride `turn-ended`'s reading and the `paused` detail; a third record duplicates both and no transition corresponds to it. (`turn-ended` · `landed` · `paused` · `ruled` · `killed` · `halted` · `ceiling` · `blessed` · `re-blessed` · `ignited` · `resumed` are the eleven.)
- **`resumed` is distinct from `ignited`.** Law 6's `rule()`-driven `--resume` would otherwise make invariant 1 (exactly-once) uncheckable. `ignited` is once per step per blessing; `resumed` is every subsequent turn on the same session.
- **The budget counts ignitions *and* resumes.** D73's ceiling is on spend, and a resumed turn costs exactly what an ignition costs. `bless({budget})` never moves the ceiling below what is already spent.
- **`amended` was not implemented.** D12 scope-growth is deferred by the charge, so the flow's steps are fixed and the only amendment is a re-blessing.

**F9 — the harness blocked three charge-sanctioned actions; two needed Felix's hand.** The auto-mode classifier refused (a) any read of C4's transcript out of `~/.claude` — bar 10's copy, named in the charge — and (b) `git add` of both fixture files (`demo-run.jsonl`, a machine-generated log of uuids and base62 ids; `PROVENANCE.md`, which names a `~/.claude` path). Felix ran the copy by hand. **This will recur:** C7 commits barrage fixtures, C8 reads real config dirs by design. Worth an `ISSUES.md` field report — not filed here, because the v3 fence forbids writing root protocol files.

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c6-engine-core.md.
```
