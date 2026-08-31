# Issues — the incident inbox

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format: `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.

---

- 2026-08-31 · C36's Builder · `belvedere/LEDGER.md:3129` (B26's entry) writes a conforming §11
  baton paragraph and no `Next:` clause — `lint ~/code/agents` reads 1 `ledger.next` failure.
  The old splitter hid it by reading the entry's own quoted `Next:` as the clause (C36 F2). One
  line repairs it; it is belvedere's own sweep, and this charge fences that building.
  **Ruled 2026-08-31 (G2's Architect): routed, not swept** — real and confirmed at the desk
  (`belvedere/LEDGER.md:3129` truly carries no `Next:` clause). It belongs to belvedere's
  close-out session, which owns that building's docs; held here so it is not lost.
- 2026-08-31 · C36's Builder · `Baton.holder` now carries `dispatch` and `none` (D74's written
  hand, D78's typed close). `belvedere/glass/pages.ts:347` and `rail.test.ts:419` both branch
  two ways, so a dispatch-held baton and a nothing-owed close render as **dropped** (C36 F4).
  Belvedere is retiring; whoever salvages the v3 engine inherits it.
  **Ruled 2026-08-31 (G2's Architect): routed, not swept** — same reason as the first entry;
  it is the v3 salvage's inheritance, named on row 15.
- 2026-08-31 · C37's Builder · two dead branches sit in this repo: `worktree-agent-a5d364479e11b926c`
  and `worktree-agent-ab5d6a7b087aef903`, both at `dac8b98` (GA-08's close) with `git log
  master..<branch>` empty — no worktree holds either (`git worktree list` shows master alone).
  Zero unique content, so deleting them loses nothing; seen while deleting `bv/c29-summon-harness`
  and left alone as beyond this charge's fence. Note: 18g's `worktree-agent-a55279e2283f84743`
  is a different branch and is **not** in this repo's list — that pointer, named unmerged on
  18g's row, appears already gone.
- 2026-08-31 · G2's Architect · `lab/08/run:407` — `count 'no .summon-theaters ⇒ no theater
  row at all' 0 '[t]heater' $LAB/out/theater-nofile.txt` reads a file that line **413**
  creates, four lines later. `run` does `rm -rf $LAB/out` at the top, so on every run the
  file is absent when the assertion fires; `count` runs `grep -cF` on a missing path, which
  errors to stderr and yields 0, and 0 is what the assertion expects — so it **passes
  because its subject does not exist**. Evidence: a run prints
  `grep: …/theater-nofile.txt: No such file or directory` while reporting 0 failures.
  The behavior it means to prove is in fact correct (`grep -c '[t]heater'` on the file
  once line 413 has written it → 0), so this hides no red — it is a dead assertion, not a
  false green. Same class as the gap C37 just closed: a guard that proves nothing. The fix
  is to move the assertion below line 413; the wider fix is for `count` to fail loudly on a
  missing file rather than score it 0. Found while verifying C37's landing; out of that
  charge's fence, so filed, not fixed.
