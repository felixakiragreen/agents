# B26 — batons on Belvedere

**Status:** **LANDED** 2026-08-31 — nothing escalated; every bar evidenced below, nine findings,
three of them defects a real page caught that no unit test could (F4 the invisible landing, F6 the
scrim over the whole app, F9 the tier with no field) · **Depends on:** — ·
**Staffing:** Builder · opus-high · **Blessed:** ✓ Felix 2026-08-30 (the rework blessing)

## Goal

Belvedere's attention model learns the baton. Felix's report (2026-08-28): an
agent finished, handed a baton, and "I can't see that anywhere or act on it
anywhere in belvedere." `attention.ts` has no baton bucket, so a
**Felix-holder baton — needs-you class by definition (D15) — raises no City
badge and no queue item.** The v3 world sharpens the ask: the queue already
carries engine-paused steps as the `waiting` class (C16 F4); the baton joins
that same one-computation attention model, never a second one.

## Inputs — read before building

- `glass/attention.ts` (B14 — one computation, two renderings: the City's
  badges ARE the queue's items bucketed; extend it, never fork it) and the
  `waiting` class as C16 landed it (`sid` for the pane jump, `chat` for the
  conversation — a headless step has no pane).
- The doctrine parser's `Baton` shape — `holder`, `kind` (single / batch /
  fork, canon D64), `instruments[]`.
- D10 (ambiguity never arms — ruled 2026-08-27): a collided or unparseable
  holder renders note + copy, zero wiring (B8 made that structural).
- C16 F3's law for the Works half: a step's session is addressed through the
  log's ignitions, never the fold's state.
- B17 (the composer loads a body), B17 F1's sound check (`outerHTML` minus
  `textContent`, plus source and bundle).
- The camera (C17) + fixture city (C19 — beta's fork baton fixtures are
  committed and photographed already); every visual bar ships camera
  evidence.

## Spec

0. **First act — the fixture sids (C21 F3, ruled here at the review):** the
   fixture city's seeded session ids are not uuids and B22's sweep made
   `glass/chat.ts` refuse them (`not a session id: "fixture-nagged"`,
   measured), so no probe can open the Chat on a seeded session. Fix at
   `camera/fixtures/seed.ts` — seeded sids become uuids, the readable name
   stays the name-stamp — and re-run the standing family before building on
   it; every session surface this charge draws inherits the fix.
1. **The bucket.** `attention.ts` gains a baton bucket over the parsed ledger
   tails the building register already carries. Felix-holder ⇒ a needs-you queue item
   + its City badge (attention outranks recency, §3). Session-holder ⇒ the
   rail's Dispatch semantics, D10 collision rules inherited unchanged. Fork ⇒
   Felix-class: the choice rendered with each option's instrument
   **copyable**, never ignited, the recommendation shown.
2. **The affordance is the composer.** A Felix-holder item opens the baton's
   instrument in the composer — copy-is-reading; nothing on this path
   auto-ignites; the composer's ignite button is the only hand, after his click.
3. **The Works closes the loop.** A landed terminal node whose building's
   ledger tail hands a baton says so on the node ("this landing handed a
   baton"), linking to the queue item — the exact gap in his report. The
   node's own identity stays log-derived (C16 F3).
4. One computation, two renderings, kept: a badge can never count a baton the
   queue does not list — and the baton bucket sorts WITH the `waiting` class
   it now shares a queue with, one ordering law for both.

## Done when:

Fixture city (C19's beta carries the fork) + the real corpus; every visual
bar's shot Read and described.

**Item 0 first, as the batch note ordered.** Seeded sids are uuids
(`camera/fixtures/seed.ts` §SIDS — `f1c7…0001`…`0007`, fixed rather than minted so a shot is
evidence); the readable half was always the name-stamp and is untouched. Measured against a
fixture twin, before and after in one run:

```
200 sid=f1c70000-0000-4000-8000-000000000007
   error=null  target=builder-beta-05 / idle  turns=1  marks=2
200 sid=fixture-nagged
   error="not a session id: \"fixture-nagged\""  target=null  turns=0  marks=0
```

The standing family was re-run whole on the fix before anything was built on it:
`bun v3/gates.ts --probes` → **ALL GREEN — 26 gates, wall 449.1 s**.

- [x] A live Felix-holder baton appears as a City badge and a queue item;
  opening it lands the composer holding that baton's fenced summons,
  byte-identical to the ledger's fence (photographed).

  **On the real corpus, because today's grammar puts a fence only on a collided baton** (F1 — a
  parser-`felix` baton carries no instrument at all, by construction). The probe names no building:
  it takes the first queue item that is his by prose, a session's by parse, and whose option's
  source is its own ledger.

```
$ bun camera/cli.ts run probes/baton-real.probe.ts
corpus     15 batons · 2 session-held and uncollided · 4 collided
his        baton + his by prose · agents · 362 chars, found verbatim in LEDGER.md
d10        collision named · 1 copy · 0 ignite wires
composer   362 chars held ≡ the ledger's fence, byte for byte
camera/shots/2026-08-31T04-27-21-628-baton-real-collided.png
camera/shots/2026-08-31T04-27-21-728-baton-real-composer.png
```

  The bytes are checked **against the file on disk**, twice: `readFileSync(item.doc).includes(bytes)`
  before the click, and again on what the composer's textarea holds after it. **Read:** the pinned
  drawer says `50 THINGS NEED YOU`; the item's head carries `BATON` and `HIS BY PROSE` side by side,
  `G4 — found the migration campaign`, `agents  LEDGER.md:2238`, `24h`; under `[expand]` the clause,
  the honest note, the collision paragraph in orange, and then one option — `Architect · fable-max`,
  source `agents/LEDGER.md:2238` — with the fence rendered verbatim (`You are an Architect at
  fable-max. / Enter by the door — read ~/code/agents/canon/GUILD.md, / wear
  ~/code/agents/canon/mantles/architect.md, / then read ~/code/agents/belvedere/README.md (D22), …`)
  and `COMPOSE · COPY` under it. After the click the receipt on the item reads *"366 B loaded as the
  summons — the composer resolves it, and your click is the ignition"*.

  **And the second frame is where F9 is visible:** Focus is the Workshop on `agents` — the baton's
  own building, not whatever the City had selected — Action is open with the fence verbatim in the
  summons box, and the plan above it reads `BLOCKED · no tier: mantle "" has no preset and no
  model/effort chosen`, with the cold-hands reason under it. The bytes arrived; the tier the fence
  names has no field to arrive in. Filed, not built (F9).

- [x] A session-holder baton renders with Dispatch semantics; a
  collided/ambiguous holder renders note + copy with **zero ignite wiring**
  (B17 F1's sound check).

  Both, in the same drawer. `d10  collision named · 1 copy · 0 ignite wires` above is the DOM
  counted through the served page: `#host-drawer [data-ignite], #host-drawer [data-apply]` → **0**,
  and the collision's own sentence asserted to contain *"never arms"*. The two readings are on the
  head at a glance and neither overrules the other (F1).

  The *shape* of the law is pinned in the suite rather than by a string search, because prose that
  happens to say "stamp" must not be able to pass or fail it — `attention.test.ts` §*the queue
  carries a baton's bytes and no ignition*: every `QueueItem`'s key set asserted exactly, every
  `BatonOption`'s key set asserted exactly, `hands/ignite` · `data-ignite` · `data-apply` absent from
  the whole wire, and the bytes proven to live under a baton option and nowhere else.

  Dispatch semantics, on the uncollided session-holder: the item draws `COMPOSE` and `COPY` per
  option and the note reads *"A session holds this baton. Compose loads its summons into the
  composer, where the stamp, tier, venue and trust resolve live and your click is the ignition."*

- [x] A fork baton renders its options with copyable instruments and the
  recommendation; nothing ignites (beta's committed fixture, re-shot).

```
$ bun camera/cli.ts run probes/baton.probe.ts            # the fixture city, hermetic
badges     2 on the City · 2 in the ⬡-queue · one computation
his        Felix’s baton · 0 instruments — nothing to open, and it says so
the fork   fork · 2 options · 1 recommended
d10        0 ignite wires in the drawer · 2 compose · 2 copy
composer   201 chars held ≡ 201 shown · action opened to "t" · 0 ignite buttons on cold hands
space      page scroll 0 px · content 900 ≤ viewport 900
camera/shots/2026-08-31T04-23-39-882-baton-queue.png
camera/shots/2026-08-31T04-23-39-965-baton-composer.png
```

  **Read:** beta's item leads `BATON` · `FORK` · `B1 — ignite B2 or ignite B3`, and under it the
  clause, the fork note, then two option blocks — `charge B2 — Digger · sonnet-high` wearing
  `RECOMMENDED` with source `beta/plans/b2-cheap.md:27`, and `charge B3 — Builder · opus-high` at
  `beta/plans/b3-whole.md:28` — each with its four-line fence in mono and `COMPOSE · COPY` under it.
  Alpha's `FELIX'S BATON · A6 — the ⬡-gate on A6` carries `OPEN` and nothing else, because there is
  nothing to open and the note says so. The recommendation is aimed at by the pill it wears, never
  by its position.

- [x] The Works' landed terminal node surfaces the handed baton and jumps to
  the queue item.

```
the works  1 landed terminal node says it handed a baton · the jump landed on "G4 — found the migration campaign"
camera/shots/2026-08-31T04-27-21-897-baton-real-works.png
```

  Exactly one of `c10/rehearsal`'s three landed nodes is terminal and exactly one carries the
  sentence (`.graph .node[data-ring="landed"] .handed` → 1), and the click is asserted to land on
  **that building's own** baton key, not merely on something. **Read:** `plan landed done` ·
  `ask landed done` · `hold landed done`, and only `hold` wears `THIS LANDING HANDED A BATON` in
  blue; the tooltip under it reads `G4 — found the migration campaign — open it in the ⬡-queue`; in
  the drawer the G4 item now wears the yellow aim, opened, with the fence and `COMPOSE · COPY`
  under it. The node's own identity stays log-derived (C16 F3) — the sentence is drawn beside it and
  claims no causation (`works.client.ts` §terminal).

- [x] Ordering holds: a Felix-holder baton outranks a merely-recent building;
  baton and `waiting` items interleave under one attention law (fixture
  pinned, B14's pattern).

  `RANK` gives `baton` and `waiting` **the same number**, so the date orders them against each other
  — one law for both, never a second. Pinned three ways in `attention.test.ts`: a baton newer than a
  blocked session takes the top and an older one sorts under it (the same corpus, the session's
  clock moved); every item above the first gate/blessing/escalation is one of the two classes and
  none of the two appears below it; and `cityRows`'s `badges.baton` is asserted equal to the queue's
  own count per building, so a badge can never count a baton the queue does not list.

  In the pixels (the fixture shot): `BLOCKED ON YOU · digger-alpha-02` at 86 s, then
  `FELIX'S BATON · A6` and `BATON · FORK · B1` at 24 h, then the two `GATE` items — attention across
  ranks, recency inside one. The City's rank is v0's `attentionOf` untouched, where a Felix-holder
  baton already sat at "his pen" above anything merely fresh; what B26 adds there is the badge.

- [x] An interaction probe for the composer-open path joins the `--probes`
  suite (B23's rail).

  `camera/probes/baton.probe.ts`, added to `camera/probes/standing.txt` — the fixture world, so it
  declares its own (C19 F5) and reads nothing another process writes. Its fourth act is the
  composer-open path end to end: the option's bytes read off the page, clicked, and the composer's
  textarea asserted **identical** to them, plus the pane it filled asserted open and the cold-hands
  ignite button asserted absent. **Seen to fail** — with the pane-opening line removed it times out
  on a `textarea.summons-in` that resolves `24 × … hidden`, which is the defect F4 records.

  `baton-real.probe.ts` is committed and deliberately **not** standing: it reads the city's ledgers
  and the engine's telemetry root, which is `works-v3.probe.ts`'s own reason (B23 F12). The rule is
  written into `standing.txt` beside it.

- [x] `bun v3/gates.ts --glass` ALL GREEN; predecessor probes green;
  `/deck/state` p95 within budget; budget **0 real turns**.

  Run whole, `--glass --probes` in one pass, so the deck suite, the barrage and every standing probe
  answer together:

<!-- GATES -->

  Cost, on a live deck against the real city (`bun lab/b26/cost.ts`, N=20 spaced):

```
GET /deck/state  n=20 min=80.3 p50=83.6 p95=280.2 max=280.2 ms   (bar 500 ms)
payload          78 580 B · queue 50 items · 15 batons · baton wire 16 545 B
readBaton ×15    0.09 ms per snapshot (warm page cache)
needsYou whole   10.7 ms · 50 items
```

  **Budget 0 real turns, spent 0** — nothing in this charge ignites a session. The one page in it
  that can (the composer) was driven against a **disarmed** twin, and the probe asserts the ignite
  button was not drawn.

## Out of scope

- Auto-firing anything (forever-class); changing the baton grammar (canon's);
  the queue's non-baton classes (landed at C16).

## Findings

*(evidence-grade: every claim carries the command and output that proved it)*

**F1 — the spec's Felix-holder-with-a-fence does not exist in today's grammar, and the D10 collision
is what it meant.** `classifyBaton` gives the instrument precedence: an entry carrying a fence or an
`ignite <id>` is a **session** baton, and `holder: 'felix'` is returned only when there is no
instrument at all. So a parser-`felix` baton has, by construction, nothing to open — and spec §2's
*"a Felix-holder item opens the baton's instrument in the composer"* names a shape the parser cannot
emit. Measured over the whole live register (`bun lab/b26/cost.ts`, and the probe's own read):

```
15 batons · 9 holder=felix (0 instruments, every one) · 6 holder=session · 0 dropped
of the six: 4 collide (the clause names Felix) · 2 are session-held and uncollided
```

The clause the charge was describing is B3 E2's collision — *"Felix's Phase-1 acceptance ruling —
PENDING … On a pass, ignite: ⟨fence⟩"* — his by prose, a session's by parse. **Built to that
reading**, and both halves are on the item: the pill carries the parser's word (D65 — the holder
stays exactly what `doctrine/` said) and a second pill reads `HIS BY PROSE` beside it, with the
collision note under `[expand]`. Nothing on the path arms: the composer's own button, behind his
click and behind the credential, is the hand (§2's own law). The field ask — a holder the grammar
can state without inference — is canon row 20's and is unchanged by this charge.

**F2 — the needs-you queue now lists nine batons that say nothing is owed, and no field can tell
them from the three that do.** The bucket is honest and the corpus is not: of the nine
Felix-holder tails, six say so in their own prose — `nothing waits`, `nothing here is ignitable`,
`unchanged`, `nothing owed inside manny` — while three are real asks (`ignite batch 6` on his word;
a ⬡-gate that is his; a checkout only he may remove). The queue grew 35 → 50 items, and two of the
four batons visible in the landing shot read *"nothing waits"* and *"nothing here is ignitable"*.

A render-side "is anything owed?" detector was **considered and refused**: a false positive there
hides a baton, which is the exact blindness this charge exists to kill, and README §1 forbids
fattening the reader to absorb it. What holds the noise down instead is structural — the class
shares `waiting`'s rank and sorts by recency inside it, so a closed building's year-old tail sinks.
**This is the fourth filing of one ask** (B3 F4/F5 wanted `Baton.kind`, B9 F1 a name field, B14 F2 an
escalation field): the ledger tail needs a way to say *nothing is owed* that is not the absence of a
word. Until it has one, the honest render is the one that shows them.

**F3 — a baton was the one queue class with no id, and without one six items named themselves
"unchanged".** Every other class leads with an id and falls back to it where the text wrote no
≤6-word head (`title()`); the baton had none, so `encap()` handed back the whole clause — three
items put 400 characters into a drawer row and six collapsed to the word `unchanged`. The id that
was already there is the **entry's own row** (§7's ledger head, `LedgerEntry.row`), which names the
charge that just landed and handed this on:

```
before   unchanged · unchanged · unchanged · `, and `unrecorded.` written where a clause never …
after    C30 — unchanged · BL-6 — nothing waits · G4 — found the migration campaign · C21 — B26, then B24, then B27
```

Two tails still fall through, both because they name no row, and one of those is the mis-split in
F5. The general rule for anyone drawing a ledger tail anywhere: **lead with `ledgerTail.row`.**

**F4 — a click that loaded the composer left the pane it filled shut, and the aim it wrote was
invisible to the repaint gate. Both were mine and both are fixed at the cause.** The compose path
swapped Focus to the Workshop and left Action at `minimal`, where `.summons-in` is `display: none`
(`deck.css:546`) — so the bytes landed in a box nobody could see and the button read as dead. It now
opens Action to `typical` **only when it was closed**, so a viewer who chose a size keeps it. The
second is C15 F3's law arriving on cue: `queue.show()` set `aimed` and called `drawDrawer()`, whose
signature is `[layout.drawer, snapshot.queue]` — unchanged by a jump — so `paint()` rebuilt nothing
and the jump landed on an item that never lit. `aimed` now rides the signature. **The general rule:
any client state a jump writes belongs in the signature of whatever draws it, or the jump is a dead
button.**

**F5 — two of the city's fifteen tails hand a `next` clause that begins mid-sentence.** A ledger
entry whose *body* mentions the marker splits on that mention:

```
$ doctrine parse … spacex-dashboard-c2
next: "`, and `unrecorded.` written where a clause never existed. Lint **20 → 0**. Decided: nothing
       new — the sweep executes D71. Next: nothing is ignitable here; the …"
the body says   "…two entries' `Next —` batons retyped `Next:`, and `unrecorded.` written where…"
```

`manny`'s tail has the same shape. Both parse `felix` anyway (the mis-split half still contains
"Felix"), so nothing is mis-armed today — but the clause's text, its name and its holder are all
read off bytes the writer did not mean as the Next clause. Filed to `ISSUES.md`, not fixed:
`doctrine/` is the Standards Office's, and the parser never fattens render-side (README §1).

**F6 — an OPEN drawer cannot be clicked, and every queue control has been behind a scrim since
B13.** `.deck .app` is `position: relative; z-index: 1` — a stacking context — so the drawer's
`z-index: 30` is scoped inside it while `#scrim` is a root-level sibling at `20`, and the scrim
paints above the whole app. Chrome's own hit test, verbatim from this charge's first probe run:

```
- attempting click action
  … element is visible, enabled and stable · scrolling into view if needed · done scrolling
  <div id="scrim" class="scrim"></div> intercepts pointer events
- retrying click action     (× 22, ten seconds, then the timeout)
```

It is not B26's — the note box, `file it`, `bless`, `jump to pane` and `chat` are all behind the
same scrim and have been since the drawer was built — and C16's probe worked around it in a comment
without naming the cause. **Named here with the cause and the one-line fix** (drop `z-index: 1` from
`.app`, or move `#scrim` inside `#app` below the drawer), filed to `ISSUES.md`, and both of this
charge's probes pin the drawer, which draws no scrim. B27's sweep or the tender's call.

**F7 — what the bucket costs the poll, and where the bytes go.** A `row` instrument is a real file
read plus a kickoff parse, on the request thread, every three seconds — B8 F3's law is the one to
answer, so it was priced rather than assumed (`bun lab/b26/cost.ts`, N=20 spaced 150 ms, live city):

```
GET /deck/state  n=20 min=80.3 p50=83.6 p95=280.2 max=280.2 ms   (bar 500 ms)
payload          78 580 B · queue 50 items · 15 batons · baton wire 16 545 B
readBaton ×15    0.09 ms per snapshot (warm page cache)
needsYou whole   10.7 ms · 50 items
```

The compute is free; the **bytes are not** — 16.5 kB of every snapshot is now instrument text the
drawer shows only on `[expand]`. That is inside B13 F5's budget (C16 measured a 252 kB payload with
`?b=&s=`) and it buys the byte-identity the charge asked for: what the composer receives is what the
ledger wrote, proven page-side against the file on disk. If a later charge wants it back, the shape
is already right — `options[].summons` is the one field to fetch on demand.

**F9 — the composer receives the bytes and lands BLOCKED, because a summons names a tier and the
draft has no tier axis. Named, not built: it is a contract change.** The landing shot is the
evidence — the composer holding `agents`' fence verbatim, and above it:

```
SUMMON  [BLOCKED]     no tier: mantle "" has no preset and no model/effort chosen
```

The fence's own first line says `You are an Architect at fable-max.` (D45), and `BatonOption` knows
it: `readBaton` resolves each instrument's `mantle` and `tier` and the rail composes an ignition
from exactly those. The deck's composer cannot take them. `ComposeDraft` carries `mantle`, `model`
and `effort` as three separate knobs and **no tier**; the tier is the server's own derivation
(`tierParts`), and `compose.with(summons)` — B19's seam — passes text and nothing else. So the two
honest roads are both somebody else's:

  - **seed the mantle alone** — wrong, and silently: the mantle chip's preset for Architect is
    `fable-high` while this fence says `fable-max`, so the composer would resolve a tier the summons
    does not name, which is the ignition-composed-from-the-DOM class B17 §1 exists to forbid;
  - **give the draft a tier axis** (or let `compose.with` carry resolved knobs, and let the server
    resolve the tier as it already does for the rail) — correct, and a change to
    `POST /deck/compose`'s contract and to the `compose.with` seam the desk also uses.

Nothing is lost meanwhile: the bytes are there, byte-identical, and one chip-click composes them —
but a dispatch that lands on a blocked plan is half a dispatch, and this is the half. **B27's sweep
or the Architect's**; the data is already on the wire's own shape one field away.

**F8 — `noBadges` was written out twice, and that is how the fifth class arrived half-drawn.** Two
hand-written literals (`attention.ts`, `deck.ts`) each listed the four classes, so adding one to
`ATTENTION` left both short a key — the type gate caught it in five places, including two test
files. It is now one exported helper derived from the list itself. Small, and the shape of the bug
is the point: **a closed set with a hand-written companion is a closed set that will disagree with
itself.**

## Kill criteria

None. A holder the D63/D64 grammar cannot classify renders unarmed with the
note (D10) and the parse gap files to findings — the parser never fattens
here (README §1).

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence,
design laws, agreements; the campaign notes) and
~/code/agents/belvedere/plans/c16-chat-chapter.md (findings — F3/F4 bind the
queue half),
and build ~/code/agents/belvedere/plans/b26-baton-attention.md to its
`Done when:`.
```
