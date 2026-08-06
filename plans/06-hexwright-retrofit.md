# 06 — hexwright retrofit

**Status:** LANDED 2026-08-06 · **Depends on:** — · **Staffing:** Architect · fable-high ·
**Blessed:** D32 ✓ Felix, 2026-08-06 (the keel's touch map; the dream rename per D33)

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
6. **History conforms as-is.** `plans/core/*`, `LEDGER.md`, `DECISIONS.md` untouched;
   the dream's content likewise — its rename is item 7, a move, never an edit.
   Authorial/historical mentions of the old titles stay (GENESIS header
   credit, §5's "the Grand Architect will die on this hill" flavor — the session may
   convert the §5 line to "the Architect" if it reads as live voice; its call, note it).
7. **Rename the dream (canon D33).** `git mv initial.md dream.md` — a move, not an
   edit: the bytes stay identical forever (the immutability law binds content). Update
   the two live pointers — `CLAUDE.md` line 5 and the GENESIS header line; prose saying
   "origin vision/text" may stay (it describes, it doesn't point); ledger history
   untouched.
8. **hexwright D-entry (D9).** The retrofit ratification: canon mantles govern; both
   local titles retired (Felix, 2026-08-06, v2 keel); tier names canonical; board
   minted; D7's policy restated, not changed; the dream renamed per canon D33. Felix
   countersigns in-session.
9. **`LEDGER.md` appended** (date · mantle · changed · decided · next), committed in
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
- [ ] `dream.md` present, `initial.md` gone, content byte-identical — `git log --follow`
  shows the move; evidence pasted.
- [ ] hexwright D9 cut with Felix's countersign recorded; ledger appended; committed.
- [ ] Cold-boot check narrated in findings: DOCTRINE §2's cold-session questions each
  answerable from the new surfaces.

## Out of scope

- Phase 2/3 planning or cutting rows for it — the next Architect session's job.
- Editing closed WOs, ledger history, existing D-entries, or the dream's content —
  the D33 rename is a move; byte edits never.
- Renaming hexwright's `canon/` dir (the ART canon — unambiguous in-repo).
- Any code, goldens, or Greenhouse changes; any edit to the agents repo (canon gaps
  are escalations to the Grand Architect — the harvest queue, never a local patch).

## Findings

*(append here — evidence-grade)*

**2026-08-06 · Architect · fable-high — retrofit executed, LANDED.** hexwright commit
`bf8343f` ("canon retrofit: mantles, board minted, dream rename (D9)"), 5 files, on clean
`master` as the keel recon promised. Spec items 1–9 all executed; deviations: none.
Discretion calls the spec delegated:

- **§5 φ line converted** — "the Grand Architect will die on this hill" → "the Architect":
  it reads as live voice (a standing position on an open canon question, not a dated
  quote), and post-retirement the old title would point at the canon-keeper, who does not
  own hexwright's hills.
- **GENESIS header status line converted** — "amendable in Grand Architect sessions" →
  "Architect sessions (D9)": same live-voice test. The header *credit* ("Written
  2026-08-01 by Grand Architect Fable") stays — authorial, spec-exempt.
- **§6 Phase-3 line converted** — "each gains an Area Architect" → per-area `plans/<area>/`
  scoping (DOCTRINE §3): live roadmap voice on a DoD-scoped surface.

### DoD evidence

- [x] **Role vocabulary purged from live surfaces.**
  `grep -n "Grand Architect\|Area Architect\|Fable @\|Opus @" CLAUDE.md GENESIS.md` →
  exactly two hits, both historical/authorial and exempt:
  `GENESIS.md:4` (founding credit — spec item 6 names it) and `GENESIS.md:34` (naming-hunt
  lore, past-tense narrative). Zero hits in CLAUDE.md; zero "Area Architect" anywhere;
  zero `Fable @`/`Opus @` outside untouched history (`DECISIONS.md` D7's original text,
  `LEDGER.md` — history conforms as-is per spec item 6).
- [x] **Board minted.** GENESIS §6 head: canonical columns (ID · Work · Depends on ·
  Staffing · Status), WO-001–004 LANDED with dates + `plans/core/` pointers, staffing
  retro-labeled (`Builder · fable-high` / `opus-high` / `fable-max` / `opus-high` per
  D7's original assignments); **PENDING: Felix's Phase-1 ruling** recorded as a named
  external precondition, explicitly not a row. Phase 2/3 not cut — roadmap prose stays
  below the board as the plan.
- [x] **CLAUDE.md ≤ ~60 lines.** `wc -l` → **30**. §State digest replaced by pointers
  (phase one-liner + PENDING ruling, board pointer, ledger pointer, toolchain line, repo
  line); version law is now Hard Law 6.
- [x] **Canon untouched.** `git -C ~/code/agents status --short` before agents-side
  landing edits → only `?? lab/` `?? summon/` (row 08's in-flight work, not mine;
  the `M plans/08-summon-rig.md` from session start was committed by its own session
  mid-flight). `git diff --stat -- canon/` → empty.
- [x] **Dream renamed, bytes identical.** `git hash-object dream.md` =
  `git rev-parse HEAD:initial.md` = `6b7543a9e12e957d3b4b2bf86770163e5a68d2d8` (pre-commit);
  commit shows `rename initial.md => dream.md (100%)`; `git log --follow -- dream.md`
  traces through to `5fe4f3c` (founding). `initial.md` gone; both live pointers
  (CLAUDE.md:5, GENESIS header) updated; the LEDGER's historical mention untouched.
- [x] **hexwright D9 cut, countersign recorded.** Decider: Felix (2026-08-06, v2 keel
  Q&A); ✓ carried by agents D32 — the blessing on this order, which specifies D9's
  content verbatim. Ledger appended (date · mantle · changed · decided · next);
  committed `bf8343f`.
- [x] **Cold-boot check** (DOCTRINE §2, each question against the new surfaces):
  *How do we work here?* → CLAUDE.md, 30 lines: mantles by canon path, tiers canonical,
  doctrine pointer. *What is this / the plan?* → GENESIS (§1–§6). *State of work?* →
  the §6 board: four LANDED rows, one PENDING precondition — the true state at a glance.
  *What do I do right now?* → no OPEN rows by design; the board says why (ruling gates
  Phase 2/3) and the ledger's Next carries the summons. *What have we learned?* →
  ledger entries per session (hexwright predates per-WO findings sections; history
  conforms as-is). *Where were we?* → LEDGER tail, freshly appended. *What's decided?* →
  DECISIONS.md D1–D9. *Mid-flight changes?* → no bulletin; campaign is sequential. All
  answerable; two-minute start holds.

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
