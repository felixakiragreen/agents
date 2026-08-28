# 21 — the working vocabulary: the census, then the standard

**Status:** IN FLIGHT 2026-08-28 — the sitting is live (GA, interactive, Felix in the
room); census wave dispatched · **Depends on:** Felix-gate: his call to sit — paid
2026-08-28 · **Staffing:** Grand Architect · fable-max

## The directive — Felix's words, verbatim

The original mandate (canon inbox 2026-08-28, drained at GA-11):

> "I'd like to actually formalize/standardize the language we use about these things
> at some point … I want to have a dedicated session for this, and then canonize it."

The terms he named: **arm / pass / card / flow / verdict / fire / closed / landed /
bless / countersign / session / window**.

**Redirected at the sitting's open (2026-08-28, Felix, verbatim)** — census before
standard; the stub's "cut the vocabulary standard" directive is overridden:

> "First -- I want to do a COMPREHENSIVE analysis of all the nouns & verbs we (The
> Guild) use. […] These are not my terms, they were written by an agent. I don't want
> you to just blindly invent a new standard. First -- I want to figure out a way to
> collect ALL the terms (nouns/verbs aka. things/actions) and then group them and
> define them. Kind of like what we did docs/the-city. […] Only after that is done, do
> I want to chose what words *I* want to use. The existing glossary is on the chopping
> block."

Riders, same sitting, his words:

- Orthography joins the scope: "I want a way to specify what spellings, for example:
  'center', 'color', 'grey' -- all units should be metric -- ISO standards -- etc"
- Enforcement is the horizon: "we're going to choose … together, and then set
  everything up so that's what The Guild calls things when they talk about that thing.
  Even if we have to make linters for language."
- The destination named: "It's *almost* like we're going to make our own Simplified
  Technical English, but this is for The Guild. We can use a little bit of fun & lore
  & lots of metaphor & analogy"
- The frame: "ensuring that we make this a first principles, concepts driven approach"

## Folded into this sitting

- **bless vs countersign** (Felix, via the Belvedere deck sitting, 2026-08-27): "is
  blessing the same as countersign? if so, I like the word bless more."
  [DOCTRINE §13](../canon/work/DOCTRINE.md) splits them today. Note: D69's countersign
  arrived as the single word "bless" — the drift is live in the record.
- The glossary standing at DOCTRINE §13 — on the chopping block: the census treats it
  as evidence, not authority.
- Live surfaces that inherit the ruling: Belvedere's deck tooltips (B20), the flow
  chapter, `doctrine/src/grammar.ts` (the machine-bound vocabulary).
- Row 20 coordination unchanged: if 20 runs first its flow doctrine mints some terms
  and this sitting harmonizes; else this sitting defines and 20 inherits.

## The method — census first, standard second

**Phase 0 — corpus.** `lab/21/build-manifest.ts` walks the census corpus and assigns
every file a reader territory — deterministic, re-run = same census.
Tier A: this repo (~250k words — canon, records, plans, belvedere, tooling, lore,
commit log). Tier B: every other building's Guild surfaces across `~/code`, discovered
by doctrine markers + board/staffing/findings signature tests (product content
excluded; manny recovered from its worktree orphanage). 1.26M words, 441 files,
38 territories → `lab/21/manifest.tsv`, `lab/21/territories/`.

**Phase 1 — the extraction wave.** One reader per territory
([PROTOCOL](../lab/21/PROTOCOL.md)): opus-high on the law core (canon, records,
LEDGER, LOG), sonnet-high on the rest, sonnet-medium on the commit log. Readers
over-collect, quote verbatim, gloss the concept-in-context, flag collisions and
minting sites; seed list suppresses re-collection of the settled core; a sense-hunt
list forces per-sense quotes for the known polysemes (session/window/sitting/seat,
cut, fire, arm, …). Output: `lab/21/obs/<id>.jsonl` + per-file coverage lines.

**Phase 2 — the mechanical nets.** Scripts, not readers: concordance (word-boundary
counts + file spread per merged term), candidate residue (ALLCAPS / bold-at-minting /
italics / backticks / stopword-diffed frequency, diffed against the readers' haul),
orthography & notation (BrE/AmE variant counts, unit mentions, non-ISO date shapes,
the symbol inventory), machine-bound flags (`doctrine/src/grammar.ts` + glass
renderings — a rename there is a migration, priced as such).

**Phase 3 — the merge (this office, fable-max).** Concepts-driven: induce the
**concept inventory** from the glosses — the referents the Guild's operation actually
contains — then map observed words onto concepts, many-to-many as found. Deliverables:
`plans/21-census.md` (concept domains; per concept its words with evidence; the
collision sets; the metaphor-register inventory; orthography report) +
`lab/21/lexicon.json` (the machine-readable census — the future language-linter's
food). Coverage asserted against the manifest.

**Phase 4 — the choosing (Felix, with the office).** Concept by concept, collision by
collision: one concept, one word, one part of speech — STE discipline with a licensed
lore register. Only then is the standard cut: a D-entry, §13 replaced, deploy surfaces
named, enforcement (a language linter) cut as its own row if wanted.

## Deliverables

- `lab/21/` — the census rig and data (lab law: disposable, EXCEPT `lexicon.json`,
  whose promotion the choosing decides).
- `plans/21-census.md` — the census the choosing reads.
- Findings appended here. The standard itself is **not** this row's to write
  unilaterally — it is chosen with Felix, then canonized.

## Findings

*(append here)*

---

~~Summons (verbatim, when Felix calls it): "… read ~/code/agents/plans/21-vocabulary.md
and cut the vocabulary standard."~~ *(struck 2026-08-28: Felix redirected at the
sitting's open — census before standard; the sitting runs interactive.)*
