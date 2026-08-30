# C13 — the report on disk

**Status:** OPEN — laid 2026-08-30 · **Depends on:** C8 · **Staffing:** Builder ·
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

1. **The K1 red, seen red:** the committed real C8 fixture read by the parent
   engine's reader → `dead`; by this charge's reader → complete, report parsed,
   verdict lands. Both pasted.
2. **The fake's shape ≡ the real shape:** the fake-written transcript's closing
   rows match the real fixture's row types and `toolUseId` linkage; pasted.
3. **The cursor's regression signal back:** the sabotaged-cursor arm fails red,
   restored green; pasted (C8 F7's caveat closed).
4. **`schema-done` lands transcript-only**; every non-reporting scenario still
   pauses as today; pasted.
5. **Gates:** engine + barrage + fake-claude `bun test` green, all three
   `tsc --noEmit` exit 0, `bun barrage/run.ts --runs 1000 --crashes 50` exit 0
   — pasted.
6. **Budget 0 held** — the grep (C7 bar 8's shape).

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

*(append here)*

---

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c13-report-on-disk.md.
```
