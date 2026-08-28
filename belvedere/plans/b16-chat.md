# B16 — the Chat

**Status:** **LANDED** 2026-08-28 · **Depends on:** B11; P6 · **Staffing:** Builder ·
opus-high · **Blessed:** the deck keel, ✓ Felix 2026-08-27; this order
applies §5 and D18 write class 1.

## Goal

The voice. One chat view in the whole deck; any session — live, idle, dead —
hotswaps into it; the transcript reads in Focus, Felix's reply drafts in
Action, the two scroll independently, and **send** delivers his words as a
real turn through P6's proven transport. The note-app copy-paste era ends
here.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §5; **P6's findings — the transport law is
  consumed verbatim**: mechanism, wrapper bytes, verification read, failure
  faces. If P6 KILLED (no byte-exact mechanism), this order's send section
  is skipped whole and the Chat ships read + jump: the keel's named
  fallback, not a deviation.
- B13's seam; B15's session lists (hotswap entry points); B5's shelf joins
  (transcript discovery ×3 accounts — the data layer exists; the shelf page
  dies, the join lives).
- B4/B8 audit + unwind law; D10 (an ambiguous target never sends); B5 E2
  (omitted-never-guessed) — P6 Q3's resume-with-turn is its deliberate-send
  extension.

## Spec

1. **The tenant.** `chat` registers via the seam. Hotswap from any session
   row (Workshop, City expanded, needs-you queue) and after a composer fire
   (keel: summoning swaps the Chat in). One instance; swapping targets
   replaces the transcript and preserves the draft (drafts are per-target —
   see 4).
2. **The transcript (Focus).** Tail-windowed render of the target's
   transcript file (newest at bottom, scroll-up loads earlier windows);
   user/assistant turns styled per felikai; tool activity summarized to one
   encapsulated line each (dataviz first — the full record is one jump
   away). Live targets append within one poll (census `Stop`/beat-driven
   re-read); dead targets render their stillness honestly. **Transcript
   prose passes B20's decoder** — hovering `canon row 17` in an agent's own
   words decodes like everything else; fenced kickoffs inside transcripts
   stay exempt (B20 §1).
3. **Send (Action).** The draft box + send button, armed per D18 class 1:
   credential-gated, D10-bound (no unambiguous single target — no send),
   delivery via P6's mechanism per target state (live-idle · mid-turn ·
   dead/resume), **verified after delivery** by P6's transcript read — the
   UI shows sent → verified (sha) or the named failure face. Audited like a
   fire: sha + bytes, never the text.
4. **Drafts persist.** Every draft auto-saves per-target under
   `desk/drafts/` (the D17 home; B19 builds the desk proper — this row may
   mint only `desk/drafts/`, writes nothing else there). A draft survives a
   reload, a hotswap, and a server death.
5. **Batons in Action** (the vision's word): when the target's building has
   a live baton/gate for Felix, the Action pane surfaces it beside the
   draft — read-only wiring here (the queue's answer wires stay B14's).

## Acceptance criteria — the DoD

Two instruments, because the row has two halves that cannot be measured the
same way. [`lab/b16/probe.ts`](../lab/b16/probe.ts) drives a real headless
Chrome against a **fixture** census (the three hotswap entry points need three
sessions of known shape, one of them blocked on a permission prompt, and a DoD
run does not write beats into the live census — B8 F1).
[`lab/b16/send.ts`](../lab/b16/send.ts) runs against the **real** census and
the real city, because a send has to *locate* its target and only the live
census knows which cmux workspace a session is beating from; it fires one
sonnet·low probe through the glass's own hands, types into the deck's real
textarea, presses the real button, and compares shas with the transcript on
disk. Both leave nothing behind (D55).

- [x] **Hotswap: three entry points swap three targets into the one view; the
  draft written against target A is intact when A returns.**

```
PASS  hotswap — three entry points, three targets, ONE view
      City → builder-probe-01 · Workshop → digger-probe-02 · needs-you queue → architect-probe-03,
      and exactly one .ct-head on the deck at any moment
PASS  drafts are per-target: A’s survives a hotswap to C and back, C’s is its own
      A: "a draft for A\n\nwith a blank line in it" · C was empty when first opened and holds its own text now
PASS  the draft is on disk under desk/drafts, one file per target (D17, D18 class 3)
      …/desk/drafts — aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa.md and cccccccc-3333-4333-8333-cccccccccccc.md
```

- [x] **Transcript: this campaign's own Architect transcript renders
  tail-windowed with earlier windows loading; a live probe's new turn appears
  within one poll (timestamps).** The fixture run carries the dense case (a
  400-turn file, 443 kB, where one window is provably not the file); the live
  run carries the real one.

```
PASS  transcript — tail-windowed off a 400-turn file, tool calls encapsulated to one line each
      40 turns rendered (20 his) · 20 activity lines · window opens at byte 247081 of 443374
PASS  the decoder runs on transcript prose and stops at the fence (B20 §1, one grammar on)
      40 code words hoverable in the agents' own words · 20 fenced blocks · 0 decoder spans inside them
PASS  scroll-up loads earlier windows, and no turn is ever drawn twice
      40 turns → 80 after one [↑ earlier]; every data-key distinct
PASS  the transcript and the draft own their own overflow — the page never scrolls (B13 F4 kept)
      body 757 px − viewport 757 px = 0 px · transcript scrolls inside itself 11107 / 640 px · draft 150 / 150 px

PASS  a REAL Architect transcript from this campaign renders tail-windowed, and pages backwards
      architect-agents-03 · 2265 kB · /Users/felix/.claude/projects/-Users-felix-code-agents/d28a1397-…jsonl
      1 turns in the tail window → 5 after one [↑ earlier]
PASS  the probe ACTED on it, and its answer reached the deck within one poll (3 000 ms)
      the transcript's assistant text carries "pomegranate-7714"; the last line reads "ACK pomegranate-7714"
      written 2026-08-28T12:50:07.758Z → on screen 2026-08-28T12:50:08.142Z = 384 ms of a 3 000 ms poll
```

- [x] **Send, live: a multi-line message with a blank line, sent from the deck
  to a live idle probe session, arrives as ONE user turn, byte-exact, audited;
  the probe acts on it.** Typed into the rendered textarea, sent by the
  rendered button, and the sha compared against the transcript read straight
  off disk by the instrument — a comparison, not an argument.

```
PASS  SEND, LIVE — one multi-line message with a blank line arrives as ONE user turn, byte-exact
      draft   174 B  sha 237dd6f33cc0a49b31f7723535fc720dc487efe545e212714e2da194127a9e73
      turn    174 B  sha 237dd6f33cc0a49b31f7723535fc720dc487efe545e212714e2da194127a9e73
      user turns 1 → 2 · the transcript grew 7926 B
      the deck said: delivered · live · 174 B · sha 237dd6f33cc0a49b… · 2763 ms
PASS  a delivered message empties the box, and the receipt outlives the repaint that proves it
      box: "" · receipt: delivered · live · 174 B · sha 237dd6f33cc0a49b… · 2763 ms
```

- [x] **Send, dead: a message to a dead session resumes it with that turn (P6
  Q3's shape) — transcript evidence, silo intact.** The workspace was closed
  under it first; the census called it `gone`; the same uuid, the same file.

```
PASS  SEND, DEAD — the resume carries the turn, byte-exact, into the SAME transcript and the same id
      mode resume · 51 B · sha a8a90c1dd326a238…
      user turns 2 → 3 · same file /Users/felix/.claude/projects/-Users-felix-code-agents/1dc492b4-…jsonl
      the prior conversation came with it: first turn is "You are a transport probe for Belvedere's B16 ro"…
PASS  the silo held — the transcript is still under the account that fired it
      /Users/felix/.claude/projects/-Users-felix-code-agents/1dc492b4-…jsonl
```

- [x] **Failure face: one induced failure renders its named face; nothing
  reports delivered without verification.** Three, and the two that matter most
  are refused *before* a cmux call. The `box-not-empty` face was induced live —
  a draft put into the pane's own box through the socket, then a send attempted.

```
PASS  face — an unknown target: refused by name, and nothing is delivered anywhere
      409 no session 00000000-0000-4000-8000-000000000000 — neither the census nor the three transcript trees know it
PASS  face — the box is not empty: refused, quoting what is already in it (P6 Q4-F5)
      409 box-not-empty: the pane's input box already holds "HALF A DRAFT FELIX WAS TYPING".
          The transport appends, it never replaces, and there is no key that clears it safely (P6 Q4-F5).
PASS  refused at compose, before a single cmux call: a TAB and a leading slash (P6 T6/T8)
      tab → 400 · slash → 400 refused at compose — command: a first line starting "/" is read by the TUI…
PASS  every send is audited with its sha and its byte count, and the WORDS are nowhere in the log
      4 message lines: ok 174 B 237dd6f33cc0a49b · refused 6 B 6382b3cc881412b7 · refused 33 B ee5c531495afe39f · ok 51 B a8a90c1dd326a238
      "pomegranate-7714" appears in the audit 0 times
```

  The three verdicts that are *failures* — no new turn, more than one, or a
  sha that differs — are pinned in the suite over real appended bytes:

```
✓ one new turn whose sha matches is delivered; anything else is not
✓ TWO new turns is the split P6 exists to catch, and it is never retried
✓ no new turn inside the budget is UNVERIFIED — never "sent"
✓ the appended region is what is read — earlier turns are not new turns
```

- [x] **Draft persistence: kill the glass mid-draft (B8's drill pattern),
  relaunch — the draft is there.**

```
PASS  draft persistence — the server was killed mid-draft and the words came back
      reloaded against a fresh process; the box holds "a draft for A\n\nwith a blank line in it"
      (the target is remembered too)
```

- [x] **Zero sends possible with hands disarmed (503 + honest banner); zero
  send wiring when the target is ambiguous (structural grep, D10).** The
  control is not disabled — it **does not exist**: `can` is decided
  server-side and the reason stands where the button would have been.

```
PASS  hands disarmed — ZERO send wiring in the DOM, and the route answers 503 (D10 as structure)
      [data-chat-send] × 0 · POST /chat/send → 503 hands disabled — no credential at …/no-credential-here
      · the draft is untouched
PASS  cold hands never cost him the ability to write it down (B6 F3’s law, second venue)
      POST /chat/draft → 200 with no credential — a file write under desk/ sits in FRONT of the arming switch
PASS  the Chat cannot fire a session: 0 in its source, and the bundle still carries the one
      chat.client.ts 0× · /deck.js 1× (composer.client.ts, the one file allowed to — keel §3)
PASS  and the DOM check subtracts the text (B17 F1): markup, not a rendered string
      data-chat-send in outerHTML 0× · in textContent 0×
```

- [x] **Suite green one process; type gate exit 0; probe workspaces closed.**

```
$ bun test belvedere/glass
 555 pass · 0 fail · 1470 expect() calls · 22 files [2.2s]

$ cd belvedere/glass && bunx --offline tsc --noEmit
type gate exit=0

venue before: workspace:24 belvedere · workspace:2 mentat
venue after:  workspace:24 belvedere · workspace:2 mentat

PASS  the Chat rides the one poll and the one timer (B13 F5’s shared budget)
      /deck/state p50 58.0 ms · with ?b= and ?s= p50 59.2 ms p95 115.8 ms (N=12, live register)
```

## Out of scope

- Group sends, broadcast, cross-session threads; rendering images in
  transcripts (the images chapter); a per-session chat multiplex (there is
  ONE view — keel non-goal); any desk feature beyond `desk/drafts/` (B19).

## Findings

**LANDED 2026-08-28 — the voice works, and nothing escalated.** The note-app
copy-paste era is over: his words leave the deck and arrive as one user turn,
byte-exact, into a live pane or into a session that was dead five seconds ago,
and **nothing is called delivered until the transcript says so.**

The send is D18's write class 1 and it lives **outside `hands.ts`**, on B11's
own precedent (`flowRoute`): `/chat/send` is credential-gated at its own door,
audited through `hands.ts`'s `audit()`, and reaches the world only through the
`cmux()` the hands already own. The fence's write list is unchanged — class 1
for the send, class 3 for the draft, and the read is a read.

**F1 — the poll's query has a second key, and it is a sixth seam member rather
than a second meaning for the first.** `needs(focusState)` names a *building*;
B16's `asks(focusState)` names a *session*. They are two members because the
ontology has two levels with a surface — City → Building → **Agent** (keel §3)
— and a parameter whose value is sometimes a slug and sometimes a uuid is
exactly the ambiguity class this building spends its time refusing. Additive
the way B15's fifth member was: a tenant that omits it asks for nothing, and it
is still **one endpoint and one timer**. Measured over the live register, N=12:
`/deck/state` **p50 58.0 ms** bare · **p50 59.2 ms / p95 115.8 ms** carrying
both `?b=` and `?s=`. The cross-pane cell grew the same way — `selection`
is now `{building, session, awaiting}`, one named cell per level.

**F2 — a bounded read that pages *backwards* and a bounded read that starts at
a *known boundary* are two functions, and conflating them silently eats the one
turn the verification is looking for.** `windowOf` drops its own first line as
a possible partial (`census.ts`'s law, correctly). The verification read's
`from` is the file's size *before* the send — a line boundary by construction —
so reading it through `windowOf` dropped the first appended record, which is
the delivered turn itself, and the send reported `unverified` after a full
45-second poll. Caught by the suite before any probe ran, and fixed with a
second reader (`readFrom`) rather than a flag on the first. **Any row that
verifies an append inherits this**: the two reads look identical and differ in
exactly the record that matters.

**F3 — a probe cannot be waited on by its words, and it must never be waited on
by its name.** Two instrument bugs, both general:
(a) P6 F6 said a probe cannot be *instructed* into a long turn; this row's
mirror is that it cannot be instructed into a *phrase* — told to "say READY
now", the probe applied its own standing rule and answered `ACK now`, and an
instrument waiting for the literal string waited 150 s for nothing. Wait on the
census: `Stop` is the idle sensor (P1 F1).
(b) **A fixed probe stamp latches onto a previous run's dead session.** The
census keeps every session it has ever heard, so `find(s => s.stamp === STAMP)`
matched a workspace closed ten minutes earlier — with a `ws` field still on it
— and the instrument then waited for a corpse to go idle. The stamp is unique
per run now and the search excludes `gone`. B11 F2's name-stamp join is safe
because it reads the run log's own fire; **anything that searches the whole
census by stamp inherits this**, and it is D10's own lesson arriving in the
instrument rather than in the glass.

**F4 — the desk's first files are untracked, and whether a draft is committed is
not this row's call.** `desk/drafts/<sid>.md` is D17's home and D18's class 3;
the canon repo has no `desk/` yet and no ignore rule for one. D17 says the desk
is "gitted, versioned" and a *note* plainly should be — but a half-typed reply
is per-viewer scratch, and this row will not decide that by writing a
`.gitignore` on its way past. **Named, not built**: B19 builds the desk proper
and the Architect owns the rule. Until then a live send leaves untracked files
under `desk/drafts/`; both probes point `DESK_DIR` at a temp tree, so no DoD run
has written one.

**F5 — HALT does not stop a send, deliberately.** The flag's consumer is the
engine (B11 §5): it stops *automation*. A HALT that stopped Felix from talking
to his own agents would be the opposite of what the flag is for — the whole
reason to hit HALT is usually that you need to say something to a session by
hand. Named here so the next row does not "fix" it.

**F6 — the compose-time refusal list is wider than P6 measured, and says which
is which.** P6 measured a literal TAB (T6, swallowed by the TUI) and a leading
`/` (T8, zero user turns). `!` (bash mode) and `#` (memory) are "the same family
by construction, not separately measured" — refused here anyway, because
refusing more is safe and a `!` that ran as a shell command in his session is
not a failure anyone wants measured live. One further refusal is this row's:
**a message that `sanitizeSummons` would rewrite is refused rather than
sanitized.** Both hands already sanitize; letting it run silently would mean the
glass editing his bytes so that its own sha would match, which is precisely
what P6 F3 forbids. `refusals()` is pure and lives in `deck-model.ts`, so the
reason he reads as he types and the reason the route refuses are one function.

**F7 — the box precheck is the only screen-scrape in the building, and it is
bounded on purpose.** P6 Q4-F5's precheck reads the TUI's input box off
`read-screen`; the live pane puts the caret at column 0 (`❯ ` between two rule
lines, measured), but cmux hands back the *whole* screen and a framed prompt
would put it mid-line — so the read takes everything after the **last** `❯` and
strips only the box-drawing run that closes the frame. ASCII `|` is deliberately
not stripped: a message ending in a pipe is a message, and reading it as an
empty box is how the transport ends up appending to something he was writing.

**The chain's own probes, re-run whole against this row's client:
B13 · B14 · B15 · B20 · B10 · B11 — ALL GREEN, six for six.** The seventh,
`lab/b17/probe.ts`, fails exactly the two assertions B11 F8 already filed
(`9 of 9 cells`, and the throw behind it), reproduced from B17's own landing
commit and unrelated to this row — with one detail added to that filing: when it
throws it does so *before* its teardown and leaves its live workspace open
(found and closed by hand; [ISSUES](../ISSUES.md), this date).

**F8 — the composer's post-fire swap travels through the seam's cells, not
through an import.** The keel says summoning swaps in the Chat, but a fire
answers a workspace and **no session id** (B11 F2), so `composer.client.ts`
writes the name-stamp into `selection.awaiting` and calls `swap.to('chat')`;
the Chat latches the moment the census names that stamp, and honestly says it
is waiting until then. Doing it by importing the Chat would have reordered the
tenant registry (the Workshop imports the composer), which is a visible change
to the swap bar for a feature that needed neither.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
~/code/agents/belvedere/plans/p6-message-transport.md findings,
and ~/code/agents/belvedere/plans/b16-chat.md,
and build it to its DoD.
```
