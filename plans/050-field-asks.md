# 050 — doctrine v1.5: the field's asks

**Status:** OPEN — laid 2026-09-15 · **Depends on:** — · **Staffing:** Builder · opus-high · **Parallel-safe with:** 051 · **Blessed:** Felix, 2026-09-15, in the room (grand-architect-26): ⬢1

## Mission

The parser's third opening: nine typed asks the field filed between 2026-09-09 and 2026-09-15, each law in the canon since the sweep of 2026-09-15 and unread by `doctrine/`. When this lands, `doctrine/` reads the ⬢ mark, a gate doc's batch slot, typed holds and escalations, the two header slots, a gate's readiness on a kill, a dated deferred list with its horizon and its drop lint, a ledger cap that counts prose, and a building's `WORDS.md`; and `migrate` carries the two respelled formulas. The form is 049's: every item a fixture and its control, dry runs only outside this building.

## Inputs — read before working

- The law each item builds: `canon/work/DOCTRINE.md` §3 (the WORDS.md law), §4 (Depends-on, the deferred list), §7 (the cap), §8 (the register), §10 (the tender line); `canon/work/STANDARD.md` §1 (the magnitude), §7 (⬢), §8 (formulas 8 and 26); `DECISIONS.md` D89, D90.
- `plans/032-flow-grammar.md` §Spec — the D74 tokens (holds, E-ids, Branch, encapsulation) as specified before the charge was killed; the spec stands, the flow it served died.
- `plans/049-residue.md` — the pattern: fixture + control per item, the pre-charge tree as the control's red, `--summary` for the reader; its F1–F8 bind this charge.
- `doctrine/README.md`; `doctrine/src/grammar.ts` (`BLESSED_MARK`, `CREDIT_MARK`, `MARK_TAIL`); `doctrine/src/parse.ts` (the register's queue, the deferred list, the ledger cap); `doctrine/src/lexicon.ts` (the pinned formulas — 8 and 26 already respelled there); `doctrine/src/respell.ts`.
- stigmergon `plans/086-works-sitting.md` §Canon asks and `docs/works.md` §2 — the engine's reading of the batch slot and the tender line; stigmergon `WORDS.md` — the register the lexicon arm reads; stigmergon `plans/G23-harness-hygiene.md` §Findings — the deferred drop the lint must catch (ten live entries swept out at `6adac11`).
- Known, do not re-derive: a ⬢-marked entry with Felix as decider already stays out of the queue by his name (`parse.ts`, the queue filter); the vocabulary arm is warn-only (STANDARD §8, the enforcement contract); `canon/` is fenced from the vocabulary arm; the ledger cap is a warning (041).

## Spec

Each item lands with a fixture under `doctrine/fixtures/` and a control that reds on the pre-050 source; the suite grows; `doctrine lint` over the register's buildings reads identical before and after except where an item names its change.

1. **The ⬢ mark** (D90). `MARK_TAIL` and the attribution parse read `⬢‹n›` with an optional date: n ≥ 1 is a blessing (`blessed`), n < 1 a credit on the statement, dated as a `⬡ go` is; the magnitude is typed on the decision (`magnitude?: number`) and `boot` prints it beside the mark. `⬡✓` and `⬡ go` parse as before; nothing respells.
2. **The batch slot.** A gate doc's header gains `**Batch:** ‹shape› · ceiling ‹n› · gauge ‹text› · account ‹name›` — shape one of serial · parallel; the members are the gate's Depends-on (the edge test, §4); the tender line stays its own field, and `tender: the dispatch` parses as the engine's. Typed on the charge header; the engine reads it through `parse --json`. The doctrine's §4 and §5 text follows at the landing, pasted by the office under this charge's grant (048's pattern).
3. **Typed holds and escalations** (032 §Spec): `LANDED ‹date› — holds: ‹list›` parses each hold as an `E‹n›` or a `⬡ ‹text›`; `E‹n› — ‹what›` and `E‹n› ruled ‹date›` are typed; a dependent charge whose dependency carries an unresolved hold is not ignitable.
4. **The header slots** `Parallel-safe with:` and `Branch: ‹name› from ‹base›`, typed on the charge header (§5's skeleton names both).
5. **A gate's readiness** (§4): a review gate is ignitable when each Depends-on is LANDED or KILLED; every other charge waits on LANDED.
6. **The deferred list** (§4): each entry's day derived from `git blame` (the line's first commit day); the building's horizon read from its master doc (`The deferral horizon`; thirty days when unnamed); `boot`'s count line says how many stand past it; lint warns (`board.deferred-drop`) when the deferred count falls between two commits and the ledger entry of that span names neither `promoted` nor `deleted`.
7. **The ledger cap** (§7): `ledger.entry-cap` counts the entry's prose — fenced blocks and the baton paragraph excluded.
8. **The lexicon arm reads `WORDS.md`** (§3): a building's register in the standard's form — its graveyard rows join §9's for that building, its entries are the building's local kinds; the arm walks `docs/` as well as the law surfaces; a re-mint of the building's own dead word warns.
9. **Formulas 8 and 26 by the converter** (D81): a `migrate` rule — `Ambiguity, never plurality, is the sin.` → `Ambiguity, not plurality, is the sin.`; `History is respelled, never rewritten.` → `History is respelled, not rewritten.` — run over this building, history included; every other building at its next Architect session.

## Done when:

- `bun test` in `doctrine/` green, the suite larger than the pre-050 count by at least nine; each new fixture's control reds on the pre-050 source (name the sha).
- `doctrine lint` over every register building: identical before and after except the intended (item 6's new warning class; item 7's count falling at golos and swordmaster) — both runs pasted.
- `doctrine boot .` prints D89's and D90's marks as `⬢100` and `⬢10`, the queue 0.
- `doctrine migrate --summary .` then `--write` for item 9: the two old strings gone from this building's surfaces, history included, and the run a fixed point on a second pass; dry runs only elsewhere.
- Findings F1–Fn under this doc; `doctrine/README.md` current.

## Out of scope

- The engine's own `--json-schema` — stigmergon's; the coda's report vocabulary is law there to adopt.
- Any prose sweep — 051's; an absolutes lint arm — after 051 shows the pattern.
- Writing into any building but this one.

## Lanes

Red: none inside.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and execute the charge at ~/code/agents/plans/050-field-asks.md.
```
