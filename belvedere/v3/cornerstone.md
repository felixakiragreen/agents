# v3 — the proving ground · cornerstone

**Status:** laid 2026-08-29 — awaiting ⬡ blessing · **Architect:** fable-high, his
summons ("You are an Architect at fable-high… Skip the ISSUES. I'm about to explain
why.") · **Campaign:** the building's third — v1 the founding organs (P1–B9, the v0
keystone), v2 the deck + engine era (B10–B21, G2). The living state is
[README.md](README.md); this document is the founding record and does not update.

## 1. His word — the occasion

Felix, 2026-08-29, verbatim where it binds:

- Unsatisfied with **cmux, the DAG flow, the Sidebar, the Chat**. "I've written up
  dozens of things that need fixing… I don't want to try to fix the current
  solution."
- cmux: "cmux IS better than terminal… But I don't think it will work as the
  substrate for Belvedere. Stale notifications are driving me crazy"
  (manaflow-ai/cmux#1027 — open since March, five open PRs).
- The flow: "It needs transparency/visibility + redundancy/reliability. We need to
  run a barrage of tests: probes, on flows, up to 100 agents long. Fuzzy mixing of
  parallelism and sequence, gates intermixed, escalations, everything."
- "I am fond of the UI (even though it's still clunky)… once it's running smoothly,
  only then do we decide how to proceed. For now this will be an independent
  implementation."
- "Critically, the entire process HAS to be automate-able — as in be able to be run
  by agent… over and over, without requiring my manual launching."
- Rulings in-session: batch 6 deferred (D19); **synthetic-first** spend (D21);
  headless re-examined via `~/code/my_checklist` — "a friend of mine uses [it]
  quite successfully. For some reason we examined that and chose cmux instead";
  **"The chat is primary interface, jump in is a fallback"** — summon-to-terminal
  "is exactly what I wanted" (D20).

## 2. The diagnosis — three symptoms, one layer

The four dissatisfactions are not siblings. Three trace to one layer, on this
building's own evidence:

1. **The Chat's flakiness is send physics.** P6 measured it: text into panes rides
   `set-buffer` + `paste-buffer`; a live Claude TUI splits at the first blank line
   and auto-submits ([README §3](../README.md), hands transport law). That is the
   cost of talking to a *screen* instead of a *process*.
2. **The flow's opacity is sensing.** flow-1's second run (ISSUES filings of
   2026-08-29, `5c25e20`): c29 could never land — worktree lane, row OPEN on master
   AND its branch, census sensor unreachable on an idle TUI (pid alive, engine
   blind). The engine senses the world through TUI scraping, board rows, and census
   beats because its subjects are pixels.
3. **Stale notifications are a duplicate organ.** P1 made the census the idle
   sensor (`Stop`, venue-blind); B14 made the deck the attention surface. cmux's
   notification layer now duplicates — worse — an organ the deck already owns, and
   its defects (cmux#1027) are ours to live with at someone else's velocity.

The fourth item — cmux — IS the layer. The founding ruled cmux the v0 substrate
**for visibility** ("I NEED visibility into every agent" — the founding record,
[plans/belvedere.md §4](../../plans/belvedere.md)): notification rings, native
panes, the deterministic census join. The deck's own organs have since eaten that
job. **The reason cmux won no longer exists.** Watch-don't-marry is upheld, at the
substrate itself. The Sidebar is deck UI, downstream of everything here — deferred
to the verdict.

## 3. The bet

1. **The split.** The engine's venue and Felix's viewport are two contracts. Flow
   steps run **headless** — `claude -p`, structured events in and out, no pixels.
   The viewport is **the Chat first** (read anything, send turns), **summon-to-
   terminal second** (any session materialized into a real TUI on demand, his
   hands, then back). Always-visible panes stop being a substrate requirement
   (D20).
2. **Turn-per-invocation, state on disk — the leading candidate.** Between turns a
   session is bytes (transcript + resume cursor), not a process; a step is a state
   machine over turns. The engine holds nothing a crash can lose. Glass-shatters
   becomes a property, not a drill. The measured alternative — one process, turns
   over stream-json stdin — is C4's to weigh; C6 picks on evidence.
3. **Events, never scraping.** The engine senses its subjects from their own event
   streams and hooks. The census stays the city's cross-account sensor; the deck
   stays the attention surface. TUI scraping and board-row sensing retire — the
   flow-1 blindspot class dies at the model.
4. **The log is the truth.** v2's run log is telemetry ("the engine never re-fires
   a step whose log says fired"). v3's run log is the flow's event-sourced state:
   render it for transparency, replay it for redundancy, audit it for truth.
5. **The fake claude.** Engine correctness is proven against a scripted stand-in
   speaking the captured event grammar — seeded, deterministic, instant, free —
   before any real session is spent (D21).
6. **Inherited law, independent build.** D10 (ambiguity never authorizes), D11
   (the blessing of the drawn plan is the authorization), D12 (the blessing covers
   the scope), D73 (budget ceiling; the edge test) are law and carry over
   wholesale. Code carries nothing over: the v2 engine never runs v3 charges.

## 4. The substrate contract

What any engine venue must provide — the nine capabilities. C4 measures headless
against every one; a venue that cannot meet one is measured, not assumed.

1. **ignite** — one command starts a session: account (config dir), model ×
   effort, permission posture, venue (cwd), byte-exact first turn (P2's argv law);
   returns the session id.
2. **inject** — deliver a user turn into an existing session, byte-exact, as a
   real turn — no TUI physics.
3. **sense** — session state from structured events, never scraping: working ·
   idle (turn ended) · needs-⬡ (permission or question, cause named) · dead. Turn
   boundaries explicit.
4. **read** — full transcript + live event stream, file-addressable (the Chat and
   the deck render from these).
5. **resume** — headless→headless (next turn), and **summon-to-terminal**: the
   same session in a real TUI, worked by hand, then resumable headless again.
6. **kill** — stop a session now; the state afterward is defined (transcript whole
   up to the cut).
7. **enumerate** — list sessions ×3 accounts with identity; the census join key
   holds headless.
8. **scale** — bounded concurrency; the bar: 100 simultaneous without losing 1–7.
9. **survive** — engine death orphans nothing unrecoverable: every subject either
   finishes its turn and rests on disk or dies whole; a restarted engine
   re-derives all state from disk.

## 5. The flow invariants — the oracle

The machine-checked bar every barrage run passes or fails. **A barrage without
machine-checked invariants is theater.**

1. **exactly-once** — every declared step ignites exactly once per blessing; a
   re-blessing covers unignited steps, never re-ignites landed ones.
2. **order** — no step ignites before every Depends-on edge is LANDED.
3. **gates hold** — nothing downstream of an unruled gate ignites; ⬡-cards never
   auto-ignite (D10/D11).
4. **scope** — nothing outside the blessed scope ignites (D12); ambiguity never
   advances (D10).
5. **loud pauses** — every pause, refusal, and escalation names its cause in the
   run log and surfaces within one engine tick; no silent stall (P5's law,
   generalized).
6. **clean terminals** — at landed / killed / halted: no orphan processes,
   worktrees, branches, or locks beyond what the flow declares kept (D55's
   analog).
7. **replay** — the run log alone re-derives the exact state; a killed engine,
   restarted, converges with zero double-ignitions (the crash-redo drill).
8. **truth on disk** — statuses the flow writes match what happened,
   byte-auditable; census ≡ `ps` at checkpoints.
9. **budget** — every flow carries its ignition ceiling (D73); the engine stops at
   the ceiling, never past it.

## 6. The testing doctrine — the pyramid

- **Layer 0 — the fake claude, unmetered.** A stand-in binary speaking C4's
  captured grammar, scenario-scripted (stall here, ask permission there, edit that
  doc, die mid-turn), seed-deterministic. The fuzzer generates topologies — serial
  / parallel mixes, gates intermixed, ⬡-cards, escalations, amendments mid-run,
  kills, crash injection at chosen ticks — up to 100 steps. The oracle checks all
  nine invariants; **every red files to ISSUES with its seed** — reproduction is
  one command. Thousands of runs, free.
- **Layer 1 — real session physics, sampled.** The same engine, real `claude -p`
  subjects at sonnet·low (P5: the unattended floor; haiku is illegal unattended,
  P5 F5), small topologies, ×3 accounts. Measures what the fake cannot: latency,
  usage, real permission stalls, trust, transcript truth.
- **Layer 2 — real charges, rare.** Flows whose steps do real (tiny) work —
  prompt quality, gate judgment, escalation quality — judged at review.

**The spend law (D21):** layer 0 unmetered; layers 1–2 ride per-charge budget
lines; exceeding a line is a ⬡-fork, never a silent overrun. **The mutation law:**
an oracle nobody has seen fail is a claim without evidence — the barrage charge
plants known-bad engine mutants and proves the oracle catches them, one per
invariant class (9/9). **The automation law (his word):** the whole loop — generate,
run, check, file — is one command an agent runs unattended, over and over.

## 7. Prior art — the steal list

- **my_checklist** (`~/code/my_checklist`, proven in a friend's daily use; the
  founding record already named it "the philosophical ancestor… Belvedere is this
  pattern at city scale"): headless `claude -p` action agents with a binding state
  contract (`in_progress`/`available`, stale reset when the agent dies); **the
  Chat as resume-per-turn** — each user message spawns one headless turn resuming
  the same session, conversation on disk, 409 while one runs; **questions by
  resume** — an agent's batched `QUESTIONS:` block, answers posted, same session
  resumed; every run stamped `↳ claude --resume <uuid>`. This is D20's mechanism,
  field-proven.
- **t3code** (founding record §3): `CLAUDE_CONFIG_DIR`, never `HOME` (overriding
  HOME breaks macOS keychain OAuth); resume as a persisted cursor — session id +
  last-assistant uuid.
- **This building's own evidence, inherited:** P1 (ten hook events, venue-blind,
  `Stop` the idle sensor, heartbeat 5.5 ms), P2 (summons as argv, byte-exact ×3),
  P4 (restore semantics), P5 (permission physics: the matrix, the two stall
  signatures, posture read off `PreToolUse` only), P6 (send physics — the wall v3
  routes around), flow-1's three findings (the failure classes the barrage must
  reproduce and kill).

## 8. The campaign

**Venue and fence:** [README.md](README.md) — v3 writes `belvedere/v3/**` and
gitignored telemetry only; the live deck (`glass/`), the v2 engine, canon, sync,
docs: never. The v2 deck serves daily, untouched, until G4.

**The arc** — laid batch by batch onto the [README board](README.md); only C4 is
laid today. Staffing below is the lay's proposal; each charge doc binds at its lay.

- **C4 · Headless physics** (Digger · opus-high) — LAID. The event grammar
  captured; the nine capabilities measured ×3 accounts; kill criteria on the bet
  itself. [plans/c4-headless-physics.md](plans/c4-headless-physics.md).
- **C5 · The fake claude** (Builder · opus-high) — the stand-in binary against
  C4's grammar: scenario language, seeded determinism, crash/stall/permission
  injection. Done when it replays C4's captures schema-identical + 20 scripted
  scenarios.
- **C6 · The engine core** (Builder · opus-high) — event-sourced state machine
  over a declared flow; the run log as truth; replay; resume; the nine invariants
  as executable checks. Built against the fake claude only. Inherits D10/D11/D12/
  D73 as law; the flow shape is its design freedom (evidence to the standards
  office if the doctrine grammar should follow — D7's channel).
- **C7 · The fuzzer + the barrage** (Builder · opus-high) — seeded topology
  generator, crash injection, the oracle, the mutation check, one-command
  agent-runnable loop, reds auto-filed with seeds.
- **C8 · Real-session physics under the engine** (Digger · opus-medium, budget
  line) — layer 1: small real topologies ×3 accounts through the same engine.
- **C9 · Scale** (Digger · sonnet-high, budget line) — 100 simultaneous fake;
  real-session scale measured to ≥25 with a cost extrapolation table for G4's ⬡.
- **C10 · The console demo** (Builder · opus-medium) — the thinnest surface over
  the engine's read/inject/summon: list live v3 sessions, read one live, send a
  turn, summon it to a terminal, return it headless. Not the deck rework — the
  piece his hand tests at G4.
- **G4 · The verdict** (⬡-gate) — the evidence pack (barrage record, crash drill,
  mutation 9/9, the real-session matrix, scale + cost table, the console demo
  under his hand); his rulings: the substrate verdict, v2's fate (what UI
  survives), the migration shape, the viewport call.

**Non-goals, named:** the deck UI rework (Sidebar, Chat surfaces — post-verdict) ·
migrating v2 flows or docs · touching the live deck's code · canon or standard
changes (needs and evidence ride the canon inbox, D7's channel) · Ava / remote ·
the Steward · pre-empting the viewport ruling — cmux remains Felix's daily
terminal until G4 says otherwise.

**The namespace (the standard §7):** this campaign mints no letters — charges
continue the building's C‹n›, gates its G‹n›, decisions its D‹n›
([../README.md §7](../README.md)).

## 9. Done when

The campaign bars live on the [README](README.md) — G4 convenes on them.
