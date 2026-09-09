# B23 — the repaint law

**Status:** **LANDED** 2026-08-31 — nothing escalated; every bar evidenced below, twelve findings. Three faces fixed at the cause, one **falsified** (the stale board does not reproduce, and the cause the spec named is disproven — F4), one **retired on a bounded record** (the Act-stall's mechanism died with the v2 engine — F6). Re-laid from the frozen original at G5 · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** ✓ Felix 2026-08-30 (the rework blessing)

## Goal

One law, five faces — **what a repaint must preserve, and what a swap must retract** — fixed at the cause, on the surviving organs and the Chat that is now primary (D22 r4). Re-laid from the frozen original: the Chat faces lead, because the visual pass (2026-08-30) found them in Felix's own hands. And the charge seeds his direction — **"we need to develop some UI tests. Test pieces of it, 1 by 1"** — every face fixed here pins a browser interaction probe into a standing suite.

## Inputs — read before building

- The punch list (G5's sweep, Felix verbatim): *"I type one letter into the Reply box and the textfield unfocuses"* · *"Scrolling to the top of Chat snaps it back down OR gets it stuck at the top"* · his design ruling: *"The scroll view should show the entire chat & the minimap jumps to its location in the scrollview (not go back in time)"* — continuous full-transcript scroll replaces windowed paging; **the minimap is spatial, never temporal** (README §3, the Chat laws).
- C15 F3 (a repaint signature omitting a picker's state — the proven family for both the focus loss and the stale board) · B14 F4 (the region-signature repaint) · B19 F1/F2 (memo outliving its host; mount-time race) · B15 F5 (a receipt outlives the repaint that proves it).
- B16's Chat (tail-window pager — the model this charge retires) and C16 (the minimap, the 4.7 MB capture `lab/c16/rich.jsonl` + `rich()` — the perf fixture).
- The leak (candidate 6): one click, fifteen `armed` lines at G2's close; `wire(focus)`'s toggle parity making even N a visible no-op. **The sharp edge:** N leaked handlers on the Chat's send deliver the same words N times, each verified rather than refused (B16 verifies per-send).
- The stale board (fourth face, measured 2026-08-28): B22–B27 in the wire payload through refreshes, never painted — and the hard reload ALSO showed stale, which no client memo should survive.
- The camera (C17 — probes, `Probe.remember` as the door) + the fixture city (C19) — focus retention and scroll position are CDP-assertable, the class C15 F2/F3 proved unit tests cannot see.
- C18 F2 (the runner's gate families — the precedent for adding one).

## Spec

1. **The composer face.** Reproduce the one-keystroke unfocus (hypothesis on file, unconfirmed: the poll repaint replacing the composer mid-keystroke — C15 F3 / B14 F4's family, B19 F2 the sibling); fix at the cause. The law: **focus, caret position, and the unsent draft are repaint-preserved state** — a poll may never cost a keystroke.
2. **The scroll model, replaced by his ruling.** Continuous full-transcript scroll: the scrollbar spans the whole conversation; the minimap is a spatial index — a click lands at that location in the scrollview, and scrolling never snaps, never sticks. The tail-window pager (`nearTop` → `loadEarlier`, the stick branch) retires with the model. Virtualize under the hood if the 4.7 MB fixture demands it — the model his hands feel is continuous; measure and print the render/scroll cost on that fixture. `stick`/`aim` (follow-the-tail) survive only as an explicit at-bottom affordance, reset on target swap.
3. **The leak, at the class.** One `AbortController` per tenant mount, its signal on every listener a tenant hangs on a host it does not own, aborted at unmount; audit every surviving tenant (works, chat, workshop, city, desk, composer, decoder hovers).
4. **The stale board.** Reproduce (commit new board rows under an open Workshop), fix at the cause — the signature that omits board content (C15 F3's family) — and check the hard-reload path separately.
5. **The stall, bounded.** The original recipe ("expand Action, arm, watch 10 s") armed the dead v2 engine and may be unreproducible in the v3 world. Three honest runs of the nearest v3 recipe (open Action on a v3 run, watch untouched) plus one code-audit pass; fix over a reproduction, or file the bounded-attempt record and retire the hypothesis with it.
6. **The interaction gate.** Every face above lands with a probe under `camera/probes/` asserting the interaction (focus survives a poll; scroll position survives a poll; one click → one send → one new turn; a committed row paints within one poll). The probes join a standing family: `bun v3/gates.ts --probes` runs them all — **the grant to touch `v3/gates.ts` is explicit and scoped to adding this opt-in family** (C18 F2's own two fixes stay the Architect's). Later charges add probes; this charge builds the rail they land on.

## Done when:

- [x] **Composer:** typing 10 characters across ≥3 poll repaints loses zero keystrokes and zero focus (CDP-asserted); the cause named in findings with its reproduction.

  The probe presses one key at a time and checks focus, the box's contents and the caret **after every keystroke** — the first one is the reported bug, and a probe that only checks at the end cannot say which key was lost. Then it dwells ten seconds, which is ≥3 polls, on a box nobody is touching.

```
$ bun camera/cli.ts run probes/chat-composer.probe.ts
target      architect-belvedere-12
keystrokes  10/10 kept · focus held on every one · caret 10
the dwell   10 s (≥3 polls) · focus textarea[data-chat-draft] · box "belvedere!" · caret 10
camera/shots/2026-08-31T02-29-30-311-chat-composer-typed.png
camera/shots/2026-08-31T02-29-40-383-chat-composer-polled.png
```

  The cause is **F1**, and its reproduction is the same command run one commit earlier: `error: keystroke 1 of 10 ("b") cost the focus — it is on the body`.

  **Read**, `…-chat-composer-polled.png`: the Chat stands in Focus on a live session, its transcript running real tool rows and prose; Action reads `reply` with **`belvedere!`** sitting in the box after ten seconds of polling, and under it — the honest-disabled law — `hands disabled — no credential at /var/folders/…/belvedere-camera-void/there-is-no-credential-here.env` where the send control would be. Below that, `THIS BUILDING WANTS YOU` with `SESSION the parallel triple` and `GATE G6`.

- [x] **Scroll:** on the 4.7 MB fixture — scroll to the very top: readable, no snap-back, no stuck state; middle position survives a poll ±0 px; a minimap click lands spatially (the mark's content in-viewport); at-bottom follow still tracks a growing tail; the model's cost measured and printed.

  Two targets, because no one file can be both: the 4.7 MB conversation (read-only — the top and the spatial jump) and a 120-turn run the probe mints under `$TMPDIR` and **appends to** (the two halves that need a transcript to move).

```
$ bun camera/cli.ts run probes/chat-scroll.probe.ts
the file    bd59780b-f65b-47b7-a37b-0388813cd5d8 · 4765599 B · 1862 records
one view    42 turns drawn of 42 in the file · from byte 0 · 25997 px of content in a 783 px pane · opened in 15.5 s
the top     0 px, and still 0 px after 4 s of polling · the first turn on screen both times
the minimap 42 marks for 42 turns · 21 yours · 21 the agent's · clicked the last (key 4735068) from the top → the pane moved to 25214 px and that turn is in the viewport
the middle  6232 px before an appended turn, 6232 px after (±0) · content 13246 → 13302 px
the tail    at the bottom, an appended turn tracked: 0 px from the end, the newest turn on screen
camera/shots/2026-08-31T02-43-21-933-chat-scroll-top.png
camera/shots/2026-08-31T02-43-22-633-chat-scroll-jump.png
camera/shots/2026-08-31T02-43-27-804-chat-scroll-held.png
```

  Every clause is a coordinate, not an opinion: **±0 px** is `scrollTop` compared exactly across a repaint the appended turn really caused (the content grew 13 246 → 13 302 px), and *"in the viewport"* is the marked turn's own `getBoundingClientRect()`.

  **Read**, `…-chat-scroll-top.png`: the very top of a 4.7 MB conversation, headed `the beginning of this transcript`, then Felix's own first turn to the Grand Architect — *"I want to completely upgrade the mantle system"* — rendered with its bullets, its `{Overview of Glossary & Standards}` and its mantle list, all inside a pane that scrolls while the page does not. The strip runs the pane's full height on the right with its top marks lit. **Read**, `…-chat-scroll-jump.png`: after one click on the last mark, the pane holds the END of that same conversation — the closing `grand-architect-16 30h` turn carrying the amber aim border — and the strip's lit run has moved to the bottom. The minimap's own tooltip is open beside it: *"One mark per turn of the whole transcript. The lit marks are what is on screen. Click any mark to scroll there — the strip is a map of this conversation, not a way back in time."*

  The cost, measured and printed (**F8**): the whole read is **11.7 ms warm** and **215 kB once per target on a gesture**, while the 3 s poll still carries the same **19 kB** tail it always did; the 4.7 MB file is **42 turns**, the account's longest conversation is **108**, and the cap is 2 000 — so no virtualization, and the kill criterion did not fire.

- [x] **The G2 case is dead:** ≥5 tenant swaps, one action click → exactly one audit line (was fifteen); the parity face dead (first click selects after odd AND even swap counts); **the sharp edge dead:** ≥3 swaps to and from the Chat, one send → exactly one new user turn (byte-verified).

  Six swaps, three of them into and out of the Chat, then one click:

```
$ bun camera/cli.ts run probes/tenant-leak.probe.ts
the swaps   workshop → chat → desk → works → workshop → works · 6 mounts onto the same two hosts
the count   one click on the bill → 1 GET /deck/usage (was one per mount)
the parity  the first click selects, at both parities of the mount count: 3 mounts (odd) ✓ · 4 mounts (even) ✓ · 5 mounts (odd) ✓
camera/shots/2026-08-31T02-51-19-645-tenant-leak-works.png
```

  **The count is a REQUEST count, not an audit line, and the substitution is named** (F7): a disarmed twin answers 503 *before* it audits (C17 F1), so the deck's own log cannot record the click — the same fact is read one layer up, off the browser's resource timeline. The wire measured is a delegated click on the Action host, which is the leaked one by construction.

  **The sharp edge is proven server-side, at the number G2 measured**, because it cannot be proven in a browser at budget 0 (F7 — the send control is not drawn unless the hands are armed, and arming a twin is what C17 exists to prevent):

```
$ bun test chat-engine.test.ts        # §one click or fifteen, a target takes ONE delivery at a time
 13 pass · 0 fail · 76 expect() calls
```

  Fifteen simultaneous `sendMessage` calls of the same words into one paused step: **one** `ok`, fourteen refusals carrying `one delivery at a time`, and the transcript read back off disk holding **exactly one** new string user turn whose content is byte-identical to what was sent. Zero real turns — the engine road on a fake run.

  **Read**, `…-tenant-leak-works.png`: the Works expanded on `agents` with its run picker (`C16/ROUNDTRIP` selected of ten), the DAG below it, and Action holding the run's fact list, the live three-account bill and the `REFRESH THE BILL` control whose tooltip reads *"fetch all three accounts again"* — the button this bar clicks once.

- [x] **The stale board:** a board row committed while the Workshop is open reaches the pane within one poll; a hard reload always renders current.

```
$ bun camera/cli.ts run probes/board-fresh.probe.ts
the board   /var/folders/…/belvedere-fixture-B8Yrkj/city/alpha/README.md
before      7 rows on the wire · 7 drawn · no A9 anywhere
the commit  one row appended, 121 B
one poll    8 rows on the wire · 8 drawn · 1 × [data-row="A9"]
the reload  1 × [data-row="A9"] with no client memory at all
```

  **The reported case did not reproduce and the cause the spec named is falsified** (F4): the Workshop's signature carries `snap?.workshop` whole, board rows included, and has since B15. What the register *does* hold is the file LIST, measured with its window and what closes it (`bun lab/b23/stale.ts`, pasted in F4), and pinned in the suite (`register.test.ts` §*a row committed under an open deck*). The induced red below shows the probe would have caught the reported bug in the reported words.

- [x] **The stall:** reproduction + fix, or the bounded-attempt record.

  **The bounded-attempt record, and the hypothesis retired with it** (F6). The original recipe's middle step armed the v2 engine, which D22 retired; the audit finds no clock on the server at all and no unbounded loop anywhere that is not bounded by a deadline or a kill timer. Three honest runs of the nearest v3 recipe:

```
$ bun camera/cli.ts run probes/act-stall.probe.ts
run 1      4 polls in 10 s · the pane still answers a click
run 2      3 polls in 10 s · the pane still answers a click
run 3      3 polls in 10 s · the pane still answers a click
the verdict 3 honest runs of the nearest v3 recipe · no stall reproduced
camera/shots/2026-08-31T03-08-15-311-act-stall-watch.png
```

  The recipe now runs on every `--probes`, so the retirement is not a promise — and the probe tells the two stall shapes apart (the heartbeat stopping, versus the heartbeat climbing with `data-fault` set, which is the honest-degradation path working).

- [x] **The gate:** `bun v3/gates.ts --probes` runs the standing suite green in one command; the default run untouched; each probe seen to fail (one induced red per probe class, reverted).

```
$ bun v3/gates.ts --fast --probes
| gate | result | counts | wall | exit |
|---|---|---|---|---|
| engine · suite | PASS | 80 pass · 0 fail | 24.6s | 0 |
| barrage · suite | PASS | 41 pass · 0 fail | 23.7s | 0 |
| fake-claude · suite | PASS | 60 pass · 0 fail | 10.2s | 0 |
| console · suite | PASS | 30 pass · 0 fail | 1.7s | 0 |
| engine · types | PASS | 0 errors | 0.2s | 0 |
| barrage · types | PASS | 0 errors | 0.1s | 0 |
| fake-claude · types | PASS | 0 errors | 0.1s | 0 |
| console · types | PASS | 0 errors | 0.1s | 0 |
| gates · types | PASS | 0 errors | 0.1s | 0 |
| probe · city | PASS | 1 shot | 11.3s | 0 |
| probe · building | PASS | 1 shot | 10.7s | 0 |
| probe · fixture-rail | PASS | 2 shots | 6.9s | 0 |
| probe · fixture-building | PASS | 2 shots | 7.4s | 0 |
| probe · fixture-broken | PASS | 2 shots | 7.0s | 0 |
| probe · fixture-gauges | PASS | 2 shots | 7.2s | 0 |
| probe · inbox-knob | PASS | 2 shots | 10.8s | 0 |
| probe · board-fresh | PASS | 1 shot | 11.8s | 0 |
| probe · act-stall | PASS | 1 shot | 51.6s | 0 |
| probe · tenant-leak | PASS | 1 shot | 19.2s | 0 |
| probe · chat | PASS | 2 shots | 12.2s | 0 |
| probe · chat-composer | PASS | 2 shots | 22.0s | 0 |
| probe · chat-engine | PASS | 3 shots | 14.3s | 0 |
| probe · chat-works | PASS | 2 shots | 12.2s | 0 |
| probe · chat-scroll | PASS | 3 shots | 27.5s | 0 |
| barrage | SKIP | --fast: not run — never sufficient for a landing | — | — |

ALL GREEN — 24 gates, wall 292.9s (--fast: barrage skipped)
```

  **One gate per probe**, so a red one names itself in the table instead of hiding inside a row that says 14 pass · 1 fail. The family is `camera/probes/standing.txt` — a list, not a marker the runner greps for, because a probe's module scope really runs when it is loaded and one of them sets `$RUNS_DIR` there, so nothing may import a probe to ask whether it belongs.

  **The default run is untouched:**

```
$ bun v3/gates.ts --fast
ALL GREEN — 9 gates, wall 60.5s (--fast: barrage skipped)
```

  **One induced red per probe class, each reverted** — the instrument proved before the verdict is believed:

```
composer   (the reproduction, at 4426a09^)
           error: keystroke 1 of 10 ("b") cost the focus — it is on the body
scroll     (paint's scroll restore deleted)
           error: a repaint moved his reading: 6232 px → 0 px
leak       ({ signal } stripped from works.client.ts's two wires)
           error: one click on the bill made 3 requests for /deck/usage after 6 swaps — the listeners are still stacking
board      (snap?.workshop dropped from the Workshop's signature)
           error: one poll after the commit, the pane draws 0 rows named A9 — the payload moved and the paint did not
stall      (POLL_MS 3000 → 30000)
           error: run 1: 0 polls in 10 s with Action expanded on a run — the deck stopped beating
```

  The board probe's induced red is worth reading twice: *"the payload moved and the paint did not"* is the 2026-08-28 report almost word for word, from a signature deliberately broken — so the probe that finds nothing today would have found that.

- [x] `bun v3/gates.ts --glass` ALL GREEN; predecessor probes green; page scroll 0 px; `/deck/state` p95 within budget; budget **0 real turns**.

  **The proving run, whole** — not `--fast`, whose own disclaimer says it is never sufficient for a landing (C18 §2):

```
$ bun v3/gates.ts --glass
| gate | result | counts | wall | exit |
|---|---|---|---|---|
| engine · suite | PASS | 80 pass · 0 fail | 24.4s | 0 |
| barrage · suite | PASS | 41 pass · 0 fail | 23.5s | 0 |
| fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
| console · suite | PASS | 30 pass · 0 fail | 1.7s | 0 |
| engine · types | PASS | 0 errors | 0.2s | 0 |
| barrage · types | PASS | 0 errors | 0.1s | 0 |
| fake-claude · types | PASS | 0 errors | 0.1s | 0 |
| console · types | PASS | 0 errors | 0.1s | 0 |
| gates · types | PASS | 0 errors | 0.1s | 0 |
| glass · suite | PASS | 608 pass · 0 fail | 2.4s | 0 |
| glass · types | PASS | 0 errors | 0.2s | 0 |
| barrage | PASS | 1000 runs · 50 cuts · 9/9 mutants | 149.3s | 0 |

ALL GREEN — 12 gates, wall 212.3s
exit 0
```

  **Predecessor probes: green, all fourteen**, and they are not re-run by hand — they *are* the standing family's first eleven rows in the `--probes` block above (`city`, `building`, `fixture-rail`, `fixture-building`, `fixture-broken`, `fixture-gauges`, `inbox-knob`, `chat`, `chat-engine`, `chat-works`, plus this charge's four). One predecessor is deliberately **not** in the family and the reason is written in `standing.txt`: `works-v3.probe.ts` pins a live run by name, and the world it reads moves (F12).

  **Page scroll 0 px**, off B16's own probe re-run whole against this client — with the whole 400-turn transcript on screen rather than a 40-turn window:

```
$ bun lab/b16/probe.ts
PASS  transcript — the whole 400-turn file in one scroll view, tool calls encapsulated to one line each
      800 turns rendered (400 his) · 400 activity lines · the read begins at byte 0 of 443374
PASS  no turn is ever drawn twice, poll after poll, with the whole file on screen
      800 turns drawn; every data-key distinct
PASS  the transcript and the draft own their own overflow — the page never scrolls (B13 F4 kept)
      body 757 px − viewport 757 px = 0 px · transcript scrolls inside itself 110899 / 640 px · draft 150 / 150 px
```

  Two of that probe's assertions were **re-laid** by this charge, because they asserted the pager: *"tail-windowed off a 400-turn file"* and *"scroll-up loads earlier windows"*. The second's surviving half — **no turn is ever drawn twice** — means more now than it did, not less: the poll's tail is merged into a whole read on every poll and the tail's first turn can be a fragment (F2), so a duplicate there is a live defect rather than a paging accident. Eleven of its twelve are green; **the twelfth is an inherited red that is not this charge's** — C22's rename left `hands/fire` in that probe's structural safety grep while the route became `hands/ignite`, so the check has been asserting nothing since the respell. Filed to [ISSUES](../ISSUES.md), not chased.

  **`/deck/state` p95 within budget**, measured on a live deck against the real city, 20 spaced requests, with the biggest transcript in the account open:

```
$ bun lab/c16/cost.ts bd59780b-f65b-47b7-a37b-0388813cd5d8
GET /deck/state bare  n=20 min=77.7 p50=80.5 p95=285.7 max=285.7 ms      (bar 500 ms)
GET /deck/state b     n=20 min=80.3 p50=84.8 p95=227.0 max=227.0 ms
GET /deck/state bs    n=20 min=81.9 p50=84.8 p95=229.3 max=229.3 ms
payload        ?b=&s= 198969 B · chat 19077 B
stepIndex      5.8 ms · 346 sessions across the newest 12 run logs
indexOf        cold 10.2 ms · warm 0.022 ms · 42 marks · cap 600
```

  **The poll did not grow**: `chat` on the wire is 19 077 B against C16's 19 091 B, because the whole transcript rides a gesture and never the timer. B13 F5's shared budget is intact.

  **Budget 0 real turns, $0.** Nothing in this charge spawned a real session: every twin is disarmed before a browser opens (every hand 503, asserted at each boot), the engine-road tests run on the fake at layer 0, and the only transcripts written were this charge's own generated fixtures under `$TMPDIR`. Zero new dependencies:

```
$ git diff f979a10..HEAD -- '**/package.json' 'package.json'
                                            # empty
```

## Out of scope

- Any new surface; the send-verification redesign; the account knob, tooltip and decoder items (B27's); the gut (C21's).

## Findings

*(evidence-grade: every claim carries the command and output that proved it)*

**F1 — the composer's lost keystroke was the Action pane's own signature carrying the REFUSAL CODES, which are a function of his words.** C15 F3's family, arriving from the other side: that finding was a signature omitting state the region draws, and this is a signature *including* state the region's own contents depend on. `chat.client.ts`'s Action signature read `refusals(sid ? held(sid, v) : '').map(r => r.code)`, and `refusals()` returns `empty` for a blank box and nothing for a full one — so the **first** character of an empty Reply box flipped that code off, the signature changed, and `paint` rebuilt the host with his textarea inside it. The comment above that line said the signature *"deliberately excludes his own text"*, and it did; it carried a pure function of the text instead, which is the same thing one derivation along.

Reproduced before it was touched, on the first keystroke, by a probe that presses one key at a time and checks after every one:

```
$ bun camera/cli.ts run probes/chat-composer.probe.ts     # before the fix
error: keystroke 1 of 10 ("b") cost the focus — it is on the body
```

`p.type` could never have caught it — `page.fill` puts the whole word in the box in one assignment before any poll lands. The probe verb `press` exists for this reason and is named at its line.

Fixed twice, at the cause and at the class. **The cause:** the box and the controls beside it are now two paint regions — the box's signature is the target, the pane state and the batons, and the acts row's is the send verdict and the refusal codes, so his typing rebuilds a row of controls he is not standing in. **The class:** `paint()` itself now holds and restores focus, the caret and every scroll offset inside a region it rebuilds (`deck-dom.ts` §the repaint law). Identity across a rebuild is tag + id + the whole dataset, which is what the tenants already write for the shell to wire them — so the law asked for no new convention and no probe-only attribute.

```
$ bun camera/cli.ts run probes/chat-composer.probe.ts
keystrokes  10/10 kept · focus held on every one · caret 10
the dwell   10 s (≥3 polls) · focus textarea[data-chat-draft] · box "belvedere!" · caret 10
```

**F2 — the poll's tail can begin MID-TURN, so merging it with the whole read by de-duplicating keys draws one turn twice.** Found by the scroll probe's first assertion on the 4.7 MB fixture: *"the file holds 42 turns and the pane drew 43"*. The poll reads a 192 kB window off the end of the file and parses it in isolation; where that window opens inside an assistant turn, the run of records after the cut becomes a turn of its own, keyed at a byte the whole read never produced. It is not a duplicate key — it is the **same conversation twice under two keys**, which no `Set` of keys can see.

The merge is a **cut**, not a dedupe: the tail is authoritative from its first turn the whole read also knows, or from its first turn newer than everything held, and anything before that belongs to the whole read under its real key (`chat.client.ts` §allTurns). Every tail turn after its first is a genuine turn start — the boundary is a `user` record, which both parses see identically — so only the first can ever be a fragment, and the cut is exact rather than heuristic.

**F3 — a target arrives four ways, and hanging the whole read off any one of them opens a keyhole.** The first cut called `loadWhole` from `retarget()`, which is what a hotswap and a grep jump go through. A **reload** does not: the shell restores `selection.session` straight from `localStorage` at boot (`deck.client.ts:52–62`), and the composer's latch is a fourth door. Measured: a reloaded deck drew **5 turns of 42** — the poll's tail alone, silently. The read is asked for in `draw()` now, the one place that sees a target no matter who set it, guarded by the sid it last *asked* for rather than the one it last *answered* for — because a failed read retried on every repaint is a tight loop between `draw` and `fetch`.

**F4 — the stale board did not reproduce, on either path, and the cause the charge named is falsified.** §4's hypothesis was *"the signature that omits board content (C15 F3's family)"*. It does not omit it: `paint('workshop:focus', …)` carries `snap?.workshop` **whole**, board rows included, and has since B15. So the reproduction was run instead of the fix, against the fixture city because the experiment is a write into a board file and that is the only board file a probe may write (C19 F2). The path is not guessed — the deck names its own board file on the wire.

```
$ bun camera/cli.ts run probes/board-fresh.probe.ts
before      7 rows on the wire · 7 drawn · no A9 anywhere
the commit  one row appended, 121 B
one poll    8 rows on the wire · 8 drawn · 1 × [data-row="A9"]
the reload  1 × [data-row="A9"] with no client memory at all
```

What the register **does** hold is the file LIST, which is the E1 ruling working exactly as written — measured, with the window's width and what closes it:

```
$ bun lab/b23/stale.ts
the ruling  the register's WALK is held 300 s; its CONTENT is re-read per request (E1, 2026-08-27)
at boot     …/b23-stale-SkrPh5/nb · 1 row
a new ROW   2 rows, with no re-walk and no wait — content is never held
a new FILE  2 rows — the walk's file LIST is what is held, so a new board file waits for it
a new BLDG  NOT on the register — the same window
after bust  3 rows · nb2 on the register
```

So the honest verdict: **a row committed into a board file the register already knows is never stale**, and the two things that wait up to 300 s are a *new board file* and a *new building* — both ruled, both printed beside the re-walk button on the rail. What Felix saw on 2026-08-28 cannot be re-run: that README has since been rewritten whole (C23, 1105 → 539 lines) and the deck's v2 lane died under it. The probe is what stands in its place — if it ever happens again, `--probes` says so in one line and names which half is stale. The law is pinned in the suite too (`register.test.ts` §*a row committed under an open deck*): content re-read every call, the file list held, `TTL_MS` asserted.

**F5 — and the trap found on the way: a Bun worker never sees a `process.env` its parent set at RUNTIME, so a runtime `$GLASS_CITY` makes the re-walk walk `~/code`.** Two lines:

```
$ bun lab/b23/stale.ts            # its own §the worker
the worker  a value put in process.env at runtime reaches a Bun worker as: ABSENT
```

The consequence, measured before the lab script was re-written to re-exec with the knob in the spawn env: one `bust()` and the fixture building had **vanished** from the register (`-1 rows`), because `register.worker.ts` reads `cityRoot()` out of its own environment and had walked the real city. **It cannot reach Felix's deck** — the server is launched with its env, and a `--fixture` twin gets `GLASS_CITY` through `Bun.spawn`'s `env`, which a worker does inherit — but it reaches **tests and lab scripts**, silently. B8 F1's family (an env knob that does not reach where you think), one thread along. Filed to [ISSUES](../ISSUES.md) with its evidence and **not fixed**: §4's face did not reproduce, this is outside its cause, and the honest fix changes the worker's construction interface.

**F6 — the Act-stall hypothesis is RETIRED on a bounded attempt: its mechanism no longer exists.** The original recipe's middle step armed the v2 engine, and D22 retired it — there is no `POST /flow/<name>/arm`, no `startEngine()`, and no server tick. The audit is one grep and it is the whole argument:

```
$ grep -n "setInterval|setTimeout|startEngine|while (true)|for (;;)"   # every non-client, non-test glass file
chat.ts:747          for (;;)      the verification read — bounded by `deadline` (LIMITS.verifyMs, 45 s)
grep.ts:125/130/256  for (;;)      the rg reader — bounded by a kill timer and the per-file caps
grep.ts:162          setTimeout    that kill timer
```

**`glass/server.ts` carries no clock at all.** The client's only interval is the 3 s poll; its four `setTimeout`s are debounces, each cleared before it is re-set. And three honest runs of the nearest v3 recipe — open Action on a v3 run, watch untouched — found nothing:

```
$ bun camera/cli.ts run probes/act-stall.probe.ts
run 1      3 polls in 10 s · the pane still answers a click
run 2      3 polls in 10 s · the pane still answers a click
run 3      3 polls in 10 s · the pane still answers a click
the verdict 3 honest runs of the nearest v3 recipe · no stall reproduced
```

The probe stands in the family, so the retirement is not a promise: the recipe runs on every `--probes`, and it tells the two shapes apart — the heartbeat stopping (wedged) versus the heartbeat climbing with `data-fault` set (the poll failing and saying so, which is the honest-degradation path working, not a stall).

**F7 — the leak's sharp edge cannot be probed on a disarmed twin, and the reason is another law working.** §3's bar wanted *"one send → exactly one new user turn (byte-verified)"* through the browser. It cannot be had at budget 0: the send control is **not drawn at all** unless the hands are armed (the honest-disabled law, D10 as structure), so a probe against a disarmed twin has nothing to click — and arming one is the thing C17's twin exists to prevent. The two laws are both right and they meet here. Named rather than worked around.

So the edge is proven where it can be, twice. **Client-side**, the cause is dead at the seam and the count is measured on the Works' bill — a delegated click on the same Action host, through the same `mount`, the leaked wire by construction — with the induced red to prove the instrument:

```
$ bun camera/cli.ts run probes/tenant-leak.probe.ts
the swaps   workshop → chat → desk → works → workshop → works · 6 mounts onto the same two hosts
the count   one click on the bill → 1 GET /deck/usage (was one per mount)
the parity  the first click selects, at both parities of the mount count: 3 mounts (odd) ✓ · 4 mounts (even) ✓ · 5 mounts (odd) ✓

$ # the same probe, with `{ signal }` stripped from works.client.ts's two wires, then restored
error: one click on the bill made 3 requests for /deck/usage after 6 swaps — the listeners are still stacking
```

Three requests from one click after three mounts of the Works: the leak, exactly N. **Server-side**, the second lock is `sendMessage`'s one-delivery-at-a-time guard, now pinned at the number G2 measured — fifteen simultaneous sends of the same words into one target produce **one** new user turn, byte- identical, and fourteen refusals in P6's own words (`chat-engine.test.ts` §*one click or fifteen*). That lock would hold even if a future tenant hung a wire wrong.

**F8 — continuous scroll needs no virtualization, and the number that decides it is the TURN count, not the byte count.** The kill criterion asked for a measurement before a degraded model, so:

```
$ bun lab/b23/cost.ts
fixture     bd59780b-f65b-47b7-a37b-0388813cd5d8 · 4765599 B · 1862 records
the read    whole 42 turns of 42 · from byte 0 of 4765599
            cold 28.3 ms (the index's own first scan) · warm p50 11.7 ms · min 10.7 max 12.2
the poll    tail 40 turns · p50 1.0 ms · min 0.9 max 1.2   (bar 500 ms)
the wire    whole 215219 B (one gesture, once per target) · tail 18991 B (every 3 s poll)
the parse   8.8 ms for 4731894 chars → 42 turns · index (warm) 0.003 ms
the ceiling the account's longest conversation is 108 turns (77972dc5-…) · the cap is 2000
```

4.7 MB is **42 turns**: nearly all of a big transcript is tool results and thinking, which the reader folds to one line each and the turn grammar never expands. The whole read is 11.7 ms warm and rides a **gesture**, once per target; the 3 s poll still carries the same 19 kB tail it always did, so B13 F5's shared budget is untouched. The browser lays out 25 997 px of content in a 783 px pane without help. The longest conversation in the account is 108 turns against a 2 000-turn cap — so the cap is not a limit anyone will meet, and when it is met the pane says so in `from` rather than passing a keyhole off as the conversation.

**F9 — `chat-minimap.probe.ts` retired into `chat-scroll.probe.ts`, because its bar asserted the model that died.** C16's minimap probe proved its jump by asserting `view.turnCount > view.turns.length` — *the transcript is taller than one window* — and then that a click **loaded** the window around an out-of-window turn. Under continuous scroll both sentences are false by design: every turn is loaded, and a click moves the scroll view. Its two surviving claims (the strip spans the file; the two speakers are distinguishable) are asserted in the new probe, and its target-choosing rule is copied verbatim so the two charges measure one file. A probe asserting a retired contract is a red gate, not a record — that is the difference between `camera/probes/` and `lab/` (C15 F6).

**F10 — what the pager took with it, so nobody writes against it.** Gone from `chat.ts`: `around()`, `anchorOf()`, `LIMITS.anchorTail`, `Where`'s `before` and `around` cases, `ChatView.anchor`, and `windowOf`'s `endByte` parameter — a door labelled *"read up to byte N"* is how a keyhole grows back, so the signature is now `windowOf(path, bytes)` and a test asserts its arity. Gone from `chat.client.ts`: `loadEarlier`, `loadAround`, `toLatest`, the `earlier` window stack, `LIMITS.held` and `LIMITS.nearTop`, the `[↑ earlier]` and `[↓ latest]` controls and `.ct-aim-note`. `Where` is two cases now — `tail` (the poll) and `whole` (the gesture). **The one rule both sides need is `deck-model.ts`'s `turnAt`** — which turn a byte offset belongs to — because the Grep computes the offset server-side and the Chat scrolls to the turn client-side, and two copies of that rule would be two answers waiting to disagree.

**F11 — the cross-lane fact, already relayed: `glass/chat.ts` in these commits carries four lines of B22's.** B22's `Ignite` widening broke this lane's one `ignite()` caller (the dead-target resume road) and B22 swept it themselves, correctly, with the reason written at the line. Extracting those four lines would mean juggling partial staging over a file this lane rewrote whole, which the git directive forbids — so they ride here and the attribution is written down instead ([BULLETIN](BULLETIN.md), B23's entry). The general fact for later parallel batches is in the same entry: **`tsc --noEmit` is whole-project, so file-disjoint is not type-gate-disjoint either** — a half-written module in any lane is red in every lane's gate output.

**F12 — a standing probe must declare its own world, and the gate's first whole-family run proved it by going red on two probes that had each passed alone minutes before.** Both reds were the same sentence: a click timing out on a node that was there when the probe started.

```
### RED — probe · works-v3      TimeoutError: waiting for locator('[data-flow="c10/rehearsal"]')
### RED — probe · act-stall     TimeoutError: waiting for locator('.node.on')
```

The Works draws the newest **twelve** run logs out of `summon/log/v3` (`LIMITS.read`, C15 F7), and that tree is written by the engine, by the console's `tick` — **and, in a parallel batch, by another lane's session**: C20 is working `v3/console` on this same checkout while this runs. So the picker's contents are not a fact a probe may hold across ten seconds, let alone hard-code. `works-v3.probe.ts` pins `c10/rehearsal` by name and `act-stall` had assumed the node it clicked would still be the node after its watch.

Fixed the way the law says rather than by widening a timeout. **`act-stall` names no run at all**: it clicks whatever node is showing, and after the watch it clicks a **fresh** one — because what a stall probe needs is the heartbeat and a pane that answers, both true of any run. **`works-v3` is not in the standing family**, with the reason written in `standing.txt`: it stays a committed probe and a fine thing to run by hand, and re-laying C15's own probe is not this charge's to do.

The general rule, for every probe after this one: C19 F5's *"a probe declares its own world"* is not only about fixtures. **Anything a probe reads that another process may write is a world it has not declared** — the telemetry root as much as the census — and on a shared checkout in a parallel batch, that other process is a colleague.

## Kill criteria

None global — every face fixes at a cause diagnosed or reproducible. Escalate only if the leak fix demands restructuring the tenant seam itself, or if continuous scroll on the 4.7 MB fixture cannot hold 60fps-class feel even virtualized — bring the measurement, never a silently degraded model.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence,
design laws — the Chat laws included, agreements; the campaign notes) and
~/code/agents/belvedere/plans/c15-deck-v3-lane.md +
c16-chat-chapter.md + c17-camera.md (findings included),
and build ~/code/agents/belvedere/plans/b23-repaint-law.md to its
`Done when:`.
```
