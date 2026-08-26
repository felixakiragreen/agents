# Issues — the incident inbox (D49)

Field reports and canon-fold candidates land here — Felix's hand, or a session's at
his word. The Grand Architect sweeps at every summons: each entry is ruled fold or
no-fold, then deleted — the D-entry records a fold, the sweep's ledger line records a
rejection, and git keeps the bytes (entries are committed before they are drained).
A swept inbox is empty.

---

From Felix, via the row-13 Architect (2026-08-22):

**Core-value candidate: eliminating redundancy OVER enforcing blind consistency.**
Consistency IS very important, but for its own sake it can become overbearing.
Birthplace: the row-13 name-stamp amendment — the Architect ruled theater into every
stamp "uniform scheme, no home-repo special case," stamping the Grand Architect
`grand-architect-agents-09`; Felix overruled mid-commit: there is only one GA office,
so its theater segment is redundancy, not information — `grand-architect-09`. The
reflex to watch for: "no special case" invoked to defend a segment/field/rule that
carries zero information in context. For the Grand Architect's sweep: where does this
land — the Coding Directives already gesture at it (§1 simplicity, §2.5 names), but
nothing states the tiebreak *redundancy-elimination beats consistency-for-its-own-sake*
as an explicit value.

---

From Felix:

New Rule: no directly spawned subagents. I NEED visibility into every agent that is running.

Incident: 

Felix:
> I can't see Row 30, even with /tasks - how do I see it?

Dispatcher:
> Row 30 is running as a subagent I spawned directly (Agent tool), not a background Bash job or a Workflow run — those are what /tasks lists. Subagents like this one don't surface in /tasks; I'm the only one tracking it, and I get notified when it lands or needs a decision (like the §7.1 gate it hit earlier).

If you want visibility into it yourself, your options are:
- Ask me for status any time — I'll relay what it's reported (verbatim, per the Dispatcher's relay rule).
- Wait for the completion notification — I'll post it here as soon as the waypoint_step* slice verdict comes back.

There's no /tasks-visible handle for it right now. Want me to poll it directly instead of waiting for its own notification?
---

From the Arborist close-out Architect, rooted repo (2026-08-26):

**Harvest verdict on the Arborist bet — mixed; the laws-in-CLAUDE.md pattern is a
qualified canon candidate.** The bet (arborist/README.md §1): if the structural laws
hold across two weeks of vibecoding sessions, the pattern harvests. Checked at close
(clock ran 08-13 → 08-26): the laws held wherever a mantled session ran — gates, splits,
previews, move-only all clean — but **not in unmantled vibecoding**: one new file was
born post-law at 772 lines (`Reading/LifeDeepDiveFlow.swift`, law 2's ceiling is 500)
and the four known fat files all grew further without the boy-scout extraction law
firing (ClaudeService +316 to 3,403). Lesson for the canon: prose law binds sessions
that read it into a role; it under-binds freewheeling feature sessions. If the pattern
harvests, it likely wants an enforcement hook (a hook/CI check on new-file line count)
riding with the prose. Birthplace: Arborist campaign, rooted repo,
`archive/arborist/README.md` §5 criterion 5 + close-out ledger 2026-08-26.
