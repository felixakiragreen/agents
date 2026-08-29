# C32 — the flow grammar

**Status:** OPEN — laid 2026-08-29 · **Depends on:** C31 · **Staffing:** Builder · opus-high ·
**Blessed:** D73 + D74 ⬡✓ Felix 2026-08-29, in-session (GA-15) — the gate is paid.

## Mission

D74 built: the flow fold's fields and tokens enter `doctrine/` — parser, lint arms,
migrate rules, fixtures — and the heuristics they exist to retire are retired. When
this lands, the seven things the glass derives by regex today are typed by the one
parser, and the holder of every baton is read, never inferred.

## Inputs — read before working (do not re-derive)

- The contract: the Spec below restates D74 whole, one token per clause (the
  register was purged at C34 — git holds the original entries); the living law is
  DOCTRINE §10 (the flow) and §§4/8 (the grammar this extends).
- [plans/17-storage-experiment.md](17-storage-experiment.md) §C3 — the scorecard: 7/9
  asks are render-side heuristics today; the live holder-inversion repro (this repo's
  own tail read `holder: "session"` under a Next opening "**Felix countersigns
  D68–D70**").
- [belvedere/plans/b3-baton-rail.md](../belvedere/plans/b3-baton-rail.md) §§E2/F4/F5 —
  the inversion mechanism, the missing `kind`, the branch-from-prose 0/62 result.
- [belvedere/plans/b12-flow-reactive.md](../belvedere/plans/b12-flow-reactive.md)
  §§F1/F2 — the 120-of-390 classifier this grammar retires, and the
  step-with-no-row landing law.
- DOCTRINE §§4/5/11 and STANDARD §§2/3 as amended 2026-08-29 — the law text this
  parser must speak.

## Spec — the tokens, one per D74 clause

1. **(a) The written holder.** `Baton — <holder> → <action>` parsed from the ledger
   `Next:` clause; holder vocabulary: `⬡` · `the dispatch` · anything else = a named
   session. Shapes: single implicit (one instrument), `batch —` / `fork —` written
   markers; a fork's `recommendation:` is a named slot. Where the written form is
   present it is the whole truth — `classifyBaton`'s instrument-first inference
   retires for those entries. Where absent (history): today's classifier stands,
   result marked legacy. **Lint binds the tail**: the newest ledger entry must carry
   the written form (fail); older entries exempt. A migrate rule respells parseable
   historical batons (molt clause, form-only).
2. **(b) `holds:`.** `LANDED <date> — holds: <list>` parses into typed holds; a hold
   is an `E‹n›` reference or `⬡ <text>`. Lint: a LANDED row whose annotation raises an
   unruled `E‹n›` without a `holds:` list is stale-lead's sibling (name the rule); a
   hold naming an E-id that was ruled is a cleared hold left standing — warn.
3. **(c) Escalation ids.** `E‹n› — <what>` births and `E‹n› ruled <date>` deaths
   indexed per building; `parse --json` exposes them; `escalationsIn` (B14 F2's
   0-false-positive detector) stays the sensor for prose without ids.
4. **(d) `**Branch:**`** — a charge-doc header slot, parsed into the charge (the field
   b3 F5 asked for; prose reading measured 0/62 sound).
5. **(e) Encapsulation.** The board Work cell opens with the ≤6-word linked name →
   `row.name`; lint severity **warn** (a backlog reporter — the city is full of legacy
   cells; new writing converges).
6. **(f) Qualified Depends-on.** `<building>:<id>` legal as a third form;
   lint resolves it against the register — unresolvable is a **fail**; the dependency
   graph gains the cross-building edge.
7. **(g) Tier split.** `parse --json` emits `{model, effort}` beside the atomic tier
   token; writing unchanged.

## Done when:

- Suite green, count named; every token proved both ways on fixtures (green here, red
  or absent under the pre-C32 tool — the 13-F1/C24 pattern).
- **The holder-inversion repro flips:** `doctrine parse --json` on this repo's live
  tail reads the written holder, and on the archived GA-11 tail shape reports the
  legacy mark, never a guess.
- `doctrine lint ~/code/agents` → **0** (this repo's tail already speaks the form —
  GA-15's own close is the first native baton).
- City dry-run + lint-delta pasted (`lint ~/code` before/after; new warns counted and
  attributed; no new fail class on buildings this charge didn't touch).
- Migrate demonstrated: fixture + ONE real building dry-run respelling parseable
  historical batons, round-trip law honest.
- Belvedere unmoved: suite green at its head; the retirement list for its render-side
  splitters (`shapeOf`, holder note, SPEC_PATTERNS) FILED to its inbox, never edited
  here.

## Out of scope

- Consuming the fields in the glass — Belvedere's, via the GA-15 relay. City-wide
  `migrate --write` — additive tokens bind new writing; a sweep is its own later
  charge if wanted. The vocabulary arm.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/canon/work/DOCTRINE.md §§4, 8, 10–11
and execute the charge at ~/code/agents/plans/c32-flow-grammar.md.
```
