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
