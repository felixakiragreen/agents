# B7 — the summon composer

**Status:** OPEN · **Depends on:** B4 (hands) · **Staffing:** Builder · opus-high ·
**Batch 3 (amended 2026-08-27):** fifth row, strictly serial after B6, straight to
master
**Spec blessed:** 2026-08-27, Architect, at Felix's ask ("fire-anything" — the
dream's phrase; the rail fires batons, the shelf fires resumes, this fires the
blank page).

## Goal

The rig's panel, in the glass: compose and fire ANY session — new work, new
buildings, ad-hoc sittings — without a terminal in the loop.

## Spec

1. **`/summon` page**: building/cwd (register dropdown + free-path field),
   account (from `summon/accounts.tsv` — explicit choice, no auto-arbitrage in
   v0; the usage strip is beside it, the bill visible), mantle (from
   `summon/presets.tsv` → color + charter path), tier (model × effort), summons
   textarea.
2. **Templates dropdown** filling the textarea with the canon grammar, slots
   ready: one per mantle (`You are a <Mantle> at <tier>.\nWear
   ~/code/agents/canon/mantles/<mantle>.md,\nthen read <context> and <verb>.`),
   plus **founding Architect** (doctrine §12's fenced summons) and the scoped
   inbox-sweep sitting (B6's template). Hardcoded strings, not parsed from canon.
3. **Name-stamp** auto: `<mantle>-<theater>-<NN>` — theater per row-14 semantics
   (target dir's `.summon-theaters` first line, else the dir name); ordinal =
   max existing for that mantle-theater across `hands.jsonl` + live census + 1,
   editable before fire. Collisions are cosmetic (identity is `sid` — P1 F2).
4. **Optional worktree**: repo + branch fields → composes `/hands/worktree` →
   `/hands/fire` with cwd = the worktree path (same composition B3 carries).
5. Fire → `POST /hands/fire` (workspace color set natively, summons as argv —
   B4's recipe). Hands disabled → composer renders read-only with the banner.

## Acceptance criteria / DoD — evidence pasted here at build time

- [ ] A composed fire lands: right account, stamped, colored, summons byte-exact
      as first turn (transcript quoted); probe cleaned up.
- [ ] The founding template fired at a scratch dir starts a session whose first
      turn IS the founding summons for that path.
- [ ] A worktree-composed fire lands with cwd inside the created worktree
      (scratch repo; worktree removed after).
- [ ] Stamp ordinal: two consecutive composed fires increment; an existing rig
      stamp in the census is not double-assigned.
- [ ] Disabled mode honest; zero writes outside the legal set (git status proof).

## Out of scope

- Auto-arbitrage account picking; a guided "new building" flow (parked — the
  founding ritual's Felix-steps stay his); editing presets/accounts (rig ground);
  queueing/scheduling fires (the flow horizon, parked).

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b7-summon-composer.md,
and build the order.
```
