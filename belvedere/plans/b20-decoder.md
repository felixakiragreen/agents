# B20 — the decoder

**Status:** **LANDED** 2026-08-27 · **Depends on:** B18 · **Staffing:** Builder · opus-high · **Blessed:** the deck keel as amended 2026-08-27 (the mid-batch-5 block), on Felix's field note (ISSUES this date, ruled same sitting).

## Goal

No code word without its meaning one hover away. Every reference the deck renders — row ids (`B18`, `P5`, `G2`), decision ids (`D2`, `D63`), section refs (`§5`, `§3.2`), `FC-`/`GA-` ids — resolves on hover into its object: encapsulation, status, one jump. Tooltips **nest**: a tooltip's own content passes through the same detector, depth-capped. Felix stops needing the Architect's glossary in his head.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §3's amended block (the commission, verbatim).
- B13's tooltip primitive (instant, expandable — the decoder rides it, never a second primitive); the deck's shared render pass (every tenant's text flows through it — find the one seam, `html.ts`'s heirs).
- `doctrine/` parse (D65 — rows and decisions come from the one parser, never a second grammar); B9 F1 / the row-17 name-field ask — tooltip headlines are encapsulations, derived where unwritten (B9's two render rules port).
- D10's family: resolution never guesses.

## Spec

1. **The detector.** One pass over rendered text (server- or client-side — wherever the deck's render seam is; one place, not per-tenant): `\b[PBG]\d+\b` (row ids), `\bD\d+\b`, `§\d+(\.\d+)?`, `\bFC-\d+\b`, `\bGA-\d+\b`, and **the row-keyword form** `\b(?:(canon|<building>)\s+)?row \d+\b` — "canon row 17", "bob row 3", bare "row 14" — because the canon board's row ids are bare numerals and only the keyword anchors them. All wrapped as decoder spans. Code blocks and fenced kickoffs are exempt (a summons stays byte-sacred). **The corpus is every prose surface the deck renders — the Chat's transcripts included (Felix's ask, verbatim: "I want to hover over YOUR words [canon row 17] and see a tooltip for it")** — the seam sits upstream of tenants, so B16 inherits by construction.
2. **The resolver — context-scoped, local first.** A reference resolves against its **containing document's building** first (a `D2` in a belvedere doc is belvedere's D2), then the canon repo (a `D63` anywhere resolves to canon's — belvedere's decisions stop at D18 today, and the resolver *knows ranges*, it never string-matches blindly); `§` against the containing doc's headings, or the explicitly linked doc when the ref sits inside a link's text. Ambiguous (two candidates, no context) or absent → the tooltip says **unresolved**, names the candidates, guesses nothing.
3. **The tooltip content.** Headline: the object's encapsulation (row title / decision title / section heading). Body: status + one-line annotation head (rows), the entry's first sentence (decisions), the section's first lines (§). Footer: **jump** — row → its Workshop board row / plan doc; decision → the entry in the Workshop queue panel; § → the doc viewer at the heading (B15's anchors) — **and the object's live gestures, where it carries any from the queue's own set** (Felix's ask: "potentially it even has an action"): a pending-countersign decision carries the countersign gesture, any object carries the note gesture — B6's wire, previewed bytes before the append (the countersign law). **Gestures only, never fires**: tooltips gesture, the composer and the Works fire (D10's discipline); the gesture verb follows canon's vocabulary until the Office rules the bless/countersign ask (canon inbox, 2026-08-27).
4. **Nesting.** Tooltip bodies pass through the detector too; **depth cap 3**, and a cycle (D2 → §7 → D2) renders the repeat as plain text — the cap and the cycle guard are tested, not hoped.
5. **Everywhere.** All tenants inherit by construction (the one render seam); the DoD samples City, Workshop, and the drawer queue.

## Acceptance criteria — the DoD

Two runs carry the evidence: [`lab/b20/probe.ts`](../lab/b20/probe.ts) — thirteen checks in real headless Chrome (B13's harness, zero dependencies) against a **copy** of [`lab/b20/city`](../lab/b20/city) and a temp census — and [`lab/b20/live.ts`](../lab/b20/live.ts), six checks over the **real** city, reads only, nothing written anywhere. Both **ALL GREEN**.

- [x] **Hover `B18` in a rendered board → its encapsulation, status head, jump to its plan.** Fixture, driven through the page's own listeners:
  ```
  tooltip line "B18 Live identity" · status "LANDED · Builder · opus-high · …/nb/shop"
  body "the venue ruling is D2 and the storage question is canon row 17; D99 is nobody's…"
  actions [open nb/shop/README.md:21 | the plan]
  ```
  And on the **live** corpus, off the wire: `B18 → Live identity · LANDED · Builder · opus-high · agents/belvedere · agents/belvedere/README.md:209`
- [x] **Nest: depth 2 measured, depth cap 3 asserted, a cycle plain at the repeat.**
  ```
  layer 1 (from B18's record): "D2 Venue" · 2026-08-26 · Architect (01) · pending
  layer 2 (from D2's body):    "§5 The cycle" · nb/shop/DECISIONS.md:6
  3 tooltip boxes open; layer 2's own body carries 0 decoder spans
  ```
  The cap is enforced where the spans are **made** (`words()` draws none at depth 3), so there is no fourth layer to refuse. The cycle: D2's body says *"the ruling B18 landed under"* — the text is present (`b18InBody: true`) and the decoder spans in that tooltip are `[§5]` only, B18 absent.
- [x] **Context scope: local `D2`, canon `D63`, out-of-range `D99` unresolved with candidates.** Live corpus, where belvedere really does stop at D18:
  ```
  D2  → Venue · 2026-08-26 · Felix · pending · agents/belvedere · agents/belvedere/README.md:459
  D63 → The schema fold · … · folded · agents · agents/DECISIONS.md:727
  D99 → UNRESOLVED: no D99 in scope — the resolver read every decision in these files
        [agents/belvedere — D1–D18 | agents — D1–D67]
  ```
- [x] **`§5` resolves to that doc's §5 and jumps line-anchored.** Hovered the `§5` written in a board annotation → `§5 Working agreements · nb/shop/README.md:13`; the jump opened the viewer with **exactly 1 line marked, line 13: `## 5. Working agreements`**. The same building's `DECISIONS.md` has a §5 of its own called *The cycle*, resolved from the other side in the nesting check — **scope decided which, not proximity**. Live: `§5` in belvedere's README is *Working agreements*, `§3` in the deck keel is *The ontology and the panes*.
- [x] **The commissioning hover.** Felix's own phrase rendered in a fixture inbox entry — *"I want to hover over YOUR words — canon row 17 — and see a tooltip for it"*: `"row 17" → the storage experiment · OPEN · Digger · fable-high`. Live, against the real canon board: `row 17 → v3 · the storage experiment · OPEN · Digger · fable-high · agents/MAP.md:106`. Bare `row 14` in a canon document resolves locally (`summon rig · OPEN · Builder · opus-high · agents/MAP.md:103`) — the fixture writes *"narrower than row 14"*, and `than` names no building, so the local board answers. Live also shows the fallback and its fence: a bare `row 14` in a belvedere doc reaches canon's row 14, while `belvedere row 14` is `UNRESOLVED: no row 14 on agents/belvedere's boards` — an explicit scope never falls back.
- [x] **The countersign gesture, previewed and fired, on a fixture inbox.**
  ```
  tooltip preview:  "- 2026-08-27 · Felix (via Belvedere) · countersign D2: ✓"
  receipt:          filed · - 2026-08-27 · Felix (via Belvedere) · countersign D2: ✓
  inbox diff (471 B → 534 B, append-only: true):
  + ---
  + - 2026-08-27 · Felix (via Belvedere) · countersign D2: ✓
  fire wiring anywhere in that tooltip: 0
  ```
  Two gestures on that card (countersign + note), the previewed bytes byte-identical to the appended line, and the file strictly append-only. **The live city's pending countersigns were never touched** — proving a button by filing a real countersign would be the glass editing truth to test itself.
- [x] **Fenced kickoffs and code blocks carry zero decoder spans.** Fixture: 1 fenced kickoff rendered, its text carrying `B20`, `§5` and `D63` — `decoder spans inside them: 0 · inside 3 code ticks: 0`, against 15 decoder spans elsewhere in the same pane. Live: the belvedere Workshop draws **164** decoder spans and **0** inside kickoffs or code ticks.
- [x] **Three surfaces decode off one seam; zero new deps; suite green; type gate 0.** `drawer queue: 9 decoder spans, 4 of them in item names [G2, G2, D2, B18]` · `City tooltip: … decodes [G2, G2, D2, B18]` · `Workshop pane: 16 decoder spans`. **425 tests green in one process** (`bun test belvedere/glass`), `bunx --offline tsc --noEmit` **exit 0**, zero dependencies added — `bun.lock` untouched, and `/deck.js` still loads nothing off this origin.
- [x] **Zero fire wiring, three ways.** `DOM: 0 of [data-fire, data-apply, data-worktree, data-summons]; "hands/fire" 0× in the document · glass/decode.ts: 0 · glass/decoder.ts: 0 · glass/deck-dom.ts: 0 · /deck.js is 53 461 B and carries it 0×.`
- [x] **Nothing predecessors relied on moved.** B13's, B14's and B15's probes re-run whole against this client: **ALL GREEN, three for three** (12 + 8 + 12 checks). B18's probe drives Felix's real desktop, so its one intersection with this row — the rename/recolor controls that live inside the tooltip the decoder turned into a stack — is checked here instead, without touching cmux: a session's expanded tooltip still carries **1 rename input and 7 swatches**.
- [x] **The cost.** A cold `/deck/decode` is **2–5 ms**, the next 1.7 ms, and 11 requests covered a whole probe session (one per distinct word, then cached client-side). `/deck/state?b=agents/belvedere` over the live register: **p50 75 ms · max 83 ms** for **134 189 B** — the decoder adds none of it, because resolution happens on hover and nothing else.

## Out of scope

- Editing anything; a search index (B21's Grep is its own row); decoding inside v0's dying pages; new reference grammars (a new id class is a canon question, not a regex).

## Findings

**Nothing escalated.** No contract moved: `/deck/state` keeps B18's shape, the `FocusView` seam keeps its five members, and the fence gains no write class — the tooltip's gestures are B6's existing `POST /inbox`, in front of the credential gate.

**F1 — `FC-n` and `GA-n` are ids the corpus writes and the doctrine gives them no artifact, so the decoder detects them and honestly refuses to resolve them. Fifth filing of the same *field* ask.** The one parser keeps board rows, ledger entries, decisions, issues and kickoffs; an `FC-1` lives in the prose of `plans/p3-parse-coverage.md` and a `GA-10` in a status annotation, and neither is anything a parser hands over. The tooltip says exactly that — *"a fold candidate is prose, not a parsed artifact — the doctrine carries no field for it, so nothing can resolve it without guessing"* — and names what the parser does keep. **Finding a definition by grep would be a new reference grammar**, which the order puts out of scope and which is a canon question anyway (B20 §out-of-scope). The live corpus renders them: `FC-1`, `FC-7`, `FC-9` are all in belvedere's own board, three of the 164 decoder spans in that pane, and all three say the same honest thing. Same ask as B3 F4/F5 (`Baton.kind`, a branch field), B9 F1 (a name field), B14 F2 (an escalation field), B15 F1 (an effort field).

**F2 — half the corpus's landing records encapsulate to a DATE, and anything using `encap()` on an annotation inherits it.** A status cell reads `LANDED 2026-08-27 — cmux is truth; nothing escalated…`, and `encap()`'s first seam is the spaced dash, so the derived name is **`2026-08-27`**: a true name by B9 F1's rule and a useless one. Measured while building the tooltip body — the first implementation showed `body: "2026-08-27"` for B18 on the live board — and fixed by not using the derivation there: the tooltip carries `clip(annotation)`, the record's own head, capped at 320 characters. **The rule generalizes: `encap()` derives a name from a work cell (`B8: glass hardenings`, `Live identity — cmux is truth`) and should not be pointed at an annotation**, whose grammar leads with a date. It is also a second lint signal in B9 F1's neighbourhood — wherever a derived name is a bare date, the text had no name to give.

**F3 — the tooltip primitive had to become a stack, and the depth cap belongs where the spans are MADE, not where they are hovered.** B13 shipped one `#tip` element and one `tipHost`; nesting needs N boxes, so `layers[]` holds them (layer 0 is the shell's own `#tip`, deeper layers are minted and dropped with the chain) and `layerFor(anchor)` decides which layer a hover opens. The cheap implementation — refuse to open a fourth tooltip on hover — would leave the fourth layer's controls *drawn and dead*. Instead `words()` draws no decoder span at all once `ctx.depth >= 3`, so the deepest tooltip's body is plain text and there is nothing to refuse: measured, `layer 2's own body carries 0 decoder spans`. **For B16 and B21:** any content you render inside a tooltip flows through the same `DecodeCtx`, and the two things it carries are the document to resolve against and the chain of words already open — pass `{...ctx, in: <this object's own doc>}` when you render a resolved object's body, or a nested `§7` resolves against the wrong file (measured: it did, and the probe caught it).

**F4 — `Building.decisionQueue` is the QUEUE, not the decisions, and a decoder built on it resolves almost nothing.** `assemble()` and `register.ts` `content()` both keep `parseDecisions(...).queue` — the entries still waiting on a pen — so canon's D63, ratified three weeks ago, is simply absent from the parsed building. The resolver therefore re-parses `files.decisions` for the whole list (same parser, D65 intact) and pays one file read per lookup, which is free on a hover. **Anyone resolving a D-id off `Building` will silently find only unratified decisions** — and since the tooltip's honest answer for a miss is *"unresolved"*, the failure would have looked like a corpus problem rather than a shape problem.

**F5 — the Context pane rendered no corpus prose at all, so "the City decodes" was a claim with nothing behind it.** Every string the City drew was the glass's own (`22 buildings · register 3m old`, the legend, the badge words); the only corpus text anywhere near it was a building's *name*. Rather than fake the sample, the building row's tooltip now names **what** wants him instead of counting it — `B20 — The decoder · D2 — Venue · G2 — The gate` in place of `2 gate, 1 countersign` — which is the encapsulation law applied to a badge, is strictly more informative, and is corpus prose, so it decodes by construction (measured: `City tooltip … decodes [G2, G2, D2, B18]`). The badge still carries the count.

**F6 — a click on a code word is captured and stopped, so a `.dw` inside a rendered `path:line` reference decodes rather than opening the document.** The tooltip layers live outside `#app`, so the shell's delegated click handler never sees them; the decoder's expand-on-click is a capture-phase listener on `document`. That has two deliberate consequences: a click on a code word inside a City row does **not** select the building, and a click on the word inside a `button.ref` label expands the decoder instead of opening the file — the word is the target Felix aimed at, and the rest of the button still opens the document. **For B21:** a grep hit rendered as prose will behave the same way, so put the jump on the row and not on the word.

**F7 — the decoder is the first thing in the glass that has to know which building is canon, and it knows by convention.** `canonRoot()` is `<city>/agents` (`paths.ts`), relative to the city so a fixture can carry a canon of its own, and `canon` is a literal keyword in the reference grammar the order blessed. It is true today and it is not a *fact the register carries*: the register discovers buildings, and nothing in a `Building` says "this one is the canon". If the city ever moves or renames the canon repo, this line is what breaks — named here rather than hidden, and a candidate for a register field the day the Office wants one.

**Not blocking, for the Architect:** the poll is untouched. Resolution is lazy, client-cached and carried on its own route, so `/deck/state` is byte-for-byte the shape B18 left it — B18 F4's ~266 ms of headroom is still there for B17's live usage, and the decoder spends none of it.

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
