# The agents canon — Board

The work state: the board, batch notes, the deferred list (D78, split from MAP §5
2026-08-31). Design, non-goals, and local physics stay in [MAP.md](MAP.md).
Statuses per the doctrine (`canon/work/DOCTRINE.md` §4): OPEN → IN FLIGHT →
LANDED / KILLED. Any account can host any session — the repo carries the truth;
account choice is quota arbitrage.

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 0 | Genesis — lay the keel | ⬡-gate: blessing | Grand Architect · unrecorded | **LANDED** 2026-08-02 |
| 01 | [Composition model](plans/01-composition-model.md) | 0 | Architect · fable-max | **LANDED** 2026-08-02 |
| 02 | [Work doctrine](plans/02-work-doctrine.md) | 0 | Architect · fable-max | **LANDED** 2026-08-03 → `canon/work/` |
| 03 | [Global CLAUDE.md](plans/03-global-claude-md.md) | 01; 02; ⬡-gate: 02's D-entries countersigned | Architect · fable-max | **LANDED** 2026-08-03 |
| 04 | [Sync](plans/04-sync.md) | 01; 02; 03 | Digger · opus-high (→ Builder · opus-high for Stage B) | **LANDED** 2026-08-03 |
| 05 | [Saturation harvest — snappy batch-1 → canon](plans/05-saturation-harvest.md) | — | Grand Architect · fable-max | **LANDED** 2026-08-05 |
| 06 | [hexwright retrofit](plans/06-hexwright-retrofit.md) | ⬡-gate: D32 ✓ 2026-08-06 | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/06-hexwright-retrofit.md) |
| 07 | [simmy retrofit](plans/07-simmy-retrofit.md) | ⬡-gate: D32 ✓ 2026-08-06 | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/07-simmy-retrofit.md) |
| 08 | [summon rig](plans/08-summon-rig.md) | ⬡-gate: D34 ✓ 2026-08-06 | Builder · opus-high | **LANDED** 2026-08-06 → [findings](plans/08-summon-rig.md) |
| 09 | [summon rig v1.1](plans/09-summon-rig-v11.md) | 08; ⬡-gate: D36 (dispatch countersigns) | Builder · opus-high | **LANDED** 2026-08-06 → [findings](plans/09-summon-rig-v11.md) |
| 10 | [summon rig v1.2 — the usage panel](plans/10-summon-rig-v12-usage.md) | 09; ⬡-gate: D41 ✓ 2026-08-07 | Builder · opus-high | **LANDED** 2026-08-07 → [findings](plans/10-summon-rig-v12-usage.md) |
| 11 | [summon rig v1.3 — the live table](plans/11-summon-rig-v13-live-refresh.md) | 10; **⬡-gate: blessing** | Builder · opus-high | OPEN — cut 2026-08-08 (Architect), blessing PENDING Felix. **Deferred by Felix 2026-08-08** — the blessing gate stands unmet; nothing dispatches until his word. 13 LANDED 2026-08-22, so the rebase is real: at unshelving this row inherits the name-stamp in every asserted panel/command, and 13's narrowed F4/F5 arms (13-F1's guard, first ruled here, moved to row 14 2026-08-24 — 14 touches the harness now, 11 is deferred indefinitely) |
| 12 | [the dispatch guard](plans/12-dispatch-guard.md) | — | Builder · opus-high | **LANDED** 2026-08-08 → [findings](plans/12-dispatch-guard.md); **the hole, proven:** workflow-script `agent(…, {model, effort})` calls never fire `PreToolUse` (F2) — README names it, arm 4 watches it; adoption anywhere is still its own row |
| 13 | [summon rig — the name-stamp](plans/13-summon-rig-name-stamp.md) | — | Builder · opus-high | **LANDED** 2026-08-22 → [findings](plans/13-summon-rig-name-stamp.md); F7 parked: the 32-key runaway guard caps one panel's seed at ~28 ordinals |
| 14 | [summon rig — the theater cycle](plans/14-summon-rig-theater-cycle.md) | 13 | Builder · opus-high | **LANDED** 2026-08-24 → [findings](plans/14-summon-rig-theater-cycle.md); smoke ⬡✓ 2026-08-29; F5 parked: the 32-key runaway guard caps one panel's cycle at ~28 positions, and no cap is placed on the list itself |
| 15 | [Belvedere — the Sovereign's deck](belvedere/README.md) (subproject; cornerstone: [plans/belvedere.md](plans/belvedere.md)) | ⬡-gate: venue D2 ✓ Felix via keel §11 | Architect · fable-max (founding) | **IN FLIGHT** — founded 2026-08-26; **retirement declared 2026-08-31 (⬡)** — the attempt lacked the right foundation; close-out is its own session, the v3 engine salvage planned; the campaign's books stay on its board |
| 16 | [v3 · the doctrine linter](plans/16-doctrine-linter.md) — P3's parsers harden into canon `doctrine/`: `lint` · `parse --json` · `migrate` | — | Builder · opus-high | **LANDED** 2026-08-26 → [findings](plans/16-doctrine-linter.md) |
| 17 | [v3 · the storage experiment](plans/17-storage-experiment.md) — does structured-source truth beat schema-markdown for the three consumers? | 16 · ⬡-gate: Belvedere v0 evidence — paid 2026-08-28 | Digger · fable-high | **LANDED** 2026-08-28 — **RETAIN, confirmed with numbers** → [findings + verdict](plans/17-storage-experiment.md) |
| 18 | [v3 · the great re-cut](plans/18-great-recut.md) — full-corpus migration via `doctrine migrate`, history included | 16 | Dispatcher · sonnet-medium (tends an 8-row wave of scoped Architects) | **LANDED** 2026-08-29 → [findings](plans/18-great-recut.md) |
| 19 | [v3 · doctrine v1.1 — the wave's residue](plans/19-doctrine-hardening.md): 15 evidenced tool defects fold into `doctrine/`, fixtures kept | 17 · ⬡-gate: vocabulary countersign — paid 2026-08-28 | Builder · opus-high | **LANDED** 2026-08-28 → [findings](plans/19-doctrine-hardening.md) |
| 20 | [the continuous flow — the cornerstone session](plans/20-continuous-flow.md): flow doctrine, the flow engine's law, the D64 grammar asks (kind/recommendation/branch/holder/holds), cross-building Depends-on | 17 · ⬡-gate: his call to sit | Grand Architect · fable-max | **LANDED** 2026-08-29 → [design + findings](plans/20-continuous-flow.md) |
| 21 | [the working vocabulary — the census, then the standard](plans/21-vocabulary.md): full-city term census (concepts-driven, orthography included) → Felix chooses → the standard; subsumes bless-vs-countersign; §13 on the block | ⬡-gate: his call to sit — paid 2026-08-28 | Grand Architect · fable-max | **LANDED** 2026-08-29 — **the standard blessed** → [the census](plans/21-census.md) · [STANDARD.md](canon/work/STANDARD.md) |
| 22 | [summon rig — the argv summons](plans/22-summon-argv.md): the summons composes into the prompt slot, color goes venue-native (P2 §S3/§T4: paste splits at the first blank line — the 359-ignition gap) | ⬡-gate: blessing | Builder · opus-high | OPEN — cut 2026-08-28 (GA-11); three forks await his blessing in the stub; **priority raised 2026-08-31** — the deck retires, the rig is primary again |
| C23 | [the law book](plans/c23-law-book.md) — canon speaks the standard: DOCTRINE respelled + §13 superseded, STANDARD.md promoted, the global waggle line (live wire), templates → charge.md, rider → coda, the-city, dispatcher tombstoned | — | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings](plans/c23-law-book.md) |
| C24 | [the parser](plans/c24-parser.md) — grammar tokens (⬡-gate · DEFERRED · C‹n› · ⬡✓ · ignite), migrate respell rules, charges-always-staffed lint-hard, city dry-run counts | C23 | Builder · opus-high | **LANDED** 2026-08-29 → [findings](plans/c24-parser.md) |
| C25 | [the respell sweep](plans/c25-respell-sweep.md) — live surfaces city-wide (migrate + the graveyard); absorbs the 18-continuation (whiteboardy re-fire · snappy separators · spacex heads · bob heads — sanctions on record); history, voice, and charters fenced | C24 | Architect · opus-high | **LANDED** 2026-08-29 → [findings](plans/c25-respell-sweep.md) |
| C26 | [the language linter](plans/c26-language-linter.md) — the vocabulary arm: graveyard + American/grey lexicon + prefix table + the pinned 24; ancestor manny M13, food lab/21/lexicon.json | C24 | Builder · opus-high | **LANDED** 2026-08-29 → [findings](plans/c26-language-linter.md) |
| C27 | [the glass](plans/c27-glass.md) — Belvedere speaks the standard (deck copy, tokens, baton verbs; the ⬡-queue by name); runs on the Belvedere board, this charge is the pointer | C24 | Architect · fable-high | **LANDED 2026-08-29 — PENDING ⬡ visual pass** (relaunch the deck; the pass rides this cell as its annotation) → [findings](plans/c27-glass.md); three canon asks filed |
| C28 | [the charters](plans/c28-charters.md) — offices + mantles redrafted on Felix's own drafts; Fixer named, shims re-minted; the spend-fork information-needs clause rides as drafting input | C23 · ⬡-gate: Felix's office/mantle charter drafts — paid 2026-08-29 | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings F1–F33](plans/c28-charters.md) |
| C29 | [the summon harness](plans/c29-summon-harness.md) — `lab/08/run` follows `presets.tsv` after the `d dispatcher` retirement; 13-F1's guard gains its removal arm | C25 | Builder · opus-high | OPEN — **E1 2026-08-31, the status ruling is Felix's** ([G2](plans/g2-c29-merge.md) F1–F5). The mission is **met on master by later hands** (`7973440` · `08a97d0` · `6724213`): 210 green, no dispatcher row, no dispatcher assertion — the 15-red this row asserted is gone. `bv/c29-summon-harness` @ `f160ec1` runs **1-red** and is superseded in every conflicting hunk; **the merge is rejected**, the branch **kept** (not deleted) until C37 lands. The removal arm is its one unlanded deliverable → [C37](plans/c37-removal-arm.md). Recommended close: `LANDED — mission met on master; branch REJECTED, superseded` |
| C30 | [the master-doc prose sweep](plans/c30-master-doc-prose.md) — the outer city's five big master docs speak the standard in prose, plus this repo and every tail the charge named | C25 | Architect · opus-high | **LANDED** 2026-08-29 → [findings F1–F11](plans/c30-master-doc-prose.md); 636 hits adjudicated across 13 files, 14 exemptions stand, all named. Rulings the next sweep inherits: spent vs unspent decides live (F1) · the dead column names senses, not strings (F2) · `wave` → a concurrency stage (F4) · `CLOSED` at batch altitude → COMPLETE (F5) · `harvest` splits canonize/sweep (F6) · `rider` splits coda/condition/charge, files unrenamed (F7). Belvedere's ~156 filed to its own board (F10) |
| C31 | [doctrine v1.2 — the defects](plans/c31-doctrine-defects.md) — migrate's stale-parse lie · house-dialect rules · the prefixed-D blind spot · the kickoff arm | — | Builder · opus-high | **LANDED** 2026-08-29 → [findings](plans/c31-doctrine-defects.md); suite 71 → 80; the one unmet `Done when:` bullet (lint 3, not 0) cleared by later hands — lint reads 0 at 2026-08-31 |
| C32 | [the flow grammar](plans/c32-flow-grammar.md) — D74 built: written holder · holds · E-ids · Branch · encapsulation · qualified Depends-on · tier split | C31 | Builder · opus-high | **KILLED** 2026-08-31 — flow-1 abandoned before ignition (belvedere D22); the holder-grammar scope moved to [C36](plans/c36-grammar-debt.md); the D74 spec survives in [its doc](plans/c32-flow-grammar.md) |
| G1 | [flow-1's close gate](plans/g1-flow-close.md) — verify the four landings, merge c29's branch, distill, hand the verdict card | C29; C30; C31; C32 | Architect · fable-high | **KILLED** 2026-08-31 — the flow it closed was abandoned (belvedere D22); c29's merge survives as [G2](plans/g2-c29-merge.md) |
| C33 | [the canon landing](plans/c33-canon-landing.md) — the D76-blessed roster lands: GUILD.md + six charters (fixer minted), the fixer/mentat shims (live sync), README roster + grammar + template, DOCTRINE §12's kickoff | C28 | Builder · opus-medium | **LANDED** 2026-08-29 → [findings](plans/c33-canon-landing.md); F3's wrap ruling owed — rides the next charter sweep |
| C34 | [the register purge](plans/c34-register-purge.md) — the constitution consolidated: D1–D76 killed whole, the homeless clauses distilled, the skills shims purged | C33 · ⬡-gate: his call to sit — paid 2026-08-29 | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings](plans/c34-register-purge.md) |
| C35 | [the master-doc purge](plans/c35-map-purge.md) — MAP re-cut with C34's blade: LANDED charges compress to status + findings link, spent batch notes die, dead numbers strip; live holds survive verbatim | C34 | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings](plans/c35-map-purge.md) |
| C36 | [doctrine v1.3 — the grammar debt](plans/c36-grammar-debt.md) — seven evidenced parser/lint defects: the spent mask, the written holder, `Next: none`, the body-text splitter, the `bv/*` register skip, `classifyBaton ⬡`, the BOARD.md reader | — | Builder · opus-high | OPEN — laid 2026-08-31 (GA-19) |
| G2 | [c29's merge gate](plans/g2-c29-merge.md) — verify the branch harness FINISHED green, merge `bv/c29-summon-harness`, reconcile C29 | — | Architect · opus-high | **BLOCKED — E1** 2026-08-31: the gate ran, and its premise is falsified. Control **green, not 15-red** (the doc names that an escalation); branch **1-red**, so D48 forbids the merge; a trial merge conflicts 6 hunks, master's side right in all of them. **Merge REJECTED** (ruled here — charter review loop; D48). Salvage laid as [C37](plans/c37-removal-arm.md), proven 215 green. Awaiting his word: C29's status + whether C37 lives → [findings F1–F5](plans/g2-c29-merge.md) |
| C37 | [the removal arm](plans/c37-removal-arm.md) — C29's one surviving deliverable: 13-F1's guard proves the harness follows a preset **removal**, not just an addition | — | Builder · opus-high | OPEN — laid 2026-08-31 (G2); the graft is written and **pre-verified 215 green** in the doc; dies with one word if the arm is not wanted |

**agents-flow-1 — ABANDONED** at Felix's word (belvedere D22, 2026-08-30; recorded
at the migration sweep): laid 2026-08-29 (GA-15) as the Guild's first engine-run
batch — C31 → C32 ∥ C29 ∥ C30 → G1. C31 and C30 landed as sessions; the engine never
tended it. G1 and C32 KILLED at the GA-19 sweep 2026-08-31; c29's unmerged branch
survives via G2, C32's holder-grammar scope via C36. The flow file stands archival:
`belvedere/flows/agents-flow-1.flow.json`.

**Batch — the grammar-debt pair (laid 2026-08-31, GA-19):** G2 ∥ C36, parallel-safe
(G2: `summon/lab/08` + the merge + LEDGER append; C36: `doctrine/` + fixtures — no
shared files), both on the master checkout; Felix tends (two terminal ignitions, no
gates between them). **G2 ran 2026-08-31 and stopped at E1** — its premise was falsified
(master had repaired itself; the branch is 1-red), the merge is rejected, and the status
ruling waits on Felix. C36 is unaffected and still ignitable. **C37** — G2's salvage,
laid 2026-08-31 — is parallel-safe with C36 on the same disjointness (`lab/08/` vs
`doctrine/`) and ignitable the moment E1 is ruled.

**Deferred (tracked, not lost):**

- The peer-messaging experiment (SendMessage taps between live sessions —
  gate-delivery pokes, cross-account bulletin pokes; pointers-not-payloads,
  message-never-summons; the plane is OS-user-scoped and crosses all three accounts,
  ephemeral, no audit trail) — Felix 2026-08-08: canonize later; capability map,
  probe spec, and the Quartermaster deliberation in
  [plans/quartermaster.md](plans/quartermaster.md). The bulletin stands untouched.
