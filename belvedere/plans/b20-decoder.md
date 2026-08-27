# B20 — the decoder

**Status:** OPEN · **Depends on:** B18 · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel as amended 2026-08-27 (the mid-batch-5 block), on
Felix's field note (ISSUES this date, ruled same sitting).

## Goal

No code word without its meaning one hover away. Every reference the deck
renders — row ids (`B18`, `P5`, `G2`), decision ids (`D2`, `D63`), section
refs (`§5`, `§3.2`), `FC-`/`GA-` ids — resolves on hover into its object:
encapsulation, status, one jump. Tooltips **nest**: a tooltip's own content
passes through the same detector, depth-capped. Felix stops needing the
Architect's glossary in his head.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §3's amended block (the commission, verbatim).
- B13's tooltip primitive (instant, expandable — the decoder rides it, never
  a second primitive); the deck's shared render pass (every tenant's text
  flows through it — find the one seam, `html.ts`'s heirs).
- `doctrine/` parse (D65 — rows and decisions come from the one parser,
  never a second grammar); B9 F1 / the row-17 name-field ask — tooltip
  headlines are encapsulations, derived where unwritten (B9's two render
  rules port).
- D10's family: resolution never guesses.

## Spec

1. **The detector.** One pass over rendered text (server- or client-side —
   wherever the deck's render seam is; one place, not per-tenant):
   `\b[PBG]\d+\b` (row ids), `\bD\d+\b`, `§\d+(\.\d+)?`, `\bFC-\d+\b`,
   `\bGA-\d+\b` — wrapped as decoder spans. Code blocks and fenced kickoffs
   are exempt (a summons stays byte-sacred).
2. **The resolver — context-scoped, local first.** A reference resolves
   against its **containing document's building** first (a `D2` in a
   belvedere doc is belvedere's D2), then the canon repo (a `D63` anywhere
   resolves to canon's — belvedere's decisions stop at D18 today, and the
   resolver *knows ranges*, it never string-matches blindly); `§` against
   the containing doc's headings, or the explicitly linked doc when the ref
   sits inside a link's text. Ambiguous (two candidates, no context) or
   absent → the tooltip says **unresolved**, names the candidates, guesses
   nothing.
3. **The tooltip content.** Headline: the object's encapsulation (row title
   / decision title / section heading). Body: status + one-line annotation
   head (rows), the entry's first sentence (decisions), the section's first
   lines (§). Footer: **jump** — row → its Workshop board row / plan doc;
   decision → the entry in the Workshop queue panel; § → the doc viewer at
   the heading (B15's anchors).
4. **Nesting.** Tooltip bodies pass through the detector too; **depth cap
   3**, and a cycle (D2 → §7 → D2) renders the repeat as plain text — the
   cap and the cycle guard are tested, not hoped.
5. **Everywhere.** All tenants inherit by construction (the one render
   seam); the DoD samples City, Workshop, and the drawer queue.

## Acceptance criteria — the DoD

- [ ] Hover `B18` in belvedere's rendered board → tooltip: its
  encapsulation, status head, jump to its plan doc (DOM evidence).
- [ ] Nest: a tooltip whose body cites a `D`-id shows the nested tooltip on
  hover (depth 2 measured); depth cap at 3 asserted; a constructed cycle
  renders plain at the repeat.
- [ ] Context scope: `D2` inside a belvedere doc resolves to belvedere's
  D2; `D63` resolves to canon's; a deliberately out-of-range id (`D99` in
  belvedere) renders **unresolved** with candidates named.
- [ ] `§5` inside a doc resolves to that doc's §5 and jumps line-anchored.
- [ ] Fenced kickoffs and code blocks carry zero decoder spans (structural
  grep).
- [ ] Three tenants sampled (City, Workshop, queue) all decode; zero new
  deps; suite green one process; `bunx --offline tsc --noEmit` exit 0.

## Out of scope

- Editing anything; a search index (B21's Grep is its own row); decoding
  inside v0's dying pages; new reference grammars (a new id class is a
  canon question, not a regex).

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b20-decoder.md,
and build it to its DoD.
```
