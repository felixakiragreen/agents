# C21 — the gut: the cmux nag

**Status:** OPEN · **Depends on:** — (the referent ⬡ paid at the blessing,
2026-08-30) · **Staffing:** Builder · opus-high · **Blessed:** ✓ Felix
2026-08-30 (the rework blessing)

## Mission

Felix's direction, verbatim (the visual pass, 2026-08-30): **"I'm ready to gut
the v1 functionality — Agents Presence; completely remove the cmux nagging
shit."** The frame is standing law: cmux retreated to viewport candidate
(D20/D22) and the Chat is primary — surfaces built for the pane-first world
whose job the Chat and the Works now do die whole, tests with them, zero debt
(D22 r2's precedent: the v2 engine died the same way).

**The referents, pinned (Felix, the blessing 2026-08-30, screenshot in hand —
"it's the CMUX bug: stale NAGGING because cmux says needs input" — then his
correction, verbatim: "I do want to see when there is an agent that's
working, or has input / blocked / but it was specifically the CMUX part I'm
ready to remove"):**

1. **Presence SURVIVES.** The LIVE SESSIONS surface and its signal — an
   agent working, needing input, blocked — stay visible. Their states come
   from the census's own sensors only: `working`, `Stop` → idle (P1 F1's
   real idle sensor, `census.ts:109`), `permission_prompt` → blocked —
   never from the cmux nag.
2. **The cmux part DIES**: the `nagging` class whole — `Waiting = 'blocked'
   | 'nagging'` (`deck-model.ts:869`), where `nagging` is the `idle_prompt`
   `Notification`, the 60-second cmux "waiting for your input" nag
   (`attention.ts:44`) — killed everywhere it renders or ranks.
   **`blocked` (`permission_prompt`) is real attention and survives.**
3. **Stale labels die with it.** A needs-input label must never outlive the
   fact: the 33m/21h NAGGING rows in his screenshot were quiescent
   last-event labels (`census.ts:126`). After the gut, every rendered state
   is one the census's sensors currently support — a label with no living
   evidence renders as what it honestly is (idle / unknown with its age),
   never as a demand for input.

## Inputs — read before working

- The pinned referent list (the Mission — pinned at the blessing, no
  amendment needed).
- D20/D22 (the cmux retreat), C16 F4 (`sid` vs `chat` — a headless step has a
  conversation and no pane; the pattern for what survives), C15 (how a
  surface dies whole: git rm, tests die with it, zero live references).
- The camera (C17) + the fixture city (C19) — every removal is photographed.

## Spec

1. **Delete whole.** Each named surface: code, styles, tests, fixtures die
   together; no stubs, no hidden flags, no "kept just in case" (the best code
   is no code).
2. **Surviving organs untouched.** The City, the Works, the Chat, the queue,
   the shelf's surviving half, census, gauges — whatever the list does not
   name is byte-identical except where a dead surface's removal forces a
   seam cut, and every forced cut is named in findings.
3. **Photograph the before and the after** of every route the gut touches;
   the after shows no hole (adjacent panes absorb the space per the law of
   space — no dead rectangles).

## Done when:

- [ ] Every listed referent gone: grep-proof zero references (source, bundle,
  tests, CSS), each with its before/after shot Read and described.
- [ ] `bun v3/gates.ts --glass` ALL GREEN (dead tests removed, none skipped);
  predecessor probes re-run green or retired WITH the surface they proved
  (a probe of a dead surface dies with it, named in findings).
- [ ] Zero layout holes: every touched route photographed, the space
  reabsorbed; page scroll still 0 px.
- [ ] Budget **0 real turns**.

## Out of scope

- The sidebar rework ("then a bunch of changes with the sidebar" is B24's
  amendment intake, not this charge); anything the pinned list does not name;
  the ⬡ prettifying pass (still DEFERRED).

## Findings

*(append here — evidence-grade)*

## Kill criteria

A listed referent whose removal would take a surviving organ's dependency
with it (a shared module, a census read) → **stop and escalate with the
dependency named** — never partial-delete silently, never stub it.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence,
design laws, agreements; the campaign notes),
and execute the charge at ~/code/agents/belvedere/plans/c21-gut-v1.md.
```
