# B26 — batons on the deck

**Status:** OPEN · **Depends on:** — (chain per the batch-6 note) · **Staffing:** Builder · opus-high ·
**Blessed:** pending (batch-6 blessing)

## Goal

The deck's attention model learns the baton. Felix's report (ISSUES
2026-08-28): an agent finished, handed a baton, and "I can't see that
anywhere or act on it anywhere in belvedere." The baton was on file and
rendered — but only in the Workshop's ledger-tail panel and on the retired v0
rail. `attention.ts` has no baton bucket, so a **Felix-holder baton — needs-you
class by definition (D15) — raises no City badge and no queue item**, and the
deck-era sovereign never sees the one thing the whole doctrine says to hand
him.

## Inputs — read before building

- ISSUES commit `1031a81` (the report); `glass/attention.ts` (B14 — one
  computation, two renderings: the City's badges ARE the queue's items
  bucketed; this row extends that computation, never adds a second).
- The doctrine parser's `Baton` shape — `holder`, `kind` (single / batch /
  fork, canon D64), `instruments[]`.
- The rail's classification history and its rulings: B3 E2 → D10 ruled
  2026-08-27 — **ambiguity never arms**; a baton whose holder is collided or
  unparseable renders note + copy, zero wiring (B8 made that structural).
- B16 (the composer/Chat seams), B17 (the composer loads a body).

## Spec

1. **The bucket.** `attention.ts` gains a baton bucket over the parsed
   ledger tails the register already carries. Felix-holder ⇒ a needs-you
   queue item + its City badge, sorted with the attention class it is
   (attention outranks recency, §3). Session-holder ⇒ the rail's Dispatch
   semantics, D10 collision rules inherited unchanged. Fork ⇒ Felix-class:
   the choice rendered with each option's instrument **copyable**, never
   fired, the recommendation shown.
2. **The affordance is the composer.** A Felix-holder item opens the baton's
   instrument in the composer — copy-is-reading, the fence's D10 line holds:
   nothing on this path auto-fires; the composer's own fire button is the
   only hand, and only after his click.
3. **The Works closes the loop.** A landed terminal node whose building's
   ledger tail hands a baton says so on the node ("this landing handed a
   baton"), linking to the queue item — the exact gap in his report.
4. One computation, two renderings, kept: a badge can never count a baton
   the queue does not list.

## Done when:

Fixture + the real corpus (the recording session's own baton — holder Felix —
is live evidence while it stands).

- [ ] A live Felix-holder baton appears as a City badge and a queue item;
  opening it lands the composer holding that baton's fenced summons,
  byte-identical to the ledger's fence.
- [ ] A session-holder baton renders with the rail's Dispatch semantics; a
  collided/ambiguous holder renders note + copy with **zero fire wiring**
  (B17 F1's sound check: `outerHTML` minus `textContent`, plus source and
  bundle).
- [ ] A fork baton renders its options with copyable instruments and the
  recommendation; nothing fires.
- [ ] The Works' landed terminal node surfaces the handed baton and jumps to
  the queue item.
- [ ] Attention ordering holds: a Felix-holder baton outranks a merely-recent
  building (fixture pinned, B14's pattern).
- [ ] Suite green in one process, offline type gate exit 0, predecessor
  probes re-run green, `/deck/state` p95 within the landed budget.

## Out of scope

- Auto-firing anything (forever-class); changing the baton grammar (canon's);
  the v0 rail (it stands as-is until retired by its own row).

## Kill criteria

None. If ledger-tail parsing surfaces holders the D63/D64 grammar cannot
classify, they render unarmed with the note (D10) and the parse gap files to
findings — the parser never fattens here (README §1).

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6
and ~/code/agents/belvedere/plans/b26-baton-attention.md,
and build it to its `Done when:`.
```
