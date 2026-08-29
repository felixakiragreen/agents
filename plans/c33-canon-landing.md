# C33 — the canon landing

**Status:** LANDED 2026-08-29 · **Depends on:** C28 · **Staffing:** Builder · opus-medium

## Goal

The C28-blessed roster lands in `canon/`: the door and six charters, the two
shims, the README reconciled, the templates updated. Every text is blessed
(D76) and frozen in `lab/c28/` — this charge is transcription and wiring,
not drafting. **Not one word of a blessed text changes in transit.**

## The spec (blessed 2026-08-29, D76 — the sources are law)

Each lab file carries a delta-note header above a `---` separator; **what
lands is everything below the separator, verbatim.**

1. `lab/c28/door-v8.md` → `canon/GUILD.md` — **amended 2026-08-29 at the
   Builder's escalation (GA ruling; both sub-forks were spec defects, not
   blessed content):** exactly two sections land — the door proper
   (`# The Guild`, body byte-identical) and the stanza, its heading
   stripped of the lab parenthetical to bare `## The dispatched stanza`
   (the parenthetical was transit metadata — self-referential inside
   GUILD.md, citing a lab file no canon reader sees; the body lands
   byte-identical). The trailing section (`## The side-quest grant — …
   drafting input for the redrafts`) **drops**: it is the lab-scaffolding
   slot every door draft carried (v6/v7: the delta lists), already
   consumed by the six charters' own Side-quests sections — the original
   drop-clause named the slot by a stale name.
2. `lab/c28/digger-v4.md` → `canon/mantles/digger.md` (overwrites).
3. `lab/c28/architect-v6.md` → `canon/mantles/architect.md` (overwrites).
4. `lab/c28/builder-v2.md` → `canon/mantles/builder.md` (overwrites).
5. `lab/c28/mentat-v2.md` → `canon/mantles/mentat.md` (overwrites).
6. `lab/c28/grand-architect-v3.md` → `canon/mantles/grand-architect.md`
   (overwrites).
7. `lab/c28/fixer-v1.md` → `canon/mantles/fixer.md` (new — the minting).
8. Shims: `canon/skills/fixer/SKILL.md` and `canon/skills/mentat/SKILL.md`,
   minted on the existing shims' exact pattern (read a sibling first —
   `canon/skills/digger/SKILL.md`): point at the charter path, inject
   `${CLAUDE_EFFORT}`, set `disable-model-invocation: true`. The skills
   set is live ×3 — this is a deploy, signed by D76.
9. `canon/mantles/README.md`, three sections only:
   - **The roster**: Fixer gains its charter file (the "no charter file"
     clause dies); offices titled as offices.
   - **Summons grammar**: the interactive form gains the door —
     `Enter by the door — read ~/code/agents/canon/GUILD.md, wear <charter>,
     then …`; the dispatched note: unmantled cheap-tier kickoffs carry the
     stanza inline from GUILD.md's closing section; mantled dispatched
     kickoffs carry the door read in path form.
   - **The charter template**: replace the old order with the C28 pattern —
     mission paragraph · **Staffing** · **The summons** (the shared
     paragraph, byte-identical across charters — a lint surface) · the
     role's own law sections · Side-quests (where granted) · escalation /
     the contract's edges · End of session · **Forbidden** (minimal, every
     seat with its reason) · Summons (with the door). No epigraph.
10. `canon/work/DOCTRINE.md` §12 founding kickoff: gains the door clause
    (the one fenced summons in that section).
11. `MAP.md` §3 roster note: the Fixer line's "no charter file" phrasing
    updated — charter minted at C28.

## Done when:

- ✅ **The eight canon files present, each byte-identical to its lab source
  below the separator** — GUILD.md's narrower bar per amended item 1.

  Six charters, `diff` of `tail -n +<sep+1> <lab>` against the landed file:

  ```
  IDENTICAL  lab/c28/digger-v4.md (below sep line 13)          ==  canon/mantles/digger.md           e4e80d3c1acbdb9c
  IDENTICAL  lab/c28/architect-v6.md (below sep line 25)       ==  canon/mantles/architect.md        d777fd5bd70d4ac5
  IDENTICAL  lab/c28/builder-v2.md (below sep line 16)         ==  canon/mantles/builder.md          1e075f52ca454613
  IDENTICAL  lab/c28/mentat-v2.md (below sep line 12)          ==  canon/mantles/mentat.md           bf9a0ea0c146cc33
  IDENTICAL  lab/c28/grand-architect-v3.md (below sep line 15) ==  canon/mantles/grand-architect.md  a68d94cd23791ea9
  IDENTICAL  lab/c28/fixer-v1.md (below sep line 12)           ==  canon/mantles/fixer.md            780191d93a1978db
  ```

  `canon/GUILD.md`, the three-part bar:

  ```
  === (a) door body: lab lines 13-64  vs  GUILD.md lines 1-52
  IDENTICAL (52 lines, sha 1e9fa3a5e904920b)

  === (b) stanza body: lab lines 68-75  vs  GUILD.md lines 56-63
  IDENTICAL (8 lines, sha dd0f817b619e6690)

  === (c) stanza heading bare
  lab   : ## The dispatched stanza (unchanged from v6 — GUILD.md's closing section)
  canon : ## The dispatched stanza

  === (d) scaffolding absent
  0 hits — absent

  === (e) whole-file diff, lab-below-separator vs landed
  55c55
  < ## The dispatched stanza (unchanged from v6 — GUILD.md's closing section)
  ---
  > ## The dispatched stanza
  64,83d63
  < [the 20 lines of "## The side-quest grant — … drafting input for the redrafts"]
  ```

  The only two deltas are the two the amendment authorized; nothing else moved.

  The two shims, proven pattern-identical to their sibling modulo the name:

  ```
  $ diff <(sed 's/mentat/digger/g; s/Mentat office/Digger mantle/g' mentat/SKILL.md) digger/SKILL.md
  MENTAT: pattern-identical to digger modulo name
  $ diff <(sed 's/fixer/digger/g; s/Fixer/Digger/g' fixer/SKILL.md) digger/SKILL.md
  FIXER: pattern-identical to digger modulo name
  ```

- ✅ **`doctrine lint ~/code/agents` → 0.**

  ```
   ok   agents  —  3 board(s) · 44/44 rows typed · ledger 2026-08-29 · baton session ×1 · 43 kickoff(s) · queue 4
   ok   agents/belvedere  —  1 board(s) · 39/39 rows typed · ledger 2026-08-29 · baton felix · 38 kickoff(s) · queue 0
  === TOTALS
    2 buildings · 4/4 board docs yielded a board · 4 boards · 83 rows · 83 fully typed (100%)
    0 failure(s) in 0 class(es)
  ```

  Reached only after F1's side-fix (below), which Felix granted in the room.

- ✅ **`sync/check` run — the new shims are live ×3, no deploy owed.** `skills`
  is a *directory* symlink in all three config dirs, so a new subdirectory is
  live at the write; D14's Felix-run step does not arise.

  ```
  $ ./sync/check
  /Users/felix/.claude               skills  ok  → canon/skills
  /Users/felix/.claude-thg-fgreen    skills  ok  → canon/skills
  /Users/felix/.claude-thg-doorbell  skills  ok  → canon/skills
  green — 3×3 links, all pointing at canon.

  $ for d in ~/.claude ~/.claude-thg-fgreen ~/.claude-thg-doorbell; do …
  /Users/felix/.claude               mentat/SKILL.md LIVE (3edb1a79b534)   fixer/SKILL.md LIVE (aa3dda374197)
  /Users/felix/.claude-thg-fgreen    mentat/SKILL.md LIVE (3edb1a79b534)   fixer/SKILL.md LIVE (aa3dda374197)
  /Users/felix/.claude-thg-doorbell  mentat/SKILL.md LIVE (3edb1a79b534)   fixer/SKILL.md LIVE (aa3dda374197)
  ```

- ✅ **README's three sections and DOCTRINE §12 updated; nothing else in either
  file touched** — plus the null-mantle section's dying clause (F2, ruled by
  item 9's own words). `git diff` reviewed hunk by hunk: README changed in four
  regions, DOCTRINE in one (the fenced kickoff, +1 line).

- ✅ **Board reconciled** — this row LANDED with evidence; C28's `holds: C33`
  cleared.

## Out of scope

Any wording change to any blessed text. The purge (C34). The old lab
files (they stay — provenance). Belvedere. The outer city.

## Findings

**F1 — C28's Depends-on cell carried a comma the D63e parser splits on.**
`doctrine lint ~/code/agents` was **1 FAIL on a clean tree before this charge
touched anything**: `MAP.md:127`, class `board.depends`, segment
`"his notes at the desk"`. Cause: `doctrine/src/parse.ts:132` splits Depends-on
on `·` `,` `;`, so C28's gate text `⬡-gate: … paid 2026-08-29, his notes at the
desk` yielded a third segment that is neither a charge id nor a gate. Escalated
(the bar was unreachable inside the fence); **Felix granted the fix in the
room**. Form-only, no meaning change: the comma became parens. Rides its own
commit, `f1c8615`. Lint 1 → 0. The class is general — any `⬡-gate:` annotation
containing a comma or a `·` is silently mis-parsed, and the board looks fine to
a human reader. Worth a lint-side ruling: either the gate form forbids those
characters, or the parser stops splitting inside a gate segment.

**F2 — item 9's "no charter file" clause did not live in the roster.** The spec
put it under **The roster**; the live text was in the *next* section,
`## The null mantle — the Fixer`, lines 73–74: *"The Fixer has no charter file:
the name is the minting…"*. Left standing it would have been a canon file
asserting the non-existence of a canon file that this same charge created, so I
killed it where it lived and pointed the sentence at `fixer.md`. This is a
fourth section touched against a "three sections only" fence — flagged, not
hidden. Same penholder pattern as item 11: MAP §3's Fixer line also contains no
"no charter file" phrasing, so that item was executed as its evident intent
(the row now names the C28 minting).

**F3 — the shared summons paragraph is word-identical, not byte-identical.**
Item 9 called it "byte-identical across charters — a lint surface." Measured, it
is three families:

```
architect  28092dc56168 ┐ word-stream identical
digger     28092dc56168 ┘   (byte hashes differ: 23922e35624e both — identical)
mentat     816cf252d893 ┐ core only, no charge-doc sentence
grand-arch 816cf252d893 ┘
builder    b2cdb8f367fc   core + charge-doc + the precedence-bites extension
fixer      —              no summons paragraph; **The license** stands in its place
```

The **core** ("worn by explicit summons only … always apply.") is word-for-word
in all five that have one — but the *line wrapping* differs between the
mantle family and the office family, so a byte-level lint written off item 9's
phrasing would red on day one. The README template section is written to what is
true (word-level), and says so. **A ruling is owed:** normalize the wrap and get
the cheap byte lint, or keep the wrap and write the lint word-level. Not fixed
here — that is a wording change to blessed text.

**F4 — `## The precedence law` is now stale, and I left it.** README lines
~121–137 still open *"Canonical clause, carried verbatim by every charter:"* and
quote a `**Precedence:**` block. No C28 charter carries that clause any more —
it was folded into `**The summons:**` (a fact the section immediately below it
now describes correctly). Untouched: unlike F2, item 9 gave no ruling here and
the Done-when fences the file to three sections. Next canon sweep should fold or
retire it. Related residue in the same class: `canon/skills/grand-architect/SKILL.md`
still says *"Wear the Grand Architect **mantle**"* for what D71 and the landed
charter both call an office — the new `mentat` shim says "office", so the two
now disagree. Both are C34-adjacent.

---

```
You are a Builder at opus-medium.
Enter by the door — read ~/code/agents/lab/c28/door-v8.md (the door is not
landed yet; you are landing it — enter by its lab path this once),
wear ~/code/agents/canon/mantles/builder.md,
then read plans/c33-canon-landing.md and build it to its bar.
```
