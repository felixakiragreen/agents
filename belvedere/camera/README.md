# camera — an agent's eyes on the deck

An agent working a deck charge can boot a **disarmed** twin of the glass, drive it
browser-grade, and write PNGs it then Reads with its own eyes. A rendering defect
becomes something the Builder *sees and fixes*, not something Felix describes over
three round-trips.

The camera is an instrument, not an oracle: assertions live in `glass/`'s tests,
screenshots are evidence for findings and for the agent's own judgment.

```
bun camera/cli.ts shoot /                        # boot a twin, shoot the rail
bun camera/cli.ts shoot /deck --out /tmp/x.png   # anywhere you like
bun camera/cli.ts shoot / --port 4400            # shoot a RUNNING deck, read-only
bun camera/cli.ts run probes/chat.probe.ts       # drive a probe against a twin
bunx tsc --noEmit                                # from this directory — the type gate, offline
```

Exit codes are the contract: **0** it happened (the PNG's absolute path is on stdout),
**1** it did not, **2** the argv was wrong. Shots land in `camera/shots/`, gitignored —
evidence, not truth.

## The two verbs

**`shoot <path> [--port <n>] [--out <file>]`** — one navigation, one PNG. Without
`--port` it boots a twin and kills it after. With `--port` it shoots a deck that is
already running: one GET and a screenshot, **no clicks**, which is why pointing it at
Felix's live deck is legal.

**`run <probe.ts>`** — a probe script, always against a twin the camera booted itself.
The probe path resolves against your cwd first, then against `camera/`. A probe is one
default export:

```ts
import type { Probe } from '../probe';

export default async function (p: Probe): Promise<void> {
	await p.goto('/city');
	await p.waitFor('.card');
	console.log(await p.shoot('city'));
}
```

`run` **refuses `--port`**. A probe clicks, types and sends; on the live deck a Dispatch
button fires a real session and a send reaches a real agent. Looking is a read and
interacting is not — that asymmetry is the fence (README §2) in argv form.

The verbs a probe gets, and nothing else: `goto` · `click` · `type` · `waitFor` · `text`
· `remember` · `ask` · `shoot`. No playwright `Page` escapes `probe.ts`, so a probe
cannot address a deck the camera did not boot, and replacing the driver is one file.
A probe **asserts by throwing** — `run` reports it and exits 1.

- `text(sel)` — what the page says there. This is where a probe's assertions go.
- `remember(key, value)` — seed the deck's own `localStorage` before the next load
  (`deck.client.ts:52–62`). It is how `chat.probe.ts` opens the Chat on a session:
  through the surface the deck already has, never a probe-only route into the app.
- `ask(path, init)` — one request from the page's own origin, answered as status +
  body. It is how a probe attempts a write and reads the refusal verbatim.

## The twin, and its disarm

`bun glass/server.ts` with two env knobs the deck already reads — **no `glass/` change
exists or may exist**:

| knob | value | effect |
|---|---|---|
| `BELVEDERE_ENV` | a path under `$TMPDIR` that does not exist | every hand answers **503** by the arming law (`hands.ts:618`) |
| `GLASS_PORT` | an ephemeral high port | never Felix's 4400 |
| `DESK_DIR` | a scratch drawer under `$TMPDIR` | drafts a probe types land there, not in the real desk |

The twin **proves** its own disarm before a browser opens: one `POST /hands/fire` with
an empty body, which must answer 503. Anything else and the boot refuses and tears the
twin down — a camera that finds itself armed is a stop, not a warning, and there is no
flag to proceed. (Empty body because the armed reading must also be inert: `handsRoute`
reads the credential *before* it parses, so a twin that somehow held one answers 400 and
spawns nothing.)

The twin never outlives the probe: SIGTERM and *wait for exit* on every path, the
error paths included, then SIGKILL if it will not go. A leaked twin is a failed bar.

It reads the real city read-only — that is the deck's normal render path, so there are
no fixtures here and no seeded census.

> **Disarmed is not inert.** Two write classes deliberately stand in FRONT of the arming
> switch, because cold hands must never cost Felix the ability to write something down:
> the desk (D18 class 3) and the **sovereign's inbox**. `DESK_DIR` redirects the first.
> The inbox has no such knob and still appends to a real building's `ISSUES.md` — so a
> probe must not click "file it". Documented, not defended.

## No pixel goldens, ever

Nothing here compares two images and nothing ever should — goldens rot, and a rotting
bar is worse than no bar. A shot is read by the agent that took it and pasted into a
finding. What a probe *asserts* it asserts in words, through `text()`.

Shots are viewport-sized (1440×900), never full-page: the deck is a no-scroll surface
under the law of space, and a PNG an agent Reads costs tokens by the pixel.

## Dependencies

`playwright-core`, pinned exact, driving the **installed Chrome** (`channel: 'chrome'`,
headless) — no browser download. `typescript` and `@types/bun` are the deck's own pinned
versions, for the offline type gate (B8). `glass/`'s `package.json` is untouched, and
the camera imports no deck code: it spawns the glass as a subprocess and talks HTTP.
