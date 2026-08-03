# The Agents Canon — Genesis

> *The Grand Architect keeps the canon, Architects think, Dispatchers tend, Diggers dig,
> Builders build — files carry the truth.*

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

This repo canonizes all of it. One source of truth, deployed everywhere, versioned in git.

## 2. The composition law

Every session is **tier × mantle × context**:

- **Tier** — the engine: model × effort (× fast). Pure preset, zero role content.
  Lives in `canon/agents/`, deployed to each account's `agents/` for dispatch.
  Proven format: simmy's `cap-mega/.claude/agents/*.md`.
- **Mantle** — the charter: mission, powers, forbidden list, deliverables. Pure content,
  zero engine. Lives in `canon/mantles/`. Grade bar: simmy's `DISPATCHER.md`.
- **Context** — the project's own docs (its CLAUDE.md, board, briefs, orders).

Summoning:
- **Dispatched:** `Agent(type=<tier>, prompt=<mantle kickoff> + <brief> + rider)`.
- **Interactive:** open a session at the right model/effort, speak the summons
  (*"You are an Architect… read X and execute"*).

The exact grammar, the tier matrix, and the five charters are session 01's deliverable.

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
| `canon/CLAUDE.md` | `~/.claude*/CLAUDE.md` | the global file (session 03) |
| `canon/agents/*.md` | `~/.claude*/agents/` | capability tiers (session 01) |
| `canon/mantles/*.md` | TBD | delivery decided in 01: skills vs read-by-path (D3 amends if skills) |
| `canon/keybindings.json` | `~/.claude*/keybindings.json` | identical ×3 today (md5-verified 2026-08-02) |
| `canon/work/` | not deployed | doctrine + templates, referenced by projects (session 02) |

Mechanism (session 04): **symlink-first hypothesis** — one inode of truth, no sync
problem to solve; the script only bootstraps and verifies. A Digger spike confirms Claude
Code follows symlinks per target; any target that doesn't goes copy-mode with drift-check.

## 5. The campaign board

| # | Session | Mantle · Tier | Gate | Status |
|---|---|---|---|---|
| 0 | Genesis — lay the keel | Grand Architect · fable | Felix's blessing | **LANDED** 2026-08-02 |
| 01 | [Composition model](plans/01-composition-model.md) | Architect · fable-max | keel | OPEN |
| 02 | [Work doctrine](plans/02-work-doctrine.md) | Architect · fable-max | keel; soft interlock with 01 | OPEN |
| 03 | [Global CLAUDE.md](plans/03-global-claude-md.md) | Architect · fable-max | 01 + 02 LANDED | OPEN |
| 04 | [Sync](plans/04-sync.md) | Digger · opus-high, then Builder | spike: none (parallel-safe now) · build: 01–03 LANDED | OPEN |

Statuses: OPEN → IN FLIGHT → LANDED / KILLED. Any account can host any session — the repo
carries the truth; account choice is quota arbitrage.

## 6. Non-goals (v1, defended)

- Syncing sessions/history between accounts (Felix's call).
- Retrofitting hexwright and simmy onto the new canon — **v2**, after v1 lands. Resist
  the urge mid-campaign.
- `settings.json` sync — revisit when a real need appears.
- Plugin sync. Multi-machine (clone-and-deploy makes it nearly free later; not designed now).

## 7. Bootstrap conventions

Until 02 canonizes the real doctrine, this repo runs hexwright-style:

- Ratified choices → `DECISIONS.md` (D-entries). Canon changes require Felix's sign-off.
- Every session ends: append `LEDGER.md` (date · mantle · changed · decided · next),
  commit in Felix's git style.
- Briefs live in `plans/`, each ending with its kickoff prompt verbatim.
- Suggest a break at every clean boundary; hand the next session its summons verbatim.
- Session 02 may amend this repo's own docs to match the doctrine it canonizes.
