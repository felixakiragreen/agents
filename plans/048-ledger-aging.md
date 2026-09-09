# 048 — the ledger's aging

**Status:** LANDED 2026-09-09 — the bar met whole, evidence in the checklist; findings F1–F4 · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** Felix, 2026-09-08, in the room: the design (his question at the desk — *"what's our plan for auto-trimming/pruning historical files that get too long?"*).

## Mission

The ledger is the one file whose growth is by design — append-only, the record of everything — and the one file the retention law exempts, because sessions read its tail. Its bytes are unbounded anyway: 210 KB here, 278 KB at stigmergon, and Felix opens them. The cure is one file over and two weeks proven: the Log and SAPHO age their oldest entries out to an archive file, verbatim, append-only, past a fixed count (⬡ 2026-08-29). This charge canonizes that mechanism for the ledger as a derived act — `doctrine prune ‹root›` — run at the prune check the law already names (D78), with the parser reading both files so nothing is lost, nothing decreases, and the tail is where it was. Beside it, one nudge: a register past 30 KB warns that a purge is due.

Ancestors: the Log's and SAPHO's aging physics (`LOG.md` header, `SAPHO.md` header — six entries, the rest one file over, forever), D78 (the prune check at every review and gate; git is the archive — but the ledger is the record, so it relocates rather than dies), 041 (the caps made enforceable), the 079 desk (*keep law files under ~30 KB*).

## Inputs — read before working

- DOCTRINE §3 (the retention law and the ledger's exemption), §7 (the ledger — the head grammar, the tail law, `---` between entries), §8 (the purge — the register's own retention); `LOG.md` and `SAPHO.md` headers (the aging law as written) and `log-archive.md`, `sapho-archive.md` (the archive shape: a header naming the law, then the entries verbatim, oldest first).
- `doctrine/src/parse.ts` (`parseLedger`, `blocks`, the HEAD grammar); `doctrine/src/building.ts` (`discover` — how `LEDGER.md` anchors a building; `Building.ledgerEntries`, the guard's gauge; `files.ledger`); `doctrine/src/lint.ts` (`guardRegressions` — the entity-count net that must not fire on an aging); `doctrine/cli.ts`.
- Known: `LIMITS` in `building.ts` is where the count lives; `ENTRY_CAP` and `CELL_CAP` in `grammar.ts` are the caps' precedent.

## Spec

**`doctrine prune ‹root›`** — dry run by default, `--write` to touch a byte. It moves every ledger entry older than the last **`LIMITS.ledgerTail = 20`** (a constant, his to tune) from `LEDGER.md` into **`ledger-archive.md`** beside it: verbatim, in order, oldest first, `---`-separated as they stood; the archive is created at the first aging-out with a three-line header naming this law and the doctrine section, and only ever appended. The ledger's own header block stays; the first kept entry follows it after one `---`. A ledger at or under the count writes nothing — the fixed point. The dry run prints what would move: count, the first and last dated heads, the bytes.

**The parser reads both.** `ledger-archive.md` is the ledger's archive, never a second ledger: discovery binds it to its `LEDGER.md` (same directory) and it can anchor no building of its own. `parseLedger` over the pair yields one sequence — archive first — so `Building.ledgerEntries` counts both and `lint --guard`'s gauge never reads an aging as a decrease; `ledgerTail` and the baton come from `LEDGER.md` alone, as today. The round-trip law: the entries parsed from the pair before a prune equal those after, one for one.

**The register warn.** `decisions.size` (warn, never fail): a `DECISIONS.md` over 30 KB on disk — the excerpt is the size and the line count, the reason names §8's purge. A constant beside the caps.

**The law at the landing** — the office's text, pasted by G4 under its grant on the mark (proposed — pending ⬡✓ on the text; the design ⬡✓ 2026-09-08):

1. **DOCTRINE §3**, the retention bullet, appended: *The ledger ages (048): `LEDGER.md` keeps its last twenty entries; older entries move, verbatim and in order, to `ledger-archive.md` beside it — append-only, created at the first aging-out — by `doctrine prune` at the prune check. The parser reads both, so counts never drop and the tail is where it was; the read stays bounded by the tail law, the file by this. Ancestor: the Log's and SAPHO's aging (⬡ 2026-08-29); birthplace: his question at the 2026-09-08 desk, 278 KB at stigmergon.*
2. **DOCTRINE §7**, after the acceptance test: *One record, two files: the last twenty entries live here, the rest in `ledger-archive.md`, verbatim (§3, the aging).*
3. **DOCTRINE §8**, appended to the purge bullet: *A register past 30 KB warns at lint (`decisions.size`) — a purge is due.*
4. **`canon/mantles/architect.md`**, the review loop's fourth step: `4. **Reconcile the board:** statuses, dependencies, staffing; the prune check (D78) — \`doctrine prune --write\`, then \`doctrine lint\` before claiming it reconciled.`

## Done when:

- [x] `bun test` green from `doctrine/` with fixtures: a ledger of 25 entries prunes to 20 + an archive of 5, verbatim (byte compare); the pair parses to the same 25 entries in the same order as the unpruned original; the tail and baton unchanged; a ledger of 20 writes nothing; a second prune of the pruned pair writes nothing; the archive anchors no building; `guardRegressions` over before/after totals is empty; `decisions.size` fires on a 31 KB fixture register and not on a 29 KB one. Output pasted. **Met at `caa57ca`** (HEAD when it ran; nothing under `doctrine/` moved after it) — 175 → 188 tests, thirteen in `doctrine/test/prune.test.ts` over `doctrine/fixtures/prune/`: `before/LEDGER.md` (25 entries), `after/LEDGER.md` + `after/ledger-archive.md` (the pair, hand-authored and byte-compared against the tool's output), `orphan/ledger-archive.md` (an archive with no ledger beside it). Every clause of the bar is one test, plus two the bar implies: an existing archive is appended to and its bytes lead the new ones, and the ledger's own fails are empty on the pruned pair.

```
bun test v1.3.10 (30e609e0)

 188 pass
 0 fail
 786 expect() calls
Ran 188 tests across 6 files. [295.00ms]
```

- [x] `doctrine prune ~/code/agents` dry run pasted; `--write` run; `doctrine lint --guard HEAD~1 ~/code/agents` green — pasted (the guard is the proof the aging is not a loss). **Met at `a963302`** — 99 entries and 197,683 bytes relocated, `LEDGER.md` 218,625 → 20,942, and the guard's `HEAD~1` is the tree before the write.

```
~/code/agents/LEDGER.md — 99 entr(ies) age out to ~/code/agents/ledger-archive.md (new), keeping the last 20:
  first  **2026-08-02 · Grand Architect · unrecorded** — Laid the keel: GENESIS.md (composition law, five mantles, deployment map
  last   **2026-09-01 · Builder · opus-high (040)** — **the id respell, landed.** `doctrine migrate` gained the rule: it derives
  bytes  197,683 move · LEDGER.md 218,625 → 20,942

Dry run — 0 files written. Re-run with --write to apply.

[--write]
Wrote ~/code/agents/ledger-archive.md and ~/code/agents/LEDGER.md — the record relocated, not one byte deleted.

[lint --guard HEAD~1 — the totals are the pre-prune lint's, line for line]
=== TOTALS
  3 buildings · 5/5 board docs yielded a board · 5 boards · 124 rows · 124 fully typed (100%)
  2/2 ledgers parsed a tail (200 entries) · 1 fireable baton(s) · 116 kickoffs in 121 work docs · 26 decisions (queue 0) · 0 inbox entries
  0 on credit · max interest 0
  0 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
  20 failure(s) in 2 class(es) · 171 warning(s) in 1 class(es)

guard ok — no entity total decreased vs HEAD~1
```

- [x] `doctrine boot ~/code/agents` after the prune: the same tail entry as before — pasted diff of the `## Ledger` block, empty. **Met.** The `## Ledger` block diffs empty, and the diff of the WHOLE pack is one line: the HEAD sha it was drawn at.

```
$ diff ledger-before.txt ledger-after.txt ; echo "diff exit: $?"
diff exit: 0

$ head -1 ledger-after.txt
## Ledger — LEDGER.md: 119 entries

$ diff boot-before.txt boot-after.txt
1c1
< # agents — boot · ~/code/agents · HEAD 0d21f48 · 2026-09-09
---
> # agents — boot · ~/code/agents · HEAD a963302 · 2026-09-09
```

- [x] `doctrine prune ~/code/stigmergon` dry run pasted as the control (nothing written — that building's Architect runs it). **Met** — 87 entries would move, 226,698 bytes; `ledger-archive.md` does not exist there after the run.

```
~/code/stigmergon/LEDGER.md — 87 entr(ies) age out to ~/code/stigmergon/ledger-archive.md (new), keeping the last 20:
  first  **2026-08-31 · Architect · fable-max** — *(the founding; Belvedere's close-out
  last   **2026-09-07 · Architect · fable-high (G16)** — **G16 LANDED — PASSED: the panes
  bytes  226,698 move · LEDGER.md 278,384 → 51,686

Dry run — 0 files written. Re-run with --write to apply.

$ ls ~/code/stigmergon/ledger-archive.md
ls: cannot access '/Users/felix/code/stigmergon/ledger-archive.md': No such file or directory
```

- [x] `doctrine lint ~/code/stigmergon` shows the `decisions.size` warn with its excerpt — pasted (43 KB at the lay). **Met** — 41.7 KiB, which is the lay's 43 KB in the other unit (F3).

```
      [1× warn] decisions.size — a decision register past 30 KB is due a purge (DOCTRINE §8) — an entry fully distilled into its canon home is killed whole, and git holds every byte
           ~/code/stigmergon/DECISIONS.md:1: 41.7 KB in 578 lines

=== WARNING CLASSES (reported, never auto-fixed — they do not move the exit code)
   102  ledger.entry-cap
     1  decisions.size
  0 failure(s) in 0 class(es) · 103 warning(s) in 2 class(es)
```

- [x] README: a `prune` section in its voice, ≤ 20 lines. **Met** — `doctrine/README.md`, the section between the caps and Parser-as-lint: nine lines (a heading and four paragraphs, prose unwrapped per D88), plus the command list's line and `src/prune.ts` in the module run.

## Out of scope

- Aging any other file — the board's rows (ids must stay addressable; boot fixes the read), the register (the purge is a blessed act), `docs/` (the split rule is the building's), the Log and SAPHO (their own physics).
- A per-building count — one constant; a building that wants another files the case.
- Any law text — the office's, pasted at G4 under the grant.
- Deleting a byte: the ledger relocates, never dies.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved it; probes ship with a control)*

**F1 — `--live` read a ledger fail by its LINE alone, and a second file breaks that.** `liveFails` kept a ledger fail when `f.line === b.ledgerTail.line`, which was safe only while a building had exactly one ledger file. The archive files `ledger` fails too, and its line 1..n overlap the ledger's, so an aged-out entry sitting at the tail's line number would have been reported as the tail's defect — a fail the reader cannot place. The arm now compares the file as well (`doctrine/src/lint.ts`, `liveFails`). Caught by construction, before it could fire, and the live case is one line wide: after the run this repo's tail sits at `LEDGER.md:110`, and `ledger-archive.md` carries an entry opening at line 109 — a fail anywhere in it would have been read as the tail's.

**F2 — the archive is out of two fences by construction, and inside `migrate`'s by accident.** `citations`' fence is `canon/` · `docs/` · `MAP.md` (`onFence`), and the vocabulary arm's law surfaces are a building's own master doc, CLAUDE.md, boards and live work docs — so neither arm can reach `ledger-archive.md`, which is correct: history keeps its numbers and its words. But `migrate` walks every tracked `.md` for the respell and the unwrap, while its five ledger STRUCTURAL rules are keyed `files: /^LEDGER\.md$/i` — so an aged-out entry is reachable by an id respell and a reflow, and unreachable by a future grammar repair. That is exactly `log-archive.md`'s standing today, so the aging changes nothing, and it is out of this charge's fence (no clause asks `migrate` to read the pair). Filed for the Architect: when a grammar change next needs the whole record, the ledger rules want the pair, not the file.

**F3 — the register's size, in the unit the tool prints.** The lay measured stigmergon's register at 43 KB (42,712 bytes ÷ 1000); `decisions.size` prints KiB, so the same file reads 41.7 KB. One file, two units, no contradiction — the cap is `30 << 10` bytes, beside `CELL_CAP` and `ENTRY_CAP`, which are counts and carry no unit at all.

**F4 — the lint's warnings moved house with the entries, and the totals prove it is only a move.** 171 `ledger.entry-cap` warnings stood before the run; 171 stand after, most of them now stamped `~/code/agents/ledger-archive.md` instead of `LEDGER.md`. The guard's report is the evidence that this is relocation and not loss: every entity total, failure class and warning class is identical across the write. A reader who greps the lint for `LEDGER.md` will now see fewer lines than the city holds — the archive is where the rest are, which is what "one record, two files" costs.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/048-ledger-aging.md to its bar.
```
