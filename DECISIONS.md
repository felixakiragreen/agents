# Decisions

- **D1** (2026-08-02, Felix): **Canon-and-mirrors.** This repo is the single source of
  truth for cross-account Claude config; the three config dirs are deploy targets.
  Symlink-first hypothesis — a spike confirms per target; copy + drift-check is the
  fallback for any target Claude Code won't follow.
- **D2** (2026-08-02, Felix): The role system is named **Mantles**. `canon/mantles/`,
  five charters: Grand Architect, Architect, Dispatcher, Digger, Builder.
- **D3** (2026-08-02, Felix): **Sync set v1** = global CLAUDE.md, `agents/` tiers,
  mantles, `keybindings.json`. `skills/` joins iff 01 chooses skills delivery for
  mantles. `settings.json` explicitly deferred.
- **D4** (2026-08-02, Felix): Composition model designed in **one merged session**
  (tiers + mantles + binding law together). Charters the session can't finish at quality
  become bounded work orders, never rushed drafts.
- **D5** (2026-08-02, Felix): **Non-goals v1:** session/history sync; hexwright & simmy
  retrofit (v2); plugin sync; multi-machine.
- **D6** (2026-08-02, Grand Architect): Bootstrap under hexwright-style conventions
  (LEDGER, DECISIONS, `plans/` briefs with verbatim kickoffs) until 02 canonizes the
  doctrine; 02 may amend this repo's own docs to match.
- **D7** (2026-08-02, Architect · ✓ Felix): **Tier naming grammar** — `<model>-<effort>`, both
  fragments verbatim from the frontmatter enums (`opus-medium`, never `opus-med`); name
  and definition are mechanically derivable from each other. `-fast` suffix reserved,
  unminted (D9).
- **D8** (2026-08-02, Architect · ✓ Felix): **Full pre-minted grid** — 4 models × 5 efforts = 20
  tiers in `canon/agents/`. Evidence: agent definitions load at session start, so
  mid-session minting is invisible (verified — in-session dispatch of a fresh tier fails,
  fresh-session dispatch succeeds); unsupported efforts clamp gracefully per docs
  (`haiku-xhigh` dispatch verified green). Retires simmy's "tier named but not defined"
  escalation class. Staffing guidance's single home = the tier descriptions.
- **D9** (2026-08-02, Architect · ✓ Felix, amended at countersign): **Fast mode is
  unused.** The taxonomy stands — `/fast` is session-level and Opus-only (documented),
  never tier data — but Felix's ruling is patience over premium: no board annotates
  "(fast)", no summons invokes it. The `-fast` suffix (D7) stays reserved and unminted
  should the ruling ever reverse.
- **D10** (2026-08-02, Architect · ✓ Felix): **Tier frontmatter contract** = `name`,
  `description`, `model` (bare alias), `effort` (low|medium|high|xhigh|max), body =
  simmy's proven three lines verbatim. **No `tools:` in tiers** — conduct limits are
  charter law, not engine config.
- **D11** (2026-08-02, Architect · ✓ Felix): **The precedence law** — every charter carries the
  canonical clause: worn by explicit summons only; while worn, the charter overrides the
  global CLAUDE.md where they conflict on workflow (when to ask, when to act);
  personality, code style, and git conventions always apply. The hook 03 must plant is
  in `canon/mantles/README.md` §precedence.
- **D12** (2026-08-02, Architect · ✓ Felix): **Mantle delivery = read-by-path canonical, skill
  shims as interactive sugar.** Five authored shims in `canon/skills/<mantle>/SKILL.md`
  (authored, not generated — sync stays a dumb mirror) point at the charter path, inject
  `${CLAUDE_EFFORT}` for the two-axis tier guard, and set
  `disable-model-invocation: true`. Evidence: skills discovered per
  `$CLAUDE_CONFIG_DIR/skills/` and live effort substitution both verified empirically.
  **D3 amended: `skills/` joins the sync set.** Skills' own model/effort frontmatter
  deliberately unused — a one-turn override masquerading as a session tier is hidden
  state.
- **D13** (2026-08-02, Architect · ✓ Felix): **Summons grammar + rider template** canonized in
  `canon/mantles/README.md` — interactive form ("You are a <Mantle> at <tier>. Wear
  <charter path>…"), dispatched form (kickoff verbatim + rider, never edited), rider
  universal core (dispatched framing · files-are-the-deliverable ·
  report-is-logistics-only) vs project slots (agreements ref, bulletin path, worktree
  specifics — 02's turf).
- **D14** (2026-08-03, Grand Architect · ✓ Felix): **Sync mechanism = symlink, every
  target, no copy-mode branch.** `CLAUDE.md` as a file link (F2 + F10), `agents/` and
  `skills/` as whole-dir links (F7 + F8). `deploy` = bootstrap + adopt + verify;
  `check` = drift alarm (untracked files in `canon/` included, per F7). Agent-run
  displacement of live config files trips the permission guard by design — the surfaced
  prompt to Felix IS the rule (findings §note). `agents/` + `skills/` hand-planted ×3
  on 2026-08-03 ahead of Stage B; `deploy` adopts them idempotently.
- **D15** (2026-08-03, Felix): **D3 amended — `keybindings.json` leaves the sync set**
  (F11/F12: unobservable without a human in the loop; admitted on a cheapness assumption
  the spike disproved; syncs nothing Felix values). Sync set v1 final: `canon/CLAUDE.md`
  · `canon/agents/` · `canon/skills/` (mantles read-by-path per D12). No mechanism
  verdict exists for keybindings in either direction; re-admission starts from zero.
- **D16** (2026-08-03, Architect (02) · ✓ Felix): **The work
  doctrine is canon at `canon/work/DOCTRINE.md`, templates at `canon/work/templates/` —
  referenced by path, never deployed to config dirs** (confirms GENESIS §4). Six
  templates: claude-md · genesis · ledger · decisions · brief · order (`claude-md.md`
  named so the skeleton itself is never auto-loaded). Projects instantiate; canon stays
  the single source, like the mantles (D12).
- **D17** (2026-08-03, Architect (02) · ✓ Felix): **The
  canonical file set + scaling law.** Full project: CLAUDE.md · initial.md (when an
  origin dump exists — immutable, hexwright's law) · GENESIS.md as master doc ·
  LEDGER.md · DECISIONS.md · `plans/`, with `docs/` and `lab/` on demand. Subproject or
  spike repo: README.md as master doc + work docs — simmy ran a ten-session parallel
  campaign that way. Split rule: a section leaves the master doc when it outgrows it or
  gains its own write pattern, never ahead of need (anti-sprawl, hexwright §7).
  Subproject docs live with the subproject; the repo CLAUDE.md gets one pointer line
  (simmy D4). CLAUDE.md ≤ ~60 lines, pointers over state digests.
- **D18** (2026-08-03, Architect (02) · ✓ Felix): **Board
  law.** One board per project, living in the master doc — BOARD.md rejected (extra
  cold-start hop, no ancestor). Row = one dispatchable unit = one work doc = one
  session. Columns: ID · Work · Depends on · Staffing · Status ("Work", not "Question"
  — simmy's board held builder rows under a Question header). Lifecycle: OPEN → IN
  FLIGHT → LANDED / KILLED; BLOCKED transient at the Architect's desk; PENDING = an
  external-precondition annotation, never dispatched. A documented kill is a win.
  Retired synonyms: DONE, CLOSED, WIP, TODO, AUTHORED. Batch notes and the parked list
  live under the board.
- **D19** (2026-08-03, Architect (02) · ✓ Felix): **Work
  docs: two genres, one skeleton.** Brief (Digger): questions · method-as-suggestion ·
  kill criteria mandatory · findings section. Order (Builder): goal · blessed spec
  (blessing recorded — who, when) · measurable DoD mandatory · out-of-scope fence
  mandatory. Both: sized to one session — unfinished-at-quality becomes a new row (D4
  generalized); pre-chewed — every meetable fork decided or named a kill/escalation
  point; kickoff verbatim, fenced, last in the file, edited only by the Architect
  re-cutting the row.
- **D20** (2026-08-03, Architect (02) · ✓ Felix): **Findings
  law.** Evidence-grade appends under the work doc, never edited after the row closes;
  a claim without evidence is a draft (simmy §8). **Probes ship with a control** — a
  negative result counts only when a control proves the probe could have seen the
  effect (04's spike: two false negatives caught only by controls, F6/F11). Cross-row
  discoveries go out the moment made (bulletin, or the report's escalation). Builder
  findings = DoD checklist evidenced in place + deviations under Findings. Worktree
  rows: findings ride the branch, the board carries the branch name until Architect
  merge. Fold-and-strike at review: durable docs absorb with dated notes; findings
  remain provenance.
- **D21** (2026-08-03, Architect (02) · ✓ Felix): **LEDGER
  and DECISIONS shapes ratified as proven.** Ledger: one entry per session — date ·
  mantle (· row) · changed · decided · next; acceptance test: the tail alone reboots a
  cold session; a pure spike-board subproject may lean on board + findings until a
  session does work no work doc captures (simmy precedent). Decisions: monotonic
  D-entries, never reused, never rewritten — amendments append; attribution honest
  (Felix's decisions carry his name and wait for him); dispatched sessions mark
  "(proposed — pending Felix countersign)". The decision queue is not a file: it is the
  proposed-uncountersigned entries + open escalations, surfaced at every boundary.
- **D22** (2026-08-03, Architect (02) · ✓ Felix): **Bulletin
  + rider instantiation.** The bulletin exists only while a parallel batch runs: the
  Dispatcher creates `plans/BULLETIN.md` at first parallel dispatch; agents append
  verbatim findings + evidence pointers the moment a discovery changes another row's
  plans (worktree agents via the MAIN checkout, append left uncommitted); the
  Dispatcher commits and relays; no archive ceremony — the Architect's fold makes
  entries archival where they stand (simmy's bulletin, ratified). The rider is
  instantiated once per project as `plans/RIDER.md` from the canon template, filling
  D13's three project slots: agreements ref · bulletin path (or dropped sentence) ·
  worktree specifics.
- **D23** (2026-08-03, Architect (02) · ✓ Felix): **The
  genesis ritual.** A new project is founded by an Architect at `fable-max` in one
  session: Felix inits the repo (branch `master`) and drops `initial.md` when an origin
  dump exists — immutable from that moment; the founding summons reads DOCTRINE.md +
  the vision; the session interrogates scope, instantiates the templates (CLAUDE.md,
  master doc + board, LEDGER, DECISIONS with the day-one ratifications), cuts the first
  rows, hands the first summons verbatim. The Grand Architect founds nothing — it keeps
  the canon; every project is its own Architect's board.
- **D24** (2026-08-03, Architect (03) · ✓ Felix — countersigned by his own `sync/deploy`
  run, 2026-08-03: deploying the file IS the disposition):
  **`canon/CLAUDE.md` ratified — the global file.** The incumbent (2026-07-09,
  byte-identical ×3, md5 `7c9e776e…`) survives **byte-intact**: Coding Directives
  unchanged (the constitution — and Felix's taste, above session delegation to rewrite),
  Git Development Guidelines unchanged (audited for tightening — already at fixed
  point), Agent Personality unchanged (standing preference per brief; its "don't start
  writing code without asking" stays, disarmed in mantled sessions by the hook). One
  section appended, **THE AGENTS CANON**: files-carry-truth + the three-account silo
  physics (the one fact no session can discover from inside — durable knowledge goes in
  repos); the canon repo pointer (mantles · tiers · doctrine); D11's precedence law
  mirrored in its exact terms — explicit summons only, charter overrides the global
  file on workflow (when to ask, when to act), personality/code style/git conventions
  always apply. Nothing moved out — the incumbent held no mantle- or doctrine-content.
  Defended non-additions in the brief's findings (branch-`master` stays project
  physics; no mantle-name/grammar duplication; no doctrine path — project CLAUDE.mds
  carry it). Deployment: 04's build (D14); until then mirrors serve the incumbent by
  design.
- **D25** (2026-08-03, Grand Architect · ✓ Felix): **The naming law** — ALLCAPS for
  protocol singletons (both tests: only one can exist in its scope, AND sessions are
  told to read it as protocol); lowercase-kebab for addressable siblings (work docs,
  charters, tiers, templates). `initial.md` stays lowercase by the protocol test — a
  singleton artifact, not a followed protocol. Codified in `DOCTRINE.md` §3; practiced
  since hexwright/simmy, written down at Felix's ask.
