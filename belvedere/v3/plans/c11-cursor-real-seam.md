# C11 — the turn cursor + the real seam

**Status:** OPEN — laid 2026-08-30 · **Depends on:** C7 · **Staffing:** Builder ·
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

1. **The F3 red, seen red:** an engine test kills a resumed step at the door
   (C7 F2's shape) and asserts the fallback reads **dead**; the finding pastes
   the same test run against the parent commit reading `worked` — the fix has
   been seen to fail.
2. **The cursor validated on real bytes, zero spend:** the per-turn slices of
   C4's `q2-*` multi-turn transcripts match their known turn contents; pasted.
3. **The seam:** `{real: {}}` parses; a malformed subject refuses in kind; the
   spawn-site grep shows the real path only behind the real arm and no test
   reaches it.
4. **Gates:** engine + barrage `bun test` green, both `tsc --noEmit` exit 0,
   `bun barrage/run.ts --runs 1000 --crashes 50` exit 0 — all pasted.
5. **Budget 0 held** — the grep (C7 bar 8's shape).

## Kill criteria

- A real capture whose turn structure the cursor cannot slice cleanly
  (denominator: the 43 C4 captures; minimum n: 1) → stop, file the capture and
  the contradiction; never weaken the rule silently.

## Out of scope

C8's measurements · retry policies · new fake scenarios · engine features
beyond the two named · D12 scope growth. **Creep is a bug.**

## Findings

*(append here)*

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c11-cursor-real-seam.md.
```
