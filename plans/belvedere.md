# Belvedere — the sovereign's glass, a keel-note

**Status: handoff — deliberated, unratified; the founding Architect ratifies at the keel.** Written 2026-08-26 by the mentat-02 sitting at Felix's ask (*"I have 33 terminal sessions open. I can't keep going like this."*). The name is Felix's ruling this sitting: **Belvedere** — the structure built solely to command the view. Companions: [night-shift.md](night-shift.md) (the Steward plane — this building is the throne room it will report into, built first) and [quartermaster.md](quartermaster.md) (machines). Harness and product facts below are dated (verified 2026-08-26) and WILL rot — re-verify before building on them.

## 1. The ask, untangled

Night-shift §1 named three wants; Belvedere is #2 + #3 pulled forward — the sovereign's interface and the observatory — because the pain crossed threshold with the night shift still parked: the field is illegible (33 terminals), dispatch is manual (359 rig fires, each mantle summons pasted by hand after launch), resume is archaeology. The bottleneck ladder (night-shift §6) gains **rung zero: his eyes**. Felix's wants: city view over all repos with live status; sidebar Projects → Campaigns → Windows; per-building pages rendering the doc sections as panels; batons as dispatch buttons; links everywhere; mantle + status colors; jump-into/resume any session; auto worktree + branch. Ruled by him this sitting: images **deferred**; whiteboardy is **THG-only** (Belvedere is the glass over ALL agentic work — night-shift law #2's home is annotated accordingly); the generative city stays dessert by his own saner-heads ruling.

## 2. The verdict — a window, not a workbench

Belvedere is a pane of glass over the truth layer the Guild already runs, plus a finger. **Truth stays in repos and in the harness's own session store; Belvedere holds none of it.** Read-heavy, write-narrow — its only writes:

1. spawn sessions (§6 hands)
2. create worktrees/branches per [DOCTRINE §10](../canon/work/DOCTRINE.md)
3. append sovereign-inbox entries (§7)
4. touch HALT

It never edits boards, ledgers, decisions, or canon — those are mantle work. **The glass-shatters test** (the standing bar for every dependency and for Belvedere itself): if the component dies, the city must stand. Corollary — **parser-as-lint**: a board that won't render is a board that's lying; render failures file to ISSUES, the parser never fattens to absorb them.

## 3. The exhibits, ruled (watch, don't marry — pickpocket freely)

Scout recon ran this sitting; the steal lists survive here, the verdicts with them.

- **superset.sh** (`~/code/superset`, v1.25.0): Electron + Hono + a detached PTY daemon, two SQLite DBs, cloud account required (auth-gated routes), Elastic-2.0; **injects managed hook blocks and wrappers into `~/.claude/settings.json`** and symlink-manages config dirs — disqualifying against the D14 discipline; the session graph dies with its DBs. Steal: **`sanitizePromptForPty()`** (`packages/shared/src/agent-prompt-launch.ts` — strip CSI/terminated-OSC/control chars before injecting text into a live CLI; mandatory for §6 fire); attachments as gitignored worktree-relative files (`packages/shared/src/workspace-attachments.ts` — the plan for the deferred images chapter); agent-as-data command tables (validates `presets.tsv`); config-dir-as-provisioned-account (`packages/agent-setup/src/profile-sharing.ts` — independently reinvents `sync/deploy`, symlinks and all).
- **T3Code** (`~/code/t3code`, v0.0.34): local daemon + Agent SDK (no PTY for agents), event-sourced `state.sqlite` (55 migrations), ~715k lines of Effect-idiomatic TS, pre-1.0. Your work survives it; your session graph doesn't. Steal: **`CLAUDE_CONFIG_DIR`, never `HOME`**, with the keychain rationale (`apps/server/src/provider/Drivers/ClaudeHome.ts` — overriding HOME breaks macOS keychain OAuth); resume as a persisted cursor (session id + last-assistant uuid); turn-bracketed hidden git refs for per-session diffs (`checkpointing/` — someday, cheap).
- **my_checklist** (`~/code/my_checklist`): the philosophical ancestor — JSON files as truth, the server re-reads disk on every request, agents edit files directly, `action: {label, prompt, status}` buttons launch headless `claude -p` with the session uuid stamped back as `↳ claude --resume <uuid>` lines. Belvedere is this pattern at city scale, with the doctrine as its schema.
- Precedent inherited: the dsh ruling (night-shift §3) — watch, don't marry.

## 4. The substrate ruling — cmux v0, tmux re-scoped

**cmux** (Manaflow, GPL, free and open source; native macOS terminal on libghostty — verified 2026-08-26 at cmux.com and cmux.com/docs/api):

- Workspaces/tabs/panes with **notification rings, sidebar badges, popover, macOS notifications** (OSC 9/99/777 + agent hooks) — the status-color want, native at the terminal layer.
- **Unix-socket CLI**: `new-workspace`, `new-split`, `send --surface <id>`, `send-key`, `focus-panel --panel <id>`, `list-workspaces` / `list-panels` / `list-pane-surfaces [--json]`, `set-status <key> <value> [--icon --color --priority]`, `notify`, `log`. Managed terminals export **`CMUX_WORKSPACE_ID` / `CMUX_SURFACE_ID`** — a census hook reads them and the session↔pane join is deterministic (closes what would otherwise be this keel's pivotal unknown).
- **Surfaces harness subagents/teams as native panes** — directly the filed ISSUES pain ("I NEED visibility into every agent").
- **Restore, not detach**: processes die with the app; relaunch restores layout + scrollback and agent sessions come back via their own resume. Right for attended work; wrong for unattended nights (P4 measures the claim).
- Felix's constraint honored: nothing new to learn — it behaves like a Mac app.

**tmux** (3.5a installed, unused): re-scoped to the **Ava chapter** — detach + ssh is that chapter's real requirement (sessions must outlive the viewport and the laptop lid); cmux can't reach it, tmux is exactly it. **Fence: substrate-as-driver.** The portable unit is the rig's `cmd` string (`summon/log/invocations.jsonl` format); where it runs — cmux workspace, tmux window, plain tab — is one adapter function. Belvedere must never care.

Spawn recipe v0 (probe P2): `new-workspace` → `send` the composed cmd (`CLAUDE_CONFIG_DIR=<dir> cd <cwd> && claude --model <m> --effort <e> -n <stamp> "/color <c>"`) → `send` the summons text (sanitized) → `set-status`. cwd/env at spawn is undocumented — the send-line carries both.

## 5. What already exists — build nothing twice

- **Dispatch census**: `summon/log/invocations.jsonl` — every fire: ts, account, mantle, model, effort, color, name-stamp, full cmd, keys. 359 lines at this sitting.
- **The sidebar hierarchy is the name-stamp**: `<mantle>-<theater>-<NN>` (rows 13/14) — Building → Campaign (theater) → Session, already encoded; `.summon-theaters` lists campaigns per repo.
- **Colors**: `summon/presets.tsv` (mantle → color). **Accounts**: `summon/accounts.tsv` + the `CLAUDE_CONFIG_DIR` grammar (MAP §1). **Usage ×3**: row 010's fetcher, `summon/log/usage/`, pacing deltas.
- **Sessions on disk**: `~/.claude*/projects/<cwd-slug>/*.jsonl` per account (23 slugs on the personal account alone) — the resume shelf enumerates from here.
- **The page schema is [DOCTRINE §2](../canon/work/DOCTRINE.md)**: the cold-session questions table IS the building page — board panel (§4 table format), ledger tail (§7 entry format), decision queue (grep `pending Felix countersign`), ISSUES, in-flight, findings. The fenced-kickoff law (§5) makes batons parseable today; the linking law (D58) means rendered markdown links just work.
- **The missing sensor: liveness.** Hooks (Stop → idle; Notification → needs-input; PreToolUse/UserPromptSubmit → working; SessionEnd → gone) append one-line heartbeats to a census dir; the glass tails it. `settings.json` is per-account and outside the sync set → a **Felix-run deploy ritual ×3** (D14's pattern, the guard's precedent). Probe P1 verifies payload fields and the CMUX_* join.

## 6. The organs

1. **Census (in, passive)**: heartbeats + rig log + session dirs ×3 + repo docs + usage ×3. Files only. The Steward's future tick reads the same census — this building de-risks the night shift instead of competing with it.
2. **Glass (render)**: one bun server (D59), localhost-only, my_checklist-simple. **City View** (buildings per the register mapping, [the-city §1](../docs/the-city.md); lit windows colored by mantle, status rings). **Building pages** (the §2 panels). **The baton rail — the home page**: every ledger-tail baton, named Felix-gate, and pending countersign, gathered into one column. A baton whose holder is a session → a **Dispatch button**; whose holder is Felix → a to-do card, never auto-fired. **Shelf** (resume anything, any account). Usage strip + **WIP gauges from day one** — a one-click dispatcher makes 60 sessions easier than 33; the glass shows load before it multiplies it.
3. **Hands (out, narrow)**: fire (spawn recipe §4 — **the summons text travels**, closing the fire-then-paste gap the log proves 359 times); auto worktree + branch (§10 law); `focus-panel` jump-in; HALT.

## 7. The sovereign's inbox (Felix's new want, this sitting)

The want beneath: not board-edit powers — **his word traveling without his hands**. Two inputs: a recurring free-text channel ("a dream.md that's recurring") and board gestures (reorder, defer). The fence holds by wiring, not exception:

- **v0 rides D53**: glass gestures and notes append **ISSUES entries** — `From Felix (via Belvedere): defer 11; 14 before 13; <free text>` — already legal (Felix's hand). The building's Architect sweeps at every sitting, trues the board, attributes to Felix.
- **The apply button**: dispatches a scoped Architect sitting (*sweep the inbox, true the board, attribute, commit*) — his gesture becomes law through the proper office, one click, no fence crossed.
- **The DESK harvest, named**: if volume proves the genre distinct from incidents (it will), a dedicated sovereign's-desk artifact mints **by harvest at a GA sitting** — tradition first, harvest after. `dream.md` stays immutable; the desk is the recurring channel beside it. The city-wide priorities contract (night-shift law #2) homes here when cut — whiteboardy is THG-only by Felix's ruling.

## 8. v0 cut and non-goals

**v0**: census + City View + building pages + baton rail + fire/worktree + shelf + usage strip + sovereign's inbox. **Deferred, named**: images (Felix, this sitting; §3's attachments convention is the plan when called); **Ava / laptop-closed continuity** (v0.5 — honest physics: nothing local runs with the lid shut; that chapter is tmux-on-Ava over ssh, same glass, the host column becomes real); embedded terminals (cmux IS the terminal); **the generative city** (dessert — but the census trail is deliberately its ground truth from day one: the miniature renders later from history already accumulating); whiteboardy links (THG-only); the **Steward** (sequenced after — it lands INTO the glass; night-shift.md unchanged, unparked only by Felix's word).

## 9. Risks and fences

- **WIP amplification** — gauges from day one; the sovereign DoS'd by his own tool is the failure mode (night-shift §5's warning, inherited).
- **Truth-mutation creep** — §2's write list is exhaustive; any new write class is an Architect-desk question first, never a feature.
- **cmux churn** — young, fast-moving, GPL; the driver fence (§4) caps the blast radius at one adapter.
- **Localhost = spawn powers** — bind 127.0.0.1 only; real auth arrives with the Ava chapter, before exposure, not after.
- **Subagent blind spot, honestly**: the glass sees sessions; cmux panes cover harness subagents visually; the filed no-direct-subagents rule stays GA-sweep material (in [ISSUES.md](../ISSUES.md) now) — a complement, not glass scope.

## 10. Founding probes (first rows; controls per DOCTRINE §6.2)

- **P1 — the census join**: hook payload fields; are `CMUX_WORKSPACE_ID` / `CMUX_SURFACE_ID` visible in hook env; heartbeat cost ≈ 0; control: a session with no hooks.
- **P2 — the spawn recipe**: new-workspace + send composed cmd + sanitized summons, ×3 accounts; the resume variant (`claude --resume <uuid>` from spawned context).
- **P3 — parse coverage**: board/ledger/baton parsers against every live repo's actual files; failures filed as ISSUES per §2's corollary, never absorbed.
- **P4 — restore semantics**: what cmux actually does to a live `claude` turn on quit/relaunch (claimed: dies, resumes) — measured, not read.

## 11. The handoff

Felix: `mkdir ~/code/belvedere && cd ~/code/belvedere && git init -b master` (never main), then `dream.md` — his own words, verbatim, immutable from that moment. Then:

```
You are an Architect at fable-max.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/canon/work/DOCTRINE.md,
dream.md, and ~/code/agents/plans/belvedere.md (the keel),
and found the project.
```

Day-one D-entries at founding (§12's ritual): name (**Belvedere** — ruled), scope (§8's cut), non-goals (§8's deferrals), substrate (§4's ruling), the fence (§2). Behind it, unordered: the grand-architect-10 sweep (two queued ISSUES entries, and the desk question when Felix calls it).

> **§11 amended 2026-08-26, same sitting (Felix's venue ruling):** Belvedere lives **in-repo** — `~/code/agents/belvedere/`, subproject scale (DOCTRINE §3, the simmy pattern): its own `README.md` master doc + board + `plans/`, one pointer line added to the repo `CLAUDE.md` at founding; the canon board (MAP §5) carries one line, not the campaign. The rig precedent generalizes — Guild tooling lives in the canon repo, runs from it, never enters the sync set (`summon/`, now `belvedere/`). Fences, cut at founding: Belvedere rows never write `canon/**`, `sync/**`, `docs/**`, or root protocol files — an optional `guard/` deny arm makes it deterministic; the census home is the founding's call (candidate: beside the rig's logs). Pre-steps replace the originals above: `mkdir ~/code/agents/belvedere`, `dream.md` lands there (immutable) — no `git init`, the repo exists. The fenced summons stands, fired **from that directory** ("found the project" reads at subproject scale) — the theater law (row 014) then stamps `architect-belvedere-01` for free. Extraction to a standalone repo later, if ever needed, is a cheap subtree split — low-regret either way.
