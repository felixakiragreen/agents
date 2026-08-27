# B19 — the desk (D17)

**Status:** OPEN · **Depends on:** B16 · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel, ✓ Felix 2026-08-27; this order applies §8 (D17)
and D18 write class 3.

## Goal

The place Felix writes. One drawer city-wide — `~/code/agents/desk/` —
where notes, dreams, and prompt drafts persist from the Action pane, and
**sending routes**: a field report lands in that building's ISSUES, a message
goes to a session, a draft summons loads the composer. The 17-item note that
commissioned this chapter would have been written here.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §8; D17 + D18 (README §7) — the glass writes
  files **only under `desk/`**; ISSUES appends ride B6's existing wire;
  session sends ride B16's; commits are never the glass's (files on disk;
  sittings and Felix commit — the fence gains no git hand).
- B16's `desk/drafts/` (already minted); B6's gesture grammar (D63 — a
  routed field report is `- <date> · Felix (via Belvedere) · <what>` with
  the block form for long texts, exactly as the Architect filed the
  commissioning notes).
- The parked founding-ritual law: dream-into-new-repo routing stays out —
  the desk saves the dream FILE; founding a building remains Felix's ritual.

## Spec

1. **The store.** `~/code/agents/desk/` — flat until it needs structure
   (anti-sprawl): `desk/<slug>.md` per note, frontmatter-free, first line
   is the title; `desk/drafts/` (B16's) holds per-target chat drafts. The
   deck lists, opens, edits, saves; every save is a plain file write under
   `desk/` and nowhere else (path-confined like the font route — no path
   from a URL).
2. **The writing surface (Action tenant).** Reachable from anywhere in one
   gesture (the keel's "a place to start writing"): new note, or continue
   the last. Minimal = one line + [expand]; expanded = the full editor.
   Autosave; the B8 drill bar applies (a server death loses nothing).
3. **Send routes**, each explicit and previewed before it fires:
   - **→ building's ISSUES**: composes the D63 entry (block form when
     long), shows the exact bytes to be appended (the countersign law:
     verbatim before sign-off), one click appends via B6's wire, the note
     file gains a routed-stamp line (where it went, when).
   - **→ session**: hands the note text to the Chat's draft for that
     target (B16 sends; the desk never grows its own transport).
   - **→ composer**: loads the note as the summons body in B17's composer.
4. **Nothing else.** No tags, no search, no folders until use proves the
   need — the parked list exists for a reason.

## Acceptance criteria — the DoD

- [ ] Write → autosave → reload → intact; kill the glass mid-edit →
  relaunch → intact (drill pattern, evidence pasted).
- [ ] Route → ISSUES: a real note lands in a scratch-adopted building's
  inbox as a legal D63 block (0 lint), the previewed bytes ≡ the appended
  bytes (sha), the note carries its routed-stamp.
- [ ] Route → session: the note arrives in the Chat draft for the chosen
  target (and sends under B16's proofs).
- [ ] Route → composer: the note body becomes the composed summons,
  previewed live.
- [ ] Confinement: a crafted save targeting outside `desk/` is refused
  loudly (test).
- [ ] `git status` shows only `desk/` additions after the DoD run — the
  glass committed nothing.
- [ ] Suite green one process; type gate exit 0.

## Out of scope

- Founding rituals, dream routing into new repos; search/tags/structure;
  any write outside `desk/` beyond the two existing wires; committing.

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b19-desk.md,
and build it to its DoD.
```
