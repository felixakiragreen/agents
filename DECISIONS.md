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
- **D36** (2026-08-06, Architect · QUEUED — dispatch of row 09 countersigns, per D34
  precedent): **summon rig v1.1 — sticky state, palette, responsive panel.** From
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
