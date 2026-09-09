# 021 — the working vocabulary: the census, then the standard

**Status:** LANDED 2026-08-29 — the standard is blessed (D71 ⬡✓); the census ran, the nine choosing rounds ran, [STANDARD.md](../canon/work/STANDARD.md) is law · **Depends on:** ⬡-gate: his call to sit — paid 2026-08-28 · **Staffing:** Grand Architect · fable-max

## The directive — Felix's words, verbatim

The original mandate (canon inbox 2026-08-28, drained at grand-architect-11):

> "I'd like to actually formalize/standardize the language we use about these things at some point … I want to have a dedicated session for this, and then canonize it."

The terms he named: **arm / pass / card / flow / verdict / fire / closed / landed / bless / countersign / session / window**.

**Redirected at the sitting's open (2026-08-28, Felix, verbatim)** — census before standard; the stub's "cut the vocabulary standard" directive is overridden:

> "First -- I want to do a COMPREHENSIVE analysis of all the nouns & verbs we (The Guild) use. […] These are not my terms, they were written by an agent. I don't want you to just blindly invent a new standard. First -- I want to figure out a way to collect ALL the terms (nouns/verbs aka. things/actions) and then group them and define them. Kind of like what we did docs/the-city. […] Only after that is done, do I want to chose what words *I* want to use. The existing glossary is on the chopping block."

Riders, same sitting, his words:

- Orthography joins the scope: "I want a way to specify what spellings, for example: 'center', 'color', 'grey' -- all units should be metric -- ISO standards -- etc"
- Enforcement is the horizon: "we're going to choose … together, and then set everything up so that's what The Guild calls things when they talk about that thing. Even if we have to make linters for language."
- The destination named: "It's *almost* like we're going to make our own Simplified Technical English, but this is for The Guild. We can use a little bit of fun & lore & lots of metaphor & analogy"
- The frame: "ensuring that we make this a first principles, concepts driven approach"

## Folded into this sitting

- **bless vs countersign** (Felix, via the Belvedere deck sitting, 2026-08-27): "is blessing the same as countersign? if so, I like the word bless more." [DOCTRINE §13](../canon/work/DOCTRINE.md) splits them today. Note: D69's countersign arrived as the single word "bless" — the drift is live in the record.
- The glossary standing at DOCTRINE §13 — on the chopping block: the census treats it as evidence, not authority.
- Live surfaces that inherit the ruling: Belvedere's deck tooltips (B20), the flow chapter, `doctrine/src/grammar.ts` (the machine-bound vocabulary).
- Row 020 coordination unchanged: if 20 runs first its flow doctrine mints some terms and this sitting harmonizes; else this sitting defines and 20 inherits.

## The method — census first, standard second

**Phase 0 — corpus.** `lab/021/build-manifest.ts` walks the census corpus and assigns every file a reader territory — deterministic, re-run = same census. Tier A: this repo (~250k words — canon, records, plans, belvedere, tooling, lore, commit log). Tier B: every other building's Guild surfaces across `~/code`, discovered by doctrine markers + board/staffing/findings signature tests (product content excluded; manny recovered from its worktree orphanage). 1.26M words, 441 files, 38 territories → `lab/021/manifest.tsv`, `lab/021/territories/`.

**Phase 1 — the extraction wave.** One reader per territory ([PROTOCOL](../lab/021/PROTOCOL.md)): opus-high on the law core (canon, records, LEDGER, LOG), sonnet-high on the rest, sonnet-medium on the commit log. Readers over-collect, quote verbatim, gloss the concept-in-context, flag collisions and minting sites; seed list suppresses re-collection of the settled core; a sense-hunt list forces per-sense quotes for the known polysemes (session/window/sitting/seat, cut, fire, arm, …). Output: `lab/021/obs/<id>.jsonl` + per-file coverage lines.

**Phase 2 — the mechanical nets.** Scripts, not readers: concordance (word-boundary counts + file spread per merged term), candidate residue (ALLCAPS / bold-at-minting / italics / backticks / stopword-diffed frequency, diffed against the readers' haul), orthography & notation (BrE/AmE variant counts, unit mentions, non-ISO date shapes, the symbol inventory), machine-bound flags (`doctrine/src/grammar.ts` + glass renderings — a rename there is a migration, priced as such).

**Phase 3 — the merge (this office, fable-max).** Concepts-driven: induce the **concept inventory** from the glosses — the referents the Guild's operation actually contains — then map observed words onto concepts, many-to-many as found. Deliverables: `plans/021-census.md` (concept domains; per concept its words with evidence; the collision sets; the metaphor-register inventory; orthography report) + `lab/021/lexicon.json` (the machine-readable census — the future language-linter's food). Coverage asserted against the manifest.

**Phase 4 — the choosing (Felix, with the office).** Concept by concept, collision by collision: one concept, one word, one part of speech — STE discipline with a licensed lore register. Only then is the standard cut: a D-entry, §13 replaced, deploy surfaces named, enforcement (a language linter) cut as its own row if wanted.

## Deliverables

- `lab/021/` — the census rig and data (lab law: disposable, EXCEPT `lexicon.json`, whose promotion the choosing decides).
- `plans/021-census.md` — the census the choosing reads.
- Findings appended here. The standard itself is **not** this row's to write unilaterally — it is chosen with Felix, then canonized.

## Findings

*(append here)*

**Phase 3 delivered (2026-08-28, same sitting):** the concept pass is written — **[plans/021-census.md](021-census.md)** — concepts-driven per Felix's frame: the concept atlas (domains, contested and unnamed concepts), the five load-bearing decisions (the Felix-yes family · the working-occasion knot · rider ×6 · the verdict zoo · the two-tier decision registry), the homonym price list, the metaphor-register layer map, the formula book (law / lore / the sovereign's incantations), orthography & notation, machine-bound price tags, eight named concept GAPS, and the choosing protocol (~35 rulings in 8 clusters). Headline: "ruled" is the field's true verdict verb and §13 never blessed it; bless has a rival golden-recording sense in three buildings; the field independently reinvented the scoped ruling (7 schemes), the Felix-queue (helm ×3), and campaign-completion (CLOSED against its own retirement). Phase 4 (the choosing, Felix + the office) is all that remains of this row.

**Early collision harvest — reader reports relayed at part-1 close (2026-08-28).** Merge-priority leads, credited; the obs files carry the evidence:

- **A13** (commit log): "the City" (Belvedere's dashboard view) vs "city" (the repos) — head-on, both load-bearing. "census" doubly loaded (this row vs Belvedere's P1 census probe rig). The null mantle (D26) is a clean minting site.
- **A11** (glass ledger): "deck" re-minted mid-campaign — old surfaces renamed "rooms" and killed; the ledger itself disputes bless/countersign unresolved; "session" used as informal synonym of "sitting" throughout.
- **A9** (glass b1–b12, 60 minting sites): "landed" self-collision (B11 step-landed vs board LANDED); three senses of "fire" coexist by design (rail fires batons, shelf fires resumes, composer fires a blank page); "unstamped" as an unreconciled third typed-absence; lore-stage role names Steward/Ava chapters; maxim house-style ("ambiguity never arms" / "a judge is never judged").
- **A8** (glass p-series): "gate" overloaded ×5 (board-row type, verb, cmux access, reactive gate, fire-gate); deck-keel mints "the rail"/"the shelf" as retiring surfaces with inherited semantics; formula drift: "files carry truth" (article dropped) vs the canon "Files carry the truth".
- **A6** (plans 13–22): "silo" self-collision (account axis vs project/cwd axis, row 14); "residue" minted in doctrine (16/18: unfillable field) then re-purposed by this very census (candidate residue); "glass-shatters" and "round-trip law" double-coined same day (16 + belvedere.md); "sitting" shows ≥3 senses; fence / gauge / wave are core-but-unseeded terms of art.
- **A5** (plans 01–12, 105 minting sites): "the tick" hard collision (night-shift's hourly cycle vs the rig's sub-second repaint); night-shift mints an unratified governance layer (Steward, green/yellow/red autonomy lanes, trust ratchet); "Files carry the truth" is cited as the canon motto's operative clause.
- **B1** (hexwright): hexwright's own "canon" self-disambiguated from the Guild's; dream.md:108 mints "an order" (Felix's pre-Guild name for the movement) and dream.md:135 is the literal coinage site of "Grand Architect"; PENDING stretched to a phase-level sense; dialect verdict verb "ruled / Ruled by" vs canon PASSED/MERGED/BLESSED.
- **B3** (arborist): a full dialect fork of the decision system — lettered ledger A1…A26, never "D-"; "brief" covers Builder work ("order" absent from the building); "rider" self-collision (dispatch appendix vs ARB-13's bundled side-fixes); "escalate" practiced by every mantle, not Dispatcher-only.
- **B4** (bob 1/3): per-campaign decision numbering (C-D#, LB-D#, PD-D#, each restarting at 1) beside canon's global D-sequence; "## Inbox" README subsections vs inbox = ISSUES.md; the metaphor layer never crossed into bob (procedural layer only — "Session 1", never "bee"); session (X11 vs work), verdict (narrative vs token), stamp (freshness vs certify) each doubly loaded.
- **B6** (bob 3/3): three parallel status vocabularies in one building (board lifecycle; doc-freshness STALE/CURRENT/HISTORICAL/PROPOSED; fix-record implemented/diagnosed/ready-to-build).
- **B7** (simmy core): "helm" — a Felix-facing escalation queue predating the canon inbox; "spike" as the pre-canon ancestor of the Digger row; "gate" ×4 in one territory; pure product homonyms drain (drain_dialogs) and card (PolyScope Defaults card); live case-split land vs LANDED.
- **A3** (the ledger, landed at the wrap — 404 obs, 73 formulas): "bless" used against its canon gloss by Felix himself (LEDGER:1384 — D69 countersigned with the word "bless"), live counter-evidence on the bless/countersign boundary this row settles; homonym set — theater (campaign front vs rig name segment, competing with venue / home / project silo), register (DECISIONS vs the linter's building register), lineage (D38 ancestry vs session-name ordinals), fence (scope vs markdown); "ledger" as a VERB (:1159); the ledger is the densest ground for one-line laws living nowhere else ("two holders is zero holders", "law lives where it's loaded", …); two retirements the merge must not resurrect (`bare session` :1383, *genesis* :957).
- **A2** (root records, landed at the wrap — 517 obs, 106 formulas): canon collides with itself — rider ×3 (dispatch appendix / attached condition D50 / Staffing parenthetical D63d), register ×3 (change-order register / metaphor register D51 / the linter's building set), venue (board's doc D45 vs disposable VM D55), harness (runtime vs test suite), teardown (VM delete vs dismantling one's own proposal), arm (enforcement row vs battery branch); **CLOSED survives its own retirement at campaign altitude** (D18 retires it, MAP §8/§9 say "Canon v1 CLOSED" — the five-word lifecycle has no campaign-level vocabulary: a concept gap); the-city is a wholesale minting site (~20 city-register terms) while self-declaring reference-never-law; three productive affix families run corpus-wide: `Felix-` (gate/run/action/fork/tended), `-shaped`, `-tended`.
- **Nets** (mechanical): the corpus is bilingual — color/colour 509/258 but grey/gray 231/5, -ize/-ise 673/193, behavior/behaviour 219/174; ISO dates held (3,672; ~64 month-name stragglers, mostly bob/spacex dialects); imperial extinct (5 quoted payloads); symbol inventory topped by `—` 26,853 · `§` 9,689 · `·` 7,788 · `→` 6,573 · `✓ Felix` 266.

## Continuation — the wave state at handoff (2026-08-28, part 1 closed on Felix's word)

The sitting wrapped early — account near usage limits; quota arbitrage mid-sitting (MAP §5: any account can host any session; the repo carries the truth). State at close:

- **Landed, reports relayed above:** A5 A6 A8 A9 A11 A13 · B1 B3 B4 B6 B7.
- **In flight at close:** A1 A2 A3 A4 A7 A10 A12 · B2 B5 B8 B9 B10 B11 B12 B13 B14 B15 — obs files land asynchronously and their reports were NOT relayed; the obs files are the record. Any reader that died with the host session shows up as a MISSING entry in the merge's coverage assertion — re-fire exactly those.
- **Never launched:** B16 B17 B18 B19 B20 B21 B22 B23 B24 B25.

The continuation, in order:

1. `git status lab/021/obs/` — commit any obs files the closing session didn't catch.
2. Fire the unlaunched readers (and any casualties) with the template below — one `Agent(type=sonnet-high)` per territory, all parallel; the harness caps 20 concurrent, refill as slots free.
3. When obs/ holds all 38: `bun lab/021/merge.ts` — validates every line, asserts coverage against `manifest.tsv` (MISSING list ⇒ re-fire those territories), emits `lexicon.json` + `residue.json`.
4. Phase 3 (§Method): the concept pass — this office, fable-max. Induce the concept inventory from the glosses, map words↔concepts, write `plans/021-census.md`; fold `ortho-report.md` and an eyeball of `residue.json` into it.
5. Phase 4: the choosing, with Felix. Nothing is standardized before it.

**Extraction complete (2026-08-28, same sitting, resumed on Felix's "fire" at his 30% gauge reading):** all 38 territories landed — 7 timeout casualties, every one re-flown to a clean landing. Merge green: **5,544 observations · 3,066 distinct terms · 441/441 files covered · 0 bad lines** · 294 collision-flagged · 1,144 minting sites · 905 dialect · 234 lore · 52 felix-coined. `lexicon.json` + `residue.json` committed. Steps 1–3 above are done; Phase 3 (the concept pass) is next. Concordance counts on multi-form entries are raw evidence, not verdicts — generic forms inflate some (e.g. "row" includes product senses); the concept pass curates.

Reader fire template (retained for the record; B-territories — for A-territories drop the dialect sentence):

```
Guild vocabulary census reader ⟨ID⟩ (row 021, agents repo; dialect territory: ⟨cluster
from manifest.tsv col 3⟩). Steps: (1) Read /Users/felix/code/agents/lab/021/PROTOCOL.md
completely — it is your entire protocol. (2) Read EVERY file listed in
/Users/felix/code/agents/lab/021/territories/⟨ID⟩.txt (absolute paths, one per line) in
full. (3) Collect term-of-art observations per the protocol into
/Users/felix/code/agents/lab/021/obs/⟨ID⟩.jsonl — one coverage line per assigned file.
Building-local usage that differs from canon is exactly what we hunt: flag it
"dialect". (4) Reply with exactly the report format the protocol's last section
defines. Do not read beyond the protocol, your territory file, and its listed files;
write nothing except your obs file; do not commit.
```

---

~~Summons (verbatim, when Felix calls it): "… read ~/code/agents/plans/021-vocabulary.md and cut the vocabulary standard."~~ *(struck 2026-08-28: Felix redirected at the sitting's open — census before standard; the sitting runs interactive.)*
