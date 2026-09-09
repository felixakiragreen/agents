# P2 — the spawn recipe

**Status:** **LANDED** 2026-08-26 — no kill fired · **Depends on:** — (batch note: fire inside a cmux pane) · **Staffing:** Digger · opus-high · **Parallel-safe with:** P1, P3

Q1 access model: the gate is `socketControlMode` (server setting), **not** an env token — a pane process drives the socket with no `CMUX_*` at all, so D4 stands and the glass ships in a pane today; outside access is a documented `password` mode, **Felix-gated** (E1). Q2 recipe: proven ×3 accounts, summons byte-exact as the first user turn, silo intact. Q3 resume: proven. Q4 integrity: `send` corrupts literal `\n`/`\t`/`\r` — use `set-buffer`+`paste-buffer`, and never paste into a live TUI (T4 reproduces the 359-fire gap). Spawn function: `lab/p2/spawn.ts`.

## Questions

1. **The socket access model — pivotal.** Founding smoke (2026-08-26, process outside cmux): `cmux list-workspaces` → `ERROR: Access denied - only processes started inside cmux can connect`. What grants access — env token, process parentage, config? Can an outside process (the future glass server) acquire it (copied env, a cmux setting), or must the server itself live in a cmux pane (named workaround candidate)? Record `cmux --version`; note the CLI has renamed verbs (`list-workspaces` → `workspace list`, legacy aliased) — the keel's verb list is already drifting.
2. The recipe, end to end, ×3 accounts: new workspace → send the composed cmd (`CLAUDE_CONFIG_DIR=<dir> cd <cwd> && claude --model <m> --effort <e> -n <stamp> "/color <c>"`) → send the summons text (sanitized) → set-status. Verify per account: session up under the right config dir, name-stamp in the title, summons landed as the first user turn, CMUX_* exported inside.
3. The resume variant: `claude --resume <uuid>` fired through the same recipe.
4. Multi-line integrity: does `send` deliver a multi-paragraph summons intact? The fire-then-paste gap this closes is 359 fires deep (`summon/log/invocations.jsonl`).

## Inputs — read before working

- [README](../README.md) §§2–3 and the keel §4 (the recipe, the driver fence).
- Sanitizer semantics to port (read-only, already on disk — D54 satisfied by this naming): `~/code/superset/packages/shared/src/agent-prompt-launch.ts`, `sanitizePromptForPty()` — strip CSI / terminated-OSC / control chars. Port minimally into `lab/p2/`; no fetching, no vendoring.
- Account grammar: `summon/accounts.tsv` + MAP §1. Colors/mantles: `summon/presets.tsv`. Stamp grammar: `<mantle>-<theater>-<NN>` (canon rows 13/14).
- cmux docs: cmux.com/docs/api — dated in the keel (2026-08-26); re-verify every claim against the installed binary.

## Method

From inside your cmux pane (inherited access): diff `env` against a shell outside cmux to isolate the access mechanism; attempt ONE outside connection with the candidate token copied — that experiment settles question 1 cheaply, control built in (outside-without-token is the founding smoke, already failed). Then the recipe ×3 accounts, one scratch workspace each, everything transcripted. Resume variant against one spawned session's uuid. Cleanup at landing: close probe workspaces, exit spawned sessions (README §5).

## Kill criteria

- No mechanism grants outside-process access AND server-inside-cmux also cannot drive the socket → STOP, escalate: the substrate ruling (D4) reopens.
- `send` mangles multi-line summons after bracketed-paste / send-key / per-line variants → STOP, escalate: same class.
- Any account's session comes up under the wrong config dir → STOP, escalate: silo breach class — never work around.

## Deliverables

Findings below — the question-1 verdict with its isolating experiment, per-account transcripts, resume proof — plus a proven spawn function in `lab/p2/` (the Hands organ's seed), status current, commits.

## Findings

**Landed 2026-08-26** · Digger · opus-high · fired from inside a cmux pane (`CMUX_PANEL_ID=DC0E493A…`, `cmux 0.64.22 (102) [ddd4a01bc]`). Kill criteria: none fired. Probe code: [`lab/p2/`](../lab/p2/).

### A — the socket access model (Q1)

**A1. The gate is a named server-side setting, not a token.** `cmux capabilities` reports the live mode:

```
$ cmux capabilities | head -3
{
  "access_mode" : "cmuxOnly",
```

`cmuxOnly` is what produced the founding smoke's `ERROR: Access denied - only processes started inside cmux can connect`.

**A2. `CMUX_SOCKET_CAPABILITY` is NOT the credential.** Four-way isolation from inside the pane — unset it, corrupt it, strip the whole environment — access is unaffected:

```
$ env -u CMUX_SOCKET_CAPABILITY cmux workspace list     → * workspace:1 … exit=0
$ CMUX_SOCKET_CAPABILITY=v1.bogus.bogus cmux workspace list → * workspace:1 … exit=0
$ env -i PATH=… HOME=$HOME CMUX_SOCKET_PATH=… CMUX_SOCKET_CAPABILITY=… \
    cmux workspace list                                  → * workspace:1 … exit=0
$ env -i PATH=… HOME=$HOME cmux workspace list          → * workspace:1 … exit=0   (no CMUX_* at all)
```

The last line is the decisive one: **no CMUX_* variable of any kind, still admitted.** The brief's "copied env token" hypothesis is dead — there is nothing to copy. Under `cmuxOnly` the server identifies the caller by **process ancestry**, which is also why it can name the caller's surface:

```
$ cmux identify --json
  "caller" : { "surface_ref" : "surface:2", "workspace_ref" : "workspace:1", … }
```

(`--no-caller` returns `"caller": null` — the resolution is of the connecting process, not of a passed identifier.)

Each spawned surface still *receives* a distinct capability token (`CAP=v1.1NifEJf` / `v1.gqq0VfC` / `v1.mkS2kpw`, §S4) — it is per-surface, and belongs to the non-CLI socket protocols (`terminal.bytes.v1` et al.), not to CLI auth.

**A3. Outside access is a first-class, documented mode — a settings change, not a workaround.** Live config schema (fetched from the pinned `$schema` URL in `~/.config/cmux/cmux.json`):

```
/properties/automation/properties/socketControlMode
  {"enum": ["off","cmuxOnly","automation","password","allowAll",
            "openAccess","fullOpenAccess","notifications","full"],
   "default": "cmuxOnly"}
/properties/automation/properties/socketPassword
  {"oneOf":[{"type":"string"},{"type":"null"}], "default": ""}
```

and the CLI already carries the client half — `cmux --help`:

```
Socket Auth:
  --password takes precedence, then CMUX_SOCKET_PASSWORD, then the password saved in Settings.
```

`docs/cli-contract.md` lists `--password <value>` as a global option and `CMUX_SOCKET_PASSWORD` as its environment fallback, and marks `CMUX_SOCKET_PASSWORD` a *protected* `CMUX_*` variable injected at spawn time. Felix's `~/.config/cmux/cmux.json` is the untouched template — every key commented out — so the live value comes from app Settings and reads `cmuxOnly` (A1).

**A4. Verdict — the kill criterion cannot fire.** It required *both* "no mechanism grants outside access" *and* "server-inside-cmux also cannot drive the socket". The second disjunct is false by demonstration: every socket call in this entire dig was made by a process inside a cmux pane, including the eight `workspace create` fires below. **The substrate ruling (D4) stands.** Belvedere therefore has two viable deployments:

| | Deployment | Cost | Status |
|---|---|---|---|
| (a) | glass server runs **in a cmux pane** | zero config, zero security delta | **available today, proven** |
| (b) | glass server runs anywhere + `socketControlMode: "password"` | one Settings change on Felix's machine | documented, **unproven — Felix-gated** |

(a) is not a hack: cmux is the substrate (D4), so the glass depending on cmux being up costs nothing the city does not already pay, and glass-shatters is unaffected — killing the pane kills only the glass. (b) is cleaner and is the *designed* path; it is narrow and authenticated (`password`, never `allowAll`), and the socket is a unix socket at `~/.local/state/cmux/cmux.sock` already restricted to Felix's uid, so the real exposure delta is "any local process of his that knows the password".

**Open, Felix-gated (see Escalations):** confirming (b) end-to-end requires flipping a security setting on the live desktop and one connection from a non-cmux terminal. Not done unilaterally — §5 names the desktop a shared live resource, and the brief authorized probing, not re-posturing his machine.

### T — transport integrity (Q4)

Fixture: 415 bytes, 5 paragraphs, blank lines, a hard tab, two-space indents, shell metacharacters, backslashes, unicode (`— · ⚡ ◐ é`). Sink `cat > file`, so newlines are data and the comparison is byte-level.

**T1. `cmux send` is byte-exact for ordinary prose.**

```
$ cmux send --workspace workspace:2 "cat > recv-send.txt\n"
$ cmux send --workspace workspace:2 -- "$(cat summons-canonical.txt)"
$ cmux send-key --workspace workspace:2 enter ; cmux send-key … ctrl+d
$ shasum -a 256 summons-canonical.txt recv-send.txt
e417b99a11e8d44f0af67d549915ef059c9fe5b2696f734d87b482fe1fbce153  summons-canonical.txt
e417b99a11e8d44f0af67d549915ef059c9fe5b2696f734d87b482fe1fbce153  recv-send.txt
$ diff …  → IDENTICAL — byte-for-byte
```

**T2. …but `cmux send` rewrites literal `\n` `\t` `\r`.** Same harness, fixture containing the two-character sequences:

```
sent:      literal backslash-n here: a\nb
received:  literal backslash-n here: a
           b
sent:      literal backslash-t: c\td      received: literal backslash-t: c<TAB>d
```

A summons quoting a regex, a JSON string, or a code block is silently rewritten. `send --help` documents this ("Escape sequences: \n and \r send Enter, \t sends Tab") but it is a live trap for the Hands organ.

**T3. `set-buffer` + `paste-buffer` is byte-exact AND escape-safe.** Same fixture, same sink:

```
$ cmux set-buffer --name p2 -- "$(cat esc-canonical.txt)"
$ cmux paste-buffer --name p2 --workspace workspace:2
received:  literal backslash-n here: a\nb        ← preserved
$ diff esc-canonical.txt recv-buf.txt  → IDENTICAL — paste-buffer is escape-safe
```

and on the full 415-byte canonical summons, `sha256 e417b99a…` both sides. **Conclusion: never use `send` for summons bodies.** The kill criterion ("`send` mangles multi-line summons after bracketed-paste / send-key / per-line variants") does **not** fire — a working transport was found on the second variant.

**T4. Neither transport may be pointed at a live Claude TUI.** `paste-buffer` of the same summons into a running session **split it and auto-submitted paragraph 1**; the remainder stranded in the input box:

```
$ cmux read-screen --workspace workspace:3
· Transmuting… (5s · thinking)          ← already answering paragraph 1
❯                                        ← and the rest still sitting unsent:
  Run this one command and paste its raw output back:
  echo "CONFIG_DIR=$CLAUDE_CONFIG_DIR"; …
```

The session then went and did something else entirely (it read the P2 brief and escalated) — a truncated summons is worse than a failed one, because it looks like it worked. **This is the 359-fire gap, reproduced on demand.**

### S — the spawn recipe (Q2)

**S1. The shape that works.** Summons by *file*, launch by *one line*, colour over the socket:

```
1. write sanitized summons → <dir>/<stamp>.summons.txt
2. cmux workspace create --name <stamp> --cwd <cwd> --focus false \
     --command 'CLAUDE_CONFIG_DIR=<dir> claude --model <m> --effort <e> -n <stamp> "$(cat <summons-file>)"'
3. cmux workspace-action --workspace <ref> --action set-color --color <Named>
```

Implemented as [`lab/p2/spawn.ts`](../lab/p2/spawn.ts) (`spawn()`), sanitizer in [`lab/p2/sanitize.ts`](../lab/p2/sanitize.ts).

**S2. Two rejected shapes, each a failed probe.** (i) paste into a live TUI — T4. (ii) heredoc typed line-by-line into the shell: the paste **raced shell startup**, landing before zsh was ready —

```
$ cmux read-screen --workspace workspace:4
P2SUMMONS
)"Last login: Wed Aug 26 21:54:11 on ttys059     ← paste arrived before the shell
➜ CLAUDE_CONFIG_DIR=~/.claude claude … "$(cat <<'P2SUMMONS'
➜ You are a P2 spawn probe. …                    ← every line its own prompt; heredoc never opened
```

`workspace create --command` avoids this class entirely — cmux owns shell-readiness. Nothing multi-line is ever typed at a prompt.

**S3. `/color` is deleted from the recipe, not worked around.** `claude` has no colour flag (`claude --help`), so the rig spends the first user turn on `"/color blue"` — which is *why* the summons had to arrive by paste. cmux owns workspace colour natively (`workspace-action --action set-color`, 16 named colours), so the socket sets it and **argv is freed for the summons**. The fragile payload moves to the safe channel; the trivial one-liner disappears. This is D7's rework mandate applied at the smallest possible scale — a terminal-era convention with no claim on the design.

**S4. Fired ×3 accounts. Every account verified on all four counts.** Probe driver [`lab/p2/probe-fire.ts`](../lab/p2/probe-fire.ts), model `haiku`/`medium` (the probe is about spawn physics, not thinking):

```
$ bun probe-fire.ts personal     p2probe-agents-03 Blue   → ok workspace:5
$ bun probe-fire.ts thg-fgreen   p2probe-agents-04 Green  → ok workspace:6
$ bun probe-fire.ts thg-doorbell p2probe-agents-05 Amber  → ok workspace:7
```

**(a) Right config dir — the silo holds.** Each session's transcript exists under its own config dir and nowhere else:

```
~/.claude                 c5f9f421… 21:58:13  stamp="p2probe-agents-03"
~/.claude-thg-fgreen      1ae93191… 21:58:21  stamp="p2probe-agents-04"
~/.claude-thg-doorbell    acceab69… 21:58:25  stamp="p2probe-agents-05"
```

confirmed in-session by each probe's own `echo`: `CONFIG=/Users/felix/.claude` · `CONFIG=/Users/felix/.claude-thg-fgreen` · `CONFIG=/Users/felix/.claude-thg-doorbell`. The silo-breach kill criterion does **not** fire.

**(b) Name stamp in the title** — status bar of each spawned surface reads `── p2probe-agents-03 ─` (and `-04`, `-05`); `cmux workspace list` shows the stamp as the workspace name.

**(c) Summons landed as the first user turn, byte-exact ×3.** First `type:"user"` record of each transcript vs the summons file on disk:

```
p2probe-agents-03  525 B  sha 19256ec9f4b043ae  vs  525 B  19256ec9f4b043ae  MATCH
p2probe-agents-04  525 B  sha 19256ec9f4b043ae  vs  525 B  19256ec9f4b043ae  MATCH
p2probe-agents-05  525 B  sha 19256ec9f4b043ae  vs  525 B  19256ec9f4b043ae  MATCH
```

**(d) `CMUX_*` exported inside**, distinct per surface:

```
p2probe-agents-03  SURF=F8F993CA-…  SOCK=~/.local/state/cmux/cmux.sock  CAP=v1.1NifEJf
p2probe-agents-04  SURF=1E19591F-…  SOCK=…                              CAP=v1.gqq0VfC
p2probe-agents-05  SURF=AF6146CD-…  SOCK=…                              CAP=v1.mkS2kpw
```

so a spawned session can drive the socket itself — the recursion Belvedere needs for agents that dispatch agents.

**S5. Spawned sessions boot into manual mode and block on the first tool call.** All three probes stopped at `Do you want to proceed? ❯ 1. Yes`, cleared with `cmux send-key --workspace <ref> enter`. The rig's `cmd` grammar names no permission mode, so **an unattended Belvedere fire stalls at its first Bash call.** The Hands organ must either compose a permission mode into the `cmd` or surface the prompt on the rail as a thing needing Felix. Not a blocker; a design input for the fire-button row. *(Parked per mantle — the brief did not ask.)*

**S6. `claude` inside a pane resolves to the cmux shim**, not the real binary:

```
$ which claude
/var/folders/…/T/cmux-cli-shims/DC0E493A-…/claude
$ echo $CMUX_AGENT_LAUNCH_EXECUTABLE
/Users/felix/.local/bin/claude
```

This is load-bearing and must not be "fixed": the shim is what gives cmux the agent-session integration (`CMUX_AGENT_LAUNCH_*`, session hooks, `◐` status glyphs). The recipe therefore must send `claude` bare and let PATH resolve it inside the pane — never an absolute path.

### R — the resume variant (Q3)

**R1. Resume rides the identical recipe; the delta is two argv tokens.** [`lab/p2/probe-resume.ts`](../lab/p2/probe-resume.ts):

```
$ bun probe-resume.ts personal p2probe-resume-06 Indigo c5f9f421-0c61-49b4-ba8a-fce29443bfe6
→ ok workspace:8
  CLAUDE_CONFIG_DIR=~/.claude claude --model haiku --effort medium \
    -n p2probe-resume-06 --resume c5f9f421-… "$(cat '…/p2probe-resume-06.summons.txt')"
```

The resumed surface carries the **original** transcript and the new summons as a further turn:

```
$ cmux read-screen --workspace workspace:8
⏺ CONFIG=/Users/felix/.claude … CAP=v1.1NifEJf      ← turn 1, from the original session
  PARAGRAPHS=4  SURVIVED="quotes" 'single' …
❯ P2_RESUME_MARKER. Reply with exactly one line: RESUMED=yes. Use no tools.
⏺ RESUMED=yes                                        ← new turn, in the resumed session
──────────────────────────────────── p2probe-resume-06 ─
```

**R2. A resume may be re-stamped.** The surface title is `p2probe-resume-06`, not the original `p2probe-agents-03` — `-n` applies to the resumed session. The shelf (§3, DoD 4) can therefore resume anything and re-label it in one fire.

### Escalations

**E1 — Felix-gated, the only thing this dig could not settle (A4).** Proving deployment (b) needs two acts on the live desktop:

```
1.  back up, then add to ~/.config/cmux/cmux.json:
      "automation": { "socketControlMode": "password", "socketPassword": "<secret>" }
    then:  cmux reload-config
2.  from a terminal OUTSIDE cmux (Terminal.app / standalone Ghostty):
      cmux --password '<secret>' workspace list        ← expect: the workspace list
      cmux workspace list                              ← control: expect Access denied
```

Not done unilaterally: it changes the security posture of Felix's machine, and §5 names the cmux desktop a shared live resource. **Belvedere is unblocked either way** — (a) is proven and sufficient for v0.

**E2 — a format need for the Standards Office, from S3.** The rig's `cmd` grammar (`summon/presets.tsv`, `summon/log/invocations.jsonl`, 370 fires) hard-codes `"/color <c>"` as the launch prompt. Under this recipe the colour is a socket call and argv belongs to the summons. If the rig keeps burning turn 1 on `/color`, every Belvedere fire inherits the paste gap it was built to close. Recommend the fold sitting carry this to the canon inbox with P3's other evidence: **`cmd` should compose the summons, and colour should leave the prompt.**


---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/p2-spawn-recipe.md,
and execute the brief.
```
