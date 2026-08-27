# Belvedere — the sovereign's glass

**The structure built solely to command the view.** One window over the whole city —
every repo, every account, every live session — and a finger to fire the next one.
Commission: [dream.md](dream.md) (immutable). Founding record:
[../plans/belvedere.md](../plans/belvedere.md) (the keel, 2026-08-26) — the deep
deliberation lives there; where the keel and this doc diverge, this doc is current.

Subproject of the canon repo (D2): doctrine per
[canon/work/DOCTRINE.md](../canon/work/DOCTRINE.md); this file is the master doc.

## 1. The bet

Belvedere is a pane of glass over the truth layer the Guild already runs, plus a
finger. Truth stays in repos and the harness's session store; Belvedere holds none of
it. The doctrine's own files are the schema — boards (§4 tables), ledger tails (§7
format), fenced kickoffs (§5), the decision queue, ISSUES — rendered, never copied.
**The glass-shatters test**, standing bar for Belvedere and every dependency: if the
component dies, the city must stand. **Parser-as-lint**: a board that won't render is
a board that's lying — render failures file to ISSUES; the parser never fattens to
absorb them.

**The rework mandate (Felix, founding summons):** the Guild's conventions were
terminal-first and are NOT sacred — where a doctrine format fights the glass, the fix
may be a format amendment (escalated to the Grand Architect via the canon inbox),
never a fatter parser. [P3](plans/p3-parse-coverage.md) gathers the evidence.

> **Amended 2026-08-26, same day (Felix's word, post-P3): the mandate is AI-native
> (D7).** Storage is unconstrained — markdown, JSON, anything ("I don't want to be
> tied to the past"); terminal-first conventions never cap what Belvedere can be;
> city-wide migration is pre-authorized ("We'll migrate every project, I don't
> care") and takes **priority from the Sovereign**. The channel is unchanged: the
> Standards Office cuts the standards — the directive and P3's evidence ride the
> canon inbox entry of this date.

> **Molt landed, same day (canon D63–D67, row 16):** the reference reader is canon
> [`doctrine/`](../doctrine/) — one parser in the city; the glass imports it, never
> forks it (D65). P3 §5's shapes are normative per D65; both baton-rail gates
> (FC-1/FC-7) cleared by D63. P3's `lab/p3/` parsers retire to probe history.

## 2. The fence

Read-everything, write-narrow. The write list is exhaustive (D3):

1. spawn sessions (the hands)
2. create worktrees/branches per [DOCTRINE §10](../canon/work/DOCTRINE.md)
3. append sovereign-inbox entries (ISSUES, `From Felix (via Belvedere): …`)
4. touch HALT

It never edits boards, ledgers, decisions, or canon — those are mantle work; Felix's
word travels as inbox entries the building's Architect applies with his name on the
ruling. Repo fences (D2): Belvedere rows never write `canon/**`, `sync/**`,
`docs/**`, or root protocol files. The server binds 127.0.0.1 only — real auth
arrives with the Ava chapter, before exposure. Census is telemetry: gitignored,
never truth.

## 3. The organs

1. **Census (in, passive)** — heartbeats from session hooks (P1), the rig's
   `summon/log/invocations.jsonl`, session dirs `~/.claude*/projects/` ×3, repo
   docs, usage `summon/log/usage/` ×3. Files only; home `summon/log/census/` (D6,
   gitignored). The Steward's future tick reads the same census.
2. **Glass (render)** — one bun server (canon D59), localhost, my_checklist-simple.
   **City View**: buildings = doctrine repos (the register,
   [the-city §1](../docs/the-city.md)); windows colored by mantle, rings by status.
   P3 (2026-08-26): 17 buildings carry doctrine artifacts today, four of them
   worktree-only (`manny`, `cornerizer`, `tig-avc`, `schema-migration`) — the
   register must look inside `.claude/worktrees/`, never just repo roots.
   **Building pages**: DOCTRINE §2's cold-session questions as panels. **The baton
   rail — the home page**: every ledger-tail baton, named Felix-gate, and pending
   countersign in one column; a session-holder baton becomes a Dispatch button, a
   Felix-holder baton renders as his card, never auto-fired. Baton grammar is
   move / wave / fork (canon D64) — the rail renders one / n / choice buttons; the
   parsed `Baton` shape gains `instruments[]` + kind at the build row. **Shelf**: resume
   anything, any account. Usage strip + **WIP gauges from day one** — a one-click
   dispatcher that hides the bill is how a sovereign DoS's himself.
3. **Hands (out, narrow)** — fire (P2's recipe; the summons text travels), auto
   worktree + branch, focus-panel jump-in, HALT.

**Design inputs (Felix, founding session):** theme = **felikai** —
`~/code/felix/src/felikai.css` (89 lines; `hexwright/canon/felikai.css`
byte-identical; whiteboardy's copy diverged). Applied exemplars: the SpaceX
dashboard `~/code/universal_robots_sdk/cap-mega/felix/spacex-dashboard-c2` and
bob's design system `~/code/universal_robots_sdk/bob/web/src/routes/design`. Which
copy/exemplar leads is Felix's taste call at the glass build row.

## 4. Scope — v0 and non-goals

**v0 (D5):** census + City View + building pages + baton rail + fire/worktree +
shelf + usage strip + sovereign's inbox.

**Non-goals, named (D5):** images (Felix, keel sitting; superset's
worktree-attachments convention is the plan when called) · Ava / laptop-closed
continuity (v0.5 — tmux-over-ssh chapter; nothing local survives a shut lid) ·
embedded terminals (cmux IS the terminal) · the generative city (dessert — census
logs from day one so it lights up from real history later) · whiteboardy links
(THG-only, Felix) · the Steward (lands INTO this glass, after; unparked by Felix's
word only) · editing truth (forever-class, §2).

## 5. Working agreements

- **Venue:** this subdirectory. Probes commit straight to `master` (they touch only
  `belvedere/` and gitignored telemetry); build rows use worktrees per DOCTRINE §10
  when they need a branch.
- **Ledger-locality:** Belvedere sessions ledger in [LEDGER.md](LEDGER.md) — the
  canon LEDGER carried the founding line only; the canon board carries one row
  (15), never the campaign.
- **Substrate-as-driver (D4):** the portable unit is the rig's `cmd` string; where
  it runs (cmux / tmux / plain tab) is one adapter. Nothing outside the adapter may
  care.
- **Shared live resource:** the cmux desktop is Felix's own screen — concurrency
  plans ride every batch note; a row that quits/relaunches cmux (P4-class) runs
  exclusive, never over live work.
- **ISSUES:** [ISSUES.md](ISSUES.md) is this building's inbox (D53 pattern), swept
  by this board's Architect every sitting.
- **One parser in the city (D65):** the glass imports canon
  [`doctrine/`](../doctrine/) (`parse()` → Building); it never forks or
  re-implements it. New writing follows the D63 grammar on landing; the pre-molt
  corpus converges via canon row 18.
- Stack: bun (canon D59); tabs at width 3 (global directives).

## 6. The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| P1 | [Census join](plans/p1-census-join.md) — hook events, payloads, CMUX_* env, heartbeat cost, subagent visibility | — | Digger · opus-high | **LANDED** 2026-08-26 — no kill fired. **10 hook events** mapped, payloads verbatim; **the cmux join is deterministic** — `CMUX_SURFACE_ID`+`CLAUDE_CODE_SESSION_ID` in the hook env on **87/87** invocations, no fallback needed. Heartbeat **5.5 ms median / 6.8 ms max (N=50), 0.7 ms over an empty hook** — 7× under the kill bar; hooks proven blocking. **D67 is mechanically supportable:** Agent-tool and Workflow agents fully countable (`agent_id`/`agent_type` on every nested call, `agent_transcript_path`); background shell jobs countable at launch, **one named blindness** (no completion event). Two traps for the glass: **SIGKILL leaves no `SessionEnd`** (census must pair with `kill -0 pid`) and **`/clear` rotates the session id in place**. Record schema + `beat.sh` proven end-to-end in [P1](plans/p1-census-join.md) |
| P2 | [Spawn recipe](plans/p2-spawn-recipe.md) — socket access model; new-workspace + send ×3 accounts; resume variant | — | Digger · opus-high | **LANDED** 2026-08-26 — no kill fired. Access gate is `socketControlMode` (server setting), **not** an env token: a pane process drives the socket with **zero `CMUX_*`** — D4 stands, glass ships in a pane today; outside access is a documented `password` mode, **Felix-gated** (E1). Recipe proven ×3 accounts — summons byte-exact as the **first user turn** (sha ×3), silo intact, resume proven. `/color` leaves the prompt (cmux owns colour) — that frees argv and closes the **359-fire paste gap**. `send` corrupts literal `\n`/`\t`/`\r`; never paste into a live TUI (T4). Spawn function: [`lab/p2/spawn.ts`](lab/p2/spawn.ts) |
| P3 | [Parse coverage](plans/p3-parse-coverage.md) — board/ledger/baton/queue parsers vs every live doctrine repo | — | Digger · opus-high | **LANDED** 2026-08-26 — kill did NOT fire: one strict parser, **zero per-repo special cases**, 25/27 board docs · 365/365 rows found · 288 fully typed (79%). 14 failure classes, all general; **9 fold candidates (FC-1…FC-9) escalate to canon** — FC-1 (`Felix-gate` as a legal Staffing value) and FC-7 (fenced summons in `Next:`) **gate the baton rail**: 1 of 8 ledger tails is fireable today. Findings + JSON shapes in [P3](plans/p3-parse-coverage.md) |
| P4 | [Restore semantics](plans/p4-restore-semantics.md) — quit/relaunch over a live turn, measured | P1; P2 | Digger · opus-high | OPEN |

**Batch 1 (cut at founding, 2026-08-26) — Felix-tended, reasons named:** the venue
is his live desktop (first contact with a new substrate — his eyes at each landing),
and rig-fired probe sessions are exactly the agent-visibility he demanded (canon
ISSUES, 2026-08-22). Fire P3 anytime, anywhere. Fire P1 and P2 **from terminals
inside cmux panes** (open two cmux tabs, run the rig in each) — they need the pane
env and the inherited socket access: founding smoke shows the socket refuses
outside processes. P1 ∥ P2 ∥ P3 parallel-safe (disjoint files, separate
workspaces). P4 only after P1 and P2 land — it kills the venue. No Dispatcher
(interactive batch, canon v2 precedent), no bulletin; cross-row discoveries relay
at landing boundaries. Venue state at founding: cmux installed
(`/opt/homebrew/bin/cmux`, app launches); socket up but **access-gated** — P2's
first question.

**Batch note amended 2026-08-26 (post-GA):** canon row 18's re-cut wave (8 scoped
Architects, Dispatcher-tended) runs city-wide in parallel — its method defers
buildings with live work, so Belvedere sittings and the wave never collide (GA
ledger, third act). P1 re-cut with D67's census question; P2/P4 untouched —
substrate physics owe the format law nothing.

**Post-probe return:** the probes' fold sitting (this Architect) cuts the build
rows — the v0 spine slices D5's scope; nothing builds on unmeasured physics. Glass
v0's evidence is the Felix-gate on canon row 17 (the storage experiment) — this
campaign's output feeds the Standards Office.

**Parked:** the sovereign's-DESK mint (a GA sitting, when inbox volume proves the
genre — keel §7) · superset's attachments convention (rides the images chapter) ·
rail fire-button affordance — new session / continue in an existing window (Felix
via GA-10, already legal by law; UX input when the rail row is cut).

## 7. Decisions

- **D1** (2026-08-26, Felix): **The name is Belvedere** — the structure built
  solely to command the view. Ruled at the mentat-02 sitting (keel header).
- **D2** (2026-08-26, Felix): **Venue: in-repo subproject** at `agents/belvedere/`,
  simmy pattern — own README board, one pointer line in the repo CLAUDE.md, one row
  on the canon board; rows never write `canon/**`, `sync/**`, `docs/**`, or root
  protocol files; extraction later is a cheap subtree split (keel §11 amendment).
- **D3** (2026-08-26, founding Architect per keel §2 · ✓ Felix same day):
  **The fence.** §2's write list is exhaustive; any new write class is an
  Architect-desk question first, never a feature. Glass-shatters and parser-as-lint
  are standing bars.
- **D4** (2026-08-26, founding Architect per keel §4 · ✓ Felix same day):
  **Substrate: cmux for v0, behind the driver fence**; tmux re-scoped to the Ava
  chapter (detach + ssh is that chapter's real requirement).
- **D5** (2026-08-26, founding Architect per keel §8; the deferrals within it ruled
  by Felix at the keel sitting · ✓ Felix same day): **v0 scope and non-goals** as §4
  states them.
- **D6** (2026-08-26, founding Architect — the keel's named call · ✓ Felix same
  day): **Census home: `summon/log/census/`** — beside `invocations.jsonl`,
  one telemetry neighborhood, already gitignored (verified at founding:
  `.gitignore:1  summon/log/`).
- **D7** (2026-08-26, Felix): **The mandate is AI-native.** Belvedere is designed
  for what the city should be, never capped by what markdown made it — storage
  format unconstrained, terminal-first conventions carry no veto, city-wide
  migration pre-authorized at his word, priority from the Sovereign. Execution
  channel unchanged: the Standards Office (Grand Architect) cuts the standards;
  Belvedere supplies needs and evidence ([P3 §4](plans/p3-parse-coverage.md), the
  canon inbox entry of this date). Sharpens §1's rework mandate from "amend where
  formats fight" to "the design leads, the standards follow."

## 8. Definition of done — v0

1. One window: City View lit correctly against live state, verified against a
   hand-count of running sessions across all three accounts.
2. A building page renders board / ledger tail / decision queue / ISSUES panels
   from real repos; rendered links resolve (D58).
3. The baton rail shows every live baton; a session-holder baton fires a real
   session (worktree + branch when the row says so); a Felix-holder baton renders
   as his card and never auto-fires.
4. The shelf resumes a dead session from each of the three accounts.
5. Usage strip live ×3; WIP gauges live.
6. Sovereign's inbox: a glass gesture lands as a legal ISSUES entry; the apply
   button dispatches the scoped Architect sitting.
7. The glass-shatters drill: kill the server mid-everything — no repo harmed, every
   session lives.
