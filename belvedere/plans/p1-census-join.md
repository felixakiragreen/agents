# P1 — the census join

**Status:** OPEN · **Depends on:** — (batch note: fire inside a cmux pane) ·
**Staffing:** Digger · opus-high · **Parallel-safe with:** P2, P3
**Re-cut 2026-08-26 (Architect):** question 5 added — canon D67 routes Felix's
visibility decree here.

## Questions

1. Which hook events fire across a session's life — SessionStart, UserPromptSubmit,
   PreToolUse, Stop, Notification, SessionEnd — and what fields ride each payload
   (session id, cwd, transcript path, …)? Captured verbatim, per event.
2. Are `CMUX_WORKSPACE_ID` / `CMUX_SURFACE_ID` visible in the hook process env when
   the session runs inside a cmux pane? This is the deterministic session↔pane join
   (keel §4) — the glass's liveness sensor hangs on it.
3. Heartbeat cost: what latency does a one-line-append hook add per event? Target
   ≈ 0 — measured, not guessed.
4. Propose the census record: one JSONL line per event — fields named, derived from
   what (1) and (2) actually provide. Home: `summon/log/census/` (README D6,
   gitignored — verified at founding).
5. Subagent visibility (canon D67): when a session dispatches via the Agent tool, a
   background Bash job, or a Workflow run, which of those lifecycles surface in the
   PARENT session's hook events — and with what identifying fields? Deliverable per
   vehicle: countable from hooks, or the blindness named precisely. The full
   no-invisible-agents law is cut canon-side from what this census proves — the
   mechanism signs the charter.

## Inputs — read before working

- [README](../README.md) §§1–3 (the bet, the fence, the organs) and the keel §5
  (the missing sensor) — do not re-derive the design.
- Hooks land **project-local**: a scratch project dir carrying its own
  `.claude/settings.json`. The per-account `~/.claude*/settings.json` deploy is a
  later **Felix-run** ritual (D14's pattern) — NOT this row's venue; touching a
  live settings file is a STOP.
- You are fired inside a cmux pane (batch note) precisely so the CMUX_* env is
  measurable from your own session's hooks; a scratch session you spawn beside
  yourself works too.

## Method

Suggested route: scratch dir whose hooks append `ts · event · payload fields ·
$CMUX_*` to a census file; drive a short session through prompt / tool-use / idle /
notification / end; capture each payload verbatim; time the append overhead (N=20).
Control (DOCTRINE §6.2): an identical session with NO hooks, same actions — prove
the census file stays silent there and speaks under hooks.

## Kill criteria

- Project-local hooks don't fire at all → STOP, escalate: the v0 deploy design
  changes shape.
- `CMUX_*` absent from hook env → NOT a kill: file the finding plus candidate
  fallbacks (pane title stamp, tty, cmux CLI census) and continue questions 1/3/4.
- Per-event overhead > 50 ms → STOP, escalate: the sensor would tax every session
  in the city.
- Subagent lifecycles invisible to every hook event → NOT a kill: the precisely
  named blindness IS the finding (D67 — it shapes the canon law and the glass's
  honest gaps).

## Deliverables

Findings below — verbatim payload excerpts per event, the control run, timings —
plus the proposed census record schema, status current, commits (`lab/p1/`).

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/p1-census-join.md,
and execute the brief.
```
