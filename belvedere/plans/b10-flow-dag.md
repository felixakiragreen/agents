# B10 — the flow file + the drawn DAG (the Works)

**Status:** LANDED 2026-08-27 · **Depends on:** P5; B14 · **Staffing:** Builder · opus-high ·
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

*(Every "page renders" criterion re-reads as "the Works tenant renders in the
deck", per the re-seat block. The browser half is
[`lab/b10/probe.ts`](../lab/b10/probe.ts) — real headless Chrome over CDP
against a temp census, a temp run log and a copy of `lab/b10/city`, **15 checks,
ALL GREEN** — and [`lab/b10/live.ts`](../lab/b10/live.ts) draws the city's own
flow over the city's own board. Pure functions are `glass/flow.test.ts`.)*

- [x] **`flow.ts` parses the fixture; each §3 refusal fires on a mutated copy.**
  `flow-batch-1` parses to 5 steps `p5 → b10 → b11 → b12 → g2`, depths `0,1,2,3,4`,
  staffing `Digger · opus-high / Builder · opus-high ×3 / Architect · fable-high`,
  `g2` gated `felix`. Every refusal is a **named code** asserted on a mutated copy of
  the real file — `duplicate-id · unknown-dep · cycle · kickoff (missing doc AND
  ordinal past the end) · name-too-long · unknown-account · unknown-tier (bad mantle,
  bad tier, bad judgeTier) · unknown-venue (bad kind, missing branch) · malformed ·
  field · unreadable` — plus the positive control that a worktree venue is legal.
  **30 tests in `glass/flow.test.ts`, 113 assertions, green.**
- [x] **The Works renders** (probe §§1–3, 6, 9, 13): **4 nodes** in the fixture flow
  (5 in the live one), each led by the name the flow file **wrote**, with its mantle
  chip in felikai's own hexes (`Digger rgb(158,73,12)` · `Builder rgb(3,98,178)` ·
  `Architect rgb(63,150,8)` — three distinct), its tier, its account and its venue;
  **4 `<svg> <path>` elements for 4 dependencies**, every one carrying a `d` measured
  against a real box (`a1→b1  M 210.0 49.6 C 210.0 72.4 192.8 72.4 192.8 95.1`, …);
  **depth runs DOWNWARD** (the keel's amendment to the order's columns) —
  `ranks [0 → 1 → 2]`, nodes `[a1:0, b1:1, b2:1, c1:2]` in DOM order, and the two
  depth-1 lanes measured **side by side**: `b1 left 410.5, b2 left 804, both top
  397.86`. The Felix-card renders his text and carries **0 buttons, 0 links, 0 fire
  attributes, `hands/fire` 0×**; legend present with 10 keys; **`<select>` count 0**;
  `http(s)://` **0** in `/deck`, `/deck.css` and `/deck/state` — and 0 fetchable in
  `/deck.js`, whose only two matches are the SVG **namespace name**
  `http://www.w3.org/2000/svg`, which no browser fetches (F3).
- [x] **Census lighting** (probe §5): a run log firing `b1` into `wk-live` (beating,
  our own pid) and `b2` into `wk-dead` (a `SessionEnd` beat) renders
  `b1: ring=fired from=run lit=yes` and `b2: ring=fired from=run lit=no` — fired, and
  not beating. `c1` paused by the log reads `paused from=run`. And `a1`, which the log
  never names, takes its ring **off the board** and says so: `ring=landed from=board`,
  drawn with a **dashed** ring (`border-style: dashed`, measured).
- [x] **Kickoff resolution — byte-identical.** The g2 node's resolved kickoff against
  the README's own G2 fence, extracted independently by `awk` (indented rather than
  fenced on purpose — a second fence in this document would re-point its own kickoff,
  F2):

      $ awk '/^ ``` /{n++; next} n==9' belvedere/README.md | shasum -a 256      (spaces added inside the pattern)
      96ef06ad3ec95630592b752bb1484d86f8484f4da5430f5f48977ad41c3bf434  -   (362 B)
      $ bun -e '…readFlow("flow-batch-1")… g2.kickoff.text + "\n"'
      parser sha256 96ef06ad3ec95630592b752bb1484d86f8484f4da5430f5f48977ad41c3bf434 362 B

  (`flow.test.ts` re-extracts the same block a third way — a regex over the whole
  document rather than a line walk — and asserts equality; the parser holds the fence
  **without** a trailing newline, `sha256 43f72319…`, 361 B, which is the byte the
  `awk` pipeline adds.) In the browser the same mechanism is proven end to end: the
  Action pane's `pre.summons` for the fixture's gated node **=== the fixture doc's
  fence 1**, 82 B.
- [x] **The bill** (probe §9): every node shows its tier (asserted on all four), and
  the footer shows **`personal · thg-fgreen · thg-doorbell`, 9 usage cells**, each
  `used% ±pacing` with the cache's age beside it.
- [x] **Honest failures** (probe §11). Re-seated: the tenant renders them, and both
  cases are asserted. A deliberately broken flow file (`depends: ["ghost"]`) renders
  **`unknown-dep`** with its file and the parser's own sentence, and **files nothing**;
  a building nobody declared a flow for renders *"No flow declares …"* with the
  now-line still drawn — 0 nodes, no guess. (Unknown-flow-by-name is the same value:
  `readFlow('nothing-here') → unreadable`, `readFlow('../../etc/passwd') → unreadable`,
  both asserted.)
- [x] **The gates.** `bun test belvedere/glass` → **455 pass / 0 fail in one process**
  (18 files, 1201 assertions); `bunx --offline tsc --noEmit` → **exit 0**. Cost, under
  B3's 20-request protocol (2 s apart), the **live** register with the deck armed:
  `/deck/state?b=agents/belvedere` **n=20 min=0.197 p50=0.212 p95=0.281 max=0.304 s**
  — inside the 500 ms bar with the ~161 ms identity read included (B18 F4). With the
  socket read off (`live.ts`): `min 59.4 · p50 77.5 · **p95 88.8** · max 132 ms`,
  138 086 B. The Works' own share is **0.7 ms p50** (`worksOf` timed directly, N=12,
  max 4.7 ms), and the tenant redraws the whole drawing in **1.4 ms**.

## Out of scope

- Arming, firing, writing run-state (B11); judge insertion, plan growth
  (B12).
- The board Depends-on graph on building pages (parked, README §6).
- Any new dependency (layout by hand — depth columns + SVG lines; no graph
  library, D54).
- Editing truth: the glass never writes `flows/*.flow.json` — flow files are
  mantle work, committed by sittings.

## Findings

**F1 — the keel transposes the order's own layout, and the DoD still measures it.**
§5 says *"columns by dependency depth, parallel lanes side by side"*; the re-seat says
**time flows down**. Where they conflict the keel wins, so dependency depth is a
**rank running downward** and parallel lanes sit side by side *inside* a rank — which
is also the only arrangement in which the now-line can be a horizontal cut through the
drawing. The DoD's own check survives the transposition unchanged, because it asks for
**DOM order**, not for pixels: `ranks [0 → 1 → 2]`, `[a1:0, b1:1, b2:1, c1:2]`, plus
the measured `b1.top === b2.top && b1.left < b2.left`.

**F2 — a `{doc, fence}` kickoff is a POSITIONAL reference, and a later edit to that
document silently re-points it.** `b10`, `b11` and `b12` quote fence #1 of their own
work docs; **this very landing nearly moved `b10`'s** — a fenced `awk` line in the DoD
above would have made the kickoff fence #2 and the flow file would have resolved,
without error, to a shell snippet. Out-of-range fails loudly (`no fence #99`, tested);
**in-range-but-wrong does not**, and that is the whole hazard class. Two general fixes,
neither built (the schema takes no field nobody consumes this batch): a `sha` on the
kickoff that the parser verifies, or a **heading anchor** instead of an ordinal
(`{doc, after: "Kickoff (verbatim)"}`). The evidence block above is indented rather
than fenced precisely to avoid it, and that workaround is not a fix. **This binds B11:
an arm that resolves a kickoff is arming bytes nobody re-read.**

**F3 — the first SVG in the city puts `http://www.w3.org/2000/svg` into the served
bundle, and B9's "zero `http(s)://`" grep counts it.** It is an XML **namespace name**,
never fetched, and `createElementNS` is the only way to build an `<svg>` element from
script. The probe excludes it **by name** and prints both figures — `/deck.js: 0
(+2 SVG namespace, never fetched)` — rather than loosening the rule to a pattern that
would also wave through a CDN. Any later row drawing SVG inherits this: exclude the
namespace explicitly, never relax the regex.

**F4 — the Works parses nothing of its own: it reads the board off `?b=`'s existing
payload, and `ringOf`'s `from` is what keeps that honest.** One building's detail is
already on the wire for the Workshop, and both tenants ask for the same building, so
the past above the line is the same bytes as the Workshop's board section (+0 B, +0 ms
— `works` itself is **0.7 ms p50** and ~4 kB). What that buys is the join the keel
asks for — "the declared-flow DAG below the line joins the building's landed history
above it, one renderer" — and what it costs is a claim the drawing must not make: a
node whose ring came from the **board** is not evidence the engine ever fired it. So
`ringOf` returns `{ring, from}` and the ring is drawn **dashed** when `from === 'board'`,
with a legend key saying so. The engine's log outranks the board wherever it has
spoken (it is the finer sensor: it knows `fired` before any board says IN FLIGHT).

**F5 — a building's NAME is doctrine's slug against the REAL `~/code`, so a flow file
cannot name its own building inside a fixture city.** `slug()` relativises against a
hardcoded `~/code`; under `GLASS_CITY=/tmp/…` every building's name is its absolute
path, so `"building": "nb/works"` matches nothing. `lab/b10/probe.ts` retargets its
**copy** of the fixture flow after `cp -R` (one line, commented) rather than teaching
`worksOf` a suffix match — a special case in production code to make a fixture work is
the wrong direction. Anyone writing a flow fixture inherits this.

**F6 — the g2 node collapses the keel's two-node close flow into one, deliberately.**
The batch note describes *"the G2 sitting + a Felix-card behind it"*, and the DoD asks
for **five nodes** over `p5 → b10 → b11 → b12 → g2`. One step legally carries both a
gate and its own kickoff (§2's schema: an architect gate's kickoff *is* the step's
own), so `g2` is one node — his card, and behind it the sitting whose kickoff is the
README's own G2 fence. If the Architect wants the card and the sitting as two nodes,
that is a flow-file edit and no code change.

**F7 — the venue precheck is NOT on the poll, by P5 F5 (iii)'s own reading.**
`trust.ts`'s `projectOf` **spawns `git`** per (step, account); at 5 steps × 3 accounts
that is 15 spawns every three seconds for a check whose answer only matters at arm.
So B10 draws the half of the permission clause that is free — the model **is** the
posture, so a `haiku` step is drawn blocked with P5's sentence on it, before Felix can
reach for it — and leaves the trust half to B11, which pays it once. The schema already
carries what that check needs (account, venue).

**F8 — the seam gained a sixth shared cell, `swap.to`.** A landed node's landing record
is corpus prose with references in it, and the deck has exactly one viewer, which
belongs to the Workshop. Rather than the Works growing a second viewer or reaching into
another tenant, `deck-view.ts` now carries `swap.to` beside `viewer.open` and
`selection` — the shell registers its own `focusOn` there at boot, and a tenant asks the
shell to bring another tenant forward. One direction, one registry; a null means no swap
is possible, never a broken control.

**F9 — the bill is B5's cache source and says so on the page.** `worksUsage` renders
the rig's `summon/log/usage/*.json` (never fetches — `gauges.ts` §1), which at this
landing were **3.3 h old** on all three accounts. B17's live read slots in behind the
same `WorksUsage` shape with no change here. Also for B11: **run-state is already
gitignored** — `git check-ignore` puts `summon/log/census/flows/*.run.jsonl` under
`.gitignore:1 summon/log/`, so the engine's log needs no new ignore rule.

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
