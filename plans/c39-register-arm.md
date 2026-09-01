# C39 — the register arm

**Status:** **LANDED** 2026-08-31 — the arm built, suite 87 → 94; one `Done when:` bullet
unmet and named (the live lint's single pre-existing `ledger.baton`, F6) · **Depends on:** — · **Staffing:** Builder · opus-high
· **Parallel-safe with:** C38 (different trees — `doctrine/` here, `summon/` there; both only read `canon/BUILDINGS.md`)

## Mission

The doctrine parser reads the building register (D79): registered roots become
discovery's universe, qualified ids resolve against Names, and a JSON surface
serves stigmergon — their D15 waits on exactly this.

## Inputs — read before working

- [canon/BUILDINGS.md](../canon/BUILDINGS.md) + D79 in
  [DECISIONS.md](../DECISIONS.md) — the ruling; do not re-derive.
- `doctrine/src/building.ts` — the anchor law, `discover()`, the worktree dedup;
  `doctrine/cli.ts`; the suite (87 green at C36).
- `~/code/stigmergon/DECISIONS.md` D15/D16 — the consumer's pre-rulings: never
  descend worktrees uninvited; existence-checked rows render dim, never auto-drop.

## Spec (blessed with D79)

- **Parse:** the register's table — Name · Kind (`building` | `host`) · Root
  (`~`-expanded). A malformed row is a lint failure naming the line; duplicate
  Names are failures (qualified ids demand uniqueness).
- **Discovery:** a register-rooted mode — every `building` row's Root walked by the
  anchor law; `host` rows listed, never walked; a Root inside `.claude/worktrees/`
  entered directly — the existing dedup already keeps branch-only artifacts: prove
  it with a manny-shaped fixture (a checkout whose mainline twins dedupe away
  while its branch-only building surfaces).
- **Existence:** a row whose Root is missing on disk is a lint failure naming the
  row; a `building` row whose walk finds zero artifacts is a warning — a founding
  not yet run.
- **Qualified ids:** `<building>:<id>` resolution binds to register Names;
  reconcile C36's `bv/*` register skip.
- **The surface:** `doctrine register --json` — or the builder's better spelling
  within the CLI's idiom — the rows plus each building's parse, the shape
  stigmergon imports. One parser in the city (stigmergon D10).

## Out of scope

Stigmergon-side consumption · the rig (C38) · walking unregistered land · any
auto-registration.

## Done when:

- [x] `bun test` green with the new fixtures (a fixture register + the manny-shaped
      worktree), count recorded under Findings.

```
$ cd doctrine && bun test
 94 pass
 0 fail
 378 expect() calls
Ran 94 tests across 2 files. [57.00ms]
```

  **87 → 94.** Seven tests over three fixture families under `doctrine/fixtures/register/`:
  `good/` (a clean register + a building whose board carries all three Depends-on forms),
  `defects/` (one row per defect class), `worktree/` (the manny shape).

- [x] The register surface, run against the live file, lists the 10 entries with kinds
      correct.

```
$ doctrine buildings
the building register — ~/code/agents/canon/BUILDINGS.md (D79)

  agents            building  ~/code/agents                                 3 building(s) · 113 row(s)
  stigmergon        building  ~/code/stigmergon                             1 building(s) · 18 row(s)
  hexwright         building  ~/code/hexwright                              1 building(s) · 4 row(s)
  whiteboardy       building  ~/code/whiteboardy                            1 building(s) · 68 row(s)
  simmy             building  ~/code/universal_robots_sdk/cap-mega/simmy    1 building(s) · 35 row(s)
  snappy            building  ~/code/universal_robots_sdk/cap-mega/snappy   2 building(s) · 42 row(s)
  spacex-dashboard  building  ~/code/universal_robots_sdk/cap-mega/felix/spacex-dashboard  1 building(s) · 4 row(s)
  manny             building  ~/code/universal_robots_sdk/cap-mega/.claude/worktrees/user-manual  1 building(s) · 30 row(s)
  cap-mega          host      ~/code/universal_robots_sdk/cap-mega          listed, never walked
  bob               host      ~/code/universal_robots_sdk/bob               listed, never walked
```

  Ten rows, eight buildings walked, two hosts listed — and manny's declared worktree root
  yields exactly the branch-only building (30 rows), its mainline twins deduped away.

- [~] Lint on a fixture register with a dead Root fails naming the row (**met**); live
      `lint ~/code/agents` stays 0 (**unmet on arrival — F6**).

```
$ doctrine lint fixtures/register/defects ; echo "exit=$?"
FAIL  agents/doctrine/fixtures/register/defects  —  0 board(s) · 0/0 rows typed · …
      [1×] register.name — duplicate Name — `<building>:<id>` demands one root per Name
           …/register/defects/canon/BUILDINGS.md:8: | here | building | `.` |
      [1×] register.kind — Kind is "building" (walked for books) or "host" (listed, never walked)
           …/register/defects/canon/BUILDINGS.md:10: | campus | tenant | `../campus` |
      [1×] register.row — a row is Name | Kind | Root — this one splits into 2 cell(s)
           …/register/defects/canon/BUILDINGS.md:11: | lonely | host |
      [1×] register.root — the Root is no directory on disk — the row is an address, and this one is dead
           …/register/defects/canon/BUILDINGS.md:9: ghost: …/register/defects/ghost
  4 failure(s) in 4 class(es)
exit=1

$ doctrine lint ~/code/agents
FAIL  agents  —  3 board(s) · 50/50 rows typed · ledger 2026-08-31 · baton prose · …
      [1×] ledger.baton — the Next clause carries no instrument and names no Felix-action
           ~/code/agents/LEDGER.md:2614: the tender verifies both landings, reconciles the board, closes the batch.
  1 failure(s) in 1 class(es)

$ doctrine lint --guard HEAD ~/code/agents
guard ok — no entity total decreased vs HEAD
```

## Findings

- **F1 — the surface is spelled `doctrine buildings [--json]`** (the charge's grant: "the
  builder's better spelling within the CLI's idiom"). `doctrine register` reads as an
  imperative that mutates — "register this" — and there is no auto-registration to invoke;
  the plural noun names the book it prints (`canon/BUILDINGS.md`) and can mean nothing else.
  `--json` emits `{ entries, fails }`: every row (Name · Kind · Root · exists) plus each
  building row's full `Building` parse. That is the shape stigmergon imports (their D15).
- **F2 — two additive fields on P3 §5's shapes** (D65 normative, so named here):
  `Building.files.register: string | null` — the `BUILDINGS.md` a walked building keeps, or
  null — and `BoardRow.crossings: string[]` — the qualified ids, parallel to `gates`, never
  mixed into `dependsOn` (a crossing is not a node in the local graph). Nothing existing
  changed meaning. Consequence for a reader outside this repo: belvedere's retired glass
  builds `files` literals by hand (`glass/register.ts`, four test files) and would need the
  new key if it were ever type-checked again; it is retired and runs nothing, so it is left
  as the record.
- **F3 — a Root written relative resolves against the register file's own directory.** Live
  rows are all `~`-rooted and unaffected; the rule exists so a fixture register can address
  its siblings and the suite still reads nothing outside this repo (the suite's own item 14).
  A typo'd relative Root does not go quiet — it resolves, misses, and fails as a dead Root.
- **F4 — the crossing is parsed for form and resolved at lint**, which is DOCTRINE §4's own
  word. `parse.ts` stays text-in/values-out (it never touches the disk): it recognizes
  `<building>:<id>` and records it. `lint()` reads the ONE building register — `REGISTER`,
  resolved beside the module, because the parser ships in the building that keeps the book —
  and fails `board.crossing` where the building half names no registered `building` row. A
  host can hold no charge, so host Names never resolve. The far id is never checked against
  the far board: that would make linting one building walk the city.
- **F5 — the manny shape holds; the dedup underneath it has a hole.** Proved as asked
  (`fixtures/register/worktree/`): walking the declared checkout root keeps the branch-only
  building and drops the tenant's mainline twin (`lastWalk.suppressed` 1). But the shape only
  works because the mainline repo is a **host with no root books**. Where the mainline repo
  is itself a building, `worktreePath()`'s split search falls through to a one-segment
  remainder — whose dirname is `.`, which always exists — and a branch-only
  `<checkout>/<newdir>/LEDGER.md` is skipped as a twin of `<repo>/LEDGER.md`: the building
  vanishes. Repro and fix sketch filed (`ISSUES.md`, 2026-08-31); latent today (cap-mega
  keeps no root LEDGER, agents' one checkout carries no books). Beyond this fence — it is
  C36 item 5's arm — so filed, not chased.
- **F6 — `lint ~/code/agents` was already at 1 failure when this charge opened**, so "stays
  0" could not be met and was never this arm's to meet: `LEDGER.md:2614` is the batch's own
  dispatch entry, whose Next clause hands the tender a verification rather than an
  instrument (`ledger.baton`). The register arm adds **zero** failures live — the ten rows
  all resolve, and the board's qualified ids are none yet. The entry closes when the tender
  writes the batch's landing entry; untouched here (a ledger is not a Builder's surface).
- **F7 — where each existence check lives.** A dead Root is a `statSync`, so it lints
  wherever the register file is walked (`doctrine lint ~/code/agents` reads
  `canon/BUILDINGS.md` as an artifact of the agents building — a new artifact kind,
  classified by filename like `LEDGER.md`, and never an anchor: `canon/` is not a building).
  "A registered building whose walk finds zero artifacts" needs the walk, so it is a
  **warning** on the walking surface (`doctrine buildings`) — putting it in `lint` would make
  linting one building walk every registered root in the city.

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/c39-register-arm.md and build it.
```
