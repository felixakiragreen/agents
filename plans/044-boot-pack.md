# 044 — the boot pack

**Status:** LANDED 2026-09-08 — findings F1–F6 · **Depends on:** — · **Staffing:** Builder · opus-high ·
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

*(evidence run at `eb36cf0`, HEAD and clean — `git status --porcelain` empty at the suite run)*

- [x] `bun test` green from `doctrine/` — 127 at the lay, plus a `boot` suite: a fixture
      building renders every section; only live rows print; each printed row is
      byte-identical to its source line; the count line's four numbers match the fixture;
      the deferred count matches; a fixture with no ledger and no inbox prints the typed
      absences; **the verbatim law as a test** — every line of the pack that is not a
      heading, a count line, the baton line, the statement or the lint line is a substring
      of some file under the fixture root. Output pasted.

      ```
      $ cd doctrine && bun test
      bun test v1.3.10 (30e609e0)

       139 pass
       0 fail
       640 expect() calls
      Ran 139 tests across 4 files. [265.00ms]
      ```

      The twelve are `doctrine/test/boot.test.ts` — every section in order · the title's four
      slots · only live rows (`002, 003, 005, G2`) · each row byte-identical to `BOARD.md`'s
      line · both count lines including `deferred 3` · one board per doc names the file alone
      · the tail verbatim + `Baton — ⬡ · ignite 003` · the queue's two entries · an inbox
      entry as its own line · the three typed absences · a root with no artifact refused ·
      the verbatim law. The law's alarm proves itself: one authored line spliced into the
      render (`out.push('the board is basically fine, trust me')`) reds exactly that test —
      `verbatim: false` — and nothing else; reverted, 12/12 green.
- [x] `doctrine boot ~/code/agents | wc -c` and `doctrine boot ~/code/stigmergon | wc -c`
      each under **8192** bytes; both packs pasted whole in the Findings.

      ```
      $ doctrine boot ~/code/agents | wc -c
          4606
      $ doctrine boot ~/code/stigmergon | wc -c
          4904
      ```

      Re-measured at `97ed8d2`, this session's ledger entry standing in place of the office's
      longer one: agents **3,280 B**, stigmergon 4,904 B. The pack tracks the books — the
      pasted packs below are the ones drawn at `eb36cf0`.
- [x] The ratio, in the Findings: pack bytes against the bytes a summons named — `BOARD.md`
      + `DECISIONS.md` + the tail entry — for both buildings. **F1.**
- [x] `doctrine lint ~/code/agents` unchanged from the lay (19 `board.cell-cap`, all
      belvedere's) — pasted.

      ```
      $ doctrine lint ~/code/agents
      FAIL  agents/belvedere       —  … [10×] board.cell-cap  (belvedere/README.md:274, :275, :276, … 7 more)
      FAIL  agents/belvedere/v3    —  … [ 9×] board.cell-cap  (belvedere/v3/README.md:60, :61, :62, … 6 more)

      === FAILURE CLASSES
          19  board.cell-cap

      === WARNING CLASSES (reported, never auto-fixed — they do not move the exit code)
         169  ledger.entry-cap

      === TOTALS
        3 buildings · 5/5 board docs yielded a board · 5 boards · 124 rows · 124 fully typed (100%)
        2/2 ledgers parsed a tail (194 entries) · 0 fireable baton(s) · 118 kickoffs in 121 work docs · 26 decisions (queue 0) · 0 inbox entries
        0 on credit · max interest 0
        0 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
        19 failure(s) in 1 class(es) · 169 warning(s) in 1 class(es)
      ```

      Byte-identical to the lay's run (`3284d58`): 19 failures in one class, 169 warnings,
      the same totals line. The two buildings named are belvedere's, all 19.
- [x] `doctrine boot .` from inside `~/code/stigmergon` prints the same pack as the
      absolute root — pasted `diff` empty.

      ```
      $ cd ~/code/stigmergon && doctrine boot . > /tmp/dot.txt && doctrine boot ~/code/stigmergon > /tmp/abs.txt
      $ diff /tmp/dot.txt /tmp/abs.txt ; echo "diff exit=$?"
      diff exit=0
      ```

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
   read the batch's gate doc named below this kickoff — its Mission is the batch note — and every charge doc it names;
   `BOARD.md` is opened to write the Status column, never to orient.*
5. **This repo's `CLAUDE.md`**, the read line: *Run `doctrine boot .` and read `MAP.md`
   before any work — the boot pack (DOCTRINE §11) and the master architecture; `BOARD.md`
   holds the work state whole (D78) and is opened to write it.*

Other buildings adopt the `CLAUDE.md` line at their next Architect session (D80's
pattern).

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved
it; probes ship with a control)*

**F1 — The measure: a pack against the files a summons named.** Both packs come in under a third of the bar's 8192 bytes, and the ratio is the charge's case, measured:

| building | pack | `BOARD.md` | `DECISIONS.md` | tail entry | named, total | pack ÷ named |
|---|---|---|---|---|---|---|
| agents | 4,606 B | 22,506 B | 19,055 B | 2,161 B | 43,722 B | **10.5% — 9.5× less** |
| stigmergon | 4,904 B | 60,307 B | 42,712 B | 3,071 B | 106,090 B | **4.6% — 21.6× less** |

The ratio improves as the campaign grows, which is the whole point: the pack tracks the live set (agents 5 live rows of 53, stigmergon 4 of 108) while the board tracks the campaign — stigmergon's board is 60 KB read for four workable lines. The pack's own bulk is the ledger tail (2,161 B of agents' 4,606; 3,071 B of stigmergon's 4,904), and both tails are `ledger.entry-cap` warnings, not the pack's defect — the charge's ruling (i) holds: the pack prints the entry whole.

**F2 — The verbatim law as a test, and the one line built from two slices.** The bar asks that every non-exempt line be *a substring of some file*; the spec's decision-queue line is `- ‹id› — ‹title›`, two verbatim slices joined by an em dash, and that is a substring of no file. The two clauses cannot both hold as written. The test holds the queue line to the law **twice — once per slice** (the id, then the title, each checked against the corpus) and applies the substring law unchanged to every other line. Stronger than the exemption it replaces, not weaker: nothing in the pack is exempt from being bytes from a file, and the printed shape stays the spec's. The alarm proves itself under mutation (Done-when 1).

**F3 — The refusal had no trigger, so it was given one.** The spec's `exit 2` for "a root that is not a building" was unreachable as written: `parse(root)` passes the root as its own **extra anchor**, so every existing directory is a building to it and `parse` never throws — `/etc` and an empty directory both render. The refusal implemented is the register's own test for the same thing (`register.empty`, D79: *a registered building whose walk finds no artifact*): no board, no ledger, no decision register and no inbox → one line, exit 2. What still renders is a directory that genuinely carries books: `doctrine boot /tmp` prints four boards, because four session scratchpads under `/tmp` hold board snapshots. That is the anchor law being honest, not the pack being wrong.

**F4 — This repo's own baton reads `no instrument`, and it is right.** `grand-architect-24`'s tail hands `⬡ → single — ignite the tender: ^G n s m ⏎ …` — a hand instruction, not an `ignite ‹charge-id›` — so the parser reads a written holder and zero fireable instruments, and the pack says exactly that. The line is honest and slightly deaf: the baton *is* single-shaped and *does* name an action. That is 045's charge precisely (`Baton.shape` · `type` · `named`), and the pack is now a second reader waiting on those fields. Nothing fixed here; the evidence is filed for G4.

**F5 — Two board facts the pack surfaced, both beyond the fence, neither touched.** (i) `canon/work/DOCTRINE.md` §4's example table parses as a board — five canonical columns, zero rows — so the pack prints `## Board — canon/work/DOCTRINE.md: 0 charges · …`. Correct per the spec (a board with no live row prints its count line only) and per D45 (any table that staffs sessions is a board), but it means the law book carries a board in every count this repo takes. (ii) `plans/018-great-recut.md` — LANDED 2026-08-29 — still carries **`18c` BLOCKED**, a live row inside a spent charge doc, and the pack prints it beside the campaign's real work. Both are the office's call: the example table wants fencing (a non-canonical header, or a shown-not-parsed form), and 18c wants a verdict on the board or a strike in the doc.

**F6 — The Name is read from the register's rows, never from a city walk.** The spec names `walkRegister` for the building's Name; `walkRegister` *parses every building in the city* to answer it, and a two-minute-start tool cannot pay that. `readRegister()` returns the same rows (Name · Kind · Root, dead roots reported) without walking, and the Name matches on the resolved Root — identical output, no walk. The pack's measured cost is two walks of its own root (`parse(root)` for the books, `lint([root])` for the alarm line): 0.16 s wall for `~/code/agents`, 0.11 s for `~/code/stigmergon`.

**The packs, whole.**

`doctrine boot ~/code/agents` — 4,606 bytes, drawn at `eb36cf0`:

```
# agents — boot · ~/code/agents · HEAD eb36cf0 · 2026-09-08

## Board — BOARD.md: 53 charges · 5 live · 43 landed · 5 killed · deferred 9
| ID | Work | Depends on | Staffing | Status |
| 045 | [the baton's fields](plans/045-baton-fields.md) — `Baton.shape` · `recommendation` · `type` · `named` typed on the parser; `boot` and the docket read them; a fork with no recommendation lints | 044 | Builder · opus-high | OPEN — laid 2026-09-08 |
| 046 | [the lint gaps](plans/046-lint-gaps.md) — `board.gate-kickoff`; the kickoff arm reads the marked fence; an explicit root keeps its own ledger (039-F5's hole, simmy G21's case) | — | Builder · opus-high | OPEN — laid 2026-09-08 |
| 047 | [the unwrap](plans/047-unwrap.md) — D88 built: `doctrine migrate` joins a paragraph's hard-wrapped lines; the word law and the fixed point asserted; run over agents whole, `--summary` for the reader | — | Builder · opus-high | OPEN — laid 2026-09-08 |
| 048 | [the ledger's aging](plans/048-ledger-aging.md) — `doctrine prune`: entries past the last twenty move verbatim to `ledger-archive.md`; the parser reads both; a register past 30 KB warns | — | Builder · opus-high | OPEN — laid 2026-09-08 |
| G4 | [Review gate — the parser's second opening](plans/g4-parser-review.md) — 044 · 045 · 046 · 047 · 048 verified against their bars; the prune check; the blessed law pasted under its grant; three rulings pre-chewed; the baton to ⬡ | 044; 045; 046; 047; 048 | Architect · fable-high | OPEN — laid 2026-09-08 |

## Board — canon/work/DOCTRINE.md: 0 charges · 0 live · 0 landed · 0 killed · deferred —

## Board — plans/018-great-recut.md: 8 charges · 1 live · 7 landed · 0 killed · deferred —
| ID | Work | Depends on | Staffing | Status |
| 18c | whiteboardy — house-format ledger ×103, GENESIS + 6 sub-boards, the m3-shells:670 unescaped pipe | — | Architect · opus-high | BLOCKED (2026-08-26) — board half landed (166 → 149; six rows recovered from invisibility); ledger half refused on two `migrate` defects, 28 board cells on Depends-on resolution scope. Findings below; commits `3575630`/`b82b089`/`8a39750`/`3b9a299` |

## Ledger — LEDGER.md: 113 entries
**2026-09-08 · Grand Architect · fable-max (grand-architect-24)** — The inbox swept whole and cleared: twenty entries — seventeen distilled or laid, one deferred at his word (the MEL: no per-item dates; the deferral's horizon owed, on the deferred list), two rejected as homed (the harness poller specifics are stigmergon's coda; "charters are contracts" is 028-F28). Landed at the desk on his blessing: sovereign → **Summoner** across canon, history keeping its word; `sitting` un-killed as the design session; `bench`; the aphantasia law and D88's soft-wrap line on the live wire (`sync/check` green); the Radiant registered, the Mentat owning it; the Fixer's summons carries the door; the coda's lint line; the specimen; one bulletin per batch; the worktree base; D83's hold dead; D80's document fence; D86 homed at G6's citation (DOCTRINE §3 · §4 · §5 · §10, builder, architect, TENDER); D87 killed — the week ran it without the law (agents 19 commits, stigmergon 645). simmy's `migrate --table` landing accepted, suite 127. The Mentat's two entries above respelled to form. Laid the parser's second opening — 044 the boot pack · 045 the baton's fields · 046 the lint gaps · 047 the unwrap · 048 the ledger's aging → G4 — serial, tender-tended, un-ignited; the note rides G4's doc (stigmergon D40, adopted at his word as the session closed); the boot law's text ⬡✓ in 044, pasted at G4 under its grant. Lint: 19 `board.cell-cap`, belvedere's only. Decided: D88 (⬡✓ 2026-09-08); D87 killed; D80, D83, D86 amended; D78 amended ⬡✓ canon-wide — the batch note rides its review gate (stigmergon D40, then here at his word). Next: the batch — batoned below.

Baton — ⬡ → single — ignite the tender: `^G n s m ⏎` opens a bare sonnet-medium session; its first prompt is `plans/TENDER.md`'s fence, then one line naming `plans/g4-parser-review.md` — its Mission is the batch note. It runs 044 → 045 → 046 → 047 → 048 → G4 and pauses only at escalations; G4's close comes to you. Behind it, for the office's next desk: verify G4, rule the deferral's horizon, and extend 045's type table from its census.
Baton — ⬡ · no instrument

## Decisions — DECISIONS.md: 11 entries · queue 0

## Inbox — ISSUES.md: 0 entries

Statement: 0 on credit · max interest 0
Lint: 19 failure(s) in 1 class(es) · 169 warning(s)
```

`doctrine boot ~/code/stigmergon` — 4,904 bytes, stigmergon at `88ebc7a`:

```
# stigmergon — boot · ~/code/stigmergon · HEAD 88ebc7a · 2026-09-08

## Board — BOARD.md: 108 charges · 4 live · 104 landed · 0 killed · deferred 49
| ID | Work | Depends on | Staffing | Status |
| G22 | [His pass of the summons](plans/G22-summons-pass.md) — ⌃G at a space, the keys, the kickoff both ways, `y`, one real fire at his hand, the rail, the usage line; his page — the phase pays on it (D7) | G21 | ⬡-gate | OPEN — laid 2026-09-08 at the 079 sitting; ignitable — G21 LANDED |
| 084 | [The load on the receipt](plans/084-load-receipt.md) — a capped row carries the one-minute load it was killed under; the receipt carries `load: { before, after }`; the block's last line says it; the walls stand (ruled at G21 on two tables) | — | Builder · sonnet-high | OPEN — laid 2026-09-08 at G21; tender-11, behind G22 or beside it at his word |
| 085 | [The turn's boundary on a Task-spawning turn](plans/085-turn-boundary.md) — 051-F3 measured at 080-F4: which line marks the boundary, what `tail()` does today, what the room reads meanwhile; off the two committed streams, zero ignitions | — | Digger · opus-high | OPEN — laid 2026-09-08 at G21; tender-11 |
| G23 | [Review gate — the load, and the turn's boundary](plans/G23-harness-hygiene.md) — 084, 085 verified, the landing run ×2 with the barrage at the gate's hand, board reconciled; **the batch note is this doc** (D40) | 084, 085 | Architect · fable-high | OPEN — laid 2026-09-08 at G21 |

## Ledger — LEDGER.md: 107 entries
**2026-09-08 · Architect · fable-high (G21)** — **G21 LANDED — PASSED: the
silent subagent and the summons verified.** Five landings checked against their
`Done when:` and the tree — 078's `forgetSilent` and its control, 080's eleven
runs and $0.3882, 081's name and `Options.session` and the mid-fire drill, 082's
eleven red controls and the proving read off his own rig (`log/state` = `F ·
haiku · low · 1`, `fixer-stigmergon-05` on the lineage), 083's ten controls and
the ignite beside copy; the batch spent $0.4157 / 13 ignitions of ≤ $4 / 15.
The gate's own pair: `bun gates.ts --barrage` ×2 at `a933981`, **78 gates ALL
GREEN ×2**, the barrage whole in both (1000 · 50 · 9/9), both receipts `dirty:
false` at HEAD (`1788908887-` and `1788909202-a9339818bab0.json`), load 3.8 →
19.0 → 19.1. The inbox swept, four ruled (findings F2); sixteen snags ruled, the
10:46 one paired. **Changed:** `plans/G21-silent-subagent.md` (the landing
record), `BOARD.md` (G21 landed; 084/085/G23 laid; two deferred entries
promoted, one added), `MAP.md` §5 (a control script is evidence at the sha of its
`.out`), `ISSUES.md` (cleared), `plans/084-load-receipt.md`,
`plans/085-turn-boundary.md`, `plans/G23-harness-hygiene.md` (new); this
ledger's 082 head respelled `(082, the proving)` → `(082)`, the annotation into the
body (DOCTRINE §7's head law — `doctrine lint`'s `ledger.row`, form not meaning);
the agents inbox (one filing: `kickoff.summons` reds a quoted one-line prompt
inside 080's Findings as if it were the doc's kickoff — canon's parser, not this
building's fence). `doctrine lint`: 0 failures of this building's, 108 rows typed.
**Decided:** nothing minted — four rulings on recorded law, each cited in G21-F2:
the control-script law distilled into MAP §5 (016-F5 + DOCTRINE §6); the
reader's `rewound` deferred with rotation (hive.md §3); 076-F5's pre-ruling
converted to 084 on its trigger, the walls standing on the two tables; 051-F3
promoted to 085 as a Digger at zero ignitions (D85). **Next:**
**Baton — ⬡ → single —** pass **G22**, his pass of the summons
(`plans/G22-summons-pass.md`, the steps in his words). What he touches: **⌃G at stigmergon** — the panel on his last fire, the
keys, the kickoff both ways, `y` in a terminal · **Enter, armed** — one Fixer at
haiku into `lab/082/scratch/` (082's budget has one fire left), the row born,
his terminal's Ctrl-G opening on it · **the rail** — ignite beside copy on an
open docket row, and the usage line under the account row. The yellow queue
behind it, his to rule at the pass: the button's word (*ignite* · *fire*), the
refusals' and flashes' copy, the panel's width, whether `⎋⎋` clears the draft,
the usage line's columns, the record's `keys` spelling for a room fire. Ordered
behind G22: **tender-11** — `plans/TENDER.md`'s fence plus one line naming
`plans/G23-harness-hygiene.md` (084 → 085 → G23); both tree-only, so beside his
pass at his word (072's precedent) — recommendation: **after**, the pass is
short and the machine his.
Baton — ⬡ · no instrument

## Decisions — DECISIONS.md: 49 entries · queue 0

## Inbox — ISSUES.md: 1 entries
- 2026-09-08 · tender-10 · G21's agent reported LANDED (baton to ⬡ → pass G22)

Statement: 0 on credit · max interest 0
Lint: 1 failure(s) in 1 class(es) · 102 warning(s)
```

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/044-boot-pack.md to its bar.
```
