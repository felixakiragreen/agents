# C36 — doctrine v1.3: the grammar debt

**Status:** OPEN — laid 2026-08-31 · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Parallel-safe with:** G2 · **Blessed:** ⬡✓ 2026-08-31 in-session (GA-19 sweep — the
three grammar rulings below are his, ruled at the desk).

## Mission

Seven evidenced parser/lint defects fold into `doctrine/` — the grammar debt left by
flow-1's abandonment (C32's stranded holder scope) plus the sweep's accumulated
filings. When this lands, the parser reads what is written instead of inferring,
spent history stops redding live arms, and the typed nothing-owed close exists.

## Inputs — read before working (do not re-derive)

- `doctrine/` source + its suite; C31's findings
  ([plans/c31-doctrine-defects.md](c31-doctrine-defects.md)) for the arm patterns.
- [plans/c32-flow-grammar.md](c32-flow-grammar.md) (KILLED) — its Spec §the tokens
  carries the D74 holder grammar verbatim; only the holder scope moves here.
- DOCTRINE §§3/4/7/11 and STANDARD §7 **as amended 2026-08-31** — the law this
  parser must speak.
- The B26 record: `belvedere/plans/b26-baton-attention.md` F2 (the fourth filing of
  the nothing-owed ask) — read-only context; belvedere is fenced.

## Spec — seven items, each with its repro

1. **The spent mask** (⬡✓ 2026-08-31): the kickoff arm and the vocab arm exempt
   charges whose `**Status:**` opens LANDED or KILLED — history is whole, C25's
   live/spent rule is the ancestor. Repro today: `lint --vocab ~/code/agents`
   reports 11 hits in [plans/18-great-recut.md](18-great-recut.md), a LANDED doc;
   a LANDED charge's pre-door fence reds `kickoff.door` (the belvedere c1 case,
   inbox 2026-08-29).
2. **The written holder** (D74; DOCTRINE §11): the parser reads a baton's holder
   from the written form — `⬡`, `Felix`, a named session, `the dispatch` — and
   never infers. `classifyBaton` (`doctrine/src/parse.ts:433`) learns `⬡`. Repro:
   the root LEDGER's G4 baton is written `Baton — ⬡ →` and parses
   `holder: "session"` today; the lint's agents row reads `baton session ×1`.
3. **`Next: none — <why>`** (⬡✓ 2026-08-31; DOCTRINE §7): the typed nothing-owed
   close parses as its own kind; an entry carrying it owes no baton. Wild ancestor
   already in the corpus: the 2026-08-29 rig entry, "Next: none — the rig is
   current" (commit `cc1206f`).
4. **The body-text splitter**: only a line-leading `Next:` clause splits an entry;
   a mid-body mention never does. Repro: spacex-dashboard-c2 and manny ledger tails
   mis-split (belvedere's B26 filing, 2026-08-31).
5. **The `bv/*` register skip**: the building register skips a worktree checkout
   unless its branch adds a board the mainline lacks — keyed on *being a worktree*,
   never on the `worktree-agent-*` name shape. Repro (historical, latent since the
   worktree's removal): `.claude/worktrees/bv/c29-summon-harness` at master's
   commit doubled every total — 2 buildings → 4, 84 rows → 168.
6. **The BOARD.md reader**: prove the walk reads a building's `BOARD.md` as a board
   doc (D78's new home) — a fixture building whose only board lives in `BOARD.md`
   parses. Likely already generic; prove it, don't assume.
7. **Fixtures per item, suite green**: every fix lands with the fixture that reds
   without it.

## Done when:

- [ ] `bun test` in `doctrine/` green, new fixtures counted per item — paste the
      suite delta (80 → n).
- [ ] `bun doctrine/cli.ts lint ~/code/agents` → 0 failures; the agents row's baton
      column no longer reads `session` for a written-`⬡` baton.
- [ ] `bun doctrine/cli.ts lint --vocab ~/code/agents` reports 0 hits in
      `plans/18-great-recut.md` (paste before/after counts).
- [ ] `bun doctrine/cli.ts parse --json ~/code/agents` shows the G4 baton
      `"holder": "felix"` — paste the excerpt.

## Out of scope

- Any renderer or deck work — belvedere is fenced and retiring.
- The history respell (DEFERRED, Felix's word) and building-side repairs (the
  city's pre-door fences are each building's own sweep).
- New lint arms beyond the named seven. Creep is a bug.

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 + ~/code/agents/BOARD.md
and execute the charge at ~/code/agents/plans/c36-grammar-debt.md.
```
