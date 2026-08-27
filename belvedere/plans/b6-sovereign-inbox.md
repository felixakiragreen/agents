# B6 — the sovereign's inbox

**Status:** OPEN · **Depends on:** B4 (apply fires through hands) · **Staffing:**
Builder · opus-high · **Batch 3:** fourth row, strictly serial, straight to master
**Spec blessed:** 2026-08-26, Architect (G1), on keel §7 + D3 write #3 + D63.

## Goal

His word travels without his hands: gestures and notes land as legal inbox
entries; the proper office applies them to the board with his name on the ruling.
The fence holds by wiring, not exception.

## Spec

1. **Gesture UI** on building pages and the rail: a free-text note box, and
   defer/reorder gestures on rendered board rows. Every gesture becomes ONE
   append to **that building's** `ISSUES.md`, D63 grammar:
   `- <YYYY-MM-DD> · Felix (via Belvedere) · <the gesture: "defer 11", "14 before
   13", or the note verbatim>`. Append-only — the glass NEVER rewrites, reorders,
   or deletes existing content (D3 write #3 is the whole license).
2. **The apply button** (per building, visible when its inbox is non-empty):
   `POST /hands/fire` a scoped Architect sitting into cmux —
   summons template, verbatim:

   ```
   You are an Architect at fable-high.
   Wear ~/code/agents/canon/mantles/architect.md,
   then read <building>/README.md (or its master doc) and <building>/ISSUES.md,
   sweep the inbox: rule each entry, true the board, attribute Felix's entries
   to Felix, commit in his git style.
   ```

3. **Missing inbox:** a building with no `ISSUES.md` gets one created from the
   D53 header template ON FIRST GESTURE (adoption-on-first-need is doctrine §3) —
   header from [`canon/work/templates/issues.md`](../../canon/work/templates/issues.md),
   then the entry appended.
4. Hands disabled → notes still append (file write is the glass's own, not a
   socket call); only the apply button disables.

> **Amended 2026-08-27 (Architect, at Felix's ask — "a button inside Belvedere to
> countersign things"):** the rail's pending-countersign cards (B3 renders them
> city-wide) gain a **Countersign** button — a gesture like any other: ONE append
> to that building's ISSUES, `- <YYYY-MM-DD> · Felix (via Belvedere) ·
> countersign <D-id>: ✓`. The card reads its own entry back and renders
> **recorded — awaiting fold** until the sweep stamps the ✓ into the decision
> entry with his name (the fence's own sentence: his word travels as inbox
> entries the Architect applies). Three card states, all derived from files:
> pending → recorded → folded. The glass never pens the D-entry itself (D3;
> editing truth is the forever non-goal). DoD gains: one countersign gesture
> landing lint-green + the card's recorded state shown.

## Acceptance criteria / DoD — evidence pasted here at build time

- [ ] A note gesture lands as a D63-legal entry in `belvedere/ISSUES.md` (the
      smoke target — in-fence); `doctrine lint` on that file stays green.
- [ ] Append-only proof: file content BEFORE is a byte-prefix of AFTER (hash of
      prefix shown), across ten rapid gestures (no interleaving corruption).
- [ ] A defer gesture on a rendered row lands as the entry (row id quoted).
- [ ] First-gesture adoption: scratch building with no ISSUES.md gets header +
      entry, lint-green.
- [ ] Apply fires the scoped Architect sitting into cmux (probe: pointed at a
      scratch building; transcript first-turn quoted; probe cleaned up).
- [ ] The glass still edits NOTHING: git diff on every touched repo shows only
      ISSUES.md appends (proof pasted).

## Out of scope

- Auto-applying gestures to boards (never — that is the Architect's pen);
  cross-building bulk gestures; the DESK artifact (parked, GA's call); editing
  or resolving entries (the sweep's job).

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b6-sovereign-inbox.md,
and build the order.
```
