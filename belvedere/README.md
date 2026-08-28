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
3. append sovereign-inbox entries (ISSUES, D63 grammar: `- <date> · Felix (via
   Belvedere) · <what>` — trued 2026-08-27, B6's own first gesture caught the
   pre-D63 wording here)
4. touch HALT
5. deliver Felix's text to a session as a real turn (P6's mechanism, audited
   by sha; D10 — an ambiguous target never sends) *(deck chapter, D18)*
6. rename / recolor cmux display state, write-through, audited *(D18)*
7. write files under `desk/` only — drafts, notes, dreams; commits are never
   the glass's *(D17/D18)*

It never edits boards, ledgers, decisions, or canon — those are mantle work; Felix's
word travels as inbox entries the building's Architect applies with his name on the
ruling. Repo fences (D2): Belvedere rows never write `canon/**`, `sync/**`,
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
3. **Hands (out, narrow)** — fire (P2's recipe, proven ×3 accounts: the summons
   travels **as argv**, byte-exact first user turn), auto worktree + branch,
   focus-panel jump-in, HALT. Transport law (P2 T1–T4): text into panes rides
   `set-buffer` + `paste-buffer` (`send` rewrites literal `\n`/`\t`/`\r`); never
   paste into a live Claude TUI — it splits at the first blank line and
   auto-submits. The shelf may address sessions **by name-stamp**
   (`claude --resume "digger-agents-04"` is legal — P4 §R).

**Deployment (RULED — D8, Felix's smoke 2026-08-26):** the glass server runs
OUTSIDE cmux under `socketControlMode: password` — the socket gate is *live*
ancestry, so a pane-resident glass dies with every cmux restart and can never
reconnect; pane-resident is bootstrap/fallback only. The server presents
`CMUX_SOCKET_PASSWORD` from launch env or a gitignored local file, never git.
Sharpened by B4 E1 (D9): the password's function is **admission, not
restriction** — it lets a non-descendant glass connect at all, while the CLI
resolves an absent password from cmux Settings, so any local process of Felix's
is admitted regardless. The credential file is Belvedere's **arming switch** —
absent, every hand answers 503 — and it holds the real password, not a
sentinel, so the glass outlives any tightening of that courtesy fallback.

**Design inputs (Felix, founding session):** theme = **felikai** —
`~/code/felix/src/felikai.css` (89 lines; `hexwright/canon/felikai.css`
byte-identical; whiteboardy's copy diverged). Applied exemplars: the SpaceX
dashboard `~/code/universal_robots_sdk/cap-mega/felix/spacex-dashboard-c2` and
bob's design system `~/code/universal_robots_sdk/bob/web/src/routes/design`. Which
copy/exemplar leads is Felix's taste call at the glass build row.

**Design laws (Felix, 2026-08-27):** **encapsulation-first** — every card and row
leads with a 1–6-word name ("B8: glass hardenings", "E1: register policy"),
[expand] reveals the full text or a waggle; **Inter for running prose,
IosevkaFelix for numbers, titles, buttons, tabular data**; **colour legends** on
every coloured view; the City View **groups by parent directory**; **recency
informs sort order, never dictates it** (attention — batons, gates, escalations —
outranks it); **account usage visible wherever accounts are chosen**; **no
dropdowns** — toggled button groups. Rows from B5 on build to these natively;
[B9](plans/b9-visual-law.md) swept the pages that predate them (LANDED 2026-08-27 —
Inter vendored, zero `<select>` city-wide, encapsulations and legends everywhere).
**The one law the corpus itself cannot yet satisfy: 27 of 38 live cards write no
≤6-word name, so a card leads with a derived name where the text has one and renders
whole where it does not — the shapes need a name FIELD** (B9 F1, row-17 evidence).

**Deck-era laws (Felix, 2026-08-27, the deck design sitting — [the deck
keel](plans/deck-keel.md), BLESSED):** the law of space (no scrolling;
proportional splits; fewest words, most things) · spelling is **color, center,
grey** (his triple — American-mixed, for all new strings) · panes are a
replaceable surface · **the striking law**: every law CAN be struck, channel
discipline intact. The ⬡ hexagon motif (decorative SVG elements, hexagonal
buttons) is reserved for the prettifying pass — parked until the deck
functions.

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
| P4 | [Restore semantics](plans/p4-restore-semantics.md) — quit/relaunch over a live turn, measured | P1; P2 | Digger · opus-high | **LANDED** 2026-08-26 — kill did NOT fire: restore lost **no session**; both killed sessions returned **byte-identical** (458/736796 · 505/791537 either side). cmux persists a per-panel **resume binding, never conversational state** — `wasAgentRunning` gates it, the binding carries `CLAUDE_CONFIG_DIR`, so **the silo survives restore**. Unattended restore: **socket back 0.8 s, agents re-exec'd 3.4 s**. Loss = **the in-flight assistant turn, nothing more** — assistant messages are atomic, and a restored session **does not retry** the dropped turn (`No response requested.`). Control (§C): a cmux quit costs exactly what closing a terminal tab costs (SIGHUP; SIGKILL flushes nothing and still resumes clean) — **cmux's delta is recovery, not loss**. **§A upgrades P2's E1:** socket access is *live* ancestry (orphan with `ppid=1` → denied), so a glass in a pane **cannot survive a cmux restart** — `password` mode is load-bearing, not cosmetic. One residual measurement Felix-gated. Findings in [P4](plans/p4-restore-semantics.md) |
| B1 | [Census deploy](plans/b1-census-deploy.md) — the liveness sensor live ×3 accounts | — | Builder · opus-high | **LANDED** 2026-08-26 — merged at G1 (`ab4d857`); DoD evidence in [B1](plans/b1-census-deploy.md); D54 slip (unnamed `bunx tsc`) self-caught + accepted at G1, zero harm; live ×3 deploy **✓ Felix 2026-08-27** — the sensor is live on all three accounts |
| B2 | [Glass spine](plans/b2-glass-spine.md) — bun server: City View + building pages over `doctrine/` + census | — | Builder · opus-high | **LANDED** 2026-08-26 — merged at G1 (`a22a841`); DoD in [B2](plans/b2-glass-spine.md); E1 ruled at G1 (zero-cache scopes to CONTENT; register ≤30 s warm, age printed — implementation rides B3); F1→B5, F2→canon inbox; visual pass **✓ Felix 2026-08-27** |
| G1 | Batch-2 review — merge B1+B2; **Felix-gate: census deploy ×3 + B2 visual pass**; cut B3–B6 orders | B1, B2 | Architect · fable-high | **LANDED (Architect half)** 2026-08-26 — both branches merged, escalations ruled (D54 accepted; E1 → content-scope; F2 → honest off-register + canon question), B3–B6 orders cut and blessed. Felix half **✓ 2026-08-27**: deploy ×3 run, visual pass given — G1 complete |
| B3 | [Baton rail](plans/b3-baton-rail.md) — `/` becomes the rail; move/wave/fork buttons, Felix-cards never auto-fired | B4 | Builder · opus-high | **LANDED** 2026-08-27 — `/` is the rail (City View → `/city`), DoD evidenced in [B3](plans/b3-baton-rail.md): **8 of 8** city batons rendered (the 9th ledger writes `Next —`, not `Next:`), Felix-cards **structurally unwired** (35 of 38 cards carry zero fire wiring), a **composed worktree fire** landed byte-exact (fence = clipboard = first user turn, one sha256, probe cleaned up), fork badged, `/` **p95 48 ms**. **E1 — the G1 ruling's own implementation cost a p95 of 8.3 s**: the deferred walk still held Bun's only thread; moved to `register.worker.ts` (fixed here), but the **20 s TTL over a 9.5 s walk is the Architect's to rule**. **E2 — all three live fireable batons are Felix-gated in prose while `classifyBaton` calls them session batons**; reported on the card, escalated to canon, never overruled. F1 rig colours ≠ cmux colours (`cyan`/`pink` refused — fires died mid-way) · F2 fires into an untrusted tree stall at Claude's folder-trust dialog (**bites B7**) · F3 `bun test belvedere/glass` red on a **pre-existing** B4 collision (105 green per file) · F4/F5 canon asks: `Baton.kind`, and a **field** for a row's branch (prose reading was 0/62 sound). **E1 ruled 2026-08-27** — the worker is law (the walk never rides the request thread); TTL 5 min + hands-bust + re-walk button → [B8](plans/b8-glass-hardenings.md). **E2 ruled 2026-08-27 — D10, ambiguity never arms**: collided cards lose fire wiring, keep note + copy → B8; the grammar stays canon's (ask filed) |
| B4 | [Hands](plans/b4-hands.md) — /fire /worktree /focus /halt + hardened spawn lib; credential `~/.config/belvedere/env` | G1 (Architect half ✓) | Builder · opus-high | **LANDED** 2026-08-27 — all four hands on `master`, DoD evidenced in [B4](plans/b4-hands.md): fire byte-exact (sha ×2 identical) + resume + worktree + focus **off the live census** + HALT + disabled-mode 503s; **62 tests green**; venue restored, HALT cleared. **E1 ruled — D9** (arming switch, not lock; fence + D8 framing amended, credential kept) · **E2 paid ✓ Felix 2026-08-27** — `~/.config/belvedere/env` armed by his hand (0600 verified), socket password rotated off G1's temporary; the batch-close rail fire is the end-to-end password proof. D54 slip (`bunx tsc`, B1's again) self-reported |
| B5 | [Shelf + gauges](plans/b5-shelf-gauges.md) — resume ×3 by transcript-stamp; usage strip; WIP gauges | B4 | Builder · opus-high | **LANDED** 2026-08-27 — `/shelf` lists **723 transcripts ×3 accounts in 46 ms**, DoD evidenced in [B5](plans/b5-shelf-gauges.md): **one dead session resumed from EACH account** (three `SessionStart` beats quoted, each on its own transcript under its own `CLAUDE_CONFIG_DIR`) with **no user turn injected** — the newest turn in all three is still 10–12 h old; **307 of 723** sessions render honestly unstamped; the usage strip matches the rig's **own `_summon_usage_delta`** on **9/9 cells ×3 accounts at one instant**; the **16-cap induced live** (18 shells, hook recorded 16) renders `15+`/`1+`; **166 tests green in one process**, type gate exit 0. **E1 — the census sees 6 sessions where `ps` sees 38**: B1's hooks went live mid-city, so every pre-hook session is invisible and *every* WIP figure (rail and City View too) is a floor — the panel now prints the horizon; the sensor question is the Architect's. **E2 — `/hands/fire` widened**: on a resume, a field the glass does not know is omitted from argv, never guessed (backwards compatible; `summonsPath`/`sha` now nullable) — a resume that injected a turn would wake a dead agent with no instruction. F1 **`buildingOf` assumed a branch was one path segment** — the city's `bv/…` branches mis-housed every worktree session in its repo root, silently, on the rail and City View too (fixed at the cause) · F2 **only `Stop`/`SubagentStop` carry `bg`** (210 of 210), so an empty roster means *unknown*, and renders `?` not `0` · F3 the projects slug is lossy and is never parsed · F4 built to the §3 design laws natively; Inter's vendoring is still B9's. **E1 ruled 2026-08-27** — census stays the sole identity authority; `ps` enters as a count-only **auditor delta** (the sensor's drift alarm, `sync/check` pattern) → B9; the floor is transitional, labeled while it lasts. **E2 ratified** — omitted-never-guessed is standing hands law; uuid-only handles (D10 applied) |
| B6 | [Sovereign inbox](plans/b6-sovereign-inbox.md) — gestures → D63 ISSUES appends + the apply button | B4 | Builder · opus-high | **LANDED** 2026-08-27 — his word travels; nothing escalated, DoD evidenced in [B6](plans/b6-sovereign-inbox.md). `POST /inbox` is the fence's third write: note · defer · reorder · countersign, each ONE D63 append (`- <date> · Felix (via Belvedere) · <what>`), **payloads taken from the rendered HTML** in every proof. **Append-only measured**: ten *concurrent* gestures, BEFORE `sha256 742402d4…` is byte-identical to AFTER's first 705 bytes, 12 entries parsed, **0 lint**. **First-gesture adoption**: a building with no inbox got one whose header is the D53 template's own bytes (`sha256 3d811b06…` both sides). **Apply fired the scoped Architect** into cmux from the rendered button — first user turn **byte-identical**, 386 B, `sha bf1b1333…` both sides — probe on a throwaway worktree, closed in 4.7 s, venue restored. **Countersign: pending → recorded → folded**, all three read off files, the button only on pending. **219 tests green in one process**, type gate exit 0, rail p95 **65 ms**. F1 the fence's own wording for an inbox entry is pre-D63 in two places — **filed by the glass itself**, as the DoD smoke · **F2 `parseDecisions` marks an entry pending wherever the phrase appears, so canon D21 (`✓ Felix`, and the entry that *defines* the marker) has been a false countersign on the rail since B3 — both live cards were D21, so the city has ZERO true pending countersigns**; handled render-side (folded outranks pending, D10), the parser ask escalates to canon · F3 `/inbox` sits deliberately outside the credential gate (spec §4) — socket writes behind the arming switch, file writes in front of it · F4 a bare bullet appended onto a non-empty tail block reads as that block's evidence, so `addition()` opens a `---` for it |
| B7 | [Summon composer](plans/b7-summon-composer.md) — fire-anything: form + templates (founding incl.) + worktree composition | B4 | Builder · opus-high | **LANDED** 2026-08-27 — `/summon` is the blank page, fired; DoD evidenced in [B7](plans/b7-summon-composer.md). **Compose, then fire**: the form is inert radios (no client state, **zero `<select>` on the page**), one press resolves target · tier · stamp · colour · worktree · trust, and only that render carries a button wired to the exact JSON shown — armed by the hands' own `parseFire`. Four live fires **byte-exact** (sha256 identical page-side and transcript-side, one per criterion), the **founding template DOCTRINE §12 verbatim** at a scratch dir (185 B, `845e7932…` both sides), a **worktree-composed fire landed with cwd inside the cut worktree**, two consecutive fires incremented `builder-belvedere-02→03`, disabled mode honest (503 + in-DOM disabled button + the plan still composed), `git status` unchanged. **271 tests green in one process**, type gate exit 0, `/summon` **p95 13 ms**. **F1 — Claude's unit of trust is the PROJECT ROOT, per account, and a repository never borrows an ancestor's trust**: measured two ways in one `~/code` (a plain dir ran and beat the census 10×, a fresh `git init` stalled with 0 beats and no transcript), 36/36 live entries sit on project roots, 9/9 live sessions warm — the naive ancestor reading gives a **false warm**, which is the exact silent-success the amendment exists to prevent; binds B9 and the flow chapter · F2 the order's "scratch repo" is unfireable by construction (F1's consequence; the worktree DoD ran in `agents`) · F3 the glass's stamp slug is narrower than the rig's theater law, so `universal_robots_sdk` forks the lineage — refused loudly, never silently; a B4-boundary contract question · **F4 the live census is a load-bearing third stamp source** (`architect-belvedere` is in neither log and in the census; the rail still passes no `known` list and would double-assign it — parked to B3's ground) · F5 the Grand Architect's no-theater exception now matches the rig (`grand-architect-11` live); `.summon-theaters` read per row 14 · F6 probe residue named, not scrubbed |
| B8 | [Glass hardenings](plans/b8-glass-hardenings.md) — E1/E2 rulings live (register policy, ambiguity-never-arms), fire unwind, test isolation, offline type gate | B3 | Builder · opus-high | **LANDED** 2026-08-27 — all five built, nothing escalated; DoD evidenced in [B8](plans/b8-glass-hardenings.md). **E1 policy live**: ttl 300 s, hands bust the register, re-walk button beside the age — footer reads `ttl 300s`, **p95 45 ms** (bar 500 ms), a live worktree moved it 75s → 3s without stalling the request that took the bust. **D10 live**: hexwright + simmy render **zero** fire wiring, note + copy intact, holder untouched. **Fire unwinds** — induced refused colour, `workspace:11` closed, `fire.unwind` audited, no orphan. **`bun test belvedere/glass` 109/109 in ONE process** (B3 F3 fixed at the cause: `paths.ts` resolves env anchors per call). **Offline type gate**: `typescript@7.0.2` + `@types/bun` pinned, lockfile committed, `bunx --offline tsc --noEmit` exit 0 — covers `doctrine/` too. F1 the isolation bug was never just eight red tests — **the suite armed the city's real HALT flag and left it armed** (cleared here, venue restored), wrote 16 lines into the real audit log (four stamping `builder-belvedere-01`, which `nextStamp` counts — parked to ISSUES), and **printed Felix's live socket password into a failure diff** · **F2 the live rail now arms 0 of 38 cards** — B3 E2's measurement arriving as a consequence, unblocked only by canon's holder grammar or an unambiguous clause · F3 the worker law binds B5's scans · F4 the gate found one latent `Beat` error · F5 12 810 worktree copies deduped, parked |
| B9 | [Visual law sweep](plans/b9-visual-law.md) — §3 design laws over the pre-law pages: fonts, legends, encapsulations, city grouping, sorting, button groups | B7 | Builder · opus-medium | **LANDED** 2026-08-27 — nothing escalated; DoD evidenced in [B9](plans/b9-visual-law.md). **Inter vendored** (latin 400/700 woff2 + SIL OFL, taken from a licensed copy already in the city — no fetch), served off `/assets/…` **byte-identical** (`sha256 2301bb03…` both sides) and **zero `http(s)://` in any served page or stylesheet**; prose in Inter, numbers/titles/buttons/tables in IosevkaFelix. **`grep -c '<select'` = 0 on all seven routes** — the rail's account picker is now a radio group. Legends on `/` (15 keys) and `/city` (12). **Encapsulation-first**: 11 of 38 rail cards lead with a derived name + working `[expand]`, the other 27 render whole; board rows, ledger tail, queue and ISSUES the same. `/city` in **five `~/code/<x>` neighbourhoods**, off-register grouped the same way, **attention monotone across groups with recency only inside a rank**. Auditor delta live on all three views: `8 tracked · ≈35 claude processes visible · 27 beyond the census`. **302 tests green in one process**, type gate exit 0, rail p95 **111 ms**. F1 **27 of 38 cards write no name at all** — the row-17 ask is evidenced: the shapes need a **name field**; the derivation got no special case (spec's own STOP clause honoured) · F2 the `pages ↔ gauges` cycle the auditor would have opened, closed by moving `ago()` to `html.ts` · F3 the auditor costs **36 ms** of the request thread (p95 45 → 111 ms; a TTL is the fix if it matters, named not built), and B5 E1's `[c]laude` grep over-counts by five · F4 the picker's `:checked` read is unproven without a browser — **the close-gate live fire is that path** |
| P5 | [Permission physics (S5)](plans/p5-permission-physics.md) — why spawned sessions stall in manual mode; the lever ≤ the account's own posture; the step's permission clause | — | Digger · opus-high | **LANDED** 2026-08-27 — **no kill fired**, and S5 was never trust and never cmux: **`--model haiku` cannot enter `auto` permission mode on any account, and the fallback to `default` is silent** — `--permission-mode auto` in argv is dropped with no error (measured), because `auto` is an LLM classifier (`claude auto-mode config`, 67 KB of rules) a haiku session does not get. Bisected one venue / one account / one summons: haiku·low **default**, haiku·high **default**, opus·low auto, sonnet·medium auto; ×3 accounts uniform. **Q2 matrix 6/6** — 3 accounts × {trusted root, worktree}, **11 tool calls each incl. Write/Edit/Bash and a real `git commit`, zero prompts, zero touches** at sonnet·low. **Two stalls, distinct signatures**: permission (beats + transcript + `mode:default` + `Notification why=permission_prompt`, N=2) vs trust (**zero beats, no transcript**, live pid — a fresh `git init`, 120 s). `acceptEdits` is a partial lever measured to die at `git add` (7 of 11 steps). Resume inherits model and posture — and **the census's `SessionStart`/`UserPromptSubmit` beats report the account default, not the session's real mode** (a resumed haiku read `auto` then stalled): read posture off `PreToolUse` only. **The permission clause (F5) is B10's schema input and B11's fire gate: no permission field on a step; `haiku` illegal for an unattended step, refused at arm; `trust.ts` precheck per (step, account), sufficient as-is; loud arm-time refusal, never a mid-flow stall.** Findings in [P5](plans/p5-permission-physics.md) |
| B10 | [The Works](plans/b10-flow-dag.md) — the flow file behind `glass/flow.ts` + the building's whole work drawn: past above the now-line (dim), live blinking on it, the plan below (D14); node actions per state | P5; B14 | Builder · opus-high | OPEN — re-seated 2026-08-27 into the deck (keel §6); interim serialization = canon row 17 evidence (D7), swappable behind one module |
| B11 | [Arm + engine](plans/b11-flow-engine.md) — D11 live: one click in the Works arms; the engine fires declared steps through the existing hands, pauses at Felix-cards / D10 ambiguity / HALT, step timeouts, run-state in the census home | P5; B10; B17 | Builder · opus-high | OPEN — cut 2026-08-27, re-seated same day (bill = B17's live usage); no new write class — fires ride the hands, run-state is telemetry (D6 neighborhood) |
| B12 | [Reactive gate + dynamic extension](plans/b12-flow-reactive.md) — an escalation-marked landing auto-fires the scoped Architect into the lane (keel §5.1; B6's apply is the prototype); the DAG grows mid-flow per D12 | B11 | Builder · opus-high | OPEN — cut 2026-08-27; D12 flag set at the batch-5 blessing |
| G2 | Deck + engine gate — verify batch 5's landings (P5/P6, B10–B21), fold findings, schema evidence → canon inbox (row 17), close batch 5 | B12; Felix-gate: the deck visual pass + arm the close flow | Architect · fable-high | OPEN — fired by the armed close flow, the engine's first real act (kickoff in the batch-5 note; fallback: `/summon`) |
| P6 | [Message transport](plans/p6-message-transport.md) — the Chat's send physics: byte-exact single-turn delivery to live / mid-turn / dead sessions; T4's trap measured, bracketed paste first | — | Digger · opus-high | **LANDED** 2026-08-27 — **no kill fired: B16 sends.** The mechanism is **not** bracketed paste (that arm was measured and REFUSED — the markers land in the message as text `[200~`, every newline as CR, and a later run of the same arm truncated at the first CR): it is the **segmented paste** — newline-free segments through `set-buffer`+`paste-buffer`, newlines as `send-key alt+enter`, edge whitespace through `send`, one `enter` to submit. **Five arms byte-exact** (sha256 identical sent vs the transcript's user turn): blank lines, `$(echo pwned)` unexpanded + literal `\n \t \r` + unicode, 2/4/8-space indents with trailing spaces, a **304 B fenced code block**, and the summons itself. Both controls fired and seen (bracketed → markers as text; naked → P2 T4 reproduced, one wrong turn plus a stranded remainder). **Q2 mid-turn PASS, proven from the census** (delivery's `UserPromptSubmit` +13.3 s vs the work turn's `Stop` +15.7 s): the harness queues it, answers it next, and the 802-line in-flight turn finished `end_turn` untouched. **Q3 resume-with-a-turn PASS ×5** — byte-exact, prior conversation carried, silo held, and the **session id and transcript file are REUSED**. Three transport laws P2 could not see: **`paste-buffer` rewrites every LF to CR** (P2 T3's byte-exact verdict is an artifact of its canonical-mode sink), **`set-buffer` trims its own edge whitespace** (27 B in, 20 B out), and **`ctrl+j` — a real 0x0a — is silently dropped by the TUI**. Three compose-time refusals, each measured: a literal **TAB** never reaches the model (the TUI swallows it; the wire carries it), a first line starting with **`/`** executes as a slash command and creates **zero** user turns, and **a `workspace:N` ref that does not resolve is not an error — it delivers to the FOCUSED workspace** (a UUID 404s loudly) — **F2, the misdelivery class, binds B16, B18 and `/hands/focus`: address by UUID, always**. Five failure faces tabulated, every one detectable *before* the send; the trust dialog swallows keystrokes byte-identically and **Enter would answer it** (never pressed). Cost: 153 ms per cmux round trip, `4n−1` calls, 289 ms for one line and ~6.3 s for fourteen. Findings + the transport law in [P6](plans/p6-message-transport.md); lab `lab/p6/`; venue restored |
| B13 | [Deck shell](plans/b13-deck-shell.md) — `/deck`: three panes with min/typical/expanded states under the law of space, drawer, tooltips, the `FocusView` seam, `/deck/state` polling | — | Builder · opus-high | **LANDED** 2026-08-27 — the app exists, nothing escalated; DoD evidenced in [B13](plans/b13-deck-shell.md). **The law of space is arithmetic**: minimal·typical·expanded = 1·3·6, one function both sides render from — measured in real Chrome at 1600×900, resting `1198.50 / 199.75 / 199.75 px` (74.91 · 12.48 · 12.48 %) and flipped `159.80 / 958.80 / 479.41` (9.99 · 59.92 · 29.96 %), **all 27 combinations walked with `scrollHeight − viewport` = 0 px**. Click-to-expand driven **through the served bundle's own handler**; the drawer overlays at `position:fixed` on 3 tracks and **pins to a fourth** (context 1198.50 → 871.08 px); the tooltip is instant, expands on a 450 ms hold with its action, and dies on Escape. `/deck/state` polled **4 times, browser-counted**, and one appended beat reached the DOM in **2097 ms** of a 3000 ms interval. **`/deck` p95 2 ms · `/deck/state` p95 19 ms**, and a 9.264 s `/rewalk` had three polls land inside it in 17 · 8 · 18 ms — **B8 F3's worker law intact**. **320 tests green in one process**, type gate exit 0, zero new deps, **zero `http(s)://` in all ten served payloads**. F1 a fake DOM cannot prove the law of space — happy-dom/jsdom do no grid layout — so the DoD rides [`lab/b13/probe.ts`](lab/b13/probe.ts), a real headless Chrome over CDP with **zero dependencies fetched**; it is written for B14–B19 to reuse · F2 the split is a 69 ms transition, so **every measurement of it must settle first** (the probe's own first run failed itself on a mid-slide read) · F3 the client TS rides the **existing** offline type gate with no config change (`@types/bun` carries the DOM lib) — it caught one real error before the browser did · **F4 `min-width: 0` on every grid child is load-bearing**: an `Nfr` track is `minmax(auto, Nfr)`, so without it content silently outvotes the law · F5 the snapshot is **15 000 B at 46 sessions every 3 s** — a budget B15/B17/B18 spend on one endpoint, and the diff is the whole snapshot so an idle city redraws nothing · F6 a failed client bundle **stops the server**, deliberately |
| B14 | [City + attention](plans/b14-city-attention.md) — the Context pane: buildings, dots, attention badges (attention outranks recency); the drawer's needs-you queue, answerable in place (D15) | B13 | Builder · opus-high | **LANDED** 2026-08-27 — the blindness is dead, twice; nothing escalated, DoD evidenced in [B14](plans/b14-city-attention.md). **One computation, two renderings**: the City's badges ARE the queue's items bucketed ([`glass/attention.ts`](glass/attention.ts)), so a badge can never count what the queue does not list. **The live proof**: a real haiku·low fire through the glass's own hands stalled on a real permission prompt (`PreToolUse Write mode:default` → no `PostToolUse` → `Notification permission_prompt`, 15.2 s after the fire) and was on the deck **2.8 s** later — `agents/belvedere` at the top of the City, blocked dot, waiting badge, queue item, header `36`; workspace closed, scratch gone, `git status` byte-identical. Fixture proof: a gate badge sorts above a building **24 h newer** and a permission beat reached City + queue in **2 736 ms** of a 3 000 ms poll. **Zero fire wiring** three ways — shell, live DOM, and `/deck.js` itself (`hands/fire` 0×). **`/deck/state` p95 114 ms** over the whole live register (22 buildings · 61 sessions · 35 queue items, 51 783 B), **344 tests green in one process**, type gate exit 0, **B13's whole DoD re-run green** against the rewritten client. **F1 — `PermissionRequest` IS a real hook event and the census is not subscribed to it** (cmux's own `--settings` blob wires it; B1's ten do not), so the glass infers from a 6 s-late `Notification`; subscribing the census is a B1-class Felix-run ritual, filed not built · **F2 escalations have no field**: annotations arrive `strip()`ped of `**`, `E<n>` collides with whiteboardy's own row ids and with `E1–E4` ranges — both fixed generally, and the live city carries **0 unruled escalations in 458 rows** · F3 `default` mode waves a read-only Bash through (`echo` never prompts; a `Write` does) — refines P5 F3 for anyone inducing a stall · **F4 B13's snapshot diff could never short-circuit** (`at` moves every poll), so the deck now repaints by region signature and a half-typed note survives · F5 the auditor got B9 F3's named-not-built TTL, because the deck polls · F6 `lab/` sits outside the type gate · F7 an off-register waiting session is in the queue and in no badge (B2 F2's class, second venue) · **F8 the E1 ruling's content half now runs on a timer**: one poll is ~48 ms and **31.5 ms of it is the doctrine re-parse** (`city()`), ≈1.0 s of Bun's one thread per minute while a deck is open — comfortable today, priced for the Architect, nothing built against it |
| B15 | [The Workshop](plans/b15-workshop.md) — one building inside: live sessions first, board/tail/queue/ISSUES collapsible + reorderable, doc viewer with line anchors | B14 | Builder · opus-high | **LANDED** 2026-08-27 — the first real Focus tenant; nothing escalated, DoD evidenced in [B15](plans/b15-workshop.md). **The link that lands**: a rendered `LEDGER.md:385` opens the viewer scrolled to **line 385**, exactly one line marked, box `615.38–631.88 px` inside a pane `53.19–757.00 px` — clicked off the fixture's own ISSUES prose, and again from a landing record, and again on the **live** corpus (`hexwright/LEDGER.md:95`). A City click focuses **that** building (two buildings, two panes); the five sections render real data for `agents/belvedere` (**29 rows · 85 resolvable references**) and hexwright; **live sessions first**, each with the model its transcript names (`sonnet`/`fable`/`opus` on 11 of 13 live) and a tooltip carrying cwd · workspace · pid; a reorder by ▲▼ **and** by real `DragEvent` survives a full reload, and absent storage renders the defaults. **371 tests green in one process**, type gate exit 0, **zero fire wiring** in DOM, source and bundle. F1 **a tier is `<model> · <effort>` and only the model is on any artifact the glass can read** — the model rides the transcript head window the stamp already costs, effort renders `—`; the fourth filing of the same *field* ask (binds B17/B18) · F2 **the `FocusView` seam gained a fifth optional member** (`needs`): one building's detail is 65 kB, so it is **asked for, never broadcast** — still one endpoint, `+64 897 B and 0 ms` because the content was already parsed (B17/B18 widen this query) · F3 **a code-ticked `path:line` is still a reference** (the corpus writes nearly every path in ticks), while an unresolvable one stays text — `Span` is the shape B20's decoder hangs off · F4 **the held register is keyed on nothing**, so a second city fixture in `bun test` silently decides `deck.test.ts`'s results — named, worked around, not fixed · F5 a receipt must outlive the repaint that proves it · F6 a D54 near-slip self-reported (the gate re-run correctly) · F7 **the batch's two lanes are file-disjoint and NOT commit-disjoint** — filed to ISSUES |
| B16 | [The Chat](plans/b16-chat.md) — one hotswappable conversation view: transcript in Focus, draft in Action, independent scroll; send via P6's transport, verified after delivery; drafts persist under `desk/drafts/` | B11; P6 | Builder · opus-high | OPEN — cut 2026-08-27; if P6 kills, ships read+jump (named fallback, not a deviation) |
| B17 | [Composer + live usage](plans/b17-composer-usage.md) — Action at rest: every knob live-updating the summons, mantle colors, stamp follows the BUILDING (never cwd), usage fetched live ×3 with age printed | B10 | Builder · opus-high | OPEN — cut 2026-08-27; closes the wrong-stamp class and the 391-minute usage |
| B18 | [Live identity](plans/b18-live-identity.md) — D16 built: socket-read names/colors into state, rename/recolor write-through hands (D18), the felikai↔cmux color map (B3 F1 closed at cause), the dead jump reproduced | B15 | Builder · opus-high | **LANDED** 2026-08-27 — cmux is truth; nothing escalated, DoD evidenced in [B18](plans/b18-live-identity.md). One socket read on the poll joins on the census's `ws`: a rename made **in** cmux reached the deck on the **very next poll** (+1 poll, 3 058 ms of a 3 000 ms period), birth stamp beside it, City and Workshop from one function; a rename **from** the deck came back off `workspace list` (`title="b18 renamed from the deck"`, driven through the page's own handlers); a swatch click set `custom_color=#3F9608`; `cyan` refused **409** in cmux's own words, audited. **B3 F1 closed at the cause** — cmux accepts **any `#RRGGBB` verbatim** (`#a5e22c` → `#A5E22C`, measured over 29 candidates), so the map carries **felikai's own hexes** through Felix's felikai↔ANSI table; 7 intents, 7 audited recolours, all 200, and the probe's own fire composed with one. **The dead jump is dead**: reproduced twice (`--panel` with no `--workspace` → `not_found` by ref *and* uuid; with it → `OK` while frontmost stayed `Arc` through `focus-panel` **and** `focus-window`), fixed by reading `cmux tree` first and then `open -a` the bundle cmux names — `Arc → cmux`, the probe's panel selected. Identity degrades honestly (wrong password → `live identity STALE …`, birth names, no live badge). **398 tests green in one process**, type gate exit 0, `/deck/state` **p95 234 ms**. **F1 three mantle colours visibly change** — the map applies his table, so Builder is felikai blue and Digger felikai **orange**, not the words the rig writes (one table, one strike) · F2 whether `focus-panel` raises the app at all is macOS's call, not cmux's · F3 a workspace rename does not touch its surfaces' titles, and an agent surface's title is cmux's own glyph-rewritten display — the pane title is measured, not written · **F4 the read costs ~161 ms of every poll** (p50 67 → 228 ms), awaited so a rename needs one poll not two; the 1 s-timer alternative named not built, and B17's usage wants the headroom · F5 the socket names a session **before its own transcript does** · F6 one window is a named blindness · F7 B18's socket targets are all uuids, `attemptFire`'s are refs — B4's contract, the Architect's at G2 (P6 F2) |
| B19 | [The desk](plans/b19-desk.md) — D17 built: write anywhere, `desk/` persists it, send routes (→ building ISSUES via B6's wire, → session via B16, → composer); previewed bytes before every routed append | B16 | Builder · opus-high | OPEN — cut 2026-08-27; the glass writes only under `desk/`, commits never |
| B20 | [The decoder](plans/b20-decoder.md) — every rendered code word (row ids, D-ids, §refs) resolves on hover via the one parser: encapsulation, status, jump; tooltips nest, depth-capped; context-scoped, never guessed | B18 | Builder · opus-high | **LANDED** 2026-08-27 — no code word without its meaning one hover away; nothing escalated, DoD evidenced in [B20](plans/b20-decoder.md). **One seam, six forms**: `words()` in `deck-dom.ts` is the only place a reference becomes a control, so City, Workshop and the drawer's queue decode by construction — the live belvedere Workshop lights **164** spans and **0** inside fenced kickoffs or code ticks. **The commissioning hover works**: `canon row 17` in rendered prose → `v3 · the storage experiment · OPEN · Digger · fable-high · agents/MAP.md:106`, and a bare `row 14` in a canon doc resolves locally. **Context-scoped, measured on the real corpus**: `D2` → belvedere's, `D63` → canon's, `D99` → **unresolved naming both ranges** (`D1–D18 | D1–D67`), and an explicit `belvedere row 14` refuses rather than falling back. **Tooltips nest three deep and no further** — the cap is where the spans are MADE (layer 2's body draws zero), and a constructed cycle `B18 → D2 → B18` renders plain at the repeat. A pending countersign's tooltip previews the exact line and appends exactly it (`471 B → 534 B`, append-only ✓), **zero fire wiring** in DOM, source and bundle. **425 tests green in one process**, type gate exit 0, zero new deps, `/deck/state` untouched (a hover is 2–5 ms on its own route). B13/B14/B15 probes re-run **ALL GREEN**. F1 **`FC-`/`GA-` ids have no artifact** — detected, honestly unresolved; fifth filing of the *field* ask · F2 **half the corpus's landing records encapsulate to a DATE** (`2026-08-27`), so `encap()` must not be pointed at an annotation · F3 the tooltip primitive became a stack; the depth cap belongs where spans are made, not where they are hovered · F4 **`Building.decisionQueue` is the QUEUE, not the decisions** — a decoder built on it finds only unratified ones · F5 the City rendered **no corpus prose at all**, so its building tooltip now names *what* wants him instead of counting it · F6 a click on a code word is captured and stopped (binds B21's grep hits) · F7 the glass knows which building is canon **by convention** (`<city>/agents`), not from the register |
| B21 | [The Grep](plans/b21-grep.md) — everything greppable: transcripts ×3, register docs, plans, desk — bounded `rg`, grouped in the drawer, every hit instantly jumpable (Chat at the turn, viewer at the line, desk at the note) | B15; B16; B19 | Builder · opus-high | OPEN — cut 2026-08-27 mid-run (D57 amendment); the commissioning query is the DoD's own smoke |

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

**Batch 1 CLOSED 2026-08-26 — four landings, zero kills.** The physics held:
census join deterministic, spawn recipe proven ×3, parsers normative, restore
lossless. One canon escalation filed (the rig's `/color` turn-burn, P2's find);
the deployment ruling landed as D8 (Felix's smoke, same day).

**Batch 2 (cut 2026-08-26, the fold sitting) — the spine wave, Dispatcher-tended
(D61):** B1 ∥ B2, parallel-safe by construction — disjoint dirs
(`belvedere/census/` vs `belvedere/glass/`), **worktrees mandatory** (branches
`bv/b1-census`, `bv/b2-glass`; the shared checkout's branch is never switched;
unmerged branches ride the board until G1). Neither row drives cmux and neither
touches a live settings file — no desktop contention, no concurrency ceiling.
Dispatcher creates [plans/BULLETIN.md](plans/BULLETIN.md) at first dispatch;
announce duty applies (canon D67). **G1 batches every gate (D44):** Architect
merges or rejects both branches and cuts B3–B6's orders; Felix runs the census
deploy ×3 and gives B2 its visual pass — nothing dribbles between. Dispatcher
summons, verbatim:

```
You are a Dispatcher at sonnet-medium.
Wear ~/code/agents/canon/mantles/dispatcher.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements, board, this batch
note) and run batch 2: dispatch B1 and B2 in parallel — kickoffs verbatim from
their orders plus the rider at ~/code/agents/belvedere/plans/RIDER.md, worktrees
per the batch note — tend to landing, then stop: G1 is the Architect's and
Felix's. Escalations and the batch report come back to Felix.
```


**Batch 3 (cut at G1, 2026-08-26) — the organs, strictly serial on master:**
B4 → B3 → B8 → B5 → B6 → B7 → B9 *(chain amended 2026-08-27 — B7 joined at Felix's ask; B3 amended pre-dispatch: worktree-composed fires; B8 joined at the E1/E2 ruling sitting, firing first — the rulings go live before B5 builds over them; B9 joined on Felix's design laws, sweeping the pre-law pages before his visual pass)*, one row in flight, straight to `master` (single-writer
physics, the rig rows' precedent — no worktrees), Dispatcher-tended (D61),
announce duty (D67). The E1 ruling binds every page (as ruled 2026-08-27):
content never cached; the register serves warm off the worker — the walk never
rides the request thread — TTL 5 min with its age printed, busted by the glass's
own fires/worktrees, a manual re-walk beside the age. Felix-gates, batched at the close:
visual pass (rail + city) and the live-fire smoke from the rail. His G1 half
(census deploy ×3 + spine look) runs in parallel with B4 — batch 3 reads no live
census until B5's gauges, and those degrade honestly. Dispatcher summons,
verbatim:

```
You are a Dispatcher at sonnet-medium.
Wear ~/code/agents/canon/mantles/dispatcher.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements, board, batch-3
note) and run batch 3: B4 → B3 → B5 → B6 strictly serial, one in flight,
straight to master — kickoffs verbatim from each order plus the rider at
~/code/agents/belvedere/plans/RIDER.md — tend each landing, dispatch the next on
LANDED, stop at the close: the visual pass and live-fire smoke are Felix's.
Escalations and the batch report come back to Felix.
```

**Close gates, 2026-08-27:** Felix's visual pass given in his words — "capable";
the rearranging he wants is parked as design input for the flow chapter's
sittings. The live-fire smoke is assigned: **firing the flow-cut Architect from
`/summon`** — one act, three proofs (the smoke itself, B9 F4's radio-picker
path, B4's password end-to-end). Batch 3 closes formally at that sitting (it
runs §8's DoD).

**Batch 3 CLOSED 2026-08-27 — v0 SHIPPED.** Both Felix-gates paid: the visual
pass (his words above) and the live-fire smoke — the flow-cut Architect fired
from `/summon` by his hand, summons file ≡ argv ≡ transcript first user turn
(sha256 `6c3f2862…`, 405 B, audit 20:42:21Z, `workspace:24`,
`architect-agents-03`), one act carrying B9 F4's radio-`:checked` proof and
B4's rotated-password end-to-end proof. §8's DoD run seven-for-seven at that
sitting — evidence in the §8 close block and the ledger entry of this date.

> **HELD 2026-08-27, same day (Felix's command-deck field report — ISSUES this
> date): nothing in this batch dispatches — not P5 — until the deck design
> sitting rules the frame.** The flow chapter stays commissioned ("the DAG flow
> is super important to me", same report); its specs re-enter under the new
> keel.
>
> **The sitting ran same day — the frame is ruled: [the deck keel]
> (plans/deck-keel.md), blessing PENDING Felix (D13–D17 carry his in-session
> word).** At the blessing: P5 unfreezes as cut, and the re-cut sitting cuts
> deck batch 1 + re-seats B10 (the DAG becomes the Works focus view, keel §6);
> B11/B12/G2 stand in substance.
>
> **SUPERSEDED same day — the keel was BLESSED and batch 4 dissolved into
> batch 5 below (nothing had dispatched; the fences above remain G2's and the
> engine's law).**

**Batch 5 (the deck + the engine, cut at the deck sitting 2026-08-27, on the
BLESSED keel) — two lanes, Dispatcher-tended (D61), announce duty (D67),
rider applies:**

- **Lane A — the probes:** P5 → P6, serial within the lane. Desktop rules:
  probe sessions haiku-low fired through the glass's own hands — **amended by
  P5's own landing 2026-08-27: haiku-low is the cheapest tier only for a probe
  that needs no side-effecting tool call. A haiku session can never hold `auto`
  permission mode and stalls at its first write, silently; a probe that must do
  tool work is fired at sonnet-low, the cheapest tier that holds `auto`** — **≤2
  concurrent spawned sessions city-wide across both lanes** (builder DoD
  smokes count — the Dispatcher staggers a builder's live-fire window while
  a probe's spawn burst runs), every workspace closed at landing (D55), no
  cmux quit/relaunch anywhere (P4-class excluded), no account settings
  touched (posture is read, never re-postured).
- **Lane B — the build chain, strictly serial on master, one in flight:**
  **B13 → B14 → B15 → B18 → B20 → B10 → B17 → B11 → B16 → B19 → B21 →
  B12** — the identity-sentence order: dataviz (shell, City+attention,
  Workshop, identity, decoder), command (the Works, composer+usage,
  arm+engine), comms (Chat), the desk, the Grep, the reactive gate.
  *(Amended 2026-08-27 mid-run, D57 — the dispatch was cooking: B20 and B21
  joined on Felix's field note, ISSUES this date, ruled and drained same
  sitting, keel §3 amended; the fired Dispatcher summons below stands as
  history — the amendment message travels by Felix's hand, drafted verbatim
  in the ledger's sitting report.)* Lanes A ∥ B are parallel-safe (disjoint
  files: `lab/p5|p6/` + telemetry vs `glass/`); the Dispatcher serializes
  landings (one board/ledger true at a time). B16 consumes P6's findings —
  lane A finishes long before the chain reaches it; if P6 KILLED, B16 ships
  read+jump per its order (a named branch, not an escalation).
- **G2 fires by the armed close flow** (B12 leaves
  `flows/flow-close.flow.json`): **Felix's arm in the Works is the
  Felix-gate**, the engine's first real act, and the deck's close smoke —
  batch 3's `/summon` pattern, one rung up. His second close gate: **the
  deck visual pass** (the rooms may not retire before it). Fallback if the
  engine cannot fire: Felix fires G2's kickoff from `/summon` and the
  failure becomes G2 evidence. G2's kickoff stands in the batch-4 note
  above, its scope now the whole of batch 5.
- **Blessing (Felix, at this batch's blessing):** **D12 RULED — scope-arm**
  (his word, "rec", 2026-08-27; entry in §7); judge insertions fire under
  either ruling (the landing law, not plan growth). The **posture floor**
  rides unchanged from the batch-4 note (never beyond the account's own
  defaultMode; `bypassPermissions` never). The rearranging input is
  delivered — it became the keel. **The batch is fully blessed; nothing
  remains between the Dispatcher summons and the close gates.**

Dispatcher summons, verbatim:

```
You are a Dispatcher at sonnet-medium.
Wear ~/code/agents/canon/mantles/dispatcher.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements, board, batch-5
note) and run batch 5 in two lanes: lane A — P5 then P6 (probes, desktop
rules per the note); lane B — B13 → B14 → B15 → B18 → B10 → B17 → B11 →
B16 → B19 → B12 strictly serial, one in flight, straight to master —
kickoffs verbatim from each work doc plus the rider at
~/code/agents/belvedere/plans/RIDER.md — tend each landing, dispatch the
next on LANDED, stop after B12: G2 fires by the armed close flow (Felix's
arm in the Works), never by dispatch. Escalations and the batch report come
back to Felix.
```

**Batch 4 (flow batch 1, cut at the flow-cut sitting 2026-08-27) — the engine
chapter, strictly serial on master:** P5 → B10 → B11 → B12, one row in flight,
straight to `master` (single-writer physics, batch-3 precedent — no worktrees),
Dispatcher-tended (D61), announce duty (D67), rider applies. G2 is **not the
Dispatcher's**: it fires by the armed close flow — a declared two-node flow
(the G2 sitting + a Felix-card behind it) that B12 leaves on disk; **Felix's
arm from `/flow/…` is the Felix-gate**, the engine's first real act, and the
chapter's own close smoke (batch-3's `/summon` pattern, one rung up). Fallback
if the engine cannot fire it: Felix fires G2's kickoff from `/summon` and the
failure becomes G2 evidence. Concurrency plan: the desktop is Felix's live
screen — probe and smoke fires are haiku-low, ≤2 concurrent spawned sessions
at any moment, every probe workspace closed at landing (D55), no cmux
quit/relaunch anywhere in the batch (P4-class excluded); P5's probes and every
DoD smoke fire **through the glass's own hands** (dogfood — each fire is more
close-smoke-class evidence). The interim flow serialization is disposable by
design: it lives behind `glass/flow.ts` alone and is canon row 17's evidence
(D7) — row 17's own Felix-gate (v0 evidence in hand) is **paid by this close**;
if the Standards Office rules mid-batch, the swap is one module at a batch
boundary. Flow files (`belvedere/flows/*.flow.json`) are truth and commit;
run-state is telemetry in the census home (D6) — the fence gains no write
class. **Blessing (Felix, at this cut — D44: rulings travel in the docs):**
(1) **D12, the arm-scope fork** — *step-arm* (every mid-flow plan growth waits
for his click) vs *scope-arm* (growth inside the declared scope — building +
chapter — auto-joins; Felix-cards, D10, HALT still stop everything);
recommendation **scope-arm**, his stated lean — the commission is continuous
flow, and the bill is visible at arm. Either way, **judge insertions fire
under both rulings**: the reactive gate is the armed contract's landing law,
not plan growth — his veto point if he reads the keel otherwise. (2) **The
posture floor** — the engine never sets a permission posture beyond the
account's own `defaultMode`; `bypassPermissions` never; a P5 lever that needs
more is an escalation, not a step field. (3) **His rearranging input** (parked
at the close gates) lands at this blessing or rides as a batch amendment —
B10 builds the DAG page to §3's laws plus whatever he hands over. Dispatcher
summons, verbatim:

```
You are a Dispatcher at sonnet-medium.
Wear ~/code/agents/canon/mantles/dispatcher.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements, board, batch-4
note) and run batch 4: P5 → B10 → B11 → B12 strictly serial, one in flight,
straight to master — kickoffs verbatim from each work doc plus the rider at
~/code/agents/belvedere/plans/RIDER.md — tend each landing, dispatch the next
on LANDED, stop after B12: G2 fires by the armed close flow (Felix's arm),
never by dispatch. Escalations and the batch report come back to Felix.
```

G2's kickoff (the close flow's session step; fallback venue `/summon`),
verbatim:

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements, board,
batch-5 note) and the batch-5 findings (P5/P6, B10–B21), verify the
landings, fold — the flow-schema evidence goes to the canon inbox for
row 17 — sweep the inbox, true the board, and close batch 5.
```
*(G2's kickoff re-cut 2026-08-27 at the batch-5 amendment — unfired, so the
re-cut is legal; scope grew from flow batch 1 to the whole of batch 5.)*

**Post-probe return:** the probes' fold sitting (this Architect) cuts the build
rows — the v0 spine slices D5's scope; nothing builds on unmeasured physics. Glass
v0's evidence is the Felix-gate on canon row 17 (the storage experiment) — this
campaign's output feeds the Standards Office.

**Parked:** the sovereign's-DESK mint (a GA sitting, when inbox volume proves the
genre — keel §7) · superset's attachments convention (rides the images chapter) ·
~~rail fire-button affordance~~ (promoted to [B3](plans/b3-baton-rail.md) §4,
2026-08-26) · ~~the continuous-flow horizon~~ (Felix, 2026-08-26, corrected
wording filed to the canon inbox; **keel cut 2026-08-27**:
[plans/flow-keel.md](plans/flow-keel.md), D11 — **promoted 2026-08-27 to
batch 4**: P5 · B10 · B11 · B12 · G2, cut at the flow-cut sitting) · a guided
**new-building flow** (post-v0: B7's founding template covers the fire; the
ritual's Felix-steps — mkdir, the dream by his pen — stay his; the glass never
writes founding docs) · the DAG renderer drawing a board's Depends-on graph on
building pages (keel §4, post-chapter) · **the prettifying pass** (⬡ — Felix
at the deck-keel blessing: hexagonal decorative SVG elements, hexagonal
buttons, "LOTS of SVG styling"; after the deck functions, never before).

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
- **D8** (2026-08-26, Felix — smoke by his own hand): **Deployment (b) ruled: the
  glass lives OUTSIDE cmux.** Socket auth `socketControlMode: password`; the
  server presents `CMUX_SOCKET_PASSWORD` (the documented CLI fallback, P2 §A3),
  value in a gitignored local file or launch env, never committed. Pane-resident
  is fallback only — the gate is live ancestry; a pane glass dies with every cmux
  restart and can never reconnect (P4 §A). Evidence: `cmux --password '…'
  workspace list` from a non-cmux terminal listed both live workspaces,
  2026-08-26. *(Framing sharpened by D9: the password admits — it does not
  restrict.)*
- **D7** (2026-08-26, Felix): **The mandate is AI-native.** Belvedere is designed
  for what the city should be, never capped by what markdown made it — storage
  format unconstrained, terminal-first conventions carry no veto, city-wide
  migration pre-authorized at his word, priority from the Sovereign. Execution
  channel unchanged: the Standards Office (Grand Architect) cuts the standards;
  Belvedere supplies needs and evidence ([P3 §4](plans/p3-parse-coverage.md), the
  canon inbox entry of this date). Sharpens §1's rework mandate from "amend where
  formats fight" to "the design leads, the standards follow."
- **D9** (2026-08-27, Architect, on B4 E1's measurements · ✓ Felix same day):
  **The credential is an arming switch, not the lock — and it stays.**
  `socketControlMode: password` *admits* the outside glass (live ancestry no
  longer required — its load-bearing function, P4 §A); it does not *restrict*:
  the CLI's documented fallback resolves an absent password from cmux Settings,
  so any local process of Felix's drives the socket today (measured, B4 E1 — a
  wrong password fails loudly, none at all succeeds). No Belvedere text may
  present the password as what keeps agents off the desktop — the permission
  guard, the fence (D3), and the audit stand there. The glass keeps requiring
  `~/.config/belvedere/env` anyway (B4's call, ratified): an explicit Felix
  gesture is the cheapest safety a one-click dispatcher can carry — it gates
  accidents, not adversaries. The file keeps holding the real password, not an
  empty sentinel (the CLI would resolve one from Settings): D8's operative text
  says the server *presents* the credential, a content-ignored file is hidden
  state, and presenting the real value keeps the glass alive under the Ava
  chapter and any future tightening of the CLI's courtesy fallback. D8's
  deployment ruling stands whole; only its auth framing retires. Fence +
  deployment wording amended (§§2–3).
- **D10** (2026-08-27, Architect, on B3 E2's corpus evidence · ✓ Felix same day):
  **Ambiguity never arms.** A glass affordance that fires work renders armed only
  when parse and prose agree; any collision renders safe — unwired, the conflict
  named on the card, copy-summons allowed (copying is reading; the gate stays
  Felix's). Interim over batons until canon rules the holder grammar (the ask is
  filed); permanent as design law for every fire affordance — B6's apply button
  and B7's composer inherit it. Generalizes D9: the one-click path gates
  accidents, and a wired button under "pending Felix" prose is an accident
  waiting. Parse stays the parser's (D65) — this is render law, not a second
  parser.
- **D13** (2026-08-27, Felix + Architect, the deck design sitting · ✓ Felix
  in-session): **The deck commission.** Felix's vision (ISSUES case file #2,
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
- **D14** (2026-08-27, deck sitting · ✓ Felix in-session): **Time flows
  down — the now-line.** The Works draws the past above (landed, dim), NOW
  as the line where live sessions blink, the plan below; scroll up =
  history, down = future — agreeing with chat, ledger, and scrollback.
- **D15** (2026-08-27, deck sitting · ✓ Felix in-session): **Attention lives
  twice.** City badges (ambient — attention outranks recency, at rest,
  always) + the drawer's needs-you queue (triage — ranked, answerable in
  place, pinnable). The waiting-input blindness dies in both places.
- **D16** (2026-08-27, deck sitting · ✓ Felix in-session): **cmux is truth
  for live identity.** The deck reads names/colors off the socket; renames
  and recolors in Belvedere write through to cmux; a cmux-side rename shows
  in the deck. The rig's stamp is the birth name; `session_id` is the join
  key. Kills the rename/not-green/wrong-stamp drift class at the model.
- **D17** (2026-08-27, deck sitting · ✓ Felix in-session): **The desk — one
  drawer, `~/code/agents/desk/`.** Gitted, city-wide, account-independent;
  drafts persist there; sending routes (a field report → that building's
  ISSUES, a message → a session via P6, a draft summons → the composer).
  Authorizes the new root directory in the canon repo; the D2 fence
  otherwise stands. The parked sovereign's-DESK genre lands here — its
  volume gate paid by the field report itself.
- **D18** (2026-08-27, the deck keel §11 · ✓ Felix at the keel blessing —
  "Bless!"): **The fence grows three write classes, and only three.**
  (1) message-to-session — Felix's text delivered as a real turn via P6's
  measured mechanism, audited by sha, D10-bound (an ambiguous target never
  sends); (2) rename/recolor write-through to cmux display state, audited;
  (3) desk writes — files under `desk/` only, commits never. §2's
  exhaustive-list law stands; any further class is a new desk question
  (D3).
- **D11** (2026-08-27, Felix — the flow planning sitting): **The arm contract.**
  A flow — the batch note as data: rows, gates, accounts, venues
  ([plans/flow-keel.md](plans/flow-keel.md)) — renders as its whole DAG before
  anything runs; **one click arms it, and the review of the rendered plan IS the
  authorization.** The engine fires only declared steps, pauses at Felix-cards,
  on any ambiguity (D10), and on HALT; nothing emergent ever fires. Amending a
  flow re-arms its unfired steps. Timing, same word: the flow chapter builds
  **after v0 closes** — rows cut at the v0 close sitting.
- **D12** (2026-08-27, Felix — "rec" at the batch-5 blessing; the
  recommendation was his own stated lean since the keel): **Scope-arm.** An
  armed flow's declared scope (building + chapter) authorizes growth:
  judge-cut and Architect-cut steps inside the scope **auto-join** the
  running flow — the re-arm is recorded, never clicked; edits to declared
  steps, removals, and out-of-scope additions still pause for his re-arm;
  Felix-cards, D10 ambiguity, and HALT stop everything regardless of scope.
  Judge insertions were never plan growth — the landing law fires them under
  any ruling. B12 ships the scope-arm branch live, step-arm under test.

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

**v0 CLOSED 2026-08-27 — all seven run at the flow-cut sitting (ledger, this
date); Felix's gates named per item:**

1. ✓ `10 tracked` ≡ 10 census-live by hand — 2 · 3 · 5 across the three
   accounts, every tracked pid verified against `ps` by name; `≈35 visible` ≡
   the hand `ps` count of 35; the sensor horizon labeled on-page (B5 E1's
   auditor delta). **Felix-gate: the visual pass — ✓ his words, 2026-08-27
   ("capable").**
2. ✓ `/b/agents` renders board / ledger tail / decision queue / ISSUES (plus
   live sessions and the lint panel) from the real repo; a rendered `/doc`
   link resolves 200 (D58).
3. ✓ 8/8 city batons rendered (B3); Felix-holder cards structurally unwired —
   D10 live (B3/B8); session-holder fires proven byte-exact ×6 (B3's worktree
   smoke, B6's apply, B7's four). **Felix-gate: the live-fire smoke — ✓ paid
   by the flow-cut fire itself, his hand on `/summon`, 2026-08-27: summons ≡
   argv ≡ first user turn, sha256 `6c3f2862…`, 405 B (also B9 F4's radio
   path and B4's rotated-password proof).**
4. ✓ one dead session resumed from each account, no user turn injected (B5).
5. ✓ usage strip 9/9 cells vs the rig's own delta ×3 accounts; 16-cap induced
   live; WIP gauges + auditor delta on all three views (B5, B9).
6. ✓ glass gestures land as legal D63 appends, append-only under ten
   concurrent POSTs; the apply button fired the scoped Architect
   byte-identical (B6).
7. ✓ run this sitting: `kill -9` mid read-storm with a `/hands/worktree`
   write in flight — 10/10 sessions alive, `git status` and ISSUES
   byte-identical, the in-flight write died whole (no worktree, no branch, no
   lock residue), relaunch = one command (the orphaned shape survives cmux
   restarts), hands re-armed off the untouched env file. Bonus finding: a
   second rail on :4473 (a Builder's DoD leftover, D55 class) found and
   cleared.
