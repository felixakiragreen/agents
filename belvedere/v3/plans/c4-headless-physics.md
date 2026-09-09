# C4 — headless physics

**Status:** LANDED 2026-08-29 — both kill criteria NO; grammar captured · **Depends on:** ⬡-gate: the cornerstone blessing · **Staffing:** Digger · opus-high

## Mission

Measure `claude -p` (print mode) against the nine capabilities of the substrate contract ([../cornerstone.md §4](../cornerstone.md)), ×3 accounts. Deliver the **event grammar** the fake claude (C5) will speak and the engine (C6) will trust. The bet this charge can kill: headless as the engine venue.

## Inputs — read before working

- [../cornerstone.md](../cornerstone.md) — the bet, the contract, the arc.
- [../README.md](../README.md) — the fence; budget law; subject hygiene.
- Do not re-derive (evidence already landed): P1 — ten hook events, venue-blind, `Stop` is the idle sensor; P2 — the summons travels as argv, byte-exact; P5 — permission physics interactive: the matrix, two stall signatures (permission: beats + `Notification why=permission_prompt`; trust: zero beats, no transcript), posture read off `PreToolUse` only, haiku cannot enter `auto` (silent fallback); P6 — TUI send physics (the wall v3 routes around; nothing to re-measure). All in [../../plans/](../../plans/) (p1-, p2-, p5-, p6-).
- Steal-list hypotheses to verify, not trust: `CLAUDE_CONFIG_DIR` never `HOME` (keychain); resume cursor = session id + last-assistant uuid (t3code, via the founding record §3).
- **Flag names in this doc are hypotheses** — `claude --help` is the authority at run time. A capability that seems absent gets ≥3 distinct attempts before "absent" is written, and the control law applies (probes ship with a control).

## Questions

1. **The grammar.** Raw `--output-format stream-json` captures for the task set (below): every event type seen, its fields, the turn-boundary markers, ids (session id, message uuids), usage fields, the resume cursor's true shape.
2. **Multi-turn — the two arms.** (a) Turn-per-invocation: `-p` then `-p --resume <id>` ×≥3 turns — the injected bytes appear as real user turns, byte-exact, transcript whole. (b) One process: `--input-format stream-json`, a second user turn over stdin mid-session. Both arms ×3 accounts; evidence for C6's pick: cold-resume latency, integrity, failure modes.
3. **Sensing.** Do the census's ten hook events fire in print mode? (Control: the same account's interactive session fires them the same day.) Independently: can the four sense states — working · idle · needs-⬡ · dead — be computed from the stream alone? Map each state to its event signature.
4. **Permission physics headless.** P5's matrix in print mode, sonnet·low ×3 accounts, per posture (default / acceptEdits / plan / bypass — names from `--help`): what does a permission-needing tool call DO — block, exit, emit, auto-deny? The stall's signature (control: P5's interactive signatures). Name the unattended posture for engine steps.
5. **Summon-to-terminal.** A print-born session resumed interactively in a real terminal: full history rendered? work continues by hand? then resumed headless again — round-trip integrity. Plus the Chat's read path: transcript location, live tail-ability during a headless turn.
6. **Kill + survive.** SIGTERM and SIGKILL mid-turn: transcript state after (whole up to the cut?), resume viability. Parent-death: the spawning process dies mid-turn — does the subject finish and write its transcript?
7. **Identity ×3.** `CLAUDE_CONFIG_DIR` per account headless: auth works (keychain), the session lands in that account's projects dir, the census join key (`session_id`) present in hook env, and **enumerate** — list live headless sessions per account from files alone.
8. **Concurrency smoke.** 10 simultaneous subjects, one account: spawn latency distribution, transcript/lock collisions, census fidelity 10/10. Conditions recorded per run (load, machine state) — measurements carry their conditions.

## Method

- **The task set** (deterministic micro-tasks; subject prompts never mention this repo): T-echo (reply `pong`, no tools) · T-write (write `ping.txt`, one tool) · T-multi (three writes + one read) · T-perm (a call that needs permission under `default`) · T-ask (ask one question and wait) · T-sub (one subagent, for `SubagentStop`) · T-long (~60 s of tool work, for mid-turn kills).
- **Venue:** scripts (bun) and captures commit to `v3/lab/c4/` — captures are C5's contract. Subject cwds live in scratch, are deleted at landing (D55's analog). Digs commit straight to `master`, explicit paths only.
- **Conditions line on every capture:** account · model · posture · venue trust · cwd class · timestamp. Contaminated numbers re-run or are struck inadmissible.
- **Subjects:** haiku·low where the subject needn't act unattended-smart (grammar, lifecycle, kills); sonnet·low for permission/behavior questions (P5). `bypass` posture only inside throwaway scratch venues.
- **Deliverable shape:** `v3/lab/c4/grammar.md` — event types, turn boundaries, cursor semantics, the sense-state mapping (the four states → event signatures) — plus `v3/lab/c4/captures/`, plus Findings here.

## Kill criteria

- **K1 — the injection kill.** Neither Q2 arm delivers a second user turn with transcript integrity on any account (denominator: 2 arms × 3 accounts, ≥3 attempts each) → headless-as-engine-venue is KILLED. Stop, file, escalate to the Architect — G4 arrives early with the evidence.
- **K2 — the sensing kill.** Print sessions emit neither hooks (0/10 with the interactive control green) nor stream events sufficient to compute all four sense states (denominator: 4 states, each induced ≥2× per account) → headless sensing is KILLED. Stop, file, escalate.
- Everything else is a finding, never a kill: a lossy summon-to-terminal degrades the fallback (the Chat is primary, D20); a missing hook narrows the census; slow spawn is a number.

## Escalation points

- Any variation needing a settings or hook change in a **live** config dir — the sync set is live ×3; a probe never edits it. A throwaway `CLAUDE_CONFIG_DIR` clone that fails auth is a finding + escalation, not a workaround hunt.
- Any need beyond the stock `claude` CLI, bun, and system tools — nothing third-party is named here, so nothing is authorized (D54).

## Budget

≤100 subject turns total, models as above — trivial prompts; the bill is cents, the line exists so overrun is a ⬡-fork, not a surprise.

## Out of scope

No engine building, no fake claude, no deck code, no settings edits, no canon, no cmux work. Anything broken found in v2 files to [../../ISSUES.md](../../ISSUES.md) and moves on.

## Findings

*Deliverable: [../lab/c4/grammar.md](../lab/c4/grammar.md) — the event grammar C5 speaks and C6 trusts. Captures: [../lab/c4/captures/](../lab/c4/captures/) (43 capture dirs, each with `stdout.jsonl` + `conditions.json`). Scripts: `../lab/c4/*.ts`. Spend: **~65 subject turns of the ≤100 ceiling**, $1.69.*

**Both kill criteria fired NO. Headless survives as the engine venue.**

### F0 — the clean room, and why every prior number would have been cmux's

`which claude` inside a cmux pane resolves to a **cmux shim**, and ~40 `CMUX_*`/`CLAUDE_CODE_*` vars leak into any child:

```
$ which claude
/var/folders/00/…/cmux-cli-shims/87590454-…/claude      # bash wrapper ->
                        /Applications/cmux.app/Contents/Resources/bin/cmux-claude-wrapper
$ ls -la ~/.local/bin/claude
… -> /Users/felix/.local/share/claude/versions/2.1.251   # the real binary
$ env | grep -ci "cmux\|claude\|anthropic"
43
```

Every C4 subject spawns from `lib.ts:cleanEnv()` — exactly eight variables, `HOME` never overridden — against the real binary. **The t3code steal-list hypothesis is confirmed:** `CLAUDE_CONFIG_DIR` per account with `HOME` intact authenticates on all three accounts (`apiKeySource: "none"`, i.e. keychain OAuth), 15/15 subjects. *A v3 measurement taken through the shim measures the layer v3 is retiring.*

### F1 — Q1: the grammar. Captured, and `result` is not the process

Full table in [grammar.md §1](../lab/c4/grammar.md). The load-bearing surprise:

**One invocation can emit more than one `result`.** `captures/q1-sub-personal` (one subagent) emitted `Stop`, then a *second* `system/init` + `UserPromptSubmit` + `result` when the subagent's completion re-invoked the parent — two `result` events, one process. **C6 reads to EOF and takes the last `result`; "the process exited" is not the turn boundary.**

`--include-hook-events` folds the hook lifecycle into the same stream (`system/hook_started` + `hook_response`, each naming its `hook_event`), so the engine needs no hook plumbing of its own to sense its own subjects.

### F2 — Q1: the resume cursor is the session id alone, and the engine may pick it

`--session-id <uuid>` is honored (**10/10 under concurrency**, `captures/q8-10x-personal.json` `sid_honored=10/10`), so the id exists before the process does — no ignite→parse→record race, and a subject killed before it emits `init` is still addressable.

The steal-list's "session id + last-assistant uuid" **exists on disk** — `{"type":"last-prompt","leafUuid":…,"sessionId":…}` — but **is not needed**: `--resume <sid>` alone worked in 24/24 measured turns. **C6 persists the session id and nothing else.** Caveat: `last-prompt.lastPrompt` collapses newlines to spaces — it is a display field; audit against the `user` row's `message.content`.

### F3 — Q2 / K1: NOT KILLED. Both arms deliver, 24/24 byte-exact

Denominator satisfied: **2 arms × 3 accounts × 4 turns**. The payload was chosen to break TUI paste (blank lines, tabs, quotes, backticks, `$VAR`, `${BRACE}`, a leading `/not-a-slash-command`, `--not-a-flag`, `⚡ 中文 ünïcødé`); verified by sha256 of the transcript's `user` rows.

```
$ bun q2-inject.ts personal a          # arm A: -p, then -p --resume ×3
  turn0 sha=c69de9470f1bf437 BYTE_EXACT=YES uuid=f5b388c8 parent=null
  turn1 sha=79f6f3887749c92e BYTE_EXACT=YES uuid=8fe8fafe parent=a81936db
  turn2 sha=1549d89073042fdd BYTE_EXACT=YES uuid=465bc953 parent=4ec9448d
  turn3 sha=5da7b3806fbc851b BYTE_EXACT=YES uuid=a58e4778 parent=f5173453
                                        # identical 4/4 on thg-fgreen, thg-doorbell
$ bun q2b-paced.ts personal            # arm B: --input-format stream-json
  turn0..3 BYTE_EXACT=YES              # 4/4, and 4/4 on both other accounts
```

**P6's send wall does not exist headless.** For C6's pick:

| | arm A (turn per invocation) | arm B (one process, paced stdin) |
|---|---|---|
| latency/turn | ~5.3 s | **~3.0 s** |
| state between turns | **bytes on disk only** | a live process |
| crash exposure | none | the process holds the turn |

The ~2.3 s gap is cold process start — the literal price of cornerstone §3.2.

**Arm B's trap, measured:** dumping all four messages and closing stdin produced **2 `result`s for 4 messages**, turns 1–3 merged into one user row — bytes all present, turn boundaries destroyed (`captures/q2-b-personal`). Paced on `result`: 4 results, 4 user rows, `queued_turn_count: 0`. **If C6 picks arm B it must pace, and treat `queued_turn_count > 0` as merged turns.**

### F4 — Q3 / K2: NOT KILLED. Hooks fire headless; 8 of ten reach the census

K2 required *neither* hooks *nor* sufficient stream events. Hooks fired, so K2 cannot fire — and the census join key holds headless, venue-blind (P1's design, re-confirmed in print mode):

```
$ grep -Ff c4-sids.txt summon/log/census/census.jsonl | jq -r .ev | sort | uniq -c
  17 PreToolUse   16 UserPromptSubmit   16 Stop   15 SessionStart
  15 SessionEnd   11 PostToolUse         1 SubagentStop   1 SubagentStart
```

Absent, both structurally rather than broken: **`Notification`** (P1 measured it as a 60 s idle nag; `-p` exits at turn end and never idles) and **`PreCompact`** (needs a long session). Control: the same accounts' interactive sessions fired the full set the same day — this session is one of them, and F9's enumerator shows 21 live interactive sessions beating normally throughout.

### F5 — Q3: three of four sense states are observable. The fourth is not.

| state | signature |
|---|---|
| working | process alive, `init` seen, no `result` yet |
| idle | `result` with `permission_denials == []` |
| needs-⬡ (permission) | `result` with `permission_denials != []`; `system/permission_denied` names the tool |
| dead | process exit with **no `result`** (SIGTERM→143, SIGKILL→137) |
| **needs-⬡ (question)** | **none — indistinguishable from idle** |

```
T-echo  (idle)     {"subtype":"success","is_error":false,"stop_reason":"end_turn",
                    "terminal_reason":"completed","num_turns":1,"denials":0}
T-ask   (question) {"subtype":"success","is_error":false,"stop_reason":"end_turn",
                    "terminal_reason":"completed","num_turns":1,"denials":0}
```

Every field matches. **A question is not an observable headless; it must be made structural.** Measured fix — `--json-schema` works in print mode and returns a named cause, which is what contract §4.3 and invariant §5.5 require:

```
$ bun q3-schema.ts
done:        {"state":"done","cause":"Completed greeting and state report…"}
needs_input: {"state":"needs_input","cause":"Cannot write config file without:
              (1) filename, (2) format …","answer":"Provide the filename, …"}
```

**C6 declares a step-report schema.** (my_checklist's `QUESTIONS:` block is the same move by convention; a schema makes omission unrepresentable.)

### F6 — Q4: headless never stalls on permission. It auto-denies and reports success.

The single most dangerous finding of this dig. Full matrix in [grammar.md §4](../lab/c4/grammar.md); the shape of it:

```
$ bun q4-postures.ts personal              # T-write, sonnet·low, scratch cwd
default    got=auto              exit=0 res=success/false denials=0 FILE=YES
plan       got=plan              exit=0 res=success/false denials=0 FILE=no
manual     got=default           exit=0 res=success/false denials=1 FILE=no
dontAsk    got=dontAsk           exit=0 res=success/false denials=2 FILE=no
$ bun q4-postures.ts personal auto,acceptEdits,bypassPermissions haiku
auto       got=default           exit=0 res=success/false denials=1 FILE=no
acceptEdits got=acceptEdits      exit=0 res=success/false denials=0 FILE=YES
```

Three laws:

1. **`exit 0` + `subtype:"success"` + `is_error:false` does not mean the work happened.** Every row exits 0, including the ones that wrote nothing. The truth signal is **`result.permission_denials[]`**. A step with non-empty denials is **needs-⬡, never LANDED**. Headless's failure mode is a *silent success* — worse than a stall, and invariant §5.5 ("loud pauses") is exactly the parse rule that catches it.
2. **Posture asked ≠ posture granted, silently.** `manual`→`default`; haiku+`auto`→`default`. `system/init.permissionMode` reports what took effect (headless it is in `init`, cheaper than P5's `PreToolUse` read). **C6 reads it back and refuses on mismatch.**
3. **P5 F5's "haiku is not a legal model for an unattended step" is too broad headless.** haiku cannot hold `auto`, but holds `acceptEdits` and `bypassPermissions` and does the work. **The legal-model rule is per (model, posture), not per model.** *(Amendment-grade for B10/B11's schema — filed, not applied: the v2 engine is out of this charge's fence.)*

**The unattended posture for engine steps: `auto` at sonnet or above; `acceptEdits` where haiku is wanted.** `bypassPermissions` only in throwaway venues.

### F7 — Q6: the transcript is the truth; the stream dies with its reader

`captures/q6-*`, T-long (five `sleep 6 && echo STEPn`), cut at 20 s:

| cut | exit | `result` in stream | transcript after the cut | resumable |
|---|---|---|---|---|
| SIGTERM | 143 | **none** | 25 rows, 0 unparseable, no trailing partial line | **yes** |
| SIGKILL | 137 | **none** | 22 rows, 0 unparseable, no trailing partial line | **yes** |
| parent SIGKILLed | orphan reparented to **ppid 1** | (parent's pipe died) | **41 rows, complete, STEP5 present** | **yes** |

Every resumed session knew where it had been — *"I'd completed STEP1 and STEP2 out of 5"*. **No torn JSON line was ever observed.** The orphan finished all five steps and wrote its full transcript while the process that spawned it was already dead — cornerstone §4.9 holds, with the corollary C6 must internalize:

> **The stream is the parent's view and dies with the parent. The transcript on disk is the truth and does not.** A restarted engine re-derives from `<config>/projects/<slug>/<sid>.jsonl`, never from a stream it no longer holds.

*Instrument note (the charge's ≥3-attempts law): attempt 1 used `sh -c "exec …"`, which made the shell **become** claude — killing "the parent" killed the subject — and let the shell command-substitute the backticks in the prompt. Attempt 2 died on a wrong `bun` path. Attempt 3, with a real parent and no shell quoting, is the row above.*

### F8 — Q5: summon-to-terminal is lossless — behind a trust gate that can lock it

`captures/q5b-*`: headless ignite → real TUI on a pty (private tmux socket `-L c4`; the cmux desktop untouched) → hand turn → headless again, one session id throughout.

```
1. headless ignite: result="stored"                       # codeword HEADLESS-ALPHA-7
2. HISTORY RENDERED: codeword in pane = true, prior reply = true
3. HAND TURN LANDED = true (user turns 3 -> 4)            # codeword TERMINAL-BRAVO-9
4. headless again says "HEADLESS-ALPHA-7, TERMINAL-BRAVO-9"
   ROUND TRIP: headless-born=true  TUI-born=true
```

**D20's fallback is real.** But attempt 1, into a *scratch* cwd, stopped dead:

```
 Quick safety check: Is this a project you created or one you trust? …
 ❯ No, exit
```

`--help` states it — the workspace-trust dialog is skipped under `-p`, **and only under `-p`**. So a session can be *born* headless in a cold venue and be **unsummonable**: the pane renders nothing but the dialog. This is P5's trust stall on the viewport path. **C6 prechecks venue trust at ignite** (`glass/trust.ts`, per account — P5 F5.3), not at summon, or the fallback is missing exactly when it is wanted. *(A probe never edits a live config dir to warm a venue — the charge's escalation point; attempt 2 used an already-warm venue inside the fence, with `--tools ""` so the summoned TUI provably could not touch the repo it sat in.)*

### F9 — Q7: enumerate holds ×3 accounts, from files alone

`q7-enumerate.ts` — inventory from `<config>/projects/<slug>/<sid>.jsonl`, liveness from the census (`SessionStart` with no `SessionEnd`) + `kill(pid,0)`:

```
$ bun q7-enumerate.ts 3600000
 ●   personal       6902add3  83477   462  22:41:54  -Users-felix-code-agents
 ·   personal       876dbb60  -        17  22:41:31  …-c4-q3-schema-needs-input
 ●   thg-fgreen     b4817a51  29216   775  22:34:43  -Users-felix-code-agents
 …
totals: 82 sessions · live 21
  personal        43 sessions,  3 live
  thg-fgreen      21 sessions, 11 live
  thg-doorbell    18 sessions,  7 live
```

It finds this very session live (`6902add3`, personal) and marks every C4 headless subject dead, correctly. Identity, cwd, transcript size and pid all present. **Contract §4.7 met.**

### F10 — Q8: 10 simultaneous cost the wall time of one

```
$ bun q8-concurrency.ts personal 10
N=10 wall=4.7s  load 4.92 4.58 4.98 -> 5.25 4.65 5.01
latency ms: min=3459 p50=3778 p90=4655 max=4655
exit0=10/10 sid_honored=10/10 correct_answer=10/10 transcripts=10/10
census: 10/10 distinct sids, 4/4 expected events each — zero loss
```

A lone T-echo was 3.9 s; ten concurrent finished in 4.7 s. No transcript collisions, no lock contention, no census loss. Nothing argues against the §4.8 bar of 100 — C9 tests it.

### F11 — a turn costs ~3¢, not ~0.05¢ *(for G4's bar-5 extrapolation)*

```
$ cat captures/*/stdout.jsonl | jq -r 'select(.type=="result")|.total_cost_usd' \
    | awk '{n++;c+=$1} END{printf "turns=%d cost=$%.4f avg=$%.4f/turn\n",n,c,c/n}'
turns=51 cost=$1.6859 avg=$0.0331/turn
```

Trivial prompts at haiku·low and sonnet·low. The charge's budget prose ("the bill is cents") is low by ~50×; **the binding ceiling — ≤100 subject turns — held, and this dig spent ~65.** Not a ⬡-fork; recorded because C8/C9 must extrapolate from a true number. Cause: a subject inherits the account's full config — `init` reports **90 tools, 25 agents**, plus skills, plugins and CLAUDE.md — re-sent every turn. Layer 0 stays free (fake claude); a 25-subject layer-1 flow is ~$1–3 per run.

### F12 — a subject wears Felix's live canon unless the engine stops it

A haiku·low byte-echo probe in a scratch venue, given a nonsense task, quoted the Guild back (`captures/q2-b-personal`):

> *"I'm following the directives in your CLAUDE.md — particularly this part: 'A session wears a mantle … by Felix's explicit summons only, never self-adopted.' I'm not adopting new roles mid-conversation."*

Harmless here; **not** harmless for a fake-claude conformance suite or a fuzzed barrage, where subject behaviour would become a function of Felix's live canon — and the sync set is live ×3, so it changes under the engine's feet. **C5/C6 pick deliberately between `--bare`, `--safe-mode`, `--tools`, `--system-prompt` and `--setting-sources`, and record which.**

### The nine capabilities — the scorecard

| # | capability | verdict | evidence |
|---|---|---|---|
| 1 | **ignite** | **YES**, and the engine may choose the id | F2, F6 |
| 2 | **inject** | **YES**, two ways, 24/24 byte-exact ×3 accounts | F3 |
| 3 | **sense** | **YES for 3 of 4 states**; needs-⬡(question) needs `--json-schema` | F4, F5 |
| 4 | **read** | **YES** — transcript path is deterministic; stream is live | F1, grammar §2 |
| 5 | **resume** | **YES** headless→headless *and* summon-to-terminal, lossless — gated on venue trust | F3, F8 |
| 6 | **kill** | **YES** — state after the cut is defined, transcript never torn | F7 |
| 7 | **enumerate** | **YES** ×3 accounts from files alone | F9 |
| 8 | **scale** | **10/10 clean at zero marginal wall cost**; 100 is C9's | F10 |
| 9 | **survive** | **YES** — orphan finishes and rests on disk; engine re-derives from disk | F7 |

**The bet stands. Headless is the venue.**

---

```
You are a Digger at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c4-headless-physics.md.
```
