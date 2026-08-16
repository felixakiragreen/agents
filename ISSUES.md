# Issues — the incident inbox (D49)

Field reports and canon-fold candidates land here — Felix's hand, or a session's at
his word. The Grand Architect sweeps at every summons: each entry is ruled fold or
no-fold, then deleted — the D-entry records a fold, the sweep's ledger line records a
rejection, and git keeps the bytes (entries are committed before they are drained).
A swept inbox is empty.

---

From Felix:

I like ISSUES, I'd like to consisder possibly extending it to be something all projects have by default. Primary purpose is for the Sovereign to add things while working on different projects or with null mantles. (I told a Rooted null mantle to add their problem to ISSUES for the Architect to review later; we frequently add things to simmy/ISSUES when we're using simmy, but not working on it.) Something to consider.

Additionally, I'm thinking of renaming GENESIS. Doesn't feel like the best name if it's the Master Plan or Master Doc.README would be more appropriate, although, I think I'd keep the README more for the purpose of: "How to start using & very high level of where everything is (like a thumbnail)". The GENESIS/MASTER_PLAN serves a different purpose. I don't like MASTER_PLAN though because it's two words. Blueprint is okay. Map is better. Ooh, I kind of like Map, leading contender right now.

---

From the cornerizer Architect, at Felix's word (2026-08-16):

**A running batch can be amended — an Architect should reach for that before cutting a
new batch.** Cornerizer batch 8 was mid-flight (one Builder row) when a freshly-cut spike
row had no real dependency on it; the Architect had sequenced it as "batch 9, after
batch 8" purely because both would have written the shared campaign tree. Felix asked
"can't we just pass a line to the current Dispatcher?" — and yes: give the new row its
own worktree, raise the ceiling, commit the amendment to the batch note, hand the
Dispatcher one message. The convention (pure-analytic rows ride the shared tree) had
been masquerading as a dependency. Candidates for canon: (1) the Dispatcher mantle
states that its batch is amendable mid-flight by the Architect — a new row arrives as a
message, same contract as the original summons; (2) the Architect mantle's batch-cutting
step asks "is a Dispatcher already running whose batch this row can join?" before
cutting a sequenced batch — we could have done this earlier and didn't think of it.
One wrinkle from the same incident: agent-to-agent relay of the amendment failed —
ListAgents showed no Dispatcher (likely another account silo; sessions never cross
accounts), so the relay went through Felix's hand. An amendment protocol should name
that fallback: the Architect drafts the message verbatim; whoever can see the Dispatcher
delivers it.

---

From Felix: I want JS/TS projects to default to using bun & bun test, not npm & vitest. I've had to specify this twice now. It doesn't *feel* like Canon or a Decision thing. Besides, there will probably be a new JS runtime tomorrow, so it needs to be regularly update-able. But, it's overkill to put in the global CLAUDE.md. I'm unsure.

Invocations need to be able to customize and/or auto-derive session names. For example:
- grand-architect-08, next is grand-architect-09
- architect-whiteboardy-02, next is architect-whiteboardy-03

---