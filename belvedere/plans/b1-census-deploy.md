# B1 — the census deploy

**Status:** **LANDED** 2026-08-26 (branch `bv/b1-census`) — every DoD item measured and pasted below; the live ×3 deploy stays **PENDING Felix at G1**, by design · **Depends on:** — · **Staffing:** Builder · opus-high · **Parallel-safe with:** B2 (disjoint dirs; worktree `bv/b1-census`) **Spec blessed:** 2026-08-26, Architect (fold sitting), on P1's findings — the schema and hook are proven, this row hardens and packages them.

## Goal

The city's liveness sensor, ready to go live on all three accounts: the heartbeat hook, its config, and the Felix-run deploy ritual. After G1 (Felix runs the ritual), every session on every account appends census lines from birth to death.

## Spec

1. **`belvedere/census/beat.sh`** — harden [`lab/p1/beat.sh`](../lab/p1/beat.sh): the F6 record verbatim (fields: `t ev sid acct ws sf pid cwd tp pmt mode aid at tool why bg` — [P1 F6](p1-census-join.md) is the schema, do not redesign), appending to `$CENSUS_DIR` default `~/code/agents/summon/log/census/census.jsonl` (D6). **Never harms the session:** stderr silenced, always `exit 0` (no `exec` — a failing jq must not surface a nonzero), and the hook config carries a short timeout. Census is telemetry: the dropped-field list in F6 (prompts, tool inputs/outputs, command lines) stays dropped — secrets live there.
2. **Hook config** — all ten P1 events → beat.sh by absolute path, as a JSON fragment the deploy merges.
3. **`belvedere/census/deploy.ts`** (bun) — **Felix-run, never agent-run** (D14's pattern): for each config dir in `summon/accounts.tsv`, back up `settings.json` once, MERGE the hooks fragment in. P1 measured the personal account clean (`hooks: null`); the other two are unverified — **existing hooks of any kind → refuse loudly and stop, never overwrite** (fail fast). `--check` mode reports drift ×3 (the `sync/check` precedent), touches nothing.
4. **`belvedere/census/README.md`** — 15 lines max: what, the record, the ritual.

## Acceptance criteria / DoD — evidence pasted here at build time

Venue: scratch projects minted outside the repo (`…/scratchpad/venue-hooks`, `…/venue-control`), each carrying its own `.claude/settings.json`. **No live `~/.claude*/settings.json` was written** — the only live-dir contact was `deploy.ts --check`, which is read-only (DoD-6). Claude Code 2.1.247, macOS 15.7.3, bun 1.3.10, jq-1.7.1-apple at `/usr/bin/jq`.

- [x] **Scratch-venue proof.** One hooked headless session, prompt → parent Bash → Agent tool → subagent Bash → stop → end. 14 records, the full lifecycle, the subagent's tool call separated from the parent's by `aid`:

```
$ jq -r '[(.t|todate),.ev,(.sid[0:8]),(.aid//"-"),(.at//"-"),(.tool//"-"),(.why//"-"),(.bg|length|tostring)]|@tsv' census-hooks/census.jsonl
2026-08-27T03:26:04Z  SessionStart      fa284eec  -                  -                -      startup  0
2026-08-27T03:26:06Z  UserPromptSubmit  fa284eec  -                  -                -      -        0
2026-08-27T03:26:08Z  PreToolUse        fa284eec  -                  -                Bash   -        0
2026-08-27T03:26:09Z  PostToolUse       fa284eec  -                  -                Bash   -        0
2026-08-27T03:26:09Z  PreToolUse        fa284eec  -                  -                Agent  -        0
2026-08-27T03:26:09Z  PostToolUse       fa284eec  -                  -                Agent  -        0
2026-08-27T03:26:09Z  SubagentStart     fa284eec  a10431f998c45d31f  general-purpose  -      -        0
2026-08-27T03:26:11Z  PreToolUse        fa284eec  a10431f998c45d31f  general-purpose  Bash   -        0
2026-08-27T03:26:11Z  PostToolUse       fa284eec  a10431f998c45d31f  general-purpose  Bash   -        0
2026-08-27T03:26:11Z  Stop              fa284eec  -                  -                -      -        1
2026-08-27T03:26:12Z  SubagentStop      fa284eec  a10431f998c45d31f  general-purpose  -      -        1
2026-08-27T03:26:12Z  UserPromptSubmit  fa284eec  -                  -                -      -        0
2026-08-27T03:26:18Z  Stop              fa284eec  -                  -                -      -        0
2026-08-27T03:26:18Z  SessionEnd        fa284eec  -                  -                -      other    0
```

      Key diff against F6's declared field list, and the dropped-field audit:

```
distinct key orders across all 14 lines: 1
--- diff F6 (left) vs live record (right) ---
IDENTICAL — F6 field list, in F6 order

--- dropped-field audit: none of these may appear anywhere in the census ---
   prompt                   0 occurrences
   tool_input               0 occurrences
   tool_response            0 occurrences
   last_assistant_message   0 occurrences
   command                  0 occurrences
   message                  0 occurrences

--- one Stop line verbatim ---
{"t":1787801171.752986,"ev":"Stop","sid":"fa284eec-60f3-4581-8e74-e5aa5f652975",
 "acct":"/Users/felix/.claude","ws":"","sf":"","pid":"89626",
 "cwd":"…/scratchpad/venue-hooks","tp":"/Users/felix/.claude/projects/…/fa284eec-….jsonl",
 "pmt":"fb6a1fd5-67d7-4cd7-8012-b4960bd874fd","mode":"default","aid":null,"at":null,
 "tool":null,"why":null,"bg":[{"id":"a10431f998c45d31f","type":"subagent",
 "status":"running","agent_type":"general-purpose"}]}
```

- [x] **Control (DOCTRINE §6.2).** Identical scratch project, identical prompt, `settings.json` = `{}`. Same three tool uses, same subagent, and the census file was never even created:

```
$ sh venue.sh control
- Bash tool output: `b1-tool-ok`
- Subagent output: `b1-subagent-ok`
…/census-control/census.jsonl: No such file or directory
--- control: census lines = 0 ---
$ ls -la …/census-control
total 0    (empty)
```

- [x] **Bench: p95 6.46 ms ≤ 10 ms.** P1's `bench.py`, re-pointed at the hardened script. Payload is the fattest of all 87 P1 captures (2158 B `UserPromptSubmit` — fatter than P1's own 1028 B input, so this is the stricter run):

```
$ python3 bench.py payload.json 50
payload 2158 bytes · N=50

candidate               min   median      p95      max   (ms)
noop.sh (floor)        4.24     4.75     5.16     5.33
lab/p1/beat.sh         5.15     5.37     6.00     6.60
census/beat.sh         5.55     5.91     6.46     7.10
```

      Hardening costs **+0.54 ms median** over P1's candidate — the price of
      dropping `exec` (one extra fork) so a failing jq can never surface a nonzero
      exit. Marginal cost over an empty hook: **1.16 ms**. 1.5× under the DoD bar,
      7.7× under P1's 50 ms kill bar.

      P1 F6's concurrent-append check, re-run against the hardened script:

```
$ (60 × beat.sh racing one file, then wait)
lines written:            60
lines that are valid JSON: 60
widest line:               1720 bytes
```

- [x] **Harm-proof, and every other failure mode.** Full matrix — in all seven cases the hook exits 0 and writes nothing to either stream, so the session cannot see it:

```
$ sh harm.sh belvedere/census/beat.sh
dir absent -> auto-created               exit=0  stdout=0B stderr=0B
     lines: 1
dir deleted mid-session -> recreated     exit=0  stdout=0B stderr=0B
     lines resume: 1
unwritable parent (mkdir fails)          exit=0  stdout=0B stderr=0B
unwritable dir (append fails)            exit=0  stdout=0B stderr=0B
malformed payload                        exit=0  stdout=0B stderr=0B
empty payload                            exit=0  stdout=0B stderr=0B
     lines still: 1  (bad payloads wrote nothing)
CENSUS_DIR unset -> $HOME default        exit=0  stdout=0B stderr=0B
     wrote: census.jsonl
```

      Census dir deleted mid-session → **recreated, lines resume on the next
      event** (the `[ -d ] || mkdir -p` guard; `[` is a shell builtin, so the
      common case costs no fork).

- [x] **Failure-proof: jq absent.** Silent to the session, loud to the operator — the two halves of the design:

```
$ (copy of census/ with jq repointed at /nonexistent/jq)
exit=0  stdout=0B stderr=0B                      ← the session sees nothing

$ bun jqless/deploy.ts --check
REFUSED — the hook itself is broken: hook wrote no record — is /usr/bin/jq present?
exit=1
```

      Same alarm if the record ever drifts from F6 (a deliberately corrupted copy):

```
REFUSED — the hook itself is broken: record is not F6-shaped:
          t ev sid acct ws sf pid cwd tp pmt mode aid at tool why EXTRA bg
```

- [x] **`deploy.ts --check` green against scratch fixtures; every refusal path shown.** Nine cases against seven fixtures — `clean` (`{"permissions":…,"hooks":null}`, P1's measured live shape), `nosettings` (no file), `clean2` (`{}`), `foreign` (a `Stop` hook), `halfway` (`.pre-census` present, hooks gone), `stale` (**our own** hooks pointing at a deleted worktree), `weird` (`"hooks": 5`). The `hook ok` line and the banner are elided below for width; every run printed both.

```
=== A. --check, two unsensored fixtures ===                             exit=1
   clean          DRIFT     no hooks — merge will add them
   nosettings     DRIFT     no settings.json — deploy will create it
DRIFT — 2 account(s) unsensored. Fix with deploy.ts (Felix-run).

=== B. deploy ===                                                       exit=0
   clean          merged    original → settings.json.pre-census
   nosettings     merged    settings.json created (there was none)
deployed. Only sessions started from now on carry the sensor.

=== C. --check again ===       green — census live on 2 account(s).     exit=0
=== D. deploy again ===        nothing to do — already deployed.        exit=0
   permissions survived: {"defaultMode":"auto"}
   backup is byte-identical to original: {"permissions":{"defaultMode":"auto"},"hooks":null}

=== E. missing dir + foreign hooks ===                                  exit=1
   clean2         REFUSED   config dir missing
   foreign        REFUSED   existing hooks: Stop → /usr/bin/true

=== F. clean beside foreign — plan-then-apply must write NOTHING ===    exit=1
   clean2         pending   no hooks — merge will add them
   foreign        REFUSED   existing hooks: Stop → /usr/bin/true
REFUSED — 1 account(s) above. Nothing written; resolve by hand, never by overwrite.
   clean2 after: {}   files: settings.json          ← untouched, no backup written

=== G. backup exists, hooks removed by hand ===                         exit=1
   halfway        REFUSED   .pre-census exists but hooks are gone — backing up
                            twice would destroy the first original; move it
                            aside yourself

=== H. our own hooks at a STALE path ===                                exit=1
   stale          REFUSED   existing hooks: SessionStart UserPromptSubmit … SessionEnd
                            → /Users/felix/code/agents/.claude/worktrees/GONE/belvedere/census/beat.sh

=== I. hooks is not an object ===                                       exit=1
   weird          REFUSED   existing hooks: 5
   weird after: { "hooks": 5 }                      ← never overwritten
```

      Merge is surgical — `permissions` survived verbatim, the backup is a byte
      copy. **F is the load-bearing one:** a single refusal aborts the run before
      anything is written, so the city is never half-sensored. **H is the net
      under the template design** — an install left pointing at a dead worktree
      refuses and names the dead path, rather than being silently re-merged.

- [ ] **Live ×3 deploy: PENDING Felix at G1** — not this row's to run. Read-only pre-flight of the live dirs (`--check` writes nothing) closes P1's open question: **all three accounts are hook-free, so the merge is purely additive on all three**, not just personal.

```
$ bun belvedere/census/deploy.ts --check
   personal       DRIFT     no hooks — merge will add them
   thg-fgreen     DRIFT     no hooks — merge will add them
   thg-doorbell   DRIFT     no hooks — merge will add them
DRIFT — 3 account(s) unsensored. Fix with deploy.ts (Felix-run).      exit=1
```

## Out of scope

- Running the deploy against any live `~/.claude*` dir (Felix-run, G1).
- Any glass/rendering work (B2), any census *reader* beyond the DoD proofs.
- Non-hook sensors, retention/rotation policy (revisit when the file earns it).

## Findings

**Landed 2026-08-26 (Builder · opus-high), branch `bv/b1-census`.** Four files, exactly the four the spec named: [`census/beat.sh`](../census/beat.sh), [`census/hooks.json`](../census/hooks.json), [`census/deploy.ts`](../census/deploy.ts), [`census/README.md`](../census/README.md). No escalation fired — the spec was sound end to end; P1's schema and hook survived hardening unchanged in shape.

**Three implementation calls, all inside the fence:**

1. **`hooks.json` is a template, not a hardcoded path.** The spec asked for "beat.sh by absolute path"; a literal absolute path in the fragment duplicates truth and silently lies from any worktree. `@CENSUS@` is substituted with `deploy.ts`'s own directory at merge time — `lab/p1/settings.tmpl.json`'s `@LAB@` precedent. What lands in `settings.json` is still an absolute path; it just cannot disagree with the `beat.sh` sitting beside it. **Consequence for G1: Felix must run the ritual from the MERGED checkout, not a worktree** — otherwise the hooks point at a path that disappears. `--check` catches it afterwards (a stale path fails the deep-equal and reports as foreign hooks).

2. **`bg` capped at 16 entries.** P1 F6 left this as the build row's choice ("cap in the hook, or accept a lint-on-read"). Capped: a record must stay inside the stdio buffer or one append becomes two `write()`s and concurrent sessions interleave. Measured — 100 tasks in, 16 out, 1721 B, and the 60-way race stayed 60/60 valid JSON. **The roster is now a sample, not a census**; relayed to B2 on the bulletin.

3. **`deploy.ts` plans all accounts before writing any.** The spec said "refuse loudly and stop"; stopping mid-loop would leave the city half-sensored. It inspects ×3 first, and a single refusal aborts the run with nothing written (shown in DoD-6: the clean fixture beside a foreign one stayed `{}`).

**The loud end of a silent sensor.** `beat.sh` is stderr-silenced and always exits 0 — hooks block, and a nonzero exit is a signal Claude Code acts on, so the sensor must be incapable of harming a session. That silence hides real breakage, so `deploy.ts` **runs the hook for real** on every invocation (`--check` included), feeds it a synthetic payload, and asserts the emitted record's key list equals F6's, in order. Missing jq, bad permissions, or schema drift all refuse the deploy by name. Silent in the hot path, loud at the gate.

**Adjacent, parked (not fixed here):**

- `lab/p1/beat.sh` is now superseded by `census/beat.sh` and still carries the `exec` form. P1's lab is probe history; retiring it is the fold sitting's call, not this row's.
- The census file has no rotation. Out of scope by the order ("revisit when the file earns it") — at ~450 B/event it will take a long while, but the glass should not assume a small file forever.
- `deploy.ts` has no uninstall. Not asked for; the `.pre-census` backup is the manual path, and `--check` names it.

**One process slip, self-reported.** I ran `bunx tsc --noEmit` for a type check; that is a network fetch the work doc does not name, i.e. a D54 violation. Caught and stopped at the first command. **No residue:** bunx cached outside the repo, `git status --untracked-files=all` showed only the four intended files, and nothing was committed. The real check was the one that mattered anyway — `bun` executes the file, and it ran green across all nine fixture cases.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b1-census-deploy.md,
and build the order.
```
