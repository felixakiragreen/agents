# P4 — restore semantics

**Status:** OPEN · **Depends on:** P2 (the recipe); P1 + P2 LANDED — this row kills
the venue, never runs concurrent · **Staffing:** Digger · opus-high

## Questions

1. What actually happens to a live `claude` turn (mid-generation) in a cmux pane on
   quit/relaunch? Claimed (keel §4, read from docs): the process dies; layout +
   scrollback restore; sessions return via their own resume. Measure it.
2. How much is lost — the in-flight turn, the last messages? — and does
   `claude --resume <uuid>` recover cleanly in the restored pane?
3. Baseline control: the same kill in a plain terminal tab — what does ANY terminal
   death cost a session? The delta is cmux's actual contribution.

## Inputs — read before working

- P2's findings — the proven spawn recipe and the socket-access verdict; do not
  re-derive.
- [README §5](../README.md): the cmux desktop is Felix's live screen.

## Method

**STOP precondition, checked first:** `cmux workspace list` shows ONLY probe
workspaces — any non-probe workspace → abort and reschedule with Felix; nobody
quits cmux over live work. Then: spawn a probe session (P2's recipe), start a long
turn (a slow counting prompt), quit cmux (`osascript -e 'quit app "cmux"'`),
relaunch (`open -a cmux`), observe the restore, attempt the resume. Repeat once for
confidence. Control per question 3. Cleanup at landing: close probe workspaces.

## Kill criteria

- Restore loses whole sessions (not just in-flight turns) irrecoverably → STOP,
  escalate: the substrate ruling (D4) reopens for the attended case too.

## Deliverables

Findings below — timeline transcripts per run, the control, loss accounting —
plus status current, commits (`lab/p4/`).

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/p4-restore-semantics.md,
and execute the brief.
```
