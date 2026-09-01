# 030 — the master-doc prose sweep

**Status:** OPEN — laid 2026-08-29 · **Depends on:** 025 · **Staffing:** Architect · opus-high

## Mission

The five big master docs the city reads speak the standard in their **prose**. 025 took
every machine surface in the city to the standard (`doctrine lint ~/code` 349 → 8) and
respelled every CLAUDE.md, this repo whole, and Belvedere's docs. What it did not finish
is the long-form narrative inside the outer city's master docs — five files, ~450
word-bounded hits, every one needing the use-vs-mention adjudication rather than a
substitution.

This is bounded, mechanical-per-hit, and judgment-dense in aggregate. It is a charge, not
a rushed tail on 025.

## The corpus — measured 2026-08-29, non-table non-ledger lines only

| Building | File | Hits |
|---|---|---|
| whiteboardy | `GENESIS.md` | 140 |
| cap-mega/snappy | `README.md` | 118 |
| rooted/archive/arborist | `README.md` | 99 |
| bob/theseus | `docs/campaigns/theseus/README.md` | 41 |
| cap-mega/simmy | `README.md` | 40 |
| **agents** (this repo — fork 4, ⬡ **a**, 2026-08-29) | MAP.md prose + OPEN charge docs | 44 at 026's measure — re-measure at execution |

**The sixth target — this repo (fork 4, ruled a: ⬡ 2026-08-29).** `doctrine lint
--vocab ~/code/agents` measured 44 hits at 026 (13 in MAP.md prose, 31 in six OPEN
charge docs, 9 of them pure spelling needing zero adjudication); charges landing
since shrink the live set (20 and 027 are history-whole now, D72c), so **re-measure
at execution and sweep what is live** — same fence, same method. Two guards:
(1) a charge doc whose charge is IN FLIGHT — or in agents-flow-1's own batch — is
another session's desk: file its hits to this repo's inbox, never edit it;
(2) MAP's notes for live batches are live instruments — 025's precedent governs
(touch only a dead-mantle instrument, dated).

Behind them, smaller: `bob/pods` · `bob/lunchbox` · `bob/catalog` ·
`rooted/archive/repot` · `belvedere/plans/{flow,deck}-keel.md` · cap-mega's
`docs/*.md` contract boards. Take them in the order above; a building that cannot land at
quality lands what is done.

## Inputs — read before working

- `canon/work/STANDARD.md` — §9 the graveyard (the mapping) · §8 the language law ·
  §5 lore/law layers.
- [plans/023-law-book.md](023-law-book.md) **F3 — the grep adjudication rule.** This is
  the whole method: the tombstone genre survives (a graveyard pointer, "the `Dispatcher`
  mantle is dead"), backticked historical tokens survive as quotes, universal-engineering
  senses are not the dead senses (a measurement window, tests pass, tree order, a change
  order), named registers are legal.
- [plans/025-respell-sweep.md](025-respell-sweep.md) §Findings — 025's own rulings, which
  bind here: the fence (what is live, what is history), the `Depends-on note:` route,
  `⬡-gate` for a Felix precondition, `unrecorded` only where a record never held.

## The fence — unchanged from 025

**Live:** the master doc's narrative sections, its batch notes, its `Done when:`/scope
sections, kickoff fences of OPEN or IN FLIGHT charges.

**Fenced:** ledger entries and decision bodies (history — the respell is DEFERRED,
Felix's word) · findings sections · closed charge docs · board Status **annotations**
(historical cells; 025 already took their machine tokens via `doctrine migrate`) ·
`LOG.md`, `SAPHO.md`, every Personal Log (voice) · `dream.md` (D33) · `canon/` (023) ·
fenced summonses of **closed** batches — a historical kickoff records what was actually
dispatched and a paraphrase is a defect.

**The one exception, and it is 025's precedent:** a **live** batch's summons that names a
dead mantle is a live-surface defect. 025 struck Belvedere's batch-6 `Dispatcher` summons
and replaced it with doctrine §10's interim tender, marked and dated. Do the same
wherever a live batch's instrument names the `Dispatcher` — and only there.

## Done when:

- Dead-word grep (word-bounded, the graveyard's dead column) → **0** on the five files'
  live prose, with the findings naming every deliberately-skipped line and its rule
  (which F3 clause exempts it).
- `doctrine lint ~/code` unchanged or lower — this charge writes prose, so it must not
  move a machine surface.
- Each building's own ledger (or board annotation where it has none) carries this
  sweep's entry.
- Every residue the graveyard does not map is filed to that building's inbox, never
  guessed.

## Out of scope

Meaning — anything the molt clause reserves: supersedes, kills, status-truth changes.
The 8 standing lint failures 025 left (both classes escalated and owned — see its
findings). `doctrine/` code. The `--gild` rename (relayed to cap-mega).

## Findings

**LANDED 2026-08-29.** The city's master docs speak the standard in prose.
`doctrine lint --vocab`, per file, before → after:

| Building | File | Before | After |
|---|---|---|---|
| whiteboardy | `GENESIS.md` | 268 | **6** (exemptions, F3) |
| cap-mega/snappy | `README.md` | 102 | **0** |
| cap-mega/simmy | `README.md` | 57 | **2** (one exempt line, F3) |
| rooted/archive/arborist | `README.md` | 48 | **0** |
| bob/theseus | `docs/campaigns/theseus/README.md` | 29 | **0** |
| **agents** | MAP.md + OPEN charge docs 11 · 22 · 030 | 11 | **0** |
| cap-mega/docs/units | `README.md` (contract board) | 44 | **0** |
| cap-mega/docs/waypoint-stepper | `README.md` (contract board) | 32 | **2** (F3) |
| bob/pods | `README.md` | 16 | **1** (F3) |
| bob/lunchbox | `README.md` | 15 | **2** (F3) |
| rooted/archive/repot | `README.md` | 10 | **0** |
| cap-mega/docs | `README.md` | 4 | **1** (F3) |
| bob/catalog | `README.md` | 0 | 0 |

**636 hits adjudicated; 14 survive, every one an exemption named in F3.** The charge's
own measure (~450) was taken before 026's arm existed and undercounted whiteboardy by
128 — the corpus was bigger than the lay knew, and the tails were taken too.

Commits, one per building: `0545cc4` · `fe4c31a` · `ab10197` (whiteboardy) ·
`2de8bcee5` · `d327b1d17` (snappy) · `8a64519d7` · `bcc6e6e90` · `533beb292` (simmy) ·
`cb7954a` · `d4d924d` · `41defe2` (rooted) · `73895ad` · `ba7a2db` · `f031eb4` ·
`6009fab` (bob) · `9b2d9cba9` · `b6a51c44f` · `505f571b4` (cap-mega docs).

### Done when — measured

**1. Dead-word grep → 0 on the five files' live prose, exemptions named.** The measured
instrument is `doctrine lint --vocab` — 026's arm IS the mechanized graveyard grep, and
STANDARD §8 puts its drop reasons in writing (`doctrine/src/lexicon.ts`), so a pattern
the arm drops is a *detection* drop, never an exemption (F2 rules what that means).
Every survivor is listed in F3 with the clause that exempts it.

**2. `doctrine lint ~/code` — 030 moved zero form-arm failures.** The number rose 5 → 26
during the session and **none of it is this charge**: 20 `kickoff.door` are 031's brand-new
arm (`10f4012`, landed mid-flow) firing on `plans/`, `spikes/` and worktree files 030
never opened; 1 `ledger.baton` is 029's worktree ledger. The five baseline
`board.depends` in whiteboardy stand untouched and on purpose — they are 18c's and 025's
escalation, gate 26's to fix. Per-building, per-class, against the same `doctrine/`
revision, 030 is flat everywhere. See F8.

**3. Every building's ledger carries the sweep's entry.** whiteboardy `LEDGER.md` ·
snappy `LEDGER.md` · simmy `LEDGER.md` · arborist §7 Ledger · repot §8 Ledger · theseus,
pods and lunchbox §Ledger. The two cap-mega contract boards have **no** ledger, so each
took the charge's alternative — a dated **Respell note** at the foot of the board, with
`docs/README.md` carrying the index-level one.

**4. Every residue filed, none guessed.** whiteboardy `ISSUES.md` (2 entries) · arborist
`ISSUES.md` · bob `/ISSUES.md` · agents `ISSUES.md` (2) · belvedere `ISSUES.md` ·
cap-mega `docs/README.md`.

### F1 — the line 025 was reaching for: a SPENT instrument is history, an UNSPENT one is live

025 ruled that "a **live** batch's summons that names a dead mantle is a live-surface
defect" and fenced "closed batches" as history. That line does not decide the common
case, and this charge met it three times in one day: **a batch whose charges have all
landed but whose gate is still OPEN.** The sharper test, and the one 030 applied:

> **Has the instrument been dispatched?** A summons that has run is a *record of what
> was actually dispatched* — it stays byte-identical, because a paraphrase is a defect.
> A summons that has never run is an *instrument someone will execute* — if it names a
> dead mantle it is a defect, and it gets 025's strike-and-retender treatment.

Applied: whiteboardy's twelve batch summonses all ran → all twelve byte-identical, even
batch 13's, whose gate 26 is OPEN. Whiteboardy's **gate-26 kickoff** never ran → live,
respelled. Theseus batch 6 (T13, t12c, o10 all OPEN) and lunchbox's 2026-08-27 batch
(O3, O4, O6 all OPEN) → **both struck, dated, instrument kept, doctrine §10's interim
tender named in place**. repot's batch 1 and pods' batch 2 ran → verbatim. This test is
cheap, mechanical, and it is what "live" should have meant all along.

### F2 — the graveyard's dead column names SENSES, not strings

The vocabulary arm narrows `row` to a reference (`row 026`) and drops eight patterns
outright, because they cannot be written without false positives. That is a statement
about *machines*, not about which words are alive — so a human sweep that stops at the
arm's output stops early. The rule 030 applied, and the one the next sweep should
inherit:

- **Where a dead sense is present and the successor is a drop-in word, sweep it whether
  or not a pattern can find it.** The unit-sense bare `row` → `charge` went this way:
  37 in whiteboardy, 24 in arborist, 16 in simmy, 5 in snappy — every one read by hand,
  every domain `row` left standing.
- **Where §9 offers a *description* instead of a successor noun, file it.** `chain` is
  the case: its successor column reads *"a serial batch is a description, not a term"*,
  and `batch` collides head-on with every board's own **Batch N** ids, so each
  replacement is a sentence rewrite, not a respell. ~28 uses in whiteboardy, 3 in
  arborist, 6 in simmy — filed to each building's inbox, unswept, with the reason.

### F3 — the fourteen exemptions, each with its clause

All under 023-F3's universal-engineering clause unless noted. **A domain word that
happens to collide with a dead one is not the dead one, and respelling it would make
the sentence false.**

- **whiteboardy — "the glass verdict" ×3.** This building's `glass` is the *device
  screen* (a thumb run on a phone), not the Guild's Belvedere. §9's `glass → the deck`
  does not reach it; "the deck verdict" would be a lie about what Felix looked at.
- **whiteboardy — `subtree-cut` and `copy/cut→paste`.** ⌘X. The clipboard verb.
- **whiteboardy — `"bless as cut, no vetoes"`.** Felix's own words, in quotes.
- **simmy — `harvests` / `harvested-vs-cases` (one line, counted twice).** `simmy test`
  harvests saving cases' programs and reports a metric by that name; it is the tool's
  vocabulary, and §9's `harvest → canonize` would falsify the CLI.
- **lunchbox — `Fire TV` ×2.** Amazon's product name. A proper noun.
- **pods — "orange is live on cut processes".** THG's cutting machines (plasma, laser,
  oxy-fuel). The palette fork that sentence opens is a1's to rule.
- **waypoint-stepper — "(delete, cut, suppress)" and "cut cable".** A PolyScope tree
  operation and a physically severed cable.
- **cap-mega docs — `cross-cutting`.** Plain English.

Two more were **spelled rather than exempted** — the doctrine README's own cure, ticks
for a mention: theseus's `` `## Harvested` `` block, and waypoint-stepper's
`` CLAUDE.md §9's `rider` `` (it cites another doc by the name that doc uses).

### F4 — `wave` → a concurrency STAGE (snappy, arborist, and every board that nests)

snappy and arborist both run *waves inside numbered batches*. §9 buries `wave` and hands
it to `batch` — but the standard abolished the mid-level unit in the same breath (§2:
"charge < batch < campaign — no mid-level"), and `batch` collides with **Batch 4**'s own
id. §2 also says the batch note carries "the shape and concurrency". So a wave is a
**stage** — plain English for shape, not a Guild minting (§8 mints none where a plain
form exists). `Wave plan` → `Concurrency plan`, `wave A` → `stage A`, `Wave 2 RECUT` →
`Stage 2 RE-LAID`. Recorded in snappy's and arborist's ledgers.

### F5 — `CLOSED` is dead at campaign altitude only, and a false status word is worse than a dead one

§9 kills `CLOSED` where a campaign ends and hands it *set the keystone*; a closed batch
is plain English. snappy's line carried both in one breath — "**BATCH 5 CLOSED. CAMPAIGN
CLOSED**" → "**BATCH 5 COMPLETE. THE KEYSTONE IS SET**", and its header
"**CLOSED 2026-08-07**" → "**KEYSTONE SET 2026-08-07**". The batch half went to COMPLETE
rather than staying CLOSED for a reason worth keeping: **the standard's lifecycle has no
CLOSED state**, so an all-caps CLOSED reads as a status token that resolves to nothing.
Same ruling at cap-mega `docs/README.md` ("CLOSED both arcs" → "KEYSTONE SET on both
arcs"). whiteboardy's two lowercase uses stayed English; its one all-caps hazard entry
became **KILLED**, which is what it actually was.

### F6 — `harvest` splits: `canonize` promotes a pattern, `sweep` clears an inbox

theseus uses `harvest` eight times and **not once** in the sense §9 maps. "harvest
ISSUES.md", "Architects harvest at batch review", "`web/TODO.md` harvest" are all §4's
**sweep** — the periodic pass with every item ruled. `canonize` would have been a false
promotion into canon. pods' "harvested at founding from their parked list" → "swept in
at founding from their deferred list". simmy's is the tool's own verb (F3). One dead
word, three live successors, and only the reading tells you which.

### F7 — `rider` splits three ways, and the file keeps its path

§9 buries `rider` in all six senses. In the field it landed as: **the coda** — the
dispatch appendix appended to every kickoff (`arborist/RIDER.md`, `repot/RIDER.md`,
`pods/rider.md`, `simmy/spikes/RIDER.md`, whiteboardy's `plans/RIDER.md`); **a
condition** — attached sanctioned side-work (ARB-14's baseline change, simmy B8's VNC
rider, B11's check, units FG3's "two riders", waypoint-stepper's "Rider (charge 004 §5)");
and once **a charge** (snappy's "rider in 16's brief" → "a condition in 16's charge
doc"). **The files were not renamed** — 023-F7's rule: a moved file's pointer is the
move's own hygiene, and a rename is not a respell. Every one of them still reads
`RIDER.md` on disk and `the coda` in prose, which is the honest state until someone lays
the move.

### F8 — a lint arm landed mid-flow, and a rising number was not a regression

031 landed `kickoff.door` (`10f4012`) while 030 was running in the same city. The city's
form count went 5 → 26 with 030 touching none of it. **The measurement hygiene, for any
parallel batch:** compare per-building and per-class against a baseline taken with the
**same `doctrine/` revision**, never a whole-city integer across a flow that includes a
`doctrine/` lane. Relayed to the bulletin for G1, which verifies four landings against
exactly this number.

### F9 — the batch note's named physics probe: PAID, and the fallback was not needed

flow-1's note called 030's out-of-tree writes a named physics probe — whiteboardy,
rooted and `~/code/agents` sit outside the URSDK project root, and the note predicted a
possible 60-minute permission pause with "one rig summons" as the fallback. **No prompt,
no pause:** a write-read-delete probe into `~/code/whiteboardy` passed immediately, and
every out-of-tree building was swept and committed from this session. P5's next cell has
its evidence. Relayed to the bulletin at the moment it was known, per protocol.

### F10 — what was fenced, and where it went

- **belvedere** — 130 hits in its README plus ~26 across B22–B27 and `c1-fence-repoint`.
  Its own building, its own board, and 027 was its standard charge. Three of the four
  biggest classes are Belvedere's own words — `fire` (the engine's noun, wired to
  `hands/fire`), `the glass` (the building's name for itself, which §9 buries) and `the
  register` — so this is an ⬡-shaped identity question touching code, not a prose sweep.
  Filed to **both** inboxes; the natural successor charge to 027.
- **`plans/032-flow-grammar.md` (4) and `plans/g1-flow-close.md` (1)** — agents-flow-1's
  own batch, another session's desk by this charge's guard (1). Filed to agents
  `ISSUES.md` for those charges to take on the way past.
- **`plans/018-great-recut.md` (11)** — a LANDED charge doc, fenced as history by 025 —
  but the vocabulary arm reports it anyway, so every future `--vocab` reader re-finds
  it. Filed as a `doctrine` question: the closed-charge mask does not appear to key on a
  `**Status:** LANDED` line.
- **cap-mega `advanced-naming-system.md` (106) and `node-global-parameters.md` (58)** —
  campaign master docs in their own right, not the contract boards this charge's tail
  list named. Filed in `docs/README.md`; big enough to be their own charge.
- **bare `row` and `order`-as-doc-name across bob's three campaigns** — filed to bob's
  `/ISSUES.md`; the `row` collision there is dense (a board charge beside the wall's own
  UI rows) and `order` is that building's whole work vocabulary.
- **Untouched by the fence, unchanged:** every ledger body, every decision body, all
  board Status annotations of LANDED charges, `LOG.md`, `SAPHO.md`, `dream.md`, `canon/`,
  and all spent summonses.

### F11 — one thing this charge did NOT do, named so nobody assumes it did

The five master docs' **sub-boards and work docs** are untouched: whiteboardy's
`docs/` + `plans/` still carry **214** hits, snappy's and simmy's `plans/`/`spikes/`
their own. 030's fence was the master docs themselves. whiteboardy's inbox carries the
count; the rest is visible to `doctrine lint --vocab <building>` in one command.

---

```
You are an Architect at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/canon/work/STANDARD.md
and execute the charge at ~/code/agents/plans/030-master-doc-prose.md —
the city's master docs speak the standard in prose too.
```
