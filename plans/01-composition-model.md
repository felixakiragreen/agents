# 01 — The Composition Model

**Mantle · Tier:** Architect · fable-max · **Gate:** keel (LANDED) · **Status:** OPEN

## Mission

Design the composition model — capability tiers + mantle charters + the binding law —
and land `canon/agents/` and `canon/mantles/` as ratified canon. This is the campaign's
beefiest session by design (D4): it consolidates three proven artifacts, it does not
invent from air.

## Inputs — read before designing

1. `GENESIS.md` — the composition law you are elaborating.
2. `~/code/universal_robots_sdk/cap-mega/simmy/DISPATCHER.md` — **the grade bar for
   charters**: complete contract, forbidden list, relay rules, escalation triggers,
   summons. Every charter you write should survive comparison with it.
3. `~/code/universal_robots_sdk/cap-mega/simmy/README.md` §6–§8 — staffing rule ("Fable
   where a wrong conclusion is expensive; Opus where a wrong step is cheap"), working
   agreements, spike protocol (the Digger's embryo), the role-system motto.
4. `~/code/hexwright/CLAUDE.md` — Grand Architect / Area Architect / Builder embryo;
   session protocol; the session-workflow laws (clean boundaries, verbatim summons).
5. `~/code/universal_robots_sdk/cap-mega/.claude/agents/*.md` — the proven tier format,
   one example inlined here so you needn't dig:

```markdown
---
name: fable-high
description: Capability tier for dispatched work — Fable at high effort, preset only,
  no role content (task, role, protocols, and report format arrive in the prompt). Use
  where a wrong CONCLUSION is expensive — foundational verdicts, safety contracts,
  architecture, forensic deep dives.
model: fable
effort: high
---

You are a capability tier: this definition sets model and effort only. Your role, task,
working agreements, and report format arrive entirely in your prompt — follow them
exactly. If the prompt names documents to read, read them before acting.
```

## Questions to settle (the pre-chew)

1. **Tier naming grammar.** `fable-max`, `opus-med` — is it `med` or `medium`? Is fast
   mode a suffix (`opus-med-fast`)? Names appear in boards, briefs, charters, and
   `Agent(type=…)` calls forever — pick once.
2. **Matrix extent.** Full model × effort grid pre-minted, curated set, or
   mint-on-demand? Models today: fable, opus, sonnet, haiku; efforts low → max. Not
   every cell is sane (haiku-max?). Tiers are data — weigh a complete lookup table
   against a curated zoo. Simmy minted on demand and it caused one escalation class
   ("tier named but not defined").
3. **Fast mode.** Simmy boards staffed "Opus · med (fast)" but tiers never encoded it.
   Can subagent frontmatter pin fast mode at all (harness: `/fast` toggles it,
   Opus-only today)? If not, where does fast-ness live — board annotation, dispatch
   rider, interactive-only?
4. **Frontmatter contract.** Verify what `effort:` accepts (low|medium|high|xhigh|max)
   and whether `tools:` restrictions belong in any tier. Empirically test a dispatch if
   uncertain — don't ratify guesses.
5. **Charter template.** The sections every mantle must have. Candidate skeleton:
   mission · default staffing (tier) · owns / powers · forbidden (single-glance list) ·
   deliverables & end-of-session protocol · summons (interactive + dispatched, verbatim)
   · escalation triggers.
6. **The five charters.** Port Dispatcher (127 proven lines — generalize away
   simmy-specifics like board location and bulletin path, keep the load-bearing relay
   rules). Write Architect and Grand Architect (hexwright embryo + this campaign as the
   GA's own case law). Write Digger (generalize simmy §8: one brief = one session, kill
   criteria, findings evidence-grade, documented kill = win). Write Builder (hexwright:
   one work order, out-of-scope list is law, creep is a bug).
7. **The precedence law.** Felix's global CLAUDE.md says *"don't start writing code
   without asking."* A Builder charter says *"execute the order autonomously."* Both
   correct, different sessions. Ratify the rule (proposed: charter overrides global
   directives where they explicitly conflict; global personality/style always applies),
   write it INTO the charter template, and hand 03 the hook it must plant in the global
   CLAUDE.md.
8. **Delivery mechanism.** How does a session in any repo acquire a mantle?
   (a) read-by-path (`~/code/agents/canon/mantles/architect.md`), (b) deployed copies,
   (c) **mantles-as-skills** (`/architect` from anywhere — best UX; consequence: D3
   amends, `skills/` joins the sync set). Decide with evidence: check how skills are
   discovered per config dir and whether a skill can carry/verify its tier ("you should
   be running fable-max — stop and tell Felix if not" guard line).
9. **Summons grammar.** Canonical interactive phrase and canonical dispatch shape
   (`Agent(type=tier, prompt=mantle kickoff + brief + rider)`). Generalize simmy's
   standard rider (worktree rules, bulletin protocol, report-is-logistics-only) into a
   canon rider template — which parts are universal vs project-doctrine (02's turf)?
10. **Staffing guidance placement.** Simmy's staffing rule lives in tier descriptions
    AND README §6. Decide the single home (tier descriptions seem right — they travel
    with the tier) and keep charters pointing, not duplicating.

## Out of scope — creep is a bug

- Work-doc templates, board/brief/order formats, status vocabulary → **02** (note the
  soft interlock: if a charter needs doctrine vocabulary, use it and flag it for 02).
- Rewriting the global CLAUDE.md → **03** (you only hand it the precedence hook).
- Sync mechanics → **04**.
- Retrofitting hexwright/simmy (D5).

## Deliverables

- `canon/agents/*.md` — the ratified tier set.
- `canon/mantles/*.md` — five charters + a `README.md` stating the composition law
  operationally (how to summon, precedence law, rider template).
- `DECISIONS.md` appended (naming grammar, matrix extent, fast-mode ruling, precedence
  law, delivery mechanism — each a D-entry).
- `GENESIS.md` board updated; `LEDGER.md` appended.
- Any charter not finished at quality → a bounded work order in `plans/`, per D4.

## Kickoff (verbatim)

```
You are an Architect wearing the mantle at fable-max. Read GENESIS.md, then
plans/01-composition-model.md, and execute the brief.
```
