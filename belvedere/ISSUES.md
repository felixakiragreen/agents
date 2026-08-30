# Issues — Belvedere's incident inbox (D53 pattern)

Field reports, render failures (parser-as-lint, [README §1](README.md)), and
sovereign-inbox entries (D63: `- <date> · Felix (via Belvedere) · <what>`) land
here — Felix's hand, a session's at his word, or the deck's third write
([README §2](README.md)). Entry format (D63): `- <YYYY-MM-DD> · <who> · <what>` —
one bullet per entry; an entry needing evidence becomes a `---`-separated block
opening with that line. This building's Architect sweeps at every session: each
entry ruled — distilled, laid as a charge, rejected, or escalated (canon-shaped
entries go to the canon repo's inbox) — then deleted; entries are committed before
the inbox is cleared. A cleared inbox is empty.

- 2026-08-29 · C30 Architect (the canon's master-doc prose sweep) · **this building is
  the city's largest remaining body of live-prose dead vocabulary, and it is mostly a
  domain collision, not a backlog.** `doctrine lint --vocab ~/code/agents` (worktrees
  excluded) reports **130 hits in `README.md`** and ~26 more across `plans/b22`–`b27` +
  `plans/c1-fence-repoint.md`. C25 and C27 both passed through before C26's vocabulary
  arm existed, so nothing was missed by hand — the arm simply sees more. Three of the
  four biggest classes are Belvedere's own words: **`fire`** (~30 — the engine's noun,
  "where a fire lands", `hands/fire`, "re-fires a step whose log says `fired`";
  respelling the prose without the code forks the deck's copy from its API), **`the
  glass`** (~10 — the building's own name for itself, which §9 buries in favour of
  *Belvedere / the deck*: a genuine identity question, and B24/B25's specs use it as a
  subject), and **`the register`** (~5 — §7 rules that a register never stands bare;
  each of these needs its name). The fourth is ordinary and cheap: `cut` (~20), `keel`
  (~8 — the cornerstone rename C23 already made canon), `DoD` (~6), `parked` (~5),
  `CLOSED` at campaign altitude (~4), `Dispatcher` (~8, several inside live batch notes
  — C25's live/spent rule governs), plus `colour`/`coloured`/`labelled` and one `trued`.
  C30's fence was the outer city's five master docs plus this repo's MAP and OPEN charge
  docs, so it could not take this; it is the natural successor charge to C27, and the
  `fire` and `the glass` questions are ⬡-shaped — they touch code and identity, not
  spelling.
---

- 2026-08-29 · Architect (the flow-1 diagnosis, ⬡ present) · **Fenced evidence amends
  the flow — the positional kickoff pointer is fragile against the Guild's own
  evidence discipline.** c31's Builder closed by pasting fenced `Done when:` output
  into its own charge doc (agents a11c080: `plans/c31-doctrine-defects.md` went 1
  fence → 12, and fence #1 is now `bun test` output). The flow quotes c31's kickoff
  as `{doc, fence: 1}` — positional — so the resolved kickoff bytes silently became
  test output, the step hash moved, and the engine paused all new fires at 20:45:59
  ("c31 was edited since the arm"); c32 could never fire, even after every root
  landed. The pause itself is correct (D10 / B10 F2 — never authorize bytes nobody
  re-read); the defect is that the ordinary close ritual of every charge amends any
  flow quoting its doc. Candidate shapes for the ruling: quote the kickoff by the
  summons grammar (the door line finds it) rather than by ordinal; or the charge
  template pins the kickoff as the doc's LAST fence and the pointer follows; or the
  bless snapshots kickoff bytes and evidence-only doc growth joins like scope-arm.
  Evidence: run log `agents-flow-1.run.jsonl.stopped-2026-08-29-2124` (paused
  20:45:59, c31 landed 20:46:44, c30 landed 21:04:04), agents a11c080, `flow.ts`
  §the fence.

---

- 2026-08-29 · Architect (the flow-1 diagnosis, ⬡ present) · **A worktree lane has
  no live landing sensor — board-by-master plus merge-gated-on-landing is a
  circle.** c29 (venue `bv/c29-summon-harness`) finished its work (branch at
  f160ec1) and could never land: the census sensor needs gone-with-Stop and an idle
  TUI's pid stays alive (its last event was the `Notification` nag); the board
  sensor reads the register's MASTER checkout, where C29 stays OPEN until a merge —
  and the merge gate g1 *depends on* c29 landing. A worktree step's only reachable
  exit is its timeout (240 min → pause-and-surface), i.e. every worktree lane ends
  as a stall by construction. Needs a ruled sensor: the branch-side row lands the
  step, or the Builder's row update is master-side by law, or the gate's dependency
  reads "work done" (commits present) rather than "row LANDED". Interim law is
  B11 §4 / keel §5.1; DOCTRINE §10 worktree law binds the venue side.
  Evidence: run log (c29 fired 20:24:04, no landing by 21:24), census sids
  82b9b4dc/a47e6f95/a3732bea all pid-alive, `git worktree list` f160ec1 vs master
  94f94f6, MAP.md:120 OPEN both sides.

---

- 2026-08-29 · Architect (the flow-1 diagnosis, ⬡ present) · **c29's Builder marked
  no row anywhere** — C29 reads OPEN on master AND on its own branch; the work
  exists (f160ec1) but no status moved. Smaller than the sensor gap above and
  distinct from it: even with a branch-side sensor ruled in, this session would not
  have landed. Candidate home: the charge template / coda gains the closing line
  "your last commit trues your row's Status" (canon-shaped — likely escalates to
  the canon inbox at the sweep); c29's own charge doc is the repro.
- 2026-08-29 · Architect (v3 founding) · `doctrine lint` reds `kickoff.door` ×1 on LANDED [plans/c1-fence-repoint.md](plans/c1-fence-repoint.md):63 ("Wear" opens, no door line) — the sweep rules: are landed kickoffs lintable history, or does the doc get a form fix?
- 2026-08-29 · Digger (C4 headless physics) · **P5 F5.2's "haiku is not a legal
  model for an unattended step" is too broad — the rule is per (model, posture),
  not per model.** Measured headless: haiku cannot hold `auto` (silent fallback to
  `default`, then auto-denial), but holds `acceptEdits` and `bypassPermissions` and
  does the work — `belvedere/v3/lab/c4/captures/q4-{auto,acceptEdits,bypassPermissions}-haiku-personal`.
  B10's schema / B11's fire gate would refuse a legal configuration as written.
  Filed not applied: the v2 engine is outside C4's fence and frozen until G4;
  C6 inherits the corrected rule via [v3/plans/c4-headless-physics.md](v3/plans/c4-headless-physics.md) F6.
- 2026-08-29 · Digger (C4 headless physics) · **`exit 0` + `result.subtype:"success"`
  + `is_error:false` does not mean a headless step did its work** — under `default`,
  `manual` or `dontAsk` a permission-needing call is **auto-denied**, not stalled, and
  the turn still reports success. The truth signal is `result.permission_denials[]`.
  Any v2 or v3 code that lands a step on exit code is wrong by construction.
  Evidence: `belvedere/v3/lab/c4/grammar.md` §4 (ten-row posture matrix, all exit 0).
- 2026-08-29 · Builder (C5 the fake claude) · **grammar §10.9's merge detector is
  falsified by C4's own capture** — parse rule 9 says "`queued_turn_count > 0` in
  a result means turns were merged"; the unpaced arm-B run it rests on
  (`v3/lab/c4/captures/q2-b-personal`) produced 2 results for 4 messages with
  **both** reporting `queued_turn_count: 0`. A detector written to rule 9 never
  fires. The sound signal is arithmetic — fewer results than messages sent.
  Filed not applied: amending `v3/lab/c4/grammar.md` §3/§10.9 is the Architect's.
  C5 ships both shapes so either detector has something to fire on
  (`armb-merge-trap` measured, `armb-merge-trap-queued` assumed); evidence and the
  jq one-liner in [v3/plans/c5-fake-claude.md](v3/plans/c5-fake-claude.md) F1.
- 2026-08-29 · Builder (C5 the fake claude) · **`SessionStart` hook events are
  emitted without `--include-hook-events`** — grammar §1 puts the whole hook
  lifecycle behind that flag; nine captures with faithfully-recorded flagless argv
  (`q3-schema-*`, `q5*-headless*`, `q6-*-resume`) each carry exactly one
  `SessionStart:startup` / `SessionStart:resume` pair and nothing else. The flag
  gates `UserPromptSubmit` / `PreToolUse` / `PostToolUse` / `Stop` only. The fake
  follows C5's spec (all hooks behind the flag), so a C6 parser hardened only
  against it will meet an unexpected `SessionStart` pair on every real unflagged
  invocation. One line in `v3/fake-claude/run.ts` once ruled;
  [v3/plans/c5-fake-claude.md](v3/plans/c5-fake-claude.md) F2.

---

- 2026-08-30 · Felix (via the v3 review session) · **Future expansion, campaign-scale:
  the unified conversation archive — every account's transcripts mirrored to one
  place.** His word, verbatim: "I have considered copying every conversation from all
  the accounts into a unified place -- for 2 reasons: easier access & searching across
  all accounts: especially when I have to add more (inevitable when belv unlocks
  greater capacity); backups: if a config is cleared, I want to have a stored record."
  Ruled at his word: filed as a future campaign, not laid now.
  Evidence the need is real: C11 F1 (2026-08-30) — the real-transcript corpus lives
  only in the live account dirs, mortal, nothing in the repo pins it; a cleared config
  dir takes the history.
  The shape as assessed at filing (the future lay re-tests it): backup and search want
  different designs — the unified place is an **append-only mirror, derived, never
  authoritative** (truth stays in the account dirs while sessions live; the mirror
  serves the dead, the cleared, and the search index). Cron work, not agent work: an
  incremental byte-true mirror `<archive>/<account>/<project-slug>/<sid>.jsonl` +
  launchd interval, raw JSONL untouched, a small index beside it (sid → account, cwd,
  dates) for cross-account search. **The restore test is the whole backup**: a mirrored
  transcript copied back into a config dir must `--resume` (C4 F7 — the file is the
  session). Hazards named: transcripts capture tool output (secrets surface — out of
  git, out of unconsidered cloud sync); live files append mid-turn (mirror on
  mtime+size, re-copy tails); accounts scale as a source list (the census's proven
  pattern, C4 F9). Bigger than v3's fence; census-family organ on this board.
  Re-ruled same day, his word ("Let's do B"): the minimal backstop — mirror +
  launchd + restore drill — laid and dispatched as
  [C12](plans/c12-transcript-mirror.md); this entry stays as the campaign-scale
  expansion (search surfaces, deck integration, N accounts), built on C12's
  archive when its campaign comes.

---

- 2026-08-30 · C12 (Builder) · **`bun test belvedere/glass` is 670 pass / 3 fail
  at HEAD and the type gate cannot see it.** Reproduced by stashing C12's whole
  working tree and re-running: `flow-batch-1 … readFlows finds it, and worksOf
  hands it to the drawing with its edges` · `the fork baton … each option
  composes its own fire body, from its own summons line` · `the rig's mantles,
  coloured … every mantle the rig names gets a colour the socket accepts — B3 F1
  closed at the cause`. `bunx --offline tsc --noEmit` is exit 0 through all
  three. C2 E1 caught the gate lapsing red while the suite was green; this is the
  same lapse in the other direction. Not C12's to fix — its charge names the
  mirror. Evidence: [C12](plans/c12-transcript-mirror.md) F6.

---

- 2026-08-30 · C12 (Builder) · **Any directory-walking `rg` over the archive
  silently drops the personal account.** The archive's account dirs are dotfiles
  under a gitignored path, so `--hidden` is needed at all — and the repo's own
  `.gitignore` line `.claude/` makes rg skip the `.claude` account by name, so a
  search answers plausibly from two accounts of three. `--hidden --no-ignore` is
  the correct invocation; explicitly-named files are exempt (so the deck's
  `grep.ts`, which passes file lists, is safe as written). Binds the
  campaign-scale search organ above. Evidence:
  [C12](plans/c12-transcript-mirror.md) F1.
