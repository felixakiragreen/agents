# P6 — the message transport

**Status:** OPEN · **Depends on:** — · **Staffing:** Digger · opus-high ·
**Parallel-safe with:** lane B (disjoint files: `lab/p6/` + spawned probes)

The Chat's send path ([deck-keel.md](deck-keel.md) §5). P2 T4 proved the naive
paths corrupt: `cmux send` rewrites literal `\n`/`\t`/`\r`, and paste into a
live Claude TUI splits at the first blank line and auto-submits — **a
truncated message that looks delivered is the disqualifying failure.** Felix's
own hand pastes multi-line messages into live sessions daily and they arrive
as ONE turn — so a safe mechanism exists; find it, prove it byte-exact.

## Questions

1. **Q1 — live-pane delivery.** Find the mechanism that lands a multi-line
   message (blank lines included) in a live, idle Claude TUI as exactly one
   user turn, byte-exact. Candidates, in order: (a) **bracketed paste** — wrap
   the payload in `ESC[200~ … ESC[201~` via `set-buffer`+`paste-buffer` or
   direct pty write (this is what a human paste sends; T4's split may have
   been the *absence* of the wrapper); (b) any cmux socket text-delivery API
   beyond `send` (enumerate the schema — P2 §A has the method); (c) others
   you find. Proof per mechanism: sha256 of the sent bytes ≡ the transcript's
   received user-turn bytes, N=3, including one payload with blank lines, one
   with literal tabs, one with `$(echo pwned)` unexpanded.
2. **Q2 — delivery mid-turn.** The same mechanism against a session that is
   actively working: does the message queue and land as the next user turn
   (the harness queues mid-turn input — measured from outside, not assumed)?
   Does it ever interrupt or corrupt the in-flight turn?
3. **Q3 — delivery to a dead session.** Resume-with-a-turn:
   `claude --resume <id> "<msg>"` shape (P2 Q3 proved resume +2 argv tokens;
   this adds the prompt). Byte-exact first-new-turn proof; silo intact; the
   B5 E2 law (omitted-never-guessed) extended, not violated — resume WITH a
   message is a deliberate send, not an injected guess.
4. **Q4 — the failure faces.** For the winning mechanism: what does each
   failure look like from the glass side (dead pane, wrong surface id,
   mid-compact, TUI in a dialog — B7 F1's trust dialog included)? Every
   failure must be *detectable* (the send verifies via transcript read after
   delivery — spec the verification read).

## Inputs — read before working

- [deck-keel.md](deck-keel.md) §5 + §11 (the write class this probe arms).
- [p2-spawn-recipe.md](p2-spawn-recipe.md) §§T1–T4 — the transport law as
  known; do not re-derive the `send` corruption.
- P1 (census events — your delivery verification reads beats + transcripts).
- README §§2, 5 — fence and venue agreements.

## Method

Probe sessions are haiku-low, fired through `/hands/fire` into `~/code/agents`
(trusted), ≤2 concurrent, workspaces closed at landing (D55). Bracketed paste
first — it is the human-hand mechanism and the likeliest winner. Every arm
ships with a control (a payload the mechanism is KNOWN to corrupt, proving the
probe can see corruption).

## Kill criteria

- No mechanism achieves byte-exact single-turn delivery with blank lines →
  the Chat ships read+jump permanently and the keel §5 fallback becomes the
  law; document and stop — that is a win, not a failure.
- A mechanism that works but cannot make failure *detectable* (Q4) is
  disqualified — silent maybe-delivery is worse than no delivery.
- One session; Q2/Q3 not fitting at quality become named remainders.

## Deliverables

Findings (evidence-grade, controls named); **the transport law** as its own
subsection — mechanism, exact wrapper bytes, verification read, failure
faces — consumed verbatim by B16's send and D18's write class 1; `lab/p6/`;
workspaces closed.

## Findings

*(append here — evidence-grade: every claim carries the command and output
that proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md §5,
and ~/code/agents/belvedere/plans/p6-message-transport.md,
and execute the brief.
```
