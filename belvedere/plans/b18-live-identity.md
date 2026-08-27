# B18 — live identity (D16)

**Status:** OPEN · **Depends on:** B15 · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel, ✓ Felix 2026-08-27; this order applies §7 (D16)
and D18 write class 2.

## Goal

cmux becomes the one truth for live names and colors: the deck reads them off
the socket, rename/recolor in Belvedere write through to cmux, a cmux-side
rename shows up in the deck, and the felikai↔cmux color map ends the
refused-color fire deaths. The field report's drift class — wrong stamp
shown, not-green, rename invisible, dead jump — is closed or precisely named
here.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §7; D16 + D18 (README §7); D9/D10 (the
  password admits; ambiguity never arms).
- P2 §A (socket access, the schema enumeration route); B4's hands (audit
  law, the socket call wrapper — extend, don't fork).
- B3 F1 (refused colors killed fires — the map's reason); Felix's
  felikai↔ANSI table (ISSUES → keel §7 fold): green/green, yellow/yellow,
  red/red, purple/magenta, blue/cyan, orange/blue — the glass-side map
  targets **cmux's accepted color vocabulary**, measured, not assumed.
- The field report's jump incident: "focused 01996229-…" reported ok, no
  visible effect — a hypothesis until reproduced (verdict law).

## Spec

1. **The socket-read source.** The server polls cmux over the socket
   (password from the env file, D9) for workspace/pane identity — names,
   colors, surface ids — into `/deck/state`. Census `session_id` stays the
   join key; the rig stamp becomes the **birth name**, shown as subtitle
   where it differs from the live cmux name. Poll cadence ≤ the deck's
   state poll; failures degrade honestly (identity marked stale, never
   guessed — D10's family).
2. **Write-through hands.** `POST /hands/rename` and `POST /hands/recolor`
   — credential-gated, audited like every hand (D18 class 2), targeting by
   session/surface join; refused values fail loudly with the reason on the
   card. Controls live in the session tooltips (City, Workshop) — rename
   inline, recolor from a swatch row of the *measured* legal vocabulary.
3. **The color map.** One module: felikai intent → cmux accepted value,
   derived by enumerating what the socket accepts (measure once, commit the
   table with its evidence); `/hands/fire` consumes it so a composed fire
   never dies on a refused color again (B3 F1 closed at the cause).
4. **The jump, reproduced.** With socket identity in hand, reproduce the
   dead jump-to-panel: fire a probe, jump to it from the deck, observe.
   Fix it if the cause is the glass's (wrong id class, workspace-vs-panel,
   stale surface) — or file the exact mechanism if it is cmux's, with the
   repro script in `lab/b18/`.

## Acceptance criteria — the DoD

- [ ] Rename a probe session **in cmux** → the deck shows the new name
  within one poll (timestamps pasted); the birth stamp renders as subtitle.
- [ ] Rename from the deck → `cmux` reports the new name (socket read
  pasted) and the pane title reflects it.
- [ ] Recolor from the deck → visible cmux color change; a deliberately
  illegal color refused loudly with the reason (audit line pasted).
- [ ] The map: every felikai intent in Felix's table resolves to a
  measured-accepted cmux value; a composed fire with each intent survives
  (no B3 F1 deaths; audit lines pasted).
- [ ] The jump: reproduced against a live probe — fixed with evidence, or
  the mechanism named with the repro script (either closes the item;
  silence does not).
- [ ] Identity degradation: socket down (kill a poll) → deck marks identity
  stale, invents nothing.
- [ ] Suite green one process; type gate exit 0; probe workspaces closed
  (D55).

## Out of scope

- Message delivery (P6/B16); any cmux *setting* change — display state
  only; the stamp/theater derivation fix (B17's composer).

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b18-live-identity.md,
and build it to its DoD.
```
