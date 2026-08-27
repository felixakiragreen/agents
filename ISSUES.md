# Issues — the incident inbox (D49)

Field reports and canon-fold candidates land here — Felix's hand, or a session's at
his word. Entry format (D63): `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled fold or
no-fold, then deleted — the D-entry records a fold, the sweep's ledger line records a
rejection, and git keeps the bytes (entries are committed before they are drained).
A swept inbox is empty.

---

- 2026-08-26 · 18d Architect (bob) · **`doctrine lint` rejects `unrecorded` in a tier
  slot**, so D63's typed absence cannot be written where a board row's Staffing has no
  recorded tier. theseus T15 is the live case: mantle citable (`Architect`), tier
  recorded nowhere, so `Architect · unrecorded` is the honest cell — and it lints
  `board.tier — unknown tier`. It is bob's only remaining failure. Row-16 follow-up:
  either `unrecorded` joins the tier/mantle vocabulary, or D63 says the typed absence
  stops at the decision's decider and boards must carry a real tier.

```
$ doctrine lint ~/code/universal_robots_sdk/bob
     1  board.tier
  ~/code/universal_robots_sdk/bob/docs/campaigns/theseus/README.md:107: T15: "unrecorded"
```

---

- 2026-08-26 · 18d Architect (bob) · **§4's Depends-on has no form for a cross-building
  dependency.** lunchbox O2 really did depend on theseus T12a merging — two campaigns,
  two boards, two buildings in the register. The two legal forms are a row id *on this
  board* and `Felix-gate: <text>`, and it is neither. Migration parked it in a note
  under the board, which keeps the fact and loses it from the graph. Live wherever one
  campaign gates another (bob has three; cap-mega more). Options for the Grand
  Architect: a qualified id (`theseus:T12a`), a gate row per crossing (D44 read
  literally), or a ruling that cross-building sequencing is batch-note territory and
  the column stays strictly local.

---

- 2026-08-26 · 18a Architect (agents) · **the `unrecorded` gap is wider than 18d's
  entry** — it hits the ledger head's *mantle* slot too, and it is the whole of this
  repo's residual lint. 18a wrote 25 `unrecorded` tiers into `LEDGER.md`, 1 into
  `MAP.md` row 0's Staffing, and 1 `unrecorded` **mantle** (2026-08-07, the
  unsummoned forensic session — D26's null mantle, which by law has no mantle). All
  27 lint as `unknown tier` / `unknown mantle`. `doctrine/` contains zero occurrences
  of the string: D63's amendment was countersigned *after* row 16 built, so the tool
  never learned it. Row 18's own DoD ("0 failures … every `unrecorded` counted per
  building") cannot be satisfied by any building that needs one. Note for the ruling:
  D26 makes the null mantle lawful, so `unrecorded` in a mantle slot is not a missing
  record but a recorded absence — the two may want different tokens.

```
$ cd doctrine && grep -rn unrecorded . --include=*.ts --include=*.md ; echo "hits: $?"
hits: 1

$ ./cli.ts lint ~/code/agents | tail -8
=== FAILURE CLASSES
    25  ledger.tier
     3  kickoff.summons
     1  board.tier
     1  ledger.mantle
```

---

- 2026-08-26 · 18a Architect (agents) · **the kickoff detector promotes any fenced
  block opening `You are ` to a summons**, and `plans/log-tradition.md` holds three
  that are not: the Personal Log tradition's letter templates, addressed to a *window*
  by its identity ("You are the founding ⟨title as the window knew it⟩ of ⟨project⟩ —
  the window that ⟨founding act⟩ on ⟨date⟩"), plus one worked example. They carry no
  mantle and no tier by design — a log letter is not a dispatch. 18a refused to
  reshape them: mangling a documented tradition to satisfy a detector is the tail
  wagging the dog. Same class as the two detector fixes row 16 already made (`fire the
  Grand Architect`; the findings doc promoted to a board) — the fix belongs in row
  16's suite. Suggested discriminator: a summons fence names a mantle from the
  vocabulary; a fence whose first line names none is not a kickoff candidate. These
  three are this repo's last non-`unrecorded` failures.

```
$ ./cli.ts lint ~/code/agents --verbose | grep -A3 kickoff.summons
      [3×] kickoff.summons — first line is not "You are a <Mantle> at <tier>." (D45)
           ~/code/agents/plans/log-tradition.md:35: You are the founding ⟨title as the window knew it⟩ of ⟨project⟩ — the window that
           ~/code/agents/plans/log-tradition.md:52: You are ⟨who this window was⟩ of ⟨project⟩ — the window that ⟨act⟩ on ⟨date⟩.
           ~/code/agents/plans/log-tradition.md:79: You are the founding Grand Architect of hexwright — the window that laid its keel,
```

---

- 2026-08-26 · 18c Architect (whiteboardy) · **`doctrine migrate` emits a malformed
  ledger head and the round-trip law does not catch it — a doc goes from 0 failures to
  2.** `ledger.pre-doctrine-head` splits `## <date> · <rest>` on `·` and takes segment 1
  whole as the mantle, so a source head whose tier rides a parenthetical
  (`Builder (opus-medium)`) is re-emitted with the tier still inside the mantle segment
  and the row id bolted on as a second parenthetical. `ledger.tier-slot` cannot repair
  it: it runs earlier in `RULES` and, run later, its `trailingParen` finds the row id,
  not the tier. Correct emission is `**<date> · <Mantle> · <tier> (<row>)**`. Round-trip
  reports `ok` because `mantle`/`tier` are both in the rule's declared `changes`, so the
  assertion licenses the damage. whiteboardy carries 13 of these heads and 18c refused
  `--write` on that basis. The milder half of the same bug is visible in row 16's own
  §DoD-4 diff: a source head with no parenthesised tier re-emits with **no tier slot at
  all** (`**2026-08-01 · Builder (WO-001)** — Kernel v0`), published there as proven
  form-only. It did no harm in the field — 18b filled hexwright's 9 tiers by hand from
  cited evidence and landed at 0 failures — but the converter's output was wrong both
  times. Row-16 follow-up; the fixture below is the whole test.

```
$ printf '# Ledger\n\n---\n\n## 2026-08-19 · Builder (opus-medium) · SH3 — the bundle-push pipeline\n\nStuff. Decided: nothing. Next: fire 20.\n' > LEDGER.md

$ doctrine lint .                 →  0 failure(s) in 0 class(es)
$ doctrine migrate . --write
-## 2026-08-19 · Builder (opus-medium) · SH3 — the bundle-push pipeline
+**2026-08-19 · Builder (opus-medium) (SH3)** — the bundle-push pipeline
   round-trip ok — 1 edit(s), meaning-bearing fields unchanged
$ doctrine lint .                 →  2 failure(s) in 2 class(es)
     1  ledger.mantle    "Builder (opus-medium)"
     1  ledger.tier      the head carries no tier slot (D63f)
```

---

- 2026-08-26 · 18c Architect (whiteboardy) · **no migrate rule recognises an unbolded
  pre-doctrine ledger head**, which is 96 of whiteboardy's 104 ledger blocks and the
  bulk of row 18c. The house form is a bare head line plus labelled body lines —
  `2026-08-15 · Digger · fable-high (dispatched, row 01)` / `Changed: …` / `Decided: …` /
  `Next: …`. Nothing is wrong with it that a rule cannot move: bold the head, hoist the
  row id out of the overloaded parenthetical, and the `—` separator replaces the
  `Changed:` label the grammar already implies. This is not a per-repo special case —
  `ledger.pre-doctrine-head` was itself written from one repo's dialect (hexwright's
  `## ` form) and is general in shape; this is the second dialect, not an exception.
  What must stay a human's is the parenthetical's non-row-id remainder (`dispatched`,
  `gate 10 — misfire, no review possible`, `E1 — app skeleton`), which D63f sends to the
  body and `migrate.ts`'s own header already declares out of the converter's reach.
  Three heads wrap across lines — row 16's parked note ("the day one does") has its day.
  Row-16 follow-up; whiteboardy is the corpus that proves the rule, which is why 18c did
  not hand-migrate it.

```
$ doctrine lint ~/code/whiteboardy | grep ledger.head
    97  ledger.head
$ doctrine migrate ~/code/whiteboardy
Dry run: 13 edit(s) across 1 file(s).      # the 13 `## ` heads only — and see the entry above
```

---

- 2026-08-26 · 18c Architect (whiteboardy) · **Depends-on resolves against one
  DOCUMENT's row ids, not the building's** — which narrows 18d's cross-building
  question to something much smaller and, I think, purely a tool scope bug.
  `parseBoards` builds `knownIds` per markdown file, so a master board that depends on
  its own sub-board's rows fails, and so does every sub-board row that depends on the
  gate that blessed it. These are not cross-building references: one building, one
  register entry, ids unique across it. whiteboardy is the extreme case — a master board
  plus six sub-boards, all `docs/*.md`, sanctioned by D45 — and **28 of its 45 residual
  `board.depends` failures are exactly this**, 23 plain ids and 5 en-dash ranges
  (`E1–E9`, `SH1–SH4`, `T1–T6`, `C1–C4`, `X1–X7`). D63e says "row ids"; it does not say
  "on this board", and the linter's own message asserts a scope the doctrine text never
  set. The register already computes the building, so the fix looks like one line —
  resolve against the union of the building's board docs. Ranges are a separate, smaller
  question (expand `E1–E9`, or spell it `E1, E2, …`). 18c left all 28 untouched rather
  than guess, since the two candidate spellings differ.

```
$ doctrine lint ~/code/whiteboardy | grep board.depends
    45  board.depends
   # bucketed: 23 cross-document ids · 5 cross-document ranges · 6 ids on no board
   #           · 5 same-doc id + prose tail · 6 prose needing a ruling
```

---

- 2026-08-26 · Architect (row 18f) · **`doctrine migrate` corrupts markdown when a
  status cell's bold run is wider than its leading verdict token.**

`src/migrate.ts`'s `replaceLead` matches `^(?:\*\*\s*)?TOKEN(?:\s*\*\*)?`. That is right
for `**MERGED**`, and wrong for `**MERGED (2026-08-11, `6dc03690`)** — DoD met …`, where
the bold run spans the whole verdict clause: the opener is consumed with the token and the
**closer is left dangling**.

```
- | … | **MERGED (2026-08-11, `6dc03690`)** — DoD met on every line: build green, …
+ | … | LANDED — MERGED (2026-08-11, `6dc03690`)** — DoD met on every line: build green, …
                                                 ^^ orphaned
```

Four rows in `cap-mega/docs/advanced-naming-system.md` (N12, N13, N16, N17) hit it; the
same file's eight *unbolded* `MERGED (…)` cells migrate correctly, so the bug is purely the
wide-bold case. **The round-trip law does not catch it** — `annotation` is a field the
`status.verdict` rule declares it may change, so the assertion passes over the damage.
`status.retired` and `status.pending` share `replaceLead` and the same exposure.

18f did not write those edits. It hand-applied the correct spelling instead
(`**LANDED — MERGED (…)**`, state inside the bold run), verified by `doctrine migrate
cap-mega/docs` afterwards reporting "already in the current grammar", and reports the bug
here per row 18's out-of-scope clause. Fix belongs in row 16's suite, with a fixture whose
bold run is wider than its token.

- 2026-08-26 · Architect (row 18f) · **D63's Staffing grammar has no spelling for a
  deliberately-unstaffed row, and `unrecorded` is the wrong word for one.**

Distinct from the `unrecorded` vocabulary gap 18a/18d filed — that one is the linter not
knowing a token the doctrine mandates. This is the doctrine not having a token at all.

`cap-mega/docs/waypoint-stepper` rows 18, 19 and 23 are OPEN and read `unstaffed` in
Staffing. That is a *recorded fact* — rows 18/19's own Status says "Felix's call whether it
is worth a hook" — not an absent record, so writing `unrecorded` would assert ignorance
where the board asserted knowledge. Spelling them `Felix-gate` is also wrong: they are work
rows whose go/no-go is Felix's, not gate rows. 18f left all three verbatim.

Two candidate rulings, both cheap: mint `unstaffed` as a third legal Staffing token
(D63 as amended), or rule that an unstaffed OPEN row is malformed by construction and the
Architect owes it a staffing at cut time. The second is stricter and matches "every row
staffed" in the architect charter; the first matches what boards actually do.

Residual lint from 18f's four buildings, for the count: **7 failures, all this class or
18a's** — 3 × `board.tier` (`unrecorded`, waypoint-stepper rows 12–14, whose LOG.md records
only "Architect (fable)", a model and not a tier), 4 × `board.staffing` (3 × `unstaffed`
above, 1 × `unrecorded` on ch2 row 05, killed before it was ever staffed).

---

- 2026-08-26 · Architect (row 18h) · **The register silently skips subproject-format
  ledgers, and the decisions parser silently skips non-`D`-prefixed decision ids —
  both zero-candidate, not zero-failure.**

`~/code/rooted`'s two buildings (`repot`, `archive/arborist`) are DOCTRINE §3
subprojects: `README.md` carries the board **and** inline `## Decisions` / `## Ledger`
sections (no `LEDGER.md` file). `building.ts`'s decisions parser already falls back to
the master doc (`pick('decisions')[0] ?? boardFiles.find(f =>
MASTER_DOCS.includes(basename(f)))`) — but the ledger parser has **no such fallback**
(`pick('ledger')[0] ?? null`, full stop). Both buildings lint "ledger none", not
"ledger: N failures" — their `## Ledger` sections (9 and 20 dated entries respectively,
DOCTRINE §7-shaped) are never read at all.

Separately, `parseDecisions` requires the literal prefix `D` (`/^\s*[-*]\s*\*\*D\d/`,
`src/parse.ts:307`), so a building whose decision ids carry a project prefix —
`repot`'s `RP-1`..`RP-8`, `arborist`'s `A1`..`A26` — produces `candidates: 0`, zero
failures, zero decisions in the queue. Reproduction:

```
$ bun -e "import{parseDecisions}from './doctrine/src/parse';
console.log(parseDecisions('## Decisions\n\n- **RP-1** (Felix, 08-26): Campaign named **Repot**.\n'))"
{ decisions: [], queue: [], fails: [], candidates: 0 }
```

Both gaps read as "0 failures" — worse than an `unrecorded`-class failure, which at
least says something was seen. row 16's own hexwright/bob fixtures all use bare `D<n>`
and a standalone `LEDGER.md`, so neither gap tripped the corpus test. 18h did not
hand-fix either parser (out of scope) or hand-migrate the 29 affected entries (D63i's
title-bold question compounds the ledger one — see the next entry). Board-visible
residues in both buildings were ruled and lint clean; the ledger/decisions sections
stand unverified. Simmy (18e) already splits its ledger to a real `LEDGER.md`, so this
does not block that row, but any later subproject-format building should check for it
before trusting a "0 failures" reading.

---

- 2026-08-26 · Architect (row 18h) · **No `migrate` rule covers a decisions entry whose
  bold run wraps the attribution instead of closing after the id, and title selection
  for the fix is an editorial call, not a parse.**

`cap-mega/felix/spacex-dashboard`'s (and its worktree twin `spacex-dashboard-c2`'s)
`## Decisions` section reads `- **D1 (2026-08-13, Felix + Architect):** <prose>.` — the
bold spans `D1 (date, decider):`, with no separate bolded title (D63i wants `- **D1**
(date, decider): **<title>.** <body>`). `decisionHead` in `src/migrate.ts` only matches
the `**D<n> · <date> · <title>**` (all-bold, `·`-separated) pre-doctrine shape — this
one doesn't match, and migrate leaves it untouched. All 7 entries in both files hit
this identically (shared pre-branch origin).

Fixing it by hand means choosing where each entry's title ends and its body begins —
none of the 7 have a natural title-length first sentence (D1 and D6 in particular run
one clause into the next with no seam). That is a judgment call the fence reserves
against ("no reworded prose"), not a mechanical punctuation fix, so 18h left all 14
`decision.head` failures (7 × 2 files) standing rather than guess. Row 16's suite is
the right owner for a second `decisionHead` rule variant, once a title-boundary
convention is ruled.

---

---

- 2026-08-26 · Belvedere Architect (P2 escalation, Digger evidence) · **The rig's
  `cmd` burns turn 1 on `/color` — ask: the summons composes into `cmd`, colour
  leaves the prompt.** P2 proved a summons lands byte-exact as the FIRST user turn
  via argv (`claude … "$(cat <summons-file>)"`) — but only with the prompt slot
  free; `summon/summon.zsh` + `presets.tsv` compose `"/color <c>"` there, forcing
  every summons to arrive by paste, and paste into a live Claude TUI splits at the
  first blank line and auto-submits paragraph 1 (P2 §T4 — the 359-fire gap,
  reproduced; 370 fires logged at the sweep). cmux owns workspace colour natively
  (`workspace-action --action set-color`); non-cmux venues can carry colour by
  flag or post-launch send. Evidence:
  [belvedere/plans/p2-spawn-recipe.md](belvedere/plans/p2-spawn-recipe.md) §S3,
  §T4. `summon/**` is canon ground — not Belvedere's to cut.

---

- 2026-08-26 · Felix (via the Belvedere Architect) · **The continuous flow — the
  Dispatcher was a band-aid.** (Corrects this sitting's earlier "programmatic
  dispatcher" framing at Felix's word, same day.) The goal is not a program where
  the LLM sat: it is work that KEEPS RUNNING — strings of rows flowing between
  Architects, Builders, Diggers, and gates; sittings cut new rows and the flow
  continues; it stops ONLY for a Felix-escalation, or when the work is done. His
  example, verbatim: "B1,B2,back to you,G1,B3-B6,back to you,you cut new rows,new
  whole string of work,X1-5,new architect,X5-N,back to new architect,cut new
  rows,it just keeps going until the work is done, or an architect escalates
  something to me." The judgment stays in mantled sessions; the BETWEEN-sessions
  logistics (fire on LANDED dependencies, fire gate sittings, pause at
  Felix-cards) is what mechanizes — Belvedere's hands + rail + census are the
  natural engine, and the Steward (night-shift keel) is the same flow unattended.
  Queued for a GA sitting once Belvedere v0 usage exists (pairs with canon row
  17's gate).


---

From Felix:

Still getting:
Error: `prompt` is required when `stop` is not true.
From agents. Haha.
---

- 2026-08-26 · Belvedere Architect (B2 evidence) · **`doctrine/` `discover()`
  costs 9 s over `~/code` — two measured folds available.** 50,795 dirs
  statSync'd per walk; `readdirSync({withFileTypes})` is 2.5× (3.4 s, measured);
  skipping descent into worktree checkouts that are byte-twins of mainline saves
  most of the rest (35 cap-mega copies dominate). Belvedere ruled its own scope
  at G1 (content never cached; register ≤30 s warm) but the walk is canon's
  parser. Evidence: [belvedere/plans/b2-glass-spine.md](belvedere/plans/b2-glass-spine.md) §E1.

---

- 2026-08-26 · Belvedere Architect (B2 evidence) · **Register question: 20 of 38
  live sessions house in no building.** Their cwds sit at repo roots whose boards
  live in subdirs (`cap-mega` → simmy/snappy/docs) and in worktree checkouts. The
  glass renders an "Off the register" panel — honest — but the City View cannot
  show Felix where most of his live work is. For the Office: does a root that
  CONTAINS buildings deserve a campus card or a cwd-ascent housing rule, or is
  off-register the truth? Evidence:
  [belvedere/plans/b2-glass-spine.md](belvedere/plans/b2-glass-spine.md) §F2.

---

- 2026-08-27 · Belvedere B3 Builder (rail evidence) · **D64's baton grammar needs
  three fields the parser cannot honestly infer: `kind`, the fork's
  recommendation, and a row's branch.** The rail renders move/wave/fork from
  `doctrine/`'s `Baton`, which is `{holder, text, instruments[]}` — no `kind`. Per
  B3 §3 the shape is read render-side by a thin splitter over the baton's prose
  (`/\bfork\b|\bexclusive\b|\bchoos|…/` vs `/\bwave\b|\bparallel\b|\bboth\b/`) and
  plurality with neither marker renders as *"n instruments — shape unstated"*
  rather than a guess; the recommendation is likewise scanned out of the sentence
  containing "recommend". Both work, neither should be prose. The third is worse:
  the amendment that composes `worktree → fire` needs the branch a row runs on, and
  reading it from the work doc was **unsound on the real corpus** — the naive read
  matched 12 of 62 live work docs and *every hit was retrospective* (`**Status:**
  LANDED (branch …)`, `## Commits (branch …)`, a nested board row citing where
  findings live), one of them on an OPEN row where a Dispatch would have composed a
  worktree named after somebody else's finished agent checkout. Narrowed to the
  doc's header block, worktree-naming lines only, never a landing record: 0 of 62.
  Ask: `kind: 'move'|'wave'|'fork'`, a recommendation slot on the fork, and a
  branch slot on the row. Evidence:
  [belvedere/plans/b3-baton-rail.md](belvedere/plans/b3-baton-rail.md) §§F4–F5.

---

- 2026-08-27 · Belvedere B3 Builder (rail evidence) · **`classifyBaton` gives the
  instrument precedence over Felix, and on the live corpus that inverts every
  fireable baton.** Any fenced summons or `fire <row>` in a Next clause makes the
  baton `holder: 'session'`; only a clause with no instrument at all can fall
  through to `'felix'`. All three of the city's currently-fireable batons read the
  other way in their own words — hexwright: *"Felix's Phase-1 acceptance ruling —
  **PENDING** … On a pass, fire: ⟨fence⟩"*; simmy: *"**Felix** fires the summons
  below"*; whiteboardy: *"fire 26 **when** the window's day-5 boundary lands"*. The
  rail's holder law is satisfied (no Felix-holder baton is wired) while two
  Dispatch buttons sit under text saying the fire is his and conditional. B3 did
  **not** overrule the parser (D65) — the card now says *"The clause names Felix.
  D64 reads the instrument first, so this is a session baton — read the clause
  before firing."* — but a one-click dispatcher wants the grammar to carry this,
  not a heuristic. Ask: an explicit holder/precondition token in the Next clause,
  or a rule that a clause naming Felix is his regardless of the instrument it
  quotes. Evidence:
  [belvedere/plans/b3-baton-rail.md](belvedere/plans/b3-baton-rail.md) §E2.

---

- 2026-08-27 · Belvedere B3 Builder (rail evidence) · **`doctrine/` has no re-read
  seam, so the glass hand-mirrors `assemble()`.** G1's E1 ruling splits the walk
  (held warm) from the content (re-read per request), but `discover()` does both in
  one pass and nothing exports "parse this file list again". `glass/register.ts`
  therefore reimplements `assemble()`'s body — same parsers, same order, same
  decisions-file fallback — and pins itself deep-equal to `discover()`'s own
  `Building` in `register.test.ts` so the drift fails a test instead of quietly
  rendering a thinner building. Ask: export the seam (`assemble(path, files)` or
  `parseFiles(entry)`) so there is one implementation, not one plus a guarded copy.
  Evidence:
  [belvedere/glass/register.ts](belvedere/glass/register.ts),
  [belvedere/glass/register.test.ts](belvedere/glass/register.test.ts).

---

- 2026-08-27 · Belvedere Architect (B1/B4/B3 evidence) · **Three D54 slips in three
  build rows, same instrument: `bunx tsc` — the city has no offline type-checker,
  and every TS Builder reaches for the one that fetches.** B1 and B4 each ran it
  (self-reported, accepted — zero harm, no lockfile, resolved into bun's global
  cache); B3 makes it three for three and filed it as a missing tool, not a slip.
  Belvedere ruled locally at its B8 row: `typescript` + `@types/bun` pinned as dev
  deps, `tsconfig.json`, rider names `bunx tsc --noEmit` as the sanctioned offline
  gate. For the Office: is that the city standard (a pinned type-checker wherever
  Builders build TS — rider/doctrine language), or is `bun test` + running code the
  type gate and D54 riders should say so? Evidence:
  [belvedere/plans/b4-hands.md](belvedere/plans/b4-hands.md) §F5,
  [belvedere/plans/b3-baton-rail.md](belvedere/plans/b3-baton-rail.md) §F3;
  belvedere/ISSUES entry drained 2026-08-27 (git keeps the bytes).

---

- 2026-08-27 · Belvedere Architect (B8 evidence) · **`bun test doctrine` asserts a
  fact about a live building's ledger, so it goes red when the corpus converges —
  20 pass / 1 fail today.** `corpus > hexwright's pre-doctrine ledger tail migrates
  form-only` expects `m.edits.length > 0` and gets `0`
  (`doctrine/test/doctrine.test.ts:190`): hexwright's tail is no longer
  pre-doctrine, so there is nothing left to migrate — the test's fixture is another
  building's LIVE file. Pre-existing at `3fe5d99`; surfaced at Belvedere B8, which
  touched nothing under `doctrine/`. For row 16's suite: corpus tests belong on
  checked-in fixtures; live-corpus assertions belong in `lint`, not the test suite.
  Evidence: belvedere/ISSUES entry drained 2026-08-27 (git keeps the bytes).
