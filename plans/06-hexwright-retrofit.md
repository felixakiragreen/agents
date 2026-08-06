# 06 — hexwright retrofit

**Status:** OPEN · **Depends on:** D32 countersign · **Staffing:** Architect · fable-high ·
**Blessed:** D32 (the keel's touch map) — execute only once D32 carries ✓ Felix

## Goal

hexwright's live doc surfaces speak canon — mantles by path, canonical tier names,
doctrine vocabulary, a board — with zero change to project physics (the art canon law,
determinism, Felikai, aphantasia/show-don't-describe) and zero rewriting of history.
An order run by the project's Architect: the conformance pass is board-truing work.

## Inputs — read before working

- `~/code/agents/canon/work/DOCTRINE.md` + `canon/mantles/README.md` + `architect.md`.
- hexwright: `CLAUDE.md`, `GENESIS.md` (§6, §7 especially), `LEDGER.md` tail, `DECISIONS.md`.
- Known, do not re-derive (keel recon, 2026-08-06): repo quiet on clean `master`;
  WO-001–004 all landed; **Felix's Phase-1 acceptance ruling is PENDING** (he breeds in
  the Greenhouse and rules); the next planned session was hexwright's local "Grand
  Architect" for Phase 2/3 — the retrofit slots exactly at that boundary, replacing the
  local title. No `.claude/` dir exists — no tier surface, pure doc surgery.
- **Felix's ruling (keel Q&A, 2026-08-06): both local titles retire.** "Grand Architect"
  leaves hexwright's vocabulary (reserved for the canon-keeper); its duties fall to the
  project's **Architect**. "Area Architect" retires as a title — an Architect session
  scoped to an area (canon absorbed the area split as DOCTRINE §3 plans-subdivision).
  Builder maps to Builder. One-off fixes: the null mantle (mantles README).

## Spec — the touch map

1. **`CLAUDE.md` — Session Protocol.** Roles line → canon: sessions wear canon mantles by
   Felix's summons (`~/code/agents/canon/mantles/`) — Architect, Builder; bare session
   for one-offs per the null-mantle law. Models line → tier names: keep D7's *policy*
   (Felix's: quality over credits), restate its vocabulary — "Fable @ max" → `fable-max`,
   per-WO Builder tiers named canonically. Ledger line: "date · role · …" → "date ·
   mantle · …". **Policy stays, vocabulary converts** — if the session or Felix wants the
   staffing policy itself converged to canon's default (fable-high, max when the board
   says), that is a separate hexwright D-entry with his countersign; do not fold it in
   silently.
2. **`CLAUDE.md` — Session Workflow.** The break-suggestion / kickoff-handoff /
   clean-boundary lines are now DOCTRINE §11 (hexwright is the cited birthplace) —
   compress to one pointer line. **"Keep the joy" stays verbatim** — taste, not law.
3. **`CLAUDE.md` — §State.** The WO-outcome digest dies (02's findings flagged it as a
   second home for truth): replace with pointers — phase one-liner, board (GENESIS §6),
   ledger tail. **The version law moves up to Hard Laws** — it is live project physics,
   not state. Repo line stays. Target ≤ ~60 lines total.
4. **`GENESIS.md` §7 — the session system.** Rewrite: roles → canon mantles by path +
   null mantle; artifacts list → DOCTRINE pointer plus what is genuinely hexwright's
   (areas = `plans/<area>/`, the art-canon sign-off law, D7 staffing policy in canon
   vocabulary). **The stigmergy paragraph stays** — it is the metaphor's birthplace
   (D31 descends from it). "GENESIS amended only in Grand Architect sessions" →
   "amended in Architect sessions".
5. **`GENESIS.md` §6 — mint the board.** Canonical columns (ID · Work · Depends on ·
   Staffing · Status, DOCTRINE §4) at the head of §6: WO-001–004 as LANDED rows with
   dates and `plans/core/` pointers, staffing retro-labeled in canon vocabulary
   (e.g. `Builder · opus-high`). Record **PENDING: Felix's Phase-1 ruling** as the named
   external precondition. Phase 2/3 items are NOT cut as rows — the next Architect
   session cuts them; the roadmap prose stays below the board as the plan.
6. **History conforms as-is.** `plans/core/*`, `LEDGER.md`, `DECISIONS.md`, `initial.md`
   untouched. Authorial/historical mentions of the old titles stay (GENESIS header
   credit, §5's "the Grand Architect will die on this hill" flavor — the session may
   convert the §5 line to "the Architect" if it reads as live voice; its call, note it).
7. **hexwright D-entry (D9).** The retrofit ratification: canon mantles govern; both
   local titles retired (Felix, 2026-08-06, v2 keel); tier names canonical; board
   minted; D7's policy restated, not changed. Felix countersigns in-session.
8. **`LEDGER.md` appended** (date · mantle · changed · decided · next), committed in
   Felix's git style.

## Acceptance criteria — the DoD

- [ ] Role-defining surfaces (`CLAUDE.md`, GENESIS §6/§7) carry no "Grand Architect" /
  "Area Architect" / "Fable @ max"-style vocabulary — grep evidence pasted here;
  historical/authorial mentions exempt and listed.
- [ ] Board exists in GENESIS §6: canonical columns, WO-001–004 LANDED, Phase-1 ruling
  recorded PENDING.
- [ ] `CLAUDE.md` ≤ ~60 lines; §State digest replaced by pointers; version law present
  under Hard Laws.
- [ ] Canon untouched: `git -C ~/code/agents status` clean, pasted.
- [ ] hexwright D9 cut with Felix's countersign recorded; ledger appended; committed.
- [ ] Cold-boot check narrated in findings: DOCTRINE §2's cold-session questions each
  answerable from the new surfaces.

## Out of scope

- Phase 2/3 planning or cutting rows for it — the next Architect session's job.
- Editing closed WOs, ledger history, existing D-entries, `initial.md`.
- Renaming hexwright's `canon/` dir (the ART canon — unambiguous in-repo).
- Any code, goldens, or Greenhouse changes; any edit to the agents repo (canon gaps
  are escalations to the Grand Architect — the harvest queue, never a local patch).

## Findings

*(append here — evidence-grade)*

---

**Kickoff (verbatim):**

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then, working in ~/code/hexwright, read ~/code/agents/canon/work/DOCTRINE.md,
~/code/agents/canon/mantles/README.md, ~/code/agents/plans/06-hexwright-retrofit.md,
and hexwright's CLAUDE.md, GENESIS.md, DECISIONS.md + LEDGER tail,
and execute the retrofit to its DoD.
```
