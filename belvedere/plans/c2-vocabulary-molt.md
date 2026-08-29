# C2 — the vocabulary molt

**Status:** LANDED 2026-08-29 · **Depends on:** C1 · **Staffing:** Builder · opus-high

## Mission

The deck speaks the standard (`canon/work/STANDARD.md`, blessed D71 ⬡✓). Canon C27's
commission run locally: grammar intake for C24's tokens, the render vocabulary, and
the imported field molt C24 F3 handed us. **Vocabulary only — creep is a bug.**

## Inputs — read before working

- `~/code/agents/canon/work/STANDARD.md` — whole; especially §1 (⬡, bless), §3
  (ignite; baton shapes single/batch/fork), §7 (marks), §9 (the graveyard).
- `~/code/agents/plans/c24-parser.md` §Findings — **F1 (the veto: `proposed —
  pending ⬡✓` CONTAINS the blessing mark; never grep for `⬡✓`)** and F3 (the field
  molt is ours).
- This doc, then the named files.

## The one law over every edit

**The deck's own words molt; the corpus's words render verbatim.** A paraphrase is
a defect: text parsed or quoted from boards, ledgers, kickoffs, flow files, and
inbox lines is NEVER rewritten by a renderer. Only strings the deck itself authors
— labels, buttons, tooltips, legends, notes, error copy — speak the standard.

## The spec

### 1. The field molt (C24 F3, delegated to canon C27)

- `doctrine/src`: `BoardRow.felixGate` → `BoardRow.hexGate` (the parser's own
  migrate rules already spell it `hex-gate`); `Decision.ratified` →
  `Decision.blessed`. Document tokens are untouched — this is field names only.
- Every glass call site follows (`pages, workshop, rail, attention, inbox, decoder,
  deck-model` + tests). `cd doctrine && bun test` stays green (49+); the round-trip
  law is untouched by construction (no token moves).

### 2. Grammar intake — the deck consumes C24's tokens

Each item lands with a test; fixtures may extend the existing suite's.

- **⬡-gate staffing renders his card** (D63a's law, new token, same meaning): a
  fixture board with `⬡-gate` staffing renders exactly what `Felix-gate` did —
  the parser already sets the field; the test locks the render path.
- **C‹n› ids decode**: `glass/decode.ts` — verify the bare-id detector catches
  `C23`-shaped ids (add if it does not), and the keyword form gains
  `charge N` / `charge C5` beside `row N`. The resolver already finds rows by id
  string.
- **`ignite` instruments classify**: a fixture ledger baton `ignite C5` renders a
  fireable card exactly as historical `fire 17` does (the parsing is C24's; the
  test is the intake proof).
- **DEFERRED annotations render** (pass-through text today — one fixture locks it).
- **The veto, render-side**: a decision line `proposed — pending ⬡✓` renders
  PENDING, never blessed — the deck relies on the parser's field (verified: no
  glass-side grep for the mark exists today) and this test keeps it that way.

### 3. The render vocabulary — the graveyard applied to the deck's own copy

- **`Felix-gate` → `⬡-gate`** wherever the deck authors it: `pages.ts` pill,
  `workshop.ts` staffing text, `decoder.ts` status line, `deck.client.ts` legend,
  `attention.ts`/`works.client.ts` sentences, the composer's warnings.
- **The needs-you queue is the ⬡-queue by name** (canon C27 §2): `deck.ts` pane
  name and buttons, tooltips, `chat.client.ts`/`deck.client.ts` copy. Copy may
  gloss it — "the ⬡-queue — what only you can unblock".
- **countersign → bless/blessing** in copy: `pending countersign` → `pending
  blessing`, the `countersign D21` button → `bless D21`, legends and tooltips
  (`inbox.ts`, `attention.ts`, `deck.client.ts`, `pages.ts`). The gesture's
  appended line molts to `bless D21: ✓`; **`recordedIn` must accept BOTH heads**
  (`countersign ` / `bless `) — historical inbox lines keep matching forever.
  Internal type/kind identifiers (`Countersigned`, the wire kind) are the
  Builder's judgment — the wire is ours at both ends; the copy molt is mandatory.
- **row (unit) → charge** in the deck's own copy: `no row "X"` → `no charge "X"`,
  card labels `row ${id}` → `charge ${id}`, the works/rail sentences. `decode.ts`
  keeps PARSING `row 17` forever (corpus), per §2.
- **Baton shapes single / batch / fork** (D71): `rail.ts` `Shape`
  `'move'|'wave'|'fork'|'plural'` → `'single'|'batch'|'fork'|'plural'` (the defect
  shape stays), the legend `D64: move · wave · fork` → `D71: single · batch ·
  fork`, tones carried over.
- **fire → ignite, dispatch sense only**, in rendered copy: the engine/works
  sentences ("the engine fires this…" → ignites), composer warnings, rail notes.
  Plain engineering `fire` survives (an event fires, a kill criterion fires).
  **Tool vocabulary is unchanged** (standard §3): the run-log tokens
  (`fired`/`armed`), API routes (`/hands/fire`), CSS classes, data attributes,
  audit event names — renaming a persisted grammar orphans history. A legend
  explaining a run-log token keeps the token and speaks standard around it.
- **The self-name**: "the glass" → "the deck" in rendered copy (≈15 strings:
  `attention.ts`, `deck.client.ts`, `desk.client.ts`, `chat.ts`, `engine.ts`,
  `hands.ts`, `grep.ts`, `inbox.ts`, `composer` warnings…). Module/dir names,
  env names (`GLASS_CITY`), and comments stay — except comments on lines the molt
  already touches.
- **sitting → session** in copy (`desk.client.ts` "a sitting, or Felix, commits").
- **The dead Dispatcher**: `colors.test.ts` drops the `dispatcher` = pink
  assertion — C25 retired the preset row (D71: the mantle is dead), and the
  suite's own next case is the law (an unnamed mantle wears grey). Sweep any
  other rendered mantle list the same way.

## Done when:

- `cd belvedere/glass && bun test` — **ALL green in one process** (651+; C1
  cleared the fence red, this charge clears the colors red and adds its own).
- `bunx tsc --noEmit` against the repo-pinned typescript — exit 0 (offline, B8).
- `cd doctrine && bun test` green.
- Grep evidence quoted in Findings: zero deck-authored strings carrying
  `Felix-gate`, `countersign`, `needs you`/`needs-you`, or the glass self-name in
  the named files (parsers of historical text exempt, and named as such).
- Commits by explicit paths (§5): the doctrine field molt and the glass molt may
  ride one commit (one swept rename) or two — never `git add -A`.

## Out of scope — pre-ruled

- `canon/**`, `sync/**`, `docs/**`, root protocol files (D2 fence).
- Wholesale comment respell; the spelling sweep of existing strings
  (colour→color etc.) — DEFERRED, named in Findings if it itches. New strings
  follow the deck-era triple: color, center, grey.
- Endpoint, CSS, identifier, and audit-grammar renames beyond those named.
- Flow-file card prose (closed records — C1's ruling).
- New deck features; no live fires, no cmux touch — this molt needs no session
  spawned.

## Kill / escalation

- If the field rename breaks doctrine's suite beyond mechanical fixes — STOP,
  escalate to the Architect.
- If a copy molt would require rewriting corpus-derived text — keep it verbatim,
  file the case in Findings.

## Findings

**LANDED 2026-08-29.** The deck speaks the standard. Commits: `fa48e83` (the field molt) ·
`21e0f89` (grammar intake) · `4ed58d1` (the render vocabulary) · `75b75a3` (the tests) ·
`9d0ee05` (the type gate, E1) · `575210f` (two field reports).

### Done when — measured

**1. `cd belvedere/glass && bun test` — ALL green in one process.**

```
$ cd belvedere/glass && bun test
 669 pass
 0 fail
 1804 expect() calls
Ran 669 tests across 26 files. [2.36s]
```

651 → 669 tests (+18: the eleven of `standard.test.ts`, five in `decode.test.ts`, the
both-heads test, and one narrowed colours case). **The colors red C1 named is cleared** —
`presets.tsv` no longer carries `dispatcher` (C25 retired it, D71: the mantle is dead), so the
assertion that pinned its pink is gone and the case below it now proves the law that governs a
retired mantle: `colourOf(rig, 'dispatcher')` is grey, exactly as `no-such-mantle` is.

**2. `bunx tsc --noEmit` — exit 0.** See **E1**: it was exit 1 *before this charge began*.

**3. `cd doctrine && bun test` green**, and its own lint still reads clean:

```
$ cd doctrine && bun test
 71 pass · 0 fail · 277 expect() calls
$ ./cli.ts lint ~/code/agents | tail -4
  2 buildings · 4/4 board docs yielded a board · 4 boards · 77 rows · 77 fully typed (100%)
  0 failure(s) in 0 class(es)
```

**4. Grep evidence — deck-authored strings, non-test sources, dead words:**

```
$ grep -rnE "(['\"`])[^'\"`]*\b(Felix-gate|countersign|countersigns|needs you|needs-you|the glass|this glass)\b" \
    $(ls *.ts | grep -v '\.test\.ts$') *.css | <comments and wire identifiers excluded>
deck-model.ts:779:export const ATTENTION = ['waiting', 'gate', 'countersign', 'escalation'] as const;
deck-model.ts:816:  * … Effort is on no artifact this glass can          ← comment
identity.ts:98:  // … the credential is the glass's arming            ← comment
inbox.ts:63:  // The written word is the standard's (D71: …)         ← comment, this charge's own
rail.ts:438:  <span class="label">blessings</span>…${n.countersign}  ← label molted; `n.countersign` is a local
```

**Zero rendered strings carry a dead word.** What remains is the wire union `ATTENTION`, three
comments, and one local variable behind a molted label. Exempt and named: the corpus-shaped
fixtures in `decoder.test.ts` (`proposed — pending Felix countersign`) and `standard.test.ts`
(the whole graveyard half of the pair) write dead words **on purpose** — they are the historical
grammar under test.

### E1 — the type gate was RED at HEAD, and had been since canon C26

`bunx tsc --noEmit` exits **1 at `b6c3b35`**, with the whole working tree stashed — six errors,
none of them C2's. `ceed38f` (canon C26) widened two `doctrine/` exports the deck consumes and
never re-ran the gate the deck owns: `Building.files` gained `prose: string[]` (four glass test
fixtures build that literal) and `Fail` gained `severity` (`register.ts`:136's stale-entry stub).
The sixth predates it — `engine.test.ts`:118 spreads a `Partial<BoardRow>` over a literal missing
C24's `dissolved`. Repairing those surfaced two more the errors had masked (`Building` also wants
`ledgerEntries` and `decisions`), so the true count was eight.

**None of the eight is visible to `bun test`** — the suite was 650 pass / 1 fail through all of
it. C2's bar names an exit-0 gate, so the repair landed, in its **own commit** (`9d0ee05`), with
no vocabulary edit in it. **The general fact is the Architect's:** the gate is offline and nobody
runs it unless their own charge names it, and a doctrine shape change lands in one building while
its breakage sits in another. Relayed to the bulletin.

### F1 — what did NOT molt, and why: the wire is ours at both ends

The charge left the internal identifiers to the Builder. The ruling, applied uniformly: **a
string a human reads molts; a string two machines agree on does not.** So `Countersigned`, the
wire `kind: 'countersign'`, `ATTENTION`'s member, the CSS class `b-countersign`, the
`data-kind="countersign"` attribute and the payload JSON all stand, while every pill, button,
tooltip, legend and sentence moved. One seam is deliberate and commented at `inbox.ts`:63 — the
gesture whose wire kind is `countersign` writes the line `bless D21: ✓`.

Two more kept by the same rule, both named by the standard itself (§3, tool vocabulary): the
**run-log tokens** (`RINGS`/`RUN_EVENTS` carry `fired`, `armed`, and the Works' legend explains
`fired` by its own name while speaking standard around it) and the **API routes**
(`/hands/fire`). `hands.ts`'s own error copy also stays in `fire` vocabulary: it is the contract
of the endpoint it names, and molting `summons is empty — the fire IS the summons` would leave
the message describing a route by a word the route does not use.

### F2 — the `plural` shape is not a fourth name, it is the defect

D71 names three shapes and `Shape` carries four. `single`/`batch`/`fork` are the law;
**`plural` is what the rail reports when a baton hands several instruments and names no shape at
all** — a defect the parser found, not a shape anyone wrote. It keeps its name, and the pill's
tooltip cites the three: `D71: single · batch · fork`.

One reader change rides with it, and it is the one law in miniature: `WAVE` became `BATCH` and
**still matches `wave`**. The corpus is full of the dead word and always will be; the deck's own
words molt, the corpus's words are read as it wrote them. Pinned: *"the corpus's own `wave` is
still read as a batch"* (`rail.test.ts`).

### F3 — the grammar-intake fixture is a PAIR, one substitution apart by construction

`standard.test.ts` writes the same four documents twice, the second time through a `molt()` of
five exact pairs (`Felix-gate`→`⬡-gate`, `fire C3`→`ignite C3`, `PARKED`→`DEFERRED`,
`✓ Felix`→`⬡✓`, `pending Felix countersign`→`pending ⬡✓`). Two buildings, `graveyard` and
`standard`, and the assertion is **byte-identical rendered HTML** once the building's own name is
blanked. A test that hand-wrote both halves would prove two documents agree; this one proves the
*words* do — anything else that differed would have to be the token.

The one place the pair legitimately diverges is the baton's own clause, and that divergence is
the law being obeyed: the ledger wrote `ignite C3` and the card renders `ignite C3`, verbatim,
never translated back. So the identity claim blanks the instrument and asserts everything it
drives — the shot, the resolved kickoff, the payload, the wiring — is the same bytes.

**The veto's render-side guard is a source grep, not an assertion about one case:** no file in
`glass/` contains the string `⬡✓` at all. C24 F1 flagged the hazard as belonging to the mark's
*shape*, so the deck's protection is that it never re-reads the mark — resolution is the parser's
field. That test fails the moment anyone adds a glass-side grep for it.

### F4 — `charge c5` addresses nothing, deliberately

`decode.ts` gained `[PBGC]` on the bare-id detector and `CHARGE_WORD = /\b[Cc]harge\s+(C?\d{1,3})\b/`.
No `/i` flag: the detector's existing law is that **the keyword is written both ways and the id
never is** (`Row 12` resolves, `b18 and d2 are prose`), so a lowercase `c5` is prose here too. It
would otherwise mint a token whose id could never match a board row, and a reference that
silently resolves to nothing is worse than one that was never detected. `row 17` parses forever.

### F5 — deferred, named because they itch

- **The spelling sweep** (colour→color etc.) stays DEFERRED per the out-of-scope list. New and
  molted strings follow the deck-era triple; existing ones were left where the molt did not
  already touch the line. `colour` survives in `colors.ts`/`summon.ts` identifiers and comments.
- **Comments were molted only where they name a rendered string this charge changed** — the
  rail's own header, the shape section, the two that quoted `"2 Felix-gate"` and *"the glass
  never fetches"*. Every other comment keeps its dead words; a wholesale respell is out of scope
  and would be a far larger diff than the molt itself.
- **`sitting` survives as plain English** where it is the verb, not the noun: *"a tool call is
  sitting on the approval dialog"*, *"a partial message is sitting in the pane's box"*. Only the
  Guild-noun sense molted.
- **`doctrine`'s `MANTLES` still carries `Dispatcher`**, so the composer still offers it as a
  choice. The list is also the parser's grammar for historical ledgers, so it cannot simply drop
  — filed to `belvedere/ISSUES.md` as a canon question (a *parseable* mantle and an *offerable*
  mantle may be two lists).
- **`glass/README.md` and `deck.css`'s comments** were not swept; the charge named source files.

### Two field reports filed (`belvedere/ISSUES.md`, `575210f`)

The `MANTLES` question above, and a load-flaky test that is not this charge's: `grep.test.ts`'s
1 ms clock case asserts **every** group timed out, which is a race — one failure in ~6 whole-suite
runs, **zero in 40 isolated runs** (20 at C2's tree, 20 at HEAD `9d0ee05`). C2 touched one copy
string in `grep.ts` and added `prose: []` to its fixture; neither is in the timing path.

---

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the charge at ~/code/agents/belvedere/plans/c2-vocabulary-molt.md —
the deck speaks the standard.
```
