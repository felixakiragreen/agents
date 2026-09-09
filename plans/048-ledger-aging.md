# 048 — the ledger's aging

**Status:** OPEN — laid 2026-09-08 · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** Felix, 2026-09-08, in the room: the design (his question at the desk — *"what's our plan for auto-trimming/pruning historical files that get too long?"*).

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

- [ ] `bun test` green from `doctrine/` with fixtures: a ledger of 25 entries prunes to 20 + an archive of 5, verbatim (byte compare); the pair parses to the same 25 entries in the same order as the unpruned original; the tail and baton unchanged; a ledger of 20 writes nothing; a second prune of the pruned pair writes nothing; the archive anchors no building; `guardRegressions` over before/after totals is empty; `decisions.size` fires on a 31 KB fixture register and not on a 29 KB one. Output pasted.
- [ ] `doctrine prune ~/code/agents` dry run pasted; `--write` run; `doctrine lint --guard HEAD~1 ~/code/agents` green — pasted (the guard is the proof the aging is not a loss).
- [ ] `doctrine boot ~/code/agents` after the prune: the same tail entry as before — pasted diff of the `## Ledger` block, empty.
- [ ] `doctrine prune ~/code/stigmergon` dry run pasted as the control (nothing written — that building's Architect runs it).
- [ ] `doctrine lint ~/code/stigmergon` shows the `decisions.size` warn with its excerpt — pasted (43 KB at the lay).
- [ ] README: a `prune` section in its voice, ≤ 20 lines.

## Out of scope

- Aging any other file — the board's rows (ids must stay addressable; boot fixes the read), the register (the purge is a blessed act), `docs/` (the split rule is the building's), the Log and SAPHO (their own physics).
- A per-building count — one constant; a building that wants another files the case.
- Any law text — the office's, pasted at G4 under the grant.
- Deleting a byte: the ledger relocates, never dies.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/048-ledger-aging.md to its bar.
```
