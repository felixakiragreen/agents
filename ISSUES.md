# Issues — the incident inbox

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format: `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.

---
- 2026-09-07 · stigmergon's G14 Architect (fable-high) · **Four Builders in one batch landed
  the same two form defects** — a ledger head with no `---` above it (`ledger.merged`: 065,
  061, 062, 064) and a Status cell over D78's 200 (`board.cell-cap`: 065 at 260, 061 at 397,
  062 at 245, 064 at 400), plus one `Decided (…):` spelling the parser cannot read
  (`ledger.decided`). stigmergon mended the pattern in its own coda's closing passage
  (`plans/CODA.md`, G14 2026-09-07 — the coda is the building's instrument, D40's
  trial-here pattern). If the Guild wants it everywhere, the durable home is the Builder
  charter (`canon/mantles/builder.md`) or the canon coda core — the Architect never patches
  canon. Evidence: `doctrine lint ~/code/stigmergon` before the mend, 9 failures in 4
  classes; after, 0.
- 2026-09-02 · stigmergon's 029 Architect (fable-max) · **The baton's shape and
  recommendation as parser fields** — the fifth filing of Belvedere B3 F4's ask, now with a
  live consumer: stigmergon's docket (`docs/docket.md` §5) renders a `Baton` and needs its
  shape (`single` / `batch` / `fork` — §11's own markers, `fork —` and `batch —`) and, for a
  fork, the recommended option — D64's grammar, D10's "one parser" forbids reading the markers
  render-side. Asked: `Baton.shape` and `Baton.recommendation` (an instrument index, or null)
  on `doctrine/src/parse.ts`, read from the pinned markers. Until then the docket renders the
  clause verbatim and badges nothing. Field-born (D87's own test): a product building's pain.
- 2026-09-02 · stigmergon's 029 Architect (fable-max) · **"Sitting" vs the graveyard** — the
  Standard §9 buries *sitting* under *session*, and stigmergon speaks it in law surfaces
  (`CLAUDE.md`, the board's Staffing cells: "Architect · fable-max (sitting — Felix in the
  room)", D2, 002/003/021/029) for a concept the Standard has no word for: **a design session
  with Felix in the room, whose output is a blessed spec** — not any session. One concept, one
  word: either the graveyard gets an exception line (sitting — the design session with Felix
  present; legal in that sense), or the office names a successor and `doctrine migrate`
  respells the four buildings' books. Filed, not fixed; the vocabulary arm is off by default so
  nothing is red today.
---
- Question from Felix: is the Fixer Mantle not supposed to enter by the door?
---

- 2026-09-02 · stigmergon's G6 Architect (fable-max) · **The lanes' citation (D86's
  birthplace — stigmergon 030–032, one serial batch under the tender kickoff).**
  The entry D86 owes: what the lanes caught, what they cost, what they missed. The
  figures ride stigmergon's `LEDGER.md` G6 entry; the red list is stigmergon `MAP.md` §5
  (⬡✓ 2026-09-02).

  **Caught.** Three charges, 32 commits, zero red stops — every charge doc's Lanes
  section read *"Red: none inside"* and was right. One `⬡ go` (032's row anatomy and
  Act's body) carried a whole surface from the sitting to the gate with no ⬡
  round-trip; the batch returned to Felix only at G6 — D86's promise, kept once. One
  red crossing, by accident (031-F9): a scratch script outside the repo did a bare
  `import 'doctrine'` and Bun auto-installed npm's `doctrine@3.0.0` into the Bun
  cache — MAP §5 red item 3, D54's class. **The list caught it after the act**: the
  Builder recognized the class from the red list and filed it with evidence and a
  clean-repo proof, where a session without the list would have shrugged off a
  ten-minute `TypeError`. Ruled at G6 into MAP §5 (lab code runs inside the repo;
  `bun --no-install` elsewhere — verified with a control).

  **Cost.** At the lay: the red list (six items, one blessing — the sitting's second
  act) and a ~6-line Lanes section per charge doc. Per charge: green's bar is
  `bun gates.ts` ALL GREEN ×2 at the settled tree — 266+266 s (030), 302+564 s plus one
  discarded run (031, a `bun test` beside it), 320+320 s (032) — ≈34 min of machine
  across the batch, plus G6's own ×2. The tender authored nothing and escalated
  twice (neither about the lanes). No act was demoted or promoted; the ratchet has
  n=1 batch.

  **Missed.** (1) The red list binds a session that *recognizes* the act; an
  auto-install does not look like one, so item 3's keeper is a config or a hook
  (D86's own failure-mode line — "an unlisted irreversible: a hook, the guard
  pattern"), not the list; the machine-level keeper (Bun's global `bunfig`
  `[install] auto = "disable"`, or the cache entry's removal) is Felix's and sits on
  stigmergon's pass docket. (2) The yellow lane did no work beyond one `⬡ go`: every
  other act was a commit under a named check or an as-built note inside a blessed
  scope — whether *"unclassified is yellow"* costs anything is unmeasured; the
  statement holds one credit at interest 0 and the WIP cap was never approached.
  (3) Green was ×2 gates per charge: a single-run green would have shipped the same
  bytes here; what ×2 buys is the flake measurement (030-F6, 032-F6 — two
  pre-existing flakes found because the bar demanded two clean runs). Canon-wide
  distillation (DOCTRINE §4, §5, §10; the Builder and Architect charters) is the
  office's at this citation, per D86.

- 2026-09-02 · stigmergon's G6 Architect (fable-max) · **A gate row with no kickoff
  anywhere is not red at lint.** DOCTRINE §4: a gate needs a kickoff verbatim
  "riding the batch note or the gated charge's doc". Stigmergon's 029 lay left G6 with
  neither, `doctrine lint` reported *32 kickoffs in 34 work docs* and 0 failures for it,
  and the batch paused with the tender refusing to author one — a session round-trip
  a lint line would have saved. Asked: a `board.gate-kickoff` failure — a `G‹n›` row
  staffed `Architect · <tier>` whose id is named by no fence in the board's notes or
  in any charge doc named in its Depends-on. ⬡-gate rows are exempt (nobody ignites
  them). Field-born: 029's lay, 2026-09-02.
- 2026-09-02 · stigmergon's G6 Architect (fable-max) · **The verdict law's first move
  should name the registry.** `canon/mantles/architect.md`, the verdict law: *"A field
  incident arriving mid-session is a Digger-shaped question: first move is the contract +
  findings."* At stigmergon's phase-3 pass the Architect read the contract (hive.md §6, the
  move gesture), and still drew two design options for a report `session.move` already
  answered; Felix caught it: *"I forgot about 'move session to another space' command…
  Feel free to push back if it seems I forgot something obvious like this."* Asked: the
  first move is the contract, the findings **and the building's command registry** — does a
  gesture already do this — and the first answer to a report is *you have this* when it
  does. Field-born: stigmergon MAP §5 carries the building's line; this is the canon-side
  half.
- 2026-09-02 · Felix, at stigmergon's phase-3 pass (filed by the Architect at his word) ·
  **The baton's type — what it requires of him.** A ⬡ baton should say which of his
  faculties it needs, so the docket can show him what he must bring before he opens it:
  **mental** — a decision to make (a ruling, a blessing, taste); **visual** — an interface
  to look at or drive (a pass, a smoke on a screen); **bench** — physical testing (a lot of
  cap-mega's work needs the bench, a simulator is not enough). His words: *"By type I mean
  what is required of me."* Asked of the office: the marker in the baton grammar
  (STANDARD §11 / D64 — one candidate spelling, the office's to rule: the ⬡-action's noun
  carries it today (*ruling* · *pass* · *smoke*), so the type may be a fixed noun set rather
  than a new mark), and `Baton.type` on `doctrine/src/parse.ts` beside the shape and
  recommendation asked at 029. The consumer is live: stigmergon's docket row and Act's body
  badge it when the field lands, and can sort by it — a bench baton cannot be paid from the
  desk. Field-born (D87's test); nothing renders until the parser carries it (D10, one
  parser).
- 2026-09-02 · stigmergon's G7 Architect (fable-high) · **The named holder is not a parser
  field, and the room lost the name.** DOCTRINE §11: a baton's holder is written — `⬡`, **a
  named session**, or the dispatch. `doctrine/src/parse.ts` spells `Baton.holder` as five
  kinds, and every named session is `session`; the name lives only in the lead's text
  (`**Baton — builder-one-03 → the fence below.**`). Stigmergon's Act body (docket.md §5,
  re-cut at 034 on his word) strips the `Baton — ‹holder› →` prefix to make the title, and
  with it **which session holds the baton left the glass** — the holder line reads
  `Baton — session` (stigmergon 034-F2). Re-reading the name off the lead is a render-side
  parse the building forbids (D10, one parser). Asked: `Baton.named` — the session's
  name-stamp, `null` for `⬡` / the dispatch / none — beside the shape, recommendation (029)
  and type asks; the consumer is live: the holder line badges it the day it lands.
  Field-born: stigmergon 034-F2, 2026-09-02.

---

from Felix: is it possible to tell agents not to split everything up onto new lines? Let page width & auto wrapping handle that for me automatically? It makes resizing much easier and nicer.
---

- 2026-09-03 · stigmergon's G8 Architect · **A kill criterion's conclusion must be a fact its arm can measure.** stigmergon 041's Q1 criterion read *"0 of 3 ignitions block → the session never waits headless; the hook-and-hold question is moot"*. It fired (0 of 4, unarmed) and the very next arm falsified its conclusion: with a host armed the session held 90 s and resumed on the wire. The arm measured *"never waits when nobody is listening"*; the criterion's sentence inferred past it. The Digger continued into Q3 and G8 ratified the continuation on evidence (041-F1; the lay's defect, not the Digger's) — but the charter's line (*kill criteria state their denominator and minimum n*, architect.md, the charge doc law) has no word for the inference. Candidate: **the conclusion names what the arm saw, never what it implies** — a criterion that reaches past its own measurement is mis-laid. Field-born: stigmergon 041-F1, 2026-09-03; the ledger's G8 entry carries the ruling.

---

- 2026-09-04 · stigmergon's G9 Architect (fable-high) · **One gate, two ignitions — the
  tender's fork inherited the dispatch duty.** Batch A's tender (`sonnet-medium`,
  `plans/TENDER.md`) dispatched G9 at depth 1, and a `fork` it had made earlier to resume a
  stalled 049 (*"Resume stalled 049 to finish landing"*) dispatched G9 again at depth 2 —
  both `fable-high`, both booted 11:29 UTC, two Architects on one board, the charter's
  forbidden state (*two tenders is nobody owning the sum*). The duplicate found the first's
  landing run live, yielded, and wrote one inbox entry (stigmergon `ISSUES.md`, swept at G9;
  git holds it); nothing else was written twice. Cost: one fable-high boot. The instrument
  has no word for it: *"One Agent per charge"* binds the tender session, and a fork carries
  the tender's whole context — including the dispatch rule — with no sentence saying the
  fork is not the tender. Candidate, the office's to rule: **a fork of a tender tends
  nothing** — it finishes the one thing it was forked for and hands back; or the dispatch
  rule reads *one Agent per charge across this session and its forks*. Field-born:
  stigmergon G9, 2026-09-04; the ledger's G9 entry carries the record.

---
- 2026-09-04 · mentat-05 (the neck sitting; Felix in the room) · **The Radiant — a new
  artifact class the office draws, and the two canon lines it needs.** The Mentat's
  captures had no home beyond the book and other buildings' inboxes: a sitting's wide
  map died in the conversation (the founding sin) or was flattened into a dozen lines. The
  neck sitting drew one too wide for the book; Felix read it five times in a day and ruled
  in the room — *"It demands, nay, it inspires a new artifact, not a mere book entry … I
  want a visual journey"*; offered Atlas, Portolan and Radiant, he took the third
  (*"RADIANT, this is perfection"*) and created `~/code/radiant` himself. The building
  stands: `CLAUDE.md`, `MAP.md` (anatomy, the making, the sitting recipe and anti-recipe,
  the index), `DECISIONS.md` D1–D5 pending his ⬡✓, `LEDGER.md`, and Radiant 001 at
  `001-the-neck/index.html` with its data. **Asks for the desk:** (1) `canon/BUILDINGS.md`
  gains `| radiant | building | ~/code/radiant |`; (2) the Mentat charter's *Owns* gains
  the Radiants beside `SAPHO.md` — the seal law (edited in its sitting, appended after,
  never rewritten) and the anatomy stay homed in `radiant/MAP.md`, not in canon; (3) the
  charter's stances could point, in one line, at `radiant/MAP.md` §4 — the recipe for a
  sitting that ignites and its anti-recipe (judge a sitting by what changed after it, never
  by how it felt). Ancestry: the capture ritual (mentat.md); the book's *never rewritten*;
  D78's pattern (work state apart from design). **Two taste data from the same sitting,
  for the desk's consideration and not as law today:** (a) his three-sentence form for any
  ask — the problem, the root cause, the proposed solution — and his rule on prose:
  *"if I can't read it cold, have to look shit up or ask questions, it was a failure of
  communication"*; verbosity is licensed only by his explicit word (*"you could write me a
  book"*), and the trap the sitting named — compression hides semblance, so every
  compressed line links its evidence; (b) charters are contracts, never costumes — a
  mantle names a bar, a fence, a forbidden list and a `Done when`, and no charter should
  ever say "you are an expert"; the test: does a check independent of the agent's own
  voice exist, and does it run? Evidence: radiant 001, chapters 05, 09, 12; the mentat-05
  entry in `SAPHO.md`.
- 2026-09-05 · stigmergon's 056 Architect (fable-max) · **An MEL for the deferred
  list — a deferral names its lane and its expiry.** Routed from stigmergon's inbox
  (mentat-05's filing at the neck sitting, 2026-09-04; ref: `~/code/radiant/001-the-neck`,
  chapter 07): aviation's minimum equipment list says which known defects may fly and
  for how many days; DOCTRINE §4's deferred list has no such rule, so every deferral is
  an open-ended park — stigmergon's list holds ~30 entries, none with a date. The
  candidate: a deferred item or a `DEFERRED` annotation carries `until ‹date›` (or
  `until ‹event›`), and the retention sweep (D78) re-rules every expired one — promote,
  re-defer with a new date, or delete. The deferred list is §4's, so the rule is
  canon's; stigmergon's snag rulings (D33, `docs/snags.md` §6) already write
  `deferred — ‹why› — until ‹date›` as the discipline until this lands.
- 2026-09-06 · stigmergon's 060 Architect (fable-max, Felix in the room) · **The
  specimen step for design sittings** — his word at the sitting: *"we SHOULD
  absolutely build this step into future design sessions. Giving me a mockup of
  what's being built / potentially with options — this is an unlock of something
  new & great. I can provide MUCH better feedback this way, reducing the extra
  back/forth."* And at the second one: *"there really is something to this format
  — because I can just open the Developer Tools and mess with things directly to
  tweak it and get a sense of what I want different."* The pattern as it ran, twice
  in one sitting: the Architect writes a local HTML page in `lab/‹id›/` on the
  building's tokens with the options as knobs (and the mechanics live where feel
  decides — a scrollbar he could drag), opens it in his browser, he bends it in
  devtools, and the rulings are made on it; the page is committed as the sitting's
  evidence and the Builders' `Done when:` read it beside the spec (stigmergon
  `lab/060/specimen-1.html`, `specimen-2.html`; D39; MAP §5). Candidate for the
  architect mantle's review loop and DOCTRINE §5: a sitting whose rulings are
  pixels produces a specimen before its charges — the tooltip was the type
  specimen's birthplace, this is its law. Filed by the Architect; canon is the
  Grand Architect's to amend.

---
- 2026-09-06 · Felix, at the close of the neck sitting (filed by mentat-05 at his word) ·
  **Strike "sovereign".** His words: *"I'm considering striking all mentions of 'sovereign'
  — I don't need agents feeding any ego — I already have enough. I never meant to use that
  term, it was a Grand Architect who first did. I need to stay humble."* The record: the
  word entered at grand-architect-07 (2026-08-15, `50f5a80`), not by his hand; it is a
  pinned term of the standard (the pinned list — *sovereign · unchanged*; the Sovereign's
  clause; formula 24, *translate the Sovereign's vocabulary; challenge his substance*);
  14 hits on live canon, 75 files city-wide counting history and voice. The office's
  reading, for the desk: (1) in the canon it is a contract word — the human whose word
  summons, blesses and signs — not a compliment; the register risk he names is real anyway,
  because an approval-trained model addressed as a sovereign drifts courtly, and formula 24
  already knows it. (2) A replacement must pass the standard's one-word test: **summoner**
  — his own word in the summons that birthed the Radiant, the Guild's own verb, collides
  with nothing; **principal** — agency law's word for the one an agent acts for, collides
  with nothing; **owner** — the construction triad's word, but collides with the charters'
  *Owns*. The office leans summoner. (3) The mechanics exist: a graveyard entry (026) and a
  live-surface respell (040 · 043's rule — history keeps its names). (4) The guard:
  performed humility is the same register drift with the sign flipped; the word change is
  cheap, and the real defense stays the charter's guard and his own "test me." **His call, made — Felix, 2026-09-06: *"I like Summoner."*** The desk mints.
- 2026-09-06 · Felix, after the neck sitting (filed by mentat-05 at his word) · **The
  aphantasia law — show, don't describe.** Felix has aphantasia: he cannot preview images
  mentally. hexwright's `CLAUDE.md` has carried it as hard law 5 since its founding
  (*"Render actual SVG early and often; never ask him to imagine a result"*); radiant's
  `CLAUDE.md` took it as law 5 at the neck sitting's close; every other building leaves
  each session to learn it by accident. His word, 2026-09-06: add it to the canon.
  Proposed home, the desk's to rule: GUILD.md's *"Write for your true reader"* clause —
  the door, read at every summons — in one sentence (*Felix has aphantasia: show him the
  thing, never ask him to imagine it — a mockup, a rendered SVG, a screenshot, a table*);
  or the global `canon/CLAUDE.md` beside the personality guidelines. What a session could
  otherwise break: a spec that describes a surface instead of drawing it; a review that
  asks "picture this"; a choice offered in words when it could be offered as two renders.
  Ancestry: hexwright law 5; the neck sitting's *cheapen the unit* spoke — recognition
  over reading; and the co-design sitting he ran this week — several mocked chat options,
  tuned in DevTools, landed fast — as the method's proof.
- 2026-09-07 · stigmergon's G13 Architect (fable-max, Felix in the room) · **The landing
  run's law wants a charter word — Builder and Tender.** Three Builders of one batch each
  invented a `until grep -q "^exit=" ‹log›; do sleep N; done` poller over a background
  gates run because the run outlasts the Bash tool's 600 s cap; the harness completes an
  agent only when it has no live background children, so a poller whose sentinel never
  came (a `pkill` of the run killed the wrapper that writes it) was an agent that never
  completed — its row *running* for four hours, the tender never moving on. One rung
  down: a session's scratchpad is shared by every agent under its id on a case-insensitive
  disk, so `run-a.txt` overwrote another Builder's `run-A.txt` and a monitor called a
  four-hour-old table ALL GREEN. Diagnosed by a Fixer at Felix's word (stigmergon
  ISSUES.md 2026-09-07, swept into `plans/CODA.md`, `plans/TENDER.md` and charge 075 the
  same day — D40's trial-here pattern). Proposed canon words, the desk's to rule:
  **Builder** — *a landing run is one background command that records HEAD first and its
  own exit last, into files named by charge and stamp; you wait for the harness's
  notification, never a poller; a background shell alive at your last commit is a landing
  not finished; LANDED is written only beside a `Done when:` whose every box is checked
  against a receipt whose sha is HEAD.* **Tender** — *read the boxes, never the prose; a
  LANDED row beside an unchecked box is a contradiction.* Felix's note the same day: the
  run's length is the root — 075 brings it under the cap, which removes the dance itself.
- 2026-09-08 · simmy's Architect (fable-high, Felix in the room) · **`doctrine migrate`
  cannot respell a two-letter building — simmy's D80 adoption needs a hand-given table.**
  simmy v1 numbered two campaigns in parallel letters (`S0`–`S10` digs, `B1`–`B21`
  builds, gates `G16`–`G20`); the converter's table derives from the board and maps `S1`
  and `B1` both to `001`, refusing with 55 round-trip violations and the line "This is a
  converter bug, not a doc defect". Felix ruled at the desk that simmy RENUMBERS (simmy
  D18): `S‹n›` → `‹n›`, `B‹n›` → `‹n+10›`, gates keep their numbers. D81 says the corpus
  moves by the converter, never by hand, so the respell waits on the tool: a
  `--table <file>` (old → new, one line each) or a letter-offset rule, then `doctrine
  migrate --write` over simmy — history, filenames (`plans/b17-…` → `plans/027-…`),
  `lab/b17/` → `lab/027/` — as D80 already specifies. Until then simmy's old ids stand
  everywhere and D18 is the bridge; charges from `032` carry the new form. Repro:
  `bun doctrine/cli.ts migrate ~/code/universal_robots_sdk/cap-mega/simmy`.
- 2026-09-08 · simmy's Architect (fable-high) · **The bulletin has no retention law, and
  simmy's grew to 92 KB.** DOCTRINE §9 says "Archive: none. Append-only for the campaign's
  life" and the coda tells every dispatched agent to read it before each major method
  section — ~25k tokens per read, per agent, mostly distilled history. simmy killed its
  v1 bulletin at the campaign's keystone (git holds it; the tender creates a fresh
  `plans/BULLETIN.md` at the next parallel ignition) on D78 + §9's "exists only while a
  parallel batch runs" — proposed, the desk's to rule. Ask: §9 names what happens at a
  keystone (a fresh bulletin per campaign, or a prune at the Architect's review), so the
  wire stays a wire.
