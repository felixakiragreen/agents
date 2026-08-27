# B13 — the deck shell

**Status:** OPEN · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel, ✓ Felix 2026-08-27 ([deck-keel.md](deck-keel.md));
this order applies §§2–3, 9–10.

## Goal

The app exists: `/deck` — three panes always (Context · Focus · Action), each
with minimal/typical/expanded states under the law of space, the pinnable
drawer, the tooltip primitive, the `FocusView` seam, and the data plumbing
that keeps it live. Empty-ish tenants are fine — B14+ move in. v0 pages keep
serving untouched.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) — §2 the law of space (the whole law), §3 the
  panes and interactions, §9 stack + spelling, §10 what survives.
- `glass/glass.css`, `glass/html.ts`, `glass/assets/` — felikai, fonts, the
  loved card idioms: carried, not rebuilt.
- The striking-law note: client state is legal for the deck (D13); the v0
  pages' no-client-state law still binds *them*.

## Spec

1. **Route + bundle.** `GET /deck` serves the app shell; client code is
   TypeScript bundled by `Bun.build` at server start (one bundle, no
   framework, no fetch beyond the glass's own origin — the D54 fence stands:
   zero new dependencies).
2. **Three panes.** CSS grid, proportional splits that reapportion as states
   change; states per pane: `minimal` (~1-word + data viz, or absent) ·
   `typical` · `expanded`. Click-to-expand per keel §3 (clicking anywhere in
   a minimal pane expands it); the page body NEVER scrolls — panes own their
   overflow (§2 law verbatim).
3. **The `FocusView` seam.** A small interface — mount/unmount, render into
   the Focus slot, declare state affordances, contribute Action content —
   registered by name. B13 ships a placeholder tenant per slot; Workshop /
   Works / Chat register through this seam in their rows. Panes are a
   replaceable surface (D13) — the seam is that sentence as code.
4. **The drawer.** Overlays everything, pinnable (pinned = reserves space,
   splits reapportion); content is a slot — B14 installs the needs-you queue;
   until then it renders its own emptiness honestly.
5. **Tooltips.** One primitive: instant on hover, expandable (hover-hold or
   click) into more info + actions. Used by every later row; built once here.
6. **State plumbing.** One `GET /deck/state` JSON endpoint — the server
   composes census + register + liveness (+ later: usage, cmux identity)
   into one snapshot; the client polls (2–5 s) and re-renders diffs. No
   websockets, no SSE until polling demonstrably fights (simplicity law).
7. **Laws in force from birth:** spelling — **color, center, grey** — for all
   new strings; IosevkaFelix numbers/titles/buttons, Inter prose; legends
   where color carries meaning; encapsulation-first labels; localStorage
   legal for per-viewer conveniences (pane states), wrapped in try/catch,
   never load-bearing.

## Acceptance criteria — the DoD

- [ ] `/deck` serves; the bundle is built at server start from repo TS; zero
  external requests (grep the served payload for `http(s)://` = 0 beyond
  same-origin), zero new deps in `package.json`.
- [ ] Three panes render; each walks minimal → typical → expanded and the
  grid reapportions (DOM-measured widths pasted for two state combinations);
  `document.body` scrollHeight ≤ viewport at every combination tested.
- [ ] Click-to-expand: a click in a minimal pane expands it (driven via the
  bundled code's own handlers in a headless DOM test, or evidenced by the
  close visual pass — name which).
- [ ] Drawer opens over everything, pins, and reserves space when pinned.
- [ ] Tooltip primitive: instant render on a probe element, expandable state
  reachable, dismissable.
- [ ] `GET /deck/state` returns the composed snapshot; the client polls it
  (network evidence: ≥2 polls observed) and a census change (touch a fixture
  beat) appears in the DOM within one poll interval.
- [ ] v0 routes all still 200 (`/`, `/city`, `/shelf`, `/summon`,
  `/b/agents`).
- [ ] `bun test belvedere/glass` green in one process; `bunx --offline tsc
  --noEmit` exit 0 (client TS covered by the same gate).

## Out of scope

- Any real tenant content (City, Workshop, Works, Chat, composer — B14+).
- SSE/websockets; frameworks; the prettifying pass (⬡ parked).
- Touching v0 pages beyond adding the `/deck` link to their nav.

## Findings

*(append here — deviations from spec, discoveries, parked adjacents)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b13-deck-shell.md,
and build it to its DoD.
```
