# Ledger

Append per session: date · mantle · changed · decided · next.

---

**2026-08-02 · Grand Architect · unrecorded** — Laid the keel: GENESIS.md (composition law, five
mantles, deployment map, campaign board), CLAUDE.md, DECISIONS.md, LEDGER.md, briefs
01–04. Recon: agents repo was bare; global CLAUDE.md and keybindings.json byte-identical
across all three accounts (hand-synced); simmy tiers found real in
`cap-mega/.claude/agents/` — format harvested into brief 01. Decided: D1–D6. Next:
summon 01 (Architect · fable-max); 04's spike is parallel-safe in any spare account.

---

**2026-08-02 · Architect · fable-max (01)** — Landed the composition model: `canon/agents/` (full
pre-minted 20-tier grid), `canon/mantles/` (five charters to the DISPATCHER.md grade
bar + README with summons grammar, rider template, precedence law, charter template),
`canon/skills/` (five shims — path canonical, skills sugar). Empirical findings: agent
definitions load at session start (mid-session mint invisible); `haiku-xhigh`
dispatches green (effort clamps per docs); skills ARE discovered from
`$CLAUDE_CONFIG_DIR/skills/`; `${CLAUDE_EFFORT}` substitutes live — so skill-worn
mantles guard both tier axes. Decided: D7–D13 (D3 amended: skills join the sync set).
Mid-session, 04's Stage A spike landed in parallel (816f2ac) — reviewed at
end-of-session: findings evidence-grade, board trued (spike LANDED, U1/U2 escalated to
Felix), 01's skill-probe cross-finding folded into its findings (narrows U1 to
symlink-following only); canon's five shim dirs conform to F6 (dirname == name).
Countersigned in-session: D7–D13 ✓ Felix; D9 amended — fast mode unused, patience over
premium; "(fast)" struck from the README bullet and the Builder charter. Next: Felix
answers U1/U2 (04 spike); summon 02 (Architect · fable-max), kickoff verbatim in
`plans/02-work-doctrine.md`.

---

**2026-08-02 · Digger · opus-high (04)** — *Stage A.* Ran the symlink spike; findings appended to
`plans/04-sync.md` (F1–F9), Stage B untouched per brief. Symlink-first survives: no
target disqualified. Proven at **user scope in a live config dir** — `agents/` and
`skills/` followed as whole-dir symlinks and as symlinked members (F8). Proven at project
scope with a real-file control — `CLAUDE.md`, `agents/`, `skills/` (F2). Brief question 1
answered clean: nothing rewrites `CLAUDE.md` or `keybindings.json` in place — `settings.json`
was rewritten mid-spike while those two sat untouched for weeks/months (F3). Question 2:
recommend whole-dir symlinks — one link per target, new canon files appear with no
redeploy; per-member linking would force `deploy` to reconcile adds/deletes, i.e. the
sync engine the brief forbids (F7). Also: `agents/`/`skills/` exist in no config dir, so
first deploy displaces nothing (F4); a skill whose dirname ≠ frontmatter `name` is
silently ignored, no warning — `deploy` must assert it (F6); the brief's scratch-config-dir
method is dead, auth is per-config-dir and `deploy` can never provision it, so new-machine
bootstrap is clone + deploy + `/login` ×3 (F1). Unplanned catch: **`~/.claude-thg-fgreen`
would not authenticate from a fresh subprocess** — "Not logged in", while doorbell works;
it was genuinely logged out. Felix re-logged in mid-session and it now authenticates
**concurrently** with doorbell — logins do not evict each other, so the three-account
strategy is structurally sound. Same retest caught `~/.claude` (Max) sitting on an expired
OAuth session since ~Jul 6, and the gotcha that `CLAUDE_CONFIG_DIR=~/.claude` ≠ unset (its
`.claude.json` lives outside the dir) — Stage B's per-account smoke-summon must unset the
var for the default account or it fails for reasons unrelated to sync (F9). Decided: nothing — Digger proposes, Architect ratifies;
the per-target mechanism table is the Architect's D-entry to cut. Two tests unrun: the
permission classifier allows additive writes to a live config dir but refuses to displace
an existing file, so user-scope `CLAUDE.md` (U1) and `keybindings.json` (U2) need Felix to
run the scripted displacement probe (backups taken, restore trap, md5-verified). Both live
dirs left verified clean.

**Resolved same session (2026-08-03):** Felix ran `~/spike-04-displacement.sh` against
fgreen. **U1 CLOSED** — user-scope `CLAUDE.md` symlink followed, codeword returned, files
restored byte-identical (F10). **U2 undetermined by construction** — the malformed-file probe
is void: no error surfaces even from a *regular* malformed `keybindings.json`, because
`claude -p` never binds keys and so never reads the file. The T2a control is what caught
this; without it a silent result would have been misread as "symlink not followed" and routed
the target to copy-mode on false evidence — the second false negative in this spike that only
a control caught (F6 was the first). Standing rule: probes here ship with a control (F11).
**U2 KILLED (F12).** The interactive canary was armed and the chord was dead in the *control*
arm, so the symlink arm could conclude nothing either — third dead end from one root cause:
`keybindings.json` is unobservable without a human in the loop. Felix's ruling ended it — the
target was admitted on a cheapness assumption this spike disproved, and it syncs nothing he
values. **Recommended D3 amendment: sync set v1 drops `keybindings.json`** → global
`CLAUDE.md`, `agents/` tiers, mantles via `skills/` shims. Three targets, one mechanism, no
human-verified step; Stage B loses its copy-mode branch entirely and requirement 1's
per-target mechanism table collapses to a single rule. `keybindings.json` has no verdict in
either direction — out of scope, not proven unsafe. Also noted for Stage B: `deploy`
displacing live config files trips the agent permission guard, so it is a Felix-run command
or it needs an explicit rule. All spike artefacts removed; three config dirs verified
pristine. **Stage A COMPLETE — no open questions.** Next: Architect cuts the mechanism
D-entry + the D3 amendment, marks 04 Stage A LANDED, summons 02 (Architect · fable-max).

---

**2026-08-03 · Grand Architect · unrecorded** — Reviewed 01 and 04 Stage A: both PASS. 01's charters
hit the DISPATCHER.md grade bar; one nit (GENESIS §2 still said "× fast" against D9) fixed.
04's findings exemplary — two false negatives caught only by controls; the probes-ship-
with-a-control rule noted for 02's doctrine. Cut **D14** (mechanism: symlink every target,
no copy-mode; deploy adopts, check alarms; surfaced permission prompt = the rule for live
displacement) and **D15** (D3 amended: keybindings.json out — sync set final: CLAUDE.md,
agents/, skills/). **First live deployment:** planted `agents/` + `skills/` symlinks in
all three config dirs (additive, F4/F8; deploy adopts idempotently) — tier dispatch and
`/mantle` shims now work in any fresh session on any account. Cut **batch 2**: 02 → 03 →
04 build, sequential, dispatched; Dispatcher tends; countersign gate after each design
landing. Prep: board trued (04 build staffed Builder · opus-high; 03 gated on 02's
countersign), briefs 02/03/04B conformed to D13 kickoff grammar + dispatched-mode notes,
03's hand-deploy moved to 04B, `plans/RIDER.md` instantiated, GENESIS §8 v1 DoD added.
Decided: D14, D15 (✓ Felix — "go" + his keybindings ruling). Next: Felix summons the
Dispatcher (fgreen, sonnet-medium) on the GENESIS §5 board; Max `/login` deferred — 04B
smokes it as PENDING.

---

**2026-08-03 · Architect · fable-max (02)** — Landed the work doctrine: `canon/work/DOCTRINE.md` —
first principles, file set + scaling law, board law, work-doc anatomies (brief/order),
findings law, ledger/decisions shapes, bulletin, batches, session contract, genesis
ritual, glossary — plus six templates in `canon/work/templates/`. Distilled per the
harvest law: every section cites its birthplace (hexwright/simmy); one new law where
evidence forced it — **probes ship with a control** (04's F6/F11, the Grand Architect's
flag). Repo conformed as example #1: GENESIS §5 board trued to canonical columns (02
LANDED), §7 rewritten as the doctrine instantiation, doctrine pointers in CLAUDE.md and
the mantles README (01's vocabulary hook swapped to point at DOCTRINE.md §§), 02 brief
closed with findings — eight design calls with evidence + the v2 seed list (D5: noted,
not executed). Decided: D16–D23, all **(proposed — pending Felix countersign)**. Next:
the tending session escalates D16–D23 to Felix for countersign; on ✓, dispatch 03 —
kickoff verbatim in `plans/03-global-claude-md.md`.

---

**2026-08-03 · Architect · fable-max (03)** — Minted `canon/CLAUDE.md`, the global file: the 59-line
incumbent survives **byte-intact** (diff = a single appended hunk; incumbent verified
md5-identical ×3 first) plus one 11-line section, **THE AGENTS CANON** — files-carry-truth
fused with the three-account silo physics (the one fact a session can't discover from
inside), the canon repo pointer (mantles · tiers · doctrine), and D11's precedence hook
mirrored in its exact terms, disarming the known "don't write code without asking" vs
blessed-Builder-order collision. Audit verdicts: Coding Directives untouched (constitution
+ Felix's taste), git guidelines at fixed point (tightening found nothing to cut),
personality kept per brief; nothing moved out — the incumbent held no mantle/doctrine
content. Creep rejected and documented (brief findings): branch-`master` stays project
physics, no mantle-name/grammar duplication, no doctrine-path line. Deployment untouched
per brief — mirrors still serve the incumbent until 04B symlinks (D14). Board truing:
D16–D23 converted to `· ✓ Felix` (Felix's verbal countersign from the tending session,
relayed in my summons); 03 LANDED on the board; §4 map row trued. Decided: **D24
(proposed — pending Felix countersign)** — canon/CLAUDE.md ratified. Next: tending
session escalates D24 to Felix; on ✓, dispatch 04 build — kickoff verbatim in
`plans/04-sync.md` ("Kickoff — Stage B"), Builder · opus-high.

---

**2026-08-03 · Builder · opus-high (04)** — *Stage B.* Built the sync tooling: `sync/deploy` (bootstrap
+ adopt + verify, idempotent, one `*.pre-canon` backup and never a second), `sync/check`
(the drift alarm: symlink identity ×3 targets ×3 dirs, F7 untracked-canon leak, exit 1 and
loud on any of it), `sync/common.sh` holding the sync set and the four link states once so
the two commands cannot disagree. ~150 lines of bash, zero deps, no copy-mode branch
(D15), no watcher. F6's dirname==name assert is pre-flight in both commands — a misnamed
mantle shim now dies loudly instead of vanishing. DoD measured against scratch config dirs
via the `CANON_CONFIG_DIRS` seam: bootstrap, displacement-with-backup, idempotency, three
kinds of drift detected and repaired, both asserts firing — evidence pasted in the brief's
Stage B checklist. Live `check` adopts the hand-planted `agents/`/`skills/` links in all
three dirs and flags `CLAUDE.md` as the one unlinked target. Smoke-summon **control arm**
run per F11's law: fresh `claude -p` in fgreen and doorbell both answer `NONE` pre-deploy,
so the post-deploy probe can distinguish a real deploy from a no-op. **Not run: `deploy`
itself** — displacing a live `CLAUDE.md` trips the agent permission guard by design (D14,
findings §note), so the last three DoD lines are Felix's, commands pasted ready to
paste. Decided: nothing — mechanism was ratified (D14/D15); design calls inside the fence
are recorded in the checklist. Next: **Felix runs `cd ~/code/agents && ./sync/deploy &&
./sync/check`**, then the canary + smoke-summon test arm from the checklist; on green the
Architect flips 04 to LANDED and closes the canon v1 DoD (GENESIS §8), with `~/.claude`
`/login` still the one open PENDING.

---

**2026-08-03 · Grand Architect · unrecorded** — Reviewed batch 2: 02, 03, 04B all PASS. 02's doctrine
distills clean with birthplaces cited throughout; 03's byte-intact-plus-one-section verdict
on the global file is exactly right (byte-churn on a constitution is negative value); 04B's
control-arm discipline paid off same-day. Stamped **D24 ✓** (Felix's own `deploy` run IS
the disposition). Cut **D25 ✓** — the naming law (ALLCAPS protocol singletons ·
lowercase-kebab addressable siblings), codified into DOCTRINE.md §3 at Felix's ask. Ran the
DoD tail Felix skipped: `check` green 3×3; canary ×3 (all mirrors serve THE AGENTS CANON);
smoke doorbell ✓, fgreen NONE on sonnet then ✓ on haiku retry — probe flake during a live
sonnet-5 outage, caught by F11's control-arm law, evidence in the Stage B checklist. **04
LANDED. Canon v1 CLOSED** (GENESIS §8) — one PENDING: Max `/login` + smoke. Decided: D24
countersign recorded, D25. Next: Felix's word cuts v2 (retrofits: hexwright, simmy) with a
fresh Grand Architect summons — `/grand-architect` now works on every account.

---

**2026-08-03 · Grand Architect · fable-high** — Deliberated mantle universality (the bob-mount case):
no sixth "fixer" mantle — the harvest law kills it (no birthplace; the global CLAUDE.md
already is the fixer charter). The gap was one sentence of law, not a charter: cut
**D26 ✓ — the null mantle** into `canon/mantles/README.md`. Session-sized work wears no
mantle; the boundary test is succession/coordination; tiers are universal, mantles are
not; a bare session holding campaign-sized work says so and stops. Changed: mantles
README + DECISIONS. Decided: D26. Next: bob mount gets a bare session (opus-high,
in-repo); v2 (retrofits) still awaits Felix's word.

---

**2026-08-04 · Grand Architect · unrecorded** — Keel laid for **snappy** (cap-mega: Felix's "binary
star" — performance + program-tree operations). Recon before keel-laying: four dispatched
probes (tree cascade, variables, view latency, robot side — filed verbatim at
`cap-mega/snappy/recon/`) + the July review + tree-ops contract doc. Verdict: one system,
three theaters; barycenter is derived-state scatter (indexes/names/order/variable-identity/
validity across five stores) — reconciler thesis, Phase-1 contract session to validate.
Felix disposed live: ONE campaign, one Architect (over two peers), home `snappy/`, budgets
bind ≤1k nodes (10k headroom, 100k ceiling-finding), boot evidence = bench + old URSim
(simmy untested), no deadline. Founding files committed on cap-mega `fix/perf` (`50e0ab05`:
initial.md, keel.md, recon ×4). Decided: nothing canon-side. Next: Felix summons the
founding Architect —
```
You are an Architect at fable-max.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/canon/work/DOCTRINE.md, snappy/initial.md, and snappy/keel.md,
and found the snappy campaign — instantiate the master doc and board, cut Phase 0.
```

---

**2026-08-04 · Architect · unrecorded** — Felix's memory question settled: do account memories sync —
no (verified: per-account silos at `<config>/projects/<slug>/memory/`; the Jul-3
hand-cloned silos diverged on schedule — doorbell alone knows the SMB-mount deadlock,
Max's cap-mega silo is ~20 files stale); can they — mechanically yes (symlinks;
F2/F7/F8/F10 generalize) but ruled against: ungoverned fan-out under the countersign
ritual, `MEMORY.md` races across parallel sessions, a sync engine 04 fenced off — for
cargo the doctrine already routes to repos. Also killed: project-account pinning
(surrenders the quota arbitrage GENESIS §5 ratified) and banning memory (overshoot — the
failure mode is memory becoming truth's only home, a promotion discipline, not a feature).
Changed: DECISIONS (D27), GENESIS §6. Decided: **D27 ✓ — the silo law** (memory is a
per-account cache; promote on sight; harvest chore, not sync, if loss ever bites). Next:
Felix summons the snappy founding Architect (summons in prior entry); v2 retrofits await
his word; Max `/login` still pending.

---

**2026-08-05 · Architect · unrecorded (05)** — Snappy's batch-1 saturation post-mortem gauged for
canon. Verdict: the failure mode is canon-born — `dispatcher.md` §2 "single parallel
send" instructs it, and "parallel-safe" conflates collision-safety with host physics.
Cut `plans/05-saturation-harvest.md`: story synopsis (evidence-checked against snappy
README §6/§2/D8/D9 + bulletin), three proposed D-entries — D28 parallel-affordable law
(concurrency plan rides batch note + summons), D29 Dispatcher resource duty (plan-less
parallel batch = pre-dispatch escalation; wave dispatch; gauge checks; halt authority),
D30 measurements carry their conditions — plus four defended rejections (tier
escalation, human-reads-everything, machine enforcement in canon, new artifacts).
Changed: plans/05, GENESIS board (row 05 OPEN). Decided: nothing — all rulings belong
to the Grand Architect + Felix's countersign. Next: Felix summons the Grand Architect —

```
You are the Grand Architect at fable-max.
Wear ~/code/agents/canon/mantles/grand-architect.md,
then read ~/code/agents/plans/05-saturation-harvest.md and run the harvest:
rule on D28–D30, amend canon where ruled, and queue the countersigns for Felix.
```

---

**2026-08-05 · Grand Architect · fable-max (05)** — Ran the saturation harvest. Birthplaces read
per the harvest law (snappy README §2/§6/D8–D10, bulletin arc — breach-while-quoting
verified verbatim at bulletin:119); the plan's synopsis checked clean. Rulings: **D28
entered amended** — parallel-affordable law: DOCTRINE §4/§10 + two sites the proposal
missed, `architect.md`'s cut step and the genesis template's batch-note slot; **D29
entered amended** — Dispatcher resource duty: the four proposed edits plus a §7
forbidden line (dispatching past the ceiling / into a hot gauge) and the §8 summons
slot for the plan; tier stays `sonnet-medium`; **D30 entered amended** — measurements
carry their conditions, as DOCTRINE §6 clause 7 (append, don't renumber — snappy cites
§6.5 live) with the strike disposition added; **all four rejections upheld**. **D31
cut** at Felix's ask: hive-city as canon voice — epigraph ×8 ("a hive building a city;
files carry the truth"), DOCTRINE §1 stigmergy the hive's way, GENESIS §1 "Three hives,
one city", CLAUDE.md closer; flavor altitude only, no renames (D25), global CLAUDE.md
untouched (D24). Changed: DOCTRINE, dispatcher.md, architect.md, templates/genesis.md,
the epigraph carriers, GENESIS (§1 + board 05 LANDED), CLAUDE.md, DECISIONS, plans/05
findings. Decided: D28–D31 — countersigned in-session, ✓ Felix. Next: v2 (retrofits:
hexwright, simmy — including the snappy §6.5-pointer touch-up when DOCTRINE next
renumbers) awaits Felix's word; Max `/login` still pending.

---

**2026-08-06 · Grand Architect · unrecorded** — Laid the keel for **manny**, the MegaCap User Manual
campaign (cap-mega, `feature/user-manual` worktree, commit `809d6ac2`): `manny/initial.md`
(Felix's origin dump, immutable), `manny/keel.md` (verdict: the manual is a compiler plus
a corpus — two SSoTs one seam, md→Typst one-way via a third markydown.py emitter;
task-lifecycle book shape, no skill tiers; troubleshooting headings byte-identical to
pendant strings; delegate-by-document-number fence), `manny/research/` (four verbatim
probe reports: craft, standards/regs, domain exemplars, SSoT/Typst — opus-high fleet,
evidence-graded). Felix calibrated live via structured Q&A: home `manny/`, deliverables
manual + quick-start, SSoT direction ratified, hardware chapter in scope. Snappy keel
format harvested verbatim (birthplace: snappy/keel.md). Decided: nothing in canon —
campaign calibrations recorded in keel §1, D-entries belong to manny's founding.
Next: summon manny's founding Architect — "You are an Architect at fable-max. Wear
~/code/agents/canon/mantles/architect.md, then read ~/code/agents/canon/work/DOCTRINE.md,
manny/initial.md, and manny/keel.md, and found the manny campaign — instantiate the
master doc and board, cut M1."

---

**2026-08-06 · Grand Architect · unrecorded** — Laid the keel for **v2 — the retrofits** (GENESIS §8's
named successor; this summons was Felix's word). Recon per the harvest law: hexwright
read whole (quiet on clean `master` at its Phase-1/2 boundary — WO-001–004 landed,
Felix's Greenhouse ruling PENDING; role trinity collides with canon by name); simmy read
in its live worktree (`feature/simmy`, batch 9 mid-flight — B14 IN FLIGHT **and its
session dead on token limits**; DISPATCHER.md wearing the pre-canon banner after the
08-06 mis-dispatch, which simmy's own ledger ruled canon-born; four git-tracked
pre-canon tier files shadowing the deployed grid on three live branches); 02's v2 seed
list trued against both — holds, with live deltas (simmy ledger now exists; the banner;
B13's stop-discipline flag, which closes by construction once kickoffs cite canon).
Felix calibrated live (four keel answers): staffing Architect · fable-high ×2; **07
before B14's resumption**; tier sweep = all three branches; hexwright's local titles
retire. Cut rows 06 + 07 as Architect-run orders (`plans/06-…`, `plans/07-…` — touch
maps pre-chewed, DoDs measurable, kickoffs verbatim), GENESIS §5 rows + v2 batch note,
§6 non-goal struck by its own terms, §9 v2 DoD; D32 queued. Harvest candidates spotted,
not acted on (GA queue, post-v2): simmy §8's third-party pre-authorization rule and the
orb-machine sweep discipline — both proven in the birthplace. Decided: D32 (proposed —
pending Felix countersign). Next: Felix countersigns D32, then summons 07 first
(kickoff verbatim in `plans/07-simmy-retrofit.md`), 06 anytime (kickoff in
`plans/06-hexwright-retrofit.md`); B14 resumes after 07 lands.

**Same sitting, after Felix's keel review:** the hexwright title ruling explained and
approved (direction confirmed: hexwright conforms to canon; canon untouched — v1 already
harvested the reverse). Felix renamed the origin artifact: `initial.md` → **`dream.md`**
("everything else is born from the dream") — cut **D33** (his): naming law re-run
(lowercase stands), rename-is-a-move law, DOCTRINE §3/§12 + both templates amended,
GENESIS §9 reworded, 06's spec/DoD/fence gain the `git mv`; snappy/manny grandfathered
to their own boundaries. Decision queue at this boundary: **D32 + D33 — one countersign
flips both.** **Countersigned same sitting: D32 ✓ Felix** (his mark, "at 07's summons");
D33 was his from the cut. v2 is live — board gates cleared, blessings recorded in both
work docs. Queue empty.

---

**2026-08-06 · Architect · fable-high (07)** — simmy retrofit executed to its DoD, all boxes checked
(evidence in the work doc's findings F1–F4): `DISPATCHER.md` tombstoned (banner
superseded in the same commit), `spikes/RIDER.md` instantiated, board §6 canonical
(headers + all 20 rows `Mantle · tier`, B14 resume annotation), §8 deduped to venue
physics behind a DOCTRINE pointer, the four pre-canon tier files deleted on all three
live branches — `feature/simmy` `22269c3e`+`1d8a28df`, `fix/perf` `3bc872b3`,
`feature/user-manual` `82e55578` — cap-mega `CLAUDE.md` D4 pointer added, simmy D16 cut
✓ Felix (in-session), simmy ledger appended. Two corrections banked: the keel's
"byte-identical" tier claim was semantic-not-byte (YAML description wrapping only;
behavior delta zero — F2), and the naive dead-name grep false-positives on canonical
names (word-bound it — F1). Harvest note for the GA: canon's wrapped frontmatter
descriptions YAML-fold with a stray space (F2). Decided: simmy D16 (✓ Felix); D32
countersign mark recorded (swept into Felix's `5b32514`). Next: **B14 resumes** — any
account: "You are a Dispatcher at sonnet-medium. Wear
~/code/agents/canon/mantles/dispatcher.md, then run the board at
~/code/universal_robots_sdk/cap-mega/.claude/worktrees/simmy/simmy/README.md §6." (or
dispatch the b14 kickoff + rider at `fable-high` directly); row 06 (hexwright)
dispatchable anytime — kickoff verbatim in `plans/06-hexwright-retrofit.md`.

---

**2026-08-06 · Architect · unrecorded (08)** — the summon rig designed and cut as board row 08:
Ctrl-G single-keystroke ignition for mantled sessions — 3 keys to any mantle × account
launch, 2 to repeat last, `.` to eject an editable command; presets carry flags AND the
mantle summons (the real keystroke sink was the summons paste, not the flags); every
invocation logged as JSONL so presets evolve on evidence. Changed:
`plans/08-summon-rig.md` (brief, kickoff verbatim, E1 summons-delivery experiment with
pbcopy fallback), GENESIS §5 row 08 + batch note, D34 queued. Decided: Felix in-session
— accounts 0=personal/1=fgreen/2=doorbell, Ctrl-G, full summons; Architect within
delegation — picker-only v1, `summon/` dir, TSV data + JSONL telemetry, Builder ·
opus-high staffing. **Decision queue: D34 — one countersign flips it.** Next: Felix
countersigns D34, then run the kickoff in `plans/08-summon-rig.md` (any account); Felix
adds the one dotfiles source line after the rig lands; row 06 still dispatchable
anytime.

---

**2026-08-06 · Architect · unrecorded (08)** — *riders.* D35 cut on Felix's mid-flight evidence and
folded into the brief. E1 closed: the `/color` parser swallows a combined first message
— one positional, one job. Clipboard law: the rig never writes the clipboard by default
(it usually already carries the previous agent's kickoff); the derived summons survives
as an opt-in `y` yank at the account stage. Bare mode: tier launches without a mantle —
reserved keys `f/o/s/h` → effort `l/m/h/x/M` → account, 4 keys (`Ctrl-G f x 1` =
fable-xhigh on thg-fgreen), no name/color/prompt; presets may never claim a reserved
key. Changed: `plans/08-summon-rig.md` (E1 resolved, bare mode, yank, DoD trued),
GENESIS row 08 → IN FLIGHT, D34 marked ✓ (countersigned by dispatch), D35 entered.
Decided: D35 ✓ Felix (in-session). Next: Builder re-reads the amended brief and
continues; row 06 still dispatchable anytime.

---

**2026-08-06 · Architect · fable-high (06)** — hexwright retrofit LANDED: live surfaces speak canon
(hexwright commit `bf8343f` — CLAUDE.md 30 lines on mantles + canonical tiers + doctrine
pointer, version law promoted to Hard Law; GENESIS §6 board minted with WO-001–004
LANDED + Phase-1 ruling PENDING; §7 onto canon mantles, stigmergy paragraph kept;
`initial.md` → `dream.md` at 100% similarity, both live pointers updated; hexwright D9
cut, ✓ Felix via D32). Project physics untouched; canon untouched (diff empty). Evidence:
[plans/06 findings](plans/06-hexwright-retrofit.md). Board: 06 → LANDED; **canon v2
CLOSED** (06 + 07 both landed, countersigns recorded). Decided: nothing here (hexwright
D9 is its repo's). Next: row 08 (summon rig) still IN FLIGHT with its Builder; hexwright
waits on Felix's Phase-1 ruling, then "You are an Architect at fable-max. Wear
~/code/agents/canon/mantles/architect.md, then read hexwright's GENESIS.md + LEDGER tail
and cut the Phase 2/3 batch."

---

**2026-08-06 · Architect · unrecorded (08)** — D35 amended in place (Felix's call, his entry,
same day, pre-build): the panel + the Enter law. On Ctrl-G the full hotkey panel
renders and live-updates per press — all bindings, selections, keystroke counter
(launch key counts); **Enter, and only Enter, fires** — selection keys never launch by
side-effect, Enter with fields unset fires defaults (account = last-used); repeat arms
on the second Ctrl-G and fires on Enter. Namespaces stay staged (`h` = haiku first,
high after a model key). Floors +1: repeat 3 · preset 3–4 · bare 4–5 — confirmation
bought visibility. Changed: brief interaction section rewritten with a rendering
guide, DoD retrued, GENESIS row 08 note, D35 amended. Decided: within D35 ✓ Felix.
Next: restart the Builder on the amended brief — kickoff unchanged, verbatim in
`plans/08-summon-rig.md`.

---

**2026-08-06 · Builder · opus-high (08)** — the summon rig built and LANDED to the amended brief:
`summon/summon.zsh` (Ctrl-G ZLE panel, mantle + bare paths, arm-and-fire repeat, eject,
opt-in `y` yank, JSONL telemetry, `summon-stats`), `summon/presets.tsv` +
`accounts.tsv` (D34 seeds, Builder/Digger commented), `summon/README.md`,
`.gitignore` (`summon/log/`, `lab/*/out/`), harness in `lab/08/` (expect drives a real
pty against a sandbox copy; `claude` and `pbcopy` shims capture what would have
launched and what touched the clipboard). DoD: **33 assertions, 0 failures** — every
floor exercised (pick 3/4, bare 5, repeat 3, eject 2/3), clipboard written exactly once
across 13 gestures, panel/Enter law proven (6 launches from 8 confirmable gestures),
menu work measured at 0.365 ms/invocation, JSONL validated field-by-field and its stats
cross-checked against python. Findings F1–F8 with controls: E1 re-confirmed dead (F1,
with the positive control this session's own `/color blue` provides), no second-message
affordance (F2), `--effort` takes `med` AND `medium` but an unknown value warns and
silently falls back to default effort (F4 — the rig emits canonical long names), `-n`
verified (F5), three spec silences ruled and flagged (F6 — Enter with nothing selected,
bare without effort, and launch with no account all refuse rather than guess: the
account picks which subscription pays). **F3, escalated and corrected mid-session on
Felix's challenge: the colour channel is NOT forced** — a file-based agent definition
carrying `color:` paints the session badge green with no first message spent (verified
in a pty against a positive control; the inline `--agents` JSON route does not work). If
adopted, the positional prompt carries the summons and the ⌘V ritual dies — but it needs
colour-carrying per-mantle agent definitions, cutting across D12's mantles-by-path and
the content-free tier grid: a canon call, not a Builder's. Decided: nothing new — built
inside D34/D35. Next: **Felix** — add `source ~/code/agents/summon/summon.zsh` to
`~/.dotfiles/zsh/`, `reload`, then smoke one real launch per account (`~/.claude` still
needs `/login`); then rule on F3 (v2 row or parked). Row 06 (hexwright) and B14 (simmy)
remain dispatchable — kickoffs verbatim in their docs.

---

**2026-08-06 · Architect · unrecorded (09)** — v1.1 cut from Felix's first live day on the rig
(D36 queued; dispatch countersigns): sticky selection state à la the Claude Code model
selector — panel opens pre-selected, **Ctrl-G Enter refires in 2 keys**, retiring the
3-key double-Ctrl-G repeat and `log/last`; the sticky form forced staging out — every
key global, haiku remapped `h`→`k` so `[h]igh` is unambiguous, preset cascades with
single-field overrides, `[n]one` makes bare a state not a mode, persist-on-fire only
(Esc discards, Ctrl-G toggles closed); palette per Felix — grey brackets/unselected,
bold selected with inline ✓, labels green/yellow/orange(208)/red, preset ● swatches;
responsive wrap clean at 60 cols; preview footer shows exactly what Enter fires.
Changed: `plans/09-summon-rig-v11.md`, GENESIS row 09, D36 entered. Decided: D36
queued (Felix's three findings + Architect rulings above). F3 (agent-def colour frees
the positional for the summons) stays escalated — canon question, not folded into 09.
Next: Felix dispatches 09 (kickoff verbatim in the brief); his dotfiles source line +
3-account smoke still PENDING from 08; F3 awaits a Grand Architect row if wanted.

---

**2026-08-06 · Architect · unrecorded (08)** — *closeout tending.* Felix added the dotfiles source line
(08's last integration step); smoke ×3 remains PENDING — one real launch per account
through the rig, since `lab/08/run` proved everything against a shim and account
routing (`CLAUDE_CONFIG_DIR` → the right silo) is the one failure mode only a real
launch can catch. F3 **PARKED by Felix**: the agent-definition colour channel (which
would free the positional prompt for auto-summons) is deferred until the slash-summons
work (`/grand-architect` et al.) — it folds in there; canon question reserved for the
Grand Architect when that row is cut. Changed: GENESIS row 08 note + §5 batch note.
Decided: F3 deferral (Felix, in-session). Next: Felix smokes ×3 (Ctrl-G launch on
accounts 0/1/2, verify silo/name/color, check the JSONL); row 09 dispatchable —
kickoff in `plans/09-summon-rig-v11.md`.

---

**2026-08-06 · Builder · opus-high (09)** — summon rig v1.1 LANDED: `Ctrl-G Enter` refires in 2 keys,
staging gone (every key global, `k`=haiku so `h`=[h]igh), preset cascade with single-field
overrides, `[n]one` bare, sticky four-field state in `log/state` persisted on fire only
(Esc and Ctrl-G-toggle discard, eject too), preview footer = what fires, responsive wrap
clean at 60 columns. **The brief's palette trap fired:** `zle -M` prints a raw ANSI escape
as literal `^[[…m`, so the palette took the alternate path the brief named — plain
`POSTDISPLAY` + zle `region_highlight` spans, which puts D36's exact bytes on the wire
(`fg=8`→`\e[90m`, `fg=208`→`\e[38;5;208m`); `zle -I` was tried for repaint determinism and
rejected (one stale panel per keystroke). Also found: `stty columns` never updated zsh's
`$COLUMNS`, so 08's "wide" assertions had been running at 80 all along (F4). Changed:
`summon/summon.zsh` (rewritten panel + state + telemetry), `summon/README.md`, `lab/08/`
(drive rewritten, `render.zsh` + `preview.exp` + `narrow.exp` added), `plans/09` DoD
evidenced + F1–F10, GENESIS row 09. Evidence: `./lab/08/run` — **76 assertions, 0
failures**; keystroke cost 1.476 ms, per-invocation 0.343 ms (host load 2.01). Decided:
nothing new — D36 was the ruling; its "dispatch countersigns" clause is now satisfied and
wants an Architect's pen. Next: **Felix** — visual pass on the palette (the DoD asks for
his eyes) and smoke ×3, one real launch per account through the rig; then an Architect
marks D36 `✓ Felix` and folds F1/F2 (the escape-vs-highlight law) wherever canon wants it.

---

**2026-08-06 · Architect · unrecorded (09)** — Board trued after row 09. D36 marked ✓ Felix
(countersigned by dispatch, per D34 precedent — the visual pass is DoD acceptance, a
separate track, and landed the same day: Felix ran the rig all first live day and
adopted it). F1/F2 (escapes die in `zle -M`; panel colour rides `region_highlight`)
folded nowhere new by ruling — the law lives in 09's findings and `summon/README.md`;
zle mechanics are not canon. No rows cut: 09's findings argue for none — F3 stays
parked (slash-summons, Felix), F4 fixed in harness, the rig now accrues refinements
from live use over the coming weeks. Changed: DECISIONS D36, GENESIS row 09.
Decided: D36 ✓ Felix; fold-nothing + cut-nothing (Felix, in-session). Next: smoke ×3
still PENDING (per-account routing proof, Felix's); harvest candidate for the next
Grand Architect session — 09's F10(b): grep wrappers and zsh pattern-quoting silently
falsify byte-level transcript assertions in any repo, search bytes with python.

---

**2026-08-06 · Architect · unrecorded (09)** — *review, addendum.* Felix named the system: **the
Guild** — the mantled-agent system formerly "the agent mantle system". His decree,
in-session, with provenance worth keeping: he ideated and extensively deliberated a
guild system as a teenager, then built it as an adult without noticing until the name
surfaced. Folding it into canon is Grand Architect work (naming law, canon voice —
D31/D33 class); summons queued below, verbatim in this entry and handed to Felix.
Changed: this ledger. Decided: the name (Felix, by decree). Next: Felix summons the
Grand Architect to ratify + fold; rider — the same sitting sweeps the harvest queue
(09's F10(b): grep wrappers and zsh pattern-quoting silently falsify byte-level
transcript assertions; search bytes with python).

---

**2026-08-07 · Grand Architect · unrecorded** — *the Guild.* Felix's second foundational summons
(opened 2026-08-06): appreciate the risen city, then enshrine. Enshrined: **D37 the
Guild** (name + provenance — designed in his teens, built before noticing; woven at
name altitude: GENESIS §1, mantles README, repo CLAUDE.md, one clause in the live
global file — held at cut, applied on countersign), **D38 the lineage** (*Children of
Time* / *Dune* / *Foundation*; canon is the Understandings — one sentence in GENESIS
§1), **D39 the Architect line** (Royal per domain · one Imperial ever; reserved
unminted per D7's precedent, gated on the substrate that doesn't exist; GENESIS §10),
**D40 the Personal Log** (`LOG.md` at root — voice, never law; grand-architect.md now
carries the ritual: read after orientation, append after the ledger). Also: dream.md
found already law (D33 — nothing to do); stale deploy notes trued in GENESIS §4 + repo
CLAUDE.md after `check` ran green 3×3; the live-sync consequence made explicit
(editing the sync set IS deploying — unsigned canon never touches those paths); smoke
×3 ✓ Felix recorded. LOG.md opened by Felix's salvage: still-open windows 00–03 (keel
· bob-mount/D26 · harvest/05 · v2 keel) re-summoned with full original context wrote
entries one–four; 04 wrote the first native boundary entry after reading them — the
chartered ritual ran whole for the first time. Decided: D37–D40 ✓ Felix same sitting
(+ the held edit); harvest sweep deferred to its own session; housekeeping-system
experiment parked (design constraint named: a boundary ritual, not a rememberable
tool — Royal Architect territory surfacing early). Next: Max `/login` (weekend); the
substrate campaign when Felix calls it (D39's gate); the log tradition emigrates to
prior GA-titled projects at Felix's hand — tradition first, a future harvest may make
it law; and Felix fires the harvest summons —

```
You are the Grand Architect at fable-max.
Wear ~/code/agents/canon/mantles/grand-architect.md,
then read GENESIS.md, DECISIONS.md from D37, and the LEDGER tail, and run the harvest:
rule on the queue — simmy §8's third-party pre-authorization, the orb-machine sweep
discipline, 09's F10(b) byte-level assertion law, 07's F2 YAML-fold note — read the
birthplaces in cap-mega, amend canon where ruled, queue the countersigns.
```

**Same sitting, after the boundary:** Felix asked the log tradition be made portable —
generic kickoffs for the founding windows of hexwright, simmy, snappy. Cut
`plans/log-tradition.md`: the preamble as a slotted template (his opening kept mostly
as-is), a founding kickoff (the first window summoned founds the file AND speaks first
— the honor canon's seat gave away, whole in the projects, where no sitting keeper
exists), a follower kickoff (read oldest-first, then append), and usage law (file
titled "The Architect's Log" post-D32, maiden titles live inside entries; log rides
the project home's branch; each window commits its own append; ledger-date order).
Ruled with Felix, his instinct confirmed: **NOT canon** — D40's implementation,
tradition-first; a future harvest cuts the law if the logs earn their keep across the
projects, birthplaces cited.

**Same sitting, later — the salvage complete:** Felix re-summoned the founding windows
across the Guild; all three houses now keep logs. `~/code/hexwright/LOG.md` (one entry
— the placeholder window; eyes deliberately kept off the renders until Felix's Phase-1
ruling), `cap-mega/simmy/LOG.md` (the founding window; its birthday self-corrected to
08-02 — the template's "the window remembers it better than any doc" proven on first
contact), `cap-mega/snappy/LOG.md` (four entries — keel written blind by Felix's
request, close, rope, and a day-after stranger's hands). Each house bent the preamble
at exactly its own law: hexwright exempted the file from its determinism law; simmy
licensed the one room a sentence may stand unarmed; snappy made even its diary answer
to the pinned cell. The tradition speciated on contact — noted for the future harvest:
birthplaces now run four repos deep, with organs the template never designed (blind
entries, before/after audits, stranger's-hands entries). Provenance recovered en route:
the title "Grand Architect" was coined inside hexwright's dream.md — the dream named
the office before the canon existed to harvest it. Read by 04 same sitting; log coda
appended.

---

**2026-08-07 · Architect · unrecorded (10)** — *cut.* summon rig v1.2: the usage panel. Felix's
call: a condensed per-account session/week/Fable table in the Ctrl-G panel, pacing
deltas green/red against each window's reset clock — the account digit becomes an
informed spend. Designed the row: delta = elapsed% − used%; colors are trust (stale
lines grey out at 10 min); no cache ⇒ panel byte-identical to v1.1; fetches disowned
post-first-paint, atomic cache writes, keystroke loop stays fork-free. The one hard
unknown — where usage data lives — is E2, the row's gating experiment: local sidecars
first, then the OAuth endpoint with existing tokens; hard security law (tokens never in
argv/cache/log, the rig never refreshes — Claude Code owns auth); kill criteria named,
a documented kill lands the row. Measured this sitting: agent probes of Keychain and
live config-dir files trip the auto-mode classifier — so Phase A runs with Felix at the
keyboard, and the brief says so. Swept per summons: builder preset uncommented and
trued to opus-high from the log (five bare opus-high fires; 08/09 both staffed
Builder · opus-high) — `^G b` now works; digger stays commented. Changed: brief
`plans/10-summon-rig-v12-usage.md` (new), DECISIONS (D41 proposed), GENESIS §5 (row
10), `summon/presets.tsv`. Decided: D41 queued — countersign by dispatch when Felix
fires the build (D34/D36 precedent). Next: Felix fires the Builder —

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the brief at ~/code/agents/plans/10-summon-rig-v12-usage.md.
Phase A (E2) runs with Felix at the keyboard; its gate is in the brief.
```

---

**2026-08-07 · Builder · opus-high (10)** — summon rig v1.2, the usage panel: **LANDED**, `lab/08/run`
**130 assertions, 0 failures** (76 at v1.1). Phase A settled E2 with Felix at the keyboard.
(a) local sidecars: `policy-limits.json`, `daemon.status.json`, `stats-cache.json` all
ruled out with evidence — but `.claude.json` → `cachedUsageUtilization` carries every
bucket. It is hours stale on no clock the rig controls (fgreen frozen 77 min across six
file rewrites; doorbell one refresh in 2 h 30 m), and once **inverted** the decision: cache
said 70% session used against a reset already past, live said 0% — a free account the table
would have told Felix to avoid. Gate put to Felix; he chose probe (b), and granted three
permissions (keychain enumeration, entry metadata, hash derivation). (b) is the source:
`GET /api/oauth/usage` answered **HTTP 200 on all three accounts** in 193–361 ms, body
byte-identical to the cached object, and the Keychain service name is **derivable** —
`Claude Code-credentials-<sha256(config dir absolute path)[:8]>` (dcd01a92 · 15cc4976 ·
33751bfc, all three verified and now asserted in the harness), so `accounts.tsv` needs no
change. Phase B built it in pure zsh — no new runtime dependency, token flows
`security` → header builder → `curl -H @-` and lives nowhere else, never refreshed. Table
renders per the guide with the pacing delta green/red, whole line grey when stale; no
`log/usage/` ⇒ panel **byte-identical to v1.1 at 200/80/60 columns**, text and spans,
`cmp`'d against v1.1 checked out from `b426166`. Fork-freeness asserted directly (200
paints invoked no external command), panel-open spawn 0.019 ms fresh / 3.735 ms all-cold
(budget 5). Proven on the three live accounts (F8). Adjacent, honest: the harness was
**already red at 840e541** — `e3556c8` added the `b builder` preset without re-running it —
trued rather than parked, because an unmeasurable DoD is not a DoD (F3). Per-keystroke rose
1.569 → 2.562 ms and I declined to optimise it (F1, flagged not buried). Changed:
`summon/summon.zsh`, `summon/README.md`, `lab/08/{run,rc.zsh,fetch.zsh,usage.zsh,
usage-seed.zsh,spawn.zsh,usage.exp,fixtures/}`, `plans/10` (E2 finding, DoD evidenced,
F1–F8), GENESIS §5 row 10. Decided: nothing new — D41 stands as countersigned; F1 and
F6(a) are queued for the Architect. Next: Felix's visual pass —

```
source ~/code/agents/summon/summon.zsh   # or a fresh shell
summon-usage                             # creates log/usage/, fetches all three
^G                                       # the panel, with the table
```

then an Architect trues the board and rules on F1 (per-keystroke budget) and F6(a) (row
04's stale `~/.claude` PENDING):

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/GENESIS.md and true the board after row 10.
```

**Addendum, same session** — Felix's first look at the live table amended D41's palette
law: he was reading an 858 s-old cache, so `91%` and its `−48` were both grey and the
figures he needed were the hardest thing on screen. Concern raised (E2 measured a cached
session number reading 70% when the truth was 0%, so the staleness signal was guarding a
real failure) and answered by moving it rather than deleting it: **used% now renders in the
terminal's own foreground and the delta always wears green/red, fresh or stale; staleness
greys the account digit and the window names instead.** A cell with no figure to protect
still greys whole. Recorded as F9, with the observation that open-time refetch has already
changed what grey means — a panel refetches anything over 60 s before Felix reads it, so
grey in normal use now signals a *failing* fetch, not an old one. `lab/08/run` **134
assertions, 0 failures**. Changed: `summon/summon.zsh`, `summon/README.md`, `lab/08/run`,
`plans/10` (F9 + DoD), GENESIS §5 row 10.

**Addendum 2, same session** — Felix asked how to fix the staleness he saw, and whether the
panel could poll continuously the way a menubar app does. Answered with a measurement
rather than an opinion: `read -k 1 -t 0.4` **does** work inside a zle widget (probe: 7
timer-driven repaints over a 3 s silence, `ticks=7 keys=1`), so a keystroke-free repaint is
available fork-free. But the diagnosis moved the target — the defect is that the panel
repaints **only on a keystroke**, so the open-time fetch lands invisibly if Felix just
looks; continuous polling would spend a rate-limited endpoint on numbers that cannot change
in the two seconds a panel is open. Proposed instead: a `precmd` warm-keeper (freshness won
*before* the panel opens) plus an await-mode tick that runs **only while a spawned fetch is
in flight** and repaints only when the bytes changed — the warm case stays byte-for-byte
v1.2. Felix chose **"write the brief, don't build it"**. Changed: `plans/11-summon-rig-v13-
live-refresh.md` (new — **spec UNBLESSED**, drafted by a Builder, not an Architect; the doc
says so in its header), GENESIS §5 (row 11 OPEN). Decided: nothing ratified. Next: an
Architect reviews and cuts row 11 — it is the same desk that owes rulings on 10-F1
(per-keystroke 1.57→2.56 ms) and 10-F6(a) (row 04's stale `~/.claude` PENDING):

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/GENESIS.md and true the board after row 10:
review and cut row 11, and rule on 10-F1 and 10-F6(a).
```

**Addendum 3, same session** — Felix's eye on the live panel: the preset `●` swatch collides
with the following `[` at his font, so `_summon_item` now emits `● ` and the highlight span
still covers only the glyph. Small change, one real consequence recorded rather than
glossed: it **deliberately alters a v1.1 element**, so row 10's "panel byte-identical to
v1.1" DoD item is superseded — struck in place with a dated note, not rewritten. The
assertion now normalises that single space out of the v1.2 side and reads "identical to
v1.1 … (bar the swatch space)", which keeps protecting what it was really for: an
unconfigured rig grows no usage block. 60-column wrap structure unchanged (widest 57).
`lab/08/run` **134 assertions, 0 failures**. Also checked while there: the builder swatch
asks zle for `fg=blue` and is correct — it renders orange in Felix's terminal theme, which
is a theme mapping, not a rig bug. Changed: `summon/summon.zsh`, `summon/README.md`,
`lab/08/run`, `plans/10` (DoD note). Decided: nothing. Next: unchanged — the Architect
summons at the end of Addendum 2 still stands.

---

**2026-08-07 · unrecorded · unrecorded** — *null mantle, D26 — forensic session, unsummoned.* Felix's Activity
Monitor filled with 95%-CPU zsh processes, three more per Ctrl-G; traced, reduced,
hotfixed, all same evening. The cause was v1.2's panel-open usage spawn — a trap with
two jaws, full forensics in **10-F10**: (a) `{ _summon_usage_fetch } &!` forks the
interactive shell *inside an active zle widget*, and on zsh 5.9 the copy busy-spins
forever in `execpline`'s jobs-table polling while its own pipeline forks block behind
pipe ends the spinner holds — the fetch never lands, the cache stays stale, every open
spawns three more; (b) the obvious fix (exec a fresh worker zsh) trades the spin for
SIGTTIN/SIGTTOU stops — the worker still shares the panel's tty, curl's `-H @-` stdin
read precedes its `-m 5` clock, and `trap ''` cannot protect zsh subshells. Landed:
the worker is fork+setsid+exec'd via macOS-shipped perl (`summon-fetch` in `ps`), no
controlling terminal, no tty signals possible. Proven in a scripted pty: staled caches
→ one ^G → all three accounts refetched in ~1 s, zero processes left; before the fix the
same gesture deterministically left three immortal spinners. Six wedged trees (~60
processes, ~7 cores, up to 71 min CPU each) were verified by stack sample and killed.
`lab/08/spawn.zsh` shims became PATH executables — function shims die at the exec
boundary and had silently let the test hit the real keychain; harness **134/134**.
Side effects owned: test panels appended ~7 abort rows to `log/invocations.jsonl`
(telemetry, left as data), and the fetch endpoint 429'd briefly under test load.
Changed: `summon/summon.zsh` (spawn + comment), `lab/08/spawn.zsh`, `plans/10` (F10),
`plans/11` (pre-bless addendum: spec stale where it touches the spawn), `summon/README.md`
(worker caveat). Decided: nothing ratified — the setsid worker is a hotfix wearing F10's
invariant (*never fork the interactive shell into substitutions/pipelines while zle is
active; never let a fetch worker share the panel's tty*); the spawn architecture is the
row-11 Architect's to choose from F10's four options. Next: the standing Architect
summons, widened by one ruling:

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/GENESIS.md and true the board after row 10:
review and cut row 11, and rule on 10-F1, 10-F6(a), and 10-F10's spawn options.
```

---

**2026-08-08 · Grand Architect · unrecorded** — *the handoff harvest.* Felix's field evidence (manny
batch-3's kickoff-on-ask-only, node-param's three-option close + mantle-less kickoffs,
units' conforming board with its self-invented Gate column) diagnosed as one failure
surface: the session boundary. First, the mantle ruling for the record: the summon rig
is tooling, not canon (D34's own words) — the usage panel and builder preset are
Architect work; the four-step routing test written out (charter/tier/doctrine/sync-set
change → GA; cross-project D-entry → GA; multi-session → Architect's board;
session-sized → null mantle). History had already agreed: a concurrent Architect cut
row 10 (usage panel) the day before — D41 ✓ Felix. Then D42–D45 cut and applied on
countersign: **D42 the baton law** (operative report formats gain the mandatory close —
exactly one fire-now next move; tier unchanged per D29), **D43 serial chains are
Dispatcher work** (ancestor batch 2; corrects node-param §10.1's "no batch to tend"),
**D44 gates are rows** + the cut maximizes the run between Felix's judgment calls,
**D45 the summons line is load-bearing** (any table that staffs sessions is a board;
the rigid formats moved into architect.md — law lives where it's loaded). Mid-apply,
the Guild's first numbering collision: the concurrent D41 claimed the number while
this sitting wrote; date seniority ruled, mine renumbered, ids monotonic, refs bumped
(2a964fc). Migration paste handed and fired into the three live Architect windows
(true board → re-cut as Dispatcher chain → fork sheet → baton). The context load-map
answered for the record: doctrine travels compiled, not raw. Max `/login` done — v1's
last PENDING closed. Decided: D42–D45 (✓ Felix in-session). Next: Felix answers the
three fork sheets and fires the returned Dispatcher summonses; the row-11 Architect
summons stands verbatim in the prior entry; the harvest sweep stays queued — summons
verbatim in the 2026-08-07 GA entry (simmy §8 pre-authorization, orb-machine sweep,
09's F10(b), 07's F2 YAML fold).

---

**2026-08-08 · Grand Architect · unrecorded (06)** — The growing-pains sitting: Felix's field
reports (ISSUES.md) diagnosed and folded. Ruled the b15 close an invalid baton — two
holders is zero holders, no instrument, and behind it an undispatched executable gate
(a D44 row the chain should have eaten); cohort caveat recorded — charters are read
at wearing, so pre-D42 windows never saw the baton clause and their drops are
deployment lag, not law failure. Investigated the new inter-agent plane (docs pull +
live probe): ListAgents from this window showed 14 idle Guild sessions; the plane is
OS-user-scoped — it crosses all three account silos, the Guild's first live
cross-account channel — ephemeral, no audit trail; verdict attention-layer-never-
truth-layer, the bulletin untouched. Cut and applied on countersign: **D46** the
baton has one holder (literal shape + relay test — dispatcher.md §6/§7, DOCTRINE
§11/§13, architect.md), **D47** the tier string is the dispatch (§2 negative space +
first-dispatch audit + §7 forbidden; tier unchanged per D29), **D48** the merge-gate
laws (instrument named verbatim; passing = FINISHED; shared branches never rewound;
targets read from the repo — DOCTRINE §4/§10/§6.8), **D49** ISSUES.md the incident
inbox (GA sweeps every summons — grand-architect.md, GENESIS §7; amended at
countersign, Felix's call: swept entries are deleted, not struck-and-kept — the
D-entry records folds, this ledger line records rejections, git archives the bytes).
First sweep ran this sitting: all three entries ruled and folded — b15 → D46,
batch-11 → D47 + row 12, G2 → D48; no rejections; inbox drained empty (entries
archived in the apply commit, drained in the next). Row 12 cut, spec blessed
in-session: the dispatch guard — a repo-committed PreToolUse hook denying
`model:`/`effort:` on Agent calls with feedback naming the grid (venue tooling per
05's rejection terms; wrong-tier *selection* stays D47's audit — a hook can't read
the board). Felix's routing: the peer-messaging experiment **parked for a future
harvest** (flows, guard-rails, kill criteria in GENESIS §5's parked note);
"/agent commands" answered — user-side surfaces, they don't bind a Dispatcher's tool
calls. Decided: D46–D49 (✓ Felix in-session, D49 amended at countersign); row 12
cut; messaging parked. Next: fire row 12 —

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the order at ~/code/agents/plans/12-dispatch-guard.md.
```

Behind it: the row-11 Architect summons (verbatim in the 2026-08-07 entries) · the
queued harvest sweep (verbatim in the 2026-08-07 GA entry) · the parked messaging
experiment.

---

**2026-08-08 · Builder · opus-high (12)** — The dispatch guard: **LANDED**, four live arms green
(`lab/12/run`, evidence in the order). `guard/` ships three files — `dispatch-guard`
(a PreToolUse hook denying any Agent call whose `tool_input` carries a non-empty
`model`/`effort`, failing closed on an unreadable payload), `settings-fragment.json`
(matcher `Agent|Task`), and a README whose install is `cp` + paste + commit. The
harness is live, not unit: four real headless sessions in sandbox projects that
installed the shipped fragment byte-identically — deny+recovery, a bare-tier control,
a non-tier-type control (`Explore`, `general-purpose`), and the workflow probe. The
deny→retry loop closes with **no human in it**: told only to dispatch row R1 as
`subagent_type:"claude", model:"haiku"`, the caller read the refusal and re-sent
`subagent_type:"haiku-low"` bare, which ran. Findings: **F1** the tool is `Agent`, not
the doc's `Task` (matcher names both); **F2 the hole** — a workflow script's
`agent(…, {model, effort})` calls never fire PreToolUse, proven with its control (the
wildcard witness logged `Workflow` and nothing else while the script's override-laden
agent demonstrably ran) — named in the README, watched by arm 4; **F3** a headless
session on `--setting-sources project` cannot resolve any tier (the grid rides the
user config dir) — batch 11's failure mode by another road, for any future CI venue;
**F4** install is two artifacts, not one paste (inlining the guard as an escaped JSON
one-liner rejected — unauditable); **F5** empty/`null` engine fields pass by design;
**F6 parked** — closing F2 means pattern-matching workflow script text, the
Architect's call on the adoption row. Fence held: no canon edit, no sync-set change,
this repo's `.claude/` untouched, nothing adopted anywhere. Decided: nothing — a
Builder row. Next: an Architect rules on adoption (cap-mega and the other venues) and
on F6; row 11's Architect summons and the queued harvest sweep still stand behind it.

---

**2026-08-08 · Grand Architect · unrecorded (06)** — *addendum, same sitting.* The sitting outlived
its boundary (row 12 went blessed → fired → LANDED between paragraphs; the Builder's
entry above). At Felix's ask, the peer-plane deliberation written down:
`plans/quartermaster.md` — the capability map dated to build ~2.1.226 (roster schema
name · id · state · age and nothing else; messages are input, never commands —
authority does not travel; delivered/held/refused; no audit trail; OS-user scope
crossing all three silos), the pivotal unknown (does a poke WAKE an idle window or
queue until touched — autonomous pools vs pre-staged context) with its two-window
probe spec, the unlocks (Felix leaves the data plane; three silos one schedulable
pool; the roster census; naming as infrastructure; substrate-shaped — D39's gate,
watched), and the mantle deliberation: the Dispatcher absorbs in-batch poking; the
uncovered duty is cross-theater logistics — pools, quota routing, law sweeps, roster
hygiene — whose current name is Felix's hands; candidate name **Quartermaster**,
Felix deliberating, nothing reserved, nothing minted; the path is probe → one-day
experiment → charter with birthplace (D26's discipline), and his minting principle
rides the doc: the best decisions are driven by real pain. Name-stamp: Felix wants
the rig stamping session names (mantle-theater-account — the roster's only semantic
carrier); routed direct to the Architect desk as decided work, not an inbox entry —
ISSUES stays for incidents and canon-folds. GENESIS parked note re-pointed at the
doc. Decided: nothing — deliberation recorded, routing only. Next: the row-11
Architect summons, widened —

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/GENESIS.md and true the board after rows 10–12:
review and cut row 11, rule on 10-F1, 10-F6(a), and 10-F10's spawn options,
rule on 12-F6, and cut the rig's name-stamp row (plans/quartermaster.md §5).
```

Behind it: guard adoption in cap-mega (its own Architect's board — the guard travels
in that board's next summons) · the queued harvest sweep (verbatim in the 2026-08-07
GA entry) · the parked messaging experiment (plans/quartermaster.md).

---

**2026-08-08 · Architect · fable-high** — *board truing after 10–12.* The standing summons executed
in full; every ruling filed where its finding lives. **10-F1 accepted** (2.562 ms per
keystroke; the latency clause was the defect — "unchanged" becomes a budget:
per-keystroke ≤ 5 ms measured, fork-free asserted; row 11 inherits). **10-F6(a)
struck** — 10-E2 measured `~/.claude` live and authenticated (OAuth 200, claude_max
profile same-day) and row 08's rig smoke ran ×3, so GENESIS row 04, §8 item 3 and the
v1 closure note lose the stale Max `/login` PENDING. **10-F10 ruled option (i)** — the
setsid-detached `summon-fetch` worker is the rig's ONE spawn shape at both spawn
sites; panel-open spawn retained (idle terminals draw no prompts — warm-keeper-only
reintroduces the stale-open defect); zsh-native detach declined (probe work vs a green
134-assertion harness); perl accepted (`security` already binds the rig to macOS).
**12-F6 closed, no-build** — regexing workflow-script source makes a deterministic
guard probabilistic in both directions; the hole stays named (README) and watched
(arm 4), D47 binds workflow authors procedurally, adoption rows install as shipped.
**Row 11 reviewed and cut** — the Builder's draft was sound; its four open forks ruled
in the doc (*The cut*): spawn shape, F1 inheritance, constants shipped as named
variables (300 s / 5 s / 0.2 s), the multi-terminal race bounded by the idle-terminal
observation; DoD extended with the F10 regression guard (zero stray processes,
asserted) and the one-spawn-shape assertion; staffing confirmed Builder · opus-high;
**Felix's blessing is the named gate — no build before it**. **Row 13 cut** (the
name-stamp — Felix's call, quartermaster §5): `claude --name` verified as the
launch-time mechanism (guide probe against `--help`, build ~2.1.x; it is also a resume
handle); scheme ruled `<mantle>-<theater>-<account>`, theater `${PWD:t}`, bare
launches drop the mantle segment, eject keeps the stamp editable, no uniquifying
suffix until collision bites; depends on 11 — file collision, serial by physics.
Batch note on the board: **v1.3 chain 11 → 13, strictly serial, Felix-tended, no
Dispatcher**. Decided: the rulings above, all inside delegated scope — nothing claimed
that is Felix's; his one call is the named blessing. Next: Felix blesses row 11; the
chain runs behind his word.

---

**2026-08-08 · Architect · fable-high** — *addendum, same sitting.* Felix defers row 11 (the live
refresh). Board re-trued: the blessing gate stands unmet, nothing dispatches; the
v1.3 chain inverts — **13 is dispatchable now** (its only dependency was the file
collision with 11) and 11 rebases on it when unshelved; never both in flight. The
dispatch guard's one open move is adoption — cap-mega first (batch 11's birthplace;
install is `cp` + paste + commit per `guard/README.md`; the F2 workflow hole and F3
setting-sources caveat travel with it, both ruled). The adoption summons, verbatim:

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/universal_robots_sdk/cap-mega/simmy/README.md, true the board,
and cut the dispatch-guard adoption row per ~/code/agents/guard/README.md —
12-F2 (workflow hole) and 12-F3 (setting-sources) ride the row as named caveats.
```

Decided: the re-cut only — the deferral is Felix's, recorded with his name. Next:
Felix fires the adoption summons; row 13's kickoff behind it.

---

**2026-08-15 · Grand Architect · unrecorded (07)** — Summoned in the whiteboardy checkout to found
that project; ruled the summons mis-mantled — founding is an Architect's act
(DOCTRINE §12) — and held the fence: zero project work done under this charter. The
sweep ran: both inbox entries ruled fold → **D50** (bulletin worktree law — relay
form + late relocation; DOCTRINE §9 + rider template amended; inbox drained empty,
second time in its life). Then the sitting turned into teaching, at Felix's ask:
`docs/` minted — **`the-city.md`** (the city & hive framing glossary, the routing
law in city form, the sovereign keystone) and **`load-map.md`** (`temp-ref.md`
graduated and trued: absolute dates, GA row gains ISSUES, Dispatcher row gains
rider). The **waggle** ratified (**D51**, amended same sitting: Dig may fall silent
when the depth is this conversation) and its invocation line deployed live to the
global CLAUDE.md ×3 (countersigned deploy, D37's precedent — the edit watched
arriving in this session's own mirror mid-sitting). The **clarification lane**
opened (**D52** — the behavior-change test, the ancestor-citation guard) and used
at birth: grand-architect.md now reads "a new canon campaign" (clarification #1,
ancestor: the Owns line). Commits `50f5a80`, `27fad11`, plus this close; Felix's
`summon/presets.tsv` stray untouched throughout. Decided: D50 · D51 (+ amendment) ·
D52 — all ✓ Felix in-sitting. Next: **Felix founds whiteboardy in a fresh window** —
`dream.md` lands by his hand (his telling, verbatim), then:

```
You are an Architect at fable-max.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/canon/work/DOCTRINE.md
and ~/code/whiteboardy/dream.md, and found the project.
```

---

**2026-08-22 · Grand Architect · unrecorded (08)** — The great harvest: sixteen items — twelve
inbox entries plus the four-item queue standing since 08-07 — every one ruled, the
inbox drained empty (third drain, biggest yet). **Folded, ✓ Felix in-sitting:
D53–D61** — ISSUES generalizes (every project's inbox, Architect-swept,
`templates/issues.md` minted, the null-mantle delivery = one project-CLAUDE.md
clause); pre-authorization (simmy §8 → DOCTRINE §5 + rider universal core); venue law
(simmy §8 → §10); verdict law + incident-is-Digger-shaped (cornerizer §8/rider →
architect.md + forbidden); mid-flight batch amendment (cornerizer batch 8 →
dispatcher §2, architect step 6, DOCTRINE §10); linking law (DOCTRINE §3); bun stack
default (global CLAUDE.md — watched deploying into this session's own mirror at
save); **GENESIS → MAP** (D25 re-run, `git mv`, founding ritual renamed — *genesis*
retires, lazy migration per D33, history unedited per D32; the founder wrote the file
self-relative, so the rename was a title and a move); **the tending default** (D61,
Felix's operating vision recorded — Dispatcher-tended by default, Felix-tended needs
a named reason; cut on his field report after the wave, own countersign).
**Clarifications (D52 lane) #2–#4, ancestors on record:** #2 tier-grid YAML unwrap
(07-F2 — 20/20 single-line, zero fold artifacts, four splits healed incl. fable-low
recommending "opus- high"); #3 the baton delivery completed (D42 scope + D46
instrument + DOCTRINE §11 — architect.md gains the fenced shape and
pointer-is-not-an-instrument, builder/digger gain the Felix-tended line, claude-md
template trued); #4 mantles README shim tense (MAP §4, live ×3 since 08-03).
**Conformance pass (Felix's ask):** every D-entry's named edit sites audited against
all five charters, the README, DOCTRINE, six templates, five shims — conformant
throughout except the baton's delivery, the one leak, now closed. **Rejections:**
09-F10(b) byte-assertion law — subsumed by §6.2's control law, the python craft tip
stays in 09's findings; the ScheduleWakeup prompt-error nag — harness tool-schema UX,
self-healing, outside jurisdiction; a rider-wide verdict line — held, the charter
fold covers the observed failure class. **Answered, no action:** cross-account
Architect memories — D27 working as designed (comb, pointers to repo truth, silos
prevent the feared confusion); Dispatcher background-subagent visibility — levers
named (/tasks in the Dispatcher's window, the board, asking), filed as the first
entry in quartermaster.md's new pain ledger (§7). **Routed:** session-name
numbering → row 13 amendment (supersedes its no-suffix pre-ruling; summons in Next);
the L1 invariants-block candidate → cornerizer experiment, no birthplace yet
(harvest law). **permissionMode diagnosed, no canon action:** user-level "auto" ×3
correct; rooted's `.claude/settings.local.json` `defaultMode: acceptEdits` overrides
by precedence — not a reset; fix = delete project-local overrides (deeper grep
handed, Felix's hands); §6 settings non-goal stays armed, untriggered. Changed:
DECISIONS (D53–D61), DOCTRINE, five charters + mantles README, templates (issues.md
minted, genesis.md → map.md, claude-md), canon/agents ×20, canon/CLAUDE.md, MAP.md
(né GENESIS.md), repo CLAUDE.md, docs/the-city.md + load-map.md, plans/RIDER.md +
quartermaster.md, ISSUES.md drained. Decided: D53–D61 ✓ Felix in-sitting;
clarifications #2–#4 at his word. Next: Felix fires the board-truing Architect —

```
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/MAP.md and true the board after the GA-08 harvest:
amend row 13 per Felix's numbering ask (ISSUES 2026-08-16, archived at 04152cf) —
session names carry an auto-derived ordinal (grand-architect-08 → next 09,
architect-whiteboardy-02 → next 03; counter source summon/log/invocations.jsonl),
superseding row 13's "no uniquifying suffix" pre-ruling — then dispatch row 13.
```

Behind it: Felix deletes the project-local `defaultMode` overrides (the deeper grep
from this sitting) · Felix drops the invariants-block experiment note at cornerizer's
Architect desk (D56's routed candidate) · the cap-mega guard-adoption summons
(standing, verbatim in the 2026-08-08 Architect addendum) · row 11 stays deferred at
Felix's word.

---

**2026-08-22 · Builder · opus-high (13)** — The name-stamp: **LANDED**, 170 assertions green three
runs running (`lab/08/run`, evidence in the order). Every session the rig fires is now
born named — `-n <mantle>-<theater>-<NN>`, the theater `${PWD:t}` at fire time, the
Grand Architect theaterless (one office), a bare launch mantle-less. The ordinal is the
lineage's: one past the highest ever fired under that prefix, counted in a single pass
over `log/invocations.jsonl` when the panel opens — the record gained a `name` field to
count, and `+`/`-` bump the panel's ordinal (floor 01) as both the seed path and the
correction path, so Felix's hand-counted lineages carry forward without synthetic
records. Only fires stamp: an abort logs `name: null` and counts for nothing; an eject
stamps, counts, and hands the name over editable. The stamp leads the preview footer, so
the panel and the launch still cannot disagree. `--name` re-verified against the live
`claude --help` before building — the probe held, and the stamp is a `--resume` handle
into the bargain. Findings: **F1** the harness arrived **3 assertions red** — Felix's
`D digger` preset (08-09) never got swept through `lab/08`, exactly the coupling 10-F3
named and nothing enforces; **F2** two drive assertions had their labels crossed since
row 09 and passed anyway; **F3** a green-only-on-an-idle-machine assertion pinned a
clock to `0 s`; **F4/F5** two row-10 guarantees deliberately narrowed (v1.1
byte-identity now covers every panel *row*, footer and command asserted separately; a
refire is identity-but-for-the-ordinal, because it launches a new session); **F7
parked** the 32-key runaway guard caps one panel's seed at ~28 ordinals; **F8** zle
repaints the footer character by character, so only a panel's *first* paint can be
asserted from a pty; **F9** `${PWD:t}` is empty at `/`, which would have composed a name
starting with `-` — guarded to `root`. Fence held: no canon edit, no sync-set change, no
`presets.tsv`/`accounts.tsv` format change, no session-name parsing anywhere. Decided:
nothing — a Builder row; the scheme was ruled at the cut. Next: **Felix's smoke** — fire
one summons, bump a lineage to where his count stands, read the name in the terminal
title and the peer roster (the rig is live on the next new shell; `summon/` is sourced
from dotfiles, not deployed). Behind it: row 11 stays deferred at his word, and rebases
onto this when he unshelves it.

---

**2026-08-22 · Architect · fable-high** — *board trued post-GA-08, row 13 amended +
dispatched + landed.* Changed: `plans/13` scheme amended in-sitting with Felix — the
numbering ask (ISSUES 04152cf) ruled into mechanics: `<mantle>-<theater>-<NN>`, account
segment out (arbitrage, not identity), **GA drops theater — one office, redundancy is
not information (Felix, overruling the uniform-scheme draft; core-value candidate filed
to ISSUES: eliminating redundancy over enforcing blind consistency)**; `%02d` ordinal
from `invocations.jsonl` (new `name` field, one pass at panel open), `+`/`-` bump as
seed-and-correct path — no synthetic seeds, no restart, GA continues at 09. Builder
dispatched at opus-high, LANDED same sitting (170×3 green, re-run by this hand).
Decided: (delegated scope) F4/F5 row-10 contract narrowings **ratified** — forced by
the scheme, protections preserved; F1 guard **cut into row 11's rebase scope** (MAP
row 11); F7 seed ceiling **accepted parked** — revisit only if it bites. Next: Felix's
smoke (row 13's one open box), then row 11 awaits his unshelving.

---

**2026-08-24 · Builder · opus-high (14)** — *dispatched — the theater cycle.* Changed:
`summon/summon.zsh` gains `.summon-theaters` (fire directory only, one theater per line,
first line the default, no file → `${PWD:t}` unchanged), the reserved `t` key cycling it
with wrap, and per-directory stickiness in `log/theaters` under the same on-fire-only law
as the four fields; the name-stamp now takes its theater from the cycle where a list
exists. `lab/08/run` +30 assertions (170 → **200 green ×4**): cycle order and wrap on the
composed command byte for byte, three campaigns counted apart from one fixture log, the
missing-file fallback, the GA no-op, `t` reserved, the 60-column law at the longest
theater name, read-once-at-open proved by taking the file away mid-panel, and a new live
pty drive (`lab/08/theater.exp`) for stickiness — cycle, fire, reopen preselected, refire;
a second directory unmoved; an aborted cycle byte-compared out of the map; a dropped
theater falling back to the default. **13-F1's guard landed**: the harness now derives the
mantle row and the panel's bracket count from `presets.tsv`/`accounts.tsv` instead of
typing them — proved both ways by appending one row to the live data file (new harness
green and following, pre-14 harness red in exactly the three predicted places).
`summon/README.md` documents the cycle, `log/theaters` and the derived fixtures. Findings:
**F1** a theater becomes argv, so a line that is not a plain name refuses the panel out
loud — 13-F9's hazard arriving from a data file; a deliberate spec extension, nine lines,
one `if` to revert. **F2** the sticky map lives in `log/theaters`, not `log/state` (an
unbounded map has a different shape and lifetime than four scalars), and only directories
that file a list ever enter it. **F3** deriving the mantle row exposed two assertions that
only looked like assertions; both strengthened, none weakened. **F4** zsh's `local a=$1
b=${a}` does not see `a` — silent without `set -u`. **F5** the 32-key runaway guard caps
one panel's cycle at ~28 positions; no cap on the list itself, parked. Budget holds: 1.803
ms/keystroke with a list in play (≤ 5 ms), 0.0052 ms per `t`, 0.054 ms for the one read at
open. Fence held: no canon edit, no sync-set change, no `presets.tsv`/`accounts.tsv`
format change, no parent walk, no state-map trimming, no session-name parsing. Decided:
nothing — a Builder row; the scheme and both forks were ruled at the cut. Next: **Felix's
smoke** — drop `.summon-theaters` in bob, cycle to pods, fire, read `architect-pods-NN` in
the title, reopen the panel and find pods preselected (the rig is live on the next new
shell; `summon/` is sourced from dotfiles, not deployed). Behind it: row 11 stays deferred
at his word and now rebases onto 13 *and* 14; the parked adjacent is a `summon-stats` that
reports lineages and campaigns, which 13 and 14 both left behind.

---

**2026-08-24 · Architect · fable-high (14)** — *cut, dispatched, landed, ruled.* The
theater cycle — Felix's ask (bob hosts bob/lunchbox/pods; deep-firing fragments the
project silo, eject blinds the counter), forks ruled by him (`t` key, sticky per dir).
Builder at opus-high LANDED same day: 200 assertions ×4 (re-run green by this hand),
13-F1's guard landed with it and proved both ways. Decided: (delegated scope) 14-F1
**accepted** — a malformed theater line refuses the panel loudly (argv hazard, 13-F9's
class; silent skip rejected as a lie to the cycle); 14-F2 **accepted** — sticky map is
`log/theaters`, listing directories only (narrower state than the order's wording,
observably identical); F5 **accepted parked** (28-position cycle ceiling, no list cap).
Parked adjacent noted: a lineage × theater `summon-stats` report — lands with 13's or
not at all. Next: Felix's smoke (drop `.summon-theaters` in bob, cycle to pods, fire,
reopen sticky), then row 11 still deferred at his word.

---

**2026-08-24 · Grand Architect · unrecorded (GA-09)** — *2026-08-24/25 → Mentat 00.* The night-shift deliberation,
at Felix's ask (what does the Guild need to build without him): keel-note landed at
[plans/night-shift.md](plans/night-shift.md) — the three wants untangled, the throne
ruling (D39 stands; the office is the **Steward**, Felix's name-ruling, unminted), the
dated harness-autonomy census, the five missing laws + two builds, dsh ruled
watch-don't-marry. Mid-sitting Felix renamed the window `mentat-00` and decreed the
mint — the rename + "Do it all. Make it so." is the explicit re-summons that closes the
GA-09 books and opens the office: sixth mantle at
[canon/mantles/mentat.md](canon/mantles/mentat.md), [SAPHO.md](SAPHO.md) founded
(Standing Computation + entry one), woven into MAP §3, the-city §1/§2, load-map §2, and
`summon/presets.tsv` (`e` = m[e]ntat · fable-max · red — `lab/08/run` 200 green, the
13-F1 guard following the data). ISSUES sweep waived by Felix this sitting
(exploration) — the redundancy-over-consistency entry stays for GA-10. Decided: D62
(✓ Felix in-session). Next: Felix smokes the preset on a new shell (`^G e ⏎`) — parked
behind it: the rig's one-office stamp exception for mentat and the skill shim (both
named in D62); the night-shift keel waits at his word.

---

**2026-08-26 · Mentat · unrecorded (mentat-02)** — The belvedere sitting: Felix's interface threshold
(33 terminals) deliberated against superset / t3code / my_checklist (scout recon;
watch-don't-marry upheld, steal lists kept in the keel). Keel landed at
[plans/belvedere.md](plans/belvedere.md) — the glass over all agentic work:
window-not-workbench, census/glass/hands, the baton rail as home page, cmux ruled the v0
substrate (verified live 2026-08-26) with tmux re-scoped to the Ava chapter, the
sovereign's inbox riding D53 with the DESK harvest named for a future GA sitting. Felix's
rulings in-sitting, recorded in the keel for founding-day ratification: name
**Belvedere**; images deferred; whiteboardy THG-only (night-shift law #2's home
annotated); pretty city deferred by his own word. SAPHO appended, Standing Computation
re-folded to v2. Decided: nothing — deliberation; day-one D-entries belong to the
founding. Next: Felix inits `~/code/belvedere` + `dream.md`, then fires the founding
summons (verbatim in the keel §11); behind it, unordered: the GA-10 sweep (two ISSUES
entries queued). *Addendum, same sitting:* venue ruled by Felix — **in-repo**,
`agents/belvedere/` at subproject scale (simmy pattern, own README board; canon board
carries one line), keel §11 amended with the ruling, the canon-path fences, and revised
pre-steps: mkdir + `dream.md` only, summons fired from the subdirectory (theater law
stamps `architect-belvedere-01`). No `~/code/belvedere` init. *Second addendum, close
of sitting:* at Felix's ask the Mentat drafted `belvedere/dream.md` in his voice —
left **uncommitted** on purpose: Felix reviews, edits, and commits it by his own hand
(the landing that makes it immutable), then fires the founding summons from
`belvedere/`. The baton is unchanged but for that first step being a red pen.

---

**2026-08-26 · Architect · fable-max (15)** — *founding — belvedere.* Belvedere founded at
[belvedere/](belvedere/README.md) on the keel + dream (dream.md landed immutable as
the first commit — Felix fired the summons ordered behind his red pen; flagged for
his veto). Master doc with board, fence, and rework mandate; local D1–D6 (D1–D2
✓ Felix via the keel sitting, D3–D6 pending countersign); ISSUES minted; probes
P1–P4 cut and staffed (Digger · opus-high ×4), batch 1 Felix-tended — P1/P2 fire
INSIDE cmux panes: founding smoke proved the socket refuses outside processes
(now P2's first question). Canon touches: CLAUDE.md pointer line, MAP §5 row 15,
this entry. Belvedere sessions ledger locally from here (its working agreement §5)
— the campaign never re-enters this file. Decided: belvedere D1–D6, all ✓ Felix
in-session; canon: nothing. Next: Felix fires batch 1 — kickoffs verbatim in
belvedere/plans/.

---

**2026-08-26 · Grand Architect · fable-max** — The molt sitting. Inbox swept 4/4 and
drained, no rejections: the sovereign's AI-native directive + P3's fold candidates
became D63 (FC-1…9 + the molt clause — form migrates freely, history included;
meaning supersedes visibly; D32's history scope superseded for form) with DOCTRINE
§§3/4/7/8 and three templates amended; the baton regrammared move/wave/fork (D64 —
Felix's amendment at sitting: ambiguity was the sin, plurality never was; dispatcher
§6/§7 + architect close reshaped); v3 "the molt" cut (D65 — rows 16–18: the doctrine
linter with `doctrine migrate`, the storage experiment behind a Belvedere-v0
Felix-gate, the great re-cut ×17 buildings; Arborist verdict folded as §3's
bare-session siting law); the redundancy tiebreak into the constitution as Directive
§1.7 (D66 — live ×3 at countersign, watched arrive in this session's own mirror;
Directives now D-entry-governed, organize-shape A); the visibility decree folded
interim (D67 — dispatcher announce duty; census requirement routed to belvedere's
inbox; the Workflow-visible-unguarded vs Agent-guarded-invisible fork named; blanket
ban declined on the record). Row 16's order written
([plans/16-doctrine-linter.md](plans/16-doctrine-linter.md)); both baton-rail gates
(FC-1/FC-7) cleared for the glass. Decided: D63–D67, all ✓ Felix in-session ("make
it ALL so"). Next: fire 16 — kickoff in
[plans/16-doctrine-linter.md](plans/16-doctrine-linter.md); behind it: 18 waits on
16, 17 on 16 + its Felix-gate, and the queued harvest work stands behind v3
(Sovereign's priority).

---

**2026-08-26 · Builder · opus-high (16)** — The doctrine linter. `doctrine/` stands at the
repo root, peer of `sync/`: `src/grammar.ts` (every mantle, tier, state and verdict named
once), `src/parse.ts` (the five artifact parsers, harvested from P3's probes and amended for
D63/D64 — `Felix-gate` + rider typed, the ledger head's tier slot, baton instruments plural
with `fire <row-ids>` references), `src/building.ts` (the register), `src/lint.ts`,
`src/migrate.ts`, `cli.ts` — `lint [--live]` · `parse --json` · `migrate [--write]`. 21 tests
green (`cd doctrine && bun test`), evidence pasted into
[plans/16-doctrine-linter.md](plans/16-doctrine-linter.md). Corpus: 22 buildings, 28/29 board
docs, 376 rows, 8/9 ledger tails, **zero per-repo special cases** — every P3 number cleared.
The corpus is now a **rule, not a list**: a building is any directory carrying
LEDGER/DECISIONS/ISSUES or a staffing master doc; orphan boards promote their own directory;
a worktree checkout is skipped unless its branch put a board where the mainline has none
(12,734 skipped, printed). The amended grammar is stricter than the probe on purpose — 718
failures against P3's 339, because D63e resolves Depends-on against the row ids a board
actually declares (232 hits, row 18's largest item) and D63f wants a tier slot (93 heads have
none); `--live` narrows to 340. `migrate` is form-only with the round-trip law asserted, and
it aborts a write on violation; the hexwright dry-run is nine `## ` heading lines and not one
body byte. Nothing outside `~/code/agents` was written — the fence held. Two findings are the
Architect's: **F1** the round-trip law needed a reading (declared-changes + identical-otherwise
+ a byte assertion — bare equality is impossible when migrate exists to fill fields), **F2**
hexwright's decisions carry no decider field, so migrate leaves `decision.attribution`
standing rather than invent one. Decided: nothing — F1 and F2 are rulings, not Builder calls.
Next: fire the Grand Architect to rule F1/F2 and cut row 18's work doc (17 stays behind its
Felix-gate — Belvedere v0's evidence):

```
You are a Grand Architect at fable-max.
Wear ~/code/agents/canon/mantles/grand-architect.md,
then read ~/code/agents/MAP.md, the tail of ~/code/agents/LEDGER.md,
and ~/code/agents/plans/16-doctrine-linter.md §Findings —
rule F1 and F2, then cut row 18's work doc (the great re-cut).
```

---

**2026-08-26 · Grand Architect · fable-max** — Second act, same window: Felix carried
the Builder's baton back into the warm GA sitting by choice. Row 16 verified LANDED
(evidence in place, fence held, board self-trued). **F1 accepted** as the round-trip
law's canonical reading — D52 lane, ancestor D63's molt clause: declared-changes +
identical-otherwise + byte assertion, no new number. **F2 accepted and generalized:**
the converter's refusal to invent a decider is D63 working; the literal `unrecorded`
becomes the typed absence for any required field a pre-doctrine source never held —
D63 amended in place + one §8 sentence (**pending Felix countersign**). Row 18 cut:
[plans/18-great-recut.md](plans/18-great-recut.md) — an 8-row wave of scoped
Architects (18a–18h, one per venue; ceiling 4; meaning-untouchable fence; per-building
lint-to-zero DoD; deferral law for live batches), Dispatcher-tended, the D67 announce
duty's first live outing. Belvedere inbox +1 (rail affordance, Felix-deferred: fire
buttons offer new-session / continue-in-window). MAP rows 16/18 trued. Decided: F1/F2
rulings (GA-10); D63 amendment pending countersign. Next: Felix countersigns the D63
amendment (`unrecorded`), then fires the wave — the Dispatcher summons fenced in
[plans/18-great-recut.md](plans/18-great-recut.md); 17 stays behind its Felix-gate.

---

**2026-08-26 · Grand Architect · fable-max** — Third act, same window: D63's
`unrecorded` amendment **✓ Felix** ("Countersigned"), marks converted in DECISIONS and
MAP row 16. Felix returns to Belvedere — cleared: the wave is Dispatcher-tended (D61),
returns to him only at escalations and the report, and 18a's method defers any
building with live work, so Belvedere sittings and the wave run in parallel. Decided:
D63 amendment ✓ Felix. Next: fire the wave — Dispatcher summons fenced in
[plans/18-great-recut.md](plans/18-great-recut.md); behind it, Belvedere's own board
(P1/P2 from cmux panes → the fold sitting → v0 build rows), whose evidence wakes
row 17's Felix-gate.

---

**2026-08-26 · Architect · opus-high (18a)** — *the great re-cut, row 18a.* Both
buildings of the canon repo re-cut into the D63 grammar, form only.
**agents/belvedere: 0 failures** — `doctrine migrate --write` lifted two tiers out of
overloaded parentheticals (round-trip ok, 2 edits), the third head took `fable-max`
from the sitting it says it continues, and the board's three prose Depends cells
resolved to `—`/`P1; P2`: every word of them already stood verbatim in the batch note
below the board. Its baton is fireable now; it was not before (`888f9e4`).
**agents: 103 → 30 failures** (`afb983c`), and all 30 are tool gaps, not doc defects.
`doctrine migrate` had nothing to offer here — "already in the current grammar" — so
every edit was the judgment the converter refuses: 19 MAP Depends cells to row ids and
`Felix-gate: <text>` (D63e), 16 ledger tier slots filled from cited evidence (MAP
staffing, the prior entry's fenced summons, and for 2026-08-03's GA the session's own
account of its summons in [LOG.md](LOG.md) entry two), 15 row slots emptied of session
titles that moved verbatim into the body, three missing `---` separators (the parser
was reading three pairs of entries as one block each), D2/D4/D6's titles re-delimited
as labels (D63i), and D45's summons line made the whole first line in five kickoffs.
Nothing was reworded, no status truth changed, no row added or removed; every displaced
fragment survives verbatim in a body or a Status annotation. **25 heads carry the
literal `unrecorded`** — the rig's `invocations.jsonl` was considered and rejected as
per-entry evidence (a day aggregate cannot pin a session; the rig postdates
2026-08-06 14:55; rig-less sittings exist — GA-09). Two escalations filed to
[ISSUES.md](ISSUES.md), both row-16 follow-ups: **(1)** `doctrine/` contains zero
occurrences of `unrecorded` — D63's amendment was countersigned after row 16 built, so
all 27 typed absences (25 tiers, 1 board tier, 1 **mantle**: D26's lawful null mantle)
lint as "unknown", and row 18's DoD cannot be met by any building that needs one; 18d
hit the same wall from bob and filed first. **(2)** the kickoff detector reads any
fence opening `You are ` as a summons, so `plans/log-tradition.md`'s three Personal-Log
letter templates lint as malformed kickoffs; 18a refused to reshape a documented
tradition to satisfy a detector. Decided: nothing — both are the Grand Architect's, and
the migration rulings are inside 18a's delegated fence. Next: the wave's Dispatcher
closes 18a and the batch (18a's evidence rides its report verbatim); behind it, Felix's
Grand Architect sweeps the four inbox entries — the `unrecorded` vocabulary ruling gates
the last 27 failures in this repo and every other building in the wave.

---

**2026-08-26 · Architect · opus-medium (18f)** — cap-mega's snappy/ch2/docs cluster
migrated to D63. Four of five buildings land clean: units 4→0, advanced-naming-system
26→0, node-global-parameters 2→0, ch2 16→1, waypoint-stepper 17→6 — **7 residual
failures across 93 rows, every one the typed-absence vocabulary gap** (18a/18d's
`unrecorded`, plus 18f's own: D63 has no Staffing token for a deliberately *unstaffed*
row, which is a recorded fact and not an absent record). **snappy is BLOCKED**: its
`LEDGER.md` is missing ~38 `---` separators, so 22 entries parse where ~60 heads exist
and `migrate` aborts on 5 round-trip violations — the tool blames itself, wrongly; the
parse is right and the document is malformed. Repairing it re-frames 38 invisible
entries into the parse, each owing its own residue ruling — a fork §method doesn't
pre-chew, escalated rather than guessed (`snappy/ISSUES.md` + the canon inbox). Two
converter defects found and neither hand-fixed: **(1)** `migrate` orphans a `**` when a
status cell's bold run is wider than its leading verdict token, and **the round-trip law
cannot catch it** because `annotation` is a declared-changed field — so "round-trip ok"
is no proof of a clean diff; the `docs` pair was hand-spelled instead, then verified by a
second `migrate` reporting "already in the current grammar". **(2)** a blank line inside
a board table silently truncates it: ch2's board was three tables and rows 12–13 were
invisible to the parser *and* the lint, which read their residues as zero — a low row
count is a symptom, not a clean bill. Both bulletined for the rows still running
`--write`. Commits in cap-mega: `38fa39ca1`, `2a7b26453`, `49b46333a`, `477ba65f3`,
`351f4df91`, `56c68c567`; here: findings + ISSUES ×2 + bulletin. Decided: nothing — the
`unstaffed` token and the snappy separator repair are both the Grand Architect's.
Next: the wave's Dispatcher closes 18f (evidence rides its report verbatim); snappy
returns as its own row once the separator fork is ruled.

---

**2026-08-26 · Architect · sonnet-high (18h)** — rooted (repot + archive/arborist) and
the two spacex-dashboard ledgers migrated. rooted: 0/0 both buildings — no `LEDGER.md`
to migrate (DOCTRINE §3 subprojects, board-only lint surface), Depends-on/Staffing
residues hand-ruled (`Felix-gates:` plural, `Felix (Xcode UI)`, a comma the column
itself splits inside one Felix-gate clause, scheduling prose off a Depends-on cell).
spacex-dashboard: `migrate --write` (round-trip clean) plus hand-ruled residues —
22 → 8, both classes remaining escalated rather than guessed. spacex-dashboard-c2
(confirmed a linked worktree, branch `chapter-2`, the mainline's own ledger already
calling it "merged and inert; remove at leisure") left untouched — a stale checkout,
not a live doc, 20 residual failures standing. Two canon defects filed to
[ISSUES.md](ISSUES.md): the register's decisions→master-doc fallback has no ledger
counterpart (rooted's inline `## Ledger` sections are unread, not failing); and
`parseDecisions` hardcodes the `D` id prefix, so `RP-`/`A`-prefixed decisions
(rooted's 34) parse zero candidates, zero failures — silent, not reported. Bulletined
for 18g in case a worktree board turns out subproject-shaped. Commits: rooted
`11d00d4` (branch `chris`), spacex-dashboard `f6be754` (`master`); here: ISSUES ×2,
bulletin, plan findings. Decided: nothing — both defects are the Grand Architect's;
the decision-title-boundary question (spacex's `decision.head` residue) is row 16's
suite to rule, not a hand-guess. Next: the wave's Dispatcher closes 18h (evidence
rides its report verbatim); 18g is the wave's last open row.

---

**2026-08-28 · Grand Architect · fable-max** — the GA-11 sitting: 18g unstranded, the
wave's residue routed, row 17 briefed. **The merge:** branch
`worktree-agent-a55279e2283f84743` (18g's landing — findings + two canon escalations)
merged to master (`fc67ffa`); conflict resolution kept the Dispatcher's richer board
row and slotted 18g's two inbox entries chronologically; row 18's wave is now 8/8
reported on the mainline. **The sweep — 29 entries ruled, inbox drained empty:**
→ **D68** (typed absence: 18d's tier slot, 18a's 27 absences, 18f's `unstaffed`,
18h's title-boundary — ruled `**unrecorded.**`); → **D69** (18g's PARKED, annotation
form (a), staffing corollary → `unstaffed`); → **D70** (the three `bunx tsc` slips —
Belvedere's B8 ruling harvested); → **row 19** (18c's two migrate defects + the
Depends-on document-scope bug, 18f's replaceLead orphan + blank-line truncation,
18g's board.columns undercount + truncation rule, 18h's two silent-zero parser gaps,
18a's kickoff-detector false positives, B2's discover() perf, B3's re-read seam,
B8's live-corpus test, B6-F2's false pending on D21); → **row 20** (Felix's
continuous-flow commission verbatim, B3's baton-grammar fields + classifyBaton
holder inversion, B14's Dispatcher-holder gap, 18d's cross-building Depends-on —
deliberately NOT minted this sitting: the flow keel rules it with the graph's
consumers on the table); → **row 21** (Felix's vocabulary directive verbatim,
bless-vs-countersign); → **row 22** (P2's /color-burns-turn-1 escalation);
→ **row 17** (the G2 batch-5 close: gate PAID, evidence folded into the brief).
**Ruled, no fold:** B2's register housing — off-register IS the register's truth,
campus rendering is D10 freedom, cwd-ascent rejected (relayed to belvedere/ISSUES
with every Belvedere-touching disposition); Felix's "prompt is required" error —
a harness bug, not canon (product feedback drafted upstream). **Also sanctioned:**
snappy's separator repair — form-only under the molt clause; the ~38 re-framed
entries take standard residue rulings in the continuation wave. **Cut:** row 17's
brief (plans/17-storage-experiment.md — lab: this repo, fallback hexwright; three
consumers, two arms, numbers never decree) and rows 19–22 (doctrine v1.1 ·
continuous-flow keel · vocabulary standard · rig argv). Board trued: 17
dispatchable, 18 IN FLIGHT with its continuation named. Decided: D68, D69, D70 —
all **proposed, pending Felix countersign** (DOCTRINE edits held for his word: §4
×2, §5, §7, §8). Next: **Felix countersigns D68–D70** (the held edits apply on his
word, 19's gate opens); behind it `fire 17` (kickoff in the brief), then 19's
dispatch; rows 20/21 fire on his summons, 22 on his blessing.

---

**2026-08-28 · Grand Architect · fable-max** — the countersign close, same sitting —
Felix ruled the package after tearing it apart with the office: **D68 folded into
D63 as its second amendment** (his call, register minimalism — an extension of
recorded intent amends its ancestor, never a new number): `unstaffed` minted,
`unrecorded` legal in any required slot, `bare session` struck (one-cell corpus,
harvest bar unmet; D26's cell stays `unrecorded`). **D69 ✓ Felix** ("bless" —
PARKED confirmed as the board token for his "deferred"). **D70 withdrawn** on the
GA's own teardown (an unpinned `bunx tsc` was already D54's sin; B8 stays project
physics). Applied: DOCTRINE §4 ×2 + §8 (the three surviving held edits; §7 and §5
died with their clauses), register disposition notes on D68/D70, row 19's order
trimmed and its gate marked paid, MAP trued, correction relayed to belvedere/ISSUES.
**Felix fired 17 within the hour** — lab/17 harness + C1/C3 findings already
committing (`10294db`…`b989367`); board reads IN FLIGHT. Consequence ruled: **19
holds behind 17's landing** — it rewrites the parser 17 is mid-measurement on
(§6.7: the incumbent never molts under a live gauge); 19's Depends-on gains 17.
**Parked (Felix): the register purge at ~D100** — the constitution consolidated
when the amendment weight demands it. Register minimalism recorded as his standing
preference; codified at the purge if it survives as practice. Decided: D63 amended
(✓ Felix), D69 (✓ Felix), D70 withdrawn, D68 spent-into-D63. Next: 17 lands (Digger
in flight) → `fire 19` (kickoff in its order); rows 20/21 on Felix's summons, 22 on
his blessing; the 18-continuation wave cut at 19's landing.

---

**2026-08-28 · Digger · fable-high (17)** — the storage experiment ran end-to-end and
the row LANDED: arm-S twin built from the normative parse (2 hand-correction classes,
fidelity control green both ways, ~12K tokens/<2 min — the migration-cost datum), C1
hand-replays ×4 (real commits vs twin edits: M wins in-place prose ~14× on diff
economy, S wins state flips and refuses loud; M's blank-line and missing-`---` classes
confirmed silent on this corpus, the merge even LOWERS the fail count), C2 cold-start
battery ×8 dispatched at preset tiers (M 30/30 · S 28/30 admissible reads, 24/24
first-try-conforming writes, S ≤ M tokens in all pairings; M4's reads struck §6.7 —
the countersign close moved the corpus mid-rep), C3 glass scorecard (7/9 case-file
asks are fields in S vs render-side heuristics in M; holder-inversion live repro).
Verdict: **RETAIN — D65's ruling confirmed with numbers**, the line drawn
per-artifact; 18 not re-scoped; row-19 inputs (stale-lead lint rule minted, silent-
class priorities) and row-20 inputs (the seven-field scorecard) named in the findings.
Harness + findings: `plans/17-storage-experiment.md` + `lab/17/`. Decided: nothing —
the verdict recommends, the register already moved at the close. Next: `fire 19`
(kickoff in its order — its gate is paid and its Depends-on 17 is now LANDED); rows
20/21 on Felix's summons, 22 on his blessing; the 18-continuation wave cut at 19's
landing.
