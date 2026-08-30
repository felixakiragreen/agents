# C12 — the transcript mirror

**Status:** LANDED 2026-08-30 — every bar met and pasted; the schedule's
`launchctl bootstrap` is the one Felix-gate, its command listed at Done-when 6 ·
laid 2026-08-30, his word at the v3 review session ("Let's do
B") · **Depends on:** — · **Staffing:** Builder · opus-medium ·
**Parallel-safe with:** v3 C8 — the overlap is read-only on the live config
dirs; the drill's two turns are charge-owned · **Branch:** none — straight to
`master`, explicit paths

## Goal

The minimal backstop for the mortal transcript corpus (v3 C11 F1: the real
history lives only in the live account dirs, nothing pins it). An incremental,
**append-only, byte-true mirror** of every account's transcripts, on a launchd
interval, restore-proven. Derived, never authoritative: truth stays in the
account dirs while sessions live; the mirror serves the dead and the cleared.
The campaign-scale build (search surfaces, deck integration) stays filed in
[ISSUES.md](../ISSUES.md) — this charge is the bleeding-stopper, not the organ.
**Budget: ≤5 real subject turns** (the restore drill; D21 — exceeding is a
⬡-fork). Cron work, not agent work: the mirror itself spawns nothing.

## Inputs — read before working

- v3 C4 F7 — transcripts append whole lines, zero torn lines measured; the file
  IS the session, and `--resume` off the file is the restore test.
- v3 C4 F9 — enumerate ×3 accounts from files alone; liveness =
  census `SessionStart` without `SessionEnd` + `kill(pid, 0)`.
- v3 C11 F1 — the mortality finding; the filed campaign entry in
  [ISSUES.md](../ISSUES.md) (2026-08-30) carries the assessed shape — this
  charge builds its first half.
- D6 — the telemetry neighborhood: `summon/log/` is gitignored; the archive
  data lives there.
- The classifier protocol (root ISSUES 2026-08-30): a blocked command is
  listed verbatim for Felix's `!`, never ground against.

## The spec

- **The mirror** — `belvedere/archive/mirror.ts` (bun, committed):
  - Sources by **discovery, never a hardcoded list**: every `~/.claude*` dir
    carrying a `projects/` subdir (accounts scale — his reason #1). Today that
    finds `~/.claude`, `~/.claude-thg-fgreen`, `~/.claude-thg-doorbell`,
    `~/.claude-work`.
  - Destination `summon/log/archive/<account-dirname>/<project-slug>/<sid>.jsonl`,
    bytes untouched. Copy when mtime+size differ; a mid-write tail is safe to
    re-copy (whole-line appends — the next run completes it).
  - **Append-only:** the mirror never deletes — a source deletion never
    propagates; that asymmetry IS the backup.
  - An index beside it, regenerated per run (derived):
    `summon/log/archive/index.jsonl` — one row per transcript: account, slug,
    sid, rows, mtime span, first engine-sent user line's first ~120 chars.
- **The schedule** — a launchd plist committed at `belvedere/archive/`
  (interval 3600 s, label `com.felix.belvedere-archive`). Attempt the
  `launchctl bootstrap`; if refused, list the exact command for Felix.
- **The restore drill** (the whole point; personal account, ≤5 turns):
  1. Ignite one throwaway session in a scratch cwd (1 turn, sonnet·low, a
     memorable codeword) — the drill owns everything it touches.
  2. Mirror it; verify byte-identical.
  3. Delete the live transcript (charge-owned — the one deletion this charge
     may make in a live dir), restore from the archive to the original path.
  4. `claude --resume <sid>` from that cwd (1 turn): it must recall the
     codeword. A resume that fails is a first-order finding — stop, file,
     escalate; a backup that cannot restore is a hope.
  5. The drill's transcript and scratch cwd die at landing (venue law); the
     archive copy stays — it is the append-only law's own evidence.

## Done when

1. **Coverage — MET.** One run, then the counts in the same breath (the city is
   live; a count taken minutes later is a count of a different corpus):

   ```
   $ bun belvedere/archive/mirror.ts && for d in …; do …; done
   .claude                  found   587  copied     1  0.5 MB
   .claude-thg-doorbell     found   635  copied     0  0.0 MB
   .claude-thg-fgreen       found   390  copied     4  0.1 MB
   .claude-work             found     0  copied     0  0.0 MB
   archive /Users/felix/code/agents/summon/log/archive
   indexed 1612 transcripts in 1.9s
   --- coverage, counted immediately after the run:
   .claude  source=587  archived=587
   .claude-thg-doorbell  source=635  archived=635
   .claude-thg-fgreen  source=390  archived=390
   .claude-work  source=0  archived=0
   ```

   The cold first run was **1608 transcripts / 1.67 GB in 2.5 s**.

   Byte-identity by `shasum -a 256`, source against archive, **12 files per
   account** (`-mtime +1`, so nothing live is in the sample):

   ```
   === .claude               -> 12 checked, 0 mismatched
   === .claude-thg-doorbell  -> 12 checked, 0 mismatched
   === .claude-thg-fgreen    -> 12 checked, 0 mismatched
   ```

2. **Incremental — MET.** Measured on a fixture (`$ARCHIVE_HOME`/`$ARCHIVE_DIR`),
   because the live city appends to its own transcripts between any two runs and
   a "zero" there would be luck, not proof. 20 real transcripts, sessions and
   subagents:

   ```
   === run 1 (cold)                     found 20  copied 20  0.6 MB
   === run 2 (immediate, nothing changed) found 20  copied  0  0.0 MB
   === append one line to ad4158ed….jsonl, run 3
                                        found 20  copied  1  0.0 MB
   === run 4 (immediate again)          found 20  copied  0  0.0 MB
   ```

3. **Append-only — MET.** Twice. On the fixture, three sources deleted:

   ```
   === delete 3 sources, run 5 — append-only
   .claude-fixture          found    17  copied     0  0.0 MB
   indexed 20 transcripts in 0.0s
   ```

   `found 17 · indexed 20` — the deletion did not propagate. And on the drill's
   own live transcript, deleted from `~/.claude` and then mirrored again:

   ```
   --- append-only: the deleted source still in the archive?
   -rw-------  1 felix staff 28282 Aug 30 11:22 c12dc12d-0c12-4c12-8c12-c12c12c12c12.jsonl
   --- and still indexed: 1
   ```

4. **The restore drill — MET, with its control.** Personal account, sonnet·low,
   scratch cwd `…/scratchpad/c12/drill`, session
   `c12dc12d-0c12-4c12-8c12-c12c12c12c12`.

   ```
   turn 1  result: "BELVEDERE-LAZARUS-C12"   cost 0.0646088
   mirror  shasum -a 256, source vs archive:
     af72080d194da8ef11b69233810f9bdcd6161be19f16cd98bdc97d5c2106a472  ~/.claude/projects/…/c12dc12d….jsonl
     af72080d194da8ef11b69233810f9bdcd6161be19f16cd98bdc97d5c2106a472  …/summon/log/archive/.claude/…/c12dc12d….jsonl
   delete  the live transcript, then the CONTROL resume:
     exit=1  Error: No conversation found with session ID: c12dc12d-0c12-4c12-8c12-c12c12c12c12
   restore cp archive → the original path; both hashes af72080d… again
   turn 2  claude --resume c12dc12d-… -p "What codeword did I give you?"
     result: "BELVEDERE-LAZARUS-C12"
     session_id: c12dc12d-0c12-4c12-8c12-c12c12c12c12   num_turns: 1   cost 0.0649288
   ```

   The control is what makes it a restore rather than a coincidence: with the
   transcript gone the resume **refuses**, and the only thing that changed
   between the refusal and the recall was the archived bytes going back.

   The drill's transcript and scratch cwd died at landing; the archive copy
   stays, and it is now the only copy of that session anywhere.

5. **The index — MET.** `1612 rows == 1612 archived transcripts` at the coverage
   run above. One row, verbatim (the drill's):

   ```
   {"account":".claude","slug":"-private-tmp-claude-502--…-scratchpad-c12-drill",
    "sid":"c12dc12d-0c12-4c12-8c12-c12c12c12c12","agent":null,"path":".claude/…/c12dc12d….jsonl",
    "rows":15,"bytes":28282,"first":"2026-08-30T15:22:24.953Z","last":"2026-08-30T15:22:29.142Z",
    "summons":"Remember this codeword exactly: BELVEDERE-LAZARUS-C12. Reply with only the codeword and nothing else."}
   ```

   Cross-account search, full text over the whole 1.7 GB corpus — **51 ms**:

   ```
   $ rg --hidden --no-ignore -l 'felikai' <archive> | cut -d/ -f1 | sort | uniq -c
     125 .claude
      48 .claude-thg-doorbell
      48 .claude-thg-fgreen
   $ time rg --hidden --no-ignore -c 'BELVEDERE-LAZARUS-C12' <archive> >/dev/null
     0.10s user 0.30s system 802% cpu 0.051 total
   ```

   **Both flags are load-bearing — see F1.** And by the index alone, with no
   full-text scan at all:

   ```
   .claude                    588 files  129323 rows   538 MB
   .claude-thg-doorbell       645 files  133675 rows   690 MB
   .claude-thg-fgreen         396 files  115167 rows   449 MB
   ```

6. **The schedule — plist committed; install is Felix's `!`.** The
   `launchctl bootstrap` was attempted and **refused by the auto-mode
   classifier** (the charge's own protocol: listed verbatim, never ground
   against). The plist lints and its `ProgramArguments` were run verbatim:

   ```
   $ plutil -lint belvedere/archive/com.felix.belvedere-archive.plist
   belvedere/archive/com.felix.belvedere-archive.plist: OK
   $ /opt/homebrew/bin/bun /Users/felix/code/agents/belvedere/archive/mirror.ts
   --- 2026-08-30T15:24:54.554Z
   .claude                  found   594  copied     9  1.9 MB
   …
   indexed 1635 transcripts in 1.1s
   ```

   **For Felix's `!`, exactly:**

   ```
   ln -sf ~/code/agents/belvedere/archive/com.felix.belvedere-archive.plist ~/Library/LaunchAgents/com.felix.belvedere-archive.plist
   launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.felix.belvedere-archive.plist
   launchctl kickstart -p gui/$(id -u)/com.felix.belvedere-archive
   ```

   Then `tail ~/code/agents/summon/log/archive/mirror.log` — every run stamps
   its own ISO date, so a log whose last line is old is a dead tick.

7. **Budget — 2 of ≤5 subject turns, $0.1295376.** `total_cost_usd`:
   `0.0646088` (turn 1) + `0.0649288` (turn 2). Two further invocations cost
   **nothing**: an invalid session uuid and the control resume were both refused
   by the binary before any model call.

**The type gate (B8 F4 / the coda):** `bunx --offline tsc --noEmit` from
`belvedere/glass` — **exit 0**, with the gate's `include` widened to reach
`../archive/*.ts` so it stays that way (C2 E1's lapse is what that line is for).
`bun test belvedere/glass` is **670 pass / 3 fail**, and the three are **not this
charge's**: stashing the whole working tree and re-running reproduces the same
three at HEAD (`flow-batch-1 … readFlows`, `the fork baton … each option
composes`, `the rig's mantles, coloured …`).

## Out of scope

Search UI, deck integration, remote/cloud copies, non-transcript state
(`.claude.json`, todos, shell snapshots), retention policy, the campaign-scale
build (filed). Never a settings or hook edit in any live config dir; no
deletion in a live dir beyond the drill's own transcript. **Creep is a bug.**

## Findings

### F1 — every directory-walking search skips the whole archive, and one whole account silently

The archive lives at `summon/log/archive` (gitignored by `summon/log/`, D6) and
its account directories are **dotfiles** (`.claude`, `.claude-thg-*`). Both of
`rg`'s defaults therefore bite, and they bite differently:

```
$ rg -l 'BELVEDERE-LAZARUS-C12' <archive>          # no flags
index.jsonl                                         # ← the transcript itself: invisible

$ rg --hidden -l 'felikai' <archive> | cut -d/ -f1 | sort | uniq -c
  48 .claude-thg-doorbell
  48 .claude-thg-fgreen                             # ← .claude: zero hits, and it has 125

$ rg --hidden --no-ignore -l 'felikai' <archive> | cut -d/ -f1 | sort | uniq -c
 125 .claude
  48 .claude-thg-doorbell
  48 .claude-thg-fgreen
```

`--hidden` is the obvious one. `--no-ignore` is the trap: the repo's own
`.gitignore` carries the line `.claude/`, and rg applies that rule to **any path
segment**, so the `.claude` account — the personal one, the largest — vanishes
while the other two answer normally. A search that returns plausible results from
two accounts out of three is worse than one that returns nothing.

**Explicitly-named files are exempt**, measured: `rg -c <term> <that exact
file>` → `4`, no flags. So the deck's `grep.ts`, which hands rg a file list per
group (C3), is safe as written; anything that hands rg a *directory* is not.
**This binds the campaign-scale search organ** (ISSUES 2026-08-30) and anyone who
greps the archive by hand.

### F2 — half the corpus is subagent transcripts, and the spec's `<sid>.jsonl` shape names only the other half

`~/.claude/projects` holds **577 `.jsonl`: 287 session transcripts and 290
subagent transcripts** (`<slug>/<sid>/subagents/agent-*.jsonl`). A mirror built
literally to `<account>/<slug>/<sid>.jsonl` would have left half the history
unpinned — and a subagent's transcript dies with the config dir exactly like a
session's. So the filter is one rule with no special case: **every `*.jsonl`
under `projects/`, at its relative path**. Session transcripts land at precisely
the destination the spec names; subagents land one level deeper. Index rows carry
`sid` (the owning session, either way) and `agent` (the file's stem, or `null`).

Everything else under `projects/` is non-transcript state and is not mirrored, per
the fence: 294 `.json`, 56 `.md` memory notes, 52 `.txt` tool-result dumps, 25
`.jpg`. One oddity rides in and is named rather than special-cased: a Workflow
writes a `journal.jsonl` beside its agents
(`<sid>/subagents/workflows/<wf>/journal.jsonl`), so it mirrors and indexes with
`agent: "journal"`.

### F3 — the destination's mtime has to be stamped forward, or the mirror re-copies 1.7 GB every hour

`copyFileSync` gives the copy a fresh mtime, so a naive `mtime+size` comparison
never matches again and every run is a full run. `utimesSync(dest, src.atime,
src.mtime)` is what makes the archive **its own manifest** — no sidecar state, no
database, nothing to drift out of step with the bytes it describes. It is one
line, and the whole incremental property (Done-when 2) rests on it.

### F4 — the archive is a second full copy of every transcript, inside the repo tree, and transcripts carry tool output

**1.6 GB** at `~/code/agents/summon/log/archive` today. Out of git — verified,
`git status` sees nothing there — but the ISSUES entry's own named hazard
("secrets surface — out of git, **out of unconsidered cloud sync**") stops being
hypothetical the moment the copy lands inside `~/code`. This machine runs
`com.backblaze.bzbmenu.plist` as a live LaunchAgent. Whether that sweeps `~/code`
is not something this charge measured and retention/exposure policy is explicitly
out of scope — **filed to [ISSUES](../ISSUES.md), not ruled here.** The pre-existing
copies in `~/.claude*` have the same exposure; what is new is the neighborhood.

### F5 — regenerating the index whole costs 1.1–2.5 s over 1.7 GB, so it needs no cache

The cold run — copy 1608 files, 1.67 GB, then read every archived byte — is
**2.5 s**; a warm run is **1.1–2.2 s**. Rows are counted over the raw bytes
(newlines, no string allocation) and every other field comes from a bounded 64 KB
window at each end, so a 39 MB transcript costs the same parse as a 4 KB one.
Named so that a later charge does not build a cache for a problem that does not
exist: at an hourly interval this is 0.06 % of one core.

### F6 — `bun test belvedere/glass` is 670 pass / 3 fail at HEAD, and it is nobody's charge

Reproduced by stashing this charge's whole working tree and re-running:
`flow-batch-1 … readFlows finds it, and worksOf hands it to the drawing with its
edges` · `the fork baton … each option composes its own fire body` · `the rig's
mantles, coloured … every mantle the rig names gets a colour the socket accepts`.
The type gate is green (exit 0), so this is C2 E1's warning in the other
direction: **the suite is red and the gate cannot see it.** Filed to
[ISSUES](../ISSUES.md); untouched here.

---

```
You are a Builder at opus-medium.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and execute the charge ~/code/agents/belvedere/plans/c12-transcript-mirror.md.
```
