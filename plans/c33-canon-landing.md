# C33 — the canon landing

**Status:** OPEN — laid 2026-08-29 · **Depends on:** C28 · **Staffing:** Builder · opus-medium

## Goal

The C28-blessed roster lands in `canon/`: the door and six charters, the two
shims, the README reconciled, the templates updated. Every text is blessed
(D76) and frozen in `lab/c28/` — this charge is transcription and wiring,
not drafting. **Not one word of a blessed text changes in transit.**

## The spec (blessed 2026-08-29, D76 — the sources are law)

Each lab file carries a delta-note header above a `---` separator; **what
lands is everything below the separator, verbatim.**

1. `lab/c28/door-v8.md` → `canon/GUILD.md` — **amended 2026-08-29 at the
   Builder's escalation (GA ruling; both sub-forks were spec defects, not
   blessed content):** exactly two sections land — the door proper
   (`# The Guild`, body byte-identical) and the stanza, its heading
   stripped of the lab parenthetical to bare `## The dispatched stanza`
   (the parenthetical was transit metadata — self-referential inside
   GUILD.md, citing a lab file no canon reader sees; the body lands
   byte-identical). The trailing section (`## The side-quest grant — …
   drafting input for the redrafts`) **drops**: it is the lab-scaffolding
   slot every door draft carried (v6/v7: the delta lists), already
   consumed by the six charters' own Side-quests sections — the original
   drop-clause named the slot by a stale name.
2. `lab/c28/digger-v4.md` → `canon/mantles/digger.md` (overwrites).
3. `lab/c28/architect-v6.md` → `canon/mantles/architect.md` (overwrites).
4. `lab/c28/builder-v2.md` → `canon/mantles/builder.md` (overwrites).
5. `lab/c28/mentat-v2.md` → `canon/mantles/mentat.md` (overwrites).
6. `lab/c28/grand-architect-v3.md` → `canon/mantles/grand-architect.md`
   (overwrites).
7. `lab/c28/fixer-v1.md` → `canon/mantles/fixer.md` (new — the minting).
8. Shims: `canon/skills/fixer/SKILL.md` and `canon/skills/mentat/SKILL.md`,
   minted on the existing shims' exact pattern (read a sibling first —
   `canon/skills/digger/SKILL.md`): point at the charter path, inject
   `${CLAUDE_EFFORT}`, set `disable-model-invocation: true`. The skills
   set is live ×3 — this is a deploy, signed by D76.
9. `canon/mantles/README.md`, three sections only:
   - **The roster**: Fixer gains its charter file (the "no charter file"
     clause dies); offices titled as offices.
   - **Summons grammar**: the interactive form gains the door —
     `Enter by the door — read ~/code/agents/canon/GUILD.md, wear <charter>,
     then …`; the dispatched note: unmantled cheap-tier kickoffs carry the
     stanza inline from GUILD.md's closing section; mantled dispatched
     kickoffs carry the door read in path form.
   - **The charter template**: replace the old order with the C28 pattern —
     mission paragraph · **Staffing** · **The summons** (the shared
     paragraph, byte-identical across charters — a lint surface) · the
     role's own law sections · Side-quests (where granted) · escalation /
     the contract's edges · End of session · **Forbidden** (minimal, every
     seat with its reason) · Summons (with the door). No epigraph.
10. `canon/work/DOCTRINE.md` §12 founding kickoff: gains the door clause
    (the one fenced summons in that section).
11. `MAP.md` §3 roster note: the Fixer line's "no charter file" phrasing
    updated — charter minted at C28.

## Done when:

- The eight canon files present, each byte-identical to its lab source
  below the separator (diff evidence pasted per file — a claim without
  evidence is a draft) — GUILD.md's narrower bar per amended item 1: door
  body and stanza body byte-identical, stanza heading bare, third section
  absent.
- `doctrine lint ~/code/agents` → 0 (output pasted).
- `sync/check` run; if the new shims are not live ×3, that step is
  Felix-run by design (D14) — report it PENDING his `sync/deploy`, never
  run deploy yourself.
- README's three sections and DOCTRINE §12 updated; nothing else in either
  file touched.
- Board reconciled: this charge's row current; C28's hold cleared on the
  row.

## Out of scope

Any wording change to any blessed text. The purge (C34). The old lab
files (they stay — provenance). Belvedere. The outer city.

## Findings

*(append here)*

---

```
You are a Builder at opus-medium.
Enter by the door — read ~/code/agents/lab/c28/door-v8.md (the door is not
landed yet; you are landing it — enter by its lab path this once),
wear ~/code/agents/canon/mantles/builder.md,
then read plans/c33-canon-landing.md and build it to its bar.
```
