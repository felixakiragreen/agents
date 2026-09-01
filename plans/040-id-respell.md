# 040 — the id respell

**Status:** LANDED 2026-09-01 — ignited 2026-09-01, laid 2026-09-01 · **Depends on:** — · **Staffing:** Builder · opus-high ·
**Blessed:** Felix, 2026-09-01 — D80 and D81 (⬡✓ in-session); the spec below is D80 built,
and D81's first act. **Sole
occupant:** nothing else ignites in this building while this runs — it renames files under
every other session's feet.

## Mission

When this lands, the agents building speaks D80 whole: every id in every document — board,
ledger, register, plans, lab, canon, the Log, the rig's docs, the doctrine's own docs — wears
the new form; charge docs and lab dirs are renamed; every link resolves; the parser reads the
new form as its own and the old forms as foreign history; `doctrine migrate` carries the rule
any building can run; lint reads 0 and the suite is green. **Zero stray ids** — his word.

## Inputs — read before working

- [DECISIONS.md](../DECISIONS.md) D80 — the ruling, whole — and D81, the currency law:
  history is respelled, never rewritten; this charge is its first act. [STANDARD.md](../canon/work/STANDARD.md)
  §2 (‹nnn›), §7 (the namespace, `:`), §9 (the four new graveyard rows).
  [DOCTRINE.md](../canon/work/DOCTRINE.md) §3 (padding), §4 (ID), §7 (the head's slot).
- `doctrine/src/migrate.ts` — the converter's rule shape and its round-trip law (total,
  line-scoped, never paraphrases). `doctrine/src/grammar.ts` — `isId`, `DECISION_ID`.
- Precedents: [18](018-great-recut.md) (the corpus-wide form migration, history included);
  [025 — the respell sweep](025-respell-sweep.md) (the fence method); [030 — the master-doc
  prose sweep](030-master-doc-prose.md) (hits adjudicated by hand, exemptions named);
  [031](031-doctrine-defects.md) item 3 (the parser reads `‹prefix›-D‹n›` — it keeps reading it).
- The lexicon mirror and the bare-D lint arm are already done (this desk, 2026-09-01) —
  do not re-derive: `CANON_PREFIXES` is `D G F E`, `prefixFails` warns on collisions only.
- **The denominators** (2026-09-01, `belvedere/` excluded — the Builder re-counts before and
  after; a count that moves unexpectedly is a finding):

  | What | Count |
  |---|---|
  | `C‹nn›` tokens · files carrying them | 897 · 76 |
  | lowercase `c‹nn›-` in paths and slugs | 186 |
  | `GA-‹nn›` · `FC-‹n›` | 133 · 14 |
  | `✓ Felix` marks · files (6 of them in `doctrine/`, where the historical reading lives) | 185 · 30 |
  | findings `‹nn›-F‹n›` (dash) · `C‹nn› F‹n›` (space) | 147 · 19 |
  | `plans/‹id›-…` path mentions · distinct targets | 690 · 141 |
  | `lab/‹id›` path mentions | 304 |
  | ledger heads with an id slot (bare · C · GA) | 59 (34 · 15 · 10) |
  | bare-number prose: `charge/row ‹n›` · `‹nn›'s` · `ignite ‹n›` | 410 · 327 · 71 |
  | files to rename in `plans/` · lab dirs | 39 (+ `g2-029-merge.md`'s slug) · 6 (08 12 16 17 21 028) |
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
   concept's living word — 14 hits, each hand-checked); `✓ Felix` → `⬡✓` (D81's first
   act — `BLESSED_MARK` reads both forever, the converter emits only the new, and the date
   behind the mark stays where it stands). Path forms ride the same table:
   `c‹nn›-` → `0nn-`, `plans/‹nn›-` → `plans/0nn-`, `lab/‹nn›` → `lab/0nn`, `lab/028` →
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
   a foreign building's history (`fixtures/worktree/…/bv/029-harness/`, `fixtures/defects/`,
   `fixtures/vocab/` — its C-collision is the point, 031's `VX-D2` reproduction) keep their
   forms and the parser goes on reading them; fixtures that model THE conforming form
   (`fixtures/conforming/`, `fixtures/kickoff/`, `fixtures/board-file/`) respell to the new
   form. Every fixture's ruling is listed in findings.
3. **Two layers.** *Machine:* every lettered token (`C‹nn›`, `c‹nn›-`, `GA-‹nn›`, `FC-‹n›`),
   every path (`plans/`, `lab/`), every typed slot — board ID cells, ledger head
   parentheticals, `ignite ‹id›`, `charge ‹n›`, `row ‹n›`, `‹id›-F‹n›` and `‹id› F‹n›` → `0nn-F‹n›`.
   *Supervised:* bare-number mentions the machine cannot prove — possessives (`18's`), ranges
   (`0–04`), lists (`06 hexwright · 07 simmy`), "the 18 wave" — the Builder adjudicates each hit
   against the table and its context; every mention left as-is is listed in findings with its
   reason (030's method). **Form only** — nothing is paraphrased, no sentence is reworded.
4. **Renames via `git mv`:** the 39 `plans/` docs and 6 lab dirs — `01-…` → `001-…`, `c23-…`
   → `023-…`, `lab/028` → `lab/028`; slugs carrying an old id respell too (`g2-029-merge.md`
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

- [x] `cd doctrine && bun test` — all pass, the count ≥ the pre-charge count (94 → **102**):

      102 pass
      0 fail
      416 expect() calls
      Ran 102 tests across 2 files. [73.00ms]

- [x] `bun doctrine/cli.ts lint --vocab ~/code/agents` — the agents building 0 failure(s),
      0 warning(s) (`agents/belvedere` reports its own 36 and is fenced — the same 36 it
      reported before this charge):

      ok   agents  —  3 board(s) · 51/51 rows typed · ledger 2026-09-01 · baton dispatch · 50 kickoff(s) · queue 0
      === TOTALS
        3 buildings · 5/5 board docs yielded a board · 5 boards · 114 rows · 114 fully typed (100%)
        2/2 ledgers parsed a tail (179 entries) · 0 fireable baton(s) · 108 kickoffs in 110 work docs · 20 decisions (queue 0) · 0 inbox entries
        0 worktree checkout(s) skipped as branch copies · per-repo special cases: 0
        36 failure(s) in 1 class(es)

- [x] The stray sweep carries **no id of this building** — 1,402 hits remain and every one is
      classified in 040-F3, with counts. Run over TRACKED files: the sweep's `--include` list
      reaches `lab/*/out/` and `summon/log/`, which `.gitignore` keeps out of the building's
      record, and this charge's scope is "every tracked text file".

      git ls-files -z | grep -zvE '^belvedere/' | xargs -0 grep -cE '\bC[0-9]{2}\b|\bGA-[0-9]{1,2}\b|\bFC-[0-9]\b|\bc[0-9]{2}-|plans/[0-9]{2}-|\blab/c?[0-9]{2}\b' | grep -v ':0$'

      lab/021/** 1284 · LEDGER.md 40 · plans/040-id-respell.md 23 ·
      doctrine/{src,test,README} 15 · doctrine/fixtures/{pre-d63,worktree,register} 12 ·
      doctrine/fixtures/respell 10 · plans/{018,019,026,BULLETIN,021-census} 8 ·
      lab/017/** 5 · BOARD.md · DECISIONS.md · ISSUES.md · canon/work/STANDARD.md 5
      → foreign addresses 1,329 · named forms 51 · control fixtures 22 (040-F3)

- [x] Every `plans/…` and `lab/…` path a tracked `.md` USES resolves — **326 checked, 0
      missing.** The one-liner archives the pre-charge tree and counts only the misses whose
      old spelling existed there, so a control set's invented `plans/01-thing.md` is not read
      as a break (118 such invented addresses at the baseline, unchanged by this charge); and
      it strips code-ticked spans first (`\x60` is the tick, kept out of the line so the line's
      own tick parity stays even), the same fence the converter reads (040-F2), because
      this document's own findings QUOTE the two old spellings the machine could not see:

      BASE=ec6a0b3; TMP=$(mktemp -d); git archive $BASE | tar -x -C "$TMP"; n=0; c=0
      while IFS= read -r f; do
        case "$f" in belvedere/*|doctrine/fixtures/*) continue;; esac
        d=$(dirname "$f")
        for p in $(perl -pe 's/\x60[^\x60]*\x60//g' "$f" | grep -ohE '(\.\./)?(plans|lab)/[A-Za-z0-9._/-]+' | sed 's/[.,;:)]*$//' | sort -u); do
          c=$((c+1)); [ -e "$p" ] || [ -e "$d/$p" ] && continue
          o1=$(echo "$p" | sed -E 's#(plans|lab)/0([0-9]{2})#\1/\2#'); o2=$(echo "$p" | sed -E 's#(plans|lab)/0([0-9]{2})#\1/c\2#')
          { [ -e "$TMP/$p" ] || [ -e "$TMP/$o1" ] || [ -e "$TMP/$o2" ]; } && { echo "MISSING $f -> $p"; n=$((n+1)); }
        done; done < <(git ls-files '*.md')
      echo "$c path mentions checked · $n missing"

      326 path mentions checked · 0 missing

      Its control: run mid-charge, before the fixture citations followed the rename, it named
      exactly the three real breaks (`plans/11-…`, `plans/18-…`, `plans/19-…` in
      `lab/021/ortho-report.md`) out of 136 raw misses.

- [x] `ls plans` — every charge doc `001-…` through `040-…`, both gates, the six non-id docs
      unchanged:

      001-composition-model.md    014-summon-rig-theater-cycle.md  027-glass.md             039-register-arm.md
      002-work-doctrine.md        016-doctrine-linter.md           028-charters.md          040-id-respell.md
      003-global-claude-md.md     017-storage-experiment.md        029-summon-harness.md    g1-flow-close.md
      004-sync.md                 018-great-recut.md               030-master-doc-prose.md  g2-029-merge.md
      005-saturation-harvest.md   019-doctrine-hardening.md        031-doctrine-defects.md  belvedere.md
      006-hexwright-retrofit.md   020-continuous-flow.md           032-flow-grammar.md      BULLETIN.md
      007-simmy-retrofit.md       021-census.md                    033-canon-landing.md     CODA.md
      008-summon-rig.md           021-vocabulary.md                034-register-purge.md    log-tradition.md
      009-summon-rig-v11.md       022-summon-argv.md               035-map-purge.md         night-shift.md
      010-summon-rig-v12-usage.md 023-law-book.md                  036-grammar-debt.md      quartermaster.md
      011-summon-rig-v13-live-refresh.md  024-parser.md            037-removal-arm.md
      012-dispatch-guard.md       025-respell-sweep.md             038-stamp-cycle.md
      013-summon-rig-name-stamp.md 026-language-linter.md

      No `015-` and two `021-`: charge 15's doc is `belvedere.md`, the cornerstone the fence
      leaves alone, and charge 21 has led two docs since it landed.

- [x] Ledger heads: `grep -cE '^\*\*20.*\((C?[0-9]{1,2}|GA-[0-9]+)\)' LEDGER.md` → **2**, not
      0, and both are foreign by construction — **040-F4**. Of 59 heads carrying an id slot,
      57 respelled; the two left name belvedere's `C7` and `C13`, and §7's qualified form
      (`belvedere:C7`) does not parse in the head's id slot. Filed to `ISSUES.md`.

- [x] The mark — `grep -rl` for `✓ Felix` across `--include='*.md' --include='*.ts'`, with
      `--exclude-dir=belvedere --exclude-dir=node_modules` (the pattern rides its own tick span
      so the converter reads it as the named form it is — 040-F7):
      → 20 files, 38 occurrences, **every one inside code ticks: a form being named, never a
      mark being given.** Zero marks remain in the record. Each class named in **040-F5**; the
      converter's own fence (040-F2) is why they stand and why a re-run leaves them standing.

- [x] The stigmergon dry run — the table, and `0 files written`:

      stigmergon — the id respell table (D80), derived from the board:
        S1  → 001   S8  → 008   S15 → 015   S22 → 022
        S2  → 002   S9  → 009   S16 → 016   S23 → 023
        S3  → 003   S10 → 010   S17 → 017   S24 → 024
        S4  → 004   S11 → 011   S18 → 018   S25 → 025
        S5  → 005   S12 → 012   S19 → 019   S26 → 026
        S6  → 006   S13 → 013   S20 → 020   S27 → 027
        S7  → 007   S14 → 014   S21 → 021   S28 → 028
      (G1–G5 absent — a kind keeps its letter)
      …
      Dry run: 1250 edit(s) across 122 file(s) — 0 files written. Re-run with --write to apply.

      Control: `git -C ~/code/stigmergon status --porcelain | wc -l` → `0`, before and after.

- [x] **The converter is a fixed point on its own landing** (not a bar the charge named — the
      currency law's own precondition, and it took three re-runs to reach; 040-F7):

      bun doctrine/cli.ts migrate .   →  agents: already in the current grammar — nothing to migrate.

- [x] The supervised layer's exemption list is in findings — **040-F3** (what stands and why,
      with counts) and **040-F6** (every line the machine over-reached into and this hand
      restored, and every one it could not see and this hand fixed).

## Out of scope

- `belvedere/` — the purge (deferred list) deletes it; git is the archive.
- Other buildings' respells — stigmergon's inbox line is filed; the rest adopt at their next
  Architect session (D78's precedent).
- ~~The `✓ Felix` → `⬡✓` mark respell — deferred, STANDARD "What remains".~~ **Struck
  2026-09-01 at the landing (040-F1):** stale when this doc was laid — the Mission, Spec 1,
  the bar and D81 all ride it here, and the standard's "What remains" was struck the same
  morning. The mark respelled.
- Any rewording. New lint arms. The sync set. The worktree-dedup hole (deferred list).

## Findings

### 040-F1 — the charge contradicted itself on the mark; the ruling won

Out of scope read "The `✓ Felix` → `⬡✓` mark respell — deferred, STANDARD 'What remains'", while
the Mission, Spec 1, the Done-when's own mark bullet, D81's text ("First act: the `✓ Felix` →
`⬡✓` mark respell rides 040") and STANDARD's struck "What remains" all say it rides here. One
stale line against five instruments: the mark respelled. The line is struck above with a dated
note rather than deleted (D63's molt clause). **No escalation was raised** — the fork was not
live: the same document's Mission and bar already overrode the line, and a ruling blessed the
same morning outranks it.

### 040-F2 — a converter that respells its own law needs one fence: the named form

A total substitution over a whole building walks into the sentences that DEFINE the dead forms.
Uncaught, the first run produced `` the `⬡✓` → `⬡✓` mark `` (BOARD row 040), `` `036-…` →
`036-…` `` (D80's own line) and `` Historical forms (`023`, `S3`, …) `` (STANDARD §7) — the
law's statements destroyed by the law.

The fence lives in `respell.ts`, not in this session's hands: **a code-ticked LONE TOKEN is a
form being named, not an address being used.** Three exclusions, each earned by a real hit — a
span carrying `/` or `.` is an ADDRESS and must follow the rename (`` `plans/023-…` ``,
`` `037-removal-arm.md` ``); a span with whitespace is a phrase, not a form (`` `ignite 029` ``
is a command and respells); `✓ Felix` is the one dead form the standard spells with a space.

Its own defect, found and fixed: the mask is per-line and the corpus wraps its tick spans, so
``a collision `✓ Felix` could not have`` (LEDGER 1554, the span opened on 1553) read as unticked
text and was respelled into a sentence that no longer said anything. Parity is now threaded
through the engine (`LineCtx.openTick`, `ticksLeftOpen`), reset at every fence marker. The
fixture asserts both halves.

**Why it matters past today:** the mark, `GA-‹n›` and `FC-‹n›` have no table to extinguish
them, so without the fence they re-fire on every run forever. With it they stand. That is half
of what makes the converter re-runnable; 040-F7 is the other half.

### 040-F3 — the stray sweep's 1,402 remaining hits, classified

Not one is an id of this building.

| What | Hits | Ruling |
|---|---|---|
| `lab/021/` — `lexicon.json`, `obs/*.jsonl`, `manifest.tsv`, `territories/*.txt`, the two reports | 1,284 | The census dataset (charge 021, LANDED): a machine-generated record of eight buildings' files. Its **agents-side addresses respelled** — paths, `lab/021/…`, the `grand-architect-‹nn›` stamp; its foreign paths (`/code/whiteboardy/plans/18-…`, `snappy/ch2/plans/…`, manny, spacex) stand as the addresses they are. Its **quoted prose stays verbatim**: the supervised layer's one bulk exemption, because adjudicating ~1,900 quotes across eight buildings is judgment at a scale one session cannot carry — and D81 fences speech for exactly that reason. |
| `LEDGER.md` — `C10`–`C13`, `c10-`/`c11-`/`c13-` | 35 | Belvedere v3's charges and doc paths, quoted in agents' ledger while this desk tended that campaign. A foreign namespace; the belvedere purge (deferred list) deletes the target. |
| `fixtures/pre-d63/` 7 · `fixtures/worktree/**` incl. `bv/c29-harness/` 3 · `fixtures/register/**` 2 | 12 | **A fixture keeps the form it exists to exercise.** pre-d63 models the pre-doctrine grammar; worktree models a foreign branch checkout (the `bv/c29-harness` directory name IS the 036 item-5 reproduction); register models a synthetic city of foreign buildings. |
| `fixtures/respell/{BOARD,LEDGER}.md` | 10 | **The control this charge ships** — the before-form input the round-trip test respells. Its old forms are the experiment. |
| `doctrine/src/respell.ts` · `src/lexicon.ts` · `test/doctrine.test.ts` · `README.md` | 15 | Named forms in the converter's comments, the graveyard's `dropped` reason, the test's fence assertions, the README's respell section. |
| `plans/{018,019}` (cornerizer `C8/C22/C34`, `C28`, `C17`) · `plans/026` + `doctrine/README` + `lexicon.ts` (`manny/plans/29-campaign-id-lint.md`) · `plans/BULLETIN.md` (`~/code/whiteboardy/.c30-probe`) | 8 | Foreign ids and filesystem addresses. 018/019 are the city-wide sweep reports; their `row ‹n›` references belong to snappy's ch2, cap-mega's units and waypoint-stepper, tig-avc and whiteboardy. |
| `lab/017/{rendered,twin,parse-baseline}` | 5 | The storage experiment's frozen twin. Its agents-side addresses respelled — it is agents' own MAP as of 2026-08-28 — while the cornerizer quote and the `GENESIS.md` summons text stand. |
| `DECISIONS.md` 2 · `canon/work/STANDARD.md` 1 | 3 | D80's own `` `c36-…` → `036-…` `` line, its `` `S3` and `C23` `` diagnosis, §7's historical-forms list. Naming a dead form is how the law records it. |
| This landing's own record — `plans/040-id-respell.md` 23 · `LEDGER.md` +2 · `BOARD.md` 1 · `ISSUES.md` 1 | 27 | The findings below, the board row, the inbox entry and the ledger entry NAME the forms this charge killed and the foreign ids it left standing. A report on a respell cannot be written without them. |

**Fixtures that DID move** (they model THE conforming form, spec §2): `fixtures/conforming/`
(11 files, 52 edits), `fixtures/board-file/` (2), `fixtures/kickoff/` (4). `fixtures/defects/`,
`fixtures/vocab/`, `fixtures/live/`, `fixtures/guard/`, `fixtures/subproject/` carry no id in
the respell's reach. Nine test expectations followed the conforming fixtures; two
(`defects/unstaffed.md`, `worktree/`) were deliberately left on `C1`–`C3`, and a blanket
string replace that moved them was caught by the suite and reverted.

### 040-F4 — §7's qualified id cannot be written in the ledger head's id slot

Two ledger heads keep a foreign id: `**2026-08-30 · Architect · fable-high (C7)**` (LEDGER 2086)
and `(C13)` (2151) — sessions this desk ran on belvedere's board. D80 says an id abroad is
qualified (`belvedere:C7`), but `isId` is `/^[A-Za-z0-9][A-Za-z0-9-]*$/` and rejects `:`, so
`splitParen` would drop a qualified id out of the row slot and into the body: a stray traded for
a lint failure and a lost field. Left as the foreign addresses they are; **filed to `ISSUES.md`**,
because every building that tends another's charge meets this.

### 040-F5 — where `✓ Felix` still stands, and why every one is right

38 mentions in 20 files, all inside code ticks. Four classes:

- **The law naming its own graveyard** — STANDARD §7 (`instead of:`) and the struck "What
  remains", DOCTRINE §7 ("historical `✓ Felix` marks parse"), DECISIONS D81, BOARD row 040,
  this charge's own spec.
- **The reader's contract** — `grammar.ts`'s `BLESSED_MARK` comment, `respell.ts`'s fence,
  `doctrine/README.md`'s successor table, the suite's fence assertion, `fixtures/respell/*`.
- **The census counting the token** — `plans/021-census.md` (266 marks),
  `plans/021-vocabulary.md`, `lab/021/ortho-report.md`, `lab/021/PROTOCOL.md`.
- **History narrating the form** — `LEDGER.md` ×4, `plans/{019,024,034}`,
  `lab/017/rendered/LEDGER.md`.

Three claims this landing falsified were repaired in the same act, because the currency law
binds the converter's own documentation: `doctrine/README.md`'s "neither mark migrates" and
"the record's marks — `✓ Felix` stays `✓ Felix`", and STANDARD §1's "The record token
**`✓ Felix`** is unchanged". The README's refusal list also lost "kickoff fences" as a blanket
refusal — the respell reads fences, because a kickoff naming a renamed charge doc is a dead
address. **STANDARD.md is canon: that touch rides D81 and is named here for the review.**

### 040-F6 — the supervised layer, line by line

The machine ran; then this hand read every hit its risky rules produced.

**Rules narrowed after the corpus falsified them:**

1. **`gate ‹n›` dropped from the typed prose slots**, though the spec named it. Every occurrence
   in this corpus is another building's row (whiteboardy's `gate 25`/`gate 26`, six sites) or a
   count (`type gate 0`, LEDGER 1652). A noun that types nothing is noise.
2. **Depends-on reads SEGMENTS, not digits.** "A Depends-on cell holds ids and no prose" is
   false: `lab/017/rendered/board.md` row 17's ⬡-gate carries a paragraph, and a digit rule
   turned `v0 §8 DoD 7/7, 14 rows` into `007/007, 014 rows`. Only a segment that IS a bare
   number now respells, split on the parser's own separators (`·` `,` `;`).
3. **`plans/…` and `lab/…` bind to the building's own directory name.** Without it, ~300
   `/Users/felix/code/whiteboardy/plans/18-…` in the census data became `018-`. With it,
   `../plans/`, `./lab/` and bare `agents/plans/` all still respell.
4. **A trailing `.` no longer blocks a slot** (`row 08.` in a decision title was invisible) and
   a decimal still does (`v1.2`).

**Restored by hand — foreign addresses the machine reached:**

| Where | Restored | Why |
|---|---|---|
| `plans/018` ×15 | `ch2 row 05/04/02`, `units row 03`, `waypoint-stepper row 11`, `row 12/13/24/28`, tig-avc `row 06/07/08`, `cornerizer C28`, `C8/C22/C34` ×2 | 018 is the city-wide re-cut's report; those rows are snappy's, cap-mega's and cornerizer's |
| `plans/019` | `C8/C22/C34`; `items 16–18's` | cornerizer's ids; an item range, not a charge range |
| `plans/026` | `` `row 03` ``, `` `Row 25` ``, `row 3` (snappy), `` `row 26` `` | the vocabulary arm's own dead-word EXAMPLES, quoted from foreign corpora |
| `plans/030` | `` `row 26` ``, `"Rider (charge 04 §5)"` | the same example; a verbatim quote of waypoint-stepper |
| `plans/BULLETIN.md` | `~/code/whiteboardy/.c30-probe` | a directory on another repo's disk |
| `doctrine/src/lexicon.ts` | `` `row 26` `` | the arm's pattern illustration |
| `LEDGER.md` | `capability row 4` | belvedere's capability matrix, not a charge |
| `lab/021/{lexicon.json, obs/A2, obs/B11}`, `lab/017/{rendered/DECISIONS.md, twin/decisions.json}`, `lab/021/prefix-acro-report.md` | `cornerizer C8/C22/C34` ×5, MegaCap's `row 1.` ×2 | quoted foreign text |

**Fixed by hand — this building's own ids the machine could not see:**

| Where | Fixed | Why the machine missed it |
|---|---|---|
| `LOG.md` ×2, `LEDGER.md` ×16, `plans/{011,037}` | `C22` → `022` | charge 22 was bare on the board and lettered in prose, so `C22` was never a table key |
| `plans/022` | `C14` → `014` | the same |
| `plans/024` ×2 | `` `(C23)` `` → `` `(023)` `` | a ticked lone token: the fence held it, but it describes a fixture this charge moved |
| `LEDGER.md` 1659 | `` `ignite C29` `` → `029` | the tick span wrapped mid-phrase, so the fragment read as a named form |
| `LEDGER.md`, `MAP.md`, `plans/004` | ranges `01–04`, `10–12`, `19–22`, `0–04`, `01–03` | a range is two ids and a dash, not a token |
| `MAP.md` | `06 hexwright · 07 simmy`; `the 18 wave's` | a list, and an attributive |
| `BOARD.md`, `LOG.md`, `LEDGER.md` ×3 | `killed with 22`, `with 11 beside it`, `022 + 11 KILLED`, `15 KILLED` | a bare id behind a verb |
| `plans/{002,003,011,013,014,017,018,019,020}` heads | `**Depends on:** 10/13/16/17`, `**Gate:** 01 + 02`, the title line `01 ·` | a charge doc's header fields are prose, not board cells |
| `plans/019` | `The 18-wave` | an attributive compound |
| 23 files, 91 sites | possessives `NN's` → `0NN's` | the machine cannot tell `04's spike` (charge 4) from `requirement 1's` (a clause) |
| `lab/021/{ortho,candidates,build-manifest}.ts`, 8 paths | `${AGENTS}/lab/21/` → `lab/021/` | the path is built from a variable, so the building's name is not in the text |
| `lab/017/{twin/kickoffs.json, parse-baseline.json}` | `\nplans/01-composition-model.md` | a JSON-escaped newline: the `n` of `\n` is a word character and blocked the path rule |

**Left as-is, with reasons** (beyond F3's table): every `‹noun› ‹n›'s` whose noun is
`requirement · clause · contract · drill · probe · finding · escalation · entry · formula ·
item · batch · round · arm · law · step · phase · scenario · question · Rev · leg · waypoint ·
sitting · bulletin · Pi` — word-numbered things stay words (STANDARD §7). `LEDGER.md` 2696's
"the seam (0–22 beside 023+)": the sentence is ABOUT the old numbering, and padding it erases
its subject. `DECISIONS.md` 81's "this repo's bare 01–22": D80's own ancestor list, naming the
form it killed. `bv/029-summon-harness` (LEDGER ×6): a deleted git branch, respelled with the
rest — history gains the present's names (D81), and the sha `f160ec1` beside it is the address
that still resolves.

### 040-F7 — the converter must be a fixed point, and it was not; two defects, both closed

D81 asks a building to run its converter as a matter of course. A converter that re-breaks the
corpus on its second pass cannot be run that way. **`migrate` was run again after `--write`
three times, and each run found a defect the first could not have shown.**

1. **6 edits, `lab/021/ortho-report.md`** — `agents/plans/11-…`, the building's own name with
   no leading slash, which the new foreign-path guard had refused. Rule widened.
2. **37 edits across 9 files — the whole supervised layer, re-broken.** The number-keyed rules
   (`plans/‹n›-`, `lab/‹n›`, `‹n›-F‹k›`, `charge|row|ignite ‹n›`, the head's id slot) key on
   `charges`, which survives the respell: after the board reads `005`, the table still maps
   `5 → 005`, so `ch2 row 05` — cornerizer's, restored by hand an hour earlier — padded again.
   **The fix is one line and it is the right law: a number is an address only while the
   building still writes an old spelling on its own board.** `if (isEmpty(t)) return out;` —
   once `ids` is empty, every number rule falls silent and the respell is the one-time
   migration act it always was. Prose after adoption is a session's business, and a malformed
   new id is the linter's.
3. **1 edit, this document** — the mark bullet above wrote its whole `grep` command, pattern
   and `--include` globs, inside ONE ticked span. A span carrying a path is an ADDRESS by
   040-F2's second exclusion, so the fence let go and the pattern respelled. The bar now gives
   the pattern its own span, where it reads as the named form it is.

The proof, at the landing:

    bun doctrine/cli.ts migrate .            → agents: already in the current grammar — nothing to migrate.
    bun doctrine/cli.ts migrate ~/code/stigmergon → 1250 edit(s) across 122 file(s) — 0 files written

An adopted building is inert; an unadopted one is not. **The lesson for the next converter: run
it twice and diff — and then a third time.** Every one of the three defects was invisible on
the first pass and obvious on the next.

### 040-F8 — for a substitution, the round-trip law is invariance, not silence

The inherited law ("a field a fired rule declared may change; everything else identical") is
vacuous for a rule that touches every field: declaring the respell's `changes` as the union of
all fields buys silence over the whole document.

Built instead: where the respell fired, **every parsed field must be INVARIANT UNDER THE TABLE**
— `respell(before) ≡ respell(after)`. A paraphrase, a drop, a wrong address or a vanished row
still fails; a form the line-scoped rules could not reach passes. It is equality UNDER the table
and not equality WITH it because a parsed field is not a line: `plans/021-vocabulary.md` writes
`…, row\n14);` and no line rule can see across that wrap. The law earned its keep three times in
this build — it caught the key-lookup gap (`row C23: vanished from the migrated document`), the
ledger comparison still on raw equality, and the wrapped-tick defect of F2.

### 040-F9 — the denominators moved, and every movement is explained

The charge's counts predate its own doc and used a wider file set. Re-counted before the run
over `*.md *.ts *.zsh *.exp *.tsv *.txt`, `belvedere` excluded:

| What | Charge | Measured | Why |
|---|---|---|---|
| `C‹nn›` tokens · files | 897 · 76 | 932 · 91 | this charge's own doc, plus `desk/` and `doctrine/fixtures/`, which the charge's sweep includes |
| lowercase `c‹nn›-` | 186 | 199 | the same |
| `GA-‹nn›` · `FC-‹n›` | 133 · 14 | 133 · 15 | exact; the one extra `FC-` is in 040's own spec |
| `✓ Felix` marks · files | 185 · 30 | 193 · 32 | 040's spec and the D81 register entry |
| ledger heads with an id slot | 59 (34 · 15 · 10) | 59 (34 · 15 · 10) | **exact** |
| findings `‹nn›-F‹n›` (dash) | 147 | 129 | the charge's pattern reached `\d{2}-F\d` inside foreign compounds |
| files to rename | 39 + `g2-c29-merge.md`'s slug · 6 lab dirs | the same | **exact** |

No count moved unexpectedly. The run wrote **180 files / 3,734 edits**; then 1 file / 6 edits
(F7); then 52 edits by hand into the conforming fixtures; then the supervised layer.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7, ~/code/agents/DECISIONS.md (D80, D81),
~/code/agents/canon/work/STANDARD.md §7 and execute the charge at
~/code/agents/plans/040-id-respell.md.
```
