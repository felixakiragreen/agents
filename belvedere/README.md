# Belvedere — the Sovereign's deck

**The structure built solely to command the view.** One window over the whole city —
every repo, every account, every live session — and a finger to ignite the next one.
Commission: [dream.md](dream.md) (immutable). Founding record:
[../plans/belvedere.md](../plans/belvedere.md) (the cornerstone, 2026-08-26) — the deep
deliberation lives there; where the cornerstone and this doc diverge, this doc is current.

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
terminal-first and are NOT sacred — where a doctrine format fights Belvedere, the fix
may be a format amendment (escalated to the Grand Architect via the canon inbox),
never a fatter parser. [P3](plans/p3-parse-coverage.md) gathers the evidence.

> **Amended 2026-08-26, same day (Felix's word, post-P3): the mandate is AI-native
> (D7).** Storage is unconstrained — markdown, JSON, anything ("I don't want to be
> tied to the past"); terminal-first conventions never cap what Belvedere can be;
> city-wide migration is pre-authorized ("We'll migrate every project, I don't
> care") and takes **priority from the Sovereign**. The channel is unchanged: the
> Standards Office lays the standards — the directive and P3's evidence ride the
> canon inbox entry of this date.

> **Molt landed, same day (canon D63–D67, charge 16):** the reference reader is canon
> [`doctrine/`](../doctrine/) — one parser in the city; Belvedere imports it, never
> forks it (D65). P3 §5's shapes are normative per D65; both baton-rail gates
> (FC-1/FC-7) cleared by D63. P3's `lab/p3/` parsers retire to probe history.

## 2. The fence

Read-everything, write-narrow. The write list is exhaustive (D3):

1. spawn sessions (the hands)
2. create worktrees/branches per [DOCTRINE §10](../canon/work/DOCTRINE.md)
3. append sovereign-inbox entries (ISSUES, D63 grammar: `- <date> · Felix (via
   Belvedere) · <what>` — reconciled 2026-08-27, B6's own first gesture caught the
   pre-D63 wording here)
4. touch HALT
5. deliver Felix's text to a session as a real turn (P6's mechanism, audited
   by sha; D10 — an ambiguous target never sends) *(deck chapter, D18)*
6. rename / recolor cmux display state, write-through, audited *(D18)*
7. write files under `desk/` only — drafts, notes, dreams; commits are never
   Belvedere's *(D17/D18)*

It never edits boards, ledgers, decisions, or canon — those are mantle work; Felix's
word travels as inbox entries the building's Architect applies with his name on the
ruling. Repo fences (D2): Belvedere charges never write `canon/**`, `sync/**`,
`docs/**`, or root protocol files. The server binds 127.0.0.1 only — real auth
arrives with the Ava chapter, before exposure. The hands arm only by Felix's
gesture — `~/.config/belvedere/env` (B4 E2) — and that credential is an **arming
switch, not the lock** (B4 E1, D9): the socket already admits any local process
of Felix's, so what stands between a stray agent and the desktop is the
permission guard and this fence, never the password. Census is telemetry:
gitignored, never truth.

## 3. The organs

1. **Census (in, passive)** — heartbeats from session hooks (P1), the rig's
   `summon/log/invocations.jsonl`, session dirs `~/.claude*/projects/` ×3, repo
   docs, usage `summon/log/usage/` ×3. Files only; home `summon/log/census/` (D6,
   gitignored). The Steward's future tick reads the same census. P1 (measured):
   ten hook events, the pane join deterministic (`CLAUDE_CODE_SESSION_ID` +
   `CMUX_SURFACE_ID` in hook env, 87/87) but one-to-many — key by `session_id`,
   surface is grouping; **`Stop` is the idle sensor** (`Notification` is a 60 s
   nag, interactive-only); heartbeat 5.5 ms median (0.7 ms over an empty hook);
   hooks are **venue-blind** — the census watches Ghostty sessions too, they just
   carry no pane fields; all three subagent vehicles countable (D67 answered —
   P1 F4). Deploy target clean: no account-level hooks exist today.
2. **Belvedere (render)** — one bun server (canon D59), localhost, my_checklist-simple.
   **City View**: buildings = doctrine repos (the building register,
   [the-city §1](../docs/the-city.md)); windows colored by mantle, rings by status.
   P3 (2026-08-26): 17 buildings carry doctrine artifacts today, four of them
   worktree-only (`manny`, `cornerizer`, `tig-avc`, `schema-migration`) — the
   register must look inside `.claude/worktrees/`, never just repo roots.
   **Building pages**: DOCTRINE §2's cold-session questions as panels. **The baton
   rail — the home page**: every ledger-tail baton, named ⬡-gate, and pending
   blessing in one column; a session-holder baton becomes a Dispatch button, a
   Felix-holder baton renders as his card, never auto-ignited. Baton grammar is
   single / batch / fork (canon D64, D71's names) — the rail renders one / n / choice
   buttons; the parsed `Baton` shape gains `instruments[]` + kind at the build charge. **Shelf**: resume
   anything, any account. Usage strip + **WIP gauges from day one** — a one-click
   dispatch that hides the bill is how a sovereign DoS's himself.
3. **Hands (out, narrow)** — ignite (P2's recipe, proven ×3 accounts: the summons
   travels **as argv**, byte-exact first user turn), auto worktree + branch,
   focus-panel jump-in, HALT. Transport law (P2 T1–T4): text into panes rides
   `set-buffer` + `paste-buffer` (`send` rewrites literal `\n`/`\t`/`\r`); never
   paste into a live Claude TUI — it splits at the first blank line and
   auto-submits. The shelf may address sessions **by name-stamp**
   (`claude --resume "digger-agents-04"` is legal — P4 §R). **Ignition = kickoff +
   the building's coda** (DOCTRINE §5): the engine appends the `plans/CODA.md`
   quote block verbatim at ignition — absent file ignites the kickoff alone, a blockless
   CODA.md refuses the ignition (the 08-29 flow-1 incident; `engine.ts` §the coda).

**Deployment (RULED — D8, Felix's smoke 2026-08-26):** Belvedere's server runs
OUTSIDE cmux under `socketControlMode: password` — the socket gate is *live*
ancestry, so a pane-resident Belvedere dies with every cmux restart and can never
reconnect; pane-resident is bootstrap/fallback only. The server presents
`CMUX_SOCKET_PASSWORD` from launch env or a gitignored local file, never git.
Sharpened by B4 E1 (D9): the password's function is **admission, not
restriction** — it lets a non-descendant Belvedere connect at all, while the CLI
resolves an absent password from cmux Settings, so any local process of Felix's
is admitted regardless. The credential file is Belvedere's **arming switch** —
absent, every hand answers 503 — and it holds the real password, not a
sentinel, so Belvedere outlives any tightening of that courtesy fallback.

**Design inputs (Felix, founding session):** theme = **felikai** —
`~/code/felix/src/felikai.css` (89 lines; `hexwright/canon/felikai.css`
byte-identical; whiteboardy's copy diverged). Applied exemplars: the SpaceX
dashboard `~/code/universal_robots_sdk/cap-mega/felix/spacex-dashboard-c2` and
bob's design system `~/code/universal_robots_sdk/bob/web/src/routes/design`. Which
copy/exemplar leads is Felix's taste call at the Belvedere build charge.

**Design laws (Felix, 2026-08-27):** **encapsulation-first** — every card and row
leads with a 1–6-word name ("B8: deck hardenings", "E1: register policy"),
[expand] reveals the full text or a waggle; **Inter for running prose,
IosevkaFelix for numbers, titles, buttons, tabular data**; **color legends** on
every colored view; the City View **groups by parent directory**; **recency
informs sort order, never dictates it** (attention — batons, gates, escalations —
outranks it); **account usage visible wherever accounts are chosen**; **no
dropdowns** — toggled button groups. Charges from B5 on build to these natively;
[B9](plans/b9-visual-law.md) swept the pages that predate them (LANDED 2026-08-27 —
Inter vendored, zero `<select>` city-wide, encapsulations and legends everywhere).
**The one law the corpus itself cannot yet satisfy: 27 of 38 live cards write no
≤6-word name, so a card leads with a derived name where the text has one and renders
whole where it does not — the shapes need a name FIELD** (B9 F1, charge-17 evidence).

**Deck-era laws (Felix, 2026-08-27, the deck design session — [the deck
cornerstone](plans/deck-keel.md), BLESSED):** the law of space (no scrolling;
proportional splits; fewest words, most things) · spelling is **color, center,
grey** (his triple — American-mixed, for all new strings) · panes are a
replaceable surface · **the striking law**: every law CAN be struck, channel
discipline intact. The ⬡ hexagon motif (decorative SVG elements, hexagonal
buttons) is reserved for the prettifying pass — DEFERRED until Belvedere
functions.

**Chat laws (Felix, 2026-08-30, the visual pass):** continuous
full-transcript scroll — the scroll view shows the entire chat; **the minimap
is spatial, never temporal** (a click jumps to its location in the
scrollview, never "back in time") · locked tooltips carry an obvious
dismissal · per-surface interaction probes are the regression substrate — his
direction: "develop some UI tests. Test pieces of it, 1 by 1" (the camera +
the fixture city; B23 seeds the `--probes` gate).

## 4. Scope — v0 and non-goals

**v0 (D5):** census + City View + building pages + baton rail + ignite/worktree +
shelf + usage strip + sovereign's inbox.

**Non-goals, named (D5):** images (Felix, the cornerstone session; superset's
worktree-attachments convention is the plan when called) · Ava / laptop-closed
continuity (v0.5 — tmux-over-ssh chapter; nothing local survives a shut lid) ·
embedded terminals (cmux IS the terminal) · the generative city (dessert — census
logs from day one so it lights up from real history later) · whiteboardy links
(THG-only, Felix) · the Steward (lands INTO Belvedere, after; un-deferred by Felix's
word only) · editing truth (forever-class, §2).

**Future campaigns, filed:** the unified conversation archive at campaign scale —
search surfaces, Belvedere integration, N accounts — on C12's mirror as its foundation
(Felix's word 2026-08-30, verbatim in the inbox history of that date; ruled filed,
not laid). The mirror + launchd + restore drill are LANDED (C12); the campaign,
when called, inherits two measured traps: any directory-walking `rg` over the
archive needs `--hidden --no-ignore` or the `personal` account silently vanishes
(C12 F1 — the archive's account dirs are dotfiles and `.gitignore`'s `.claude/`
line masks one by name; explicitly-named file lists are exempt), and the mirror is
derived, never authoritative — truth stays in the account dirs while sessions
live; the archive serves the dead, the cleared, and the search index.

## 5. Working agreements

- **Venue:** this subdirectory. Probes commit straight to `master` (they touch only
  `belvedere/` and gitignored telemetry); build charges use worktrees per DOCTRINE §10
  when they need a branch.
- **Ledger-locality:** Belvedere sessions ledger in [LEDGER.md](LEDGER.md) — the
  canon LEDGER carried the founding line only; the canon board carries one charge
  (15), never the campaign.
- **Substrate-as-driver (D4):** the portable unit is the rig's `cmd` string; where
  it runs (cmux / tmux / plain tab) is one adapter. Nothing outside the adapter may
  care.
- **Shared live resource:** the cmux desktop is Felix's own screen — concurrency
  plans ride every batch note; a charge that quits/relaunches cmux (P4-class) runs
  exclusive, never over live work.
- **ISSUES:** [ISSUES.md](ISSUES.md) is this building's inbox (D53 pattern), swept
  by this board's Architect every session.
- **One parser in the city (D65):** Belvedere imports canon
  [`doctrine/`](../doctrine/) (`parse()` → Building); it never forks or
  re-implements it. New writing follows the D63 grammar on landing; the pre-molt
  corpus converges via canon charge 18.
- **Two-lane commit rule (B15 F7 + P6's confirmation, distilled at G2 2026-08-28):**
  in a multi-lane batch on one shared checkout, a charge commits by **explicit
  paths** (`git add <files>`), never `git add -A <dir>` — or a lane rides a
  worktree. File-disjoint is NOT commit-disjoint: both directions of the
  collision were measured (a Builder swept a Digger's live probe, then a Digger
  swept a Builder's half-written module); nothing was lost, but attribution
  lied twice.
- **A standing worktree path refuses the mint** (`hands.ts` — "worktree path
  already exists"): a venue is neither reused nor silently re-minted. *(Re-laid
  2026-08-30 at C15's review, its F6 — the rest of the 08-29 "engine venue
  semantics" note described the v2 engine and died with it, D22 r2; v3's law
  is the frozen `prompt` and the run log as truth, the campaign note §6.)*
- **Trust is read from `~/.claude/.claude.json`** (per account dir), never the
  legacy `~/.claude.json` — a human measuring trust by the legacy file gets wrong
  answers (canon charge 20 F6, measured 2026-08-29).
- Stack: bun (canon D59); tabs at width 3 (global directives).

## 6. The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| P1 | [Census join](plans/p1-census-join.md) | — | Digger · opus-high | **LANDED** 2026-08-26 — no kill fired: the cmux join is deterministic; findings in [P1](plans/p1-census-join.md) |
| P2 | [Spawn recipe](plans/p2-spawn-recipe.md) | — | Digger · opus-high | **LANDED** 2026-08-26 — no kill fired: recipe proven ×3 accounts; findings in [P2](plans/p2-spawn-recipe.md) |
| P3 | [Parse coverage](plans/p3-parse-coverage.md) | — | Digger · opus-high | **LANDED** 2026-08-26 — one strict parser, zero per-repo special cases; findings in [P3](plans/p3-parse-coverage.md) |
| P4 | [Restore semantics](plans/p4-restore-semantics.md) | P1; P2 | Digger · opus-high | **LANDED** 2026-08-26 — restore lost no session; findings in [P4](plans/p4-restore-semantics.md) |
| B1 | [Census deploy](plans/b1-census-deploy.md) | — | Builder · opus-high | **LANDED** 2026-08-26 — the sensor is live on all three accounts (✓ Felix 2026-08-27); DoD evidence in [B1](plans/b1-census-deploy.md) |
| B2 | [Glass spine](plans/b2-glass-spine.md) | — | Builder · opus-high | **LANDED** 2026-08-26 — merged at G1; visual pass ✓ Felix 2026-08-27; DoD in [B2](plans/b2-glass-spine.md) |
| G1 | Batch-2 review | B1, B2 | Architect · fable-high | **LANDED** 2026-08-26 — both branches merged, B3–B6 orders cut; Felix half ✓ 2026-08-27 — G1 complete |
| B3 | [Baton rail](plans/b3-baton-rail.md) | B4 | Builder · opus-high | **LANDED** 2026-08-27 — `/` is the rail; DoD evidenced in [B3](plans/b3-baton-rail.md) |
| B4 | [Hands](plans/b4-hands.md) | G1 | Builder · opus-high | **LANDED** 2026-08-27 — all four hands on `master`; E2 paid ✓ Felix 2026-08-27; DoD evidenced in [B4](plans/b4-hands.md) |
| B5 | [Shelf + gauges](plans/b5-shelf-gauges.md) | B4 | Builder · opus-high | **LANDED** 2026-08-27 — one dead session resumed from each account; DoD evidenced in [B5](plans/b5-shelf-gauges.md) |
| B6 | [Sovereign inbox](plans/b6-sovereign-inbox.md) | B4 | Builder · opus-high | **LANDED** 2026-08-27 — his word travels; DoD evidenced in [B6](plans/b6-sovereign-inbox.md) |
| B7 | [Summon composer](plans/b7-summon-composer.md) | B4 | Builder · opus-high | **LANDED** 2026-08-27 — `/summon` is the blank page, fired; DoD evidenced in [B7](plans/b7-summon-composer.md) |
| B8 | [Glass hardenings](plans/b8-glass-hardenings.md) | B3 | Builder · opus-high | **LANDED** 2026-08-27 — all five built; DoD evidenced in [B8](plans/b8-glass-hardenings.md) |
| B9 | [Visual law sweep](plans/b9-visual-law.md) | B7 | Builder · opus-medium | **LANDED** 2026-08-27 — Inter vendored, zero `<select>` city-wide; DoD evidenced in [B9](plans/b9-visual-law.md) |
| P5 | [Permission physics (S5)](plans/p5-permission-physics.md) | — | Digger · opus-high | **LANDED** 2026-08-27 — no kill fired: `--model haiku` cannot enter `auto` on any account; findings in [P5](plans/p5-permission-physics.md) |
| B10 | [The Works](plans/b10-flow-dag.md) | P5; B14 | Builder · opus-high | **LANDED** 2026-08-27 — the plan is drawn; DoD evidenced in [B10](plans/b10-flow-dag.md) |
| B11 | [Arm + engine](plans/b11-flow-engine.md) | P5; B10; B17 | Builder · opus-high | **LANDED** 2026-08-28 — the string runs itself; DoD evidenced in [B11](plans/b11-flow-engine.md) |
| B12 | [Reactive gate + dynamic extension](plans/b12-flow-reactive.md) | B11 | Builder · opus-high | **LANDED** 2026-08-28 — the string judges itself and grows while it runs; DoD evidenced in [B12](plans/b12-flow-reactive.md) |
| G2 | Deck + engine gate | B12; ⬡-gate: the deck visual pass + arm the close flow | Architect · fable-high | **LANDED** 2026-08-28 — all 14 landings verified; Felix half paid 2026-08-28 — batch 5 CLOSED |
| P6 | [Message transport](plans/p6-message-transport.md) | — | Digger · opus-high | **LANDED** 2026-08-27 — no kill fired: B16 sends; findings in [P6](plans/p6-message-transport.md) |
| B13 | [Deck shell](plans/b13-deck-shell.md) | — | Builder · opus-high | **LANDED** 2026-08-27 — the app exists; DoD evidenced in [B13](plans/b13-deck-shell.md) |
| B14 | [City + attention](plans/b14-city-attention.md) | B13 | Builder · opus-high | **LANDED** 2026-08-27 — the blindness is dead, twice; DoD evidenced in [B14](plans/b14-city-attention.md) |
| B15 | [The Workshop](plans/b15-workshop.md) | B14 | Builder · opus-high | **LANDED** 2026-08-27 — the first real Focus tenant; DoD evidenced in [B15](plans/b15-workshop.md) |
| B16 | [The Chat](plans/b16-chat.md) | B11; P6 | Builder · opus-high | **LANDED** 2026-08-28 — the voice works; DoD evidenced in [B16](plans/b16-chat.md) |
| B17 | [Composer + live usage](plans/b17-composer-usage.md) | B10 | Builder · opus-high | **LANDED** 2026-08-27 — the wrong-stamp class and the 391-minute number both dead; DoD evidenced in [B17](plans/b17-composer-usage.md) |
| B18 | [Live identity](plans/b18-live-identity.md) | B15 | Builder · opus-high | **LANDED** 2026-08-27 — cmux is truth; DoD evidenced in [B18](plans/b18-live-identity.md) |
| B19 | [The desk](plans/b19-desk.md) | B16 | Builder · opus-high | **LANDED** 2026-08-28 — the place he writes exists; DoD evidenced in [B19](plans/b19-desk.md) |
| B20 | [The decoder](plans/b20-decoder.md) | B18 | Builder · opus-high | **LANDED** 2026-08-27 — no code word without its meaning one hover away; DoD evidenced in [B20](plans/b20-decoder.md) |
| B21 | [The Grep](plans/b21-grep.md) | B15; B16; B19 | Builder · opus-high | **LANDED** 2026-08-28 — one keystroke, one query, one click; DoD evidenced in [B21](plans/b21-grep.md) |
| B23 | [The repaint law](plans/b23-repaint-law.md) — the Chat faces first: the composer's lost keystroke, continuous full-transcript scroll + the spatial minimap (his ruling), the tenant-listener leak, the stale board, the Act-stall bounded; seeds the `--probes` interaction gate (his UI-tests direction) | — | Builder · opus-high | **LANDED** 2026-08-30 — all seven bars, zero open, budget 0: the composer face fixed at the cause (a poll may never cost a keystroke), **continuous full-transcript scroll shipped and the pager retired** (the minimap spatial, his ruling in pixels), the tenant leak dead at the seam (one mount, one listener set), the stale-board case falsified with evidence (the freshness law pinned), the Act-stall retired on a bounded record; **`bun v3/gates.ts --probes` is the standing interaction rail** (`camera/probes/standing.txt`, one gate per probe, each seen to fail). Findings F1–F12 in [B23](plans/b23-repaint-law.md). Reviewed at the tender's hand: `--glass` ALL GREEN (12 gates, 212.3 s, glass 608/0) and `--fast --probes` ALL GREEN (24 gates, 298.8 s), both exit 0; the b16 grep residue swept at the review (`fa96e55`) |
| B22 | [Hands hygiene](plans/b22-hands-hygiene.md) — the narrowed hands' debts: the trust flip at `engine/venue.ts` (C14 F6's home), the UUID sweep, the b17 probe, the audit anchor (re-confirmed C19 F6), the PermissionRequest runbook for G6, B25's folded placement + attribution | — | Builder · opus-high | **LANDED** 2026-08-30 — holds: ⬡ budget extension (~4 real turns: the b17 probe's second consecutive green + the full `lab/b22/placement.ts` re-run after F3's fix — 6/6 spent, stopped at the ceiling per D21, never borrowed). Five of six candidates paid: the trust flip was alive in `glass/trust.ts` (the composer's badge — the charge's F6 premise off by one file, both fixed and pinned), UUID addressing, the audit anchor (live `hands.jsonl` byte-identical 160 545 B across two suite runs), the runbook for G6 on file, placement + attribution live (an ignition lands in the building's own workspace, uuid-addressed). `census/deploy.ts --check` reads DRIFT ×3 **by design** until the G6 ritual. Findings F1–F8 in [B22](plans/b22-hands-hygiene.md). Reviewed at the tender's hand: hands suite 52/0, runbook + probe present, audit byte-count confirmed |
| B26 | [Batons on Belvedere](plans/b26-baton-attention.md) | — | Builder · opus-high | **LANDED** 2026-08-31 — the baton is the fifth attention class, sharing `waiting`'s rank so the two interleave under one law; the item carries the holder, the shape, the collision and its instrument's bytes, `compose` and `copy` and no ignite wiring; the Works' landed **terminal** node says it handed a baton and jumps to that item; the fixture's seeded sids are uuids (C21 F3, the first act). One standing probe (`baton.probe.ts`) and one hand-run against the real corpus. Findings F1–F8 in [B26](plans/b26-baton-attention.md) — **F1** the spec's Felix-holder-with-a-fence is today's D10 collision, **F2** nine of fifteen live batons are his and six say nothing is owed (the fourth filing of the field ask), **F6** the scrim paints over the whole app so an OPEN drawer cannot be clicked — every queue control, since B13 — and **F9** the composer takes the bytes and lands BLOCKED because a summons names a tier the draft has no field for (a contract change, named not built); F5 and F6 filed to ISSUES, nothing chased |
| B25 | [Where a fire lands](plans/b25-fire-placement.md) | — | Builder · opus-high | **KILLED** 2026-08-30 at G5 — folded into B22 (✓ Felix at the blessing); the doc stands as the fold's record |
| B24 | [His arrangement](plans/b24-arrangement.md) — the City fully his: reorder, relabel, recolor, nest; persists as `desk/city-arrangement.json`; truth underneath (census decides existence, attention outranks recency inside); candidate 7's verdict recorded either way; the layer is **spaces** (his model, ruled at the blessing — doc header carries the sketch) | — | Builder · opus-high | OPEN — re-laid 2026-08-30 at G5; arranges the post-gut City |
| B27 | [The QoL sweep](plans/b27-qol-close.md) — hotswap wired, honest-disabled city-wide, locked-tooltip dismissal, the decoder's scope walk + planned-mention resolve, the fake/real filter (C15 F5), the account knob with three labeled windows (his ruling 2026-08-28), surface titles, the tweak list (STOP-bounded) | B22; B23; B24; B26; C21 | Builder · opus-high | OPEN — re-laid 2026-08-30 at G5; the close flow died with v2, the list survives — last, sweeps all re-laid surfaces |
| G3 | Rework gate | B27; ⬡-gate: the PermissionRequest ritual + the trust-entry drain + the rework visual pass | Architect · fable-high | **KILLED** 2026-08-30 — its vehicle retired with the v2 engine (D22); its gate function re-minted as the migration close (G5). Batch 6 never ran |
| C1 | [The fence repoint](plans/c1-fence-repoint.md) | — | Builder · sonnet-high | **LANDED** 2026-08-29 — fence 5 → 7 in both flow files; findings in [C1](plans/c1-fence-repoint.md) |
| C2 | [The vocabulary molt](plans/c2-vocabulary-molt.md) | C1 | Builder · opus-high | **LANDED** 2026-08-29 — the deck speaks the standard; findings in [C2](plans/c2-vocabulary-molt.md) |
| C3 | [The grep clock flake](plans/c3-grep-clock.md) | C2 | Builder · sonnet-medium | **LANDED** 2026-08-29 — the test asserts the bound; findings in [C3](plans/c3-grep-clock.md) |
| V3 | [The v3 campaign](v3/README.md) — sub-board within | — | Architect · fable-high | **LANDED — BLESSED 2026-08-30** — the keystone set; the verdict (D22): substrate YES, v2 superseded-in-place, the Chat primary |
| C12 | [The transcript mirror](plans/c12-transcript-mirror.md) | — | Builder · opus-medium | **LANDED** 2026-08-30 — 1608 transcripts / 1.67 GB mirrored, the restore drill passed; ⬡-gate: `launchctl bootstrap` was classifier-refused — the three install commands are listed at the charge's Done-when 6 for Felix's `!`; findings in [C12](plans/c12-transcript-mirror.md) |
| C14 | [The engine seams](plans/c14-engine-seams.md) | — | Builder · opus-high | **LANDED** 2026-08-30 — all four seams; every bar evidenced in [C14](plans/c14-engine-seams.md) |
| C17 | [The camera](plans/c17-camera.md) | — | Builder · opus-high (parallel-safe with C14 — disjoint trees, two-lane rule) | **LANDED** 2026-08-30 — agents have eyes; DoD evidenced in [C17](plans/c17-camera.md) |
| C18 | [The gates](plans/c18-gates.md) | — | Builder · opus-medium | **LANDED** 2026-08-30 — `bun v3/gates.ts` is the proving run; six bars evidenced in [C18](plans/c18-gates.md) |
| C19 | [The fixture city](plans/c19-fixture-city.md) | C17 | Builder · opus-high | **LANDED** 2026-08-30 — all seven bars evidenced in [C19](plans/c19-fixture-city.md) |
| C15 | [The deck's v3 lane](plans/c15-deck-v3-lane.md) | C14; C17 | Builder · opus-high | **LANDED** 2026-08-30 — the v2 engine is gone whole; 8 of 8 bars evidenced in [C15](plans/c15-deck-v3-lane.md) |
| C16 | [The Chat chapter](plans/c16-chat-chapter.md) | C15; C17 | Builder · opus-high | **LANDED** 2026-08-30 — the Chat is primary; every bar evidenced in [C16](plans/c16-chat-chapter.md) |
| G5 | The migration close | C14; C15; C16; C17; C18; C19; ⬡-gate: his visual pass — **paid 2026-08-30** | Architect · fable-high | **LANDED** 2026-08-30 — the strangle verified whole; his verdict recorded (the ⬡ paid); the rework batch laid, blessed ✓ Felix 2026-08-30 (the rework note) |
| C20 | [The tick](plans/c20-tick.md) — C16 F2 closed at the contract: the console's `tick` verb heals a step a dead Belvedere left `running`; `settle.ts` retires; the ownership law written into v3's contract | — | Builder · opus-high | **LANDED** 2026-08-30 — the window is closed at the contract: `heal()` on the engine (`tick()` minus the fire loop — measured: `tick()` hangs the live-subject control), the console's `tick` verb over it, `settle.ts` retired, D23 written into v3's contract; findings in [C20](plans/c20-tick.md). Reviewed at the tender's hand: console 30/0 + engine 80/0, settle.ts proven gone; the `heal()` deviation RULED accepted — the kill criterion's own sanctioned space, no lane collision (no other lane touches `v3/engine`); F4 (a healed run's ready step has no driver) stands named, not built — D23's scope |
| C21 | [The gut: the cmux nag](plans/c21-gut-v1.md) — the `nagging` idle-prompt class dies whole with its stale labels; presence SURVIVES on the census's own sensors (his correction, verbatim in the doc) | — | Builder · opus-high | **LANDED** 2026-08-31 — the `nagging` class gone whole (six live sites cut, grep-proof: four hits, all comments recording the removal), presence byte-identical across the before/after pair, the 21-hour NAGGING row reads IDLE, the ⬡-queue 5 → 4; findings F1–F4 in [C21](plans/c21-gut-v1.md). Reviewed at the tender's hand: the after-shots Read (the honest City in pixels), `--glass` ALL GREEN (12 gates, 211.9 s, glass 609/0) + `--fast --probes` ALL GREEN (25 gates) on its evidence; the filings ruled — F1 (the PermissionRequest blindness) + F4 (the legend token) → B27 §8, F3 (fixture sids) → B26's first act, inbox swept |
| C22 | [The respell sweep](plans/c22-respell-sweep.md) — C27's successor at home: pre-molt prose converges to the standard; the forks RULED: `ignite` one word everywhere, the building is **Belvedere** | C23 | Builder · sonnet-high | **LANDED** 2026-08-30 — both forks applied: `ignite` one word everywhere (354 → 28 named exceptions, route + types + audit + DOM; readers accept both heads forever, tested) and Belvedere the self-name; findings in [C22](plans/c22-respell-sweep.md). Reviewed at the tender's hand: `bun v3/gates.ts --glass` ALL GREEN — 12 gates, wall 213.2 s, exit 0 (glass 583/0, barrage 1000 · 50 · 9/9); doctrine lint 0 both boards |
| C23 | [The master-doc purge](plans/c23-readme-purge.md) — this README under C35's blade: LANDED rows compress to status + findings link, spent notes die, distilled §7 entries die, live holds verbatim; single-Read after | — | Architect · fable-high | **LANDED** 2026-08-30 — 1105 → 539 lines, single-Read restored; live set diff-identical; findings in [C23](plans/c23-readme-purge.md). Reviewed at the tender's hand: lint 0 both boards after the F4a red was ruled (the tender's own ledger head trued to `(G5)`, the inbox entry swept); F4b (§8) and F4c (stale deferred lists) ride to G6 |
| G6 | The rework close — verify the batch's landings, distill, sweep the inbox, lay next | B27; ⬡-gate: the rework visual pass + the PermissionRequest ritual (B22's runbook, Felix-run) | Architect · fable-high | OPEN — laid 2026-08-30 at G5; convenes by his summons (the gate never continues the session it gates) |

**Parked from the canon sweep (GA answers, ruled 2026-08-28 — next-cut
candidates at G3, tracked not lost):** the **campus card** (a root rendering
the buildings it contains — off-register IS the register's truth, B2 F2
answered; D10 render-side freedom, no canon mint needed) · **seam adoption**
when canon row 19 lands (the glass drops its guarded `discover()` mirror for
the `assemble(path, files)` export; the D21 false-pending render-side
mitigation retires with the parser fix) · ~~typed-absence tokens (D68/D69)~~
*(superseded 2026-08-29 — the GA-11 correction placed them as D63's second
amendment + D69, and D71 then killed `unstaffed` and PARKED: what stands is
`unrecorded` and DEFERRED, and their render lands with C2, the molt)* · the D64
baton-grammar asks are batched into canon row 20 — B26
builds on today's shapes and its warning-card mitigation stands until then.

**The flow-doctrine cut (D73/D74 + the 08-29 inbox, swept 2026-08-29 — next-cut
candidates, laid as C‹n› charges when canon C32 lands at the flow-1 close;
tracked not lost):** **`budget`** — a Flow field: max engine ignitions per bless,
ceiling pauses, one re-bless extends (D73; schema + bless-view bill + engine
check) · **`continues`** — a step mode: resume the predecessor's session instead
of igniting fresh (D73's wording; B5's resume-by-stamp is the hand) · **pre-flight
kickoff validation** — before igniting, check the kickoff's opening lines against
the summons grammar (`canon/mantles/README.md`) or run `doctrine lint`'s kickoff
arm once agents C31 lands it; refuse loudly on drift — a stale fence is a stopped
step, never a mis-briefed session (the 08-29 incident's ask 2) · **post-C32
adoption** — the written baton holder retires `classifyBaton`'s inference and the
rail's `shapeOf` splitter; `holds:` retires `SPEC_PATTERNS`' interim classifier;
E-ids land as fields; render-side heuristics retire as the parser types each
field (D65) · **⬡-card on a trust refusal at blessing** — his word: "you can just
ask me to do that"; one session opened by his hand warms the cell — card it,
never guess (GA-15) · **per-building flow home** stands interim
(`belvedere/flows/` naming the building) until the reader grows legs (D73).

**Parked:** the sovereign's-DESK mint (a GA session, when inbox volume proves the
genre — keel §7) · superset's attachments convention (rides the images chapter) ·
~~rail fire-button affordance~~ (promoted to [B3](plans/b3-baton-rail.md) §4,
2026-08-26) · ~~the continuous-flow horizon~~ (Felix, 2026-08-26, corrected
wording filed to the canon inbox; **keel cut 2026-08-27**:
[plans/flow-keel.md](plans/flow-keel.md), D11 — **promoted 2026-08-27 to
batch 4**: P5 · B10 · B11 · B12 · G2, laid at the flow-cut session) · a guided
**new-building flow** (post-v0: B7's founding template covers the fire; the
ritual's Felix-steps — mkdir, the dream by his pen — stay his; the glass never
writes founding docs) · the DAG renderer drawing a board's Depends-on graph on
building pages (keel §4, post-chapter) · **the prettifying pass** (⬡ — Felix
at the deck-keel blessing: hexagonal decorative SVG elements, hexagonal
buttons, "LOTS of SVG styling"; after the deck functions, never before).

**The migration campaign — laid 2026-08-30 at D22 (the G4 verdict).** Strangler,
engine-first; every step a charge; the barrage as standing regression; the v3
engine is the city's engine and `v3/` stays its home. D22's first sweep executed
at the lay itself: the stopped run logs deleted, the `bv/c29-summon-harness`
worktree removed with its uncommitted relay preserved verbatim (the branch
stands unmerged for the GA — root inbox, this date). The arc:

1. **C14 — the engine seams** (batch 1, **LANDED 2026-08-30**).
2. **C17 — the camera** (batch 1, **LANDED 2026-08-30**).
3. **C15 — the deck's v3 lane** (batch 2, **LANDED 2026-08-30**).
4. **C16 — the Chat chapter** (batch 3, **LANDED 2026-08-30**).
5. **G5 — the migration close** (**LANDED 2026-08-30**).

**G5 LANDED 2026-08-30 — the migration campaign is CLOSED.** Six charges, their
reviews, and the close in one day; the strangle verified whole at the closing
hand (evidence on the G5 row); his verdict a punch-list pass, distilled. What
follows is the rework.

**The rework batch — laid 2026-08-30 at G5. ⬡-gate: the blessing (one
session).** The serial batch — schedule, not dependency, orders the serial half (D73's
edge test): **C23 → C22 → [B23 ∥ B22 ∥ C20] → C21 → B26 → B24 → B27 → G6**.
The doc lane runs first and exclusive (C23 owns this README; C22 the purged
prose), then the parallel triple — disjoint trees (`glass/` chat + deck-dom +
`v3/gates.ts` scoped to the `--probes` family alone vs `glass/hands.ts` +
`lab/` vs `v3/console` + `v3/README.md`), all on master, the two-lane commit
rule binds (explicit paths) — then Belvedere's own structural batch (gut → batons →
arrangement), the sweep last, the close gate after. Live resources: B22's
placement bars drive real cmux workspaces — B22 never runs concurrent with
anything else touching cmux state (its triple-mates touch none). Tender: **an
Architect review session dispatches at Felix's word** (the batch-2 precedent;
one tender owns the sum), reviews at batch boundaries. Budgets (D21 — any
ceiling a ⬡-fork): B22 ≤6 real turns / ≤$1 · B27 ≤3 / ≤$1 · all else 0.

**The blessing, batched (D44):** ① the batch, budgets, staffing above. ② the
proposed rulings, converted or amended: **B25 folds into B22** (its fate
clause delegated the fold) · **D23 — the tick verb, never a supervising
process** (glass-shatters, D3's standing bar + C6 F2's adopt; C20's doc
carries it) · **the fake/real filter pane-side** (C15 F5 named both honest
fixes; the pane's is reversible and render-side) · **the decoder resolves a
named-but-unlaid id to its planning mention, labeled** (the honest
off-register family, G1). ③ **the identity forks** (C22's kickoff amendment):
`fire` — one word everywhere vs code-keeps-fire, recommendation one-word
(the standard's own law; the callers are in-repo) but **marked taste**; `the
glass` — the building's self-name, **his alone**. ④ **the referent lists**:
the gut's (which surfaces are "Agents Presence", which chrome is "cmux
nagging") and B24's sidebar list.

**The blessing — PAID 2026-08-30, Felix, in-session:** ① the batch blessed
whole ("The batch is great"). ② all four proposed rulings converted ("fine"):
the B25 fold · **D23 blessed** · the pane-side filter · the decoder's
planned-mention resolve. ③ the identity forks RULED — "rename to ignite, call
it belvedere": `ignite` one word everywhere; the building's self-name is
**Belvedere** (C22's header carries both). ④ the referents pinned, then
corrected at his word: **presence survives** ("I do want to see when there is
an agent that's working, or has input / blocked") — **the cmux part dies**
(the `nagging` idle-prompt class and its stale labels; C21's header, re-laid
to "the gut: the cmux nag"); the sidebar is **spaces** — his own model, one
recursive structure, the fixed taxonomy rejected as Belvedere-invented
classification (B24's header carries his sketch verbatim and the trim). The
batch is ignitable: C23 first, exclusive on this README.

## 7. Decisions

- **D2** (2026-08-26, Felix): **Venue: in-repo subproject** at `agents/belvedere/`,
  simmy pattern — own README board, one pointer line in the repo CLAUDE.md, one row
  on the canon board; rows never write `canon/**`, `sync/**`, `docs/**`, or root
  protocol files; extraction later is a cheap subtree split (cornerstone §11 amendment).
- **D3** (2026-08-26, founding Architect per cornerstone §2 · ✓ Felix same day):
  **The fence.** §2's write list is exhaustive; any new write class is an
  Architect-desk question first, never a feature. Glass-shatters and parser-as-lint
  are standing bars.
- **D10** (2026-08-27, Architect, on B3 E2's corpus evidence · ✓ Felix same day):
  **Ambiguity never arms.** A Belvedere affordance that ignites work renders armed only
  when parse and prose agree; any collision renders safe — unwired, the conflict
  named on the card, copy-summons allowed (copying is reading; the gate stays
  Felix's). Interim over batons until canon rules the holder grammar (the ask is
  filed); permanent as design law for every ignite affordance — B6's apply button
  and B7's composer inherit it. Generalizes D9: the one-click path gates
  accidents, and a wired button under "pending Felix" prose is an accident
  waiting. Parse stays the parser's (D65) — this is render law, not a second
  parser.
- **D13** (2026-08-27, Felix + Architect, the deck design session · ✓ Felix
  in-session): **The Belvedere commission.** Felix's vision (ISSUES case file #2,
  folded into [plans/deck-keel.md](plans/deck-keel.md)) is Belvedere's second
  commission: three panes **Context / Focus / Action** with
  minimal/typical/expanded states, ontology **City → Building → Agent**, one
  hotswappable **Chat**, the **Works** DAG, the identity sentence ("dataviz
  dashboard first, command center second, comms third"), the no-scroll
  proportional-fill law. Supersedes v0's page IA; **the organs stand**. The
  v0 no-client-state law is **struck by his word** ("this is an app");
  **the striking law is structural** — every law CAN be struck, channel
  discipline intact (his third utterance; D7 generalized). Panes are a
  replaceable surface.
- **D14** (2026-08-27, deck session · ✓ Felix in-session): **Time flows
  down — the now-line.** The Works draws the past above (landed, dim), NOW
  as the line where live sessions blink, the plan below; scroll up =
  history, down = future — agreeing with chat, ledger, and scrollback.
- **D15** (2026-08-27, deck session · ✓ Felix in-session): **Attention lives
  twice.** City badges (ambient — attention outranks recency, at rest,
  always) + the drawer's ⬡-queue (triage — ranked, answerable in
  place, pinnable). The waiting-input blindness dies in both places.
- **D16** (2026-08-27, deck session · ✓ Felix in-session): **cmux is truth
  for live identity.** Belvedere reads names/colors off the socket; renames
  and recolors in Belvedere write through to cmux; a cmux-side rename shows
  in Belvedere. The rig's stamp is the birth name; `session_id` is the join
  key. Kills the rename/not-green/wrong-stamp drift class at the model.
- **D17** (2026-08-27, deck session · ✓ Felix in-session): **The desk — one
  drawer, `~/code/agents/desk/`.** Gitted, city-wide, account-independent;
  drafts persist there; sending routes (a field report → that building's
  ISSUES, a message → a session via P6, a draft summons → the composer).
  Authorizes the new root directory in the canon repo; the D2 fence
  otherwise stands. The parked sovereign's-DESK genre lands here — its
  volume gate paid by the field report itself.
- **D11** (2026-08-27, Felix — the flow planning session): **The arm contract.**
  A flow — the batch note as data: rows, gates, accounts, venues
  ([plans/flow-keel.md](plans/flow-keel.md)) — renders as its whole DAG before
  anything runs; **one click arms it, and the review of the rendered plan IS the
  authorization.** The engine ignites only declared steps, pauses at Felix-cards,
  on any ambiguity (D10), and on HALT; nothing emergent ever ignites. Amending a
  flow re-arms its un-ignited steps. Timing, same word: the flow chapter builds
  **after v0 closes** — rows laid at the v0 close session.
- **D12** (2026-08-27, Felix — "rec" at the batch-5 blessing; the
  recommendation was his own stated lean since the cornerstone): **Scope-arm.** An
  armed flow's declared scope (building + chapter) authorizes growth:
  judge-cut and Architect-cut steps inside the scope **auto-join** the
  running flow — the re-arm is recorded, never clicked; edits to declared
  steps, removals, and out-of-scope additions still pause for his re-arm;
  Felix-cards, D10 ambiguity, and HALT stop everything regardless of scope.
  Judge insertions were never plan growth — the landing law fires them under
  any ruling. B12 ships the scope-arm branch live, step-arm under test.
- **D19** (2026-08-29, Felix — the v3 summons): **The v3 campaign — first
  principles, not repair.** Unsatisfied with cmux, the flow, the Sidebar, the
  Chat; v2 is not fixed, it is superseded-in-place: a first-principles rebuild of
  substrate + engine as an independent implementation
  ([v3/cornerstone.md](v3/cornerstone.md)), the live Belvedere untouched and serving
  daily until the verdict gate G4 rules what survives. Batch 6 (B22–B27), G3, and
  the pending inbox sweep + flow-1 findings ruling: DEFERRED behind that verdict,
  his word ("Skip the ISSUES"). Standing requirement: the whole campaign
  agent-runnable, over and over, no manual launching.
- **D20** (2026-08-29, Felix ⬡✓ in-session): **The substrate split — headless
  engine venue, chat-first viewport.** The engine's venue and his viewport are
  two contracts. Flow steps run headless (`claude -p` — events, never pixels;
  my_checklist is the field-proven ancestor, re-examined at his word). The
  viewport: the Chat is the primary interface — read anything, send turns;
  **summon-to-terminal is the fallback** ("exactly what I wanted").
  Always-visible panes stop being a substrate requirement; cmux retreats to
  viewport candidate — the founding's visibility rationale is superseded by
  Belvedere's own organs (P1/B14). D4's adapter law upheld.
- **D22** (2026-08-30, Felix ⬡✓ in-session — the G4 verdict): **The substrate
  verdict, whole.** Headless is the engine venue — and naked `claude -p`
  without the engine is not an approved way to run unattended work. v2 is
  superseded-in-place: the v2 engine retires now (agents-flow-1 abandoned at
  his word), Belvedere's organs survive, Belvedere's hands re-point to the v3
  engine, cmux retreats to viewport candidate. Migration is strangler,
  engine-first — the seams charge leads, then the deck's v3 lane, then the
  Chat chapter. The Chat is the primary viewport; summon-to-terminal the
  fallback. Full record: [v3/plans/g4-verdict.md](v3/plans/g4-verdict.md).
  D19's deferrals (batch 6, G3, the inbox sweep, the flow-1 findings)
  unfreeze; the migration lay inherits them.
- **D21** (2026-08-29, Felix ⬡✓ in-session — "synthetic"): **The testing
  doctrine — synthetic-first, invariants as the oracle.** Engine correctness is
  proven against the fake claude — a scripted stand-in speaking C4's captured
  grammar: seeded topology fuzzing, unmetered. Real sessions are sampled, never
  fuzzed — every charge igniting real sessions carries a budget line; exceeding
  it is a ⬡-fork. A barrage run counts only when the nine invariants
  ([v3/cornerstone.md §5](v3/cornerstone.md)) machine-check green or every red
  files with its seed.
- **D23** (2026-08-30, G5's Architect · **✓ Felix same day, the rework
  blessing**): **The step-ownership contract.** A surface that drives the engine
  owns the turn it resumes (C16 F2); the healer for a step a dead driver left
  `running` is the console's **`tick` verb, never a supervising process** —
  citation: the glass-shatters test (§1, D3's standing bar) and C6 F2's adopt
  redundancy. C20 builds it.

## 8. Done when — v0

1. One window: City View lit correctly against live state, verified against a
   hand-count of running sessions across all three accounts.
2. A building page renders board / ledger tail / decision queue / ISSUES panels
   from real repos; rendered links resolve (D58).
3. The baton rail shows every live baton; a session-holder baton ignites a real
   session (worktree + branch when the charge says so); a Felix-holder baton renders
   as his card and never auto-ignites.
4. The shelf resumes a dead session from each of the three accounts.
5. Usage strip live ×3; WIP gauges live.
6. Sovereign's inbox: a deck gesture lands as a legal ISSUES entry; the apply
   button dispatches the scoped Architect session.
7. The glass-shatters drill: kill the server mid-everything — no repo harmed, every
   session lives.

**v0 — keystone set 2026-08-27; all seven run at the flow-cornerstone session (ledger,
this date); Felix's gates named per item:**

1. ✓ `10 tracked` ≡ 10 census-live by hand — 2 · 3 · 5 across the three
   accounts, every tracked pid verified against `ps` by name; `≈35 visible` ≡
   the hand `ps` count of 35; the sensor horizon labeled on-page (B5 E1's
   auditor delta). **⬡-gate: the visual pass — ✓ his words, 2026-08-27
   ("capable").**
2. ✓ `/b/agents` renders board / ledger tail / decision queue / ISSUES (plus
   live sessions and the lint panel) from the real repo; a rendered `/doc`
   link resolves 200 (D58).
3. ✓ 8/8 city batons rendered (B3); Felix-holder cards structurally unwired —
   D10 live (B3/B8); session-holder ignitions proven byte-exact ×6 (B3's worktree
   smoke, B6's apply, B7's four). **⬡-gate: the live ignition smoke — ✓ paid
   by the flow-cornerstone ignition itself, his hand on `/summon`, 2026-08-27: summons ≡
   argv ≡ first user turn, sha256 `6c3f2862…`, 405 B (also B9 F4's radio
   path and B4's rotated-password proof).**
4. ✓ one dead session resumed from each account, no user turn injected (B5).
5. ✓ usage strip 9/9 cells vs the rig's own delta ×3 accounts; 16-cap induced
   live; WIP gauges + auditor delta on all three views (B5, B9).
6. ✓ deck gestures land as legal D63 appends, append-only under ten
   concurrent POSTs; the apply button ignited the scoped Architect
   byte-identical (B6).
7. ✓ run this session: `kill -9` mid read-storm with a `/hands/worktree`
   write in flight — 10/10 sessions alive, `git status` and ISSUES
   byte-identical, the in-flight write died whole (no worktree, no branch, no
   lock residue), relaunch = one command (the orphaned shape survives cmux
   restarts), hands re-armed off the untouched env file. Bonus finding: a
   second rail on :4473 (a Builder's DoD leftover, D55 class) found and
   cleared.
