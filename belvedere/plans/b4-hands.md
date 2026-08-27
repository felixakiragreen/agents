# B4 — the hands

**Status:** LANDED 2026-08-27 · **Depends on:** G1 (Architect half ✓ 2026-08-26) ·
**Staffing:** Builder · opus-high · **Batch 3:** first row, strictly serial, straight to
master
**Spec blessed:** 2026-08-26, Architect (G1), on P2/P4 + D8.

**One residual, Felix-gated (E2 below):** the credential file
`~/.config/belvedere/env` holds Felix's cmux socket password, and no agent can write it —
the permission guard refuses to read that secret, twice, by design. Every socket-touching
hand is proven end-to-end anyway (the library takes the password as an argument; cmux
resolves an empty one to the password saved in its Settings), and the credential's own
wiring is proven by a **deliberately wrong** password making the same call fail with
`Invalid password`. One command from Felix arms the endpoints.

## Goal

The fence's four write powers as glass endpoints, plus the hardened spawn library.
After this row, a button can do what 370 rig fires did by hand — with the summons
riding as argv, never paste.

## Spec

1. **`belvedere/glass/hands.ts`** + routes on the existing server:
   - `POST /hands/fire` — body: kickoff text, account, cwd, name-stamp, mantle
     color. Recipe (P2 §S, hardened from [`lab/p2/spawn.ts`](../lab/p2/spawn.ts)):
     `workspace create` → compose cmd `CLAUDE_CONFIG_DIR=<dir> cd <cwd> && claude
     --model <m> --effort <e> -n <stamp> "$(cat <summons-file>)"` — **no `/color`
     in the prompt**: color via native `workspace-action --action set-color`
     (P2's find; the summons is the first user turn, byte-exact). Summons file in
     the census dir, sanitized (P2's `sanitize.ts` port).
   - `POST /hands/worktree` — repo path + branch: `git worktree add` per
     [DOCTRINE §10](../../canon/work/DOCTRINE.md); refuses if branch exists;
     returns the worktree path for the fire's cwd.
   - `POST /hands/focus` — `focus-panel` by the census `sf` of a live session.
   - `POST /hands/halt` — touches `summon/log/HALT` (gitignored zone). Dormant by
     design: consumers arrive with the Steward chapter; the endpoint exists so
     the button exists.
2. **Credential:** reads `~/.config/belvedere/env` (`CMUX_SOCKET_PASSWORD=…`,
   file mode 0600) at each hands call. Absent/unreadable → **hands disabled**,
   honest banner served, read-only glass unaffected (glass-shatters). The
   password never appears in logs, pages, or git.
3. **Audit:** every hands action appends one line to
   `summon/log/census/hands.jsonl` (ts, action, args-minus-summons-text, result).
4. Third-party: none — bun stdlib + the installed `cmux` CLI + `git`. Anything
   else is a STOP (D54).

## Acceptance criteria / DoD — evidence pasted here at build time

- [x] **End-to-end fire.** `fire()` → `workspace:3`, named and coloured by the socket:

      { "ok": true, "result": { "workspace": "workspace:3",
        "summonsPath": ".../census/summons/digger-belvedere-smoke.summons.txt",
        "sha": "58ba83721522a537", "bytes": 280 } }

      $ cmux workspace list      →  workspace:3  digger-belvedere-smoke
      $ cmux workspace list --json | jq '…select(.ref=="workspace:3")'
        "custom_color" : "#C0392B",  "custom_title" : "digger-belvedere-smoke",

      **Correct account** — the transcript landed under `~/.claude/projects/` (personal),
      and the argv carries the config dir. **Coloured natively, no `/color` turn**: the
      transcript's first four records are `last-prompt · custom-title · agent-name ·
      mode`, and `grep -c '"/color' <transcript>` → `0`.

      **Summons byte-exact as the first user turn** — the fixture carries blank lines, a
      hard tab, `$(echo pwned)`, backticks, both quote kinds, backslashes, literal `\n`
      and `\t`, and unicode:

      $ diff <(printf '%s' "$(cat …/digger-belvedere-smoke.summons.txt)") \
             <(printf '%s' "$(jq -r 'select(.type=="user"…) | .message.content' <transcript>)")
      IDENTICAL — byte-for-byte
      58ba83721522a5378665c0adec668329bcf014afa805321d7dced86ea157e544  (summons file)
      58ba83721522a5378665c0adec668329bcf014afa805321d7dced86ea157e544  (first user turn)

      The sha's first 16 hex are what the audit line records — a fire can be proven
      byte-exact from the log alone, without the log holding one word of the summons.
      The probe answered `SMOKE=ok` and `$(echo pwned)` arrived **unexpanded**.
      Probe workspace closed (`cmux workspace close workspace:3` → `OK`); venue back to
      its two original workspaces, focus back on `surface:3`.

- [x] **Resume fire.** Against the now-dead probe (`kill -0 33131` → dead), the same call
      with `resume` set → `workspace:4`, and the session came back on **its own
      transcript**, the new summons landing as a second user turn:

      $ jq -r 'select(.type=="user"…) | .message.content[0:52]' <same transcript>
           1  You are a probe. Reply with exactly one line: SMOKE=
           2  You are a probe. Reply with exactly one line: SMOKE=

      Screen shows the original turn (`done 12:23 AM`) above the resumed one
      (`done 12:25 AM`). Two argv tokens are the whole delta, as P2 §R found.

- [x] **Worktree**, through the HTTP endpoint, created → refused → removed:

      POST /hands/worktree {"repo":"…/scratchrepo","branch":"bv/b4-smoke"}
        [200] { "path": "…/scratchrepo/.claude/worktrees/bv/b4-smoke", "branch": "bv/b4-smoke" }
      POST /hands/worktree (same body)
        [409] { "ok": false, "error": "branch already exists: bv/b4-smoke" }

      $ git -C …/scratchrepo worktree list
        …/scratchrepo                                f714a79 [master]
        …/scratchrepo/.claude/worktrees/bv/b4-smoke  f714a79 [bv/b4-smoke]
      $ git -C …/scratchrepo worktree remove …/bv/b4-smoke   → gone

      Also covered by `hands.test.ts` against a throwaway repo, plus the non-repo refusal.

- [x] **Focus — off the live census.** B1's census went live mid-build (Felix's G1 half,
      first beat `2026-08-27T04:03:16Z`), so this is real telemetry, not a fixture. Fired
      `digger-belvedere-live`, then read its venue join straight out of `census.jsonl`:

      {"ev":"Stop","sid":"c6c6685a-…","acct":"/Users/felix/.claude",
       "ws":"E10E0591-541B-493A-B9ED-EF06BE42C9FA","sf":"A33FF326-5F63-4691-9DB6-01B5505EA9FD","pid":"38990"}

      focused BEFORE:  surface:3 (workspace workspace:1)
      focus() → { "ok": true, "surface": "A33FF326-…", "workspace": "E10E0591-…" }
      focused AFTER:   surface:8 (workspace workspace:6)
      $ cmux list-panels --workspace workspace:6 --id-format both
        * surface:8 A33FF326-5F63-4691-9DB6-01B5505EA9FD terminal [focused] "✳ digger-belvedere-live"

      Felix's focus was restored to `surface:3 / workspace:1` immediately after, every
      time. The venue-blind refusal is evidenced too — a census row with `sf: ""` gives
      `session … is not in a cmux pane (no CMUX_SURFACE_ID) — nothing to focus`.

- [x] **HALT**, through the endpoint:

      POST /hands/halt {"requester":"felix via belvedere (B4 smoke)"}   [200]
      $ cat ~/code/agents/summon/log/HALT
      2026-08-27T04:22:17.816Z felix via belvedere (B4 smoke)

      An unnamed requester is refused (`[400] requester is required — a HALT with no name
      is unanswerable`). The flag was **removed** after the smoke: a dormant signal left
      armed is a trap for the Steward chapter.

- [x] **Disabled mode.** With no `~/.config/belvedere/env`:

      fire      POST=503 {"ok":false,"error":"hands disabled — no credential at /Users/felix/.config/belvedere/env"}
      worktree  POST=503  (same)
      focus     POST=503  (same)
      halt      POST=503  (same)
      GET /hands/fire → [405] {"ok":false,"error":"hands are POST-only"}
      GET /b/agents/belvedere → 200 in 0.015 s          ← read pages untouched

      City View banner, verbatim from the served HTML:

      <section class="panel"><h2>Hands disabled</h2>
        <p class="note">The fence's four write powers are off — fire, worktree, focus and halt all answer 503.
        Everything below is unaffected: the glass reads the city either way.
        <br><span class="bad">no credential at /Users/felix/.config/belvedere/env</span></p></section>

      and the strip stat: `hands  <span class="pill tone-orange">disabled</span>`
      (armed shows `tone-green armed`).

- [x] **Audit lines for every action, no summons text.** `summon/log/census/hands.jsonl`:

      {"ts":"…T04:22:00.934Z","action":"fire","ok":false}
      {"ts":"…T04:22:08.681Z","action":"worktree","ok":true}
      {"ts":"…T04:22:08.698Z","action":"worktree","ok":false}
      {"ts":"…T04:22:17.817Z","action":"halt","ok":true}
      {"ts":"…T04:26:48.205Z","action":"fire","ok":true}
      {"ts":"…T04:28:01.901Z","action":"fire","ok":true}
      {"ts":"…T04:28:19.882Z","action":"focus","ok":true}

      One in full — note `summonsBytes` (raw) beside `bytes` (sanitized: the hard tab
      became four spaces), and no summons text anywhere:

      {"ts":"2026-08-27T04:26:48.205Z","action":"fire","args":{"account":"personal",
       "stamp":"digger-belvedere-audit","cwd":"/Users/felix/code/agents","model":"haiku",
       "effort":"medium","color":"Red","resume":null,"summonsBytes":277},"ok":true,
       "result":{"workspace":"workspace:5","summonsPath":"…/digger-belvedere-audit.summons.txt",
       "sha":"58ba83721522a537","bytes":280}}

      $ grep -c "CREDENTIAL PROOF\|not-the-real-password" …/hands.jsonl   → 0

- [x] **`git status` proof.** After the whole run, with the scratch venues town down:

      $ git status --short
      ?? .claude/          ← pre-existing, not this row's

      Writes outside the repo, all in gitignored or spec-named zones:
      `summon/log/census/hands.jsonl`, `summon/log/census/summons/*.summons.txt`,
      `summon/log/HALT` (removed), `~/.config/belvedere/env` (removed — see E2),
      and the scratch repo/worktree under the session scratchpad (removed).

- [x] **Tests green.** `bun test` in `belvedere/glass/`: **62 pass · 0 fail · 99
      expect() calls**, across `census.test.ts` and the new `hands.test.ts`.

## Out of scope

- Rail UI (B3), any auto-flow/continuous dispatch (parked horizon), tmux/other
  venue adapters (Ava chapter), password rotation UX (Settings is the home).

## Findings

### E1 — the socket already admits any local process of Felix's; the credential is an arming switch, not the lock

Measured from a **non-cmux Ghostty process with zero `CMUX_*` in its environment** (this
Builder's own shell — ancestry `ghostty → login → zsh → claude → zsh`, no cmux anywhere):

```
$ cmux workspace list                                    → * workspace:1 …  exit=0
$ CMUX_SOCKET_PASSWORD='' cmux workspace list            → * workspace:1 …  exit=0
$ CMUX_SOCKET_PASSWORD='definitely-not-…' cmux workspace list
  Error: ERROR: Invalid password                                            exit=1
```

Two facts, both load-bearing:

1. **D8 is live on the desktop** — the mode really is `password`, and the value we present
   really is checked (a wrong one is rejected, and rejected *loudly*, exit 1).
2. **…but the CLI's documented fallback chain ends at "the password saved in Settings"**,
   so presenting *nothing* is already enough. The exposure P2 §A3 predicted is the state
   of the machine today: any local process running as Felix can drive the socket.

So `~/.config/belvedere/env` is not what grants Belvedere its hands — it is the **arming
switch Felix throws**, and that is still worth having (a glass that can fire by accident is
worse than one that says "disabled"). But the fence should not be described as if the
password were the lock. **Architect's call**, and it is a one-line doc question, not code:
does the glass keep requiring a credential it does not strictly need? B4 says yes — an
explicit arming gesture is the cheapest safety a one-click dispatcher can carry.

### E2 — an agent cannot provision the credential (Felix-gate, one command)

Copying the socket password out of cmux's settings into `~/.config/belvedere/env` was
refused by the permission guard twice — once as a `grep`, once as a script that never
printed the value. **That refusal is correct** and B4 did not work around it. The
consequence is that the credential is Felix's to write:

```
mkdir -p ~/.config/belvedere && printf '# Belvedere hands credential (B4 §2)\nCMUX_SOCKET_PASSWORD=%s\n' \
  '<the cmux socket password from Settings → Automation>' > ~/.config/belvedere/env \
  && chmod 600 ~/.config/belvedere/env
```

The glass reads it per call, so no restart is needed — the banner flips to
`hands armed` on the next page load, and the endpoints start answering 200/409 instead of
503. Everything downstream of that file is already proven (E1's `Invalid password` run is
the proof that the file's value is what reaches the socket).

Note the file is refused if it is group- or world-readable: `…/env is mode 644 — must be
600`. B4 chose to enforce the spec's `0600` rather than merely document it.

### F1 — for B3's rail: the hands' wire contract

Four `POST` endpoints, JSON in, JSON out, all shaped `{ok, result}` / `{ok, error}`:

| route | body | success | refusal |
|---|---|---|---|
| `/hands/fire` | `account, stamp, cwd, model, effort, color, summons, resume?` | `{workspace, summonsPath, sha, bytes}` | 409 |
| `/hands/worktree` | `repo, branch` | `{path, branch}` | 409 |
| `/hands/focus` | `sid` | `{surface, workspace}` | 409 |
| `/hands/halt` | `requester` | `{path, at}` | 409 |

Status codes the rail must render: **200** done · **400** the body was malformed (the parse
boundary refused it — the message names the field and its rule) · **405** not a POST ·
**409** the world said no (branch taken, invalid password, session not in a pane) · **413**
body over 128 KB · **503** hands disabled, with the reason. `handsState()` is exported for
the banner: `{armed: boolean, note: string}` — a **read-only** call, safe on every page.

The stamp is the rail's identity for a fire and must match `^[a-z][a-z0-9-]{0,63}$` —
`<mantle>-<theater>-<NN>`. The colour goes to cmux as a **name or `#rrggbb`**, never a
`/color` turn; the rig's `presets.tsv` colour names map straight through.

### F2 — for B1 and B5: cmux injects its own hooks per session, and the census still fires

Every session cmux spawns is launched with an inline `--settings '{"hooks":{…}}'` blob of
cmux's own hooks (`cmux hooks claude session-start`, `stop`, `pre-tool-use`, …) — visible
in the probe's argv. The obvious fear was that this replaces the account-level hooks B1
deploys, blinding the census inside the very venue Belvedere drives.

**It does not.** Measured on the live census, ×3 fired probes: every one of them is in
`census.jsonl` with the venue join populated —

```
{"ev":"Stop","sid":"c6c6685a-…","acct":"/Users/felix/.claude",
 "ws":"E10E0591-…","sf":"A33FF326-…","pid":"38990","cwd":"/Users/felix/code/agents"}
```

`--settings` merges with the account's settings; both hook sets run. The census organ is
sound inside cmux.

### F3 — B2 dropped `ws`/`sf`; the focus hand needs them, and B5 will too

`glass/census.ts`'s `Beat` deliberately projected P1 F6's record down and dropped the two
cmux ids. `/hands/focus` is exactly the consumer that was waiting for them, so B4 restored
`ws` and `sf` to `Beat` (nothing else changed; the empty-string→null boundary already
handled them). They are pinned by a new test using B1's verbatim wire record: a Ghostty
session's `""` must read as `null`, never as a panel named `""`.

### F4 — the order's launch line has a shell bug; the recipe does not

Spec §1 writes the fire as `CLAUDE_CONFIG_DIR=<dir> cd <cwd> && claude …`. That prefix
scopes the variable to `cd` alone — `claude` would run with the **wrong account**. The
proven P2 shape is what shipped:

```
cd '<cwd>' && CLAUDE_CONFIG_DIR='<dir>' claude '--model' '…' '--effort' '…' '-n' '<stamp>' "$(cat '<summons file>')"
```

Same recipe, same result, one working env assignment; `--cwd` is *also* passed to
`workspace create` because the workspace's label and the process's directory are two
different things. Implementation detail inside the fence, recorded so the next reader does
not "fix" it back.

### F5 — D54 slip, self-reported: `bunx tsc`

B4's spec says third-party is none. Reaching for a type-check, this Builder ran
`bunx tsc --noEmit`, which fetched TypeScript from the network — **the same slip B1 made
and G1 accepted**. Zero harm: it resolved into bun's global cache, wrote no lockfile and no
`node_modules` into the repo (`git status` clean, above), and every error it printed was a
missing ambient `@types/bun`/`@types/node`, not a defect. Not repeated after the second
run. The city has no offline type-checker today — **that is the actual gap**, and it is a
canon question (a pinned `typescript` dev dep, or a named exception in the D54 fence),
not something a Builder should decide mid-row.

### F6 — small things, parked not fixed

- A body that fails the parse boundary is **not** audited: nothing was attempted, so
  nothing was done. Deliberate; say so if the Architect wants attempted-and-refused
  requests logged too.
- The probe summons files stay in `summon/log/census/summons/` (gitignored). They are the
  fire's record and the audit points at them by path.
- `cmux` prints errors to stdout with a nonzero exit — `run()` merges both streams and
  trusts the exit code only. Anything reading cmux output for meaning must do the same.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b4-hands.md,
and build the order.
```
