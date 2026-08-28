# glass — the spine

One bun server rendering the city from the truth layer. **Read-everything,
write-narrow**: every page route touches nothing on disk, and the writing routes are exactly
the fence's list (README §2, D18) and no more — `/hands/*` (spawn · worktree · focus · HALT ·
rename · recolor), `/inbox` (one D63 line), `/flow/*` (the arm, which only calls hands),
`/chat/send` (his words into a session), `/chat/draft` and `/desk/*` (files under `desk/`).

```
bun belvedere/glass/server.ts        # → http://127.0.0.1:4400
bun test belvedere/glass             # 651 green in one process (B8 §4, B9, B13, B14, B15, B18, B20, B10, B17, B11, B16, B19, B21, B12)
bunx tsc --noEmit                    # from this directory — the type gate, offline (B8 §5);
                                     # it covers the deck's client TS too (B13 F3), never `lab/`
bun belvedere/lab/b13/probe.ts       # the deck's DoD in real headless Chrome (B13 F1)
bun belvedere/lab/b14/probe.ts       # the City + queue, against a fixture city (B14)
bun belvedere/lab/b14/live.ts        # the same, against the LIVE city — it fires one session
bun belvedere/lab/b15/probe.ts       # the Workshop: clicks, the reorder, the marked line (a fixture city)
bun belvedere/lab/b15/live.ts        # the Workshop over the LIVE register — it writes nothing
bun belvedere/lab/b10/probe.ts       # the Works: ranks, edges, the now-line, the lit ring (a fixture city)
bun belvedere/lab/b10/live.ts        # the city's own flow over the city's own board — it writes nothing
bun belvedere/lab/b11/probe.ts       # the arm's refusals + the arm pressed in Chrome (no fire)
bun belvedere/lab/b11/lever.ts       # D10 · HALT · amend · re-arm · timeout — ONE live session
bun belvedere/lab/b11/smoke.ts       # the flow runs itself — TWO live sessions and a Felix-card
bun belvedere/lab/b16/probe.ts       # the Chat: three hotswaps, the window, the drafts, zero send wiring cold
bun belvedere/lab/b16/send.ts        # the send, for real — ONE live session, then the same message to it dead
bun belvedere/lab/b19/probe.ts       # the desk: the drill, the three routes, the confinement (a COPY of the fixture city)
bun belvedere/lab/b21/probe.ts       # the Grep against the REAL corpus — the commissioning query, three jumps, every bound
bun belvedere/lab/b12/probe.ts       # the reactive gate + scope-arm — THREE live sessions and both Felix-cards
```

| Route | What |
|---|---|
| `/` | **the baton rail** — every baton, Felix-gate and pending countersign, one column, buttons |
| `/city` | City View — a card per building: lit windows, board pulse, lint count |
| `/b/<building>` | board · ledger tail + baton · decision queue · ISSUES · live sessions · lint |
| `/shelf` | **every session all three accounts have ever held** — resume the dead, jump to the living; usage ×3 and WIP above them |
| `/summon` | **the composer — fire anything**: building or free path · account · mantle · tier · templates · optional worktree; `POST` composes, the button fires |
| `/deck` | **the deck** — the app: three panes (Context · Focus · Action), the drawer, the tooltip primitive, the `FocusView` seam. `/deck.js` is the bundle, `/deck/state[?b=<building>][&s=<session>]` the snapshot, `/deck/doc?p=<path>` the viewer's bytes |
| `belvedere/flows/*.flow.json` | **the declared plan** — a batch note as data, read by `flow.ts` alone, drawn by the Works; committed truth, never written by the glass |
| `/deck/decode?t=<ref>&in=<doc>&w=<scope>` | **the decoder** — one code word (`B18`, `D63`, `§5`, `row 17`) resolved into its object: encapsulation, status, where it is written, its gestures |
| `/doc?p=<path>` | the read-only viewer every rendered link resolves into (D58) |
| `POST /hands/{fire,worktree,focus,halt}` | the four hands; 503 until `~/.config/belvedere/env` is armed |
| `POST /flow/<name>/{arm,pass}` | **the arm** (D11) — one click authorizes a declared flow; `pass` is his hand on a Felix-card. Credential-gated like a hand; the engine's every write is a hand call or a run-state append |
| `/deck/chat?sid=<session>&before=<byte>` | **the Chat's earlier windows** — one bounded window of a transcript ending where the one you hold begins; the tail rides the poll |
| `POST /chat/send` | **the voice** (D18 class 1) — his words into a session as one real user turn, P6's segmented paste, verified against the transcript afterwards; credential-gated, audited by sha |
| `POST /chat/draft` | his draft for one target, saved under `desk/drafts/` (D18 class 3); **no credential gate** |
| `/desk/{notes,note}` · `POST /desk/{save,preview,file}` | **the desk** (D17) — the drawer, one note, the autosave, what a route would write, and the one route that writes it; **no credential gate**, off the poll |
| `POST /inbox` | **the sovereign's inbox** — one gesture, one D63 line appended to a building's `ISSUES.md`; **no credential gate** |

**The deck is an app, not a page** (B13, D13 — Felix: *"this is an app"*). `/deck` serves a
skeleton with the **resting split already in the markup**, `/deck.js` is `deck.client.ts`
bundled by `Bun.build` at server start (no framework, nothing off this origin; a failed
build **stops the server** rather than serving a shell around nothing), and `/deck/state` is
one composed read — census + the register's **held** copy + every building's content — polled
every 3 s. **What the answer changes is repainted; what it does not, is not**: each region
carries a content signature (its pane state plus the data it draws, wall clocks excluded) and
ages are `<span data-at>` rewritten by a separate tick. B13 diffed the whole snapshot instead,
which could never match — `at` and `ageSeconds` move every poll — so the deck rebuilt itself
every three seconds; harmless for placeholders, fatal for a pane Felix types into (B14 F4).
**A memo is a claim about a host's contents, so it records the host** (B19): the shell empties both
hosts on a tenant swap, and without that a tenant swapped away and back with an unchanged signature
found its own memo still standing and drew **nothing** — a blank pane, no error, only on the return.
`forget(host)` retracts the claim wherever a host is cleared.
**The law of space is arithmetic**
(`deck-model.ts`): a pane's state IS its weight — minimal 1 · typical 3 · expanded 6 — and
one `columns()` serves both the server's resting render and the client's re-render, so they
cannot disagree. `min-width: 0` on every grid child is what makes that true: an `Nfr` track
is `minmax(auto, Nfr)`, and without it a pane's content silently outvotes the split. The
body **never scrolls** — measured at all 27 state combinations, `scrollHeight − viewport` =
0 px — and each pane owns its own overflow. **Panes are a replaceable surface**: the
`FocusView` seam (`deck-view.ts`) is four required members — `mount(focusHost, actionHost)`,
`unmount`, `draw`, plus the states a tenant declares — and Action follows Focus, so one
tenant owns both hosts and there is no second register. Two optional members are how a tenant
asks the server to answer *differently*, and they are two rather than one because the ontology
has two levels with a surface: `needs(focusState)` names a **building** (B15) and
`asks(focusState)` names a **session** (B16). The shell puts both in the poll's query — `?b=`
and `?s=` — and nowhere else: one endpoint, one timer, and a tenant that omits them asks for
nothing. **B13's three placeholders are all gone**: the Workshop (B15), the Works (B10), the
Chat (B16) and the desk (B19) moved in through that interface and nowhere else. Four shared cells
sit beside the register because they cross tenants and must not be duplicated: `selection`
(`{building, session, awaiting}` — the ontology's own levels, written by whoever clicked),
`viewer.open` (the deck has **one** document viewer, the Workshop's), `swap.to` (the
shell's own tenant swap, so the Works can hand a landing record's reference to that viewer,
and the composer can hand a fresh fire to the Chat, without reaching into either) and
`compose.with` (the composer's own door, so the desk can seed a summons the same way). The browser half of its DoD is [`lab/b13/probe.ts`](../lab/b13/probe.ts) —
real headless Chrome over the DevTools protocol, zero dependencies, written to be reused by
every deck row after it.

**Attention lives twice, off one computation** (B14, D15 — `attention.ts`). Four classes and
no fifth: a **waiting** session, a live **Felix-gate**, a pending **countersign**, an unruled
**escalation**. `needsYou()` builds the ranked queue and `cityRows()` **buckets those very
items** into the City's badges, so a badge can never count something the queue does not list.
The ranking is v0's (`attentionOf`/`freshness`, imported not copied) plus exactly one new
rank: a session that cannot move without him outranks even the work that is running.
**Waiting has two measured edges and no third** — `Notification/permission_prompt` (blocked
on a dialog) and `Notification/idle_prompt` (the 60 s nag, which is the notification cmux
gives Felix); a bare `Stop` is *idle*, and a queue listing every finished session is a queue
nobody opens. Note what the census cannot see: **`PermissionRequest` is a real hook event
that B1's deploy does not subscribe to** (cmux's own injection does), so the blocked edge is
a six-second-late inference until that changes — B14 F1. Escalations have **no field**: they
are read out of a stripped annotation by one narrow marker rule, and the two false positives
the live corpus produced (an `E<n>` that names a row on the same board; the far end of an
`E1–E4` range) are fixed generally — B14 F2. **Nothing in Context or the drawer can fire**:
the two wires are `POST /inbox` and `POST /hands/focus`, and `/deck.js` contains the string
`hands/fire` zero times (D10, grepped by [`lab/b14/probe.ts`](../lab/b14/probe.ts); the live
half, including a real permission stall, is [`lab/b14/live.ts`](../lab/b14/live.ts)).

**The Workshop is one building, inside** (B15, `workshop.ts` + `workshop.client.ts`) — the deck's
first real Focus tenant, moved in through the `FocusView` seam and nowhere else. **Live sessions
first** and then the building's truth — board, ledger tail, decision queue, ISSUES — in Felix's own
order (*"I should be able to collapse BOARD, LEDGER, DECISIONS, ISSUES, etc and reorder them — LIVE
SESSIONS should be first"*). Every section collapses, the order is his to drag **or** to walk with
▲▼ (one `moved()` under both), and both survive a reload in `localStorage` — where **only a full
permutation counts as a memory**, since a remembered subset would silently hide a section. Three
states are three densities: minimal is the building's last name, its dots and its badges; typical is
the top three of *his* order and a line saying what it is holding back; expanded is all five.

**The Works draws the building's whole work on one line of time** (B10, keel §6 — `flow.ts` +
`works.ts` + `works.client.ts`). A **flow** is a declared DAG in
`belvedere/flows/<name>.flow.json` — the batch note as data (flow-keel §3) — and `flow.ts` is the
only module that touches those bytes, so the Standards Office's storage ruling (canon row 17) swaps
the serialization in one file. A kickoff is **quoted, not copied**: `{doc, fence}` resolves a 1-based
fence ordinal at parse time, and the fixture flow's `g2` step holds the README's own G2 kickoff
byte-for-byte. Every refusal is a **named value, never a throw** — duplicate id, unknown dep, cycle,
unresolvable kickoff, a name over six words, an unknown account/tier/venue — and a flow that will not
parse renders its failure and files nothing (parser-as-lint). **Time flows down** (D14): dependency
depth is a rank running downward with parallel lanes side by side, edges are inline-SVG paths
**placed against the boxes the browser actually laid out**, and the **NOW line** is cut in front of
the first rank still holding unfinished work, with the building's live sessions blinking on it — the
board's landed rows and the ledger's arc above, the plan below, **one renderer**. A node's ring comes
from the engine's run log (`summon/log/census/flows/<name>.run.jsonl`, D6 telemetry, written by the engine)
where it has spoken and from the **board** where it has not, and the drawing says which: a
board-sourced ring is **dashed**. Lit means fired *and* its session is still beating, off the census.
The bill is on the wall beside the plan: tier on every node, usage ×3 accounts (B17's live fetch,
behind the shape B10 left). **The permission clause is a check, not a field** (P5 F5): a step's model
*is* its posture, so a `haiku` step is drawn blocked with P5's sentence on it, while the venue
precheck is paid once at arm because `trust.ts` spawns `git` per (step, account).

**The engine runs the string** (B11, D11 — `engine.ts`). One click on the Works' arm card is the
authorization — *the review of the rendered plan IS the authorization* — and from there a tick inside
this server does what a Dispatcher does between sessions: it fires ready steps **through the existing
hands**, and pauses at everything a mantle would have to judge.

- **The arm.** `POST /flow/<name>/arm`, credential-gated, carrying the `hash` the page was showing.
  Everything that can refuse refuses **here**, loudly, naming the step: a `haiku` model (P5 F5 ii), a
  venue the step's account has never trusted (`trust.ts`, per (step, account) — the same directory is
  warm on one silo and cold on another), a flow that will not parse, and a plan that moved while he
  was reading it. **Armed flows are immutable**: `Flow.hash` covers the file's bytes *and* every
  resolved kickoff, so an edit to a quoted *order* trips it too (B10 F2) — new fires pause, what is in
  flight runs on, and one **re-arm** covers the amendment.
- **The tick.** Every 5 s and after every hands action, single-flight, and **cheap when nothing is
  armed** — the run logs are read first and the census, the register and the credential are never
  touched for a city with nothing to run. Started by `server.ts` and only by `server.ts`: a
  module-scope interval would drive Felix's desktop from any test process that imported the module.
- **Ready** means every dependency landed, the step unfired, its gate not an unpassed Felix-card,
  **HALT absent** (checked again immediately before every spawn — the flag's first consumer),
  concurrency headroom, and the venue free: **master-venue steps are strictly serial per checkout**,
  city-wide, while worktree lanes run in parallel and are composed by the hand first.
- **Landed** means the board row parses `LANDED` clean, **or** the census says `Stop` was the last
  word and the pid is gone (P1's two-sensor law). Everything else **pauses and surfaces**: a session
  gone without a `Stop`, `KILLED`/`BLOCKED`, an unruled escalation on a landing (keel §5.1 — B12's
  judge takes it from there), and a step past its `timeoutMinutes`. **The engine kills nothing** — a
  timeout pauses the flow's advance; stopping live work is Felix's or the session's own.
- **His card** pauses the lane and renders in his idiom with **zero fire wiring**. The one control on
  it is `POST /flow/<name>/pass`, credential-gated — never auto-fired, never auto-passed.
- **Run-state** is the engine's working memory, not truth: `summon/log/census/flows/<name>.run.jsonl`
  (D6, gitignored), append-only, written **once** per thing that happened — a pass that changes
  nothing writes nothing. A fire returns a workspace and no session id, so a `fired` line carries the
  **name-stamp** and a later one carries the `sid` the census read off the transcript (B11 F2): take
  the **last** `fired` line for a step, and the **first** one's `ts` for the timeout clock.

**The fence gains no write class.** Every engine write is a hand call (same audit, same unwind, same
arming switch) or a run-state append. It edits no board, no ledger, no decision and no flow file.

**The Chat is the voice** (B16, keel §5 — `chat.ts` + `chat.client.ts`). **One conversation view in
the whole deck**: any session — live, idle, weeks dead — hotswaps into it from a session row
anywhere (the City expanded, a Workshop's live sessions, the needs-you queue, and after a composer
fire), the transcript reads in Focus, his reply drafts in Action, and the two scroll independently.

- **The read.** A bounded window of the transcript file, parsed into turns: prose (spanned
  server-side, so it decodes like every other rendering of corpus text), **fences kept verbatim and
  exempt from the decoder** — a kickoff quoted in a transcript is bytes somebody is about to copy —
  and **one line per tool call**. A turn's key is the **byte offset** of the record that opened it,
  which is the only stable identity a jsonl append log offers: it is what lets a window loaded by
  scrolling up be merged onto a live tail without ever drawing a turn twice. Earlier windows ride
  `GET /deck/chat?sid=&before=`, a gesture's answer like `/deck/doc` — the poll stays the one timer.
- **The send** is **P6's transport law, consumed verbatim**: newline-free segments through
  `set-buffer`+`paste-buffer`, newlines as `send-key alt+enter`, edge whitespace through `send`, one
  `enter` to submit — because `paste-buffer` rewrites LF to CR, `set-buffer` trims its own edges, and
  `ctrl+j` is silently dropped by the TUI. **Address by UUID, always** (P6 F2). Enter is pressed only
  after every segment landed: a delivery that died half-way leaves a partial message in the box and
  says so, rather than submitting it.
- **Nothing is delivered until the transcript says so.** The verification read records the file's
  size before the send and polls the appended region for exactly one new *string* user turn whose
  sha matches. No new turn, more than one, or different bytes are all failures, each named, and
  **none is ever retried** — the message may have half-landed.
- **Refused at compose, never at send:** a literal TAB (the TUI swallows every one), a first line
  starting `/` `!` or `#`, a target whose input box is not empty (`read-screen` first — the transport
  appends, it never replaces), a target the census and the three transcript trees have never seen,
  and anything `sanitizeSummons` would rewrite (the glass will not edit his bytes to make its own sha
  match). `refusals()` is pure and lives in `deck-model.ts`, so the reason he reads as he types and
  the reason the route refuses are one function.
- **D10 as structure.** Whether a send is possible at all is decided server-side; when it is not, the
  client draws **no send control**, only the reason. Cold hands, no transcript, a live session in no
  cmux workspace, a dead one whose directory is gone — all of them render as words.
- **Drafts** auto-save per target to `desk/drafts/<sid>.md` (D17's home, D18 class 3) so a half-typed
  reply outlives a reload, a hotswap and a killed server. `POST /chat/draft` sits deliberately in
  **front** of the arming switch: cold hands must never cost him the ability to write something down.

**The desk is where he writes** (B19, D17/D18 class 3 — `desk.ts` + `desk.client.ts`). One drawer,
city-wide: `~/code/agents/desk/<slug>.md`, flat, frontmatter-free, **the first line is the title**,
and `desk/drafts/` beside it holding B16's per-session chat drafts. The deck's fourth Focus tenant —
**the drawer in Focus, the writing surface in Action** — and one click in the tenant bar away from
anywhere. Autosave is debounced onto the file, so a reload, a hotswap and a killed server all give
the words back.

- **The confinement is the slug**, not a check on a path: a note is named in `[a-z0-9-]`, so no path
  ever arrives from a URL (the font route's own law), and the directory assertion under it is the
  invariant written where it can be read. A crafted `../../canon/CLAUDE` is refused **409, naming
  the rule**, before the filesystem is touched.
- **Receipts are not body.** A routed note gains `routed <date> <hh:mm> → <where>` in a trailing
  `---` block that the reader takes back off — so the editor shows what he wrote and the file shows
  where it went. The trailer is the final block **and only when every non-blank line in it is a
  receipt**, so a note that ends in a rule of his own prose keeps all of it, and the glass invents
  no marker inside a file he writes by hand.
- **The desk grows no transport.** Its three routes are other people's wires — B6's inbox append,
  B16's draft box, B17's composer (reached through the seam's own `compose` cell, never by importing
  a tenant). What is new here is the **plan**: one function composes the exact bytes and the reason
  it cannot, so the preview he signs off on and the write are one string (B16's `refusals()` law,
  second venue). A plan carrying a refusal draws no button at all.
- **→ inbox is the one irreversible route**, so it is the one that leaves a receipt, and it carries
  the `sha` the page was showing: an inbox that gained an entry while he was reading would compose
  different bytes, and a sign-off on bytes nobody re-read is not a sign-off (**B11's arm law, one
  door along**). A long note becomes **D63h's block form** — the title is the entry line, the body
  is markdown list continuation under it, **indented, which is load-bearing**: `blocks()` splits an
  inbox on `^---$`, so an indented rule inside his prose cannot cut the block in half and strand the
  evidence where `parseIssues` would lint it.
- **Off the poll, deliberately.** Nothing on the server changes a note, so broadcasting his own
  writing back at him every three seconds would only fight the pane he is typing in (B14 F4).
  `/deck/state` is byte-for-byte the shape B16 left it.
- **No credential gate** (B6 F3's law, third venue), and **commits are never the glass's** (D18
  class 3): the files sit on disk, and a sitting — or Felix — commits them. `desk/.gitignore`
  settles B16 F4: notes are truth and commit; a half-typed reply to one session is per-viewer
  scratch and does not.

**A rendered `path:line` lands ON the line.** The field report's third item — *"Links to documents
(WHERE: `agents/LEDGER.md:385`) don't take you to that line"* — dies at the boundary rather than in
the browser: the server parses every piece of corpus prose into **spans** (`html.ts` §spans) once,
so a `doc` span arrives at the client as a resolved path and a line number and the client only has
to append it. `/deck/doc?p=…` reads the bytes (same city fence as `/doc`, errors as values), the
viewer opens inside Focus, and the line is marked and scrolled to center. Three narrownesses carry
the honesty: a **bare path with no line** stays text (a mention is not a link, and D58 has the
first mention linked already), a `path:line` the **filesystem cannot find** stays text, and a
**code tick around a reference does not stop it being one** — the doctrine writes nearly every path
in ticks, and resolving it inside the code branch is what keeps the backticks from stranding beside
the link. Markdown links resolve unconditionally, because the corpus declared *those* to be links:
a missing target opens onto the viewer's own honest error.

**No code word without its meaning one hover away** (B20 — `decode.ts` + `decoder.ts`). Every
reference the deck renders resolves: row ids (`B18`, `P5`, `G2`), decision ids (`D2`, `D63`),
section refs (`§5`, `§3.2`), `FC-`/`GA-` ids, and **the row-keyword form** (`canon row 17`,
`bob row 3`, bare `row 14`) — because the canon board's row ids are bare numerals and only the
word in front anchors them. **Detection and resolution are deliberately apart**: `decode.ts` is a
pure detector both sides import, `decoder.ts` is where a token meets the files, and the route
**re-detects the query rather than trusting it** (parse, don't validate — a hand-typed `?t=rm -rf`
gets a refusal, not a lookup). **One seam**: `words()` in `deck-dom.ts` is the only place a code
word becomes a control, so the City, the Workshop and the drawer's queue inherit it by
construction and a fourth tenant will too — nothing decodes per-tenant.

**Resolution is context-scoped, local first, and never a guess.** A reference resolves against its
own document's building, then against canon (`canonRoot()` = `<city>/agents`) — belvedere's
decisions stop at D18, so a `D63` in a belvedere doc is canon's, and the resolver knows it *by
looking*, never by string-matching a range. A **§ is always its own document's**, which is why the
same `§5` means "Working agreements" in belvedere's README and "The cycle" in its DECISIONS; a
reference inside a markdown link's text resolves against **the document that link names**. An
explicit scope word does **not** fall back — name a building and a miss stays a miss. Nothing
resolves is answered as **unresolved with the candidates named** (`agents/belvedere — D1–D18 ·
agents — D1–D67`), which is D10's family in one card. `FC-n` and `GA-n` are detected and honestly
**not** resolved: they are real ids the corpus writes and the doctrine gives them no field —
inventing a grep to find them would be a new reference grammar, which is a canon question (B20 F1).

**Tooltips nest, and the cap is structural.** A tooltip's own body passes through the same
detector, so a hover inside one opens the next: three layers and no fourth, enforced where the
spans are **made** — a body rendered at depth 3 draws none, so there is no fourth layer to refuse.
A code word already open in the chain renders as **plain text**, which terminates a cycle
(`B18 → D2 → B18`) at the repeat. **Tooltips gesture, they never fire** (D10): the footer carries
the jump (which moves the selection, brings the Workshop forward and opens the viewer on the line)
and B6's inbox wire — a note on any object, the countersign on a pending decision — with the
**exact bytes previewed** before the append. Resolution is lazy and client-cached: a hover is one
localhost round trip (2–5 ms), and `/deck/state` carries no decoder payload at all.

**The detail is asked for, never broadcast.** One building's whole detail is **65 kB** of JSON, so
`/deck/state` gained a `?b=<building>` the standing tenant fills in through the seam's fifth,
optional member (`needs`) — still **one endpoint and one timer** (B13 F5). It costs bytes and no
measurable time (58 686 B / p50 51 ms bare vs 123 583 B / p50 51 ms opened, live register, N=12),
because `city()` had already parsed that building's content for the City's badges. At minimal the
query goes away. **A tier is `<model> · <effort>` and only the model exists**: the census payload
carries neither, so the model family is read off the same bounded transcript head window the
name-stamp comes from, and the other half renders `—` rather than a guess (B15 F1).

**The fence's third write** (B6, `inbox.ts`). A gesture — a free-text note, `defer <row>`,
`<row> before <row>`, `countersign <D-id>: ✓`, and since B19 a **report** (a title and its
evidence) — becomes ONE append: `- <YYYY-MM-DD> ·
Felix (via Belvedere) · <what>`, in **local** date (`toISOString()` is UTC and would file
tonight's note tomorrow); a report's evidence rides under its own entry line as indented list
continuation, which is D63h's block form, and `entryBytes` is the one function the desk's
preview and this write both call. **Append-only is the whole licence**: the bytes before a gesture
are always a prefix of the bytes after, and nothing here rewrites, reorders or deletes.
A building with no inbox gets one minted from
[the D53 header](../../canon/work/templates/issues.md), verbatim, on its first gesture
(adoption-on-first-need, DOCTRINE §3) — the one gesture that busts the register, because an
`ISSUES.md` is an anchor. **A note needs no credential**: the arming switch (D9) gates
one-click *dispatch*, so cold hands must never cost Felix the ability to say something —
only the **apply** button, which is a `/hands/fire` of the scoped Architect sweep, goes cold.

**The countersign has three states and all three are read off files**: `pending` (nothing
filed) → `recorded — awaiting fold` (his entry is in the inbox) → `folded` (the ✓ is in the
decision). The glass never pens the D-entry. **Folded outranks pending** — `parseDecisions`
marks an entry pending wherever the phrase appears, *including in the entry that defines the
ritual*, so canon D21 (`✓ Felix`) has been a false positive on the rail since B3; two
readings disagree, so the card renders safe and names the winner (D10).

**Compose, then fire** (B7, `composer.ts`). The form writes nothing and decides nothing:
every choice is a radio in a toggled button group, so the browser holds the state and the
back button walks it. One **compose** press re-renders with the resolved target, tier,
name-stamp, colour, worktree plan and trust verdict — and only *that* render carries a fire
button, wired to the exact JSON the card is showing. What arms it is the hands' own
`parseFire`, run over the composed body before the page is drawn: one gate, not a second
copy of one. The page POSTs to itself because a summons does not belong in a URL; **it still
writes nothing** — the fence's list is the four hands and the inbox.

**A cold directory is named, never answered** (`trust.ts`). **The unit of trust is the
project root, and it is per account**: each silo's `<config-dir>/.claude.json` names
projects, the repo's *main* worktree root when the target is inside a repo (which is exactly
why a linked worktree inherits), the directory itself when it is not. Its own entry wins;
with no entry a **repository is cold** and a plain directory borrows an ancestor's blanket
trust. Measured at B7: `~/code` is trusted for `personal`, a fire into a plain
`~/code/b7-founding-probe` ran and beat the census ten times, and a fire into a fresh
`git init` in the same `~/code` **stalled — no transcript, no census beat, the process alive
on the dialog**. All 36 live trust entries sit on project roots; all 9 live sessions are warm
under the rule. The composer warns on the button and marks the fire `data-cold`, so a
stalled fire renders as *waiting on the trust prompt*, never as a session that started.

**The name-stamp reads three sources.** `invocations.jsonl` (the rig's), `hands.jsonl` (the
glass's own fires) and — new at B7 — **the live census**, because a stamp a running session
carries came from somewhere neither log records. Proven live: `architect-belvedere` is absent
from both logs and present in the census, so the logs alone would hand that name out twice.
The theater is row 14's: `<dir>/.summon-theaters`' first line, else the directory name, no
parent walk — and the **Grand Architect keeps no theater**, one office, as the rig has it.

**The shelf's three joins, and the one it refuses** (B5): the filename is the session id
and the resume handle; the transcript's own 64 KB head gives the name-stamp and the cwd;
the census says live or dead. The **project-directory slug is never parsed** — `/` and
`_` both flatten to `-`, and the map does not invert. A **resume carries no summons**:
standing in a three-week-dead session must not wake it with an instruction, so every
field the glass does not know is omitted from argv rather than guessed (`hands.ts`
§Fire), and a live session is offered `/hands/focus` instead.

**Why every WIP figure says it is a floor.** The census only knows sessions that have
**heartbeated** — at this row's capture it knew 6 while `ps` counted 38 `claude`
processes, because B1's hooks went live mid-city and pre-hook sessions never beat
([B5 §E1](../plans/b5-shelf-gauges.md#findings)). And the background roster is bounded
twice: `beat.sh` slices it at 16 (`16+`, never `16`), and **only `Stop` and
`SubagentStop` payloads carry it at all** — 210 of 210 non-empty rosters, none on 1820
tool-use beats — so an unobserved roster renders `?`, never `0`, and an observed one is
stamped *last seen N ago* because a shell's completion fires no event (P1 F4).

**Three sources. Content is re-read per request, always; only the register — *which*
directories are buildings — is held warm** (G1's E1 ruling; `register.ts`, **TTL 300 s**,
age printed in every footer beside a **re-walk** button, and busted by the glass's own
fires and worktrees so it is never blind to its own writes). Buildings: canon
[`doctrine/`](../../doctrine) `parse()`/`discover()` — the one parser in the city (D65),
imported, never forked. Liveness: `summon/log/census/census.jsonl` (D6), written by
[`../census/beat.sh`](../census). Identity: the name-stamp from the session transcript,
mantle colour from `summon/presets.tsv`, account from `summon/accounts.tsv`.

**The F5 law:** the census says what a
session *was doing*; `kill -0 pid` says whether it still *exists*. A SIGKILL leaves `Stop`
as the last line forever, so a state rendered from one sensor is a lie waiting to happen.
No pid, or a stale record still claiming work — **unknown, never working**.

**The design laws, rendered** (README §3; swept over every page at B9). **Two faces and
one rule between them**: `body` is IosevkaFelix, so numbers, titles, buttons and tables
are mono by default, and `.prose` opts running prose into **Inter — vendored**
(`assets/inter-latin-{400,700}.woff2`, SIL OFL 1.1 beside them, served off `/assets/…`).
IosevkaFelix is installed on the machine and referenced by family; **nothing on any page
reaches the network** — the only `url()` in either stylesheet is a local one, and no
served byte carries an `http` URL. **Encapsulation-first**: a card, row or panel leads
with the name its own text wrote — the head before the first seam, dash before colon
(`B8: glass hardenings` is one phrase), at most six words — and `[expand]` holds the
whole thing on a scriptless `<details>`. **Derivation never invents**: no seam, an
oversized head, or a disclosure that would reveal less than the card already shows, and
the text renders **whole** with no control at all. On the live city that is 11 of 38 rail
cards named and 27 whole, which is the row-17 evidence that the shapes need a **name
field** ([B9 F1](../plans/b9-visual-law.md#findings)) — not a fatter parser.
**No `<select>` anywhere**: every choice is a link or a radio wearing `.btn`, so the
browser holds the state and the back button walks it. **Legends** on `/` and `/city`,
always drawn, no control inside. **`/city` groups by `~/code/<x>`** — a worktree
checkout groups with its repo, a path outside the city is named rather than housed —
and **attention decides across groups while recency only orders inside one**
(`attentionOf`: live sessions → his pen → in play → filed → quiet).

**The auditor delta** (`gauges.ts`, on B5 E1's ruling): beside every WIP figure, one
approximate count of `claude` processes — `8 tracked · ≈35 claude processes visible ·
27 beyond the census`. It is a **count, never sessions**: it joins nothing, houses
nothing and never reaches a card, because the census stays the sole identity authority
(P1 F5). Today's gap is the pre-hook horizon and decays with it; a gap that reopens
afterwards means a sensor is lying. It matches `argv[0]`'s basename and drops the
harness's own `bg-*` helpers — B5 E1's `[c]laude` grep counted five shell snapshots as
sessions. Cost: **36 ms** per page, a spawn rather than a walk (B8 F3's bar is the work).

**cmux is truth for live identity** (B18, D16 — [`identity.ts`](identity.ts),
[`colors.ts`](colors.ts)). The census answers *what is alive*; it cannot answer *what Felix
calls it*, because `CMUX_WORKSPACE_ID` is stamped at hook time and never moves. So one
socket read — `cmux workspace list --json`, held, at most 2 s old — joins on that `ws` and
gives every session the name and colour cmux is wearing **now**; the rig's stamp stays as
the **birth name**, beside it where they differ, and neither is ever derived from the other.
`POST /hands/rename` and `POST /hands/recolor` write the other way (D18 class 2, display
state only), targeting by `sid` and resolving it to a **uuid** — a `workspace:N` ref that
does not resolve is delivered by cmux to the *focused* workspace, so a ref from a stale page
would rename whatever Felix is looking at (P6 F2). A read that fails keeps the last good
copy, marks it `stale` and says why; it never falls back to the birth name and calls it live.

**The colour map is felikai's, and the socket takes it verbatim.** Measured against a live
socket ([`lab/b18/colors.ts`](../lab/b18/colors.ts)): cmux accepts its sixteen names
case-insensitively, refuses `cyan`/`pink`/`grey`/`yellow` — four words the rig's own
`presets.tsv` spends — and accepts **any `#RRGGBB`**. So `colors.ts` maps the rig's ANSI
slot names through **Felix's felikai↔ANSI table** to felikai's own 600-level hexes: the rig's
`cyan` (Builder) is felikai **blue**, its `blue` (Digger) is felikai **orange**. B3 F1's
refused-colour fire deaths are closed at the cause, and the deck's swatch row offers those
intents and nothing else, so the page cannot compose a colour cmux will refuse.

**The jump, and why it used to do nothing.** `/hands/focus` reads `cmux tree` first: a
surface the desktop no longer carries is a refusal, not a jump into a workspace that may not
hold it. Then `focus-panel --panel <uuid> --workspace <uuid>` — **`--panel` resolves inside
one workspace, so the old call omitting `--workspace` answered `not_found`** — then
`focus-window`, and then `open -a <the bundle cmux itself names>`: **nothing on the socket
brings the application forward.** Measured with the deck in a browser: `OK` from cmux, and
frontmost still `Arc` through both socket calls (B18's findings).

Env: `GLASS_CITY` (default `~/code`), `CENSUS_DIR` (B1's own knob), `USAGE_DIR` (the rig's
caches — **rendered, never fetched**), `BELVEDERE_ENV` (the
credential), `FLOWS_DIR`, `DESK_DIR`, `GLASS_PORT` (4400) — all resolved **per call** in `paths.ts`, never frozen at
module load: a frozen anchor is hidden state, and it cost eight test failures (B8 §4).
Theme: [`felikai.css`](felikai.css), copied from `~/code/felix/src/felikai.css` — edit the
source and re-copy, never fork here.

**Known cost:** the register walk is **~9.5 s** over 50 795 directories, so it runs on a
worker thread ([`register.worker.ts`](register.worker.ts)) — on the request thread it
stalled 2 of every 20 page loads by 8.5 s (measured, [B3
§E1](../plans/b3-baton-rail.md#findings)). Warm, `/` is **p95 48 ms**; building pages
walk one subtree, 8–40 ms. The TTL policy was ruled 2026-08-27 — 300 s, bust on the
glass's own writes, a button for the rest ([B8](../plans/b8-glass-hardenings.md)); the
walk's own cost rides the canon inbox ([B2 §E1](../plans/b2-glass-spine.md#findings) has
the fold: `readdirSync({withFileTypes})`, 2.5×). The shelf's own scan — 723 transcripts,
35 MB of head windows — is **46 ms warm** and does not need a worker: three `/` loads
fired inside one shelf scan came back in 0.045 s · 0.068 s · 0.035 s (B5 DoD).
The deck's poll carries one more cost since B18: the identity read is **~161 ms of p50**
(`/deck/state` p50 67 ms with the socket read off, 228 ms with it on, N=10/12 live) — a
spawn, not a walk, so it yields Bun's thread and nothing queues behind it, and it is
**awaited rather than served warm** so a rename made in cmux is on the deck on the very next
poll (measured: 1 poll, 3 058 ms of a 3 000 ms period). p95 **234 ms** against the 500 ms
bar. If that ceiling ever matters, the named-not-built fix is a self-arming 1 s refresh
while a deck is polling, serving warm — it trades the wait for a spawn per second.
