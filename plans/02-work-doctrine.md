# 02 — The Work Doctrine

**Mantle · Tier:** Architect · fable-max · **Gate:** keel (LANDED); soft interlock with
01 · **Status:** **LANDED** 2026-08-03 → `canon/work/`

## Mission

Canonize how work is represented in ANY project — the doc pattern that lets sessions
start cold in two minutes, agents run in parallel without collisions, and truth survive
every context wipe. Distill it from the two proven implementations; do not invent
ceremony they didn't need.

## Inputs — read before designing

1. `GENESIS.md`.
2. **hexwright** (`~/code/hexwright/`): `CLAUDE.md` (session protocol + workflow laws),
   `GENESIS.md` (master-architecture pattern), `initial.md` (immutable origin-vision
   pattern), `LEDGER.md` (per-session append: date · role · changed · decided · next),
   `DECISIONS.md` (D-entries), `plans/` (work orders with acceptance criteria,
   out-of-scope lists, named Builder model+effort).
3. **simmy** (`~/code/universal_robots_sdk/cap-mega/simmy/`): `README.md` — the board
   (§6: rows with question/depends-on/session/status), working agreements (§8), test of
   statuses (OPEN → IN FLIGHT → LANDED / KILLED; documented kill = win), docs vs spikes
   vs lab split; `spikes/*.md` — brief anatomy (mission, kill criteria, kickoff verbatim,
   findings appended under the brief, evidence-grade: every claim carries the command
   and output that proved it); `spikes/BULLETIN.md` — the mid-flight wire between
   parallel agents; batch reports (DISPATCHER.md §7).

## Questions to settle

1. **The canonical file set.** GENESIS / LEDGER / DECISIONS / board / briefs / orders /
   bulletin / findings — which are mandatory, which scale in with project size? A
   weekend spike repo should not need seven files (Simplicity Above All).
2. **Board format.** Simmy's table won in practice. Canonize columns (id · question ·
   depends-on · staffing · status) and where the board lives (README vs GENESIS vs
   BOARD.md).
3. **Brief vs work order.** Two genres or one template with two flavors? (Digger runs
   briefs: questions + kill criteria. Builder runs orders: blessed spec + measurable
   DoD + out-of-scope fence.) Define both anatomies.
4. **Status vocabulary.** OPEN / IN FLIGHT / LANDED / KILLED / BLOCKED / PENDING — plus
   the working verbs (blessed, ratified, minted, parked, trued). Write the glossary;
   kill any synonym that adds nothing.
5. **Findings law.** Evidence-grade appends under the brief (simmy's forensic standard).
   Where do findings live for Builders (commits + order's DoD checklist?)?
6. **LEDGER and DECISIONS.** Formats are proven — ratify them, define entry shapes.
7. **The bulletin.** Only exists during parallel batches — canonize when it's created,
   who writes (agents append, Dispatcher commits), when it's archived.
8. **Project genesis ritual.** How a NEW project bootstraps onto the doctrine — a
   Grand Architect / Architect summons in an empty repo, seeded from templates. Make
   starting a project a two-minute act.
9. **Templates.** `canon/work/` — DOCTRINE.md (the law) + skeleton templates (board,
   brief, order, ledger, decisions). Referenced by projects, not deployed to accounts
   (per GENESIS §4) — confirm or overturn.
10. **This repo's own docs.** Amend keel docs to conform (D6 allows it) — the canon
    repo must be example #1 of its own doctrine.

## Out of scope

- Charter content, tier grammar, summons → **01** (if you need its vocabulary and it
  hasn't landed, use GENESIS §3's and flag the interlock; if it has landed, conform).
- Global CLAUDE.md → **03**. Sync → **04**. Retrofits (D5) — but DO note, without
  executing, what hexwright/simmy migration would touch (v2 seed list).

## Deliverables

- `canon/work/DOCTRINE.md` + skeleton templates.
- `DECISIONS.md` appended; `GENESIS.md` board updated; `LEDGER.md` appended.
- This repo's docs conformed to the doctrine (or a bounded follow-up order).

## Dispatched mode (batch 2)

This brief runs dispatched (rider: `plans/RIDER.md`). New D-entries land marked
**"(proposed — pending Felix countersign)"**; the tending session escalates them to
Felix before 03 dispatches. End-of-session protocol unchanged: board trued, ledger
appended, commits in Felix's git style.

## Kickoff (verbatim)

```
You are an Architect at fable-max. Wear ~/code/agents/canon/mantles/architect.md, then
read GENESIS.md and plans/02-work-doctrine.md, and execute the brief.
```

## Findings (2026-08-03)

The doctrine itself is the deliverable — `canon/work/DOCTRINE.md` + six templates,
D16–D23 (proposed). Below: the calls that sharpened or departed from the sources, and
the v2 seed list the brief requires. Questions 1–10 all settled; none escalated.

1. **Board column is "Work", not the brief's suggested "question".** Evidence: simmy's
   own board holds builder rows under its Question header — B1 reads "Mega/harness
   simmy-enablers: PathResolver contexts, gateway guard, `--timings`" (simmy README §6),
   which is no question. Mixed boards need the neutral noun; briefs keep questions
   inside the doc.
2. **BOARD.md rejected.** Neither parent ever minted one — hexwright boards in GENESIS
   (§6 roadmap), simmy in README §6. A separate file is one more hop on every cold
   start, against §1's two-minute law.
3. **Ledger optional at pure spike-board scale only.** Simmy ran a 10+ session parallel
   campaign with no ledger — board + findings carried all state. The ledger earns its
   keep when sessions do work no single work doc captures; exhibit: this repo's
   04-Stage-A ledger entries, which no brief could hold. Boundary codified in §7.
4. **CLAUDE.md state digests warned against.** hexwright's CLAUDE.md §State has grown
   into a dense restatement of WO outcomes — a second home for truth (rot risk, against
   one-function-one-home). Doctrine §3: pointers, not digests.
5. **Probes-ship-with-a-control promoted to law** (§6.2). The 04 spike produced two
   false negatives caught only by control arms — F6 (dirname≠name skill silently
   ignored) and F11 (keybindings probe void: even a regular malformed file raises no
   error) — LEDGER 2026-08-03; flagged for 02 by the Grand Architect same entry.
6. **The decision queue is not a file.** Simmy's /helm was cap-mega machinery, not
   doctrine. The queue = proposed-uncountersigned D-entries + open escalations,
   surfaced at every boundary (§8). No new artifact minted.
7. **Bulletin archives by fold, not ceremony.** Simmy's bulletin was never pruned and
   never hurt — entries go stale-but-harmless once the Architect folds findings
   (spikes/BULLETIN.md spans batches 2–3 unarchived). §9 codifies append-only for the
   campaign's life.
8. **Working agreements deduplicated to project physics.** Simmy §8 mixed universal law
   (evidence grade, kill-fast, bulletin protocol) with venue rules. The universal parts
   are now doctrine/charter law; master-doc agreements hold only physics (§3) — one
   home per rule.

**v2 seed list — what retrofitting the parents would touch (noted, not executed; D5):**

- **hexwright:** local role names → mantle summons (its Grand Architect → the project's
  Architect; Area Architect → per-area Architect); D7's "Fable @ max" vocabulary → tier
  names (`fable-max`); WOs gain kickoff-verbatim footers, Findings sections, and status
  vocabulary (DONE → LANDED); GENESIS §6 roadmap + CLAUDE.md §State → a board table
  with §State pruned to pointers; LEDGER/DECISIONS conform as-is (they are ancestors).
- **simmy:** board Session column → Staffing with canonical tier names ("Fable · high"
  → `fable-high`, "Opus · med" → `opus-medium`); DISPATCHER.md retired for
  `canon/mantles/dispatcher.md` + an instantiated rider; README §6's role-system
  paragraph → mantle pointers; §8 agreements deduped to physics; spike briefs and
  BULLETIN.md conform as-is (they are ancestors).
