# camera — an agent's eyes on the deck

Boot a **disarmed** twin of the glass, drive it browser-grade, write PNGs and Read them.
A rendering defect becomes something the Builder *sees and fixes*, not something Felix
describes over three round-trips. The camera is an instrument, not an oracle: assertions
live in `glass/`'s tests; shots are evidence.

```
bun camera/cli.ts shoot /                        # boot a twin, shoot the rail
bun camera/cli.ts shoot /deck --out /tmp/x.png   # anywhere you like
bun camera/cli.ts shoot / --port 4400            # shoot a RUNNING deck, read-only
bun camera/cli.ts shoot / --fixture              # …against the seeded city instead
bun camera/cli.ts run probes/chat.probe.ts       # drive a probe against a twin
bun camera/cli.ts run probes/fixture-rail.probe.ts   # …a probe that asks for the fixture
bunx tsc --noEmit                                # from here — the type gate, offline
```

Exit **0** it happened (the PNG's absolute path on stdout) · **1** it did not · **2** the
argv was wrong. Shots land in `camera/shots/`, gitignored — evidence, not truth. A cold
`shoot` is ~11 s, a probe ~12 s; most of it is the glass's own boot.

## The two verbs

**`shoot <path> [--port <n>] [--out <file>]`** — one navigation, one PNG. Without
`--port` it boots a twin and kills it after; with `--port` it shoots a deck already
running: one GET and a screenshot, **no clicks**, which is why Felix's live deck is legal.

**`run <probe.ts>`** — a probe, always against a twin the camera booted itself. The path
resolves against your cwd, then against `camera/`. A probe is one default export, and it
**asserts by throwing** — `run` reports and exits 1:

```ts
import type { Probe } from '../probe';

export default async function (p: Probe): Promise<void> {
	await p.goto('/city');
	await p.waitFor('.card');
	console.log(await p.shoot('city'));
}
```

`run` **refuses `--port`**: a probe clicks, types and sends, and on the live deck a
Dispatch button fires a real session. Looking is a read; interacting is not.

The verbs, and nothing else: `goto` · `click` · `type` · `waitFor` · `text` · `count` ·
`scroll` · `remember` · `ask` · `shoot`. No playwright `Page` escapes `probe.ts`, so a probe
cannot address a deck the camera did not boot, and replacing the driver is one file.

- `text(sel)` — what the page says there. A probe's assertions go here.
- `count(sel)` — how many match. The structural laws are counts: *"a ⬡ card carries zero
  fire wiring"* is `count('article[data-holder="felix"] button[data-fire]') === 0`, and the
  DOM knows which card an attribute is inside where a grep over the HTML does not.
- `scroll(sel)` — bring an element into the viewport. A shot is viewport-sized, and the rail
  is taller than one viewport: a card below the fold is a card no shot proves.
- `remember(key, value)` — seed the deck's own `localStorage` before the next load
  (`deck.client.ts:52–62`). It is how `chat.probe.ts` opens the Chat on a session:
  through a surface the deck already has, never a probe-only route into the app.
- `ask(path, init)` — one request from the page's own origin, as status + body. How a
  probe attempts a write and reads the refusal verbatim.

## The twin, and its disarm

`bun glass/server.ts` under three env knobs the deck already reads — **no `glass/` change
exists or may exist**:

| knob | value | effect |
|---|---|---|
| `BELVEDERE_ENV` | a `$TMPDIR` path that does not exist | every hand answers **503** by the arming law (`hands.ts:618`) |
| `GLASS_PORT` | an ephemeral high port | never Felix's 4400 |
| `DESK_DIR` | a scratch drawer under `$TMPDIR` | drafts a probe types land there, not in the real desk |

The twin **proves** its own disarm before a browser opens: one `POST /hands/fire`, empty
body, which must answer 503 — anything else and the boot refuses and tears it down. A
camera that finds itself armed is a stop, not a warning; there is no flag to proceed.
(Empty body because the armed reading must also be inert: `handsRoute` reads the
credential *before* it parses, so a twin holding one answers 400 and spawns nothing.)

The twin never outlives the probe: SIGTERM and *wait for exit* on every path, errors
included, SIGKILL if it will not go. It reads the real city read-only — the deck's normal
render path, so no fixtures and no seeded census.

> **Disarmed is not inert.** Two write classes stand in FRONT of the arming switch,
> because cold hands must never cost Felix the ability to write something down: the desk
> (D18 class 3) and the **sovereign's inbox**. `DESK_DIR` redirects the first — measured:
> typing into the Chat debounce-writes `drafts/<sid>.md` 600 ms later. The inbox has no
> such knob and still appends to a real `ISSUES.md`, so a probe against the REAL city must
> not click "file it". Documented, not defended — and closed under `--fixture`, where the
> city itself is a copy inside the run directory.

## `--fixture` — the seeded city

`--fixture` (and `export const fixture = true` in a probe, which is how the four
`fixture-*` probes ask for it) points the same twin at a world minted for this run, so a
card state is **rendered on demand** instead of waited for:

| knob | value |
|---|---|
| `GLASS_CITY` | a copy of `fixtures/city/` — `alpha` (a row in every state, a ⬡-held baton, two inbox entries), `beta` (a session-holder **fork** and one pending blessing), `broken` (six lint failures, the control) |
| `CENSUS_DIR` | seeded beats: four live sessions on **the camera's own pid**, two dead — one by `SessionEnd`, one whose last line says `Stop` and whose pid is a corpse |
| `USAGE_DIR` | three caches: near-cap and burning · headroom · an hour stale |
| `DESK_DIR` | inside the run directory, like everything else |

The static tree is committed and lint-checked in place —
`bun doctrine/cli.ts lint camera/fixtures/city/alpha` is green, `…/broken` is red, and the
red one is the control. The timed half (pids, timestamps) is generated at boot, because a
committed pid is dead by the time it renders and a committed usage cache is stale by
definition: **deterministic content, generated timing** (`fixtures/seed.ts`).

Everything lands in one `$TMPDIR` run directory, printed on stderr, removed with the twin.
The tree is copied there rather than served from the repo for two reasons, both measured:
a city root inside `~/code` gives buildings slugs relative to `~/code` while `/b/<slug>`
resolves against the CITY root, so every building link 500s (B10 F5's second face); and a
copy is what makes the un-gated inbox write harmless.

## No pixel goldens, ever

Nothing here compares two images and nothing ever should — goldens rot, and a rotting bar
is worse than no bar. A shot is Read by the agent that took it and pasted into a finding;
what a probe *asserts*, it asserts in words through `text()`.

Shots are viewport-sized (1440×900), never full-page: the deck is a no-scroll surface
under the law of space, and a PNG an agent Reads costs tokens by the pixel.

## Dependencies

`playwright-core`, pinned exact, driving the **installed Chrome** (`channel: 'chrome'`,
headless) — no browser download. `typescript` and `@types/bun` are the deck's own pinned
versions, for the offline type gate (B8). `glass/`'s `package.json` is untouched and the
camera imports no deck code: it spawns the glass and talks HTTP.
