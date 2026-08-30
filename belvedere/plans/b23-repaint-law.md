# B23 — the repaint law

**Status:** OPEN · **Depends on:** — (first in the batch-6 chain) · **Staffing:** Builder · opus-high ·
**Blessed:** pending (batch-6 blessing)

## Goal

Three faces of one law — **what a repaint must preserve, and what a swap must
retract** — fixed at the cause. Candidate 6 (the tenant-listener leak), the
Chat's broken scroll, and candidate 8 (the Act-pane stall). This row fires
first in the batch because it breaks READING today: Felix clicked a verdict
card and nothing happened, and the parity of his swap count decided it.

## Inputs — read before building

- ISSUES commits `88fa7c6` (the leak: one click, fifteen `armed` lines at
  G2's own close 16:33:20Z), `1031a81` (the parity face: `wire(focus)`'s
  node click is a toggle, so N leaked handlers make even N a visible no-op),
  `73bdfad` (the scroll: the stick branch `chat.client.ts:395` is the only
  restore; `nearTop` → `loadEarlier` `:423` with no prepend compensation),
  `6d67536` (the stall: repro recipe + two candidate mechanisms).
- B19 F1 (the repaint memo outlived its host — `forget(host)` is the
  retract-on-swap precedent) and B19 F2 (a tenant's mount-time async restore
  races a gesture — `mount()` is not a fresh start).
- B15 F5 (a receipt must outlive the repaint that proves it — the same law,
  applied here to geometry).
- **The sharp edge:** N leaked handlers on the Chat's send deliver the same
  words N times, each delivery verified rather than refused as a twin
  (B16's verification is per-send, not per-intent).

## Spec

1. **The leak, at the class not the instance.** One `AbortController` per
   tenant mount; its `signal` on **every** listener a tenant hangs on a host
   it does not own; aborted at unmount. Audit every tenant (works, chat,
   workshop, city, desk, composer, decoder hovers) — the fix is the pattern,
   applied everywhere the pattern was violated, not a patch on `wire(focus)`.
2. **Scroll is repaint-preserved state.** The transcript box's `scrollTop`
   joins what a repaint restores; a prepend (`loadEarlier`) compensates by
   anchor delta so the viewport shows the same content after as before;
   `stick`/`aim` reset on target swap (they are per-target state living in
   module scope — B19 F2's family).
3. **The stall: reproduce first.** Recipe (commit `6d67536`): expand Action,
   arm, watch 10 s untouched. A fix lands only over a reproduction. If three
   honest recipe runs plus one code-audit pass cannot reproduce it, file what
   was tried and leave it **labeled hypothesis** — that is a named branch of
   this row, not a kill and not a rushed guess.
4. **The stale board (fourth face, measured 2026-08-28).** Felix's Workshop
   board pane never showed B22–B27 after their commit — through refreshes —
   while the live server's own `/deck/state?b=agents/belvedere` payload
   carried every one of them (12–33 mentions each, 155 kB, curled at the cut
   session). **The data reached the wire; the paint refused it.** Hypothesis,
   two candidate mechanisms: the region-signature repaint (B14 F4) whose
   signature misses board-content change, or the B15 F2 `needs` detail
   memoized past its content (B19 F1's family). Reproduce (commit new board
   rows under an open Workshop), fix at the cause, and check the hard-reload
   path separately — his reload ALSO showed stale, which no client memo
   should survive.

## Done when:

Browser half rides `lab/b13/probe.ts`'s instrument (real headless Chrome,
zero dependencies fetched), against a fixture city; the leak's live checks
run against the real deck.

- [ ] **The G2 case is dead:** ≥5 tenant swaps, then one arm click → exactly
  **one** `armed` line in the run log (was fifteen).
- [ ] **The parity face is dead:** the verdict card selects on the first
  click after an odd AND an even number of swaps.
- [ ] **The sharp edge is dead:** ≥3 swaps to and from the Chat, one send →
  the target transcript gains exactly **one** new user turn (byte-verified,
  B16's own read).
- [ ] **Scroll holds:** a long transcript scrolled to the middle survives one
  poll repaint unmoved (±0 px); a `loadEarlier` prepend keeps the viewport
  anchored on the same turn; swapping targets resets stick/aim (no inherited
  snap in either direction).
- [ ] **The stall:** a reproduction with its mechanism named and fixed at the
  cause — or the bounded-attempt record (three recipe runs + audit pass),
  the hypothesis still labeled.
- [ ] **The stale board:** a board row committed while the Workshop is open
  on that building reaches the pane within one poll; a hard reload always
  renders current content.
- [ ] Suite green in one process, offline type gate exit 0, predecessor
  probes re-run green, `/deck/state` p95 within the landed budget, page
  scroll still 0 px.

## Out of scope

- Any new tenant or feature surface; the send verification redesign (per-send
  verification stands — killing the duplicate handlers is the fix).

## Kill criteria

None global — every item fixes at a cause already diagnosed. Escalate only if
the leak fix demands restructuring the tenant seam itself (it should not:
`AbortController` is additive).

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6
and ~/code/agents/belvedere/plans/b23-repaint-law.md,
and build it to its `Done when:`.
```
