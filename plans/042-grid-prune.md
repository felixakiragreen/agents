# 042 — the grid prune

**Status:** OPEN — laid 2026-09-01 · **Depends on:** ⬡-gate: his word — the moratorium
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

- [ ] `ls canon/agents/` lists exactly the census survivors; the list and the re-run
      census pasted.
- [ ] `./sync/check` green ×3, pasted; `ls ~/.claude/agents/` matches `canon/agents/`.
- [ ] `grep -rl '<dead tier>' canon/` empty for every killed tier, except the README's
      one history line naming the kill; pasted.
- [ ] `bun test` green (102, or 041's count if it landed first); `doctrine lint
      ~/code/agents` adds no failure.
- [ ] From a fresh session, a one-line probe dispatched at a surviving tier reports the
      available agent types as exactly the survivors — D8's fact re-verified; pasted.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

---

Kickoff (verbatim):

```
You are a Builder at opus-medium.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/042-grid-prune.md and build it.
```
