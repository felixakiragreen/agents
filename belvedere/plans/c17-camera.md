# C17 — the camera

**Status:** OPEN — laid 2026-08-30 · **Depends on:** — · **Staffing:** Builder ·
opus-high · **Parallel-safe with:** C14 (disjoint trees: `camera/**` vs `v3/**`;
both on master — the two-lane commit rule binds, explicit paths) · **Blessed:**
Felix's own ask, verbatim in the batch-1 amendment (README §6), 2026-08-30; his
ignition is the arm (D11)

## Mission

Agents' eyes and hands on the deck. When this lands, any session working a deck
charge can boot a **disarmed** twin of the glass, drive it browser-grade
(navigate, click, type, wait), and write PNG screenshots it then Reads with its
own eyes — so a Chat rendering defect is something the Builder *sees and fixes*,
not something Felix describes over three round-trips. The camera is an
instrument, not an oracle: assertions stay in `glass/` tests; screenshots are
evidence for findings and the agent's own judgment. **No pixel goldens, ever** —
they rot.

## Inputs — read before working

- [README §2–§3](../README.md) — the fence, the arming law (the credential is an
  arming switch; absent ⇒ every hand answers 503), the deck's organs.
- `glass/paths.ts:37` — `BELVEDERE_ENV` overrides the credential file path (read
  on every call, never cached — `hands.ts:60`): point it at a nonexistent file
  and the booted server's hands are 503 **by existing law**; zero glass changes
  needed. `glass/paths.ts:80` — `GLASS_PORT` overrides the port; also already
  built.
- `glass/server.ts` — boot shape: `bun glass/server.ts`; the client bundle
  builds at server start and a build failure stops the server (an honest boot
  gate — the camera inherits it for free).
- Do not re-derive: Chrome is installed (`/Applications/Google Chrome.app`);
  node v22 is present at `~/.nvm/versions/node/v22.18.0/bin/node`; the glass
  has zero runtime deps and stays that way.

## Spec

One new module, `belvedere/camera/` — its own `package.json`, `tsconfig.json`,
`.gitignore` (`shots/`, `node_modules/`); the glass's `package.json` is not
touched. Two verbs, argv-driven, exit codes honest:

1. **`bun camera/cli.ts shoot <path> [--port <n>] [--out <file>]`** — boot a
   twin (below), navigate to `<path>`, wait for settle, write a PNG under
   `camera/shots/` (timestamped name unless `--out`), print the file's absolute
   path, tear down, exit 0. With `--port`, shoot a **running** deck instead
   (read-only: one GET + screenshot, no clicks) — the live deck is legal here.
2. **`bun camera/cli.ts run <probe.ts>`** — execute a probe script: a small
   typed API over playwright's page (`goto` · `click` · `type` · `waitFor` ·
   `shoot <name>`), always against a twin the camera itself booted. **`run`
   refuses a foreign port in kind** — interaction against the live deck is how
   a probe clicks a real Dispatch button; the refusal names that.

**The twin:** spawn `bun glass/server.ts` with `BELVEDERE_ENV=<void path>`
(hands 503 — assert it once at boot with a probe POST and refuse to proceed if
anything but 503/disarmed comes back: a camera that finds itself armed is a
stop, not a warning) and `GLASS_PORT=<ephemeral high port>`; wait for readiness
(poll `/`); SIGTERM at teardown and **wait for exit** on every path, error paths
included — a leaked twin is a failed bar (D55's shape). The twin reads the real
repos read-only; that is the deck's normal render path and needs no fixtures.

**The driver:** `playwright-core`, exact version pinned, as `camera/`'s only
dependency, driving the **installed Chrome** (`channel: "chrome"`, headless) —
no browser download. **Fallback, pre-authorized (D54):** if the chrome channel
refuses headless duty, `bunx playwright install chromium` (~130 MB into
playwright's cache) is sanctioned; record which path shipped in findings.
**Runtime:** bun first; if `playwright-core` trips under bun, the camera's
scripts run under node v22 (present) — scoped to `camera/` only, named in its
README, not a stop.

**Committed probes** (living documentation, each ending in a shot):
`probes/city.probe.ts` (the City View), `probes/building.probe.ts`
(`/b/agents`), `probes/chat.probe.ts` — opens the Chat, types into the
composer, attempts a send, **screenshots the 503-armed-off state** — the
disarm proven in pixels.

## Done when:

- [ ] `bun camera/cli.ts shoot /` exits 0, prints a PNG path; the Builder
  **Reads the PNG** and writes one sentence of what the city view shows —
  pasted with the image path (this bar IS the product: the loop every future
  agent runs).
- [ ] `bun camera/cli.ts run probes/chat.probe.ts` exits 0: composer typed
  into, send attempted, hands answered 503 (shown in the shot or the probe's
  own assertion), before/after PNGs written — pasted.
- [ ] `run` against a port it did not boot refuses in kind — output pasted.
- [ ] After every bar above: no surviving twin (`pgrep -f "glass/server" `
  scoped to the twin's port context, or pid bookkeeping) — evidence pasted; the
  live deck on 4400 untouched throughout (never killed, never clicked).
- [ ] `bunx tsc --noEmit` exit 0 in `camera/`; `bun test` green in `glass/`
  (untouched — proving it); the repo's `git status` clean of shot residue
  (camera/.gitignore doing its job).
- [ ] `camera/README.md` documents the two verbs, the twin's disarm mechanism,
  and the no-pixel-goldens law in ≤ one page.
- [ ] Zero real `claude` invocations — budget 0.

## Out of scope

- Any `glass/**` change (the two env overrides already exist; if something
  genuinely blocks boot-as-twin, that is a stop-and-escalate, not a patch).
- Pixel-diff goldens or screenshot assertions of any kind.
- Interaction probes against the live deck; capturing Felix's screen.
- Probe fixtures/seeded census states (later charges bring their own probes).
- CI wiring; the v3 engine; anything under `v3/**` (C14 is working there now —
  stay out entirely).

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

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
