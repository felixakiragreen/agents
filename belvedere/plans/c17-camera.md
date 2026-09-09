# C17 — the camera

**Status:** **LANDED** 2026-08-30 — nothing escalated; the bar is evidenced below, one annotation on the `bun test` line (three reds that predate this charge, C15's by name). · **Depends on:** — · **Staffing:** Builder · opus-high · **Parallel-safe with:** C14 (disjoint trees: `camera/**` vs `v3/**`; both on master — the two-lane commit rule binds, explicit paths) · **Blessed:** Felix's own ask, verbatim in the batch-1 amendment (README §6), 2026-08-30; his ignition is the arm (D11)

## Mission

Agents' eyes and hands on the deck. When this lands, any session working a deck charge can boot a **disarmed** twin of the glass, drive it browser-grade (navigate, click, type, wait), and write PNG screenshots it then Reads with its own eyes — so a Chat rendering defect is something the Builder *sees and fixes*, not something Felix describes over three round-trips. The camera is an instrument, not an oracle: assertions stay in `glass/` tests; screenshots are evidence for findings and the agent's own judgment. **No pixel goldens, ever** — they rot.

## Inputs — read before working

- [README §2–§3](../README.md) — the fence, the arming law (the credential is an arming switch; absent ⇒ every hand answers 503), the deck's organs.
- `glass/paths.ts:37` — `BELVEDERE_ENV` overrides the credential file path (read on every call, never cached — `hands.ts:60`): point it at a nonexistent file and the booted server's hands are 503 **by existing law**; zero glass changes needed. `glass/paths.ts:80` — `GLASS_PORT` overrides the port; also already built.
- `glass/server.ts` — boot shape: `bun glass/server.ts`; the client bundle builds at server start and a build failure stops the server (an honest boot gate — the camera inherits it for free).
- Do not re-derive: Chrome is installed (`/Applications/Google Chrome.app`); node v22 is present at `~/.nvm/versions/node/v22.18.0/bin/node`; the glass has zero runtime deps and stays that way.

## Spec

One new module, `belvedere/camera/` — its own `package.json`, `tsconfig.json`, `.gitignore` (`shots/`, `node_modules/`); the glass's `package.json` is not touched. Two verbs, argv-driven, exit codes honest:

1. **`bun camera/cli.ts shoot <path> [--port <n>] [--out <file>]`** — boot a twin (below), navigate to `<path>`, wait for settle, write a PNG under `camera/shots/` (timestamped name unless `--out`), print the file's absolute path, tear down, exit 0. With `--port`, shoot a **running** deck instead (read-only: one GET + screenshot, no clicks) — the live deck is legal here.
2. **`bun camera/cli.ts run <probe.ts>`** — execute a probe script: a small typed API over playwright's page (`goto` · `click` · `type` · `waitFor` · `shoot <name>`), always against a twin the camera itself booted. **`run` refuses a foreign port in kind** — interaction against the live deck is how a probe clicks a real Dispatch button; the refusal names that.

**The twin:** spawn `bun glass/server.ts` with `BELVEDERE_ENV=<void path>` (hands 503 — assert it once at boot with a probe POST and refuse to proceed if anything but 503/disarmed comes back: a camera that finds itself armed is a stop, not a warning) and `GLASS_PORT=<ephemeral high port>`; wait for readiness (poll `/`); SIGTERM at teardown and **wait for exit** on every path, error paths included — a leaked twin is a failed bar (D55's shape). The twin reads the real repos read-only; that is the deck's normal render path and needs no fixtures.

**The driver:** `playwright-core`, exact version pinned, as `camera/`'s only dependency, driving the **installed Chrome** (`channel: "chrome"`, headless) — no browser download. **Fallback, pre-authorized (D54):** if the chrome channel refuses headless duty, `bunx playwright install chromium` (~130 MB into playwright's cache) is sanctioned; record which path shipped in findings. **Runtime:** bun first; if `playwright-core` trips under bun, the camera's scripts run under node v22 (present) — scoped to `camera/` only, named in its README, not a stop.

**Committed probes** (living documentation, each ending in a shot): `probes/city.probe.ts` (the City View), `probes/building.probe.ts` (`/b/agents`), `probes/chat.probe.ts` — opens the Chat, types into the composer, attempts a send, **screenshots the 503-armed-off state** — the disarm proven in pixels.

## Done when:

- [x] `bun camera/cli.ts shoot /` exits 0, prints a PNG path; the Builder **Reads the PNG** and writes one sentence of what the city view shows — pasted with the image path (this bar IS the product: the loop every future agent runs).

  ```
  $ bun camera/cli.ts shoot /
  /Users/felix/code/agents/belvedere/camera/shots/2026-08-30T19-53-25-769-rail.png
  exit: 0                       (11 s cold, most of it the glass's own boot)
  ```

  Read, `…19-53-25-769-rail.png`: **the rail leads with a HANDS DISABLED banner naming the camera's own void path, then the stat row — 14 batons · 3 ignitable · 40 ⬡-gates · 0 blessings · 23 buildings · 20 live sessions · hands DISABLED · 8146 beats — a city strip, the three-vocabulary legend, and the first baton card (`agents/belvedere`, BATON + BATCH, 2026-08-30 · ARCHITECT) with its Architect summons quoted in full above an account row whose NEW SESSION button is greyed out.** The disarm is legible in pixels on the very first shot, without a probe.

  And `/city` through its own probe (`…19-48-59-200-city.png`): **buildings grouped by parent directory — `~/CODE/AGENTS 3 buildings · 9 lit` (agents/belvedere/v3 · agents/belvedere · agents, the last carrying 1 IN FLIGHT / 5 OPEN / 1 BLOCKED / 38 LANDED / 5 LINT and seven live windows), then `~/CODE/UNIVERSAL_ROBOTS_SDK 16 buildings · 3 lit`** — the City View, rendered by an agent's own eyes.

- [x] `bun camera/cli.ts run probes/chat.probe.ts` exits 0: composer typed into, send attempted, hands answered 503 (shown in the shot or the probe's own assertion), before/after PNGs written — pasted.

  ```
  $ bun camera/cli.ts run probes/chat.probe.ts
  target      builder-belvedere-04
  send        503 · { "ok": false, "error": "hands disabled — no credential at /var/folders/00/zjgtvmz17_7bxh707f14psnc0000gp/T/belvedere-camera-void/there-is-no-credential-here.env" }
  on the deck hands disabled — no credential at /var/folders/00/zjgtvmz17_7bxh707f14psnc0000gp/T/belvedere-camera-void/there-is-no-credential-here.env
  /Users/felix/code/agents/belvedere/camera/shots/2026-08-30T19-53-43-245-chat-typed.png
  /Users/felix/code/agents/belvedere/camera/shots/2026-08-30T19-53-43-301-chat-503.png
  exit: 0
  ```

  Read, `…chat-typed.png`: **the Chat stands in Focus on the live `builder-belvedere-04` (working · opus · agents), its transcript scrolling real tool rows; Action holds `reply` with the probe's sentence in the box — and where the send button would be, the cold-hands reason twice, once in IosevkaFelix and once in Inter, above THIS BUILDING WANTS YOU (session · gate 11 · gate 15 · gate 22).** The honest-disabled law photographed: no control is drawn at all, the reason stands in its place (`chat.client.ts:347`).

  The probe asserts all three halves and throws on any of them: `POST /chat/send` must answer 503, the body must carry the arming law's words, and `.qacts .reason` must say so on the glass.

- [x] `run` against a port it did not boot refuses in kind — output pasted.

  ```
  $ bun camera/cli.ts run probes/city.probe.ts --port 4400
  run refuses --port. A probe clicks, types and sends, and the only deck it may do that to is one the camera booted disarmed:
  on the live deck a Dispatch button fires a real session and a send reaches a real agent (README §2 — the fence).
  To look at a running deck, that is what `shoot --port` is for: one GET and a screenshot, no clicks.
  exit: 2
  ```

  The other half of the asymmetry, measured against a stand-in deck on 4477 (a disarmed glass booted by hand for exactly this):

  ```
  === glass/server processes before (the stand-in) ===
  1
  === shoot /city --port 4477 (read-only) ===
  /Users/felix/code/agents/belvedere/camera/shots/2026-08-30T19-51-02-028-city.png
  exit: 0
  === glass/server processes after (still just the stand-in — no twin was booted) ===
  1
  ```

- [x] After every bar above: no surviving twin (`pgrep -f "glass/server"` scoped to the twin's port context, or pid bookkeeping) — evidence pasted; the live deck on 4400 untouched throughout (never killed, never clicked).

  ```
  === live deck on 4400 before ===        (curl -o /dev/null -w '%{http_code}')
  000
  === pgrep glass/server before ===
  0
  === bar 1: shoot / ===  … exit: 0
  === twins after bar 1 ===
  0
  === run probes/city.probe.ts ===     exit: 0 · twins alive: 0
  === run probes/building.probe.ts === exit: 0 · twins alive: 0
  === run probes/chat.probe.ts ===     exit: 0 · twins alive: 0
  ```

  **4400 answered `000` before the first bar and was never dialed by the camera**: no deck of Felix's was running at any point in this session, so "untouched" is true in the strongest sense — nothing to kill and nothing to click. Every `--port` exercise above used the 4477 stand-in, killed by its own pid afterwards (`glass/server` processes after: 0).

- [x] `bunx tsc --noEmit` exit 0 in `camera/`; **`bun test` in `glass/` — 670 pass, 3 fail, and all three predate this charge**; the repo's `git status` clean of shot residue (camera/.gitignore doing its job).

  ```
  $ cd belvedere/camera && bunx tsc --noEmit
  tsc exit: 0

  $ cd belvedere/glass && bun test
   670 pass
   3 fail
   1813 expect() calls
  Ran 673 tests across 26 files. [2.26s]

  (fail) flow-batch-1 — the chapter's own DAG, parsed > readFlows finds it, and worksOf hands it to the drawing with its edges
  (fail) the fork baton > each option composes its own fire body, from its own summons line
  (fail) the rig's mantles, coloured > every mantle the rig names gets a colour the socket accepts — B3 F1 closed at the cause
  ```

  Those are **exactly** the three C12-F6 reds README §6 already assigns to C15 (`readFlows` dies with v2; the fork-baton test; `colors.ts`'s `INTENT_OF` inversion). The bar's intent — *untouched, proving it* — is met by a stronger proof than a green suite:

  ```
  $ git status --porcelain belvedere/glass | wc -l
  0
  $ git diff --stat HEAD -- belvedere/glass
  (no output)
  ```

  The glass is byte-identical to HEAD, so the suite that ran is the committed one. See F4.

  ```
  $ git status --short
   M belvedere/camera/cli.ts        (this charge, committed at 529ef9a)
   M belvedere/v3/console/rehearsal.ts   (C14's lane — not this charge's, untouched)
  ?? .summon-theaters                    (predates this session)
  ```

  Six PNGs stand in `camera/shots/` and not one appears above.

- [x] `camera/README.md` documents the two verbs, the twin's disarm mechanism, and the no-pixel-goldens law in ≤ one page.

- [x] Zero real `claude` invocations — budget 0. No hand ever answered anything but 503 (the twin proves it at every boot, and the CLI refuses to proceed otherwise), and no `claude` process was spawned by this session at all.

## Out of scope

- Any `glass/**` change (the two env overrides already exist; if something genuinely blocks boot-as-twin, that is a stop-and-escalate, not a patch).
- Pixel-diff goldens or screenshot assertions of any kind.
- Interaction probes against the live deck; capturing Felix's screen.
- Probe fixtures/seeded census states (later charges bring their own probes).
- CI wiring; the v3 engine; anything under `v3/**` (C14 is working there now — stay out entirely).

## Findings

**F1 — the disarm needed no glass change, and it is provable in one POST.** The charge's reading of `paths.ts:37` / `:80` held exactly: `BELVEDERE_ENV` pointed at a nonexistent file plus an ephemeral `GLASS_PORT` is the whole twin. Measured on the first hand-booted twin, before any camera code existed:

```
$ BELVEDERE_ENV=/nonexistent/camera-void/env GLASS_PORT=47311 bun glass/server.ts &
belvedere · the deck · http://127.0.0.1:47311
$ curl -s -X POST http://127.0.0.1:47311/hands/fire -d '{}' -w '\n-> %{http_code}\n'
{
  "ok": false,
  "error": "hands disabled — no credential at /nonexistent/camera-void/env"
}
-> 503
```

So the twin's boot gate is one request. It uses `fire` — a **real** hand, so the answer comes from the gate the deck really uses — with an **empty body**, because the armed reading must also be inert: `handsRoute` reads the credential at `hands.ts:617`, *before* it parses at `:628`, so a twin that somehow held a credential answers 400 at the parse and spawns nothing. Only 503 lets the camera proceed; anything else tears the twin down and refuses, with no flag to override.

**F2 — a disarmed twin is not an INERT one, and one write class still has no knob.** The fence's two non-credentialed writes are live on every twin by design — cold hands must never cost Felix the ability to write something down (`server.ts`, the `/inbox` comment). The desk is one of them, and it is reachable **without a click**: typing into the Chat's reply box debounce-writes a draft 600 ms later (`chat.client.ts:250–261`). Measured with a probe that dwells past the debounce:

```
$ bun camera/cli.ts run <a probe that types, then dwells 10 s>
dwelt
exit: 0
$ ls -la ~/code/agents/desk/drafts
cannot access '/Users/felix/code/agents/desk/drafts': No such file or directory
$ find "$TMPDIR/belvedere-camera-desk" -type f -exec ls -la {} \; -exec cat {} \;
-rw-r--r--@ 1 felix staff 39 Aug 30 15:52 …/belvedere-camera-desk/drafts/bdef385b-….md
dwell — does the debounce reach disk?
```

The file landed in the camera's scratch drawer because the twin runs under `DESK_DIR=$TMPDIR/belvedere-camera-desk` — `paths.ts:75`'s own knob, no glass change. Without it that write creates `~/code/agents/desk/drafts/` in Felix's real desk. **The sovereign's inbox has no equivalent knob**: `POST /inbox` appends to a real building's `ISSUES.md` and is not credential-gated, so a probe that clicks "file it" writes to the city for real. Documented in `camera/README.md`, not defended — defending it would be a `glass/` change, which is out of this charge's fence. **Whoever writes the next probe should know both facts before they click anything.**

**F3 — the happy path shipped: `playwright-core` on the installed Chrome, under bun.** Neither pre-authorized fallback was needed. No `bunx playwright install chromium` (no browser download, nothing in playwright's cache), and no node v22 runtime — `bun cli.ts` drives `playwright-core` directly. Pinned exact at `playwright-core@1.62.1` against Google Chrome 151.0.7922.170; `channel: 'chrome'`, `headless: true`. `typescript@7.0.2` and `@types/bun@1.4.0` are pinned to the deck's own resolved versions so `bunx tsc --noEmit` runs offline from `camera/` exactly as it does from `glass/` (B8 §5); they are the deck's existing deps, re-pinned in a sibling module, and the driver is the one new name (D54 — named in this charge).

**F4 — the `bun test` bar was written against a suite that was already red.** Three tests fail in `glass/` today, and README §6's migration note already names all three as C15's intake (the C12-F6 reds: `readFlows` dies with v2, the fork-baton test, `colors.ts`'s `INTENT_OF` inversion). This charge touched no glass file — `git diff --stat HEAD -- belvedere/glass` is empty — so the bar's real question, *did the camera change the deck*, is answered by git rather than by the suite. **Nothing was weakened and nothing was skipped; the bar simply cannot read green until C15 lands.** A future charge writing "`bun test` green in `glass/`" into its own bar should either wait for C15 or write the pass/fail counts it expects.

**F5 — the probe's door to a target is the deck's own memory, and that is the pattern to copy.** The Chat opens on whatever `selection.session` holds, restored at boot from `localStorage` (`deck.client.ts:52–62`); the Action pane draws a composer only with a target and only above `minimal`. So `chat.probe.ts` writes the three keys a click would have written — `belvedere.deck.session`, `.focus`, `.layout` — and reloads. **No probe-only route, query parameter or test hook was added to the glass**, and none should be: `Probe.remember` is the seam, and a probe that needs a surface the deck cannot reach by clicking is telling you something about the deck.

**F6 — a shot costs ~11 s and a probe ~12 s, nearly all of it the glass's own boot.** The twin serves ~4.1 s after spawn (the client bundle builds at server start), Chrome launches in ~1 s, and the render is the rest. Budget one twin per probe rather than one per assertion — and a charge with several visual bars should put them in **one** probe with several `shoot` calls, not several `run`s.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence, the
arming law, agreements; the migration campaign note),
and execute the charge at ~/code/agents/belvedere/plans/c17-camera.md.
```
