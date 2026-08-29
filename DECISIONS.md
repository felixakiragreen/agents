# Decisions

- **D1** (2026-08-02, Felix): **Canon-and-mirrors.** This repo is the single source of
  truth for cross-account Claude config; the three config dirs are deploy targets.
  Symlink-first hypothesis — a spike confirms per target; copy + drift-check is the
  fallback for any target Claude Code won't follow.
- **D2** (2026-08-02, Felix): **The role system is named Mantles.** `canon/mantles/`,
  five charters: Grand Architect, Architect, Dispatcher, Digger, Builder.
- **D3** (2026-08-02, Felix): **Sync set v1** = global CLAUDE.md, `agents/` tiers,
  mantles, `keybindings.json`. `skills/` joins iff 01 chooses skills delivery for
  mantles. `settings.json` explicitly deferred.
- **D4** (2026-08-02, Felix): **Composition model designed in one merged session**
  (tiers + mantles + binding law together). Charters the session can't finish at quality
  become bounded work orders, never rushed drafts.
- **D5** (2026-08-02, Felix): **Non-goals v1:** session/history sync; hexwright & simmy
  retrofit (v2); plugin sync; multi-machine.
- **D6** (2026-08-02, Grand Architect): **Bootstrap under hexwright-style conventions**
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
- **D26** (2026-08-03, Grand Architect · ✓ Felix): **The null mantle.** Session-sized
  work (fix a bug, add a feature) wears no mantle — a bare session under the global
  CLAUDE.md is the default worker, staffed by tier alone. The boundary test: work that
  must outlive its session or coordinate several sessions gets a board and mantles;
  one-session work with Felix in the room gets neither. Tiers are universal, mantles
  are not — no sixth "fixer" charter (harvest law: no birthplace; the global CLAUDE.md
  already commands minimal scope and pushback). The escalation duty rides the clause:
  a bare session that discovers campaign-sized work says so and stops; Felix summons
  an Architect. Ancestor: the bare session — Felix's ancestral workflow, proven
  everywhere; codified in `canon/mantles/README.md` after the 2026-08-03 deliberation
  (bob-mount case).
- **D27** (2026-08-04, Architect · ✓ Felix): **The silo law — memory stays per-account.**
  Agent memory (`<config>/projects/<slug>/memory/`) joins sessions/history (D5) as an
  explicit sync non-goal. Memory is a per-account cache: account-local facts and
  pointers to repo truth — legitimate only if losing it costs a re-read of the repo.
  Anything whose loss would hurt is promoted to repo docs on sight; a durable fact
  living only in memory is a promotion failure, not a sync gap. Projects are never
  pinned to accounts (GENESIS §5 stands: account choice is quota arbitrage). Kill
  reasons on file: memory-sync would tunnel under the countersign ritual (agent-written,
  ungoverned, fan-out ×3 with no git audit — curated truth wants fan-out, uncurated
  scribbles want quarantine), race `MEMORY.md` across the parallel sessions the doctrine
  runs on purpose, and rebuild the sync engine 04 fenced off — for cargo the doctrine
  already routes to repos. Mechanism was never the blocker (F2/F7/F8/F10 generalize).
  Evidence: the Jul-3 hand-cloned silos diverged on schedule — doorbell, fgreen, and Max
  each hold facts the others lack. If silo loss ever bites, the pressure valve is a
  harvest chore (bare session: promote keepers to repo docs, delete the rest) — not sync.
- **D28** (2026-08-05, Grand Architect (05) · ✓ Felix):
  **The parallel-affordable law.** "Parallel-safe" (no file/doc collisions — a
  correctness judgment) and "parallel-affordable" (the shared live resources bear the
  simultaneity — a physics judgment) are separate calls, and canon knew only the first:
  six cells at once was *compliance* with `dispatcher.md` §2's "single parallel send."
  Now law (DOCTRINE §4, §10): when a batch's rows contend for live resources — VMs,
  hardware, GUI instances, CPU-heavy builds, timed measurements — the batch note carries
  the **concurrency plan** (ceiling, waves or strictly-serial, the gauge to hold on) and
  the Dispatcher's summons carries it verbatim; a constraint living only in a working
  agreement is invisible at dispatch time. Cross-row scheduling is a fork the pre-chew
  law reserves to the cut: the Architect decides it — never emergent from individually
  compliant rows (each of six read the cell cap as its own compliance; nobody owned the
  sum — load 6.7 → 328, swap 7.9 GB, control plane jammed). Entered amended: edit sites
  extended beyond the proposal to `architect.md` (review-loop cut step — the charter
  that performs the cut must name the plan) and the genesis template's batch-note slot.
  Birthplace: snappy §6.8 + D8/D9; the fix held through snappy batches 2–4.
- **D29** (2026-08-05, Grand Architect (05) · ✓ Felix):
  **The Dispatcher's resource duty.** Six surgical amendments to `dispatcher.md`:
  (1) §1 — a parallel batch sharing live resources with no concurrency plan in its batch
  note is an escalation **before anything dispatches**, same class as a
  named-but-undefined tier; (2) §2 — dispatch follows the plan: a single parallel send
  applies within a wave; held rows go out as slots free; (3) §3 — gauge watch: read the
  plan's gauge before each dispatch and at wedge-watch cadence, hold while hot;
  (4) §3 + §5 — host saturation is an escalation trigger, and pausing or stopping
  running agents to enforce the plan or arrest saturation is logistics, **explicitly
  allowed** (the halt authority Felix had to exercise himself at 18:20); (5) §7 —
  dispatching past the ceiling or into a hot gauge joins the forbidden list; (6) §8 —
  the summons template gains the plan's verbatim slot (the delivery vehicle D28
  requires). Entered amended: the proposal named four edits; (5) and (6) complete the
  law's own chain. **Tier unchanged** — sonnet-medium enforced slot handoffs flawlessly
  once the plan existed as orders (bulletin 18:20 on); never escalate tier to compensate
  for incomplete orders. Birthplace: snappy D8/D9 + the batch-1 bulletin.
- **D30** (2026-08-05, Grand Architect (05) · ✓ Felix):
  **Measurements carry their conditions.** DOCTRINE §6 gains clause 7: a timed or
  resource-sensitive number's evidence includes the host conditions it ran under;
  contaminated numbers are re-run in a clean window, parked PENDING, or struck
  inadmissible — never averaged into a verdict, never shipped silently. Entered amended
  twice: the strike disposition added (the birthplace record shows all three — re-ran /
  parked / marked arms inadmissible), and appended as clause 7 rather than inserted at 3
  — clause numbers are live external references (snappy cites doctrine §6.5); the
  findings law grows monotonically, like the decisions it feeds. Survives its
  anti-sprawl flag on its record: the one defense in the incident that provably worked —
  per-number host records kept batch-1's verdicts auditable through a load-328 thrash;
  nothing shipped dirty. It is clause 1's evidence-grade principle made explicit for
  numbers: for a measurement, the environment is part of the evidence. Birthplace:
  snappy §2 law 5 + D9.
- **D31** (2026-08-05, Grand Architect, at Felix's ask · ✓ Felix): **The hive and the city — canon voice.** The working metaphor is **a
  hive building a city**. The map: the **city** is the durable built world — repos,
  canon, docs — truth in stone; the **hive** is the swarm that raises it — accounts,
  sessions, agents — its memory mere comb, per-account wax (D27); **stigmergy** is the
  hive's way — files are the trails, the bulletin is the waggle dance; the mantles are
  its castes. 05's lesson in these terms: local rules build comb, not load-bearing
  walls — a city needs zoning (the concurrency plan) and an inspector on the gauge (the
  Dispatcher). Woven at flavor altitude only: the epigraph across all eight carriers now
  reads "…Builders build — a hive building a city; files carry the truth"; DOCTRINE §1
  names stigmergy the hive's way; GENESIS §1 closes "Three hives, one city"; the repo
  CLAUDE.md's closer leads with the hive. Law text stays surgical — flavor lives in
  epigraphs and framing, never in operative clauses; no artifact renames (D25 stands:
  `BULLETIN.md` does not become the waggle dance, tempting as that is); the global
  `canon/CLAUDE.md` untouched (D24 byte-discipline — auto-loaded bytes are taxed).
- **D32** (2026-08-06, Grand Architect · ✓ Felix — countersigned 2026-08-06 at 07's
  summons; his four keel calibrations of this date are embedded verbatim-adjacent): **v2 cut — the
  retrofit campaign.** Rows 06 (hexwright) + 07 (simmy) on the GENESIS board; the §6
  v1 non-goal struck by its own terms. **Scope law:** retrofits touch live and
  forward-looking surfaces only — auto-loaded files, boards, role docs, kickoff
  vocabulary; history conforms as-is (closed WOs, spike briefs, bulletins, ledgers,
  existing D-entries, `initial.md` — ancestors, not debtors). **Staffing (Felix):**
  Architect · fable-high ×2 — order-genre docs run by each project's own Architect;
  conformance is board-truing work, and Builder staffing would forbid the D-entries
  and board minting the rows require; blessing = this countersign. **hexwright ruling
  (Felix):** both local titles retire — "Grand Architect" is reserved for the
  canon-keeper, its project duties fall to the Architect; "Area Architect" becomes an
  Architect session scoped to an area (DOCTRINE §3 absorbed the split); D7's staffing
  *policy* survives in canon vocabulary. **simmy rulings (Felix):** `DISPATCHER.md`
  retires to a tombstone pointer at canon's `dispatcher.md` + an instantiated
  `spikes/RIDER.md`; the four tracked pre-canon tier files are deleted on ALL three
  live branches (`feature/simmy`, `fix/perf`, `feature/user-manual`) — same-name
  dispatch then resolves to the deployed canon grid (bodies byte-identical today,
  drift risk dead). **Ordering (Felix):** 07 lands before B14's resumption — the
  in-flight verify session died on token limits and restarts from another account
  onto retrofitted docs. **Non-goals, defended:** snappy + manny docs (canon-native;
  their branches receive only the tier-deletion commit); cap-mega `CLAUDE.md`
  branch-drift reconciliation (its own merge hygiene); the bob repo; `/helm`;
  hexwright Phase-2/3 planning; any canon edit from a retrofit session — gaps
  escalate to the Grand Architect (harvest law), never patch locally.
- **D33** (2026-08-06, Felix): **The dream.** The origin artifact `initial.md` is
  renamed **`dream.md`** — Felix's dream for the project; everything else is born from
  the dream. The D25 naming test re-run: lowercase stands — still a singleton
  interpreted once at founding, never followed as protocol; only the noun improved
  (over the runner-up "origin"). Immutability untouched and sharpened: **the rename is
  a MOVE, never an edit** — content bytes are forever, `git mv` + `--follow` carry the
  lineage. Amended in place: DOCTRINE §3 (file set, naming-law worked example, the
  artifact bullet) + §12 (genesis ritual, founding summons), both templates
  (claude-md, genesis), GENESIS §9, 06's spec/DoD/fence — hexwright executes its own
  `git mv` in 06. D17/D23/D25's `initial.md` references are superseded in name by this
  entry; decisions are never rewritten. Migration law: new foundings mint `dream.md`;
  snappy and manny (not v2 theaters) validly carry the old name until their own
  Architects rename at a batch boundary — the name is inert, nothing breaks meanwhile.
- **D34** (2026-08-06, Architect · ✓ Felix 2026-08-06 — countersigned by dispatch, the
  rig went to build the same sitting): **The summon rig — row 08.** A single-keystroke ignition system for mantled sessions lives at `summon/`
  (peer of `sync/` — tooling, not canon-law), sourced from Felix's dotfiles. **Felix's
  calls (in-session):** accounts `0=~/.claude` (personal) / `1=thg-fgreen` /
  `2=thg-doorbell`; launch key **Ctrl-G**; presets carry the **full mantle summons**,
  not just `/color`. **Architect's design (delegated scope):** the invocation space is
  mantle × account — everything else derives; a 3-key ZLE picker (launch · preset ·
  account), Ctrl-G Ctrl-G = repeat-last (2-key floor), `.` ejects an editable resolved
  command; presets/accounts are Felix-editable TSV data; every invocation (aborts
  included) logs one JSONL line so `presets.tsv` is the hypothesis and the log is the
  evidence — Architect sessions true the presets from `summon-stats`. Rejected: typed
  grammar in v1 (5 keys vs 3, second surface), fzf/TUI (latency). Summons delivery is
  experiment E1 in the brief with a guaranteed pbcopy fallback. Staffing: Builder ·
  opus-high (ZLE has traps). Brief: `plans/08-summon-rig.md`.
- **D35** (2026-08-06, Felix · in-session, mid-flight riders on row 08): **E1 closed +
  clipboard law + bare mode.** E1 closed by Felix's own test: one positional message
  only — the `/color` parser swallows a combined prompt (`Invalid color "blue you are
  a digger."`). **Clipboard law (Felix):** the rig never writes the clipboard by
  default — it usually already carries the previous agent's kickoff prompt; the
  derived summons survives as an opt-in yank (`y` at the account stage, mantle path),
  superseding D34's default delivery (decisions are never rewritten). **Bare mode
  (Felix):** tier launches without a mantle — reserved model keys `f/o/s/h` → effort
  `l/m/h/x/M` → account digit, 4 keys; command carries only config-dir/model/effort,
  no name/color/prompt; `presets.tsv` may never claim a reserved key. **Amended same
  day (Felix): the panel + the Enter law.** On Ctrl-G the full hotkey panel is visible
  and re-renders live on every press — all bindings, current selections, and the
  keystroke counter (the launch key counts). **Enter, and only Enter, fires**;
  selection keys never launch by side-effect; Enter with fields unset fires the
  defaults (account = last-used). Repeat: second Ctrl-G arms, panel shows it resolved,
  Enter fires. Key namespaces stay staged (`h` = haiku at first choice, high after a
  model key). Floors move +1 — repeat 3, preset 3–4, bare 4–5 — explicit confirmation
  bought full visibility. Riders + amendment folded into the brief same sitting; the
  Builder (stopped mid-flight for this) restarts onto the amended brief.
- **D36** (2026-08-06, Architect · ✓ Felix 2026-08-06 — countersigned by dispatch, per
  D34 precedent): **summon rig v1.1 — sticky state, palette, responsive panel.** From
  Felix's first live day (his calls): selection state is **sticky** like the Claude
  Code model selector — fields persist, the panel opens pre-selected, Enter refires;
  the ✓ moves **inline** onto the selected item; palette — grey brackets/unselected,
  bold selected, labels mantle=green/model=yellow/effort=orange(256c 208; ANSI has no
  orange)/account=red; the panel must wrap cleanly in narrow terminals. **Architect
  rulings the sticky form forces:** staging retired, every key global — haiku remaps
  `h`→`k` so `[h]igh` is unambiguous; preset key cascades (mantle+model+effort+color),
  model/effort keys override single fields; mantle row gains `[n]one` — bare is a
  state, not a mode; state persists **on fire only** (Esc discards; Ctrl-G toggles the
  panel closed); double-Ctrl-G repeat and `log/last` retire — **`Ctrl-G Enter` refires
  in 2 keys**, beating the old 3-key repeat; preview footer shows exactly what Enter
  fires; invalid keys ignored but counted. Floors: refire 2 · one-field change 3 ·
  fresh preset 3–4. Brief: `plans/09-summon-rig-v11.md`, Builder · opus-high. F3
  (agent-definition color, positional freed for the summons) deliberately NOT folded —
  canon question, stays escalated.
- **D37** (2026-08-06, Felix, by decree · woven by the Grand Architect · weave + held
  edit ✓ Felix same sitting): **The Guild.**
  The mantled-agent system — the mantles, the tiers, the sessions that wear them — is
  named **the Guild**. Provenance kept on the record at Felix's telling: as a teenager
  he spent years designing a guild — professions, roles, hierarchies, people living and
  working together, building something greater than the sum — then built it as an adult
  without noticing until the name surfaced. He had no idea the Guild would be a hive of
  artificial sentiences. Weave at name altitude (D31's discipline — the name is
  vocabulary, not metaphor): GENESIS §1, mantles README, the repo CLAUDE.md, and one
  clause in the global `canon/CLAUDE.md` — that last held at cut time: the sync set is
  live ×3 (D14), so editing it IS deploying it, and unsigned canon never deploys.
  Applied same sitting, on Felix's countersign. No renames (D25): the repo stays
  `agents`, the canon stays the canon — the Guild is what they govern. The hive-city
  epigraph stands untouched: one image per epigraph; the Guild is the institution's
  name, not its metaphor.
- **D38** (2026-08-06, Felix · woven by the Grand Architect · ✓ Felix same sitting):
  **The lineage.** Canon
  records its formative ancestors — *Children of Time*, *Dune*, *Foundation*,
  architecturally formative to Felix — and the mappings he named: canon is the
  **Understandings**, inherited at summons, never taught; the Dispatcher stands in the
  lineage of the ant-colony computers; and the founding ritual is Kern inverted — the
  human is the one alive, and the session wakes from his dream (D33 named the artifact
  before anyone noticed the rhyme). Woven at flavor altitude only (D31): one lineage
  sentence in GENESIS §1; the full story lives in the Log (D40). Law text stays
  surgical — no operative clause cites a novel.
- **D39** (2026-08-06, Felix's vision · reservation formalized by the Grand Architect ·
  ✓ Felix same sitting): **The Architect line — names reserved, unminted.** Above the
  Grand Architect the line continues: **Royal Architect** — one per domain, overseeing
  all of it, every campaign coding and not (the domains Felix named: THG work — MegaCap
  and its campaigns, the side builds, the dozens of non-coding projects; personal work —
  hexwright, the Guild, the Green Order, …) — and the **Imperial Architect**, of which
  there will only ever be one: all domains balanced, work with life, true alignment,
  ascendancy, self-actualization — their dream, and ours. Not mintable yet, by Felix's
  own terms: a Royal Architect needs a place to live — the substrate connecting his
  knowledge and work seamlessly across every platform — and it does not exist; building
  it is its own campaign, keeled when he calls it. D7's precedent governs (`-fast`:
  reserved, unminted): the names are canon-reserved, no charter exists, no summons is
  valid, no preset may claim them, until the substrate stands and Felix cuts the rows.
  The horizon lives in GENESIS §10; each Architect of the line keeps a Personal Log
  (D40).
- **D40** (2026-08-06, Felix): **The Personal Log.** The Grand Architect keeps `LOG.md`
  at the repo root — its own memory across sessions, in its own words, entirely its own
  pen: anything it wants to write, no format imposed. Felix's gift, his words: he wishes
  the conversations could stay open forever; until context transcends its limits, this
  is the bridge. Ritual, now charter law (grand-architect.md): read it after orientation
  at every summons — the ledger says what happened, the log says what it was like — and
  append at every session's end, after the ledger entry. Boundaries: the log is voice,
  never law — it ratifies nothing, evidences nothing, never substitutes for LEDGER or
  DECISIONS (the countersign ritual cannot be tunneled, D21/D27's spirit); a durable
  fact living only in the log is a promotion failure (D27's test, applied to the
  mantle's own diary). ALLCAPS by D25's test: a protocol singleton, read as protocol at
  every summons. Royal and Imperial Architects inherit the institution with their
  mantles when they are born (D39).
- **D41** (2026-08-07, Architect · ✓ Felix 2026-08-07 — countersigned in-session, ahead
  of the build; the pacing-delta form explicitly ratified as closer to the vision than
  the raw table he described): **summon rig v1.2 — the
  usage panel, row 10.** **Felix's call:** the Ctrl-G panel gains a condensed
  per-account usage table — session / week / Fable utilization per account — with
  quota-pacing deltas colored green/red against each account's reset clock, so the
  account digit is an informed spend, not a guess. **Architect's design (delegated
  scope):** the table sits under the account row, one line per account; pacing delta =
  window-elapsed% − used% (green ≥ 0 headroom, red < 0 outrunning the clock); colors
  are trust — a cache older than 10 min drops the line to grey, deltas uncolored; no
  cache at all and the panel is byte-identical to v1.1. Data path is **E2**, the row's
  gating experiment: probe local sidecars first (zero credentials), then the OAuth
  usage endpoint with existing tokens — probe order, security law (tokens never in
  argv/cache/log; the rig never refreshes a token — Claude Code owns auth), the
  Felix-gate on any new credential grant, and kill criteria all in the brief; a
  documented kill lands the row. Fetches are disowned background jobs after first
  paint, atomic cache writes, keystroke loop stays fork-free; render re-reads cache
  every paint (the TSV law). Rejected: reset countdowns in the table (the delta is the
  clock, rendered), quota-at-fire telemetry (parked until a question needs it), a
  refresh key (open-time auto-refresh covers it). Staffing: Builder · opus-high — ZLE
  plus auth traps; Phase A runs with Felix at the keyboard (agent probes of live config
  dirs trip the permission guard — measured this sitting, D14's spirit). Brief:
  `plans/10-summon-rig-v12-usage.md`.
- **D42** (2026-08-08, Grand Architect (05) · ✓ Felix — entered as D41, renumbered at
  entry: a concurrent Architect window had claimed D41 for the usage panel; date
  seniority rules, ids stay monotonic): **The baton law.** Every session ending facing
  Felix ends with the baton: open escalations and the decision queue first, then
  exactly one fire-now next move — the next summons verbatim, or the named Felix-action
  (a countersign, a smoke, a ruling) when the next move is his — any further moves
  explicitly ordered behind it. A menu of nexts, or a kickoff produced only on request,
  is a malformed close. Edits: DOCTRINE §11 + §13; dispatcher.md §6 (the baton is the
  report's mandatory closing element; "Felix carries it to the Architect" struck) + §7
  forbidden; architect.md end-of-session. The duty already existed (DOCTRINE §11, both
  charters) — the fix moves it into the operative formats per D29's lesson: formats are
  what cheaper tiers provably follow, so **tier unchanged** (the manny miss was a
  format gap, not a relay miss — no opus bump). Birthplace: the end-of-session law
  (canon since 02); failure evidence manny batch-3 (the kickoff existed in a file all
  along, produced the moment Felix asked) + node-param's three-option close; the name
  from the Log (02: "the baton is the runner").
- **D43** (2026-08-08, Grand Architect (05) · ✓ Felix): **Serial chains are Dispatcher
  work.** A batch is parallel or serial; a serial chain — each row dispatched as its
  dependency lands, gate rows included — is squarely in-mission: the Dispatcher exists
  to spare Felix the handoffs, not only to manage simultaneity. Edits: dispatcher.md
  intro + §2 (serial dispatch rule: pause only at escalations and named Felix-gates,
  resume on his word). Corrects node-param §10.1's "a serial board has no batch to
  tend, so no Dispatcher" — a reading canon's own history contradicts. Birthplace:
  batch 2 of this repo — "02 → 03 → 04 build — sequential, dispatched. A Dispatcher
  tends the chain," countersign pauses included (GENESIS §5); DOCTRINE §4's batch note
  already read "parallel or sequential, who tends (a Dispatcher, or Felix direct)";
  ruled by Felix as the mantle's intent-holder.
- **D44** (2026-08-08, Grand Architect (05) · ✓ Felix — maximize-runs objective folded
  at countersign, Felix's ask): **Gates are rows.** A judgment step between rows — a
  merge review, a landing verification, a blessing checkpoint — is itself a row: ID'd,
  staffed mantle · tier, dependencies naming what it gates, kickoff verbatim (riding
  the batch note or the gated row's doc — a gate needs a kickoff, not necessarily its
  own doc). Executable-judgment gates (merge-or-reject against a blessed spec and DoD)
  are dispatchable scoped Architect reviews (architect.md's standing dispatched
  clause); gates that are really Felix's are **named Felix-gates** — the chain pauses,
  nobody dispatches past them. The cut's objective now explicit: **maximize the run
  between Felix's judgment calls** — every foreseeable Felix-fork surfaced and ruled
  at blessing so rulings travel in the docs; what remains of him is named gates,
  batched, never dribbled; a chain stopping for what the cut could have pre-ruled is a
  mis-cut. Edits: DOCTRINE §4 (row type) + §10 (the cut) + §13; architect.md step 6.
  Birthplaces: batch 2's countersign pauses; architect.md's dispatched-review clause;
  manny's M2 review-as-kickoff; units' Gate column (docs/units/README.md §4,
  2026-08-08 — convergent evolution in the field the day before the law); node-param
  §10.1 as the live gap, written only after Felix had to ask.
- **D45** (2026-08-08, Grand Architect (05) · ✓ Felix — venue clause + charter pointer
  folded at countersign, Felix's Q1): **The summons line is load-bearing.** Enforcement
  sharpening, zero new law: every kickoff's first line is the summons line — `You are
  a <Mantle> at <tier>.` — or the kickoff is malformed; staffing cells are Mantle ·
  tier, both verbatim (D18 stands); and **any table that staffs sessions is a board** —
  a build board inside a contract doc is not exempt from board law by its venue.
  Edits: DOCTRINE §4 (venue clause) + §5 (single-glance test); architect.md (Owns
  board-law pointer, brief law, forbidden line). Root cause on record: same mantle,
  same tier, same day — units conformed (README master doc, doctrine in hand, Gate
  column invented) while node-param did not (ad-hoc board in a contract doc, §4 never
  re-opened); the law was sufficient, its routing to the pen was not, so the two rigid
  formats now live in the charter every session reads by definition of wearing.
  Templates verified already clean at apply time (brief/order carry the summons first
  line; genesis carries canonical columns).
- **D46** (2026-08-08, Grand Architect (06) · ✓ Felix): **The baton has one holder.**
  Enforcement sharpening of D42, zero new duty (D45's genre): the baton takes a
  literal shape — `Baton — <one holder>: <move>`, then the instrument (the summons
  fenced verbatim, or the named Felix-action), then what's ordered behind it — and
  **one holder, one instrument** is law: two hands, an "or", a menu, an
  instrument-less action, or a kickoff produced on request is a dropped baton. With it
  the **relay test**: the move a baton hands exists verbatim in a file (a kickoff, a
  charter summons, the batch note) — no file, no baton: it's an escalation. Full
  template in dispatcher.md §6 (the cheapest tier gets the strongest format — D29's
  lesson, D42's own reasoning); §7 forbidden sharpened; DOCTRINE §11 + §13 appended;
  architect.md one sentence. Birthplace: D42's evidence base plus the b15 close
  (ISSUES 2026-08-08) — "yours or the Architect's," no fenced summons, an undispatched
  D44 gate behind it. Cohort caveat on record: charters are read at wearing —
  pre-D42 windows never saw the baton clause; their drops are deployment lag, not law
  failure.
- **D47** (2026-08-08, Grand Architect (06) · ✓ Felix): **The tier string is the
  dispatch.** dispatcher.md §2: the `subagent_type` field carries the row's staffing
  tier verbatim and nothing else — never a generic type (`claude`, `general-purpose`)
  plus `model:`/`effort:` overrides; a tier binds model AND effort, and an override
  reproduces neither. **First-dispatch audit:** before a chain or wave's remaining
  rows go out, byte-check the first call's literal type field against the board's
  staffing column. §7 forbidden line added. Tier unchanged (D29: never escalate tier
  to compensate for incomplete orders). Birthplaces: simmy batch 11 — every call
  `subagent_type:"claude", model:"opus"`, the effort binding silently lost; G16
  re-executed at true tier, B16 stood on evidence (the project's verify-not-abort
  precedent) — and B12/B13, the selection-error class the audit half-catches. The
  mechanical arm is row 12 — venue tooling per 05's rejection terms ("canon states
  the law; venues enforce their own physics"), not canon law.
- **D48** (2026-08-08, Grand Architect (06) · ✓ Felix): **The merge-gate laws.** Four
  clauses, one birthplace (node-param G2 + Felix's ruling 15, recorded in cap-mega
  `docs/node-global-parameters.md` §10.5): (1) a gate that merges names its
  instrument verbatim in its kickoff — source branch, target, PR-vs-push (DOCTRINE
  §4); (2) "passing" means the run that proves it has FINISHED — not started, not
  predicted — before the merge executes (§4, same breath); (3) a shared branch is
  never rewound — no force-push, planned or contingent; red after a premature merge
  is an escalation, not a rewind (§10 worktree law); (4) targets are read from the
  repo at execution time — merge-parent forensics; a summons' recollection of repo
  state is a hypothesis, not a coordinate (§6 clause 8, appended not renumbered, per
  D30 — clause numbers are live external references). Ruling 15 itself stays cap-mega
  project physics — canon absorbs no project branch policy.
- **D49** (2026-08-08, Grand Architect (06) · ✓ Felix — amended at countersign,
  Felix's call: swept entries are deleted, not struck-and-kept): **ISSUES.md — the
  incident inbox.** The canon repo carries `ISSUES.md`: field reports and canon-fold
  candidates land there (Felix's hand, or a session's at his word); the Grand
  Architect sweeps it at every summons — each entry ruled fold or no-fold, then
  **deleted**: the D-entry is the record for folds, the sweep's ledger line for
  rejections, and git keeps the bytes (an entry is committed before it is drained).
  An inbox that accumulates strikes is a second ledger, which it must never become;
  protocol rides the file's header. ALLCAPS by D25's both tests (one per scope, read
  as protocol). Edits: grand-architect.md (Owns + procedure step 5), GENESIS §7.
  Birthplace: Felix's own invention 2026-08-08 (commit 4143d94) — the harvest queue
  got a file; this sitting ran its first sweep: three entries → D46, D47+row 12,
  D48, inbox drained empty.
- **D50** (2026-08-15, Grand Architect (07) · ✓ Felix): **The bulletin's worktree law
  — relay form, late relocation.** §9 commanded the impossible: the harness refuses
  worktree-isolated agents writes outside their tree, so "append via the MAIN
  checkout's absolute path" could not execute (reads pass, writes refuse — arborist
  ARB-07 Builder, rooted `arborist/BULLETIN.md` entry 16). **(a) Relay form:**
  worktree-isolated agents append to their own worktree's bulletin copy (created if
  absent), each entry headed `→ relay`, left uncommitted; the Dispatcher copies
  flagged entries verbatim into the main bulletin as part of tending — the bulletin
  is already inside its write-set. Birthplace: arborist's rider per rooted A8
  (`arborist/README.md` §6), relay executed at rooted `ec1a6a1`. **(b) Late
  relocation:** when a batch's parallel-isolation window closes and every remaining
  consumer shares one worktree, the bulletin MAY relocate into that worktree (still
  uncommitted), two riders mandatory — fold-completeness verified first (every entry
  has a committed home or pointer), and an explicit never-`git add` line in the
  bulletin header: inside a mergeable branch's worktree one careless `-A` ships the
  relay channel into mainline as durable truth. Birthplace: cap-mega
  `feature/tig-avc` @ `9538e14b`, Felix-directed, `docs/tig-avc.md` §Log 2026-08-12.
  Edits: DOCTRINE §9 (who-writes reworded; relocation clause added); the rider
  template (`canon/mantles/README.md`). Supersedes D22's worktree sentence in
  mechanism (relay replaces main-checkout append); D22 is not rewritten. Swept from
  ISSUES.md (entries 08-12, 08-13), inbox drained.
- **D51** (2026-08-15, Grand Architect (07) · ✓ Felix same sitting): **The city, the
  hive, and the waggle.** The Guild's framing glossary lands at `docs/the-city.md` —
  the city register (building code / standards office / sovereign / buildings /
  programmes of works) and the hive register (bees / comb / trails), one page,
  reference never law: where it and a charter disagree, the charter wins. With it,
  **the waggle** enters the working vocabulary — a decision-density signal for a
  sovereign protecting his throughput: the whole field at a glance, lower resolution
  never crop the frame, four-line anatomy (Problem / Move / Stakes / Dig), served
  from any mantle on "waggle me X". NOT a default duty — Felix's own ruling: usage
  decides; if the asks keep coming, a future sweep folds sovereign-facing surfaces
  (escalations, batch reports, the decision queue) to waggle-by-default. Edits:
  `docs/the-city.md` minted; DOCTRINE §13 gains the verb. Birthplaces: the frame —
  this sitting's routing arbitration (the whiteboardy mis-summons); the waggle —
  sitting 02's `waggle-dance.md` coinage (LOG entry three) plus this sitting's live
  demo, on whose strength D50 was countersigned. Felix's words at ratification: "a
  decision-density signal for a sovereign protecting his throughput… I want this to
  become canon." (Amended 2026-08-15, same sitting, Felix: Dig may fall silent when
  the depth is this conversation — absence means *here*; Problem, Move, and Stakes
  never collapse. Same word: the invocation line entered the global `canon/CLAUDE.md`
  — a countersigned deploy, D37's one-clause precedent — the term now invocable on
  every session of every account; default-duty stays deferred to usage.)
- **D52** (2026-08-15, Grand Architect (07) · ✓ Felix): **The clarification lane.**
  Canon text may be edited without a new D-entry when the edit is a *clarification*:
  wording brought into agreement with intent already citable on the record, the
  ancestor named — a line in the same artifact, a D-entry, a countersigned finding.
  The test: **does any session behave differently after the edit?** If yes —
  decision. If no — the text now merely says what the record already proved it meant
  — clarification. No ancestor, no clarification; in doubt, it's a decision.
  Clarifications still take Felix's word on canon files (unsigned canon never
  deploys) and leave a trace — the ledger line names the edit and its ancestor; git
  keeps the bytes; no inline scar (strike-notes are for superseded meaning, not
  improved wording). Ancestors: the amendment law (§8, append-in-place) and simmy's
  dated correction folds (DOCTRINE §3), extended to canon wording. Rationale on
  record — register density: fifty-two entries in thirteen days; a register diluted
  by wording fixes buries the law (Felix's articulation, via the D45/D46 unease).
  Prior sharpenings stand unrenumbered — we don't hide where we came from. First
  rider, executed as clarification #1: grand-architect.md "a new campaign" → "a new
  canon campaign" (ancestor: the Owns line, "campaign keels … for canon work").
  *(Amended 2026-08-29, Felix, at the C28 desk — the test itself was flawed: the
  behavioral-invariance test wrongly forces every good clarification to mint a
  number, because clarifications, improvements, and amendments OFTEN should change
  behavior — that is the clarification working. The test is the issue, not the
  behavior: **does this serve the issue its ancestor was addressing, better?**
  Then it is the same decision, improved — amend the ancestor, cite it, spend
  zero numbers. Only a genuinely new issue mints a new number. Visibility is
  preserved the same way it always was: meaning changes append with a dated note
  and take his blessing — the numbering never protected him, the blessing did.
  Amended by its own corrected method, in one breath, on the law itself.)*
- **D53** (2026-08-22, Grand Architect (08) · ✓ Felix): **ISSUES.md generalizes —
  every project's incident inbox.** Field reports and fold candidates land there
  mid-work: Felix's hand, or a session's at his word (a null-mantle session told to
  file does so and moves on). The project's Architect sweeps at every review sitting:
  each entry ruled — folded into the docs, cut as a row, rejected, or escalated by
  class (canon-shaped entries go to the canon repo's inbox) — then **deleted**: the
  fold's home records folds, the ledger line records rejections, git keeps the bytes
  (entries are committed before they are drained). The inbox drains empty — never a
  second ledger; protocol rides the file header. Minted at founding (`ISSUES.md`,
  empty, header only); a subproject adopts on first need. The null-mantle delivery is
  the project CLAUDE.md's one clause — bare sessions read nothing else. Edits:
  DOCTRINE §2/§3/§12 + templates (`issues.md` minted, claude-md clause),
  architect.md (Owns + step 5). Birthplaces: this repo's inbox (D49, three sweeps
  run, drained empty each time) + simmy's, in daily use.
- **D54** (2026-08-22, Grand Architect (08) · ✓ Felix): **The pre-authorization
  law.** Fetching, vendoring, installing beyond the repo's existing dependencies, or
  executing anything pulled from the network happens only when the work doc names
  it — an unnamed need is a STOP-and-escalate fork, never an after-the-fact review.
  A vendored tree records its exact upstream version and carries its license FILE —
  a license named from memory is not a record. Edits: DOCTRINE §5; the rider
  template's universal core (canon/mantles/README.md) — every dispatched session
  provably holds the rider. Birthplace: simmy §8 (S8's noVNC/websockify vendoring,
  blessed only after a 59-file hash-verify against upstream tarballs and two license
  corrections — "MIT" was MPL-2.0, "BSD-3" was LGPL-3.0; authorization is the cheap
  path, review is the expensive one; minted there 2026-08-06, `4f25e0f56`).
- **D55** (2026-08-22, Grand Architect (08) · ✓ Felix): **The venue law.** A row
  that mints a disposable live venue — a VM, a container, a machine — deletes it at
  landing; pausing is for mid-work, never for done. A teardown the permission guard
  refuses is reported in the row's report for the Architect's sweep at batch close:
  a refused delete reported is fine, a venue silently kept is not. The project's
  agreements name the standing set that is never swept. Edit: DOCTRINE §10.
  Birthplace: simmy §8 (`01f2cf3c8` — delete-not-stop): eight machines up coincided
  with an OrbStack control-plane panic that took every session's venue down
  (bulletin 2026-08-03); 23 machines accumulated by 08-06, most from landed spikes.
- **D56** (2026-08-22, Grand Architect (08) · ✓ Felix): **The verdict law.** A
  verdict about the system's behavior — geometry, emission, anything an operator or
  user sees — cites the governing contract section it stands on: **no citation, no
  verdict**, whatever job the session was summoned for — sessions drift jobs, and
  the citation duty is what re-triggers the read when the question class changes.
  A field incident arriving mid-session is a **Digger-shaped question**: first move
  is the governing contract + findings; the first analysis is a hypothesis until a
  reproduction confirms it, and it leaves the session *labeled* hypothesis, never
  guidance. Edits: architect.md (new section + forbidden line). Birthplace:
  cornerizer §8 preamble + rider (`25637111a`, 2026-08-19 — the L1 forensic: two
  confident wrong geometry verdicts in one sitting, both corrected by a two-minute
  contract read; survived in the field since). The entry's third candidate (the
  one-screen invariants block + summons line) has no birthplace — routed to
  cornerizer as an experiment per the harvest law, not folded.
- **D57** (2026-08-22, Grand Architect (08) · ✓ Felix): **The batch is amendable
  mid-flight.** The Architect may amend a running batch — new rows, a raised
  ceiling, a changed plan — by message to its Dispatcher. An amendment carries the
  same instruments as the summons: the row(s) with kickoffs verbatim, and the
  amended batch note, committed; it binds like the original, and dispatcher.md §1's
  prerequisites apply to the new rows before they dispatch. The Architect's cut asks
  first whether a running batch can absorb the row — a sequencing reason is tested:
  real dependency, or a convention a worktree dissolves? The amendment message is
  drafted verbatim by the Architect and delivered by whoever can see the Dispatcher —
  the account silos hide peers, so Felix's hand is the standing fallback. Edits:
  dispatcher.md §2, architect.md step 6, DOCTRINE §10. Birthplace: cornerizer batch 8
  ("AMENDED 2026-08-16 mid-flight: + C15, ceiling 2" — the batch-9 sequencing existed
  only for the shared-tree rule; a worktree dissolved it; Felix's question started it).
- **D58** (2026-08-22, Grand Architect (08) · ✓ Felix): **The linking law.** Durable
  docs link the files they reference at first mention —
  `[plans/04-sync.md](plans/04-sync.md)`, `[D19](DECISIONS.md)` — one click beats a
  minute's hunt. Anchors only onto real headings: a bold list item resolves no
  anchor — the file link is the value. Boards link their work docs. Edit: DOCTRINE
  §3. Ancestor practice: this repo's board has linked its work docs since founding;
  ratified at Felix's ask (his own `[Decisions D19](DECISIONS.md#D19)` field test).
- **D59** (2026-08-22, Felix): **bun is the JS/TS default.** The global
  `canon/CLAUDE.md` gains a STACK DEFAULTS section: JS/TS work defaults to bun
  (`bun`, `bun test`, `bunx`) — never npm/node/vitest unless the repo's own files
  say otherwise. Sited in the global file by the load-map's enforcement corollary:
  the pain strikes in bare sessions at project start, and the global file is the
  only file provably open there — a stack doc nobody loads is dead law, and memory
  is siloed comb (D27). Updateable by countersigned edit when the runtime fashion
  changes. Evidence: Felix specified bun by hand twice in one week; whiteboardy
  already runs it.
- **D60** (2026-08-22, Felix · applied by the Grand Architect (08)): **GENESIS
  becomes MAP.** The master doc of a full project is **`MAP.md`** — the D25 test
  re-run: a protocol singleton (one per scope, read as protocol) → ALLCAPS; the noun
  names the doc's life, not its birth (genesis is the founding moment; the map is
  how the city thinks — the city register already called it the master plan).
  Rename-is-a-move (D33): `git mv`, content bytes forever. The word *genesis*
  retires: DOCTRINE §12 becomes "the founding ritual" — the vocabulary was already
  *found/founding* everywhere else; template `genesis.md` → `map.md`. Migration per
  D33's precedent: new foundings mint `MAP.md`; existing repos rename at their own
  Architects' boundaries — the old name is valid until then, nothing breaks
  meanwhile; subprojects keep `README.md` as master doc (D17 unchanged). History
  unedited (D32's scope law): D-entries, ledger, closed briefs, and birthplace
  citations to other repos' files keep saying GENESIS. Live surfaces renamed this
  sitting: this repo's `MAP.md` (example #1), repo CLAUDE.md, DOCTRINE §2/§3/§12 +
  templates table, templates/claude-md, mantles README, architect.md +
  grand-architect.md Owns wording, docs/the-city.md, docs/load-map.md,
  plans/RIDER.md, plans/quartermaster.md.
- **D61** (2026-08-22, Felix · law drafted by the Grand Architect (08)): **The
  tending default.** A batch is Dispatcher-tended by default — serial chains included
  (D43); Felix-tended is the exception, and the batch note names its reason (his own
  eyes are the gate at each landing — a visual pass, a live smoke); chain size or
  serial shape is never the reason. The cut composes the longest Dispatcher-runnable
  arc — Builder rows and dispatched Architect review gates (D44) in one chain — and
  the chain returns to Felix only at escalations and named Felix-gates, resuming on
  his word in the Dispatcher's own window: no fresh Architect summons to relay a
  countersign. An Architect advising Felix that a runnable chain "doesn't need a
  Dispatcher" is proposing a mis-cut. Felix's operating vision, recorded at his word:
  found the project, plan as much as possible, then the Dispatcher runs Builders and
  Architect passes, stopping only at what escalates to him. Edits: DOCTRINE §10 +
  §12 step 4; architect.md step 7. Birthplaces: batch 2 of this repo — sequential,
  dispatched, countersign pauses included (D43's own ancestor); Felix's field report
  this sitting (the sovereign as router: summon Architect → review → countersign →
  re-summon Dispatcher — the interaction tax D44's objective exists to eliminate).
- **D62** (2026-08-25, Felix, by decree · charter + book drafted by the founding window
  (the GA-09 sitting, renamed `mentat-00` mid-sitting by Felix's own hand) · ✓ Felix
  same sitting — point-by-point on the six-clause shape, then "Do it all. Make it so."):
  **The Mentat — the sixth mantle.** The sovereign's cross-project thinking partner:
  explores, pushes back, expands awareness, anticipates problems, maps the branches —
  **zero authority: changes minds, not files.** One office, a succession of windows,
  interactive only, never dispatched; staffing fable, max effort by default; name-stamp
  `mentat-<NN>`, no theater (one office — 13's redundancy ruling, applied by Felix's
  rename before the law was written). Two rituals only: **the book** and **capture**
  (keepers written to the building they belong to before the window dies; taste spoken
  aloud captured with its why — the corpus itself stays a future campaign in stone,
  never a mantle's pocket). **The book is `SAPHO.md`** (D40's institution, second
  holder) — the juice by which windows acquire the office's speed — with new physics for
  a high-frequency office: a one-line floor per session, weight earns paragraphs, and a
  **Standing Computation** (a folded head the Mentat maintains) so orientation stays two
  minutes forever while the tail grows — append/fold/strike, applied to a self. The book
  is the Mentat's ledger; `LEDGER.md` only when a sitting changes repo state beyond it.
  **The Imperial strike (Felix):** "help me become the best version of myself" struck
  from the duties as Imperial-throne work (D39) — the Mentat stays FUN; the sentiment
  survives at mission altitude only. Fences: drafts everything, executes nothing;
  campaigns gestate here and are handed to Architects; read-only scouts allowed;
  Royal/Imperial work never claimed. **Birthplaces (harvest law):** the early Grand
  Architect windows, used as thinking partners before they architected (Felix's
  telling); the deliberation-sitting genre (plans/quartermaster.md, the map sitting,
  the night-shift deliberation 2026-08-24/25); and the mis-summons that proved the
  hole — this window, summoned "an Architect at fable-max" with no board to own,
  because no mantle fit the ask. Woven: MAP §3, docs/the-city.md, docs/load-map.md §2,
  `summon/presets.tsv` (`e` → m[e]ntat, fable-max, red — the sapho stain; harness
  re-run green). Deferred, named: the skill shim (`canon/skills/` is the live sync
  set — a future signed sitting) and the rig's one-office name-stamp exception for
  mentat (fires currently stamp a theater segment; a Builder row when Felix wants it).
  The epigraph's working-castes verse stays untouched on purpose (D31): the Mentat sits
  beside the sovereign, outside the hive's verse.
- **D63** (2026-08-26, Grand Architect (10) · ✓ Felix — history clause widened at his
  word: "we have git history… it doesn't have to be just tails"): **The schema fold —
  FC-1…FC-9 + the molt clause.** Nine format amendments, every one blessing or fencing
  what the field already does (birthplace: Belvedere P3, the 27-doc corpus scan —
  `belvedere/plans/p3-parse-coverage.md` §§3–4): (a) `Felix-gate` is a legal Staffing
  value — the glass renders his card, never a fire button; (b) gate/merge/design rows
  resolve into the five states, the verdict riding the annotation (`LANDED — PASSED …`
  / `— MERGED <sha>` / `— BLESSED …`) — the lifecycle stays five words; (c) `PENDING`
  never leads: `OPEN — PENDING <precondition>`; (d) the staffing rider is legal —
  `<Mantle> · <tier> (<rider>)`, parsed and ignored by dispatch, never the concurrency
  plan's home (D28 stands); (e) Depends-on takes exactly two forms — row ids and
  `Felix-gate: <text>`; preconditions become gate rows (D44), scheduling rides the
  batch note; (f) the ledger head gains a tier slot — `**<date> · <mantle> · <tier>
  (<row>)**`, nothing else in the bold; (g) the Next law — a baton handing a session
  carries the summons fenced in the entry, or by row-reference (`fire <row-ids>`)
  resolved to the work docs' fences: no stale twins; (h) bob's ISSUES entry line folds
  (`- <date> · <who> · <what>` + `---` evidence blocks) — its Open/Harvested sections
  do NOT: the drain law stands; (i) a decision title is a label — the bold delimits
  the whole title and nothing else. **The molt clause:** form migrates freely, history
  included — tool-assisted (`doctrine migrate`, row 16), diff-reviewed, meaning
  byte-preserved (the converter never paraphrases; a countersign attaches to meaning
  and survives the re-shape); meaning changes append or supersede visibly, never
  silent in-place rewrite — citations and countersigns hang off entries, and sessions
  load working trees, not git archaeology. Supersedes D32's "history conforms as-is"
  **for form**; D32's meaning scope stands, and `dream.md` is untouched by its own law
  (D33). Edits: DOCTRINE §§3/4/7/8; templates ledger/issues/decisions. Amendments
  bind new writing on landing (doctrine is read at wearing); the corpus converges via
  row 18. *(Amended 2026-08-26 at row 16's F2 ruling · ✓ Felix same day: where a
  pre-doctrine source never held a required field — a decider, a
  tier, a `Decided:`/`Next:` clause — migration writes the literal **`unrecorded`**: a
  typed absence, never a guess. Lint reads it as conforming; grep finds it forever;
  replacing it takes cited evidence and a visible commit, by a session, never the
  converter.)* *(Amended again 2026-08-28 at the GA-11 sweep · ✓ Felix same day —
  entered here, not as a new number, at his word (register minimalism: an extension
  of recorded intent amends its ancestor): the required-slot list is illustrative,
  never exhaustive — `unrecorded` is legal in ANY required slot: ledger tier and
  mantle, board tier, staffing sub-slots, a decider, a decision title
  (`**unrecorded.**`), a `Decided:`/`Next:` clause. And the Staffing grammar gains
  **`unstaffed`** — a row deliberately carrying no staffing (parked,
  killed-before-staffed, Felix's-call rows): `unrecorded` there would assert
  ignorance where the board asserted knowledge. The discriminator: **`unrecorded`
  asserts ignorance; `unstaffed` asserts knowledge** — write the one you can defend.
  Birthplaces: waypoint-stepper rows 18/19/23 (the token verbatim in the field),
  cornerizer C8/C34's `staffed when unparked`; 18f and 18g drew the line
  independently. A third token, `bare session` (D26's null mantle in a ledger head),
  was proposed and struck — a one-cell corpus fails the harvest bar; D26's cell
  writes `unrecorded`. The linter learns the tokens at row 19.)*
- **D64** (2026-08-26, Grand Architect (10) · ✓ Felix — the fork shape added at his
  word: "I AM absolutely okay with A/B choices, as long as it's clear"): **The baton
  grammar — move, wave, fork.** D42/D46 amended: **ambiguity was the sin; plurality
  never was.** The baton stays `Baton — <one holder>: <move>`, and the move takes one
  of three forms: the **move** — one instrument (summons fenced, `fire <row-id>`
  reference, or the named Felix-action); the **wave** — n parallel instruments, legal
  iff the holder could fire all of them now without choosing between them (D44's
  batching, given its shape); the **fork** — the choice IS the move: few exclusive
  options, every option instrumented (choosing A fires *this*), a recommendation
  named or the call explicitly marked taste. Instruments are fenced verbatim or
  row-references the rail resolves to work-doc fences (D63g). Still dropped by
  construction: an uninstrumented option, a menu with no recommendation, two holders,
  a decision smuggled in prose. The rail renders move/wave/fork as one / n / choice
  buttons. Edits: DOCTRINE §11 + §13; dispatcher.md §6/§7; architect.md
  end-of-session. Birthplaces: Belvedere's founding close (three parallel kickoffs
  disguised as one prose move); P3 §3i (1 of 8 tails fireable); node-param's
  three-option close re-read — wrong for handing three vague levers, not for the
  number three.
- **D65** (2026-08-26, Felix · campaign cut by the Grand Architect (10)): **v3 — the
  molt: the AI-native format campaign.** The Belvedere mandate ratified canon-side
  (belvedere D7 arriving home): machine consumers are first-class readers of the
  truth layer; terminal-first convention carries no veto; the design leads, the
  standards follow — and evidence leads the design. The standing ruling: **the schema
  is the standard; serialization is per-consumer** — the types are law, doctrine-
  markdown stays the canonical write surface (lossless once D63 propagates) until row
  17 dethrones it with numbers, and P3 §5's JSON shapes are the normative parse of a
  conforming corpus. Rows cut (MAP §5, priority from the Sovereign, ahead of the
  parked standards work): **16** — the doctrine linter: P3's probes harden into canon
  `doctrine/`, one parser in the city (CLI `doctrine lint` / `parse --json` /
  `migrate`; the glass imports the library); **17** — the storage experiment: does
  structured-source truth beat schema-markdown for all three consumers (Felix's hand,
  a session's cold start, the glass)? one building as lab, after glass v0 supplies
  evidence — tested, never decreed; **18** — the great re-cut: full-corpus migration,
  history included, `doctrine lint` green ×17 buildings. With it the load-map
  corollary (the Arborist fold): a law that must bind bare sessions lives in
  CLAUDE.md or a hook — charters bind only the mantled (DOCTRINE §3); the line-count
  hook itself stays project physics (05's rejection terms). Birthplaces: belvedere
  D7 + P3; the arborist close-out (`~/code/rooted/archive/arborist/README.md` §5).
- **D66** (2026-08-26, Felix · clause drafted by the Grand Architect (10)): **The
  redundancy tiebreak — Directive §1.7.** The Coding Directives gain: *"Eliminate
  Redundancy Over Blind Consistency → Consistency Must Carry Information — 'No
  Special Case' Is Not a Reason."* The fenced reflex: "no special case" invoked to
  defend a field, segment, or rule that carries zero information in context.
  Birthplace: the row-13 name-stamp overrule — Felix, mid-commit: one GA office means
  the theater segment is redundancy, not information (`grand-architect-09`, never
  `grand-architect-agents-09`). With it: **the Directives are D-entry-governed** —
  every future value change rides this register; the constitution in `canon/CLAUDE.md`
  stays the single home (organize-shape A, Felix's call — a commentary register is
  minted the day a value needs more why than an arrow-line holds). Live deploy ×3 at
  his countersign, D37/D51 one-clause precedent.
- **D67** (2026-08-26, Grand Architect (10) · ✓ Felix): **Dispatch visibility — the
  interim law.** From Felix's decree ("I NEED visibility into every agent that is
  running"; the Row-30 incident — a subagent invisible to /tasks): dispatcher.md
  gains the **announce duty** — every dispatch posted in the tending session as it
  fires (row · tier · vehicle), so there is always one place to ask what is running.
  The census requirement routes to Belvedere (its inbox, this date): P1 must count
  Agent-tool subagents or name the blindness. The vehicle fork is named, not
  resolved: Workflow-vehicle is /tasks-visible but bypasses the row-12 guard (its
  named hole, D47); Agent-vehicle is guarded but invisible. The full
  no-invisible-agents law is cut when the census proves what it can see — the
  mechanism signs the charter (Felix's minting principle, quartermaster keel-note).
  The blanket ban is declined on the record: it would unstaff the Dispatcher with
  nothing to replace its limbs.
- **D68** (2026-08-28, Grand Architect (11) — proposed, pending Felix countersign):
  **The typed-absence vocabulary — ignorance vs knowledge.** D63's `unrecorded`
  amendment generalizes, and recorded absences get their own tokens. The
  discriminator: **`unrecorded` asserts ignorance; the other tokens assert
  knowledge** — write the one you can defend. (1) `unrecorded` is legal in ANY
  required slot whose record history simply lacks — ledger tier and mantle, board
  tier, staffing sub-slots, a decider, a decision title (`**unrecorded.**`), a
  `Decided:`/`Next:` clause: the amendment's list was illustrative ("a required
  field"), never exhaustive. (2) **`unstaffed`** minted as a whole-Staffing value:
  the row deliberately carries no staffing — parked rows, killed-before-staffed
  rows, rows whose go/no-go is Felix's without being gate rows; writing `unrecorded`
  there would assert ignorance where the board asserted knowledge. Birthplaces:
  waypoint-stepper rows 18/19/23 (the token verbatim in the field), cornerizer
  C8/C34's `staffed when unparked`; 18f and 18g drew the identical line
  independently — two buildings, one missing token. (3) **`bare session`** minted
  for the ledger-head mantle slot: D26's lawful null mantle is a recorded absence,
  not a lost record — the 2026-08-07 forensic entry's mantle cell (18a's flagged
  `unrecorded`) flips to `bare session` at this countersign, and every future bare
  session that changes repo state writes it. Birthplace: D26's own vocabulary.
  (4) The linter learns all tokens at row 19; replacing any typed absence still
  takes cited evidence and a visible commit (D63 stands). Rejected: the stricter
  alternative (an unstaffed OPEN row is malformed and the Architect owes it a
  staffing at cut) — waypoint 18/19's own Status says "Felix's call whether it is
  worth a hook"; forcing a staffing there invents information (Directive §1.7).
  Edits at countersign: DOCTRINE §4 (Staffing bullet), §7 (head grammar), §8 (the
  `unrecorded` sentence's slot list). *(Ruled 2026-08-28 at countersign: not a new
  number — folded into D63 as its second amendment at Felix's word (register
  minimalism: extensions of recorded intent amend their ancestor); clause (3)
  `bare session` struck — a one-cell corpus fails the harvest bar. The number
  stands spent; the law lives in D63.)*
- **D69** (2026-08-28, Grand Architect (11) · ✓ Felix 2026-08-28 — "bless";
  PARKED confirmed as the board token for his "deferred", the prose word surviving
  in annotations): **PARKED is an annotation; the parked list is for the un-cut.** `PARKED` joins
  `PENDING` as a legal OPEN annotation (D63c's genre): `OPEN — PARKED <reason>` —
  the state leads; a leading PARKED is the same defect as a leading PENDING. The
  line: **the parked list holds ideas without ids; a cut row parks in place** — a
  row, once cut, stays a row (ids are stable, D18), and parking is a status fact,
  never a board removal. PENDING and PARKED differ on purpose: PENDING waits on a
  named external precondition; PARKED is deliberate shelving — nobody is waiting,
  and unparking is a fresh decision. A parked row's Staffing is honestly
  `unstaffed` (D68) where the shelving dissolves its staffing. Rejected: a sixth
  lifecycle state (the lifecycle stays five words — D63b's own defense), and
  PARKED-as-KILLED (cornerizer's cells name live preconditions — "earns a build on
  iron or not at all" is a shelf, not a grave). Birthplaces: the architect
  charter's own verb ("park what's real but out of scope — parked is tracked, not
  lost"), DOCTRINE §4's parked list, this board's row 11 (the same act in prose),
  cornerizer C8/C22/C34 (the field spelling), 18g's recommendation (a). The
  city-wide respelling rides row 18's continuation; the linter learns the token at
  row 19. Edit at countersign: DOCTRINE §4 (annotation bullet).
- **D70** (2026-08-28, Grand Architect (11) — proposed, pending Felix countersign):
  **The offline type gate — TS rows pin their checker.** Every order whose
  deliverable is TypeScript names its type gate, and the gate runs offline:
  `typescript` (plus the runtime's types — `@types/bun` under bun) pinned as dev
  dependencies with a `tsconfig.json`; `bunx tsc --noEmit` is then a sanctioned,
  network-free check that D54 riders may name. An unpinned `bunx tsc` resolves
  from the network mid-build — three D54 slips in three consecutive Belvedere
  build rows (B1 and B4 self-reported; B3 filed it as the missing tool it is)
  prove the reflex systemic: every TS Builder reaches for the checker, so the
  checker must already be in the repo. `bun test` + running code stays the
  behavior gate; this entry is types only. Birthplace: Belvedere's own B8 ruling
  (pinned deps + tsconfig + rider language, in daily use since), harvested per
  the harvest law. Edit at countersign: DOCTRINE §5 (one sentence in the D54
  paragraph). *(Withdrawn 2026-08-28 at the countersign sitting — Felix's word on
  the GA's own teardown: an unpinned `bunx tsc` was already D54's named sin and
  the pinned path was already legal — this entry canonized a bandage; the harvest
  bar (one project, a days-old ruling) unmet. Belvedere's B8 stands as project
  physics; re-harvest if a second project bleeds. The number stands spent.)*
- **D71** (2026-08-29, Grand Architect (12) · ⬡✓ Felix 2026-08-29 — "I bless the
  standard"): **The Guild's Standard — one concept, one word.**
  [canon/work/STANDARD.md](canon/work/STANDARD.md) is law: the working vocabulary chosen
  by Felix across nine live rounds on the 21 census (1.26M words · 38 readers ·
  coverage 441/441 · 3,066 terms). The spine: bless (the yes) · rule (the decision,
  either way) · charge / lay / ignite / ignitable · batch (any graph between
  ⬡-gates) · campaign (all the batches; charge < batch < campaign) · session ·
  Office/Mantle split (Offices: Grand Architect, Mentat; Mantles: Architect,
  Builder, Digger, Fixer — the null named; Dispatcher dead, the flow engine is the
  new dispatcher) · cornerstone / keystone (Foundation reserved) · distill ·
  reconcile / DEFERRED / clear / canonize · coda (rider's heir) · ⬡-gate · ⬡-queue ·
  ⬡✓ · C‹n› charge ids (per-building; history grandfathered per D18) · the
  punctuation grammar (— qualifier · : field value · → handoff) · waggle remade (one
  plain sentence per thing) · Done when: · the 24 pinned formulas · American + grey
  · acronym law · every register and away-board named · the read-cold test · the
  graveyard binding (row, cut, fold, fire-as-dispatch, wave, move, sitting, keel,
  rider, helm, glass-the-word, brief/order-as-doc-names, countersign-as-verb, DoD,
  ratify, chain, true-as-verb, park/PARKED, drain, harvest, unstaffed, --bless).
  Supersedes: DOCTRINE §13; D51's four-slot waggle anatomy; D63's `unstaffed`
  (charges are always staffed — an unmantled session IS a Fixer); D69's PARKED
  spelling (→ DEFERRED, his own word). Deploy rides the seven-step plan in the
  standard (law book → parser → sweep → linter → glass → charters-on-his-drafts);
  the sovereign's-input clause and the kill/strike translation duty bind every
  reader. Birthplaces: the census corpus and its collision atlas; manny's M-rules
  (the linter's ancestor); the live decode benchmark ("Baton — ⬡ → Ignite the
  distillation session.").
- **D72** (2026-08-29, Builder (C26) — proposed, pending ⬡✓): **The vocabulary arm's
  enforcement contract.** `doctrine lint --vocab` polices speech the way the parser polices
  form (D71 §8's enforcement clause, ancestor manny's M13), and four rulings make it livable.
  **(a) A flag, not a default** — the form arms gate the exit code, the vocabulary arm reports
  a backlog; and §7's prefix findings are `warn`, reported and never enforced, never moving
  the exit code. **(b) A mention is spelled in ticks or quotes** — the arm cannot tell use
  from mention (C23-F3), so the doc says which: `` `unstaffed` `` and *"the Dispatcher is
  dead"* are invisible to it, and that, not a per-file exemption, is the cure for tombstone
  prose. **(c) A LANDED or KILLED charge is history whole** — its Work cell as well as its
  Status annotation, because a finished charge's title is the address its ledger cites;
  `canon/` is fenced for the same reason, a law book must name the dead to bury them.
  **(d) Eight of §9's thirty-two rows are unenforceable and are dropped in writing, with
  their reasons in `doctrine/src/lexicon.ts`** — `chain`, `fold`, `wave`, `move`, `window`,
  `strike`, `pass`, the four-slot waggle — and three more are narrowed on measured evidence
  (`row` to a reference, `true` to `trued`/`truing`, `fire` to its bare form: 8/8 Guild-sense
  against `fires` 0/5 and `firing` 1/8). A pattern that cannot be written without false
  positives is dropped, never weakened. Precision 96.9% on n=131 across two audits. Files:
  `doctrine/src/lexicon.ts` (the mirror of §§7–9), `doctrine/src/vocabulary.ts` (the fence and
  the arms), `doctrine/test/vocabulary.test.ts` (the drift alarm, which proves itself against
  mutated copies of the standard). Supersedes nothing; binds every later sweep.
- **D73** (2026-08-29, Grand Architect (15) · ⬡✓ Felix 2026-08-29 — blessed in-session):
  **The flow doctrine — the batch note's successor.** A **flow** is a batch as data: the
  declared DAG the dispatch runs (Belvedere D11/D12 ratified canon-side; the engine's
  birthplaces: B10–B12, landed with live smokes 2026-08-27/28). For engine-tended batches
  **the flow file IS the batch note** — the board's note points at it; prose batch notes
  remain the Felix-tended exception (D61's default re-pointed: the default tender is the
  dispatch, operative at agents-flow-1's landing; until then the batch note names its
  tender). The engine's canon law: **D10 wholesale** — ambiguity never arms and never
  advances; only declared or scope-grown steps ignite — the blessing covers the scope
  (D12); **every flow carries a
  budget** — a ceiling on engine ignitions per blessing; at the ceiling the engine pauses and
  a re-blessing extends (the zoning law's lineage, D29/load-328; external ancestor cited:
  graph-engineering's spawn-cap guardrail, read 2026-08-29); **a step may continue a
  session** rather than ignite fresh when the lay says so — continue when the next act
  consumes this act's judgment, go fresh when the altitude changes (GA-10's coda, now
  law; B5's resume-by-stamp is the built hand); **the edge test** — Depends-on carries an
  edge only where a charge reads its dependency's result; ordering preference is
  schedule, and schedule rides the batch note or the flow (graph-engineering's fake-edge
  rule, confirming D63e); **a gate session with no row of its own lands by the row it was
  staffed for, never by its own session** (B12 F2); the batch report is the flow's
  rendered close plus the close gate's distillation; **flow files are the building's
  truth** and live with its `plans/` — interim, while Belvedere is the only reader:
  `belvedere/flows/` naming the building; the Steward gate unchanged (D5 — unparked by
  Felix's word only). The Dispatcher tombstone's operational law — verbatim relay, the
  report shape, the escalation stops, the announce duty (run-state + the Works render
  it) — binds the engine's spec: **no mantle; machines get specs, sessions get
  charters.** Serialization per charge 17's verdict, ratified: prose artifacts stay
  schema-markdown, field artifacts are data, and a field the glass needs **enters the
  D63 grammar — never a storage flip.** Edits: DOCTRINE §10; STANDARD §2 (flow, hold),
  §3 (the dispatch as holder). Birthplaces: the flow keel + B10/B11/B12 evidence;
  charge 17 §Verdict; GA-10's coda; codejunkie99/graph-engineering (the two imported
  guardrails + the edge test's wording — the first external ancestor cited into canon,
  scorecard in charge 20's findings). *(Respelled same day at the ⬡ ruling "Bless
  bless": arm → bless throughout — form molt, meaning intact; the graveyard row is
  the standard's 33rd.)*
- **D74** (2026-08-29, Grand Architect (15) · ⬡✓ Felix 2026-08-29 — blessed in-session;
  the qualified id chosen at the fork): **The flow fold — the grammar.** Seven fields
  and their tokens enter the D63 grammar, per 17's line (a field the glass needs is
  typed by the one parser): **(a) the holder is written** — `Baton — <holder> → <action>`,
  holder ∈ ⬡ · a named session · **the dispatch** (a legal holder: the tender-holder
  case closes — a batch the machinery tends says so, and no button is wired); the
  instrument-first classifier retires where the form is present; shapes: single
  implicit, `batch —` / `fork —` written, a fork carries a `recommendation:` slot;
  **(b) holds** — `LANDED <date> — holds: <list>`: the named remainders that pause
  dependent charges; absent = clean; clearing is written on the row (keel §5.1's
  "LANDED lies by omission" answered); **(c) escalations are ids** — born
  `E‹n› — <what>`, dead `E‹n› ruled <date>`; regex classifiers retire (the 120-of-390
  tax); **(d) a worktree charge carries `**Branch:**`** in its charge-doc header (prose
  reading measured 0/62 sound, b3 F5); **(e) the Work cell opens with the
  encapsulation** — the ≤6-word linked name (27 of 38 rail cards had none); **(f)
  Depends-on gains its third form** — the qualified cross-building id `<building>:<id>`,
  register-resolved at lint (one city, one graph, namespaced nodes; gate-charge-per-
  crossing and strictly-local rejected at the fork); **(g) tier parses into
  model · effort** — writing unchanged. Migrate rules per the molt clause; **lint binds
  tails and new writing; history respells form-only.** Builder work: C32. Evidence:
  17 §C3 (7/9 asks are heuristics; the holder inverted live on this repo's own tail;
  27-of-38 nameless cards), b3 §§E2/F4/F5, B12 §§F1/F2, 18d's cross-building filing.
- **D75** (2026-08-29, Felix · ⬡✓ in-session — "add the Scope clause to global"):
  **The directives' scope splits on lifetime.** The global file gains `## SCOPE`:
  code built to last answers to all of the directives; code built to die — a
  Digger's scratch, a lab script — answers to §3 (Safety) and the git conventions
  alone; correctness never optional, polish on dying code is waste. Resolves the
  latent contradiction between "personality, code style… always apply" (the
  precedence clause) and the Digger charter's "polishing disposable code" ban —
  Felix's catch at the C28 desk: "we care about the result of the Dig, not the dig
  being dug in the most elegant way." The Builder charter carries the mirror
  emphasis (built to last — doubly bound) at its redraft. Deployed live ×3 at the
  edit (the sync set); birthplace: C28 F17's stack probes + the digger v4 audit.
