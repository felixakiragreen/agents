# 040 — the id respell

**Status:** OPEN — laid 2026-09-01 · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Blessed:** Felix, 2026-09-01 — D80 (⬡✓ in-session); the spec below is D80 built. **Sole
occupant:** nothing else ignites in this building while this runs — it renames files under
every other session's feet.

## Mission

When this lands, the agents building speaks D80 whole: every id in every document — board,
ledger, register, plans, lab, canon, the Log, the rig's docs, the doctrine's own docs — wears
the new form; charge docs and lab dirs are renamed; every link resolves; the parser reads the
new form as its own and the old forms as foreign history; `doctrine migrate` carries the rule
any building can run; lint reads 0 and the suite is green. **Zero stray ids** — his word.

## Inputs — read before working

- [DECISIONS.md](../DECISIONS.md) D80 — the ruling, whole. [STANDARD.md](../canon/work/STANDARD.md)
  §2 (‹nnn›), §7 (the namespace, `:`), §9 (the four new graveyard rows).
  [DOCTRINE.md](../canon/work/DOCTRINE.md) §3 (padding), §4 (ID), §7 (the head's slot).
- `doctrine/src/migrate.ts` — the converter's rule shape and its round-trip law (total,
  line-scoped, never paraphrases). `doctrine/src/grammar.ts` — `isId`, `DECISION_ID`.
- Precedents: [18](18-great-recut.md) (the corpus-wide form migration, history included);
  [C25 — the respell sweep](c25-respell-sweep.md) (the fence method); [C30 — the master-doc
  prose sweep](c30-master-doc-prose.md) (hits adjudicated by hand, exemptions named);
  [C31](c31-doctrine-defects.md) item 3 (the parser reads `‹prefix›-D‹n›` — it keeps reading it).
- The lexicon mirror and the bare-D lint arm are already done (this desk, 2026-09-01) —
  do not re-derive: `CANON_PREFIXES` is `D G F E`, `prefixFails` warns on collisions only.
- **The denominators** (2026-09-01, `belvedere/` excluded — the Builder re-counts before and
  after; a count that moves unexpectedly is a finding):

  | What | Count |
  |---|---|
  | `C‹nn›` tokens · files carrying them | 897 · 76 |
  | lowercase `c‹nn›-` in paths and slugs | 186 |
  | `GA-‹nn›` · `FC-‹n›` | 133 · 14 |
  | findings `‹nn›-F‹n›` (dash) · `C‹nn› F‹n›` (space) | 147 · 19 |
  | `plans/‹id›-…` path mentions · distinct targets | 690 · 141 |
  | `lab/‹id›` path mentions | 304 |
  | ledger heads with an id slot (bare · C · GA) | 59 (34 · 15 · 10) |
  | bare-number prose: `charge/row ‹n›` · `‹nn›'s` · `ignite ‹n›` | 410 · 327 · 71 |
  | files to rename in `plans/` · lab dirs | 39 (+ `g2-c29-merge.md`'s slug) · 6 (08 12 16 17 21 c28) |
  | doctrine fixtures carrying old forms | 20 files — see the fence |
  | `summon/` references | 11 |
  | stigmergon, for the control: `S‹n›` tokens · plans · ledger entries | 977 · 28 · 26 (no S-token above S28) |

## Spec

1. **The rule derives its table from the board.** `doctrine migrate` gains the id respell:
   it reads the building's board(s) and derives old → new for every row id — bare `n`/`nn`
   → `nnn`; `C‹nn›` → `0nn`; `G‹n›` unchanged (G is a kind). The table is printed before
   anything is written; a dry run is the default and `--write` applies. Beyond the board,
   the standard's dead compounds: `GA-‹nn›` → `grand-architect-‹nn›` (two digits, the
   stamp's form); `FC-‹n›` → `distillation candidate ‹n›` (the acronym expanded to its
   concept's living word — 14 hits, each hand-checked). Path forms ride the same table:
   `c‹nn›-` → `0nn-`, `plans/‹nn›-` → `plans/0nn-`, `lab/‹nn›` → `lab/0nn`, `lab/c28` →
   `lab/028`. The rule carries a fixture and a round-trip test like its siblings.
2. **Scope: every tracked text file in the building**, history and voice included (D80, his
   word) — `LEDGER.md` whole, `LOG.md` + `log-archive.md` + `SAPHO.md`, every `plans/` doc
   including landed ones and their kickoff fences, `DECISIONS.md`, `MAP.md`, `BOARD.md`,
   `ISSUES.md`, `canon/` (STANDARD, DOCTRINE, the charters, README, BUILDINGS), `doctrine/`
   (src comments, README, cli, tests), `summon/` (README, `presets.tsv`, the harness), `lab/`.
   **The fence:** `belvedere/` whole — retired, the purge on the deferred list deletes it; its
   B/P ids are its own building's, and agents-side references to them (`belvedere D22`,
   `B10–B12`, `B26 F2`) are foreign historical addresses, untouched. The live wire —
   `canon/CLAUDE.md`, `canon/agents/` — verified id-free 2026-09-01: if a hit appears there,
   file it, never edit. **A fixture keeps the form it exists to exercise:** fixtures that model
   a foreign building's history (`fixtures/worktree/…/bv/c29-harness/`, `fixtures/defects/`,
   `fixtures/vocab/` — its C-collision is the point, C31's `VX-D2` reproduction) keep their
   forms and the parser goes on reading them; fixtures that model THE conforming form
   (`fixtures/conforming/`, `fixtures/kickoff/`, `fixtures/board-file/`) respell to the new
   form. Every fixture's ruling is listed in findings.
3. **Two layers.** *Machine:* every lettered token (`C‹nn›`, `c‹nn›-`, `GA-‹nn›`, `FC-‹n›`),
   every path (`plans/`, `lab/`), every typed slot — board ID cells, ledger head
   parentheticals, `ignite ‹id›`, `charge ‹n›`, `row ‹n›`, `‹id›-F‹n›` and `‹id› F‹n›` → `0nn-F‹n›`.
   *Supervised:* bare-number mentions the machine cannot prove — possessives (`18's`), ranges
   (`0–04`), lists (`06 hexwright · 07 simmy`), "the 18 wave" — the Builder adjudicates each hit
   against the table and its context; every mention left as-is is listed in findings with its
   reason (C30's method). **Form only** — nothing is paraphrased, no sentence is reworded.
4. **Renames via `git mv`:** the 39 `plans/` docs and 6 lab dirs — `01-…` → `001-…`, `c23-…`
   → `023-…`, `lab/c28` → `lab/028`; slugs carrying an old id respell too (`g2-c29-merge.md`
   → `g2-029-merge.md`). The renames ride one commit so history follows; links respell in the
   same landing.
5. **The parser:** `isId` already accepts the padded form — prove it with a test; the ledger
   head reads a name-stamp in the id slot — prove `(grand-architect-21)` and `(mentat-02)`
   parse (the Mentat's precedent); `DECISION_ID` keeps reading `‹prefix›-D‹n›` (bob's history)
   — the tests that call it "the form §7 mandates" are retitled; conforming fixtures move to
   the new form.
6. **The control — a second building:** the dry run on `~/code/stigmergon` prints `S1 → 001`
   … `S28 → 028`, `G1`–`G5` unchanged, and writes nothing. stigmergon's Architect runs it at
   their review — never this charge.

## Done when:

- [ ] `cd doctrine && bun test` — all pass, the count ≥ the pre-charge count, pasted.
- [ ] `bun doctrine/cli.ts lint --vocab ~/code/agents` — the agents building: 0 failure(s),
      0 warning(s), pasted (`agents/belvedere` reports its own and is fenced).
- [ ] The stray sweep is empty outside the named foreign-history fixtures — pasted with its
      hit list: `grep -rnE '\bC[0-9]{2}\b|\bGA-[0-9]{1,2}\b|\bFC-[0-9]\b|\bc[0-9]{2}-|plans/[0-9]{2}-|\blab/c?[0-9]{2}\b' --include='*.md' --include='*.ts' --include='*.zsh' --include='*.exp' --include='*.tsv' --include='*.txt' --exclude-dir=belvedere --exclude-dir=node_modules --exclude-dir=.git .`
- [ ] Every `plans/…\.md` and `lab/…` path mentioned in any tracked `.md` resolves to a file
      or dir — the one-liner and its `0 missing` pasted.
- [ ] `ls plans` pasted: `001-…` through `040-…`, `g1-flow-close.md`, `g2-029-merge.md`, and
      the six non-id docs unchanged.
- [ ] Ledger heads: `grep -cE '^\*\*20.*\((C?[0-9]{1,2}|GA-[0-9]+)\)' LEDGER.md` → 0.
- [ ] The stigmergon dry run pasted — the table, and `0 files written`.
- [ ] The supervised layer's exemption list is in findings, every line with its reason.

## Out of scope

- `belvedere/` — the purge (deferred list) deletes it; git is the archive.
- Other buildings' respells — stigmergon's inbox line is filed; the rest adopt at their next
  Architect session (D78's precedent).
- The `✓ Felix` → `⬡✓` mark respell — deferred, STANDARD "What remains".
- Any rewording. New lint arms. The sync set. The worktree-dedup hole (deferred list).

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved it;
probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7, ~/code/agents/DECISIONS.md (D80),
~/code/agents/canon/work/STANDARD.md §7 and execute the charge at
~/code/agents/plans/040-id-respell.md.
```
