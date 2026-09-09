# C19 — the fixture city

**Status:** **LANDED** 2026-08-30 — nothing escalated; the bar is evidenced below, one deviation named (F1: the static tree is copied out of `~/code` at boot, because a city root inside it breaks every building link) · **Depends on:** C17 · **Staffing:** Builder · opus-high · **Parallel-safe with:** C18 (disjoint trees: `camera/**` vs `v3/gates.ts` + `plans/c18-gates.md`; both on master — the two-lane commit rule binds, explicit paths) · **Blessed:** Felix's word 2026-08-30 ("both!"); his ignition is the arm (D11)

## Mission

A seeded city the camera's twin points at, so probes render **any card state on demand** instead of waiting for reality to produce one: a ⬡-gate card (unwired), a session-holder Dispatch baton, a fork baton, a KILLED row, a lint red, live-and-dead sessions, lit WIP gauges. Deck charges stop verifying against whatever the real city happens to look like today — C15/C16's visual bars and every batch-6 re-cut get deterministic states to shoot.

## Inputs — read before working

- [C17](c17-camera.md) and its landed `camera/` — the twin boot, the probe API; this charge extends both. Read its findings first.
- The knobs, already built — do not re-derive: `glass/paths.ts:17` `GLASS_CITY` (the city root the register walks), `:28` `CENSUS_DIR`, `:63` `USAGE_DIR`, `:37` `BELVEDERE_ENV` (the disarm), `:80` `GLASS_PORT`.
- The bleed-through, named (paths.ts:23): `PRESETS`, `ACCOUNTS`, `INVOCATIONS`, `ISSUES_TEMPLATE` are hardcoded to the real repo — read-only, acceptable; the fixture isolates city + census + usage only. The shelf reads real account dirs and is **not** seedable here (out of scope, below).
- Format law the fixtures must speak: `canon/work/DOCTRINE.md` §4 (board), §7 (ledger + baton), templates in `canon/work/templates/`; `doctrine lint` is the fixture's own acceptance tool.
- Liveness physics: the census marks live sessions by pid; a committed static pid is dead by the time it renders. Time-sensitive organs (usage strip ages, census liveness) need **boot-time generation**, not static bytes.

## Spec

1. **The static tree — `camera/fixtures/city/`**, committed: two conforming buildings and one broken one.
   - `alpha/` — README with a board carrying one row in every state that renders differently (OPEN · OPEN—DEFERRED · IN FLIGHT · LANDED · KILLED · a `⬡-gate`-staffed row), a LEDGER whose tail baton is **⬡-held**, an ISSUES with two entries, `plans/` with one fenced kickoff.
   - `beta/` — a second building whose ledger tail carries a **session-holder baton** and whose plans carry a **fork baton** case; a decision register with one pending blessing.
   - `broken/` — a malformed board (the parser-as-lint state: the building page must render the failure honestly, not a blank).
   - Acceptance: `doctrine lint camera/fixtures/city/alpha` (and `beta`) green; `broken` red **as the control** — outputs committed to findings.
2. **The seeder — `camera/fixtures/seed.ts`**: at twin boot, writes census JSONL and usage files into per-run temp dirs — live rows stamped with the camera's **own pid** (alive for exactly the probe's life) beside dead rows, usage windows stamped with fresh timestamps at chosen fill levels (one near-cap for the gauge state). Deterministic content, generated timing.
3. **The wiring:** the camera gains `--fixture` — boots the twin with `GLASS_CITY` at the static tree, `CENSUS_DIR`/`USAGE_DIR` at the seeded temp dirs (torn down with the twin), disarm as ever. Without the flag, behavior is exactly C17's (the real city, read-only) — proven by running C17's own probes unchanged.
4. **Committed probes** (each ends in a shot): `fixture-rail` (⬡ card unwired beside a session-holder Dispatch — D10 visible in pixels), `fixture-building` (alpha's board/ledger/queue/ISSUES panels), `fixture-broken` (the honest render failure), `fixture-gauges` (the near-cap gauge lit from seeded usage).

## Done when:

- [x] `bun camera/cli.ts run probes/fixture-rail.probe.ts` exits 0; the Builder **Reads the PNG** and describes the ⬡ card and the Dispatch button in one sentence each — pasted with the image path.

  ```
  $ bun camera/cli.ts run probes/fixture-rail.probe.ts
  fixture     /var/folders/00/zjgtvmz17_7bxh707f14psnc0000gp/T/belvedere-fixture-heLkSU
  ⬡ cards    2 gates + 1 baton · 0 fire buttons between them
  dispatch   2 buttons on beta's fork
  .../camera/shots/2026-08-30T20-38-19-335-fixture-rail-dispatch.png
  .../camera/shots/2026-08-30T20-38-19-652-fixture-rail-hex.png
  exit: 0
  ```

  Two frames, because the pair does not fit in one: the rail ranks fireable cards above his, and beta's fork alone is taller than a 900 px viewport (F4).

  Read, `…-fixture-rail-dispatch.png`: **beta's card leads `ignite B2 or ignite B3` under a green BATON + yellow FORK pair, and under it charge B2 — Digger · sonnet-high wears a green RECOMMENDED badge above its four-line summons, an account group (`personal` lit, `thg-fgreen`, `thg-doorbell`), a greyed-out NEW SESSION button and a live COPY SUMMONS, with `digger-beta-01 · sonnet-high · beta` beside them** — the Dispatch button exists, composed down to its stamp, and is cold because the hands are.

  Read, `…-fixture-rail-hex.png`: **alpha's ⬡ card sits under a purple `FELIX'S BATON` pill reading `the ⬡-gate on A6` with an `[expand]` and a note box and nothing else — no account group, no NEW SESSION, no COPY SUMMONS — and below it the two ⬡-GATE · OPEN cards (`the blessing gate`, `his read of the diff`) are the same: pills, text, note box, no control.** D10 photographed: his cards are structurally unwired, not disabled.

- [x] The other three fixture probes exit 0, shots written — pasted.

  ```
  $ bun camera/cli.ts run probes/fixture-building.probe.ts
  fixture     /var/folders/00/zjgtvmz17_7bxh707f14psnc0000gp/T/belvedere-fixture-00WMPi
  alpha      7 rows · baton felix · 2 inbox entries · 0 lint
  .../camera/shots/2026-08-30T20-38-26-586-fixture-building-alpha.png
  beta       queue 1 · BD3 2026-08-30 · Architect — proposed, pending ⬡✓ pending blessing The cheap roa
  .../camera/shots/2026-08-30T20-38-27-398-fixture-building-beta.png
  exit: 0

  $ bun camera/cli.ts run probes/fixture-broken.probe.ts
  fixture     /var/folders/00/zjgtvmz17_7bxh707f14psnc0000gp/T/belvedere-fixture-DEnT0B
  broken     3 lint notes pinned to rows · 3 in the lint panel · 3 rows still drawn
  .../camera/shots/2026-08-30T20-38-34-252-fixture-broken-board.png
  .../camera/shots/2026-08-30T20-38-34-541-fixture-broken-lint.png
  exit: 0

  $ bun camera/cli.ts run probes/fixture-gauges.probe.ts
  fixture     /var/folders/00/zjgtvmz17_7bxh707f14psnc0000gp/T/belvedere-fixture-Ntq1Kj
  usage      personal sess91%-42week64%+16fable38%+12 0m old
  wip        subagents 3+ · background shells 16+ · 5 lines
  .../camera/shots/2026-08-30T20-38-41-522-fixture-gauges-usage.png
  .../camera/shots/2026-08-30T20-38-41-834-fixture-gauges-wip.png
  exit: 0
  ```

  Read, `…-fixture-building-alpha.png`: **one frame carries all seven states — A1 OPEN `laid 2026-08-30`, A2 OPEN with `DEFERRED nobody is waiting on it`, A3 IN FLIGHT, A4 LANDED 2026-08-30, A5 KILLED 2026-08-30, A6 OPEN with a purple ⬡-GATE pill in BOTH the Depends-on and the Staffing cells, A7 BLOCKED `the fork is unbriefed` — over a Ledger tail reading `2026-08-30 · Architect · fable-high (A6)`.**

  Read, `…-fixture-building-beta.png`: **the ledger panel prints the fork whole — `BATON [SESSION] ignite B2 or ignite B3 — the fork is exclusive, never both. Recommendation: B2 …` with its two instruments listed under it (`ignite charge B2`, `ignite charge B3`) — and the Decision queue below holds exactly one item, `BD3 2026-08-30 · Architect — proposed, pending ⬡✓` wearing a yellow PENDING BLESSING pill.**

  Read, `…-fixture-broken-lint.png`: **the three readable rows still draw (X1 UNPARSED with its status printed as prose, X2 `? · ?`, X3 `Builder · ?`), each with an orange-barred lint note under it naming its code and quoting the cell — and at the foot a `LINT — 3` table gives artifact · code · reason · where · verbatim for the three failures no row can hold (`board.columns`, `board.pipe`, `board.truncated`).** The parser-as-lint state renders honestly: nothing blank, nothing silent.

  Read, `…-fixture-gauges-usage.png`: **the quota table carries all three seeded shapes at once — `personal SESS 91% -42` (the pacing delta in red: the window dries early) beside `WEEK 64% +16` and `FABLE 38% +12`, `thg-fgreen SESS 12% +49` in green, and a greyed `thg-doorbell … 60M OLD` whose figures keep full contrast — and under it the WIP panel reads SUBAGENTS `3+` · BACKGROUND SHELLS `16+` · BUILDINGS LIT `2`, with three account bars (personal 2 · thg-fgreen 1 · thg-doorbell 1) and the floor warning naming `2 of 4 live sessions have never been observed carrying one`.**

- [x] `doctrine lint` green on `alpha` + `beta`, red on `broken` — all three outputs pasted (the control proves the linter sees the fixtures at all).

  ```
  $ bun doctrine/cli.ts lint belvedere/camera/fixtures/city/alpha
   ok   agents/…/city/alpha  —  1 board(s) · 7/7 rows typed · ledger 2026-08-30 · baton felix · 1 kickoff(s) · queue 0
    1 buildings · 1/1 board docs yielded a board · 1 boards · 7 rows · 7 fully typed (100%)
    1/1 ledgers parsed a tail (2 entries) · 0 fireable baton(s) · 1 kickoffs in 3 work docs · 0 decisions (queue 0) · 2 inbox entries
    0 failure(s) in 0 class(es)
  exit: 0

  $ bun doctrine/cli.ts lint belvedere/camera/fixtures/city/beta
   ok   agents/…/city/beta  —  1 board(s) · 3/3 rows typed · ledger 2026-08-30 · baton session ×2 · 2 kickoff(s) · queue 1
    1 buildings · 1/1 board docs yielded a board · 1 boards · 3 rows · 3 fully typed (100%)
    1/1 ledgers parsed a tail (2 entries) · 1 fireable baton(s) · 2 kickoffs in 3 work docs · 3 decisions (queue 1) · 0 inbox entries
    0 failure(s) in 0 class(es)
  exit: 0

  $ bun doctrine/cli.ts lint belvedere/camera/fixtures/city/broken
  FAIL  agents/…/city/broken  —  1 board(s) · 0/3 rows typed · ledger none · baton none · 0 kickoff(s) · queue 0
        [1×] board.columns — non-canonical columns refuse 2 row(s) unparsed … | Charge | Staffing | State |
        [1×] board.state — status does not open with a lifecycle state          X1: "nearly done, honest"
        [1×] board.unstaffed — charges are always staffed (D71) …               X2: ""
        [1×] board.tier — unknown tier                                          X3: "opus-turbo"
        [1×] board.pipe — row splits into 6 cells …                             X4: …OPEN
        [1×] board.truncated — a blank line truncates the table at line 13 …    | X5 | … | OPEN |
    6 failure(s) in 6 class(es)
  exit: 1
  ```

  And the control on the control — **the fixture city is invisible to the real register**, so no standing gate inherits a deliberately-red building (`fixtures/` is `SKIP_DIRS` on descent, lintable only when named as an explicit root):

  ```
  $ bun doctrine/cli.ts lint belvedere            # exit 0
   ok   agents/belvedere
   ok   agents/belvedere/v3
  $ grep -c "fixtures/city" <that output>
  0
  ```

- [x] C17's original probes still pass unchanged without `--fixture` (the real city path untouched) — pasted.

  ```
  $ bun camera/cli.ts run probes/city.probe.ts
  /Users/felix/code/agents/belvedere/camera/shots/2026-08-30T20-39-29-239-city.png
  exit: 0
  $ bun camera/cli.ts run probes/building.probe.ts
  /Users/felix/code/agents/belvedere/camera/shots/2026-08-30T20-39-40-430-building-agents.png
  exit: 0
  $ bun camera/cli.ts run probes/chat.probe.ts
  target      architect-belvedere-11
  send        503 · { "ok": false, "error": "hands disabled — no credential at …/belvedere-camera-void/there-is-no-credential-here.env" }
  on the deck hands disabled — no credential at …/belvedere-camera-void/there-is-no-credential-here.env
  exit: 0
  $ bun camera/cli.ts shoot /
  /Users/felix/code/agents/belvedere/camera/shots/2026-08-30T20-39-57-965-rail.png
  exit: 0
  ```

  Not one of the three files changed (`probes/city|building|chat.probe.ts` are byte-identical to C17's), and none declares `fixture`, so all three booted the real-city twin exactly as before — the chat probe still photographed a live session of Felix's own city.

- [x] Teardown: no surviving twin, temp census/usage dirs gone — evidence pasted; `git status` clean of shots and temps.

  Counted after **every** probe above, twins by process and run directories by name:

  ```
  === twins before ===                    0
  === fixture dirs in TMPDIR before ===   0
  fixture-rail      exit 0 · twins after: 0 · fixture dirs after: 0
  fixture-building  exit 0 · twins after: 0 · fixture dirs after: 0
  fixture-broken    exit 0 · twins after: 0 · fixture dirs after: 0
  fixture-gauges    exit 0 · twins after: 0 · fixture dirs after: 0
  city / building / chat (real city)      · twins after: 0 · fixture dirs after: 0

  $ pgrep -f "bun server.ts" | wc -l                    0
  $ ls -d $TMPDIR/belvedere-fixture-* | wc -l           0
  $ git status --short
   M belvedere/plans/c18-gates.md          (C18's lane — not this charge's, untouched)
  ?? .summon-theaters                      (predates this session)
  $ ls belvedere/camera/shots | wc -l                  36
  ```

  Thirty-six PNGs stand in `camera/shots/` and not one appears in `git status` (`camera/.gitignore` doing its job).

- [x] `bunx tsc --noEmit` in `camera/` exit 0; `glass/` untouched (`git diff --stat` on `glass/` empty).

  ```
  $ cd belvedere/camera && bunx tsc --noEmit
  tsc exit: 0

  $ git diff --stat HEAD -- belvedere/glass
  (no output)
  $ git status --porcelain belvedere/glass | wc -l
  0
  ```

  **C18 F1 lands mid-charge and this gate survives it**, because `camera/` carries its own pinned checker where `v3/**` carries none — re-proven three ways after reading the relay:

  ```
  $ ls -l node_modules/.bin/tsc              ->  ../typescript/bin/tsc
  $ ./node_modules/.bin/tsc --version            Version 7.0.2   (package.json: "typescript": "7.0.2")
  $ bunx tsc --version                           Version 7.0.2   (no resolution lines — nothing was fetched)
  $ bunx --offline tsc --noEmit                  exit: 0
  $ ./node_modules/.bin/tsc --noEmit             exit: 0
  $ git status --untracked-files=all --porcelain belvedere/camera | wc -l
  0
  ```

  So the pasted `bunx tsc` above IS the repo-pinned one (C17 F3's pinning doing its job), and the coda's offline requirement is met by construction here.

  The glass is byte-identical to HEAD: the fixture turns four knobs `paths.ts` already carried (`GLASS_CITY`, `CENSUS_DIR`, `USAGE_DIR`, `DESK_DIR`) and adds nothing to the deck.

- [x] Zero real `claude` invocations — budget 0.

  Every twin proved its own disarm (one `POST /hands/fire` ⇒ 503) before a browser opened, or it would have refused and exited non-zero; all eight runs exited 0. The live audit is the positive control — **zero `fire` actions today**:

  ```
  $ grep -c '"ts":"2026-08-30T20' ~/code/agents/summon/log/census/hands.jsonl
  2
  $ grep -o '"ts":"…","action":"[a-z]*"' … | tail -2
  "ts":"2026-08-30T20:34:42.456Z","action":"inbox"
  "ts":"2026-08-30T20:34:42.457Z","action":"inbox"
  ```

  Two `inbox` lines, one millisecond apart, on a `$TMPDIR/b19-desk-…/city/scratch-building` — that is G2's already-ruled B19 test path (a `bun test` run appending to the LIVE audit), fired by the other lane's gates run, not by anything here (F6).

## Out of scope

- Chat-transcript fixtures and shelf/account seeding — the Chat and shelf read real account dirs; the seeding knob is C16's own design question (its doc decides; this charge must not invent account-dir shims).
- v3 run-dir fixtures for the Works — C15's charge brings the states it needs.
- Any `glass/**` change; pixel goldens; probes against the live deck.

## Findings

**F1 — a fixture city inside `~/code` breaks every building link, so the static tree is copied OUT of the city at boot.** This is the charge's one deviation from its own §3 ("`GLASS_CITY` at the static tree"), and it was measured before it was taken. A building's name is `slug(path)`, which is *relative to `~/code`* for anything under it (`doctrine/src/building.ts` §slug) — while `buildingPage` resolves the slug it is handed against the **city** root (`glass/pages.ts:236`). The two agree only when the city root IS `~/code`, or when the slug is absolute. Against the pre-existing `lab/b3/city` fixture, which lives inside `~/code`:

```
$ GLASS_CITY=~/code/agents/belvedere/lab/b3/city bun glass/server.ts &
$ curl -s http://127.0.0.1:47399/ | grep -o 'href="/b/[^"]*"'
href="/b/agents/belvedere/lab/b3/city/probe-fork"
href="/b/agents/belvedere/lab/b3/city/probe-row"
$ curl -s -o /dev/null -w '%{http_code}\n' ".../b/agents/belvedere/lab/b3/city/probe-row"
500
```

Every building link on the rail and the City View is a 500. B10 F5 named the class from the flow side ("a fixture city inside `~/code` is slugged relatively and one outside absolutely"); this is its second face, and it is fatal to a fixture whose whole job is rendering building pages. So `seed.ts` copies `fixtures/city/` into the run directory under `$TMPDIR` — outside `~/code`, where slugs come back absolute and `/b/<abs>` resolves. **The consequence, accepted and visible in every shot: a fixture building is NAMED by its absolute temp path**, so the cards read `/var/folders/…/belvedere-fixture-XXXX/city/alpha`. Ugly, honest, and unambiguous — nobody will mistake a fixture shot for the real city. A charge that wants pretty fixture names is asking canon for a name field on the register, not a parser branch. **This binds C15 and C16: point a probe at a fixture city under `~/code` and the building pages die, silently as far as the rail is concerned.**

**F2 — the copy also closes C17 F2 for fixture runs: under `--fixture`, every write a disarmed twin can still make is contained.** C17 named the trap — the fence's two non-credentialed writes (the desk, and `POST /inbox`) are live on every twin by design, and the inbox had no knob, so a probe clicking "file it" appends to a real building's `ISSUES.md`. With the city itself a copy inside the run directory, that append lands in the copy. `paths.ts` puts the rest there with it: `auditLog()` and `haltFlag()` hang off `CENSUS_DIR`, so even a HALT the twin somehow armed would be written to `<run>/HALT` and removed with the run. **The real-city twin is unchanged and the trap still stands there** — this is a property of `--fixture`, not a fix to the glass.

**F3 — the deck has no render for D71's dissolved staffing, and the fixture caught it on its first shot.** A DEFERRED charge whose shelving dissolved its staffing writes `—`; the parser types that (`dissolved: true`) and files **no** failure, and `lint.ts` counts the row as fully typed. The building page does not know the field: `boardRow` reads `r.mantle ? … : '<span class="bad">?</span>'` (`glass/pages.ts:278`), so alpha's A2 renders **`? · ?` in the failure colour** beside a `0 lint` panel — the page says the parser could not read the row, and the parser says it read it perfectly. Visible in `…-fixture-building-alpha.png`, row A2. The live city writes this shape too (canon's own `C27 | the iron rebuild | C24 | — | OPEN — DEFERRED …`). **A `glass/` change is outside this charge's fence, so it is filed, not fixed** — one ternary in `boardRow`, C15's or a QoL sweep's. Relayed.

**F4 — the probe API gained two verbs, and both are the fixture's own asks.** `count(sel)` because **the structural laws are counts**: "a ⬡ card carries zero fire wiring" is `count('article[data-holder="felix"] button[data-fire]') === 0`, and the DOM knows which card an attribute sits inside where a grep over served HTML does not (B17 F1's lesson, one door along). `scroll(sel)` because **a shot is viewport-sized and the rail is not**: the rail ranks fireable cards above Felix's, so beta's fork — two summons fences — pushes every ⬡ card past 900 px, and the charge's own bar asks for both in pixels. The first run of `fixture-rail` proved it: one shot, no ⬡ card in frame. No playwright `Page` escapes `probe.ts` and no probe-only route was added to the glass (C17 F5 held).

**F5 — a probe declares the world it needs; the flag only forces it.** The charge's bar reads `bun camera/cli.ts run probes/fixture-rail.probe.ts` with no flag, and spec §3 asks for `--fixture`. Both are true: a probe module may `export const fixture = true`, which is what the four committed ones do, and `--fixture` on the command line still overrides. The reason is not convenience — **the world is part of what a probe asserts**: `fixture-rail` asserting "2 Dispatch buttons" against the real city is a lie, and a probe that carries its own world cannot be run against the wrong one by accident. The flag works on the other verb too, and the contradiction is answered **before anything is dialled** — its first cut checked the foreign port first and died with a true sentence about the wrong thing (`no deck answering on 127.0.0.1:4400`, exit 1), which is exactly the shape C17's `run --port` refusal exists to avoid:

```
$ bun camera/cli.ts shoot /shelf --fixture
fixture     /var/folders/…/belvedere-fixture-hiK7yt
/Users/felix/code/agents/belvedere/camera/shots/2026-08-30T20-45-16-399-shelf.png
exit: 0

$ bun camera/cli.ts shoot / --fixture --port 4400
--fixture boots a twin against a seeded city; --port shoots a deck that is already running. Pick one.
exit: 2
```

**F6 — the live hands audit gained two lines during this session and neither is this charge's.** `2026-08-30T20:34:42.456Z` and `.457Z`, both `action:"inbox"`, both on a `$TMPDIR/b19-desk-…/city/scratch-building` — G2's already-ruled find (a `bun test` run appends two scratch-building inbox lines to the LIVE audit, B19's test path), fired by the other lane's gates run while this one was shooting. It is worth writing down twice over: **zero `fire` actions in the whole day's audit is the positive control for this charge's budget-0 bar**, and a Builder reading a shared audit during a two-lane batch must attribute before it accuses. C18's own findings own the defect.

**F7 — the fixture is invisible to the real register, by the doctrine's own rule and not by luck.** `fixtures/` is in `SKIP_DIRS` and the skip is on descent only, so `bun doctrine/cli.ts lint belvedere` finds `agents/belvedere` and `agents/belvedere/v3` and nothing else (`grep -c "fixtures/city"` → 0, exit 0), while naming the path explicitly lints it. That is what lets `broken/` be deliberately red without turning a standing gate red — **but it is a rule, not a guarantee: a fixture city put anywhere the walk descends into would poison every gate in the city.** Keep fixtures under a `fixtures/`, `lab/` or `templates/` directory, always.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence, the
arming law, agreements; the migration campaign note) and
~/code/agents/belvedere/plans/c17-camera.md (findings included),
and execute the charge at ~/code/agents/belvedere/plans/c19-fixture-city.md.
```
