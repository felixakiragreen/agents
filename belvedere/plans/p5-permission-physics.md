# P5 — permission physics (S5)

**Status:** LANDED 2026-08-27 · **Depends on:** — · **Staffing:** Digger · opus-high

Probe #1 of the flow chapter ([flow-keel.md](flow-keel.md) §5.2). The engine (B11) will fire sessions nobody is watching; whether they can *work* unattended is this brief's question, and its kill criterion shapes the chapter.

## Questions

1. **Q1 — the mechanism.** Where does a spawned session's permission posture come from? P2 §S5 observed spawned sessions booting into **manual mode and blocking on the first tool call** despite `permissions.defaultMode: auto` on the account — yet the flow-cut Architect (fired from `/summon`, 2026-08-27) ran `mode:auto` end to end. Both facts are real; isolate what differs. Candidates to separate: cmux's per-session `--settings` injection (the flow-cut session's argv shows it injecting **hooks only** — no `permissions` key; verify), the account's `settings.json`, the project's own `.claude/settings.json`, and **trust state** (B7 F1: an untrusted project root stalls at the folder-trust dialog *before* any mode matters — P2's probes ran in scratch workspaces; decide whether S5's "manual mode" was ever a permission mode at all, or the trust dialog wearing its clothes).
2. **Q2 — sustained unattended work, the matrix.** A fired session must perform real tool work to completion with zero human touches: ≥10 tool calls including Write/Edit, Bash, and a `git commit`, then land. Prove it per account (×3) in (a) a trusted repo root and (b) a worktree of a trusted repo. The flow-cut sitting is the **standing positive control** for {personal · trusted root · master} — census `mode:auto` on every beat, dozens of unattended calls (ledger 2026-08-27) — do not re-derive that cell; probe the others.
3. **Q3 — the stall, reproduced with a control.** Recreate P2's stall deliberately (a fresh directory / fresh `git init` matches B7 F1's stall signature: process alive, zero census beats, no transcript) and name the blocking mechanism precisely. Then find the **minimal lever that clears it without exceeding the account's own posture** — candidates: pre-seeding trust (how does Claude Code record a trusted root? file, per account — find it and test writing it), `--permission-mode` or equivalent argv, a project `.claude/settings.json` carried in the venue. A lever that works is measured (the same venue goes stall → sustained work, N=2 each way).
4. **Q4 — the resume path.** A shelf resume (`--resume`, B5's path) into tool work: does the resumed session carry the same posture as its first life? One probe: fire, let it land, resume it with an instruction that requires a tool call, measure.
5. **Q5 — the step clause.** Emit the engine's **permission clause**: the exact field(s) a flow step must carry (if any), the venue **trust precheck** the engine must run before firing (B7 F1's per-account project-root rule — the composer's `trust.ts` already computes a verdict; say whether it is sufficient as-is), and the refusal rule: a step whose venue fails the precheck **refuses at arm time, loudly** (D10's family — never a silent mid-flow stall). This clause is B10's schema input and B11's fire-gate input.

## Inputs — read before working

- [flow-keel.md](flow-keel.md) §§4–5 — the contract this probe serves.
- [p2-spawn-recipe.md](p2-spawn-recipe.md) §S5 (line ~323) — the original observation, verbatim.
- [b7-summon-composer.md](b7-summon-composer.md) F1 — trust is the project root, per account, never inherited; 36/36 live trust entries sit on roots. `glass/trust.ts` is the computed verdict.
- [p1-census-join.md](p1-census-join.md) — `mode` rides every census event; the deploy note recorded `permissions.defaultMode: auto` on `~/.claude`. Verify the other two accounts' defaults rather than assuming.
- The standing positive control: ledger 2026-08-27 (flow-cut sitting) — its census rows (`mode:auto`, sid `d28a1397…`) and audit line (20:42:21Z).
- README §§2, 5 — the fence and the venue agreements. **Fires go through the glass's own `/hands/fire`** (dogfood; every probe fire is audited evidence).

## Method

Suggested route, not law: (1) read the injected `--settings` of a live spawned session from `ps` and the account settings ×3 — the mechanism map on paper first; (2) the Q2 matrix with haiku-low probe sessions whose summons is a self-contained work script ("write file X, run command Y, commit, exit") in a scratch **subdirectory of `~/code/agents`** (trusted, probes-commit-to-master law — keep probe commits to `belvedere/lab/p5/` paths only) and in a `bv/p5-*` worktree; (3) the Q3 stall arm in a fresh dir outside any trusted root, control arm beside it; (4) Q4 last. Every claim carries its command + output; the stall probes ship with the positive control run the same hour.

**Venue law:** the desktop is Felix's live screen — ≤2 concurrent spawned probe sessions, every probe workspace closed at landing (D55), no cmux quit/relaunch (P4-class excluded), no edits to cmux settings or any account `settings.json` — posture is *read and worked around*, never re-postured; re-posturing an account is Felix's, escalate if it is the only lever.

## Kill criteria

- **The chapter-shaper:** if no lever ≤ the account's own posture yields sustained unattended tool work in a *trusted* root on all three accounts → STOP, document, escalate to Felix: the engine chapter re-scopes to attended flows. This is the keel's named kill (§5.2).
- If the stall reproduces **only** in untrusted venues → not a kill: the finding is the trust precheck (Q5 clause), and the chapter proceeds.
- A lever that requires exceeding the account posture (`bypassPermissions`, editing account settings) → that arm stops; the lever is named in findings as ruled out by the posture floor (batch-4 note, blessing item 2).
- One session; if Q4 would not fit at quality, land Q1–Q3+Q5 and name Q4 a bounded remainder — never a rushed answer.

## Deliverables

Findings below (evidence-grade, controls named); **the permission clause as its own findings subsection** (B10/B11 consume it verbatim); `lab/p5/` scripts; probe workspaces closed; board row + ledger trued.

## Findings

**LANDED 2026-08-27 — no kill fired.** S5 was never a trust problem and never a cmux problem: **`--model haiku` cannot enter `auto` permission mode, on any account, and the fallback to `default` is silent.** Every stall P2 saw, and both stalls reproduced here, are haiku sessions meeting their first side-effecting Bash call. Sustained unattended tool work — 11 tool calls including three Writes, a Read, an Edit and a real `git commit`, zero human touches, zero permission prompts — landed in **6 of 6** matrix cells (3 accounts × {trusted root, worktree}) the moment the model was one that can hold `auto`. The engine chapter proceeds; it gains **two** arm-time prechecks, not one.

### F1 — Q1: the mechanism, isolated. The model decides the permission mode.

**The paper map first — three sources, all innocent.**

*(a)* All three accounts already ask for `auto`:

```
$ for d in ~/.claude ~/.claude-thg-fgreen ~/.claude-thg-doorbell; do cat $d/settings.json; done
{ "permissions": { "defaultMode": "auto" }, "model": "fable", … }   ×3, verbatim
```

*(b)* **cmux's per-session `--settings` injection carries hooks only — no `permissions` key.** Read off the argv of a live spawned session (the stalled probe of F3, pid 97551), the blob is `{"preferredNotifChannel":"notifications_disabled","hooks":{"SessionStart":[…], "Stop":[…],"SubagentStop":[…],"SessionEnd":[…],"Notification":[…], "UserPromptSubmit":[…],"PreToolUse":[…],"PostToolUse":[…], "PermissionRequest":[…]}}` — nine hook keys, nothing else. B4 F2's "`--settings` merges, both hook sets run" stands; it merges *nothing* about permissions.

*(c)* No project settings exist to blame: `.claude/settings.json` and `.claude/settings.local.json` are both absent from `~/code/agents` (`cat: No such file or directory`, both).

*(d)* And trust is not it — see F3.

**The live census already held the answer.** `mode` is `.permission_mode` off every hook payload (`census/beat.sh`), so 4 188 beats were sitting there as a survey (read before any P5 fire):

```
$ jq -r '[.mode,.acct]|@tsv' census.jsonl | sort | uniq -c | sort -rn
3248 auto     /Users/felix/.claude
 713 auto     /Users/felix/.claude-thg-fgreen
 104 auto     /Users/felix/.claude-thg-doorbell
  76 (null)   /Users/felix/.claude          ← SessionStart/End carry no mode
  37 (null)   /Users/felix/.claude-thg-fgreen
  14 default  /Users/felix/.claude
  10 (null)   /Users/felix/.claude-thg-doorbell
```

**Every one of the 14 `default` beats belongs to a glass-fired `haiku` session**, and every glass-fired session at a bigger model is `auto`. Joined by timestamp to `hands.jsonl`:

| fire (audit ts) | stamp | model | sid | mode |
|---|---|---|---|---|
| 04:26:48 | `digger-belvedere-audit` | haiku medium | `597b2b00` | **default** |
| 04:28:01 | `digger-belvedere-live` | haiku medium | `c6c6685a` | **default** |
| 13:11:59 | `builder-probe-row-03` | opus high | `4fa9aec1` | auto |
| 15:49:53 | `architect-scratch-01` | fable high | `98ade2de` | auto |
| 16:15:31 | `builder-belvedere-02` | haiku low | `5c73b3c0` | **default** |
| 16:16:43 | `builder-belvedere-03` | haiku low | `452a306c` | **default** |
| 16:17:25 | `architect-b7-founding-probe-01` | fable max | `9b4d932c` | auto |
| 16:27:44 | `builder-belvedere-04` | haiku low | `2e125ead` | **default** |
| 20:42:21 | `architect-agents-03` (the standing control) | fable max | `d28a1397` | auto |

**Bisected live, one venue, one account, one summons** (`~/code/agents`, personal, `q1.summons.txt` — one `echo`), fired through `/hands/fire` (`lab/p5/fire.ts`). Effort was the confound in the table above (haiku ran low/medium, the rest high/max); it is not the driver:

| sid | model · effort | census `mode` |
|---|---|---|
| `07f11667` | haiku · **low** | **default** |
| `a95784f1` | haiku · **high** | **default** |
| `bce87222` | opus · **low** | auto |
| `d4c5b295` | sonnet · medium | auto |

**Not account-specific** — the same haiku fire on the other two silos: `00eccd3f` (thg-fgreen) `default`, `867d3ca9` (thg-doorbell) `default`.

**Two independent sensors agree.** The transcript carries its own record:

```
$ jq -c 'select(.type=="permission-mode")' ~/.claude/projects/-Users-felix-code-agents/a95784f1-….jsonl
{"type":"permission-mode","permissionMode":"default","sessionId":"a95784f1-…"}   (haiku)
{"type":"permission-mode","permissionMode":"auto","sessionId":"bce87222-…"}      (opus, same venue/minute)
```

**Why:** `auto` is not a static rule set but an LLM classifier — `claude auto-mode --help` → *"Inspect or reset auto mode classifier configuration"*, and `claude auto-mode config` prints a 67 294-byte allow / soft_deny / hard_deny rule corpus. A haiku session does not get that classifier, so the harness drops it to `default`. **The drop is silent**: no warning, no error, no census signal other than the mode field itself.

**Correction to P2 §S5, for the record.** "Spawned sessions boot into manual mode" is true only of haiku spawns, and "manual" is the CLI's spelling (`--permission-mode` choices are `acceptEdits, auto, bypassPermissions, manual, dontAsk, plan`) for what the payload calls `default`. The rig's `cmd` grammar, cmux, and the venue were never implicated.

### F2 — Q2: the matrix. Six of six cells did sustained unattended work.

Instrument: `lab/p5/work-summons.ts` — eleven declared steps (`mkdir`, three Writes, a Read, an Edit, `ls`, `git add`, `git commit`, `git log`, a final `echo`), *"Use exactly one tool call per step"*, *"Ask no questions"*. Fired through `/hands/fire` at **sonnet · low** — the cheapest tier that holds `auto` (F1). Nobody touched a keyboard in any cell.

| account | venue | sid | mode | `PreToolUse` | `PostToolUse` | permission prompts | commit |
|---|---|---|---|---|---|---|---|
| personal | `~/code/agents` | `905a6e12` | auto | 11 | 11 | **0** | `da1e7fd` |
| thg-fgreen | `~/code/agents` | `6a661344` | auto | 11 | 11 | **0** | `98e76b1` |
| thg-doorbell | `~/code/agents` | `5d1ef8e9` | auto | 11 | 11 | **0** | `5eb34ac` |
| personal | worktree `bv/p5-a` | `3d343fbb` | auto | 11 | 11 | **0** | `1a84d95` |
| thg-fgreen | worktree `bv/p5-b` | `caf0a890` | auto | 11 | 11 | **0** | `28a8652` |
| thg-doorbell | worktree `bv/p5-c` | `756959ae` | auto | 11 | 11 | **0** | `ce61fcc` |

Counted with `jq … | awk '{if($3=="PreToolUse")t[$1]++; if($5=="permission_prompt")p[$1]++}'` over `census.jsonl`; every commit read back live, e.g.

```
$ git -C ~/code/agents log --oneline -1 -- belvedere/lab/p5/run/p5-root-personal
da1e7fd p5: p5-root-personal unattended work probe
$ git -C ~/code/agents/.claude/worktrees/bv/p5-a log --oneline -1
1a84d95 p5: p5-wt-personal unattended work probe
```

The three `bv/p5-*` worktrees and their branches were removed at landing (venue hygiene); the shas above were read while they stood. A seventh cell, `36aa755d`, ran the pre-tightening summons and merged steps 8–11 into one Bash — 8 tool calls, all eleven steps done, commit `5d39778`, `P5-WORK-DONE-…` in its last message; it is why the "one tool call per step" line exists.

The **standing positive control** (`d28a1397`, fable · max, personal, trusted root) was live throughout and beat `auto` on every one of its 219 beats — it was running Edits and Writes in the same minutes as the probes above.

### F3 — Q3: two stalls, not one. Both reproduced, both with a control.

**Stall A — the permission stall (S5 itself), N=2, in a fully trusted root.** `~/code/agents` is warm on all three accounts (`glass/trust.ts`: `{"warm":true,"root":"/Users/felix/code/agents"}` ×3), so trust is excluded by construction.

```
sid 6bbf8fff   fired by /hands/fire, haiku · low, work summons
23:34:32 SessionStart  -        startup
23:34:32 UserPromptSubmit default
23:34:41 PreToolUse    default  Bash        ← step 1, `mkdir -p …/run/p5a-personal`
23:34:47 Notification  -        permission_prompt
… nothing further. At 23:39, four and a half minutes on:
$ ls /Users/felix/code/agents/belvedere/lab/p5/run
ls: cannot access …: No such file or directory
$ ps -axo pid,command | grep '[p]5a-personal'
97551 /Users/felix/.local/bin/claude --session-id 6bbf8fff-… --model haiku --effort low …
```

The signature is exact and machine-readable: **a `PreToolUse` with no matching `PostToolUse`, followed by `Notification` carrying `why == "permission_prompt"`** — the census's `why` is `(.source // .reason // .notification_type // .trigger)`, and it is the `notification_type` that lands here.

**The argv lever does not work, and fails silently.** N=2's second arm (`lab/p5/lever.ts` — `glass/hands.ts`'s `launchCommand()` token for token plus one flag):

```
$ bun lever.ts personal p5-lever-1 haiku low ~/code/agents <work summons> auto
cd '/Users/felix/code/agents' && CLAUDE_CONFIG_DIR='/Users/felix/.claude' claude \
  '--model' 'haiku' '--effort' 'low' '--permission-mode' 'auto' '-n' 'p5-lever-1' "$(cat …)"
OK workspace:30

sid ab4b25be
23:39:05 UserPromptSubmit default      ← asked for auto on the command line
23:39:09 PreToolUse       default Bash
23:39:15 Notification     - permission_prompt
```

`ps` confirms the flag reached the process: `… --model haiku --effort low --permission-mode auto -n p5-lever-1 …`. **No error, no warning — the request is dropped on the floor.**

**The flag itself is honoured; only `auto` is refused for haiku.** Same instrument, `acceptEdits`: `b5479d60` reports `acceptEdits` and runs its `echo`. So this is a capability gate on `auto`, not a broken flag.

**`acceptEdits` is a partial lever that dies at git** — measured, not assumed (`f843ca0e`, haiku · low, `--permission-mode acceptEdits`, the eleven-step work summons):

```
23:57:30 PreToolUse acceptEdits Bash   ✓ mkdir
23:57:34 … Write ✓   Write ✓   Write ✓   Read ✓   Edit ✓   Bash ✓ (ls)
23:57:45 PreToolUse acceptEdits Bash   ← step 8, `git add …`
23:57:51 Notification - permission_prompt
$ ls …/run/p5-ae-work   →   one.txt three.txt two.txt      (no commit)
```

Seven of eleven steps, then the same wall. **No flow step that commits can ride haiku.**

**The lever that does work, measured N=2 each way in the same venue:** change the model. Stall arm `6bbf8fff` + `ab4b25be` (haiku, 0 files written, 0 commits); work arm `905a6e12` + `36aa755d` (sonnet, same cwd, same account, same summons, 11 and 8 tool calls, commits `da1e7fd` and `5d39778`) — all four inside 25 minutes.

**Stall B — the trust stall, and its signature is completely different.** A fresh `git init` outside anything trusted (`~/code/p5-cold-repo`; `glass/trust.ts` → `{"warm":false,"refused":null,…,"repo":true}` on all three accounts, confirming B7 F1's rule):

```
$ bun fire.ts personal p5-cold sonnet low /Users/felix/code/p5-cold-repo <work summons>
200 {"ok":true,"result":{"workspace":"workspace:39",…}}   at 23:47:23Z

120 seconds later, 23:49:32Z:
$ grep -c 'p5-cold-repo' census.jsonl                    → 0
$ ls -d ~/.claude/projects/*p5-cold*                     → No such file or directory
$ ps -axo pid,command | grep '[p]5-cold'
21801 /Users/felix/.local/bin/claude --session-id ebade886-… --model sonnet --effort low -n p5-cold …
$ ls /Users/felix/code/p5-cold-repo/                     → README.md
```

**Zero beats, no transcript, live pid** — it never reached a first user turn. Against stall A's *beats, transcript, mode `default`, `permission_prompt`*. The engine can tell them apart from the census alone.

**Levers ruled out rather than tried, and why.** `bypassPermissions` and `dontAsk` both exceed the accounts' own `defaultMode: auto` — barred by the batch-4 posture floor, named here, not tested. **Pre-seeding trust is barred by the fence, not by the floor:** trust is recorded per account in `<config-dir>/.claude.json` under `projects[<root>].hasTrustDialogAccepted` (9 of 10 project entries true on `~/.claude`, read-only), so the glass *could* write it — and `glass/trust.ts`'s own law says it must not ("The glass must never answer that dialog"), a new write class under D3 and an Architect-desk question if it is ever wanted. Also noted, not adopted: `claude --help` says the trust dialog **is skipped in non-interactive `-p` mode** — a real bypass, but it gives Felix no session to jump into, so it is not the engine's shape.

### F4 — Q4: resume keeps the posture, and the census's first two beats lie.

A resume through `/hands/fire` with `model`/`effort` sent empty (B5 E2's law — `lab/p5/resume.ts`, the shelf's exact shape) **inherits the first life's model**, and with it the first life's posture.

**Haiku resumed** (`867d3ca9`, thg-doorbell, resumed into the eleven-step work summons):

```
23:50:29 SessionStart      -       startup      ← first life
23:50:30 UserPromptSubmit  default
23:50:33 PreToolUse        default Bash   ✓     (an echo)
23:52:05 SessionStart      -       resume       ← second life
23:52:05 UserPromptSubmit  auto                 ← *** and this is a lie ***
23:52:09 PreToolUse        default Bash
23:52:15 Notification      - permission_prompt
$ ls …/run/p5-resume-haiku   →   No such file or directory
$ jq -r 'select(.type=="assistant")|.message.model' <transcript> | sort | uniq -c
   6 claude-haiku-4-5-20251001
$ jq -c 'select(.type=="permission-mode")' <transcript>
{"permissionMode":"default"} {"permissionMode":"default"}
```

On a resume the session announces the **account's** `defaultMode` at `SessionStart`/`UserPromptSubmit` and only settles to its real mode by the first `PreToolUse`. The transcript's `permission-mode` records never lied; the census's early beats did. **Rule for every consumer: read a session's posture off a `PreToolUse` beat, never off `SessionStart` or `UserPromptSubmit`.**

**Sonnet resumed** (`905a6e12`, personal, same summons): `auto` on every beat, **11 further tool calls, 0 prompts**, second real commit `0a7fbec` — 22 tool calls across two lives with nobody watching either.

So a resume never upgrades a posture and never downgrades one. It is not an escape hatch from F1: **a haiku session is haiku forever.**

### F5 — Q5: the permission clause *(B10's schema input, B11's fire gate)*

1. **A flow step carries no permission field.** There is nothing to set: the accounts already run `defaultMode: auto`, `--permission-mode auto` cannot raise haiku (F3), and everything above `auto` is barred by the posture floor. The knob would be a field whose every legal value is either redundant or forbidden — make the invalid state unrepresentable by not having it.

2. **A step's `model` *is* its permission posture, and `haiku` is not a legal model for an unattended step.** Legal today, measured: `sonnet`, `opus`, `fable` (all `auto`, all three accounts). `haiku` refuses **at arm**, naming P5 — never at fire, and never by silently substituting another model. This is the whole of the S5 fix and it costs the schema nothing.

3. **A venue trust precheck runs per (step, account), at arm.** `trustOf(step.cwd, readTrust(configDirOf(step.account)))` from `glass/trust.ts` — **sufficient as-is**, no change needed; its verdict already resolves worktrees to their main repo and distinguishes a cold repository from a plain directory that inherits. Two rules the engine must respect: it is **per account** — the same cwd is warm on one silo and cold on another (B7 F1, re-confirmed here) — so a flow that fans one lane across accounts needs one verdict per lane, never one per flow; and a step whose venue does not exist yet (the worktree it will cut) is prechecked against the **repo it will be cut from**, because a linked worktree inherits (F2's three worktree cells, all warm, all landed).

4. **Refusal is loud, and it happens at arm.** A step failing either check renders as a blocked node with its reason on the card, and **the flow cannot be armed until it is fixed** — D10's family: ambiguity never arms, and an unfireable step is worse than ambiguous, it is known-bad. Never a silent mid-flow stall, never a step that fires into a dialog.

5. **The engine's runtime alarms, straight off the census** (belt to the precheck's braces; both are cheap):
   - *permission stall* — a `PreToolUse` with no `PostToolUse` and a `Notification` whose `why` is `permission_prompt`, on that step's `sid`. Pause the lane, card the step. This is a positive signal, not a timeout.
   - *trust stall* — a fired step with **zero census beats and no transcript** while its pid lives. If the precheck is right this never fires; it is the drift alarm on the precheck itself.
   - Both pair with the keel §5.4 step timeout, which stays the backstop for everything neither signal names.

6. **Posture is read from `PreToolUse`, never from `SessionStart` / `UserPromptSubmit`** (F4). A run-state panel that classifies a resumed haiku step as `auto` will report a stalled step as healthy.

### Kill criteria — none fired

- **The chapter-shaper did not fire.** Sustained unattended tool work in a trusted root landed on **all three accounts** (F2), and in worktrees too. The engine chapter stands as cut; no re-scope to attended flows.
- The brief's second criterion ("if the stall reproduces **only** in untrusted venues → not a kill, the finding is the trust precheck") is **half true and the correction matters**: the stall also reproduces in a *fully trusted* root whenever the model is haiku (F3, stall A). So the clause carries **two** prechecks — trust *and* model — where the brief expected one.
- Posture-exceeding levers (`bypassPermissions`, `dontAsk`) and fence-exceeding levers (writing `.claude.json` trust) are named and ruled out in F3, not attempted.
- Q4 fitted; nothing is left as a bounded remainder.

### Venue, per the batch-5 desktop rules

Twenty fires across eighteen sessions (`workspace:25`…`workspace:44`, two of them resumes), never more than two concurrent, all through the glass's own hands or `lab/p5/lever.ts` (which drives the same `cmux workspace create` recipe without a credential — the socket admits any local process of Felix's, B4 E1 / D9). **Every workspace closed at landing** — `cmux workspace list` at the close reads `workspace:24 belvedere` and `workspace:2 mentat`, exactly what it read at the open. No cmux quit or relaunch; no account `settings.json`, cmux setting, or `.claude.json` written; posture read only. `~/code/p5-cold-repo` and the three `bv/p5-*` worktrees and branches removed; probe commits touched `belvedere/lab/p5/` paths only.

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/flow-keel.md §5,
and ~/code/agents/belvedere/plans/p5-permission-physics.md,
and execute the brief.
```
