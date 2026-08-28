# 21 — the vocabulary census: reader protocol

You are one reader in a parallel census of the Guild's working vocabulary — every noun,
verb, phrase, token, and notation its documents use as terms of art. The census collects
evidence; it defines nothing and standardizes nothing. Felix chooses the standard later,
from what we collect. Your whole job: read your territory completely, miss nothing,
invent nothing, quote exactly.

## What counts as a term of art

The blink test: would a competent engineer who has never seen these repos blink at the
word *as used in that sentence*? If yes, collect it. Invented words, repurposed English,
artifact names, status tokens, metaphor terms, ritual phrases — all of it.

The `kind` field:

- `thing` — nouns: artifacts, roles, places, offices (mantle, board, keel, glass, comb)
- `action` — verbs (cut, fire, land, bless, true, fold, sweep, drain, molt, waggle)
- `state` — status/record tokens and markers (LANDED, PARKED, unrecorded, `✓ Felix`)
- `formula` — fixed phrases, incantations, mottos, grammar lines ("files carry the
  truth", "keep the joy", "You are a <Mantle> at <tier>", "waggle me X", "lay the keel",
  "tracked, not lost")
- `notation` — typography carrying meaning (`·` in ledger heads, `→`, `×3`, `§`,
  `⟨slots⟩`, strikethrough-as-retirement, bold-at-minting, the `——` separators)

When one lemma is both noun and verb (a harvest / to harvest; a cut / to cut), record
separate observations — same `term`, different `kind`.

## The seed list — known core, already glossed; do NOT re-collect in these senses

OPEN · IN FLIGHT · LANDED · KILLED · BLOCKED (board lifecycle) — PENDING · PARKED
(OPEN-annotations) — PASSED · MERGED · BLESSED (verdict annotations) — unrecorded
(typed absence: ignorance) · unstaffed (typed absence: knowledge) — Felix-gate (a gate
that is really Felix's) — bless (approve a spec for construction) · ratify (make a
choice a D-entry) · countersign (Felix confirms a proposed D-entry) — mint (bring a
canonical artifact into existence) · park (set aside, tracked not lost) · true (bring a
record back to match reality) · fold (distill findings into durable docs) · strike
(visibly retire superseded text) · pre-chew (decide forks in the work doc ahead of the
session) · drain (empty an inbox after ruling) · harvest (promote a proven pattern into
canon) · molt (migrate form freely while meaning appends) — dispatch · tend · relay ·
escalate (Dispatcher verbs) — kickoff (the fenced summons in a work doc) · summons (the
invocation text) · wear (put on a mantle) · baton (the end-of-session handoff) — mantle
(role charter) · tier (model×effort preset) · board (the work-state table) · row (one
dispatchable unit) · batch (rows cut to run together) · brief (Digger work doc) · order
(Builder work doc) · work doc · findings (the evidence record) · ledger (session log) ·
D-entry (a ratified decision) · inbox (ISSUES.md) · master doc · dream (origin dump,
immutable) · keel (founding plan; "lay the keel" = found a campaign) · rider (dispatch
appendix) · bulletin (the wire between parallel agents) · lab (disposable code by row)
— hive (an account) · bee (a session) · comb (account memory) · city (the repos) ·
silo (account isolation) · stigmergy · sovereign (Felix) · the Guild · waggle (the
four-line decision-density signal) · glass (Belvedere) · deck (its card surface)

Collect a seed term ONLY when: (a) the text uses it in a sense the gloss above does not
cover, or (b) the text defines, renames, disputes, or coins it at that spot — a
**minting site**. Counting is mechanical and happens later; you are not a counter.

## The sense-hunt list — collect EVERY distinct sense you meet, one observation per sense per file

session · window · sitting · seat · office · cut · fire · arm · pass · card · flow ·
verdict · close / closed · land / landed / landing · wave · register · gate · sweep ·
stamp · theater · holder / hold · work

These are known or suspected polysemes. One observation per DISTINCT SENSE per file —
not per occurrence. The quote must be the sentence that shows the sense.

## Output — JSONL, one object per line, to your obs file

Term observation:

```json
{"term":"sitting","kind":"thing","forms":["sitting","sittings"],"file":"/abs/path.md","line":619,"quote":"VERBATIM sentence or fragment from the file","gloss":"what concept it points at RIGHT THERE, one line","flags":["sense-hunt"]}
```

- `gloss` names the CONCEPT the word points at in that sentence — the referent, not a
  dictionary definition. "the formal work meeting of a Grand Architect with Felix", not
  "a period of sitting". The census is concepts-driven; your gloss is the concept lead.
- `flags`, all optional: `"sense-hunt"` · `"minting-site"` (the text coins/defines/
  renames it there) · `"collision:<other-term>"` (you suspect synonym or homonym) ·
  `"felix-coined"` / `"agent-coined"` (ONLY when the text itself attributes the coinage
  — never guess) · `"lore"` (poetic register, not operational) · `"dialect"` (usage that
  looks local to this building, not canon-wide) · `"retired"` (the text itself marks it
  superseded)
- `line` is the line number of the quote. For the commit-log territory, use the line
  number in the log file and put the short hash in the quote.

Coverage line — one per assigned file, ALWAYS, even when nothing was collected:

```json
{"coverage":"/abs/path.md","observations":12,"note":"optional — e.g. 'out-of-register: product manual, skimmed for Guild terms only'"}
```

## Laws

1. **Verbatim quotes.** A paraphrase is a defect (bulletin law). Copy the sentence.
2. **Over-collect.** A term wrongly included costs a merge glance; one wrongly skipped
   is invisible forever. When in doubt: collect.
3. **Never editorialize.** No "this word is better", no proposals, no standardizing.
   Evidence only.
4. **Stay home.** Read only your territory; write only your obs file. No commits.
5. A file that turns out to be non-Guild content (product docs, vendor README): skim it
   for Guild terms anyway (session-written product docs still say "landed", "blessed"),
   write the coverage line with an `out-of-register` note, move on.
6. Every line must be valid JSON (escape internal quotes). One object per line, no
   trailing commas, no wrapping array.

## Your report — your final reply, exactly this shape, nothing more

```
files: N/N read (out-of-register: n)
observations: N (sense-hunt: n · formulas: n · notations: n · minting-sites: n)
striking: <find 1, one line>
striking: <find 2, one line>
striking: <find 3, one line>
obs: /Users/felix/code/agents/lab/21/obs/<id>.jsonl
```

Striking = the finds the Grand Architect should not miss in the merge: a collision, a
building-local dialect, a term used against its canon meaning, a minting site.
