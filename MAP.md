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
| **Mentat** | Thinks beside the sovereign — the cross-project thinking partner: explores, pushes back, maps the branches. Changes minds, not files; interactive only. |

| Mantle | Mission |
|---|---|
| **Architect** | Owns one project's board: reviews landed work, reconciles state, rules decisions, lays batches, writes charge docs. |
| **Builder** | Construction against a blessed spec with a measurable `Done when:`. Output is merged code and green tests. |
| **Digger** | Exploration: answers a charge doc's questions. Findings are durable; code is disposable. Kills fast, and a documented kill is a win. |
| **Fixer** | The null mantle: summoned by the Sovereign to do something now. A session with no mantle is a Fixer, under the global file alone; the charter binds when Felix points at it. |

**The Dispatcher is dead** — tombstoned in `canon/mantles/dispatcher.md`; the flow
engine (charge 20's cornerstone) is its successor and **the dispatch** survives as the
system noun. Until the engine tends a real batch, a batch note names its tender
(doctrine §10).

## 4. Deployment map

| Canon | → Mirror | Notes |
|---|---|---|
| `canon/CLAUDE.md` | `~/.claude*/CLAUDE.md` | the global file — **live ×3 since 2026-08-03** |
| `canon/agents/*.md` | `~/.claude*/agents/` | capability tiers — **live ×3 since 2026-08-03** |
| `canon/mantles/*.md` | read by path | canonical delivery — summons name the charter path |
| `canon/work/` | not deployed | doctrine + standard + templates, referenced by projects |

Mechanism: **symlink** — one inode of truth, one rule for every target; editing a live
path IS deploying ×3, so unsigned canon never touches one. `keybindings.json` left the
sync set (drift unobservable without a human in the loop; hand-copy if ever wanted).
Tooling: **`sync/deploy`** (bootstrap + adopt, idempotent, backs up a displaced original
once) and **`sync/check`** (the drift alarm — run it when something feels off; green +
still broken ⇒ auth, not sync). `deploy` is **Felix-run**: displacing a live config file
trips the agent permission guard by design.

## 5. The campaign board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 0 | Genesis — lay the keel | ⬡-gate: blessing | Grand Architect · unrecorded | **LANDED** 2026-08-02 |
| 01 | [Composition model](plans/01-composition-model.md) | 0 | Architect · fable-max | **LANDED** 2026-08-02 |
| 02 | [Work doctrine](plans/02-work-doctrine.md) | 0 | Architect · fable-max | **LANDED** 2026-08-03 → `canon/work/` |
| 03 | [Global CLAUDE.md](plans/03-global-claude-md.md) | 01; 02; ⬡-gate: 02's D-entries countersigned | Architect · fable-max | **LANDED** 2026-08-03 |
| 04 | [Sync](plans/04-sync.md) | 01; 02; 03 | Digger · opus-high (→ Builder · opus-high for Stage B) | **LANDED** 2026-08-03 |
| 05 | [Saturation harvest — snappy batch-1 → canon](plans/05-saturation-harvest.md) | — | Grand Architect · fable-max | **LANDED** 2026-08-05 |
| 06 | [hexwright retrofit](plans/06-hexwright-retrofit.md) | ⬡-gate: D32 ✓ 2026-08-06 | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/06-hexwright-retrofit.md) |
| 07 | [simmy retrofit](plans/07-simmy-retrofit.md) | ⬡-gate: D32 ✓ 2026-08-06 | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/07-simmy-retrofit.md) |
| 08 | [summon rig](plans/08-summon-rig.md) | ⬡-gate: D34 ✓ 2026-08-06 | Builder · opus-high | **LANDED** 2026-08-06 → [findings](plans/08-summon-rig.md) |
| 09 | [summon rig v1.1](plans/09-summon-rig-v11.md) | 08; ⬡-gate: D36 (dispatch countersigns) | Builder · opus-high | **LANDED** 2026-08-06 → [findings](plans/09-summon-rig-v11.md) |
| 10 | [summon rig v1.2 — the usage panel](plans/10-summon-rig-v12-usage.md) | 09; ⬡-gate: D41 ✓ 2026-08-07 | Builder · opus-high | **LANDED** 2026-08-07 → [findings](plans/10-summon-rig-v12-usage.md) |
| 11 | [summon rig v1.3 — the live table](plans/11-summon-rig-v13-live-refresh.md) | 10; **⬡-gate: blessing** | Builder · opus-high | **OPEN — cut 2026-08-08 (Architect), blessing PENDING Felix.** Fixes what row 10's visual pass exposed — the panel repaints only on a keystroke, so an in-flight fetch is invisible if Felix just looks. Two mechanisms: a `precmd` warm-keeper (the panel opens already-current) and an await-mode tick (`read -k -t` verified in a zle widget). The cut ruled the 10-F10 spawn fork: one detached `summon-fetch` worker shape at both spawn sites, panel-open spawn retained (idle terminals draw no prompts), 10-F1 inherited as a ≤ 5 ms budget. **Deferred by Felix 2026-08-08** — the blessing gate stands unmet; nothing dispatches until his word. 13 LANDED 2026-08-22, so the rebase is real: at unshelving this row inherits the name-stamp in every asserted panel/command, and 13's narrowed F4/F5 arms (13-F1's guard, first ruled here, **moved to row 14** 2026-08-24 — 14 touches the harness now, 11 is deferred indefinitely) |
| 12 | [the dispatch guard](plans/12-dispatch-guard.md) | — | Builder · opus-high | **LANDED** 2026-08-08 → [findings](plans/12-dispatch-guard.md); **the hole, proven:** workflow-script `agent(…, {model, effort})` calls never fire `PreToolUse` (F2) — README names it, arm 4 watches it; adoption anywhere is still its own row |
| 13 | [summon rig — the name-stamp](plans/13-summon-rig-name-stamp.md) | — | Builder · opus-high | **LANDED** 2026-08-22 → [findings](plans/13-summon-rig-name-stamp.md); F7 parked: the 32-key runaway guard caps one panel's seed at ~28 ordinals |
| 14 | [summon rig — the theater cycle](plans/14-summon-rig-theater-cycle.md) | 13 | Builder · opus-high | **LANDED** 2026-08-24 → [findings](plans/14-summon-rig-theater-cycle.md); smoke ⬡✓ 2026-08-29; F5 parked: the 32-key runaway guard caps one panel's cycle at ~28 positions, and no cap is placed on the list itself |
| 15 | [Belvedere — the Sovereign's deck](belvedere/README.md) (subproject; cornerstone: [plans/belvedere.md](plans/belvedere.md)) | ⬡-gate: venue D2 ✓ Felix via keel §11 | Architect · fable-max (founding) | **IN FLIGHT** — founded 2026-08-26; the campaign runs on its own board, this row is the pointer |
| 16 | [v3 · the doctrine linter](plans/16-doctrine-linter.md) — P3's parsers harden into canon `doctrine/`: `lint` · `parse --json` · `migrate` | — | Builder · opus-high | **LANDED** 2026-08-26 → [findings](plans/16-doctrine-linter.md) |
| 17 | [v3 · the storage experiment](plans/17-storage-experiment.md) — does structured-source truth beat schema-markdown for the three consumers? | 16 · ⬡-gate: Belvedere v0 evidence — paid 2026-08-28 | Digger · fable-high | **LANDED** 2026-08-28 — **RETAIN, confirmed with numbers** → [findings + verdict](plans/17-storage-experiment.md) |
| 18 | [v3 · the great re-cut](plans/18-great-recut.md) — full-corpus migration via `doctrine migrate`, history included | 16 | Dispatcher · sonnet-medium (tends an 8-row wave of scoped Architects) | **LANDED** 2026-08-29 → [findings](plans/18-great-recut.md) |
| 19 | [v3 · doctrine v1.1 — the wave's residue](plans/19-doctrine-hardening.md): 15 evidenced tool defects fold into `doctrine/`, fixtures kept | 17 · ⬡-gate: vocabulary countersign — paid 2026-08-28 | Builder · opus-high | **LANDED** 2026-08-28 → [findings](plans/19-doctrine-hardening.md) |
| 20 | [the continuous flow — the cornerstone session](plans/20-continuous-flow.md): flow doctrine, the flow engine's law, the D64 grammar asks (kind/recommendation/branch/holder/holds), cross-building Depends-on | 17 · ⬡-gate: his call to sit | Grand Architect · fable-max | **LANDED** 2026-08-29 → [design + findings](plans/20-continuous-flow.md) |
| 21 | [the working vocabulary — the census, then the standard](plans/21-vocabulary.md): full-city term census (concepts-driven, orthography included) → Felix chooses → the standard; subsumes bless-vs-countersign; §13 on the block | ⬡-gate: his call to sit — paid 2026-08-28 | Grand Architect · fable-max | **LANDED** 2026-08-29 — **the standard blessed** → [the census](plans/21-census.md) · [STANDARD.md](canon/work/STANDARD.md) |
| 22 | [summon rig — the argv summons](plans/22-summon-argv.md): the summons composes into the prompt slot, colour goes venue-native (P2 §S3/§T4: paste splits at the first blank line — the 359-fire gap) | ⬡-gate: blessing | Builder · opus-high | OPEN — cut 2026-08-28 (GA-11); three forks await his blessing in the stub |
| C23 | [the law book](plans/c23-law-book.md) — canon speaks the standard: DOCTRINE respelled + §13 superseded, STANDARD.md promoted, the global waggle line (live wire), templates → charge.md, rider → coda, the-city, dispatcher tombstoned | — | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings](plans/c23-law-book.md) |
| C24 | [the parser](plans/c24-parser.md) — grammar tokens (⬡-gate · DEFERRED · C‹n› · ⬡✓ · ignite), migrate respell rules, charges-always-staffed lint-hard, city dry-run counts | C23 | Builder · opus-high | **LANDED** 2026-08-29 → [findings](plans/c24-parser.md) |
| C25 | [the respell sweep](plans/c25-respell-sweep.md) — live surfaces city-wide (migrate + the graveyard); absorbs the 18-continuation (whiteboardy re-fire · snappy separators · spacex heads · bob heads — sanctions on record); history, voice, and charters fenced | C24 | Architect · opus-high | **LANDED** 2026-08-29 → [findings](plans/c25-respell-sweep.md) |
| C26 | [the language linter](plans/c26-language-linter.md) — the vocabulary arm: graveyard + American/grey lexicon + prefix table + the pinned 24; ancestor manny M13, food lab/21/lexicon.json | C24 | Builder · opus-high | **LANDED** 2026-08-29 → [findings](plans/c26-language-linter.md) |
| C27 | [the glass](plans/c27-glass.md) — Belvedere speaks the standard (deck copy, tokens, baton verbs; the ⬡-queue by name); runs on the Belvedere board, this charge is the pointer | C24 | Architect · fable-high | **LANDED 2026-08-29 — PENDING ⬡ visual pass** (relaunch the deck; the pass rides this cell as its annotation) → [findings](plans/c27-glass.md); three canon asks filed |
| C28 | [the charters](plans/c28-charters.md) — offices + mantles redrafted on Felix's own drafts; Fixer named, shims re-minted; the spend-fork information-needs clause rides as drafting input | C23 · ⬡-gate: Felix's office/mantle charter drafts — paid 2026-08-29 | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings F1–F33](plans/c28-charters.md) |
| C29 | [the summon harness](plans/c29-summon-harness.md) — `lab/08/run` follows `presets.tsv` after the `d dispatcher` retirement; 13-F1's guard gains its removal arm | C25 | Builder · opus-high | OPEN — laid 2026-08-29 (C25-F3: the harness names the dead preset in three assertions and two column-sensitive wrap checks; 1 → 15 red at the retirement) |
| C30 | [the master-doc prose sweep](plans/c30-master-doc-prose.md) — the outer city's five big master docs speak the standard in prose (whiteboardy GENESIS 140 · snappy 118 · arborist 99 · theseus 41 · simmy 40, ~450 adjudicated hits) | C25 | Architect · opus-high | OPEN — laid 2026-08-29; C23-F3's use-vs-mention rule is the method, C25's fence and F4 rulings bind; lane of agents-flow-1; scope grown 2026-08-29 (fork 4 ⬡ a): + this repo's live vocabulary hits, guards in the doc |
| C31 | [doctrine v1.2 — the defects](plans/c31-doctrine-defects.md) — migrate's stale-parse lie · house-dialect rules · the prefixed-D blind spot | — | Builder · opus-high | OPEN — laid 2026-08-29 (GA-15); lane 1 of agents-flow-1 |
| C32 | [the flow grammar](plans/c32-flow-grammar.md) — D74 built: written holder · holds · E-ids · Branch · encapsulation · qualified Depends-on · tier split | C31 | Builder · opus-high | OPEN — laid 2026-08-29 (GA-15); ⬡-gate paid at the lay (D73/D74 ⬡✓ in-session); lane 1 of agents-flow-1 |
| G1 | [flow-1's close gate](plans/g1-flow-close.md) — verify the four landings, merge c29's branch, distill, hand the verdict card | C29; C30; C31; C32 | Architect · fable-high | OPEN — laid 2026-08-29 (GA-15); the close of agents-flow-1 |
| C33 | [the canon landing](plans/c33-canon-landing.md) — the D76-blessed roster lands: GUILD.md + six charters (fixer minted), the fixer/mentat shims (live sync), README roster + grammar + template, DOCTRINE §12's kickoff | C28 | Builder · opus-medium | **LANDED** 2026-08-29 → [findings](plans/c33-canon-landing.md); F3's wrap ruling owed — rides the next charter sweep |
| C34 | [the register purge](plans/c34-register-purge.md) — the constitution consolidated: D1–D76 killed whole, the homeless clauses distilled, the skills shims purged | C33 · ⬡-gate: his call to sit — paid 2026-08-29 | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings](plans/c34-register-purge.md); hold cleared 2026-08-29: the three dangling skills symlinks removed (⬡'s hand, verified gone ×3 at C35) |
| C35 | [the master-doc purge](plans/c35-map-purge.md) — MAP re-cut with C34's blade: LANDED charges compress to status + findings link, spent batch notes die, dead numbers strip; live holds survive verbatim | C34 | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings](plans/c35-map-purge.md) |

Statuses per the doctrine (`canon/work/DOCTRINE.md` §4): OPEN → IN FLIGHT → LANDED /
KILLED. Any account can host any session — the repo carries the truth; account choice is
quota arbitrage.

**agents-flow-1 (laid 2026-08-29, GA-15): C31 → C32 ∥ C29 ∥ C30 → G1 → ⬡-verdict —
the Guild's first engine-run batch (D73; the vehicle blessed in-session).** The flow
file is the batch note: `belvedere/flows/agents-flow-1.flow.json` (D73's interim
home — Belvedere is the only reader today); this note is the pointer. Tender: **the
dispatch** — Felix **blesses** it in the Works; the review of the drawn plan IS the
authorization (D11; arm → bless, ⬡ ruled 2026-08-29 — "Bless bless").
Shape: C31 → C32 serial on the agents master checkout (shared `doctrine/` files);
C29 parallel in a worktree (`bv/c29-summon-harness` — G1 merges); C30 parallel at
the URSDK root checkout on thg-fgreen (precheck-warm, measured; 199 of ~440 hits
in-tree: snappy · theseus · simmy) — **named physics probe:** whiteboardy, arborist,
and this repo sit outside its project root; if `auto` prompts on out-of-tree writes,
the step pauses at its 60-minute timeout, visibly in the Works — that pause is flow-1
evidence (P5's next cell), and the fallback is one rig summons. Trust re-measured
after ⬡'s three whiteboardy launches (charge 20 F6 + its dated correction):
whiteboardy warm ×3 by the engine's own precheck; personal's legacy `~/.claude.json`
is not the file the engine reads — the split-brain is F6's correction. Budget: the
schema carries no budget field yet (D73's law; the field is the Belvedere relay's
first ask) — this flow's bound is its 6 declared steps + scope-covered growth (D12),
concurrency 3. **Pre-⬡ conditions: paid** (2026-08-29 — fork 4 ruled **a**, its scope
grown onto C30's row; C28 landed at his desk). The blessing in the Works is the next
act. *The named interim physics (one `ledger.baton` red, mortal at C32) retired
2026-08-29: `doctrine lint ~/code/agents` reads 0 at C35's baseline; C32's bar stands
in its doc.*

**DEFERRED:** the peer-messaging experiment (SendMessage taps between live sessions —
gate-delivery pokes, cross-account bulletin pokes; pointers-not-payloads,
message-never-summons; the plane is OS-user-scoped and crosses all three accounts,
ephemeral, no audit trail) — Felix 2026-08-08: canonize later; capability map,
probe spec, and the Quartermaster deliberation in `plans/quartermaster.md`. The
bulletin stands untouched.

## 6. Non-goals (defended)

- Syncing sessions/history/agent-memory between accounts (the silo law: memory is a
  per-account cache; durable truth promotes to repos).
- `settings.json` sync — revisit when a real need appears.
- Plugin sync. Multi-machine (clone-and-deploy makes it nearly free later; not designed now).

## 7. Doctrine

This repo runs the work doctrine it canonizes — `canon/work/DOCTRINE.md` — and is
example #1 of it. Local physics:

- Master doc = this file; the board = §5; work docs in `plans/`; the coda =
  `plans/CODA.md`; a bulletin only while a parallel batch runs (`plans/BULLETIN.md`,
  the 18 wave's, stands archival where it lies).
- `doctrine/` is the reference reader for the doctrine itself: `doctrine lint` is the
  drift alarm for the format the way `sync/check` is for the mirrors. Run it before
  claiming a board or a ledger is reconciled.
- `ISSUES.md` is the incident inbox — swept by the Grand Architect at every summons.
- Charge docs 0–04 predate the templates and are grandfathered; new work docs
  instantiate `canon/work/templates/`.

## 8. Done when — canon v1

**Keystone set 2026-08-03** — canon complete, `deploy`/`check` green ×3, all three
accounts serving canon live, this repo conforming to its own doctrine; evidence in
[04's](plans/04-sync.md) Stage B checklist (its one PENDING — Max `/login` — struck
2026-08-08 with evidence).

## 9. Done when — canon v2

**Keystone set 2026-08-06** — both parents' live surfaces speak canon (06 hexwright ·
07 simmy), blessings recorded in each charge's findings; hexwright's one PENDING —
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
