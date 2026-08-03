# 02 — The Work Doctrine

**Mantle · Tier:** Architect · fable-max · **Gate:** keel (LANDED); soft interlock with
01 · **Status:** OPEN

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
