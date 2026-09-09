# B13 — the deck shell

**Status:** **LANDED** 2026-08-27 · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** the deck keel, ✓ Felix 2026-08-27 ([deck-keel.md](deck-keel.md)); this order applies §§2–3, 9–10.

## Goal

The app exists: `/deck` — three panes always (Context · Focus · Action), each with minimal/typical/expanded states under the law of space, the pinnable drawer, the tooltip primitive, the `FocusView` seam, and the data plumbing that keeps it live. Empty-ish tenants are fine — B14+ move in. v0 pages keep serving untouched.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) — §2 the law of space (the whole law), §3 the panes and interactions, §9 stack + spelling, §10 what survives.
- `glass/glass.css`, `glass/html.ts`, `glass/assets/` — felikai, fonts, the loved card idioms: carried, not rebuilt.
- The striking-law note: client state is legal for the deck (D13); the v0 pages' no-client-state law still binds *them*.

## Spec

1. **Route + bundle.** `GET /deck` serves the app shell; client code is TypeScript bundled by `Bun.build` at server start (one bundle, no framework, no fetch beyond the glass's own origin — the D54 fence stands: zero new dependencies).
2. **Three panes.** CSS grid, proportional splits that reapportion as states change; states per pane: `minimal` (~1-word + data viz, or absent) · `typical` · `expanded`. Click-to-expand per keel §3 (clicking anywhere in a minimal pane expands it); the page body NEVER scrolls — panes own their overflow (§2 law verbatim).
3. **The `FocusView` seam.** A small interface — mount/unmount, render into the Focus slot, declare state affordances, contribute Action content — registered by name. B13 ships a placeholder tenant per slot; Workshop / Works / Chat register through this seam in their rows. Panes are a replaceable surface (D13) — the seam is that sentence as code.
4. **The drawer.** Overlays everything, pinnable (pinned = reserves space, splits reapportion); content is a slot — B14 installs the needs-you queue; until then it renders its own emptiness honestly.
5. **Tooltips.** One primitive: instant on hover, expandable (hover-hold or click) into more info + actions. Used by every later row; built once here.
6. **State plumbing.** One `GET /deck/state` JSON endpoint — the server composes census + register + liveness (+ later: usage, cmux identity) into one snapshot; the client polls (2–5 s) and re-renders diffs. No websockets, no SSE until polling demonstrably fights (simplicity law).
7. **Laws in force from birth:** spelling — **color, center, grey** — for all new strings; IosevkaFelix numbers/titles/buttons, Inter prose; legends where color carries meaning; encapsulation-first labels; localStorage legal for per-viewer conveniences (pane states), wrapped in try/catch, never load-bearing.

## Acceptance criteria — the DoD

**Where the evidence comes from.** Four of these are browser facts — a grid track's measured width, a click reaching a delegated handler, a drawer that overlays, a poll arriving — so they are measured in the machine's own installed Chrome, driven over the DevTools protocol by [`lab/b13/probe.ts`](../lab/b13/probe.ts): real layout, real events, real requests, **zero dependencies fetched, installed or vendored** (D54 — the browser is a local tool like `git` or `ps`, and every URL it touches is 127.0.0.1). The probe stands up its **own** glass on port 4489 against a temp census and the `lab/b3/city` fixture, because the live census is append-only telemetry and a DoD run does not get to write a beat into it (B8 F1). Everything else is measured against the real glass on the real city.

- [x] **`/deck` serves; the bundle is built at server start from repo TS; zero external requests; zero new deps.** Live, against `~/code`:

  ```
  /deck        200  3840B      /deck.js     200  11837B     /deck.css    200  5907B
  /deck/state  200  15000B
  ```

  `grep -c -E 'https?://'` over **every** served payload — `/`, `/city`, `/shelf`, `/summon`, `/b/agents`, `/deck`, `/deck.js`, `/deck.css`, `/glass.css`, `/felikai.css` — is **0** on all ten. Confirmed browser-side too: of every resource the deck loaded, **0 were off-origin** (probe §7, `performance.getEntriesByType('resource')`). `package.json` and `bun.lock` are **byte-unchanged since B8** (`git log -1` on both → `60d989a`, working tree clean on both).

- [x] **Three panes render; each walks minimal → typical → expanded and the grid reapportions; the body never scrolls.** Measured in Chrome at 1600×900, two state combinations, `getBoundingClientRect().width`:

  ```
  resting   context expanded · focus minimal · action minimal   6fr 1fr 1fr
            1198.50 / 199.75 / 199.75 px of 1600  =  74.91% · 12.48% · 12.48%
  flipped   context minimal · focus expanded · action typical   1fr 6fr 3fr
             159.80 / 958.80 / 479.41 px of 1600  =   9.99% · 59.92% · 29.96%
  ```

  And **all 27 combinations walked**, clicking the panes' own state buttons: worst `scrollHeight − viewport` = **0 px** on both `document.body` and `document.documentElement`, viewport 900 px.

- [x] **Click-to-expand — driven via the bundled code's own handlers** (naming which, per the criterion). A real `.click()` on `#host-focus` — the pane *body*, not a control — while the pane sat at `minimal`: `minimal → typical`, through the delegated listener in the served bundle. The click is swallowed rather than passed on: at minimal a pane is one word and a mark, so the whole pane is the expand target and nothing inside it can be aimed at.

- [x] **Drawer opens over everything, pins, and reserves space when pinned.**

  ```
  open     position:fixed  z-index:30  scrim:true  overlapping the context pane:true
           grid still 3 tracks — no track taken, the panes do not move
  pinned   position:static   6fr 1fr 1fr → 6fr 1fr 1fr 3fr
           context 1198.50 → 871.08 px · drawer 435.55 px
           54.44% · 9.07% · 9.07% · 27.22%
  ```

- [x] **Tooltip primitive: instant, expandable, dismissable.** On a Context-pane building row (the deck's own use of the primitive), read in the **same turn** as the `mouseover`: `hidden=false`, no delay waited out. After a 450 ms hold: `expanded=yes`, the long text plus its one action (`/b/agents%2Fbelvedere%2Flab%2Fb3%2Fcity%2Fprobe-fork`). `Escape` → `#tip.hidden = true`.

- [x] **`GET /deck/state` returns the composed snapshot; the client polls it; a census change appears within one poll interval.** Network evidence from the browser's own resource timeline — **4 real requests**, `#pulse` counting 4 answered:

  ```
  749ms 1196B · 3751ms 1196B · 6749ms 1196B · 9750ms 1418B
  ```

  One beat appended to the fixture census: `live 2 → 3`, **seen in 2097 ms** against a 3000 ms poll interval. Live cost against the real city, 20 requests 1 s apart: `/deck` **p95 2 ms**, `/deck/state` **p95 19 ms** (max 20 ms). **B8 F3's worker law is intact** — a `/rewalk` costing **9.264 s** of its own request had three `/deck/state` polls land inside its window in **17 ms · 8 ms · 18 ms**: the poll reads the register's held copy and never the walk.

- [x] **v0 routes all still 200.** `/` · `/city` · `/shelf` · `/summon` · `/b/agents` → **200** each, live. Each gained one nav link (`deck`) and nothing else.

- [x] **`bun test belvedere/glass` green in one process; `bunx --offline tsc --noEmit` exit 0.**

  ```
  320 pass · 0 fail · 773 expect() calls · 11 files · 559ms      (302 → 320: +18 for the deck)
  tsc --noEmit exit 0
  ```

## Out of scope

- Any real tenant content (City, Workshop, Works, Chat, composer — B14+).
- SSE/websockets; frameworks; the prettifying pass (⬡ parked).
- Touching v0 pages beyond adding the `/deck` link to their nav.

## Findings

**Nothing escalated.** Six findings, four of which bind the rows behind this one.

**F1 — a fake DOM cannot prove the law of space, and the probe that can is reusable: `lab/b13/probe.ts`.** The DoD asks for measured widths, and neither happy-dom nor jsdom does CSS grid layout — in both, `getBoundingClientRect()` returns zeros, so a "measured width" from one is a fabricated number and a `min-width: 0` bug (see F4) passes silently. The probe drives the machine's own installed Chrome over the DevTools protocol from ~60 lines of Bun: launch with `--remote-debugging-port`, read `/json/list`, open the page target's WebSocket, `Runtime.evaluate` with `returnByValue`. **No dependency is fetched, installed or vendored** — the same posture as `ps` in `gauges.ts`. **For B14–B19: this is the only honest way to evidence a deck DoD item, and it is already written** — point `CITY`/`CENSUS` at your fixture, add `ok(...)` lines. It also caught both of its own first-run failures, which is the argument for it.

**F2 — the split is a 69 ms CSS transition, so every measurement of it must settle first.** `.app` transitions `grid-template-columns` on felikai's `--snap`. The probe's first run clicked three state buttons and measured on the next DevTools round trip — about five milliseconds in — and read `74.14% · 12.87% · 12.87%` for a deck **moving to** `10/60/30`. It reported FAIL, correctly, for the wrong reason. **Anyone measuring deck geometry waits out `--snap` first** (`settle()` in the probe); anyone who does not will get a number that is real, reproducible, and meaningless.

**F3 — the client TypeScript rides the existing offline gate with zero config change.** `@types/bun` already pulls in the DOM lib, so `deck.client.ts`, `deck-view.ts` and their `document`/`HTMLElement`/`localStorage` typecheck under the **same** `tsconfig.json` and the **same** `bunx --offline tsc --noEmit` (B8 F4) — no second config, no `lib` edit, no `references`. It earned its keep immediately: it caught `tip.append(el(…)).append(a)`, where `Node.append` returns `void`, before the code ever ran in a browser. **For B14+: there is one type gate and it covers the client too.**

**F4 — the weights are this row's call, and `min-width: 0` is what makes them true.** The law of space fixes proportionality, not the constants; B13 chose **minimal 1 · typical 3 · expanded 6**, geometric rather than linear because 1:2:3 hands a *closed* pane a third of a two-pane deck. Consequences B14+ inherit, at 1600 px: a minimal pane is **200 px** at rest and **160 px** at its narrowest (context minimal beside an expanded focus), an expanded pane is **960 px**, a pinned drawer is **436 px**. The load-bearing CSS line is `min-width: 0` on every grid child: an `Nfr` track is really `minmax(auto, Nfr)`, so **without it a pane's own content minimum silently outvotes the law** and the split stops being the split. It is in `deck.css` with that note on it; a tenant that removes it breaks the deck's only geometric guarantee.

**F5 — the snapshot is a budget, and B14+ spend it.** `/deck/state` is **15 000 bytes** against the live city right now — 46 census sessions and 22 buildings — fetched **every 3 s** per open deck. It is free today (p95 19 ms server-side, ~1.2 KB on the wire compressed) and it will not stay free: B15's Workshop, B17's usage ×3 and B18's socket identity all widen the same shape by design (one endpoint, not five). Two rules already hold and should keep holding: **nothing in the composition walks the city on the request thread** (`register()` returns the held copy — B8 F3, re-proven above), and **the diff is the whole snapshot** — identical bytes redraw nothing, so an idle city costs one `JSON.parse` and no DOM work at all.

**F6 — a failed client bundle stops the server, deliberately.** `Bun.build` runs at boot and an unsuccessful build throws before `Bun.serve`. The alternative — serve `/deck` around a bundle that is not there — is the shell of an app with no app in it, which is this server's own definition of a lie. It can only fire on repo TypeScript that does not bundle, i.e. at development time, never in Felix's morning; and the failure it prevents is silent. The complementary honesty is in the shell: a `<noscript>` that says the deck is an app and names the v0 rooms, which serve on regardless (keel §10).

**Named, not escalated — two implementation choices inside the fence.** (1) **One 28 px bar above the three panes** carries the wordmark, the links back to the v0 rooms, the poll indicator and the drawer toggle. The keel says three panes always; it does not forbid chrome, and the drawer needed a handle. It retires with the rooms. (2) **A click in a minimal pane is swallowed** — it expands the pane and does not act on whatever was under the pointer — because at minimal nothing inside is legible enough to have been aimed at.

**Parked (adjacent, not fixed here):** the `page()` shell now appends the `deck` link to *every* nav including the 404 and error pages. That is correct today and becomes wrong the day the rooms retire; it is one line in `html.ts`.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b13-deck-shell.md,
and build it to its DoD.
```
