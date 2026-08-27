# B17 — the composer in Action + live usage

**Status:** OPEN · **Depends on:** B10 · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel, ✓ Felix 2026-08-27; this order applies §3 (Action
at rest) + the field report's composer items.

## Goal

The Action pane at rest is the summon composer, whole: every knob live —
mantle, tier, account, directory, theater (customizable), increment — the
summons text updating as knobs move, mantle colors on the pickers, the stamp
derived from the chosen building (never the cwd), and **usage live in
place** — a fetched number, never a 391-minute-old log.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §3; B13's seam (Action content contribution);
  B18's color map (picker swatches use it).
- v0 `composer.ts` / `trust.ts` / `summon.ts` — the compose/parseFire/trust
  logic ports; the PAGE dies later, the logic lives.
- The field report items 1–2 (live preview, mantle colors), 4–5 (venue +
  stamp: `architect-agents-03` where `architect-belvedere-02` was meant —
  the theater must follow the chosen building/board, with row 14's
  `.summon-theaters` convention as the vocabulary), B7 F3/F4 (slug law, the
  census as third stamp source, the `known` list the rail never passed —
  close it here).
- Canon row 10's usage fetcher: OAuth endpoint, keychain service =
  `sha256(config dir)[:8]` — the proven mechanism the rig uses; the deck
  fetches with the same discipline.

## Spec

1. **The tenant.** Composer registers as Action-at-rest content (minimal =
   one line + fire affordance state; typical = the knob set; expanded = +
   templates + trust verdict + usage detail). Inert-until-composed stands:
   the fire button arms only on a resolved compose (parseFire, D10 — v0's
   law carried).
2. **Live preview.** Every knob change re-renders the summons text and the
   resolved plan (stamp, color, cwd, worktree, trust verdict) client-side
   from the same resolution logic the server fires with — one logic, bundled
   both sides or round-tripped; never two copies drifting (pick the
   mechanism, name it).
3. **The stamp follows the building.** Theater = the chosen
   building/board's name (belvedere work at `~/code/agents` stamps
   `…-belvedere-NN`), honoring `.summon-theaters` where present; the
   increment previews from all three stamp sources (logs + census — B7 F4's
   `known` list finally passed). The cwd stays the venue; it stops naming
   the work.
4. **Usage, live.** One module: per-account OAuth usage fetch (row 10's
   mechanism), cached ≤60 s with age printed, fetch-on-expand; failures
   render stale-with-age, never invent (D10 family). Rendered beside the
   account picker (the standing law: usage wherever accounts are chosen)
   and available to the Works' arm bill (B11 consumes this module).
5. **Mantle colors** on the mantle picker via B18's map; legends where color
   carries meaning.

## Acceptance criteria — the DoD

- [ ] Knob → preview: changing effort/mantle/account updates the summons
  text and plan without a reload (DOM evidence, three knobs); the fired
  bytes ≡ the previewed bytes (sha both sides — the campaign's signature
  proof).
- [ ] A compose for belvedere work at `~/code/agents` previews and fires
  stamp `…-belvedere-NN` (transcript + census evidence); the ordinal
  respects all three sources (induce a census-only name — B7 F4's case —
  and see it skipped).
- [ ] Usage: the number matches the rig's own `_summon_usage_delta` at one
  instant ×3 accounts (B5's bar, now against a fetch the deck made itself);
  age prints; a blocked fetch renders stale-with-age.
- [ ] One live fire through the whole path (haiku-low, `~/code/agents`,
  workspace closed) — byte-exact, colored per the map, named per the
  building.
- [ ] Suite green one process; type gate exit 0.

## Out of scope

- Sending to sessions (B16); template editing; any rig/`presets.tsv` change
  (the rig is canon's — needs there ride the canon inbox at the gate).

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b17-composer-usage.md,
and build it to its DoD.
```
