# Ledger

Append per session: date · mantle · changed · decided · next.

---

**2026-08-02 · Grand Architect** — Laid the keel: GENESIS.md (composition law, five
mantles, deployment map, campaign board), CLAUDE.md, DECISIONS.md, LEDGER.md, briefs
01–04. Recon: agents repo was bare; global CLAUDE.md and keybindings.json byte-identical
across all three accounts (hand-synced); simmy tiers found real in
`cap-mega/.claude/agents/` — format harvested into brief 01. Decided: D1–D6. Next:
summon 01 (Architect · fable-max); 04's spike is parallel-safe in any spare account.

---

**2026-08-02 · Architect (01)** — Landed the composition model: `canon/agents/` (full
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

**2026-08-02 · Digger (04 Stage A)** — Ran the symlink spike; findings appended to
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

**2026-08-03 · Grand Architect** — Reviewed 01 and 04 Stage A: both PASS. 01's charters
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

**2026-08-03 · Architect (02)** — Landed the work doctrine: `canon/work/DOCTRINE.md` —
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

**2026-08-03 · Architect (03)** — Minted `canon/CLAUDE.md`, the global file: the 59-line
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

**2026-08-03 · Builder (04 Stage B)** — Built the sync tooling: `sync/deploy` (bootstrap
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

**2026-08-03 · Grand Architect** — Reviewed batch 2: 02, 03, 04B all PASS. 02's doctrine
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

**2026-08-03 · Grand Architect** — Deliberated mantle universality (the bob-mount case):
no sixth "fixer" mantle — the harvest law kills it (no birthplace; the global CLAUDE.md
already is the fixer charter). The gap was one sentence of law, not a charter: cut
**D26 ✓ — the null mantle** into `canon/mantles/README.md`. Session-sized work wears no
mantle; the boundary test is succession/coordination; tiers are universal, mantles are
not; a bare session holding campaign-sized work says so and stops. Changed: mantles
README + DECISIONS. Decided: D26. Next: bob mount gets a bare session (opus-high,
in-repo); v2 (retrofits) still awaits Felix's word.

---

**2026-08-04 · Grand Architect** — Keel laid for **snappy** (cap-mega: Felix's "binary
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

**2026-08-04 · Architect** — Felix's memory question settled: do account memories sync —
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

**2026-08-05 · Architect (05)** — Snappy's batch-1 saturation post-mortem gauged for
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

**2026-08-05 · Grand Architect (05)** — Ran the saturation harvest. Birthplaces read
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

**2026-08-06 · Grand Architect** — Laid the keel for **manny**, the MegaCap User Manual
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

**2026-08-06 · Grand Architect** — Laid the keel for **v2 — the retrofits** (GENESIS §8's
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

**2026-08-06 · Architect (07)** — simmy retrofit executed to its DoD, all boxes checked
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

**2026-08-06 · Architect (08 cut)** — the summon rig designed and cut as board row 08:
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

**2026-08-06 · Architect (08 riders)** — D35 cut on Felix's mid-flight evidence and
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

**2026-08-06 · Architect (06)** — hexwright retrofit LANDED: live surfaces speak canon
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

**2026-08-06 · Architect (08 panel)** — D35 amended in place (Felix's call, his entry,
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

**2026-08-06 · Builder (08)** — the summon rig built and LANDED to the amended brief:
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

**2026-08-06 · Architect (09 cut)** — v1.1 cut from Felix's first live day on the rig
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

**2026-08-06 · Architect (08 closeout tending)** — Felix added the dotfiles source line
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

**2026-08-06 · Builder (09)** — summon rig v1.1 LANDED: `Ctrl-G Enter` refires in 2 keys,
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

**2026-08-06 · Architect (09 review)** — Board trued after row 09. D36 marked ✓ Felix
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

**2026-08-06 · Architect (09 review, addendum)** — Felix named the system: **the
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

**2026-08-07 · Grand Architect (the Guild)** — Felix's second foundational summons
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
