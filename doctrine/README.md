# doctrine — the Standards Office's reference reader

One parser in the city. The Office owns the format, so it owns the reader: two readers of
one format WILL drift. Belvedere imports this library; nothing re-implements it.

Tooling, not canon-law — a peer of [`sync/`](../sync). The law it reads lives in
[`canon/work/DOCTRINE.md`](../canon/work/DOCTRINE.md) §§3, 4, 5, 7, 8, 11, as amended by
**D63** (the schema distillation), **D64** (the baton grammar) and **D71** — the Guild's standard,
[`canon/work/STANDARD.md`](../canon/work/STANDARD.md). The parsed shapes are P3 §5's,
normative per D65 ([belvedere/plans/p3-parse-coverage.md](../belvedere/plans/p3-parse-coverage.md)).

```
bun doctrine/cli.ts lint [--live] [--vocab] [--verbose] [--json] <path…>
bun doctrine/cli.ts statement [--json] <path…>   # every ⬡ go on a live surface (D82)
bun doctrine/cli.ts parse --json <building>
bun doctrine/cli.ts buildings [--json]     # the building register, walked
bun doctrine/cli.ts migrate [--write] <building>
bun doctrine/cli.ts citations [--write] <building>   # citations of killed D-ids (043)
bun test                                   # from doctrine/ — the §6.2 control + the round-trip law
```

## The library

```ts
import { parse, lint, migrate } from './doctrine';

const b = parse('~/code/agents/belvedere');   // → Building: board[] · ledgerTail · baton
                                              //   · decisionQueue · issues · kickoffs
                                              //   · credits · fails
```

`src/grammar.ts` names every mantle, tier, state, verdict and dead word **once** · `src/parse.ts` the
five artifact parsers · `src/building.ts` discovery + `parse()` · `src/register.ts` the building
register · `src/lint.ts` the walk and the report · `src/credit.ts` the statement (D82) ·
`src/migrate.ts` the form-only converter ·
`src/citations.ts` the citation respell and its home table (043) ·
`src/lexicon.ts` the standard's §§7–9 as data · `src/vocabulary.ts` the speech arm and its
fence · `cli.ts` the arm.

## The building register (D79)

Membership is declared, never inferred. `canon/BUILDINGS.md` names every building and host —
Name · Kind · Root — and that table is discovery's universe:

```ts
import { walkRegister } from './doctrine';

const { entries, fails } = walkRegister();    // → rows + each building row's parse
```

A `building` row's Root is walked by the anchor law; a `host` row is listed and never walked;
a Root inside `.claude/worktrees/` is entered directly — a declared root outranks the walk's
worktree skip, and the file-level dedup still drops the mainline twins the checkout carries.
A malformed row, a duplicate Name and a dead Root are **failures** naming their own line; a
registered building the walk finds nothing in is a **warning** — a founding not yet run.

The building register is an artifact like any other: a building that keeps one has it linted
in place (`doctrine lint ~/code/agents` reads `canon/BUILDINGS.md`). And it is what
Depends-on's third form resolves against — the qualified `<building>:<id>` binds its building
half to a Name here (DOCTRINE §4), parsed for form and resolved at lint.

## The standard's tokens (D71)

The reader speaks the standard and reads its history. Every dead word stays parseable
forever — the city's records are full of them — and `migrate` re-emits each as its successor;
nothing writes one again.

| Token | Dead spelling, still read |
|---|---|
| `⬡-gate` — Staffing's gate charge, Depends-on's named gate | `Felix-gate` (and a bare `Felix`) |
| `DEFERRED` — the annotation that never leads | `PARKED` |
| `ignite <charge-ids>` — the baton's instrument | `fire <row-ids>` |
| `⬡✓` — the blessing mark | `✓ Felix` (respelled at 040 — D81; the reader keeps it forever) |

**Charges are always staffed** (D71, lint-hard): an empty Staffing cell, the dead token
`unstaffed`, or a dissolved `—` on a charge whose Status carries no `DEFERRED` is a failure,
never a typed absence. `unrecorded` still answers for a record that never held.

## The statement and the caps (D82 · D78)

**`⬡ go ‹date›` is the credit mark** — Felix authorized without looking, the review owed; `⬡✓`
is the blessing, and the checkmark is the act of checking (STANDARD §1, §7). The reader takes it
wherever it takes `⬡✓`: a Status annotation, a gate paid on credit in Depends-on, a decision's
attribution. **The date is part of the token and is never inferred** — an undated mark is
`credit.undated` and authorizes nothing.

`doctrine statement` renders every mark on a **live surface** — a board's OPEN / IN FLIGHT /
LANDED rows, the decision register whole, the ledger's tail — with its **interest**: the count of
charges whose Depends-on chain reaches the marked charge and which have since LANDED. The
interest is **derived from the board's graph at every call, never kept**; `lint` prints its one
line (`n on credit · max interest m`). A mark on a KILLED row is spent and off the statement, and
a decision or a ledger entry names no charge, so its interest is 0.

**The mask — a quoted token is a mention, not a mark.** Code spans and fences are masked, and
`canon/` is fenced whole as the vocabulary arm fences it: STANDARD §7 defines the mark by writing
one, and a definition is not a debt.

**The retention caps, D78 made enforceable** — law since 2026-08-31, unenforced until 041, so the
first run is meant to be red and the prune follows at the next Architect review:

| Cap | Measure | Code |
|---|---|---|
| a LANDED or KILLED Status cell | 200 characters, the cell as written | `board.cell-cap` |
| a ledger entry | 150 words | `ledger.entry-cap` (**warn**) |

The cell cap is hard because the fix is the law: status + findings pointer, the story in the
charge doc. The entry cap warns because the ledger's *reads* are D78-exempt — the tail-read
protocol already bounds them — and its writes are not.

## Parser-as-lint

A field the doctrine names and a doc does not carry is a **failure with its verbatim
excerpt**, never a parser branch. Per-repo special cases: zero, and the suite says so. A
null is a render decision, not an error — the deck still draws while the lint files the
defect.

`--live` narrows the report to what a session or the deck reads *today*: boards, the ledger
tail, and the kickoffs of work docs whose own `**Status:**` is still OPEN / IN FLIGHT /
BLOCKED.

**The kickoff arm (031).** Counting a fence is not reading it. In a work doc whose own
`**Status:**` is still unfinished the fenced kickoff must open in the summons grammar — the
summons line (`kickoff.summons`), then 033's door line (`kickoff.door`), then the wear line
(`kickoff.wear`): DOCTRINE §5's single-glance test, mechanized, because the flow engine fires
those bytes verbatim. LANDED and KILLED docs are history and are never read. The unmantled
cheap-tier ignition carries GUILD.md's closing stanza inline instead of a path read
(`canon/mantles/README.md`) — it names no mantle and wears no charter, so it passes on its
opening line and is no more a kickoff candidate than a Personal-Log letter is.

## The ledger's clauses and the baton (§7, §11)

**A clause leads or it is a mention (036).** `Decided:` and `Next:` split an entry's body only
where the marker opens the body, opens a line, or opens a sentence — and code, fenced or inline,
is masked before the search. The old rule took the first `Next:` anywhere in the flattened body,
so an entry that merely *said* `Next:` handed a clause read off bytes its writer never meant
(B26 F5, two of the city's fifteen tails). Each clause runs to the next marker, so a `Next:` no
longer swallows the `Decided:` behind it, and the pre-doctrine bullet dialect (`- **Next:** x`)
leads its line like any other.

**The holder is written, never inferred (D74).** `Baton — <one holder> → <action>`: the parser
reads the hand off the line — `⬡` (`Felix` is that same hand in the record's older spelling),
`the dispatch`, or a named session — and an instrument no longer outranks it. An entry that
writes no baton line is the record before D74, and there alone the holder is inferred from the
clause's prose.

**`Next: none — <why>` owes nothing.** §7's typed nothing-owed close parses as its own holder,
`none`, and is not a dropped baton. Bare prose that means the same thing ("nothing waits") still
is: that is the whole point of typing it (B26 F2, the fourth filing).

## `--vocab` — the speech arm (026)

Format drift is caught by the parser; `--vocab` points the same alarm at **speech**. Off by
default: the form arms are a doc's honesty and gate the exit code, while the vocabulary arm
reports the city's respell backlog. Ancestor: manny's **M13** (`campaign-id`, hard error) at
`manny/plans/29-campaign-id-lint.md` — its two laws are this arm's, *narrow the pattern, never
whitelist a file* and *one code per arm, the excerpt differentiates*.

| Arm | Law | Code |
|---|---|---|
| the graveyard | §9's table — a dead word, its successor named in the excerpt | `vocab.dead-word` |
| the spelling lexicon | §8 — American, exception list `{grey, greys, greyed}`, `-ize` with it | `vocab.spelling` |
| the pinned formulas | §8's pinned list — most of a formula's spine, none of its wording | `vocab.formula` |
| the id namespace | §7 — a letter serving two kinds in one building (bare D at home is the law, D80) | `vocab.prefix` (**warn**) |

A **warning** is reported and never enforced — §7's own word — and never moves the exit code.

**The fence is structural, not a list of exceptions.** History and voice are masked out of the
text before a pattern runs, so a dead word inside them is not *allowed*, it is not there:
fenced code and summonses · blockquotes · inline code · `~~struck~~` text · link targets and
one-word link texts · double-quoted spans · `Findings` / `Ledger` / `Decisions` sections · a
board's Depends-on, Staffing and Status columns · **a LANDED or KILLED row whole** (a finished
charge's title is the address its ledger cites) · closed charge docs · `LOG.md`, `SAPHO.md`,
`dream.md` · `canon/` itself, which must name the dead to bury them.

**Spent is spent, whatever the register filed the doc as (036).** A doc whose own `**Status:**`
opens LANDED or KILLED is history, and a charge that tends a wave carries a staffing table — so
the register files it as a *board*, and the board half of the live list read every board
whatever its state said. `plans/018-great-recut.md` landed on 2026-08-29 and was still reporting
eleven dead words. Carrying no Status line says nothing either way and arms nothing: the master
docs and `CLAUDE.md` stay law surfaces.

**A mention is spelled in ticks or quotes.** The arm cannot tell use from mention (023-F3), so
the doc says which: `` `unstaffed` `` and *"the Dispatcher is dead"* are already fenced, and
that is the cure for a tombstone sentence — not a per-file exemption.

**Eight of §9's thirty-two rows are dropped, in writing, each with its reason** (`src/lexicon.ts`):
`chain` · `fold` · `wave` · `move` · `window` · `strike` · `pass` · the four-slot waggle. A
pattern that cannot be written without false positives is dropped, never weakened — and `fire`
keeps only its bare form, measured at 8/8 Guild-sense against `fires` 0/5 and `firing` 1/8 in a
city where clauses, listeners and kill criteria all fire.

`src/lexicon.ts` is a **mirror** of §§7–9; `test/vocabulary.test.ts` is the alarm on the mirror.
Edit the standard and the suite goes red — and the alarm proves itself, running each binding a
second time against a mutated copy of the standard's text and asserting that it fails.

## The register — how a building is found

- A directory is a **building** when it directly carries `LEDGER.md`, `DECISIONS.md`,
  `ISSUES.md`, or a master doc (`MAP.md` / `GENESIS.md` / `README.md`) that staffs sessions.
- Every other artifact file belongs to its **nearest ancestor building**; a board with no
  ancestor promotes its own directory (that is how `cap-mega/docs`' contract boards get a home).
- `lab/`, `fixtures/` and `templates/` are not corpus (DOCTRINE §3, §6.2, and ⟨placeholders⟩);
  they stay lintable when named as an explicit root.
- **Worktrees are walked** — four of the city's boards live only under `.claude/worktrees/`.
  A checkout whose mainline twin exists at the same size IS that twin and is skipped; a
  branch that put a board in a doc the mainline has none in survives; one representative per
  `(repo, relative path)`. The count skipped is printed, never hidden.
- **Where the checkout root ends is found, not assumed (036).** A branch name carries as many
  path segments as it has slashes, so the split is the shallowest one whose remainder's own
  directory exists in the mainline — keyed on *being a worktree*, never on a `worktree-agent-*`
  name shape. One segment was assumed until `bv/029-summon-harness` took two: no file under it
  resolved to its twin, and every total doubled (2 buildings → 4, 84 rows → 168).

## `doctrine migrate` — form only

Parse, then re-emit in the current grammar. Prose bodies are byte-preserved and the converter
never paraphrases (D63's molt clause). Every rule is a total, line-scoped replacement that
declares which parsed fields it may alter; a dry-run diff is the default and `--write` is
required to touch a byte.

**The round-trip law, asserted:** `parse(migrate(x)) ≡ parse(x)` — a field the parser already
typed comes back identical; only a field a fired rule declared may change; nothing outside a
recorded edit moves. A violation aborts the write: that is a converter bug, not a doc defect.

**The id respell (D80/D81).** `migrate` derives the respell table from the building's own
board — bare `n`/`nn` → `nnn`, a per-campaign letter shed (`C23` → `023`, `S3` → `003`), a
KIND's letter kept (`G2`) — prints it before a byte moves, and applies it to every TRACKED
text file the building keeps: tokens, paths, board cells, ledger head slots, findings ids,
and the typed prose slots (`charge 018`, `row 007`, `ignite 024`). The dead compounds ride
the same pass: `GA-‹nn›` → the name-stamp, `FC-‹n›` → its concept's word, `✓ Felix` → `⬡✓`
(D81's first act). Its round-trip law is stronger than silence: every parsed field must be
INVARIANT UNDER THE TABLE — `respell(before) ≡ respell(after)` — so a paraphrase, a drop or a
wrong address still fails, while a bare number no noun types stays a session's call. A
building that already conforms gets an empty table and a run that writes nothing.

**The clause pass re-reads (031).** The rules run in two classes: structure and field rules
first, then the document is re-read and `ledger.unrecorded-clauses` decides its typed absences
against what the document now says. Reading the pre-migration bytes is how the converter came
to stamp `Decided: unrecorded.` into 61 whiteboardy entries that carried a real clause — in the
house dialect a field rule had just repaired — while the round-trip law printed `ok` for every
one of them. **`round-trip ok` is a statement about declared fields, not about meaning.**
Where the tool cannot repair a clause's spelling it refuses to fill: a refusal is a lint
failure with a human's name on it, a fill is a lie.

Deliberate refusals, because the alternative is a converter inventing meaning:

- **kickoff fences, for the structural rules** — nobody edits a kickoff except the Architect
  re-laying the charge (§5). The respell reads them: a fenced path is still a path, and a
  kickoff naming a renamed charge doc is a dead address (D80).
- **ISSUES entries** — the inbox clears empty by law (D53); the non-conforming inboxes hold
  struck history awaiting their Architects' sweeps.
- **judgment targets** — a `CHARTERED` status, a missing decider, a session title stuck in a
  ledger's bold run, and **who staffs a live charge**: `unstaffed` becomes `—` only where the
  Status already says the charge is DEFERRED. Those stay lint failures with a human's name on them.
- **a named form** — a code-ticked lone token (`C23`, `✓ Felix`, `GA-20`) is a form being
  NAMED, not an address being used: the graveyard's own rows, §7's historical-forms list.
  Naming a dead form is how the law records it, so the converter leaves it standing. A ticked
  span carrying `/` or `.` is an address and respells; a ticked phrase (`ignite 029`) is not a
  form.
- **another building's address** — `/…/whiteboardy/plans/18-…` and `cornerizer C34` are
  foreign ids (D80: hosts keep their forms). The path rules bind to the building's own
  directory name; a foreign id in prose is a session's call, never a rule's.

## `doctrine citations` — the purge's citations (043)

DOCTRINE §8's purge clause, executed. When a register entry is killed whole, the live law
surfaces still cite it: labels that name a rule, links that lead nowhere. A citation is a
**pointer**, so it follows one rule read at two distances — where the home is another
document the pointer names it (`(D44)` → `(DOCTRINE §4, gates are charges)`); where the home
is the citing document there is nothing to point at and the pointer **strips**
(`**Gates are charges (D44).**` → `**Gates are charges.**`). A bare foreign id qualifies
(`belvedere:D11`), and history keeps its numbers: the ledger, the Log, the closed findings and
`BOARD.md`'s records are out of the fence, because there a `D44` records what was decided that
day and respelling it would change meaning, not form.

**The table is hand-kept** — D77 deleted the entries, so `src/citations.ts` is where their
homes live or nowhere. One row per killed id: the entry's title (the record), the home
document (the self test), and what a cross-citation writes. No row, no edit: an id the table
does not name — another building's, a form being shown, a live entry — is untouchable by
construction. It prints before a byte moves.

**Three shapes per class, line-scoped:** a citation alone in a parenthetical, one leading a
parenthetical (`(D65; birthplace: …)`), one trailing it (`(… the message, D57)`). Everything
else is a **hand edit** and the run says so instead of guessing — a possessive (`D28's law`),
a narrative event (`made law at D73`), a shape split by a hard wrap. Two guards earn their
keep: a line the shapes consume only PARTLY is reverted whole and reported (half a respell
reads as finished work and is not), and a strip that would leave a seam — `( `, ` )`, a line
holding one full stop — throws, because that is the shape being wrong about its own edges.

**A row names ONE home, the spine.** Where an entry legislated two clauses that now live in
two sections (D45, D63, D73, D74), a citation leaning on the other section is a hand edit too:
the converter cannot read which clause a sentence leans on. The census closes the loop — every
bare `D‹n›` still standing, the table's own separated from the rest, and the table's own must
read **0**.
