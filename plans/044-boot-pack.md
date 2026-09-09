# 044 — the boot pack

**Status:** OPEN — laid 2026-09-08 · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Blessed:** Felix, 2026-09-08, in the room (grand-architect-24): fork (b) — the boot pack
first, the parser's other field asks behind it.

## Mission

`doctrine boot ‹root›` prints what a cold session needs to orient, derived from the
building's books at every call and never kept: the board's live rows, the ledger's last
entry, the baton, the decision queue, the inbox, the statement and the lint line — a few
kilobytes where a summons named 150 KB of files. Nothing in the pack is authored: every
line that is not a count is a byte from a file. **The parse already exists** — `parse()`
yields every field (`doctrine/src/building.ts`, `Building`); this charge is a render of
it. The best part is no part.

**Birthplace** (stigmergon 079-F11, 2026-09-08, Felix's boot-up question at the desk): an
Architect summons at stigmergon named ~150 KB of reads — `BOARD.md` alone 60 KB for 108
rows of which 4 are live, `DECISIONS.md` 43 KB, `LEDGER.md` 278 KB for a 3 KB tail. The
retention cap (D78, 041) bounds each cell, not the row count: the board grows with the
campaign however hard anyone prunes. Only a derived live view scales. Ancestors: DOCTRINE
§1 (the two-minute start), formula 17 (the tail alone reboots a cold session), formula 21
(auto-loaded bytes are taxed), `lint --live`'s live set (031), the docket — the room's
render of the same parse for Felix (stigmergon `docs/docket.md`; D10, one parser).

## Inputs — read before working

- `~/code/agents/canon/work/DOCTRINE.md` §2 (the cold session's questions — the pack answers
  the ones the books can), §7 (the tail), §11 (Start — the law this pack will carry at G4).
- `~/code/agents/doctrine/README.md` whole; `doctrine/src/building.ts` (`Building`, `parse`,
  `discover`); `doctrine/src/parse.ts` (`BoardRow` — `line` gives the row's source line;
  `LedgerEntry.block` — the entry verbatim; `classifyBaton`); `doctrine/src/lint.ts`
  (`render` — the report's voice and totals line); `doctrine/src/credit.ts`
  (`renderStatement`'s one-liner); `doctrine/cli.ts` (USAGE, the command shapes).
- `~/code/agents/BOARD.md` and `~/code/stigmergon/BOARD.md` — the two boards the bar
  measures; both keep the deferred list under the line `**Deferred (tracked, not lost):**`.
- Known, do not re-derive: measured 2026-09-08 at the desk — stigmergon `parse()` yields
  108 rows / 4 live, a 3,008-byte tail, a typed baton, queue 0, inbox 1, 49 deferred
  bullets; the live rows serialize to ~1.9 KB. `doctrine` resolves on PATH at this machine
  (`~/.dotfiles/bin/doctrine → doctrine/cli.ts`, Felix's hand, 2026-09-08 — a symlinked
  `cli.ts` resolves its imports; verified).

## Spec

`doctrine boot ‹root›` — exactly one root, `.` legal; the building at that root
(`parse(root)`, the anchor law), never its sub-buildings. Text only, no `--json` (the room
reads `parse()` directly). The pack, in this order:

```
# ‹Name› — boot · ‹root› · HEAD ‹sha7› · ‹YYYY-MM-DD›

## Board — ‹file›: ‹n› charges · ‹live› live · ‹landed› landed · ‹killed› killed · deferred ‹m›
| ID | Work | Depends on | Staffing | Status |      ← the header row as written in the file
| … every OPEN / IN FLIGHT / BLOCKED row, byte-verbatim from its source line, board order … |

## Ledger — ‹file›: ‹n› entries
‹the last entry's block, verbatim, its `---` dropped›
Baton — ‹holder› · ‹instruments› | none — ‹why› | dropped

## Decisions — ‹file›: ‹n› entries · queue ‹q›
- ‹id› — ‹title›            (one line per proposed-not-blessed entry; nothing else)

## Inbox — ‹file›: ‹n› entries
- ‹each entry's first line, verbatim›

Statement: ‹n› on credit · max interest ‹m›
Lint: ‹f› failure(s) in ‹c› class(es) · ‹w› warning(s)
```

- **Name** is the building register's Name for the root (`walkRegister`), else the
  directory's basename. **HEAD** is `git rev-parse --short HEAD` at the root, or `no git`.
- **Verbatim, never re-serialized:** a row is the file's line at `BoardRow.line`; the tail
  is `LedgerEntry.block`; an inbox entry is its first source line. A paraphrase is a defect.
- **Several boards** in one building (n boards per doc, n docs — both are corpus facts):
  one `## Board` block per board, the doc path and heading named; a board with no live row
  prints its count line only. Files paths print relative to the root.
- **The deferred count** is the number of top-level `- ` bullets after the
  `**Deferred (tracked, not lost):**` line up to the next heading or EOF; a board doc
  without the line prints `deferred —`.
- **The baton line** is `classifyBaton` rendered: `Baton — ⬡ · ‹k› summons, ignite ‹ids›`
  · `Baton — the dispatch · …` · `Baton — session · …` · `Baton — none — ‹why›` (the typed
  close) · `Baton — dropped` (holder `prose`). 045 extends this line with shape, type and
  the named session; this charge prints what the parser knows today.
- **Typed absence:** a building with no ledger prints `## Ledger — none`; no register,
  `## Decisions — none`; no inbox file, `## Inbox — none`. A count is never invented.
- **Lint** is `lint([root])` — the form arms, not `--vocab`; the line is `render`'s
  totals in one line. **Statement** is `renderStatement`'s one-liner over the building's
  credits.
- Exit 0 always when the root parses; a root that is not a building exits 2 with one line.
- USAGE and the README gain the command, in the README's voice (one section, ≤ 25 lines).

## Done when:

- [ ] `bun test` green from `doctrine/` — 127 at the lay, plus a `boot` suite: a fixture
      building renders every section; only live rows print; each printed row is
      byte-identical to its source line; the count line's four numbers match the fixture;
      the deferred count matches; a fixture with no ledger and no inbox prints the typed
      absences; **the verbatim law as a test** — every line of the pack that is not a
      heading, a count line, the baton line, the statement or the lint line is a substring
      of some file under the fixture root. Output pasted.
- [ ] `doctrine boot ~/code/agents | wc -c` and `doctrine boot ~/code/stigmergon | wc -c`
      each under **8192** bytes; both packs pasted whole in the Findings.
- [ ] The ratio, in the Findings: pack bytes against the bytes a summons named — `BOARD.md`
      + `DECISIONS.md` + the tail entry — for both buildings.
- [ ] `doctrine lint ~/code/agents` unchanged from the lay (19 `board.cell-cap`, all
      belvedere's) — pasted.
- [ ] `doctrine boot .` from inside `~/code/stigmergon` prints the same pack as the
      absolute root — pasted `diff` empty.

## Out of scope

- `--json`, `--live`, any flag — the pack has one shape.
- The law text (DOCTRINE §11, the summons grammar, the Architect's Orient step, the tender
  kickoff, this repo's `CLAUDE.md`) — the office's; it lands at G4 under a grant, from the
  text below. The Builder touches no file under `canon/`, no charter, no `CLAUDE.md`.
- The batch note's prose, the deferred list's text — the pack counts, never parses them.
- Any building's own files. The room's render (stigmergon).
- Trimming the tail entry to make the size bar — an over-long entry is `ledger.entry-cap`'s
  defect, and the pack prints it whole (G4's ruling (i)).

## The law at the landing — the office's text (⬡✓ 2026-09-08, his word in the room; G4 pastes at the landing)

Amendments, not a D-entry: the ancestor is DOCTRINE §1's two-minute start and formula 17,
served better. Five homes, pasted verbatim by G4 under its grant, one commit, the day the
tool lands. The Builder touches none of them.

1. **DOCTRINE §11**, the Start bullet, whole:
   > **Start:** `CLAUDE.md` (automatic) → **the boot pack** — `doctrine boot ‹root›`: the
   > board's live rows, the ledger tail, the baton, the decision queue, the inbox, the
   > statement and the lint line, derived from the books at every call and never kept
   > (044; birthplace: stigmergon 079-F11 — an Architect summons that named 150 KB of
   > reads, 60 KB of it a board with four live rows) → the master doc sections your summons
   > names → your charge doc → the bulletin, when one exists. Two minutes, productive. The
   > board and the ledger are opened whole to write them, never to orient; a dispatched
   > session boots from its charge doc alone.
2. **`canon/mantles/README.md`**, the interactive summons grammar's fourth line:
   `then boot <root>, read <context docs> and <execute the charge doc | run the board | review the batch>.`
   — and beneath the fence: *Boot (DOCTRINE §11): `doctrine boot ‹root›` is the interactive
   session's first read — the live rows, the tail, the baton, the queue, the inbox, in a
   few kilobytes; the board and the ledger whole are for writing. A dispatched kickoff
   carries no boot: the charge doc is its world.*
3. **`canon/mantles/architect.md`**, the review loop's first step:
   `1. **Orient:** \`doctrine boot ‹root›\` — the live rows, the tail, the baton, the queue, the inbox (DOCTRINE §11); the board and the ledger are opened whole to write them.`
4. **`plans/TENDER.md`**, the read line: *Run `doctrine boot ~/code/agents` (DOCTRINE §11),
   read the batch note pasted below this kickoff and every charge doc the note names;
   `BOARD.md` is opened to write the Status column, never to orient.*
5. **This repo's `CLAUDE.md`**, the read line: *Run `doctrine boot .` and read `MAP.md`
   before any work — the boot pack (DOCTRINE §11) and the master architecture; `BOARD.md`
   holds the work state whole (D78) and is opened to write it.*

Other buildings adopt the `CLAUDE.md` line at their next Architect session (D80's
pattern).

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/044-boot-pack.md to its bar.
```
