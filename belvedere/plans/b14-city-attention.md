# B14 — the City + attention

**Status:** OPEN · **Depends on:** B13 · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel, ✓ Felix 2026-08-27; this order applies §§3–4
(D15).

## Goal

The Context pane earns its rent and the waiting-input blindness dies twice
(D15): the City as the deck's sidebar — every building, grouped, live dots,
attention badges, pulsing what needs Felix to the top — and the drawer's
default tenant, the **needs-you queue**, ranked and answerable in place.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §§3–4; D15's exact wording (README §7).
- v0's `pages.ts` city grouping + `attentionOf`/`freshness` (B9) — the
  ranking law exists; port it, don't reinvent. The auditor delta line
  survives into the City's footer.
- The census waiting signal: P1's law — `Stop` is the idle edge;
  `PermissionRequest` events mark blocked-on-approval; `Notification` is an
  interactive-only nag. A session whose last event is `PermissionRequest`
  (or `Stop` while its lane expects input — the B6/B3 gate sources) is
  *waiting*.
- B6's inbox gestures — countersign/note wiring the queue reuses; B3/B8's
  D10 law — nothing here ever arms a fire.

## Spec

1. **The City (Context tenant).** Buildings grouped by `~/code/<x>`
   neighborhood (v0 law), each row: encapsulated name, live dots (census),
   attention badges (counts by class: waiting-input · Felix-gates · pending
   countersigns · escalations). **Attention outranks recency across the
   whole pane** — a building with any badge sorts above every quiet one;
   recency orders only within a rank (standing law, extended). States: 
   minimal = neighborhoods + dots only; typical = + badges; expanded = +
   per-building session lines. Clicking a building → its Workshop focuses
   (B15 registers the view; until then, the click stores the selection and
   the placeholder names it — honest, not dead).
2. **Waiting-state.** From the census per the input law above; a session
   waiting renders its dot in the waiting style (distinct, legend-carried)
   everywhere dots appear.
3. **The needs-you queue (drawer tenant).** One ranked list across the city:
   waiting sessions · live Felix-gates (board parse) · pending countersigns
   (decision queue) · escalation-marked landings. Each item: encapsulated
   title, age, and its in-place answer — countersign → the B6 gesture wire;
   a gate/escalation → note gesture + jump; a waiting session → jump (send
   arrives with B16; the item says so honestly). D10 binds: no item ever
   carries fire wiring; ambiguous parses render safe with the conflict
   named.
4. **Header count.** The deck header carries the queue's total — visible at
   rest even with the drawer closed.

## Acceptance criteria — the DoD

- [ ] City renders all register buildings grouped; a building given a
  fixture gate badge sorts above a quiet building with newer activity
  (asserted).
- [ ] A live waiting session (induce: a probe session paused on a permission
  prompt — fire haiku-low into a scratch subdir of `~/code/agents` with a
  guarded command; close after) shows the waiting dot in the City AND an
  item in the queue within one poll interval — the end-to-end proof of the
  blindness dying. Evidence: census line + DOM, timestamps.
- [ ] Queue: one real pending countersign answered in place lands the B6
  gesture append (byte-diff of ISSUES pasted) — or, if the city has no true
  pending countersign (B6 F2's finding), a fixture decision proves the wire
  and the absence is named.
- [ ] Zero fire wiring anywhere in City or queue (B3's structural grep).
- [ ] Legend carries the dot/badge vocabulary; header shows the count with
  the drawer closed.
- [ ] Suite green one process; type gate exit 0; `/deck/state` p95 under
  B3's protocol < 500 ms with the City live.

## Out of scope

- The Workshop itself (B15); send-to-session (B16); rename/recolor controls
  (B18).
- Any new attention source beyond the four named classes.

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b14-city-attention.md,
and build it to its DoD.
```
