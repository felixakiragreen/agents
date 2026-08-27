# B16 — the Chat

**Status:** OPEN · **Depends on:** B11; P6 · **Staffing:** Builder ·
opus-high · **Blessed:** the deck keel, ✓ Felix 2026-08-27; this order
applies §5 and D18 write class 1.

## Goal

The voice. One chat view in the whole deck; any session — live, idle, dead —
hotswaps into it; the transcript reads in Focus, Felix's reply drafts in
Action, the two scroll independently, and **send** delivers his words as a
real turn through P6's proven transport. The note-app copy-paste era ends
here.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §5; **P6's findings — the transport law is
  consumed verbatim**: mechanism, wrapper bytes, verification read, failure
  faces. If P6 KILLED (no byte-exact mechanism), this order's send section
  is skipped whole and the Chat ships read + jump: the keel's named
  fallback, not a deviation.
- B13's seam; B15's session lists (hotswap entry points); B5's shelf joins
  (transcript discovery ×3 accounts — the data layer exists; the shelf page
  dies, the join lives).
- B4/B8 audit + unwind law; D10 (an ambiguous target never sends); B5 E2
  (omitted-never-guessed) — P6 Q3's resume-with-turn is its deliberate-send
  extension.

## Spec

1. **The tenant.** `chat` registers via the seam. Hotswap from any session
   row (Workshop, City expanded, needs-you queue) and after a composer fire
   (keel: summoning swaps the Chat in). One instance; swapping targets
   replaces the transcript and preserves the draft (drafts are per-target —
   see 4).
2. **The transcript (Focus).** Tail-windowed render of the target's
   transcript file (newest at bottom, scroll-up loads earlier windows);
   user/assistant turns styled per felikai; tool activity summarized to one
   encapsulated line each (dataviz first — the full record is one jump
   away). Live targets append within one poll (census `Stop`/beat-driven
   re-read); dead targets render their stillness honestly. **Transcript
   prose passes B20's decoder** — hovering `canon row 17` in an agent's own
   words decodes like everything else; fenced kickoffs inside transcripts
   stay exempt (B20 §1).
3. **Send (Action).** The draft box + send button, armed per D18 class 1:
   credential-gated, D10-bound (no unambiguous single target — no send),
   delivery via P6's mechanism per target state (live-idle · mid-turn ·
   dead/resume), **verified after delivery** by P6's transcript read — the
   UI shows sent → verified (sha) or the named failure face. Audited like a
   fire: sha + bytes, never the text.
4. **Drafts persist.** Every draft auto-saves per-target under
   `desk/drafts/` (the D17 home; B19 builds the desk proper — this row may
   mint only `desk/drafts/`, writes nothing else there). A draft survives a
   reload, a hotswap, and a server death.
5. **Batons in Action** (the vision's word): when the target's building has
   a live baton/gate for Felix, the Action pane surfaces it beside the
   draft — read-only wiring here (the queue's answer wires stay B14's).

## Acceptance criteria — the DoD

- [ ] Hotswap: three entry points swap three targets into the one view;
  the draft written against target A is intact when A returns.
- [ ] Transcript: this campaign's own Architect transcript renders
  tail-windowed with earlier windows loading; a live probe's new turn
  appears within one poll (timestamps).
- [ ] **Send, live:** a multi-line message with a blank line, sent from the
  deck to a live idle probe session, arrives as ONE user turn, byte-exact
  (sha of draft ≡ transcript turn — pasted), audited; the probe acts on it
  (its reply references the content).
- [ ] **Send, dead:** a message to a dead session resumes it with that turn
  (P6 Q3's shape) — transcript evidence, silo intact.
- [ ] **Failure face:** one induced failure (dead pane / wrong target)
  renders its named face; nothing reports delivered without verification.
- [ ] Draft persistence: kill the glass mid-draft (B8's drill pattern),
  relaunch — the draft is there.
- [ ] Zero sends possible with hands disarmed (503 + honest banner); zero
  send wiring when the target is ambiguous (structural grep, D10).
- [ ] Suite green one process; type gate exit 0; probe workspaces closed.

## Out of scope

- Group sends, broadcast, cross-session threads; rendering images in
  transcripts (the images chapter); a per-session chat multiplex (there is
  ONE view — keel non-goal); any desk feature beyond `desk/drafts/` (B19).

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
~/code/agents/belvedere/plans/p6-message-transport.md findings,
and ~/code/agents/belvedere/plans/b16-chat.md,
and build it to its DoD.
```
