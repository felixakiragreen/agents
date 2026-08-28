# B15 — the Workshop

**Status:** **LANDED** 2026-08-27 · **Depends on:** B14 · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel, ✓ Felix 2026-08-27; this order applies §3 (the
Focus slot) + the field report's Workshop items (ISSUES → keel fold).

## Goal

One building, inside: the first real `FocusView` tenant. Clicking a building
in the City focuses its Workshop — live agents first, then the building's
truth (board, ledger tail, decision queue, ISSUES), every section
collapsible and reorderable, docs opening at the line.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §3; B13's `FocusView` seam and tooltip
  primitive; B14's City click-through and waiting vocabulary.
- v0 `pages.ts` building panels — the render logic ports; the PAGE dies
  later, the logic lives here.
- `doctrine/` parse (D65 — one parser, still); the D58 linking law.
- Felix's field report rulings: **LIVE SESSIONS first** (default order),
  collapse/reorder, `agents/LEDGER.md:385`-style links must land on the line.

## Spec

1. **The tenant.** `workshop` registers via the seam; City click focuses it
   with that building. States: minimal = name + dots + badge counts;
   typical = live sessions + board summary + tail head; expanded = the full
   panel set.
2. **Sections, in default order:** Live sessions (dots, waiting style, per
   session: name per current identity source, tier, age, jump; hotswap
   affordance arrives with B16 and the slot says so) · Board (rows
   encapsulated, status rings) · Ledger tail · Decision queue · ISSUES.
   Every section collapses; **order is draggable and persists per-viewer**
   (localStorage, try/catch, defaults intact when absent — the B13 law).
3. **The doc viewer with line anchors.** Rendered links resolve (D58) and a
   `path:line` reference opens the doc scrolled to that line, line
   highlighted — the field report's item 3. Ship it as the deck's `/doc`
   equivalent inside Focus (v0's `/doc` untouched).
4. **Tooltips everywhere data is dense:** a board row's tooltip carries its
   status annotation; a session's carries its cwd/venue/pid — the §2 law
   (fewest words on the surface, depth on hover).

## Acceptance criteria — the DoD

**Status: LANDED 2026-08-27.** The browser half is
[`lab/b15/probe.ts`](../lab/b15/probe.ts) (a fixture city, in real headless
Chrome at 1600×900 — B13 F1's harness) and [`lab/b15/live.ts`](../lab/b15/live.ts)
(the same deck over the **live** register). Both **ALL GREEN**; the outputs below
are verbatim.

- [x] **City click → Workshop focused on that building (DOM evidence, two
  buildings).**

```
PASS  a City click focuses the Workshop on THAT building — two buildings, two different panes
      focus tenant "workshop" → "workshop", pane head "the Workshop"
      click 1 → …/b15-probe-w6xJGw/city/nb/workshop · sections [sessions, board, ledger, decisions, issues]
      click 2 → …/b15-probe-w6xJGw/city/nb/annex · board rows [A1] · issues section says "No inbox in this building — the first gesture mints one (DOC"
```

- [x] **Default section order live-sessions-first; a reorder survives a reload
  (localStorage evidence); absent storage renders defaults.** Both reorder paths
  run through the pane's own handlers — the ▲▼ buttons and a real `DragEvent`
  triple — and both call one `moved()`.

```
PASS  a reorder is his — buttons and drag drive one law, and it survives a reload (localStorage)
      ▲ ×3 on issues (last → second, one place per click) → [sessions → issues → board → ledger → decisions]  stored ["sessions","issues","board","ledger","decisions"]
      drag sessions onto ledger → [issues → board → ledger → sessions → decisions]  stored ["issues","board","ledger","sessions","decisions"]
      after a full page reload → [issues → board → ledger → sessions → decisions]  stored ["issues","board","ledger","sessions","decisions"]
PASS  absent storage renders the defaults — the memory is a convenience, never load-bearing
      localStorage.getItem('belvedere.workshop.order') → null
      order [sessions → board → ledger → decisions → issues] · every section open: yes, yes, yes, yes, yes
```

- [x] **All five sections render real data for `agents/belvedere` and one
  hexwright-class building; collapse state works per section.** The live run
  opens both through a real City click; the fixture run carries the states the
  live corpus does not happen to be in today (a pending countersign, an
  IN FLIGHT row, an unparseable status).

```
PASS  all five sections render real data for agents/belvedere AND a hexwright-class building
      agents/belvedere — 29 board rows [P1=LANDED P2=LANDED P3=LANDED P4=LANDED …], 0 live, 0 decisions, 1 inbox entries, 85 resolvable references
      section counts [0 | 29 | 2026-08-27 | 0 | 1] · tail "2026-08-27 · Builderopus-highB14agents/belvedere/LEDGER.md:968"
      hexwright — 4 board rows [WO-001=LANDED WO-002=LANDED WO-003=LANDED WO-004=LANDED], 0 live, 1 decisions, 0 inbox entries, 9 references
      section counts [0 | 4 | 2026-08-26 | 1 | 0] · tail "2026-08-26 · Architectopus-medium18bhexwright/LEDGER.md:95"
PASS  live sessions render first, each with the model the transcript names and a tooltip carrying cwd · venue · pid
      agents — 6 live: dispatcher-agents-04 (sonnet, working, jumpable) · p6-live-01 (sonnet, idle, jumpable) · mentat-01 (fable, nagging) · architect-agents-03 (fable, unknown, jumpable) · resume-agent-session (—, idle) · cee6117a (—, idle)
      a tooltip verbatim: "/Users/felix/code/agents · cmux workspace F9A4AEED-4268-4748-86CD-FECF297985DA · pid 85781 · last PostToolUse Bash"
      a session in no cmux pane has its jump disabled and its tooltip says why — 3 of 6 here

PASS  all five sections render real parsed data, LIVE SESSIONS first (his ruling)      [fixture]
      order [sessions → board → ledger → decisions → issues] · counts [2 | 5 | 2026-08-27 | 1 | 2]
      sessions [{"who":"ws-worki","tier":"—","state":"working","dot":"dot s-working","jump":true},{"who":"ws-block","tier":"—","state":"blocked","dot":"dot s-needs-input w-blocked","jump":true}]
      board W1=OPEN (Builder · opus-high) · W2=IN FLIGHT (Builder · opus-high) · W3=LANDED (Builder · opus-high) · W4=OPEN (Builder · opus-high) · W5=UNPARSED (Builder · opus-high)
      ledger tail "2026-08-27 · Architectfable-highW2nb/workshop/LEDGER.md:388" · decisions [D1:pending] · issues 2 entries
PASS  collapse is per section — the board folds and nothing else moves
      board rows in DOM 5 → 0, data-open="no"
      every section: sessions:yes · board:no · ledger:yes · decisions:yes · issues:yes
```

- [x] **A `LEDGER.md:385`-style link opens the viewer scrolled to line 385,
  highlighted (DOM evidence: the line's element in view + marked).** The
  reference clicked is the one the fixture's **ISSUES entry wrote in prose** —
  the field report's own shape — and the same span kind works from a landing
  record and from the live corpus.

```
PASS  a `LEDGER.md:385` reference opens the viewer ON line 385 — marked, and inside the pane
      clicked the rendered reference "LEDGER.md:385" in the ISSUES section · viewer head reads "nb/workshop/LEDGER.md:385"
      exactly 1 line marked, and it is line 385 of 392: "THIS IS LINE 385 — the line `LEDGER.md:385` names, and the one the viewer must land on."
      in view — line box 615.38–631.88 px inside pane 53.19–757.00 px
PASS  the same reference works from a landing record’s own prose — one span kind, every section
      W3's annotation, expanded: its `LEDGER.md:385` opened nb/workshop/LEDGER.md:385 at line 385
PASS  a reference the LIVE corpus wrote opens the real file on its real line
      clicked the rendered reference "hexwright/LEDGER.md:95" in hexwright's ledger tail → the viewer opened 117-line file at line 95, exactly 1 line marked, inside the pane
```

- [x] **Waiting sessions carry the B14 style here too; zero fire wiring
  (structural grep).** Three greps, not one: the live DOM, this row's own source,
  and the served bundle.

```
PASS  a blocked session carries B14’s waiting style in this pane too — one vocabulary, everywhere
      dots in the session list: ["dot s-working","dot s-needs-input w-blocked"] · its word reads "blocked"
PASS  ZERO fire wiring in the Workshop — DOM, source and served bundle (D10)
      DOM: 0 of [data-fire, data-apply, data-worktree, data-summons]; "hands/fire" 0× in the document
      glass/workshop.client.ts: "hands/fire" 0× · /deck.js is 40621 B and carries it 0×
      39 buttons across Focus and Action, and the only wire among them is /hands/focus
```

- [x] **Suite green one process; type gate exit 0.**

```
$ bun test belvedere/glass
 371 pass ·  0 fail · 931 expect() calls
Ran 371 tests across 13 files. [575.00ms]

$ cd belvedere/glass && bunx --offline tsc --noEmit ; echo $?
0
```

**Also measured, because the order's spec asks for it and the DoD list does
not.** The law of space at all three states, the poll's real price, and B8 F3's
worker law with the wider read on top:

```
PASS  typical shows the top of HIS order and says what it is holding back; Action follows Focus
      typical → [sessions → board → ledger] and the pane says "2 more section(s) at expanded."
      Action holds: "act …/nb/workshop · 2 live · 5 rows · 2 in the inbox — The summon composer moves in here at B17"
      scrollHeight − viewport = 0 px
PASS  minimal is one word and a mark, and the page body still does not scroll (the law of space)
      focus pane 159.80 px wide holds "workshop" + 2 dots and 0 sections
      scrollHeight − viewport = 0 px
PASS  at minimal the poll carries no building — the detail is asked for, never broadcast
      the last 3 polls: /deck/state?b=…%2Fnb%2Fworkshop · /deck/state?b=…%2Fnb%2Fworkshop · /deck/state
PASS  the widened poll is priced, and stays far under the 500 ms bar
      GET /deck/state        p50 51 ms · p95 55 ms · 58686 B
      GET /deck/state?b=agents/belvedere  p50 51 ms · p95 100 ms · 123583 B (the city's biggest building: +64897 B and 0 ms — the content was already parsed for the City)
      N=12 each, live register of 22 buildings — and the detail rides the poll that already ran
PASS  B8 F3’s worker law holds with the Workshop’s read on top — the walk never rides the request thread
      a /rewalk costing 8.26 s of its own request had three opened-Workshop polls land inside it in 49 · 49 · 49 ms
```

## Out of scope

- Chat/hotswap (B16); rename/recolor controls (B18); the Works (B10); any
  board *editing* — truth is read, gestures ride B6's wires only.

*(Honoured. The Workshop reads and jumps: its one wire is `POST /hands/focus`,
the shell's own, and it renders a baton's instruments as text rather than as
buttons. The Action pane names B17 rather than half-building a composer, and
`hotswap` appears nowhere.)*

## Findings

**F1 — a tier is `<model> · <effort>` and only the model is written down
anywhere this glass can read.** Spec §2 asks each session line for a tier. The
census cannot supply one: the hook payload carries no model and no effort field
(P1's ten events, verbatim), and effort is on **no artifact at all** once a
session is running — `invocations.jsonl` has it, but B2 F1 proved that log does
not join to a session. What does exist is the transcript's own
`.message.model`, and `census.ts` was already reading a bounded 64 kB head
window off every transcript for the name-stamp, so `identify()` now takes the
model family out of the same window — **zero extra I/O**, and one measured
saving: the previous shape called `identify()` once per field, which would have
doubled the whole census's disk reads for one string. Live, over the city's 13
live sessions: **11 carry a model** (`sonnet` ×2, `fable` ×5, `opus` ×2 among
those rendered), and the two that do not are a resume whose head window holds no
assistant record and an unstamped session — both render `—`. **The Workshop
prints the model and leaves the other half blank rather than calling half a tier
a tier.** This binds [B17](b17-composer-usage.md), whose composer shows a tier
per session, and [B18](b18-live-identity.md): the honest fix is a **field**, and
it is the fourth filing of that same ask (B3 F4/F5 wanted `Baton.kind` and a
branch field, B9 F1 a name field, B14 F2 an escalation field).

**F2 — the `FocusView` seam grew a fifth, optional member, and it is the shape
every later tenant should copy.** B13's four members are what a tenant needs to
*draw*. The Workshop is the first that needs the server to **answer
differently**: one building's whole detail is **65 kB** of JSON, so a snapshot
carrying all 22 buildings' boards would be ~1.4 MB every three seconds — B13 F5's
shared budget, blown thirty times over. `needs(focusState)` returns the building
the tenant wants opened, the shell puts it in the poll's query and nowhere else,
and a tenant that omits the member asks for nothing and gets exactly B14's
snapshot. **Still one endpoint and one timer.** The price, measured live over the
whole register (N=12 each): `/deck/state` **58 686 B, p50 51 ms** ·
`/deck/state?b=agents/belvedere` **123 583 B, p50 51 ms** — **the detail costs
bytes and no measurable time**, because `city()` already parsed that building's
content for the City's own badges, so opening it is serialization and nothing
else. And the client only asks while the Workshop is standing **above minimal**:
at minimal the poll goes back to being bare (proven in the DOM's own
`performance` entries). **B17 and B18 widen this same query rather than opening a
second one.**

**F3 — a code tick around a `path:line` does not stop it being a reference, and
the corpus writes nearly every path in ticks.** The field report's item is *"Links
to documents (WHERE: agents/LEDGER.md:385) don't take you to that line"*, and the
naive rule — linkify bare `path:line` in prose — misses most of the corpus,
because the doctrine writes `` `README.md:191` ``. Fixed **inside the code
branch** rather than by letting the bare rule win the overlap: winning the
overlap would strand the backticks as literal text beside the link. Two
narrownesses are deliberate and both are pinned: a path with **no line** stays
text (a bare `README.md` is a mention, and D58 says durable docs link their first
mention anyway), and a `path:line` the filesystem **cannot find** stays text —
a link that lies is worse than no link (D10's family). Markdown links are the
opposite and resolve unconditionally: the corpus *declared* those to be links, so
a missing target opens the viewer onto its own honest `ENOENT` rather than
silently rendering as prose. All of it is parsed **once, server-side**, into
spans (`html.ts` §spans), which is why the client builds DOM and carries no
markdown at all. **For [B20](b20-decoder.md): `Span` is the shape a decoder
hangs off** — the detector already runs at the boundary, and a `doc` span is a
resolved object rather than a regex hit.

**F4 — `register.ts` holds ONE warm copy for the whole process and does not
remember which city it walked, so two test files with two fixture cities decide
each other's results.** B13 wrote the warning into `deck.test.ts` in its own
words; B15 is the first row to hit it. Adding a `deckState()` describe over a
second fixture city turned **three of `deck.test.ts`'s assertions red** — its
`tinytown` building simply was not in the register any more, because whichever
file ran first had warmed it. Handled by **not calling `deckState()` from
`workshop.test.ts` at all**: the census→wire flatten came out as a pure
`deckSession()` and is tested directly, and the `?b=` contract is proven end to
end over a real server in `lab/b15/probe.ts`, which is stronger evidence anyway.
**The wart is real and unfixed**: the held register is keyed on nothing, so the
next row that adds a second city fixture to `bun test` will break `deck.test.ts`
the same silent way. Naming it, not fixing it — the register's policy is the
Architect's (the E1 ruling).

**F5 — a receipt has to outlive the repaint that proves it.** *"JUMP TO PANEL …
does nothing"* (field report) is half a rendering bug: the jump does fire, and
the message reporting it died at the next poll's repaint. B14's queue held its
receipts in a map for exactly this reason; the Workshop needed the same, so
`say()` and the `receipts` map moved into `deck-dom.ts` and `say()` now writes
into **every** `[data-out-for]` bearing the key rather than only the drawer's.
One consequence worth keeping: the drawer's pruning now drops **only the queue's
own keys** (`QUEUE_KEY`), because a jump reported in another pane is not the
drawer's to forget. The Workshop's jump is also **disabled with its reason on
hover** when a session sits in no cmux pane — 3 of 6 live sessions in `agents`
at this row's capture.

**F6 — a D54 near-slip, self-reported.** The type gate was run once as `bunx
--offline tsc --noEmit --project belvedere/glass` **from the repo root**, which
re-resolves `tsc` outside the glass's pinned install and printed *"Resolved,
downloaded and extracted [2] · Saved lockfile"*. `--offline` forbids the network
and nothing entered the repo — `git status` showed no lockfile change and no new
files, checked immediately — but that invocation is not the sanctioned one and
does not prove the pinned `typescript@7.0.2`. **The gate is `cd belvedere/glass
&& bunx --offline tsc --noEmit` and only that**; every gate run recorded above is
that one. Zero third-party code was fetched, vendored or installed by this row.

**F7 — the two lanes of batch 5 are file-disjoint and not commit-disjoint.**
Filed to [ISSUES](../ISSUES.md) with the evidence: `git add -A belvedere` from
this row swept lane A's live, uncommitted P6 probe files into three B15 commits
while `p6-live-01` was still running. Nothing was lost or reverted and history
was deliberately **not** rewritten under a live concurrent session, but the
attribution is wrong in those commits. The batch note's concurrency plan owes a
**commit** rule, not just a file rule.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b15-workshop.md,
and build it to its DoD.
```
