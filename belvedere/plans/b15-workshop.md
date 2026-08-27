# B15 — the Workshop

**Status:** OPEN · **Depends on:** B14 · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel, ✓ Felix 2026-08-27; this order applies §3 (the
Focus slot) + the field report's Workshop items (ISSUES → keel fold).

## Goal

One building, inside: the first real `FocusView` tenant. Clicking a building
in the City focuses its Workshop — live agents first, then the building's
truth (board, ledger tail, decision queue, ISSUES), every section
collapsible and reorderable, docs opening at the line.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §3; B13's `FocusView` seam and tooltip
  primitive; B14's City click-through and waiting vocabulary.
- v0 `pages.ts` building panels — the render logic ports; the PAGE dies
  later, the logic lives here.
- `doctrine/` parse (D65 — one parser, still); the D58 linking law.
- Felix's field report rulings: **LIVE SESSIONS first** (default order),
  collapse/reorder, `agents/LEDGER.md:385`-style links must land on the line.

## Spec

1. **The tenant.** `workshop` registers via the seam; City click focuses it
   with that building. States: minimal = name + dots + badge counts;
   typical = live sessions + board summary + tail head; expanded = the full
   panel set.
2. **Sections, in default order:** Live sessions (dots, waiting style, per
   session: name per current identity source, tier, age, jump; hotswap
   affordance arrives with B16 and the slot says so) · Board (rows
   encapsulated, status rings) · Ledger tail · Decision queue · ISSUES.
   Every section collapses; **order is draggable and persists per-viewer**
   (localStorage, try/catch, defaults intact when absent — the B13 law).
3. **The doc viewer with line anchors.** Rendered links resolve (D58) and a
   `path:line` reference opens the doc scrolled to that line, line
   highlighted — the field report's item 3. Ship it as the deck's `/doc`
   equivalent inside Focus (v0's `/doc` untouched).
4. **Tooltips everywhere data is dense:** a board row's tooltip carries its
   status annotation; a session's carries its cwd/venue/pid — the §2 law
   (fewest words on the surface, depth on hover).

## Acceptance criteria — the DoD

- [ ] City click → Workshop focused on that building (DOM evidence, two
  buildings).
- [ ] Default section order live-sessions-first; a reorder survives a
  reload (localStorage evidence); absent storage renders defaults.
- [ ] All five sections render real data for `agents/belvedere` and one
  hexwright-class building; collapse state works per section.
- [ ] A `LEDGER.md:385`-style link opens the viewer scrolled to line 385,
  highlighted (DOM evidence: the line's element in view + marked).
- [ ] Waiting sessions carry the B14 style here too; zero fire wiring
  (structural grep).
- [ ] Suite green one process; type gate exit 0.

## Out of scope

- Chat/hotswap (B16); rename/recolor controls (B18); the Works (B10); any
  board *editing* — truth is read, gestures ride B6's wires only.

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b15-workshop.md,
and build it to its DoD.
```
