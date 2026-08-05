# The Agents Canon — Genesis

> *The Grand Architect keeps the canon, Architects think, Dispatchers tend, Diggers dig,
> Builders build — a hive building a city; files carry the truth.*

This repo is the operating system for how Felix works with Claude: the canon of **mantles**
(roles), **capability tiers**, **work doctrine**, and the **global CLAUDE.md** — held here
once, deployed as mirrors into every Claude account's config dir.

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
comb (D27) — and the repos are the city they raise, where truth lives in stone.

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
| `canon/CLAUDE.md` | `~/.claude*/CLAUDE.md` | the global file — landed 2026-08-03 (03); **PENDING Felix's `sync/deploy`** (agent guard, D14) |
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
| 05 | [Saturation harvest — snappy batch-1 → canon](plans/05-saturation-harvest.md) | — | Grand Architect · fable-max | **LANDED** 2026-08-05 — D28–D30 entered amended, rejections upheld, D31 (hive-city voice) cut; all four pending Felix countersign |

Statuses per the doctrine (`canon/work/DOCTRINE.md` §4): OPEN → IN FLIGHT → LANDED /
KILLED. Any account can host any session — the repo carries the truth; account choice is
quota arbitrage.

**Batch 2 (cut 2026-08-03): 02 → 03 → 04 build — sequential, dispatched.** A Dispatcher
tends the chain; each design landing pauses for Felix's countersign of its proposed
D-entries before the next row dispatches. Rider: `plans/RIDER.md`.

## 6. Non-goals (v1, defended)

- Syncing sessions/history/agent-memory between accounts (D5; D27 — the silo law:
  memory is a per-account cache, durable truth promotes to repos).
- Retrofitting hexwright and simmy onto the new canon — **v2**, after v1 lands. Resist
  the urge mid-campaign.
- `settings.json` sync — revisit when a real need appears.
- Plugin sync. Multi-machine (clone-and-deploy makes it nearly free later; not designed now).

## 7. Doctrine

This repo runs the work doctrine it canonizes — `canon/work/DOCTRINE.md` (02, D16–D23) —
and is example #1 of it. Local physics:

- Master doc = this file; the board = §5; work docs in `plans/`; rider = `plans/RIDER.md`.
  No bulletin — batches here are sequential.
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
(hexwright, simmy onto the canon), cut fresh by a Grand Architect.
