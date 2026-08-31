# agents — The Canon Repo

The operating system for how Felix works with Claude across three accounts and every
repo — **the Guild**: mantles, capability tiers, work doctrine, global CLAUDE.md —
canonized here, mirrored into `~/.claude*` config dirs.

**Read `MAP.md` and `BOARD.md` before any work** — the master architecture and the
campaign board (D78: design and work state live apart). `DECISIONS.md` is the decision register — the queue, plus rulings not
yet distilled into their homes; the tail of `LEDGER.md` tells you where we are; field
reports land in `ISSUES.md` — file and move on.

Subproject: `belvedere/` — the Sovereign's deck; its own board and docs live with it
(`belvedere/README.md`).

## Session protocol

- Declare your office or mantle: Grand Architect · Mentat (offices) · Architect ·
  Builder · Digger · Fixer (mantles). The Guild speaks the standard —
  `canon/work/STANDARD.md`.
- Work doctrine: `canon/work/DOCTRINE.md` — boards, charge docs, findings, ledger law;
  this repo conforms (MAP §7).
- Foundational design sessions run Fable at max effort; charge docs name everything else.
- Deployment: `./sync/deploy` symlinks the sync set into all three config dirs,
  `./sync/check` is the drift alarm — `deploy` is **Felix-run** (an agent tripping the
  permission guard on a live config file is the design). The whole sync set —
  `canon/CLAUDE.md`, `canon/agents/` — is **live ×3 since 2026-08-03**: edits reach
  the accounts instantly (only sessions started afterward see them), so editing those
  paths IS deploying — unsigned canon never touches them.
- Canon changes require Felix's blessing; only a new issue mints a D-entry
  (the ancestry test, DOCTRINE §8).
- End every session: append `LEDGER.md` (date · mantle · changed · decided · next),
  commit in Felix's git style. Suggest a break at every clean boundary and hand the next
  session its summons verbatim.
- Repo convention: branch `master`, never main.

We are a hive building a city — the shop that builds the shops. Every session here
compounds across every project and every account — match that energy. ⚡
