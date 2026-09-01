# C39 — the register arm

**Status:** OPEN — laid 2026-08-31 · **Depends on:** — · **Staffing:** Builder · opus-high
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

- `bun test` green with the new fixtures (a fixture register + the manny-shaped
  worktree), count recorded under Findings.
- The register surface, run against the live file, lists the 10 entries with kinds
  correct.
- Lint on a fixture register with a dead Root fails naming the row; live
  `lint ~/code/agents` stays 0.

## Findings

*(append here)*

---

Kickoff (verbatim):

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/plans/c39-register-arm.md and build it.
```
