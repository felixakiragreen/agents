# doctrine — the Standards Office's reference reader

One parser in the city. The Office owns the format, so it owns the reader: two readers of one format WILL drift. Belvedere imports this library; nothing re-implements it.

Tooling, not canon-law — a peer of [`sync/`](../sync). The law it reads lives in [`canon/work/DOCTRINE.md`](../canon/work/DOCTRINE.md) §§3, 4, 5, 7, 8, 11, as amended by **D63** (the schema distillation), **D64** (the baton grammar) and **D71** — the Guild's standard, [`canon/work/STANDARD.md`](../canon/work/STANDARD.md). The parsed shapes are P3 §5's, normative per D65 ([belvedere/plans/p3-parse-coverage.md](../belvedere/plans/p3-parse-coverage.md)).

```
bun doctrine/cli.ts boot <building>        # the boot pack — a cold session's orient (044)
bun doctrine/cli.ts lint [--live] [--vocab] [--verbose] [--json] <path…>
bun doctrine/cli.ts statement [--json] <path…>   # every ⬡ go on a live surface (D82)
bun doctrine/cli.ts parse --json <building>
bun doctrine/cli.ts buildings [--json]     # the building register, walked
bun doctrine/cli.ts migrate [--write] [--summary] <building>
bun doctrine/cli.ts citations [--write] <building>   # citations of killed D-ids (043)
bun doctrine/cli.ts prune [--write] <root>           # the ledger's aging (048)
bun test                                   # from doctrine/ — the §6.2 control + the round-trip law
```

## The library

```ts
import { parse, lint, migrate } from './doctrine';

const b = parse('~/code/agents/belvedere');   // → Building: board[] · ledgerTail · baton
                                              //   · decisionQueue · issues · kickoffs
                                              //   · credits · fails
```

`src/grammar.ts` names every mantle, tier, state, verdict and dead word **once** · `src/parse.ts` the five artifact parsers · `src/building.ts` discovery + `parse()` · `src/register.ts` the building register · `src/lint.ts` the walk and the report · `src/credit.ts` the statement (D82) · `src/prune.ts` the ledger's aging (048) · `src/migrate.ts` the form-only converter · `src/citations.ts` the citation respell and its home table (043) · `src/lexicon.ts` the standard's §§7–9 as data · `src/vocabulary.ts` the speech arm and its fence · `cli.ts` the arm.

## `doctrine boot` — the cold session's orient (044)

`doctrine boot ‹root›` prints what a session needs to start: the board's live rows, the ledger tail, the baton (`Baton — ‹holder›[ ‹named›][ · ‹shape›][ · ‹type›] → ‹instruments›`, each marked part printed only where the record marked it), the decision queue, the inbox, the statement and the lint line — a few kilobytes where a summons named 150 KB of files. It is DOCTRINE §11's Start, mechanized, and §2's questions answered by the books that hold them.

**Derived at every call, never kept.** The pack is a render of `parse()` and nothing else, so it cannot go stale and nothing in the city stores it. **And nothing in it is authored:** every line that is not a count is a byte from a file — a board row is the document's own line, the tail is the entry's `block`, an inbox entry is its first line. A paraphrase in a pack read cold is a lie the reader cannot see, and `test/boot.test.ts` holds the law as a test.

The live question is why it scales: a board grows with the campaign however hard anyone prunes — 108 rows of which 4 are workable is 60 KB read to learn four lines — while the pack tracks the live set. The retention caps (D78) bound each cell, not the row count.

One root, `.` legal; the building at that root, never its sub-buildings — except the lint line, which is the drift alarm for the root and everything under it. Text only: the room reads `parse()` directly (D10, one parser). Typed absences are printed, never invented — `## Ledger — none`, `deferred —` — and a root the walk finds no artifact in is refused with one line and exit 2.

## The building register (D79)

Membership is declared, never inferred. `canon/BUILDINGS.md` names every building and host — Name · Kind · Root — and that table is discovery's universe:

```ts
import { walkRegister } from './doctrine';

const { entries, fails } = walkRegister();    // → rows + each building row's parse
```

A `building` row's Root is walked by the anchor law; a `host` row is listed and never walked; a Root inside `.claude/worktrees/` is entered directly — a declared root outranks the walk's worktree skip, and the file-level dedup still drops the mainline twins the checkout carries. A malformed row, a duplicate Name and a dead Root are **failures** naming their own line; a registered building the walk finds nothing in is a **warning** — a founding not yet run.

The building register is an artifact like any other: a building that keeps one has it linted in place (`doctrine lint ~/code/agents` reads `canon/BUILDINGS.md`). And it is what Depends-on's third form resolves against — the qualified `<building>:<id>` binds its building half to a Name here (DOCTRINE §4), parsed for form and resolved at lint.

## The standard's tokens (D71)

The reader speaks the standard and reads its history. Every dead word stays parseable forever — the city's records are full of them — and `migrate` re-emits each as its successor; nothing writes one again.

| Token | Dead spelling, still read |
|---|---|
| `⬡-gate` — Staffing's gate charge, Depends-on's named gate | `Felix-gate` (and a bare `Felix`) |
| `DEFERRED` — the annotation that never leads | `PARKED` |
| `ignite <charge-ids>` — the baton's instrument | `fire <row-ids>` |
| `⬡✓` — the blessing mark | `✓ Felix` (respelled at 040 — D81; the reader keeps it forever) |

**Charges are always staffed** (D71, lint-hard): an empty Staffing cell, the dead token `unstaffed`, or a dissolved `—` on a charge whose Status carries no `DEFERRED` is a failure, never a typed absence. `unrecorded` still answers for a record that never held.

## The statement and the caps (D82 · D78)

**`⬡ go ‹date›` is the credit mark** — Felix authorized without looking, the review owed; `⬡✓` is the blessing, and the checkmark is the act of checking (STANDARD §1, §7). The reader takes it wherever it takes `⬡✓`: a Status annotation, a gate paid on credit in Depends-on, a decision's attribution. **The date is part of the token and is never inferred** — an undated mark is `credit.undated` and authorizes nothing.

`doctrine statement` renders every mark on a **live surface** — a board's OPEN / IN FLIGHT / LANDED rows, the decision register whole, the ledger's tail — with its **interest**: the count of charges whose Depends-on chain reaches the marked charge and which have since LANDED. The interest is **derived from the board's graph at every call, never kept**; `lint` prints its one line (`n on credit · max interest m`). A mark on a KILLED row is spent and off the statement, and a decision or a ledger entry names no charge, so its interest is 0.

**The mask — a quoted token is a mention, not a mark.** Code spans and fences are masked, and `canon/` is fenced whole as the vocabulary arm fences it: STANDARD §7 defines the mark by writing one, and a definition is not a debt.

**The retention caps, D78 made enforceable** — law since 2026-08-31, unenforced until 041, so the first run is meant to be red and the prune follows at the next Architect review:

| Cap | Measure | Code |
|---|---|---|
| a LANDED or KILLED Status cell | 200 characters, the cell as written | `board.cell-cap` |
| a ledger entry | 150 words | `ledger.entry-cap` (**warn**) |

The cell cap is hard because the fix is the law: status + findings pointer, the story in the charge doc. The entry cap warns because the ledger's *reads* are D78-exempt — the tail-read protocol already bounds them — and its writes are not.

## `doctrine prune` — the ledger's aging (048)

The ledger's growth is by design and the retention law exempts it, because sessions read its tail — so it is the one file that must relocate rather than die. `doctrine prune ‹root›` moves every entry older than the last **`LIMITS.ledgerTail` = 20** out of `LEDGER.md` into **`ledger-archive.md`** beside it: verbatim, in order, oldest first, append-only, created at the first aging-out with a header naming the law. Dry run by default; `--write` to touch a byte. Run it at the prune check D78 already names — every Architect review, every close gate. Ancestor: the Log's and SAPHO's aging (⬡ 2026-08-29) — six entries kept, the rest one file over, forever.

**The parser reads both.** The archive is bound to its `LEDGER.md` (same directory) and anchors no building of its own — half a record is no place to work. `parseLedgerPair` yields ONE sequence, archive first, so `ledgerEntries` counts the pair and `lint --guard` never reads an aging as a decrease; the tail and the baton stay `LEDGER.md`'s, because the archive is what nobody reboots from. The first run here moved 99 entries and 197,683 bytes, `boot`'s `## Ledger` block came back byte-identical, and the guard reported nothing lost.

**The cut is made in lines, so what moves is bytes** — never a re-emission. The only byte the ledger loses beyond the aged region is the `---` that separated it from the tail, which the archive re-uses as its joining separator. The **round-trip law** is asserted at every run and a violation aborts before anything is written: the entries the pair yields do not change when one of them moves house, block for block, in order. A ledger at or under the count writes nothing, and a second run over a pruned pair writes nothing — the fixed point. The archive lands first: a run that dies between the two writes leaves the record whole twice, which a reader can see and fix.

**The register's nudge**, beside the caps: a `DECISIONS.md` past **30 KB** on disk warns (`decisions.size`, never a failure) — §8's purge is due, and a purge is a blessed act no lint may force. stigmergon's register was 41.7 KB at the landing.

## Parser-as-lint

A field the doctrine names and a doc does not carry is a **failure with its verbatim excerpt**, never a parser branch. Per-repo special cases: zero, and the suite says so. A null is a render decision, not an error — the deck still draws while the lint files the defect.

`--live` narrows the report to what a session or the deck reads *today*: boards, the ledger tail, and the kickoffs of work docs whose own `**Status:**` is still OPEN / IN FLIGHT / BLOCKED.

**A gate is a charge, and a charge is ignited from a kickoff (046).** DOCTRINE §4's gate clause, mechanized: a live board row whose id is `G‹n›` and whose Staffing is a mantle · tier must be **kickoff-reachable** — its Work cell links a doc that carries a fence, or a fence naming the gate (its id or its doc's path) rides the board doc's own notes or the doc of a charge it Depends on. Otherwise `board.gate-kickoff`, with the row verbatim. A `⬡-gate` is never ignited and LANDED / KILLED rows are history, so both are exempt. Birthplace: stigmergon's 029 lay left G6 with neither, the lint reported 32 kickoffs in 34 work docs and **0 failures**, and the batch paused with its tender refusing to author one.

**The kickoff arm (031).** Counting a fence is not reading it. In a work doc whose own `**Status:**` is still unfinished the fenced kickoff must open in the summons grammar — the summons line (`kickoff.summons`), then 033's door line (`kickoff.door`), then the wear line (`kickoff.wear`): DOCTRINE §5's single-glance test, mechanized, because the flow engine fires those bytes verbatim. LANDED and KILLED docs are history and are never read. The unmantled cheap-tier ignition carries GUILD.md's closing stanza inline instead of a path read (`canon/mantles/README.md`) — it names no mantle and wears no charter, so it passes on its opening line and is no more a kickoff candidate than a Personal-Log letter is.

**The marked fence is the kickoff; every other fence is a quotation (046).** §5's template writes `**Kickoff (verbatim):**` above the fence, so a doc that marks its kickoff has said what its other fences are — and a Digger's Findings quote the summonses the dig fired, which §6 forbids anyone to edit afterwards (stigmergon `plans/080-born-dig.md:244`, the live case). Where a doc marks none the arm reads every fence, as it always did (the grandfathered docs). A ledger entry is exempt whole: its fenced summons is an **instrument** (D63g), not a document's kickoff. The demotion is a de-duplication — 9 quoted fences across the city, 7 of them a gate's own kickoff quoted into its batch note — so the entity counts fall with it and a `--guard` run across this change reports `kickoffs` decreasing, deliberately.

## The ledger's clauses and the baton (§7, §11)

**A clause leads or it is a mention (036).** `Decided:` and `Next:` split an entry's body only where the marker opens the body, opens a line, or opens a sentence — and code, fenced or inline, is masked before the search. The old rule took the first `Next:` anywhere in the flattened body, so an entry that merely *said* `Next:` handed a clause read off bytes its writer never meant (B26 F5, two of the city's fifteen tails). Each clause runs to the next marker, so a `Next:` no longer swallows the `Decided:` behind it, and the pre-doctrine bullet dialect (`- **Next:** x`) leads its line like any other.

**The holder is written, never inferred (D74).** `Baton — <one holder> → <action>`: the parser reads the hand off the line — `⬡` (`Felix` is that same hand in the record's older spelling), `the dispatch`, or a named session — and an instrument no longer outranks it. An entry that writes no baton line is the record before D74, and there alone the holder is inferred from the clause's prose.

**The move is marked, and the marks are typed (045).** §11 already writes four things into a baton, and the reader now types each where the record writes it, inferring none: **`shape`** — `single —` · `batch —` · `fork —`, the word that opens the action; **`recommendation`** — a fork's named option, resolved to an instrument the baton carries where the text names one, else the writer's own text, else `taste`; **`type`** — what a ⬡-baton *requires of Felix*: **mental** (a decision), **visual** (an interface to look at or drive), **bench** (physical testing — a simulator is not enough), read off the action's leading noun through `BATON_TYPES` in `grammar.ts`; **`named`** — which session holds it, the line's own holder slot. An unmarked baton types all four `null`: it predates the markers or is malformed, and inventing a `single` for it would report a move nobody chose. **New this arm:** a tail whose baton is a fork with no recommendation and no taste mark fails `ledger.baton` — §11's *a menu with no recommendation is a dropped baton*. Tails only, as ever; history is never linted.

**`Next: none — <why>` owes nothing.** §7's typed nothing-owed close parses as its own holder, `none`, and is not a dropped baton. Bare prose that means the same thing ("nothing waits") still is: that is the whole point of typing it (B26 F2, the fourth filing).

## `--vocab` — the speech arm (026)

Format drift is caught by the parser; `--vocab` points the same alarm at **speech**. Off by default: the form arms are a doc's honesty and gate the exit code, while the vocabulary arm reports the city's respell backlog. Ancestor: manny's **M13** (`campaign-id`, hard error) at `manny/plans/29-campaign-id-lint.md` — its two laws are this arm's, *narrow the pattern, never whitelist a file* and *one code per arm, the excerpt differentiates*.

| Arm | Law | Code |
|---|---|---|
| the graveyard | §9's table — a dead word, its successor named in the excerpt | `vocab.dead-word` |
| the spelling lexicon | §8 — American, exception list `{grey, greys, greyed}`, `-ize` with it | `vocab.spelling` |
| the pinned formulas | §8's pinned list — most of a formula's spine, none of its wording | `vocab.formula` |
| the id namespace | §7 — a letter serving two kinds in one building (bare D at home is the law, D80) | `vocab.prefix` (**warn**) |

A **warning** is reported and never enforced — §7's own word — and never moves the exit code.

**The fence is structural, not a list of exceptions.** History and voice are masked out of the text before a pattern runs, so a dead word inside them is not *allowed*, it is not there: fenced code and summonses · blockquotes · inline code · `~~struck~~` text · link targets and one-word link texts · double-quoted spans · `Findings` / `Ledger` / `Decisions` sections · a board's Depends-on, Staffing and Status columns · **a LANDED or KILLED row whole** (a finished charge's title is the address its ledger cites) · closed charge docs · `LOG.md`, `SAPHO.md`, `dream.md` · `canon/` itself, which must name the dead to bury them.

**Spent is spent, whatever the register filed the doc as (036).** A doc whose own `**Status:**` opens LANDED or KILLED is history, and a charge that tends a wave carries a staffing table — so the register files it as a *board*, and the board half of the live list read every board whatever its state said. `plans/018-great-recut.md` landed on 2026-08-29 and was still reporting eleven dead words. Carrying no Status line says nothing either way and arms nothing: the master docs and `CLAUDE.md` stay law surfaces.

**A mention is spelled in ticks or quotes.** The arm cannot tell use from mention (023-F3), so the doc says which: `` `unstaffed` `` and *"the Dispatcher is dead"* are already fenced, and that is the cure for a tombstone sentence — not a per-file exemption.

**Eight of §9's thirty-two rows are dropped, in writing, each with its reason** (`src/lexicon.ts`): `chain` · `fold` · `wave` · `move` · `window` · `strike` · `pass` · the four-slot waggle. A pattern that cannot be written without false positives is dropped, never weakened — and `fire` keeps only its bare form, measured at 8/8 Guild-sense against `fires` 0/5 and `firing` 1/8 in a city where clauses, listeners and kill criteria all fire.

`src/lexicon.ts` is a **mirror** of §§7–9; `test/vocabulary.test.ts` is the alarm on the mirror. Edit the standard and the suite goes red — and the alarm proves itself, running each binding a second time against a mutated copy of the standard's text and asserting that it fails.

## The register — how a building is found

- A directory is a **building** when it directly carries `LEDGER.md`, `DECISIONS.md`, `ISSUES.md`, or a master doc (`MAP.md` / `GENESIS.md` / `README.md`) that staffs sessions.
- Every other artifact file belongs to its **nearest ancestor building**; a board with no ancestor promotes its own directory (that is how `cap-mega/docs`' contract boards get a home).
- `lab/`, `fixtures/` and `templates/` are not corpus (DOCTRINE §3, §6.2, and ⟨placeholders⟩); they stay lintable when named as an explicit root.
- **Worktrees are walked** — four of the city's boards live only under `.claude/worktrees/`. A checkout whose mainline twin exists at the same size IS that twin and is skipped; a branch that put a board in a doc the mainline has none in survives; one representative per `(repo, relative path)`. The count skipped is printed, never hidden.
- **Where the checkout root ends is found, not assumed (036), and it is found at the DIRECTORY (046).** A branch name carries as many path segments as it has slashes — one segment was assumed until `bv/029-summon-harness` took two, and every total doubled (2 buildings → 4, 84 rows → 168). A *file*-level search cannot find the split either: a one-segment remainder's own dirname is `.`, which always exists, so the search always "succeeded" and a branch-only `<checkout>/<dir>/LEDGER.md` was matched against `<repo>/LEDGER.md` and skipped as its twin — the building vanished (039-F5). A checkout is a copy of the repo, so **the checkout root is the shallowest directory under `.claude/worktrees/` that shares a name with the mainline root**; a branch-name prefix directory holds only the next segment, which is a branch's word and not the repo's. Keyed on *being a worktree*, never on a name shape — `feature/simmy` is checked out at `worktrees/simmy` on this machine, and the directory name is nobody's evidence.
- **An explicit root keeps its own files (046).** The twin skip is for checkouts a walk *discovers*, never for the root a caller names: `doctrine lint <a worktree path>` parses that checkout's own ledger and baton. The root's own files only — the twins deeper under it still dedupe, which is what a declared worktree root asks for. Birthplace: a gate running in `…/worktrees/simmy/simmy` read `ledger none · baton none · 0/0 ledgers parsed a tail` while its board and kickoffs parsed fine (2026-09-08).

## `doctrine migrate` — form only

Parse, then re-emit in the current grammar. Prose bodies are byte-preserved and the converter never paraphrases (D63's molt clause). Every rule is a total, line-scoped replacement that declares which parsed fields it may alter; a dry-run diff is the default and `--write` is required to touch a byte.

**The round-trip law, asserted:** `parse(migrate(x)) ≡ parse(x)` — a field the parser already typed comes back identical; only a field a fired rule declared may change; nothing outside a recorded edit moves. A violation aborts the write: that is a converter bug, not a doc defect.

**The id respell (D80/D81).** `migrate` derives the respell table from the building's own board — bare `n`/`nn` → `nnn`, a per-campaign letter shed (`C23` → `023`, `S3` → `003`), a KIND's letter kept (`G2`) — prints it before a byte moves, and applies it to every TRACKED text file the building keeps: tokens, paths, board cells, ledger head slots, findings ids, and the typed prose slots (`charge 018`, `row 007`, `ignite 024`). The dead compounds ride the same pass: `GA-‹nn›` → the name-stamp, `FC-‹n›` → its concept's word, `✓ Felix` → `⬡✓` (D81's first act). Its round-trip law is stronger than silence: every parsed field must be INVARIANT UNDER THE TABLE — `respell(before) ≡ respell(after)` — so a paraphrase, a drop or a wrong address still fails, while a bare number no noun types stays a session's call. A building that already conforms gets an empty table and a run that writes nothing.

**The unwrap (D88, 047) — prose flows.** One paragraph, one line; the reader's width decides where it breaks. A paragraph's hard-wrapped lines join with one space, which is what CommonMark renders a soft line break as, so the rendered page does not move — the rule writes no character, it only moves whitespace. Its fence is one idea: **a construct whose LINES ARE ITS MEANING is untouched** — fenced code, front matter, tables, headings, thematic breaks, HTML blocks, indented blocks, reference-link definitions, and every line the Guild's own parsers find at line start (a list marker, a blockquote marker, §11's baton — `BATON_LINE` is anchored, so a baton joined into the prose above it would stop being a baton). **A line that OPENS a block is guarded; a line that CONTINUES a paragraph is not** — CommonMark's own asymmetry, and it is what keeps a wrapped sentence beginning `| curl)` or `< 500 ms` from being read as a table row or a tag.

Two laws, both asserted at every run, and a violation aborts the write as any round-trip violation does. The **round-trip law** takes its usual shape with a new normal form: every parsed field must be INVARIANT UNDER WHITESPACE COLLAPSE, so the unwrap buys no license to differ. The **word law** reads what no parser typed — outside fences, the whole text collapsed to single spaces must be equal, so a word moved, dropped or added fails; a fence is compared byte for byte, because there the bytes are the meaning. A leading blockquote marker is stripped on both sides before the collapse: `> ` is line structure exactly as a continuation line's indentation is, and the rule drops both by design.

The unwrap's fence is **not** the respell's. The respell stops at a nested building because an id is namespaced and a sub-building's `007` is its own; whitespace is namespaced by nobody, so a sub-building's prose is this building's bytes and reflows with them. Markdown only — a `.ts` line break is syntax — minus `fixtures/` (a control set's bytes ARE the form it exercises) and minus `lab/` (disposable, not corpus — DOCTRINE §3).

**Structure first, reflow second, and never both on one file in one run.** The structural rules are line-scoped and read their neighbours — a ledger head reads the line below it for a `Changed:` label — so a reflow that joined those lines in the same pass would hand a repair rule bytes its author never wrote. A building that has adopted takes ONE run and the second writes nothing (040-F7's fixed point); a building mid-molt takes two, and the second moves only whitespace.

**`--summary`** prints, per file, the edit count by rule and the round-trip verdict, and no diff. An unwrap diff is the whole corpus, and the two laws say more about it than the whitespace does. The dry run is still the default; `--write` is still required to touch a byte.

**Blame survives the respell.** A whitespace commit that touched 180 files would otherwise put its own sha on every line of the city. `.git-blame-ignore-revs` at the repo root names the respell commits, and `git config --local blame.ignoreRevsFile .git-blame-ignore-revs` makes `git blame` read it — set once per checkout, and a fresh clone sets it again.

**The clause pass re-reads (031).** The rules run in two classes: structure and field rules first, then the document is re-read and `ledger.unrecorded-clauses` decides its typed absences against what the document now says. Reading the pre-migration bytes is how the converter came to stamp `Decided: unrecorded.` into 61 whiteboardy entries that carried a real clause — in the house dialect a field rule had just repaired — while the round-trip law printed `ok` for every one of them. **`round-trip ok` is a statement about declared fields, not about meaning.** Where the tool cannot repair a clause's spelling it refuses to fill: a refusal is a lint failure with a human's name on it, a fill is a lie.

Deliberate refusals, because the alternative is a converter inventing meaning:

- **kickoff fences, for the structural rules** — nobody edits a kickoff except the Architect re-laying the charge (§5). The respell reads them: a fenced path is still a path, and a kickoff naming a renamed charge doc is a dead address (D80).
- **ISSUES entries** — the inbox clears empty by law (D53); the non-conforming inboxes hold struck history awaiting their Architects' sweeps.
- **judgment targets** — a `CHARTERED` status, a missing decider, a session title stuck in a ledger's bold run, and **who staffs a live charge**: `unstaffed` becomes `—` only where the Status already says the charge is DEFERRED. Those stay lint failures with a human's name on them.
- **a named form** — a code-ticked lone token (`C23`, `✓ Felix`, `GA-20`) is a form being NAMED, not an address being used: the graveyard's own rows, §7's historical-forms list. Naming a dead form is how the law records it, so the converter leaves it standing. A ticked span carrying `/` or `.` is an address and respells; a ticked phrase (`ignite 029`) is not a form. **Two clauses beyond the lone token (047-F3):** a span BESIDE `→` is a named form whatever it carries — `→` is the record's own grammar for a form change (STANDARD §7) and both sides of it quote forms as they were written — and a span opened by more than one backtick is one span and a named form, because CommonMark's longer fence is what the record reaches for when it quotes markup as written.
- **a line consumed only PARTLY** — where the respell would rewrite one code span and leave another standing as a named form it can still reach, the line is reverted whole and reported as a HAND edit, never written (`--summary` prints the list under its table). Half a respell reads as finished work and is not: the live case recorded a form repair and would have expanded the name on the left of its own `→`. A hand edit is not a pending edit, so the run stays a fixed point around it. Carried over from `citations.ts`, whose partial-consumption guard is the same law at a different distance.
- **another building's address** — `/…/whiteboardy/plans/18-…` and `cornerizer C34` are foreign ids (D80: hosts keep their forms). The path rules bind to the building's own directory name; a foreign id in prose is a session's call, never a rule's.

## `doctrine citations` — the purge's citations (043)

DOCTRINE §8's purge clause, executed. When a register entry is killed whole, the live law surfaces still cite it: labels that name a rule, links that lead nowhere. A citation is a **pointer**, so it follows one rule read at two distances — where the home is another document the pointer names it (`(D44)` → `(DOCTRINE §4, gates are charges)`); where the home is the citing document there is nothing to point at and the pointer **strips** (`**Gates are charges (D44).**` → `**Gates are charges.**`). A bare foreign id qualifies (`belvedere:D11`), and history keeps its numbers: the ledger, the Log, the closed findings and `BOARD.md`'s records are out of the fence, because there a `D44` records what was decided that day and respelling it would change meaning, not form.

**The table is hand-kept** — D77 deleted the entries, so `src/citations.ts` is where their homes live or nowhere. One row per killed id: the entry's title (the record), the home document (the self test), and what a cross-citation writes. No row, no edit: an id the table does not name — another building's, a form being shown, a live entry — is untouchable by construction. It prints before a byte moves.

**Three shapes per class, line-scoped:** a citation alone in a parenthetical, one leading a parenthetical (`(D65; birthplace: …)`), one trailing it (`(… the message, D57)`). Everything else is a **hand edit** and the run says so instead of guessing — a possessive (`D28's law`), a narrative event (`made law at D73`), a shape split by a hard wrap. Two guards earn their keep: a line the shapes consume only PARTLY is reverted whole and reported (half a respell reads as finished work and is not), and a strip that would leave a seam — `( `, ` )`, a line holding one full stop — throws, because that is the shape being wrong about its own edges.

**A row names ONE home, the spine.** Where an entry legislated two clauses that now live in two sections (D45, D63, D73, D74), a citation leaning on the other section is a hand edit too: the converter cannot read which clause a sentence leans on. The census closes the loop — every bare `D‹n›` still standing, the table's own separated from the rest, and the table's own must read **0**.
