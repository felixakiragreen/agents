# C4 — headless physics

**Status:** OPEN — laid 2026-08-29 · **Depends on:** ⬡-gate: the cornerstone
blessing · **Staffing:** Digger · opus-high

## Mission

Measure `claude -p` (print mode) against the nine capabilities of the substrate
contract ([../cornerstone.md §4](../cornerstone.md)), ×3 accounts. Deliver the
**event grammar** the fake claude (C5) will speak and the engine (C6) will trust.
The bet this charge can kill: headless as the engine venue.

## Inputs — read before working

- [../cornerstone.md](../cornerstone.md) — the bet, the contract, the arc.
- [../README.md](../README.md) — the fence; budget law; subject hygiene.
- Do not re-derive (evidence already landed): P1 — ten hook events, venue-blind,
  `Stop` is the idle sensor; P2 — the summons travels as argv, byte-exact; P5 —
  permission physics interactive: the matrix, two stall signatures (permission:
  beats + `Notification why=permission_prompt`; trust: zero beats, no transcript),
  posture read off `PreToolUse` only, haiku cannot enter `auto` (silent fallback);
  P6 — TUI send physics (the wall v3 routes around; nothing to re-measure).
  All in [../../plans/](../../plans/) (p1-, p2-, p5-, p6-).
- Steal-list hypotheses to verify, not trust: `CLAUDE_CONFIG_DIR` never `HOME`
  (keychain); resume cursor = session id + last-assistant uuid (t3code, via the
  founding record §3).
- **Flag names in this doc are hypotheses** — `claude --help` is the authority at
  run time. A capability that seems absent gets ≥3 distinct attempts before
  "absent" is written, and the control law applies (probes ship with a control).

## Questions

1. **The grammar.** Raw `--output-format stream-json` captures for the task set
   (below): every event type seen, its fields, the turn-boundary markers, ids
   (session id, message uuids), usage fields, the resume cursor's true shape.
2. **Multi-turn — the two arms.** (a) Turn-per-invocation: `-p` then
   `-p --resume <id>` ×≥3 turns — the injected bytes appear as real user turns,
   byte-exact, transcript whole. (b) One process: `--input-format stream-json`,
   a second user turn over stdin mid-session. Both arms ×3 accounts; evidence for
   C6's pick: cold-resume latency, integrity, failure modes.
3. **Sensing.** Do the census's ten hook events fire in print mode? (Control: the
   same account's interactive session fires them the same day.) Independently: can
   the four sense states — working · idle · needs-⬡ · dead — be computed from the
   stream alone? Map each state to its event signature.
4. **Permission physics headless.** P5's matrix in print mode, sonnet·low ×3
   accounts, per posture (default / acceptEdits / plan / bypass — names from
   `--help`): what does a permission-needing tool call DO — block, exit, emit,
   auto-deny? The stall's signature (control: P5's interactive signatures). Name
   the unattended posture for engine steps.
5. **Summon-to-terminal.** A print-born session resumed interactively in a real
   terminal: full history rendered? work continues by hand? then resumed headless
   again — round-trip integrity. Plus the Chat's read path: transcript location,
   live tail-ability during a headless turn.
6. **Kill + survive.** SIGTERM and SIGKILL mid-turn: transcript state after
   (whole up to the cut?), resume viability. Parent-death: the spawning process
   dies mid-turn — does the subject finish and write its transcript?
7. **Identity ×3.** `CLAUDE_CONFIG_DIR` per account headless: auth works
   (keychain), the session lands in that account's projects dir, the census join
   key (`session_id`) present in hook env, and **enumerate** — list live headless
   sessions per account from files alone.
8. **Concurrency smoke.** 10 simultaneous subjects, one account: spawn latency
   distribution, transcript/lock collisions, census fidelity 10/10. Conditions
   recorded per run (load, machine state) — measurements carry their conditions.

## Method

- **The task set** (deterministic micro-tasks; subject prompts never mention this
  repo): T-echo (reply `pong`, no tools) · T-write (write `ping.txt`, one tool) ·
  T-multi (three writes + one read) · T-perm (a call that needs permission under
  `default`) · T-ask (ask one question and wait) · T-sub (one subagent, for
  `SubagentStop`) · T-long (~60 s of tool work, for mid-turn kills).
- **Venue:** scripts (bun) and captures commit to `v3/lab/c4/` — captures are
  C5's contract. Subject cwds live in scratch, are deleted at landing (D55's
  analog). Digs commit straight to `master`, explicit paths only.
- **Conditions line on every capture:** account · model · posture · venue trust ·
  cwd class · timestamp. Contaminated numbers re-run or are struck inadmissible.
- **Subjects:** haiku·low where the subject needn't act unattended-smart (grammar,
  lifecycle, kills); sonnet·low for permission/behavior questions (P5). `bypass`
  posture only inside throwaway scratch venues.
- **Deliverable shape:** `v3/lab/c4/grammar.md` — event types, turn boundaries,
  cursor semantics, the sense-state mapping (the four states → event signatures) —
  plus `v3/lab/c4/captures/`, plus Findings here.

## Kill criteria

- **K1 — the injection kill.** Neither Q2 arm delivers a second user turn with
  transcript integrity on any account (denominator: 2 arms × 3 accounts, ≥3
  attempts each) → headless-as-engine-venue is KILLED. Stop, file, escalate to
  the Architect — G4 arrives early with the evidence.
- **K2 — the sensing kill.** Print sessions emit neither hooks (0/10 with the
  interactive control green) nor stream events sufficient to compute all four
  sense states (denominator: 4 states, each induced ≥2× per account) → headless
  sensing is KILLED. Stop, file, escalate.
- Everything else is a finding, never a kill: a lossy summon-to-terminal degrades
  the fallback (the Chat is primary, D20); a missing hook narrows the census; slow
  spawn is a number.

## Escalation points

- Any variation needing a settings or hook change in a **live** config dir — the
  sync set is live ×3; a probe never edits it. A throwaway `CLAUDE_CONFIG_DIR`
  clone that fails auth is a finding + escalation, not a workaround hunt.
- Any need beyond the stock `claude` CLI, bun, and system tools — nothing
  third-party is named here, so nothing is authorized (D54).

## Budget

≤100 subject turns total, models as above — trivial prompts; the bill is cents,
the line exists so overrun is a ⬡-fork, not a surprise.

## Out of scope

No engine building, no fake claude, no deck code, no settings edits, no canon, no
cmux work. Anything broken found in v2 files to [../../ISSUES.md](../../ISSUES.md)
and moves on.

## Findings

*(append here)*

---

```
You are a Digger at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c4-headless-physics.md.
```
