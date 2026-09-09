# B24 — his arrangement

**Status:** **LANDED** 2026-08-31 — the City is his: one recursive structure (spaces) over the register, persisted at `desk/city-arrangement.json`, truth underneath; candidate 7 reproduced on the live city (7 sections for 5 labels) and fixed through the same renderer his arrangement uses; the scrim (item 0, B26 F6) closed first. Findings F1–F11 below · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** ✓ Felix 2026-08-30 (the rework blessing)

**The sidebar design input (Felix, the blessing 2026-08-30):** he sketched two models and leans to the second — (A) a fixed taxonomy: District / Building / Campaign / Offices (his worked example: Felix district → Offices, Agents→Belvedere, Rooted→Arborist/Repot, Whiteboardy; THG district → bob→lunchbox/pods/catalog, mega→simmy/snappy/cornerizer/…, speakeasy); (B) **"spaces"** — *"a space can have optional: color/name/cwd/board/agents/type/ order and nest inside another space. Done."* His own counter-example to (A): speakeasy is not a campaign, "more like a one-off thing" he wants to keep around. **Pre-chewed ruling (G5, strike-able at his glance): spaces —** (A)'s fixed ranks are Belvedere inventing a classification, which spec §4 already forbids; one recursive structure carries his example verbatim, with `type` a free label ("district", "campaign", "office", or nothing — words he types, never ranks Belvedere knows). **One trim on his field list:** a space stores name · color · order · type · children + an optional **binding** to a building (the cwd); `board`, `agents`, and liveness are what the building register and census already know about the bound building — derived through the binding, never stored in the arrangement file (truth underneath, the Goal's own law). C21 (the gut) runs first; this row arranges the surviving City.

## Goal

Felix's directive (ISSUES 2026-08-28, his ruling): **"I'm going to want to have the city sidebar be completely customizable by me. Reordered, labelled, colored, nested, exactly my way."** The City is his space and its ARRANGEMENT is his — reorder, rename, recolor, nest into his own groupings, not the filesystem's. **Truth stays truth underneath**: the census still decides what exists and what is live, attention still outranks recency inside whatever arrangement he makes, and a building he has not arranged still appears — an arrangement hides nothing new.

## Inputs — read before building

- ISSUES commit `60b0124` (the ruling, verbatim) and `25ff83c` (candidate 7's diagnosis + the repo-vs-campaign ask).
- B14's `drawCity` (the rewrite that lost B9's group-first invariant), B9's grouping precedent, B15's reorder (per-viewer localStorage — the transitional layer this row supersedes for the City), B19/D17 (`desk/` is his drawer; the fence's write class 7), B18/D18 (cmux-side identity — distinct layer, see spec §5).
- §3 design laws: encapsulation-first, no dropdowns, the law of space (no scrolling), legends on colored views.

## Spec

0. **First act — the scrim (B26 F6, ruled here at the review):** `.app`'s `position: relative; z-index: 1` makes a stacking context that traps the drawer's `z-index: 30` under the root-level `#scrim` at 20 — Chrome's own hit test says the scrim intercepts every queue control (`file it`, `bless`, `chat`, B26's `compose`/`copy`). One line — drop the `z-index` from `.app`, or move `#scrim` inside `#app` below the drawer — plus a probe asserting an OPEN drawer's control actually clicks; then delete the two workaround comments (C16's `chat-engine.probe.ts:42`, B26's `baton.probe.ts`). Your arrangement controls draw there too.
1. **The arrangement layer is spaces** (his model, the header). One recursive structure over the building register: a space carries name · color · order · type (free label) · children, plus an optional binding to a building; his sketch (the header) must be expressible verbatim, speakeasy included. Rendering rules: attention monotone **inside** his arrangement (a space's loudness is its loudest member; recency only inside a rank); an unarranged building lands in an unfiled tail he can file from; nothing the census knows can be absent from the view; a bound space renders its building's badges, board and liveness through the binding (derived, never stored).
2. **Persistence (pre-chewed ruling, strike-able at blessing): a desk file** — `desk/city-arrangement.json`. His own words ask durability across browsers and machines; localStorage is per-browser by construction (rejected). The fence needs **no new write class** — the Belvedere writes it as a desk file (class 7); commits are never Belvedere's (sessions and Felix commit, D17). Editing by gesture on Belvedere writes the file; the file is the state (a kill loses nothing — B8's drill bar).
3. **The default view must not lie (candidate 7).** The reported split-neighborhood: hypothesis from one code read, unreproduced — `drawCity` orders buildings by loudness and the grouping fractures. **Verify first** against B14's rewrite; if the invariant genuinely broke, restore group-first (cluster by label, then order clusters by loudest member — B9's invariant); if it holds, find what his eyes actually saw and fix that. Either way the verdict is recorded with evidence.
4. **Repo-vs-campaign becomes vocabulary, not taxonomy.** A campaign is just a group he makes; Belvedere invents no classification of its own (the G2 design input lands inside his arrangement, free).
5. **Two identity layers, named apart.** His labels/colors here are Belvedere-side arrangement vocabulary; B18's rename/recolor write-through (D18) is cmux-side session/workspace identity. This row touches only the former; Belvedere must render which is which without ambiguity (the legend says so).
6. **Law of space holds.** Nesting introduces no page scroll: deep groups collapse (encapsulation-first — a collapsed group leads with its name and its loudest badge); the editing surface is toggled buttons and drag, no dropdowns.

## Done when:

Browser half on the camera (C17) with the fixture city (C19) where a fixture serves; the live half against the real register; every visual bar's shot Read and described. Drag-and-arrange interaction probes join the `--probes` suite (B23's rail).

**Item 0 — the scrim (B26 F6), the first act.** `.app`'s `z-index: 1` is gone (`deck.css` §the three panes; `position: relative` stays and makes no stacking context on its own), the two workaround comments are rewritten as choices, and `camera/probes/drawer-click.probe.ts` stands over it in `standing.txt`. **Seen to fail**, the defect reinstated as one line:

```
$ sed -i '' '59s/.*/\tposition: relative; z-index: 1;/' glass/deck.css
$ bun camera/cli.ts run probes/drawer-click.probe.ts
  - attempting click action
    <div id="scrim" class="scrim"></div> intercepts pointer events
  - retrying click action  (× 19, then TimeoutError at probe.ts:149)

$ git checkout glass/deck.css && bun camera/cli.ts run probes/drawer-click.probe.ts
scrim       painted, and both controls under it answered
receipt     filed · - 2026-08-31 · Felix (via Belvedere) · B24 drawer-click probe …
```

- [x] **Arrange the live city: reorder two buildings, relabel one, recolor one, nest two under a new group of his naming — all four visible on the next paint, and `desk/city-arrangement.json` on disk is the arrangement (byte-inspectable, human-readable).** Two runs, and the split is named (F8): the four gestures are driven by a real pointer in a real Chrome against the **real register** — `camera/probes/city-arrange-real.probe.ts`, whose twin writes to the camera's scratch desk by C17's containment law — and the file at the real path is written by a real Belvedere through the deck's own `POST /desk/arrangement`, the same wire the drag posts to.

```
$ bun camera/cli.ts run probes/city-arrange-real.probe.ts
register    24 buildings in 5 neighborhoods — one section per label
reorder     rooted/archive/blossom | rooted/archive/repot — rooted/archive/repot dropped onto rooted/archive/blossom, and it sits before it
relabel     agents/belvedere reads "the glass", with its register name beside it
recolor     ~/code/agents wears purple
nest        THG holds bob and simmy
file        …/belvedere-camera-desk/city-arrangement.json · 6565 B · 24 buildings, none lost
```

  All four are re-asserted **after a four-second dwell**, which is past the three-second poll — so everything the probe checks from that line on is the file talking, not the client's own optimistic redraw. The real file: `desk/city-arrangement.json`, **5889 B**, tab-indented, `sha256 02781ff4…`, written 200 OK by the deck at `bun lab/b24/sketch.ts 4478` (`register 24 · placed 24 · unfiled 0`). Shot Read: **his sketch, verbatim** — FELIX (blue, `DISTRICT`) holding agents → agents/belvedere → agents/belvedere/v3, ROOTED (green) with its three, whiteboardy, hexwright; THG (purple, `DISTRICT`) holding bob → its three campaigns, mega (`THE MONOREPO`) with ten, felix (`ONE-OFF`) with two.

- [x] **Kill Belvedere, relaunch, load in a different browser — the arrangement is identical (the file is the state; nothing rides localStorage).**

```
before kill    55dd33b6bb43566e5e97ad67fd146d896ff783dbafbb2bf5336d375d2a01048c
killed 81149
after relaunch 55dd33b6bb43566e5e97ad67fd146d896ff783dbafbb2bf5336d375d2a01048c
IDENTICAL
```

  (`sha256` of `/deck/state`'s `arrangement`, over a `kill -9` and a fresh process.) The **different browser** is the camera's own: `bun camera/cli.ts shoot /deck --port 4478` launches a fresh Chrome context whose `localStorage` has never held a key of this deck's, and the shot Read above is that browser's — the whole arrangement drawn from the file alone.

- [x] **A building added to the building register after arranging appears in the unfiled tail; filing it by gesture persists.** The literal bar, in `city-arrange.probe.ts` §5: with THG already standing, the probe mints a building inside the run's own city (`cp beta delta`), asks for `/rewalk`, and finds it in the tail; one drag files it and the file on disk carries it.

```
his file    …/belvedere-fixture-Foicns/desk/city-arrangement.json
            […] · […] · […] · …/city/broken · [THG] · …/city/beta · …/city/alpha · …/city/delta
```

- [x] **Attention monotone inside the arrangement: a fixture where the quiet group holds the loudest building pins group ordering by loudest member; badges unchanged by any arrangement (truth underneath).** Both halves are pinned twice — as law in `glass/spaces.test.ts` (*"attention monotone: a quiet space holding the loudest building sorts by its loudest member"*, `tree.map(id) === ['quiet','loud']`, `loud === -1`; *"badges are untouched by any arrangement"*, the same building three levels deep carrying the same record) and **in pixels** by the standing probe: beta is dropped into THG first and alpha second, the file keeps `beta → alpha`, and the page draws `alpha → beta` because alpha is the blocked-on-you building.

```
the law     file order beta→alpha, drawn order alpha→beta — attention outranks his order
```

  **Seen to fail**, the sort removed from `arrange()`: `error: alpha is the blocked-on-you building and must draw first inside his space; the first row is "…/city/beta"`.

- [x] **Candidate 7's verdict recorded: reproduced-and-fixed.** Reproduced on the live register before anything was built (`bun lab/b24/candidate7.ts`) — **24 buildings, 5 distinct labels, 7 sections drawn**:

```
groups drawn: 7 · distinct labels: 5
FRACTURED ×2
  "~/code/universal_robots_sdk" at 12 and again at 14 — split by ~/code/whiteboardy
  "~/code/universal_robots_sdk" at 21 and again at 23 — split by ~/code/hexwright
```

  Cause named (F1): `cityRows` orders by attention and `drawCity` grouped *consecutive runs* of that order, so B9's group-first invariant died at B14's rewrite. Fixed by clustering first — and through the same renderer his own arrangement uses, so the default view and his view cannot drift apart. Measured after, in Chrome against the real register: `groups 5 · rows 24`. **Pinned as law, not as a fixture, and that is deliberate**: the seeded city's three buildings each carry a distinct label, so no interleaving can fracture it there and a fixture probe would gate nothing. The regression is `spaces.test.ts` §the register's own neighborhoods — *"one section per label, however the attention order interleaves them"* — which is the exact shape the live city has and the fixture cannot make.

- [x] **`git status` after the live run: `desk/` and nothing else; zero `<select>`; page scroll 0 px with a 3-deep nest expanded; legend names the two identity layers.**

```
$ git status --short
 M belvedere/camera/probes/city-arrange.probe.ts     (this charge's own edit, since committed)
 M belvedere/glass/city.client.ts                    (this charge's own edit, since committed)
?? .summon-theaters                                  (present at the summons — not this run's)
?? belvedere/lab/b24/sketch.ts                       (this charge's own file, since committed)
?? desk/city-arrangement.json

$ git status --porcelain --untracked-files=all desk/
?? desk/city-arrangement.json
```

  The live run's own footprint is exactly one file and it is under `desk/`. The rest is this charge's committed work and one untracked file that was already there when the summons landed.

```
law of space three deep, page scroll 0 px, content 900 in 900 · 0 <select> on the deck
```

  The legend's two new keys name the layers apart: *"**space** — your arrangement: name, color and grouping, Belvedere-side, in desk/city-arrangement.json"* and *"**path** — the register's own name for that building, shown wherever you have relabeled it"*, above B18's *"the color cmux is wearing — cmux-side session identity, written through"*.

- [x] **Suite green in one process, offline type gate exit 0, predecessor probes re-run green, `/deck/state` p95 within the landed budget.**

```
$ /deck/state, 20 requests at 1.5 s (spaced — a tight burst hides the walk, B3 E1)
n=20 min=77.1 p50=219.3 p95=265.8 max=328.9 ms   ·   70 239 B
```

  Against the 500 ms bar and B26's landed p95 of 280.2 ms. The arrangement is **5 889 B of that payload** and one small file read per poll.

  The proving run, on the settled tree — two gates more than B26 left (29 → 31: `probe · city-arrange` and `probe · drawer-click`), **exit 0**:

```
$ bun v3/gates.ts --glass --probes
| gate | result | counts | wall | exit |
|---|---|---|---|---|
| engine · suite | PASS | 80 pass · 0 fail | 24.3s | 0 |
| barrage · suite | PASS | 41 pass · 0 fail | 23.5s | 0 |
| fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
| console · suite | PASS | 30 pass · 0 fail | 1.7s | 0 |
| engine · types | PASS | 0 errors | 0.2s | 0 |
| barrage · types | PASS | 0 errors | 0.1s | 0 |
| fake-claude · types | PASS | 0 errors | 0.1s | 0 |
| console · types | PASS | 0 errors | 0.1s | 0 |
| gates · types | PASS | 0 errors | 0.1s | 0 |
| glass · suite | PASS | 657 pass · 0 fail | 2.4s | 0 |
| glass · types | PASS | 0 errors | 0.2s | 0 |
| probe · city | PASS | 1 shot | 11.0s | 0 |
| probe · city-arrange | PASS | 2 shots | 10.6s | 0 |
| probe · building | PASS | 1 shot | 11.0s | 0 |
| probe · drawer-click | PASS | 2 shots | 7.2s | 0 |
| probe · fixture-rail | PASS | 2 shots | 6.9s | 0 |
| probe · fixture-building | PASS | 2 shots | 7.4s | 0 |
| probe · fixture-broken | PASS | 2 shots | 6.9s | 0 |
| probe · fixture-gauges | PASS | 2 shots | 7.3s | 0 |
| probe · inbox-knob | PASS | 2 shots | 11.7s | 0 |
| probe · board-fresh | PASS | 1 shot | 11.8s | 0 |
| probe · nag-honesty | PASS | 2 shots | 6.7s | 0 |
| probe · act-stall | PASS | 1 shot | 51.8s | 0 |
| probe · tenant-leak | PASS | 1 shot | 19.4s | 0 |
| probe · chat | PASS | 2 shots | 12.5s | 0 |
| probe · chat-composer | PASS | 2 shots | 22.9s | 0 |
| probe · chat-engine | PASS | 3 shots | 14.9s | 0 |
| probe · chat-works | PASS | 2 shots | 13.5s | 0 |
| probe · chat-scroll | PASS | 3 shots | 28.3s | 0 |
| probe · baton | PASS | 2 shots | 7.3s | 0 |
| barrage | PASS | 1000 runs · 50 cuts · 9/9 mutants | 148.9s | 0 |

ALL GREEN — 31 gates, wall 480.9s
```

## Out of scope

- Arranging anything but the City pane; cmux-side identity (B18's, landed); multi-arrangement profiles; sharing/exporting arrangements; auto-grouping heuristics of any kind.

## Kill criteria

If nesting genuinely cannot satisfy the law of space at his real city's size (17+ buildings, his groups), **stop and escalate with the measured geometry** — never invent page scroll, never cap his nesting silently.

## Findings

**F1 — candidate 7 is real, and its cause is one line of B14's rewrite.** `cityRows` sorts buildings by attention and `drawCity` then grouped *consecutive runs* of that sorted list, so a neighborhood whose buildings are not adjacent in attention order draws as two or three sections with the same heading. On the live register that is **7 sections for 5 labels**, measured before anything was built (`lab/b24/candidate7.ts`, output on the bar above): `~/code/universal_robots_sdk` drew three times, split by `~/code/whiteboardy` and `~/code/hexwright`. B9's invariant was group-first — cluster by label, then order the clusters by their loudest member — and the fix restores it as `spaces.derived()`, **through the same renderer his own arrangement uses**. That last part is the finding worth keeping: the default City and his arranged City are one code path, so there is no second grouping rule to drift.

**F2 — attention outranks HIS order, not just recency, and the deck now says so out loud.** The spec's two sentences admit two readings, and the bar's own words settle it: *"a fixture where the quiet group holds the loudest building pins group ordering by loudest member"* requires attention to override the place he put a group. Overriding his order for groups and honoring it for buildings would be two laws in one pane, so it is one law at every level: **siblings sort by rank first, by his order inside a rank** (`spaces.arrange`). The consequence is visible and had to be handled: dragging a quiet building above a loud one stores his order and draws the loud one first, which reads as a broken drag. So a drop that lands somewhere other than where he let go **reports why** — *"saved — `<name>` draws above it while it is louder (attention outranks your order)"* — and the pane's footer states the law at rest. The gesture is never refused and never silently ignored; the file always keeps his order, and the day the law changes, his file already says what he wanted. **17 of the live city's 24 buildings share rank 1**, so most drags move something visibly.

**F3 — an id spelled as a character list refused every arrangement the live City could make, and only a probe reading the receipt could see it.** The parse boundary's first cut was `/^[0-9a-zA-Z:._/-]{1,120}$/`. Every derived group id is `g:~/code/<x>` — `~` was not on the list — so `POST /desk/arrangement` answered **400 to the whole tree**, the client printed the refusal into its receipt, and the page still looked right because the client had already drawn its own optimistic copy. The fixture probe missed it (temp paths carry no `~`), and the live probe only caught it at a later assertion. Two rules came out of it, both now built: **an id is a token** — the rule says what it must not be (empty, whitespace, control characters), never which characters a building name happens to use today — and **a probe that drives a write must read the receipt**, because an optimistic redraw and a saved arrangement are pixel-identical. Both probes now assert `[data-out-for="city:arrangement"]` after their first gesture.

**F4 — two spaces minted in the same millisecond in different parents shared an id.** `mintGroup` numbered within its parent list (`s:<ms>-<index>`), so a group made at the root and a group made inside a building both answered `s:<ms>-0`; `findSpace` returns the first match, and an edit aimed at the second landed on the first. Caught by the unit test that writes out his own sketch — district → building → campaign — which mints twice in a row. The id is now unique across the whole tree, and `arrangement.ts` refuses a duplicate at the door regardless.

**F5 — a bound space's name is empty by default, and that is a data decision worth a line.** The first cut copied the building's own name into the space, which meant the 60-character name cap truncated every long building name (`universal_robots_sdk/cap-mega/.claude/worktrees/motion-migration/docs` is
69) and every row then looked *relabeled*, drawing the register's name beside his "label". Empty means *no label of mine*: the row draws the register's name and shows nothing beside it, and `.sp-true` appears only where he has actually written one. One fact, one place.

**F6 — an emptied derived group stays, deliberately.** His first gesture materializes the register's neighborhoods into his file; dragging everything out of one leaves the empty group standing. It is his group now, and a renderer that quietly deleted his containers would be deciding something he did not ask it to decide — `dissolve` is one click, and dissolving lifts children rather than taking them off the City.

**F7 — `desk/city-arrangement.json` is a gitted file this run created** (D17: the desk is gitted, city-wide, and commits are never Belvedere's). It holds his sketch, filed through the deck's own route; two clicks dissolve any part of it. **It is committed on this charge's branch**, so his City is arranged the moment he restarts — which brings F8.

**F8 — his own Belvedere is live on :4477 running pre-B24 code, so the arrangement reaches him on his next restart, and that is also why the live half of bar 1 ran in two pieces.** `POST /desk/arrangement` to the running deck answers `404 no such desk action: arrangement`. The charge's own live server ran on **:4478** and was killed at the end (a second deck left running is B8's own D55-class finding); **his was never touched**. The camera cannot drive a real-desk deck by design — `run` refuses `--port` (C17), and a twin redirects `DESK_DIR` to the scratch drawer (C17 F1) — so the pointer gestures were driven against the real *register* in a twin, and the real *file* was written by a real Belvedere through the same route the drag posts to. Anyone wanting one probe that does both needs a camera contract change, not a workaround.

**F9 — the camera has a `drag` verb now, and it enforces one law: both ends in the viewport.** Pointer events, not HTML5 drag-and-drop — a `dragstart` payload is a negotiation with the OS that no driver can hold, which is why `city.client.ts` builds the drag on `pointerdown/move/up` in the first place. The verb scrolls the drop target into view, then reads both boxes, and **throws by name** when either end is outside the viewport (`a drag needs both ends in the viewport at once: … at y=…`). Without that the first live run failed as a timeout on the target selector, which said nothing; the real answer was that a new empty space sinks to the bottom of a 24-building pane. Anyone driving a drag on a scrolling pane inherits this.

**F10 — C21 F4's legend token was ported forward with its defect, on purpose.** The legend moved from `deck.client.ts` to `city.client.ts` whole, and it still draws `dot s-idle w-blocked` — a class combination the deck never produces (a real blocked session is `s-needs-input w-blocked`). C21 filed it and the board assigned it to **B27 §8**; fixing it in passing would have moved it out from under the sweep that is looking for it. The line carries a comment saying so.

**F11 — the City left `deck.client.ts`.** Context's tenant is now `glass/city.client.ts` (one mount, one signature, one draw, one listener set — B23 §3's law), and the shell keeps the layout, the drawer, the poll and the click chain. `deck.client.ts` fell 1282 → ~1140 lines; the City's own file is ~600 with the arrangement in it. The shell asks the City for its clicks first while arranging, so a click that means *move this space* can never also mean *select this building*.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence,
design laws, agreements; the campaign notes — the sidebar design input sits
in the charge doc's header),
and build ~/code/agents/belvedere/plans/b24-arrangement.md to its
`Done when:`.
```
