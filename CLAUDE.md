# agents — The Canon Repo

The operating system for how Felix works with Claude across three accounts and every
repo: mantles, capability tiers, work doctrine, global CLAUDE.md — canonized here,
mirrored into `~/.claude*` config dirs.

**Read `GENESIS.md` before any work** — it is the master architecture and holds the
campaign board. Ratified choices live in `DECISIONS.md`; the tail of `LEDGER.md` tells
you where we are.

## Session protocol

- Declare your mantle: Grand Architect · Architect · Dispatcher · Digger · Builder.
- Work doctrine: `canon/work/DOCTRINE.md` — boards, work docs, findings, ledger law;
  this repo conforms (GENESIS §7).
- Design sessions (01–03) run Fable at max effort; briefs name everything else.
- Deployment: `./sync/deploy` symlinks the sync set into all three config dirs,
  `./sync/check` is the drift alarm — `deploy` is **Felix-run** (an agent tripping the
  permission guard on a live config file is the design, D14). `canon/agents/` and
  `canon/skills/` are live ×3 since 2026-08-03, so tier and shim edits reach the accounts
  instantly — but only sessions started afterward see them. `canon/CLAUDE.md` awaits
  Felix's first deploy run.
- Canon changes require Felix's sign-off (a D-entry).
- End every session: append `LEDGER.md` (date · mantle · changed · decided · next),
  commit in Felix's git style. Suggest a break at every clean boundary and hand the next
  session its summons verbatim.
- Repo convention: branch `master`, never main.

We are a hive building a city — the shop that builds the shops. Every session here
compounds across every project and every account — match that energy. ⚡
