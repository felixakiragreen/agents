# Issues — the incident inbox

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format: `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.

---

- 2026-08-29 · grand-architect-18 · doctrine lint's building register counts
  flow-minted worktrees as buildings: `.claude/worktrees/bv/c29-summon-harness` at
  the same commit as master still doubles every total (2 buildings → 4, 84 rows →
  168; any future red would double too). The charge-16 rule says a worktree
  checkout is skipped unless its branch put a board where the mainline has none —
  the implementation evidently keys on the `worktree-agent-*` shape, so `bv/*`
  branches slip it. Repro: current tree, `doctrine lint ~/code/agents`. Candidate
  home: C31 gains a fifth item, or the flow venue work — the next sweep rules it.

---

- 2026-08-29 · c31-builder · **belvedere's C1 charge doc lies about its own state, and its
  fence is pre-door.** `belvedere/plans/c1-fence-repoint.md:3` reads `**Status:** OPEN —
  laid 2026-08-29`; `belvedere/README.md:243` reads `**LANDED** 2026-08-29` for the same
  charge (commits `68b953b` + `ba2ed0b`, findings pasted in the doc). The doc therefore
  still advertises itself as ignitable, carrying `Wear ~/code/agents/canon/mantles/builder.md,`
  at `:63` — a pre-door fence C31's new kickoff arm reports as `kickoff.door`, and the only
  reason `doctrine lint ~/code/agents` reads 3 instead of 0 (with C29's live `ledger.baton`).
  Belvedere's batch-6 sweep repaired six fences + G3 + the tender at `389d0a7` and missed
  this one because the doc reads closed to a human and open to the parser. Either repair is
  one line and both are belvedere's Architect's; C31's fence forbids editing a building's
  files. Repro: `bun doctrine/cli.ts lint ~/code/agents`.

---

- 2026-08-29 · c31-builder · **20 live pre-door fences across the city, each its own
  building's sweep.** C31's kickoff arm's first walk: `bun doctrine/cli.ts lint ~/code` →
  `20 kickoff.door` — snappy 9 (`plans/12-quick-pair.md`, `19-paste-undo.md`,
  `20-quiescence-fuzz.md`, +6) · simmy 4 (`spikes/b16-verdict-honesty.md` ×2,
  `b17-jar-identity.md`, +1) · manny's `user-manual` worktree 3 (`plans/06-linter.md`,
  `25-residual-walk.md`, `29-campaign-id-lint.md`) · cap-mega `docs/units` 2
  (`plans/07-venue-maturation.md:106`, `08-fg2-findings.md:309` — both wrapped summonses
  that will want re-laying, not a one-line insert) · belvedere 1 (above, counted twice).
  Every one is a live charge doc whose kickoff would fire without the door. Not a defect in
  this repo; filed so the sweep is scheduled rather than discovered at the next ignition.

---

- 2026-08-29 · c31-builder · **bob's `catalog` campaign is invisible to the register, and it
  is the one place C31 item 3's widening would have shown.** `docs/campaigns/catalog/README.md`
  carries `## Decisions`, `## Board`, `## Inbox`, `## Ledger`, but its board header reads
  `| row | what | deps | staffing | status |` — not the canonical five — so the walk never
  promotes the directory and its five `C-D‹n›` decisions are never read. Measured directly,
  bypassing the register: pre-C31 `0 candidates`, C31 `5 candidates · 0 parsed ·
  decision.colon ×5` (the entries spell `- **C-D1** (2026-08-28, …) — <body>`, an em-dash
  where §8 wants the colon). Two questions for the sweep, neither C31's: does the register
  read a renamed-column board, and is `- **ID** — <text>` (bob's other 48 prefixed-D
  bullets, which carry no attribution at all) a decision shape the reader should learn?

- 2026-08-29 · C30 Architect (the master-doc prose sweep) · **three live-prose vocabulary
  sets in this repo that C30's fence forbade it from touching, each named with its
  owner.** (1) **`plans/c32-flow-grammar.md` — 4 hits** (`the glass` ×2 → the deck, `the
  register` → a named register, `countersigns` → blesses, lines 10 · 20 · 54 · 78) and
  **`plans/g1-flow-close.md` — 1** (line 18, a near-paraphrase of pinned formula 16, "a
  claim without its pasted evidence is not a landing"): both charges sit in
  agents-flow-1's own batch, so C30's guard (1) routes them here instead of editing
  another session's desk — C32's and G1's own sessions should take them on the way past.
  (2) **`plans/18-great-recut.md` — 11 hits**, a LANDED charge doc: fenced as history by
  C25's fence, but the vocabulary arm still reports it, so every future `--vocab` reader
  will re-find it. Either the arm's closed-charge mask needs to key on a `**Status:**`
  line that opens `LANDED` (it evidently does not today), or the doc wants an explicit
  fence marker — a `doctrine` question, not a prose one.

- 2026-08-29 · C30 Architect · **Belvedere's own README and its six OPEN batch-6 charge
  docs carry ~130 live-prose dead words, and the arm did not exist when C25 and C27
  passed through.** `doctrine lint --vocab ~/code/agents` (worktrees excluded) reports
  130 in `belvedere/README.md` alone plus ~26 across `plans/b22`–`b27` and
  `plans/c1-fence-repoint.md`. The bulk is three of Belvedere's own domain words colliding
  with the graveyard: **`fire`** (the engine's noun — "where a fire lands", `hands/fire`,
  "a live fire's post-create audit"), **`the glass`** (the building's own name for itself,
  which §9 buries in favour of *Belvedere / the deck*), and **`the register`** (§7 says a
  register is always named). Those are not misses a prose sweep can rule — respelling
  `fire` would fork the deck's copy from its code, and renaming `the glass` is the
  building's own identity. **Filed to Belvedere's inbox too**; its Architect owns it, and
  it is the natural successor charge to C27.

- 2026-08-29 · belvedere Architect · the C31 kickoff arm flags SPENT fences:
  `belvedere/plans/c1-fence-repoint.md:63` (C1 LANDED, batch 7 closed) reds
  `kickoff.door` on master. The kickoff law forbids editing an ignited kickoff, so
  the red is unfixable doc-side without new law — either the arm exempts spent
  charges (C25's live/spent rule, the vocab arm's own precedent) or canon rules
  that door repairs reach history. Same calibration family as the bv/* counting
  entry above. Belvedere's red stands until ruled.
- 2026-08-29 · Architect (summon colours) · `presets.tsv` now speaks REAL colours
  (builder blue, digger orange; commit 7973440), so belvedere's
  `glass/colors.ts` `INTENT_OF` inversion — built for the old ANSI words — now
  maps rig-sourced words wrong (`blue`→felikai orange). Felix ruled belvedere
  out of this session's scope (mid-rework); the rework should collapse the
  inversion to an identity lookup and true its tests (`colors.test.ts:21-23`,
  `composer.test.ts:329`, `shelf.test.ts:201`).
- 2026-08-30 · v3 Architect · **The auto-mode classifier blocks charge-sanctioned
  actions — twice at C6, and it recurs by design at C7/C8** (C6 F9; the landing
  named this report wanted, the v3 fence forbade the Builder to write it). C6's
  harness refused (a) reading C4's transcript out of `~/.claude` — bar 10's own
  copy step, named in the charge — and (b) `git add` of both committed-by-design
  fixtures (`demo-run.jsonl`, a machine-generated log; `PROVENANCE.md`, which
  names a `~/.claude` path); Felix ran both by hand. C7 commits barrage fixtures
  and red reports; C8 reads real config dirs as its whole point. Wants a ruling:
  a per-charge pre-authorization shape — allowlist entries riding the charge, or
  a named `!` protocol in the kickoff — so a sanctioned action stops costing a
  human round-trip per file.
  Evidence 2026-08-30, Felix's word at the batch-6 dispatch, verbatim: "We'll
  need to figure out how to handle these whole classifier problems in Belv in
  the future. This is extremely tedious-- too many false positives. They're
  just trying to do basic git and cd and bash commands." Two classes now in
  the same entry: classifier false positives on benign commands (pure tax),
  and the genuinely-guarded class (`~/.claude*` reads, fixture adds) needing a
  sanctioned per-charge bypass shape. Note: repo `settings.local.json` carried
  `Bash(git *)` / `Bash(cd *)` allow rules (2026-08-30 10:33) and blocks were
  still observed — syntax-vs-classifier question dispatched to the guide, its
  answer lands in the v3 review session's report of this date.
