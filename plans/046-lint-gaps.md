# 046 — the lint gaps

**Status:** OPEN — laid 2026-09-08 · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Blessed:** Felix, 2026-09-08, in the room (grand-architect-24): fork (b).

## Mission

Three defects the field filed against the reader, each with a live repro, each fixed
at the parser and proven with a fixture and its control: **a gate row with no kickoff
anywhere is not red** (`board.gate-kickoff`, new); **the kickoff arm reds a quoted fence**
inside a Digger's Findings (the arm reads the marked fence); **an explicit root loses its
own ledger** to the worktree-twin dedup (039-F5's hole, now with simmy's case).

**Birthplaces**, swept 2026-09-08:
- stigmergon G6's Architect (2026-09-02): *"DOCTRINE §4: a gate needs a kickoff verbatim
  'riding the batch note or the gated charge's doc'. Stigmergon's 029 lay left G6 with
  neither, `doctrine lint` reported 32 kickoffs in 34 work docs and 0 failures for it, and
  the batch paused with the tender refusing to author one — a session round-trip a lint
  line would have saved."*
- stigmergon G21's Architect (2026-09-08): *"`doctrine lint` on stigmergon flags
  `plans/080-born-dig.md:244`, a fenced block in the Findings quoting verbatim the one-line
  prompt the dig sent to a Fixer … The doc's own kickoff sits at its foot and is
  well-formed; the lint reads every fence opening `You are a` as a kickoff of the doc.
  Findings are never edited after a charge closes (DOCTRINE §6) and the quotation is the
  evidence, so the building cannot clear it."*
- simmy G21's Architect (2026-09-08): *"Run on `…/.claude/worktrees/simmy/simmy` (the
  register maps simmy to the main checkout, which sat on `dev`), the report said `ledger
  none · baton none · 0/0 ledgers parsed a tail` while the board and kickoffs parsed
  fine — so a gate executed in a worktree cannot lint its own ledger entry or baton."*
  The same hole as 039-F5 (`plans/039-register-arm.md`): the twin-skip's split search
  falls through to a one-segment remainder whose dirname is `.`, and a branch-only
  `<checkout>/<dir>/LEDGER.md` is skipped as a twin of the mainline's.

## Inputs — read before working

- DOCTRINE §4 (*Gates are charges* — the kickoff rides the batch note or the gated charge's
  doc; ⬡-gates are never ignited), §5 (the kickoff law — every charge doc **ends** with its
  kickoff; the template writes `**Kickoff (verbatim):**` before the fence), §6 (findings
  never edited after close).
- `doctrine/src/parse.ts` (`parseKickoffs`, `isLiveWorkDoc`, `parseBoards` — `BoardRow.id`,
  `mantle`, `hexGate`, `dependsOn`, `workDoc`); `doctrine/src/building.ts` (`discover`,
  `worktreePath`, the twin-skip, `lastWalk.suppressed`); `doctrine/src/lint.ts`;
  `fixtures/register/worktree/` (039's fixture — the shape that holds) and 039-F5's repro
  sketch; the 2026-08-31 inbox entry, commit `36f9550`.
- The census ground: `~/code/agents/plans/`, `~/code/stigmergon/plans/` — 121 docs write the
  `Kickoff (verbatim)` marker; two here (`027-glass.md`, `029-summon-harness.md`) carry a
  `You are a` fence without it (measured 2026-09-08). `~/code/stigmergon/plans/080-born-dig.md`
  line 244 is the live repro.

## Spec

1. **`board.gate-kickoff`** (fail). A board row whose id matches `G\d+` and whose Staffing
   is a mantle · tier (not `⬡-gate`) must be kickoff-reachable: (a) its Work cell links a
   work doc that carries a kickoff fence, or (b) a kickoff fence — in the board doc's own
   body outside the table (its notes), or in the doc of any charge named in its
   Depends-on — names the gate's id (`G‹n›`) or its doc's path. Otherwise the row fails
   with its verbatim excerpt. `⬡-gate` rows are exempt; LANDED / KILLED rows are history
   and exempt. Fixture: a gate row with neither, red; the same row with (a), green; with
   (b) via a Depends-on doc, green — three cases, the first the control.
2. **The marked fence.** In a work doc, when a line matching `Kickoff` (bold, optional
   `(verbatim)`, optional colon) precedes a fence, that fence is the doc's kickoff and no
   other fence in the doc is a kickoff candidate, whatever its first line — a fence
   elsewhere is a quotation. When no marker exists the current behavior stands (the
   grandfathered docs). `classifyBaton`'s read of a ledger entry's fences is untouched —
   an entry's fenced summons is an instrument, not a kickoff. Fixture: a live work doc with
   a marked kickoff at its foot and a `You are a` fence quoted under `## Findings` — green;
   the control: the same doc with the quoted fence malformed and no marker — red as today.
3. **An explicit root keeps its own files.** The mainline-twin skip applies only to worktree
   checkouts *discovered under* a walked root, never to the root a caller names or to the
   files directly under it: `doctrine lint <a worktree path>` parses that checkout's ledger.
   And 039-F5's hole is closed: the split search never accepts a remainder whose dirname is
   `.`; a branch-only `<checkout>/<dir>/LEDGER.md` under a mainline that is itself a
   building survives. Fixture: extend `fixtures/register/worktree/` — a mainline with root
   books plus a worktree whose ledger differs by one entry; walk from the mainline (the
   worktree's building survives, `suppressed` counts the true twins) and name the worktree
   as the root (its ledger parses, tail present). The control is today's code on the same
   fixture (red).

Every failure keeps the reader's law: parser-as-lint, a verbatim excerpt, per-repo special
cases zero.

## Done when:

- [ ] `bun test` green from `doctrine/` with the fixtures above, each with its control —
      output pasted.
- [ ] `doctrine lint ~/code/stigmergon` — `plans/080-born-dig.md:244` no longer named;
      the totals line pasted before and after; any new `board.gate-kickoff` row named with
      its excerpt (never suppressed — the building's Architect owns it, G4's ruling (ii)).
- [ ] `doctrine lint ~/code/agents` — unchanged from the lay (19 `board.cell-cap`,
      belvedere's), pasted.
- [ ] A worktree case run live — any `.claude/worktrees/*` checkout of a registered
      building on this machine, or the fixture when none exists — `doctrine lint <path>`
      parses a ledger tail; pasted.
- [ ] `doctrine buildings` exits 0; `lastWalk.suppressed` on the agents walk pasted before
      and after (a change is a finding, not a silent shift).

## Out of scope

- The deferred list's other parser residue — the qualified id in the ledger head's slot,
  040's second adoption, the dead-citation alarm, the currency alarm — stays deferred.
- A `--ledger <path>` flag: the discovery is fixed instead — no part.
- Editing any building's docs to clear a failure (080's quotation is evidence; the fix is
  the reader's).
- The kickoff arm's three line checks (`kickoff.summons` · `door` · `wear`) — unchanged
  for the fence that IS the kickoff.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/046-lint-gaps.md to its bar.
```
