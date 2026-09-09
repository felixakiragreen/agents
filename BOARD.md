# The agents canon — Board

The work state: the board, batch notes, the deferred list (D78, split from MAP §5
2026-08-31). Design, non-goals, and local physics stay in [MAP.md](MAP.md).
Statuses per the doctrine (`canon/work/DOCTRINE.md` §4): OPEN → IN FLIGHT →
LANDED / KILLED. Any account can host any session — the repo carries the truth;
account choice is quota arbitrage.

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 000 | Genesis — lay the keel | ⬡-gate: blessing | Grand Architect · unrecorded | **LANDED** 2026-08-02 |
| 001 | [Composition model](plans/001-composition-model.md) | 000 | Architect · fable-max | **LANDED** 2026-08-02 |
| 002 | [Work doctrine](plans/002-work-doctrine.md) | 000 | Architect · fable-max | **LANDED** 2026-08-03 → `canon/work/` |
| 003 | [Global CLAUDE.md](plans/003-global-claude-md.md) | 001; 002; ⬡-gate: 002's D-entries countersigned | Architect · fable-max | **LANDED** 2026-08-03 |
| 004 | [Sync](plans/004-sync.md) | 001; 002; 003 | Digger · opus-high (→ Builder · opus-high for Stage B) | **LANDED** 2026-08-03 |
| 005 | [Saturation harvest — snappy batch-1 → canon](plans/005-saturation-harvest.md) | — | Grand Architect · fable-max | **LANDED** 2026-08-05 |
| 006 | [hexwright retrofit](plans/006-hexwright-retrofit.md) | ⬡-gate: D32 ✓ 2026-08-06 | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/006-hexwright-retrofit.md) |
| 007 | [simmy retrofit](plans/007-simmy-retrofit.md) | ⬡-gate: D32 ✓ 2026-08-06 | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/007-simmy-retrofit.md) |
| 008 | [summon rig](plans/008-summon-rig.md) | ⬡-gate: D34 ✓ 2026-08-06 | Builder · opus-high | **LANDED** 2026-08-06 → [findings](plans/008-summon-rig.md) |
| 009 | [summon rig v1.1](plans/009-summon-rig-v11.md) | 008; ⬡-gate: D36 (dispatch countersigns) | Builder · opus-high | **LANDED** 2026-08-06 → [findings](plans/009-summon-rig-v11.md) |
| 010 | [summon rig v1.2 — the usage panel](plans/010-summon-rig-v12-usage.md) | 009; ⬡-gate: D41 ✓ 2026-08-07 | Builder · opus-high | **LANDED** 2026-08-07 → [findings](plans/010-summon-rig-v12-usage.md) |
| 011 | [summon rig v1.3 — the live table](plans/011-summon-rig-v13-live-refresh.md) | 010; ⬡-gate: blessing (never paid) | Builder · opus-high | **KILLED** 2026-08-31 (⬡) — deferred since 08-08, nobody waiting; killed with 022 at the rig re-scope; the doc keeps the lay's rulings and rebase notes for any re-lay |
| 012 | [the dispatch guard](plans/012-dispatch-guard.md) | — | Builder · opus-high | **LANDED** 2026-08-08 → [findings](plans/012-dispatch-guard.md); the hole (F2) proven and watched by arm 4 — adoption anywhere is its own row |
| 013 | [summon rig — the name-stamp](plans/013-summon-rig-name-stamp.md) | — | Builder · opus-high | **LANDED** 2026-08-22 → [findings](plans/013-summon-rig-name-stamp.md); F7 parked: the 32-key runaway guard caps one panel's seed at ~28 ordinals |
| 014 | [summon rig — the theater cycle](plans/014-summon-rig-theater-cycle.md) | 013 | Builder · opus-high | **LANDED** 2026-08-24 → [findings](plans/014-summon-rig-theater-cycle.md); smoke ⬡✓ 2026-08-29; F5 parked (the 32-key guard's cap) |
| 015 | [Belvedere — the Sovereign's deck](belvedere/README.md) (subproject; cornerstone: [plans/belvedere.md](plans/belvedere.md)) | ⬡-gate: venue D2 ⬡✓ via keel §11 | Architect · fable-max (founding) | **KILLED** 2026-08-31 (⬡ — retired: the attempt lacked the right foundation) → [the retirement notice](belvedere/README.md); the post-mortem is stigmergon's cornerstone |
| 016 | [v3 · the doctrine linter](plans/016-doctrine-linter.md) — P3's parsers harden into canon `doctrine/`: `lint` · `parse --json` · `migrate` | — | Builder · opus-high | **LANDED** 2026-08-26 → [findings](plans/016-doctrine-linter.md) |
| 017 | [v3 · the storage experiment](plans/017-storage-experiment.md) — does structured-source truth beat schema-markdown for the three consumers? | 016 · ⬡-gate: Belvedere v0 evidence — paid 2026-08-28 | Digger · fable-high | **LANDED** 2026-08-28 — **RETAIN, confirmed with numbers** → [findings + verdict](plans/017-storage-experiment.md) |
| 018 | [v3 · the great re-cut](plans/018-great-recut.md) — full-corpus migration via `doctrine migrate`, history included | 016 | Dispatcher · sonnet-medium (tends an 8-row wave of scoped Architects) | **LANDED** 2026-08-29 → [findings](plans/018-great-recut.md) |
| 019 | [v3 · doctrine v1.1 — the wave's residue](plans/019-doctrine-hardening.md): 15 evidenced tool defects fold into `doctrine/`, fixtures kept | 017 · ⬡-gate: vocabulary countersign — paid 2026-08-28 | Builder · opus-high | **LANDED** 2026-08-28 → [findings](plans/019-doctrine-hardening.md) |
| 020 | [the continuous flow — the cornerstone session](plans/020-continuous-flow.md): flow doctrine, the flow engine's law, the D64 grammar asks (kind/recommendation/branch/holder/holds), cross-building Depends-on | 017 · ⬡-gate: his call to sit | Grand Architect · fable-max | **LANDED** 2026-08-29 → [design + findings](plans/020-continuous-flow.md) |
| 021 | [the working vocabulary — the census, then the standard](plans/021-vocabulary.md): full-city term census (concepts-driven, orthography included) → Felix chooses → the standard; subsumes bless-vs-countersign; §13 on the block | ⬡-gate: his call to sit — paid 2026-08-28 | Grand Architect · fable-max | **LANDED** 2026-08-29 — **the standard blessed** → [the census](plans/021-census.md) · [STANDARD.md](canon/work/STANDARD.md) |
| 022 | [summon rig — the argv summons](plans/022-summon-argv.md): the summons composes into the prompt slot, color goes venue-native | ⬡-gate: blessing — paid 2026-08-31 | Builder · opus-high | **KILLED** 2026-08-31 (⬡) — its customer retired the same morning → [fork rulings + P2's evidence](plans/022-summon-argv.md) |
| 023 | [the law book](plans/023-law-book.md) — canon speaks the standard: DOCTRINE respelled + §13 superseded, STANDARD.md promoted, the global waggle line (live wire), templates → charge.md, rider → coda, the-city, dispatcher tombstoned | — | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings](plans/023-law-book.md) |
| 024 | [the parser](plans/024-parser.md) — grammar tokens (⬡-gate · DEFERRED · C‹n› · ⬡✓ · ignite), migrate respell rules, charges-always-staffed lint-hard, city dry-run counts | 023 | Builder · opus-high | **LANDED** 2026-08-29 → [findings](plans/024-parser.md) |
| 025 | [the respell sweep](plans/025-respell-sweep.md) — live surfaces city-wide (migrate + the graveyard); absorbs the 18-continuation (whiteboardy re-fire · snappy separators · spacex heads · bob heads — sanctions on record); history, voice, and charters fenced | 024 | Architect · opus-high | **LANDED** 2026-08-29 → [findings](plans/025-respell-sweep.md) |
| 026 | [the language linter](plans/026-language-linter.md) — the vocabulary arm: graveyard + American/grey lexicon + prefix table + the pinned 24; ancestor manny M13, food lab/021/lexicon.json | 024 | Builder · opus-high | **LANDED** 2026-08-29 → [findings](plans/026-language-linter.md) |
| 027 | [the glass](plans/027-glass.md) — Belvedere speaks the standard (deck copy, tokens, baton verbs; the ⬡-queue by name); runs on the Belvedere board, this charge is the pointer | 024 | Architect · fable-high | **LANDED 2026-08-29 — PENDING ⬡ visual pass** (relaunch the deck; the pass rides this cell as its annotation) → [findings](plans/027-glass.md); three canon asks filed |
| 028 | [the charters](plans/028-charters.md) — offices + mantles redrafted on Felix's own drafts; Fixer named, shims re-minted; the spend-fork information-needs clause rides as drafting input | 023 · ⬡-gate: Felix's office/mantle charter drafts — paid 2026-08-29 | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings F1–F33](plans/028-charters.md) |
| 029 | [the summon harness](plans/029-summon-harness.md) — `lab/008/run` follows `presets.tsv` after the `d dispatcher` retirement; 013-F1's guard gains its removal arm | 025 | Builder · opus-high | **LANDED** 2026-08-31 — met on master by later hands; E1 ruled 2026-08-31 by Felix; branch REJECTED at [G2](plans/g2-029-merge.md), closed at [037](plans/037-removal-arm.md) |
| 030 | [the master-doc prose sweep](plans/030-master-doc-prose.md) — the outer city's five big master docs speak the standard in prose, plus this repo and every tail the charge named | 025 | Architect · opus-high | **LANDED** 2026-08-29 → [findings F1–F11](plans/030-master-doc-prose.md); 636 hits, 14 named exemptions; the rulings F1–F7 bind the next sweep |
| 031 | [doctrine v1.2 — the defects](plans/031-doctrine-defects.md) — migrate's stale-parse lie · house-dialect rules · the prefixed-D blind spot · the kickoff arm | — | Builder · opus-high | **LANDED** 2026-08-29 → [findings](plans/031-doctrine-defects.md); suite 71 → 80; the one unmet `Done when:` bullet (lint 3, not 0) cleared by later hands — lint reads 0 at 2026-08-31 |
| 032 | [the flow grammar](plans/032-flow-grammar.md) — D74 built: written holder · holds · E-ids · Branch · encapsulation · qualified Depends-on · tier split | 031 | Builder · opus-high | **KILLED** 2026-08-31 — flow-1 abandoned before ignition (belvedere:D22); scope moved to [036](plans/036-grammar-debt.md); the D74 spec waits in [its doc](plans/032-flow-grammar.md) |
| G1 | [flow-1's close gate](plans/g1-flow-close.md) — verify the four landings, merge 029's branch, distill, hand the verdict card | 029; 030; 031; 032 | Architect · fable-high | **KILLED** 2026-08-31 — the flow it closed was abandoned (belvedere D22); 029's merge survives as [G2](plans/g2-029-merge.md) |
| 033 | [the canon landing](plans/033-canon-landing.md) — the D76-blessed roster lands: GUILD.md + six charters (fixer minted), the fixer/mentat shims (live sync), README roster + grammar + template, DOCTRINE §12's kickoff | 028 | Builder · opus-medium | **LANDED** 2026-08-29 → [findings](plans/033-canon-landing.md); F3's wrap ruling owed — rides the next charter sweep |
| 034 | [the register purge](plans/034-register-purge.md) — the constitution consolidated: D1–D76 killed whole, the homeless clauses distilled, the skills shims purged | 033 · ⬡-gate: his call to sit — paid 2026-08-29 | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings](plans/034-register-purge.md) |
| 035 | [the master-doc purge](plans/035-map-purge.md) — MAP re-cut with 034's blade: LANDED charges compress to status + findings link, spent batch notes die, dead numbers strip; live holds survive verbatim | 034 | Grand Architect · fable-max | **LANDED** 2026-08-29 → [findings](plans/035-map-purge.md) |
| 036 | [doctrine v1.3 — the grammar debt](plans/036-grammar-debt.md) — seven evidenced parser/lint defects: the spent mask, the written holder, `Next: none`, the body-text splitter, the `bv/*` register skip, `classifyBaton ⬡`, the BOARD.md reader | — | Builder · opus-high | **LANDED** 2026-08-31 → [findings F1–F6](plans/036-grammar-debt.md); suite 80 → 87; verified 2026-08-31 — the one unmet bar is belvedere's doc defect (F2) |
| G2 | [029's merge gate](plans/g2-029-merge.md) — verify the branch harness FINISHED green, merge `bv/029-summon-harness`, reconcile 029 | — | Architect · opus-high | **LANDED — REJECTED `f160ec1`** 2026-08-31 → [findings F1–F5](plans/g2-029-merge.md); salvage laid as [037](plans/037-removal-arm.md); E1 ruled 2026-08-31 by Felix |
| 037 | [the removal arm](plans/037-removal-arm.md) — 029's one surviving deliverable: 013-F1's guard proves the harness follows a preset **removal**, not just an addition | — | Builder · opus-high | **LANDED** 2026-08-31 → [findings F1–F4](plans/037-removal-arm.md); harness 215 PASS, verified 2026-08-31; `bv/029-summon-harness` deleted at `f160ec1` |
| 038 | [the stamp cycle](plans/038-stamp-cycle.md) — `summon.zsh` derives the cycle from the register (rows at-or-under the fire cwd; Name over dir-name; sticky law kept); `.summon-theaters` support removed, bob's file deleted at landing; the word "theater" dies in the rig's surfaces; lab/008 arms extended | — | Builder · opus-high | **LANDED** 2026-08-31 → [findings F1–F9](plans/038-stamp-cycle.md); harness 228 PASS (control 215); F4 is the trap to carry |
| 039 | [the register arm](plans/039-register-arm.md) — the doctrine parser reads `canon/BUILDINGS.md`; `discover()` roots from it (buildings walked, hosts listed); qualified-id resolution binds to Names; JSON surface stigmergon consumes (their D15 unblocks) | — | Builder · opus-high | **LANDED** 2026-08-31 — `doctrine buildings`, suite 87 → 94; F5 filed a latent worktree-dedup hole |
| 040 | [the id respell](plans/040-id-respell.md) — D80 built: `doctrine migrate` derives the respell table from the board and respells the building whole, history and filenames included; 39 docs + 6 lab dirs renamed; the `✓ Felix` → `⬡✓` mark with it (D81's first act); the parser reads the new form; stigmergon's dry run is the control | — | Builder · opus-high | **LANDED** 2026-09-01 → [findings 040-F1–F9](plans/040-id-respell.md); the building speaks D80 whole; suite 94 → 102; F2 · F6 · F7 · F8 bind the next respell |
| 041 | [the statement and the caps](plans/041-statement-caps.md) — D82 built: `doctrine statement` renders every `⬡ go` with its interest; D78 enforced — LANDED / KILLED status cells over 200 characters lint-hard, ledger entries over 150 words lint-warn | ⬡-gate: his word — paid 2026-09-01 | Builder · opus-high | LANDED 2026-09-01 → [findings F1–F10](plans/041-statement-caps.md); the statement and the caps live; suite 102 → 109; lint red on purpose — 33 cells, 166 entries; the prune is G3's |
| 042 | [the grid prune](plans/042-grid-prune.md) — `canon/agents/` keeps the tiers a board or the rig has named (the census in the doc); the README's grid law becomes mint-at-the-lay; the delete lands ×3 | ⬡-gate: his word and the live wire — paid 2026-09-01 | Builder · opus-medium | LANDED 2026-09-01 → [findings F1–F10](plans/042-grid-prune.md); 8 retired, 12 stand, wire green ×3, lint unchanged. F4 escalates: `haiku-low` fails the rule, is the last Haiku |
| 043 | [the citation respell](plans/043-citation-respell.md) — D81 applied to the purge: 111 citations of 39 killed D-entries on the live canon respell to the section that carries each law, by the converter; history keeps its names | ⬡-gate: his word — paid 2026-09-01 and the amendment 2026-09-02 | Builder · opus-high | LANDED 2026-09-02 → [findings F13–F18](plans/043-citation-respell.md); 114 citations respelled on the fence — 45 by hand, 69 by `doctrine citations`; census 0, suite 109 → 121, lint unchanged |
| G3 | [Review gate — the tender's first batch](plans/g3-tender-review.md) — 041 · 042 · 043 verified against their bars; the board pruned to D78's cap; three rulings pre-chewed (042-F4 · 041-F3 · 041-F10); the baton to ⬡ | 041; 042; 043 | Architect · fable-high | **LANDED** 2026-09-02 → [findings F1–F11](plans/g3-tender-review.md); three kept, three rulings, two grants; lint 19 (belvedere only), suite 122 |
| 044 | [the boot pack](plans/044-boot-pack.md) — `doctrine boot ‹root›`: what a cold session needs, derived from the books at every call, verbatim where it quotes; the law follows at G4 | — | Builder · opus-high | OPEN — laid 2026-09-08 |
| 045 | [the baton's fields](plans/045-baton-fields.md) — `Baton.shape` · `recommendation` · `type` · `named` typed on the parser; `boot` and the docket read them; a fork with no recommendation lints | 044 | Builder · opus-high | OPEN — laid 2026-09-08 |
| 046 | [the lint gaps](plans/046-lint-gaps.md) — `board.gate-kickoff`; the kickoff arm reads the marked fence; an explicit root keeps its own ledger (039-F5's hole, simmy G21's case) | — | Builder · opus-high | OPEN — laid 2026-09-08 |
| 047 | [the unwrap](plans/047-unwrap.md) — D88 built: `doctrine migrate` joins a paragraph's hard-wrapped lines; the word law and the fixed point asserted; run over agents whole, `--summary` for the reader | — | Builder · opus-high | OPEN — laid 2026-09-08 |
| 048 | [the ledger's aging](plans/048-ledger-aging.md) — `doctrine prune`: entries past the last twenty move verbatim to `ledger-archive.md`; the parser reads both; a register past 30 KB warns | — | Builder · opus-high | OPEN — laid 2026-09-08 |
| G4 | [Review gate — the parser's second opening](plans/g4-parser-review.md) — 044 · 045 · 046 · 047 · 048 verified against their bars; the prune check; the blessed law pasted under its grant; three rulings pre-chewed; the baton to ⬡ | 044; 045; 046; 047; 048 | Architect · fable-high | OPEN — laid 2026-09-08 |


**Batch — the parser's second opening (laid 2026-09-08, grand-architect-24; his ⬡✓ on
fork (b) in the room; 047 and 048 joined on his bless the same sitting):** 044 → 045 →
046 → 047 → 048 → G4, serial, one checkout on `master`, `tender: sonnet-medium ·
plans/TENDER.md`. The order is schedule (046, 047 and 048 share no edge): the boot pack
lands first because it is the ask; the unwrap runs late so it respells the batch's own
docs once. The tender pauses at G4's close — ⬡ verifies
— and at any escalation. Red inside: the boot law's paste at G4 — pre-blessed on the text
(044, *The law at the landing*) or it waits. Green's bar: `bun test` green at HEAD and
`doctrine lint ~/code/agents` naming only belvedere's nineteen. Ignition: on his word —
`plans/TENDER.md`'s fence, then this note, verbatim.

**Deferred (tracked, not lost):**

- doctrine residue — one charge when the parser next opens: ~~the worktree-dedup
  split-search hole~~ promoted to 046 (2026-09-08, with simmy G21's live case) — and
  the currency alarm (D81): the vocabulary arm's history fence narrows to
  speech, so token rows (dead ids, marks, compounds) read history too and a respell
  that missed a form is caught.
  — and the qualified id in the ledger head's slot (040-F4): `isId` rejects `:`, so
  `(belvedere:C7)` would fall out of the head into the body; the two belvedere heads
  (`LEDGER.md` 2086, 2151) stand as a dead, unregistered building's addresses — open
  the slot when a live building writes one.
  — and 040's second adoption (stigmergon's Architect, inbox 2026-09-01, cleared at
  grand-architect-22): the case-folded lettered rule reached a session-id fixture
  (`'session:s1'` → `'session:001'`) and a scratch shot — the lowercase form is an
  address only as a slug (`(?<=lab/)‹key›|‹key›(?=-)` would say so); and the walk's
  fence is silent — a skipped non-text file or fenced directory should be named in
  the run's output, so the supervised layer can see what the machine kept out.
  — and the dead-citation alarm (043-F8; inbox 2026-09-01, ruled at grand-architect-23):
  a `D‹n›` on a live surface that `DECISIONS.md` no longer carries warns — the live set,
  never a floor, since D78 kills leave gaps. It cannot be built where the linter stands:
  `building.ts` classifies `DOCTRINE.md`, `STANDARD.md`, the charters, `docs/*.md` and
  the templates as no artifact, and `isLawBook` fences `canon/` from every arm that reads
  forms as data — so the canon's own law surfaces are read by no arm. The alarm needs a
  law-surface class in discovery that the form arms read and the vocabulary arm stays
  fenced from (STANDARD §8) — a discovery charge, when the parser next opens.

- The effort axis — one sentence for the mantles README's grid section: the model buys
  instincts, effort buys search; low effort on a strong model is the bulk-verdict niche
  (grand-architect-22, 2026-09-01; evidence in 042's census).
- The index-import test — the consumer's false-green guard on the doctrine package's
  index (grand-architect-22, 2026-09-01; the index defect landed by
  architect-stigmergon-04, inbox cleared at 22c1696).

- The peer-messaging experiment (SendMessage taps between live sessions —
  gate-delivery pokes, cross-account bulletin pokes; pointers-not-payloads,
  message-never-summons; the plane is OS-user-scoped and crosses all three accounts,
  ephemeral, no audit trail) — Felix 2026-08-08: canonize later; capability map,
  probe spec, and the Quartermaster deliberation in
  [plans/quartermaster.md](plans/quartermaster.md). The bulletin stands untouched.
- lab/008 residue — one charge when the harness next opens: the typed-literals arm
  (029-F4 — assert every `● [x]…` literal in `lab/008/run` names a live `PKEY`, plus
  a sibling over `drive.exp`'s presses) · the `run:407` dead assertion (its subject
  file is created at line 413, after it fires) · `count`'s silent-0 on a missing
  file (G2's find, 2026-08-31).
- The belvedere purge — delete the retired `belvedere/` subtree and prune the
  belvedere-era `plans/` docs from this repo once stigmergon has extracted its
  salvage (engine, camera, gates, fixtures, census); git is the archive (D78).
  Felix's word 2026-08-31 at stigmergon's founding ("cleanup all the belvedere
  garbage").

- The staffing retrospective — the batch report gains the tier and the meter's cost
  per charge, read at every review; and one controlled experiment before any default
  moves: a review gate at opus-high beside one at fable-high, a Digger charge with a
  control. Felix, 2026-09-01: the idea stands, not the time — the next optimization
  pass. Evidence on record: the census in [042](plans/042-grid-prune.md), the meter
  in stigmergon's inbox, seven in ten output tokens Fable's.
- A `t` preset in the rig — a bare sonnet-medium session opened with
  `plans/TENDER.md`'s fence and the live batch note in its first prompt — laid after
  the tender's first run proves the shape (D83); until then the paste is by hand.
