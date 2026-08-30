# C13 — the report on disk

**Status:** LANDED 2026-08-30 — all 6 bars evidenced below; **K1 trued at C8's
own denominator** (50/50 landed turns ×3 accounts flip from `dead` to a landing)
and the kill criterion did not fire (55/55 linked). **Budget 0 held.** ·
**Depends on:** C8 · **Staffing:** Builder ·
opus-high · **Spec blessed:** C8 F3's ruling (2026-08-30) riding the BLESSED
cornerstone §8 arc; pre-chewed and laid by the board's Architect, 2026-08-30 ·
**Branch:** none — serial sole lane, straight to `master`, explicit paths

## Goal

C8 F3 (K1) trued, and turned into an upgrade. The transcript's completion rule
is falsified by the engine's own argv: `--json-schema` makes the step report a
`StructuredOutput` **tool call**, whose `tool_result` is the turn's last
conversation row — the rule's own signature for "died mid-work", so the reader
calls **every** turn this engine fires `dead` (48/48 landed turns, ×3 accounts).
But the report's bytes are *in* that tool call's input. So this charge does not
merely fix the rule: **the fallback gains the report, and a turn the engine died
in front of can land from disk** — cornerstone law 5's redundancy claim restored
stronger than C6 proved it. The fake becomes faithful in the same stroke, so the
barrage guards this class forever. Built to last, full directives. **Budget: 0
real `claude` turns** — every real byte this charge needs was bought by C8 and
is pinned by C12's archive.

## Inputs — read before working

- **The ruling (C8 F3, ruled 2026-08-30):** full text under F3 in
  [c8-real-session-physics.md](c8-real-session-physics.md). The falsified rule
  and its provenance note live at the head of
  [../engine/transcript.ts](../engine/transcript.ts).
- **The real shape** (C8's measurement): a landed engine turn ends
  `assistant text` → `assistant tool_use:StructuredOutput` (input = the step
  report) → `user tool_result` as the last conversation row. 51/51 real C8
  transcripts end on `user/tool_result`.
- **The corpus is already safe:** C8's transcripts are mirrored in C12's
  archive (`summon/log/archive/.claude*/...`) — **source fixtures from the
  archive, not from `~/.claude*`** (no classifier friction; C12 F1's flags if
  you grep it: `--hidden --no-ignore`). Fixture law: PROVENANCE.md entry +
  the email placehold redaction, byte-length preserved (C11's precedent).
- C11 F2 — the denial heuristic's false-ask hazard: **out of scope to fix**,
  but your changed verdict path must not widen it; a failed tool still pauses,
  never lands.
- C8 F7's caveat — F3 masked the cursor's real-bytes regression signal; this
  charge restores it.
- C7 kill criterion 2 does not bind here: the fake's *code* is in-scope by this
  lay — that criterion fenced C7, not the campaign.

## The spec

- **`transcript.ts` — the completion rule:** a turn is complete iff its last
  conversation row is (a) an `assistant` row with no `tool_use`, or (b) the
  `tool_result` answering a `StructuredOutput` `tool_use` (matched by
  `toolUseId`, never by position). Any other trailing tool call still reads as
  died-mid-work.
- **The report from disk:** when the trailing `StructuredOutput` is present,
  parse its input as the step report (same schema the stream sensor reads).
  `verdictFromTranscript` may then **land**: complete + report parses +
  `state: "done"` + no denial signal → land, carrying the report. Every weaker
  state pauses exactly as today — the fallback stays conservative everywhere
  the disk is not explicit. Update the module-head provenance note and
  `engine/README.md`'s law-5 language in the same commit.
- **The fake made faithful:** when `--json-schema` is declared (it always is,
  from the engine), the fake's transcript writer emits the
  `assistant tool_use:StructuredOutput` + `user tool_result` pair per the real
  fixture's shape for every scenario that reports. Validate the shape against
  the committed real fixture, not against memory. Re-record goldens only where
  transcript bytes ride in them; name each re-recording.
- **The cursor signal restored:** the C11/C8 masked case — with the rule fixed,
  a torn resumed turn and a landed prior turn once again *differ* on disk, so
  the cursor test's stale-cursor arm must fail red when the cursor is sabotaged
  to 0 (re-prove C11 bar 1's property on the new rule; the fixed engine's own
  test suite carries it).
- **C6's bar re-proven:** transcript-only ≡ streamed verdict on scenarios that
  report — `schema-done` must now **land from disk**, the state C6 could never
  reach transcript-only.

## Done when

1. **The K1 red, seen red — MET.** ✓ The test was committed red against the
   parent engine's reader (`2edb3f0`, before the fix in `23e2be6`): three
   failures, all one defect.

```
$ bun test test/transcript.test.ts            # at 2edb3f0, the parent reader
(fail) bar 1 — a real C8 turn the engine landed reads complete, and carries its report
   expect(reading.complete).toBe(true)   Expected: true   Received: false
(fail) bar 1's control — a real C8 turn that asked a question is complete and still does not land
(fail) the closing pair is matched by toolUseId, never by position
   [- true, - "worked"] / [+ false, + "dead"]
 4 pass · 3 fail
```

   The same two committed fixtures through both readers, side by side:

```
real-c8-q1-smoke.jsonl
  parent reader  rows=14 complete=false verdict=dead  -> pauses ‹dead›
  C13 reader     rows=14 complete=true verdict=worked report={"state":"done","cause":"n/a"}
                 verdict: LANDS carrying {"state":"done","cause":"n/a"}
real-c8-q5-question.jsonl
  parent reader  rows=18 complete=false verdict=dead  -> pauses ‹dead›
  C13 reader     rows=18 complete=true verdict=worked report={"state":"needs_input",…}
                 verdict: pauses ‹no report› — …its report says needs_input: Need: (1) filename/path, …
```

   And **C8's own q4e measurement re-run at its own denominator**, over C8's
   surviving run logs and C12's archive (zero spend), each turn read past the
   cursor its spawn recorded:

```
turns the engine LANDED from the stream: 53 · transcripts found in the archive: 50
  the PARENT reader calls them: {"dead":50}  (lands 0)
  the C13   reader calls them: {"worked":50}  (lands 50)
    personal       28 landed turns · 28 read complete · 28 re-derive to a landing
    thg-doorbell   11 landed turns · 11 read complete · 11 re-derive to a landing
    thg-fgreen     11 landed turns · 11 read complete · 11 re-derive to a landing
```

   *(50 of 53: three subjects' transcripts are not in the archive — C8 F8's
   same three, absent there for the same reason.)* **K1 is trued: every landed
   turn this engine ever fired now re-derives to its own landing from disk.**

2. **The fake's shape ≡ the real shape — MET.** ✓ Asserted in
   `engine/test/laws.test.ts` ("the fake closes a reporting turn on the real
   closing pair") against the committed real fixture, never against memory; the
   printed pair:

```
real (C8, thg-fgreen)  —  14 rows, 4 of them conversation
  assistant tool_use:StructuredOutput  id=toolu_01FctZsXkGzmRK8EaBsfYNGg
            input={"state":"done","cause":"n/a"}
  user      tool_result  tool_use_id=toolu_01FctZsXkGzmRK8EaBsfYNGg

fake (schema-done)  —  6 rows, 5 of them conversation
  assistant tool_use:StructuredOutput  id=toolu_gF3i2IU2pbPhbKwCEjyeePdi
            input={"state":"done","cause":"Wrote config.yaml with the requested port",…}
  user      tool_result  tool_use_id=toolu_gF3i2IU2pbPhbKwCEjyeePdi
```

   **Three goldens re-recorded** — `schema-done`, `schema-needs-input`,
   `schema-blocked`, the only scenarios that report. No golden carries
   transcript bytes; what moved is the `result` event's `uuid` and `duration_ms`,
   because the fake draws every id and every timestamp from one deterministic
   stream and the pair now draws two ids and two spans from it. Nothing else in
   any of the 23 differs.

3. **The cursor's regression signal back — MET.** ✓ Two arms. The engine's
   cursor **planted stale** (`const cursor = 0`) takes both cursor bars red on
   the outcome, and reverting restores green:

```
=== SABOTAGED: const cursor = 0 ===
 62 | if (t?.at === "paused") expect(t.causes).toEqual(["dead"]);
      -   "dead",   +   "no report",
(fail) bar 1 — a resume that dies at the door re-derives as dead, not as the turn before it
111 | expect(truth.steps.t?.at === "paused" ? truth.steps.t.causes : null).toEqual(["dead"]);
      -   "dead",   +   "no report",
(fail) bar 3 — a sabotaged cursor answers for the reporting turn before it
 4 pass · 2 fail          →  reverted: 6 pass · 0 fail
```

   And **the masking itself, measured** — the same staged transcript (a turn
   that reported, then a resume that died at the door) read from cursor 0:

```
  parent reader  complete=false verdict=dead  -> ‹dead›, the same answer the TRUE cursor gives: masked
  C13 reader     complete=true verdict=worked report={"state":"needs_input",…}
                 -> pauses ‹no report›, which differs from the true ‹dead›: the signal is back
```

   On real bytes the disagreement is now a **landing** (bar 1's table above:
   cursor 0 → lands, true cursor → ‹dead›). C8 F7's caveat is closed.

4. **`schema-done` lands transcript-only — MET.** ✓ `laws.test.ts` bar 8 gains
   the case: transcript verdict ≡ stream verdict on all four scenarios, and
   where both land they carry the identical report. `orphan-finish` (‹no
   report›), `permission-denial` (‹denied›) and `die-137` (‹dead›) are unmoved.
   Proven **end to end** as well, in `crash.test.ts`: the engine SIGKILLed
   mid-turn, **the subject's stream file then deleted outright**, and the
   restart lands `prep` from the transcript alone — `sensed.source ==
   "transcript"`, report `{done, "Wrote config.yaml with the requested port",
   …}`, invariants `[]`, terminal, and `verdicts ≡ the uncrashed baseline`.
   Destroying a whole stream file now costs nothing, which is what cornerstone
   law 5 claims and what C6 could not reach.

5. **Gates — MET.** ✓

```
$ bun test              engine       61 pass · 0 fail (401 expects)   [23.2s]
$ bun test              barrage      38 pass · 0 fail (14801 expects) [23.5s]
$ bun test              fake-claude  59 pass · 0 fail (296 expects)   [10.1s]

$ bunx --offline tsc --noEmit
engine       -> exit 0
barrage      -> exit 0
fake-claude  -> exit 0

$ bun barrage/run.ts --runs 1000 --crashes 50        -> exit 0
coverage over 1000 flows: 26279 steps (mean 26.3) · scenarios 23/23
barrage: 1000/1000 green
crash drill: 50/50 converged, zero double-ignitions
  cut families: before-ignite 13 · before-pause 11 · after-ignite 9 · before-card 6 · before-settle 11
mutation check: 9/9 caught   (every mutant on its own invariant class, every control green)
barrage GREEN · 1000 runs · 50 cuts · 9/9 mutants · wall 147.6s
```

6. **Budget 0 held — MET.** ✓ Zero real `claude` invocations. Every
   process-spawn site in engine + barrage + fake-claude, and none of them is the
   real binary:

```
$ grep -rn "Bun.spawn" engine/*.ts engine/test/*.ts barrage/*.ts fake-claude/*.ts
engine/spawn.ts          [...program.command, ...argvFor(i)]    -> fake-claude/cli.ts unless {real:…}
engine/test/cursor.test.ts  ×2  [process.execPath, DRIVER, …]   -> engine/test/resume-door.ts
engine/test/crash.test.ts       [process.execPath, CLI, …]      -> engine/cli.ts
barrage/child.ts                [process.execPath, ONE, …]      -> barrage/one.ts
fake-claude/{goldens,guard,speed,crash}  ×6                     -> fake-claude/cli.ts
```

   The real arm is reachable only through a `{real: …}` subject, and the one
   mention of `"real"` in the whole tree is `barrage/topology.ts:120`, a
   coverage *label*: `fakeScenario(s.subject) ?? "real"`. Nothing constructs one
   (C11's finding, still true). Every real byte this charge read came from
   C12's archive.

**Kill criterion — did not fire.** Every archived C8 transcript carrying a
`StructuredOutput` call closes on it, matched by `toolUseId`:

```
archived C8 transcripts sampled: 55        (denominator asked: ≥10)
  carrying a StructuredOutput call: 55
  closing on it, matched by toolUseId: 55
  unmatched (any one fires the kill): 0
```

## Kill criteria

- The real fixture's `StructuredOutput` linkage cannot be matched by
  `toolUseId` on ≥1 of the archived C8 transcripts sampled (denominator: ≥10
  sampled; minimum n: 1) → stop, file the transcript and the contradiction;
  never match by position silently.

## Out of scope

C11 F2's denial heuristic · C9's scale · retry policies · grammar.md edits
(the Architect amended it at the C8 review) · D12 scope growth · engine
features beyond the named rule + report path. **Creep is a bug.**

## Findings

### F1 — the barrage does not guard this class, and structurally cannot as built

The charge's premise is that making the fake faithful lets the barrage guard the
report-on-disk rule forever. It does not, and the reason is C6 F2's own fix.
Measured with `bun barrage/run.ts --runs 60 --crashes 12 --keep`, over every
`turn-ended` in every kept run log:

```
turn-ended sensed from stream 2287 · from transcript 1 · of those, landed 0
```

**One turn in ~2,300 reaches the transcript fallback at all, and none lands from
it.** The five cut families all kill the *engine*; the durable stream means the
subject then finishes writing both files, so a torn stream and a complete
transcript essentially never coexist. Reaching the new path needs a cut that
kills the **subject** in the window between its transcript's closing pair and
its `result` row — a sixth cut family, an engine/barrage change beyond this
fence. Until then what guards the class is the deterministic pair built here:
`crash.test.ts`'s stream-destroyed landing and `laws.test.ts` bar 8. This is
C11 F4's shape exactly, one charge later, and it is the second time the barrage
has been named as *not* covering a defect class the deterministic tests do.

### F2 — the report has two more carriers, and the fake writes neither

Real transcripts carry the report **three** times, not once:

- the `StructuredOutput` tool call's `input` — what this charge reads;
- an `attachment` row of `type: "structured_output"` with `{data, toolUseID}`,
  sitting *between* the call and its result (`real-c8-q1-smoke.jsonl` row 11);
- and, in the **stream**, the same `assistant tool_use:StructuredOutput` /
  `user tool_result` pair, before the `result` row — measured on C8's surviving
  stream files, e.g. `summon/log/v3/c8/q5-denial-bash-personal/streams/t.t0.jsonl`
  rows 9–10.

The fake now writes the transcript pair and nothing else: no `attachment` row
(it writes none at all, C5 F4) and no stream pair. Neither omission moves a bar
— `sense.ts` reads only `result` and `system/init` — but the fake's *stream* is
now unfaithful in exactly the place its transcript just stopped being, which is
the shape of the trap C8 F3 fell into. Grammar §11's amendment describes the
trap in transcript terms only. Named for whoever writes a stream-side rule.

### F3 — a `needs_input` report on disk still pauses ‹no report›

The spec's "every weaker state pauses exactly as today" is implemented
literally: only `done` gained a branch, so the *causes* are byte-for-byte what
they were and only the detail string changed. The consequence is that a turn
whose disk plainly says the subject asked a question shows ‹no report› on a
board row, where the same turn read from the stream shows ‹needs-⬡ question›
carrying the question. Nothing is lost — the detail now names the state and the
cause verbatim (bar 1's table) — but C6's *"transcript-only ≡ streamed verdict"*
now holds for `done` and for the non-reporting scenarios, and not for
`needs_input` / `blocked`. Naming those two causes from disk is a two-line
change in `verdictFromTranscript`; it widens the fallback's vocabulary, so it is
the Architect's call, not a Builder's.

> *Corrected 2026-08-30, C10 step 0 (the Architect's call, taken at the batch-8
> lay): **this paragraph's second sentence no longer describes the tree.**
> `verdictFromTranscript` now names ‹needs-⬡ question› and ‹blocked› from the
> disk's own report, mirroring `sense.ts` exactly, and ‹no report› means what it
> says — the turn closed carrying no parseable report at all. C6's
> **"transcript-only ≡ streamed verdict" therefore holds for every reporting
> state**, not for `done` and the non-reporting scenarios alone. Evidence: the
> red/green on `real-c8-q5-question.jsonl` under both readers, pasted in
> [C10](c10-console-demo.md) bar 1. The consequence noted above — a board row
> showing ‹no report› over a turn whose disk plainly carries the question — was
> the reason: the console demo is where the poorer name becomes a UX lie.*

### F4 — one archived C8 session holds three report calls, and position picks the wrong one

`summon/log/archive/.claude/-Users-felix-code-agents-summon-log-v3-c8-venue-personal/6a76ee7e-….jsonl`
is C8 F6's summon round trip: three turns in one file, three
`StructuredOutput` calls, closing pairs at rows 14/16, 28/29 and 47/49 — with a
hand-typed pane turn (`user text` at row 19) in between. A reader that takes
"the file's `StructuredOutput` call" links the first one; my own kill-criterion
script did exactly that on its first pass and reported a false unlink. The
committed rule matches **outward from the closing `tool_result`'s
`tool_use_id`**, so it cannot. The corpus makes the spec's "never by position"
a necessity rather than a preference.

### F5 — Bun's `Glob` hides the archive exactly the way rg does

`new Glob("**/*.jsonl").scan({ cwd: summon/log/archive })` returns **zero**
files; with `{ dot: true }` it returns all 1,600-odd. The account directories are
`.claude*`, so the same dotfile trap C12 F1 documented for rg
(`--hidden --no-ignore`) is waiting in a second tool, and it fails the same way
— plausibly, with a clean empty answer. Anything that walks the archive
inherits it; the flags differ per tool, so the rule is *the archive is a hidden
tree*, not *use these flags*.

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c13-report-on-disk.md.
```
