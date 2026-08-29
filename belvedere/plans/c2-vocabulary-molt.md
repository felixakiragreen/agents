# C2 — the vocabulary molt

**Status:** OPEN — laid 2026-08-29 · **Depends on:** C1 · **Staffing:** Builder · opus-high

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

*(append here)*

---

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the charge at ~/code/agents/belvedere/plans/c2-vocabulary-molt.md —
the deck speaks the standard.
```
