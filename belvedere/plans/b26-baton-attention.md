# B26 — batons on the deck

**Status:** OPEN (re-cut 2026-08-30 at G5 — the rail survives whole, D22 r2;
baton semantics re-read against v3 runs; the original cut is git history) ·
**Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** pending
(the rework blessing)

## Goal

The deck's attention model learns the baton. Felix's report (2026-08-28): an
agent finished, handed a baton, and "I can't see that anywhere or act on it
anywhere in belvedere." `attention.ts` has no baton bucket, so a
**Felix-holder baton — needs-you class by definition (D15) — raises no City
badge and no queue item.** The v3 world sharpens the ask: the queue already
carries engine-paused steps as the `waiting` class (C16 F4); the baton joins
that same one-computation attention model, never a second one.

## Inputs — read before building

- `glass/attention.ts` (B14 — one computation, two renderings: the City's
  badges ARE the queue's items bucketed; extend it, never fork it) and the
  `waiting` class as C16 landed it (`sid` for the pane jump, `chat` for the
  conversation — a headless step has no pane).
- The doctrine parser's `Baton` shape — `holder`, `kind` (single / batch /
  fork, canon D64), `instruments[]`.
- D10 (ambiguity never arms — ruled 2026-08-27): a collided or unparseable
  holder renders note + copy, zero wiring (B8 made that structural).
- C16 F3's law for the Works half: a step's session is addressed through the
  log's ignitions, never the fold's state.
- B17 (the composer loads a body), B17 F1's sound check (`outerHTML` minus
  `textContent`, plus source and bundle).
- The camera (C17) + fixture city (C19 — beta's fork baton fixtures are
  committed and photographed already); every visual bar ships camera
  evidence.

## Spec

1. **The bucket.** `attention.ts` gains a baton bucket over the parsed ledger
   tails the register already carries. Felix-holder ⇒ a needs-you queue item
   + its City badge (attention outranks recency, §3). Session-holder ⇒ the
   rail's Dispatch semantics, D10 collision rules inherited unchanged. Fork ⇒
   Felix-class: the choice rendered with each option's instrument
   **copyable**, never fired, the recommendation shown.
2. **The affordance is the composer.** A Felix-holder item opens the baton's
   instrument in the composer — copy-is-reading; nothing on this path
   auto-fires; the composer's fire button is the only hand, after his click.
3. **The Works closes the loop.** A landed terminal node whose building's
   ledger tail hands a baton says so on the node ("this landing handed a
   baton"), linking to the queue item — the exact gap in his report. The
   node's own identity stays log-derived (C16 F3).
4. One computation, two renderings, kept: a badge can never count a baton the
   queue does not list — and the baton bucket sorts WITH the `waiting` class
   it now shares a queue with, one ordering law for both.

## Done when:

Fixture city (C19's beta carries the fork) + the real corpus; every visual
bar's shot Read and described.

- [ ] A live Felix-holder baton appears as a City badge and a queue item;
  opening it lands the composer holding that baton's fenced summons,
  byte-identical to the ledger's fence (photographed).
- [ ] A session-holder baton renders with Dispatch semantics; a
  collided/ambiguous holder renders note + copy with **zero fire wiring**
  (B17 F1's sound check).
- [ ] A fork baton renders its options with copyable instruments and the
  recommendation; nothing fires (beta's committed fixture, re-shot).
- [ ] The Works' landed terminal node surfaces the handed baton and jumps to
  the queue item.
- [ ] Ordering holds: a Felix-holder baton outranks a merely-recent building;
  baton and `waiting` items interleave under one attention law (fixture
  pinned, B14's pattern).
- [ ] An interaction probe for the composer-open path joins the `--probes`
  suite (B23's rail).
- [ ] `bun v3/gates.ts --glass` ALL GREEN; predecessor probes green;
  `/deck/state` p95 within budget; budget **0 real turns**.

## Out of scope

- Auto-firing anything (forever-class); changing the baton grammar (canon's);
  the queue's non-baton classes (landed at C16).

## Findings

*(append here — evidence-grade)*

## Kill criteria

None. A holder the D63/D64 grammar cannot classify renders unarmed with the
note (D10) and the parse gap files to findings — the parser never fattens
here (README §1).

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence,
design laws, agreements; the campaign notes) and
~/code/agents/belvedere/plans/c16-chat-chapter.md (findings — F3/F4 bind the
queue half),
and build ~/code/agents/belvedere/plans/b26-baton-attention.md to its
`Done when:`.
```
