# The PermissionRequest ritual — Felix's hand, at G6

**Status:** READY — written at B22 (candidate 5), unrun · **Runs at:** G6, the rework
close · **Whose hand:** Felix's, and only Felix's (D14) · **Cost:** one command,
about ten seconds, plus one session to verify

The census subscribes to ten hook events. `PermissionRequest` is an eleventh that
Claude Code already emits and the census has never listened for — so today the
glass's only *"this session is blocked on approval"* signal is an inference from
`Notification`/`permission_prompt`, which arrives about **six seconds late** and
**only in interactive sessions** (B14 F1, P1 F1). Subscribing costs one key in one
file and three merged settings files. Writing those three files is a Felix gesture,
never an agent's: the permission guard that would stop an agent here is the design,
not an obstacle (D14).

Everything below the deploy line is already committed. **This document changes no
live config by being read.**

---

## 1. What has already changed in the repo

Two lines, both landed at B22, both inert until this ritual runs.

**`belvedere/census/hooks.json`** — one event added to the fragment:

```diff
   "Notification":     [{ "hooks": [{ "type": "command", "command": "@CENSUS@/beat.sh", "timeout": 5 }] }],
+  "PermissionRequest": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "@CENSUS@/beat.sh", "timeout": 5 }] }],
   "Stop":             [{ "hooks": [{ "type": "command", "command": "@CENSUS@/beat.sh", "timeout": 5 }] }],
```

`beat.sh` needs nothing: it projects `.hook_event_name` and `.tool_name` generically
and drops `tool_input` with every other payload field, so the new record is F6-shaped
by construction and carries no prompt text, no tool inputs, no command lines.

**`belvedere/glass/census.ts`** — the reader is ready before the sensor is:

```diff
   Stop: 'idle',
+  PermissionRequest: 'needs-input',
   SessionEnd: 'gone',
```

Without that line an arriving `PermissionRequest` beat would render the session
**unknown** (`BY_EVENT` names no guesses), which is honest but useless — and it would
displace the `working` the session currently shows in the six seconds before the
`Notification` lands.

**`belvedere/census/deploy.ts`** — a third change makes this ritual one command
instead of three hand-edits. `inspect()` classified *any* hooks block that did not
byte-match the fragment as **foreign** and refused the whole run, which meant that
amending `hooks.json` locked the deploy out of every account already carrying the
census. It now recognises its own install: a hooks block whose every `command` is
exactly this `beat.sh` is **ours**, and re-merging it is an `upgrade`. An upgrade
**never backs up** — `settings.json.pre-census` holds the file as it was before the
census existed, and overwriting it with an already-hooked one would destroy the only
original.

## 2. The gesture

One command, from the repo root, in a shell that is yours:

```
bun belvedere/census/deploy.ts
```

It plans all three accounts before it writes any, and it writes nothing unless all
three plan clean.

**What it prints now (measured at B22, before the ritual):**

```
census hook: /Users/felix/code/agents/belvedere/census/beat.sh
   hook           ok        probed live — emits an F6 record, exit 0

   personal       DRIFT     ours, 10 events → 11 — re-merge will bring the event set forward
   thg-fgreen     DRIFT     ours, 10 events → 11 — re-merge will bring the event set forward
   thg-doorbell   DRIFT     ours, 10 events → 11 — re-merge will bring the event set forward

DRIFT — 3 account(s) not at this event set. Fix with deploy.ts (Felix-run).
```

**What it should print when you run it:** the same three rows as `pending`, then

```
   personal       merged    event set brought forward; settings.json.pre-census untouched
   thg-fgreen     merged    event set brought forward; settings.json.pre-census untouched
   thg-doorbell   merged    event set brought forward; settings.json.pre-census untouched

deployed. Only sessions started from now on carry the sensor.
```

**If any row says `REFUSED`, stop and read it.** A refusal names what it found and
nothing is written on any account — a foreign hooks block, a settings file that is
not valid JSON, or a config dir that is missing. Resolve it by hand; never by
overwrite.

## 3. Verification — three reads and one induced stall

**(a) The settings carry eleven events, on all three.** Read-only:

```
for d in ~/.claude ~/.claude-thg-fgreen ~/.claude-thg-doorbell; do
  printf '%s  ' "$d"; jq -r '.hooks|keys|length, (keys|join(" "))' "$d/settings.json" | tr '\n' ' '; echo
done
```

Expected on each: `11` and a key list containing `PermissionRequest`. Before the
ritual it is `10` and does not.

**(b) The drift alarm is green.** `bun belvedere/census/deploy.ts --check` →
`green — census live on 3 account(s).`, exit 0.

**(c) The originals are intact.** `ls -l ~/.claude*/settings.json.pre-census` — three
files, still dated `Aug 27 00:02`. An upgrade that touched them is a bug, not a
success.

**(d) The event actually fires, and the deck sees it in under a second.** The sensor
only reaches sessions started *after* the merge, so this needs a fresh one. B14 F3 is
the recipe for manufacturing the stall — a **read-only Bash call waves straight
through** in `default` mode, so the tool call must **write**:

1. Ignite a haiku·low session (haiku cannot enter `auto` on any account — P5 F1 — so
   it sits in `default`, which is what stalls) into a trusted tree, with a summons
   that asks it to write one file.
2. Watch the census tail:
   `tail -f ~/code/agents/summon/log/census/census.jsonl | jq -c 'select(.ev|test("Permission|Notification"))'`
3. Expected, in order: a `PermissionRequest` record **within a second** of the
   `PreToolUse Write`, then the `Notification permission_prompt` about six seconds
   later. Both carry the same `sid`.
4. The deck shows that session `needs-input` on the strength of the first record — not
   the second. That is the whole point of the ritual.
5. Answer or kill the stalled session, and close its workspace (D55).

If step 3 produces the `Notification` and no `PermissionRequest`, the event exists but
the merge did not reach that account's *running* shape — check (a) again and confirm
the session was started after the merge.

## 4. Backing out

The ritual is reversible by the same hand that ran it: restore
`settings.json.pre-census` over `settings.json` on each account to remove the census
entirely, or edit the single `PermissionRequest` key out of `.hooks` to fall back to
the ten-event set. Nothing else in the city depends on the event: the
`Notification`/`permission_prompt` inference is untouched and still fires, so backing
out costs six seconds of latency and nothing else.

## 5. What this does NOT do

- It does not change what the census records per event: the field set is P1 F6's,
  verbatim, and `deploy.ts` re-probes `beat.sh` end to end before it writes anything.
- It does not reach headless (`claude -p`) runs, which do not raise permission
  prompts at all — the engine's own alarms stay where C4/P5 put them.
- It does not retire the `Notification` inference. Both signals now arrive; the fast
  one simply wins.
