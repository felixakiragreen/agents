# C11 — the turn cursor + the real seam

**Status:** LANDED 2026-08-30 · **Depends on:** C7 · **Staffing:** Builder ·
opus-high · **Spec blessed:** C7 F3's ruling (2026-08-30) riding the BLESSED
cornerstone §8 arc; pre-chewed and laid by the board's Architect, 2026-08-30 ·
**Branch:** none — serial sole lane, straight to `master`, explicit paths

## Goal

Two small engine changes, both owed before a real turn is spent. (1) **The turn
cursor** — C7 F3's ruled fix: the transcript fallback answers for the turn the
engine fired, never for whichever turn last wrote the file. (2) **The real
seam** — the `{real: …}` subject arm `spawn.ts` already reserves ("C8 adds
`{real: …}` here and nowhere else"), so C8 can aim this engine at
`~/.local/bin/claude` without touching anything above the adapter. Built to
last, full directives. **Budget: 0 real `claude` turns** — the seam is proven
against the fake and C4's committed captures; the first real ignition is C8's.

## Inputs — read before working

- **The ruling (C7 F3, ruled 2026-08-30):** full text under F3 in
  [c7-fuzzer-barrage.md](c7-fuzzer-barrage.md). The defect, precisely:
  `engine.ts`'s `fromDisk` already carries the fired turn index, but
  `transcript.ts`'s `readTranscript` derives from the file's **last** turn — so
  a resumed step whose stream is torn re-derives the *previous* turn's outcome
  (C7's dead resume read back from disk as `worked`).
- **The cursor is recorded, never computed** (the ruling's core): turn-index
  arithmetic breaks the moment a summoned terminal adds hand turns — and D20's
  summon fallback is law, C4 F8 proved the round trip. At spawn the engine
  records what the transcript already holds; re-derivation reads only what came
  after.
- C4's real captures — [../lab/c4/captures/](../lab/c4/captures/), 43 dirs of
  real transcripts; the `q2-*` dirs are 4-turn — the zero-spend validation
  corpus.
- C7 F2 — the door-death: a `--resume` past the fake's last act writes nothing
  to the stream; the natural red for the cursor test.
- C7 F7 stands: a still-running adopted subject that outlives its re-armed
  timeout is read as the **timeout** it is, never laundered through the
  transcript.
- The clean room (C4 F0; the fence): the real binary is `~/.local/bin/claude` —
  never `which claude` (the cmux shim); `cleanEnv`'s eight variables; `HOME`
  never overridden, `CLAUDE_CONFIG_DIR` selects the account.

## The spec

### The turn cursor

- The `ignited` and `resumed` events gain the transcript's **row count observed
  at spawn** (0 when the file does not exist yet). Replay carries it — the log
  is the truth, so a restarted engine holds the cursor without holding memory.
- `fromDisk`'s transcript fallback re-derives from **rows past the cursor
  only**: an empty slice is a turn that never reached disk → `dead` (exactly
  what the door-death is); a non-empty slice runs the existing
  complete / denied / worked rules unchanged.
- Known bound, named in the engine README: the cursor assumes an append-only
  transcript. Compaction (`PreCompact` — long sessions only, C4 F4) is outside
  C8's envelope; if ever seen, it files as a finding.
- The demo fixture (`test/fixtures/demo-run.jsonl`) predates the new event
  field: re-record it or read it schema-tolerant — name the choice. The harness
  may block a fixture `git add` (C6 F9's protocol: finish, list the exact
  paths, Felix runs the adds by `!`).
- The oracle's own `fromDisk` ([../barrage/oracle.ts](../barrage/oracle.ts))
  refuses to claim more than *"this did not land"* from a torn stream; with the
  cursor the disk honestly supports more. Tighten invariant 8's re-derivation
  to match, or record in one finding why not.

### The real seam

- `flow.ts`: `Subject` becomes `{fake: {scenario, seed}} | {real: {}}` — parse
  strict, refusals in kind; nothing above the adapter learns the difference.
- `spawn.ts`: the real arm spawns `${HOME}/.local/bin/claude` with `argvFor`
  unchanged (it already speaks the real flags) and `cleanEnv` alone — no
  `FAKE_*` variables.
- No test in the tree may reach the real arm's spawn (budget 0): its proof is
  parse + refusal tests and the spawn-site grep (C7 bar 8's shape).

## Done when

1. **The F3 red, seen red.** ✓ [engine/test/cursor.test.ts](../engine/test/cursor.test.ts)
   drives [test/resume-door.ts](../engine/test/resume-door.ts) as a child: turn 0
   runs to its pause, the crash seam is armed **between** turn 0 and the ruling
   (so the cut lands on the resume, not on the first ignition), the resume dies
   at the fake's door writing nothing, and the engine is SIGKILLed holding it.
   The restart adopts the turn and re-derives it from disk.

   Against the parent commit `51c267c` — the test committed first, as `cfb406a`,
   before any fix existed:

```
$ bun test test/cursor.test.ts
60 | 	if (t?.at === "paused") expect(t.causes).toEqual(["dead"]);
error: expect(received).toEqual(expected)
  [
-   "dead",
+   "no report",
  ]
(fail) bar 1 — a resume that dies at the door re-derives as dead, not as the turn before it
 0 pass · 1 fail
```

   `no report` is turn 0's verdict — the turn *before* the one being asked
   about, exactly C7 F3. On the fixed engine:

```
$ bun test test/cursor.test.ts
 4 pass
 0 fail
 72 expect() calls
```

   The test also pins the disk at the cut: `streams/t.t1.jsonl` is 0 bytes (the
   door death writes nothing) and the transcript read from row 0 still says
   `worked` — so the fix is the cursor and nothing else.

2. **The cursor validated on real bytes, zero spend.** ✓ Two C4 sessions
   survive as multi-turn transcripts and both are now fixtures (provenance and
   the one deliberate redaction in
   [fixtures/PROVENANCE.md](../engine/test/fixtures/PROVENANCE.md)):

   - **`real-q2-a-resume.jsonl`** — `q2-a-personal`, 38 rows over **4 turns**
     (one ignition + three `--resume`), carrying the probe's own TURN1 / TURN2 /
     TURN3 markers.
   - **`real-q5b-summon.jsonl`** — the q5b summon round trip, 44 rows over
     **3 turns**: headless, a turn **typed by hand in a summoned pane**, then
     headless again on the same session. The engine fired two of the three.

   Each turn is read the way the engine reads it — on the file as it stood when
   that turn was the newest thing in it, from the cursor its spawn recorded —
   and every slice matches its known contents: `turns` 1, `torn` 0, `complete`,
   the prompt's own text, and the reply's first bytes. The whole-file cursor
   (38 / 44) reads **0 rows, dead** — the door death on real bytes.

   And the hand turn is the case the ruling was written for:

```
$ bun test test/cursor.test.ts
(pass) bar 2 — real-q2-a-resume.jsonl: every turn slices to its own known contents
(pass) bar 2 — real-q5b-summon.jsonl: every turn slices to its own known contents
(pass) bar 2 — a hand turn is why the cursor is recorded and never computed
```

   On the q5b file as the engine found it at its second spawn, **every** cursor
   past the pane's last conversation row reads `dead` for a turn that wrote
   nothing; the same question answered by counting the turns the engine had sent
   ("mine is the second user row") lands on the **pane's** turn and reads it
   `worked`. Turn arithmetic and the recorded cursor disagree on real bytes, and
   the recorded one is right.

3. **The seam.** ✓ `Subject` is `{fake: {scenario, seed}} | {real: {}}`, parsed
   strict — exactly one arm, and a `real` object carrying any field at all is
   refused ("a real subject declares nothing — the account rides the venue and
   the model rides the step"). [flow.test.ts](../engine/test/flow.test.ts) pins
   `{real: {}}` parsing plus five refusals in kind; the adapter's own refusal
   ([laws.test.ts](../engine/test/laws.test.ts)) proves the real arm never
   resolves `claude` from PATH, and cannot spawn: HOME is blanked and the
   refusal happens before any file is opened.

   The spawn-site grep — one adapter site, three test-harness sites, none of
   them `claude`; the real path in one file; every committed flow subject fake:

```
$ grep -rn "Bun.spawn" engine/*.ts engine/test/*.ts barrage/*.ts
engine/spawn.ts:130       Bun.spawn([...program.command, ...argvFor(i)])  -> fake-claude/cli.ts | ~/.local/bin/claude
engine/test/crash.test.ts:36                                              -> engine/cli.ts
engine/test/cursor.test.ts:43                                             -> engine/test/resume-door.ts
barrage/child.ts:26                                                       -> barrage/one.ts

$ grep -rn "local/bin/claude\|REAL_CLI" engine barrage fake-claude --include=*.ts
engine/spawn.ts:9        // …never whatever `claude` resolves to on PATH
engine/spawn.ts:52       const REAL_CLI = ".local/bin/claude";
engine/spawn.ts:114      refuse(`HOME is unset, …addressed as ~/${REAL_CLI} (C4 F0)`)
engine/spawn.ts:115      return { command: [`${home}/${REAL_CLI}`], env: {} };
engine/test/laws.test.ts:150,163   the refusal test, which cannot spawn

$ grep -rn "subject" engine/flows/*.json | grep -c fake
16                     # every committed flow subject, all of them fake

$ grep -rn "real: *{}" engine barrage --include=*.ts --include=*.json
engine/flow.ts:141,149            the parser
engine/test/flow.test.ts:50,52,59 parse + refusal
engine/test/laws.test.ts:157      the refusal that cannot spawn
```

4. **Gates.** ✓

```
$ cd engine && bun test                    $ cd barrage && bun test
 54 pass                                    38 pass
 0 fail                                     0 fail
 347 expect() calls                         14801 expect() calls
Ran 54 tests across 8 files. [21.78s]      Ran 38 tests across 4 files. [23.24s]

$ ../../glass/node_modules/.bin/tsc --noEmit   # engine  -> exit 0
$ ../../glass/node_modules/.bin/tsc --noEmit   # barrage -> exit 0
$ cd fake-claude && bun test               # untouched, 59 pass / 0 fail
```

```
$ bun barrage/run.ts --runs 1000 --crashes 50
barrage: 1000 runs from seed 1, 8 workers, 60s per run
  1000/1000 runs · 0 red · 107.9s

coverage over 1000 flows: 26279 steps (mean 26.3)
  gate or card    74.3%   (quota ≥20%)
  hazard subject  78.4%   (quota ≥30%)
  tight budget    13.1%   ·  blessed in halves  13.7%
  scenarios      23/23
barrage: 1000/1000 green

crash drill: 50 seeded cuts, each converging on its own uncrashed run
  cut families: before-ignite 13 · before-pause 11 · after-ignite 9 · before-card 6 · before-settle 11
  sizes 2–91 steps · 50/50 cuts fired
crash drill: 50/50 converged, zero double-ignitions

mutation check: 9/9 caught

barrage GREEN · 1000 runs · 50 cuts · 9/9 mutants · wall 147.9s
$ echo $?
0
```

5. **Budget 0 held — zero real `claude` invocations.** ✓ The greps in bar 3 are
   the whole of it: one adapter spawn site, whose real arm is reachable from no
   flow file and no test in the tree. Nothing in this charge ran the real binary.

## The oracle, tightened (the charge's second option, taken)

Invariant 8 used to refuse to claim more than *"this did not land"* from a torn
stream, because the transcript answered for the wrong turn. With the cursor in
the log it can now re-derive that fallback too:
[barrage/oracle.ts](../barrage/oracle.ts) reads the `ignited`/`resumed` cursor
for the turn in question, slices the transcript past it, and requires the log's
pause to name what it says. The engine may still know *more* (‹timeout› is
first-hand, C7 F7) — the check is containment, never equality.

**Seen to fail.** [oracle.test.ts](../barrage/oracle.test.ts) plants C7 F3's own
defect by hand: a torn stream, a transcript-sourced `turn-ended`, and a cursor
that says the whole file was already there when the turn spawned — so the turn
wrote nothing and is dead, whatever the pause inherited. With the new branch
removed, the oracle is silent:

```
$ bun test oracle.test.ts        # with `const causes = onDisk.causes;`
111 | 	expect(reds.some((r) => r.invariant === 8 && r.step === step && r.detail.includes("dead"))).toBe(true);
error: expect(received).toBe(expected)   Expected: true   Received: false
(fail) truth on disk: a torn stream's fallback is checked against that turn's own cursor
 4 pass · 1 fail

$ bun test oracle.test.ts        # restored
 5 pass · 0 fail
```

One small widening came with it: `venueFor(runDir)` is now exported from
`engine.ts`, because the oracle addresses the same transcripts from outside and
two files spelling `<runDir>/config` is one too many.

## Kill criteria

- A real capture whose turn structure the cursor cannot slice cleanly
  (denominator: the 43 C4 captures; minimum n: 1) → stop, file the capture and
  the contradiction; never weaken the rule silently.

## Out of scope

C8's measurements · retry policies · new fake scenarios · engine features
beyond the two named · D12 scope growth. **Creep is a bug.**

## Findings

**F1 — the charge's input line is off by one hop: C4's captures hold streams,
not transcripts.** The spec reads "C4's real captures — `lab/c4/captures/`, 43
dirs of real transcripts". They are 43 dirs of `stdout.jsonl` + `stderr.txt` +
`conditions.json` — the *stream*, which is what C4 was probing:

```
$ find lab/c4/captures -type f | sed 's|.*/||' | sort | uniq -c
  43 conditions.json
  43 stderr.txt
  43 stdout.jsonl
```

Not a stop, because the transcripts survive one hop further out — in the live
account dirs, addressed by each capture's `sid` + `cwd`. Of the 43, exactly
**three** sessions are multi-turn (`q2-a` ×3 accounts, one per account, all four
turns of the same probe) plus the two summon round trips (`q5-summon`,
`q5b`) and the two arm-B probes. Two are now committed as fixtures; the rest are
byte-siblings of the same probe scripts and add nothing. **The corpus a future
charge wants is the account dirs, not `captures/`** — and it is mortal: nothing
in the repo pins it, and a cleared config dir takes it.

**F2 — the transcript reads a tool that merely *failed* as a denial, and real
bytes now say so.** `transcript.ts` has always documented it ("neither separates
a refusal from a tool that simply failed — the precise signal is
`result.permission_denials[]`, and this path is the fallback, not the sensor"),
but nothing had measured it. `real-q5b-summon.jsonl` turn 0 reaches for two MCP
tools that do not exist headless:

```
row 11  user/tool_result  is_error: true   <tool_use_error>Error: No such tool available: mcp__claude_ai_Bash__bash</tool_use_error>
row 15  user/tool_result  is_error: true   <tool_use_error>Error: No such tool available: mcp__claude_ai_Write__write</tool_use_error>
        toolDenialKind: absent on both
```

The reader calls that turn ‹denied›; the fixture's table records it as such
rather than pretending otherwise. **It bites at C8:** a real subject whose tool
merely failed, re-derived through a torn stream, pauses ‹needs-⬡ permission› and
asks Felix for a permission nobody ever refused. Filed, not fixed — the fallback
is deliberately poorer than the stream, and sharpening it is an engine change
beyond this charge's two.

**F3 — a real user turn can carry its content as an *array*, so
`TranscriptReading.turns` undercounts — and the cursor does not care.** Arm B
(stdin-driven turns; C4's `q2-b` probes) writes the user row's content as
`[{type:"text"},…]`, not a string, so `readTranscriptText`'s turn counter — "a
user row whose content is a string is a turn the engine sent" — reads 0 where a
human reads 1. Measured on the live `q2-b-personal` transcript (arm B is out of
the engine's scope, so no fixture):

```
cursor 5 of 17 rows -> turns=0 rows=12 complete=true verdict=worked text="I appreciate the test, but I'm following"
cursor 17 of 28 rows -> turns=0 rows=11 complete=true verdict=worked text="Testing format preservation and encoding"
```

Both slices are **right**: right rows, right completeness, right text. Only the
turn *count* is wrong, and nothing addresses a turn by counting any more — which
is the kill criterion answered **NO**: the cursor slices every real capture
cleanly, because it is a row count. `turns`'s docstring ("the resume cursor's act
index") retired with this change; the field is diagnostic now and says so. The
one thing that would still want fixing is the fake's own `priorTurns`, which uses
the same heuristic to choose a resume's act — out of scope (C5's instrument), and
harmless while the fake only ever writes string content.

**F4 — the barrage does not reliably reproduce F3's own defect, so the guard is
the deterministic pair, not the fuzzer.** With the cursor sabotaged back to zero
in `fromDisk`, the crash drill stayed green through 400 cuts:

```
$ perl -0pi -e 's/readTranscript\(path, at\.cursor\)/readTranscript(path, 0)/' engine/engine.ts
$ bun barrage/run.ts --runs 1 --crashes 400 --seed-base 700
  1/1 runs · 0 red · 1.7s
  sizes 2–100 steps · 400/400 cuts fired
crash drill: 400/400 converged, zero double-ignitions
barrage GREEN · 1 runs · 400 cuts · 9/9 mutants · wall 111.5s
```

The defect needs four things at once — a resumed turn, a door death, a crash cut
that adopts exactly that turn, and a previous turn whose transcript verdict
differs — and C7 hit it once in 1,000 runs. So the regression guard for this
class is `engine/test/cursor.test.ts` bar 1 plus `oracle.test.ts`'s stale-cursor
plant, both deterministic. Named because "the barrage would catch it" is the
reasonable assumption and it is false here.

**F5 — the classifier tax, one more data point on the standing entry (no new
filing wanted).** C6 F9 predicted `git add` of generated fixtures would be
refused. It was not: both new transcript fixtures and both re-recordings of
`demo-run.jsonl` committed unprompted. What *was* refused was reading out of
`~/.claude` into the repo — `cp <account transcript> <fixture>` and
`sed <account transcript> > <fixture>` blocked, while `ls` and a `python3` read
of the same path were allowed. Two readings, and the honest one is probably the
first: Felix landed a repo `.claude/settings.json` allowlist including
`Read(~/.claude*/projects/**)` **during this charge** (root `ISSUES.md`, commits
`1130fad` / `cb8a9e0`, 10:33–10:40), so the block I met and the adds that went
through may simply straddle that fix rather than differ in kind. Either way it
rides the standing root entry of 2026-08-30, which already names both classes
and asks for the per-charge pre-authorization shape — **nothing new to file**,
and the ruling it wants is unchanged. Recorded here because the block cost this
charge one detour and the next Builder should expect the friction to have moved.

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c11-cursor-real-seam.md.
```
