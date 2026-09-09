# C16 — the Chat chapter

**Status:** **LANDED** 2026-08-30 — nothing escalated; every bar evidenced below, five findings, two of them bugs a real run caught that no unit test could (F1 the venue's two spellings, F3 the landed step's forgotten session) · **Depends on:** C15 (the Works on v3 and the run-log read it built); C17 (the camera — every visual bar ships its evidence) · **Staffing:** Builder · opus-high · **Blessed:** D20 + D22 r4 (the Chat is the primary viewport — read anything, send turns; summon-to-terminal the measured fallback); his ignition is the arm (D11)

## Mission

The Chat becomes the primary viewport over the engine's world (D20's my_checklist pattern). Today B16's Chat reads pane-born sessions and sends through P6's cmux transport; a headless engine-born session — the venue D22 made primary — has no pane, so today it can be read only through the console and spoken to not at all from the deck. When this lands: the Chat opens **any** session the census or a v3 run log names, headless ones included; a paused ‹needs-⬡ question› renders as a conversation and the reply lands the step through the engine's own seam; nothing is claimed delivered until the transcript says so (B16's law, kept); and the Chat's rich rendering — markdown, code fences, tables, tool rows — is agent-verified through the camera before Felix's pass ever convenes.

## Inputs — read before working

- [B16 (the Chat)](b16-chat.md), findings included — the view, the draft law, the verification read (no new turn · more than one · different bytes — never retried), the compose-time refusals, D10 as structure (cold hands render no send control). All of it survives; this charge widens the targets.
- D20 + D22 (README §7) — the substrate split: engine venue headless, the Chat primary, summon-to-terminal the fallback. Naked `claude -p` without the engine is not approved unattended (D22) — every headless send in this charge travels the engine's seam, never a bare spawn.
- The engine's read/drive seam, and the reference reader: `v3/console/runs.ts` (`locate()`, `venueFrom` — log first, sidecar second, C14's shape) and the console's `read`/`send`/`return` verbs (`v3/console/cli.ts`) — the proven mechanics this charge lifts into the glass through imports. **`v3/**` is read-only** — imports only; a genuinely missing export is a stop-and-escalate naming it (D65's one-parser law).
- C14's compat law: a pre-C14 run names no config dir — readable forever, drivable never; the Chat renders that refusal in kind (F8's `drivable()`), never a stall.
- [C17](c17-camera.md) + [C19](c19-fixture-city.md), findings included — the loop, `Probe.remember` (C17 F5), one twin many shoots (C17 F6), a probe declares its own world (C19 F5). C15 F2/F3 (the `data-at` reservation, the repaint-signature law) — both bit the last tenant that touched this DOM.
- **Chat-content fixtures are this charge's own design question** (C19's out-of-scope, by name). The recommended answer, verified before built: a **fake engine run's own transcript** — layer-0 runs write transcripts in the sandbox their log names, so the Chat's normal discovery reads them with zero new knobs; a scenario scripted with markdown, fences, and a table is a deterministic rich-rendering fixture. Mind C5 F4: the fake's transcript is grammar §2's minimum (no `attachment` rows) — where a bar needs shapes the fake cannot write, a committed real capture (C4's) is the fixture, never an account-dir shim.
- P6's transport law stands for pane targets — untouched. The misdelivery law (UUID always) and B16 F3 (never wait on a probe's words or name) bind any new probe here.
- **Design input (Felix, 2026-08-30, at the batch-3 lay — his notes verbatim):** *"Full rich text (formatting) — view only · Sans & Monospace · Links, tooltip overlays, etc — to charges, decisions, etc · Tiny Minimap (never scrolls, always full height) on the right for jumping between User and agent sections."* Folded into spec items 4 and 6 below.

## Spec

1. **Read anything.** The Chat's target set widens to sessions without panes: an engine run's step (sid + config dir off the run log) and a shelf transcript are both openable in the same view, tail-windowed and paging as today. Discovery imports the console's reader; the Chat never re-implements it. A session the log cannot venue (pre-C14, lost sidecar) opens read-only with the refusal named on the pane.
2. **Send turns to headless sessions, through the engine.** For an engine-run step: a reply into a paused ‹needs-⬡ question› travels the engine's send seam (the console's mechanism — headless resume, same session), landing or refusing exactly as the console does; the step's pause/landing state re-reads from the run log after. For a live TUI pane: P6's transport, unchanged. The Chat picks the road by what the target is, and says which road it took. Both roads: credential-gated (cold hands → no control drawn, the reason in its place), previewed bytes, verified after delivery against the transcript — B16's three failure verdicts kept, never retried.
3. **The engine's pauses are conversations.** A run's ‹needs-⬡ question› surfaces in the Chat as the step's question with the reply box armed (warm hands only); ‹blocked›/‹dead› render read-only with the cause. The attention queue's needs-you item for a paused step opens this view (the existing hotswap seam).
4. **Rich rendering, agent-verified — view only.** Markdown, fences (zero decoded spans inside them — B16's law), tables, tool rows, the streamed tail of an in-flight headless turn (poll-driven as today). Rendering is the TRANSCRIPT's — the composer stays plain text (his note: view only). The §3 font law applies to chat content: Inter for prose, IosevkaFelix for code, numbers, and tool rows. **The decoder reaches the rendered prose**: charge ids, D-ids, and §refs in transcript text light as B20 spans — link, tooltip overlay, context-scoped — through `words()`, never a re-implementation; fence-interior text stays dark. One probe, several shoots: the rich fixture rendered, the paused-question conversation, the cold-hands Chat on a headless target. Every visual bar ships the PNG, Read and described.
5. **The fallback stays measured.** Summon-to-terminal (the composer, B4's hands) is untouched; nothing in this charge removes or gates it (D22 r4 names it the fallback, not a casualty).
6. **The minimap.** A tiny strip on the transcript's right edge: always the pane's full height, never scrolls itself, one mark per turn with User and agent sections distinguishable at a glance; a click jumps the transcript to that turn. It draws from the turn index the tail window already knows — marks for the whole transcript, not just the loaded window (a jump outside the window loads it, the existing paging). Respect the law of space: it rides inside the Chat's pane, adds no page scroll (B13's 0 px law), and survives repaints (C15 F3's signature law — the minimap's state rides the signature of whatever draws it).

Implementation choices inside this spec are the Builder's; anything touching a contract — a v3 export change, a new engine verb, transport semantics beyond the two roads above — escalates.

## Done when:

- [x] The Chat opens a **headless engine-born session** from its run's node in the Works and from the needs-you queue — transcript rendered, the road named — camera shot, Read, described.

  Two probes, two entry points, both clicked rather than addressed.

```
$ bun camera/cli.ts run probes/chat-engine.probe.ts        # the ⬡-queue, on a fake run
run         c16/paused/ask · session daf8f4ab-240b-4730-9891-7ae8aa2411d9
queue       waiting paused:c16/paused/ask → chat daf8f4ab-240b-4730-9891-7ae8aa2411d9 · pane jump null
pane        ‹needs-⬡ question›no account — a layer-0 sandbox the run made and ownsWhich release name goes in the sign-off?
transcript  2 turns · 2 minimap marks
camera/shots/2026-08-30T22-28-10-349-chat-engine-queue.png
camera/shots/2026-08-30T22-28-12-737-chat-engine-paused.png

$ bun camera/cli.ts run probes/chat-works.probe.ts         # the Works' node, on the real round trip
node        c16/roundtrip/note · landed · session 8dc9f325-77e6-4b95-a989-2af1e469f317
the Chat    8dc9f325landedsonnetagentsc16/roundtrip/note
rendered    4 turns · 4 marks · 1 tables · 1 fences · 0 spans inside them
camera/shots/2026-08-30T22-30-52-841-chat-works-node.png
camera/shots/2026-08-30T22-30-53-086-chat-works-opened.png
```

  **Read, and described.** *The queue frame:* Focus reads `chat` and the empty-room sentence — no session is chosen yet — while the pinned drawer says `46 THINGS NEED YOU` and its **first** item is `BLOCKED ON YOU · c16/paused/ask`, `off the register /private/var/folders/…`, carrying **one** control, `CHAT`. The three live sessions under it carry `JUMP TO PANE · CHAT · OPEN`. A headless step offers no pane jump because it has no pane, and the row says so by what it does not draw. *The Works frame:* the node picked in Focus, and Action's fact list ending in `session 8dc9f325-77e6-4b95-a989-2af1e469f317` with a `chat` control beside it. *After the click:* the head reads `8dc9f325 landed sonnet agents c16/roundtrip/note`, a `LANDED · personal` panel under it, and the whole round trip below — the prompt as an ordered list, the subject's `Write /Users/felix/…/notes.md` tool row, its `Round-trip status` heading, two bullets, a `GATE | RESULT` table, a fenced `const verdict: "pass" | "fail" = "pass";`, the `StructuredOutput` row, then **Felix's own reply** *"The release is BELVEDERE-C16."* and the answer `StructuredOutput BELVEDERE-C16`.

- [x] A committed test: the Chat's read on a fake run's transcript ≡ the console `read`'s verdict source (same log, same turns) — the deck re-implements no reader.

  `chat-engine.test.ts` §*the Chat opens a headless engine-born session*, over a run the engine really ran: the target's transcript is asserted **equal to the console's own** — `transcriptPath(handle.venue.configDir, handle.venue.workDir, sid)` for the `handle` the console's `locate()` hands back — the step's state is asserted equal to `fold(readLog(...)).steps.ask`, and the rendered turns are asserted against the transcript's own records read independently off disk.

- [x] **The round trip on real bytes, once:** a real engine run pauses ‹needs-⬡ question›; the reply typed in the rendered Chat lands the step (run log re-read says `landed`), the delivered turn byte-identical page-side and in the transcript on disk. **Budget: ≤$2 / ≤15 subject turns, either ceiling a ⬡-fork (D21) — this bar is the spend.**

```
$ bun lab/c16/roundtrip.ts personal
1. THE PAUSE  ‹needs-⬡ question› Which release is this note for?
   session    8dc9f325-77e6-4b95-a989-2af1e469f317
2. THE DECK   armed on 127.0.0.1:60172 · POST /chat/send answered 400, not 503
3. THE SEND   delivered · engine · 98 B · sha 1d6c388d035d4a66… · 2469 ms · c16/roundtrip/note is running
   wall       2.6 s
4. THE BYTES
   page-side  98 B  sha 1d6c388d035d4a66c808cad7e30921460a29d9e00fcaef78bb2bc15149f0df5b
   on disk    98 B  sha 1d6c388d035d4a66c808cad7e30921460a29d9e00fcaef78bb2bc15149f0df5b
5. THE LOG    landed after 5.1 s
   report     done · Release confirmed by user as BELVEDERE-C16.
   answer     BELVEDERE-C16
6. THE RENDER {"heads":1,"lists":5,"tables":1,"fences":1,"acts":2,"spans":4,"inFences":0,"marks":2}
7. THE CAPTURE lab/c16/rich.jsonl · 42800 B — the committed rich fixture

  turns 4/15 · cost $0.2471/$2
```

  The reply was **typed into the rendered textarea and sent with the rendered button** in a real Chrome against an armed deck (Felix's own credential — a disarmed deck proves nothing on this bar), and the shot `camera/shots/2026-08-30T22-21-41-388-c16-delivered.png` is that moment: the receipt reading `delivered · engine · 98 B · sha 1d6c388d035d4a66… · 2469 ms · c16/roundtrip/note is running`, his words drawn as the newest turn, and — the honest-disabled law working live — **the send control already gone**, replaced by *"the engine holds c16/roundtrip/note at running — only a paused step takes a ruling"*. Two passes are in the 4 turns: the first was the instrument's own defect (F2), the second the clean one.

- [x] The same arc on the fake at budget 0 (answer-then-land, C14's scenario) drives pause → reply → landed in a committed test.

  `chat-engine.test.ts` §*the reply lands the step through the engine's own resume* — `sendMessage` over a real engine run, `mode: 'engine'`, `step.at: 'landed'`, `fold()` says `landed` with `report.answer === 'ANSWER-THEN-LAND-OK'`, `state.turns === 2` (D73 — a resume costs), the delivered bytes read back out of the transcript, and a **second** reply into the now-landed step refused in the engine's own words (`only a paused step takes a ruling`). Zero real turns.

  And the same arc end-to-end through a browser, at zero cost, as the instrument's own dress rehearsal: `bun lab/c16/roundtrip.ts --fake` → `delivered · engine · 69 B · sha ad28f1d5e87383b7… · c16/roundtrip-fake/note is landed`, page-side and on-disk shas identical, `THE LOG landed after 0.6 s`.

- [x] A pre-C14 run's session opens read-only with the refusal named in kind — asserted or shot.

  `chat-engine.test.ts` §*a run that names no config dir is readable forever and drivable never*: a real run's log with the ignition's `configDir` removed and a real subject — which is exactly what a pre-C14 log is — reads `venueFrom: 'sandbox'`, the send is refused with `read-only — … its log predates C14 …`, and **the transcript still renders**.

- [x] Cold hands: the headless reply box is not drawn, the reason stands in its place (the honest-disabled law) — probe-asserted like B16's, plus the 503 on the wire.

```
cold hands  0 send controls · POST /chat/send → 503 · { "ok": false, "error": "hands disabled — no credential at …
camera/shots/2026-08-30T22-28-12-800-chat-engine-cold.png
```

  **Read:** the reply box holds the typed words, there is no button anywhere beside it, and where one would have been stands `hands disabled — no credential at /var/folders/…/belvedere-camera- void/there-is-no-credential-here.env`. The text is typed *first* on purpose: an empty box earns the compose-time refusal, and the disarm is what this half measures.

- [x] Rich rendering shot and Read: markdown + fence + table + tool rows from a deterministic fixture (the fake-transcript answer above, or a committed real capture — say which shipped); zero decoded spans inside fences; the composer beside it still plain text; prose in Inter, code and tool rows in IosevkaFelix — all in the same shot.

  **A committed real capture shipped** — `lab/c16/rich.jsonl`, the round trip's own transcript — and F5 says why the fake could not. It is mounted as a run by `lab/c16/fakerun.ts` §`rich()` and asserted in `chat-engine.test.ts` §*the rendering fixture is a committed real capture*: the six block kinds `head · list · table · fence · act · prose` all present, and every fence carrying **no** `spans` field at all.

  The shot is `camera/shots/2026-08-30T22-21-38-734-c16-rich-render.png`, Read: the subject's turn renders `Round-trip status` as a bold wide-font heading, its prose in Inter, a two-item bulleted list, a `GATE | RESULT` table in IosevkaFelix with hairline rules, and a fenced `const verdict: "pass" | "fail" = "pass";` in IosevkaFelix on its own ground — with the `Write` and `StructuredOutput` tool rows above and below it, one line each, the tool name in blue mono. Beside it the reply box is a **plain textarea** with its placeholder still in it.

- [x] Decoder spans live in rendered transcript prose: a charge id and a D-id light with their tooltips (shot or asserted through the served DOM), zero spans inside fences (B16's law re-proven on the rich path).

  Counted through the served DOM in the same run: `"spans":4,"inFences":0`. In the shot, `row 17` and `D22` carry the decoder's dotted underline in the running prose **and inside a bullet and inside a table cell** — the spans reach every block kind because every block kind is spans — while the fence beside them is dark. The probe **throws** on a single span inside a fence, and `chat-works.probe.ts` re-counts it on the real capture (`0 spans inside them`).

- [x] The minimap shot and Read: full pane height on a transcript taller than the viewport, User and agent sections distinguishable, a click on an out-of-window mark landing the transcript on that turn (the coordinate proven, B21's pattern — never the DOM's opinion); page scroll still 0 px.

```
$ bun camera/cli.ts run probes/chat-minimap.probe.ts
target      bd59780b-f65b-47b7-a37b-0388813cd5d8 · 4765599 B · 1862 records
the file    42 turns · 42 marks · window holds 5, opening at byte 4569106 of 4765599
the strip   42 marks · 21 yours · 21 the agents' · 4 lit (the window on screen)
the jump    clicked mark key 3265, out of a window that opens at 4569106; the marked turn is [data-key="3265"] × 1
camera/shots/2026-08-30T22-26-20-365-chat-minimap.png
camera/shots/2026-08-30T22-26-20-564-chat-minimap-jump.png
```

  **The coordinate, not the scroll:** the probe reads the marks off `/deck/chat`, picks the file's **first** turn — proven outside the window, whose oldest turn opens 4.56 MB later — clicks it, and asserts exactly one `.ct-aim[data-key="3265"]`. **Read:** the strip runs the pane's full height on the right edge, 42 marks alternating Felix-green and grey with the loaded tail lit brighter; after the jump the top mark is amber (the aim) and the pane holds the first turn of a 4.7 MB Grand Architect conversation, rendered with its lists, bold, inline code and the decoder lighting `D57`, `C33`, `C34`, `C27`, `D72`.

  The 0 px law is B16's own probe, re-run whole against this client — with the minimap present on its 400-turn fixture:

```
$ bun lab/b16/probe.ts
PASS  the transcript and the draft own their own overflow — the page never scrolls (B13 F4 kept)
      body 757 px − viewport 757 px = 0 px · transcript scrolls inside itself 11107 / 640 px · draft 150 / 150 px
```

- [x] `bun v3/gates.ts --fast --glass` — ALL GREEN, block pasted; camera gate 0 if probes added; zero new dependencies.

  Run **whole**, not `--fast`: the runner's own disclaimer says `--fast` is never sufficient for a landing (C18 §2).

```
$ bun v3/gates.ts --glass
| gate | result | counts | wall | exit |
|---|---|---|---|---|
| engine · suite | PASS | 77 pass · 0 fail | 24.6s | 0 |
| barrage · suite | PASS | 41 pass · 0 fail | 23.9s | 0 |
| fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
| console · suite | PASS | 26 pass · 0 fail | 1.4s | 0 |
| engine · types | PASS | 0 errors | 0.1s | 0 |
| barrage · types | PASS | 0 errors | 0.1s | 0 |
| fake-claude · types | PASS | 0 errors | 0.1s | 0 |
| console · types | PASS | 0 errors | 0.1s | 0 |
| gates · types | PASS | 0 errors | 0.1s | 0 |
| glass · suite | PASS | 582 pass · 0 fail | 2.3s | 0 |
| glass · types | PASS | 0 errors | 0.2s | 0 |
| barrage | PASS | 1000 runs · 50 cuts · 9/9 mutants | 149.7s | 0 |

ALL GREEN — 12 gates, wall 212.7s

$ cd belvedere/camera && ./node_modules/.bin/tsc --noEmit ; echo "exit=$?"
exit=0

$ git diff 6d5f6bc..HEAD --stat -- '**/package.json' 'package.json'
                                            # empty — zero new dependencies
```

  565 → 582: **17 tests added** (`chat-engine.test.ts` 9, the block markdown 4, the minimap index 3, the queue's paused item 1); nothing was weakened and nothing removed.

  And the **nine standing camera probes re-run whole, all nine green**: `city`, `building`, `chat`, `fixture-rail`, `fixture-building`, `fixture-broken`, `fixture-gauges`, `works-v3`, `inbox-knob`. The organs stand.

  Cost, measured on a live deck against the real city (`lab/c16/cost.ts`, N=20 spaced):

```
GET /deck/state bare  n=20 min=85.0 p50=93.7 p95=296.2 ms   (bar 500 ms)
GET /deck/state ?b=   n=20 min=86.1 p50=90.6 p95=244.9 ms
GET /deck/state ?b=&s= n=20 min=87.8 p50=93.0 p95=237.2 ms
payload   251 973 B, of which chat is 19 091 B
stepIndex 6.2 ms · 346 sessions across the newest 12 run logs
indexOf   cold 12.2 ms (a 4.7 MB transcript) · warm 0.029 ms · 42 marks · cap 600
```

- [x] Live TUI sends unchanged: B16's existing suite green untouched (its tests are the regression).

  `lab/b16/probe.ts` — **ALL GREEN, twelve for twelve**, including the hotswap's three entry points, the 400-turn window, the scroll-up, the drafts, the kill-and-reload, and the disarm. Nothing in `deliver()`, `boxOf()`, `verify()` or the live/resume branches of `attemptSend` was touched; the engine road is a third branch in front of them.

## Out of scope

- Arming/driving a run beyond a reply into an existing pause — igniting, re-blessing, HALT-into-engine (G5's rework lay; B26/B27).
- Streaming transport (websockets, SSE) — the poll is the law until a charge measures it insufficient.
- The shelf's account seeding; any account-dir shim (the fixture answer is named above).
- Removing or gating summon-to-terminal; any organ change beyond the Chat and its entry points.
- Any `v3/**` write; `camera/**` beyond this charge's own probes.

## Findings

*(evidence-grade: every claim carries the command and output that proved it)*

**F1 — a venue path has two spellings and the engine names a transcript with one of them, so a run whose cwd crosses a symlink points at a file that does not exist.** The engine names a subject's transcript `transcriptPath(venue.configDir, venue.workDir, sid)`; the subject names its own from `process.cwd()`, which the kernel hands back **resolved**. On macOS `$TMPDIR` is `/var/folders/…`, a symlink to `/private/var/folders/…`, so the two spellings differ by one slug:

```
the log says   …/config/projects/-var-folders-00-…-c16-paused-work/<sid>.jsonl
the file is at …/config/projects/-private-var-folders-00-…-c16-paused-work/<sid>.jsonl
```

Found on this charge's first fixture, because the Chat's second door reads the transcript **at the path the log names** — which is the first thing in the city to do so. The engine itself does the same in two places (`fire()`'s spawn cursor, `fromDisk`'s transcript fallback), so on such a venue the cursor reads 0 and the fallback reads nothing; neither is visible on the happy path, where the stream file is read first (C6 F2's order). **Real runs are unaffected** — `~/code/agents` crosses no symlink — so this is a fixture-and-test-tree fact today and a trap for anyone whose venue is `$TMPDIR`, which is every barrage run. Handled here at the fixture (`lab/c16/fakerun.ts` mints under `realpathSync(tmpdir())`), **not** compensated for in the deck: a reader that guessed at a second spelling would be the glass deciding what the log meant. `v3/**` is read-only for this charge, so the engine-side question — canonicalize the venue at `load()`, or leave it to the caller — is named here and left to the Architect.

**F2 — the deck IS the engine for the turn it resumes, and "delivered" is not "landed".** `rule(resume)` spawns the subject **in the calling process** and awaits the whole turn. A real turn runs for minutes; the send cannot. So the road races the ruling against a one-second grace — every refusal `rule()` has is decided before a subject spawns — and then hands the verdict to the verification read, exactly as P6's road does: **the transcript is what means delivered**, and the run log is what means landed. The consequence is real and was measured the hard way: the instrument's first pass tore the glass down 400 ms after the receipt, the subject's `result` row was already on disk, and the log stayed `running` because the process that would have appended `landed` was gone.

```
$ bun v3/console/cli.ts list --root …/summon/log/v3/c16
roundtrip/note  running  DEAD 91618  sonnet·auto  personal  c11ca4d7-…

$ bun lab/c16/settle.ts c16/roundtrip     # one tick: the engine's own adopt
c16/roundtrip/note  running -> landed done
```

Nothing was lost — `adopt()` re-derived the turn from the stream file, which is C6 F2's ruled redundancy doing its job — but the window exists and it belongs on the record: **a deck killed between a subject's result and the engine's append leaves a step `running` until something opens that run again.** For a deck that stays up (Felix's) the window is the length of one turn. The instrument now waits on the **log**, not on the receipt; `lab/c16/settle.ts` is the hand tool that closes the window, because the console's five verbs rule, read and summon and none of them ticks. **This binds G5's rework lay**: any deck surface that drives the engine inherits the same ownership, and the honest answers are a supervising process or a `tick` verb — neither is this charge's to choose.

**F3 — a landed step's state has forgotten its session and the log has not, so the surface that just landed it could not open it.** `fold()` carries a session id on three of six states and `landed` is not one of them (correctly — the state is what the step *is*). Both `works.ts` and the new index read it from the state at first, which meant the Works node whose reply had just landed drew no `session` row and offered no `chat` control — the one moment Felix most wants to read the conversation. The log names every session the run ever made (C8 F8), and the console's `list` already reads it that way; both readers now take the log's word:

```
action  … turns 2 spent · timeout 240s · ring landed …          # before: no session row at all
node    c16/roundtrip/note · landed · session 8dc9f325-…        # after
```

The general rule for anyone joining a step to anything outside the run: **address a step's session through the log's ignitions, never through the fold's state.**

**F4 — the queue's `sid` was answering two questions, and a headless step made them come apart.** `QueueItem.sid` meant both *"the pane `POST /hands/focus` jumps to"* and *"the session the Chat opens"*, which was sound while every waiting session sat in a pane. A paused engine step has a conversation and no pane at all, so the field is split: `sid` keeps the pane jump exactly, and `chat` names the session to read. The visible consequence is the honest one — the paused step's row draws `CHAT` and nothing else, and a live session draws `JUMP TO PANE · CHAT` — and one existing behaviour changed with it: **a waiting session in no cmux pane now offers `chat` where it previously offered nothing.** That was a real blindness (the Chat could always read it) and it is named here rather than left as a silent side effect. No fifth attention class was minted: a step the engine cannot move without Felix *is* the `waiting` class, arriving from the run log instead of from a hook beat, and two words for one fact would be two surfaces disagreeing about what is urgent (B14's own law).

**F5 — the fake cannot write markdown, and giving it the ability is a `v3/**` write this charge's fence forbids — so the rendering fixture is a committed real capture.** No scenario in `v3/fake-claude/scenarios/` emits a heading, a table or a fence (checked: 37 `text` steps across 24 scenarios, all plain sentences), and adding one is both a v3 write and a golden re-recording. The charge named the alternative and it shipped: `lab/c16/rich.jsonl` is the round trip's own transcript — a real subject's turn, 42 800 B, purpose-written to carry every shape — mounted as a run by `rich()`, whose log is written with the **engine's own writer** (`openLog`) and parsed with its own parser (`parseFlow`, so invariant 8 still holds when the run is reopened). Two properties worth knowing: the capture's rows carry the cwd of the account where it was recorded, which the mount's own venue overrides and nothing reads; and the fixture's session id is taken **off the capture's first row**, so a log can never point at a file that is not its session's. **If the scenario is wanted, it is a v3 charge** — one `rich-markdown.json` plus its golden — and it would retire this capture.

Two smaller things, neither blocking. **The deck never writes into a run dir.** `openRun()` materializes a `flow.json` from the log's own bytes where none sits beside it, which is right for the console and outside this building's fence (README §2's write list), so the engine road refuses by name — *"…keeps no flow.json beside its log … rule this step from the console"* — rather than growing a fourth write class. Every run the engine or the rehearsal writes has one. And **the cold-hands reason was drawn twice** — once where the button would be and once as the paragraph under it — since B16; the paragraph now draws only when there is a road, because a reason repeated is furniture, not honesty.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence, the
arming law, agreements; the migration campaign note),
~/code/agents/belvedere/plans/b16-chat.md and
~/code/agents/belvedere/plans/c15-deck-v3-lane.md (findings included),
and execute the charge at ~/code/agents/belvedere/plans/c16-chat-chapter.md.
```
