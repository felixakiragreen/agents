# B23 — the repaint law

**Status:** OPEN (re-cut 2026-08-30 at G5 — the v3 world; the original cut is
git history) · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Blessed:** pending (the rework blessing)

## Goal

One law, five faces — **what a repaint must preserve, and what a swap must
retract** — fixed at the cause, on the surviving organs and the Chat that is
now primary (D22 r4). Re-cut from the frozen original: the Chat faces lead,
because the visual pass (2026-08-30) found them in Felix's own hands. And the
charge seeds his direction — **"we need to develop some UI tests. Test pieces
of it, 1 by 1"** — every face fixed here pins a browser interaction probe
into a standing suite.

## Inputs — read before building

- The punch list (G5's sweep, Felix verbatim): *"I type one letter into the
  Reply box and the textfield unfocuses"* · *"Scrolling to the top of Chat
  snaps it back down OR gets it stuck at the top"* · his design ruling: *"The
  scroll view should show the entire chat & the minimap jumps to its location
  in the scrollview (not go back in time)"* — continuous full-transcript
  scroll replaces windowed paging; **the minimap is spatial, never temporal**
  (README §3, the Chat laws).
- C15 F3 (a repaint signature omitting a picker's state — the proven family
  for both the focus loss and the stale board) · B14 F4 (the region-signature
  repaint) · B19 F1/F2 (memo outliving its host; mount-time race) · B15 F5
  (a receipt outlives the repaint that proves it).
- B16's Chat (tail-window pager — the model this charge retires) and C16
  (the minimap, the 4.7 MB capture `lab/c16/rich.jsonl` + `rich()` — the
  perf fixture).
- The leak (candidate 6): one click, fifteen `armed` lines at G2's close;
  `wire(focus)`'s toggle parity making even N a visible no-op. **The sharp
  edge:** N leaked handlers on the Chat's send deliver the same words N
  times, each verified rather than refused (B16 verifies per-send).
- The stale board (fourth face, measured 2026-08-28): B22–B27 in the wire
  payload through refreshes, never painted — and the hard reload ALSO showed
  stale, which no client memo should survive.
- The camera (C17 — probes, `Probe.remember` as the door) + the fixture city
  (C19) — focus retention and scroll position are CDP-assertable, the class
  C15 F2/F3 proved unit tests cannot see.
- C18 F2 (the runner's gate families — the precedent for adding one).

## Spec

1. **The composer face.** Reproduce the one-keystroke unfocus (hypothesis on
   file, unconfirmed: the poll repaint replacing the composer mid-keystroke —
   C15 F3 / B14 F4's family, B19 F2 the sibling); fix at the cause. The law:
   **focus, caret position, and the unsent draft are repaint-preserved
   state** — a poll may never cost a keystroke.
2. **The scroll model, replaced by his ruling.** Continuous full-transcript
   scroll: the scrollbar spans the whole conversation; the minimap is a
   spatial index — a click lands at that location in the scrollview, and
   scrolling never snaps, never sticks. The tail-window pager (`nearTop` →
   `loadEarlier`, the stick branch) retires with the model. Virtualize under
   the hood if the 4.7 MB fixture demands it — the model his hands feel is
   continuous; measure and print the render/scroll cost on that fixture.
   `stick`/`aim` (follow-the-tail) survive only as an explicit at-bottom
   affordance, reset on target swap.
3. **The leak, at the class.** One `AbortController` per tenant mount, its
   signal on every listener a tenant hangs on a host it does not own,
   aborted at unmount; audit every surviving tenant (works, chat, workshop,
   city, desk, composer, decoder hovers).
4. **The stale board.** Reproduce (commit new board rows under an open
   Workshop), fix at the cause — the signature that omits board content
   (C15 F3's family) — and check the hard-reload path separately.
5. **The stall, bounded.** The original recipe ("expand Action, arm, watch
   10 s") armed the dead v2 engine and may be unreproducible in the v3
   world. Three honest runs of the nearest v3 recipe (open Action on a v3
   run, watch untouched) plus one code-audit pass; fix over a reproduction,
   or file the bounded-attempt record and retire the hypothesis with it.
6. **The interaction gate.** Every face above lands with a probe under
   `camera/probes/` asserting the interaction (focus survives a poll; scroll
   position survives a poll; one click → one send → one new turn; a
   committed row paints within one poll). The probes join a standing family:
   `bun v3/gates.ts --probes` runs them all — **the grant to touch
   `v3/gates.ts` is explicit and scoped to adding this opt-in family**
   (C18 F2's own two fixes stay the Architect's). Later charges add probes;
   this charge builds the rail they land on.

## Done when:

- [ ] **Composer:** typing 10 characters across ≥3 poll repaints loses zero
  keystrokes and zero focus (CDP-asserted); the cause named in findings with
  its reproduction.
- [ ] **Scroll:** on the 4.7 MB fixture — scroll to the very top: readable,
  no snap-back, no stuck state; middle position survives a poll ±0 px; a
  minimap click lands spatially (the mark's content in-viewport); at-bottom
  follow still tracks a growing tail; the model's cost measured and printed.
- [ ] **The G2 case is dead:** ≥5 tenant swaps, one action click → exactly
  one audit line (was fifteen); the parity face dead (first click selects
  after odd AND even swap counts); **the sharp edge dead:** ≥3 swaps to and
  from the Chat, one send → exactly one new user turn (byte-verified).
- [ ] **The stale board:** a board row committed while the Workshop is open
  reaches the pane within one poll; a hard reload always renders current.
- [ ] **The stall:** reproduction + fix, or the bounded-attempt record.
- [ ] **The gate:** `bun v3/gates.ts --probes` runs the standing suite green
  in one command; the default run untouched; each probe seen to fail (one
  induced red per probe class, reverted).
- [ ] `bun v3/gates.ts --glass` ALL GREEN; predecessor probes green; page
  scroll 0 px; `/deck/state` p95 within budget; budget **0 real turns**.

## Out of scope

- Any new surface; the send-verification redesign; the account knob, tooltip
  and decoder items (B27's); the gut (C21's).

## Findings

*(append here — evidence-grade: every claim carries the command and output
that proved it)*

## Kill criteria

None global — every face fixes at a cause diagnosed or reproducible. Escalate
only if the leak fix demands restructuring the tenant seam itself, or if
continuous scroll on the 4.7 MB fixture cannot hold 60fps-class feel even
virtualized — bring the measurement, never a silently degraded model.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence,
design laws — the Chat laws included, agreements; the campaign notes) and
~/code/agents/belvedere/plans/c15-deck-v3-lane.md +
c16-chat-chapter.md + c17-camera.md (findings included),
and build ~/code/agents/belvedere/plans/b23-repaint-law.md to its
`Done when:`.
```
