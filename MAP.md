# The Agents Canon — The Map

> *The Grand Architect keeps the canon, Architects think, the dispatch tends, Diggers dig,
> Builders build — a hive building a city; files carry the truth.*

This repo is the operating system for how Felix works with Claude — **the Guild**: the
canon of **mantles** (roles), **capability tiers**, **work doctrine**, and the **global
CLAUDE.md** — held here once, deployed as mirrors into every Claude account's config dir.

## 1. Why

Felix runs three Claude Code accounts to beat session limits (~$450/mo of capability):

| Config dir | Summon | Plan |
|---|---|---|
| `~/.claude` | `claude` | Claude Max |
| `~/.claude-thg-fgreen` | `a-thg-0` | Team Premium |
| `~/.claude-thg-doorbell` | `a-thg-1` | Team Premium |

The aliases set `CLAUDE_CONFIG_DIR`. Consequence: `projects/`, history, and agent memory
are **siloed per account** — nothing crosses; durable truth lives in repos, never in a
conversation or an account's memory. This repo canonizes the conventions that run
Felix's projects — pioneered in hexwright and simmy, proven before they were law — as
one source of truth, deployed everywhere, versioned in git. Three hives, one city: the
accounts are hives — each session a bee, its memory mere comb — and the repos are the
city they raise, where truth lives in stone. The lineage is on the record: *Children of
Time*, *Dune*, *Foundation* — canon is the Understandings, inherited at summons, never
taught.

## 2. The composition law

Every session is **tier × mantle × context**:

- **Tier** — the engine: model × effort. Pure preset, zero role content. Lives in
  `canon/agents/`, deployed to each account's `agents/` for dispatch.
- **Mantle** — the charter: mission, powers, forbidden list, deliverables. Pure content,
  zero engine. Lives in `canon/mantles/`.
- **Context** — the project's own docs (its CLAUDE.md, board, charge docs).

Summoning:
- **Dispatched:** `Agent(type=<tier>, prompt=<mantle kickoff> + <charge doc> + coda)`.
- **Interactive:** the summon rig (`summon/`, sourced from dotfiles) fires the full
  summons — account-routed, name-stamped, logged.

The summons grammar, the tier matrix, and the charter template live in
`canon/mantles/README.md`.

## 3. The roster

Offices are singular — one holder at a time, a succession. Mantles are plural — many may
wear one at once. The full law, with the reserved names, is in `canon/mantles/README.md`.

| Office | Mission |
|---|---|
| **Grand Architect** | Keeps this canon: cross-project law, the mantle/tier/doctrine system itself. Rare summon. |
| **Mentat** | Thinks beside the Summoner — the cross-project thinking partner: explores, pushes back, maps the branches. Changes minds, not files; interactive only. |

| Mantle | Mission |
|---|---|
| **Architect** | Owns one project's board: reviews landed work, reconciles state, rules decisions, lays batches, writes charge docs. |
| **Builder** | Construction against a blessed spec with a measurable `Done when:`. Output is merged code and green tests. |
| **Digger** | Exploration: answers a charge doc's questions. Findings are durable; code is disposable. Kills fast, and a documented kill is a win. |
| **Fixer** | The null mantle: summoned by Felix to do something now. A session with no mantle is a Fixer, under the global file alone; the charter binds when Felix points at it. |

**The `Dispatcher` is dead** — tombstoned in `canon/mantles/dispatcher.md`; the flow
engine (charge 020's cornerstone) is its successor and **the dispatch** survives as the
system noun. Until the engine tends a real batch, a batch note names its tender
(doctrine §10).

## 4. Deployment map

| Canon | → Mirror | Notes |
|---|---|---|
| `canon/CLAUDE.md` | `~/.claude*/CLAUDE.md` | the global file — **live ×3 since 2026-08-03** |
| `canon/agents/*.md` | `~/.claude*/agents/` | capability tiers — **live ×3 since 2026-08-03** |
| `canon/mantles/*.md` | read by path | canonical delivery — summons name the charter path |
| `canon/BUILDINGS.md` | read by path | the building register — the city's book (D79); machines read it through `doctrine buildings` (039) |
| `canon/work/` | not deployed | doctrine + standard + templates, referenced by projects |

Mechanism: **symlink** — one inode of truth, one rule for every target; editing a live
path IS deploying ×3, so unsigned canon never touches one. `keybindings.json` left the
sync set (drift unobservable without a human in the loop; hand-copy if ever wanted).
Tooling: **`sync/deploy`** (bootstrap + adopt, idempotent, backs up a displaced original
once) and **`sync/check`** (the drift alarm — run it when something feels off; green +
still broken ⇒ auth, not sync). `deploy` is **Felix-run**: displacing a live config file
trips the agent permission guard by design.

## 5. The campaign board

The board, batch notes, and the deferred list live in **[BOARD.md](BOARD.md)**
(D78, split 2026-08-31 — the work state moves, the design stays; the board was 66%
of this file by bytes).


## 6. Non-goals (defended)

- Syncing sessions/history/agent-memory between accounts (the silo law: memory is a
  per-account cache; durable truth promotes to repos).
- `settings.json` sync — revisit when a real need appears. *(2026-09-01: one did — the
  `attribution` key wanted on all three accounts, applied by hand ×3; the revisit
  stands, un-laid.)*
- Plugin sync. Multi-machine (clone-and-deploy makes it nearly free later; not designed now).

## 7. Doctrine

This repo runs the work doctrine it canonizes — `canon/work/DOCTRINE.md` — and is
example #1 of it. Local physics:

- Master doc = this file; the board = `BOARD.md` (D78) — a batch's note is its review
  gate's doc, the tender ignited on one line naming it (stigmergon D40, adopted
  2026-09-08); work docs in `plans/`; the coda =
  `plans/CODA.md`; a bulletin only while a parallel batch runs (`plans/BULLETIN.md`,
  the 018 wave's, stands archival where it lies).
- `doctrine/` is the reference reader for the doctrine itself: `doctrine lint` is the
  drift alarm for the format the way `sync/check` is for the mirrors. Run it before
  claiming a board or a ledger is reconciled.
- `ISSUES.md` is the incident inbox — swept by the Grand Architect at every summons.
- Charge docs 000–004 predate the templates and are grandfathered; new work docs
  instantiate `canon/work/templates/`.

## 8. Done when — canon v1

**Keystone set 2026-08-03** — canon complete, `deploy`/`check` green ×3, all three
accounts serving canon live, this repo conforming to its own doctrine; evidence in
[004's](plans/004-sync.md) Stage B checklist (its one PENDING — Max `/login` — struck
2026-08-08 with evidence).

## 9. Done when — canon v2

**Keystone set 2026-08-06** — both parents' live surfaces speak canon (006 hexwright ·
007 simmy), blessings recorded in each charge's findings; hexwright's one PENDING —
Felix's Phase-1 acceptance ruling — rides hexwright's own board.

## 10. The horizon — the Architect line

Felix's vision, recorded 2026-08-06. **Reserved, not laid** — nothing here is
ignitable.

- **Royal Architect** — one per domain, overseeing all of it: every campaign, coding
  and not. The domains Felix named: **THG work** (MegaCap and its campaigns — simmy,
  snappy, manny — the side builds like the SpaceX dashboard, and the dozens of
  non-coding projects) and **personal work** (hexwright, the Guild, the Green Order, …).
- **Imperial Architect** — there will only ever be one. Oversees all domains: work
  balanced with life, true alignment, ascendancy, self-actualization — their dream,
  and ours.

**The gate:** a Royal Architect cannot be born until it has a place to live — the
substrate that connects Felix's knowledge and work seamlessly across every platform. It
does not exist yet. Building it is its own campaign, whose cornerstone a Grand Architect
lays when Felix calls it. Until then the names are **reserved and unminted**: no
charter, no summons, no preset may claim them. Each Architect of the line keeps a
Personal Log — the Grand Architect's is `LOG.md`, here.
