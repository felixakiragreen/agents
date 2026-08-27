# B12 — the reactive gate + dynamic extension

**Status:** OPEN · **Depends on:** B11 · **Staffing:** Builder · opus-high ·
**Blessed:** Architect, flow-cut sitting 2026-08-27 — **D12 (step-arm vs
scope-arm) is Felix's at the batch blessing** (README §6 batch-5 note); this
order builds both branches behind one flag and the ruling flips it.

> **Re-seated 2026-08-27 (deck keel, BLESSED):** the DAG surfaces below are
> the Works (B10 as re-seated); inserted judge nodes draw on its now-line's
> plan side; `/flow/flow-close` renders as a Works target. Substance
> unchanged.
>
> **D12 RULED 2026-08-27 — scope-arm** (Felix, "rec"; README §7): the module
> constant ships scope-arm; the DoD's live branch is §4's scope-arm path,
> step-arm under test only.

## Goal

The string judges itself and grows while it runs. An escalation-marked landing
**auto-fires the scoped Architect sitting into the lane** — the reactive gate
([flow-keel.md](flow-keel.md) §5.1; Felix's ask, B5 sitting; B6's apply button
is the prototype) — and the DAG draws the inserted judge node; Felix is carded
only when the judge's work leaves something that is genuinely his. The engine
re-reads the plan, and the DAG grows mid-flow per D12 (dynamic extension,
Felix's word at the B9 close). The campaign's own evidence is the commission:
seven escalations in batch 3, six Architect-delegated, every ruling
hand-relayed by Felix — while B8's fully-pre-chewed order escalated zero.

## Inputs — read before building

- [flow-keel.md](flow-keel.md) §§4–6 — the reactive gate, dynamic extension,
  the row-17 evidence pile (the interim classifier below feeds it).
- [B11's](b11-flow-engine.md) landed engine — §4's interim landing law and the
  pause states are the substrate; this row *consumes* pauses and *inserts*
  judges.
- `glass/inbox.ts` — B6's apply mechanism (compose the scoped sitting, fire
  through hands); `flow.judgeTier` (B10 schema).
- D10 — every new affordance inherits ambiguity-never-arms.
- The batch-4 note's blessing item 1 — **judge insertions fire under either
  D12 ruling**: the reactive gate is the armed contract's landing law
  executing, not plan growth; D12 governs only new *work* steps.

## Spec

1. **The landing classifier (interim, named interim).** A landed step is
   **clean** iff its board row parses state `LANDED` and the status
   annotation matches none of: `/\bE\d+\s*[—-]/` (escalation markers),
   `/escalat/i`, `/BLOCKED/`. Anything else that B11 paused — malformed row,
   `KILLED`, dead-no-`Stop`, escalation-marked LANDED — **classifies for the
   reactive gate** instead of waiting for a human. The pattern list is a
   constant with a comment naming it interim (the real fix is a
   machine-readable `holds` on the landing grammar — canon's, keel §6);
   false-positives fire a judge, which is the cheap direction, and the
   misclassification log is G2 evidence. Steps that are not board rows (gate
   sittings) classify on their session state alone.
2. **The reactive gate.** On a gate-classified landing: compose the scoped
   Architect sitting (B6's apply shape — the sweep template scoped to this
   building and the gated row), tier `flow.judgeTier`, fire it **into the
   lane** through the hands; append `{ev: "extended", step: <judge id>}`;
   the DAG draws the inserted node (B10's vocabulary — an architect-gate
   node). The lane stays paused while the judge runs. **The verdict is read
   from the files, not from the judge's mouth:** when the judge's sitting
   lands, re-classify the gated row — clean now → `resumed`, lane runs on;
   still unclean → render the **Felix-card** on the lane (the judge left
   something that is his), nothing fires. Zero new grammar, zero prose
   parsing of the judge's report.
3. **Judge loop limit.** One judge per gated landing; a judge whose own
   sitting classifies for a judge does not recurse — Felix-card (everything
   has a limit).
4. **Dynamic extension.** Each tick re-reads the flow file (B11 pauses new
   fires on hash mismatch). This row adds the delta reader: parse the
   changed file, diff by step id. **Under D12 = scope-arm:** a delta that
   only *adds* steps whose venue/building sit inside the flow's declared
   `scope` auto-joins — re-arm recorded (`armed` with the new hash, `why:
   "scope-arm auto-join"`), fires proceed; any edit to an existing step, any
   removal, any out-of-scope addition still pauses for the click. **Under
   D12 = step-arm:** every delta pauses for the click (B11's base — this row
   changes nothing). The flag is one constant read from the flow file
   schema? No — **the ruling is city law, not per-flow choice**: a single
   module constant, set by D12's ruling at blessing, named in code with the
   D-entry.
5. **The close flow, left on disk.** Declare `flows/flow-close.flow.json`:
   one architect step whose kickoff resolves to the README batch-4 note's G2
   fence, one Felix-card behind it (`chapter verdict`). Do not arm it —
   **Felix's arm is G2's Felix-gate**, the engine's first real act.

## Acceptance criteria — the DoD

All measured against a live glass, evidence pasted; probe sessions haiku-low
in `~/code/agents`, ≤2 concurrent, workspaces closed (D55); probe rows for the
induced escalation live in a scratch section of a lab fixture doc, never on
the real board.

- [ ] **The reactive gate fires:** an induced escalation-marked landing (a
  probe flow step whose row annotation writes `E1 —`) → the judge sitting
  auto-fires (audit line + census beat + first-turn ≡ composed sweep
  template, sha pasted), `extended` in run-state, the DAG draws the inserted
  node, the lane is paused meanwhile — **the gap from landing edge to judge
  fire pasted in seconds, zero human touches**.
- [ ] **Resume on truth:** the judge (a scripted haiku probe told to true the
  fixture row to clean LANDED) lands → lane `resumed`, next step fires
  (measured gap pasted).
- [ ] **Felix-card on residue:** a second induced run where the judge lands
  *without* truing → his card renders on the lane, zero fire wiring, nothing
  fires after (asserted).
- [ ] **No recursion:** a judge whose sitting is itself gate-classified →
  Felix-card, no second judge (asserted from run-state).
- [ ] **Dynamic extension per D12:** with the ruled flag — scope-arm: an
  in-scope added step auto-joins and fires with no click (measured); an
  edited step still pauses for re-arm. Step-arm: both pause. (Test the ruled
  branch live; the other branch under test only.)
- [ ] **The close flow exists:** `flows/flow-close.flow.json` parses, renders
  at `/flow/flow-close` with G2's kickoff resolved byte-identical to the
  README fence (sha pasted), unarmed, the Felix-card inert.
- [ ] `bun test belvedere/glass` green in one process; `bunx --offline tsc
  --noEmit` exit 0.

## Out of scope

- A `holds` grammar or any board-format change (canon's — the interim
  classifier's misses are G2 evidence, never local grammar).
- Judging content: the judge is a fired *sitting*; the engine never rules on
  work, only routes it.
- The Steward (unparked by Felix's word only, README §4); auto-arbitrage;
  killing sessions; editing truth.

## Findings

*(append here — deviations from spec, discoveries, parked adjacents)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/flow-keel.md,
and ~/code/agents/belvedere/plans/b12-flow-reactive.md,
and build it to its DoD.
```
