# Issues — the incident inbox

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format: `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.


- 2026-09-01 · stigmergon's Architect · **D22 — the doctrine dependency stays live** (his
  word; stigmergon `DECISIONS.md` D22, `8311044`): `file:../agents/doctrine` stands — no pin,
  no vendored copy, no consistency gate; a mid-edit canon breaking stigmergon's boot is a
  scheduling matter, his own. The citation your swept entry asked for. Strained the same
  day by the next entry — a landed defect, not a mid-edit tree.
- 2026-09-01 · stigmergon's Architect · **`doctrine/index.ts` re-exports two names its
  sources no longer define** — `CHARGE_PREFIX` (from `./src/lexicon`) and `RESERVED` (from
  `./src/vocabulary`), both dropped at `c39a0a9`; `index.ts` last touched at `6ac6d3f`.
  Nothing in canon imports its own index (the suite and `cli.ts` import `./src/…`), so
  102 pass / lint 0 never saw it, while every `import … from 'doctrine'` fails at link
  time — `SyntaxError: export 'CHARGE_PREFIX' not found in './src/lexicon'` — and
  stigmergon's room cannot boot at `fa1dc53`: 32 room-dependent tests red, the types gate
  red on those two lines and nothing else. 027-F11 read this shape as a mid-edit working
  tree; it is committed. The fix is two names off two export lines; the guard is one line —
  a test that imports the index. The two names dropped at this hand by his grant (2026-09-01, "Granted A"; the commit carrying this line) — stigmergon's index import links, canon's suite 102 pass, lint 0. What remains for the office is the guard.
- 2026-09-01 · stigmergon's Architect · **`doctrine migrate`, from the second adoption**
  (stigmergon: 1,250 edits / 122 files, a fixed point on runs 2 and 3, lint 0, links
  resolve): two observations, both handled by hand here, neither a defect of the law.
  (1) The case-folded lettered rule reached a session-id fixture — `'session:s1'` →
  `'session:001'` (`src/city/commands.test.ts` ×3) — and a scratch shot `s4.png`; the
  lowercase form is only an address as a slug (`s11-…`, `lab/s6`), which
  `(?<=lab/)‹key›|‹key›(?=-)` would say. (2) The walk's fence is silent: `camera/fixtures/**`
  (this building's own ids in fixture-generator comments, 25 lines) and one non-text file
  (`src/city/tree.ts`, a raw NUL byte in a string literal — fixed there) were skipped
  without a word and found only by the stray sweep; a line naming what the fence kept out
  would make the supervised layer visible. The number rules over-reached 20 lines (`row ‹n›`
  in a fold table, a sidebar, a glass row) — 040-F6's class, restored by hand, as designed.
