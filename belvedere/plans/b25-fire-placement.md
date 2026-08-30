# B25 — where a fire lands

**Status:** OPEN · **Depends on:** — (chain per the batch-6 note) · **Staffing:** Builder · opus-high ·
**Blessed:** pending (batch-6 blessing)

## Goal

**The fire knows things the census forgets — stop forgetting them.** Two of
Felix's field reports are one class: the engine's fire minted `workspace:115`
instead of landing in his existing `belvedere` workspace (P2's new-workspace
recipe is probe-era law every hand inherited), and `architect-belvedere-04`
shows up housed in `agents` because the census keys a session by cwd alone
(B5 F1's `buildingOf`) while the flow file, the run log, and the stamp all
say belvedere. "The building the work is FOR" and "the directory the session
sits IN" are two facts; today the join knows only the second.

## Inputs — read before building

- ISSUES commits `731bac6` (workspace placement) and `73bdfad` (cwd
  housing); P2 (the recipe), D16 (cmux is truth for identity), B18 (the
  socket read — the join to find "his belvedere workspace" by name), P6 F2 /
  B22's sweep (address by UUID once found), B5 F1 (`buildingOf` — stays the
  fallback), D55 (workspace closure at landing — covers probes, not his
  rearrangements).

## Spec

1. **Building-homed placement (pre-chewed ruling, strike-able at
   blessing).** A fire for a building lands in the workspace Felix keeps for
   it: found by **name** via the socket read, addressed by **uuid** once
   found, **minted only when none exists** — and a minted one is named for
   the building, not `workspace:N`. No per-flow/per-step `workspace` field
   until use proves the need (simplicity; the building names the home the
   way it already names the stamp, B17).
   - Ambiguity never blocks a fire: two workspaces matching the name ⇒ mint
     fresh + record the ambiguity in the audit (placement degrades to
     probe-era behavior, loudly, never a guess between his workspaces —
     D10's spirit).
2. **The fired-for building rides the fire.** The fire records its building
   (the composer and the engine both know it at compose time); the census
   join reads sid → fired-for building, **outranking cwd for glass-fired
   sessions**; hand-fired sessions keep cwd (`buildingOf` unchanged as the
   fallback). This trues every D2 subproject whose sessions work at the
   repo root.
3. **Retirement.** The glass retires only a workspace it **minted** and that
   is **empty at the fire's landing** (D55's scope). A workspace Felix
   rearranged — a panel moved in or out by his hand — is his; never
   auto-retired. The audit records every retire.

## Done when:

Live checks drive real cmux workspaces; every workspace this bar mints is
closed by it (D55), and it never touches a workspace it did not mint.

- [ ] A fire for `agents/belvedere` with a `belvedere`-named workspace
  present lands its panel **in that workspace** (uuid-addressed, audit
  shows the name→uuid resolution), no mint.
- [ ] With no matching workspace: the first fire mints one named for the
  building; a second fire lands in the minted one (no second mint).
- [ ] An induced name collision (two matching workspaces) mints fresh and
  audits the ambiguity; neither existing workspace is touched.
- [ ] A glass-fired session whose cwd is the repo root renders housed under
  its fired-for building on City, Workshop, and queue; a hand-started
  control session in the same cwd still houses by cwd.
- [ ] Retirement: a minted-and-empty workspace is retired at landing
  (audited); a minted workspace Felix moved a panel into is left standing
  (induced, verified).
- [ ] Suite green in one process, offline type gate exit 0, predecessor
  probes re-run green, `/deck/state` p95 within the landed budget.

## Out of scope

- Renaming/rehoming existing sessions retroactively (the census renders what
  the join now knows; history is not rewritten); any cmux quit/relaunch;
  per-step workspace fields.

## Kill criteria

If cmux workspace names prove unstable or unreadable through the socket in a
way that breaks the name→uuid join (B18's read says they are not), **stop and
escalate** — do not invent a fuzzier match. Placement falls back to mint
(today's behavior) in the meantime; attribution (spec §2) lands regardless —
the two halves are severable.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6
and ~/code/agents/belvedere/plans/b25-fire-placement.md,
and build it to its `Done when:`.
```
