# Issues — the incident inbox

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format: `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.

---

- 2026-09-01 · Builder (043) · **the vocabulary arm cannot see `canon/`.** For the agents
  building `lawSurfaces()` yields exactly five files — `BOARD.md`, `CLAUDE.md`, `MAP.md`
  and two live charge docs — so `DOCTRINE.md`, `STANDARD.md`, the charters, `docs/*.md`
  and the templates are read by no arm. Two causes, both deliberate for other reasons:
  `isLawBook` fences the whole `canon/` directory (a book that may not name a form cannot
  define it), and `building.ts`'s walk classifies those files as no artifact — `PROSE_DOCS`
  is the master doc and `CLAUDE.md` **at the anchor's own directory**, and `SKIP_DIRS`
  skips `templates/`. Consequence: the graveyard, the spelling lexicon and the pinned
  formulas are unenforced on the canon itself, which is where the law is written. Evidence
  and the probe in [043-F8](plans/043-citation-respell.md).
- 2026-09-01 · Builder (043) · **D67's announce duty has no live home.** "Announce every
  dispatch" survives only inside `canon/mantles/dispatcher.md:82`, whose head declares the
  body "preserved as history, unedited". No live document carries it; DOCTRINE §10
  inherits only the batch-report format. Unhomed until the flow engine's charter lands —
  [043-F11](plans/043-citation-respell.md).
