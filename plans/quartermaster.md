# Quartermaster — the peer plane, a keel-note

**Status: deliberation — nothing here is dispatchable, nothing ratified.** Written
2026-08-08 by GA-06 at Felix's ask, while he deliberates; the peer-messaging
experiment is PARKED (GENESIS §5). Facts below are dated to Claude Code ~2.1.226
(12-F1's stream names) and WILL rot — re-verify before building on them.

## 1. The plane — what exists today

- **Discovery + messaging is machine-level, scoped to the OS user, not the config
  dir** — it crosses all three account silos: the first live cross-account channel
  the Guild has had. Evidence: this sitting's ListAgents probe returned 14 idle
  Guild windows spanning the hives; the docs name the OS-user socket restriction
  (cross-session-messaging.md).
- **The roster schema is thin:** session name · short id · type (interactive) ·
  state (idle/busy) · started-ago. Absent: account, project, model/tier, current
  task. The session name is the plane's ONLY semantic carrier (→ §5).
- **A message is input, never a command.** It lands in the recipient's conversation
  at a turn boundary; the recipient acts under its own summons, charter, and
  permission mode. Authority does not travel on the wire — it must already exist at
  the recipient. No remote read, no remote stop, no privileged anything.
- **Delivery states exist** (delivered / held / refused), reported to the sender.
  **No audit trail** — the plane is ephemeral; the relay log is the only record we
  keep (dispatcher charter §6).
- Adjacent: in-process subagents can be continued with context intact — tier frozen
  at spawn, so a wrong-tier gate re-runs FRESH (the G16 remedy). Remote machines:
  reply-only. Agent teams: experimental, env-gated — watch, don't adopt.

## 2. The pivotal unknown — wake semantics

**Does a message WAKE an idle interactive window (run a turn with nobody at the
keyboard), or queue until Felix next touches it?** Everything forks here:

- **Wakes** → standing pools are autonomous: pre-summoned windows act the moment
  their dependency lands. Maximum capacity — and a new unattended-execution surface
  in windows whose permission modes were set for attended use.
- **Queues** → pools are pre-staged context: zero cold-start, no re-orientation —
  but Felix remains the clock that makes windows tick.

**The probe** (two windows, Felix watching, ~20 min, controls per DOCTRINE §6.2):

1. **Idle wake:** window B idle; A messages it. Does B run a turn unattended?
   Control: the same message to B while Felix drives it — the known-delivered path.
2. **Cross-account:** A and B on different config dirs. Delivery confirmed from B's
   own transcript, never inferred from the sender's receipt.
3. **Held/refused:** message B mid-turn (held?); establish what refusal is and who
   issues it.
4. **Attribution:** what B actually sees — sender name? id? Can B distinguish a peer
   poke from Felix's own typing? (Load-bearing for message-never-summons.)

## 3. The unlocks — why this matters

- **Felix leaves the data plane.** Today he is the Guild's only live router between
  windows — D44's objective exists because his hands are scarce. Pokes carry the
  handoffs; his judgment stays, batched at Felix-gates. The baton specializes:
  batons to Felix for judgment, pokes between sessions for delivery.
- **Three silos, one schedulable pool.** Chains hop accounts live; the quota
  arbitrage the usage panel shows Felix becomes routable by a session.
- **The roster is a census.** Started-times against commit-times make law cohorts
  visible — the D46 paste found its one window by Felix's intuition; a sweep finds
  every stale window mechanically. Presence, staleness, propagation: observability
  the Guild has never had.
- **Substrate-shaped.** D39 gated the Royal Architect on a substrate that didn't
  exist. A live wire reaching every session across every account on the machine is
  its first plank. Not a minting argument — a bearing to watch.

## 4. The mantle question

- **Not a new mantle for most of it:** in-batch poking is the Dispatcher's mission
  (D43 — "spare Felix the handoffs"); its charter has used SendMessage on its own
  subagents since the founding. Reaching interactive windows in its chain is charter
  growth, gated on the parked experiment.
- **The uncovered duty:** cross-theater logistics — warming the day's pool, routing
  chains across accounts by quota, law-cohort sweeps at canon changes, roster
  hygiene. Today that duty's name is *Felix's hands*; no charter owns it.
- **Candidate name: Quartermaster** (runner-up: Marshal). One per machine, logistics
  altitude only, zero content authority — the Dispatcher's discipline at Guild
  scale.
- **The path (D26's discipline — no charter without a birthplace):** the §2 probe →
  a one-day experiment, one session playing Quartermaster for a day's pool under a
  brief → a charter only if the duty proves real and holdable. Felix's minting
  principle, recorded at his word: *all the best decisions have been driven by real
  pain* — the mantle mints when the routing labor hurts, not before.

## 5. The name-stamp (routed to the Architect desk)

The rig knows mantle, theater, and account at fire time; today session names are
hand-typed. Stamping `<mantle>-<theater>-<account>` (exact scheme the Architect's
call) turns the roster from anonymous doors into a live map of the Guild. Felix's
call, 2026-08-08. Routing: summon-rig work — an Architect row, widened into the
standing row-11 summons (ledger, 2026-08-08 addendum). The naming convention returns
to canon by harvest if tools ever start parsing it.

## 6. Guard-rails already standing — no new law needed to hold the parking

- A message is never a summons — wearing law, deployed ×3.
- Pointers, never payloads — a truth existing only in a message is a defect.
- The relay log carries the audit the plane lacks.
- Tier is frozen at spawn; wrong-tier work re-runs fresh.

---

Unparked by Felix's word, nothing else. The pain signal to watch: the day his own
routing labor becomes the bottleneck he can feel.
