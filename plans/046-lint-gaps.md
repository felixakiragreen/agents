# 046 — the lint gaps

**Status:** **LANDED** 2026-09-08 — three arms, six findings; suite 143 → 149, stigmergon 1 → 0 failures, agents unchanged · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** Felix, 2026-09-08, in the room (grand-architect-24): fork (b).

## Mission

Three defects the field filed against the reader, each with a live repro, each fixed at the parser and proven with a fixture and its control: **a gate row with no kickoff anywhere is not red** (`board.gate-kickoff`, new); **the kickoff arm reds a quoted fence** inside a Digger's Findings (the arm reads the marked fence); **an explicit root loses its own ledger** to the worktree-twin dedup (039-F5's hole, now with simmy's case).

**Birthplaces**, swept 2026-09-08:
- stigmergon G6's Architect (2026-09-02): *"DOCTRINE §4: a gate needs a kickoff verbatim 'riding the batch note or the gated charge's doc'. Stigmergon's 029 lay left G6 with neither, `doctrine lint` reported 32 kickoffs in 34 work docs and 0 failures for it, and the batch paused with the tender refusing to author one — a session round-trip a lint line would have saved."*
- stigmergon G21's Architect (2026-09-08): *"`doctrine lint` on stigmergon flags `plans/080-born-dig.md:244`, a fenced block in the Findings quoting verbatim the one-line prompt the dig sent to a Fixer … The doc's own kickoff sits at its foot and is well-formed; the lint reads every fence opening `You are a` as a kickoff of the doc. Findings are never edited after a charge closes (DOCTRINE §6) and the quotation is the evidence, so the building cannot clear it."*
- simmy G21's Architect (2026-09-08): *"Run on `…/.claude/worktrees/simmy/simmy` (the register maps simmy to the main checkout, which sat on `dev`), the report said `ledger none · baton none · 0/0 ledgers parsed a tail` while the board and kickoffs parsed fine — so a gate executed in a worktree cannot lint its own ledger entry or baton."* The same hole as 039-F5 (`plans/039-register-arm.md`): the twin-skip's split search falls through to a one-segment remainder whose dirname is `.`, and a branch-only `<checkout>/<dir>/LEDGER.md` is skipped as a twin of the mainline's.

## Inputs — read before working

- DOCTRINE §4 (*Gates are charges* — the kickoff rides the batch note or the gated charge's doc; ⬡-gates are never ignited), §5 (the kickoff law — every charge doc **ends** with its kickoff; the template writes `**Kickoff (verbatim):**` before the fence), §6 (findings never edited after close).
- `doctrine/src/parse.ts` (`parseKickoffs`, `isLiveWorkDoc`, `parseBoards` — `BoardRow.id`, `mantle`, `hexGate`, `dependsOn`, `workDoc`); `doctrine/src/building.ts` (`discover`, `worktreePath`, the twin-skip, `lastWalk.suppressed`); `doctrine/src/lint.ts`; `fixtures/register/worktree/` (039's fixture — the shape that holds) and 039-F5's repro sketch; the 2026-08-31 inbox entry, commit `36f9550`.
- The census ground: `~/code/agents/plans/`, `~/code/stigmergon/plans/` — 121 docs write the `Kickoff (verbatim)` marker; two here (`027-glass.md`, `029-summon-harness.md`) carry a `You are a` fence without it (measured 2026-09-08). `~/code/stigmergon/plans/080-born-dig.md` line 244 is the live repro.

## Spec

1. **`board.gate-kickoff`** (fail). A board row whose id matches `G\d+` and whose Staffing is a mantle · tier (not `⬡-gate`) must be kickoff-reachable: (a) its Work cell links a work doc that carries a kickoff fence, or (b) a kickoff fence — in the board doc's own body outside the table (its notes), or in the doc of any charge named in its Depends-on — names the gate's id (`G‹n›`) or its doc's path. Otherwise the row fails with its verbatim excerpt. `⬡-gate` rows are exempt; LANDED / KILLED rows are history and exempt. Fixture: a gate row with neither, red; the same row with (a), green; with (b) via a Depends-on doc, green — three cases, the first the control.
2. **The marked fence.** In a work doc, when a line matching `Kickoff` (bold, optional `(verbatim)`, optional colon) precedes a fence, that fence is the doc's kickoff and no other fence in the doc is a kickoff candidate, whatever its first line — a fence elsewhere is a quotation. When no marker exists the current behavior stands (the grandfathered docs). `classifyBaton`'s read of a ledger entry's fences is untouched — an entry's fenced summons is an instrument, not a kickoff. Fixture: a live work doc with a marked kickoff at its foot and a `You are a` fence quoted under `## Findings` — green; the control: the same doc with the quoted fence malformed and no marker — red as today.
3. **An explicit root keeps its own files.** The mainline-twin skip applies only to worktree checkouts *discovered under* a walked root, never to the root a caller names or to the files directly under it: `doctrine lint <a worktree path>` parses that checkout's ledger. And 039-F5's hole is closed: the split search never accepts a remainder whose dirname is `.`; a branch-only `<checkout>/<dir>/LEDGER.md` under a mainline that is itself a building survives. Fixture: extend `fixtures/register/worktree/` — a mainline with root books plus a worktree whose ledger differs by one entry; walk from the mainline (the worktree's building survives, `suppressed` counts the true twins) and name the worktree as the root (its ledger parses, tail present). The control is today's code on the same fixture (red).

Every failure keeps the reader's law: parser-as-lint, a verbatim excerpt, per-repo special cases zero.

## Done when:

- [x] `bun test` green from `doctrine/` with the fixtures above, each with its control — output pasted.

```
$ cd doctrine && bun test          # at d5a3035; the landing commit touches only this doc, the board and the ledger
 149 pass
 0 fail
 681 expect() calls
Ran 149 tests across 4 files. [305.00ms]
```

  **143 → 149.** Six tests: the gate arm's control and its five passing shapes, the marked fence and its unmarked control, the ledger entry's fences left alone, 039-F5's hole, and the named root. **Every control run** — the pre-046 source (`cb45a39`) with this charge's tests and fixtures copied over it — reds exactly the five new law tests and nothing else:

```
$ git archive cb45a39 doctrine canon | tar -x -C $T && cp -R doctrine/test doctrine/fixtures $T/doctrine/ && cd $T/doctrine && bun test
(fail) the silence family … > the marked fence is the doc's kickoff, and every other fence a quotation (046)
(fail) the gate arm (046) > a staffed gate row no kickoff reaches is the fixture's one failure, named verbatim
(fail) the gate arm (046) > reachable three ways, exempt two — the rows that pass, and why
(fail) the building register > the twin skip never eats a branch-only building under a mainline that keeps root books (039-F5)
(fail) the building register > an explicit root keeps its own files: a checkout named as the root reads its own ledger (046)
(fail) boot — the pack a cold session reads > the title carries the register Name, the root, HEAD and the day
 143 pass
 6 fail
```

  The sixth is the harness, not the code: the pack prints `HEAD no git` in a `git archive` copy, and the title test wants a sha or that literal — it passes in the repo, before and after. 039-F5's control is the loudest: on `cb45a39`, `discover([‹the checkout›])` returns `[]` — the branch-only building does not merely lose its ledger, it vanishes.

- [x] `doctrine lint ~/code/stigmergon` — `plans/080-born-dig.md:244` no longer named; the totals line pasted before and after; any new `board.gate-kickoff` row named with its excerpt (never suppressed — the building's Architect owns it, G4's ruling (ii)).

```
BEFORE (cb45a39)
      [1×] kickoff.summons — first line is not "You are a <Mantle> at <tier>." (D45)
           ~/code/stigmergon/plans/080-born-dig.md:244: You are a Fixer at haiku-low. Enter by the door — read
=== FAILURE CLASSES
     1  kickoff.summons
  1 buildings · 1/1 board docs yielded a board · 1 boards · 108 rows · 108 fully typed (100%)
  1/1 ledgers parsed a tail (107 entries) · 0 fireable baton(s) · 102 kickoffs in 103 work docs · 49 decisions (queue 0) · 1 inbox entries
  1 failure(s) in 1 class(es) · 102 warning(s) in 1 class(es)

AFTER
=== FAILURE CLASSES
  1 buildings · 1/1 board docs yielded a board · 1 boards · 108 rows · 108 fully typed (100%)
  1/1 ledgers parsed a tail (107 entries) · 0 fireable baton(s) · 95 kickoffs in 103 work docs · 49 decisions (queue 0) · 1 inbox entries
  0 failure(s) in 0 class(es) · 102 warning(s) in 1 class(es)
```

  **No new `board.gate-kickoff` row, here or in agents** — the two live gates each carry their own doc's fence (F1), and `G22` is a `⬡-gate`. The kickoff count moves 102 → 95: F2.

- [x] `doctrine lint ~/code/agents` — unchanged from the lay (19 `board.cell-cap`, belvedere's), pasted.

```
BEFORE (cb45a39)                                    AFTER
=== FAILURE CLASSES                                 === FAILURE CLASSES
    19  board.cell-cap                                  19  board.cell-cap
=== WARNING CLASSES                                 === WARNING CLASSES
   169  ledger.entry-cap                                169  ledger.entry-cap
  3 buildings · 5/5 board docs · 5 boards · 124 rows · 124 fully typed (100%)          [identical]
  2/2 ledgers parsed a tail (196 entries) · 1 fireable baton(s)                         [identical]
  118 kickoffs in 121 work docs                     116 kickoffs in 121 work docs       ← F2
  19 failure(s) in 1 class(es) · 169 warning(s)     19 failure(s) in 1 class(es) · 169 warning(s)
```

  `--vocab` too: 50 `vocab.dead-word` before and after, unmoved by this arm or its prose.

- [x] A worktree case run live — any `.claude/worktrees/*` checkout of a registered building on this machine, or the fixture when none exists — `doctrine lint <path>` parses a ledger tail; pasted.

```
$ doctrine lint ~/code/universal_robots_sdk/cap-mega/.claude/worktrees/simmy/simmy

BEFORE (cb45a39)
 ok   …/worktrees/simmy/simmy  —  1 board(s) · 47/47 rows typed · ledger none · baton none · 22 kickoff(s) · queue 10

AFTER
FAIL  …/worktrees/simmy/simmy  —  1 board(s) · 47/47 rows typed · ledger 2026-09-08 · baton none · 18 kickoff(s) · queue 10
  1 buildings · 1/1 board docs yielded a board · 1 boards · 47 rows · 47 fully typed (100%)
  1/1 ledgers parsed a tail (44 entries) · 0 fireable baton(s) · 18 kickoffs in 43 work docs · 21 decisions (queue 10) · 0 inbox entries
  8 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  10 failure(s) in 4 class(es) · 39 warning(s) in 1 class(es)
```

  simmy G21's report was `ledger none · baton none · 0/0 ledgers parsed a tail`; the tail now parses at 2026-09-08 and the ten failures it exposes are simmy's own — F4.

- [x] `doctrine buildings` exits 0; `lastWalk.suppressed` on the agents walk pasted before and after (a change is a finding, not a silent shift).

```
$ doctrine buildings ; echo "exit $?"     # BEFORE and AFTER: byte-identical, twelve rows
  agents  building  ~/code/agents  3 building(s) · 124 row(s)   … manny  building  …/worktrees/user-manual  1 building(s) · 30 row(s)
exit 0

$ doctrine lint ~/code/agents | tail -2   # the agents walk's suppressed count
BEFORE:  0 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
AFTER:   0 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
```

  The agents repo keeps one empty checkout directory (`.claude/worktrees/bv/`), so its walk suppressed nothing before and suppresses nothing now. The city's counted twins live under cap-mega, and `doctrine buildings` — which walks manny's declared checkout root — prints the same twelve rows before and after.

## Out of scope

- The deferred list's other parser residue — the qualified id in the ledger head's slot, 040's second adoption, the dead-citation alarm, the currency alarm — stays deferred.
- A `--ledger <path>` flag: the discovery is fixed instead — no part.
- Editing any building's docs to clear a failure (080's quotation is evidence; the fix is the reader's).
- The kickoff arm's three line checks (`kickoff.summons` · `door` · `wear`) — unchanged for the fence that IS the kickoff.

## Findings

**F1 — `board.gate-kickoff` finds nothing live, and that is the measurement, not a shrug.** Both live staffed gates in the city are reachable through their own docs — agents `G4` → `plans/g4-parser-review.md`, stigmergon `G23` → `plans/G23-harness-hygiene.md`, each ending with its marked kickoff — and stigmergon `G22` is a `⬡-gate`, which §4 never ignites. The gates the arm was born for are spent: stigmergon's `G6` LANDED on 2026-09-02, and history is exempt, so the birthplace itself cannot be re-reported. The fixture is therefore where the law lives (`fixtures/gate/`): six rows, one failure — the control — and five passing rows, one per clause (own doc · the gated charge's doc · the board's own batch note · a `⬡-gate` · a LANDED row).

**F2 — the marked fence demotes nine quoted fences city-wide, and the entity counts fall with them.** agents 118 → 116 kickoffs, stigmergon 102 → 95, both while the failure classes stay put (19 `board.cell-cap`; 1 → 0). Every demoted fence is a quotation, checked by hand:

| doc | the demoted fence | what it is |
|---|---|---|
| stigmergon `plans/G8`, `G9`, `G10`, `G11`, `G12`, `G14` | the gate's own kickoff, quoted into the batch note above and marked at the foot | the same summons twice in one doc |
| stigmergon `plans/080-born-dig.md:244` | `You are a Fixer at haiku-low. Enter by the door — read` | the dig's evidence — the prompt it fired, wrapped as it went |
| `belvedere/plans/b6-sovereign-inbox.md:143` | under `=== the FIRST USER TURN, verbatim from the transcript ===` | a probe's transcript |
| `belvedere/plans/b7-summon-composer.md:92` | an indented summons inside a composer probe's output | a probe's evidence |

The count-regression guard (`lint --guard`) reports **any** decrease in `kickoffs`, so a guarded run across this change will fire — deliberately, and this table is the override's reason. A census script (`scan` for marker + summons fences over all four `plans/` trees) found the nine; no doc anywhere in the city carries a marker whose fence the arm then failed to find (`0 marker-without-fence` in 224 docs), so nothing was silently narrowed to nothing.

**F3 — the spec's mechanism for 039-F5 could not stand, and the outcome it named is met another way.** Spec 3 wrote *"the split search never accepts a remainder whose dirname is `.`"*. Applied literally that rule un-deduplicates every checkout's ROOT-level file, because a root-level file's only remainder IS one segment — there is no other split to fall back to. Measured, on a scratch copy of this tree with exactly that patch:

```
$ (the shipped rule replaced by: `if (dirname(rest) !== '.' && existsSync(join(repo, dirname(rest))))`)
$ bun test
(fail) the register > a worktree checkout is skipped whatever its branch name is shaped like (036 item 5)
       expect([r.totals.buildings, r.totals.rows, r.totals.ledgers]).toEqual([1, 3, 1])   →   received [2, 5, 2]
(fail) the building register > the twin skip never eats a branch-only building … (039-F5)
       +  "…/register/worktree/books/.claude/worktrees/wt"          ← the checkout's copy of the mainline's ledger, resurrected as a building
 146 pass · 3 fail
```

036's law — *35 full checkouts of one repo are one repo* — breaks, and F5's own fixture gains a phantom building. So the mechanism shipped is the one the sentence was reaching for: **the split is not searched at the file at all, it is found at the DIRECTORY.** A checkout is a copy of the repo, so the checkout root is the shallowest directory under `.claude/worktrees/` that shares an entry name with the mainline root; a branch-name prefix directory (`bv/` of `bv/029-summon-harness`) holds only the next branch segment, which is a branch's word and not the repo's. Every outcome the spec named holds: the branch-only building survives, `suppressed` counts the true twins (1 in the fixture), and no remainder's `.` dirname is ever evidence — because no remainder is evidence.

**F4 — the named root now reads simmy's ledger, and it exposes ten failures that are simmy's, not this arm's.** `doctrine lint …/worktrees/simmy/simmy` went from `ledger none · baton none · 0/0 ledgers parsed a tail` to `1/1 ledgers parsed a tail (44 entries)`, and the tail it can finally read carries `3 ledger.row`, `3 ledger.decided`, `3 ledger.next`, `1 ledger.merged` at `LEDGER.md:1200–1329`. They were always there; nothing could see them. Out of this fence (the charge forbids editing another building's docs) and out of this building — **for G4's Architect to route to simmy's desk**, whose 2026-09-08 entries they are.

**F5 — the arm changed a fixture, which is the arm working.** `fixtures/boot/` carried a live staffed gate row (`G2`) with a Work link to a doc that did not exist, and the boot suite asserted `Lint: 0 failure(s)`. The fix is the fixture's, not the arm's: `fixtures/boot/plans/g2-arms-review.md` now exists and ends with its kickoff. No test expectation was weakened.

**F6 — what the checkout-root rule assumes, said out loud.** It reads one directory listing per candidate and asks for a shared name; it is wrong only where a multi-segment branch's PREFIX directory happens to hold a child named exactly like an entry at the mainline root (`feature/docs` under a repo whose root holds `docs/`). Git's own answer is unambiguous — a worktree root carries a `.git` FILE — but git refuses to track a path named `.git`, so no fixture can ever exercise that branch, and untestable code is the worse trade. Measured against the city as it stands: cap-mega's 42 checkouts and agents' one are all correctly rooted, and `feature/simmy` is checked out at `worktrees/simmy` — proof that the directory NAME is nobody's evidence, which is why the rule reads contents instead.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/046-lint-gaps.md to its bar.
```
