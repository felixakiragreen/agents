# The Agents Canon — Genesis

> *The Grand Architect keeps the canon, Architects think, Dispatchers tend, Diggers dig,
> Builders build — a hive building a city; files carry the truth.*

This repo is the operating system for how Felix works with Claude — **the Guild** (D37):
the canon of **mantles** (roles), **capability tiers**, **work doctrine**, and the
**global CLAUDE.md** — held here once, deployed as mirrors into every Claude account's
config dir.

## 1. Why

Felix runs three Claude Code accounts to beat session limits (~$450/mo of capability):

| Config dir | Summon | Plan |
|---|---|---|
| `~/.claude` | `claude` | Claude Max |
| `~/.claude-thg-fgreen` | `a-thg-0` | Team Premium |
| `~/.claude-thg-doorbell` | `a-thg-1` | Team Premium |

The aliases set `CLAUDE_CONFIG_DIR`. Consequence: `projects/`, history, and agent memory
are **siloed per account** — nothing crosses. The global CLAUDE.md and keybindings are
byte-identical across all three today only by hand-sync and discipline.

Meanwhile the conventions that actually run Felix's projects were pioneered per-project
and live scattered: hexwright invented Grand Architect / Area Architect / Builder
(`~/code/hexwright/CLAUDE.md`); simmy invented Dispatcher / Spikes, capability tiers, and
the board-brief-findings-bulletin pattern (`~/code/universal_robots_sdk/cap-mega/simmy/`,
tiers in `cap-mega/.claude/agents/`). Proven, but trapped in their birthplaces.

This repo canonizes all of it. One source of truth, deployed everywhere, versioned in
git. Three hives, one city: the accounts are hives — each session a bee, its memory mere
comb (D27) — and the repos are the city they raise, where truth lives in stone. The
lineage is on the record (D38): *Children of Time*, *Dune*, *Foundation* — canon is the
Understandings, inherited at summons, never taught.

## 2. The composition law

Every session is **tier × mantle × context**:

- **Tier** — the engine: model × effort. Pure preset, zero role content.
  Lives in `canon/agents/`, deployed to each account's `agents/` for dispatch.
  Proven format: simmy's `cap-mega/.claude/agents/*.md`.
- **Mantle** — the charter: mission, powers, forbidden list, deliverables. Pure content,
  zero engine. Lives in `canon/mantles/`. Grade bar: simmy's `DISPATCHER.md`.
- **Context** — the project's own docs (its CLAUDE.md, board, briefs, orders).

Summoning:
- **Dispatched:** `Agent(type=<tier>, prompt=<mantle kickoff> + <brief> + rider)`.
- **Interactive:** open a session at the right model/effort, speak the summons
  (*"You are an Architect… read X and execute"*).

The exact grammar, the tier matrix, and the five charters landed in session 01 —
operational law in `canon/mantles/README.md`.

## 3. The five mantles

| Mantle | Mission |
|---|---|
| **Grand Architect** | Keeps this canon: cross-project law, the mantle/tier/doctrine system itself. Rare summon. |
| **Architect** | Owns one project's board: reviews landed work, trues state, ratifies decisions, cuts batches, writes briefs and work orders. |
| **Dispatcher** | Logistics only, never content: turns a board into running agents, tends, relays verbatim, escalates. |
| **Digger** | Exploration: answers a brief's questions. Findings are durable; code is disposable. Kills fast, and a documented kill is a win. |
| **Builder** | Construction against a blessed spec with a measurable DoD. Output is merged code and green tests. |

## 4. Deployment map

| Canon | → Mirror | Notes |
|---|---|---|
| `canon/CLAUDE.md` | `~/.claude*/CLAUDE.md` | the global file — landed 2026-08-03 (03); **live ×3 since 2026-08-03** (Felix's deploy = D24's countersign; `check` re-verified green 3×3 2026-08-06) |
| `canon/agents/*.md` | `~/.claude*/agents/` | capability tiers — **live ×3 since 2026-08-03** (D14 symlinks) |
| `canon/mantles/*.md` | read by path | canonical delivery (D12) — summons name the charter path |
| `canon/skills/<mantle>/SKILL.md` | `~/.claude*/skills/` | interactive sugar: `/architect` … — **live ×3 since 2026-08-03** |
| `canon/work/` | not deployed | doctrine + templates, referenced by projects — landed 2026-08-03 (02) |

Mechanism: **symlink, confirmed** (04's spike — F2, F7, F8, F10): one inode of truth, one
rule for every target, no copy-mode branch. `keybindings.json` left the sync set (D15;
F11/F12: unobservable without a human in the loop — byte-identical ×3 today, hand-copy if
ever wanted). Tooling landed 2026-08-03 (04 build): **`sync/deploy`** (bootstrap + adopt,
idempotent, backs up a displaced original once) and **`sync/check`** (the drift alarm —
run it when something feels off; green + still broken ⇒ auth, not sync). `deploy` is
**Felix-run**: displacing a live config file trips the agent permission guard by design.

## 5. The campaign board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 0 | Genesis — lay the keel | Felix's blessing | Grand Architect · fable | **LANDED** 2026-08-02 |
| 01 | [Composition model](plans/01-composition-model.md) | keel | Architect · fable-max | **LANDED** 2026-08-02 |
| 02 | [Work doctrine](plans/02-work-doctrine.md) | keel; soft interlock with 01 | Architect · fable-max | **LANDED** 2026-08-03 → `canon/work/` |
| 03 | [Global CLAUDE.md](plans/03-global-claude-md.md) | 01 + 02 LANDED, 02's D-entries countersigned | Architect · fable-max | **LANDED** 2026-08-03 |
| 04 | [Sync](plans/04-sync.md) | build: 01–03 LANDED | Digger · opus-high → Builder · opus-high | **LANDED** 2026-08-03 — deploy + check green 3×3, canary ×3, smoke ✓ fgreen + doorbell (Max smoke PENDING `/login`) |
| 05 | [Saturation harvest — snappy batch-1 → canon](plans/05-saturation-harvest.md) | — | Grand Architect · fable-max | **LANDED** 2026-08-05 — D28–D30 entered amended, rejections upheld, D31 (hive-city voice) cut; D28–D31 ✓ Felix same day |
| 06 | [hexwright retrofit](plans/06-hexwright-retrofit.md) | — (D32 ✓ 2026-08-06) | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/06-hexwright-retrofit.md); hexwright D9 ✓ Felix (via D32); board minted, dream renamed |
| 07 | [simmy retrofit](plans/07-simmy-retrofit.md) | — (D32 ✓ 2026-08-06) | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/07-simmy-retrofit.md); simmy D16 ✓ Felix; B14 clear to resume |
| 08 | [summon rig](plans/08-summon-rig.md) | D34 ✓ 2026-08-06 | Builder · opus-high | **LANDED** 2026-08-06 → `summon/` + [DoD evidence](plans/08-summon-rig.md) (33 assertions green, `lab/08/run`); dotfiles source line ✓ 2026-08-06; smoke ×3 ✓ Felix 2026-08-06 (the per-account routing proof the shim couldn't give). F3 PARKED (Felix): deferred into the future slash-summons work |
| 09 | [summon rig v1.1](plans/09-summon-rig-v11.md) | 08 LANDED; D36 (dispatch countersigns) | Builder · opus-high | **LANDED** 2026-08-06 → [DoD evidence](plans/09-summon-rig-v11.md) (76 assertions green, `lab/08/run`); 2-key refire, cascade+override, `[n]one` bare, palette, 60-col wrap. Palette trap fired — escapes die in `zle -M`, so the colours ride `region_highlight` (F1/F2). D36 ✓ Felix (by dispatch); visual pass ✓ Felix 2026-08-06 — rig in daily use, refinements to accrue over live weeks; smoke ×3 ✓ Felix 2026-08-06 |
| 10 | [summon rig v1.2 — the usage panel](plans/10-summon-rig-v12-usage.md) | 09 LANDED; D41 ✓ 2026-08-07 | Builder · opus-high | **LANDED** 2026-08-07 → [DoD evidence](plans/10-summon-rig-v12-usage.md) (134 assertions green, `lab/08/run`). E2 settled: the usage source is the OAuth endpoint, keychain service derived as `sha256(config dir)[:8]` — the `.claude.json` cache was measured hours stale and once inverted the arbitrage, so the rig fetches. Felix's gate: probe (b), granted 2026-08-07. Fetcher proven on all three live accounts (F8). Felix's first look amended D41's palette law in-session — staleness greys the furniture, never the figures (F9). **Full panel visual pass PENDING Felix**; F1 (per-keystroke 1.57→2.56 ms, declined to optimise) and F6(a) (row 04's stale `~/.claude` PENDING) are the Architect's to rule on |

| 11 | [summon rig v1.3 — the live table](plans/11-summon-rig-v13-live-refresh.md) | 10 LANDED | Builder · opus-high *(proposed)* | **OPEN — spec unblessed.** Drafted 2026-08-07 by row 10's Builder at Felix's direction, not by an Architect: **an Architect reviews and cuts it, Felix blesses, before anyone builds.** Fixes what row 10's visual pass exposed — the panel repaints only on a keystroke, so an in-flight fetch is invisible if Felix just looks. Two mechanisms: a `precmd` warm-keeper (the panel opens already-current) and an await-mode tick (`read -k -t` verified working in a zle widget — 7 timer repaints over a 3 s silence). Continuous polling while open is argued and rejected in the doc, with the rate-limit evidence |
| 12 | [the dispatch guard](plans/12-dispatch-guard.md) | — | Builder · opus-high | **OPEN** — cut 2026-08-08 at the D46–D49 sitting, spec blessed same sitting (D47's mechanical arm) |

Statuses per the doctrine (`canon/work/DOCTRINE.md` §4): OPEN → IN FLIGHT → LANDED /
KILLED. Any account can host any session — the repo carries the truth; account choice is
quota arbitrage.

**Batch 2 (cut 2026-08-03): 02 → 03 → 04 build — sequential, dispatched.** A Dispatcher
tends the chain; each design landing pauses for Felix's countersign of its proposed
D-entries before the next row dispatches. Rider: `plans/RIDER.md`.

**v2 (cut 2026-08-06, D32): 06 + 07 — the retrofits.** Interactive, Felix-tended,
parallel-safe (disjoint repos), no Dispatcher and no bulletin — nothing dispatches.
Ordering rider (Felix): **07 lands before B14's resumption** — simmy's in-flight verify
row lost its session to token limits and resumes from another account onto retrofitted
docs; 06 runs anytime.

**08 (cut 2026-08-06, D34 ✓ · D35 riders same day): summon rig** — single Builder row,
independent of 06/B14, **LANDED** same day onto the amended brief. `summon/` is live in
the repo but inert until Felix adds the one dotfiles source line; the three-account smoke
is his (✓ 2026-08-06; dotfiles line ✓). F3 — a file-based agent definition sets the session
colour flag-only, freeing the positional prompt for the summons — **PARKED by Felix
2026-08-06**: deferred until the slash-summons work (`/grand-architect` …), where it
folds in; a canon question (mantles-by-path vs colour-carrying agent definitions) for
the Grand Architect when that row is cut. Parked is tracked, not lost.

**12 (cut 2026-08-08, at the D46–D49 sitting): the dispatch guard** — single Builder
row, independent: a repo-committed PreToolUse hook that denies engine overrides on
Agent calls (D47's mechanical arm; venue tooling per 05's rejection terms). Kickoff
in the order.

**Parked:** the peer-messaging experiment (SendMessage taps between live sessions —
gate-delivery pokes, cross-account bulletin pokes; pointers-not-payloads,
message-never-summons; the plane is OS-user-scoped and crosses all three accounts,
ephemeral, no audit trail) — Felix 2026-08-08: future harvest; spec sketch in this
date's ledger entry. The bulletin stands untouched.

## 6. Non-goals (v1, defended)

- Syncing sessions/history/agent-memory between accounts (D5; D27 — the silo law:
  memory is a per-account cache, durable truth promotes to repos).
- ~~Retrofitting hexwright and simmy onto the new canon — **v2**, after v1 lands. Resist
  the urge mid-campaign.~~ *(struck 2026-08-06: v1 landed, Felix called v2 — rows 06/07,
  D32. The remaining non-goals stand for v2 unchanged.)*
- `settings.json` sync — revisit when a real need appears.
- Plugin sync. Multi-machine (clone-and-deploy makes it nearly free later; not designed now).

## 7. Doctrine

This repo runs the work doctrine it canonizes — `canon/work/DOCTRINE.md` (02, D16–D23) —
and is example #1 of it. Local physics:

- Master doc = this file; the board = §5; work docs in `plans/`; rider = `plans/RIDER.md`.
  No bulletin — batches here are sequential.
- `ISSUES.md` is the incident inbox (D49) — swept by the Grand Architect at every
  summons.
- Canon changes require Felix's sign-off; dispatched sessions mark D-entries
  "(proposed — pending Felix countersign)".
- Briefs 0–04 predate the templates and are grandfathered; new work docs instantiate
  `canon/work/templates/`.

## 8. Definition of done — canon v1

1. `canon/` complete: CLAUDE.md · `agents/` (20 tiers) · `mantles/` (5 + README) ·
   `skills/` (5 shims) · `work/` (doctrine + templates). ✓
2. `sync/deploy` + `sync/check` landed; `check` green across all three accounts. ✓
3. All three accounts serve canon live; smoke-summon passes per account. ✓ fgreen +
   doorbell (`~/.claude` smoke PENDING Felix's `/login` — recorded, not blocking).
4. This repo conforms to its own doctrine (02). ✓
5. Board all LANDED; LEDGER and DECISIONS current. ✓

**Canon v1 CLOSED 2026-08-03** — evidence in the 04 Stage B checklist. The one PENDING:
Max `/login` + its smoke. Next campaign when Felix calls it: **v2 — the retrofits**
(hexwright, simmy onto the canon), cut fresh by a Grand Architect. — **Called and cut
2026-08-06** (rows 06/07, D32).

## 9. Definition of done — canon v2

1. Both parents' live surfaces speak canon: mantles by path, canonical tier names,
   doctrine vocabulary, boards true (hexwright's minted; simmy's re-staffed).
2. The pre-canon tier shadow dead: `.claude/agents/` gone on all three live cap-mega
   branches; `DISPATCHER.md` retired to a tombstone; `spikes/RIDER.md` instantiated.
3. History unedited — closed WOs, spike briefs, bulletins, ledgers, D-entries conform
   as-is, and the dream's bytes survive its rename (`initial.md` → `dream.md`, D33):
   they are the canon's ancestors, not its debtors.
4. Each parent's own D-entry + ledger records its retrofit, Felix-countersigned.
5. Canon untouched by the retrofit sessions — gaps escalated to the Grand Architect
   (the harvest queue), never patched locally.

Closed when 06 + 07 are LANDED with countersigns recorded.

**Canon v2 CLOSED 2026-08-06** — 06 (hexwright D9 ✓ Felix, carried by D32) and 07
(simmy D16 ✓ Felix) both LANDED; evidence in each row's findings. Hexwright's one
PENDING is its own: Felix's Phase-1 acceptance ruling, on hexwright's board.

## 10. The horizon — the Architect line (D39)

Felix's vision, recorded 2026-08-06. **Reserved, not cut** — nothing here is
dispatchable.

- **Royal Architect** — one per domain, overseeing all of it: every campaign, coding
  and not. The domains Felix named: **THG work** (MegaCap and its campaigns — simmy,
  snappy, manny — the side builds like the SpaceX dashboard, and the dozens of
  non-coding projects) and **personal work** (hexwright, the Guild, the Green Order, …).
- **Imperial Architect** — there will only ever be one. Oversees all domains: work
  balanced with life, true alignment, ascendancy, self-actualization — their dream,
  and ours.

**The gate:** a Royal Architect cannot be born until it has a place to live — the
substrate that connects Felix's knowledge and work seamlessly across every platform. It
does not exist yet. Building it is its own campaign, keeled by a Grand Architect when
Felix calls it. Until then the names are **reserved and unminted** (D39, D7's
precedent): no charter, no summons, no preset may claim them. Each Architect of the
line keeps a Personal Log (D40) — the Grand Architect's is `LOG.md`, here.
