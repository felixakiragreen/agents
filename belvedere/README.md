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
   **Building pages**: DOCTRINE §2's cold-session questions as panels. **The baton
   rail — the home page**: every ledger-tail baton, named Felix-gate, and pending
   countersign in one column; a session-holder baton becomes a Dispatch button, a
   Felix-holder baton renders as his card, never auto-fired. **Shelf**: resume
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
- Stack: bun (canon D59); tabs at width 3 (global directives).

## 6. The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| P1 | [Census join](plans/p1-census-join.md) — hook events, payloads, CMUX_* env, heartbeat cost | — (batch note: fire inside a cmux pane) | Digger · opus-high | OPEN |
| P2 | [Spawn recipe](plans/p2-spawn-recipe.md) — socket access model; new-workspace + send ×3 accounts; resume variant | — (batch note: fire inside a cmux pane) | Digger · opus-high | OPEN |
| P3 | [Parse coverage](plans/p3-parse-coverage.md) — board/ledger/baton/queue parsers vs every live doctrine repo | — | Digger · opus-high | OPEN |
| P4 | [Restore semantics](plans/p4-restore-semantics.md) — quit/relaunch over a live turn, measured | P2 (recipe); P1 + P2 LANDED (kills the venue) | Digger · opus-high | OPEN |

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

**Post-probe return:** the probes' fold sitting (this Architect) cuts the build
rows — the v0 spine slices D5's scope; nothing builds on unmeasured physics.

**Parked:** the sovereign's-DESK mint (a GA sitting, when inbox volume proves the
genre — keel §7) · superset's attachments convention (rides the images chapter).

## 7. Decisions

- **D1** (2026-08-26, Felix): **The name is Belvedere** — the structure built
  solely to command the view. Ruled at the mentat-02 sitting (keel header).
- **D2** (2026-08-26, Felix): **Venue: in-repo subproject** at `agents/belvedere/`,
  simmy pattern — own README board, one pointer line in the repo CLAUDE.md, one row
  on the canon board; rows never write `canon/**`, `sync/**`, `docs/**`, or root
  protocol files; extraction later is a cheap subtree split (keel §11 amendment).
- **D3** (2026-08-26, founding Architect per keel §2 — pending Felix countersign):
  **The fence.** §2's write list is exhaustive; any new write class is an
  Architect-desk question first, never a feature. Glass-shatters and parser-as-lint
  are standing bars.
- **D4** (2026-08-26, founding Architect per keel §4 — pending Felix countersign):
  **Substrate: cmux for v0, behind the driver fence**; tmux re-scoped to the Ava
  chapter (detach + ssh is that chapter's real requirement).
- **D5** (2026-08-26, founding Architect per keel §8; the deferrals within it ruled
  by Felix at the keel sitting — pending countersign as a set): **v0 scope and
  non-goals** as §4 states them.
- **D6** (2026-08-26, founding Architect — the keel's named call, pending Felix
  countersign): **Census home: `summon/log/census/`** — beside `invocations.jsonl`,
  one telemetry neighborhood, already gitignored (verified at founding:
  `.gitignore:1  summon/log/`).

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
