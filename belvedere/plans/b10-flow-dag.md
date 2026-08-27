# B10 — the flow file + the drawn DAG (the Works)

**Status:** OPEN · **Depends on:** P5; B14 · **Staffing:** Builder · opus-high ·
**Blessed:** Architect, flow-cut sitting 2026-08-27 — batch-4 blessing forks are
Felix's (README §6 batch-4 note); his rearranging design input, if handed at
blessing, lands here as a dated spec amendment before dispatch.

> **Re-seated 2026-08-27 — the deck keel (D13/D14, BLESSED) amends this
> order; where it and the original spec conflict, the keel wins:**
>
> 1. **Venue:** the DAG is **the Works** — a `FocusView` tenant in the deck
>    (B13's seam), not a standalone `/flow/<name>` page. The flow-file
>    schema, `glass/flow.ts` parse boundary, refusals, and run-state format
>    below stand unchanged; §5's page spec re-targets the Focus slot, City
>    View vocabulary via the deck's primitives.
> 2. **Time flows down — the now-line (D14):** the past above (landed rows +
>    ledger arc, dimmed), NOW as the line where live sessions blink (census),
>    the plan below (flow steps, OPEN rows, gates as Felix-cards); scroll up
>    = history, down = future; the resting view centers on NOW. The Works
>    draws **past AND future** — the declared-flow DAG below the line joins
>    the building's landed history above it, one renderer.
> 3. **Node actions (✓ Felix):** plan node → dispatch/customize/account/
>    usage (the arm rides B11, in the Works' Action pane); in-flight node →
>    hotswap to Chat (B16) / jump; landed node → the landing record + a
>    follow-up fire. Wire what exists at build time; slots for the rest say
>    so honestly.
> 4. **DoD deltas:** every "page renders" criterion below re-reads as "the
>    Works tenant renders in the deck"; the p95 bar applies to `/deck/state`
>    + the tenant's render; the fixture flow and kickoff-resolution sha
>    proofs stand as written. Depends-on gains **B14** (the deck City is the
>    vocabulary source); P5 stands (the permission clause fields).
> 5. **Kickoff:** read the deck keel too — the fence below is amended
>    accordingly.

## Goal

A **flow** — the batch note as data ([flow-keel.md](flow-keel.md) §3) — declared
in a file and rendered as its whole DAG on one glass page: nodes in the City
View's vocabulary, lanes side by side, gates inline as Felix-cards, the live
census lighting nodes, the bill visible. **Plan view and progress view are the
same drawing** (D11). Nothing arms and nothing fires in this row — B11's.

## Inputs — read before building

- [flow-keel.md](flow-keel.md) §§3–4 — the flow object and the D11 contract.
- [p5-permission-physics.md](p5-permission-physics.md) findings — **the
  permission clause** (Q5) becomes step fields verbatim; the trust precheck
  informs the venue field's validation story (checked at arm, B11 — but the
  schema carries what the check needs).
- README §§2–3, 5 — fence, organs, agreements. D10 (ambiguity never arms) —
  here it reads: **ambiguity never renders as fireable structure**; a flow
  that fails parse renders the failure, parser-as-lint (§1).
- `glass/html.ts`, `glass.css` — encapsulation/legend/colour primitives (B9);
  `doctrine/` — mantle/staffing vocabulary (D65: import, never fork).
- B9 F1 — the corpus lacks a name field; **the flow schema writes one from
  birth**.
- The §3 design laws (Felix, 2026-08-27) — native, not retrofitted.

## Spec

1. **The file.** `belvedere/flows/<name>.flow.json` — committed truth (a batch
   note as data). Interim serialization by D7's mandate: this schema is canon
   row 17's **evidence**, so it is honest, minimal, and disposable — parsed at
   the boundary by **`glass/flow.ts` alone** into typed `Flow`/`Step`; no
   other module touches the raw file, so a Standards Office ruling swaps
   serialization in one module.
2. **The shapes.** Flow: `name`, `building`, `scope` (building + chapter —
   D12's arm unit), `created`, `concurrency` (max engine-fired sessions,
   default 1), `judgeTier` (default `fable-high`), `steps[]`. Step: `id`,
   `name` (**the encapsulation — 1–6 words, refused longer**), `kickoff`
   (inline text, or `{doc, fence}` — path + 1-based fence ordinal, resolved
   at parse time to the fenced text; resolution failure = parse failure),
   `account`, `tier` (`mantle · tier`, doctrine vocabulary), `venue`
   (`{kind: "master", cwd}` | `{kind: "worktree", repo, branch}`), `depends[]`
   (step ids), `gate` (`none` | `{kind: "felix", card}` | `{kind:
   "architect"}` — an architect gate is itself a fireable step: its kickoff
   is the step's own), plus **the P5 permission clause fields verbatim**.
   Nothing speculative beyond this list — a field nobody consumes this batch
   is creep.
3. **Refusals (parse, not render):** unknown dep id · duplicate id · cycle ·
   unresolvable kickoff · name over six words · unknown account/tier/venue
   kind. Each a named error; a failed flow renders its failure on the page
   and files nothing (parser-as-lint; ISSUES is for field reports, not build
   fixtures).
4. **Run-state, defined here, written by B11.** One JSONL per flow at
   `summon/log/census/flows/<name>.run.jsonl` (the D6 telemetry neighborhood,
   already gitignored): `{ts, ev, step?, sid?, workspace?, why?}` with `ev` ∈
   `armed · fired · landed · paused · resumed · extended · refused`. B10
   **renders** run-state; it never writes it. The board stays the only truth
   about work — run-state is the engine's working memory, telemetry-class.
5. **The page.** `GET /flow/<name>` — server-rendered like every glass page
   (no client state): nodes as encapsulation-led cards (name, mantle colour,
   tier, venue), **status rings from run-state + census** (declared / fired —
   lit live off the census when the sid beats / landed / paused / refused),
   edges as inline-SVG lines between node boxes, **columns by dependency
   depth, parallel lanes side by side**, gates inline — a Felix-card renders
   in his card idiom with **zero fire wiring** (B3's structural bar: no
   button, no handler), an architect gate as a normal node. Legend (mantle
   colours + ring states), IosevkaFelix for numbers/titles, Inter prose, no
   dropdowns, no external requests. **The bill**: tier per step on each node,
   usage per account (B5's strip source) in the page footer — the arm view
   (B11) inherits this page as-is.
6. **The fixture is real.** Declare `flows/flow-batch-1.flow.json` — this
   batch's own DAG (p5 → b10 → b11 → b12 → g2, G2 gated `felix` behind an
   `architect` step whose kickoff resolves to the README batch-4 note's G2
   fence) — the render fixture and the chapter's first true flow file. A
   synthetic `.run.jsonl` fixture (test-local, never in the census home)
   exercises every ring state.

## Acceptance criteria — the DoD

- [ ] `flow.ts` parses the fixture; each §3 refusal fires on a mutated copy —
  named error asserted, one test per refusal.
- [ ] `/flow/flow-batch-1` renders: 5 nodes with encapsulation labels, mantle
  colours, tier text; edges present (SVG path count = dependency count);
  depth columns correct (assert via DOM order); the Felix-card carries zero
  fire wiring under B3's structural grep; legend present; `<select>` count 0;
  zero `http(s)://` in the served page.
- [ ] Census lighting: a test run-state marking one step `fired` with a live
  sid (the suite's own session or a census fixture) renders that node's ring
  *live*; a dead sid renders it *fired, not beating* — both asserted.
- [ ] Kickoff resolution: the g2 node's resolved kickoff is byte-identical to
  the README batch-4 note's G2 fence (sha256 both sides, pasted).
- [ ] The bill: every node shows its tier; the footer shows usage ×3 accounts
  (assert strings present).
- [ ] `GET /flow/<unknown>` and a deliberately broken flow file render honest
  failures (200-with-failure or 404 — pick one, assert it).
- [ ] `bun test belvedere/glass` green in one process; `bunx --offline tsc
  --noEmit` exit 0; `/flow/flow-batch-1` p95 < 500 ms under B3's 20-request
  protocol (evidence pasted).

## Out of scope

- Arming, firing, writing run-state (B11); judge insertion, plan growth
  (B12).
- The board Depends-on graph on building pages (parked, README §6).
- Any new dependency (layout by hand — depth columns + SVG lines; no graph
  library, D54).
- Editing truth: the glass never writes `flows/*.flow.json` — flow files are
  mantle work, committed by sittings.

## Findings

*(append here — deviations from spec, discoveries, parked adjacents)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/flow-keel.md,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b10-flow-dag.md (the re-seat block first),
and build it to its DoD.
```
