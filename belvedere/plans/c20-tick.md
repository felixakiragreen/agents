# C20 — the tick

**Status:** OPEN · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Blessed:** pending (the rework blessing)

## Mission

Close C16 F2's window at the contract. Belvedere IS the engine for the turn it
resumes: delivered is the transcript, landed is the run log, and a Belvedere killed
between them leaves a step `running` until something opens that run. Today the
healer is a hand tool (`lab/c16/settle.ts`). The contract choice is ruled at G5,
**proposed (D23)**: **a `tick` verb on the console, never a supervising
process** — citation: the glass-shatters test (README §1, D3's standing bar — a
supervisor is one more component whose death strands the same steps one level
up; a verb heals from the log alone) and C6 F2's ruled redundancy (`adopt()`
already re-derives the turn from the stream file; the verb is that mechanism
given a name and a door).

## Inputs — read before working

- C16 F2 (the window, measured the hard way — the instrument's first pass tore
  Belvedere down 400 ms after the receipt) and `lab/c16/settle.ts` (the proof
  that one tick heals: `running -> landed done`).
- `v3/engine` — `adopt()` (C6 F2), the run-log law (the log is the register of record);
  `barrage/sweep.ts` (C14 F5 — pid-liveness guarded by `ps`, and the crash
  drill's orphans are sacred: never sweep or tick what a drill is about to
  adopt).
- C16's engine road in `glass/chat.ts` (`mode: 'engine'`) — the one Belvedere
  surface that drives the engine today; it already waits on the log.

## Spec

1. **The verb.** `console` gains `tick <run>`: `load()`, then for every step
   `running` whose subject is dead (pid-liveness per `sweep.ts`'s guard),
   adopt from the stream file and append what the dead process would have —
   the engine's own mechanism, no new landing logic. Idempotent: a healthy or
   settled run moves nothing and says so. Exit names what moved.
2. **Ownership stays written.** The road's contract line (any surface that
   drives the engine owns the turn it resumes) goes into `v3/README.md`'s
   contract section verbatim, with the tick named as the healer.
3. **The hand tool retires.** `lab/c16/settle.ts` dies; anything it proved
   moves to the console suite as a real test: the window reproduced on the
   fake (subject `result` on disk, log `running`, process gone), one tick,
   `landed done`.
4. **The drills stay sacred.** The tick never runs inside the barrage or the
   crash drill (C14 F5's exemption is the precedent and the header to copy);
   nothing in this charge touches `barrage/**` behavior.

## Done when:

- [ ] The window, reproduced and healed at budget 0: a fake run with its
  subject's result on disk and its log `running` (process dead) → `tick` →
  the log says `landed done`; the whole arc a committed console test.
- [ ] Idempotence, both controls: `tick` on a settled run and on a run with a
  live subject moves zero bytes (log byte-identical before/after, asserted).
- [ ] `lab/c16/settle.ts` gone; zero references (grep-proof).
- [ ] `v3/README.md` carries the ownership contract + the tick as healer.
- [ ] `bun v3/gates.ts` ALL GREEN; `--glass` ALL GREEN (Belvedere's road
  unchanged is part of the claim); budget **0 real turns**.

## Out of scope

- Any supervising/daemon process (refused by the ruling above); Belvedere-side
  auto-tick (Belvedere stays read-only off the log — C15's law; the engine
  road's own turn is the one exception, already landed); the venue
  canonicalization (C16 F1 — on the v3 deferred list with its trigger).

## Findings

*(append here — evidence-grade: every claim carries the command and output
that proved it)*

## Kill criteria

None — the mechanism exists (`adopt()`, `settle.ts` proved it). If adoption
turns out to need engine-side surgery beyond exposing the existing mechanism
through a verb, stop and escalate with the measured gap.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements; the migration
campaign note), ~/code/agents/belvedere/v3/README.md (the fence), and
~/code/agents/belvedere/plans/c16-chat-chapter.md (findings — F2 is the
charge's whole reason),
and execute the charge at ~/code/agents/belvedere/plans/c20-tick.md.
```
