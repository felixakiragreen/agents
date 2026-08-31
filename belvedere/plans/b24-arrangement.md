# B24 — his arrangement

**Status:** OPEN (re-laid 2026-08-30 at G5 — City View survives whole, D22 r2;
carried over least changed as the fate clause expected) · **Depends on:** — ·
**Staffing:** Builder · opus-high · **Blessed:** ✓ Felix 2026-08-30 (the rework blessing)

**The sidebar design input (Felix, the blessing 2026-08-30):** he sketched
two models and leans to the second — (A) a fixed taxonomy: District /
Building / Campaign / Offices (his worked example: Felix district → Offices,
Agents→Belvedere, Rooted→Arborist/Repot, Whiteboardy; THG district →
bob→lunchbox/pods/catalog, mega→simmy/snappy/cornerizer/…, speakeasy); (B)
**"spaces"** — *"a space can have optional: color/name/cwd/board/agents/type/
order and nest inside another space. Done."* His own counter-example to (A):
speakeasy is not a campaign, "more like a one-off thing" he wants to keep
around. **Pre-chewed ruling (G5, strike-able at his glance): spaces —**
(A)'s fixed ranks are Belvedere inventing a classification, which spec §4
already forbids; one recursive structure carries his example verbatim, with
`type` a free label ("district", "campaign", "office", or nothing — words he
types, never ranks Belvedere knows). **One trim on his field list:** a space
stores name · color · order · type · children + an optional **binding** to a
building (the cwd); `board`, `agents`, and liveness are what the building register
and census already know about the bound building — derived through the
binding, never stored in the arrangement file (truth underneath, the Goal's
own law). C21 (the gut) runs first; this row arranges the surviving City.

## Goal

Felix's directive (ISSUES 2026-08-28, his ruling): **"I'm going to want to
have the city sidebar be completely customizable by me. Reordered, labelled,
colored, nested, exactly my way."** The City is his space and its ARRANGEMENT
is his — reorder, rename, recolor, nest into his own groupings, not the
filesystem's. **Truth stays truth underneath**: the census still decides what
exists and what is live, attention still outranks recency inside whatever
arrangement he makes, and a building he has not arranged still appears — an
arrangement hides nothing new.

## Inputs — read before building

- ISSUES commit `60b0124` (the ruling, verbatim) and `25ff83c` (candidate 7's
  diagnosis + the repo-vs-campaign ask).
- B14's `drawCity` (the rewrite that lost B9's group-first invariant),
  B9's grouping precedent, B15's reorder (per-viewer localStorage — the
  transitional layer this row supersedes for the City), B19/D17 (`desk/` is
  his drawer; the fence's write class 7), B18/D18 (cmux-side identity —
  distinct layer, see spec §5).
- §3 design laws: encapsulation-first, no dropdowns, the law of space (no
  scrolling), legends on colored views.

## Spec

0. **First act — the scrim (B26 F6, ruled here at the review):** `.app`'s
   `position: relative; z-index: 1` makes a stacking context that traps the
   drawer's `z-index: 30` under the root-level `#scrim` at 20 — Chrome's own
   hit test says the scrim intercepts every queue control (`file it`,
   `bless`, `chat`, B26's `compose`/`copy`). One line — drop the `z-index`
   from `.app`, or move `#scrim` inside `#app` below the drawer — plus a
   probe asserting an OPEN drawer's control actually clicks; then delete the
   two workaround comments (C16's `chat-engine.probe.ts:42`, B26's
   `baton.probe.ts`). Your arrangement controls draw there too.
1. **The arrangement layer is spaces** (his model, the header). One
   recursive structure over the building register: a space carries name · color ·
   order · type (free label) · children, plus an optional binding to a
   building; his sketch (the header) must be expressible verbatim, speakeasy
   included. Rendering rules: attention monotone **inside** his arrangement
   (a space's loudness is its loudest member; recency only inside a rank);
   an unarranged building lands in an unfiled tail he can file from;
   nothing the census knows can be absent from the view; a bound space
   renders its building's badges, board and liveness through the binding
   (derived, never stored).
2. **Persistence (pre-chewed ruling, strike-able at blessing): a desk
   file** — `desk/city-arrangement.json`. His own words ask durability
   across browsers and machines; localStorage is per-browser by
   construction (rejected). The fence needs **no new write class** — the
   Belvedere writes it as a desk file (class 7); commits are never Belvedere's
   (sessions and Felix commit, D17). Editing by gesture on Belvedere writes
   the file; the file is the state (a kill loses nothing — B8's drill bar).
3. **The default view must not lie (candidate 7).** The reported
   split-neighborhood: hypothesis from one code read, unreproduced —
   `drawCity` orders buildings by loudness and the grouping fractures.
   **Verify first** against B14's rewrite; if the invariant genuinely broke,
   restore group-first (cluster by label, then order clusters by loudest
   member — B9's invariant); if it holds, find what his eyes actually saw
   and fix that. Either way the verdict is recorded with evidence.
4. **Repo-vs-campaign becomes vocabulary, not taxonomy.** A campaign is just
   a group he makes; Belvedere invents no classification of its own (the
   G2 design input lands inside his arrangement, free).
5. **Two identity layers, named apart.** His labels/colors here are
   Belvedere-side arrangement vocabulary; B18's rename/recolor write-through
   (D18) is cmux-side session/workspace identity. This row touches only the
   former; Belvedere must render which is which without ambiguity (the
   legend says so).
6. **Law of space holds.** Nesting introduces no page scroll: deep groups
   collapse (encapsulation-first — a collapsed group leads with its name and
   its loudest badge); the editing surface is toggled buttons and drag, no
   dropdowns.

## Done when:

Browser half on the camera (C17) with the fixture city (C19) where a fixture
serves; the live half against the real register; every visual bar's shot Read
and described. Drag-and-arrange interaction probes join the `--probes` suite
(B23's rail).

- [ ] Arrange the live city: reorder two buildings, relabel one, recolor
  one, nest two under a new group of his naming — all four visible on the
  next paint, and `desk/city-arrangement.json` on disk is the arrangement
  (byte-inspectable, human-readable).
- [ ] Kill Belvedere, relaunch, load in a **different browser** — the
  arrangement is identical (the file is the state; nothing rides
  localStorage).
- [ ] A building added to the building register after arranging appears in the
  unfiled tail; filing it by gesture persists.
- [ ] Attention monotone inside the arrangement: a fixture where the quiet
  group holds the loudest building pins group ordering by loudest member;
  badges unchanged by any arrangement (truth underneath).
- [ ] Candidate 7's verdict recorded: reproduced-and-fixed (group-first
  restored, fixture pinned) or refuted with the real cause named and fixed.
- [ ] `git status` after the live run: `desk/` and nothing else; zero
  `<select>`; page scroll 0 px with a 3-deep nest expanded; legend names
  the two identity layers.
- [ ] Suite green in one process, offline type gate exit 0, predecessor
  probes re-run green, `/deck/state` p95 within the landed budget.

## Out of scope

- Arranging anything but the City pane; cmux-side identity (B18's, landed);
  multi-arrangement profiles; sharing/exporting arrangements; auto-grouping
  heuristics of any kind.

## Kill criteria

If nesting genuinely cannot satisfy the law of space at his real city's size
(17+ buildings, his groups), **stop and escalate with the measured geometry**
— never invent page scroll, never cap his nesting silently.

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
