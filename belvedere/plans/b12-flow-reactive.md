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

**F1 — the order's own classifier gates 120 of the city's 390 landed rows, including `b10` and
`b11` of this very flow. It ships as the misclassification log it asks for, and the classifier is
B11's pause.** §1 names three patterns — `/\bE\d+\s*[—-]/`, `/escalat/i`, `/BLOCKED/` — and says
false positives are "the cheap direction". Measured over the live register at this landing:
**390 `LANDED` rows · `escalationsIn` gates 0 · those three patterns gate 120**, of which
`/escalat/i` alone gates **113**. The rows it takes include `agents/belvedere B10` and `B11`, whose
annotations read *"nothing escalated"* — so on this row's own flow the order's list would have
staffed two fable-high sittings at two rows that said, in words, there was nothing to rule. That is
not a cheap direction. §1 was cut at the flow-cut sitting, **before B11 landed**; what B11 then
built for this exact question is `attention.ts`'s `escalationsIn` (B14 F2's detector, 0 false
positives over 458 rows), and the Architect's own relay says *"an unruled escalation on a `LANDED`
row already pauses … B12 turns that pause into a judge fire"*. So the classifier is
**`verdictOf`'s pause**, expressed as a `LandingCode` rather than a string match, and `SPEC_PATTERNS`
survives in [`judge.ts`](../glass/judge.ts) as the named interim constant §1 asks for — with the
measurement on it, pinned in `judge.test.ts` against six verbatim corpus annotations. **The real fix
is neither regex: it is a machine-readable `holds` on the landing grammar (keel §6, canon's).**

**F2 — a session that finishes ends on `SessionEnd`, never on `Stop`, so B11's census landing
sensor lands nothing and its malformed branch fires on every normally-closed sitting.** Over the
live census at this landing: **61 gone sessions, 61 last-event `SessionEnd`, 0 last-event `Stop`** —
`Stop` fires when the turn ends, the session then sits idle with a live pid, and closing its
workspace appends `SessionEnd`. So `Stop`-as-last-and-gone is the SIGKILL case (P1's own note), not
the ordinary one. B11 never felt it because every step in its smoke was a **board row** and the
board answered first. B12 does feel it, because an inserted judge has no row. Built accordingly:
**a judge is landed by the row it was staffed for, never by its own session** — the census is asked
only whether the sitting is *over* (`idle` or `gone`, P1's idle sensor), and that answer is used
solely to decide when to card Felix. A consequence worth having: the lane resumes the moment the row
is true, while the judge is still alive, rather than when its workspace happens to close. **What it
binds:** anything reading `verdictOf`'s census branch as a landing sensor is reading a branch that
almost never fires, and the keel §6 `holds` ask now has a second half — *how does a step with no
board row land?*

**F3 — a fixture city inside `~/code` is slugged RELATIVELY and one outside is slugged
absolutely, and a flow that names the wrong one loses its board with no error.** B10 F5's rule,
second face. Measured: `GLASS_CITY=/private/tmp/x` → the register calls the building
`/private/tmp/x/nb/gate`; `GLASS_CITY=~/code/b12slug` → it calls the same shape `b12slug/nb/gate`.
This row's probe must live under `~/code` (that is where the trust entry a fire needs lives, B7 F1),
so its flow files write the **slug**. With the absolute path instead, `buildings.find(b =>
b.building === flow.building)` is `undefined`, `world.rows` comes back **empty**, and every landing
is then judged by the census instead of the board — which under F2 means *malformed* — silently,
with no lint anywhere. Caught in a dry rehearsal before a single session was spawned; it would have
looked like the gate working for the wrong reason. **Binds every later flow fixture.**

**F4 — a step decided this pass kept its concurrency slot and its checkout until the next tick, and
at `concurrency: 1` that starved the judge the same pass had just staffed.** `inFlight` reads the
run *log*, which does not yet carry the line `plan()` is about to write, so a step paused at
12:00:00 was still "in flight" for five more seconds. Harmless in B11 (a landing was already
excluded by `landed`), fatal here: the gate's whole number is the gap between a landing edge and a
judge fire. Fixed at the cause with a `settled` set covering every verdict this pass that ends a
step's run — and **`timeout` is deliberately not in it**: that session is still alive and still
spending, and the engine kills nothing (B11 §6).

**F5 — the arm now records WHAT it armed, step by step, and "unknown" never auto-joins.**
`Flow.hash` says *the plan moved*; the delta reader needs *which parts*, and keeping a copy of the
flow file to diff against would put a second truth in the telemetry. So `Step.hash` is sha256 over
everything a fire would use (**`depth` excluded** — it is the graph's property, and adding a step
elsewhere must not read as editing one nobody touched), and an `armed` line carries
`<id>:<hash>` for every step plus one frame mark under `*`, an id `STEP_ID` can never produce. An
`armed` line written before this field existed reads back as **null**, and null is never treated as
"only additions" — it pauses for the click, which is B11's behaviour and the honest one.

**F6 — D12's "building + chapter" is prose; what scope-arm actually enforces is *what the click
already covered*.** A step declares a venue and an account, not a chapter, so "inside the scope"
was made checkable as: the flow's **frame** is unmoved (building, scope, concurrency, judge tier),
nothing existing was **edited or removed**, every addition's **venue and account** are ones the arm
already covers, and every addition passes `refuseStep` — *the same list the arm applies*, extracted
so there is one of it. Growth may fill in the plan; it may never reach somewhere new. The ruling is
a **module constant** (`ARM_SCOPE`), not a flow field, because a flow that could choose its own arm
scope would be a flow that authorized its own growth.

**F7 — the judge inherits the gated step's checkout, and that is single-writer physics rather than
convenience.** `plan()` reserves a checkout by its **cwd**, so `~/code/agents` and
`~/code/agents/belvedere` do not compare equal even though they are one git tree. Sending a judge to
the building's own path while its lane's steps run at the repo root would put two writers in one
checkout with the reservation blind to it. A judge therefore takes the gated step's venue where that
is `master` — which is also, for free, a venue the arm has already trusted — and falls back to the
building path only for a worktree-venue step, where a sitting that trues a board must not commit on
a branch nobody merges.

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
