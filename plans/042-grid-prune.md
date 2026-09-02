# 042 — the grid prune

**Status:** LANDED 2026-09-01 — eight tiers retired, twelve stand; the README's grid law
is mint-at-the-lay; one tier (`haiku-low`) left standing against the rule and escalated
(F4) · **Depends on:** ⬡-gate: his word — the moratorium
ruling and the live wire (a delete in `canon/agents/` lands on three accounts at the
commit) · **Staffing:** Builder · opus-medium · **Blessed:** Felix, 2026-09-01 in-session
("let's kill them") — the kill list is the census below, never a taste

## Mission

`canon/agents/` holds the tiers the city uses and nothing else, and the mantles README's
grid law turns from "the full cross product, pre-minted" into "minted at the lay": a tier
exists because a board's Staffing cell or the rig's log names it, and a tier a new charge
needs is minted before the batch that needs it ignites, never mid-session (D8's fact
stands — definitions load at session start). The best part is no part.

## Inputs — read before working

- The census, 2026-09-01 at the office's desk — every tier named by a Staffing cell
  across the register's eight buildings (`BOARD.md`, `README.md`, `MAP.md`,
  `GENESIS.md`, `plans/*.md`) and by the rig's log (`summon/log/invocations.jsonl`,
  446 fires):

  | tier | board and plan mentions | rig fires |
  |---|---|---|
  | opus-high | 312 | 97 |
  | opus-medium | 172 | 4 |
  | fable-high | 124 | 140 |
  | fable-max | 99 | 71 |
  | sonnet-medium | 56 | 100 |
  | sonnet-high | 23 | 9 |
  | opus-max | 9 | — |
  | haiku-low | 4 | — |
  | opus-xhigh | — | 13 |
  | haiku-max | 2 | — |
  | sonnet-xhigh | — | 2 |
  | fable-xhigh | — | 2 |
  | haiku-high | 1 | — |
  | opus-low | — | 1 |
  | fable-low · fable-medium · sonnet-low · sonnet-max · haiku-medium · haiku-xhigh | 0 | 0 |

  The command: `grep -rhoE '\b(fable|opus|sonnet|haiku)-(low|medium|high|xhigh|max)\b'`
  over each registered root's five doc kinds; the rig's from the log's `model` and
  `effort` fields. Re-run both at build — the numbers move.
- `canon/mantles/README.md` § The tier grid — the law amended here. `canon/agents/*.md`
  — the twenty files. `doctrine/src/grammar.ts` `TIERS` — the full product stays: a
  dead tier must parse forever, every board that named one is history. `lab/008/run` —
  its arms name tiers the rig composes from `--model`/`--effort` flags, not from files:
  the rig never reads `canon/agents/`; confirm and record it as a finding.

## Spec (blessed 2026-09-01)

- **The rule:** a tier file exists in `canon/agents/` iff the census names it in a
  Staffing cell or a rig fire. The six with zero uses die for certain. The
  once-or-twice tiers (haiku-max · haiku-high · opus-low · sonnet-xhigh · fable-xhigh)
  die or stay by the Builder's re-run census — a mention inside a probe, a lab
  fixture, or a tier's own description is not a Staffing cell and does not count.
- **The README:** "Why the full grid" becomes the mint-at-the-lay law — the grid is the
  namespace, not the inventory; a tier a new charge names is minted by the Architect
  at the lay, before ignition, and the session that dispatches it starts afterward.
  The naming law and the effort-clamp fact stand. A survivor's description that points
  at a dead tier ("prefer …") repoints or drops the pointer.
- **The grammar:** `TIERS` stays the full product; `isTier` unchanged; nothing else in
  `doctrine/` moves.
- **The wire:** `canon/agents/` is a symlinked directory on three accounts — the delete
  lands ×3 at the commit. His word at ignition is the deploy; `sync/check` green
  afterward is the proof.

## Out of scope

The rig (`summon/`) and `presets.tsv` — the rig composes flags, not files · `lab/008`'s
arms · staffing guidance in the surviving descriptions beyond repointing dead
references · the doctrine parser.

## Done when:

- [x] `ls canon/agents/` lists exactly the census survivors; the list and the re-run
      census pasted. — **F1, F2**
- [x] `./sync/check` green ×3, pasted; `ls ~/.claude/agents/` matches `canon/agents/`.
      — **F5**
- [x] `grep -rl '<dead tier>' canon/` empty for every killed tier, except the README's
      one history line naming the kill; pasted. — **F6**
- [x] `bun test` green (102, or 041's count if it landed first); `doctrine lint
      ~/code/agents` adds no failure. — **F7**
- [x] From a fresh session, a one-line probe dispatched at a surviving tier reports the
      available agent types as exactly the survivors — the session-start fact re-verified;
      pasted. — **F8** (the dispatched half of the instrument does not exist — see F8).

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

- **F1 — the re-run census, 2026-09-01 (build time). The numbers moved; the shape did
  not.** Doc side, the charge's command over the eight registered roots' five doc kinds
  (`BOARD.md` · `README.md` · `MAP.md` · `GENESIS.md` · `plans/*.md`, roots from
  `canon/BUILDINGS.md`); rig side, `model`+`effort` from `summon/log/invocations.jsonl`
  (448 lines, 441 fires + 7 `"mode":"abort"` rows with null model/effort — aborts are
  not fires).

  | tier | docs (raw) | docs (Staffing cells) | rig fires | verdict |
  |---|---|---|---|---|
  | opus-high | 320 | yes | 97 | stays |
  | opus-medium | 176 | yes | 4 | stays |
  | fable-high | 128 | yes | 140 | stays |
  | fable-max | 100 | yes | 72 | stays |
  | sonnet-medium | 61 | yes | 101 | stays |
  | sonnet-high | 24 | yes | 9 | stays |
  | opus-max | 10 | yes (snappy 16) | — | stays |
  | opus-xhigh | 1 | none (042's own table) | 13 | stays — fires |
  | haiku-low | 5 | none (probe evidence, 012) | — | **stays — see F4** |
  | haiku-max | 4 | none (a 001 musing, a 009 preview fixture) | — | **killed** |
  | haiku-high | 3 | none (a 028 probe's staffing) | — | **killed** |
  | sonnet-xhigh | 2 | none (042's own table) | 2 | stays — fires |
  | opus-low | 2 | none (042's own table) | 1 | stays — fires |
  | fable-xhigh | 2 | none (042's own table) | 2 | stays — fires |
  | fable-low · fable-medium · sonnet-low · sonnet-max · haiku-medium · haiku-xhigh | 1 each (042's own table) | none | — | **killed** |

  The raw doc counts drift a few points above the charge's table because 042 itself is
  now a plan doc and names every tier. Every low-count tier's mentions were read in
  place; the "Staffing cells" column is that reading.

- **F2 — the survivors, on disk.** `ls canon/agents/`:

  ```
  fable-high.md   fable-max.md    fable-xhigh.md  haiku-low.md
  opus-high.md    opus-low.md     opus-max.md     opus-medium.md
  opus-xhigh.md   sonnet-high.md  sonnet-medium.md sonnet-xhigh.md
  ```

  Twelve stand; eight retired by `git rm` — `fable-low` · `fable-medium` · `sonnet-low`
  · `sonnet-max` · `haiku-medium` · `haiku-xhigh` (the six zero-use cells, dead for
  certain per the spec) and `haiku-max` · `haiku-high` (two of the discretionary five,
  killed by the re-run: probe and fixture mentions only, zero fires).

- **F3 — three of the discretionary five live on rig fires alone.** `opus-low` (1),
  `sonnet-xhigh` (2) and `fable-xhigh` (2) have no Staffing cell anywhere in the
  register, but the rule counts a rig fire, and the log has them. `opus-xhigh` (13 fires)
  is the same shape at larger scale. `opus-max` is **not** — it is the only low-count
  tier outside `agents` with a genuine Staffing cell, in snappy:
  `plans/16-reconciler-core.md:5: **Staffing:** Builder · opus-max` (plus its board row
  and two kickoffs, snappy and spacex-dashboard); its four `agents` mentions are
  `009`/`013` rig-preview strings, but the census does not need them. Consequence worth
  naming: **the rig's log, not the boards, is what keeps four of the twelve alive**
  (`opus-low`, `opus-xhigh`, `sonnet-xhigh`, `fable-xhigh`). If the log is ever rotated,
  the census loses its only evidence for them.

- **F4 — ESCALATION: `haiku-low` survives the charge's partition but fails the charge's
  rule, and it is the last Haiku standing.** The rule reads *"a tier file exists iff the
  census names it in a Staffing cell or a rig fire"*, with probe mentions expressly
  disqualified. `haiku-low` has zero rig fires and exactly five doc mentions, all of them
  probe evidence inside one plan:

  ```
  plans/012-dispatch-guard.md:84:  PASS  haiku-low actually ran
  plans/012-dispatch-guard.md:119:…followed by `Agent(subagent_type: "haiku-low", …)`
  plans/012-dispatch-guard.md:139:       "subagent_type": "haiku-low", "model": "haiku", …
  plans/012-dispatch-guard.md:164:…cannot resolve any tier: *"Agent type 'haiku-low' not found. …
  plans/042-grid-prune.md:32:  | haiku-low | 4 | — |
  ```

  By the rule it dies. The spec's partition, though, lists the discretionary kills
  explicitly (`haiku-max · haiku-high · opus-low · sonnet-xhigh · fable-xhigh`) and puts
  `haiku-low` outside it, among the presumed survivors — the partition was drawn from
  the counts, before anyone read the contexts. **The Builder left it standing:** killing
  it retires Haiku from the roster entirely, which is a change to the grid's shape and
  therefore the Architect's call, not an implementation choice inside the fence. If the
  rule is meant to bite, one more `git rm` finishes it and the README's history line
  gains a ninth name. `haiku-low` is the only tier in this position — every other
  survivor clears the rule on a Staffing cell or a fire (F1).

- **F5 — the wire, confirmed live; `sync/check` green ×3.** The delete reached all three
  accounts at the `git rm`, before any commit — `canon/agents/` is one symlinked inode.
  `ls ~/.claude/agents/` matches `canon/agents/` exactly (twelve files, F2). `./sync/check`:

  ```
  /Users/felix/.claude            CLAUDE.md ok → canon/CLAUDE.md   agents ok → canon/agents
  /Users/felix/.claude-thg-fgreen CLAUDE.md ok → canon/CLAUDE.md   agents ok → canon/agents
  /Users/felix/.claude-thg-doorbell CLAUDE.md ok → canon/CLAUDE.md agents ok → canon/agents
  green — 3×2 links, all pointing at canon.
  ```

- **F6 — no dead tier survives in `canon/` but the history line.**
  `grep -rn -- "fable-low\|fable-medium\|sonnet-low\|sonnet-max\|haiku-medium\|haiku-xhigh\|haiku-max\|haiku-high" canon/`:

  ```
  canon/mantles/README.md:44:- **The prune (042, 2026-09-01):** eight unused cells retired — `fable-low`,
  canon/mantles/README.md:45:  `fable-medium`, `sonnet-low`, `sonnet-max`, `haiku-medium`, `haiku-xhigh`,
  canon/mantles/README.md:46:  `haiku-max`, `haiku-high`; twelve stand. Git holds every one; re-mint by name when a
  ```

  Three physical lines, one history bullet. The effort-clamp fact stood on `haiku-xhigh`
  as its worked example; it now reads "a Haiku dispatch at xhigh verified working
  2026-08-02" — the fact intact, the dead name gone. **No survivor's description pointed
  at a dead tier:** the only cross-references among the twelve are `opus-low`→`sonnet-medium`
  and `opus-xhigh`→`opus-high`, both live; the pointers at dead tiers all lived inside the
  descriptions that died with them (`fable-low`→`opus-high`, `sonnet-max`→`opus-medium`).
  Nothing to repoint.

- **F7 — the suite and the linter.** `bun test`: **977 pass, 0 fail**, 18062 expect()
  across 56 files. (The charge's "102" is a stale scope — the doctrine package alone is
  `bun test doctrine`: **109 pass, 0 fail**. 041 landed before this charge.) The linter
  adds nothing: `./doctrine/cli.ts lint ~/code/agents` was run against the working tree
  and against a detached `HEAD` worktree of the pre-prune state, and the two are
  identical — **33 failures in 1 class (`board.cell-cap`), 167 warnings in 1 class
  (`ledger.entry-cap`)**, all of them pre-existing rows in `belvedere/` (retired) and
  none in a file this charge touched. `TIERS` in `doctrine/src/grammar.ts` is untouched:
  it is still `MODELS.flatMap(m => EFFORTS.map(e => …))`, the full twenty, so every
  historical board naming a retired tier still parses.

- **F8 — the session-start fact re-verified, with the pre-delete session as its own
  control.** *The charge's instrument does not exist:* a **dispatched** agent is never
  given the agent-type roster — a probe at `haiku-low` reported that its system prompt
  carries the deferred-tool list and the skill list and no enumeration of agent types
  (it holds the `Agent` tool, but not the roster the tool needs). The roster is injected
  into top-level sessions only. Substituted instrument, a real fresh session:

  ```
  $ claude -p --model haiku 'From your system prompt only: list every available agent
    type matching <model>-<effort> … then answer yes/no: is opus-medium present? is
    haiku-max present?'
  fable-high  fable-max  fable-xhigh  haiku-low  opus-high  opus-low
  opus-max    opus-medium  opus-xhigh  sonnet-high  sonnet-medium  sonnet-xhigh
  **Total: 12**
  **Is opus-medium present?** Yes
  **Is haiku-max present?** No
  ```

  Exactly the twelve survivors. **The control is this Builder's own session**, which
  started before the `git rm`: its roster still enumerates all twenty tiers, `haiku-max`
  included, and stayed that way for the rest of the build. Same question, two sessions,
  opposite answers, one file-system state — definitions load at session start and never
  reload. That is precisely why the law now reads *mint before ignition*.

- **F9 — the rig never reads `canon/agents/` (charge-requested confirmation).** The only
  occurrence of `agents` in `summon/summon.zsh` is line 321, the mantle path inside the
  summons string (`wear ~/code/agents/canon/mantles/$_summon_mantle.md`); the engine half
  is composed as `--model $_summon_model --effort $_summon_effort` flags. `lab/008/run`
  agrees — its arms assert on flag strings (`args=--model haiku --effort max …`) and its
  `$CITY/agents` is a fixture building root, not the tier directory. **Consequence: the
  rig can still fire a retired combination** — `--model haiku --effort max` composes fine
  and always will. The prune governs dispatch (the `Agent` tool's roster), not the
  interactive rig, and the two will now disagree by construction. That is the design, not
  a defect, but the rig's picker still offers all four models × five efforts with no hint
  that eight of the twenty have no dispatch counterpart.

---

Kickoff (verbatim):

```
You are a Builder at opus-medium.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/042-grid-prune.md and build it.
```
