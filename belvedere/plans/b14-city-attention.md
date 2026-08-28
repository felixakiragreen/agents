# B14 — the City + attention

**Status:** **LANDED** 2026-08-27 · **Depends on:** B13 · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel, ✓ Felix 2026-08-27; this order applies §§3–4
(D15).

## Goal

The Context pane earns its rent and the waiting-input blindness dies twice
(D15): the City as the deck's sidebar — every building, grouped, live dots,
attention badges, pulsing what needs Felix to the top — and the drawer's
default tenant, the **needs-you queue**, ranked and answerable in place.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §§3–4; D15's exact wording (README §7).
- v0's `pages.ts` city grouping + `attentionOf`/`freshness` (B9) — the
  ranking law exists; port it, don't reinvent. The auditor delta line
  survives into the City's footer.
- The census waiting signal: P1's law — `Stop` is the idle edge;
  `PermissionRequest` events mark blocked-on-approval; `Notification` is an
  interactive-only nag. A session whose last event is `PermissionRequest`
  (or `Stop` while its lane expects input — the B6/B3 gate sources) is
  *waiting*.
- B6's inbox gestures — countersign/note wiring the queue reuses; B3/B8's
  D10 law — nothing here ever arms a fire.

## Spec

1. **The City (Context tenant).** Buildings grouped by `~/code/<x>`
   neighborhood (v0 law), each row: encapsulated name, live dots (census),
   attention badges (counts by class: waiting-input · Felix-gates · pending
   countersigns · escalations). **Attention outranks recency across the
   whole pane** — a building with any badge sorts above every quiet one;
   recency orders only within a rank (standing law, extended). States: 
   minimal = neighborhoods + dots only; typical = + badges; expanded = +
   per-building session lines. Clicking a building → its Workshop focuses
   (B15 registers the view; until then, the click stores the selection and
   the placeholder names it — honest, not dead).
2. **Waiting-state.** From the census per the input law above; a session
   waiting renders its dot in the waiting style (distinct, legend-carried)
   everywhere dots appear.
3. **The needs-you queue (drawer tenant).** One ranked list across the city:
   waiting sessions · live Felix-gates (board parse) · pending countersigns
   (decision queue) · escalation-marked landings. Each item: encapsulated
   title, age, and its in-place answer — countersign → the B6 gesture wire;
   a gate/escalation → note gesture + jump; a waiting session → jump (send
   arrives with B16; the item says so honestly). D10 binds: no item ever
   carries fire wiring; ambiguous parses render safe with the conflict
   named.
4. **Header count.** The deck header carries the queue's total — visible at
   rest even with the drawer closed.

## Acceptance criteria — the DoD

Two harnesses, because two different things are being proven: `lab/b14/probe.ts` drives a
**fixture** city so the ranking law is asserted deterministically, and `lab/b14/live.ts`
drives the **real** register and the **live** census with a **real fired session**.
Everything that is a pure function is in `glass/attention.test.ts` instead.

```
$ bun belvedere/lab/b14/probe.ts        (Chrome 1600×900, fixture city, temp census)

PASS  the City renders every register building, grouped — and the gate badge sorts above the NEWER quiet building
      one neighborhood "…/city/nb" · order [loud, quiet]
      loud badges ["gate:1","countersign:1","escalation:1"] · quiet badges []
      recency control — quiet README 2026-08-28T00:18:59Z · loud README 2026-08-27T00:18:59Z (quiet is 24 h newer and still lost)
PASS  a permission prompt reaches the City AND the queue inside one poll — the blindness, dying twice
      census line appended at 2026-08-28T00:19:00.735Z — seen in 2736 ms (poll 3000 ms)
      {"t":1787876340.734,"ev":"Notification","sid":"probe-blocked","why":"permission_prompt",…,"cwd":"…/nb/quiet"}
      dots .w-blocked 0 → 1 · waiting items 0 → 1 · header needs 3 → 4
      the City re-ranked: [loud, quiet] → [quiet, loud] · quiet's waiting badge "1"
      dot title "probe-bl · blocked · 3s ago" · queue item "probe-bl — blocked on a permission prompt"
PASS  the queue is one ranked list across the city — waiting, gates, countersigns, escalations
      4 items in DOM order: waiting → gate → countersign → escalation
PASS  a pending countersign is answered in place — one append, byte-identical prefix
      BEFORE 570 B sha256 3d811b068630876f · AFTER 629 B sha256 26618aaec19b7db6
      AFTER's first 570 bytes are byte-identical to BEFORE: true
      appended: "\n- 2026-08-27 · Felix (via Belvedere) · countersign D99: ✓\n"
      the card said: "filed · - 2026-08-27 · Felix (via Belvedere) · countersign D99: ✓"
PASS  and the card re-reads itself off the bytes: pending → recorded, the button gone
PASS  ZERO fire wiring anywhere in the City or the queue — in the DOM and in the served bundle (D10)
      DOM: 0 of [data-fire, data-apply, data-worktree, data-summons]; "hands/fire" appears 0× in the whole document
      /deck.js is 22831 B and contains "hands/fire" 0× (it carries /inbox and /hands/focus, and nothing else)
      every button in the two panes: ["jump to pane","file it","file it"]
PASS  the legend carries the whole dot and badge vocabulary, and the count is readable with the drawer shut
      drawer display:none · header count "4" 5.52 px wide
      9 legend keys: working | idle | unknown | blocked — a permission prompt is waiting |
      waiting for your input — the session said so | blocked on you | Felix-gate on a live row |
      decision waiting on your pen | escalation raised, nothing says it was ruled
PASS  a half-typed note survives the polls that redraw around it
      after a census change and 3600 ms of polling: textarea still open, still focused, value "half a thought about the gate"

ALL GREEN
```

```
$ bun belvedere/lab/b14/live.ts         (Chrome 1600×900, the REAL ~/code register + the LIVE census)

PASS  `/deck/state` p95 under B3's protocol, with the whole live City on it
      n=20 spaced 2 s · min 51 ms · p50 91 ms · p95 135 ms · max 135 ms (bar 500 ms)
      snapshot 52271 B — 22 buildings · 63 sessions (12 live) · 35 in the queue
PASS  the page body still never scrolls — all 27 combinations, drawer shut AND pinned, on the LIVE city
      54 combinations walked against 22 buildings and a 35-item queue;
      worst (scrollHeight − viewport) = 0px, viewport 900px
PASS  a real haiku fire stalls on a real permission prompt, and the census sees it (P5 F1/F3, live)
      fired workspace:48 · sha f74cb30680becead · 136 B summons, at 2026-08-28T00:36:44.621Z
      stalled at 2026-08-28T00:36:57.996Z — 13.4 s after the fire
      {"t":1787877417.991118,"ev":"Notification","sid":"5ddb9281-5407-4910-829d-a1e41fd6aa31",
       "acct":"/Users/felix/.claude","ws":"B551EE79-…","sf":"3958C3AC-…","pid":"70270",
       "cwd":"/Users/felix/code/agents/belvedere/lab/b14/scratch","tp":"…/5ddb9281-….jsonl",
       "pmt":"e516c340-…","mode":null,"tool":null,"why":"permission_prompt","bg":[]}
      beats this session wrote: SessionStart:— · UserPromptSubmit:default · PreToolUse:default · Notification:—
PASS  the live deck shows it: a waiting dot in the City, a badge on its building, an item in the queue
      on screen at 2026-08-28T00:37:00.411Z — 2.4 s after the census line
      our dot is on "agents/belvedere", City row 2 of the pane, and every row above it also carries a waiting badge: true
      the block, top-down: agents → agents/belvedere
      waiting badge "1" · headline "5 blocked on you" · header needs "36"
      queue item "b14-waiting-probe — blocked on a permission prompt" — agents/belvedere/lab/b14/scratch
PASS  venue restored — the workspace closed, the scratch dir gone, `git status` unchanged
      closed workspace:48: OK workspace:48
      git status --short is byte-identical either side: true

ALL GREEN
```

The stall's full signature, off the live census — P5 F3's permission stall, reproduced by the
glass's own hand: `SessionStart` → `UserPromptSubmit mode:default` → **`PreToolUse Write
mode:default`** → *(no `PostToolUse`)* → `Notification permission_prompt`, 6.1 s later.
Reproduced N=2 (`workspace:46` and `workspace:48`, 8 minutes apart), on screen in **2.8 s** and
**2.4 s** of a 3 s poll.

**The ranking assertion is the law, not row zero.** The live city had *two* buildings at the
waiting rank when this ran — `agents` (its own blocked session) and `agents/belvedere` (ours) —
and which of the two leads is recency ordering *inside* one rank, exactly as the law says. An
earlier run asserted "our building is row 0" and failed on that race with the deck behaving
correctly; the assertion now reads what the law actually claims: **every row above ours also
carries a waiting badge.**

**What the live city looked like while this ran** (the same snapshot, read out):

```
queue 35 — {"waiting":4,"gate":30,"countersign":1,"escalation":0}
City, top of the pane:
  -1  agents                          live 6  {waiting:1, gate:3, countersign:1, escalation:0}
  -1  universal_robots_sdk/bob        live 5  {waiting:1, gate:0, countersign:0, escalation:0}
   1  agents/belvedere                live 0  {waiting:0, gate:1, countersign:0, escalation:0}
   1  …/campaigns/theseus             live 0  {waiting:0, gate:12,countersign:0, escalation:0}
```

Two things worth reading there. **The one live countersign is D21, and it renders `folded`** —
B6 F2's false positive, still the city's only queued decision, and the queue names which
reading won instead of offering a button. And **four sessions were waiting for input** across
the city at that instant, every one of them by the `idle_prompt` edge — the notification Felix
has been getting from cmux with nothing to show for it in Belvedere. That is the blindness,
measured, in the moment before it died.

- [x] **City renders all register buildings grouped; a building given a fixture gate badge
  sorts above a quiet building with newer activity.** Asserted in Chrome (above) and in the
  suite: `loud` (gate + countersign + escalation, mtime −24 h) at rank 1, `quiet` (nothing,
  mtime now) at rank 4, `rows[0].fresh < rows[1].fresh` — it lost on recency and won anyway.
- [x] **A live waiting session shows the waiting dot in the City AND an item in the queue
  within one poll interval.** Fixture: **2 736 ms** of a 3 000 ms poll, census line and DOM
  timestamped. Live: a real haiku·low session fired through `/hands/fire` into a scratch
  subdir of `~/code/agents`, stalled on a real permission prompt, on screen **2.8 s** after
  the census line — the run above.
- [x] **Queue: one pending countersign answered in place lands the B6 gesture append.** The
  live city has **zero true pending countersigns** (B6 F2 measured it; still true), so the
  wire is proven on the fixture decision `D99` and the absence is named: byte-identical
  prefix, one bullet appended, and the card re-derived itself `pending → recorded` off the
  bytes on the next poll.
- [x] **Zero fire wiring anywhere in City or queue.** Structurally, three ways: the served
  shell (`deck.test.ts`), the live DOM, and the **served bundle** — `/deck.js` carries
  `/inbox` and `/hands/focus` and the string `hands/fire` zero times.
- [x] **Legend carries the dot/badge vocabulary; header shows the count with the drawer
  closed.** Nine keys; `#drawer` computed `display:none` while `#needs` reads `4` at
  5.52 px wide.
- [x] **Suite green one process; type gate exit 0; `/deck/state` p95 under B3's protocol
  < 500 ms with the City live.** See below.

```
$ bun test belvedere/glass
 344 pass · 0 fail · 869 expect() calls · 12 files · 659 ms

$ cd belvedere/glass && bunx --offline tsc --noEmit
(exit 0)

$ bun belvedere/lab/b13/probe.ts        # B13's whole DoD, re-run against the rewritten client
ALL GREEN — 12/12, including the 27-combination no-scroll walk and the pinned drawer
```

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b14-city-attention.md,
and build it to its DoD.
```

## Out of scope

- The Workshop itself (B15); send-to-session (B16); rename/recolor controls
  (B18).
- Any new attention source beyond the four named classes.

## Findings

**LANDED 2026-08-27 — nothing escalated.** The Context pane is the City, the drawer is
the needs-you queue, and the waiting-input blindness dies in both places off one
computation ([`glass/attention.ts`](../glass/attention.ts)) — the badges are the queue's
own items, bucketed, so a badge can never count something the queue does not list. Eight
findings, none blocking; the escalation class is honest and currently **empty city-wide**,
which is itself the measurement.

### F1 — `PermissionRequest` is a real hook event, and the census is not subscribed to it

The order's input law says *"`PermissionRequest` events mark blocked-on-approval"*. P1
mapped ten events and that is not one of them — so the naive reading is that the order
names an event that does not exist. It is the other way round, and P5 proved it while this
row was building: **cmux's own per-session `--settings` blob subscribes to it.** Read
verbatim off a live spawned session's argv (P5 F1):

```
{"preferredNotifChannel":…,"hooks":{"SessionStart":[…],"Stop":[…],"SubagentStop":[…],
 "SessionEnd":[…],"Notification":[…],"UserPromptSubmit":[…],"PreToolUse":[…],
 "PostToolUse":[…],"PermissionRequest":[…]}}
```

Nine keys, and `PermissionRequest` is the ninth. What B1 deployed is ten, and it is not
among them:

```
$ jq -r '.hooks | keys | join(" ")' ~/.claude/settings.json
Notification PostToolUse PreCompact PreToolUse SessionEnd SessionStart Stop
SubagentStart SubagentStop UserPromptSubmit
```

So the glass's only permission signal today is `Notification` with
`notification_type: permission_prompt`, which P1 measured arriving **~6 s after** the
blocked `PreToolUse` and **only in interactive sessions**. `waitingOf()` reads that, because
it is the signal that exists.

**What this is worth:** subscribing the census to `PermissionRequest` would give the deck an
*immediate, unambiguous* blocked edge instead of a six-second-late inference — and it would
work headless. That is a change to `census/beat.sh` + `deploy.ts` and a **Felix-run ×3
ritual** (B1's ground, D14's permission guard), so it is filed here and not built. It is
also the cheapest thing on the list: one more hook key, one more `ev` value the reader
already handles generically.

### F2 — the escalation class has no field, its reader has two measured false positives, and the live city has zero

Three things, in the order they bit:

1. **A status annotation arrives stripped.** `grammar.ts`'s `strip()` removes every `**` and
   backtick from the cell before `parseStatus` splits it, so the corpus's `**E1 — …**` is
   `E1 — …` by the time the glass sees it. A reader written against the markdown matches
   **nothing at all** — caught by the fixture on the first run, not by reasoning.
2. **`E<n>` is nobody's reserved namespace.** Over all **458 board rows in 22 buildings**,
   the first honest reader produced exactly two hits and both were wrong:
   `whiteboardy/docs/m1-editor.md` staffs thirteen rows literally named `E1…E13`, so its
   `E4 — …` is a row reference; and cornerizer wrote *"all 4 escalations ruled at the
   2026-08-15 review (D11, **E1–E4** — §6 fold, log)"*, where `E4` is the far end of a
   range. Both are fixed at the cause and generally — an id that names a row on this
   building's own boards is a reference (the same test `parseDependsOn` already applies),
   and an id preceded by a dash is a range — with **no per-repo branch**.
3. **The result is zero.** After both fixes: `22 buildings · 458 rows · 0 unruled
   escalations · walk 9 306 ms`. Every escalation the city ever raised was ruled, and
   Belvedere's own board is where the whole convention lives. So the class is real,
   correct, and **has no live instance** — the same shape as B6 F2's countersign, and the
   reason `lab/b14/city` carries a fixture that raises one *and* a control row that raises
   and rules one.

**The real fix is a field, not a regex** — the third time this row has been filed (B3 F4/F5
wanted `Baton.kind` and a branch field, B9 F1 wanted a name field). An escalation is prose a
Builder wrote into a landing record; the parser cannot recover what nobody wrote. Until
then the cost of a miss is one queue line and never a misfire: nothing in the queue arms
anything.

### F3 — `default` mode auto-approves a read-only Bash call; P5 F3's wording is exact and the shortcut is not

P5's relay says a haiku session *"stalls at its first side-effecting Bash call"*. Read
loosely — "any Bash call" — it is wrong, and this row measured that by ordering the stall
and not getting it. The first live fire's summons was `echo b14-waiting-probe`:

```
$ jq -c 'select(.cwd|test("b14/scratch"))|{t:(.t|todate),ev,why,mode,tool}' census.jsonl
{"t":"2026-08-28T00:22:46Z","ev":"SessionStart","why":"startup","mode":null}
{"t":"2026-08-28T00:22:46Z","ev":"UserPromptSubmit","mode":"default"}
{"t":"2026-08-28T00:22:49Z","ev":"PreToolUse","mode":"default","tool":"Bash"}
{"t":"2026-08-28T00:22:51Z","ev":"PostToolUse","mode":"default","tool":"Bash"}
{"t":"2026-08-28T00:22:57Z","ev":"Stop","mode":"default"}
{"t":"2026-08-28T00:23:57Z","ev":"Notification","why":"idle_prompt"}
```

`mode:default` throughout — P5 F1 confirmed live, third party — and **no permission prompt**:
`echo` has no side effect, and `default` waves it through. A `Write` is the inducer. For
anyone else who needs to *manufacture* a stall (the engine's alarm tests, B11's fire gate),
the recipe is haiku·low + a tool call that writes.

Second thing that fire proved, unasked: the session went `Stop` and then, sixty seconds
later, `Notification idle_prompt` — **the second waiting edge, live**, and it is exactly the
notification Felix said cmux was giving him with nothing to show for it in Belvedere. The
deck renders it distinctly (`w-nagging`, amber) from a blocked one (`w-blocked`, red).

### F4 — B13's snapshot diff could never short-circuit, and the deck now repaints by region

`deck.client.ts` held `if (body === lastBody) return;` and B13 F5 read that as *"an idle city
redraws nothing"*. It cannot be true: `deckState()` stamps `at: Date.now()/1000` and
`register.ageSeconds` into every snapshot, so **no two responses are ever byte-equal** and
the whole deck rebuilt on every 3 s poll. Harmless for B13's placeholders. **Not harmless
here** — the drawer holds a `<textarea>` Felix types into, and an unsent note eaten by a
poll is the copy-paste hell the deck was commissioned to end.

Replaced rather than patched: each region carries a **content signature** (its own pane
state plus the data it draws, wall clocks excluded) and is rebuilt only when that changes;
ages are `<span data-at>` and a separate tick rewrites them. Drafts, open disclosures and
filed-receipts are keyed by the queue item's stable `key` and survive a rebuild anyway, and
the caret is restored. Proven in Chrome: a half-typed note survives a census change plus
3.6 s of polling, still open, still focused, value intact.

### F5 — the auditor delta got a TTL, because the deck is the first thing that polls

B9 F3 measured `ps -axo command=` at **36 ms of the request thread** and named a TTL as the
fix *"if it ever matters, named not built"*. A three-second poll is when it matters — and
the count also moves constantly, which alone would defeat F4's signature repaint and rebuild
the City forever. `deck.ts` holds it for **30 s** and the snapshot carries `auditor.at`, so
the page prints how stale the number is rather than implying it is current.

### F6 — `lab/` is outside the offline type gate, deliberately, and now carries two browser probes

`belvedere/glass/tsconfig.json` includes `*.ts` and `../../doctrine/**/*.ts`. B13's
`lab/b13/probe.ts` and this row's `lab/b14/{probe,live}.ts` are therefore **not
type-checked** — `lab/` is disposable code by DOCTRINE §3 and B13 set the precedent, so this
row did not widen the gate. Named, not changed: it is a one-line `include` if the Architect
wants the DoD harnesses under the same gate as the glass.

One trap the harness now guards, because it cost a run: **a leftover glass on the probe port
is silent poison.** The first run of `lab/b14/probe.ts` died before its cleanup, the second
run's server failed to bind, and Chrome connected to the *previous* run's glass — reading
the previous run's fixture city while every assertion "passed" against data this run never
built. Both probes now preflight the port and refuse, and the whole run sits in one
`try/finally`.

### F7 — a waiting session that houses in no building is in the queue and in no badge

Two of those four were `speakeasy-01` and `architect-cornerizer-10`, whose cwds sit in no
building the register found (B2 F2's class: the boards live in `cap-mega/docs`, `/simmy`,
`/snappy`, so `cap-mega` itself is not a building). The **queue is the complete list** and
lists them, labelled `off the register`; the **City is per-building** and structurally cannot
badge them. Nothing is hidden — the item names the condition and offers the jump — but the
ambient half of D15 is only as complete as the register is. This is B2 F2 arriving in a second
place, not a new defect, and the fix is the same doctrine question it always was.

### F8 — the E1 ruling's content half now runs twenty times a minute, and it is the poll's biggest single cost

G1's ruling is that **content is never cached** — every board row, ledger tail, decision and
issue is re-read and re-parsed per request — and it was written for pages Felix opens by hand.
`/deck/state` is the first thing in the city that asks for it **on a timer**. Measured on the
live register, N=12 each, off the request thread:

```
readCensus()  — tail + kill -0 + per-session transcript stamps   median   8.7 ms
register()    — the held copy (B8 F3's warm path)                median   0.0 ms
city()        — register + every building's content re-read      median  31.5 ms
needsYou()    — the whole queue, four classes, 22 buildings      median   8.0 ms
cityRows()    — the City                                         median   0.2 ms
                                       22 buildings · 64 sessions (12 live) · 35 queue items
```

So one poll is ~48 ms and **two thirds of it is the doctrine re-parse**, which at 3 s intervals
is about **1.0 s of Bun's single JavaScript thread per minute** for as long as a deck is open.
Today that is comfortable — p95 135 ms against a 500 ms bar — and B8 F3's worker law is intact
(nothing here walks). But **it is a standing cost the ruling never priced**, and B15, B17 and
B18 all widen the same read rather than opening their own endpoints, by B13's design. This row
built nothing against it and asks for nothing: caching content would retire the ruling, which
is the Architect's call and not a Builder's. Named, with numbers, so the call can be made on
them.

### Residue, named not scrubbed (B7 F6's precedent)

Four `b14-waiting-probe` fires sit in `summon/log/census/hands.jsonl` and one
`b14-waiting-probe.summons.txt` in `summon/log/census/summons/` — gitignored telemetry, and
the audit's sha is only checkable while the file it names still exists, so neither is deleted.
Every workspace they opened is closed (`workspace:45`–`48`, each `OK` from `cmux workspace
close`), the scratch directory is gone, `~/code/agents/summon/log/HALT` is **absent**, and
`git status --short` is byte-identical to how this row found it. The stamp is not
mantle-prefixed, so it enters no lineage counter (B3 F4 / B8 F1's parked class untouched).
