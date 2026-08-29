# 21 — The Census: the Guild's working vocabulary, measured

**Snapshot 2026-08-28** · corpus 1.26M words · 441 files · 38 readers · 5,544
observations · 3,066 distinct terms · 294 flagged collisions · 1,144 minting sites ·
52 Felix-coined · coverage 441/441, zero bad lines. Data: `lab/21/lexicon.json` (the
future language-linter's food), `lab/21/ortho-report.md`, `lab/21/residue.json`.

## 0. How to read this

- **Concepts, not words.** Each entry names a REFERENT the Guild's operation actually
  contains, then lists the words currently doing that job, with evidence. The choosing
  collapses each concept to one word — STE discipline: one concept, one word, one part
  of speech — with a licensed lore register instead of a banned one.
- **Coinage is provenance, never privilege.** `FELIX` marks his coinages as data; his
  word: "just because *I* use a term, doesn't mean it will win."
- **Counts are raw.** `8902×351f` = corpus occurrences × file spread, inflections
  included. Polluted lemmas (row, step, run) include product senses; the class split
  (canon-law / board-record / dialect-*) is the honest signal and drove the analysis.
- **Counsel is marked.** Where the office has a recommendation it says *counsel:*;
  everything else is measurement. Taste calls are named as taste.
- The five biggest decisions, by blast radius: **the Felix-yes family (§3.1) · the
  working-occasion knot (§3.2) · rider (§3.3) · the verdict zoo (§5) · the two-tier
  decision registry (§6)**.

## 1. The headline findings

1. **"Ruled" is the field's true verdict verb.** rule/ruled/ruling ≈ 8,000 raw
   occurrences across EVERY building — and it is absent from DOCTRINE §13. The
   glossary never blessed the word the Guild actually says.
2. **"Bless" has a rival life.** Three buildings independently use bless/re-bless/
   `--bless` for *recording a golden test fixture* (pre-existing engineering jargon).
   And the record shows Felix countersigning D69 with the single word "bless" — the
   bless/countersign boundary is already breached in practice, in both directions.
3. **The field keeps reinventing the same three missing concepts:** a lightweight
   scoped decision record (seven independent numbering schemes, §6), a standing
   blocked-on-Felix queue ("helm", two buildings + Belvedere's needs-you queue, §3.6),
   and a campaign-level completion status (retired `CLOSED` survives illegally at
   campaign altitude — even in MAP §8/§9, §5.3).
4. **The metaphor registers have self-organized by layer, not by war** (§7): hive =
   lore, city = structure, nautical/flight = lifecycle, court = authority, ordnance =
   dispatch, parliament = record. Two buildings (bob, whiteboardy) never adopted the
   lore registers at all and run pure procedural dialect — proof the law layer works
   without the poetry, and the poetry was never load-bearing for dispatch.
5. **The corpus is bilingual**: color 509 / colour 258, but grey 231 / gray 5;
   -ize 673 / -ise 193; behavior 219 / behaviour 174. ISO dates held (3,672 vs ~64
   stragglers). Imperial is extinct. §9.
6. **A language linter has a proven ancestor**: manny's M-rules ban "smuggler words"
   (helm, frame, escalation…) from operator-facing prose, mechanically. The
   enforcement Felix asked for ("even if we have to make linters for language") has a
   birthplace citation.

## 2. The concept atlas — domains

An inventory of the referents, with the words attached to each. ⚔ = contested
(several words, or a collision), ∅ = concept exists but has no settled word.

### 2.1 Work & its units

| Concept | Words in use | State |
|---|---|---|
| one dispatchable unit (= one work doc = one session) | **row** (canon, universal) · spike (simmy) · WO/work order (hexwright, bob) | settled: row; dialects are history |
| Digger work doc | **brief** · probe (P-series, belvedere) · spike brief (simmy) | settled-ish; arborist used "brief" for everything |
| Builder work doc | **order** · work order (spelled out) · brief (arborist!) | ⚔ arborist never says "order" |
| sub-unit inside one order | leg (whiteboardy, pervasive) · act (snappy: numbered sub-missions) · arm ("Arms" as task-list header, manny) · stage | ∅ canon has no word; field grew three |
| rows cut to run together | **batch** | settled |
| parallel batch / simultaneous dispatch group | **wave** — but wave also = baton shape (D64) and "let through a checkpoint" (verb) | ⚔ triple duty |
| serial batch | **chain** (+ serial chain) | settled |
| a bounded arc with its own DoD | **campaign** | settled |
| mid-level grouping above batch, below campaign | milestone (M0…, whiteboardy/manny) · chapter (manny, spacex, belvedere flow) · phase · arc · v‹n› | ∅ canon gap — five dialect words |
| the founding plan | **keel** (+ keel-note, keel sitting, "lay the keel") | settled, productive |
| a work doc awaiting its session | **stub** | settled |

### 2.2 The record & its artifacts

| Concept | Words in use | State |
|---|---|---|
| the work-state table | **board** — collides with: Raspberry Pi board (whiteboardy ×2), product `board()` (spacex), outliner rows (whiteboardy product) | settled in law; product homonyms priced §4 |
| session log | **ledger** — now also a VERB ("Belvedere sessions ledger locally"); log = per-campaign record (bob dialect) + the GA's diary | ⚔ ledger-the-verb unglossed; Log vs ledger clean |
| ratified decision | **D-entry** → see §6 for the sprawl | ⚔ |
| evidence record of a row | **findings** — landing-report headers drift: Findings / Outcome / Landing note / "Arms" vs "Work" | ⚔ header standardization needed |
| origin dump, immutable | **dream** (D33) — fossil: initial.md (manny, snappy, pre-D33) | settled; fossils are history |
| incident inbox | **inbox / ISSUES.md** — but "## Inbox" README subsections (bob), sovereign's inbox (glass) | ⚔ see §3.6 with helm |
| dispatch appendix | **rider** → §3.3, six senses, worst noun in the census | ⚔⚔ |
| the wire between parallel agents | **bulletin** | settled |
| end-of-session handoff | **baton** (+ move/wave/fork shapes, holder, instrument) | settled, recently hardened (D64) |
| voice file (never law) | Log (GA) · book/SAPHO (Mentat) · diary (informal) | settled per office |
| disposable code by row | **lab** — spike code (whiteboardy), scratchpad | settled |

### 2.3 Record operations (the working verbs)

Settled and healthy: **cut** (author into existence — one meaning, many objects),
**mint** (bring a canonical artifact into existence — product collision in cap-mega
where mint = allocate a UR variable; contextual, low risk), **true**, **fold**
(product collisions: outliner fold-verb, CSS fold — contextual), **drain**, **sweep**,
**park**, **molt**, **harvest** (manny reuses it for legacy-content reuse — dialect to
prune), **re-cut**, **amend**, **supersede**, **pre-chew**, **promote**.

⚔ **The retirement cluster** — four words for adjacent concepts: **strike** (visibly
retire text with a dated note) · **retire** (end a term/artifact's usage) ·
**tombstone** (retired file kept as a pointer) · **bury** (arborist: delete, git
keeps it). *Counsel:* these are four REAL, distinct concepts; keep all four,
define once.

### 2.4 Dispatch & the run

Settled: **dispatch**, **tend**, **relay**, **kickoff**, **summons**, **wear**,
**rig**, **preset**, **eject**, **refire**, **stamp/name-stamp** (+ birth name),
**roster**, **panel** (picker = same thing, prune one).

⚔ **fire** — three senses BY DESIGN (Felix's own dream phrase "fire-anything"):
launch a session · a kill criterion triggering · the glass auto-firing a card.
*Counsel:* keep the family, qualify at ambiguity (auto-fire, fire a row); the kill
criterion "fires" is standard English, not a defect.

⚔ **arm** — flow-authorization (Guild term, keep) · test/control arm (standard
science English, keep) · robot arm (product, unavoidable) · ARM ISA (product) ·
"mechanical arm of a law" (metaphor). *Counsel:* no ruling needed except awareness;
"ambiguity never arms" is already a house maxim.

⚔ **escalate** — canon charters say Dispatcher verb; the field: every mantle
escalates, directly to Architect or Felix, in every building. *Counsel:* the field is
right; the charter line is stale. Escalate = any session raising a question above its
authority. Cheap D-entry.

### 2.5 The place cluster (near-orthogonal, mostly healthy)

**venue** (execution environment, D55 — snappy also built venue law/bench/claims on
it) · **theater** (rig name-segment: campaign context) · **building** (repo, register
unit) · **house** (lore variant of building) · **home** (the one canonical file a
fact lives in) · **host** (machine bearing load) · **site** (where a law is written).
Seven words, seven distinct concepts — this cluster is proof the Guild CAN mint
cleanly. ⚔ only at the edges: theater vs building (glass derives campaign from
building; rig from cwd) — row 14/20 territory; and bench (physical robot rig, snappy)
vs bench (the office-as-judiciary, lore).

### 2.6 Evidence & measurement

Settled and strong: **evidence-grade**, **control / control arm**, **probe**,
**drill**, **smoke**, **canary**, **gauge**, **budget**, **bar**, **admissible /
inadmissible**, **conditions**, **trap**, **wedge** (stuck process), **twin**,
**fixture**, **golden** (the bless-collision lives here), **battery**, **rep**,
**denominator** (manny/simmy: the total a suite claims to run against — *counsel:*
harvest to canon; it names a silent-lie class nothing else names), **knee**,
**swing**, **reference band**.

### 2.7 Roles, staffing, absences

Settled: **mantle** (charter = its file; title = pre-canon fossil), **tier** (⚔ real
conflict in cap-mega: test-tier T0/T1/T2 and perf tier — same documents as capability
tiers; *counsel:* keep both, the qualifier disambiguates: "capability tier" ceremonial
form exists for exactly this), **staff**, **bare / null mantle** (`bare session`
struck at GA-11 — do not resurrect), **sovereign**, the six mantles, the unminted
(Steward, Royal, Imperial, Quartermaster, Ava chapter — named, reserved, empty).

**The typed-absence family is productive**: unrecorded · unstaffed (canon, D63) —
and the field independently minted **unowned** (simmy registry), **unstamped**
(nameless transcripts), **unresolved** (decoder), UNVERIFIED (claims without
evidence). *Counsel:* bless the PATTERN (un-X = a typed absence; each declares
ignorance or knowledge) and keep a registry of legal tokens in one place.

## 3. The load-bearing decisions

### 3.1 The Felix-yes family — one gesture, five concepts, six words

The concepts, first-principles:

| # | Referent | Current word | Evidence |
|---|---|---|---|
| Y1 | approve a spec/design for construction | **bless** | §13 canon; blessed: header field |
| Y2 | confirm a proposed D-entry | **countersign** (`✓ Felix`) | 266 ✓ Felix marks; machine-parsed |
| Y3 | decide an open fork/question, binding | **rule / ruled / ruling** | the field's word, every building, unglossed |
| Y4 | make a choice a D-entry | **ratify** | canon; low field usage |
| Y5 | accept a landing by inspection | smoke · visual pass · eye-verdict · certificate (whiteboardy) · "rules" (spacex) | ∅ no one word |

The live drift, on the record: Felix asked (2026-08-27) "is blessing the same as
countersign? if so, I like the word bless more" — and countersigned D69 *with the
word bless*. Meanwhile bless-as-golden-recording runs in three buildings, and
whiteboardy minted **auto-bless** (dispatch inside a countersigned envelope without a
live yes).

**The fork (taste, with evidence):**
- **(a) bless becomes the one spoken Felix-yes** — Y1+Y2 collapse in speech;
  `✓ Felix` stays the record token (machine-bound, D63); countersign retires to a
  record-grammar word. Cost: golden-collision worsens; "auto-bless" gets ambiguous.
- **(b) rule becomes the umbrella verb** (the field already voted with ~8,000
  usages); bless stays Y1-only; countersign stays Y2-only. Cost: crosses his stated
  preference for "bless"; RULED token needs a grammar slot.
- **(c) keep the full split**, add Y3=rule and Y5 to the glossary. Cost: six words
  for one gesture family — the current confusion, now documented.

*Counsel:* (b) fits the evidence; (a) fits the sovereign's mouth. Either works if Y2's
**record token stays `✓ Felix`** — the migration price of changing that token is
row-18-scale. Decide the SPOKEN verb; never move the stone token.

### 3.2 The working-occasion knot — session / window / sitting / seat / office

Not synonyms. Five real concepts, currently entangled (the sitting's own summons used
three interchangeably):

| Concept | Word | Status |
|---|---|---|
| one agent process/conversation, boot→clear | **session** | universal; product collisions (X11, engine-under-test) are contextual |
| the continuity vessel — context held warm, renameable, mortal | **window** | LOG's word; collides with time-window, GUI window, byte-window |
| a formal decision-dense occasion with Felix | **sitting** | field-confirmed distinct (B18: "bundling several blessings at once") |
| one holder's tenure of an office | **seat** | LOG lineage counting |
| the persistent institution across holders | **office** | settled (standards office) |
| lore-persona of session | bee | canon+lore only; bob/whiteboardy never adopted |

*Counsel:* ratify the five-way split AS the standard (each word already carries its
concept in the majority of uses); define window's two rivals away (time-window →
"window of X" always qualified; GUI window → product domain). This is the cheapest
big win in the census: no migration, just definition.

### 3.3 rider — six senses, one word (the worst noun)

1. dispatch appendix, `plans/RIDER.md` (canon, the birthname)
2. staffing-cell parenthetical (D63d — "annotation for eyes")
3. ledger-head annotation ("riders … go in the body", §7)
4. mandatory attached condition (D50 "two riders mandatory")
5. bundled sanctioned side-fixes on a row's branch (manny/arborist)
6. flagged-but-unresolved secondary finding (cap-mega boards)

*Counsel:* rider keeps sense 1 ONLY (file + concept). 2–3 are already "annotation"
in doctrine prose — finish the job. 4 → "condition"/"proviso". 5–6 are one real
concept (small attached follow-work) that deserves its own word at the choosing.
Machine cost: low — RIDER.md is a filename; senses 2–6 live in prose.

### 3.4 The gate family

86 glosses. Four real concepts: **Felix-gate** (typed board token, machine-parsed —
the hyphen is law; two files already drifted to "Felix gate", lint catch) ·
**gate row** (dispatchable review checkpoint, G-rows) · **machine gate** (type gate,
boot gate, health gate, landing gate — automated pass/fail barrier) · product gates
(robot safety, boot stages). *Counsel:* qualified compounds are already doing the
work; bless the pattern "‹kind› gate", reserve bare "gate" for board contexts, keep
the hyphen sacred.

### 3.5 The two decision tiers — see §6.

### 3.6 helm vs inbox — two queues, two cadences

**inbox** (ISSUES.md): filed, then ruled at the next sweep — pull cadence.
**helm** (simmy, cap-mega docs, manny: typed frames Decide/Produce/Gated; gitignored,
machine-local): standing blocked-on-Felix-NOW queue — push cadence. Belvedere's
needs-you queue is the same concept wearing glass. The doctrine's "decision queue" is
declared virtual ("not a file") — the field disagreed three times and built one.
*Counsel:* this is the strongest harvest candidate in the census. Name the concept
once (helm has field seniority; "sovereign's inbox" is the glass's phrase), fold as
canon artifact or explicitly rule it building-local.

## 4. The homonym price list (collisions with canon terms, by weight)

| Word | Canon sense | Rival senses (where) | Price of keeping both |
|---|---|---|---|
| row | board unit | outliner node (whiteboardy product), UI table row, Pi registry | none — domains rarely meet in one sentence; linter scopes by artifact |
| board | work-state table | Raspberry Pi (whiteboardy ×2!), product `board()` (spacex), bulletin thread | low; "the board is UP" already reads as hardware in context |
| glass | Belvedere | touchscreen surface (whiteboardy T-rows, "typing on glass"), greenhouse (hexwright lore) | real — two ACTIVE projects; choosing should rule |
| tier | model×effort preset | test-tier T0/T1/T2, perf tier (cap-mega, same docs) | medium — qualify: capability tier |
| register | the linter's building set | DECISIONS.md (change-order register), metaphor register (D51), cached parse (glass) | medium — three Guild-internal senses; choosing should split |
| theater | rig name segment | campaign front ("three theaters"), procedural theater (pejorative) | low |
| census | this row's census | Belvedere's session-gathering probe + telemetry log | low; both Guild-internal, qualify |
| mint | create canonical artifact | UR variable allocation (product), scratch-dir mkproject | low |
| bless | spec approval / Felix-yes | golden recording (×3 buildings) | see §3.1 — the choosing's center |
| city | the repos | Belvedere's City view (proper noun) | low — "the City" capitalized is the view |
| harness | Claude Code runtime | test harness (universal engineering) | none — qualify when near test code |
| fence | scope boundary | code fence (markdown) | none — "fenced verbatim" is always markdown |
| silo | account isolation | project/cwd isolation (row 14) | qualify: account silo, project silo |
| comb | account memory (lore) | LOG re-mint: durable inherited structure | lore-internal; the diary owns it |
| residue | unfillable migration field (16/18) | census candidate residue (this row!) | the office collided with itself; qualify |

## 5. The verdict-token zoo

### 5.1 Row lifecycle (canon, settled, machine-parsed)
OPEN → IN FLIGHT → LANDED / KILLED (+BLOCKED; PENDING/PARKED annotations; retired:
DONE, CLOSED, WIP, TODO, AUTHORED — all still appearing in dialects as fossils or
fresh sins; PROPOSED (pre-cut), READY, HOLD/HELD, OWED grew in the field).

### 5.2 Resolution verdicts (canon): PASSED / MERGED / BLESSED riding annotations.

### 5.3 The gaps the field filled ELEVEN different ways
- **campaign/batch completion**: CLOSED (used against its own retirement — including
  MAP §8/§9 "Canon v1 CLOSED"), "campaign closed / batch closed", CUT (batch
  authored). *Counsel:* the five-word lifecycle is ROW law; campaigns need one legal
  completion token — mint it at the choosing (candidates: CLOSED-at-campaign-altitude
  legalized, or a new word).
- **experiment/hypothesis verdicts**: PROVEN/KILLED (simmy) · HELD/dead (repot) ·
  VIABLE/DEAD (whiteboardy) · GO (recon) · RETAIN (row 17) · dirty/clean (safety
  census) · Genuine/Fake reds (repot) · MISCONFIGURED (non-verdict: bad venue) ·
  CONDITIONAL PASS + CERTIFICATE ISSUED (whiteboardy milestones) · LOST (no
  measurement) · jarIdentity fresh/stale/foreign. *Counsel:* standardize the SMALL
  shared core (a proven/killed pair + a held/inconclusive + an inadmissible), leave
  domain-specific tokens as declared building law.
- **doc freshness**: STALE/CURRENT/HISTORICAL/PROPOSED (bob) — a real concept canon
  lacks; manny/simmy echo STALE.
- **liveness** (glass): working/idle/needs-input/gone — already coherent, keep.

## 6. The decision-registry sprawl — one concept, eight numbering schemes

Global D-entries (canon) — then: A1…A26 (arborist, lettered "laws") · RP-1…8
(repot) · C-D# / LB-D# / PD-D# (bob per-campaign, each restarting at 1) · TH-D#
(theseus) · bare D# (simmy, snappy — same letter, incompatible scope!) · "Rulings
record" ruling 11/15 (cap-mega docs) · helm frames + F-numbers (proposals distinct
from ratified entries) · gate A/B ruling checkpoints (snappy).

The field's verdict is unanimous: **there are TWO concepts** — the canon-grade
ratified entry, and the campaign-scoped lightweight ruling that would be noise in the
global register. Seven independent inventions of tier two. *Counsel:* bless the
two-tier system: D-entries global; a standard campaign-scoped form (prefix = the
campaign's, the pattern already practiced: ‹campaign›-D‹n›); bare "D#" outside the
canon register becomes a lint warning (bob's own collision report). "Register
minimalism" (Felix, GA-11) is the same instinct at the top tier.

## 7. The metaphor registers — a map, not a war

| Register | Words | Layer it settled into | Adoption |
|---|---|---|---|
| hive | bee, comb, waggle*, trail, stigmergy, hives | lore + one operational signal (waggle) | canon, Log, belvedere; NEVER bob/whiteboardy |
| city/construction | city, building, code, office, standards office, campus, house | structure & jurisdiction | canon, belvedere, lore |
| nautical/flight | keel, land/LANDED, IN FLIGHT, launch, landing | the lifecycle itself | UNIVERSAL — the register nobody named is the most adopted |
| court/feudal | sovereign, countersign, bless, summons, decree, throne, seal, reign, crown | authority | canon, lore, belvedere |
| parliament/legal | sitting, ruling, register, ratify, amendment, law, clause, act | the record | universal in record files |
| ordnance/military | fire, arm, theater, guard, battery, salvo | dispatch & experiment | rig, glass, labs |

\*waggle is drifting: snappy uses it for any informal Felix check-in — the four-line
contract (D51) is not traveling with the word.

*Counsel:* the registers specialized by layer on their own — this is D31's "flavor
altitude" already working. The choosing's real question is not "which register wins"
but whether to RATIFY the layer assignment (a register lives at its layer; crossing =
lint warning) and whether the hive register stays law-adjacent (waggle) or moves
wholly to lore given two buildings live happily without it.

## 8. The formula book — 688 fixed phrases

Three strata, by home:
- **Law formulas** (canon-law class; travel as shapes): "files carry the truth" (the
  motto — variant "files carry truth" is drifting, pick one byte-form), "a documented
  kill is a win", "gates are rows", "ambiguity, never plurality", "measurements carry
  their conditions", "probes ship with a control", "stop and escalate", "a paraphrase
  is a defect", "the state leads, the annotation follows", "passing = finished",
  "one function, one home", "append, fold, strike", "a brief digs; an order builds".
  *Counsel:* these ARE the standard — the census confirms they travel; the choosing
  should canonize the exact byte-forms of the top ~20 (the linter can then hold them).
- **Lore formulas** (the shelf): "keep the joy", "law lives where it's loaded",
  "warmth is context, not clock", "refusal and reservation are one discipline",
  "merge the stranded before you sweep" — voice, never law; no ruling needed, the Log
  owns them.
- **The sovereign's incantations** (FELIX): "make it so", "bless!", "I unleash you",
  "PUSH BACK", "closing is always safe; agreeing never is", "best decisions are
  driven by real pain", "we don't hide where we came from", "stone was never the
  working tree", "clarifications of my original intent, not actual new things".
  These are rulings wearing poetry — several already function as cited law.
  *Counsel:* the choosing decides which get glossary entries; the rest stay his.

## 9. Orthography & notation

**Spelling** (full table: `lab/21/ortho-report.md`): the corpus is bilingual with an
AmE lean and one strong BrE island — **grey 231/5** (his own rig law: "staleness greys
the furniture") beside **color 509/258** (the `/color` command forces AmE). Also
mixed: center/centre 49/58, behavior/behaviour 219/174, honor 80/52,
judgment 131/7, artifact 272/20, -ize/-ise 673/193 (serialize beside memoise).
His examples at the sitting: "center", "color", "grey" — an AmE base with named
exceptions is consistent with the corpus's own lean. *The choosing picks the base +
the exception list; the linter enforces word-by-word from the lexicon, not by
dialect-guessing.*

**Units**: metric/SI + software units (ms 3294, px 896, MB/GB/KiB…). Imperial: 5
occurrences, all quoted robot payloads. One sentence of law suffices.

**Dates**: ISO 8601 is de facto law (3,672 uses); ~64 month-name stragglers cluster
in bob/spacex/simmy — a mechanical sweep.

**Notation** (settled by usage, confirm as law): `·` field separator in heads · `—`
empty cell / the house dash (26,853!) · `→` handoff/sequence · `§` doc-section
citation · `✓ Felix` countersign mark · `×3` multiplier · `⟨slots⟩` template
blanks · `~~strike~~` + dated note retirement · **bold-at-minting** · fenced-verbatim
instruments · `file§` evidence coordinates · id grammars: D‹n›, F‹n›, E‹n›, G‹n›,
GA-‹nn›, ‹mantle›-‹theater›-‹NN›. ⚔ one clash: **F‹n›** = findings (canon) but also
proposals (arborist) and lint rules share bare letters with milestones and MISMATCH
ids in manny ("M" ×3). *Counsel:* one-letter id prefixes are a namespace; publish the
table, campaigns pick unclaimed letters.

## 10. Machine-bound terms — rename = migration

From `doctrine/src/grammar.ts` (its own comment: "a mantle, a tier, a state or a
verdict is named HERE and nowhere else"): the six MANTLES · four MODELS × five
EFFORTS (tiers) · five STATES · `Felix-gate` · PASSED/MERGED/BLESSED ·
retired-synonym map · PENDING · PARKED · unrecorded · unstaffed. Plus glass surfaces
(deck, card, City, workshop, rail…) and the ledger-head grammar (D63). **Renaming
any of these = a row-18-scale migration + linter + glass release.** Everything else
in this census is prose-priced.

## 11. Unnamed concepts (the census found holes, not just overlaps)

1. Campaign-level completion status (§5.3).
2. The lightweight scoped ruling (§6).
3. The standing blocked-on-Felix queue (§3.6).
4. Landing-acceptance-by-inspection, as a recordable verdict (Y5; whiteboardy's
   "certificate" is the most-developed candidate).
5. Bounded follow-up debt a landed row leaves (OWED / residuals / candidates /
   "landing note" items — four dialect names).
6. The mid-level work grouping (chapter/milestone, §2.1).
7. The doc-freshness axis (bob's STALE/CURRENT…).
8. A short canonical display name for a row/thing — Felix already coined
   **encapsulation** (≤6 words); unratified.

## 12. The long tail

1,390 terms below the core bar (unflagged, low-frequency, single-sense) live in
`lexicon.json` + `digest-tail.txt`. Nothing there is collision-flagged; they are
building-local color and one-off coinages. The standard should stay silent on them —
STE governs the shared tongue, not every word ever spoken.

## 13a. The id-prefix namespace (Felix's ask, first-impressions pass)

Raw registry: `lab/21/prefix-acro-report.md`. 46 letter-prefixes in live use. The
canon-wide kinds: **D** (decisions, 4,448 raw — but scoped eight ways, §6) · **F**
(findings — also arborist proposals) · **E** (escalations — also whiteboardy editor
rows e13, experiment ids) · **G** (gates) · **GA-** (sittings — collides with GA the
office abbreviation) · **FC-** (fold candidates) · **FG** (Felix-gates, cap-mega
dialect). Per-building row ids: B (belvedere) · P (probes) · S/SH (spikes, shells) ·
ARB- · REP- · RP- · WO- · BV- · X/Q/N/A/R/O/H/W/L/I/U/V/Z/K/Y/J (assorted, some
one-campaign). **The M pile-up**: milestones (M0…, two buildings) + manny lint rules
(M1…M13) + walk-log mismatches (M-17) + spacex M-rows — four schemes, one letter,
zero disambiguation. Separator grammar is split: bare `D37` (canon) vs dashed
`ARB-07`/`GA-09`/`PD-D9` (compounds and campaigns).

*Counsel:* publish ONE table: canon-wide kinds get reserved bare letters (D, F, E,
G + GA-/FC- compounds); every campaign declares its row-prefix at founding (the
founding ritual gains a line); compounds always dash; bare letters never reused
across kinds within one building; the linter holds the table. This is cheap law with
high collision yield — the M pile-up alone justifies it.

## 13b. Acronyms (Felix's ask: "are we including acronyms in this?")

Raw inventory: `lab/21/prefix-acro-report.md` (391 at ≥8 uses; filenames like README
are extraction noise). The load-bearing Guild-internal ones: **DoD** (1,352 — the one
that sent Felix to a search engine), **WO**, **LOC**, **STE**, **GA**, **THG**, plus
engineering-universal (API, UI, VM, CPU, DAG, CRDT, JVM, DOM…) and product-domain
(UR, URCap, URSim, MO/SO/DO — bob's production orders, EDT).

*Counsel:* STE's own answer is an **approved-abbreviations list**: (1) Guild-minted
acronyms are standard entries — concept, expansion, where legal (DoD's fate is a
choosing call: keep-with-glossary vs spell out "definition of done"); (2)
engineering-universal acronyms are legal unglossed; (3) everything else spells out at
first use per doc. The lexicon carries the allowlist; the linter enforces it.

## 13c. The sovereign's first-impressions pass (2026-08-28, non-final, his words summarized)

Recorded so the record outlives the window — **"NOTHING is settled"**: acronyms need
a ruling (DoD bit him) · letter-prefixes need exact uniform usage · row might fall
(order candidate — collides with order-the-genre, see cascade) · cut/kill: his
addendum matches standing law (kill = remove exists; cut = create may stand) ·
mantle may split into **singular offices** (GA, Mentat) vs **mantles** (plural
wearers) with **Fixer** as a possible formalized null-mantle · bless/countersign
split challenged — no good reason found for two spoken yes-words (office concurs:
the object carries the information; record tokens stay typed) · bless itself at risk
(golden collisions) · the 5-way occasion split "will not fly" (collapse coming) ·
**rider dies** · **gate stays** · **helm (the word) dies** · **glass (the word)
dies** · nautical/flight register: the one he most wants to kill (price: LANDED /
IN FLIGHT / keel are machine-parsed lifecycle — doctrine-migrate-scale) ·
chapter/milestone under debate.

## 14. The exploration boards (live, with Felix — his goal: one word, one meaning)

### 14.1 The yes-word (his lean: back to bless; goldens rename `--bless` → `--gild`)

| Candidate | For | Against | Verdict |
|---|---|---|---|
| **bless** | incumbent · his word · court register · noun-able (the blessing) | golden collision (cleared by --gild) · auto-bless compound | podium |
| **sign** | the ✓ IS a signature · countersign minus the counter- · "sign-off" attested | plain · product sign/signage noise (low) | podium |
| **seal** | "holds no seal" already canon-adjacent · names the ✓ token as a noun (the seal) | heavier than bless | podium / token-name |
| rule | field's verb ×8,000 | choice-shaped, not assent-shaped | keep for forks only |
| sanction | attested | approve AND punish — auto-antonym | dead |
| ratify · grant · approve · decree · greenlight · anoint | various | cold / corporate / too much / green-collision | bench |

*Counsel:* **bless = assent to a thing · rule = decide between things**; countersign
dies as a verb, survives as the record token's name (the seal / ✓ Felix). `--gild`
ships regardless — better than the industry's own word.

### 14.2 The founding act (his lean: cornerstone over keel; landed / in flight stay)

Finding: keel (shipbuilding) never matched landed/in flight (aviation) — dropping
keel while keeping the flight states is a correction, not a compromise. The city
register offers the full ceremony, all real-world rites:

| Word | Referent | Notes |
|---|---|---|
| **break ground** | campaign work begins | "we broke ground on v3"; groundbreaking-as-adjective noise is low in context |
| **cornerstone** | the founding doc / plan | real cornerstones carry engraved founding dates — exactly what the doc is; zero corpus collisions |
| **set the keystone** | campaign completion (gap §11.1!) | the last stone that makes the arch stand; whiteboardy's keystone-tests are a small, contextual collision |
| **foundation** (Felix's late entry) | most functionally true (the doc is what the campaign stands on) · D38 lineage literally includes *Foundation* · "foundational sessions" already canon speech | dead-metaphor business English · foundation-model collision (the one future-guaranteed tech sense) · 4 syllables | head-to-head with cornerstone — taste |
| first stone · blueprint · charter · commission | founding variants | two words / spec-collision / mantle-collision / dream-collision |

*Counsel:* cornerstone + keystone as a pair — founding and finishing in one register.
Price: prose-only. "Genesis" stays dead.

### 14.3 Replacing cut (his pain: create-vs-remove ambiguity on every use)

| Candidate | For | Against |
|---|---|---|
| **open** (rows, batches) | act and OPEN state unify — "opened three rows"; in board context can only mean create; zero new vocabulary | generic outside board context (harmless) |
| **mint** (canonical artifacts) | already law for tiers/tokens/standards; direction-proof | UR-variable product noise (contextual) |
| author | the doctrine's own "author into existence" made verb; unambiguous direction | formal; haunted by retired AUTHORED token |
| draft · lodge · cast · stake · plot · raise · commission | various registers | not-final / filing-not-creating / throw-noise / waggle-Stakes / chart-noise / escalate-noise / sovereign's act |
| table | — | BrE propose vs AmE shelve — the worst word for a bilingual corpus | 
| strike · cleave | — | auto-antonyms; cleave listed for comedy only |

*Counsel:* **open + mint**, cut dies entirely, kill/strike keep removal. Zero new
words, two existing ones widen slightly.

### 14.4 Replacing row (his lean: exploring; "order" floated)

The case against row: it names where the thing is written (a table row), not what it
is — positional, not conceptual.

| Candidate | For | Against |
|---|---|---|
| **job** | one job = one doc = one session; universal scheduler semantics; zero collisions; STE-perfect | zero poetry |
| **order** | work-order heritage (hexwright, bob); the board becomes **the order book** | order-as-sequence saturates doctrine prose ("moves ordered behind it") — singular-meaning test strains; genre "order" must rename (cleanest: **the dig and the build**) |
| **commission** | city-coherent (guilds take commissions) | heavy; the-city uses it for Felix's founding act |
| ticket | the-city already maps "a job ticket" | corporate stink |
| task · mission · charge · stone · lot · shift · piece | various | harness Task noise / epic-inflation / legal noise / stone-is-git collision / obscure / session-shaped / weak |

Also ruled at exploration: **session beats window** — window demotes to lore.

## 15. Rulings & live boards (running record of the choosing)

**RULED (2026-08-28, Felix, in-sitting):**
- **bless = the yes from Felix** — assent to a thing, an option in a fork, the sign
  (⬡✓). One spoken yes-word; record tokens stay typed.
- **rule/ruled stays** — the decision verb, either direction (bless can only say yes;
  no's and withdrawals need a verb). Office concurred.
- **session = a context window with an agent** (merges process + vessel). **Window
  demotes to lore.** seat & office as census-written.
- **rider, helm, glass (the words): dead. gate: stays.** `--bless` goldens → `--gild`.
- **The keel is dead; nautical closes** — landed / in flight stay (they were aviation
  all along); founding act moves to the city register: **cornerstone vs foundation**
  head-to-head under deliberation (§14.2).

**LEANING (his words, not yet ruled):**
- fire → **ignite** (office: fire also means dismiss-from-employment — the loaded
  gun; spark = short variant). wave → **batch** (D64 baton shapes become
  move / batch / fork). cut-the-noun dissolved (the redesigned baton needed no noun).
- unit-of-work: **order** ("received one's orders") vs **charge** (ignite a charge —
  ordnance-coherent; caution: broad civilian polysemy) vs job (bulletproof).
  command/instructions: dead on shell-command collision. Landmine noted: "fire the
  order" is kitchen slang; "ignite the charge" is pun-perfect.
- **fold → distill** (fold failed the sovereign-decode test; canon's own definition
  of fold IS "distill"). "fold sitting" ≠ "bless session" — it is the distillation
  session (Architect work, not assent).
- **sitting**: fork open — (a) dies into session (singular-meaning answer) or
  (b) survives narrowly as the Felix-present decision occasion.
- **⬡ family**: ⬡ = Felix / awaiting his hand · ⬢ = sealed (filled at the yes);
  collision: ⬡ currently marks parked somewhere in-corpus (low entrenchment, moves).
- The decode benchmark, verbatim: "Baton — Felix: fire the 18-continuation wave
  cut:" (four jargon tokens, seven words, sovereign stopped cold) → "Baton — ⬡ →
  Ignite the 18-continuation batch." (zero lookups). The standard's acceptance test
  is born: **a baton must read cold.**

**RULED, round 2 (2026-08-28, Felix):** **fold → distill** (blessed; "Baton — ⬡ →
Ignite the distillation session." is the benchmark sentence) · **sitting: dead** —
session covers all · **charge = the unit of work** (blessed; "agents charging in,
with their charges, ignited by me" — row dies; order-the-genre is now collision-free
and survives) · **wave → batch** (blessed) · **baton shapes = action / batch / fork**
(move → action; harmony with the deck's Action pane, where a baton's action renders)
· **ignite = the dispatch act** (blessed via the benchmark; fire retires from
dispatch — English reading "fire the Dispatcher" = sack them, attested live in
belvedere's ledger this week; kill-criteria may still "fire" as plain English) ·
**⬡ PARKED** — it is Felix's mondokoro (signature mark); ⬢ unassigned, he deliberates.

**The specimen bench (round 1, real corpus lines dissected):** five live sentences
rewrote cleanly under the standard-so-far; new open slots minted: (1) **ignite's
legal objects** — a charge, a batch, a session; never a person or mantle (one line of
grammar); (2) **dispatch survives as noun/system** beside ignite-the-verb — wants a
ruling; (3) the **fire-now** compound's replacement ("ready now"); (4)
**register-layer discipline as lint law** — lore words in law surfaces (a "hive" in
a ledger Next-line, the office's own hand) are manny's smuggler-words rule
generalized; (5) **strike's second face** — canon-strike (retire text) vs
strike-down (decide) — same disease as cut, milder.

**Register addendum (Felix's catch): the ecclesiastical/biblical register** — canon,
doctrine, bless, ritual, rite, decree, anoint. Load-bearing (three of the standard's
heaviest words); overlaps the court register at the throne. Added to §7's map.

## 13. The choosing protocol

Recommended walk, one sitting, ~35 rulings in eight clusters — each cluster one
decision card, not word-by-word:

1. **The Felix-yes family** (§3.1 fork a/b/c + Y5's word) — the center.
2. **The working occasion** (§3.2 five-way ratification).
3. **rider** (§3.3) + the follow-work word (§11.5).
4. **Verdict zoo** (§5: campaign-completion token; experiment-verdict core; freshness
   axis in/out).
5. **Two-tier decisions** (§6) + helm/inbox (§3.6) + escalate-for-everyone (§2.4).
6. **Registers** (§7: ratify layer assignment; hive's status; waggle's contract).
7. **Orthography & notation** (§9: spelling base + exceptions; formulas' byte-forms;
   id-prefix table).
8. **Enforcement**: the language linter row (ancestor: manny M-rules; food:
   `lexicon.json`; venue: `doctrine lint`'s vocabulary arm) — cut it or park it.

Then: DOCTRINE §13 is rewritten as **the standard** (concept → word → part of speech
→ "instead of" column), the D-entry rides, the glass tooltips and grammar.ts inherit,
and row 18's continuation carries any respellings into history under the molt clause.
