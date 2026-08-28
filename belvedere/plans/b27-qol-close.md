# B27 — the QoL sweep + the close flow

**Status:** OPEN · **Depends on:** B22–B26 (last in the chain — it sweeps their
surfaces and absorbs the tweak list) · **Staffing:** Builder · opus-high ·
**Blessed:** pending (batch-6 blessing)

## Goal

The small usability debts from Felix's first real hours, swept in one pass
over the finished rework — and the batch's close flow left on disk. **This
row is deliberately last so the tweak list can keep growing until it fires**:
his field reports were first impressions, more are coming (his word,
2026-08-28), and they land in ISSUES / the desk right up to this row's
dispatch.

## Inputs — read before building

- ISSUES commits `731bac6` (the Works' Chat slot), `6d67536` (pass-gesture
  discoverability + the account knob), the G2 design-input line (README §6,
  batch-5 close).
- B10 F8 (`swap.to` exists), B16 F1 (the `?s=` seam member), B16's cold-send
  hover ("the hands are cold" — the honest-disabled exemplar).
- B12's precedent for leaving a close flow on disk; B11 F3 (the arm hashes
  file + resolved kickoffs).
- **The tweak list at dispatch:** every ISSUES entry and desk note Felix has
  filed as tweak-class by the time this row fires, as scoped by the
  Architect/Dispatcher amendment that accompanies the kickoff (D57). This
  brief's §5 bounds what may be absorbed without a new ruling.

## Spec

1. **Wire the Works' hotswap slot.** The fired node carries the sid; the
   slot becomes the real control: `swap.to('chat')` on that session (B16's
   `?s=`). The placeholder span dies.
2. **The honest-disabled law, city-wide.** Anything rendered inert says WHY
   on hover — B16's cold send is the exemplar. Sweep every inert control on
   every route; a slot that names a landed row must never read as broken. A
   grep-able convention (one attribute/class carrying the why) so the sweep
   is checkable, plus live hover checks.
3. **The pass gesture, findable (pre-chewed).** Today only a picked node
   shows its actions, so a waiting Felix-card is invisible until he happens
   to click it. The flow view surfaces "a card waits — [go]" without picking:
   a pointer that scrolls/picks the node — **not a second pass button**. One
   gesture, one place; the card itself remains the only pass surface (D10's
   shape preserved).
4. **The account at arm, honest (pre-chewed, strike-able).** The arm card
   labels the account as what it is — declared in the flow file — and shows
   that account's usage beside it (§3's law: usage visible wherever accounts
   are chosen ⇒ where none is choosable, say so instead of implying a
   knob). The knob itself is deferred until a flow actually wants per-arm
   account choice; if Felix strikes this at blessing, the knob joins this
   row's spec.
5. **The tweak list.** Absorb entries that are visual/QoL/usability within
   surfaces that already exist — label, spacing, hover, ordering, wording,
   affordance-findability. **STOP-clause:** a tweak that changes structure,
   adds a surface, touches the fence, or contradicts a design law escalates
   to the Architect instead of being absorbed — this row never rules.
6. **The close flow.** Leave `flows/flow-close-6.flow.json` on disk,
   **unarmed**: G3's kickoff byte-identical to the batch note's fence
   (B12's pattern; B11 F3's hash law makes a drift loud at arm).

## Acceptance criteria — the DoD

- [ ] From a fired Works node, the hotswap control lands the Chat on that
  exact sid (live, sid verified); the placeholder is gone from source and
  bundle.
- [ ] The inert sweep: every disabled/inert control on every route carries
  its why (the convention greppable and counted), and a live hover on three
  representative cases (cold hands, no-baton, not-yet-landed) shows it.
- [ ] An armed flow with a waiting Felix-card shows the waiting state at
  flow level without any node picked; the gesture jumps to the card; the
  card is still the only pass surface (zero new pass wiring elsewhere —
  B17 F1's sound check).
- [ ] The arm card names the declared account with its live usage chip; no
  control implies a choice that does not exist.
- [ ] Each absorbed tweak listed in findings with its before/after; each
  escalated tweak named with why.
- [ ] `flows/flow-close-6.flow.json` parses (the one parser, 0 lint), sits
  unarmed, kickoff byte-identical to the batch note's G3 fence (sha both
  sides).
- [ ] Suite green in one process, offline type gate exit 0, predecessor
  probes re-run green, `/deck/state` p95 within the landed budget, page
  scroll 0 px.

## Out of scope

- The ⬡ prettifying pass (parked until Felix unparks it — README §3); any
  structural change (the STOP-clause routes it out); arming anything.

## Kill criteria

None global. The STOP-clause is the row's safety valve: absorbed scope is
bounded by §5, and this row would rather land small than rule once.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6
and ~/code/agents/belvedere/plans/b27-qol-close.md
plus the tweak-list amendment the Dispatcher hands you,
and build it to its DoD.
```
