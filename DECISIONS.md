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
