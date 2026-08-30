# C12 — the transcript mirror

**Status:** OPEN — laid 2026-08-30, his word at the v3 review session ("Let's do
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

1. **Coverage:** one mirror run; archived count == source count per account,
   byte-identity spot-checked by hash on ≥10 files per account; pasted.
2. **Incremental:** a second immediate run copies zero unchanged files; a
   transcript touched between runs re-mirrors; pasted.
3. **Append-only:** the drill's deleted source survives in the archive; pasted.
4. **The restore drill:** the resumed session recalls the codeword; pasted.
5. **The index:** row count == archived transcripts; one cross-account search
   (grep by text over the archive) demonstrated; pasted.
6. **The schedule:** plist committed; a scheduled run evidenced, or the exact
   install command listed for Felix's `!`.
7. **Budget ≤5 held**, spend pasted from `result.total_cost_usd`.

## Out of scope

Search UI, deck integration, remote/cloud copies, non-transcript state
(`.claude.json`, todos, shell snapshots), retention policy, the campaign-scale
build (filed). Never a settings or hook edit in any live config dir; no
deletion in a live dir beyond the drill's own transcript. **Creep is a bug.**

## Findings

*(append here)*

---

```
You are a Builder at opus-medium.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and execute the charge ~/code/agents/belvedere/plans/c12-transcript-mirror.md.
```
